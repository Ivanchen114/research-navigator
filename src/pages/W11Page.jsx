import React, { useState, useCallback, useEffect } from 'react';
import CourseArc from '../components/ui/CourseArc';
import './W11.css';
import ThinkRecord from '../components/ui/ThinkRecord';
import Checklist from '../components/ui/Checklist';
import StepEngine from '../components/ui/StepEngine';
import StepBriefing from '../components/ui/StepBriefing';
import HeroBlock from '../components/ui/HeroBlock';
import TaskCard from '../components/ui/TaskCard';
import ExportButton from '../components/ui/ExportButton';
import ResetWeekButton from '../components/ui/ResetWeekButton';
import LessonMap from '../components/ui/LessonMap';
import { readRecords } from '../components/ui/ThinkRecord';
import { W11Data } from '../data/lessonMaps';
import ContentTypeChip from '../components/ui/ContentTypeChip';
import {
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

/* — Pilot Test 方法分流指示（座位表一對一 跨方法配對；對方依你的工具型態做不同事） — */
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


/* — 本組工具設計書模板（與 W9/W10 同步；W11 第一節「把題目轉成施測載具」用）— */
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
    /* Step 2：本組工具設計書本體留在學生手上，繳交時隨計畫書一起上傳 GC（這裡不收欄位）*/
    /* Step 3：Pilot 互測 */
    { key: 'w11-pilot-partner', label: 'Pilot Test 對象', question: '座位表配對到誰？對方是哪個方法？' },
    { key: 'w11-pilot-findings', label: 'Pilot Test 發現', question: '當研究者時對方的回饋 + 你自己觀察到的工具卡點' },
    { key: 'w11-pilot-as-subject', label: 'Pilot 受測者感受', question: '當你當受測者時：有沒有想說不想回答、不確定資料用途、或感覺不填不行？' },
    /* Step 4：工具修正 */
    { key: 'w11-tool-final-revision', label: '工具第二輪修正', question: '根據 Pilot 回饋要改載具的哪幾點' },
    /* Step 5：倫理 */
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
 *  倫理情境判斷測驗
 * ══════════════════════════════════════ */

const QUIZ_STORAGE_KEY = 'w11-ethics-quiz';
const THINK_STORAGE_KEY = 'rib_think_records';

const ETHICS_QUIZ = [
    {
        id: 'q1',
        scenario: '你們想研究同學午休在做什麼，就在教室角落安靜觀察記錄，沒有告訴任何人。',
        hasIssue: true,
        principle: '知情同意',
        explanation: '即使是觀察，受試者也有知道自己被研究的權利。沒有告知就觀察，侵犯了知情同意原則。',
    },
    {
        id: 'q2',
        scenario: '問卷第一頁寫：「本研究探討同學睡眠習慣，結果匿名，不會讓老師看到，預計3分鐘，可以選擇不填。」',
        hasIssue: false,
        principle: '知情同意',
        explanation: '說明了研究目的、匿名、不影響成績、可以不填——知情同意做到位了。',
    },
    {
        id: 'q3',
        scenario: '訪談好朋友，他說了一些對老師不滿的話，你覺得很有價值，直接放進報告。',
        hasIssue: true,
        principle: '保密',
        explanation: '即使是好朋友，訪談內容也需要保密。放進報告前應先取得對方同意，並匿名處理。',
    },
    {
        id: 'q4',
        scenario: '訪談前問受訪者：「我可以錄音方便整理嗎？你可以說不要，我改用筆記。」',
        hasIssue: false,
        principle: '知情同意＋自願性',
        explanation: '主動說明錄音用途，並給對方拒絕的空間——這是好的研究倫理實踐。',
    },
    {
        id: 'q5',
        scenario: '在班群發問卷，附上一句「拜託大家填一下，我要交作業了」。',
        hasIssue: true,
        principle: '自願性',
        explanation: '「拜託」＋「要交作業」會讓人覺得不填過意不去，壓縮了自願的空間。',
    },
    {
        id: 'q6',
        scenario: '問卷裡原本有一題「你有沒有跟父母吵過架」，討論後覺得太私人，決定拿掉。',
        hasIssue: false,
        principle: '不傷害',
        explanation: '主動意識到題目可能讓人不舒服，並作出調整——這正是「不傷害」原則的實踐。',
    },
    {
        id: 'q7',
        scenario: '問卷裡有一題：「你覺得你的家庭經濟狀況屬於哪一類？（偏低／中等／偏高）」',
        hasIssue: true,
        principle: '不傷害',
        explanation: '家庭經濟狀況是敏感資訊，可能讓填答者感到不舒服。除非研究必要，應避免直接詢問。',
    },
    {
        id: 'q8',
        scenario: '報告裡所有受訪者都改成「受訪者A、受訪者B」，不寫真名或班級。',
        hasIssue: false,
        principle: '保密',
        explanation: '匿名化處理保護了受訪者的身份，符合保密原則。',
    },
    {
        id: 'q9',
        scenario: '你設計了一個假的詐騙網站，讓同學「不知情地」點進去測試他們會不會被騙。事後你打算告訴大家：「開個玩笑～其實是研究！」',
        hasIssue: true,
        principle: '知情同意＋不傷害',
        explanation: '「事後揭露」不等於「事先同意」——同意必須在受試之前給出。而且被騙當下的焦慮、羞恥或被愚弄的感受，不會因為後來說是玩笑就消失。欺騙本身就是傷害。',
    },
    {
        id: 'q10',
        scenario: '你截圖幾個同學公開的 Instagram 貼文，分析他們的情緒狀態當作研究資料。',
        hasIssue: true,
        principle: '知情同意',
        explanation: '即使是公開貼文，用來做研究分析仍需告知當事人並取得同意。「公開」≠「同意被研究」。',
    },
];

const EthicsQuiz = () => {
    const [answers, setAnswers] = useState(() => {
        try {
            const raw = localStorage.getItem(QUIZ_STORAGE_KEY);
            return raw ? JSON.parse(raw) : {};
        } catch { return {}; }
    });

    const answered = Object.keys(answers).length;
    const correct = ETHICS_QUIZ.filter(q => answers[q.id] === q.hasIssue).length;
    const allDone = answered === ETHICS_QUIZ.length;

    const answer = (qId, hasIssue) => {
        if (answers[qId] !== undefined) return;
        setAnswers(prev => {
            const next = { ...prev, [qId]: hasIssue };
            try {
                localStorage.setItem(QUIZ_STORAGE_KEY, JSON.stringify(next));
                const doneCount = Object.keys(next).length;
                const correctCount = ETHICS_QUIZ.filter(q => next[q.id] === q.hasIssue).length;
                const records = JSON.parse(localStorage.getItem(THINK_STORAGE_KEY) || '{}');
                /* 分數記到 quiz-score；w11-ethics-self-review 留給下方 ThinkRecord 書面紀錄 */
                records['w11-ethics-quiz-score'] = `倫理情境判斷：答對 ${correctCount}／${doneCount} 題（共10題）`;
                localStorage.setItem(THINK_STORAGE_KEY, JSON.stringify(records));
            } catch { /* ignore */ }
            return next;
        });
    };

    const reset = () => {
        setAnswers({});
        try {
            localStorage.removeItem(QUIZ_STORAGE_KEY);
            const records = JSON.parse(localStorage.getItem(THINK_STORAGE_KEY) || '{}');
            delete records['w11-ethics-quiz-score'];
            localStorage.setItem(THINK_STORAGE_KEY, JSON.stringify(records));
        } catch { /* ignore */ }
    };

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <ContentTypeChip type="練" />
                    <span className="font-bold text-[13px] text-[var(--ink)]">倫理情境判斷</span>
                    <span className="text-[11.5px] text-[var(--ink-light)]">— 有問題還是沒問題？</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-[11.5px] text-[var(--ink-mid)]">{answered} / {ETHICS_QUIZ.length}</span>
                    {allDone && (
                        <span className={`text-[11.5px] font-bold px-2 py-0.5 rounded ${
                            correct >= 8 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>答對 {correct} 題</span>
                    )}
                    {answered > 0 && (
                        <button onClick={reset} type="button"
                            className="text-[10.5px] text-[var(--ink-light)] hover:text-[var(--ink)] underline">
                            重做
                        </button>
                    )}
                </div>
            </div>

            {ETHICS_QUIZ.map((q, idx) => {
                const userAns = answers[q.id];
                const isAnswered = userAns !== undefined;
                const isCorrect = isAnswered && userAns === q.hasIssue;

                return (
                    <div key={q.id} className={`border rounded-[var(--radius-unified)] overflow-hidden transition-all ${
                        isAnswered
                            ? isCorrect ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50'
                            : 'border-[var(--border)] bg-white'
                    }`}>
                        <div className="p-3.5 flex items-center gap-3">
                            {/* 題目 */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-start gap-2 mb-2">
                                    <span className="text-[10.5px] font-mono bg-[var(--paper-warm)] border border-[var(--border)] px-1.5 py-0.5 rounded text-[var(--ink-mid)] flex-shrink-0 mt-0.5">
                                        {String(idx + 1).padStart(2, '0')}
                                    </span>
                                    <p className="text-[18px] text-[var(--ink)] leading-relaxed">{q.scenario}</p>
                                </div>
                                {isAnswered && (
                                    <div className={`rounded-[6px] px-3 py-2.5 ${isCorrect ? 'bg-green-100' : 'bg-red-100'}`}>
                                        <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
                                            <span className={`text-[12px] font-bold ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                                                {isCorrect ? '✓ 正確' : `✗ 答錯了——正確答案是「${q.hasIssue ? '有問題' : '沒問題'}」`}
                                            </span>
                                            <span className="ml-auto text-[10.5px] font-mono px-1.5 py-0.5 bg-white/70 rounded text-[var(--ink-mid)]">
                                                {q.principle}
                                            </span>
                                        </div>
                                        <p className="text-[12px] text-[var(--ink)] leading-relaxed">{q.explanation}</p>
                                    </div>
                                )}
                            </div>
                            {/* 按鈕：右側垂直排列 */}
                            {!isAnswered ? (
                                <div className="flex flex-col gap-1.5 flex-shrink-0 w-[88px]">
                                    <button type="button" onClick={() => answer(q.id, true)}
                                        className="py-2 rounded-[6px] border-2 border-[#EF4444] text-[#EF4444] text-[12px] font-bold hover:bg-red-50 transition-colors text-center">
                                        ⚠️ 有問題
                                    </button>
                                    <button type="button" onClick={() => answer(q.id, false)}
                                        className="py-2 rounded-[6px] border-2 border-[#10B981] text-[#10B981] text-[12px] font-bold hover:bg-green-50 transition-colors text-center">
                                        ✅ 沒問題
                                    </button>
                                </div>
                            ) : (
                                <div className="flex-shrink-0 w-[88px] flex items-center justify-center">
                                    <span className={`text-[20px]`}>{isCorrect ? '✅' : '❌'}</span>
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}

            {allDone && (
                <div className={`rounded-[var(--radius-unified)] p-4 text-center border ${
                    correct >= 8 ? 'bg-green-50 border-green-300' : 'bg-yellow-50 border-yellow-300'
                }`}>
                    <p className={`font-bold text-[15px] ${correct >= 8 ? 'text-green-700' : 'text-yellow-700'}`}>
                        {correct >= 8
                            ? `答對 ${correct}/10，倫理意識不錯！`
                            : `答對 ${correct}/10，回頭看看答錯的題目。`}
                    </p>
                </div>
            )}
        </div>
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
    const [instructionOverride, setInstructionOverride] = useState(null); // Pilot 指示卡使用者切換的視角
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
    /* Pilot 指示卡目前展示的方法（預設＝你的主方法；可手動切換看別組） */
    const activeInstructionKey = instructionOverride || myMethodKey || 'questionnaire';

    /* ── 五步驟 ──────────────────────────────────────── */

    const steps = [
        /* ─── Step 1：入場 + 讀 W10 回饋 + 修星號項（第一節 15 min）─── */
        {
            title: '入場 + 讀 W10 回饋 + 修星號項',
            icon: '📬',
            content: (
                <div className="space-y-8 prose-zh">
                    <StepBriefing
                        lines={[
                            { label: '節奏', text: '跟老師做（10 分鐘）' },
                            { label: '做', text: '開 GC 看 W10 整本回饋，把 ★★★ 必改項列出來，今天就修' },
                        ]}
                    />
                    {/* 讀 W10 回饋 + 星號修補（合一張卡） */}
                    <div className="bg-[#FFF7ED] border-2 border-[#EA580C] rounded-[var(--radius-unified)] p-5 max-w-[720px] space-y-4">
                        <div className="flex items-center gap-2">
                            <ContentTypeChip type="做" />
                            <span className="font-bold text-[14px] text-[#9A3412]">📬 開 GC 讀回饋 → 找 ★★★ → 今天修掉</span>
                        </div>
                        <p className="text-[12px] text-[#9A3412] leading-relaxed">
                            老師批改時用星號標嚴重度：<strong>★★★ 今天課堂修・★★ 有空再改・★ 課後優化</strong>。把力氣花在 ★★★。
                        </p>
                        <ThinkRecord
                            dataKey="w11-w10-feedback-quick"
                            prompt="老師回饋的總體印象（1-2 句即可）"
                            placeholder="例：整體方向 OK，但第六、七章細節要修"
                            rows={2}
                        />
                        <ThinkRecord
                            dataKey="w11-star-fix"
                            prompt="老師標 ★★★ 的項目我打算怎麼補？（每條一行：第幾章 → 問題 → 修法）"
                            defaultTemplate={'★★★ 1：\n→ 修法：\n\n★★★ 2：\n→ 修法：\n\n★★ 1（有空再修）：\n→ 修法：'}
                            placeholder="例：★★★ 1：第六章問卷題 5 跟題 8 在問同一件事 → 修法：刪題 8，把題 5 改成單一概念"
                            rows={6}
                        />
                        <p className="text-[11px] text-[#9A3412]/75 italic leading-relaxed">
                            💡 還沒拿到回饋？先做 Step 2 本組工具設計書，回來補填。沒有 ★★★ 也很好——整本基礎穩，今天可以全力做工具設計書。
                        </p>
                    </div>
                </div>
            ),
        },

        /* ─── Step 2：把第六章設計升級成本組工具設計書（第一節 35 min）─── */
        {
            title: '把第六章設計升級成本組工具設計書',
            icon: '🛠️',
            content: (
                <div className="space-y-8 prose-zh">
                    <StepBriefing
                        lines={[
                            { label: '節奏', text: '第一節主力（35 分鐘）' },
                            { label: '做', text: '複製模板，把第六章升級成本組工具設計書（題目 + 變項對應 + 施測方式 + 修正紀錄）' },
                        ]}
                    />

                    {/* 入場說明：W10 vs W11 分工 */}
                    <div className="bg-[#F0F9FF] border-l-4 border-[#0284C7] rounded-r-[var(--radius-unified)] p-3 max-w-[760px]">
                        <p className="text-[12.5px] text-[#0C4A6E] leading-[1.85]">
                            <strong>W10</strong> 已在計畫書第六章填好具體題目。<strong>W11 這節</strong>：把第六章升級成<strong>本組工具設計書</strong>——說清楚題目對應哪個變項、怎麼施測、Pilot 後怎麼修。今天<strong>不大改題目內容</strong>，主力是「搬進載具 + 寫成可執行說明書」。卡關時可查<a href="/tools/methods" target="_blank" rel="noopener noreferrer" className="text-[var(--accent)] no-underline font-bold">方法工具書</a>。
                        </p>
                    </div>

                    {/* fallback：沒偵測到方法時才顯示動線說明 */}
                    {!myMethodKey && (
                        <div className="bg-[#FEF3C7] border border-[#D97706]/40 rounded-[var(--radius-unified)] p-3 max-w-[760px] text-[12px] text-[#92400E] leading-[1.85] space-y-1">
                            <p><strong>⚠️ 沒偵測到 W9 登記的方法</strong>——兩條路：</p>
                            <p><strong>A</strong> 直接往下捲挑工具（黃色 fallback 卡）&nbsp;·&nbsp;<strong>B</strong> 回 <a href="/w9" target="_blank" rel="noopener noreferrer" className="text-[var(--accent)] font-bold no-underline hover:underline">/w9</a> Step 3 補登記後 reload</p>
                        </div>
                    )}

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
                            <details className="mt-4 border-2 border-dashed border-[var(--border)] rounded-[var(--radius-unified)] overflow-hidden">
                                <summary className="cursor-pointer px-4 py-3 bg-[var(--paper-warm)] hover:bg-[#EEE9E0] transition-colors flex items-center gap-2 font-bold text-[13.5px] text-[var(--ink)]">
                                    <span className="text-[18px]">📂</span>
                                    想看其他方法的工具模板？
                                    <span className="ml-auto text-[11px] font-mono text-[var(--ink-light)]">點此展開 ▼</span>
                                </summary>
                                <div className="px-4 pt-3 pb-1">
                                <p className="text-[12px] text-[var(--ink-light)] leading-relaxed mb-2">
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
                                </div>
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
                                補充方法的本組工具設計書<strong>強烈建議今天一起做</strong>。下節 Pilot 互測時就能兩線一起測。
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
                                    課堂 Pilot 配對是<strong>主方法 一對一跨方法</strong>，<strong>補充方法不會被測到</strong>。請<strong>下週上課前自己另找 1 個人</strong>（家人／朋友／不同班同學都可）測一次補充方法工具，把發現補進 <strong>Step 4 工具第二輪修正</strong>。
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

                    <div className="w7-notice w7-notice-teal">
                        ✅ 本組工具設計書做出第一版 → 下節 Pilot 互測 → 改完進 Step 4 第二輪修正。
                    </div>
                </div>
            ),
        },

        /* ─── Step 3：跨方法 Pilot 互測（第二節 30 min）─── */
        {
            title: '跨方法 Pilot 互測 + 雙向紀錄',
            icon: '🧪',
            content: (
                <div className="space-y-8 prose-zh">
                    <StepBriefing
                        lines={[
                            { label: '節奏', text: '第二節（30 分鐘）' },
                            { label: '做', text: '跟對面跨方法同學一對一 Pilot 互測，雙向紀錄對方卡點與自己盲點' },
                        ]}
                    />

                    {/* Pilot 三原則大字卡 */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full">
                        {[
                            {
                                headline: 'AI 找文字毛病\n真人找行為毛病',
                                body: 'AI 能挑出題目語意問題，但對方「停頓 5 秒」「皺眉回頭看」這種行為訊號，只有真人預試才看得到。',
                                accent: 'var(--accent)',
                            },
                            {
                                headline: '你是觀察者\n不是解說員',
                                body: '對方看不懂題目——先別開口解釋。那個「看不懂」本身就是你要修的地方。',
                                accent: '#D97706',
                            },
                            {
                                headline: '找不到問題\n才危險',
                                body: 'Pilot 的目標是挖洞，不是通過測試。全程「都沒問題」代表你可能沒有認真觀察。',
                                accent: '#DC2626',
                            },
                        ].map((card, i) => (
                            <div key={i} className="bg-white border-t-4 rounded-b-[var(--radius-unified)] p-4" style={{ borderColor: card.accent }}>
                                <p className="font-serif font-bold text-[22px] leading-[1.35] text-[var(--ink)] mb-3 whitespace-pre-line">{card.headline}</p>
                                <p className="text-[12px] text-[var(--ink-mid)] leading-[1.7]">{card.body}</p>
                            </div>
                        ))}
                    </div>

                    {/* Pilot Test 配對指示 */}
                    <div>
                        <h4 className="font-serif text-[18px] md:text-[20px] font-bold text-[var(--ink)] mb-2">
                            預試（Pilot Test）配對方式：座位表一對一（跨方法）
                        </h4>
                        <p className="text-[13px] text-[var(--ink-mid)] leading-relaxed mb-3">
                            <strong className="text-[var(--ink)]">老師會在投影幕放出座位表</strong>——你跟對面的同學配對一對一互測。<span className="text-[var(--danger)] font-bold">不要找同組／好友互測（會放水）。</span>
                        </p>

                        {/* 通用注意事項 */}
                        <div className="bg-[#FEF3C7] border-l-4 border-[#D97706] rounded-r-[var(--radius-unified)] p-3 mb-4 max-w-[720px]">
                            <p className="text-[12px] font-bold text-[#92400E] mb-2">⚠️ 每組都要做的事</p>
                            <ul className="text-[13px] text-[#78350F] leading-[1.85] space-y-1 list-none">
                                <li>① 開始前說「知情同意短版」（「這是預試，X 分鐘，不公開姓名，可隨時停」）</li>
                                <li>② 計時</li>
                                <li>③ 專注觀察對方哪裡停頓、皺眉、回頭看</li>
                                <li>④ 換你當受測者時也記下感受（Step 5 倫理會接回來）</li>
                            </ul>
                        </div>

                        {/* 依方法分流的指示卡：chip 切換，預設顯示自己的方法 */}
                        <div>
                            <div className="flex gap-1.5 flex-wrap mb-3">
                                {Object.entries(PILOT_INSTRUCTIONS).map(([mid, info]) => {
                                    const isActive = activeInstructionKey === mid;
                                    const isMine = myMethodKey === mid;
                                    const shortLabel = info.label.split('對方')[0].trim();
                                    return (
                                        <button
                                            key={mid}
                                            type="button"
                                            onClick={() => setInstructionOverride(mid)}
                                            className={`text-[11.5px] px-2.5 py-1 rounded-full border transition ${
                                                isActive
                                                    ? 'bg-[var(--accent)] text-white border-[var(--accent)] font-bold'
                                                    : 'bg-white text-[var(--ink-mid)] border-[var(--border)] hover:border-[var(--accent)]'
                                            }`}
                                        >
                                            {shortLabel}{isMine && !isActive && <span className="text-[9px] ml-0.5">★</span>}
                                        </button>
                                    );
                                })}
                            </div>
                            {PILOT_INSTRUCTIONS[activeInstructionKey] && (() => {
                                const info = PILOT_INSTRUCTIONS[activeInstructionKey];
                                return (
                                    <div className="bg-white border-2 border-[var(--accent)] rounded-[var(--radius-unified)] p-4 max-w-[720px]">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="font-bold text-[13px] text-[var(--ink)]">{info.label}</span>
                                            <span className="text-[10px] font-mono text-[var(--ink-light)] bg-[var(--paper-warm)] px-1.5 py-0.5 rounded">{info.format}</span>
                                            {myMethodKey === activeInstructionKey && <span className="ml-auto text-[10px] font-mono bg-[var(--accent)] text-white px-1.5 py-0.5 rounded">你的</span>}
                                        </div>
                                        <ol className="text-[12px] text-[var(--ink-mid)] leading-[1.85] space-y-1 list-decimal list-inside">
                                            {info.steps.map((s, i) => <li key={i}>{s}</li>)}
                                        </ol>
                                    </div>
                                );
                            })()}
                        </div>
                    </div>

                    {/* 研究者紀錄 */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                            <ContentTypeChip type="做" />
                            <h4 className="font-serif text-[18px] md:text-[20px] font-bold text-[var(--ink)]">
                                Pilot 紀錄（你當研究者）
                            </h4>
                        </div>

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
                                ⚠️ 不要只寫「沒問題」——Pilot 的重點是找下一版要檢查的線索，不是證明工具完美。★ 是你的方法，可切換看別組。
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

                        {/* 受測者感受 — 倫理意識錨點（Step 5 倫理審查會接回這格） */}
                        <div className="bg-[#F5F3FF] border-2 border-[#7C3AED] rounded-[var(--radius-unified)] p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <ContentTypeChip type="做" />
                                <span className="font-bold text-[13px] text-[#5B21B6]">【你當受測者】你剛才的感受</span>
                            </div>
                            <p className="text-[12px] text-[#4C1D95] leading-relaxed mb-3">
                                這格不是在找工具問題——是讓你記下<strong>自己當受測者的感受</strong>。下一個 Step 倫理審查會接回這裡：你剛才的感受，就是你的受測者可能有的感受。
                            </p>
                            <ThinkRecord
                                dataKey="w11-pilot-as-subject"
                                prompt="你當受測者的時候，有沒有這三種感覺？"
                                defaultTemplate={'有沒有哪一刻想說「我不想回答這題」：\n有沒有不確定自己的資料會怎麼被用：\n有沒有感覺不填不行、好像一定要配合：'}
                                placeholder="例：第三題問到家裡的補習費壓力，我猶豫了一下，不確定要不要寫真實狀況"
                                rows={4}
                            />
                        </div>

                    </div>

                    <div className="w7-notice w7-notice-teal">
                        ✅ Pilot 紀錄寫完 → 進入 Step 4：工具修正。
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
                    <StepBriefing
                        lines={[
                            { label: '節奏', text: '第二節（20 分鐘）' },
                            { label: '做', text: '把 Pilot 發現整理成 3-5 條具體修正，直接改載具與計畫書第六章' },
                        ]}
                    />
                    {/* 第二輪工具修正 */}
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <ContentTypeChip type="做" />
                            <h4 className="font-serif text-[18px] md:text-[20px] font-bold text-[var(--ink)]">
                                第二輪工具修正（根據 Pilot 回饋）
                            </h4>
                        </div>
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
                    <StepBriefing
                        lines={[
                            { label: '學', text: '倫理四原則（知情同意 / 保密 / 不傷害 / 資料正確使用）' },
                            { label: '做', text: '對照四原則，寫小組研究對應的具體實踐做法' },
                        ]}
                    />
                    {/* 學：倫理四原則大字卡 */}
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <ContentTypeChip type="學" />
                            <span className="font-bold text-[13px] text-[var(--ink)]">倫理四原則</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
                            {ETHICS_QUESTIONS.map((q) => (
                                <div key={q.id} className="bg-white border-t-4 rounded-b-[var(--radius-unified)] p-4" style={{ borderColor: q.color }}>
                                    <p className="font-serif font-bold text-[26px] leading-[1.2] mb-2" style={{ color: q.color }}>
                                        {q.icon} {q.title}
                                    </p>
                                    <p className="text-[13px] text-[var(--ink)] font-bold mb-1 leading-relaxed">{q.question}</p>
                                    <p className="text-[12px] text-[var(--ink-light)] leading-relaxed mb-3">💡 {q.hint}</p>
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
                            ))}
                        </div>
                    </div>

                    {/* 做：小組倫理實踐書面紀錄 */}
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <ContentTypeChip type="做" />
                            <span className="font-bold text-[13px] text-[var(--ink)]">對照四原則：小組的具體做法（填完才匯出）</span>
                        </div>
                        <ThinkRecord
                            dataKey="w11-ethics-self-review"
                            prompt="對照四原則，你們組的研究各項怎麼落實？"
                            placeholder={'知情同意：問卷開頭怎麼說明？\n保密：資料怎麼匿名？\n不傷害：有無敏感題目？如何處理？\n自願性：招募方式？有沒有用「拜託」語言？'}
                            scaffold={['知情同意：', '保密：', '不傷害：', '自願性：']}
                            rows={6}
                        />
                    </div>

                    {/* 練：倫理情境判斷 */}
                    <EthicsQuiz />

                </div>
            ),
        },
        {
            title: '回顧與繳交',
            icon: '📋',
            content: (
                <div className="space-y-8 prose-zh">
                    <StepBriefing
                        lines={[
                            { label: '交出', text: '小組：完整計畫書 + 本組工具設計書' },
                            { label: '交出', text: '個人：W11 歷程 docx' },
                        ]}
                    />
                    {/* 繳交指引 */}
                    <div className="bg-white border-2 border-[#10B981] rounded-[var(--radius-unified)] overflow-hidden mb-4">
                        <div className="bg-[#10B981] text-white px-4 py-2 font-bold text-[13px]">
                            📦 W11 結束前完成兩類繳交
                        </div>
                        <div className="p-4 space-y-1.5 text-[13px] text-[var(--ink-mid)] leading-[1.85]">
                            <p>① <strong className="text-[var(--ink)]">小組</strong>｜計畫書（Google 文件直改已同步）+ 工具設計書 → Classroom 小組作業區</p>
                            <p>② <strong className="text-[var(--ink)]">個人</strong>｜W11 歷程 docx（下方一鍵匯出）→ Classroom 個人作業區</p>
                            <p className="pt-1 font-bold text-[#065F46]">✅ 全部上傳後，Classroom 按「繳交」</p>
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
                                                '把第六章設計升級成本組工具設計書（題目 + 變項對應 + 施測方式 + 修正紀錄）',
                                                '透過 一對一跨方法 Pilot 找出只有真人試跑才會暴露的工具問題',
                                                '對照倫理四原則紀錄小組研究的具體實踐方式',
                                                '繳兩類：小組＝完整計畫書 + 本組工具設計書（評分重點）；個人＝W11 歷程 docx',
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
                            <span className="text-[14px] font-bold text-[#1E40AF]">複製 W11 學習紀錄 → 貼 Google Classroom</span>
                        </div>
                        <p className="text-[12px] text-[#1E3A8A] leading-relaxed mb-3">
                            包含：W10 回饋摘要／星號項修補紀錄／Pilot 互測紀錄／倫理審查確認。
                        </p>
                        <ExportButton
                            weekLabel="W11 預試與倫理"
                            fields={EXPORT_FIELDS}
                            buttonText="複製 W11 學習紀錄"
                        />
                    </div>

                    {/* W12 預告：期中進度短報 */}
                    <div className="bg-[var(--ink)] border-l-4 border-[var(--accent)] p-5 rounded-r-lg text-white shadow-xl">
                        <div className="flex items-center gap-2 mb-2">
                            <Plane size={18} className="text-[var(--accent)]" />
                            <span className="font-mono text-[11px] font-bold tracking-[0.2em] text-[var(--accent)] uppercase">W12 預告 · 期中進度短報</span>
                        </div>
                        <div className="font-bold text-[17px] mb-2 leading-tight">
                            W12：每組 3 min 短報 + 1 min QA
                        </div>
                        <div className="bg-white/10 rounded-[var(--radius-unified)] p-3 space-y-2 text-[12.5px] text-white/85">
                            <p className="font-bold text-[var(--accent)] text-[12px]">📅 課後 7 天必做</p>
                            <p>① <strong className="text-white">全組合議 30 min</strong>——攤開 Pilot 紀錄，找「我們共通弱點是什麼、已怎麼修」。</p>
                            <p>② <strong className="text-white">組長填短報 Form</strong>（5 段共約 500 字）——<span className="text-[#FCD34D] font-bold">截止：W12 上課當天 08:00（沒填直接扣分）</span></p>
                            <p>③ <strong className="text-white">約好 W12-W13 正式施測對象</strong></p>
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
                        <Map size={12} /> <span className="hidden md:inline">{showLessonMap ? '收起流程' : '教師流程'}</span>
                    </button>
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
                todo={[
                  { label: '今天做什麼', value: '把計畫書第六章升級成本組工具設計書，Pilot 一對一互測、記錄發現與修正。' },
                  { label: '為什麼做', value: 'W10 計畫書定稿但還沒真正施測——先試一遍找出真人才看到的坑，也是期中評分點。' },
                  { label: '今天交什麼', value: '小組：完整計畫書 + 工具設計書；個人：W11 歷程 docx。' },
                ]}
                question="我的工具拿出去能用嗎？倫理過得了嗎？"
                title="預試與倫理："
                accentTitle="期中報告：本組工具設計書 × Pilot 預試"
                subtitle="W10 已繳交計畫書，老師給了一次建議。W11 先看回饋、修 ★★★ 必改項；主力是把第六章設計升級成本組工具設計書——然後 一對一跨方法 Pilot 找出真人才看得到的工具問題、過倫理。本週是期中評分點：小組交完整計畫書與工具設計書、個人交 W11 歷程 docx。"
                chain="W10 計畫書定稿、第六章工具題目寫好了——但別急著真的施測。先把第六章設計升級成本組工具設計書，找少數人試一遍（Pilot 預試），避免上場才發現坑。"
                meta={[
                    { label: '第一節', value: '讀 W10 回饋 + 修 ★★★ + 製作本組工具設計書' },
                    { label: '第二節', value: '座位表一對一 Pilot 互測 + 倫理 + 回顧繳交' },
                    { label: '小組產出', value: '完整計畫書 + 本組工具設計書（W11 期中報告評分依據）' },
                    { label: '個人產出', value: 'W11 歷程 docx：Pilot 紀錄 + 工具修正 + 倫理四原則' },
                    { label: '前置要求', value: 'W10 計畫書已繳交（題目寫在計畫書第六章）' },
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
                    '把計畫書第六章設計升級成本組工具設計書（題目 + 變項對應 + 施測方式 + 修正紀錄）',
                    '座位表一對一 跨方法 Pilot — 紀錄 + 自我檢核',
                    '倫理四原則自查 → 啟動施測',
                ]}
                exportReminder="小組作業交完整計畫書與工具設計書；個人作業交 W11 歷程 docx。工具設計書是本週評分重點，完成後按 Classroom「繳交」。"
            />

            {/* STEP ENGINE */}
            <StepEngine
                steps={steps}
                prevWeek={{ label: '回 W10 工具精進', to: '/w10' }}
                nextWeek={{ label: '前往 W12 期中短報', to: '/w12' }}
            flat
            />
        </div>
    );
};
