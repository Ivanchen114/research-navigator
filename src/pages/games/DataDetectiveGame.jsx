import React, { useState, useEffect } from 'react';

// ========== 淡色系圖表元件 ==========

const BarChart = ({ data, unit = '', color = '#6366f1', axisX, axisY }) => {
    const max = Math.max(...data.map(d => d.value));
    const ceil = Math.ceil(max / 10) * 10;
    const ticks = [0, Math.round(ceil * 0.25), Math.round(ceil * 0.5), Math.round(ceil * 0.75), ceil];
    return (
        <div className="flex gap-2 relative">
            <div className="flex flex-col justify-between items-end py-1 shrink-0 w-10">
                {[...ticks].reverse().map((t, i) => (
                    <span key={i} className="text-[10px] text-slate-400 font-mono leading-none">{t}{unit}</span>
                ))}
            </div>
            <div className="flex-1">
                <div className="relative border-l-2 border-b-2 border-slate-300 flex items-stretch gap-3 px-3" style={{ height: '160px' }}>
                    {ticks.slice(1).map((t, i) => (
                        <div key={i} className="absolute left-0 right-0 border-t border-dashed border-slate-200"
                            style={{ bottom: `${(t / ceil) * 100}%` }} />
                    ))}
                    {data.map((d, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center justify-end relative z-10">
                            <span className="text-xs font-bold mb-1 whitespace-nowrap" style={{ color }}>{d.value}{unit}</span>
                            <div className="w-full max-w-16 rounded-t-lg transition-all duration-700"
                                style={{ height: `${(d.value / ceil) * 100}%`, backgroundColor: color, opacity: 0.85 }} />
                        </div>
                    ))}
                </div>
                <div className="flex gap-3 px-3 mt-1">
                    {data.map((d, i) => (
                        <div key={i} className="flex-1 text-center">
                            <span className="text-[10px] text-slate-500 font-medium leading-tight block">{d.label}</span>
                        </div>
                    ))}
                </div>
                {axisX && <div className="text-center mt-0.5"><span className="text-[10px] text-slate-400 italic">{axisX}</span></div>}
            </div>
            {axisY && <div className="absolute -left-1 top-1/2 -translate-y-1/2 -rotate-90 origin-center"><span className="text-[10px] text-slate-400 italic whitespace-nowrap">{axisY}</span></div>}
        </div>
    );
};

const PieChart = ({ data }) => {
    const total = data.reduce((s, d) => s + d.value, 0);
    let cumulative = 0;
    const colors = ['#6366f1', '#f43f5e', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];
    const segments = data.map((d, i) => {
        const start = cumulative;
        cumulative += (d.value / total) * 360;
        return { ...d, start, end: cumulative, color: colors[i % colors.length] };
    });
    const gradientStr = segments.map(s => `${s.color} ${s.start}deg ${s.end}deg`).join(', ');
    return (
        <div className="flex items-center gap-6 justify-center">
            <div className="w-32 h-32 rounded-full shrink-0 shadow-md" style={{ background: `conic-gradient(${gradientStr})` }} />
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

const LineChart = ({ data, unit = '', color = '#6366f1', axisX, axisY }) => {
    const values = data.map(d => d.value);
    const max = Math.max(...values), min = Math.min(...values);
    const padding = (max - min) * 0.15 || 1;
    const yMin = Math.floor(min - padding), yMax = Math.ceil(max + padding);
    const yRange = yMax - yMin || 1;
    const svgW = 400, svgH = 170, padL = 45, padR = 15, padT = 20, padB = 30;
    const chartW = svgW - padL - padR, chartH = svgH - padT - padB;
    const points = data.map((d, i) => ({
        x: padL + (i / (data.length - 1)) * chartW,
        y: padT + chartH - ((d.value - yMin) / yRange) * chartH
    }));
    const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
    const yTicks = Array.from({ length: 5 }, (_, i) => yMin + (yRange / 4) * i);
    return (
        <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full" style={{ maxHeight: '200px' }}>
            {yTicks.map((tick, i) => {
                const y = padT + chartH - ((tick - yMin) / yRange) * chartH;
                return (<g key={i}>
                    <line x1={padL} y1={y} x2={svgW - padR} y2={y} stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4,3" />
                    <text x={padL - 6} y={y + 3} textAnchor="end" fontSize="9" fill="#94a3b8" fontFamily="monospace">
                        {Number.isInteger(tick) ? tick : tick.toFixed(1)}{unit}
                    </text>
                </g>);
            })}
            <line x1={padL} y1={padT} x2={padL} y2={padT + chartH} stroke="#94a3b8" strokeWidth="1.5" />
            <line x1={padL} y1={padT + chartH} x2={svgW - padR} y2={padT + chartH} stroke="#94a3b8" strokeWidth="1.5" />
            <path d={`${pathD} L ${points[points.length - 1].x} ${padT + chartH} L ${points[0].x} ${padT + chartH} Z`} fill={color} opacity="0.08" />
            <path d={pathD} fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" />
            {points.map((p, i) => (
                <g key={i}>
                    <circle cx={p.x} cy={p.y} r="4" fill="white" stroke={color} strokeWidth="2.5" />
                    <text x={p.x} y={p.y - 9} textAnchor="middle" fontSize="9" fill={color} fontWeight="bold">{data[i].value}{unit}</text>
                    <text x={p.x} y={padT + chartH + 15} textAnchor="middle" fontSize="9" fill="#64748b">{data[i].label}</text>
                </g>
            ))}
            {axisX && <text x={padL + chartW / 2} y={svgH - 2} textAnchor="middle" fontSize="9" fill="#94a3b8" fontStyle="italic">{axisX}</text>}
            {axisY && <text x={8} y={padT + chartH / 2} textAnchor="middle" fontSize="9" fill="#94a3b8" fontStyle="italic" transform={`rotate(-90, 8, ${padT + chartH / 2})`}>{axisY}</text>}
        </svg>
    );
};

// ========== 題目資料庫（三層結構）==========
// layers: [{ type, icon, label, parts: [{text, suspect?, isError?}] }]
const caseData = [
    {
        id: 1,
        title: "社團參與與學業成績",
        chartType: "bar",
        chartData: [{ label: "有參加社團", value: 82 }, { label: "沒參加社團", value: 78 }],
        chartUnit: "分", chartColor: "#6366f1", chartAxisX: "社團參與", chartAxisY: "平均成績(分)",
        dataSource: "某高中 200 名學生段考平均",
        isValid: false,
        errorLayer: "interpretive",
        errorType: "因果謬誤",
        layers: [
            {
                type: "descriptive", icon: "📊", label: "描述", parts: [
                    { text: "有參加社團的學生平均成績 82 分，未參加的平均 78 分，差距 4 分。" }
                ]
            },
            {
                type: "interpretive", icon: "🧠", label: "詮釋", parts: [
                    { text: "加入社團" },
                    { text: "可以提升", suspect: true, isError: true },
                    { text: "學業成績。" }
                ]
            },
            {
                type: "critical", icon: "🔍", label: "批判", parts: [
                    { text: "本調查僅為單校橫斷面數據，未控制其他變項影響。" }
                ]
            }
        ],
        explanation: "「可以提升」暗示因果關係，但數據只能顯示相關性。可能是成績好的學生更有餘力參加社團（混淆變項）。\n\n✅ 正確詮釋：有參加社團的學生成績「較高」。",
        tags: ["相關≠因果", "混淆變項"]
    },
    {
        id: 2,
        title: "早餐與遲到率",
        chartType: "bar",
        chartData: [{ label: "每天吃早餐", value: 5 }, { label: "偶爾吃", value: 12 }, { label: "不吃早餐", value: 23 }],
        chartUnit: "%", chartColor: "#f43f5e", chartAxisX: "早餐習慣", chartAxisY: "遲到率(%)",
        dataSource: "學校一學期遲到紀錄 (n=450)",
        isValid: true,
        errorLayer: null,
        errorType: null,
        layers: [
            {
                type: "descriptive", icon: "📊", label: "描述", parts: [
                    { text: "每天吃早餐的學生遲到率 5%，偶爾吃 12%，不吃 23%。" }
                ]
            },
            {
                type: "interpretive", icon: "🧠", label: "詮釋", parts: [
                    { text: "不吃早餐的學生" },
                    { text: "更容易", suspect: true },
                    { text: "遲到。" }
                ]
            },
            {
                type: "critical", icon: "🔍", label: "批判", parts: [
                    { text: "此為單校一學期紀錄，" },
                    { text: "可能受通勤距離等因素影響", suspect: true },
                    { text: "。" }
                ]
            }
        ],
        explanation: "三層都寫得很好！📊 描述客觀忠實；🧠 用「更容易」而非「導致」，精準表達相關性；🔍 點出了可能的限制。👍",
        tags: ["用詞精準", "正確描述相關"]
    },
    {
        id: 3,
        title: "補習時數與學業滿意度",
        chartType: "line",
        chartData: [{ label: "0hr", value: 72 }, { label: "2hr", value: 76 }, { label: "4hr", value: 79 }, { label: "6hr", value: 75 }, { label: "8hr", value: 68 }, { label: "10hr", value: 60 }],
        chartUnit: "", chartColor: "#f59e0b", chartAxisX: "每週補習時數", chartAxisY: "學業滿意度",
        dataSource: "問卷調查 (n=180)",
        isValid: false,
        errorLayer: "descriptive",
        errorType: "選擇性描述",
        layers: [
            {
                type: "descriptive", icon: "📊", label: "描述", parts: [
                    { text: "補習時數越多，學業滿意度" },
                    { text: "持續下降", suspect: true, isError: true },
                    { text: "。" }
                ]
            },
            {
                type: "interpretive", icon: "🧠", label: "詮釋", parts: [
                    { text: "過度補習會降低學習動機。" }
                ]
            },
            {
                type: "critical", icon: "🔍", label: "批判", parts: [
                    { text: "此為自評問卷，受主觀感受影響。" }
                ]
            }
        ],
        explanation: "看看折線圖！0→4 小時滿意度是「上升」的，4 小時之後才下降。「持續下降」是選擇性描述，忽略了前半段的上升。\n\n✅ 正確描述：滿意度呈倒 U 型，4 小時左右達到高峰後下降。",
        tags: ["選擇性描述", "忽略趨勢"]
    },
    {
        id: 4,
        title: "班級閱讀課成效",
        chartType: "bar",
        chartData: [{ label: "實施前(9月)", value: 45 }, { label: "實施後(12月)", value: 62 }],
        chartUnit: "分", chartColor: "#10b981", chartAxisX: "時間點", chartAxisY: "閱讀理解(分)",
        dataSource: "某班閱讀理解測驗平均分 (n=35)",
        isValid: false,
        errorLayer: "interpretive",
        errorType: "缺乏對照組",
        layers: [
            {
                type: "descriptive", icon: "📊", label: "描述", parts: [
                    { text: "閱讀理解測驗平均分從 9 月的 45 分上升至 12 月的 62 分，提升 17 分。" }
                ]
            },
            {
                type: "interpretive", icon: "🧠", label: "詮釋", parts: [
                    { text: "閱讀課" },
                    { text: "有效提升了", suspect: true, isError: true },
                    { text: "學生的閱讀理解能力。" }
                ]
            },
            {
                type: "critical", icon: "🔍", label: "批判", parts: [
                    { text: "前後測間隔三個月，測驗題型相同。" }
                ]
            }
        ],
        explanation: "「有效提升了」斷言因果，但沒有對照組！進步可能來自：自然成長、練習效應、其他課程幫助。批判層也太弱——沒指出「缺乏對照組」這個致命缺陷。\n\n✅ 正確詮釋：該班的閱讀測驗分數在課程實施後「有所提升」。",
        tags: ["缺乏對照組", "成熟效應"]
    },
    {
        id: 5,
        title: "學生壓力來源分佈",
        chartType: "pie",
        chartData: [{ label: "課業考試", value: 45 }, { label: "人際關係", value: 20 }, { label: "家庭期望", value: 18 }, { label: "未來升學", value: 12 }, { label: "其他", value: 5 }],
        dataSource: "校園壓力量表問卷 (n=300)",
        isValid: true,
        errorLayer: null,
        errorType: null,
        layers: [
            {
                type: "descriptive", icon: "📊", label: "描述", parts: [
                    { text: "課業考試佔 45%，人際關係 20%，家庭期望 18%，未來升學 12%，其他 5%。" }
                ]
            },
            {
                type: "interpretive", icon: "🧠", label: "詮釋", parts: [
                    { text: "近半數", suspect: true },
                    { text: "學生表示課業考試是其主要壓力來源。" }
                ]
            },
            {
                type: "critical", icon: "🔍", label: "批判", parts: [
                    { text: "此為單校問卷，不同學校壓力結構可能不同。" }
                ]
            }
        ],
        explanation: "三層都很標準！📊 忠實列出數據；🧠 「近半數」精確對應 45%，用「主要」而非「唯一」；🔍 指出了推廣限制。👍",
        tags: ["精準描述", "數據忠實"]
    },
    {
        id: 6,
        title: "手機使用與睡眠時間",
        chartType: "line",
        chartData: [{ label: "1hr", value: 7.8 }, { label: "2hr", value: 7.2 }, { label: "3hr", value: 6.9 }, { label: "4hr", value: 6.3 }, { label: "5hr+", value: 5.8 }],
        chartUnit: "hr", chartColor: "#8b5cf6", chartAxisX: "每日手機使用", chartAxisY: "睡眠時間(hr)",
        dataSource: "自我報告問卷 (n=220)",
        isValid: false,
        errorLayer: "interpretive",
        errorType: "因果謬誤 + 過度概括",
        layers: [
            {
                type: "descriptive", icon: "📊", label: "描述", parts: [
                    { text: "手機使用 1 小時的學生平均睡 7.8hr，5 小時以上的平均睡 5.8hr。" }
                ]
            },
            {
                type: "interpretive", icon: "🧠", label: "詮釋", parts: [
                    { text: "使用手機會" },
                    { text: "導致", suspect: true, isError: true },
                    { text: "失眠", suspect: true, isError: true },
                    { text: "。" }
                ]
            },
            {
                type: "critical", icon: "🔍", label: "批判", parts: [
                    { text: "此為自我報告數據，可能有回憶偏誤。" }
                ]
            }
        ],
        explanation: "兩個問題！(1)「導致」暗示因果，但這只是問卷相關數據；(2)「失眠」是醫學概念，5.8 小時不等於失眠。\n\n✅ 正確詮釋：手機使用時間越長，學生自報的睡眠時間「越短」。",
        tags: ["因果謬誤", "過度概括"]
    },
    {
        id: 7,
        title: "三校合作社滿意度",
        chartType: "bar",
        chartData: [{ label: "A 校", value: 3.2 }, { label: "B 校", value: 3.8 }, { label: "C 校", value: 4.1 }],
        chartUnit: "/5", chartColor: "#ec4899", chartAxisX: "學校", chartAxisY: "滿意度(1-5)",
        dataSource: "合作社滿意度問卷 (A校n=50, B校n=200, C校n=180)",
        isValid: false,
        errorLayer: "interpretive",
        errorType: "概念偷換 + 忽略樣本",
        layers: [
            {
                type: "descriptive", icon: "📊", label: "描述", parts: [
                    { text: "A 校滿意度 3.2，B 校 3.8，C 校 4.1（滿分 5）。" }
                ]
            },
            {
                type: "interpretive", icon: "🧠", label: "詮釋", parts: [
                    { text: "C 校合作社的" },
                    { text: "服務品質", suspect: true, isError: true },
                    { text: "顯然", suspect: true, isError: true },
                    { text: "是三校中最好的。" }
                ]
            },
            {
                type: "critical", icon: "🔍", label: "批判", parts: [
                    { text: "三校樣本大小不同（A 校僅 50 人），需注意代表性。" }
                ]
            }
        ],
        explanation: "「服務品質」≠「滿意度」——這是概念偷換！「顯然」也太武斷，A 校只有 50 人的小樣本，分數可能不穩定，差異可能無統計顯著性。\n\n✅ 正確詮釋：C 校學生的滿意度評分「最高」。",
        tags: ["概念偷換", "樣本大小"]
    },
    {
        id: 8,
        title: "運動頻率與焦慮量表",
        chartType: "bar",
        chartData: [{ label: "每週0次", value: 28 }, { label: "每週1-2次", value: 22 }, { label: "每週3-4次", value: 17 }, { label: "每週5+次", value: 14 }],
        chartUnit: "分", chartColor: "#10b981", chartAxisX: "運動頻率", chartAxisY: "焦慮分數(分)",
        dataSource: "焦慮自評量表 (BAI) 平均分 (n=250)",
        isValid: true,
        errorLayer: null,
        errorType: null,
        layers: [
            {
                type: "descriptive", icon: "📊", label: "描述", parts: [
                    { text: "每週運動 0 次的學生焦慮均分 28，5+ 次的均分 14，呈遞減趨勢。" }
                ]
            },
            {
                type: "interpretive", icon: "🧠", label: "詮釋", parts: [
                    { text: "運動頻率越高的學生，焦慮自評分數" },
                    { text: "有越低的趨勢", suspect: true },
                    { text: "。" }
                ]
            },
            {
                type: "critical", icon: "🔍", label: "批判", parts: [
                    { text: "此為橫斷面調查，" },
                    { text: "無法推論運動是否為降低焦慮的原因", suspect: true },
                    { text: "。" }
                ]
            }
        ],
        explanation: "三層都精準！📊 忠實描述數據趨勢；🧠 用「有越低的趨勢」精確表達相關方向，避免因果宣稱；🔍 主動指出無法推論因果。教科書級別的寫法！👍",
        tags: ["精準用詞", "避免因果"]
    },
    {
        id: 9,
        title: "性別與數學成績",
        chartType: "bar",
        chartData: [{ label: "男生", value: 74 }, { label: "女生", value: 71 }],
        chartUnit: "分", chartColor: "#f59e0b", chartAxisX: "性別", chartAxisY: "數學成績(分)",
        dataSource: "某校高二段考數學成績 (n=320)",
        isValid: false,
        errorLayer: "interpretive",
        errorType: "過度概括",
        layers: [
            {
                type: "descriptive", icon: "📊", label: "描述", parts: [
                    { text: "該校高二男生段考數學平均 74 分，女生平均 71 分，差距 3 分。" }
                ]
            },
            {
                type: "interpretive", icon: "🧠", label: "詮釋", parts: [
                    { text: "男生的" },
                    { text: "數學能力", suspect: true, isError: true },
                    { text: "比女生" },
                    { text: "強", suspect: true },
                    { text: "。" }
                ]
            },
            {
                type: "critical", icon: "🔍", label: "批判", parts: [
                    { text: "僅一次段考無法代表整體能力，3 分差距需統計檢定。" }
                ]
            }
        ],
        explanation: "一次段考 ≠「數學能力」！而且「某校」不能推論到所有人，3 分差距可能無統計顯著性。\n\n✅ 正確詮釋：本次段考中，該校男生平均分「略高於」女生。",
        tags: ["以偏概全", "過度概括"]
    },
    {
        id: 10,
        title: "🔥 綜合魔王：線上學習成效",
        chartType: "line",
        chartData: [{ label: "W1", value: 65 }, { label: "W2", value: 68 }, { label: "W3", value: 72 }, { label: "W4", value: 70 }, { label: "W5", value: 75 }, { label: "W6", value: 78 }],
        chartUnit: "分", chartColor: "#6366f1", chartAxisX: "週次", chartAxisY: "週測平均(分)",
        dataSource: "某班線上學習平台週測平均 (n=38)",
        isValid: false,
        errorLayer: "interpretive",
        errorType: "多重謬誤",
        layers: [
            {
                type: "descriptive", icon: "📊", label: "描述", parts: [
                    { text: "六週的週測平均分從 65 分波動上升至 78 分（W4 回落至 70 分）。" }
                ]
            },
            {
                type: "interpretive", icon: "🧠", label: "詮釋", parts: [
                    { text: "數據" },
                    { text: "證明", suspect: true, isError: true },
                    { text: "線上學習平台的教學效果" },
                    { text: "持續穩定", suspect: true, isError: true },
                    { text: "進步。" }
                ]
            },
            {
                type: "critical", icon: "🔍", label: "批判", parts: [
                    { text: "僅一班數據，缺乏對照組，無法排除練習效應。" }
                ]
            }
        ],
        explanation: "至少三個問題！(1)「證明」太武斷——觀察性數據不能「證明」；(2)「持續穩定」忽略 W4 的下降；(3) 沒有對照組。\n\n✅ 正確詮釋：該班六週內的週測平均分呈「波動上升」趨勢。",
        tags: ["用詞過強", "選擇性解讀", "缺乏對照"]
    },
    {
        id: 11,
        title: "通勤方式與遲到率",
        chartType: "bar",
        chartData: [{ label: "公車", value: 15 }, { label: "腳踏車", value: 12 }, { label: "家長接送", value: 10 }, { label: "步行", value: 14 }],
        chartUnit: "%", chartColor: "#0ea5e9", chartAxisX: "通勤方式", chartAxisY: "遲到率(%)",
        dataSource: "學校遲到紀錄 (n=380)",
        isValid: false,
        errorLayer: "descriptive",
        errorType: "誇大差距",
        layers: [
            {
                type: "descriptive", icon: "📊", label: "描述", parts: [
                    { text: "搭公車遲到率 15%，腳踏車 12%，家長接送 10%，步行 14%，各組" },
                    { text: "差距懸殊", suspect: true, isError: true },
                    { text: "。" }
                ]
            },
            {
                type: "interpretive", icon: "🧠", label: "詮釋", parts: [
                    { text: "不同通勤方式的遲到率略有差異。" }
                ]
            },
            {
                type: "critical", icon: "🔍", label: "批判", parts: [
                    { text: "可能受通勤距離、天氣、個人習慣等因素干擾。" }
                ]
            }
        ],
        explanation: "四組遲到率介於 10%–15%，最大差距僅 5 個百分點，用「差距懸殊」明顯誇大了數據差異。\n\n✅ 正確描述：各通勤方式遲到率介於 10%-15%，差異不大。",
        tags: ["誇大差距", "形容詞失準"]
    },
    {
        id: 12,
        title: "午餐選擇偏好",
        chartType: "pie",
        chartData: [{ label: "自帶便當", value: 38 }, { label: "學校營養午餐", value: 32 }, { label: "外出購買", value: 20 }, { label: "不吃午餐", value: 10 }],
        dataSource: "午餐習慣問卷 (n=420)",
        isValid: false,
        errorLayer: "descriptive",
        errorType: "量詞不精準",
        layers: [
            {
                type: "descriptive", icon: "📊", label: "描述", parts: [
                    { text: "" },
                    { text: "絕大多數", suspect: true, isError: true },
                    { text: "學生偏好自帶便當，其次為營養午餐與外出購買。" }
                ]
            },
            {
                type: "interpretive", icon: "🧠", label: "詮釋", parts: [
                    { text: "自帶便當是最受歡迎的午餐選擇。" }
                ]
            },
            {
                type: "critical", icon: "🔍", label: "批判", parts: [
                    { text: "僅調查一校，結果" },
                    { text: "可能受校內餐廳品質影響", suspect: true },
                    { text: "。" }
                ]
            }
        ],
        explanation: "自帶便當佔 38%，不到四成，用「絕大多數」嚴重失準。「絕大多數」通常指 80% 以上。\n\n✅ 正確描述：自帶便當佔比最高（38%），約四成學生選擇。",
        tags: ["量詞不精準", "誇大比例"]
    },
    {
        id: 13,
        title: "各班週考成績分佈",
        chartType: "bar",
        chartData: [{ label: "A班", value: 88 }, { label: "B班", value: 62 }, { label: "C班", value: 75 }, { label: "D班", value: 59 }, { label: "E班", value: 70 }],
        chartUnit: "分", chartColor: "#8b5cf6", chartAxisX: "班級", chartAxisY: "週考平均(分)",
        dataSource: "五班週考成績平均 (n=175)",
        isValid: false,
        errorLayer: "descriptive",
        errorType: "忽略重要數據",
        layers: [
            {
                type: "descriptive", icon: "📊", label: "描述", parts: [
                    { text: "A 班最高（88 分），D 班最低（59 分），" },
                    { text: "兩班差距 29 分", suspect: true, isError: true },
                    { text: "。" }
                ]
            },
            {
                type: "interpretive", icon: "🧠", label: "詮釋", parts: [
                    { text: "各班成績" },
                    { text: "差異明顯", suspect: true },
                    { text: "。" }
                ]
            },
            {
                type: "critical", icon: "🔍", label: "批判", parts: [
                    { text: "週考僅一次，且各班授課教師不同，需謹慎比較。" }
                ]
            }
        ],
        explanation: "描述只提了最高和最低，完全忽略了 B、C、E 三班（佔 60% 的數據）！其中 C 班 75 分、E 班 70 分都在中間範圍。只看極端值會扭曲整體印象。\n\n✅ 正確描述：五班平均分介於 59-88 分，其中三班落在 62-75 分區間。",
        tags: ["忽略中間值", "只看極端"]
    },
    {
        id: 14,
        title: "學生研究滿意度追蹤",
        chartType: "line",
        chartData: [{ label: "W1", value: 3.2 }, { label: "W2", value: 4.1 }, { label: "W3", value: 2.8 }, { label: "W4", value: 4.5 }, { label: "W5", value: 3.0 }, { label: "W6", value: 4.8 }],
        chartUnit: "", chartColor: "#ec4899", chartAxisX: "週次", chartAxisY: "滿意度(1-5)",
        dataSource: "每週滿意度問卷 (n=35)",
        isValid: false,
        errorLayer: "descriptive",
        errorType: "錯誤趨勢歸納",
        layers: [
            {
                type: "descriptive", icon: "📊", label: "描述", parts: [
                    { text: "六週滿意度從 3.2 升至 4.8，呈" },
                    { text: "穩定上升", suspect: true, isError: true },
                    { text: "趨勢。" }
                ]
            },
            {
                type: "interpretive", icon: "🧠", label: "詮釋", parts: [
                    { text: "學生對研究課程的滿意度逐漸提高。" }
                ]
            },
            {
                type: "critical", icon: "🔍", label: "批判", parts: [
                    { text: "每週填答，可能有" },
                    { text: "疲勞效應", suspect: true },
                    { text: "影響作答品質。" }
                ]
            }
        ],
        explanation: "看看折線圖！W2→W3 下降 1.3 分、W4→W5 下降 1.5 分，波動幅度超過 1 分，根本不是「穩定上升」。這是典型的只看頭尾、忽略中間波動。\n\n✅ 正確描述：六週滿意度在 2.8-4.8 之間「大幅波動」，整體有上升趨勢但不穩定。",
        tags: ["錯誤趨勢歸納", "忽略波動"]
    }
];

// ========== 偵探風格 CSS ==========
const injectStyles = () => {
    const id = 'detective-styles-v3';
    if (document.getElementById(id)) return;
    const style = document.createElement('style');
    style.id = id;
    style.textContent = `
        @keyframes detective-pop {
            0% { transform: scale(0.85); opacity: 0; }
            50% { transform: scale(1.08); }
            100% { transform: scale(1); opacity: 1; }
        }
        @keyframes detective-shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
            20%, 40%, 60%, 80% { transform: translateX(4px); }
        }
        @keyframes star-lose {
            0% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.5) rotate(30deg); opacity: 0.5; }
            100% { transform: scale(0) rotate(60deg); opacity: 0; }
        }
        @keyframes stamp-in {
            0% { transform: scale(4) rotate(-25deg); opacity: 0; }
            50% { transform: scale(0.85) rotate(3deg); opacity: 1; }
            70% { transform: scale(1.1) rotate(-2deg); }
            100% { transform: scale(1) rotate(-5deg); opacity: 0.85; }
        }
        @keyframes tape-slide {
            0% { transform: translateX(-100%) rotate(-2deg); }
            100% { transform: translateX(0) rotate(-2deg); }
        }
        @keyframes pin-bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-3px); }
        }
        /* Cork board background */
        .detective-corkboard {
            background-color: #f5e6c8;
            background-image: 
                radial-gradient(ellipse at 20% 50%, rgba(210,180,140,0.3) 0%, transparent 50%),
                radial-gradient(ellipse at 80% 20%, rgba(200,170,120,0.2) 0%, transparent 40%),
                radial-gradient(circle at 50% 80%, rgba(220,190,150,0.15) 0%, transparent 30%);
            position: relative;
        }
        /* Fingerprint watermark */
        .detective-fingerprint::before {
            content: '';
            position: absolute;
            width: 120px;
            height: 150px;
            bottom: 20px;
            right: 25px;
            opacity: 0.04;
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 120'%3E%3Cellipse cx='50' cy='60' rx='35' ry='45' fill='none' stroke='%23000' stroke-width='2'/%3E%3Cellipse cx='50' cy='60' rx='28' ry='38' fill='none' stroke='%23000' stroke-width='1.5'/%3E%3Cellipse cx='50' cy='60' rx='21' ry='31' fill='none' stroke='%23000' stroke-width='1.5'/%3E%3Cellipse cx='50' cy='60' rx='14' ry='24' fill='none' stroke='%23000' stroke-width='1.5'/%3E%3Cellipse cx='50' cy='60' rx='7' ry='17' fill='none' stroke='%23000' stroke-width='1.5'/%3E%3Cellipse cx='50' cy='60' rx='2' ry='10' fill='none' stroke='%23000' stroke-width='1.5'/%3E%3C/svg%3E");
            background-size: contain;
            background-repeat: no-repeat;
            pointer-events: none;
            z-index: 0;
        }
        /* Coffee stain ring */
        .detective-coffee::after {
            content: '';
            position: absolute;
            width: 70px;
            height: 70px;
            top: 15px;
            right: 60px;
            opacity: 0.06;
            border-radius: 50%;
            border: 4px solid #8B4513;
            box-shadow: inset 0 0 8px rgba(139,69,19,0.3);
            pointer-events: none;
            z-index: 0;
        }
        .detective-suspect {
            cursor: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'><text y='24' font-size='24'>🔍</text></svg>") 4 4, pointer;
            border-bottom: 2px dashed #b0956e;
            padding-bottom: 1px;
            transition: all 0.2s;
            border-radius: 2px;
            position: relative;
        }
        .detective-suspect:hover {
            background: rgba(220, 50, 50, 0.08);
            border-bottom-color: #dc2626;
            box-shadow: 0 2px 8px rgba(220, 50, 50, 0.1);
        }
        .detective-suspect.clicked-wrong {
            background: rgba(248, 113, 113, 0.12);
            border-bottom-color: #f87171;
            text-decoration: line-through;
            opacity: 0.4;
        }
        .detective-suspect.clicked-right {
            background: rgba(220, 50, 50, 0.12);
            border-bottom: 3px solid #dc2626;
            font-weight: 800;
        }
        /* Evidence cards with push pin */
        .evidence-card {
            position: relative;
            border-left: 4px solid;
            padding: 14px 16px 14px 42px;
            border-radius: 6px;
            margin-bottom: 10px;
            transition: all 0.2s;
            box-shadow: 1px 2px 4px rgba(0,0,0,0.06);
        }
        .evidence-card::before {
            content: '📌';
            position: absolute;
            top: -6px;
            left: 10px;
            font-size: 18px;
            filter: drop-shadow(1px 1px 1px rgba(0,0,0,0.2));
            z-index: 2;
        }
        .evidence-card.layer-descriptive { border-left-color: #6366f1; background: linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%); }
        .evidence-card.layer-interpretive { border-left-color: #f59e0b; background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%); }
        .evidence-card.layer-critical { border-left-color: #10b981; background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%); }
        /* Red string connecting evidence */
        .evidence-card:not(:last-child)::after {
            content: '';
            position: absolute;
            left: 18px;
            bottom: -12px;
            width: 2px;
            height: 12px;
            background: repeating-linear-gradient(to bottom, #dc2626 0px, #dc2626 3px, transparent 3px, transparent 6px);
            z-index: 1;
        }
        /* Case Closed stamp */
        .case-closed-stamp {
            display: inline-block;
            border: 4px solid #dc2626;
            border-radius: 8px;
            color: #dc2626;
            font-weight: 900;
            font-size: 1.1rem;
            padding: 6px 18px;
            letter-spacing: 4px;
            transform: rotate(-5deg);
            opacity: 0.85;
            animation: stamp-in 0.6s ease-out;
            text-transform: uppercase;
            font-family: 'Courier New', monospace;
        }
        /* Caution tape */
        .caution-tape {
            background: repeating-linear-gradient(
                -45deg,
                #fbbf24 0px, #fbbf24 10px,
                #1a1a1a 10px, #1a1a1a 12px,
                #fbbf24 12px, #fbbf24 22px,
                #1a1a1a 22px, #1a1a1a 24px
            );
            height: 6px;
            border-radius: 3px;
            opacity: 0.7;
        }
        /* Exhibit tag */
        .exhibit-tag {
            display: inline-block;
            background: #fef3c7;
            border: 1px solid #d97706;
            color: #92400e;
            font-size: 9px;
            font-weight: 900;
            font-family: 'Courier New', monospace;
            letter-spacing: 2px;
            padding: 1px 6px;
            border-radius: 3px;
            margin-left: 6px;
            transform: rotate(-1deg);
        }
        /* Manila folder tab */
        .manila-tab {
            position: absolute;
            top: -14px;
            left: 20px;
            background: linear-gradient(to bottom, #e8d5a8, #dcc89a);
            border: 1px solid #c9a96e;
            border-bottom: none;
            border-radius: 6px 6px 0 0;
            padding: 2px 14px;
            font-size: 10px;
            font-weight: 800;
            color: #8b6914;
            font-family: 'Courier New', monospace;
            letter-spacing: 1px;
        }
    `;
    document.head.appendChild(style);
};

// ========== 遊戲主元件 ==========
export const DataDetectiveGame = () => {
    const [gameState, setGameState] = useState('start');
    const [playerName, setPlayerName] = useState('');
    const [shuffledCases, setShuffledCases] = useState([]);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [score, setScore] = useState(0);
    const [stars, setStars] = useState(3);
    const [phase, setPhase] = useState('select-layer'); // 'select-layer' | 'find-word'
    const [selectedLayer, setSelectedLayer] = useState(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [wrongCases, setWrongCases] = useState([]);
    const [clickedParts, setClickedParts] = useState([]);
    const [feedbackMsg, setFeedbackMsg] = useState(null);
    const [shakeCard, setShakeCard] = useState(false);
    const [wrongLayers, setWrongLayers] = useState([]); // track wrong layer attempts

    useEffect(() => { injectStyles(); }, []);

    // Fisher-Yates shuffle
    const shuffle = (arr) => {
        const a = [...arr];
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    };

    const startGame = () => {
        setShuffledCases(shuffle(caseData));
        setCurrentIdx(0); setScore(0); setStars(3);
        setPhase('select-layer'); setSelectedLayer(null);
        setIsAnswered(false); setWrongCases([]);
        setClickedParts([]); setFeedbackMsg(null);
        setShakeCard(false); setWrongLayers([]);
        setGameState('playing');
    };

    const current = shuffledCases[currentIdx];

    // Phase 1: Layer selection
    const handleLayerSelect = (layerType) => {
        if (isAnswered) return;
        const c = current;

        if (layerType === 'none') {
            // Player thinks all layers are correct
            if (c.isValid) {
                setIsAnswered(true);
                setScore(s => s + stars);
                setFeedbackMsg({ type: 'right', text: '✅ 正確！三層分析都沒有問題，寫得很嚴謹！' });
            } else {
                setStars(s => Math.max(0, s - 1));
                setShakeCard(true);
                setTimeout(() => setShakeCard(false), 500);
                setWrongLayers(prev => [...prev, 'none']);
                setFeedbackMsg({ type: 'wrong', text: '❌ 不對！這份報告其實有問題，再看看是哪一層...' });
                if (stars <= 1) {
                    setIsAnswered(true);
                    setWrongCases(prev => [...prev, c]);
                    setFeedbackMsg({ type: 'miss', text: '⭐ 星星用完了！來看看問題在哪...' });
                }
            }
            return;
        }

        // Player selected a specific layer
        if (c.isValid) {
            // All layers are fine, selecting any = wrong
            setStars(s => Math.max(0, s - 1));
            setShakeCard(true);
            setTimeout(() => setShakeCard(false), 500);
            setWrongLayers(prev => [...prev, layerType]);
            setFeedbackMsg({ type: 'wrong', text: `💨 「${layerType === 'descriptive' ? '描述' : layerType === 'interpretive' ? '詮釋' : '批判'}」層沒有問題喔！再想想...` });
            if (stars <= 1) {
                setIsAnswered(true);
                setWrongCases(prev => [...prev, c]);
                setFeedbackMsg({ type: 'miss', text: '⭐ 星星用完了！來看看問題在哪...' });
            }
        } else if (layerType === c.errorLayer) {
            // Correct layer! Move to phase 2
            setSelectedLayer(layerType);
            setPhase('find-word');
            setFeedbackMsg({ type: 'layer-right', text: `🎯 沒錯！「${layerType === 'descriptive' ? '描述' : layerType === 'interpretive' ? '詮釋' : '批判'}」層有問題！現在找出有問題的關鍵字！` });
        } else {
            // Wrong layer
            setStars(s => Math.max(0, s - 1));
            setShakeCard(true);
            setTimeout(() => setShakeCard(false), 500);
            setWrongLayers(prev => [...prev, layerType]);
            setFeedbackMsg({ type: 'wrong', text: `💨 「${layerType === 'descriptive' ? '描述' : layerType === 'interpretive' ? '詮釋' : '批判'}」層沒問題，問題在其他層！` });
            if (stars <= 1) {
                setIsAnswered(true);
                setWrongCases(prev => [...prev, c]);
                setFeedbackMsg({ type: 'miss', text: '⭐ 星星用完了！來看看問題在哪...' });
            }
        }
    };

    // Phase 2: Find the error word within the selected layer
    const handleSuspectClick = (layerIdx, partIdx) => {
        const key = `${layerIdx}-${partIdx}`;
        if (isAnswered || clickedParts.includes(key)) return;
        const part = current.layers[layerIdx].parts[partIdx];

        if (part.isError) {
            setClickedParts([...clickedParts, key]);
            setIsAnswered(true);
            setScore(s => s + stars);
            setFeedbackMsg({ type: 'right', text: `🎯 破案！找到了「${part.text}」` });
        } else {
            setClickedParts([...clickedParts, key]);
            setStars(s => Math.max(0, s - 1));
            setShakeCard(true);
            setTimeout(() => setShakeCard(false), 500);
            setFeedbackMsg({ type: 'wrong', text: `💨 「${part.text}」不是問題所在，再看看！` });
            if (stars <= 1) {
                setIsAnswered(true);
                setWrongCases(prev => [...prev, current]);
                setFeedbackMsg({ type: 'miss', text: '⭐ 星星用完了！來看看問題在哪...' });
            }
        }
    };

    const nextCase = () => {
        if (currentIdx < shuffledCases.length - 1) {
            setCurrentIdx(i => i + 1);
            setStars(3); setIsAnswered(false);
            setPhase('select-layer'); setSelectedLayer(null);
            setClickedParts([]); setFeedbackMsg(null);
            setShakeCard(false); setWrongLayers([]);
        } else {
            setGameState('end');
        }
    };

    const renderChart = (c) => {
        switch (c.chartType) {
            case 'bar': return <BarChart data={c.chartData} unit={c.chartUnit} color={c.chartColor} axisX={c.chartAxisX} axisY={c.chartAxisY} />;
            case 'pie': return <PieChart data={c.chartData} />;
            case 'line': return <LineChart data={c.chartData} unit={c.chartUnit} color={c.chartColor} axisX={c.chartAxisX} axisY={c.chartAxisY} />;
            default: return null;
        }
    };

    // ========== START SCREEN ==========
    if (gameState === 'start') {
        return (
            <div className="detective-corkboard rounded-xl overflow-hidden flex flex-col items-center justify-center p-6 md:py-14 font-sans min-h-[600px]">
                <div className="bg-white p-8 md:p-12 rounded-2xl shadow-xl max-w-xl w-full text-center border-2 border-amber-200 relative overflow-hidden detective-fingerprint">
                    <div className="caution-tape mb-0" style={{ position: 'absolute', top: 0, left: 0, right: 0 }} />
                    <div className="absolute top-3 right-4 text-[10px] font-mono text-amber-400 tracking-widest" style={{ fontFamily: 'Courier New, monospace' }}>CASE FILE #001-014</div>
                    <div className="text-6xl mb-4">🕵️</div>
                    <h1 className="text-3xl md:text-5xl font-black text-amber-700 mb-3 tracking-wide">數據偵探</h1>
                    <h2 className="text-lg md:text-xl font-bold text-amber-500 mb-6 pb-4 border-b-2 border-dashed border-amber-200">找出分析報告中的破綻！</h2>

                    <div className="bg-amber-50 rounded-xl p-5 mb-6 text-left border border-amber-200">
                        <label className="block text-sm font-bold text-amber-700 mb-2 tracking-wider">🕵️ 探員代號 (姓名)</label>
                        <input
                            type="text"
                            value={playerName}
                            onChange={(e) => setPlayerName(e.target.value)}
                            placeholder="請輸入你的名字..."
                            className="w-full bg-white border-2 border-amber-200 focus:border-amber-500 rounded-lg outline-none px-4 py-3 font-bold text-lg text-slate-800 placeholder-slate-300 mb-4 transition-colors text-center"
                        />
                        <h3 className="text-sm font-bold text-amber-600 mb-3 tracking-wider border-t border-amber-200 pt-3">📋 偵探手冊</h3>
                        <div className="space-y-3 text-sm text-slate-600">
                            <p>每份分析報告包含 <strong className="text-amber-700">三層結構</strong>：</p>
                            <div className="pl-2 space-y-1.5">
                                <p><span className="text-indigo-500 font-bold">📊 描述</span> — 客觀陳述數據</p>
                                <p><span className="text-amber-600 font-bold">🧠 詮釋</span> — 解讀數據意義</p>
                                <p><span className="text-emerald-600 font-bold">🔍 批判</span> — 檢視限制與可信度</p>
                            </div>
                            <div className="border-t border-amber-200 pt-3 mt-3">
                                <p>🔎 <strong className="text-amber-700">第一步：選哪一層有問題</strong></p>
                                <p>🔍 <strong className="text-amber-700">第二步：找出問題關鍵字</strong></p>
                                <p>✅ 三層都 OK？按<strong className="text-emerald-600">「都沒問題」</strong></p>
                                <p>⭐ 每案 3 顆星，選錯扣星！</p>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={startGame}
                        disabled={!playerName.trim()}
                        className={`font-black py-4 px-10 rounded-full text-xl transition transform shadow-lg ${!playerName.trim() ? 'bg-slate-300 text-slate-500 cursor-not-allowed' : 'bg-amber-500 hover:bg-amber-600 text-white hover:scale-105 active:scale-95'}`}>
                        開始辦案 🕵️
                    </button>
                </div>
            </div >
        );
    }

    // ========== END SCREEN ==========
    if (gameState === 'end') {
        const maxScore = shuffledCases.length * 3;
        const pct = Math.round((score / maxScore) * 100);
        let title, color, emoji;
        if (pct >= 90) { title = "首席數據分析官"; color = "text-amber-600"; emoji = "🏆"; }
        else if (pct >= 70) { title = "資深數據偵探"; color = "text-amber-700"; emoji = "🕵️"; }
        else if (pct >= 50) { title = "實習分析師"; color = "text-emerald-600"; emoji = "📋"; }
        else { title = "菜鳥偵探，繼續修煉！"; color = "text-rose-500"; emoji = "📉"; }

        return (
            <div className="detective-corkboard rounded-xl overflow-hidden flex flex-col items-center justify-center p-6 md:py-10 font-sans min-h-[600px]">
                <div className="bg-white p-8 rounded-2xl shadow-xl max-w-2xl w-full text-center border-2 border-amber-200 relative detective-fingerprint">
                    <div className="caution-tape" style={{ position: 'absolute', top: 0, left: 0, right: 0 }} />
                    <h1 className="text-2xl font-bold text-amber-400 mb-4 tracking-widest mt-4" style={{ fontFamily: 'Courier New, monospace' }}>📋 INVESTIGATION REPORT</h1>

                    <div className="mb-4">
                        <p className="text-sm font-bold text-slate-400 tracking-wider">探員姓名</p>
                        <p className="text-2xl font-black text-slate-800 border-b-2 border-amber-200 inline-block px-8 pb-1">{playerName}</p>
                    </div>

                    <div className="text-6xl font-black mb-2 text-amber-600">{score} <span className="text-2xl text-amber-300">/ {maxScore}</span></div>
                    {pct >= 70 && <div className="case-closed-stamp my-3">CASE CLOSED</div>}
                    <div className="text-5xl my-2">{emoji}</div>
                    <h2 className={`text-3xl font-black mb-6 ${color}`}>{title}</h2>

                    <p className="text-xs text-slate-400 font-bold mb-4 uppercase tracking-widest bg-slate-50 py-2 rounded-lg border border-slate-200">請截圖此頁面作為紀錄</p>

                    <button onClick={() => setGameState('start')}
                        className="bg-amber-100 hover:bg-amber-200 text-amber-700 font-bold py-3 px-8 rounded-full text-lg transition transform hover:scale-105 shadow-sm mb-8 border border-amber-300">
                        重新調查 🔄
                    </button>

                    {wrongCases.length > 0 && (
                        <div className="text-left bg-rose-50 p-6 rounded-xl border-l-8 border-rose-300 max-h-96 overflow-y-auto">
                            <h3 className="text-lg font-black mb-4 text-slate-700">📋 誤判紀錄</h3>
                            <div className="space-y-3">
                                {wrongCases.map((wc, i) => (
                                    <div key={i} className="bg-white p-4 rounded-lg border border-rose-200 shadow-sm">
                                        <p className="font-bold text-slate-700 mb-1">{wc.title}</p>
                                        <span className={`text-sm font-bold px-3 py-1 rounded-full ${wc.isValid ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-600'}`}>
                                            {wc.isValid ? '✅ 其實是正確分析' : `❌ ${wc.errorType}（${wc.errorLayer === 'descriptive' ? '📊描述層' : wc.errorLayer === 'interpretive' ? '🧠詮釋層' : '🔍批判層'}）`}
                                        </span>
                                        <div className="flex flex-wrap gap-1 mt-2">
                                            {wc.tags.map(t => (
                                                <span key={t} className="bg-amber-50 text-amber-700 text-xs font-bold px-2 py-0.5 rounded border border-amber-200">#{t}</span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    {wrongCases.length === 0 && (
                        <div className="bg-emerald-50 text-emerald-700 border border-emerald-200 p-4 rounded-xl font-bold text-lg">
                            零誤判！你的數據解讀能力堪稱完美！ 🎉
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // ========== PLAYING SCREEN ==========
    if (!current) return null;
    const isBoss = current.title.includes('🔥');

    return (
        <div className="detective-corkboard rounded-xl overflow-hidden flex flex-col items-center p-4 md:p-8 font-sans min-h-[600px]">
            <div className="max-w-4xl w-full">

                {/* Top bar */}
                <div className="flex justify-between items-center mb-5 px-2">
                    <div className="bg-white text-amber-700 font-bold px-5 py-2 rounded-full shadow-sm text-lg border border-amber-200">
                        🗂️ 案件 {currentIdx + 1} / {shuffledCases.length}
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex gap-1 text-xl">
                            {[0, 1, 2].map(i => (
                                <span key={i} style={{
                                    opacity: i < stars ? 1 : 0.2,
                                    transition: 'all 0.3s',
                                    display: 'inline-block',
                                    animation: (i === stars && shakeCard) ? 'star-lose 0.5s ease-out' : 'none'
                                }}>⭐</span>
                            ))}
                        </div>
                        <div className="bg-white text-amber-600 font-bold px-4 py-2 rounded-full shadow-sm text-lg border border-amber-200">
                            {score} 分
                        </div>
                    </div>
                </div>

                {/* Case File Card */}
                <div
                    className={`bg-white p-5 md:p-7 rounded-2xl shadow-lg mb-5 border-2 transition-all relative overflow-visible detective-coffee ${isBoss ? 'border-purple-300 shadow-purple-100' : 'border-amber-200'}`}
                    style={{ animation: shakeCard ? 'detective-shake 0.5s ease-in-out' : 'none', marginTop: '20px' }}
                >
                    <div className="manila-tab">CASE #{String(current.id).padStart(3, '0')}</div>
                    <div className="caution-tape" style={{ position: 'absolute', top: 0, left: 0, right: 0, borderRadius: '12px 12px 0 0' }} />
                    {isBoss && (
                        <div className="absolute top-2 right-3 bg-purple-500 text-white text-xs font-black px-3 py-1 rounded-full tracking-widest animate-pulse" style={{ zIndex: 5 }}>🔥 魔王</div>
                    )}

                    {/* Title */}
                    <div className="flex items-center gap-2 mb-2 mt-1">
                        <span className="text-xl">🕵️</span>
                        <h2 className="text-lg font-bold text-slate-800">{current.title}</h2>
                    </div>
                    <p className="text-[11px] text-slate-400 mb-4">📁 資料來源：{current.dataSource}</p>

                    {/* Chart */}
                    <div className="bg-slate-50 rounded-xl p-4 mb-5 border border-slate-200">
                        {renderChart(current)}
                    </div>

                    {/* Three-Layer Analysis */}
                    <div className="mb-2">
                        <p className="text-xs font-bold text-amber-600 mb-3 tracking-wider flex items-center gap-1">
                            {phase === 'select-layer'
                                ? '📋 閱讀後，判斷哪一層有問題：'
                                : '🔍 找出有問題的關鍵字：'}
                        </p>

                        {current.layers.map((layer, layerIdx) => {
                            const exhibitLabels = ['EXHIBIT A', 'EXHIBIT B', 'EXHIBIT C'];
                            const isSelectedLayer = selectedLayer === layer.type;
                            const isWrongLayer = wrongLayers.includes(layer.type);
                            return (
                                <div key={layerIdx} className={`evidence-card layer-${layer.type}`}
                                    style={{
                                        opacity: (phase === 'find-word' && !isSelectedLayer) ? 0.5 : 1,
                                        borderLeftWidth: isSelectedLayer ? '6px' : '4px',
                                        transition: 'all 0.3s'
                                    }}>
                                    <div className="flex items-center gap-2 mb-1.5">
                                        <span className="text-base">{layer.icon}</span>
                                        <span className={`text-xs font-black tracking-wider ${layer.type === 'descriptive' ? 'text-indigo-500' :
                                            layer.type === 'interpretive' ? 'text-amber-600' : 'text-emerald-600'
                                            }`}>{layer.label}</span>
                                        <span className="exhibit-tag">{exhibitLabels[layerIdx]}</span>
                                        {isWrongLayer && <span className="text-xs text-rose-400 font-bold">✗ 不是這層</span>}
                                        {isSelectedLayer && phase === 'find-word' && <span className="text-xs text-red-500 font-bold animate-pulse">⬇ 找出問題字句</span>}
                                    </div>
                                    <p className="text-base md:text-lg font-medium text-slate-700 leading-relaxed">
                                        {layer.parts.map((part, partIdx) => {
                                            // Only show suspects in Phase 2 for the selected layer
                                            if (!part.suspect || phase !== 'find-word' || !isSelectedLayer) {
                                                return <span key={partIdx}>{part.text}</span>;
                                            }
                                            const key = `${layerIdx}-${partIdx}`;
                                            const wasClicked = clickedParts.includes(key);
                                            const isRight = part.isError;
                                            let className = 'detective-suspect';
                                            if (wasClicked) className += isRight ? ' clicked-right' : ' clicked-wrong';
                                            if (isAnswered && !wasClicked && isRight) className += ' clicked-right';
                                            return (
                                                <span key={partIdx} className={className}
                                                    onClick={() => !isAnswered && handleSuspectClick(layerIdx, partIdx)}
                                                    style={{ cursor: (isAnswered || wasClicked) ? 'default' : undefined }}>
                                                    {part.text}
                                                </span>
                                            );
                                        })}
                                    </p>
                                    {/* Inline layer select button */}
                                    {phase === 'select-layer' && !isAnswered && !isWrongLayer && (
                                        <button onClick={() => handleLayerSelect(layer.type)}
                                            className={`mt-2 w-full py-2 rounded-lg font-bold text-sm transition-all border-2 ${layer.type === 'descriptive' ? 'bg-indigo-50 hover:bg-indigo-100 text-indigo-600 border-indigo-200 hover:border-indigo-400' :
                                                layer.type === 'interpretive' ? 'bg-amber-50 hover:bg-amber-100 text-amber-600 border-amber-200 hover:border-amber-400' :
                                                    'bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border-emerald-200 hover:border-emerald-400'
                                                } hover:shadow-md`}>
                                            🚨 這層有問題
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Phase 1: "No problem" button only */}
                {phase === 'select-layer' && !isAnswered && (
                    <div className="flex justify-center mb-5">
                        <button onClick={() => handleLayerSelect('none')}
                            disabled={wrongLayers.includes('none')}
                            className={`py-3 px-8 rounded-xl font-bold text-base transition-all border-2 ${wrongLayers.includes('none')
                                ? 'bg-slate-100 text-slate-300 border-slate-200 cursor-not-allowed'
                                : 'bg-white hover:bg-slate-50 text-slate-600 border-slate-300 hover:border-slate-400 hover:shadow-md hover:-translate-y-0.5'}`}>
                            ✅ 結案：三層都沒問題
                        </button>
                    </div>
                )}

                {/* Phase transition feedback */}
                {feedbackMsg && phase === 'find-word' && !isAnswered && feedbackMsg.type === 'layer-right' && (
                    <div className="bg-indigo-50 border border-indigo-300 rounded-xl p-4 mb-5 text-center" style={{ animation: 'detective-pop 0.3s ease-out' }}>
                        <p className="text-base font-bold text-indigo-700">{feedbackMsg.text}</p>
                    </div>
                )}

                {/* Inline hint for wrong layer/word */}
                {feedbackMsg && !isAnswered && feedbackMsg.type === 'wrong' && (
                    <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 mb-5 text-center" style={{ animation: 'detective-pop 0.3s ease-out' }}>
                        <p className="text-base font-bold text-amber-700">{feedbackMsg.text}</p>
                    </div>
                )}

                {/* Full feedback after answering */}
                {isAnswered && (
                    <div className={`p-6 rounded-2xl shadow-lg mb-5 border-l-8 ${feedbackMsg?.type === 'right' ? 'bg-emerald-50 border-emerald-400' : 'bg-rose-50 border-rose-400'}`}
                        style={{ animation: 'detective-pop 0.4s ease-out' }}>
                        <h3 className={`text-xl font-black mb-3 ${feedbackMsg?.type === 'right' ? 'text-emerald-700' : 'text-rose-600'}`}>
                            {feedbackMsg?.text}
                        </h3>

                        {!current.isValid && (
                            <div className="mb-3 flex flex-wrap gap-2">
                                <span className="bg-rose-100 text-rose-600 font-bold px-3 py-1 rounded-full text-sm">
                                    🏷️ {current.errorType}
                                </span>
                                <span className={`font-bold px-3 py-1 rounded-full text-sm ${current.errorLayer === 'descriptive' ? 'bg-indigo-100 text-indigo-600' :
                                    current.errorLayer === 'interpretive' ? 'bg-amber-100 text-amber-700' :
                                        'bg-emerald-100 text-emerald-700'
                                    }`}>
                                    {current.errorLayer === 'descriptive' ? '📊 描述層出錯' :
                                        current.errorLayer === 'interpretive' ? '🧠 詮釋層出錯' : '🔍 批判層出錯'}
                                </span>
                            </div>
                        )}

                        <div className="flex flex-wrap gap-2 mb-3">
                            {current.tags.map(tag => (
                                <span key={tag} className="bg-amber-50 text-amber-700 font-bold px-3 py-1 rounded-md text-sm border border-amber-200">#{tag}</span>
                            ))}
                        </div>

                        <p className="text-slate-700 text-base font-medium leading-relaxed mb-4 whitespace-pre-line">{current.explanation}</p>

                        <div className="text-right">
                            <button onClick={nextCase}
                                className="bg-amber-500 hover:bg-amber-600 text-white font-black py-3 px-10 rounded-full text-lg transition transform hover:scale-105 shadow-lg">
                                {currentIdx < caseData.length - 1 ? '下一案 ➡️' : '查看調查報告 📋'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
