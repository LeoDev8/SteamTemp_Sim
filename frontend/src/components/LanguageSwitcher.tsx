"use client";
import React from 'react';
import { Languages } from 'lucide-react';
import { Language } from '@/i18n/dictionaries';

interface Props {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
}

export default function LanguageSwitcher({ currentLang, onLanguageChange }: Props) {
  const langs: { id: Language; label: string }[] = [
    { id: 'zh', label: '中文' },
    { id: 'en', label: 'EN' },
    { id: 'de', label: 'DE' },
  ];

  return (
    <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-lg border border-emerald-500/30">
      <Languages size={16} className="ml-2 text-emerald-500" />
      {langs.map((lang) => (
        <button
          key={lang.id}
          onClick={() => onLanguageChange(lang.id)}
          className={`px-3 py-1 text-xs font-bold rounded transition-all ${
            currentLang === lang.id 
            ? 'bg-emerald-600 text-white shadow-lg' 
            : 'text-slate-400 hover:text-emerald-400'
          }`}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
}