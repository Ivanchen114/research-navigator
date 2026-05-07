import React, { useState, useCallback, useEffect } from 'react';
import CourseArc from '../components/ui/CourseArc';
import './W11.css';
import ThinkRecord from '../components/ui/ThinkRecord';
import Checklist from '../components/ui/Checklist';
import StepEngine from '../components/ui/StepEngine';
import HeroBlock from '../components/ui/HeroBlock';
import TaskCard from '../components/ui/TaskCard';
import ExportButton from '../components/ui/ExportButton';
import ResetWeekButton from '../components/ui/ResetWeekButton';
import LessonMap from '../components/ui/LessonMap';
import { readRecords } from '../components/ui/ThinkRecord';
import { W11Data } from '../data/lessonMaps';
import {
    CheckCircle2,
    Bot,
    Copy,
    Check,
    Plane,
    Download,
    Star,
    Map,
} from 'lucide-react';

/* ══════════════════════════════════════
 *  資料常數
 * ══════════════════════════════════════ */

/* — 倫理四問 — */
const ETHICS_QUESTIONS = [
    {
        id: 'consent',
        icon: '📝',
        title: '知情同意',
        color: '#2563EB',
        question: '受訪者知道這是什麼研究嗎？你打算怎麼告知他們？',
        hint: '問卷開頭 or 訪談前要先說明：研究目的、所需時間、資料用途。',
        examples: [
            '問卷開頭放灰色框：「本研究 ___，預計花 5 分鐘，匿名」',
            '訪談前先口頭說明 + 問「可以錄音嗎？」（要錄音必須口頭同意）',
            '觀察非參與式（對方不知）→ 事後告知 + 提供「撤回資料」選項',
            '實驗開始前一週發同意書給家長簽（涉及 18 歲以下受試者）',
        ],
    },
    {
        id: 'privacy',
        icon: '🔐',
        title: '保密性',
        color: '#7C3AED',
        question: '你的工具有沒有收集可辨識個人身份的資料（學號、電話）？',
        hint: '有 → 必要嗎？不必要就刪掉。必要就說明保密措施。',
        examples: [
            '姓名欄改編號：問卷 S001、S002 / 訪談 I01、I02 / 實驗 P01、P02',
            '不收學號／電話／IG 帳號 — 高中研究幾乎不需要這些',
            '逐字稿用代號 A、B、C 替代真名（包含提到的第三人也要改）',
            '原始檔案存個人雲端資料夾（非公開），共筆只放分析後的表',
        ],
    },
    {
        id: 'harm',
        icon: '🛡️',
        title: '不傷害',
        color: '#DC2626',
        question: '你的題目有沒有涉及敏感領域（情緒、家庭、感情、身體、成績）？',
        hint: '有敏感題 → 可以保留，但要有應對方式（如：加上「如不方便可跳過」）。',
        examples: [
            '敏感題加「如不方便可跳過」按鈕（Google Form 設「不必填」）',
            '訪談給「我可以不回答」的口頭暗號（如：說「下一題」就跳過）',
            '不問太具體：「你家經濟狀況？」→ 改「你覺得補習費對家裡有壓力嗎？」',
            '事後給「結果出爐前可撤回我的資料」的窗口（提供 email 或截止日）',
        ],
    },
    {
        id: 'voluntary',
        icon: '🤝',
        title: '自願性',
        color: '#059669',
        question: '你打算怎麼招募受訪者？有沒有隱性壓力的可能？',
        hint: '拜託朋友填 → 他們很難拒絕。要明確說「不填完全沒關係」。',
        examples: [
            '招募文宣加「不參加完全沒影響、不會被記名」一句',
            '禁用「拜託我」「幫我一下」這類請求語（製造義務感）',
            '不收班級全員（讓人覺得「沒填會被注意」），改公開徵求願意者',
            '對熟人：先說「真的不方便就跟我說」+ 給對方一週時間決定',
        ],
    },
];

/* — 知情同意書 AI 審查 Prompt（5 法通用） — */
const CONSENT_PROMPT = `我是高中研究方法課的學生。我的研究方法是：[問卷／訪談／實驗／觀察／文獻分析]（擇一填入）

以下是我寫給研究對象（受訪者／受試者／受觀察者）讀的知情同意說明。請幫我：

1. 從「16-18 歲高中生」的角度閱讀——找出看不懂或容易誤解的詞彙與句子
2. 找出任何可能讓對方感到壓力、不舒服、或產生隱性義務感的語氣
3. 檢查必要資訊有沒有齊：研究目的、所需時間、資料用途、保密措施、可隨時退出、退出不影響權益
4. 依我的方法給出特別注意事項：
   - 問卷：填答時間是否合理？是否有敏感題需要加「不方便可跳過」
   - 訪談：錄音／錄影同意是否清楚？事後逐字稿處理方式
   - 實驗：實驗會做什麼介入要說清楚（不能含糊「參加一個活動」）；可能的不適感要事先告知
   - 觀察：對方有沒有意識到自己被觀察？非參與式如果不告知對方，倫理風險要怎麼補（如：事後告知 + 可撤回資料）
5. 幫我改寫成更清楚、更友善的版本（保留所有必要資訊）

以下是我的知情同意說明：
【貼上你的知情同意說明】

⚠️ 補充：如果你是【文獻分析法】學生——你的「對象」是公開出版的文獻、不是活人，**通常不需要寫知情同意書**。這一段你可以跳過，但仍要在第十章倫理寫「資料來源是否合法取得、引用是否合理、是否避免抹黑作者」。`;

/* — 5 法觀察清單（強迫找出最弱的 1 件事；不允許「沒發現」）— */
const PILOT_OBSERVATION_CHECKLIST = {
    questionnaire: {
        label: '📋 問卷組觀察清單',
        items: [
            '對方反問「這是什麼意思」「你是想問 ___ 嗎」？',
            '對方有沒有自言自語、停頓超過 5 秒？',
            '哪題對方花最久？哪題跳過後回頭重看？',
            '對方填完哪題最不確定（會回頭改）？',
            '你預估時間 vs 實際時間差超過 30%？',
            '對方填完第一句話是什麼（驚訝／放鬆／困惑）？',
        ],
    },
    interview: {
        label: '🎤 訪談組觀察清單',
        items: [
            '哪題你問完想撤回（自己覺得問得不好）？',
            '哪題你追問追到尬／不知道下一句問什麼？',
            '哪題對方一句話就答完（封閉化失敗）？',
            '哪題對方停頓最久／笑得最尷尬／轉移話題？',
            '錄音重聽哪段你最想剪掉？',
            '預估訪談時長 vs 實際差很多？',
        ],
    },
    experiment: {
        label: '🧪 實驗組觀察清單（架設圖被審）',
        items: [
            '對方挑出哪個變項你以為控住但其實沒控（例：時段、教室、指導語字數）？',
            '對方覺得自變項操作型定義有歧義／依變項測量不夠精確的地方？',
            '對方覺得流程 Step 1-5 哪一步銜接不順／指導語哪句聽不懂？',
            '對方覺得 4 週內做不完哪一段？樣本量 vs 時程不對等？',
            '對方覺得分組方式有選擇偏誤／受試者間差異沒處理的地方？',
        ],
    },
    observation: {
        label: '👀 觀察組觀察清單（紀錄表 + 計畫被審）',
        items: [
            '對方覺得哪兩個類別界線模糊（A 也對、B 也對）？',
            '對方覺得操作型定義「正例 vs 反例」哪一條的灰色地帶最大？',
            '對方覺得時間取樣頻率（如 5 min 一筆）對你的觀察人數來說來不來得及？',
            '模擬分類測試中，對方歸的類跟你預期不一致的情境是哪一個？為什麼？',
            '對方覺得倫理保護（受觀察者是否知道、匿名、可否撤回）漏了什麼？',
            '對方覺得你的觀察情境（時段／地點／對象）能不能真的回答你的研究問題？',
        ],
    },
    literature: {
        label: '📚 文獻組觀察清單（架構被讀）',
        items: [
            '對方讀完樣本能不能用自己的話講出你的分析架構在做什麼？',
            '對方依你架構分類，能歸納出你預期的模式嗎？還是亂歸？',
            '【內容/論述】對方獨立編碼跟你比，不一致率超過 20%？',
            '對方覺得你的分析單位（句子？段落？事件？）邊界模糊的地方？',
            '對方覺得你的類別／軸線哪幾個概念定義太抽象？',
        ],
    },
};

/* — 「我們都沒發現」AI 反向質問 prompt（觸發鷹架） — */
const NO_FINDING_PROMPT = `我是高中研究方法課學生，我做完 Pilot 預試但全組覺得「沒發現問題」。請從以下三件事審我：

1. 你覺得我們可能漏看了什麼？
2. Pilot 對方是同學朋友、可能因為禮貌而掩蓋什麼問題？
3. 給我 3 個我可能沒注意但 16-18 歲高中生在這份工具上常卡的點。

我的研究方法：[問卷／訪談／實驗／觀察／文獻分析]
我的工具內容：
[貼上你的題目／訪綱／架設圖／紀錄表／分析架構]

我的 Pilot 過程紀錄：
[貼上你 W11 寫的 partner / findings / as-subject 三格]`;

/* — Pilot Test 方法分流指示（座位表 1 對 1 跨方法配對；對方依你的工具型態做不同事） — */
const PILOT_INSTRUCTIONS = {
    questionnaire: {
        label: '📋 問卷組',
        format: '對方填你的問卷',
        steps: [
            '把問卷（紙本或螢幕）給對方，自己當「研究者」在旁不引導',
            '對方獨立填答，你計時（記錄開始 / 結束時間）',
            '對方填完口頭回饋 2 分鐘：哪題不清楚？哪個選項選不出來？誤解了哪題？',
            '【你的紀錄】寫下對方點出的卡點 + 計時數據',
        ],
    },
    interview: {
        label: '🎤 訪談組',
        format: '對方當受訪者，你做訪談',
        steps: [
            '你當訪談者，對方當受訪者；跑訪綱主要 3-4 題（不用全跑完）',
            '全程錄音（取得對方同意，模擬正式訪談），自己記計時',
            '訪完 2 分鐘口頭回饋：哪題封閉？哪個追問太尬？哪題讓對方不舒服？',
            '【你的紀錄】訪綱卡點 + 對方反應 + 自己訪談時最不順的地方',
        ],
    },
    experiment: {
        label: '🧪 實驗組',
        format: '對方審你的架設圖（不跑實驗）',
        steps: [
            '把你的實驗架設圖攤開（變項控制表 + 流程 Step 1-5 + 分組方式 + 指導語草稿）',
            '對方依四問審你：(1) 除自變項外其他真的都一樣？(2) 怎麼控制先前差異？(3) 測量客觀？(4) 4 週內做得完？',
            '對方再讀你的指導語：清楚到 30 個受試者都會懂嗎？',
            '【你的紀錄】對方點出的漏洞 + 自己看圖時新發現的問題',
        ],
    },
    observation: {
        label: '👀 觀察組',
        format: '對方審你的紀錄表 + 觀察計畫（不跑觀察）',
        steps: [
            '把你的紀錄表 + 操作型定義（每個類別的「正例 vs 反例」）+ 觀察情境計畫攤開給對方',
            '對方依四問審你：(1) 類別之間有沒有重疊或漏掉？(2) 正反例有沒有讓人會誤判的灰色帶？(3) 時間取樣 5 min 一筆對 30 人跟得上嗎？(4) 倫理保護（知情同意/匿名）夠嗎？',
            '模擬分類測試：你口頭描述 3 個情境（如「S05 拿著手機看 8 秒、表情笑」），對方依你紀錄表歸類；對照你預期的歸類差多少',
            '【你的紀錄】類別失靈處 + 對方挑出的灰色地帶 + 模擬分類不一致的點',
        ],
    },
    literature: {
        label: '📚 文獻組',
        format: '對方依你的架構試讀 1 份樣本',
        steps: [
            '把你的分析架構（依子類型：時間軸／編碼表／軸線／情節結構）+ 1-2 篇樣本文獻給對方',
            '【內容/論述分析】對方依你編碼表獨立編碼 1 篇，事後對照雙方編碼算一致率（≥80% 才算過關）',
            '【歷史/敘事分析】對方依你架構讀完，回答：單位看得懂嗎？能歸納出你預期的模式嗎？',
            '【你的紀錄】定義模糊處 + 雙人不一致的編碼點 + 對方點出的盲點',
        ],
    },
};


/* — 工具實體模板（與 W9/W10 同步；W11 第一節「把題目轉成施測載具」用）— */
const INSTRUMENT_TEMPLATES = {
    questionnaire: { url: 'https://docs.google.com/document/d/1tu-WF_JitJIwBZBHrrgm3MeFMDykpm_gGZoyrB4UkOI/copy',    name: '01_問卷_工具',          tip: '把 W10 的題目貼進去 → 轉 Google Form 或印紙本' },
    interview:     { url: 'https://docs.google.com/document/d/1BU6XyNxdwng6I15pwYXfRs-zwKgDDyF_EVc2T6uUCrs/copy',    name: '02_訪綱_工具',          tip: '貼題目 → 印成訪綱卡片，方便訪談時翻看' },
    experiment:    { url: 'https://docs.google.com/document/d/1evcQ6-97mhkhsLz4RHDEGp9P_LkjAeIKUcvusBtc0d8/copy',    name: '03_實驗_工具設計表',     tip: '把架設圖、流程、指導語逐字稿、紀錄表全填進去' },
    observation:   { url: 'https://docs.google.com/spreadsheets/d/1QMqW2AAlc1s_gNfiY3jkFCy0CHpYz2GX9ZmgpShUm7s/copy', name: '04_觀察紀錄表_工具',     tip: '依操作型定義設定欄位 → 印多份備用' },
};

/* — 文獻分析法 4 子類型工具模板（W11 文獻組依子類型挑） — */
const LIT_SUBTYPE_TEMPLATES = [
    { id: 'history',   icon: '📜', label: '② 歷史分析', deliverable: '時間軸 + 事件因果鏈',         url: 'https://docs.google.com/spreadsheets/d/1vvtTwR2_9F293I0GozYZc6zsGluTcfIY1NlHb2TpdgA/copy', name: '05a_文獻_歷史分析_工具' },
    { id: 'content',   icon: '📊', label: '③ 內容分析', deliverable: '編碼表 + 雙人一致率 ≥80%',     url: 'https://docs.google.com/spreadsheets/d/1C_McYlh5zqyS216cAdSvorMzOZ4U8W56_bQFpYHlEdY/copy', name: '05b_文獻_內容分析_工具' },
    { id: 'discourse', icon: '🗣️', label: '④ 論述分析', deliverable: '軸線分類表 + 話語策略清單',     url: 'https://docs.google.com/spreadsheets/d/1p4RCHe_uXwGs0NkwLoz_7XOrmAX35d3mhad7DmxBQjQ/copy', name: '05c_文獻_論述分析_工具' },
    { id: 'narrative', icon: '📖', label: '⑤ 敘事分析', deliverable: '情節結構圖 + 角色功能表',       url: 'https://docs.google.com/spreadsheets/d/1h5qymclzSox-t-gKvjL9iU8d48N4ORMxcPFX2hkQ70g/copy', name: '05d_文獻_敘事分析_工具' },
];

/* — Helper：列工具模板（排除指定 method）統一處理 4 主方法 + 4 文獻子類兩個資料源 — */
const listToolTemplates = ({ excludeMain = [], includeLit = true } = {}) => ({
    main: Object.entries(INSTRUMENT_TEMPLATES)
        .filter(([id]) => !excludeMain.includes(id))
        .map(([id, t]) => ({ id, ...t })),
    lit: includeLit ? LIT_SUBTYPE_TEMPLATES : [],
});

/* — ExportButton 欄位 — */
const EXPORT_FIELDS = [
    /* Step 1：入場 + 讀回饋 + 修星號項 */
    { key: 'w11-w10-feedback-quick', label: 'W10 老師回饋快速摘要', question: '老師對 W10 整本計畫書的主要建議（含星號等級）' },
    { key: 'w11-star-fix', label: '星號項修補紀錄', question: '老師標★的項目我打算怎麼補？' },
    /* Step 2：工具實體本體留在學生手上，繳交時隨計畫書一起上傳 GC（這裡不收欄位）*/
    /* Step 3：Pilot 互測 */
    { key: 'w11-pilot-partner', label: 'Pilot Test 對象', question: '座位表配對到誰？對方是哪個方法？' },
    { key: 'w11-pilot-findings', label: 'Pilot Test 發現', question: '當研究者時對方的回饋 + 你自己觀察到的工具卡點' },
    /* Step 4：倫理 + 施測啟動 */
    { key: 'w11-tool-final-revision', label: '工具第二輪修正', question: '根據 Pilot 回饋要改載具的哪幾點' },
    { key: 'w11-ethics-self-review', label: '倫理四原則 · 小組實踐紀錄', question: '對照四原則（知情同意/保密/不傷害/自願）我們組的研究分別怎麼做' },
];

/* ══════════════════════════════════════
 *  內部元件
 * ══════════════════════════════════════ */

const CopyablePrompt = ({ text, label }) => {
    const [copied, setCopied] = useState(false);
    const handleCopy = useCallback(() => {
        navigator.clipboard.writeText(text).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }).catch(() => {
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
        <div className="w11-prompt-box">
            <div className="w11-prompt-header">
                <span className="w11-prompt-label">
                    <Bot size={14} /> {label || 'AI Prompt — 複製後貼到 AI 對話窗'}
                </span>
                <button onClick={handleCopy} className="w11-copy-btn">
                    {copied ? <><Check size={12} /> 已複製</> : <><Copy size={12} /> 複製</>}
                </button>
            </div>
            <pre className="w11-prompt-text">{text}</pre>
        </div>
    );
};

/* ══════════════════════════════════════
 *  老師秘密審查按鈕（⚖ 連續點 5 次觸發）
 * ══════════════════════════════════════ */

const TEACHER_OPTIONS = ['陳育詮老師', '陳詩雯老師'];

const TeacherApprovalBadge = () => {
    const [clicks, setClicks] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [approval, setApproval] = useState(() => {
        try {
            const raw = localStorage.getItem('w11-teacher-approval');
            return raw ? JSON.parse(raw) : null;
        } catch { return null; }
    });

    const handleSecretClick = () => {
        const next = clicks + 1;
        if (next >= 10) {
            setShowModal(true);
            setClicks(0);
        } else {
            setClicks(next);
            setTimeout(() => setClicks(0), 2000);
        }
    };

    const confirmApproval = (name) => {
        const ts = new Date();
        const record = {
            approved: true,
            teacher: name,
            timestamp: ts.toISOString(),
        };
        try { localStorage.setItem('w11-teacher-approval', JSON.stringify(record)); } catch {}
        // 同步寫進 rib_think_records，讓 ExportButton 把蓋章紀錄匯到 docx
        try {
            const STORAGE_KEY = 'rib_think_records';
            const records = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
            records['w11-teacher-stamp'] = `已通過：${name}（${ts.toLocaleString('zh-TW')}）`;
            localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
        } catch {}
        setApproval(record);
        setShowModal(false);
    };

    const resetApproval = () => {
        if (!window.confirm('確定取消教師審查通過狀態？')) return;
        try { localStorage.removeItem('w11-teacher-approval'); } catch {}
        try {
            const STORAGE_KEY = 'rib_think_records';
            const records = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
            delete records['w11-teacher-stamp'];
            localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
        } catch {}
        setApproval(null);
    };

    if (approval && approval.approved) {
        return (
            <div className="bg-[#F0FDF4] border-2 border-[var(--success)] rounded-[var(--radius-unified)] p-4 flex items-start gap-3">
                <CheckCircle2 size={20} className="text-[var(--success)] flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                    <div className="font-bold text-[14px] text-[var(--success)]">✅ 已通過教師倫理審查</div>
                    <div className="text-[12px] text-[var(--ink-mid)] mt-1">
                        審查老師：<strong>{approval.teacher}</strong>
                        <br />時間：{new Date(approval.timestamp).toLocaleString('zh-TW')}
                    </div>
                </div>
                <button
                    onClick={resetApproval}
                    className="text-[10px] text-[var(--ink-light)] hover:text-[var(--danger)] font-mono"
                    title="老師取消審查（誤操作用）"
                    type="button"
                >取消</button>
            </div>
        );
    }

    return (
        <>
            <div className="bg-[#FEF3C7] border border-[#D97706]/30 rounded-[var(--radius-unified)] p-4 flex items-start gap-3">
                <span
                    onClick={handleSecretClick}
                    className="text-[20px] cursor-pointer select-none flex-shrink-0"
                    title=""
                    style={{ userSelect: 'none' }}
                >⚖</span>
                <div className="flex-1 min-w-0">
                    <div className="font-bold text-[13px] text-[#92400E]">尚未通過教師倫理審查</div>
                    <div className="text-[11.5px] text-[#92400E]/85 mt-1 leading-relaxed">
                        完成上方知情同意書定稿後，把計畫書拿給老師當面審查。老師會在這裡蓋章。
                    </div>
                </div>
            </div>
            {showModal && (
                <div
                    className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
                    onClick={() => setShowModal(false)}
                >
                    <div
                        className="bg-white rounded-[var(--radius-unified)] max-w-[400px] w-full p-5 space-y-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center gap-2">
                            <span className="text-[24px]">⚖</span>
                            <h3 className="font-bold text-[16px] text-[var(--ink)]">教師倫理審查通過</h3>
                        </div>
                        <p className="text-[13px] text-[var(--ink-mid)] leading-relaxed">
                            僅老師操作。請選擇您的姓名以完成審查紀錄。
                        </p>
                        <div className="grid grid-cols-1 gap-2">
                            {TEACHER_OPTIONS.map((name) => (
                                <button
                                    key={name}
                                    onClick={() => confirmApproval(name)}
                                    className="bg-[var(--success)] hover:opacity-90 text-white px-4 py-3 rounded-[6px] text-[14px] font-bold"
                                    type="button"
                                >{name}</button>
                            ))}
                        </div>
                        <div className="flex justify-end pt-1">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 text-[12px] text-[var(--ink-mid)]"
                                type="button"
                            >取消</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

/* ══════════════════════════════════════
 *  主元件
 * ══════════════════════════════════════ */

export const W11Page = () => {
    const [w9Method, setW9Method] = useState('');
    const [w9Topic, setW9Topic] = useState('');
    const [w8Secondary, setW8Secondary] = useState('');
    const [litSubtype, setLitSubtype] = useState('');
    const [checklistOverride, setChecklistOverride] = useState(null); // 觀察清單使用者切換的視角
    const [showLessonMap, setShowLessonMap] = useState(false);

    useEffect(() => {
        const saved = readRecords();
        const method = saved['w9-my-method']?.trim() || saved['w8-tool-method']?.trim() || '';
        const secondary = saved['w8-tool-method-secondary']?.trim() || '';
        const topic = saved['w8-merged-topic']?.trim() || saved['w8-research-question']?.trim() || '';
        if (method) setW9Method(method);
        if (secondary) setW8Secondary(secondary);
        if (topic) setW9Topic(topic);
        try {
            const sub = localStorage.getItem('w10-lit-subtype') || '';
            if (sub) setLitSubtype(sub);
        } catch { /* ignore */ }
    }, []);

    const saveLitSubtype = (id) => {
        setLitSubtype(id);
        try { localStorage.setItem('w10-lit-subtype', id); } catch { /* ignore */ }
    };

    /* 主方法 id 對應到 INSTRUMENT_TEMPLATES key（接受 W9 新 label「問卷組」與舊 label「問卷法」雙來源） */
    const methodIdMap = {
        '問卷組': 'questionnaire', '問卷法': 'questionnaire', 'questionnaire': 'questionnaire',
        '訪談組': 'interview',     '訪談法': 'interview',     'interview': 'interview',
        '實驗組': 'experiment',    '實驗法': 'experiment',    'experiment': 'experiment',
        '觀察組': 'observation',   '觀察法': 'observation',   'observation': 'observation',
        '文獻組': 'literature',    '文獻分析法': 'literature','文獻法': 'literature', 'literature': 'literature',
    };
    const myMethodKey = methodIdMap[w9Method] || '';
    const secondaryMethodKey = methodIdMap[w8Secondary] || '';

    /* 觀察清單目前展示的方法（預設＝你的主方法；可手動切換看別組） */
    const activeChecklistKey = checklistOverride || myMethodKey || 'questionnaire';

    /* ── 五步驟 ──────────────────────────────────────── */

    const steps = [
        /* ─── Step 1：入場 + 讀 W10 回饋 + 修星號項（第一節 15 min）─── */
        {
            title: '入場 + 讀 W10 回饋 + 修星號項',
            icon: '📬',
            content: (
                <div className="space-y-8 prose-zh">
                    {/* 讀 W10 老師回饋 */}
                    <div className="bg-white border-2 border-[var(--accent)] rounded-[var(--radius-unified)] p-5 max-w-[720px]">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-[18px]">📬</span>
                            <span className="font-bold text-[14px] text-[var(--ink)]">先看老師對 W10 計畫書整本的回饋（5 分鐘）</span>
                        </div>
                        <p className="text-[13px] text-[var(--ink-mid)] leading-relaxed mb-3">
                            老師已在 <strong>Google Classroom</strong> 發回 W10 計畫書的批改。今天的整節課都建立在這份回饋上——
                            <strong className="text-[var(--ink)]">這格只寫「總體印象」（1-2 句即可），不用排權重</strong>。
                            下方會用「星號等級」工具幫你逐項分輕重。
                        </p>
                        <ThinkRecord
                            dataKey="w11-w10-feedback-quick"
                            prompt="老師回饋的總體印象（1-2 句，不用排權重）"
                            placeholder="例：「整體方向 OK，但第六、七章細節要修」／「方法選對了，但變項定義要更清楚」"
                            rows={2}
                        />
                        <p className="text-[11px] text-[var(--ink-light)] leading-relaxed mt-2">
                            💡 還沒拿到回饋？老師可能還在批。先往下做工具實體（Step 2），回饋拿到再回頭補這格。
                        </p>
                    </div>

                    {/* 星號等級說明 + 修補計畫 */}
                    <div className="bg-[#FFF7ED] border-2 border-[#EA580C] rounded-[var(--radius-unified)] p-5 max-w-[720px]">
                        <div className="flex items-center gap-2 mb-3">
                            <Star size={18} className="text-[#EA580C]" />
                            <span className="font-bold text-[14px] text-[#9A3412]">星號等級：找出必修項，今天修掉</span>
                        </div>
                        <p className="text-[13px] text-[#9A3412] leading-relaxed mb-3">
                            老師的回饋裡會用<strong>星號等級</strong>標出問題嚴重度——不是每條都得改，把力氣花在<strong>★★★ 必改</strong>的項目。
                        </p>
                        <div className="grid md:grid-cols-3 gap-2 mb-4">
                            <div className="bg-white border border-[#EA580C]/30 rounded-[6px] p-3">
                                <p className="text-[12px] font-bold text-[#9A3412] mb-1">★★★ 必改</p>
                                <p className="text-[11px] text-[#7C2D12] leading-[1.7]">影響整個研究能不能成立，今天<strong>一定要修</strong>。例：方法跟問題對不上、變項沒對應到工具。</p>
                            </div>
                            <div className="bg-white border border-[#EA580C]/30 rounded-[6px] p-3">
                                <p className="text-[12px] font-bold text-[#9A3412] mb-1">★★ 建議改</p>
                                <p className="text-[11px] text-[#7C2D12] leading-[1.7]">會降低研究品質但不致命，<strong>有空就改</strong>。例：時程太緊、樣本量略低。</p>
                            </div>
                            <div className="bg-white border border-[#EA580C]/30 rounded-[6px] p-3">
                                <p className="text-[12px] font-bold text-[#9A3412] mb-1">★ 提醒</p>
                                <p className="text-[11px] text-[#7C2D12] leading-[1.7]">小毛病或表達建議，<strong>有時間再優化</strong>。例：用詞、格式、引用標點。</p>
                            </div>
                        </div>
                        <ThinkRecord
                            dataKey="w11-star-fix"
                            prompt="老師標 ★★★ 的項目我打算怎麼補？（每條一行：第幾章 → 問題 → 修法）"
                            defaultTemplate={'★★★ 1：\n→ 修法：\n\n★★★ 2：\n→ 修法：\n\n★★ 1（有空再修）：\n→ 修法：'}
                            placeholder="例：★★★ 1：第六章問卷題 5 跟題 8 在問同一件事 → 修法：刪題 8，把題 5 改成單一概念"
                            rows={6}
                        />
                        <p className="text-[11.5px] text-[#9A3412] italic leading-relaxed mt-2 pt-2 border-t border-[#EA580C]/30">
                            💡 沒有 ★★★ 也很好——代表整本基礎站得住，今天可以全力做工具實體。
                        </p>
                    </div>
                </div>
            ),
        },

        /* ─── Step 2：把題目轉成施測載具（工具實體）（第一節 35 min）─── */
        {
            title: '把題目轉成施測載具',
            icon: '🛠️',
            content: (
                <div className="space-y-8 prose-zh">
                    {/* 入場說明：W10 vs W11 分工 */}
                    <div className="bg-[#F0F9FF] border-l-4 border-[#0284C7] rounded-r-[var(--radius-unified)] p-4 max-w-[760px]">
                        <p className="text-[13px] font-bold text-[#075985] mb-2">📐 W10 vs W11 的分工提醒</p>
                        <p className="text-[12.5px] text-[#0C4A6E] leading-[1.85]">
                            <strong>W10：</strong>在 計畫書 第六章<strong>填具體題目</strong>（紙上設計）。<br />
                            <strong>W11 第一節（你現在這裡）：</strong>把那些題目<strong>轉成真的能施測的載具</strong>——問卷變 Google Form、訪綱印成卡片、紀錄表設好欄位。
                        </p>
                        <p className="text-[12px] text-[#075985] italic mt-2 pt-2 border-t border-[#0284C7]/30">
                            ⚠️ 今天<strong>不大改題目內容</strong>。題目修正回到 W10 計畫書 上改；今天主力是「把寫好的題目搬到能施測的載體上」。
                        </p>
                    </div>

                    {/* 工具書連結 */}
                    <div className="bg-[var(--paper-warm)] border border-[var(--border)] rounded-[var(--radius-unified)] p-3 max-w-[760px] flex items-center justify-between gap-3">
                        <p className="text-[12px] text-[var(--ink-mid)] leading-relaxed">
                            💡 修題目／轉載具卡關？回 <strong className="text-[var(--ink)]">方法工具書</strong> 查 5 法的設計原則和常見錯誤。
                        </p>
                        <a
                            href="/tools/methods"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 bg-[var(--accent)] text-white px-3 py-1.5 rounded-[var(--radius-unified)] font-bold text-[12px] hover:opacity-90 transition-opacity no-underline flex-shrink-0"
                        >
                            📚 開工具書
                        </a>
                    </div>

                    {/* 📍 工具下載動線（動態指引：永遠顯示，依登記狀態渲染不同分支） */}
                    <div className="bg-white border-2 border-[var(--accent)] rounded-[var(--radius-unified)] p-4 max-w-[760px]">
                        <p className="text-[13px] font-bold text-[var(--accent)] mb-2">📍 你的工具下載動線（依你 W8/W9 登記）</p>
                        {!myMethodKey ? (
                            <div className="text-[12px] text-[var(--ink)] leading-[1.85] space-y-2">
                                <p>
                                    <strong className="text-[#92400E]">⚠️ 沒偵測到你 W9 登記的方法</strong>——可能是你還沒在 W9 填過、或換裝置 / 清快取後 localStorage 沒了。
                                </p>
                                <p>本節有兩條動線：</p>
                                <ol className="list-decimal pl-5 space-y-1">
                                    <li>
                                        <strong>選項 A · 直接挑工具</strong>：往下捲到<strong className="text-[#92400E]">「沒偵測到方法 — fallback」黃色卡</strong>，4 個方法任挑＋文獻組挑 4 子類型
                                    </li>
                                    <li>
                                        <strong>選項 B · 補登記</strong>：另開分頁回 <a href="/w9" target="_blank" rel="noopener noreferrer" className="text-[var(--accent)] font-bold no-underline hover:underline">/w9</a> 填 Step 3「研究方法」，回來 reload 就會自動偵測
                                    </li>
                                </ol>
                                <p className="text-[11px] text-[var(--ink-light)] italic">
                                    💡 如果你只是要試用工具，選 A 直接動手最快。
                                </p>
                            </div>
                        ) : (
                            <ol className="text-[12px] text-[var(--ink)] leading-[1.85] list-decimal pl-5 space-y-1">
                                {myMethodKey === 'literature' ? (
                                    <li>
                                        <strong>跳過第 1 區「主方法工具模板」</strong>——你是文獻組，去看 <strong className="text-[var(--accent)]">第 2 區「文獻分析法 4 子類型」</strong>挑你的子類型載入工具
                                    </li>
                                ) : (
                                    <li>
                                        <strong>第 1 區「你的主方法工具模板」（{w9Method}）</strong>——複製模板，把 W10 計畫書第六章題目搬進來
                                    </li>
                                )}
                                {secondaryMethodKey ? (
                                    <li>
                                        <strong className="text-[#10B981]">第 3 區「補充方法（{w8Secondary}）」</strong>——你登記了補充方法，這份工具<strong>今天一起做</strong>，下節 Pilot 才能兩線一起測
                                    </li>
                                ) : (
                                    <li className="text-[var(--ink-light)]">
                                        （你沒登記補充方法 → 不需看第 3 區）
                                    </li>
                                )}
                                <li className="text-[var(--ink-light)]">
                                    （第 1 區內有 details「想看其他組工具模板」是<strong>參考用</strong>，不是必要）
                                </li>
                            </ol>
                        )}
                    </div>

                    {/* 第 1 區 · 主方法工具下載 */}
                    {myMethodKey && INSTRUMENT_TEMPLATES[myMethodKey] && (
                        <div>
                            <h4 className="font-serif text-[18px] md:text-[20px] font-bold text-[var(--ink)] mb-2">
                                <span className="text-[var(--accent)] mr-2">第 1 區</span>你的主方法工具模板
                                <span className="ml-2 text-[12px] font-normal text-[var(--ink-light)]">（{w9Method}）</span>
                            </h4>
                            <p className="text-[13px] text-[var(--ink-mid)] leading-relaxed mb-3">
                                點下方按鈕複製模板到你的 GDrive。把 W10 計畫書 第六章的題目搬進來、設定載具細節。
                            </p>
                            <a
                                href={INSTRUMENT_TEMPLATES[myMethodKey].url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 bg-[var(--ink)] text-white px-5 py-3 rounded-[var(--radius-unified)] text-[13px] font-bold hover:bg-[var(--ink)]/85 transition no-underline"
                            >
                                <Download size={16} /> {INSTRUMENT_TEMPLATES[myMethodKey].name}
                            </a>
                            <p className="text-[12px] text-[var(--ink-mid)] leading-relaxed mt-2">
                                💡 <strong>使用提示</strong>：{INSTRUMENT_TEMPLATES[myMethodKey].tip}
                            </p>

                            {/* 看其他組工具模板（彈性切換） */}
                            <details className="mt-3 text-[12px]">
                                <summary className="cursor-pointer text-[var(--ink-mid)] hover:text-[var(--ink)] inline-flex items-center gap-1">
                                    📂 想看其他方法的工具模板？▼
                                </summary>
                                <p className="text-[11.5px] text-[var(--ink-light)] leading-relaxed mt-2 mb-2">
                                    參考用——例如想看別組怎麼設計工具、或自己有混合方法想多拿一份模板。
                                </p>
                                {(() => {
                                    const tools = listToolTemplates({
                                        excludeMain: [myMethodKey, secondaryMethodKey].filter(Boolean),
                                        includeLit: myMethodKey !== 'literature',
                                    });
                                    return (
                                        <>
                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-3">
                                                {tools.main.map((t) => (
                                                    <a
                                                        key={t.id}
                                                        href={t.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="bg-white border border-[var(--border)] rounded-[6px] px-3 py-2 text-[11.5px] text-[var(--ink-mid)] hover:border-[var(--accent)] hover:text-[var(--ink)] no-underline flex items-center gap-1 transition"
                                                    >
                                                        <Download size={11} /> {t.name}
                                                    </a>
                                                ))}
                                            </div>
                                            {tools.lit.length > 0 && (
                                                <div>
                                                    <p className="text-[11px] text-[var(--ink-light)] mb-1.5">📚 文獻組 4 子類型：</p>
                                                    <div className="grid grid-cols-2 md:grid-cols-2 gap-2">
                                                        {tools.lit.map((sub) => (
                                                            <a
                                                                key={sub.id}
                                                                href={sub.url}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="bg-white border border-[var(--border)] rounded-[6px] px-3 py-2 text-[11.5px] text-[var(--ink-mid)] hover:border-[var(--accent)] hover:text-[var(--ink)] no-underline flex items-center gap-1 transition"
                                                            >
                                                                <span>{sub.icon}</span> {sub.label}
                                                            </a>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    );
                                })()}
                            </details>
                        </div>
                    )}

                    {/* 文獻組：4 子類型選擇器 */}
                    {myMethodKey === 'literature' && (
                        <div>
                            <h4 className="font-serif text-[18px] md:text-[20px] font-bold text-[var(--ink)] mb-2">
                                <span className="text-[var(--accent)] mr-2">第 2 區</span>文獻分析法 4 子類型 — 挑你的子類型載入工具
                            </h4>
                            <p className="text-[13px] text-[var(--ink-mid)] leading-relaxed mb-3">
                                文獻分析依子類型不同，工具型態差很多。挑你 W9/W10 已選的子類型——載具就直接配對好。
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                                {LIT_SUBTYPE_TEMPLATES.map((sub) => (
                                    <button
                                        key={sub.id}
                                        type="button"
                                        onClick={() => saveLitSubtype(sub.id)}
                                        className={`text-left bg-white border-2 rounded-[var(--radius-unified)] p-4 transition ${litSubtype === sub.id ? 'border-[var(--accent)] ring-2 ring-[var(--accent)]/30' : 'border-[var(--border)] hover:border-[var(--accent)]/60'}`}
                                    >
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-[18px]">{sub.icon}</span>
                                            <span className="font-bold text-[13px] text-[var(--ink)]">{sub.label}</span>
                                            {litSubtype === sub.id && <span className="ml-auto text-[10px] font-mono bg-[var(--accent)] text-[var(--ink)] px-1.5 py-0.5 rounded">已選</span>}
                                        </div>
                                        <p className="text-[11.5px] text-[var(--ink-mid)] leading-[1.7]">產出：{sub.deliverable}</p>
                                    </button>
                                ))}
                            </div>
                            {litSubtype && (() => {
                                const sub = LIT_SUBTYPE_TEMPLATES.find(s => s.id === litSubtype);
                                if (!sub) return null;
                                return (
                                    <a
                                        href={sub.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 bg-[var(--ink)] text-white px-5 py-3 rounded-[var(--radius-unified)] text-[13px] font-bold hover:bg-[var(--ink)]/85 transition no-underline"
                                    >
                                        <Download size={16} /> {sub.name}
                                    </a>
                                );
                            })()}
                        </div>
                    )}

                    {/* 補充方法工具下載 */}
                    {secondaryMethodKey && INSTRUMENT_TEMPLATES[secondaryMethodKey] && (
                        <div className="bg-[#ECFDF5] border-2 border-[#10B981] rounded-[var(--radius-unified)] p-4 max-w-[760px]">
                            <p className="text-[13px] font-bold text-[#064E3B] mb-2"><span className="text-[#10B981] mr-1">第 3 區</span>🧩 你登記了補充方法：{w8Secondary}</p>
                            <p className="text-[12px] text-[#065F46] leading-relaxed mb-3">
                                補充方法的工具實體<strong>強烈建議今天一起做</strong>。下節 Pilot 互測時就能兩線一起測。
                            </p>
                            <a
                                href={INSTRUMENT_TEMPLATES[secondaryMethodKey].url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 bg-[#065F46] text-white px-4 py-2 rounded-[var(--radius-unified)] text-[12.5px] font-bold hover:bg-[#064E3B] transition no-underline"
                            >
                                <Download size={14} /> {INSTRUMENT_TEMPLATES[secondaryMethodKey].name}（補充）
                            </a>
                            <div className="mt-3 bg-[#FEF2F2] border border-[#DC2626] rounded-[6px] p-3">
                                <p className="text-[12px] font-bold text-[#991B1B] mb-1">⚠️ 補充方法 Pilot 沒人測！</p>
                                <p className="text-[11.5px] text-[#7F1D1D] leading-[1.85]">
                                    課堂 Pilot 配對是<strong>主方法 1 對 1 跨方法</strong>，<strong>補充方法不會被測到</strong>。請<strong>下週上課前自己另找 1 個人</strong>（家人／朋友／不同班同學都可）測一次補充方法工具，把發現補進 <strong>Step 4 工具第二輪修正</strong>。
                                </p>
                            </div>
                        </div>
                    )}

                    {/* 沒偵測到方法 — fallback 全列（含文獻 4 子類型） */}
                    {!myMethodKey && (
                        <div className="bg-[#FEF3C7] border border-[#D97706]/40 rounded-[var(--radius-unified)] p-4 space-y-3">
                            <p className="text-[13px] text-[#92400E]">
                                沒偵測到你 W9 選的方法。請從下方挑你要的工具模板：
                            </p>
                            {(() => {
                                const tools = listToolTemplates();
                                return (
                                    <>
                                        <div>
                                            <p className="text-[11.5px] font-bold text-[#92400E] mb-2">主方法工具（4 選 1）</p>
                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                                {tools.main.map((t) => (
                                                    <a key={t.id} href={t.url} target="_blank" rel="noopener noreferrer" className="bg-white border border-[var(--border)] rounded-[6px] px-3 py-2 text-[12px] font-bold text-[var(--ink)] hover:border-[var(--accent)] no-underline flex items-center gap-1">
                                                        <Download size={12} /> {t.name}
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="pt-2 border-t border-[#D97706]/30">
                                            <p className="text-[11.5px] font-bold text-[#92400E] mb-2">📚 文獻組（4 子類型挑 1）</p>
                                            <div className="grid grid-cols-2 md:grid-cols-2 gap-2">
                                                {tools.lit.map((sub) => (
                                                    <a key={sub.id} href={sub.url} target="_blank" rel="noopener noreferrer" className="bg-white border border-[var(--border)] rounded-[6px] px-3 py-2 text-[12px] font-bold text-[var(--ink)] hover:border-[var(--accent)] no-underline flex items-center gap-1">
                                                        <span>{sub.icon}</span> {sub.label}
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    </>
                                );
                            })()}
                        </div>
                    )}

                    {/* 繳交提示（精簡版） */}
                    <div className="bg-[#F0FDF4] border-l-4 border-[#10B981] rounded-r-[var(--radius-unified)] p-4 max-w-[760px]">
                        <p className="text-[13px] text-[#047857] leading-[1.85]">
                            📤 <strong className="text-[#064E3B]">下節 Pilot 互測</strong>會用到這份工具，做好後放在自己手上。
                            <strong className="text-[#064E3B]">W11 結束後</strong>再把<strong>計畫書 + 工具實體</strong>一起繳到 <strong>Google Classroom 本週作業區</strong>。
                        </p>
                    </div>

                    <div className="w7-notice w7-notice-teal">
                        ✅ 工具實體做好 → 下節用這份載具去 Pilot 互測 → 改完再一次繳交到 GC。
                    </div>
                </div>
            ),
        },

        /* ─── Step 3：跨班 Pilot 互測（第二節 30 min）─── */
        {
            title: '跨班 Pilot 互測 + 雙向紀錄',
            icon: '🧪',
            content: (
                <div className="space-y-8 prose-zh">
                    {/* Pilot Test 是什麼？為什麼重要？*/}
                    <div className="bg-[#F0F9FF] border-2 border-[#0284C7] rounded-[var(--radius-unified)] p-5 max-w-[760px]">
                        <p className="text-[14px] font-bold text-[#075985] mb-2">🛩️ 什麼是 Pilot Test？</p>
                        <p className="text-[13px] text-[#0C4A6E] leading-[1.85] mb-3">
                            <strong className="text-[#075985]">Pilot Test = 預試</strong>。Pilot 原意是「飛行員」——飛機正式載客前，飛行員會先做<strong>試飛</strong>檢查所有系統。研究工具也一樣：<strong>正式施測前先抓 1-2 個人試跑一次，找出真人會卡住的地方</strong>。
                        </p>
                        <div className="grid md:grid-cols-2 gap-2 mb-3">
                            <div className="bg-white border border-[#0284C7]/30 rounded-[6px] p-3">
                                <p className="text-[12px] font-bold text-[#075985] mb-1">✅ 為什麼重要</p>
                                <ul className="text-[11.5px] text-[#0C4A6E] leading-[1.7] list-disc pl-4 space-y-0.5">
                                    <li>AI 看的是文字，<strong>看不到真人皺眉</strong>、回頭翻、選不出來的瞬間</li>
                                    <li>同一句話<strong>你寫的人懂、別人不一定懂</strong>——文字盲點要靠真人測</li>
                                    <li>實際填答時間／流暢度，只有試了才知道</li>
                                </ul>
                            </div>
                            <div className="bg-white border border-[#DC2626]/30 rounded-[6px] p-3">
                                <p className="text-[12px] font-bold text-[#991B1B] mb-1">⚠️ 不做的代價</p>
                                <ul className="text-[11.5px] text-[#7F1D1D] leading-[1.7] list-disc pl-4 space-y-0.5">
                                    <li>Pilot 漏掉的問題，<strong>正式施測會放大十倍</strong>——80 個人都看不懂同一題</li>
                                    <li>等 W12 真的發出去才發現問題，<strong>已經來不及改</strong></li>
                                    <li>資料蒐集回來才發現工具有缺陷，<strong>整個研究要重來</strong></li>
                                </ul>
                            </div>
                        </div>
                        <p className="text-[11.5px] text-[#075985] italic leading-relaxed border-t border-[#0284C7]/30 pt-2">
                            💡 真實研究界做法是先找 5-10 人 Pilot；高中課堂受限於時間，我們今天用<strong>座位表 1 對 1 跨方法配對</strong>——一節課內互測完。
                        </p>
                    </div>

                    {/* Pilot Test 配對指示 */}
                    <div>
                        <h4 className="font-serif text-[18px] md:text-[20px] font-bold text-[var(--ink)] mb-2">
                            預試（Pilot Test）配對方式：座位表 1 對 1（跨方法）
                        </h4>
                        <p className="text-[13px] text-[var(--ink-mid)] leading-relaxed mb-3">
                            <strong className="text-[var(--ink)]">老師會在投影幕放出座位表</strong>——你跟對面的同學配對 1 對 1 互測。對方不一定跟你同方法，但這正好——<strong className="text-[var(--ink)]">真實受測者也不會懂你的研究方法</strong>，能不能讓他看懂、填得下去，才是工具好不好用的真正測試。<span className="text-[var(--danger)] font-bold">不要找同組／好友互測（會放水）。</span>
                        </p>

                        {/* 通用注意事項：當作真的施測 */}
                        <div className="bg-[#FEF3C7] border-l-4 border-[#D97706] rounded-r-[var(--radius-unified)] p-4 mb-4 max-w-[720px]">
                            <p className="text-[13px] font-bold text-[#92400E] mb-2">⚠️ 當作真的施測——四件事每組都要做</p>
                            <ol className="text-[12.5px] text-[#78350F] leading-[1.85] space-y-1.5 list-decimal pl-5">
                                <li><strong>開始前讀「知情同意短版」給對方聽</strong>：「這是我的 Pilot 預試，預計 X 分鐘，回饋會被紀錄但不公開姓名，可以隨時停。可以開始嗎？」</li>
                                <li><strong>計時</strong>：記錄開始／結束時間。實際時長跟你預估的差很多，就是訊號。</li>
                                <li><strong>專注觀察</strong>：對方填／答／看的時候，留意他在哪一題卡住、皺眉、回頭翻——這些細節是 AI 抓不到的</li>
                                <li><strong>雙向紀錄</strong>：你當「研究者」時記下對方的回饋；換你當「受測者」時，幫對方寫一段反思（你以為對方在研究什麼？實際感受？）</li>
                            </ol>
                            <p className="text-[11.5px] text-[#92400E] italic mt-2 pt-2 border-t border-[#D97706]/30">
                                💡 第一條「知情同意」就是<strong>下個 Step 4 倫理單元的起點</strong>——你現在做的是同學版，等下會擴充到正式施測對象的完整版。
                            </p>
                        </div>

                        <p className="text-[13px] text-[var(--ink-mid)] leading-relaxed mb-4">
                            下方是依<strong className="text-[var(--ink)]">你的工具型態</strong>不同的具體做法。對方不會看這段——你才是 Pilot 的主導者。
                        </p>

                        {/* 依方法分流的指示卡 */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {Object.entries(PILOT_INSTRUCTIONS).map(([mid, info]) => (
                                <div key={mid} className={`bg-white border rounded-[var(--radius-unified)] p-4 ${myMethodKey === mid ? 'border-2 border-[var(--accent)]' : 'border-[var(--border)]'}`}>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="font-bold text-[13px] text-[var(--ink)]">{info.label}</span>
                                        <span className="text-[10px] font-mono text-[var(--ink-light)] bg-[var(--paper-warm)] px-1.5 py-0.5 rounded">{info.format}</span>
                                        {myMethodKey === mid && <span className="ml-auto text-[10px] font-mono bg-[var(--accent)] text-[var(--ink)] px-1.5 py-0.5 rounded">你的</span>}
                                    </div>
                                    <ol className="text-[12px] text-[var(--ink-mid)] leading-[1.85] space-y-1 list-decimal list-inside">
                                        {info.steps.map((s, i) => <li key={i}>{s}</li>)}
                                    </ol>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 研究者紀錄 */}
                    <div className="space-y-4">
                        <h4 className="font-serif text-[18px] md:text-[20px] font-bold text-[var(--ink)] mb-2">
                            Pilot 紀錄（你當研究者）
                        </h4>

                        {/* 觀察清單（預設依方法分流，可切換看別組）*/}
                        <div className="bg-[#FFFBEB] border-2 border-[#D97706] rounded-[var(--radius-unified)] p-4 max-w-[760px]">
                            <div className="flex items-start justify-between gap-2 mb-3 flex-wrap">
                                <p className="text-[13px] font-bold text-[#92400E]">🔍 觀察清單 — 至少觀察以下幾件事，挑出 1 件最明顯的</p>
                                {myMethodKey && (
                                    <span className="text-[10.5px] font-mono text-[#92400E]/75 bg-[#FEF3C7] px-2 py-0.5 rounded">你的方法：{PILOT_OBSERVATION_CHECKLIST[myMethodKey]?.label.replace('觀察清單', '').replace(/[（()].*[)）]/g, '').trim()}</span>
                                )}
                            </div>

                            {/* 5 法切換 chips */}
                            <div className="flex gap-1.5 flex-wrap mb-3">
                                {Object.entries(PILOT_OBSERVATION_CHECKLIST).map(([key, list]) => {
                                    const isActive = activeChecklistKey === key;
                                    const isMine = myMethodKey === key;
                                    const shortLabel = list.label.split('觀察清單')[0].trim();
                                    return (
                                        <button
                                            key={key}
                                            type="button"
                                            onClick={() => setChecklistOverride(key)}
                                            className={`text-[11.5px] px-2.5 py-1 rounded-full border transition ${
                                                isActive
                                                    ? 'bg-[#D97706] text-white border-[#D97706] font-bold'
                                                    : 'bg-white text-[#92400E] border-[#D97706]/40 hover:bg-[#FEF3C7]'
                                            }`}
                                        >
                                            {shortLabel} {isMine && !isActive && <span className="text-[9px] ml-0.5">★</span>}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* 顯示當前選的清單 */}
                            {PILOT_OBSERVATION_CHECKLIST[activeChecklistKey] && (
                                <ul className="text-[12.5px] text-[#78350F] leading-[1.85] list-disc pl-5 space-y-1">
                                    {PILOT_OBSERVATION_CHECKLIST[activeChecklistKey].items.map((item, i) => (
                                        <li key={i}>{item}</li>
                                    ))}
                                </ul>
                            )}

                            <p className="text-[11.5px] text-[#92400E] italic mt-3 pt-2 border-t border-[#D97706]/30">
                                ⚠️ 這幾條<strong>任何一條都不允許答「沒有」</strong>——眼睛閉著也會看到。預設展示你的主方法；★ 是你的方法；想看別組可以切換。如果真的覺得「都沒問題」，下方有 AI 反向質問鷹架。
                            </p>
                        </div>

                        <ThinkRecord
                            dataKey="w11-pilot-partner"
                            prompt="你和誰配對？對方是哪個方法？"
                            placeholder="例：和訪談組的小明配對，他研究「資優生的挫折經驗」"
                            rows={2}
                        />

                        {/* 範例示範卡：兩個方法的真實寫法 */}
                        <details className="bg-white border border-[var(--border)] rounded-[var(--radius-unified)] mb-3">
                            <summary className="cursor-pointer px-4 py-2 hover:bg-[var(--paper-warm)] flex items-center gap-2 text-[12px]">
                                <span className="font-bold text-[var(--ink)]">📋 範例示範：兩個方法怎麼寫「最卡的 1 件事」（點開）</span>
                                <span className="ml-auto text-[10px] font-mono text-[var(--ink-light)]">▼</span>
                            </summary>
                            <div className="border-t border-[var(--border)] p-4 grid md:grid-cols-2 gap-3 text-[11.5px] text-[var(--ink-mid)] leading-relaxed">
                                <div>
                                    <p className="font-bold text-[var(--ink)] mb-1">📋 問卷組範例</p>
                                    <p className="bg-[var(--paper-warm)] border border-[var(--border)] rounded p-2 mb-1">
                                        最卡的 1 題：第 8 題「你的家庭氣氛？」<br />
                                        具體現象：對方填到這題停了 5 秒，反問「家庭氣氛是指什麼？是吵架還是冷漠？」<br />
                                        我打算怎麼修：拆成「常吵架嗎？」「成員會主動聊天嗎？」兩題具體題
                                    </p>
                                </div>
                                <div>
                                    <p className="font-bold text-[var(--ink)] mb-1">🎤 訪談組範例</p>
                                    <p className="bg-[var(--paper-warm)] border border-[var(--border)] rounded p-2 mb-1">
                                        最卡的 1 件事：第 3 題「你補習的決策過程」<br />
                                        具體現象：對方答「就去補啊」，我追問三次都沒延伸，因為題目太抽象<br />
                                        我打算怎麼修：改成「最早是誰提出要補習？你當時的反應？」（具體事件比抽象「過程」好答）
                                    </p>
                                </div>
                            </div>
                        </details>
                        <ThinkRecord
                            dataKey="w11-pilot-findings"
                            prompt="【你當研究者】Pilot 中對方最卡 / 最慢 / 最遲疑的 1 件事是？請記錄對方給的回饋或自己想到的修改方法"
                            defaultTemplate={'最卡的 1 題／1 件事：\n  具體現象（對方說了什麼／做了什麼）：\n  對方給的回饋（若有）：\n  我打算怎麼修：\n\n【實驗組專用】架設圖被挑出最大的漏洞：'}
                            placeholder="例：最卡的 1 題：第 5 題「自我效能」對方反問三次什麼意思。對方建議：直接寫白話。我打算改成：「你覺得自己能在期末完成的把握」"
                            rows={8}
                        />

                    </div>

                    {/* 📸 拍照存證（實體存在性證據 — 反偽造） */}
                    <div className="bg-[#F0FDF4] border-l-4 border-[#10B981] rounded-r-[var(--radius-unified)] p-4">
                        <p className="text-[13px] font-bold text-[#065F46] mb-2">📸 拍照存證（Pilot 進行中順手拍）</p>
                        <p className="text-[12.5px] text-[#047857] leading-relaxed mb-3">
                            預試進行時拍 <strong>1-2 張照片</strong>——預試者手在填／互模擬訪談的角度即可。這是你「真的做過 Pilot」的證據。
                        </p>
                        <div className="grid md:grid-cols-2 gap-2 mb-3">
                            <div className="bg-white border border-[#10B981]/30 rounded-[6px] p-3">
                                <p className="text-[12px] font-bold text-[#065F46] mb-1">✅ 該拍什麼</p>
                                <ul className="text-[11.5px] text-[#047857] leading-[1.7] list-disc pl-4 space-y-0.5">
                                    <li>預試者手在<strong>填問卷</strong>的角度</li>
                                    <li>訪談現場（拍<strong>桌面紀錄本／錄音裝置</strong>，不拍人臉）</li>
                                    <li>實驗組架設圖被同學標記漏洞的版本</li>
                                    <li>觀察組試跑的紀錄表正被填寫</li>
                                    <li>文獻組互閱分析架構的螢幕／紙本</li>
                                </ul>
                            </div>
                            <div className="bg-white border border-[#DC2626]/30 rounded-[6px] p-3">
                                <p className="text-[12px] font-bold text-[#991B1B] mb-1">⚠️ 倫理底線</p>
                                <ul className="text-[11.5px] text-[#7F1D1D] leading-[1.7] list-disc pl-4 space-y-0.5">
                                    <li>拍照前<strong>口頭問</strong>「我可以拍嗎？」——對方說不要就不拍</li>
                                    <li><strong>不要拍正臉</strong>，不要拍到名牌、學號</li>
                                    <li>照片<strong>只繳給老師</strong>不公開、不傳群組</li>
                                </ul>
                            </div>
                        </div>
                        <p className="text-[11.5px] text-[#065F46] italic leading-relaxed border-t border-[#10B981]/30 pt-2">
                            💡 老師看的不是照片美感，是<strong>「事件有真的發生」</strong>。Classroom 繳交本週作業時把照片一起上傳。
                        </p>
                    </div>

                    {/* Pilot 紀錄品質自檢（元認知檢核點） */}
                    <div className="bg-[#F5F3FF] border-l-4 border-[#7C3AED] rounded-r-[var(--radius-unified)] p-4">
                        <p className="text-[13px] font-bold text-[#5B21B6] mb-2">🪞 進下一 Step 前：Pilot 紀錄品質自檢</p>
                        <p className="text-[11.5px] text-[#4C1D95] leading-relaxed mb-3">
                            勾完才能進 Step 4 的工具修正——這不是把關，是給你一個機會自己判斷「我寫得夠不夠」。
                        </p>
                        <Checklist
                            dataKey="w11-pilot-self-check"
                            items={[
                                '我寫的「對方回饋」是對方**真的說過**的話，不是我猜他想說的',
                                '我自己觀察到的問題用了**自己的話**寫，不是照抄對方',
                                '至少有一條問題是「我原本沒想到、預試後才發現」的——如果都是我預期內的，預試可能太流於形式',
                            ]}
                        />
                    </div>

                    <div className="w7-notice w7-notice-teal">
                        ✅ Pilot 紀錄寫完 + 自檢勾完 → 進入 Step 4：工具最後修正 + 倫理 + 施測啟動。
                    </div>
                </div>
            ),
        },

        /* ─── Step 4：工具修正 + 倫理 + 施測啟動（第二節 20 min）─── */
        {
            title: '工具修正',
            icon: '🔧',
            content: (
                <div className="space-y-8 prose-zh">
                    {/* 第二輪工具修正 */}
                    <div>
                        <h4 className="font-serif text-[18px] md:text-[20px] font-bold text-[var(--ink)] mb-2">
                            第二輪工具修正（根據 Pilot 回饋）
                        </h4>
                        {/* AI 反向質問鷹架（從 Step 3 移過來：在這裡用最有意義） */}
                        <details className="bg-[#FEF2F2] border-2 border-[#DC2626] rounded-[var(--radius-unified)] p-4 max-w-[760px] mb-4">
                            <summary className="cursor-pointer text-[13px] font-bold text-[#991B1B]">😅 Step 3 全組覺得「都沒問題」？修不出東西嗎？ — AI 反向質問鷹架 ▼</summary>
                            <div className="mt-3 space-y-3">
                                <p className="text-[12.5px] text-[#7F1D1D] leading-[1.85]">
                                    很可能不是工具完美，而是 Pilot 對方太禮貌（朋友互測常見）／你還看不見毛病。<strong>把以下 prompt 貼給 AI</strong>，AI 一定挑得出 3 點：
                                </p>
                                <CopyablePrompt text={NO_FINDING_PROMPT} label="AI 反向質問 prompt — 複製貼到 AI" />
                                <p className="text-[11.5px] text-[#991B1B] italic">
                                    💡 AI 挑出的 3 點不見得對——拿這 3 點回頭再 Pilot 1 個人，自己驗證哪個真的成立。
                                </p>
                            </div>
                        </details>
                        <p className="text-[13px] text-[var(--ink-mid)] leading-relaxed mb-4">
                            把 Step 3 的 Pilot 發現整理成具體修改清單，依嚴重度直接改 計畫書 第六章題目或載具設定。這是你工具的最後一版——從現在開始不再大改。
                        </p>
                        <ThinkRecord
                            dataKey="w11-tool-final-revision"
                            prompt="根據 Pilot 發現要改的地方（對應 計畫書 第六章）"
                            placeholder={'例：\n修正 1：第 5 題原本「請評估你的自我效能」→ 改成「你覺得自己能在期末完成這份研究的把握有多高？」（原因：原題太抽象，學生看不懂）\n修正 2：量表從 7 點改 5 點（原因：高中生對中等程度辨識度有限）\n修正 3：（無）\n\n【實驗組】架設圖要改的地方：\n統一兩組指導語為相同字數，並把施測都安排在同一時段（避開早晚差異）'}
                            scaffold={['修正 N：第幾題原本如何 → 改成什麼（原因）', '【實驗組】架設圖要改的地方']}
                            rows={8}
                        />
                    </div>
                </div>
            ),
        },
        {
            title: '倫理審查',
            icon: '⚖',
            content: (
                <div className="space-y-8 prose-zh">
                    {/* 請回頭審查小組的設計有無符合倫理審查 */}
                    <div>
                        <h4 className="font-serif text-[18px] md:text-[20px] font-bold text-[var(--ink)] mb-2">
                            請回頭審查小組的設計有無符合倫理審查
                        </h4>
                        <p className="text-[13px] text-[var(--ink-mid)] leading-relaxed mb-4">
                            下方四原則是研究倫理的基礎底線。對照你們組的研究設計，記錄這四個在自己的研究要怎麼實踐。
                        </p>

                        {/* 四原則卡片（純顯示，不收輸入）*/}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
                            {ETHICS_QUESTIONS.map((q) => (
                                <div key={q.id} className="bg-white border border-[var(--border)] rounded-[var(--radius-unified)] overflow-hidden">
                                    <div className="px-4 py-2.5 flex items-center gap-2 border-b border-[var(--border)]" style={{ backgroundColor: `${q.color}12` }}>
                                        <span className="text-[16px]">{q.icon}</span>
                                        <span className="font-bold text-[13px]" style={{ color: q.color }}>{q.title}</span>
                                    </div>
                                    <div className="p-4">
                                        <p className="text-[12.5px] text-[var(--ink)] font-bold mb-1.5">{q.question}</p>
                                        <p className="text-[11.5px] text-[var(--ink-light)] mb-2 leading-relaxed">💡 {q.hint}</p>
                                        {q.examples && (
                                            <details className="rounded border border-[var(--border)] bg-[#FAFAF9]">
                                                <summary className="cursor-pointer px-2.5 py-1.5 hover:bg-[var(--paper-warm)] transition-colors flex items-center gap-2">
                                                    <span className="text-[11px] font-bold" style={{ color: q.color }}>📋 高中研究常見做法 ▼</span>
                                                </summary>
                                                <ul className="border-t border-[var(--border)] px-3 py-2 space-y-1 text-[11px] text-[var(--ink-mid)] leading-relaxed">
                                                    {q.examples.map((ex, i) => (
                                                        <li key={i}>· {ex}</li>
                                                    ))}
                                                </ul>
                                            </details>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* 合併紀錄欄 */}
                        <div className="bg-[#FEF3C7] border-2 border-[#F59E0B] rounded-[var(--radius-unified)] p-4">
                            <ThinkRecord
                                dataKey="w11-ethics-self-review"
                                prompt="請回頭審查小組的設計有無符合倫理審查，以及倫理審查在自己的研究要怎麼實踐"
                                rows={8}
                            />
                        </div>
                    </div>

                </div>
            ),
        },
        {
            title: '施測啟動 + 繳交',
            icon: '🚀',
            content: (
                <div className="space-y-8 prose-zh">
                    {/* 施測啟動 — 不填表，課堂結尾只做：工具實體繳交 + W12 預告 */}
                    <div>
                        <h4 className="font-serif text-[18px] md:text-[20px] font-bold text-[var(--ink)] mb-2">
                            施測啟動 · 收尾說明
                        </h4>
                        <div className="bg-[#F0F9FF] border-l-4 border-[#0284C7] rounded-r-[var(--radius-unified)] p-4 mb-4 max-w-[760px]">
                            <p className="text-[12.5px] text-[#0C4A6E] leading-[1.85]">
                                樣本量／時程<strong>已在計畫書第七章+第十一章寫過</strong>——<u>這裡不重填</u>。<strong>Plan B 觸發條件</strong>（W13 進來前累計 &lt; X 份就啟動備案）等到 <strong>W12 期中短報</strong>老師問再口頭討論，現在不寫網頁。
                            </p>
                            <p className="text-[12px] text-[#0C4A6E] leading-[1.85] mt-2">
                                ✅ 本節剩下的時間只做三件事：<strong>① 工具實體連結貼到 Classroom</strong> · <strong>② 一鍵匯出網頁歷程 docx 一起貼</strong>（含 Pilot 紀錄、第二輪修正、倫理四原則）· <strong>③ 看 W12 預告</strong>。老師會在 W11 結束後收回工具書統一給回饋。
                            </p>
                        </div>
                    </div>

                    {/* ExportButton */}
                    {/* 本週結束，你應該要會 — B 標準格式 */}
                    <div className="bg-white border border-[var(--border)] rounded-[var(--radius-unified)] overflow-hidden mb-4">
                        <div className="p-4 px-5 bg-[var(--paper-warm)] border-b border-[var(--border)] font-bold text-[13px]">
                            ✅ 本週結束，你應該要會
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-[1px] bg-[var(--border)]">
                            {[
                                                '把計畫書題目轉成真的能施測的載具（Form／訪綱／紀錄表）',
                                                '透過 1 對 1 跨方法 Pilot 找出 AI 看不到的工具毛病',
                                                '對照倫理四原則紀錄小組研究的具體實踐方式',
                                                '繳交：工具實體連結 + 上課歷程 docx（含 Pilot 紀錄、倫理四原則紀錄）',
                            ].map((item, i) => (
                                <div key={i} className="p-4 px-5 bg-white flex items-start gap-3">
                                    <span className="text-[var(--success)] text-[16px] mt-0.5 flex-shrink-0">✓</span>
                                    <span className="text-[13px] text-[var(--ink-mid)] leading-relaxed">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <ExportButton
                        weekLabel="W11 Pilot Test + 倫理審查 + 施測啟動"
                        fields={EXPORT_FIELDS}
                    />

                    {/* W12 預告：期中進度短報 */}
                    <div className="bg-[var(--ink)] border-l-4 border-[var(--accent)] p-5 md:p-6 rounded-r-lg text-white shadow-xl">
                        <div className="flex items-center gap-2 mb-3">
                            <Plane size={20} className="text-[var(--accent)]" />
                            <span className="font-mono text-[11px] font-bold tracking-[0.2em] text-[var(--accent)] uppercase">W12 預告 · 期中進度短報</span>
                        </div>
                        <div className="font-bold text-[17px] md:text-[18px] mb-3 leading-tight">
                            W12：期中短報 + 同儕回饋（每組 3 min + 1 min QA）
                        </div>
                        <p className="text-[13px] text-white/85 leading-[1.9] mb-3">
                            正式施測前的<strong className="text-[var(--accent)]">最後一道擋板</strong>。每組 3 分鐘短報、老師選題提問 1 分鐘。同學透過 Google Form 即時回饋你的計畫漏洞。
                        </p>

                        <div className="bg-white/10 rounded-[var(--radius-unified)] p-4 mb-3 space-y-2">
                            <p className="text-[13px] font-bold text-[var(--accent)] mb-1">📅 課後 7 天必做（W11 → W12 之間）</p>

                            <div className="border-l-2 border-[var(--accent)]/60 pl-3 py-1">
                                <p className="text-[12.5px] font-bold text-white">① 全組約 30 min 合議 Pilot 共識發現</p>
                                <p className="text-[11.5px] text-white/75 leading-[1.8] mt-1">
                                    每人攤開自己的 Pilot 紀錄 → 找「共通模式」（不是個人偏好）→ 寫出共識：
                                </p>
                                <ul className="text-[11px] text-white/75 leading-[1.85] list-disc pl-5 mt-1 space-y-0.5">
                                    <li>① 攤開：每人寫下自己 Pilot 最痛 1 個發現</li>
                                    <li>② 找共識：哪個發現「不只我這個 partner 卡住、別人的 partner 也類似」</li>
                                    <li>③ 寫共識：「我們組共通弱點是 [X]、證據 [A 同學 B 同學 partner 都卡]、已修正 [Y]」</li>
                                </ul>
                            </div>

                            <div className="border-l-2 border-[var(--accent)]/60 pl-3 py-1">
                                <p className="text-[12.5px] font-bold text-white">② 由組長把短報內容填進 Google Form</p>
                                <p className="text-[11.5px] text-white/75 leading-[1.8] mt-1">
                                    5 段內容：<br />
                                    （a）題目 + 動機 50 字／（b）方法 + 工具 80 字／（c）Pilot 共識 200 字／（d）目前進度 80 字／（e）預期蒐集 + Plan B 100 字
                                </p>
                                <p className="text-[11.5px] text-[#FCD34D] font-bold mt-1.5">
                                    ⏰ 截止：W12 上課當天 8:00（沒填從 E 維度直接扣 4 分）
                                </p>
                            </div>
                        </div>

                        <p className="text-[12px] text-white/70 leading-[1.9] font-mono pt-2 border-t border-white/15">
                            課後任務：① 全組合議 30 min ② 組長填短報 Form ③ 自己約好 W12-W13 真實施測對象
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
                    <span className="hidden md:inline">研究方法與專題 / 資料蒐集 / </span><span className="text-[var(--ink)] font-bold">預試與倫理 W11</span>
                </div>
                <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
                    <span className="bg-[var(--paper-warm)] text-[var(--ink)] text-[10px] font-bold px-2 py-0.5 rounded-[2px] font-mono">100 MINS</span>
                    <ResetWeekButton weekPrefix="w11-" />
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
                    <LessonMap data={W11Data} />
                </div>
            )}

            {/* PAGE HEADER — Hero Block */}
            <HeroBlock
                kicker="R.I.B. 調查檔案 · 研究方法與專題 · W11"
                title="預試與倫理："
                accentTitle="施測啟動前的最後一道檢核"
                subtitle="W10 把題目寫到 計畫書 上，這週把題目轉成真的能施測的載具——然後 1 對 1 跨方法 Pilot（預試：正式上場前先抓 1-2 個人試跑，找真人會卡住的地方）找出 AI 看不到的毛病、過倫理、宣告施測啟動。"
                chain="W10 計畫書定稿、第六章工具題目寫好了——但別急著真的施測。先找少數人試一遍（Pilot 預試），避免上場才發現坑。"
                meta={[
                    { label: '第一節', value: '讀 W10 回饋 + 修星號項 + 把題目轉成施測載具' },
                    { label: '第二節', value: '座位表 1 對 1 Pilot 互測 + 倫理 + 施測啟動' },
                    { label: '課堂產出', value: '工具實體 + Pilot 發現 + 倫理審查通過 + 施測計畫' },
                    { label: '前置要求', value: 'W10 計畫書已繳交（題目寫在 計畫書 第六章）' },
                ]}
            />
            <CourseArc items={[
                    { wk: 'W1-W4', name: '探索\n定題', status: 'past' },
                    { wk: 'W5-W6', name: '操作型定義\n海報博覽會', status: 'past' },
                    { wk: 'W7-W8', name: '文獻偵探\n引用寫作', status: 'past' },
                    { wk: 'W9-W10', name: '工具設計\nAI精進預試', status: 'past' },
                    { wk: 'W11', name: '倫理審查\n施測啟動', status: 'now' },
                    { wk: 'W12-W13', name: '執行研究\n蒐集資料', status: '' },
                    { wk: 'W14-W17', name: '分析報告\n發表', status: '' },
                ]} />

            <TaskCard
                weekNumber="W11"
                weekTitle={W11Data.title}
                duration={`${W11Data.duration} 分鐘 · ${W11Data.durationDesc}`}
                tasks={[
                    '工具實體化（題目 → Google Form / 訪綱卡 / 紀錄表）',
                    '座位表 1 對 1 跨方法 Pilot — 雙向紀錄 + 自我檢核',
                    '倫理審查 + 教師蓋章 → 啟動施測',
                ]}
                exportReminder="Classroom 繳交工具 + 等老師蓋章 → 正式啟動施測"
            />

            {/* STEP ENGINE */}
            <StepEngine
                steps={steps}
                prevWeek={{ label: '回 W10 工具精進', to: '/w10' }}
                nextWeek={{ label: '前往 W12 研究執行', to: '/w12' }}
            flat
            />
        </div>
    );
};
