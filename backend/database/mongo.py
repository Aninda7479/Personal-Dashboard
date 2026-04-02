from motor.motor_asyncio import AsyncIOMotorClient
from backend.config import settings

client = AsyncIOMotorClient(settings.MONGO_URI)
db = client["lifedashboard"]
