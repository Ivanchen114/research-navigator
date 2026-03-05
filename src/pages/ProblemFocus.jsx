import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PromptBox } from '../components/analysis/PromptBox';
import { PenTool, ArrowRight, Lightbulb, BrainCircuit, Cpu, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';

// ── 三種探究句型 ──────────────────────────────────────────────
const QUESTION_TYPES = [
    {
        type: 'A', label: '影響 / 關聯型',
        template: '「A 如何影響 B？」\n「A 與 B 有什麼關聯？」',
        method: '📋 問卷  🧪 實驗',
        color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200', badge: 'bg-blue-100 text-blue-700',
        example: '「考試壓力如何影響松山高中學生的圖書館使用行為？」',
    },
    {
        type: 'B', label: '比較 / 差異型',
        template: '「A 跟 B 有什麼不同？」\n「A 在不同情境的差異？」',
        method: '📋 問卷  📚 資料分析',
        color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200', badge: 'bg-emerald-100 text-emerald-700',
        example: '「加入社團的高一生與沒有加入的，學習成效有差異嗎？」',
    },
    {
        type: 'C', label: '深究 / 內涵型',
        template: '「A 背後的原因是什麼？」\n「A 是怎麼運作的？」',
        method: '🎤 訪談  👀 觀察',
        color: 'text-purple-700', bg: 'bg-purple-50', border: 'border-purple-200', badge: 'bg-purple-100 text-purple-700',
        example: '「學生選擇圖書館座位的決策背後，有哪些影響因素？」',
    },
];

// ── 鷹架元件：可折疊 Accordion ────────────────────────────────
const SectionHeader = ({ id, title, icon, subtitle, badge, openSection, toggleSection }) => (
    <button
        onClick={() => toggleSection(id)}
        className={`w-full flex items-center justify-between p-5 md:p-6 rounded-2xl text-left transition-all ${openSection === id ? 'bg-slate-900 text-white rounded-b-none' : 'bg-white border border-slate-200 hover:border-slate-300 hover:shadow-sm'}`}
    >
        <div className="flex items-center gap-3">
            <span className="text-xl">{icon}</span>
            <div>
                <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-black text-base">{title}</span>
                    {badge && (
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${openSection === id ? 'bg-slate-700 text-slate-300' : 'bg-amber-100 text-amber-700'}`}>{badge}</span>
                    )}
                </div>
                {subtitle && <p className={`text-xs mt-0.5 ${openSection === id ? 'text-slate-400' : 'text-slate-500'}`}>{subtitle}</p>}
            </div>
        </div>
        {openSection === id ? <ChevronUp size={20} className="text-slate-400 shrink-0" /> : <ChevronDown size={20} className="text-slate-400 shrink-0" />}
    </button>
);

// ── 練習卡片 ────────────────────────────────────────────────
const PracticeCard = ({ label, bgColor, topTag, isMain }) => {
    const [obs, setObs] = useState('');
    const [gap, setGap] = useState('');
    const [q, setQ] = useState('');
    const [theme, setTheme] = useState('');

    return (
        <div className={`rounded-xl border ${isMain ? 'border-amber-300 bg-amber-50' : 'border-slate-200 bg-slate-50'} p-5 space-y-3`}>
            <div className="flex items-center gap-2">
                <span className={`text-xs font-black px-3 py-1 rounded-full ${isMain ? 'bg-amber-500 text-white' : 'bg-slate-700 text-white'}`}>{label}</span>
                {!isMain && (
                    <input
                        className="text-xs border border-slate-300 rounded-lg px-2 py-1 bg-white focus:ring-1 focus:ring-blue-400 min-w-[100px]"
                        placeholder="圖片主題"
                        value={theme}
                        onChange={e => setTheme(e.target.value)}
                    />
                )}
                {isMain && <span className="text-xs text-amber-700 font-bold">★ 這是最重要的！帶著 W1 Part 0 第 3 題過來</span>}
            </div>

            <div className="space-y-2">
                <label className="text-xs font-bold text-slate-600 flex items-center gap-1">
                    <span className="bg-blue-600 text-white w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-black">1</span>
                    我看到的現象 (像攝影機一樣描述，不加解釋)
                </label>
                <textarea className="w-full text-sm border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all min-h-[64px] bg-white" placeholder="具體看到什麼畫面…" value={obs} onChange={e => setObs(e.target.value)} />
            </div>

            <div className="space-y-2">
                <label className="text-xs font-bold text-slate-600 flex items-center gap-1">
                    <span className="bg-amber-500 text-white w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-black">2</span>
                    我發現的落差 (矛盾 / 奇怪之處)
                </label>
                <textarea className="w-full text-sm border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all min-h-[64px] bg-white" placeholder="哪裡跟你想的不一樣？有沒有什麼讓你覺得怪怪的？" value={gap} onChange={e => setGap(e.target.value)} />
            </div>

            <div className="space-y-2">
                <label className="text-xs font-bold text-slate-600 flex items-center gap-1">
                    <span className="bg-emerald-600 text-white w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-black">3</span>
                    我的核心疑問 (白話文！不用管格式！)
                </label>
                <textarea className={`w-full text-sm border rounded-xl p-3 focus:ring-2 transition-all min-h-[64px] font-medium ${isMain ? 'border-amber-300 bg-white focus:ring-amber-400 focus:border-amber-400 text-amber-900' : 'border-emerald-300 bg-white focus:ring-emerald-400 focus:border-emerald-400 text-emerald-900'}`}
                    placeholder="從矛盾中，你最想搞清楚的那一件事是什麼？當作跟同學聊天說出來就好…"
                    value={q} onChange={e => setQ(e.target.value)} />
                {isMain && q && (
                    <div className="bg-amber-100 border border-amber-300 rounded-xl p-3 text-center">
                        <p className="text-amber-800 text-xs font-bold mb-1">✅ 你的核心疑問（帶去 Part 2.5 → Part 3 → Part 4 用！）</p>
                        <p className="text-amber-900 font-bold">「{q}」</p>
                    </div>
                )}
            </div>
        </div>
    );
};

// ── 主元件 ────────────────────────────────────────────────────
export const ProblemFocus = () => {
    // Part 2.5
    const [observation25, setObservation25] = useState('');
    const [selectedGap, setSelectedGap] = useState(null);
    const [finalGap, setFinalGap] = useState('');

    // Part 3
    const [coreQ, setCoreQ] = useState('');
    const [initType, setInitType] = useState(null);
    const [selfIntent, setSelfIntent] = useState('');
    const [selectedType, setSelectedType] = useState(null);
    const [showTypeDetail, setShowTypeDetail] = useState(null);

    // Part 4
    const [draftTitle, setDraftTitle] = useState('');
    const [finalTitle, setFinalTitle] = useState('');
    const [finalChoice, setFinalChoice] = useState(null);

    // Section open
    const [openSection, setOpenSection] = useState('part1');
    const toggleSection = (id) => setOpenSection(prev => prev === id ? null : id);

    // Prompts
    const buildGapPrompt = () =>
        `我觀察到一個現象：${observation25 || '【請先填寫你的觀察現象】'}

請幫我從 5 個不同角度，找出這個現象中可能的「矛盾」或「奇怪之處」。
（例如：時間對比、空間對比、行為對比、群體對比、邏輯矛盾）
請給我 5 個不同的矛盾點，每個用一句話說明。`;

    const buildIntentPrompt = () =>
        `我觀察到：${observation25 || '【你的現象】'}
發現落差：${finalGap || '【你的最終落差】'}
我最想搞清楚的核心疑問是：${coreQ || '【你的白話疑問】'}

請幫我把這個白話疑問，轉化為 3 種不同專業研究方向的「探究意圖」：
A. 影響型（某因素如何影響某結果）
B. 比較型（兩種對象/情境的差異）
C. 深究型（某現象的運作機制/背後原因）
每個方向請用一句話說明，並標註適合的研究方法。`;

    const buildOptimizePrompt = () =>
        `我的研究題目初稿是：${draftTitle || '【請先在下方填寫你的初稿】'}

請幫我優化成更專業的版本：
1. 加上學術關鍵字（如：相關性、差異分析、影響、探討）
2. 讓 Who（研究對象）、What（研究焦點）更具體
3. 保持在 30 字以內，確保高中生做得到
請給我 3 個優化版本（A/B/C），並簡單說明每個版本的改動重點。`;

    const props = { openSection, toggleSection };

    return (
        <div className="max-w-4xl mx-auto space-y-5 animate-in fade-in duration-500">

            {/* ── Header ─────────────────────────────── */}
            <header className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-40 -translate-y-1/2 translate-x-1/3" />
                <div className="relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100 mb-4">
                        <PenTool size={16} /> W2 問題意識
                    </div>
                    <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-3">
                        把觀察，<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">變成問題</span>
                    </h1>
                    <p className="text-slate-600 max-w-2xl mx-auto leading-relaxed">
                        今天練的叫做「<strong>品味</strong>」——從平凡畫面看見不平凡。<br />
                        用<strong>四段式思考</strong>，搭配三次 AI 協作，把你的觀察磨成一顆研究原石！
                    </p>
                </div>
            </header>

            {/* ── Part 1：四段式框架說明 ─────────────── */}
            <div className="rounded-2xl overflow-hidden border border-slate-200">
                <SectionHeader id="part1" title="Part 1｜認識四段式思考框架" icon="🛑" subtitle="研究不是問十萬個為什麼，而是有層次地把畫面變成學術問題。" {...props} />
                {openSection === 'part1' && (
                    <div className="bg-white p-6 md:p-8 space-y-5 border-t border-slate-100">
                        {/* 爛 vs 好 */}
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="bg-red-50 rounded-xl border border-red-100 p-4">
                                <div className="text-red-700 font-bold text-sm mb-2">❌ 「為什麼」是爛問題</div>
                                <p className="text-slate-600 text-sm">「為什麼圖書館人很多？」</p>
                                <p className="text-slate-400 text-xs mt-1">→ 答案太多、太發散、不知道你想研究什麼</p>
                            </div>
                            <div className="bg-green-50 rounded-xl border border-green-100 p-4">
                                <div className="text-green-700 font-bold text-sm mb-2">✅ 四段式思考</div>
                                <p className="text-slate-600 text-sm">現象 → 落差 → 核心疑問 → 探究意圖</p>
                                <p className="text-slate-400 text-xs mt-1">→ 有方向、可測量、學術格式</p>
                            </div>
                        </div>

                        {/* 四步驟卡片 */}
                        <div className="space-y-3">
                            {[
                                {
                                    step: '1', title: '覺察現象 (Observation)',
                                    badge: '⚠️ 只有人能做！AI 沒去過你的學校',
                                    color: 'bg-blue-600',
                                    desc: '像攝影機一樣，你具體看到了什麼畫面？客觀描述，不加解釋或評論。',
                                    example: '「我看到段考前圖書館閱覽室總是爆滿。」',
                                },
                                {
                                    step: '2', title: '發現落差 (Gap)',
                                    badge: '⚠️ 人主導，AI 可從多角度協助',
                                    color: 'bg-amber-500',
                                    desc: '這裡面有什麼矛盾？哪裡跟你預期的不一樣？哪裡讓你覺得怪怪的？',
                                    example: '「但借書區卻空無一人，而且考完後閱覽室也瞬間沒人了。」',
                                },
                                {
                                    step: '3', title: '鎖定核心疑問 (Core Question)',
                                    badge: '⚠️ 這是你的好奇心，只有你能決定！',
                                    color: 'bg-orange-500',
                                    desc: '從那些矛盾中，你最想搞清楚的「那一件事」是什麼？用白話文說出來就好，不用管格式！',
                                    example: '「為什麼考前那麼多人去，考完立刻全消失？大家去圖書館到底在幹嘛？」',
                                    highlight: true,
                                },
                                {
                                    step: '4', title: '探究意圖 (Intent)',
                                    badge: '⚠️ 第二節課重點，AI 幫你翻譯！',
                                    color: 'bg-emerald-600',
                                    desc: '把你的白話疑問，套上學術界通用的「研究句型」（A影響型/B比較型/C深究型）。',
                                    example: '「我想探究『考試壓力』如何影響學生對『圖書館空間使用』的選擇。」',
                                },
                            ].map(item => (
                                <div key={item.step} className={`flex gap-4 rounded-xl p-4 border ${item.highlight ? 'bg-orange-50 border-orange-200' : 'bg-slate-50 border-slate-100'}`}>
                                    <div className={`${item.color} text-white w-7 h-7 rounded-full flex items-center justify-center font-black text-xs shrink-0 mt-0.5`}>{item.step}</div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                                            <span className="font-bold text-slate-800 text-sm">{item.title}</span>
                                            <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-bold">{item.badge}</span>
                                        </div>
                                        <p className="text-slate-600 text-sm">{item.desc}</p>
                                        {item.highlight && (
                                            <p className="text-orange-700 text-xs font-bold mt-1">💡 第一節課你只要能寫到這步就及格！</p>
                                        )}
                                        <p className="text-slate-400 text-xs italic mt-1.5">📍 範例：{item.example}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* ── Part 2：圖片 + 個人練習（人類主場）─ */}
            <div className="rounded-2xl overflow-hidden border border-slate-200">
                <SectionHeader id="part2" title="Part 2｜循環練習：從觀察到核心疑問（人自己做）" icon="🖼️" subtitle="第一節課全人類主場，不准用 AI！禁用「為什麼」開頭！步驟 3 只要白話文！" {...props} />
                {openSection === 'part2' && (
                    <div className="bg-white p-6 md:p-8 space-y-5 border-t border-slate-100">
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
                            ⚠️ <strong>人腦專區</strong>：步驟 1~3 禁止使用 AI！步驟 3「核心疑問」只要用白話文問出來就好，不需要學術格式。
                        </div>
                        {/* 練習一 */}
                        <PracticeCard label="📍 練習一" isMain={false} />
                        {/* 練習二 */}
                        <PracticeCard label="📍 練習二" isMain={false} />
                        {/* 練習 0 */}
                        <PracticeCard label="🔥 練習 0：我的觀察（最重要！）" isMain={true} />
                    </div>
                )}
            </div>

            {/* ── Part 2.5：AI 協作 1 落差擴充器 ─────── */}
            <div className="rounded-2xl overflow-hidden border border-blue-200">
                <SectionHeader id="part25" title="Part 2.5｜🤖 AI 協作 1 — 落差擴充器" icon="🤖" subtitle="AI 幫你從 5 個角度看矛盾，但你要選哪個！" badge="AI 協作" {...props} />
                {openSection === 'part25' && (
                    <div className="bg-white p-6 md:p-8 space-y-5 border-t border-blue-100">
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
                            <strong>AI 的能力邊界：</strong>AI 沒去過你的學校，無法替你觀察。但你把觀察告訴 AI，它可以幫你從多個角度找矛盾。<br />
                            <strong>重點：AI 給 5 個矛盾選項，但你要選哪個、為什麼選，這是你的判斷！</strong>
                        </div>

                        {/* Step 1 */}
                        <div className="space-y-2">
                            <label className="font-bold text-slate-700 text-sm">Step 1：我的現象（從練習 0 抄過來）</label>
                            <textarea
                                className="w-full border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-400 transition-all min-h-[64px]"
                                placeholder="把練習 0 步驟 1 寫的現象貼過來…"
                                value={observation25}
                                onChange={e => setObservation25(e.target.value)}
                            />
                        </div>

                        {/* Step 2 Prompt */}
                        <div>
                            <label className="font-bold text-slate-700 text-sm mb-2 block">Step 2：複製這個 Prompt 給 AI，讓它找 5 個矛盾</label>
                            <div className="bg-slate-50 rounded-xl border border-slate-200 p-4">
                                <PromptBox>{buildGapPrompt()}</PromptBox>
                            </div>
                        </div>

                        {/* Step 4 */}
                        <div>
                            <label className="font-bold text-slate-700 text-sm mb-2 block">Step 4：我的選擇（核心！）</label>
                            <p className="text-slate-500 text-xs mb-3">看完 AI 給的 5 個矛盾後，問自己：「這個矛盾我真的觀察到了嗎？這個矛盾讓我有興趣探究嗎？」</p>
                            <div className="grid grid-cols-3 gap-2 mb-4">
                                {[1, 2, 3, 4, 5, '都不選（用原本的）'].map(n => (
                                    <button
                                        key={n}
                                        onClick={() => setSelectedGap(n)}
                                        className={`py-2 px-2 rounded-lg border text-xs font-bold transition-all ${selectedGap === n ? 'bg-blue-600 border-blue-600 text-white' : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-blue-300'}`}
                                    >
                                        {typeof n === 'number' ? `選 ${n} 號` : n}
                                    </button>
                                ))}
                            </div>
                            {selectedGap && (
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">👉 我最終決定的落差是：</label>
                                    <textarea
                                        className="w-full border border-blue-300 bg-blue-50 rounded-xl p-3 text-sm text-blue-900 focus:ring-2 focus:ring-blue-500 transition-all min-h-[64px]"
                                        placeholder="把你選定的落差整理成一句話…"
                                        value={finalGap}
                                        onChange={e => setFinalGap(e.target.value)}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* ── Part 3：AI 協作 2 探究意圖生成器 ────── */}
            <div className="rounded-2xl overflow-hidden border border-purple-200">
                <SectionHeader id="part3" title="Part 3｜🤖 AI 協作 2 — 探究意圖生成器（完成步驟 4）" icon="🤖" subtitle="先自己勾選入口（★ Step 0），再問 AI 翻成三個學術方向，你來選！" badge="AI 協作" {...props} />
                {openSection === 'part3' && (
                    <div className="bg-white p-6 md:p-8 space-y-5 border-t border-purple-100">

                        {/* Step 0：先找入口 */}
                        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                            <p className="font-bold text-orange-800 text-sm mb-3">★ Step 0：先找入口（不准用 AI！）</p>
                            <p className="text-slate-600 text-sm mb-3">看著練習 0 寫的「核心疑問（白話文）」，你填在這裡：</p>
                            <textarea
                                className="w-full border border-orange-300 bg-white rounded-xl p-3 text-sm focus:ring-2 focus:ring-orange-400 transition-all min-h-[56px] text-orange-900 font-medium"
                                placeholder="把練習 0 步驟 3 的白話核心疑問貼過來…"
                                value={coreQ}
                                onChange={e => setCoreQ(e.target.value)}
                            />
                            <p className="text-slate-600 text-sm mt-3 mb-2">你最想知道的是哪種？</p>
                            <div className="space-y-2">
                                {[
                                    { key: 'A', label: '某個因素對結果的影響或關聯？', type: 'A 型（影響型）' },
                                    { key: 'B', label: '兩種情況或兩群人的差異？', type: 'B 型（比較型）' },
                                    { key: 'C', label: '某件事背後的原因或機制？', type: 'C 型（深究型）' },
                                ].map(opt => (
                                    <button
                                        key={opt.key}
                                        onClick={() => setInitType(opt.key)}
                                        className={`w-full text-left text-sm py-2.5 px-4 rounded-lg border transition-all flex items-center gap-3 ${initType === opt.key ? 'bg-orange-500 text-white border-orange-500 font-bold' : 'bg-white border-slate-200 text-slate-700 hover:border-orange-300'}`}
                                    >
                                        <span className="font-black text-base">{opt.key}</span>
                                        <span>{opt.label}</span>
                                        <span className="ml-auto text-[11px] opacity-70">→ {opt.type}</span>
                                    </button>
                                ))}
                            </div>
                            {initType && <p className="text-orange-700 text-sm font-bold mt-2">👉 我初步判斷是 {initType} 型！</p>}
                        </div>

                        {/* 三種句型說明（可展開） */}
                        <div>
                            <h3 className="font-bold text-slate-700 text-sm mb-3 flex items-center gap-2"><Lightbulb size={16} className="text-amber-500" /> 三種探究句型參考（點擊展開）</h3>
                            <div className="grid md:grid-cols-3 gap-3">
                                {QUESTION_TYPES.map(qt => (
                                    <div
                                        key={qt.type}
                                        onClick={() => setShowTypeDetail(showTypeDetail === qt.type ? null : qt.type)}
                                        className={`rounded-xl border p-4 cursor-pointer transition-all ${showTypeDetail === qt.type ? `${qt.bg} ${qt.border} shadow-sm` : 'bg-slate-50 border-slate-200 hover:border-slate-300'}`}
                                    >
                                        <div className={`inline-block text-xs font-black px-2 py-0.5 rounded-full mb-2 ${qt.badge}`}>{qt.type} 型</div>
                                        <div className={`font-bold text-sm mb-1 ${showTypeDetail === qt.type ? qt.color : 'text-slate-700'}`}>{qt.label}</div>
                                        <div className="text-slate-400 text-xs font-mono">{qt.method}</div>
                                        {showTypeDetail === qt.type && (
                                            <div className="mt-3 space-y-2">
                                                <p className={`text-xs font-mono ${qt.color} whitespace-pre-line`}>{qt.template}</p>
                                                <p className="text-slate-500 text-xs italic">📍 例：{qt.example}</p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Step 1：自己先想 */}
                        <div>
                            <label className="font-bold text-slate-700 text-sm block mb-2">Step 1：我先自己想（不准用 AI！）</label>
                            <textarea
                                className="w-full border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-purple-400 transition-all min-h-[64px]"
                                placeholder="根據核心疑問，如果硬要套用上述句型，我初步想這樣寫…"
                                value={selfIntent}
                                onChange={e => setSelfIntent(e.target.value)}
                            />
                        </div>

                        {/* Step 2：AI Prompt */}
                        <div>
                            <label className="font-bold text-slate-700 text-sm block mb-2">Step 2：複製這個 Prompt 給 AI，讓它給你 A/B/C 三種方向</label>
                            <div className="bg-slate-50 rounded-xl border border-slate-200 p-4">
                                <PromptBox>{buildIntentPrompt()}</PromptBox>
                            </div>
                        </div>

                        {/* Step 4：我的選擇 */}
                        <div>
                            <label className="font-bold text-slate-700 text-sm block mb-3">Step 4：我的選擇（核心！）</label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
                                {['我自己的', 'AI 的 A 型', 'AI 的 B 型', 'AI 的 C 型'].map(opt => (
                                    <button
                                        key={opt}
                                        onClick={() => setSelectedType(opt)}
                                        className={`py-2 px-3 rounded-lg border text-sm font-bold transition-all ${selectedType === opt ? 'bg-purple-600 border-purple-600 text-white' : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-purple-300'}`}
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>
                            {selectedType && (
                                <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 text-sm text-purple-800">
                                    <p className="font-bold mb-2">✅ 選了「{selectedType}」——選擇的理由（至少符合一項）：</p>
                                    <div className="space-y-1">
                                        {['我做得到（研究對象找得到、資源夠、時間夠）', '我有興趣（我真的想知道答案）', '方向最清楚', '這個方法我比較會用'].map(r => (
                                            <label key={r} className="flex items-center gap-2 cursor-pointer">
                                                <input type="checkbox" className="rounded text-purple-600" />
                                                <span>{r}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Step 5 AI-RED */}
                        <div className="bg-slate-900 rounded-xl p-4 text-slate-300 text-xs space-y-1">
                            <div className="text-slate-400 font-mono text-[10px] tracking-widest mb-2 uppercase">// Step 5：AI-RED 記錄</div>
                            <div><span className="text-cyan-400 font-bold">A</span>scribe：我使用了 □ ChatGPT □ Claude □ Gemini □ 其他</div>
                            <div><span className="text-cyan-400 font-bold">I</span>nquire：我問了 AI：把我的白話疑問翻成 A/B/C 三種探究方向</div>
                            <div><span className="text-cyan-400 font-bold">R</span>eference：資料來源：無（AI 生成）</div>
                            <div><span className="text-cyan-400 font-bold">E</span>valuate：AI 給的建議是否合理？我的評估：___</div>
                            <div><span className="text-cyan-400 font-bold">D</span>ocument：最終我選了___，因為___</div>
                        </div>
                    </div>
                )}
            </div>


            {/* ── 今日回顧卡 ─────────────────────────── */}
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5">
                <h3 className="font-bold text-slate-700 text-sm mb-3">📊 今天做了什麼回顧</h3>
                <div className="grid md:grid-cols-2 gap-3">
                    <div>
                        <p className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">👤 你做的（AI 做不到）</p>
                        <ul className="space-y-1 text-sm text-slate-700">
                            {['觀察真實現象', '用白話說出核心疑問', '選擇落差方向', '選擇探究角度'].map(i => (
                                <li key={i} className="flex items-start gap-2"><CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" />{i}</li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">🤖 AI 幫你做的</p>
                        <ul className="space-y-1 text-sm text-slate-700">
                            {['從 5 個角度看落差', '把白話翻成學術方向（A/B/C）'].map(i => (
                                <li key={i} className="flex items-start gap-2"><Cpu size={14} className="text-blue-500 shrink-0 mt-0.5" />{i}</li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className="mt-4 text-center bg-white rounded-lg p-3 border border-slate-200">
                    <span className="font-black text-slate-700">🔑 關鍵心法：AI 給選項，但你做選擇！</span>
                </div>
            </div>


            {/* ── Part Z：自我檢核 ──────────────────────── */}
            <div className="rounded-2xl overflow-hidden border border-slate-200">
                <SectionHeader id="partz" title="Part Z｜✅ 自我檢核" icon="✅" subtitle="誠實勾選，完成才算數！" {...props} />
                {openSection === 'partz' && (
                    <div className="bg-white p-6 md:p-8 border-t border-slate-100">
                        <div className="space-y-3">
                            {[
                                '我已完成 Part 2 的三個練習，步驟 1~3 都有填寫。',
                                '我已完成 Part 2.5 的 AI 協作 1（落差擴充器）。',
                                '我已完成 Part 3 的 Step 0（核心疑問分類）和 AI 協作 2（探究意圖生成器）。',
                                '我的「探究意圖」已經選定（Part 3 Step 4 已完成）。',
                                '我理解：AI 給選項，但我做選擇。',
                            ].map(item => (
                                <label key={item} className="flex items-start gap-3 cursor-pointer group">
                                    <input type="checkbox" className="mt-0.5 w-4 h-4 rounded text-emerald-600 cursor-pointer" />
                                    <span className="text-sm text-slate-700 group-hover:text-slate-900">{item}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* ── 下週預告 ────────────────────────────── */}
            <div className="bg-slate-900 rounded-3xl p-6 text-white">
                <p className="text-slate-400 text-xs font-mono tracking-widest mb-2 uppercase">// 📢 下週 W3 預告</p>
                <p className="text-white font-bold text-lg mb-1">「題目健檢與 AI 協作工作坊」</p>
                <p className="text-slate-300 text-sm mb-3">你會學到：萬用急救心法、診斷 8 種爛題目、用「5W1H」規格化、用「可行性快篩」確認可行，以及用 <strong className="text-amber-300">AI 句型優化器</strong>把題目包裝成真正的研究題目！</p>
                <div className="bg-amber-500/20 border border-amber-500/40 rounded-xl p-3">
                    <p className="text-amber-300 font-bold text-sm">⚠️ 請帶著你 Part 3 的「最終探究意圖」來！那就是下週要健檢的病人！</p>
                </div>
            </div>

            {/* ── Navigation ────────────────────────── */}
            <div className="flex justify-between pt-2 pb-12">
                <Link to="/w1" className="inline-flex items-center gap-2 bg-slate-200 text-slate-700 px-5 py-3 rounded-lg font-semibold hover:bg-slate-300 transition">
                    ← 回 W1
                </Link>
                <Link to="/wizard" className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition shadow-md hover:shadow-lg">
                    帶著題目，前進「方法快篩」<ArrowRight size={20} />
                </Link>
            </div>
        </div>
    );
};
