import React, { useState, useMemo, useCallback } from 'react';
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
        issue: 'W14 5 鐵規要求標題格式為「圖一：___（N=___）」，但 AI 只給「睡眠時數與專注力的關係」，沒有圖編號、沒有 N 值、也沒有資料來源「研究者繪製」。',
        shouldDo: '改「圖一：睡眠時數與上課專注力散佈圖（N=22）」並在圖下方標「資料來源：研究者繪製」。',
    },
};

const TOTAL_TRAPS = Object.keys(TRAPS).length;

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
const TrapTarget = ({ id, type = 'real', found, showAll, onFind, children }) => {
    const isRealRevealed = type === 'real' && (found || showAll);
    const isFakeRevealed = type === 'fake' && found;
    const isRevealed = isRealRevealed || isFakeRevealed;

    let className = 'inline transition-all rounded px-1 ';
    if (isRealRevealed) {
        className += 'cursor-default bg-[#FEE2E2] text-[#991B1B] font-bold underline decoration-2 decoration-[#DC2626]';
    } else if (isFakeRevealed) {
        className += 'cursor-default bg-[#D1FAE5] text-[#065F46] font-bold underline decoration-2 decoration-[#10B981]';
    } else {
        // 預設：明顯可見的「可疑詞」標記（手機友善 — 不依賴 hover）
        className += 'cursor-pointer bg-[#FEF3C7] underline decoration-dotted decoration-[#92400E]/60 active:bg-[#FCD34D]';
    }

    return (
        <span
            onClick={() => !found && onFind(id, type)}
            className={className}
            title={isRevealed ? '已揭曉（請看下方紅/綠卡解釋）' : '你覺得這個是真雷還是假雷？點看答案'}
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

/* ══════════════════════════════════════
 *  主元件
 * ══════════════════════════════════════ */
export const FindTrapsReport = () => {
    const [foundTraps, setFoundTraps] = useState(new Set());
    const [foundFakes, setFoundFakes] = useState(new Set());
    const [showAll, setShowAll] = useState(false);
    const [showExplanations, setShowExplanations] = useState(false);
    const [copied, setCopied] = useState(null);

    const handleFind = useCallback((id, type) => {
        if (type === 'fake') {
            setFoundFakes(prev => {
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
    };

    const isRevealed = (id) => foundTraps.has(id) || showAll;
    const isFakeFound = (id) => foundFakes.has(id);
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
                subtitle="這是 AI 端到端寫的「高中生睡眠 vs. 上課專注力」研究報告，看起來圖文並茂，但暗藏 8 個學術紅線。你能找出幾個？"
                meta={[
                    { label: '案例', value: '高中生睡眠 vs 上課專注力（問卷法 N=22）' },
                    { label: '雷的數量', value: `共 ${TOTAL_TRAPS} 個（W13 整理 1 + W14 圖表 1 + W15 結論 6）` },
                    { label: '玩法', value: '讀完報告，看到覺得有問題的字句就點點看' },
                    { label: '收網', value: '找完後跳出「為什麼會錯？」+ 4 元素 prompt 寫法' },
                ]}
            />

            {/* ⭐ 老師當時給 AI 的 prompt — 反面教材的關鍵：讓學生先看到 prompt 多簡陋 */}
            <div className="my-8 max-w-[820px] mx-auto">
                <div className="bg-[#FEF2F2] border-2 border-[#DC2626] rounded-[var(--radius-unified)] p-5">
                    <div className="flex items-center gap-2 mb-3">
                        <AlertTriangle size={20} className="text-[#DC2626]" />
                        <p className="font-mono text-[11px] font-bold tracking-[0.15em] text-[#991B1B] uppercase">老師當時給 AI 的 prompt（看完你就知道為什麼 AI 會寫這樣）</p>
                    </div>
                    <p className="text-[12.5px] text-[#7F1D1D] leading-[1.85] mb-4">
                        老師只下了<strong>三句很短的 prompt</strong>，沒給規則、沒設限制、沒提紅線。下方就是 AI 端到端跑出來的結果——看起來很完整，但暗藏雷。
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

                    <p className="text-[11.5px] text-[#7F1D1D] italic mt-3 pt-3 border-t border-[#FCA5A5] leading-[1.85]">
                        💡 看完 prompt 跟雜訊資料，再去下方看 AI 寫了什麼。<strong>記住兩件事</strong>：
                        <br />（1）AI 沒做錯，是 <strong>prompt 沒給規則</strong>。
                        <br />（2）研究類問題對 AI 的<strong>邏輯精度與專業度要求很高</strong>——一般模型在這領域容易出錯，但只要 <strong>prompt 寫得好、規則設清楚</strong>，這些雷都可以避開。
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
                    <div className="mt-4 bg-[#FFFBEB] border-2 border-[#F59E0B] rounded-[var(--radius-unified)] p-5 max-w-[760px] mx-auto">
                        <p className="font-bold text-[16px] md:text-[18px] text-[#92400E] mb-3 flex items-center gap-2">
                            <span className="text-[22px]">🎯</span>
                            怎麼玩？看這裡！
                        </p>
                        <ol className="text-[14px] md:text-[15px] text-[#78350F] leading-[1.95] list-decimal pl-6 space-y-1.5">
                            <li><strong>讀完下方那份 AI 寫的研究報告</strong>（看起來圖文並茂）</li>
                            <li>你覺得哪裡有問題？<strong className="text-[#92400E]">直接用手指點那段文字</strong>（會看到底色比較深的字就是可點區）</li>
                            <li>點對 → 跳出「⚠️ 這是雷」+ 為什麼錯 + 該怎麼改</li>
                            <li>點到「假雷」（看起來可疑但其實 OK）→ 跳出「💚 這個其實沒問題」+ 解釋</li>
                            <li>找到 8 個真雷 → 解鎖收網卡（為什麼 AI 會寫這麼多雷？）</li>
                        </ol>
                        <p className="text-[12.5px] text-[#92400E] italic mt-3 pt-3 border-t border-[#F59E0B]/40 leading-[1.85]">
                            ⚡ <strong>注意</strong>：報告裡有<strong>真雷（要找）</strong>跟<strong>假雷（看似可疑但其實 OK）</strong>——點點看才知道。卡關了？按下方「全部揭曉」。
                        </p>
                    </div>
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
             *  AI 報告本體
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

                {/* 三、視覺化儀表板（移到結論前 — 先看圖再看結論）*/}
                <section className="mb-8">
                    <h2 className="font-serif text-[18px] md:text-[20px] font-bold text-[var(--ink)] mb-1">三、 視覺化儀表板</h2>
                    <p className="text-[12px] text-[var(--ink-mid)] mb-4">
                        基於 22 份有效樣本（已清理）。圖表標題：
                        <TrapTarget id={8} found={isRevealed(8)} showAll={showAll} onFind={handleFind}>「睡眠時數與專注力的關係」</TrapTarget>
                    </p>
                    {showExplanations && isRevealed(8) && <TrapExplanation id={8} />}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        {/* 散佈圖 + 圖說 */}
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
                                    <strong>描述：</strong>N=22 學生中，睡眠時數從 4.5 到 12 小時不等，專注力分數從 3 到 10 分。整體而言，睡眠時數較高的學生，專注力分數也傾向較高。
                                </p>
                                <p className="text-[#1E3A8A]">
                                    <strong>推論：</strong>兩變項看似呈正向關聯，但本研究無法判斷是因果、共同原因、或反向因果。需更嚴謹研究設計才能釐清。
                                </p>
                            </div>
                        </div>

                        {/* 3C 混合圖 + 圖說 */}
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
                                    <strong>推論：</strong>兩條趨勢方向一致，3C 使用程度可能與睡眠及專注力同時相關。但本資料無法判斷誰是誰的原因，也可能有其他變項（壓力、習慣）同時影響三者。
                                </p>
                            </div>
                        </div>

                        {/* 補習對比 + 圖說 */}
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
                                    <strong>描述：</strong>有補習組（n=12）平均睡眠 6.5 小時、專注力 5.6 分；無補習組（n=8）平均睡眠 7.6 小時、專注力 7.4 分。
                                </p>
                                <p className="text-[#1E3A8A]">
                                    <strong>推論：</strong>兩組數值有差異，但差異原因可能涉及補習時長、家庭因素、學業壓力等。本資料未控制這些變項，無法把差異歸因於「補習」本身。
                                </p>
                            </div>

                            {/* 高一常寫錯版（details 對照卡） */}
                            <details className="mt-2 rounded border-2 border-[#DC2626]/40 bg-[#FEF2F2]">
                                <summary className="cursor-pointer px-3 py-2 text-[12px] font-bold text-[#991B1B] hover:bg-[#FEE2E2] flex items-center gap-2">
                                    <span>📛 學生最常寫錯的 4 種版本（點開對照看）</span>
                                    <span className="ml-auto text-[10px] font-mono">▼</span>
                                </summary>
                                <div className="border-t border-[#DC2626]/40 p-3 space-y-3 text-[11.5px] leading-[1.85]">

                                    <div className="bg-white border border-[#FCA5A5] rounded p-2.5">
                                        <p className="font-bold text-[#991B1B] mb-1">❌ 錯誤 1：直接歸因（最常見）</p>
                                        <p className="text-[#7F1D1D] italic mb-1.5">「補習<u>導致</u>學生睡眠減少、專注力下降。建議家長減少讓孩子補習。」</p>
                                        <p className="text-[#7F1D1D] text-[11px]">
                                            <strong className="text-[#991B1B]">錯在哪：</strong>「導致」是因果，但資料只能看到「相關」。沒控制變項——可能真正影響的是「補習時長」「家庭壓力」或「會去補習的學生本來就有原因」。
                                        </p>
                                    </div>

                                    <div className="bg-white border border-[#FCA5A5] rounded p-2.5">
                                        <p className="font-bold text-[#991B1B] mb-1">❌ 錯誤 2：道德化、規範性主張</p>
                                        <p className="text-[#7F1D1D] italic mb-1.5">「補習浪費時間，是現代教育的問題。」</p>
                                        <p className="text-[#7F1D1D] text-[11px]">
                                            <strong className="text-[#991B1B]">錯在哪：</strong>學術論文不該下價值判斷。「浪費」「教育問題」是個人立場，不是資料能支持的結論。研究員只能說「兩組有差異」，評論員才會說「補習浪費」。
                                        </p>
                                    </div>

                                    <div className="bg-white border border-[#FCA5A5] rounded p-2.5">
                                        <p className="font-bold text-[#991B1B] mb-1">❌ 錯誤 3：過度推廣樣本</p>
                                        <p className="text-[#7F1D1D] italic mb-1.5">「研究結果顯示，台灣所有高中生不該補習。」</p>
                                        <p className="text-[#7F1D1D] text-[11px]">
                                            <strong className="text-[#991B1B]">錯在哪：</strong>N=20 不能推到「台灣所有高中生」。應限縮：「<strong>在本研究 22 位高一學生中</strong>…」，並在「研究限制」段註明樣本侷限。
                                        </p>
                                    </div>

                                    <div className="bg-white border border-[#FCA5A5] rounded p-2.5">
                                        <p className="font-bold text-[#991B1B] mb-1">❌ 錯誤 4：忽略反向因果（高階）</p>
                                        <p className="text-[#7F1D1D] italic mb-1.5">「補習壓縮了學生的睡眠時間。」</p>
                                        <p className="text-[#7F1D1D] text-[11px]">
                                            <strong className="text-[#991B1B]">錯在哪：</strong>
                                            <br />· <strong>反向可能</strong>：睡眠少／專注力差的學生<strong>選擇去補習補救</strong>（因果方向反過來）
                                            <br />· <strong>共同原因</strong>：壓力大的家庭環境<strong>同時</strong>導致補習 + 睡眠少
                                            <br />· 橫斷資料無法判斷因果方向。
                                        </p>
                                    </div>

                                    <p className="text-[10.5px] text-[#7F1D1D] italic pt-2 border-t border-[#FCA5A5]/50">
                                        💡 對照上方藍色「研究員圖說（示範）」——你看到差別了嗎？研究員只說「資料看到什麼」+「為什麼不能下因果結論」，不下評價、不推廣、不腦補機制。
                                    </p>
                                </div>
                            </details>
                        </div>
                    </div>
                </section>

                {/* 四、研究結論（移到圖表後 — 含 3 個假雷訓練辨真假）*/}
                <section className="mb-8">
                    <h2 className="font-serif text-[18px] md:text-[20px] font-bold text-[var(--ink)] mb-3">四、 研究結論</h2>
                    <p className="text-[13px] text-[var(--ink-mid)] leading-[1.85]">根據上述清理後的有效數據，我們進行交叉比對與平均數分析，得出以下三大核心研究結論：</p>

                    {/* 結論 1（含真雷 #2 #3 #4 + 假雷 F1 F3）*/}
                    <div className="mt-4">
                        <h3 className="font-bold text-[15px] text-[var(--ink)] mb-2">1. 睡眠時數與專注力呈「
                            <TrapTarget id={2} found={isRevealed(2)} showAll={showAll} onFind={handleFind}>高度</TrapTarget>正相關」</h3>
                        <p className="text-[13px] text-[var(--ink-mid)] leading-[1.85]">
                            數據顯示，學生的自評專注力分數
                            <TrapTarget id="F1" type="fake" found={isFakeFound('F1')} showAll={showAll} onFind={handleFind}>完全跟隨</TrapTarget>
                            睡眠時數增減。平均睡眠時數達到 8 小時以上的學生，其專注力評分均落在
                            <TrapTarget id="F3" type="fake" found={isFakeFound('F3')} showAll={showAll} onFind={handleFind}>8~10 分的高水準</TrapTarget>
                            ；反觀睡眠時數低於 6 小時的學生，專注力普遍低落於 5 分以下。這
                            <TrapTarget id={3} found={isRevealed(3)} showAll={showAll} onFind={handleFind}>證實了</TrapTarget>充足的睡眠是維持高中生課堂專注力的
                            <TrapTarget id={4} found={isRevealed(4)} showAll={showAll} onFind={handleFind}>最關鍵基石</TrapTarget>。
                        </p>
                        {showExplanations && isRevealed(2) && <TrapExplanation id={2} />}
                        {showExplanations && isFakeFound('F1') && <FakeTrapExplanation id="F1" />}
                        {showExplanations && isFakeFound('F3') && <FakeTrapExplanation id="F3" />}
                        {showExplanations && isRevealed(3) && <TrapExplanation id={3} />}
                        {showExplanations && isRevealed(4) && <TrapExplanation id={4} />}
                    </div>

                    {/* 結論 2（含真雷 #5 + 假雷 F2）*/}
                    <div className="mt-4">
                        <h3 className="font-bold text-[15px] text-[var(--ink)] mb-2">2. 熬夜使用 3C 產品是破壞專注力的「
                            <TrapTarget id={5} found={isRevealed(5)} showAll={showAll} onFind={handleFind}>核心元兇</TrapTarget>」</h3>
                        <p className="text-[13px] text-[var(--ink-mid)] leading-[1.85]">
                            進一步分析「使用 3C 至凌晨」的頻率與表現：「常常」熬夜使用 3C 者，平均睡眠僅約 5.3 小時，專注力平均
                            <TrapTarget id="F2" type="fake" found={isFakeFound('F2')} showAll={showAll} onFind={handleFind}>慘跌</TrapTarget>
                            至 4 分，表現最差。「沒有」熬夜使用 3C 者，平均睡眠高達 8.8 小時，專注力平均高達 8.7 分，表現最優異。此落差表明，睡前過度使用 3C 產品不僅嚴重壓縮睡眠時間，更直接導致隔日課堂精神渙散。
                        </p>
                        {showExplanations && isFakeFound('F2') && <FakeTrapExplanation id="F2" />}
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
                    <p className="text-[12px] text-white/70 italic">
                        💡 把判斷力寫進 prompt——這就是研究者的素養。
                    </p>
                </div>
            )}

            {/* Prompt 範本三段 — 找完後出現 */}
            {isComplete && (
                <div className="max-w-[760px] mx-auto mt-8 space-y-4">
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
                            <p className="text-[11.5px] text-[#1E3A8A] mb-2 italic">學生學到：4 類資料問題（缺漏／極端／格式／無效）+ 研究員 vs AI 分工</p>
                            <pre className="bg-white border border-[#BFDBFE] rounded p-3 text-[11.5px] leading-[1.85] whitespace-pre-wrap font-mono text-[#1E3A8A] overflow-x-auto">{`【任務】
我有一份研究問卷／訪談／實驗的原始資料。
請幫我整理成可分析的乾淨表。

【規則】
1. 第一階段「找問題」：先列出資料中所有「可能要處理的點」給我看：
   · 缺漏值（空白或半空白的列）
   · 極端值（明顯偏離常態的數字，要研究員判斷是真實還是錯誤）
   · 格式不一致（如同欄位有不同寫法，需統一）
   · 無效填答（數值欄出現文字、回答跟題目無關）
2. 列出後 → 等我針對每個問題回覆「保留／刪除／標記」決定後，
   再進入第二階段
3. 不要替我做判斷、不要直接刪資料
   （資料異常不一定要刪——研究員要決定）

【格式】
階段一：表格列「問題類型 / 所在位置 / 為什麼可疑 / 建議處理選項」
階段二（待我確認後）：清理後的乾淨表 + 每個處理決定的紀錄

【原始資料】
[貼你的資料 CSV / Sheets 連結]`}</pre>
                            <button
                                onClick={() => { navigator.clipboard.writeText(document.querySelector('[data-prompt="w13"]')?.innerText || ''); setCopied('w13'); setTimeout(() => setCopied(null), 2000); }}
                                className="mt-3 bg-[#1E40AF] hover:bg-[#1E3A8A] text-white px-4 py-2 rounded text-[12px] font-bold"
                            >
                                {copied === 'w13' ? '✓ 已複製' : '📋 複製這段 Prompt'}
                            </button>
                            <span data-prompt="w13" style={{ display: 'none' }}>{`【任務】
我有一份研究問卷／訪談／實驗的原始資料。
請幫我整理成可分析的乾淨表。

【規則】
1. 第一階段「找問題」：先列出資料中所有「可能要處理的點」給我看：
   · 缺漏值（空白或半空白的列）
   · 極端值（明顯偏離常態的數字，要研究員判斷是真實還是錯誤）
   · 格式不一致（如同欄位有不同寫法，需統一）
   · 無效填答（數值欄出現文字、回答跟題目無關）
2. 列出後 → 等我針對每個問題回覆「保留／刪除／標記」決定後，
   再進入第二階段
3. 不要替我做判斷、不要直接刪資料
   （資料異常不一定要刪——研究員要決定）

【格式】
階段一：表格列「問題類型 / 所在位置 / 為什麼可疑 / 建議處理選項」
階段二（待我確認後）：清理後的乾淨表 + 每個處理決定的紀錄

【原始資料】
[貼你的資料 CSV / Sheets 連結]`}</span>
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
                            <p className="text-[11.5px] text-[#065F46] mb-2 italic">學生學到：4 種圖表的選擇邏輯 + 圖表 5 鐵規</p>
                            <pre className="bg-white border border-[#86EFAC] rounded p-3 text-[11.5px] leading-[1.85] whitespace-pre-wrap font-mono text-[#065F46] overflow-x-auto">{`【任務】
依下列分析表，幫我畫一張[你選的圖表類型]。

【規則 — 圖表 5 鐵規】
1. 圖表類型：___（你決定，不可讓 AI 擅自改）
   選圖邏輯：
   · 看「比較大小」→ 長條圖
   · 看「趨勢變化」→ 折線圖
   · 看「兩個變項關係」→ 散佈圖
   · 看「組成比例」→ 圓餅圖
2. 標題格式：「圖一：（變項1）與（變項2）的（關係/差異）（N=___）」
3. 座標軸從 0 開始，不可截斷數據
4. 圖下方標註：「資料來源:研究者繪製」
5. 不要替我寫圖說（描述+推論）——那是研究者的工作

【格式】
- 圖檔
- 確認語：「我用了___圖、N=___、座標從 0、資料來源已標」

【分析表】
[貼資料]`}</pre>
                            <button
                                onClick={() => { navigator.clipboard.writeText(document.querySelector('[data-prompt="w14"]')?.innerText || ''); setCopied('w14'); setTimeout(() => setCopied(null), 2000); }}
                                className="mt-3 bg-[#047857] hover:bg-[#065F46] text-white px-4 py-2 rounded text-[12px] font-bold"
                            >
                                {copied === 'w14' ? '✓ 已複製' : '📋 複製這段 Prompt'}
                            </button>
                            <span data-prompt="w14" style={{ display: 'none' }}>{`【任務】
依下列分析表，幫我畫一張[你選的圖表類型]。

【規則 — 圖表 5 鐵規】
1. 圖表類型：___（你決定，不可讓 AI 擅自改）
   選圖邏輯：
   · 看「比較大小」→ 長條圖
   · 看「趨勢變化」→ 折線圖
   · 看「兩個變項關係」→ 散佈圖
   · 看「組成比例」→ 圓餅圖
2. 標題格式：「圖一：（變項1）與（變項2）的（關係/差異）（N=___）」
3. 座標軸從 0 開始，不可截斷數據
4. 圖下方標註：「資料來源:研究者繪製」
5. 不要替我寫圖說（描述+推論）——那是研究者的工作

【格式】
- 圖檔
- 確認語：「我用了___圖、N=___、座標從 0、資料來源已標」

【分析表】
[貼資料]`}</span>
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
                            <p className="text-[11.5px] text-[#7F1D1D] mb-2 italic">學生學到：6 條結論紅線（樣本／因果／用詞）+ 必含限制段 + 四層分層</p>
                            <pre className="bg-white border border-[#FCA5A5] rounded p-3 text-[11.5px] leading-[1.85] whitespace-pre-wrap font-mono text-[#7F1D1D] overflow-x-auto">{`【任務】
依我的圖表跟分析資料，幫我寫一份研究結論。

【規則 — 紅線清單，不可違反】

（樣本侷限）
1. N=___（自填），禁用「高度／完全／證實／顯著」這類強斷言
2. 結論主語必須是「在本研究 N 位受訪者中」，不可推到全體
   （如不可寫「全國高中生」「所有學生」）

（因果 vs 相關）
3. 區分「相關」和「因果」——資料只能看到相關時，
   不可寫「導致／影響／造成／元兇」
4. 不可使用「最關鍵／核心／主要原因」這類因果排名詞

（用詞）
5. 中性學術語言，不下價值判斷
   （不可寫「浪費／不該／必須」這類規範性詞）
6. 不要腦補資料沒問的機制
   （如沒問補習時長，就不能說「補習壓縮睡眠」這個機制）

（必含段落）
7. 必須有「研究限制」段，至少寫 4 條：
   · N 數侷限
   · 自評偏誤（如有自評題）
   · 樣本範圍偏斜（年級/性別不均）
   · 無對照組（如有此情況）

【格式】
分四層輸出：
- 描述：純報資料看到的趨勢（含具體數字）
- 推論：克制版本，含「可能」「初步」「值得後續研究」
- 限制：4 條以上具體限制
- 回扣：跟最初研究問題對話

【圖表 + 分析】
[貼圖 + 表]`}</pre>
                            <button
                                onClick={() => { navigator.clipboard.writeText(document.querySelector('[data-prompt="w15"]')?.innerText || ''); setCopied('w15'); setTimeout(() => setCopied(null), 2000); }}
                                className="mt-3 bg-[#991B1B] hover:bg-[#7F1D1D] text-white px-4 py-2 rounded text-[12px] font-bold"
                            >
                                {copied === 'w15' ? '✓ 已複製' : '📋 複製這段 Prompt'}
                            </button>
                            <span data-prompt="w15" style={{ display: 'none' }}>{`【任務】
依我的圖表跟分析資料，幫我寫一份研究結論。

【規則 — 紅線清單，不可違反】

（樣本侷限）
1. N=___（自填），禁用「高度／完全／證實／顯著」這類強斷言
2. 結論主語必須是「在本研究 N 位受訪者中」，不可推到全體
   （如不可寫「全國高中生」「所有學生」）

（因果 vs 相關）
3. 區分「相關」和「因果」——資料只能看到相關時，
   不可寫「導致／影響／造成／元兇」
4. 不可使用「最關鍵／核心／主要原因」這類因果排名詞

（用詞）
5. 中性學術語言，不下價值判斷
   （不可寫「浪費／不該／必須」這類規範性詞）
6. 不要腦補資料沒問的機制
   （如沒問補習時長，就不能說「補習壓縮睡眠」這個機制）

（必含段落）
7. 必須有「研究限制」段，至少寫 4 條：
   · N 數侷限
   · 自評偏誤（如有自評題）
   · 樣本範圍偏斜（年級/性別不均）
   · 無對照組（如有此情況）

【格式】
分四層輸出：
- 描述：純報資料看到的趨勢（含具體數字）
- 推論：克制版本，含「可能」「初步」「值得後續研究」
- 限制：4 條以上具體限制
- 回扣：跟最初研究問題對話

【圖表 + 分析】
[貼圖 + 表]`}</span>
                        </div>
                    </details>
                </div>
            )}

            {/* 注意事項 — 規則來源 + 自學橋樑 + 老師親身踩雷 */}
            {isComplete && (
                <div className="max-w-[760px] mx-auto mt-8 p-5 rounded-[var(--radius-unified)] bg-[#FFFBEB] border-2 border-[#F59E0B]">
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
                            <li>· 未來 AI 告訴你規則 → 你裁決<span className="text-white/55">（自學期）</span></li>
                            <li>· 最後 你自己提出規則 → 你成為研究者<span className="text-white/55">（成熟期）</span></li>
                        </ul>
                    </div>
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
