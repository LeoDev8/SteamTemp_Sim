import sys
from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from apis.simulation import router as sim_router

# Ensure the backend directory is in the python path for module discovery
BASE_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(BASE_DIR))

from apis.simulation import router as sim_router

app = FastAPI(title="OmniControl-Studio Backend")

# Security: Allow frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include the simulation logic
app.include_router(sim_router)

@app.get("/")
async def health_check():
    return {"status": "online", "version": "2.0.0"}