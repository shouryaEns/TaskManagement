from pydantic import BaseModel, UUID4
from typing import Optional, Dict, Any
from datetime import datetime
from decimal import Decimal
from app.models.subscription import PlanType, BillingCycle, SubscriptionStatus


class PlanCreate(BaseModel):
    name: str
    plan_type: PlanType
    description: Optional[str] = None
    monthly_price: Decimal = Decimal("0")
    yearly_price: Decimal = Decimal("0")
    max_chat_messages_per_day: int = 10
    max_watchlist_stocks: int = 5
    max_price_alerts: int = 3
    has_ai_analysis: bool = False
    has_portfolio_tracking: bool = False
    has_advanced_charts: bool = False
    has_news_alerts: bool = False
    has_api_access: bool = False
    features: Dict[str, Any] = {}


class PlanUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    monthly_price: Optional[Decimal] = None
    yearly_price: Optional[Decimal] = None
    max_chat_messages_per_day: Optional[int] = None
    max_watchlist_stocks: Optional[int] = None
    max_price_alerts: Optional[int] = None
    has_ai_analysis: Optional[bool] = None
    has_portfolio_tracking: Optional[bool] = None
    has_advanced_charts: Optional[bool] = None
    has_news_alerts: Optional[bool] = None
    has_api_access: Optional[bool] = None
    features: Optional[Dict[str, Any]] = None
    is_active: Optional[bool] = None


class PlanResponse(BaseModel):
    id: UUID4
    name: str
    plan_type: PlanType
    description: Optional[str]
    monthly_price: Decimal
    yearly_price: Decimal
    max_chat_messages_per_day: int
    max_watchlist_stocks: int
    max_price_alerts: int
    has_ai_analysis: bool
    has_portfolio_tracking: bool
    has_advanced_charts: bool
    has_news_alerts: bool
    has_api_access: bool
    features: Dict[str, Any]
    is_active: bool
    created_at: datetime

    model_config = {"from_attributes": True}


class SubscriptionResponse(BaseModel):
    id: UUID4
    plan: PlanResponse
    status: SubscriptionStatus
    billing_cycle: BillingCycle
    started_at: datetime
    expires_at: Optional[datetime]
    trial_ends_at: Optional[datetime]
    amount_paid: Decimal

    model_config = {"from_attributes": True}


class SubscribeRequest(BaseModel):
    plan_id: UUID4
    billing_cycle: BillingCycle = BillingCycle.MONTHLY
    payment_reference: Optional[str] = None
    payment_gateway: Optional[str] = None
