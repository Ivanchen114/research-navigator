import React, { useState, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './ClinicPage.css';
import CourseArc from '../components/ui/CourseArc';
import ThinkRecord from '../components/ui/ThinkRecord';
import AIREDNarrative from '../components/ui/AIREDNarrative';
import StepEngine from '../components/ui/StepEngine';
import HeroBlock from '../components/ui/HeroBlock';
import TaskCard from '../components/ui/TaskCard';
import ExportButton from '../components/ui/ExportButton';
import ResetWeekButton from '../components/ui/ResetWeekButton';
import BackfillField from '../components/ui/BackfillField';
import { readRecords } from '../components/ui/ThinkRecord';
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
        desc: '每題對應一個指標，用具體量表／時段／頻次。設計題目時就同步寫好操作型定義——學生看選項就知道要怎麼答。',
        example: '核心概念：高中生壓力\n操作型定義：\n  ❶「過去一週熬夜超過 12 點的次數」（具體計次，0-7 次）\n  ❷「PSS-10 壓力量表分數」（5 點李克特，10 題加總）',
    },
    {
        id: 'interview',
        icon: '🎤',
        name: '訪談',
        color: '#7c3aed',
        bg: '#f3f0ff',
        formula: '訪綱大問 + 編碼類別 ＝ 操作型定義',
        desc: '訪綱負責「引出口述」，編碼類別負責「事後從口述抓主題」。沒寫編碼類別＝沒操作型定義——一堆口述沒法分析。',
        example: '核心概念：學習動機\n訪綱：「請描述最近一次你『主動』學習的具體事件」\n編碼類別：\n  ❶「主動」＝沒人要求自發起的行為\n  ❷ 包含「具體時間／地點／引發者」三要素的口述算 1 個事件',
    },
    {
        id: 'experiment',
        icon: '🧪',
        name: '實驗',
        color: '#d97706',
        bg: '#fef3c7',
        formula: '自變項 + 依變項 + 控制變項　全部要寫',
        desc: '最嚴格——三類變項都要操作化到「不同人來做也得到一樣的結果」。少寫一條就不算實驗了。',
        example: '研究：聽古典音樂能否提升短期記憶？\n自變項：聽巴哈賦格 30 分鐘 vs 安靜休息 30 分鐘\n依變項：10 個不相關名詞、5 分鐘記憶後立即回憶得分（0-10 分）\n控制變項：相同房間光線、午後同一時段、受試者前一晚睡 ≥ 6 小時',
    },
    {
        id: 'observation',
        icon: '👀',
        name: '觀察',
        color: 'var(--success)',
        bg: 'var(--success-light)',
        formula: '行為類別 + 正反例 ＝ 操作型定義',
        desc: '誰看都能歸同一類——所以要明確列出正例（算）跟反例（不算）。沒列例＝雙人編碼會打架。',
        example: '核心概念：自習中分心\n操作型定義：視線離開課本連續 ≥ 5 秒\n  ✅ 正例：滑手機、發呆望窗外、跟旁邊人聊天\n  ❌ 反例：換姿勢、揉眼睛、喝水（< 5 秒）',
    },
    {
        id: 'literature',
        icon: '📚',
        name: '文獻分析',
        color: '#6b21a8',
        bg: '#f5f3ff',
        formula: '分析單位 + 編碼類別 ＝ 操作型定義',
        desc: '4 子類型各自的操作型定義方式不同——挑你 W9 會選的子類型對應寫。',
        example: '② 歷史文獻分析　時間軸切點：每 10 年一個段落，內含關鍵事件 ≥ 3 件\n③ 內容分析　詞彙計次：「民主」每出現 1 次計 1（含複合詞如民主化）\n④ 論述分析　話語策略類別：強調／淡化／批評（雙人編碼一致率 ≥ 80%）\n⑤ 敘事分析　情節結構：開展（背景）／轉折（衝突）／結局（收束）三段式',
    },
];

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
    { icon: '📋', tag: '量化（問卷）', text: '「過去一週熬夜超過 12 點的次數」+「PSS-10 量表分數」' },
    { icon: '🎤', tag: '質性（訪談）', text: '「請描述最近一次你覺得『壓力大』的具體事件」（口述事件編碼）' },
    { icon: '👀', tag: '行為（觀察）', text: '「自習課滑手機 ≥ 5 秒、發呆 ≥ 30 秒、頻繁站起的次數」' },
];

/* 操作型定義要做到 3 件事 */
const THREE_RULES = [
    { rule: '可測量', good: '熬夜次數（具體計次）', bad: '壓力大（主觀感受）' },
    { rule: '有正反例', good: '正例：滑手機 / 反例：換姿勢', bad: '只說「明顯分心」沒列例' },
    { rule: '前後一致', good: '整個研究用同一個定義', bad: '訪談中途換定義、編碼跟著換' },
];

/* — ExportButton 欄位 — */
const EXPORT_FIELDS = [
    { key: 'w5-my-topic', label: '我的題目（從 W4 帶入）' },
    { key: 'w5-my-method', label: '我的主要方法（從 W4 帶入）' },
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

    useEffect(() => {
        const refresh = () => {
            const saved = readRecords();
            const topic = (saved['w4-my-topic'] || saved['w3-final-topic'] || '').trim();
            setW4Topic(topic);
            const method = (saved['w4-main-method'] || '').trim();
            setW4MainMethod(method);
            const mid = detectMethodId(method);
            setMethodId(mid);
            if (mid && !activeMethodId) setActiveMethodId(mid);
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
                    <div className="bg-[var(--paper-warm)] border border-[var(--border)] rounded-[var(--radius-unified)] p-5">
                        <div className="text-[11px] font-mono text-[var(--ink-mid)] tracking-wider mb-1">為什麼是這週</div>
                        <h2 className="text-[18px] font-bold text-[var(--ink)] mb-2">把抽象概念變成可測指標</h2>
                        <p className="text-[13px] text-[var(--ink-mid)] leading-relaxed">
                            W4 你選了方法，但「選了方法」≠「知道怎麼問／怎麼測」。「壓力」「動機」「學習效果」這類抽象詞——
                            <strong className="text-[var(--ink)]">不操作化，下週你連問卷／訪綱／觀察表都寫不出來</strong>。
                            這週的事：把你題目最關鍵的概念，變成「誰來測都得到一樣的數字／類別」的具體指標。
                        </p>
                    </div>

                    {/* W4 帶入 + W2 好奇鏡子卡 */}
                    {(w4Topic || w4MainMethod || w2Curiosity) ? (
                        <W5HeaderRef topic={w4Topic} method={w4MainMethod} methodInfo={methodInfo} curiosity={w2Curiosity} />
                    ) : (
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

                    <div className="bg-white border border-[var(--border)] rounded-[var(--radius-unified)] p-4 text-[13px] text-[var(--ink-mid)] leading-relaxed">
                        <p className="font-bold text-[var(--ink)] mb-2">🎯 這週目標</p>
                        <p>把 W2 那一句模糊的好奇 → W4 那個方法 → 寫成「下週可以實際蒐集答案」的<strong className="text-[var(--ink)]">具體機制</strong>。寫完之後，下週博覽會看你題目、看你方法選得準不準的同學，就會知道「你真的知道自己要測什麼」。</p>
                    </div>
                </div>
            ),
        },

        /* ─── Step 2：操作型定義是什麼 ─── */
        {
            title: '操作型定義是什麼',
            icon: '📐',
            content: (
                <div className="space-y-6 prose-zh">
                    <div className="bg-white border-2 border-[var(--gold)] rounded-[var(--radius-unified)] overflow-hidden">
                        <div className="px-5 py-3 bg-[var(--gold)] text-white flex items-center gap-2">
                            <Ruler size={16} />
                            <span className="font-bold text-[14px]">關鍵概念　·　操作型定義</span>
                        </div>
                        <div className="p-5 space-y-4">
                            <p className="text-[13.5px] text-[var(--ink)] leading-relaxed">
                                把抽象概念（壓力、學習效果、動機……）變成<strong>具體、可觀察、可測量</strong>的指標——具體到「不同人來測也得到一樣的數字／類別」。
                            </p>

                            {/* 同一概念三方法對照範例 */}
                            <div className="bg-[var(--gold-light)] border-l-3 border-[var(--gold)] p-3 rounded-r-[6px]">
                                <p className="text-[12.5px] font-bold text-[var(--ink)] mb-2">範例（同一個概念，不同方法的操作型定義）</p>
                                <p className="text-[12.5px] text-[var(--ink-mid)] mb-2">
                                    抽象概念：<strong className="text-[var(--ink)]">「高中生壓力」</strong>
                                </p>
                                <div className="space-y-2">
                                    {PRESSURE_DEMO.map((d, i) => (
                                        <div key={i} className="flex items-start gap-2 bg-white px-3 py-2 rounded-[6px] border border-[var(--border)]">
                                            <span className="text-[14px] shrink-0">{d.icon}</span>
                                            <div className="flex-1 text-[12.5px]">
                                                <span className="font-bold text-[var(--ink)]">{d.tag}：</span>
                                                <span className="text-[var(--ink-mid)]">{d.text}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* 不是新東西——跟 W3 / W4 連動 */}
                            <div className="bg-[var(--paper-warm)] border-l-3 border-[var(--accent)] p-3 rounded-r-[6px]">
                                <p className="text-[12px] font-bold text-[var(--ink)] mb-1.5">🧬 這不是新東西——是兩件舊事的合體進階版</p>
                                <ul className="text-[12px] text-[var(--ink-mid)] leading-[1.8] list-none space-y-0.5">
                                    <li>· <strong>W3 具體疫苗（空→實）</strong>：題目層做粗具體化（「壓力對學生影響」→「高一段考前手機使用時數」）</li>
                                    <li>· <strong>W4 兩層判斷的方法選擇</strong>：你選定了「用什麼工具去測」</li>
                                    <li>· <strong>W5 操作型定義（本格）</strong>：把每個變項精細化到「誰來測都得到一樣的數字／類別」</li>
                                </ul>
                                <p className="text-[11.5px] text-[var(--ink-light)] italic mt-2">底層邏輯一樣：把模糊換成可數可看可記。差別只在抽象層級越來越細。</p>
                            </div>

                            {/* 三件事檢核 — 三大卡片視覺強化 */}
                            <div className="space-y-3 pt-2">
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-mono font-bold bg-[var(--danger)] text-white px-2 py-0.5 rounded-[3px] uppercase tracking-wider">關鍵原則</span>
                                    <span className="text-[14px] font-bold text-[var(--ink)]">操作型定義要做到 3 件事</span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    {THREE_RULES.map((r, i) => (
                                        <div key={i} className="bg-white border-2 border-[var(--danger)]/30 rounded-[var(--radius-unified)] overflow-hidden flex flex-col">
                                            <div className="px-4 py-3 bg-[var(--danger-light)] border-b-2 border-[var(--danger)]/30 flex items-center gap-2">
                                                <span className="w-7 h-7 rounded-full bg-[var(--danger)] text-white flex items-center justify-center text-[14px] font-bold font-mono shrink-0">{i + 1}</span>
                                                <span className="text-[15px] font-bold text-[#7F1D1D]">{r.rule}</span>
                                            </div>
                                            <div className="p-4 flex-1 flex flex-col gap-3">
                                                <div className="rounded-[8px] bg-[var(--success-light)] border border-[var(--success)]/30 p-3">
                                                    <div className="text-[10px] font-mono font-bold text-[var(--success)] uppercase tracking-wider mb-1">✅ 對</div>
                                                    <div className="text-[12.5px] text-[var(--ink)] leading-relaxed">{r.good}</div>
                                                </div>
                                                <div className="rounded-[8px] bg-[#FEF2F2] border border-[var(--danger)]/30 p-3">
                                                    <div className="text-[10px] font-mono font-bold text-[var(--danger)] uppercase tracking-wider mb-1">❌ 不對</div>
                                                    <div className="text-[12.5px] text-[var(--ink)] leading-relaxed">{r.bad}</div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 集體共寫示範｜上課專心 — 從讀範例到動手中間的鷹架 */}
                    <div className="bg-white border-2 border-[var(--accent)] rounded-[var(--radius-unified)] overflow-hidden">
                        <div className="px-5 py-3 bg-[var(--accent)] text-white flex items-center gap-2">
                            <span className="text-[14px]">📝</span>
                            <span className="font-bold text-[14px]">集體共寫示範　·　跟著老師跑一題：「上課專心」</span>
                            <span className="ml-auto text-[10px] font-mono opacity-80 tracking-wider">5 MIN</span>
                        </div>
                        <div className="p-5 space-y-3">
                            <p className="text-[12.5px] text-[var(--ink-mid)] leading-relaxed">
                                下半節要寫自己題目前——先看老師完整跑一題。題目選大家都熟的「<strong className="text-[var(--ink)]">上課專心</strong>」，假設用 <strong>👀 觀察法</strong>。展開順序：① 抽核心概念 → ② 寫操作型定義 → ③ 列正反例 → ④ 三件事檢核。
                            </p>

                            <details className="bg-[var(--paper-warm)] rounded-[6px] border border-[var(--border)]">
                                <summary className="px-3 py-2 text-[12.5px] font-bold cursor-pointer hover:bg-[var(--accent-light)]">
                                    <span className="text-[var(--accent)] mr-2">①</span>抽核心概念
                                </summary>
                                <div className="px-4 py-3 text-[12.5px] text-[var(--ink-mid)] leading-relaxed border-t border-[var(--border)]">
                                    <p><strong className="text-[var(--ink)]">老師問</strong>：「上課專心」這個句子裡，**最抽象、最沒辦法直接看到**的是哪個詞？</p>
                                    <p className="mt-1.5"><strong className="text-[var(--ink)]">學生答</strong>：「專心」。</p>
                                    <p className="mt-1.5"><strong className="text-[var(--ink)]">核心概念</strong>：<span className="bg-[var(--accent-light)] px-2 py-0.5 rounded">專心</span>（不是「上課」「老師」「同學」——那些是條件，不是要測的東西）</p>
                                </div>
                            </details>

                            <details className="bg-[var(--paper-warm)] rounded-[6px] border border-[var(--border)]">
                                <summary className="px-3 py-2 text-[12.5px] font-bold cursor-pointer hover:bg-[var(--accent-light)]">
                                    <span className="text-[var(--accent)] mr-2">②</span>用觀察法寫操作型定義
                                </summary>
                                <div className="px-4 py-3 text-[12.5px] text-[var(--ink-mid)] leading-relaxed border-t border-[var(--border)] space-y-1.5">
                                    <p><strong className="text-[var(--ink)]">套公式</strong>：行為類別 + 正反例 ＝ 操作型定義</p>
                                    <p className="bg-white px-3 py-2 rounded-[4px] border border-[var(--border)]">
                                        <strong className="text-[var(--ink)]">行為類別</strong>：視線停留在老師／黑板／課本連續 ≥ 10 秒，且**沒有**滑手機、趴睡、與旁人交談的動作。
                                    </p>
                                    <p className="text-[11.5px] italic text-[var(--ink-light)]">為什麼設「≥ 10 秒」？因為 1-2 秒可能只是抬頭，不算專心；10 秒以上才是有意識的注視。</p>
                                </div>
                            </details>

                            <details className="bg-[var(--paper-warm)] rounded-[6px] border border-[var(--border)]">
                                <summary className="px-3 py-2 text-[12.5px] font-bold cursor-pointer hover:bg-[var(--accent-light)]">
                                    <span className="text-[var(--accent)] mr-2">③</span>列正反例（誰來分都該分對）
                                </summary>
                                <div className="px-4 py-3 text-[12.5px] text-[var(--ink-mid)] leading-relaxed border-t border-[var(--border)] grid grid-cols-1 md:grid-cols-2 gap-2">
                                    <div className="bg-[var(--success-light)] border border-[var(--success)]/30 rounded-[4px] p-2">
                                        <div className="text-[10px] font-mono font-bold text-[var(--success)] uppercase tracking-wider mb-1">✅ 正例（算專心）</div>
                                        <ul className="list-disc list-inside text-[12px] space-y-0.5">
                                            <li>抄筆記同時眼睛看黑板</li>
                                            <li>舉手發問</li>
                                            <li>盯著老師示範</li>
                                        </ul>
                                    </div>
                                    <div className="bg-[#FEF2F2] border border-[var(--danger)]/30 rounded-[4px] p-2">
                                        <div className="text-[10px] font-mono font-bold text-[var(--danger)] uppercase tracking-wider mb-1">❌ 反例（不算專心）</div>
                                        <ul className="list-disc list-inside text-[12px] space-y-0.5">
                                            <li>滑手機（即使課本攤開）</li>
                                            <li>趴桌睡覺</li>
                                            <li>跟同學講話 ≥ 5 秒</li>
                                        </ul>
                                    </div>
                                </div>
                            </details>

                            <details className="bg-[var(--paper-warm)] rounded-[6px] border border-[var(--border)]">
                                <summary className="px-3 py-2 text-[12.5px] font-bold cursor-pointer hover:bg-[var(--accent-light)]">
                                    <span className="text-[var(--accent)] mr-2">④</span>三件事檢核（3/3 都過才算 OK）
                                </summary>
                                <div className="px-4 py-3 text-[12.5px] text-[var(--ink-mid)] leading-relaxed border-t border-[var(--border)] space-y-1">
                                    <p>✅ <strong>可測量</strong>：用碼表+紀錄表計次（不是主觀打分）</p>
                                    <p>✅ <strong>有正反例</strong>：上面 ③ 已列三正三反</p>
                                    <p>✅ <strong>前後一致</strong>：整節課用同一定義（不能因為下半節老師上課方式變了就改）</p>
                                </div>
                            </details>

                            <div className="bg-[var(--gold-light)] border-l-3 border-[var(--gold)] p-3 rounded-r-[6px] text-[12px] text-[var(--ink)] leading-relaxed">
                                💡 <strong>看完老師示範，下半節寫你自己的題目時這樣跑</strong>——把「上課專心」換成你題目裡那個最抽象的詞。同樣 4 步驟。
                            </div>

                            <div className="bg-[var(--accent-light)] border border-[var(--accent)] rounded-[6px] p-3 text-[12px] text-[var(--ink)] leading-relaxed flex items-start gap-2">
                                <span className="text-[16px]">📚</span>
                                <div className="flex-1">
                                    <strong className="text-[var(--ink)]">想看更多範例？</strong>「上課專心」其實還有更嚴謹的版本，加上 5 法各 2-3 個範例（共 12 個）——
                                    <Link to="/tools/operationalize" className="text-[var(--accent)] font-bold hover:underline ml-1">📐 操作型定義範例庫</Link>
                                    <span className="text-[var(--ink-light)] ml-1">（自學）</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ),
        },

        /* ─── Step 3：5 法策略（互動） ─── */
        {
            title: '5 法操作型定義策略',
            icon: '🧰',
            content: (
                <div className="space-y-6 prose-zh">
                    <p className="text-[14px] text-[var(--ink-mid)] leading-relaxed max-w-[720px]">
                        每種方法操作化的「公式」不一樣。先點開你 W4 選的那張看細節——其他四張可以後再看（如果有用輔助方法的話也要看）。
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

                    {/* 詳細內容 */}
                    {activeStrategy && (
                        <div className="rounded-[var(--radius-unified)] overflow-hidden border-2" style={{ borderColor: activeStrategy.color }}>
                            <div className="px-5 py-3 flex items-center gap-3" style={{ background: activeStrategy.bg }}>
                                <span className="text-[22px]">{activeStrategy.icon}</span>
                                <div className="flex-1">
                                    <span className="font-bold text-[15px]" style={{ color: activeStrategy.color }}>{activeStrategy.name}的操作型定義策略</span>
                                </div>
                            </div>
                            <div className="bg-white p-5 space-y-4">
                                <div className="bg-[var(--ink)] text-white rounded-[8px] p-3 text-center">
                                    <div className="text-[11px] font-mono text-[var(--ink-light)] uppercase tracking-wider mb-1">公式</div>
                                    <div className="text-[15px] font-bold">{activeStrategy.formula}</div>
                                </div>
                                <p className="text-[13px] text-[var(--ink-mid)] leading-relaxed">
                                    {activeStrategy.desc}
                                </p>
                                <div className="bg-[var(--paper-warm)] border-l-3 p-3 rounded-r-[6px]" style={{ borderLeftColor: activeStrategy.color }}>
                                    <p className="text-[11px] font-mono font-bold uppercase tracking-wider mb-2" style={{ color: activeStrategy.color }}>範例</p>
                                    <pre className="text-[12.5px] text-[var(--ink)] whitespace-pre-wrap font-sans leading-[1.85]">{activeStrategy.example}</pre>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 自然科學分流卡 */}
                    <div className="bg-[#ecfdf5] border-l-4 border-[var(--success)] p-3 rounded-r-[6px]">
                        <p className="text-[12px] font-bold text-[#065f46] mb-1">🌱 自然科學分流（理化／生物／地科）</p>
                        <p className="text-[12px] text-[#065f46] leading-relaxed">
                            研究對象不是人——例如「植物澆水量對生長的影響」——常見組合是 <strong>👀 觀察 + 🧪 實驗</strong>。觀察的操作型定義要寫「測什麼指標、用什麼工具測、隔多久測一次」（例：株高用尺，每 3 天量一次，量到分支點）。實驗的自／依／控制變項要全部操作化。
                        </p>
                    </div>
                </div>
            ),
        },

        /* ─── Step 4：個人實作 ─── */
        {
            title: '為自己題目寫操作型定義',
            icon: '✍️',
            content: (
                <div className="space-y-6 prose-zh">
                    <p className="text-[14px] text-[var(--ink-mid)] leading-relaxed max-w-[720px]">
                        把剛剛看到的策略套到你 W4 的題目上。三格都寫——核心概念、操作型定義、正反例。
                    </p>

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

                    {/* 核心概念抽取暖身——避免學生在第一格就卡死 */}
                    <div className="bg-white border-2 border-[var(--gold)] rounded-[var(--radius-unified)] overflow-hidden">
                        <div className="px-5 py-3 bg-[var(--gold)] text-white flex items-center gap-2">
                            <span className="text-[14px]">🎯</span>
                            <span className="font-bold text-[14px]">寫之前先暖身：核心概念抽取（1 分鐘）</span>
                        </div>
                        <div className="p-5 space-y-3">
                            <p className="text-[12.5px] text-[var(--ink-mid)] leading-relaxed">
                                在你動筆寫自己題目之前，先看下面 3 個範例題目——**心裡圈一下核心概念在哪**，再展開看答案。
                            </p>

                            <details className="bg-[var(--paper-warm)] rounded-[6px] border border-[var(--border)]">
                                <summary className="px-3 py-2 text-[12.5px] cursor-pointer hover:bg-[var(--gold-light)]">
                                    <strong className="text-[var(--ink)]">範例 ①</strong>　高一段考前一週的夜間滑手機時數與翌日上課專注力之相關性
                                </summary>
                                <div className="px-4 py-3 text-[12.5px] text-[var(--ink-mid)] leading-relaxed border-t border-[var(--border)]">
                                    <p>核心概念：<span className="bg-[var(--gold-light)] px-2 py-0.5 rounded font-bold text-[var(--ink)]">夜間滑手機時數</span>＋<span className="bg-[var(--gold-light)] px-2 py-0.5 rounded font-bold text-[var(--ink)]">上課專注力</span>（**兩個都要操作化**）</p>
                                    <p className="mt-1.5 text-[11.5px] italic text-[var(--ink-light)]">不是「高一」「段考前」「翌日」——那些是條件／時間範圍，不是要測的東西。</p>
                                </div>
                            </details>

                            <details className="bg-[var(--paper-warm)] rounded-[6px] border border-[var(--border)]">
                                <summary className="px-3 py-2 text-[12.5px] cursor-pointer hover:bg-[var(--gold-light)]">
                                    <strong className="text-[var(--ink)]">範例 ②</strong>　高中生使用 IG 對自我形象認知的影響
                                </summary>
                                <div className="px-4 py-3 text-[12.5px] text-[var(--ink-mid)] leading-relaxed border-t border-[var(--border)]">
                                    <p>核心概念：<span className="bg-[var(--gold-light)] px-2 py-0.5 rounded font-bold text-[var(--ink)]">IG 使用（強度／時數／類型）</span>＋<span className="bg-[var(--gold-light)] px-2 py-0.5 rounded font-bold text-[var(--ink)]">自我形象認知</span></p>
                                    <p className="mt-1.5 text-[11.5px] italic text-[var(--ink-light)]">「影響」不是核心概念——它是兩個變項之間的**關係**，操作化要分別處理「IG 使用」跟「自我形象」。</p>
                                </div>
                            </details>

                            <details className="bg-[var(--paper-warm)] rounded-[6px] border border-[var(--border)]">
                                <summary className="px-3 py-2 text-[12.5px] cursor-pointer hover:bg-[var(--gold-light)]">
                                    <strong className="text-[var(--ink)]">範例 ③</strong>　家庭氣氛對學生選社團類型的決策歷程
                                </summary>
                                <div className="px-4 py-3 text-[12.5px] text-[var(--ink-mid)] leading-relaxed border-t border-[var(--border)]">
                                    <p>核心概念：<span className="bg-[var(--gold-light)] px-2 py-0.5 rounded font-bold text-[var(--ink)]">家庭氣氛</span>＋<span className="bg-[var(--gold-light)] px-2 py-0.5 rounded font-bold text-[var(--ink)]">社團選擇決策歷程</span></p>
                                    <p className="mt-1.5 text-[11.5px] italic text-[var(--ink-light)]">「決策歷程」是訪談會挖到的東西——這題明顯是訪談組。「家庭氣氛」要訂出 3-4 個面向（溝通、衝突、支持⋯）才好操作化。</p>
                                </div>
                            </details>

                            <div className="bg-[var(--accent-light)] border-l-3 border-[var(--accent)] p-3 rounded-r-[6px] text-[12px] text-[var(--ink)] leading-relaxed">
                                💡 <strong>抽核心概念的口訣</strong>：把題目裡那些「**沒辦法直接看到、需要再定義一次才能測**」的詞圈出來。**通常是兩個**——A 和 B 都要操作化。
                            </div>
                        </div>
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
                            methodId === 'survey' ? '例：用 PSS-10 量表 5 點李克特，10 題加總得分作為「壓力」分數。'
                                : methodId === 'interview' ? '例：訪綱問「最近一次主動學習的具體事件」，編碼類別為「自發性 ＋ 時間／地點／引發者三要素」。'
                                : methodId === 'experiment' ? '例：自變項＝音樂組／安靜組；依變項＝記憶測驗得分；控制變項＝光線、時段、作息。'
                                : methodId === 'observation' ? '例：行為類別＝視線離開課本連續 ≥ 5 秒；正例：滑手機、發呆；反例：換姿勢、揉眼睛。'
                                : methodId === 'literature' ? '例：分析單位＝每篇社論一段；編碼類別＝民主、權威、自由（雙人編碼一致率 ≥ 80%）。'
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

                    {/* 同儕挑戰 */}
                    <div className="rounded-[var(--radius-unified)] p-4 bg-[var(--gold-light)] border-l-4 border-[var(--gold)] text-[13px] text-[var(--ink)] leading-relaxed">
                        🎯 寫完三格後，跟旁邊的人交換唸一遍。讓對方用這個問題挑戰你：
                        <strong className="block mt-1.5">「你的核心概念有沒有可測量的操作型定義？正例反例分得開嗎？」</strong>
                        分不開的話——回頭再修一次。
                    </div>

                    {/* 下游告知 */}
                    <p className="text-[11.5px] text-[var(--ink-light)] italic leading-relaxed">
                        💡 這格寫的會在 <strong>W7-W8 計畫書</strong>用到（第二章變項要套用）；<strong>W9 寫工具</strong>時每題／每觀察項都要對應。<strong className="text-[var(--ink)]">寫一次、用三次。</strong>
                    </p>
                </div>
            ),
        },

        /* ─── Step 5：反思 + 繳交 ─── */
        {
            title: '反思 + 繳交',
            icon: '📋',
            content: (
                <div className="space-y-8 prose-zh">
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
                                '檢核三件事：可測量、有正反例、前後一致',
                            ].map((item, i) => (
                                <div key={i} className="p-4 px-6 bg-white flex items-start gap-3">
                                    <CheckCircle2 size={16} className="text-[var(--success)] mt-0.5 flex-shrink-0" />
                                    <span className="text-[13px] text-[var(--ink-mid)]">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 反思一題 */}
                    <ThinkRecord
                        dataKey="w5-reflect"
                        prompt="✍️ 反思：把抽象概念變可測，最難的一步是什麼？你怎麼克服？"
                        placeholder="例：最難是『學習動機』太抽象，我想了三個版本（每週主動學習時數／主動找老師問問題的次數／自評 1-10 分）才覺得第三個太主觀、選了第二個。克服的方式是先列三個 candidate，再用『誰來測都會一樣嗎』濾掉主觀的。"
                        scaffold={['最難的是 ___', '我試了 ___ 種寫法', '最後選 ___，因為…']}
                        rows={5}
                    />

                    {/* AI-RED 敘事紀錄 — optional */}
                    <AIREDNarrative week="5" hint="操作型定義可能會用 AI 發散候選版本——記錄一次最關鍵的互動。" optional={true} />

                    {/* 一鍵複製 */}
                    <ExportButton
                        weekLabel="W5 操作型定義"
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
                                <p className="next-week-text">海報博覽會 + 組隊（含 Solo）——把你 W3 題目 + W4 方法 + W5 操作型定義做成一張海報，Gallery Walk 走讀後找合題夥伴或單飛獨行。</p>
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
                        <Map size={12} /> <span className="hidden md:inline">{showLessonMap ? 'Hide Plan' : 'Instructor View'}</span>
                    </button>
                    <span className="hidden md:inline-block bg-[var(--ink)] text-white text-[10px] font-bold px-2 py-0.5 rounded-[2px] font-mono">AI-RED · D</span>
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
                title="操作型定義："
                accentTitle="把好奇變可測"
                subtitle="W4 選了方法，但「壓力／動機／學習效果」這類抽象詞——不操作化，下週你連問卷／訪綱／觀察表都寫不出來。這週把題目最關鍵的概念變成「誰來測都得到一樣的數字／類別」。"
                chain="W3 你決定了題目、W4 你選了方法——但題目裡那個最抽象的詞（壓力／動機／效果）還沒交代『怎麼測』。這週把它釘死。"
                meta={[
                    { label: '課堂節奏', value: '帶入 → 操作型定義概念 → 5 法策略 → 為自己寫 → 反思' },
                    { label: '時長', value: '100 MINS' },
                    { label: '課堂產出', value: '核心概念 + 操作型定義 + 正反例（三格）' },
                    { label: '帶去 W6', value: '操作型定義（海報必填內容、博覽會講題）' },
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
                    '三件事檢核 — 可測量／正反例／一致性',
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
