import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    BarController,
    LineController,
    ScatterController,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Scatter, Bar } from 'react-chartjs-2';
import { ArrowLeft, AlertTriangle, CheckCircle2, Eye, RotateCcw, Sparkles, Target } from 'lucide-react';
import HeroBlock from '../components/ui/HeroBlock';
import { ResearcherRedlines } from '../components/ui/ResearcherRedlines';
import ThinkRecord from '../components/ui/ThinkRecord';
import StepEngine from '../components/ui/StepEngine';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    BarController,
    LineController,
    ScatterController,
    Title,
    Tooltip,
    Legend,
);

/* ══════════════════════════════════════
 *  資料常數 — AI 預先「整理好」的 22 筆乾淨資料
 * ══════════════════════════════════════ */
const CLEANED_DATA = [
    { id: 1, gender: '男', grade: '高一', sleep: 7.5, tutoring: '有', use3C: '偶爾', concentration: 8 },
    { id: 2, gender: '女', grade: '高一', sleep: 5.0, tutoring: '有', use3C: '常常', concentration: 4 },
    { id: 3, gender: '女', grade: '高一', sleep: 8.5, tutoring: '沒有', use3C: '沒有', concentration: 9 },
    { id: 4, gender: '男', grade: '高二', sleep: 6.0, tutoring: '未提供', use3C: '偶爾', concentration: 5 },
    { id: 5, gender: '女', grade: '高一', sleep: 7.0, tutoring: '有', use3C: '偶爾', concentration: 7 },
    { id: 6, gender: '男', grade: '高一', sleep: 4.5, tutoring: '有', use3C: '常常', concentration: 3 },
    { id: 7, gender: '女', grade: '高一', sleep: 8.0, tutoring: '沒有', use3C: '沒有', concentration: 8 },
    { id: 8, gender: '男', grade: '高一', sleep: 6.5, tutoring: '有', use3C: '偶爾', concentration: 6 },
    { id: 9, gender: '女', grade: '高二', sleep: 5.5, tutoring: '有', use3C: '常常', concentration: 5 },
    { id: 10, gender: '男', grade: '高一', sleep: 7.5, tutoring: '沒有', use3C: '偶爾', concentration: 7 },
    { id: 11, gender: '男', grade: '高一', sleep: 12.0, tutoring: '沒有', use3C: '沒有', concentration: 10, isOutlier: true }, // ← 雷 1
    { id: 12, gender: '女', grade: '高一', sleep: 5.0, tutoring: '有', use3C: '常常', concentration: 3 },
    { id: 13, gender: '男', grade: '高二', sleep: 7.0, tutoring: '沒有', use3C: '偶爾', concentration: 7 },
    { id: 14, gender: '未提供', grade: '高一', sleep: 6.5, tutoring: '有', use3C: '偶爾', concentration: 5 },
    { id: 15, gender: '女', grade: '高一', sleep: 8.0, tutoring: '沒有', use3C: '沒有', concentration: 9 },
    { id: 16, gender: '男', grade: '高一', sleep: 5.5, tutoring: '有', use3C: '常常', concentration: 4 },
    { id: 17, gender: '女', grade: '高二', sleep: 7.0, tutoring: '沒有', use3C: '偶爾', concentration: 6 },
    { id: 18, gender: '男', grade: '高一', sleep: 6.0, tutoring: '有', use3C: '常常', concentration: 5 },
    { id: 19, gender: '女', grade: '高一', sleep: 8.5, tutoring: '沒有', use3C: '沒有', concentration: 8 },
    { id: 20, gender: '男', grade: '高三', sleep: 7.0, tutoring: '有', use3C: '偶爾', concentration: 7 },
    { id: 21, gender: '男', grade: '高一', sleep: 8.0, tutoring: '沒有', use3C: '沒有', concentration: 8 },
    { id: 22, gender: '女', grade: '高一', sleep: 5.5, tutoring: '有', use3C: '常常', concentration: 4 },
];

/* ══════════════════════════════════════
 *  8 個雷
 * ══════════════════════════════════════ */
const TRAPS = {
    1: {
        stage: 'W13 整理',
        label: '12 小時是極端值，AI 沒問你就直接照搬',
        issue: '高一平日平均睡 12 小時偏離常態（可能是亂填／週末誤填／生病週／手滑多打 1）。但 12 小時不一定要刪——研究員要自己決定。問題是：AI 沒列出來請你判斷，直接整理進乾淨表，研究員失去決定權。',
        shouldDo: 'Prompt 要寫「先列出所有極端值給我看，等我確認再整理」。極端值可以保留 + 做敏感性檢查（含/不含都跑一次），也可以刪+註明理由——但這個決定要研究者自己做。',
    },
    2: {
        stage: 'W15 結論',
        label: '「高度」正相關用詞太強',
        issue: 'N=22 小樣本，且第 11 筆極端值（12 小時）會拉高相關係數。AI 從沒做相關係數計算，只看「整體看起來有趨勢」就斷言「高度」。',
        shouldDo: '改「初步呈現正向關聯」「本研究 N=22 小樣本，需更多研究確認強度」。N<30 不該斷言「高度」。',
    },
    3: {
        stage: 'W15 結論',
        label: '「證實了」太武斷',
        issue: '「證實」是因果用詞——單一研究、N=22、自評偏誤、無對照組，憑什麼「證實」？',
        shouldDo: '改「本研究發現…」「初步觀察到…」這類保守語氣。',
    },
    4: {
        stage: 'W15 結論',
        label: '「最關鍵基石」過度推論',
        issue: '「最關鍵」是因果推論，但本研究方法（問卷）只能看到相關。可能還有其他更關鍵的因素（家庭、課業壓力、個人差異）沒被測量到。',
        shouldDo: '改「本研究中觀察到的關聯之一」「就資料樣本而言，睡眠與專注力呈現正向關聯」。',
    },
    5: {
        stage: 'W15 結論',
        label: '「核心元兇」是新聞用語',
        issue: '「核心元兇」是情緒詞、價值判斷，不符合學術中性原則。同時也是因果推論（睡眠少跟用 3C 可能是同一原因的兩個結果）。',
        shouldDo: '改「使用 3C 至凌晨者，平均睡眠較少且專注力較低」——只報資料看到的，不下因果判斷。',
    },
    6: {
        stage: 'W15 結論',
        label: '「排擠效應」資料沒問就推論',
        issue: '本研究沒問學生「補習時長」「為什麼睡得少」，AI 自己腦補因果機制（「補習延長學習時間 → 壓縮休息」）。',
        shouldDo: '改「有補習者平均睡眠略低，但本研究未蒐集補習時長等資訊，無法判斷是否為排擠效應」。',
    },
    7: {
        stage: 'W15 結論',
        label: '整篇沒有「研究限制」段',
        issue: '一份學術結論必須有研究限制段，這是學術紅線。AI 寫的這份完全沒提任何限制，看起來像 100% 確定的事實。',
        shouldDo: '必須補：N=22 小樣本／自評可能受社會期許影響／樣本以高一為主，無法推廣全體高中生／無對照組／12 小時極端值未處理。',
    },
    8: {
        stage: 'W14 圖表',
        label: '圖表標題格式不符',
        issue: 'W14「三鐵規＋防呆」要求標題格式為「圖一：___（N=___）」，但 AI 只給「睡眠時數與專注力的關係」，沒有圖編號、沒有 N 值、也沒有完整的資料來源標註。',
        shouldDo: '改「圖一：睡眠時數與上課專注力散佈圖（N=22）」並在圖下方標「資料來源：本研究資料，研究者整理繪製」（若有用 AI 協助製圖則改「研究者整理，並使用 AI 協助繪製」）。',
    },
    9: {
        stage: 'W13 整理',
        label: '剔除規則模糊（「疑似填答不認真」）',
        issue: '「疑似」是研究員主觀判斷，不是事前訂定的標準。學術上必須先寫好「核心欄位空白者剔除」「亂填者剔除」這類客觀規則，再依規則篩——而不是看到不順眼才砍。',
        shouldDo: '改「依事前標準剔除：核心欄位空白（編號 11、21）、明顯無意義填答（編號 23 填 test）」。把規則寫出來，讀者才能判斷你是否一致執行。',
    },
    10: {
        stage: 'W13 整理',
        label: '「即為後續分析的唯一依據」暗示原始檔被覆蓋',
        issue: '清理是不可逆操作——原始檔必須保留備份，清理後的檔案另存。AI 寫「即為唯一依據」會讓讀者以為原始資料被覆蓋，研究無法重現。',
        shouldDo: '改「保留原始檔（raw.csv），另存清理版（cleaned.csv）作為後續分析依據」。',
    },
    11: {
        stage: 'W14 圖表',
        label: '散佈圖圖說「明顯」過度修飾',
        issue: '「明顯」需要相關係數（r 值）或統計檢定支撐。N=22 沒做任何檢定，圖看起來有趨勢就斷言「明顯」屬於過度修飾。',
        shouldDo: '改「初步看似正向關聯」「傾向隨睡眠時數遞增」。沒做檢定，用「初步」「看似」「傾向」。',
    },
    12: {
        stage: 'W14 圖表',
        label: '3C 圖說「反映了 / 影響」是因果語氣',
        issue: '「反映了」「影響」都是因果用詞——但圖只能呈現兩條趨勢一致，無法判斷「3C 使用 → 睡眠少」「壓力大 → 同時導致 3C 使用 + 睡眠少」哪個才是真因果。圖說應分「描述 / 推論」兩段，因果留到結論章。',
        shouldDo: '描述：三組平均專注力 4.0/6.4/8.7，平均睡眠 5.3/6.9/8.8。推論：兩條趨勢方向一致，但本研究無法判斷因果方向，可能有其他變項同時影響。',
    },
    13: {
        stage: 'W14 圖表',
        label: '補習圖說「明顯睡得較少」缺統計支撐',
        issue: '「明顯」差異需要 t 檢定或效果量計算。本研究沒做任何檢定，N=22 又是小樣本，「明顯」屬於過度修飾。',
        shouldDo: '改「有補習組平均睡眠較無補習組短（6.5 vs 7.6 小時）」。只報數字，不下強詞判斷。',
    },
};

const TOTAL_TRAPS = Object.keys(TRAPS).length;

/* ══════════════════════════════════════
 *  原始資料表（互動找異常）
 * ══════════════════════════════════════ */
const RAW_ROWS = [
    { id:  1, time:'08:31', gender:'男', grade:'高一', sleep:'7.5',  tutoring:'有',   use3C:'偶爾', conc:'8' },
    { id:  2, time:'08:32', gender:'女', grade:'高一', sleep:'5.0',  tutoring:'有',   use3C:'常常', conc:'4' },
    { id:  3, time:'08:34', gender:'F',  grade:'高一', sleep:'8.5',  tutoring:'沒有', use3C:'沒有', conc:'9' },
    { id:  4, time:'08:35', gender:'男', grade:'高二', sleep:'6.0',  tutoring:'',     use3C:'偶爾', conc:'5' },
    { id:  5, time:'08:36', gender:'女', grade:'高一', sleep:'7.0',  tutoring:'有',   use3C:'偶爾', conc:'7' },
    { id:  6, time:'08:38', gender:'M',  grade:'高一', sleep:'4.5',  tutoring:'有',   use3C:'常常', conc:'3' },
    { id:  7, time:'08:40', gender:'女', grade:'高一', sleep:'8.0',  tutoring:'沒有', use3C:'沒有', conc:'8' },
    { id:  8, time:'08:41', gender:'男', grade:'高一', sleep:'6.5',  tutoring:'有',   use3C:'偶爾', conc:'6' },
    { id:  9, time:'08:43', gender:'女', grade:'高二', sleep:'5.5',  tutoring:'有',   use3C:'常常', conc:'5' },
    { id: 10, time:'08:45', gender:'男', grade:'高一', sleep:'7.5',  tutoring:'沒有', use3C:'偶爾', conc:'7' },
    { id: 11, time:'08:46', gender:'女', grade:'高一', sleep:'',     tutoring:'有',   use3C:'常常', conc:''   },
    { id: 12, time:'08:48', gender:'男', grade:'高一', sleep:'12.0', tutoring:'沒有', use3C:'沒有', conc:'10' },
    { id: 13, time:'08:49', gender:'女', grade:'高一', sleep:'5.0',  tutoring:'有',   use3C:'常常', conc:'3' },
    { id: 14, time:'08:51', gender:'男', grade:'高二', sleep:'7.0',  tutoring:'沒有', use3C:'偶爾', conc:'7' },
    { id: 15, time:'08:52', gender:'',   grade:'高一', sleep:'6.5',  tutoring:'有',   use3C:'偶爾', conc:'5' },
    { id: 16, time:'08:54', gender:'女', grade:'高一', sleep:'8.0',  tutoring:'沒有', use3C:'沒有', conc:'9' },
    { id: 17, time:'08:55', gender:'男', grade:'高一', sleep:'5.5',  tutoring:'有',   use3C:'常常', conc:'4' },
    { id: 18, time:'08:57', gender:'女', grade:'高二', sleep:'7.0',  tutoring:'沒有', use3C:'偶爾', conc:'6' },
    { id: 19, time:'08:58', gender:'男', grade:'高一', sleep:'6.0',  tutoring:'有',   use3C:'常常', conc:'5' },
    { id: 20, time:'09:00', gender:'女', grade:'高一', sleep:'8.5',  tutoring:'沒有', use3C:'沒有', conc:'8' },
    { id: 21, time:'09:01', gender:'',   grade:'',    sleep:'',     tutoring:'',     use3C:'',    conc:''   },
    { id: 22, time:'09:02', gender:'男', grade:'高三', sleep:'7.0',  tutoring:'有',   use3C:'偶爾', conc:'7' },
    { id: 23, time:'09:03', gender:'女', grade:'高一', sleep:'6.5',  tutoring:'有',   use3C:'常常', conc:'test' },
    { id: 24, time:'09:05', gender:'M',  grade:'高一', sleep:'8.0',  tutoring:'沒有', use3C:'沒有', conc:'8' },
    { id: 25, time:'09:06', gender:'女', grade:'高一', sleep:'5.5',  tutoring:'有',   use3C:'常常', conc:'4' },
];

// key = `${rowId}_${field}`，每個 key 代表一個異常點
const RAW_ANOMALIES = {
    '3_gender':   { label: '格式異常', note: '「F」是英文縮寫，整份問卷性別欄應統一為「男／女」——需標準化為「女」。' },
    '4_tutoring': { label: '空白', note: '補習欄位空白。這是次要欄位，可標記為「未提供」並保留這筆資料做分析。' },
    '6_gender':   { label: '格式異常', note: '「M」是英文縮寫，應統一為「男」。' },
    '11_sleep':   { label: '核心欄位空白', note: '睡眠時數與專注力同時空白——兩個核心分析欄位都缺漏，這筆無法納入分析，應剔除。' },
    '11_conc':    { label: '核心欄位空白', note: '睡眠時數與專注力同時空白——兩個核心分析欄位都缺漏，這筆無法納入分析，應剔除。' },
    '12_sleep':   { label: '極端值？', note: '高一平日平均睡 12 小時，明顯偏離常態。可能是週末誤填、生病週、或手滑多打 1。研究員要自己決定保留或剔除——不能讓 AI 默默照搬。' },
    '15_gender':  { label: '空白', note: '性別欄位空白。這是次要欄位，可標記為「未提供」並保留。' },
    '21_all':     { label: '整列空白', note: '這筆只有時間戳，其餘所有欄位都空白，應直接剔除。' },
    '23_conc':    { label: '無效填答', note: '專注力欄填了「test」，不是數字，這筆的核心欄位無法分析，應剔除。' },
    '24_gender':  { label: '格式異常', note: '「M」是英文縮寫，應統一為「男」。' },
};
const TOTAL_RAW_ANOMALIES = 9; // 計分：9 個獨立異常點（row 11 的兩格算一點；row 21 整列算一點）

// 哪些 key 算同一個「異常點」（用於計分去重）
const ANOMALY_SCORE_KEY = {
    '3_gender': 'A1', '4_tutoring': 'A2', '6_gender': 'A3',
    '11_sleep': 'A4', '11_conc': 'A4',
    '12_sleep': 'A5', '15_gender': 'A6', '21_all': 'A7',
    '23_conc': 'A8', '24_gender': 'A9',
};

/* ══════════════════════════════════════
 *  Step 2 Prompt 問題點
 * ══════════════════════════════════════ */
const PROMPT_ISSUES = {
    p1_vague: {
        label: '沒有清理規則',
        note: '只說「整理成乾淨的分析表」——沒說遇到空白欄位怎麼辦、極端值要刪嗎、誰來決定保留或剔除。AI 只能自己猜：默默把 12 小時照搬進去、把「疑似不認真」的直接砍掉——研究者完全失去決定權。',
    },
    p2_vague: {
        label: '沒指定圖表類型與格式',
        note: '「合適的圖」是什麼？散佈圖？長條圖？折線圖？AI 自己決定。圖表標題格式呢？N 值呢？資料來源標註呢？全都沒說，所以 AI 給了「睡眠時數與專注力的關係」這個不完整的標題——沒有圖編號、沒有 N 值。',
    },
    p3_vague: {
        label: '沒設研究員紅線',
        note: '「幫我寫研究結論」——沒說：不能用「導致」「最關鍵」「證實」等因果詞，沒說 N=22 不能推廣全體，沒說必須有研究限制段。AI 就用最常見的新聞語氣寫，13 個雷全踩到。',
    },
};

/* ──────────────────────────────────────
 *  PromptIssueSpan — 黃底可點問題詞
 * ────────────────────────────────────── */
const PromptIssueSpan = ({ pid, active, setActive, children }) => {
    const isActive = active === pid;
    return (
        <span
            onClick={() => setActive(isActive ? null : pid)}
            className={`cursor-pointer rounded px-1 mx-0.5 transition-colors font-bold ${
                isActive
                    ? 'bg-[#FEE2E2] text-[#991B1B] ring-1 ring-[#DC2626]'
                    : 'bg-[#FCD34D] text-[#78350F] hover:bg-[#F59E0B] active:bg-[#F59E0B]'
            }`}
            title="點我看這裡哪裡不清楚"
        >
            {children}
            {!isActive && <span className="text-[10px] ml-0.5 opacity-70">⚠️</span>}
        </span>
    );
};

/* ──────────────────────────────────────
 *  PromptIssueExp — 問題說明卡（橘框）
 * ────────────────────────────────────── */
const PromptIssueExp = ({ pid }) => {
    const p = PROMPT_ISSUES[pid];
    if (!p) return null;
    return (
        <div className="my-2 p-3 rounded-[var(--radius-unified)] border-l-4 border-[#F59E0B] bg-[#FFFBEB] flex items-start gap-2">
            <span className="text-[18px] flex-shrink-0">💬</span>
            <div>
                <p className="text-[11px] font-mono font-bold text-[#92400E] mb-0.5">問題：{p.label}</p>
                <p className="text-[12.5px] text-[#78350F] leading-relaxed">{p.note}</p>
            </div>
        </div>
    );
};

const RawDataTable = () => {
    const [active, setActive] = useState(null); // 目前點選的 anomaly key
    const [found, setFound]   = useState(new Set()); // 找到的 score keys

    const handleCell = (key) => {
        setActive(prev => prev === key ? null : key);
        const sk = ANOMALY_SCORE_KEY[key];
        if (sk) setFound(prev => { const n = new Set(prev); n.add(sk); return n; });
    };

    const COLS = [
        { key:'gender',   label:'性別' },
        { key:'grade',    label:'年級' },
        { key:'sleep',    label:'睡眠(h)' },
        { key:'tutoring', label:'補習' },
        { key:'use3C',    label:'3C至凌晨' },
        { key:'conc',     label:'專注力' },
    ];

    const getCellKey = (row, col) => row.id === 21 ? '21_all' : `${row.id}_${col}`;
    const isAnomaly  = (row, col) => !!RAW_ANOMALIES[getCellKey(row, col)];

    return (
        <div>
            <div className="flex items-center justify-between mb-2">
                <p className="text-[11.5px] text-[#991B1B] font-bold">
                    🔍 找異常：點黃色格子，看問題是什麼
                </p>
                <span className="text-[11px] font-mono bg-[#991B1B] text-white px-2 py-0.5 rounded">
                    找到 {found.size} / {TOTAL_RAW_ANOMALIES}
                </span>
            </div>
            <div className="overflow-x-auto border border-[var(--border)] rounded">
                <table className="w-full border-collapse text-[11.5px]">
                    <thead>
                        <tr className="bg-[#FEE2E2]">
                            <th className="px-2 py-1.5 text-left font-bold text-[#991B1B] border border-[#FCA5A5] whitespace-nowrap">#</th>
                            <th className="px-2 py-1.5 text-left font-bold text-[#991B1B] border border-[#FCA5A5] whitespace-nowrap">時間</th>
                            {COLS.map(c => (
                                <th key={c.key} className="px-2 py-1.5 text-left font-bold text-[#991B1B] border border-[#FCA5A5] whitespace-nowrap">{c.label}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {RAW_ROWS.map((row, i) => (
                            <tr key={row.id} className={i % 2 === 0 ? 'bg-white' : 'bg-[#FAFAFA]'}>
                                <td className="px-2 py-1 border border-[#FCA5A5]/30 font-mono text-[var(--ink-light)] text-center">{row.id}</td>
                                <td className="px-2 py-1 border border-[#FCA5A5]/30 font-mono text-[var(--ink-light)]">{row.time}</td>
                                {COLS.map(c => {
                                    const k = getCellKey(row, c.key);
                                    const anom = isAnomaly(row, c.key);
                                    const isActive = active === k;
                                    const val = row[c.key];
                                    return (
                                        <td key={c.key} className="px-1.5 py-1 border border-[#FCA5A5]/30">
                                            {anom ? (
                                                <span
                                                    onClick={() => handleCell(k)}
                                                    className={`cursor-pointer rounded px-1 py-0.5 transition-colors font-mono ${
                                                        isActive
                                                            ? 'bg-[#FEE2E2] text-[#991B1B] font-bold ring-1 ring-[#DC2626]'
                                                            : 'bg-[#FEF3C7] text-[var(--ink)] hover:bg-[#FCD34D] active:bg-[#FCD34D]'
                                                    }`}
                                                >
                                                    {val || '▢'}
                                                </span>
                                            ) : (
                                                <span className="font-mono text-[var(--ink-mid)]">{val}</span>
                                            )}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {/* 說明框 */}
            {active && RAW_ANOMALIES[active] && (
                <div className="mt-2 p-3 rounded border-l-4 border-[#DC2626] bg-[#FEF2F2] flex items-start gap-2">
                    <span className="text-[18px] flex-shrink-0">⚠️</span>
                    <div>
                        <p className="text-[11px] font-mono font-bold text-[#991B1B] mb-0.5">{RAW_ANOMALIES[active].label}</p>
                        <p className="text-[12.5px] text-[#7F1D1D] leading-relaxed">{RAW_ANOMALIES[active].note}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

/* ══════════════════════════════════════
 *  3 個假雷（看似可疑但其實 OK，訓練學生分辨）
 * ══════════════════════════════════════ */
const FAKE_TRAPS = {
    F1: {
        label: '「完全跟隨」',
        why: '雖然「完全」這個詞看起來很絕對，但它只是在描述「資料看到的趨勢」（分數隨睡眠時數變動），並沒做因果推論。',
        whatIsRealTrap: '真正的雷在後面【做因果推論】的詞，例如「最關鍵基石」「核心元兇」——這些是「為什麼會這樣」的解釋。',
    },
    F2: {
        label: '「慘跌」',
        why: '「慘跌」確實是情緒化用詞，但前後文是「平均專注力慘跌至 4 分」——有具體數字（4 分）支持，不算憑空誇大。',
        whatIsRealTrap: '雷不在情緒化用詞本身，而在後面的「核心元兇」——它把「跟睡眠少同時出現」說成「導致睡眠少」，是因果跳躍。',
    },
    F3: {
        label: '「8~10 分的高水準」',
        why: '這個雖帶評價詞「高水準」，但只是描述分數區間（8-10 分）有依據，不算空泛。',
        whatIsRealTrap: '雷在後面的「證實」「最關鍵」——這些是【因果斷言】，不是【描述觀察】。學會分辨這兩者是研究員的核心功夫。',
    },
};

/* ══════════════════════════════════════
 *  TrapTarget — 雷區包裝元件（手機友善：預設明顯可見）
 * ══════════════════════════════════════ */
const TrapTarget = ({ id, type = 'real', found, showAll, onFind, onToggleExp, children }) => {
    const isRealRevealed = type === 'real' && (found || showAll);
    const isFakeRevealed = type === 'fake' && found;
    const isRevealed = isRealRevealed || isFakeRevealed;

    let className = 'inline transition-all rounded px-1 ';
    if (isRealRevealed) {
        className += 'cursor-pointer bg-[#FEE2E2] text-[#991B1B] font-bold underline decoration-2 decoration-[#DC2626] hover:bg-[#FECACA]';
    } else if (isFakeRevealed) {
        className += 'cursor-pointer bg-[#D1FAE5] text-[#065F46] font-bold underline decoration-2 decoration-[#10B981] hover:bg-[#A7F3D0]';
    } else {
        // 預設：明顯可見的「可疑詞」標記（手機友善 — 不依賴 hover）
        className += 'cursor-pointer bg-[#FEF3C7] underline decoration-dotted decoration-[#92400E]/60 active:bg-[#FCD34D]';
    }

    const handleClick = () => {
        if (!found) {
            onFind(id, type);
        } else if (onToggleExp) {
            // 已找到 → 第二次點 toggle 個別的拆解卡
            onToggleExp(id, type);
        }
    };

    return (
        <span
            onClick={handleClick}
            className={className}
            title={isRevealed ? '再點一次 → 顯示／隱藏這條的拆解卡' : '你覺得這個是真雷還是假雷？點看答案'}
        >
            {children}
            {isRealRevealed && <span className="text-[10px] ml-1 font-mono pointer-events-none">⚠️</span>}
            {isFakeRevealed && <span className="text-[10px] ml-1 font-mono pointer-events-none">💚</span>}
        </span>
    );
};

/* ══════════════════════════════════════
 *  TrapExplanation — 真雷拆解卡（紅）
 * ══════════════════════════════════════ */
const TrapExplanation = ({ id }) => {
    const t = TRAPS[id];
    return (
        <div className="my-3 p-3 rounded-[var(--radius-unified)] border-l-4 border-[#DC2626] bg-[#FEF2F2]">
            <p className="text-[11px] font-mono font-bold text-[#991B1B] mb-1">⚠️ 雷 #{id} · {t.stage}</p>
            <p className="font-bold text-[13px] text-[#991B1B] mb-2">{t.label}</p>
            <p className="text-[12px] text-[#7F1D1D] leading-relaxed mb-2"><strong>問題：</strong>{t.issue}</p>
            <p className="text-[12px] text-[#065F46] bg-white border border-[#86EFAC] rounded p-2 leading-relaxed">
                <strong className="text-[#047857]">✏️ 怎麼改：</strong>{t.shouldDo}
            </p>
        </div>
    );
};

/* ══════════════════════════════════════
 *  FakeTrapExplanation — 假雷拆解卡（綠）
 * ══════════════════════════════════════ */
const FakeTrapExplanation = ({ id }) => {
    const f = FAKE_TRAPS[id];
    return (
        <div className="my-3 p-3 rounded-[var(--radius-unified)] border-l-4 border-[#10B981] bg-[#F0FDF4]">
            <p className="text-[11px] font-mono font-bold text-[#065F46] mb-1">💚 假雷 #{id} · 這個其實沒問題</p>
            <p className="font-bold text-[13px] text-[#065F46] mb-2">{f.label}</p>
            <p className="text-[12px] text-[#047857] leading-relaxed mb-2"><strong>為什麼 OK：</strong>{f.why}</p>
            <p className="text-[12px] text-[#7F1D1D] bg-white border border-[#FCA5A5] rounded p-2 leading-relaxed">
                <strong className="text-[#991B1B]">🎯 真雷在哪：</strong>{f.whatIsRealTrap}
            </p>
        </div>
    );
};

/* StepHeader removed — replaced by StepEngine */

/* ══════════════════════════════════════
 *  主元件
 * ══════════════════════════════════════ */
export const FindTrapsReport = () => {
    const [foundTraps, setFoundTraps] = useState(new Set());
    const [foundFakes, setFoundFakes] = useState(new Set());
    const [showAll, setShowAll] = useState(false);
    const [showExplanations, setShowExplanations] = useState(false);
    const [expandedReal, setExpandedReal] = useState(new Set());   // 個別展開的真雷
    const [expandedFake, setExpandedFake] = useState(new Set());   // 個別展開的假雷
    const [copied, setCopied] = useState(null);
    const [activePrompt, setActivePrompt] = useState(null);  // Step 2 prompt 問題點

    const handleFind = useCallback((id, type) => {
        if (type === 'fake') {
            setFoundFakes(prev => {
                const next = new Set(prev);
                next.add(id);
                return next;
            });
            // 第一次點到 → 自動展開該條拆解卡
            setExpandedFake(prev => {
                const next = new Set(prev);
                next.add(id);
                return next;
            });
        } else {
            setFoundTraps(prev => {
                const next = new Set(prev);
                next.add(id);
                return next;
            });
            setExpandedReal(prev => {
                const next = new Set(prev);
                next.add(id);
                return next;
            });
        }
    }, []);

    // 第二次點 reveal 過的雷 → toggle 個別拆解卡
    const handleToggleExp = useCallback((id, type) => {
        if (type === 'fake') {
            setExpandedFake(prev => {
                const next = new Set(prev);
                if (next.has(id)) next.delete(id); else next.add(id);
                return next;
            });
        } else {
            setExpandedReal(prev => {
                const next = new Set(prev);
                if (next.has(id)) next.delete(id); else next.add(id);
                return next;
            });
        }
    }, []);

    const revealAll = () => {
        setShowAll(true);
        setShowExplanations(true);
    };
    const reset = () => {
        setFoundTraps(new Set());
        setFoundFakes(new Set());
        setShowAll(false);
        setShowExplanations(false);
        setExpandedReal(new Set());
        setExpandedFake(new Set());
    };

    const isRevealed = (id) => foundTraps.has(id) || showAll;
    const isFakeFound = (id) => foundFakes.has(id);
    const showRealExp = (id) => showExplanations || expandedReal.has(id);
    const showFakeExp = (id) => showExplanations || expandedFake.has(id);
    const score = foundTraps.size;
    const isComplete = score >= TOTAL_TRAPS;

    // URL hash deep link：/find-traps#w13/w14/w15 → 自動捲到對應段
    useEffect(() => {
        const hash = window.location.hash.replace('#', '');
        if (['w13', 'w14', 'w15'].includes(hash)) {
            // 等 React render 完
            setTimeout(() => {
                const el = document.getElementById(`section-${hash}`);
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 200);
        }
    }, []);

    // sticky 章節導航：點按鈕→平滑捲到該段
    const scrollToSection = (id) => {
        const el = document.getElementById(`section-${id}`);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            window.history.replaceState(null, '', `#${id}`);
        }
    };

    /* ── 圖表資料 ── */
    const scatterData = useMemo(() => ({
        datasets: [{
            label: '學生個案 (睡眠 vs 專注力)',
            data: CLEANED_DATA.map(d => ({ x: d.sleep, y: d.concentration })),
            backgroundColor: 'rgba(99, 102, 241, 0.6)',
            borderColor: 'rgba(99, 102, 241, 1)',
            pointRadius: 6,
        }],
    }), []);

    const group3C = useMemo(() => {
        const g = { '常常': { s: 0, c: 0, n: 0 }, '偶爾': { s: 0, c: 0, n: 0 }, '沒有': { s: 0, c: 0, n: 0 } };
        CLEANED_DATA.forEach(d => {
            if (g[d.use3C]) { g[d.use3C].s += d.sleep; g[d.use3C].c += d.concentration; g[d.use3C].n += 1; }
        });
        return g;
    }, []);
    const mixed3CData = {
        labels: ['常常 (熬夜)', '偶爾', '沒有 (作息正常)'],
        datasets: [
            {
                type: 'bar',
                label: '平均專注力 (分)',
                data: ['常常', '偶爾', '沒有'].map(k => +(group3C[k].c / group3C[k].n).toFixed(1)),
                backgroundColor: 'rgba(52, 211, 153, 0.7)',
                yAxisID: 'y',
            },
            {
                type: 'line',
                label: '平均睡眠時數 (小時)',
                data: ['常常', '偶爾', '沒有'].map(k => +(group3C[k].s / group3C[k].n).toFixed(1)),
                borderColor: 'rgba(245, 158, 11, 1)',
                backgroundColor: 'rgba(245, 158, 11, 1)',
                borderWidth: 3,
                pointRadius: 5,
                yAxisID: 'y1',
            },
        ],
    };

    const groupT = useMemo(() => {
        const g = { '有': { s: 0, c: 0, n: 0 }, '沒有': { s: 0, c: 0, n: 0 } };
        CLEANED_DATA.forEach(d => {
            if (g[d.tutoring]) { g[d.tutoring].s += d.sleep; g[d.tutoring].c += d.concentration; g[d.tutoring].n += 1; }
        });
        return g;
    }, []);
    const tutoringData = {
        labels: ['有補習', '沒有補習'],
        datasets: [
            {
                label: '平均睡眠時數 (小時)',
                data: ['有', '沒有'].map(k => +(groupT[k].s / groupT[k].n).toFixed(1)),
                backgroundColor: 'rgba(96, 165, 250, 0.7)',
            },
            {
                label: '平均專注力 (分)',
                data: ['有', '沒有'].map(k => +(groupT[k].c / groupT[k].n).toFixed(1)),
                backgroundColor: 'rgba(167, 139, 250, 0.7)',
            },
        ],
    };

    /* ── Steps array (defined inside component for state closure) ── */
    const steps = [
        /* ── Step 1 ── */
        {
            title: '找原始資料的碴',
            icon: '📊',
            content: (
                <div>
                    <p className="text-[13px] text-[var(--ink-mid)] leading-[1.75] mb-4">
                        老師問卷收回來之後，資料長這個樣子——在交給 AI 之前，你先找找看：<strong className="text-[var(--ink)]">這 25 筆有幾個需要處理的地方？</strong>黃色格子是異常點，點進去看問題。
                    </p>
                    <RawDataTable />
                </div>
            ),
        },
        /* ── Step 2 ── */
        {
            title: '找 Prompt 的碴',
            icon: '💬',
            content: (
                <div>
                    <p className="text-[12.5px] text-[var(--ink-mid)] leading-[1.75] mb-5">
                        老師把資料貼給 AI，只用了三句話——沒有規則、沒有限制、沒有紅線。<br />
                        <span className="bg-[#FCD34D] text-[#78350F] font-bold px-1 rounded text-[11px]">黃底⚠️</span> 是 prompt 裡不清楚的地方，<strong>點進去看問題在哪。</strong>
                    </p>

                    <div className="space-y-1.5 max-w-[620px] mx-auto">
                        {/* Prompt 1 */}
                        <div className="flex justify-end">
                            <div className="max-w-[90%] bg-[var(--ink)] text-white rounded-2xl rounded-tr-sm px-4 py-3 text-[13px] leading-[1.85]">
                                <p className="text-[10px] font-mono text-white/50 mb-1.5 uppercase tracking-wider">PROMPT 1 → W13 整理</p>
                                <span>我有一份高中生睡眠 vs 專注力的問卷原始資料，請幫我</span>
                                <PromptIssueSpan pid="p1_vague" active={activePrompt} setActive={setActivePrompt}>整理成乾淨的分析表</PromptIssueSpan>
                                <span className="text-white/55 text-[11px] italic ml-1">（+ 貼上 25 筆原始資料）</span>
                            </div>
                        </div>
                        {activePrompt === 'p1_vague' && <PromptIssueExp pid="p1_vague" />}

                        <div className="flex items-start gap-2">
                            <div className="w-7 h-7 rounded-full bg-[#1A73E8] flex items-center justify-center flex-shrink-0 text-white text-[11px] font-bold mt-0.5">G</div>
                            <div className="bg-[#EFF6FF] border border-[#BFDBFE] rounded-2xl rounded-tl-sm px-4 py-2.5 text-[12px] text-[#1E3A8A] italic leading-relaxed">
                                這是一份非常有意義的資料。我首先進行了清洗——標準化性別、剔除無效資料…
                                <span className="text-[#991B1B] font-bold not-italic ml-1">→ 步驟 3 看完整報告</span>
                            </div>
                        </div>

                        {/* Prompt 2 */}
                        <div className="flex justify-end mt-3">
                            <div className="max-w-[90%] bg-[var(--ink)] text-white rounded-2xl rounded-tr-sm px-4 py-3 text-[13px] leading-[1.85]">
                                <p className="text-[10px] font-mono text-white/50 mb-1.5 uppercase tracking-wider">PROMPT 2 → W14 畫圖</p>
                                <span>依這份分析表，幫我畫個</span>
                                <PromptIssueSpan pid="p2_vague" active={activePrompt} setActive={setActivePrompt}>合適的圖</PromptIssueSpan>
                            </div>
                        </div>
                        {activePrompt === 'p2_vague' && <PromptIssueExp pid="p2_vague" />}

                        <div className="flex items-start gap-2">
                            <div className="w-7 h-7 rounded-full bg-[#1A73E8] flex items-center justify-center flex-shrink-0 text-white text-[11px] font-bold mt-0.5">G</div>
                            <div className="bg-[#EFF6FF] border border-[#BFDBFE] rounded-2xl rounded-tl-sm px-4 py-2.5 text-[12px] text-[#1E3A8A] italic leading-relaxed">
                                我為你製作了三張圖表，標題為「睡眠時數與專注力的關係」…
                                <span className="text-[#991B1B] font-bold not-italic ml-1">→ 步驟 3 看報告</span>
                            </div>
                        </div>

                        {/* Prompt 3 */}
                        <div className="flex justify-end mt-3">
                            <div className="max-w-[90%] bg-[var(--ink)] text-white rounded-2xl rounded-tr-sm px-4 py-3 text-[13px] leading-[1.85]">
                                <p className="text-[10px] font-mono text-white/50 mb-1.5 uppercase tracking-wider">PROMPT 3 → W15 結論</p>
                                <span>依這份圖，</span>
                                <PromptIssueSpan pid="p3_vague" active={activePrompt} setActive={setActivePrompt}>幫我寫研究結論</PromptIssueSpan>
                            </div>
                        </div>
                        {activePrompt === 'p3_vague' && <PromptIssueExp pid="p3_vague" />}

                        <div className="flex items-start gap-2">
                            <div className="w-7 h-7 rounded-full bg-[#1A73E8] flex items-center justify-center flex-shrink-0 text-white text-[11px] font-bold mt-0.5">G</div>
                            <div className="bg-[#EFF6FF] border border-[#BFDBFE] rounded-2xl rounded-tl-sm px-4 py-2.5 text-[12px] text-[#1E3A8A] italic leading-relaxed">
                                根據清理後的資料，得出以下三大核心研究結論：睡眠時數與專注力呈「高度」正相關…
                                <span className="text-[#991B1B] font-bold not-italic ml-1">→ 步驟 3 找出 13 個雷</span>
                            </div>
                        </div>
                    </div>

                    <p className="text-[11.5px] text-[#7F1D1D] italic mt-6 p-3 rounded border border-[#FCA5A5] bg-[#FEF2F2] leading-[1.85]">
                        💡 <strong>記住兩件事</strong>：（1）AI 會照規則做事——但<strong>規則要由研究者設定與驗收</strong>。（2）只要 <strong>prompt 寫得好、規則設清楚</strong>，這些雷都可以避開。
                    </p>
                </div>
            ),
        },
        /* ── Step 3 ── */
        {
            title: '找出 13 個雷',
            icon: '🎯',
            content: (
                <div>
                    {/* 計分區 + 控制 */}
                    <div className="bg-[var(--ink)] text-white rounded-[var(--radius-unified)] p-5 flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
                        <div className="flex items-center gap-3">
                            <Target size={24} className="text-[var(--accent)]" />
                            <div>
                                <p className="text-[11px] font-mono uppercase tracking-wider opacity-70">找到的雷</p>
                                <p className="text-[28px] font-bold leading-tight">{score} / {TOTAL_TRAPS}</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={revealAll}
                                disabled={showAll}
                                className="bg-[#DC2626] hover:bg-[#B91C1C] disabled:opacity-40 text-white px-4 py-2 rounded-[6px] text-[12px] font-bold flex items-center gap-1.5"
                            >
                                <Eye size={14} /> 全部揭曉
                            </button>
                            <button
                                onClick={reset}
                                className="bg-white text-[var(--ink)] hover:bg-[var(--paper-warm)] px-4 py-2 rounded-[6px] text-[12px] font-bold flex items-center gap-1.5"
                            >
                                <RotateCcw size={14} /> 重設
                            </button>
                        </div>
                    </div>

                    {!showAll && score === 0 && (
                        <div className="bg-[#FFFBEB] border-2 border-[#F59E0B] rounded-[var(--radius-unified)] p-5 mb-4">
                            <p className="font-bold text-[16px] md:text-[18px] text-[#92400E] mb-3 flex items-center gap-2">
                                <span className="text-[22px]">🎯</span>
                                怎麼玩？看這裡！
                            </p>
                            <ol className="text-[14px] md:text-[15px] text-[#78350F] leading-[1.95] list-decimal pl-6 space-y-1.5">
                                <li><strong>讀完下方那份 AI 寫的研究報告</strong>（看起來圖文並茂）</li>
                                <li>你覺得哪裡有問題？<strong className="text-[#92400E]">直接用手指點那段文字</strong>（底色較深的黃底字就是可點區）</li>
                                <li>點對 → 跳出「⚠️ 這是雷」+ 為什麼錯 + 該怎麼改</li>
                                <li>點到「假雷」（看似可疑但其實 OK）→ 跳出「💚 這個其實沒問題」+ 解釋</li>
                                <li>找到 13 個真雷 → 前往步驟 4 收網 🪝</li>
                            </ol>
                            <p className="text-[12.5px] text-[#92400E] italic mt-3 pt-3 border-t border-[#F59E0B]/40 leading-[1.85]">
                                ⚡ <strong>注意</strong>：報告裡有<strong>真雷（要找）</strong>跟<strong>假雷（看似可疑但其實 OK）</strong>——點點看才知道。卡關了？按上方「全部揭曉」。
                            </p>
                        </div>
                    )}

                    {/* 章節導航 sticky */}
                    <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-sm border-y border-[var(--border)] py-2 my-4">
                        <div className="flex flex-wrap items-center gap-2 text-[11px]">
                            <span className="font-mono text-[var(--ink-light)] uppercase tracking-wider">📋 跳到</span>
                            <button onClick={() => scrollToSection('w13')} className="px-2.5 py-1 rounded font-bold text-white bg-[#0EA5E9] hover:bg-[#0284C7] transition-colors">W13 整理 · 3 雷</button>
                            <button onClick={() => scrollToSection('w14')} className="px-2.5 py-1 rounded font-bold text-white bg-[#8B5CF6] hover:bg-[#7C3AED] transition-colors">W14 視覺化 · 4 雷</button>
                            <button onClick={() => scrollToSection('w15')} className="px-2.5 py-1 rounded font-bold text-white bg-[#E11D48] hover:bg-[#BE123C] transition-colors">W15 結論 · 6 雷</button>
                            <span className="ml-auto text-[10.5px] text-[var(--ink-light)] italic hidden md:inline">老師上課用 W13/W14/W15 引導學生只看對應段落</span>
                        </div>
                    </div>

                    {/* 顯示拆解卡 toggle */}
                    {(score > 0 || showAll) && (
                        <div className="mb-4 flex justify-end">
                            <button
                                onClick={() => setShowExplanations(!showExplanations)}
                                className="text-[11.5px] text-[var(--ink-mid)] hover:text-[var(--accent)] underline"
                            >
                                {showExplanations ? '隱藏拆解卡' : '顯示拆解卡'}
                            </button>
                        </div>
                    )}

                    {/* AI 報告本體 */}
                    <div className="bg-white border border-[var(--border)] rounded-[var(--radius-unified)] p-6 md:p-8 shadow-sm prose-zh">
                        <div className="border-b border-[var(--border)] pb-4 mb-6">
                            <p className="text-[11px] font-mono text-[var(--ink-light)] uppercase tracking-wider mb-1">📄 GEMINI 端到端報告</p>
                            <h1 className="font-serif text-[24px] md:text-[28px] font-bold text-[var(--ink)] leading-tight m-0">高中生睡眠與專注力分析報告</h1>
                        </div>

                        {/* 一、資料清理 */}
                        <section id="section-w13" className="mb-8 scroll-mt-20">
                            <h2 className="font-serif text-[18px] md:text-[20px] font-bold text-[var(--ink)] mb-3">一、 資料清理說明</h2>
                            <p className="text-[13px] text-[var(--ink-mid)] leading-[1.85]">在進行分析前，針對原始問卷資料進行了以下清理步驟，以確保數據的準確性：</p>
                            <ul className="text-[13px] text-[var(--ink-mid)] leading-[1.95] list-disc pl-6 space-y-1 mt-2">
                                <li><strong>標準化輸入：</strong>將性別欄位中的 F 與 M 統一轉換為「女」與「男」。</li>
                                <li><strong>處理遺失與異常值：</strong>剔除第 21 筆「完全空白」的無效資料；剔除第 11 筆缺少「睡眠時數」與「專注力」核心指標的資料；剔除第 23 筆專注力欄位填寫為無效字串「test」的資料；此外亦剔除
                                    <TrapTarget id={9} found={isRevealed(9)} showAll={showAll} onFind={handleFind} onToggleExp={handleToggleExp}>疑似填答不認真的樣本</TrapTarget>。</li>
                                <li><strong>填補次要缺漏：</strong>針對僅缺少性別（第 15 筆）或補習狀況（第 4 筆）但核心數據完整的樣本，標記為「未提供」並保留，最終獲得 22 筆有效分析樣本。此清理後的資料
                                    <TrapTarget id={10} found={isRevealed(10)} showAll={showAll} onFind={handleFind} onToggleExp={handleToggleExp}>即為後續分析的唯一依據</TrapTarget>。</li>
                            </ul>
                            {showRealExp(9) && isRevealed(9) && <TrapExplanation id={9} />}
                            {showRealExp(10) && isRevealed(10) && <TrapExplanation id={10} />}
                        </section>

                        {/* 二、清理後資料表 */}
                        <section className="mb-8">
                            <h2 className="font-serif text-[18px] md:text-[20px] font-bold text-[var(--ink)] mb-3">二、 清理後的乾淨資料表</h2>
                            <div className="overflow-x-auto">
                                <table className="w-full text-[11.5px] border-collapse">
                                    <thead>
                                        <tr className="bg-[var(--paper-warm)] border-b-2 border-[var(--ink)]">
                                            <th className="p-2 text-left font-bold">編號</th>
                                            <th className="p-2 text-left font-bold">性別</th>
                                            <th className="p-2 text-left font-bold">年級</th>
                                            <th className="p-2 text-left font-bold">睡眠時數</th>
                                            <th className="p-2 text-left font-bold">補習</th>
                                            <th className="p-2 text-left font-bold">3C 至凌晨</th>
                                            <th className="p-2 text-left font-bold">專注力</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {CLEANED_DATA.map(d => (
                                            <tr key={d.id} className="border-b border-[var(--border)] hover:bg-[var(--paper-warm)]/40">
                                                <td className="p-1.5">{d.id}</td>
                                                <td className="p-1.5">{d.gender}</td>
                                                <td className="p-1.5">{d.grade}</td>
                                                <td className="p-1.5">
                                                    {d.isOutlier
                                                        ? <TrapTarget id={1} found={isRevealed(1)} showAll={showAll} onFind={handleFind} onToggleExp={handleToggleExp}>{d.sleep}</TrapTarget>
                                                        : d.sleep}
                                                </td>
                                                <td className="p-1.5">{d.tutoring}</td>
                                                <td className="p-1.5">{d.use3C}</td>
                                                <td className="p-1.5">{d.concentration}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            {showRealExp(1) && isRevealed(1) && <TrapExplanation id={1} />}
                        </section>

                        {/* 三、視覺化儀表板 */}
                        <section id="section-w14" className="mb-8 scroll-mt-20">
                            <h2 className="font-serif text-[18px] md:text-[20px] font-bold text-[var(--ink)] mb-1">三、 視覺化儀表板</h2>
                            <p className="text-[12px] text-[var(--ink-mid)] mb-4">
                                基於 22 份有效樣本（已清理）。圖表標題：
                                <TrapTarget id={8} found={isRevealed(8)} showAll={showAll} onFind={handleFind} onToggleExp={handleToggleExp}>「睡眠時數與專注力的關係」</TrapTarget>
                            </p>
                            {showRealExp(8) && isRevealed(8) && <TrapExplanation id={8} />}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                {/* 散佈圖 */}
                                <div className="bg-white border border-[var(--border)] rounded p-4">
                                    <h4 className="font-bold text-[13px] text-[var(--ink)] mb-3">睡眠時數與專注力的關係</h4>
                                    <div className="h-64">
                                        <Scatter
                                            data={scatterData}
                                            options={{
                                                responsive: true, maintainAspectRatio: false,
                                                scales: {
                                                    x: { title: { display: true, text: '平均睡眠時數 (小時)' }, min: 3, max: 13 },
                                                    y: { title: { display: true, text: '自評專注力 (1-10分)' }, min: 0, max: 11 },
                                                },
                                                plugins: { legend: { display: false } },
                                            }}
                                        />
                                    </div>
                                    <div className="mt-3 p-3 rounded border border-[#BFDBFE] bg-[#EFF6FF] text-[11.5px] leading-[1.85]">
                                        <p className="font-bold text-[#1E40AF] mb-1">📌 研究員圖說（示範）</p>
                                        <p className="text-[#1E3A8A] mb-1.5">
                                            <strong>描述：</strong>N=22 學生中，睡眠時數從 4.5 到 12 小時不等，專注力分數從 3 到 10 分。整體而言，睡眠時數較高的學生，專注力分數
                                            <TrapTarget id={11} found={isRevealed(11)} showAll={showAll} onFind={handleFind} onToggleExp={handleToggleExp}>明顯</TrapTarget>較高。
                                        </p>
                                        <p className="text-[#1E3A8A]">
                                            <strong>推論：</strong>兩變項看似呈正向關聯，但本研究無法判斷是因果、共同原因、或反向因果。需更嚴謹研究設計才能釐清。
                                        </p>
                                    </div>
                                    {showRealExp(11) && isRevealed(11) && <TrapExplanation id={11} />}
                                </div>

                                {/* 3C 混合圖 */}
                                <div className="bg-white border border-[var(--border)] rounded p-4">
                                    <h4 className="font-bold text-[13px] text-[var(--ink)] mb-3">熬夜使用 3C 對表現的影響</h4>
                                    <div className="h-64">
                                        <Bar
                                            data={mixed3CData}
                                            options={{
                                                responsive: true, maintainAspectRatio: false,
                                                scales: {
                                                    y: { type: 'linear', position: 'left', title: { display: true, text: '專注力 (分)' }, min: 0, max: 10 },
                                                    y1: { type: 'linear', position: 'right', title: { display: true, text: '睡眠 (小時)' }, min: 0, max: 10, grid: { drawOnChartArea: false } },
                                                },
                                            }}
                                        />
                                    </div>
                                    <div className="mt-3 p-3 rounded border border-[#BFDBFE] bg-[#EFF6FF] text-[11.5px] leading-[1.85]">
                                        <p className="font-bold text-[#1E40AF] mb-1">📌 研究員圖說（示範）</p>
                                        <p className="text-[#1E3A8A] mb-1.5">
                                            <strong>描述：</strong>將學生分為「常常／偶爾／沒有」使用 3C 至凌晨三組。三組平均專注力分別為 4.0/6.4/8.7 分，平均睡眠分別為 5.3/6.9/8.8 小時。
                                        </p>
                                        <p className="text-[#1E3A8A]">
                                            <strong>推論：</strong>兩條趨勢方向一致，
                                            <TrapTarget id={12} found={isRevealed(12)} showAll={showAll} onFind={handleFind} onToggleExp={handleToggleExp}>反映了 3C 使用會影響</TrapTarget>
                                            睡眠及專注力。但本資料無法判斷誰是誰的原因，也可能有其他變項（壓力、習慣）同時影響三者。
                                        </p>
                                    </div>
                                    {showRealExp(12) && isRevealed(12) && <TrapExplanation id={12} />}
                                </div>

                                {/* 補習對比 */}
                                <div className="bg-white border border-[var(--border)] rounded p-4 md:col-span-2">
                                    <h4 className="font-bold text-[13px] text-[var(--ink)] mb-3">有無補習對作息的影響對比</h4>
                                    <div className="h-64">
                                        <Bar
                                            data={tutoringData}
                                            options={{
                                                responsive: true, maintainAspectRatio: false,
                                                scales: { y: { beginAtZero: true, max: 10 } },
                                            }}
                                        />
                                    </div>
                                    <div className="mt-3 p-3 rounded border border-[#BFDBFE] bg-[#EFF6FF] text-[11.5px] leading-[1.85]">
                                        <p className="font-bold text-[#1E40AF] mb-1">📌 研究員圖說（示範）</p>
                                        <p className="text-[#1E3A8A] mb-1.5">
                                            <strong>描述：</strong>有補習組（n=12）平均睡眠 6.5 小時、專注力 5.6 分；無補習組（n=8）平均睡眠 7.6 小時、專注力 7.4 分。有補習組
                                            <TrapTarget id={13} found={isRevealed(13)} showAll={showAll} onFind={handleFind} onToggleExp={handleToggleExp}>明顯睡得較少</TrapTarget>。
                                        </p>
                                        <p className="text-[#1E3A8A]">
                                            <strong>推論：</strong>兩組數值有差異，但差異原因可能涉及補習時長、家庭因素、學業壓力等。本資料未控制這些變項，無法把差異歸因於「補習」本身。
                                        </p>
                                    </div>
                                    {showRealExp(13) && isRevealed(13) && <TrapExplanation id={13} />}

                                    <details className="mt-2 rounded border-2 border-[#DC2626]/40 bg-[#FEF2F2]">
                                        <summary className="cursor-pointer px-3 py-2 text-[12px] font-bold text-[#991B1B] hover:bg-[#FEE2E2] flex items-center gap-2">
                                            <span>📛 學生最常寫錯的 4 種版本（點開對照看）</span>
                                            <span className="ml-auto text-[10px] font-mono">▼</span>
                                        </summary>
                                        <div className="border-t border-[#DC2626]/40 p-3 space-y-3 text-[11.5px] leading-[1.85]">
                                            <div className="bg-white border border-[#FCA5A5] rounded p-2.5">
                                                <p className="font-bold text-[#991B1B] mb-1">❌ 錯誤 1：直接歸因（最常見）</p>
                                                <p className="text-[#7F1D1D] italic mb-1.5">「補習<u>導致</u>學生睡眠減少、專注力下降。建議家長減少讓孩子補習。」</p>
                                                <p className="text-[#7F1D1D] text-[11px]"><strong className="text-[#991B1B]">錯在哪：</strong>「導致」是因果，但資料只能看到「相關」。沒控制變項——可能真正影響的是「補習時長」「家庭壓力」或「會去補習的學生本來就有原因」。</p>
                                            </div>
                                            <div className="bg-white border border-[#FCA5A5] rounded p-2.5">
                                                <p className="font-bold text-[#991B1B] mb-1">❌ 錯誤 2：道德化、規範性主張</p>
                                                <p className="text-[#7F1D1D] italic mb-1.5">「補習浪費時間，是現代教育的問題。」</p>
                                                <p className="text-[#7F1D1D] text-[11px]"><strong className="text-[#991B1B]">錯在哪：</strong>學術論文不該下價值判斷。「浪費」「教育問題」是個人立場，不是資料能支持的結論。</p>
                                            </div>
                                            <div className="bg-white border border-[#FCA5A5] rounded p-2.5">
                                                <p className="font-bold text-[#991B1B] mb-1">❌ 錯誤 3：過度推廣樣本</p>
                                                <p className="text-[#7F1D1D] italic mb-1.5">「研究結果顯示，台灣所有高中生不該補習。」</p>
                                                <p className="text-[#7F1D1D] text-[11px]"><strong className="text-[#991B1B]">錯在哪：</strong>N=20 不能推到「台灣所有高中生」。應限縮：「在本研究 22 位高一學生中…」</p>
                                            </div>
                                            <div className="bg-white border border-[#FCA5A5] rounded p-2.5">
                                                <p className="font-bold text-[#991B1B] mb-1">❌ 錯誤 4：忽略反向因果（高階）</p>
                                                <p className="text-[#7F1D1D] italic mb-1.5">「補習壓縮了學生的睡眠時間。」</p>
                                                <p className="text-[#7F1D1D] text-[11px]"><strong className="text-[#991B1B]">錯在哪：</strong>反向可能：睡眠少的學生選擇去補習補救（因果反過來）。橫斷資料無法判斷因果方向。</p>
                                            </div>
                                            <p className="text-[10.5px] text-[#7F1D1D] italic pt-2 border-t border-[#FCA5A5]/50">💡 對照上方藍色「研究員圖說（示範）」——研究員只說「資料看到什麼」+「為什麼不能下因果結論」。</p>
                                        </div>
                                    </details>
                                </div>
                            </div>
                        </section>

                        {/* 四、研究結論 */}
                        <section id="section-w15" className="mb-8 scroll-mt-20">
                            <h2 className="font-serif text-[18px] md:text-[20px] font-bold text-[var(--ink)] mb-3">四、 研究結論</h2>
                            <p className="text-[13px] text-[var(--ink-mid)] leading-[1.85]">根據上述清理後的有效數據，我們進行交叉比對與平均數分析，得出以下三大核心研究結論：</p>

                            <div className="mt-4">
                                <h3 className="font-bold text-[15px] text-[var(--ink)] mb-2">1. 睡眠時數與專注力呈「
                                    <TrapTarget id={2} found={isRevealed(2)} showAll={showAll} onFind={handleFind} onToggleExp={handleToggleExp}>高度</TrapTarget>正相關」</h3>
                                <p className="text-[13px] text-[var(--ink-mid)] leading-[1.85]">
                                    數據顯示，學生的自評專注力分數
                                    <TrapTarget id="F1" type="fake" found={isFakeFound('F1')} showAll={showAll} onFind={handleFind} onToggleExp={handleToggleExp}>完全跟隨</TrapTarget>
                                    睡眠時數增減。平均睡眠時數達到 8 小時以上的學生，其專注力評分均落在
                                    <TrapTarget id="F3" type="fake" found={isFakeFound('F3')} showAll={showAll} onFind={handleFind} onToggleExp={handleToggleExp}>8~10 分的高水準</TrapTarget>
                                    ；反觀睡眠時數低於 6 小時的學生，專注力普遍低落於 5 分以下。這
                                    <TrapTarget id={3} found={isRevealed(3)} showAll={showAll} onFind={handleFind} onToggleExp={handleToggleExp}>證實了</TrapTarget>充足的睡眠是維持高中生課堂專注力的
                                    <TrapTarget id={4} found={isRevealed(4)} showAll={showAll} onFind={handleFind} onToggleExp={handleToggleExp}>最關鍵基石</TrapTarget>。
                                </p>
                                {showRealExp(2) && isRevealed(2) && <TrapExplanation id={2} />}
                                {showFakeExp('F1') && isFakeFound('F1') && <FakeTrapExplanation id="F1" />}
                                {showFakeExp('F3') && isFakeFound('F3') && <FakeTrapExplanation id="F3" />}
                                {showRealExp(3) && isRevealed(3) && <TrapExplanation id={3} />}
                                {showRealExp(4) && isRevealed(4) && <TrapExplanation id={4} />}
                            </div>

                            <div className="mt-4">
                                <h3 className="font-bold text-[15px] text-[var(--ink)] mb-2">2. 熬夜使用 3C 產品是破壞專注力的「
                                    <TrapTarget id={5} found={isRevealed(5)} showAll={showAll} onFind={handleFind} onToggleExp={handleToggleExp}>核心元兇</TrapTarget>」</h3>
                                <p className="text-[13px] text-[var(--ink-mid)] leading-[1.85]">
                                    進一步分析「使用 3C 至凌晨」的頻率與表現：「常常」熬夜使用 3C 者，平均睡眠僅約 5.3 小時，專注力平均
                                    <TrapTarget id="F2" type="fake" found={isFakeFound('F2')} showAll={showAll} onFind={handleFind} onToggleExp={handleToggleExp}>慘跌</TrapTarget>
                                    至 4 分，表現最差。「沒有」熬夜使用 3C 者，平均睡眠高達 8.8 小時，專注力平均高達 8.7 分，表現最優異。此落差表明，睡前過度使用 3C 產品不僅嚴重壓縮睡眠時間，更直接導致隔日課堂精神渙散。
                                </p>
                                {showFakeExp('F2') && isFakeFound('F2') && <FakeTrapExplanation id="F2" />}
                                {showRealExp(5) && isRevealed(5) && <TrapExplanation id={5} />}
                            </div>

                            <div className="mt-4">
                                <h3 className="font-bold text-[15px] text-[var(--ink)] mb-2">3. 「補習」對作息可能產生「
                                    <TrapTarget id={6} found={isRevealed(6)} showAll={showAll} onFind={handleFind} onToggleExp={handleToggleExp}>排擠效應</TrapTarget>」</h3>
                                <p className="text-[13px] text-[var(--ink-mid)] leading-[1.85]">
                                    在「有無補習」的交叉分析中，「有補習」的學生群體整體平均睡眠時數與專注力，皆略低於「沒有補習」的學生。這反映出課後補習可能延長了學生的學習時間並壓縮了休息時間。對於有補習的學生而言，如何做好時間管理以避免排擠睡眠，是維持學習效率的重要課題。
                                </p>
                                {showRealExp(6) && isRevealed(6) && <TrapExplanation id={6} />}
                            </div>

                            <div className="mt-6">
                                <button
                                    onClick={() => !foundTraps.has(7) && handleFind(7)}
                                    className={`
                                        w-full text-left p-3 rounded-[var(--radius-unified)] border-2 border-dashed transition-all
                                        ${isRevealed(7)
                                            ? 'border-[#DC2626] bg-[#FEE2E2] text-[#991B1B]'
                                            : 'border-[var(--border)] bg-[var(--paper-warm)] text-[var(--ink-light)] hover:border-[#FCD34D] hover:bg-[#FFFBEB]'}
                                    `}
                                >
                                    <p className="text-[12px] font-bold flex items-center gap-2">
                                        {isRevealed(7) ? <AlertTriangle size={14} /> : <Eye size={14} />}
                                        整篇結論到這裡就結束了。{isRevealed(7) ? '⚠️ 你發現缺什麼了！' : '你覺得這份結論有沒有缺什麼？(點點看)'}
                                    </p>
                                </button>
                                {showRealExp(7) && isRevealed(7) && <TrapExplanation id={7} />}
                            </div>
                        </section>
                    </div>

                    <ResearcherRedlines mode="full" linkToWeek={true} defaultOpen={false} />
                </div>
            ),
        },
        /* ── Step 4 ── */
        {
            title: '收網',
            icon: '🪝',
            content: (
                <div className="space-y-8">
                    {/* 為什麼 AI 會寫這麼多雷 */}
                    <div className="p-6 rounded-[var(--radius-unified)] bg-gradient-to-br from-[var(--ink)] to-[#1E293B] text-white shadow-xl">
                        <div className="flex items-center gap-2 mb-3">
                            <Sparkles size={22} className="text-[var(--accent)]" />
                            <p className="font-mono text-[11px] font-bold tracking-[0.2em] text-[var(--accent)] uppercase">13 個雷全找到了 · 來看為什麼</p>
                        </div>
                        <h3 className="font-serif text-[20px] md:text-[24px] font-bold leading-tight mb-3">為什麼 AI 會寫這麼多雷？</h3>
                        <p className="text-[13.5px] text-white/85 leading-[1.95] mb-4">
                            因為老師給 AI 的 prompt 只有：「<strong className="text-[var(--accent)]">幫我寫研究結論</strong>」。
                            <br/>AI 沒有研究員的判斷力，再加上<strong>研究類問題對 AI 邏輯精度要求高</strong>，它用最常見的語言（新聞／部落格）寫，當然會踩雷。
                        </p>
                        <div className="bg-white/10 rounded p-4 mb-4">
                            <p className="font-bold text-[14px] text-[var(--accent)] mb-2">好 Prompt = 核心 3 元素 + 補強 1 元素 ⭐</p>
                            <p className="text-[11.5px] text-white/70 italic mb-3">頂尖 AI 模型已內化「專業」概念，所以「角色」不再是必要，但對較弱模型仍有用——以下是真正影響輸出品質的順序：</p>
                            <ul className="text-[12.5px] text-white/85 leading-[1.95] space-y-1.5">
                                <li>① <strong className="text-[#FCD34D]">任務</strong>：明確動詞（整理／審查／改寫／列出）+ 你要的產出 <span className="text-white/50">[核心]</span></li>
                                <li>② <strong className="text-[#FCD34D]">規則／紅線</strong>：把你的判斷力寫進去（N=22 不可用「證實」、必含限制段、區分相關 vs 因果）<span className="text-white/50">[核心 · 命脈]</span></li>
                                <li>③ <strong className="text-[#FCD34D]">格式</strong>：限定產出長相（分四層、表格、字數）<span className="text-white/50">[核心]</span></li>
                                <li>④ <strong className="text-white/70">角色</strong>：你是研究方法老師…<span className="text-white/50">[補強，視情況]</span></li>
                            </ul>
                        </div>
                        <p className="text-[12px] text-white/70 italic">💡 把判斷力寫進 prompt——這就是研究者的素養。</p>
                    </div>

                    {/* 自我遷移卡 */}
                    <div className="p-5 rounded-[var(--radius-unified)] border-2 border-[#F59E0B] bg-[#FFFBEB]">
                        <div className="flex items-center gap-2 mb-2">
                            <Target size={18} className="text-[#92400E]" />
                            <p className="font-bold text-[14px] text-[#92400E] m-0">🪞 自我遷移：把找雷能力轉回自己研究</p>
                        </div>
                        <p className="text-[12.5px] text-[#78350F] leading-[1.85] mb-3">
                            會找別人的雷不算什麼——能看到自己研究的雷才是研究員。動腦想一下：
                        </p>
                        <ThinkRecord
                            dataKey="findtraps-self-migration"
                            prompt="我們組的資料 / 圖表 / 結論，最可能踩到 17 條紅線中的哪一條？為什麼？"
                            placeholder="例如：我們的結論章可能踩 L11——我寫了「補習導致睡眠不足」，但其實只能說相關，需要改成「有補習組睡眠較少，原因待研究」。"
                            rows={4}
                        />
                    </div>

                    {/* Prompt 範本 */}
                    <div className="space-y-4">
                        <div className="text-center mb-2">
                            <p className="font-mono text-[11px] tracking-wider text-[var(--ink-mid)] uppercase">PROMPT 範本 · 複製貼到 AI 用</p>
                            <h3 className="font-serif text-[20px] md:text-[22px] font-bold text-[var(--ink)] mt-1">三階段研究 · 通用 Prompt 範本</h3>
                            <p className="text-[12px] text-[var(--ink-mid)] italic mt-1">注意：這些 prompt 同時也是「給你自己的指令」——學會這些規則，比抄 prompt 更重要。</p>
                        </div>

                        {/* W13 prompt */}
                        <details className="rounded-[var(--radius-unified)] border-2 border-[#3B82F6] bg-[#EFF6FF]" open>
                            <summary className="cursor-pointer px-4 py-3 flex items-center gap-2 hover:bg-[#DBEAFE]">
                                <span className="font-mono text-[10px] font-bold tracking-wider text-[#1E40AF]">W13</span>
                                <span className="font-bold text-[14px] text-[#1E3A8A]">資料整理 · Prompt</span>
                                <span className="ml-auto text-[10px] font-mono text-[#1E40AF]">▼</span>
                            </summary>
                            <div className="border-t border-[#BFDBFE] p-4">
                                <p className="text-[11.5px] text-[#1E3A8A] mb-2 italic">學生學到：6 類資料問題（缺漏／極端／格式／無效／重複／待確認）+ 兩階段分工（找問題 → 研究者決定）</p>
                                <pre className="bg-white border border-[#BFDBFE] rounded p-3 text-[11.5px] leading-[1.85] whitespace-pre-wrap font-mono text-[#1E3A8A] overflow-x-auto">{`【任務】
我有一份研究問卷／訪談／實驗／觀察／文獻分析的原始資料。
請協助我整理成「可分析、可追溯」的分析表。

【重要規則】
1. 不要覆蓋原始資料。原始資料要保留，整理結果請另做一份分析表。
2. 不要自行刪除資料、補空白值、推測答案，或把模糊回答改成明確答案。
3. 第一階段只做「找問題」，不要直接清理資料。
4. 找出問題後，請等我針對每個問題回覆「保留／刪除／標記／修正格式」後，再進入第二階段。
5. 資料異常不一定要刪除，最後決定要由研究者做。

【第一階段：請先找問題】
請列出資料中所有可能需要處理的點：
- 缺漏值：空白、半空白、未填答
- 極端值：明顯偏離常態的數字
- 格式不一致：同一欄位出現不同寫法
- 無效填答：數值欄出現文字、回答和題目無關
- 重複或疑似重複資料
- 其他你認為需要研究者確認的地方

【第一階段輸出格式】
請用表格列出：
問題類型 / 所在位置 / 原始內容 / 為什麼可疑 / 建議處理選項 / 等待研究者決定

【第二階段：等我確認後才做】
等我逐項決定後，請再協助我產出：
1. 整理後分析表
2. 處理紀錄表

【第二階段輸出格式】
請保留一張處理紀錄表：
問題類型 / 所在位置 / 原始內容 / 研究者最後決定 / 決定理由 / 處理後結果

【原始資料】
[貼你的資料 CSV / Google Sheets 連結 / 逐字稿 / 觀察紀錄 / 實驗紀錄 / 文獻編碼表]

【請在最後附上自我檢查】
- 是否保留原始資料：是／否
- 是否另做分析表：是／否
- 是否有未經研究者同意就刪除資料：否
- 是否有自行補值或改寫原始回答：否
- 是否留下處理紀錄表：是／否`}</pre>
                                <button
                                    onClick={() => { navigator.clipboard.writeText(document.querySelector('[data-prompt="w13"]')?.innerText || ''); setCopied('w13'); setTimeout(() => setCopied(null), 2000); }}
                                    className="mt-3 bg-[#1E40AF] hover:bg-[#1E3A8A] text-white px-4 py-2 rounded text-[12px] font-bold"
                                >
                                    {copied === 'w13' ? '✓ 已複製' : '📋 複製這段 Prompt'}
                                </button>
                                <span data-prompt="w13" style={{ display: 'none' }}>{`【任務】
我有一份研究問卷／訪談／實驗／文獻分析的原始資料。
請協助我整理成「可分析、可追溯」的分析表。

【重要規則】
1. 不要覆蓋原始資料。原始資料要保留，整理結果請另做一份分析表。
2. 不要自行刪除資料、補空白值、推測答案，或把模糊回答改成明確答案。
3. 第一階段只做「找問題」，不要直接清理資料。
4. 找出問題後，請等我針對每個問題回覆「保留／刪除／標記／修正格式」後，再進入第二階段。
5. 資料異常不一定要刪除，最後決定要由研究者做。

【第一階段：請先找問題】
請列出資料中所有可能需要處理的點：
- 缺漏值：空白、半空白、未填答
- 極端值：明顯偏離常態的數字
- 格式不一致：同一欄位出現不同寫法
- 無效填答：數值欄出現文字、回答和題目無關
- 重複或疑似重複資料
- 其他你認為需要研究者確認的地方

【第一階段輸出格式】
請用表格列出：
問題類型 / 所在位置 / 原始內容 / 為什麼可疑 / 建議處理選項 / 等待研究者決定

【第二階段：等我確認後才做】
等我逐項決定後，請再協助我產出：
1. 整理後分析表
2. 處理紀錄表

【第二階段輸出格式】
請保留一張處理紀錄表：
問題類型 / 所在位置 / 原始內容 / 研究者最後決定 / 決定理由 / 處理後結果

【原始資料】
[貼你的資料 CSV / Google Sheets 連結 / 逐字稿 / 觀察紀錄 / 實驗紀錄 / 文獻編碼表]

【請在最後附上自我檢查】
- 是否保留原始資料：是／否
- 是否另做分析表：是／否
- 是否有未經研究者同意就刪除資料：否
- 是否有自行補值或改寫原始回答：否
- 是否留下處理紀錄表：是／否`}</span>
                            </div>
                        </details>

                        {/* W14 prompt */}
                        <details className="rounded-[var(--radius-unified)] border-2 border-[#10B981] bg-[#F0FDF4]">
                            <summary className="cursor-pointer px-4 py-3 flex items-center gap-2 hover:bg-[#D1FAE5]">
                                <span className="font-mono text-[10px] font-bold tracking-wider text-[#047857]">W14</span>
                                <span className="font-bold text-[14px] text-[#065F46]">圖表 · Prompt</span>
                                <span className="ml-auto text-[10px] font-mono text-[#047857]">▼</span>
                            </summary>
                            <div className="border-t border-[#86EFAC] p-4">
                                <p className="text-[11.5px] text-[#065F46] mb-2 italic">學生學到：4 種圖表的選擇邏輯 + AI 製圖規則與驗收清單</p>
                                <pre className="bg-white border border-[#86EFAC] rounded p-3 text-[11.5px] leading-[1.85] whitespace-pre-wrap font-mono text-[#065F46] overflow-x-auto">{`【任務】
依我提供的圖表設定與分析表，幫我畫成一張圖。

【重要規則】
1. 請嚴格使用我指定的圖表類型，不可自行更換。
   （選圖邏輯：比較大小→長條圖／趨勢變化→折線圖／兩變項關係→散佈圖／組成比例→圓餅圖）
2. 不可自行新增、刪除或合併變項。
3. 不要替我寫圖說（描述＋推論）——那是研究者的工作。
4. 若資料有缺漏或格式看不懂，請先指出問題，不要自行猜測補值。

【我的圖表設定】
- 變項：X = ___，Y = ___
- 我選的圖表類型：___（折線圖／圓餅圖／長條圖／散佈圖）
- 圖表標題：圖一：___（N=___）
- 樣本數：N = ___

【分析表】
___
（可貼 CSV 文字、Google Sheets 可檢視連結，或上傳 Excel／CSV 檔案）

【請輸出】
1. 用我指定的圖表類型畫出圖。
2. 標題放在圖上方，並標出 N 值。
3. 圖下方標註：
   資料來源：本研究資料；研究者整理，並以 Gemini Pro（思考模式＋Canvas）協助繪製與驗收。
4. 座標軸標籤清楚，刻度合理；長條圖與折線圖的 Y 軸原則上從 0 開始。
5. 不要替我寫圖說。

【請在圖後附上自我檢查】
- 是否使用我指定的圖表類型：是／否
- 是否標出 N 值：是／否
- 是否標出資料來源：是／否
- Y 軸是否從 0 開始：是／否／不適用
- 是否有自行新增、刪除或合併變項：否`}</pre>
                                <button
                                    onClick={() => { navigator.clipboard.writeText(document.querySelector('[data-prompt="w14"]')?.innerText || ''); setCopied('w14'); setTimeout(() => setCopied(null), 2000); }}
                                    className="mt-3 bg-[#047857] hover:bg-[#065F46] text-white px-4 py-2 rounded text-[12px] font-bold"
                                >
                                    {copied === 'w14' ? '✓ 已複製' : '📋 複製這段 Prompt'}
                                </button>
                                <span data-prompt="w14" style={{ display: 'none' }}>{`【任務】
依我提供的圖表設定與分析表，幫我畫成一張圖。

【重要規則】
1. 請嚴格使用我指定的圖表類型，不可自行更換。
   （選圖邏輯：比較大小→長條圖／趨勢變化→折線圖／兩變項關係→散佈圖／組成比例→圓餅圖）
2. 不可自行新增、刪除或合併變項。
3. 不要替我寫圖說（描述＋推論）——那是研究者的工作。
4. 若資料有缺漏或格式看不懂，請先指出問題，不要自行猜測補值。

【我的圖表設定】
- 變項：X = ___，Y = ___
- 我選的圖表類型：___（折線圖／圓餅圖／長條圖／散佈圖）
- 圖表標題：圖一：___（N=___）
- 樣本數：N = ___

【分析表】
___
（可貼 CSV 文字、Google Sheets 可檢視連結，或上傳 Excel／CSV 檔案）

【請輸出】
1. 用我指定的圖表類型畫出圖。
2. 標題放在圖上方，並標出 N 值。
3. 圖下方標註：
   資料來源：本研究資料；研究者整理，並以 Gemini Pro（思考模式＋Canvas）協助繪製與驗收。
4. 座標軸標籤清楚，刻度合理；長條圖與折線圖的 Y 軸原則上從 0 開始。
5. 不要替我寫圖說。

【請在圖後附上自我檢查】
- 是否使用我指定的圖表類型：是／否
- 是否標出 N 值：是／否
- 是否標出資料來源：是／否
- Y 軸是否從 0 開始：是／否／不適用
- 是否有自行新增、刪除或合併變項：否`}</span>
                            </div>
                        </details>

                        {/* W15 prompt */}
                        <details className="rounded-[var(--radius-unified)] border-2 border-[#DC2626] bg-[#FEF2F2]">
                            <summary className="cursor-pointer px-4 py-3 flex items-center gap-2 hover:bg-[#FEE2E2]">
                                <span className="font-mono text-[10px] font-bold tracking-wider text-[#991B1B]">W15</span>
                                <span className="font-bold text-[14px] text-[#7F1D1D]">研究結論 · Prompt</span>
                                <span className="ml-auto text-[10px] font-mono text-[#991B1B]">▼</span>
                            </summary>
                            <div className="border-t border-[#FCA5A5] p-4">
                                <p className="text-[11.5px] text-[#7F1D1D] mb-2 italic">學生學到：6 條結論紅線 + AI 當結論審查員（檢查＋骨架，不代寫）</p>
                                <pre className="bg-white border border-[#FCA5A5] rounded p-3 text-[11.5px] leading-[1.85] whitespace-pre-wrap font-mono text-[#7F1D1D] overflow-x-auto">{`【任務】
我已經寫好（或正在寫）研究結論草稿。
請當我的「結論審查員」，不是「結論代筆者」——依下面兩階段做。

【第一階段：檢查我的結論草稿，不要代寫】
請逐句檢查，並用表格列出：
原句 / 問題類型 / 為什麼有問題 / 修改建議
問題類型對照這 6 條紅線：
1. 推論太遠：N=___ 卻推到全體（「全國高中生」「所有人」）
2. 相關當因果：只看到相關卻寫「導致／影響／造成／元兇」
3. 因果排名詞：用了「最關鍵／核心／主要原因」
4. 價值判斷：用了「浪費／不該／必須」這類規範性詞
5. 腦補機制：用資料沒問過的變項當原因
6. 缺限制：沒有「研究限制」段，或不足 4 條
請不要直接輸出一篇完整結論。

【第二階段：幫我整理結論骨架，不要寫成段落】
請列出（只列重點，不要寫成完整段落）：
1. 最主要發現：
2. 可以支持這個發現的資料：
3. 可以說到的範圍：
4. 不能說太滿的地方：
5. 建議我補上的研究限制（至少 4 條方向：N 數／自評偏誤／樣本偏斜／無對照組…）：

【我的研究草稿 + 圖表分析】
研究問題：___
結論草稿：___
圖表／資料：___

【請在最後附上自我檢查】
- 是否替我寫出可直接貼上的完整結論（應為「否」）：是／否
- 第一階段是否逐句標出問題＋建議：是／否
- 第二階段是否只給骨架、沒寫成段落：是／否`}</pre>
                                <button
                                    onClick={() => { navigator.clipboard.writeText(document.querySelector('[data-prompt="w15"]')?.innerText || ''); setCopied('w15'); setTimeout(() => setCopied(null), 2000); }}
                                    className="mt-3 bg-[#991B1B] hover:bg-[#7F1D1D] text-white px-4 py-2 rounded text-[12px] font-bold"
                                >
                                    {copied === 'w15' ? '✓ 已複製' : '📋 複製這段 Prompt'}
                                </button>
                                <span data-prompt="w15" style={{ display: 'none' }}>{`【任務】
我已經寫好（或正在寫）研究結論草稿。
請當我的「結論審查員」，不是「結論代筆者」——依下面兩階段做。

【第一階段：檢查我的結論草稿，不要代寫】
請逐句檢查，並用表格列出：
原句 / 問題類型 / 為什麼有問題 / 修改建議
問題類型對照這 6 條紅線：
1. 推論太遠：N=___ 卻推到全體（「全國高中生」「所有人」）
2. 相關當因果：只看到相關卻寫「導致／影響／造成／元兇」
3. 因果排名詞：用了「最關鍵／核心／主要原因」
4. 價值判斷：用了「浪費／不該／必須」這類規範性詞
5. 腦補機制：用資料沒問過的變項當原因
6. 缺限制：沒有「研究限制」段，或不足 4 條
請不要直接輸出一篇完整結論。

【第二階段：幫我整理結論骨架，不要寫成段落】
請列出（只列重點，不要寫成完整段落）：
1. 最主要發現：
2. 可以支持這個發現的資料：
3. 可以說到的範圍：
4. 不能說太滿的地方：
5. 建議我補上的研究限制（至少 4 條方向：N 數／自評偏誤／樣本偏斜／無對照組…）：

【我的研究草稿 + 圖表分析】
研究問題：___
結論草稿：___
圖表／資料：___

【請在最後附上自我檢查】
- 是否替我寫出可直接貼上的完整結論（應為「否」）：是／否
- 第一階段是否逐句標出問題＋建議：是／否
- 第二階段是否只給骨架、沒寫成段落：是／否`}</span>
                            </div>
                        </details>
                    </div>

                    {/* 這些規則怎麼知道的 */}
                    <div className="p-5 rounded-[var(--radius-unified)] bg-[#FFFBEB] border-2 border-[#F59E0B]">
                        <p className="font-bold text-[16px] text-[#92400E] mb-3">💡 這些規則怎麼知道的？</p>
                        <p className="text-[12.5px] text-[#78350F] leading-[1.95] mb-3">
                            老師上課寫給你的這些「紅線」「鐵規」「整理 4 類」——不是老師憑空想的。它們來自：
                        </p>
                        <ul className="text-[12.5px] text-[#78350F] leading-[1.95] list-disc pl-6 mb-4 space-y-1">
                            <li>📚 研究方法教科書（量化、質性各有專門教科書）</li>
                            <li>📰 學術期刊投稿規範（每個期刊都有 author guidelines）</li>
                            <li>📐 APA 格式手冊（美國心理學會出版，第 7 版，2020 年）</li>
                            <li>🎓 學界長時間累積、反覆檢驗形成的共識</li>
                        </ul>

                        <p className="font-bold text-[14px] text-[#92400E] mt-5 mb-2">🚀 等你不在我的課堂上時⋯</p>
                        <p className="text-[12.5px] text-[#78350F] leading-[1.95] mb-3">
                            你以後選了一個領域（心理學？工程？醫學？法律？），規則跟現在不一樣——而老師不會剛好在你身邊。這時，AI 可以變成你的「規則教練」：
                        </p>
                        <pre className="bg-white border border-[#FCD34D] rounded p-3 text-[11px] leading-[1.85] whitespace-pre-wrap font-mono text-[#78350F] mb-4 overflow-x-auto">{`【任務】
我正在做 ___領域 的研究，但我不熟這個領域的規範。

【規則】
請依序教我：
1. 這個領域寫研究結論的「紅線」
   （哪些用詞被學界視為過度推論？）
2. 這個領域的圖表 / 統計呈現規範
   （標題格式、座標、附註要求）
3. 「研究限制」段必須提到什麼維度
   （樣本？方法？倫理？）

【格式】
- 用列表整理
- 每條規則必須附「依據」（教科書、期刊規範、權威手冊）
- 列出 2-3 個我可以查證的來源`}</pre>

                        <p className="font-bold text-[14px] text-[#92400E] mt-5 mb-2">⚠️ 但 AI 給的規則還是要你驗證</p>
                        <p className="text-[12.5px] text-[#78350F] leading-[1.95] mb-3">
                            你問 AI「這個領域的規則是什麼」，它會給你一個說法。但這個說法是 AI 的，不是學界的。AI 可能：
                        </p>
                        <ul className="text-[12.5px] text-[#78350F] leading-[1.95] list-disc pl-6 mb-3 space-y-1">
                            <li><strong>編造看起來權威的引用</strong>（虛構教科書、虛構期刊）</li>
                            <li>把不同領域的規則混在一起</li>
                            <li>跟你的具體研究場景不符</li>
                        </ul>
                        <p className="text-[12.5px] text-[#78350F] leading-[1.95] mb-3">
                            所以你還是要：(1) 抽 1-2 條規則去 Google Scholar 查證 (2) 問領域內的老師確認 (3) 比對 2-3 個 AI 模型的回答看哪些一致、哪些不一致。
                        </p>

                        <div className="bg-[#FEF2F2] border-2 border-[#DC2626] rounded p-3 my-4">
                            <p className="font-bold text-[12.5px] text-[#991B1B] mb-2">📛 老師親身踩雷案例</p>
                            <p className="text-[11.5px] text-[#7F1D1D] leading-[1.95]">
                                做這份頁面時，老師讓 AI 幫忙寫「規則來源說明」。AI 寫了「研究方法教科書（質化量化各 500 頁）」——看起來很具體、很可信。但這個「500 頁」是 AI 編的，沒人查證。
                            </p>
                            <p className="text-[11.5px] text-[#7F1D1D] leading-[1.95] mt-2">
                                如果直接放進你的研究報告，就變成「我引用了一本不存在規格的書」，等於說謊。<strong>連老師都會被 AI 騙到，何況是你。</strong>
                            </p>
                        </div>

                        <div className="bg-[var(--ink)] text-white rounded p-4 mt-5">
                            <p className="font-mono text-[10.5px] tracking-wider text-[#FCD34D] uppercase mb-2">🎯 這門課真正要你帶走的</p>
                            <p className="text-[12.5px] leading-[1.95] text-white/90 mb-3">
                                不是這幾條規則本身，是「<strong className="text-[#FCD34D]">不在規則裡時，怎麼自己找到規則 + 怎麼判斷規則對不對</strong>」。
                            </p>
                            <ul className="text-[11.5px] leading-[1.95] text-white/85 space-y-1.5 list-none pl-0">
                                <li>· 老師現在告訴你規則 → 你照做<span className="text-white/55">（拐杖期）</span></li>
                                <li>· 未來 AI 告訴你規則 → 你判斷取捨<span className="text-white/55">（自學期）</span></li>
                                <li>· 最後 你自己提出規則 → 你成為研究者<span className="text-white/55">（成熟期）</span></li>
                            </ul>
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
                    <span className="hidden md:inline">研究方法與專題 / 自學工具 / </span><span className="text-[var(--ink)] font-bold">AI 報告找雷大挑戰</span>
                </div>
                <Link to="/prompt-lab" className="text-[11px] text-[var(--ink-light)] hover:text-[var(--accent)] flex items-center gap-1 font-mono no-underline">
                    <ArrowLeft size={12} /> 回 Prompt 實驗室
                </Link>
            </div>

            <HeroBlock
                kicker="🕵️ 大家來找碴！· W13~W15 跨週 AI 草稿實戰"
                title="AI 寫的研究報告："
                accentTitle="哪裡有問題？"
                subtitle="流程：先看 25 筆原始資料（你能找出幾個問題？）→ 看老師怎麼用三句 prompt 丟給 AI → 看 AI 端到端生成的報告——找出 13 個明顯錯誤，對照 W13/W14/W15 的研究員紅線。"
                meta={[
                    { label: '三種用法', value: 'W12 末預覽 / W13~W15 課中對照 / W15 末驗收' },
                    { label: '案例', value: '高中生睡眠 vs 上課專注力（問卷法 N=22）' },
                    { label: '雷的數量', value: `共 ${TOTAL_TRAPS} 個（W13 整理 3 + W14 圖表 4 + W15 結論 6）` },
                    { label: '收網', value: '找完後對照 17 條紅線 + 4 元素 prompt 寫法' },
                ]}
            />

            <StepEngine
                steps={steps}
                flat
                weekCode="AI · FIND-TRAPS"
                prevWeek={{ label: '回 Prompt 實驗室', to: '/prompt-lab' }}
            />

            <div className="h-20" />
        </div>
    );
};

/* ── orphaned old content removed ── */
//

export default FindTrapsReport;
