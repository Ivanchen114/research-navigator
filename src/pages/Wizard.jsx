import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import CourseArc from '../components/ui/CourseArc';
import ThinkRecord, { readRecords, STORAGE_KEY } from '../components/ui/ThinkRecord';
import AIREDNarrative from '../components/ui/AIREDNarrative';
import ThinkChoice from '../components/ui/ThinkChoice';
import StepEngine from '../components/ui/StepEngine';
import HeroBlock from '../components/ui/HeroBlock';
import ExportButton from '../components/ui/ExportButton';
import ResetWeekButton from '../components/ui/ResetWeekButton';
import CopyButton from '../components/ui/CopyButton';
import AIAssistToggle from '../components/ui/AIAssistToggle';
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

const MY_OPTIMIZE_PROMPT = `我的研究題目初稿是：【請貼上你剛剛選擇的方案】

請幫我優化成更專業的版本：
1. 加上學術關鍵字（如：相關性、差異分析、影響、探討）
2. 讓 Who/What 更具體
3. 保持在 30 字以內，確保高中生做得到

請給我 3 個優化版本。`;

const HINT_ITEMS = [
    { f: '大 → 小', t: '範圍太廣 → 縮到本校/年級/某班' },
    { f: '空 → 實', t: '太抽象 → 換成可測量指標' },
    { f: '遠 → 近', t: '找不到人 → 換成找得到的人' },
    { f: '難 → 易', t: '變因太多 → 改成短期指標/聚焦單一' },
];

const EXPORT_FIELDS = [
    { key: 'w3-obstacle-feel', label: '碰壁體驗', question: '看完兩題碰壁情境後，你覺得「題目生病」是什麼感覺？' },
    { key: 'w3-disease-quiz', label: '病症快問快答', question: '選一個你覺得最難判斷的病症，說說為什麼難。' },
    { key: 'w3-drill-personal', label: '人腦練習（個人）', question: '自選一題爛題目，診斷是什麼病？用心法怎麼改？' },
    { key: 'w3-drill-group', label: '小組診斷', question: '小組選了哪一題？一起怎麼改的？' },
    { key: 'w3-ai-collab-compare', label: 'AI 協作練手：比對差異', question: '你的診斷 vs AI 的診斷，哪裡不同？' },
    { key: 'w3-ai-collab-choose', label: 'AI 協作練手：選擇理由', question: 'AI 給了 3 個改法，你選了哪個？為什麼？' },
    /* Part 4：回到自己的題目 */
    { key: 'w3-own-diagnose', label: 'Part 4 自己題目診斷', question: '把 W2 最終探究意圖當病人，你的診斷是？用什麼心法改？' },
    { key: 'w3-own-5w1h', label: 'Part 4 5W1H 規格化', question: '用 Who/Where/What/How/When 切開你的題目' },
    { key: 'w3-own-revised', label: 'Part 4 修改版題目', question: '用 5W1H 規格化後，你的修正版題目是？' },
    /* Part 5：AI 協作磨定案 */
    { key: 'w3-p5-draft', label: 'Part 5 Step 1 初稿', question: '根據 Part 4，我修改後的題目初稿是？' },
    { key: 'w3-p5-diagnose-ai-record', label: 'Part 5 Step 2 AI 診斷記錄', question: '（AI 協作開關）' },
    { key: 'w3-p5-compare', label: 'Part 5 Step 3 比對差異', question: '我的診斷 vs AI 的診斷，差在哪？' },
    { key: 'w3-p5-fix3-ai-record', label: 'Part 5 Step 4 AI 三方案記錄', question: '（AI 協作開關）' },
    { key: 'w3-p5-choose', label: 'Part 5 Step 5 我的選擇', question: 'AI 三個方案我選了哪個？理由？' },
    { key: 'w3-p5-optimize-ai-record', label: 'Part 5 Step 6 AI 優化記錄', question: '（AI 協作開關）' },
    { key: 'w3-final-topic', label: 'Part 5 Step 7 W3 最終定案題目', question: '這就是你這學期的研究起點' },
    { key: 'w3-aired-record', label: 'AI-RED 敘事紀錄', question: '本週最重要的一次 AI 互動（A-I-R-E-D 五要素）' },
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
            <div className="text-[11px] font-mono text-[var(--ink-light)] uppercase tracking-wider mb-2">📎 你 Part 4 Section A 的自診（不用再寫一次）</div>
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
                        <div className="text-[11px] font-mono text-[var(--accent)] uppercase tracking-wider">📎 已帶入你 Part 4 Section C 的修改版題目</div>
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
                <div className="mb-4 p-4 bg-[var(--paper-warm)] border border-dashed border-[var(--border)] rounded-[var(--radius-unified)] text-[12px] text-[var(--ink-light)]">
                    ⚠️ 還沒偵測到 Part 4 Section C 的修改版題目。請先回上一步（Step 4 魔王戰 Part 4）完成 Section C，或直接在下方欄位打字。
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
        const records = readRecords();
        setW2Intent((records['w2-final-intent'] || '').trim());

        // 跨 session 自動帶入：若 Part 4 已寫了修改版、Part 5 Step 1 還空，
        // 就把 Part 4 Section C 複製到 Part 5 Step 1（避免學生重打一次）
        const ownRev = (records['w3-own-revised'] || '').trim();
        const draft = (records['w3-p5-draft'] || '').trim();
        if (ownRev && !draft) {
            records['w3-p5-draft'] = ownRev;
            try { localStorage.setItem(STORAGE_KEY, JSON.stringify(records)); } catch { /* ignore */ }
        }
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
         * STEP 1: 碰壁 + 觀念
         * ────────────────────────────────────── */
        {
            title: '碰壁 + 觀念',
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

                        <ThinkRecord
                            dataKey="w3-disease-quiz"
                            prompt="選一個你覺得最難判斷的病症，說說為什麼難？"
                            scaffold={['我覺得最容易搞混的是…和…', '因為這兩種病的差別在於…', '判斷的關鍵是…']}
                            rows={3}
                        />
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
                </div>
            ),
        },

        /* ──────────────────────────────────────
         * STEP 3: AI 協作練手
         * ────────────────────────────────────── */
        {
            title: 'AI 協作練手',
            icon: '🤖',
            content: (
                <div className="space-y-8 prose-zh">
                    <div className="w3-task-block">
                        <div className="w3-task-hd">
                            <span className="w3-task-badge">PART 3</span>
                            <span className="w3-task-title">🤖 AI 協作工作坊（練手感）</span>
                        </div>
                        <div className="w3-task-body">
                            <div className="w3-notice" style={{ marginBottom: '24px' }}>
                                選 1 題爛題目來練手。重點不是 AI 改得多好，而是<strong>你怎麼選、為什麼選</strong>。
                            </div>
                            <div className="w3-collab-steps">
                                {COLLAB_STEPS_PRACTICE.map(step => (
                                    <div className="w3-collab-step" key={step.n}>
                                        <div className={step.s.includes('step-num') ? step.s : `w3-collab-step-num ${step.s}`}>{step.n}</div>
                                        <div className="w3-collab-step-content">
                                            <div className="w3-collab-step-title">
                                                {step.t} {step.badge && <span className="w3-core-badge">{step.badge}</span>}
                                            </div>
                                            <div className="w3-collab-step-desc">{step.d}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Prompt 工具箱 */}
                            <div className="mt-6 space-y-3">
                                {drillLocked && drillTopic && (
                                    <div className="flex items-center gap-2 px-3 py-2 rounded-[var(--radius-unified)] bg-[var(--accent-light)] border border-[var(--accent)]/15 text-[12px] text-[var(--accent)] font-mono">
                                        🎯 你的練習題目已自動帶入：「{drillTopic}」
                                    </div>
                                )}

                                <div className="prompt-box">
                                    <div className="prompt-hd">
                                        <span>PROMPT · Step 2 用：問 AI 診斷</span>
                                        <CopyButton text={buildPromptDiagnose(drillLocked ? drillTopic : null)} label="複製" />
                                    </div>
                                    <div className="prompt-body">
                                        以下是一個高中生寫的研究題目：<br /><br />
                                        「{drillLocked && drillTopic ? <strong>{drillTopic}</strong> : '【請貼上你選的爛題目】'}」<br /><br />
                                        請幫我診斷這個題目有什麼問題？<br />
                                        1. 它可能犯了什麼錯誤？（例如：太抽象、範圍太大、無法驗證、帶有主觀立場等）<br />
                                        2. 具體說明為什麼這個題目做不下去。
                                    </div>
                                </div>

                                <div className="prompt-box">
                                    <div className="prompt-hd">
                                        <span>PROMPT · Step 4 用：問 AI 給 3 個改法</span>
                                        <CopyButton text={buildPromptFix3(drillLocked ? drillTopic : null)} label="複製" />
                                    </div>
                                    <div className="prompt-body">
                                        以下是一個有問題的高中生研究題目：<br /><br />
                                        「{drillLocked && drillTopic ? <strong>{drillTopic}</strong> : '【請貼上你選的爛題目】'}」<br /><br />
                                        請給我 3 個不同方向的修改版本，每個版本需要：<br />
                                        1. 說明你改了什麼、為什麼這樣改<br />
                                        2. 確保修改後的題目是高中生可以執行的（能用問卷、訪談、觀察等方法）<br />
                                        3. 題目要具體、可測量、範圍明確
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 space-y-4">
                                <ThinkRecord
                                    dataKey="w3-ai-collab-compare"
                                    prompt="你的診斷 vs AI 的診斷，哪裡不同？"
                                    scaffold={['我判斷是…病，AI 說是…', '差異在於…', '我覺得比較準的是…因為…']}
                                    rows={4}
                                />
                                <ThinkRecord
                                    dataKey="w3-ai-collab-choose"
                                    prompt="AI 給了 3 個改法，你選了哪個？為什麼？"
                                    scaffold={['AI 的三個改法分別是…', '我選了第…個', '理由是這個最…']}
                                    rows={4}
                                />

                                {/* Part 3 的 AIRED 會在 Part 5 之後一起記錄（避免重複） */}
                            </div>
                        </div>
                    </div>
                </div>
            ),
        },

        /* ──────────────────────────────────────
         * STEP 4: 魔王戰 Part 4 — 5W1H 規格化（自己的題目）
         * ────────────────────────────────────── */
        {
            title: '魔王戰 Part 4',
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
                                💡 下方 Section A 第一格，請先把這段意圖改寫成題目句型，再開始診斷。
                            </p>
                        </div>
                    ) : (
                        <div className="border border-[var(--danger)]/40 bg-[var(--danger-light)] rounded-[var(--radius-unified)] p-5">
                            <div className="text-[12px] font-bold text-[var(--danger)] mb-1">⚠️ 沒偵測到你 W2 的最終探究意圖</div>
                            <p className="text-[12px] text-[var(--ink)] leading-relaxed">
                                如果你 W2 沒做／換裝置／清過快取，請<Link to="/w2" className="text-[var(--accent)] font-bold underline">回 W2</Link> 把題目補上。或者，把你紙本學習單 W2 的「最終探究意圖」抄到下方診斷欄位開頭。
                            </p>
                        </div>
                    )}

                    {/* Section A：診斷 */}
                    <div className="bg-white border border-[var(--border)] rounded-[var(--radius-unified)] overflow-hidden">
                        <div className="px-5 py-3 bg-[var(--paper-warm)] border-b border-[var(--border)] flex items-center gap-2">
                            <span className="text-[11px] font-mono font-bold text-[var(--ink-mid)]">SECTION A · 診斷</span>
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
                            <span className="text-[11px] font-mono font-bold text-[var(--ink-mid)]">SECTION B · 5W1H 規格化</span>
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
                            <span className="text-[11px] font-mono font-bold text-[var(--ink)]">SECTION C · 修改版題目（Part 5 起跑線）</span>
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
         * STEP 5: 魔王戰 Part 5 — AI 協作磨定案
         * ────────────────────────────────────── */
        {
            title: '魔王戰 Part 5',
            icon: '🎯',
            content: (
                <div className="space-y-8 prose-zh">
                    <div className="bg-[var(--paper-warm)] border border-[var(--border)] rounded-[var(--radius-unified)] p-5">
                        <div className="text-[11px] font-mono text-[var(--ink-mid)] tracking-wider mb-1">FINAL BOSS · AI 協作 7 步驟</div>
                        <h2 className="text-[18px] font-bold text-[var(--ink)] mb-2">把你的題目從初稿磨成定案</h2>
                        <p className="text-[13px] text-[var(--ink-mid)] leading-relaxed">
                            重點不是 AI 改得多好，而是<strong>你怎麼選、為什麼選</strong>。Step 1 先自己寫，再開 AI。
                            給自己 15 分鐘做到 Step 7——那個最後定案框就是你這學期的研究起點。
                        </p>
                    </div>

                    {/* Step 1 */}
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

                    {/* Step 2 */}
                    <section className="bg-white border border-[var(--border)] rounded-[var(--radius-unified)] overflow-hidden">
                        <div className="px-5 py-3 bg-[var(--paper-warm)] border-b border-[var(--border)] flex items-center gap-2">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--ink)] text-white flex items-center justify-center text-[12px] font-bold font-mono">2</span>
                            <span className="font-bold text-[13px]">問 AI 診斷</span>
                            <span className="ml-auto text-[10px] font-mono text-[var(--ink-light)]">AI 做</span>
                        </div>
                        <div className="p-5">
                            <AIAssistToggle
                                id="w3-p5-diagnose"
                                title="要用 AI 幫你診斷題目嗎？"
                                reason="只問診斷、不問改法。Prompt 已鎖定用 A-H 8 病症語言，讓 AI 跟你講同一種話。"
                                prompt={MY_DIAGNOSE_PROMPT}
                                recordKey="w3-p5-diagnose-ai-record"
                                recordPrompt="AI 診斷出哪幾種病？你覺得哪些準、哪些不準？"
                                recordPlaceholder="AI 診斷：___ 病（可複選，標代碼）&#10;我覺得 ___ 病準，因為 ___&#10;我覺得 ___ 病不準，因為 ___"
                            />
                        </div>
                    </section>

                    {/* Step 3 */}
                    <section className="bg-white border border-[var(--border)] rounded-[var(--radius-unified)] overflow-hidden">
                        <div className="px-5 py-3 bg-[var(--paper-warm)] border-b border-[var(--border)] flex items-center gap-2">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--ink)] text-white flex items-center justify-center text-[12px] font-bold font-mono">3</span>
                            <span className="font-bold text-[13px]">比對差異（人的判斷）</span>
                            <span className="ml-auto text-[10px] font-mono text-[var(--ink-light)]">你決定</span>
                        </div>
                        <div className="p-5">
                            <P5CompareRef />
                            <ThinkRecord
                                dataKey="w3-p5-compare"
                                prompt="你 Part 4 的診斷 vs AI 的診斷，哪裡一樣、哪裡不一樣？你更認同哪個？"
                                scaffold={[
                                    '我 Part 4 診斷出：___ 病',
                                    'AI 診斷出：___ 病',
                                    '一致／不一致：',
                                    '我更認同 ___ 的版本，因為：',
                                ]}
                                rows={5}
                            />
                        </div>
                    </section>

                    {/* Step 4 */}
                    <section className="bg-white border border-[var(--border)] rounded-[var(--radius-unified)] overflow-hidden">
                        <div className="px-5 py-3 bg-[var(--paper-warm)] border-b border-[var(--border)] flex items-center gap-2">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--ink)] text-white flex items-center justify-center text-[12px] font-bold font-mono">4</span>
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
                                recordPlaceholder="方向 A：___&#10;方向 B：___&#10;方向 C：___&#10;第一眼覺得 ___ 最有希望，因為 ___"
                            />
                        </div>
                    </section>

                    {/* Step 5 */}
                    <section className="bg-white border border-[var(--border)] rounded-[var(--radius-unified)] overflow-hidden">
                        <div className="px-5 py-3 bg-[var(--paper-warm)] border-b border-[var(--border)] flex items-center gap-2">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--gold)] text-[var(--ink)] flex items-center justify-center text-[12px] font-bold font-mono">5</span>
                            <span className="font-bold text-[13px]">我選一個（核心！AI 做不到的）</span>
                            <span className="ml-auto text-[10px] font-mono font-bold text-[var(--danger)]">不能跳過</span>
                        </div>
                        <div className="p-5">
                            <ThinkRecord
                                dataKey="w3-p5-choose"
                                prompt="你選了哪個方向？至少說 2 個理由"
                                scaffold={[
                                    '我選：☐ AI 方向 A  ☐ AI 方向 B  ☐ AI 方向 C  ☐ 我 Part 4 的版本最準  ☐ 都不好',
                                    '理由 1（勾至少 2 項）：',
                                    '  ☐ 這個題目我做得到（對象找得到、資源夠）',
                                    '  ☐ 我有興趣（真的想知道答案）',
                                    '  ☐ 這個方法我比較會用',
                                    '  ☐ 這個題目符合萬用心法（小實近易）',
                                    '  ☐ 其他：',
                                    '補充理由：',
                                ]}
                                rows={8}
                            />
                        </div>
                    </section>

                    {/* Step 6 */}
                    <section className="bg-white border border-[var(--border)] rounded-[var(--radius-unified)] overflow-hidden">
                        <div className="px-5 py-3 bg-[var(--paper-warm)] border-b border-[var(--border)] flex items-center gap-2">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--ink)] text-white flex items-center justify-center text-[12px] font-bold font-mono">6</span>
                            <span className="font-bold text-[13px]">請 AI 優化選中的方案</span>
                            <span className="ml-auto text-[10px] font-mono text-[var(--ink-light)]">AI 做</span>
                        </div>
                        <div className="p-5">
                            <AIAssistToggle
                                id="w3-p5-optimize"
                                title="讓 AI 把你選的那一個再磨精細"
                                reason="加上學術關鍵字、讓 Who/What 更具體。再拿 3 個版本回來選。"
                                prompt={MY_OPTIMIZE_PROMPT}
                                recordKey="w3-p5-optimize-ai-record"
                                recordPrompt="AI 給的三個優化版本是？有沒有過度學術化、反而偏離你想做的？"
                                recordPlaceholder="優化 A：___&#10;優化 B：___&#10;優化 C：___&#10;我的評估：___"
                            />
                        </div>
                    </section>

                    {/* Step 7 · 最終定案 */}
                    <section className="bg-[var(--accent-light)]/30 border-2 border-[var(--accent)] rounded-[var(--radius-unified)] overflow-hidden">
                        <div className="px-5 py-3 bg-[var(--accent)] text-white flex items-center gap-2">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-white text-[var(--accent)] flex items-center justify-center text-[12px] font-bold font-mono">7</span>
                            <span className="font-bold text-[13px]">🎯 W3 最終定案題目（AI 做不到的！）</span>
                        </div>
                        <div className="p-5 space-y-3">
                            <p className="text-[12px] text-[var(--ink-mid)] leading-relaxed">
                                從初稿、AI 三方向、AI 三優化版本中，<strong>用你的判斷</strong>做最後決定。
                                可以選任一個、也可以綜合改成自己的版本。這題就是你這學期的研究起點。
                            </p>
                            <ThinkRecord
                                dataKey="w3-final-topic"
                                prompt="🎯 我的 W3 最終定案題目"
                                placeholder="把你決定的題目完整寫出來。會帶到 W4 海報與 Gallery Walk。"
                                scaffold={[
                                    '我選：☐ 初稿  ☐ 優化 A  ☐ 優化 B  ☐ 優化 C  ☐ 綜合改成自己的',
                                    '最終定案題目：',
                                    '選擇理由（至少 2 項）：',
                                ]}
                                rows={5}
                            />
                            <div className="bg-white border border-[var(--accent)]/20 rounded-[6px] p-3 text-[11px] text-[var(--ink-mid)] leading-relaxed">
                                <strong className="text-[var(--danger)]">出院檢核：</strong>
                                5W1H 至少 4 格 ✓　小實近易 ≥ 2 項 ✓　兩週內能蒐集到資料 ✓　—— 三項都打勾才算「急救成功」。
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
                                '透過 AI 協作 7 步，產出 W3 最終定案題目（Part 5）',
                            ].map((item, i) => (
                                <div key={i} className="p-4 px-6 bg-white flex items-start gap-3">
                                    <CheckCircle2 size={16} className="text-[var(--success)] mt-0.5 flex-shrink-0" />
                                    <span className="text-[13px] text-[var(--ink-mid)]">{item}</span>
                                </div>
                            ))}
                        </div>
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
                                <p className="next-week-text">Gallery Walk 題目博覽會 → 海報壓力測試 → 同儕挑戰 → 最終定案。</p>
                            </div>
                            <div className="next-week-col">
                                <div className="next-week-label">你要準備</div>
                                <p className="next-week-text">帶著你 Part 5 Step 7 的「W3 最終定案題目」，製作海報（題目 + Who + How + 為什麼想研究這個）。</p>
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
                subtitle="好的研究不是「想出來」的，是「磨出來」的。今天先碰壁、學診斷 8 種題目病症、再用 AI 協作練手。最後回到你自己的 W2 題目，用 5W1H 切開、AI 協作 7 步，產出你這學期的研究起點。"
                meta={[
                    { label: '本週任務', value: '8 病症 + 練手 + 自己題目定案' },
                    { label: '時長', value: '100 MINS' },
                    { label: '課堂產出', value: 'W3 最終定案題目 + AI-RED' },
                    { label: '下週預告', value: 'Gallery Walk 題目博覽會' },
                ]}
            />
            <CourseArc items={W3Data.courseArc} />

            {/* 本週簡報 */}
            <div className="flex justify-end mb-8 -mt-2">
                <a
                    href="https://canva.link/frxal53w5unrq9h"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold tracking-wider text-[var(--ink-light)] hover:text-[var(--ink)] bg-[var(--paper)] hover:bg-[var(--paper-warm)] border border-[var(--border)] hover:border-[var(--ink)]/20 px-3 py-1.5 rounded-[5px] transition-all"
                >
                    📊 本週簡報 ↗
                </a>
            </div>

            {/* STEP ENGINE */}
            <StepEngine
                steps={steps}
                prevWeek={{ label: '回 W2 問題意識', to: '/w2' }}
                nextWeek={{ label: '前往 W4 題目博覽會', to: '/w4' }}
            flat
            />
        </div>
    );
};
