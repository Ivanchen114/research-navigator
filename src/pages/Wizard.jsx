import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import CourseArc from '../components/ui/CourseArc';
import ThinkRecord, { readRecords, STORAGE_KEY } from '../components/ui/ThinkRecord';
import AIREDNarrative from '../components/ui/AIREDNarrative';
import ThinkChoice from '../components/ui/ThinkChoice';
import StepEngine from '../components/ui/StepEngine';
import HeroBlock from '../components/ui/HeroBlock';
import TaskCard from '../components/ui/TaskCard';
import ResetWeekButton from '../components/ui/ResetWeekButton';
import CopyButton from '../components/ui/CopyButton';
import StepBriefing from '../components/ui/StepBriefing';
import AIAssistToggle from '../components/ui/AIAssistToggle';
import BackfillField from '../components/ui/BackfillField';
import {
    Map,
    ArrowRight,
    ShieldAlert,
    CheckCircle2,
} from 'lucide-react';
import LessonMap from '../components/ui/LessonMap';
import { W3Data } from '../data/lessonMaps';
import { ModeProvider, useMode } from '../context/ModeContext';
import { useProjector } from '../context/ProjectorContext';
import ModeSwitch from '../components/ui/ModeSwitch';
import DepthBlock from '../components/ui/DepthBlock';
import ContentTypeChip from '../components/ui/ContentTypeChip';
import RecordDrawer from '../components/ui/RecordDrawer';
import ExportButton from '../components/ui/ExportButton';
import './Wizard.css';

/* ── 資料常數 ── */

/* 四類題目問題（取代舊版八病症） */
const FOUR_CATS = [
    {
        c: '大', e: '🔭',
        d: '題目包太多，四週內做不完',
        s: '大→小：縮到本校／年級／某班／某情境',
        check: '看到「全球、全台、所有高中生、整個制度、所有原因與解法」時，要懷疑它太大。',
    },
    {
        c: '空', e: '🌫️',
        d: '關鍵詞太抽象，不知道怎麼量',
        s: '空→實：換成看得到、問得到、數得出來的指標',
        check: '看到「幸福、真諦、美、意義、價值、好不好」時，要追問：我要用什麼指標表示它？',
    },
    {
        c: '遠', e: '🚀',
        d: '人、資料或事件不在眼前，找不到也接觸不到',
        s: '遠→近：換成現在找得到的人、資料或文本',
        check: '看到「已過世人物、未來事件、名人訪談、拿不到的資料」時，要先檢查可及性。',
    },
    {
        c: '難', e: '🔒',
        d: '找得到、也量得到，但目前方法證明不了',
        s: '難→易：降低因果宣稱，改成短期、局部、相關或可觀察指標',
        check: '看到「影響成績、造成焦慮、讓人變笨、天生聰明」時，要懷疑變因太多、因果太硬。',
    },
];

const MANTRA_ROWS = [
    { f: '大', t: '小', d: '範圍縮小' },
    { f: '空', t: '實', d: '抽象具體化' },
    { f: '遠', t: '近', d: '對象可及化' },
    { f: '難', t: '易', d: '方法可行化' },
];


/* 4 把刀的下刀心路歷程（看示範怎麼想、再做自己題目） */
const CUT_MENTAL_FLOWS = [
    {
        id: 'small',
        name: '範圍縮小',
        arrow: '大 → 小',
        icon: '🔍',
        sampleTopic: '探討追星文化',
        monologue: [
            '咦……「追星文化」太大了，到底是說什麼？',
            '是「追誰」？K-POP？J-POP？台灣藝人？歐美？　🤔 要挑一類',
            '是「誰在追」？所有人？高中生？我們學校？哪一年級？　🤔 要縮對象',
            '是「哪個面向」？消費（買周邊）？應援（集資、演唱會）？情感投入？資訊追蹤？　🤔 要鎖一個',
            '是「什麼時候」？常態？新專輯發行期？　🤔 看你關心哪段',
        ],
        revised: '本校高一學生對 K-POP 偶像的「應援行為」（買周邊／集資／演唱會）',
        bottomLine: '縮的不是研究的價值，是「我有辦法做到的範圍」。三層篩到「四週收得到資料」就停。',
    },
    {
        id: 'concrete',
        name: '抽象具體化',
        arrow: '空 → 實',
        icon: '💡',
        sampleTopic: '探討高中生的快樂感',
        monologue: [
            '等等……「快樂感」是什麼？我看不見、摸不到，怎麼測？',
            '我能不能換個說法——「什麼東西出現了」代表他「快樂」？　🤔',
            '是「笑得多」？「主動找朋友聊天」？「願意去活動」？　🤔 這些可以看到',
            '還是用「問卷」測？有沒有現成的「滿意度量表」「幸福感量表」？　🤔 站在巨人肩上比較穩',
            '還是用「數字」？「每週開心時刻次數」？「自陳分數 1-5 分」？　🤔 可以量化',
            '最後問自己：換誰來測都會得到一樣的結果嗎？',
        ],
        revised: '本校高一追星族「每週投入時間」（看影片／買周邊／應援次數）＋「主觀幸福感量表分數」',
        bottomLine: '抽象詞像影子——你抓不到影子，要先找到影子代表的「看得到的東西」。',
    },
    {
        id: 'near',
        name: '對象可及化',
        arrow: '遠 → 近',
        icon: '🚪',
        sampleTopic: '2030 年最熱門的職業',
        monologue: [
            '等等……2030 年還沒到，我怎麼研究還沒發生的事？',
            '我能找誰預測？產業專家？　🤔 太遠了，找不到',
            '我能查哪些「現在正在成長」的職業推測未來？　🤔 可以但是二手資料',
            '那我「真的能做的」是什麼？',
            '「現在的學生」對 2030 年的「想像」？　🤔 拉回現在的人',
            '「現在學長姐」怎麼看自己職涯？　🤔 找得到的人',
            '最後問自己：4 週內聯絡得到、訪到、收得到回應嗎？',
        ],
        revised: '本校高一學生「目前最嚮往的職涯方向」＋為什麼（拉回現在 + 找得到的人）',
        bottomLine: '高一只有 4-6 週執行——再有意義的題目，找不到人 = 做不出來。',
    },
    {
        id: 'easy',
        name: '方法可行化',
        arrow: '難 → 易',
        icon: '🔪',
        sampleTopic: '探討高中生課堂的專注度',
        monologue: [
            '等等……我要問學生「你專心嗎」？',
            '對方會誠實講嗎？　🤔 多半會說「我有專心」（社會期許）',
            '改個方向——我能「看」到什麼？',
            '看「視線」：眼睛停留書本秒數',
            '看「行為」：滑手機、發呆、抬頭次數',
            '看「頻率」：每 5 分鐘一筆紀錄',
            '最後問自己：兩個觀察員看同一場面，記錄會一樣嗎？',
        ],
        revised: '觀察晚自習 30 分鐘內，學生「視線停留書本 ≥ 30 秒次數」＋「滑手機 ≥ 5 秒次數」',
        bottomLine: '不是所有事都該用「問」——有些事「動作比話可信」。問不出來、改觀察。',
    },
];

const PATIENTS = [
    {
        id: 'a1', n: '1',
        t: '全球暖化的成因與防治',
        ans: '大',
        explain: '這題橫跨全球、成因、防治三個大範圍，高中生四週內根本做不完。主要問題是範圍太大。',
        whyNot: '不是空：全球暖化不是抽象詞，是可查到的具體現象。不是遠：資料找得到。不是難：最大問題不是方法，而是範圍爆炸。',
        fix: '可改成：本校高一學生對日常減碳行為的認知與實踐情形。',
        fix5w1h: { who: '本校高一學生', where: '校園內', what: '日常減碳行為的認知程度（量表）與實際行為頻率（選項）', how: '問卷', when: '當學期（選填）' },
    },
    {
        id: 'a2', n: '2',
        t: '台灣教育制度的問題與改革',
        ans: '大',
        explain: '同時包含整個台灣教育制度、所有問題、所有改革方向，範圍過大，高一專題無法完成。',
        whyNot: '不是空：教育制度可以討論，不是完全抽象。不是遠：資料找得到。主要問題是範圍太廣。',
        fix: '可改成：本校高一學生對多元選修課程安排的滿意度與建議。',
        fix5w1h: { who: '本校高一學生', where: '本校', what: '對多元選修課程安排的滿意度（1–5 分）與改善建議（開放題）', how: '問卷', when: '當學期（選填）' },
    },
    {
        id: 'a3', n: '3',
        t: '探究幸福的真諦',
        ans: '空',
        explain: '「幸福」與「真諦」都太抽象，不知道要問什麼、觀察什麼、計算什麼。主要問題是沒有可測指標。',
        whyNot: '不是大：問題不在範圍，而是沒有可測指標。不是遠：人找得到。不是難：還沒到方法難，第一步是先把幸福具體化。',
        fix: '可改成：本校高一學生每週休閒時間長短與主觀幸福感自評分數之關係。',
        fix5w1h: { who: '本校高一學生', where: '個人日常生活', what: '每週休閒時間（小時）、主觀幸福感自評分數（1–10 分）', how: '問卷', when: '某一週（選填）' },
    },
    {
        id: 'a4', n: '4',
        t: '人類存在的意義是什麼？',
        ans: '空',
        explain: '「存在的意義」是哲學命題，不是可直接測量的研究指標，沒辦法問卷也沒辦法觀察。',
        whyNot: '不是大：即使縮小對象（例如「本校學生」），意義這個詞本身仍然抽象無法測量。不是遠：不是找不到人，而是概念無法操作化。',
        fix: '可改成：本校高一學生對「人生目標感」來源的看法分析。',
        fix5w1h: { who: '本校高一學生', where: '校園', what: '對人生目標感來源的看法（開放題編碼分類）', how: '問卷（開放題）', when: '當學期（選填）' },
    },
    {
        id: 'a5', n: '5',
        t: '訪談愛因斯坦對相對論的看法',
        ans: '遠',
        explain: '研究對象已過世 140 多年，無法訪談，最大的問題是對象不可及。',
        whyNot: '不是空：相對論與看法可以被分析，不是抽象詞。不是難：如果改成文本分析就能做。主要問題是訪談對象找不到。',
        fix: '可改成：分析愛因斯坦公開書信中對相對論推廣的表述方式。',
        fix5w1h: { who: '愛因斯坦公開書信（文本）', where: '公開文獻資料庫', what: '對相對論推廣的表述方式（詞彙類型、比喻頻率）', how: '文本分析', when: '1905–1955 年間書信（選填）' },
    },
    {
        id: 'a6', n: '6',
        t: '2028 年奧運誰會拿金牌？',
        ans: '遠',
        explain: '比賽尚未發生，結果不存在，研究對象（比賽結果）根本還不在。',
        whyNot: '不是空：金牌結果很具體，不抽象。不是大：問題不在範圍。主要問題是事件還沒發生。',
        fix: '可改成：分析近三屆奧運某項目金牌得主的成績變化趨勢。',
        fix5w1h: { who: '近三屆奧運金牌得主（公開資料）', where: '公開賽事資料庫', what: '金牌成績數值與屆次趨勢', how: '文獻分析', when: '2016–2024 年三屆（選填）' },
    },
    {
        id: 'a7', n: '7',
        t: '吃早餐對學測成績的影響',
        ans: '難',
        explain: '早餐和學測成績都可以測，但要證明「早餐造成成績差異」很難——讀書時間、補習、睡眠、家庭資源、原本程度都會影響，變因根本控制不了。',
        whyNot: '不是空：早餐和成績都不是抽象詞，可以量。不是遠：資料理論上找得到。它也有一點大，但主病因是因果太難證明。',
        fix: '可改成：本校高一學生段考當天是否吃早餐與第一節課精神狀態自評之關係。',
        fix5w1h: { who: '本校高一學生', where: '校園', what: '段考當天是否吃早餐（是/否）、第一節課精神狀態自評（1–5 分）', how: '問卷（段考當天填）', when: '段考當天（選填）' },
    },
    {
        id: 'a8', n: '8',
        t: '滑手機會不會讓人變笨？',
        ans: '難',
        explain: '「變笨」雖然可以操作化，但滑手機與認知表現之間的因果關係很難直接證明，變因太多，超過高一能力範圍。',
        whyNot: '有一點空，因為「變笨」需要具體化；但更核心的問題是因果太硬、變因太多，先解決難再處理空。',
        fix: '可改成：本校高一學生睡前手機使用時數與隔日上午專注力自評之關係。',
        fix5w1h: { who: '本校高一學生', where: '個人日常生活', what: '睡前手機使用時數（分鐘）、隔日上午第一節專注力自評（1–5 分）', how: '問卷（每日填寫一週）', when: '某一週（選填）' },
    },
];

const CAT_LABELS = FOUR_CATS.reduce((m, d) => { m[d.c] = { n: d.c, e: d.e, s: d.s }; return m; }, {});

const DRILL_GREEN = ['探究美的本質', '本校學生有沒有在用社群媒體？', '2030 年最熱門的工作', '全球暖化的成因與解決', '本校學生有沒有在段考前熬夜？', '本校學生有沒有在上課偷滑手機？', '為什麼我們班那麼吵？', '高中生為什麼很常遲到？', '高中福利社為什麼都很難吃？', '高中生是不是都會熬夜？'];
const DRILL_YELLOW = ['為什麼現代人越來越不快樂？', '人類存在的意義', '為什麼讀書比打電動更好？', '台灣的教育制度好不好？', '訪談賈伯斯的創新理念', '為什麼高中生上課都不專心？', '為什麼段考週壓力特別大？', '為什麼有些老師上課很無聊？', '為什麼班上同學不愛運動？', '為什麼社團活動常常辦不出成效？'];
const DRILL_RED = ['早餐對人生成就的影響', '靈魂到底存不存在？', '手機使用對學業成績的影響', '滑手機會不會讓人變笨？', '補習到底有沒有用？', '高中生談戀愛會影響成績？', 'IG / 抖音讓高中生焦慮嗎？', '為什麼有些同學天生較會讀書？', '訪談現任總統對教改看法', '為什麼有些人天生較聰明？'];

/* ── Part 5：自己題目的 AI 協作 Prompt ── */
/* 診斷 Prompt 與學生課堂學到的四類語言對齊（不要讓 AI 自創分類） */
const MY_DIAGNOSE_PROMPT = `我有一個研究題目想請你診斷。
我的題目是：【在這裡貼上你的題目初稿】

我的課堂用以下「四類題目問題」診斷：
大：題目包太多，四週內做不完。
空：關鍵詞太抽象，不知道怎麼量。
遠：人、資料或事件不在眼前，找不到也接觸不到。
難：找得到、也量得到，但目前方法證明不了，通常是因果太硬、變因太多，或超過高一專題能力。

請你只做診斷，不要幫我修改。請告訴我：
1. 我的題目最可能屬於哪類（可複選，請用 大／空／遠／難 標記）。
2. 請選出一個「主病因」，也就是最先阻止我開始研究的問題。
3. 核心問題用一句話說明。
4. 如果四類都不完全貼合，才額外補充你看到的問題（例如：預設立場、答案太明顯、研究價值不足）。

請全程優先使用 大／空／遠／難 的課堂語言，不要另外自創分類。不要給我修改版本。`;

const HINT_ITEMS = [
    { f: '大 → 小', t: '範圍太廣 → 縮到本校／年級／某班／某情境' },
    { f: '空 → 實', t: '太抽象 → 換成可測量、可觀察、可填答的指標' },
    { f: '遠 → 近', t: '找不到人或資料 → 換成現在找得到的人、文本或公開資料' },
    { f: '難 → 易', t: '因果太硬、變因太多 → 改成短期、局部、相關、自評或觀察指標' },
];

const EXPORT_FIELDS = [
    { key: 'w3-obstacle-feel', label: '碰壁體驗', question: '看完兩題碰壁情境後，你覺得「題目生病」是什麼感覺？' },
    { key: 'w3-disease-quiz', label: '四類診斷反思', question: '大／空／遠／難四類裡，你最難判斷的是哪一類？為什麼難？' },
    { key: 'w3-cut-practice-cut', label: '練手題：選用的處方', question: '對「探討高中生使用社群媒體的影響」你選哪一把刀？' },
    { key: 'w3-cut-practice', label: '練手題：你的改寫', question: '用你選的刀，下刀改寫一次' },
    { key: 'w3-drill-personal', label: '人腦練習（個人）', question: '自選一題爛題目，診斷是大／空／遠／難哪類？用心法怎麼改？' },
    { key: 'w3-drill-group', label: '小組診斷', question: '小組選了哪一題？一起怎麼改的？' },
    /* Part 4：回到自己的題目 */
    { key: 'w3-own-diagnose', label: 'Part 4 ①② 確認具體＋四類診斷', question: '題目夠具體嗎？屬於大／空／遠／難哪一類（可複選）？' },
    { key: 'w3-own-fix', label: 'Part 4 ③④ 選心法＋改法初稿', question: '選哪把刀？初步怎麼改？' },
    { key: 'w3-5w1h-who',   label: 'Part 4 5W1H｜Who',   question: '我要研究誰',             minLength: 3 },
    { key: 'w3-5w1h-where', label: 'Part 4 5W1H｜Where', question: '在哪個場域／範圍',         minLength: 3 },
    { key: 'w3-5w1h-what',  label: 'Part 4 5W1H｜What',  question: '我要測量或分析什麼',       minLength: 3 },
    { key: 'w3-5w1h-how',   label: 'Part 4 5W1H｜How',   question: '我打算用什麼方法取得資料', minLength: 3 },
    { key: 'w3-5w1h-when',  label: 'Part 4 5W1H｜When',  question: '在哪個時間或情境（選填）', minLength: 0 },
    { key: 'w3-own-revised', label: 'Part 4 修改版題目', question: '用 5W1H 切開後，你的修正版題目是？' },
    /* Part 5：AI 協作磨定案（3 步精簡版）*/
    { key: 'w3-p5-draft', label: 'Part 5 ① 自己初稿', question: '根據 Part 4，我修改後的題目初稿是？' },
    { key: 'w3-p5-diagnose-ai-record', label: 'Part 5 ② AI 診斷 + 我的比對', question: 'AI 診斷出哪類（大／空／遠／難）？跟我 Part 4 的診斷哪裡不一樣？我更認同誰？' },
    { key: 'w3-final-topic', label: 'W3 最終定案題目', question: '我選哪個方向、最終定案題目、理由——這就是你這學期的研究起點' },
    { key: 'w3-motivation', label: 'W3 研究動機（為什麼想研究這個）', question: '一句話講清楚——這個題目對誰有意義？為什麼你願意花一學期做？' },
    { key: 'w3-aired-record', label: 'AI-RED 敘事紀錄', question: '本週最重要的一次 AI 互動（A-I-R-E-D 五要素）' },
    { key: 'w3-reflect-misdiagnosis', label: '反思：最難判斷的類別', question: '大／空／遠／難四類裡，你的題目最容易跨類搞混的是哪兩個？差別在哪裡？' },
    { key: 'w3-reflect-cuts', label: '反思：你走過幾把刀', question: '你的題目走過哪幾把刀（縮小／具體化／可及化／可行化）？最後落點為什麼是這裡？' },
];

/* ── Part 5 第三輪：顯示 Part 4 Section A 的診斷作 reference，讓學生不用回頭翻 ── */
function P5CompareRef() {
    const [ownDiagnose, setOwnDiagnose] = useState('');
    const [ownFix, setOwnFix] = useState('');

    const refresh = useCallback(() => {
        const records = readRecords();
        setOwnDiagnose((records['w3-own-diagnose'] || '').trim());
        setOwnFix((records['w3-own-fix'] || '').trim());
    }, []);

    useEffect(() => {
        refresh();
        window.addEventListener('focus', refresh);
        return () => window.removeEventListener('focus', refresh);
    }, [refresh]);

    if (!ownDiagnose && !ownFix) return null;

    return (
        <div className="mb-4 p-4 bg-[var(--paper-warm)] border border-[var(--border)] rounded-[var(--radius-unified)] space-y-2">
            <div className="text-[11px] font-mono text-[var(--ink-light)] uppercase tracking-wider">📎 你 Part 4 的自診（不用再寫一次）</div>
            {ownDiagnose && (
                <div>
                    <span className="text-[10px] font-mono text-[var(--ink-light)] uppercase tracking-wider">四類診斷</span>
                    <p className="text-[13px] text-[var(--ink)] whitespace-pre-wrap leading-relaxed mt-0.5">{ownDiagnose}</p>
                </div>
            )}
            {ownFix && (
                <div>
                    <span className="text-[10px] font-mono text-[var(--ink-light)] uppercase tracking-wider">改法方向</span>
                    <p className="text-[13px] text-[var(--ink)] whitespace-pre-wrap leading-relaxed mt-0.5">{ownFix}</p>
                </div>
            )}
        </div>
    );
}

/* ── Part 5 第一輪：自動帶入 Part 4 修改版題目 ── */
function P5DraftField() {
    const [ownRevised, setOwnRevised] = useState('');
    const [draftKey, setDraftKey] = useState(0);

    const refresh = useCallback(() => {
        const records = readRecords();
        const rev = (records['w3-own-revised'] || '').trim();
        const draft = (records['w3-p5-draft'] || '').trim();
        setOwnRevised(rev);
        // 若 Part 4 有值、Part 5 初稿還空，把 Part 4 版本寫進 Part 5 初稿
        if (rev && !draft) {
            records['w3-p5-draft'] = rev;
            try { localStorage.setItem(STORAGE_KEY, JSON.stringify(records)); } catch { /* ignore */ }
            setDraftKey(k => k + 1); // 強制 ThinkRecord 重 mount 以讀取新值
        }
    }, []);

    useEffect(() => {
        refresh();
        // 視窗重新取得焦點時再跑一次（學生從 AI 工具切回網頁）
        window.addEventListener('focus', refresh);
        return () => window.removeEventListener('focus', refresh);
    }, [refresh]);

    const forceInject = () => {
        if (!ownRevised) return;
        const records = readRecords();
        records['w3-p5-draft'] = ownRevised;
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(records)); } catch { /* ignore */ }
        setDraftKey(k => k + 1);
    };

    return (
        <>
            {!ownRevised && (
                <div className="mb-4">
                    <BackfillField
                        dataKey="w3-own-revised"
                        label="⚠️ 還沒偵測到 Part 4 的修改版題目——把你前面寫的修改版題目貼這裡，下方初稿欄會自動帶入；或直接跳過、在下方欄位打字。"
                        placeholder="例：本校高一學生在段考前一週的夜間手機使用時數，與隔日上午第一節專注力自評之間的相關性。"
                        buttonLabel="補上修改版"
                    />
                </div>
            )}
            <ThinkRecord
                key={`p5-draft-${draftKey}`}
                dataKey="w3-p5-draft"
                prompt="我的題目初稿（從 Part 4 帶過來，可再精修）"
                placeholder="例：本校高一學生在段考前一週的夜間手機使用時數，與隔日上午第一節專注力自評之間的相關性。"
                rows={3}
            />
        </>
    );
}

/* ── 5W1H 個別填空元件 ── */
const FIVE_W1H_FIELDS = [
    { key: 'w3-5w1h-who',   label: 'Who',   q: '我要研究誰',               required: true  },
    { key: 'w3-5w1h-where', label: 'Where', q: '在哪個場域／範圍',           required: true  },
    { key: 'w3-5w1h-what',  label: 'What',  q: '我要測量或分析什麼',         required: true  },
    { key: 'w3-5w1h-how',   label: 'How',   q: '我打算用什麼方法取得資料',   required: true  },
    { key: 'w3-5w1h-when',  label: 'When',  q: '在哪個時間或情境',           required: false },
];

function FiveW1HForm() {
    const [vals, setVals] = useState(() => {
        const records = readRecords();
        return FIVE_W1H_FIELDS.reduce((acc, f) => {
            acc[f.key] = records[f.key] || '';
            return acc;
        }, {});
    });
    const update = (key, val) => {
        setVals(v => ({ ...v, [key]: val }));
        const records = readRecords();
        records[key] = val;
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(records)); } catch { /* ignore */ }
    };
    return (
        <div className="space-y-2.5">
            {FIVE_W1H_FIELDS.map(f => (
                <div key={f.key} className="flex items-start gap-3">
                    <div className="w-12 shrink-0 pt-2 text-right">
                        <span className="text-[11px] font-mono font-black text-[var(--accent)]">{f.label}</span>
                        {!f.required && <span className="block text-[9px] text-[var(--ink-light)]">選填</span>}
                    </div>
                    <textarea
                        value={vals[f.key]}
                        onChange={e => update(f.key, e.target.value)}
                        placeholder={f.q}
                        rows={f.key === 'w3-5w1h-what' ? 2 : 1}
                        className="flex-1 px-3 py-2 text-[13px] rounded-[var(--radius-unified)] border border-[var(--border)] bg-white focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/15 resize-none transition-all leading-relaxed"
                    />
                </div>
            ))}
        </div>
    );
}

/* ── 4 把刀心路歷程展開卡（學生先想 30 秒、再點開看示範）── */
function CutFlowCard({ flow }) {
    const [open, setOpen] = useState(false);
    return (
        <div className="bg-white border border-[var(--border)] rounded-[var(--radius-unified)] p-4 flex flex-col">
            <div className="flex items-center gap-2 mb-2.5">
                <span className="text-[22px]">{flow.icon}</span>
                <div>
                    <p className="text-[13px] font-bold text-[var(--ink)] leading-tight">{flow.name}</p>
                    <p className="text-[11px] font-mono text-[var(--gold)] mt-0.5">{flow.arrow}</p>
                </div>
            </div>
            <div className="bg-[#FEF2F2] border-l-3 border-[#DC2626] p-2.5 rounded-r-[6px] mb-2">
                <p className="text-[10px] font-mono text-[#7F1D1D] mb-0.5 uppercase tracking-wider">原題（爛版本）</p>
                <p className="text-[12.5px] font-bold text-[#7F1D1D]">{flow.sampleTopic}</p>
            </div>
            <p className="text-[11px] italic text-[var(--ink-light)] mb-2 leading-relaxed">💭 先自己想 30 秒：「這題哪裡卡？該下哪一刀？」</p>
            <button
                type="button"
                onClick={() => setOpen(!open)}
                className="w-full text-[11.5px] font-bold text-[var(--accent)] py-1.5 border border-dashed border-[var(--accent)]/50 rounded-[6px] hover:bg-[var(--accent)]/5 transition-colors mb-2"
            >
                {open ? '▲ 收起心路歷程' : '▼ 點開看下刀心路歷程'}
            </button>
            {open && (
                <div className="space-y-2.5">
                    <div className="bg-[#FEF3C7] border-l-3 border-[#D97706] p-3 rounded-r-[6px]">
                        <p className="text-[11px] font-bold text-[#92400E] mb-1.5">🧠 老練研究者腦中該這樣想</p>
                        <ul className="text-[11.5px] text-[#78350F] leading-[1.85] space-y-0.5 list-none pl-0">
                            {flow.monologue.map((line, i) => (
                                <li key={i}>{line}</li>
                            ))}
                        </ul>
                    </div>
                    <div className="bg-[#ECFDF5] border-l-3 border-[#10B981] p-3 rounded-r-[6px]">
                        <p className="text-[11px] font-bold text-[#065F46] mb-1">✓ 收斂後（示範改寫）</p>
                        <p className="text-[12px] text-[var(--ink)] font-bold leading-[1.7]">{flow.revised}</p>
                    </div>
                    <p className="text-[10.5px] italic text-[var(--ink-light)] leading-relaxed">
                        💡 <strong>{flow.bottomLine}</strong>
                    </p>
                </div>
            )}
        </div>
    );
}

/* ── 練手題：學生自己下刀 + 強制比對示範 ── */
const PRACTICE_TOPIC = '探討高中生使用社群媒體的影響';
const PRACTICE_SAMPLE = '本校高一學生「睡前 30 分鐘 IG／TikTok 使用時數」對「隔日第一節課精神狀態（自評 1-5 分）」的影響';
const PRACTICE_ANALYSIS = '主要用了「範圍縮小」（高中生→本校高一、社群媒體→IG/TikTok、任何時候→睡前 30 分鐘）+「抽象具體化」（影響→隔日精神狀態自評分數）。其實不只一刀——複雜題目通常要組合下刀。';

const CUT_OPTIONS = [
    { id: 'small', name: '範圍縮小', arrow: '大→小' },
    { id: 'concrete', name: '抽象具體化', arrow: '空→實' },
    { id: 'near', name: '對象可及化', arrow: '遠→近' },
    { id: 'easy', name: '方法可行化', arrow: '難→易' },
];

function CutPractice() {
    const [selectedCut, setSelectedCut] = useState('');
    const [showSample, setShowSample] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    // 從 localStorage 讀取已選的刀（讓重新整理也保留）
    useEffect(() => {
        const saved = readRecords();
        const cut = saved['w3-cut-practice-cut']?.trim();
        if (cut) setSelectedCut(cut);
    }, []);

    // 選刀時即時寫入 localStorage
    const handleCutChange = useCallback((cutId) => {
        setSelectedCut(cutId);
        const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
        all['w3-cut-practice-cut'] = cutId;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    }, []);

    const handleShowSample = () => {
        if (!selectedCut) {
            setErrorMsg('請先選一把主刀，再看示範。');
            return;
        }
        const records = readRecords();
        const myRewrite = records['w3-cut-practice']?.trim() || '';
        if (myRewrite.length < 15) {
            setErrorMsg(`先自己改寫一次再看示範——目前 ${myRewrite.length} 字，至少寫 15 字（先想再看，效果才好）。`);
            return;
        }
        setErrorMsg('');
        setShowSample(true);
    };

    return (
        <div className="bg-white border-2 border-[var(--accent)] rounded-[var(--radius-unified)] p-5 mt-6 max-w-[760px]">
            <h4 className="text-[15px] font-bold text-[var(--ink)] mb-1 flex items-center gap-1.5">
                <span>✏️</span> 練手題：你來下刀
            </h4>
            <p className="text-[12px] text-[var(--ink-mid)] mb-3 leading-relaxed">
                看完示範後，輪到你動手——選一把刀、改寫一次、再對照示範。<strong className="text-[var(--ink)]">寫完才能看示範</strong>（先想再看）。
            </p>

            <div className="bg-[#FEF2F2] border-l-3 border-[#DC2626] p-3 rounded-r-[6px] mb-4">
                <p className="text-[10px] font-mono text-[#7F1D1D] mb-0.5 uppercase tracking-wider">爛題目</p>
                <p className="text-[14px] font-bold text-[#7F1D1D]">{PRACTICE_TOPIC}</p>
            </div>

            <div className="mb-4">
                <p className="text-[12.5px] font-bold text-[var(--ink)] mb-2">① 選刀：你覺得這題該下哪一把刀？</p>
                <div className="grid grid-cols-2 gap-2">
                    {CUT_OPTIONS.map(c => (
                        <label
                            key={c.id}
                            className={`flex items-center gap-2 px-3 py-2 border rounded-[6px] cursor-pointer transition-colors ${
                                selectedCut === c.id
                                    ? 'border-[var(--accent)] bg-[var(--accent)]/5'
                                    : 'border-[var(--border)] hover:border-[var(--accent)]/50'
                            }`}
                        >
                            <input
                                type="radio"
                                name="cut-practice"
                                value={c.id}
                                checked={selectedCut === c.id}
                                onChange={() => handleCutChange(c.id)}
                                className="accent-[var(--accent)]"
                            />
                            <span className="text-[12.5px] text-[var(--ink)]">
                                <strong>{c.name}</strong>
                                <span className="text-[10px] font-mono text-[var(--gold)] ml-1">（{c.arrow}）</span>
                            </span>
                        </label>
                    ))}
                </div>
                <p className="text-[10.5px] italic text-[var(--ink-light)] mt-2">💡 先選一把主刀就好——複雜題目雖然常要組合多把刀，但這裡先練一把，改寫時其他刀會自然帶進來。</p>
            </div>

            <div className="mb-4">
                <p className="text-[12.5px] font-bold text-[var(--ink)] mb-2">② 改寫：用你選的刀，下刀改寫</p>
                <ThinkRecord
                    dataKey="w3-cut-practice"
                    prompt="寫一個你覺得「能研究」的版本（至少 15 字）"
                    placeholder="例：本校高一學生睡前 30 分鐘 IG 使用時數對隔日精神的影響"
                    scaffold={['本校 / 本年級 ___ 學生', '在 ___ 時段／場景', '的 ___（具體可測指標）']}
                    rows={3}
                />
            </div>

            {!showSample ? (
                <>
                    <button
                        type="button"
                        onClick={handleShowSample}
                        className="w-full bg-[var(--accent)] hover:opacity-90 text-white font-bold py-2.5 rounded-[6px] text-[13px] transition-opacity"
                    >
                        ✅ 寫完了！看示範對照
                    </button>
                    {errorMsg && (
                        <p className="text-[12px] text-[#DC2626] font-bold mt-2 leading-relaxed">⚠️ {errorMsg}</p>
                    )}
                </>
            ) : (
                <div className="space-y-3">
                    <div className="bg-[#ECFDF5] border-l-3 border-[#10B981] p-3 rounded-r-[6px]">
                        <p className="text-[10px] font-mono text-[#065F46] mb-1 uppercase tracking-wider">示範改寫</p>
                        <p className="text-[13px] font-bold text-[var(--ink)] leading-[1.7]">{PRACTICE_SAMPLE}</p>
                    </div>
                    <div className="bg-[var(--paper-warm)] border border-[var(--border)] p-3 rounded-[6px]">
                        <p className="text-[11px] font-bold text-[var(--ink-mid)] mb-1">📝 示範用了什麼刀</p>
                        <p className="text-[12px] text-[var(--ink-mid)] leading-[1.85]">{PRACTICE_ANALYSIS}</p>
                    </div>
                    <div className="bg-[#FEF3C7] border-l-3 border-[#D97706] p-3 rounded-r-[6px]">
                        <p className="text-[11px] font-bold text-[#92400E] mb-1">💭 想想：你跟示範差在哪？</p>
                        <p className="text-[11.5px] text-[#78350F] leading-[1.85]">沒對錯——你的版本可能更貼合自己關心的角度（例如關心『心理健康』vs『學業』）。但要問自己：<strong>我的版本，4 週內收得到資料嗎？</strong>收不到、就再下一刀。</p>
                    </div>
                    <button
                        type="button"
                        onClick={() => setShowSample(false)}
                        className="w-full text-[11.5px] text-[var(--accent)] py-1.5 border border-dashed border-[var(--accent)]/40 rounded-[6px] hover:bg-[var(--accent)]/5"
                    >
                        ▲ 收起示範（想再改寫一次）
                    </button>
                </div>
            )}
        </div>
    );
}

/* ── 主組件 ── */

const WizardContent = () => {
    const { mode } = useMode();
    const { projector } = useProjector();
    const [showLessonMap, setShowLessonMap] = useState(false);
    const [obstacleStates, setObstacleStates] = useState({ a: false, b: false });
    const [diagnoses, setDiagnoses] = useState({});
    const [choiceResults, setChoiceResults] = useState([]);

    // Part 2 抽題機
    const [drillLevel, setDrillLevel] = useState('green');  // green | yellow | red
    const [drillTopic, setDrillTopic] = useState(null);
    const [drillLocked, setDrillLocked] = useState(false);  // 確定選題後鎖定
    const [drillGroupTopic, setDrillGroupTopic] = useState(null);
    const [drillGroupLocked, setDrillGroupLocked] = useState(false);

    // Part 4：病症選擇 chip（大/空/遠/難），存 localStorage
    const [ownCat, setOwnCat] = useState(() => {
        try { return JSON.parse(localStorage.getItem('w3-own-cat') || 'null'); } catch { return null; }
    });
    const selectOwnCat = (cat) => {
        const next = ownCat === cat ? null : cat;
        setOwnCat(next);
        try { localStorage.setItem('w3-own-cat', JSON.stringify(next)); } catch { /* ignore */ }
    };

    // Part 4：帶入 W2 最終探究意圖
    const [w2Intent, setW2Intent] = useState('');
    useEffect(() => {
        const refresh = () => {
            const records = readRecords();
            setW2Intent((records['w2-final-intent'] || '').trim());

            // 跨 session 自動帶入：若 Part 4 已寫了修改版、Part 5 Step 1 還空，
            // 就把 Part 4 修改版複製到 Part 5 Step 1（避免學生重打一次）
            const ownRev = (records['w3-own-revised'] || '').trim();
            const draft = (records['w3-p5-draft'] || '').trim();
            if (ownRev && !draft) {
                records['w3-p5-draft'] = ownRev;
                try { localStorage.setItem(STORAGE_KEY, JSON.stringify(records)); } catch { /* ignore */ }
            }
        };
        refresh();
        window.addEventListener('focus', refresh);
        return () => window.removeEventListener('focus', refresh);
    }, []);

    const DRILL_POOLS = { green: DRILL_GREEN, yellow: DRILL_YELLOW, red: DRILL_RED };

    const rollDrill = useCallback(() => {
        if (drillLocked) return;
        const pool = DRILL_POOLS[drillLevel];
        // 避免連續抽到同一題
        let next;
        do { next = pool[Math.floor(Math.random() * pool.length)]; } while (next === drillTopic && pool.length > 1);
        setDrillTopic(next);
    }, [drillLevel, drillTopic, drillLocked]);

    const rollGroupDrill = useCallback(() => {
        if (drillGroupLocked) return;
        // 小組只能黃卡或紅卡
        const pool = [...DRILL_YELLOW, ...DRILL_RED];
        let next;
        do { next = pool[Math.floor(Math.random() * pool.length)]; } while (next === drillGroupTopic && pool.length > 1);
        setDrillGroupTopic(next);
    }, [drillGroupTopic, drillGroupLocked]);

    const trackChoice = useCallback((question, selected, correct) => {
        setChoiceResults(prev => {
            const idx = prev.findIndex(c => c.question === question);
            const entry = { question, selected, correct };
            if (idx >= 0) { const next = [...prev]; next[idx] = entry; return next; }
            return [...prev, entry];
        });
    }, []);

    const handleDiagnose = (patientId, diseaseCode) => {
        if (diagnoses[patientId]) return; // 已作答不可更改
        setDiagnoses(prev => ({ ...prev, [patientId]: diseaseCode }));
    };

    const diagnosedCount = Object.keys(diagnoses).length;
    const correctCount = PATIENTS.filter(p => diagnoses[p.id] === p.ans).length;

    /* ── 五個步驟 ── */

    const steps = [
        /* ──────────────────────────────────────
         * STEP 1: 碰壁體驗
         * ────────────────────────────────────── */
        {
            title: '碰壁體驗',
            icon: '🏥',
            content: (
                <div className="space-y-10 prose-zh">
                    {/* 碰壁體驗 */}
                    <div>
                        <div className="w3-section-head">
                            <div className="flex items-center gap-2">
                                <ContentTypeChip type="練" />
                                <h2>碰壁體驗</h2>
                            </div>
                            <div className="line"></div><div className="mono">PHASE 0</div>
                        </div>
                        <p className="w3-section-desc">在進入診斷之前，先透過兩組情境感受一下：為什麼有些題目看起來沒問題，實作起來卻會處處碰壁？</p>
                        <StepBriefing
                            lines={[
                                { label: '節奏', text: '跟老師做' },
                                { label: '做', text: '看 2 個爛題目，試著規劃研究，感受題目「生病」的卡關感' },
                                { label: '練', text: '寫下你卡在哪、為什麼卡住' },
                            ]}
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            {/* 題目 A */}
                            <div className="border border-[var(--border)] rounded-[10px] overflow-hidden bg-white">
                                <div className="p-4 bg-[var(--paper-warm)] border-b border-[var(--border)] font-bold">題目 A</div>
                                <div className="p-5">
                                    <p className="text-[14px] font-medium text-[var(--ink)] mb-4">高中生上課使用手機的頻率，與課堂專注程度之間有什麼關係？</p>
                                    <button
                                        onClick={() => setObstacleStates(prev => ({ ...prev, a: !prev.a }))}
                                        className={`w-full py-2 text-[12px] font-bold rounded flex items-center justify-center gap-2 transition-all ${obstacleStates.a ? 'bg-[var(--danger)] text-white' : 'bg-[var(--accent-light)] text-[var(--accent)]'}`}
                                    >
                                        {obstacleStates.a ? '⚠️ 現實考驗：看似完整，但指標還不清楚' : '🔍 這是好題目嗎？試試看第一步...'}
                                    </button>
                                    {obstacleStates.a && (
                                        <div className="mt-4 p-4 bg-[var(--danger-light)] rounded-[6px] text-[12px] leading-relaxed space-y-3">
                                            <div className="text-[var(--danger)]">
                                                <strong>⚠️ 卡在哪？</strong><br />
                                                這題有兩個變項，但還沒說清楚：<br />
                                                ・「使用手機」多久算一次？<br />
                                                ・「專注程度」要用自評、觀察，還是任務表現？
                                            </div>
                                            <div className="text-[var(--accent)] pt-2 border-t border-[var(--danger)]/20">
                                                <strong>🔧 可以怎麼救？</strong><br />
                                                限定對象（哪年級／哪班）、限定時間（一節課／一天／一週），並決定專注程度的測量方式。
                                            </div>
                                            <div className="text-[var(--success)] pt-2 border-t border-[var(--danger)]/20">
                                                <strong>✅ 改寫示範</strong><br />
                                                高一學生在一節課中自評使用手機的次數，與其課後自評專注程度是否有關？
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                            {/* 題目 B */}
                            <div className="border border-[var(--border)] rounded-[10px] overflow-hidden bg-white">
                                <div className="p-4 bg-[var(--paper-warm)] border-b border-[var(--border)] font-bold">題目 B</div>
                                <div className="p-5">
                                    <p className="text-[14px] font-medium text-[var(--ink)] mb-4">與我關係親近的朋友，在社群媒體上收到的推薦內容相似程度是否更高？</p>
                                    <button
                                        onClick={() => setObstacleStates(prev => ({ ...prev, b: !prev.b }))}
                                        className={`w-full py-2 text-[12px] font-bold rounded flex items-center justify-center gap-2 transition-all ${obstacleStates.b ? 'bg-[var(--danger)] text-white' : 'bg-[var(--accent-light)] text-[var(--accent)]'}`}
                                    >
                                        {obstacleStates.b ? '⚠️ 現實考驗：有趣，但資料取得與倫理很難' : '🔍 這是好題目嗎？試試看第一步...'}
                                    </button>
                                    {obstacleStates.b && (
                                        <div className="mt-4 p-4 bg-[var(--danger-light)] rounded-[6px] text-[12px] leading-relaxed space-y-3">
                                            <div className="text-[var(--danger)]">
                                                <strong>⚠️ 卡在哪？</strong><br />
                                                這題要先說清楚：<br />
                                                ・什麼叫「關係親近」？（自評／互動頻率／同班好友？）<br />
                                                ・「推薦內容相似」怎麼比？（看同平台？截幾張？怎麼分類？）<br />
                                                ・朋友是否自願提供截圖？如何匿名、不收個資？
                                            </div>
                                            <div className="text-[var(--accent)] pt-2 border-t border-[var(--danger)]/20">
                                                <strong>🔧 可以怎麼救？</strong><br />
                                                限定平台、資料數量與分類方式（例：短影音首頁前 10 則／用主題分類），並加上自願與匿名原則。
                                            </div>
                                            <div className="text-[var(--success)] pt-2 border-t border-[var(--danger)]/20">
                                                <strong>✅ 改寫示範</strong><br />
                                                同班學生自願提供的短影音首頁前 10 則推薦中，關係較親近者的推薦主題是否較相似？
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <ThinkRecord
                            dataKey="w3-obstacle-feel"
                            prompt="看完兩題的「卡在哪／怎麼救／改寫示範」後，你覺得要把題目救活，最關鍵的一步是什麼？"
                            scaffold={['這題卡在 ___，所以無法 ___', '要救活它，第一步應該補 ___', '改寫示範跟原題的差別在於 ___']}
                            rows={3}
                        />
                    </div>

                    {/* 四類題目問題 */}
                    <div>
                        <div className="w3-section-head">
                            <div className="flex items-center gap-2">
                                <ContentTypeChip type="學" />
                                <h2>四類題目問題：大・空・遠・難</h2>
                            </div>
                            <div className="line"></div><div className="mono">CONCEPT</div>
                        </div>
                        <p className="w3-section-desc">研究題目大多敗在這四個原因。認識它們，就能找到方向下刀修正。</p>
                        <div className="grid grid-cols-2 gap-3 mt-3">
                            {FOUR_CATS.map(d => (
                                <div key={d.c} className="p-4 bg-white rounded-[10px] border border-[var(--border)] flex flex-col gap-1.5">
                                    <div className="flex items-center gap-2">
                                        <span className="text-[28px] font-serif font-black text-[var(--ink)]">{d.c}</span>
                                        <span className="text-[22px]">{d.e}</span>
                                    </div>
                                    <div className="text-[13px] text-[var(--ink)] leading-[1.6]">{d.d}</div>
                                    <div className="text-[11px] font-mono text-[var(--accent)] mt-0.5">{d.s}</div>
                                </div>
                            ))}
                        </div>

                        <ThinkChoice
                            dataKey="w3-tc1"
                            prompt="下列哪個題目是「大」（範圍太廣）？"
                            options={[
                                { label: 'A', text: '探究幸福的真諦' },
                                { label: 'B', text: '訪談愛因斯坦對相對論的看法' },
                                { label: 'C', text: '全球暖化的成因與防治' },
                                { label: 'D', text: '上帝真的存在嗎？' },
                            ]}
                            answer="C"
                            feedback="「全球暖化的成因與防治」是大——範圍橫跨全球，資料網路查就有，高中生根本完不成。A 是「空」（幸福看不見摸不到），B 是「遠」（對象已過世），D 是「難」（方法驗證不了）。"
                            onAnswer={(sel, ok) => trackChoice('下列哪個題目是「大」（範圍太廣）？', sel, ok)}
                        />
                    </div>

                    {/* ➡️ 轉場：進 Step 2 配對練習 */}
                    <div className="bg-[var(--paper-warm)] border-l-3 border-[var(--gold)] rounded-r-[6px] p-3 mt-4 max-w-[760px]">
                        <p className="text-[12px] text-[var(--ink-mid)] leading-relaxed">
                            💡 看完碰壁體驗——「大空遠難」這四個感覺有了。下個 Step 進<strong className="text-[var(--ink)]">診斷室</strong>，用 8 個爛題目練習四類配對。
                        </p>
                    </div>
                </div>
            ),
        },

        /* ──────────────────────────────────────
         * STEP 2: 急診室 + 練習
         * ────────────────────────────────────── */
        {
            title: '急診室 + 練習',
            icon: '🔍',
            content: (
                <div className="space-y-10 prose-zh">
                    <StepBriefing
                        lines={[
                            { label: '節奏', text: '個人練習（遊戲感強，節奏快）' },
                            { label: '練', text: '8 個題目，診斷是大／空／遠／難哪一類' },
                        ]}
                    />
                    {/* Part 1: 8 個題目 — 互動配對 */}
                    <div className="w3-task-block">
                        <div className="w3-task-hd">
                            <span className="w3-task-badge">PART 1</span>
                            <span className="w3-task-title">🩺 四類診斷室：8 個題目</span>
                        </div>
                        <div className="w3-task-body">
                            <div className="w3-notice w3-notice-gold" style={{ marginBottom: '14px' }}>
                                每個病人得了哪種病？選出你的診斷！選完才會揭曉答案。
                            </div>

                            {/* 四句口訣：快速參考卡 */}
                            <div className="bg-[var(--paper-warm)] border border-[var(--border)] rounded-[var(--radius-unified)] mb-4 overflow-hidden">
                                <div className="px-4 py-2.5 flex items-center gap-2">
                                    <span className="text-[10px] font-mono font-bold text-[var(--ink-light)] tracking-wider uppercase">QUICK CHECK · 四句口訣</span>
                                    <span className="ml-auto text-[10px] text-[var(--ink-light)]">不確定時對照</span>
                                </div>
                                <div className="px-4 pb-3 grid grid-cols-2 gap-x-4 gap-y-1.5">
                                    {FOUR_CATS.map(d => (
                                        <p key={d.c} className="text-[12.5px] text-[var(--ink)] leading-snug">
                                            <span className="font-black mr-1">{d.e} {d.c}</span>
                                            <span className="text-[var(--ink-mid)]">{d.d}</span>
                                        </p>
                                    ))}
                                </div>
                            </div>

                            {/* 進度條 */}
                            <div className="flex items-center gap-3 mb-5 px-1">
                                <div className="flex-1 h-2 bg-[var(--border)] rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-[var(--accent)] rounded-full transition-all duration-500"
                                        style={{ width: `${(diagnosedCount / PATIENTS.length) * 100}%` }}
                                    />
                                </div>
                                <span className="text-[11px] font-mono text-[var(--ink-light)] flex-shrink-0">
                                    {diagnosedCount}/{PATIENTS.length}
                                </span>
                            </div>

                            <div className="w3-patient-grid">
                                {PATIENTS.map(p => {
                                    const picked = diagnoses[p.id];
                                    const isCorrect = picked === p.ans;
                                    const answered = !!picked;
                                    const correctLabel = CAT_LABELS[p.ans];

                                    return (
                                        <div className="w3-patient-card" key={p.id}>
                                            <div className="w3-patient-hd">
                                                <span className="w3-patient-num">題目 #{p.n}</span>
                                                {answered && (
                                                    <span className={`text-[11px] font-bold font-mono ml-auto ${isCorrect ? 'text-[var(--success)]' : 'text-[var(--danger)]'}`}>
                                                        {isCorrect ? '✓ 正確' : '✗ 再想想'}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="w3-patient-body">{p.t}</div>

                                            {/* 病症下拉選單 */}
                                            <div className="px-3 pb-3 mt-2">
                                                {!answered ? (
                                                    <select
                                                        value=""
                                                        onChange={(e) => handleDiagnose(p.id, e.target.value)}
                                                        className="w-full px-3 py-2 rounded-[var(--radius-unified)] border border-[var(--border)] bg-white text-[13px] text-[var(--ink)] focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/15 transition-all cursor-pointer"
                                                    >
                                                                        <option value="" disabled>選擇你的診斷…</option>
                                                        {FOUR_CATS.map(d => (
                                                            <option key={d.c} value={d.c}>
                                                                {d.e} {d.c}｜{d.d}
                                                            </option>
                                                        ))}
                                                    </select>
                                                ) : (
                                                    <div className={`flex items-center gap-2 px-3 py-2 rounded-[var(--radius-unified)] border text-[13px] font-bold ${isCorrect ? 'bg-[var(--success-light)] border-[var(--success)] text-[var(--success)]' : 'bg-[var(--danger-light)] border-[var(--danger)] text-[var(--danger)]'}`}>
                                                        {isCorrect ? '✓' : '✗'} 你的診斷：{CAT_LABELS[picked].e} {picked}
                                                    </div>
                                                )}
                                            </div>

                                            {/* 答案揭曉：三段式 */}
                                            {answered && (
                                                <div className="px-3 pb-3 space-y-2">
                                                    {/* ① 病症 */}
                                                    <div className="p-3 rounded-[6px] bg-[var(--success-light)] border border-[var(--success)]/20 text-[12px]">
                                                        <span className="font-black text-[var(--success)]">病症：</span>
                                                        <span className="font-bold">{correctLabel.e} {p.ans}</span>
                                                        <span className="text-[var(--ink-mid)]">（{correctLabel.s}）</span>
                                                    </div>
                                                    {/* ② 為什麼 */}
                                                    <div className="p-3 rounded-[6px] bg-[var(--paper-warm)] border border-[var(--border)] text-[12px] leading-relaxed">
                                                        <span className="font-black text-[var(--ink)]">為什麼：</span>
                                                        <span className="text-[var(--ink-mid)]">{p.explain}</span>
                                                    </div>
                                                    {/* ③ 不是其他類的理由 */}
                                                    {p.whyNot && (
                                                        <div className="px-3 py-2 text-[11px] text-[var(--ink-light)] leading-relaxed border-l-2 border-[var(--border)]">
                                                            <span className="font-bold text-[var(--ink-mid)]">不是其他類：</span>{p.whyNot}
                                                        </div>
                                                    )}
                                                    {/* ④ 第一刀怎麼救 + 5W1H 驗收示範 */}
                                                    {p.fix && (
                                                        <div className="p-3 rounded-[6px] bg-[#ECFDF5] border-l-4 border-[#10B981] text-[12px] leading-relaxed">
                                                            <div className="font-black text-[#065F46] mb-1">🔪 第一刀怎麼救</div>
                                                            <div className="text-[var(--ink)] mb-2">{p.fix}</div>
                                                            {p.fix5w1h && (
                                                                <div className="mt-2 pt-2 border-t border-[#10B981]/20 space-y-0.5">
                                                                    <div className="text-[10px] font-mono font-bold text-[#065F46] tracking-wider mb-1">5W1H 驗收長這樣 ↓</div>
                                                                    {[
                                                                        ['Who', p.fix5w1h.who],
                                                                        ['Where', p.fix5w1h.where],
                                                                        ['What', p.fix5w1h.what],
                                                                        ['How', p.fix5w1h.how],
                                                                        ['When', p.fix5w1h.when],
                                                                    ].map(([k, v]) => (
                                                                        <p key={k} className="text-[11px] text-[#065F46]/80 leading-snug">
                                                                            <span className="font-bold">{k}：</span>{v}
                                                                        </p>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            {/* 全部答完的總結 */}
                            {diagnosedCount === PATIENTS.length && (
                                <div className="mt-4 p-4 rounded-[8px] border border-[var(--accent)]/20 bg-[var(--accent-light)]">
                                    <div className="text-[14px] font-bold text-[var(--ink)] mb-1">
                                        🩺 診斷完成！答對 {correctCount} / {PATIENTS.length} 題
                                    </div>
                                    <p className="text-[12px] text-[var(--ink-mid)]">
                                        {correctCount === 8 ? '完美全對！大空遠難四類你全掌握了。' :
                                         correctCount >= 6 ? '不錯！大部分都診斷正確，回去看看四類定義加深印象。' :
                                         '沒關係，大空遠難本來就容易混。回去看看 Step 1 的四類卡，找出差別在哪，下次更準！'}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Part 2: 人的診斷練習 — 抽題機 */}
                    <div className="w3-task-block">
                        <div className="w3-task-hd">
                            <span className="w3-task-badge">PART 2</span>
                            <span className="w3-task-title">💪 人的診斷練習（先不用 AI）</span>
                        </div>
                        <div className="w3-task-body">
                            <div className="w3-notice w3-notice-success" style={{ marginBottom: '24px' }}>
                                先知道自己能診斷到哪裡，再讓 AI 幫忙補盲點。第一節課不能開 AI，自己診斷、自己用心法改。
                            </div>

                            {/* ── 個人練習：抽題機 ── */}
                            <div className="text-[12px] font-bold font-mono text-[var(--ink-light)] mb-2 tracking-wider">SOLO · 個人練習</div>

                            {/* 難度選擇 */}
                            {!drillLocked && (
                                <div className="flex gap-2 mb-4">
                                    {[
                                        { key: 'green', label: '🟢 綠卡 新手', color: 'var(--success)' },
                                        { key: 'yellow', label: '🟡 黃卡 進階', color: 'var(--gold)' },
                                        { key: 'red', label: '🔴 紅卡 挑戰題', color: 'var(--danger)' },
                                    ].map(lv => (
                                        <button
                                            key={lv.key}
                                            onClick={() => { setDrillLevel(lv.key); setDrillTopic(null); }}
                                            className={`flex-1 py-2 text-[12px] font-bold rounded-[var(--radius-unified)] border-2 transition-all ${drillLevel === lv.key ? 'text-white' : 'bg-white text-[var(--ink-mid)]'}`}
                                            style={drillLevel === lv.key ? { backgroundColor: lv.color, borderColor: lv.color } : { borderColor: 'var(--border)' }}
                                        >
                                            {lv.label}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* 抽題結果 + 按鈕 */}
                            <div className="border border-[var(--border)] rounded-[var(--radius-unified)] overflow-hidden mb-4">
                                <div className="p-5 bg-white text-center min-h-[80px] flex items-center justify-center">
                                    {drillTopic ? (
                                        <p className={`text-[16px] font-bold text-[var(--ink)] ${drillLocked ? '' : 'animate-in fade-in duration-300'}`}>
                                            「{drillTopic}」
                                        </p>
                                    ) : (
                                        <p className="text-[14px] text-[var(--ink-light)]">按下方按鈕抽一題爛題目</p>
                                    )}
                                </div>
                                <div className="p-3 bg-[var(--paper-warm)] border-t border-[var(--border)] flex gap-2">
                                    {!drillLocked ? (
                                        <>
                                            <button
                                                onClick={rollDrill}
                                                className="flex-1 py-2 text-[13px] font-bold rounded-[var(--radius-unified)] bg-[var(--accent)] text-white hover:opacity-90 transition-all"
                                            >
                                                🎲 {drillTopic ? '再抽一題' : '抽題'}
                                            </button>
                                            {drillTopic && (
                                                <button
                                                    onClick={() => setDrillLocked(true)}
                                                    className="flex-1 py-2 text-[13px] font-bold rounded-[var(--radius-unified)] bg-[var(--success)] text-white hover:opacity-90 transition-all"
                                                >
                                                    ✓ 就這題！
                                                </button>
                                            )}
                                        </>
                                    ) : (
                                        <div className="flex-1 py-2 text-center text-[12px] font-bold text-[var(--success)] font-mono">
                                            ✓ 已鎖定
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* 鎖定後顯示作答區 */}
                            {drillLocked && (
                                <ThinkRecord
                                    dataKey="w3-drill-personal"
                                    prompt={`診斷「${drillTopic}」：是什麼病？用心法怎麼改？`}
                                    scaffold={['它的病症是…因為…', '用心法的…→…', '改成：…']}
                                    rows={4}
                                />
                            )}

                            {/* ── 小組練習：抽題機 ── */}
                            {mode === 'self-study' && (
                                <div className="mt-8 px-3 py-2 rounded-[6px] bg-[#F0F9FF] border border-[#0284C7]/30 text-[12px] text-[#075985]">
                                    📖 以下是課堂小組活動，自學同學可跳過——上方個人練習已等價。
                                </div>
                            )}
                            <div className="text-[12px] font-bold font-mono text-[var(--ink-light)] mb-2 mt-4 tracking-wider">TEAM · 小組練習（黃卡＋紅卡）</div>

                            <div className="border border-[var(--border)] rounded-[var(--radius-unified)] overflow-hidden mb-4">
                                <div className="p-5 bg-white text-center min-h-[80px] flex items-center justify-center">
                                    {drillGroupTopic ? (
                                        <p className={`text-[16px] font-bold text-[var(--ink)] ${drillGroupLocked ? '' : 'animate-in fade-in duration-300'}`}>
                                            「{drillGroupTopic}」
                                        </p>
                                    ) : (
                                        <p className="text-[14px] text-[var(--ink-light)]">小組一起抽一題進階題目</p>
                                    )}
                                </div>
                                <div className="p-3 bg-[var(--paper-warm)] border-t border-[var(--border)] flex gap-2">
                                    {!drillGroupLocked ? (
                                        <>
                                            <button
                                                onClick={rollGroupDrill}
                                                className="flex-1 py-2 text-[13px] font-bold rounded-[var(--radius-unified)] bg-[var(--accent)] text-white hover:opacity-90 transition-all"
                                            >
                                                🎲 {drillGroupTopic ? '再抽一題' : '抽題'}
                                            </button>
                                            {drillGroupTopic && (
                                                <button
                                                    onClick={() => setDrillGroupLocked(true)}
                                                    className="flex-1 py-2 text-[13px] font-bold rounded-[var(--radius-unified)] bg-[var(--success)] text-white hover:opacity-90 transition-all"
                                                >
                                                    ✓ 就這題！
                                                </button>
                                            )}
                                        </>
                                    ) : (
                                        <div className="flex-1 py-2 text-center text-[12px] font-bold text-[var(--success)] font-mono">
                                            ✓ 已鎖定
                                        </div>
                                    )}
                                </div>
                            </div>

                            {drillGroupLocked && (
                                <ThinkRecord
                                    dataKey="w3-drill-group"
                                    prompt={`小組診斷「${drillGroupTopic}」：什麼病？怎麼改？`}
                                    scaffold={['大家討論後覺得是…病', '理由是…', '用心法改成：…']}
                                    rows={4}
                                />
                            )}

                            {/* 萬用提示條 */}
                            <div className="w3-hint-strip mt-6">
                                <div className="w3-hint-strip-hd">🔎 萬用提示條 — 卡住就看這裡</div>
                                <div className="w3-hint-body">
                                    {HINT_ITEMS.map(h => (
                                        <div className="w3-hint-item" key={h.f}>
                                            <div className="w3-hint-from">{h.f.split(' ')[0]}</div>
                                            <div className="w3-hint-text">{h.t}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 配對診斷後反思 */}
                    <div className="flex items-center gap-2 mb-1">
                        <ContentTypeChip type="練" />
                        <span className="text-[13px] font-bold text-[var(--ink)]">診斷反思</span>
                    </div>
                    <ThinkRecord
                        dataKey="w3-disease-quiz"
                        prompt="大／空／遠／難四類裡，你最難判斷的是哪一類？為什麼難？"
                        scaffold={['我最容易搞混的是「___」和「___」', '因為這兩類的差別在於…', '判斷的關鍵是…']}
                        rows={3}
                    />

                    {/* ➡️ 轉場：進 Step 3 學下刀 */}
                    <div className="bg-[var(--paper-warm)] border-l-3 border-[var(--gold)] rounded-r-[6px] p-3 mt-4 max-w-[760px]">
                        <p className="text-[12px] text-[var(--ink-mid)] leading-relaxed">
                            💡 四類都認得了——下個 Step 進<strong className="text-[var(--ink)]">下刀工坊</strong>，學 4 把刀心法、看示範、自己對範例題下刀練手。
                        </p>
                    </div>
                    {/* 反思：大／空／遠／難 誤診觀察 */}
                    <ThinkRecord
                        dataKey="w3-reflect-misdiagnosis"
                        prompt="✍️ 反思 1：大／空／遠／難四類裡，你最容易混淆哪兩個？差別在哪裡？"
                        placeholder="例：我最容易混淆「大」和「空」。題目寫「高中生壓力」我以為只是太大，但其實是「壓力」本身太抽象（空）——分不清關鍵在「誰」太廣、還是「測什麼」沒講清楚。"
                        scaffold={['我最容易混淆「___」和「___」', '差別其實在…', '判斷的關鍵是…']}
                        rows={4}
                    />
                </div>
            ),
        },

        /* ──────────────────────────────────────
         * STEP 3: 下刀工坊 — 學心法 + 看示範 + 自己下刀
         * ────────────────────────────────────── */
        {
            title: '下刀工坊',
            icon: '🔪',
            content: (
                <div className="space-y-8 prose-zh">
                    <p className="text-[14px] text-[var(--ink-mid)] leading-relaxed">
                        四類都認得了——下一步學「<strong className="text-[var(--ink)]">下刀</strong>」：大空遠難各有一把刀，把爛題目改成可研究版本。看示範→自己練手→Step 4 對自己題目下刀。
                    </p>
                    <StepBriefing
                        lines={[
                            { label: '節奏', text: '跟老師做 → 個人練手' },
                            { label: '學', text: '4 把刀（大→小 / 空→實 / 遠→近 / 難→易）各自的操作範例' },
                        ]}
                    />

                    {/* 萬用急救心法 */}
                    <div>
                        <div className="w3-mantra-box">
                            <div className="w3-mantra-hd"><div className="title">萬用急救心法：把「大、空、遠、難」變成「小、實、近、易」</div></div>
                            <div className="w3-mantra-core">
                                <div className="w3-mantra-rows">
                                    {MANTRA_ROWS.map(m => (
                                        <div className="w3-mantra-row-item" key={m.f}>
                                            <div className="w3-mantra-from">{m.f}</div>
                                            <div className="w3-mantra-arrow-sm">↓</div>
                                            <div className="w3-mantra-to">{m.t}</div>
                                            <div className="w3-mantra-desc">{m.d}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="w3-notice w3-notice-gold">
                            💡 如果你的題目太大、太空、太遠、太難——回頭用萬用心法修！
                        </div>

                        {/* 🎮 遊戲暱稱對映卡 — 正課不用記，深度補充 */}
                        <DepthBlock title="靶心遊戲暱稱對照">
                            <p className="text-[12.5px] font-bold text-[var(--ink)] mb-3 flex items-center gap-1.5">
                                <span>🎮</span>
                                <span>玩「靶心」遊戲才會用到的暱稱對照（正課不用記）</span>
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[12px]">
                                <div className="flex items-center gap-2 bg-white border border-[var(--border)] rounded-[6px] px-3 py-2">
                                    <span className="text-[16px]">💊</span>
                                    <span><strong className="text-[var(--ink)]">範圍縮小</strong><span className="text-[var(--ink-light)] text-[11px] ml-1">（遊戲名：縮小藥丸）</span></span>
                                </div>
                                <div className="flex items-center gap-2 bg-white border border-[var(--border)] rounded-[6px] px-3 py-2">
                                    <span className="text-[16px]">💉</span>
                                    <span><strong className="text-[var(--ink)]">抽象具體化</strong><span className="text-[var(--ink-light)] text-[11px] ml-1">（遊戲名：具體疫苗）</span></span>
                                </div>
                                <div className="flex items-center gap-2 bg-white border border-[var(--border)] rounded-[6px] px-3 py-2">
                                    <span className="text-[16px]">🚪</span>
                                    <span><strong className="text-[var(--ink)]">對象可及化</strong><span className="text-[var(--ink-light)] text-[11px] ml-1">（遊戲名：任意門探測儀）</span></span>
                                </div>
                                <div className="flex items-center gap-2 bg-white border border-[var(--border)] rounded-[6px] px-3 py-2">
                                    <span className="text-[16px]">🔪</span>
                                    <span><strong className="text-[var(--ink)]">方法可行化</strong><span className="text-[var(--ink-light)] text-[11px] ml-1">（遊戲名：降維手術刀）</span></span>
                                </div>
                            </div>
                            <p className="text-[11px] text-[var(--ink-light)] italic leading-relaxed mt-2.5">
                                💡 <strong className="text-[var(--ink)]">課本／作業／老師講的</strong>都用正式名（範圍縮小／抽象具體化／對象可及化／方法可行化）；這裡的暱稱只在遊戲裡看得到，不用背。
                            </p>
                        </DepthBlock>

                        {/* 📖 4 把刀的下刀心路歷程（互動展開）*/}
                        <div className="mt-6">
                            <h4 className="text-[14px] font-bold text-[var(--ink)] mb-2 flex items-center gap-1.5">
                                <span>📖</span> 4 把刀的下刀心路歷程：看別人怎麼想
                            </h4>
                            <p className="text-[12px] text-[var(--ink-mid)] mb-3 max-w-[760px] leading-relaxed">
                                看到一個爛題目，老練的研究者腦中會自動冒出問題——「咦，這太大、太抽象、太遠、太難……到底是哪一個？」<strong className="text-[var(--ink)]">先自己想 30 秒</strong>，再點開看示範——比直接看答案學得深兩倍。
                            </p>
                            <div className="grid md:grid-cols-2 gap-3">
                                {CUT_MENTAL_FLOWS.map(flow => (
                                    <CutFlowCard key={flow.id} flow={flow} />
                                ))}
                            </div>
                            <p className="text-[11px] italic text-[var(--ink-light)] mt-3 leading-relaxed">
                                ⚠️ 這些示範是「方向對」、不是「最終定案」。你也只要做到方向對就好——剩下 W4-W5 還會繼續修。
                            </p>
                        </div>

                        {/* ✏️ 練手題：學生實際下刀 + 強制比對示範 */}
                        <CutPractice />
                    </div>

                    {/* 兩條救活路徑示範卡 — worked example，深度補充 */}
                    <DepthBlock title="看完整範例">
                    <div className="rounded-[var(--radius-unified)] border-2 border-[var(--accent)]/30 overflow-hidden">
                        <div className="p-4 px-5 bg-[var(--accent-light)] border-b border-[var(--accent)]/20">
                            <div className="text-[10px] font-mono uppercase tracking-[0.15em] text-[var(--accent)] font-bold mb-1">救活路徑示範</div>
                            <h4 className="font-serif text-[17px] font-bold text-[var(--ink)] leading-[1.5]">同一個爛題目，兩條救活路徑</h4>
                            <p className="text-[12.5px] text-[var(--ink-mid)] mt-2 leading-[1.75]">
                                原題：「<strong className="text-[var(--danger)]">高中生上課使用手機的頻率，與課堂專注程度之間有什麼關係？</strong>」<br />
                                病灶：<strong>專注程度</strong>太抽象、難測量（空病 + 難病）。可以走兩條路救活——
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[var(--border)]">
                            <div className="p-4 px-5 bg-white flex flex-col gap-2">
                                <div className="flex items-center gap-2">
                                    <span className="bg-[#0ea5e9] text-white text-[11px] font-bold font-mono px-2 py-0.5 rounded">路徑 A</span>
                                    <span className="text-[10px] font-mono uppercase tracking-[0.1em] text-[var(--ink-light)]">換具體指標</span>
                                </div>
                                <div className="text-[12.5px] text-[var(--ink-mid)] leading-[1.7]">
                                    救法：把「專注程度」換成<strong>可測指標</strong>（記筆記時間、字數、自評分數）。
                                </div>
                                <div className="mt-1 p-3 rounded-[6px] bg-[var(--paper)] text-[12.5px] text-[var(--ink)] italic leading-[1.7]">
                                    「本校高一段考前一週的<strong>夜間滑手機時數</strong>，與<strong>翌日專注力自評（5 分量表）</strong>之相關性」
                                </div>
                            </div>
                            <div className="p-4 px-5 bg-white flex flex-col gap-2">
                                <div className="flex items-center gap-2">
                                    <span className="bg-[#7c3aed] text-white text-[11px] font-bold font-mono px-2 py-0.5 rounded">路徑 B</span>
                                    <span className="text-[10px] font-mono uppercase tracking-[0.1em] text-[var(--ink-light)]">放棄概念，改測結果</span>
                                </div>
                                <div className="text-[12.5px] text-[var(--ink-mid)] leading-[1.7]">
                                    救法：放棄「專注程度」這個抽象概念，改測<strong>客觀結果</strong>（成績）。
                                </div>
                                <div className="mt-1 p-3 rounded-[6px] bg-[var(--paper)] text-[12.5px] text-[var(--ink)] italic leading-[1.7]">
                                    「本校高一上課使用手機頻率，與<strong>當週小考成績</strong>之相關性」
                                </div>
                            </div>
                        </div>
                        <div className="p-3 px-5 bg-[var(--paper)] border-t border-[var(--border)] text-[11.5px] text-[var(--ink-light)] leading-[1.7]">
                            💡 <strong>兩條路都對</strong>——研究的決定不是「誰是正確答案」，是「**哪條路你能執行**」。同一個爛題目可以走多條路救，**這就是 Step 4 你要對自己題目做的事**。
                        </div>
                    </div>
                    </DepthBlock>

                    {/* ➡️ 轉場：進 Step 4 對自己題目下刀 */}
                    <div className="bg-[var(--paper-warm)] border-l-3 border-[var(--gold)] rounded-r-[6px] p-3 mt-4 max-w-[760px]">
                        <p className="text-[12px] text-[var(--ink-mid)] leading-relaxed">
                            💡 看完心法、練完手感、看完兩條路徑——下個 Step 動真格：<strong className="text-[var(--ink)]">對自己題目下刀</strong>。
                        </p>
                    </div>
                </div>
            ),
        },

        /* ──────────────────────────────────────
         * STEP 4: 對自己題目下刀 — 自診 + 5W1H 切開題目（原 Part 4）
         * ────────────────────────────────────── */
        {
            title: '對自己題目下刀',
            icon: '⚔️',
            content: (
                <div className="space-y-8 prose-zh">
                    <StepBriefing
                        lines={[
                            { label: '節奏', text: '個人（第二節課）' },
                            { label: '做', text: '拿 W2 的研究問題，先用四把刀修題，再用 5W1H 檢查它是否真的可執行' },
                            { label: '產出', text: '一個能帶到 W4 選研究方法的修正版題目' },
                        ]}
                    />
                    {/* 過渡說明 */}
                    <div className="bg-[var(--ink)] text-white rounded-[var(--radius-unified)] p-6">
                        <div className="text-[11px] font-mono text-[var(--accent-light)] tracking-wider mb-2">CHECKPOINT · 練手結束</div>
                        <div className="text-[13px] text-white/60 mb-1">你 W2 寫下的是一個研究方向——</div>
                        <div className="text-headline font-serif font-bold text-[var(--gold)] leading-snug">這週不是要推翻它，是讓它能真的做。</div>
                        {/* 三工具流水線 */}
                        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                            {[
                                { label: '大空遠難', role: '診斷工具', desc: '找出題目卡在哪' },
                                { label: '四把刀', role: '修改工具', desc: '決定第一刀怎麼下' },
                                { label: '5W1H', role: '驗收工具', desc: '確認改法夠不夠具體' },
                            ].map(t => (
                                <div key={t.label} className="bg-white/10 rounded-[6px] p-3">
                                    <div className="text-[13px] font-black text-[var(--gold)]">{t.label}</div>
                                    <div className="text-[10px] font-mono text-white/60 tracking-wider mt-0.5">{t.role}</div>
                                    <div className="text-[11px] text-white/70 mt-1 leading-snug">{t.desc}</div>
                                </div>
                            ))}
                        </div>
                        <p className="text-[14px] text-[var(--gold)] mt-4 font-bold leading-[1.6]">
                            🛡️ 題目有病很正常。今天不是放棄它，是把它救到做得出來。先不用 AI，自己動手 10 分鐘。
                        </p>
                    </div>

                    {/* W2 題目帶入卡 */}
                    {w2Intent ? (
                        <div className="border border-[var(--accent)]/30 bg-[var(--accent-light)]/20 rounded-[var(--radius-unified)] p-5">
                            <div className="text-[11px] font-mono text-[var(--accent)] uppercase tracking-wider mb-2">📎 你上週的 W2 最終研究問題（這就是這週要檢查的研究方向）</div>
                            <p className="text-[14px] text-[var(--ink)] font-medium leading-relaxed">{w2Intent}</p>
                            <p className="text-[11px] text-[var(--ink-light)] mt-2 leading-relaxed">
                                💡 下方第一格「診斷」，先確認這個方向夠不夠具體（對象／變項／方法清楚嗎），不夠就微調，再開始診斷。
                            </p>
                        </div>
                    ) : (
                        <BackfillField
                            dataKey="w2-final-intent"
                            label="⚠️ 沒偵測到你 W2 的最終研究問題——把你上週寫的句子貼這裡，下方診斷會立即接通。"
                            placeholder="例：我想探究「考試壓力」如何影響「學生對圖書館空間使用」的選擇。"
                            buttonLabel="補上 W2 意圖"
                        />
                    )}

                    {/* Section A：診斷 */}
                    <div className="bg-white border border-[var(--border)] rounded-[var(--radius-unified)] overflow-hidden">
                        <div className="px-5 py-3 bg-[var(--paper-warm)] border-b border-[var(--border)] flex items-center gap-2">
                            <span className="text-[11px] font-mono font-bold text-[var(--ink-mid)]">診斷</span>
                        </div>
                        <div className="p-5 space-y-4">
                            {/* 病症 chip 選擇（選填：題目沒問題可跳過） */}
                            <div>
                                <div className="flex items-baseline gap-2 mb-1.5">
                                    <p className="text-[12px] font-bold text-[var(--ink)]">題目有沒有這些問題？</p>
                                    <span className="text-[10.5px] text-[var(--ink-light)]">有才選，題目已夠具體可跳過直接填 5W1H</span>
                                </div>
                                <div className="grid grid-cols-4 gap-2">
                                    {FOUR_CATS.map(d => {
                                        const selected = ownCat === d.c;
                                        return (
                                            <button
                                                key={d.c}
                                                onClick={() => selectOwnCat(d.c)}
                                                className={`py-2.5 px-2 rounded-[var(--radius-unified)] border-2 text-center transition-all ${selected ? 'bg-[var(--accent)] border-[var(--accent)] text-white shadow-sm' : 'bg-white border-[var(--border)] text-[var(--ink)] hover:border-[var(--accent)]/50'}`}
                                            >
                                                <div className="text-[18px]">{d.e}</div>
                                                <div className="text-[13px] font-black mt-0.5">{d.c}</div>
                                            </button>
                                        );
                                    })}
                                </div>
                                {ownCat && (
                                    <p className="mt-2 text-[11.5px] text-[var(--accent)] font-medium">
                                        ✓ 選了「{ownCat}」——{FOUR_CATS.find(d => d.c === ownCat)?.d}
                                    </p>
                                )}
                            </div>
                            {/* 解釋為什麼（選填，有選病症才需要填） */}
                            {ownCat && (
                                <ThinkRecord
                                    dataKey="w3-own-diagnose"
                                    prompt="為什麼是這類？（一句話說明最先卡在哪裡）"
                                    scaffold={[`為什麼是「${ownCat}」？例：「___」這個詞看不見、摸不到，不知道要怎麼測量。`]}
                                    rows={2}
                                />
                            )}
                            {/* 選刀 + 改法（有病症才需要） */}
                            {ownCat && (
                                <ThinkRecord
                                    dataKey="w3-own-fix"
                                    prompt="選哪把刀？改掉了什麼？"
                                    scaffold={[
                                        `我選的第一刀：${FOUR_CATS.find(d => d.c === ownCat)?.s || '大→小 / 空→實 / 遠→近 / 難→易'}`,
                                        '我改掉了什麼：例：把「___」換成「___」，因為後者看得到／數得出來／找得到。',
                                    ]}
                                    rows={4}
                                />
                            )}
                        </div>
                    </div>

                    {/* Section B：5W1H 出院檢查 */}
                    <div className="bg-white border border-[var(--border)] rounded-[var(--radius-unified)] overflow-hidden">
                        <div className="px-5 py-3 bg-[var(--paper-warm)] border-b border-[var(--border)] flex items-center gap-2">
                            <span className="text-[11px] font-mono font-bold text-[var(--ink-mid)]">5W1H 出院檢查：修完後能不能真的做？</span>
                            <span className="ml-auto text-[10px] font-mono text-[var(--danger)] shrink-0">至少填 4 格（Who/Where/What/How 必備）</span>
                        </div>
                        <div className="p-5 space-y-4">
                            {/* 一句說明：定位 5W1H 角色 */}
                            <p className="text-[12px] text-[#1E40AF] leading-relaxed">
                                <strong>5W1H 是出院檢查表，不是新工具。</strong> Who、What、How 填不出來 = 題目還進不了 W4。
                            </p>
                            {/* 範例：有層次的卡片式顯示 */}
                            <div className="border border-dashed border-[var(--border)] rounded-[var(--radius-unified)] overflow-hidden">
                                <div className="px-4 py-2 bg-[var(--paper-warm)] border-b border-dashed border-[var(--border)]">
                                    <span className="text-[11px] font-mono font-bold text-[var(--ink-mid)]">📋 範例題目：本校高一段考前的夜間滑手機</span>
                                </div>
                                <div className="divide-y divide-[var(--border)]/50">
                                    {[
                                        { label: 'Who',   hint: '我要研究誰',         val: '本校高一學生',                                              required: true  },
                                        { label: 'Where', hint: '在哪個場域',         val: '放學後在家',                                                required: true  },
                                        { label: 'What',  hint: '我要測量或分析什麼', val: '睡前 30 分鐘的滑手機時數、隔日上午第一節的專注力自評（1–5 分）', required: true  },
                                        { label: 'How',   hint: '用什麼方法',         val: '問卷',                                                      required: true  },
                                        { label: 'When',  hint: '時間或情境',         val: '段考前一週',                                                required: false },
                                    ].map(r => (
                                        <div key={r.label} className="flex items-center gap-3 px-4 py-2.5 bg-[var(--paper-warm)]">
                                            <div className="w-14 shrink-0 text-right">
                                                <span className="text-[11px] font-mono font-black text-[var(--accent)]">{r.label}</span>
                                                <span className="block text-[9.5px] text-[var(--ink-light)]">{r.hint}</span>
                                                {!r.required && <span className="block text-[9px] text-[var(--accent)]/50">選填</span>}
                                            </div>
                                            <span className="text-[12.5px] text-[var(--ink)] leading-relaxed">{r.val}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            {/* 填空：個別欄位 */}
                            <FiveW1HForm />

                            {/* 出院標準 checklist — 可勾選 */}
                            <div className="bg-[var(--accent-light)]/30 border border-[var(--accent)]/20 rounded-[8px] p-4">
                                <div className="text-[12px] font-bold text-[var(--ink)] mb-3">🏥 急救出院標準（自己勾）</div>
                                <div className="space-y-2">
                                    {[
                                        '5W1H 至少能寫出 4 格（Who / Where / What / How 必備，When 選填）',
                                        '符合「小、實、近、易」至少 2 項',
                                        '我能在兩週內蒐集到資料（問卷／訪談／觀察／文獻／實驗其一）',
                                    ].map((item, i) => (
                                        <label key={i} className="flex items-start gap-2.5 cursor-pointer group">
                                            <input
                                                type="checkbox"
                                                className="mt-0.5 shrink-0 w-4 h-4 rounded accent-[var(--accent)] cursor-pointer"
                                            />
                                            <span className="text-[12px] text-[var(--ink-mid)] leading-relaxed group-has-[:checked]:line-through group-has-[:checked]:text-[var(--ink-light)]">{item}</span>
                                        </label>
                                    ))}
                                </div>
                                <p className="text-[11px] text-[var(--ink-light)] mt-3">三項都能勾 → 進入 Part 5 打磨定案。</p>
                                <p className="text-[11px] text-[var(--danger)]/70 mt-1.5">⚡ Who、What、How 說不清楚，通常代表題目還沒準備好進入方法設計。</p>
                            </div>
                        </div>
                    </div>

                    {/* Section C：修改版題目 */}
                    <div className="bg-white border-2 border-[var(--gold)]/50 rounded-[var(--radius-unified)] overflow-hidden">
                        <div className="px-5 py-3 bg-[var(--gold)]/10 border-b border-[var(--gold)]/30 flex items-center gap-2">
                            <span className="text-[11px] font-mono font-bold text-[var(--ink)]">修改版題目（Part 5 起跑線）</span>
                        </div>
                        <div className="p-5">
                            <ThinkRecord
                                dataKey="w3-own-revised"
                                prompt="根據診斷 + 5W1H，你修正後的題目是？（這題會帶到 Part 5 第一輪）"
                                placeholder="例：本校高一學生在段考前一週的夜間手機使用時數，與隔日上午第一節專注力自評之間的相關性。"
                                scaffold={['修改版題目：']}
                                rows={3}
                            />
                        </div>
                    </div>
                </div>
            ),
        },

        /* ──────────────────────────────────────
         * STEP 5: AI 共診定案 — AI 4 步協作磨定案（原 Part 5）
         * ────────────────────────────────────── */
        {
            title: 'AI 共診定案',
            icon: '🎯',
            content: (
                <div className="space-y-8 prose-zh">
                    <StepBriefing
                        lines={[
                            { label: '節奏', text: '個人（AI 協作）' },
                            { label: '做', text: '三步：①自己初稿 → ②AI 診斷 + 你的比對 → ③定案' },
                            { label: '交出', text: '帶去 W4 的最終研究問題 + AI-RED 紀錄' },
                        ]}
                    />
                    <div className="bg-[var(--paper-warm)] border border-[var(--border)] rounded-[var(--radius-unified)] p-5">
                        <div className="text-[11px] font-mono text-[var(--ink-mid)] tracking-wider mb-1">最後一關 · AI 協作 3 步驟</div>
                        <h2 className="text-[18px] font-bold text-[var(--ink)] mb-2">把你的題目從初稿磨成定案</h2>
                        <p className="text-[13px] text-[var(--ink-mid)] leading-relaxed">
                            重點不是 AI 改得多好，而是<strong>你怎麼選、為什麼選</strong>。①先自己寫，再開 AI 診斷，最後你拍板定案。
                            給自己 12 分鐘做到「定案」——那個最後定案框就是你這學期的研究起點。
                        </p>
                    </div>

                    {/* 📖 示範流程預覽（小華的故事）— 完整範例詳解，深度補充 */}
                    <DepthBlock title="看完整範例">
                        <div className="space-y-4 text-[12.5px] leading-[1.85]">
                            <p className="font-bold text-[13px] text-[var(--accent)]">📖 完整範例：小華的故事（第一次自己跑 AI 協作前先看一遍）</p>
                            <div>
                                <div className="text-[11px] font-mono font-bold text-[var(--ink-light)] uppercase mb-1">小華的初稿（第一輪）</div>
                                <div className="bg-[var(--paper-warm)] border-l-4 border-[var(--ink-light)] p-3 rounded-r-[6px] text-[var(--ink)]">
                                    「本校高一學生段考前的手機使用情形」
                                </div>
                            </div>

                            <div>
                                <div className="text-[11px] font-mono font-bold text-[var(--ink-light)] uppercase mb-1">小華自己診斷（開 AI 之前）</div>
                                <div className="bg-[var(--paper-warm)] border-l-4 border-[var(--ink-light)] p-3 rounded-r-[6px]">
                                    「我覺得是 <strong>大（範圍太廣）</strong>，因為『使用情形』太空泛，沒講要測什麼。」
                                </div>
                            </div>

                            <div>
                                <div className="text-[11px] font-mono font-bold text-[var(--accent)] uppercase mb-1">AI 診斷回應（開 AI 後）</div>
                                <div className="bg-[var(--accent-light)]/20 border-l-4 border-[var(--accent)] p-3 rounded-r-[6px]">
                                    「主要是 <strong>大（範圍太廣）</strong>：『使用情形』未定義要測時數、頻率、還是內容。<br />
                                    另外還有一個問題——題目把『段考前』和『手機使用』綁在一起，沒講要看哪個影響哪個，<strong>焦點不夠清楚，也有一點「空」</strong>。」
                                </div>
                            </div>

                            <div>
                                <div className="text-[11px] font-mono font-bold text-[#D97706] uppercase mb-1">小華比對差異（第二輪・同框）</div>
                                <div className="bg-[#FEF3C7] border-l-4 border-[#D97706] p-3 rounded-r-[6px]">
                                    「我只看到『範圍太大』，沒看到『焦點不清』。AI 抓到我把『時間點』和『行為』混在一起。<strong>這個盲點我自己看不到。</strong>」
                                </div>
                            </div>

                            <div>
                                <div className="text-[11px] font-mono font-bold text-[#10B981] uppercase mb-1">小華最終定案</div>
                                <div className="bg-[#ECFDF5] border-l-4 border-[#10B981] p-3 rounded-r-[6px]">
                                    「綜合 Part 4 的修改方向和 AI 的補充，我定案：<br />
                                    <strong>本校高一段考前一週的夜間滑手機時數與翌日專注力自評之相關性</strong>。<br />
                                    理由：① 我真的好奇『睡前滑手機 vs 隔日專注力』這條因果鏈　② 兩個變項都能用問卷量化（時數 + 1-5 分自評）　③ 聚焦一段考時間，大空遠難都解決了。」
                                </div>
                            </div>

                            <div className="bg-[var(--ink)]/5 border border-[var(--ink)]/10 rounded-[6px] p-3">
                                <p className="font-bold text-[12px] text-[var(--ink)] mb-1">🎓 小華示範告訴你兩件事：</p>
                                <ol className="list-decimal pl-5 text-[12px] text-[var(--ink-mid)] leading-[1.85] space-y-0.5">
                                    <li><strong>自己診斷不要怕錯</strong>——小華只看到「大」、沒看到「空」，這正常，AI 才能幫上忙</li>
                                    <li><strong>比對差異是金礦</strong>——「AI 看到、我沒看到」的東西是你的學習點，要寫下來，這才是這步的核心</li>
                                </ol>
                            </div>
                        </div>
                    </DepthBlock>

                    {/* 第一輪 — 自己先寫初稿 */}
                    <section className="bg-white border border-[var(--border)] rounded-[var(--radius-unified)] overflow-hidden">
                        <div className="px-5 py-3 bg-[var(--paper-warm)] border-b border-[var(--border)] flex items-center gap-2">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--ink)] text-white flex items-center justify-center text-[12px] font-bold font-mono">1</span>
                            <span className="font-bold text-[13px]">自己先寫初稿</span>
                            <span className="ml-auto text-[10px] font-mono text-[var(--ink-light)]">人先做</span>
                        </div>
                        <div className="p-5">
                            <P5DraftField />
                        </div>
                    </section>

                    {/* 第二輪 — 問 AI 診斷 + 你的比對判斷（合併原 2+3） */}
                    <section className="bg-white border border-[var(--border)] rounded-[var(--radius-unified)] overflow-hidden">
                        <div className="px-5 py-3 bg-[var(--paper-warm)] border-b border-[var(--border)] flex items-center gap-2">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--ink)] text-white flex items-center justify-center text-[12px] font-bold font-mono">2</span>
                            <span className="font-bold text-[13px]">問 AI 診斷 + 你的比對判斷</span>
                            <span className="ml-auto text-[10px] font-mono text-[var(--ink-light)]">AI 給 → 你判斷</span>
                        </div>
                        <div className="p-5 space-y-4">
                            <P5CompareRef />
                            <AIAssistToggle
                                id="w3-p5-diagnose"
                                title="問 AI 診斷你的題目"
                                reason="只問診斷、不問改法——Prompt 已鎖定用大／空／遠／難四類語言，讓 AI 跟你講同一種話。拿到 AI 診斷後，下方記錄欄要同時寫『AI 診斷 + 你 Part 4 自診的差異判斷』，這是這一步的核心。"
                                prompt={MY_DIAGNOSE_PROMPT}
                                recordKey="w3-p5-diagnose-ai-record"
                                recordPrompt="AI 診斷出哪一類（大／空／遠／難）？跟你 Part 4 的自診差在哪？你更認同誰？"
                                recordPlaceholder={'AI 診斷：□大 □空 □遠 □難\n我 Part 4 自診：□大 □空 □遠 □難\n一致／不一致：\n我更認同 ___ 的版本，因為 ___'}
                                forceAI
                            />
                        </div>
                    </section>

                    {/* 定案 · 最終定案 */}
                    <section className="bg-[var(--accent-light)]/30 border-2 border-[var(--accent)] rounded-[var(--radius-unified)] overflow-hidden">
                        <div className="px-5 py-3 bg-[var(--accent)] text-white flex items-center gap-2">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-white text-[var(--accent)] flex items-center justify-center text-[12px] font-bold font-mono">3</span>
                            <span className="font-bold text-[13px]">🎯 我拍板 → 寫成最終定案題目（你負責判斷）</span>
                            <span className="ml-auto text-[10px] font-mono font-bold text-white">不能跳過</span>
                        </div>
                        <div className="p-5 space-y-3">
                            <p className="text-[12px] text-[var(--ink-mid)] leading-relaxed">
                                綜合 AI 的診斷、自己 Part 4 的修改版、或再改寫一次，<strong>用你的判斷</strong>做最終決定。
                                這題就是你這學期的研究起點，會帶到 W4 為它選研究方法。
                            </p>
                            <ThinkRecord
                                dataKey="w3-final-topic"
                                prompt="🎯 我的 W3 最終定案題目"
                                placeholder="把你決定的題目完整寫出來。會帶到 W4 方法地圖。"
                                scaffold={[
                                    '我選：☐ AI 診斷後的修改方向  ☐ 我 Part 4 的版本最準  ☐ 綜合改成自己的',
                                    '最終定案題目：',
                                    '選擇理由（至少勾 2 項 + 一句話補充）：',
                                    '  ☐ 這個題目我做得到（對象找得到、資源夠）',
                                    '  ☐ 我有興趣（真的想知道答案）',
                                    '  ☐ 這個方法我比較會用',
                                    '  ☐ 這個題目符合萬用心法（小實近易）',
                                    '  ☐ 其他：',
                                    '補充說明：',
                                ]}
                                rows={9}
                            />

                            {/* 🔥 研究動機——題目剛訂下來最有溫度，這時候寫 */}
                            <div className="bg-[var(--gold-light)] border-l-4 border-[var(--gold)] p-4 rounded-r-[8px] mt-3">
                                <p className="text-[12.5px] font-bold text-[#7a6020] mb-1">⚠️ 這格別跳過——趁熱寫研究動機</p>
                                <p className="text-[11.5px] text-[#7a6020] leading-relaxed">
                                    題目剛訂下來、你的腦袋最熱——這時候寫研究動機最真誠。<strong>一句話</strong>講清楚就好。會帶去 W6 海報直接抄上去，下半學期擋風遮雨的就是這句話。
                                </p>
                            </div>
                            <ThinkRecord
                                dataKey="w3-motivation"
                                prompt="✍️ 研究動機（W6 海報會自動帶入）：為什麼這個題目值得我花一學期研究？"
                                placeholder="例：我自己段考前每次熬夜滑手機隔天念書效率超差——想證明這個感覺是真的，幫之後想戒手機的同學多一份具體數據。"
                                scaffold={['我想研究這個是因為 ___', '這個答案對 ___（誰）有意義']}
                                rows={3}
                            />

                            <div className="bg-white border border-[var(--accent)]/20 rounded-[6px] p-3 text-[11px] text-[var(--ink-mid)] leading-relaxed">
                                <strong className="text-[var(--accent)]">✓ 完成確認：</strong>Step 4 出院標準都能勾、研究動機也寫了 → 本週急救成功，帶這題去 W4。
                            </div>
                        </div>
                    </section>

                    {/* 本週 AI 互動總結（Part 3 + Part 5） */}


                    {/* 反思：修法路徑回顧 */}
                    <ThinkRecord
                        dataKey="w3-reflect-cuts"
                        prompt="✍️ 反思 2：你的題目走過哪幾把刀（縮小／具體化／可及化／可行化）？最後落點為什麼是這裡？"
                        placeholder="例：我走了縮小（從『高中生』→『松山高一』）+ 具體化（從『壓力』→『段考前手機使用時數』）。沒動可及化（我自己就是高一、樣本拿得到）跟可行化（兩週內能做）。落這裡是因為再切下去就會失真——『松山高一段考前手機時數』剛好可以兩週內問到。"
                        scaffold={['我走了 ___ 把刀（縮小／具體化／可及化／可行化）', '沒動 ___ 是因為…', '最後落這裡是因為…']}
                        rows={5}
                    />
                    <AIREDNarrative week="3" hint="這週你用 AI 做了題目診斷、改法發想、定案優化。挑一次最關鍵的互動記錄下來。" />
                </div>
            ),
        },

        /* ──────────────────────────────────────
         * STEP 6: 回顧與繳交
         * ────────────────────────────────────── */
        {
            title: '回顧與繳交',
            icon: '📋',
            content: (
                <div className="space-y-8 prose-zh">
                    <StepBriefing
                        lines={[
                            { label: '節奏', text: '個人' },
                            { label: '做', text: '寫 2 題反思（卡在哪、走了哪幾把刀），整理 W3 學習紀錄' },
                        ]}
                    />
                    {/* 本週結束檢核 */}
                    <div className="bg-white border border-[var(--border)] rounded-[10px] overflow-hidden">
                        <div className="p-4 px-5 bg-[var(--paper-warm)] border-b border-[var(--border)] font-bold text-[13px]">
                            ✅ 本週結束，你應該要會
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-[1px] bg-[var(--border)]">
                            {[
                                '看懂 8 種爛題型，能說出每種問題在哪裡',
                                '用「大空遠難 → 小實近易」心法修改有病的題目',
                                '靠自己完成配對診斷與抽題練習（不靠 AI）',
                                '用 AI 協作練手一題（Part 3 · 別人的題目）',
                                '用 5W1H 切開自己 W2 的題目（Part 4）',
                                '透過 AI 協作 4 步，產出 W3 最終定案題目（Part 5）',
                            ].map((item, i) => (
                                <div key={i} className="p-4 px-6 bg-white flex items-start gap-3">
                                    <CheckCircle2 size={16} className="text-[var(--success)] mt-0.5 flex-shrink-0" />
                                    <span className="text-[13px] text-[var(--ink-mid)]">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 一鍵複製繳交 */}
                    <div className="bg-[#EFF6FF] border-2 border-[#1E40AF] rounded-[var(--radius-unified)] p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <ContentTypeChip type="交出" />
                            <span className="text-[10px] font-mono font-bold bg-[#1E40AF] text-white px-2 py-0.5 rounded-[3px] uppercase tracking-wider">📤 最後一步</span>
                            <span className="text-[14px] font-bold text-[#1E40AF]">複製 W3 學習紀錄 → 貼 Google Classroom</span>
                        </div>
                        <p className="text-[12px] text-[#1E3A8A] leading-relaxed mb-3">
                            包含：題目診斷練習／救活後題目／AI 輔助紀錄（如有）。W4 方法地圖課會接這份。
                        </p>
                        <ExportButton
                            weekLabel="W3 題目診斷"
                            fields={EXPORT_FIELDS}
                            buttonText="複製 W3 學習紀錄"
                        />
                    </div>

                    {/* 遊戲彩蛋 */}
                    <div className="bg-[var(--ink)] border-l-4 border-[var(--danger)] p-6 rounded-r-lg text-white shadow-xl">
                        <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                            <ShieldAlert className="text-[var(--danger)]" size={20} />
                            R.I.B. 單元挑戰：行動代號靶心
                        </h3>
                        <p className="text-[var(--ink-light)] text-sm mb-4">
                            鍛鍊從「現象」提煉出「研究問題」的精確度——你能從混亂的資訊中找到正確的研究問題嗎？
                        </p>
                        <Link to="/game/question-er" className="inline-flex items-center gap-2 bg-[var(--danger)] text-white px-4 py-2 rounded font-bold text-sm hover:opacity-90 transition-colors">
                            進入靶心 <ArrowRight size={14} />
                        </Link>
                    </div>

                    {/* 下週預告 */}
                    <div className="next-week-preview">
                        <div className="next-week-header">
                            <span className="next-week-badge">NEXT WEEK</span>
                            <h3 className="next-week-title">W4 預告</h3>
                        </div>
                        <div className="next-week-content">
                            <div className="next-week-col">
                                <div className="next-week-label">W4 主題</div>
                                <p className="next-week-text">方法地圖——認識五種研究方法（問卷／訪談／實驗／觀察／文獻分析），用兩層判斷的互動決策樹幫你的題目找出主方法。</p>
                            </div>
                            <div className="next-week-col">
                                <div className="next-week-label">你要準備</div>
                                <p className="next-week-text">帶著你的 <strong className="text-white">「W3 最終定案題目」</strong>——下週要為它選一個主要研究方法，並寫出選擇理由。</p>
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
                    <span className="hidden md:inline">研究方法與專題 / 研究規劃 / </span><span className="text-[var(--ink)] font-bold">題目健檢 W3</span>
                </div>
                <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
                    <span className="bg-[var(--paper-warm)] text-[var(--ink)] text-[10px] font-bold px-2 py-0.5 rounded-[2px] font-mono">100 MINS</span>
                    <ResetWeekButton weekPrefix="w3-" />
                    <button
                        onClick={() => setShowLessonMap(!showLessonMap)}
                        className="text-[11px] text-[var(--ink-light)] hover:text-[var(--accent)] transition-colors flex items-center gap-1 font-mono"
                    >
                        <Map size={12} /> <span className="hidden md:inline">{showLessonMap ? '收起流程' : '教師流程'}</span>
                    </button>
                </div>
            </div>

            {showLessonMap && (
                <div className="animate-in slide-in-from-top-4 duration-300">
                    <LessonMap data={W3Data} />
                </div>
            )}

            {/* PAGE HEADER — Hero Block（第一屏只留三句，spec §6-1）*/}
            <HeroBlock
                kicker="R.I.B. 調查檔案 · 研究方法與專題 · W3"
                question="我的問題被追問後，還站得住嗎？"
                title="題目健檢："
                accentTitle="碰壁→診斷→救活→定案"
                todo={[
                    { label: '今天做什麼', value: '把 W2 的研究問題搬上手術台，診斷、下刀、AI 協作定案。' },
                    { label: '為什麼做', value: '好題目不是想出來的、是磨出來的——太大太空太遠太難都做不出來。' },
                    { label: '今天交什麼', value: '個人＝W3 學習紀錄（含最終定案題目，帶去 W4）。' },
                ]}
                chain="W2 你寫出了研究問題草稿——但「感覺可以研究」跟「真的能做」是兩回事。W3 要把題目搬上手術台，大空遠難診斷、下刀、定案。"
                meta={[
                  { label: '第一節', value: '四類題目診斷（大空遠難）+ 四把刀改題練習' },
                  { label: '第二節', value: 'AI 協作工作坊——四步驟把自己題目修到可執行' },
                  { label: '課堂產出', value: '個人 W3 學習紀錄（含最終定案題目，帶去 W4）' },
                  { label: '前置要求', value: 'W2 研究問題草稿' },
                ]}
            />

            {/* 三模式切換 */}
            <ModeSwitch />

            {/* 自學補課路線 — 只在自學模式顯示（spec §5；W3 為 full 週）*/}
            {mode === 'self-study' && (
                <div className="my-5 rounded-[var(--radius-unified)] border-2 border-[#0284C7] bg-[#F0F9FF] p-4 md:p-5">
                    <p className="text-[14px] font-bold text-[#075985] mb-1">📖 自學補課路線 · W3 可「完整自學」</p>
                    <p className="text-[11.5px] text-[#0C4A6E] leading-[1.7] mb-3">
                        W3 核心是「個人診斷 → 對自己題目下刀 → AI 協作定案」，全是個人作業。Step 2 的「小組診斷」是個人診斷練習的平行難度軌，自學學生做個人練習即可等價。
                    </p>
                    <ol className="text-[12px] text-[#0C4A6E] leading-[1.85] list-none m-0 p-0 space-y-1">
                        <li><strong>① 先看：</strong>Step 1 四類診斷（大空遠難）＋ Step 3 萬用急救心法（大空遠難→小實近易 4 把刀）</li>
                        <li><strong>② 做：</strong>Step 2 四類配對＋抽題練習、Step 3 練手題下刀、Step 4 對自己 W2 題目下刀、Step 5 AI 共診定案</li>
                        <li><strong>③ 補紀錄：</strong>碰壁體驗／四類診斷反思／練手題／個人診斷練習／Part 4 自診＋5W1H＋修改版／Part 5 初稿＋AI 診斷／最終定案題目＋研究動機／AI-RED／兩題反思</li>
                        <li><strong>④ 交：</strong>整理 W3 學習紀錄，依老師指定方式上傳到 Google Classroom</li>
                        <li><strong>⑤ 本週可完整自學</strong>——Step 2 的「小組診斷」可用「個人練習」替代（同一個技能的平行難度軌）；若要完成 AI 協作段落，請使用你平常可登入的 AI 工具。</li>
                    </ol>
                    <div className="mt-3 pt-3 border-t border-[#0284C7]/30">
                        <p className="text-[12px] font-bold text-[#075985] mb-1">⛑️ 最低完成版（缺課學生：至少做到這些才算補到核心）</p>
                        <p className="text-[11.5px] text-[#0C4A6E] leading-[1.85] m-0">
                            ① 認識四類（大空遠難）、做完 8 題四類配對　② 學 4 把刀、練手題下刀一次　③ Step 4 對自己 W2 題目做診斷＋5W1H＋寫修改版　④ Step 5 寫出最終定案題目（帶去 W4，必填）＋研究動機　⑤ 填 AI-RED，整理 W3 紀錄上傳 Classroom
                        </p>
                    </div>
                </div>
            )}

            {/* 我的紀錄抽屜 — 兩模式都能開（spec §3 方案 A：總覽＋匯出，input 留 Step）*/}
            <RecordDrawer
                weekLabel="W3 題目健檢"
                fields={EXPORT_FIELDS}
                choices={choiceResults}
            />

            {/* 為什麼是這週 + 本週資訊 — 深度補充 */}

            <CourseArc items={W3Data.courseArc} />

            {/* 本節任務卡 — 學生一眼看懂「今天要做什麼」 */}
            <TaskCard
                weekNumber="W3"
                weekTitle={W3Data.title}
                duration={`${W3Data.duration} 分鐘 · ${W3Data.durationDesc}`}
                tasks={[
                    '練識別 — 看 8 個題目，診斷是大／空／遠／難哪一類（先不靠 AI）',
                    '學下刀 — 用「大→小／空→實／遠→近／難→易」四把刀練改題',
                    '自己題目定案 — 把 W2 的研究問題搬上手術台，AI 協作 4 步出最終題目',
                ]}
                exportReminder="到頁面上方「我的紀錄」整理本週紀錄，依老師指定方式上傳到 Google Classroom"
            />

            {/* STEP ENGINE */}
            <StepEngine
                steps={steps}
                prevWeek={{ label: '回 W2 問題意識', to: '/w2' }}
                nextWeek={{ label: '前往 W4 方法地圖', to: '/w4' }}
            flat
            />
        </div>
    );
};

export const Wizard = () => (
    <ModeProvider week="W3">
        <WizardContent />
    </ModeProvider>
);
