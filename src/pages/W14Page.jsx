import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import CourseArc from '../components/ui/CourseArc';
import { W14Data } from '../data/lessonMaps';
import './W14.css';
import ThinkRecord from '../components/ui/ThinkRecord';
import Checklist from '../components/ui/Checklist';
import PromptBlock from '../components/ui/PromptBlock';
import AIREDNarrative from '../components/ui/AIREDNarrative';
import StepEngine from '../components/ui/StepEngine';
import StepBriefing from '../components/ui/StepBriefing';
import HeroBlock from '../components/ui/HeroBlock';
import TaskCard from '../components/ui/TaskCard';
import ResetWeekButton from '../components/ui/ResetWeekButton';
import AICollaborationPrinciples from '../components/ui/AICollaborationPrinciples';
import AIModePicker from '../components/ui/AIModePicker';
import { ResearcherRedlines } from '../components/ui/ResearcherRedlines';
import TrapRewritePractice from '../components/ui/TrapRewritePractice';
import ChartChoiceChecker from '../components/ui/ChartChoiceChecker';
import { readRecords } from '../components/ui/ThinkRecord';
import { ModeProvider, useMode } from '../context/ModeContext';
import { useProjector } from '../context/ProjectorContext';
import ModeSwitch from '../components/ui/ModeSwitch';
import DepthBlock from '../components/ui/DepthBlock';
import ContentTypeChip from '../components/ui/ContentTypeChip';
import RecordDrawer from '../components/ui/RecordDrawer';
import ExportButton from '../components/ui/ExportButton';
import {
    ArrowRight,
    TrendingUp,
    BarChart2,
    PieChart,
    ScatterChart,
    FileText,
    Lightbulb,
    AlertTriangle,
    Gamepad2,
    ShieldAlert,
    Bot,
} from 'lucide-react';

/* ══════════════════════════════════════
 *  資料常數
 * ══════════════════════════════════════ */

/* — 四大圖表 — */
const CHART_TYPES = [
    {
        icon: <TrendingUp size={18} />,
        name: '折線圖',
        eng: 'Line',
        use: '看趨勢、時間變化',
        keyword: '隨時間、波動',
        color: '#2563EB',
        bg: '#EFF6FF',
        question: '有時間在流動嗎？',
        methods: '適合：實驗（前後測）／觀察（時間取樣）／文獻（時序變化）',
    },
    {
        icon: <PieChart size={18} />,
        name: '圓餅圖',
        eng: 'Pie',
        use: '看比例、結構',
        keyword: '佔比、總和 100%',
        color: '#7C3AED',
        bg: '#F5F3FF',
        question: '看部分佔整體的比例嗎？',
        methods: '適合：問卷（類別比例）／觀察（行為類別）／文獻（編碼類別）',
    },
    {
        icon: <BarChart2 size={18} />,
        name: '長條圖',
        eng: 'Bar',
        use: '看比較、排名',
        keyword: '比大小、第一名、複選題',
        color: '#059669',
        bg: '#F0FDF4',
        question: '都不是？比大小排名嗎？',
        methods: '適合：問卷／實驗（組間比較）／觀察（行為次數）／文獻（維度比例）',
    },
    {
        icon: <ScatterChart size={18} />,
        name: '散佈圖',
        eng: 'Scatter',
        use: '看相關性',
        keyword: '關係、分佈',
        color: '#DC2626',
        bg: '#FEF2F2',
        question: '找兩個變數的關係嗎？',
        methods: '適合：問卷（兩個量化變項）／實驗（自變項數值 vs 依變項）',
    },
];

/* — 口訣決策流程 — */
const DECISION_FLOW = [
    { num: '❶', text: '有時間在流動嗎？', answer: '→ 折線圖', color: '#2563EB' },
    { num: '❷', text: '看部分佔整體比例嗎？', answer: '→ 圓餅圖', color: '#7C3AED' },
    { num: '❸', text: '找兩個變數的關係嗎？', answer: '→ 散佈圖', color: '#DC2626' },
    { num: '❹', text: '都不是？比大小排名？', answer: '→ 長條圖', color: '#059669' },
];

/* — 演練題（統一主題：手機使用與學習）— */
const EXERCISE_ITEMS = [
    { q: '「每天手機使用時數」與「段考成績」之間有沒有關聯？', a: 'D 散佈圖', hint: '找兩個數值變數的關係' },
    { q: '問卷調查中，手機主要用途（學習／社交／娛樂／短影音）各佔多少比例？', a: 'A 圓餅圖', hint: '部分佔整體的比例' },
    { q: '自習課 4 節課中，「滑手機」「書寫專注」「聊天」三種行為的次數比較。', a: 'B 長條圖', hint: '比較不同類別的大小' },
    { q: '實驗組（通知開啟）vs. 對照組（手機收起）的閱讀測驗平均分，前測和後測各是多少？', a: 'C 折線圖', hint: '前後測、時間上的變化' },
];

/* — 格式規範：4 個規定（5 法通用）— */
const FORMAT_RULES = [
    { kind: '規定 1', label: '📌 標題', rule: '圖表一定要有標題（讓讀者知道這張圖／表在說什麼）', example: '圖一：高二學生社團參與時數 (N=120)' },
    { kind: '規定 2', label: '📌 資料來源', rule: '必須標資料來源（通常放圖表下方）', example: '資料來源：本研究問卷；研究者整理，以 Gemini Pro（思考模式+Canvas）協助繪製並驗收' },
    { kind: '規定 3', label: '📌 N 值', rule: '標題旁必須標 N 值（問卷=有效份數；訪談=受訪人數；實驗=受試人數；觀察=觀察時段數；文獻=篇數）', example: '80% 是 100 人的 80% 還是 5 人的？差很多！' },
    { kind: '規定 4', label: '📌 正文引用', rule: '標題格式用「圖一：___」，正文才能寫「如圖一所示」（文獻組做表格的：用「表一：___」，正文寫「如表一所示」）', example: '絕對不能寫「如上圖」或「如下圖」' },
];

/* — ExportButton 欄位 — */
const EXPORT_FIELDS = [
    /* Step 1 */
    { key: 'w14-chart-exercise', label: '圖表決策演練', question: '四題圖表配對答案' },
    { key: 'w14-chart-debug', label: '圖表除錯', question: '小明的圓餅圖錯在哪？' },
    /* Step 2 */
    { key: 'w14-format-exercise', label: '格式規範演練' },
    /* Step 3 */
    { key: 'w14-case-3', label: '描述+推論整合練習' },
    { key: 'w14-pre-judgment', label: '① 草圖判讀（必填）', question: '草圖判讀自評（選定變項／預期趨勢／一句話結論）' },
    { key: 'w14-my-chart-type', label: '② 圖表類型與理由（必填）' },
    { key: 'w14-teach-reflection', label: '教學型反思（教學型才有）' },
    { key: 'w14-ai-blindspot', label: 'AI 找到的盲點（進階·驗收型必填）' },
    { key: 'w14-validation-check', label: '③ 圖表4 個格式規定驗收（必填）', question: '格式規定勾選（標題在上／N 值有標／資料來源在下）' },
    { key: 'w14-ai-pressure-test', label: 'AI 壓力測試後修正（進階·驗收型必填）' },
    /* Step 6 回顧繳交 */
    { key: 'w14-trap-rewrite-11', label: '雷 #11 改寫練習（個人繳交項）', question: '把散佈圖圖說的「明顯」過度修飾改成謹慎版' },
    { key: 'w14-aired-record', label: 'AI-RED 敘事紀錄（用了 AI 必填）', question: '本週用 AI 畫圖的最重要一次互動（A-I-R-E-D 五要素）' },
    { key: 'w14-semester-reflection', label: '學期 AI 協作反思（W14-W17 跨週作業）', question: '從 W1 到現在，你跟 AI 共事最讓你改變想法的一次是什麼？（W17 老師會點 3 位同學現場分享）' },
];

/* — RecordDrawer：不匯出、但要在總覽顯示的「元件自帶 dataKey」— */
const RECORD_EXTRA_FIELDS = [
    { key: 'w14-ai-mode', label: 'AI 使用模式選擇（進階壓測）', store: 'records' },
    { key: 'w14-chart-choice', label: '選圖判斷檢核卡', store: 'standalone' },
];

/* ══════════════════════════════════════
 *  演練題互動元件
 * ══════════════════════════════════════ */

const ChartExercise = () => {
    const [answers, setAnswers] = useState(() => {
        try { return JSON.parse(localStorage.getItem('w14-chart-exercise-ans') || '{}'); } catch { return {}; }
    });
    const [showAnswers, setShowAnswers] = useState(() => {
        try { return localStorage.getItem('w14-chart-exercise-show') === '1'; } catch { return false; }
    });
    const options = ['A 圓餅圖', 'B 長條圖', 'C 折線圖', 'D 散佈圖'];

    const syncToRecords = (next) => {
        try {
            const summary = EXERCISE_ITEMS.map((item, i) =>
                `題${i + 1}：${next[i] || '（未選）'}（正解：${item.a}）`
            ).join('\n');
            const all = JSON.parse(localStorage.getItem('rib_think_records') || '{}');
            all['w14-chart-exercise'] = summary;
            localStorage.setItem('rib_think_records', JSON.stringify(all));
        } catch {}
    };

    const updateAnswer = (i, opt) => {
        const next = { ...answers, [i]: opt };
        setAnswers(next);
        try { localStorage.setItem('w14-chart-exercise-ans', JSON.stringify(next)); } catch {}
        syncToRecords(next);
    };
    const revealAnswers = () => {
        setShowAnswers(true);
        try { localStorage.setItem('w14-chart-exercise-show', '1'); } catch {}
    };
    const handleReset = () => {
        setAnswers({});
        setShowAnswers(false);
        try { localStorage.removeItem('w14-chart-exercise-ans'); localStorage.removeItem('w14-chart-exercise-show'); } catch {}
        syncToRecords({});
    };

    return (
        <div>
            <div className="flex flex-col gap-3">
                {EXERCISE_ITEMS.map((item, i) => (
                    <div key={i} className="p-3 rounded-[var(--radius-unified)] border border-[var(--border)] bg-white">
                        <p className="text-[12px] text-[var(--ink)] mb-2"><strong>{i + 1}.</strong> {item.q}</p>
                        <div className="flex flex-wrap gap-2">
                            {options.map(opt => (
                                <button
                                    key={opt}
                                    onClick={() => !showAnswers && updateAnswer(i, opt)}
                                    className="px-3 py-1 text-[11px] rounded-[var(--radius-unified)] border transition-colors"
                                    style={{
                                        borderColor: answers[i] === opt ? 'var(--accent)' : 'var(--border)',
                                        background: answers[i] === opt ? 'var(--accent)' : '#fff',
                                        color: answers[i] === opt ? '#fff' : 'var(--ink-mid)',
                                        fontWeight: answers[i] === opt ? 700 : 400,
                                        cursor: showAnswers ? 'default' : 'pointer',
                                    }}
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>
                        {showAnswers && (
                            <p className="mt-2 text-[11px]" style={{ color: answers[i] === item.a ? 'var(--success)' : '#DC2626' }}>
                                {answers[i] === item.a ? '✅ 正確！' : `❌ 正確答案：${item.a}`} — {item.hint}
                            </p>
                        )}
                    </div>
                ))}
            </div>
            <div className="flex items-center gap-3 mt-3">
                {!showAnswers ? (
                    <button
                        onClick={revealAnswers}
                        className="px-4 py-2 text-[12px] font-bold text-white rounded-[var(--radius-unified)] border-none cursor-pointer"
                        style={{ background: 'var(--accent)' }}
                    >
                        對答案
                    </button>
                ) : (
                    <button
                        onClick={handleReset}
                        className="px-4 py-2 text-[11px] rounded-[var(--radius-unified)] border cursor-pointer"
                        style={{ background: '#fff', borderColor: 'var(--border)', color: 'var(--ink-mid)' }}
                    >
                        重新作答
                    </button>
                )}
            </div>
        </div>
    );
};

/* ══════════════════════════════════════
 *  主頁面
 * ══════════════════════════════════════ */

const W14PageContent = () => {
    const { mode } = useMode();
    const { projector } = useProjector();
    const saved = readRecords();
    const myTopic = saved['w8-merged-topic'] || saved['w8-research-question'] || '';
    const myMethod = saved['w9-my-method'] || saved['w8-tool-method'] || '';
    /* W13 跨週帶入 */
    const w13TableLink = saved['w13-table-link'] || '';
    /* AI 使用模式 */
    const [w14AiMode, setW14AiMode] = useState(() => {
        try {
            const r = JSON.parse(localStorage.getItem('rib_think_records')) || {};
            return r['w14-ai-mode'] || '';
        } catch { return ''; }
    });

    const handleW14AiMode = (mode) => {
        setW14AiMode(mode);
        try {
            const r = JSON.parse(localStorage.getItem('rib_think_records')) || {};
            r['w14-ai-mode'] = mode;
            localStorage.setItem('rib_think_records', JSON.stringify(r));
        } catch {}
    };

    const steps = [
        {
            title: '選圖表',
            icon: <BarChart2 size={18} />,
            content: (
                <div className="flex flex-col gap-6 prose-zh">
                    <StepBriefing
                        lines={[
                            { label: '節奏', text: '跟老師做（第一節前 20 分鐘）' },
                            { label: '學', text: '5 種圖各自適合什麼情況（長條 / 折線 / 散佈 / 圓餅 / 混合）' },
                            { label: '做', text: '點開「選圖引導卡」挑出你的圖表類型，說得出選擇理由' },
                            { label: '練', text: '兩題演練確認判斷' },
                        ]}
                    />

                    {/* 名詞白話化：變項是什麼 — 深度補充 */}
                    <DepthBlock title="變項是什麼？">
                    <div className="p-4 rounded-[var(--radius-unified)] border-2 border-[#BFDBFE] bg-[#EFF6FF]">
                        <p className="text-[13px] font-bold text-[#1E40AF] mb-2">📖 先搞懂一個詞：變項</p>
                        <p className="text-[12px] text-[#1E3A8A] leading-relaxed mb-2">
                            「變項」就是<strong>會改變的因素</strong>——你的資料裡兩個會變的東西就是兩個變項。畫圖時通常分成：
                        </p>
                        <div className="grid md:grid-cols-2 gap-2 text-[11.5px] text-[#1E3A8A]">
                            <div className="bg-white border border-[#BFDBFE] rounded p-2.5">
                                <p className="font-bold mb-1">🅧 X 軸（橫）= 你想分組或排序的</p>
                                <p>例：年級、月份、組別、題目、行為類別</p>
                            </div>
                            <div className="bg-white border border-[#BFDBFE] rounded p-2.5">
                                <p className="font-bold mb-1">🅨 Y 軸（直）= 你想計算或比較的</p>
                                <p>例：人數、百分比、平均分數、次數、時間</p>
                            </div>
                        </div>
                        <p className="text-[11px] text-[#1E40AF] italic mt-2 leading-relaxed">
                            💡 例：「不同<strong className="text-[#DC2626]">年級</strong>（X）的<strong className="text-[#DC2626]">手機平均使用時數</strong>（Y）」——年級和使用時數都是變項。
                        </p>
                    </div>
                    </DepthBlock>

                    {/* 四大圖表卡 */}
                    <div className="flex items-center gap-2 mb-[-8px]">
                        <ContentTypeChip type="學" />
                        <p className="text-[12px] font-bold text-[var(--ink-mid)]">四大圖表速查</p>
                    </div>
                    <div className="w14-chart-grid">
                        {CHART_TYPES.map((c, i) => (
                            <div key={i} className="w14-chart-card">
                                <div className="w14-chart-header" style={{ color: c.color }}>
                                    {c.icon}
                                    <span>{c.name} ({c.eng})</span>
                                </div>
                                <div className="w14-chart-body">
                                    <p>{c.use}</p>
                                    <span className="w14-chart-keyword" style={{ background: c.bg, color: c.color }}>
                                        {c.keyword}
                                    </span>
                                    <p className="text-[10.5px] text-[var(--ink-light)] mt-2 leading-[1.55]">{c.methods}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* 口訣決策流程 */}
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <ContentTypeChip type="學" />
                            <p className="text-[13px] font-bold text-[var(--ink)]">💡 快速決策口訣</p>
                        </div>
                        <div className="w14-flow">
                            {DECISION_FLOW.map((d, i) => (
                                <div key={i} className="w14-flow-step">
                                    <div className="w14-flow-num" style={{ background: d.color }}>{d.num.replace(/[❶❷❸❹]/, String(i + 1))}</div>
                                    <span className="text-[var(--ink)]">{d.text}</span>
                                    <span className="w14-flow-arrow font-bold" style={{ color: d.color }}>{d.answer}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 🎤 訪談組專屬：口訣之後才說例外，邏輯才順 */}
                    <DepthBlock title="訪談組請看這裡">
                    <div className="bg-[#F5F3FF] border-2 border-[#7C3AED] rounded-[var(--radius-unified)] p-4 max-w-[760px]">
                        <p className="text-[13px] font-bold text-[#5B21B6] mb-2">🎤 訪談組 — 質性資料另闢蹊徑</p>
                        <p className="text-[11.5px] text-[#4C1D95] leading-relaxed mb-3">
                            上方 4 大圖表是針對<strong>數字資料</strong>設計的。訪談收到的是<strong>文字、引文、主題</strong>——硬畫成圓餅圖會被批評「把質性資料量化」（你只有 5 位受訪者，畫圓餅圖根本沒意義）。
                        </p>
                        <p className="text-[11.5px] font-bold text-[#5B21B6] mb-2">📋 訪談組常用的呈現方式：</p>
                        <div className="space-y-2 text-[11.5px]">
                            <div className="bg-white border-l-3 border-[#7C3AED] rounded-r p-2.5">
                                <p className="font-bold text-[#5B21B6] mb-0.5">① 引文表（quote table）— 最常用</p>
                                <p className="text-[#4C1D95]">主題 × 受訪者代表引文。直接讓受訪者的話「為自己說話」，比畫圖更有說服力。</p>
                                <p className="text-[#4C1D95] italic mt-0.5">例：主題「分心來源」→ 受訪者 A：「查完單字就順手滑 IG，半小時就過去了」／ 受訪者 B：「通知一跳出來就會分心」</p>
                            </div>
                            <div className="bg-white border-l-3 border-[#7C3AED] rounded-r p-2.5">
                                <p className="font-bold text-[#5B21B6] mb-0.5">② 主題矩陣 — 看誰提了什麼</p>
                                <p className="text-[#4C1D95]">表格：行 = 主題、欄 = 受訪者、格子 = 「✓ 有提到 / ✗ 沒提到 / ★ 強烈提到」。</p>
                                <p className="text-[#4C1D95] italic mt-0.5">用來看「哪個主題被多少人提到」，但不要強行量化（不要寫「80%」這種敘述）。</p>
                            </div>
                            <div className="bg-white border-l-3 border-[#7C3AED] rounded-r p-2.5">
                                <p className="font-bold text-[#5B21B6] mb-0.5">③ 主題網絡圖（進階）— 看主題之間的關係</p>
                                <p className="text-[#4C1D95]">節點 = 主題、連線 = 主題之間的關聯。例：「分心來源」連到「學習用途」連到「自我控制方式」。</p>
                            </div>
                        </div>
                        <details className="mt-3 bg-[#FEF3C7] border border-[#F59E0B]/40 rounded p-2.5">
                            <summary className="cursor-pointer text-[11.5px] font-bold text-[#92400E]">🤔 訪談組可以用長條圖嗎？（點開看注意事項）</summary>
                            <p className="text-[11px] text-[#78350F] leading-relaxed mt-2">
                                可以，但要小心：如果你 6 位受訪者中有 5 位提到「通知干擾」，畫成「通知干擾 83%」的長條圖會誤導讀者以為這是統計結論。
                                <br />
                                ✓ <strong>正確用法</strong>：標題寫「圖一：6 位受訪者提及各主題的人數（N=6）」，並在文字明確說「這是訪談 6 位學生的初步觀察，不代表全體」。
                                <br />
                                ✗ <strong>錯誤用法</strong>：直接寫「83% 高中生被通知干擾學習」（6 人不能推論到全體）。
                            </p>
                        </details>
                    </div>
                    </DepthBlock>

                    {/* 演練：圖表決策 */}
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <ContentTypeChip type="練" />
                            <p className="text-[13px] font-bold text-[var(--ink)]">✏️ 演練：圖表決策直覺訓練</p>
                        </div>
                        <p className="text-[12px] text-[var(--ink-mid)] mb-3">選出最適合的圖表類型，選完按「對答案」。</p>
                        <ChartExercise />
                    </div>

                    {/* 演練：圖表除錯 */}
                    <div className="flex items-center gap-2 mb-1">
                        <ContentTypeChip type="練" />
                        <p className="text-[12px] font-bold text-[var(--ink-mid)]">圖表除錯演練</p>
                    </div>
                    <div className="w14-case-card">
                        <div className="w14-case-header">✏️ 演練：圖表除錯</div>
                        <div className="w14-case-body">
                            <p><strong>情境：</strong>小明調查「你用手機做什麼？（可複選）」，得到學習 60%、社交 50%、娛樂 70%，加總 180%。他把這三個數字畫成圓餅圖。</p>
                            <p className="mt-2 font-bold text-[var(--ink)]">他錯在哪？正確應該用哪種圖表？</p>
                        </div>
                    </div>
                    <ThinkRecord
                        dataKey="w14-chart-debug"
                        prompt="小明的圓餅圖錯在哪？正確應該用什麼圖？為什麼？"
                        scaffold={['錯在：圓餅圖要求總和 100%，但複選題加總會...', '正確應該用___圖，因為...']}
                    />
                </div>
            ),
        },
        {
            title: '畫圖',
            icon: <BarChart2 size={18} />,
            content: (
                <div className="flex flex-col gap-6 prose-zh">
                    <StepBriefing
                        lines={[
                            { label: '節奏', text: '小組工作（課堂主時間）' },
                            { label: '做', text: '開 W13 分析表，依序走完下方四步驟，產出一張格式合規的圖' },
                            { label: '注意', text: '選圖類型和最終驗收是你的工作，不能交給 AI' },
                        ]}
                    />

                    {/* 動手前警戒語 — Step 2 只需要圖表標題規則，圖說紅線留到 Step 3 */}
                    <ResearcherRedlines mode="warning" stage="W14" ids={['L06']} />

                    {/* 從 W13 帶入分析表 */}
                    {(w13TableLink || w13W14Question) && (
                        <div className="p-4 rounded-[var(--radius-unified)] bg-[#F0F9FF] border-2 border-[#BAE6FD]">
                            <p className="text-[12px] text-[#0369A1] font-bold mb-2">📂 從 W13 帶過來</p>
                            {w13TableLink && (
                                <div className="mb-2">
                                    <p className="text-[11px] text-[#075985] font-bold uppercase tracking-wider mb-1">分析表連結</p>
                                    <p className="text-[12px] text-[#0C4A6E] break-all">{w13TableLink}</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ── 四步驟 Timeline ── */}
                    <div className="flex items-center gap-2 mb-1">
                        <ContentTypeChip type="做" />
                        <p className="text-[12px] font-bold text-[var(--ink-mid)]">四步驟依序完成</p>
                    </div>
                    <div className="relative">
                        {/* 垂直連接線 */}
                        <div className="absolute left-[19px] top-10 bottom-10 w-px bg-[var(--border-mid)]" />

                        {/* ① 草圖判讀 */}
                        <div className="relative flex gap-4 pb-8">
                            <div className="w-10 h-10 rounded-full bg-[#1E293B] text-white flex items-center justify-center font-bold text-[13px] shrink-0 z-10 shadow-sm">①</div>
                            <div className="flex-1 min-w-0 pt-1.5 flex flex-col gap-3">
                                <div>
                                    <p className="font-bold text-[14px] text-[var(--ink)] leading-snug">草圖判讀</p>
                                    <p className="text-[11px] font-mono text-[var(--ink-light)] mt-0.5">純人工 · 不能讓 AI 替你看</p>
                                </div>
                                <p className="text-[12.5px] text-[var(--ink-mid)] leading-relaxed">
                                    打開分析表，用自己的眼睛讀一輪，回答下面三件事——這是你研究的「眼力」訓練。
                                </p>
                                <Checklist
                                    dataKey="w14-pre-judgment"
                                    prompt="草圖判讀自評（自己想好再勾）"
                                    items={[
                                        '我選定了 X、Y 兩個變項',
                                        '我能口語描述預期會看到的趨勢',
                                        '我能用一句話講出最重要的發現',
                                    ]}
                                />
                            </div>
                        </div>

                        {/* ② 選圖表類型 */}
                        <div className="relative flex gap-4 pb-8">
                            <div className="w-10 h-10 rounded-full bg-[#1E293B] text-white flex items-center justify-center font-bold text-[13px] shrink-0 z-10 shadow-sm">②</div>
                            <div className="flex-1 min-w-0 pt-1.5 flex flex-col gap-3">
                                <div>
                                    <p className="font-bold text-[14px] text-[var(--ink)] leading-snug">選圖表類型</p>
                                    <p className="text-[11px] font-mono text-[var(--ink-light)] mt-0.5">純人工 · 套 Step 1 口訣</p>
                                </div>
                                <p className="text-[12.5px] text-[var(--ink-mid)] leading-relaxed">
                                    時間流動？比例？相關？比大小？選一個。<strong>這步絕不能交給 AI</strong>——選錯類型，AI 畫再美也是廢圖。
                                </p>
                                <ChartChoiceChecker />
                                <p className="text-[11.5px] text-[var(--ink-light)] leading-relaxed">
                                    🖊️ 圖表類型、理由、標題記在<strong className="text-[var(--ink-mid)]">小組 Google Slides / Doc</strong>，網頁只需選完 ChartChoiceChecker 即可。
                                </p>
                            </div>
                        </div>

                        {/* ③ 產生圖表 */}
                        <div className="relative flex gap-4 pb-8">
                            <div className="w-10 h-10 rounded-full bg-[var(--accent)] text-white flex items-center justify-center font-bold text-[13px] shrink-0 z-10 shadow-sm">③</div>
                            <div className="flex-1 min-w-0 pt-1.5 flex flex-col gap-3">
                                <div>
                                    <p className="font-bold text-[14px] text-[var(--ink)] leading-snug">產生圖表</p>
                                    <p className="text-[11px] font-mono text-[var(--ink-light)] mt-0.5">推薦 AI 畫圖 · 但你決定類型與標題</p>
                                </div>
                                {/* 格式速查：畫圖前先看 */}
                                <div className="rounded-[var(--radius-unified)] border-2 border-[#BFDBFE] bg-white overflow-hidden">
                                    <div className="bg-[#EFF6FF] px-3 py-2 border-b border-[#BFDBFE]">
                                        <p className="text-[11.5px] font-bold text-[#1E40AF]">📋 格式速查 · 畫圖前確認（自己做的研究圖也要標出處）</p>
                                    </div>
                                    <div className="p-4 pb-2">
                                        <div className="flex items-start gap-2 mb-3">
                                            <div className="flex gap-1 flex-shrink-0 mt-0.5">
                                                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#1E40AF] text-white text-[9px] font-bold">規1</span>
                                                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#DC2626] text-white text-[9px] font-bold">規3</span>
                                            </div>
                                            <p className="text-[13px] font-bold text-[var(--ink)] leading-snug">
                                                <span className="text-[#D97706]">圖一</span>：高一學生每天手機使用時數分布<span className="text-[#DC2626]"> (N=85)</span>
                                            </p>
                                        </div>
                                        <div className="mx-6 mb-1">
                                            <div className="flex items-end gap-2 h-24 border-b-2 border-l-2 border-[#CBD5E1] pb-0 pl-1">
                                                {[
                                                    { label: '≤1h', h: 30, pct: '12%' },
                                                    { label: '1–2h', h: 55, pct: '25%' },
                                                    { label: '2–4h', h: 85, pct: '38%' },
                                                    { label: '4–6h', h: 45, pct: '18%' },
                                                    { label: '≥6h', h: 18, pct: '7%' },
                                                ].map((b, i) => (
                                                    <div key={i} className="flex-1 flex flex-col items-center justify-end">
                                                        <span className="text-[8.5px] text-[#059669] mb-0.5">{b.pct}</span>
                                                        <div className="w-full rounded-t-[2px]" style={{ height: b.h + 'px', background: '#3B82F6' }} />
                                                        <span className="text-[8px] text-[#64748B] mt-1">{b.label}</span>
                                                    </div>
                                                ))}
                                            </div>
                                            <p className="text-[9px] text-center text-[#94A3B8] mt-1">每天使用時數（小時）</p>
                                        </div>
                                        <div className="flex items-center gap-2 mt-2 mb-1">
                                            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#059669] text-white text-[9px] font-bold flex-shrink-0">規2</span>
                                            <p className="text-[10.5px] text-[var(--ink)]">資料來源：本研究問卷；研究者整理，以 Gemini Pro（思考模式+Canvas）協助繪製並驗收</p>
                                        </div>
                                    </div>
                                    <div className="border-t border-[#BFDBFE]">
                                        <div className="w14-format-grid">
                                            {FORMAT_RULES.map((r, i) => (
                                                <div key={i} className="w14-format-row">
                                                    <span className="w14-format-label">
                                                        <span className="inline-block text-[9px] font-bold px-1 py-0.5 rounded bg-[#EFF6FF] text-[#1E40AF] mr-1">{r.kind}</span>
                                                        {r.label}
                                                    </span>
                                                    <div>
                                                        <p className="text-[var(--ink)] font-bold">{r.rule}</p>
                                                        {!projector && <p className="text-[11px] mt-1 opacity-70">{r.example}</p>}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="p-3 rounded-[var(--radius-unified)] border border-[#FCD34D] bg-[#FFFBEB] flex items-start gap-2">
                                    <AlertTriangle size={14} className="text-[#92400E] shrink-0 mt-0.5" />
                                    <p className="text-[12px] text-[#78350F] leading-relaxed m-0">
                                        <strong>N 值為什麼要標？</strong>「80% 的人有壓力」— 100 人的 80% 和 5 人的 80%，說服力天差地遠。標題旁一定要有 (N=有效樣本數)。
                                    </p>
                                </div>
                                {/* AI Prompt */}
                                <div className="p-4 rounded-[var(--radius-unified)] border-2 border-[var(--accent)] bg-[#F8F8FB] flex flex-col gap-3">
                                    <p className="text-[12px] text-[var(--ink-mid)] leading-relaxed flex items-center gap-2">
                                        <Bot size={14} className="text-[var(--accent)] shrink-0" />
                                        把「類型 + 變項 + 標題」交給 <strong>Gemini Pro · 思考模式 + Canvas</strong> 畫圖。AI 只能畫你選的類型，不能擅自換。
                                    </p>
                                    <PromptBlock text={`【任務】
依我提供的圖表設定與分析表，幫我畫成一張圖。

【重要規則】
1. 請嚴格使用我指定的圖表類型，不可自行更換。
2. 不可自行新增、刪除或合併變項。
3. 不要替我寫圖說；圖說由研究者自己撰寫。
4. 若資料有缺漏或格式看不懂，請先指出問題，不要自行猜測補值。

【我的圖表設定】
- 變項：X = ___，Y = ___
- 我選的圖表類型：___（折線圖／圓餅圖／長條圖／散佈圖）
- 圖表標題：圖一：___（N=___）
- 樣本數：N = ___

【分析表】
___
（可貼 CSV 文字、Google Sheets 可檢視連結，或上傳 Excel／CSV 檔案）

【請輸出】
1. 用我指定的圖表類型畫出圖。
2. 標題放在圖上方，並標出 N 值。
3. 圖下方標註：
   資料來源：本研究資料；研究者整理，並以 Gemini Pro（思考模式＋Canvas）協助繪製與驗收。
4. 座標軸標籤清楚，刻度合理；長條圖與折線圖的 Y 軸原則上從 0 開始。
5. 不要替我寫圖說。

【請在圖後附上自我檢查】
- 是否使用我指定的圖表類型：是／否
- 是否標出 N 值：是／否
- 是否標出資料來源：是／否
- Y 軸是否從 0 開始：是／否／不適用
- 是否有自行新增、刪除或合併變項：否`} />
                                    <div className="rounded-[var(--radius-unified)] border border-[#D97706] bg-[#FEF3C7] p-3">
                                        <p className="text-[11.5px] font-bold text-[#92400E] mb-1">使用前先自己完成：</p>
                                        <p className="text-[11.5px] text-[#78350F] leading-[1.9] m-0">
                                            選變項　→　選圖表類型　→　寫圖表標題　→　備妥 W13 分析表
                                        </p>
                                        <p className="text-[11.5px] text-[#92400E] leading-[1.9] mt-1.5 mb-0 pt-1.5 border-t border-[#D97706]/40">
                                            <strong>只要使用 AI 協助製圖，就要保留完整對話並完成 AI-RED。</strong>
                                        </p>
                                    </div>
                                </div>
                                <details className="rounded-[var(--radius-unified)] border border-[var(--border)] bg-white">
                                    <summary className="cursor-pointer px-5 py-3 flex items-center justify-between hover:bg-[var(--paper-warm)] transition-colors">
                                        <span className="text-[12px] font-bold text-[var(--ink)]">🛠️ 替代路線：我想自己用 Sheets/Excel/Canva 畫</span>
                                        <span className="text-[10px] font-mono text-[var(--ink-light)]">▼</span>
                                    </summary>
                                    <div className="border-t border-[var(--border)] p-4 space-y-2 text-[12px] text-[var(--ink-mid)] leading-relaxed">
                                        <p><strong>Google Sheets：</strong>選資料 → 插入 → 圖表 → 編輯類型/標題（最快）</p>
                                        <p><strong>Excel：</strong>選資料 → 插入 → 圖表 → 設計／格式（功能多）</p>
                                        <p><strong>Canva：</strong>圖表元素 → 改數據 → 換顏色（最美）</p>
                                    </div>
                                </details>
                            </div>
                        </div>

                        {/* ④ 人工驗收 */}
                        <div className="relative flex gap-4">
                            <div className="w-10 h-10 rounded-full bg-[#D97706] text-white flex items-center justify-center font-bold text-[13px] shrink-0 z-10 shadow-sm">④</div>
                            <div className="flex-1 min-w-0 pt-1.5 flex flex-col gap-3">
                                <div>
                                    <p className="font-bold text-[14px] text-[var(--ink)] leading-snug">人工驗收</p>
                                    <p className="text-[11px] font-mono text-[var(--ink-light)] mt-0.5">4 個格式規定逐一確認</p>
                                </div>
                                <p className="text-[12.5px] text-[var(--ink-mid)] leading-relaxed">
                                    AI 出錯不是你的責任，但驗收沒做就是你的責任。座標軸、類型沒被偷換、數字對得上，逐項勾選後才算完成。
                                </p>
                                <DepthBlock title="AI 畫錯怎麼修 prompt？">
                                    <div className="text-[11px] text-[#78350F] leading-relaxed space-y-1.5">
                                        <p><strong>圖表類型被換</strong> → 加「請嚴格使用我選的 ___ 類型，禁止更換」</p>
                                        <p><strong>標題缺 N 值</strong> → 加「標題格式必須是『圖一：___ (N=___)』」</p>
                                        <p><strong>沒資料來源</strong> → 加「圖下方標『資料來源：本研究資料；研究者以 Gemini Pro Canvas 協助繪製並驗收』」</p>
                                        <p><strong>Y 軸截斷</strong> → 加「Y 軸從 0 開始」</p>
                                        <p><strong>數字對不上</strong> → 把分析表整段重貼，並說「請對照原始資料逐筆驗算」</p>
                                        <p className="italic text-[#92400E]">💡 重畫 1–2 次很正常。</p>
                                    </div>
                                </DepthBlock>
                                <Checklist
                                    dataKey="w14-validation-check"
                                    prompt="格式規定驗收"
                                    items={[
                                        '標題在上方',
                                        'N 值有標出',
                                        '資料來源在下方',
                                    ]}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            ),
        },
        {
            title: '寫圖說',
            icon: <Lightbulb size={18} />,
            content: (
                <div className="flex flex-col gap-6 prose-zh">
                    <StepBriefing
                        lines={[
                            { label: '節奏', text: '個人完成，課堂 or 課後' },
                            { label: '學', text: '圖說 = 描述（你看到什麼數字）+ 推論（這可能代表什麼）' },
                            { label: '做', text: '兩層都先自己寫，AI 只能逐句檢核——不能替你寫' },
                        ]}
                    />

                    {/* 圖說寫作的兩條紅線 — 這裡才開始教圖說，L08/L09 在此出現才對 */}
                    <ResearcherRedlines mode="warning" stage="W14" ids={['L08', 'L09']} />

                    {/* 概念：描述 vs 推論 */}
                    <div className="flex items-center gap-2 mb-1">
                        <ContentTypeChip type="學" />
                        <p className="text-[12px] font-bold text-[var(--ink-mid)]">描述 vs 推論 — 圖說的兩層結構</p>
                    </div>
                    <div className="w14-dual-grid">
                        <div className="w14-dual-card w14-dual-desc">
                            <p className="font-bold mb-2">📊 描述（客觀事實）</p>
                            <p>看到了什麼？報事實、報數字。</p>
                            <p className="mt-2 text-[11px] italic">例：根據圖一，80% 的學生在睡前滑手機超過一小時。</p>
                        </div>
                        <div className="w14-dual-card w14-dual-infer">
                            <p className="font-bold mb-2">💡 推論（主觀見解）</p>
                            <p>這代表什麼？解釋意義、推測原因。</p>
                            <p className="mt-2 text-[11px] italic">例：這可能反映出學生放學後缺乏其他休閒管道。</p>
                        </div>
                    </div>

                    {/* 常見錯誤 */}
                    <DepthBlock title="常見錯誤">
                    <div className="p-4 rounded-[var(--radius-unified)] border border-[#FCA5A5] bg-[#FEF2F2]">
                        <p className="text-[12px] text-[#DC2626] font-bold mb-2">⚠️ 常見錯誤</p>
                        <div className="text-[12px] text-[#991B1B] leading-relaxed flex flex-col gap-1">
                            <span>1. <strong>只報數字不推論</strong>：像機器人，沒有分析價值</span>
                            <span>2. <strong>亂推論</strong>：沒有數據支持就硬說，要說「可能」而非「一定」</span>
                            <span>3. <strong>把 38% 說成「絕大多數」</strong>：量詞要精準</span>
                        </div>
                    </div>
                    </DepthBlock>

                    {/* 暖身：整合練習 */}
                    <div className="flex items-center gap-2 mb-1">
                        <ContentTypeChip type="練" />
                        <p className="text-[12px] font-bold text-[var(--ink-mid)]">暖身練習</p>
                    </div>
                    <div className="w14-case-card">
                        <div className="w14-case-header">✏️ 暖身練習：手機使用問卷分析</div>
                        <div className="w14-case-body">
                            <p><strong>數據：</strong>N=85 份有效問卷中，每天使用手機 4 小時以上的學生有 52 人（61%）；其中 78% 的主要用途是短影音與社交，段考平均落在 70 分以下者佔 64%。</p>
                            <p className="mt-2">用「描述＋推論」公式，把這幾個數字整合成一段完整的說明。<strong>你能描述的和你能推論的，分開說清楚。</strong></p>
                        </div>
                    </div>
                    <ThinkRecord dataKey="w14-case-3" prompt="暖身：用描述＋推論公式寫出完整說明" scaffold={['描述：根據圖一，N=85 份問卷中...（報數字，不加解釋）', '推論：這可能顯示出...（謹慎判斷，說「可能」而非「一定」）']} />

                    {/* 分界線：從練習切換到小組 */}
                    <div className="flex items-center gap-2 mb-[-4px]">
                        <ContentTypeChip type="做" />
                        <p className="text-[12px] font-bold text-[var(--ink-mid)]">小組實作</p>
                    </div>
                    <div className="rounded-[var(--radius-unified)] border-2 border-[var(--accent)] bg-[#F8F8FB] px-4 py-3 flex items-center gap-3">
                        <span className="text-[18px]">✏️</span>
                        <div>
                            <p className="text-[13px] font-bold text-[var(--accent)]">輪到你了 — 對你們小組那張圖說話</p>
                            <p className="text-[11.5px] text-[var(--ink-mid)] mt-0.5">把下面的描述＋推論，寫在你們的<strong className="text-[var(--ink)]">小組 Google Slides / Doc</strong>。</p>
                        </div>
                    </div>

                    {/* ⑤ 描述 */}
                    <div className="p-4 rounded-[var(--radius-unified)] border border-[var(--border)] bg-[var(--paper-warm)]">
                        <p className="text-[13px] font-bold text-[var(--ink)] mb-1">🔵 描述 — 報你看到的數字事實（AI 可協助逐句檢核）</p>
                        <p className="text-[12px] text-[var(--ink-mid)] leading-relaxed">
                            先自己寫，寫完再用下方 prompt 請 AI 核對。AI 檢核，不代寫。
                        </p>
                    </div>
                    <details className="rounded-[var(--radius-unified)] border border-[var(--border)] bg-white">
                        <summary className="cursor-pointer px-4 py-2.5 hover:bg-[var(--paper-warm)] transition-colors flex items-center gap-2">
                            <span className="text-[12px] text-[var(--ink-mid)]">
                                🤖 <strong className="text-[var(--ink)]">AI 描述檢核 prompt</strong>（點開複製 · 寫完描述句再用）
                            </span>
                            <span className="ml-auto text-[10px] font-mono text-[var(--ink-light)]">▼</span>
                        </summary>
                        <div className="border-t border-[var(--border)] p-3">
                            <PromptBlock text={`這是我自己寫的「圖一」描述句：___

請檢核，不要替我重寫：
1. 數字和趨勢有沒有跟圖對不上？
2. 量詞精不精準？（例：38% 不能說成「絕大多數」）
3. 有沒有不小心寫了「因為」「所以」這類因果詞（那是推論，不是描述）？
4. 句尾有沒有標「（如圖一所示）」？

請逐句指出問題＋給修改建議，最後的描述句由我自己改。`} />
                        </div>
                    </details>

                    {/* ⑥ 推論 */}
                    <div className="p-4 rounded-[var(--radius-unified)] border-2 border-[#FCA5A5] bg-[#FEF2F2]">
                        <p className="text-[13px] font-bold text-[#991B1B] mb-1 flex items-center gap-2">
                            <ShieldAlert size={15} /> 🔴 推論 — 解釋你的資料（純人工 · 不能交給 AI）
                        </p>
                        <p className="text-[12px] text-[#7F1D1D] leading-relaxed">
                            解釋意義、推測原因——<strong>這是研究的靈魂</strong>。自己寫，粗糙沒關係；下一步可選 AI 壓測找盲點。
                        </p>
                        <DepthBlock title="為什麼推論不能外包？">
                            <div className="text-[11px] text-[#7F1D1D] leading-relaxed space-y-1">
                                <p>· <strong>描述</strong>：事實有對錯，AI 能逐句核對數字。</p>
                                <p>· <strong>推論</strong>：「為什麼會這樣」要回到你的研究問題、現場脈絡——AI 沒有這些，給的解釋方向不是你的。</p>
                                <p className="italic mt-1">💡 老師抽問：「你為什麼推論是 ___？」答不出來 = 你沒做研究。</p>
                            </div>
                        </DepthBlock>
                    </div>
                    <div className="text-[11.5px] text-[var(--ink-light)] leading-relaxed border-t border-[var(--border)] pt-3">
                        🖊️ 描述句＋推論句都寫在<strong className="text-[var(--ink-mid)]">小組 Google Slides / Doc</strong>，完成後截圖上傳 Classroom。說「可能」，不說「一定」。
                    </div>
                </div>
            ),
        },
        {
            title: '進階·AI 壓力測試（可選）',
            icon: <Lightbulb size={18} />,
            content: (
                <div className="flex flex-col gap-6 prose-zh">
                    <StepBriefing
                        lines={[
                            { label: '做', text: '把圖 + 圖說丟給 AI 當嚴格教練找盲點，可跳過' },
                        ]}
                    />
                    {/* 開場：進階定位 */}
                    <div className="p-5 rounded-[var(--radius-unified)] border-2 border-[var(--accent)] bg-[#F8F8FB]">
                        <p className="text-[15px] font-bold text-[var(--accent)] mb-2">🥊 已完成基本要求 · 要不要被 AI 嚴格教練檢一輪</p>
                        <p className="text-[12px] text-[var(--ink)] leading-relaxed">
                            Step 2+3 你已完成圖表、描述、推論的基本要求。
                            這一步是<strong>進階訓練</strong>：請 AI 從研究方法老師角度找你忽略的趨勢、警告過度推論——
                            挖出你自己看不到的盲點。
                            <strong>用了 AI 一定要做判斷取捨（不能照單全收），並繳完整對話。</strong>
                        </p>
                    </div>

                    {/* 跨工具：資料分析檢核站 */}
                    <div className="bg-[var(--paper-warm)] border border-[var(--border)] rounded-[var(--radius-unified)] p-3 flex items-center justify-between gap-3">
                        <p className="text-[12px] text-[var(--ink-mid)] leading-relaxed">
                            💡 想看更進階的 5 法分析 prompt？回 <strong className="text-[var(--ink)]">資料分析檢核站</strong>（5 法 × Step 1-5 速查，自學用）。
                        </p>
                        <a
                            href="/analysis-station"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 bg-[var(--accent)] text-white px-3 py-1.5 rounded-[var(--radius-unified)] font-bold text-[12px] hover:opacity-90 transition-opacity no-underline flex-shrink-0"
                        >
                            📚 開範本庫
                        </a>
                    </div>

                    {/* AI 協作三原則（W14 角色：反思鏡）— 深度補充 */}
                    <DepthBlock title="AI 使用提醒">
                        <p className="text-[11.5px] text-[var(--ink-mid)] italic leading-relaxed mb-2">
                            💡 W14 的 AI 角色叫<strong className="text-[var(--ink)]">「反思鏡」</strong>——不論你下方選教學型／驗收型，AI 都是幫你戳「你沒看到的角度」，不是給你標準答案。
                        </p>
                        <AICollaborationPrinciples week="14" role="mirror" compact={false} />
                    </DepthBlock>

                    {/* AI 模式選擇 */}
                    <AIModePicker week="14" taskName="進階壓力測試" onChange={handleW14AiMode} />

                    {/* standalone */}
                    {w14AiMode === 'standalone' && (
                        <div className="rounded-[var(--radius-unified)] border-2 border-[#BFDBFE] bg-[#EFF6FF] p-5">
                            <p className="text-[14px] font-bold text-[#1E40AF] mb-2">🚫 你選擇不做進階壓力測試</p>
                            <p className="text-[12px] text-[#1E3A8A] leading-relaxed">
                                完全 OK——Step 2+3 基本要求已達標。直接到 Step 6 繳交即可（AI-RED 留空不會扣分）。
                            </p>
                        </div>
                    )}

                    {/* teach */}
                    {w14AiMode === 'teach' && (
                        <div className="rounded-[var(--radius-unified)] border-2 border-[#86EFAC] bg-[#F0FDF4] p-5 space-y-3">
                            <p className="text-[14px] font-bold text-[#166534] flex items-center gap-2">
                                🎓 教學型 Prompt（AI 教我這份資料還能看出什麼）
                            </p>
                            <p className="text-[12px] text-[#166534] leading-relaxed">
                                如果 Step 4 推論卡關，可以請 Gemini 教你「這份資料還有哪些角度可以看」——
                                但<strong>不要直接抄它的推論</strong>，看完範例自己回 Step 4「寫圖說」重寫。
                            </p>
                            <PromptBlock text={`我有一張圖（已附），描述層我寫了：___

【請教我】
1. 同一份資料，從研究方法老師角度，還有哪 3 個角度可以推論？
2. 每個角度給 1 句範例（不超過 15 字），讓我參考但不要寫長篇
3. 提醒我哪些是「過度推論」的紅線（哪些不能寫）

【不要做】
- 不要寫完整推論段落
- 我看完範例會自己回 Step 4 推論欄改寫`} />
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <ContentTypeChip type="做" />
                                    <p className="text-[13px] font-bold text-[var(--ink)]">✏️ 反思紀錄（AI 教完後填）</p>
                                </div>
                                <ThinkRecord
                                    dataKey="w14-teach-reflection"
                                    prompt="教學型反思（AI 教完後寫）"
                                    scaffold={[
                                        'AI 給我哪 3 個角度？',
                                        '我要採納哪些回 Step 4 改寫推論：',
                                    ]}
                                />
                            </div>
                        </div>
                    )}

                    {/* verify */}
                    {w14AiMode === 'verify' && (
                        <>
                            {/* 第①步 找盲點 */}
                            <div className="p-5 rounded-[var(--radius-unified)] border-2 border-[#7C3AED] bg-[#F5F3FF]">
                                <p className="text-[14px] font-bold text-[#5B21B6] mb-2 flex items-center gap-2">
                                    🔍 第①步 · 請 AI 找出你忽略的盲點
                                </p>
                                <p className="text-[12px] text-[#4C1D95] leading-relaxed mb-3">
                                    高一學生分析力還在長——AI 可以戳出你<strong>沒看到的角度</strong>。注意：AI 只給線索，判斷由你。
                                </p>
                                <PromptBlock text={`【我的圖】（附圖或貼資料）
【我的判讀】
- 預期趨勢：___
- 預期最重要的發現：___

【請從研究方法老師角度幫我做兩件事】
1. 找出我這份資料裡，可能有但我沒注意到的 3 個趨勢／模式
2. 標出 1-2 個「乍看像趨勢、但其實樣本不足以支持」的點，提醒我不要過度解讀

不要替我寫結論，只給我提示——「也許可以注意 ___」這種句型。`} />
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <ContentTypeChip type="做" />
                                    <p className="text-[13px] font-bold text-[var(--ink)]">✏️ 盲點紀錄（① 跑完後填）</p>
                                </div>
                                <ThinkRecord
                                    dataKey="w14-ai-blindspot"
                                    prompt="① AI 找到的盲點 / 我沒注意到的趨勢"
                                    scaffold={[
                                        'AI 指出我可能忽略的趨勢：',
                                        'AI 警告我不要過度解讀的點：',
                                        '我採納哪些、不採納哪些：',
                                    ]}
                                />
                            </div>

                            {/* 第②步 推論壓力測試 */}
                            <div className="p-4 rounded-[var(--radius-unified)] border-2 border-[#7C3AED] bg-[#F5F3FF]">
                                <p className="text-[14px] font-bold text-[#5B21B6] mb-2 flex items-center gap-2">
                                    🥊 第②步 · AI 推論壓力測試
                                </p>
                                <p className="text-[12px] text-[#4C1D95] leading-relaxed mb-3">
                                    推論最容易踩兩個雷：
                                    <br />① <strong>過度推論</strong>：你只訪問了 30 個本校學生，卻寫成「全國高中生都這樣想」。
                                    <br />② <strong>單一原因</strong>：只想到一個解釋就停。要列 2-3 個可能。
                                    <br />讓 AI 幫你壓力測試這兩個雷——但別直接抄 AI 的修改。
                                </p>
                                <PromptBlock text={`接續上一輪。

【我的描述】___（貼）
【我的推論】___（貼）
【樣本資訊】N=___，對象是 ___

【請壓力測試】
1. 我的推論有沒有過度推論？哪些用詞要加「可能」「推測」「在 ___ 範圍內」？
2. 除了我寫的這個原因，還有哪 2 個合理但我沒想到的解釋？
3. 我的描述有沒有量詞不精準的地方？

只給檢查與建議，不要替我改寫——改寫由我自己來。`} />
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <ContentTypeChip type="做" />
                                    <p className="text-[13px] font-bold text-[var(--ink)]">✏️ 壓力測試紀錄（② 跑完後填）</p>
                                </div>
                                <ThinkRecord
                                    dataKey="w14-ai-pressure-test"
                                    prompt="② AI 壓力測試後我做了哪些修正"
                                    scaffold={[
                                        'AI 指出的問題：',
                                        '我採納哪些建議：',
                                        '我修正了什麼（描述／推論的具體用詞）：',
                                    ]}
                                />
                            </div>

                            <div className="p-4 rounded-[var(--radius-unified)] border-2 border-[var(--accent)] bg-[#F8F8FB]">
                                <p className="text-[12px] font-bold text-[var(--accent)] mb-2">📝 用 AI 修完，回 Step 4「寫圖說」覆蓋描述/推論欄</p>
                                <p className="text-[11px] text-[var(--ink-mid)] leading-relaxed">
                                    若採納 AI 建議，<strong>回 Step 4 覆蓋描述/推論欄位</strong>，匯出時就會是修飾版。沒覆蓋＝以自寫版為準。
                                </p>
                            </div>

                            {/* AI-RED 精簡反思紀錄 */}
                            <AIREDNarrative week="14" hint="本週用 AI 進階壓測：A=使用的工具 / I=找盲點+壓測 prompt / R=AI 找到的盲點+風險 / E=我同意/不同意哪些 / D=採納哪些修正" />
                        </>
                    )}

                    {!w14AiMode && (
                        <div className="rounded-[var(--radius-unified)] border border-[var(--border)] bg-[var(--paper-warm)] p-3">
                            <p className="text-[12px] text-[var(--ink-mid)] leading-relaxed">
                                ☝️ 上方先選一個 AI 使用模式：教學型（推論卡關）／驗收型（找盲點+壓測）／不用（基本要求已達標）。
                            </p>
                        </div>
                    )}

                    {/* 雷 #11 改寫練習 — 推論寫完後馬上練，趁觀念最新鮮（個人繳交項）*/}
                    <div className="flex items-center gap-2 mb-1">
                        <ContentTypeChip type="做" />
                        <p className="text-[12px] font-bold text-[var(--ink-mid)]">雷 #11 改寫練習（個人繳交項）</p>
                    </div>
                    <TrapRewritePractice
                        trapNumber={11}
                        stage="W14"
                        title="散佈圖圖說「明顯」過度修飾"
                        wrong="整體而言，睡眠時數較高的學生，專注力分數明顯較高。"
                        issue="「明顯」需要相關係數（r 值）或統計檢定支撐。N=22 沒做任何檢定，圖看起來有趨勢就斷言「明顯」屬於過度修飾。"
                        hint="把「明顯」拿掉。改成保守的觀察用語——「初步」「看似」「傾向」。"
                        shouldDo="N=22 學生中，睡眠時數較高的學生，專注力分數初步看似較高（傾向隨睡眠時數遞增）。"
                        dataKey="w14-trap-rewrite-11"
                    />
                </div>
            ),
        },
                {
            title: '回顧繳交',
            icon: <FileText size={18} />,
            content: (
                <div className="flex flex-col gap-6 prose-zh">
                    <StepBriefing
                        lines={[
                            { label: '交出', text: '小組：把圖表上傳 Classroom（圖 + 圖說，套格式規定）' },
                            { label: '交出', text: '個人：頁面上方「我的紀錄」匯出 → 貼 Classroom（含自我遷移、AI-RED 如有）' },
                        ]}
                    />
                    <div className="p-4 rounded-[var(--radius-unified)] border border-[var(--border)] bg-[var(--paper-warm)]">
                        <p className="text-[14px] font-bold text-[var(--ink)] mb-1">📋 今天學了兩件事</p>
                        <p className="text-[12px] text-[var(--ink-mid)] leading-relaxed">
                            選對盤子（圖表）＋ 幫一張圖寫說明（描述＋推論）。
                            <br />但記住：今天學的是針對<strong>一張圖</strong>的局部說明。下週 W15 要升級為<strong>整份研究的結論</strong>。
                        </p>
                    </div>

                    {/* 雙線繳交主卡 — W14 期中接點 */}
                    <div className="bg-white border-2 border-[#10B981] rounded-[var(--radius-unified)] overflow-hidden">
                        <div className="bg-[#10B981] text-white px-4 py-2 font-bold text-[13px]">
                            📦 W14 結束前完成兩類繳交
                        </div>
                        <div className="p-4 space-y-4">
                            {/* 小組作業 */}
                            <div className="border-l-4 border-[#0284C7] bg-[#F0F9FF] rounded-r-[6px] p-3">
                                <p className="font-bold text-[13.5px] text-[#075985] mb-1.5">一、小組作業｜把圖表上傳 Classroom</p>
                                <p className="text-[12.5px] text-[#0C4A6E] leading-[1.85] mb-1.5">
                                    你們小組的第一張分析圖 ＋ 圖說，上傳到 Classroom 老師指定的作業區。
                                </p>
                                <ul className="text-[12px] text-[#0C4A6E] leading-[1.85] list-disc pl-5 space-y-0.5">
                                    <li>圖：套 4 個格式規定（標題／軸標籤／樣本數／來源）</li>
                                    <li>圖說：描述（數字事實）＋ 推論（謹慎判斷，不過度斷言）</li>
                                </ul>
                                <p className="text-[11.5px] text-[#0C4A6E] italic mt-2 pt-2 border-t border-[#0284C7]/30">
                                    💡 評分重點：圖說有沒有分層、推論有沒有說「可能」、樣本限制有沒有交代。
                                </p>
                            </div>

                            {/* 個人作業 */}
                            <div className="border-l-4 border-[#7C3AED] bg-[#F5F3FF] rounded-r-[6px] p-3">
                                <p className="font-bold text-[13.5px] text-[#5B21B6] mb-1.5">二、個人作業｜匯出網頁紀錄 → 貼 Classroom</p>
                                <p className="text-[12.5px] text-[#4C1D95] leading-[1.85] mb-2">
                                    點頁面上方的 <strong>「我的紀錄」</strong>，匯出本週填寫內容，貼到 Classroom 老師開的文件。重點三件：
                                </p>
                                <ul className="text-[12px] text-[#4C1D95] leading-[1.85] list-decimal pl-5 space-y-0.5">
                                    <li><strong>雷 #11 改寫練習</strong>（把「明顯」改成謹慎版）</li>
                                    <li><strong>自我遷移</strong>（我們組最危險的紅線，一句話）</li>
                                    <li><strong>AI-RED 敘事紀錄</strong>（若有用 AI 工具）</li>
                                </ul>
                                <p className="text-[11.5px] text-[#4C1D95] italic mt-2 pt-2 border-t border-[#7C3AED]/30">
                                    💡 評分重點：你知道哪裡不能說過頭——不是填滿每格，是看你有沒有詮釋責任感。
                                </p>
                            </div>

                            {/* 繳交收尾 */}
                            <div className="bg-[#FEF3C7] border border-[#F59E0B] rounded-[6px] p-3">
                                <p className="text-[12.5px] font-bold text-[#92400E] leading-[1.85]">
                                    ✅ 兩件都完成後，到 <strong>Classroom 按下「繳交」</strong>。
                                </p>
                                <p className="text-[11.5px] text-[#92400E] italic mt-1.5">
                                    小組交圖表，個人交網頁紀錄。
                                </p>
                            </div>
                        </div>
                    </div>


                    {/* AI-RED 敘事紀錄 — standalone 模式提示，其餘直接顯示 */}
                    {/* 學期 AI 協作反思（從 W17 移過來——這週的「人 vs AI 分工」最清楚，反思最有素材）*/}
                    <div className="mt-6 p-5 rounded-[var(--radius-unified)] border-2 border-[#D97706] bg-[#FEF3C7]">
                        <div className="flex items-start justify-between mb-2 gap-2">
                            <div className="flex items-center gap-2">
                                <ContentTypeChip type="交出" />
                                <p className="text-[14px] font-bold text-[#92400E]">🎯 學期 AI 協作反思（W14 寫，W17 抽問）</p>
                            </div>
                            <span className="text-[10px] font-mono text-[#92400E] bg-white px-2 py-0.5 rounded border border-[#D97706] flex-shrink-0">跨週作業</span>
                        </div>
                        <p className="text-[12px] text-[#78350F] leading-relaxed mb-3">
                            這週你親身經歷了「人選圖表類型／驗收4 個格式規定／先寫描述與推論」vs「AI 協助畫圖／檢核描述／壓測推論」這套分工——是整學期 AI 協作分工最清楚的一次。<br />
                            趁這個體感最強的時刻，回頭看：<strong>從 W1 模仿遊戲到今天，你跟 AI 共事最讓你改變想法的一次是什麼？</strong>
                        </p>
                        <div className="bg-white border border-[#FCD34D] rounded p-3 mb-3 text-[11.5px] text-[#92400E] leading-relaxed">
                            📌 <strong>不是評分作業，但 W17 Gallery Walk 當天老師會隨機點 3 位同學現場分享你寫的內容</strong>——空白或敷衍會很尷尬。寫具體的事件、具體的轉變，3-5 分鐘可以寫完。
                        </div>
                        <ThinkRecord
                            dataKey="w14-semester-reflection"
                            prompt="這學期跟 AI 協作的經驗，最讓你改變想法的是什麼？（具體寫一個事件 + 你的轉變）"
                            placeholder="例：我原本以為 AI 給的建議都該照單全收，但 W11 那次我的問卷被 AI 改到完全不像我自己的研究——那次之後我才真的懂『AI 給選項，人做選擇』的意思。"
                            scaffold={[
                                '我最初對 AI 的看法是…',
                                '一個讓我改變想法的具體事件（哪一週、發生什麼、你做了什麼）：…',
                                '現在我對「人機協作」的理解是…',
                            ]}
                            rows={6}
                        />
                    </div>

                    {/* 本週結束，你應該要會 — B 標準格式 */}
                    <div className="bg-white border border-[var(--border)] rounded-[var(--radius-unified)] overflow-hidden mb-4">
                        <div className="p-4 px-5 bg-[var(--paper-warm)] border-b border-[var(--border)] font-bold text-[13px]">
                            ✅ 本週結束，你應該要會
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-[1px] bg-[var(--border)]">
                            {[
                                                '為自己的數據選對圖表類型並說清楚理由',
                                                '把畫圖技術交給 AI，自己用4 個格式規定驗收圖表',
                                                '描述、推論都先自己寫——描述讓 AI 逐句檢核、推論讓 AI 壓測風險，但都不外包',
                                                '若選用 AI 進階壓測：知道過度推論／單一原因兩大雷並做判斷',
                            ].map((item, i) => (
                                <div key={i} className="p-4 px-5 bg-white flex items-start gap-3">
                                    <span className="text-[var(--success)] text-[16px] mt-0.5 flex-shrink-0">✓</span>
                                    <span className="text-[13px] text-[var(--ink-mid)] leading-relaxed">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 個人繳交操作說明 */}
                    <div className="rounded-[var(--radius-unified)] border-2 border-[#7C3AED] bg-[#F5F3FF] p-4">
                        <p className="text-[13px] font-bold text-[#5B21B6] mb-1">📁 個人作業怎麼交？</p>
                        <p className="text-[12.5px] text-[#4C1D95] leading-[1.8] m-0">
                            回到<strong>頁面最上方</strong>，點「<strong>我的紀錄</strong>」按鈕 → 匯出本週填寫內容 → 複製後貼到 Classroom 老師開的文件。
                        </p>
                    </div>

                    {/* 一鍵複製繳交 */}
                    <div className="bg-[#EFF6FF] border-2 border-[#1E40AF] rounded-[var(--radius-unified)] p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <ContentTypeChip type="交出" />
                            <span className="text-[10px] font-mono font-bold bg-[#1E40AF] text-white px-2 py-0.5 rounded-[3px] uppercase tracking-wider">📤 最後一步</span>
                            <span className="text-[14px] font-bold text-[#1E40AF]">複製 W14 學習紀錄 → 貼 Google Classroom</span>
                        </div>
                        <p className="text-[12px] text-[#1E3A8A] leading-relaxed mb-3">
                            包含：圖表選擇紀錄／描述層分析／AI 驗收紀錄（如有）。
                        </p>
                        <ExportButton
                            weekLabel="W14 圖表分析"
                            fields={EXPORT_FIELDS}
                            buttonText="複製 W14 學習紀錄"
                        />
                    </div>

                    {/* 遊戲彩蛋 */}
                    <div className="bg-[var(--ink)] border-l-4 border-[var(--danger)] p-6 rounded-r-lg text-white shadow-xl">
                        <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                            <ShieldAlert className="text-[var(--danger)]" size={20} />
                            R.I.B. 單元挑戰：行動代號解碼
                        </h3>
                        <p className="text-[var(--ink-light)] text-sm mb-4">
                            研究圖表解讀能力——你能從各式數據情境中，挑出最適合的圖表類型嗎？
                        </p>
                        <Link to="/game/chart-matcher" className="inline-flex items-center gap-2 bg-[var(--danger)] text-white px-4 py-2 rounded font-bold text-sm hover:opacity-90 transition-colors">
                            進入解碼 <ArrowRight size={14} />
                        </Link>
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
                    <span className="hidden md:inline">研究方法與專題 / 分析與報告 / </span><span className="text-[var(--ink)] font-bold">圖表與圖說 W14</span>
                </div>
                <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
                    <span className="bg-[var(--paper-warm)] text-[var(--ink)] text-[10px] font-bold px-2 py-0.5 rounded-[2px] font-mono">100 MINS</span>
                    <ResetWeekButton weekPrefix="w14-" />
                </div>
            </div>

            {/* PAGE HEADER — Hero Block（第一屏只留三句，spec §6-1）*/}
            <HeroBlock
                kicker="R.I.B. 調查檔案 · 研究方法與專題 · W14"
                question="我用什麼形式呈現，最不容易誤導？"
                title="讓數據自己說話 · "
                accentTitle="圖表選擇與圖說"
                todo={[
                    { label: '今天做什麼', value: '把 W13 分析表變成一張圖表和一段圖說。' },
                    { label: '為什麼做', value: '圖表要幫資料說話，選錯圖或說太滿都會誤導讀者。' },
                    { label: '今天交什麼', value: '小組＝圖表＋圖說；個人＝W14 歷程 docx。' },
                ]}
                chain="W13 分析表整理好了——但表格是原始的，讀者不會自己看懂。W14 要把表變成圖，再給圖配上描述 + 推論的圖說。"
                meta={[
                  { label: '第一節', value: '四大圖表速查 + 圖表類型判斷演練' },
                  { label: '第二節', value: '圖說寫作（描述層 + 推論層）+ AI 協作檢核 + 完成繳交' },
                  { label: '課堂產出', value: '小組：圖表 + 圖說；個人：W14 歷程 docx' },
                  { label: '前置要求', value: 'W13 整理好的分析表' },
                ]}
            />

            {/* 三模式切換 */}
            <ModeSwitch />

            {/* 自學補課路線 — 只在自學模式顯示（spec §5）*/}
            {mode === 'self-study' && (
                <div className="my-5 rounded-[var(--radius-unified)] border-2 border-[#0284C7] bg-[#F0F9FF] p-4 md:p-5">
                    <p className="text-[14px] font-bold text-[#075985] mb-1">📖 自學補課路線 · W14 可「部分自學」</p>
                    <p className="text-[11.5px] text-[#0C4A6E] leading-[1.7] mb-3">
                        選圖口訣、格式 格式規定、描述 vs 推論、AI 畫圖流程都能自學；小組「圖＋圖說」成果、Step 4 老師巡視、Step 6 抽問需要回課堂補。
                    </p>
                    <ol className="text-[12px] text-[#0C4A6E] leading-[1.85] list-none m-0 p-0 space-y-1">
                        <li><strong>① 先看：</strong>Step 1-3（選圖口訣／格式 格式規定／描述 vs 推論）</li>
                        <li><strong>② 做：</strong>Step 4 拿自己 W13 分析表，畫第一張圖＋寫圖說（①-⑥ 照做）</li>
                        <li><strong>③ 補紀錄：</strong>草圖判讀／圖表類型／驗收／描述／推論 ＋ 雷 #11 改寫 ＋ 自我遷移</li>
                        <li><strong>④ 交：</strong>個人 W14 歷程 docx（雷 #11 改寫、自我遷移、AI-RED 如有）</li>
                        <li><strong>⑤ 需要找人：</strong>小組「圖＋圖說」成果回組討論；老師巡視／抽問回課堂補</li>
                    </ol>
                    <div className="mt-3 pt-3 border-t border-[#0284C7]/30">
                        <p className="text-[12px] font-bold text-[#075985] mb-1">⛑️ 最低完成版（缺課至少做到這些才算補到核心）</p>
                        <p className="text-[11.5px] text-[#0C4A6E] leading-[1.85] m-0">
                            ① 完成一張圖表（套 格式規定）　② 寫一段描述　③ 寫一段推論　④ 完成雷 #11 改寫　⑤ 匯出 W14 歷程 docx
                        </p>
                    </div>
                </div>
            )}

            {/* 我的紀錄抽屜 — 兩模式都能開（spec §3 方案 A：總覽＋匯出，input 留 Step）*/}
            <RecordDrawer
                weekLabel="W14 讓數據自己說話：圖表選擇與圖說"
                fields={EXPORT_FIELDS}
                extraFields={RECORD_EXTRA_FIELDS}
            />

            {/* 為什麼是這週 + 本週資訊 — 深度補充 */}

            <CourseArc items={W14Data.courseArc} />

            <TaskCard
                weekNumber="W14"
                weekTitle={W14Data.title}
                duration={`${W14Data.duration} 分鐘 · ${W14Data.durationDesc}`}
                tasks={[
                    '四大圖表速查（折線／圓餅／長條／散佈）— 選對才能讓數據說話',
                    '圖說寫作公式 — 描述（客觀）+ 推論（主觀）',
                    'AI 協作三步 — 自己寫初稿 → AI 檢核 → 人工判斷取捨',
                    '✏️ 跨週作業：學期 AI 協作反思（Step 5 底部，W17 Gallery Walk 抽問）',
                ]}
                exportReminder="小組繳交圖表+圖說；個人繳交 W14 歷程 docx（雷 #11 改寫、自我遷移、AI-RED 如有）。完成後到 Classroom 按「繳交」。"
            />

            {/* STEP ENGINE */}
            <StepEngine
                steps={steps}
                prevWeek={{ label: '回 W13 資料整理週', to: '/w13' }}
                nextWeek={{ label: '前往 W15 研究結論', to: '/w15' }}
            flat
            />

            {/* W14 階段紅線完整版 — 5 條 · 深度補充 */}
            <DepthBlock title="W14 研究員紅線（完整版）">
                <ResearcherRedlines mode="subset" stage="W14" />
            </DepthBlock>
        </div>
    );
};

const W14Page = () => (
    <ModeProvider week="W14">
        <W14PageContent />
    </ModeProvider>
);

export { W14Page };
export default W14Page;
