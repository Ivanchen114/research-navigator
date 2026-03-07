import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PromptBox } from '../components/analysis/PromptBox';
import { PenTool, ArrowRight, Lightbulb, BrainCircuit, Cpu, CheckCircle2, ChevronDown, ChevronUp, Map } from 'lucide-react';
import LessonMap from '../components/ui/LessonMap';
import { W2Data } from '../data/lessonMaps';

// ── 三種探究句型 ──────────────────────────────────────────────
const QUESTION_TYPES = [
    {
        type: 'A', label: '影響 / 關聯型',
        template: '「A 如何影響 B？」\n「A 與 B 有什麼關聯？」',
        method: '📋 問卷  🧪 實驗',
        color: 'text-[#2d5be3]', bg: 'bg-white', border: 'border-[#dddbd5]',
        example: '「考試壓力如何影響松山高中學生的圖書館使用行為？」',
    },
    {
        type: 'B', label: '比較 / 差異型',
        template: '「A 跟 B 有什麼不同？」\n「A 在不同情境的差異？」',
        method: '📋 問卷  📚 資料分析',
        color: 'text-[#2e7d5a]', bg: 'bg-white', border: 'border-[#dddbd5]',
        example: '「加入社團的高一生與沒有加入的，學習成效有差異嗎？」',
    },
    {
        type: 'C', label: '深究 / 內涵型',
        template: '「A 背後的原因是什麼？」\n「A 是怎麼運作的？」',
        method: '🎤 訪談  👀 觀察',
        color: 'text-[#c9a84c]', bg: 'bg-white', border: 'border-[#dddbd5]',
        example: '「學生選擇圖書館座位的決策背後，有哪些影響因素？」',
    },
];

// ── 鷹架元件：可折疊 Accordion ────────────────────────────────
const SectionHeader = ({ id, title, icon, subtitle, badge, openSection, toggleSection }) => (
    <button
        onClick={() => toggleSection(id)}
        className={`w-full flex items-center justify-between px-6 py-5 text-left transition-colors border ${openSection === id
                ? 'bg-[#1a1a2e] text-white border-[#1a1a2e] rounded-t-[10px]'
                : 'bg-white text-[#1a1a2e] border-[#dddbd5] hover:bg-[#f8f7f4] rounded-[10px]'
            }`}
    >
        <div className="flex items-center gap-4">
            <span className="text-[20px]">{icon}</span>
            <div>
                <div className="flex items-center gap-3">
                    <span className="font-bold text-[16px]">{title}</span>
                    {badge && (
                        <span className={`text-[10px] px-1.5 py-[1px] rounded-[3px] font-['DM_Mono',monospace] tracking-wider uppercase ${openSection === id ? 'bg-white/10 text-white/70' : 'bg-[#2d5be3] text-white'
                            }`}>{badge}</span>
                    )}
                </div>
                {subtitle && <p className={`text-[12px] mt-1 ${openSection === id ? 'text-white/60' : 'text-[#8888aa]'}`}>{subtitle}</p>}
            </div>
        </div>
        {openSection === id ? <ChevronUp size={20} className="opacity-50" /> : <ChevronDown size={20} className="opacity-50" />}
    </button>
);

// ── 練習卡片 ────────────────────────────────────────────────
const PracticeCard = ({ label, isMain }) => {
    const [obs, setObs] = useState('');
    const [gap, setGap] = useState('');
    const [q, setQ] = useState('');
    const [theme, setTheme] = useState('');

    return (
        <div className={`rounded-[10px] border p-6 space-y-5 ${isMain ? 'border-[#c9a84c]/50 bg-[#f8f7f4]' : 'border-[#dddbd5] bg-white'}`}>
            <div className="flex items-center gap-3 mb-2">
                <span className={`text-[11px] font-['DM_Mono',monospace] font-bold px-2 py-[3px] rounded-[4px] uppercase tracking-wide ${isMain ? 'bg-[#c9a84c] text-white' : 'bg-[#1a1a2e] text-white'}`}>
                    {label}
                </span>
                {!isMain && (
                    <input
                        className="text-[12px] border border-[#dddbd5] rounded-[4px] px-3 py-1 bg-white focus:outline-none focus:border-[#2d5be3] min-w-[120px]"
                        placeholder="圖片主題"
                        value={theme}
                        onChange={e => setTheme(e.target.value)}
                    />
                )}
                {isMain && <span className="text-[12px] text-[#c9a84c] font-bold">★ 任務的核心：從觀察帶出問題</span>}
            </div>

            <div className="space-y-2">
                <label className="text-[12px] font-bold text-[#4a4a6a] flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2d5be3]"></span>
                    1. 覺察現象 (Observation)
                </label>
                <textarea
                    className="w-full text-[13px] border border-[#dddbd5] rounded-[6px] p-3 focus:outline-none focus:border-[#2d5be3] min-h-[70px] bg-white placeholder:text-[#8888aa]/50"
                    placeholder="像攝影機一樣描述，看見了什麼畫面？"
                    value={obs}
                    onChange={e => setObs(e.target.value)}
                />
            </div>

            <div className="space-y-2">
                <label className="text-[12px] font-bold text-[#4a4a6a] flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#c9a84c]"></span>
                    2. 發現落差 (Gap)
                </label>
                <textarea
                    className="w-full text-[13px] border border-[#dddbd5] rounded-[6px] p-3 focus:outline-none focus:border-[#c9a84c] min-h-[70px] bg-white placeholder:text-[#8888aa]/50"
                    placeholder="哪裡讓你覺得奇怪或矛盾？有沒有跟你想的不一樣？"
                    value={gap}
                    onChange={e => setGap(e.target.value)}
                />
            </div>

            <div className="space-y-2">
                <label className="text-[12px] font-bold text-[#4a4a6a] flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2e7d5a]"></span>
                    3. 鎖定核心疑問 (Core Question)
                </label>
                <textarea
                    className={`w-full text-[13px] border rounded-[6px] p-3 focus:outline-none min-h-[70px] font-medium placeholder:text-[#8888aa]/50 ${isMain ? 'border-[#c9a84c] bg-white focus:border-[#c9a84c] text-[#1a1a2e]' : 'border-[#dddbd5] bg-white focus:border-[#2e7d5a] text-[#1a1a2e]'}`}
                    placeholder="用最白話的方式，問出你最感興趣的那件事..."
                    value={q}
                    onChange={e => setQ(e.target.value)}
                />
                {isMain && q && (
                    <div className="bg-[#f0ede6] border-l-4 border-[#c9a84c] p-4 text-center mt-3 animate-in fade-in slide-in-from-top-1">
                        <p className="text-[#c9a84c] text-[11px] font-bold mb-1 uppercase tracking-widest font-['DM_Mono',monospace]">Current Question</p>
                        <p className="text-[#1a1a2e] font-bold italic text-[15px]">「{q}」</p>
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

    // Section open
    const [openSection, setOpenSection] = useState('part1');
    const toggleSection = (id) => setOpenSection(prev => prev === id ? null : id);
    const [showLessonMap, setShowLessonMap] = useState(false);

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

    const props = { openSection, toggleSection };

    return (
        <div className="max-w-[900px] mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 font-['Noto_Sans_TC',sans-serif] text-[14px] leading-[1.6] text-[#1a1a2e]">

            {/* ===== Lesson Map Toggle (Teacher Only) ===== */}
            <div className="flex justify-end pt-2 pb-0 -mb-8 relative z-20">
                <button
                    onClick={() => setShowLessonMap(!showLessonMap)}
                    className="flex items-center gap-1.5 text-[11px] text-[#8888aa] hover:text-[#2d5be3] transition-colors opacity-60 hover:opacity-100 font-['DM_Mono',monospace]"
                    title="教師專用：顯示課程地圖"
                >
                    <Map size={12} />
                    {showLessonMap ? 'Hide Map' : 'Instructor View'}
                </button>
            </div>

            {showLessonMap && (
                <div className="mb-4 animate-in slide-in-from-top-4 duration-300">
                    <LessonMap data={W2Data} />
                </div>
            )}

            {/* Header */}
            <header className="mb-14 pt-8">
                <div className="text-[11px] font-['DM_Mono',monospace] tracking-[0.12em] uppercase text-[#2d5be3] mb-3 flex items-center gap-2">
                    <PenTool size={14} /> W2 問題意識
                </div>
                <h1 className="font-['Noto_Serif_TC',serif] text-[38px] font-bold leading-[1.25] text-[#1a1a2e] mb-4 tracking-[-0.02em]">
                    把觀察，<br className="hidden md:block" />
                    <span className="text-[#2d5be3] font-normal italic">變成問題</span>
                </h1>
                <p className="text-[15px] text-[#4a4a6a] leading-[1.75] max-w-[560px]">
                    今天練的叫做「<strong>品味</strong>」——從平凡畫面看見不平凡。用四段式思考，搭配三次 AI 協作，磨練你的探究直覺。
                </p>
            </header>

            {/* ── Part 1：四格框架 ─────────────── */}
            <section className="space-y-4">
                <SectionHeader id="part1" title="Part 1｜認識四段式思考框架" icon="🛑" subtitle="研究不是問為什麼，而是有層次地轉化好奇心。" {...props} />
                {openSection === 'part1' && (
                    <div className="bg-white p-8 space-y-8 border-x border-b border-[#dddbd5] rounded-b-[10px] animate-in slide-in-from-top-2 duration-300">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-[#f8f7f4] rounded-[10px] border border-[#dddbd5] p-6">
                                <div className="text-[#e32d5b] font-bold text-[13px] mb-3 uppercase tracking-wider font-['DM_Mono',monospace]">❌ Don't ask Broadly</div>
                                <h3 className="font-bold text-[15px] mb-2 text-[#1a1a2e]">「為什麼」是個爛問題</h3>
                                <p className="text-[#4a4a6a] text-[13px] leading-relaxed">
                                    「為什麼大家喜歡用手機？」這種問題太發散，沒有切入點。
                                </p>
                            </div>
                            <div className="bg-[#1a1a2e] rounded-[10px] border border-[#1a1a2e] p-6 text-white">
                                <div className="text-[#2d5be3] font-bold text-[13px] mb-3 uppercase tracking-wider font-['DM_Mono',monospace]">✅ Think in Steps</div>
                                <h3 className="font-bold text-[15px] mb-2">四段式思考法</h3>
                                <p className="text-white/70 text-[13px] leading-relaxed">
                                    現象 → 落差 → 核心疑問 → 探究意圖。這就是把直覺變成學術的過程。
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-[1px] bg-[#dddbd5] border border-[#dddbd5] rounded-[10px] overflow-hidden">
                            {[
                                { step: '1', title: '覺察現象 (Observation)', color: 'bg-[#2d5be3]', desc: '像攝影機一樣，客觀描述看見的畫面，不加評論。', example: '「段考前圖書館閱覽室總是爆滿。」' },
                                { step: '2', title: '發現落差 (Gap)', color: 'bg-[#c9a84c]', desc: '哪裡讓你覺得矛盾？哪裡跟你預期的不一樣？', example: '「但借書區卻沒人，且考完後閱覽室立刻變空了。」' },
                                { step: '3', title: '核心疑問 (Core Question)', color: 'bg-[#1a1a2e]', desc: '從矛盾中，你最想搞清楚的那一件事是什麼？（白話文）', example: '「為什麼考前大家湧入圖書館？他們是為了唸書還是氛圍？」' },
                                { step: '4', title: '探究意圖 (Intent)', color: 'bg-[#2e7d5a]', desc: '把白話疑問，套上學術界通用的三種探究句型。', example: '「探究『考試壓力』與『圖書館空間功能定義』的關聯。」' },
                            ].map(item => (
                                <div key={item.step} className="bg-white p-6 flex gap-6 hover:bg-[#f8f7f4] transition-colors group">
                                    <div className={`${item.color} text-white w-8 h-8 rounded-md flex items-center justify-center font-bold text-[14px] shrink-0 font-['DM_Mono',monospace]`}>{item.step}</div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-1">
                                            <span className="font-bold text-[#1a1a2e] text-[15px]">{item.title}</span>
                                        </div>
                                        <p className="text-[#4a4a6a] text-[13px] leading-relaxed mb-2">{item.desc}</p>
                                        <div className="text-[11px] text-[#8888aa] italic bg-[#f0ede6]/50 px-3 py-1.5 rounded inline-block">
                                            📍 範例 / {item.example}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </section>

            {/* ── Part 2：練習 ─────────────── */}
            <section className="space-y-4">
                <SectionHeader id="part2" title="Part 2｜循環練習：從觀察到核心疑問" icon="🖼️" subtitle="第一節課人類主場，禁用 AI，禁用「為什麼」開頭。" {...props} />
                {openSection === 'part2' && (
                    <div className="bg-white p-8 space-y-10 border-x border-b border-[#dddbd5] rounded-b-[10px] animate-in slide-in-from-top-2 duration-300">
                        <PracticeCard label="練習一" isMain={false} />
                        <PracticeCard label="練習二" isMain={false} />
                        <div className="pt-4">
                            <PracticeCard label="🔥 任務：我的正式觀察" isMain={true} />
                        </div>
                    </div>
                )}
            </section>

            {/* ── Part 2.5：AI 協作 1 ─────── */}
            <section className="space-y-4">
                <SectionHeader id="part25" title="Part 2.5｜🤖 AI 協作 1 — 落差擴充器" icon="🤖" subtitle="讓 AI 幫你從 5 個不同的角度挖掘現象背後的矛盾。" badge="AI-RED Phase 1" {...props} />
                {openSection === 'part25' && (
                    <div className="bg-white p-8 space-y-8 border-x border-b border-[#dddbd5] rounded-b-[10px] animate-in slide-in-from-top-2 duration-300">
                        <div className="bg-[#f0f4ff] border-l-4 border-[#2d5be3] p-5">
                            <p className="text-[#1a3db0] text-[13px] leading-relaxed font-medium">
                                <strong>AI 的角色：</strong>AI 沒去過現場，它不能幫你「觀察」。但它很擅長「分類與聯想」，可以幫你找出人類容易忽略的邏輯矛盾。
                            </p>
                        </div>

                        <div className="space-y-2">
                            <label className="font-bold text-[#1a1a2e] text-[14px]">Step 1 / 把觀察的內容貼過來</label>
                            <textarea
                                className="w-full border border-[#dddbd5] rounded-[6px] p-4 text-[13px] focus:outline-none focus:border-[#2d5be3] min-h-[80px]"
                                placeholder="把上面「練習 0」步驟 1 寫的內容貼在這裡..."
                                value={observation25}
                                onChange={e => setObservation25(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="font-bold text-[#1a1a2e] text-[14px] mb-3 block">Step 2 / 複製這個指令給 AI</label>
                            <div className="bg-[#f0ede6] p-5 rounded-[8px] border border-[#dddbd5]">
                                <PromptBox variant="paper">{buildGapPrompt()}</PromptBox>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-[#f0ede6]">
                            <label className="font-bold text-[#1a1a2e] text-[14px] mb-2 block">Step 3 / 你的決策 (Decision)</label>
                            <p className="text-[#8888aa] text-[12px] mb-4">看完 AI 的建議後，選出一個你覺得「最有研究潛力」的落差點。</p>
                            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
                                {[1, 2, 3, 4, 5].map(n => (
                                    <button
                                        key={n}
                                        onClick={() => setSelectedGap(n)}
                                        className={`py-2 px-3 rounded-md border text-[12px] font-bold transition-all ${selectedGap === n ? 'bg-[#1a1a2e] border-[#1a1a2e] text-white' : 'bg-white border-[#dddbd5] text-[#4a4a6a] hover:border-[#1a1a2e]'}`}
                                    >
                                        選 {n} 號
                                    </button>
                                ))}
                                <button
                                    onClick={() => setSelectedGap('original')}
                                    className={`col-span-2 sm:col-span-5 py-2 px-3 rounded-md border text-[12px] font-bold transition-all ${selectedGap === 'original' ? 'bg-[#1a1a2e] border-[#1a1a2e] text-white' : 'bg-white border-[#dddbd5] text-[#4a4a6a] hover:border-[#1a1a2e]'}`}
                                >
                                    都不選，我用自己原本寫的
                                </button>
                            </div>
                            {selectedGap && (
                                <div className="space-y-2 animate-in fade-in duration-300">
                                    <label className="text-[13px] font-bold text-[#1a1a2e]">最終決定的「落差」敘述：</label>
                                    <textarea
                                        className="w-full border border-[#2d5be3] bg-[#f8f7f4] rounded-[6px] p-4 text-[13px] text-[#1a1a2e] font-medium min-h-[64px]"
                                        placeholder="整理成一句更精確的落差句..."
                                        value={finalGap}
                                        onChange={e => setFinalGap(e.target.value)}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </section>

            {/* ── Part 3：AI 協作 2 ────── */}
            <section className="space-y-4">
                <SectionHeader id="part3" title="Part 3｜🤖 AI 協作 2 — 探究意圖生成器" icon="🤖" subtitle="將你的白話核心疑問，翻譯成三種學術研究方向。" badge="AI-RED Phase 2" {...props} />
                {openSection === 'part3' && (
                    <div className="bg-white p-8 space-y-8 border-x border-b border-[#dddbd5] rounded-b-[10px] animate-in slide-in-from-top-2 duration-300">
                        {/* 三種句型參考區 */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-[1px] bg-[#dddbd5] border border-[#dddbd5] rounded-[10px] overflow-hidden">
                            {QUESTION_TYPES.map(qt => (
                                <div
                                    key={qt.type}
                                    onClick={() => setShowTypeDetail(showTypeDetail === qt.type ? null : qt.type)}
                                    className={`p-6 cursor-pointer bg-white transition-colors hover:bg-[#f8f7f4] ${showTypeDetail === qt.type ? 'bg-[#f8f7f4]' : ''}`}
                                >
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className={`text-[10px] font-bold px-1.5 py-[2px] rounded-sm bg-[#1a1a2e] text-white font-['DM_Mono',monospace]`}>{qt.type}</span>
                                        <h4 className="font-bold text-[14px] text-[#1a1a2e]">{qt.label}</h4>
                                    </div>
                                    <div className="text-[11px] text-[#8888aa] font-mono mb-2 uppercase tracking-wider">{qt.method}</div>
                                    {showTypeDetail === qt.type && (
                                        <div className="mt-4 pt-4 border-t border-[#dddbd5] animate-in fade-in">
                                            <p className={`text-[13px] font-mono ${qt.color} leading-relaxed mb-3 whitespace-pre-line`}>{qt.template}</p>
                                            <p className="text-[#8888aa] text-[11px] italic">例 / {qt.example}</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="space-y-6">
                            <div className="bg-[#f0ede6] p-6 rounded-[10px] border border-dashed border-[#c9a84c]">
                                <label className="font-bold text-[#1a1a2e] text-[14px] block mb-3">★ 把你的白話核心疑問填進去</label>
                                <textarea
                                    className="w-full border border-[#c9a84c]/30 rounded-[6px] p-4 text-[13px] focus:outline-none focus:border-[#c9a84c] min-h-[60px]"
                                    placeholder="例如：為什麼考前閱覽室爆滿但借書的人變少？"
                                    value={coreQ}
                                    onChange={e => setCoreQ(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="font-bold text-[#1a1a2e] text-[14px] mb-3 block">Step 2 / 複製 Prompt 給 AI 進行翻譯</label>
                                <div className="bg-[#f8f7f4] p-5 rounded-[8px] border border-[#dddbd5]">
                                    <PromptBox variant="paper">{buildIntentPrompt()}</PromptBox>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-[#f0ede6]">
                                <label className="font-bold text-[#1a1a2e] text-[14px] mb-4 block">Step 3 / 最終採用的研究意圖 (Intent)</label>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                                    {['我原本寫的', 'AI 的 A 型', 'AI 的 B 型', 'AI 的 C 型'].map(opt => (
                                        <button
                                            key={opt}
                                            onClick={() => setSelectedType(opt)}
                                            className={`py-2 px-3 rounded-md border text-[12px] font-bold transition-all ${selectedType === opt ? 'bg-[#1a1a2e] border-[#1a1a2e] text-white' : 'bg-white border-[#dddbd5] text-[#4a4a6a] hover:border-[#13a1a2e]'}`}
                                        >
                                            {opt}
                                        </button>
                                    ))}
                                </div>

                                {selectedType && (
                                    <div className="bg-[#f8f7f4] border border-[#dddbd5] rounded-[10px] p-6 animate-in fade-in">
                                        <p className="font-bold text-[13px] mb-4 text-[#2d5be3]">你的決策理由（打勾確認）：</p>
                                        <div className="grid sm:grid-cols-2 gap-3">
                                            {['我真的對此好奇', '學校資源做得到', '對象好收集', '方法好執行'].map(r => (
                                                <label key={r} className="flex items-center gap-3 cursor-pointer group">
                                                    <input type="checkbox" className="w-4 h-4 border-[#dddbd5] rounded text-[#2d5be3] focus:ring-transparent" />
                                                    <span className="text-[13px] text-[#4a4a6a] group-hover:text-[#1a1a2e]">{r}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </section>

            {/* ── 回顧卡 ─────────────────────────── */}
            <section className="border border-[#dddbd5] rounded-[10px] overflow-hidden bg-white">
                <div className="p-6 border-b border-[#dddbd5] bg-[#f8f7f4]">
                    <h3 className="font-bold text-[15px] text-[#1a1a2e] flex items-center gap-2">
                        <CheckCircle2 size={18} className="text-[#2e7d5a]" /> 研究者的品味
                    </h3>
                </div>
                <div className="p-8 grid md:grid-cols-2 gap-10">
                    <div>
                        <h4 className="text-[11px] font-['DM_Mono',monospace] font-bold text-[#8888aa] uppercase tracking-widest mb-4">You did (Human Skill)</h4>
                        <ul className="space-y-4">
                            {['現場覺察現象', '鎖定好奇的核心點', '決定落差的視角', '最後的選題方向'].map(i => (
                                <li key={i} className="flex items-center gap-3 text-[13px] text-[#4a4a6a]">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#1a1a2e]"></div> {i}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-[11px] font-['DM_Mono',monospace] font-bold text-[#8888aa] uppercase tracking-widest mb-4">AI did (Tool Skill)</h4>
                        <ul className="space-y-4">
                            {['提供多維度的觀察死角', '將白話翻譯成學術格式', '建議合適的研究方法'].map(i => (
                                <li key={i} className="flex items-center gap-3 text-[13px] text-[#4a4a6a]">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#2d5be3]"></div> {i}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className="mx-8 mb-8 p-4 bg-[#1a1a2e] text-white text-center rounded-[6px] font-bold text-[14px]">
                    🗝️ 核心關鍵：AI 給予選項，而「你」負責決定方向。
                </div>
            </section>

            {/* 下週預告 */}
            <div className="bg-[#1a1a2e] rounded-[10px] p-8 text-white relative">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <BrainCircuit size={80} />
                </div>
                <p className="text-white/30 text-[10px] font-['DM_Mono',monospace] tracking-widest mb-4 uppercase">// Next Week</p>
                <h3 className="text-[20px] font-bold mb-2 font-['Noto_Serif_TC',serif]">W3 題目健檢與 AI 協作工作坊</h3>
                <p className="text-white/70 text-[13px] leading-relaxed mb-6 max-w-[600px]">
                    要把好不容易磨出來的「探究意圖」變成正式的「研究題目」。我們下週要進行一場大健檢！
                </p>
                <div className="inline-flex items-center gap-3 bg-[#c9a84c] text-[#1a1a2e] font-bold text-[12px] px-4 py-2 rounded-sm shadow-lg">
                    ⚠️ 請務必記住你今天的「最終探究意圖」！
                </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center py-12 border-t border-[#dddbd5]">
                <Link to="/w1" className="text-[13px] font-bold text-[#8888aa] hover:text-[#1a1a2e] flex items-center gap-2 transition-colors">
                    ← 回 W1 AI-RED 公約
                </Link>
                <Link to="/wizard" className="bg-[#1a1a2e] text-white px-8 py-3 rounded-[6px] text-[14px] font-bold hover:bg-[#2a2a4a] transition-all flex items-center gap-2">
                    帶著題目，前進「方法快篩」 <ArrowRight size={18} />
                </Link>
            </div>

        </div>
    );
};
