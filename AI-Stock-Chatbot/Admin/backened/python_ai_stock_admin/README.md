# AI Stock Chatbot Admin API

FastAPI + PostgreSQL backend with role-based access control.

## Roles

| Role | Permissions |
|------|-------------|
| **User** | Own profile, watchlists, chat history, subscription |
| **Admin** | + All users CRUD, chat monitoring, broadcast notifications, audit logs |
| **SuperAdmin** | + Admin management, subscription plans, system health |

## Quick Start

### 1. Copy env file
```bash
cp .env.example .env
# Edit .env with your values
```

### 2. Run with Docker
```bash
docker-compose up -d
```

### 3. Run locally
```bash
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8001
```

### 4. Access
- API: http://localhost:8001
- Swagger: http://localhost:8001/docs
- ReDoc: http://localhost:8001/redoc

## Default SuperAdmin
```
Email:    superadmin@aistockbot.com
Password: SuperAdmin@123
```
Change these in `.env` before production!

## API Endpoints

### Auth
| Method | Path | Description |
|--------|------|-------------|
| POST | `/auth/register` | Register user |
| POST | `/auth/login` | Login → access + refresh token |
| POST | `/auth/refresh` | Get new access token |
| POST | `/auth/logout` | Revoke refresh token |
| GET | `/auth/me` | Current user info |
| GET | `/auth/verify-email?token=` | Verify email |
| POST | `/auth/forgot-password` | Send reset email |
| POST | `/auth/reset-password` | Reset with token |
| POST | `/auth/change-password` | Change password (auth required) |

### Users (auth required)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/users/profile` | Get profile |
| PATCH | `/users/profile` | Update profile |
| GET | `/users/subscription` | My subscription |
| GET | `/users/notifications` | My notifications |
| PATCH | `/users/notifications/{id}/read` | Mark read |
| PATCH | `/users/notifications/read-all` | Mark all read |

### Watchlist (auth required)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/watchlist/` | All watchlists |
| POST | `/watchlist/` | Create watchlist |
| DELETE | `/watchlist/{id}` | Delete watchlist |
| POST | `/watchlist/{id}/items` | Add stock |
| DELETE | `/watchlist/{id}/items/{item_id}` | Remove stock |
| GET | `/watchlist/alerts` | Price alerts |
| POST | `/watchlist/alerts` | Create alert |
| DELETE | `/watchlist/alerts/{id}` | Delete alert |

### Chat (auth required)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/chat/sessions` | Chat sessions |
| POST | `/chat/sessions` | New session |
| GET | `/chat/sessions/{id}` | Session + messages |
| DELETE | `/chat/sessions/{id}` | Delete session |
| POST | `/chat/sessions/{id}/messages` | Save message |

### Subscriptions
| Method | Path | Description |
|--------|------|-------------|
| GET | `/subscriptions/plans` | Public plans list |
| POST | `/subscriptions/subscribe` | Subscribe to plan |
| POST | `/subscriptions/cancel` | Cancel subscription |

### Admin (admin + superadmin)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/admin/users` | List users (search, filter) |
| GET | `/admin/users/{id}` | User detail |
| POST | `/admin/users` | Create user |
| PATCH | `/admin/users/{id}` | Update user |
| DELETE | `/admin/users/{id}` | Soft delete |
| PATCH | `/admin/users/{id}/suspend` | Suspend |
| PATCH | `/admin/users/{id}/activate` | Activate |
| GET | `/admin/chats` | All chat sessions |
| GET | `/admin/chats/flagged-messages` | Flagged messages |
| PATCH | `/admin/chats/messages/{id}/flag` | Flag message |
| POST | `/admin/notifications/broadcast` | Broadcast notification |
| GET | `/admin/audit-logs` | Audit logs |

### SuperAdmin only
| Method | Path | Description |
|--------|------|-------------|
| GET | `/superadmin/dashboard` | Stats overview |
| GET | `/superadmin/admins` | List admins |
| POST | `/superadmin/admins` | Create admin |
| DELETE | `/superadmin/admins/{id}` | Demote admin |
| GET | `/superadmin/plans` | All plans |
| POST | `/superadmin/plans` | Create plan |
| PATCH | `/superadmin/plans/{id}` | Update plan |
| DELETE | `/superadmin/plans/{id}` | Deactivate plan |
| PATCH | `/superadmin/users/{id}/subscription` | Change user plan |
| GET | `/superadmin/system/health` | System health |
