from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
import bcrypt
from datetime import datetime, timezone
import random
from bson import ObjectId

from backend.models.user import UserCreate, UserLogin, UserResponse
from backend.database.mongo import db
from backend.auth.jwt_handler import create_access_token, decode_access_token

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

async def get_current_user(token: str = Depends(oauth2_scheme)):
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid auth token")
    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token payload")
    
    user = await db["users"].find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    
    user["id"] = str(user["_id"])
    return user

@router.post("/register", response_model=UserResponse)
async def register_user(user: UserCreate):
    existing = await db["users"].find_one({"email": user.email.lower()})
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")
    
    colors = ["#00F5A0", "#FF6B6B", "#FFD93D", "#FF6BDE", "#6BAAFF"]
    user_dict = {
        "name": user.name,
        "email": user.email.lower(),
        "password_hash": bcrypt.hashpw(user.password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8'),
        "created_at": datetime.now(timezone.utc),
        "avatar_color": random.choice(colors),
    }
    
    result = await db["users"].insert_one(user_dict)
    user_dict["id"] = str(result.inserted_id)
    return user_dict

@router.post("/login")
async def login_user(user: UserLogin):
    db_user = await db["users"].find_one({"email": user.email.lower()})
    is_valid_pwd = False
    if db_user:
        is_valid_pwd = bcrypt.checkpw(user.password.encode('utf-8'), db_user["password_hash"].encode('utf-8'))
        
    if not db_user or not is_valid_pwd:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    
    access_token = create_access_token(data={"sub": str(db_user["_id"]), "email": db_user["email"]})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": str(db_user["_id"]),
            "name": db_user["name"],
            "email": db_user["email"]
        }
    }

@router.get("/me", response_model=UserResponse)
async def get_me(current_user: dict = Depends(get_current_user)):
    return current_user
