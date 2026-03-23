import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, CheckCircle, ChevronRight, AlertCircle } from 'lucide-react';

const CHAPTERS = [
    {
        num: 1,
        title: '謠言現場',
        method: '觀察法',
        desc: '系統性觀察謠言在三個平台的傳播模式，建立可追溯的擴散地圖',
        path: '/echo/ch1',
        completeKey: null,
    },
    {
        num: 2,
        title: '目擊者',
        method: '訪談法',
        desc: '找到三個聲稱最早看到截圖的人，在不破壞信任的前提下找出矛盾',
        path: '/echo/ch2',
        completeKey: 'echo_ch1_complete',
    },
    {
        num: 3,
        title: '聲紋追蹤',
        method: '問卷法',
        desc: '在海量回應裡辨認：哪些說法像是從同一個看不見的源頭複製出來',
        path: '/echo/ch3',
        completeKey: 'echo_ch2_complete',
    },
    {
        num: 4,
        title: '截圖解剖',
        method: '文獻分析',
        desc: '比對截圖的三個版本，以及班聯會公開選舉紀錄的時間軸',
        path: '/echo/ch4',
        completeKey: 'echo_ch3_complete',
    },
    {
        num: 5,
        title: '可控重現',
        method: '實驗法',
        desc: '測試截圖的偽造門檻——「截圖存在」不等於「事情發生過」',
        path: '/echo/ch5',
        completeKey: 'echo_ch4_complete',
    },
];

const METHOD_COLORS = {
    '觀察法':   { dot: 'bg-indigo-400',  text: 'text-indigo-400',  border: 'border-indigo-700/40'  },
    '訪談法':   { dot: 'bg-violet-400',  text: 'text-violet-400',  border: 'border-violet-700/40'  },
    '問卷法':   { dot: 'bg-slate-400',   text: 'text-slate-400',   border: 'border-slate-600/40'   },
    '文獻分析': { dot: 'bg-cyan-400',    text: 'text-cyan-400',    border: 'border-cyan-700/40'    },
    '實驗法':   { dot: 'bg-amber-300',   text: 'text-amber-300',   border: 'border-amber-700/40'   },
};

export const EchoHub = () => {
    const navigate = useNavigate();
    const [chapterStates, setChapterStates] = useState({});
    const [agentName, setAgentName] = useState('');

    useEffect(() => {
        const name = localStorage.getItem('rib_agent_name');
        if (name) setAgentName(name);

        const states = {};
        CHAPTERS.forEach(ch => {
            states[ch.num] = {
                complete: !!localStorage.getItem(`echo_ch${ch.num}_complete`),
                optimal:  !!localStorage.getItem(`echo_ch${ch.num}_optimal`),
                unlocked: ch.completeKey === null || !!localStorage.getItem(ch.completeKey),
            };
        });
        setChapterStates(states);
    }, []);

    const completedCount = Object.values(chapterStates).filter(s => s.complete).length;
    const allComplete   = completedCount === 5;
    const allOptimal    = allComplete && ['ch1','ch2','ch3','ch4','ch5']
        .every(n => localStorage.getItem(`echo_${n}_optimal`) === 'true');

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 font-sans relative">

            {/* 背景：keyart + overlay + scanline */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-fixed pointer-events-none"
                style={{ backgroundImage: "url('/assets/echo/keyart/echo_keyart_hub_v1.webp')" }}
            />
            {/* keyart 尚未生成時的漸層底圖 */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-slate-950 to-slate-950 pointer-events-none" />
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-[2px] pointer-events-none z-0" />
            <div
                className="absolute inset-0 opacity-10 pointer-events-none mix-blend-overlay z-0"
                style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/%3E%3C/svg%3E')" }}
            />
            <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(100,100,255,0.04),rgba(0,0,255,0.02),rgba(100,0,255,0.04))] bg-[length:100%_4px,3px_100%] opacity-20 z-0" />

            {/* Top bar */}
            <div className="relative z-10 border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md px-6 py-3 flex items-center gap-3 shadow-md">
                <button
                    onClick={() => navigate('/games')}
                    className="text-slate-600 hover:text-slate-400 transition-colors font-mono text-xs tracking-widest"
                >
                    ← 任務中心
                </button>
                <span className="text-slate-700 mx-1">|</span>
                <span className="text-indigo-400 font-mono text-xs tracking-widest">R.I.B. 調查檔案</span>
                <span className="text-slate-600">/</span>
                <span className="text-slate-300 font-mono text-xs">回聲</span>
                {agentName && (
                    <span className="ml-auto text-slate-500 font-mono text-xs">{agentName}</span>
                )}
            </div>

            <div className="max-w-3xl mx-auto px-6 py-12 relative z-10">

                {/* Case Header */}
                <div className="mb-10">
                    <div className="text-indigo-400/60 font-mono text-xs tracking-widest mb-3">
                        R.I.B. 調查檔案 / 檔案二
                    </div>
                    <h1 className="text-4xl font-black text-white tracking-tight mb-1">回聲</h1>
                    <div className="text-slate-400 font-mono text-sm tracking-widest mb-6">ECHO</div>
                    <p className="text-slate-400 leading-relaxed max-w-xl">
                        班聯會長選舉結束三天後，一張截圖開始在學校群組裡流傳，指控現任會長買票。
                        短短 48 小時內，沒有人停下來問一句：這張截圖是真的嗎？
                        你接到任務。真相是什麼，你不知道。五週，五種方法，去查清楚。
                    </p>
                </div>

                {/* Progress bar */}
                <div className="mb-10">
                    <div className="flex justify-between text-xs font-mono mb-2">
                        <span className="text-slate-500">調查進度</span>
                        <span className="text-indigo-400">{completedCount} / 5 章完成</span>
                    </div>
                    <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-indigo-800 to-indigo-400 transition-all duration-700"
                            style={{ width: `${(completedCount / 5) * 100}%` }}
                        />
                    </div>
                    {allComplete && (
                        <div className={`mt-3 text-xs font-mono text-center ${allOptimal ? 'text-amber-400' : 'text-indigo-400/70'}`}>
                            {allOptimal
                                ? '★ 完整調查紀錄解鎖 — 所有幽靈線索已記錄在案'
                                : '✓ 案件結案 — 仍有部分細節標著「待確認」'}
                        </div>
                    )}
                </div>

                {/* Chapter list */}
                <div className="space-y-3 mb-10">
                    {CHAPTERS.map(ch => {
                        const state      = chapterStates[ch.num] || {};
                        const color      = METHOD_COLORS[ch.method];
                        const isComplete = state.complete;
                        const isOptimal  = state.optimal;
                        const isUnlocked = state.unlocked;

                        return (
                            <button
                                key={ch.num}
                                onClick={() => isUnlocked && navigate(ch.path)}
                                disabled={!isUnlocked}
                                className={`w-full text-left rounded border p-5 transition-all group
                                    ${isComplete
                                        ? 'bg-indigo-950/20 border-indigo-700/30 hover:bg-indigo-950/30'
                                        : isUnlocked
                                            ? 'bg-slate-900 border-slate-700 hover:border-indigo-600/50 hover:bg-slate-800'
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
                                                <span className="text-[10px] font-mono text-amber-400 bg-amber-950/40 border border-amber-700/30 px-1.5 py-0.5 rounded-sm flex-shrink-0">
                                                    ★ 完整線索
                                                </span>
                                            )}
                                            {isComplete && !isOptimal && (
                                                <CheckCircle size={14} className="text-indigo-400 flex-shrink-0" />
                                            )}
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
                                                    ? <CheckCircle size={16} className="text-indigo-400" />
                                                    : <ChevronRight size={16} className="text-slate-500 group-hover:text-indigo-400 transition-colors" />
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
                        每一章必須依序完成。前一章取得的線索，將影響下一章的調查方向。
                        任務沒有分數，只有完成與未完成。每一章的節點三，有時候有兩種「通過」——
                        找到那個差異，才算真正看清了這個案件。
                    </p>
                </div>

                {/* Reset */}
                {completedCount > 0 && (
                    <div className="mt-8 text-center pt-6">
                        <button
                            onClick={() => {
                                if (window.confirm('確定要清除所有「回聲」的調查紀錄嗎？這將會重置所有章節進度。')) {
                                    ['ch1','ch2','ch3','ch4','ch5'].forEach(n => {
                                        localStorage.removeItem(`echo_${n}_complete`);
                                        localStorage.removeItem(`echo_${n}_optimal`);
                                    });
                                    window.location.reload();
                                }
                            }}
                            className="inline-flex items-center gap-2 text-[10px] text-slate-500/50 hover:text-rose-400 font-mono tracking-widest transition-colors uppercase border border-slate-800 hover:border-rose-900/50 px-3 py-1.5 rounded-sm bg-slate-900/30 backdrop-blur-sm"
                        >
                            <AlertCircle size={12} /> 清除本案調查紀錄
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
};
