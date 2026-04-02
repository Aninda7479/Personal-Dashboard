from pydantic import BaseModel, Field
from datetime import datetime

class HabitLogCreateUpdate(BaseModel):
    pushups: int = Field(default=0, ge=0)
    pullups: int = Field(default=0, ge=0)
    squats: int = Field(default=0, ge=0)
    situps: int = Field(default=0, ge=0)
    plank_minutes: float = Field(default=0.0, ge=0.0)

class HabitLogResponse(HabitLogCreateUpdate):
    id: str
    user_id: str
    date: str
    created_at: datetime
    updated_at: datetime
