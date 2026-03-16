from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from sqlalchemy.orm import selectinload
from app.database import get_db
from app.models.user import User
from app.models.watchlist import Watchlist, WatchlistItem, PriceAlert, AlertStatus
from app.schemas import WatchlistCreate, WatchlistItemCreate, PriceAlertCreate
from app.utils.dependencies import get_current_user
from app.utils.responses import success_response

router = APIRouter(prefix="/watchlist", tags=["Watchlist"])


# ── Watchlists ─────────────────────────────────────────────────────

@router.get("/")
async def get_watchlists(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(Watchlist)
        .options(selectinload(Watchlist.items))
        .where(Watchlist.user_id == current_user.id)
    )
    watchlists = result.scalars().all()
    return success_response("Watchlists fetched", [
        {
            "id": str(w.id), "name": w.name, "description": w.description,
            "is_default": w.is_default,
            "items_count": len(w.items),
            "items": [
                {"id": str(i.id), "symbol": i.symbol, "exchange": i.exchange, "notes": i.notes}
                for i in w.items
            ],
        }
        for w in watchlists
    ])


@router.post("/", status_code=201)
async def create_watchlist(
    payload: WatchlistCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # Check plan limit (max 3 watchlists for free plan)
    count_result = await db.execute(
        select(func.count()).where(Watchlist.user_id == current_user.id)
    )
    count = count_result.scalar()
    if count >= 10:
        raise HTTPException(status_code=400, detail="Watchlist limit reached")

    wl = Watchlist(user_id=current_user.id, name=payload.name, description=payload.description)
    db.add(wl)
    await db.commit()
    return success_response("Watchlist created", {"id": str(wl.id), "name": wl.name})


@router.delete("/{watchlist_id}")
async def delete_watchlist(
    watchlist_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(Watchlist).where(Watchlist.id == watchlist_id, Watchlist.user_id == current_user.id)
    )
    wl = result.scalar_one_or_none()
    if not wl:
        raise HTTPException(status_code=404, detail="Watchlist not found")
    await db.delete(wl)
    await db.commit()
    return success_response("Watchlist deleted")


@router.post("/{watchlist_id}/items", status_code=201)
async def add_stock_to_watchlist(
    watchlist_id: str,
    payload: WatchlistItemCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(Watchlist).where(Watchlist.id == watchlist_id, Watchlist.user_id == current_user.id)
    )
    wl = result.scalar_one_or_none()
    if not wl:
        raise HTTPException(status_code=404, detail="Watchlist not found")

    # Check duplicate
    exists = await db.execute(
        select(WatchlistItem).where(
            WatchlistItem.watchlist_id == watchlist_id,
            WatchlistItem.symbol == payload.symbol.upper(),
        )
    )
    if exists.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Stock already in watchlist")

    item = WatchlistItem(
        watchlist_id=watchlist_id,
        symbol=payload.symbol.upper(),
        co_code=payload.co_code,
        exchange=payload.exchange,
        notes=payload.notes,
    )
    db.add(item)
    await db.commit()
    return success_response("Stock added to watchlist", {"id": str(item.id)})


@router.delete("/{watchlist_id}/items/{item_id}")
async def remove_stock_from_watchlist(
    watchlist_id: str,
    item_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(WatchlistItem)
        .join(Watchlist)
        .where(
            WatchlistItem.id == item_id,
            Watchlist.id == watchlist_id,
            Watchlist.user_id == current_user.id,
        )
    )
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    await db.delete(item)
    await db.commit()
    return success_response("Stock removed from watchlist")


# ── Price Alerts ───────────────────────────────────────────────────

@router.get("/alerts")
async def get_alerts(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(PriceAlert).where(PriceAlert.user_id == current_user.id)
        .order_by(PriceAlert.created_at.desc())
    )
    alerts = result.scalars().all()
    return success_response("Alerts fetched", [
        {
            "id": str(a.id), "symbol": a.symbol, "exchange": a.exchange,
            "alert_type": a.alert_type.value, "target_value": float(a.target_value),
            "status": a.status.value, "message": a.message,
            "triggered_at": str(a.triggered_at) if a.triggered_at else None,
        }
        for a in alerts
    ])


@router.post("/alerts", status_code=201)
async def create_alert(
    payload: PriceAlertCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    alert = PriceAlert(
        user_id=current_user.id,
        symbol=payload.symbol.upper(),
        exchange=payload.exchange,
        alert_type=payload.alert_type,
        target_value=payload.target_value,
        message=payload.message,
    )
    db.add(alert)
    await db.commit()
    return success_response("Alert created", {"id": str(alert.id)})


@router.delete("/alerts/{alert_id}")
async def delete_alert(
    alert_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(PriceAlert).where(PriceAlert.id == alert_id, PriceAlert.user_id == current_user.id)
    )
    alert = result.scalar_one_or_none()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    await db.delete(alert)
    await db.commit()
    return success_response("Alert deleted")
