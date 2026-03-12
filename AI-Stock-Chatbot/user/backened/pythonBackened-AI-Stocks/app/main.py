from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import Base, engine
from .routes import user, product, market

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Auth Product API")

origins = [
    "http://localhost:5173",   # Vite React
    "http://localhost:3000",   # CRA React
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user.router)
app.include_router(product.router)
app.include_router(market.router)