from pydantic import BaseModel

class ProductCreate(BaseModel):
    name: str
    description: str
    price: float

class ProductUpdate(BaseModel):
    name: str
    description: str
    price: float

class ProductResponse(BaseModel):
    id: int
    name: str
    description: str
    price: float
    owner_id: int

    class Config:
        orm_mode = True