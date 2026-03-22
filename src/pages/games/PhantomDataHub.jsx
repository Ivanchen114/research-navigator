import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, CheckCircle, ChevronRight, FileText, AlertCircle } from 'lucide-react';

const CHAPTERS = [
    { num: 1, title: '潛伏監看', method: '觀察法', desc: '在不驚動目標的情況下，記錄電腦區的異常行為模式', path: '/phantom/ch1', completeKey: null },
    { num: 2, title: '線人接觸', method: '訪談法', desc: '從戒備的知情者口中，取得無法用觀察取得的關鍵線索', path: '/phantom/ch2', completeKey: 'phantom_ch1_complete' },
    { num: 3, title: '擴散追查', method: '問卷法', desc: '確認工具在校內的擴散規模，以及使用者的分佈樣態', path: '/phantom/ch3', completeKey: 'phantom_ch2_complete' },
    { num: 4, title: '檔案比對', method: '文獻分析', desc: '交叉比對三年前的原始得獎報告與現有學術文獻', path: '/phantom/ch4', completeKey: 'phantom_ch3_complete' },
    { num: 5, title: '重現測試', method: '實驗法', desc: '在實驗室中還原工具運作方式，建立完整的舉證鏈', path: '/phantom/ch5', completeKey: 'phantom_ch4_complete' },
];

const METHOD_COLORS = {
    '觀察法':   { dot: 'bg-sky-400',    text: 'text-sky-400',    border: 'border-sky-700/40' },
    '訪談法':   { dot: 'bg-violet-400', text: 'text-violet-400', border: 'border-violet-700/40' },
    '問卷法':   { dot: 'bg-amber-400',  text: 'text-amber-400',  border: 'border-amber-700/40' },
    '文獻分析': { dot: 'bg-emerald-400',text: 'text-emerald-400',border: 'border-emerald-700/40' },
    '實驗法':   { dot: 'bg-rose-400',   text: 'text-rose-400',   border: 'border-rose-700/40' },
};

export const PhantomDataHub = () => {
    const navigate = useNavigate();
    const [chapterStates, setChapterStates] = useState({});
    const [agentName, setAgentName] = useState('');

    useEffect(() => {
        const name = localStorage.getItem('rib_agent_name');
        if (name) setAgentName(name);

        const states = {};
        CHAPTERS.forEach(ch => {
            states[ch.num] = {
                complete: !!localStorage.getItem(`phantom_ch${ch.num}_complete`),
                optimal: !!localStorage.getItem(`phantom_ch${ch.num}_optimal`),
                unlocked: ch.completeKey === null || !!localStorage.getItem(ch.completeKey),
            };
        });
        setChapterStates(states);
    }, []);

    const completedCount = Object.values(chapterStates).filter(s => s.complete).length;

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">

            {/* Top bar */}
            <div className="border-b border-slate-800 bg-slate-900/80 px-6 py-3 flex items-center gap-3">
                <button onClick={() => navigate('/games')} className="text-slate-600 hover:text-slate-400 transition-colors font-mono text-xs tracking-widest">← 任務中心</button>
                <span className="text-slate-700 mx-1">|</span>
                <span className="text-amber-500 font-mono text-xs tracking-widest">R.I.B. 調查檔案</span>
                <span className="text-slate-600">/</span>
                <span className="text-slate-300 font-mono text-xs">幽靈數據</span>
                {agentName && <span className="ml-auto text-slate-500 font-mono text-xs">{agentName}</span>}
            </div>

            <div className="max-w-3xl mx-auto px-6 py-12">

                {/* Case Header */}
                <div className="mb-10">
                    <div className="text-amber-500/60 font-mono text-xs tracking-widest mb-3">R.I.B. 調查檔案 / 檔案一</div>
                    <h1 className="text-4xl font-black text-white tracking-tight mb-1">幽靈數據</h1>
                    <div className="text-slate-400 font-mono text-sm tracking-widest mb-6">PHANTOM DATA</div>
                    <p className="text-slate-400 leading-relaxed max-w-xl">
                        三年前，一份得獎研究報告的數據可能是偽造的。更危險的是，製造那份數據的工具，正在校園裡悄悄流傳。你有五週時間，用五種研究方法，找出真相。
                    </p>
                </div>

                {/* Progress */}
                <div className="mb-10">
                    <div className="flex justify-between text-xs font-mono mb-2">
                        <span className="text-slate-500">調查進度</span>
                        <span className="text-amber-500">{completedCount} / 5 章完成</span>
                    </div>
                    <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-amber-700 to-amber-400 transition-all duration-700"
                            style={{ width: `${(completedCount / 5) * 100}%` }}
                        />
                    </div>
                </div>

                {/* Chapters */}
                <div className="space-y-3 mb-10">
                    {CHAPTERS.map(ch => {
                        const state = chapterStates[ch.num] || {};
                        const color = METHOD_COLORS[ch.method];
                        const isComplete = state.complete;
                        const isOptimal = state.optimal;
                        const isUnlocked = state.unlocked;

                        return (
                            <button
                                key={ch.num}
                                onClick={() => isUnlocked && navigate(ch.path)}
                                disabled={!isUnlocked}
                                className={`w-full text-left rounded border p-5 transition-all group
                                    ${isComplete
                                        ? 'bg-emerald-950/20 border-emerald-700/30 hover:bg-emerald-950/30'
                                        : isUnlocked
                                            ? 'bg-slate-900 border-slate-700 hover:border-amber-600/50 hover:bg-slate-800'
                                            : 'bg-slate-900/40 border-slate-800 opacity-50 cursor-not-allowed'
                                    }`}
                            >
                                <div className="flex items-center gap-4">
                                    {/* Chapter number */}
                                    <div className="font-mono text-2xl font-black text-slate-700 w-8 flex-shrink-0">
                                        {String(ch.num).padStart(2, '0')}
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-white font-bold">{ch.title}</span>
                                            {isOptimal && (
                                                <span className="text-[10px] font-mono text-amber-400 bg-amber-950/40 border border-amber-700/30 px-1.5 py-0.5 rounded-sm flex-shrink-0">★ 完整線索</span>
                                            )}
                                            {isComplete && !isOptimal && <CheckCircle size={14} className="text-emerald-400 flex-shrink-0" />}
                                        </div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <div className={`w-1.5 h-1.5 rounded-full ${color.dot} flex-shrink-0`} />
                                            <span className={`font-mono text-xs ${color.text}`}>{ch.method}</span>
                                        </div>
                                        {isUnlocked && (
                                            <div className="text-slate-500 text-xs leading-relaxed">{ch.desc}</div>
                                        )}
                                    </div>

                                    {/* Right icon */}
                                    <div className="flex-shrink-0">
                                        {!isUnlocked
                                            ? <Lock size={16} className="text-slate-600" />
                                            : isOptimal
                                                ? <span className="text-amber-400 text-base leading-none">★</span>
                                                : isComplete
                                                    ? <CheckCircle size={16} className="text-emerald-400" />
                                                    : <ChevronRight size={16} className="text-slate-500 group-hover:text-amber-400 transition-colors" />
                                        }
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* Note */}
                <div className="border border-slate-800 rounded p-4 flex items-start gap-3">
                    <AlertCircle size={14} className="text-slate-600 flex-shrink-0 mt-0.5" />
                    <p className="text-slate-500 text-xs leading-relaxed">
                        每一章必須依序完成。前一章取得的線索，將影響下一章的調查方向。任務沒有分數，只有完成與未完成。
                    </p>
                </div>

            </div>
        </div>
    );
};
