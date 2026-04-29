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

/* — 文獻分析法 4 子類型（對齊 W9 計畫書第一章勾選） — */
const LIT_SUBTYPES = [
    {
        id: 'history',
        label: '② 歷史分析',
        icon: '📜',
        defn: '用史料推論過去事件的脈絡、原因、演變',
        deliverable: '時間軸 + 關鍵事件清單 + 事件因果鏈',
        archExample: '1945 → 接收 → 1947 衝突 → 1949 清鄉，標註事件間的因果鏈',
        steps: [
            'Step 1：建立時間軸（依年份／事件排列）',
            'Step 2：標註關鍵事件（哪些是轉折點？）',
            'Step 3：推論事件間的因果關係',
            'Step 4：對照不同史料檢驗推論',
            'Step 5：（如有）寫出歷史敘事段落',
        ],
        templateUrl: 'https://docs.google.com/spreadsheets/d/1vvtTwR2_9F293I0GozYZc6zsGluTcfIY1NlHb2TpdgA/copy',
        templateName: '05a_文獻_歷史分析_工具',
    },
    {
        id: 'content',
        label: '③ 內容分析',
        icon: '📊',
        defn: '統計文本中的詞頻、類別、主題比例（量化為主）',
        deliverable: '編碼表（類別 × 操作型定義 × 計數單位）+ 雙人編碼一致率 ≥80%',
        archExample: '主角性別（男/女/其他）× 職業類型（專業/家庭/無）× 年份',
        steps: [
            'Step 1：訓練編碼員（2 人以上，最好是組員互相）',
            'Step 2：雙人獨立編碼 10–20% 樣本',
            'Step 3：計算編碼者一致率（≥80% 才正式編碼）',
            'Step 4：完成全樣本編碼',
            'Step 5：統計結果（次數／比例／關聯）',
        ],
        templateUrl: 'https://docs.google.com/spreadsheets/d/1C_McYlh5zqyS216cAdSvorMzOZ4U8W56_bQFpYHlEdY/copy',
        templateName: '05b_文獻_內容分析_工具',
    },
    {
        id: 'discourse',
        label: '④ 論述分析',
        icon: '🗣️',
        defn: '解讀文本背後的意識形態、話語策略、權力關係',
        deliverable: '框架／軸線分類表 + 話語策略清單（誰說／為誰說／怎麼說）',
        archExample: '「民主」的兩條軸線：自由 vs 平等、個人 vs 集體；用哪種修辭讓某軸線看起來更自然',
        steps: [
            'Step 1：通讀標註代表性段落',
            'Step 2：用架構（軸線／框架）分類段落',
            'Step 3：辨識話語策略（誰在說／為誰說／怎麼說）',
            'Step 4：歸納意識形態模式',
            'Step 5：（如有）對比不同文本的論述差異',
        ],
        templateUrl: 'https://docs.google.com/spreadsheets/d/1p4RCHe_uXwGs0NkwLoz_7XOrmAX35d3mhad7DmxBQjQ/copy',
        templateName: '05c_文獻_論述分析_工具',
    },
    {
        id: 'narrative',
        label: '⑤ 敘事分析',
        icon: '📖',
        defn: '分析故事的結構、角色、敘事聲音與模式',
        deliverable: '情節結構圖 + 角色功能表 + 敘事聲音標註',
        archExample: '開端／衝突／轉折／結局；受害者 vs 加害者立場切換；第一／第三人稱',
        steps: [
            'Step 1：拆解每則故事的情節結構（開端／衝突／轉折／結局）',
            'Step 2：標註角色功能（推動者／反對者／旁觀者）',
            'Step 3：比對敘事模式的異同',
            'Step 4：歸納常見模式',
            'Step 5：（如有）解讀模式背後的文化意涵',
        ],
        templateUrl: 'https://docs.google.com/spreadsheets/d/1h5qymclzSox-t-gKvjL9iU8d48N4ORMxcPFX2hkQ70g/copy',
        templateName: '05d_文獻_敘事分析_工具',
    },
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
    /* Step 1：入場 + 工具設計 */
    { key: 'w10-entry-self-report', label: '入場自報（W9 docx 完成度）', question: '第二~五章章節完成狀況' },
    { key: 'w10-w9-feedback-quick', label: 'W9 老師回饋快速摘要', question: '老師對 W9 計畫書第一~五章的主要建議' },
    { key: 'w10-tool-design-notes', label: '工具設計關鍵決策', question: '第六章工具設計中的 2-3 個關鍵決定' },
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
    const [w8Secondary, setW8Secondary] = useState(''); // W8 補充方法（label 字串）
    const [detectedMethodId, setDetectedMethodId] = useState('');
    const [litSubtype, setLitSubtype] = useState(''); // 文獻組 4 子類型 id
    const [showLessonMap, setShowLessonMap] = useState(false);

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
                            W9 你已完成計畫書第一~五章雛形（即使有些章是草稿也算）。本節 50 分鐘專心做一件事：<strong className="text-[var(--ink)]">把第六章（工具本體）寫到「主架構」</strong>。
                        </p>
                        <div className="w7-notice w7-notice-gold">
                            🎯 <strong>本節目標：第六章工具「主架構」（不是定稿）。</strong>結構完整 + 主要欄位有內容即可，<strong>W11 Pilot 後再修</strong>——這就是 Pilot 的目的。
                        </div>
                        <div className="bg-[var(--paper-warm)] border border-[var(--border)] rounded-[var(--radius-unified)] p-4 max-w-[720px] mt-3">
                            <p className="text-[12.5px] font-bold text-[var(--ink)] mb-2">📐 「主架構」量化標準（依方法）</p>
                            <ul className="text-[12px] text-[var(--ink-mid)] leading-[1.85] space-y-1 list-disc pl-5">
                                <li><strong>📋 問卷</strong>：開場 + 基本資料 + <strong>每變項先寫 2-3 題粗稿</strong>（不是 5 題精修）+ 結尾</li>
                                <li><strong>🎤 訪談</strong>：開場 + 暖身 + <strong>5 個大問題粗稿</strong>（追問先想 1 個）+ 收尾</li>
                                <li><strong>🧪 實驗</strong>：自變項／依變項操作定義 + 控制變項 3+ + <strong>流程 Step 1-5 骨架</strong>（細節 W11 修）</li>
                                <li><strong>👀 觀察</strong>：行為操作定義 ×3 + <strong>紀錄表欄位骨架</strong> + 時段地點</li>
                                <li><strong>📚 文獻</strong>：分析架構主軸（時間軸／編碼表／軸線／情節結構選一）+ <strong>3-5 個分析單位</strong>（內容/論述後續再補一致率測試）</li>
                            </ul>
                            <p className="text-[11.5px] text-[var(--ink-light)] italic mt-2 pt-2 border-t border-[var(--border)]">
                                💡 不要追求 W10 就寫到精修——50 分鐘做不到。寫到「結構出來、主欄位有東西」就推到 W11，那時 Pilot 會幫你抓細節。
                            </p>
                        </div>
                    </div>

                    {/* 🤝 1-4 人分章工作流（第六章工具設計） */}
                    <div className="p-5 rounded-[var(--radius-unified)] border-2 border-[#0EA5E9] bg-[#F0F9FF] max-w-[720px]">
                        <p className="text-[14px] font-bold text-[#075985] mb-2">🤝 第六章工具設計分工（看你的隊型）</p>
                        <p className="text-[12.5px] text-[#0C4A6E] leading-relaxed mb-3">
                            工具是一份大家共寫——但分工要清楚不要全擠著寫題目。<strong>核心三角色：主稿 / 對照 / AI 諮詢</strong>。人多就多一個倫理檢查。
                        </p>
                        <div className="grid md:grid-cols-2 gap-2 mb-3">
                            <div className="bg-white border border-[#0EA5E9]/30 rounded-[6px] p-3">
                                <p className="text-[12px] font-bold text-[#075985] mb-1">1 人組（Solo）</p>
                                <p className="text-[11.5px] text-[#0C4A6E] leading-[1.7]">
                                    自己 50 分鐘只能寫到主架構——別追求完美。寫完後找<strong>另一組同學試填</strong>（W11 Pilot 預演），他能挑出你看不到的盲點。
                                </p>
                            </div>
                            <div className="bg-white border border-[#0EA5E9]/30 rounded-[6px] p-3">
                                <p className="text-[12px] font-bold text-[#075985] mb-1">2 人組</p>
                                <ul className="text-[11.5px] text-[#0C4A6E] leading-[1.7] list-disc pl-4 space-y-0.5">
                                    <li><strong>A 主稿</strong>：寫題目／訪綱／流程</li>
                                    <li><strong>B 對照</strong>：拿 W9 三大標準 + 五錯誤類型逐題挑刺</li>
                                </ul>
                            </div>
                            <div className="bg-white border border-[#0EA5E9]/30 rounded-[6px] p-3">
                                <p className="text-[12px] font-bold text-[#075985] mb-1">3 人組</p>
                                <ul className="text-[11.5px] text-[#0C4A6E] leading-[1.7] list-disc pl-4 space-y-0.5">
                                    <li><strong>A 主稿</strong>：寫題目／訪綱／流程</li>
                                    <li><strong>B 對照</strong>：三大標準 + 錯誤類型逐題挑</li>
                                    <li><strong>C AI 諮詢</strong>：用工具 prompt 跑 AI，整理建議給組員看</li>
                                </ul>
                            </div>
                            <div className="bg-white border border-[#0EA5E9]/30 rounded-[6px] p-3">
                                <p className="text-[12px] font-bold text-[#075985] mb-1">4 人組</p>
                                <ul className="text-[11.5px] text-[#0C4A6E] leading-[1.7] list-disc pl-4 space-y-0.5">
                                    <li><strong>A 主稿</strong></li>
                                    <li><strong>B 對照</strong>：方向＋精度（W9 三大標準）</li>
                                    <li><strong>C AI 諮詢</strong></li>
                                    <li><strong>D 倫理＋文獻檢查</strong>：工具不踩倫理紅線、跟第二章文獻對得上</li>
                                </ul>
                            </div>
                        </div>
                        <p className="text-[11.5px] text-[#0C4A6E] leading-relaxed pt-2 border-t border-[#0EA5E9]/30">
                            ⏱️ <strong>時間建議</strong>：前 5 分鐘分工 → 各自 35 分鐘做 → 最後 10 分鐘聚回來互讀整合。
                        </p>
                    </div>

                    {/* 方法分流提示 — 5 種方法並排，自己的方法粗藍框強調，其他作「也認識一下」 */}
                    {(() => {
                        const ALL_TOOLS = [
                            { id: 'questionnaire', label: '📋 問卷組', out: '每個變項 3–5 題問卷題目（第四章變項 × 第六章題目）' },
                            { id: 'interview',     label: '🎤 訪談組', out: '每個主題 1 主問題 + 2–3 追問（第四章主題 × 第六章大綱）' },
                            { id: 'experiment',    label: '🧪 實驗組', out: '實驗流程 Step 1–5 + 數據記錄表（第四章變項 × 第六章流程）' },
                            { id: 'observation',   label: '👀 觀察組', out: '觀察紀錄表欄位 + 時段採樣方式（第四章維度 × 第六章紀錄表）' },
                            { id: 'literature',    label: '📚 文獻組', out: '依你 W9 計畫書勾選的子類型，產出對應的「分析架構」+「分析流程 Step 1–5」（4 子類型各不同——下方展開可選）' },
                        ];
                        return (
                            <div className="space-y-3 max-w-[720px]">
                                <div className="text-[12.5px] text-[var(--ink-mid)] leading-relaxed">
                                    📚 <strong className="text-[var(--ink)]">研究方法課的核心</strong>：5 種你都該認識——你選的方法會做、其他你會分辨。下方<strong className="text-[var(--accent)]">粗藍框</strong>是你的方法（會在第六章執行），其他是「也看一下」。
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    {ALL_TOOLS.map((t) => {
                                        const isMine = t.id === detectedMethodId;
                                        /* 對齊新 GDrive：4 個非文獻方法直接給下載 URL；文獻組由下方 4 子類型選擇器處理 */
                                        const TOOL_URL_MAP = {
                                            questionnaire: { url: 'https://docs.google.com/document/d/1tu-WF_JitJIwBZBHrrgm3MeFMDykpm_gGZoyrB4UkOI/copy',     name: '01_問卷_工具' },
                                            interview:     { url: 'https://docs.google.com/document/d/1BU6XyNxdwng6I15pwYXfRs-zwKgDDyF_EVc2T6uUCrs/copy',     name: '02_訪綱_工具' },
                                            experiment:    { url: 'https://docs.google.com/document/d/1evcQ6-97mhkhsLz4RHDEGp9P_LkjAeIKUcvusBtc0d8/copy',     name: '03_實驗_工具設計表' },
                                            observation:   { url: 'https://docs.google.com/spreadsheets/d/1QMqW2AAlc1s_gNfiY3jkFCy0CHpYz2GX9ZmgpShUm7s/copy',  name: '04_觀察紀錄表_工具' },
                                        };
                                        const myTool = TOOL_URL_MAP[t.id];
                                        return (
                                            <div
                                                key={t.id}
                                                className={
                                                    isMine
                                                        ? 'bg-white border-2 border-[var(--accent)] rounded-[var(--radius-unified)] p-4 md:col-span-2'
                                                        : 'bg-[var(--paper-warm)] border border-[var(--border)] rounded-[var(--radius-unified)] p-3 opacity-80'
                                                }
                                            >
                                                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                                                    <span className={`font-bold ${isMine ? 'text-[14px] text-[var(--ink)]' : 'text-[12.5px] text-[var(--ink-mid)]'}`}>{t.label}</span>
                                                    {isMine && (
                                                        <span className="text-[10px] font-mono font-bold bg-[var(--accent)] text-white px-2 py-0.5 rounded-[3px]">← 你選這個</span>
                                                    )}
                                                </div>
                                                <p className={isMine ? 'text-[13px] text-[var(--ink-mid)] leading-relaxed mb-3' : 'text-[11.5px] text-[var(--ink-light)] leading-[1.6]'}>
                                                    {isMine ? <><strong className="text-[var(--ink)]">本節要產出：</strong>{t.out}</> : t.out}
                                                </p>
                                                {isMine && myTool && (
                                                    <a
                                                        href={myTool.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center justify-center gap-2 bg-[var(--accent)] hover:opacity-90 text-white rounded-[8px] px-4 py-2 no-underline transition-opacity text-[12.5px] font-bold"
                                                    >
                                                        📦 開啟「{myTool.name}」副本 →
                                                    </a>
                                                )}
                                                {isMine && t.id === 'literature' && (
                                                    <p className="text-[11.5px] text-[var(--ink-light)] italic">
                                                        👇 文獻組請先到下方「4 子類型選擇器」選自己的子類型，會給對應的工具模板下載連結。
                                                    </p>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                                {!detectedMethodId && (
                                    <div className="bg-[var(--paper-warm)] border border-dashed border-[var(--border)] rounded-[var(--radius-unified)] p-3 text-[12px] text-[var(--ink-light)]">
                                        👆 未偵測到你的研究方法。可先看看 5 種長什麼樣，然後回 W9 完成方法選擇。
                                    </div>
                                )}
                            </div>
                        );
                    })()}

                    {/* 文獻組專屬：4 子類型選擇器（只當主方法是文獻分析才顯示） */}
                    {detectedMethodId === 'literature' && (
                        <div className="bg-white border-2 border-[var(--accent)] rounded-[var(--radius-unified)] p-5 max-w-[720px]">
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                                <span className="text-[10px] font-mono font-bold bg-[var(--accent)] text-white px-2 py-0.5 rounded-[3px]">文獻組專屬</span>
                                <span className="font-bold text-[14px] text-[var(--ink)]">你做的是哪一種文獻分析？</span>
                            </div>
                            <p className="text-[12.5px] text-[var(--ink-mid)] leading-relaxed mb-3">
                                <strong className="text-[var(--ink)]">「文獻分析」≠「文獻回顧」</strong>——文獻分析法是把文獻本身當「研究對象」來分析它，不是整理前人研究。請對照你 W9 計畫書第一章勾選的子類型，點選下方對應按鈕：
                            </p>
                            {/* 4 子類型按鈕 */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
                                {LIT_SUBTYPES.map((s) => {
                                    const isMine = litSubtype === s.id;
                                    return (
                                        <button
                                            key={s.id}
                                            type="button"
                                            onClick={() => chooseLitSubtype(s.id)}
                                            className={`text-left px-3 py-2.5 rounded-[8px] border-2 transition-colors ${
                                                isMine
                                                    ? 'bg-[var(--accent)] text-white border-[var(--accent)]'
                                                    : 'bg-white text-[var(--ink-mid)] border-[var(--border)] hover:border-[var(--accent)]'
                                            }`}
                                        >
                                            <span className="text-[14px] block">{s.icon} <strong className="text-[12.5px]">{s.label}</strong></span>
                                            <span className={`text-[10.5px] leading-[1.5] block mt-0.5 ${isMine ? 'text-white/85' : 'text-[var(--ink-light)]'}`}>{s.defn}</span>
                                        </button>
                                    );
                                })}
                            </div>
                            {/* 子類型選定後：顯示對應分析架構 + 流程 */}
                            {litSubtype ? (
                                (() => {
                                    const s = LIT_SUBTYPES.find(x => x.id === litSubtype);
                                    return (
                                        <div className="bg-[var(--paper-warm)] border border-[var(--border)] rounded-[var(--radius-unified)] p-4 space-y-3 text-[12.5px]">
                                            <div>
                                                <p className="font-bold text-[var(--ink)] mb-1">📦 本節要產出（第六章工具設計部分）</p>
                                                <p className="text-[var(--ink-mid)] leading-relaxed">{s.deliverable}</p>
                                                <p className="text-[11.5px] text-[var(--ink-light)] mt-1.5 italic">範例：{s.archExample}</p>
                                            </div>
                                            <div className="border-t border-[var(--border)] pt-3">
                                                <p className="font-bold text-[var(--ink)] mb-2">🔬 分析流程（第七章執行寫進去）</p>
                                                <ol className="text-[var(--ink-mid)] leading-[1.85] space-y-0.5 list-none pl-0">
                                                    {s.steps.map((step, i) => (
                                                        <li key={i}>{step}</li>
                                                    ))}
                                                </ol>
                                            </div>
                                            {/* 下載對應模板 */}
                                            <div className="border-t border-[var(--border)] pt-3 flex flex-col md:flex-row gap-2 items-stretch md:items-center justify-between">
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-[11.5px] text-[var(--ink-mid)]">📥 對應模板：</p>
                                                    <p className="text-[12px] font-bold text-[var(--ink)] truncate">{s.templateName}</p>
                                                </div>
                                                <a
                                                    href={s.templateUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center justify-center gap-2 bg-[var(--accent)] hover:opacity-90 text-white rounded-[8px] px-4 py-2 no-underline transition-opacity text-[12.5px] font-bold whitespace-nowrap"
                                                >
                                                    開啟模板副本 →
                                                </a>
                                            </div>
                                            {(s.id === 'content' || s.id === 'discourse') && (
                                                <div className="border-t border-[var(--border)] pt-3 bg-[#FEF3C7] -mx-4 -mb-4 px-4 py-3 rounded-b-[var(--radius-unified)]">
                                                    <p className="text-[11.5px] text-[#92400E] leading-relaxed">
                                                        ⚠️ <strong>{s.label}必做：</strong>找另一位組員（或同學）做雙人編碼，計算<strong>編碼者一致率</strong>。一致率 ≥80% 才能正式編碼，否則要先討論定義不一致的地方。
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })()
                            ) : (
                                <div className="bg-[var(--paper-warm)] border border-dashed border-[var(--border)] rounded-[var(--radius-unified)] p-3 text-[12px] text-[var(--ink-light)]">
                                    👆 還沒選子類型？回頭翻你的 W9 計畫書第一章——「本研究的子類型（必選一種）」那格勾的是哪個。
                                </div>
                            )}
                        </div>
                    )}

                    {/* 補充方法提示卡（W8 登記過才顯示） */}
                    {w8Secondary && (
                        <div className="bg-[#ECFDF5] border border-[#10B981] rounded-[var(--radius-unified)] p-4 max-w-[720px] text-[12.5px] text-[#065F46] leading-relaxed">
                            🧩 你在 W8 登記了補充方法：<strong>{w8Secondary}</strong>。
                            <p className="mt-1.5">
                                <strong className="text-[#064E3B]">本節 50 分鐘專注主方法第六章工具主架構</strong>——補充方法的工具設計留到課後（不要兩條線都想擠進這節，會兩邊都做不完）。
                            </p>
                            <p className="mt-1">
                                docx 第六章建議分節寫：「6.1 主工具（{w9Method}）」、「6.2 補充工具（{w8Secondary}）」——主工具寫完整、補充工具寫骨架就好。
                            </p>
                        </div>
                    )}

                    {/* 工具設計關鍵決策 */}
                    <ThinkRecord
                        dataKey="w10-tool-design-notes"
                        prompt="工具設計的 2-3 個關鍵決策（docx 寫完後在此摘要）"
                        defaultTemplate={'決策 1：\n決策 2：\n決策 3：（無就留空）'}
                        placeholder="例：問卷改用五點量表不用七點——因為高中生對中等程度辨識度有限"
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
                        工具設計完了，整本計畫書整合進來。這次 AI 檢核重點是<strong className="text-[var(--ink)]">跨章一致性</strong>——不是再挑一次每章單章品質，是看「方向（1-3 章）→ 方法（3 章）→ 變項（4 章）→ 對象（5 章）→ 工具（6 章）→ 執行（7-13 章）」之間邏輯有沒有通。
                    </p>

                    {/* 🤝 1-4 人分章工作流（整本檢核 + 定稿） */}
                    <div className="p-4 rounded-[var(--radius-unified)] border-2 border-[#0EA5E9] bg-[#F0F9FF] max-w-[720px]">
                        <p className="text-[13px] font-bold text-[#075985] mb-2">🤝 整本檢核 + 定稿分工（25 min 跑 AI、25 min 定稿）</p>
                        <div className="grid md:grid-cols-2 gap-2 text-[11.5px] text-[#0C4A6E] leading-[1.7]">
                            <div className="bg-white border border-[#0EA5E9]/30 rounded-[6px] p-3">
                                <p className="font-bold text-[#075985] mb-1">1 人組</p>
                                自己跑 AI、自己判斷、自己改。<strong>等 AI 思考時別發呆</strong>——同步先翻 W9 老師回饋還沒處理的部分。
                            </div>
                            <div className="bg-white border border-[#0EA5E9]/30 rounded-[6px] p-3">
                                <p className="font-bold text-[#075985] mb-1">2 人組</p>
                                <ul className="list-disc pl-4 space-y-0.5">
                                    <li>A 跑 AI（深度推理要等）</li>
                                    <li>B 同步整理 W9 老師回饋成清單</li>
                                    <li>AI 回來後一起判斷 → 互換修文字</li>
                                </ul>
                            </div>
                            <div className="bg-white border border-[#0EA5E9]/30 rounded-[6px] p-3">
                                <p className="font-bold text-[#075985] mb-1">3 人組</p>
                                <ul className="list-disc pl-4 space-y-0.5">
                                    <li>A 跑 AI</li>
                                    <li>B 寫採納判斷紀錄</li>
                                    <li>C 整理修改清單／同步檢查 W9 回饋</li>
                                    <li>三人一起核對最終定稿</li>
                                </ul>
                            </div>
                            <div className="bg-white border border-[#0EA5E9]/30 rounded-[6px] p-3">
                                <p className="font-bold text-[#075985] mb-1">4 人組</p>
                                <ul className="list-disc pl-4 space-y-0.5">
                                    <li>A 跑 AI</li>
                                    <li>B 寫採納判斷</li>
                                    <li>C 整理修改清單</li>
                                    <li>D 跑 W10 AIRED + 統整繳交</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* AI 檢核 Prompt（整本檢核專用，不是工具檢核） */}
                    <div>
                        <div className="text-[11px] font-mono text-[var(--ink-light)] uppercase tracking-wider mb-2">第一步：複製整本檢核 Prompt 貼到 AI</div>
                        <CopyablePrompt text={PLAN_FULL_CHECK_PROMPT} />
                        <p className="text-[11px] text-[var(--ink-light)] leading-relaxed mt-2">
                            💡 把計畫書<strong>全本（即使是草稿、半成品都貼）</strong>，並在每章開頭標註自己的進度階段（方向／雛形／精修／定版）——AI 會依此校準回饋深度。
                        </p>
                    </div>

                    {/* AI 回覆原文 + AIRED 的 A/I 前置 */}
                    <ThinkRecord
                        dataKey="w10-ai-raw-feedback"
                        prompt="AI 回覆原文（開頭先寫 A+I 兩行；貼全文沒關係；有追問也一起貼）"
                        defaultTemplate={'A: \nI: \n\n──── AI 完整回覆（以下貼上）────\n'}
                        placeholder="例：A: 我用了 ChatGPT o1 深度推理版"
                        rows={14}
                    />

                    {/* 採納判斷 */}
                    <ThinkRecord
                        dataKey="w10-ai-judge"
                        prompt="AI 建議採納判斷（逐條評估）"
                        defaultTemplate={'建議 1：AI 說\n→ 我的判斷：✅ 採納 / ❌ 不採納 / 🔶 部分採納\n→ 理由：\n\n建議 2：AI 說\n→ 我的判斷：\n→ 理由：\n\n建議 3：AI 說\n→ 我的判斷：\n→ 理由：'}
                        placeholder="例：建議 1 採納，因為原本就漏寫信效度"
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
                accentTitle="AI 協助工具精進 × 整本計畫書檢核"
                subtitle="第一節寫第六章工具到「主架構」（W11 Pilot 後再修），第二節做整本計畫書 AI 檢核（跨章一致性）+ 定稿。AI 能找文字邏輯漏洞，但真人 Pilot 留到 W11——兩週分工不重疊。"
                meta={[
                    { label: '第一節', value: '第六章工具設計 + AI 工具檢核（依進度容錯）' },
                    { label: '第二節', value: '整本計畫書 AI 檢核（跨章一致性）+ AIRED + 定稿' },
                    { label: '課堂產出', value: '第六章工具主架構 + AI 整本檢核判斷表 + 計畫書定稿' },
                    { label: '前置要求', value: 'W9 計畫書第 1-5 章雛形（含第四章變項／主題）' },
                ]}
            />
            <CourseArc items={[
                    { wk: 'W1-W4', name: '探索\n定題', status: 'past' },
                    { wk: 'W5-W6', name: '文獻搜尋\n引用寫作', status: 'past' },
                    { wk: 'W7-W8', name: '方法選擇\n組隊企劃', status: 'past' },
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
