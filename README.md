# SteamTemp-Optima: Power Plant Steam Temperature Digital Twin

## 1. Project Overview
**SteamTemp-Optima** is an industrial-grade Digital Twin simulation project. It focuses on solving one of the most challenging control problems in thermal power plants: **Main and Reheat Steam Temperature Control**.

The system simulates thermodynamic processes with significant **dead time (time delay)** and **inertia**, providing an experimental platform for control strategies ranging from classic PID to advanced schemes like Cascade Control and Feed-forward compensation.

### Why this project?
As an engineer with 3 years of experience in power plant operation, I understand the critical role of steam temperature in unit safety and efficiency. This project aims to bridge **Domain Knowledge (Power Systems)** with **Modern Software Engineering (Python/Next.js)**.

---

## 2. System Architecture
The project follows a decoupled, modular architecture:

- **Core Engine (Python)**: Simulates thermodynamic dynamics.
  - `collections.deque` for **Dead Time** simulation.
  - First-order difference equations for **Inertia Lag**.
  - Actuator **Saturation Limiting** (0% - 100%).
- **Control Logic (Python)**: Implementing PID and advanced algorithms.
- **Communication Layer**: (WIP) Real-time data transfer via WebSockets.
- **Frontend Dashboard**: (Planned) Cyber-industrial UI built with Next.js & Tailwind CSS.

---

## 3. Mathematical Modeling
The physics model adheres to Control Theory principles:

- **Transfer Function**: Simulates $G(s) = \frac{K}{Ts+1} \cdot e^{-\tau s}$.
- **Inertia Lag**: Implemented via $y(k) = \alpha \cdot y(k-1) + (1-\alpha) \cdot u(k)$.
- **Saturation**: Control output is strictly bounded within $[0, 100]$.

---

## 4. Directory Structure
```text
SteamTemp-Optima/
├── backend/                
│   ├── core/               # Physical models
│   │   └── boiler_sim.py   
│   ├── algorithms/         # Control algorithms
│   └── main.py             
├── frontend/               # Next.js Application
├── docs/                   # Documentation
└── README.md               
```

---

## 5. Quick Start
### Prerequisites
- Python 3.9+

### Run Simulation Test
```bash
cd backend/core
python boiler_sim.py
```

---

## 6. Roadmap

- [x] **Phase 1**: Physics engine with time delay and inertia.
- [ ] **Phase 2**: Closed-loop control with PID.
- [ ] **Phase 3**: Cascade Control and Feed-forward logic.
- [ ] **Phase 4**: Web dashboard with Next.js.
- [ ] **Phase 5**: AI-based Predictive Control (MPC) using PyTorch.

---

## 7. Contact
**Author**: [Zhihao Liu]
**Background**: B.Eng. in Electrical Engineering & Automation (Expertise in Power Plant Operation)