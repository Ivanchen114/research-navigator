import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Stethoscope, ArrowRight, Gamepad2, Lightbulb, HelpCircle, CheckCircle2, Map } from 'lucide-react';
import LessonMap from '../components/ui/LessonMap';
import { W6Data } from '../data/lessonMaps';

const triageQuestions = [
    {
        id: 1,
        question: '我要「比例/趨勢」還是「原因/故事」？',
        options: [
            { label: '比例趨勢', result: '問卷', color: '#2d5be3' },
            { label: '原因故事', result: '訪談', color: '#c9a84c' },
        ],
    },
    {
        id: 2,
        question: '我要「證明因果」還是「描述現象」？',
        options: [
            { label: '證明因果', result: '實驗', color: '#1a1a2e' },
            { label: '描述現象', result: '其他', color: '#8888aa' },
        ],
    },
    {
        id: 3,
        question: '我要「真實行為」還是「想法態度」？',
        options: [
            { label: '真實行為', result: '觀察', color: '#2e7d5a' },
            { label: '想法態度', result: '問卷/訪談', color: '#4a4a6a' },
        ],
    },
    {
        id: 4,
        question: '我要「整理現有研究」嗎？',
        options: [
            { label: '是', result: '文獻法', color: '#1a1a2e' },
            { label: '否', result: '三問判斷', color: '#8888aa' },
        ],
    },
];

const practiceItems = [
    { q: '我想知道全校高一每天睡滿7小時的人比例', a: '📋 問卷', reason: '要「比例」→ 問卷' },
    { q: '我想知道睡不著的同學睡前都在想什麼', a: '🎤 訪談', reason: '要「原因/故事」→ 訪談' },
    { q: '我想知道圖書館午休大家在做什麼', a: '👀 觀察', reason: '要「真實行為」→ 觀察' },
    { q: '我想知道某種記憶方法是否真的有效', a: '🧪 實驗', reason: '要「證明因果」→ 實驗' },
    { q: '手機使用會不會影響睡眠？影響機制是什麼？', a: '📋 問卷 + 🎤 訪談', reason: '測趨勢用問卷，問機制用訪談（複合方法）' },
];

export const ClinicPage = () => {
    const [revealedPractice, setRevealedPractice] = useState({});
    const [showLessonMap, setShowLessonMap] = useState(false);

    const toggleReveal = (idx) => {
        setRevealedPractice(prev => ({ ...prev, [idx]: !prev[idx] }));
    };

    return (
        <div className="max-w-[900px] mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 font-['Noto_Sans_TC',sans-serif] text-[14px] leading-[1.6] text-[#1a1a2e] pb-16">

            {/* ===== Lesson Map Toggle (Teacher Only) ===== */}
            <div className="flex justify-end pt-2 pb-0 -mb-8 relative z-20">
                <button
                    onClick={() => setShowLessonMap(!showLessonMap)}
                    className="flex items-center gap-1.5 text-[11px] text-[#8888aa] hover:text-[#e32d5b] transition-colors opacity-60 hover:opacity-100 font-['DM_Mono',monospace]"
                    title="教師專用：顯示課程地圖"
                >
                    <Map size={12} />
                    {showLessonMap ? 'Hide Map' : 'Instructor View'}
                </button>
            </div>

            {showLessonMap && (
                <div className="mb-4 animate-in slide-in-from-top-4 duration-300">
                    <LessonMap data={W6Data} />
                </div>
            )}

            {/* Header */}
            <header className="mb-14 pt-8 text-center max-w-[650px] mx-auto">
                <div className="text-[11px] font-['DM_Mono',monospace] tracking-[0.12em] uppercase text-[#e32d5b] mb-3 flex items-center justify-center gap-2">
                    <Stethoscope size={14} /> W5 核心模組
                </div>
                <h1 className="font-['Noto_Serif_TC',serif] text-[38px] font-bold leading-[1.25] text-[#1a1a2e] mb-4 tracking-[-0.02em]">
                    研究診所：<br className="hidden md:block" />
                    <span className="text-[#e32d5b] font-normal italic">掛號判斷工作坊</span>
                </h1>
                <p className="text-[15px] text-[#4a4a6a] leading-[1.75]">
                    Level 1 掛號診斷 — 你的研究問題該掛哪一科？掛錯科，後面所有努力都白費！用「分科三問」快速判斷。
                </p>
            </header>

            {/* 分科三問 */}
            <section className="mb-14">
                <div className="p-10 bg-[#fdf2f2] border border-[#f2dada] rounded-[10px] space-y-8">
                    <div className="flex items-center gap-3">
                        <Lightbulb className="text-[#e32d5b]" size={24} />
                        <h2 className="font-['Noto_Serif_TC',serif] text-[20px] font-bold text-[#1a1a2e]">
                            分科三問：掛號診斷標準
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        {triageQuestions.map((tq) => (
                            <div key={tq.id} className="bg-white p-6 rounded-[8px] border border-[#dddbd5] space-y-4 shadow-sm">
                                <div className="flex items-start gap-4">
                                    <span className="bg-[#1a1a2e] text-white w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5 font-['DM_Mono',monospace]">
                                        {tq.id}
                                    </span>
                                    <h3 className="font-bold text-[14px] text-[#1a1a2e] leading-tight">{tq.question}</h3>
                                </div>
                                <div className="flex flex-wrap gap-2 pl-9">
                                    {tq.options.map((opt, i) => (
                                        <div
                                            key={i}
                                            className="px-3 py-1.5 rounded-[4px] text-[11px] font-bold border border-[#dddbd5] bg-[#f8f7f4] text-[#1a1a2e]"
                                        >
                                            {opt.label} → <span style={{ color: opt.color }}>{opt.result}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 五大方法覽 */}
            <section className="mb-14">
                <div className="flex items-baseline gap-3 mb-6">
                    <h2 className="font-['Noto_Serif_TC',serif] text-[20px] font-bold text-[#1a1a2e]">
                        🔬 五大研究方法一覽
                    </h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-[1px] bg-[#dddbd5] border border-[#dddbd5] rounded-[10px] overflow-hidden">
                    {[
                        { icon: '📋', name: '問卷法', desc: '想知道多少人、什麼比例', example: '有多少人每天用手機超過3小時？' },
                        { icon: '🎤', name: '訪談法', desc: '想知道為什麼、怎麼想的', example: '為什麼學生喜歡用某個平台？' },
                        { icon: '🧪', name: '實驗法', desc: '想證明A會導致B', example: '聽音樂會不會影響學習效率？' },
                        { icon: '👀', name: '觀察法', desc: '想記錄真實行為', example: '學生討論時誰發言最多？' },
                        { icon: '📚', name: '文獻法', desc: '想整理別人的研究', example: '過去10年AI教育趨勢？' },
                    ].map((m) => (
                        <div key={m.name} className="bg-white p-6 text-center hover:bg-[#f8f7f4] transition-colors group">
                            <div className="text-[28px] mb-3 transition-transform group-hover:scale-110">{m.icon}</div>
                            <h4 className="font-bold text-[#1a1a2e] text-[14px] mb-2">{m.name}</h4>
                            <p className="text-[#8888aa] text-[12px] leading-relaxed mb-4">{m.desc}</p>
                            <div className="bg-[#f8f7f4] p-3 rounded-[4px] text-[10px] text-[#4a4a6a] italic leading-snug border border-[#dddbd5]/50">
                                例：{m.example}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* 急診分流練習 */}
            <section className="mb-14">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-baseline gap-3">
                        <h2 className="font-['Noto_Serif_TC',serif] text-[20px] font-bold text-[#1a1a2e]">
                            🚨 急診分流練習
                        </h2>
                    </div>
                </div>

                <div className="space-y-4">
                    {practiceItems.map((item, idx) => (
                        <div key={idx} className="bg-white border border-[#dddbd5] rounded-[10px] p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 group hover:border-[#1a1a2e] transition-colors">
                            <div className="flex items-start gap-4 flex-1">
                                <span className="text-[11px] font-bold text-[#8888aa] font-['DM_Mono',monospace] mt-1 uppercase">Case {String(idx + 1).padStart(2, '0')}</span>
                                <p className="text-[15px] font-medium text-[#1a1a2e] leading-relaxed italic">「{item.q}」</p>
                            </div>
                            <div className="flex flex-col items-end gap-3 min-w-[120px]">
                                <button
                                    onClick={() => toggleReveal(idx)}
                                    className={`px-4 py-2 rounded-[4px] text-[12px] font-bold border transition-all ${revealedPractice[idx] ? 'bg-[#1a1a2e] text-white border-[#1a1a2e]' : 'bg-white text-[#4a4a6a] border-[#dddbd5] hover:border-[#1a1a2e]'}`}
                                >
                                    {revealedPractice[idx] ? '隱藏結果' : '臨床診斷'}
                                </button>
                                {revealedPractice[idx] && (
                                    <div className="animate-in slide-in-from-right-4 duration-300 text-right">
                                        <p className="text-[14px] font-bold text-[#e32d5b]">{item.a}</p>
                                        <p className="text-[10px] text-[#8888aa] mt-1">{item.reason}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* 遊戲入口 */}
            <div className="bg-[#1a1a2e] rounded-[10px] p-10 text-white relative mb-14 overflow-hidden group">
                <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-500">
                    <Gamepad2 size={100} />
                </div>
                <div className="relative z-10 max-w-[500px]">
                    <div className="text-[#e32d5b] text-[10px] font-['DM_Mono',monospace] tracking-widest mb-4 uppercase">// Combat Module</div>
                    <h3 className="text-[22px] font-bold mb-4 font-['Noto_Serif_TC',serif]">行動代號：裝備</h3>
                    <p className="text-white/60 text-[14px] leading-relaxed mb-8">
                        11 個真實研究情境挑戰！練習從研究問題中快速判斷正確的研究科別。在實戰中磨練你的診斷眼光。
                    </p>
                    <Link
                        to="/game/tool-quiz"
                        className="inline-flex items-center gap-2 bg-white text-[#1a1a2e] px-8 py-3 rounded-[6px] text-[14px] font-bold hover:bg-[#f0ede6] transition-all"
                    >
                        進入行動任務 <ArrowRight size={18} />
                    </Link>
                </div>
            </div>

            {/* 下一站預告 */}
            <div className="bg-[#f8f7f4] border border-[#dddbd5] rounded-[10px] p-10 text-center">
                <p className="text-[#8888aa] text-[10px] font-['DM_Mono',monospace] tracking-[0.2em] mb-4 uppercase">// Roadmap Update</p>
                <h3 className="text-[20px] font-bold text-[#1a1a2e] mb-3 font-['Noto_Serif_TC',serif]">下一站：W8 工具設計工作坊</h3>
                <p className="text-[#4a4a6a] text-[14px] max-w-[600px] mx-auto leading-relaxed mb-8">
                    掛對科之後，緊接著要挑戰的是——<strong>你的工具設計得夠好嗎？</strong> 我們將從診斷處方開始，動手設計專屬的問卷、訪談大綱或實驗流程。
                </p>
                <Link
                    to="/tool-design"
                    className="inline-flex items-center gap-2 bg-[#1a1a2e] text-white px-8 py-3 rounded-[6px] text-[14px] font-bold hover:bg-[#2a2a4a] transition-all"
                >
                    前往工具設計工作坊 (W8) <ArrowRight size={18} />
                </Link>
            </div>

            {/* Navigation Out */}
            <div className="flex justify-start py-8">
                <Link to="/literature-review" className="text-[13px] font-bold text-[#8888aa] hover:text-[#1a1a2e] flex items-center gap-2 transition-colors">
                    ← 回 W6 文獻鑑識
                </Link>
            </div>

        </div>
    );
};
