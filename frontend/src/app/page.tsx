"use client"; // 必须声明，因为我们要用状态管理和副作用

import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Thermometer, Settings, Activity, Gauge } from 'lucide-react';

// 定义数据结构
interface TelemetryData {
  pv: number;
  sp: number;
  mv: number;
  status: string;
  time: string;
}

export default function Dashboard() {
  const [dataHistory, setDataHistory] = useState<TelemetryData[]>([]);
  const [currentData, setCurrentData] = useState<TelemetryData | null>(null);
  const [newSetpoint, setNewSetpoint] = useState<number>(540);

  // 1. 每隔一秒从 FastAPI 后端抓取数据
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 第一步：触发后端跑一步仿真 (run-step)
        await fetch('http://127.0.0.1:8000/run-step', { method: 'POST' });

        // 第二步：获取最新遥测数据 (telemetry)
        const res = await fetch('http://127.0.0.1:8000/telemetry');
        const newData = await res.json();

        const timestampedData = {
          ...newData,
          time: new Date().toLocaleTimeString().slice(3) // 只要分:秒
        };

        setCurrentData(timestampedData);
        // 保留最近 30 个数据点
        setDataHistory(prev => [...prev.slice(-29), timestampedData]);
      } catch (err) {
        console.error("Backend connection failed", err);
      }
    };

    const interval = setInterval(fetchData, 1000);
    return () => clearInterval(interval);
  }, []);

  // 2. 修改设定点的函数
  const handleUpdateSetpoint = async () => {
    await fetch('http://127.0.0.1:8000/update-setpoint', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ new_setpoint: newSetpoint })
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-emerald-400 p-8 font-mono">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-emerald-900/50 pb-4 mb-8">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Activity className="text-emerald-500 animate-pulse" />
          STEAMP-OPTIMA | DIGITAL TWIN
        </h1>
        <div className="text-sm bg-emerald-950 px-4 py-1 rounded-full border border-emerald-500/30">
          SYSTEM STATUS: <span className="text-emerald-400">OPERATIONAL</span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* 左栏：实时数据卡片 */}
        <div className="space-y-6">
          <div className="bg-slate-900/50 p-6 rounded-xl border border-emerald-500/20 hover:border-emerald-500/50 transition-all shadow-[0_0_20px_rgba(16,185,129,0.05)]">
            <div className="flex items-center gap-2 mb-2 text-slate-400">
              <Thermometer size={18} /> PROCESS VALUE (PV)
            </div>
            <div className="text-5xl font-black text-emerald-400">
              {currentData?.pv.toFixed(2) || "---"} <span className="text-xl">℃</span>
            </div>
          </div>

          <div className="bg-slate-900/50 p-6 rounded-xl border border-blue-500/20">
            <div className="flex items-center gap-2 mb-2 text-slate-400">
              <Settings size={18} /> SETPOINT (SP)
            </div>
            <div className="text-5xl font-black text-blue-400">
              {currentData?.sp || "---"} <span className="text-xl">℃</span>
            </div>
          </div>

          <div className="bg-slate-900/50 p-6 rounded-xl border border-amber-500/20">
            <div className="flex items-center gap-2 mb-2 text-slate-400">
              <Gauge size={18} /> VALVE OUTPUT (MV)
            </div>
            <div className="text-5xl font-black text-amber-500">
              {currentData?.mv.toFixed(1) || "---"} <span className="text-xl">%</span>
            </div>
          </div>
        </div>

        {/* 中栏：核心趋势图 */}
        <div className="lg:col-span-2 bg-slate-900/50 p-6 rounded-xl border border-emerald-500/20 relative overflow-hidden">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold uppercase tracking-widest">Real-time Thermal Dynamics</h2>
            <div className="flex gap-4 text-xs">
              <span className="flex items-center gap-1"><div className="w-3 h-3 bg-emerald-500 rounded-full"></div> PV</span>
              <span className="flex items-center gap-1"><div className="w-3 h-3 bg-blue-500 rounded-full"></div> SP</span>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dataHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#475569" fontSize={12} />
                <YAxis domain={[520, 560]} stroke="#475569" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #10b981' }} />
                <Line type="monotone" dataKey="pv" stroke="#10b981" strokeWidth={3} dot={false} isAnimationActive={false} />
                <Line type="stepAfter" dataKey="sp" stroke="#3b82f6" strokeWidth={2} strokeDasharray="5 5" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* 控制交互区 */}
          <div className="mt-6 pt-6 border-t border-slate-800 flex gap-4 items-end">
            <div className="flex-1">
              <label className="block text-xs text-slate-500 mb-2 uppercase">Adjust Setpoint (SP)</label>
              <input
                type="range" min="500" max="600"
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                value={newSetpoint}
                onChange={(e) => setNewSetpoint(Number(e.target.value))}
              />
            </div>
            <div className="text-xl font-bold w-16 text-blue-400">{newSetpoint}℃</div>
            <button
              onClick={handleUpdateSetpoint}
              className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg text-sm font-bold transition-all uppercase tracking-widest"
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}