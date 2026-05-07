import React from 'react';
import { UIParam } from '@/types';

// Don't need to pass parm.id to Father Component. Only need to pass newValue
interface Props {
    param: UIParam;
    onChange: (value: any) => void;
}

export default function ParamInput({ param, onChange }: Props) {
    return (
        <div className="space-y-2 mb-6 group">
            <div className="flex justify-between items-center">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter group-hover:text-emerald-500 transition-colors">
                    {param.label}
                </label>
                {param.unit && <span className="text-[9px] text-slate-600 font-mono">{param.unit}</span>}
            </div>

            {param.type === 'slider' && (
                <div className="flex items-center gap-3">
                    <input
                        type="range"
                        min={param.min}
                        max={param.max}
                        step={param.step}
                        value={param.value}
                        onChange={(e) => onChange(parseFloat(e.target.value))}
                        className="flex-1 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    />
                    <span className="text-xs font-mono text-emerald-500 w-8 text-right">{param.value}</span>
                </div>
            )}

            {param.type === 'number' && (
                <div>
                    <input
                        type="number"
                        value={param.value}
                        onChange={(e) => onChange(parseFloat(e.target.value))}
                        className="w-full bg-slate-900 border border-slate-800 rounded-md px-3 py-1.5 text-sm text-emerald-400 focus:outline-none focus:border-emerald-600 transition-all font-mono"
                    />
                </div>
            )}

            {param.type === 'select' && (
                <select
                    value={param.value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-md px-3 py-1.5 text-sm text-slate-300 focus:outline-none focus:border-emerald-600"
                >
                    {param.options?.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                </select>
            )}

            {param.type === 'switch' && (
                <div className="flex items-center justify-between bg-slate-900/40 border border-slate-800 p-3 rounded-lg mt-2">
                    <div className="flex flex-col">
                        <span className={`text-xs font-mono font-bold mt-1 ${param.value === -1 ? 'text-blue-400' : 'text-emerald-400'}`}>
                            {param.value === -1 ? 'REVERSE' : 'DIRECT'}
                        </span>
                    </div>

                    <button
                        onClick={() => onChange(param.value === 1 ? -1 : 1)} // 点击切换 1 和 -1
                        className={`
                            relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 outline-none
                            ${param.value === -1 ? 'bg-blue-900/50 border-blue-500/50' : 'bg-emerald-900/50 border-emerald-500/50'}
                            border-2
                        `}
                    >
                        <span className="sr-only">Toggle Control Action</span>
                        <span
                            className={`
                                inline-block h-3.5 w-3.5 transform rounded-full transition-all duration-300
                                ${param.value === -1 ? 'translate-x-6 bg-blue-400 shadow-[0_0_10px_#60a5fa]' : 'translate-x-1 bg-emerald-400 shadow-[0_0_10px_#34d399]'}
                                `}
                        />
                    </button>
                </div>
            )}
        </div>
    );
}