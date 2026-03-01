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
    const id = 'detective-styles-v4';
    if (document.getElementById(id)) return;
    const style = document.createElement('style');
    style.id = id;
    style.textContent = `
        .chart-container-darkmode svg text {
            fill: #94a3b8 !important; /* slate-400 */
        }
        .chart-container-darkmode svg line, 
        .chart-container-darkmode svg path.recharts-cartesian-grid-horizontal line,
        .chart-container-darkmode svg path.recharts-cartesian-grid-vertical line {
            stroke: #334155 !important; /* slate-700 */
        }
        .chart-container-darkmode .recharts-tooltip-wrapper .recharts-default-tooltip {
            background-color: rgba(15, 23, 42, 0.9) !important; /* slate-900 */
            border: 1px solid rgba(245, 158, 11, 0.3) !important;
            border-radius: 8px !important;
            backdrop-filter: blur(8px) !important;
        }
        .chart-container-darkmode .recharts-tooltip-wrapper .recharts-default-tooltip .recharts-tooltip-item {
            color: #f8fafc !important; /* slate-50 */
        }
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
        @keyframes shimmer {
            100% { transform: translateX(100%); }
        }
        .animate-shimmer {
            animation: shimmer 1.5s infinite;
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

    useEffect(() => {
        injectStyles();
        const savedName = localStorage.getItem('rib_agent_name');
        if (savedName) {
            setPlayerName(savedName);
        }
    }, []);

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
            <div className="relative rounded-xl overflow-hidden flex flex-col items-center justify-center p-6 md:py-14 font-sans min-h-[700px] text-rose-50 shadow-2xl bg-cover bg-fixed bg-center"
                style={{ backgroundImage: "url('/images/data_detective_bg.png')" }}>
                <div className="absolute inset-0 bg-slate-900/80  z-0"></div>
                <div className="bg-slate-900/60 p-8 md:p-12 rounded-3xl shadow-[0_0_40px_rgba(0,0,0,0.6)] max-w-xl w-full text-center border-t-[8px] border-amber-500 relative flex flex-col  border-x border-b border-white/10 z-10 animate-in fade-in zoom-in-95 duration-500">
                    <div className="absolute top-3 right-4 text-[10px] font-mono text-amber-500 tracking-widest drop-shadow-[0_0_5px_rgba(245,158,11,0.8)]" style={{ fontFamily: 'Courier New, monospace' }}>FILE #001-014</div>
                    <div className="text-6xl mb-4 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">🕵️</div>
                    <h1 className="text-4xl md:text-5xl font-black mb-2 tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600 drop-shadow-[0_0_10px_rgba(245,158,11,0.3)] animate-pulse">真相濾鏡</h1>
                    <div className="text-sm md:text-base font-bold text-amber-200/90 mb-5 bg-amber-950/60 inline-block px-4 py-1.5 rounded-lg border border-amber-500/30 tracking-widest">
                        🎯 客觀數據解讀與批判性思維培養
                    </div>
                    <p className="text-lg text-slate-300 mb-8 max-w-lg mx-auto leading-relaxed shadow-sm font-medium">
                        歡迎來到「真相濾鏡」！在這裡，你將化身為數據偵探，運用你的批判性思維，
                        從看似合理的分析報告中，找出隱藏的偏誤、錯誤詮釋或不當結論。
                        每一份報告都可能藏著「假象」，你的任務就是揭露它們，還原數據的「真相」！
                    </p>

                    <div className="bg-slate-950/60 rounded-2xl p-6 mb-8 text-center border border-amber-500/30 shadow-inner  relative overflow-hidden group hover:border-amber-500/50 transition-colors duration-500">
                        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                        <label className="block text-sm font-black text-amber-500 mb-2 tracking-[0.2em] drop-shadow-[0_0_5px_currentColor]">🕵️ 目前登入身分</label>
                        {playerName ? (
                            <div className="text-2xl font-black text-amber-300 border-b-2 border-amber-500/50 inline-block pb-1 px-4 drop-shadow-[0_0_8px_rgba(252,211,77,0.5)]">{playerName} 探員</div>
                        ) : (
                            <div className="text-rose-400 font-bold mb-2 drop-shadow-[0_0_5px_currentColor]">無法辨識身分！請返回總部大廳完成報到手續。</div>
                        )}
                        <h3 className="text-sm font-black text-cyan-400 mb-3 tracking-widest border-t border-slate-700/50 pt-5 mt-6 flex items-center justify-center gap-2 drop-shadow-[0_0_5px_currentColor]">📋 偵探手冊</h3>
                        <div className="space-y-3 text-sm text-slate-300 text-left font-medium">
                            <p>每份分析報告包含 <strong className="text-amber-400">三層結構</strong>：</p>
                            <div className="pl-3 border-l-2 border-slate-700/80 space-y-2 py-1 my-2">
                                <p className="flex items-center gap-2"><span className="text-indigo-400 font-bold drop-shadow-[0_0_5px_currentColor] w-16">📊 描述</span> <span className="text-slate-400">—</span> 客觀陳述數據</p>
                                <p className="flex items-center gap-2"><span className="text-amber-500 font-bold drop-shadow-[0_0_5px_currentColor] w-16">🧠 詮釋</span> <span className="text-slate-400">—</span> 解讀數據意義</p>
                                <p className="flex items-center gap-2"><span className="text-emerald-400 font-bold drop-shadow-[0_0_5px_currentColor] w-16">🔍 批判</span> <span className="text-slate-400">—</span> 檢視限制與信度</p>
                            </div>
                            <div className="border-t border-slate-700/50 pt-4 mt-4 space-y-2">
                                <p className="flex items-center gap-2">🔎 <strong className="text-amber-400 drop-shadow-[0_0_5px_currentColor]">第一步：選哪一層有問題</strong></p>
                                <p className="flex items-center gap-2">🔍 <strong className="text-cyan-400 drop-shadow-[0_0_5px_currentColor]">第二步：找出問題關鍵字</strong></p>
                                <p className="flex items-center gap-2"><span className="text-emerald-400">✅</span> 三層都 OK？按<strong className="text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-500/30">「都沒問題」</strong></p>
                                <p className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-800/80 text-amber-500/80 text-xs">⭐ 每案 3 顆星，選錯扣星！</p>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={startGame}
                        disabled={!playerName}
                        className={`w-full py-4 rounded-full font-black text-xl tracking-[0.2em] transition-all duration-300 flex items-center justify-center gap-2 relative overflow-hidden group ${!playerName ? 'bg-slate-800/50 text-slate-500 border border-slate-700 cursor-not-allowed' : 'bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-slate-950 shadow-[0_5px_20px_rgba(245,158,11,0.4)] hover:shadow-[0_8px_25px_rgba(245,158,11,0.6)] hover:-translate-y-1 active:translate-y-0'}`}>
                        {playerName && <span className="absolute inset-0 w-full h-full bg-white/20 -skew-x-12 -translate-x-full group-hover:animate-shimmer"></span>}
                        <span className="relative z-10 flex items-center gap-2">開始辦案 🕵️</span>
                    </button>
                </div>
            </div >
        );
    }

    // ========== END SCREEN ==========
    if (gameState === 'end') {
        const maxScore = shuffledCases.length * 3;
        const pct = Math.round((score / maxScore) * 100);
        let title;
        let color, bg, borderColor, emoji;
        if (pct >= 90) { title = "首席情報解碼員"; color = "text-amber-400"; bg = "bg-amber-950/60"; borderColor = "border-amber-400"; emoji = "🏆"; }
        else if (pct >= 70) { title = "資深數據分析師"; color = "text-amber-500"; bg = "bg-amber-950/40"; borderColor = "border-amber-500/50"; emoji = "🕵️"; }
        else if (pct >= 50) { title = "實習分析師"; color = "text-emerald-400"; emoji = "📋"; }
        else { title = "菜鳥偵探，繼續修煉！"; color = "text-rose-400"; emoji = "📉"; }

        return (
            <div className="relative rounded-xl overflow-hidden flex flex-col items-center justify-center p-6 md:py-10 font-sans min-h-[700px] text-rose-50 shadow-2xl bg-cover bg-fixed bg-center"
                style={{ backgroundImage: "url('/images/data_detective_bg.png')" }}>
                <div className="absolute inset-0 bg-slate-900/80 z-0"></div>
                <div className="bg-slate-900/70 p-8 rounded-3xl shadow-[0_0_40px_rgba(0,0,0,0.6)] max-w-2xl w-full text-center border-t-[8px] border-amber-500 relative  border-x border-b border-white/10 z-10 animate-in fade-in slide-in-from-bottom-5 duration-700">
                    <div className="absolute top-0 right-6 bg-slate-800 text-slate-400 text-xs font-mono px-4 py-1.5 rounded-b-lg tracking-widest shadow-inner border-x border-b border-slate-700">FINAL DOSSIER</div>
                    <h1 className="text-2xl font-bold text-amber-500 mb-4 tracking-widest mt-4 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]" style={{ fontFamily: 'Courier New, monospace' }}>📋 INVESTIGATION REPORT</h1>

                    <div className="mb-6 bg-slate-950/50 py-4 mx-8 rounded-2xl border border-slate-800/80 shadow-inner">
                        <p className="text-sm font-black text-slate-400 tracking-widest mb-1">探員姓名</p>
                        <p className="text-3xl font-black text-amber-300 border-b-2 border-amber-500/50 inline-block px-8 pb-1 drop-shadow-[0_0_8px_rgba(252,211,77,0.5)]">{playerName}</p>
                    </div>

                    <div className="text-6xl font-black mb-2 text-amber-500 drop-shadow-[0_0_15px_rgba(245,158,11,0.4)]">{score} <span className="text-3xl text-amber-300 opacity-60">/ {maxScore}</span></div>
                    {pct >= 70 && <div className="case-closed-stamp my-3 opacity-90 rotate-[-5deg] scale-110 drop-shadow-[0_0_10px_rgba(244,63,94,0.4)] border-rose-500 text-rose-500">CASE CLOSED</div>}
                    <div className="text-6xl my-4 drop-shadow-[0_0_20px_rgba(255,255,255,0.2)] animate-bounce">{emoji}</div>
                    <h2 className={`text-4xl font-black mb-8 ${color} drop-shadow-[0_0_10px_currentColor] tracking-wide`}>{title}</h2>

                    <p className="text-xs text-amber-400/80 font-black mb-6 uppercase tracking-[0.2em] bg-amber-950/40 py-2.5 rounded-xl border border-amber-500/30 mx-12 shadow-inner">請截圖此頁面作為紀錄</p>

                    <button onClick={() => setGameState('start')}
                        className="bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold py-3.5 px-10 rounded-full text-lg tracking-widest transition-all duration-300 hover:scale-105 shadow-[0_5px_15px_rgba(0,0,0,0.5)] hover:shadow-[0_5px_20px_rgba(245,158,11,0.3)] mb-8 border border-slate-600 hover:border-amber-500/50 flex items-center gap-2 mx-auto">
                        <span>重新調查</span> <span>🔄</span>
                    </button>

                    {wrongCases.length > 0 && (
                        <div className="text-left bg-slate-900/80 p-6 rounded-2xl border-l-[6px] border-rose-500 shadow-inner max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-rose-900 scrollbar-track-transparent">
                            <h3 className="text-lg font-black mb-4 text-rose-400 tracking-widest flex items-center gap-2 drop-shadow-[0_0_5px_currentColor]">📋 誤判紀錄</h3>
                            <div className="space-y-4">
                                {wrongCases.map((wc, i) => (
                                    <div key={i} className="bg-slate-950/60 p-5 rounded-xl border border-slate-700 shadow-sm relative overflow-hidden group hover:border-slate-500 transition-colors">
                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-rose-500/50 to-transparent"></div>
                                        <p className="font-bold text-slate-200 mb-2">{wc.title}</p>
                                        <span className={`text-xs font-black px-3 py-1 rounded-full shadow-inner tracking-wider ${wc.isValid ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30' : 'bg-rose-950/60 text-rose-400 border border-rose-500/30'}`}>
                                            {wc.isValid ? '✅ 其實是正確分析' : `❌ ${wc.errorType}（${wc.errorLayer === 'descriptive' ? '📊描述層' : wc.errorLayer === 'interpretive' ? '🧠詮釋層' : '🔍批判層'}）`}
                                        </span>
                                        <div className="flex flex-wrap gap-1.5 mt-3">
                                            {wc.tags.map(t => (
                                                <span key={t} className="bg-amber-950/40 text-amber-400 text-[10px] font-black tracking-widest px-2 py-0.5 rounded border border-amber-500/20">#{t}</span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    {wrongCases.length === 0 && (
                        <div className="bg-emerald-950/60 text-emerald-400 border border-emerald-500/50 p-5 rounded-2xl font-black text-lg tracking-wide shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                            ✨ 零誤判！你的數據解讀能力堪稱完美！ 🎉
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
        <div className="relative rounded-xl overflow-hidden flex flex-col items-center p-4 md:p-8 font-sans min-h-[700px] text-rose-50 shadow-2xl bg-cover bg-fixed bg-center"
            style={{ backgroundImage: "url('/images/data_detective_bg.png')" }}>
            <div className="absolute inset-0 bg-slate-900/80 z-0"></div>

            <div className="max-w-4xl w-full relative z-10 flex flex-col h-full">

                {/* Top bar */}
                <div className="flex flex-wrap justify-between items-center gap-3 mb-6 px-1 shrink-0">
                    <div className="bg-slate-900/80 text-amber-500 font-bold px-5 py-2.5 rounded-full shadow-inner border border-amber-500/30 text-lg flex items-center gap-2 ">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.8)]"></span>
                        案件 <span className="text-amber-300">{currentIdx + 1}</span> <span className="opacity-50 font-normal">/ {shuffledCases.length}</span>
                    </div>

                    <div className="flex items-center gap-4 bg-slate-900/80 px-5 py-2 rounded-full border border-amber-500/30 shadow-inner ">
                        <div className="flex gap-1.5 text-xl items-center mr-4 border-r border-slate-700/80 pr-4">
                            {[0, 1, 2].map(i => (
                                <span key={i} className="drop-shadow-[0_0_5px_rgba(252,211,77,0.8)]" style={{
                                    opacity: i < stars ? 1 : 0.2,
                                    transition: 'all 0.3s',
                                    display: 'inline-block',
                                    animation: (i === stars && shakeCard) ? 'star-lose 0.5s ease-out' : 'none'
                                }}>⭐</span>
                            ))}
                        </div>
                        <div className="text-right flex items-center gap-3">
                            <span className="text-xs text-slate-400 font-bold uppercase tracking-[0.2em]">任務積分</span>
                            <span className="text-2xl font-black text-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]">{score}</span>
                        </div>
                    </div>
                </div>

                {/* Case File Card */}
                <div
                    className={`bg-slate-900/70 p-6 md:p-8 rounded-3xl shadow-[0_0_40px_rgba(0,0,0,0.5)] border-t-[8px] relative flex-1 flex flex-col  border-x border-b border-white/10 ${isBoss ? 'border-purple-500' : 'border-amber-500'}`}
                    style={{ animation: shakeCard ? 'detective-shake 0.5s ease-in-out' : 'none' }}
                >
                    <div className="absolute top-0 right-6 bg-slate-800 text-slate-400 text-xs font-mono px-4 py-1.5 rounded-b-lg tracking-widest shadow-inner border-x border-b border-slate-700">CASE #{String(current.id).padStart(3, '0')}</div>

                    {isBoss && (
                        <div className="absolute top-0 left-6 bg-purple-600/90 text-white text-xs font-black px-4 py-1.5 rounded-b-lg tracking-widest shadow-[0_2px_10px_rgba(168,85,247,0.5)]  border-x border-b border-purple-400/50 animate-pulse">🔥 魔王考驗</div>
                    )}

                    {/* Title */}
                    <div className="flex items-center gap-3 mb-2 mt-4 md:mt-2">
                        <span className="text-2xl drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">🕵️</span>
                        <h2 className={`text-xl font-black tracking-wide ${isBoss ? 'text-purple-400 drop-shadow-[0_0_5px_currentColor]' : 'text-amber-400 drop-shadow-[0_0_5px_currentColor]'}`}>{current.title}</h2>
                    </div>
                    <p className="text-[11px] text-slate-400 mb-5 font-mono tracking-wider">📁 資料來源：{current.dataSource}</p>

                    {/* Chart Area */}
                    <div className="bg-slate-950/80 rounded-2xl p-4 md:p-6 mb-6 border border-slate-800 shadow-inner relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                        {/* Wrapper for charts to invert colors if they are not naturally dark mode compat */}
                        <div className="chart-container-darkmode opacity-90 hover:opacity-100 transition-opacity">
                            {renderChart(current)}
                        </div>
                    </div>

                    {/* Three-Layer Analysis */}
                    <div className="flex-1 flex flex-col min-h-0">
                        <div className="flex items-center justify-between mb-4 border-b border-slate-700/50 pb-2">
                            <p className="text-sm font-black text-amber-500 tracking-[0.1em] flex items-center gap-2 drop-shadow-[0_0_5px_currentColor]">
                                {phase === 'select-layer'
                                    ? '📋 第 1 步：判斷哪一層有問題'
                                    : '🔍 第 2 步：找出有問題的關鍵字'}
                            </p>
                        </div>

                        <div className="space-y-4 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent flex-1 pb-4">
                            {current.layers.map((layer, layerIdx) => {
                                const exhibitLabels = ['EXHIBIT A', 'EXHIBIT B', 'EXHIBIT C'];
                                const isSelectedLayer = selectedLayer === layer.type;
                                const isWrongLayer = wrongLayers.includes(layer.type);

                                // Dynamic colors for dark mode based on layer type
                                const layerColors = {
                                    descriptive: { text: 'text-indigo-400', border: 'border-indigo-500/50', bgHover: 'hover:bg-indigo-950/40', btnColor: 'from-indigo-600 to-blue-600' },
                                    interpretive: { text: 'text-amber-500', border: 'border-amber-500/50', bgHover: 'hover:bg-amber-950/40', btnColor: 'from-amber-600 to-orange-600' },
                                    critical: { text: 'text-emerald-400', border: 'border-emerald-500/50', bgHover: 'hover:bg-emerald-950/40', btnColor: 'from-emerald-600 to-teal-600' }
                                };
                                const colors = layerColors[layer.type];

                                return (
                                    <div key={layerIdx} className={`relative p-4 md:p-5 rounded-2xl border-l-[6px] transition-all duration-300 shadow-inner  ${isSelectedLayer ? `bg-slate-800/80 ${colors.border}` :
                                        isWrongLayer ? 'bg-slate-900/30 border-slate-700/30 opacity-60' :
                                            `bg-slate-900/60 border-slate-700 hover:border-slate-500`
                                        }`}
                                        style={{
                                            opacity: (phase === 'find-word' && !isSelectedLayer) ? 0.3 : 1,
                                            filter: (phase === 'find-word' && !isSelectedLayer) ? 'grayscale(0.8)' : 'none',
                                        }}>

                                        <div className="flex items-center justify-between gap-2 mb-3">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xl drop-shadow-md">{layer.icon}</span>
                                                <span className={`text-sm font-black tracking-widest drop-shadow-[0_0_5px_currentColor] ${colors.text}`}>{layer.label}</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                {isWrongLayer && <span className="text-[10px] text-rose-400 font-bold bg-rose-950/50 px-2 py-0.5 rounded border border-rose-500/30">✗ 安全</span>}
                                                {isSelectedLayer && phase === 'find-word' && <span className="text-[10px] text-rose-400 font-black animate-pulse tracking-widest bg-rose-950/50 px-2 py-1 rounded border border-rose-500/30 shadow-[0_0_10px_rgba(244,63,94,0.3)]">⬇ 點擊可疑字詞</span>}
                                                <span className="text-[10px] font-mono text-slate-500 border border-slate-700/50 bg-slate-950/50 px-2 py-0.5 rounded tracking-widest">{exhibitLabels[layerIdx]}</span>
                                            </div>
                                        </div>

                                        <div className="text-base md:text-lg font-medium text-slate-200 leading-relaxed pl-1 pb-1">
                                            {layer.parts.map((part, partIdx) => {
                                                if (!part.suspect || phase !== 'find-word' || !isSelectedLayer) {
                                                    return <span key={partIdx}>{part.text}</span>;
                                                }
                                                const key = `${layerIdx}-${partIdx}`;
                                                const wasClicked = clickedParts.includes(key);
                                                const isRight = part.isError;

                                                let styleClass = "inline-block px-1.5 mx-0.5 rounded relative cursor-pointer font-bold transition-all duration-300 hover:bg-white/10 hover:shadow-[0_0_10px_rgba(255,255,255,0.1)] border border-dashed border-white/20";

                                                if (wasClicked) {
                                                    if (isRight) styleClass = "inline-block px-1.5 mx-0.5 rounded font-black bg-rose-950/80 border-2 border-rose-500 text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.4)]";
                                                    else styleClass = "inline-block px-1.5 mx-0.5 rounded font-medium line-through text-slate-500 bg-slate-900 border border-slate-800 opacity-60";
                                                } else if (isAnswered && isRight) { // reveal right answer if missed
                                                    styleClass = "inline-block px-1.5 mx-0.5 rounded font-black border-2 border-emerald-500 bg-emerald-950/50 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]";
                                                }

                                                return (
                                                    <span key={partIdx} className={styleClass}
                                                        onClick={() => !isAnswered && handleSuspectClick(layerIdx, partIdx)}
                                                        style={{ cursor: (isAnswered || wasClicked) ? 'default' : 'pointer' }}>
                                                        {part.text}
                                                    </span>
                                                );
                                            })}
                                        </div>

                                        {/* Inline layer select button */}
                                        {phase === 'select-layer' && !isAnswered && !isWrongLayer && (
                                            <button onClick={() => handleLayerSelect(layer.type)}
                                                className={`mt-4 w-full py-2.5 rounded-xl font-bold text-sm tracking-widest transition-all duration-300 relative overflow-hidden group bg-gradient-to-r ${colors.btnColor} border border-white/10 shadow-lg text-white hover:shadow-[0_0_15px_rgba(255,255,255,0.2)] hover:-translate-y-0.5`}>
                                                <span className="absolute inset-0 w-full h-full bg-white/20 -skew-x-12 -translate-x-full group-hover:animate-shimmer"></span>
                                                <span className="relative z-10 flex items-center justify-center gap-2">🚨 指控此層有誤</span>
                                            </button>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Phase 1: "No problem" button only */}
                {phase === 'select-layer' && !isAnswered && (
                    <div className="flex justify-center mb-8 relative z-20">
                        <button onClick={() => handleLayerSelect('none')}
                            disabled={wrongLayers.includes('none')}
                            className={`py-3.5 px-10 rounded-full font-black text-lg tracking-widest transition-all duration-300 border-2 shadow-lg relative overflow-hidden group ${wrongLayers.includes('none')
                                ? 'bg-slate-900/50 text-slate-600 border-slate-800 cursor-not-allowed'
                                : 'bg-slate-900/80 hover:bg-slate-800 text-emerald-400 border-emerald-500/50 hover:border-emerald-400 hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:-translate-y-1 '}`}>
                            {wrongLayers.includes('none') ? '' : <span className="absolute inset-0 w-full h-full bg-white/5 -skew-x-12 -translate-x-full group-hover:animate-shimmer"></span>}
                            <span className="relative z-10">✅ 結案：三層都沒問題</span>
                        </button>
                    </div>
                )}

                {/* Phase transition feedback */}
                {feedbackMsg && phase === 'find-word' && !isAnswered && feedbackMsg.type === 'layer-right' && (
                    <div className="bg-indigo-950/80 border-2 border-indigo-500 rounded-2xl p-5 mb-8 text-center shadow-[0_0_20px_rgba(99,102,241,0.3)]  relative z-20" style={{ animation: 'detective-pop 0.3s ease-out' }}>
                        <p className="text-lg font-black text-indigo-300 tracking-wider drop-shadow-[0_0_5px_currentColor]">{feedbackMsg.text}</p>
                    </div>
                )}

                {/* Inline hint for wrong layer/word */}
                {feedbackMsg && !isAnswered && feedbackMsg.type === 'wrong' && (
                    <div className="bg-amber-950/80 border-2 border-amber-500 rounded-2xl p-5 mb-8 text-center shadow-[0_0_20px_rgba(245,158,11,0.3)]  relative z-20" style={{ animation: 'detective-pop 0.3s ease-out' }}>
                        <p className="text-lg font-black text-amber-400 tracking-wider drop-shadow-[0_0_5px_currentColor]">{feedbackMsg.text}</p>
                    </div>
                )}

                {/* Full feedback after answering */}
                {isAnswered && (
                    <div className={`p-6 md:p-8 rounded-3xl shadow-[0_0_30px_rgba(0,0,0,0.6)] mb-8 border-l-[8px] relative z-20  ${feedbackMsg?.type === 'right' ? 'bg-emerald-950/80 border-emerald-500' : 'bg-rose-950/80 border-rose-500'}`}
                        style={{ animation: 'detective-pop 0.4s ease-out' }}>
                        <div className="absolute top-0 right-0 p-4 opacity-20">
                            <span className="text-6xl">{feedbackMsg?.type === 'right' ? '✔️' : '❌'}</span>
                        </div>
                        <h3 className={`text-2xl font-black mb-5 tracking-wider drop-shadow-[0_0_8px_currentColor] ${feedbackMsg?.type === 'right' ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {feedbackMsg?.text}
                        </h3>

                        {!current.isValid && (
                            <div className="mb-4 flex flex-wrap gap-3">
                                <span className="bg-rose-950 text-rose-400 font-bold px-4 py-1.5 rounded-full text-sm border border-rose-500/50 shadow-inner">
                                    🏷️ {current.errorType}
                                </span>
                                <span className={`font-bold px-4 py-1.5 rounded-full text-sm border shadow-inner ${current.errorLayer === 'descriptive' ? 'bg-indigo-950/80 text-indigo-400 border-indigo-500/50' :
                                    current.errorLayer === 'interpretive' ? 'bg-amber-950/80 text-amber-400 border-amber-500/50' :
                                        'bg-emerald-950/80 text-emerald-400 border-emerald-500/50'
                                    }`}>
                                    {current.errorLayer === 'descriptive' ? '📊 描述層出錯' :
                                        current.errorLayer === 'interpretive' ? '🧠 詮釋層出錯' : '🔍 批判層出錯'}
                                </span>
                            </div>
                        )}

                        <div className="flex flex-wrap gap-2 mb-5">
                            {current.tags.map(tag => (
                                <span key={tag} className="bg-slate-900/60 text-amber-500 font-black tracking-widest px-3 py-1.5 rounded-lg text-xs border border-amber-500/30">#{tag}</span>
                            ))}
                        </div>

                        <div className="bg-slate-900/50 p-5 rounded-xl border border-slate-700/50 relative mb-6">
                            <h4 className="absolute -top-3 left-4 bg-slate-800 x-2 py-0.5 rounded text-[10px] font-black tracking-widest text-slate-400 border border-slate-700">DETECTIVE NOTES</h4>
                            <p className="text-amber-100/90 text-[15px] md:text-base font-medium leading-relaxed whitespace-pre-line tracking-wide mt-2">{current.explanation}</p>
                        </div>

                        <div className="text-right">
                            <button onClick={nextCase}
                                className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-black py-4 px-10 rounded-full text-lg tracking-[0.1em] transition-all duration-300 hover:shadow-[0_0_20px_rgba(245,158,11,0.5)] hover:-translate-y-1 relative overflow-hidden group inline-flex items-center gap-2">
                                <span className="absolute inset-0 w-full h-full bg-white/20 -skew-x-12 -translate-x-full group-hover:animate-shimmer"></span>
                                <span className="relative z-10">{currentIdx < caseData.length - 1 ? '調閱下一宗案件' : '查看最終調查報告'}</span>
                                <span className="relative z-10">{currentIdx < caseData.length - 1 ? '➡️' : '📋'}</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
