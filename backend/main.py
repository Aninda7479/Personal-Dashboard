import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
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

# --- React Frontend Mono-Hosting ---
frontend_dist = os.path.join(os.path.dirname(os.path.dirname(__file__)), "frontend", "dist")

if os.path.exists(frontend_dist):
    # Mount the static assets bundle
    assets_dir = os.path.join(frontend_dist, "assets")
    if os.path.exists(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

    # Catch-all router to serve index.html for unknown paths (React Router handling)
    @app.get("/{catchall:path}")
    async def serve_react_app(catchall: str):
        # Allow internal FastAPI routers to execute over frontend catches
        if catchall.startswith(("auth/", "habits/", "pillars/", "quotes/", "health")):
            return {"detail": "Not Found"}
            
        # Serve isolated specific file matches
        file_path = os.path.join(frontend_dist, catchall)
        if os.path.exists(file_path) and os.path.isfile(file_path):
            return FileResponse(file_path)
            
        # Fallback to SPA root
        return FileResponse(os.path.join(frontend_dist, "index.html"))
