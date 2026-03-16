from fastapi import APIRouter, Depends, HTTPException, status, Request, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
from datetime import datetime, timezone, timedelta
from app.database import get_db
from app.models.user import User, UserStatus, UserRole, RefreshToken
from app.models.subscription import UserSubscription, SubscriptionStatus, BillingCycle
from app.schemas.user import (
    UserRegister, UserLogin, Token, RefreshTokenRequest,
    UserResponse, ForgotPassword, ResetPassword, ChangePassword
)
from app.services.auth_service import (
    hash_password, verify_password,
    create_access_token, create_refresh_token,
    verify_refresh_token, token_expires_in
)
from app.services.email_service import send_verification_email, send_password_reset_email
from app.utils.dependencies import get_current_user, get_client_ip
from app.utils.responses import success_response
import uuid
import secrets

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", status_code=201)
async def register(
    payload: UserRegister,
    background_tasks: BackgroundTasks,
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    # Check email duplicate
    existing = await db.execute(select(User).where(User.email == payload.email))
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Email already registered")

    # Check username duplicate
    existing_uname = await db.execute(select(User).where(User.username == payload.username))
    if existing_uname.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Username already taken")

    verify_token = secrets.token_urlsafe(32)
    user = User(
        email=payload.email,
        username=payload.username,
        mobile_number=payload.mobile_number,
        hashed_password=hash_password(payload.password),
        role=UserRole.USER,
        status=UserStatus.ACTIVE,  # set PENDING if email verify required
        email_verify_token=verify_token,
    )
    db.add(user)
    await db.flush()

    # Assign free plan
    free_plan = await db.execute(
        select(__import__("app.models.subscription", fromlist=["Plan"]).Plan)
        .where(__import__("app.models.subscription", fromlist=["Plan"]).Plan.plan_type == "free")
    )
    free_plan = free_plan.scalar_one_or_none()
    if free_plan:
        sub = UserSubscription(
            user_id=user.id,
            plan_id=free_plan.id,
            status=SubscriptionStatus.ACTIVE,
            billing_cycle=BillingCycle.MONTHLY,
        )
        db.add(sub)

    await db.commit()
    background_tasks.add_task(send_verification_email, user.email, user.username, verify_token)

    return success_response("Registration successful. Please verify your email.", {"user_id": str(user.id)})


@router.post("/login", response_model=None)
async def login(
    payload: UserLogin,
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(User).where(User.email == payload.email, User.is_deleted == False)
    )
    user = result.scalar_one_or_none()

    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    if user.status == UserStatus.SUSPENDED:
        raise HTTPException(status_code=403, detail="Account suspended. Contact support.")
    if user.status == UserStatus.INACTIVE:
        raise HTTPException(status_code=403, detail="Account is inactive.")

    # Create tokens
    token_data = {"sub": str(user.id), "role": user.role.value, "email": user.email}
    access_token = create_access_token(token_data)
    refresh_token_str = create_refresh_token(token_data)

    # Persist refresh token
    rt = RefreshToken(
        user_id=user.id,
        token=refresh_token_str,
        expires_at=datetime.now(timezone.utc) + timedelta(days=30),
        ip_address=get_client_ip(request),
        user_agent=request.headers.get("user-agent"),
    )
    db.add(rt)

    # Update last login
    user.last_login = datetime.now(timezone.utc)
    await db.commit()

    return success_response("Login successful", {
        "access_token": access_token,
        "refresh_token": refresh_token_str,
        "token_type": "bearer",
        "expires_in": token_expires_in(),
        "user": {
            "id": str(user.id),
            "email": user.email,
            "username": user.username,
            "role": user.role.value,
            "full_name": user.full_name,
            "avatar_url": user.avatar_url,
            "is_email_verified": user.is_email_verified,
        },
    })


@router.post("/refresh")
async def refresh_token(
    payload: RefreshTokenRequest,
    db: AsyncSession = Depends(get_db),
):
    token_data = verify_refresh_token(payload.refresh_token)
    if not token_data:
        raise HTTPException(status_code=401, detail="Invalid refresh token")

    # Check DB record
    result = await db.execute(
        select(RefreshToken).where(
            RefreshToken.token == payload.refresh_token,
            RefreshToken.is_revoked == False,
        )
    )
    rt = result.scalar_one_or_none()
    if not rt:
        raise HTTPException(status_code=401, detail="Refresh token revoked or not found")

    if rt.expires_at.replace(tzinfo=timezone.utc) < datetime.now(timezone.utc):
        raise HTTPException(status_code=401, detail="Refresh token expired")

    user_result = await db.execute(select(User).where(User.id == rt.user_id))
    user = user_result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    new_access = create_access_token({"sub": str(user.id), "role": user.role.value, "email": user.email})
    return success_response("Token refreshed", {"access_token": new_access, "expires_in": token_expires_in()})


@router.post("/logout")
async def logout(
    payload: RefreshTokenRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    await db.execute(
        update(RefreshToken)
        .where(RefreshToken.token == payload.refresh_token, RefreshToken.user_id == current_user.id)
        .values(is_revoked=True)
    )
    await db.commit()
    return success_response("Logged out successfully")


@router.get("/verify-email")
async def verify_email(token: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email_verify_token == token))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=400, detail="Invalid verification token")

    user.is_email_verified = True
    user.email_verify_token = None
    user.status = UserStatus.ACTIVE
    await db.commit()
    return success_response("Email verified successfully")


@router.post("/forgot-password")
async def forgot_password(
    payload: ForgotPassword,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(User).where(User.email == payload.email))
    user = result.scalar_one_or_none()
    # Always return success to prevent email enumeration
    if user:
        token = secrets.token_urlsafe(32)
        user.password_reset_token = token
        user.password_reset_expires = datetime.now(timezone.utc) + timedelta(hours=1)
        await db.commit()
        background_tasks.add_task(send_password_reset_email, user.email, user.username, token)

    return success_response("If that email is registered, a reset link has been sent.")


@router.post("/reset-password")
async def reset_password(payload: ResetPassword, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.password_reset_token == payload.token))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=400, detail="Invalid reset token")
    if user.password_reset_expires < datetime.now(timezone.utc):
        raise HTTPException(status_code=400, detail="Reset token has expired")

    user.hashed_password = hash_password(payload.new_password)
    user.password_reset_token = None
    user.password_reset_expires = None
    await db.commit()
    return success_response("Password reset successfully")


@router.post("/change-password")
async def change_password(
    payload: ChangePassword,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if not verify_password(payload.current_password, current_user.hashed_password):
        raise HTTPException(status_code=400, detail="Current password is incorrect")

    current_user.hashed_password = hash_password(payload.new_password)
    await db.commit()
    return success_response("Password changed successfully")


@router.get("/me", response_model=None)
async def get_me(current_user: User = Depends(get_current_user)):
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
