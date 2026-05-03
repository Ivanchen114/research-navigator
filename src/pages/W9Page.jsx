import React, { useState, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CourseArc from '../components/ui/CourseArc';
import './W9Page.css';
import ThinkRecord from '../components/ui/ThinkRecord';
import Checklist from '../components/ui/Checklist';
import AIREDNarrative from '../components/ui/AIREDNarrative';
import AICollaborationPrinciples from '../components/ui/AICollaborationPrinciples';
import AIDialogSubmission from '../components/ui/AIDialogSubmission';
import AIModePicker from '../components/ui/AIModePicker';
import ThinkChoice from '../components/ui/ThinkChoice';
import AIAssistToggle from '../components/ui/AIAssistToggle';
import StepEngine from '../components/ui/StepEngine';
import HeroBlock from '../components/ui/HeroBlock';
import ExportButton from '../components/ui/ExportButton';
import ResetWeekButton from '../components/ui/ResetWeekButton';
import LessonMap from '../components/ui/LessonMap';
import GroupSizeSelector from '../components/ui/GroupSizeSelector';
import { W9Data } from '../data/lessonMaps';
import { readRecords, STORAGE_KEY } from '../components/ui/ThinkRecord';
import {
    ArrowRight,
    CheckCircle2,
    ShieldAlert,
    Stethoscope,
    ClipboardList,
    Mic,
    TestTube2,
    Camera,
    FileSearch,
    ShieldCheck,
    AlertTriangle,
    Map,
} from 'lucide-react';

/* ══════════════════════════════════════
 *  資料常數
 * ══════════════════════════════════════ */

/* — 共通錯誤（五方法都可能犯）：三欄結構 類型 / 徵狀 / 怎麼改 — */
const COMMON_ERRORS = [
    { name: '誘導性提問', icon: '🎯', desc: '題目用「嚴重」「非常好」等詞暗示了正確答案', fix: '改成中性語彙：「你覺得 X 對 Y 的影響是？」搭配雙向量表', color: 'var(--danger)' },
    { name: '雙重問題', icon: '✌️', desc: '一題問兩件事，不知道在回答哪一個', fix: '拆成兩題，一題問一件事', color: '#2563EB' },
    { name: '假開放真預設', icon: '🎭', desc: '看似開放，其實已預設了方向', fix: '改成真正開放或完全中性，不提示立場', color: '#059669' },
];

/* — 方法獨家陷阱：5 方法 × 2~3 條；同為 類型 / 徵狀 / 怎麼改 三欄結構 — */
const METHOD_PITFALLS = {
    questionnaire: {
        label: '📋 問卷',
        items: [
            { name: '選項重疊', icon: '🔄', desc: '1-3次 和 3-5次——3次算哪個？', fix: '邊界清楚不重疊：0、1-2、3-4、5 次以上', color: '#D97706' },
            { name: '選項不完整', icon: '❓', desc: '受訪者找不到自己的答案', fix: '加「其他：___」或把範圍補完整（覆蓋所有可能）', color: '#7C3AED' },
        ],
    },
    interview: {
        label: '🎤 訪談',
        items: [
            { name: '假設性問題', icon: '💭', desc: '「如果……你會怎樣？」對方容易給理想答案，不是真實行為', fix: '改問具體經驗：「上次遇到 X 時你實際怎麼做？結果如何？」', color: '#DB2777' },
            { name: '追問斷掉', icon: '🔇', desc: '問完主問題沒有 why / how 追問，只拿到表面答案', fix: '事先備 follow-up 清單；聽到「還好」「有時」就追問「可以舉個例嗎？」', color: '#0891B2' },
            { name: '過早封閉', icon: '🚪', desc: '訪談變成問卷式是/否題，浪費訪談的開放價值', fix: '主問題用「請描述…／聊聊…」取代「你會不會…」', color: '#6366F1' },
        ],
    },
    observation: {
        label: '👀 觀察',
        items: [
            { name: '指標模糊', icon: '🌫️', desc: '「認真程度」要怎麼測？沒有操作化定義就無法穩定記錄', fix: '改成可觀測行為：抬頭次數／動筆分鐘／主動發言次數', color: '#DB2777' },
            { name: '觀察者偏誤', icon: '👁️', desc: '先入為主（覺得這組就是比較混），記錄時不自覺選擇性', fix: '兩人獨立記錄同一場、事後比對；或用計數表取代主觀評分', color: '#0891B2' },
            { name: '取樣時段偏誤', icon: '⏰', desc: '只看第 3 節課不能代表整天；只看週一不能代表一週', fix: '分散時段（早／中／晚 × 週一到五），或隨機時段取樣', color: '#6366F1' },
        ],
    },
    experiment: {
        label: '🧪 實驗',
        items: [
            { name: '混淆變項', icon: '🌀', desc: '實驗組和對照組還差了別的東西（時段、教師、氣氛），不只差你要測的那一個', fix: '非目標變項做到一致（同教師／時段／教材），或隨機分派抵銷', color: '#DB2777' },
            { name: '操作定義不精確', icon: '📏', desc: '「多喝水」是幾 cc？「學習效果」是哪一份測驗？沒定義等於沒實驗', fix: '寫成 SOP：數量（2000cc）、頻率（3 次/日）、測驗工具（段考數學科）', color: '#0891B2' },
            { name: '前後測污染', icon: '🧪', desc: '前測讓受試者猜到你要測什麼，後測表現被污染', fix: '加對照組比差異；或只後測設計；或讓前後測題目不同形式', color: '#6366F1' },
        ],
    },
    literature: {
        label: '📚 文獻',
        items: [
            { name: '分析維度不清', icon: '🧭', desc: '「整理」到底要歸納什麼——主題、方法、結論、爭議？沒定軸就是剪貼簿', fix: '事先列分析欄（年份／方法／樣本／結論），每篇照填，結尾才歸納', color: '#DB2777' },
            { name: '取樣偏誤', icon: '🔍', desc: '只看 Google 前 5 篇／只看某立場的來源，結論早就被預設', fix: '多資料庫交叉（華藝／GS／DOI），正反立場至少各 3 篇', color: '#0891B2' },
            { name: '編碼不一致', icon: '🏷️', desc: '同一個概念前後用不同標籤，統計起來數據錯', fix: '先做編碼手冊（同義詞合併、層次區分），一致套用到每篇', color: '#6366F1' },
        ],
    },
};

/* — 三大標準（階層：方向 → 精度 → 執行；越上層錯越沒救） — */
const THREE_STANDARDS = [
    {
        layer: 1,
        name: '有效性',
        en: 'Validity',
        emoji: '🎯',
        plainQ: '方向對嗎？',
        desc: '你問的東西，根本答不出你想知道的答案——方向錯了，整個研究白做。',
        bad: '「你覺得睡眠重要嗎？」→ 拿到一個態度，拿不到任何時間',
        good: '「你平日幾點睡覺？」→ 問的就是你要測的變項',
        stakes: '錯了不能修，只能重來',
    },
    {
        layer: 2,
        name: '可靠性',
        en: 'Reliability',
        emoji: '🔒',
        plainQ: '測得準嗎？',
        desc: '方向對，但題目太模糊——同一個人不同時間答，結果不一樣。',
        bad: '「你常常熬夜嗎？」→「常常」每個人定義不同，今天答「還好」明天答「超常」',
        good: '「上週你有幾天超過晚上 12 點睡？」→ 數字明確，答得一致',
        stakes: '可以修，改題目措辭就能救',
    },
    {
        layer: 3,
        name: '可行性',
        en: 'Feasibility',
        emoji: '⚡',
        plainQ: '做得到嗎？',
        desc: '設計再漂亮，對方不肯陪你走完——沒收到資料，等於沒做。',
        bad: '問卷 100 題、訪談 5 小時 → 沒人理你',
        good: '問卷 15-20 題（5 分鐘填完）、訪談 3-5 大題（30 分鐘內）',
        stakes: '最容易修，砍規模就行',
    },
];

/* — 研究倫理四原則 — */
const ETHICS_PRINCIPLES = [
    { name: '知情同意', icon: '📝', desc: '問卷最上面寫清楚「我是誰、目的為何、需時多久」' },
    { name: '保密性', icon: '🔐', desc: '絕對不要問姓名跟學號！訪談用代號。' },
    { name: '不傷害', icon: '🛡️', desc: '避免問「你有想過自殺嗎」等敏感/道德壓力問題。' },
    { name: '自願性', icon: '🤝', desc: '說明「隨時可以退出，不會影響任何權益」。' },
];

/* — ThinkChoice 題目 — */
const THINK_CHOICES = [
    {
        id: 'tc-w9-1',
        prompt: '以下哪個問卷題目設計有「誘導性提問」的問題？',
        options: [
            { label: 'A', text: '你每週運動幾次？（0次 / 1-2次 / 3次以上）' },
            { label: 'B', text: '你是否同意運動能「大幅改善」心理健康？' },
            { label: 'C', text: '你最常做的運動類型是？（球類 / 跑步 / 游泳 / 其他）' },
        ],
        answer: 'B',
        feedback: 'B 用了「大幅改善」這個帶有正面立場的詞彙，暗示受訪者應該同意。應改為中性問法：「你認為運動對心理健康有什麼影響？」',
    },
    {
        id: 'tc-w9-2',
        prompt: '訪談時，以下哪個問法最能讓受訪者「說故事」？',
        options: [
            { label: 'A', text: '你有壓力嗎？' },
            { label: 'B', text: '你壓力大的時候會怎麼做？為什麼？那有效嗎？' },
            { label: 'C', text: '可以分享一個你最近感到壓力特別大的時刻嗎？' },
        ],
        answer: 'C',
        feedback: 'A 是封閉型問題，只能回「有/沒有」。B 一口氣問三件事，受訪者腦袋當機。C 請對方分享「一個具體時刻」，最容易引出完整故事。',
    },
    {
        id: 'tc-w9-3',
        prompt: '以下哪個研究工具設計違反了「可靠性」原則？',
        options: [
            { label: 'A', text: '觀察紀錄表定義「分心 = 視線離開課本連續超過 10 秒」' },
            { label: 'B', text: '問卷題目：「你經常使用社群媒體嗎？」（是/否）' },
            { label: 'C', text: '訪談大綱：「上週你有幾天超過晚上12點才睡？」' },
        ],
        answer: 'B',
        feedback: '「經常」是模糊詞——每天用 10 分鐘算經常嗎？每週用一次算嗎？不同人的定義不同，結果不穩定。應改為具體數字：「你每天使用社群媒體約多久？」',
    },
];

/* — 分流方法選項 — */
const METHOD_OPTIONS = [
    { id: 'questionnaire', label: '📋 問卷組', icon: <ClipboardList size={18} /> },
    { id: 'interview', label: '🎤 訪談組', icon: <Mic size={18} /> },
    { id: 'experiment', label: '🧪 實驗組', icon: <TestTube2 size={18} /> },
    { id: 'observation', label: '👀 觀察組', icon: <Camera size={18} /> },
    { id: 'literature', label: '📚 文獻組', icon: <FileSearch size={18} /> },
];

/* — 各組三欄對應表 scaffold — */
const METHOD_SCAFFOLDS = {
    questionnaire: {
        title: '問卷設計工作表',
        colHeaders: ['我的研究問題', '需要量測哪些變項？', '問卷題目怎麼設計？（題幹＋選項）'],
        example: {
            col1: '高中生為何拖延？',
            col2: '1. 拖延頻率\n2. 拖延誘惑來源',
            col3: '1. 你上週有幾天晚交作業？(0天/1-2天/3天以上)\n2. 什麼最讓你分心？(□IG □遊戲 □其他:__)',
        },
        selfCheck: [
            '選項互斥了嗎？（沒有 1-3次 和 3-5次 的重疊）',
            '選項窮盡了嗎？（有加「其他」選項）',
            '有誘導性嗎？（沒有預設立場的詞彙）',
            '是不是雙重問題？（一題只問一件事）',
        ],
        tips: '問卷通常 15-20 題，前幾題基本資料，中間核心問題。每題都要能對應到研究問題！',
    },
    interview: {
        title: '訪談大綱設計工作表',
        colHeaders: ['我的研究問題', '需要了解對方哪些經驗/想法？', '訪談大綱怎麼問？（大問題＋追問）'],
        example: {
            col1: '資優生的挫折感',
            col2: '1. 具體的挫折事件\n2. 當時的內在情緒',
            col3: '大問題：可以分享一次讓你印象最深的學業挫折嗎？\n追問：那你當時心裡是怎麼想的？',
        },
        selfCheck: [
            '不是封閉型是非題嗎？（能引導受訪者多說）',
            '沒有一次問太多問題嗎？（一次一個，追問另外準備）',
            '沒有預設立場嗎？（問題保持中性）',
            '有準備追問技巧嗎？（為什麼？舉個例子？當時感受？）',
        ],
        tips: '訪綱 5-8 個大問題，從簡單到深層。先準備暖身問題，最後留「還有什麼想補充的嗎？」',
    },
    experiment: {
        title: '實驗設計工作表',
        colHeaders: ['我要驗證的因果關係', '變因設定（自變項/依變項/控制變項）', '實驗流程步驟'],
        example: {
            col1: '聽音樂是否影響專注力',
            col2: '自變項：有無聽音樂（實驗組聽/對照組不聽）\n依變項：專注力測驗分數\n控制：同一時間、同一教室、同一份考卷',
            col3: 'Step1: 知情同意\nStep2: 隨機分組\nStep3: 進行測驗\nStep4: 收回數據',
        },
        selfCheck: [
            '有對照組嗎？',
            '自變項的操作定義清楚嗎？（不是「好聽的音樂」這種模糊說法）',
            '控制變項至少列了 3 個嗎？',
            '測量方式客觀嗎？（不是「我覺得」）',
        ],
        tips: '高中生實驗建議 4 週內可完成。受試者 20 人以上比較可靠。',
    },
    observation: {
        title: '觀察紀錄設計工作表',
        colHeaders: ['我要觀察什麼現象？', '對應的具體行為是什麼？（只寫看得到的動作）', '觀察紀錄表欄位設計'],
        example: {
            col1: '學生上課分心狀況',
            col2: '1. 偷看手機\n2. 趴下閉眼\n3. 與同學聊天',
            col3: '欄位：時間 / 學生代號 / 行為類別 / 持續時間',
        },
        selfCheck: [
            '是外顯行為嗎？（不是「他在想事情」這種推測）',
            '行為有操作型定義嗎？（如：視線離開課本超過10秒）',
            '記錄方式來得及嗎？（不會同時發生太多事寫不完）',
            '觀察時段和地點明確嗎？',
        ],
        tips: '預計每次觀察 20-30 分鐘，觀察 3-5 次。用代號保護隱私。',
    },
    literature: {
        title: '文獻分析架構工作表（依子類型分流）',
        colHeaders: ['我的研究問題', '我的子類型 + 分析對象', '對應的分析架構'],
        example: {
            col1: '近五年總統演講中「民主」概念的論述變化',
            col2: '子類型：④ 論述分析\n分析對象：2020-2025 總統演講稿（雙十/元旦/重大議題演說）共 30 篇',
            col3: '兩條軸線：自由 vs 平等、個人 vs 集體\n話語策略欄：誰在說／為誰說／怎麼說',
        },
        selfCheck: [
            '⚠️ 我選的是「分析法」不是「文獻回顧」嗎？（文獻回顧是所有方法第三章都要做的，不算文獻組）',
            '我的子類型（②歷史／③內容／④論述／⑤敘事）跟研究問題對得上嗎？',
            '我的分析架構（時間軸／編碼表／軸線／情節結構）能回答研究問題嗎？',
            '【內容/論述分析】有規劃雙人編碼一致率（≥80%）嗎？',
            '分析對象寫得夠具體嗎？（什麼來源、時間範圍、規模都寫清楚）',
        ],
        tips: '⚠️ 文獻分析 ≠ 文獻回顧：文獻分析是把文獻當「研究對象」來分析，不是整理前人研究。4 子類型各有專屬分析架構，挑你計畫書勾的那種寫雛形。',
    },
};

/* — 各方法的「拆解單位」對照（並非都叫變項） — */
const OPERATIONALIZE_MAP = [
    { method: '問卷', unit: '變項', output: '每個變項 3-5 題問卷題' },
    { method: '訪談', unit: '探詢層面', output: '每個層面 1 大問題 + 追問' },
    { method: '實驗', unit: '自變項／依變項／控制變項', output: '操作定義 + 實驗流程' },
    { method: '觀察', unit: '具體行為指標', output: '紀錄表欄位（時間/代號/行為/時長）' },
    { method: '文獻', unit: '分析單位（事件／編碼類別／論述軸線／情節節點）', output: '搜尋策略 + 子類型對應分析架構' },
];

/* — 各方法的第六章工具元件清單（W10 第一節寫，不是 W9 課後組裝） — */
const ASSEMBLY_TASKS = {
    questionnaire: {
        outputName: '完整問卷',
        deliverable: 'Google Doc（可再轉 Google Form）',
        timeEstimate: 'W10 第一節寫主架構（不是 W9 課後做）',
        templateUrl: 'https://docs.google.com/document/d/1tu-WF_JitJIwBZBHrrgm3MeFMDykpm_gGZoyrB4UkOI/copy',
        templateName: '01_問卷_工具',
        components: [
            { t: '開場白', d: '我是誰、研究目的、預計填答時間、保密承諾、隨時可退出' },
            { t: '基本資料區', d: '年級 / 性別 / 類組（3-5 題，避免姓名學號）' },
            { t: '核心題目', d: '把三欄表第三欄的題目整合編號，每個變項一個小區塊' },
            { t: '結尾致謝', d: '謝謝填寫、聯絡方式（若願意接受後續訪談）' },
        ],
        checks: ['題數 15-20 題（5 分鐘填完）', '每題都對應到某個變項', '沒有誘導、重疊、雙重問題'],
    },
    interview: {
        outputName: '完整訪綱',
        deliverable: 'Google Doc（A4 一到兩頁）',
        timeEstimate: 'W10 第一節寫主架構（不是 W9 課後做）',
        templateUrl: 'https://docs.google.com/document/d/1BU6XyNxdwng6I15pwYXfRs-zwKgDDyF_EVc2T6uUCrs/copy',
        templateName: '02_訪綱_工具',
        components: [
            { t: '開場白', d: '自我介紹、錄音同意、預計時間、保密承諾' },
            { t: '暖身問題', d: '1-2 題輕鬆話題，讓受訪者開口' },
            { t: '核心大問題', d: '從三欄表整理，5-8 題由淺入深' },
            { t: '追問技巧備忘', d: '為什麼？能不能舉個例？當下的感受是？' },
            { t: '收尾', d: '「還有什麼想補充的嗎？」+ 致謝' },
        ],
        checks: ['總時長估 30-40 分鐘', '大問題由淺入深', '每題都不是封閉是非題'],
    },
    experiment: {
        outputName: '實驗計畫書',
        deliverable: 'Google Doc',
        timeEstimate: 'W10 第一節寫主架構（不是 W9 課後做）',
        templateUrl: 'https://docs.google.com/document/d/1evcQ6-97mhkhsLz4RHDEGp9P_LkjAeIKUcvusBtc0d8/copy',
        templateName: '03_實驗_工具設計表',
        components: [
            { t: '研究目的與假設', d: '「我預測 A 會導致 B」' },
            { t: '變項定義', d: '自變項（操作）/ 依變項（測量）/ 控制變項（列 3+）' },
            { t: '實驗流程', d: '知情同意 → 分組 → 操作 → 測量 → 結束，含預計時間' },
            { t: '數據記錄表', d: '欄位設計：受試者代號 / 組別 / 各測量指標' },
            { t: '抽樣規則', d: '受試者 20+ 人、如何分組、排除條件' },
        ],
        checks: ['有對照組', '變項是否可操作（不是「好聽的音樂」）', '4 週內可完成'],
    },
    observation: {
        outputName: '觀察紀錄表（含觀察計畫）',
        deliverable: 'Google Sheets（三分頁：計畫 / 紀錄表 / 自檢）',
        timeEstimate: 'W10 第一節寫主架構（不是 W9 課後做）',
        templateUrl: 'https://docs.google.com/spreadsheets/d/1QMqW2AAlc1s_gNfiY3jkFCy0CHpYz2GX9ZmgpShUm7s/copy',
        templateName: '04_觀察紀錄表_工具',
        components: [
            { t: '觀察目的', d: '要回答什麼研究問題' },
            { t: '時間 / 地點', d: '每次 20-30 分鐘、共 3-5 次、具體地點' },
            { t: '行為操作定義', d: '「分心 = 視線離開課本連續超過 10 秒」' },
            { t: '紀錄表欄位', d: '時間 / 代號 / 行為類別 / 持續時間 / 備註' },
            { t: '倫理聲明', d: '代號保護、公開場域、不拍照' },
        ],
        checks: ['只記外顯行為（不是「他在想事情」）', '記錄方式來得及寫', '觀察者定位明確'],
    },
    literature: {
        outputName: '文獻分析架構雛形（依你計畫書勾的子類型）',
        deliverable: 'Google Sheets：依子類型挑對應模板（時間軸／編碼表／軸線／情節結構）',
        timeEstimate: 'W10 第一節寫主架構（不是 W9 課後做；不含實際分析資料）',
        templateUrl: 'https://drive.google.com/drive/folders/1-UtVZM8dyo20s2vbnx3UCWm-lR8YROU6',
        templateName: '05_文獻分析_工具（資料夾，依計畫書勾選的子類型挑 05a 歷史／05b 內容／05c 論述／05d 敘事 之一）',
        components: [
            { t: '⚠️ 第 0 步：先確認是「分析」不是「回顧」', d: '文獻分析 = 把文獻當研究對象；文獻回顧 = 整理前人研究（在計畫書第三章做，所有方法共用）。如果你只想整理前人研究，請改主方法。' },
            { t: '研究問題 + 子類型', d: '從 W8 帶入研究問題；子類型挑 ② 歷史 / ③ 內容 / ④ 論述 / ⑤ 敘事 其中一種' },
            { t: '分析對象', d: '具體寫：什麼來源／時間範圍／規模（例：2020-2024 IG 健身貼文前 200 則）' },
            { t: '搜尋策略', d: '資料庫 + 關鍵字 + 納入排除標準（近 5 年／中英文／排除內容農場與維基）' },
            { t: '分析架構（核心）', d: '依子類型填：時間軸（歷史）／編碼表（內容）／軸線+話語策略（論述）／情節結構（敘事）' },
            { t: '【內容/論述】編碼者一致率', d: '雙人獨立編碼 10-20% 樣本，計算一致率，≥80% 才正式編碼' },
        ],
        checks: ['子類型跟研究問題對得上', '分析架構能回答研究問題（不是只整理前人說法）', '【內容/論述】有規劃雙人編碼'],
    },
};

/* — 變項→題目發散 AI Prompt（每個方法不同） — */
const VARIABLE_AI_PROMPTS = {
    questionnaire: `我是高中生在做研究方法課的專題（問卷法）。

我要測的變項是：【在這裡貼上你這個變項的名稱與定義】
研究對象：【例如：松山高中高一學生】

請幫我發散 3-5 種可能的問卷題目寫法（含題幹與選項，選項要互斥窮盡）。
每一版請註明它的特色（例如：封閉式/量表式/情境式）。

我會從中挑一個最合適的版本，並說明為什麼刷掉其他版本。不要給我「建議使用某一版」，判斷是我的工作。`,
    interview: `我是高中生在做研究方法課的專題（訪談法）。

我要探詢的面向是：【在這裡貼上你這個面向的名稱與想了解的經驗】
受訪者：【例如：3 位曾有拖延經驗的高一學生】

請幫我發散 3-5 種可能的開放式訪談問題寫法。每一版請註明它的特色（例如：引發故事/追問情緒/反思框架）。

我會從中挑一個最能引出故事的版本，並說明為什麼刷掉其他版本。不要替我決定哪個最好。`,
    experiment: `我是高中生在做研究方法課的專題（實驗法）。

我要操作的變項是：【貼上自變項名稱】
受試者：【例如：20 位高一自願者，隨機分組】

請幫我發散 3-5 種可能的操作化方式（具體怎麼實施這個變項——例如不同時長、不同情境、不同強度）。每一版請註明它的優點與限制。

我會從中挑一個可執行的版本。不要替我決定最佳方案。`,
    observation: `我是高中生在做研究方法課的專題（觀察法）。

我要觀察的行為指標是：【貼上你想觀察的行為類型】
觀察情境：【例如：教室內、午休時間、30 分鐘】

請幫我發散 3-5 種可能的操作型定義（用具體看得到的動作描述——例如「視線離開課本連續 X 秒」）。每一版請註明它的判斷難度。

我會從中挑一個最容易即時記錄的版本。不要替我決定最佳版。`,
    literature: `我是高中生在做研究方法課的專題（文獻分析法）。請注意：「文獻分析」是把文獻當研究對象來分析它，不是整理前人研究（後者叫文獻回顧）。

我的子類型：【② 歷史 / ③ 內容 / ④ 論述 / ⑤ 敘事 — 擇一填】
研究問題：【貼上你的研究問題】
分析對象：【什麼來源、時間範圍、規模】

請依我的子類型，幫我發散 3-5 種可能的分析架構：
- 歷史 → 時間軸切割方式 + 關鍵事件挑選原則
- 內容 → 編碼類別 + 操作型定義 + 計數單位
- 論述 → 兩條軸線設計 + 話語策略類別
- 敘事 → 情節結構單位 + 角色功能類別

每一版請註明它能回答研究問題的哪個面向。我會從中挑一個最貼合的版本，並說明為什麼刷掉其他版本。`,
};

/* — 組裝樣板文字 AI Prompt（每個方法各自的 boilerplate） — */
const ASSEMBLY_AI_PROMPTS = {
    questionnaire: `我是高中生在做研究方法課的專題（問卷法）。我的研究主題是：【貼上主題】

請幫我寫以下三段樣板文字（不要碰我的題目，只寫這三段外框）：
1. 開場白（50 字以內）：我是誰、研究目的、預計填答時間、保密承諾、隨時可退出
2. 基本資料區說明（30 字以內）：請告訴受訪者為什麼要填基本資料
3. 結尾致謝（30 字以內）：謝謝填寫、聯絡方式

產出後我會自己改語氣。不要替我決定措辭。`,
    interview: `我是高中生在做研究方法課的專題（訪談法）。我的研究主題是：【貼上主題】

請幫我寫以下三段樣板文字（不要碰我的訪談問題，只寫這三段外框）：
1. 開場白（60 字以內）：自我介紹、錄音同意、預計時間、保密承諾
2. 暖身問題 2 題（讓受訪者先開口，輕鬆話題即可）
3. 收尾話術（「還有什麼想補充的嗎？」+ 致謝）

產出後我會自己改語氣。`,
    experiment: `我是高中生在做研究方法課的專題（實驗法）。我的研究主題是：【貼上主題】

請幫我寫以下兩段樣板文字（不要碰我的實驗流程，只寫這兩段外框）：
1. 知情同意聲明（80 字以內，適合高中生研究）：研究目的、實驗內容、退出權、保密
2. 受試者指導語（60 字以內）：實驗前我要唸給受試者聽的話

產出後我會自己改。`,
    observation: `我是高中生在做研究方法課的專題（觀察法）。我的研究主題是：【貼上主題】

請幫我寫以下兩段樣板文字（不要碰我的觀察指標，只寫這兩段外框）：
1. 觀察倫理聲明（60 字以內）：代號保護、公開場域、不拍照、不透露個人身份
2. 觀察紀錄表欄位說明（每個欄位一句話）：時間 / 代號 / 行為類別 / 持續時間 / 備註

產出後我會自己改。`,
    literature: `我是高中生在做研究方法課的專題（文獻分析）。我的研究主題是：【貼上主題】

請幫我寫以下兩段樣板文字（不要碰我的核心分析，只寫這兩段外框）：
1. 搜尋策略說明（60 字以內）：資料庫、關鍵字邏輯、年份範圍
2. 納入／排除標準列表（每條一句話，共 3-4 條）

產出後我會自己改。`,
};

/* — 計畫書 1-5 章 AI 檢核 Prompt（本週 Step 3 用｜AI 深度思考模式）— */
const PLAN_CH1_CHECK_PROMPT = `【建議使用 AI 的「深度思考／推理模式」】
（Gemini 的 Thinking 模式、ChatGPT 的 o1 或 Pro、Claude 的 Extended Thinking 等——請選你慣用 AI 的深度推理版本。一般對話模式回答太淺，這份檢核值得等它多想幾分鐘。）

你是高中專題指導顧問。以下是我五章計畫書的內容——請注意：學生在 W9 課堂剛寫完雛形，「不是每章都到完成度」。我會在開頭告訴你**每章目前的進度階段**，請就「該階段該有的品質」做檢核，不要對草稿用定版的標準苛責。

【我目前的進度自評】（請學生填完再貼進來；每章從「方向／雛形／精修／定版」擇一填入）
- 第一章（題目／動機／問題）：___
- 第二章（文獻探討）：___（文獻數量：___ 篇；W8 合題後可能需重查）
- 第三章（研究方法）：___
- 第四章（變項／主題／維度）：___
- 第五章（研究對象／抽樣）：___

【四階段定義 — AI 請依此校準回饋深度】
- 方向：只有概念句，還沒展開 → 你只檢「方向對不對」，給「該補什麼」清單，不要挑語法
- 雛形：段落寫出來但粗糙 → 你檢「結構＋邏輯一致」，指出明顯漏洞，不要挑用詞
- 精修：內容完整但要打磨 → 你檢「精度＋論證強度」，這時可以挑用詞與引用
- 定版：要繳交了 → 你做最後一輪挑刺，找任何不一致

【請深入檢查以下六件事，依各章進度給對應深度的回饋】

1. 【方向】研究動機是否能支撐研究問題？（若落差大，指出在哪）
2. 【一致】研究目的與主研究問題是否邏輯一致？子問題是否都對應主問題？
3. 【定義】第二章的關鍵詞操作定義，是否足以讓第六章的工具「測得到」那個概念？（若定義太抽象會讓後續工具設計失準）
4. 【文獻】第三章的文獻是否真的支持（或挑戰）我的研究問題？還是只是有關鍵字相關？
   ※ 若我標註「W8 合題後文獻待重查」——請只就「目前文獻方向」給建議，並列出我合題後該補的「3 個關鍵字組合」幫我課後分頭找。
5. 【變項／主題】第四章的變項／主題／維度，是否每一個都能對應到研究問題的某個子問題？有沒有遺漏或多餘？
6. 【對象】第五章的對象與抽樣，是否能真正回答研究問題？樣本數／招募方式合理嗎？

【回應格式】
請依「① 進度判讀（你看到我各章是哪個階段）→ ② 各章主要盲點（依進度深度給）→ ③ 課後優先補完清單（哪三件事最該先做）」三段回。
不用替我修改，只要指出問題點與建議方向。

【以下貼上你的計畫書第 1-5 章內容（即使是草稿、半成品都貼，並在每章開頭標註自己的進度階段）】`;

const PLAN_AI_PROMPTS = {
    questionnaire: PLAN_CH1_CHECK_PROMPT,
    interview: PLAN_CH1_CHECK_PROMPT,
    experiment: PLAN_CH1_CHECK_PROMPT,
    observation: PLAN_CH1_CHECK_PROMPT,
    literature: PLAN_CH1_CHECK_PROMPT,
};

/* — W9 Step 3 AI 檢核 Prompt 展示框（必做、一鍵複製） — */
const W9AiCheckPromptBox = () => {
    const [copied, setCopied] = useState(false);
    const handleCopy = useCallback(() => {
        navigator.clipboard.writeText(PLAN_CH1_CHECK_PROMPT).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }).catch(() => {
            const ta = document.createElement('textarea');
            ta.value = PLAN_CH1_CHECK_PROMPT;
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    }, []);
    return (
        <div className="bg-[var(--paper-warm)] border border-[var(--border)] rounded-[var(--radius-unified)] overflow-hidden">
            <div className="px-5 py-3 bg-[var(--ink)] flex items-center justify-between gap-3" style={{ color: '#fff' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#fff' }}>AI 檢核 Prompt · 點右邊複製</span>
                <button
                    onClick={handleCopy}
                    className="text-[12px] font-bold bg-white text-[var(--ink)] px-3 py-1 rounded hover:bg-[var(--paper-warm)] transition-colors flex-shrink-0"
                    type="button"
                >
                    {copied ? '✓ 已複製' : '📋 複製'}
                </button>
            </div>
            <pre className="p-5 text-[12px] text-[var(--ink)] leading-[1.85] whitespace-pre-wrap font-mono max-h-[360px] overflow-y-auto">{PLAN_CH1_CHECK_PROMPT}</pre>
        </div>
    );
};

/* — ExportButton 欄位 — */
const EXPORT_FIELDS = [
    /* Step 1：W8 老師回饋快速讀取 */
    /* Step 3：計畫書組裝工作坊（內容寫在 docx，網頁只記 AI 檢核+勾選） */
    { key: 'w9-ai-mode', label: 'AI 使用模式', question: '🎓 教學型（寫不出某章請示範）/ 🥊 驗收型（有初稿請壓力測試）' },
    { key: 'w9-plan-ai-check', label: 'AI 互動後的判斷紀錄', question: 'AI 指出的問題 / 給的範例 + 我採納/不採納的決定' },
    { key: 'w9-ai-dialog-submission', label: 'AI 完整對話繳交方式（必填）', question: 'A 私人註解 / B 文件上傳並貼連結' },
    { key: 'w9-plan-ch1-checklist', label: '五章地基工程進度', question: '本節繳交驗收 7 項勾選' },
    { key: 'w9-aired-record', label: 'W9 完整 AIRED 敘事（含 AI 檢核 R 欄位）', question: '本週最重要的一次 AI 互動（A-I-R-E-D 五要素）' },
    /* Step 4：回顧與繳交 */
    { key: 'w9-homework-commitment', label: '計畫書撰寫時間承諾', question: '我打算什麼時候寫計畫書第三、四章的定版？' },
];

/* ══════════════════════════════════════
 *  主元件
 * ══════════════════════════════════════ */

export const W9Page = () => {
    const [choiceResults, setChoiceResults] = useState([]);
    const [selectedMethod, setSelectedMethod] = useState('');
    const [w8Method, setW8Method] = useState('');
    const [w8Secondary, setW8Secondary] = useState(''); // W8 補充方法（label 字串）
    const [w8Topic, setW8Topic] = useState('');
    const [w8Route, setW8Route] = useState(''); // 'team' | 'solo' | ''
    const [showLessonMap, setShowLessonMap] = useState(false);
    /* Step 2 方法頁籤：預設 W8 選到的方法；無則 questionnaire（最常見） */
    const [pitfallTab, setPitfallTab] = useState('questionnaire');
    /* AI 使用模式 */
    const [w9AiMode, setW9AiMode] = useState(() => {
        try {
            const r = JSON.parse(localStorage.getItem('rib_think_records')) || {};
            return r['w9-ai-mode'] || '';
        } catch { return ''; }
    });

    /* W8 帶入方法、題目與 3 題初稿（前測素材） */
    useEffect(() => {
        const saved = readRecords();
        const method = saved['w8-tool-method']?.trim() || saved['w8-method-reason']?.trim() || '';
        const secondary = saved['w8-tool-method-secondary']?.trim() || '';
        const topic = saved['w8-merged-topic']?.trim() || saved['w8-research-question']?.trim() || '';
        if (method) setW8Method(method);
        if (secondary) setW8Secondary(secondary);
        if (topic) setW8Topic(topic);
        /* 讀取 W8 路線（Team / Solo）—— 影響 Step 1 互評環節的鷹架 */
        const route = localStorage.getItem('w8-route') || '';
        if (route === 'team' || route === 'solo') setW8Route(route);

        /* 嘗試自動偵測分流；pitfallTab 同步 */
        const methodLower = method.toLowerCase();
        if (methodLower.includes('問卷')) { setSelectedMethod('questionnaire'); setPitfallTab('questionnaire'); }
        else if (methodLower.includes('訪談')) { setSelectedMethod('interview'); setPitfallTab('interview'); }
        else if (methodLower.includes('實驗')) { setSelectedMethod('experiment'); setPitfallTab('experiment'); }
        else if (methodLower.includes('觀察')) { setSelectedMethod('observation'); setPitfallTab('observation'); }
        else if (methodLower.includes('文獻')) { setSelectedMethod('literature'); setPitfallTab('literature'); }
    }, []);

    /* ThinkChoice callback */
    const handleChoice = useCallback((id, prompt) => (label, isCorrect) => {
        setChoiceResults(prev => {
            const filtered = prev.filter(r => r.id !== id);
            return [...filtered, { id, question: prompt, selected: label, correct: isCorrect }];
        });
    }, []);

    /* 選擇方法時同步存檔 */
    const handleMethodSelect = useCallback((methodId) => {
        setSelectedMethod(methodId);
        const label = METHOD_OPTIONS.find(m => m.id === methodId)?.label || methodId;
        const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
        all['w9-my-method'] = label;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    }, []);

    const currentScaffold = METHOD_SCAFFOLDS[selectedMethod] || null;

    /* ── 五步驟 ──────────────────────────────────────── */

    const steps = [
        /* ─── Step 1：讀 W8 回饋 + 1-5 章觀念複習地圖（第一節 15 min）─── */
        {
            title: '讀 W8 回饋 + 1-5 章觀念複習',
            icon: '📬',
            content: (
                <div className="space-y-8 prose-zh">
                    {/* 本週主軸：兩節都拿來寫 1-5 章 */}
                    <div className="bg-white border-2 border-[var(--accent)] rounded-[var(--radius-unified)] p-5 max-w-[720px]">
                        <p className="text-[14px] font-bold text-[var(--ink)] mb-2">🎯 本週兩節 100 分鐘做一件事：寫計畫書 1-5 章雛形</p>
                        <ul className="text-[13px] text-[var(--ink-mid)] leading-[1.85] list-disc pl-5 space-y-1">
                            <li><strong>第一節</strong>：讀 W8 回饋（5 min）+ 1-5 章觀念複習地圖（10 min）+ 開工寫前半（35 min）</li>
                            <li><strong>第二節</strong>：寫後半 + AI 檢核 + 互看整合（45 min）+ 繳交（5 min）</li>
                        </ul>
                        <p className="text-[11.5px] text-[var(--ink-light)] leading-relaxed mt-3 pt-3 border-t border-[var(--border)]">
                            💡 工具品質判斷（三大標準 / 五錯誤類型 / RxInspector）已搬到 W10——那是寫第六章工具時要用的能力。本週專心寫 1-5 章地基就好。
                        </p>
                    </div>

                    {/* 身份識別卡：Team / Solo 分流提示（讀 W8 路線） */}
                    {w8Route === 'solo' && (
                        <div className="bg-[#FEF3C7] border-l-4 border-[#D97706] rounded-r-[var(--radius-unified)] p-4 max-w-[720px]">
                            <p className="text-[13px] font-bold text-[#92400E] mb-1">🦊 Solo 線專屬提示</p>
                            <p className="text-[12.5px] text-[#78350F] leading-relaxed mb-2">
                                你 W8 選了單飛獨行——本節的「組內看診」對你不適用。請改用以下流程：
                            </p>
                            <ol className="text-[12.5px] text-[#78350F] leading-[1.9] list-decimal pl-5 space-y-1">
                                <li><strong>自我看診</strong>：照本節三大標準，先完整自診一輪（每個錯誤類型都自己找一次）。</li>
                                <li><strong>跨組求援</strong>：找 1-2 位<strong>不同方法組</strong>的同學互看（例如你做問卷，找訪談組同學看你題目）——他們的「外行眼睛」反而能挑出你看不到的盲點。</li>
                                <li><strong>老師複診</strong>：本節下課前主動找老師 5 分鐘對話，把你最不確定的一條工具決策提出來。</li>
                            </ol>
                            <p className="text-[11px] text-[#92400E] italic mt-2">
                                ※ Solo 不等於單獨——你只是換一種方式取得反饋。研究本來就是社群活動。
                            </p>
                        </div>
                    )}
                    {w8Route === 'team' && (
                        <div className="bg-[#ECFDF5] border-l-4 border-[#10B981] rounded-r-[var(--radius-unified)] p-4 max-w-[720px]">
                            <p className="text-[13px] font-bold text-[#065F46]">🤝 Team 線：組內看診工作坊照常進行</p>
                            <p className="text-[12.5px] text-[#047857] leading-relaxed mt-1">
                                各組互看彼此工具初稿，用三大標準互挑問題。組員的判斷不一致時——這就是學習發生的地方，把分歧寫下來帶到老師複診。
                            </p>
                        </div>
                    )}

                    {/* 1-5 章觀念複習地圖（不是個人素材清單，是觀念口訣）*/}
                    <div>
                        <h4 className="font-serif text-[18px] md:text-[20px] font-bold text-[var(--ink)] mb-2">
                            📐 1-5 章觀念複習地圖（5 分鐘掃過）
                        </h4>
                        <p className="text-[12.5px] text-[var(--ink-mid)] leading-relaxed mb-3">
                            W2-W8 學過的東西，6-7 週後幾乎都忘光了——這 5 章每章一句話濃縮，<strong>5 秒復現觀念</strong>，再回 docx 寫。<strong className="text-[var(--ink)]">這是觀念口訣、不是個人素材</strong>——W8 重新組隊、題目換了也適用。
                        </p>
                        <div className="bg-white border border-[var(--border)] rounded-[var(--radius-unified)] overflow-hidden">
                            <div className="grid grid-cols-[60px_140px_1fr_90px] bg-[var(--paper-warm)] border-b border-[var(--border)] text-[11px] font-mono font-bold text-[var(--ink)]">
                                <div className="px-3 py-2.5">章</div>
                                <div className="px-3 py-2.5 border-l border-[var(--border)]">內容</div>
                                <div className="px-3 py-2.5 border-l border-[var(--border)]">核心觀念（30 秒複習）</div>
                                <div className="px-3 py-2.5 border-l border-[var(--border)]">忘了？跳回去</div>
                            </div>
                            {[
                                { ch: '一', t: '題目／動機／問題', key: '8 病症速記：太大／太抽象／百科／玄學／太私／無聊／個案／無範圍。題目要避開這 8 條。', back: [{ to: '/w3', label: 'W3 八病症' }] },
                                { ch: '二', t: '操作型定義', key: '三件事：可測量、有正反例、前後一致。「壓力大」不行、「每週超過 3 次熬夜過 12 點」可以。同一條技能：W3→W4→W7 越拆越細。', back: [{ to: '/w3', label: 'W3 具體化' }, { to: '/w4', label: 'W4 5W1H' }, { to: '/w7', label: 'W7 定義' }] },
                                { ch: '三', t: '文獻探討', key: '文獻不是擺著、要對話：他怎麼說 → 我怎麼接 → 我怎麼補。最少 2-3 篇 A/B 級。', back: [{ to: '/w5', label: 'W5 華藝' }, { to: '/w6', label: 'W6 引用' }] },
                                { ch: '四', t: '變項／主題／維度', key: '從題目拆出來。題目沒明說、但會影響結果的——就是控制變項。', back: [{ to: '/w7', label: 'W7 方法' }, { to: '/w8', label: 'W8 變項' }] },
                                { ch: '五', t: '抽樣／對象', key: '三件都要寫：為什麼是這群人？幾人？怎麼找？「方便抽樣」要老實寫不要假裝隨機。', back: [{ to: '/w8', label: 'W8 對象' }] },
                            ].map((r, i) => (
                                <div key={i} className="grid grid-cols-[60px_140px_1fr_90px] border-b border-[var(--border)] last:border-b-0 text-[12px]">
                                    <div className="px-3 py-2.5 font-mono font-bold text-[var(--accent)]">{r.ch}</div>
                                    <div className="px-3 py-2.5 border-l border-[var(--border)] text-[var(--ink)] font-bold">{r.t}</div>
                                    <div className="px-3 py-2.5 border-l border-[var(--border)] text-[var(--ink-mid)] leading-[1.85]">{r.key}</div>
                                    <div className="px-3 py-2.5 border-l border-[var(--border)] flex flex-col gap-1">
                                        {r.back.map((b, j) => (
                                            <Link key={j} to={b.to} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-0.5 text-[10.5px] font-mono text-[var(--accent)] hover:underline no-underline">
                                                ↗ {b.label}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <p className="text-[11.5px] text-[var(--ink-light)] italic mt-2">
                            💡 點「↗」連結會在新分頁打開那一週——掃一眼就回來繼續寫。雛形級＝方向對、邏輯通順、還粗糙；不追求完美，W10 還會再修。
                        </p>
                    </div>

                    {/* 進到 Step 3 提示 */}
                    <div className="w7-notice w7-notice-gold">
                        ➡️ 看完地圖、知道每章對應素材在哪 → <strong>Step 2 診斷工具包</strong>是 W10 工具品質教學的預習（可快掃）→ <strong>Step 3 計畫書組裝工作坊</strong>開工寫 1-5 章。
                    </div>
                </div>
            ),
        },

        /* ─── Step 2：診斷工具包（新建，響應式表格） ─── */
        {
            title: '診斷工具包',
            icon: '🧰',
            content: (
                <div className="space-y-8 prose-zh">
                    <p className="text-[14px] text-[var(--ink-mid)] leading-relaxed max-w-[720px]">
                        這一頁是你的<strong className="text-[var(--ink)]">診斷工具箱</strong>——<strong>診斷尺</strong>（三大標準·設計原則）+ <strong>檢查清單</strong>（錯誤類型：3 共通 + 你的方法獨家）。Step 3 整合計畫書時，<strong>隨時點回這一頁查</strong>。老師投影也看這頁。
                    </p>

                    {/* 診斷尺 · 三大標準 — 手機 1 欄 / 桌機 3 欄（階層：方向 → 精度 → 執行） */}
                    <div>
                        <div className="mb-3">
                            <div className="text-[11px] font-mono text-[var(--ink-light)] uppercase tracking-wider">診斷尺 · 好工具三大標準</div>
                            <div className="text-[12px] text-[var(--ink-mid)] mt-1 leading-relaxed">
                                由根本到細節的三層關卡：<strong className="text-[var(--ink)]">方向 → 精度 → 執行</strong>。<span className="text-[var(--ink-mid)]">越上層錯，越沒救。</span>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {THREE_STANDARDS.map((s, i) => (
                                <div key={i} className="bg-white border border-[var(--border)] rounded-[var(--radius-unified)] p-4 flex flex-col">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="inline-block text-[10px] font-mono font-bold text-[var(--ink-light)] border border-[var(--border)] rounded px-1.5 py-0.5 tracking-wider">
                                            LAYER {s.layer}
                                        </span>
                                        <span className="text-[20px]">{s.emoji}</span>
                                    </div>
                                    <div className="mb-2">
                                        <div className="text-[15px] font-bold text-[var(--ink)] leading-tight">{s.plainQ}</div>
                                        <div className="text-[10px] font-mono text-[var(--ink-light)] mt-0.5">
                                            {s.name} · {s.en}
                                        </div>
                                    </div>
                                    <div className="text-[12px] text-[var(--ink-mid)] mb-3 leading-relaxed flex-1">{s.desc}</div>
                                    <div className="text-[11px] font-mono text-[var(--ink-light)] border-t border-dashed border-[var(--border)] pt-2 leading-relaxed">
                                        錯了的代價：<span className="text-[var(--ink-mid)]">{s.stakes}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 思考練習：用三層階層自己判斷（拿掉範例，改讓學生判斷） */}
                    <div>
                        <div className="text-[11px] font-mono text-[var(--ink-light)] uppercase tracking-wider mb-3">階層練習 · 用三大標準自己判斷</div>
                        <div className="space-y-4">
                            {/* 題 1：Layer 1 方向診斷 */}
                            <ThinkChoice
                                dataKey="w9-tc-layer1"
                                prompt="研究問題是「高中生每週運動幾小時？」以下哪一題犯了 Layer 1（方向）的錯？"
                                options={[
                                    { label: 'A', text: '你認為運動重要嗎？（非常重要／重要／普通／不重要）' },
                                    { label: 'B', text: '你每週大約運動幾小時？（0／1-3／4-6／7 小時以上）' },
                                    { label: 'C', text: '你最常做的運動類型？（球類／跑步／游泳／其他）' },
                                ]}
                                answer="A"
                                feedback="A 問的是「態度」（運動重不重要），但研究問題要的是「行為時數」——方向錯了，就算全班都答「非常重要」，你也得不到任何時數資料。Layer 1 錯了不能修，整題要重寫。B 和 C 雖然都不是「時數」本身，但至少測到行為變項，方向對。"
                                onAnswer={handleChoice('tc-w9-layer1', 'Layer 1 方向診斷')}
                            />

                            {/* 題 2：Layer 2 精度診斷 */}
                            <ThinkChoice
                                dataKey="w9-tc-layer2"
                                prompt="以下三題都在問「通勤狀況」（方向 Layer 1 都對），但哪一題因為用詞模糊犯了 Layer 2（精度）的錯？"
                                options={[
                                    { label: 'A', text: '你家離學校很近嗎？（近／普通／遠）' },
                                    { label: 'B', text: '你家到學校的通勤時間？（<15 分／15-30 分／30-60 分／>60 分）' },
                                    { label: 'C', text: '你主要的通勤方式？（走路／腳踏車／公車／汽車）' },
                                ]}
                                answer="A"
                                feedback="A 的「近／普通／遠」每個人定義不同——住 1 公里可能叫「近」，住 3 公里也可能叫「近」。同一個人今天心情好答「近」，下雨天答「遠」，結果不穩定。這就是 Layer 2 測不準。B 用分鐘分級、C 用明確類別，精度都可以接受。"
                                onAnswer={handleChoice('tc-w9-layer2', 'Layer 2 精度診斷')}
                            />

                            {/* 題 3：Layer 3 執行診斷 */}
                            <ThinkChoice
                                dataKey="w9-tc-layer3"
                                prompt="以下三題內容都合理（方向對、精度也足夠），但哪一題犯了 Layer 3（執行）的錯？"
                                options={[
                                    { label: 'A', text: '請一位同學每天中午 12:00 主動回報他今天有沒有分心，持續 30 天' },
                                    { label: 'B', text: '上週你超過 12 點睡的有幾天？（0 / 1-2 / 3-4 / 5+）' },
                                    { label: 'C', text: '請花 5 分鐘填寫這份 15 題的問卷' },
                                ]}
                                answer="A"
                                feedback="A 的問題不在「問什麼」，而在「做得到嗎」——沒有人會每天主動回報 30 天，這種設計執行率趨近於零。就算題目設計完美，沒有資料等於白做。Layer 3 最好修，只要把規模縮小（例：改成 5 天）或換方法（例：研究者每天下午問一次）就能救。"
                                onAnswer={handleChoice('tc-w9-layer3', 'Layer 3 執行診斷')}
                            />
                        </div>
                        <div className="mt-3 text-[11px] text-[var(--ink-light)] leading-relaxed">
                            💡 做完三題你會發現階層規律：<strong className="text-[var(--ink-mid)]">方向錯 → 重寫；測不準 → 換具體數字；做不到 → 砍規模</strong>。越上層錯，救起來越麻煩。
                        </div>
                    </div>

                    {/* 檢查清單 · 錯誤類型（5 方法頁籤統一 3 欄表：類型 / 徵狀 / 怎麼改） */}
                    <div>
                        <div className="text-[11px] font-mono text-[var(--ink-light)] uppercase tracking-wider mb-3">檢查清單 · 錯誤類型（3 條共通 + 你的方法獨家）</div>

                        {/* 方法頁籤 bar */}
                        <div className="flex flex-wrap gap-2 mb-3">
                            {['questionnaire', 'interview', 'observation', 'experiment', 'literature'].map((id) => (
                                <button
                                    key={id}
                                    type="button"
                                    onClick={() => setPitfallTab(id)}
                                    className={`text-[12px] font-bold px-3 py-1.5 rounded-[6px] border transition-colors ${pitfallTab === id
                                        ? 'bg-[var(--ink)] text-white border-[var(--ink)]'
                                        : 'bg-white text-[var(--ink-mid)] border-[var(--border)] hover:border-[var(--ink)]'
                                        }`}
                                >
                                    {METHOD_PITFALLS[id].label}
                                </button>
                            ))}
                        </div>

                        {/* 桌機：table 版（3 欄：類型 / 徵狀 / 怎麼改） */}
                        <div className="hidden md:block bg-white border border-[var(--border)] rounded-[var(--radius-unified)] overflow-hidden">
                            <div className="grid grid-cols-[1.2fr_2fr_2fr] bg-[var(--paper-warm)] border-b border-[var(--border)] text-[11px] font-mono font-bold text-[var(--ink)]">
                                <div className="px-4 py-2.5">類型</div>
                                <div className="px-4 py-2.5 border-l border-[var(--border)]">徵狀（長這樣是病）</div>
                                <div className="px-4 py-2.5 border-l border-[var(--border)]">怎麼改</div>
                            </div>
                            {[...COMMON_ERRORS, ...(METHOD_PITFALLS[pitfallTab]?.items || [])].map((e, i) => {
                                const isCommon = i < COMMON_ERRORS.length;
                                return (
                                    <div key={i} className={`grid grid-cols-[1.2fr_2fr_2fr] border-b border-[var(--border)] last:border-b-0 text-[12px] ${isCommon ? '' : 'bg-[var(--paper-warm)]/50'}`}>
                                        <div className="px-4 py-3 flex items-center gap-2">
                                            <span className="text-[16px]">{e.icon}</span>
                                            <span className="font-bold" style={{ color: e.color }}>{e.name}</span>
                                            {!isCommon && <span className="ml-1 text-[9px] font-mono text-[var(--ink-light)] bg-[var(--ink)]/5 px-1 py-0.5 rounded">獨家</span>}
                                        </div>
                                        <div className="px-4 py-3 border-l border-[var(--border)] text-[var(--ink-mid)] leading-relaxed">{e.desc}</div>
                                        <div className="px-4 py-3 border-l border-[var(--border)] text-[var(--success)] leading-relaxed">{e.fix}</div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* 手機：卡片堆疊版 */}
                        <div className="md:hidden space-y-3">
                            {[...COMMON_ERRORS, ...(METHOD_PITFALLS[pitfallTab]?.items || [])].map((e, i) => {
                                const isCommon = i < COMMON_ERRORS.length;
                                return (
                                    <div key={i} className={`border rounded-[var(--radius-unified)] overflow-hidden ${isCommon ? 'bg-white border-[var(--border)]' : 'bg-[var(--paper-warm)]/60 border-[var(--ink)]/15'}`}>
                                        <div className="px-4 py-3 border-b border-[var(--border)] flex items-center gap-2">
                                            <span className="text-[18px]">{e.icon}</span>
                                            <span className="text-[14px] font-bold flex-1" style={{ color: e.color }}>{e.name}</span>
                                            {!isCommon && <span className="text-[9px] font-mono text-[var(--ink-light)] bg-[var(--ink)]/5 px-1.5 py-0.5 rounded">獨家</span>}
                                        </div>
                                        <div className="p-4 space-y-2 text-[12px]">
                                            <div>
                                                <div className="text-[10px] font-mono font-bold text-[var(--ink-light)] mb-0.5">徵狀</div>
                                                <div className="text-[var(--ink-mid)] leading-relaxed">{e.desc}</div>
                                            </div>
                                            <div>
                                                <div className="text-[10px] font-mono font-bold text-[var(--success)] mb-0.5">怎麼改</div>
                                                <div className="text-[var(--success)] leading-relaxed">{e.fix}</div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="mt-3 text-[11px] text-[var(--ink-light)] leading-relaxed">
                            💡 前 3 條（誘導性／雙重／假開放）五方法都會犯；後 2~3 條是你這方法的獨家陷阱。切換上方頁籤可查看別組的狀況。
                        </div>
                    </div>

                    {/* 錯誤類型練習：3 題扣合誘導性／雙重／假開放 */}
                    <div>
                        <div className="text-[11px] font-mono text-[var(--ink-light)] uppercase tracking-wider mb-3">錯誤類型練習 · 對照上方三類共通錯誤</div>
                        <div className="space-y-4">
                            <ThinkChoice
                                dataKey="w9-tc-err-inducing"
                                prompt="以下哪一題犯了「誘導性提問」的錯？"
                                options={[
                                    { label: 'A', text: '你認為嚴重影響專注力的手機使用方式是？（請勾選）' },
                                    { label: 'B', text: '你每天使用手機的時數是？（<1 / 1-3 / 3-6 / 6+ 小時）' },
                                    { label: 'C', text: '你最常用手機做什麼？（社群 / 遊戲 / 影片 / 通訊 / 其他）' },
                                ]}
                                answer="A"
                                feedback="A 的「嚴重影響」已經預設了「手機有害」的立場，受試者不好意思選「沒有影響」。中性改寫：「你覺得手機使用對專注力有什麼影響？（正面／負面／沒影響）」"
                                onAnswer={handleChoice('tc-w9-err-inducing', '誘導性提問診斷')}
                            />

                            <ThinkChoice
                                dataKey="w9-tc-err-double"
                                prompt="以下哪一題犯了「雙重問題」的錯（一題問兩件事）？"
                                options={[
                                    { label: 'A', text: '你同意學校應該禁止攜帶手機，並且加強網路過濾嗎？（同意／不同意）' },
                                    { label: 'B', text: '你一週運動幾次？' },
                                    { label: 'C', text: '你最常用的學習 App 是？' },
                                ]}
                                answer="A"
                                feedback="A 問了兩件獨立的事（禁止攜帶、加強過濾），受試者可能同意其中一件、反對另一件，但被迫選一個答案。拆成兩題才能精準測到立場。"
                                onAnswer={handleChoice('tc-w9-err-double', '雙重問題診斷')}
                            />

                            <ThinkChoice
                                dataKey="w9-tc-err-fakeopen"
                                prompt="以下哪一題看似「開放式」但其實「預設了答案方向」？"
                                options={[
                                    { label: 'A', text: '你覺得線上學習有什麼缺點？' },
                                    { label: 'B', text: '你對線上學習的看法是？' },
                                    { label: 'C', text: '和實體上課相比，線上學習對你而言有什麼不同？' },
                                ]}
                                answer="A"
                                feedback="A 表面開放，實則只問「缺點」——假設受訪者已經認為線上學習有缺點。學生即使覺得沒缺點，也會被迫編一個出來。C 是真開放（問「不同」而非「缺點」），B 是中性。"
                                onAnswer={handleChoice('tc-w9-err-fakeopen', '假開放真預設診斷')}
                            />
                        </div>
                        <div className="mt-3 text-[11px] text-[var(--ink-light)] leading-relaxed">
                            💡 這三類是<strong className="text-[var(--ink-mid)]">所有方法都會犯</strong>的共通錯誤，不分問卷／訪談／實驗／觀察／文獻。檢核工具時一定要逐一對照。
                        </div>
                    </div>

                    {/* 方法獨家練習：訪談問法（保留作為補充） */}
                    <ThinkChoice
                        dataKey="w9-tc3"
                        prompt={THINK_CHOICES[1].prompt}
                        options={THINK_CHOICES[1].options}
                        answer={THINK_CHOICES[1].answer}
                        feedback={THINK_CHOICES[1].feedback}
                        onAnswer={handleChoice(THINK_CHOICES[1].id, THINK_CHOICES[1].prompt)}
                    />

                    {/* 下節預告 */}
                    <div className="bg-[var(--ink)] rounded-[var(--radius-unified)] p-6 text-white">
                        <div className="flex items-center gap-2 mb-3">
                            <AlertTriangle size={16} className="text-[var(--gold)]" />
                            <span className="font-bold text-[14px]">下節準備：Step 3 計畫書組裝工作坊</span>
                        </div>
                        <p className="text-[13px] text-[rgba(255,255,255,0.7)] leading-relaxed mb-4">
                            第二節把今天學到的診斷尺與檢查清單，用來整合 W8 老師給你的建議、填寫計畫書第一章。下課前老師會在 Google Classroom 發你對應方法的計畫書 docx 副本——先打開看結構。
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {METHOD_OPTIONS.map((m) => (
                                <span key={m.id} className="bg-white/10 text-white text-[12px] px-3 py-1.5 rounded-full font-bold">{m.label}</span>
                            ))}
                        </div>
                    </div>
                </div>
            ),
        },

        /* ─── Step 3：計畫書組裝工作坊（W9 第二節重點：修計畫書第一章） ─── */
        {
            title: '計畫書組裝工作坊',
            icon: '📋',
            content: (
                <div className="space-y-8 prose-zh">
                    {/* 開場 */}
                    <p className="text-[14px] text-[var(--ink-mid)] leading-relaxed max-w-[720px]">
                        第一節學了<strong className="text-[var(--ink)]">診斷尺</strong>（三大標準）與<strong className="text-[var(--ink)]">檢查清單</strong>（錯誤類型）——那是「診斷」。第二節回到<strong className="text-[var(--ink)]">實作</strong>：把 W2–W8 寫過的東西整合進研究計畫書。
                    </p>
                    <div className="w7-notice w7-notice-gold">
                        🎯 <strong>本節目標：完成計畫書第 1-5 章雛形</strong>（五章地基工程）——把 W2-W8 寫過的東西整合進來，W8 老師回饋同步修進去。第六章以後留到 W10 做工具設計。
                    </div>

                    {/* 🤝 小組分章工作流（避免全組擠在第一章、解決時間不夠的真實問題） */}
                    <div className="p-5 rounded-[var(--radius-unified)] border-2 border-[#0EA5E9] bg-[#F0F9FF] max-w-[720px]">
                        <p className="text-[14px] font-bold text-[#075985] mb-2">🤝 50 分鐘要寫五章——分章工作流（不要全組擠著寫第一章）</p>
                        <p className="text-[12.5px] text-[#0C4A6E] leading-relaxed mb-3">
                            每章寫到「<strong>雛形</strong>」就 OK——能看出方向、邏輯通順但還粗糙。<strong>不用追求完美</strong>，下節 W10 還會再修一輪。
                        </p>
                        <GroupSizeSelector
                            items={{
                                1: {
                                    title: '1 人（Solo）',
                                    content: (
                                        <ul className="list-disc pl-4 space-y-0.5">
                                            <li>第 1、3 章先寫到雛形（最關鍵）</li>
                                            <li>第 2、4、5 章列大綱</li>
                                            <li>下節 W10 前找老師個別對焦</li>
                                        </ul>
                                    ),
                                },
                                2: {
                                    title: '2 人組',
                                    content: (
                                        <ul className="list-disc pl-4 space-y-0.5">
                                            <li>A：第 1-3 章（題目／文獻／方法）</li>
                                            <li>B：第 4-5 章（變項／對象）+ 統整</li>
                                        </ul>
                                    ),
                                },
                                3: {
                                    title: '3 人組',
                                    content: (
                                        <ul className="list-disc pl-4 space-y-0.5">
                                            <li>A：第 1-2 章（題目 + 文獻）</li>
                                            <li>B：第 3-4 章（方法 + 變項）</li>
                                            <li>C：第 5 章 + 統整／同步檢查邏輯一致</li>
                                        </ul>
                                    ),
                                },
                                4: {
                                    title: '4 人組',
                                    content: (
                                        <ul className="list-disc pl-4 space-y-0.5">
                                            <li>A：第 1 章（題目／動機／問題）</li>
                                            <li>B：第 2 章（文獻探討）</li>
                                            <li>C：第 3-4 章（方法 + 變項）</li>
                                            <li>D：第 5 章 + 統整／跨章邏輯檢查</li>
                                        </ul>
                                    ),
                                },
                            }}
                        />
                        <p className="text-[11.5px] text-[#0C4A6E] leading-relaxed mt-3 pt-2 border-t border-[#0EA5E9]/30">
                            ⏱️ <strong>時間建議</strong>：前 5 分鐘分工 + 對齊整體方向 → 各自寫 30 分鐘 → 最後 10 分鐘互讀統整。
                        </p>
                    </div>

                                        {/* 📚 文獻策略卡（承認 W8 合題後 W5/W6 文獻可能失效） */}
                    <div className="p-5 rounded-[var(--radius-unified)] border-2 border-[#D97706] bg-[#FEF3C7] max-w-[720px]">
                        <p className="text-[14px] font-bold text-[#92400E] mb-2">📚 第二章文獻怎麼處理？（W8 合題後 W5/W6 找的文獻可能要重查）</p>
                        <p className="text-[12.5px] text-[#78350F] leading-relaxed mb-3">
                            如果你 W8 合題後題目跟原本差很多，W5/W6 找的文獻就**對不上新題目**了。這是合理現象——但<strong>課堂時間 50 分鐘塞不下「重新查文獻」</strong>。
                        </p>
                        <div className="bg-white border border-[#D97706]/30 rounded-[6px] p-3 mb-2">
                            <p className="text-[12px] font-bold text-[#92400E] mb-1">⏱️ 課堂內怎麼辦？</p>
                            <ul className="text-[11.5px] text-[#78350F] leading-[1.7] list-disc pl-4 space-y-0.5">
                                <li>用 W5/W6 既有文獻先寫第二章「方向骨架」（哪怕只 1 篇也行）</li>
                                <li>不夠的部分標註「待補」<strong>不要硬擠時間查</strong></li>
                                <li>進度自評勾「方向」或「雛形」即可，AI 檢核會給對應深度的回饋</li>
                            </ul>
                        </div>
                        <div className="bg-white border border-[#D97706]/30 rounded-[6px] p-3">
                            <p className="text-[12px] font-bold text-[#92400E] mb-1">🏠 課後分工查文獻（W10 前完成）</p>
                            <ul className="text-[11.5px] text-[#78350F] leading-[1.7] list-disc pl-4 space-y-0.5">
                                <li><strong>3 人組</strong>：每人查 1 篇符合新題目的 A/B 級文獻 → 共 3 篇</li>
                                <li><strong>2 人組</strong>：每人查 1-2 篇 → 共 2-4 篇</li>
                                <li><strong>Solo</strong>：自己查 2 篇 + 帶到下次老師對焦</li>
                                <li>關鍵字參考 AI 檢核回覆裡會給的「3 個搜尋組合」（在 Prompt 第 4 條已要求 AI 列）</li>
                            </ul>
                        </div>
                    </div>

                    {/* 5 種計畫書模板：自己的粗藍框，其他作「也認識一下」 */}
                    <div>
                        <h4 className="font-serif text-[18px] md:text-[20px] font-bold text-[var(--ink)] mb-2">5 種研究方法的計畫書模板</h4>
                        <p className="text-[13px] text-[var(--ink-mid)] leading-relaxed mb-3">
                            老師會在 <strong>Google Classroom</strong> 發你<strong className="text-[var(--ink)]">自己方法</strong>的 docx 副本（粗藍框那份）。但這是研究方法課——下方 5 種都列出，<strong className="text-[var(--ink)]">看別組用什麼模板，是這節該做的事</strong>。手動切換可點下方按鈕變更主框。
                        </p>
                        <div className="flex flex-wrap gap-2 mb-4">
                            {METHOD_OPTIONS.map((m) => (
                                <button
                                    key={m.id}
                                    type="button"
                                    onClick={() => handleMethodSelect(m.id)}
                                    className={`text-[12px] font-bold px-3 py-1.5 rounded-[6px] border transition-colors ${selectedMethod === m.id
                                        ? 'bg-[var(--ink)] text-white border-[var(--ink)]'
                                        : 'bg-white text-[var(--ink-mid)] border-[var(--border)] hover:border-[var(--ink)]'
                                        }`}
                                >
                                    {m.label}
                                </button>
                            ))}
                        </div>
                        {(() => {
                            const ALL_PLANS = [
                                {
                                    id: 'questionnaire', filename: '01_問卷研究法_計畫書',
                                    brief: '量化研究；核心是「變項 → 問卷題目」。第二章起要定變項、做題目設計。',
                                    planUrl: 'https://docs.google.com/document/d/1wIRi36FEn2LEEesU4rb24IhSEMxpFHGs_K-hId5tHxA/copy',
                                    toolUrl: 'https://docs.google.com/document/d/1tu-WF_JitJIwBZBHrrgm3MeFMDykpm_gGZoyrB4UkOI/copy',
                                    toolName: '01_問卷_工具',
                                },
                                {
                                    id: 'interview', filename: '02_訪談研究法_計畫書',
                                    brief: '質性研究；核心是「訪談主題框架」。第二章起要拆主題、設計訪綱。',
                                    planUrl: 'https://docs.google.com/document/d/18t_rBWbwZoHfkq871ObgTV1qtNp-TZ9RMJJ6MQOfwtI/copy',
                                    toolUrl: 'https://docs.google.com/document/d/1BU6XyNxdwng6I15pwYXfRs-zwKgDDyF_EVc2T6uUCrs/copy',
                                    toolName: '02_訪綱_工具',
                                },
                                {
                                    id: 'experiment', filename: '03_實驗研究法_計畫書',
                                    brief: '量化研究；核心是「自變項/依變項/控制變項」。第二章起要定變項、設計實驗流程。',
                                    planUrl: 'https://docs.google.com/document/d/1IBfMJCuPZ_2sezzs2xdAgvFJq1WcHcbssaBnbTyv14o/copy',
                                    toolUrl: 'https://docs.google.com/document/d/1evcQ6-97mhkhsLz4RHDEGp9P_LkjAeIKUcvusBtc0d8/copy',
                                    toolName: '03_實驗_工具設計表',
                                },
                                {
                                    id: 'observation', filename: '04_觀察研究法_計畫書',
                                    brief: '核心是「行為操作型定義」。第二章起要把抽象行為定義到別人可重複觀察。',
                                    planUrl: 'https://docs.google.com/document/d/1PHC3w--zJ8yUw2gSwWkO7rMjQoYSmj9fj46h_-GX4bI/copy',
                                    toolUrl: 'https://docs.google.com/spreadsheets/d/1QMqW2AAlc1s_gNfiY3jkFCy0CHpYz2GX9ZmgpShUm7s/copy',
                                    toolName: '04_觀察紀錄表_工具',
                                },
                                {
                                    id: 'literature', filename: '05_文獻分析法_計畫書',
                                    brief: '文獻本身就是對象。第一章必選 4 子類型（歷史／內容／論述／敘事），第六章工具依子類型分流。',
                                    planUrl: 'https://docs.google.com/document/d/1q-nBzHJoeFvyBX8YG2rZgOcmiQAyJ69_S0PaP2uvPaY/copy',
                                    toolUrl: 'https://drive.google.com/drive/folders/1-UtVZM8dyo20s2vbnx3UCWm-lR8YROU6',
                                    toolName: '05_文獻分析_工具（資料夾，依子類型挑 05a-d）',
                                },
                            ];
                            return (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    {ALL_PLANS.map((p) => {
                                        const isMine = p.id === selectedMethod;
                                        return (
                                            <div
                                                key={p.id}
                                                className={
                                                    isMine
                                                        ? 'bg-white border-2 border-[var(--accent)] rounded-[var(--radius-unified)] p-4 md:col-span-2'
                                                        : 'bg-[var(--paper-warm)] border border-[var(--border)] rounded-[var(--radius-unified)] p-3 opacity-80'
                                                }
                                            >
                                                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                                                    {isMine && (
                                                        <span className="text-[10px] font-mono font-bold bg-[var(--accent)] text-white px-2 py-0.5 rounded-[3px]">你的方法</span>
                                                    )}
                                                    <span className={isMine ? 'font-bold text-[14px] text-[var(--ink)]' : 'font-bold text-[12.5px] text-[var(--ink-mid)]'}>{p.filename}</span>
                                                </div>
                                                <p className={isMine ? 'text-[12.5px] text-[var(--ink-mid)] leading-relaxed mb-3' : 'text-[11.5px] text-[var(--ink-light)] leading-[1.6]'}>{p.brief}</p>
                                                {isMine && (
                                                    <a
                                                        href={p.planUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center justify-center gap-2 bg-[var(--accent)] hover:opacity-90 text-white rounded-[8px] px-4 py-2.5 no-underline transition-opacity text-[12.5px] font-bold"
                                                    >
                                                        📄 開啟計畫書副本（Make a copy）→
                                                    </a>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            );
                        })()}
                        {!selectedMethod && (
                            <div className="mt-3 bg-[var(--paper-warm)] border border-dashed border-[var(--border)] rounded-[var(--radius-unified)] p-3 text-[12px] text-[var(--ink-light)]">
                                👆 還沒選方法？先看 5 種計畫書長什麼樣，再點上方按鈕選自己的。
                            </div>
                        )}
                        {/* 補充方法提示卡（W8 登記過才顯示） */}
                        {w8Secondary && (
                            <div className="mt-3 bg-[#ECFDF5] border border-[#10B981] rounded-[var(--radius-unified)] p-3 text-[12px] text-[#065F46] leading-relaxed">
                                🧩 你在 W8 登記了補充方法：<strong>{w8Secondary}</strong>。
                                <strong className="block mt-1">本週計畫書以「主方法」為骨架</strong>——補充方法寫在「第三章 研究方法」段落中說明（例：「主用問卷，輔以 3-5 位深度訪談補質性脈絡」），不另起爐灶。
                            </div>
                        )}
                    </div>

                    {/* 計畫書章節地圖 */}
                    <div>
                        <h4 className="font-serif text-[16px] md:text-[18px] font-bold text-[var(--ink)] mb-2">計畫書章節地圖</h4>
                        <p className="text-[13px] text-[var(--ink-mid)] leading-relaxed mb-3">
                            你不是「從零」寫一本計畫書，是把前幾週的成果<strong className="text-[var(--ink)]">整合</strong>進去。對照一下哪幾章來自哪週：
                        </p>
                        <div className="bg-white border border-[var(--border)] rounded-[var(--radius-unified)] overflow-hidden">
                            <div className="grid grid-cols-[70px_1fr_auto] bg-[var(--paper-warm)] border-b border-[var(--border)] text-[11px] font-mono font-bold text-[var(--ink)]">
                                <div className="px-4 py-2.5">章</div>
                                <div className="px-4 py-2.5 border-l border-[var(--border)]">主要內容</div>
                                <div className="px-4 py-2.5 border-l border-[var(--border)]">來源</div>
                            </div>
                            {[
                                { ch: '一', title: '研究主題基本資訊', src: 'W2 動機 + W3 問題 + W8 對象' },
                                { ch: '二', title: '關鍵詞／行為操作型定義', src: 'W9 本節' },
                                { ch: '三', title: '文獻回顧', src: 'W5–W6' },
                                { ch: '四', title: '變項／主題／維度設計', src: 'W9–W10' },
                                { ch: '五', title: '對象與抽樣', src: 'W8' },
                                { ch: '六', title: '工具設計', src: 'W10' },
                                { ch: '七～九', title: '實施／分析／結論', src: 'W10 定稿' },
                                { ch: '十', title: '研究倫理', src: 'W9 本節' },
                                { ch: '十一', title: '時程表 W9–W17', src: '本節' },
                                { ch: '十二', title: 'AI 使用聲明', src: '本節 + 後續更新' },
                                { ch: '十三', title: '參考文獻', src: 'W5–W16 逐步補' },
                            ].map((r, i) => (
                                <div key={i} className="grid grid-cols-[70px_1fr_auto] border-b border-[var(--border)] last:border-b-0 text-[12px]">
                                    <div className="px-4 py-2.5 font-mono font-bold text-[var(--accent)]">{r.ch}</div>
                                    <div className="px-4 py-2.5 border-l border-[var(--border)] text-[var(--ink)]">{r.title}</div>
                                    <div className="px-4 py-2.5 border-l border-[var(--border)] text-[var(--ink-mid)] font-mono text-[11px] whitespace-nowrap">{r.src}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 五章地基工程 · 進度分級 */}
                    <div>
                        <h4 className="font-serif text-[16px] md:text-[18px] font-bold text-[var(--ink)] mb-2">
                            五章地基工程 · 本節要寫到的章節
                        </h4>
                        <p className="text-[13px] text-[var(--ink-mid)] leading-relaxed mb-3">
                            <strong className="text-[var(--ink)]">所有內容寫在計畫書 docx 上</strong>，網頁只做進度勾選與 AI 檢核紀錄，不重寫 docx 內容。W8 老師建議直接在 docx 第一章各欄內修正即可。
                        </p>
                        <div className="bg-white border border-[var(--border)] rounded-[var(--radius-unified)] p-5 space-y-4">
                            <div>
                                <div className="text-[11px] font-mono font-bold text-[var(--success)] uppercase tracking-wider mb-2">✅ 必達（課堂完成）</div>
                                <ul className="text-[13px] text-[var(--ink-mid)] space-y-1 list-disc pl-5">
                                    <li><strong className="text-[var(--ink)]">第一章</strong>：題目／動機／目的／主問題／子問題／對象（6 格，整合 W2/W3/W8）</li>
                                    <li><strong className="text-[var(--ink)]">第二章</strong>：3 個關鍵詞操作定義（剛學完診斷尺正好用）</li>
                                    <li><strong className="text-[var(--ink)]">第五章</strong>：對象 + 預計人數 + 抽樣方式（搬 W8）</li>
                                </ul>
                            </div>
                            <div>
                                <div className="text-[11px] font-mono font-bold text-[var(--accent)] uppercase tracking-wider mb-2">🔶 骨架即可（課堂起草）</div>
                                <ul className="text-[13px] text-[var(--ink-mid)] space-y-1 list-disc pl-5">
                                    <li><strong className="text-[var(--ink)]">第三章</strong>：至少列 2 篇文獻的作者／年份／結論（骨架即可，差異段落課後寫）</li>
                                    <li><strong className="text-[var(--ink)]">第四章</strong>：變項／主題／維度清單（依方法拆 3-5 個，操作定義課後補）</li>
                                </ul>
                            </div>
                            <div>
                                <div className="text-[11px] font-mono font-bold text-[var(--danger)] uppercase tracking-wider mb-2">⚠️ 課後補齊（W10 第一節前必達）</div>
                                <ul className="text-[13px] text-[var(--ink-mid)] space-y-1 list-disc pl-5">
                                    <li>第三章文獻補齊 2-3 篇 + 寫「與本研究差異」</li>
                                    <li>第四章變項／主題／維度定版 + 每個都有操作定義</li>
                                    <li>跑 AI 檢核 Prompt（見下方）+ 補 W9 AIRED 的 R 欄位</li>
                                    <li>上傳計畫書到 Google Classroom</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* AI 工作坊（必做）· AI 思考模式審第 1-5 章 */}
                    <div className="space-y-4">
                        <div className="bg-[var(--ink)] rounded-[var(--radius-unified)] overflow-hidden" style={{ color: '#fff' }}>
                            <div className="px-5 py-3 bg-[var(--danger)] flex items-center gap-2" style={{ color: '#fff' }}>
                                <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#fff' }}>AI 工作坊 · 必做</span>
                                <span style={{ fontWeight: 700, fontSize: 14, marginLeft: 4, color: '#fff' }}>🤖 用 AI 思考模式檢核（或學寫）第 1-5 章</span>
                            </div>
                            <div className="p-5" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                <p style={{ fontSize: 13, lineHeight: 1.9, color: 'rgba(255,255,255,0.9)' }}>
                                    本節結束前選一個 AI 使用模式，複製下方 Prompt，回家貼進<strong style={{ color: '#fff', fontWeight: 700 }}>你慣用的 AI（開啟深度思考／推理模式）</strong>。
                                </p>
                                <p style={{ fontSize: 12, lineHeight: 1.9, color: 'rgba(255,255,255,0.7)' }}>
                                    💡 <strong style={{ color: 'rgba(255,255,255,0.95)', fontWeight: 700 }}>兩種模式：</strong>有計畫書初稿 → 驗收型（AI 找盲點）；寫不出某幾章 → 教學型（AI 給範例 + 拆步驟）。
                                </p>
                            </div>
                        </div>

                        {/* AI 協作三原則（W9 角色：嚴格教練） */}
                        <AICollaborationPrinciples week="9" role="critic" compact={false} />

                        {/* AI 模式選擇 */}
                        <AIModePicker week="9" taskName="計畫書檢核" onChange={setW9AiMode} />

                        {/* 教學型：寫不出某幾章 → AI 給範例 */}
                        {w9AiMode === 'teach' && (
                            <div className="rounded-[var(--radius-unified)] border-2 border-[#86EFAC] bg-[#F0FDF4] p-5 space-y-3">
                                <p className="text-[14px] font-bold text-[#166534]">🎓 教學型 Prompt（從零到一）</p>
                                <p className="text-[12px] text-[#166534] leading-relaxed">
                                    某幾章完全不會寫？把你卡關的章節貼上，請 Gemini 給範例。記得：<strong>看完範例自己寫一次</strong>，不要直接抄。
                                </p>
                                <pre className="bg-[#0F172A] text-[#E2E8F0] text-[11.5px] leading-[1.7] p-3 rounded-[6px] whitespace-pre-wrap font-mono overflow-x-auto">{`我在寫高中專題研究計畫書，需要寫第 1-5 章，但有幾章我完全不會寫。

【我的研究】
- 研究方法：問卷／訪談／實驗／觀察／文獻
- 研究問題：___
- 主要發現方向：___（如果還沒做完，寫預期方向）

【我卡住的章節】
___（例：第三章文獻探討、第四章變項定義）

【請你做】
1. 用我的研究主題，示範這幾章的「極簡範例」（每章 5-8 行）
2. 解釋這幾章的「該寫什麼、不該寫什麼」
3. 給我一個填空模板，我可以照著填

【不要做】
- 不要替我寫完整章節
- 我會看完範例後自己寫一次再給你檢查`}</pre>
                                <p className="text-[11px] text-[#166534] italic leading-relaxed">
                                    💡 看完 AI 範例後，回到 docx 自己寫一次，再切回「驗收型」讓 AI 檢核。
                                </p>
                            </div>
                        )}

                        {/* 驗收型：有初稿 → AI 找盲點（保留現有 W9AiCheckPromptBox） */}
                        {w9AiMode === 'verify' && <W9AiCheckPromptBox />}

                        {!w9AiMode && (
                            <div className="rounded-[var(--radius-unified)] border border-[var(--border)] bg-[var(--paper-warm)] p-3">
                                <p className="text-[12px] text-[var(--ink-mid)] leading-relaxed">
                                    ☝️ 上方先選一個 AI 使用模式：寫不出來選🎓教學型；有初稿了選🥊驗收型。
                                </p>
                            </div>
                        )}

                        {/* AI 建議判斷紀錄 */}
                        <ThinkRecord
                            dataKey="w9-plan-ai-check"
                            prompt="AI 互動後的判斷紀錄（課後 AI 跑完後補）"
                            defaultTemplate={'AI 指出的主要問題（驗收型）/ AI 給的範例（教學型）：\n1. \n2. \n3. \n\n我的決定：\n・採納：\n・不採納：\n・部分採納：\n（每項記得寫理由 / 教學型寫「我自己改寫的版本」）'}
                            placeholder="例：採納第 1、3 點因為本來就漏寫；不採納第 2 點因為抽樣已是學期極限"
                            rows={10}
                        />

                        {/* 完整對話繳交（W9 多輪互動，必繳） */}
                        <AIDialogSubmission week="9" taskName="計畫書檢核對話" required={true} />

                        {/* W9 完整 AIRED */}
                        <AIREDNarrative
                            week="9"
                            hint="本節預想式填 A/I/E/D；R 回家跑完 AI 思考模式再補"
                            optional={false}
                        />
                    </div>

                    {/* 五章進度 checklist */}
                    <Checklist
                        dataKey="w9-plan-ch1-checklist"
                        prompt="本節繳交驗收（勾完才算通過）"
                        items={[
                            '第一章：6 格全填（docx）',
                            '第二章：3 個關鍵詞操作定義（docx）',
                            '第五章：對象／人數／抽樣方式（docx）',
                            '第三章：至少 2 篇文獻基本資料（docx，骨架）',
                            '第四章：變項／主題／維度清單（docx，骨架）',
                            '本節結束前：AI 檢核 Prompt 已複製',
                            'W8 老師的建議在 docx 上已納入修正',
                        ]}
                    />

                    {/* 下一步 */}
                    <div className="w7-notice w7-notice-teal">
                        ✅ 本節完成 → <strong>Step 4 寫 W9 AIRED</strong>（A/I/E/D 先寫預想版、R 回家 AI 跑完再補）+ 規劃課後補齊時程。<br/>
                        ⚠️ <strong>記得把 AI 檢核 Prompt 複製帶回家跑</strong>，跑完後回 Step 4 補完 AIRED R 欄位。
                    </div>
                </div>
            ),
        },

        /* ─── Step 4：回顧與繳交（時間承諾 + 課後計畫書撰寫） ─── */
        {
            title: '回顧與繳交',
            icon: '📋',
            content: (
                <div className="space-y-8 prose-zh">
                    {/* 1. 檢核清單（先確認收穫） */}
                    <div className="bg-white border border-[var(--border)] rounded-[var(--radius-unified)] overflow-hidden">
                        <div className="p-4 px-5 bg-[var(--paper-warm)] border-b border-[var(--border)] font-bold text-[13px]">
                            ✅ W9 完成後，請確認
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-[1px] bg-[var(--border)]">
                            {[
                                '學會三大標準判斷工具品質（方向 / 精度 / 執行）',
                                '辨識錯誤類型（誘導性、雙重問題、假開放）',
                                '完成計畫書第 1-5 章雛形（五章地基工程）',
                                '整合 W8 老師建議到對應章節',
                                '規劃好 W9 → W10 計畫書撰寫時程',
                            ].map((item, i) => (
                                <div key={i} className="p-4 px-6 bg-white flex items-start gap-3">
                                    <CheckCircle2 size={16} className="text-[var(--success)] mt-0.5 flex-shrink-0" />
                                    <span className="text-[13px] text-[var(--ink-mid)]">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 2. 一鍵複製（AIRED 與 AI 檢核紀錄已在 Step 3 完成） */}
                    {/* 本週結束，你應該要會 — B 標準格式 */}
                    <div className="bg-white border border-[var(--border)] rounded-[var(--radius-unified)] overflow-hidden mb-4">
                        <div className="p-4 px-5 bg-[var(--paper-warm)] border-b border-[var(--border)] font-bold text-[13px]">
                            ✅ 本週結束，你應該要會
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-[1px] bg-[var(--border)]">
                            {[
                                                '把 W2-W8 寫過的東西整合到計畫書 1-5 章雛形',
                                                '用 AI 檢核四個維度（方向／精度／結構／陷阱）逐章自查',
                                                '看別組用什麼方法的計畫書模板，知道 5 種方法的差異',
                                                '排定 W9-W10 之間的計畫書撰寫時間（避免拖到上課才寫）',
                            ].map((item, i) => (
                                <div key={i} className="p-4 px-5 bg-white flex items-start gap-3">
                                    <span className="text-[var(--success)] text-[16px] mt-0.5 flex-shrink-0">✓</span>
                                    <span className="text-[13px] text-[var(--ink-mid)] leading-relaxed">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <ExportButton
                        weekLabel="W9 工具設計基礎"
                        fields={EXPORT_FIELDS}
                        choices={choiceResults}
                    />

                    {/* 5. 遊戲彩蛋（黑底用 inline style 確保白字勝過 prose-zh cascade） */}
                    <div className="bg-[var(--ink)] border-l-4 border-[var(--danger)] p-6 rounded-r-lg shadow-xl" style={{ color: '#fff' }}>
                        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8, color: '#fff' }}>
                            <ShieldAlert className="text-[var(--danger)]" size={20} />
                            R.I.B. 單元挑戰：行動代號防線
                        </h3>
                        <p style={{ fontSize: 14, marginBottom: 16, color: 'rgba(255,255,255,0.85)' }}>
                            10 個充滿致命設計缺陷的研究病例。揪出錯誤並開立正確處方，確保研究方法無懈可擊。
                        </p>
                        <Link to="/game/rx-inspector" className="inline-flex items-center gap-2 bg-[var(--danger)] px-4 py-2 rounded font-bold text-sm hover:opacity-90 transition-colors" style={{ color: '#fff' }}>
                            進入防線 <ArrowRight size={14} />
                        </Link>
                    </div>

                    {/* 6. W10 預告 + 輕量課後提示（黑底要 inline style 強制白字，避免 prose-zh cascade 把 strong 變回深色） */}
                    <div className="bg-[var(--ink)] rounded-[var(--radius-unified)] p-6" style={{ color: '#fff' }}>
                        <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8, color: '#fff' }}>W10 會做什麼</div>
                        <p style={{ fontSize: 13, lineHeight: 1.9, marginBottom: 16, color: '#fff' }}>
                            第一節：<strong style={{ color: '#fff', fontWeight: 700 }}>工具設計（第六章）</strong>——問卷題目／訪綱／實驗流程／觀察紀錄表／文獻分析架構（4 子類型擇一），依你方法分流。<br />
                            第二節：<strong style={{ color: '#fff', fontWeight: 700 }}>整本計畫書 AI 檢核 → 定稿繳交</strong>。
                        </p>
                        <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8, color: '#fff' }}>W10 之前的輕量任務</div>
                        <ul style={{ fontSize: 13, lineHeight: 1.9, listStyle: 'disc', paddingLeft: 20, marginBottom: 16, color: '#fff' }}>
                            <li>第三章文獻補到 2-3 篇 + 差異段</li>
                            <li>第四章變項／主題／維度定版 + 操作定義</li>
                            <li>跑 AI 思考模式檢核第 1-5 章（用上方複製的 Prompt）→ 補完 AIRED 的 R 欄位</li>
                            <li>docx 上傳 Google Classroom</li>
                        </ul>
                        <p style={{ fontSize: 12, lineHeight: 1.85, color: 'rgba(255,255,255,0.7)' }}>
                            💡 大部分已在課堂完成，課後只是「補細節 + 跑 AI + 繳交」。若要幫自己規劃具體時間，下方可以寫。
                        </p>
                    </div>

                    {/* 時間承諾（選填） */}
                    <div className="bg-white border border-[var(--border)] rounded-[var(--radius-unified)] p-5 space-y-3">
                        <div className="flex items-center gap-2">
                            <span className="text-[14px]">⏰</span>
                            <span className="font-bold text-[13px] text-[var(--ink)]">時間承諾（選填）</span>
                        </div>
                        <p className="text-[12px] text-[var(--ink-mid)] leading-relaxed">
                            研究心理學：寫下「什麼時候、在哪裡、做多久」，完成率比模糊計畫高 2-3 倍。
                        </p>
                        <ThinkRecord
                            dataKey="w9-homework-commitment"
                            prompt="我打算什麼時候把課後三件事做完？"
                            defaultTemplate={'補第三、四章：\n跑 AI 檢核 + 補 AIRED：\n上傳 docx 到 GC：'}
                            placeholder="例：週四晚 8-10 點，自己房間"
                            rows={4}
                        />
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
                    <span className="hidden md:inline">研究方法與專題 / 資料蒐集 / </span><span className="text-[var(--ink)] font-bold">計畫書·五章地基 W9</span>
                </div>
                <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
                    <span className="bg-[var(--paper-warm)] text-[var(--ink)] text-[10px] font-bold px-2 py-0.5 rounded-[2px] font-mono">100 MINS</span>
                    <ResetWeekButton weekPrefix="w9-" />
                    <button
                        onClick={() => setShowLessonMap(!showLessonMap)}
                        className="text-[11px] text-[var(--ink-light)] hover:text-[var(--accent)] transition-colors flex items-center gap-1 font-mono"
                        type="button"
                    >
                        <Map size={12} /> <span className="hidden md:inline">{showLessonMap ? 'Hide Plan' : 'Instructor View'}</span>
                    </button>
                    <span className="hidden md:inline-block bg-[var(--ink)] text-white text-[10px] font-bold px-2 py-0.5 rounded-[2px] font-mono">AI-RED · D</span>
                </div>
            </div>

            {showLessonMap && (
                <div className="animate-in slide-in-from-top-4 duration-300 mb-8">
                    <LessonMap data={W9Data} />
                </div>
            )}

            {/* PAGE HEADER — Hero Block */}
            <HeroBlock
                kicker="R.I.B. 調查檔案 · 研究方法與專題 · W9"
                title="計畫書 · "
                accentTitle="五章地基"
                subtitle="第一節學診斷尺與檢查清單——認清什麼是好工具、什麼是毒題。第二節把 W2–W8 累積的成果整合為計畫書第一到第五章——工具設計之前，地基必須先打穩。"
                chain="題目方法都定了——這週兩節 100 分鐘做一件事：把腦中的研究想法寫成『可繳交』的計畫書 1-5 章。"
                meta={[
                    { label: '第一節', value: '讀 W8 回饋 + 診斷尺 + 檢查清單 + 6 題練習' },
                    { label: '第二節', value: '計畫書五章地基工程 + AI 檢核 Prompt + 預想 AIRED' },
                    { label: '課堂產出', value: '計畫書第 1-5 章雛形 + W9 AIRED' },
                    { label: '前置要求', value: 'W8 合題企劃書／單飛施工單' },
                ]}
            />
            <CourseArc items={[
                    { wk: 'W1-W2', name: '探索階段\nRED公約', status: 'past' },
                    { wk: 'W3-W4', name: '題目診斷\n方法地圖', status: 'past' },
                    { wk: 'W5-W6', name: '操作型定義\n海報博覽會', status: 'past' },
                    { wk: 'W7', name: '文獻搜尋\n入門', status: 'past' },
                    { wk: 'W8', name: '文獻偵探社\n引用寫作', status: 'past' },
                    { wk: 'W9', name: '工具設計\n處方診斷', status: 'now' },
                    { wk: 'W10', name: '工具精進\n預試', status: '' },
                    { wk: 'W11-W14', name: '執行研究\n數據分析', status: '' },
                ]} />

            {/* STEP ENGINE */}
            <StepEngine
                steps={steps}
                prevWeek={{ label: '回 W8 研究博覽會', to: '/w8' }}
                nextWeek={{ label: '前往 W10 工具精進', to: '/w10' }}
            flat
            />
        </div>
    );
};
