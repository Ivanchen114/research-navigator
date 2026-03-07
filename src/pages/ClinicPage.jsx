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
            { label: '比例趨勢', result: '📋 問卷', color: 'blue' },
            { label: '原因故事', result: '🎤 訪談', color: 'orange' },
        ],
    },
    {
        id: 2,
        question: '我要「證明因果」還是「描述現象」？',
        options: [
            { label: '證明因果', result: '🧪 實驗', color: 'purple' },
            { label: '描述現象', result: '其他方法', color: 'slate' },
        ],
    },
    {
        id: 3,
        question: '我要「真實行為」還是「想法態度」？',
        options: [
            { label: '真實行為', result: '👀 觀察', color: 'teal' },
            { label: '想法態度', result: '📋 問卷 / 🎤 訪談', color: 'amber' },
        ],
    },
    {
        id: 4,
        question: '我要「整理現有研究」嗎？',
        options: [
            { label: '是', result: '📚 文獻法', color: 'emerald' },
            { label: '否', result: '用上面三問判斷', color: 'slate' },
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
        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">

            {/* ===== Lesson Map Toggle (Teacher Only) ===== */}
            <div className="flex justify-end pt-2 pb-0 -mb-6 relative z-20 pr-4">
                <button
                    onClick={() => setShowLessonMap(!showLessonMap)}
                    className="flex items-center gap-1.5 text-[11px] text-slate-300 hover:text-red-500 transition-colors opacity-60 hover:opacity-100 font-mono"
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
            <header className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100 mb-8 relative overflow-hidden text-center">
                <div className="absolute top-0 right-0 w-64 h-64 bg-red-100 rounded-full blur-3xl opacity-40 -translate-y-1/2 translate-x-1/3" />
                <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-red-700 border border-red-100 shadow-sm mb-4">
                        <Stethoscope size={16} /> W5 核心模組
                    </div>
                    <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-4 flex items-center justify-center gap-3">
                        🏥 研究診所：<span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-600 drop-shadow-sm">掛號判斷工作坊</span>
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
                        Level 1 掛號診斷 — 你的研究問題該掛哪一科？<br />
                        <span className="text-sm">掛錯科，後面所有努力都白費！用「分科三問」快速判斷。</span>
                    </p>
                </div>
            </header>

            {/* 分科三問 */}
            <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-3xl shadow-sm border border-red-100 p-6 md:p-8 hover:shadow-md transition-shadow">
                <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                    <Lightbulb className="text-amber-500" size={28} />
                    分科三問：掛號診斷標準
                </h2>
                <p className="text-slate-600 mb-6 leading-relaxed">問自己以下問題，就知道該掛哪科：</p>

                <div className="grid md:grid-cols-2 gap-4">
                    {triageQuestions.map((tq) => (
                        <div key={tq.id} className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                            <div className="flex items-start gap-3 mb-3">
                                <span className="bg-red-500 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold shrink-0">
                                    {tq.id}
                                </span>
                                <h3 className="font-bold text-slate-800 leading-snug">{tq.question}</h3>
                            </div>
                            <div className="flex flex-wrap gap-2 ml-10">
                                {tq.options.map((opt, i) => (
                                    <div
                                        key={i}
                                        className={`px-3 py-1.5 rounded-lg text-sm font-medium border bg-${opt.color}-50 border-${opt.color}-200 text-${opt.color}-800`}
                                        style={{
                                            backgroundColor: `var(--color-${opt.color}, #f8fafc)`,
                                        }}
                                    >
                                        {opt.label} → <strong>{opt.result}</strong>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 五大方法總覽 */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 md:p-8 hover:shadow-md transition-shadow">
                <h2 className="text-2xl font-bold text-slate-800 mb-6">五大研究方法一覽</h2>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {[
                        { icon: '📋', name: '問卷法', desc: '想知道多少人、什麼比例', example: '全校有多少人每天用手機超過3小時？', color: 'blue' },
                        { icon: '🎤', name: '訪談法', desc: '想知道為什麼、怎麼想的', example: '為什麼學生喜歡用某個社群平台？', color: 'orange' },
                        { icon: '🧪', name: '實驗法', desc: '想證明A會導致B', example: '聽音樂會不會影響學習效率？', color: 'purple' },
                        { icon: '👀', name: '觀察法', desc: '想記錄真實行為', example: '學生在小組討論時誰發言最多？', color: 'teal' },
                        { icon: '📚', name: '文獻法', desc: '想整理別人的研究', example: '過去10年AI教育研究的趨勢？', color: 'emerald' },
                    ].map((m) => (
                        <div key={m.name} className="bg-slate-50 rounded-2xl p-5 border border-slate-200 text-center hover:-translate-y-1 transition-transform cursor-default">
                            <div className="text-4xl mb-3">{m.icon}</div>
                            <h3 className="font-bold text-slate-800 text-sm mb-2">{m.name}</h3>
                            <p className="text-xs text-slate-600 mb-3 leading-relaxed">{m.desc}</p>
                            <p className="text-[10px] text-slate-500 italic bg-white p-2 rounded-lg border border-slate-100">例：{m.example}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* 急診分流練習 */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 md:p-8 hover:shadow-md transition-shadow">
                <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                    <HelpCircle className="text-blue-500" size={28} />
                    急診分流練習
                </h2>
                <p className="text-slate-600 mb-6 leading-relaxed">看到研究問題，試著用分科三問判斷該掛哪科！點擊「顯示答案」檢查你的判斷。</p>

                <div className="space-y-3">
                    {practiceItems.map((item, idx) => (
                        <div key={idx} className="bg-slate-50 rounded-lg border border-slate-200 p-4 hover:bg-slate-100 transition-colors">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                                <div className="flex items-start gap-3 flex-1">
                                    <span className="bg-slate-300 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                                        {idx + 1}
                                    </span>
                                    <p className="text-slate-700 font-medium text-sm">「{item.q}」</p>
                                </div>
                                <button
                                    onClick={() => toggleReveal(idx)}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors shrink-0"
                                >
                                    {revealedPractice[idx] ? '隱藏答案' : '顯示答案'}
                                </button>
                            </div>
                            {revealedPractice[idx] && (
                                <div className="mt-3 ml-9 bg-white p-3 rounded-lg border border-blue-100 animate-in fade-in slide-in-from-top-2 duration-300">
                                    <p className="text-sm font-bold text-blue-800 flex items-center gap-2">
                                        <CheckCircle2 size={16} className="text-green-500" />
                                        {item.a}
                                    </p>
                                    <p className="text-xs text-slate-500 mt-1">理由：{item.reason}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* 遊戲入口 */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl shadow-lg p-6 md:p-8 text-white hover:shadow-xl transition-shadow">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                            <Gamepad2 size={24} />
                            🎮 行動代號：裝備
                        </h3>
                        <p className="text-indigo-100 text-sm">
                            11 個真實研究情境挑戰！用分科三問判斷每個題目該用什麼工具。
                        </p>
                    </div>
                    <Link
                        to="/game/tool-quiz"
                        className="bg-white text-indigo-700 hover:bg-indigo-50 px-6 py-3 rounded-xl font-bold transition-all shadow-md flex items-center gap-2 group shrink-0"
                    >
                        進入行動任務
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>

            {/* W8 預告 */}
            <div className="bg-slate-50 rounded-3xl border border-slate-200 p-8 text-center hover:shadow-md transition-shadow">
                <h3 className="text-xl font-bold text-slate-800 mb-4">📌 下一站：W8 工具設計工作坊</h3>
                <p className="text-slate-600 mb-6 leading-relaxed">
                    掛對科之後，你們要學的是——<strong>工具設計得好不好？</strong>那是另一種診斷能力！
                    <br />W8 會教你「處方診斷」+ 動手設計自己的問卷/訪談大綱/實驗流程。
                </p>
                <Link
                    to="/tool-design"
                    className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-6 py-3 rounded-lg font-bold text-sm transition-colors"
                >
                    前往工具設計工作坊 (W8)
                    <ArrowRight size={16} />
                </Link>
            </div>

        </div>
    );
};
