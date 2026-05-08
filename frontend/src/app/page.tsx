"use client";

import React, { useEffect, useState } from 'react';
import { dictionaries, Language } from '@/i18n/dictionaries';

import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import RealTimeChart from '@/components/dashboard/RealTimeChart';
import MetricsPanel from '@/components/dashboard/MetricsPanel';
import StatusRibbon from '@/components/dashboard/StatusRibbon';

import { useSimulation } from '@/hooks/useSimulation';

export default function DashboardPage() {
  // 1. 全局语言状态
  const [lang, setLang] = useState<Language>('en');
  const t = dictionaries[lang];

  // 2. 模拟选中的模型 (未来从后端获取)
  const [activeModelId, setActiveModelId] = useState('boiler');

  const [mockData, setMockData] = useState<any[]>([]);
  const { dataHistory, isConnected } = useSimulation();

  const latestData = dataHistory.length > 0
    ? dataHistory[dataHistory.length - 1]
    : { pv: 0, sp: 540, mv: 0, time: "--:--" };

  return (
    <main className="flex h-screen w-full bg-[#020617] text-slate-200 font-mono overflow-hidden">

      {/* LEFT SIDEBAR: 模型切换与参数调优 (占固定宽度) */}
      <Sidebar
        t={t}
      // activeModelId={activeModelId}
      // onModelChange={setActiveModelId}
      />

      {/* RIGHT CONTENT AREA: 导航 + 主看板 */}
      <section className="flex-1 flex flex-col min-w-0 relative">

        {/* HEADER: 标题、系统状态与语言切换 */}
        <Header
          t={t}
          currentLang={lang}
          onLangChange={setLang}
        />

        {/* DASHBOARD GRID: 核心数据展示区 */}
        <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-12 gap-6 max-w-[1600px] mx-auto">

            {/* 中间核心：波形趋势图 (占据 8/12 列) */}
            <div className="col-span-12 xl:col-span-8 space-y-6">
              <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-2xl backdrop-blur-sm">
                <RealTimeChart t={t} data={dataHistory} />
              </div>

              {/* 快速状态条：PV, SP, MV 的数字快照 */}
              <StatusRibbon t={t} pv={latestData.pv} mv={latestData.mv} sp={latestData.sp} />
            </div>

            {/* 右侧评估矩阵：自控原理参数展示 (占据 4/12 列) */}
            <div className="col-span-12 xl:col-span-4">
              <MetricsPanel t={t} />
            </div>

          </div>
        </div>

        {/* DECORATION: 底部发光装饰线条 (增加赛博感) */}
        <div className="h-1 w-full bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent"></div>
      </section>

      {/* 全局背景装饰 (赛博工业风格纹理) */}
      <div className="fixed inset-0 pointer-events-none opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
    </main>
  );
}