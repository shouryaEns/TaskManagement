from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from sqlalchemy.orm import selectinload
from datetime import datetime, timezone
from app.database import get_db
from app.models.user import User
from app.models.chat import ChatSession, ChatMessage, MessageRole
from app.utils.dependencies import get_current_user
from app.utils.responses import success_response

router = APIRouter(prefix="/chat", tags=["Chat History"])


@router.get("/sessions")
async def get_sessions(
    page: int = 1,
    per_page: int = 20,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    count_result = await db.execute(
        select(func.count()).where(ChatSession.user_id == current_user.id)
    )
    total = count_result.scalar()

    result = await db.execute(
        select(ChatSession)
        .where(ChatSession.user_id == current_user.id)
        .order_by(ChatSession.last_message_at.desc())
        .offset((page - 1) * per_page).limit(per_page)
    )
    sessions = result.scalars().all()

    return success_response("Sessions fetched", {
        "items": [
            {
                "id": str(s.id), "title": s.title,
                "message_count": s.message_count,
                "last_message_at": str(s.last_message_at) if s.last_message_at else None,
                "created_at": str(s.created_at),
            }
            for s in sessions
        ],
        "total": total, "page": page, "per_page": per_page,
    })


@router.get("/sessions/{session_id}")
async def get_session_messages(
    session_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(ChatSession)
        .options(selectinload(ChatSession.messages))
        .where(ChatSession.id == session_id, ChatSession.user_id == current_user.id)
    )
    session = result.scalar_one_or_none()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    return success_response("Session fetched", {
        "id": str(session.id),
        "title": session.title,
        "messages": [
            {
                "id": str(m.id), "role": m.role.value,
                "content": m.content,
                "created_at": str(m.created_at),
            }
            for m in session.messages
        ],
    })


@router.post("/sessions")
async def create_session(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    session = ChatSession(user_id=current_user.id)
    db.add(session)
    await db.commit()
    return success_response("Session created", {"id": str(session.id)})


@router.delete("/sessions/{session_id}")
async def delete_session(
    session_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(ChatSession).where(ChatSession.id == session_id, ChatSession.user_id == current_user.id)
    )
    session = result.scalar_one_or_none()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    await db.delete(session)
    await db.commit()
    return success_response("Session deleted")


@router.post("/sessions/{session_id}/messages")
async def save_message(
    session_id: str,
    role: str,
    content: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Save a chat message to a session (called after getting AI response)."""
    result = await db.execute(
        select(ChatSession).where(ChatSession.id == session_id, ChatSession.user_id == current_user.id)
    )
    session = result.scalar_one_or_none()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    msg = ChatMessage(
        session_id=session_id,
        role=MessageRole(role),
        content=content,
    )
    db.add(msg)
    session.message_count += 1
    session.last_message_at = datetime.now(timezone.utc)

    # Auto-set title from first user message
    if session.message_count == 1 and role == "user":
        session.title = content[:60] + ("..." if len(content) > 60 else "")

    await db.commit()
    return success_response("Message saved", {"id": str(msg.id)})
