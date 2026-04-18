import React, { useState, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CourseArc from '../components/ui/CourseArc';
import './TeamFormation.css';
import ThinkRecord from '../components/ui/ThinkRecord';
import AIREDNarrative from '../components/ui/AIREDNarrative';
import ThinkChoice from '../components/ui/ThinkChoice';
import StepEngine from '../components/ui/StepEngine';
import HeroBlock from '../components/ui/HeroBlock';
import ExportButton from '../components/ui/ExportButton';
import ResetWeekButton from '../components/ui/ResetWeekButton';
import { readRecords, STORAGE_KEY } from '../components/ui/ThinkRecord';
import {
    Map,
    ArrowRight,
    CheckCircle2,
    ShieldAlert,
    Users,
} from 'lucide-react';
import LessonMap from '../components/ui/LessonMap';
import { W8Data } from '../data/lessonMaps';

/* ══════════════════════════════════════
 *  資料常數
 * ══════════════════════════════════════ */

/* — 合題三情境 — */
const MERGE_SCENARIOS = [
    { n: '✅', t: '同一現象，不同角度', d: '「高中生每天睡幾小時？」＋「睡眠不足對考試的影響？」→ 合成「睡眠時數與高中生學業表現的關係」', action: '可直接合題', color: 'var(--success)' },
    { n: '✅', t: '因果鏈相連，互為變項', d: '「高中生每天用社群媒體幾小時？」＋「高中生的焦慮感有多強？」→ 合成「社群媒體使用時間是否影響青少年焦慮感」', action: '可合題，明確誰是自變項誰是依變項', color: 'var(--success)' },
    { n: '⚠️', t: '主題差距過大', d: '「學校午餐滿意度」＋「高中生職業志向」→ 幾乎無交集，強行合題會讓研究失焦。', action: '需討論或重新搭配隊友', color: '#D97706' },
];

/* — 研究主題 vs 研究問題 — */
const TOPIC_VS_QUESTION = [
    { type: '因果型', typeColor: 'var(--accent)', topic: '社群媒體使用與青少年焦慮感', question: '每日 IG 使用時間是否影響高中生的焦慮程度？' },
    { type: '相關型', typeColor: 'var(--success)', topic: '高中生睡眠品質與學業表現', question: '就寢時間與段考成績之間有什麼關係？' },
    { type: '描述型', typeColor: '#c9a84c', topic: '校園午餐滿意度調查', question: '松山高中學生對午餐菜色、份量、價格的滿意程度如何？' },
];

/* — 工具草稿範例 — */
const TOOL_DRAFT_EXAMPLES = [
    { method: '問卷法', shape: '一題封閉式問題（含選項）', example: '你每天使用 IG 的時間大約多長？ □ 不到 30 分　□ 30-60 分　□ 1-2 小時　□ 超過 2 小時' },
    { method: '訪談法', shape: '一題開放式問題', example: '可以描述一下你通常在什麼情境下會打開 IG 嗎？' },
    { method: '觀察法', shape: '一項觀察指標（誰＋情境＋行為）', example: '午休時間，觀察教室內有多少人在滑手機（每 5 分鐘記錄一次）' },
    { method: '實驗法', shape: '一組操作步驟（操弄＋測量）', example: '實驗組使用番茄鐘 25 分鐘讀書，對照組自由讀書，測量兩組的記憶測驗分數' },
    { method: '文獻分析', shape: '一組搜尋策略（關鍵字＋篩選）', example: '關鍵字「青少年 + 社群媒體 + 焦慮」，篩選近 5 年、中英文期刊' },
];

/* — 交流卡欄位 — */
const CARD_FIELDS = [
    { emoji: '🎯', label: '我想研究什麼？', desc: '題目' },
    { emoji: '📚', label: '我的王牌文獻（W6 成果）', desc: '作者/年份 + 為什麼重要' },
    { emoji: '🔧', label: '我想用什麼方法（W7）', desc: '問卷/訪談/實驗/觀察/文獻分析' },
    { emoji: '💪', label: '我的優勢技能', desc: '統籌規劃/溝通協調/資訊能力/美編設計/邏輯清晰' },
    { emoji: '🤝', label: '我在找的夥伴', desc: '題目相近/能力互補/想自己做/還在考慮' },
];

/* — ThinkChoice — */
const THINK_CHOICES = [
    {
        id: 'tc1',
        prompt: '甲想研究「手機使用時間」，乙想研究「學業成績下降原因」，他們的題目適合合併嗎？',
        options: [
            { label: 'A', text: '可以——手機時間可能影響學業，因果鏈相連' },
            { label: 'B', text: '不行——一個是使用行為、一個是學業表現，方向差太遠' },
            { label: 'C', text: '看情況——要看甲的「手機使用」是否和學業有關' },
        ],
        answer: 'A',
        feedback: '手機使用時間可能導致學業成績下降——這是因果鏈相連的合題情境。合成後的研究問題可以是：「每日手機使用時間是否影響高中生的學業表現？」',
    },
    {
        id: 'tc2',
        prompt: '你在寫企劃書「研究問題」欄位。以下哪個寫法最好？',
        options: [
            { label: 'A', text: '我想研究高中生的壓力' },
            { label: 'B', text: '高中生在期中考週的睡眠時數與考試焦慮程度之間有什麼關係？' },
            { label: 'C', text: '壓力對學生影響很大' },
        ],
        answer: 'B',
        feedback: 'A 太廣（「壓力」沒有聚焦），C 是感想不是問題。B 有明確的對象（高中生）、情境（期中考週）、變項（睡眠時數 vs 考試焦慮）、句型（相關型「有什麼關係」）。',
    },
];

/* — ExportButton 欄位 — */
const EXPORT_FIELDS = [
    /* Part A */
    { key: 'w8-my-topic', label: '我的研究題目' },
    { key: 'w8-my-ref', label: '我的王牌文獻' },
    { key: 'w8-my-method', label: '我打算用什麼方法' },
    { key: 'w8-listen-notes', label: '聆聽紀錄', question: '讓我心動的潛在隊友' },
    /* Part B */
    { key: 'w8-teammates', label: '隊友姓名 & 題目' },
    { key: 'w8-merge-discussion', label: '合題討論紀錄', question: '共同核心是什麼？合成什麼大主題？' },
    { key: 'w8-merge-type', label: '合題情境判斷', question: '情境 1/2/3？' },
    /* Part C */
    { key: 'w8-team-members', label: '組長 + 成員名單' },
    { key: 'w8-merged-topic', label: '合題後研究主題' },
    { key: 'w8-research-question', label: '研究問題', question: '因果型/相關型/描述型' },
    { key: 'w8-method-reason', label: '研究方法 + 理由' },
    { key: 'w8-target', label: '研究對象' },
    /* Part D */
    { key: 'w8-tool-method', label: '我們組選用的研究方法' },
    { key: 'w8-draft-q1', label: '草稿題目 1' },
    { key: 'w8-draft-q2', label: '草稿題目 2' },
    { key: 'w8-draft-q3', label: '草稿題目 3' },
    { key: 'w8-draft-check', label: '自我檢核', question: '這 3 題和研究問題有關嗎？覺得怪怪的地方？' },
    { key: 'w8-aired-record', label: 'AI-RED 敘事紀錄', question: '本週最重要的一次 AI 互動（A-I-R-E-D 五要素）' },
];

/* ══════════════════════════════════════
 *  主元件
 * ══════════════════════════════════════ */

export const TeamFormation = () => {
    const [showLessonMap, setShowLessonMap] = useState(false);
    const [choiceResults, setChoiceResults] = useState([]);

    /* W4 題目 + W7 方法 + W5 文獻帶入 */
    const [w4Topic, setW4Topic] = useState('');
    const [w7Method, setW7Method] = useState('');

    useEffect(() => {
        const saved = readRecords();
        const topic = saved['w4-final-topic']?.trim();
        const method = saved['w7-main-method']?.trim();
        if (topic) {
            setW4Topic(topic);
            if (!saved['w8-my-topic']?.trim()) {
                const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
                all['w8-my-topic'] = topic;
                localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
            }
        }
        if (method) {
            setW7Method(method);
            if (!saved['w8-my-method']?.trim()) {
                const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
                all['w8-my-method'] = method;
                localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
            }
        }
    }, []);

    /* ThinkChoice callback */
    const handleChoice = useCallback((id, prompt) => (label, isCorrect) => {
        setChoiceResults(prev => {
            const filtered = prev.filter(r => r.id !== id);
            return [...filtered, { id, question: prompt, selected: label, correct: isCorrect }];
        });
    }, []);

    /* ── 五步驟 ──────────────────────────────────────── */

    const steps = [
        /* ─── Step 1：Part A 交流卡 + 個人展示準備 ─── */
        {
            title: '交流卡 + 展示準備',
            icon: '🔬',
            content: (
                <div className="space-y-8 prose-zh">
                    <p className="text-[14px] text-[var(--ink-mid)] leading-relaxed max-w-[720px]">
                        博覽會前先填好你的展示準備。這頁對應紙本學習單 Part A：準備 1 分鐘展示，說清楚三件事；邊聽邊記錄讓你心動的潛在隊友。
                    </p>

                    {/* W4 + W7 帶入 */}
                    {(w4Topic || w7Method) && (
                        <div className="flex items-start gap-3 px-4 py-3 rounded-[var(--radius-unified)] bg-[var(--accent-light)] border border-[var(--accent)] text-[13px]">
                            <span className="text-[16px]">📎</span>
                            <div>
                                <span className="font-bold text-[var(--accent)]">自動帶入你的研究檔案</span>
                                {w4Topic && <p className="text-[var(--ink-mid)] mt-0.5">W4 題目：{w4Topic}</p>}
                                {w7Method && <p className="text-[var(--ink-mid)] mt-0.5">W7 方法：{w7Method}</p>}
                            </div>
                        </div>
                    )}

                    {/* 研究交流卡說明（紙本的數位版參考） */}
                    <div className="bg-white border-2 border-dashed border-[var(--border)] rounded-[var(--radius-unified)] overflow-hidden">
                        <div className="px-5 py-3 bg-[var(--paper-warm)] border-b border-[var(--border)] flex items-center gap-2">
                            <span className="text-[16px]">🔬</span>
                            <span className="font-bold text-[13px] text-[var(--ink)]">研究交流卡 Research Networking Card</span>
                            <span className="ml-auto text-[10px] font-mono text-[var(--ink-light)]">紙本發放 · 以下為欄位說明</span>
                        </div>
                        <div className="p-5 space-y-3">
                            {CARD_FIELDS.map((f, i) => (
                                <div key={i} className="flex items-start gap-3 text-[13px]">
                                    <span className="text-[16px] shrink-0">{f.emoji}</span>
                                    <div>
                                        <span className="font-bold text-[var(--ink)]">{f.label}</span>
                                        <span className="text-[var(--ink-light)] ml-2">— {f.desc}</span>
                                    </div>
                                </div>
                            ))}
                            <div className="mt-3 px-4 py-2.5 rounded-[var(--radius-unified)] bg-[var(--paper)] text-[12px] text-[var(--ink-mid)]">
                                💡 填好後拿在胸前展示（像參加研討會的掛牌）。交流時互相拍照存檔——這些照片就是你的「研究網絡」！
                            </div>
                        </div>
                    </div>

                    {/* Pitch 結構 */}
                    <div className="bg-white border border-[var(--border)] rounded-[var(--radius-unified)] overflow-hidden">
                        <div className="px-5 py-3 bg-[var(--ink)] text-white flex items-center gap-2">
                            <Users size={16} />
                            <span className="font-bold text-[13px]">1 分鐘展示 Pitch 結構</span>
                        </div>
                        <div className="p-5 text-[13px] text-[var(--ink-mid)] space-y-1.5 leading-relaxed">
                            <p>❶ 我想研究 <strong>___</strong>（你的題目）</p>
                            <p>❷ 我有一篇文獻是 <strong>___（作者、年份）</strong>，它發現……</p>
                            <p>❸ 我打算用 <strong>___法</strong>，因為……</p>
                        </div>
                    </div>

                    {/* 個人展示填寫 */}
                    <ThinkRecord
                        dataKey="w8-my-topic"
                        prompt="❶ 我的研究題目"
                        placeholder="我想研究……"
                        rows={2}
                    />

                    <ThinkRecord
                        dataKey="w8-my-ref"
                        prompt="❷ 我的王牌文獻（W6 成果）"
                        placeholder="作者（年份）發現______，這和我的研究有關，因為……"
                        rows={3}
                    />

                    <ThinkRecord
                        dataKey="w8-my-method"
                        prompt="❸ 我打算用什麼方法（W7）"
                        placeholder="問卷/訪談/實驗/觀察/文獻分析，因為……"
                        rows={2}
                    />

                    {/* 聆聽紀錄 */}
                    <div className="bg-white border border-[var(--border)] rounded-[var(--radius-unified)] overflow-hidden">
                        <div className="px-5 py-3 bg-[var(--paper-warm)] border-b border-[var(--border)] flex items-center gap-2">
                            <span className="text-[10px] font-mono font-bold bg-[var(--accent)] text-white px-2 py-0.5 rounded-[3px]">LISTEN</span>
                            <span className="font-bold text-[13px] text-[var(--ink)]">聆聽紀錄：記下讓你心動的潛在隊友</span>
                        </div>
                        <div className="p-5 text-[12px] text-[var(--ink-mid)]">
                            博覽會進行中，邊聽邊記：誰的題目讓你心動？他的研究方向和你有什麼交集？
                        </div>
                    </div>

                    <ThinkRecord
                        dataKey="w8-listen-notes"
                        prompt="聆聽紀錄"
                        placeholder="姓名｜他的研究題目｜讓我心動的原因&#10;例：王小明｜高中生社群媒體焦慮｜和我的睡眠題目可能有因果關係"
                        rows={5}
                    />
                </div>
            ),
        },

        /* ─── Step 2：Part B 合題討論 ─── */
        {
            title: '合題討論',
            icon: '🤝',
            content: (
                <div className="space-y-6 prose-zh">
                    <p className="text-[14px] text-[var(--ink-mid)] leading-relaxed max-w-[720px]">
                        和隊友討論你們的題目能不能合，以及合成什麼。對應紙本學習單 Part B。
                    </p>

                    {/* 合題三情境 */}
                    <div>
                        <div className="text-[11px] font-mono text-[var(--ink-light)] uppercase tracking-wider mb-3">合題規則 · 三種情境判斷</div>
                        <div className="w7-expo-grid">
                            {MERGE_SCENARIOS.map((item, idx) => (
                                <div key={idx} className="w7-expo-card">
                                    <span className="w7-expo-num" style={{ color: item.color }}>{item.n}</span>
                                    <span className="w7-expo-title">{item.t}</span>
                                    <p className="w7-expo-desc">{item.d}</p>
                                    <p className="text-[11px] font-mono font-bold mt-2" style={{ color: item.color }}>→ {item.action}</p>
                                </div>
                            ))}
                        </div>
                        <div className="w7-notice w7-notice-gold">
                            ⚠️ 合題禁忌：不要讓同一份問卷同時問兩個完全不同方向的問題——受訪者會一頭霧水。
                            方法不同不代表不能合作：可以各自負責不同子研究問題，只要整體主題一致即可。
                        </div>
                    </div>

                    {/* 理解檢核 */}
                    <ThinkChoice
                        dataKey="w8-tc1"
                        prompt={THINK_CHOICES[0].prompt}
                        options={THINK_CHOICES[0].options}
                        answer={THINK_CHOICES[0].answer}
                        feedback={THINK_CHOICES[0].feedback}
                        onAnswer={handleChoice(THINK_CHOICES[0].id, THINK_CHOICES[0].prompt)}
                    />

                    {/* 合題討論紀錄 */}
                    <ThinkRecord
                        dataKey="w8-teammates"
                        prompt="隊友姓名 & 題目"
                        placeholder="隊友 1：___，題目：___&#10;隊友 2：___，題目：___（若有）&#10;隊友 3：___，題目：___（若有）"
                        rows={4}
                    />

                    <ThinkRecord
                        dataKey="w8-merge-discussion"
                        prompt="合題討論：你們的題目有什麼共同核心？合成什麼大主題？"
                        placeholder="請記錄討論歷程：我們發現______的共同點是______，所以合題方向是……"
                        rows={5}
                    />

                    <ThinkRecord
                        dataKey="w8-merge-type"
                        prompt="對照合題規則，我們的情況屬於"
                        placeholder="情境 1（同一現象，不同角度）/ 情境 2（因果鏈相連）/ 情境 3（主題差距過大→需要重新搭配）"
                        rows={2}
                    />
                </div>
            ),
        },

        /* ─── Step 3：Part C 研究企劃書 ─── */
        {
            title: '研究企劃書',
            icon: '📝',
            content: (
                <div className="space-y-6 prose-zh">
                    <p className="text-[14px] text-[var(--ink-mid)] leading-relaxed max-w-[720px]">
                        每組共同完成一份企劃書，但學習單每人皆要繳交。可指派一人填寫，邊討論邊確認，最後再複製貼上自己的作業。
                    </p>

                    {/* 組員名單 */}
                    <ThinkRecord
                        dataKey="w8-team-members"
                        prompt="組長 + 成員"
                        placeholder="組長：___&#10;成員 1：___&#10;成員 2：___&#10;成員 3：___"
                        rows={4}
                    />

                    {/* ① 合題後主題 */}
                    <ThinkRecord
                        dataKey="w8-merged-topic"
                        prompt="① 合題後的研究主題（10–20 字，一句話說清楚）"
                        placeholder="例如「社群媒體使用時間與青少年焦慮感的關係」"
                        rows={2}
                    />

                    {/* 主題 vs 問題 範例 */}
                    <div className="bg-white border border-[var(--border)] rounded-[var(--radius-unified)] overflow-hidden">
                        <div className="px-5 py-3 bg-[var(--paper-warm)] border-b border-[var(--border)] flex items-center gap-2">
                            <span className="text-[10px] font-mono font-bold bg-[var(--ink)] text-white px-2 py-0.5 rounded-[3px]">REF</span>
                            <span className="font-bold text-[13px] text-[var(--ink)]">主題 vs 問題 — 範例對照</span>
                        </div>
                        <div className="p-4 text-[12px] text-[var(--ink-mid)] space-y-2 leading-relaxed">
                            {TOPIC_VS_QUESTION.map((row, i) => (
                                <div key={i} className="flex items-start gap-2">
                                    <span className="font-mono font-bold shrink-0" style={{ color: row.typeColor }}>{row.type}｜</span>
                                    <span>主題：{row.topic} → 問題：<strong>{row.question}</strong></span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ② 研究問題 */}
                    <ThinkRecord
                        dataKey="w8-research-question"
                        prompt="② 精修後的研究問題（核心問句，選一個句型）"
                        placeholder="→「……是否影響……？」（因果型）&#10;→「……之間有什麼關係？」（相關型）&#10;→「……的現況為何？」（描述型）"
                        rows={3}
                    />

                    {/* 理解檢核 */}
                    <ThinkChoice
                        dataKey="w8-tc2"
                        prompt={THINK_CHOICES[1].prompt}
                        options={THINK_CHOICES[1].options}
                        answer={THINK_CHOICES[1].answer}
                        feedback={THINK_CHOICES[1].feedback}
                        onAnswer={handleChoice(THINK_CHOICES[1].id, THINK_CHOICES[1].prompt)}
                    />

                    {/* ③ 研究方法 */}
                    <ThinkRecord
                        dataKey="w8-method-reason"
                        prompt="③ 預計使用的研究方法（方法名稱 + 理由，參考 W7 兩層判斷）"
                        placeholder="我們選___法，理由是（引用兩層判斷中的某一條）……"
                        rows={3}
                    />

                    {/* ④ 研究對象 */}
                    <ThinkRecord
                        dataKey="w8-target"
                        prompt="④ 預計研究對象（誰？多少人/案例？如何找到他們？）"
                        placeholder="例如：本校高一 150 人問卷 / 5–8 位學生深度訪談 / ……"
                        rows={2}
                    />
                </div>
            ),
        },

        /* ─── Step 4：Part D 工具草稿 ─── */
        {
            title: '工具草稿',
            icon: '🔧',
            content: (
                <div className="space-y-6 prose-zh">
                    <p className="text-[14px] text-[var(--ink-mid)] leading-relaxed max-w-[720px]">
                        這 3 題是你對研究工具的「第一次嘗試」——不求完美，但要認真。
                        下週 W9，老師會用「診所模式」幫你們逐題診斷——你的草稿就是你的「掛號單」。
                    </p>

                    <ThinkRecord
                        dataKey="w8-tool-method"
                        prompt="我們組選用的研究方法"
                        placeholder="問卷法 / 訪談法 / 觀察法 / 實驗法 / 文獻分析"
                        rows={1}
                    />

                    {/* 工具草稿範例表 */}
                    <div className="bg-white border border-[var(--border)] rounded-[var(--radius-unified)] overflow-hidden">
                        <div className="px-5 py-3 bg-[var(--paper-warm)] border-b border-[var(--border)] flex items-center gap-2">
                            <span className="text-[10px] font-mono font-bold bg-[var(--ink)] text-white px-2 py-0.5 rounded-[3px]">REF</span>
                            <span className="font-bold text-[13px] text-[var(--ink)]">不知道怎麼寫？對照你的方法，看看範例</span>
                        </div>
                        <div className="divide-y divide-[var(--border)]">
                            {TOOL_DRAFT_EXAMPLES.map((row, i) => (
                                <div key={i} className="p-4 px-5">
                                    <div className="flex items-center gap-2 mb-1.5">
                                        <span className="text-[11px] font-mono font-bold text-[var(--accent)]">{row.method}</span>
                                        <span className="text-[11px] text-[var(--ink-light)]">— {row.shape}</span>
                                    </div>
                                    <p className="text-[12px] text-[var(--ink-mid)] leading-relaxed">{row.example}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="w7-notice w7-notice-danger">
                        ⚠️ 這 3 題草稿不計分，但 W9 要帶來診所——沒有草稿就沒辦法診斷！
                    </div>

                    <ThinkRecord
                        dataKey="w8-draft-q1"
                        prompt="草稿題目 1"
                        placeholder="對應你的方法，寫出第一題問卷題/訪談問題/觀察指標/實驗步驟/搜尋策略"
                        rows={3}
                    />

                    <ThinkRecord
                        dataKey="w8-draft-q2"
                        prompt="草稿題目 2"
                        placeholder="寫出你的第二題……"
                        rows={3}
                    />

                    <ThinkRecord
                        dataKey="w8-draft-q3"
                        prompt="草稿題目 3"
                        placeholder="寫出你的第三題……"
                        rows={3}
                    />

                    <ThinkRecord
                        dataKey="w8-draft-check"
                        prompt="自我檢核：這 3 題和我們的研究問題有關係嗎？有沒有什麼覺得怪怪的地方？"
                        placeholder="我覺得第___題可能有問題，因為……"
                        rows={3}
                    />
                </div>
            ),
        },

        /* ─── Step 5：回顧與繳交 ─── */
        {
            title: '回顧與繳交',
            icon: '📋',
            content: (
                <div className="space-y-8 prose-zh">
                    {/* 檢核清單 */}
                    <div className="bg-white border border-[var(--border)] rounded-[var(--radius-unified)] overflow-hidden">
                        <div className="p-4 px-5 bg-[var(--paper-warm)] border-b border-[var(--border)] font-bold text-[13px]">
                            ✅ W8 完成後，請確認
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-[1px] bg-[var(--border)]">
                            {[
                                '分組名單確認（或決定 Solo）',
                                '企劃書已填寫（Part C 四個欄位）',
                                '3 題草稿已完成（Part D）',
                                '準備帶到 W9 診所',
                            ].map((item, i) => (
                                <div key={i} className="p-4 px-6 bg-white flex items-start gap-3">
                                    <CheckCircle2 size={16} className="text-[var(--success)] mt-0.5 flex-shrink-0" />
                                    <span className="text-[13px] text-[var(--ink-mid)]">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                                        {/* AIRED 敘事紀錄（循序漸進：五欄 → 一段話） */}
                    <AIREDNarrative week="8" hint="合題、寫企劃書可能用 AI 協助" optional={true} />

                    {/* 一鍵複製 */}
                    <ExportButton
                        weekLabel="W8 研究博覽會"
                        fields={EXPORT_FIELDS}
                        choices={choiceResults}
                    />

                    {/* 下週預告 */}
                    <div className="next-week-preview">
                        <div className="next-week-header">
                            <span className="next-week-badge">NEXT WEEK</span>
                            <h3 className="next-week-title">W9 預告</h3>
                        </div>
                        <div className="next-week-content">
                            <div className="next-week-col">
                                <div className="next-week-label">帶什麼來</div>
                                <p className="next-week-text">你的 3 題草稿問題——這是你的「掛號單」，沒有草稿就沒辦法進診所。</p>
                            </div>
                            <div className="next-week-col">
                                <div className="next-week-label">做什麼</div>
                                <p className="next-week-text">老師用「診所模式」逐題診斷你的問卷/訪綱/觀察指標品質，升級為 2.0 版。</p>
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
                    <span className="hidden md:inline">研究方法與專題 / 研究規劃 / </span><span className="text-[var(--ink)] font-bold">研究博覽會 W8</span>
                </div>
                <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
                    <span className="bg-[var(--paper-warm)] text-[var(--ink)] text-[10px] font-bold px-2 py-0.5 rounded-[2px] font-mono">100 MINS</span>
                    <ResetWeekButton weekPrefix="w8-" />
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
                    <LessonMap data={W8Data} />
                </div>
            )}

            {/* PAGE HEADER — Hero Block */}
            <HeroBlock
                kicker="R.I.B. 調查檔案 · 研究方法與專題 · W8"
                title="研究博覽會："
                accentTitle="組隊 × 合題 × 企劃書"
                subtitle="今天是課程的轉折點——從一個人的研究，變成一個團隊的研究。找到隊友、把題目合併、寫出一份研究企劃書，然後預寫 3 題工具草稿帶去 W9 診所。"
                meta={[
                    { label: '第一節', value: '線上測驗 + 博覽會展示 + 聆聽紀錄' },
                    { label: '第二節', value: '合題討論 + 企劃書 + 3 題草稿' },
                    { label: '課堂產出', value: '分組名單 + 企劃書 + 3 題草稿' },
                    { label: '帶去 W9', value: '3 題草稿問題（你的掛號單）' },
                ]}
            />
            <CourseArc items={[
                    { wk: 'W1-W2', name: '探索階段\nRED公約', status: 'past' },
                    { wk: 'W3-W4', name: '題目診斷\n博覽會', status: 'past' },
                    { wk: 'W5-W6', name: '文獻搜尋\n引用寫作', status: 'past' },
                    { wk: 'W7', name: '認識方法\n兩層判斷', status: 'past' },
                    { wk: 'W8', name: '組隊決策\n企劃定案', status: 'now' },
                    { wk: 'W9-W10', name: '工具設計\n倫理審查' },
                    { wk: 'W11-W14', name: '執行研究\n數據分析' },
                    { wk: 'W15-W16', name: '簡報製作\n發表呈現' }
                ]} />

            {/* STEP ENGINE */}
            <StepEngine
                steps={steps}
                prevWeek={{ label: '回 W7 研究診所', to: '/w7' }}
                nextWeek={{ label: '前往 W9 工具設計', to: '/w9' }}
            flat
            />
        </div>
    );
};
