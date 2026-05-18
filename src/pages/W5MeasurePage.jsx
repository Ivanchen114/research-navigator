import React, { useState, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './ClinicPage.css';
import CourseArc from '../components/ui/CourseArc';
import ContentTypeChip from '../components/ui/ContentTypeChip';
import ThinkRecord from '../components/ui/ThinkRecord';
import AIREDNarrative from '../components/ui/AIREDNarrative';
import StepEngine from '../components/ui/StepEngine';
import HeroBlock from '../components/ui/HeroBlock';
import TaskCard from '../components/ui/TaskCard';
import ExportButton from '../components/ui/ExportButton';
import StepBriefing from '../components/ui/StepBriefing';
import ResetWeekButton from '../components/ui/ResetWeekButton';
import BackfillField from '../components/ui/BackfillField';
import { readRecords, STORAGE_KEY } from '../components/ui/ThinkRecord';
import {
    Map,
    ArrowRight,
    CheckCircle2,
    Ruler,
} from 'lucide-react';
import LessonMap from '../components/ui/LessonMap';
import { W5Data } from '../data/lessonMaps';

/* ══════════════════════════════════════
 *  資料常數
 * ══════════════════════════════════════ */

/* 5 法操作型定義策略——對齊 W4 方法地圖 5 法 */
const METHOD_STRATEGIES = [
    {
        id: 'survey',
        icon: '📋',
        name: '問卷',
        color: 'var(--accent)',
        bg: 'var(--accent-light)',
        formula: '題目選項 ＝ 操作型定義',
        story: [
            { p: '我想研究「壓力」，但壓力很抽象。如果我直接問「你壓力大嗎？」每個人的標準不一樣——有人覺得考前睡不著才叫壓力，有人覺得功課多就叫壓力。' },
            { p: '所以我不能只問「壓力大不大」，要把壓力拆成學生能回答的具體題目。我從幾個方向想：壓力可能表現在身體（睡不好、頭痛）、情緒（煩躁、焦慮）、行為（熬夜、拖延）。最後決定用 5 題量表，每題 1–5 分作答——學生填完就有數字。', note: '① 可蒐集：填完每題有分數，加總就是一個可比較的數字' },
            { p: '我設定這些題目只問「課業與學校相關」的壓力，不包含家庭、感情、經濟壓力——範圍限定清楚，選項固定，時間範圍「過去一週」也清楚。', note: '② 邊界清楚：選項設計讓每個人填的是同一件事' },
            { p: '最後整份研究都用這 5 題總分代表壓力，分析時不換成別的指標。', note: '③ 前後一致：從收資料到寫結論都用同一組題目加總' },
        ],
        definition: '本研究將「高中生壓力」定義為學生在過去一週中，因課業、時間安排與自我要求所感受到的緊張與不安程度，以 5 題壓力量表測量，每題 1–5 分，總分越高代表壓力越高。',
        example: '核心概念：高中生壓力\n操作型定義：\n  ❶「過去一週熬夜超過 12 點的次數」（具體計次，0-7 次）\n  ❷「常用心理壓力問卷得分」（共 10 題、每題 1-5 分打分後加總；這份問卷有個正式名字叫 PSS-10）',
        terms: [
            { term: '李克特量表', def: '「非常不同意 1 分～非常同意 5 分」這種分段勾選格式。拿現成驗證過的量表（如壓力用 PSS-10），加總得分就是你的操作型定義。' },
        ],
    },
    {
        id: 'interview',
        icon: '🎤',
        name: '訪談',
        color: '#7c3aed',
        bg: '#f3f0ff',
        formula: '訪綱大問 + 編碼類別 ＝ 操作型定義',
        story: [
            { p: '我想研究「學習動機」，但這個詞太大。如果我問學生「你有學習動機嗎？」他可能只回答「有」或「沒有」——這樣我分析不了原因或類型。' },
            { p: '所以我應該讓他說出具體經驗。我要問的是：學生在什麼情況下會自己想學？是因為成績？興趣？同儕？老師？訪談不是要把每個人變成分數，而是要從回答裡找出類型。我需要一個能引出故事的訪綱，和一套事後分類用的編碼類別。', note: '① 可蒐集：訪談拿到具體口述，有內容可以分析' },
            { p: '我把回答分成四類：興趣型、成績型、目標型、關係型。「主動」定義為沒人要求、自發起的行為——被父母要求去補習不算。知道哪種回答算進哪一類。', note: '② 邊界清楚：四分類各有定義，邊界說清楚' },
            { p: '所有訪談逐字稿都用同一套四分類編碼，不為某位受訪者特別調整。兩人各自編碼，一致率 ≥ 80% 才算定義夠清楚。', note: '③ 前後一致：全部逐字稿用同一套標準' },
        ],
        definition: '本研究將「學習動機」定義為學生在學習過程中，促使自己主動投入某一科目或任務的理由，以「最近一次主動學習的具體經驗」引導口述，並將回答編碼為興趣型、成績型、目標型與關係型四類。',
        example: '核心概念：學習動機\n訪綱：「請描述最近一次你『主動』學習的具體事件」\n編碼類別：\n  ❶「主動」＝沒人要求自發起的行為\n  ❷ 包含「具體時間／地點／引發者」三要素的口述算 1 個事件',
        terms: [
            { term: '編碼類別', def: '事後把口述分門別類的標籤名單——沒有它，一堆口述沒法分析。' },
            { term: '分析單位', def: '你一次拿來分析的最小一塊（一個事件？一段話？）先定清楚才能編碼。' },
            { term: '雙人編碼／一致率', def: '兩人各自照標籤名單分類，一致率 ≥ 80% 才算定義夠清楚。' },
        ],
    },
    {
        id: 'experiment',
        icon: '🧪',
        name: '實驗',
        color: '#d97706',
        bg: '#fef3c7',
        formula: '自變項 + 依變項 + 控制變項　全部要寫',
        story: [
            { p: '我想研究「聽古典音樂會不會影響短期記憶」。重點不是問學生覺得有沒有幫助，而是要實際測——「記憶變好了」靠感覺沒辦法比較，要有客觀數字才能說有沒有差。' },
            { p: '所以我先分清楚三件事：我改變什麼（是否聽古典音樂）、我測量什麼（短期記憶表現）、我要控制什麼（測驗時間、環境、前一晚睡眠）。三類變項都操作化了，別人才能重做。我用「看 10 個名詞、記 2 分鐘、再回憶答對幾個」——最後有 0–10 分的數字。', note: '① 可蒐集：回憶名詞的正確數量，是具體的 0–10 分' },
            { p: '實驗組聽古典音樂 30 分鐘、控制組安靜休息 30 分鐘；完整寫出名詞才算對，音近字不算。', note: '② 邊界清楚：實驗條件明確，計分規則說清楚' },
            { p: '全部受試者都用同一份材料和同一個計分方式，中途沒改規則。', note: '③ 前後一致：從頭到尾用同一套程序和計分' },
        ],
        definition: '本研究將「短期記憶」定義為受試者在 2 分鐘內記憶 10 個不相關名詞，經 1 分鐘干擾後能正確回憶的名詞數量（0–10 分）。實驗組在測驗前聽古典音樂 30 分鐘，控制組安靜休息 30 分鐘。',
        example: '研究：聽古典音樂能否提升短期記憶？\n自變項：聽古典音樂（巴哈賦格）30 分鐘 vs 安靜休息 30 分鐘\n依變項：10 個不相關名詞、5 分鐘記憶後立即回憶得分（0-10 分）\n控制變項：相同房間光線、午後同一時段、受試者前一晚睡 ≥ 6 小時',
        terms: [
            { term: '自變項', def: '你動手改的那個條件。' },
            { term: '依變項', def: '你想看有沒有跟著變的。' },
            { term: '控制變項', def: '刻意維持不變、不讓它干擾的條件——少寫一條就不完整。' },
        ],
    },
    {
        id: 'observation',
        icon: '👀',
        name: '觀察',
        color: 'var(--success)',
        bg: 'var(--success-light)',
        formula: '行為類別 + 正反例 ＝ 操作型定義',
        story: [
            { p: '我想研究「學生自習時會不會分心」。可是「分心」不能靠感覺——我不能看到學生動一下就說他分心，因為他可能只是換姿勢、拿筆、喝水。' },
            { p: '所以我要把「分心」變成看得見的行為。我先想：自習時哪些行為可以合理代表分心？滑手機、跟同學聊天、視線離開課本很久、趴睡。但我還要設定時間界線——學生只是抬頭 1 秒不能算。所以設定「連續 5 秒以上」才算一次，觀察者用計次表記錄。', note: '① 可蒐集：觀察者可以計次，不靠感覺' },
            { p: '滑手機、望窗外算；喝水、換姿勢不算。「連續 5 秒以上」是清楚的門檻——任何人拿到這個定義，觀察同一個學生，記到的次數應該一樣。', note: '② 邊界清楚：正反例列清楚，門檻說明白' },
            { p: '整個觀察期間都用同一套標準，不因班級不同而調整門檻。兩人各自編碼，一致率 ≥ 80% 才算定義夠清楚。', note: '③ 前後一致：全程用同一條標準，不換' },
        ],
        definition: '本研究將「自習中分心」定義為學生在自習時間內，出現與學習任務無關且連續持續 5 秒以上的行為，包含滑手機、與同學聊天、視線離開教材、趴睡或處理非課業物品。換姿勢、喝水、拿文具等短暫動作不列入分心。',
        example: '核心概念：自習中分心\n操作型定義：視線離開課本連續 ≥ 5 秒\n  ✅ 正例：滑手機、發呆望窗外、跟旁邊人聊天\n  ❌ 反例：換姿勢、揉眼睛、喝水（< 5 秒）',
        terms: [
            { term: '雙人編碼／一致率', def: '兩人各自對行為分類，一致率 ≥ 80% 才算正反例定得夠清楚。' },
        ],
    },
    {
        id: 'literature',
        icon: '📚',
        name: '文獻分析',
        color: '#6b21a8',
        bg: '#f5f3ff',
        formula: '分析單位 + 編碼類別 ＝ 操作型定義',
        story: [
            { p: '我想研究「社群留言是不是有攻擊性」。但攻擊性不能只靠感覺說「這條很兇」——有些留言只是不同意，有些才是真的攻擊。光靠感覺，兩個人看同一則留言可能判斷不同。' },
            { p: '所以我先決定分析單位：我要分析一整篇貼文？一則留言？還是一句話？如果研究 Threads 留言，我把「一則留言」當成一個分析單位。接著定義攻擊性的分類：人身攻擊、嘲諷羞辱、能力貶低、群體標籤——從文本裡找到、標記、計次。', note: '① 可蒐集：從留言中找到並標記各類攻擊性語句，可以計次' },
            { p: '「我不同意你的看法」不算攻擊；「這個論點證據不足」也不算——各類有定義，知道哪種算、哪種不算。', note: '② 邊界清楚：理性反駁和人身攻擊有清楚區別' },
            { p: '所有留言都用同一套四分類標準，中途沒改規則。兩人各自分類，一致率 ≥ 80% 才算定義夠清楚。', note: '③ 前後一致：全部留言用同一套標準，不換' },
        ],
        definition: '本研究將「社群留言中的攻擊性」定義為留言中出現針對個人或群體的貶低、羞辱、嘲諷或負面標籤，分析單位為一則留言，分為人身攻擊、嘲諷羞辱、能力貶低與群體標籤四類。單純表達不同意或針對論點的批評不列入攻擊性留言。',
        example: '② 歷史文獻分析　時間軸切點：每 10 年一個段落，內含關鍵事件 ≥ 3 件\n③ 內容分析　詞彙計次：「民主」每出現 1 次計 1（含複合詞如民主化）\n④ 論述分析　話語策略類別：強調／淡化／批評（兩人各自分類，對完答案後一致八成以上，才算定義夠清楚）\n⑤ 敘事分析　情節結構：開展（背景）／轉折（衝突）／結局（收束）三段式',
        terms: [
            { term: '分析單位', def: '你一次拿來分析的最小一塊（一篇社論？一段話？一個十年段落？）。' },
            { term: '編碼類別', def: '從文獻裡抓主題的標籤名單。' },
            { term: '雙人編碼／一致率', def: '兩人各自分類，一致率 ≥ 80% 才算定義清楚。' },
        ],
    },
];

/* 暖身練習：三個概念各自的 4 步驟資料 */
const WARMUP_DATA = {
    '手機依賴': {
        s1Options: ['依賴', '手機'],
        s1Answer: '依賴',
        s1Hint: '「手機」是工具，你要測的是人對它的「依賴」程度。',
        s2Options: [
            { id: 'A', text: '每天使用手機超過 3 小時' },
            { id: 'B', text: '每日主動解鎖次數 ≥ 60 次，且連續 3 天都超過' },
        ],
        s2Answer: 'B',
        s2Hint: '「超過 3 小時」包含聽音樂、導航，不一定是依賴。解鎖次數捕捉「忍不住拿起來」這個行為。',
        s3Items: [
            { id: 'a', text: '上課偷滑 IG，每 10 分鐘拿一次', answer: '正' },
            { id: 'b', text: '拿手機查下課時間，看完放回去', answer: '反' },
            { id: 'c', text: '睡前刷到凌晨 1 點、關了又開', answer: '正' },
            { id: 'd', text: '用手機計時跑步 30 分鐘', answer: '反' },
        ],
        s4Checks: ['用碼表記每日解鎖次數，可量', '③ 正反例已列，有人不同意也能對照', '整份研究的「依賴」定義不會中途改變'],
    },
    '睡眠品質': {
        s1Options: ['品質', '睡眠'],
        s1Answer: '品質',
        s1Hint: '「睡眠」是行為，「品質」才是你要評估的好或不好。',
        s2Options: [
            { id: 'A', text: '自己覺得睡得好不好（1-5 分自評）' },
            { id: 'B', text: '入睡時間 ≤ 20 分鐘，且夜醒次數 ≤ 1 次' },
        ],
        s2Answer: 'B',
        s2Hint: '自評主觀，每個人的「好」標準不同。入睡時間和夜醒次數可以客觀記錄，別人也能一樣操作。',
        s3Items: [
            { id: 'a', text: '躺下 15 分鐘內睡著，一覺到鬧鐘', answer: '正' },
            { id: 'b', text: '半夜醒來 3 次，每次超過 5 分鐘', answer: '反' },
            { id: 'c', text: '睡了 9 小時，但中間醒了 4 次', answer: '反' },
            { id: 'd', text: '20 分鐘內入睡，只醒一次喝水後繼續睡', answer: '正' },
        ],
        s4Checks: ['入睡時間和夜醒次數可用睡眠日誌記錄，可量', '③ 正反例已列，判斷標準一致', '整份研究的「品質」定義不中途換'],
    },
    '社群媒體焦慮': {
        s1Options: ['焦慮', '社群媒體'],
        s1Answer: '焦慮',
        s1Hint: '「社群媒體」是場所，你要測的是使用後產生的「焦慮」。',
        s2Options: [
            { id: 'A', text: '使用後感到不安或有比較心理（自評）' },
            { id: 'B', text: '使用後「忍不住再滑一次」頻率 ≥ 每天 4 次，且刷完自評更不安' },
        ],
        s2Answer: 'B',
        s2Hint: '「感到不安」太主觀。用行為頻率加主觀方向，兩個條件同時成立才算，更精確、更好對照。',
        s3Items: [
            { id: 'a', text: '看完旅遊曬照後覺得自己很失敗、想刪帳號', answer: '正' },
            { id: 'b', text: '關掉 IG 5 分鐘後忍不住又打開', answer: '正' },
            { id: 'c', text: '留言「好羨慕！」然後繼續做功課', answer: '反' },
            { id: 'd', text: '下課滑限時動態，看完傳訊息給朋友', answer: '反' },
        ],
        s4Checks: ['頻率可用日誌計次，自評可用量表計分，可量', '③ 正反例已列，判斷標準一致', '整份研究的「焦慮」定義不中途換'],
    },
};

const METHOD_LOOKUP = METHOD_STRATEGIES.reduce((acc, m) => {
    acc[m.id] = m;
    return acc;
}, {});

/* 偵測 W4 主方法字串 → method id */
function detectMethodId(rawMethod) {
    const m = (rawMethod || '').toLowerCase();
    if (m.includes('問卷')) return 'survey';
    if (m.includes('訪談')) return 'interview';
    if (m.includes('實驗')) return 'experiment';
    if (m.includes('觀察')) return 'observation';
    if (m.includes('文獻')) return 'literature';
    return null;
}

/* 同一概念三方法對照範例（用「高中生壓力」當共同概念）*/
const PRESSURE_DEMO = [
    { icon: '📋', tag: '量化（問卷）', text: '「過去一週熬夜超過 12 點的次數」+「心理壓力問卷得分（10 題加總）」' },
    { icon: '🎤', tag: '質性（訪談）', text: '「請描述最近一次你覺得『壓力大』的具體事件」（口述事件編碼）' },
    { icon: '👀', tag: '行為（觀察）', text: '「自習課滑手機 ≥ 5 秒、發呆 ≥ 30 秒、頻繁站起的次數」' },
];

/* 操作型定義要做到 3 件事 */
const THREE_RULES = [
    { rule: '可蒐集', question: '收得到資料嗎？', desc: '抽象概念要翻成你實際能拿到的東西：數字、選項、口述內容、觀察紀錄或文本分類。' },
    { rule: '邊界清楚', question: '說得清楚什麼算嗎？', desc: '說得出什麼情況算、什麼情況不算。不同方法的做法不同：問卷靠選項設計、訪談靠編碼類別、實驗靠操作程序、觀察靠正反例、文獻靠分類規則。' },
    { rule: '前後一致', question: '有沒有換過？', desc: '整個研究用同一套定義。中途換了，前後的資料就沒法比較。' },
];

/* — ExportButton 欄位 — */
const EXPORT_FIELDS = [
    { key: 'w5-my-topic', label: '我的題目（從 W4 帶入）' },
    { key: 'w5-my-method', label: '我的主要方法（從 W4 帶入）' },
    { key: 'w5-wu-summary', label: '暖身練習：概念操作型定義', question: '你選的概念 + 四步驟練習結果' },
    { key: 'w5-core-concept', label: '我題目最關鍵的核心概念', question: '抽象概念是什麼？（壓力／動機／學習效果……）' },
    { key: 'w5-operationalize', label: '操作型定義', question: '這個概念怎麼測／怎麼問／怎麼觀察？對應你的方法。' },
    { key: 'w5-pos-neg', label: '正反例', question: '什麼算？什麼不算？至少各一個例子。' },
    { key: 'w5-reflect', label: '反思：模糊→可測的轉化', question: '把抽象概念變可測，最難的是什麼？你怎麼克服？' },
    { key: 'w5-aired-record', label: 'AI-RED 敘事紀錄', question: '本週最重要的一次 AI 互動（A-I-R-E-D 五要素）' },
];

/* ══════════════════════════════════════
 *  W4 帶入 + W2 好奇 RefCard
 * ══════════════════════════════════════ */
function W5HeaderRef({ topic, method, methodInfo, curiosity }) {
    const hasAny = topic || method || curiosity;
    if (!hasAny) return null;
    return (
        <div className="space-y-3">
            {(topic || method) && (
                <div className="flex items-start gap-3 px-4 py-3 rounded-[var(--radius-unified)] bg-[var(--accent-light)] border border-[var(--accent)] text-[13px]">
                    <span className="text-[16px]">📎</span>
                    <div className="flex-1">
                        <span className="font-bold text-[var(--accent)]">從 W4 帶入</span>
                        {topic && (
                            <p className="text-[var(--ink-mid)] mt-1">
                                <span className="text-[11px] font-mono text-[var(--ink-light)] mr-2">題目</span>
                                {topic}
                            </p>
                        )}
                        {method && (
                            <p className="text-[var(--ink-mid)] mt-0.5">
                                <span className="text-[11px] font-mono text-[var(--ink-light)] mr-2">主方法</span>
                                {methodInfo ? (
                                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[4px] text-[12px] font-bold" style={{ background: 'white', color: methodInfo.color, border: `1px solid ${methodInfo.color}` }}>
                                        <span>{methodInfo.icon}</span>
                                        <span>{methodInfo.name}</span>
                                    </span>
                                ) : (
                                    <span>{method}</span>
                                )}
                            </p>
                        )}
                    </div>
                </div>
            )}
            {curiosity && (
                <div className="bg-[#FEF3C7] border-l-3 border-[#D97706] p-3 rounded-r-[6px]">
                    <p className="text-[12px] font-bold text-[#92400E] mb-1.5">🪞 還記得 W2 你寫過的好奇嗎？</p>
                    <p className="text-[12.5px] text-[#78350F] leading-[1.85] italic mb-2 whitespace-pre-wrap">
                        「{curiosity}」
                    </p>
                    <p className="text-[11.5px] text-[#92400E] leading-relaxed">
                        👉 從那一週到現在過了 3 週——你 W3 篩了題目、W4 選了方法。<strong>這週要做的事</strong>就是把這份好奇變成「下週可以開始量／開始問／開始觀察」的具體動作——這就是<strong>操作型定義</strong>。
                    </p>
                </div>
            )}
        </div>
    );
}

/* ══════════════════════════════════════
 *  主元件
 * ══════════════════════════════════════ */

export const W5MeasurePage = () => {
    const [showLessonMap, setShowLessonMap] = useState(false);

    /* W4 帶入：題目、主方法 */
    const [w4Topic, setW4Topic] = useState('');
    const [w4MainMethod, setW4MainMethod] = useState('');
    const [methodId, setMethodId] = useState(null);

    /* W2 好奇帶入 */
    const [w2Curiosity, setW2Curiosity] = useState('');

    /* 5 法策略——學生選看哪一張（自動初始化為 W4 主方法）*/
    const [activeMethodId, setActiveMethodId] = useState(null);

    /* Step 2 暖身：學生挑的練習概念 */
    const [warmupConcept, setWarmupConcept] = useState(() => {
        try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')['w5-warmup-concept'] || ''; } catch { return ''; }
    });
    const pickWarmupConcept = (c) => {
        setWarmupConcept(c);
        try {
            const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
            all['w5-warmup-concept'] = c;
            const existingAnswers = all['w5-wu-answers'] || {};
            const summary = buildWuSummary(existingAnswers, c);
            if (summary) all['w5-wu-summary'] = summary;
            localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
        } catch {}
    };

    /* 老師示範互動 state */
    const [demoAnswers, setDemoAnswers] = useState(() => {
        try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')['w5-demo-answers'] || {}; } catch { return {}; }
    });
    const saveDemoAnswers = (next) => {
        setDemoAnswers(next);
        try { const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); all['w5-demo-answers'] = next; localStorage.setItem(STORAGE_KEY, JSON.stringify(all)); } catch {}
    };
    const pickDemoS1 = (v) => saveDemoAnswers({ ...demoAnswers, s1: v });
    const pickDemoS2 = (v) => saveDemoAnswers({ ...demoAnswers, s2: v });
    const pickDemoS3 = (id, v) => saveDemoAnswers({ ...demoAnswers, s3: { ...(demoAnswers.s3 || {}), [id]: v } });

    /* 暖身練習互動 state（以概念為 key 儲存） */
    const [wuAnswers, setWuAnswers] = useState(() => {
        try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')['w5-wu-answers'] || {}; } catch { return {}; }
    });
    const buildWuSummary = (answers, concept) => {
        if (!concept || !answers[concept]) return '';
        const data = WARMUP_DATA[concept];
        if (!data) return '';
        const wu = answers[concept];
        const s1ok = wu.s1 === data.s1Answer ? '✅' : wu.s1 ? '❌' : '—';
        const s2ok = wu.s2 === data.s2Answer ? '✅' : wu.s2 ? '❌' : '—';
        const s3 = wu.s3 || {};
        const s3correct = data.s3Items.filter(it => s3[it.id] === it.answer).length;
        const s3total = data.s3Items.length;
        const s3tag = Object.keys(s3).length === 0 ? '—' : `${s3correct}/${s3total} 答對`;
        return [
            `概念：${concept}`,
            `① 核心概念 → ${wu.s1 || '未作答'} ${s1ok}`,
            `② 操作型定義 → ${wu.s2 ? '選 ' + wu.s2 : '未作答'} ${s2ok}`,
            `③ 邊界清楚（${s3tag}）`,
            `④ 三件事檢核完成`,
        ].join('\n');
    };

    const saveWuAnswers = (next) => {
        setWuAnswers(next);
        try {
            const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
            all['w5-wu-answers'] = next;
            const concept = all['w5-warmup-concept'] || '';
            const summary = buildWuSummary(next, concept);
            if (summary) all['w5-wu-summary'] = summary;
            localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
        } catch {}
    };
    const pickWuS1 = (v) => saveWuAnswers({ ...wuAnswers, [warmupConcept]: { ...(wuAnswers[warmupConcept] || {}), s1: v } });
    const pickWuS2 = (v) => saveWuAnswers({ ...wuAnswers, [warmupConcept]: { ...(wuAnswers[warmupConcept] || {}), s2: v } });
    const pickWuS3 = (id, v) => saveWuAnswers({ ...wuAnswers, [warmupConcept]: { ...(wuAnswers[warmupConcept] || {}), s3: { ...((wuAnswers[warmupConcept] || {}).s3 || {}), [id]: v } } });

    /* Step 5 Prompt 即時帶入資料 */
    const [promptData, setPromptData] = useState(() => {
        try {
            const r = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
            return {
                topic: (r['w4-my-topic'] || r['w3-final-topic'] || '').trim(),
                concept: (r['w5-core-concept'] || '').trim(),
                method: (r['w4-main-method'] || '').trim(),
                opDef: (r['w5-operationalize'] || '').trim(),
                posNeg: (r['w5-pos-neg'] || '').trim(),
            };
        } catch { return { topic: '', concept: '', method: '', opDef: '', posNeg: '' }; }
    });

    /* Step 4 三件事自查勾選 */
    const [threeChecked, setThreeChecked] = useState(() => {
        try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')['w5-three-checks'] || [false, false, false]; } catch { return [false, false, false]; }
    });
    const toggleCheck = (i) => {
        const next = threeChecked.map((v, idx) => idx === i ? !v : v);
        setThreeChecked(next);
        try { const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); all['w5-three-checks'] = next; localStorage.setItem(STORAGE_KEY, JSON.stringify(all)); } catch {}
    };

    useEffect(() => {
        const refreshPrompt = () => {
            try {
                const r = readRecords();
                setPromptData({
                    topic: (r['w4-my-topic'] || r['w3-final-topic'] || '').trim(),
                    concept: (r['w5-core-concept'] || '').trim(),
                    method: (r['w4-main-method'] || '').trim(),
                    opDef: (r['w5-operationalize'] || '').trim(),
                    posNeg: (r['w5-pos-neg'] || '').trim(),
                });
            } catch {}
        };
        const timer = setInterval(refreshPrompt, 1500);
        window.addEventListener('focus', refreshPrompt);
        return () => { clearInterval(timer); window.removeEventListener('focus', refreshPrompt); };
    }, []);

    /* 帶入區inline編輯 */
    const [editingBringIn, setEditingBringIn] = useState(false);
    const [editTopic, setEditTopic] = useState('');
    const [editMethod, setEditMethod] = useState('');
    const [editCuriosity, setEditCuriosity] = useState('');

    const startEdit = () => {
        setEditTopic(w4Topic);
        setEditMethod(w4MainMethod);
        setEditCuriosity(w2Curiosity);
        setEditingBringIn(true);
    };
    const cancelEdit = () => setEditingBringIn(false);
    const saveEdit = useCallback(() => {
        const newTopic = editTopic.trim();
        const newMethod = editMethod.trim();
        const newCuriosity = editCuriosity.trim();
        try {
            const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
            if (newTopic) all['w4-my-topic'] = newTopic;
            if (newMethod) all['w4-main-method'] = newMethod;
            if (newCuriosity) all['w2-final-intent'] = newCuriosity;
            localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
        } catch { /* ignore */ }
        setW4Topic(newTopic || w4Topic);
        setW4MainMethod(newMethod || w4MainMethod);
        setW2Curiosity(newCuriosity || w2Curiosity);
        const mid = detectMethodId(newMethod || w4MainMethod);
        setMethodId(mid);
        setActiveMethodId(mid || activeMethodId || 'survey');
        setEditingBringIn(false);
    }, [editTopic, editMethod, editCuriosity, w4Topic, w4MainMethod, w2Curiosity, activeMethodId]);

    useEffect(() => {
        const refresh = () => {
            const saved = readRecords();
            const topic = (saved['w4-my-topic'] || saved['w3-final-topic'] || '').trim();
            setW4Topic(topic);
            const method = (saved['w4-main-method'] || '').trim();
            setW4MainMethod(method);
            const mid = detectMethodId(method);
            setMethodId(mid);
            if (!activeMethodId) setActiveMethodId(mid || 'survey');
            const intent = (saved['w2-final-intent'] || '').trim();
            const question = (saved['w2-step3-question'] || '').trim();
            if (intent) setW2Curiosity(intent);
            else if (question) setW2Curiosity(question);
            else setW2Curiosity('');
        };
        refresh();
        window.addEventListener('focus', refresh);
        return () => window.removeEventListener('focus', refresh);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const methodInfo = methodId ? METHOD_LOOKUP[methodId] : null;
    const activeStrategy = activeMethodId ? METHOD_LOOKUP[activeMethodId] : null;

    /* ── 5 步驟 ── */

    const steps = [
        /* ─── Step 1：開場 + 帶入 ─── */
        {
            title: '開場 + W4 帶入',
            icon: '📎',
            content: (
                <div className="space-y-6 prose-zh">
                    <StepBriefing
                        lines={[
                            { label: '學', text: '操作型定義：把抽象概念變成「誰來測都一樣」的可觀察指標' },
                            { label: '做', text: '確認 W4 帶入的題目與方法，準備寫核心概念的操作型定義' },
                        ]}
                    />

                    {/* 核心說明 + W4 帶入 合一張卡 */}
                    <div className="bg-[var(--paper-warm)] border border-[var(--border)] rounded-[var(--radius-unified)] p-5 space-y-4">
                        <div className="flex items-center gap-2">
                            <ContentTypeChip type="學" />
                            <h2 className="text-[18px] font-bold text-[var(--ink)]">把抽象概念變成可測指標</h2>
                        </div>
                        <p className="text-[13px] text-[var(--ink-mid)] leading-relaxed">
                            「壓力」要怎麼問？「動機」要怎麼量？——<strong className="text-[var(--ink)]">抽象詞沒辦法直接進問卷</strong>。這週把它翻譯成具體選項、行為或計次，下週才能真的動筆。
                        </p>

                        {/* W4 帶入：題目 + 方法 */}
                        {(w4Topic || w4MainMethod) && (
                            <div className="bg-[var(--accent-light)] border border-[var(--accent)] rounded-[var(--radius-unified)] px-4 py-3 space-y-2">
                                <div className="flex items-center justify-between gap-2">
                                    <span className="text-[11px] font-mono font-bold text-[var(--accent)] tracking-wider">📎 從 W4 帶入</span>
                                    {!editingBringIn && (
                                        <button
                                            type="button"
                                            onClick={startEdit}
                                            className="text-[11px] text-[var(--accent)] hover:underline font-mono"
                                        >
                                            ✏️ 修改
                                        </button>
                                    )}
                                </div>

                                {editingBringIn ? (
                                    <div className="space-y-3 pt-1">
                                        <div>
                                            <label className="text-[11px] font-mono text-[var(--ink-light)] block mb-1">題目</label>
                                            <textarea
                                                value={editTopic}
                                                onChange={e => setEditTopic(e.target.value)}
                                                rows={2}
                                                className="w-full text-[12.5px] border border-[var(--accent)] rounded-[6px] px-3 py-2 bg-white text-[var(--ink)] resize-none focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[11px] font-mono text-[var(--ink-light)] block mb-1">主方法</label>
                                            <div className="flex flex-wrap gap-1.5">
                                                {METHOD_STRATEGIES.map(m => (
                                                    <button
                                                        key={m.id}
                                                        type="button"
                                                        onClick={() => setEditMethod(m.name)}
                                                        className="text-[11.5px] px-2.5 py-1 rounded-[4px] border font-bold transition-all"
                                                        style={editMethod === m.name ? { background: m.color, color: '#fff', borderColor: m.color } : { background: '#fff', color: m.color, borderColor: m.color }}
                                                    >
                                                        {m.icon} {m.name}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-[11px] font-mono text-[var(--ink-light)] block mb-1">W2 好奇心</label>
                                            <textarea
                                                value={editCuriosity}
                                                onChange={e => setEditCuriosity(e.target.value)}
                                                rows={2}
                                                className="w-full text-[12.5px] border border-[var(--accent)] rounded-[6px] px-3 py-2 bg-white text-[var(--ink)] resize-none focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
                                                placeholder="你 W2 寫下的好奇或研究動機"
                                            />
                                        </div>
                                        <div className="flex gap-2 pt-1">
                                            <button type="button" onClick={saveEdit} className="text-[12px] font-bold bg-[var(--accent)] text-white px-4 py-1.5 rounded-[6px] hover:opacity-90 transition-opacity">儲存</button>
                                            <button type="button" onClick={cancelEdit} className="text-[12px] text-[var(--ink-mid)] px-3 py-1.5 rounded-[6px] border border-[var(--border)] hover:bg-[var(--paper-warm)] transition-colors">取消</button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        {w4Topic && (
                                            <p className="text-[13px] text-[var(--ink)] leading-relaxed">
                                                <span className="text-[11px] font-mono text-[var(--ink-light)] mr-2">題目</span>
                                                {w4Topic}
                                            </p>
                                        )}
                                        {w4MainMethod && (
                                            <p className="text-[13px] text-[var(--ink)] flex items-center gap-2">
                                                <span className="text-[11px] font-mono text-[var(--ink-light)]">主方法</span>
                                                {methodInfo ? (
                                                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[4px] text-[12px] font-bold bg-white" style={{ color: methodInfo.color, border: `1px solid ${methodInfo.color}` }}>
                                                        <span>{methodInfo.icon}</span>
                                                        <span>{methodInfo.name}</span>
                                                    </span>
                                                ) : (
                                                    <span>{w4MainMethod}</span>
                                                )}
                                            </p>
                                        )}
                                        {w2Curiosity && (
                                            <p className="text-[11.5px] text-[var(--ink-light)] italic leading-relaxed border-t border-[var(--accent)]/20 pt-2">
                                                💡 W2 好奇：「{w2Curiosity}」
                                            </p>
                                        )}
                                    </>
                                )}
                            </div>
                        )}
                    </div>

                    {/* BackfillField fallbacks */}
                    {(!w4Topic && !w4MainMethod && !w2Curiosity) && (
                        <BackfillField
                            dataKey="w4-my-topic"
                            label="⚠️ 沒偵測到你 W4 的題目——把你上週寫的研究題目貼這裡。"
                            placeholder="例：本校高一段考前一週的夜間滑手機時數與翌日專注力自評之相關性"
                            buttonLabel="補上 W4 題目"
                        />
                    )}
                    {(w4Topic && !w4MainMethod) && (
                        <BackfillField
                            dataKey="w4-main-method"
                            label="⚠️ 沒偵測到你 W4 選的主方法——把你上週決定的方法貼這裡（問卷／訪談／實驗／觀察／文獻分析）。"
                            placeholder="例：問卷"
                            buttonLabel="補上主方法"
                            tone="neutral"
                        />
                    )}
                </div>
            ),
        },

        /* ─── Step 2：操作型定義是什麼 ─── */
        {
            title: '操作型定義是什麼',
            icon: '📐',
            content: (
                <div className="space-y-6 prose-zh">
                    <StepBriefing
                        lines={[
                            { label: '學', text: '操作型定義：把抽象概念變成「誰來測都一樣」的可觀察指標' },
                            { label: '練', text: '看完老師示範，用同樣 4 步驟跑一題暖身' },
                        ]}
                    />

                    {/* ① 定義（一句話） */}
                    <div className="bg-white border-2 border-[var(--gold)] rounded-[var(--radius-unified)] overflow-hidden">
                        <div className="px-5 py-3 bg-[var(--gold)] text-white flex items-center gap-2">
                            <Ruler size={16} />
                            <ContentTypeChip type="學" />
                            <span className="font-bold text-[14px]">操作型定義是什麼</span>
                        </div>
                        <div className="p-5">
                            <p className="text-[13.5px] text-[var(--ink)] leading-relaxed">
                                把抽象概念變成<strong>具體、可觀察、可測量</strong>的指標——具體到「不同人來測也得到一樣的數字／類別」。
                            </p>
                        </div>
                    </div>

                    {/* ② 3 件事原則 */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <ContentTypeChip type="注意" />
                            <span className="text-[14px] font-bold text-[var(--ink)]">操作型定義要做到 3 件事</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {THREE_RULES.map((r, i) => (
                                <div key={i} className="bg-white border border-[var(--border)] rounded-[var(--radius-unified)] p-5 flex flex-col gap-3">
                                    <div className="flex items-center gap-2">
                                        <span className="w-8 h-8 rounded-[6px] bg-[var(--accent)] text-white flex items-center justify-center text-[15px] font-bold font-mono shrink-0">{i + 1}</span>
                                        <span className="text-[11px] text-[var(--ink-light)] font-mono tracking-wider">件事 {i + 1}</span>
                                    </div>
                                    <p className="text-[28px] font-bold text-[var(--ink)] leading-tight">{r.rule}</p>
                                    <p className="text-[12px] text-[var(--ink-light)] italic leading-snug">{r.question}</p>
                                    <p className="text-[12.5px] text-[var(--ink-mid)] leading-relaxed">{r.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ③ 老師示範：互動版 4 步驟 */}
                    <div className="bg-white border-2 border-[var(--accent)] rounded-[var(--radius-unified)] overflow-hidden">
                        <div className="px-5 py-3 bg-[var(--accent)] text-white flex items-center gap-2">
                            <span className="text-[14px]">📝</span>
                            <ContentTypeChip type="學" />
                            <span className="font-bold text-[14px]">老師示範：「上課專心」跑一遍 4 步驟</span>
                            <span className="ml-auto text-[10px] font-mono opacity-80 tracking-wider">5 MIN</span>
                        </div>
                        <div className="p-5 space-y-3">
                            <p className="text-[12.5px] text-[var(--ink-mid)]">每步驟先讓你試試看，再看解答。</p>

                            {/* ① 抽核心概念 */}
                            <details className="bg-[var(--paper-warm)] rounded-[6px] border border-[var(--border)]">
                                <summary className="px-3 py-2 text-[12.5px] font-bold cursor-pointer hover:bg-[var(--accent-light)] select-none">
                                    <span className="text-[var(--accent)] mr-2">①</span>抽核心概念
                                    {demoAnswers.s1 && <span className="ml-2 text-[11px] font-normal text-[var(--ink-light)]">→ {demoAnswers.s1}</span>}
                                </summary>
                                <div className="px-4 py-3 border-t border-[var(--border)] space-y-3">
                                    <p className="text-[12.5px] text-[var(--ink-mid)]">「上課專心」裡，你真正要測的是哪個詞？</p>
                                    <div className="flex gap-2">
                                        {['專心', '上課'].map(opt => (
                                            <button key={opt} onClick={() => pickDemoS1(opt)}
                                                className={`px-5 py-2 rounded-[6px] border-2 font-bold text-[15px] transition-colors ${demoAnswers.s1 === opt ? 'bg-[var(--accent)] text-white border-[var(--accent)]' : 'bg-white text-[var(--ink)] border-[var(--border)] hover:border-[var(--accent)]'}`}
                                            >{opt}</button>
                                        ))}
                                    </div>
                                    {demoAnswers.s1 && (
                                        <div className={`px-3 py-2 rounded-[6px] text-[12.5px] leading-relaxed ${demoAnswers.s1 === '專心' ? 'bg-[var(--success-light)] text-[#166534]' : 'bg-[#FEF2F2] text-[var(--danger)]'}`}>
                                            {demoAnswers.s1 === '專心' ? '✅ 對！「上課」是場景條件，「專心」才是要測量的概念。' : '❌「上課」是場景，不是要測的東西——核心概念是「專心」。'}
                                        </div>
                                    )}
                                </div>
                            </details>

                            {/* ② 操作型定義 */}
                            <details className="bg-[var(--paper-warm)] rounded-[6px] border border-[var(--border)]">
                                <summary className="px-3 py-2 text-[12.5px] font-bold cursor-pointer hover:bg-[var(--accent-light)] select-none">
                                    <span className="text-[var(--accent)] mr-2">②</span>用觀察法寫操作型定義
                                    {demoAnswers.s2 && <span className="ml-2 text-[11px] font-normal text-[var(--ink-light)]">→ 選 {demoAnswers.s2}</span>}
                                </summary>
                                <div className="px-4 py-3 border-t border-[var(--border)] space-y-3">
                                    <p className="text-[12.5px] text-[var(--ink-mid)]">哪個定義比較好？</p>
                                    <div className="space-y-2">
                                        {[
                                            { id: 'A', text: '感覺上在聽、沒有明顯分心' },
                                            { id: 'B', text: '視線連續 ≥ 10 秒停留在老師或黑板，且沒有滑手機、趴睡或持續交談' },
                                        ].map(opt => (
                                            <button key={opt.id} onClick={() => pickDemoS2(opt.id)}
                                                className={`w-full text-left px-4 py-3 rounded-[8px] border-2 text-[12.5px] transition-colors ${demoAnswers.s2 === opt.id ? 'border-[var(--accent)] bg-[var(--accent-light)]' : 'bg-white border-[var(--border)] hover:border-[var(--accent)]'}`}
                                            >
                                                <span className="font-bold text-[var(--accent)] mr-2">{opt.id}</span>{opt.text}
                                            </button>
                                        ))}
                                    </div>
                                    {demoAnswers.s2 && (
                                        <div className={`px-3 py-2 rounded-[6px] text-[12.5px] leading-relaxed ${demoAnswers.s2 === 'B' ? 'bg-[var(--success-light)] text-[#166534]' : 'bg-[#FEF2F2] text-[var(--danger)]'}`}>
                                            {demoAnswers.s2 === 'B' ? '✅ B 更好！「感覺上」每個人標準不一樣；B 的每個條件都可以用碼表和紀錄表客觀計次。' : '❌ A 太主觀——「感覺上」因人而異，無法比較。B 的條件可以直接觀察和計次。'}
                                        </div>
                                    )}
                                </div>
                            </details>

                            {/* ③ 正反例 */}
                            <details className="bg-[var(--paper-warm)] rounded-[6px] border border-[var(--border)]">
                                <summary className="px-3 py-2 text-[12.5px] font-bold cursor-pointer hover:bg-[var(--accent-light)] select-none">
                                    <span className="text-[var(--accent)] mr-2">③</span>列正反例
                                </summary>
                                <div className="px-4 py-3 border-t border-[var(--border)] space-y-2">
                                    <p className="text-[12.5px] text-[var(--ink-mid)]">這四個情況，各算正例還是反例？</p>
                                    {[
                                        { id: 'a', text: '抄筆記同時眼睛看黑板', answer: '正' },
                                        { id: 'b', text: '滑手機（即使課本攤開）', answer: '反' },
                                        { id: 'c', text: '舉手發問、盯著老師示範', answer: '正' },
                                        { id: 'd', text: '趴桌、跟同學持續交談', answer: '反' },
                                    ].map(item => {
                                        const pick = (demoAnswers.s3 || {})[item.id];
                                        return (
                                            <div key={item.id} className="flex items-center gap-2 bg-white rounded-[6px] border border-[var(--border)] px-3 py-2">
                                                <p className="flex-1 text-[12.5px] text-[var(--ink)]">{item.text}</p>
                                                <button onClick={() => pickDemoS3(item.id, '正')}
                                                    className={`px-2.5 py-1 text-[11px] rounded-[4px] font-bold border transition-colors shrink-0 ${pick === '正' ? 'bg-[var(--success)] text-white border-[var(--success)]' : 'bg-white border-[var(--border)] hover:border-[var(--success)]'}`}
                                                >正例</button>
                                                <button onClick={() => pickDemoS3(item.id, '反')}
                                                    className={`px-2.5 py-1 text-[11px] rounded-[4px] font-bold border transition-colors shrink-0 ${pick === '反' ? 'bg-[var(--danger)] text-white border-[var(--danger)]' : 'bg-white border-[var(--border)] hover:border-[var(--danger)]'}`}
                                                >反例</button>
                                                {pick && (pick === item.answer
                                                    ? <span className="text-[var(--success)] text-[13px] shrink-0">✅</span>
                                                    : <span className="text-[var(--danger)] text-[11px] shrink-0 whitespace-nowrap">❌ 應為{item.answer}</span>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </details>

                            {/* ④ 三件事檢核 */}
                            <details className="bg-[var(--paper-warm)] rounded-[6px] border border-[var(--border)]">
                                <summary className="px-3 py-2 text-[12.5px] font-bold cursor-pointer hover:bg-[var(--accent-light)] select-none">
                                    <span className="text-[var(--accent)] mr-2">④</span>三件事檢核
                                </summary>
                                <div className="px-4 py-3 text-[12.5px] text-[var(--ink-mid)] leading-relaxed border-t border-[var(--border)] space-y-1.5">
                                    <p>✅ <strong className="text-[var(--ink)]">可蒐集</strong>：碼表 + 紀錄表計次，不靠感覺</p>
                                    <p>✅ <strong className="text-[var(--ink)]">邊界清楚</strong>：抄筆記算、滑手機不算——③ 的四個情況都已列清楚</p>
                                    <p>✅ <strong className="text-[var(--ink)]">前後一致</strong>：整節課都用同一條「≥ 10 秒」標準</p>
                                </div>
                            </details>

                            {/* 文獻分析組 note */}
                            <div className="bg-[#f5f3ff] border-l-3 border-[#6b21a8] p-3 rounded-r-[6px] text-[12px] text-[var(--ink)] leading-relaxed">
                                📚 <strong>文獻分析組</strong>：你的操作型定義是「要從文獻裡抓什麼」——先定<strong>分析單位</strong>，再定<strong>編碼類別</strong>。Step 3 的「📚 文獻分析」卡有完整公式。
                            </div>

                            {/* 換你試一題：同樣 4 步驟 */}
                            <div className="border-t border-[var(--border)] pt-4 space-y-3">
                                <div className="flex items-center gap-2">
                                    <ContentTypeChip type="練" />
                                    <p className="text-[12.5px] font-bold text-[var(--ink)]">換你試一題</p>
                
                                </div>
                                <p className="text-[12.5px] text-[var(--ink-mid)]">挑一個概念，用同樣 4 步驟跑一遍。</p>
                                <div className="flex flex-wrap gap-2">
                                    {[
                                        { id: '手機依賴', label: '📱 手機依賴' },
                                        { id: '睡眠品質', label: '😴 睡眠品質' },
                                        { id: '社群媒體焦慮', label: '😰 社群媒體焦慮' },
                                    ].map(opt => (
                                        <button key={opt.id} onClick={() => pickWarmupConcept(opt.id)}
                                            className={`px-3 py-1.5 rounded-[6px] text-[12.5px] font-bold border transition-colors ${warmupConcept === opt.id ? 'bg-[var(--accent)] text-white border-[var(--accent)]' : 'bg-white text-[var(--ink)] border-[var(--border)] hover:border-[var(--accent)]'}`}
                                        >{opt.label}</button>
                                    ))}
                                </div>

                                {warmupConcept && (() => {
                                    const data = WARMUP_DATA[warmupConcept];
                                    const wu = wuAnswers[warmupConcept] || {};
                                    return (
                                        <div className="space-y-2">
                                            {/* wu ① */}
                                            <details className="bg-[var(--paper-warm)] rounded-[6px] border border-[var(--border)]">
                                                <summary className="px-3 py-2 text-[12.5px] font-bold cursor-pointer hover:bg-[var(--accent-light)] select-none">
                                                    <span className="text-[var(--accent)] mr-2">①</span>核心概念
                                                    {wu.s1 && <span className="ml-2 text-[11px] font-normal text-[var(--ink-light)]">→ {wu.s1}</span>}
                                                </summary>
                                                <div className="px-4 py-3 border-t border-[var(--border)] space-y-3">
                                                    <p className="text-[12.5px] text-[var(--ink-mid)]">「{warmupConcept}」裡，你真正要測的是哪個詞？</p>
                                                    <div className="flex gap-2">
                                                        {data.s1Options.map(opt => (
                                                            <button key={opt} onClick={() => pickWuS1(opt)}
                                                                className={`px-5 py-2 rounded-[6px] border-2 font-bold text-[15px] transition-colors ${wu.s1 === opt ? 'bg-[var(--accent)] text-white border-[var(--accent)]' : 'bg-white text-[var(--ink)] border-[var(--border)] hover:border-[var(--accent)]'}`}
                                                            >{opt}</button>
                                                        ))}
                                                    </div>
                                                    {wu.s1 && (
                                                        <div className={`px-3 py-2 rounded-[6px] text-[12.5px] leading-relaxed ${wu.s1 === data.s1Answer ? 'bg-[var(--success-light)] text-[#166534]' : 'bg-[#FEF2F2] text-[var(--danger)]'}`}>
                                                            {wu.s1 === data.s1Answer ? `✅ 對！${data.s1Hint}` : `❌ ${data.s1Hint}`}
                                                        </div>
                                                    )}
                                                </div>
                                            </details>

                                            {/* wu ② */}
                                            <details className="bg-[var(--paper-warm)] rounded-[6px] border border-[var(--border)]">
                                                <summary className="px-3 py-2 text-[12.5px] font-bold cursor-pointer hover:bg-[var(--accent-light)] select-none">
                                                    <span className="text-[var(--accent)] mr-2">②</span>操作型定義
                                                    {wu.s2 && <span className="ml-2 text-[11px] font-normal text-[var(--ink-light)]">→ 選 {wu.s2}</span>}
                                                </summary>
                                                <div className="px-4 py-3 border-t border-[var(--border)] space-y-3">
                                                    <p className="text-[12.5px] text-[var(--ink-mid)]">哪個定義比較好？</p>
                                                    <div className="space-y-2">
                                                        {data.s2Options.map(opt => (
                                                            <button key={opt.id} onClick={() => pickWuS2(opt.id)}
                                                                className={`w-full text-left px-4 py-3 rounded-[8px] border-2 text-[12.5px] transition-colors ${wu.s2 === opt.id ? 'border-[var(--accent)] bg-[var(--accent-light)]' : 'bg-white border-[var(--border)] hover:border-[var(--accent)]'}`}
                                                            >
                                                                <span className="font-bold text-[var(--accent)] mr-2">{opt.id}</span>{opt.text}
                                                            </button>
                                                        ))}
                                                    </div>
                                                    {wu.s2 && (
                                                        <div className={`px-3 py-2 rounded-[6px] text-[12.5px] leading-relaxed ${wu.s2 === data.s2Answer ? 'bg-[var(--success-light)] text-[#166534]' : 'bg-[#FEF2F2] text-[var(--danger)]'}`}>
                                                            {wu.s2 === data.s2Answer ? `✅ 對！${data.s2Hint}` : `❌ ${data.s2Hint}`}
                                                        </div>
                                                    )}
                                                </div>
                                            </details>

                                            {/* wu ③ */}
                                            <details className="bg-[var(--paper-warm)] rounded-[6px] border border-[var(--border)]">
                                                <summary className="px-3 py-2 text-[12.5px] font-bold cursor-pointer hover:bg-[var(--accent-light)] select-none">
                                                    <span className="text-[var(--accent)] mr-2">③</span>正反例判斷
                                                </summary>
                                                <div className="px-4 py-3 border-t border-[var(--border)] space-y-2">
                                                    <p className="text-[12.5px] text-[var(--ink-mid)]">這四個情況，各算正例還是反例？</p>
                                                    {data.s3Items.map(item => {
                                                        const pick = (wu.s3 || {})[item.id];
                                                        return (
                                                            <div key={item.id} className="flex items-center gap-2 bg-white rounded-[6px] border border-[var(--border)] px-3 py-2">
                                                                <p className="flex-1 text-[12.5px] text-[var(--ink)]">{item.text}</p>
                                                                <button onClick={() => pickWuS3(item.id, '正')}
                                                                    className={`px-2.5 py-1 text-[11px] rounded-[4px] font-bold border transition-colors shrink-0 ${pick === '正' ? 'bg-[var(--success)] text-white border-[var(--success)]' : 'bg-white border-[var(--border)] hover:border-[var(--success)]'}`}
                                                                >正例</button>
                                                                <button onClick={() => pickWuS3(item.id, '反')}
                                                                    className={`px-2.5 py-1 text-[11px] rounded-[4px] font-bold border transition-colors shrink-0 ${pick === '反' ? 'bg-[var(--danger)] text-white border-[var(--danger)]' : 'bg-white border-[var(--border)] hover:border-[var(--danger)]'}`}
                                                                >反例</button>
                                                                {pick && (pick === item.answer
                                                                    ? <span className="text-[var(--success)] text-[13px] shrink-0">✅</span>
                                                                    : <span className="text-[var(--danger)] text-[11px] shrink-0 whitespace-nowrap">❌ 應為{item.answer}</span>
                                                                )}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </details>

                                            {/* wu ④ */}
                                            <details className="bg-[var(--paper-warm)] rounded-[6px] border border-[var(--border)]">
                                                <summary className="px-3 py-2 text-[12.5px] font-bold cursor-pointer hover:bg-[var(--accent-light)] select-none">
                                                    <span className="text-[var(--accent)] mr-2">④</span>三件事檢核
                                                </summary>
                                                <div className="px-4 py-3 text-[12.5px] text-[var(--ink-mid)] leading-relaxed border-t border-[var(--border)] space-y-1.5">
                                                    {data.s4Checks.map((check, i) => (
                                                        <p key={i}>✅ <strong className="text-[var(--ink)]">{['可蒐集', '邊界清楚', '前後一致'][i]}</strong>：{check}</p>
                                                    ))}
                                                </div>
                                            </details>
                                        </div>
                                    );
                                })()}
                            </div>
                        </div>
                    </div>
                </div>
            ),
        },

        /* ─── Step 3：5 法策略（對照查詢） ─── */
        {
            title: '找你的方法模板',
            icon: '🗂️',
            content: (
                <div className="space-y-5 prose-zh">
                    <p className="text-[13.5px] text-[var(--ink-mid)] leading-relaxed">
                        Step 2 的示範用的是觀察法——你 W4 選的方法不同，寫法就不同。<strong className="text-[var(--ink)]">選你的方法，看核心動作和範例，然後直接進 Step 4 動筆。</strong>
                    </p>

                    {/* 方法選擇 tabs */}
                    <div className="flex flex-wrap gap-2">
                        {METHOD_STRATEGIES.map(m => {
                            const isActive = activeMethodId === m.id;
                            const isMine = methodId === m.id;
                            return (
                                <button
                                    key={m.id}
                                    onClick={() => setActiveMethodId(m.id)}
                                    className={[
                                        'px-3 py-2 rounded-[6px] border-2 text-[13px] font-bold transition-all flex items-center gap-1.5',
                                        isActive
                                            ? 'border-[var(--ink)] bg-white shadow-sm'
                                            : 'border-[var(--border)] bg-white hover:border-[var(--accent)]',
                                    ].join(' ')}
                                    style={isActive ? { color: m.color } : { color: 'var(--ink-mid)' }}
                                >
                                    <span className="text-[15px]">{m.icon}</span>
                                    <span>{m.name}</span>
                                    {isMine && <span className="ml-1 text-[10px] font-mono text-[var(--accent)]">你的</span>}
                                </button>
                            );
                        })}
                    </div>

                    {/* 方法卡 */}
                    {!activeStrategy && (
                        <div className="bg-[#FEF3C7] border-l-4 border-[#D97706] p-4 rounded-r-[8px] text-[13px] text-[#92400E] leading-relaxed">
                            <p className="font-bold mb-1">⚠️ 還沒偵測到你的 W4 主方法</p>
                            <p>請先完成 W4 並選定研究方法，這裡的操作型定義範例就會自動切換成你那一法。<br />或直接點上方按鈕，選一個方法來看看寫法長怎樣。</p>
                        </div>
                    )}
                    {activeStrategy && (() => {
                        const terms = activeStrategy.terms || [];

                        return (
                            <div className="rounded-[var(--radius-unified)] overflow-hidden border-2" style={{ borderColor: activeStrategy.color }}>
                                <div className="px-5 py-3 flex items-center gap-3" style={{ background: activeStrategy.bg }}>
                                    <span className="text-[22px]">{activeStrategy.icon}</span>
                                    <span className="font-bold text-[15px]" style={{ color: activeStrategy.color }}>{activeStrategy.name}的操作型定義</span>
                                </div>
                                <div className="bg-white p-5 space-y-5">
                                    {/* 公式 */}
                                    <p className="text-[13px] font-bold text-[var(--ink)]">
                                        公式：{activeStrategy.formula}
                                    </p>

                                    {/* 心路歷程敘事 */}
                                    {activeStrategy.story && (
                                        <div className="space-y-3">
                                            <p className="text-[10px] font-mono font-bold uppercase tracking-wider opacity-60" style={{ color: activeStrategy.color }}>老師怎麼想出來的</p>
                                            {activeStrategy.story.map((block, i) => (
                                                <div key={i}>
                                                    <p className="text-[13px] text-[var(--ink-mid)] leading-[1.8]">{block.p}</p>
                                                    {block.note && (
                                                        <div className="mt-1.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[5px] text-[11.5px] font-bold" style={{ background: activeStrategy.bg, color: activeStrategy.color }}>
                                                            <span>→</span><span>{block.note}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* 操作型定義成品 */}
                                    {activeStrategy.definition && (
                                        <div className="rounded-[8px] border-l-4 pl-4 py-3 pr-3" style={{ borderColor: activeStrategy.color, background: activeStrategy.bg }}>
                                            <p className="text-[10px] font-mono font-bold uppercase tracking-wider mb-1.5 opacity-70" style={{ color: activeStrategy.color }}>操作型定義成品</p>
                                            <p className="text-[13px] text-[var(--ink)] leading-[1.8]">{activeStrategy.definition}</p>
                                        </div>
                                    )}

                                    {/* 這個方法要懂的詞 */}
                                    {terms.length > 0 && (
                                        <details className="rounded-[6px] border border-[var(--border)]">
                                            <summary className="px-3 py-2 text-[11.5px] font-bold cursor-pointer hover:bg-[var(--paper-warm)] select-none" style={{ color: activeStrategy.color }}>
                                                ＋ 這個方法要懂的詞
                                            </summary>
                                            <div className="border-t border-[var(--border)] p-3 space-y-2">
                                                {terms.map(({ term, def }) => (
                                                    <div key={term} className="bg-[var(--paper-warm)] rounded-[6px] px-3 py-2.5">
                                                        <p className="text-[12px] font-bold text-[var(--ink)] mb-0.5">{term}</p>
                                                        <p className="text-[11.5px] text-[var(--ink-mid)] leading-[1.65]">{def}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </details>
                                    )}

                                </div>
                            </div>
                        );
                    })()}

                    {/* 自然科學分流 */}
                    {(activeMethodId === 'observation' || activeMethodId === 'experiment') && (
                        <div className="bg-[#ecfdf5] border-l-4 border-[var(--success)] p-3 rounded-r-[6px]">
                            <p className="text-[12px] font-bold text-[#065f46] mb-1">🌱 自然科學組（理化／生物／地科）</p>
                            <p className="text-[12px] text-[#065f46] leading-relaxed">
                                研究對象不是人——例如「植物澆水量對生長的影響」——常用 <strong>👀 觀察 + 🧪 實驗</strong>。觀察要寫「測什麼指標、用什麼工具、隔多久測一次」；實驗的三類變項都要操作化。
                            </p>
                        </div>
                    )}
                </div>
            ),
        },

        /* ─── Step 4：個人實作 ─── */
        {
            title: '為自己題目寫操作型定義',
            icon: '✍️',
            content: (
                <div className="space-y-6 prose-zh">
                    <StepBriefing
                        lines={[
                            { label: '做', text: '拿 W4 主方法 + 題目，寫核心概念、操作型定義、正反例三格' },
                        ]}
                    />

                    {/* 現場檢核點 — Codex 建議：動筆前第一個可執行動作 */}
                    <div className="bg-[var(--danger-light)] border-2 border-[var(--danger)]/40 rounded-[var(--radius-unified)] p-4">
                        <div className="flex items-center gap-2 mb-1.5">
                            <ContentTypeChip type="注意" />
                            <p className="text-[13px] font-bold text-[#7F1D1D]">✋ 動筆前，先做這一件事</p>
                        </div>
                        <p className="text-[12.5px] text-[var(--ink-mid)] leading-[1.75]">
                            拿出你 W4 的題目，把裡面<strong className="text-[var(--ink)]">「最抽象、不能直接看到、需要再定義一次才能測」</strong>的詞<strong className="text-[var(--ink)]">圈出來</strong>。圈完，那個（或那兩個）詞就是下面三格要操作化的核心概念——圈好再往下寫。
                        </p>
                    </div>

                    {/* 帶入卡再次出現 */}
                    {(w4Topic || w4MainMethod) && (
                        <div className="bg-[var(--paper-warm)] border border-[var(--border)] rounded-[var(--radius-unified)] p-3 text-[12.5px] space-y-1">
                            {w4Topic && <p><span className="text-[11px] font-mono text-[var(--ink-light)] mr-2">題目</span><span className="text-[var(--ink)]">{w4Topic}</span></p>}
                            {w4MainMethod && (
                                <p><span className="text-[11px] font-mono text-[var(--ink-light)] mr-2">方法</span>
                                    {methodInfo ? (
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[4px] text-[11.5px] font-bold" style={{ background: 'white', color: methodInfo.color, border: `1px solid ${methodInfo.color}` }}>
                                            <span>{methodInfo.icon}</span>
                                            <span>{methodInfo.name}</span>
                                        </span>
                                    ) : <span>{w4MainMethod}</span>}
                                </p>
                            )}
                        </div>
                    )}


                    <div className="flex items-center gap-2 mb-1">
                        <ContentTypeChip type="做" />
                        <p className="text-[12px] font-bold text-[var(--ink-mid)]">主線記錄：核心概念 + 操作型定義 + 正反例</p>
                    </div>
                    <ThinkRecord
                        dataKey="w5-core-concept"
                        prompt="① 你題目最關鍵的核心概念是什麼？"
                        placeholder="例：『學習動機』『考前焦慮』『社群媒體使用強度』『閱讀理解能力』。題目裡那個最抽象的詞。"
                        scaffold={['我題目的核心概念是 ___', '（如有第二個）___']}
                        rows={3}
                    />

                    <ThinkRecord
                        dataKey="w5-operationalize"
                        prompt={`② 用你的方法（${methodInfo ? methodInfo.icon + ' ' + methodInfo.name : '___ 法'}），這個概念怎麼測／怎麼問／怎麼觀察？`}
                        placeholder={
                            methodId === 'survey' ? '例：用現成心理壓力問卷（10 題，每題 1-5 分），加總得分作為「壓力」分數。（這份問卷學術上叫 PSS-10）'
                                : methodId === 'interview' ? '例：訪綱問「最近一次主動學習的具體事件」，編碼類別為「自發性 ＋ 時間／地點／引發者三要素」。'
                                : methodId === 'experiment' ? '例：自變項＝音樂組／安靜組；依變項＝記憶測驗得分；控制變項＝光線、時段、作息。'
                                : methodId === 'observation' ? '例：行為類別＝視線離開課本連續 ≥ 5 秒；正例：滑手機、發呆；反例：換姿勢、揉眼睛。'
                                : methodId === 'literature' ? '例：分析單位＝每篇社論一段；編碼類別＝民主、權威、自由。（兩人各自分完再對答案，一致八成以上才算定義清楚）'
                                : '對應你選的方法，把核心概念變成可實際蒐集的指標。'
                        }
                        scaffold={['核心概念：___', `操作型定義：___`, '蒐集方式（具體到誰用什麼工具量／怎麼問／怎麼編碼）：___']}
                        rows={5}
                    />

                    <ThinkRecord
                        dataKey="w5-pos-neg"
                        prompt="③ 正反例：什麼算？什麼不算？至少各一個例子。"
                        placeholder={
                            methodId === 'observation' ? '例：「分心」正例：滑手機、發呆望窗外；反例：換姿勢、揉眼睛、喝水（< 5 秒）。'
                                : methodId === 'interview' ? '例：「主動學習」正例：自己提議要去圖書館找延伸資料；反例：父母叫去補習。'
                                : '例：（你的核心概念）正例：___；反例：___。'
                        }
                        scaffold={['正例（算）：___', '反例（不算）：___', '為什麼這樣分：___']}
                        rows={4}
                    />

                    {/* 同儕挑戰 + 自學自查 */}
                    <div className="rounded-[var(--radius-unified)] overflow-hidden border border-[var(--gold)]">
                        <div className="px-4 py-3 bg-[var(--gold-light)] border-b border-[var(--gold)] text-[13px] text-[var(--ink)] leading-relaxed">
                            🎯 <strong>課堂</strong>：寫完三格後，跟旁邊的人交換唸一遍——讓對方問你：「你的核心概念有沒有可測量的操作型定義？正例反例分得開嗎？」分不開就回頭修。
                        </div>
                        <div className="px-4 py-3 bg-white">
                            <p className="text-[11.5px] font-bold text-[var(--ink-mid)] mb-2">🏠 自學時：自己對這三題</p>
                            <div className="space-y-2">
                                {THREE_RULES.map((r, i) => (
                                    <button key={i} onClick={() => toggleCheck(i)}
                                        className={`w-full flex items-start gap-2.5 px-3 py-2 rounded-[6px] border-2 text-left transition-colors ${threeChecked[i] ? 'border-[var(--success)] bg-[var(--success-light)]' : 'border-[var(--border)] bg-white hover:border-[var(--accent)]'}`}
                                    >
                                        <span className={`w-4 h-4 rounded flex-shrink-0 mt-0.5 flex items-center justify-center border-2 transition-colors ${threeChecked[i] ? 'bg-[var(--success)] border-[var(--success)] text-white' : 'border-[var(--border)]'}`}>
                                            {threeChecked[i] && <span className="text-[10px] leading-none">✓</span>}
                                        </span>
                                        <span className="text-[12px] leading-relaxed">
                                            <strong className="text-[var(--ink)]">{r.rule}</strong>
                                            <span className="text-[var(--ink-light)] ml-1">{r.question}</span>
                                        </span>
                                    </button>
                                ))}
                            </div>
                            <p className={`text-[11px] mt-2 font-bold transition-colors ${threeChecked.every(Boolean) ? 'text-[var(--success)]' : 'text-[var(--ink-light)]'}`}>
                                {threeChecked.every(Boolean) ? '✅ 三項都勾了——可以進 Step 5 做 AI 把關！' : '三項都能勾才算寫完，有一項答不出來就回頭修。'}
                            </p>
                        </div>
                    </div>

                    {/* 反思：AI 介入前、掙扎現場填 */}
                    <div className="flex items-center gap-2 mb-1 mt-2">
                        <ContentTypeChip type="做" />
                        <p className="text-[12px] font-bold text-[var(--ink-mid)]">反思（填完再進 AI 把關）</p>
                    </div>
                    <ThinkRecord
                        dataKey="w5-reflect"
                        prompt="✍️ 把抽象概念變可測，最難的一步是什麼？你怎麼克服？"
                        placeholder="例：最難是『學習動機』太抽象，我想了三個版本（每週主動學習時數／主動找老師問問題的次數／自評 1-10 分）才覺得第三個太主觀、選了第二個。克服的方式是先列三個 candidate，再用『誰來測都會一樣嗎』濾掉主觀的。"
                        scaffold={['最難的是 ___', '我試了 ___ 種寫法', '最後選 ___，因為…']}
                        rows={4}
                    />

                    {/* 下游告知 */}
                    <p className="text-[11.5px] text-[var(--ink-light)] italic leading-relaxed">
                        💡 這格寫的會在 <strong>W9 研究計畫書</strong>用到（計畫書裡寫操作型定義、寫變項設計的章節都要直接套用）；<strong>W10 寫工具</strong>時每題／每觀察項都要對應。<strong className="text-[var(--ink)]">寫一次、用三次。</strong>
                    </p>
                </div>
            ),
        },

        /* ─── Step 5：AI 把關 ─── */
        {
            title: 'AI 把關',
            icon: '🤖',
            content: (
                <div className="space-y-6 prose-zh">
                    <StepBriefing
                        lines={[
                            { label: '做', text: '把你剛寫的操作型定義丟給 AI，讓它用三個標準幫你檢查一遍' },
                            { label: '注意', text: 'AI 提建議，但要不要改、怎麼改——你決定' },
                        ]}
                    />

                    {/* Prompt 複製卡 */}
                    <div className="bg-white border border-[var(--border)] rounded-[var(--radius-unified)] overflow-hidden">
                        <div className="px-5 py-3 bg-[var(--paper-warm)] border-b border-[var(--border)] flex items-center justify-between gap-2">
                            <span className="font-bold text-[13px] text-[var(--ink)]">🤖 把下面的 prompt 貼進 Claude、ChatGPT 或 Gemini</span>
                            <button
                                onClick={() => {
                                    const rec = readRecords();
                                    const topic = rec['w4-my-topic'] || '（你的研究題目）';
                                    const concept = rec['w5-core-concept'] || '（Step 4 的核心概念）';
                                    const method = rec['w4-main-method'] || '（你的研究方法）';
                                    const opDef = rec['w5-operationalize'] || '（Step 4 的操作型定義）';
                                    const posNeg = rec['w5-pos-neg'] || '（Step 4 的正反例）';
                                    const prompt = `我正在做高中研究方法課的社會科學研究，請你依照「三件事（可蒐集、邊界清楚、前後一致）」評估我的操作型定義，並給具體改進建議。

【研究題目】
${topic}

【核心概念】
${concept}

【主要研究方法】
${method}

【操作型定義】
${opDef}

【正反例】
${posNeg}

請用三個標準評估，並指出哪一條最需要修改、給一句具體改法：
① 可蒐集：這個概念能變成你實際收得到的資料嗎？
② 邊界清楚：說得清楚什麼算、什麼不算嗎？有沒有沒處理到的灰色地帶？
③ 前後一致：整個研究有沒有中途換過定義？`;
                                    navigator.clipboard.writeText(prompt).catch(() => {});
                                }}
                                className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-[5px] border border-[var(--border)] hover:bg-[var(--accent-light)] transition-colors text-[var(--accent)] shrink-0"
                            >
                                複製提示詞
                            </button>
                        </div>
                        {/* 4步驟說明列 */}
                        <div className="px-4 py-3 bg-[#FEFCE8] border-b border-[#FDE68A] grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5">
                            {[
                                { n: '①', t: '橘色文字', d: '你前面填過的，已自動帶入' },
                                { n: '②', t: '灰色斜體', d: '還沒填的，請先回 Step 4 補上' },
                                { n: '③', t: '確認都有內容', d: '按右上角「複製提示詞」複製整段' },
                                { n: '④', t: '貼到 AI', d: '貼到 ChatGPT / Claude / Gemini，等回覆後記在下面' },
                            ].map(s => (
                                <div key={s.n} className="flex items-start gap-2">
                                    <span className="text-[11px] font-mono font-bold text-[#92400E] shrink-0">{s.n}</span>
                                    <span className="text-[11.5px] text-[#78350F] leading-[1.6]">
                                        <strong>{s.t}</strong> = {s.d}
                                    </span>
                                </div>
                            ))}
                        </div>
                        {/* Prompt 內容（橘底高亮） */}
                        <div className="p-4 bg-[var(--paper-warm)] text-[12px] text-[var(--ink-mid)] leading-[1.9] font-mono space-y-1.5">
                            {(() => {
                                const hl = (val, placeholder) => val
                                    ? <span className="bg-amber-100 text-amber-900 rounded px-0.5" style={{ whiteSpace: 'pre-wrap' }}>{val}</span>
                                    : <span className="italic text-[var(--ink-light)] opacity-60">{placeholder}</span>;
                                return (
                                    <>
                                        <p>我正在做高中研究方法課的社會科學研究，請你依照「三件事（可蒐集、邊界清楚、前後一致）」評估我的操作型定義，並給具體改進建議。</p>
                                        <p className="mt-2"><span className="font-bold text-[var(--ink)]">【研究題目】</span><br />{hl(promptData.topic, '（請先在 W4 填寫你的研究題目）')}</p>
                                        <p><span className="font-bold text-[var(--ink)]">【核心概念】</span><br />{hl(promptData.concept, '（請先在 Step 4 ① 填寫核心概念）')}</p>
                                        <p><span className="font-bold text-[var(--ink)]">【主要研究方法】</span><br />{hl(promptData.method, '（請先在 W4 填寫主要方法）')}</p>
                                        <p><span className="font-bold text-[var(--ink)]">【操作型定義】</span><br />{hl(promptData.opDef, '（請先在 Step 4 ② 填寫操作型定義）')}</p>
                                        <p><span className="font-bold text-[var(--ink)]">【正反例】</span><br />{hl(promptData.posNeg, '（請先在 Step 4 ③ 填寫正反例）')}</p>
                                        <p className="mt-2 opacity-70">請用三個標準評估，並指出哪一條最需要修改、給一句具體改法：</p>
                                        <p className="opacity-70">① 可蒐集：這個概念能變成你實際收得到的資料嗎？</p>
                                        <p className="opacity-70">② 邊界清楚：說得清楚什麼算、什麼不算嗎？有沒有沒處理到的灰色地帶？</p>
                                        <p className="opacity-70">③ 前後一致：整個研究有沒有中途換過定義？</p>
                                    </>
                                );
                            })()}
                        </div>
                        <div className="px-4 py-2 border-t border-[var(--border)] bg-amber-50 text-[11.5px] text-amber-700">
                            ⚠️ 按「複製」前請先完成 Step 4——題目、定義、正反例都會自動帶入 prompt。
                        </div>
                    </div>

                    {/* AI 回饋紀錄 — AIRED */}
                    <div className="flex items-center gap-2 mb-1">
                        <ContentTypeChip type="練" />
                        <p className="text-[12px] font-bold text-[var(--ink-mid)]">AI 說了什麼？你決定怎麼改？</p>
                    </div>
                    <AIREDNarrative week="5" hint="把這次貼 prompt、讀 AI 評估、決定要不要改的過程記下來：AI 說了什麼（R）、你覺得合不合理（E）、你最後決定改還是不改（D）。" />
                </div>
            ),
        },

        /* ─── Step 6：回顧與繳交 ─── */
        {
            title: '回顧與繳交',
            icon: '📋',
            content: (
                <div className="space-y-8 prose-zh">
                    <StepBriefing
                        lines={[
                            { label: '做', text: '寫反思，整理 W5 學習紀錄' },
                        ]}
                    />

                    {/* 檢核清單 */}
                    <div className="bg-white border border-[var(--border)] rounded-[var(--radius-unified)] overflow-hidden">
                        <div className="p-4 px-5 bg-[var(--paper-warm)] border-b border-[var(--border)] font-bold text-[13px]">
                            ✅ 本週結束，你應該要會
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-[1px] bg-[var(--border)]">
                            {[
                                '說出操作型定義是什麼，以及為什麼選了方法還要再做這件事',
                                '用你的方法（W4 選的）寫出題目最關鍵概念的操作型定義',
                                '正例 / 反例分得開（同儕挑戰過）',
                                '用三件事檢核：可蒐集、邊界清楚、前後一致',
                            ].map((item, i) => (
                                <div key={i} className="p-4 px-6 bg-white flex items-start gap-3">
                                    <CheckCircle2 size={16} className="text-[var(--success)] mt-0.5 flex-shrink-0" />
                                    <span className="text-[13px] text-[var(--ink-mid)]">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 最後一步：複製繳交 */}
                    <div className="flex items-center gap-2 mb-1">
                        <ContentTypeChip type="交出" />
                        <p className="text-[12px] font-bold text-[var(--ink-mid)]">繳交</p>
                    </div>
                    <div className="rounded-[var(--radius-unified)] border-2 border-[var(--accent)] bg-[var(--accent-light)] p-4 px-5">
                        <div className="text-[10px] font-mono uppercase tracking-[0.15em] text-[var(--accent)] font-bold mb-1">📤 最後一步</div>
                        <p className="text-[14px] text-[var(--ink)] font-bold leading-[1.7]">
                            複製 W5 學習紀錄，貼到 Google Classroom 繳交。
                        </p>
                    </div>

                    <ExportButton
                        weekLabel="W5 操作型定義"
                        buttonText="複製 W5 學習紀錄"
                        fields={EXPORT_FIELDS}
                    />

                    {/* 下週預告 */}
                    <div className="next-week-preview">
                        <div className="next-week-header">
                            <span className="next-week-badge">NEXT WEEK</span>
                            <h3 className="next-week-title">W6 預告</h3>
                        </div>
                        <div className="next-week-content">
                            <div className="next-week-col">
                                <div className="next-week-label">W6 主題</div>
                                <p className="next-week-text">海報博覽會 + 組隊（含 Solo）——把你 W3 題目 + W4 方法 + W5 操作型定義做成一張海報，走讀觀摩後找題目方向接近的夥伴組隊，或自己一個人做（Solo）。</p>
                            </div>
                            <div className="next-week-col">
                                <div className="next-week-label">你要帶來</div>
                                <p className="next-week-text">這週寫好的<strong className="text-white">核心概念 + 操作型定義 + 正反例</strong>——這是海報上的硬內容，沒寫好下週就講不清楚。</p>
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
                    <span className="hidden md:inline">研究方法與專題 / 研究規劃 / </span><span className="text-[var(--ink)] font-bold">操作型定義 W5</span>
                </div>
                <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
                    <span className="bg-[var(--paper-warm)] text-[var(--ink)] text-[10px] font-bold px-2 py-0.5 rounded-[2px] font-mono">100 MINS</span>
                    <ResetWeekButton weekPrefix="w5-" />
                    <button
                        onClick={() => setShowLessonMap(!showLessonMap)}
                        className="text-[11px] text-[var(--ink-light)] hover:text-[var(--accent)] transition-colors flex items-center gap-1 font-mono"
                    >
                        <Map size={12} /> <span className="hidden md:inline">{showLessonMap ? '收起流程' : '教師流程'}</span>
                    </button>
                </div>
            </div>

            {showLessonMap && W5Data && (
                <div className="animate-in slide-in-from-top-4 duration-300">
                    <LessonMap data={W5Data} />
                </div>
            )}

            {/* PAGE HEADER — Hero Block */}
            <HeroBlock
                kicker="R.I.B. 調查檔案 · 研究方法與專題 · W5"
                todo={[
                  { label: '今天做什麼', value: '把 W4 題目的核心概念，寫成「誰來測都一樣」的操作型定義。' },
                  { label: '為什麼做', value: 'W4 方法選好了，但概念還沒變成可測量的東西——不操作化，下週海報根本講不清楚。' },
                  { label: '今天交什麼', value: '核心概念 + 操作型定義 + 正反例（三格）。' },
                ]}
                question="我說的這個詞，怎麼讓人看見？"
                title="操作型定義："
                accentTitle="把好奇變可測"
                subtitle="「壓力」要怎麼問？「動機」要怎麼量？——抽象詞沒辦法直接進問卷。這週把它翻譯成具體選項、行為或計次，下週才能真的動筆。"
                chain="W3 你決定了題目、W4 你選了方法——但題目裡那個最抽象的詞（壓力／動機／效果）還沒交代『怎麼測』。這週把它講清楚、定下來。"
                meta={[
                    { label: '第一節', value: '帶入 + 操作型定義概念 + 5 法策略（正例 / 反例 / 同義詞 / 測量 / 情境）' },
                    { label: '第二節', value: '為自己題目寫操作型定義 + 同儕交叉對照 + 反思' },
                    { label: '課堂產出', value: '核心概念 + 操作型定義 + 正反例（三格）' },
                    { label: '前置要求', value: 'W4 定案題目（含主要方法）' },
                ]}
            />
            <CourseArc items={[
                { wk: 'W1-W2', name: '探索階段\nRED 公約', status: 'past' },
                { wk: 'W3', name: '題目決定\n8 病症會診', status: 'past' },
                { wk: 'W4', name: '方法地圖\n兩層判斷', status: 'past' },
                { wk: 'W5', name: '操作型定義\n概念變可測', status: 'now' },
                { wk: 'W6', name: '博覽會\n組隊（含 Solo）' },
                { wk: 'W7-W8', name: '文獻偵探\n引用寫作' },
                { wk: 'W9-W11', name: '工具設計\n倫理審查' },
                { wk: 'W13-W17', name: '數據解讀\n發表' }
            ]} />

            <TaskCard
                weekNumber="W5"
                weekTitle={W5Data.title}
                duration={`${W5Data.duration} 分鐘 · ${W5Data.durationDesc}`}
                tasks={[
                    '操作型定義入門 — 把抽象詞變成「看得到／量得到」',
                    '5 法策略 — 對齊 W4 主方法的操作化技巧',
                    '三件事檢核 — 可蒐集／邊界清楚／前後一致',
                ]}
                exportReminder="匯出 W5 操作型定義 → 下週 W6 海報博覽會直接用"
            />

            {/* STEP ENGINE */}
            <StepEngine
                steps={steps}
                prevWeek={{ label: '回 W4 方法地圖', to: '/w4' }}
                nextWeek={{ label: '前往 W6 博覽會 + 組隊', to: '/w6' }}
                flat
            />
        </div>
    );
};

export default W5MeasurePage;
