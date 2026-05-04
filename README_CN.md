# SteamTemp-Optima: 发电厂主汽温数字孪生与控制仿真系统

## 1. 项目简介 (Project Overview)
**SteamTemp-Optima** 是一个基于 Python 和 Next.js 构建的工业级数字孪生仿真项目。其核心目标是利用软件工程技术，复现并优化火力发电厂中极其复杂的控制难题——**主再热蒸汽温度控制**。

该系统模拟了具有“大滞后、大惯性”特性的热力学过程，并提供了从传统 PID 调节到先进控制算法（如串级控制、前馈补偿）的实验平台。

### 为什么发起这个项目？
作为一名拥有 3 年发电厂集控运行经验的工程师，我深刻理解主汽温控制对机组安全与效率的重要性。本项目旨在将深厚的**电力系统过程知识 (Domain Knowledge)** 与 **现代全栈开发技术** 相结合，探索工业 4.0 背景下的能源数字化转型。

---

## 2. 核心技术架构 (System Architecture)
项目采用“高内聚、低耦合”的模块化设计，确保物理仿真逻辑与展示层完全分离。

- **Core Engine (Python)**: 物理仿真引擎，负责模拟热力学动态过程。
  - 利用 `collections.deque` 模拟纯滞后环节 (Dead Time)。
  - 利用一阶差分方程模拟热惯性环节 (Inertia Lag)。
  - 实现执行机构的饱和限幅 (Saturation Limiting)。
- **Control Logic (Python)**: 实现 PID 及更高级的控制算法。
- **Communication Layer (FastAPI/WebSockets)**: (开发中) 实现前后端实时的双向数据传输。
- **Frontend Dashboard (Next.js)**: (规划中) 基于 Tailwind CSS 打造的赛博工业风监控看板。

---

## 3. 物理模型数学特性 (Mathematical Modeling)
本项目中的物理模型遵循自控原理的离散化模拟：

- **传递函数模拟**: 模拟对象为典型的 $G(s) = \frac{K}{Ts+1} \cdot e^{-\tau s}$。
- **一阶惯性环节**: 采用公式 $y(k) = \alpha \cdot y(k-1) + (1-\alpha) \cdot u(k)$，其中 $\alpha$ 反映热惯性。
- **限幅保护**: 严格限制控制量（阀门开度）在 $0\% - 100\%$ 之间。

---

## 4. 目录结构 (Directory Structure)
```text
SteamTemp-Optima/
├── backend/                # Python 仿真引擎与算法
│   ├── core/               # 物理模型核心类
│   │   └── boiler_sim.py   # 发电厂物理模拟器
│   ├── algorithms/         # 控制算法 (PID 等)
│   └── main.py             # 后端入口 (待开发)
├── frontend/               # Next.js 前端应用 (待开发)
├── docs/                   # 项目技术文档与原理说明
└── README.md               # 项目主说明文件
```

---

## 5. 快速开始 (Quick Start)
目前项目处于 **Phase 1: Physics Engine** 开发阶段。

### 运行环境
- Python 3.9+

### 启动仿真测试
```bash
# 进入后端目录
cd backend/core

# 运行物理模型测试脚本
python boiler_sim.py
```

---

## 6. 开发路线图 (Roadmap)
- [x] **Phase 1**: 建立带有时滞和惯性的热力学物理模型。
- [ ] **Phase 2**: 实现 PID 调节器并完成闭环控制仿真。
- [ ] **Phase 3**: 引入串级控制 (Cascade Control) 与前馈补偿逻辑。
- [ ] **Phase 4**: 构建基于 Next.js 的 Web 实时监控看板。
- [ ] **Phase 5**: 探索基于 PyTorch 的智能预测控制 (MPC) 优化。

---

## 7. 联系与贡献
**Author**: [刘志浩]
**Background**: 电气工程及其自动化 (专注于电力系统运行与工业数字化)