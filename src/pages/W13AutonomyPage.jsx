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
import StepBriefing from '../components/ui/StepBriefing';
import ResetWeekButton from '../components/ui/ResetWeekButton';
import AIREDNarrative from '../components/ui/AIREDNarrative';
import AICollaborationPrinciples from '../components/ui/AICollaborationPrinciples';
import AIModePicker from '../components/ui/AIModePicker';
import { ResearcherRedlines } from '../components/ui/ResearcherRedlines';
import TrapRewritePractice from '../components/ui/TrapRewritePractice';
import { readRecords } from '../components/ui/ThinkRecord';
import { ModeProvider, useMode } from '../context/ModeContext';
import { useProjector } from '../context/ProjectorContext';
import ModeSwitch from '../components/ui/ModeSwitch';
import DepthBlock from '../components/ui/DepthBlock';
import RecordDrawer from '../components/ui/RecordDrawer';
import ExportButton from '../components/ui/ExportButton';
import ContentTypeChip from '../components/ui/ContentTypeChip';
import {
    Database,
    Route,
    FileCheck,
    ArrowRight,
    Coffee,
    AlertTriangle,
    Flame,
    ClipboardCheck,
    Bot,
    ShieldAlert,
} from 'lucide-react';

/* ══════════════════════════════════════
 *  資料常數
 * ══════════════════════════════════════ */

/* 5 法 原始資料 → 分析表 對照
 * 統一大主題：高中生手機使用與學習表現／課堂專注的關係
 * raw  → 字串（原始資料是散亂的，保留「亂」的感覺）
 * table → { headers, rows, note } 物件（整理後用格子顯示）
 */
const METHOD_TABLE = [
    {
        id: 'survey',
        emoji: '📋',
        name: '問卷法',
        rawSrc: 'Google Forms 後台回應 / 紙本',
        targetTable: '每個人一列，每題一欄，格子裡填代碼數字',
        steps: '匯出 CSV → 刪無效樣本 → 變項代碼化 → 標 N',
        accent: '#2563EB',
        example: {
            topic: '高中生手機使用與學習成績調查',
            question: '高中生每天使用手機的時間與學習成績之間，有沒有關聯？',
            variables: '計畫書第二章定義了三個要測的東西：\n①「每日手機使用時間」（Q1，四個選項）\n②「手機主要用途」（Q2，學習／社交／娛樂／短影音，複選）\n③「學習表現」（Q3，最近一次段考成績區間，自填）\n→ 這三項就是分析表的欄位來源，整理前先對照確認\n\n⚠️ 注意：這份研究只能看「手機使用時間和成績是否一起變化」的關聯，不能直接說手機使用造成成績變好或變差。分析時用「關聯」「趨勢」，不要用「影響」「造成」。',
            raw: {
                headers: ['時間戳記', 'Q1 每天用幾小時', 'Q2 主要用途', 'Q3 段考成績區間'],
                rows: [
                    ['2026/4/15 14:23', '4–6 小時', '短影音、聊天', '70–79 分'],
                    ['2026/4/15 14:30', '1–2 小時', '查資料、看教學', '80–89 分'],
                    ['2026/4/15 14:32', '6 小時以上', '短影音+遊戲', '60–69 分'],
                    ['2026/4/15 14:40', '（沒填）', '（沒填）', '（沒填）← 無效'],
                ],
            },
            table: {
                headers: ['樣本編號', 'Q1 時間', 'Q2_學習', 'Q2_社交', 'Q2_娛樂', 'Q2_短影音', 'Q3 成績'],
                rows: [
                    ['S001', '3', '0', '0', '0', '1', '3'],
                    ['S002', '1', '1', '0', '0', '0', '4'],
                    ['S003', '4', '0', '0', '1', '1', '2'],
                    ['…', '…', '…', '…', '…', '…', '…'],
                ],
                note: 'N=85（已扣除 4 份無效）\n代碼 Q1：1=2h以下　2=2–4h　3=4–6h　4=6h以上\n代碼 Q3：5=90+　4=80–89　3=70–79　2=60–69　1=60以下',
            },
        },
    },
    {
        id: 'interview',
        emoji: '🎤',
        name: '訪談法',
        rawSrc: '錄音 / 逐字稿',
        targetTable: '每位受訪者一列，每個主題一欄，格子裡填「提到幾次」',
        steps: '逐字稿（訪談錄音打成文字）→ 主題編碼（幫每段話貼分類標籤）→ 統計各議題出現次數',
        accent: '#7C3AED',
        example: {
            topic: '高中生如何理解手機對學習的影響',
            question: '高中生自己怎麼看待手機使用對學習的幫助與干擾？他們有沒有試過控制？',
            variables: '計畫書第二章原本只列兩個類目（幫助/干擾），讀完逐字稿後擴充成四個：\n①學習用途（查資料、看教學影片）\n②分心來源（通知、IG、遊戲）\n③自我控制方式（關通知、放遠、定時）\n④對手機的態度（矛盾、接受、排斥）\n\n訪談的分類可以根據資料修正，但每次新增或合併類別，都要記下：我改了什麼？為什麼這樣改？這樣才是研究，不是整理心得。',
            raw: `受訪者 A（03:42）：「我本來只是要查單字，結果
查完就順手滑 IG，後來發現半小時過去了……」

受訪者 B（07:15）：「我會用手機看教學影片，所以
不一定都是壞事，但旁邊跳通知就會分心。」

受訪者 C（02:30）：「我試過把手機放外面，但
還是會忍不住走出去拿。」`,
            table: {
                headers: ['受訪者', '學習用途', '分心來源', '自我控制', '態度'],
                rows: [
                    ['A', '1 次', 'IG/通知', '沒有方法', '矛盾'],
                    ['B', '3 次', '通知', '關通知', '接受'],
                    ['C', '0', '遊戲', '放遠', '排斥'],
                ],
                note: 'N=6 位受訪者\n📌 同一人提到同一類目多次就逐次計。「計次數」還是「計人數」，研究時自己決定並寫清楚。',
            },
        },
    },
    {
        id: 'experiment',
        emoji: '🧪',
        name: '實驗法',
        rawSrc: '實驗紀錄表 docx',
        targetTable: '每個受試者一列，前測分數、後測分數、差值各一欄',
        steps: '紀錄抽出 → 結構化 → 計算組別均值/差值',
        accent: '#059669',
        example: {
            topic: '手機通知對閱讀理解的影響實驗',
            question: '閱讀時手機通知開啟，會不會讓閱讀理解測驗的表現變差？',
            variables: '計畫書第二章的操作型定義：\n①「自變項」：通知狀態（通知開啟組 / 手機收起組）\n②「依變項」：閱讀理解小測驗分數（10 題）\n③「控制變項」：閱讀時間固定 8 分鐘\n→ 差值（通知組 vs. 關通知組均分差）是衡量效果的指標',
            raw: `2026/4/15 第一節（手寫紀錄）
P01（通知組）閱測 7 分，完成時間 9 分鐘，碰手機 3 次
P02（關通知組）閱測 9 分，完成時間 7 分鐘，碰手機 0 次
P03（通知組）閱測 6 分，完成時間 10 分鐘，碰手機 4 次
（散頁手寫，部分數字潦草）`,
            table: {
                headers: ['受試者', '組別', '閱測分數', '完成時間(分)', '碰手機次數'],
                rows: [
                    ['P01', '通知組', '7', '9', '3'],
                    ['P02', '關通知組', '9', '7', '0'],
                    ['P03', '通知組', '6', '10', '4'],
                    ['…', '…', '…', '…', '…'],
                ],
                note: '組別均分：通知組 6.8 / 關通知組 8.5\nN=24（通知 12 + 關通知 12）',
            },
        },
    },
    {
        id: 'observation',
        emoji: '👀',
        name: '觀察法',
        rawSrc: '04_觀察紀錄表.xlsx（多份）',
        targetTable: '每種行為一列，每節觀察一欄，格子裡填「出現幾次」',
        steps: '多份紀錄 → 行為類別合併 → 加總頻次',
        accent: '#D97706',
        example: {
            topic: '自習課手機使用與專注行為觀察',
            question: '學生在自習課中，手機使用行為與專注行為各佔多少比例？',
            variables: '計畫書第二章把「課堂行為」定義成四種可觀察類目：\n①書寫/閱讀（專注）\n②課業查詢（用手機查資料，視為有效使用）\n③滑手機（非學習用途）\n④聊天或離座\n→ 每次取樣記錄當下屬哪一類，填進紀錄表',
            raw: `2026/4/15 第六節自習（第一次觀察）
13:10 - A 同學：書寫
13:15 - A 同學：看手機螢幕（非課業）
13:20 - A 同學：書寫
13:25 - A 同學：與鄰座說話
（共觀察 4 節，每節每 5 分鐘取樣一次）`,
            table: {
                headers: ['行為類別', '第 1 節觀察', '第 2 節觀察', '第 3 節觀察', '第 4 節觀察', '總次數'],
                rows: [
                    ['書寫/閱讀', '8', '5', '6', '4', '23 (19%)'],
                    ['課業查詢(手機)', '2', '1', '1', '2', '6 (5%)'],
                    ['滑手機(非課業)', '12', '14', '11', '13', '50 (42%)'],
                    ['聊天/離座', '6', '8', '9', '7', '30 (25%)'],
                    ['其他', '2', '2', '3', '4', '11 (9%)'],
                ],
                note: 'N=4 節 × 30 次取樣 = 120 筆',
            },
        },
    },
    {
        id: 'literature',
        emoji: '📚',
        name: '文獻分析法',
        rawSrc: '05a-d 編碼表.xlsx',
        targetTable: '每篇文獻一列，分析類目各一欄，格子裡填你的編碼結果',
        steps: '多份編碼 → 主題彙整 → 製作分析欄位',
        accent: '#DC2626',
        example: {
            topic: '手機使用與學習表現相關研究分析',
            question: '現有研究如何解釋手機使用與學習表現之間的關係？結論一致嗎？',
            variables: '⚠️ 文獻分析不是把每篇文章摘要一次，而是把不同文章放進同一張表，比較它們怎麼回答同一個問題。\n\n計畫書第二章定義了四個分析類目：\n①手機使用的定義方式（時間/目的/情境）\n②學習表現的測量方式（成績/專注/自評）\n③研究主要發現（正關聯/負關聯/無明顯關係）\n④研究限制（樣本少/自填資料/無法推論因果）\n→ 每篇文獻逐欄編碼，整理後才能比較不同研究的說法',
            raw: `文章 A：研究每日使用時間與學期成績的關係
文章 B：研究課堂通知干擾對注意力的影響
文章 C：研究用手機查資料是否提升學習效率
（各篇格式不同，結論說法各異）`,
            table: {
                headers: ['文獻', '手機使用定義', '學習表現指標', '主要發現', '研究限制'],
                rows: [
                    ['A', '每日使用時數', '學期成績', '使用時間高→成績趨低', '自填資料'],
                    ['B', '通知干擾次數', '注意力測驗', '通知多→專注趨降', '樣本少(N=30)'],
                    ['C', '學習用途比例', '學習效率自評', '查資料有關聯', '無法推論因果'],
                ],
                note: 'N=12 篇',
            },
        },
    },
];

/* AI 整理的三大風險（直接告訴學生） */
const AI_RISKS = [
    {
        title: '幻覺',
        emoji: '👻',
        body: 'AI 會自動「補」沒有的資料、虛構引用語錄、編造你沒提過的類別。看起來合理，實際上是憑空生成。',
        safeguard: '對照原始資料逐筆驗收，特別是 AI 加上去你沒輸入的東西。',
    },
    {
        title: '跑偏',
        emoji: '🧭',
        body: 'AI 會用它「以為」的研究框架整理，不是你的。例如你研究「同儕壓力」，AI 全歸到「家庭壓力」。',
        safeguard: '事先寫清楚編碼類別 / 變項定義給 AI，要求嚴格分類。',
    },
    {
        title: '把判斷交給 AI',
        emoji: '🪤',
        body: '訪談、文獻組的「分類」就是研究本身。全外包等於 AI 做研究、你變成驗收員——研究不是你做的。',
        safeguard: '訪談、文獻組必須自己定義分類框架，AI 只能填內容。',
    },
];

/* AI 能與不能的對照 */
const AI_CAN_DO = [
    '整理 CSV 格式（刪空白列、統一格式）',
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
        guide: '今天課程結尾雙線繳交——小組：原始資料 + 整理後分析表連結；個人：W13 歷程 docx（雷 #9 改寫 + AI-RED 如有）。下週 W14 開機速度會比別組快一截。',
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
        guide: '直接舉手叫老師——10 分鐘一對一，一起決定「最小可分析版本」。今天結束前至少要有一張結構（可以資料還沒填滿）。',
    },
];

/* ExportButton 欄位 */
const EXPORT_FIELDS = [
    // 小組產出（計畫書/工具書/Google Sheet）不在這裡記錄
    { key: 'w13-table-link', label: '小組分析表連結（Google Sheet）', question: '整理後分析表的雲端連結——W14 會帶這條連結進來' },
    { key: 'w13-progress-status', label: '整理進度自評', question: '🟢 已成型／🟡 半成品／🔴 還在掙扎' },
    // 個人 AI 使用紀錄
    { key: 'w13-aired-record', label: 'AI-RED 敘事紀錄（用了 AI 必填）', question: '本週用 AI 整理資料的最重要互動（A-I-R-E-D 五要素）' },
    // 個人反思與練習
    { key: 'w13-trap-rewrite-9', label: '雷 #9 改寫練習（個人繳交項）', question: '把「疑似」這種模糊剔除規則改成事前可驗證的句型' },
    // 行政繳交
    { key: 'w13-classroom-submit', label: 'Classroom 繳交檢核', question: '已勾選的繳交項目' },
];

/* — RecordDrawer：不匯出、但要在總覽顯示的「元件自帶 dataKey」— */
const RECORD_EXTRA_FIELDS = [
    { key: 'w13-ai-mode', label: 'AI 使用模式選擇', store: 'records' },
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
 *  DataGrid：把 { headers, rows, note } 渲染成真格子
 *  若傳入字串，退回 <pre> 顯示（相容舊格式）
 * ══════════════════════════════════════ */

const DataGrid = ({ data }) => {
    if (typeof data === 'string') {
        return (
            <pre className="text-[10.5px] text-[var(--ink-mid)] bg-white border border-[var(--border)] rounded p-2 overflow-x-auto whitespace-pre leading-relaxed font-mono">
                {data}
            </pre>
        );
    }
    return (
        <div>
            <div className="overflow-x-auto rounded border border-[var(--border)] bg-white">
                <table className="w-full text-[10.5px] border-collapse min-w-max">
                    <thead>
                        <tr className="bg-[#F3F4F6]">
                            {data.headers.map((h, i) => (
                                <th key={i} className="px-2.5 py-1.5 text-left font-bold text-[var(--ink)] border-b border-r border-[var(--border)] last:border-r-0 whitespace-nowrap">
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.rows.map((row, i) => (
                            <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-[#FAFAF9]'}>
                                {row.map((cell, j) => (
                                    <td key={j} className="px-2.5 py-1.5 text-[var(--ink-mid)] border-b border-r border-[var(--border)] last:border-r-0 whitespace-nowrap">
                                        {cell}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {data.note && (
                <p className="text-[10px] text-[var(--ink-light)] mt-1.5 leading-relaxed whitespace-pre-line">
                    {data.note}
                </p>
            )}
        </div>
    );
};

/* ══════════════════════════════════════
 *  主頁面
 * ══════════════════════════════════════ */

const W13PageContent = () => {
    const { mode } = useMode();
    const { projector } = useProjector();
    const [status, setStatus] = useState(() => {
        try {
            const r = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
            return r[STATUS_KEY] || '';
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

    const handleAiMode = (mode) => {
        setAiMode(mode);
        try {
            const r = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
            r['w13-ai-mode'] = mode;
            localStorage.setItem(STORAGE_KEY, JSON.stringify(r));
        } catch {}
    };

    const picked = STATUS_OPTIONS.find(o => o.id === status);

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
                    <StepBriefing
                        lines={[
                            { label: '節奏', text: '跟老師做（第一節前半，約 20 分鐘）' },
                            { label: '學', text: '3 條資料整理紅線：異常值 ≠ 直接剔除 / 規則要事前明示 / 保留原始紀錄' },
                            { label: '做', text: '去「找雷挑戰」找出 AI 報告踩了哪幾條雷（10 分鐘）' },
                        ]}
                    />
                    {/* ⭐ 開場·必看：AI 報告找雷大挑戰（連到反面教材頁）*/}
                    <Link
                        to="/find-traps"
                        className="block p-5 rounded-[var(--radius-unified)] bg-gradient-to-br from-[var(--ink)] to-[#1E293B] text-white shadow-xl no-underline hover:shadow-2xl transition-all hover:-translate-y-0.5"
                    >
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-[20px]">📺</span>
                            <p className="font-mono text-[10.5px] font-bold tracking-[0.15em] text-[#FCD34D] uppercase">
                                上課必看 · AI 草稿找雷練習
                            </p>
                        </div>
                        <p className="font-serif text-[18px] md:text-[20px] font-bold leading-tight mb-2">
                            老師用 Gemini 跑了一份「研究報告」——你能找出學術紅線（共 13 個）嗎？
                        </p>
                        <p className="text-[12px] text-white/85 leading-[1.85]">
                            進入頁面前，先記住一件事：<strong className="text-[#FCD34D]">AI 會照規則做事——但規則要由研究者設定與驗收</strong>。本週我們要學的就是怎麼把判斷力寫進 prompt 裡，並親自驗收 AI 的輸出。<br /><br />
                            <span className="text-[11.5px] italic text-white/70">💡 老師已在課堂開場帶完找雷練習？請直接往下進 Step 2 動手整理。這張卡保留作為自學入口或課後複習。</span>
                        </p>
                        <span className="inline-flex items-center gap-1 mt-3 text-[12.5px] font-bold text-[#FCD34D]">
                            點進去找雷 →
                        </span>
                    </Link>

                    {/* 任務說明 */}
                    <div className="flex items-center gap-2 mb-1">
                        <ContentTypeChip type="學" />
                        <p className="text-[13px] font-bold text-[var(--ink)]">📦 任務：原始資料 → 可分析的表</p>
                    </div>
                    <p className="text-[12.5px] text-[var(--ink-mid)] leading-relaxed">
                        W11-W12 蒐集的<strong className="text-[var(--ink)]">原始資料</strong>本週要變成<strong className="text-[var(--ink)]">分析表</strong>——欄位清楚、N 值明確、可追溯。下週 W14 才畫得了圖。
                    </p>

                    {/* 4 個詞：REF 層，按需查閱 */}
                    <DepthBlock title="4 個詞說明">
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
                    </DepthBlock>

                    {/* 5 法對照表：REF 層，按需查閱 */}
                    <DepthBlock title="5 種方法對照（確認你的整理路徑）">
                        {/* 5 法對照表 */}
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <ContentTypeChip type="學" />
                            <p className="text-[13px] font-bold text-[var(--ink)]">📊 5 種方法 · 原始資料 → 分析表 對照</p>
                        </div>
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
                                    {/* 範例 details：投影顯示時隱藏（details 不吃 projector context，用 !projector 收掉）*/}
                                    {m.example && !projector && (
                                        <details className="border-t border-[var(--border)]">
                                            <summary className="cursor-pointer px-4 py-2 hover:bg-[var(--paper-warm)] transition-colors flex items-center gap-2 text-[12px]">
                                                <span className="font-bold" style={{ color: m.accent }}>📋 看範例：{m.example.topic}</span>
                                                <span className="ml-auto text-[10px] font-mono text-[var(--ink-light)]">▼</span>
                                            </summary>
                                            <div className="border-t border-[var(--border)] px-4 py-3 bg-[#FAFAF9] flex flex-col gap-3">
                                                {/* Layer 1：研究問題 */}
                                                <div className="rounded bg-[#EFF6FF] border border-[#BFDBFE] p-3">
                                                    <p className="text-[10px] font-bold uppercase tracking-wider mb-1.5 text-[#1E40AF]">🔍 研究問題</p>
                                                    <p className="text-[11.5px] text-[#1E3A8A] leading-relaxed">{m.example.question}</p>
                                                </div>
                                                {/* Layer 2：欄位來源（計畫書第二章） */}
                                                <div className="rounded bg-[#F5F3FF] border border-[#DDD6FE] p-3">
                                                    <p className="text-[10px] font-bold uppercase tracking-wider mb-1.5 text-[#5B21B6]">📐 欄位來源（計畫書第二章操作型定義）</p>
                                                    <pre className="text-[11px] text-[#4C1D95] leading-relaxed whitespace-pre-wrap font-sans">{m.example.variables}</pre>
                                                </div>
                                                {/* Layer 3：原始 vs 分析表 */}
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                    <div>
                                                        <p className="text-[10px] font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5" style={{ color: '#991B1B' }}>
                                                            <span className="inline-block w-2 h-2 rounded-full bg-[#FCA5A5]"></span>
                                                            ❌ 原始（雜亂、無法分析）
                                                        </p>
                                                        <DataGrid data={m.example.raw} />
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5" style={{ color: '#166534' }}>
                                                            <span className="inline-block w-2 h-2 rounded-full bg-[#86EFAC]"></span>
                                                            ✅ 整理後（可分析的表）
                                                        </p>
                                                        <DataGrid data={m.example.table} />
                                                    </div>
                                                </div>
                                            </div>
                                        </details>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                    </DepthBlock>

                    {/* 雷 #9 改寫練習：練 */}
                    <div className="flex items-center gap-2 mb-1">
                        <ContentTypeChip type="練" />
                        <p className="text-[12px] font-bold text-[var(--ink-mid)]">雷 #9 改寫練習（個人繳交項）</p>
                    </div>
                    <p className="text-[11.5px] text-[var(--ink-light)] italic mb-2">
                        💡 還沒看過 Step 2 的 3-step 流程？先快速瀏覽一遍，再回來想剔除規則「為什麼要事前定」，改起來會更有感。
                    </p>
                    <TrapRewritePractice
                        trapNumber={9}
                        stage="W13"
                        title="剔除規則模糊"
                        wrong="剔除疑似填答不認真的樣本。"
                        issue="「疑似」是研究員主觀判斷，不是事前訂定的標準。學術上必須先寫好客觀規則，再依規則篩。"
                        hint="把「疑似」拿掉。改寫成「依事前標準剔除 ___」這種可被檢驗的句型。"
                        shouldDo="依事前標準剔除：核心欄位空白者（編號 11、21）、明顯無意義填答（編號 23 填 test）。"
                        dataKey="w13-trap-rewrite-9"
                    />

                                </div>
            ),
        },
        {
            title: '動手整理',
            icon: <Route size={18} />,
            content: (
                <div className="flex flex-col gap-6 prose-zh">
                    <StepBriefing
                        lines={[
                            { label: '節奏', text: '小組工作（第一節後半 + 第二節，課堂主時間）' },
                            { label: '做', text: '把原始資料整理成分析表——欄位對得上操作型定義，N 值清楚，能回答研究問題' },
                        ]}
                    />

                    {/* 動手前警戒語 — 在這裡才是真正「動手前」*/}
                    <ResearcherRedlines mode="warning" stage="W13" />

                    {/* 步驟流程 */}
                    <div className="space-y-3">

                        {/* 步驟一：確認欄位 */}
                        <div className="rounded-[var(--radius-unified)] border border-[var(--border)] bg-white overflow-hidden">
                            <div className="px-4 py-2.5 bg-[#F0FDF4] border-b border-[#BBF7D0] flex items-center gap-2.5">
                                <span className="font-mono text-[10px] font-bold bg-[#059669] text-white px-2 py-0.5 rounded-[3px]">步驟一</span>
                                <span className="text-[13px] font-bold text-[#166534]">從計畫書拿欄位</span>
                            </div>
                            <div className="p-4 space-y-2.5">
                                <p className="text-[12.5px] text-[var(--ink-mid)] leading-[1.8]">
                                    W9 第二章「操作型定義」就是你的欄位來源——不用從零想，打開計畫書就有了。
                                </p>
                                <div className="text-[12px] text-[var(--ink-mid)] leading-relaxed space-y-1.5">
                                    <div className="flex items-start gap-2"><span className="text-[var(--success)] font-bold mt-0.5">①</span><span><strong className="text-[var(--ink)]">對得上</strong>：直接用，欄位名稱照搬。</span></div>
                                    <div className="flex items-start gap-2"><span className="text-[var(--success)] font-bold mt-0.5">②</span><span><strong className="text-[var(--ink)]">對不上</strong>：改欄位名，記一句「原本＿，改成＿，因為＿」。</span></div>
                                </div>
                                <div className="bg-[#FEF9C3] border border-[#FDE047] rounded-[6px] px-3 py-2 text-[11.5px] text-[#713F12] leading-relaxed">
                                    <strong>🎤 訪談組：</strong>類目要讀完逐字稿才能定稿——這是正常流程，把原始類目和調整後的都記下來就好。
                                </div>
                            </div>
                        </div>

                        {/* 步驟二：建表填資料 */}
                        <div className="rounded-[var(--radius-unified)] border border-[var(--border)] bg-white overflow-hidden">
                            <div className="px-4 py-2.5 bg-[#EFF6FF] border-b border-[#BFDBFE] flex items-center gap-2.5">
                                <span className="font-mono text-[10px] font-bold bg-[#2563EB] text-white px-2 py-0.5 rounded-[3px]">步驟二</span>
                                <span className="text-[13px] font-bold text-[#1E40AF]">建表填資料</span>
                            </div>
                            <div className="p-4">
                                <div className="text-[12px] text-[var(--ink-mid)] leading-relaxed space-y-1.5">
                                    <div className="flex items-start gap-2"><span className="text-[#2563EB] font-bold mt-0.5">①</span><span>在 Google Sheet <strong className="text-[var(--ink)]">按欄位建欄</strong>，每欄都有用途。</span></div>
                                    <div className="flex items-start gap-2"><span className="text-[#2563EB] font-bold mt-0.5">②</span><span><strong className="text-[var(--ink)]">逐筆填入</strong>；看不懂的標「待確認」，不要硬猜。</span></div>
                                    <div className="flex items-start gap-2"><span className="text-[#2563EB] font-bold mt-0.5">③</span><span>填完問自己：<strong className="text-[var(--ink)]">這張表能不能幫我下週做圖表？</strong></span></div>
                                </div>
                            </div>
                        </div>

                        {/* 步驟三：交前自查 */}
                        <div className="rounded-[var(--radius-unified)] border border-[var(--border)] bg-white overflow-hidden">
                            <div className="px-4 py-2.5 bg-[var(--paper-warm)] border-b border-[var(--border)] flex items-center gap-2.5">
                                <span className="font-mono text-[10px] font-bold bg-[var(--ink)] text-white px-2 py-0.5 rounded-[3px]">步驟三</span>
                                <span className="text-[13px] font-bold text-[var(--ink)]">交前自查</span>
                            </div>
                            <div className="p-4">
                                <div className="text-[12px] text-[var(--ink-mid)] leading-relaxed space-y-1.5">
                                    <div className="flex items-start gap-2"><span className="text-[var(--ink-light)] font-bold mt-0.5">✔</span><span>這一欄跟<strong className="text-[var(--ink)]">研究問題</strong>有關嗎？</span></div>
                                    <div className="flex items-start gap-2"><span className="text-[var(--ink-light)] font-bold mt-0.5">✔</span><span>這一欄對應哪個<strong className="text-[var(--ink)]">操作型定義</strong>？</span></div>
                                    <div className="flex items-start gap-2"><span className="text-[var(--ink-light)] font-bold mt-0.5">✔</span><span>同一筆資料<strong className="text-[var(--ink)]">不會被分到兩個太像的類別</strong>？</span></div>
                                    <div className="flex items-start gap-2"><span className="text-[var(--ink-light)] font-bold mt-0.5">✔</span><span>看不懂的都已標<strong className="text-[var(--ink)]">「待確認」</strong>了嗎？</span></div>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* ⑤ 各方法補充 + 問卷組範例 — 收進 DepthBlock */}
                    <DepthBlock title="各方法補充說明">
                        <p className="text-[12px] font-bold text-[var(--ink)] mb-2">📂 其他方法怎麼整理資料？</p>
                        <p className="text-[11.5px] text-[var(--ink-mid)] leading-relaxed mb-3">
                            每一法都用「先做什麼 → 再做什麼 → 最後檢查什麼」的短句。詳細操作 SOP 請查
                            <a href="/tools/methods" target="_blank" rel="noopener noreferrer" className="text-[var(--accent)] underline font-bold">方法工具書</a>。
                        </p>
                        <div className="grid grid-cols-1 gap-4 text-[11.5px] leading-relaxed">

                            {/* 問卷組 */}
                            <div className="bg-white border border-[#BFDBFE] rounded-[8px] overflow-hidden">
                                <div className="bg-[#EFF6FF] px-3 py-2 border-b border-[#BFDBFE]">
                                    <p className="font-bold text-[#1E40AF] m-0">📋 問卷組</p>
                                </div>
                                <div className="p-3 space-y-2.5">
                                    <p className="text-[var(--ink-mid)] m-0">刪無效回覆 → 每題對應操作型定義 → 文字選項轉數字代碼 → 標 N 值。</p>
                                    <div className="text-[10.5px] text-[var(--ink-light)] font-mono mb-1">▸ 整理後的表長這樣：</div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full border-collapse text-[10.5px]">
                                            <thead>
                                                <tr className="bg-[#DBEAFE]">
                                                    <th className="border border-[#BFDBFE] px-2 py-1 text-left font-bold text-[#1E40AF]">編號</th>
                                                    <th className="border border-[#BFDBFE] px-2 py-1 text-left font-bold text-[#1E40AF]">Q1 使用頻率</th>
                                                    <th className="border border-[#BFDBFE] px-2 py-1 text-left font-bold text-[#1E40AF]">Q2 壓力感受</th>
                                                    <th className="border border-[#BFDBFE] px-2 py-1 text-left font-bold text-[#1E40AF]">備註</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr><td className="border border-[#BFDBFE] px-2 py-1 text-[var(--ink-mid)]">S01</td><td className="border border-[#BFDBFE] px-2 py-1">4</td><td className="border border-[#BFDBFE] px-2 py-1">3</td><td className="border border-[#BFDBFE] px-2 py-1 text-[var(--ink-light)]">—</td></tr>
                                                <tr className="bg-[#F0F7FF]"><td className="border border-[#BFDBFE] px-2 py-1 text-[var(--ink-mid)]">S02</td><td className="border border-[#BFDBFE] px-2 py-1">5</td><td className="border border-[#BFDBFE] px-2 py-1">4</td><td className="border border-[#BFDBFE] px-2 py-1 text-[var(--ink-light)]">—</td></tr>
                                                <tr><td className="border border-[#BFDBFE] px-2 py-1 text-[var(--ink-mid)]">S03</td><td className="border border-[#BFDBFE] px-2 py-1 text-[#DC2626]">—</td><td className="border border-[#BFDBFE] px-2 py-1">2</td><td className="border border-[#BFDBFE] px-2 py-1 text-[#DC2626]">待確認</td></tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <p className="text-[10.5px] text-[var(--ink-light)] m-0">5 = 非常同意　1 = 非常不同意；空格標「待確認」，不要硬填。</p>
                                </div>
                            </div>

                            {/* 訪談組 */}
                            <div className="bg-white border border-[#EDE9FE] rounded-[8px] overflow-hidden">
                                <div className="bg-[#F5F3FF] px-3 py-2 border-b border-[#EDE9FE]">
                                    <p className="font-bold text-[#7C3AED] m-0">🎤 訪談組</p>
                                </div>
                                <div className="p-3 space-y-2.5">
                                    <p className="text-[var(--ink-mid)] m-0">讀完逐字稿才定稿類目 → 逐段編碼 → 標代表性引言 → 確認對應研究問題。</p>
                                    <div className="text-[10.5px] text-[var(--ink-light)] font-mono mb-1">▸ 整理後的表長這樣：</div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full border-collapse text-[10.5px]">
                                            <thead>
                                                <tr className="bg-[#EDE9FE]">
                                                    <th className="border border-[#DDD6FE] px-2 py-1 text-left font-bold text-[#6D28D9]">受訪者</th>
                                                    <th className="border border-[#DDD6FE] px-2 py-1 text-left font-bold text-[#6D28D9]">編碼類目</th>
                                                    <th className="border border-[#DDD6FE] px-2 py-1 text-left font-bold text-[#6D28D9]">代表引言（摘）</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr><td className="border border-[#DDD6FE] px-2 py-1 text-[var(--ink-mid)]">A</td><td className="border border-[#DDD6FE] px-2 py-1">學習動機↑</td><td className="border border-[#DDD6FE] px-2 py-1 text-[var(--ink-mid)]">「做完題目我會想繼續」</td></tr>
                                                <tr className="bg-[#F5F3FF]"><td className="border border-[#DDD6FE] px-2 py-1 text-[var(--ink-mid)]">A</td><td className="border border-[#DDD6FE] px-2 py-1">社交壓力</td><td className="border border-[#DDD6FE] px-2 py-1 text-[var(--ink-mid)]">「同學都做完了我不敢問」</td></tr>
                                                <tr><td className="border border-[#DDD6FE] px-2 py-1 text-[var(--ink-mid)]">B</td><td className="border border-[#DDD6FE] px-2 py-1 text-[#DC2626]">待確認</td><td className="border border-[#DDD6FE] px-2 py-1 text-[var(--ink-light)]">段落模糊，需重讀</td></tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <p className="text-[10.5px] text-[var(--ink-light)] m-0">類目可以在讀完所有逐字稿後再統一命名。</p>
                                </div>
                            </div>

                            {/* 觀察組 */}
                            <div className="bg-white border border-[#FED7AA] rounded-[8px] overflow-hidden">
                                <div className="bg-[#FFF7ED] px-3 py-2 border-b border-[#FED7AA]">
                                    <p className="font-bold text-[#D97706] m-0">👀 觀察組</p>
                                </div>
                                <div className="p-3 space-y-2.5">
                                    <p className="text-[var(--ink-mid)] m-0">彙整多份紀錄表 → 統一行為類別 → 加總頻次 → 確認對應操作型定義。</p>
                                    <div className="text-[10.5px] text-[var(--ink-light)] font-mono mb-1">▸ 整理後的表長這樣：</div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full border-collapse text-[10.5px]">
                                            <thead>
                                                <tr className="bg-[#FFEDD5]">
                                                    <th className="border border-[#FED7AA] px-2 py-1 text-left font-bold text-[#C2410C]">時段</th>
                                                    <th className="border border-[#FED7AA] px-2 py-1 text-left font-bold text-[#C2410C]">滑手機次數</th>
                                                    <th className="border border-[#FED7AA] px-2 py-1 text-left font-bold text-[#C2410C]">發言次數</th>
                                                    <th className="border border-[#FED7AA] px-2 py-1 text-left font-bold text-[#C2410C]">備註</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr><td className="border border-[#FED7AA] px-2 py-1 text-[var(--ink-mid)]">第一節</td><td className="border border-[#FED7AA] px-2 py-1">6</td><td className="border border-[#FED7AA] px-2 py-1">2</td><td className="border border-[#FED7AA] px-2 py-1 text-[var(--ink-light)]">—</td></tr>
                                                <tr className="bg-[#FFF7ED]"><td className="border border-[#FED7AA] px-2 py-1 text-[var(--ink-mid)]">第二節</td><td className="border border-[#FED7AA] px-2 py-1">3</td><td className="border border-[#FED7AA] px-2 py-1">5</td><td className="border border-[#FED7AA] px-2 py-1 text-[var(--ink-light)]">—</td></tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                            {/* 實驗組 */}
                            <div className="bg-white border border-[#BBF7D0] rounded-[8px] overflow-hidden">
                                <div className="bg-[#F0FDF4] px-3 py-2 border-b border-[#BBF7D0]">
                                    <p className="font-bold text-[#059669] m-0">🧪 實驗組</p>
                                </div>
                                <div className="p-3 space-y-2.5">
                                    <p className="text-[var(--ink-mid)] m-0">結構化測量紀錄 → 算差值（後測－前測）→ 標異常值 → 按自變項分組。</p>
                                    <div className="text-[10.5px] text-[var(--ink-light)] font-mono mb-1">▸ 整理後的表長這樣：</div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full border-collapse text-[10.5px]">
                                            <thead>
                                                <tr className="bg-[#DCFCE7]">
                                                    <th className="border border-[#BBF7D0] px-2 py-1 text-left font-bold text-[#065F46]">受試者</th>
                                                    <th className="border border-[#BBF7D0] px-2 py-1 text-left font-bold text-[#065F46]">組別</th>
                                                    <th className="border border-[#BBF7D0] px-2 py-1 text-left font-bold text-[#065F46]">前測</th>
                                                    <th className="border border-[#BBF7D0] px-2 py-1 text-left font-bold text-[#065F46]">後測</th>
                                                    <th className="border border-[#BBF7D0] px-2 py-1 text-left font-bold text-[#065F46]">差值</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr><td className="border border-[#BBF7D0] px-2 py-1 text-[var(--ink-mid)]">P01</td><td className="border border-[#BBF7D0] px-2 py-1">實驗</td><td className="border border-[#BBF7D0] px-2 py-1">62</td><td className="border border-[#BBF7D0] px-2 py-1">78</td><td className="border border-[#BBF7D0] px-2 py-1 text-[#059669] font-bold">+16</td></tr>
                                                <tr className="bg-[#F0FDF4]"><td className="border border-[#BBF7D0] px-2 py-1 text-[var(--ink-mid)]">P02</td><td className="border border-[#BBF7D0] px-2 py-1">對照</td><td className="border border-[#BBF7D0] px-2 py-1">65</td><td className="border border-[#BBF7D0] px-2 py-1">67</td><td className="border border-[#BBF7D0] px-2 py-1 text-[var(--ink-mid)]">+2</td></tr>
                                                <tr><td className="border border-[#BBF7D0] px-2 py-1 text-[var(--ink-mid)]">P03</td><td className="border border-[#BBF7D0] px-2 py-1">實驗</td><td className="border border-[#BBF7D0] px-2 py-1 text-[#DC2626]">—</td><td className="border border-[#BBF7D0] px-2 py-1">74</td><td className="border border-[#BBF7D0] px-2 py-1 text-[#DC2626]">待確認</td></tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                            {/* 文獻分析組 */}
                            <div className="bg-white border border-[#FECACA] rounded-[8px] overflow-hidden">
                                <div className="bg-[#FEF2F2] px-3 py-2 border-b border-[#FECACA]">
                                    <p className="font-bold text-[#DC2626] m-0">📚 文獻分析組</p>
                                </div>
                                <div className="p-3 space-y-2.5">
                                    <p className="text-[var(--ink-mid)] m-0">整理各篇重點 → 依類目逐篇編碼 → 找相同與分歧 → 確認能回答研究問題。</p>
                                    <div className="text-[10.5px] text-[var(--ink-light)] font-mono mb-1">▸ 整理後的表長這樣：</div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full border-collapse text-[10.5px]">
                                            <thead>
                                                <tr className="bg-[#FEE2E2]">
                                                    <th className="border border-[#FECACA] px-2 py-1 text-left font-bold text-[#991B1B]">文獻</th>
                                                    <th className="border border-[#FECACA] px-2 py-1 text-left font-bold text-[#991B1B]">年份</th>
                                                    <th className="border border-[#FECACA] px-2 py-1 text-left font-bold text-[#991B1B]">類目A：使用動機</th>
                                                    <th className="border border-[#FECACA] px-2 py-1 text-left font-bold text-[#991B1B]">類目B：學習影響</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr><td className="border border-[#FECACA] px-2 py-1 text-[var(--ink-mid)]">林（2021）</td><td className="border border-[#FECACA] px-2 py-1">2021</td><td className="border border-[#FECACA] px-2 py-1">娛樂為主</td><td className="border border-[#FECACA] px-2 py-1">負相關</td></tr>
                                                <tr className="bg-[#FEF2F2]"><td className="border border-[#FECACA] px-2 py-1 text-[var(--ink-mid)]">Chen（2023）</td><td className="border border-[#FECACA] px-2 py-1">2023</td><td className="border border-[#FECACA] px-2 py-1">社交為主</td><td className="border border-[#FECACA] px-2 py-1 text-[#DC2626]">待確認</td></tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </DepthBlock>

                    {/* ② 交前個人檢查 — 4 項短勾選；分析表本體在 Google Sheet，這格只留勾選痕跡（Checklist 用同一 dataKey 序列化字串存）*/}
                    <div className="flex items-center gap-2 mb-1">
                        <ContentTypeChip type="做" />
                        <p className="text-[12px] font-bold text-[var(--ink-mid)]">分析表結構確認</p>
                    </div>
                    <Checklist
                        dataKey="w13-table-structure"
                        prompt="② 交之前，逐項勾選確認"
                        items={[
                            '欄位有對應研究問題',
                            '欄位有對應操作型定義',
                            '不確定的資料有標「待確認」',
                            '分析表連結已貼上',
                        ]}
                    />

                    {/* 分析表連結 — 獨立欄位，W14「從 W13 帶過來」卡會讀這條 w13-table-link */}
                    <div className="flex items-center gap-2 mb-1">
                        <ContentTypeChip type="做" />
                        <p className="text-[12px] font-bold text-[var(--ink-mid)]">貼上分析表連結</p>
                    </div>
                    <ThinkRecord
                        dataKey="w13-table-link"
                        prompt="📎 貼分析表連結，並說明欄位數、N 值及整理狀態（例：共 8 欄，N=72，已代碼化）"
                        placeholder="Google Sheet 連結 → 欄位數：？　N 值：？　整理狀態：已完成 / 部分完成 / 進行中&#10;記得把權限設成「知道連結的人可以檢視」——下週 W14 會直接帶這條進來。"
                        rows={2}
                    />

                    {/* 進度自評 */}
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <ContentTypeChip type="做" />
                            <p className="text-[13px] font-bold text-[var(--ink)]">📍 整理進度自評（誠實標記）</p>
                        </div>
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
                    <StepBriefing
                        lines={[
                            { label: '節奏', text: '個人自主，可跳過' },
                            { label: '做', text: 'AI 當助理（不當研究者）：用它做你已能用人腦做的事，可跳過' },
                            { label: '注意', text: '有用 AI 就留 AI-RED 紀錄' },
                        ]}
                    />
                    {/* 核心原則（一句話帶過開場 + 任務定位） */}
                    <div className="p-5 rounded-[var(--radius-unified)] border-2 border-[var(--accent)] bg-[#F8F8FB]">
                        <div className="flex items-center gap-2 mb-2">
                            <ContentTypeChip type="學" />
                            <p className="text-[15px] font-bold text-[var(--accent)]">🧠 核心原則：腦袋先有架構，AI 才幫得上忙</p>
                        </div>
                        <p className="text-[12px] text-[var(--ink)] leading-relaxed">
                            純人工整理就夠完成本週任務；想試 AI 也行——但記住：
                            <strong>「結構怎麼設」由你決定（已在 Step 2 寫好）；「內容怎麼填」才可以交給 AI。</strong>
                            用了 AI 一定要做驗收，並繳完整對話。
                        </p>
                    </div>

                    {/* AI 能/不能 + 三風險 — 深度補充（AI 會犯的錯）*/}
                    <DepthBlock title="常見錯誤">
                        <div className="flex flex-col gap-4">
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
                    </DepthBlock>

                    {/* AI 協作三原則 + 對話四步驟（W13/14/15 共用）— 深度補充 */}
                    <DepthBlock title="AI 使用提醒">
                        <AICollaborationPrinciples week="13" role="assistant" showRoleCard={false} />
                    </DepthBlock>

                    {/* AI 模式選擇（含 standalone 不用 AI） */}
                    <AIModePicker week="13" taskName="資料整理" onChange={handleAiMode} />

                    {/* standalone：不用 AI */}
                    {aiMode === 'standalone' && (
                        <div className="rounded-[var(--radius-unified)] border-2 border-[#BFDBFE] bg-[#EFF6FF] p-5">
                            <p className="text-[14px] font-bold text-[#1E40AF] mb-2">🚫 你選擇不用 AI</p>
                            <p className="text-[12px] text-[#1E3A8A] leading-relaxed">
                                完全 OK——純人工整理已經足以完成本週任務。回到 Step 3 繼續動手填表，
                                記得每填 10 筆抽檢一次。下一步（Step 4）雙線繳交：小組交分析表連結、個人匯出 W13 歷程 docx。
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
不要自行補空白值、推測答案，或把模糊回答改成明確答案。
不要覆蓋原始資料——填入的是另一份分析表，原始資料要保留。
遇到不確定的資料，標 ❓ 並列出疑問，不要自己決定。

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
                            <Checklist
                                dataKey="w13-ai-validation-basic"
                                prompt="🛡️ 強制驗收清單（不做＝賭運氣）"
                                items={[
                                    '抽前 5 筆對照原始資料，確認 AI 沒有幻覺（沒亂加東西）',
                                    '抽中段 5 筆，確認 AI 沒有跑偏（編碼類別跟我定義的一致）',
                                    'AI 標 ❓ 的資料我自己處理，不直接讓 AI 決定',
                                    'N 值跟我原本算的一致',
                                ]}
                            />

                            {/* 訪談 / 文獻組額外門檻 */}
                            <div className="bg-[#FEF2F2] rounded-[var(--radius-unified)] border border-[#FCA5A5] p-4">
                                <p className="text-[12px] font-bold text-[#991B1B] mb-2 flex items-center gap-2">
                                    <ShieldAlert size={14} /> 訪談組／文獻組 · 額外驗收門檻（非常重要）
                                </p>
                                <p className="text-[11px] text-[#7F1D1D] leading-relaxed mb-1">
                                    這兩組的編碼<strong>就是研究本身</strong>。AI 全做完，你不抽樣比對，等於放棄判斷。
                                </p>
                                <p className="text-[11px] text-[#B91C1C] italic mb-2">
                                    ⏱ 30% 抽樣比對約需 30 分鐘——若課堂時間不夠，課後完成再更新 AI 驗收紀錄即可。
                                </p>
                                <Checklist
                                    dataKey="w13-ai-validation-extra"
                                    prompt="📋 訪談組／文獻組 · 30% 抽樣比對步驟"
                                    items={[
                                        '隨機抽 30% 樣本，我自己編碼一次',
                                        '跟 AI 編碼結果比對',
                                        '差異率 >20%：重新定義類別 + 重編一輪',
                                        '把差異最大的 2-3 筆寫進「AI 驗收紀錄」',
                                    ]}
                                    className="mb-3"
                                />
                                <DepthBlock title="看完整範例">
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
                                </DepthBlock>
                            </div>

                            {/* AI-RED 精簡反思紀錄 */}
                            <AIREDNarrative week="13" hint="本週用 AI 整理資料：A=使用的工具 / I=你的 prompt / R=AI 填出的結果 + 哪裡跑偏 / E=你驗收了哪幾筆、判斷合不合理 / D=採納哪些修正" />
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
                    <StepBriefing
                        lines={[
                            { label: '交出', text: '小組：原始資料連結 + 整理後分析表連結' },
                            { label: '交出', text: '個人：頁面上方「我的紀錄」匯出 → 貼 Classroom（資料紅線自查、AI-RED 如有）' },
                        ]}
                    />

                    {/* 雙線繳交主卡 — W13 期中接點 */}
                    <div className="bg-white border-2 border-[#10B981] rounded-[var(--radius-unified)] overflow-hidden">
                        <div className="bg-[#10B981] text-white px-4 py-2 font-bold text-[13px]">
                            📦 W13 結束前完成兩類繳交
                        </div>
                        <div className="p-4 space-y-4">
                            {/* 小組作業 */}
                            <div className="border-l-4 border-[#0284C7] bg-[#F0F9FF] rounded-r-[6px] p-3">
                                <p className="font-bold text-[13.5px] text-[#075985] mb-1.5">一、小組作業｜資料整理成果</p>
                                <ul className="text-[12.5px] text-[#0C4A6E] leading-[1.85] list-disc pl-5 space-y-1">
                                    <li><strong>原始資料雲端連結</strong>（依方法不同：Form 回應表／逐字稿／觀察紀錄／實驗紀錄／文獻編碼）</li>
                                    <li><strong>整理後分析表連結</strong>（建議 Google Sheet，W14 直接接圖表）</li>
                                </ul>
                                <p className="text-[11.5px] text-[#0C4A6E] italic mt-2 pt-2 border-t border-[#0284C7]/30">
                                    💡 兩份都要——原始的不要刪，讀者要能比對你的整理過程（L04 保留處理紀錄）。
                                </p>
                            </div>

                            {/* 個人作業 */}
                            <div className="border-l-4 border-[#7C3AED] bg-[#F5F3FF] rounded-r-[6px] p-3">
                                <p className="font-bold text-[13.5px] text-[#5B21B6] mb-1.5">二、個人作業｜匯出網頁紀錄 → 貼 Classroom</p>
                                <p className="text-[12.5px] text-[#4C1D95] leading-[1.85] mb-2">
                                    點頁面上方的 <strong>「我的紀錄」</strong>，匯出本週填寫內容，貼到 Classroom 老師開的文件。重點幾件：
                                </p>
                                <ul className="text-[12px] text-[#4C1D95] leading-[1.85] list-decimal pl-5 space-y-0.5">
                                    <li><strong>雷 #9 改寫練習</strong>（在「認識資料」步驟已練，確認有寫）</li>
                                    <li><strong>AI-RED 敘事紀錄</strong>（若有用 AI，在 Step 4 已填）</li>
                                </ul>
                            </div>

                            {/* 個人作業怎麼交說明 */}
                            <div className="rounded-[var(--radius-unified)] border-2 border-[#7C3AED] bg-[#F5F3FF] p-4">
                                <p className="text-[13px] font-bold text-[#5B21B6] mb-1">📁 個人作業怎麼交？</p>
                                <p className="text-[12.5px] text-[#4C1D95] leading-[1.8] m-0">
                                    回到頁面最上方，點「我的紀錄」按鈕 → 匯出本週填寫內容 → 複製後貼到 Classroom 老師開的文件。
                                </p>
                            </div>

                            {/* 繳交收尾 */}
                            <div className="bg-[#FEF3C7] border border-[#F59E0B] rounded-[6px] p-3">
                                <p className="text-[12.5px] font-bold text-[#92400E] leading-[1.85]">
                                    ✅ 全部完成後，到 <strong>Classroom 按下「繳交」</strong>。
                                </p>
                                <p className="text-[11.5px] text-[#92400E] italic mt-1.5">
                                    🎯 一句話原則：<strong>小組交資料成果，個人交資料責任紀錄。</strong>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* 跨工具：資料分析檢核站（自學） */}
                    <div className="bg-[var(--paper-warm)] border border-[var(--border)] rounded-[var(--radius-unified)] p-3 flex items-center justify-between gap-3">
                        <p className="text-[12px] text-[var(--ink-mid)] leading-relaxed">
                            💡 整理完想做更進階的分析？例如：<strong>交叉分析</strong>（兩個變項對著比，例：「性別 × 補習動機」）、<strong>主題編碼</strong>（從質性資料找主題）、<strong>跨個案比較</strong>（不同案例之間比一比）——回 <strong className="text-[var(--ink)]">資料分析檢核站</strong>看 5 法的進階分析步驟與輔助提示（自學用，不影響本週繳交）。
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

                    {/* Classroom 繳交檢核 */}
                    <div className="flex items-center gap-2 mb-1">
                        <ContentTypeChip type="做" />
                        <p className="text-[12px] font-bold text-[var(--ink-mid)]">繳交檢核</p>
                    </div>
                    <Checklist
                        dataKey="w13-classroom-submit"
                        prompt="④ Classroom 雙線繳交檢核（勾選已繳項目）"
                        items={[
                            '【小組】原始資料雲端連結（Form 回應表／逐字稿／觀察紀錄／實驗紀錄／文獻編碼）已繳',
                            '【小組】整理後分析表雲端連結已繳（含欄位、N 值清楚）',
                            '【小組】雲端權限設定為「知道連結的人可以檢視」',
                            '【小組】訪談組／文獻組：已清個資（姓名改代號 A、B、C）',
                            '【個人】W13 網頁歷程 docx 已匯出',
                            '【個人】雷 #9 改寫練習已寫（事前可驗證的剔除規則）',
                            '【個人】若有用 AI：完整對話紀錄 + AI-RED 已繳',
                            'Classroom 已按下「繳交」鈕',
                        ]}
                    />

                    {/* W14 橋接提示 — 靜態，呈現方式由小組討論決定，不用填網頁 */}
                    <div className="rounded-[var(--radius-unified)] border border-dashed border-[var(--accent)] bg-white px-4 py-3 text-[12px] text-[var(--ink-mid)] leading-relaxed">
                        <p className="font-bold text-[var(--accent)] mb-1">→ 進 W14 前，組內先想好一件事</p>
                        <p>這份分析表最值得讓讀者看到的是什麼？打算用圖還是表來說？下週第一步就從這裡開始。</p>
                    </div>
                    {/* 5 法呈現範例 — 深度補充 */}
                    <DepthBlock title="看完整範例">
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
                                    <tr className="border-b border-[var(--border)]"><td className="p-2 font-bold">🎤 訪談</td><td className="p-2">各主題下的代表觀點</td><td className="p-2">引文表（主題 × 受訪者代表引文）+ 主題矩陣</td></tr>
                                    <tr className="border-b border-[var(--border)]"><td className="p-2 font-bold">🧪 實驗</td><td className="p-2">前後測差異</td><td className="p-2">折線圖 + 組間均值表</td></tr>
                                    <tr className="border-b border-[var(--border)]"><td className="p-2 font-bold">👀 觀察</td><td className="p-2">行為類別佔比</td><td className="p-2">圓餅圖 / 時間軸折線</td></tr>
                                    <tr><td className="p-2 font-bold">📚 文獻</td><td className="p-2">立場分布 / 時間軸</td><td className="p-2">時間軸 + 圓餅</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </DepthBlock>

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
                                '若選擇用 AI 補充：知道幻覺/跑偏/把判斷交給 AI的風險並做驗收',
                            ].map((item, i) => (
                                <div key={i} className="p-4 px-5 bg-white flex items-start gap-3">
                                    <span className="text-[var(--success)] text-[16px] mt-0.5 flex-shrink-0">✓</span>
                                    <span className="text-[13px] text-[var(--ink-mid)] leading-relaxed">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 一鍵複製繳交 */}
                    <div className="bg-[#EFF6FF] border-2 border-[#1E40AF] rounded-[var(--radius-unified)] p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <ContentTypeChip type="交出" />
                            <span className="text-[10px] font-mono font-bold bg-[#1E40AF] text-white px-2 py-0.5 rounded-[3px] uppercase tracking-wider">📤 最後一步</span>
                            <span className="text-[14px] font-bold text-[#1E40AF]">複製 W13 學習紀錄 → 貼 Google Classroom</span>
                        </div>
                        <p className="text-[12px] text-[#1E3A8A] leading-relaxed mb-3">
                            包含：原始資料現況／分析表結構連結／最危險整理陷阱／AI 驗收紀錄（如有）／雷 #9 改寫。
                        </p>
                        <ExportButton
                            weekLabel="W13 資料整理週：原始資料 → 分析表"
                            fields={EXPORT_FIELDS}
                            buttonText="複製 W13 學習紀錄"
                        />
                    </div>

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
                                <p className="text-[rgba(255,255,255,0.85)] m-0">本週<strong>小組的分析表連結</strong>。沒帶 = 下週只能空轉，看別組做圖。</p>
                                <p className="text-[rgba(255,255,255,0.65)] text-[11.5px] italic mt-1 mb-0">💡 個人作業（W13 歷程 docx）是你自己對紅線的理解證明，W14 不會用到——但別忘了交。</p>
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

            {/* HERO — 第一屏只留三句（spec §6-1）*/}
            <HeroBlock
                kicker="R.I.B. 調查檔案 · 研究方法與專題 · W13"
                question="我的資料整理好，可以分析了嗎？"
                title="資料整理週："
                accentTitle="把原始資料變成可分析的表"
                todo={[
                    { label: '今天做什麼', value: '把 W11-W12 的原始資料整理成一張可分析的表。' },
                    { label: '為什麼做', value: '表的欄位和 N 值要清楚，下週才畫得了圖、做得了分析。' },
                    { label: '今天交什麼', value: '小組＝原始資料＋分析表連結；個人＝W13 歷程 docx。' },
                ]}
                chain="W11 工具設計書完成、W12 短報拿到全班回饋——資料也收了幾週，W13 要把原始資料整理成可分析的乾淨表格，下週才能畫圖。"
                meta={[
                  { label: '第一節', value: '5 法對照（你的方法該長成什麼表格結構）+ 純人工整理一輪' },
                  { label: '第二節', value: 'AI 協作整理（選用）+ 完成分析表 + 繳交' },
                  { label: '課堂產出', value: '小組：原始資料 + 分析表連結；個人：W13 歷程 docx' },
                  { label: '前置要求', value: 'W11-W12 蒐集的原始資料（問卷回收 / 訪談錄音轉文字 / 實驗數據）' },
                ]}
            />

            {/* 三模式切換 */}
            <ModeSwitch />

            {/* 自學補課路線 — 只在自學模式顯示（spec §5）*/}
            {mode === 'self-study' && (
                <div className="my-5 rounded-[var(--radius-unified)] border-2 border-[#0284C7] bg-[#F0F9FF] p-4 md:p-5">
                    <p className="text-[14px] font-bold text-[#075985] mb-1">📖 自學補課路線 · W13 可「部分自學」</p>
                    <p className="text-[11.5px] text-[#0C4A6E] leading-[1.7] mb-3">
                        5 法對照、4 個詞、分析表結構觀念、AI 風險與驗收原則、雷 #9 改寫都能自學；分析表結構與編碼類別不重疊要老師確認，小組原始＋分析表連結要回組整合。
                    </p>
                    <ol className="text-[12px] text-[#0C4A6E] leading-[1.85] list-none m-0 p-0 space-y-1">
                        <li><strong>① 先看：</strong>Step 1（5 法對照找自己這組／4 個詞）＋ Step 3 的 AI 風險與驗收原則</li>
                        <li><strong>② 做：</strong>Step 2 拿自己 W11-W12 原始資料，定義分析表結構、動手整理一輪</li>
                        <li><strong>③ 補紀錄：</strong>原始資料現況／分析表結構＋連結／（用 AI 則補驗收紀錄）／雷 #9 改寫</li>
                        <li><strong>④ 交：</strong>個人 W13 歷程 docx（雷 #9 改寫、AI-RED 如有）</li>
                        <li><strong>⑤ 需要找人：</strong>分析表結構、編碼類別不重疊要老師確認；小組原始＋分析表連結回組整合</li>
                    </ol>
                    <div className="mt-3 pt-3 border-t border-[#0284C7]/30">
                        <p className="text-[12px] font-bold text-[#075985] mb-1">⛑️ 最低完成版（缺課學生：至少做到這些才算補到核心）</p>
                        <p className="text-[11.5px] text-[#0C4A6E] leading-[1.85] m-0">
                            ① 完成一張分析表結構（欄位＋N 值，可以資料還沒填滿）　② 在網頁寫下分析表結構紀錄　③ 完成雷 #9 改寫　④ 匯出 W13 歷程 docx
                        </p>
                    </div>
                </div>
            )}

            {/* 我的紀錄抽屜 — 兩模式都能開（spec §3 方案 A：總覽＋匯出，input 留 Step）*/}
            <RecordDrawer
                weekLabel="W13 資料整理週：原始資料 → 分析表"
                fields={EXPORT_FIELDS}
                extraFields={RECORD_EXTRA_FIELDS}
            />

            {/* 為什麼是這週 + 本週資訊 — 深度補充 */}

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
                exportReminder="小組繳交原始資料與分析表連結；個人繳交 W13 歷程 docx。完成後到 Classroom 按「繳交」。"
            />

            {(myTopic || myMethod) && (
                <div className="mt-6 mb-2 rounded-[var(--radius-unified)] border-2 border-[var(--success)] overflow-hidden">
                    <div className="px-5 py-3 bg-[var(--success)] flex items-center gap-2">
                        <span className="text-white text-[13px] font-bold">📌 你的研究題目（自動帶入）</span>
                        {myMethod && (
                            <span className="ml-auto text-white/80 text-[12px] font-mono">{myMethod}</span>
                        )}
                    </div>
                    <div className="bg-white px-5 py-4">
                        <p className="text-[20px] font-bold text-[var(--ink)]">{myTopic || '（尚未登記題目）'}</p>
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

            {/* W13 階段紅線完整版 — 5 條 · 深度補充 */}
            <DepthBlock title="W13 研究員紅線（完整版）">
                <ResearcherRedlines mode="subset" stage="W13" />
            </DepthBlock>
        </div>
    );
};

const W13AutonomyPage = () => (
    <ModeProvider week="W13">
        <W13PageContent />
    </ModeProvider>
);

export { W13AutonomyPage };
export default W13AutonomyPage;
