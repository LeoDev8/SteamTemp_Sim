"use client";

import React from 'react';
import { Activity, Globe } from 'lucide-react';
import { Language } from '@/i18n/dictionaries';

interface HeaderProps {
    t: any;
    currentLang: Language;
    onLangChange: (lang: Language) => void;
}

export default function Header({ t, currentLang, onLangChange }: HeaderProps) {
    const languages: { id: Language; label: string }[] = [
        { id: 'zh', label: '中文' },
        { id: 'en', label: 'EN' },
        { id: 'de', label: 'DE' },
    ];

    return (
        <header className="h-16 border-b border-slate-800 bg-slate-950/50 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-50">
            {/* Brand Section */}
            <div className="flex items-center gap-3">
                <div className="bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20">
                    <Activity size={20} className="text-emerald-500 animate-pulse" />
                </div>
                <div>
                    <h1 className="text-lg font-black tracking-tighter text-slate-100 uppercase">
                        {t.title}
                    </h1>
                    <div className="flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        <span className="text-[10px] text-emerald-500/80 font-bold uppercase tracking-widest">
                            {t.system_status}
                        </span>
                    </div>
                </div>
            </div>

            {/* Quick Stats / Lang Switcher */}
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 bg-slate-900/80 px-3 py-1.5 rounded-full border border-slate-800">
                    <Globe size={14} className="text-slate-500" />
                    <div className="flex gap-1">
                        {languages.map((l) => (
                            <button
                                key={l.id}
                                onClick={() => onLangChange(l.id)}
                                className={`px-2 py-0.5 text-[10px] font-bold rounded-md transition-all ${currentLang === l.id
                                        ? 'bg-emerald-600 text-white'
                                        : 'text-slate-500 hover:text-emerald-400'
                                    }`}
                            >
                                {l.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </header>
    );
}