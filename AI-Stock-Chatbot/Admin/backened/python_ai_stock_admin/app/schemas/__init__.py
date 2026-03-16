from pydantic import BaseModel, UUID4
from typing import Optional, List, Dict, Any
from datetime import datetime
from app.models.chat import MessageRole
from app.models.watchlist import AlertType, AlertStatus
from decimal import Decimal


# ── Chat ──────────────────────────────────────────────────────────

class ChatMessageResponse(BaseModel):
    id: UUID4
    role: MessageRole
    content: str
    tokens_used: Optional[int]
    response_time_ms: Optional[float]
    is_flagged: bool
    created_at: datetime

    model_config = {"from_attributes": True}


class ChatSessionResponse(BaseModel):
    id: UUID4
    title: Optional[str]
    is_active: bool
    message_count: int
    last_message_at: Optional[datetime]
    created_at: datetime

    model_config = {"from_attributes": True}


class ChatSessionDetail(ChatSessionResponse):
    messages: List[ChatMessageResponse] = []


class FlagMessageRequest(BaseModel):
    flag_reason: str


# ── Watchlist ─────────────────────────────────────────────────────

class WatchlistCreate(BaseModel):
    name: str = "My Watchlist"
    description: Optional[str] = None


class WatchlistItemCreate(BaseModel):
    symbol: str
    co_code: Optional[int] = None
    exchange: Optional[str] = None
    notes: Optional[str] = None


class WatchlistItemResponse(BaseModel):
    id: UUID4
    symbol: str
    co_code: Optional[int]
    exchange: Optional[str]
    notes: Optional[str]
    added_at: datetime

    model_config = {"from_attributes": True}


class WatchlistResponse(BaseModel):
    id: UUID4
    name: str
    description: Optional[str]
    is_default: bool
    created_at: datetime
    items: List[WatchlistItemResponse] = []

    model_config = {"from_attributes": True}


# ── Price Alerts ──────────────────────────────────────────────────

class PriceAlertCreate(BaseModel):
    symbol: str
    exchange: Optional[str] = None
    alert_type: AlertType
    target_value: Decimal
    message: Optional[str] = None


class PriceAlertResponse(BaseModel):
    id: UUID4
    symbol: str
    exchange: Optional[str]
    alert_type: AlertType
    target_value: Decimal
    status: AlertStatus
    message: Optional[str]
    triggered_at: Optional[datetime]
    triggered_price: Optional[Decimal]
    created_at: datetime

    model_config = {"from_attributes": True}


# ── Notifications ─────────────────────────────────────────────────

class NotificationResponse(BaseModel):
    id: UUID4
    type: str
    title: str
    body: str
    is_read: bool
    read_at: Optional[datetime]
    extra_data: Dict[str, Any]
    created_at: datetime

    model_config = {"from_attributes": True}


# ── Audit Log ─────────────────────────────────────────────────────

class AuditLogResponse(BaseModel):
    id: UUID4
    user_id: Optional[UUID4]
    action: str
    resource: Optional[str]
    resource_id: Optional[str]
    ip_address: Optional[str]
    status: str
    detail: Optional[str]
    created_at: datetime

    model_config = {"from_attributes": True}


# ── Common ────────────────────────────────────────────────────────

class PaginatedResponse(BaseModel):
    items: List[Any]
    total: int
    page: int
    per_page: int
    total_pages: int


class APIResponse(BaseModel):
    success: bool
    message: str
    data: Optional[Any] = None
