from fastapi import APIRouter, Depends
from datetime import date, datetime, timezone, timedelta
from typing import List
from bson import ObjectId

from backend.routes.auth import get_current_user
from backend.models.habit import HabitLogCreateUpdate, HabitLogResponse
from backend.database.mongo import db

router = APIRouter()

@router.get("/today", response_model=HabitLogResponse)
async def get_today_habit(current_user: dict = Depends(get_current_user)):
    today_str = date.today().isoformat()
    log = await db["habit_logs"].find_one({"user_id": ObjectId(current_user["id"]), "date": today_str})
    
    if not log:
        new_log = {
            "user_id": ObjectId(current_user["id"]),
            "date": today_str,
            "pushups": 0, "pullups": 0, "squats": 0, "situps": 0, "plank_minutes": 0.0,
            "created_at": datetime.now(timezone.utc),
            "updated_at": datetime.now(timezone.utc)
        }
        result = await db["habit_logs"].insert_one(new_log)
        new_log["id"] = str(result.inserted_id)
        new_log["user_id"] = str(new_log["user_id"])
        return new_log
        
    log["id"] = str(log["_id"])
    log["user_id"] = str(log["user_id"])
    return log

@router.put("/today", response_model=HabitLogResponse)
async def update_today_habit(habit_update: HabitLogCreateUpdate, current_user: dict = Depends(get_current_user)):
    today_str = date.today().isoformat()
    update_data = habit_update.dict()
    update_data["updated_at"] = datetime.now(timezone.utc)
    
    result = await db["habit_logs"].find_one_and_update(
        {"user_id": ObjectId(current_user["id"]), "date": today_str},
        {"$set": update_data},
        upsert=True,
        return_document=True
    )
    result["id"] = str(result["_id"])
    result["user_id"] = str(result["user_id"])
    return result

@router.get("/week")
async def get_weekly_habits(current_user: dict = Depends(get_current_user)):
    today = date.today()
    last_week = [(today - timedelta(days=i)).isoformat() for i in range(6, -1, -1)]
    
    logs = await db["habit_logs"].find({
        "user_id": ObjectId(current_user["id"]),
        "date": {"$in": last_week}
    }).to_list(length=7)
    
    logs_by_date = {log["date"]: log for log in logs}
    
    result = []
    for d in last_week:
        if d in logs_by_date:
            log = logs_by_date[d]
            total = log.get("pushups", 0) + log.get("pullups", 0) + log.get("squats", 0) + log.get("situps", 0)
            result.append({"date": d, "total": total})
        else:
            result.append({"date": d, "total": 0})
            
    return result

@router.get("/streak")
async def get_streak(current_user: dict = Depends(get_current_user)):
    logs = await db["habit_logs"].find(
        {"user_id": ObjectId(current_user["id"])}
    ).sort("date", -1).to_list(length=100)
    
    if not logs:
        return {"streak": 0}
        
    streak = 0
    current_date = date.today()
    
    for log in logs:
        log_date = date.fromisoformat(log["date"])
        # Check if there is any activity
        total_activity = log.get("pushups", 0) + log.get("pullups", 0) + log.get("squats", 0) + log.get("situps", 0) + log.get("plank_minutes", 0.0)
        
        if log_date == current_date:
            if total_activity > 0:
                streak += 1
            current_date -= timedelta(days=1)
        elif log_date == current_date - timedelta(days=1):
            if total_activity > 0:
                streak += 1
                current_date = log_date - timedelta(days=1)
            else:
                break
        else:
            if streak > 0:
                break
                
    return {"streak": streak}

@router.get("/history", response_model=List[HabitLogResponse])
async def get_history(limit: int = 30, current_user: dict = Depends(get_current_user)):
    logs_cursor = db["habit_logs"].find({"user_id": ObjectId(current_user["id"])}).sort("date", -1).limit(limit)
    logs = await logs_cursor.to_list(length=limit)
    for log in logs:
        log["id"] = str(log["_id"])
        log["user_id"] = str(log["user_id"])
    return logs
