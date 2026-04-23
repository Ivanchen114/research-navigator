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

/* — 計畫書第一章 AI 檢核 Prompt（本週 Step 3 用） — */
const PLAN_CH1_CHECK_PROMPT = `你是高中專題指導顧問。以下是我計畫書第一章（研究主題基本資訊），請幫我檢查四件事：

1. 研究動機是否能支撐研究問題？（若落差大，指出在哪）
2. 研究目的與主研究問題是否邏輯一致？
3. 子問題是否都對應主問題？或有子問題偏離？
4. 研究對象寫得夠具體嗎？（例：哪所學校哪個年級）

不用替我修改，只要指出問題點。

【研究方法】___
【研究題目】___
【研究動機】（1）情境／理由：___（2）能解決什麼：___
【研究目的】___
【主研究問題】___
【子問題】___
【研究對象】___`;

const PLAN_AI_PROMPTS = {
    questionnaire: PLAN_CH1_CHECK_PROMPT,
    interview: PLAN_CH1_CHECK_PROMPT,
    experiment: PLAN_CH1_CHECK_PROMPT,
    observation: PLAN_CH1_CHECK_PROMPT,
    literature: PLAN_CH1_CHECK_PROMPT,
};

/* — ExportButton 欄位 — */
const EXPORT_FIELDS = [
    /* Step 3：計畫書組裝工作坊 */
    { key: 'w9-teacher-feedback-sync', label: 'W8 老師建議與我的修正', question: '老師給了什麼建議？我打算在第一章做什麼修正？' },
    { key: 'w9-plan-ch1-decisions', label: '第一章關鍵決策', question: '本節最重要的 2-3 個決定（研究題目／主問題／對象等）' },
    { key: 'w9-plan-ai-check', label: 'AI 檢核第一章判斷紀錄', question: '有用 AI 檢核邏輯一致性才要填：AI 建議、採納與否、理由' },
    { key: 'w9-plan-ch1-checklist', label: '第一章完成清單（勾選）', question: '8 項全部勾完才算本節過關' },
    /* Step 4：回顧與繳交 */
    { key: 'w9-revision-plan', label: 'W10 前必須做的最大修改', question: '整合 W8 建議與三層尺後，計畫書前段要做的最大修改' },
    { key: 'w9-homework-commitment', label: '計畫書撰寫時間承諾', question: '我打算什麼時候寫計畫書第二～八章？' },
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
                        <div className="text-[11px] font-mono text-[var(--ink-light)] uppercase tracking-wider mb-3">階層練習 · 用三層尺自己判斷</div>
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
                        </div>
                        <div className="mt-3 text-[11px] text-[var(--ink-light)] leading-relaxed">
                            💡 做完這兩題你會發現：<strong className="text-[var(--ink-mid)]">「方向錯」和「測不準」要分開看</strong>——方向錯要重寫題目，測不準只要把模糊詞換成具體數字就能救。
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

        /* ─── Step 3：計畫書組裝工作坊（W9 第二節重點：修計畫書第一章） ─── */
        {
            title: '計畫書組裝工作坊',
            icon: '📋',
            content: (
                <div className="space-y-8 prose-zh">
                    {/* 開場 */}
                    <p className="text-[14px] text-[var(--ink-mid)] leading-relaxed max-w-[720px]">
                        第一節學了<strong className="text-[var(--ink)]">三層尺</strong>與<strong className="text-[var(--ink)]">錯誤類型</strong>——那是「診斷」。第二節回到<strong className="text-[var(--ink)]">實作</strong>：把 W2–W8 寫過的東西整合進研究計畫書。
                    </p>
                    <div className="w7-notice w7-notice-gold">
                        🎯 <strong>本節目標：完成計畫書第一章（研究主題基本資訊）</strong>——W8 老師給的建議就在這一章修。第二章以後課後繼續，W10 定稿。
                    </div>

                    {/* W8 素材狀態：有寫顯示唯讀，沒寫顯示戰情警示 */}
                    {(w8Drafts.q1 || w8Drafts.q2 || w8Drafts.q3) ? (
                        <div className="bg-white border border-[var(--border)] rounded-[var(--radius-unified)] overflow-hidden">
                            <div className="px-5 py-3 bg-[var(--paper-warm)] border-b border-[var(--border)] flex items-center gap-2">
                                <span className="text-[10px] font-mono font-bold bg-[var(--accent)] text-white px-2 py-0.5 rounded-[3px]">W8 ARCHIVE</span>
                                <span className="font-bold text-[13px] text-[var(--ink)]">W8 你寫的三題初稿（唯讀）——對照老師給的建議修正</span>
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
                        <div className="bg-[var(--ink)] border-l-4 border-[var(--danger)] p-5 md:p-6 rounded-r-lg text-white shadow-xl">
                            <div className="flex items-center gap-2 mb-3">
                                <ShieldAlert className="text-[var(--danger)]" size={20} />
                                <span className="font-mono text-[11px] font-bold tracking-[0.2em] text-[var(--danger)] uppercase">R.I.B. 戰情示警 · Level 3</span>
                            </div>
                            <div className="font-bold text-[17px] md:text-[18px] mb-3 leading-tight">
                                W8 計畫書第一版沒寫 = 本節開不了工
                            </div>
                            <p className="text-[13px] text-white/85 leading-[1.9] mb-3">
                                讀不到你的 W8 三題初稿——代表 W8 計畫書第一版沒寫（或沒存檔）。本節要做的整合都靠它：
                            </p>
                            <ul className="text-[12.5px] text-white/85 leading-[1.95] space-y-1 mb-4 pl-4">
                                <li>・<strong className="text-white">W8 老師建議</strong>：沒草稿 → 老師沒東西可批</li>
                                <li>・<strong className="text-white">第一章修改</strong>：沒方向 → 無法討論怎麼改</li>
                                <li>・<strong className="text-white">計畫書組裝</strong>：沒動機／問題／對象 → 第一章全空</li>
                            </ul>
                            <p className="text-[13px] text-white/90 leading-[1.9] mb-4">
                                <strong className="text-[var(--danger)]">本節結束前回 W8 把三題補完</strong>——不然組員無法前進，落掉 W9 會連帶拖到 W10/W11。
                            </p>
                            <Link to="/w8" className="inline-flex items-center gap-2 bg-[var(--danger)] text-white px-4 py-2.5 rounded font-bold text-[13px] hover:opacity-90 transition-opacity">
                                <ArrowRight size={15} />
                                立刻回 W8 補寫三題
                            </Link>
                        </div>
                    )}

                    {/* 你的計畫書模板 */}
                    <div>
                        <h4 className="font-serif text-[18px] md:text-[20px] font-bold text-[var(--ink)] mb-2">你的計畫書模板</h4>
                        <p className="text-[13px] text-[var(--ink-mid)] leading-relaxed mb-4">
                            老師會透過 <strong>Google Classroom</strong> 發你這份 docx 的 Google Docs 副本。對照你的研究方法確認一下：
                        </p>
                        <div className="flex flex-wrap gap-2 mb-4">
                            {METHOD_OPTIONS.map((m) => (
                                <button
                                    key={m.id}
                                    type="button"
                                    onClick={() => setSelectedMethod(m.id)}
                                    className={`text-[12px] font-bold px-3 py-1.5 rounded-[6px] border transition-colors ${selectedMethod === m.id
                                        ? 'bg-[var(--ink)] text-white border-[var(--ink)]'
                                        : 'bg-white text-[var(--ink-mid)] border-[var(--border)] hover:border-[var(--ink)]'
                                        }`}
                                >
                                    {m.label}
                                </button>
                            ))}
                        </div>
                        {selectedMethod ? (
                            (() => {
                                const planInfo = {
                                    questionnaire: { filename: '問卷研究法_計畫書第二版.docx', brief: '量化研究；核心是「變項 → 問卷題目」。第二章起要定變項、做題目設計。' },
                                    interview: { filename: '訪談研究法_計畫書第二版.docx', brief: '質性研究；核心是「訪談主題框架」。第二章起要拆主題、設計訪綱。' },
                                    experiment: { filename: '實驗研究法_計畫書第二版.docx', brief: '量化研究；核心是「自變項/依變項/控制變項」。第二章起要定變項、設計實驗流程。' },
                                    observation: { filename: '觀察研究法_計畫書第二版.docx', brief: '核心是「行為操作型定義」。第二章起要把抽象行為定義到別人可重複觀察。' },
                                    literature: { filename: '文獻分析法_計畫書第二版.docx', brief: '文獻本身就是對象。第二章起要定搜尋關鍵字組、納入排除準則。' },
                                }[selectedMethod];
                                return (
                                    <div className="bg-white border-2 border-[var(--accent)] rounded-[var(--radius-unified)] p-5">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-[10px] font-mono font-bold bg-[var(--accent)] text-white px-2 py-0.5 rounded-[3px]">你的計畫書</span>
                                            <span className="font-bold text-[14px] text-[var(--ink)]">{planInfo.filename}</span>
                                        </div>
                                        <p className="text-[12.5px] text-[var(--ink-mid)] leading-relaxed">{planInfo.brief}</p>
                                    </div>
                                );
                            })()
                        ) : (
                            <div className="bg-[var(--paper-warm)] border border-dashed border-[var(--border)] rounded-[var(--radius-unified)] p-4 text-[12.5px] text-[var(--ink-light)]">
                                👆 請先選擇你的研究方法（正常從 W8 帶入；若沒帶入請手動點選）。
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

                    {/* W8 老師建議整合 */}
                    <ThinkRecord
                        dataKey="w9-teacher-feedback-sync"
                        prompt="W8 老師在你的計畫書第一版上給了什麼建議？這週要怎麼改？"
                        defaultTemplate={'老師的建議：___\n我打算在第一章做的修正：___'}
                        rows={6}
                    />

                    {/* 第一章組裝 */}
                    <div>
                        <h4 className="font-serif text-[16px] md:text-[18px] font-bold text-[var(--ink)] mb-2">第一章組裝：本節要完成的 6 格</h4>
                        <p className="text-[13px] text-[var(--ink-mid)] leading-relaxed mb-3">
                            具體內容<strong className="text-[var(--ink)]">寫在 docx 上</strong>。下方 ThinkRecord 只記「關鍵決策 + 為什麼」——不是重寫計畫書。
                        </p>
                        <ol className="pl-5 mb-4 space-y-1 text-[13px] text-[var(--ink-mid)] list-decimal">
                            <li>研究題目（主標—副標）</li>
                            <li>研究動機（兩個引導問題：情境／解決什麼）</li>
                            <li>研究目的（一句話）</li>
                            <li>主研究問題（一個問句）</li>
                            <li>子問題 2–3 條</li>
                            <li>對象 + 預定時間</li>
                        </ol>
                        <ThinkRecord
                            dataKey="w9-plan-ch1-decisions"
                            prompt="第一章關鍵決策（docx 填完後，在這裡摘要本節最重要的 2-3 個決定）"
                            defaultTemplate={'決定 1：研究題目從「___」調整為「___」，因為 ___\n決定 2：主問題縮小到「___」，原本「___」太大\n決定 3：對象從「___」改為「___」，因為 ___'}
                            rows={7}
                        />
                    </div>

                    {/* AI 檢核（可選） */}
                    <AIAssistToggle
                        id="w9-plan-ai"
                        title="用 AI 檢核計畫書第一章的邏輯一致性（可選）"
                        reason="第一章是整份研究的地基——動機、目的、主問題三者要邏輯一致。AI 適合檢核「動機是否支撐問題」「目的是否能由問題回答」這類結構性問題。AI 不會替你確立方向，那是人腦的事。"
                        promptByMethod={PLAN_AI_PROMPTS}
                        method={selectedMethod}
                        recordKey="w9-plan-ai-check"
                        recordPrompt="AI 給了什麼建議？你採納哪些、不採納哪些？為什麼？"
                        recordPlaceholder="A: 我用了 ChatGPT-4o&#10;I: 我貼了第一章內容，請它檢查邏輯一致性&#10;E: AI 指出主問題太大，建議縮小&#10;D: 我採納把主問題縮小；不採納 AI 建議改對象（那是 W8 已定）"
                    />

                    {/* 第一章完成 Checklist */}
                    <Checklist
                        dataKey="w9-plan-ch1-checklist"
                        prompt="第一章完成清單（全部勾完才算本節過關）"
                        items={[
                            '研究題目（主標—副標）已寫',
                            '研究動機兩個引導問題都答',
                            '研究目的一句話已定',
                            '主研究問題是一個明確問句',
                            '子問題 2–3 條',
                            '對象寫得具體',
                            '預定時間（哪幾週做）',
                            'W8 老師的建議都已納入修正',
                        ]}
                    />

                    {/* 下一步 */}
                    <div className="w7-notice w7-notice-teal">
                        ✅ 第一章完成 → 到 <strong>Step 4 回顧與繳交</strong> 做「時間承諾」，規劃課後寫第二到第八章（W10 前完成）。
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
                                '學會三層尺判斷工具品質（方向 / 精度 / 執行）',
                                '辨識錯誤類型（誘導性、雙重問題、假開放）',
                                '完成計畫書第一章（研究主題、動機、問題、對象）',
                                '整合 W8 老師建議到第一章',
                                '規劃好 W9 → W10 計畫書撰寫時程',
                            ].map((item, i) => (
                                <div key={i} className="p-4 px-6 bg-white flex items-start gap-3">
                                    <CheckCircle2 size={16} className="text-[var(--success)] mt-0.5 flex-shrink-0" />
                                    <span className="text-[13px] text-[var(--ink-mid)]">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 2. W10 前要做的最大修改 */}
                    <ThinkRecord
                        dataKey="w9-revision-plan"
                        prompt="整合 W8 老師建議與本節學到的三層尺，W10 之前計畫書前段必須做的最大修改是什麼？"
                        defaultTemplate={'最大的修改：___\n理由（引用老師建議或三層尺）：___\n預計完成時間：___'}
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

                    {/* 6. 課後計畫書撰寫鷹架 */}
                    <div className="bg-[#FEF3C7] border-2 border-[#D97706] rounded-[var(--radius-unified)] overflow-hidden">
                        <div className="px-5 py-4 bg-[#D97706] text-white flex items-center gap-3">
                            <span className="bg-white text-[#D97706] text-[10px] font-mono font-bold px-2 py-1 rounded-[3px]">HOMEWORK</span>
                            <h3 className="font-bold text-[14px] leading-tight">W9 → W10 課後：計畫書第二～第八章</h3>
                            <span className="ml-auto text-[11px] font-mono opacity-90">W10 第二節前完成</span>
                        </div>
                        <div className="p-5 space-y-4">
                            <p className="text-[13px] text-[#92400E] leading-relaxed">
                                <strong>現實盤點</strong>：本節完成了計畫書第一章。第二到第八章要課後寫完，<strong className="text-[var(--danger)]">不要拖到 W10 下課前才趕</strong>——那時還要設計工具。
                            </p>

                            <div className="bg-white border border-[#D97706]/30 rounded-[8px] p-5 space-y-3">
                                <div className="text-[10px] font-mono text-[var(--ink-light)] uppercase tracking-wider mb-1">課後要寫完的章節</div>
                                <ul className="text-[13px] text-[var(--ink)] space-y-1.5 leading-relaxed">
                                    <li>・<strong>第二章</strong>：關鍵詞／行為操作型定義（3 個以上）</li>
                                    <li>・<strong>第三章</strong>：文獻回顧（至少 2–3 篇，從 W5–W6 整合）</li>
                                    <li>・<strong>第四章</strong>：變項／主題／維度設計（方法特性專屬欄位）</li>
                                    <li>・<strong>第五章</strong>：對象與抽樣（從 W8 整合）</li>
                                    <li>・<strong>第六章</strong>：工具設計（W10 第二節完成）</li>
                                    <li>・<strong>第七～九章</strong>：實施／分析／結論（W10 第二節完成）</li>
                                </ul>
                            </div>

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
                                    prompt="我打算什麼時候寫計畫書？（越具體越有效）"
                                    defaultTemplate={'時段 1：___（日期+時間段），地點：___，預計寫第 ___ 章\n時段 2：___\n時段 3：___'}
                                    rows={5}
                                />
                            </div>

                            <div className="bg-[var(--ink)] rounded-[6px] p-4 text-white">
                                <div className="text-[11px] font-mono opacity-70 uppercase tracking-wider mb-1">W10 會做什麼</div>
                                <p className="text-[13px] leading-relaxed">
                                    第一節：AI 檢核計畫書前段 + 設計工具（問卷題目 / 訪綱 / 實驗流程 / 觀察紀錄表 / 比較矩陣）。<br />
                                    第二節：計畫書定稿 + 繳交。<br />
                                    <strong className="text-[var(--danger)]">計畫書沒寫到第五章就來上課 = W10 第一節會卡死</strong>。
                                </p>
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
