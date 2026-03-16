from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.config import settings
from app.database import init_db
from app.middleware.audit_middleware import AuditMiddleware
from app.routers import auth, users, admin, superadmin, watchlist, chat, subscription
import logging

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(name)s | %(message)s",
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await init_db()
    await seed_superadmin()
    await seed_plans()
    yield
    # Shutdown (nothing to clean up for now)


async def seed_superadmin():
    """Create superadmin on first boot if not exists."""
    from app.database import AsyncSessionLocal
    from app.models.user import User, UserRole, UserStatus
    from app.services.auth_service import hash_password
    from sqlalchemy import select

    async with AsyncSessionLocal() as db:
        result = await db.execute(select(User).where(User.role == UserRole.SUPERADMIN))
        if result.scalar_one_or_none():
            return

        superadmin = User(
            email=settings.SUPERADMIN_EMAIL,
            username=settings.SUPERADMIN_USERNAME,
            hashed_password=hash_password(settings.SUPERADMIN_PASSWORD),
            role=UserRole.SUPERADMIN,
            status=UserStatus.ACTIVE,
            is_email_verified=True,
            full_name="Super Administrator",
        )
        db.add(superadmin)
        await db.commit()
        logging.info(f"✅ SuperAdmin seeded: {settings.SUPERADMIN_EMAIL}")


async def seed_plans():
    """Create default subscription plans if not exist."""
    from app.database import AsyncSessionLocal
    from app.models.subscription import Plan, PlanType
    from sqlalchemy import select

    default_plans = [
        {
            "name": "Free", "plan_type": PlanType.FREE,
            "description": "Get started with basic features",
            "monthly_price": 0, "yearly_price": 0,
            "max_chat_messages_per_day": 10, "max_watchlist_stocks": 5,
            "max_price_alerts": 3,
        },
        {
            "name": "Basic", "plan_type": PlanType.BASIC,
            "description": "For active investors",
            "monthly_price": 199, "yearly_price": 1999,
            "max_chat_messages_per_day": 50, "max_watchlist_stocks": 20,
            "max_price_alerts": 15, "has_ai_analysis": True,
            "has_news_alerts": True,
        },
        {
            "name": "Pro", "plan_type": PlanType.PRO,
            "description": "For serious traders",
            "monthly_price": 499, "yearly_price": 4999,
            "max_chat_messages_per_day": 200, "max_watchlist_stocks": 100,
            "max_price_alerts": 50, "has_ai_analysis": True,
            "has_portfolio_tracking": True, "has_advanced_charts": True,
            "has_news_alerts": True,
        },
        {
            "name": "Enterprise", "plan_type": PlanType.ENTERPRISE,
            "description": "Unlimited access + API",
            "monthly_price": 1999, "yearly_price": 19999,
            "max_chat_messages_per_day": 9999, "max_watchlist_stocks": 9999,
            "max_price_alerts": 9999, "has_ai_analysis": True,
            "has_portfolio_tracking": True, "has_advanced_charts": True,
            "has_news_alerts": True, "has_api_access": True,
        },
    ]

    async with AsyncSessionLocal() as db:
        for plan_data in default_plans:
            exists = await db.execute(select(Plan).where(Plan.plan_type == plan_data["plan_type"]))
            if not exists.scalar_one_or_none():
                db.add(Plan(**plan_data))
        await db.commit()
        logging.info("✅ Subscription plans seeded")


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="""
## AI Stock Chatbot Admin API

Role-based access control with **SuperAdmin**, **Admin**, and **User** roles.

### Auth
- `POST /auth/register` — Register new user
- `POST /auth/login` — Login and get tokens
- `POST /auth/refresh` — Refresh access token
- `POST /auth/logout` — Revoke refresh token

### Roles
| Role | Access |
|------|--------|
| User | Own profile, watchlists, chat history, subscription |
| Admin | All user management, chat monitoring, broadcast notifications |
| SuperAdmin | Everything + admin management, plans, system health |
    """,
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# ── CORS ──────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(AuditMiddleware)

# ── Routers ───────────────────────────────────────────────────────
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(watchlist.router)
app.include_router(chat.router)
app.include_router(subscription.router)
app.include_router(admin.router)
app.include_router(superadmin.router)


@app.get("/health", tags=["Health"])
async def health():
    return {"status": "ok", "version": settings.APP_VERSION}
