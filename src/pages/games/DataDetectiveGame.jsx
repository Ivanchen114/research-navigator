import React, { useState } from 'react';

// ========== 淡色系圖表元件 ==========

// 長條圖 (含 Y 軸刻度)
const BarChart = ({ data, unit = '', color = '#6366f1' }) => {
    const max = Math.max(...data.map(d => d.value));
    const ceil = Math.ceil(max / 10) * 10;
    const ticks = [0, Math.round(ceil * 0.25), Math.round(ceil * 0.5), Math.round(ceil * 0.75), ceil];

    return (
        <div className="flex gap-2">
            {/* Y 軸刻度 */}
            <div className="flex flex-col justify-between items-end py-1 shrink-0 w-10">
                {[...ticks].reverse().map((t, i) => (
                    <span key={i} className="text-[10px] text-slate-400 font-mono leading-none">{t}{unit}</span>
                ))}
            </div>
            {/* 圖表區 */}
            <div className="flex-1">
                <div className="relative border-l-2 border-b-2 border-slate-300 flex items-stretch gap-3 px-3" style={{ height: '180px' }}>
                    {/* 水平格線 */}
                    {ticks.slice(1).map((t, i) => (
                        <div key={i} className="absolute left-0 right-0 border-t border-dashed border-slate-200"
                            style={{ bottom: `${(t / ceil) * 100}%` }} />
                    ))}
                    {/* 長條 */}
                    {data.map((d, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center justify-end relative z-10">
                            <span className="text-xs font-bold mb-1 whitespace-nowrap" style={{ color }}>{d.value}{unit}</span>
                            <div className="w-full max-w-16 rounded-t-lg transition-all duration-700"
                                style={{
                                    height: `${(d.value / ceil) * 100}%`,
                                    backgroundColor: color,
                                    opacity: 0.85
                                }}>
                            </div>
                        </div>
                    ))}
                </div>
                {/* X 軸標籤 */}
                <div className="flex gap-3 px-3 mt-1">
                    {data.map((d, i) => (
                        <div key={i} className="flex-1 text-center">
                            <span className="text-[10px] text-slate-500 font-medium leading-tight block">{d.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// 圓餅圖
const PieChart = ({ data }) => {
    const total = data.reduce((s, d) => s + d.value, 0);
    let cumulative = 0;
    const colors = ['#6366f1', '#f43f5e', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

    const segments = data.map((d, i) => {
        const start = cumulative;
        cumulative += (d.value / total) * 360;
        return { ...d, start, end: cumulative, color: colors[i % colors.length] };
    });

    const gradientStr = segments.map(s =>
        `${s.color} ${s.start}deg ${s.end}deg`
    ).join(', ');

    return (
        <div className="flex items-center gap-6 justify-center">
            <div
                className="w-36 h-36 rounded-full shrink-0 shadow-md"
                style={{ background: `conic-gradient(${gradientStr})` }}
            />
            <div className="space-y-1.5">
                {segments.map((s, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                        <div className="w-3 h-3 rounded-sm shrink-0" style={{ backgroundColor: s.color }} />
                        <span className="text-slate-600">{s.label}</span>
                        <span className="text-slate-400 font-mono font-bold">{Math.round((s.value / total) * 100)}%</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

// 折線圖 (含 XY 軸)
const LineChart = ({ data, unit = '', color = '#6366f1' }) => {
    const values = data.map(d => d.value);
    const max = Math.max(...values);
    const min = Math.min(...values);
    const padding = (max - min) * 0.15 || 1;
    const yMin = Math.floor(min - padding);
    const yMax = Math.ceil(max + padding);
    const yRange = yMax - yMin || 1;

    // SVG dimensions
    const svgW = 400;
    const svgH = 180;
    const padL = 45; // left padding for Y labels
    const padR = 15;
    const padT = 20;
    const padB = 30; // bottom padding for X labels
    const chartW = svgW - padL - padR;
    const chartH = svgH - padT - padB;

    const points = data.map((d, i) => ({
        x: padL + (i / (data.length - 1)) * chartW,
        y: padT + chartH - ((d.value - yMin) / yRange) * chartH
    }));

    const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

    // Y axis ticks (5 ticks)
    const yTicks = Array.from({ length: 5 }, (_, i) => yMin + (yRange / 4) * i);

    return (
        <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full" style={{ maxHeight: '220px' }}>
            {/* Grid lines */}
            {yTicks.map((tick, i) => {
                const y = padT + chartH - ((tick - yMin) / yRange) * chartH;
                return (
                    <g key={i}>
                        <line x1={padL} y1={y} x2={svgW - padR} y2={y} stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4,3" />
                        <text x={padL - 6} y={y + 3} textAnchor="end" fontSize="9" fill="#94a3b8" fontFamily="monospace">
                            {Number.isInteger(tick) ? tick : tick.toFixed(1)}{unit}
                        </text>
                    </g>
                );
            })}

            {/* Y axis line */}
            <line x1={padL} y1={padT} x2={padL} y2={padT + chartH} stroke="#94a3b8" strokeWidth="1.5" />
            {/* X axis line */}
            <line x1={padL} y1={padT + chartH} x2={svgW - padR} y2={padT + chartH} stroke="#94a3b8" strokeWidth="1.5" />

            {/* Area fill */}
            <path
                d={`${pathD} L ${points[points.length - 1].x} ${padT + chartH} L ${points[0].x} ${padT + chartH} Z`}
                fill={color}
                opacity="0.08"
            />

            {/* Line */}
            <path d={pathD} fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" />

            {/* Points & labels */}
            {points.map((p, i) => (
                <g key={i}>
                    <circle cx={p.x} cy={p.y} r="4.5" fill="white" stroke={color} strokeWidth="2.5" />
                    <text x={p.x} y={p.y - 10} textAnchor="middle" fontSize="9" fill={color} fontWeight="bold" fontFamily="sans-serif">
                        {data[i].value}{unit}
                    </text>
                    <text x={p.x} y={padT + chartH + 16} textAnchor="middle" fontSize="9" fill="#64748b" fontFamily="sans-serif">
                        {data[i].label}
                    </text>
                </g>
            ))}
        </svg>
    );
};

// ========== 題目資料庫 ==========
const caseData = [
    {
        id: 1,
        title: "社團參與與學業成績",
        chartType: "bar",
        chartData: [
            { label: "有參加社團", value: 82 },
            { label: "沒參加社團", value: 78 }
        ],
        chartUnit: "分",
        chartColor: "#6366f1",
        dataSource: "某高中 200 名學生段考平均",
        conclusion: "加入社團可以提升學業成績",
        isValid: false,
        errorType: "因果謬誤",
        explanation: "數據只顯示「有參加社團的學生成績較高」（相關性），但不能推論「參加社團→提升成績」（因果性）。可能的混淆變項：成績好的學生本來就更有餘力參加社團。",
        tags: ["相關≠因果", "混淆變項"]
    },
    {
        id: 2,
        title: "早餐與遲到率",
        chartType: "bar",
        chartData: [
            { label: "每天吃早餐", value: 5 },
            { label: "偶爾吃", value: 12 },
            { label: "不吃早餐", value: 23 }
        ],
        chartUnit: "%",
        chartColor: "#f43f5e",
        dataSource: "學校一學期遲到紀錄 (n=450)",
        conclusion: "不吃早餐的學生更容易遲到",
        isValid: true,
        errorType: null,
        explanation: "這個結論只描述了「相關性」——不吃早餐的學生遲到比例較高。注意它說的是「更容易」而非「導致」，用詞精準，並未做出因果宣稱，所以是合理推論。",
        tags: ["用詞精準", "正確描述相關"]
    },
    {
        id: 3,
        title: "補習時數與學業滿意度",
        chartType: "line",
        chartData: [
            { label: "0hr", value: 72 },
            { label: "2hr", value: 76 },
            { label: "4hr", value: 79 },
            { label: "6hr", value: 75 },
            { label: "8hr", value: 68 },
            { label: "10hr", value: 60 }
        ],
        chartUnit: "",
        chartColor: "#f59e0b",
        dataSource: "問卷調查：每週補習時數 vs. 學業滿意度自評 (n=180)",
        conclusion: "補習時數越多，學業滿意度越低",
        isValid: false,
        errorType: "選擇性解讀",
        explanation: "折線圖顯示的是「倒 U 型」關係：0-4 小時滿意度上升，4 小時後才下降。但結論只描述了下降段，忽略了上升段。正確說法：補習時數與滿意度呈倒 U 型關係，適量補習（4 小時左右）滿意度最高。",
        tags: ["選擇性解讀", "忽略趨勢"]
    },
    {
        id: 4,
        title: "班級閱讀課成效",
        chartType: "bar",
        chartData: [
            { label: "實施前(9月)", value: 45 },
            { label: "實施後(12月)", value: 62 }
        ],
        chartUnit: "分",
        chartColor: "#10b981",
        dataSource: "某班閱讀理解測驗平均分 (n=35)",
        conclusion: "閱讀課有效提升了學生的閱讀理解能力",
        isValid: false,
        errorType: "缺乏對照組",
        explanation: "只有一個班在兩個時間點的比較，沒有對照組。分數提升可能是因為：學生自然成長、練習效應（第二次考同類型題目變熟）、其他課程的幫助等。需要一個「沒有實施閱讀課」的對照班來比較。",
        tags: ["缺乏對照組", "成熟效應"]
    },
    {
        id: 5,
        title: "學生壓力來源分佈",
        chartType: "pie",
        chartData: [
            { label: "課業考試", value: 45 },
            { label: "人際關係", value: 20 },
            { label: "家庭期望", value: 18 },
            { label: "未來升學", value: 12 },
            { label: "其他", value: 5 }
        ],
        dataSource: "校園壓力量表問卷 (n=300)",
        conclusion: "近半數學生表示課業考試是其主要壓力來源",
        isValid: true,
        errorType: null,
        explanation: "圓餅圖清楚顯示「課業考試」佔 45%，接近一半。結論使用「近半數」和「主要壓力來源」的描述，精準對應了圖表所呈現的數據，沒有過度解讀。",
        tags: ["精準描述", "數據忠實"]
    },
    {
        id: 6,
        title: "手機使用與睡眠時間",
        chartType: "line",
        chartData: [
            { label: "1hr", value: 7.8 },
            { label: "2hr", value: 7.2 },
            { label: "3hr", value: 6.9 },
            { label: "4hr", value: 6.3 },
            { label: "5hr+", value: 5.8 }
        ],
        chartUnit: "hr",
        chartColor: "#8b5cf6",
        dataSource: "自我報告問卷 (n=220)",
        conclusion: "使用手機會導致失眠",
        isValid: false,
        errorType: "因果謬誤 + 過度概括",
        explanation: "兩個問題：(1)「導致」暗示因果，但這只是問卷相關數據；(2) 數據只顯示睡眠時間減少，但「失眠」是特定醫學狀態，從 5.8 小時不能直接定義為「失眠」。正確說法：手機使用時間越長，學生自報的睡眠時間越短。",
        tags: ["因果謬誤", "過度概括"]
    },
    {
        id: 7,
        title: "三校合作社滿意度",
        chartType: "bar",
        chartData: [
            { label: "A 校", value: 3.2 },
            { label: "B 校", value: 3.8 },
            { label: "C 校", value: 4.1 }
        ],
        chartUnit: "/5",
        chartColor: "#ec4899",
        dataSource: "合作社滿意度問卷 (A校n=50, B校n=200, C校n=180)",
        conclusion: "C 校合作社的服務品質顯然是三校中最好的",
        isValid: false,
        errorType: "忽略樣本差異",
        explanation: "A 校樣本只有 50 人（遠少於 B、C 校），分數可能不穩定。而且「滿意度」≠「服務品質」——可能 A 校學生期望較高所以評分低。另外 3.2 vs 4.1 的差異是否統計上顯著也需要檢定。",
        tags: ["樣本大小", "滿意度≠品質"]
    },
    {
        id: 8,
        title: "運動頻率與焦慮量表",
        chartType: "bar",
        chartData: [
            { label: "每週0次", value: 28 },
            { label: "每週1-2次", value: 22 },
            { label: "每週3-4次", value: 17 },
            { label: "每週5+次", value: 14 }
        ],
        chartUnit: "分",
        chartColor: "#10b981",
        dataSource: "焦慮自評量表 (BAI) 平均分 (n=250)",
        conclusion: "運動頻率越高的學生，焦慮自評分數有越低的趨勢",
        isValid: true,
        errorType: null,
        explanation: "結論精確地說「有越低的趨勢」（描述了相關方向），沒有宣稱「運動能降低焦慮」（避免了因果宣稱），也沒有過度概括。用「趨勢」一詞留下了適當的詮釋空間。",
        tags: ["精準用詞", "避免因果"]
    },
    {
        id: 9,
        title: "性別與數學成績",
        chartType: "bar",
        chartData: [
            { label: "男生", value: 74 },
            { label: "女生", value: 71 }
        ],
        chartUnit: "分",
        chartColor: "#f59e0b",
        dataSource: "某校高二段考數學成績 (n=320)",
        conclusion: "男生的數學能力比女生強",
        isValid: false,
        errorType: "過度概括 + 以偏概全",
        explanation: "三個問題：(1) 一次段考不能代表「數學能力」（信度不足）；(2)「某校」不能推論到所有學生（外推謬誤）；(3) 3 分差距可能沒有統計顯著性。正確說法：本次段考中，該校男生平均分略高於女生。",
        tags: ["以偏概全", "統計顯著性"]
    },
    {
        id: 10,
        title: "🔥 綜合魔王：線上學習成效",
        chartType: "line",
        chartData: [
            { label: "W1", value: 65 },
            { label: "W2", value: 68 },
            { label: "W3", value: 72 },
            { label: "W4", value: 70 },
            { label: "W5", value: 75 },
            { label: "W6", value: 78 }
        ],
        chartUnit: "分",
        chartColor: "#6366f1",
        dataSource: "某班線上學習平台週測平均 (n=38)",
        conclusion: "數據證明線上學習平台的教學效果持續穩定進步",
        isValid: false,
        errorType: "多重謬誤",
        explanation: "至少三個問題！(1)「證明」太強烈——觀察性數據不能「證明」；(2)「持續穩定進步」忽略了 W4 的下降；(3) 沒有對照組，分數提升可能是題目變簡單、學生適應考試形式等。正確說法：該班六週內的週測平均分呈波動上升趨勢。",
        tags: ["用詞過強", "選擇性解讀", "缺乏對照"]
    }
];

// ========== 遊戲主元件（淡色系）==========
export const DataDetectiveGame = () => {
    const [gameState, setGameState] = useState('start');
    const [currentIdx, setCurrentIdx] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [wrongCases, setWrongCases] = useState([]);

    const startGame = () => {
        setCurrentIdx(0);
        setScore(0);
        setSelectedAnswer(null);
        setIsAnswered(false);
        setWrongCases([]);
        setGameState('playing');
    };

    const handleAnswer = (answer) => {
        if (isAnswered) return;
        setSelectedAnswer(answer);
        setIsAnswered(true);
        const current = caseData[currentIdx];
        const isCorrect = answer === current.isValid;
        if (isCorrect) {
            setScore(s => s + 1);
        } else {
            setWrongCases(prev => [...prev, current]);
        }
    };

    const nextCase = () => {
        if (currentIdx < caseData.length - 1) {
            setCurrentIdx(i => i + 1);
            setSelectedAnswer(null);
            setIsAnswered(false);
        } else {
            setGameState('end');
        }
    };

    const renderChart = (c) => {
        switch (c.chartType) {
            case 'bar':
                return <BarChart data={c.chartData} unit={c.chartUnit} color={c.chartColor} />;
            case 'pie':
                return <PieChart data={c.chartData} />;
            case 'line':
                return <LineChart data={c.chartData} unit={c.chartUnit} color={c.chartColor} />;
            default:
                return null;
        }
    };

    // ================= START SCREEN (淡色) =================
    if (gameState === 'start') {
        return (
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl overflow-hidden flex flex-col items-center justify-center p-6 md:py-16 font-sans min-h-[600px]">
                <div className="bg-white p-8 md:p-12 rounded-2xl shadow-xl max-w-xl w-full text-center border-t-8 border-indigo-400 relative overflow-hidden">
                    <div className="absolute top-0 right-0 opacity-5 text-9xl -mt-4 -mr-4">📊</div>
                    <div className="text-7xl mb-6">🔎</div>
                    <h1 className="text-3xl md:text-5xl font-black text-indigo-600 mb-4 tracking-wide">數據偵探</h1>
                    <h2 className="text-xl md:text-2xl font-bold text-slate-500 mb-6 border-b border-slate-200 pb-4">圖表解讀大挑戰</h2>
                    <p className="text-slate-500 text-lg mb-8 font-medium leading-relaxed">
                        10 張圖表搭配<span className="text-indigo-600 font-bold">「分析結論」</span>，<br />
                        身為數據偵探的你，<br />
                        能分辨哪些是 <span className="text-emerald-600 font-bold">✅ 正確推論</span>，<br />
                        哪些是 <span className="text-rose-500 font-bold">❌ 過度推論</span> 嗎？
                    </p>
                    <div className="bg-slate-50 rounded-xl p-4 mb-8 text-left border border-slate-200">
                        <h3 className="text-sm font-bold text-slate-400 mb-3 tracking-wider">🔍 偵探須知</h3>
                        <div className="space-y-2 text-sm text-slate-600">
                            <p>📊 仔細看圖表中的<strong className="text-slate-800">數據</strong></p>
                            <p>💬 閱讀給出的<strong className="text-slate-800">「分析結論」</strong></p>
                            <p>🎯 判斷結論是 <strong className="text-emerald-600">合理推論</strong> 還是 <strong className="text-rose-500">過度解讀</strong></p>
                            <p>⚠️ 注意：相關≠因果、樣本大小、用詞是否精準</p>
                        </div>
                    </div>
                    <button
                        onClick={startGame}
                        className="bg-indigo-500 hover:bg-indigo-600 text-white font-black py-4 px-10 rounded-full text-xl transition transform hover:scale-105 shadow-lg active:scale-95"
                    >
                        開始調查數據 🔎
                    </button>
                </div>
            </div>
        );
    }

    // ================= END SCREEN (淡色) =================
    if (gameState === 'end') {
        let title = "";
        let color = "";
        if (score === 10) { title = "🏆 首席數據分析官！"; color = "text-amber-500"; }
        else if (score >= 8) { title = "📊 資深數據偵探！"; color = "text-indigo-600"; }
        else if (score >= 5) { title = "🔍 實習分析師！"; color = "text-emerald-600"; }
        else { title = "📉 被數據騙了！繼續修煉！"; color = "text-rose-500"; }

        return (
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl overflow-hidden flex flex-col items-center justify-center p-6 md:py-10 font-sans min-h-[600px]">
                <div className="bg-white p-8 rounded-2xl shadow-xl max-w-2xl w-full text-center border-t-8 border-indigo-400">
                    <h1 className="text-3xl font-bold text-slate-400 mb-4 tracking-widest">調查報告</h1>
                    <div className="text-7xl font-black mb-2 text-indigo-500">{score} <span className="text-3xl text-slate-300">/ 10</span></div>
                    <h2 className={`text-3xl font-black mb-6 ${color}`}>{title}</h2>

                    <button
                        onClick={startGame}
                        className="bg-indigo-100 hover:bg-indigo-200 text-indigo-600 font-bold py-3 px-8 rounded-full text-lg transition transform hover:scale-105 shadow-sm mb-8 border border-indigo-200"
                    >
                        重新調查 🔄
                    </button>

                    {wrongCases.length > 0 && (
                        <div className="text-left bg-rose-50 p-6 rounded-xl border-l-8 border-rose-400 max-h-96 overflow-y-auto">
                            <h3 className="text-xl font-black mb-4 text-slate-700">📋 誤判紀錄</h3>
                            <div className="space-y-4">
                                {wrongCases.map((wc, i) => (
                                    <div key={i} className="bg-white p-4 rounded-lg border border-rose-200 shadow-sm">
                                        <p className="font-bold text-slate-700 mb-1">{wc.title}</p>
                                        <p className="text-sm text-slate-500 mb-1">結論：「{wc.conclusion}」</p>
                                        <span className={`text-sm font-bold px-3 py-1 rounded-full ${wc.isValid ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-600'}`}>
                                            {wc.isValid ? '✅ 其實是正確推論' : `❌ ${wc.errorType}`}
                                        </span>
                                        <div className="flex flex-wrap gap-1 mt-2">
                                            {wc.tags.map(t => (
                                                <span key={t} className="bg-indigo-50 text-indigo-600 text-xs font-bold px-2 py-0.5 rounded border border-indigo-200">#{t}</span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {wrongCases.length === 0 && (
                        <div className="bg-emerald-50 text-emerald-700 border border-emerald-200 p-4 rounded-xl font-bold text-lg">
                            零誤判！你對數據的解讀能力堪稱完美！ 🎉
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // ================= PLAYING SCREEN (淡色) =================
    const current = caseData[currentIdx];
    if (!current) return null;
    const isBoss = current.title.includes('🔥');

    return (
        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl overflow-hidden flex flex-col items-center p-4 md:p-8 font-sans min-h-[600px]">
            <div className="max-w-4xl w-full">

                {/* Progress */}
                <div className="flex justify-between items-center mb-6 px-2">
                    <div className="bg-white text-indigo-600 font-bold px-5 py-2 rounded-full shadow-sm text-lg border border-indigo-200">
                        案件 {currentIdx + 1} / {caseData.length}
                    </div>
                    <div className="bg-white text-emerald-600 font-bold px-5 py-2 rounded-full shadow-sm text-lg border border-emerald-200">
                        正確: {score}
                    </div>
                </div>

                {/* Chart Card */}
                <div className={`bg-white p-6 md:p-8 rounded-2xl shadow-lg mb-6 border-l-8 transition-all relative overflow-hidden ${isBoss ? 'border-purple-400 shadow-purple-100' : 'border-indigo-400'}`}>
                    {isBoss && (
                        <div className="absolute top-0 right-0 bg-purple-500 text-white text-xs font-black px-4 py-1 rounded-bl-lg tracking-widest animate-pulse">
                            🔥 魔王題
                        </div>
                    )}

                    <div className="flex items-center gap-2 mb-3">
                        <span className="text-2xl">📊</span>
                        <h2 className="text-xl font-bold text-slate-800">{current.title}</h2>
                    </div>

                    <p className="text-xs text-slate-400 mb-4">資料來源：{current.dataSource}</p>

                    {/* Chart */}
                    <div className="bg-slate-50 rounded-xl p-5 mb-6 border border-slate-200">
                        {renderChart(current)}
                    </div>

                    {/* Tags */}
                    {isAnswered && (
                        <div className="flex flex-wrap gap-2 mb-3">
                            {current.tags.map(tag => (
                                <span key={tag} className="bg-indigo-50 text-indigo-600 font-bold px-3 py-1 rounded-md text-sm tracking-wider border border-indigo-200">
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Conclusion */}
                    <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                        <p className="text-xs text-amber-600 font-bold mb-2 tracking-wider">💬 分析結論：</p>
                        <p className="text-lg md:text-xl font-bold text-slate-800 leading-relaxed">
                            「{current.conclusion}」
                        </p>
                    </div>
                </div>

                {/* Answer Buttons */}
                {!isAnswered && (
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <button
                            onClick={() => handleAnswer(true)}
                            className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-2 border-emerald-300 hover:border-emerald-400 font-black py-5 px-6 rounded-xl text-xl transition-all hover:shadow-lg hover:-translate-y-1"
                        >
                            ✅ 合理推論
                        </button>
                        <button
                            onClick={() => handleAnswer(false)}
                            className="bg-rose-50 hover:bg-rose-100 text-rose-600 border-2 border-rose-300 hover:border-rose-400 font-black py-5 px-6 rounded-xl text-xl transition-all hover:shadow-lg hover:-translate-y-1"
                        >
                            ❌ 過度推論
                        </button>
                    </div>
                )}

                {/* Feedback */}
                {isAnswered && (
                    <div className={`p-6 rounded-2xl shadow-lg mb-6 border-l-8 ${selectedAnswer === current.isValid
                        ? 'bg-emerald-50 border-emerald-400'
                        : 'bg-rose-50 border-rose-400'
                        }`}>
                        <h3 className={`text-2xl font-black mb-3 ${selectedAnswer === current.isValid ? 'text-emerald-700' : 'text-rose-600'
                            }`}>
                            {selectedAnswer === current.isValid
                                ? (current.isValid
                                    ? '🎯 正確！這確實是合理推論'
                                    : `🎯 正確！這是 ${current.errorType}`)
                                : (current.isValid
                                    ? '❌ 判斷錯誤！這其實是合理推論'
                                    : `❌ 判斷錯誤！這是 ${current.errorType}`)}
                        </h3>
                        <p className="text-slate-700 text-lg font-medium leading-relaxed mb-4">
                            {current.explanation}
                        </p>
                        <div className="text-right">
                            <button
                                onClick={nextCase}
                                className="bg-indigo-500 hover:bg-indigo-600 text-white font-black py-3 px-10 rounded-full text-xl transition transform hover:scale-105 shadow-lg"
                            >
                                {currentIdx < caseData.length - 1 ? '下一筆數據 ➡️' : '查看調查報告 📋'}
                            </button>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};
