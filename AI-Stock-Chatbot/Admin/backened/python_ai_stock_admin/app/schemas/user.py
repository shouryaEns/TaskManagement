from pydantic import BaseModel, EmailStr, field_validator, UUID4
from typing import Optional
from datetime import datetime
from app.models.user import UserRole, UserStatus
import re


# ── Register ──────────────────────────────────────────────────────

class UserRegister(BaseModel):
    email: EmailStr
    mobile_number: str
    username: str
    password: str

    @field_validator("mobile_number")
    @classmethod
    def validate_mobile(cls, v):
        if not re.match(r"^\d{10}$", v):
            raise ValueError("Mobile number must be exactly 10 digits")
        return v

    @field_validator("password")
    @classmethod
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters")
        if not re.search(r"[A-Z]", v):
            raise ValueError("Password must contain at least one uppercase letter")
        if not re.search(r"[0-9]", v):
            raise ValueError("Password must contain at least one digit")
        return v

    @field_validator("username")
    @classmethod
    def validate_username(cls, v):
        if not re.match(r"^[a-zA-Z0-9_]{3,30}$", v):
            raise ValueError("Username must be 3-30 alphanumeric characters or underscores")
        return v


# ── Login ─────────────────────────────────────────────────────────

class UserLogin(BaseModel):
    email: EmailStr
    password: str


# ── Tokens ────────────────────────────────────────────────────────

class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int  # seconds


class RefreshTokenRequest(BaseModel):
    refresh_token: str


# ── Response ──────────────────────────────────────────────────────

class UserResponse(BaseModel):
    id: UUID4
    email: str
    username: str
    mobile_number: Optional[str]
    full_name: Optional[str]
    avatar_url: Optional[str]
    bio: Optional[str]
    role: UserRole
    status: UserStatus
    is_email_verified: bool
    created_at: datetime
    last_login: Optional[datetime]

    model_config = {"from_attributes": True}


class UserPublic(BaseModel):
    id: UUID4
    username: str
    full_name: Optional[str]
    avatar_url: Optional[str]
    role: UserRole

    model_config = {"from_attributes": True}


# ── Update ────────────────────────────────────────────────────────

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    mobile_number: Optional[str] = None
    bio: Optional[str] = None
    avatar_url: Optional[str] = None

    @field_validator("mobile_number")
    @classmethod
    def validate_mobile(cls, v):
        if v and not re.match(r"^\d{10}$", v):
            raise ValueError("Mobile number must be exactly 10 digits")
        return v


class ChangePassword(BaseModel):
    current_password: str
    new_password: str

    @field_validator("new_password")
    @classmethod
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters")
        if not re.search(r"[A-Z]", v):
            raise ValueError("Password must contain at least one uppercase letter")
        if not re.search(r"[0-9]", v):
            raise ValueError("Password must contain at least one digit")
        return v


class ForgotPassword(BaseModel):
    email: EmailStr


class ResetPassword(BaseModel):
    token: str
    new_password: str


# ── Admin user management ─────────────────────────────────────────

class AdminCreateUser(BaseModel):
    email: EmailStr
    username: str
    mobile_number: str
    password: str
    role: UserRole = UserRole.USER
    full_name: Optional[str] = None


class AdminUpdateUser(BaseModel):
    full_name: Optional[str] = None
    mobile_number: Optional[str] = None
    role: Optional[UserRole] = None
    status: Optional[UserStatus] = None
    is_email_verified: Optional[bool] = None
