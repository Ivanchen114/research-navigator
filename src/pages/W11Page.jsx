import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Stethoscope, ArrowRight, ClipboardList, Mic, Camera, FileSearch, TestTube2, AlertCircle, Clock, CheckCircle2, HeartPulse, ShieldAlert, FileText, Wrench } from 'lucide-react';

const triageTiers = [
    {
        id: 'red',
        color: 'red',
        badge: 'bg-red-100 text-red-700 border-red-200',
        bg: 'bg-red-50',
        border: 'border-red-200',
        icon: <ShieldAlert size={24} className="text-red-600" />,
        title: '🔴 急診區（工具卡關 / 倫理未過）',
        symptoms: [
            '工具被老師退件，不知道怎麼改',
            '倫理審查 Part 2 卡關，AI 說有問題',
            '找不到受訪者 / 問卷發不出去'
        ],
        action: '優先處理！請立即在黑板「急診區」寫上組別，等待老師救援。'
    },
    {
        id: 'yellow',
        color: 'yellow',
        badge: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        bg: 'bg-amber-50',
        border: 'border-amber-200',
        icon: <Stethoscope size={24} className="text-amber-600" />,
        title: '🟡 門診區（執行不順 / 需要討論）',
        symptoms: [
            '問卷回收份數不如預期',
            '訪談錄音有雜音或對方不願意分享',
            '實驗對照組出現不可控變數'
        ],
        action: '請在黑板「門診區」排隊，老師會按順序巡迴討論。'
    },
    {
        id: 'green',
        color: 'green',
        badge: 'bg-green-100 text-green-700 border-green-200',
        bg: 'bg-emerald-50',
        border: 'border-emerald-200',
        icon: <HeartPulse size={24} className="text-emerald-600" />,
        title: '🟢 健康區（進度順利 / 超前部署）',
        symptoms: [
            '問卷份數已達標',
            '訪談已完成並開始打逐字稿',
            '實驗/觀察數據已收集完畢'
        ],
        action: '做得好！請直接進入下方的「等待急救包」任務，開始預寫第三章。'
    }
];

const waitingRoomTasks = [
    {
        id: 'task1',
        title: '整理文獻回顧',
        desc: '把 W6 找到的文獻，整理成 200 字的摘要。',
        icon: <FileText size={20} className="text-blue-500" />
    },
    {
        id: 'task2',
        title: '預寫第三章工具',
        desc: '把你們的問卷/訪談題目或實驗流程，整理成正式的報告段落。',
        icon: <Wrench size={20} className="text-slate-500" />
    },
    {
        id: 'task3',
        title: 'AI 初步探勘',
        desc: '把收到的前 10 份回覆餵給 AI，看看有沒有什麼有趣的發現。',
        icon: <Camera size={20} className="text-purple-500" />
    }
];

export const W11Page = () => {
    const [selectedTier, setSelectedTier] = useState(null);

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">

            {/* Header */}
            <header className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden text-center">
                <div className="absolute top-0 right-0 w-64 h-64 bg-amber-100 rounded-full blur-3xl opacity-40 -translate-y-1/2 translate-x-1/3" />
                <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-100 shadow-sm mb-4">
                        <Stethoscope size={16} /> W11 執行週 I
                    </div>
                    <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-4 flex items-center justify-center gap-3">
                        🏥 研究診所：<span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600 drop-shadow-sm">Open Office</span>
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
                        本週沒有新進度，只有解決問題。<br />
                        <span className="text-sm">老師今天不講課，化身為主治醫師，為你們的研究把脈。</span>
                    </p>
                </div>
            </header>

            {/* Part 1: 黑板掛號分流系統 */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 md:p-8">
                <div className="flex items-center mb-6 gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-xl">
                        📋
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">Part 1｜研究掛號分流系統</h2>
                        <p className="text-slate-500 text-sm">請依照小組目前的狀況，點選你們的「症狀區塊」。</p>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                    {triageTiers.map((tier) => (
                        <button
                            key={tier.id}
                            onClick={() => setSelectedTier(tier.id)}
                            className={`flex flex-col text-left rounded-2xl p-5 border-2 transition-all ${selectedTier === tier.id ? `${tier.badge} shadow-md scale-[1.02]` : `bg-white border-slate-100 hover:${tier.bg} hover:border-slate-200`}`}
                        >
                            <div className="flex items-center gap-3 mb-3">
                                {tier.icon}
                                <span className="font-bold">{tier.title}</span>
                            </div>
                            <ul className="text-sm space-y-1.5 mb-4 opacity-80 pl-2 border-l-2 border-current">
                                {tier.symptoms.map((sym, idx) => (
                                    <li key={idx}>• {sym}</li>
                                ))}
                            </ul>
                            <div className={`mt-auto text-xs font-semibold p-2 rounded-lg bg-white/50 backdrop-blur-sm self-start`}>
                                👉 {tier.action}
                            </div>
                        </button>
                    ))}
                </div>

                {!selectedTier && (
                    <div className="mt-4 text-center text-sm text-amber-600 font-medium animate-pulse">
                        👆 請選擇你們組的狀態，以獲得相對應的指示。
                    </div>
                )}
            </div>

            {/* Part 2: 綠區專屬任務包 */}
            <div className={`transition-all duration-500 ${selectedTier === 'green' ? 'opacity-100 translate-y-0' : 'opacity-30 grayscale pointer-events-none -translate-y-4'}`}>
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl shadow-sm border border-emerald-100 p-6 md:p-8">
                    <div className="flex items-center mb-6 gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                            <HeartPulse size={20} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-slate-800">Part 2｜健康區等待急救包</h2>
                            <p className="text-emerald-700 text-sm">進度超前？太棒了！不要發呆，完成以下任務可以幫 W14/W15 省下大量時間。</p>
                        </div>
                    </div>

                    <div className="grid sm:grid-cols-3 gap-4">
                        {waitingRoomTasks.map((task) => (
                            <div key={task.id} className="bg-white/80 p-5 rounded-2xl border border-emerald-200 hover:shadow-sm transition-all">
                                <div className="flex items-center gap-2 mb-2 font-bold text-slate-700">
                                    {task.icon} {task.title}
                                </div>
                                <p className="text-sm text-slate-600 leading-relaxed">{task.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Part 3: 溝通與日誌 */}
            <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-slate-900 text-slate-100 rounded-3xl p-6 md:p-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl" />
                    <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
                        <Mic className="text-blue-400" />
                        AI 專題溝通教練
                    </h2>
                    <p className="text-slate-400 text-sm mb-4 leading-relaxed">
                        組內吵架？受訪者不理你？遇到溝通困難，讓 AI 幫你想說詞。
                    </p>
                    <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 text-sm font-mono text-slate-300">
                        <p className="text-blue-400 mb-2">// 溝通救星 Prompt</p>
                        「我在做高中的專題研究，遇到了一個困難：<br />
                        <span className="text-amber-400">【描述你的狀況，例如組員不回訊息、不知道怎麼拒絕長輩亂給意見】</span><br /><br />
                        請幫我擬一段 100 字以內的溝通文字。語氣要堅定但有禮貌，並提供兩個不同的寫法讓我選。」
                    </div>
                </div>

                <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 flex flex-col">
                    <h2 className="text-xl font-bold flex items-center gap-2 mb-4 text-slate-800">
                        <ClipboardList className="text-indigo-500" />
                        關鍵事件日誌 (Logbook)
                    </h2>
                    <p className="text-slate-500 text-sm mb-4 leading-relaxed">
                        不要記流水帳（今天開會吃了什麼）。請記錄「我們遇到了什麼問題？我們怎麼解決的？」
                    </p>
                    <div className="flex-1 bg-slate-50 rounded-xl border border-dashed border-slate-300 p-4 flex flex-col justify-center items-center text-center">
                        <AlertCircle className="text-slate-400 mb-2" size={24} />
                        <p className="text-sm text-slate-600 font-medium tracking-wide mb-3">
                            W11 結束前，請至 Google Classroom<br />
                            填寫本週的「關鍵事件日誌」
                        </p>
                        <a href="https://classroom.google.com/" target="_blank" rel="noopener noreferrer" className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-indigo-500 transition-colors flex items-center gap-2">
                            前往 Classroom <ArrowRight size={14} />
                        </a>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center pt-8 border-t border-slate-100">
                <Link to="/w10" className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700">
                    ← 回 W10 最終定案
                </Link>
                <Link to="/w12" className="flex items-center gap-2 text-sm bg-orange-600 text-white px-5 py-2 rounded-full hover:bg-orange-500 transition-colors font-semibold">
                    前往 W12 中期盤點 <ArrowRight size={16} />
                </Link>
            </div>
        </div>
    );
};
