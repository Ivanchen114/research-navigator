import React, { useState, useCallback, useEffect } from 'react';
import CourseArc from '../components/ui/CourseArc';
import StepBriefing from '../components/ui/StepBriefing';
import './ToolRefinementPage.css';
// import ThinkRecord from '../components/ui/ThinkRecord'; // W10 全改提示卡，元件不再使用
import PromptBlock from '../components/ui/PromptBlock';
import AIREDNarrative from '../components/ui/AIREDNarrative';
import AICollaborationPrinciples from '../components/ui/AICollaborationPrinciples';
import AIDialogSubmission from '../components/ui/AIDialogSubmission';
import AIModePicker from '../components/ui/AIModePicker';
import StepEngine from '../components/ui/StepEngine';
import HeroBlock from '../components/ui/HeroBlock';
import TaskCard from '../components/ui/TaskCard';
import ResetWeekButton from '../components/ui/ResetWeekButton';
import LessonMap from '../components/ui/LessonMap';
import GroupSizeSelector from '../components/ui/GroupSizeSelector';
import ContentTypeChip from '../components/ui/ContentTypeChip';
import { W10Data } from '../data/lessonMaps';
import { readRecords, STORAGE_KEY } from '../components/ui/ThinkRecord';
import {
    Users,
    Map,
} from 'lucide-react';
import { TOOL_DESC_KIT } from '../data/methodToolbook';

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
    questionnaire: { url: 'https://docs.google.com/document/d/1tu-WF_JitJIwBZBHrrgm3MeFMDykpm_gGZoyrB4UkOI/copy',    name: '01_問卷_工具' },
    interview:     { url: 'https://docs.google.com/document/d/1BU6XyNxdwng6I15pwYXfRs-zwKgDDyF_EVc2T6uUCrs/copy',    name: '02_訪綱_工具' },
    experiment:    { url: 'https://docs.google.com/document/d/1evcQ6-97mhkhsLz4RHDEGp9P_LkjAeIKUcvusBtc0d8/copy',    name: '03_實驗_工具設計表' },
    observation:   { url: 'https://docs.google.com/spreadsheets/d/1QMqW2AAlc1s_gNfiY3jkFCy0CHpYz2GX9ZmgpShUm7s/copy', name: '04_觀察紀錄表_工具' },
    /* 文獻組依 litSubtype 動態選 URL，見 LIT_SUBTYPE_TEMPLATES 與 W10 選擇器的下載按鈕 */
    literature:    { url: 'https://drive.google.com/drive/folders/1-UtVZM8dyo20s2vbnx3UCWm-lR8YROU6',                name: '05_文獻分析_工具（資料夾，依子類型挑）' },
};

/* ══════════════════════════════════════
 *  內部元件：W10 入口自檢（W9 計畫書 1-5 章完成度）
 * ══════════════════════════════════════ */

const PREP_OPTIONS = [
    { id: 'complete', icon: '✅', label: '第 1-5 章全部完成',  desc: '動機 / 文獻 / 變項 / 假設 / 方法（W9 應達進度）' },
    { id: 'partial',  icon: '🔶', label: '部分完成',          desc: '第三章文獻 / 第四章變項還在補' },
    { id: 'none',     icon: '⚠️', label: '進度嚴重落後',      desc: 'W9 課後沒補第三、四章（甚至第一章還沒寫完）' },
];

const PrepStatusCheck = ({ methodId }) => {
    const [status, setStatus] = useState(() => {
        try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')['w10-prep-status'] || null; } catch { return null; }
    });
    const template = TEMPLATES[methodId];

    /* 第零層檢測：W9 有沒有做過？以 W9 寫入的研究方法登記（w9-my-method）為準。
     * 註：舊版還查 w9-plan-ch1-checklist / w9-aired-record，但 W9 早已不寫這兩個 key，移除避免死判斷。 */
    const w9SkippedEntirely = (() => {
        try {
            return !readRecords()['w9-my-method']?.trim();
        } catch { return false; }
    })();

    const [noneAcknowledged, setNoneAcknowledged] = useState(false);

    const select = (s) => {
        setStatus(s);
        try {
            const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
            all['w10-prep-status'] = s;
            localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
        } catch {}
    };
    const reset = () => {
        setStatus(null);
        try {
            const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
            delete all['w10-prep-status'];
            localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
        } catch {}
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
                        W10 的工具設計需要建立在 <strong>W9 計畫書第一~五章的地基</strong>上。網頁讀不到你 W9 登記的研究方法——代表 W9 沒做。
                    </p>
                    <p className="leading-relaxed">
                        硬要在 W10 補做 W9 的量 = 同時跑兩週份的思考，效率最差。請先回 W9 把計畫書 1-5 章地基做完再回來。
                    </p>
                    <div className="flex flex-col md:flex-row gap-2 pt-1">
                        <a
                            href="/w9"
                            className="flex items-center justify-center gap-2 bg-[var(--ink)] hover:bg-black text-white rounded-[8px] px-4 py-3 no-underline transition-colors text-[13px] font-bold"
                        >
                            回 W9 計畫書 1-5 章地基 →
                        </a>
                    </div>
                    <p className="text-[11px] text-[var(--ink-mid)] bg-white border border-[var(--border)] rounded-[4px] p-2 leading-relaxed">
                        💡 <strong className="text-[var(--ink)]">如果你有做 W9 但資料不見了</strong>（換裝置、清過瀏覽器快取），請回 W9 重新登記研究方法（組內合議方法的按鈕），W10 才能繼續。
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
                            <p><strong>本節怎麼辦：</strong></p>
                            <p>① <strong>立刻回 W9 補齊第 2-5 章</strong>（變項／文獻／對象都先列骨架就好，不追求完美）</p>
                            <p>② <strong className="text-[var(--danger)]">補完<u>馬上把計畫書上傳 Classroom 並 @ 老師</u></strong> — 老師會即時看到並回覆，可能下節 W11 前就能給你回饋。</p>
                            <p>③ 補完後再回來做 Step 2 方法工具書 + Step 3 工具設計。</p>
                        </div>

                        <div className="flex flex-col md:flex-row gap-2">
                            <a
                                href="/w9"
                                className="flex items-center justify-center gap-2 bg-[var(--ink)] hover:bg-black text-white rounded-[8px] px-4 py-3 no-underline transition-colors text-[13px] font-bold"
                            >
                                立刻回 W9 補齊第 2-5 章 →
                            </a>
                        </div>

                        <p className="text-[11px] bg-white border border-[var(--border)] rounded-[4px] p-2 text-[var(--ink-mid)]">
                            💡 <strong className="text-[var(--ink)]">誠實面對：</strong>硬做工具會讓 W11 Pilot Test 與倫理審查連帶出錯——錯在上游，下游會放大。補完通知老師是最快回到正軌的方式。
                        </p>

                        {!noneAcknowledged ? (
                            <button
                                onClick={() => setNoneAcknowledged(true)}
                                className="w-full mt-2 py-3 px-4 bg-[var(--danger)] hover:opacity-90 text-white font-bold text-[13px] rounded-[8px] transition-opacity"
                            >
                                我了解了，本節先補章節，之後繼續 W10 →
                            </button>
                        ) : (
                            <div className="mt-2 bg-white border border-[var(--border)] rounded-[6px] p-3 text-[12px] text-[var(--ink-mid)] leading-relaxed">
                                ✅ <strong className="text-[var(--ink)]">已確認。</strong>請先補齊 W9 第 2-5 章，補完後可回來繼續 Step 2 方法工具書 + Step 3 工具設計。
                            </div>
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

export const ToolRefinementPage = () => {
    const [w9Method, setW9Method] = useState('');
    const [w9Topic, setW9Topic] = useState('');
    const [w8Secondary, setW8Secondary] = useState(''); // W8 補充方法（label 字串）
    const [detectedMethodId, setDetectedMethodId] = useState('');
    const [toolKitView, setToolKitView] = useState(null); // 工具書教學 tab 使用者切換值
    const [litSubtype, setLitSubtype] = useState(''); // 文獻組 4 子類型 id
    const [showLessonMap, setShowLessonMap] = useState(false);
    /* AI 使用模式 */
    const [w10AiMode, setW10AiMode] = useState(() => {
        try {
            const r = JSON.parse(localStorage.getItem('rib_think_records')) || {};
            return r['w10-ai-mode'] || '';
        } catch { return ''; }
    });

    /* W9 資料帶入 */
    useEffect(() => {
        const saved = readRecords();
        const method = saved['w9-my-method']?.trim() || saved['w8-tool-method']?.trim() || '';
        const secondary = saved['w8-tool-method-secondary']?.trim() || '';
        const topic = saved['w8-merged-topic']?.trim() || saved['w8-research-question']?.trim() || '';
        if (method) setW9Method(method);
        if (secondary) setW8Secondary(secondary);
        if (topic) setW9Topic(topic);

        const ml = method.toLowerCase();
        if (ml.includes('問卷')) setDetectedMethodId('questionnaire');
        else if (ml.includes('訪談')) setDetectedMethodId('interview');
        else if (ml.includes('實驗')) setDetectedMethodId('experiment');
        else if (ml.includes('觀察')) setDetectedMethodId('observation');
        else if (ml.includes('文獻')) setDetectedMethodId('literature');

        /* 文獻組：讀子類型（W9 計畫書勾選後同步寫入 STORAGE_KEY） */
        try {
            const sub = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')['w10-lit-subtype'] || '';
            if (sub) setLitSubtype(sub);
        } catch { /* ignore */ }
    }, []);

    const chooseLitSubtype = useCallback((id) => {
        setLitSubtype(id);
        try {
            const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
            all['w10-lit-subtype'] = id;
            localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
        } catch { /* ignore */ }
    }, []);

    /* ── 五步驟 ──────────────────────────────────────── */

    const steps = [
        /* ─── Step 1：開場 + 第六章工作流提醒 — 第一節 15 min ─── */
        {
            title: '開場 + 第六章流程',
            icon: '🔧',
            content: (
                <div className="space-y-8 prose-zh">
                    <StepBriefing
                        lines={[
                            { label: '節奏', text: '跟老師做（10 分鐘）' },
                            { label: '做', text: '看 W9 老師回饋、確認今天分工，再打開第六章工具表單開始填。' },
                        ]}
                    />
                    {/* 入場擋板：W9 完成狀態自檢 */}
                    <PrepStatusCheck methodId={detectedMethodId} />

                    {/* W9 老師回饋提示 */}
                    <div className="bg-[var(--paper-warm)] border border-[var(--border)] rounded-[var(--radius-unified)] px-4 py-3 flex items-start gap-3 max-w-[720px]">
                        <span className="text-[18px] flex-shrink-0">📬</span>
                        <p className="text-[12.5px] text-[var(--ink-mid)] leading-[1.8]">
                            老師已在 <strong className="text-[var(--ink)]">Google Classroom</strong> 發回 W9 計畫書批改——先打開看一遍，知道哪些地方要改，再往下做。
                        </p>
                    </div>

                    {/* Step 1 開場目標 */}
                    <div className="w7-notice w7-notice-gold">
                        🎯 <strong>本節目標：計畫書 1-5 章定稿 + 第六章「填具體題目」</strong>（不是本組工具設計書——實體 W11 第一節做）。
                    </div>

                    {/* 🤝 分工 + 第六章填題目（可收合） */}
                    <details open className="rounded-[var(--radius-unified)] border border-[var(--border)] overflow-hidden max-w-[720px]">
                        <summary className="cursor-pointer px-5 py-3 bg-[var(--paper-warm)] hover:bg-[#E9E9E9] transition-colors flex items-center justify-between list-none">
                            <span className="text-[13px] font-bold text-[var(--ink)]">📋 第六章分工說明 + 填題目提醒</span>
                            <span className="text-[11px] font-mono text-[var(--ink-mid)]">▼ 讀完可收合</span>
                        </summary>
                        <div className="p-4 space-y-4 bg-white">
                            {/* 🤝 1-4 人分章工作流（第六章工具設計） */}
                            <div className="p-5 rounded-[var(--radius-unified)] border-2 border-[#0EA5E9] bg-[#F0F9FF]">
                                <div className="flex items-center gap-2 mb-2">
                                    <ContentTypeChip type="做" />
                                    <p className="text-[14px] font-bold text-[#075985]">🤝 第六章工具設計分工（看你的隊型）</p>
                                </div>
                                <p className="text-[12.5px] text-[#0C4A6E] leading-relaxed mb-3">
                                    工具是一份大家共寫——但分工要清楚不要全擠著寫題目。<strong>核心三角色：主稿 / 對照 / AI 諮詢</strong>。人多就多一個倫理檢查。
                                </p>
                                <GroupSizeSelector
                                    items={{
                                        1: {
                                            title: '1 人（Solo）',
                                            content: (
                                                <p className="leading-relaxed">
                                                    自己 50 分鐘只能寫到主架構——別追求完美。寫完後找<strong>另一組同學試填</strong>（W11 Pilot 預演），他能挑出你看不到的盲點。
                                                </p>
                                            ),
                                        },
                                        2: {
                                            title: '2 人組',
                                            content: (
                                                <ul className="list-disc pl-4 space-y-0.5">
                                                    <li><strong>A 主稿</strong>：寫題目／訪綱／流程</li>
                                                    <li><strong>B 對照</strong>：拿本週工具品質基礎（三大標準 + 5 大錯誤）逐題挑刺</li>
                                                </ul>
                                            ),
                                        },
                                        3: {
                                            title: '3 人組',
                                            content: (
                                                <ul className="list-disc pl-4 space-y-0.5">
                                                    <li><strong>A 主稿</strong>：寫題目／訪綱／流程</li>
                                                    <li><strong>B 對照</strong>：三大標準 + 錯誤類型逐題挑</li>
                                                    <li><strong>C AI 諮詢</strong>：用工具 prompt 跑 AI，整理建議給組員看</li>
                                                </ul>
                                            ),
                                        },
                                        4: {
                                            title: '4 人組',
                                            content: (
                                                <ul className="list-disc pl-4 space-y-0.5">
                                                    <li><strong>A 主稿</strong></li>
                                                    <li><strong>B 對照</strong>：方向＋精度（本週三大標準）</li>
                                                    <li><strong>C AI 諮詢</strong></li>
                                                    <li><strong>D 倫理＋文獻檢查</strong>：工具不踩倫理紅線、跟第三章文獻對得上</li>
                                                </ul>
                                            ),
                                        },
                                    }}
                                />
                                <p className="text-[11.5px] text-[#0C4A6E] leading-relaxed mt-3 pt-2 border-t border-[#0EA5E9]/30">
                                    ⏱️ <strong>時間建議</strong>：前 5 分鐘分工 → 各自 35 分鐘做 → 最後 10 分鐘聚回來互讀整合。
                                </p>
                            </div>

                            {/* 第六章在計畫書 直接填題目 */}
                            <div className="bg-white border-2 border-[var(--accent)] rounded-[var(--radius-unified)] p-5">
                                <div className="flex items-center gap-2 mb-2 flex-wrap">
                                    <span className="text-[10px] font-mono font-bold bg-[var(--accent)] text-white px-2 py-0.5 rounded-[3px]">第六章</span>
                                    <span className="font-bold text-[14px] text-[var(--ink)]">打開 計畫書第六章填題目，對照 Step 2 工具書寫</span>
                                </div>
                                <p className="text-[12px] text-[var(--ink-light)] leading-relaxed">
                                    這節只在紙上設計題目；做成 Google Form／紙本訪綱／印觀察表是 W11 的事。
                                </p>
                            </div>
                        </div>
                    </details>

                    {/* ▶ 下一頁預告：Step 2 工具書自學教案 */}
                    <div className="w7-notice w7-notice-gold">
                        ▶ <strong>下一頁 Step 2：工具書自學教案</strong>——5 法 tab 切換 + 4 區塊（題型結構／設計原則／獨家陷阱／完整範例）。看完那頁，回 計畫書第六章寫題目就有方向。
                    </div>
                </div>
            ),
        },

        /* ─── Step 2：打開第六章工具表單 ─── */
        {
            title: '第六章工具表單',
            icon: '🛠️',
            content: (
                <div className="space-y-6 prose-zh">
                    <StepBriefing
                        lines={[
                            { label: '節奏', text: '自己做（第一節主力）' },
                            { label: '做', text: '打開第六章工具表單 → 填好題目／訪綱／流程 → 把重點寫進計畫書第六章' },
                        ]}
                    />

                    {/* 兩份文件的關係說明 */}
                    <div className="bg-[var(--paper-warm)] border border-[var(--border)] rounded-[var(--radius-unified)] p-4 max-w-[720px]">
                        <p className="text-[13px] font-bold text-[var(--ink)] mb-2">📄 這節要開兩份文件</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[12px]">
                            <div className="bg-white border-2 border-[var(--accent)] rounded p-3">
                                <p className="font-bold text-[var(--accent)] mb-0.5">① 第六章工具表單（主力）</p>
                                <p className="text-[var(--ink-mid)] leading-relaxed">你實際拿去問人／觀察／實驗用的那份——先把題目填進去。</p>
                            </div>
                            <div className="bg-white border border-[var(--border)] rounded p-3">
                                <p className="font-bold text-[var(--ink)] mb-0.5">② 計畫書第六章（配合）</p>
                                <p className="text-[var(--ink-mid)] leading-relaxed">工具填完後，把關鍵設計說明（為什麼這樣設計）補進計畫書文字。</p>
                            </div>
                        </div>
                    </div>

                    {/* 工具表單連結（依方法自動顯示） */}
                    {!detectedMethodId ? (
                        <div className="bg-[#FEF3C7] border-2 border-[#F59E0B] rounded-[var(--radius-unified)] p-4 max-w-[720px] text-[12px] text-[#92400E] leading-relaxed">
                            ⚠️ 未偵測到研究方法——請先回 <a href="/w9" className="text-[var(--accent)] font-bold underline">W9</a> 在「組內合議方法」點選，再回來這裡會自動顯示你的工具表單連結。
                        </div>
                    ) : (() => {
                        const template = TEMPLATES[detectedMethodId];
                        const methodLabel = METHOD_OPTIONS.find(m => m.id === detectedMethodId)?.label || detectedMethodId;
                        const isLit = detectedMethodId === 'literature';
                        return (
                            <div className="border-2 border-[var(--accent)] rounded-[var(--radius-unified)] overflow-hidden max-w-[720px]">
                                <div className="px-5 py-3 bg-[var(--accent)] text-white flex items-center gap-2">
                                    <span className="text-[15px]">🛠️</span>
                                    <span className="font-bold text-[13px]">你的第六章工具表單：{methodLabel}</span>
                                </div>
                                <div className="p-4 space-y-3">
                                    {isLit ? (
                                        <div className="space-y-2">
                                            <p className="text-[12px] text-[var(--ink-mid)] leading-relaxed">文獻組依子類型選一份（計畫書第一章已勾選）：</p>
                                            {[
                                                { label: '② 歷史分析', url: 'https://docs.google.com/spreadsheets/d/1vvtTwR2_9F293I0GozYZc6zsGluTcfIY1NlHb2TpdgA/copy' },
                                                { label: '③ 內容分析', url: 'https://docs.google.com/spreadsheets/d/1C_McYlh5zqyS216cAdSvorMzOZ4U8W56_bQFpYHlEdY/copy' },
                                                { label: '④ 論述分析', url: 'https://docs.google.com/spreadsheets/d/1p4RCHe_uXwGs0NkwLoz_7XOrmAX35d3mhad7DmxBQjQ/copy' },
                                                { label: '⑤ 敘事分析', url: 'https://docs.google.com/spreadsheets/d/1h5qymclzSox-t-gKvjL9iU8d48N4ORMxcPFX2hkQ70g/copy' },
                                            ].map((item, i) => (
                                                <a key={i} href={item.url} target="_blank" rel="noopener noreferrer"
                                                    className="flex items-center gap-2 bg-white border border-[var(--border)] rounded px-3 py-2 text-[12px] font-bold text-[var(--accent)] hover:bg-[var(--paper-warm)] transition-colors no-underline">
                                                    📄 {item.label} 工具表單 →
                                                </a>
                                            ))}
                                        </div>
                                    ) : (
                                        <a href={template.url} target="_blank" rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 bg-[var(--accent)] text-white px-4 py-2.5 rounded-[var(--radius-unified)] font-bold text-[13px] hover:opacity-90 transition-opacity no-underline">
                                            📄 複製我的工具表單（{template.name}）→
                                        </a>
                                    )}
                                    <p className="text-[11px] text-[var(--ink-light)] italic leading-relaxed">
                                        💡 點連結會複製一份到你的 Google Drive，直接在上面填就好。
                                    </p>
                                </div>
                            </div>
                        );
                    })()}

                    {/* 補充方法提示（有登記才顯示） */}
                    {w8Secondary && (
                        <div className="bg-[#ECFDF5] border border-[#10B981] rounded-[var(--radius-unified)] p-3 max-w-[720px] text-[12px] text-[#065F46] leading-relaxed">
                            🧩 補充方法（{w8Secondary}）的工具表單：主工具填完後課後再做，不擠進這節。
                        </div>
                    )}

                    <div className="w7-notice w7-notice-teal">
                        ✅ 工具表單填到雛形 → 把關鍵設計說明補進計畫書第六章 → Step 3 AI 工作坊（可選）。
                    </div>
                </div>
            ),
        },

        /* ─── Step 3：AI 工作坊（雙模式 + 完整對話繳交） ─── */
        {
            title: 'AI 工作坊（可選）',
            icon: '🤖',
            content: (
                <div className="space-y-8 prose-zh">
                    <StepBriefing
                        lines={[
                            { label: '做', text: '選 AI 模式（教學型/驗收型/不用 AI）→ 跑 Prompt → 保留完整對話' },
                        ]}
                    />
                    {/* 開場：明示可選 */}
                    <div className="p-4 rounded-[var(--radius-unified)] border-2 border-[var(--accent)] bg-[#F8F8FB] max-w-[720px]">
                        <div className="flex items-center gap-2 mb-1">
                            <ContentTypeChip type="做" />
                            <p className="text-[14px] font-bold text-[var(--accent)]">🤖 AI 工作坊（可選 · 不用也合法）</p>
                        </div>
                        <p className="text-[12.5px] text-[var(--ink)] leading-relaxed">
                            把第六章題目寫到計畫書後，<strong>想試 AI 就試</strong>——驗收（找毛病）／教學（給範例）／<strong>不用 AI · 自己先試</strong> 三選一。
                            下方 AIModePicker 有「🚫 不用 AI」選項，選了會自動略過後續 prompt 與對話繳交。本週第六章工具設計<strong>純人工也能完成</strong>。
                        </p>
                    </div>

                    {/* AI 工作坊區（雙模式 + 完整對話繳交） */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono font-bold bg-[var(--accent)] text-white px-2 py-0.5 rounded-[3px]">AI 工作坊</span>
                            <span className="text-[14px] font-bold text-[var(--ink)]">🤖 用 AI 設計工具（雙模式可選）</span>
                        </div>

                        {/* AI 協作三原則（W10 角色：嚴格教練） */}
                        <AICollaborationPrinciples week="10" role="critic" compact={false} />

                        {/* AI 模式選擇 */}
                        <AIModePicker week="10" taskName="工具設計" onChange={setW10AiMode} />

                        {/* 教學型：直接顯示對應方法的 kit.prompt */}
                        {w10AiMode === 'teach' && (() => {
                            const activeKey = toolKitView || detectedMethodId || 'questionnaire';
                            const kit = TOOL_DESC_KIT[activeKey];
                            if (!kit) return null;
                            return (
                                <div className="rounded-[var(--radius-unified)] border-2 border-[#86EFAC] bg-[#F0FDF4] p-4 space-y-3">
                                    <p className="text-[13px] font-bold text-[#166534]">🎓 教學型 Prompt — {kit.label}（從零到一）</p>
                                    {/* 方法偵測提醒 */}
                                    {detectedMethodId ? (
                                        <p className="text-[11px] bg-white border border-[#86EFAC] rounded-[4px] px-2.5 py-1.5 text-[#166534] leading-relaxed">
                                            ✅ 偵測到你的方法：<strong>{kit.label}</strong>（不對？<a href="/w9" className="underline font-bold">回 W9 重新登記方法</a>後這裡會自動切換）
                                        </p>
                                    ) : (
                                        <p className="text-[11px] bg-[#FEF3C7] border border-[#FCD34D] rounded-[4px] px-2.5 py-1.5 text-[#92400E] leading-relaxed">
                                            ⚠️ 未偵測到你的方法，<strong>預設顯示問卷組</strong>——請<a href="/w9" className="underline font-bold">回 W9 重新登記研究方法</a>，完成後這裡會自動切換。
                                        </p>
                                    )}
                                    <p className="text-[11.5px] text-[#166534] leading-relaxed">
                                        把 [方括號] 內容換成你的東西再貼給 AI。<strong>AI 給「方向」就好</strong>，實際題目自己寫到計畫書，看完範例後自己改寫一次。
                                    </p>
                                    <PromptBlock text={kit.prompt} />
                                    <p className="text-[11px] text-[#166534] italic leading-relaxed">
                                        💡 顯示的是你方法（{kit.label}）的 prompt——切到 Step 2 改方法 tab，這裡會跟著切換。
                                    </p>
                                </div>
                            );
                        })()}

                        {/* 驗收型：通用 prompt（學生有初稿） */}
                        {w10AiMode === 'verify' && (
                            <div className="rounded-[var(--radius-unified)] border-2 border-[#FCA5A5] bg-[#FEF2F2] p-4 space-y-3">
                                <p className="text-[13px] font-bold text-[#991B1B]">🥊 驗收型 Prompt（我有題目初稿）</p>
                                <p className="text-[11.5px] text-[#991B1B] leading-relaxed">
                                    你已寫了一些題目（在 計畫書第六章），請 AI 從研究方法老師角度<strong>找毛病</strong>。
                                </p>
                                <PromptBlock text={`我寫了一份[問卷／訪談大綱／實驗流程／觀察紀錄表／文獻分析編碼表]，請從研究方法老師角度幫我找毛病。

【我的研究】
- 方法：___
- 研究問題：___
- 對象：___
- 關鍵變項／主題：___

【我的工具初稿】
___（貼題目／訪綱／流程／編碼表）

【請從以下角度檢查】
1. 題目／提問是否對應研究問題？哪幾題偏離主題？
2. 是否有「引導性題目」「雙題合一」「術語太難」等常見錯誤？
3. 樣本／時序／順序設計是否有遺漏？
4. 我這個方法的「獨家陷阱」我有避開嗎？

只指出問題與建議改寫方向，不要替我重寫——改寫由我自己來。`} />
                            </div>
                        )}

                        {!w10AiMode && (
                            <div className="rounded-[var(--radius-unified)] border border-[var(--border)] bg-[var(--paper-warm)] p-3">
                                <p className="text-[12px] text-[var(--ink-mid)] leading-relaxed">
                                    ☝️ 上方先選一個 AI 使用模式：寫不出題目選🎓教學型；有初稿了選🥊驗收型。
                                </p>
                            </div>
                        )}

                        {/* 完整對話繳交（使用 AI 模式才顯示；standalone 選了不用 AI，不強制繳） */}
                        {w10AiMode && w10AiMode !== 'standalone' && (
                            <AIDialogSubmission week="10" taskName="工具設計對話" required={false} />
                        )}
                    </div>

                    {/* 下節預告 */}
                    <div className="w7-notice w7-notice-teal">
                        ✅ AI 工作坊完成 → 下一步：<strong>Step 4 老師諮詢區</strong>（帶 AI 跑過的版本給老師看）。<br />
                        💡 <strong>第八章 + 第九章(三) 限制改進 — 草稿即可、不花時間</strong>。等 W14 數據出來再回頭補才寫得到位。
                    </div>
                </div>
            ),
        },

        /* ─── Step 4：老師諮詢區（最終把關，AI 跑完後給老師看） ─── */
        {
            title: '老師諮詢區',
            icon: '🧑‍🏫',
            content: (
                <div className="space-y-8 prose-zh">
                    <StepBriefing
                        lines={[
                            { label: '做', text: '帶計畫書第六章到諮詢區找老師當場檢查，拿具體建議' },
                        ]}
                    />
                    <p className="text-[14px] text-[var(--ink-mid)] leading-relaxed max-w-[760px]">
                        你在計畫書第六章寫了題目——<strong className="text-[var(--ink)]">帶著計畫書到諮詢區找老師</strong>。老師當場檢查、給建議。
                    </p>

                    {/* 諮詢區運作說明 */}
                    <div className="border-2 border-[var(--accent)] rounded-[var(--radius-unified)] overflow-hidden max-w-[760px]">
                        <div className="px-5 py-3 bg-[var(--accent)] text-white flex items-center gap-2">
                            <span className="font-bold text-[14px]">🧑‍🏫 諮詢區運作方式</span>
                        </div>
                        <div className="p-4 space-y-2 text-[12.5px] text-[var(--ink-mid)] leading-relaxed">
                            <p>① <strong>老師會隨機抽組</strong>到諮詢區報告進度（5 分鐘 / 組）</p>
                            <p>② 沒被抽到的組可以主動到諮詢區排隊</p>
                            <p>③ <strong>帶著「計畫書」找老師</strong>（含第六章寫好的題目）</p>
                            <p>④ 老師當場挑出主要問題、給修改方向</p>
                            <p>⑤ 回座位修題目，把老師的回饋<strong className="text-[var(--accent)]">直接寫進計畫書 docx 邊註</strong>並立刻修第六章</p>
                            <div className="mt-3 pt-3 border-t border-[var(--border)] bg-[#FFFBEB] rounded-[6px] p-3 text-[12px] text-[#78350F] leading-relaxed">
                                ⏳ <strong>還沒被叫到的組：</strong>不要空等——回座位繼續在計畫書 docx 做你的進度（1-5 章還沒補完的先補、已補完的繼續完善第六章題目），或到 Step 3 跑 AI 工作坊。叫到名字再去，不用在旁邊站著等。
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#FFFBEB] border-l-4 border-[#D97706] rounded-r-[6px] p-3 text-[12px] text-[#92400E] leading-[1.85] max-w-[760px]">
                        💡 <strong>為什麼用老師諮詢取代自查？</strong>學生看自己題目都覺得 OK——盲區大。老師有經驗，能挑出你看不到的問題。隨機抽組會讓你準備充分。
                    </div>

                    {/* 諮詢紀錄展示卡 — 直接寫在 docx 邊註，不在網頁 */}
                    <div className="bg-[var(--paper-warm)] border-2 border-[var(--accent)] rounded-[var(--radius-unified)] p-4">
                        <p className="text-[13px] font-bold text-[var(--ink)] mb-2">📝 諮詢後直接在計畫書 docx 邊註寫</p>
                        <p className="text-[12px] text-[var(--ink-mid)] leading-relaxed mb-3">
                            <strong className="text-[var(--accent)]">不在這格寫</strong>——老師當場給的建議：
                        </p>
                        <div className="bg-white border border-[var(--border)] rounded-[6px] p-3 text-[12px] text-[var(--ink-mid)] leading-[1.8]">
                            <p>① <strong>老師指出的主要問題</strong>：題號 + 老師回饋 → <strong className="text-[var(--accent)]">直接在第六章對應題目旁邊註</strong></p>
                            <p>② <strong>我修了什麼</strong>：具體修改 → <strong className="text-[var(--accent)]">改在第六章 docx 上，邊註留改動歷程</strong></p>
                        </div>
                    </div>

                    {/* 下一步 */}
                    <div className="w7-notice w7-notice-teal">
                        ✅ 老師諮詢過、題目改完 → 下一步：<strong>Step 5 補七到十三章 + 整本繳交</strong>。
                    </div>
                </div>
            ),
        },

        /* ─── Step 5：第七~十三章補完 + 整本繳交 — 第二節 50 min ─── */
        {
            title: '七到十三章 × 整本繳交',
            icon: '📤',
            content: (
                <div className="space-y-8 prose-zh">
                    <StepBriefing
                        lines={[
                            { label: '做', text: '第七到十三章補完（八+九(三) 草稿即可 / 十~十二勾選即可 / 十三章把 W7 文獻套 APA）' },
                        ]}
                    />
                    <p className="text-[14px] text-[var(--ink-mid)] leading-relaxed max-w-[720px]">
                        本週任務：把第七到十三章補完，整本繳到 <strong className="text-[var(--ink)]">Google Classroom</strong>。下週 W11 拿到老師第三次建議再修，並做<strong className="text-[var(--ink)]">本組工具設計書</strong>（題目升級成工具設計書 + Google Form／印紙本訪綱載具）。
                    </p>

                    {/* 第八章 + 第九章(三) 草稿備註（給學生看的） */}
                    <div>
                        <div className="bg-[#FFFBEB] border-l-4 border-[#D97706] rounded-r-[8px] p-4 mb-3 max-w-[760px]">
                            <p className="text-[13px] font-bold text-[#92400E] mb-1.5">📌 第八章 + 第九章(三)：草稿即可，別花太多時間</p>
                            <div className="text-[12px] text-[#78350F] leading-[1.85] space-y-1">
                                <p><strong>第八章資料分析方式</strong>——寫一句「預計用 ___ 分析」即可（例：「用 Excel 算次數分布和平均」）。分析工具 W14 老師會帶，現在不需要寫詳細步驟。</p>
                                <p><strong>第九章(三) 限制與改進</strong>——寫 1-2 條現在就想得到的（例：「樣本只有本校、無法推論」）。其他要等做完才知道，不要硬猜。</p>
                            </div>
                            <p className="text-[11px] text-[#92400E] italic mt-2 pt-2 border-t border-[#D97706]/30">
                                💡 草稿 ＝「我有寫，等真的做了再修」。老師批改時不苛責這兩段的深度。
                            </p>
                        </div>

                        <div className="bg-[#EFF6FF] border-l-4 border-[#2563EB] rounded-r-[6px] p-3 mb-3 max-w-[760px]">
                            <p className="text-[12.5px] text-[#1E40AF] leading-[1.85]">
                                💡 <strong>第十～十三章不用另外找通用版／模板</strong>——計畫書 docx 範本內已經<strong>預填好結構</strong>（第十章 17 個倫理勾選項、第十二章 AI 聲明 3 條、第十三章 APA 範例）。
                                <strong className="text-[#1E40AF]">直接在範本上勾選或填空即可</strong>，網頁這張表只是進度檢核。
                            </p>
                        </div>
                        <div className="bg-white border border-[var(--border)] rounded-[var(--radius-unified)] overflow-hidden">
                            <div className="grid grid-cols-[60px_1fr_70px] bg-[var(--paper-warm)] border-b border-[var(--border)] text-[11px] font-mono font-bold text-[var(--ink)]">
                                <div className="px-3 py-2.5">章</div>
                                <div className="px-3 py-2.5 border-l border-[var(--border)]">內容</div>
                                <div className="px-3 py-2.5 border-l border-[var(--border)]">本節到</div>
                            </div>
                            {[
                                { ch: '七', t: '研究實施（W11-W12 大致時程／地點／流程）', stage: '草稿' },
                                { ch: '八', t: '資料分析方式（已預列 5 種統計方法 + 6 種圖表，勾選即可）', stage: '草稿' },
                                { ch: '九', t: '預期結論與貢獻（(三) 限制只寫 1-2 條，等 W14-W15 再補）', stage: '雛形' },
                                { ch: '十', t: '研究倫理（已預列 4 原則 + 17 個 ☐ 勾選項，勾選＋微調）', stage: '雛形' },
                                { ch: '十一', t: '時程表 W9-W17（對照課表填每週做什麼）', stage: '雛形' },
                                { ch: '十二', t: 'AI 使用聲明（已預列聲明條款 + 3 個 ☐ 勾選項）', stage: '雛形' },
                                { ch: '十三', t: '參考文獻（已給 APA 範例，列 W7 找的文獻 ≥3 筆）', stage: '雛形' },
                            ].map((r, i) => (
                                <div key={i} className="grid grid-cols-[60px_1fr_70px] border-b border-[var(--border)] last:border-b-0 text-[12.5px]">
                                    <div className="px-3 py-2.5 font-mono font-bold text-[var(--accent)]">{r.ch}</div>
                                    <div className="px-3 py-2.5 border-l border-[var(--border)] text-[var(--ink)]">{r.t}</div>
                                    <div className="px-3 py-2.5 border-l border-[var(--border)] text-[var(--ink-mid)] font-mono text-[11px]">{r.stage}</div>
                                </div>
                            ))}
                        </div>
                        <p className="text-[11.5px] text-[var(--ink-light)] italic mt-2">
                            💡 第十、十一、十二章在範本內已是勾選項／預填條款，是<strong>最快寫完的三章</strong>；第十三章把 W7 找過的文獻 3 筆套 APA 格式即可。
                        </p>
                    </div>

                    {/* W10 完整 AI-RED */}
                    <div className="flex items-center gap-2 mb-2">
                        <ContentTypeChip type="做" />
                        <p className="text-[13px] font-bold text-[var(--ink)]">AI-RED 反思紀錄</p>
                    </div>
                    <AIREDNarrative
                        week="10"
                        hint="本週用 AI 檢核整本計畫書（教學型卡關處給範例 / 驗收型整本找盲點）"
                    />

                    {/* 繳交驗收 + 課後待補清單 */}
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <ContentTypeChip type="交出" />
                            <h4 className="font-serif text-[18px] md:text-[20px] font-bold text-[var(--ink)]">
                                繳交驗收 + 寫課後待補清單
                            </h4>
                        </div>
                        <p className="text-[13px] text-[var(--ink-mid)] leading-relaxed mb-3">
                            檢查整本計畫書 13 章都到本節要求的進度，上傳 Google Classroom W10 作業區。寫一份「課後待補清單」——你自己知道哪些章還粗、哪幾題還想動的，記下來，W11 拿到老師回饋時可以對照。
                        </p>
                        <div className="bg-[var(--paper-warm)] border border-[var(--border)] rounded-[6px] p-3">
                            <p className="text-[12px] text-[var(--ink-mid)] leading-[1.85]">
                                <strong className="text-[var(--ink)]">怎麼做：</strong>在計畫書 docx 末尾加一段 <strong className="text-[var(--accent)]">「課後待補」筆記區</strong>——自己列出哪幾章還想再動，<strong>W11 拿到老師回饋時可以對照</strong>。
                            </p>
                            <p className="text-[11.5px] text-[var(--ink-light)] italic mt-2 leading-[1.85]">
                                💡 例：<br />
                                ・第七章流程還沒寫完，等 W11 確定本組工具設計書後再補<br />
                                ・第八章現只寫一句「預計用 Excel」，等 W14 看到數據再展開<br />
                                ・第九章(三) 限制現只寫一條，等 W15 結論時再補<br />
                                ・第十章倫理「不傷害」這條還不確定怎麼寫<br />
                                <strong>不在這格寫，直接在 docx 末尾建「課後待補」段落。</strong>
                            </p>
                        </div>
                    </div>

                    <div className="w7-notice w7-notice-teal">
                        ✅ 整本繳交完成 → W11 第一節讀老師 GC 回饋 → 修星號項 → 拿模板填本組工具設計書。
                    </div>
                </div>
            ),
        },

        /* ─── Step 6：繳交確認 + W11 預告 ─── */
        {
            title: '繳交確認 + W11 預告',
            icon: '🔔',
            content: (
                <div className="space-y-8 prose-zh">
                    <StepBriefing
                        lines={[
                            { label: '交出', text: '上傳計畫書 docx 到 Google Classroom' },
                            { label: '做', text: '對照本週要會 4 項確認完成，讀 W11 預告' },
                        ]}
                    />
                    <p className="text-[14px] text-[var(--ink-mid)] leading-relaxed max-w-[720px]">
                        本節最後一段：把整本計畫書匯出資料、確認 GC 已上傳，讀 W11 預告。<strong className="text-[var(--ink)]">老師會在 W11 上課前把整本檢核回饋發到 GC（含★星號等級：★★★ 必改、★★ 建議改、★ 提醒；W11 第一節會帶你逐項處理）</strong>——你下週進教室第一件事就是讀回饋。
                    </p>

                    {/* ExportButton */}
                    {/* 本週結束，你應該要會 — B 標準格式 */}
                    <div className="bg-white border border-[var(--border)] rounded-[var(--radius-unified)] overflow-hidden mb-4">
                        <div className="p-4 px-5 bg-[var(--paper-warm)] border-b border-[var(--border)] font-bold text-[13px]">
                            ✅ 本週結束，你應該要會
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-[1px] bg-[var(--border)]">
                            {[
                                                '把計畫書 1-5 章從雛形修到定稿（W9 老師回饋已整合）',
                                                '在第六章把研究問題轉成具體工具題目',
                                                '為每個工具設計決策說清楚「為什麼這樣設計」',
                                                '列出課後 W10→W11 之間要補的事（不要拖）',
                            ].map((item, i) => (
                                <div key={i} className="p-4 px-5 bg-white flex items-start gap-3">
                                    <span className="text-[var(--success)] text-[16px] mt-0.5 flex-shrink-0">✓</span>
                                    <span className="text-[13px] text-[var(--ink-mid)] leading-relaxed">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 繳交說明卡（取代 ExportButton：W9-W10 主產出是計畫書本身） */}
                    <div className="bg-[#F0FDF4] border-2 border-[var(--success)] rounded-[var(--radius-unified)] p-5 max-w-[760px]">
                        <div className="flex items-center gap-2 mb-2">
                            <ContentTypeChip type="交出" />
                            <span className="text-[18px]">📤</span>
                            <span className="font-bold text-[14px] text-[var(--ink)]">本週繳交</span>
                            <span className="text-[10.5px] font-mono text-[var(--ink-light)] ml-1">TO CLASSROOM</span>
                        </div>
                        <p className="text-[12.5px] text-[var(--ink-mid)] leading-[1.85] mb-3">
                            這週主產出是<strong className="text-[var(--ink)]">計畫書 docx 整本定稿</strong>（13 章）。
                        </p>
                        <ol className="text-[12.5px] text-[var(--ink-mid)] leading-[1.85] list-decimal pl-5 space-y-2">
                            <li><strong>打開 W9 的計畫書繼續編輯</strong>——就是 W9 那份，從 Google Classroom W9 作業區找回自己的副本，不用開新的</li>
                            <li><strong>全組分章撰寫</strong>——開共用連結讓組員一起編輯（7-13 章今天補完）</li>
                            <li><strong>組長代表上傳到 Classroom W10 作業區</strong>（整本 docx）——老師會在 W11 上課前批改回饋（含 ★★★ 等級）</li>
                            <li><strong>有用 AI 另附完整對話連結</strong>——貼到 Classroom 同一作業的留言欄</li>
                        </ol>
                        <p className="text-[11.5px] text-[var(--ink-light)] italic mt-3 pt-3 border-t border-[var(--border)] leading-[1.85]">
                            💡 W10 不需匯出網頁紀錄；繳交計畫書 docx 整本即可。若有使用 AI，另附完整 AI 對話連結。
                        </p>
                    </div>

                    {/* W11 預告（新流程：第一節本組工具設計書 + 第二節 Pilot+倫理+施測） */}
                    <div className="bg-[var(--ink)] border-l-4 border-[var(--danger)] p-5 md:p-6 rounded-r-lg text-white shadow-xl">
                        <div className="flex items-center gap-2 mb-3">
                            <Users size={20} className="text-[var(--danger)]" />
                            <span className="font-mono text-[11px] font-bold tracking-[0.2em] text-[var(--danger)] uppercase">W11 預告 · 本組工具設計書 × 跨方法預試 × 倫理 × 施測啟動</span>
                        </div>
                        <div className="font-bold text-[17px] md:text-[18px] mb-3 leading-tight">
                            下週兩節分明：第一節做本組工具設計書、第二節做跨方法預試
                        </div>
                        <p className="text-[13px] text-white/85 leading-[1.9] mb-3">
                            <strong className="text-white">第一節（50 min）</strong>：讀老師 GC 回饋 → 修星號項 → 拿模板填**本組工具設計書完整版**（依方法：問卷／訪綱／實驗／觀察／文獻分析架構）。
                        </p>
                        <p className="text-[13px] text-white/85 leading-[1.9] mb-3">
                            <strong className="text-white">第二節（50 min）</strong>：跨方法預試（Pilot）互測 20 min（座位表配對）→ 雙向紀錄 5 min → 倫理快速 10 min → 施測啟動 10 min。
                        </p>
                        <p className="text-[12px] text-white/75 leading-[1.85] mb-3 pt-3 border-t border-white/20">
                            🔍 <strong className="text-white">先看懂兩個詞</strong>：預試（Pilot）＝正式施測前找 2-3 人試填／試訪，抓出真人會卡住的題目；跨方法互測＝老師用座位表排位，你跟對面不同方法組的同學一對一互當受測者。W11 進場有完整說明。
                        </p>
                        <p className="text-[12.5px] text-white/70 leading-[1.9] font-mono">
                            課後任務：對照「課後待補清單」，把第八章草稿先補一輪（W11 拿到回饋會更清楚要怎麼寫）
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
                    <span className="hidden md:inline">研究方法與專題 / 資料蒐集 / </span><span className="text-[var(--ink)] font-bold">計畫書·整本定稿 W10</span>
                </div>
                <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
                    <span className="bg-[var(--paper-warm)] text-[var(--ink)] text-[10px] font-bold px-2 py-0.5 rounded-[2px] font-mono">100 MINS</span>
                    <ResetWeekButton weekPrefix="w10-" />
                    <button
                        onClick={() => setShowLessonMap(!showLessonMap)}
                        className="text-[11px] text-[var(--ink-light)] hover:text-[var(--accent)] transition-colors flex items-center gap-1 font-mono"
                        type="button"
                    >
                        <Map size={12} /> <span className="hidden md:inline">{showLessonMap ? '收起流程' : '教師流程'}</span>
                    </button>
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
                todo={[
                  { label: '今天做什麼', value: '看方法工具書、在第六章填具體題目、找老師諮詢，把七到十三章補到可以繳交的程度。' },
                  { label: '為什麼做', value: 'W9 地基立了但工具細節還沒到執行程度——這週整本定稿，是後續施測的唯一根據。' },
                  { label: '今天交什麼', value: '計畫書整本 13 章 docx（含 AI 對話連結）。' },
                ]}
                question="我的工具問得到我要的資料嗎？"
                title="計畫書 · "
                accentTitle="整本定稿"
                subtitle="W10 = 把計畫書寫到定稿。第一節：方法工具書（含 4 集教學影片）+ 在計畫書第六章寫題目。第二節：AI 工作坊自查 → 老師諮詢區把關 → 七到十三章補完 → 整本繳到 Google Classroom。下週 W11 拿到老師第三次建議再修工具，並把題目轉成施測載具（Google Form／紙本）+ 跨方法 Pilot 互測。"
                chain="W9 計畫書 1-5 章地基立起來了——但工具細節還沒寫到能執行的程度。這週把第六章的訪綱／問卷題／實驗流程寫到位。"
                meta={[
                    { label: '第一節', value: '開場 + 第六章流程提醒 → 工具書自學教案（5 法 4 區塊）→ 回計畫書寫題目' },
                    { label: '第二節', value: 'AI 工作坊（可選）→ 老師諮詢區 → 七到十三章補完 → 整本繳交' },
                    { label: '課堂產出', value: '計畫書 整本（13 章；8、9-(三) 草稿即可）' },
                    { label: '前置要求', value: 'W9 計畫書第 1-5 章雛形（含第四章變項／主題）' },
                ]}
            />
            <CourseArc items={[
                    { wk: 'W1-W4', name: '探索\n定題', status: 'past' },
                    { wk: 'W5-W6', name: '操作型定義\n海報博覽會', status: 'past' },
                    { wk: 'W7-W8', name: '文獻偵探\n引用寫作', status: 'past' },
                    { wk: 'W9', name: '計畫書\n地基工程', status: 'past' },
                    { wk: 'W10', name: '工具設計\n整本檢核', status: 'now' },
                    { wk: 'W11', name: 'Pilot Test\n倫理審查', status: '' },
                    { wk: 'W12-W15', name: '執行研究\n數據分析', status: '' },
                ]} />

            {/* 大紅標語：W10 不需填網頁 */}
            <div className="bg-[var(--danger)] text-white rounded-[var(--radius-unified)] px-5 py-4 flex items-start gap-3 mb-2">
                <span className="text-[22px] shrink-0">📋</span>
                <div>
                    <p className="text-[14px] font-bold mb-1">這週在計畫書 docx 寫——網頁不用填</p>
                    <p className="text-[12px] text-white/70 leading-relaxed">主要工作都在計畫書 docx，網頁只是課程說明參考用。老師上課前會講重點。</p>
                </div>
            </div>

            <TaskCard
                weekNumber="W10"
                weekTitle={W10Data.title}
                duration={`${W10Data.duration} 分鐘 · ${W10Data.durationDesc}`}
                tasks={[
                    '方法工具書 + 4 集教學影片 — 5 法 4 區塊速覽',
                    '老師諮詢區 — 帶計畫書找老師檢查、改題目',
                    'AI 工作坊（雙模式）+ 計畫書整本繳交',
                ]}
                exportReminder="繳交計畫書整本（含第七到十三章）+ AI 對話記錄"
            />

            {/* STEP ENGINE */}
            <StepEngine
                steps={steps}
                prevWeek={{ label: '回 W9 計畫書 1-5 章地基', to: '/w9' }}
                nextWeek={{ label: '前往 W11 倫理審查', to: '/w11' }}
            flat
            />
        </div>
    );
};
