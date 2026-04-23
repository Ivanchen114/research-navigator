import React, { useState, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CourseArc from '../components/ui/CourseArc';
import './W9Page.css';
import ThinkRecord from '../components/ui/ThinkRecord';
import Checklist from '../components/ui/Checklist';
import AIREDNarrative from '../components/ui/AIREDNarrative';
import ThinkChoice from '../components/ui/ThinkChoice';
import AIAssistToggle from '../components/ui/AIAssistToggle';
import StepEngine from '../components/ui/StepEngine';
import HeroBlock from '../components/ui/HeroBlock';
import ExportButton from '../components/ui/ExportButton';
import ResetWeekButton from '../components/ui/ResetWeekButton';
import LessonMap from '../components/ui/LessonMap';
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
        title: '文獻分析架構工作表',
        colHeaders: ['我的研究問題', '搜尋策略（關鍵字＋篩選標準）', '比較矩陣欄位設計'],
        example: {
            col1: '社群媒體對青少年焦慮的影響',
            col2: '關鍵字：「青少年 + 社群媒體 + 焦慮」\n篩選：近5年、中英文期刊、排除內容農場',
            col3: '欄位：作者/年份 / 研究對象 / 核心發現 / 支持或反對 / 研究限制',
        },
        selfCheck: [
            '關鍵字夠精準嗎？（不是只搜「AI」或「教育」）',
            '有明確的納入/排除標準嗎？',
            '比較欄位能幫我回答研究問題嗎？（不只是摘要）',
            '來源等級 OK 嗎？（不是內容農場或維基百科）',
        ],
        tips: '至少比較 5 篇以上文獻。用矩陣整理後，才能寫出有比較、有分析的文獻探討。',
    },
};

/* — 各方法的「拆解單位」對照（並非都叫變項） — */
const OPERATIONALIZE_MAP = [
    { method: '問卷', unit: '變項', output: '每個變項 3-5 題問卷題' },
    { method: '訪談', unit: '探詢層面', output: '每個層面 1 大問題 + 追問' },
    { method: '實驗', unit: '自變項／依變項／控制變項', output: '操作定義 + 實驗流程' },
    { method: '觀察', unit: '具體行為指標', output: '紀錄表欄位（時間/代號/行為/時長）' },
    { method: '文獻', unit: '比較維度', output: '篩選標準 + 比較矩陣欄位' },
];

/* — 課後組裝作業：各方法的工具元件清單 — */
const ASSEMBLY_TASKS = {
    questionnaire: {
        outputName: '完整問卷',
        deliverable: 'Google Doc（可再轉 Google Form）',
        timeEstimate: '週間自行組裝，約 60-90 分鐘',
        templateUrl: 'https://docs.google.com/document/d/1J72qYFrcvG_0jvYc27j4xS2pBGa3cMQy_tuhf2bPZ4U/copy',
        templateName: '01_問卷模板',
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
        timeEstimate: '週間自行組裝，約 60 分鐘',
        templateUrl: 'https://docs.google.com/document/d/1PB7S91j73YIIUnBQapBAeCPKK2e7yOFwod83ZTYuMs0/copy',
        templateName: '02_訪綱模板',
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
        timeEstimate: '週間自行組裝，約 90 分鐘（比其他方法稍重）',
        templateUrl: 'https://docs.google.com/document/d/1HQ6KutZIUXrfLEuBCs88le116HVgefvfSMdEfL_s0II/copy',
        templateName: '03_實驗計畫書模板',
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
        timeEstimate: '週間自行組裝，約 60 分鐘',
        templateUrl: 'https://docs.google.com/spreadsheets/d/1VwhCcHdpHPCX_YzVKIU98QrDQuXVup8h_ERcnm9R-D4/copy',
        templateName: '04_觀察紀錄表模板',
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
        outputName: '文獻分析矩陣',
        deliverable: 'Google Sheets（四分頁：搜尋計畫 / 矩陣 / 預選清單 / 自檢）',
        timeEstimate: '週間自行組裝，約 60 分鐘（不含實際讀文獻）',
        templateUrl: 'https://docs.google.com/spreadsheets/d/11mr5up4hsirhP3LH1qOxzxFAV0w189BIF585mcF8G6Q/copy',
        templateName: '05_文獻比較矩陣模板',
        components: [
            { t: '研究問題', d: '要回答的核心問題' },
            { t: '搜尋策略', d: '資料庫：華藝 / Google Scholar；中英文關鍵字；年份範圍' },
            { t: '納入排除標準', d: '近 5 年、中英文期刊、排除內容農場與維基' },
            { t: '比較矩陣欄位', d: '作者年份 / 對象 / 方法 / 發現 / 支持或反對 / 限制' },
            { t: '預選清單', d: '已搜到至少 5 篇候選文獻的標題與來源' },
        ],
        checks: ['關鍵字夠精準', '比較欄位能回答研究問題', '5 篇以上文獻'],
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
    literature: `我是高中生在做研究方法課的專題（文獻分析）。

我要比較的分析維度是：【貼上維度名稱，例如「研究對象」「研究方法」「核心發現」】
研究問題：【貼上你的研究問題】

請幫我發散 3-5 種可能的比較矩陣欄位設計。每一版請註明它能回答研究問題的哪個面向。

我會從中挑一個最貼合研究問題的版本，並說明為什麼刷掉其他版本。`,
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

/* — ExportButton 欄位 — */
const EXPORT_FIELDS = [
    /* Step 3：組內看診 W8 三題 */
    { key: 'w9-self-diagnosis', label: '組內看診紀錄：W8 三題診斷與共識', question: '三題分別發現什麼錯誤/不符合哪個原則 → 組內討論修成什麼' },
    /* Step 4：分流工作坊 — 三欄對應表 */
    { key: 'w9-my-method', label: '我的分流方法' },
    { key: 'w9-variable-ai-record', label: 'AI 變項發散判斷紀錄', question: '有用 AI 發散題目才要填：選了哪個版本、刷掉哪個、為什麼' },
    { key: 'w9-three-col-q1', label: '三欄對應表 1', question: '合題 → 拆解單位（變項/層面/行為/維度）→ 對應產出' },
    { key: 'w9-three-col-q2', label: '三欄對應表 2', question: '合題 → 拆解單位 → 對應產出' },
    { key: 'w9-three-col-q3', label: '三欄對應表 3（若有）', question: '合題 → 拆解單位 → 對應產出' },
    { key: 'w9-basic-checklist', label: '基本結構自查清單（勾選）', question: '依方法逐項確認' },
    { key: 'w9-basic-info-check', label: '基本規格填答', question: '題數／時間／分組／篩選標準等數字與具體值' },
    /* Step 5：同儕處方診斷 */
    { key: 'w9-peer-from', label: '我診斷了哪一組' },
    { key: 'w9-peer-diagnosis', label: '同儕處方診斷紀錄', question: '在對方的工具初稿中發現什麼問題？' },
    { key: 'w9-received-feedback', label: '我收到的回饋', question: '別組醫師給我們的處方是什麼？' },
    /* Step 6：回顧與繳交 */
    { key: 'w9-revision-plan', label: '修改決定', question: '根據回饋，我們最大的修改方向是什麼？' },
    { key: 'w9-assembly-ai-record', label: 'AI 組裝樣板判斷紀錄', question: '有用 AI 生樣板文字才要填：改了哪裡、為什麼' },
    { key: 'w9-homework-commitment', label: '組裝作業時間承諾', question: '我打算什麼時候動手組裝？' },
    { key: 'w9-aired-record', label: 'AI-RED 敘事紀錄', question: '本週最重要的一次 AI 互動（A-I-R-E-D 五要素）' },
];

/* ══════════════════════════════════════
 *  主元件
 * ══════════════════════════════════════ */

export const W9Page = () => {
    const [choiceResults, setChoiceResults] = useState([]);
    const [selectedMethod, setSelectedMethod] = useState('');
    const [w8Method, setW8Method] = useState('');
    const [w8Topic, setW8Topic] = useState('');
    const [w8Drafts, setW8Drafts] = useState({ q1: '', q2: '', q3: '' });
    const [showLessonMap, setShowLessonMap] = useState(false);
    /* Step 2 方法頁籤：預設 W8 選到的方法；無則 questionnaire（最常見） */
    const [pitfallTab, setPitfallTab] = useState('questionnaire');

    /* W8 帶入方法、題目與 3 題初稿（前測素材） */
    useEffect(() => {
        const saved = readRecords();
        const method = saved['w8-tool-method']?.trim() || saved['w8-method-reason']?.trim() || '';
        const topic = saved['w8-merged-topic']?.trim() || saved['w8-research-question']?.trim() || '';
        if (method) setW8Method(method);
        if (topic) setW8Topic(topic);
        /* 讀取 W8 三題初稿：學完三大標準後回頭自我診斷用 */
        setW8Drafts({
            q1: saved['w8-draft-q1']?.trim() || '',
            q2: saved['w8-draft-q2']?.trim() || '',
            q3: saved['w8-draft-q3']?.trim() || '',
        });

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
        /* ─── Step 1：處方診斷熱身 ─── */
        {
            title: '處方診斷熱身',
            icon: '🩺',
            content: (
                <div className="space-y-8 prose-zh">
                    <p className="text-[14px] text-[var(--ink-mid)] leading-relaxed max-w-[720px]">
                        W7 你學了 Level 1 掛號判斷（決定用什麼方法）。今天升級到 <strong className="text-[var(--ink)]">Level 2 處方判斷</strong>——工具設計得好不好？哪裡有毒？怎麼解毒？
                    </p>

                    <div className="bg-[#FEF3C7] border border-[#D97706]/30 rounded-[6px] p-3 text-[12px] text-[#92400E] leading-relaxed max-w-[720px]">
                        <strong>⚠️ 為什麼 Step 1 示範都是問卷？</strong><br />
                        問卷把錯誤 concretize 成文字最好看，當「共通入門」效率高。但<strong>誘導性 / 雙重 / 假開放</strong>三種陷阱<strong>五方法共通</strong>；<strong>訪談 / 觀察 / 實驗 / 文獻</strong>的獨家陷阱在下一步 <strong>Step 2 診斷工具包 · 尺 2</strong> 切換頁籤就會看到。
                    </div>

                    {/* ① 老師示範：打開 RxInspector 遊戲，全班共玩 1-2 題 */}
                    <div className="bg-white border border-[var(--border)] rounded-[var(--radius-unified)] overflow-hidden">
                        <div className="px-5 py-3 bg-[var(--danger)] text-white flex items-center gap-2">
                            <Stethoscope size={16} />
                            <span className="font-bold text-[13px]">① 老師帶全班共玩：RxInspector 防線（2-7 分鐘）</span>
                        </div>
                        <div className="p-5 space-y-4">
                            <p className="text-[13px] text-[var(--ink-mid)] leading-relaxed">
                                老師現場打開「防線」遊戲，帶全班共同診斷 1-2 題壞題。<strong className="text-[var(--ink)]">重點不是破關，是學會用診斷語言</strong>——誘導性？選項重疊？雙重問題？先把這套「醫生用語」聽熟。
                            </p>
                            <Link
                                to="/game/rx-inspector"
                                className="inline-flex items-center gap-2 bg-[var(--danger)] text-white px-4 py-2 rounded-[6px] font-bold text-[13px] hover:opacity-90 transition-opacity"
                            >
                                <Stethoscope size={14} />
                                打開 RxInspector 防線遊戲
                                <ArrowRight size={14} />
                            </Link>
                            <div className="text-[11px] text-[var(--ink-light)]">建議老師示範：從 X 型病例 Q1-Q2 挑一題，全班口頭診斷後再揭曉答案。</div>
                        </div>
                    </div>

                    {/* 理解檢核 1（老師示範後做，確認大家跟上） */}
                    <ThinkChoice
                        dataKey="w9-tc1"
                        prompt={THINK_CHOICES[0].prompt}
                        options={THINK_CHOICES[0].options}
                        answer={THINK_CHOICES[0].answer}
                        feedback={THINK_CHOICES[0].feedback}
                        onAnswer={handleChoice(THINK_CHOICES[0].id, THINK_CHOICES[0].prompt)}
                    />

                    {/* 前往下一步：診斷工具包 */}
                    <div className="w7-notice w7-notice-gold">
                        ➡️ 老師示範完，先到 <strong>Step 2 診斷工具包</strong>——把「診斷用的尺」看清楚，再到 Step 3 拿自己的 W8 三題來練。
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
                        這一頁是你的<strong className="text-[var(--ink)]">診斷工具箱</strong>——兩把尺：<strong>三大標準</strong>（設計原則）+ <strong>錯誤類型清單</strong>（3 共通 + 你的方法獨家）。Step 3 看診、Step 4 做三欄表、Step 5 同儕互評，<strong>隨時點回這一頁查</strong>。老師投影也看這頁。
                    </p>

                    {/* 尺 1 · 三大標準 — 手機 1 欄 / 桌機 3 欄（階層：方向 → 精度 → 執行） */}
                    <div>
                        <div className="mb-3">
                            <div className="text-[11px] font-mono text-[var(--ink-light)] uppercase tracking-wider">尺 1 · 好工具三大標準</div>
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
                                    <div className="text-[12px] text-[var(--ink-mid)] mb-3 leading-relaxed">{s.desc}</div>
                                    <div className="text-[12px] text-[var(--danger)] mb-1 leading-relaxed">❌ {s.bad}</div>
                                    <div className="text-[12px] text-[var(--success)] mb-3 leading-relaxed">✅ {s.good}</div>
                                    <div className="mt-auto text-[11px] font-mono text-[var(--ink-light)] border-t border-dashed border-[var(--border)] pt-2 leading-relaxed">
                                        錯了的代價：<span className="text-[var(--ink-mid)]">{s.stakes}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 尺 2 · 錯誤類型（5 方法頁籤統一 3 欄表：類型 / 徵狀 / 怎麼改） */}
                    <div>
                        <div className="text-[11px] font-mono text-[var(--ink-light)] uppercase tracking-wider mb-3">尺 2 · 錯誤類型（3 條共通 + 你的方法獨家）</div>

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

                    {/* 理解檢核：可靠性 */}
                    <ThinkChoice
                        dataKey="w9-tc2"
                        prompt={THINK_CHOICES[2].prompt}
                        options={THINK_CHOICES[2].options}
                        answer={THINK_CHOICES[2].answer}
                        feedback={THINK_CHOICES[2].feedback}
                        onAnswer={handleChoice(THINK_CHOICES[2].id, THINK_CHOICES[2].prompt)}
                    />

                    {/* 理解檢核：訪談問法 */}
                    <ThinkChoice
                        dataKey="w9-tc3"
                        prompt={THINK_CHOICES[1].prompt}
                        options={THINK_CHOICES[1].options}
                        answer={THINK_CHOICES[1].answer}
                        feedback={THINK_CHOICES[1].feedback}
                        onAnswer={handleChoice(THINK_CHOICES[1].id, THINK_CHOICES[1].prompt)}
                    />

                    {/* 分流預告 */}
                    <div className="bg-[var(--ink)] rounded-[var(--radius-unified)] p-6 text-white">
                        <div className="flex items-center gap-2 mb-3">
                            <AlertTriangle size={16} className="text-[var(--gold)]" />
                            <span className="font-bold text-[14px]">分流準備：Step 4 開始依方法分組</span>
                        </div>
                        <p className="text-[13px] text-[rgba(255,255,255,0.7)] leading-relaxed mb-4">
                            依照 W8 決定的方法分流。問卷組坐前半部，訪談組坐後半部，其他組坐側邊。帶著你們的企劃書，準備動手設計！
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

        /* ─── Step 3：組內看診 W8 三題（逐題診斷：錯誤 + 違反原則 + 組內共識） ─── */
        {
            title: '組內看診 W8 三題',
            icon: '🔍',
            content: (
                <div className="space-y-8 prose-zh">
                    <p className="text-[14px] text-[var(--ink-mid)] leading-relaxed max-w-[720px]">
                        把 Step 2 的尺拿出來，對<strong>你們組（或你）</strong>的 W8 三題逐題看診——<strong className="text-[var(--ink)]">發現什麼錯誤？違反哪個原則？組內討論後要改成什麼？</strong>一題一格，直接落筆。忘記尺 → 點回 Step 2。
                    </p>

                    {/* ① 組內看診實戰 */}
                    <div className="bg-white border-2 border-[var(--accent)] rounded-[var(--radius-unified)] overflow-hidden">
                        <div className="px-5 py-3 bg-[var(--accent)] text-white flex items-center gap-2">
                            <span className="text-[15px]">🩺</span>
                            <span className="font-bold text-[13px]">① 組內看診流程：把 W8 的 3 題當病人（10 分鐘）</span>
                        </div>
                        <div className="p-5 space-y-4">
                            <p className="text-[13px] text-[var(--ink-mid)] leading-relaxed">
                                <strong className="text-[var(--ink)]">Team 組員</strong>：這不是互評，是<strong>集體手術</strong>——組內共寫的 3 題是共同病人。輪流念題 → 全組用 Step 2 尺挑毒點 → <strong>當場討論怎麼改</strong>（每題 2-3 分鐘）→ 把結論寫進下方 ② 看診紀錄。<br />
                                <strong className="text-[var(--ink)]">Solo 路線</strong>：與鄰座 2-3 位 Solo 同學組成「診斷圈」，輪念互評（題目各自獨立，這時才是真的互評），再自己落筆。
                            </p>
                            <div className="bg-[var(--paper-warm)] border border-[var(--border)] rounded-[6px] p-3 text-[12px] text-[var(--ink-mid)] leading-relaxed">
                                <strong className="text-[var(--ink)]">每一題的寫法</strong>：(1) 發現什麼錯誤——用 Step 2 的錯誤類型語言；(2) 違反三大原則哪一個——有效性／可靠性／可行性；(3) 討論後決定修成什麼。
                            </div>
                        </div>
                    </div>

                    {/* ② W8 三題唯讀卡 + 合併診斷紀錄 */}
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <span className="text-[10px] font-mono font-bold bg-[var(--ink)] text-white px-2 py-0.5 rounded-[3px]">RX</span>
                            <span className="font-bold text-[13px] text-[var(--ink)]">
                                ② 組內看診紀錄：三題一起診斷 + 討論後共識
                            </span>
                        </div>

                        {/* W8 三題唯讀卡 */}
                        {(w8Drafts.q1 || w8Drafts.q2 || w8Drafts.q3) ? (
                            <div className="bg-white border border-[var(--border)] rounded-[var(--radius-unified)] overflow-hidden mb-4">
                                <div className="px-5 py-3 bg-[var(--paper-warm)] border-b border-[var(--border)] flex items-center gap-2">
                                    <span className="text-[10px] font-mono font-bold bg-[var(--accent)] text-white px-2 py-0.5 rounded-[3px]">W8 ARCHIVE</span>
                                    <span className="font-bold text-[13px] text-[var(--ink)]">W8 寫的三題初稿（唯讀）</span>
                                </div>
                                <div className="divide-y divide-[var(--border)]">
                                    {[
                                        { n: 1, text: w8Drafts.q1 },
                                        { n: 2, text: w8Drafts.q2 },
                                        { n: 3, text: w8Drafts.q3 },
                                    ].map((d) => (
                                        <div key={d.n} className="p-4 px-5 text-[13px] leading-relaxed">
                                            <span className="font-mono font-bold text-[var(--accent)] mr-2">題 {d.n}：</span>
                                            <span className="text-[var(--ink)] whitespace-pre-line">
                                                {d.text || <span className="text-[var(--ink-light)] italic">（W8 這題沒寫）</span>}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="w7-notice w7-notice-gold mb-4">
                                ⚠️ 讀不到你的 W8 三題初稿。如果 W8 沒寫，可以跳過這題、直接到 Step 4。如果 W8 有寫但這裡讀不到，請回 W8 確認是否已存檔。
                            </div>
                        )}

                        <ThinkRecord
                            dataKey="w9-self-diagnosis"
                            prompt="三題一起診斷：發現什麼錯誤？違反哪個原則？組內討論後修成什麼？"
                            scaffold={[
                                '題 1｜發現的錯誤：___（用 Step 2 錯誤類型語言）｜違反原則：有效性／可靠性／可行性（圈一個）｜組內討論後修成：___',
                                '題 2｜發現的錯誤：___｜違反原則：___｜修成：___',
                                '題 3｜發現的錯誤：___｜違反原則：___｜修成：___',
                            ]}
                            rows={9}
                        />

                        <div className="w7-notice w7-notice-gold mt-4">
                            💡 <strong>看診完就往 Step 4。</strong>這裡的目的是看見「沒方法 vs 有方法」的差別；Step 4 會用三欄對應表從頭系統性產出新題目，不是修這三題。
                        </div>
                    </div>
                </div>
            ),
        },

        /* ─── Step 4：分流工作坊 — 三欄對應表 ─── */
        {
            title: '三欄對應表實作',
            icon: '🔧',
            content: (
                <div className="space-y-8 prose-zh">
                    {/* W8→W9 銜接說明 */}
                    <div className="bg-[var(--paper-warm)] border border-[var(--border)] rounded-[var(--radius-unified)] p-5">
                        <p className="text-[14px] text-[var(--ink)] leading-relaxed">
                            <strong>W8 的 3 題草稿是你的「直覺版」</strong>——想到什麼問什麼。現在要用<strong className="text-[var(--accent)]">三欄對應表</strong>做「系統版」：確保你的每一題，都是為了回答你的研究問題，而不是憑感覺湊題目。
                        </p>
                    </div>

                    {/* 操作化對照卡：五方法拆解單位不同 */}
                    <div className="bg-white border border-[var(--border)] rounded-[var(--radius-unified)] overflow-hidden">
                        <div className="px-5 py-3 bg-[var(--accent)] text-white flex items-center gap-2">
                            <span className="text-[15px]">🧩</span>
                            <span className="font-bold text-[13px]">把合題操作化：依你的方法拆成「可以實際執行的單位」</span>
                        </div>
                        <div className="p-5 space-y-4">
                            <p className="text-[13px] text-[var(--ink-mid)] leading-relaxed">
                                W8 合題後的<strong className="text-[var(--ink)]">研究問題</strong>還太大，不能直接拿去施測。現在要<strong className="text-[var(--ink)]">操作化</strong>——依你的方法拆成可實際執行的小單位。<strong className="text-[var(--ink)]">單位名稱因方法而異</strong>，不是每個方法都叫「變項」：
                            </p>

                            {/* 方法 × 拆解單位 × 產出 — 桌機表格 */}
                            <div className="hidden md:block border border-[var(--border)] rounded-[8px] overflow-hidden">
                                <div className="grid grid-cols-[1fr_2fr_2.2fr] bg-[var(--paper-warm)] border-b border-[var(--border)] text-[11px] font-mono font-bold text-[var(--ink)]">
                                    <div className="px-4 py-2.5">方法</div>
                                    <div className="px-4 py-2.5 border-l border-[var(--border)]">拆解單位（操作化的對象）</div>
                                    <div className="px-4 py-2.5 border-l border-[var(--border)]">每個單位要產出什麼</div>
                                </div>
                                {OPERATIONALIZE_MAP.map((r, i) => (
                                    <div key={i} className={`grid grid-cols-[1fr_2fr_2.2fr] text-[12px] ${i % 2 === 1 ? 'bg-[var(--paper-warm)]/30' : 'bg-white'}`}>
                                        <div className="px-4 py-2.5 font-bold text-[var(--ink)]">{r.method}</div>
                                        <div className="px-4 py-2.5 border-l border-[var(--border)] text-[var(--accent)] font-bold leading-relaxed">{r.unit}</div>
                                        <div className="px-4 py-2.5 border-l border-[var(--border)] text-[var(--ink-mid)] leading-relaxed">{r.output}</div>
                                    </div>
                                ))}
                            </div>

                            {/* 手機：卡片版 */}
                            <div className="md:hidden space-y-2">
                                {OPERATIONALIZE_MAP.map((r, i) => (
                                    <div key={i} className="bg-[var(--paper-warm)] border border-[var(--border)] rounded-[6px] p-3">
                                        <div className="text-[12px] font-bold text-[var(--ink)] mb-1">{r.method}</div>
                                        <div className="text-[12px] text-[var(--accent)] font-bold leading-relaxed">拆解單位：{r.unit}</div>
                                        <div className="text-[12px] text-[var(--ink-mid)] leading-relaxed mt-0.5">產出：{r.output}</div>
                                    </div>
                                ))}
                            </div>

                            <p className="text-[12px] text-[var(--ink-light)] leading-relaxed">
                                <strong className="text-[var(--ink)]">邏輯一樣</strong>：合題 → 要測/問/看/比什麼 → 怎麼操作。選下方方法後，會帶出這個方法的範例與工作表；<strong>沒有變項概念的方法</strong>（訪談／觀察／文獻）也能照樣落筆。
                            </p>

                            {/* W4 後門：題目還沒聚焦 */}
                            <div className="flex items-start gap-2 text-[12px] bg-[#FEF3C7] border border-[#D97706]/30 rounded-[6px] p-3 text-[#92400E]">
                                <span className="shrink-0">🚨</span>
                                <div>
                                    <strong>題目還像「高中生為何拖延？」這種大命題嗎？</strong>
                                    <p className="mt-1 leading-relaxed">那是 W4 該處理的事。硬上 W9 只會卡住，請先回 <Link to="/w4" className="underline font-bold">W4</Link> 用 5W1H 加工到「對象 + 場域 + 焦點」都具體化，再到 W8 合題。</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 倫理快速提醒（警告框，非教學） */}
                    <div className="flex items-start gap-3 px-4 py-3 rounded-[var(--radius-unified)] bg-[#FEF2F2] border border-[var(--danger)]/20 text-[13px]">
                        <ShieldAlert size={18} className="text-[var(--danger)] shrink-0 mt-0.5" />
                        <div>
                            <span className="font-bold text-[var(--danger)]">動手前，倫理四原則快速確認</span>
                            <div className="mt-1.5 text-[var(--ink-mid)] space-y-0.5">
                                {ETHICS_PRINCIPLES.map((p, i) => (
                                    <div key={i} className="flex items-center gap-1.5">
                                        <span>{p.icon}</span>
                                        <span><strong className="text-[var(--ink)]">{p.name}</strong> — {p.desc}</span>
                                    </div>
                                ))}
                            </div>
                            <p className="mt-2 text-[11px] text-[var(--ink-light)] font-mono">W11 會做完整的倫理審查，但設計時就要避開地雷。</p>
                        </div>
                    </div>

                    {/* W8 帶入 */}
                    {(w8Topic || w8Method) && (
                        <div className="flex items-start gap-3 px-4 py-3 rounded-[var(--radius-unified)] bg-[var(--accent-light)] border border-[var(--accent)] text-[13px]">
                            <span className="text-[16px]">📎</span>
                            <div>
                                <span className="font-bold text-[var(--accent)]">W8 研究檔案帶入</span>
                                {w8Topic && <p className="text-[var(--ink-mid)] mt-0.5">研究題目：{w8Topic}</p>}
                                {w8Method && <p className="text-[var(--ink-mid)] mt-0.5">選用方法：{w8Method}</p>}
                            </div>
                        </div>
                    )}

                    {/* 方法選擇 */}
                    <div>
                        <div className="text-[11px] font-mono text-[var(--ink-light)] uppercase tracking-wider mb-3">選擇你的方法</div>
                        <div className="w9-method-selector">
                            {METHOD_OPTIONS.map((m) => (
                                <button
                                    key={m.id}
                                    onClick={() => handleMethodSelect(m.id)}
                                    className={`w9-method-btn ${selectedMethod === m.id ? 'active' : ''}`}
                                >
                                    {m.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* 需要方法獨家陷阱 / 5 錯誤 / 三大標準？→ 滑回 Step 2 診斷工具包 */}
                    <div className="w7-notice w7-notice-gold">
                        🧰 設計過程忘記了尺？<strong>三大標準 / 五錯誤類型 / 方法獨家陷阱</strong>全部都在 <strong>Step 2 診斷工具包</strong>——點上方 Step 2 隨時翻。
                    </div>

                    {/* 分流內容 */}
                    {currentScaffold ? (
                        <div className="space-y-6">
                            {/* 範例 */}
                            <div className="bg-white border border-[var(--border)] rounded-[var(--radius-unified)] overflow-hidden">
                                <div className="px-5 py-3 bg-[var(--paper-warm)] border-b border-[var(--border)] flex items-center gap-2">
                                    <span className="text-[10px] font-mono font-bold bg-[var(--ink)] text-white px-2 py-0.5 rounded-[3px]">EXAMPLE</span>
                                    <span className="font-bold text-[13px] text-[var(--ink)]">{currentScaffold.title} — 範例</span>
                                </div>
                                <div className="p-5">
                                    <div className="w9-three-col-header">
                                        {currentScaffold.colHeaders.map((h, i) => (
                                            <div key={i} className="w9-col-head">{h}</div>
                                        ))}
                                    </div>
                                    <div className="w9-three-col-row">
                                        <div className="w9-col-cell text-[12px] text-[var(--accent)] font-bold">{currentScaffold.example.col1}</div>
                                        <div className="w9-col-cell text-[12px] text-[var(--ink-mid)] whitespace-pre-line">{currentScaffold.example.col2}</div>
                                        <div className="w9-col-cell text-[12px] text-[var(--ink-mid)] whitespace-pre-line">{currentScaffold.example.col3}</div>
                                    </div>
                                </div>
                            </div>

                            {/* 自檢卡 */}
                            <div className="bg-[#FEF3C7] border border-[#D97706]/30 rounded-[var(--radius-unified)] p-5">
                                <div className="flex items-center gap-2 mb-3">
                                    <ShieldCheck size={16} className="text-[#D97706]" />
                                    <span className="font-bold text-[13px] text-[#92400E]">自檢卡 — 舉手找老師前先自我檢查</span>
                                </div>
                                <div className="space-y-2">
                                    {currentScaffold.selfCheck.map((item, i) => (
                                        <div key={i} className="flex items-start gap-2 text-[12px] text-[#92400E]">
                                            <span className="shrink-0">🛑</span>
                                            <span>{item}</span>
                                        </div>
                                    ))}
                                </div>
                                <p className="mt-3 text-[11px] text-[#92400E]/70 font-mono">{currentScaffold.tips}</p>
                            </div>

                            {/* AI 協助（可選）：從變項發散題目 */}
                            <AIAssistToggle
                                id="w9-variable-ai"
                                title="卡在「題目怎麼寫」？讓 AI 幫你發散 3-5 種版本（可選）"
                                reason="AI 給你多個版本當選項，你挑一個、刷掉其他、留下判斷理由。這是在訓練「診斷好壞題」的能力，不是讓 AI 代寫。"
                                promptByMethod={VARIABLE_AI_PROMPTS}
                                method={selectedMethod}
                                recordKey="w9-variable-ai-record"
                                recordPrompt="你從 AI 給的 3-5 種版本中選了哪個？刷掉哪個？為什麼？"
                                recordPlaceholder="我選了第 ___ 版，因為___&#10;我刷掉第 ___ 版，因為___&#10;我把選中版本又改了：___，因為___"
                            />

                            {/* 填寫區：單位名稱依方法而異（問卷=變項／訪談=探詢層面／實驗=變因／觀察=行為指標／文獻=比較維度） */}
                            {(() => {
                                const unitLabel =
                                    selectedMethod === 'questionnaire' ? '變項'
                                        : selectedMethod === 'interview' ? '探詢層面'
                                            : selectedMethod === 'experiment' ? '變因（自/依/控）'
                                                : selectedMethod === 'observation' ? '行為指標'
                                                    : selectedMethod === 'literature' ? '比較維度'
                                                        : '拆解單位';
                                const outputLabel =
                                    selectedMethod === 'questionnaire' ? '問卷題目'
                                        : selectedMethod === 'interview' ? '訪談大問題＋追問'
                                            : selectedMethod === 'experiment' ? '操作定義/測量方式'
                                                : selectedMethod === 'observation' ? '紀錄表欄位'
                                                    : selectedMethod === 'literature' ? '比較矩陣欄位'
                                                        : '產出';
                                const measureVerb =
                                    selectedMethod === 'interview' ? '問什麼經驗/想法'
                                        : selectedMethod === 'observation' ? '看什麼行為'
                                            : selectedMethod === 'literature' ? '比什麼'
                                                : '測什麼';
                                return (
                                    <>
                                        <ThinkRecord
                                            dataKey="w9-three-col-q1"
                                            prompt={`三欄對應表 — ${unitLabel} 1`}
                                            defaultTemplate={`合題（從 W8 帶來）：\n這個${unitLabel}要${measureVerb}：\n對應${outputLabel}：\n1. \n2. \n3. `}
                                            scaffold={['合題：', `${unitLabel}：`, `${outputLabel}：`]}
                                            rows={7}
                                        />

                                        <ThinkRecord
                                            dataKey="w9-three-col-q2"
                                            prompt={`三欄對應表 — ${unitLabel} 2`}
                                            defaultTemplate={`合題：同上\n這個${unitLabel}：\n對應${outputLabel}：\n4. \n5. \n6. `}
                                            scaffold={['同上合題', `${unitLabel}：`, `${outputLabel}：`]}
                                            rows={7}
                                        />

                                        <ThinkRecord
                                            dataKey="w9-three-col-q3"
                                            prompt={`三欄對應表 — ${unitLabel} 3（若有）`}
                                            defaultTemplate={`合題：同上\n這個${unitLabel}：\n對應${outputLabel}：\n7. \n8. `}
                                            rows={6}
                                        />
                                    </>
                                );
                            })()}

                            {/* 基本資料與結構確認：上 Checklist（純檢核）＋下 ThinkRecord（填空） */}
                            {(() => {
                                const checklistConfig = {
                                    questionnaire: {
                                        prompt: '基本資料與知情同意確認',
                                        items: [
                                            '開場白已寫好（我是誰、研究目的、保密承諾、需時多久）',
                                            '基本變項設計完成（年級／性別／類組）',
                                        ],
                                        fillPrompt: '題目數量與填答時間',
                                        fillTemplate: '預計題目數：___ 題\n預計填答時間：___ 分鐘',
                                    },
                                    interview: {
                                        prompt: '訪談結構確認',
                                        items: [
                                            '暖身問題準備好了',
                                            '問題排序合理（從簡單 → 深層）',
                                            '收尾問題準備好了（「還有什麼想補充的嗎？」）',
                                        ],
                                        fillPrompt: '預計訪談時間',
                                        fillTemplate: '預計訪談時間：___ 分鐘',
                                    },
                                    experiment: {
                                        prompt: '實驗流程確認',
                                        items: [
                                            '知情同意步驟已安排',
                                            '已備妥實驗材料／場地',
                                        ],
                                        fillPrompt: '分組、控制變項、時程',
                                        fillTemplate: '分組方式：___\n控制變項共 ___ 項\n預計 ___ 天完成實驗',
                                    },
                                    observation: {
                                        prompt: '觀察情境設定',
                                        items: [
                                            '已決定觀察者定位（參與 or 非參與）',
                                            '觀察紀錄表欄位已設計好',
                                        ],
                                        fillPrompt: '時間、地點、角色',
                                        fillTemplate: '觀察者定位：□參與觀察  □非參與觀察（擇一圈選）\n觀察時間：每次 ___ 分鐘，共 ___ 次\n觀察地點：___',
                                    },
                                    literature: {
                                        prompt: '文獻篩選標準設定',
                                        items: [
                                            '中文關鍵字已列出',
                                            '英文關鍵字已列出',
                                            '納入／排除標準已與組員共識',
                                        ],
                                        fillPrompt: '年份與具體標準',
                                        fillTemplate: '年份限制：___\n納入標準：___\n排除標準：___',
                                    },
                                };
                                const cfg = checklistConfig[selectedMethod];
                                if (!cfg) return null;
                                return (
                                    <>
                                        <Checklist
                                            dataKey="w9-basic-checklist"
                                            prompt={cfg.prompt}
                                            items={cfg.items}
                                        />
                                        <ThinkRecord
                                            dataKey="w9-basic-info-check"
                                            prompt={cfg.fillPrompt}
                                            defaultTemplate={cfg.fillTemplate}
                                            rows={4}
                                        />
                                    </>
                                );
                            })()}
                        </div>
                    ) : (
                        <div className="bg-[var(--paper-warm)] border border-[var(--border)] rounded-[var(--radius-unified)] p-8 text-center">
                            <span className="text-[28px] block mb-3">👆</span>
                            <p className="text-[14px] text-[var(--ink-mid)]">請先選擇你的研究方法，系統會顯示對應的工作表。</p>
                        </div>
                    )}
                </div>
            ),
        },

        /* ─── Step 5：同儕處方診斷 ─── */
        {
            title: '同儕處方診斷',
            icon: '💊',
            content: (
                <div className="space-y-8 prose-zh">
                    <p className="text-[14px] text-[var(--ink-mid)] leading-relaxed max-w-[720px]">
                        兩兩小組互相交換「三欄對應表 + 各題題目草稿」。用錯誤類型卡幫對方把脈——當一個負責任的主治醫師！（完整工具會在課後組裝，W10 帶來。）
                    </p>

                    {/* 診斷流程 */}
                    <div className="bg-white border border-[var(--border)] rounded-[var(--radius-unified)] overflow-hidden">
                        <div className="px-5 py-3 bg-[var(--ink)] text-white flex items-center gap-2">
                            <Stethoscope size={16} />
                            <span className="font-bold text-[13px]">診斷流程</span>
                        </div>
                        <div className="p-5 space-y-3 text-[13px] text-[var(--ink-mid)]">
                            <div className="flex items-start gap-3">
                                <span className="w9-step-num">1</span>
                                <span>和隔壁組交換你的<strong className="text-[var(--ink)]">三欄對應表 + 各題題目草稿</strong></span>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="w9-step-num">2</span>
                                <span>點回 <strong className="text-[var(--ink)]">Step 2 診斷工具包</strong>，用<strong>五錯誤類型</strong>逐題對照：選項重疊？誘導性？雙重問題？</span>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="w9-step-num">3</span>
                                <span>再用 Step 2 的<strong>三大標準</strong>檢查：<strong className="text-[var(--ink)]">有效嗎？可靠嗎？可行嗎？</strong></span>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="w9-step-num">4</span>
                                <span>把脈結果寫在下方的<strong className="text-[var(--ink)]">醫師會診紀錄</strong></span>
                            </div>
                        </div>
                    </div>

                    {/* 診斷提示 */}
                    <div className="bg-[#FEF3C7] border border-[#D97706]/30 rounded-[var(--radius-unified)] p-4 text-[13px]">
                        <strong className="text-[#D97706]">🎯 診斷目標：</strong>
                        <span className="text-[var(--ink-mid)] ml-1">每個工具初稿至少找出 <strong>2 個</strong>可以改進的地方，並標注是違反了哪條規準或觸發了哪種錯誤類型。</span>
                    </div>

                    {/* 醫師會診紀錄 */}
                    <ThinkRecord
                        dataKey="w9-peer-from"
                        prompt="我診斷了哪一組？"
                        placeholder="組名/姓名：___"
                        rows={1}
                    />

                    <ThinkRecord
                        dataKey="w9-peer-diagnosis"
                        prompt="醫師把脈紀錄：對方的三欄對應表與題目草稿有什麼問題？"
                        defaultTemplate={'問題 1：第 ___ 題犯了「___」→ 建議改為 ___\n問題 2：子問題 ___ 和題目對不上，因為 ___\n總評：這些題目整體能回答他們的研究問題嗎？___'}
                        scaffold={['第__題犯了「___」', '建議改為___', '整體評價：___']}
                        rows={8}
                    />

                    <ThinkRecord
                        dataKey="w9-received-feedback"
                        prompt="我收到的處方：別組醫師給我們的回饋"
                        defaultTemplate={'醫師說我們的第 ___ 題有 ___ 的問題，建議改為 ___\n醫師的總評是：___'}
                        scaffold={['第__題需要改___', '醫師建議___', '我們覺得___']}
                        rows={6}
                    />
                </div>
            ),
        },

        /* ─── Step 6：回顧與繳交 ─── */
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
                                '學會 Level 2 處方診斷（用規準找問題）',
                                '掌握三大標準（有效性、可靠性、可行性）',
                                '用三欄對應表把研究問題 → 變項 → 題目連起來',
                                '完成同儕處方診斷（幫別組把脈）',
                                '記錄收到的回饋與修改方向',
                            ].map((item, i) => (
                                <div key={i} className="p-4 px-6 bg-white flex items-start gap-3">
                                    <CheckCircle2 size={16} className="text-[var(--success)] mt-0.5 flex-shrink-0" />
                                    <span className="text-[13px] text-[var(--ink-mid)]">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 2. 修改決定（向前看） */}
                    <ThinkRecord
                        dataKey="w9-revision-plan"
                        prompt="綜合同學的診斷與老師的建議，下週 W10 之前必須做出的最大修改是什麼？"
                        defaultTemplate={'我們決定修改的方向是 ___，因為同儕診斷時發現 ___\n具體來說，第 ___ 題要改成 ___'}
                        scaffold={['最大的修改是___', '因為___', '組裝時會特別注意___']}
                        rows={5}
                    />

                    {/* 3. AIRED 敘事紀錄 */}
                    <AIREDNarrative week="9" hint="工具設計可能用 AI 檢核題目" optional={true} />

                    {/* 4. 一鍵複製 */}
                    <ExportButton
                        weekLabel="W9 工具設計基礎"
                        fields={EXPORT_FIELDS}
                        choices={choiceResults}
                    />

                    {/* 5. 遊戲彩蛋 */}
                    <div className="bg-[var(--ink)] border-l-4 border-[var(--danger)] p-6 rounded-r-lg text-white shadow-xl">
                        <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                            <ShieldAlert className="text-[var(--danger)]" size={20} />
                            R.I.B. 單元挑戰：行動代號防線
                        </h3>
                        <p className="text-[var(--ink-light)] text-sm mb-4">
                            10 個充滿致命設計缺陷的研究病例。揪出錯誤並開立正確處方，確保研究方法無懈可擊。
                        </p>
                        <Link to="/game/rx-inspector" className="inline-flex items-center gap-2 bg-[var(--danger)] text-white px-4 py-2 rounded font-bold text-sm hover:opacity-90 transition-colors">
                            進入防線 <ArrowRight size={14} />
                        </Link>
                    </div>

                    {/* 6. 課後組裝作業鷹架（取代原下週預告） */}
                    <div className="bg-[#FEF3C7] border-2 border-[#D97706] rounded-[var(--radius-unified)] overflow-hidden">
                        <div className="px-5 py-4 bg-[#D97706] text-white flex items-center gap-3">
                            <span className="bg-white text-[#D97706] text-[10px] font-mono font-bold px-2 py-1 rounded-[3px]">HOMEWORK</span>
                            <h3 className="font-bold text-[14px] leading-tight">W9 → W10 課後組裝作業</h3>
                            <span className="ml-auto text-[11px] font-mono opacity-90">繳交期限：W10 上課前</span>
                        </div>
                        <div className="p-5 space-y-4">
                            <p className="text-[13px] text-[#92400E] leading-relaxed">
                                <strong>現實盤點</strong>：你現在手上有「三欄對應表 + 散落的題目草稿」，還<strong className="text-[var(--danger)]">不是</strong>一份能拿去施測的完整工具。
                                W10 的 AI 審稿和人工預試都需要一份「成品」，所以這週回家要把散件組裝起來。
                            </p>

                            {ASSEMBLY_TASKS[selectedMethod] ? (
                                (() => {
                                    const task = ASSEMBLY_TASKS[selectedMethod];
                                    return (
                                        <div className="bg-white border border-[#D97706]/30 rounded-[8px] p-5 space-y-4">
                                            <div className="flex items-start gap-3 pb-3 border-b border-[var(--border)]">
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-[10px] font-mono text-[var(--ink-light)] uppercase tracking-wider mb-1">你的組裝任務</div>
                                                    <div className="text-[15px] font-bold text-[var(--ink)] mb-0.5">{task.outputName}</div>
                                                    <div className="text-[12px] text-[var(--ink-mid)]">繳交格式：{task.deliverable}</div>
                                                    <div className="text-[11px] font-mono text-[var(--ink-light)] mt-1">⏱ {task.timeEstimate}</div>
                                                </div>
                                            </div>

                                            <div>
                                                <div className="text-[11px] font-mono text-[var(--ink-light)] uppercase tracking-wider mb-2">必要元件（按順序組裝）</div>
                                                <div className="space-y-2">
                                                    {task.components.map((c, i) => (
                                                        <div key={i} className="flex items-start gap-3 text-[12px]">
                                                            <span className="shrink-0 bg-[var(--paper-warm)] text-[var(--ink)] w-6 h-6 rounded-full flex items-center justify-center font-mono font-bold text-[11px]">{i + 1}</span>
                                                            <div className="min-w-0 flex-1">
                                                                <div className="font-bold text-[var(--ink)]">{c.t}</div>
                                                                <div className="text-[var(--ink-mid)] leading-relaxed">{c.d}</div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="bg-[var(--paper-warm)] rounded-[6px] p-3">
                                                <div className="text-[11px] font-mono text-[var(--ink-light)] uppercase tracking-wider mb-2">繳交前自檢</div>
                                                <div className="space-y-1">
                                                    {task.checks.map((c, i) => (
                                                        <div key={i} className="flex items-start gap-2 text-[12px] text-[var(--ink-mid)]">
                                                            <span className="shrink-0">□</span>
                                                            <span>{c}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {task.templateUrl && (
                                                <a
                                                    href={task.templateUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center justify-between gap-3 bg-[var(--ink)] hover:bg-black text-white rounded-[8px] px-4 py-3 transition-colors no-underline"
                                                >
                                                    <div className="flex items-center gap-3 min-w-0">
                                                        <span className="text-[18px]">📋</span>
                                                        <div className="min-w-0">
                                                            <div className="text-[13px] font-bold">建立我的模板副本</div>
                                                            <div className="text-[11px] font-mono opacity-70 truncate">{task.templateName}</div>
                                                        </div>
                                                    </div>
                                                    <ArrowRight size={16} className="shrink-0" />
                                                </a>
                                            )}
                                            <p className="text-[11px] text-[var(--ink-light)] leading-relaxed">
                                                點上面按鈕 → Google 會跳出「建立副本」視窗 → 副本直接存到<strong className="text-[var(--ink)]">你自己的雲端硬碟</strong>。老師的母版不會被動到。
                                            </p>
                                        </div>
                                    );
                                })()
                            ) : (
                                <div className="bg-white border border-[#D97706]/30 rounded-[8px] p-5 text-center text-[13px] text-[var(--ink-mid)]">
                                    ⚠️ 尚未選擇研究方法，請回 Step 4 選擇後，此處會顯示你的組裝清單。
                                </div>
                            )}

                            {/* AI 協助（可選）：生成樣板文字（開場白/結尾/知情同意） */}
                            <AIAssistToggle
                                id="w9-assembly-ai"
                                title="組裝時卡在寫樣板文字？讓 AI 生外框，你改核心（可選）"
                                reason="開場白、指導語、結尾致謝、知情同意聲明——這些「外框文字」AI 寫得比你快，你只要審閱改語氣。但核心題目／行為定義／變項設計絕對要自己做。"
                                promptByMethod={ASSEMBLY_AI_PROMPTS}
                                method={selectedMethod}
                                recordKey="w9-assembly-ai-record"
                                recordPrompt="你對 AI 生出來的樣板改了哪裡？為什麼？（改越多代表你越清楚自己要什麼）"
                                recordPlaceholder="開場白：AI 原本寫「___」，我改成「___」，因為___&#10;結尾致謝：AI 原本寫「___」，我改成「___」，因為___"
                            />

                            {/* 自我承諾：具體意圖設計（implementation intention） */}
                            <div className="bg-white border border-[#D97706]/30 rounded-[8px] p-5 space-y-3">
                                <div className="flex items-center gap-2">
                                    <span className="text-[14px]">⏰</span>
                                    <span className="font-bold text-[13px] text-[var(--ink)]">時間承諾：避免拖到最後一刻</span>
                                </div>
                                <p className="text-[12px] text-[var(--ink-mid)] leading-relaxed">
                                    研究心理學：寫下「什麼時候、在哪裡、做多久」，完成率比模糊計畫高 2-3 倍。不要寫「這週找時間」。
                                </p>
                                <ThinkRecord
                                    dataKey="w9-homework-commitment"
                                    prompt="我打算什麼時候動手組裝？（越具體越有效）"
                                    placeholder="例：週三晚上 7:30-9:00，在家裡房間，先寫開場白和基本資料（20 分鐘），再把三欄對應表的題目排進模板（40 分鐘）。&#10;&#10;有隊友的記得附上「誰負責什麼」。"
                                    scaffold={['時間：', '地點：', '分段／誰負責什麼：']}
                                    rows={4}
                                />
                            </div>

                            <div className="bg-[var(--ink)] rounded-[6px] p-4 text-white">
                                <div className="text-[11px] font-mono opacity-70 uppercase tracking-wider mb-1">W10 會做什麼</div>
                                <p className="text-[13px] leading-relaxed">AI 審稿 + 人工預試（Pilot Test）雙重把關——讓真人試填你的工具，你會發現很多意想不到的問題。沒組裝完成就來上課 = 空手進手術房。</p>
                            </div>
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
                    <span className="hidden md:inline">研究方法與專題 / 資料蒐集 / </span><span className="text-[var(--ink)] font-bold">工具設計基礎 W9</span>
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
                title="方法深化 I："
                accentTitle="工具設計基礎與處方診斷"
                subtitle="帶著 W8 的 3 題草稿走進診所。今天學會用處方診斷抓出設計缺陷，掌握好工具的三大標準，再用三欄對應表把研究問題轉換為完整的工具初稿。"
                meta={[
                    { label: '第一節', value: '處方熱身 + 診斷工具包 + 組內看診' },
                    { label: '第二節', value: '三欄對應表 + 同儕診斷 + 繳交' },
                    { label: '課堂產出', value: '三欄對應表 + 工具初稿' },
                    { label: '前置要求', value: 'W8 企劃書 + 3 題草稿' },
                ]}
            />
            <CourseArc items={[
                    { wk: 'W1-W2', name: '探索階段\nRED公約', status: 'past' },
                    { wk: 'W3-W4', name: '題目診斷\n博覽會', status: 'past' },
                    { wk: 'W5-W6', name: '文獻搜尋\n引用寫作', status: 'past' },
                    { wk: 'W7', name: '認識方法\n兩層判斷', status: 'past' },
                    { wk: 'W8', name: '組隊決策\n企劃定案', status: 'past' },
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
