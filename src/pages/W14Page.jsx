import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import CourseArc from '../components/ui/CourseArc';
import { W13Data } from '../data/lessonMaps';
import './W14.css';
import ThinkRecord from '../components/ui/ThinkRecord';
import AIREDNarrative from '../components/ui/AIREDNarrative';
import StepEngine from '../components/ui/StepEngine';
import HeroBlock from '../components/ui/HeroBlock';
import ExportButton from '../components/ui/ExportButton';
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
    { key: 'w14-case-1', label: '案例一：研究樣本背景' },
    { key: 'w14-case-2', label: '案例二：兩性愛情觀' },
    { key: 'w14-case-3', label: '案例三：精神病患民調' },
    /* Step 4 */
    { key: 'w14-my-chart-type', label: '我的圖表類型與理由' },
    { key: 'w14-my-description', label: '我的描述（藍筆）' },
    { key: 'w14-my-inference', label: '我的推論（紅筆）' },
    /* Step 5 */
    { key: 'w14-w15-preview', label: 'W15 預告：結論的第三層和第四層' },
    { key: 'w14-aired-record', label: 'AI-RED 敘事紀錄', question: '本週最重要的一次 AI 互動（A-I-R-E-D 五要素）' },
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

                    {/* 案例一 */}
                    <div className="w14-case-card">
                        <div className="w14-case-header">案例一：研究樣本背景</div>
                        <div className="w14-case-body">
                            <p><strong>數據：</strong>年齡 19-25 歲者佔絕大多數（男 77.3%，女 86.83%）。</p>
                            <p className="mt-2">這份問卷的主要調查對象大多為___。「絕大多數」這個說法精準嗎？為什麼？</p>
                        </div>
                    </div>
                    <ThinkRecord dataKey="w14-case-1" prompt="案例一作答" scaffold={['主要調查對象是...', '「絕大多數」不夠精準，因為...']} />

                    {/* 案例二 */}
                    <div className="w14-case-card">
                        <div className="w14-case-header">案例二：兩性愛情觀</div>
                        <div className="w14-case-body">
                            <p><strong>數據：</strong>Q1 曾有單戀經驗（男 78%、女 79%）；Q2 主動追求（男 56%、女 31%）。</p>
                            <p className="mt-2">
                                <span className="text-[#1E40AF]">描述：</span>兩性在單戀經驗上比例相當；但在主動追求上，男生顯著___於女生。
                                <br /><span className="text-[#991B1B]">推論：</span>社會文化可能仍傾向由___性扮演主動角色。
                            </p>
                        </div>
                    </div>
                    <ThinkRecord dataKey="w14-case-2" prompt="案例二作答：填入描述和推論的空格" scaffold={['描述：男生顯著___於女生', '推論：___性扮演主動角色']} />

                    {/* 案例三 */}
                    <div className="w14-case-card">
                        <div className="w14-case-header">案例三：精神病患處置民調</div>
                        <div className="w14-case-body">
                            <p><strong>數據：</strong>73.5% 民眾不滿現況；不滿主因是「結束刑期後的社會危害（如再犯）」（85.3%）。</p>
                            <p className="mt-2">請用「描述＋推論」公式，把這兩個數字整合成一段完整的說明。</p>
                        </div>
                    </div>
                    <ThinkRecord dataKey="w14-case-3" prompt="案例三：用描述＋推論公式寫出完整說明" scaffold={['描述：根據調查結果，...', '推論：這可能反映出...']} />

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
            title: '各組實戰',
            icon: <BarChart2 size={18} />,
            content: (
                <div className="flex flex-col gap-6 prose-zh">
                    <div className="p-4 rounded-[var(--radius-unified)] border border-[var(--border)] bg-[var(--paper-warm)]">
                        <p className="text-[14px] font-bold text-[var(--ink)] mb-1">🛠️ 把公式套到你自己的資料上</p>
                        <p className="text-[12px] text-[var(--ink-mid)] leading-relaxed">
                            打開你的問卷回覆或實驗數據，挑選最關鍵的 1-2 個變項，製作圖表，然後寫出描述＋推論。
                        </p>
                    </div>

                    {/* 帶入研究資訊 */}
                    {myTopic && (
                        <div className="p-4 rounded-[var(--radius-unified)] bg-[#F0F9FF] border border-[#BAE6FD]">
                            <p className="text-[12px] text-[#0369A1] font-bold mb-1">📂 你的研究</p>
                            <p className="text-[13px] text-[#0C4A6E]">{myTopic}</p>
                            {myMethod && <p className="text-[12px] text-[#0369A1] mt-1">方法：{myMethod}</p>}
                        </div>
                    )}

                    {/* 圖表類型選擇 */}
                    <ThinkRecord
                        dataKey="w14-my-chart-type"
                        prompt="我選用的圖表類型是什麼？為什麼？（套用口訣說明）"
                        scaffold={[
                            '圖表類型：折線圖 / 圓餅圖 / 長條圖 / 散佈圖',
                            '原因（套用口訣）：因為我的資料是在看...',
                            '圖表標題：圖一：___ (N=___)',
                        ]}
                    />

                    {/* 描述（藍筆） */}
                    <div>
                        <p className="text-[13px] font-bold mb-2" style={{ color: '#1E40AF' }}>🔵 描述（藍筆）：客觀事實</p>
                        <ThinkRecord
                            dataKey="w14-my-description"
                            prompt="根據你的圖表，你看到了什麼？報事實、報數字。"
                            scaffold={['根據圖一，...']}
                        />
                    </div>

                    {/* 推論（紅筆） */}
                    <div>
                        <p className="text-[13px] font-bold mb-2" style={{ color: '#991B1B' }}>🔴 推論（紅筆）：主觀見解</p>
                        <ThinkRecord
                            dataKey="w14-my-inference"
                            prompt="這個數據代表什麼？解釋意義、推測原因。"
                            scaffold={['這可能代表...', '因為...']}
                        />
                    </div>

                    {/* 教師巡視提醒 */}
                    <div className="p-4 rounded-[var(--radius-unified)] border border-[var(--border)]">
                        <p className="text-[12px] font-bold text-[var(--ink)] mb-2">👀 老師巡視會檢查三件事</p>
                        <div className="text-[12px] text-[var(--ink-mid)] leading-relaxed flex flex-col gap-1">
                            <span>1. 圖表類型選擇是否正確</span>
                            <span>2. 標題在上方（含 N 值）、資料來源在下方</span>
                            <span>3. 描述有沒有說到最高值、最低值或最明顯的數字</span>
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

                                        {/* AIRED 敘事紀錄（循序漸進：五欄 → 一段話） */}
                    <AIREDNarrative week="14" hint="選圖表、寫圖說可能用 AI 建議" optional={true} />

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
                    <span className="hidden md:inline-block bg-[var(--ink)] text-white text-[10px] font-bold px-2 py-0.5 rounded-[2px] font-mono">AI-RED · D</span>
                </div>
            </div>

            {/* PAGE HEADER — Hero Block */}
            <HeroBlock
                kicker="R.I.B. 調查檔案 · 研究方法與專題 · W14"
                title="讓數據自己說話 · "
                accentTitle="圖表選擇與圖的說明"
                subtitle="頂級和牛用塑膠臉盆裝，客人還想吃嗎？選錯圖表，數據就無法說話。今天學會選對盤子、寫好圖說。"
                meta={[
                    { label: '本週任務', value: '四大圖表判斷 + 三鐵規寫圖說' },
                    { label: '時長', value: '100 MINS' },
                    { label: '課堂產出', value: '各組實戰圖表 + 藍筆描述紅筆推論' },
                    { label: '下週預告', value: 'W15 四層結論' },
                ]}
            />
            <CourseArc items={W13Data.courseArc} />

            {/* STEP ENGINE */}
            <StepEngine
                steps={steps}
                prevWeek={{ label: '回 W13 中期盤點', to: '/w13' }}
                nextWeek={{ label: '前往 W15 研究結論', to: '/w15' }}
            flat
            />
        </div>
    );
};

export { W14Page };
export default W14Page;
