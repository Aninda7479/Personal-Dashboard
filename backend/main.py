from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.routes import auth, habits, pillars, quotes

app = FastAPI(title="Life Dashboard API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Tighten for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(habits.router, prefix="/habits", tags=["habits"])
app.include_router(pillars.router, prefix="/pillars", tags=["pillars"])
app.include_router(quotes.router, prefix="/quotes", tags=["quotes"])

@app.get("/health")
async def health_check():
    return {"status": "ok"}
