import React, { useState, useCallback, useEffect } from 'react';
import CourseArc from '../components/ui/CourseArc';
import './ToolRefinementPage.css';
import ThinkRecord from '../components/ui/ThinkRecord';
import AIREDNarrative from '../components/ui/AIREDNarrative';
import StepEngine from '../components/ui/StepEngine';
import HeroBlock from '../components/ui/HeroBlock';
import ExportButton from '../components/ui/ExportButton';
import ResetWeekButton from '../components/ui/ResetWeekButton';
import LessonMap from '../components/ui/LessonMap';
import { W10Data } from '../data/lessonMaps';
import { readRecords } from '../components/ui/ThinkRecord';
import {
    CheckCircle2,
    Bot,
    Users,
    Copy,
    Check,
    Zap,
    Map,
} from 'lucide-react';

/* ══════════════════════════════════════
 *  資料常數
 * ══════════════════════════════════════ */

const METHOD_OPTIONS = [
    { id: 'questionnaire', label: '📋 問卷組' },
    { id: 'interview', label: '🎤 訪談組' },
    { id: 'experiment', label: '🧪 實驗組' },
    { id: 'observation', label: '👀 觀察組' },
    { id: 'literature', label: '📚 文獻組' },
];

/* — W9 組裝模板（與 W9 ASSEMBLY_TASKS 同步） — */
const TEMPLATES = {
    questionnaire: { url: 'https://docs.google.com/document/d/1J72qYFrcvG_0jvYc27j4xS2pBGa3cMQy_tuhf2bPZ4U/copy',    name: '01_問卷模板' },
    interview:     { url: 'https://docs.google.com/document/d/1PB7S91j73YIIUnBQapBAeCPKK2e7yOFwod83ZTYuMs0/copy',    name: '02_訪綱模板' },
    experiment:    { url: 'https://docs.google.com/document/d/1HQ6KutZIUXrfLEuBCs88le116HVgefvfSMdEfL_s0II/copy',    name: '03_實驗計畫書模板' },
    observation:   { url: 'https://docs.google.com/spreadsheets/d/1VwhCcHdpHPCX_YzVKIU98QrDQuXVup8h_ERcnm9R-D4/copy', name: '04_觀察紀錄表模板' },
    literature:    { url: 'https://docs.google.com/spreadsheets/d/11mr5up4hsirhP3LH1qOxzxFAV0w189BIF585mcF8G6Q/copy', name: '05_文獻比較矩陣模板' },
};

/* — 各方法 AI 檢核 Prompt — */
const AI_PROMPTS = {
    questionnaire: `我設計了一份問卷，請幫我檢查：
1. 有沒有問題不清楚？
2. 選項是否完整、互斥？
3. 有沒有雙重否定或雙重問題？
4. 倫理考量是否足夠（知情同意、隱私保護）？
5. 給我具體修改建議。

【貼上你的問卷】`,
    interview: `我設計了訪談大綱，請幫我檢查：
1. 問題是否開放式？
2. 追問設計是否合理？
3. 順序是否流暢（從簡單到深層）？
4. 倫理考量是否足夠？
5. 給我具體修改建議。

【貼上你的訪談大綱】`,
    experiment: `我設計了一個實驗，請幫我檢查：
1. 自變項與依變項的操作型定義清楚嗎？
2. 控制變項有遺漏嗎？
3. 實驗流程有邏輯漏洞嗎？
4. 倫理考量是否足夠？
5. 給我具體修改建議。

【貼上你的實驗設計】`,
    observation: `我設計了觀察紀錄表，請幫我檢查：
1. 觀察行為的定義夠具體嗎？（是外顯行為而非推測？）
2. 記錄方式來得及嗎？
3. 觀察時段和地點設定合理嗎？
4. 倫理考量是否足夠？
5. 給我具體修改建議。

【貼上你的觀察紀錄表設計】`,
    literature: `我設計了文獻分析架構，請幫我檢查：
1. 搜尋策略（關鍵字、篩選標準）夠精準嗎？
2. 比較矩陣的欄位能回答研究問題嗎？
3. 納入／排除標準合理嗎？
4. 來源品質分級方式合適嗎？
5. 給我具體修改建議。

【貼上你的文獻分析架構】`,
};

const GENERIC_PROMPT = `我設計了一份研究工具，請幫我檢查：
1. 有沒有不清楚的地方？
2. 設計有什麼邏輯漏洞？
3. 倫理考量足夠嗎？
4. 給我具體修改建議。

【貼上你的工具內容】`;

/* — AI 的限制 — */
const AI_LIMITS = [
    { icon: '👁️', title: 'AI 看的是「文字」', desc: '看不到實際填答或訪談時的感受' },
    { icon: '🏫', title: 'AI 不知道「文化脈絡」', desc: '高中生的用語習慣、本校的特殊情況' },
    { icon: '⏱️', title: 'AI 不知道「實際可行性」', desc: '問卷會不會太長、訪談會不會太久，填填看才知道' },
];

/* — 各方法配對指示 — */
const PAIRING_INSTRUCTIONS = {
    questionnaire: '找另一組同學互填問卷。填完後記錄：哪題不清楚？哪個選項不知道怎麼選？花了多久填完？',
    interview: '兩人一組互相模擬訪談。一人當訪談者、一人當受訪者，訪完後交換。注意：哪個問題讓你卡住？哪個追問太尬？',
    experiment: '找同學實際跑一遍實驗流程。記錄：指令清楚嗎？需要多久？有沒有突發狀況？',
    observation: '去實際場域試觀察 10 分鐘。記錄：來得及嗎？分類明確嗎？有沒有行為你歸不了類？',
    literature: '請同學看你的比較矩陣。問他：看得懂嗎？欄位有沒有多餘或遺漏？能回答你的研究問題嗎？',
};

/* — ExportButton 欄位 — */
const EXPORT_FIELDS = [
    /* Step 1：入場 + 工具設計 */
    { key: 'w10-entry-self-report', label: '入場自報（W9 docx 完成度）', question: '第二~五章章節完成狀況' },
    { key: 'w10-w9-feedback-quick', label: 'W9 老師回饋快速摘要', question: '老師對 W9 計畫書第一~五章的主要建議' },
    { key: 'w10-tool-design-notes', label: '工具設計關鍵決策', question: '第六章工具設計中的 2-3 個關鍵決定' },
    { key: 'w10-tool-text', label: '工具文字版', question: '設計完成的工具本體（若已整合在 docx 第六章則留空）' },
    /* Step 2：整本 AI 檢核（含 AIRED 五要素：A/I 前置 + R/E/D 分欄） */
    { key: 'w10-ai-raw-feedback', label: 'AI 回覆原文（含 A+I 前置）', question: 'A: 用什麼 AI | I: 問了什麼 | R: AI 完整回覆' },
    { key: 'w10-ai-judge', label: 'AI 建議採納判斷（E: Evaluation）', question: '採納／不採納／部分採納的決定與理由' },
    { key: 'w10-tool-revision', label: '整本修正紀錄（D: Decision）', question: '根據 AI 建議修改了哪些章節？' },
];

/* ══════════════════════════════════════
 *  內部元件：可複製 Prompt 框
 * ══════════════════════════════════════ */

const CopyablePrompt = ({ text }) => {
    const [copied, setCopied] = useState(false);
    const handleCopy = useCallback(() => {
        navigator.clipboard.writeText(text).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }).catch(() => {
            /* fallback: select + copy */
            const ta = document.createElement('textarea');
            ta.value = text;
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    }, [text]);

    return (
        <div className="w10-prompt-box">
            <div className="w10-prompt-header">
                <span className="w10-prompt-label">
                    <Bot size={14} /> AI 檢核 Prompt — 複製後貼到 AI 對話窗
                </span>
                <button onClick={handleCopy} className="w10-copy-btn">
                    {copied ? <><Check size={12} /> 已複製</> : <><Copy size={12} /> 複製</>}
                </button>
            </div>
            <pre className="w10-prompt-text">{text}</pre>
        </div>
    );
};

/* ══════════════════════════════════════
 *  內部元件：W10 入口自檢（W9 計畫書 1-5 章完成度）
 * ══════════════════════════════════════ */

const PREP_OPTIONS = [
    { id: 'complete', icon: '✅', label: '第二~五章完成',    desc: 'docx 五章都寫完' },
    { id: 'partial',  icon: '🔶', label: '部分完成',          desc: '第三、四章還在補' },
    { id: 'none',     icon: '⚠️', label: '只寫到第一章',      desc: 'W9 課後沒補第二~五章' },
];

const PrepStatusCheck = ({ methodId }) => {
    const [status, setStatus] = useState(() => {
        try { return localStorage.getItem('w10-prep-status') || null; } catch { return null; }
    });
    const template = TEMPLATES[methodId];

    /* 第零層檢測：有沒有做過 W9？計畫書 checklist / 方法選擇 / AIRED 全空 = 沒來上課 */
    const w9SkippedEntirely = (() => {
        try {
            const saved = readRecords();
            const hasChecklist = saved['w9-plan-ch1-checklist']?.trim();
            const hasMethod = saved['w9-my-method']?.trim();
            const hasAired = saved['w9-aired-record']?.trim();
            return !hasChecklist && !hasMethod && !hasAired;
        } catch { return false; }
    })();

    const select = (s) => {
        setStatus(s);
        try { localStorage.setItem('w10-prep-status', s); } catch {}
    };
    const reset = () => {
        setStatus(null);
        try { localStorage.removeItem('w10-prep-status'); } catch {}
    };

    /* 零層閘門：連 W9 都沒做 → 擋下 */
    if (w9SkippedEntirely) {
        return (
            <div className="bg-[var(--danger-light)] border-2 border-[var(--danger)] rounded-[var(--radius-unified)] overflow-hidden">
                <div className="px-5 py-3 bg-[var(--danger)] text-white flex items-center gap-2">
                    <span className="text-[14px]">🚫</span>
                    <span className="font-bold text-[13px]">偵測到你沒做 W9</span>
                </div>
                <div className="p-5 space-y-3 text-[13px] text-[var(--ink)]">
                    <p className="leading-relaxed">
                        W10 的工具設計需要建立在 <strong>W9 計畫書第一~五章的地基</strong>上。網頁讀不到你的 W9 checklist、方法選擇、AIRED——代表 W9 沒做。
                    </p>
                    <p className="leading-relaxed">
                        硬要在 W10 補做 W9 的量 = 同時跑兩週份的思考，效率最差。請先回 W9 把 Step 3 五章地基工程做完再回來。
                    </p>
                    <div className="flex flex-col md:flex-row gap-2 pt-1">
                        <a
                            href="/w9"
                            className="flex items-center justify-center gap-2 bg-[var(--ink)] hover:bg-black text-white rounded-[8px] px-4 py-3 no-underline transition-colors text-[13px] font-bold"
                        >
                            回 W9 工具設計基礎 →
                        </a>
                    </div>
                    <p className="text-[11px] text-[var(--ink-mid)] bg-white border border-[var(--border)] rounded-[4px] p-2 leading-relaxed">
                        💡 <strong className="text-[var(--ink)]">如果你有做 W9 但資料不見了</strong>（換裝置、清過瀏覽器快取），請回 W9 重填最基本的 Step 3 變項 / 題目（10-15 分鐘），W10 才能繼續。
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white border border-[var(--border)] rounded-[var(--radius-unified)] overflow-hidden">
            <div className="px-5 py-3 bg-[var(--ink)] text-white flex items-center justify-between gap-2">
                <span className="font-bold text-[13px]">🚦 開場自檢：W9 計畫書第 1-5 章完成度</span>
                {status && (
                    <button
                        onClick={reset}
                        className="text-[11px] opacity-70 hover:opacity-100 transition-opacity"
                        style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}
                    >
                        重新作答
                    </button>
                )}
            </div>
            <div className="p-5 space-y-4">
                {!status && (
                    <p className="text-[13px] text-[var(--ink-mid)] leading-relaxed">
                        進入工具設計前先誠實回報——你的 W9 計畫書第 1-5 章是否都寫完了？選擇會決定這節課開頭 15 分鐘要不要先補。
                    </p>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {PREP_OPTIONS.map((opt) => {
                        const isMe = status === opt.id;
                        const palette =
                            opt.id === 'complete' ? 'border-[var(--success)] bg-[var(--success-light)]' :
                            opt.id === 'partial'  ? 'border-[var(--accent)]  bg-[var(--accent-light)]'  :
                                                    'border-[var(--danger)]  bg-[var(--danger-light)]';
                        let cls = 'border-[var(--border)] bg-white hover:border-[var(--accent)] cursor-pointer';
                        if (isMe) cls = palette;
                        else if (status) cls = 'border-[var(--border)] bg-[var(--paper)] opacity-50 cursor-default';
                        return (
                            <button
                                key={opt.id}
                                onClick={() => select(opt.id)}
                                disabled={!!status}
                                className={`text-left p-4 rounded-[8px] border transition-all ${cls}`}
                            >
                                <span className="text-[20px]">{opt.icon}</span>
                                <strong className="block text-[13px] text-[var(--ink)] mt-1">{opt.label}</strong>
                                <span className="text-[11px] text-[var(--ink-mid)] block mt-0.5">{opt.desc}</span>
                            </button>
                        );
                    })}
                </div>

                {status === 'complete' && (
                    <div className="bg-[var(--success-light)] border-l-[3px] border-[var(--success)] p-4 rounded-[4px] text-[13px] text-[var(--ink)]">
                        <strong>✅ 太好了。</strong> 直接往下進入 Step 1 工具設計（計畫書第六章）——前段地基穩，今天可以專心把工具寫完。
                    </div>
                )}

                {status === 'partial' && (
                    <div className="bg-[var(--accent-light)] border-l-[3px] border-[var(--accent)] p-4 rounded-[4px] text-[13px] text-[var(--ink-mid)] space-y-3">
                        <strong className="text-[var(--ink)] block">🔶 本節前 10 分鐘先補齊第三、四章</strong>
                        <p className="leading-relaxed">
                            第一、二、五章都到位的話，這節開工前先花 10 分鐘把第三章（文獻回顧補到 2-3 篇 + 差異）和第四章（變項／主題／維度定版）補完，再往下進工具設計。
                        </p>
                        <p className="text-[12px]">
                            為什麼不拖？<strong className="text-[var(--ink)]">第六章工具要長在第四章變項上</strong>——變項沒定完就設計工具 = 工具也長歪。
                        </p>
                    </div>
                )}

                {status === 'none' && (
                    <div className="bg-[var(--danger-light)] border-l-[3px] border-[var(--danger)] p-4 rounded-[4px] text-[13px] text-[var(--ink)] space-y-3">
                        <strong className="block text-[var(--danger)] text-[14px]">⚠️ 地基沒建好就蓋樓——今天會卡死</strong>
                        <p className="text-[12px] leading-relaxed">
                            第六章工具是計畫書的一個章節，它必須長在前五章的地基上（特別是第四章變項／主題）。只有第一章沒辦法支撐工具設計。
                        </p>

                        <div className="bg-white border border-[var(--border)] rounded-[6px] p-3 space-y-2 text-[12px] leading-relaxed">
                            <p><strong>可行選項：</strong></p>
                            <p>① <strong>回 W9</strong> 把第二、三、四、五章快速補齊（就算只有骨架也行）→ 今天再回來做工具。</p>
                            <p>② 如果時程真的來不及，<strong>找老師面談</strong>——地基沒打好就施工，是整份研究的風險。</p>
                        </div>

                        <div className="flex flex-col md:flex-row gap-2">
                            <a
                                href="/w9"
                                className="flex items-center justify-center gap-2 bg-[var(--ink)] hover:bg-black text-white rounded-[8px] px-4 py-3 no-underline transition-colors text-[13px] font-bold"
                            >
                                回 W9 補齊第 2-5 章 →
                            </a>
                        </div>

                        <p className="text-[11px] bg-white border border-[var(--border)] rounded-[4px] p-2 text-[var(--ink-mid)]">
                            💡 <strong className="text-[var(--ink)]">誠實面對：</strong>硬做工具會讓 W11 Pilot Test 與倫理審查連帶出錯——錯在上游，下游會放大。
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

/* ══════════════════════════════════════
 *  主元件
 * ══════════════════════════════════════ */

export const ToolRefinementPage = () => {
    const [w9Method, setW9Method] = useState('');
    const [w9Topic, setW9Topic] = useState('');
    const [detectedMethodId, setDetectedMethodId] = useState('');
    const [showLessonMap, setShowLessonMap] = useState(false);

    /* W9 資料帶入 */
    useEffect(() => {
        const saved = readRecords();
        const method = saved['w9-my-method']?.trim() || saved['w8-tool-method']?.trim() || '';
        const topic = saved['w8-merged-topic']?.trim() || saved['w8-research-question']?.trim() || '';
        if (method) setW9Method(method);
        if (topic) setW9Topic(topic);

        const ml = method.toLowerCase();
        if (ml.includes('問卷')) setDetectedMethodId('questionnaire');
        else if (ml.includes('訪談')) setDetectedMethodId('interview');
        else if (ml.includes('實驗')) setDetectedMethodId('experiment');
        else if (ml.includes('觀察')) setDetectedMethodId('observation');
        else if (ml.includes('文獻')) setDetectedMethodId('literature');
    }, []);

    const currentPrompt = AI_PROMPTS[detectedMethodId] || '';
    const currentPairing = PAIRING_INSTRUCTIONS[detectedMethodId] || '找同學互相測試你的研究工具。';

    /* ── 五步驟 ──────────────────────────────────────── */

    const steps = [
        /* ─── Step 1：工具設計（第六章）— 第一節 50 min ─── */
        {
            title: '工具設計（第六章）',
            icon: '🔧',
            content: (
                <div className="space-y-8 prose-zh">
                    {/* 入場擋板：W9 完成狀態自檢 */}
                    <PrepStatusCheck methodId={detectedMethodId} />

                    {/* W9 老師回饋快速讀取（5 分鐘暖身） */}
                    <div className="bg-white border-2 border-[var(--accent)] rounded-[var(--radius-unified)] p-5 max-w-[720px]">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-[18px]">📬</span>
                            <span className="font-bold text-[14px] text-[var(--ink)]">開始前：先看老師對 W9 計畫書第一~五章的回饋（5 分鐘）</span>
                        </div>
                        <p className="text-[13px] text-[var(--ink-mid)] leading-relaxed mb-3">
                            老師已在 <strong>Google Classroom</strong> 發回 W9 計畫書的批改。請先打開看過，把老師<strong className="text-[var(--ink)]">最主要</strong>的一兩句建議記下來——這些建議會影響你今天第六章工具設計的方向。
                        </p>
                        <ThinkRecord
                            dataKey="w10-w9-feedback-quick"
                            prompt="老師對我 W9 計畫書最主要的建議是？"
                            placeholder="例：第四章變項太多要砍、第五章抽樣方式要改、第三章文獻對應不夠清楚⋯⋯"
                            rows={3}
                        />
                        <p className="text-[11px] text-[var(--ink-light)] leading-relaxed mt-2">
                            💡 還沒拿到回饋？可能老師還在批。先往下做工具設計，之後有回饋再回頭修正。
                        </p>
                    </div>

                    {/* Step 1 開場 */}
                    <div>
                        <p className="text-[14px] text-[var(--ink-mid)] leading-relaxed max-w-[720px]">
                            W9 你已完成計畫書第一~五章地基。本節 50 分鐘專心做一件事：<strong className="text-[var(--ink)]">把第六章（工具本體）寫完</strong>。依你的方法，具體產出下方表格指定的內容。
                        </p>
                        <div className="w7-notice w7-notice-gold">
                            🎯 <strong>本節目標：計畫書第六章工具設計完成。</strong>內容寫在 <strong>docx</strong> 上，網頁只記關鍵決策。
                        </div>
                    </div>

                    {/* 方法分流提示 */}
                    {detectedMethodId ? (
                        (() => {
                            const toolByMethod = {
                                questionnaire: { label: '📋 問卷組', out: '每個變項 3–5 題問卷題目（第四章變項 × 第六章題目）' },
                                interview: { label: '🎤 訪談組', out: '每個主題 1 主問題 + 2–3 追問（第四章主題 × 第六章大綱）' },
                                experiment: { label: '🧪 實驗組', out: '實驗流程 Step 1–5 + 數據記錄表（第四章變項 × 第六章流程）' },
                                observation: { label: '👀 觀察組', out: '觀察紀錄表欄位 + 時段採樣方式（第四章維度 × 第六章紀錄表）' },
                                literature: { label: '📚 文獻組', out: '比較矩陣欄位（至少 7 欄）+ 分析流程 Step 1–5' },
                            }[detectedMethodId];
                            return (
                                <div className="bg-white border-2 border-[var(--accent)] rounded-[var(--radius-unified)] p-5">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-[10px] font-mono font-bold bg-[var(--accent)] text-white px-2 py-0.5 rounded-[3px]">你的方法</span>
                                        <span className="font-bold text-[14px] text-[var(--ink)]">{toolByMethod.label}</span>
                                    </div>
                                    <p className="text-[13px] text-[var(--ink-mid)] leading-relaxed">
                                        <strong className="text-[var(--ink)]">本節要產出：</strong>{toolByMethod.out}
                                    </p>
                                </div>
                            );
                        })()
                    ) : (
                        <div className="bg-[var(--paper-warm)] border border-dashed border-[var(--border)] rounded-[var(--radius-unified)] p-4 text-[12.5px] text-[var(--ink-light)]">
                            👆 未偵測到你的研究方法。請回 W9 完成方法選擇。
                        </div>
                    )}

                    {/* 工具設計關鍵決策 */}
                    <ThinkRecord
                        dataKey="w10-tool-design-notes"
                        prompt="工具設計的 2-3 個關鍵決策（docx 寫完後在此摘要）"
                        placeholder={'例：\n決策 1：問卷改用五點量表不用七點——因為高中生樣本對「中等程度」的辨識度有限，五點較準\n決策 2：訪談大綱從 12 題砍到 6 題——避免每位受訪者超過 30 分鐘\n決策 3：（無）'}
                        scaffold={['決策 1：做了什麼 / 為什麼', '決策 2：…', '決策 3：…']}
                        rows={6}
                    />

                    {/* 下節預告 */}
                    <div className="w7-notice w7-notice-teal">
                        ✅ 第六章完成 → 第二節做 <strong>整本 AI 檢核 + 定稿繳交</strong>。中場休息時可以先準備整本 docx（13 章都到齊才能給 AI 整體檢核）。
                    </div>
                </div>
            ),
        },

        /* ─── Step 2：整本計畫書 AI 檢核 — 第二節前半 25 min ─── */
        {
            title: '整本計畫書 AI 檢核',
            icon: '🤖',
            content: (
                <div className="space-y-8 prose-zh">
                    <p className="text-[14px] text-[var(--ink-mid)] leading-relaxed max-w-[720px]">
                        工具設計完了，整本計畫書 13 章都到位。這次 AI 檢核是<strong className="text-[var(--ink)]">最後一次綜合檢查</strong>——比對「方向（第 1-3 章）→ 方法（第 4-5 章）→ 工具（第 6 章）→ 執行（第 7-13 章）」是否邏輯一致。
                    </p>

                    {/* AI 檢核 Prompt */}
                    <div>
                        <div className="text-[11px] font-mono text-[var(--ink-light)] uppercase tracking-wider mb-2">第一步：複製 Prompt 貼到 AI</div>
                        <CopyablePrompt text={currentPrompt || GENERIC_PROMPT} />
                        <p className="text-[11px] text-[var(--ink-light)] leading-relaxed mt-2">
                            💡 把計畫書<strong>全本 13 章（含工具）</strong>貼進 AI 對話框底部的「【貼上你的 XXX】」位置。
                        </p>
                    </div>

                    {/* AI 回覆原文 + AIRED 的 A/I 前置 */}
                    <ThinkRecord
                        dataKey="w10-ai-raw-feedback"
                        prompt="AI 回覆原文（開頭先寫 A+I 兩行；貼全文沒關係；有追問也一起貼）"
                        placeholder={'例：\nA: 我用了 ChatGPT o1（深度推理版本）\nI: 我貼了全本計畫書 13 章，請 AI 檢核整體邏輯一致性\n\n──── AI 完整回覆（以下貼上）────\n（貼上 AI 給的完整回覆）'}
                        scaffold={['A: 我用了什麼 AI（要寫深度推理版本）', 'I: 我貼了什麼 + 問了什麼', '下方貼 AI 完整回覆']}
                        rows={14}
                    />

                    {/* 採納判斷 */}
                    <ThinkRecord
                        dataKey="w10-ai-judge"
                        prompt="AI 建議採納判斷（逐條評估）"
                        placeholder={'例：\n建議 1：AI 說「第三章應該補上信效度說明」\n→ ✅ 採納\n→ 理由：本來就漏寫了\n\n建議 2：AI 說「樣本應該擴大到三個年級」\n→ ❌ 不採納\n→ 理由：學期時程不夠，會犧牲深度\n\n建議 3：AI 說「應該加上前測」\n→ 🔶 部分採納\n→ 理由：先做小規模 Pilot，不做正式前測'}
                        scaffold={['建議 N：AI 說什麼', '我的判斷：✅ 採納 / ❌ 不採納 / 🔶 部分採納', '理由（必寫）']}
                        rows={10}
                    />

                    {/* 整本修正紀錄 */}
                    <ThinkRecord
                        dataKey="w10-tool-revision"
                        prompt="根據 AI 建議，整本計畫書要改哪些章節？"
                        placeholder={'例：\n第 3 章要改：補上信效度說明（改成「採用 Cronbach α 確認量表內部一致性」）\n第 6 章要改：訪談大綱從 12 題砍到 6 題\n第 7 章要改：（無）'}
                        scaffold={['第 ___ 章要改：要改什麼（改成什麼）', '另一章要改：…']}
                        rows={6}
                    />

                    <div className="w7-notice w7-notice-teal">
                        ✅ 修正紀錄寫完 → 下一個 Step 寫 W10 AIRED + 定稿繳交。
                    </div>
                </div>
            ),
        },

        /* ─── Step 3：W10 AIRED + 定稿繳交 — 第二節後半 25 min ─── */
        {
            title: 'W10 AIRED + 定稿繳交',
            icon: '📤',
            content: (
                <div className="space-y-8 prose-zh">
                    <p className="text-[14px] text-[var(--ink-mid)] leading-relaxed max-w-[720px]">
                        最後 25 分鐘：完整記錄 W10 AIRED（本週最重要的 AI 互動），上傳定稿，預告 W11 Pilot Test 與倫理審查。
                    </p>

                    {/* W10 定稿驗收 checklist */}
                    <div className="bg-white border border-[var(--border)] rounded-[var(--radius-unified)] overflow-hidden">
                        <div className="p-4 px-5 bg-[var(--paper-warm)] border-b border-[var(--border)] font-bold text-[13px]">
                            ✅ W10 定稿前驗收
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-[1px] bg-[var(--border)]">
                            {[
                                '第六章工具設計已完成（docx）',
                                '整本計畫書 13 章都有內容（docx）',
                                'AI 檢核回覆已讀完、判斷已做',
                                '整本修正紀錄已寫',
                                'W10 AIRED 敘事完整填寫',
                                '計畫書 docx 已上傳 Google Classroom',
                            ].map((item, i) => (
                                <div key={i} className="p-4 px-6 bg-white flex items-start gap-3">
                                    <CheckCircle2 size={16} className="text-[var(--success)] mt-0.5 flex-shrink-0" />
                                    <span className="text-[13px] text-[var(--ink-mid)]">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* W10 的 A/I/R/E/D 已分散在 Step 1（w10-w9-feedback-quick = Action/Intent 前置）與 Step 2（w10-ai-raw-feedback/judge/revision = R/E/D）四個欄位，不再重複寫完整敘事 */}

                    {/* ExportButton */}
                    <ExportButton
                        weekLabel="W10 工具設計 + 整本 AI 檢核"
                        fields={EXPORT_FIELDS}
                    />

                    {/* W11 預告（Pilot + 倫理） */}
                    <div className="bg-[var(--ink)] border-l-4 border-[var(--danger)] p-5 md:p-6 rounded-r-lg text-white shadow-xl">
                        <div className="flex items-center gap-2 mb-3">
                            <Users size={20} className="text-[var(--danger)]" />
                            <span className="font-mono text-[11px] font-bold tracking-[0.2em] text-[var(--danger)] uppercase">W11 預告 · Pilot Test + 倫理審查</span>
                        </div>
                        <div className="font-bold text-[17px] md:text-[18px] mb-3 leading-tight">
                            下週帶定稿工具來做真人預試
                        </div>
                        <p className="text-[13px] text-white/85 leading-[1.9] mb-3">
                            AI 檢核已經是第一輪把關——但 AI 看不到「填答者的臉」。W11 要做<strong className="text-white">真人預試</strong>：找 2-3 人實際填／答／測你的工具，看出 AI 沒抓到的問題。
                        </p>
                        <ul className="text-[12.5px] text-white/85 leading-[1.95] space-y-1 mb-4 pl-4">
                            <li>・<strong className="text-white">倫理審查</strong>：知情同意書、隱私保護、退出機制最後確認</li>
                            <li>・<strong className="text-white">預試對象聯絡</strong>：W10 課後先約好 2-3 位預試者</li>
                            <li>・<strong className="text-white">工具形式準備</strong>：問卷轉 Google Form、訪綱印紙本、觀察表印紙本</li>
                        </ul>
                        <p className="text-[12.5px] text-white/70 leading-[1.9] font-mono">
                            課後任務：約預試對象 + 準備工具實體形式（印出或線上版）
                        </p>
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
                    <span className="hidden md:inline">研究方法與專題 / 資料蒐集 / </span><span className="text-[var(--ink)] font-bold">AI 工具精進 W10</span>
                </div>
                <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
                    <span className="bg-[var(--paper-warm)] text-[var(--ink)] text-[10px] font-bold px-2 py-0.5 rounded-[2px] font-mono">100 MINS</span>
                    <ResetWeekButton weekPrefix="w10-" />
                    <button
                        onClick={() => setShowLessonMap(!showLessonMap)}
                        className="text-[11px] text-[var(--ink-light)] hover:text-[var(--accent)] transition-colors flex items-center gap-1 font-mono"
                        type="button"
                    >
                        <Map size={12} /> <span className="hidden md:inline">{showLessonMap ? 'Hide Plan' : 'Instructor View'}</span>
                    </button>
                    <span className="hidden md:inline-block bg-[var(--ink)] text-white text-[10px] font-bold px-2 py-0.5 rounded-[2px] font-mono">AI-RED · E</span>
                </div>
            </div>

            {showLessonMap && (
                <div className="animate-in slide-in-from-top-4 duration-300 mb-8">
                    <LessonMap data={W10Data} />
                </div>
            )}

            {/* PAGE HEADER — Hero Block */}
            <HeroBlock
                kicker="R.I.B. 調查檔案 · 研究方法與專題 · W10"
                title="方法深化 II："
                accentTitle="AI 協助工具精進與預試"
                subtitle="用 AI 做第一輪品管，再用真人預試做第二輪驗證。AI 能快速找出明顯問題，但看不到真實體驗——兩輪把關，工具才定稿。"
                meta={[
                    { label: '第一節', value: 'AI 檢核 + 判斷建議 + 第一輪修正' },
                    { label: '第二節', value: '人工預試 + AI vs 人工比對' },
                    { label: '課堂產出', value: 'AI 建議判斷表 + 預試紀錄 + 工具修正版' },
                    { label: '前置要求', value: 'W9 計畫書第 1-5 章（含第四章變項／主題）' },
                ]}
            />
            <CourseArc items={[
                    { wk: 'W1-W4', name: '探索\n定題', status: 'past' },
                    { wk: 'W5-W6', name: '文獻搜尋\n引用寫作', status: 'past' },
                    { wk: 'W7-W8', name: '方法選擇\n組隊企劃', status: 'past' },
                    { wk: 'W9', name: '工具設計\n處方診斷', status: 'past' },
                    { wk: 'W10', name: 'AI精進\n人工預試', status: 'now' },
                    { wk: 'W11', name: '倫理審查\n施測準備', status: '' },
                    { wk: 'W12-W15', name: '執行研究\n數據分析', status: '' },
                ]} />

            {/* STEP ENGINE */}
            <StepEngine
                steps={steps}
                prevWeek={{ label: '回 W9 工具設計', to: '/w9' }}
                nextWeek={{ label: '前往 W11 倫理審查', to: '/w11' }}
            flat
            />
        </div>
    );
};
