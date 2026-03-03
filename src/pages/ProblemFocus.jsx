import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PromptBox } from '../components/analysis/PromptBox';
import { PenTool, ArrowRight, Lightbulb, BrainCircuit, Cpu, CheckCircle2, ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react';

// 三種探究句型
const QUESTION_TYPES = [
    {
        type: 'A',
        label: '影響 / 關聯型',
        template: '「A 如何影響 B？」\n「A 與 B 有什麼關聯？」',
        method: '📋 問卷  🧪 實驗',
        color: 'text-blue-700',
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        badge: 'bg-blue-100 text-blue-700',
        example: '「考試壓力如何影響松山高中學生的圖書館使用行為？」',
    },
    {
        type: 'B',
        label: '比較 / 差異型',
        template: '「A 跟 B 有什麼不同？」\n「A 在不同情境下的差異？」',
        method: '📋 問卷  📚 資料分析',
        color: 'text-emerald-700',
        bg: 'bg-emerald-50',
        border: 'border-emerald-200',
        badge: 'bg-emerald-100 text-emerald-700',
        example: '「加入社團的高一生與沒加入的，學習成效有差異嗎？」',
    },
    {
        type: 'C',
        label: '深究 / 內涵型',
        template: '「A 背後的原因是什麼？」\n「A 是怎麼運作的？」',
        method: '🎤 訪談  👀 觀察',
        color: 'text-purple-700',
        bg: 'bg-purple-50',
        border: 'border-purple-200',
        badge: 'bg-purple-100 text-purple-700',
        example: '「學生選擇圖書館座位的決策背後，有哪些影響因素？」',
    },
];

export const ProblemFocus = () => {
    // Part 2 三段式練習
    const [observation, setObservation] = useState('');
    const [gap, setGap] = useState('');
    const [intent, setIntent] = useState('');

    // Part 2.5 AI 落差擴充器
    const [selectedGap, setSelectedGap] = useState(null);
    const [finalGap, setFinalGap] = useState('');

    // Part 3 探究意圖生成器
    const [selfIntent, setSelfIntent] = useState('');
    const [selectedType, setSelectedType] = useState(null);
    const [showTypeDetail, setShowTypeDetail] = useState(null);

    // Part 4 句型優化器
    const [draftTitle, setDraftTitle] = useState('');
    const [finalTitle, setFinalTitle] = useState('');

    // Section toggle
    const [openSection, setOpenSection] = useState('part2');
    const toggleSection = (id) => setOpenSection(prev => prev === id ? null : id);

    // === Prompt generators ===
    const generateGapPrompt = () =>
        `我觀察到一個現象：${observation || '【請先填寫你的觀察現象】'}

請幫我從5個不同角度，找出這個現象中可能的「矛盾」或「奇怪之處」。

角度範例：
- 時間對比（平常 vs 特殊時候）
- 空間對比（不同地點的差異）
- 行為對比（預期 vs 實際發生的）
- 群體對比（不同人的行為差異）
- 邏輯矛盾（說的 vs 做的不一致）

請給我5個不同的矛盾點，每個用一句話說明。`;

    const generateIntentPrompt = () =>
        `我觀察到：${observation || '【你的現象】'}
但發現：${finalGap || gap || '【你的落差】'}

請給我3種不同的探究方向：
A. 影響型（某因素如何影響某結果）
B. 比較型（兩種對象/情境的差異）
C. 深究型（某現象的運作機制/背後原因）

每個方向請用一句話說明，並標註適合的研究方法（問卷/訪談/觀察/實驗/文獻）。`;

    const generateOptimizePrompt = () =>
        `我的研究題目初稿是：${draftTitle || '【請先在下方填寫你的初稿】'}

請幫我優化成更專業的版本：
1. 加上學術關鍵字（如：相關性、差異分析、影響、探討）
2. 讓 Who（研究對象）、What（研究焦點）更具體
3. 保持在 30 字以內
4. 確保高中生做得到

請給我 3 個優化版本（A/B/C），並簡單說明每個版本的改動重點。`;

    const SectionHeader = ({ id, title, icon, subtitle, badge }) => (
        <button
            onClick={() => toggleSection(id)}
            className={`w-full flex items-center justify-between p-5 md:p-6 rounded-2xl text-left transition-all ${openSection === id ? 'bg-slate-900 text-white rounded-b-none' : 'bg-white border border-slate-200 hover:border-slate-300 hover:shadow-sm'}`}
        >
            <div className="flex items-center gap-3">
                <span className={`text-xl ${openSection === id ? 'text-white' : ''}`}>{icon}</span>
                <div>
                    <div className="flex items-center gap-2">
                        <span className="font-black text-base">{title}</span>
                        {badge && <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${openSection === id ? 'bg-slate-700 text-slate-300' : 'bg-amber-100 text-amber-700'}`}>{badge}</span>}
                    </div>
                    {subtitle && <p className={`text-xs mt-0.5 ${openSection === id ? 'text-slate-400' : 'text-slate-500'}`}>{subtitle}</p>}
                </div>
            </div>
            {openSection === id ? <ChevronUp size={20} className="text-slate-400 shrink-0" /> : <ChevronDown size={20} className="text-slate-400 shrink-0" />}
        </button>
    );

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">

            {/* Header */}
            <header className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-40 -translate-y-1/2 translate-x-1/3" />
                <div className="relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100 shadow-sm mb-4">
                        <PenTool size={16} /> W2 問題意識
                    </div>
                    <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-3">
                        把觀察，<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">變成問題</span>
                    </h1>
                    <p className="text-slate-600 max-w-2xl mx-auto leading-relaxed">
                        研究不是問「為什麼」，而是要<strong>具體指出你想探究的方向</strong>。<br />
                        今天用三段式思考 + 三次 AI 協作，把你的觀察磨成一顆「研究原石」。
                    </p>
                </div>
            </header>

            {/* 核心框架說明 */}
            <section className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 md:p-8">
                <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <BrainCircuit className="text-blue-600" size={24} /> 三段式思考框架
                </h2>

                {/* 爛問題 vs 好問題 */}
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-red-50 rounded-xl border border-red-100 p-4">
                        <div className="text-red-700 font-bold text-sm mb-2">❌ 「為什麼」是爛問題</div>
                        <p className="text-slate-600 text-sm">「為什麼圖書館人很多？」</p>
                        <p className="text-slate-400 text-xs mt-1">→ 答案太多、太發散、沒有方向，無法研究</p>
                    </div>
                    <div className="bg-green-50 rounded-xl border border-green-100 p-4">
                        <div className="text-green-700 font-bold text-sm mb-2">✅ 三段式思考</div>
                        <p className="text-slate-600 text-sm">具體現象 → 發現落差 → 探究意圖</p>
                        <p className="text-slate-400 text-xs mt-1">→ 有方向、可測量、有研究價值</p>
                    </div>
                </div>

                {/* 三步驟 */}
                <div className="space-y-3">
                    {[
                        { step: '1', title: '覺察現象 (Observation)', color: 'bg-blue-600', badge: '⚠️ 只有人能做！', desc: '像攝影機一樣，你具體看到了什麼畫面？AI 沒去過你的學校，無法替你觀察。', example: '「我看到段考前圖書館閱覽室爆滿，但借書區空無一人。」' },
                        { step: '2', title: '發現落差 (Gap)', color: 'bg-amber-500', badge: '⚠️ 人主導，AI 可協助！', desc: '這裡面有什麼矛盾？跟你想的不一樣？哪裡怪怪的？AI 可以從多個角度幫你看矛盾！', example: '「預期閱覽室是來讀書的，但大家只在考試前來，而且考完立刻消失。」' },
                        { step: '3', title: '探究意圖 (Intent)', color: 'bg-emerald-600', badge: '⚠️ AI 給選項，人做選擇！', desc: '所以我想搞清楚 A 和 B 的關係。AI 不知道你對什麼有興趣、你做得到什麼。', example: '「我想探究：考試壓力如何影響學生對圖書館空間的使用選擇。」' },
                    ].map(item => (
                        <div key={item.step} className="flex gap-4 bg-slate-50 rounded-xl p-4 border border-slate-100">
                            <div className={`${item.color} text-white w-8 h-8 rounded-full flex items-center justify-center font-black text-sm shrink-0 mt-0.5`}>{item.step}</div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1 flex-wrap">
                                    <span className="font-bold text-slate-800 text-sm">{item.title}</span>
                                    <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-bold">{item.badge}</span>
                                </div>
                                <p className="text-slate-600 text-sm">{item.desc}</p>
                                <p className="text-slate-400 text-xs italic mt-1">📍 範例：{item.example}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── Part 2：練習0 三段式思考 ── */}
            <div className="rounded-2xl overflow-hidden border border-slate-200">
                <SectionHeader id="part2" title="Part 2：三段式練習（人自己做）" icon="🖼️" subtitle="把你在 W1 寫下的「好奇現象」帶過來改寫。⚠️ 不准用 AI！" />
                {openSection === 'part2' && (
                    <div className="bg-white p-6 md:p-8 space-y-6 border-t border-slate-100">
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
                            ⚠️ 請拿出 W1 學習單 Part 0 第 3 題你寫的「好奇現象」，用三段式思考重新改寫。<strong>禁止使用「為什麼」開頭！</strong>
                        </div>
                        {/* 步驟 1 */}
                        <div className="space-y-2">
                            <label className="font-bold text-slate-700 flex items-center gap-2">
                                <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">1</span>
                                我看到的現象（具體的畫面）
                            </label>
                            <textarea
                                className="w-full border border-slate-300 rounded-xl p-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all min-h-[90px] text-sm"
                                placeholder="像攝影機一樣，客觀描述你看到的場景，不要加解釋或評論…"
                                value={observation}
                                onChange={e => setObservation(e.target.value)}
                            />
                        </div>
                        {/* 步驟 2 */}
                        <div className="space-y-2 bg-slate-50 p-5 rounded-xl border border-slate-100">
                            <label className="font-bold text-slate-700 flex items-center gap-2">
                                <span className="bg-amber-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">2</span>
                                我發現的落差（矛盾 / 奇怪之處）
                            </label>
                            <p className="text-slate-500 text-xs">「應該要…但卻…」格式：什麼是理所當然的期待？但現實裡發生了什麼？</p>
                            <textarea
                                className="w-full border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all text-sm min-h-[80px]"
                                placeholder="例：學生應該會借書來研究，但閱覽室裡幾乎沒人借書，只是佔位子坐在那裡…"
                                value={gap}
                                onChange={e => setGap(e.target.value)}
                            />
                            <div className="flex justify-center">
                                <span className="bg-red-100 text-red-700 text-xs px-3 py-1 rounded-full font-bold border border-red-200">↑ 這個衝突，就是研究的價值！</span>
                            </div>
                        </div>
                        {/* 步驟 3 */}
                        <div className="space-y-2">
                            <label className="font-bold text-slate-700 flex items-center gap-2">
                                <span className="bg-emerald-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">3</span>
                                我的探究意圖（你想搞清楚什麼？）
                            </label>
                            <p className="text-slate-500 text-xs">用「我想探究 A 如何影響/造成 B」的格式，不要用「為什麼」。</p>
                            <textarea
                                className="w-full border border-emerald-300 bg-emerald-50 rounded-xl p-4 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all font-medium text-emerald-900 min-h-[80px] text-sm"
                                placeholder="我想探究「___」如何影響/造成「___」…"
                                value={intent}
                                onChange={e => setIntent(e.target.value)}
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* ── Part 2.5：AI 協作 1 落差擴充器 ── */}
            <div className="rounded-2xl overflow-hidden border border-blue-200">
                <SectionHeader id="part25" title="Part 2.5：AI 協作 1 — 落差擴充器" icon="🤖" subtitle="AI 幫你從 5 個角度看落差，但你要選哪個！" badge="AI 協作" />
                {openSection === 'part25' && (
                    <div className="bg-white p-6 md:p-8 space-y-6 border-t border-blue-100">
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
                            <strong>🤖 AI 的能力邊界：</strong><br />
                            AI 沒去過你的學校，所以「觀察」只有你能做。但你把觀察告訴 AI，它可以幫你從多個角度找矛盾。<br />
                            <strong>重點：AI 給 5 個矛盾，但你要選哪個、為什麼選，這是你的判斷！</strong>
                        </div>

                        <div>
                            <h3 className="font-bold text-slate-700 mb-2 text-sm">📋 Step 2：複製這個 Prompt 給 AI</h3>
                            <div className="bg-slate-50 rounded-xl border border-slate-200 p-4">
                                <PromptBox>{generateGapPrompt()}</PromptBox>
                            </div>
                        </div>

                        <div>
                            <h3 className="font-bold text-slate-700 mb-3 text-sm">🎯 Step 4：我的選擇（核心！）</h3>
                            <p className="text-slate-500 text-xs mb-3">看完 AI 給的 5 個矛盾後，選一個你覺得最真實、最有趣的。問自己：這個矛盾我真的觀察到了嗎？這個矛盾讓我有興趣探究嗎？</p>
                            <div className="grid grid-cols-3 gap-2 mb-4">
                                {[1, 2, 3, 4, 5, '都不選（用我自己的）'].map(n => (
                                    <button
                                        key={n}
                                        onClick={() => setSelectedGap(n)}
                                        className={`py-2 px-3 rounded-lg border text-sm font-bold transition-all ${selectedGap === n ? 'bg-blue-600 border-blue-600 text-white' : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-blue-300'}`}
                                    >
                                        {typeof n === 'number' ? `選 ${n} 號` : n}
                                    </button>
                                ))}
                            </div>
                            {selectedGap && (
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">👉 我最終的落差是：</label>
                                    <textarea
                                        className="w-full border border-blue-300 bg-blue-50 rounded-xl p-3 text-sm text-blue-900 focus:ring-2 focus:ring-blue-500 transition-all min-h-[70px]"
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

            {/* ── Part 3：AI 協作 2 探究意圖生成器 ── */}
            <div className="rounded-2xl overflow-hidden border border-purple-200">
                <SectionHeader id="part3" title="Part 3：AI 協作 2 — 探究意圖生成器" icon="🤖" subtitle="先自己想一個方向，再問 AI 給三種句型，你來選！" badge="AI 協作" />
                {openSection === 'part3' && (
                    <div className="bg-white p-6 md:p-8 space-y-6 border-t border-purple-100">

                        {/* 三種句型參考 */}
                        <div>
                            <h3 className="font-bold text-slate-700 mb-3 text-sm flex items-center gap-2"><Lightbulb size={16} className="text-amber-500" /> 三種探究句型參考</h3>
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
                                            <div className="mt-3 space-y-1">
                                                <p className={`text-xs font-mono ${qt.color} whitespace-pre-line`}>{qt.template}</p>
                                                <p className="text-slate-500 text-xs italic mt-2">📍 例：{qt.example}</p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Step 1 自己想 */}
                        <div>
                            <label className="font-bold text-slate-700 text-sm mb-2 block">📝 Step 1：我先自己想（不准用 AI！）</label>
                            <textarea
                                className="w-full border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-purple-400 transition-all min-h-[70px]"
                                placeholder="根據我的「現象 + 落差」，我想探究…"
                                value={selfIntent}
                                onChange={e => setSelfIntent(e.target.value)}
                            />
                        </div>

                        {/* Step 2 AI Prompt */}
                        <div>
                            <label className="font-bold text-slate-700 text-sm mb-2 block">🤖 Step 2：複製這個 Prompt 給 AI，要求它給你 A/B/C 三種方向</label>
                            <div className="bg-slate-50 rounded-xl border border-slate-200 p-4">
                                <PromptBox>{generateIntentPrompt()}</PromptBox>
                            </div>
                        </div>

                        {/* Step 4 選擇 */}
                        <div>
                            <label className="font-bold text-slate-700 text-sm mb-3 block">🎯 Step 4：我的選擇（你來選！）</label>
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
                                    <p className="font-bold mb-1">✅ 選了「{selectedType}」——選擇的理由（至少符合 2 項）：</p>
                                    <ul className="space-y-1 text-sm">
                                        {['這個題目我做得到（對象找得到、資源夠、時間夠）', '這個題目我有興趣（我真的想知道答案）', '這個方向比我想的更清楚'].map(reason => (
                                            <li key={reason} className="flex items-start gap-2"><CheckCircle2 size={14} className="text-purple-400 mt-0.5 shrink-0" />{reason}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>

                        {/* AI-RED 記錄 */}
                        <div className="bg-slate-900 rounded-xl p-4 text-slate-300 text-xs space-y-1">
                            <div className="text-slate-400 font-mono text-[10px] tracking-widest mb-2 uppercase">// AI-RED 記錄（Step 5）</div>
                            <div><span className="text-cyan-400 font-bold">A</span> scribe：我使用了 ChatGPT / Claude / Gemini / 其他</div>
                            <div><span className="text-cyan-400 font-bold">I</span> nquire：我問了 AI：給我三種探究方向（A/B/C 型）</div>
                            <div><span className="text-cyan-400 font-bold">R</span> eference：AI 的資料來源：無（AI 生成）</div>
                            <div><span className="text-cyan-400 font-bold">E</span> valuate：AI 給的建議是否合理？我有自己判斷嗎？</div>
                            <div><span className="text-cyan-400 font-bold">D</span> ocument：最終我選了___，因為___</div>
                        </div>
                    </div>
                )}
            </div>

            {/* ── Part 4：AI 協作 3 句型優化器 ── */}
            <div className="rounded-2xl overflow-hidden border border-amber-200">
                <SectionHeader id="part4" title="Part 4：AI 協作 3 — 句型優化器" icon="🤖" subtitle="先自己寫初稿，再問 AI 優化成更專業的版本！" badge="AI 協作" />
                {openSection === 'part4' && (
                    <div className="bg-white p-6 md:p-8 space-y-6 border-t border-amber-100">
                        <div>
                            <label className="font-bold text-slate-700 text-sm mb-2 block">📝 Step 1：我的題目初稿</label>
                            <textarea
                                className="w-full border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-amber-400 transition-all min-h-[70px]"
                                placeholder="根據 Part 3 選的方向，先自己寫一個題目初稿…"
                                value={draftTitle}
                                onChange={e => setDraftTitle(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="font-bold text-slate-700 text-sm mb-2 block">🤖 Step 2：複製 Prompt 給 AI，要求它給你三個優化版本</label>
                            <div className="bg-slate-50 rounded-xl border border-slate-200 p-4">
                                <PromptBox>{generateOptimizePrompt()}</PromptBox>
                            </div>
                        </div>

                        <div>
                            <label className="font-bold text-slate-700 text-sm mb-2 block flex items-center gap-2">
                                <span className="text-amber-500">🎯</span> Step 4：我的最終版 W2 定案題目
                            </label>
                            <textarea
                                className="w-full border-2 border-amber-400 bg-amber-50 rounded-xl p-4 font-bold text-amber-900 text-sm focus:ring-2 focus:ring-amber-500 transition-all min-h-[80px]"
                                placeholder="【我的 W2 最終定案題目】：（這將是下週 W3 要健檢的題目！）"
                                value={finalTitle}
                                onChange={e => setFinalTitle(e.target.value)}
                            />
                            {finalTitle && (
                                <div className="mt-3 bg-amber-100 border border-amber-300 rounded-xl p-4 text-center">
                                    <div className="text-xs text-amber-600 font-mono mb-1 uppercase tracking-widest">// W2 定案題目</div>
                                    <p className="text-amber-900 font-black text-base">🎯 {finalTitle}</p>
                                    <p className="text-amber-600 text-xs mt-1">帶著這個題目去上 W3——它就是下週要健檢的「病人」！</p>
                                </div>
                            )}
                        </div>

                        {/* 今天的總結 */}
                        <div className="bg-slate-50 rounded-xl border border-slate-200 p-5">
                            <h3 className="font-bold text-slate-700 text-sm mb-3">📊 今天做了什麼回顧</h3>
                            <div className="grid md:grid-cols-2 gap-3">
                                <div>
                                    <p className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">👤 你做的（AI 做不到）</p>
                                    <ul className="space-y-1 text-sm text-slate-700">
                                        <li className="flex items-start gap-2"><CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" />觀察真實現象</li>
                                        <li className="flex items-start gap-2"><CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" />選擇落差方向</li>
                                        <li className="flex items-start gap-2"><CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" />選擇探究角度</li>
                                        <li className="flex items-start gap-2"><CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" />判斷題目好壞</li>
                                    </ul>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">🤖 AI 幫你做的</p>
                                    <ul className="space-y-1 text-sm text-slate-700">
                                        <li className="flex items-start gap-2"><Cpu size={14} className="text-blue-500 shrink-0 mt-0.5" />從 5 個角度看落差</li>
                                        <li className="flex items-start gap-2"><Cpu size={14} className="text-blue-500 shrink-0 mt-0.5" />生成 3 種探究方向</li>
                                        <li className="flex items-start gap-2"><Cpu size={14} className="text-blue-500 shrink-0 mt-0.5" />優化題目表達</li>
                                    </ul>
                                </div>
                            </div>
                            <div className="mt-4 text-center bg-white rounded-lg p-3 border border-slate-200">
                                <span className="font-black text-slate-700">🔑 關鍵心法：AI 給選項，但你做選擇！</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* 下週預告 */}
            <div className="bg-slate-900 rounded-3xl p-6 text-white">
                <p className="text-slate-400 text-xs font-mono tracking-widest mb-2 uppercase">// 📢 下週 W3 預告</p>
                <p className="text-white font-bold text-lg mb-1">「題目健檢與 AI 協作工作坊」</p>
                <p className="text-slate-300 text-sm mb-3">你會學到：萬用急救心法、診斷 8 種爛題目、用「5W1H」規格化、用「可行性快篩」檢查。</p>
                <div className="bg-amber-500/20 border border-amber-500/40 rounded-xl p-3">
                    <p className="text-amber-300 font-bold text-sm">⚠️ 請帶著你 Part 4 寫的「最終定案題目」來！那就是下週要健檢的病人！</p>
                </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between pt-2 pb-12">
                <Link to="/w1" className="inline-flex items-center gap-2 bg-slate-200 text-slate-700 px-5 py-3 rounded-lg font-semibold hover:bg-slate-300 transition">
                    ← 回 W1 研究啟動
                </Link>
                <Link to="/wizard" className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition shadow-md hover:shadow-lg">
                    帶著題目，前進「方法快篩」<ArrowRight size={20} />
                </Link>
            </div>
        </div>
    );
};
