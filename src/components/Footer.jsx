import React from 'react';
import { Target, Lightbulb, ScanText, CheckCircle, FileText, Zap, School } from 'lucide-react';

export const Footer = () => {
    return (
        <footer className="w-full bg-[#080d14] border-t border-slate-800/60 mt-auto relative overflow-hidden">
            {/* Warning Tape Border Bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-[repeating-linear-gradient(45deg,#f59e0b,#f59e0b_8px,#000_8px,#000_16px)] opacity-80" />

            <div className="max-w-7xl mx-auto px-4 py-12 pb-16">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    {/* Feature 1: AI-RED Framework */}
                    <div className="bg-[#0f172a]/60 border border-slate-700/50 rounded-2xl p-6 flex flex-col items-center text-center hover:bg-slate-800/40 transition-colors shadow-inner relative group">
                        <div className="absolute -top-4 w-12 h-12 bg-slate-900 rounded-full border border-rose-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(244,63,94,0.15)] group-hover:scale-110 transition-transform">
                            <Target size={24} className="text-rose-400" />
                        </div>
                        <h4 className="text-slate-300 font-bold tracking-widest mt-6 mb-3 flex items-center justify-center gap-2">
                            AI-RED 學習框架
                        </h4>
                        <div className="text-[11px] text-slate-500 space-y-1.5 font-mono tracking-wider flex flex-col gap-1 items-center justify-center w-full max-w-[200px]">
                            <div className="flex justify-between w-full"><span className="text-slate-400">A</span>scribe</div>
                            <div className="flex justify-between w-full"><span className="text-slate-400">I</span>nquire</div>
                            <div className="w-full border-b border-slate-700/50 my-1"></div>
                            <div className="flex justify-between w-full"><span className="text-slate-400">R</span>eference</div>
                            <div className="flex justify-between w-full"><span className="text-slate-400">E</span>valuate</div>
                            <div className="flex justify-between w-full"><span className="text-slate-400">D</span>ocument</div>
                        </div>
                    </div>

                    {/* Feature 2: School Brand */}
                    <div className="bg-[#0f172a]/60 border border-slate-700/50 rounded-2xl p-6 flex flex-col items-center text-center hover:bg-slate-800/40 transition-colors shadow-inner relative group mt-8 md:mt-0">
                        <div className="absolute -top-4 w-12 h-12 bg-slate-900 rounded-full border border-sky-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(14,165,233,0.15)] group-hover:scale-110 transition-transform">
                            <School size={24} className="text-sky-400" />
                        </div>
                        <h4 className="text-slate-300 font-bold tracking-widest mt-6 mb-3">
                            台北市立松山高中
                        </h4>
                        <p className="text-xs text-slate-500 font-medium tracking-widest leading-relaxed">
                            研究方法與專題<br />
                            <span className="inline-block mt-2 bg-slate-800/80 border border-slate-700 px-3 py-1 rounded text-[10px] text-slate-400">高一必修</span>
                        </p>
                    </div>

                    {/* Feature 3: Dual Mode */}
                    <div className="bg-[#0f172a]/60 border border-slate-700/50 rounded-2xl p-6 flex flex-col items-center text-center hover:bg-slate-800/40 transition-colors shadow-inner relative group mt-8 md:mt-0">
                        <div className="absolute -top-4 w-12 h-12 bg-slate-900 rounded-full border border-amber-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.15)] group-hover:scale-110 transition-transform">
                            <Zap size={24} className="text-amber-400" />
                        </div>
                        <h4 className="text-slate-300 font-bold tracking-widest mt-6 mb-3">
                            課堂 ＋ 自學雙模式
                        </h4>
                        <div className="flex gap-2 text-[10px] text-slate-500 font-bold">
                            <span className="bg-slate-800 border border-slate-700 px-2 py-1 rounded">可投影</span>
                            <span className="bg-slate-800 border border-slate-700 px-2 py-1 rounded">可手機</span>
                            <span className="bg-slate-800 border border-slate-700 px-2 py-1 rounded">可回家練習</span>
                        </div>
                    </div>

                </div>
            </div>
        </footer>
    );
};
