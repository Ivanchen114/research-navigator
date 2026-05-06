import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import CourseArc from '../components/ui/CourseArc';
import ThinkRecord, { readRecords, STORAGE_KEY } from '../components/ui/ThinkRecord';
import AIREDNarrative from '../components/ui/AIREDNarrative';
import ThinkChoice from '../components/ui/ThinkChoice';
import StepEngine from '../components/ui/StepEngine';
import HeroBlock from '../components/ui/HeroBlock';
import TaskCard from '../components/ui/TaskCard';
import ExportButton from '../components/ui/ExportButton';
import ResetWeekButton from '../components/ui/ResetWeekButton';
import CopyButton from '../components/ui/CopyButton';
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
import './Wizard.css';

/* ── 資料常數 ── */

const DISEASES = [
    { c: 'A', e: '🌫️', n: '抽象哲學病', s: '題目太玄、定義不清，無法測量' },
    { c: 'B', e: '🔮', n: '算命占卜病', s: '試圖預測未來還沒發生的事' },
    { c: 'C', e: '📚', n: '百科全書病', s: '題目範圍太大，網路查就有答案' },
    { c: 'D', e: '😤', n: '主觀偏見病', s: '題目帶有強烈預設立場，不客觀' },
    { c: 'E', e: '🥱', n: '是非廢話病', s: '答案只有「有/沒有」，顯而易見' },
    { c: 'F', e: '👻', n: '觀落陰病', s: '對象已過世、太大咖、接觸不到' },
    { c: 'G', e: '🚫', n: '方法無效病', s: '無法透過觀察、實驗、問卷驗證' },
    { c: 'H', e: '🎰', n: '變因失控病', s: '影響因素太多太雜，無法控制' },
];

const MANTRA_ROWS = [
    { f: '大', t: '小', d: '範圍縮小' },
    { f: '空', t: '實', d: '抽象具體化' },
    { f: '遠', t: '近', d: '對象可及化' },
    { f: '難', t: '易', d: '方法可行化' },
];

const MANTRA_MAP = [
    { id: 'A', m: '空 → 實' },
    { id: 'B', m: '遠 → 近（未來→現在）' },
    { id: 'C', m: '大 → 小' },
    { id: 'D', m: '難 → 易（主觀→客觀）' },
    { id: 'E', m: '空 → 實（有無→程度）' },
    { id: 'F', m: '遠 → 近（換找得到的）' },
    { id: 'G', m: '難 → 易（形→可觀察）' },
    { id: 'H', m: '大→小 + 難→易' },
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
    { id: 'a1', n: '1', t: '吃早餐對學測成績的影響', ans: 'H', explain: '影響學測成績的因素太多，無法只控制早餐這一個變因。' },
    { id: 'a2', n: '2', t: '探究幸福的真諦', ans: 'A', explain: '「幸福」太抽象，無法測量，研究無從下手。' },
    { id: 'a3', n: '3', t: '訪談愛因斯坦對相對論的看法', ans: 'F', explain: '對象已過世 140 多年，接觸不到。' },
    { id: 'a4', n: '4', t: '為什麼團隊合作比單打獨鬥更好？', ans: 'D', explain: '預定「合作更好」，帶有強烈主觀立場。' },
    { id: 'a5', n: '5', t: '高中生有沒有在使用手機？', ans: 'E', explain: '答案顯而易見，「有」，研究毫無意義。' },
    { id: 'a6', n: '6', t: '全球暖化的成因與防治', ans: 'C', explain: '範圍橫跨全球，資料網路查就有，不需要研究。' },
    { id: 'a7', n: '7', t: '上帝真的存在嗎？', ans: 'G', explain: '無法透過觀察、問卷、實驗任何方式驗證。' },
    { id: 'a8', n: '8', t: '2028 年奧運誰會拿金牌？', ans: 'B', explain: '預測未來尚未發生的事，無從驗證。' },
];

const DISEASE_LABELS = DISEASES.reduce((m, d) => { m[d.c] = { n: d.n, e: d.e }; return m; }, {});

const DRILL_GREEN = ['探究美的本質', '本校學生有沒有在用社群媒體？', '2030 年最熱門的工作', '全球暖化的成因與解決', '本校學生有沒有在段考前熬夜？', '本校學生有沒有在上課偷滑手機？', '為什麼我們班那麼吵？', '高中生為什麼很常遲到？', '高中福利社為什麼都很難吃？', '高中生是不是都會熬夜？'];
const DRILL_YELLOW = ['為什麼現代人越來越不快樂？', '人類存在的意義', '為什麼讀書比打電動更好？', '台灣的教育制度好不好？', '訪談賈伯斯的創新理念', '為什麼高中生上課都不專心？', '為什麼段考週壓力特別大？', '為什麼有些老師上課很無聊？', '為什麼班上同學不愛運動？', '為什麼社團活動常常辦不出成效？'];
const DRILL_RED = ['早餐對人生成就的影響', '靈魂到底存不存在？', '手機使用對學業成績的影響', '滑手機會不會讓人變笨？', '補習到底有沒有用？', '高中生談戀愛會影響成績？', 'IG / 抖音讓高中生焦慮嗎？', '為什麼有些同學天生較會讀書？', '訪談現任總統對教改看法', '為什麼有些人天生較聰明？'];

const COLLAB_STEPS_PRACTICE = [
    { n: '1', t: '你先診斷', d: '從 30 題中再選 1 題，先自己判斷是哪種病。', s: 'w3-step-human' },
    { n: '2', t: '問 AI 診斷', d: '把題目貼給 AI，問它「這個研究題目有什麼問題？」', s: 'w3-step-ai' },
    { n: '3', t: '比對差異', d: '你的診斷 vs AI 的診斷，一樣嗎？', s: 'w3-step-you' },
    { n: '4', t: '問 AI 給 3 個改法', d: '讓 AI 給你 3 個不同的修改版本。', s: 'w3-step-ai' },
    { n: '5', t: '你選一個', d: '選哪個理由必須是你的判斷。', s: 'w3-step-you', badge: 'AI 做不到' },
    { n: 'RED', t: '記錄 AI-RED', d: '填寫完整的 AI-RED 五欄：Ascribe / Inquire / Reference / Evaluate / Document。', s: 'w3-collab-step-num step-red' },
];

const buildPromptDiagnose = (topic) => `以下是一個高中生寫的研究題目：

「${topic || '【請貼上你選的爛題目】'}」

請幫我診斷這個題目有什麼問題？
1. 它可能犯了什麼錯誤？（例如：太抽象、範圍太大、無法驗證、帶有主觀立場等）
2. 具體說明為什麼這個題目做不下去。`;

const buildPromptFix3 = (topic) => `以下是一個有問題的高中生研究題目：

「${topic || '【請貼上你選的爛題目】'}」

請給我 3 個不同方向的修改版本，每個版本需要：
1. 說明你改了什麼、為什麼這樣改
2. 確保修改後的題目是高中生可以執行的（能用問卷、訪談、觀察等方法）
3. 題目要具體、可測量、範圍明確`;

/* ── Part 5：自己題目的 AI 協作三個 Prompt ── */
/* 診斷 Prompt 與學生課堂學到的 8 病症語言對齊（不要讓 AI 自創分類） */
const MY_DIAGNOSE_PROMPT = `我有一個研究題目想請你診斷。
我的題目是：【在這裡貼上你的題目初稿】

我的課堂用以下「8 種題目病症」來診斷：
A 抽象哲學病（題目太玄、定義不清、無法測量）
B 算命占卜病（試圖預測未來還沒發生的事）
C 百科全書病（題目範圍太大、網路查就有答案）
D 主觀偏見病（題目帶強烈預設立場、不客觀）
E 是非廢話病（答案只有「有／沒有」、顯而易見）
F 觀落陰病（對象已過世、太大咖、接觸不到）
G 方法無效病（無法觀察、實驗、問卷驗證）
H 變因失控病（影響因素太多太雜、無法控制）

請你只做診斷，不要幫我修改。請告訴我：
1. 我的題目最可能得了哪些病（可複選，請標 A-H 代碼 + 病名）
2. 核心問題一句話說明。
3. 如果 8 病都不完全貼合，才額外補充你看到的問題。

請全程用 A-H 病症代碼回答，不要另外自創分類。不要給我修改版本。`;

const MY_FIX3_PROMPT = `謝謝你的診斷。
現在請根據剛才的診斷，給我 3 個不同的修改方向。

要求：
1. 三個方向要明顯不同，不是同一個想法的微調
2. 每個方向說明：改了什麼、為什麼這樣改
3. 每個版本保持在 30 字以內，確保高中生做得到
4. 不要幫我選，讓我自己決定`;

const HINT_ITEMS = [
    { f: '大 → 小', t: '範圍太廣 → 縮到本校/年級/某班' },
    { f: '空 → 實', t: '太抽象 → 換成可測量指標' },
    { f: '遠 → 近', t: '找不到人 → 換成找得到的人' },
    { f: '難 → 易', t: '變因太多 → 改成短期指標/聚焦單一' },
];

const EXPORT_FIELDS = [
    { key: 'w3-obstacle-feel', label: '碰壁體驗', question: '看完兩題碰壁情境後，你覺得「題目生病」是什麼感覺？' },
    { key: 'w3-disease-quiz', label: '病症快問快答', question: '選一個你覺得最難判斷的病症，說說為什麼難。' },
    { key: 'w3-cut-practice-cut', label: '練手題：選用的處方', question: '對「探討高中生使用社群媒體的影響」你選哪一把刀？' },
    { key: 'w3-cut-practice', label: '練手題：你的改寫', question: '用你選的刀，下刀改寫一次' },
    { key: 'w3-drill-personal', label: '人腦練習（個人）', question: '自選一題爛題目，診斷是什麼病？用心法怎麼改？' },
    { key: 'w3-drill-group', label: '小組診斷', question: '小組選了哪一題？一起怎麼改的？' },
    { key: 'w3-ai-collab-compare', label: 'AI 協作練手：比對差異', question: '你的診斷 vs AI 的診斷，哪裡不同？' },
    { key: 'w3-ai-collab-choose', label: 'AI 協作練手：選擇理由', question: 'AI 給了 3 個改法，你選了哪個？為什麼？' },
    /* Part 4：回到自己的題目 */
    { key: 'w3-own-diagnose', label: 'Part 4 自己題目診斷', question: '把 W2 最終探究意圖當病人，你的診斷是？用什麼心法改？' },
    { key: 'w3-own-5w1h', label: 'Part 4 5W1H 規格化', question: '用 Who/Where/What/How/When 切開你的題目' },
    { key: 'w3-own-revised', label: 'Part 4 修改版題目', question: '用 5W1H 規格化後，你的修正版題目是？' },
    /* Part 5：AI 協作磨定案（4 步精簡版）*/
    { key: 'w3-p5-draft', label: 'Part 5 Step 1 初稿', question: '根據 Part 4，我修改後的題目初稿是？' },
    { key: 'w3-p5-diagnose-ai-record', label: 'Part 5 Step 2 AI 診斷 + 我的比對', question: 'AI 診斷出什麼？跟我 Part 4 的診斷哪裡不一樣？我更認同誰？' },
    { key: 'w3-p5-fix3-ai-record', label: 'Part 5 Step 3 AI 三方案記錄', question: 'AI 給的三個方向分別是？第一眼覺得哪個最有希望？' },
    { key: 'w3-final-topic', label: 'Part 5 Step 4 W3 最終定案題目', question: '我選哪個方向、最終定案題目、理由——這就是你這學期的研究起點' },
    { key: 'w3-motivation', label: 'Part 5 Step 4 研究動機（為什麼想研究這個）', question: '一句話講清楚——這個題目對誰有意義？為什麼你願意花一學期做？' },
    { key: 'w3-aired-record', label: 'AI-RED 敘事紀錄', question: '本週最重要的一次 AI 互動（A-I-R-E-D 五要素）' },
    { key: 'w3-reflect-misdiagnosis', label: '反思：最易誤診的病症', question: '8 病症裡，你最容易誤診的是哪一個？為什麼？' },
    { key: 'w3-reflect-cuts', label: '反思：你走過幾把刀', question: '你的題目走過哪幾把刀（縮小／具體化／可及化／可行化）？最後落點為什麼是這裡？' },
];

/* ── Part 5 Step 3：顯示 Part 4 Section A 的診斷作 reference，讓學生不用回頭翻 ── */
function P5CompareRef() {
    const [ownDiagnose, setOwnDiagnose] = useState('');

    const refresh = useCallback(() => {
        const records = readRecords();
        setOwnDiagnose((records['w3-own-diagnose'] || '').trim());
    }, []);

    useEffect(() => {
        refresh();
        window.addEventListener('focus', refresh);
        return () => window.removeEventListener('focus', refresh);
    }, [refresh]);

    if (!ownDiagnose) return null;

    return (
        <div className="mb-4 p-4 bg-[var(--paper-warm)] border border-[var(--border)] rounded-[var(--radius-unified)]">
            <div className="text-[11px] font-mono text-[var(--ink-light)] uppercase tracking-wider mb-2">📎 你 Part 4 的自診（不用再寫一次）</div>
            <p className="text-[13px] text-[var(--ink)] whitespace-pre-wrap leading-relaxed">{ownDiagnose}</p>
        </div>
    );
}

/* ── Part 5 Step 1：自動帶入 Part 4 修改版題目 ── */
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
            {ownRevised ? (
                <div className="mb-4 p-4 bg-[var(--accent-light)]/40 border border-[var(--accent)]/30 rounded-[var(--radius-unified)]">
                    <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="text-[11px] font-mono text-[var(--accent)] uppercase tracking-wider">📎 已帶入你 Part 4 的修改版題目</div>
                        <button
                            onClick={forceInject}
                            className="text-[11px] px-2 py-1 bg-white border border-[var(--accent)]/40 text-[var(--accent)] rounded hover:bg-[var(--accent)] hover:text-white transition-all font-bold flex-shrink-0"
                        >
                            重新帶入
                        </button>
                    </div>
                    <p className="text-[13px] text-[var(--ink)] font-medium leading-relaxed">{ownRevised}</p>
                </div>
            ) : (
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
                prompt={ownRevised ? '這是從 Part 4 帶過來的初稿——可保留、也可再精修一輪' : '把 Part 4 修改後的題目抄過來（或再精修一輪）'}
                placeholder="例：本校高一學生在段考前一週的夜間手機使用時數，與隔日上午第一節專注力自評之間的相關性。"
                scaffold={['我的題目初稿：']}
                rows={3}
            />
        </>
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
            alert('請先選一把刀！');
            return;
        }
        const records = readRecords();
        const myRewrite = records['w3-cut-practice']?.trim() || '';
        if (myRewrite.length < 15) {
            alert(`改寫至少要 15 字以上才能看示範～目前只有 ${myRewrite.length} 字，再想想看`);
            return;
        }
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
                <p className="text-[12.5px] font-bold text-[var(--ink)] mb-2">Step 1：你覺得這題該下哪一把刀？</p>
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
                <p className="text-[10.5px] italic text-[var(--ink-light)] mt-2">💡 也可以多選——複雜題目通常要組合下刀，但先選一把主刀</p>
            </div>

            <div className="mb-4">
                <p className="text-[12.5px] font-bold text-[var(--ink)] mb-2">Step 2：用你選的刀，下刀改寫</p>
                <ThinkRecord
                    dataKey="w3-cut-practice"
                    prompt="寫一個你覺得「能研究」的版本（至少 15 字）"
                    placeholder="例：本校高一學生睡前 30 分鐘 IG 使用時數對隔日精神的影響"
                    scaffold={['本校 / 本年級 ___ 學生', '在 ___ 時段／場景', '的 ___（具體可測指標）']}
                    rows={3}
                />
            </div>

            {!showSample ? (
                <button
                    type="button"
                    onClick={handleShowSample}
                    className="w-full bg-[var(--accent)] hover:opacity-90 text-white font-bold py-2.5 rounded-[6px] text-[13px] transition-opacity"
                >
                    ✅ 寫完了！看示範對照
                </button>
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

export const Wizard = () => {
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
                        <div className="w3-section-head"><h2>碰壁體驗</h2><div className="line"></div><div className="mono">PHASE 0</div></div>
                        <p className="w3-section-desc">在進入診斷之前，先透過兩組情境感受一下：為什麼有些題目看起來沒問題，實作起來卻會處處碰壁？</p>
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
                                        {obstacleStates.a ? '⚠️ 現實考驗：無法執行' : '🔍 這是好題目嗎？試試看第一步...'}
                                    </button>
                                    {obstacleStates.a && (
                                        <div className="mt-4 p-4 bg-[var(--danger-light)] rounded-[6px] text-[var(--danger)] text-[12px] leading-relaxed">
                                            <strong>卡住了吧？</strong> 「專注程度」要怎麼問？叫同學自己填，他們會說實話嗎？你要上課盯著別人記次數嗎？你自己也要上課耶！
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
                                        {obstacleStates.b ? '⚠️ 現實考驗：無法驗證' : '🔍 這是好題目嗎？試試看第一步...'}
                                    </button>
                                    {obstacleStates.b && (
                                        <div className="mt-4 p-4 bg-[var(--danger-light)] rounded-[6px] text-[var(--danger)] text-[12px] leading-relaxed">
                                            <strong>發現了嗎？</strong> 你怎麼知道朋友的演算法長什麼樣子？叫他截圖？要截幾張？兩個人的推薦頁要怎麼比相似度？越說越複雜了。
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <ThinkRecord
                            dataKey="w3-obstacle-feel"
                            prompt="看完兩題碰壁情境後，你覺得「題目生病」是什麼感覺？"
                            scaffold={['我覺得最卡的地方是…', '看起來合理但其實…', '如果真的要做，第一步就會…']}
                            rows={3}
                        />
                    </div>

                    {/* 8 種病症 */}
                    <div>
                        <div className="w3-section-head"><h2>8 種題目病症</h2><div className="line"></div><div className="mono">CONCEPT</div></div>
                        <p className="w3-section-desc">掌握 8 種常見的「題目病症」，學會看出題目哪裡有問題。</p>
                        <div className="w3-disease-grid">
                            {DISEASES.map(d => (
                                <div className="w3-disease-card" key={d.c}>
                                    <div className="w3-disease-code">{d.c} {d.e}</div>
                                    <div className="w3-disease-name">{d.n}</div>
                                    <div className="w3-disease-symptom">{d.s}</div>
                                </div>
                            ))}
                        </div>

                        <ThinkChoice
                            dataKey="w3-tc1"
                            prompt="下列哪個題目是「觀落陰病」？"
                            options={[
                                { label: 'A', text: '2030 年最熱門的工作是什麼？' },
                                { label: 'B', text: '訪談愛因斯坦對相對論的看法' },
                                { label: 'C', text: '高中生有沒有在使用手機？' },
                                { label: 'D', text: '探究幸福的真諦' },
                            ]}
                            answer="B"
                            feedback="觀落陰病是「對象已過世、太大咖、接觸不到」——愛因斯坦已過世 70 多年，當然訪談不到！"
                            onAnswer={(sel, ok) => trackChoice('下列哪個題目是「觀落陰病」？', sel, ok)}
                        />
                    </div>

                    {/* ➡️ 轉場：進 Step 2 急診室 */}
                    <div className="bg-[var(--paper-warm)] border-l-3 border-[var(--gold)] rounded-r-[6px] p-3 mt-4 max-w-[760px]">
                        <p className="text-[12px] text-[var(--ink-mid)] leading-relaxed">
                            💡 看完碰壁體驗——「題目會生病」這個感覺有了。下個 Step 進<strong className="text-[var(--ink)]">急診室</strong>，認識 8 種題目病症 + 練習配對診斷。
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
                    {/* Part 1: 8 個病人 — 互動配對 */}
                    <div className="w3-task-block">
                        <div className="w3-task-hd">
                            <span className="w3-task-badge">PART 1</span>
                            <span className="w3-task-title">🏥 急診室大作戰：8 個病人</span>
                        </div>
                        <div className="w3-task-body">
                            <div className="w3-notice w3-notice-gold" style={{ marginBottom: '14px' }}>
                                每個病人得了哪種病？選出你的診斷！選完才會揭曉答案。
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
                                    const correctLabel = DISEASE_LABELS[p.ans];

                                    return (
                                        <div className="w3-patient-card" key={p.id}>
                                            <div className="w3-patient-hd">
                                                <span className="w3-patient-num">病人 #{p.n}</span>
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
                                                        {DISEASES.map(d => (
                                                            <option key={d.c} value={d.c}>
                                                                {d.c}. {d.e} {d.n}
                                                            </option>
                                                        ))}
                                                    </select>
                                                ) : (
                                                    <div className={`flex items-center gap-2 px-3 py-2 rounded-[var(--radius-unified)] border text-[13px] font-bold ${isCorrect ? 'bg-[var(--success-light)] border-[var(--success)] text-[var(--success)]' : 'bg-[var(--danger-light)] border-[var(--danger)] text-[var(--danger)]'}`}>
                                                        {isCorrect ? '✓' : '✗'} 你的診斷：{picked}. {DISEASE_LABELS[picked].e} {DISEASE_LABELS[picked].n}
                                                    </div>
                                                )}
                                            </div>

                                            {/* 答案揭曉 */}
                                            {answered && (
                                                <div className={`px-3 pb-3 text-[12px] leading-relaxed ${isCorrect ? 'text-[var(--success)]' : 'text-[var(--ink-mid)]'}`}>
                                                    <div className="p-3 rounded-[6px] bg-[var(--success-light)] border border-[var(--success)]/15">
                                                        <strong>{p.ans} {correctLabel.e} {correctLabel.n}</strong> — {p.explain}
                                                    </div>
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
                                        {correctCount === 8 ? '完美全對！你已經是合格的題目醫生了。' :
                                         correctCount >= 6 ? '不錯！大部分都診斷正確，繼續用心法加深印象。' :
                                         '沒關係，這些病症本來就容易搞混。回去看看萬用心法，下次更準！'}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Part 2: 人的診斷練習 — 抽題機 */}
                    <div className="w3-task-block">
                        <div className="w3-task-hd">
                            <span className="w3-task-badge">PART 2</span>
                            <span className="w3-task-title">💪 人的診斷練習（不准用 AI！）</span>
                        </div>
                        <div className="w3-task-body">
                            <div className="w3-notice w3-notice-success" style={{ marginBottom: '24px' }}>
                                先知道自己有多少斤兩，再駕馭 AI。第一節課不能開 AI，自己診斷、自己用心法改。
                            </div>

                            {/* ── 個人練習：抽題機 ── */}
                            <div className="text-[12px] font-bold font-mono text-[var(--ink-light)] mb-2 tracking-wider">SOLO · 個人練習</div>

                            {/* 難度選擇 */}
                            {!drillLocked && (
                                <div className="flex gap-2 mb-4">
                                    {[
                                        { key: 'green', label: '🟢 綠卡 新手', color: 'var(--success)' },
                                        { key: 'yellow', label: '🟡 黃卡 進階', color: 'var(--gold)' },
                                        { key: 'red', label: '🔴 紅卡 魔王', color: 'var(--danger)' },
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
                            <div className="text-[12px] font-bold font-mono text-[var(--ink-light)] mb-2 mt-8 tracking-wider">TEAM · 小組練習（黃卡＋紅卡）</div>

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
                    <ThinkRecord
                        dataKey="w3-disease-quiz"
                        prompt="選一個你覺得最難判斷的病症，說說為什麼難？"
                        scaffold={['我覺得最容易搞混的是…和…', '因為這兩種病的差別在於…', '判斷的關鍵是…']}
                        rows={3}
                    />

                    {/* ➡️ 轉場：進 Step 3 學下刀 */}
                    <div className="bg-[var(--paper-warm)] border-l-3 border-[var(--gold)] rounded-r-[6px] p-3 mt-4 max-w-[760px]">
                        <p className="text-[12px] text-[var(--ink-mid)] leading-relaxed">
                            💡 8 病症都認得了——下個 Step 進<strong className="text-[var(--ink)]">下刀工坊</strong>，學 4 把刀心法、看示範、自己對範例題下刀練手。
                        </p>
                    </div>
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
                        8 病症都認得了——下一步學「<strong className="text-[var(--ink)]">下刀</strong>」：用 4 把刀的心法把爛題目改成可研究版本。看示範→自己練手→Step 4 對自己題目下刀。
                    </p>

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
                                <div style={{ fontSize: '10px', fontFamily: 'DM Mono', color: 'var(--ink-light)', marginTop: '16px', marginBottom: '8px' }}>8 種病對應心法</div>
                                <div className="w3-mantra-map">
                                    {MANTRA_MAP.map(item => (
                                        <div className="w3-mantra-map-item" key={item.id}>
                                            <strong>{item.id} 病對應</strong>
                                            {item.m}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="w3-notice w3-notice-gold">
                            💡 如果你的題目太大、太空、太遠、太難——回頭用萬用心法修！
                        </div>

                        {/* 🎮 遊戲暱稱對映卡：正式名為主、遊戲名降為副文字（避免高一搞不清誰是「課本說法」） */}
                        <div className="bg-[var(--paper-warm)] border border-[var(--border)] rounded-[var(--radius-unified)] p-4 mt-4 max-w-[760px]">
                            <p className="text-[12.5px] font-bold text-[var(--ink)] mb-2.5 flex items-center gap-1.5">
                                <span>🎮</span>
                                <span>進到「靶心」遊戲後，這四把處方會以「醫療暱稱」呈現</span>
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
                                💡 <strong className="text-[var(--ink)]">課本／作業／老師講的</strong>都用粗體那個正式名；括號裡的醫療暱稱只在遊戲裡看得到。
                            </p>
                        </div>

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

                    {/* ➡️ 轉場：進 Step 4 對自己題目下刀 */}
                    <div className="bg-[var(--paper-warm)] border-l-3 border-[var(--gold)] rounded-r-[6px] p-3 mt-4 max-w-[760px]">
                        <p className="text-[12px] text-[var(--ink-mid)] leading-relaxed">
                            💡 看完心法、練完手感——下個 Step 換真槍實彈：<strong className="text-[var(--ink)]">對自己題目下刀</strong>。
                        </p>
                    </div>
                </div>
            ),
        },

        /* ──────────────────────────────────────
         * STEP 4: 對自己題目下刀 — 自診 + 5W1H 規格化（原 Part 4）
         * ────────────────────────────────────── */
        {
            title: '對自己題目下刀',
            icon: '⚔️',
            content: (
                <div className="space-y-8 prose-zh">
                    {/* 過渡說明 */}
                    <div className="bg-[var(--ink)] text-white rounded-[var(--radius-unified)] p-6">
                        <div className="text-[11px] font-mono text-[var(--accent-light)] tracking-wider mb-2">CHECKPOINT · 練兵結束</div>
                        <h2 className="text-[20px] font-bold mb-2">現在要打魔王了</h2>
                        <p className="text-[14px] text-white/85 leading-relaxed">
                            魔王是你 W2 寫的<strong>「最終探究意圖」</strong>。前面 Part 1/2/3 練的是診斷能力，現在把這把刀拿來切自己的題目。<br />
                            <span className="text-[var(--gold)] font-bold">⚠️ 重要：W2 寫的是「意圖句」（「我想探究 A 如何影響 B」），還不算研究題目。</span>第一步先把意圖句改寫成題目句型（例：「A 如何影響 B？」或「A 與 B 的相關性研究」）。第二步再用 A–H 八病症診斷。第三步用 5W1H 切開看清楚。
                            <strong className="text-[var(--gold)]"> 不准用 AI，先自己動手 10 分鐘。</strong>
                        </p>
                    </div>

                    {/* W2 題目帶入卡 */}
                    {w2Intent ? (
                        <div className="border border-[var(--accent)]/30 bg-[var(--accent-light)]/20 rounded-[var(--radius-unified)] p-5">
                            <div className="text-[11px] font-mono text-[var(--accent)] uppercase tracking-wider mb-2">📎 你上週的 W2 最終探究意圖（意圖句，尚未成題）</div>
                            <p className="text-[14px] text-[var(--ink)] font-medium leading-relaxed">{w2Intent}</p>
                            <p className="text-[11px] text-[var(--ink-light)] mt-2 leading-relaxed">
                                💡 下方第一格「診斷」，請先把這段意圖改寫成題目句型，再開始診斷。
                            </p>
                        </div>
                    ) : (
                        <BackfillField
                            dataKey="w2-final-intent"
                            label="⚠️ 沒偵測到你 W2 的最終探究意圖——把你上週寫的「探究意圖句」貼這裡，下方診斷會立即接通。"
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
                            <ThinkRecord
                                dataKey="w3-own-diagnose"
                                prompt="先把意圖句改寫成題目句，再診斷得了什麼病？用心法怎麼改？"
                                scaffold={[
                                    'Step 1 — 意圖 → 題目改寫：把「我想探究…」改寫成題目句（例：「A 如何影響 B？」）——',
                                    'Step 2 — 八病症診斷：我覺得它得了 ___ 病（A–H 可複選），因為：',
                                    'Step 3 — 選心法：大→小／空→實／遠→近／難→易（可複選）——',
                                    'Step 4 — 初步想法：',
                                ]}
                                rows={7}
                            />
                        </div>
                    </div>

                    {/* Section B：5W1H 規格化 */}
                    <div className="bg-white border border-[var(--border)] rounded-[var(--radius-unified)] overflow-hidden">
                        <div className="px-5 py-3 bg-[var(--paper-warm)] border-b border-[var(--border)] flex items-center gap-2">
                            <span className="text-[11px] font-mono font-bold text-[var(--ink-mid)]">5W1H 規格化</span>
                            <span className="ml-auto text-[10px] font-mono text-[var(--danger)]">至少填 4 格（Who/Where/What/How 必備）</span>
                        </div>
                        <div className="p-5 space-y-4">
                            <ThinkRecord
                                dataKey="w3-own-5w1h"
                                prompt="用 5W1H 切開你的題目（填空版）"
                                scaffold={[
                                    'Who（對象）：',
                                    'Where（場域）：',
                                    'What（變項 / 可測量的指標）：',
                                    'How（方法 · 問卷 / 訪談 / 觀察 / 實驗 / 文獻）：',
                                    'When（時間或情境，選填）：',
                                ]}
                                rows={7}
                            />

                            {/* 出院標準 checklist */}
                            <div className="bg-[var(--accent-light)]/30 border border-[var(--accent)]/20 rounded-[8px] p-4">
                                <div className="text-[12px] font-bold text-[var(--ink)] mb-2">🏥 急救出院標準（自己勾）</div>
                                <ul className="text-[12px] text-[var(--ink-mid)] space-y-1 leading-relaxed">
                                    <li>☐ 5W1H 至少能寫出 4 格（Who/Where/What/How 必備）</li>
                                    <li>☐ 符合「小、實、近、易」至少 2 項</li>
                                    <li>☐ 我能在兩週內蒐集到資料（問卷／訪談／觀察／文獻／實驗其一）</li>
                                </ul>
                                <p className="text-[11px] text-[var(--ink-light)] mt-2">三項都能勾 → 進入 Part 5 打磨定案。</p>
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
                                prompt="根據診斷 + 5W1H，你修正後的題目是？（這題會帶到 Part 5 Step 1）"
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
                    <div className="bg-[var(--paper-warm)] border border-[var(--border)] rounded-[var(--radius-unified)] p-5">
                        <div className="text-[11px] font-mono text-[var(--ink-mid)] tracking-wider mb-1">FINAL BOSS · AI 協作 4 步驟</div>
                        <h2 className="text-[18px] font-bold text-[var(--ink)] mb-2">把你的題目從初稿磨成定案</h2>
                        <p className="text-[13px] text-[var(--ink-mid)] leading-relaxed">
                            重點不是 AI 改得多好，而是<strong>你怎麼選、為什麼選</strong>。Step 1 先自己寫，再開 AI。
                            給自己 12 分鐘做到 Step 4——那個最後定案框就是你這學期的研究起點。
                        </p>
                    </div>

                    {/* 📖 示範流程預覽（學生第一次自主跑 AI 協作前先看一遍完整案例） */}
                    <details className="bg-white border-2 border-[var(--accent)] rounded-[var(--radius-unified)] overflow-hidden">
                        <summary className="px-5 py-3 bg-[var(--accent-light)]/30 cursor-pointer flex items-center justify-between">
                            <span className="font-bold text-[13px] text-[var(--accent)]">📖 先看一個完整範例（小華的故事）—— 第一次跑強烈建議展開</span>
                            <span className="text-[10px] font-mono text-[var(--ink-light)]">▼</span>
                        </summary>
                        <div className="p-5 space-y-4 text-[12.5px] leading-[1.85]">
                            <div>
                                <div className="text-[11px] font-mono font-bold text-[var(--ink-light)] uppercase mb-1">小華的初稿（Step 1）</div>
                                <div className="bg-[var(--paper-warm)] border-l-4 border-[var(--ink-light)] p-3 rounded-r-[6px] text-[var(--ink)]">
                                    「本校高一學生段考前的手機使用情形」
                                </div>
                            </div>

                            <div>
                                <div className="text-[11px] font-mono font-bold text-[var(--ink-light)] uppercase mb-1">小華自己診斷（開 AI 之前）</div>
                                <div className="bg-[var(--paper-warm)] border-l-4 border-[var(--ink-light)] p-3 rounded-r-[6px]">
                                    「我覺得是 <strong>C 型（範圍太大）</strong>，因為『使用情形』太空泛，沒講要測什麼。」
                                </div>
                            </div>

                            <div>
                                <div className="text-[11px] font-mono font-bold text-[var(--accent)] uppercase mb-1">AI 診斷回應（Step 2 開 AI 後）</div>
                                <div className="bg-[var(--accent-light)]/20 border-l-4 border-[var(--accent)] p-3 rounded-r-[6px]">
                                    「主要是 <strong>C 型（範圍太大）+ B 型（雙重題）</strong>。<br />
                                    C：『使用情形』未定義要測時數、頻率、還是內容。<br />
                                    B：『段考前』+『手機使用』其實是兩個變項，沒講要看哪個影響哪個。」
                                </div>
                            </div>

                            <div>
                                <div className="text-[11px] font-mono font-bold text-[#D97706] uppercase mb-1">小華比對差異（Step 2 同框）</div>
                                <div className="bg-[#FEF3C7] border-l-4 border-[#D97706] p-3 rounded-r-[6px]">
                                    「我只看到 C，沒看到 B。AI 抓到我把『時間點』和『行為』混在一起。<strong>這個盲點我自己看不到。</strong>」
                                </div>
                            </div>

                            <div>
                                <div className="text-[11px] font-mono font-bold text-[var(--accent)] uppercase mb-1">AI 三方案（Step 3）</div>
                                <div className="bg-[var(--accent-light)]/20 border-l-4 border-[var(--accent)] p-3 rounded-r-[6px] space-y-1">
                                    <p>方案 A：本校高一段考前一週的<strong>夜間滑手機時數</strong>與<strong>翌日專注力自評</strong>之相關性</p>
                                    <p>方案 B：本校高一段考前後三週的<strong>每日手機使用時數變化</strong></p>
                                    <p>方案 C：本校高一<strong>段考週滑社群媒體頻率</strong>對<strong>讀書時間</strong>的影響</p>
                                </div>
                            </div>

                            <div>
                                <div className="text-[11px] font-mono font-bold text-[#10B981] uppercase mb-1">小華最終定案（Step 4）</div>
                                <div className="bg-[#ECFDF5] border-l-4 border-[#10B981] p-3 rounded-r-[6px]">
                                    「我選 <strong>方案 A</strong>。最終題目就用 AI 給的方案 A：『本校高一段考前一週的夜間滑手機時數與翌日專注力自評之相關性』。<br />
                                    理由：<br />
                                    ① 我真的好奇『睡前滑手機 vs 隔日專注力』這條因果鏈<br />
                                    ② 兩個變項都能用問卷量化（時數 + 1-5 分自評）<br />
                                    ③ B 範圍太大、C 我不太關心社群媒體本身。」
                                </div>
                            </div>

                            <div className="bg-[var(--ink)]/5 border border-[var(--ink)]/10 rounded-[6px] p-3">
                                <p className="font-bold text-[12px] text-[var(--ink)] mb-1">🎓 小華示範告訴你三件事：</p>
                                <ol className="list-decimal pl-5 text-[12px] text-[var(--ink-mid)] leading-[1.85] space-y-0.5">
                                    <li><strong>自己診斷不要怕錯</strong>——小華只看到 C 沒看到 B，這正常，AI 才能幫上忙</li>
                                    <li><strong>比對差異是金礦</strong>——「AI 看到、我沒看到」的東西是你的學習點，要寫下來</li>
                                    <li><strong>選擇要有研究理由</strong>——不是「比較好聽」，是「我真的想知道、做得到、能測量」</li>
                                </ol>
                            </div>
                        </div>
                    </details>

                    {/* Step 1 — 自己先寫初稿 */}
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

                    {/* Step 2 — 問 AI 診斷 + 你的比對判斷（合併原 2+3） */}
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
                                reason="只問診斷、不問改法——Prompt 已鎖定用 A-H 8 病症語言，讓 AI 跟你講同一種話。拿到 AI 診斷後，下方記錄欄要同時寫『AI 診斷 + 你 Part 4 自診的差異判斷』，這是這一步的核心。"
                                prompt={MY_DIAGNOSE_PROMPT}
                                recordKey="w3-p5-diagnose-ai-record"
                                recordPrompt="AI 診斷出哪幾種病？跟你 Part 4 的自診差在哪？你更認同誰？"
                                recordPlaceholder={'AI 診斷：___ 病（可複選，標代碼 A-H）\n我 Part 4 自診：___ 病\n一致／不一致：\n我更認同 ___ 的版本，因為 ___'}
                                forceAI
                            />
                        </div>
                    </section>

                    {/* Step 3 — 問 AI 給 3 個修改方向 */}
                    <section className="bg-white border border-[var(--border)] rounded-[var(--radius-unified)] overflow-hidden">
                        <div className="px-5 py-3 bg-[var(--paper-warm)] border-b border-[var(--border)] flex items-center gap-2">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--ink)] text-white flex items-center justify-center text-[12px] font-bold font-mono">3</span>
                            <span className="font-bold text-[13px]">問 AI 給 3 個修改方向</span>
                            <span className="ml-auto text-[10px] font-mono text-[var(--ink-light)]">AI 做</span>
                        </div>
                        <div className="p-5">
                            <AIAssistToggle
                                id="w3-p5-fix3"
                                title="讓 AI 發散 3 個不同的修改方向"
                                reason="要求 AI 方向明顯不同（不是同一個想法的微調）。你要當裁判挑選。"
                                prompt={MY_FIX3_PROMPT}
                                recordKey="w3-p5-fix3-ai-record"
                                recordPrompt="AI 給的三個方向分別是？你第一眼覺得哪個最有希望？"
                                recordPlaceholder={'方向 A：___\n方向 B：___\n方向 C：___\n第一眼覺得 ___ 最有希望，因為 ___'}
                                forceAI
                            />
                        </div>
                    </section>

                    {/* Step 4 · 最終定案（合併原 5+7：選方向＝寫定案） */}
                    <section className="bg-[var(--accent-light)]/30 border-2 border-[var(--accent)] rounded-[var(--radius-unified)] overflow-hidden">
                        <div className="px-5 py-3 bg-[var(--accent)] text-white flex items-center gap-2">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-white text-[var(--accent)] flex items-center justify-center text-[12px] font-bold font-mono">4</span>
                            <span className="font-bold text-[13px]">🎯 我選一個 → 寫成最終定案題目（AI 做不到的！）</span>
                            <span className="ml-auto text-[10px] font-mono font-bold text-white">不能跳過</span>
                        </div>
                        <div className="p-5 space-y-3">
                            <p className="text-[12px] text-[var(--ink-mid)] leading-relaxed">
                                從 Step 3 的 AI 三方向、自己 Part 4 的版本、或綜合改寫中，<strong>用你的判斷</strong>做最終決定。
                                這題就是你這學期的研究起點，會帶到 W4 為它選研究方法。
                            </p>
                            <ThinkRecord
                                dataKey="w3-final-topic"
                                prompt="🎯 我的 W3 最終定案題目"
                                placeholder="把你決定的題目完整寫出來。會帶到 W4 方法地圖。"
                                scaffold={[
                                    '我選：☐ AI 方向 A  ☐ AI 方向 B  ☐ AI 方向 C  ☐ 我 Part 4 的版本最準  ☐ 綜合改成自己的',
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
                                <p className="text-[12.5px] font-bold text-[#7a6020] mb-1">🔥 趁熱寫——為什麼想研究這個</p>
                                <p className="text-[11.5px] text-[#7a6020] leading-relaxed">
                                    題目剛訂下來、你的腦袋最熱——這時候寫研究動機最真誠。<strong>一句話</strong>講清楚就好。會帶去 W6 海報直接抄上去，下半學期擋風遮雨的就是這句話。
                                </p>
                            </div>
                            <ThinkRecord
                                dataKey="w3-motivation"
                                prompt="🔥 一句話：為什麼這個題目值得我花一學期研究？"
                                placeholder="例：我自己段考前每次熬夜滑手機隔天念書效率超差——想證明這個感覺是真的，幫之後想戒手機的同學多一份具體數據。"
                                scaffold={['我想研究這個是因為 ___', '這個答案對 ___（誰）有意義']}
                                rows={3}
                            />

                            <div className="bg-white border border-[var(--accent)]/20 rounded-[6px] p-3 text-[11px] text-[var(--ink-mid)] leading-relaxed">
                                <strong className="text-[var(--danger)]">出院檢核：</strong>
                                5W1H 至少 4 格 ✓　小實近易 ≥ 2 項 ✓　兩週內能蒐集到資料 ✓　動機寫了 ✓　—— 四項都打勾才算「急救成功」。
                            </div>
                        </div>
                    </section>

                    {/* 本週 AI 互動總結（Part 3 + Part 5） */}
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

                    {/* 反思 — 兩題最關鍵：誤診觀察 + 修法路徑回顧 */}
                    <div className="space-y-4">
                        <ThinkRecord
                            dataKey="w3-reflect-misdiagnosis"
                            prompt="✍️ 反思 1：8 病症裡，你最容易誤診的是哪一個？為什麼那個容易跟其他病搞混？"
                            placeholder="例：我最容易誤診『大』和『空』。題目寫『高中生壓力』我以為只是太大，但其實是『壓力』本身太抽象（空）——分不清關鍵在『誰』太廣還是『測什麼』沒講清楚。"
                            scaffold={['我最容易誤診 ___', '它容易跟 ___ 搞混', '差別其實在…']}
                            rows={4}
                        />

                        <ThinkRecord
                            dataKey="w3-reflect-cuts"
                            prompt="✍️ 反思 2：你的題目走過哪幾把刀（縮小／具體化／可及化／可行化）？最後落點為什麼是這裡？"
                            placeholder="例：我走了縮小（從『高中生』→『松山高一』）+ 具體化（從『壓力』→『段考前手機使用時數』）。沒動可及化（我自己就是高一、樣本拿得到）跟可行化（兩週內能做）。落這裡是因為再切下去就會失真——『松山高一段考前手機時數』剛好可以兩週內問到。"
                            scaffold={['我走了 ___ 把刀（縮小／具體化／可及化／可行化）', '沒動 ___ 是因為…', '最後落這裡是因為…']}
                            rows={5}
                        />
                    </div>

                    {/* 一鍵複製 */}
                    <ExportButton
                        weekLabel="W3 題目健檢"
                        fields={EXPORT_FIELDS}
                        choices={choiceResults}
                    />

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
                                <p className="next-week-text">帶著你 <strong className="text-white">Part 5 Step 7 的「W3 最終定案題目」</strong>——下週要為它選一個主要方法 + 寫出選擇理由。</p>
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
                        <Map size={12} /> <span className="hidden md:inline">{showLessonMap ? 'Hide Plan' : 'Instructor View'}</span>
                    </button>
                    <span className="hidden md:inline-block bg-[var(--ink)] text-white text-[10px] font-bold px-2 py-0.5 rounded-[2px] font-mono">AI-RED · D</span>
                </div>
            </div>

            {showLessonMap && (
                <div className="animate-in slide-in-from-top-4 duration-300">
                    <LessonMap data={W3Data} />
                </div>
            )}

            {/* PAGE HEADER — Hero Block */}
            <HeroBlock
                kicker="R.I.B. 調查檔案 · 研究方法與專題 · W3"
                title="題目健檢："
                accentTitle="碰壁→診斷→救活→定案"
                subtitle="好的研究不是「想出來」的，是「磨出來」的。今天先碰壁、學診斷 8 種題目病症、再用 AI 協作練手。最後回到你自己的 W2 題目，用 5W1H 切開、AI 協作 4 步，產出你這學期的研究起點。"
                chain="上週你列了一堆『我想知道』——但有些根本沒辦法研究（太大、太私、要等十年）。這週做的事很簡單：篩。"
                meta={[
                    { label: '本週任務', value: '8 病症 + 練手 + 自己題目定案' },
                    { label: '時長', value: '100 MINS' },
                    { label: '課堂產出', value: 'W3 最終定案題目 + AI-RED' },
                    { label: '下週預告', value: 'Gallery Walk 題目博覽會' },
                ]}
            />
            <CourseArc items={W3Data.courseArc} />

            {/* 本節任務卡 — 學生一眼看懂「今天要做什麼」 */}
            <TaskCard
                weekNumber="W3"
                weekTitle={W3Data.title}
                duration={`${W3Data.duration} 分鐘 · ${W3Data.durationDesc}`}
                tasks={[
                    '練識別 — 看 8 個爛題目，自己診斷是哪一種「題目病症」（先不靠 AI）',
                    '學下刀 — 用「大→小／空→實／遠→近／難→易」四把刀練改題',
                    '自己題目定案 — 把 W2 的探究意圖搬上手術台，AI 協作 4 步出最終題目',
                ]}
                exportReminder="用本週紀錄匯出按鈕 → 把 W3 全部紀錄 + AI-RED 對話貼到 Google 文件繳交"
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
