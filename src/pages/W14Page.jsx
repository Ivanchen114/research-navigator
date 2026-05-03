import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import CourseArc from '../components/ui/CourseArc';
import { W14Data } from '../data/lessonMaps';
import './W14.css';
import ThinkRecord from '../components/ui/ThinkRecord';
import AIREDNarrative from '../components/ui/AIREDNarrative';
import StepEngine from '../components/ui/StepEngine';
import HeroBlock from '../components/ui/HeroBlock';
import ExportButton from '../components/ui/ExportButton';
import ResetWeekButton from '../components/ui/ResetWeekButton';
import AICollaborationPrinciples from '../components/ui/AICollaborationPrinciples';
import AIDialogSubmission from '../components/ui/AIDialogSubmission';
import AIModePicker from '../components/ui/AIModePicker';
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
    /* Step 4 — AI 畫圖工作坊 */
    { key: 'w14-pre-judgment', label: '草圖判讀（先別開 AI）', question: '我預期會看到什麼趨勢？最重要的發現是什麼？' },
    { key: 'w14-my-chart-type', label: '我的圖表類型與理由' },
    { key: 'w14-ai-blindspot', label: 'AI 找到的盲點 / 我沒注意到的趨勢' },
    { key: 'w14-validation-check', label: '圖表驗收結果' },
    { key: 'w14-my-description', label: '我的描述（藍筆）' },
    { key: 'w14-my-inference', label: '我的推論（紅筆）' },
    { key: 'w14-ai-pressure-test', label: 'AI 壓力測試後我做了哪些修正' },
    { key: 'w14-ai-dialog-submission', label: 'AI 完整對話繳交方式（必填）', question: 'A 私人註解 / B 文件上傳並貼連結' },
    /* Step 5 */
    { key: 'w14-w15-preview', label: 'W15 預告：結論的第三層和第四層' },
    { key: 'w14-aired-record', label: 'AI-RED 敘事紀錄（本週必填）', question: '本週用 AI 畫圖的最重要一次互動（A-I-R-E-D 五要素）' },
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

                    <ThinkRecord
                        dataKey="w14-chart-exercise"
                        prompt="把四題的答案和理由寫下來"
                        scaffold={['第1題：___圖，因為...', '第2題：___圖，因為...', '第3題：___圖，因為...', '第4題：___圖，因為...']}
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
            title: 'AI 畫圖工作坊',
            icon: <BarChart2 size={18} />,
            content: (
                <div className="flex flex-col gap-6 prose-zh">
                    <div className="p-4 rounded-[var(--radius-unified)] border border-[var(--border)] bg-[var(--paper-warm)]">
                        <p className="text-[14px] font-bold text-[var(--ink)] mb-1">🛠️ AI 畫圖工作坊：先判讀 → AI 畫 → 找漏洞</p>
                        <p className="text-[12px] text-[var(--ink-mid)] leading-relaxed">
                            開你 W13 整理好的分析表。<strong>先用腦袋讀懂自己的資料</strong>（草圖判讀）→ 結構化 prompt 給 Gemini → 看 AI 畫的圖跟你預期差多少 → 找出你忽略的趨勢／盲點 → 寫描述＋推論。
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
                                    <p className="text-[11px] text-[#075985] font-bold uppercase tracking-wider mb-1">你 W13 寫的「想看的第一張圖」</p>
                                    <p className="text-[12px] text-[#0C4A6E] leading-relaxed">{w13W14Question}</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* AI 協作三原則（W14 角色：反思鏡） */}
                    <AICollaborationPrinciples week="14" role="mirror" compact={false} />

                    {/* AI 模式選擇 */}
                    <AIModePicker week="14" taskName="畫圖判讀" onChange={setW14AiMode} />

                    {/* 驗收型：先寫草圖判讀 */}
                    {w14AiMode === 'verify' && (
                        <>
                            <div className="p-5 rounded-[var(--radius-unified)] border-2 border-[#FCA5A5] bg-[#FEF2F2]">
                                <p className="text-[14px] font-bold text-[#991B1B] mb-2 flex items-center gap-2">
                                    <ShieldAlert size={16} /> 第①步 · 草圖判讀（驗收型必做）
                                </p>
                                <p className="text-[12px] text-[#7F1D1D] leading-relaxed mb-2">
                                    驗收型 = 你已經有概念了。<strong>沒先寫判讀就丟給 AI = 你說不出 AI 給的對不對</strong>。
                                    用腦袋（不是 AI）先回答下面三個問題。寫不出來，就改用「教學型」。
                                </p>
                            </div>
                            <ThinkRecord
                                dataKey="w14-pre-judgment"
                                prompt="① 我的草圖判讀（先別開 AI）"
                                scaffold={[
                                    '我選的變項：X = ___，Y = ___（為什麼選這兩個？）',
                                    '我預期會看到的趨勢／模式：（口語描述，例：高一比高三花更多時間滑手機）',
                                    '我預期最重要的發現：（如果這張圖只能講一句話，這句話是什麼？）',
                                ]}
                            />
                        </>
                    )}

                    {/* 教學型：請 AI 教我能畫什麼 */}
                    {w14AiMode === 'teach' && (
                        <>
                            <div className="p-5 rounded-[var(--radius-unified)] border-2 border-[#86EFAC] bg-[#F0FDF4]">
                                <p className="text-[14px] font-bold text-[#166534] mb-2 flex items-center gap-2">
                                    🎓 第①步 · 請 AI 教我（教學型）
                                </p>
                                <p className="text-[12px] text-[#166534] leading-relaxed mb-3">
                                    你完全不知道這份資料能畫什麼？沒關係——把資料樣態貼給 Gemini，請它<strong>給範例</strong>。
                                    記得 AI 給範例後，<strong>你要自己選圖表類型 + 自己寫一次</strong>，不要只複製。
                                </p>
                                <pre className="bg-[#0F172A] text-[#E2E8F0] text-[11.5px] leading-[1.7] p-3 rounded-[6px] whitespace-pre-wrap font-mono overflow-x-auto">{`我有一份分析表（N=___），但我完全不知道這份資料能畫什麼圖、能看出什麼。

我的研究問題是：___
分析表的欄位：___（貼欄位清單）

【請你做】
1. 給我 2-3 個「這份資料可以畫的圖」範例（每個說明：用什麼圖表類型、X/Y 軸是什麼、預期會看到什麼）
2. 列出我可以從這份資料問的 3 個分析問題（從淺到深）
3. 教我用最簡單的方式判斷「該用什麼圖表」（口訣或決策樹）

【不要做】
- 不要直接幫我畫完
- 不要替我寫描述/推論
- 我看完範例後會自己選一個來做`}</pre>
                            </div>
                            <ThinkRecord
                                dataKey="w14-teach-reflection"
                                prompt="① 教學型反思（AI 教完後寫）"
                                scaffold={[
                                    'AI 給我哪 2-3 個範例？我選哪一個方向做？',
                                    'AI 教我的「圖表選擇判斷」是什麼？我用自己的話解釋一次：',
                                    '我接下來要畫的圖（變項+類型+預期看到什麼）：（自己寫，不抄 AI）',
                                ]}
                            />
                        </>
                    )}

                    {!w14AiMode && (
                        <div className="rounded-[var(--radius-unified)] border border-[var(--border)] bg-[var(--paper-warm)] p-3">
                            <p className="text-[12px] text-[var(--ink-mid)] leading-relaxed">
                                ☝️ 上方先選一個 AI 使用模式，這裡會顯示對應的指引。
                            </p>
                        </div>
                    )}
                    <ThinkRecord
                        dataKey="w14-my-chart-type"
                        prompt="我選用的圖表類型是什麼？為什麼？（套用口訣說明）"
                        scaffold={[
                            '圖表類型：折線圖 / 圓餅圖 / 長條圖 / 散佈圖',
                            '原因（套用口訣）：因為我的資料是在看...',
                            '圖表標題：圖一：___ (N=___)',
                        ]}
                    />

                    {/* —— 第②步 給 Gemini 畫圖 —— */}
                    <div className="p-5 rounded-[var(--radius-unified)] border-2 border-[var(--accent)] bg-[#F8F8FB]">
                        <p className="text-[14px] font-bold text-[var(--accent)] mb-2 flex items-center gap-2">
                            <Gamepad2 size={16} /> 第②步 · 結構化 prompt 給 Gemini Pro
                        </p>
                        <p className="text-[12px] text-[var(--ink-mid)] leading-relaxed mb-3">
                            打開 <strong>Gemini Pro · 思考模式 + Canvas</strong>。把分析表（CSV / 連結）+ 下方 prompt 一起貼進去。
                        </p>
                        <pre className="bg-[#0F172A] text-[#E2E8F0] text-[11.5px] leading-[1.7] p-3 rounded-[6px] whitespace-pre-wrap font-mono overflow-x-auto">{`【任務】
依我提供的判讀，幫我把資料畫成圖。
不要自行更換圖表類型、不要自行新增變項。

【我的判讀】
- 變項：X = ___，Y = ___
- 預期趨勢：___
- 我選的圖表類型：___（折線/圓餅/長條/散佈）
- 樣本數：N = ___

【分析表】
___（貼資料或連結）

【請輸出】
1. 用我選的圖表類型畫出圖（Canvas 顯示）
2. 標題、N 值、座標軸、資料來源依學術圖表規範
3. 你看完資料後，告訴我：我的預期趨勢對不對？

不要替我寫圖說，圖說由我自己來。`}</pre>
                        <p className="text-[11px] text-[var(--ink-light)] italic leading-relaxed mt-3">
                            💡 看 Gemini 思考模式：它怎麼選圖表？跟你選的一致嗎？不一致誰對？
                        </p>
                    </div>

                    {/* —— 第③步 AI 找漏洞 —— */}
                    <div className="p-5 rounded-[var(--radius-unified)] border-2 border-[#7C3AED] bg-[#F5F3FF]">
                        <p className="text-[14px] font-bold text-[#5B21B6] mb-2 flex items-center gap-2">
                            🔍 第③步 · 請 AI 找出你忽略的盲點
                        </p>
                        <p className="text-[12px] text-[#4C1D95] leading-relaxed mb-3">
                            高一學生分析力還在長——AI 可以搭你的鷹架，戳出你<strong>沒看到的角度</strong>。注意：AI 只給線索，判斷由你。
                        </p>
                        <pre className="bg-[#0F172A] text-[#E2E8F0] text-[11.5px] leading-[1.7] p-3 rounded-[6px] whitespace-pre-wrap font-mono overflow-x-auto">{`接續上一輪。

【我的判讀】（重貼一次）
- 預期趨勢：___
- 預期最重要的發現：___

【請從研究方法老師角度幫我做兩件事】
1. 找出我這份資料裡，可能有但我沒注意到的 3 個趨勢／模式
2. 標出 1-2 個「乍看像趨勢、但其實樣本不足以支持」的點，提醒我不要過度解讀

不要替我寫結論，只給我提示——「也許可以注意 ___」這種句型。`}</pre>
                    </div>
                    <ThinkRecord
                        dataKey="w14-ai-blindspot"
                        prompt="② AI 找到的盲點 / 我沒注意到的趨勢"
                        scaffold={[
                            'AI 指出我可能忽略的趨勢：',
                            'AI 警告我不要過度解讀的點：',
                            '我採納哪些、不採納哪些：',
                        ]}
                    />

                    {/* —— 第④步 驗收 —— */}
                    <div className="p-4 rounded-[var(--radius-unified)] border-2 border-[#FCD34D] bg-[#FFFBEB]">
                        <p className="text-[13px] font-bold text-[#92400E] mb-2 flex items-center gap-2">
                            <ShieldAlert size={14} /> 第④步 · 驗收清單（每項都要對）
                        </p>
                        <ul className="text-[11px] text-[#78350F] leading-relaxed space-y-1">
                            <li>☐ 圖表類型 = 我選的（不是 AI 擅自改的）</li>
                            <li>☐ 標題在上方，含 N 值</li>
                            <li>☐ 資料來源在下方</li>
                            <li>☐ 座標軸沒騙人（沒截斷、比例合理）</li>
                            <li>☐ AI 對我預期趨勢的判讀我有看懂、有同意 / 不同意的依據</li>
                        </ul>
                    </div>
                    <ThinkRecord
                        dataKey="w14-validation-check"
                        prompt="③ 圖表驗收結果"
                        scaffold={[
                            '5 項驗收都通過？☐ 是 / ☐ 否（哪幾項沒過？）',
                            'AI 的判讀我同意嗎？為什麼？',
                            '修正了哪些細節：',
                        ]}
                    />

                    {/* —— 第⑤步 寫描述＋推論 —— */}
                    <div className="p-4 rounded-[var(--radius-unified)] border border-[var(--border)] bg-[var(--paper-warm)]">
                        <p className="text-[14px] font-bold text-[var(--ink)] mb-1">✍️ 第⑤步 · 寫圖說（描述＋推論，這步自己寫）</p>
                        <p className="text-[12px] text-[var(--ink-mid)] leading-relaxed">
                            根據驗收完的圖，用你<strong>自己的話</strong>寫描述（藍筆）＋推論（紅筆）。AI 圖說不能照抄。
                        </p>
                    </div>
                    <div>
                        <p className="text-[13px] font-bold mb-2" style={{ color: '#1E40AF' }}>🔵 描述（藍筆）：客觀事實</p>
                        <ThinkRecord
                            dataKey="w14-my-description"
                            prompt="根據你的圖表，你看到了什麼？報事實、報數字。"
                            scaffold={['根據圖一，...', '其中最明顯的是...']}
                        />
                    </div>
                    <div>
                        <p className="text-[13px] font-bold mb-2" style={{ color: '#991B1B' }}>🔴 推論（紅筆）：主觀見解</p>
                        <ThinkRecord
                            dataKey="w14-my-inference"
                            prompt="這個數據代表什麼？解釋意義、推測原因。"
                            scaffold={['這可能代表...', '因為...']}
                        />
                    </div>

                    {/* —— 第⑥步 AI 壓力測試（推論） —— */}
                    <details className="p-4 rounded-[var(--radius-unified)] border-2 border-[#7C3AED] bg-[#F5F3FF]">
                        <summary className="text-[13px] font-bold text-[#5B21B6] cursor-pointer flex items-center justify-between">
                            <span>🥊 第⑥步 · AI 推論壓力測試（推論寫完再開）</span>
                            <span className="text-[10px] font-mono text-[var(--ink-light)]">▼</span>
                        </summary>
                        <div className="mt-3 space-y-3">
                            <p className="text-[12px] text-[#4C1D95] leading-relaxed">
                                推論最容易踩兩個雷：① <strong>過度推論</strong>（N=30 推到「全國高中生」）；② <strong>單一原因</strong>（只想到一個解釋就停）。讓 AI 壓力測試。
                            </p>
                            <pre className="bg-[#0F172A] text-[#E2E8F0] text-[11.5px] leading-[1.7] p-3 rounded-[6px] whitespace-pre-wrap font-mono overflow-x-auto">{`接續上一輪。

【我的描述】___（貼）
【我的推論】___（貼）
【樣本資訊】N=___，對象是 ___

【請壓力測試】
1. 我的推論有沒有過度推論？哪些用詞要加「可能」「推測」「在 ___ 範圍內」？
2. 除了我寫的這個原因，還有哪 2 個合理但我沒想到的解釋？
3. 我的描述有沒有量詞不精準的地方（38% 寫成「絕大多數」）？

只給檢查與建議，不要替我改寫——改寫由我自己來。`}</pre>
                            <p className="text-[11px] text-[var(--ink-light)] italic leading-relaxed">
                                💡 AI 給建議後，回到上方推論欄修——你<strong>採納哪些</strong>再自己改，不照抄。
                            </p>
                        </div>
                    </details>
                    <ThinkRecord
                        dataKey="w14-ai-pressure-test"
                        prompt="④ AI 壓力測試後我做了哪些修正"
                        scaffold={[
                            'AI 指出的問題：',
                            '我採納哪些建議：',
                            '我修正了什麼（描述／推論的具體用詞）：',
                        ]}
                    />

                    {/* 完整對話繳交 */}
                    <AIDialogSubmission week="14" taskName="圖表判讀對話" required={true} />

                    {/* 教師巡視提醒 */}
                    <div className="p-4 rounded-[var(--radius-unified)] border border-[var(--border)]">
                        <p className="text-[12px] font-bold text-[var(--ink)] mb-2">👀 老師巡視會檢查三件事</p>
                        <div className="text-[12px] text-[var(--ink-mid)] leading-relaxed flex flex-col gap-1">
                            <span>1. 你有<strong>先寫草圖判讀</strong>再開 AI（沒寫的代表沒判讀）</span>
                            <span>2. 圖表類型選擇是否正確 + 格式三鐵規（標題、N、來源）</span>
                            <span>3. 描述／推論不是 AI 改寫版，是你<strong>採納後自己改</strong>的</span>
                        </div>
                    </div>
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

                    {/* AIRED 敘事紀錄（W14 必填，因為使用了 AI 畫圖工作坊） */}
                    <AIREDNarrative week="14" hint="本週用 AI 畫圖：A=Gemini Pro Canvas / I=結構化 prompt / R=AI 畫的圖+找到的盲點 / E=我的判讀 vs AI 的判讀差在哪 / D=採納哪些修正" />

                    {/* 本週結束，你應該要會 — B 標準格式 */}
                    <div className="bg-white border border-[var(--border)] rounded-[var(--radius-unified)] overflow-hidden mb-4">
                        <div className="p-4 px-5 bg-[var(--paper-warm)] border-b border-[var(--border)] font-bold text-[13px]">
                            ✅ 本週結束，你應該要會
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-[1px] bg-[var(--border)]">
                            {[
                                                '為自己的數據選對圖表類型並說清楚理由',
                                                '寫出符合格式的圖說（圖號／題目／單位／資料來源）',
                                                '區分「描述」（藍筆）和「推論」（紅筆），避免推論失控',
                                                '識別三大常見圖表錯誤（誤導比例／截斷座標／樣本失衡）',
                            ].map((item, i) => (
                                <div key={i} className="p-4 px-5 bg-white flex items-start gap-3">
                                    <span className="text-[var(--success)] text-[16px] mt-0.5 flex-shrink-0">✓</span>
                                    <span className="text-[13px] text-[var(--ink-mid)] leading-relaxed">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <ExportButton
                        weekLabel="W14 讓數據自己說話：圖表選擇與圖的說明"
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
                accentTitle="圖表選擇與圖的說明"
                subtitle="頂級和牛用塑膠臉盆裝，客人還想吃嗎？選錯圖表，數據就無法說話。今天學會選對盤子、寫好圖說。"
                chain="資料收齊了——但一堆數字／訪談稿，怎麼讓人看得懂？這週學『讓數據自己說話』：選對圖、寫對說明。"
                meta={[
                    { label: '本週任務', value: '四大圖表判斷 + 三鐵規寫圖說' },
                    { label: '時長', value: '100 MINS' },
                    { label: '課堂產出', value: '各組實戰圖表 + 藍筆描述紅筆推論' },
                    { label: '下週預告', value: 'W15 四層結論' },
                ]}
            />
            <CourseArc items={W14Data.courseArc} />

            {/* STEP ENGINE */}
            <StepEngine
                steps={steps}
                prevWeek={{ label: '回 W13 資料整理週', to: '/w13' }}
                nextWeek={{ label: '前往 W15 研究結論', to: '/w15' }}
            flat
            />
        </div>
    );
};

export { W14Page };
export default W14Page;
