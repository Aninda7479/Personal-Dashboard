from fastapi import APIRouter, Depends
from datetime import date
from pydantic import BaseModel

from backend.routes.auth import get_current_user

router = APIRouter()

QUOTES = [
    {"quote": "The only bad workout is the one that didn't happen.", "author": "Unknown"},
    {"quote": "It never gets easier, you just get stronger.", "author": "Greg LeMond"},
    {"quote": "Don't stop when you're tired. Stop when you're done.", "author": "David Goggins"},
    {"quote": "Discipline equals freedom.", "author": "Jocko Willink"},
    {"quote": "Success is what comes after your stop making excuses.", "author": "Luis Galarza"}
]

class QuoteResponse(BaseModel):
    quote: str
    author: str

@router.get("/today", response_model=QuoteResponse)
async def get_today_quote(current_user: dict = Depends(get_current_user)):
    today = date.today().isoformat()
    index = hash(today) % len(QUOTES)
    return QUOTES[index]
