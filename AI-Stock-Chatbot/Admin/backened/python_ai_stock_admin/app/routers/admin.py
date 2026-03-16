from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, update, and_
from datetime import datetime, timezone
from app.database import get_db
from app.models.user import User, UserRole, UserStatus
from app.models.chat import ChatSession, ChatMessage
from app.models.audit import AuditLog, Notification, NotificationType
from app.schemas.user import AdminCreateUser, AdminUpdateUser
from app.services.auth_service import hash_password
from app.utils.dependencies import require_admin, get_current_user
from app.utils.responses import success_response, paginate
import uuid

router = APIRouter(prefix="/admin", tags=["Admin"])


# ── User Management ───────────────────────────────────────────────

@router.get("/users")
async def list_users(
    page: int = 1,
    per_page: int = 20,
    role: str = None,
    status: str = None,
    search: str = None,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(require_admin),
):
    query = select(User).where(User.is_deleted == False)

    if role:
        query = query.where(User.role == role)
    if status:
        query = query.where(User.status == status)
    if search:
        query = query.where(
            User.email.ilike(f"%{search}%") |
            User.username.ilike(f"%{search}%") |
            User.full_name.ilike(f"%{search}%")
        )

    count_q = select(func.count()).select_from(query.subquery())
    total = (await db.execute(count_q)).scalar()

    query = query.order_by(User.created_at.desc()).offset((page - 1) * per_page).limit(per_page)
    result = await db.execute(query)
    users = result.scalars().all()

    return success_response("Users fetched", paginate(
        items=[
            {
                "id": str(u.id), "email": u.email, "username": u.username,
                "full_name": u.full_name, "mobile_number": u.mobile_number,
                "role": u.role.value, "status": u.status.value,
                "is_email_verified": u.is_email_verified,
                "created_at": str(u.created_at),
                "last_login": str(u.last_login) if u.last_login else None,
            }
            for u in users
        ],
        total=total, page=page, per_page=per_page,
    ))


@router.get("/users/{user_id}")
async def get_user_detail(
    user_id: str,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(require_admin),
):
    result = await db.execute(select(User).where(User.id == user_id, User.is_deleted == False))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return success_response("User fetched", {
        "id": str(user.id), "email": user.email, "username": user.username,
        "full_name": user.full_name, "mobile_number": user.mobile_number,
        "bio": user.bio, "avatar_url": user.avatar_url,
        "role": user.role.value, "status": user.status.value,
        "is_email_verified": user.is_email_verified,
        "created_at": str(user.created_at),
        "last_login": str(user.last_login) if user.last_login else None,
    })


@router.post("/users", status_code=201)
async def create_user(
    payload: AdminCreateUser,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(require_admin),
):
    # Admins can only create USER role; only superadmin creates admins
    if payload.role == UserRole.SUPERADMIN:
        raise HTTPException(status_code=403, detail="Cannot create superadmin")
    if payload.role == UserRole.ADMIN and admin.role != UserRole.SUPERADMIN:
        raise HTTPException(status_code=403, detail="Only superadmin can create admin users")

    exists = await db.execute(select(User).where(User.email == payload.email))
    if exists.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Email already exists")

    user = User(
        email=payload.email,
        username=payload.username,
        mobile_number=payload.mobile_number,
        full_name=payload.full_name,
        hashed_password=hash_password(payload.password),
        role=payload.role,
        status=UserStatus.ACTIVE,
        is_email_verified=True,
        created_by=admin.id,
    )
    db.add(user)
    await db.commit()

    await _log(db, admin.id, "USER_CREATED", "users", str(user.id), detail=f"Created by {admin.email}")
    return success_response("User created", {"id": str(user.id)})


@router.patch("/users/{user_id}")
async def update_user(
    user_id: str,
    payload: AdminUpdateUser,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(require_admin),
):
    result = await db.execute(select(User).where(User.id == user_id, User.is_deleted == False))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Admins cannot modify superadmins
    if user.role == UserRole.SUPERADMIN and admin.role != UserRole.SUPERADMIN:
        raise HTTPException(status_code=403, detail="Cannot modify superadmin")

    old_values = {"role": user.role.value, "status": user.status.value}
    for field, value in payload.model_dump(exclude_none=True).items():
        setattr(user, field, value)

    await db.commit()
    await _log(db, admin.id, "USER_UPDATED", "users", user_id, old_values=old_values)
    return success_response("User updated")


@router.delete("/users/{user_id}")
async def soft_delete_user(
    user_id: str,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(require_admin),
):
    result = await db.execute(select(User).where(User.id == user_id, User.is_deleted == False))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if user.role == UserRole.SUPERADMIN:
        raise HTTPException(status_code=403, detail="Cannot delete superadmin")

    user.is_deleted = True
    user.deleted_at = datetime.now(timezone.utc)
    user.status = UserStatus.INACTIVE
    await db.commit()
    await _log(db, admin.id, "USER_DELETED", "users", user_id)
    return success_response("User deleted")


@router.patch("/users/{user_id}/suspend")
async def suspend_user(
    user_id: str,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(require_admin),
):
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if user.role in [UserRole.SUPERADMIN, UserRole.ADMIN] and admin.role != UserRole.SUPERADMIN:
        raise HTTPException(status_code=403, detail="Insufficient permissions")

    user.status = UserStatus.SUSPENDED
    await db.commit()
    await _log(db, admin.id, "USER_SUSPENDED", "users", user_id)
    return success_response("User suspended")


@router.patch("/users/{user_id}/activate")
async def activate_user(
    user_id: str,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(require_admin),
):
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.status = UserStatus.ACTIVE
    await db.commit()
    await _log(db, admin.id, "USER_ACTIVATED", "users", user_id)
    return success_response("User activated")


# ── Chat Monitoring ───────────────────────────────────────────────

@router.get("/chats")
async def list_all_chats(
    page: int = 1,
    per_page: int = 20,
    user_id: str = None,
    flagged_only: bool = False,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(require_admin),
):
    query = select(ChatSession)
    if user_id:
        query = query.where(ChatSession.user_id == user_id)

    count_q = select(func.count()).select_from(query.subquery())
    total = (await db.execute(count_q)).scalar()

    query = query.order_by(ChatSession.created_at.desc()).offset((page - 1) * per_page).limit(per_page)
    result = await db.execute(query)
    sessions = result.scalars().all()

    return success_response("Chats fetched", paginate(
        items=[
            {
                "id": str(s.id), "user_id": str(s.user_id),
                "title": s.title, "message_count": s.message_count,
                "created_at": str(s.created_at),
            }
            for s in sessions
        ],
        total=total, page=page, per_page=per_page,
    ))


@router.get("/chats/flagged-messages")
async def get_flagged_messages(
    page: int = 1,
    per_page: int = 20,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(require_admin),
):
    query = select(ChatMessage).where(ChatMessage.is_flagged == True)
    total = (await db.execute(select(func.count()).select_from(query.subquery()))).scalar()
    result = await db.execute(query.order_by(ChatMessage.created_at.desc()).offset((page - 1) * per_page).limit(per_page))
    msgs = result.scalars().all()

    return success_response("Flagged messages fetched", paginate(
        items=[
            {
                "id": str(m.id), "session_id": str(m.session_id),
                "role": m.role.value, "content": m.content[:200],
                "flag_reason": m.flag_reason, "created_at": str(m.created_at),
            }
            for m in msgs
        ],
        total=total, page=page, per_page=per_page,
    ))


@router.patch("/chats/messages/{message_id}/flag")
async def flag_message(
    message_id: str,
    reason: str,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(require_admin),
):
    result = await db.execute(select(ChatMessage).where(ChatMessage.id == message_id))
    msg = result.scalar_one_or_none()
    if not msg:
        raise HTTPException(status_code=404, detail="Message not found")
    msg.is_flagged = True
    msg.flag_reason = reason
    await db.commit()
    return success_response("Message flagged")


# ── Bulk Notifications ────────────────────────────────────────────

@router.post("/notifications/broadcast")
async def broadcast_notification(
    title: str,
    body: str,
    notification_type: str = "system",
    target_role: str = None,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(require_admin),
):
    query = select(User).where(User.is_deleted == False, User.status == UserStatus.ACTIVE)
    if target_role:
        query = query.where(User.role == target_role)

    result = await db.execute(query)
    users = result.scalars().all()

    notifications = [
        Notification(
            user_id=u.id,
            type=NotificationType.SYSTEM,
            title=title,
            body=body,
        )
        for u in users
    ]
    db.add_all(notifications)
    await db.commit()
    await _log(db, admin.id, "NOTIFICATION_BROADCAST", detail=f"Sent to {len(users)} users")
    return success_response(f"Notification sent to {len(users)} users")


# ── Audit Logs ────────────────────────────────────────────────────

@router.get("/audit-logs")
async def get_audit_logs(
    page: int = 1,
    per_page: int = 50,
    action: str = None,
    user_id: str = None,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(require_admin),
):
    query = select(AuditLog)
    if action:
        query = query.where(AuditLog.action == action)
    if user_id:
        query = query.where(AuditLog.user_id == user_id)

    total = (await db.execute(select(func.count()).select_from(query.subquery()))).scalar()
    result = await db.execute(
        query.order_by(AuditLog.created_at.desc()).offset((page - 1) * per_page).limit(per_page)
    )
    logs = result.scalars().all()

    return success_response("Audit logs fetched", paginate(
        items=[
            {
                "id": str(l.id), "user_id": str(l.user_id) if l.user_id else None,
                "action": l.action, "resource": l.resource,
                "resource_id": l.resource_id, "ip_address": l.ip_address,
                "status": l.status, "detail": l.detail,
                "created_at": str(l.created_at),
            }
            for l in logs
        ],
        total=total, page=page, per_page=per_page,
    ))


# ── Helper ────────────────────────────────────────────────────────

async def _log(db, user_id, action, resource=None, resource_id=None,
               old_values=None, new_values=None, detail=None):
    log = AuditLog(
        user_id=user_id, action=action, resource=resource,
        resource_id=resource_id, old_values=old_values,
        new_values=new_values, detail=detail,
    )
    db.add(log)
    await db.flush()
