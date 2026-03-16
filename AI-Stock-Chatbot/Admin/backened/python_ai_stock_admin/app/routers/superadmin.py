from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, text
from datetime import datetime, timezone, timedelta
from app.database import get_db
from app.models.user import User, UserRole, UserStatus
from app.models.subscription import Plan, UserSubscription, PlanType
from app.models.chat import ChatSession, ChatMessage
from app.models.audit import AuditLog
from app.schemas.subscription import PlanCreate, PlanUpdate
from app.schemas.user import AdminCreateUser
from app.services.auth_service import hash_password
from app.utils.dependencies import require_superadmin
from app.utils.responses import success_response

router = APIRouter(prefix="/superadmin", tags=["SuperAdmin"])


# ── Dashboard Stats ───────────────────────────────────────────────

@router.get("/dashboard")
async def dashboard_stats(
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_superadmin),
):
    total_users = (await db.execute(select(func.count()).where(User.is_deleted == False))).scalar()
    active_users = (await db.execute(select(func.count()).where(User.status == UserStatus.ACTIVE, User.is_deleted == False))).scalar()
    suspended_users = (await db.execute(select(func.count()).where(User.status == UserStatus.SUSPENDED))).scalar()
    total_admins = (await db.execute(select(func.count()).where(User.role == UserRole.ADMIN))).scalar()
    total_chats = (await db.execute(select(func.count(ChatSession.id)))).scalar()
    total_messages = (await db.execute(select(func.count(ChatMessage.id)))).scalar()
    flagged_messages = (await db.execute(select(func.count()).where(ChatMessage.is_flagged == True))).scalar()

    # New users last 7 days
    week_ago = datetime.now(timezone.utc) - timedelta(days=7)
    new_users_week = (await db.execute(
        select(func.count()).where(User.created_at >= week_ago, User.is_deleted == False)
    )).scalar()

    return success_response("Dashboard stats", {
        "users": {
            "total": total_users,
            "active": active_users,
            "suspended": suspended_users,
            "admins": total_admins,
            "new_this_week": new_users_week,
        },
        "chats": {
            "total_sessions": total_chats,
            "total_messages": total_messages,
            "flagged_messages": flagged_messages,
        },
    })


# ── Admin Management ──────────────────────────────────────────────

@router.get("/admins")
async def list_admins(
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_superadmin),
):
    result = await db.execute(
        select(User).where(User.role == UserRole.ADMIN, User.is_deleted == False)
        .order_by(User.created_at.desc())
    )
    admins = result.scalars().all()
    return success_response("Admins fetched", [
        {
            "id": str(a.id), "email": a.email, "username": a.username,
            "full_name": a.full_name, "status": a.status.value,
            "created_at": str(a.created_at), "last_login": str(a.last_login) if a.last_login else None,
        }
        for a in admins
    ])


@router.post("/admins", status_code=201)
async def create_admin(
    payload: AdminCreateUser,
    db: AsyncSession = Depends(get_db),
    superadmin: User = Depends(require_superadmin),
):
    exists = await db.execute(select(User).where(User.email == payload.email))
    if exists.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Email already exists")

    admin = User(
        email=payload.email,
        username=payload.username,
        mobile_number=payload.mobile_number,
        full_name=payload.full_name,
        hashed_password=hash_password(payload.password),
        role=UserRole.ADMIN,
        status=UserStatus.ACTIVE,
        is_email_verified=True,
        created_by=superadmin.id,
    )
    db.add(admin)
    await db.commit()
    return success_response("Admin created", {"id": str(admin.id)})


@router.delete("/admins/{admin_id}")
async def remove_admin(
    admin_id: str,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_superadmin),
):
    result = await db.execute(select(User).where(User.id == admin_id, User.role == UserRole.ADMIN))
    admin = result.scalar_one_or_none()
    if not admin:
        raise HTTPException(status_code=404, detail="Admin not found")

    admin.role = UserRole.USER  # Demote to user instead of deleting
    await db.commit()
    return success_response("Admin demoted to user")


# ── Subscription Plans ────────────────────────────────────────────

@router.get("/plans")
async def list_plans(
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_superadmin),
):
    result = await db.execute(select(Plan).order_by(Plan.monthly_price))
    plans = result.scalars().all()
    return success_response("Plans fetched", [
        {
            "id": str(p.id), "name": p.name, "plan_type": p.plan_type.value,
            "monthly_price": float(p.monthly_price), "yearly_price": float(p.yearly_price),
            "max_chat_messages_per_day": p.max_chat_messages_per_day,
            "max_watchlist_stocks": p.max_watchlist_stocks,
            "max_price_alerts": p.max_price_alerts,
            "has_ai_analysis": p.has_ai_analysis,
            "has_portfolio_tracking": p.has_portfolio_tracking,
            "has_advanced_charts": p.has_advanced_charts,
            "has_api_access": p.has_api_access,
            "is_active": p.is_active,
            "features": p.features,
        }
        for p in plans
    ])


@router.post("/plans", status_code=201)
async def create_plan(
    payload: PlanCreate,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_superadmin),
):
    exists = await db.execute(select(Plan).where(Plan.plan_type == payload.plan_type))
    if exists.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Plan type already exists")

    plan = Plan(**payload.model_dump())
    db.add(plan)
    await db.commit()
    return success_response("Plan created", {"id": str(plan.id)})


@router.patch("/plans/{plan_id}")
async def update_plan(
    plan_id: str,
    payload: PlanUpdate,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_superadmin),
):
    result = await db.execute(select(Plan).where(Plan.id == plan_id))
    plan = result.scalar_one_or_none()
    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found")

    for field, value in payload.model_dump(exclude_none=True).items():
        setattr(plan, field, value)
    await db.commit()
    return success_response("Plan updated")


@router.delete("/plans/{plan_id}")
async def delete_plan(
    plan_id: str,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_superadmin),
):
    result = await db.execute(select(Plan).where(Plan.id == plan_id))
    plan = result.scalar_one_or_none()
    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found")
    if plan.plan_type == PlanType.FREE:
        raise HTTPException(status_code=400, detail="Cannot delete the free plan")

    plan.is_active = False  # Soft delete
    await db.commit()
    return success_response("Plan deactivated")


# ── User Subscription Management ─────────────────────────────────

@router.patch("/users/{user_id}/subscription")
async def change_user_subscription(
    user_id: str,
    plan_id: str,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_superadmin),
):
    user_result = await db.execute(select(User).where(User.id == user_id))
    user = user_result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    plan_result = await db.execute(select(Plan).where(Plan.id == plan_id, Plan.is_active == True))
    plan = plan_result.scalar_one_or_none()
    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found")

    sub_result = await db.execute(select(UserSubscription).where(UserSubscription.user_id == user_id))
    sub = sub_result.scalar_one_or_none()
    if sub:
        sub.plan_id = plan.id
    else:
        sub = UserSubscription(user_id=user_id, plan_id=plan.id)
        db.add(sub)

    await db.commit()
    return success_response(f"Subscription updated to {plan.name}")


# ── System Settings ───────────────────────────────────────────────

@router.get("/system/health")
async def system_health(
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_superadmin),
):
    try:
        await db.execute(text("SELECT 1"))
        db_status = "healthy"
    except Exception:
        db_status = "unhealthy"

    return success_response("System health", {
        "database": db_status,
        "api": "healthy",
        "timestamp": str(datetime.now(timezone.utc)),
    })
