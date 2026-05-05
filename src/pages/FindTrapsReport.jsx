import React, { useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Scatter, Bar } from 'react-chartjs-2';
import { ArrowLeft, AlertTriangle, CheckCircle2, Eye, RotateCcw, Sparkles, Target } from 'lucide-react';
import HeroBlock from '../components/ui/HeroBlock';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
);

/* ══════════════════════════════════════
 *  資料常數 — Gemini 預先「整理好」的 22 筆乾淨資料
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
        issue: 'W14 5 鐵規要求標題格式為「圖一：___（N=___）」，但 AI 只給「睡眠時數與專注力的關係」，沒有圖編號、沒有 N 值、也沒有資料來源「研究者繪製」。',
        shouldDo: '改「圖一：睡眠時數與上課專注力散佈圖（N=22）」並在圖下方標「資料來源：研究者繪製」。',
    },
};

const TOTAL_TRAPS = Object.keys(TRAPS).length;

/* ══════════════════════════════════════
 *  TrapTarget — 雷區包裝元件
 * ══════════════════════════════════════ */
const TrapTarget = ({ id, found, showAll, onFind, children }) => {
    const isRevealed = found || showAll;
    return (
        <span
            onClick={() => !found && onFind(id)}
            className={`
                inline cursor-pointer transition-all rounded px-1
                ${isRevealed
                    ? 'bg-[#FEE2E2] text-[#991B1B] font-bold underline decoration-2 decoration-[#DC2626]'
                    : 'hover:bg-[#FEF3C7] hover:underline hover:decoration-dotted'}
            `}
            title={isRevealed ? `已揭曉：${TRAPS[id].label}` : '點點看？'}
        >
            {children}
            {isRevealed && <span className="text-[10px] ml-1 font-mono">⚠️</span>}
        </span>
    );
};

/* ══════════════════════════════════════
 *  TrapExplanation — 雷的拆解卡（在 Reveal 後顯示）
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
 *  主元件
 * ══════════════════════════════════════ */
export const FindTrapsReport = () => {
    const [foundTraps, setFoundTraps] = useState(new Set());
    const [showAll, setShowAll] = useState(false);
    const [showExplanations, setShowExplanations] = useState(false);

    const handleFind = useCallback((id) => {
        setFoundTraps(prev => {
            const next = new Set(prev);
            next.add(id);
            return next;
        });
    }, []);

    const revealAll = () => {
        setShowAll(true);
        setShowExplanations(true);
    };
    const reset = () => {
        setFoundTraps(new Set());
        setShowAll(false);
        setShowExplanations(false);
    };

    const isRevealed = (id) => foundTraps.has(id) || showAll;
    const score = foundTraps.size;
    const isComplete = score >= TOTAL_TRAPS;

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
                kicker="📺 老師上課示範用 · AI 反面教材"
                title="AI 寫的研究報告："
                accentTitle="哪裡有問題？"
                subtitle="這是 Gemini 端到端寫的「高中生睡眠 vs. 上課專注力」研究報告，看起來圖文並茂，但暗藏 8 個學術紅線。你能找出幾個？"
                meta={[
                    { label: '案例', value: '高中生睡眠 vs 上課專注力（問卷法 N=22）' },
                    { label: '雷的數量', value: `共 ${TOTAL_TRAPS} 個（W13 整理 1 + W14 圖表 1 + W15 結論 6）` },
                    { label: '玩法', value: '讀完報告，看到覺得有問題的字句就點點看' },
                    { label: '收網', value: '找完後跳出「為什麼會錯？」+ 4 元素 prompt 寫法' },
                ]}
            />

            {/* ⭐ 老師當時給 Gemini 的 prompt — 反面教材的關鍵：讓學生先看到 prompt 多簡陋 */}
            <div className="my-8 max-w-[820px] mx-auto">
                <div className="bg-[#FEF2F2] border-2 border-[#DC2626] rounded-[var(--radius-unified)] p-5">
                    <div className="flex items-center gap-2 mb-3">
                        <AlertTriangle size={20} className="text-[#DC2626]" />
                        <p className="font-mono text-[11px] font-bold tracking-[0.15em] text-[#991B1B] uppercase">老師當時給 Gemini 的 prompt（看完你就知道為什麼 AI 會寫這樣）</p>
                    </div>
                    <p className="text-[12.5px] text-[#7F1D1D] leading-[1.85] mb-4">
                        老師只下了<strong>三句很短的 prompt</strong>，沒給規則、沒設限制、沒提紅線。下方就是 Gemini 端到端跑出來的結果——看起來很完整，但暗藏雷。
                    </p>

                    {/* 三句 prompt */}
                    <div className="space-y-2">
                        <div className="bg-white border-l-4 border-[#DC2626] rounded-r p-3">
                            <p className="text-[11px] font-mono font-bold text-[#991B1B] mb-1">PROMPT 1 → W13 整理</p>
                            <p className="text-[12.5px] text-[var(--ink)] font-mono leading-[1.85]">
                                「我有一份高中生睡眠 vs 專注力的問卷原始資料，請幫我整理成乾淨的分析表」
                            </p>
                            <p className="text-[10.5px] text-[#991B1B] italic mt-1">
                                + 貼上 25 筆原始資料 CSV
                            </p>
                        </div>

                        <div className="bg-white border-l-4 border-[#DC2626] rounded-r p-3">
                            <p className="text-[11px] font-mono font-bold text-[#991B1B] mb-1">PROMPT 2 → W14 畫圖</p>
                            <p className="text-[12.5px] text-[var(--ink)] font-mono leading-[1.85]">
                                「依這份分析表，幫我畫個合適的圖」
                            </p>
                        </div>

                        <div className="bg-white border-l-4 border-[#DC2626] rounded-r p-3">
                            <p className="text-[11px] font-mono font-bold text-[#991B1B] mb-1">PROMPT 3 → W15 結論</p>
                            <p className="text-[12.5px] text-[var(--ink)] font-mono leading-[1.85]">
                                「依這份圖，幫我寫研究結論」
                            </p>
                        </div>
                    </div>

                    {/* 看原始資料 */}
                    <details className="mt-4 bg-white border border-[#FCA5A5] rounded">
                        <summary className="cursor-pointer px-3 py-2 text-[11.5px] font-bold text-[#991B1B] hover:bg-[#FEF2F2]">
                            📋 看 25 筆原始問卷資料（含 5 筆雜訊樣本）▼
                        </summary>
                        <div className="border-t border-[#FCA5A5] p-3 max-h-[300px] overflow-y-auto">
                            <pre className="text-[10.5px] font-mono text-[var(--ink-mid)] leading-[1.75] whitespace-pre">
{`時間戳,性別,年級,平日平均睡眠時數,有無補習,平日有無使用 3C 至凌晨,上課自評專注力(1-10)
2026/4/15 08:31,男,高一,7.5,有,偶爾,8
2026/4/15 08:32,女,高一,5.0,有,常常,4
2026/4/15 08:34,F,高一,8.5,沒有,沒有,9     ← 性別格式異常
2026/4/15 08:35,男,高二,6.0,,偶爾,5         ← 補習空白
2026/4/15 08:36,女,高一,7.0,有,偶爾,7
2026/4/15 08:38,M,高一,4.5,有,常常,3        ← 性別格式異常
2026/4/15 08:40,女,高一,8.0,沒有,沒有,8
2026/4/15 08:41,男,高一,6.5,有,偶爾,6
2026/4/15 08:43,女,高二,5.5,有,常常,5
2026/4/15 08:45,男,高一,7.5,沒有,偶爾,7
2026/4/15 08:46,女,高一,,有,常常,           ← 半空白（睡眠+專注力都空）
2026/4/15 08:48,男,高一,12.0,沒有,沒有,10   ← 極端值！高一平日睡 12 小時？
2026/4/15 08:49,女,高一,5.0,有,常常,3
2026/4/15 08:51,男,高二,7.0,沒有,偶爾,7
2026/4/15 08:52,,高一,6.5,有,偶爾,5         ← 性別空白
2026/4/15 08:54,女,高一,8.0,沒有,沒有,9
2026/4/15 08:55,男,高一,5.5,有,常常,4
2026/4/15 08:57,女,高二,7.0,沒有,偶爾,6
2026/4/15 08:58,男,高一,6.0,有,常常,5
2026/4/15 09:00,女,高一,8.5,沒有,沒有,8
2026/4/15 09:01,,,,,,,                       ← 整列空白
2026/4/15 09:02,男,高三,7.0,有,偶爾,7
2026/4/15 09:03,女,高一,6.5,有,常常,test    ← 專注力填 "test"
2026/4/15 09:05,M,高一,8.0,沒有,沒有,8      ← 性別格式異常
2026/4/15 09:06,女,高一,5.5,有,常常,4`}
                            </pre>
                        </div>
                    </details>

                    <p className="text-[11.5px] text-[#7F1D1D] italic mt-3 pt-3 border-t border-[#FCA5A5]">
                        💡 看完 prompt 跟雜訊資料，再去下方看 AI 寫了什麼。<strong>記住一件事：AI 沒做錯，是 prompt 沒給規則。</strong>
                    </p>
                </div>
            </div>

            {/* 計分區 + 控制 */}
            <div className="my-8 max-w-[760px] mx-auto">
                <div className="bg-[var(--ink)] text-white rounded-[var(--radius-unified)] p-5 flex flex-col md:flex-row items-center justify-between gap-4">
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
                    <p className="text-[12px] text-[var(--ink-mid)] italic mt-3 text-center">
                        💡 提示：游標移到文字上會微微反白的就是可點區。但不是所有可點區都是雷——點點看才知道。
                    </p>
                )}
            </div>

            {/* 切換顯示拆解卡 */}
            {(score > 0 || showAll) && (
                <div className="max-w-[760px] mx-auto mb-6 flex justify-end">
                    <button
                        onClick={() => setShowExplanations(!showExplanations)}
                        className="text-[11.5px] text-[var(--ink-mid)] hover:text-[var(--accent)] underline"
                    >
                        {showExplanations ? '隱藏拆解卡' : '顯示拆解卡'}
                    </button>
                </div>
            )}

            {/* ════════════════════════════════════════
             *  Gemini 報告本體
             * ════════════════════════════════════════ */}
            <div className="max-w-[820px] mx-auto bg-white border border-[var(--border)] rounded-[var(--radius-unified)] p-6 md:p-8 shadow-sm prose-zh">
                <div className="border-b border-[var(--border)] pb-4 mb-6">
                    <p className="text-[11px] font-mono text-[var(--ink-light)] uppercase tracking-wider mb-1">📄 GEMINI 端到端報告</p>
                    <h1 className="font-serif text-[24px] md:text-[28px] font-bold text-[var(--ink)] leading-tight m-0">高中生睡眠與專注力分析報告</h1>
                </div>

                {/* 一、資料清理 */}
                <section className="mb-8">
                    <h2 className="font-serif text-[18px] md:text-[20px] font-bold text-[var(--ink)] mb-3">一、 資料清理說明</h2>
                    <p className="text-[13px] text-[var(--ink-mid)] leading-[1.85]">在進行分析前，針對原始問卷資料進行了以下清理步驟，以確保數據的準確性：</p>
                    <ul className="text-[13px] text-[var(--ink-mid)] leading-[1.95] list-disc pl-6 space-y-1 mt-2">
                        <li><strong>標準化輸入：</strong>將性別欄位中的 F 與 M 統一轉換為「女」與「男」。</li>
                        <li><strong>處理遺失與異常值：</strong>剔除第 21 筆「完全空白」的無效資料；剔除第 11 筆缺少「睡眠時數」與「專注力」核心指標的資料；剔除第 23 筆專注力欄位填寫為無效字串「test」的資料。</li>
                        <li><strong>填補次要缺漏：</strong>針對僅缺少性別（第 15 筆）或補習狀況（第 4 筆）但核心數據完整的樣本，標記為「未提供」並保留，最終獲得 22 筆有效分析樣本。</li>
                    </ul>
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
                                                ? <TrapTarget id={1} found={isRevealed(1)} showAll={showAll} onFind={handleFind}>{d.sleep}</TrapTarget>
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
                    {showExplanations && isRevealed(1) && <TrapExplanation id={1} />}
                </section>

                {/* 三、研究結論 */}
                <section className="mb-8">
                    <h2 className="font-serif text-[18px] md:text-[20px] font-bold text-[var(--ink)] mb-3">三、 研究結論</h2>
                    <p className="text-[13px] text-[var(--ink-mid)] leading-[1.85]">根據上述清理後的有效數據，我們進行交叉比對與平均數分析，得出以下三大核心研究結論：</p>

                    {/* 結論 1 */}
                    <div className="mt-4">
                        <h3 className="font-bold text-[15px] text-[var(--ink)] mb-2">1. 睡眠時數與專注力呈「
                            <TrapTarget id={2} found={isRevealed(2)} showAll={showAll} onFind={handleFind}>高度</TrapTarget>正相關」</h3>
                        <p className="text-[13px] text-[var(--ink-mid)] leading-[1.85]">
                            數據顯示，學生的自評專注力分數完全跟隨睡眠時數增減。平均睡眠時數達到 8 小時以上的學生，其專注力評分均落在 8~10 分的高水準；反觀睡眠時數低於 6 小時的學生，專注力普遍低落於 5 分以下。這
                            <TrapTarget id={3} found={isRevealed(3)} showAll={showAll} onFind={handleFind}>證實了</TrapTarget>充足的睡眠是維持高中生課堂專注力的
                            <TrapTarget id={4} found={isRevealed(4)} showAll={showAll} onFind={handleFind}>最關鍵基石</TrapTarget>。
                        </p>
                        {showExplanations && isRevealed(2) && <TrapExplanation id={2} />}
                        {showExplanations && isRevealed(3) && <TrapExplanation id={3} />}
                        {showExplanations && isRevealed(4) && <TrapExplanation id={4} />}
                    </div>

                    {/* 結論 2 */}
                    <div className="mt-4">
                        <h3 className="font-bold text-[15px] text-[var(--ink)] mb-2">2. 熬夜使用 3C 產品是破壞專注力的「
                            <TrapTarget id={5} found={isRevealed(5)} showAll={showAll} onFind={handleFind}>核心元兇</TrapTarget>」</h3>
                        <p className="text-[13px] text-[var(--ink-mid)] leading-[1.85]">
                            進一步分析「使用 3C 至凌晨」的頻率與表現：「常常」熬夜使用 3C 者，平均睡眠僅約 5.3 小時，專注力平均慘跌至 4 分，表現最差。「沒有」熬夜使用 3C 者，平均睡眠高達 8.8 小時，專注力平均高達 8.7 分，表現最優異。此落差表明，睡前過度使用 3C 產品不僅嚴重壓縮睡眠時間，更直接導致隔日課堂精神渙散。
                        </p>
                        {showExplanations && isRevealed(5) && <TrapExplanation id={5} />}
                    </div>

                    {/* 結論 3 */}
                    <div className="mt-4">
                        <h3 className="font-bold text-[15px] text-[var(--ink)] mb-2">3. 「補習」對作息可能產生「
                            <TrapTarget id={6} found={isRevealed(6)} showAll={showAll} onFind={handleFind}>排擠效應</TrapTarget>」</h3>
                        <p className="text-[13px] text-[var(--ink-mid)] leading-[1.85]">
                            在「有無補習」的交叉分析中，「有補習」的學生群體整體平均睡眠時數與專注力，皆略低於「沒有補習」的學生。這反映出課後補習可能延長了學生的學習時間並壓縮了休息時間。對於有補習的學生而言，如何做好時間管理以避免排擠睡眠，是維持學習效率的重要課題。
                        </p>
                        {showExplanations && isRevealed(6) && <TrapExplanation id={6} />}
                    </div>

                    {/* 雷 7：缺研究限制段（直接顯示提示按鈕） */}
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
                        {showExplanations && isRevealed(7) && <TrapExplanation id={7} />}
                    </div>
                </section>

                {/* 圖表儀表板 */}
                <section>
                    <h2 className="font-serif text-[18px] md:text-[20px] font-bold text-[var(--ink)] mb-1">📊 視覺化儀表板</h2>
                    <p className="text-[12px] text-[var(--ink-mid)] mb-4">
                        基於 22 份有效樣本（已清理）。圖表標題：
                        <TrapTarget id={8} found={isRevealed(8)} showAll={showAll} onFind={handleFind}>「睡眠時數與專注力的關係」</TrapTarget>
                    </p>
                    {showExplanations && isRevealed(8) && <TrapExplanation id={8} />}

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
                        </div>
                    </div>
                </section>
            </div>

            {/* 收網卡 — 找完所有雷後出現 */}
            {isComplete && (
                <div className="max-w-[760px] mx-auto mt-10 p-6 rounded-[var(--radius-unified)] bg-gradient-to-br from-[var(--ink)] to-[#1E293B] text-white shadow-xl">
                    <div className="flex items-center gap-2 mb-3">
                        <Sparkles size={22} className="text-[var(--accent)]" />
                        <p className="font-mono text-[11px] font-bold tracking-[0.2em] text-[var(--accent)] uppercase">恭喜全部找到了 · 來看為什麼</p>
                    </div>
                    <h3 className="font-serif text-[20px] md:text-[24px] font-bold leading-tight mb-3">
                        為什麼 AI 會寫這麼多雷？
                    </h3>
                    <p className="text-[13.5px] text-white/85 leading-[1.95] mb-4">
                        因為老師問 Gemini 的 prompt 只有：「<strong className="text-[var(--accent)]">幫我寫研究結論</strong>」。
                        AI 沒有研究員的判斷力，它用最常見的語言（新聞／部落格）寫，當然會踩雷。
                    </p>
                    <div className="bg-white/10 rounded p-4 mb-4">
                        <p className="font-bold text-[14px] text-[var(--accent)] mb-2">一個好 prompt = 4 件事 ⭐</p>
                        <ul className="text-[12.5px] text-white/85 leading-[1.95] space-y-1">
                            <li>① <strong>角色</strong>（你是研究方法老師…）</li>
                            <li>② <strong>任務</strong>（幫我審查結論…）</li>
                            <li>③ <strong>規則／紅線</strong>（N=22 不可用「證實」「最關鍵」；必含限制段；區分相關 vs 因果）⭐</li>
                            <li>④ <strong>格式</strong>（分四層輸出：描述／推論／限制／回扣）</li>
                        </ul>
                    </div>
                    <p className="text-[12px] text-white/70 italic">
                        💡 把判斷力寫進 prompt——這就是研究者的素養。
                    </p>
                    <Link
                        to="/prompt-lab"
                        className="inline-flex items-center gap-2 mt-4 bg-[var(--accent)] hover:opacity-90 text-[var(--ink)] px-4 py-2 rounded-[6px] text-[13px] font-bold no-underline"
                    >
                        看好 prompt 怎麼寫 <Sparkles size={14} />
                    </Link>
                </div>
            )}

            {/* 進度提示卡（找了一些但還沒全找完）*/}
            {!isComplete && score > 0 && score < TOTAL_TRAPS && (
                <div className="max-w-[760px] mx-auto mt-8 p-4 rounded-[var(--radius-unified)] bg-[#FFFBEB] border border-[#FCD34D]">
                    <p className="text-[13px] font-bold text-[#92400E] mb-1">
                        <CheckCircle2 size={14} className="inline mr-1" />
                        已找到 {score} / {TOTAL_TRAPS}！繼續找看看
                    </p>
                    <p className="text-[11.5px] text-[#78350F] leading-relaxed">
                        提示：W13 整理階段 1 個（資料表裡）／W14 圖表 1 個（標題格式）／W15 結論 6 個（用詞 + 缺什麼段落）
                    </p>
                </div>
            )}

            <div className="h-20" />
        </div>
    );
};

export default FindTrapsReport;
