from sqlalchemy import Column, String, Boolean, DateTime, Enum, Numeric, Integer, Text, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base
import uuid
import enum


class PlanType(str, enum.Enum):
    FREE = "free"
    BASIC = "basic"
    PRO = "pro"
    ENTERPRISE = "enterprise"


class BillingCycle(str, enum.Enum):
    MONTHLY = "monthly"
    YEARLY = "yearly"


class SubscriptionStatus(str, enum.Enum):
    ACTIVE = "active"
    EXPIRED = "expired"
    CANCELLED = "cancelled"
    TRIAL = "trial"


class Plan(Base):
    __tablename__ = "plans"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(100), nullable=False)
    plan_type = Column(Enum(PlanType), unique=True, nullable=False)
    description = Column(Text, nullable=True)

    # Pricing
    monthly_price = Column(Numeric(10, 2), default=0)
    yearly_price = Column(Numeric(10, 2), default=0)

    # Limits
    max_chat_messages_per_day = Column(Integer, default=10)
    max_watchlist_stocks = Column(Integer, default=5)
    max_price_alerts = Column(Integer, default=3)
    has_ai_analysis = Column(Boolean, default=False)
    has_portfolio_tracking = Column(Boolean, default=False)
    has_advanced_charts = Column(Boolean, default=False)
    has_news_alerts = Column(Boolean, default=False)
    has_api_access = Column(Boolean, default=False)

    # Extra features as JSON
    features = Column(JSONB, default={})

    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    subscriptions = relationship("UserSubscription", back_populates="plan")


class UserSubscription(Base):
    __tablename__ = "user_subscriptions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    plan_id = Column(UUID(as_uuid=True), ForeignKey("plans.id"), nullable=False)
    status = Column(Enum(SubscriptionStatus), default=SubscriptionStatus.TRIAL)
    billing_cycle = Column(Enum(BillingCycle), default=BillingCycle.MONTHLY)

    started_at = Column(DateTime(timezone=True), server_default=func.now())
    expires_at = Column(DateTime(timezone=True), nullable=True)
    cancelled_at = Column(DateTime(timezone=True), nullable=True)
    trial_ends_at = Column(DateTime(timezone=True), nullable=True)

    # Payment info (store reference, not card details)
    payment_gateway = Column(String(50), nullable=True)  # razorpay, stripe
    payment_reference = Column(String(255), nullable=True)
    amount_paid = Column(Numeric(10, 2), default=0)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    user = relationship("User", back_populates="subscription")
    plan = relationship("Plan", back_populates="subscriptions")
