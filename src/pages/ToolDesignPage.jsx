import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Wrench, ArrowRight, AlertTriangle, ShieldCheck, Heart, ClipboardList, Mic, TestTube2, Camera, Target, Zap, FileSearch, Scale } from 'lucide-react';

// 五大工具的錯誤類型與解藥 (5 Methods Pitfalls Data)
const methodPitfalls = {
    questionnaire: {
        id: 'questionnaire',
        icon: <ClipboardList size={24} />,
        name: '問卷法 (Questionnaire)',
        subtitle: '量表設計的毒點',
        errors: [
            { name: '誘導性提問', desc: '題目已經暗示了你想要聽到的「正確答案」', consequence: '收到的回答有嚴重偏差，信度破產', bad: '「你同意手機會嚴重傷害睡眠嗎？」', good: '「你認為手機對睡眠的影響是？」' },
            { name: '選項不互斥', desc: '選項之間有重疊，填答者無所適從', consequence: '資料無法歸類，統計困難', bad: 'A. 0-10分 B. 10-20分 (那 10分 算哪個？)', good: 'A. 0-9分 B. 10-19分 C. 20分以上' },
            { name: '雙重問題', desc: '一題裡面同時問了兩件不同的事情', consequence: '不知道受訪者到底在同意後半段還是前半段', bad: '「你覺得校規太多且不合理嗎？」', good: '拆成兩題：「校規數量適當嗎？」、「校規內容合理嗎？」' },
        ]
    },
    interview: {
        id: 'interview',
        icon: <Mic size={24} />,
        name: '訪談法 (Interview)',
        subtitle: '提問設計的毒點',
        errors: [
            { name: '封閉型提問', desc: '問題只能回答「是」或「否」，無法引導受訪者多說', consequence: '訪談三分鐘就結束，得不到深入的質性資料', bad: '「你覺得讀書壓力很大嗎？」(答：對)', good: '「可不可以跟我分享一個你最近覺得讀書壓力很大、或是很輕鬆的經驗？」' },
            { name: '評斷性質詢', desc: '語氣帶有批判、質疑或高高在上', consequence: '受訪者產生防衛心，不願說出真心話', bad: '「你明明知道要考試，為什麼還要滑手機？」', good: '「當你準備考試時，通常是什麼原因會讓你想拿起手機？」' },
            { name: '連續轟炸提問', desc: '一口氣問了 3 個以上的連環問題', consequence: '受訪者腦袋當機，只會回答最後一個', bad: '「你幾點睡？睡前都在幹嘛？會覺得累嗎？」', good: '一次只問一題，等對方說完再追問。' },
        ]
    },
    experiment: {
        id: 'experiment',
        icon: <TestTube2 size={24} />,
        name: '實驗法 (Experiment)',
        subtitle: '實驗設計的毒點',
        errors: [
            { name: '干擾變項未控制', desc: '除了你想測的變數外，還有其他因素在影響結果', consequence: '無法證明因果關係', bad: '測驗「聽音樂是否能提高專注力」，但兩組學生在不同的時間（早上與下午）進行測驗。', good: '確保兩組都在「同一時間、同一冷氣溫度」下進行。' },
            { name: '缺乏對照組', desc: '只有接受干預的組別，沒有沒接受干預的組別', consequence: '不知道結果是不是自然發生的（安慰劑效應）', bad: '所有人每天喝人參茶，一個月後發現精神變好。', good: '一半喝人參茶（實驗組），一半喝一樣難喝但沒有人參的茶（對照組）。' },
            { name: '測量不客觀', desc: '實驗結果是由實驗者「主觀感覺」來評分', consequence: '存在實驗者偏見', bad: '觀察者「覺得」這組學生看起來比較專心。', good: '使用標準化的專注力測驗考卷來計算分數。' },
        ]
    },
    observation: {
        id: 'observation',
        icon: <Camera size={24} />,
        name: '觀察法 (Observation)',
        subtitle: '紀錄方式的毒點',
        errors: [
            { name: '主觀推論紀錄', desc: '把觀察者的「感覺」或「猜測」寫下來，而不是客觀行為', consequence: '資料不客觀，淪為看圖說故事', bad: '「同學 A 看起來很生氣地敲桌子。」', good: '「同學 A 連續用力敲擊桌面 3 次，且眉頭深鎖。」（只記錄看得見的動作）' },
            { name: '觀察者效應', desc: '被觀察的人發現你在看他，所以表現得和平常不一樣 (霍桑效應)', consequence: '看到的是假象', bad: '老師站在學生旁邊觀察他有沒有專心。', good: '採隱蔽觀察，或讓受觀察者習慣你的存在（自然觀察法）。' },
            { name: '指標定義模糊', desc: '要觀察的行為沒有明確的界定標準', consequence: '不同的觀察者會記錄出完全不同的結果', bad: '觀察學生「幾次不專心」。', good: '明確定義不專心：「視線離開課本連續超過 10 秒即記一次」。' },
        ]
    },
    literature: {
        id: 'literature',
        icon: <FileSearch size={24} />,
        name: '文獻法 (Literature)',
        subtitle: '資料選用的毒點',
        errors: [
            { name: '來源不可信 (C 級證物)', desc: '引用了未經查證的內容農場、維基百科或個人網誌', consequence: '整篇論文的基石崩塌，論點無效', bad: '「根據每日頭條報導，高中生每天只睡四小時會變笨。」', good: '引用「台灣心理學刊」或「世界衛生組織」的官方數據。' },
            { name: '斷章取義 (櫻桃採摘)', desc: '只挑選對自己有利的句子，甚至扭曲了原作者的意思', consequence: '違反學術倫理，構成學術不端', bad: '原文：「適量咖啡因有益，但過量會引發心悸。」你只引用前半句。', good: '客觀呈現文獻的正反面限制。' },
            { name: '時效性過舊', desc: '引用了十幾年前的科技或社會數據', consequence: '現況早已改變，文獻無法支持目前的論點', bad: '在 2024 年研究社群媒體，卻引用 2005 年 MSN 時代的研究數據。', good: '原則上盡量尋找近 5-10 年內的文獻。' },
        ]
    }
};

const xCaseDemo = {
    title: '病例 XQ1',
    purpose: '手機使用與睡眠趨勢調查',
    questions: [
        {
            q: '1. 你同意手機會嚴重傷害睡眠嗎？\n   1非常同意 2同意 3普通 4不同意',
            problem: '誘導性提問',
            detail: '「嚴重傷害」已經預設立場',
            fix: '改為：「你認為手機對睡眠的影響是？」1非常負面 2負面 3沒影響 4正面 5非常正面',
        },
        {
            q: '2. 你睡前滑手機多久？\n   A. 0-10分鐘 B. 10-20分鐘 C. 20-30分鐘',
            problem: '選項不完整',
            detail: '如果滑 30 分鐘以上怎麼辦？',
            fix: '加「D. 30分鐘以上」',
        },
        {
            q: '3. 你最近一週平均睡眠時間？\n   A. 6小時 B. 7小時',
            problem: '選項不完整',
            detail: '如果睡 5 小時或 8 小時怎麼辦？',
            fix: '改為：A. 少於6小時 B. 6-7小時 C. 7-8小時 D. 8小時以上',
        },
    ],
};

export const ToolDesignPage = () => {
    const [showXCase, setShowXCase] = useState(false);
    const [showEthics, setShowEthics] = useState(false);
    const [activeMethod, setActiveMethod] = useState('questionnaire');

    const currentMethod = methodPitfalls[activeMethod];

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">

            {/* Header */}
            <header className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100 mb-8 relative overflow-hidden text-center">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-40 -translate-y-1/2 translate-x-1/3" />
                <div className="relative z-10 flex flex-col items-center gap-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100 shadow-sm">
                        <Wrench size={16} /> W8–W9 核心模組
                    </div>
                    <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight gap-3 justify-center text-center">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600 drop-shadow-sm">🔧 工具設計工作坊</span>
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
                        Level 2 處方診斷 — 工具設計得好不好？哪裡有毒？怎麼解毒？
                    </p>
                    <div className="shrink-0 bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 text-sm text-blue-800">
                        <strong>前置條件</strong>
                        <p className="text-xs mt-1">W5 掛號判斷 ✅ → W7 已選定一項研究工具 ✅</p>
                    </div>
                </div>
            </header>

            {/* 處方診斷：壞範例 */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 md:p-8 hover:shadow-md transition-shadow mb-8">
                <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                    <AlertTriangle className="text-amber-500" size={28} />
                    處方診斷熱身：先看壞範例
                </h2>
                <p className="text-slate-600 mb-6 leading-relaxed">
                    在動手設計之前，先來看看「病入膏肓的工具」長什麼樣！這是某位探員設計的問卷：
                </p>

                <button
                    onClick={() => setShowXCase(!showXCase)}
                    className="bg-amber-600 hover:bg-amber-700 text-white px-5 py-2.5 rounded-lg text-sm font-bold transition-colors shadow-sm mb-4"
                >
                    {showXCase ? '收起壞範例' : '🔍 展開病例 XQ1 診斷'}
                </button>

                {showXCase && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                            <h3 className="font-bold text-amber-900 mb-1">【{xCaseDemo.title}】</h3>
                            <p className="text-sm text-amber-800">研究目的：{xCaseDemo.purpose}</p>
                        </div>

                        {xCaseDemo.questions.map((item, idx) => (
                            <div key={idx} className="bg-slate-50 rounded-lg border border-slate-200 p-4 space-y-2 relative overflow-hidden">
                                <span className="absolute -top-6 -right-4 text-6xl text-slate-200 opacity-50 font-black">{idx + 1}</span>
                                <pre className="text-sm text-slate-700 whitespace-pre-wrap font-sans relative z-10">{item.q}</pre>
                                <div className="border-t border-slate-200 pt-3 mt-3 space-y-2 relative z-10">
                                    <p className="text-sm bg-red-50 p-2 rounded text-red-900 border border-red-100">
                                        <span className="font-bold text-red-600 w-16 inline-block">❌ 毒點：</span>
                                        <span className="font-bold">{item.problem}</span> — {item.detail}
                                    </p>
                                    <p className="text-sm bg-green-50 p-2 rounded text-green-900 border border-green-100">
                                        <span className="font-bold text-green-600 w-16 inline-block">✅ 解藥：</span>
                                        {item.fix}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* 🎯 🧰 五大工具避險指南 (Tabbed Interface) */}
            <div className="bg-slate-900 rounded-3xl shadow-xl border border-slate-700 p-1 mb-8 overflow-hidden">
                <div className="p-6 md:p-8 text-white relative">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500 rounded-full blur-[100px] opacity-10"></div>
                    <div className="relative z-10">
                        <h2 className="text-2xl font-bold text-cyan-400 mb-2 flex items-center gap-3">
                            <Wrench size={28} />
                            🧰 R.I.B. 五大工具避險指南
                        </h2>
                        <p className="text-slate-400 mb-6 text-sm">特務請注意，每種調查工具都有專屬的「致命毒點」。點擊下方標籤，詳閱你的裝備說明書。</p>

                        {/* Tabs */}
                        <div className="flex flex-wrap gap-2 mb-8 bg-slate-800/50 p-2 rounded-2xl">
                            {Object.values(methodPitfalls).map((method) => (
                                <button
                                    key={method.id}
                                    onClick={() => setActiveMethod(method.id)}
                                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex-1 min-w-[140px] justify-center ${
                                        activeMethod === method.id
                                            ? 'bg-cyan-500 text-slate-900 shadow-md scale-105 z-10'
                                            : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
                                    }`}
                                >
                                    {method.icon} {method.name.split(' ')[0]}
                                </button>
                            ))}
                        </div>

                        {/* Active Panel */}
                        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 bg-cyan-950 text-cyan-400 rounded-xl border border-cyan-800/50">
                                    {currentMethod.icon}
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white">{currentMethod.name}</h3>
                                    <p className="text-cyan-400 text-sm mt-0.5">{currentMethod.subtitle}</p>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-3 gap-4">
                                {currentMethod.errors.map((err, idx) => (
                                    <div key={idx} className="bg-slate-800 rounded-2xl border border-slate-700 flex flex-col hover:border-cyan-500/50 transition-colors">
                                        <div className="p-5 border-b border-slate-700/50 flex-1">
                                            <h4 className="font-bold text-rose-400 text-base mb-2 flex items-start gap-2">
                                                <AlertTriangle size={18} className="shrink-0 mt-0.5" /> {err.name}
                                            </h4>
                                            <p className="text-sm text-slate-300 leading-relaxed mb-3">{err.desc}</p>
                                            <p className="text-xs text-rose-300/80 bg-rose-950/30 p-2 rounded-lg border border-rose-900/30">
                                                <strong>⚠️ 災難後果：</strong>{err.consequence}
                                            </p>
                                        </div>
                                        <div className="p-4 bg-slate-900/50 rounded-b-2xl space-y-3">
                                            <div>
                                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Bad Example</span>
                                                <p className="text-xs text-rose-300 leading-relaxed">❌ {err.bad}</p>
                                            </div>
                                            <div>
                                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Good Example</span>
                                                <p className="text-xs text-emerald-400 leading-relaxed">✅ {err.good}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Direct CTA to Game */}
            <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-3xl shadow-lg p-8 md:p-10 text-white hover:shadow-xl transition-shadow text-center relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/diagnostic-canvas.png')] opacity-10 mix-blend-overlay"></div>
                <div className="relative z-10 flex flex-col items-center">
                    <ShieldCheck size={48} className="text-cyan-200 mb-4 group-hover:scale-110 transition-transform duration-500" />
                    <h3 className="text-3xl font-black mb-3">裝備完畢！立刻執行「行動代號：防線」</h3>
                    <p className="text-blue-100 leading-relaxed mb-8 max-w-xl mx-auto text-lg">
                        總部攔截了 10 份含有致命毒點的研究工具（包含問卷、訪談、實驗等）。請前往處方診斷室，找出它們的設計破綻！
                    </p>
                    <Link
                        to="/game/rx-inspector"
                        className="bg-white hover:bg-cyan-50 text-blue-800 px-8 py-4 rounded-xl font-black transition-all shadow-xl flex items-center gap-3 group/btn text-lg border-2 border-white hover:border-cyan-200 hover:scale-105"
                    >
                        <span>進入遊戲：行動代號：防線</span>
                        <ArrowRight size={20} className="group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>

            {/* 好工具三大標準 (精簡版) */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 md:p-8 hover:shadow-md transition-shadow mb-8 mt-8">
                <h2 className="text-2xl font-bold text-slate-800 mb-8 flex items-center gap-3">
                    <Target className="text-emerald-600" size={28} />
                    總結：好工具的三大標準
                </h2>

                <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100">
                        <h3 className="text-lg font-bold text-emerald-800 mb-2 flex items-center gap-2"><Target size={20}/> 有效性 (Validity)</h3>
                        <p className="text-slate-600 text-sm mb-3">能測到你想測的東西。</p>
                        <div className="bg-white p-2 rounded text-xs text-slate-700 border border-emerald-200">
                            <strong>自檢問句：</strong>「這題跟我的研究目標有關聯嗎？」
                        </div>
                    </div>
                    <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100">
                        <h3 className="text-lg font-bold text-emerald-800 mb-2 flex items-center gap-2"><Scale size={20}/> 可靠性 (Reliability)</h3>
                        <p className="text-slate-600 text-sm mb-3">測出來的結果穩定。</p>
                        <div className="bg-white p-2 rounded text-xs text-slate-700 border border-emerald-200">
                            <strong>自檢問句：</strong>「不同人看這題，理解會不會不一樣？」
                        </div>
                    </div>
                    <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100">
                        <h3 className="text-lg font-bold text-emerald-800 mb-2 flex items-center gap-2"><Zap size={20}/> 可行性 (Feasibility)</h3>
                        <p className="text-slate-600 text-sm mb-3">你做得到、受試者願意配合。</p>
                        <div className="bg-white p-2 rounded text-xs text-slate-700 border border-emerald-200">
                            <strong>自檢問句：</strong>「這問卷會不會長到沒人想寫完？」
                        </div>
                    </div>
                </div>
            </div>

            {/* 研究倫理 (保留) */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 md:p-8 hover:shadow-md transition-shadow mb-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                        <Heart className="text-pink-500" size={28} />
                        絕對不可踩的紅線：研究倫理
                    </h2>
                    <button
                        onClick={() => setShowEthics(!showEthics)}
                        className="text-sm bg-pink-50 text-pink-700 px-4 py-2 rounded-lg hover:bg-pink-100 font-bold transition-colors"
                    >
                        {showEthics ? '收起知情同意範本' : '查看【知情同意書】範本'}
                    </button>
                </div>

                <div className="grid md:grid-cols-4 gap-4 mb-4">
                    {[
                        { icon: '📝', name: '知情同意', desc: '受訪者要知道目的' },
                        { icon: '🔒', name: '保密性', desc: '絕不洩漏個資' },
                        { icon: '🛡️', name: '不傷害', desc: '避免身心壓力' },
                        { icon: '🤝', name: '自願性', desc: '隨時可自由退出' },
                    ].map((p) => (
                        <div key={p.name} className="bg-white rounded-xl border border-slate-200 p-4 text-center hover:border-pink-300 hover:shadow-sm transition-all">
                            <span className="text-3xl block mb-2">{p.icon}</span>
                            <h4 className="font-bold text-slate-800 text-sm mb-1">{p.name}</h4>
                            <p className="text-xs text-slate-500">{p.desc}</p>
                        </div>
                    ))}
                </div>

                {showEthics && (
                    <div className="bg-slate-50 rounded-xl border border-slate-200 p-6 text-sm text-slate-700 animate-in fade-in slide-in-from-top-2 duration-300 mt-6 relative">
                        <div className="absolute top-0 right-0 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-xl">⚠️ 必備元件</div>
                        <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2"><ClipboardList size={18}/> 知情同意書範本</h4>
                        <p className="text-slate-500 mb-4 text-xs">每份問卷和訪談的「開頭第一頁」，都必須有類似的聲明：</p>
                        <div className="bg-white p-5 rounded-lg border border-slate-200 text-sm leading-relaxed font-sans text-slate-700 shadow-inner">
                            <p className="mb-2">您好，我們是 ○○ 高中的學生，正在進行一項關於「高中生睡眠時間與學業成績關係」的探究實作。</p>
                            <p className="mb-2">本表單目的是了解您的睡眠習慣，所有資料<strong>僅供本次學術專題使用，絕對保密且不會公開個人身份</strong>。</p>
                            <p className="mb-4">填答約需 3 分鐘，您可以隨時選擇停止作答。</p>
                            <div className="flex items-center gap-2 font-bold text-emerald-700 bg-emerald-50 p-3 rounded border border-emerald-100 w-fit">
                                <input type="checkbox" checked readOnly className="accent-emerald-600 w-4 h-4 cursor-not-allowed" /> 我已閱讀以上說明，同意參加本研究
                            </div>
                        </div>
                    </div>
                )}
            </div>

        </div>
    );
};
