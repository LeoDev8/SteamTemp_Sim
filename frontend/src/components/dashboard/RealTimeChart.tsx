"use client";

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

// IELTS Vocabulary: "Telemetry" refers to the remote measurement and transmission of data.
interface ChartProps {
    t: any;
    data: any[]; // We will pass a data array from the parent or hook
}

export default function RealTimeChart({ t, data }: ChartProps) {
    return (
        <div className="w-full h-[400px] bg-slate-900/20 p-2 rounded-xl">
            <div className="flex justify-between items-center mb-4 px-4">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-emerald-500/80">
                    Live System Dynamics
                </h3>
            </div>

            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis
                        dataKey="time"
                        stroke="#475569"
                        fontSize={10}
                        tickLine={false}
                        axisLine={false}
                    />
                    <YAxis
                        stroke="#475569"
                        fontSize={10}
                        tickLine={false}
                        axisLine={false}
                        domain={['auto', 'auto']}
                    />
                    <Tooltip
                        contentStyle={{ backgroundColor: '#020617', border: '1px solid #1e293b', fontSize: '12px' }}
                        itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                    />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />

                    {/* PV Line: Process Value (Actual Temperature) */}
                    <Line
                        name={t.pv_label || "Process Value"}
                        type="monotone"
                        dataKey="pv"
                        stroke="#10b981"
                        strokeWidth={3}
                        dot={false}
                        isAnimationActive={false} // Critical for real-time performance
                    />

                    {/* SP Line: Setpoint (Target) */}
                    <Line
                        name={t.sp_label || "Setpoint"}
                        type="stepAfter"
                        dataKey="sp"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        dot={false}
                        isAnimationActive={false}
                    />

                    {/* MV Line: Manipulated Variable (Valve Opening) */}
                    <Line
                        name={t.mv_label || "Output %"}
                        type="monotone"
                        dataKey="mv"
                        stroke="#f59e0b"
                        strokeWidth={1}
                        dot={false}
                        isAnimationActive={false}
                        opacity={0.6}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}