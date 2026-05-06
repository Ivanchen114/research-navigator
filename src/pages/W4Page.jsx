import React, { useState, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './ClinicPage.css';
import CourseArc from '../components/ui/CourseArc';
import ThinkRecord from '../components/ui/ThinkRecord';
import AIREDNarrative from '../components/ui/AIREDNarrative';
import ThinkChoice from '../components/ui/ThinkChoice';
import StepEngine from '../components/ui/StepEngine';
import HeroBlock from '../components/ui/HeroBlock';
import TaskCard from '../components/ui/TaskCard';
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
} from 'lucide-react';
import LessonMap from '../components/ui/LessonMap';
import BackfillField from '../components/ui/BackfillField';
import { W4Data } from '../data/lessonMaps';

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
        purpose: '把現成文本（論文、史料、報導、書籍、貼文）當成「研究對象」分析它本身——不是自己出去收一手資料。',
        strength: 'W9 會分 4 個子類型細講：② 歷史文獻分析（時間軸推因）／③ 內容分析（編碼計次）／④ 論述分析（話語立場）／⑤ 敘事分析（情節結構）。',
        weakness: '入門最常見的坑是把「文獻分析」和「文獻回顧」搞混——回顧是整理前人說法（每個方法第三章都做，不是主方法）。',
        when: '你的研究材料就是「別人已產生的文本」，而你要分析的是這些文本本身的模式、立場、結構或變化。',
        note: '⚠️ 文獻分析 ≠ 文獻回顧。如果你只想整理前人研究，請把主方法改成問卷／訪談／實驗／觀察，把回顧放第三章。'
    },
];

/* — 兩層判斷架構（互動決策樹用）— */
const DECISION_TREE = {
    l1: {
        question: 'L1 第一層　你的資料，要自己去收集，還是分析已存在的文本？',
        options: [
            {
                id: 'collect',
                icon: '🔍',
                label: '自己去收集',
                sub: '你的資料目前還不存在，要自己出門問人／觀察／做實驗。',
                next: 'l2',
            },
            {
                id: 'literature',
                icon: '📚',
                label: '分析已有文本',
                sub: '把文獻當「研究對象」來分析它（不是整理前人說法）。',
                terminal: true,
                method: { name: '文獻分析法', icon: '📚', color: '#6b21a8' },
                subtypes: [
                    { num: '②', name: '歷史文獻分析', when: '從史料切時間軸、追問「為什麼」' },
                    { num: '③', name: '內容分析', when: '統計文本中詞彙／主題的頻率（量化）' },
                    { num: '④', name: '論述分析', when: '看話語怎麼建構立場、誰被說／怎麼被說' },
                    { num: '⑤', name: '敘事分析', when: '從文本抓情節結構、角色、轉折' },
                ],
            },
        ],
    },
    l2: {
        question: 'L2 第二層　自己收集的話，三題獨立判斷（挑最貼近你題目的那條）',
        items: [
            {
                id: 'q1',
                num: '❶',
                q: '你想知道的是「比例／數量／趨勢」，還是「原因／脈絡／故事」？',
                options: [
                    { label: '比例／數量／趨勢', method: { name: '問卷', icon: '📋', color: 'var(--accent)' } },
                    { label: '原因／脈絡／故事', method: { name: '訪談', icon: '🎤', color: '#7c3aed' } },
                ],
            },
            {
                id: 'q2',
                num: '❷',
                q: '你能不能主動改變一個條件，然後量另一個怎麼變？',
                options: [
                    { label: '能操控（A 組做、B 組不做）', method: { name: '實驗', icon: '🧪', color: '#d97706' } },
                    { label: '不能操控', method: { name: '排除實驗 → 回 ❶ 或 ❸ 判斷', icon: '↩️', color: 'var(--ink-light)', isFallback: true } },
                ],
            },
            {
                id: 'q3',
                num: '❸',
                q: '你想抓「真實行為／自然現象」，還是「人的想法態度」？',
                options: [
                    { label: '真實行為／自然現象', method: { name: '觀察', icon: '👀', color: 'var(--success)' } },
                    { label: '想法態度', method: { name: '📋 問卷 / 🎤 訪談（回 ❶）', icon: '🔁', color: 'var(--ink-light)', isFallback: true } },
                ],
            },
        ],
        note: '一個題目可以有主方法 + 輔助方法。三題不必都答——挑最貼近你研究目的的那一條。',
    },
    scienceNote: {
        icon: '🌱',
        title: '自然科學分流（理化、生物、地科…）',
        body: '研究對象不是人——例如「球從多高落下回彈高度」「植物澆水量對生長的影響」——L2 ❸ 的「真實行為／自然現象」就是這類。常見組合：👀 觀察（記錄真實現象）+ 🧪 實驗（主動操控條件，量另一個怎麼變）。',
    },
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
    { key: 'w4-my-topic', label: '我的 W4 定案題目' },
    { key: 'w4-layer1', label: '第一層判斷', question: '我的資料要自己收集，還是分析已有文本？' },
    { key: 'w4-layer2', label: '第二層判斷', question: '最關鍵的那一條分科問題，以及我的回答' },
    { key: 'w4-main-method', label: '我選定的主要方法', question: '問卷/訪談/實驗/觀察/文獻？' },
    { key: 'w4-reason', label: '選擇理由', question: '為什麼選這個方法？請引用兩層判斷中的某一條' },
    { key: 'w4-aux-method', label: '輔助方法', question: '需要輔助方法嗎？是什麼？為什麼？' },
    { key: 'w4-reflect-confused', label: '反思 1：最易搞混的方法', question: '你最容易搞混的兩種方法是哪兩個？關鍵差別在哪一條兩層判斷？' },
    { key: 'w4-reflect-literature', label: '反思 2：文獻 vs 文獻分析', question: '「文獻回顧」與「文獻分析法」的差別是什麼？你的題目會走哪一條？' },
    { key: 'w4-aired-record', label: 'AI-RED 敘事紀錄', question: '本週最重要的一次 AI 互動（A-I-R-E-D 五要素）' },
];

/* ══════════════════════════════════════
 *  互動決策樹組件
 * ══════════════════════════════════════ */

const DecisionTree = () => {
    const [l1Choice, setL1Choice] = useState(null);
    const [l2Picks, setL2Picks] = useState({}); // { q1: 0|1, q2: 0|1, q3: 0|1 }

    const reset = () => {
        setL1Choice(null);
        setL2Picks({});
    };

    const pickL2 = (qid, idx) => {
        setL2Picks(prev => ({ ...prev, [qid]: idx }));
    };

    /* 統整推薦：找出有效（非 fallback）的方法 */
    const synthesis = (() => {
        if (l1Choice === 'literature') {
            return { primary: { name: '文獻分析法', icon: '📚' }, support: [], note: '主方法 = 📚 文獻分析法。W9 會挑一個子類型細講（② 歷史 / ③ 內容 / ④ 論述 / ⑤ 敘事）。' };
        }
        if (l1Choice === 'collect') {
            const valids = [];
            DECISION_TREE.l2.items.forEach(item => {
                const idx = l2Picks[item.id];
                if (idx === undefined) return;
                const m = item.options[idx].method;
                if (!m.isFallback) valids.push(m);
            });
            if (valids.length === 0) return null;
            const [primary, ...rest] = valids;
            const seen = new Set([primary.name]);
            const support = rest.filter(m => !seen.has(m.name) && (seen.add(m.name), true));
            return {
                primary,
                support,
                note: support.length
                    ? `主方法 ${primary.icon} ${primary.name}　+ 輔助方法 ${support.map(m => m.icon + ' ' + m.name).join('、')}`
                    : `建議方法：${primary.icon} ${primary.name}`,
            };
        }
        return null;
    })();

    /* SVG 樹高亮邏輯 */
    const dimLeft = l1Choice === 'literature';
    const dimRight = l1Choice === 'collect';

    /* L2 葉節點（SVG 子組件）*/
    const Leaf = ({ qid, idx, x, y, w, h, label, method, color, fallback }) => {
        const picked = l2Picks[qid];
        const isPicked = picked === idx;
        const dimmed = picked !== undefined && !isPicked;
        return (
            <g
                style={{ cursor: 'pointer' }}
                onClick={() => pickL2(qid, idx)}
                opacity={dimmed ? 0.35 : 1}
            >
                <rect
                    x={x} y={y} width={w} height={h} rx={6}
                    fill={isPicked ? '#fff' : (fallback ? '#f5f3f0' : '#fff')}
                    stroke={isPicked ? color : '#bbb'}
                    strokeWidth={isPicked ? 2.5 : 1.5}
                />
                <text x={x + 12} y={y + 17} fontSize="11" fill="#666">{label}</text>
                <text x={x + 12} y={y + 34} fontSize="12.5" fontWeight="bold" fill={color}>→ {method}</text>
            </g>
        );
    };

    return (
        <div className="rounded-[var(--radius-unified)] border-2 border-[var(--ink)] overflow-hidden bg-white">
            {/* Header */}
            <div className="flex items-center gap-3 px-5 py-3 bg-[var(--ink)] text-white">
                <Activity size={18} />
                <span className="font-bold text-[14px]">🌳 兩層判斷　·　決策樹</span>
                <span className="ml-auto text-[10px] font-mono text-[var(--ink-light)] hidden sm:inline">點選節點 → 看路徑</span>
                {(l1Choice || Object.keys(l2Picks).length > 0) && (
                    <button
                        onClick={reset}
                        className="ml-2 text-[11px] text-[var(--ink-light)] hover:text-white flex items-center gap-1 font-mono"
                    >
                        <RefreshCw size={11} /> 重來
                    </button>
                )}
            </div>

            {/* SVG 視覺樹 */}
            <div className="bg-[var(--paper-warm)] p-4 overflow-x-auto">
                <svg
                    viewBox="0 0 920 580"
                    className="block mx-auto"
                    style={{ width: '100%', minWidth: '720px', maxWidth: '820px', height: 'auto' }}
                >
                    {/* ============ 連線 ============ */}
                    <path d="M 440 60 C 440 95, 270 100, 270 130" stroke={dimLeft ? '#ddd' : '#666'} strokeWidth="2" fill="none" />
                    <path d="M 440 60 C 440 95, 610 100, 610 130" stroke={dimRight ? '#ddd' : '#666'} strokeWidth="2" fill="none" />
                    <line x1="270" y1="180" x2="270" y2="200" stroke={dimLeft ? '#ddd' : '#666'} strokeWidth="2" />
                    <line x1="650" y1="180" x2="650" y2="200" stroke={dimRight ? '#ddd' : '#666'} strokeWidth="2" />
                    {[267, 381, 495].map((qy, i) => (
                        <g key={i} opacity={dimLeft ? 0.3 : 1}>
                            <line x1="130" y1={qy} x2="130" y2={qy + 19} stroke="#999" strokeWidth="1.5" />
                            <line x1="370" y1={qy} x2="370" y2={qy + 19} stroke="#999" strokeWidth="1.5" />
                        </g>
                    ))}
                    <line x1="650" y1="252" x2="650" y2="266" stroke={dimRight ? '#ddd' : '#6b21a8'} strokeWidth="2" />

                    {/* ============ ROOT ============ */}
                    <g>
                        <rect x={345} y={15} width={190} height={48} rx={10} fill="var(--ink)" />
                        <text x={440} y={45} fontSize="14" fill="white" fontWeight="bold" textAnchor="middle">
                            📍 你的資料要哪來？
                        </text>
                    </g>

                    {/* ============ L1 左：自蒐 ============ */}
                    <g
                        style={{ cursor: 'pointer' }}
                        onClick={() => { setL1Choice(l1Choice === 'collect' ? null : 'collect'); setL2Picks({}); }}
                        opacity={dimLeft ? 0.4 : 1}
                    >
                        <rect
                            x={170} y={130} width={200} height={50} rx={8}
                            fill={l1Choice === 'collect' ? 'var(--accent-light)' : 'white'}
                            stroke={l1Choice === 'collect' ? 'var(--accent)' : '#666'}
                            strokeWidth={l1Choice === 'collect' ? 2.5 : 1.5}
                        />
                        <text x={270} y={155} fontSize="14" fontWeight="bold" textAnchor="middle" fill="var(--ink)">
                            🔍 自己收集
                        </text>
                        <text x={270} y={172} fontSize="10.5" textAnchor="middle" fill="#666">
                            問人 / 觀察 / 做實驗
                        </text>
                    </g>

                    {/* ============ L1 右：文獻 ============ */}
                    <g
                        style={{ cursor: 'pointer' }}
                        onClick={() => { setL1Choice(l1Choice === 'literature' ? null : 'literature'); setL2Picks({}); }}
                        opacity={dimRight ? 0.4 : 1}
                    >
                        <rect
                            x={550} y={130} width={200} height={50} rx={8}
                            fill={l1Choice === 'literature' ? '#f5f3ff' : 'white'}
                            stroke={l1Choice === 'literature' ? '#6b21a8' : '#666'}
                            strokeWidth={l1Choice === 'literature' ? 2.5 : 1.5}
                        />
                        <text x={650} y={155} fontSize="14" fontWeight="bold" textAnchor="middle" fill="var(--ink)">
                            📚 分析現成文本
                        </text>
                        <text x={650} y={172} fontSize="10.5" textAnchor="middle" fill="#666">
                            把文本當研究對象
                        </text>
                    </g>

                    {/* ============ L2 三題分流（左半）============ */}
                    <g opacity={dimLeft ? 0.35 : 1}>
                        <text x={20} y={216} fontSize="11" fontWeight="bold" fill="#999" letterSpacing="0.5">
                            L2 第二層 — 三題獨立分流（挑最貼近你題目的那條）
                        </text>

                        {/* Q1 */}
                        <rect x={20} y={234} width={460} height={32} rx={6} fill="#fff" stroke="#bbb" strokeWidth="1.5" />
                        <text x={32} y={255} fontSize="12.5" fontWeight="bold" fill="var(--ink)">
                            ❶ 比例／數量／趨勢　vs　原因／脈絡／故事？
                        </text>
                        <Leaf qid="q1" idx={0} x={20} y={286} w={220} h={42} label="比例／數量／趨勢" method="📋 問卷" color="var(--accent)" />
                        <Leaf qid="q1" idx={1} x={260} y={286} w={220} h={42} label="原因／脈絡／故事" method="🎤 訪談" color="#7c3aed" />

                        {/* Q2 */}
                        <rect x={20} y={348} width={460} height={32} rx={6} fill="#fff" stroke="#bbb" strokeWidth="1.5" />
                        <text x={32} y={369} fontSize="12.5" fontWeight="bold" fill="var(--ink)">
                            ❷ 能不能主動改一個條件，量另一個怎麼變？
                        </text>
                        <Leaf qid="q2" idx={0} x={20} y={400} w={220} h={42} label="能操控（A 做、B 不做）" method="🧪 實驗" color="#d97706" />
                        <Leaf qid="q2" idx={1} x={260} y={400} w={220} h={42} label="不能操控" method="↩ 回 ❶／❸" color="#888" fallback />

                        {/* Q3 */}
                        <rect x={20} y={462} width={460} height={32} rx={6} fill="#fff" stroke="#bbb" strokeWidth="1.5" />
                        <text x={32} y={483} fontSize="12.5" fontWeight="bold" fill="var(--ink)">
                            ❸ 真實行為／自然現象　vs　想法態度？
                        </text>
                        <Leaf qid="q3" idx={0} x={20} y={514} w={220} h={42} label="真實行為／自然現象" method="👀 觀察" color="var(--success)" />
                        <Leaf qid="q3" idx={1} x={260} y={514} w={220} h={42} label="想法態度" method="📋／🎤（回 ❶）" color="#888" fallback />
                    </g>

                    {/* ============ 文獻分支（右半）============ */}
                    <g opacity={dimRight ? 0.35 : 1}>
                        <rect x={540} y={210} width={220} height={42} rx={8}
                              fill={l1Choice === 'literature' ? '#f5f3ff' : 'white'}
                              stroke="#6b21a8" strokeWidth="2" />
                        <text x={650} y={236} fontSize="13" fontWeight="bold" textAnchor="middle" fill="#6b21a8">
                            📚 文獻分析法（主方法）
                        </text>

                        {[
                            { num: '②', name: '歷史文獻分析', when: '從史料切時間軸、追問「為什麼」', y: 270 },
                            { num: '③', name: '內容分析',     when: '統計文本中詞彙／主題的頻率（量化）', y: 324 },
                            { num: '④', name: '論述分析',     when: '看話語怎麼建構立場、誰被說／怎麼被說', y: 378 },
                            { num: '⑤', name: '敘事分析',     when: '從文本抓情節結構、角色、轉折', y: 432 },
                        ].map(s => (
                            <g key={s.num}>
                                <rect x={500} y={s.y} width={400} height={44} rx={6} fill="white" stroke="#e0d5f5" strokeWidth="1.5" />
                                <text x={516} y={s.y + 22} fontSize="14" fontWeight="bold" fill="#6b21a8">{s.num}</text>
                                <text x={540} y={s.y + 22} fontSize="13" fontWeight="bold" fill="#6b21a8">{s.name}</text>
                                <text x={516} y={s.y + 38} fontSize="10.5" fill="#666">→ {s.when}</text>
                            </g>
                        ))}
                        <text x={500} y={500} fontSize="10" fill="#999" fontStyle="italic">
                            （W9 計畫書與工具會挑一個子類型細講分析架構）
                        </text>
                    </g>
                </svg>

                {/* ⚠️ 文獻分析 vs 回顧 警示（從 SVG 內拉出，避免擠到子類型） */}
                <div className="mx-5 mt-3 mb-1 bg-[#FEF3C7] border-l-4 border-[#D97706] rounded-r-[6px] p-3">
                    <p className="text-[12.5px] font-bold text-[#7F1D1D] mb-0.5">⚠️ 文獻「分析」≠ 文獻「回顧」</p>
                    <p className="text-[11.5px] text-[#7F1D1D] leading-relaxed">
                        <strong>回顧</strong> = 整理前人說法（每個方法第三章都做，不算主方法）；
                        <strong>分析</strong> = 把文本當研究對象（只有文獻組要做）。
                    </p>
                </div>
            </div>

            {/* 自然科學分流卡 + 統整推薦（HTML） */}
            <div className="px-5 py-4 space-y-3 border-t border-[var(--border)]">
                <div className="bg-[#ecfdf5] border-l-4 border-[var(--success)] p-3 rounded-r-[6px]">
                    <p className="text-[12px] font-bold text-[#065f46] mb-1">
                        🌱 自然科學分流（理化、生物、地科…）
                    </p>
                    <p className="text-[12px] text-[#065f46] leading-relaxed">
                        研究對象不是人——例如「球從多高落下回彈高度」「植物澆水量對生長的影響」——L2 ❸ 走「真實行為／自然現象」。常見組合：👀 觀察（記錄真實現象）+ 🧪 實驗（主動操控條件，量另一個怎麼變）。
                    </p>
                </div>

                {synthesis && (
                    <div className="animate-in slide-in-from-top-2 duration-200 bg-[var(--ink)] text-white rounded-[var(--radius-unified)] p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Trophy size={16} className="text-[var(--gold)]" />
                            <span className="font-bold text-[13px]">建議方法（依你目前點選）</span>
                        </div>
                        <p className="text-[13.5px] text-white leading-relaxed">{synthesis.note}</p>
                        {l1Choice === 'collect' && Object.keys(l2Picks).length === 0 && (
                            <p className="text-[11px] text-[var(--ink-light)] mt-2">
                                還沒選 L2 任一葉節點——點圖上 L2 三題裡最貼近你題目的那條兩個方塊之一。
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

/* ══════════════════════════════════════
 *  主元件
 * ══════════════════════════════════════ */

export const W4Page = () => {
    const [showLessonMap, setShowLessonMap] = useState(false);
    const [expandedMethod, setExpandedMethod] = useState(null);
    const [choiceResults, setChoiceResults] = useState([]);

    /* Quiz state */
    const [quizStarted, setQuizStarted] = useState(false);
    const [currentQ, setCurrentQ] = useState(0);
    const [selections, setSelections] = useState({});
    const [quizDone, setQuizDone] = useState(false);

    /* W3 定案題目帶入（讓 W4 把它放上方法地圖）*/
    const [w3Topic, setW3Topic] = useState('');

    useEffect(() => {
        const refresh = () => {
            const saved = readRecords();
            const topic = saved['w3-final-topic']?.trim();
            if (topic) {
                setW3Topic(topic);
                // auto-fill w4-my-topic if empty
                if (!saved['w4-my-topic']?.trim()) {
                    const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
                    all['w4-my-topic'] = topic;
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
                }
            } else {
                setW3Topic('');
            }
        };
        refresh();
        window.addEventListener('focus', refresh);
        return () => window.removeEventListener('focus', refresh);
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

                    {/* 兩層判斷　·　互動決策樹 */}
                    <DecisionTree />

                    {/* 理解檢核 1 */}
                    <ThinkChoice
                        dataKey="w4-tc1"
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
                        dataKey="w4-tc2"
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

        /* ─── Step 3：為自己題目選路 ─── */
        {
            title: '為自己題目選路',
            icon: '🧭',
            content: (
                <div className="space-y-6 prose-zh">
                    <p className="text-[14px] text-[var(--ink-mid)] leading-relaxed max-w-[720px]">
                        把剛學到的兩層判斷用在你真實的研究題目上。這才是今天最重要的事。
                    </p>

                    {/* W3 帶入卡（有 → 自動帶入；沒 → 現場補上）*/}
                    {w3Topic ? (
                        <div className="flex items-start gap-3 px-4 py-3 rounded-[var(--radius-unified)] bg-[var(--accent-light)] border border-[var(--accent)] text-[13px]">
                            <span className="text-[16px]">📎</span>
                            <div>
                                <span className="font-bold text-[var(--accent)]">自動帶入 W3 定案題目</span>
                                <p className="text-[var(--ink-mid)] mt-0.5">{w3Topic}</p>
                            </div>
                        </div>
                    ) : (
                        <BackfillField
                            dataKey="w3-final-topic"
                            label="⚠️ 沒偵測到你 W3 的定案題目——把你上週寫的研究題目貼這裡，下方自動帶入。"
                            placeholder="例：本校高一段考前一週的夜間滑手機時數與翌日專注力自評之相關性"
                            buttonLabel="補上 W3 題目"
                        />
                    )}

                    {/* 我的本週題目（從 W3 帶入，可微調）*/}
                    <ThinkRecord
                        dataKey="w4-my-topic"
                        prompt="我這週要選方法的題目"
                        placeholder="貼上或輸入你在 W3 定案的研究題目…"
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
                        dataKey="w4-layer1"
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
                        dataKey="w4-layer2"
                        prompt="第二層判斷"
                        placeholder="最關鍵的那一條分科問題是 ❶/❷/❸，我的回答是……"
                        rows={3}
                    />

                    {/* 主要方法 */}
                    <ThinkRecord
                        dataKey="w4-main-method"
                        prompt="我選定的主要方法"
                        placeholder="問卷/訪談/實驗/觀察/文獻（如果是文獻，請寫明用途：文獻回顧/歷史分析/內容分析）"
                        rows={2}
                    />

                    <ThinkRecord
                        dataKey="w4-reason"
                        prompt="選擇理由（請引用兩層判斷中的某一條）"
                        placeholder="例：我選訪談法。因為我的核心問題問的是『學生為什麼考前才去圖書館』——要的是深層原因，對應兩層判斷的第 ❶ 條（要原因/脈絡）。"
                        scaffold={['我選 ___ 法', '因為我的核心問題問的是…', '對應兩層判斷的第 ___ 條']}
                        rows={3}
                    />

                    <ThinkRecord
                        dataKey="w4-aux-method"
                        prompt="輔助方法（如果需要）"
                        placeholder="例：不需要。  或：需要問卷法做輔助，因為訪談 8 人不夠看分布，先用問卷掃 100 人找趨勢。"
                        scaffold={['不需要', '（若需要）需要 ___ 法做輔助，因為…']}
                        rows={2}
                    />

                    {/* 同儕挑戰：對 Step 3 的方法選擇做挑戰 */}
                    <div className="w6-notice w6-notice-gold">
                        🎯 寫完方法選擇後，跟旁邊的人說一遍：「我用 ___ 法，因為 ___」。讓對方挑戰你：「你要的真的是比例還是原因？」「資料是自己收集還是分析別人寫的？」「如果是問卷，題目問的是什麼，問卷能回答嗎？」
                    </div>

                    {/* ➡️ 下週預告：W5 操作型定義 */}
                    <div className="w6-notice w6-notice-gold">
                        ➡️ 方法選好了——但選了方法不等於知道「怎麼問／怎麼測」。<strong>下週 W5</strong> 會教你把抽象概念（壓力、學習效果、動機……）變成「誰來測都得到一樣的數字／類別」的<strong>操作型定義</strong>，那是這週題目→下週工具的橋。
                    </div>
                </div>
            ),
        },

        /* ─── Step 4：反思（兩題最關鍵的） ─── */
        {
            title: '反思',
            icon: '💭',
            content: (
                <div className="space-y-6 prose-zh">
                    <p className="text-[14px] text-[var(--ink-mid)] leading-relaxed max-w-[720px]">
                        這週只回答兩題——但都要寫到「自己也能說服自己」為止。這兩題是這週能不能真的會選方法的分水嶺。
                    </p>

                    <ThinkRecord
                        dataKey="w4-reflect-confused"
                        prompt="1. 你最容易搞混的兩種方法是哪兩個？關鍵差別在哪一條兩層判斷？"
                        placeholder="例：我最容易搞混觀察法和實驗法。差別在 L2 ❷——實驗會主動改變一個條件再量結果，觀察只是默默紀錄真實行為，不介入。"
                        scaffold={['我最容易搞混 ___ 和 ___', '關鍵差別在 L2 第 ___ 條（❶／❷／❸）', '具體是…']}
                        rows={4}
                    />

                    <ThinkRecord
                        dataKey="w4-reflect-literature"
                        prompt="2. 「文獻回顧」與「文獻分析法」的差別是什麼？你的題目會走哪一條？"
                        placeholder="例：文獻回顧是整理前人研究（每個方法第三章都做），文獻分析是把文本當研究對象。我的題目走『文獻分析』，因為我想分析 IG 貼文標題的用詞模式，會走 ③ 內容分析子類型。"
                        scaffold={['「文獻回顧」是 ___（用途）', '「文獻分析」是 ___（用途）', '我的題目走 ___（回顧 / 分析）', '（若走分析）子類型可能是 ___（② 歷史 / ③ 內容 / ④ 論述 / ⑤ 敘事）']}
                        rows={5}
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
                                '分得出「文獻回顧」與「文獻分析法」的差別（W9 細講 4 子類型）',
                                '為你的 W3 定案題目選出主要方法並說清楚理由',
                            ].map((item, i) => (
                                <div key={i} className="p-4 px-6 bg-white flex items-start gap-3">
                                    <CheckCircle2 size={16} className="text-[var(--success)] mt-0.5 flex-shrink-0" />
                                    <span className="text-[13px] text-[var(--ink-mid)]">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                                        {/* AIRED 敘事紀錄（循序漸進：五欄 → 一段話） */}
                    <AIREDNarrative week="4" hint="判斷研究方法時可能用 AI 測驗" optional={true} />

                    {/* 一鍵複製 */}
                    <ExportButton
                        weekLabel="W4 認識 5 法 + 選方法"
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

                    {/* 下週預告 */}
                    <div className="next-week-preview">
                        <div className="next-week-header">
                            <span className="next-week-badge">NEXT WEEK</span>
                            <h3 className="next-week-title">W5 預告</h3>
                        </div>
                        <div className="next-week-content">
                            <div className="next-week-col">
                                <div className="next-week-label">W5 主題</div>
                                <p className="next-week-text">操作型定義專週——把這週選定的方法接到「具體可測的指標」。學「壓力／動機／學習效果」這類抽象概念怎麼變成「誰來測都得到一樣數字」的測量項目，是這週題目→下週博覽會的橋。</p>
                            </div>
                            <div className="next-week-col">
                                <div className="next-week-label">你要帶來</div>
                                <p className="next-week-text">這週寫下的<strong>主要方法 + 選擇理由</strong>，下週要把核心概念拆成可測指標。沒選好方法的同學請先回頭把 Step 3 完成。</p>
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
                    <span className="hidden md:inline">研究方法與專題 / 研究規劃 / </span><span className="text-[var(--ink)] font-bold">方法地圖 W4</span>
                </div>
                <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
                    <span className="bg-[var(--paper-warm)] text-[var(--ink)] text-[10px] font-bold px-2 py-0.5 rounded-[2px] font-mono">50 MINS</span>
                    <ResetWeekButton weekPrefix="w4-" />
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
                    <LessonMap data={W4Data} />
                </div>
            )}

            {/* PAGE HEADER — Hero Block */}
            <HeroBlock
                kicker="R.I.B. 調查檔案 · 研究方法與專題 · W4"
                title="方法地圖："
                accentTitle="從題目找方法"
                subtitle="你的題目適合用什麼方法？今天先認識五種方法，再用兩層判斷的互動決策樹推理，最後用 10 題 AI 測驗驗收——結束前你要能說出：我的題目適合用 ___ 法，因為 ___。"
                chain="W3 你決定了題目——但「題目」不會自動變成「資料」。這週把你的題目放上方法地圖，做一個決定：要用哪一種方法去收／去問／去看？"
                meta={[
                    { label: '課堂節奏', value: '五種方法 → 互動決策樹 → AI 測驗 → 為自己題目選路' },
                    { label: '時長', value: '50 MINS' },
                    { label: '課堂產出', value: '為題目選定主要方法（+ 輔助方法）並寫出理由' },
                    { label: '帶去 W5', value: '主要方法 + 選擇理由（W5 操作型定義要用）' },
                ]}
            />
            <CourseArc items={[
                    { wk: 'W1-W2', name: '探索階段\nRED 公約', status: 'past' },
                    { wk: 'W3', name: '題目決定\n8 病症會診', status: 'past' },
                    { wk: 'W4', name: '認識方法\n兩層判斷', status: 'now' },
                    { wk: 'W5', name: '操作型定義\n概念變可測' },
                    { wk: 'W6', name: '博覽會\n組隊（含 Solo）' },
                    { wk: 'W7-W8', name: '文獻偵探\n引用寫作' },
                    { wk: 'W9-W11', name: '工具設計\n倫理審查' },
                    { wk: 'W13-W17', name: '數據解讀\n發表' }
                ]} />

            <TaskCard
                weekNumber="W4"
                weekTitle={W4Data.title}
                duration={`${W4Data.duration} 分鐘 · ${W4Data.durationDesc}`}
                tasks={[
                    '認識 5 種研究方法（問卷／訪談／實驗／觀察／文獻）',
                    '兩層判斷練習 — L1 自蒐／文獻分流，L2 三題分科',
                    '為自己 W3 定案題目選主方法 + 寫一句理由',
                ]}
                exportReminder="匯出方法選擇紀錄 → W5 直接拿主方法做操作型定義"
            />

            {/* STEP ENGINE */}
            <StepEngine
                steps={steps}
                prevWeek={{ label: '回 W3 題目決定', to: '/w3' }}
                nextWeek={{ label: '前往 W5 操作型定義', to: '/w5' }}
            flat
            />
        </div>
    );
};
