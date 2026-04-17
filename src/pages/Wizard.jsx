import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import CourseArc from '../components/ui/CourseArc';
import ThinkRecord from '../components/ui/ThinkRecord';
import ThinkChoice from '../components/ui/ThinkChoice';
import StepEngine from '../components/ui/StepEngine';
import ExportButton from '../components/ui/ExportButton';
import CopyButton from '../components/ui/CopyButton';
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
];

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
                <div className="space-y-10">
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
                <div className="space-y-10">
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
                <div className="space-y-8">
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
                            </div>
                        </div>
                    </div>
                </div>
            ),
        },

        /* ──────────────────────────────────────
         * STEP 4: 回顧與繳交
         * ────────────────────────────────────── */
        {
            title: '回顧與繳交',
            icon: '📋',
            content: (
                <div className="space-y-8">
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
                                '用 AI 協作完成診斷比對，並記錄 AI-RED',
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
                                <p className="next-week-text">5W1H 規格化 → 海報製作 → Gallery Walk 壓力測試 → 真正定案。</p>
                            </div>
                            <div className="next-week-col">
                                <div className="next-week-label">你要準備</div>
                                <p className="next-week-text">翻出 W2 的「最終探究意圖」，下週要用 5W1H 切開它，再做海報接受同學提問。</p>
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
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-4 mb-16">
                <div className="text-[11px] font-mono text-[var(--ink-light)] flex items-center gap-2">
                    研究方法與專題 / 研究規劃 / <span className="text-[var(--ink)] font-bold">題目健檢 W3</span>
                </div>
                <div className="flex items-center gap-4">
                    <span className="bg-[var(--paper-warm)] text-[var(--ink)] text-[10px] font-bold px-2 py-0.5 rounded-[2px] font-mono">100 MINS</span>
                    <button
                        onClick={() => setShowLessonMap(!showLessonMap)}
                        className="text-[11px] text-[var(--ink-light)] hover:text-[var(--accent)] transition-colors flex items-center gap-1 font-mono"
                    >
                        <Map size={12} /> {showLessonMap ? 'Hide Plan' : 'Instructor View'}
                    </button>
                    <span className="bg-[var(--ink)] text-white text-[10px] font-bold px-2 py-0.5 rounded-[2px] font-mono">AI-RED · D</span>
                </div>
            </div>

            {showLessonMap && (
                <div className="animate-in slide-in-from-top-4 duration-300">
                    <LessonMap data={W3Data} />
                </div>
            )}

            {/* PAGE HEADER */}
            <header>
                <div className="text-[11px] font-mono text-[var(--accent)] mb-3 tracking-[0.06em]">🏥 W3 · 研究規劃</div>
                <h1 className="font-serif text-[36px] font-bold leading-[1.2] text-[var(--ink)] mb-4 tracking-[-0.02em]">
                    題目健檢：<span className="text-[var(--accent)] italic">碰壁→診斷→救活</span>
                </h1>
                <p className="text-[15px] text-[var(--ink-mid)] max-w-[600px] leading-[1.75] mb-10">
                    好的研究不是「想出來」的，是「磨出來」的。今天先感受碰壁的真實感，學會診斷 8 種題目病症，再用 AI 協作練手。下週才進入你自己的題目定案。
                </p>
                <CourseArc items={W3Data.courseArc} />
            </header>

            {/* META STRIP */}
            <div className="meta-strip">
                {[
                    { label: '本週任務', value: '8種病症 + 配對診斷 + AI協作練手' },
                    { label: '課堂產出', value: 'AI 協作診斷紀錄 + AI-RED' },
                    { label: '下週預告', value: '5W1H 定案 + Gallery Walk' },
                ].map((item, idx) => (
                    <div key={idx} className="meta-item">
                        <div className="meta-label">{item.label}</div>
                        <div className="meta-value">{item.value}</div>
                    </div>
                ))}
            </div>

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
            />
        </div>
    );
};
