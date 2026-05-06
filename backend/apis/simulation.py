from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.sim_manager import sim_service

router = APIRouter(prefix="/simulation", tags=["Control Panel"])

class SetpointUpdate(BaseModel):
    value: float

@router.get("/telemetry")
async def get_telemetry():
    """Exposes the current state of the active model."""
    return {
        "model": sim_service.active_id,
        "pv": round(sim_service.active_model.current_state, 2),
        "sp": sim_service.controller.setpoint,
        "info": sim_service.active_model.get_info()
    }

@router.post("/run-step")
async def step():
    """Trigger one calculation cycle."""
    return sim_service.run_step()

@router.post("/switch/{model_id}")
async def change_model(model_id: str):
    """Dynamically swap the physical engine."""
    if sim_service.switch_model(model_id):
        return {"status": f"switched to {model_id}"}
    raise HTTPException(status_code=404, detail="Model not found")

@router.put("/setpoint")
async def update_sp(data: SetpointUpdate):
    sim_service.controller.setpoint = data.value
    return {"status": "target updated"}