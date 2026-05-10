import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import CourseArc from '../components/ui/CourseArc';
import { W14Data } from '../data/lessonMaps';
import './W14.css';
import ThinkRecord from '../components/ui/ThinkRecord';
import PromptBlock from '../components/ui/PromptBlock';
import AIREDNarrative from '../components/ui/AIREDNarrative';
import StepEngine from '../components/ui/StepEngine';
import HeroBlock from '../components/ui/HeroBlock';
import TaskCard from '../components/ui/TaskCard';
import ExportButton from '../components/ui/ExportButton';
import ResetWeekButton from '../components/ui/ResetWeekButton';
import AICollaborationPrinciples from '../components/ui/AICollaborationPrinciples';
import AIDialogSubmission from '../components/ui/AIDialogSubmission';
import AIModePicker from '../components/ui/AIModePicker';
import { ResearcherRedlines } from '../components/ui/ResearcherRedlines';
import TrapRewritePractice from '../components/ui/TrapRewritePractice';
import ChartChoiceChecker from '../components/ui/ChartChoiceChecker';
import { readRecords } from '../components/ui/ThinkRecord';
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
    },
];

/* — 口訣決策流程 — */
const DECISION_FLOW = [
    { num: '❶', text: '有時間在流動嗎？', answer: '→ 折線圖', color: '#2563EB' },
    { num: '❷', text: '看部分佔整體比例嗎？', answer: '→ 圓餅圖', color: '#7C3AED' },
    { num: '❸', text: '找兩個變數的關係嗎？', answer: '→ 散佈圖', color: '#DC2626' },
    { num: '❹', text: '都不是？比大小排名？', answer: '→ 長條圖', color: '#059669' },
];

/* — 演練題 — */
const EXERCISE_ITEMS = [
    { q: '全班同學「數學成績」與「物理成績」是否有關聯。', a: 'D 散佈圖', hint: '兩個變數的關聯' },
    { q: '福利社過去三個月「珍珠奶茶」銷量的每日變化。', a: 'C 折線圖', hint: '時間流動的趨勢' },
    { q: '比較全校各班級的「整潔競賽」總分排名。', a: 'B 長條圖', hint: '比大小排名' },
    { q: '分析自己一天 24 小時的時間分配比例。', a: 'A 圓餅圖', hint: '部分佔整體比例' },
];

/* — 格式規範 — */
const FORMAT_RULES = [
    { label: '📌 標題', rule: '永遠放在圖表上方', example: '圖一：高二學生社團參與時數 (N=120)' },
    { label: '📌 資料來源', rule: '永遠放在圖表下方', example: '自己做的寫「資料來源：研究者繪製」' },
    { label: '📌 正文引用', rule: '寫「如圖一所示」', example: '絕對不能寫「如上圖」或「如下圖」' },
    { label: '📌 標註 N 值', rule: '在標題旁標註有效樣本數', example: '80% 是 100 人的 80% 還是 5 人的？差很多！' },
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
    { key: 'w14-pre-judgment', label: '① 草圖判讀（必填）', question: '我預期會看到什麼趨勢？最重要的發現是什麼？' },
    { key: 'w14-my-chart-type', label: '② 圖表類型與理由（必填）' },
    { key: 'w14-teach-reflection', label: '教學型反思（教學型才有）' },
    { key: 'w14-ai-blindspot', label: 'AI 找到的盲點（進階·驗收型必填）' },
    { key: 'w14-validation-check', label: '③ 圖表三鐵規驗收（必填）' },
    { key: 'w14-my-description', label: '④ 描述（AI 起草+人工改寫）' },
    { key: 'w14-my-inference', label: '⑤ 推論（純人工，研究核心）' },
    { key: 'w14-ai-pressure-test', label: 'AI 壓力測試後修正（進階·驗收型必填）' },
    { key: 'w14-ai-dialog-submission', label: 'AI 完整對話繳交方式（用了 AI 必填）', question: 'A 私人留言 / B 文件上傳並貼連結' },
    /* Step 5 */
    { key: 'w14-w15-preview', label: 'W15 預告：結論的第三層和第四層' },
    { key: 'w14-aired-record', label: 'AI-RED 敘事紀錄（用了 AI 必填）', question: '本週用 AI 畫圖的最重要一次互動（A-I-R-E-D 五要素）' },
    { key: 'w14-semester-reflection', label: '學期 AI 協作反思（W14-W17 跨週作業）', question: '從 W1 到現在，你跟 AI 共事最讓你改變想法的一次是什麼？（W17 老師會點 3 位同學現場分享）' },
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

    const updateAnswer = (i, opt) => {
        const next = { ...answers, [i]: opt };
        setAnswers(next);
        try { localStorage.setItem('w14-chart-exercise-ans', JSON.stringify(next)); } catch {}
    };
    const revealAnswers = () => {
        setShowAnswers(true);
        try { localStorage.setItem('w14-chart-exercise-show', '1'); } catch {}
    };
    const handleReset = () => {
        setAnswers({});
        setShowAnswers(false);
        try { localStorage.removeItem('w14-chart-exercise-ans'); localStorage.removeItem('w14-chart-exercise-show'); } catch {}
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

const W14Page = () => {
    const saved = readRecords();
    const myTopic = saved['w8-merged-topic'] || saved['w8-research-question'] || '';
    const myMethod = saved['w9-my-method'] || saved['w8-tool-method'] || '';
    /* W13 跨週帶入 */
    const w13TableLink = saved['w13-table-link'] || '';
    const w13W14Question = saved['w13-w14-question'] || '';
    /* AI 使用模式 */
    const [w14AiMode, setW14AiMode] = useState(() => {
        try {
            const r = JSON.parse(localStorage.getItem('rib_think_records')) || {};
            return r['w14-ai-mode'] || '';
        } catch { return ''; }
    });

    const steps = [
        {
            title: '選對盤子',
            icon: <BarChart2 size={18} />,
            content: (
                <div className="flex flex-col gap-6 prose-zh">
                    {/* 開場：任務定位 */}
                    <div className="p-5 rounded-[var(--radius-unified)] border border-[var(--border)] bg-[var(--paper-warm)]">
                        <p className="text-[15px] font-bold text-[var(--ink)] mb-2">🍽️ 選對盤子，數據才會說話</p>
                        <p className="text-[12px] text-[var(--ink-mid)] leading-relaxed">
                            頂級和牛用塑膠臉盆裝，客人還想吃嗎？資料也一樣——你 W13 整理好的分析表是「食材」，
                            本週要選對「盤子」（圖表類型）盛出來。<strong>選錯圖表，再好的資料也讀不出意義。</strong>
                            Step 1 先學 4 大圖表的選擇口訣，再進格式、圖說、動手畫——共 6 步。
                        </p>
                    </div>

                    {/* 名詞白話化：變項是什麼 */}
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

                    {/* 四大圖表卡 */}
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
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* 口訣決策流程 */}
                    <div>
                        <p className="text-[13px] font-bold text-[var(--ink)] mb-2">💡 快速決策口訣</p>
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

                    {/* 演練：圖表決策 */}
                    <div>
                        <p className="text-[13px] font-bold text-[var(--ink)] mb-2">✏️ 演練：圖表決策直覺訓練</p>
                        <p className="text-[12px] text-[var(--ink-mid)] mb-3">選出最適合的圖表類型，選完按「對答案」。</p>
                        <ChartExercise />
                    </div>

                    {/* 對答案後的反思（避免跟上方互動演練重複） */}
                    <ThinkRecord
                        dataKey="w14-chart-exercise"
                        prompt="對答案後的反思（不用重抄 4 題答案，只寫你錯了哪題＋為什麼）"
                        scaffold={[
                            '我錯的題（如果有）：第 ___ 題',
                            '我選了 ___ 卻是 ___，原因是我把 ___ 跟 ___ 搞混了',
                            '下次怎麼避免：（哪個口訣記不熟？）',
                        ]}
                    />

                    {/* 演練：圖表除錯 */}
                    <div className="w14-case-card">
                        <div className="w14-case-header">✏️ 演練：圖表除錯</div>
                        <div className="w14-case-body">
                            <p><strong>情境：</strong>小明調查「你喜歡吃什麼水果？（可複選）」，結果：蘋果 60%、香蕉 50%、芭樂 40%。他畫了圓餅圖。</p>
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
            title: '圖表格式',
            icon: <FileText size={18} />,
            content: (
                <div className="flex flex-col gap-6 prose-zh">
                    <div className="p-4 rounded-[var(--radius-unified)] border border-[var(--border)] bg-[var(--paper-warm)]">
                        <p className="text-[14px] font-bold text-[var(--ink)] mb-1">📐 做圖表的三個鐵規定 + 一個防呆</p>
                        <p className="text-[12px] text-[var(--ink-mid)]">自己做的圖表也要標出處！</p>
                    </div>

                    {/* 格式規範表 */}
                    <div className="w14-format-grid">
                        {FORMAT_RULES.map((r, i) => (
                            <div key={i} className="w14-format-row">
                                <span className="w14-format-label">{r.label}</span>
                                <div>
                                    <p className="text-[var(--ink)] font-bold">{r.rule}</p>
                                    <p className="text-[11px] mt-1 opacity-70">{r.example}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* N 值重點提醒 */}
                    <div className="p-4 rounded-[var(--radius-unified)] border border-[#FCD34D] bg-[#FFFBEB]">
                        <p className="text-[12px] text-[#92400E] flex items-center gap-2">
                            <AlertTriangle size={14} /> <strong>N 值為什麼重要？</strong>
                        </p>
                        <p className="text-[12px] text-[#78350F] mt-1 leading-relaxed">
                            「80% 的人有壓力」— 這是 100 人的 80%，還是只有 5 人的 80%？說服力完全不同！
                            在圖表標題旁標註 (N=有效樣本數)。
                        </p>
                    </div>

                    {/* 演練：格式 */}
                    <div className="w14-case-card">
                        <div className="w14-case-header">✏️ 演練：格式規範</div>
                        <div className="w14-case-body">
                            <p><strong>情境：</strong>你整理了 300 份問卷，做成一張圓餅圖，標題是「圖一：社團參與比例」。</p>
                            <p className="mt-2">1. 圖表下方的「資料來源」該怎麼寫？</p>
                            <p>2. 正文中提到這張圖時，該怎麼稱呼？</p>
                        </div>
                    </div>
                    <ThinkRecord
                        dataKey="w14-format-exercise"
                        prompt="格式規範演練：資料來源怎麼寫？正文怎麼引用？"
                        scaffold={['1. 資料來源：...', '2. 正文寫法：...']}
                    />

                    {/* 遊戲入口：Chart Matcher */}
                    <div className="p-4 rounded-[var(--radius-unified)] bg-gradient-to-br from-[#1a1a2e] to-[#16213e] text-white text-center">
                        <p className="text-[11px] opacity-60 mb-1"><Gamepad2 size={12} className="inline" /> R.I.B. 技能挑戰</p>
                        <p className="text-[14px] font-bold mb-2">Chart Matcher 解碼任務</p>
                        <p className="text-[12px] opacity-70 mb-3">用遊戲把圖表決策口訣練到反射動作！</p>
                        <Link
                            to="/chart-matcher"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-[#10B981] hover:bg-[#059669] text-white text-[13px] font-bold rounded-[var(--radius-unified)] transition-colors no-underline"
                        >
                            進入遊戲 <ArrowRight size={14} />
                        </Link>
                    </div>
                </div>
            ),
        },
        {
            title: '描述 vs. 推論',
            icon: <Lightbulb size={18} />,
            content: (
                <div className="flex flex-col gap-6 prose-zh">
                    <div className="p-4 rounded-[var(--radius-unified)] border border-[var(--border)] bg-[var(--paper-warm)]">
                        <p className="text-[14px] font-bold text-[var(--ink)] mb-1">📝 一張圖的說明 ＝ 描述 ＋ 推論</p>
                        <p className="text-[12px] text-[var(--ink-mid)]">圖表貼到報告裡，你不能什麼都不說。你要告訴讀者：你看到了什麼，以及這代表什麼。</p>
                    </div>

                    {/* 描述 vs 推論雙欄 */}
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
                    <div className="p-4 rounded-[var(--radius-unified)] border border-[#FCA5A5] bg-[#FEF2F2]">
                        <p className="text-[12px] text-[#DC2626] font-bold mb-2">⚠️ 常見錯誤</p>
                        <div className="text-[12px] text-[#991B1B] leading-relaxed flex flex-col gap-1">
                            <span>1. <strong>只報數字不推論</strong>：像機器人，沒有分析價值</span>
                            <span>2. <strong>亂推論</strong>：沒有數據支持就硬說，要說「可能」而非「一定」</span>
                            <span>3. <strong>把 38% 說成「絕大多數」</strong>：量詞要精準</span>
                        </div>
                    </div>

                    {/* 案例三（保留：整合練習） */}
                    <div className="w14-case-card">
                        <div className="w14-case-header">整合練習：精神病患處置民調</div>
                        <div className="w14-case-body">
                            <p><strong>數據：</strong>73.5% 民眾不滿現況；不滿主因是「結束刑期後的社會危害（如再犯）」（85.3%）。</p>
                            <p className="mt-2">請用「描述＋推論」公式，把這兩個數字整合成一段完整的說明。</p>
                        </div>
                    </div>
                    <ThinkRecord dataKey="w14-case-3" prompt="整合練習：用描述＋推論公式寫出完整說明" scaffold={['描述：根據調查結果，...', '推論：這可能反映出...']} />

                    {/* 遊戲入口：Data Detective */}
                    <div className="p-4 rounded-[var(--radius-unified)] bg-gradient-to-br from-[#1a1a2e] to-[#16213e] text-white text-center">
                        <p className="text-[11px] opacity-60 mb-1"><Gamepad2 size={12} className="inline" /> R.I.B. 技能挑戰</p>
                        <p className="text-[14px] font-bold mb-2">Data Detective 濾鏡任務</p>
                        <p className="text-[12px] opacity-70 mb-3">找出菜鳥研究員的錯誤分析！</p>
                        <Link
                            to="/data-detective"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-[#10B981] hover:bg-[#059669] text-white text-[13px] font-bold rounded-[var(--radius-unified)] transition-colors no-underline"
                        >
                            進入遊戲 <ArrowRight size={14} />
                        </Link>
                    </div>
                </div>
            ),
        },
        {
            title: '動手畫圖 + 圖說',
            icon: <BarChart2 size={18} />,
            content: (
                <div className="flex flex-col gap-6 prose-zh">
                    {/* 開場：研究腦/技術分工 */}
                    <div className="p-4 rounded-[var(--radius-unified)] border border-[var(--border)] bg-[var(--paper-warm)]">
                        <p className="text-[14px] font-bold text-[var(--ink)] mb-1">🎯 分工：你出研究腦，AI 代勞畫圖技術</p>
                        <p className="text-[12px] text-[var(--ink-mid)] leading-relaxed">
                            打開你 W13 整理好的分析表。本週分工原則：
                            <strong>選圖表類型／驗收／寫推論</strong>是研究核心由你自己做；
                            <strong>畫圖（Sheets/Canva 操作）跟描述初稿</strong>可以交給 AI——AI 是技術助理，不是研究員。
                        </p>
                    </div>

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
                            {w13W14Question && (
                                <div>
                                    <p className="text-[11px] text-[#075985] font-bold uppercase tracking-wider mb-1">你 W13 寫的「想怎麼呈現」</p>
                                    <p className="text-[12px] text-[#0C4A6E] leading-relaxed">{w13W14Question}</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* 第①步 草圖判讀 */}
                    <div className="p-5 rounded-[var(--radius-unified)] border-2 border-[#FCA5A5] bg-[#FEF2F2]">
                        <p className="text-[14px] font-bold text-[#991B1B] mb-2 flex items-center gap-2">
                            <ShieldAlert size={16} /> 第①步 · 草圖判讀（純人工 · 不能讓 AI 替你看）
                        </p>
                        <p className="text-[12px] text-[#7F1D1D] leading-relaxed">
                            開分析表，自己用腦袋讀一輪。回答下面三個問題——這是你研究的「眼力」訓練。
                        </p>
                    </div>
                    <ThinkRecord
                        dataKey="w14-pre-judgment"
                        prompt="① 我的草圖判讀"
                        scaffold={[
                            '我選的變項：X = ___，Y = ___（為什麼選這兩個？）',
                            '我預期會看到的趨勢／模式：（口語描述，例：高一比高三花更多時間滑手機）',
                            '我預期最重要的發現：（如果這張圖只能講一句話，這句話是什麼？）',
                        ]}
                    />

                    {/* 第②步 選類型 */}
                    <div className="p-4 rounded-[var(--radius-unified)] border border-[var(--border)] bg-[var(--paper-warm)]">
                        <p className="text-[14px] font-bold text-[var(--ink)] mb-1">🎯 第②步 · 選圖表類型（純人工 · 套 Step 1 口訣）</p>
                        <p className="text-[12px] text-[var(--ink-mid)] leading-relaxed">
                            時間流動？比例？相關？比大小？挑一個套用。
                            <strong>這步絕不能交給 AI</strong>——選錯類型，AI 畫得再美也是廢圖。
                        </p>
                    </div>
                    <ThinkRecord
                        dataKey="w14-my-chart-type"
                        prompt="② 我選用的圖表類型 + 理由 + 圖表標題"
                        scaffold={[
                            '圖表類型：折線圖 / 圓餅圖 / 長條圖 / 散佈圖',
                            '原因（套用口訣）：因為我的資料是在看...',
                            '圖表標題：圖一：___ (N=___)',
                        ]}
                    />

                    {/* 第③步 AI 畫圖 */}
                    <div className="p-5 rounded-[var(--radius-unified)] border-2 border-[var(--accent)] bg-[#F8F8FB]">
                        <p className="text-[14px] font-bold text-[var(--accent)] mb-2 flex items-center gap-2">
                            <Bot size={16} /> 第③步 · AI 畫圖（推薦路線）
                        </p>
                        <p className="text-[12px] text-[var(--ink-mid)] leading-relaxed mb-3">
                            把你決定好的「類型 + 變項 + 標題」交給 <strong>Gemini Pro · 思考模式 + Canvas</strong> 畫圖。
                            規則：<strong>AI 只能畫你選的類型，不能擅自換</strong>。
                        </p>
                        <PromptBlock text={`【任務】依我提供的判讀，幫我把資料畫成圖。
不要自行更換圖表類型、不要自行新增變項。

【我的判讀】
- 變項：X = ___，Y = ___
- 我選的圖表類型：___（折線/圓餅/長條/散佈）
- 圖表標題：圖一：___
- 樣本數：N = ___

【分析表】
___（貼資料或連結，三選一：①直接貼 CSV 文字 ②貼 Google Sheets 公開連結 ③上傳 Excel／CSV 檔案——Gemini 都能讀）

【請輸出】
1. 用我選的圖表類型畫出圖（Canvas 顯示）
2. 標題在上、N 值標註、資料來源標「研究者繪製」
3. 座標軸刻度合理、不截斷

不要替我寫圖說，圖說由我自己來。`} />
                    </div>

                    {/* 替代路線：自己畫 */}
                    <details className="rounded-[var(--radius-unified)] border border-[var(--border)] bg-white">
                        <summary className="cursor-pointer px-5 py-3 flex items-center justify-between hover:bg-[var(--paper-warm)] transition-colors">
                            <span className="text-[12px] font-bold text-[var(--ink)]">
                                🛠️ 替代路線：我想自己用 Sheets/Excel/Canva 畫（點開看步驟）
                            </span>
                            <span className="text-[10px] font-mono text-[var(--ink-light)]">▼</span>
                        </summary>
                        <div className="border-t border-[var(--border)] p-4 space-y-2 text-[12px] text-[var(--ink-mid)] leading-relaxed">
                            <p><strong>Google Sheets：</strong>選資料 → 插入 → 圖表 → 編輯類型/標題（最快）</p>
                            <p><strong>Excel：</strong>選資料 → 插入 → 圖表 → 設計／格式（功能多）</p>
                            <p><strong>Canva：</strong>圖表元素 → 改數據 → 換顏色（最美）</p>
                        </div>
                    </details>

                    {/* 第④步 人工驗收 */}
                    <div className="p-4 rounded-[var(--radius-unified)] border-2 border-[#FCD34D] bg-[#FFFBEB]">
                        <p className="text-[13px] font-bold text-[#92400E] mb-2 flex items-center gap-2">
                            <ShieldAlert size={14} /> 第④步 · 人工驗收（純人工 · 套 Step 2 三鐵規）
                        </p>
                        <ul className="text-[11px] text-[#78350F] leading-relaxed space-y-1 mb-2">
                            <li>☐ 圖表類型 = 我選的（不是 AI 擅自改的）</li>
                            <li>☐ 標題在上方，含 N 值</li>
                            <li>☐ 資料來源在下方</li>
                            <li>☐ 座標軸沒截斷、比例合理</li>
                            <li>☐ 圖上的數字跟我的分析表對得上</li>
                        </ul>
                        <details className="bg-white border border-[#FCD34D] rounded p-2.5">
                            <summary className="cursor-pointer text-[11.5px] font-bold text-[#92400E] flex items-center gap-2">
                                <span>📋 任何一項沒過？點開看怎麼改 prompt 重畫</span>
                                <span className="ml-auto text-[10px] font-mono">▼</span>
                            </summary>
                            <div className="mt-2 pt-2 border-t border-[#FCD34D] text-[11px] text-[#78350F] leading-relaxed space-y-1">
                                <p><strong>① 圖表類型錯</strong>（AI 改成自己想的）→ prompt 開頭加紅字「請<strong>嚴格使用</strong>我選的 ___ 類型，禁止更換」</p>
                                <p><strong>② 標題缺 N 值</strong>→ prompt 加「標題格式必須是『圖一：___ (N=___)』」</p>
                                <p><strong>③ 沒資料來源</strong>→ prompt 加「圖下方標『資料來源：研究者繪製』」</p>
                                <p><strong>④ 座標軸截斷</strong>（從非 0 開始放大差距）→ prompt 加「Y 軸從 0 開始」</p>
                                <p><strong>⑤ 數字對不上</strong>→ 把分析表整段重貼一次，並說「請對照原始資料逐筆驗算」</p>
                                <p className="italic text-[11px] text-[#92400E]">💡 AI 出錯不是你的責任，但驗收沒做就是你的責任。重畫 1-2 次很正常。</p>
                            </div>
                        </details>
                    </div>
                    <ThinkRecord
                        dataKey="w14-validation-check"
                        prompt="③ 圖表驗收結果"
                        scaffold={[
                            '5 項驗收都通過？☐ 是 / ☐ 否（哪幾項沒過？）',
                            'AI 畫錯什麼？我重 prompt 幾次才對？',
                        ]}
                    />

                    {/* 第⑤步 寫描述 */}
                    <div className="p-4 rounded-[var(--radius-unified)] border border-[var(--border)] bg-[var(--paper-warm)]">
                        <p className="text-[14px] font-bold text-[var(--ink)] mb-1">✍️ 第⑤步 · 寫描述（AI 可起草，你逐句檢查改寫）</p>
                        <p className="text-[12px] text-[var(--ink-mid)] leading-relaxed">
                            描述層 = 報事實、報數字。AI 可以幫你起草初稿——
                            <strong>但你要逐句檢查數字對不對、量詞精不精準</strong>，最後用自己的話改寫一次。
                        </p>
                    </div>
                    <details className="rounded-[var(--radius-unified)] border border-[var(--border)] bg-white">
                        <summary className="cursor-pointer px-4 py-2.5 hover:bg-[var(--paper-warm)] transition-colors flex items-center gap-2">
                            <span className="text-[12px] text-[var(--ink-mid)]">
                                🤖 <strong className="text-[var(--ink)]">AI 描述初稿 prompt</strong>（點開複製）
                            </span>
                            <span className="ml-auto text-[10px] font-mono text-[var(--ink-light)]">▼</span>
                        </summary>
                        <div className="border-t border-[var(--border)] p-3">
                            <PromptBlock text={`接續上一輪。請幫我寫「圖一」的描述層初稿（純報事實，3-5 句）。

【規則】
1. 只報數字和趨勢，不要寫「因為」「所以」這類因果詞
2. 量詞要精準：38% 不能說成「絕大多數」
3. 句尾標明「（如圖一所示）」

我會逐句驗收 + 改寫。`} />
                        </div>
                    </details>
                    <div>
                        <p className="text-[13px] font-bold mb-2" style={{ color: '#1E40AF' }}>🔵 描述（藍筆）：AI 起草後你改寫的版本</p>
                        <ThinkRecord
                            dataKey="w14-my-description"
                            prompt="④ 描述（AI 起草後你改寫）"
                            scaffold={['根據圖一，...', '其中最明顯的是...']}
                        />
                    </div>

                    {/* 第⑥步 寫推論（純人工） */}
                    <div className="p-4 rounded-[var(--radius-unified)] border-2 border-[#FCA5A5] bg-[#FEF2F2]">
                        <p className="text-[14px] font-bold text-[#991B1B] mb-1 flex items-center gap-2">
                            <ShieldAlert size={16} /> 第⑥步 · 寫推論（純人工 · 不能交給 AI）
                        </p>
                        <p className="text-[12px] text-[#7F1D1D] leading-relaxed mb-2">
                            推論層 = 解釋意義、推測原因——<strong>這是研究的靈魂</strong>。
                            AI 寫的推論看起來合理，但那不是<strong>你的</strong>研究腦在運作。
                            自己寫——醜沒關係，下一步可選 AI 戳盲點。
                        </p>
                        <div className="bg-white border border-[#FCA5A5] rounded p-2.5 text-[11px] text-[#7F1D1D] leading-relaxed">
                            <p className="font-bold text-[#991B1B] mb-1">⚖️ 同樣是 AI，描述跟推論待遇不同：</p>
                            <p>· <strong>描述（第⑤步）</strong>：AI 起草 OK，因為事實有對錯，你改寫即可</p>
                            <p>· <strong>推論（這步）</strong>：AI 不行，因為「為什麼會這樣」沒有標準答案——你的解釋才是研究的核心，外包等於放棄做研究</p>
                            <p className="italic mt-1.5">💡 老師抽問會問：「為什麼你推論是 ___？」答不出來 = 你沒做研究。</p>
                        </div>
                    </div>
                    <div>
                        <p className="text-[13px] font-bold mb-2" style={{ color: '#991B1B' }}>🔴 推論（紅筆）：純人工</p>
                        <ThinkRecord
                            dataKey="w14-my-inference"
                            prompt="⑤ 推論（你自己寫，不能讓 AI 代寫）"
                            scaffold={['這可能代表...', '因為...']}
                        />
                    </div>

                    {/* 老師巡視 */}
                    <div className="p-4 rounded-[var(--radius-unified)] border border-[var(--border)]">
                        <p className="text-[12px] font-bold text-[var(--ink)] mb-2">👀 老師巡視會檢查三件事</p>
                        <div className="text-[12px] text-[var(--ink-mid)] leading-relaxed flex flex-col gap-1">
                            <span>1. <strong>有先寫草圖判讀</strong>（用腦袋讀過資料才動手）</span>
                            <span>2. AI 出的圖通過三鐵規驗收（圖表類型對 + 標題/N/來源齊）</span>
                            <span>3. <strong>推論是自己寫的</strong>，不是抄 AI（會抽問你「為什麼這樣推」）</span>
                        </div>
                    </div>
                </div>
            ),
        },
        {
            title: '進階·AI 壓力測試（可選）',
            icon: <Lightbulb size={18} />,
            content: (
                <div className="flex flex-col gap-6 prose-zh">
                    {/* 開場：進階定位 */}
                    <div className="p-5 rounded-[var(--radius-unified)] border-2 border-[var(--accent)] bg-[#F8F8FB]">
                        <p className="text-[15px] font-bold text-[var(--accent)] mb-2">🥊 已完成基本要求 · 要不要被 AI 嚴格教練檢一輪</p>
                        <p className="text-[12px] text-[var(--ink)] leading-relaxed">
                            Step 4 你已完成圖+描述+推論基本要求。
                            這一步是<strong>進階訓練</strong>：請 AI 從研究方法老師角度找你忽略的趨勢、警告過度推論——
                            挖出你自己看不到的盲點。
                            <strong>用了 AI 一定要做判斷取捨（不能照單全收），並繳完整對話。</strong>
                        </p>
                    </div>

                    {/* 跨工具：Prompt 範本庫 */}
                    <div className="bg-[var(--paper-warm)] border border-[var(--border)] rounded-[var(--radius-unified)] p-3 flex items-center justify-between gap-3">
                        <p className="text-[12px] text-[var(--ink-mid)] leading-relaxed">
                            💡 想看更進階的 5 法分析 prompt？回 <strong className="text-[var(--ink)]">Prompt 範本庫</strong>（5 法 × Step 1-5 速查，自學用）。
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

                    {/* AI 協作三原則（W14 角色：反思鏡） */}
                    <p className="text-[11.5px] text-[var(--ink-mid)] italic leading-relaxed -mb-2">
                        💡 W14 的 AI 角色叫<strong className="text-[var(--ink)]">「反思鏡」</strong>——不論你下方選教學型／驗收型，AI 都是幫你戳「你沒看到的角度」，不是給你標準答案。
                    </p>
                    <AICollaborationPrinciples week="14" role="mirror" compact={false} />

                    {/* AI 模式選擇 */}
                    <AIModePicker week="14" taskName="進階壓力測試" onChange={setW14AiMode} />

                    {/* standalone */}
                    {w14AiMode === 'standalone' && (
                        <div className="rounded-[var(--radius-unified)] border-2 border-[#BFDBFE] bg-[#EFF6FF] p-5">
                            <p className="text-[14px] font-bold text-[#1E40AF] mb-2">🚫 你選擇不做進階壓力測試</p>
                            <p className="text-[12px] text-[#1E3A8A] leading-relaxed">
                                完全 OK——Step 4 基本要求已達標。直接到下一步繳交即可（AI-RED 留空不會扣分）。
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
                                但<strong>不要直接抄它的推論</strong>，看完範例自己回 Step 4 重寫。
                            </p>
                            <PromptBlock text={`我有一張圖（已附），描述層我寫了：___

【請教我】
1. 同一份資料，從研究方法老師角度，還有哪 3 個角度可以推論？
2. 每個角度給 1 句範例（不超過 15 字），讓我參考但不要寫長篇
3. 提醒我哪些是「過度推論」的紅線（哪些不能寫）

【不要做】
- 不要寫完整推論段落
- 我看完範例會自己回 Step 4 推論欄改寫`} />
                            <ThinkRecord
                                dataKey="w14-teach-reflection"
                                prompt="教學型反思（AI 教完後寫）"
                                scaffold={[
                                    'AI 給我哪 3 個角度？',
                                    '我要採納哪些回 Step 4 改寫推論：',
                                ]}
                            />
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
                            <ThinkRecord
                                dataKey="w14-ai-blindspot"
                                prompt="① AI 找到的盲點 / 我沒注意到的趨勢"
                                scaffold={[
                                    'AI 指出我可能忽略的趨勢：',
                                    'AI 警告我不要過度解讀的點：',
                                    '我採納哪些、不採納哪些：',
                                ]}
                            />

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
                            <ThinkRecord
                                dataKey="w14-ai-pressure-test"
                                prompt="② AI 壓力測試後我做了哪些修正"
                                scaffold={[
                                    'AI 指出的問題：',
                                    '我採納哪些建議：',
                                    '我修正了什麼（描述／推論的具體用詞）：',
                                ]}
                            />

                            <div className="p-4 rounded-[var(--radius-unified)] border-2 border-[var(--accent)] bg-[#F8F8FB]">
                                <p className="text-[12px] font-bold text-[var(--accent)] mb-2">📝 用 AI 修完，回 Step 4 覆蓋描述/推論欄</p>
                                <p className="text-[11px] text-[var(--ink-mid)] leading-relaxed">
                                    若採納 AI 建議，<strong>回 Step 4 覆蓋描述/推論欄位</strong>，匯出時就會是 AI 修飾版。沒覆蓋＝以 Step 4 自寫版為準。
                                </p>
                            </div>

                            {/* 完整對話繳交 */}
                            <AIDialogSubmission week="14" taskName="進階壓力測試對話" required={true} />
                        </>
                    )}

                    {!w14AiMode && (
                        <div className="rounded-[var(--radius-unified)] border border-[var(--border)] bg-[var(--paper-warm)] p-3">
                            <p className="text-[12px] text-[var(--ink-mid)] leading-relaxed">
                                ☝️ 上方先選一個 AI 使用模式：教學型（推論卡關）／驗收型（找盲點+壓測）／不用（基本要求已達標）。
                            </p>
                        </div>
                    )}
                </div>
            ),
        },
                {
            title: '回顧繳交',
            icon: <FileText size={18} />,
            content: (
                <div className="flex flex-col gap-6 prose-zh">
                    <div className="p-4 rounded-[var(--radius-unified)] border border-[var(--border)] bg-[var(--paper-warm)]">
                        <p className="text-[14px] font-bold text-[var(--ink)] mb-1">📋 今天學了兩件事</p>
                        <p className="text-[12px] text-[var(--ink-mid)] leading-relaxed">
                            選對盤子（圖表）＋ 幫一張圖寫說明（描述＋推論）。
                            <br />但記住：今天學的是針對<strong>一張圖</strong>的局部說明。下週 W15 要升級為<strong>整份研究的結論</strong>。
                        </p>
                    </div>

                    {/* W15 預告 */}
                    <div className="p-5 rounded-[var(--radius-unified)] border-2 border-dashed border-[var(--accent)] bg-[#F0F4FF]">
                        <p className="text-[14px] font-bold text-[var(--accent)] mb-2">🚀 W15 預告：結論還要再加兩層</p>
                        <p className="text-[12px] text-[var(--ink-mid)] mb-3 leading-relaxed">
                            今天的「描述＋推論」是針對一張圖的。下週要把整份研究的所有發現整合，寫出完整的研究結論。那個結論除了描述和推論，還要加：
                        </p>
                        <ThinkRecord
                            dataKey="w14-w15-preview"
                            prompt="猜猜看，結論的第三層和第四層是什麼？（提示：回頭看你的研究問題 + 你的結論有哪些不完美？）"
                            scaffold={['第三層（提示：回頭看研究問題）：...', '第四層（提示：不完美的地方）：...']}
                        />
                    </div>

                    {/* AI-RED 敘事紀錄（依進階 AIMode 三分支） */}
                    {(w14AiMode === 'teach' || w14AiMode === 'verify') ? (
                        <AIREDNarrative week="14" hint="本週用 AI 進階壓測：A=Gemini Pro / I=找盲點+壓測 prompt / R=AI 找到的盲點+風險 / E=我同意/不同意哪些 / D=採納哪些修正" />
                    ) : w14AiMode === 'standalone' ? (
                        <div className="rounded-[var(--radius-unified)] border border-[var(--border)] bg-[var(--paper-warm)] p-4">
                            <p className="text-[13px] font-bold text-[var(--ink)] mb-1">🚫 你選擇不做進階壓測 · 不需 AI 反思</p>
                            <p className="text-[11.5px] text-[var(--ink-mid)] leading-relaxed">
                                Step 4 基本要求已達標（含 AI 畫圖那種「技術代勞」級用法）。
                                這格自動略過——反思真正大舉發生在 W15（結論寫作）和 W17（成果發表）。
                            </p>
                        </div>
                    ) : (
                        <AIREDNarrative week="14" hint="本週若有用 AI 進階檢核推論，記下最關鍵的一次互動" optional={true} />
                    )}

                    {/* 學期 AI 協作反思（從 W17 移過來——這週的「人 vs AI 分工」最清楚，反思最有素材）*/}
                    <div className="mt-6 p-5 rounded-[var(--radius-unified)] border-2 border-[#D97706] bg-[#FEF3C7]">
                        <div className="flex items-start justify-between mb-2 gap-2">
                            <p className="text-[14px] font-bold text-[#92400E]">🎯 學期 AI 協作反思（W14 寫，W17 抽問）</p>
                            <span className="text-[10px] font-mono text-[#92400E] bg-white px-2 py-0.5 rounded border border-[#D97706] flex-shrink-0">跨週作業</span>
                        </div>
                        <p className="text-[12px] text-[#78350F] leading-relaxed mb-3">
                            這週你親身經歷了「人選圖表類型／驗收三鐵規／寫推論」vs「AI 畫圖／描述初稿」這套分工——是整學期 AI 協作分工最清楚的一次。<br />
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
                                                '把畫圖技術交給 AI，自己用三鐵規驗收圖表',
                                                '區分「描述」（AI 起草+人工改）和「推論」（純人工），避免推論失控',
                                                '若選用 AI 進階壓測：知道過度推論／單一原因兩大雷並做判斷',
                            ].map((item, i) => (
                                <div key={i} className="p-4 px-5 bg-white flex items-start gap-3">
                                    <span className="text-[var(--success)] text-[16px] mt-0.5 flex-shrink-0">✓</span>
                                    <span className="text-[13px] text-[var(--ink-mid)] leading-relaxed">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <ExportButton
                        weekLabel="W14 讓數據自己說話：圖表選擇與圖說"
                        fields={EXPORT_FIELDS}
                    />

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
                    <span className="hidden md:inline-block bg-[var(--ink)] text-white text-[10px] font-bold px-2 py-0.5 rounded-[2px] font-mono">AI-RED · D</span>
                </div>
            </div>

            {/* PAGE HEADER — Hero Block */}
            <HeroBlock
                kicker="R.I.B. 調查檔案 · 研究方法與專題 · W14"
                title="讓數據自己說話 · "
                accentTitle="圖表選擇與圖說"
                subtitle="頂級和牛用塑膠臉盆裝，客人還想吃嗎？選錯圖表，數據就無法說話。今天分工：你選類型／驗收／寫推論，AI 代勞畫圖+描述初稿。想再進階壓測？可選用，不強迫。"
                chain="W13 把原始資料整理成『分析表』了——但一堆數字／訪談稿，怎麼讓人看得懂？這週學『讓數據自己說話』：選對圖、寫對說明。"
                meta={[
                    { label: '本週任務', value: '4 大圖表判斷 + AI 畫圖+人工驗收 + 自寫推論 + 進階壓測（可選）' },
                    { label: '時長', value: '100 MINS' },
                    { label: '課堂產出', value: '完成圖（含三鐵規驗收）+ 描述+推論（人工為主）' },
                    { label: '下週預告', value: 'W15 四層結論' },
                ]}
            />
            <CourseArc items={W14Data.courseArc} />

            <TaskCard
                weekNumber="W14"
                weekTitle={W14Data.title}
                duration={`${W14Data.duration} 分鐘 · ${W14Data.durationDesc}`}
                tasks={[
                    '四大圖表速查（折線／圓餅／長條／散佈）— 選對才能讓數據說話',
                    '圖說寫作公式 — 描述（客觀）+ 推論（主觀）',
                    'AI 協作三步 — 自己寫初稿 → AI 檢核 → 人工判斷取捨',
                ]}
                exportReminder="匯出 W14 圖表 + 圖說 → W15 結論呼應使用"
            />

            {/* W14 任務前警戒語 — 3 條核心紅線 */}
            <ResearcherRedlines mode="warning" stage="W14" />

            {/* STEP ENGINE */}
            <StepEngine
                steps={steps}
                prevWeek={{ label: '回 W13 資料整理週', to: '/w13' }}
                nextWeek={{ label: '前往 W15 研究結論', to: '/w15' }}
            flat
            />

            {/* W14 選圖判斷檢核 — 學生不會用試算表沒關係，但選圖判斷不能外包給 AI */}
            <ChartChoiceChecker dataKey="w14-chart-choice" />

            {/* W14 改寫練習 — 反糾察隊配套 */}
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

            {/* W14 階段紅線完整版 — 5 條 · 做完反思用 */}
            <ResearcherRedlines mode="subset" stage="W14" collapsible />
        </div>
    );
};

export { W14Page };
export default W14Page;
