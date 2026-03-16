# AI Stock Chatbot Admin — Project Structure

```
ai_stock_admin/
├── app/
│   ├── __init__.py
│   ├── main.py                   # FastAPI app entry point
│   ├── config.py                 # Settings & environment variables
│   ├── database.py               # PostgreSQL connection & session
│   │
│   ├── models/                   # SQLAlchemy ORM models
│   │   ├── __init__.py
│   │   ├── user.py               # User, SuperAdmin, Admin models
│   │   ├── subscription.py       # Plans & user subscriptions
│   │   ├── chat.py               # Chat sessions & messages
│   │   ├── watchlist.py          # User watchlists & alerts
│   │   ├── audit.py              # Audit logs
│   │   └── notification.py       # Notifications
│   │
│   ├── schemas/                  # Pydantic request/response schemas
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── subscription.py
│   │   ├── chat.py
│   │   ├── watchlist.py
│   │   ├── audit.py
│   │   └── notification.py
│   │
│   ├── routers/                  # API route handlers
│   │   ├── __init__.py
│   │   ├── auth.py               # Login, register, refresh, logout
│   │   ├── superadmin.py         # SuperAdmin-only routes
│   │   ├── admin.py              # Admin routes
│   │   ├── users.py              # User profile & settings
│   │   ├── chat.py               # Chat history & sessions
│   │   ├── watchlist.py          # Watchlists & price alerts
│   │   ├── subscription.py       # Plans & billing
│   │   ├── notifications.py      # Push/in-app notifications
│   │   └── analytics.py          # Usage analytics
│   │
│   ├── services/                 # Business logic layer
│   │   ├── __init__.py
│   │   ├── auth_service.py       # JWT, password hashing
│   │   ├── user_service.py
│   │   ├── chat_service.py
│   │   ├── email_service.py      # Email via SMTP/SendGrid
│   │   └── analytics_service.py
│   │
│   ├── middleware/
│   │   ├── __init__.py
│   │   └── audit_middleware.py   # Auto-log all requests
│   │
│   └── utils/
│       ├── __init__.py
│       ├── dependencies.py       # get_current_user, role guards
│       ├── pagination.py
│       └── responses.py          # Standard API response wrapper
│
├── alembic/                      # DB migrations
│   ├── env.py
│   └── versions/
│
├── alembic.ini
├── requirements.txt
├── .env.example
├── docker-compose.yml
└── README.md
```
