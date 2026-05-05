import sys  # <--- 核心：控制搜索路径
import os   # <--- 处理文件系统路径
from pathlib import Path # <--- 现代化的路径处理工具

# --- 注入路径逻辑 ---
# 获取当前 main.py 所在的绝对路径
BASE_DIR = Path(__file__).resolve().parent

# 将这个路径塞进 Python 的搜索地图 (sys.path) 的第一个位置
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from physicsModels.boiler_sim import SteamSystem
from algorithms.pid_controller import PIDController

app = FastAPI(title="SteamTemp-Optima API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def get_():
    return {"a": "Hello World!"}

# --- 现在这里的 SteamSystem 和 PIDController 就有定义了 ---
boiler = SteamSystem(
    base_furnace_temp=565.0, 
    thermal_inertia=0.98, 
    delay_seconds=20,
    cooling_coeff=0.5
)

controller = PIDController(
    kp=4.5, 
    ki=0.08, 
    kd=1.5, 
    setpoint=540.0, 
    direction=PIDController.REVERSE
)

class SetpointUpdate(BaseModel):
    new_setpoint: float

@app.get("/telemetry")
def get_current_telemetry():
    return {
        "pv": round(boiler.current_temp, 2),
        "sp": controller.setpoint,
        "mv": round(boiler.delay_buffer[-1], 2),
        "status": "NORMAL"
    }

@app.post("/run-step")
def run_simulation_step(bias = 0):
    # PID 根据当前温计算输出
    valve_cmd = bias + controller.compute(boiler.current_temp)
    new_temp, actual_valve = boiler.update(valve_cmd)
    return {
        "new_temp": round(new_temp, 2),
        "actual_valve": round(actual_valve, 2)
    }

@app.put("/update-setpoint")
def update_sp(data: SetpointUpdate):
    controller.setpoint = data.new_setpoint
    boiler.set_new_target(data.new_setpoint)
    return {"message": "Success"}