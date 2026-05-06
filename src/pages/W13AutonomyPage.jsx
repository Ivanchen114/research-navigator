import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import CourseArc from '../components/ui/CourseArc';
import HeroBlock from '../components/ui/HeroBlock';
import TaskCard from '../components/ui/TaskCard';
import { W13Data } from '../data/lessonMaps';
import ThinkRecord from '../components/ui/ThinkRecord';
import Checklist from '../components/ui/Checklist';
import PromptBlock from '../components/ui/PromptBlock';
import StepEngine from '../components/ui/StepEngine';
import ExportButton from '../components/ui/ExportButton';
import ResetWeekButton from '../components/ui/ResetWeekButton';
import AIREDNarrative from '../components/ui/AIREDNarrative';
import AICollaborationPrinciples from '../components/ui/AICollaborationPrinciples';
import AIDialogSubmission from '../components/ui/AIDialogSubmission';
import AIModePicker from '../components/ui/AIModePicker';
import { readRecords } from '../components/ui/ThinkRecord';
import {
    Database,
    Brain,
    Route,
    FileCheck,
    ArrowRight,
    Coffee,
    AlertTriangle,
    Flame,
    ClipboardCheck,
    Bot,
    Hand,
    ShieldAlert,
} from 'lucide-react';

/* ══════════════════════════════════════
 *  資料常數
 * ══════════════════════════════════════ */

/* 5 法 原始資料 → 分析表 對照 */
const METHOD_TABLE = [
    {
        id: 'survey',
        emoji: '📋',
        name: '問卷法',
        rawSrc: 'Google Forms 後台回應 / 紙本',
        rawState: '⚠️ 還沒整理',
        targetTable: '一張「題號（欄）× 樣本（列）」的乾淨表',
        steps: '匯出 CSV → 刪無效樣本 → 變項代碼化 → 標 N',
        accent: '#2563EB',
        example: {
            topic: '高中生手機使用調查',
            raw: `時間戳記              姓名      Q1每天用幾小時   Q2主要用途
2026/4/15 14:23   小明      4-6 小時         娛樂(看影片)
2026/4/15 14:30   阿美      2-4 小時         社交
2026/4/15 14:32   小華      6 小時以上       娛樂+社交
2026/4/15 14:40   阿翔      （沒填）         （沒填）  ← 無效樣本`,
            table: `樣本編號  性別  年級   Q1代碼    Q2_娛樂  Q2_社交  Q2_學習
S001     M    高一    3(4-6h)   1        0        0
S002     F    高二    2(2-4h)   0        1        0
S003     F    高一    4(6h+)    1        1        0
N=85（已扣除 4 份無效）`,
        },
    },
    {
        id: 'interview',
        emoji: '🎤',
        name: '訪談法',
        rawSrc: '錄音 / 逐字稿',
        rawState: '❌ 完全沒整理',
        targetTable: '主題編碼表「議題（欄）× 受訪者（列）× 出現次數」',
        steps: '逐字稿 → 主題編碼 → 統計各議題出現頻次',
        accent: '#7C3AED',
        example: {
            topic: '高中生補習動機',
            raw: `受訪者 A（03:42）：「我媽都說補習是為我好，但我
其實覺得是同學都在補，所以我也不能不補……」

受訪者 B（07:15）：「補習老實講就是一種習慣啦，從
國中就這樣，我也沒想過為什麼。」

受訪者 C（02:30）：「我自己想補的，因為數學真的很爛
不補考不好。」`,
            table: `受訪者  家長期待  同儕壓力  習慣性  自我需求
A       2 次     1 次     0       0
B       0       0        2       0
C       1       0        1       1
N=6 位受訪者

📌 編碼規則：本範例計「次數」（同一人提 2 次=2）。
若改計「人數」（同一人提 5 次仍算 1 人），表格內值改為 0/1。
研究時自己決定，並在編碼規則中寫明——通常質性訪談用人數、量化頻率分析用次數。`,
        },
    },
    {
        id: 'experiment',
        emoji: '🧪',
        name: '實驗法',
        rawSrc: '實驗紀錄表 docx',
        rawState: '⚠️ 還沒整理',
        targetTable: '「組別 × 變項 × 數值」結果表（前測/後測）',
        steps: '紀錄抽出 → 結構化 → 計算組別均值/差值',
        accent: '#059669',
        example: {
            topic: '背景音樂對記憶測驗的影響',
            raw: `2026/4/15 第一節（手寫紀錄）
小明（音樂組）前測 75，後測 82
小華（安靜組）前測 80，後測 85
小美（音樂組）前測 65，後測 70
（散頁手寫，數字部分潦草）`,
            table: `受試者  組別      前測  後測  差值
P01    音樂組    75    82    +7
P02    安靜組    80    85    +5
P03    音樂組    65    70    +5
...
組別均值差：音樂 +6.2 / 安靜 +4.8
N=24（音樂 12 + 安靜 12）`,
        },
    },
    {
        id: 'observation',
        emoji: '👀',
        name: '觀察法',
        rawSrc: '04_觀察紀錄表.xlsx（多份）',
        rawState: '⚠️ 半結構化（還要彙整）',
        targetTable: '彙整成「行為類別 × 次數/時間」總表',
        steps: '多份紀錄 → 行為類別合併 → 加總頻次',
        accent: '#D97706',
        example: {
            topic: '高一自習課專注行為',
            raw: `2026/4/15 第六節（第一次觀察）
13:30 - 小組 A：書寫
13:35 - 小組 A：滑手機
13:40 - 小組 A：組內聊天
13:45 - 小組 A：書寫
（共 4 節，30 次取樣 × 4）`,
            table: `行為類別     第一節  第二節  第三節  第四節  總次數
書寫專注     8       5       6       4       23 (19%)
滑手機       12      14      11      13      50 (42%)
組內聊天     6       8       9       7       30 (25%)
其他         4       3       4       6       17 (14%)
N=4 節 × 30 次取樣 = 120 筆`,
        },
    },
    {
        id: 'literature',
        emoji: '📚',
        name: '文獻分析法',
        rawSrc: '05a-d 編碼表.xlsx',
        rawState: '⚠️ 半結構化（還要彙整）',
        targetTable: '彙整成可視化用表（時間軸 / 立場分布 / 詞頻）',
        steps: '多份編碼 → 主題彙整 → 製作分析欄位',
        accent: '#DC2626',
        example: {
            topic: 'YouTuber 影片標題吸睛策略分析',
            raw: `05a 編碼表（單篇）
標題：「我吃了 100 個漢堡會怎樣？！瘋狂挑戰！」
作者：A 頻道
日期：2026/3/15
觀看數：120 萬`,
            table: `標題編號  作者     數字  情緒詞   問句  驚嘆號  觀看(萬)
T001     A 頻道   有    瘋狂     有    !!     120
T002     B 頻道   無    驚人     無    無      45
T003     A 頻道   有    無       有    !       89
...
含數字+情緒詞+問句的標題平均觀看數=A 頻道風格
N=20 部影片`,
        },
    },
];

/* AI 整理的三大風險（直接告訴學生） */
const AI_RISKS = [
    {
        title: '幻覺',
        emoji: '👻',
        body: 'AI 會自動「補」沒有的資料、虛構引用語錄、編造你沒提過的類別。看起來合理，實際上是憑空生成。',
        safeguard: '對照 raw 逐筆驗收，特別是 AI 加上去你沒輸入的東西。',
    },
    {
        title: '跑偏',
        emoji: '🧭',
        body: 'AI 會用它「以為」的研究框架整理，不是你的。例如你研究「同儕壓力」，AI 全歸到「家庭壓力」。',
        safeguard: '事先寫清楚編碼類別 / 變項定義給 AI，要求嚴格分類。',
    },
    {
        title: '掏空判斷',
        emoji: '🪤',
        body: '訪談、文獻組的「分類」就是研究本身。全外包等於 AI 做研究、你變成驗收員——研究不是你做的。',
        safeguard: '訪談、文獻組必須自己定義分類框架，AI 只能填內容。',
    },
];

/* AI 能與不能的對照 */
const AI_CAN_DO = [
    '把 CSV 清理乾淨（刪空白、統一格式）',
    '依你的規則計算（差值、均值、頻次）',
    '套用你定義的分類規則做初步編碼',
    '統一命名（如「滑手機」「玩手機」合併）',
    '彙整多份檔案成一張總表',
];

const AI_CANNOT_DO = [
    '幫你決定研究問題對應哪些變項',
    '幫你定義主題編碼類別 / 行為類別',
    '幫你判斷哪筆樣本算「無效」',
    '替你讀懂訪談裡的語氣、情境、潛台詞',
    '保證沒有幻覺——你不驗收就是賭運氣',
];

/* 兩條路線 */
const ROUTES = [
    {
        id: 'manual',
        emoji: '🧑',
        title: '路線 A · 純人工整理',
        suit: '適合：訪談、文獻分析法／資料量少／想練手感',
        pros: ['完全掌握資料', '不用擔心 AI 幻覺', '研究的核心智力訓練都你自己做'],
        cons: ['花時間（特別是訪談組）', '量大時容易疲勞出錯'],
        accent: '#2563EB',
        bg: '#EFF6FF',
        border: '#BFDBFE',
        icon: Hand,
    },
    {
        id: 'ai-assist',
        emoji: '🤖',
        title: '路線 B · AI 輔助整理',
        suit: '適合：實驗、問卷、觀察法／資料量大／結構化處理',
        pros: ['速度快', 'AI 處理重複性勞動', '你專心驗收 + 思考'],
        cons: ['有幻覺風險，必須驗收', '不能用在「定義分類」這步', '訪談、文獻組要加抽樣比對'],
        accent: '#7C3AED',
        bg: '#F5F3FF',
        border: '#DDD6FE',
        icon: Bot,
    },
];

/* 3 個分析表範本（給沒整理的方法） */
const TABLE_TEMPLATES = [
    {
        id: 'survey-template',
        emoji: '📋',
        name: '問卷分析表 範本結構',
        rows: [
            { col: '欄位 A', desc: '樣本編號（S001、S002…）' },
            { col: '欄位 B', desc: '基本變項（性別、年級…）' },
            { col: '欄位 C+', desc: '每題一欄（Q1、Q2…），值是選項代碼或量表分數' },
            { col: '欄位 末', desc: '備註（無效/部分填寫）' },
        ],
        tip: 'N 值寫在表頂或檔名（例：N=85.csv）。複選題每選項拆一欄（Q5_A、Q5_B…）。',
    },
    {
        id: 'interview-template',
        emoji: '🎤',
        name: '訪談主題編碼表 範本結構',
        rows: [
            { col: '欄位 A', desc: '受訪者代號（I01、I02…）' },
            { col: '欄位 B', desc: '基本背景（年級、組別）' },
            { col: '欄位 C+', desc: '每個主題一欄（如「補習動機」「家庭壓力」），值=該主題出現的引用次數或代表性語錄編號' },
        ],
        tip: '先列 5-8 個主題（從研究問題反推），逐人標記。引用語錄另存第二張表（編號對應）。',
    },
    {
        id: 'experiment-template',
        emoji: '🧪',
        name: '實驗結果表 範本結構',
        rows: [
            { col: '欄位 A', desc: '受試者編號（P01、P02…）' },
            { col: '欄位 B', desc: '組別（實驗組 / 對照組）' },
            { col: '欄位 C', desc: '前測值' },
            { col: '欄位 D', desc: '後測值' },
            { col: '欄位 E', desc: '差值（後 - 前）' },
        ],
        tip: '若是觀察任務型實驗（如反應時間），每次測量一列；若是量表型，每人一列。',
    },
];

/* 觀察 / 文獻組的彙整教學 */
const CONSOLIDATE_GUIDE = [
    {
        id: 'observation-guide',
        emoji: '👀',
        name: '觀察組：多份紀錄 → 一張總表',
        steps: [
            '把 W11-W12 多份 04_觀察紀錄表.xlsx 全部打開',
            '統一行為類別命名（避免「滑手機」「玩手機」混用）',
            '新建一張「彙整總表」：欄=行為類別、列=每次觀察時段',
            '把每份紀錄的次數加總到總表對應格',
            '在表頂標 N（總觀察時段數）',
        ],
    },
    {
        id: 'literature-guide',
        emoji: '📚',
        name: '文獻組：編碼表 → 視覺化表',
        steps: [
            '從 05a-d 工具中抓出「編碼結果」分頁',
            '依研究問題決定彙整維度（=想看資料的角度，例：時間軸／立場／詞頻／主題）',
            '新建一張「分析表」：欄=分析維度、列=文獻篇',
            '把每篇文獻的編碼值填入',
            '標 N（總文獻篇數）',
        ],
    },
];

/* 資料整理進度自評 */
const STATUS_OPTIONS = [
    {
        id: 'healthy',
        label: '🟢 表已成型',
        title: '結構清楚 · 可進入下一階段',
        accent: 'var(--success)',
        bg: '#F0FDF4',
        border: '#86EFAC',
        icon: Coffee,
        guide: '今天課程結尾把「原始資料 + 整理後分析表」雙繳到 Classroom，再到 Step 5 寫一行「我下週想怎麼呈現這份資料」。下週 W14 開機速度會比別組快一截。',
    },
    {
        id: 'warning',
        label: '🟡 半成品',
        title: '結構有了 · 還在補資料 / 檢查',
        accent: '#D97706',
        bg: '#FFFBEB',
        border: '#FCD34D',
        icon: AlertTriangle,
        guide: '今天剩下時間優先補完。卡在哪寫進「我手上的原始資料現在是什麼狀態」欄位，下週 W14 進來前老師會挑黃燈組先看。',
    },
    {
        id: 'falling',
        label: '🔴 還在掙扎',
        title: '結構未成型 · 需要協助',
        accent: '#DC2626',
        bg: '#FEF2F2',
        border: '#FCA5A5',
        icon: Flame,
        guide: '直接舉手叫老師——10 分鐘 1 對 1，一起決定「最小可分析版本」。今天結束前至少要有一張結構（可以資料還沒填滿）。',
    },
];

/* ExportButton 欄位 */
const EXPORT_FIELDS = [
    { key: 'w13-data-state', label: '我的原始資料現況', question: '我手上原本的資料是什麼樣子？來自哪裡？' },
    { key: 'w13-table-structure', label: '我的分析表結構（必做）', question: '欄位名稱列表 + 列數 + N 值 + 編碼類別（如果是訪談/觀察/文獻）' },
    { key: 'w13-ai-validation', label: 'AI 輔助驗收紀錄（用了 AI 必填）', question: '我做了哪些驗收？發現 AI 哪裡跑偏 / 幻覺？' },
    { key: 'w13-ai-dialog-submission', label: 'AI 完整對話繳交方式（用了 AI 必填）', question: '我用哪種方式繳交完整對話？（A 私人註解 / B 文件上傳並貼連結）' },
    { key: 'w13-classroom-submit', label: 'Classroom 繳交檢核', question: '已勾選的繳交項目' },
    { key: 'w13-progress-status', label: '整理進度自評', question: '🟢 已成型／🟡 半成品／🔴 還在掙扎' },
    { key: 'w13-w14-question', label: 'W14 資料呈現規劃', question: '下週我想怎麼呈現這份資料？（圖／表／摘要／混合）' },
    { key: 'w13-aired-record', label: 'AI-RED 敘事紀錄（用了 AI 必填）', question: '本週用 AI 整理資料的最重要互動（A-I-R-E-D 五要素）' },
];

/* ══════════════════════════════════════
 *  進度自評三按鈕
 * ══════════════════════════════════════ */

const STATUS_KEY = 'w13-progress-status';
const STORAGE_KEY = 'rib_think_records';

const ProgressSelector = ({ value, onChange }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {STATUS_OPTIONS.map(opt => {
                const Icon = opt.icon;
                const picked = value === opt.id;
                return (
                    <button
                        key={opt.id}
                        type="button"
                        onClick={() => onChange(opt.id)}
                        className="text-left rounded-[var(--radius-unified)] border-2 p-4 transition-all"
                        style={{
                            background: picked ? opt.bg : '#fff',
                            borderColor: picked ? opt.accent : 'var(--border)',
                            boxShadow: picked ? '0 0 0 3px rgba(0,0,0,0.04)' : 'none',
                        }}
                    >
                        <div className="flex items-center gap-2 mb-1">
                            <Icon size={16} style={{ color: opt.accent }} />
                            <span className="font-bold text-[14px]" style={{ color: picked ? opt.accent : 'var(--ink)' }}>
                                {opt.label}
                            </span>
                        </div>
                        <p className="text-[12px] text-[var(--ink-mid)] leading-relaxed">{opt.title}</p>
                    </button>
                );
            })}
        </div>
    );
};

/* ══════════════════════════════════════
 *  路線選擇兩按鈕
 * ══════════════════════════════════════ */

const ROUTE_KEY = 'w13-route-pick';

const RouteSelector = ({ value, onChange }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {ROUTES.map(r => {
                const Icon = r.icon;
                const picked = value === r.id;
                return (
                    <button
                        key={r.id}
                        type="button"
                        onClick={() => onChange(r.id)}
                        className="text-left rounded-[var(--radius-unified)] border-2 p-5 transition-all"
                        style={{
                            background: picked ? r.bg : '#fff',
                            borderColor: picked ? r.accent : 'var(--border)',
                            boxShadow: picked ? '0 0 0 3px rgba(0,0,0,0.04)' : 'none',
                        }}
                    >
                        <div className="flex items-center gap-2 mb-2">
                            <Icon size={18} style={{ color: r.accent }} />
                            <span className="font-bold text-[14px]" style={{ color: r.accent }}>{r.title}</span>
                        </div>
                        <p className="text-[11px] text-[var(--ink-mid)] mb-3 leading-relaxed">{r.suit}</p>
                        <div className="text-[11px] text-[var(--ink)] leading-relaxed space-y-1">
                            <p><strong>優點：</strong>{r.pros.join('、')}</p>
                            <p><strong>缺點：</strong>{r.cons.join('、')}</p>
                        </div>
                    </button>
                );
            })}
        </div>
    );
};

/* ══════════════════════════════════════
 *  主頁面
 * ══════════════════════════════════════ */

const W13AutonomyPage = () => {
    const [status, setStatus] = useState(() => {
        try {
            const r = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
            return r[STATUS_KEY] || '';
        } catch { return ''; }
    });
    const [route, setRoute] = useState(() => {
        try {
            const r = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
            return r[ROUTE_KEY] || '';
        } catch { return ''; }
    });
    const [aiMode, setAiMode] = useState(() => {
        try {
            const r = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
            return r['w13-ai-mode'] || '';
        } catch { return ''; }
    });

    const handleStatus = (id) => {
        setStatus(id);
        try {
            const r = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
            r[STATUS_KEY] = id;
            localStorage.setItem(STORAGE_KEY, JSON.stringify(r));
        } catch {}
    };
    const handleRoute = (id) => {
        setRoute(id);
        try {
            const r = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
            r[ROUTE_KEY] = id;
            localStorage.setItem(STORAGE_KEY, JSON.stringify(r));
        } catch {}
    };

    const picked = STATUS_OPTIONS.find(o => o.id === status);
    const pickedRoute = ROUTES.find(r => r.id === route);

    /* 從先前週次抓題目和方法 */
    const saved = readRecords();
    const myTopic = saved['w8-merged-topic'] || saved['w8-research-question'] || saved['w4-final-topic'] || saved['w3-final-topic'] || '';
    const myMethod = saved['w9-my-method'] || saved['w8-tool-method'] || saved['w7-method-choice'] || '';

    const steps = [
        {
            title: '認識資料',
            icon: <Database size={18} />,
            content: (
                <div className="flex flex-col gap-6 prose-zh">
                    {/* ⭐ 開場·必看：AI 報告找雷大挑戰（連到反面教材頁）*/}
                    <Link
                        to="/find-traps"
                        className="block p-5 rounded-[var(--radius-unified)] bg-gradient-to-br from-[var(--ink)] to-[#1E293B] text-white shadow-xl no-underline hover:shadow-2xl transition-all hover:-translate-y-0.5"
                    >
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-[20px]">📺</span>
                            <p className="font-mono text-[10.5px] font-bold tracking-[0.15em] text-[#FCD34D] uppercase">
                                上課必看 · AI 反面教材
                            </p>
                        </div>
                        <p className="font-serif text-[18px] md:text-[20px] font-bold leading-tight mb-2">
                            老師用 Gemini 跑了一份「研究報告」——你能找出 8 個學術紅線嗎？
                        </p>
                        <p className="text-[12px] text-white/85 leading-[1.85]">
                            進入頁面前，先記住一件事：<strong className="text-[#FCD34D]">AI 沒做錯，是 prompt 沒給規則</strong>。本週我們要學的就是怎麼把判斷力寫進 prompt 裡。
                        </p>
                        <span className="inline-flex items-center gap-1 mt-3 text-[12.5px] font-bold text-[#FCD34D]">
                            點進去找雷 →
                        </span>
                    </Link>

                    {/* 開場：純觀念，先不談 AI */}
                    <div className="p-5 rounded-[var(--radius-unified)] border border-[var(--border)] bg-[var(--paper-warm)]">
                        <p className="text-[15px] font-bold text-[var(--ink)] mb-2">📦 任務：原始資料 → 可分析的表</p>
                        <p className="text-[12px] text-[var(--ink-mid)] leading-relaxed">
                            W11-W12 你蒐集到一堆原始資料（問卷回應／逐字稿／實驗紀錄／觀察表／編碼表）。
                            本週要把它變成「<strong>分析表</strong>」——欄位清楚、<strong>N 值</strong>明確的乾淨表，下週 W14 才畫得了圖。
                            先看看 5 法的對照，找到自己這組對應的轉換路徑。
                        </p>
                    </div>

                    {/* 📖 4 個詞卡：N 值／半結構化／編碼類別／代碼化（先定義再用，仿 W9 變項詞卡格式） */}
                    <div className="p-4 rounded-[var(--radius-unified)] border-2 border-[#BFDBFE] bg-[#EFF6FF] max-w-[760px]">
                        <p className="text-[13px] font-bold text-[#1E40AF] mb-2">📖 先搞懂 4 個詞（W13 開始大量出現）</p>
                        <p className="text-[12px] text-[#1E3A8A] leading-relaxed mb-3">
                            這 4 個詞下方的 5 法對照表會頻繁用到——先花 90 秒掃過。
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            <div className="bg-white border-2 border-[#2563EB] rounded p-2.5">
                                <p className="text-[12px] font-bold text-[#2563EB] mb-1">🔢 N 值</p>
                                <p className="text-[11.5px] text-[#1E3A8A] leading-relaxed mb-1">每一欄、每一筆資料的<strong>樣本數量</strong>。</p>
                                <p className="text-[11px] text-[#1E40AF] italic">例：訪了 8 人 → N = 8；收到 85 份問卷 → N = 85</p>
                            </div>
                            <div className="bg-white border-2 border-[#7C3AED] rounded p-2.5">
                                <p className="text-[12px] font-bold text-[#7C3AED] mb-1">🎙️ 半結構化訪談</p>
                                <p className="text-[11.5px] text-[#4C1D95] leading-relaxed mb-1">有大綱但允許追問的訪談形式——介於完全自由聊天和死板問卷之間。</p>
                                <p className="text-[11px] text-[#5B21B6] italic">例：照訪綱問 5 大題，但聽到有意思的就追問</p>
                            </div>
                            <div className="bg-white border-2 border-[#059669] rounded p-2.5">
                                <p className="text-[12px] font-bold text-[#059669] mb-1">🏷️ 編碼類別</p>
                                <p className="text-[11.5px] text-[#065F46] leading-relaxed mb-1">把文字資料分類的<strong>標籤</strong>。</p>
                                <p className="text-[11px] text-[#047857] italic">例：把 8 位受訪者的答案分成「正面 / 中立 / 負面」3 類</p>
                            </div>
                            <div className="bg-white border-2 border-[#D97706] rounded p-2.5">
                                <p className="text-[12px] font-bold text-[#D97706] mb-1">🔢 代碼化（變項代碼化）</p>
                                <p className="text-[11.5px] text-[#7C2D12] leading-relaxed mb-1">把文字標籤轉成<strong>數字</strong>便於計算。</p>
                                <p className="text-[11px] text-[#9A3412] italic">例：正面 = 1，中立 = 0，負面 = -1</p>
                            </div>
                        </div>
                        <p className="text-[11px] text-[#1E40AF] italic leading-relaxed mt-2.5">
                            💡 <strong>編碼類別</strong>是「貼標籤」（質性的分類）；<strong>代碼化</strong>是「把標籤換成數字」（為了能丟進 Excel／統計軟體算）。順序是先編碼、再代碼。
                        </p>
                    </div>

                    {/* 5 法對照表 */}
                    <div>
                        <p className="text-[13px] font-bold text-[var(--ink)] mb-2">📊 5 種方法 · 原始資料 → 分析表 對照</p>
                        <p className="text-[11.5px] text-[var(--ink-mid)] leading-relaxed mb-3">
                            <strong>怎麼讀標籤？</strong>
                            「<span className="font-mono text-[#DC2626]">❌ 完全沒整理</span>」= 還是錄音／手寫狀態；
                            「<span className="font-mono text-[#D97706]">⚠️ 還沒整理</span>」= 數位但沒結構；
                            「<span className="font-mono text-[#D97706]">⚠️ 半結構化（還要彙整）</span>」= 已有單份結構但<strong>多份還沒合在一起</strong>，<strong className="text-[var(--accent)]">還是要做 Step 2 彙整</strong>，不是「不用做」。
                        </p>
                        <div className="grid grid-cols-1 gap-3">
                            {METHOD_TABLE.map((m) => (
                                <div
                                    key={m.id}
                                    className="rounded-[var(--radius-unified)] border-l-4 border border-[var(--border)] bg-white overflow-hidden"
                                    style={{ borderLeftColor: m.accent }}
                                >
                                    <div className="px-4 py-2 flex items-center gap-2 bg-[var(--paper-warm)] border-b border-[var(--border)]">
                                        <span className="text-[16px]">{m.emoji}</span>
                                        <span className="text-[13px] font-bold text-[var(--ink)]">{m.name}</span>
                                        <span className="ml-auto text-[10px] font-mono px-2 py-0.5 rounded-[2px]"
                                            style={{ background: m.accent, color: '#fff' }}>
                                            {m.rawState}
                                        </span>
                                    </div>
                                    <div className="px-4 py-3 grid grid-cols-1 md:grid-cols-3 gap-3 text-[12px]">
                                        <div>
                                            <p className="text-[10px] font-bold text-[var(--ink-light)] uppercase tracking-wider mb-1">原始來源</p>
                                            <p className="text-[var(--ink-mid)] leading-snug">{m.rawSrc}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-[var(--ink-light)] uppercase tracking-wider mb-1">目標分析表</p>
                                            <p className="text-[var(--ink)] font-bold leading-snug">{m.targetTable}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-[var(--ink-light)] uppercase tracking-wider mb-1">轉換步驟</p>
                                            <p className="text-[var(--ink-mid)] leading-snug">{m.steps}</p>
                                        </div>
                                    </div>
                                    {m.example && (
                                        <details className="border-t border-[var(--border)]">
                                            <summary className="cursor-pointer px-4 py-2 hover:bg-[var(--paper-warm)] transition-colors flex items-center gap-2 text-[12px]">
                                                <span className="font-bold" style={{ color: m.accent }}>📋 看範例：{m.example.topic}</span>
                                                <span className="ml-auto text-[10px] font-mono text-[var(--ink-light)]">▼</span>
                                            </summary>
                                            <div className="border-t border-[var(--border)] px-4 py-3 bg-[#FAFAF9] grid grid-cols-1 md:grid-cols-2 gap-3">
                                                <div>
                                                    <p className="text-[10px] font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5" style={{ color: '#991B1B' }}>
                                                        <span className="inline-block w-2 h-2 rounded-full bg-[#FCA5A5]"></span>
                                                        ❌ 原始（雜亂、無法分析）
                                                    </p>
                                                    <pre className="text-[10.5px] text-[var(--ink-mid)] bg-white border border-[var(--border)] rounded p-2 overflow-x-auto whitespace-pre leading-relaxed font-mono">{m.example.raw}</pre>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5" style={{ color: '#166534' }}>
                                                        <span className="inline-block w-2 h-2 rounded-full bg-[#86EFAC]"></span>
                                                        ✅ 整理後（可分析的表）
                                                    </p>
                                                    <pre className="text-[10.5px] text-[var(--ink)] bg-white border border-[var(--border)] rounded p-2 overflow-x-auto whitespace-pre leading-relaxed font-mono">{m.example.table}</pre>
                                                </div>
                                            </div>
                                        </details>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 自我定位 */}
                    <ThinkRecord
                        dataKey="w13-data-state"
                        prompt="① 我手上的原始資料現在是什麼狀態？"
                        scaffold={[
                            '我的原始資料來源：（Google Forms / 逐字稿 / 04 紀錄表…）',
                            '目前數量：（N=__；已收齊 / 還缺 __）',
                            '結構狀態：（雜亂 / 半結構化 / 已分類）',
                        ]}
                    />
                </div>
            ),
        },
        {
            title: '動手整理',
            icon: <Route size={18} />,
            content: (
                <div className="flex flex-col gap-6 prose-zh">
                    <div className="p-4 rounded-[var(--radius-unified)] border border-[var(--border)] bg-[var(--paper-warm)]">
                        <p className="text-[14px] font-bold text-[var(--ink)] mb-1">🧑 純人工整理 · 大家先動手做一遍</p>
                        <p className="text-[12px] text-[var(--ink-mid)] leading-relaxed">
                            結構定好了，現在依結構逐筆把資料填進去。<strong>不用急著用 AI</strong>——
                            人工整理是研究的基本功，先親手做一輪你才知道資料長什麼樣子。
                            想試 AI 輔助？下一步「補充·AI 輔助」會教你怎麼用，<strong>且不一定要用</strong>。
                        </p>
                    </div>

                    {/* 純人工執行步驟 */}
                    <div className="rounded-[var(--radius-unified)] border-2 border-[#BFDBFE] bg-[#EFF6FF] p-5">
                        <p className="text-[14px] font-bold text-[#1E40AF] mb-3">📋 動手整理執行步驟</p>
                        <div className="space-y-3 text-[12px] text-[#1E3A8A] leading-relaxed">
                            <div>
                                <p className="font-bold mb-1">逐步操作（通用）：</p>
                                <ol className="list-decimal pl-5 space-y-1">
                                    <li>打開你的 Google Sheet（已建好欄位 header）</li>
                                    <li>依結構逐筆填入</li>
                                    <li>每填 10 筆做一次抽檢（避免疲勞錯誤）</li>
                                    <li>檢查 N 值是否標清楚</li>
                                </ol>
                            </div>
                            {(() => {
                                const METHOD_OPS = [
                                    { id: 'survey', match: ['問卷'], label: '📋 問卷組', body: <p>下載 Google Forms CSV → 貼進 Sheet → <strong>第一輪先刪空白／未完整作答的列</strong>（這就是「無效樣本」）→ 變項代碼化（例：「非常同意/同意/普通/不同意/非常不同意」改成 5/4/3/2/1）→ 標 N。</p> },
                                    { id: 'interview', match: ['訪談'], label: '🎤 訪談組（最花時間，安排給課後）', body: <p>開新 Sheet 建欄：受訪者代號 / 主題 1 / 主題 2 / 主題 3...（從研究問題反推 5-8 個主題）→ <strong>邊讀逐字稿，遇到主題出現就在對應格 +1</strong>，並把該段話的「行號或時間戳」記在備註欄 → 全篇讀完一個受訪者再換下一個。</p> },
                                    { id: 'experiment', match: ['實驗'], label: '🧪 實驗組', body: <p>從紀錄表抽出每位受試者的：編號 / 組別 / 前測值 / 後測值 → 算<strong>差值（後 - 前）</strong>→ 計算各組均值差 → <strong>確認實驗組與對照組 N 數一致</strong>（不一致 = 對照組無效）。</p> },
                                    { id: 'observation', match: ['觀察'], label: '👀 觀察組', body: <p>把多份觀察紀錄表攤開 → <strong>統一行為類別命名</strong>（「滑手機」「玩手機」要合併還是拆開？先決定）→ 新建總表「行為類別 × 觀察時段」逐格加總頻次。</p> },
                                    { id: 'literature', match: ['文獻'], label: '📚 文獻組', body: <p>把 05a-d 編碼表單篇彙整 → 依研究問題決定彙整維度（時間軸／立場／詞頻）→ 新建分析表「分析維度（欄）× 文獻篇（列）」逐格填值 → 標 N（總文獻篇數）。</p> },
                                ];
                                const myOp = METHOD_OPS.find(m => m.match.some(k => myMethod && myMethod.includes(k)));
                                const others = myOp ? METHOD_OPS.filter(m => m.id !== myOp.id) : METHOD_OPS;
                                return (
                                    <>
                                        {myOp && (
                                            <div className="mt-2 rounded border-2 border-[#1E40AF] bg-[#EFF6FF] p-3">
                                                <p className="text-[10px] font-mono text-[#1E40AF] mb-1 tracking-wider">YOUR GROUP</p>
                                                <p className="font-bold text-[12px] text-[#1E40AF] mb-1">{myOp.label}</p>
                                                <div className="text-[11.5px] text-[#1E3A8A] leading-relaxed">{myOp.body}</div>
                                            </div>
                                        )}
                                        <details className="mt-2 rounded border border-[#BFDBFE] bg-white">
                                            <summary className="cursor-pointer px-3 py-2 hover:bg-[#EFF6FF] flex items-center gap-2">
                                                <span className="text-[12px] font-bold text-[#1E40AF]">{myOp ? '📂 想看其他方法的具體操作？（點開）' : '📋 5 法分流 · 看自己組的操作（點開）'}</span>
                                                <span className="ml-auto text-[10px] font-mono text-[#1E40AF]">▼</span>
                                            </summary>
                                            <div className="border-t border-[#BFDBFE] p-3 grid grid-cols-1 gap-2 text-[11.5px] text-[#1E3A8A] leading-relaxed">
                                                {others.map(m => (
                                                    <div key={m.id}>
                                                        <p className="font-bold mb-0.5">{m.label}</p>
                                                        {m.body}
                                                    </div>
                                                ))}
                                            </div>
                                        </details>
                                    </>
                                );
                            })()}
                            <div className="hidden">
                            </div>
                            <div className="border-t border-[#BFDBFE] pt-3">
                                <p className="font-bold mb-1">老師巡視重點：</p>
                                <ul className="list-disc pl-5 space-y-1">
                                    <li>欄位是否對應研究問題</li>
                                    <li><strong>編碼類別</strong>（=分類項目，例：「家長期待」「同儕壓力」）是否<strong>不重疊</strong>（一筆資料只能歸一類，不會同時屬於兩類）</li>
                                    <li>是否有不知道怎麼編的「灰色資料」（這需要老師討論）</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* 進度自評 */}
                    <div>
                        <p className="text-[13px] font-bold text-[var(--ink)] mb-2">📍 整理進度自評（誠實標記）</p>
                        <p className="text-[12px] text-[var(--ink-mid)] mb-3">
                            <strong className="text-[var(--success)]">100% 不影響分數、不公告排名</strong>——選 🔴 不會被點名也不扣分，只是讓老師巡視時知道誰先看。誠實標記=老師能更快來找你。
                        </p>
                        <ProgressSelector value={status} onChange={handleStatus} />

                        {picked && (
                            <div
                                className="mt-3 p-4 rounded-[var(--radius-unified)] border-l-4"
                                style={{ background: picked.bg, borderLeftColor: picked.accent }}
                            >
                                <div className="text-[11px] font-mono font-bold uppercase tracking-wider mb-2" style={{ color: picked.accent }}>
                                    建議路線 · {picked.label}
                                </div>
                                <p className="text-[13px] text-[var(--ink)] leading-relaxed m-0">{picked.guide}</p>
                            </div>
                        )}
                    </div>
                </div>
            ),
        },
        {
            title: '補充·AI 輔助（可選）',
            icon: <Bot size={18} />,
            content: (
                <div className="flex flex-col gap-6 prose-zh">
                    {/* 核心原則（一句話帶過開場 + 任務定位） */}
                    <div className="p-5 rounded-[var(--radius-unified)] border-2 border-[var(--accent)] bg-[#F8F8FB]">
                        <p className="text-[15px] font-bold text-[var(--accent)] mb-2">🧠 核心原則：腦袋先有架構，AI 才幫得上忙</p>
                        <p className="text-[12px] text-[var(--ink)] leading-relaxed">
                            純人工整理就夠完成本週任務；想試 AI 也行——但記住：
                            <strong>「結構怎麼設」由你決定（已在 Step 2 寫好）；「內容怎麼填」才可以交給 AI。</strong>
                            用了 AI 一定要做驗收，並繳完整對話。
                        </p>
                    </div>

                    {/* AI 能/不能 + 三風險 收合（需要時點開） */}
                    <details className="rounded-[var(--radius-unified)] border border-[var(--border)] bg-white">
                        <summary className="cursor-pointer px-5 py-3 flex items-center justify-between hover:bg-[var(--paper-warm)] transition-colors">
                            <span className="text-[13px] font-bold text-[var(--ink)] flex items-center gap-2">
                                <ShieldAlert size={14} className="text-[#DC2626]" />
                                📋 AI 風險速查 · AI 能/不能做什麼 + 三大風險（點開展開）
                            </span>
                            <span className="text-[10px] font-mono text-[var(--ink-light)]">▼</span>
                        </summary>
                        <div className="px-5 py-4 border-t border-[var(--border)] flex flex-col gap-4">
                            {/* AI 能 vs 不能 */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div className="rounded-[var(--radius-unified)] border-2 border-[#86EFAC] bg-[#F0FDF4] p-4">
                                    <p className="text-[12px] font-bold text-[#166534] mb-2">✅ AI 可以幫</p>
                                    <ul className="text-[11px] text-[#166534] leading-relaxed space-y-1">
                                        {AI_CAN_DO.map((s, i) => (<li key={i}>· {s}</li>))}
                                    </ul>
                                </div>
                                <div className="rounded-[var(--radius-unified)] border-2 border-[#FCA5A5] bg-[#FEF2F2] p-4">
                                    <p className="text-[12px] font-bold text-[#991B1B] mb-2">❌ AI 不能替你做</p>
                                    <ul className="text-[11px] text-[#991B1B] leading-relaxed space-y-1">
                                        {AI_CANNOT_DO.map((s, i) => (<li key={i}>· {s}</li>))}
                                    </ul>
                                </div>
                            </div>

                            {/* AI 三大風險 */}
                            <div>
                                <p className="text-[12px] font-bold text-[var(--ink)] mb-2">⚠️ 三大風險</p>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    {AI_RISKS.map((r, i) => (
                                        <div key={i} className="rounded-[var(--radius-unified)] border border-[#FCD34D] bg-[#FFFBEB] p-3">
                                            <p className="text-[13px] font-bold text-[#92400E] mb-1">{r.emoji} {r.title}</p>
                                            <p className="text-[11px] text-[#78350F] leading-relaxed mb-1">{r.body}</p>
                                            <p className="text-[11px] text-[#92400E] leading-relaxed border-t border-[#FCD34D] pt-1">
                                                <strong>對策：</strong>{r.safeguard}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                                <p className="text-[11px] text-[var(--ink-light)] italic mt-2 leading-relaxed">
                                    💡 用了 AI 一定要跑 AI-RED 紀錄（A=工具、I=指令、R=回覆、E=評價、D=決策），下方繳交區會強制要求填。
                                </p>
                            </div>
                        </div>
                    </details>

                    {/* AI 協作三原則 + 對話四步驟（W13/14/15 共用） */}
                    <AICollaborationPrinciples week="13" role="assistant" showRoleCard={false} />

                    {/* AI 模式選擇（含 standalone 不用 AI） */}
                    <AIModePicker week="13" taskName="資料整理" onChange={setAiMode} />

                    {/* standalone：不用 AI */}
                    {aiMode === 'standalone' && (
                        <div className="rounded-[var(--radius-unified)] border-2 border-[#BFDBFE] bg-[#EFF6FF] p-5">
                            <p className="text-[14px] font-bold text-[#1E40AF] mb-2">🚫 你選擇不用 AI</p>
                            <p className="text-[12px] text-[#1E3A8A] leading-relaxed">
                                完全 OK——純人工整理已經足以完成本週任務。回到 Step 3 繼續動手填表，
                                記得每填 10 筆抽檢一次，並在下一步繳交分析表連結。
                            </p>
                        </div>
                    )}

                    {/* 教學型：完全不會 → AI 給範例 */}
                    {aiMode === 'teach' && (
                        <div className="rounded-[var(--radius-unified)] border-2 border-[#86EFAC] bg-white p-4">
                            <p className="text-[13px] font-bold text-[#166534] mb-2">🎓 教學型 Prompt（從零到一）</p>
                            <p className="text-[11px] text-[#166534] leading-relaxed mb-3">
                                貼給 Gemini Pro（思考模式）。記得 AI 給範例後，<strong>你要自己改寫一次</strong>，不要只複製。
                            </p>
                            <PromptBlock text={`我有 N=___ 份[問卷／訪談／實驗／觀察／文獻]研究蒐集到的原始資料，
但我完全不知道怎麼整理成「可分析的表」。

我的研究問題是：___

【請你做】
1. 教我「分析表」應該長什麼樣子（給 1 個極簡範例，不超過 10 行）
2. 列出我這個方法該有的 5-6 個關鍵欄位（含說明）
3. 給我可以照著做的步驟（3-5 步）

【不要做】
- 不要替我做完整張表
- 不要直接給我「最終版」答案
- 我看完範例後會自己照著做一遍`} />
                            <p className="text-[11px] text-[#166534] italic mt-2 leading-relaxed">
                                💡 對話來回後：把 AI 範例「<strong>用自己的話改寫</strong>」一次，證明你懂了。不能直接抄。
                            </p>
                        </div>
                    )}

                    {/* 驗收型：有初版 → AI 找漏洞 */}
                    {aiMode === 'verify' && (
                        <div className="rounded-[var(--radius-unified)] border-2 border-[#FCA5A5] bg-white p-4">
                            <p className="text-[13px] font-bold text-[#991B1B] mb-2">🥊 驗收型 Prompt（從 1 到 100）</p>
                            <p className="text-[11px] text-[#991B1B] leading-relaxed mb-3">
                                你已經做了一張表（或結構），請 AI 從研究方法老師角度<strong>壓力測試</strong>。
                            </p>
                            <PromptBlock text={`我做好了一張分析表，請你幫我把資料填進去 / 檢查結構。

【任務】
依我提供的「分析表結構」與「編碼規則」，把原始資料逐筆填入。
不要自行新增類別、不要替我重新定義變項。
遇到不確定的資料，標 ❓ 並列出疑問。

【分析表結構】
欄位：___（貼你的欄位清單）
編碼類別：___（如果有）
N 值：___

【原始資料】
___（貼你的原始資料；訪談組貼逐字稿、問卷組貼 CSV）

【輸出格式】
1. 完成的分析表（CSV 或 Markdown 表）
2. ❓ 區：你不確定的資料 + 你的疑問
3. ⚠️ 區：你發現的可能問題（重複、缺漏、不一致）

請嚴格依照我的編碼規則，不要自行擴充。`} />
                        </div>
                    )}

                    {!aiMode && (
                        <div className="rounded-[var(--radius-unified)] border border-[var(--border)] bg-[var(--paper-warm)] p-3">
                            <p className="text-[12px] text-[var(--ink-mid)] leading-relaxed">
                                ☝️ 上方先選一個 AI 使用模式：教學型（從零到一）／驗收型（從 1 到 100）／不用 AI。
                            </p>
                        </div>
                    )}

                    {/* 強制驗收清單（teach/verify 才顯示） */}
                    {(aiMode === 'teach' || aiMode === 'verify') && (
                        <>
                            <div className="bg-white rounded-[var(--radius-unified)] border border-[#DDD6FE] p-4">
                                <p className="text-[12px] font-bold text-[#5B21B6] mb-2 flex items-center gap-2">
                                    <ShieldAlert size={14} /> 強制驗收清單（不做＝賭運氣）
                                </p>
                                <ul className="text-[11px] text-[#4C1D95] leading-relaxed space-y-1">
                                    <li>☐ 抽前 5 筆對照原始資料，確認 AI 沒有幻覺（沒亂加東西）</li>
                                    <li>☐ 抽中段 5 筆，確認 AI 沒有跑偏（編碼類別跟我定義的一致）</li>
                                    <li>☐ AI 標 ❓ 的資料我自己處理，不直接讓 AI 決定</li>
                                    <li>☐ N 值跟我原本算的一致</li>
                                </ul>
                            </div>

                            {/* 訪談 / 文獻組額外門檻 */}
                            <div className="bg-[#FEF2F2] rounded-[var(--radius-unified)] border border-[#FCA5A5] p-4">
                                <p className="text-[12px] font-bold text-[#991B1B] mb-2 flex items-center gap-2">
                                    <ShieldAlert size={14} /> 訪談組／文獻組 · 額外驗收門檻（非常重要）
                                </p>
                                <p className="text-[11px] text-[#7F1D1D] leading-relaxed mb-2">
                                    這兩組的編碼<strong>就是研究本身</strong>。AI 全做完，你不抽樣比對，等於放棄判斷。
                                </p>
                                <ul className="text-[11px] text-[#7F1D1D] leading-relaxed space-y-1 mb-3">
                                    <li>☐ 隨機抽 30% 樣本，<strong>我自己編碼一次</strong></li>
                                    <li>☐ 跟 AI 編碼結果比對</li>
                                    <li>☐ 差異率 &gt;20%：重新定義類別 + 重編一輪</li>
                                    <li>☐ 把差異最大的 2-3 筆寫進「AI 驗收紀錄」</li>
                                </ul>
                                <div className="bg-white border border-[#FCA5A5] rounded p-3">
                                    <p className="text-[11.5px] font-bold text-[#991B1B] mb-2">📖 「差異」怎麼算？什麼算 1 筆差異</p>
                                    <div className="grid md:grid-cols-2 gap-2 text-[11px] text-[#7F1D1D]">
                                        <div className="bg-[#FEF2F2] border border-[#FCA5A5] rounded p-2">
                                            <p className="font-bold mb-1">✅ 算差異（要計入）</p>
                                            <ul className="space-y-1 leading-relaxed">
                                                <li>· 我編「家庭壓力」、AI 編「同儕壓力」 = <strong>1 筆</strong></li>
                                                <li>· 我編「正面態度」、AI 漏編沒分類 = <strong>1 筆</strong></li>
                                                <li>· 我編入兩個類別、AI 只編一個 = <strong>1 筆</strong></li>
                                            </ul>
                                        </div>
                                        <div className="bg-[#F0FDF4] border border-[#86EFAC] rounded p-2">
                                            <p className="font-bold text-[#166534] mb-1">❌ 不算差異（不計入）</p>
                                            <ul className="space-y-1 leading-relaxed text-[#166534]">
                                                <li>· 用詞略不同但意思一樣（「家庭期待」vs「家長期待」）</li>
                                                <li>· 順序不同但類別一樣</li>
                                                <li>· AI 多寫了註解但分類正確</li>
                                            </ul>
                                        </div>
                                    </div>
                                    <p className="text-[10.5px] text-[#991B1B] italic mt-2 leading-relaxed">
                                        💡 例：抽 30 筆比對，找到 4 筆「真差異」 = 差異率 13%（&lt;20% 通過）。如果 8 筆 = 27%（&gt;20%）→ 重編。
                                    </p>
                                    <div className="mt-2 pt-2 border-t border-[#FCA5A5] text-[11px] text-[#7F1D1D] leading-[1.85]">
                                        <p className="font-bold mb-1">⏱ 差異率 &gt; 20% 怎麼辦？重做一輪約 30 分鐘：</p>
                                        <ol className="list-decimal pl-5 space-y-0.5">
                                            <li>全組坐下來，重新講清楚每個分類的定義（哪些算「家長期待」、哪些算「同儕壓力」）—— 約 20 分鐘</li>
                                            <li>再抽 10% 樣本，每個人重做一次，看這次大家有沒有對上 —— 約 10 分鐘</li>
                                        </ol>
                                    </div>
                                </div>
                            </div>

                            {/* AI 驗收紀錄 */}
                            <ThinkRecord
                                dataKey="w13-ai-validation"
                                prompt="③ AI 輔助驗收紀錄（用了 AI 必填）"
                                scaffold={[
                                    '我抽了哪幾筆驗收：（前 5 / 中 5 / 抽 30%）',
                                    '我發現 AI 哪裡跑偏 / 幻覺：',
                                    '我做了什麼修正：',
                                ]}
                            />

                            {/* 完整對話繳交（共用元件） */}
                            <AIDialogSubmission week="13" taskName="資料整理對話" required={true} />
                        </>
                    )}
                </div>
            ),
        },
        {
            title: '收尾繳交',
            icon: <FileCheck size={18} />,
            content: (
                <div className="flex flex-col gap-6 prose-zh">
                    {/* 跨工具：Prompt 範本庫（自學） */}
                    <div className="bg-[var(--paper-warm)] border border-[var(--border)] rounded-[var(--radius-unified)] p-3 flex items-center justify-between gap-3">
                        <p className="text-[12px] text-[var(--ink-mid)] leading-relaxed">
                            💡 整理完想做更進階的分析？例如：<strong>交叉分析</strong>（兩個變項對著比，例：「性別 × 補習動機」）、<strong>主題編碼</strong>（從質性資料找主題）、<strong>跨個案比較</strong>（不同案例之間比一比）——回 <strong className="text-[var(--ink)]">Prompt 範本庫</strong>看 5 法 Step 2-5 的進階 prompt（自學用，不影響本週繳交）。
                        </p>
                        <a
                            href="/analysis-station"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 bg-[var(--accent)] text-white px-3 py-1.5 rounded-[var(--radius-unified)] font-bold text-[12px] hover:opacity-90 transition-opacity no-underline flex-shrink-0"
                        >
                            📚 開範本庫
                        </a>
                    </div>

                    <div className="p-4 rounded-[var(--radius-unified)] border border-[var(--border)] bg-[var(--paper-warm)]">
                        <p className="text-[14px] font-bold text-[var(--ink)] mb-1">📤 下課前 10 分鐘 · 兩條繳交動線</p>
                        <div className="text-[12px] text-[var(--ink-mid)] leading-relaxed flex flex-col gap-1">
                            <span>📁 <strong>Classroom 繳：</strong>原始資料雲端連結 + 整理後分析表連結（用了 AI 的學生再加完整對話）</span>
                            <span>📝 <strong>網頁繳：</strong>下方檢核清單 + W14 伏筆（用了 AI 補 AI-RED）</span>
                        </div>
                    </div>

                    {/* Classroom 繳交檢核 */}
                    <Checklist
                        dataKey="w13-classroom-submit"
                        prompt="④ Classroom 繳交檢核（勾選你已繳的項目）"
                        items={[
                            '原始資料雲端連結（Google Sheets / Excel / 逐字稿等）已繳',
                            '整理後分析表雲端連結已繳（含欄位、N 值清楚）',
                            '雲端權限設定為「知道連結的人可以檢視」',
                            '訪談組／文獻組：已清個資（姓名改代號 A、B、C）',
                            '用了 AI 的學生：完整對話紀錄（私人註解或文件連結）已繳',
                        ]}
                    />

                    {/* W14 伏筆：資料呈現方式（不限於圖） */}
                    <ThinkRecord
                        dataKey="w13-w14-question"
                        prompt="⑤ W14 我想怎麼呈現這份資料？"
                        scaffold={[
                            '我想呈現的訊息（選 1 個 最值得讓讀者看到的）：',
                            '我考慮的呈現方式（1-3 種就好，別貪多）：',
                            '若用圖表，可能的類型：（折線／圓餅／長條／散佈）',
                        ]}
                    />
                    <details className="mt-2 rounded border border-[var(--border)] bg-[var(--paper-warm)]">
                        <summary className="cursor-pointer px-3 py-2 text-[12px] font-bold text-[var(--ink)] hover:bg-white">
                            📊 看 5 法的呈現範例（點開）
                        </summary>
                        <div className="px-4 py-3 border-t border-[var(--border)]">
                            <div className="overflow-x-auto">
                                <table className="w-full text-[11.5px] border-collapse">
                                    <thead>
                                        <tr className="bg-white border-b border-[var(--border)]">
                                            <th className="p-2 text-left font-bold">方法</th>
                                            <th className="p-2 text-left font-bold">想呈現的訊息（範例）</th>
                                            <th className="p-2 text-left font-bold">呈現方式（範例）</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="border-b border-[var(--border)]"><td className="p-2 font-bold">📋 問卷</td><td className="p-2">5 點量表分布</td><td className="p-2">長條圖 / 圓餅</td></tr>
                                        <tr className="border-b border-[var(--border)]"><td className="p-2 font-bold">🎤 訪談</td><td className="p-2">主題出現頻次</td><td className="p-2">橫向長條圖 + 引用佳句框</td></tr>
                                        <tr className="border-b border-[var(--border)]"><td className="p-2 font-bold">🧪 實驗</td><td className="p-2">前後測差異</td><td className="p-2">折線圖 + 組間均值表</td></tr>
                                        <tr className="border-b border-[var(--border)]"><td className="p-2 font-bold">👀 觀察</td><td className="p-2">行為類別佔比</td><td className="p-2">圓餅圖 / 時間軸折線</td></tr>
                                        <tr><td className="p-2 font-bold">📚 文獻</td><td className="p-2">立場分布 / 時間軸</td><td className="p-2">時間軸 + 圓餅</td></tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </details>

                    {/* AI-RED（依 AI Mode 條件分流） */}
                    {(aiMode === 'teach' || aiMode === 'verify') ? (
                        <div className="rounded-[var(--radius-unified)] border-2 border-[#DDD6FE] bg-[#F5F3FF] p-4">
                            <p className="text-[12px] font-bold text-[#5B21B6] mb-2">🤖 用了 AI · AI-RED 紀錄（必填）</p>
                            <p className="text-[11px] text-[#4C1D95] mb-3 leading-relaxed">
                                你用了 AI 整理資料，必須留下完整的 A-I-R-E-D 紀錄——這是學術倫理，也是讓你之後讀書摘時記得自己做了什麼決定。
                                <strong>注意：</strong>AIRED 是「事後重述一次最關鍵的互動」；上方還要繳<strong>完整對話</strong>，兩者不衝突。
                            </p>
                            <AIREDNarrative week="13" hint="本週用 AI 整理資料：A=Gemini Pro / I=結構化 prompt / R=AI 填出的表 / E=驗收結果（哪裡好哪裡跑偏）/ D=採納哪些、改了哪些" />
                        </div>
                    ) : aiMode === 'standalone' ? (
                        <div className="rounded-[var(--radius-unified)] border border-[var(--border)] bg-[var(--paper-warm)] p-4">
                            <p className="text-[13px] font-bold text-[var(--ink)] mb-1">🚫 本週純人工 · 不需 AI 反思</p>
                            <p className="text-[11.5px] text-[var(--ink-mid)] leading-relaxed">
                                你在 Step 4 選擇不用 AI，這格自動略過。
                                W13 是動手週，<strong>反思真正大舉發生在 W15（結論寫作）和 W17（成果發表）</strong>——把腦力留到那時候用。
                            </p>
                        </div>
                    ) : (
                        <AIREDNarrative week="13" hint="本週若有用 AI 幫忙建議分析表結構或編碼分類，記下最關鍵的一次互動" optional={true} />
                    )}

                    {/* 本週結束，你應該要會 */}
                    <div className="bg-white border border-[var(--border)] rounded-[var(--radius-unified)] overflow-hidden mb-4">
                        <div className="p-4 px-5 bg-[var(--paper-warm)] border-b border-[var(--border)] font-bold text-[13px]">
                            ✅ 本週結束，你應該要會
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-[1px] bg-[var(--border)]">
                            {[
                                '說清楚自己原始資料現況（來源／數量／結構）',
                                '依研究方法定義分析表結構（欄位／編碼類別／N）',
                                '親手做完純人工整理一輪',
                                '若選擇用 AI 補充：知道幻覺/跑偏/掏空判斷的風險並做驗收',
                            ].map((item, i) => (
                                <div key={i} className="p-4 px-5 bg-white flex items-start gap-3">
                                    <span className="text-[var(--success)] text-[16px] mt-0.5 flex-shrink-0">✓</span>
                                    <span className="text-[13px] text-[var(--ink-mid)] leading-relaxed">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <ExportButton
                        weekLabel="W13 資料整理週：原始資料 → 分析表"
                        fields={EXPORT_FIELDS}
                    />

                    {/* 下週預告 */}
                    <div className="p-6 rounded-[var(--radius-unified)] bg-[var(--ink)] text-white">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="bg-[var(--accent)] text-[10px] font-bold px-2 py-0.5 rounded-[2px] font-mono">NEXT WEEK</span>
                            <h3 className="text-[16px] font-bold m-0">W14 預告 · 讓數據自己說話</h3>
                        </div>
                        <div className="grid md:grid-cols-2 gap-6 text-[13px] leading-relaxed">
                            <div>
                                <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--accent)] mb-1">W14 主題</div>
                                <p className="text-[rgba(255,255,255,0.85)] m-0">圖表選擇與圖的說明 + AI 畫圖工作坊。延續 W13 哲學：「先判斷後 AI」——你選圖表類型，Gemini 出圖，你驗收。</p>
                            </div>
                            <div>
                                <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--accent)] mb-1">你要帶來</div>
                                <p className="text-[rgba(255,255,255,0.85)] m-0">本週的<strong>分析表連結</strong>。沒帶 = 下週只能空轉，看別組做圖。</p>
                            </div>
                        </div>
                        <div className="mt-5 flex justify-end">
                            <Link
                                to="/w14"
                                className="inline-flex items-center gap-2 bg-[var(--accent)] text-white px-4 py-2 rounded-[var(--radius-unified)] font-bold text-[13px] hover:opacity-90 transition-opacity"
                            >
                                前往 W14 解碼 <ArrowRight size={14} />
                            </Link>
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
                    <span className="hidden md:inline">研究方法與專題 / 執行檢核 / </span>
                    <span className="text-[var(--ink)] font-bold">資料整理週 W13</span>
                </div>
                <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
                    <span className="bg-[var(--paper-warm)] text-[var(--ink)] text-[10px] font-bold px-2 py-0.5 rounded-[2px] font-mono">100 MINS</span>
                    <ResetWeekButton weekPrefix="w13-" />
                    <span className="hidden md:inline-block bg-[var(--ink)] text-white text-[10px] font-bold px-2 py-0.5 rounded-[2px] font-mono">DATA · PREP</span>
                </div>
            </div>

            {/* HERO */}
            <HeroBlock
                kicker="R.I.B. 調查檔案 · 研究方法與專題 · W13"
                title="資料整理週："
                accentTitle="把原始資料變成可分析的表"
                subtitle="腦袋先有架構，AI 才幫得上忙。今天的核心：你決定分析表的結構（這就是研究本身），先動手做一輪純人工整理；想學 AI 協作可選用。AI 是助理，不是研究者。"
                chain="W11-W12 用第六章工具蒐集到一堆原始資料。本週把它變成「分析表」——欄位清楚、N 值（每組／每筆樣本的數量）明確，下週 W14 才畫得了圖。"
                meta={[
                    { label: '本週任務', value: '5 法對照 · 定義架構（必做）· 動手整理 · 補充 AI（可選）· 繳連結' },
                    { label: '時長', value: '100 MINS' },
                    { label: '課堂產出', value: '結構成型的分析表 + 原始/整理後資料雙繳 Classroom' },
                    { label: '帶去 W14', value: '原始資料 + 整理後分析表（兩份都繳 Classroom）' },
                ]}
            />
            <CourseArc items={[
                { wk: 'W1-W2', name: '探索階段\nRED 公約', status: 'past' },
                { wk: 'W3-W4', name: '題目決定\n方法地圖', status: 'past' },
                { wk: 'W5-W6', name: '操作型定義\n博覽會 / 組隊', status: 'past' },
                { wk: 'W7-W8', name: '文獻搜尋\n寫作引用', status: 'past' },
                { wk: 'W9-W11', name: '工具設計\n預試與倫理', status: 'past' },
                { wk: 'W12', name: '期中短報', status: 'past' },
                { wk: 'W13', name: '資料整理\n原始 → 表', status: 'now' },
                { wk: 'W14-W17', name: '數據解讀\n發表', status: 'future' },
            ]} />

            <TaskCard
                weekNumber="W13"
                weekTitle={W13Data.title}
                duration={`${W13Data.duration} 分鐘 · ${W13Data.durationDesc}`}
                tasks={[
                    '5 法對照 — 你的方法該長成什麼分析表結構',
                    '純人工整理一輪 — 動手做、不靠 AI（你決定結構就是研究本身）',
                    'AI 協作（選用）— AI 當助理、不當研究者',
                ]}
                exportReminder="繳交 Google Sheet 連結 → W14 的圖表選擇從這裡接力"
            />

            {(myTopic || myMethod) && (
                <div className="mt-6 mb-2 px-4 py-3 rounded-[var(--radius-unified)] bg-[var(--paper-warm)] border border-[var(--border)] text-[13px] flex items-start gap-2">
                    <ClipboardCheck size={16} className="mt-0.5 text-[var(--accent)] flex-shrink-0" />
                    <div>
                        {myTopic && (
                            <>
                                <span className="font-bold text-[var(--ink)]">你的研究題目</span>
                                <p className="text-[var(--ink-mid)] mt-0.5">{myTopic}</p>
                            </>
                        )}
                        {myMethod && (
                            <p className="text-[12px] text-[var(--ink-light)] mt-1">登記的研究方法：{myMethod}</p>
                        )}
                    </div>
                </div>
            )}

            {/* STEP ENGINE */}
            <StepEngine
                steps={steps}
                prevWeek={{ label: '回 W12 期中短報', to: '/w12' }}
                nextWeek={{ label: '前往 W14 圖表與圖說', to: '/w14' }}
                flat
            />
        </div>
    );
};

export { W13AutonomyPage };
export default W13AutonomyPage;
