from fastapi import APIRouter, Depends, HTTPException, status
from datetime import date, datetime, timezone
from typing import List
from bson import ObjectId

from backend.routes.auth import get_current_user
from backend.models.pillar import PillarEntryCreateUpdate, PillarEntryResponse, PillarEnum
from backend.database.mongo import db

router = APIRouter()

@router.post("/", response_model=PillarEntryResponse)
async def create_pillar_entry(pillar: PillarEnum, data: PillarEntryCreateUpdate, current_user: dict = Depends(get_current_user)):
    today_str = date.today().isoformat()
    existing = await db["pillar_entries"].find_one({
        "user_id": ObjectId(current_user["id"]),
        "pillar": pillar.value,
        "date": today_str
    })
    
    if existing:
        raise HTTPException(status_code=400, detail="Entry for today already exists. Use PUT instead.")
        
    entry = data.dict()
    entry["user_id"] = ObjectId(current_user["id"])
    entry["pillar"] = pillar.value
    entry["date"] = today_str
    entry["created_at"] = datetime.now(timezone.utc)
    
    result = await db["pillar_entries"].insert_one(entry)
    entry["id"] = str(result.inserted_id)
    entry["user_id"] = str(entry["user_id"])
    return entry

@router.get("/summary")
async def get_pillars_summary(current_user: dict = Depends(get_current_user)):
    today_str = date.today().isoformat()
    entries = await db["pillar_entries"].find({
        "user_id": ObjectId(current_user["id"]),
        "date": today_str
    }).to_list(length=4)
    
    result = {p: None for p in ["health", "wealth", "love", "happiness"]}
    for entry in entries:
        result[entry["pillar"]] = {
            "score": entry["score"],
            "note": entry.get("note")
        }
    return result

@router.get("/{pillar}", response_model=List[PillarEntryResponse])
async def get_pillar_history(pillar: PillarEnum, current_user: dict = Depends(get_current_user)):
    entries = await db["pillar_entries"].find({
        "user_id": ObjectId(current_user["id"]),
        "pillar": pillar.value
    }).sort("date", 1).limit(30).to_list(length=30)
    
    for entry in entries:
        entry["id"] = str(entry["_id"])
        entry["user_id"] = str(entry["user_id"])
    return entries

@router.get("/{pillar}/today", response_model=PillarEntryResponse)
async def get_pillar_today(pillar: PillarEnum, current_user: dict = Depends(get_current_user)):
    today_str = date.today().isoformat()
    entry = await db["pillar_entries"].find_one({
        "user_id": ObjectId(current_user["id"]),
        "pillar": pillar.value,
        "date": today_str
    })
    
    if not entry:
        raise HTTPException(status_code=404, detail="No entry for today")
        
    entry["id"] = str(entry["_id"])
    entry["user_id"] = str(entry["user_id"])
    return entry

@router.put("/{pillar}/today", response_model=PillarEntryResponse)
async def update_pillar_today(pillar: PillarEnum, data: PillarEntryCreateUpdate, current_user: dict = Depends(get_current_user)):
    today_str = date.today().isoformat()
    update_data = data.dict()
    update_data["created_at"] = datetime.now(timezone.utc)
    
    result = await db["pillar_entries"].find_one_and_update(
        {"user_id": ObjectId(current_user["id"]), "pillar": pillar.value, "date": today_str},
        {"$set": update_data},
        upsert=True,
        return_document=True
    )
    result["id"] = str(result["_id"])
    result["user_id"] = str(result["user_id"])
    return result
