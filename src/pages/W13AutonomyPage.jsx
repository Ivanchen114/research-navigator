import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import CourseArc from '../components/ui/CourseArc';
import HeroBlock from '../components/ui/HeroBlock';
import ThinkRecord from '../components/ui/ThinkRecord';
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
    },
    {
        id: 'observation',
        emoji: '👀',
        name: '觀察法',
        rawSrc: '04_觀察紀錄表.xlsx（多份）',
        rawState: '✅ 半結構化',
        targetTable: '彙整成「行為類別 × 次數/時間」總表',
        steps: '多份紀錄 → 行為類別合併 → 加總頻次',
        accent: '#D97706',
    },
    {
        id: 'literature',
        emoji: '📚',
        name: '文獻分析法',
        rawSrc: '05a-d 編碼表.xlsx',
        rawState: '✅ 半結構化',
        targetTable: '彙整成可視化用表（時間軸 / 立場分布 / 詞頻）',
        steps: '多份編碼 → 主題彙整 → 製作分析欄位',
        accent: '#DC2626',
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
            '依研究問題決定彙整維度（時間軸 / 立場 / 詞頻 / 主題）',
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
        title: '結構清楚 · 可直接貼給 AI',
        accent: 'var(--success)',
        bg: '#F0FDF4',
        border: '#86EFAC',
        icon: Coffee,
        guide: '今天課程結尾把「分析表連結」貼上，再寫一行「我下週想叫 Gemini 畫的第一張圖是什麼」。下週 W14 開機速度會比別組快一截。',
    },
    {
        id: 'warning',
        label: '🟡 半成品',
        title: '結構有了 · 還在補資料 / 檢查',
        accent: '#D97706',
        bg: '#FFFBEB',
        border: '#FCD34D',
        icon: AlertTriangle,
        guide: '今天剩下時間優先補完。卡在哪寫進「我的資料現況」欄位，下週 W14 進來前老師會挑黃燈組先看。',
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
    { key: 'w13-method', label: '我的研究方法', question: '問卷／訪談／實驗／觀察／文獻分析' },
    { key: 'w13-data-state', label: '我的原始資料現況', question: '我手上原本的資料是什麼樣子？來自哪裡？' },
    { key: 'w13-table-structure', label: '我的分析表結構（必做）', question: '欄位名稱列表 + 列數 + N 值 + 編碼類別（如果是訪談/觀察/文獻）' },
    { key: 'w13-route-choice', label: '我選的整理路線', question: '純人工 or AI 輔助？為什麼？' },
    { key: 'w13-ai-validation', label: 'AI 輔助驗收紀錄（路線 B 必填）', question: '我做了哪些驗收？發現 AI 哪裡跑偏 / 幻覺？' },
    { key: 'w13-ai-dialog-submission', label: 'AI 完整對話繳交方式（路線 B 必填）', question: '我用哪種方式繳交完整對話？（A 私人註解 / B 文件上傳並貼連結）' },
    { key: 'w13-table-link', label: '分析表連結（必繳）', question: '我的 Google Sheet（或 Excel）公開／可閱讀連結' },
    { key: 'w13-progress-status', label: '整理進度自評', question: '🟢 已成型／🟡 半成品／🔴 還在掙扎' },
    { key: 'w13-w14-question', label: 'W14 第一張圖', question: '下週我要請 Gemini 幫我畫的第一張圖是什麼？想看什麼變項？' },
    { key: 'w13-aired-record', label: 'AI-RED 敘事紀錄（路線 B 必填）', question: '本週用 AI 整理資料的最重要互動（A-I-R-E-D 五要素）' },
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
    const myMethod = saved['w8-tool-method'] || saved['w7-method-choice'] || '';

    const steps = [
        {
            title: '認識資料 + AI 真相',
            icon: <Database size={18} />,
            content: (
                <div className="flex flex-col gap-6 prose-zh">
                    {/* 核心原則 */}
                    <div className="p-5 rounded-[var(--radius-unified)] border-2 border-[var(--accent)] bg-[#F8F8FB]">
                        <p className="text-[15px] font-bold text-[var(--accent)] mb-2">🧠 核心原則：腦袋先有架構，AI 才幫得上忙</p>
                        <p className="text-[12px] text-[var(--ink)] leading-relaxed">
                            <strong>你是研究者，AI 是助理</strong>。今天的任務是把原始資料變成可分析的表——
                            這件事「<strong>結構怎麼設</strong>」必須你決定（這就是你的研究本身）；「<strong>內容怎麼填</strong>」可以選擇人工或 AI 輔助。
                            如果 AI 連結構都替你想，你做的就不是研究，是驗收 AI 做的研究。
                        </p>
                    </div>

                    {/* 5 法對照表 */}
                    <div>
                        <p className="text-[13px] font-bold text-[var(--ink)] mb-3">📊 5 種方法 · 原始資料 → 分析表 對照</p>
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
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* AI 能 vs 不能 */}
                    <div>
                        <p className="text-[13px] font-bold text-[var(--ink)] mb-3">🤖 AI 能幫你什麼？不能幫什麼？</p>
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
                    </div>

                    {/* AI 三大風險 */}
                    <div>
                        <p className="text-[13px] font-bold text-[var(--ink)] mb-3 flex items-center gap-2">
                            <ShieldAlert size={16} className="text-[#DC2626]" />
                            ⚠️ 用 AI 整理資料的三大風險（每個學生都要懂）
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {AI_RISKS.map((r, i) => (
                                <div key={i} className="rounded-[var(--radius-unified)] border border-[#FCD34D] bg-[#FFFBEB] p-4">
                                    <p className="text-[14px] font-bold text-[#92400E] mb-2">{r.emoji} {r.title}</p>
                                    <p className="text-[11px] text-[#78350F] leading-relaxed mb-2">{r.body}</p>
                                    <p className="text-[11px] text-[#92400E] leading-relaxed border-t border-[#FCD34D] pt-2">
                                        <strong>對策：</strong>{r.safeguard}
                                    </p>
                                </div>
                            ))}
                        </div>
                        <p className="text-[11px] text-[var(--ink-light)] italic mt-3 leading-relaxed">
                            💡 用了 AI 一定要跑 AI-RED 紀錄（A=工具、I=指令、R=回覆、E=評價、D=決策），下方繳交區會強制要求填。
                        </p>
                    </div>

                    {/* AI 協作三原則 + 對話四步驟（W13/14/15 共用） */}
                    <AICollaborationPrinciples week="13" role="assistant" />

                    {/* 自我定位 */}
                    <ThinkRecord
                        dataKey="w13-method"
                        prompt="① 我的研究方法是？（單選）"
                        scaffold={['問卷法 / 訪談法 / 實驗法 / 觀察法 / 文獻分析法']}
                    />
                    <ThinkRecord
                        dataKey="w13-data-state"
                        prompt="② 我手上的原始資料現在是什麼狀態？"
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
            title: '定義分析架構（必做）',
            icon: <Brain size={18} />,
            content: (
                <div className="flex flex-col gap-6 prose-zh">
                    <div className="p-4 rounded-[var(--radius-unified)] border-2 border-[#FCA5A5] bg-[#FEF2F2]">
                        <p className="text-[14px] font-bold text-[#991B1B] mb-1 flex items-center gap-2">
                            <ShieldAlert size={16} /> 這一步絕對自己做 · 不能外包給 AI
                        </p>
                        <p className="text-[12px] text-[#7F1D1D] leading-relaxed">
                            <strong>分析表的「結構」=你的研究的概念框架</strong>。欄位定錯，後面整理再漂亮也是廢的。
                            訪談、文獻組更要小心：你定的「主題編碼類別」就是你的研究本身——AI 替你定，你研究就被掏空。
                        </p>
                    </div>

                    {/* 三個範本（建表組） */}
                    <div>
                        <p className="text-[13px] font-bold text-[var(--ink)] mb-3">📋 路徑 A · 從零建分析表（問卷／訪談／實驗組）</p>
                        <div className="grid grid-cols-1 gap-3">
                            {TABLE_TEMPLATES.map((t) => (
                                <details key={t.id} className="rounded-[var(--radius-unified)] border border-[var(--border)] bg-white">
                                    <summary className="px-4 py-3 cursor-pointer flex items-center gap-2 hover:bg-[var(--paper-warm)] transition-colors">
                                        <span className="text-[16px]">{t.emoji}</span>
                                        <span className="text-[13px] font-bold text-[var(--ink)]">{t.name}</span>
                                        <span className="ml-auto text-[10px] font-mono text-[var(--ink-light)]">▼ 點開看結構</span>
                                    </summary>
                                    <div className="border-t border-[var(--border)] p-4 bg-[#FAFAF9]">
                                        <table className="w-full text-[12px]">
                                            <thead>
                                                <tr className="border-b border-[var(--border)]">
                                                    <th className="text-left py-2 px-2 font-mono text-[10px] text-[var(--ink-light)]">欄位位置</th>
                                                    <th className="text-left py-2 px-2 font-mono text-[10px] text-[var(--ink-light)]">內容</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {t.rows.map((r, i) => (
                                                    <tr key={i} className="border-b border-[var(--border)]">
                                                        <td className="py-2 px-2 font-mono text-[var(--ink)]">{r.col}</td>
                                                        <td className="py-2 px-2 text-[var(--ink-mid)]">{r.desc}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        <p className="mt-3 text-[11px] text-[var(--ink-mid)] italic leading-relaxed">
                                            💡 {t.tip}
                                        </p>
                                    </div>
                                </details>
                            ))}
                        </div>
                    </div>

                    {/* 彙整教學（觀察 / 文獻組） */}
                    <div>
                        <p className="text-[13px] font-bold text-[var(--ink)] mb-3">🔧 路徑 B · 彙整 xlsx 工具（觀察／文獻組）</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {CONSOLIDATE_GUIDE.map((g) => (
                                <div key={g.id} className="rounded-[var(--radius-unified)] border border-[var(--border)] bg-white overflow-hidden">
                                    <div className="px-4 py-2 flex items-center gap-2 bg-[var(--paper-warm)] border-b border-[var(--border)]">
                                        <span className="text-[16px]">{g.emoji}</span>
                                        <span className="text-[13px] font-bold text-[var(--ink)]">{g.name}</span>
                                    </div>
                                    <ol className="px-5 py-3 list-decimal text-[12px] text-[var(--ink-mid)] leading-relaxed flex flex-col gap-1">
                                        {g.steps.map((s, i) => (
                                            <li key={i}>{s}</li>
                                        ))}
                                    </ol>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 表結構必做（不能外包） */}
                    <div className="p-4 rounded-[var(--radius-unified)] border border-[#BFDBFE] bg-[#EFF6FF]">
                        <p className="text-[12px] text-[#1E40AF] font-bold mb-2">📝 寫下你的分析表結構（這步必須自己做）</p>
                        <p className="text-[12px] text-[#1E3A8A] leading-relaxed mb-2">
                            打開 Google Sheets，依範本／彙整步驟，先把<strong>欄位名稱</strong>列出來。
                            訪談組、觀察組、文獻組必須在下方額外寫出「編碼類別 / 行為類別 / 分析維度」清單——這就是你研究的概念框架。
                        </p>
                    </div>

                    <ThinkRecord
                        dataKey="w13-table-structure"
                        prompt="③ 我的分析表結構（欄位＋編碼類別）"
                        scaffold={[
                            '欄位有：（列出 5-10 個欄位名稱，對應研究問題）',
                            '訪談組 / 觀察組 / 文獻組額外寫：編碼類別 / 行為類別 / 分析維度（5-8 個）',
                            'N 值（樣本數）：__',
                        ]}
                    />
                </div>
            ),
        },
        {
            title: '選路線 + 動手整理',
            icon: <Route size={18} />,
            content: (
                <div className="flex flex-col gap-6 prose-zh">
                    <div className="p-4 rounded-[var(--radius-unified)] border border-[var(--border)] bg-[var(--paper-warm)]">
                        <p className="text-[14px] font-bold text-[var(--ink)] mb-1">🛣️ 你決定整理路線</p>
                        <p className="text-[12px] text-[var(--ink-mid)] leading-relaxed">
                            結構定好後，<strong>內容怎麼填</strong>是你的選擇——純人工或 AI 輔助。
                            兩條路線都可以做出好的分析表，差別是時間成本與你想學什麼。
                        </p>
                    </div>

                    {/* 路線選擇兩按鈕 */}
                    <div>
                        <p className="text-[13px] font-bold text-[var(--ink)] mb-2">⏱️ 選一條路線</p>
                        <RouteSelector value={route} onChange={handleRoute} />
                    </div>

                    {/* 路線 A 指引（純人工） */}
                    {route === 'manual' && (
                        <div className="rounded-[var(--radius-unified)] border-2 border-[#BFDBFE] bg-[#EFF6FF] p-5">
                            <p className="text-[14px] font-bold text-[#1E40AF] mb-3">🧑 路線 A · 純人工整理指引</p>
                            <div className="space-y-3 text-[12px] text-[#1E3A8A] leading-relaxed">
                                <div>
                                    <p className="font-bold mb-1">執行步驟：</p>
                                    <ol className="list-decimal pl-5 space-y-1">
                                        <li>打開你的 Google Sheet（已建好欄位 header）</li>
                                        <li>依結構逐筆填入（訪談組：邊讀逐字稿邊編碼）</li>
                                        <li>每填 10 筆做一次抽檢（避免疲勞錯誤）</li>
                                        <li>檢查 N 值是否標清楚</li>
                                    </ol>
                                </div>
                                <div className="border-t border-[#BFDBFE] pt-3">
                                    <p className="font-bold mb-1">老師巡視重點：</p>
                                    <ul className="list-disc pl-5 space-y-1">
                                        <li>欄位是否對應研究問題</li>
                                        <li>編碼類別是否互斥（不會一筆資料同時屬於兩類）</li>
                                        <li>是否有不知道怎麼編的「灰色資料」（這需要老師討論）</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 路線 B 工作坊（AI 輔助） */}
                    {route === 'ai-assist' && (
                        <div className="rounded-[var(--radius-unified)] border-2 border-[#DDD6FE] bg-[#F5F3FF] p-5 space-y-4">
                            <p className="text-[14px] font-bold text-[#5B21B6]">🤖 路線 B · AI 輔助整理工作坊</p>

                            {/* AI 模式選擇 */}
                            <AIModePicker week="13" taskName="資料整理" onChange={setAiMode} />

                            {/* 教學型：完全不會 → AI 給範例 */}
                            {aiMode === 'teach' && (
                                <div className="rounded-[var(--radius-unified)] border-2 border-[#86EFAC] bg-white p-4">
                                    <p className="text-[13px] font-bold text-[#166534] mb-2">🎓 教學型 Prompt（從零到一）</p>
                                    <p className="text-[11px] text-[#166534] leading-relaxed mb-3">
                                        貼給 Gemini Pro（思考模式）。記得 AI 給範例後，<strong>你要自己改寫一次</strong>，不要只複製。
                                    </p>
                                    <pre className="bg-[#0F172A] text-[#E2E8F0] text-[11.5px] leading-[1.7] p-3 rounded-[6px] whitespace-pre-wrap font-mono overflow-x-auto">{`我有 N=___ 份[問卷／訪談／實驗／觀察／文獻]研究蒐集到的原始資料，
但我完全不知道怎麼整理成「可分析的表」。

我的研究問題是：___

【請你做】
1. 教我「分析表」應該長什麼樣子（給 1 個極簡範例，不超過 10 行）
2. 列出我這個方法該有的 5-6 個關鍵欄位（含說明）
3. 給我可以照著做的步驟（3-5 步）

【不要做】
- 不要替我做完整張表
- 不要直接給我「最終版」答案
- 我看完範例後會自己照著做一遍`}</pre>
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
                                    <pre className="bg-[#0F172A] text-[#E2E8F0] text-[11.5px] leading-[1.7] p-3 rounded-[6px] whitespace-pre-wrap font-mono overflow-x-auto">{`我做好了一張分析表，請你幫我把資料填進去 / 檢查結構。

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

請嚴格依照我的編碼規則，不要自行擴充。`}</pre>
                                </div>
                            )}

                            {!aiMode && (
                                <div className="rounded-[var(--radius-unified)] border border-[var(--border)] bg-[var(--paper-warm)] p-3">
                                    <p className="text-[12px] text-[var(--ink-mid)] leading-relaxed">
                                        ☝️ 上方先選一個 AI 使用模式，這裡會顯示對應的 prompt 範本。
                                    </p>
                                </div>
                            )}

                            {/* 強制驗收清單 */}
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
                                <ul className="text-[11px] text-[#7F1D1D] leading-relaxed space-y-1">
                                    <li>☐ 隨機抽 30% 樣本，<strong>我自己編碼一次</strong></li>
                                    <li>☐ 跟 AI 編碼結果比對</li>
                                    <li>☐ 差異率 &gt;20%：重新定義類別 + 重編一輪</li>
                                    <li>☐ 把差異最大的 2-3 筆寫進「AI 驗收紀錄」</li>
                                </ul>
                            </div>

                            {/* AI 驗收紀錄 */}
                            <ThinkRecord
                                dataKey="w13-ai-validation"
                                prompt="④ AI 輔助驗收紀錄（路線 B 必填）"
                                scaffold={[
                                    '我抽了哪幾筆驗收：（前 5 / 中 5 / 抽 30%）',
                                    '我發現 AI 哪裡跑偏 / 幻覺：',
                                    '我做了什麼修正：',
                                ]}
                            />

                            {/* 完整對話繳交（共用元件） */}
                            <AIDialogSubmission week="13" taskName="資料整理對話" required={true} />
                        </div>
                    )}

                    {/* 路線選擇 ThinkRecord */}
                    <ThinkRecord
                        dataKey="w13-route-choice"
                        prompt="⑤ 我選的整理路線 + 為什麼"
                        scaffold={[
                            '我選：純人工 / AI 輔助',
                            '原因：（資料量／我的方法／我想練什麼…）',
                        ]}
                    />

                    {/* 進度自評 */}
                    <div>
                        <p className="text-[13px] font-bold text-[var(--ink)] mb-2">📍 整理進度自評（誠實標記）</p>
                        <p className="text-[12px] text-[var(--ink-mid)] mb-3">
                            這個自評不打分數，只決定老師巡視時誰先看。
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
            title: '收尾繳交',
            icon: <FileCheck size={18} />,
            content: (
                <div className="flex flex-col gap-6 prose-zh">
                    <div className="p-4 rounded-[var(--radius-unified)] border border-[var(--border)] bg-[var(--paper-warm)]">
                        <p className="text-[14px] font-bold text-[var(--ink)] mb-1">📤 下課前 10 分鐘 · 三件事一定要做完</p>
                        <p className="text-[12px] text-[var(--ink-mid)] leading-relaxed">
                            ① 貼分析表連結 ② 寫 W14 第一張圖 ③ 路線 B 學生加 AI-RED 紀錄。沒交連結 = 沒繳。
                        </p>
                    </div>

                    {/* 分析表連結（必繳） */}
                    <ThinkRecord
                        dataKey="w13-table-link"
                        prompt="⑥ 分析表連結（必繳）"
                        placeholder="貼上你的 Google Sheet 公開連結（或 Excel 雲端檔連結）。確認權限是「知道連結的人可以檢視」。"
                        rows={2}
                    />

                    {/* W14 第一張圖 */}
                    <ThinkRecord
                        dataKey="w13-w14-question"
                        prompt="⑦ W14 我要請 Gemini 畫的第一張圖"
                        scaffold={[
                            '我想看的：（趨勢／比例／關係／排名）',
                            '涉及變項：（X = ___，Y = ___）',
                            '預期可能的圖表類型：（折線／圓餅／長條／散佈）',
                        ]}
                    />

                    {/* AI-RED（路線 B 強制） */}
                    {route === 'ai-assist' ? (
                        <div className="rounded-[var(--radius-unified)] border-2 border-[#DDD6FE] bg-[#F5F3FF] p-4">
                            <p className="text-[12px] font-bold text-[#5B21B6] mb-2">🤖 路線 B · AI-RED 紀錄（強制）</p>
                            <p className="text-[11px] text-[#4C1D95] mb-3 leading-relaxed">
                                你用了 AI 整理資料，必須留下完整的 A-I-R-E-D 紀錄——這是學術倫理，也是讓你之後讀書摘時記得自己做了什麼決定。
                                <strong>注意：</strong>AIRED 是「事後重述一次最關鍵的互動」；上方還要繳<strong>完整對話</strong>，兩者不衝突。
                            </p>
                            <AIREDNarrative week="13" hint="本週用 AI 整理資料：A=Gemini Pro / I=結構化 prompt / R=AI 填出的表 / E=驗收結果（哪裡好哪裡跑偏）/ D=採納哪些、改了哪些" />
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
                                '判斷自己適合純人工 or AI 輔助路線',
                                '若用 AI：知道幻覺/跑偏/掏空判斷的風險並做驗收',
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
                subtitle="腦袋先有架構，AI 才幫得上忙。今天的核心：你決定分析表的結構（這就是研究本身），然後選擇用純人工或 AI 輔助來填內容。AI 是助理，不是研究者。"
                chain="W11-W12 用第六章工具蒐集到一堆原始資料。本週把它變成「分析表」——欄位清楚、N 值明確，下週 W14 才畫得了圖。"
                meta={[
                    { label: '本週任務', value: '5 法對照 · 定義架構（必做）· 選路線整理 · 繳連結' },
                    { label: '時長', value: '100 MINS' },
                    { label: '課堂產出', value: '結構成型的分析表 + Google Sheet 連結 + 路線決定' },
                    { label: '帶去 W14', value: '分析表連結（W14 直接讀取做圖）' },
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
