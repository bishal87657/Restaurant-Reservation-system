from pydantic import BaseModel, EmailStr


class UserCreate(BaseModel):
    name: str
    email: EmailStr
    phone: str | None = None
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    user_id: int
    name: str
    email: EmailStr
    phone: str | None = None

    class Config:
        from_attributes = True