import React, { useState, useCallback, useEffect } from 'react';
import CourseArc from '../components/ui/CourseArc';
import './ToolRefinementPage.css';
import ThinkRecord from '../components/ui/ThinkRecord';
import PromptBlock from '../components/ui/PromptBlock';
import ThinkChoice from '../components/ui/ThinkChoice';
import Checklist from '../components/ui/Checklist';
import AIREDNarrative from '../components/ui/AIREDNarrative';
import AICollaborationPrinciples from '../components/ui/AICollaborationPrinciples';
import AIDialogSubmission from '../components/ui/AIDialogSubmission';
import AIModePicker from '../components/ui/AIModePicker';
import StepEngine from '../components/ui/StepEngine';
import HeroBlock from '../components/ui/HeroBlock';
import ExportButton from '../components/ui/ExportButton';
import ResetWeekButton from '../components/ui/ResetWeekButton';
import LessonMap from '../components/ui/LessonMap';
import GroupSizeSelector from '../components/ui/GroupSizeSelector';
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
import { TOOL_DESC_KIT, LIT_SUBTYPES, W10_THINK_CHOICES, TEACHING_VIDEOS } from '../data/methodToolbook';

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

/* — 工具檢核共用前置：進度自評（W10 第一節學生工具還在雛形，給 AI 校準） — */
const TOOL_CHECK_INTRO = `【我的工具進度自評】（從「方向／雛形／精修／定版」擇一填入）：___

【四階段定義】
- 方向：只有概念，題目／流程還沒展開
- 雛形：題目／訪綱寫出來但粗糙
- 精修：題目完整但要打磨用詞
- 定版：要繳交了

【請依進度給對應深度的回饋】
- 方向：只檢「設計方向能否回答研究問題」，給「該補什麼」清單，不要挑用詞
- 雛形：檢「結構＋邏輯」，挑明顯漏洞（漏題、選項不全、雙重問題等）
- 精修：挑用詞、追問設計、選項邊界等細節
- 定版：做最後一輪挑刺

`;

/* — 各方法 AI 檢核 Prompt — */
const AI_PROMPTS = {
    questionnaire: TOOL_CHECK_INTRO + `我設計了一份問卷，請幫我檢查：
1. 有沒有問題不清楚？
2. 選項是否完整、互斥？
3. 有沒有雙重否定或雙重問題？
4. 倫理考量是否足夠（知情同意、隱私保護）？
5. 給我具體修改建議。

【貼上你的問卷】`,
    interview: TOOL_CHECK_INTRO + `我設計了訪談大綱，請幫我檢查：
1. 問題是否開放式？
2. 追問設計是否合理？
3. 順序是否流暢（從簡單到深層）？
4. 倫理考量是否足夠？
5. 給我具體修改建議。

【貼上你的訪談大綱】`,
    experiment: TOOL_CHECK_INTRO + `我設計了一個實驗，請幫我檢查：
1. 自變項與依變項的操作型定義清楚嗎？
2. 控制變項有遺漏嗎？
3. 實驗流程有邏輯漏洞嗎？
4. 倫理考量是否足夠？
5. 給我具體修改建議。

【貼上你的實驗設計】`,
    observation: TOOL_CHECK_INTRO + `我設計了觀察紀錄表，請幫我檢查：
1. 觀察行為的定義夠具體嗎？（是外顯行為而非推測？）
2. 記錄方式來得及嗎？
3. 觀察時段和地點設定合理嗎？
4. 倫理考量是否足夠？
5. 給我具體修改建議。

【貼上你的觀察紀錄表設計】`,
    literature: TOOL_CHECK_INTRO + `我設計了文獻分析架構（依我的子類型，可能是時間軸／編碼表／框架軸線／情節結構），請幫我檢查：
1. 搜尋策略（關鍵字、篩選標準）夠精準嗎？
2. 我的分析架構（編碼類別／軸線／時序／情節單位）能回答研究問題嗎？
3. 納入／排除標準合理嗎？
4. 來源品質分級方式合適嗎？
5. 【內容/論述分析適用】編碼者一致率怎麼確保？
6. 給我具體修改建議。

【貼上你的文獻分析架構】`,
};

const GENERIC_PROMPT = `我設計了一份研究工具，請幫我檢查：
1. 有沒有不清楚的地方？
2. 設計有什麼邏輯漏洞？
3. 倫理考量足夠嗎？
4. 給我具體修改建議。

【貼上你的工具內容】`;

/* ── W10 整本計畫書 AI 檢核 Prompt（進度容錯版 — 跨方法通用） ── */
const PLAN_FULL_CHECK_PROMPT = `【建議使用 AI 的「深度思考／推理模式」】
（Gemini 的 Thinking 模式、ChatGPT 的 o1 或 Pro、Claude 的 Extended Thinking 等——選你慣用 AI 的深度推理版本。整本檢核值得多等幾分鐘。）

你是高中專題指導顧問。以下是我的整本計畫書，請注意：學生在 W10 課堂剛把第六章工具寫到雛形，「不是每章都到完成度」。我會在開頭告訴你**每章目前的進度階段**，請就「該階段該有的品質」做檢核，不要對草稿用定版的標準苛責。

【我目前的進度自評】（請學生填完再貼進來；每章從「方向／雛形／精修／定版」擇一填入）
- 第 1 章（題目／動機／問題）：___
- 第 2 章（文獻探討）：___（文獻數量：___ 篇）
- 第 3 章（研究方法）：___
- 第 4 章（變項／主題／維度）：___
- 第 5 章（研究對象／抽樣）：___
- 第 6 章（研究工具）：___ ← W10 第一節剛寫
- 第 7-13 章（執行／時程／倫理／參考文獻等）：___

【四階段定義 — AI 請依此校準回饋深度】
- 方向：只有概念句，還沒展開 → 你只檢「方向對不對」，給「該補什麼」清單
- 雛形：段落寫出來但粗糙 → 你檢「結構＋邏輯一致」，指出明顯漏洞
- 精修：內容完整但要打磨 → 你檢「精度＋論證強度」，可以挑用詞與引用
- 定版：要繳交了 → 做最後一輪挑刺

【整本檢核重點 — 跨章一致性比單章品質更重要】
這是 W10 整本檢核的核心：不是再挑一次每章的單章品質，而是檢查**章與章之間是不是邏輯通**。

1. 【方向 → 方法】第 1-3 章的研究問題，能不能用第 3 章寫的方法回答？（例：問題在問「為什麼」卻選量化問卷 → 方向跟方法不對）
2. 【方法 → 工具】第 3 章的方法跟第 6 章的工具是否一致？工具能真的測到第 4 章的變項嗎？
3. 【變項 → 工具】第 4 章每個變項，第 6 章工具裡都有對應題目／訪綱／觀察項？有沒有漏？
4. 【對象 → 抽樣 → 工具】第 5 章的對象是否能填答／受訪？工具難度跟對象的程度匹配嗎？
5. 【倫理紅線】整本（特別是第 3、6、7 章）有無倫理風險？知情同意有沒有寫進工具？
6. 【執行可行性】時程跟樣本量是否可達成？（例：要訪 30 人但時程只 2 週 = 不可行）

【回應格式】
請依「① 進度判讀（你看到我各章是哪個階段）→ ② 跨章不一致清單（哪幾章邏輯沒通）→ ③ 工具最該優先修的 3 件事（這是 W10 重點）→ ④ 課後優先補完清單」四段回。
不用替我修改，只要指出問題點與建議方向。

【以下貼上你的計畫書全本（即使是草稿、半成品都貼，並在每章開頭標註自己的進度階段）】`;





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
    literature: '請同學看你的分析架構（時間軸／編碼表／框架軸線／情節結構）。問他：架構看得懂嗎？單位／類別有沒有多餘或遺漏？能回答你的研究問題嗎？',
};

/* — ExportButton 欄位 — */
const EXPORT_FIELDS = [
    /* Step 1：第六章填具體題目 */
    { key: 'w10-entry-self-report', label: '入場自報（W9 計畫書完成度）', question: '第二~五章章節完成狀況' },
    { key: 'w10-w9-feedback-quick', label: 'W9 老師回饋快速摘要', question: '老師對 W9 計畫書第一~五章的主要建議' },
    { key: 'w10-tool-design-notes', label: '工具設計關鍵決策', question: '第六章工具設計中的 2-3 個關鍵決定' },
    /* Step 3：老師諮詢區 */
    { key: 'w10-teacher-consult', label: '老師諮詢區紀錄', question: '老師指出的主要問題 + 我修了什麼 + 想送 AI 的' },
    /* Step 4：AI 工作坊 */
    { key: 'w10-ai-mode', label: 'AI 使用模式', question: '🎓 教學型（不知怎麼設計題目請示範）/ 🥊 驗收型（有題目初稿請找毛病）' },
    { key: 'w10-ai-dialog-submission', label: 'AI 完整對話繳交方式（必填）', question: 'A 私人註解 / B 文件上傳並貼連結' },
    /* Step 2：七到十三章 + AIRED + 課後待補 */
    { key: 'w10-aired-record', label: 'W10 完整 AIRED 敘事', question: '本週最重要的一次 AI 互動（A-I-R-E-D 五要素）' },
    { key: 'w10-postclass-todo', label: '課後待補清單', question: '哪幾章還想再動，配 W11 老師回饋對照' },
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
    { id: 'complete', icon: '✅', label: '第二~五章完成',    desc: '計畫書五章都寫完' },
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
                            <p><strong>實際可行的兩條路（不要硬補）：</strong></p>
                            <p>① <strong className="text-[var(--danger)]">強烈建議：本節下課前找老師預約 10 min 個別諮詢</strong> — 一起決定哪幾章是「最小可動骨架」、哪幾章可以先用 AI 教學型 prompt 補。本節剩下時間先做 Step 2 方法工具書當熱身。</p>
                            <p>② <strong>不可行：</strong>50 分鐘內把 4 章都補完——這會讓你<strong>同時跑兩週份的思考</strong>，效率最差，工具也會長歪。</p>
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

        /* 文獻組：讀子類型（W9 計畫書勾選後同步寫入 localStorage） */
        try {
            const sub = localStorage.getItem('w10-lit-subtype') || '';
            if (sub) setLitSubtype(sub);
        } catch { /* ignore */ }
    }, []);

    const chooseLitSubtype = useCallback((id) => {
        setLitSubtype(id);
        try { localStorage.setItem('w10-lit-subtype', id); } catch { /* ignore */ }
    }, []);

    /* ── 五步驟 ──────────────────────────────────────── */

    const steps = [
        /* ─── Step 1：開場 + 第六章工作流提醒 — 第一節 15 min ─── */
        {
            title: '開場 + 第六章流程',
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
                        <details className="mt-3 rounded-[var(--radius-unified)] border border-[#FCD34D] bg-[#FFFBEB] overflow-hidden">
                            <summary className="cursor-pointer px-4 py-2.5 hover:bg-[#FEF3C7] transition-colors flex items-center gap-2">
                                <span className="text-[12px] font-bold text-[#92400E]">⚠️ 老師還沒批 / 我還沒拿到回饋——點開看怎麼辦</span>
                                <span className="ml-auto text-[10px] font-mono text-[#92400E]">▼</span>
                            </summary>
                            <div className="border-t border-[#FCD34D] p-4 bg-white">
                                <p className="text-[12px] text-[#78350F] leading-relaxed mb-3">
                                    沒回饋<strong>不能停課等</strong>——本節先用<strong>你 W9 自己寫完後最不確定的章節</strong>當「假想老師建議」，照下面 3 步走：
                                </p>
                                <ol className="list-decimal pl-5 space-y-1.5 text-[12px] text-[#78350F] leading-relaxed">
                                    <li><strong>自評最弱章節</strong>：W9 五章裡你自己最沒把握的是哪一章？把那章的弱點寫進上方欄位（例：「第四章變項定義太空，自己也不滿意」）</li>
                                    <li><strong>正常往下做 Step 2-5</strong>：今天的第六章工具設計不會被卡住</li>
                                    <li><strong>回饋拿到後</strong>：到「Step 6 繳交確認」欄位旁有「W11 拿到回饋對照」的提示，那時再回頭修正本節做的決定</li>
                                </ol>
                                <p className="text-[11px] text-[#92400E] italic mt-3">
                                    💡 老師那邊：批改完會在 Classroom 通知，你可以隨時刷新查看。
                                </p>
                            </div>
                        </details>
                    </div>

                    {/* Step 1 開場 */}
                    <div>
                        <p className="text-[14px] text-[var(--ink-mid)] leading-relaxed max-w-[720px]">
                            W9 你已完成計畫書第一~五章雛形（即使有些章是草稿也算）。本節 50 分鐘專心做一件事：<strong className="text-[var(--ink)]">把計畫書 1-5 章補完 + 第六章填具體題目</strong>。
                        </p>
                        <div className="w7-notice w7-notice-gold">
                            🎯 <strong>本節目標：計畫書 1-5 章定稿 + 第六章「填具體題目」</strong>（不是工具實體——實體 W11 第一節做）。內容寫在 <strong>計畫書</strong> 上，網頁只記過程紀錄與 AIRED。
                        </div>
                    </div>

                    {/* 🤝 1-4 人分章工作流（第六章工具設計） */}
                    <div className="p-5 rounded-[var(--radius-unified)] border-2 border-[#0EA5E9] bg-[#F0F9FF] max-w-[720px]">
                        <p className="text-[14px] font-bold text-[#075985] mb-2">🤝 第六章工具設計分工（看你的隊型）</p>
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
                                            <li><strong>D 倫理＋文獻檢查</strong>：工具不踩倫理紅線、跟第二章文獻對得上</li>
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
                    <div className="bg-white border-2 border-[var(--accent)] rounded-[var(--radius-unified)] p-5 max-w-[720px]">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <span className="text-[10px] font-mono font-bold bg-[var(--accent)] text-white px-2 py-0.5 rounded-[3px]">第六章</span>
                            <span className="font-bold text-[14px] text-[var(--ink)]">打開 計畫書第六章填題目，對照 Step 2 工具書寫</span>
                        </div>
                        <p className="text-[12px] text-[var(--ink-light)] leading-relaxed">
                            這節只在紙上設計題目；做成 Google Form／紙本訪綱／印觀察表是 W11 的事。
                        </p>
                    </div>

                    {/* ▶ 下一頁預告：Step 2 工具書自學教案 */}
                    <div className="w7-notice w7-notice-gold">
                        ▶ <strong>下一頁 Step 2：工具書自學教案</strong>——5 法 tab 切換 + 4 區塊（題型結構／設計原則／獨家陷阱／完整範例）。看完那頁，回 計畫書第六章寫題目就有方向。
                    </div>
                </div>
            ),
        },

        /* ─── Step 2：方法工具書（跳轉到獨立頁面） ─── */
        {
            title: '方法工具書',
            icon: '📚',
            content: (
                <div className="space-y-8 prose-zh">
                    <p className="text-[14px] text-[var(--ink-mid)] leading-relaxed max-w-[720px]">
                        工具書是<strong className="text-[var(--ink)]">跨週使用的速查手冊</strong>——獨立放在「研究工具庫」下，含 V→R→F 三大判準 + 4 集老師親拍影片 + 5 法 4 區塊（題型／原則／常見錯誤／完整範例）+ AI 啟動 prompt。看完回計畫書第六章寫題目，寫題目卡住可隨時回去查。
                    </p>

                    {/* 跳轉到工具書頁面 */}
                    <div className="border-2 border-[var(--accent)] rounded-[var(--radius-unified)] overflow-hidden max-w-[760px]">
                        <div className="px-5 py-3 bg-[var(--accent)] text-white flex items-center gap-2">
                            <span className="text-[16px]">📚</span>
                            <span className="font-bold text-[14px]">開啟方法工具書</span>
                        </div>
                        <div className="p-5 space-y-3">
                            <p className="text-[12.5px] text-[var(--ink-mid)] leading-relaxed">
                                點下方連結到「研究工具庫」獨立頁面閱讀。<strong>建議新分頁開啟</strong>（不會打斷 W10 進度），方便邊讀邊回計畫書寫題目。
                            </p>
                            <div className="flex flex-wrap gap-2">
                                <a
                                    href="/tools/methods"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 bg-[var(--accent)] text-white px-4 py-2.5 rounded-[var(--radius-unified)] font-bold text-[13px] hover:opacity-90 transition-opacity no-underline"
                                >
                                    📚 開啟工具書（新分頁）
                                </a>
                                {(() => {
                                    const activeKey = detectedMethodId || 'questionnaire';
                                    return (
                                        <a
                                            href={`/tools/methods?method=${activeKey}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 bg-white text-[var(--accent)] border border-[var(--accent)] px-4 py-2.5 rounded-[var(--radius-unified)] font-bold text-[13px] hover:bg-[var(--paper-warm)] transition-colors no-underline"
                                        >
                                            🎯 直接到我的方法（{activeKey}）
                                        </a>
                                    );
                                })()}
                            </div>
                            <p className="text-[11px] text-[var(--ink-light)] italic leading-relaxed">
                                💡 工具書跨週都能用：W11 修工具、W12 施測卡關、W14 分析時都可以回來查。
                            </p>
                        </div>
                    </div>

                    {/* 補充方法提示卡（W8 登記過才顯示） */}
                    {w8Secondary && (
                        <div className="bg-[#ECFDF5] border border-[#10B981] rounded-[var(--radius-unified)] p-4 max-w-[720px] text-[12.5px] text-[#065F46] leading-relaxed">
                            🧩 你在 W8 登記了補充方法：<strong>{w8Secondary}</strong>。
                            <p className="mt-1.5">
                                計畫書第六章建議分節寫：「6.1 主工具（{w9Method}）」、「6.2 補充工具（{w8Secondary}）」——兩個都填到，但<strong className="text-[#064E3B]">主工具寫完整、補充工具寫骨架就好</strong>。
                            </p>
                        </div>
                    )}

                    {/* 下一步 */}
                    <div className="w7-notice w7-notice-teal">
                        ✅ 看完工具書 → 回計畫書第六章寫題目 → 進 <strong>Step 3 AI 工作坊</strong>（先用 AI 自查；老師諮詢在 Step 4）。
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
                    {/* 開場：明示可選 */}
                    <div className="p-4 rounded-[var(--radius-unified)] border-2 border-[var(--accent)] bg-[#F8F8FB] max-w-[720px]">
                        <p className="text-[14px] font-bold text-[var(--accent)] mb-1">🤖 AI 工作坊（可選 · 不用也合法）</p>
                        <p className="text-[12.5px] text-[var(--ink)] leading-relaxed">
                            把第六章題目寫到計畫書後，<strong>想試 AI 就試</strong>——驗收（找毛病）／教學（給範例）／<strong>不用 AI 全靠自己</strong> 三選一。
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

                        {/* 完整對話繳交（W10 多輪互動，必繳） */}
                        <AIDialogSubmission week="10" taskName="工具設計對話" required={true} />
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
                            <p>⑤ 回座位修題目，把老師的回饋寫進下方 ThinkRecord</p>
                        </div>
                    </div>

                    <div className="bg-[#FFFBEB] border-l-4 border-[#D97706] rounded-r-[6px] p-3 text-[12px] text-[#92400E] leading-[1.85] max-w-[760px]">
                        💡 <strong>為什麼用老師諮詢取代自查？</strong>學生看自己題目都覺得 OK——盲區大。老師有經驗，能挑出你看不到的問題。隨機抽組會讓你準備充分。
                    </div>

                    {/* ThinkRecord 紀錄老師回饋 */}
                    <ThinkRecord
                        dataKey="w10-teacher-consult"
                        prompt="諮詢後的紀錄"
                        scaffold={[
                            '老師指出的主要問題：（題號 + 老師回饋）',
                            '我修了什麼：（具體修改）',
                            '還沒解決、想送 AI 的：（這是 Step 4 AI 工作坊的入口）',
                        ]}
                    />

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
                    <p className="text-[14px] text-[var(--ink-mid)] leading-relaxed max-w-[720px]">
                        本週任務：把第七到十三章補完，整本繳到 <strong className="text-[var(--ink)]">Google Classroom</strong>。下週 W11 拿到老師第三次建議再修，並做<strong className="text-[var(--ink)]">實體工具轉換</strong>（題目轉成 Google Form／印紙本訪綱）。
                    </p>

                    {/* 第八章 + 第九章(三) 草稿備註（給學生看的） */}
                    <div>
                        <div className="bg-[#FFFBEB] border-l-4 border-[#D97706] rounded-r-[8px] p-4 mb-3 max-w-[760px]">
                            <p className="text-[13px] font-bold text-[#92400E] mb-2">📌 給你的備註</p>
                            <p className="text-[12.5px] text-[#78350F] leading-[1.85]">
                                <strong>第八章 + 第九章(三) 草稿即可——不要花太多時間</strong>。理由：你還沒做完研究、不會分析、沒看過真實數據。等 W14 跑完數據再回頭補才寫得到位。
                            </p>
                        </div>

                        <div className="bg-[#FFFBEB] border-l-4 border-[#D97706] rounded-r-[8px] p-4 mb-3 max-w-[760px]">
                            <p className="text-[13px] font-bold text-[#92400E] mb-1">⚠️ 「草稿」是什麼意思？</p>
                            <ul className="text-[12.5px] text-[#78350F] leading-[1.85] list-disc pl-5 space-y-0.5">
                                <li><strong>第八章資料分析方式</strong>——寫一句話「預計用 ___ 分析」就好（如：「Excel 算次數分布、SPSS 跑相關係數」）。<u>不需要</u>寫詳細統計步驟，你還沒看到資料長怎樣。</li>
                                <li><strong>第九章 (三) 可能的限制與改進</strong>——寫 1-2 條你<u>現在就想得到</u>的（如：「樣本只有本校、無法推論」）。其他要等做完才知道，<u>不要硬猜</u>。</li>
                            </ul>
                            <p className="text-[11.5px] text-[#92400E] italic mt-2 pt-2 border-t border-[#D97706]/30">
                                💡 草稿級別 ＝ 「我有寫，但等真的做了再修」。老師批改時會放過這兩段，不會苛責深度。
                            </p>
                        </div>

                        <div className="bg-white border border-[var(--border)] rounded-[var(--radius-unified)] overflow-hidden">
                            <div className="grid grid-cols-[60px_1fr_70px] bg-[var(--paper-warm)] border-b border-[var(--border)] text-[11px] font-mono font-bold text-[var(--ink)]">
                                <div className="px-3 py-2.5">章</div>
                                <div className="px-3 py-2.5 border-l border-[var(--border)]">內容</div>
                                <div className="px-3 py-2.5 border-l border-[var(--border)]">本節到</div>
                            </div>
                            {[
                                { ch: '七', t: '研究實施（時程／地點／流程）', stage: '草稿' },
                                { ch: '八', t: '資料分析方式（寫一句「預計用 ___」即可）', stage: '草稿' },
                                { ch: '九', t: '預期結論與貢獻（(三) 限制改進＝草稿）', stage: '雛形' },
                                { ch: '十', t: '研究倫理（抄通用＋微調）', stage: '雛形' },
                                { ch: '十一', t: '時程表 W9-W17（套模板）', stage: '雛形' },
                                { ch: '十二', t: 'AI 使用聲明（套通用）', stage: '雛形' },
                                { ch: '十三', t: '參考文獻（列 W5-W6 文獻）', stage: '雛形' },
                            ].map((r, i) => (
                                <div key={i} className="grid grid-cols-[60px_1fr_70px] border-b border-[var(--border)] last:border-b-0 text-[12.5px]">
                                    <div className="px-3 py-2.5 font-mono font-bold text-[var(--accent)]">{r.ch}</div>
                                    <div className="px-3 py-2.5 border-l border-[var(--border)] text-[var(--ink)]">{r.t}</div>
                                    <div className="px-3 py-2.5 border-l border-[var(--border)] text-[var(--ink-mid)] font-mono text-[11px]">{r.stage}</div>
                                </div>
                            ))}
                        </div>
                        <p className="text-[11.5px] text-[var(--ink-light)] italic mt-2">
                            💡 第十一章時程表照課表填、第十二章 AI 聲明貼通用版、第十三章把 W5-W6 文獻整理一下——這三章最快。
                        </p>
                    </div>

                    {/* W10 完整 AIRED */}
                    <AIREDNarrative
                        dataKey="w10-aired-record"
                        weekLabel="W10"
                    />

                    {/* 繳交驗收 + 課後待補清單 */}
                    <div>
                        <h4 className="font-serif text-[18px] md:text-[20px] font-bold text-[var(--ink)] mb-2">
                            繳交驗收 + 寫課後待補清單
                        </h4>
                        <p className="text-[13px] text-[var(--ink-mid)] leading-relaxed mb-3">
                            檢查整本計畫書 13 章都到本節要求的進度，上傳 Google Classroom W10 作業區。寫一份「課後待補清單」——你自己知道哪些章還粗、哪幾題還想動的，記下來，W11 拿到老師回饋時可以對照。
                        </p>
                        <ThinkRecord
                            dataKey="w10-postclass-todo"
                            prompt="課後待補清單（你自己知道哪幾章還想再動）"
                            placeholder={'例：\n第七章流程還沒寫完，等 W11 確定工具實體後再補\n第八章資料分析方式現只寫一句「預計用 Excel」，等 W14 看到數據再展開\n第九章(三) 限制改進現只寫一條，等 W15 結論時再補\n第十章倫理「不傷害」這條我還不確定要怎麼寫'}
                            scaffold={['還想動的章節：要做什麼（為什麼）']}
                            rows={5}
                        />
                    </div>

                    <div className="w7-notice w7-notice-teal">
                        ✅ 整本繳交完成 → W11 第一節讀老師 GC 回饋 → 修星號項 → 拿模板填工具實體。
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
                    <p className="text-[14px] text-[var(--ink-mid)] leading-relaxed max-w-[720px]">
                        本節最後一段：把整本計畫書匯出資料、確認 GC 已上傳，讀 W11 預告。<strong className="text-[var(--ink)]">老師會在 W11 上課前把整本檢核回饋發到 GC（含★星號等級）</strong>——你下週進教室第一件事就是讀回饋。
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

                    <ExportButton
                        weekLabel="W10 計畫書整本"
                        fields={EXPORT_FIELDS}
                    />

                    {/* W11 預告（新流程：第一節工具實體 + 第二節 Pilot+倫理+施測） */}
                    <div className="bg-[var(--ink)] border-l-4 border-[var(--danger)] p-5 md:p-6 rounded-r-lg text-white shadow-xl">
                        <div className="flex items-center gap-2 mb-3">
                            <Users size={20} className="text-[var(--danger)]" />
                            <span className="font-mono text-[11px] font-bold tracking-[0.2em] text-[var(--danger)] uppercase">W11 預告 · 工具實體 × 跨班 Pilot × 倫理 × 施測啟動</span>
                        </div>
                        <div className="font-bold text-[17px] md:text-[18px] mb-3 leading-tight">
                            下週兩節分明：第一節做工具實體、第二節做跨班 Pilot
                        </div>
                        <p className="text-[13px] text-white/85 leading-[1.9] mb-3">
                            <strong className="text-white">第一節（50 min）</strong>：讀老師 GC 回饋 → 修星號項 → 拿模板填**工具實體完整版**（依方法：問卷／訪綱／實驗／觀察／文獻分析架構）。
                        </p>
                        <p className="text-[13px] text-white/85 leading-[1.9] mb-3">
                            <strong className="text-white">第二節（50 min）</strong>：跨班 Pilot 互測 20 min（座位圖配對）→ 雙向紀錄 5 min → 倫理快速 10 min → 施測啟動 10 min。
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
                title="計畫書 · "
                accentTitle="整本定稿"
                subtitle="W10 = 把計畫書寫到定稿。第一節：方法工具書（含 4 集教學影片）+ 在計畫書第六章寫題目。第二節：AI 工作坊自查 → 老師諮詢區把關 → 七到十三章補完 → 整本繳到 GC。下週 W11 拿到老師第三次建議再修工具，並把題目轉成施測載具（Google Form／紙本）+ 跨班 Pilot。"
                chain="計畫書骨架立起來了——但工具細節還沒寫到能執行的程度。這週把訪綱／問卷題／實驗流程寫到位。"
                meta={[
                    { label: '第一節 ① + ②', value: '開場 + 第六章流程提醒 → 工具書自學教案（5 法 4 區塊）→ 回計畫書 寫題目' },
                    { label: '第二節 ③ + ④', value: '七到十三章 × 整本繳交 → 繳交確認 + W11 預告' },
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
