from fastapi import APIRouter, HTTPException, WebSocket, WebSocketDisconnect
from pydantic import BaseModel
from services.sim_manager import sim_service
import asyncio
import time

router = APIRouter(prefix="/simulation", tags=["Control Panel"])

class SetpointUpdate(BaseModel):
    value: float

@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    print("DEBUG: WebSocket connection established")
    try:
        while True:
            # 1. Execute one step of the current model and controller
            # Note: 'Simultaneously' means happening at the same time.
            # The sim_service handles the logic regardless of which model is selected.
            results = sim_service.run_step()
            
            # 2. Prepare the payload with a timestamp
            # We use %M:%S.%f to show sub-second precision
            payload = {
                "pv": results["pv"],
                "sp": results["sp"],
                "mv": results["mv"],
                "time": time.strftime("%H:%M:%S")
            }
            
            # 3. Push to frontend
            await websocket.send_json(payload)
            
            # 4. High-frequency update (0.1s = 10 updates per second)
            await asyncio.sleep(0.1) 
    except WebSocketDisconnect:
        print("DEBUG: Client disconnected")

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

@router.post("/switch-model/{model_id}")
async def change_model(model_id: str):
    """Dynamically swap the physical engine."""
    if sim_service.switch_model(model_id):
        return {"status": f"switched to {model_id}"}
    raise HTTPException(status_code=404, detail="Model not found")

@router.post("/switch-controller/{controller_id}")
async def change_model(controller_id: str):
    """Dynamically swap the physical engine."""
    if sim_service.switch_controller(controller_id):
        print(sim_service.active_controller_id)
        return {"status": f"switched to {controller_id}"}
    raise HTTPException(status_code=404, detail="Controller not found")

@router.put("/setpoint")
async def update_sp(data: SetpointUpdate):
    sim_service.controller.setpoint = data.value
    return {"status": "target updated"}

@router.get("/config-schema")
async def get_config_schema():
    """Fetch the dynamic UI configuration schema."""
    return sim_service.get_full_schema()

@router.patch("/update-parameter")
async def update_parameter(target: str, param_id: str, value: float):
    """
    通用参数更新接口
    target: "model" 或 "algo"
    """
    if target == "model":
        setattr(sim_service.active_model, param_id, value)
    else:
        setattr(sim_service.controller, param_id, value)
    return {"status": "success"}