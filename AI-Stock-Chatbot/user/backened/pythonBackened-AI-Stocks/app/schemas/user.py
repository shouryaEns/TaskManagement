from pydantic import BaseModel, EmailStr

# user registration
class UserCreate(BaseModel):
    email: EmailStr
    mobile_number: str
    username: str
    password: str

class UserCreateResponse(BaseModel):
    success: bool
    message: str

# user login 
class UserLoginData(BaseModel):
    email: EmailStr
    password: str

class UserLoginResponse(BaseModel):
    token_type: str
    access_token: str

class UserLogin(BaseModel):
    success: bool
    auth: UserLoginResponse


# user profile
class UserProfile(BaseModel):
    id: int
    email: EmailStr
    mobile_number: str
    username: str

# user logout
class UserLogoutResponse(BaseModel):
    success: bool
    message: str

class UserProfileResponse(BaseModel):
    success: bool
    user: UserProfile

    class Config:
        orm_mode = True