from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models.product import Product
from ..schemas.product import ProductCreate, ProductResponse, ProductUpdate
from ..auth import get_current_user
from ..models.user import User

router = APIRouter(prefix="/products", tags=["Products"])

@router.post("/", response_model=ProductResponse)
def create_product(product: ProductCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    new_product = Product(**product.dict(), owner_id=current_user.id)
    db.add(new_product)
    db.commit()
    db.refresh(new_product)
    return new_product

@router.get("/", response_model=list[ProductResponse])
def get_products(db: Session = Depends(get_db)):
    return db.query(Product).all()

@router.put("/{product_id}", response_model=ProductResponse)
def update_product(product_id: int, product: ProductUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    db_product = db.query(Product).filter(Product.id == product_id).first()

    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")

    if db_product.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not allowed")

    for key, value in product.dict().items():
        setattr(db_product, key, value)

    db.commit()
    db.refresh(db_product)
    return db_product

@router.delete("/{product_id}")
def delete_product(product_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    db_product = db.query(Product).filter(Product.id == product_id).first()

    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")

    if db_product.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not allowed")

    db.delete(db_product)
    db.commit()
    return {"message": "Product deleted"}