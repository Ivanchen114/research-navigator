import React, { useState, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './ClinicPage.css';
import CourseArc from '../components/ui/CourseArc';
import ThinkRecord from '../components/ui/ThinkRecord';
import AIREDNarrative from '../components/ui/AIREDNarrative';
import ThinkChoice from '../components/ui/ThinkChoice';
import StepEngine from '../components/ui/StepEngine';
import HeroBlock from '../components/ui/HeroBlock';
import ExportButton from '../components/ui/ExportButton';
import ResetWeekButton from '../components/ui/ResetWeekButton';
import { readRecords, STORAGE_KEY } from '../components/ui/ThinkRecord';
import {
    Map,
    ArrowRight,
    CheckCircle2,
    ShieldAlert,
    ChevronDown,
    ChevronUp,
    Trophy,
    RefreshCw,
    Activity,
    Ghost,
    Unlock,
} from 'lucide-react';
import LessonMap from '../components/ui/LessonMap';
import { W7Data } from '../data/lessonMaps';

/* ══════════════════════════════════════
 *  資料常數
 * ══════════════════════════════════════ */

const METHODS = [
    {
        icon: '📋', name: '問卷調查法', id: 'survey', color: 'var(--accent)', bg: 'var(--accent-light)',
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
        icon: '👀', name: '觀察法', id: 'observation', color: 'var(--success)', bg: 'var(--success-light)',
        purpose: '記錄真實發生的行為，不依賴受試者自我報告。',
        strength: '結果比較客觀，不會因為「人說的跟實際做的不一樣」而失真。',
        weakness: '只能看到外在行為，看不到內心想法。另外，如果受試者知道自己被觀察，行為可能會變得不自然。',
        when: '「真實行為是什麼（不是人們說自己做了什麼）」「頻率、時間、空間分布」',
        note: '觀察法需要設計觀察表（記什麼、怎麼記、記多久），不是「隨便去看看」。'
    },
    {
        icon: '📚', name: '文獻分析法', id: 'literature', color: '#6b21a8', bg: '#f5f3ff',
        purpose: '系統性地閱讀、整理或分析已存在的文字資料（不是自己去收集一手資料）。',
        strength: '三種常見用途：①文獻回顧：整理前人研究。②歷史文獻分析：從史料推論原因。③內容分析：統計文本中詞彙/主題的頻率。',
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
        options: [
            { label: 'A', text: '訪談' },
            { label: 'B', text: '問卷' },
            { label: 'C', text: '實驗' },
            { label: 'D', text: '觀察' },
        ],
        answer: 'B',
        hint: '要的是「多少人、幾小時」→ 比例趨勢 → 問卷'
    },
    {
        q: '「我想了解為什麼同學在課堂上容易分心」→ 適合哪種方法？',
        options: [
            { label: 'A', text: '問卷' },
            { label: 'B', text: '文獻' },
            { label: 'C', text: '訪談' },
            { label: 'D', text: '實驗' },
        ],
        answer: 'C',
        hint: '要的是「為什麼」→ 原因脈絡 → 訪談'
    },
    {
        q: '「我想知道播放古典音樂是否能提升短期記憶力」→ 適合哪種方法？',
        options: [
            { label: 'A', text: '問卷' },
            { label: 'B', text: '觀察' },
            { label: 'C', text: '文獻' },
            { label: 'D', text: '實驗' },
        ],
        answer: 'D',
        hint: '能操控自變項（音樂）→ 實驗法'
    },
    {
        q: '「我想記錄圖書館午休時，同學實際起身走動的次數與時機」→ 適合哪種方法？',
        options: [
            { label: 'A', text: '問卷' },
            { label: 'B', text: '觀察' },
            { label: 'C', text: '訪談' },
            { label: 'D', text: '文獻' },
        ],
        answer: 'B',
        hint: '要記錄「真實行為」，不靠自我報告 → 觀察法'
    },
    {
        q: '「我想整理過去十年台灣高中生課業壓力研究的主要發現」→ 適合哪種方法？',
        options: [
            { label: 'A', text: '實驗' },
            { label: 'B', text: '問卷' },
            { label: 'C', text: '文獻' },
            { label: 'D', text: '觀察' },
        ],
        answer: 'C',
        hint: '分析已存在的研究文本 → 第一層直接導向文獻法（文獻回顧）'
    },
    {
        q: '下列哪個題目「最不適合」用問卷？',
        options: [
            { label: 'A', text: '全校有幾成同學每天超過10點睡覺？' },
            { label: 'B', text: '同學覺得最難的科目是哪個？' },
            { label: 'C', text: '為什麼有些同學晚上睡不著？' },
            { label: 'D', text: '多少人曾因壓力影響睡眠？' },
        ],
        answer: 'C',
        hint: '「為什麼睡不著」要挖深層原因，問卷選項只能得到表面，應用訪談'
    },
    {
        q: '「從日治時期史料分析台灣土地政策為何引發農民抗爭」→ 適合哪種方法？',
        options: [
            { label: 'A', text: '問卷' },
            { label: 'B', text: '實驗' },
            { label: 'C', text: '觀察' },
            { label: 'D', text: '文獻' },
        ],
        answer: 'D',
        hint: '資料是已有史料 → 文獻法；回答「為什麼」是歷史文獻分析用途'
    },
    {
        q: '一份研究同時想知道「使用頻率」和「使用的心理動機」，最適合？',
        options: [
            { label: 'A', text: '只用問卷' },
            { label: 'B', text: '只用訪談' },
            { label: 'C', text: '問卷（主）+ 訪談（輔）' },
            { label: 'D', text: '實驗 + 觀察' },
        ],
        answer: 'C',
        hint: '頻率 → 問卷；動機 → 訪談；兩者互補最適合'
    },
    {
        q: '「分析近五年台灣各大報對 AI 教育新聞的報導角度與用詞趨勢」→ 適合？',
        options: [
            { label: 'A', text: '問卷' },
            { label: 'B', text: '觀察' },
            { label: 'C', text: '文獻' },
            { label: 'D', text: '實驗' },
        ],
        answer: 'C',
        hint: '分析已有媒體文本中詞彙/主題的模式 → 文獻法（內容分析）'
    },
    {
        q: '以下哪個研究問題需要「觀察法」而非問卷？',
        options: [
            { label: 'A', text: '你覺得下課時間夠嗎？' },
            { label: 'B', text: '課堂上同學實際起身走動的次數' },
            { label: 'C', text: '你最喜歡的休閒活動？' },
            { label: 'D', text: '你認為學校環境對學習有幫助嗎？' },
        ],
        answer: 'B',
        hint: '「走動次數」是直接觀察的行為，問卷靠自我報告，容易不準確'
    },
];

/* — 理解檢核（穿插在觀念段落之間的 ThinkChoice） — */
const THINK_CHOICES = [
    {
        id: 'tc1',
        prompt: '同學想研究「高一生每天喝多少杯手搖飲」，你建議用什麼方法？',
        options: [
            { label: 'A', text: '訪談——可以追問為什麼想喝' },
            { label: 'B', text: '問卷——量化收集數量比例' },
            { label: 'C', text: '觀察——偷偷數他買幾杯' },
        ],
        answer: 'B',
        feedback: '核心問的是「多少杯」＝ 數量比例，問卷最適合。觀察不切實際（你不能全天跟蹤），訪談太沒效率。',
    },
    {
        id: 'tc2',
        prompt: '研究問「為什麼學生不愛用學校圖書館」，問卷和訪談哪個更適合當主方法？',
        options: [
            { label: 'A', text: '問卷——可以大量收集各年級意見' },
            { label: 'B', text: '訪談——深挖背後的原因和脈絡' },
        ],
        answer: 'B',
        feedback: '核心問的是「為什麼」＝ 原因脈絡。問卷能得到表面選項（如「太遠」「書太舊」），但訪談才能追問「你說太遠，多遠才算遠？以前會去嗎？是什麼讓你不再去的？」',
    },
];

/* — ExportButton 欄位 — */
const EXPORT_FIELDS = [
    { key: 'w7-my-topic', label: '我的 W4 定案題目' },
    { key: 'w7-layer1', label: '第一層判斷', question: '我的資料要自己收集，還是分析已有文本？' },
    { key: 'w7-layer2', label: '第二層判斷', question: '最關鍵的那一條分科問題，以及我的回答' },
    { key: 'w7-main-method', label: '我選定的主要方法', question: '問卷/訪談/實驗/觀察/文獻？' },
    { key: 'w7-reason', label: '選擇理由', question: '為什麼選這個方法？請引用兩層判斷中的某一條' },
    { key: 'w7-aux-method', label: '輔助方法', question: '需要輔助方法嗎？是什麼？為什麼？' },
    { key: 'w7-reflect-wrong', label: '反思：測驗錯題', question: '你錯了哪幾題？錯的原因是什麼？' },
    { key: 'w7-reflect-confused', label: '反思：最易搞混的方法', question: '你最容易搞混的兩種方法是哪兩個？' },
    { key: 'w7-reflect-insight', label: '反思：新想法', question: '幫自己的題目掛號後，你對研究方向有什麼新的想法？' },
    { key: 'w7-reflect-literature', label: '反思：文獻法用途', question: '文獻法的三種用途中，你的題目有可能用到哪一種？' },
    { key: 'w7-aired-record', label: 'AI-RED 敘事紀錄', question: '本週最重要的一次 AI 互動（A-I-R-E-D 五要素）' },
];

/* ══════════════════════════════════════
 *  主元件
 * ══════════════════════════════════════ */

export const ClinicPage = () => {
    const [showLessonMap, setShowLessonMap] = useState(false);
    const [expandedMethod, setExpandedMethod] = useState(null);
    const [choiceResults, setChoiceResults] = useState([]);

    /* Quiz state */
    const [quizStarted, setQuizStarted] = useState(false);
    const [currentQ, setCurrentQ] = useState(0);
    const [selections, setSelections] = useState({});
    const [quizDone, setQuizDone] = useState(false);

    /* W4 題目帶入 */
    const [w4Topic, setW4Topic] = useState('');

    useEffect(() => {
        const saved = readRecords();
        const topic = saved['w4-final-topic']?.trim();
        if (topic) {
            setW4Topic(topic);
            // auto-fill w7-my-topic if empty
            if (!saved['w7-my-topic']?.trim()) {
                const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
                all['w7-my-topic'] = topic;
                localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
            }
        }
    }, []);

    /* ThinkChoice callback */
    const handleChoice = useCallback((id, prompt) => (label, isCorrect) => {
        setChoiceResults(prev => {
            const filtered = prev.filter(r => r.id !== id);
            return [...filtered, { id, question: prompt, selected: label, correct: isCorrect }];
        });
    }, []);

    /* Quiz handlers */
    const handleSelect = (optLabel) => {
        if (selections[currentQ] !== undefined) return;
        const newSelections = { ...selections, [currentQ]: optLabel };
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

    /* ── 五步驟 ──────────────────────────────────────── */

    const steps = [
        /* ─── Step 1：五種方法 + 兩層判斷 ─── */
        {
            title: '五種方法 + 兩層判斷',
            icon: '🩺',
            content: (
                <div className="space-y-8 prose-zh">
                    <p className="text-[14px] text-[var(--ink-mid)] leading-relaxed max-w-[720px]">
                        認識五種研究方法的目的與限制，再用「兩層判斷架構」決定你的題目該用哪種。
                    </p>

                    {/* 量化 vs 質性 */}
                    <div className="rounded-[var(--radius-unified)] overflow-hidden border border-[var(--border)]">
                        <div className="bg-[var(--ink)] px-5 py-3 flex items-center gap-2">
                            <span className="text-[16px]">🌳</span>
                            <span className="text-white font-bold text-[13px]">所有方法的兩條根</span>
                            <span className="ml-auto text-[10px] font-mono text-[var(--ink-light)]">先有這個，再看五種方法</span>
                        </div>
                        <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[var(--border)]">
                            <div className="p-5 bg-[var(--accent-light)]">
                                <div className="text-[11px] font-mono font-bold text-[var(--accent)] uppercase tracking-wider mb-2">📊 量化研究</div>
                                <p className="text-[13px] text-[var(--ink)] font-medium mb-3">把世界轉換成數字，找規律、比較差異</p>
                                <div className="space-y-1.5">
                                    {[
                                        '想知道「有多少人」「什麼比例」「哪個高」',
                                        '結果可以統計、可以圖表呈現',
                                        '對應方法：📋 問卷、🧪 實驗、📚 內容分析',
                                    ].map((t, i) => (
                                        <div key={i} className="flex items-start gap-2 text-[12px] text-[var(--ink-mid)]">
                                            <span className="text-[var(--accent)] mt-0.5 shrink-0">→</span>{t}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="p-5 bg-[#f5f3ff]">
                                <div className="text-[11px] font-mono font-bold text-[#7c3aed] uppercase tracking-wider mb-2">📖 質性研究</div>
                                <p className="text-[13px] text-[var(--ink)] font-medium mb-3">理解人的意義、經驗與脈絡，挖深層原因</p>
                                <div className="space-y-1.5">
                                    {[
                                        '想知道「為什麼」「怎麼想的」「背後故事」',
                                        '結果是文字描述、主題、洞察',
                                        '對應方法：🎤 訪談、👀 觀察、📚 歷史文獻分析',
                                    ].map((t, i) => (
                                        <div key={i} className="flex items-start gap-2 text-[12px] text-[var(--ink-mid)]">
                                            <span className="text-[#7c3aed] mt-0.5 shrink-0">→</span>{t}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="px-5 py-3 bg-[#fef3c7] border-t border-[var(--border)] text-[12px] text-[#92400e]">
                            💡 <strong>混合方法</strong>：一個研究可以兩條路都走。例如：用問卷收集比例（量化），再用訪談挖原因（質性）。分科三問 ❶ 其實就是在問你想走哪條根。
                        </div>
                    </div>

                    {/* 五種方法卡 */}
                    <div className="space-y-3">
                        {METHODS.map((m) => {
                            const isOpen = expandedMethod === m.id;
                            return (
                                <div key={m.id} className="border border-[var(--border)] rounded-[var(--radius-unified)] overflow-hidden bg-white">
                                    <button
                                        onClick={() => setExpandedMethod(isOpen ? null : m.id)}
                                        className="w-full flex items-center gap-4 px-5 py-4 hover:bg-[var(--paper)] transition-colors text-left"
                                    >
                                        <span className="text-[22px] shrink-0">{m.icon}</span>
                                        <div className="flex-1 min-w-0">
                                            <span className="font-bold text-[14px] text-[var(--ink)]">{m.name}</span>
                                            <span className="text-[12px] text-[var(--ink-light)] ml-3">{m.purpose.slice(0, 40)}…</span>
                                        </div>
                                        {isOpen
                                            ? <ChevronUp size={16} className="text-[var(--ink-light)] shrink-0" />
                                            : <ChevronDown size={16} className="text-[var(--ink-light)] shrink-0" />
                                        }
                                    </button>

                                    {isOpen && (
                                        <div className="px-5 pb-5 border-t border-[var(--border)] animate-in slide-in-from-top-2 duration-150">
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
                                                        <p className="text-[var(--ink-mid)] leading-relaxed">{val}</p>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="mt-4 px-4 py-3 rounded-[var(--radius-unified)] text-[12px] text-[var(--ink-mid)] flex gap-2"
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
                                <div className="w6-speed-q-num text-[var(--ink)]">L1</div>
                                <div className="flex-1">
                                    <div className="w6-speed-q-text font-bold">{TWO_LAYER.layer1.question}</div>
                                    <div className="flex flex-col gap-2 mt-3">
                                        {TWO_LAYER.layer1.options.map((opt, i) => (
                                            <div key={i} className="flex flex-wrap items-start gap-x-2 gap-y-1.5 text-[12px] text-[var(--ink-mid)]">
                                                <span className="text-[var(--ink-light)] shrink-0">→</span>
                                                <span className="flex-1 min-w-[140px]">{opt.label}</span>
                                                <span className="w6-method-tag whitespace-nowrap shrink-0 ml-5 sm:ml-0">{opt.arrow}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-[var(--border)] my-1" />

                            {/* 第二層 */}
                            <div className="w6-speed-q items-start">
                                <div className="w6-speed-q-num text-[var(--accent)]">L2</div>
                                <div className="flex-1">
                                    <div className="w6-speed-q-text font-bold mb-3">{TWO_LAYER.layer2.question}</div>
                                    {TWO_LAYER.layer2.items.map((item) => (
                                        <div key={item.id} className="mb-3">
                                            <div className="text-[12px] font-bold text-[var(--ink)] mb-1.5">
                                                {item.id} {item.q}
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {item.a.map((ans, i) => {
                                                    const [label, method] = ans.split(' → ');
                                                    return (
                                                        <div key={i} className="flex items-center gap-1.5 text-[11px] text-[var(--ink-mid)]">
                                                            {label} → <span className="w6-method-tag whitespace-nowrap">{method}</span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ))}
                                    <div className="text-[11px] text-[var(--ink-light)] pt-2 border-t border-[var(--border)] mt-2">
                                        💡 {TWO_LAYER.layer2.note}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 理解檢核 1 */}
                    <ThinkChoice
                        dataKey="w7-tc1"
                        prompt={THINK_CHOICES[0].prompt}
                        options={THINK_CHOICES[0].options}
                        answer={THINK_CHOICES[0].answer}
                        feedback={THINK_CHOICES[0].feedback}
                        onAnswer={handleChoice(THINK_CHOICES[0].id, THINK_CHOICES[0].prompt)}
                    />
                </div>
            ),
        },

        /* ─── Step 2：分科判斷測驗 ─── */
        {
            title: '分科判斷測驗',
            icon: '🎯',
            content: (
                <div className="space-y-6 prose-zh">
                    <p className="text-[14px] text-[var(--ink-mid)] leading-relaxed max-w-[720px]">
                        10 題選擇題，驗收你對兩層判斷架構的理解。做完之後注意自己錯在哪幾題——Step 4 反思會用到。
                    </p>

                    {/* 理解檢核 2（在測驗前暖身） */}
                    <ThinkChoice
                        dataKey="w7-tc2"
                        prompt={THINK_CHOICES[1].prompt}
                        options={THINK_CHOICES[1].options}
                        answer={THINK_CHOICES[1].answer}
                        feedback={THINK_CHOICES[1].feedback}
                        onAnswer={handleChoice(THINK_CHOICES[1].id, THINK_CHOICES[1].prompt)}
                    />

                    {!quizStarted ? (
                        <div className="bg-[var(--ink)] rounded-[var(--radius-unified)] p-8 text-center text-white">
                            <div className="text-[40px] mb-4">🎯</div>
                            <h3 className="text-[18px] font-bold mb-2">分科判斷測驗</h3>
                            <p className="text-[var(--ink-light)] text-[13px] mb-6">10 題 · 每題選一個答案 · 選完自動跳下題</p>
                            <button
                                onClick={() => setQuizStarted(true)}
                                className="bg-[var(--accent)] hover:opacity-90 text-white font-bold px-8 py-3 rounded-[var(--radius-unified)] transition-colors text-[14px] flex items-center gap-2 mx-auto"
                            >
                                開始測驗 <ArrowRight size={16} />
                            </button>
                        </div>
                    ) : quizDone ? (
                        /* 結果頁 */
                        <div className="bg-white border border-[var(--border)] rounded-[var(--radius-unified)] overflow-hidden">
                            <div className="bg-[var(--ink)] p-6 text-center text-white">
                                <Trophy className="mx-auto mb-3 text-[#f59e0b]" size={36} />
                                <div className="text-[32px] font-black mb-1">{score} / 10</div>
                                <div className="text-[var(--ink-light)] text-[13px]">
                                    {score === 10 ? '完美！全對通關 🎉' : score >= 8 ? '非常好！小瑕疵而已' : score >= 6 ? '還不錯，複習一下錯題' : '建議重看兩層判斷架構再試一次'}
                                </div>
                            </div>
                            <div className="divide-y divide-[var(--border)]">
                                {QUIZ_QUESTIONS.map((q, i) => {
                                    const correct = selections[i] === q.answer;
                                    return (
                                        <div key={i} className={`p-4 px-5 ${correct ? 'bg-[var(--success-light)]' : 'bg-[var(--danger-light)]'}`}>
                                            <div className="flex items-start gap-3">
                                                <span className={`shrink-0 text-[12px] font-bold mt-0.5 ${correct ? 'text-[var(--success)]' : 'text-[var(--danger)]'}`}>
                                                    {correct ? '✓' : '✗'} Q{i + 1}
                                                </span>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-[12px] text-[var(--ink)] mb-1 font-medium">{q.q}</p>
                                                    {!correct && (
                                                        <p className="text-[11px] text-[var(--danger)] mb-1">
                                                            你選了：{q.options.find(o => o.label === selections[i])?.text}　正解：{q.options.find(o => o.label === q.answer)?.text}
                                                        </p>
                                                    )}
                                                    <p className="text-[11px] text-[var(--ink-light)] italic">{q.hint}</p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="p-5 text-center border-t border-[var(--border)]">
                                <button onClick={resetQuiz} className="flex items-center gap-2 text-[13px] text-[var(--accent)] font-bold hover:underline mx-auto">
                                    <RefreshCw size={14} /> 重新作答
                                </button>
                            </div>
                        </div>
                    ) : (
                        /* 作答頁 */
                        <div className="bg-white border border-[var(--border)] rounded-[var(--radius-unified)] overflow-hidden">
                            {/* 進度條 */}
                            <div className="h-1.5 bg-[var(--paper-warm)]">
                                <div
                                    className="h-full bg-[var(--accent)] transition-all duration-300"
                                    style={{ width: `${((currentQ + (selections[currentQ] !== undefined ? 1 : 0)) / 10) * 100}%` }}
                                />
                            </div>
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-5">
                                    <span className="text-[11px] font-mono text-[var(--ink-light)]">Q {currentQ + 1} / 10</span>
                                    <span className="text-[11px] font-mono text-[var(--accent)]">
                                        {Object.entries(selections).filter(([idx, v]) => v === QUIZ_QUESTIONS[idx]?.answer).length} 正確
                                    </span>
                                </div>
                                <p className="text-[15px] font-bold text-[var(--ink)] leading-snug mb-6">
                                    {QUIZ_QUESTIONS[currentQ].q}
                                </p>
                                <div className="space-y-2.5">
                                    {QUIZ_QUESTIONS[currentQ].options.map((opt) => {
                                        const selected = selections[currentQ];
                                        const isCorrect = opt.label === QUIZ_QUESTIONS[currentQ].answer;
                                        const isSelected = selected === opt.label;
                                        let style = 'border-[var(--border)] bg-white hover:border-[var(--accent)] hover:bg-[var(--accent-light)] cursor-pointer';
                                        if (selected !== undefined) {
                                            if (isCorrect) style = 'border-[var(--success)] bg-[var(--success-light)] cursor-default';
                                            else if (isSelected) style = 'border-[var(--danger)] bg-[var(--danger-light)] cursor-default';
                                            else style = 'border-[var(--border)] bg-[var(--paper)] cursor-default opacity-50';
                                        }
                                        return (
                                            <button
                                                key={opt.label}
                                                onClick={() => handleSelect(opt.label)}
                                                disabled={selected !== undefined}
                                                className={`w-full text-left px-4 py-3 rounded-[var(--radius-unified)] border-2 text-[13px] transition-all ${style}`}
                                            >
                                                <span className="font-mono text-[11px] font-bold mr-3 text-[var(--ink-light)]">{opt.label}.</span>
                                                {opt.text}
                                                {selected !== undefined && isCorrect && <span className="float-right text-[var(--success)] font-bold">✓</span>}
                                                {selected !== undefined && isSelected && !isCorrect && <span className="float-right text-[var(--danger)] font-bold">✗</span>}
                                            </button>
                                        );
                                    })}
                                </div>
                                {selections[currentQ] !== undefined && (
                                    <div className={`mt-4 px-4 py-3 rounded-[var(--radius-unified)] text-[12px] animate-in zoom-in-95 ${selections[currentQ] === QUIZ_QUESTIONS[currentQ].answer ? 'bg-[var(--success-light)] text-[var(--success)]' : 'bg-[var(--danger-light)] text-[var(--danger)]'}`}>
                                        💡 {QUIZ_QUESTIONS[currentQ].hint}
                                        {currentQ < 9 && (
                                            <span className="text-[var(--ink-light)] ml-2">（自動跳題中…）</span>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            ),
        },

        /* ─── Step 3：幫自己的題目掛號 ─── */
        {
            title: '幫自己的題目掛號',
            icon: '🏥',
            content: (
                <div className="space-y-6 prose-zh">
                    <p className="text-[14px] text-[var(--ink-mid)] leading-relaxed max-w-[720px]">
                        把剛學到的兩層判斷用在你真實的研究題目上。這才是今天最重要的事。
                    </p>

                    {/* W4 帶入卡 */}
                    {w4Topic && (
                        <div className="flex items-start gap-3 px-4 py-3 rounded-[var(--radius-unified)] bg-[var(--accent-light)] border border-[var(--accent)] text-[13px]">
                            <span className="text-[16px]">📎</span>
                            <div>
                                <span className="font-bold text-[var(--accent)]">自動帶入 W4 定案題目</span>
                                <p className="text-[var(--ink-mid)] mt-0.5">{w4Topic}</p>
                            </div>
                        </div>
                    )}

                    {/* 我的定案題目 */}
                    <ThinkRecord
                        dataKey="w7-my-topic"
                        prompt="我的 W4 定案題目"
                        placeholder="貼上或輸入你在 W4 定案的研究題目…"
                        rows={2}
                    />

                    {/* 第一層判斷 */}
                    <div className="bg-white border border-[var(--border)] rounded-[var(--radius-unified)] overflow-hidden">
                        <div className="px-5 py-3 bg-[var(--paper-warm)] border-b border-[var(--border)] flex items-center gap-2">
                            <span className="font-mono text-[10px] font-bold bg-[var(--ink)] text-white px-2 py-0.5 rounded-[3px]">L1</span>
                            <span className="font-bold text-[13px] text-[var(--ink)]">第一層判斷：資料從哪來？</span>
                        </div>
                        <div className="p-5 text-[13px] text-[var(--ink-mid)] space-y-2">
                            <p>□ 我要自己收集新資料（去問人、去觀察、去做實驗）→ 繼續第二層</p>
                            <p>□ 我要分析已有的文本/資料 → 文獻法</p>
                        </div>
                    </div>

                    <ThinkRecord
                        dataKey="w7-layer1"
                        prompt="第一層判斷"
                        placeholder="我的資料要自己收集，因為……（或）我要分析已有文本，因為……"
                        rows={2}
                    />

                    {/* 第二層判斷 */}
                    <div className="bg-white border border-[var(--border)] rounded-[var(--radius-unified)] overflow-hidden">
                        <div className="px-5 py-3 bg-[var(--paper-warm)] border-b border-[var(--border)] flex items-center gap-2">
                            <span className="font-mono text-[10px] font-bold bg-[var(--accent)] text-white px-2 py-0.5 rounded-[3px]">L2</span>
                            <span className="font-bold text-[13px] text-[var(--ink)]">第二層判斷：問的是什麼？</span>
                        </div>
                        <div className="p-5 text-[13px] text-[var(--ink-mid)] space-y-2">
                            <p>❶ 比例趨勢 vs 原因脈絡？我要的是：</p>
                            <p>❷ 能否操控自變項？我要的是：</p>
                            <p>❸ 真實行為 vs 想法態度？我要的是：</p>
                        </div>
                    </div>

                    <ThinkRecord
                        dataKey="w7-layer2"
                        prompt="第二層判斷"
                        placeholder="最關鍵的那一條分科問題是 ❶/❷/❸，我的回答是……"
                        rows={3}
                    />

                    {/* 主要方法 */}
                    <ThinkRecord
                        dataKey="w7-main-method"
                        prompt="我選定的主要方法"
                        placeholder="問卷/訪談/實驗/觀察/文獻（如果是文獻，請寫明用途：文獻回顧/歷史分析/內容分析）"
                        rows={2}
                    />

                    <ThinkRecord
                        dataKey="w7-reason"
                        prompt="選擇理由（請引用兩層判斷中的某一條）"
                        placeholder="例：我選訪談法。因為我的核心問題問的是『學生為什麼考前才去圖書館』——要的是深層原因，對應兩層判斷的第 ❶ 條（要原因/脈絡）。"
                        scaffold={['我選 ___ 法', '因為我的核心問題問的是…', '對應兩層判斷的第 ___ 條']}
                        rows={3}
                    />

                    <ThinkRecord
                        dataKey="w7-aux-method"
                        prompt="輔助方法（如果需要）"
                        placeholder="例：不需要。  或：需要問卷法做輔助，因為訪談 8 人不夠看分布，先用問卷掃 100 人找趨勢。"
                        scaffold={['不需要', '（若需要）需要 ___ 法做輔助，因為…']}
                        rows={2}
                    />

                    {/* 同儕挑戰提示 */}
                    <div className="w6-notice w6-notice-gold">
                        🎯 寫完之後，跟旁邊的人說一遍你的選擇和理由。讓對方用這幾個問題挑戰你：「你要的真的是比例，還是其實是原因？」「你的資料是自己收集的，還是分析別人寫的？」「如果你選問卷，你的題目問的是什麼，問卷能回答嗎？」
                    </div>
                </div>
            ),
        },

        /* ─── Step 4：反思 ─── */
        {
            title: '反思',
            icon: '💭',
            content: (
                <div className="space-y-6 prose-zh">
                    <p className="text-[14px] text-[var(--ink-mid)] leading-relaxed max-w-[720px]">
                        回顧測驗與判斷過程，整理你今天學到的東西。這四題是課後學習單 Part C 的內容。
                    </p>

                    <ThinkRecord
                        dataKey="w7-reflect-wrong"
                        prompt="1. 測驗錯題分析"
                        placeholder="例：我錯了第 3 題。錯的原因是我搞混了「問卷法」和「訪談法」——以為大量收答案就一定是問卷，沒注意到題目要的是『深層原因』。"
                        scaffold={['我錯了第 ___ 題', '錯的原因是我搞混了 ___ 和 ___']}
                        rows={3}
                    />

                    <ThinkRecord
                        dataKey="w7-reflect-confused"
                        prompt="2. 最容易搞混的方法"
                        placeholder="例：我最容易搞混觀察法和實驗法。差別在於：實驗會主動操弄變因（給 A 組刺激、B 組不給），觀察只是默默紀錄現有行為，不介入。"
                        scaffold={['我最容易搞混 ___ 和 ___', '差別在於…']}
                        rows={3}
                    />

                    <ThinkRecord
                        dataKey="w7-reflect-insight"
                        prompt="3. 掛號後的新想法"
                        placeholder="幫自己的題目掛號後，我對研究方向有新的想法是……"
                        rows={3}
                    />

                    <ThinkRecord
                        dataKey="w7-reflect-literature"
                        prompt="4. 文獻法的三種用途"
                        placeholder="例：我的題目有可能用到「內容分析」。因為我想分析 IG 貼文裡哪種貼文類型按讚數最高，要把貼文文本分類量化。"
                        scaffold={['我的題目有可能用到 ___（文獻回顧／歷史分析／內容分析）', '因為…']}
                        rows={3}
                    />
                </div>
            ),
        },

        /* ─── Step 5：回顧與繳交 ─── */
        {
            title: '回顧與繳交',
            icon: '📋',
            content: (
                <div className="space-y-8 prose-zh">
                    {/* 檢核清單 */}
                    <div className="bg-white border border-[var(--border)] rounded-[var(--radius-unified)] overflow-hidden">
                        <div className="p-4 px-5 bg-[var(--paper-warm)] border-b border-[var(--border)] font-bold text-[13px]">
                            ✅ 本週結束，你應該要會
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-[1px] bg-[var(--border)]">
                            {[
                                '說出五種研究方法各自的目的與適用情境',
                                '用兩層判斷架構為任何研究題目選定方法',
                                '知道文獻法的三種用途，不把它當成「查資料」',
                                '為你的 W4 題目選出主要方法並說清楚理由',
                            ].map((item, i) => (
                                <div key={i} className="p-4 px-6 bg-white flex items-start gap-3">
                                    <CheckCircle2 size={16} className="text-[var(--success)] mt-0.5 flex-shrink-0" />
                                    <span className="text-[13px] text-[var(--ink-mid)]">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                                        {/* AIRED 敘事紀錄（循序漸進：五欄 → 一段話） */}
                    <AIREDNarrative week="7" hint="判斷研究方法時可能用 AI 測驗" optional={true} />

                    {/* 一鍵複製 */}
                    <ExportButton
                        weekLabel="W7 研究診所"
                        fields={EXPORT_FIELDS}
                        choices={choiceResults}
                    />

                    {/* 遊戲彩蛋 */}
                    <div className="bg-[var(--ink)] border-l-4 border-[var(--danger)] p-6 rounded-r-lg text-white shadow-xl">
                        <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                            <ShieldAlert className="text-[var(--danger)]" size={20} />
                            R.I.B. 單元挑戰：行動代號裝備
                        </h3>
                        <p className="text-[var(--ink-light)] text-sm mb-4">
                            研究方法是探員的裝備——你能在時限內分辨每種方法的適用場景嗎？
                        </p>
                        <Link to="/game/tool-quiz" className="inline-flex items-center gap-2 bg-[var(--danger)] text-white px-4 py-2 rounded font-bold text-sm hover:opacity-90 transition-colors">
                            進入裝備 <ArrowRight size={14} />
                        </Link>
                    </div>

                    {/* 連貫劇情解鎖通知（不穿插；僅告知） */}
                    <div className="border border-[#7C3AED]/40 bg-[#7C3AED]/5 rounded-lg p-4 flex items-start gap-3">
                        <Unlock size={18} className="text-[#7C3AED] flex-shrink-0 mt-0.5" />
                        <div className="text-[13px] text-[var(--ink-mid)] leading-[1.7]">
                            <span className="font-bold text-[var(--ink)] flex items-center gap-1.5 mb-1">
                                <Ghost size={14} className="text-[#7C3AED]" /> R.I.B. 連貫劇情解鎖：《幽靈數據》Ch1-5
                            </span>
                            W2-W7 累積的五種研究方法訓練告一段落，你已具備基本辦案能力。
                            請從左側側邊欄 <strong>🎮 R.I.B. 調查檔案 → 幽靈數據</strong> 進入挑戰。共 5 章，依個人節奏調查即可。
                        </div>
                    </div>

                    {/* 下週預告 */}
                    <div className="next-week-preview">
                        <div className="next-week-header">
                            <span className="next-week-badge">NEXT WEEK</span>
                            <h3 className="next-week-title">W8 預告</h3>
                        </div>
                        <div className="next-week-content">
                            <div className="next-week-col">
                                <div className="next-week-label">W8 主題</div>
                                <p className="next-week-text">研究博覽會：組隊 × 合題 × 企劃書。上半節 Level 2 處方診斷——掛對科之後，工具設計得好不好？下半節分科判斷小考 + 正式組隊。</p>
                            </div>
                            <div className="next-week-col">
                                <div className="next-week-label">你要帶來</div>
                                <p className="next-week-text">確認你的 <strong>W4 定案題目 + 研究方法選擇</strong>。組隊當天需要告訴隊友你的題目和方法。</p>
                            </div>
                        </div>
                    </div>
                </div>
            ),
        },
    ];

    return (
        <div className="page-container animate-in-fade-slide">
            {/* TOP BAR */}
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-4 mb-8 md:mb-12 gap-3">
                <div className="text-[11px] font-mono text-[var(--ink-light)] flex items-center gap-2 min-w-0">
                    <span className="hidden md:inline">研究方法與專題 / 研究規劃 / </span><span className="text-[var(--ink)] font-bold">研究診所 W7</span>
                </div>
                <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
                    <span className="bg-[var(--paper-warm)] text-[var(--ink)] text-[10px] font-bold px-2 py-0.5 rounded-[2px] font-mono">50 MINS</span>
                    <ResetWeekButton weekPrefix="w7-" />
                    <button
                        onClick={() => setShowLessonMap(!showLessonMap)}
                        className="text-[11px] text-[var(--ink-light)] hover:text-[var(--accent)] transition-colors flex items-center gap-1 font-mono"
                    >
                        <Map size={12} /> <span className="hidden md:inline">{showLessonMap ? 'Hide Plan' : 'Instructor View'}</span>
                    </button>
                    <span className="hidden md:inline-block bg-[var(--ink)] text-white text-[10px] font-bold px-2 py-0.5 rounded-[2px] font-mono">AI-RED · D</span>
                </div>
            </div>

            {showLessonMap && (
                <div className="animate-in slide-in-from-top-4 duration-300">
                    <LessonMap data={W7Data} />
                </div>
            )}

            {/* PAGE HEADER — Hero Block */}
            <HeroBlock
                kicker="R.I.B. 調查檔案 · 研究方法與專題 · W7"
                title="研究診所："
                accentTitle="從掛號到判斷"
                subtitle="你的題目適合用什麼方法？今天先認識五種方法，再用兩層判斷架構找出答案，最後用 AI 測驗驗收——結束前你要能說出：我的題目適合用 ___ 法，因為 ___。"
                meta={[
                    { label: '課堂節奏', value: '講義導覽 → AI 測驗 → 判斷題目' },
                    { label: '時長', value: '50 MINS' },
                    { label: '課堂產出', value: '為題目選定研究方法並說明理由' },
                    { label: '帶去 W8', value: '確定題目 + 研究方法 + 準備組隊' },
                ]}
            />
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

            {/* STEP ENGINE */}
            <StepEngine
                steps={steps}
                prevWeek={{ label: '回 W6 文獻偵探社', to: '/w6' }}
                nextWeek={{ label: '前往 W8 組隊決策週', to: '/w8' }}
            flat
            />
        </div>
    );
};
