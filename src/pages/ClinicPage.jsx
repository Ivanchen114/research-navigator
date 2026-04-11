import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './ClinicPage.css';
import CourseArc from '../components/ui/CourseArc';
import {
    Stethoscope,
    ArrowRight,
    Lightbulb,
    CheckCircle2,
    Map,
    ClipboardList,
    Mic,
    TestTube2,
    Eye,
    BookOpen,
    ChevronRight,
    Activity,
    ChevronDown,
    ChevronUp,
    Trophy,
    RefreshCw,
    Target
} from 'lucide-react';
import LessonMap from '../components/ui/LessonMap';
import { W6Data } from '../data/lessonMaps';

// ─── 資料 ────────────────────────────────────────────────────────────

const METHODS = [
    {
        icon: '📋', name: '問卷調查法', id: 'survey', color: '#2d5be3', bg: '#e8eeff',
        purpose: '了解大量樣本的分布、比例、趨勢，或收集大量人的態度數據。',
        strength: '效率高，可量化，可比較不同群體的差異。',
        weakness: '深度不足。就算有開放題，答案通常很淺，難以深挖原因。',
        when: '「有多少人」「什麼比例」「哪個年級比較___」「滿意度差異」',
        note: '如果核心問題是「為什麼」，問卷只能得到表面答案，訪談才能挖到深層原因。'
    },
    {
        icon: '🎤', name: '訪談法', id: 'interview', color: '#7c3aed', bg: '#f3f0ff',
        purpose: '深入理解個人的想法、經驗、動機與背後脈絡。',
        strength: '可以彈性追問，挖掘預期外的答案，適合複雜或敏感的問題。',
        weakness: '樣本少，耗時，難量化，受訪者可能不說真話。',
        when: '「為什麼這樣做」「背後的故事是什麼」「怎麼想的」「經歷過什麼」',
        note: '訪談不是「隨便聊聊」，需要事先設計好訪談大綱，問題要有層次。'
    },
    {
        icon: '🧪', name: '實驗法', id: 'experiment', color: '#d97706', bg: '#fef3c7',
        purpose: '在你能主動操控某個條件（自變項）的前提下，測量另一個結果（依變項）是否改變，以提供因果關係的強力證據。',
        strength: '控制變因後，是最強的因果推論設計——但要注意，這是「強力證據」，不是哲學意義上的「證明」。',
        weakness: '需要控制組、操弄變項，高中生執行困難（倫理、時間、場地限制）。',
        when: '「如果我讓A組___、B組不___，結果會不一樣嗎？」——你能設計這種對照的題目。',
        note: '大多數高中研究題目不適合實驗法，不需要硬套。無法操控自變項的題目，請選其他方法。'
    },
    {
        icon: '👀', name: '觀察法', id: 'observation', color: '#059669', bg: '#d1fae5',
        purpose: '記錄真實發生的行為，不依賴受試者自我報告。',
        strength: '結果比較客觀，不會因為「人說的跟實際做的不一樣」而失真。',
        weakness: '只能看到外在行為，看不到內心想法。另外，如果受試者知道自己被觀察，行為可能會變得不自然。',
        when: '「真實行為是什麼（不是人們說自己做了什麼）」「頻率、時間、空間分布」',
        note: '觀察法需要設計觀察表（記什麼、怎麼記、記多久），不是「隨便去看看」。'
    },
    {
        icon: '📚', name: '文獻分析法', id: 'literature', color: '#6b21a8', bg: '#f5f3ff',
        purpose: '系統性地閱讀、整理或分析已存在的文字資料（不是自己去收集一手資料）。',
        strength: '三種常見用途：①文獻回顧：整理前人研究。②歷史文獻分析：從史料推論原因（可以回答「為什麼發生」）。③內容分析：統計文本中詞彙/主題的頻率。',
        weakness: '文獻法不是「查資料」，是以「現有文本」為研究對象，有系統地分析。',
        when: '你的研究材料是論文、史料、報導、書籍等「別人已產生的文本」。',
        note: '文獻法可以回答「為什麼」（歷史分析），也可以回答「有多少」（內容分析），不被單一邏輯限制。'
    },
];

const TWO_LAYER = {
    layer1: {
        question: '第一層　你的資料，要自己去收集，還是分析已存在的文本？',
        options: [
            { label: '要自己收集（去問人、去觀察、去做實驗）', arrow: '→ 進入第二層判斷', highlight: true },
            { label: '分析已有文本（論文、史料、報導、書籍…）', arrow: '→ 📚 文獻法（再決定是哪種用途）', highlight: false },
        ]
    },
    layer2: {
        question: '第二層　自己收集的資料，你要問的是什麼？',
        items: [
            { id: '❶', q: '我要的是「比例、數量、趨勢」，還是「原因、脈絡、故事」？', a: ['比例趨勢 → 📋 問卷', '原因脈絡 → 🎤 訪談'] },
            { id: '❷', q: '你能不能主動改變其中一個條件，然後量另一個怎麼變？', a: ['能操控 → 🧪 實驗', '不能操控 → 其他方法（問卷、觀察等）'] },
            { id: '❸', q: '我要「記錄真實行為」，還是「了解想法態度」？', a: ['真實行為 → 👀 觀察', '想法態度 → 📋 問卷 / 🎤 訪談'] },
        ],
        note: '一個題目可以有主方法 + 輔助方法。三個問題不必全部都答，用最貼近你研究目的的那個。'
    }
};

const QUIZ_QUESTIONS = [
    {
        q: '「我想知道全校高一同學每天平均使用手機幾小時」→ 適合哪種方法？',
        options: ['訪談', '問卷', '實驗', '觀察'],
        answer: 1,
        hint: '要的是「多少人、幾小時」→ 比例趨勢 → 問卷'
    },
    {
        q: '「我想了解為什麼同學在課堂上容易分心」→ 適合哪種方法？',
        options: ['問卷', '文獻', '訪談', '實驗'],
        answer: 2,
        hint: '要的是「為什麼」→ 原因脈絡 → 訪談'
    },
    {
        q: '「我想知道播放古典音樂是否能提升短期記憶力」→ 適合哪種方法？',
        options: ['問卷', '觀察', '文獻', '實驗'],
        answer: 3,
        hint: '能操控自變項（音樂）→ 實驗法'
    },
    {
        q: '「我想記錄圖書館午休時，同學實際起身走動的次數與時機」→ 適合哪種方法？',
        options: ['問卷', '觀察', '訪談', '文獻'],
        answer: 1,
        hint: '要記錄「真實行為」，不靠自我報告 → 觀察法'
    },
    {
        q: '「我想整理過去十年台灣高中生課業壓力研究的主要發現」→ 適合哪種方法？',
        options: ['實驗', '問卷', '文獻', '觀察'],
        answer: 2,
        hint: '分析已存在的研究文本 → 第一層直接導向文獻法（文獻回顧）'
    },
    {
        q: '下列哪個題目「最不適合」用問卷？',
        options: ['全校有幾成同學每天超過10點睡覺？', '同學覺得最難的科目是哪個？', '為什麼有些同學晚上睡不著？', '多少人曾因壓力影響睡眠？'],
        answer: 2,
        hint: '「為什麼睡不著」要挖深層原因，問卷只能得到表面，應用訪談'
    },
    {
        q: '「從日治時期史料分析台灣土地政策為何引發農民抗爭」→ 適合哪種方法？',
        options: ['問卷', '實驗', '觀察', '文獻'],
        answer: 3,
        hint: '資料是已有史料 → 文獻法；回答「為什麼」是歷史文獻分析用途'
    },
    {
        q: '一份研究同時想知道「使用頻率」和「使用的心理動機」，最適合？',
        options: ['只用問卷', '只用訪談', '問卷（主）+ 訪談（輔）', '實驗 + 觀察'],
        answer: 2,
        hint: '頻率 → 問卷；動機 → 訪談；兩者互補最適合'
    },
    {
        q: '「分析近五年台灣各大報對 AI 教育新聞的報導角度與用詞趨勢」→ 適合？',
        options: ['問卷', '觀察', '文獻', '實驗'],
        answer: 2,
        hint: '分析已有媒體文本中詞彙/主題的模式 → 文獻法（內容分析）'
    },
    {
        q: '以下哪個研究問題需要「觀察法」而非問卷？',
        options: ['你覺得下課時間夠嗎？', '課堂上同學實際起身走動的次數', '你最喜歡的休閒活動？', '你認為學校環境對學習有幫助嗎？'],
        answer: 1,
        hint: '「走動次數」是直接觀察的行為，問卷靠自我報告，容易不準確'
    },
];

// ─── 主元件 ──────────────────────────────────────────────────────────

export const ClinicPage = () => {
    const [showLessonMap, setShowLessonMap] = useState(false);
    const [expandedMethod, setExpandedMethod] = useState(null);

    // Quiz state
    const [quizStarted, setQuizStarted] = useState(false);
    const [currentQ, setCurrentQ] = useState(0);
    const [selections, setSelections] = useState({});
    const [quizDone, setQuizDone] = useState(false);

    const handleSelect = (optIdx) => {
        if (selections[currentQ] !== undefined) return;
        const newSelections = { ...selections, [currentQ]: optIdx };
        setSelections(newSelections);
        if (currentQ < QUIZ_QUESTIONS.length - 1) {
            setTimeout(() => setCurrentQ(prev => prev + 1), 900);
        } else {
            setTimeout(() => setQuizDone(true), 900);
        }
    };

    const resetQuiz = () => {
        setCurrentQ(0);
        setSelections({});
        setQuizDone(false);
        setQuizStarted(true);
    };

    const score = Object.entries(selections).filter(([i, v]) => v === QUIZ_QUESTIONS[i].answer).length;

    return (
        <div className="page-container animate-in-fade-slide">

            {/* TOP BAR */}
            <div className="flex items-center justify-between border-b border-[#dddbd5] pb-4 mb-16">
                <div className="text-[11px] font-mono text-[#8888aa] flex items-center gap-2">
                    研究方法與專題 / 研究規劃 / <span className="text-[#1a1a2e] font-bold">研究診所 W7</span>
                </div>
                <div className="flex items-center gap-4">
                    <span className="bg-[#f0ede6] text-[#1a1a2e] text-[10px] font-bold px-2 py-0.5 rounded-[2px] font-mono">50 MINS</span>
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
                <div className="animate-in slide-in-from-top-4 duration-300">
                    <LessonMap data={W6Data} />
                </div>
            )}

            {/* PAGE HEADER */}
            <header className="max-w-[800px] mb-16">
                <div className="text-[11px] font-mono text-[#2d5be3] mb-3 tracking-[0.06em]">🩺 W7 · 研究規劃</div>
                <h1 className="font-serif text-[36px] font-bold leading-[1.2] text-[#1a1a2e] mb-4 tracking-[-0.02em]">
                    研究診所：<span className="text-[#2d5be3] italic">從掛號到判斷</span>
                </h1>
                <p className="text-[15px] text-[#4a4a6a] max-w-[600px] leading-[1.75] mb-8">
                    你的題目適合用什麼方法？今天先認識五種方法，再用兩層判斷架構找出答案，最後用 AI 測驗驗收——結束前你要能說出：我的題目適合用___法，因為___。
                </p>

                <CourseArc items={[
                    { wk: 'W1-W2', name: '探索階段\nRED公約', status: 'past' },
                    { wk: 'W3-W4', name: '題目診斷\n博覽會', status: 'past' },
                    { wk: 'W5', name: '文獻搜尋\n入門', status: 'past' },
                    { wk: 'W6', name: '文獻偵探\n引用寫作', status: 'past' },
                    { wk: 'W7', name: '認識方法\n兩層判斷', status: 'now' },
                    { wk: 'W8', name: '組隊決策\n企劃定案' },
                    { wk: 'W8-W10', name: '工具設計\n倫理審查' },
                    { wk: 'W13-W16', name: '數據轉譯\n解讀發表' }
                ]} />

                <div className="meta-grid">
                    {[
                        { label: '課堂節奏', value: '講義導覽 → AI 測驗 → 判斷自己的題目' },
                        { label: '課堂產出', value: '為自己的 W4 題目選定研究方法並說明理由' },
                        { label: '帶去 W8', value: '確定題目 + 研究方法 + 準備組隊' },
                    ].map((item, idx) => (
                        <div key={idx} className="meta-item">
                            <div className="meta-label">{item.label}</div>
                            <div className="meta-value">{item.value}</div>
                        </div>
                    ))}
                </div>

                {/* 本週簡報 */}
                <div className="flex justify-end mt-8 mb-2">
                    <a
                        href="https://canva.link/y2kbukwzlntkci4"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold tracking-wider text-[#8888aa] hover:text-[#1a1a2e] bg-[#f8f7f4] hover:bg-[#f0ede6] border border-[#dddbd5] hover:border-[#1a1a2e]/20 px-3 py-1.5 rounded-[5px] transition-all"
                    >
                        📊 本週簡報 ↗
                    </a>
                </div>
            </header>

            {/* ── PART 1: 學什麼 ──────────────────────────────── */}
            <section className="mb-16">
                <div className="w6-section-head">
                    <h2>學什麼</h2>
                    <div className="line"></div>
                    <span className="mono">CONCEPT</span>
                </div>
                <p className="clinic-section-desc">認識五種研究方法的目的與限制，再用「兩層判斷架構」決定你的題目該用哪種。</p>

                {/* 五種方法卡 */}
                <div className="space-y-3 mb-10">
                    {METHODS.map((m) => {
                        const isOpen = expandedMethod === m.id;
                        return (
                            <div key={m.id} className="border border-[#dddbd5] rounded-[8px] overflow-hidden bg-white">
                                <button
                                    onClick={() => setExpandedMethod(isOpen ? null : m.id)}
                                    className="w-full flex items-center gap-4 px-5 py-4 hover:bg-[#fafaf8] transition-colors text-left"
                                >
                                    <span className="text-[22px] shrink-0">{m.icon}</span>
                                    <div className="flex-1 min-w-0">
                                        <span className="font-bold text-[14px] text-[#1a1a2e]">{m.name}</span>
                                        <span className="text-[12px] text-[#8888aa] ml-3">{m.purpose.slice(0, 40)}…</span>
                                    </div>
                                    {isOpen
                                        ? <ChevronUp size={16} className="text-[#8888aa] shrink-0" />
                                        : <ChevronDown size={16} className="text-[#8888aa] shrink-0" />
                                    }
                                </button>

                                {isOpen && (
                                    <div className="px-5 pb-5 border-t border-[#f0ede6] animate-in slide-in-from-top-2 duration-150">
                                        <div className="grid md:grid-cols-2 gap-x-8 gap-y-3 mt-4 text-[13px]">
                                            {[
                                                { label: '目的', val: m.purpose },
                                                { label: '強項', val: m.strength },
                                                { label: '弱點', val: m.weakness },
                                                { label: '適用情境', val: m.when },
                                            ].map(({ label, val }) => (
                                                <div key={label}>
                                                    <div className="text-[10px] font-mono font-bold uppercase tracking-wider mb-1"
                                                        style={{ color: m.color }}>{label}</div>
                                                    <p className="text-[#4a4a6a] leading-relaxed">{val}</p>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="mt-4 px-4 py-3 rounded-[6px] text-[12px] text-[#4a4a6a] flex gap-2"
                                            style={{ background: m.bg }}>
                                            <span className="text-[14px] shrink-0">⚠️</span>
                                            <span>{m.note}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* 兩層判斷架構 */}
                <div className="w6-speed-card">
                    <div className="w6-speed-header">
                        <Activity size={18} /> 🔑 兩層判斷架構
                    </div>
                    <div className="w6-speed-body">
                        {/* 第一層 */}
                        <div className="w6-speed-q">
                            <div className="w6-speed-q-num text-[#1a1a2e]">L1</div>
                            <div className="flex-1">
                                <div className="w6-speed-q-text font-bold">{TWO_LAYER.layer1.question}</div>
                                <div className="flex flex-col gap-2 mt-3">
                                    {TWO_LAYER.layer1.options.map((opt, i) => (
                                        <div key={i} className="flex items-start gap-2 text-[12px] text-[#4a4a6a]">
                                            <span className="text-[#8888aa] shrink-0">→</span>
                                            <span>{opt.label}</span>
                                            <span className="w6-method-tag whitespace-nowrap shrink-0">{opt.arrow}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* 分隔 */}
                        <div className="border-t border-[#f0ede6] my-1" />

                        {/* 第二層 */}
                        <div className="w6-speed-q items-start">
                            <div className="w6-speed-q-num text-[#2d5be3]">L2</div>
                            <div className="flex-1">
                                <div className="w6-speed-q-text font-bold mb-3">{TWO_LAYER.layer2.question}</div>
                                {TWO_LAYER.layer2.items.map((item) => (
                                    <div key={item.id} className="mb-3">
                                        <div className="text-[12px] font-bold text-[#1a1a2e] mb-1.5">
                                            {item.id} {item.q}
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {item.a.map((ans, i) => {
                                                const [label, method] = ans.split(' → ');
                                                return (
                                                    <div key={i} className="flex items-center gap-1.5 text-[11px] text-[#4a4a6a]">
                                                        {label} → <span className="w6-method-tag whitespace-nowrap">{method}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                                <div className="text-[11px] text-[#8888aa] pt-2 border-t border-[#f0ede6] mt-2">
                                    💡 {TWO_LAYER.layer2.note}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── PART 2: AI 測驗 ─────────────────────────────── */}
            <section className="mb-16">
                <div className="w6-section-head">
                    <h2>酷 AI 測驗</h2>
                    <div className="line"></div>
                    <span className="mono">QUIZ · 10 Qs</span>
                </div>
                <p className="clinic-section-desc">10 題選擇題，驗收你對兩層判斷架構的理解。做完之後注意自己錯在哪幾題。</p>

                {!quizStarted ? (
                    <div className="bg-[#1a1a2e] rounded-[12px] p-8 text-center text-white">
                        <div className="text-[40px] mb-4">🎯</div>
                        <h3 className="text-[18px] font-bold mb-2">分科判斷測驗</h3>
                        <p className="text-[#8888aa] text-[13px] mb-6">10 題 · 每題選一個答案 · 選完自動跳下題</p>
                        <button
                            onClick={() => setQuizStarted(true)}
                            className="bg-[#2d5be3] hover:bg-[#1d4bd3] text-white font-bold px-8 py-3 rounded-[8px] transition-colors text-[14px] flex items-center gap-2 mx-auto"
                        >
                            開始測驗 <ArrowRight size={16} />
                        </button>
                    </div>
                ) : quizDone ? (
                    /* 結果頁 */
                    <div className="bg-white border border-[#dddbd5] rounded-[12px] overflow-hidden">
                        <div className="bg-[#1a1a2e] p-6 text-center text-white">
                            <Trophy className="mx-auto mb-3 text-[#f59e0b]" size={36} />
                            <div className="text-[32px] font-black mb-1">{score} / 10</div>
                            <div className="text-[#8888aa] text-[13px]">
                                {score === 10 ? '完美！全對通關 🎉' : score >= 8 ? '非常好！小瑕疵而已' : score >= 6 ? '還不錯，複習一下錯題' : '建議重看兩層判斷架構再試一次'}
                            </div>
                        </div>
                        <div className="divide-y divide-[#f0ede6]">
                            {QUIZ_QUESTIONS.map((q, i) => {
                                const correct = selections[i] === q.answer;
                                return (
                                    <div key={i} className={`p-4 px-5 ${correct ? 'bg-[#f0fdf4]' : 'bg-[#fff5f5]'}`}>
                                        <div className="flex items-start gap-3">
                                            <span className={`shrink-0 text-[12px] font-bold mt-0.5 ${correct ? 'text-[#2e7d5a]' : 'text-[#e32d5b]'}`}>
                                                {correct ? '✓' : '✗'} Q{i + 1}
                                            </span>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-[12px] text-[#1a1a2e] mb-1 font-medium">{q.q}</p>
                                                {!correct && (
                                                    <p className="text-[11px] text-[#e32d5b] mb-1">
                                                        你選了：{q.options[selections[i]]}　正解：{q.options[q.answer]}
                                                    </p>
                                                )}
                                                <p className="text-[11px] text-[#8888aa] italic">{q.hint}</p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="p-5 text-center border-t border-[#dddbd5]">
                            <button onClick={resetQuiz} className="flex items-center gap-2 text-[13px] text-[#2d5be3] font-bold hover:underline mx-auto">
                                <RefreshCw size={14} /> 重新作答
                            </button>
                        </div>
                    </div>
                ) : (
                    /* 作答頁 */
                    <div className="bg-white border border-[#dddbd5] rounded-[12px] overflow-hidden">
                        {/* 進度條 */}
                        <div className="h-1.5 bg-[#f0ede6]">
                            <div
                                className="h-full bg-[#2d5be3] transition-all duration-300"
                                style={{ width: `${((currentQ + (selections[currentQ] !== undefined ? 1 : 0)) / 10) * 100}%` }}
                            />
                        </div>
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-5">
                                <span className="text-[11px] font-mono text-[#8888aa]">Q {currentQ + 1} / 10</span>
                                <span className="text-[11px] font-mono text-[#2d5be3]">
                                    {Object.values(selections).filter((v, i) => v === QUIZ_QUESTIONS[i]?.answer).length} 正確
                                </span>
                            </div>
                            <p className="text-[15px] font-bold text-[#1a1a2e] leading-snug mb-6">
                                {QUIZ_QUESTIONS[currentQ].q}
                            </p>
                            <div className="space-y-2.5">
                                {QUIZ_QUESTIONS[currentQ].options.map((opt, i) => {
                                    const selected = selections[currentQ];
                                    const isCorrect = i === QUIZ_QUESTIONS[currentQ].answer;
                                    const isSelected = selected === i;
                                    let style = 'border-[#dddbd5] bg-white hover:border-[#2d5be3] hover:bg-[#f0f4ff] cursor-pointer';
                                    if (selected !== undefined) {
                                        if (isCorrect) style = 'border-[#2e7d5a] bg-[#e8f5ee] cursor-default';
                                        else if (isSelected) style = 'border-[#e32d5b] bg-[#fff5f5] cursor-default';
                                        else style = 'border-[#dddbd5] bg-[#fafaf8] cursor-default opacity-50';
                                    }
                                    return (
                                        <button
                                            key={i}
                                            onClick={() => handleSelect(i)}
                                            disabled={selected !== undefined}
                                            className={`w-full text-left px-4 py-3 rounded-[8px] border-2 text-[13px] transition-all ${style}`}
                                        >
                                            <span className="font-mono text-[11px] font-bold mr-3 text-[#8888aa]">{['A', 'B', 'C', 'D'][i]}.</span>
                                            {opt}
                                            {selected !== undefined && isCorrect && <span className="float-right text-[#2e7d5a] font-bold">✓</span>}
                                            {selected !== undefined && isSelected && !isCorrect && <span className="float-right text-[#e32d5b] font-bold">✗</span>}
                                        </button>
                                    );
                                })}
                            </div>
                            {selections[currentQ] !== undefined && (
                                <div className={`mt-4 px-4 py-3 rounded-[6px] text-[12px] animate-in zoom-in-95 ${selections[currentQ] === QUIZ_QUESTIONS[currentQ].answer ? 'bg-[#e8f5ee] text-[#2e7d5a]' : 'bg-[#fff5f5] text-[#e32d5b]'}`}>
                                    💡 {QUIZ_QUESTIONS[currentQ].hint}
                                    {currentQ < 9 && (
                                        <span className="text-[#8888aa] ml-2">（自動跳題中…）</span>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </section>

            {/* ── PART 3: 判斷自己的題目 ──────────────────────── */}
            <section className="mb-16">
                <div className="w6-section-head">
                    <h2>判斷自己的題目</h2>
                    <div className="line"></div>
                    <span className="mono">IN-CLASS</span>
                </div>
                <p className="clinic-section-desc">把剛學到的兩層判斷用在你真實的研究題目上。這才是今天最重要的事。</p>

                <div className="grid md:grid-cols-2 gap-8 mb-8">
                    <div className="w6-task-block group">
                        <div className="w6-task-header">
                            <span className="w6-task-badge">STEP 1</span>
                            <span className="w6-task-title">走一次兩層判斷</span>
                        </div>
                        <div className="w6-task-body">
                            拿出你的 W4 定案題目，打開學習單 Part B，照著走：<br /><br />
                            <ol className="list-decimal pl-5 space-y-2">
                                <li><strong>第一層</strong>：我的資料要自己收集，還是分析已有文本？</li>
                                <li><strong>第二層 ❶</strong>：要比例趨勢，還是原因脈絡？</li>
                                <li><strong>第二層 ❷</strong>：能不能主動操控某個條件？</li>
                                <li><strong>第二層 ❸</strong>：記錄真實行為，還是了解想法態度？</li>
                                <li>決定主要方法（+ 輔助方法，如有需要）</li>
                            </ol>
                        </div>
                    </div>

                    <div className="w6-task-block group bg-[#f0ede6]/30">
                        <div className="w6-task-header">
                            <span className="w6-task-badge bg-[#1a1a2e]">STEP 2</span>
                            <span className="w6-task-title">跟旁邊的人說一遍</span>
                        </div>
                        <div className="w6-task-body">
                            說完讓對方用這幾個問題挑戰你：<br /><br />
                            <ul className="space-y-2 text-[13px] text-[#4a4a6a]">
                                <li>「你要的真的是比例，還是其實是原因？」</li>
                                <li>「你的資料是自己收集的，還是分析別人寫的？」</li>
                                <li>「如果你選問卷，你的題目問的是什麼，問卷能回答嗎？」</li>
                            </ul>
                            <br />
                            如果被挑戰到說不出話——先不要慌，回去看兩層判斷架構，找到你卡住的那一條。
                        </div>
                    </div>
                </div>

                <div className="w6-notice w6-notice-gold">
                    🎯 結束前你要能說出：「我的題目是___，我選___法，因為___（引用兩層判斷的某一條）。」
                </div>
            </section>

            {/* ── PART 4: 本週總結 ─────────────────────────────── */}
            <section className="pb-24">
                <div className="w6-section-head">
                    <h2>本週總結</h2>
                    <div className="line"></div>
                    <div className="mono uppercase">Wrap-Up</div>
                </div>

                <div className="bg-white border border-[#dddbd5] rounded-[10px] overflow-hidden mb-4">
                    <div className="p-4 px-5 bg-[#f0ede6] border-b border-[#dddbd5] font-bold text-[13px]">
                        ✅ 本週結束，你應該要會
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-[1px] bg-[#dddbd5]">
                        {[
                            { text: <>說出<strong>五種研究方法</strong>各自的目的與適用情境</> },
                            { text: <>用<strong>兩層判斷架構</strong>為任何研究題目選定方法</> },
                            { text: <>知道文獻法的<strong>三種用途</strong>，不把它當成「查資料」</> },
                            { text: <>為你的 W4 題目選出<strong>主要方法</strong>並說清楚理由</> },
                        ].map((goal, idx) => (
                            <div key={idx} className="p-4 px-6 bg-white flex items-start gap-3">
                                <span className="text-[#2e7d5a] mt-0.5">✓</span>
                                <span className="text-[13px] text-[#4a4a6a]">{goal.text}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white border border-[#dddbd5] rounded-[10px] overflow-hidden mb-12">
                    <div className="p-4 px-5 bg-[#f0ede6] border-b border-[#dddbd5] flex items-center gap-3">
                        <span className="text-[10px] font-mono bg-[#1a1a2e] text-white px-2 py-0.5 rounded-[3px]">HOMEWORK</span>
                        <span className="font-bold text-[13px]">本週作業</span>
                    </div>
                    <div className="p-5 space-y-3 text-[13px] text-[#4a4a6a]">
                        <p>完成 <strong>W7 學習單</strong>，截止下週一晚上 11:59，在 Google Classroom 繳交。</p>
                        <p>重點是 <strong>Part B</strong>——課堂上你已經走過一次了，回去把理由寫清楚，不要只填方法名稱。</p>
                        <p className="text-[12px] text-[#8888aa]">⚠️ W8 下半節有小考（範圍：兩層判斷架構）+ 正式組隊，記得帶 W4 定案題目來。</p>
                    </div>
                </div>

                {/* 前後週導航 */}
                <div className="flex items-center justify-between pt-4 border-t border-[#dddbd5]">
                    <Link to="/w6" className="text-[13px] font-bold text-[#8888aa] hover:text-[#1a1a2e] flex items-center gap-2 transition-colors">
                        <ArrowRight size={16} className="rotate-180" /> W6 文獻偵探社
                    </Link>
                    <Link to="/w8" className="bg-[#1a1a2e] text-white px-8 py-3 rounded-lg text-[13px] font-bold hover:bg-[#2d5be3] transition-all flex items-center gap-2 group shadow-lg shadow-[#1a1a2e]/10">
                        前往 W8 組隊決策週 <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </section>
        </div>
    );
};
