from pydantic import BaseModel, Field
from datetime import datetime
from typing import List, Optional
from enum import Enum

class PillarEnum(str, Enum):
    health = "health"
    wealth = "wealth"
    love = "love"
    happiness = "happiness"

class PillarEntryCreateUpdate(BaseModel):
    score: int = Field(..., ge=1, le=10)
    note: Optional[str] = Field(None, max_length=500)
    tags: List[str] = Field(default_factory=list)

class PillarEntryResponse(PillarEntryCreateUpdate):
    id: str
    user_id: str
    pillar: PillarEnum
    date: str
    created_at: datetime
