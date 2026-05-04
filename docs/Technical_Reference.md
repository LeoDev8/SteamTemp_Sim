# Technical Reference: SteamTemp-Optima Core Logic

This document provides a detailed technical explanation of the physical simulation and control algorithms used in the SteamTemp-Optima project.

---

## 1. Physics Engine: `boiler_sim.py` (The Plant)

### Overview
This module acts as a **Digital Twin** of a thermal power plant's superheater/reheater process. It accurately simulates how steam temperature reacts to desuperheating water.

### Key Engineering Concepts

#### A. Pure Dead-Time (Transport Delay / 纯滞后)
*   **Physics**: In real power plants, there is a physical distance between the spray nozzle and the temperature sensor. It takes time for the water to travel and affect the steam.
*   **Implementation**: We use `collections.deque` to create a fixed-length buffer. 
*   **Significance**: This is the most challenging part of boiler control. Without modeling this, the simulation is unrealistic.

#### B. First-Order Lag (Thermal Inertia / 热惯性)
*   **Physics**: Represented by the metal mass of the boiler tubes. Temperature cannot change instantly due to heat capacity.
*   **Implementation**: A discrete-time difference equation: 
    `y(k) = α * y(k-1) + (1-α) * u(k)`
*   **Significance**: It ensures smooth, asymptotic temperature transitions, mimicking real-world thermodynamics.

#### C. Actuator Saturation (限幅保护)
*   **Logic**: `max(0, min(100, valve_opening))`
*   **Physics**: Real-world valves have physical limits (0% to 100%).
*   **Significance**: Prevents the control algorithm from assuming "infinite" cooling capacity, making the simulation robust.

---

## 2. Control Logic: `pid_controller.py` (The Controller)

### Overview
This module represents the "Brain" of the system. It calculates the necessary valve adjustments to minimize the error between the current temperature and the target setpoint.

### Key Engineering Concepts

#### A. The PID Algorithm
*   **Proportional (P)**: Reacts to the **Present** error. Higher Kp means faster but potentially more oscillatory response.
*   **Integral (I)**: Reacts to the **Past** accumulated error. Essential for eliminating steady-state error (静差).
*   **Derivative (D)**: Reacts to the **Future** trend. It provides damping (阻尼) to prevent the system from overshooting due to inertia.

#### B. Anti-Windup Mechanism (抗饱和)
*   **Problem**: If the system cannot reach the target (e.g., the furnace is too hot), the Integral term will keep growing, causing a massive overshoot later.
*   **Solution**: We implement an `integral_limit` to cap the accumulation.
*   **Significance**: A signature of industrial-grade control code.

#### C. Unit Testing (单元测试)
*   **Strategy**: Open-loop verification.
*   **Verification**: We simulate a constant error and observe if the output grows (Integral action) or responds to jumps (Derivative action) correctly before integration.

---

## 3. Control Loop Integration (系统集成)

In the final application, these two modules form a **Feedback Control Loop**:

1.  **Sensor**: `boiler_sim` provides the `current_temp` (Process Value).
2.  **Controller**: `pid_controller` calculates the `valve_opening` based on the error.
3.  **Actuator**: The `valve_opening` is fed back into `boiler_sim` to update the state.
4.  **Loop**: This process repeats every second to achieve stable temperature control.

---

## 4. Professional Glossary (专业术语表)

| Term | Full Name | Chinese |
| :--- | :--- | :--- |
| **SP** | Setpoint | 设定值 (目标温度) |
| **PV** | Process Value | 过程值 (当前实际温度) |
| **MV/OP** | Manipulated Variable / Output | 输出值 (阀门指令) |
| **Dead-Time** | Transport Delay | 纯滞后 (输送延迟) |
| **Settling Time** | - | 调节时间 (系统进入稳定的时间) |
| **Overshoot** | - | 超调量 (超过设定值的最大偏差) |