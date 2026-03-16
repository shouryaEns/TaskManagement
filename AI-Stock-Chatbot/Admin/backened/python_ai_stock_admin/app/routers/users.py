from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import get_db
from app.models.user import User
from app.schemas.user import UserUpdate
from app.utils.dependencies import get_current_user
from app.utils.responses import success_response

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/profile")
async def get_profile(current_user: User = Depends(get_current_user)):
    return success_response("Profile fetched", {
        "id": str(current_user.id),
        "email": current_user.email,
        "username": current_user.username,
        "mobile_number": current_user.mobile_number,
        "full_name": current_user.full_name,
        "avatar_url": current_user.avatar_url,
        "bio": current_user.bio,
        "role": current_user.role.value,
        "status": current_user.status.value,
        "is_email_verified": current_user.is_email_verified,
        "created_at": str(current_user.created_at),
        "last_login": str(current_user.last_login),
    })


@router.patch("/profile")
async def update_profile(
    payload: UserUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    for field, value in payload.model_dump(exclude_none=True).items():
        setattr(current_user, field, value)
    await db.commit()
    return success_response("Profile updated successfully")


@router.get("/subscription")
async def get_my_subscription(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    from app.models.subscription import UserSubscription, Plan
    from sqlalchemy.orm import selectinload
    result = await db.execute(
        select(UserSubscription)
        .options(selectinload(UserSubscription.plan))
        .where(UserSubscription.user_id == current_user.id)
    )
    sub = result.scalar_one_or_none()
    if not sub:
        raise HTTPException(status_code=404, detail="No subscription found")

    return success_response("Subscription fetched", {
        "id": str(sub.id),
        "plan": {
            "name": sub.plan.name,
            "plan_type": sub.plan.plan_type.value,
            "monthly_price": float(sub.plan.monthly_price),
            "max_chat_messages_per_day": sub.plan.max_chat_messages_per_day,
            "max_watchlist_stocks": sub.plan.max_watchlist_stocks,
            "has_ai_analysis": sub.plan.has_ai_analysis,
            "has_portfolio_tracking": sub.plan.has_portfolio_tracking,
        },
        "status": sub.status.value,
        "expires_at": str(sub.expires_at) if sub.expires_at else None,
    })


@router.get("/notifications")
async def get_notifications(
    page: int = 1,
    per_page: int = 20,
    unread_only: bool = False,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    from app.models.audit import Notification
    from sqlalchemy import func
    query = select(Notification).where(Notification.user_id == current_user.id)
    if unread_only:
        query = query.where(Notification.is_read == False)

    count_result = await db.execute(select(func.count()).select_from(query.subquery()))
    total = count_result.scalar()

    query = query.order_by(Notification.created_at.desc()).offset((page - 1) * per_page).limit(per_page)
    result = await db.execute(query)
    notifications = result.scalars().all()

    return success_response("Notifications fetched", {
        "items": [
            {
                "id": str(n.id),
                "type": n.type.value,
                "title": n.title,
                "body": n.body,
                "is_read": n.is_read,
                "created_at": str(n.created_at),
            }
            for n in notifications
        ],
        "total": total,
        "page": page,
        "per_page": per_page,
    })


@router.patch("/notifications/{notification_id}/read")
async def mark_notification_read(
    notification_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    from app.models.audit import Notification
    from datetime import datetime, timezone
    result = await db.execute(
        select(Notification).where(
            Notification.id == notification_id,
            Notification.user_id == current_user.id
        )
    )
    n = result.scalar_one_or_none()
    if not n:
        raise HTTPException(status_code=404, detail="Notification not found")

    n.is_read = True
    n.read_at = datetime.now(timezone.utc)
    await db.commit()
    return success_response("Marked as read")


@router.patch("/notifications/read-all")
async def mark_all_read(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    from app.models.audit import Notification
    from sqlalchemy import update
    from datetime import datetime, timezone
    await db.execute(
        update(Notification)
        .where(Notification.user_id == current_user.id, Notification.is_read == False)
        .values(is_read=True, read_at=datetime.now(timezone.utc))
    )
    await db.commit()
    return success_response("All notifications marked as read")
