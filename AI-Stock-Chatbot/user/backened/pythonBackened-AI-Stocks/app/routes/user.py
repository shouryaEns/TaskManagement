from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models.user import User
from ..schemas.user import UserCreate,UserCreateResponse, UserLogin,UserLoginData,UserLoginResponse, UserProfile, UserProfileResponse, UserLogoutResponse
from ..auth import hash_password, verify_password, create_access_token, get_current_user
router = APIRouter(prefix="/user", tags=["User"])

# user registration
@router.post("/register", response_model=UserCreateResponse)
def register(user: UserCreate, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == user.email).first():
        raise HTTPException(status_code=400, detail="Email already exists")
    if db.query(User).filter(User.mobile_number == user.mobile_number).first():
        raise HTTPException(status_code=400, detail="Mobile number already exists")

    new_user = User(
        email=user.email,
        mobile_number=user.mobile_number,
        username=user.username,
        password=hash_password(user.password)
    )
    
    user_data = UserCreateResponse(success=True, message="User registered")

    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return user_data

# user login
@router.post("/login", response_model=UserLogin)
def login(user: UserLoginData, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if not db_user or not verify_password(user.password, db_user.password):
        raise HTTPException(status_code=400, detail="Invalid credentials")

    token = create_access_token({"user_id": db_user.id,"email": db_user.email,"mobile_number": db_user.mobile_number})
    user_data = UserLoginResponse(token_type="bearer", access_token=token)
    return {"success": True, "auth": user_data}

# user profile
@router.get("/profile", response_model=UserProfileResponse)
def profile(current_user: User = Depends(get_current_user)):
    return {"success": True, "user": current_user}

# user logout
@router.post("/logout", response_model=UserLogoutResponse)
def logout(current_user: User = Depends(get_current_user)):
    # print("Logging out user:-------------------------------------------", current_user.__dict__)
    return {"success": True, "message": "User logged out"}