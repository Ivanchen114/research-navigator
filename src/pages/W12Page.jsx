import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Target, ArrowRight, Play, Presentation, CheckSquare, Award, AlertCircle, BarChart3, Database, MessageSquare, Bot, Map } from 'lucide-react';
import CourseArc from '../components/ui/CourseArc';

const closingBooks = [
    {
        icon: <BarChart3 className="text-blue-500" size={24} />,
        name: '問卷法',
        done: '已關閉表單，下載 csv/Excel 檔，且有效問卷達預定數量。',
        notDone: '還在等幾個人填 / 已經下載但裡面有一堆無效亂填的還沒刪。'
    },
    {
        icon: <MessageSquare className="text-orange-500" size={24} />,
        name: '訪談法',
        done: '受訪者皆已訪完，且已輸出逐字稿（可用 AI 輔助）並標註重點。',
        notDone: '只有錄音檔 / 逐字稿是一大坨沒有分段的文字。'
    },
    {
        icon: <CheckSquare className="text-purple-500" size={24} />,
        name: '實驗/觀察',
        done: '所有組別/場次的紀錄表皆已轉為數位表格，分數/次數已算好加總。',
        notDone: '資料還散落在三張手寫紀錄表上，字跡看不太懂。'
    },
    {
        icon: <Database className="text-emerald-500" size={24} />,
        name: '文獻法',
        done: '已完成 5 篇核心文獻的比較表格，並找出彼此的矛盾或共識。',
        notDone: '下載了 10 篇 PDF 但完全沒看 / 只把摘要複製貼上。'
    }
];

export const W12Page = () => {
    const [templateFilled, setTemplateFilled] = useState({
        q1: '', q2: '', q3: '', q4: ''
    });
    const [showLessonMap, setShowLessonMap] = useState(false);

    const updateTemplate = (key, value) => {
        setTemplateFilled(prev => ({ ...prev, [key]: value }));
    };

    const isPitchReady = Object.values(templateFilled).every(v => v.trim().length > 0);

    return (
        <div className="max-w-[1000px] mx-auto px-6 lg:px-12 py-12 pb-32">
            {/* TOP BAR / NAVIGATION PATH */}
            <div className="flex items-center justify-between border-b border-[#dddbd5] pb-4 mb-16">
                <div className="text-[11px] font-mono text-[#8888aa] flex items-center gap-2">
                    研究方法與專題 / 資料蒐集 / <span className="text-[#1a1a2e] font-bold">研究診所 W13</span>
                </div>
                <div className="flex items-center gap-4">
                    <span className="bg-[#f0ede6] text-[#1a1a2e] text-[10px] font-bold px-2 py-0.5 rounded-[2px] font-mono">100 MINS</span>
                    <button
                        onClick={() => setShowLessonMap(!showLessonMap)}
                        className="text-[11px] text-[#8888aa] hover:text-[#2d5be3] transition-colors flex items-center gap-1 font-mono"
                    >
                        <Map size={12} /> {showLessonMap ? 'Hide Plan' : 'Instructor View'}
                    </button>
                    <span className="bg-[#1a1a2e] text-white text-[10px] font-bold px-2 py-0.5 rounded-[2px] font-mono">AI-RED · D</span>
                </div>
            </div>

            {showLessonMap && (
                <div className="mb-12 animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="p-8 bg-[#f8f7f4] border border-[#dddbd5] rounded-xl text-center text-[#8888aa]">
                        W13 為中期盤點週，主要進行電梯簡報與資料收網檢核。
                    </div>
                </div>
            )}

            {/* PAGE HEADER */}
            <header className="mb-14">
                <div className="text-[11px] font-mono text-[#2d5be3] mb-3 tracking-[0.06em]">🎯 W13 · 研究診所 II</div>
                <h1 className="font-serif text-[42px] font-bold leading-[1.2] text-[#1a1a2e] mb-4 tracking-[-0.01em]">
                    結案倒數：<span className="text-[#2d5be3]">中期盤點與資料收網</span>
                </h1>
                <p className="text-[16px] text-[#4a4a6a] max-w-[680px] leading-[1.75] mb-10">
                    下半場的期中考：3 分鐘電梯簡報。資料收得差不多了嗎？該關門了，廚師要準備上菜了。
                </p>

                {/* META CARDS */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14">
                    {[
                        { label: '第一節', value: '期中盤點 Elevator Pitch' },
                        { label: '第二節', value: '資料收齊檢核與收網' },
                        { label: '課課產出', value: '中期盤點精華紀錄' },
                        { label: '帶去 W14', value: '原始數據與初步發現' }
                    ].map((item, idx) => (
                        <div key={idx} className="bg-white border border-[#dddbd5] rounded-[12px] p-5">
                            <div className="text-[11px] text-[#8888aa] mb-2 font-medium">{item.label}</div>
                            <div className="text-[14px] font-bold text-[#1a1a2e]">{item.value}</div>
                        </div>
                    ))}
                </div>

                {/* COURSE ARC */}
                <CourseArc items={[
                    { wk: 'W1-W4', name: '問題意識\n題目定案', past: true },
                    { wk: 'W5-W7', name: '研究規劃\n文獻鑑識', past: true },
                    { wk: 'W8-W10', name: '工具設計\n倫理審查', past: true },
                    { wk: 'W12', name: '研究診所 I\nOpen Office', past: true },
                    { wk: 'W13', name: '研究診所 II\n中期盤點', now: true },
                    { wk: 'W14-W16', name: '分析撰寫\n研究結論' },
                    { wk: 'W17', name: '成果展示\nGallery Walk' }
                ]} />
            </header>

            <div className="space-y-12">
                {/* Part 1: 電梯簡報 */}
                <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-3xl shadow-sm border border-indigo-100 p-6 md:p-8">
                    <div className="flex items-center mb-6 gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600">
                            <Presentation size={24} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-slate-800">Part 1｜期中盤點 Elevator Pitch</h2>
                            <p className="text-indigo-700 text-sm">透過高壓的「電梯簡報」盤點目前的進度與困難，讓全班一起幫你找出生路。</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-indigo-100 space-y-4">
                        <p className="font-bold text-slate-700 mb-2">🎤 準備你的發表講稿：</p>

                        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                            <span className="shrink-0 text-slate-600 font-medium">1. 我們研究的問題是：</span>
                            <input
                                type="text"
                                placeholder="請在此輸入問題..."
                                className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400"
                                value={templateFilled.q1}
                                onChange={(e) => updateTemplate('q1', e.target.value)}
                            />
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                            <span className="shrink-0 text-slate-600 font-medium">2. 我們原本預期會發現：</span>
                            <input
                                type="text"
                                placeholder="請在此輸入預期結果..."
                                className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400"
                                value={templateFilled.q2}
                                onChange={(e) => updateTemplate('q2', e.target.value)}
                            />
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                            <span className="shrink-0 text-slate-600 font-medium">3. 目前收集到的資料（遇見的最大困難或意外是）：</span>
                            <input
                                type="text"
                                placeholder="例如：我們發了100份但只收回20份..."
                                className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400"
                                value={templateFilled.q3}
                                onChange={(e) => updateTemplate('q3', e.target.value)}
                            />
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                            <span className="shrink-0 text-slate-600 font-medium">4. 下週 W14（分析週）前，我們還需要完成：</span>
                            <input
                                type="text"
                                placeholder="例如：整理最後的受訪者逐字稿..."
                                className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400"
                                value={templateFilled.q4}
                                onChange={(e) => updateTemplate('q4', e.target.value)}
                            />
                        </div>

                        <div className={`mt-6 p-4 rounded-xl text-center font-bold tracking-wide transition-all ${isPitchReady ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-100 text-slate-400'}`}>
                            {isPitchReady ? '✅ 講稿準備完畢！我們準備好上台了！' : '請填滿上面四格，點亮準備按鈕。'}
                        </div>
                    </div>
                </div>

                {/* Part 2: Closing the Books */}
                <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 md:p-8">
                    <div className="flex items-center mb-6 gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
                            <CheckSquare size={24} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-slate-800">Part 2｜資料收齊檢核：Closing the Books</h2>
                            <p className="text-slate-500 text-sm">進入「收網」階段，檢核你的原始數據是否已收齊並轉化為數位格式，準備下週進廚房。</p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        {closingBooks.map((item, idx) => (
                            <div key={idx} className="border border-slate-200 rounded-2xl p-5 bg-slate-50 hover:bg-white transition-colors">
                                <h3 className="flex items-center gap-2 font-bold text-slate-800 text-lg border-b border-slate-200 pb-3 mb-3">
                                    {item.icon} {item.name}
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex gap-2 text-sm">
                                        <span className="text-green-600 shrink-0">✅</span>
                                        <span className="text-slate-700"><span className="font-semibold">Done:</span> {item.done}</span>
                                    </div>
                                    <div className="flex gap-2 text-sm">
                                        <span className="text-red-500 shrink-0">❌</span>
                                        <span className="text-slate-500 line-through decoration-red-200"><span className="font-semibold">Not Done:</span> {item.notDone}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 flex items-start gap-3 bg-red-50 text-red-700 p-4 rounded-xl border border-red-100">
                        <AlertCircle className="shrink-0 mt-0.5" size={20} />
                        <p className="text-sm font-medium">
                            **警告：** 如果今天還沒達到「Done」標準，這是最後的週末！如果資料殘缺，就在報告的「研究限制」中誠實寫出來，不要捏造數據！這才是真實的研究。
                        </p>
                    </div>
                </div>

                {/* Part 3: AI 資料探勘 (早鳥) */}
                <div className="bg-slate-900 rounded-3xl p-6 md:p-8 relative overflow-hidden text-white shadow-xl">
                    <div className="absolute -right-10 -bottom-10 opacity-10">
                        <Bot size={200} />
                    </div>
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                        <Award className="text-yellow-400" />
                        Part 3｜早鳥任務：請 AI 幫你探勘資料
                    </h2>
                    <p className="text-slate-300 mb-6 max-w-2xl">
                        進度領先者的早鳥獎勵——率先把數據餵給 AI，找出那些藏在數字背後的「意外點」。
                    </p>

                    <div className="bg-slate-800 rounded-xl p-5 border border-slate-700 relative z-10 w-full sm:w-2/3">
                        <p className="text-blue-400 font-mono text-xs mb-2">// 📊 早鳥探勘 Prompt</p>
                        <p className="text-sm text-slate-200 leading-relaxed font-mono">
                            這是我目前收集到的初步數據/訪談逐字稿段落：<br />
                            <span className="text-green-300">【貼上資料片段】</span><br /><br />
                            我的研究問題是：「＿＿＿」。<br />
                            請從這些有限的資料中，幫我找出 3 個「<span className="text-yellow-300">最值得進一步挖掘的異常點或趨勢</span>」，並解釋為什麼。這不是最後結論，只是探勘。
                        </p>
                    </div>
                </div>

                {/* Navigation */}
                <div className="flex justify-between items-center pt-8 border-t border-slate-100">
                    <Link to="/w12" className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 font-bold">
                        ← 回 W12 研究執行 I
                    </Link>
                    <Link to="/w14" className="flex items-center gap-2 text-sm bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-500 transition-colors font-bold shadow-md">
                        前往 W14 數據轉譯 <ArrowRight size={16} />
                    </Link>
                </div>
            </div>
        </div>
    );
};
