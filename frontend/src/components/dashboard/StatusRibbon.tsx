"use client";
import React from 'react';
import { Thermometer, Target, Zap } from 'lucide-react';

interface StatusProps {
    t: any;
    pv: number;
    sp: number;
    mv: number;
}

export default function StatusRibbon({ t, pv, sp, mv }: StatusProps) {
    // Vocabulary: "Deviation" - the amount by which a single measurement differs from a fixed value.
    const deviation = (pv - sp).toFixed(2);

    return (
        <div className="grid grid-cols-3 gap-4 w-full">
            {/* PV Card */}
            <div className="bg-slate-900/40 border border-emerald-500/20 p-4 rounded-xl backdrop-blur-sm">
                <div className="flex items-center gap-2 text-slate-500 text-[10px] uppercase font-bold mb-1">
                    <Thermometer size={14} className="text-emerald-500" /> {t.pv_label}
                </div>
                <div className="text-3xl font-black text-emerald-400 font-mono">
                    {pv.toFixed(2)}<span className="text-sm ml-1 text-emerald-700">°C</span>
                </div>
            </div>

            {/* SP Card */}
            <div className="bg-slate-900/40 border border-blue-500/20 p-4 rounded-xl backdrop-blur-sm">
                <div className="flex items-center gap-2 text-slate-500 text-[10px] uppercase font-bold mb-1">
                    <Target size={14} className="text-blue-500" /> {t.sp_label}
                </div>
                <div className="text-3xl font-black text-blue-400 font-mono">
                    {sp.toFixed(1)}<span className="text-sm ml-1 text-blue-700">°C</span>
                </div>
            </div>

            {/* MV Card */}
            <div className="bg-slate-900/40 border border-amber-500/20 p-4 rounded-xl backdrop-blur-sm">
                <div className="flex items-center gap-2 text-slate-500 text-[10px] uppercase font-bold mb-1">
                    <Zap size={14} className="text-amber-500" /> {t.mv_label}
                </div>
                <div className="text-3xl font-black text-amber-500 font-mono">
                    {mv.toFixed(1)}<span className="text-sm ml-1 text-amber-800">%</span>
                </div>
            </div>
        </div>
    );
}