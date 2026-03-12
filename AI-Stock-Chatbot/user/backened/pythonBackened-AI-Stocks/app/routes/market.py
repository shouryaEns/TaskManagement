from fastapi import APIRouter, HTTPException
import httpx

router = APIRouter(prefix="/market", tags=["Market"])

# Get quote details for a specific symbol and exchange
@router.get("/quote/{symbol_id}/{exchange}")
async def get_quote(symbol_id: int, exchange: str):
    url = f"https://equitypanditfinancial.cmots.com/api/GetQuoteDetails/{symbol_id}/{exchange}"

    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(url)

        if response.status_code != 200:
            raise HTTPException(status_code=400, detail="Failed to fetch market data")

        return response.json()

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# find the indices of different exchanges
@router.get("/indices")
async def fetch_indices():
    url = f"https://equitypanditfinancial.cmots.com/api/Indices"

    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(url)

        if response.status_code != 200:
            raise HTTPException(status_code=400, detail="Failed to fetch market data")

        return response.json()

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# MOST ACTIVE STOCKS
@router.get("/most_active_stocks")
async def fetch_most_active_stocks():
    url = f"https://equitypanditfinancial.cmots.com/api/MostActiveToppers/nse/BSE_SENSEX/value/10"

    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(url)

        if response.status_code != 200:
            raise HTTPException(status_code=400, detail="Failed to fetch market data")

        return response.json()

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# TOP GAINERS BSE
@router.get("/top_gainers")
async def fetch_top_gainers():
    url = f"https://equitypanditfinancial.cmots.com/api/Gainers/bse/bse_sensex/today/10"

    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(url)

        if response.status_code != 200:
            raise HTTPException(status_code=400, detail="Failed to fetch market data")

        return response.json()

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# TOP LOSERS BSE
@router.get("/top_losers")
async def fetch_top_losers():
    url = f"https://equitypanditfinancial.cmots.com/api/losers/bse/bse_sensex/today/10"

    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(url)

        if response.status_code != 200:
            raise HTTPException(status_code=400, detail="Failed to fetch market data")

        return response.json()

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# 52-Week high
@router.get("/all_week_high")
async def fetch_52_week_high():
    url = f"https://equitypanditfinancial.cmots.com/api/FiftyTwoWeekHigh/BSE/-/10"

    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(url)

        if response.status_code != 200:
            raise HTTPException(status_code=400, detail="Failed to fetch market data")

        return response.json()

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# 52-Week low
@router.get("/all_week_low")
async def fetch_52_week_low():
    url = f"https://equitypanditfinancial.cmots.com/api/FiftyTwoWeekLow/BSE/-/10"

    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(url)

        if response.status_code != 200:
            raise HTTPException(status_code=400, detail="Failed to fetch market data")

        return response.json()

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Search Particular Stock
@router.get("/search_stock")
async def search_stock(search: str):
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                "https://uapi.equitypandit.com/serve/api/v1/market-scans/stocks",
                params={"search": search},
                headers={"Content-Type": "application/json"}
            )

        if response.status_code != 200:
            raise HTTPException(status_code=400, detail="Failed to fetch stock search data")

        return response.json()

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))