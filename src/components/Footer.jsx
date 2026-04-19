import React from 'react';
import { useLocation } from 'react-router-dom';
import { Zap, School, Fingerprint } from 'lucide-react';

export const Footer = () => {
    const location = useLocation();

    // 如果在任務大廳 (GameHub) 甚至是遊戲內部，顯示特務司令部版本的 Footer
    const isAgentMode = location.pathname.startsWith('/games');

    if (isAgentMode) {
        return (
            <footer className="w-full bg-[#050910] border-t border-slate-800/80 mt-auto relative overflow-hidden text-slate-400 font-mono">
                {/* Top scanning line effect */}
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>

                {/* Warning Tape Border Bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-[repeating-linear-gradient(45deg,#f59e0b,#f59e0b_10px,#000_10px,#000_20px)] opacity-50" />

                <div className="max-w-7xl mx-auto px-6 py-2.5">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-3 md:gap-4">

                        {/* Left: Branding & Core */}
                        <div className="flex items-center gap-4 w-full md:w-auto">
                            <div className="bg-slate-900 border border-slate-700 p-2 flex items-center justify-center text-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.15)] rounded-sm shrink-0">
                                <Fingerprint size={22} strokeWidth={1.5} />
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h4 className="text-slate-200 font-black tracking-widest text-[13px] uppercase">AI-RED 學習框架</h4>
                                    <span className="bg-cyan-950/50 text-cyan-400 border border-cyan-800 text-[9px] px-1.5 py-[1px] tracking-widest rounded-sm">UPDATED · 2026.04.19</span>
                                </div>
                                <div className="flex gap-2 text-[9px] text-slate-500 tracking-[0.2em] font-bold uppercase mt-0.5">
                                    <span>Ascribe</span><span className="opacity-30">/</span>
                                    <span>Inquire</span><span className="opacity-30">/</span>
                                    <span>Reference</span><span className="opacity-30">/</span>
                                    <span>Evaluate</span><span className="opacity-30">/</span>
                                    <span>Document</span>
                                </div>
                            </div>
                        </div>

                        {/* Middle / Right: School & Specs */}
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-6 w-full md:w-auto border-t md:border-t-0 md:border-l border-slate-800 pt-2 md:pt-0 md:pl-6">

                            {/* School Info */}
                            <div className="flex flex-col gap-0.5">
                                <div className="flex items-center gap-2 text-slate-300 font-bold tracking-widest text-[12px]">
                                    <School size={14} className="text-slate-500" /> 台北市立松山高中
                                </div>
                                <div className="text-[10px] text-slate-500 flex items-center gap-2">
                                    <span className="uppercase tracking-widest">Subject: <span className="text-slate-400">研究方法與專題</span></span>
                                    <span className="inline-block bg-slate-900 border border-slate-700 px-1.5 py-[1px] rounded-sm text-[8px] text-slate-400 uppercase">Required</span>
                                </div>
                            </div>

                            {/* Systems */}
                            <div className="flex flex-col gap-1 md:items-end">
                                <div className="text-[9px] text-amber-500/80 tracking-widest flex items-center gap-1 font-bold uppercase">
                                    <Zap size={11} /> 課堂 ＋ 自學雙模式
                                </div>
                                <div className="flex gap-1 text-[8px] text-slate-400 font-bold uppercase tracking-wider">
                                    <span className="bg-slate-900 border border-slate-800 px-1.5 py-[1px] rounded-sm">可投影</span>
                                    <span className="bg-slate-900 border border-slate-800 px-1.5 py-[1px] rounded-sm">可手機</span>
                                    <span className="bg-slate-900 border border-slate-800 px-1.5 py-[1px] rounded-sm">可回家練習</span>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </footer>
        );
    }

    // Default: 學術/教學版 Footer (溫和、橫向儀表板_白底)
    return (
        <footer className="w-full bg-white border-t border-slate-200 mt-auto relative overflow-hidden text-slate-500 font-mono">
            {/* Top scanning line effect - light version */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500/20 to-transparent"></div>

            <div className="max-w-7xl mx-auto px-6 py-4">
                <div className="flex flex-col md:flex-row justify-between items-center gap-8 md:gap-4">

                    {/* Left: Branding & Core */}
                    <div className="flex items-center gap-6 w-full md:w-auto">
                        <div className="bg-blue-50/50 border border-blue-100 p-3 flex items-center justify-center text-blue-600 rounded-sm shrink-0">
                            <Fingerprint size={32} strokeWidth={1.5} />
                        </div>
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <h4 className="text-slate-800 font-black tracking-widest text-lg uppercase">AI-RED 學習框架</h4>
                                <span className="bg-blue-50 text-blue-600 border border-blue-200 text-[10px] px-2 py-0.5 tracking-widest rounded-sm font-bold">V2.0.4 ACTIVE</span>
                            </div>
                            <div className="flex gap-3 text-[10px] text-slate-500 tracking-[0.2em] font-bold uppercase">
                                <span>Ascribe</span><span className="opacity-30">/</span>
                                <span>Inquire</span><span className="opacity-30">/</span>
                                <span>Reference</span><span className="opacity-30">/</span>
                                <span>Evaluate</span><span className="opacity-30">/</span>
                                <span>Document</span>
                            </div>
                        </div>
                    </div>

                    {/* Middle / Right: School & Specs */}
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-8 w-full md:w-auto border-t md:border-t-0 md:border-l border-slate-200 pt-6 md:pt-0 md:pl-8">

                        {/* School Info */}
                        <div className="flex flex-col gap-1.5">
                            <div className="flex items-center gap-2 text-slate-700 font-bold tracking-widest text-sm">
                                <School size={16} className="text-slate-500" /> 台北市立松山高中
                            </div>
                            <div className="text-[11px] text-slate-500 flex items-center gap-2">
                                <span className="uppercase tracking-widest">Subject: <span className="text-slate-600 font-medium">研究方法與專題</span></span>
                                <span className="inline-block bg-slate-100 border border-slate-200 px-2 py-[2px] rounded-sm text-[9px] text-slate-500 uppercase font-bold">Required</span>
                            </div>
                        </div>

                        {/* Systems */}
                        <div className="flex flex-col gap-2 md:items-end">
                            <div className="text-[10px] text-amber-600 tracking-widest flex items-center gap-1.5 font-bold uppercase">
                                <Zap size={12} /> 課堂 ＋ 自學雙模式
                            </div>
                            <div className="flex gap-1.5 text-[9px] text-slate-600 font-bold uppercase tracking-wider">
                                <span className="bg-white border border-slate-200 px-2 py-[2px] rounded-sm shadow-sm">可投影</span>
                                <span className="bg-white border border-slate-200 px-2 py-[2px] rounded-sm shadow-sm">可手機</span>
                                <span className="bg-white border border-slate-200 px-2 py-[2px] rounded-sm shadow-sm">可回家練習</span>
                            </div>
                        </div>

                    </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200 flex justify-between items-center text-[9px] text-slate-400 tracking-[0.3em] uppercase">
                    <span>ACADEMIC ACCESS GRANTED</span>
                    <span>TEACHING SECTION // SSSH</span>
                </div>
            </div>
        </footer>
    );
};
