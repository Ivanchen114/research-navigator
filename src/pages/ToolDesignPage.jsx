import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Wrench, ArrowRight, AlertTriangle, ShieldCheck, Heart, ClipboardList, Mic, TestTube2, Camera, Target, Zap, FileSearch, Scale } from 'lucide-react';

// 五大工具的錯誤類型與解藥 (5 Methods Pitfalls Data)
const methodPitfalls = {
    questionnaire: {
        id: 'questionnaire',
        icon: <ClipboardList size={20} />,
        name: '問卷法 (Questionnaire)',
        subtitle: '量表設計的毒點',
        errors: [
            { name: '誘導性提問', desc: '題目暗示了想要聽到的「正確答案」', consequence: '收到的回答有嚴重偏差，信度破產', bad: '「你同意手機會嚴重傷害睡眠嗎？」', good: '「你認為手機對睡眠的影響是？」' },
            { name: '選項不互斥', desc: '選項之間有重疊，填答者無所適從', consequence: '資料無法歸類，統計困難', bad: 'A. 0-10分 B. 10-20分 (那 10分 算哪個？)', good: 'A. 0-9分 B. 10-19分 C. 20分以上' },
            { name: '雙重問題', desc: '一題裡面同時問了兩件不同的事情', consequence: '不知道受訪者是在同意後半段還是前半段', bad: '「你覺得校規太多且不合理嗎？」', good: '拆成兩題：「校規數量適當嗎？」、「校規內容合理嗎？」' },
        ]
    },
    interview: {
        id: 'interview',
        icon: <Mic size={20} />,
        name: '訪談法 (Interview)',
        subtitle: '提問設計的毒點',
        errors: [
            { name: '封閉型提問', desc: '只能回答「是/否」，無法引導多說', consequence: '訪談三分鐘就結束，得不到深入資料', bad: '「你覺得讀書壓力很大嗎？」(答：對)', good: '「可不可以跟我分享一個最近壓力大或很輕鬆的經驗？」' },
            { name: '評斷性質詢', desc: '語氣帶有批判、質疑或高高在上', consequence: '受訪者產生防衛心，不願說出真心話', bad: '「你明明要考試，為什麼還要滑手機？」', good: '「準備考試時，通常是什麼原因會讓你想拿起手機？」' },
            { name: '連續轟炸提問', desc: '一口氣問了 3 個以上的連環問題', consequence: '受訪者腦袋當機，只會回答最後一個', bad: '「你幾點睡？睡前都在幹嘛？會覺得累嗎？」', good: '一次只問一題，等對方說完再追問。' },
        ]
    },
    experiment: {
        id: 'experiment',
        icon: <TestTube2 size={20} />,
        name: '實驗法 (Experiment)',
        subtitle: '實驗設計的毒點',
        errors: [
            { name: '干擾變項未控制', desc: '除了你想測的變數外，還有其他因素在影響', consequence: '無法證明因果關係', bad: '測驗「聽音樂是否提高專注力」，但兩組學生在不同時間（早/午）測。', good: '確保兩組都在「同一時間、同一溫度」下進行。' },
            { name: '缺乏對照組', desc: '只有實驗組，沒有沒接受干預的對照組', consequence: '不知道結果是不是自然發生的（安慰劑效應）', bad: '所有人每天喝人參茶，一個月後發現精神變好。', good: '一半喝人參茶（實驗組），一半喝安慰劑（對照組）。' },
            { name: '測量不客觀', desc: '實驗結果是由實驗者「主觀感覺」評分', consequence: '存在實驗者偏見', bad: '觀察者「覺得」這組學生看起來比較專心。', good: '使用標準化專注力測驗考卷來計算分數。' },
        ]
    },
    observation: {
        id: 'observation',
        icon: <Camera size={20} />,
        name: '觀察法 (Observation)',
        subtitle: '紀錄方式的毒點',
        errors: [
            { name: '主觀推論紀錄', desc: '寫下觀察者的「感覺」而非客觀行為', consequence: '資料不客觀，淪為看圖說故事', bad: '「同學 A 看起來很生氣地敲桌子。」', good: '「同學 A 用力敲擊桌面 3 次，且眉頭深鎖。」' },
            { name: '觀察者效應', desc: '被觀察者發現你在看他，表現得和平常不同', consequence: '看到的是假象', bad: '老師站在學生旁邊觀察他有沒有專心。', good: '採自然觀察法，讓受觀察者習慣你的存在。' },
            { name: '指標定義模糊', desc: '要觀察的行為沒有明確的界定標準', consequence: '不同觀察者記錄出不同結果', bad: '觀察學生「幾次不專心」。', good: '定義：視線離開課本連續超過 10 秒即記一次。' },
        ]
    },
    literature: {
        id: 'literature',
        icon: <FileSearch size={20} />,
        name: '文獻法 (Literature)',
        subtitle: '資料選用的毒點',
        errors: [
            { name: '來源不可信', desc: '引用了未經查證的內容農場或個人網誌', consequence: '整篇論文基石崩塌，論點無效', bad: '「根據每日頭條報導，少睡四小時會變笨。」', good: '引用「台灣心理學刊」或「WHO」官方數據。' },
            { name: '斷章取義', desc: '只挑有利句子，扭曲了原作者本意', consequence: '違反學術倫理，構成學術不端', bad: '原文：「適量咖啡因有益但過量心悸。」你只引前半句。', good: '客觀呈現文獻的正反面限制。' },
            { name: '時效性過舊', desc: '引用了十幾年前的科技或社會數據', consequence: '現況早已變，數據無法支持論點', bad: '在 2024 年研究社群，引用 2005 年 MSN 研究。', good: '盡量尋找近 5-10 年內的文獻。' },
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
        <div className="max-w-5xl mx-auto px-6 lg:px-12 py-8 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 font-['Noto_Sans_TC',sans-serif] text-[14px] leading-[1.6] text-[#1a1a2e] pb-16">

            {/* Header */}
            <header className="mb-14 pt-8 text-center max-w-[650px] mx-auto">
                <div className="text-[11px] font-['DM_Mono',monospace] tracking-[0.12em] uppercase text-[#2d5be3] mb-3 flex items-center justify-center gap-2">
                    <Wrench size={14} /> W8–W9 核心模組
                </div>
                <h1 className="font-['Noto_Serif_TC',serif] text-[38px] font-bold leading-[1.25] text-[#1a1a2e] mb-4 tracking-[-0.02em]">
                    工具設計工作坊：<br className="hidden md:block" />
                    <span className="text-[#2d5be3] font-normal italic">處方診斷與除鱗</span>
                </h1>
                <p className="text-[15px] text-[#4a4a6a] leading-[1.75]">
                    Level 2 處方診斷 — 工具設計得好不好？哪裡有毒？怎麼解毒？在動手設計之前，先學會辨識各種設計上的致命傷。
                </p>
            </header>

            {/* 病例 XQ1 */}
            <section className="mb-14">
                <div className="p-10 bg-[#f8f7f4] border border-[#dddbd5] rounded-[10px] space-y-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <AlertTriangle className="text-[#c9a84c]" size={24} />
                            <h2 className="font-['Noto_Serif_TC',serif] text-[20px] font-bold text-[#1a1a2e]">
                                處方診斷熱身：先看「病入膏肓」的工具
                            </h2>
                        </div>
                        <button
                            onClick={() => setShowXCase(!showXCase)}
                            className="bg-[#1a1a2e] text-white px-5 py-2 rounded-[4px] text-[12px] font-bold hover:bg-[#2a2a4a] transition-all"
                        >
                            {showXCase ? '收起病例' : '🔍 展開病例 XQ1 診斷'}
                        </button>
                    </div>

                    {showXCase && (
                        <div className="space-y-6 animate-in slide-in-from-top-4 duration-300">
                            <div className="bg-white border border-[#dddbd5] p-5 rounded-[6px]">
                                <span className="text-[10px] font-bold text-[#8888aa] tracking-[0.2em] font-['DM_Mono',monospace] uppercase block mb-1">Chart ID / {xCaseDemo.title}</span>
                                <p className="text-[13px] text-[#1a1a2e] font-bold">研究目的：{xCaseDemo.purpose}</p>
                            </div>

                            <div className="grid gap-4">
                                {xCaseDemo.questions.map((item, idx) => (
                                    <div key={idx} className="bg-white rounded-[6px] border border-[#dddbd5] p-6 space-y-4 hover:border-[#1a1a2e] transition-colors relative">
                                        <div className="text-[11px] font-bold text-white bg-[#1a1a2e] w-5 h-5 flex items-center justify-center rounded-[2px] font-['DM_Mono',monospace] absolute -top-2.5 -left-2.5 shadow-sm">{idx + 1}</div>
                                        <div className="text-[14px] text-[#1a1a2e] font-medium leading-relaxed italic border-l-2 border-[#dddbd5] pl-4">{item.q}</div>
                                        <div className="grid md:grid-cols-2 gap-4 mt-6">
                                            <div className="bg-[#fdf2f2] p-3 rounded-[4px] border border-[#f2dada]">
                                                <span className="text-[10px] font-bold text-[#e32d5b] uppercase block mb-1">❌ 毒點診斷</span>
                                                <p className="text-[12px] text-[#e32d5b] font-bold">{item.problem} <span className="font-normal opacity-80">- {item.detail}</span></p>
                                            </div>
                                            <div className="bg-[#f0f9f4] p-3 rounded-[4px] border border-[#2e7d5a]/20">
                                                <span className="text-[10px] font-bold text-[#2e7d5a] uppercase block mb-1">✅ 臨床解藥</span>
                                                <p className="text-[12px] text-[#2e7d5a] font-bold leading-relaxed">{item.fix}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* R.I.B. 五大工具避險指南 */}
            <section className="bg-[#1a1a2e] text-white rounded-[10px] p-10 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-10 opacity-[0.03]">
                    <ShieldCheck size={180} />
                </div>
                <div className="relative z-10">
                    <div className="mb-10 text-center">
                        <div className="text-[#2d5be3] text-[10px] font-['DM_Mono',monospace] tracking-[0.2em] uppercase mb-3">Field Manual / 研究方法防護手冊</div>
                        <h2 className="font-['Noto_Serif_TC',serif] text-[24px] font-bold mb-3 tracking-wide text-white">🧰 R.I.B. 五大工具避險指南</h2>
                        <p className="text-white/50 text-[13px] max-w-[500px] mx-auto">特務請注意，每種調查工具都有專屬的「致命毒點」。點擊下方標籤，詳閱你的裝備說明書。</p>
                    </div>

                    {/* Tabs */}
                    <div className="flex flex-wrap gap-2 mb-10 bg-white/5 p-1 rounded-[6px] border border-white/5">
                        {Object.values(methodPitfalls).map((method) => (
                            <button
                                key={method.id}
                                onClick={() => setActiveMethod(method.id)}
                                className={`flex items-center gap-2 px-4 py-3 rounded-[4px] font-bold text-[12px] transition-all flex-1 min-w-[120px] justify-center border font-['DM_Mono',monospace] uppercase tracking-wider ${activeMethod === method.id
                                        ? 'bg-white text-[#1a1a2e] border-white shadow-xl'
                                        : 'bg-transparent text-white/40 border-transparent hover:text-white/80'
                                    }`}
                            >
                                {method.icon} {method.name.split(' ')[0]}
                            </button>
                        ))}
                    </div>

                    {/* Active Panel */}
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="p-3 bg-white/10 text-[#2d5be3] rounded-[6px] border border-white/10">
                                {currentMethod.icon}
                            </div>
                            <div>
                                <h3 className="text-[18px] font-bold text-white font-['Noto_Serif_TC',serif]">{currentMethod.name}</h3>
                                <p className="text-[#2d5be3] text-[12px] font-bold font-['DM_Mono',monospace] uppercase tracking-[0.1em] mt-1">{currentMethod.subtitle}</p>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6">
                            {currentMethod.errors.map((err, idx) => (
                                <div key={idx} className="bg-white/5 rounded-[8px] border border-white/10 flex flex-col hover:border-white/20 transition-all">
                                    <div className="p-6 border-b border-white/5 space-y-3 flex-1">
                                        <h4 className="font-bold text-[#e32d5b] text-[14px] flex items-start gap-2">
                                            <AlertTriangle size={16} className="shrink-0 mt-0.5" /> {err.name}
                                        </h4>
                                        <p className="text-[12px] text-white/60 leading-relaxed">{err.desc}</p>
                                        <div className="bg-[#e32d5b]/10 p-3 rounded-[4px] border border-[#e32d5b]/20">
                                            <span className="text-[9px] font-bold text-[#e32d5b] uppercase tracking-wider block mb-1">Result / 災難後果</span>
                                            <p className="text-[11px] text-white/80 font-medium leading-relaxed">{err.consequence}</p>
                                        </div>
                                    </div>
                                    <div className="p-5 bg-white/[0.02] space-y-4">
                                        <div>
                                            <span className="text-[9px] font-bold text-white/30 uppercase tracking-[0.2em] block mb-2 font-['DM_Mono',monospace]">Bad Practice</span>
                                            <p className="text-[11px] text-[#e32d5b]/80 leading-relaxed italic">❌ {err.bad}</p>
                                        </div>
                                        <div>
                                            <span className="text-[9px] font-bold text-white/30 uppercase tracking-[0.2em] block mb-2 font-['DM_Mono',monospace]">Best Practice</span>
                                            <p className="text-[11px] text-[#2e7d5a] font-bold leading-relaxed">✅ {err.good}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA to Game */}
            <div className="bg-white border-2 border-[#1a1a2e] rounded-[10px] p-12 text-center relative overflow-hidden group shadow-2xl">
                <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:scale-110 transition-transform duration-700">
                    <ShieldCheck size={160} />
                </div>
                <div className="relative z-10 flex flex-col items-center">
                    <div className="text-[11px] font-['DM_Mono',monospace] tracking-[0.2em] uppercase text-[#2d5be3] mb-4">Training Mission Entry / 進入實作模擬</div>
                    <h3 className="text-[28px] font-black mb-4 font-['Noto_Serif_TC',serif] text-[#1a1a2e]">裝備完畢！立刻執行「行動代號：防線」</h3>
                    <p className="text-[#4a4a6a] leading-relaxed mb-10 max-w-[600px] text-[15px]">
                        總部攔截了 10 份含有致命毒點的研究工具草稿（包含問卷、訪談、實驗等）。請前往處方診斷室，精準找出並修正它們的設計破綻！
                    </p>
                    <Link
                        to="/game/rx-inspector"
                        className="bg-[#1a1a2e] text-white px-10 py-4 rounded-[6px] font-bold transition-all flex items-center gap-3 group/btn text-[15px] hover:bg-[#2a2a4a] hover:-translate-y-1 shadow-lg"
                    >
                        <span>進入遊戲：行動代號：防線</span>
                        <ArrowRight size={20} className="group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>

            {/* 三大標準與倫理 */}
            <div className="grid md:grid-cols-2 gap-10">
                {/* 好工具三大標準 */}
                <section className="space-y-6">
                    <h3 className="font-['Noto_Serif_TC',serif] text-[18px] font-bold text-[#1a1a2e] flex items-center gap-2">
                        <Target size={20} className="text-[#2e7d5a]" /> 總結：好工具的三大標準
                    </h3>
                    <div className="grid gap-4">
                        {[
                            { title: '有效性 (Validity)', icon: <Target size={14} />, desc: '測到你想測的東西。', q: '這題跟目標有關聯嗎？' },
                            { title: '可靠性 (Reliability)', icon: <Scale size={14} />, desc: '測出來的結果穩定。', q: '不同人理解會一致嗎？' },
                            { title: '可行性 (Feasibility)', icon: <Zap size={14} />, desc: '你做得到、受試者願配合。', q: '會不會長到沒人想寫？' },
                        ].map(item => (
                            <div key={item.title} className="bg-[#f0f9f4] border border-[#2e7d5a]/20 p-5 rounded-[6px] flex flex-col gap-2">
                                <div className="flex items-center gap-2">
                                    <span className="text-[#2e7d5a]">{item.icon}</span>
                                    <h4 className="font-bold text-[#1a1a2e] text-[14px]">{item.title}</h4>
                                </div>
                                <p className="text-[12px] text-[#4a4a6a]">{item.desc}</p>
                                <div className="text-[10px] font-bold text-[#2e7d5a] font-['DM_Mono',monospace] uppercase bg-white/50 p-2 rounded tracking-widest">自檢問句：{item.q}</div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 研究倫理 */}
                <section className="space-y-6">
                    <div className="flex items-center justify-between border-b border-[#dddbd5] pb-2">
                        <h3 className="font-['Noto_Serif_TC',serif] text-[18px] font-bold text-[#1a1a2e] flex items-center gap-2">
                            <Heart size={20} className="text-[#e32d5b]" /> 研究倫理紅線
                        </h3>
                        <button
                            onClick={() => setShowEthics(!showEthics)}
                            className="text-[11px] font-bold text-[#e32d5b] hover:underline"
                        >
                            {showEthics ? '收起範本' : '查看同意書範本'}
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        {[
                            { icon: '📝', name: '知情同意', desc: '受訪者知情目的' },
                            { icon: '🔒', name: '保密原則', desc: '絕不洩漏個資' },
                            { icon: '🛡️', name: '不傷害', desc: '避免身心壓力' },
                            { icon: '🤝', name: '自願參與', desc: '隨時可自由退出' },
                        ].map((p) => (
                            <div key={p.name} className="bg-white border border-[#dddbd5] p-4 text-center rounded-[6px] hover:border-[#1a1a2e] transition-colors">
                                <span className="text-xl block mb-2">{p.icon}</span>
                                <h4 className="font-bold text-[#1a1a2e] text-[12px] mb-1">{p.name}</h4>
                                <p className="text-[10px] text-[#8888aa]">{p.desc}</p>
                            </div>
                        ))}
                    </div>

                    {showEthics && (
                        <div className="bg-[#1a1a2e] text-white p-6 rounded-[8px] space-y-4 animate-in fade-in zoom-in-95 duration-300">
                            <div className="text-[10px] font-['DM_Mono',monospace] tracking-[0.2em] uppercase text-[#e32d5b] font-bold">Informed Consent / 知情同意書範本</div>
                            <div className="bg-white/5 p-4 rounded text-[12px] leading-relaxed text-white/70 italic border-l-2 border-[#e32d5b]">
                                您好，我們是 ○○ 高中的學生... 資料僅供本次學術專題使用，絕對保密且不會公開個資... 您可以隨時選擇停止作答。
                            </div>
                            <div className="flex items-center gap-3 bg-white/10 p-3 rounded-[4px] border border-white/10">
                                <div className="w-3 h-3 border border-white/50 rounded-sm"></div>
                                <span className="text-[11px] font-bold tracking-tight">我已閱讀並同意參加本研究</span>
                            </div>
                        </div>
                    )}
                </section>
            </div>

            {/* Navigation Out */}
            <div className="flex justify-start py-8">
                <Link to="/clinic" className="text-[13px] font-bold text-[#8888aa] hover:text-[#1a1a2e] flex items-center gap-2 transition-colors">
                    ← 回 研究急診室 (W5)
                </Link>
            </div>

        </div>
    );
};
