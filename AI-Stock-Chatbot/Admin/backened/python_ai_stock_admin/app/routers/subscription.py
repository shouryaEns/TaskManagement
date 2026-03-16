from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from datetime import datetime, timezone, timedelta
from app.database import get_db
from app.models.user import User
from app.models.subscription import Plan, UserSubscription, SubscriptionStatus, BillingCycle
from app.schemas.subscription import SubscribeRequest
from app.utils.dependencies import get_current_user
from app.utils.responses import success_response

router = APIRouter(prefix="/subscriptions", tags=["Subscriptions"])


@router.get("/plans")
async def get_public_plans(db: AsyncSession = Depends(get_db)):
    """Public endpoint — no auth required."""
    result = await db.execute(select(Plan).where(Plan.is_active == True).order_by(Plan.monthly_price))
    plans = result.scalars().all()
    return success_response("Plans fetched", [
        {
            "id": str(p.id), "name": p.name, "plan_type": p.plan_type.value,
            "description": p.description,
            "monthly_price": float(p.monthly_price), "yearly_price": float(p.yearly_price),
            "max_chat_messages_per_day": p.max_chat_messages_per_day,
            "max_watchlist_stocks": p.max_watchlist_stocks,
            "max_price_alerts": p.max_price_alerts,
            "has_ai_analysis": p.has_ai_analysis,
            "has_portfolio_tracking": p.has_portfolio_tracking,
            "has_advanced_charts": p.has_advanced_charts,
            "has_news_alerts": p.has_news_alerts,
            "has_api_access": p.has_api_access,
            "features": p.features,
        }
        for p in plans
    ])


@router.post("/subscribe")
async def subscribe(
    payload: SubscribeRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    plan_result = await db.execute(select(Plan).where(Plan.id == payload.plan_id, Plan.is_active == True))
    plan = plan_result.scalar_one_or_none()
    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found")

    # Calculate expiry
    if payload.billing_cycle == BillingCycle.YEARLY:
        expires_at = datetime.now(timezone.utc) + timedelta(days=365)
        amount = float(plan.yearly_price)
    else:
        expires_at = datetime.now(timezone.utc) + timedelta(days=30)
        amount = float(plan.monthly_price)

    sub_result = await db.execute(
        select(UserSubscription).where(UserSubscription.user_id == current_user.id)
    )
    sub = sub_result.scalar_one_or_none()

    if sub:
        sub.plan_id = plan.id
        sub.status = SubscriptionStatus.ACTIVE
        sub.billing_cycle = payload.billing_cycle
        sub.expires_at = expires_at
        sub.payment_reference = payload.payment_reference
        sub.payment_gateway = payload.payment_gateway
        sub.amount_paid = amount
    else:
        sub = UserSubscription(
            user_id=current_user.id,
            plan_id=plan.id,
            status=SubscriptionStatus.ACTIVE,
            billing_cycle=payload.billing_cycle,
            expires_at=expires_at,
            payment_reference=payload.payment_reference,
            payment_gateway=payload.payment_gateway,
            amount_paid=amount,
        )
        db.add(sub)

    await db.commit()
    return success_response(f"Subscribed to {plan.name}", {
        "plan": plan.name, "expires_at": str(expires_at), "amount_paid": amount,
    })


@router.post("/cancel")
async def cancel_subscription(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(UserSubscription).where(UserSubscription.user_id == current_user.id)
    )
    sub = result.scalar_one_or_none()
    if not sub:
        raise HTTPException(status_code=404, detail="No active subscription")

    sub.status = SubscriptionStatus.CANCELLED
    sub.cancelled_at = datetime.now(timezone.utc)
    await db.commit()
    return success_response("Subscription cancelled")
