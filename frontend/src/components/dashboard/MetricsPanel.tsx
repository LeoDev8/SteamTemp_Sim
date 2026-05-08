"use client";
import React from 'react';
import { Timer, Activity, ShieldAlert, Waves } from 'lucide-react';

interface MetricCardProps {
    label: string;
    value: string | number;
    unit: string;
    icon: React.ReactNode;
    colorClass: string;
}

const MetricItem = ({ label, value, unit, icon, colorClass }: MetricCardProps) => (
    <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl hover:border-slate-600 transition-colors group">
        <div className="flex justify-between items-start mb-3">
            <div className={`p-2 rounded-lg bg-slate-800 ${colorClass} group-hover:scale-110 transition-transform`}>
                {icon}
            </div>
            <span className="text-[8px] text-slate-600 font-bold uppercase tracking-widest font-mono">Verified</span>
        </div>
        <p className="text-[10px] text-slate-500 uppercase font-medium mb-1">{label}</p>
        <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-slate-100 font-mono">{value}</span>
            <span className="text-[9px] text-slate-600 font-bold uppercase">{unit}</span>
        </div>
    </div>
);

export default function MetricsPanel({ t }: { t: any }) {
    return (
        <div className="space-y-6">
            {/* Section 1: Time-Domain Analysis */}
            <div>
                <div className="flex items-center gap-2 px-2 mb-4">
                    <Timer size={14} className="text-slate-600" />
                    <h3 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">Step Response Analysis</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <MetricItem label="Max Overshoot" value="1.2" unit="%" icon={<ShieldAlert size={16} />} colorClass="text-orange-500" />
                    <MetricItem label="Settling Time" value="45" unit="sec" icon={<Timer size={16} />} colorClass="text-emerald-500" />
                    <MetricItem label="Rise Time" value="18" unit="sec" icon={<Activity size={16} />} colorClass="text-blue-500" />
                    <MetricItem label="Steady Error" value="0.02" unit="°C" icon={<ShieldAlert size={16} />} colorClass="text-purple-500" />
                </div>
            </div>

            {/* Section 2: Frequency & Stability */}
            <div className="pt-6 border-t border-slate-900">
                <div className="flex items-center gap-2 px-2 mb-4">
                    <Waves size={14} className="text-slate-600" />
                    <h3 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">Stability Margins</h3>
                </div>
                <div className="bg-slate-900/40 border border-slate-800 p-4 rounded-xl space-y-4">
                    <div className="flex justify-between items-end">
                        <span className="text-[10px] text-slate-500 uppercase font-bold">Phase Margin</span>
                        <span className="text-lg font-black text-emerald-500 font-mono">62.5°</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 w-[62.5%] shadow-[0_0_10px_#10b981]"></div>
                    </div>

                    <div className="flex justify-between items-end">
                        <span className="text-[10px] text-slate-500 uppercase font-bold">Damping Ratio (ζ)</span>
                        <div className="flex items-center gap-2">
                            <span className="text-[9px] text-blue-500 font-bold bg-blue-500/10 px-2 py-0.5 rounded">OPTIMAL</span>
                            <span className="text-lg font-black text-blue-400 font-mono">0.707</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}