"use client";

import React, { useState, useEffect } from 'react';
import { Box, Cpu, RotateCcw, ChevronDown, Activity } from 'lucide-react';
import ParamInput from '../uis/ParamsIuput';

export default function Sidebar({ t }: { t: any }) {
    const [schema, setSchema] = useState<any>(null);

    // 1. 初始化及刷新 Schema
    const fetchSchema = async () => {
        const res = await fetch('http://127.0.0.1:8000/simulation/config-schema');
        const data = await res.json();
        setSchema(data);
    };

    useEffect(() => { fetchSchema(); }, []);

    // 2. 处理模型切换
    const handleModelChange = async (id: string) => {
        await fetch(`http://127.0.0.1:8000/simulation/switch-model/${id}`, { method: 'POST' });
        fetchSchema(); // 切换后刷新参数列表
    };

    const handleControllerChange = async (id: string) => {
        await fetch(`http://127.0.0.1:8000/simulation/switch-controller/${id}`, { method: 'POST' });
        fetchSchema(); // 切换后刷新参数列表
    }

    // 3. 处理参数修改

    const handleParamUpdate = async (target: 'model' | 'algo', id: string, val: any) => {


        // --- 1. 第一步：乐观更新 (立刻修改本地状态) ---
        setSchema((prevSchema: any) => {
            if (!prevSchema) return prevSchema;


            // 根据 target (model 或 algo) 找到对应的参数列表
            const key = target === 'model' ? 'model_params' : 'controller_params';

            const newParams = prevSchema[key].map((p: any) => {
                if (p.id === id) {
                    return { ...p, value: val }; // 找到对应的 ID，更新其 value
                }
                return p;
            });

            return { ...prevSchema, [key]: newParams };
        });

        // --- 2. 第二步：在后台同步给后端 ---
        // try {
        //     await fetch(`http://127.0.0.1:8000/simulation/update-parameter?target=${target}&param_id=${id}&value=${val}`, {
        //         method: 'PATCH'
        //     });
        // } catch (error) {
        //     console.error("Failed to sync parameter with backend", error);
        // }
    };



    if (!schema) return <div className="w-80 bg-slate-950 p-6 text-slate-700 font-mono">Loading Core...</div>;

    return (
        <aside className="w-80 h-full border-r border-slate-800 bg-[#020617] flex flex-col p-6 overflow-y-auto custom-scrollbar shadow-[10px_0_30px_rgba(0,0,0,0.5)]">

            {/* 品牌标识 */}
            <div className="flex items-center gap-3 mb-10 pb-6 border-b border-slate-900">
                <Activity className="text-emerald-500 animate-pulse" size={20} />
                {/* <h1 className="text-sm font-black tracking-[0.2em] text-slate-100 uppercase">ControlSim Studio</h1> */}
            </div>

            {/* 物理模型配置卡片 */}
            <section className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                    <Box size={14} className="text-emerald-500" />
                    <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-500">{t.sidebar_model_title}</h2>
                </div>
                <div className="bg-slate-900/40 border border-slate-800 p-4 rounded-xl space-y-4">
                    {/* Model Selector Wrapper */}
                    <div className="relative group mb-6">
                        {/* 1. 自定义图标：通过 pointer-events-none 让图标不挡住点击事件 */}
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 group-hover:text-emerald-400 transition-colors">
                            <ChevronDown size={14} />
                        </div>

                        {/* 2. 重塑后的 Select 标签 */}
                        <select
                            value={schema.active_model}
                            onChange={(e) => handleModelChange(e.target.value)}
                            className="w-full appearance-none  bg-slate-950 text-emerald-400 text-xs font-bold py-2.5 pl-4 pr-10 
                                        rounded-lg border border-slate-800 hover:border-emerald-500/50 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30
                                        transition-all cursor-pointer shadow-inner
                                        "
                        >
                            <option value="boiler" className="bg-slate-950 text-emerald-400">{t.model_boiler}</option>
                            {/* <option value="drone" className="bg-slate-950 text-emerald-400">{t.model_drone}</option> */}
                        </select>

                        {/* 3. 装饰性侧边线：增加工业细节感 */}
                        <div className="absolute left-0 top-1/4 bottom-1/4 w-[2px] bg-emerald-500/50 rounded-full"></div>
                    </div>

                    <div className="pt-2 border-t border-slate-800/50">
                        {schema.model_params.map((p: any) => (
                            <ParamInput key={p.id} param={p} onChange={(value) => handleParamUpdate('model', p.id, value)} />
                        ))}
                    </div>


                </div>
            </section>

            {/* 控制算法配置卡片 */}
            <section className="mb-8">

                <div className="flex items-center gap-2 mb-4">
                    <Cpu size={14} className="text-blue-500" />
                    <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-500">{t.sidebar_pid_title}</h2>
                </div>
                <div className="bg-slate-900/40 border border-slate-800 p-4 rounded-xl">
                    {/* Controller Selector Wrapper */}
                    <div className="relative group mb-6">
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 group-hover:text-emerald-400 transition-colors">
                            <ChevronDown size={14} />
                        </div>

                        <select
                            value={schema.active_controller}
                            onChange={(e) => handleControllerChange(e.target.value)}
                            className="w-full appearance-none bg-slate-950 text-emerald-400 text-xs font-bold py-2.5 pl-4 pr-10 
                                        rounded-lg border border-slate-800 hover:border-emerald-500/50 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30
                                        transition-all cursor-pointer shadow-inner
                                        "
                        >
                            <option value="pid" className="bg-slate-950 text-emerald-400">{t.sidebar_pid_name}</option>
                        </select>

                        {/* 3. 装饰性侧边线：增加工业细节感 */}
                        <div className="absolute left-0 top-1/4 bottom-1/4 w-[2px] bg-emerald-500/50 rounded-full"></div>
                    </div>
                    {schema.controller_params.map((p: any) => (
                        <ParamInput key={p.id} param={p} onChange={(value) => handleParamUpdate('algo', p.id, value)} />
                    ))}
                </div>
            </section>

            {/* 系统控制按钮 */}
            <div className="mt-auto grid grid-cols-2 gap-3 pt-6 border-t border-slate-900">
                <button className="bg-emerald-600/10 hover:bg-emerald-600 border border-emerald-600/50 text-emerald-500 hover:text-white py-2 rounded text-[10px] font-bold transition-all">
                    PAUSE
                </button>
                <button
                    onClick={async () => {
                        // await fetch('http://127.0.0.1:8000/simulation/reset', { method: 'POST' });
                        // fetchSchema();
                    }}
                    className="bg-slate-800 hover:bg-red-900/40 border border-slate-700 text-slate-300 py-2 rounded text-[10px] font-bold transition-all"
                >
                    {t.btn_reset}
                </button>
            </div>
        </aside>
    );
}