import React, { useState, useEffect, useRef } from 'react';

// ========== 迷你圖表預覽元件（全部 SVG）==========
// 統一尺寸常數
const SVG_W = 400, SVG_H = 120;
const AXIS_COLOR = '#64748b';   // 深灰色，清晰可見
const AXIS_W = 1.5;             // 軸線粗細
const GRID_COLOR = '#e2e8f0';
const LABEL_COLOR = '#64748b';
const LABEL_SIZE = 9;

const MiniBar = ({ data, color = '#6366f1', axisX, axisY }) => {
    const padL = 30, padR = 20, padT = 18, padB = 22;
    const chartW = SVG_W - padL - padR;
    const chartH = SVG_H - padT - padB;
    const rawMax = Math.max(...data.map(d => d.value));
    const max = rawMax * 1.2;
    const barW = Math.min(50, chartW / data.length * 0.55);
    const gap = chartW / data.length;

    return (
        <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} preserveAspectRatio="xMidYMid meet" className="w-full" style={{ height: '110px' }}>
            {/* Y 軸 */}
            <line x1={padL} y1={padT - 4} x2={padL} y2={padT + chartH} stroke={AXIS_COLOR} strokeWidth={AXIS_W} />
            {/* X 軸 */}
            <line x1={padL} y1={padT + chartH} x2={SVG_W - padR} y2={padT + chartH} stroke={AXIS_COLOR} strokeWidth={AXIS_W} />
            {/* 網格線 */}
            {[0.25, 0.5, 0.75].map((r, i) => (
                <line key={i} x1={padL} y1={padT + chartH * (1 - r)} x2={SVG_W - padR} y2={padT + chartH * (1 - r)}
                    stroke={GRID_COLOR} strokeWidth="0.6" strokeDasharray="4 3" />
            ))}
            {/* 長條 */}
            {data.map((d, i) => {
                const cx = padL + gap * i + gap / 2;
                const h = Math.max(3, (d.value / max) * chartH);
                return (
                    <g key={i}>
                        <rect x={cx - barW / 2} y={padT + chartH - h} width={barW} height={h}
                            fill={color} opacity={0.82} rx={2} />
                        <text x={cx} y={padT + chartH - h - 4} textAnchor="middle" fontSize="9" fill={color} fontWeight="700">{d.value}</text>
                        <text x={cx} y={SVG_H - 5} textAnchor="middle" fontSize={LABEL_SIZE} fill={LABEL_COLOR} fontWeight="500">{d.label}</text>
                    </g>
                );
            })}
            {/* X 軸名稱 */}
            {axisX && <text x={padL + chartW / 2} y={SVG_H - 0} textAnchor="middle" fontSize="8" fill="#94a3b8" fontStyle="italic">{axisX}</text>}
            {/* Y 軸名稱 */}
            {axisY && <text x={6} y={padT + chartH / 2} textAnchor="middle" fontSize="8" fill="#94a3b8" fontStyle="italic" transform={`rotate(-90, 6, ${padT + chartH / 2})`}>{axisY}</text>}
        </svg>
    );
};

const MiniPie = ({ data }) => {
    const total = data.reduce((s, d) => s + d.value, 0);
    let cum = 0;
    const colors = ['#6366f1', '#f43f5e', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];
    const segs = data.map((d, i) => {
        const start = cum;
        cum += (d.value / total) * 360;
        return `${colors[i % colors.length]} ${start}deg ${cum}deg`;
    });
    return (
        <div className="flex items-center justify-center gap-4 py-2">
            <div className="w-20 h-20 rounded-full shadow-sm" style={{ background: `conic-gradient(${segs.join(', ')})` }} />
            <div className="space-y-1">
                {data.map((d, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: colors[i % colors.length] }} />
                        <span className="text-[9px] text-slate-600 font-medium">{d.label} ({Math.round(d.value / total * 100)}%)</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

const MiniLine = ({ data, color = '#6366f1', axisX, axisY }) => {
    const values = data.map(d => d.value);
    const rawMax = Math.max(...values);
    const rawMin = Math.min(...values);
    const diff = rawMax - rawMin || 1;
    const max = rawMax + diff * 0.15;
    const min = Math.max(0, rawMin - diff * 0.15);
    const range = max - min;
    const padL = 30, padR = 20, padT = 12, padB = 22;
    const chartW = SVG_W - padL - padR;
    const chartH = SVG_H - padT - padB;

    const points = data.map((d, i) => ({
        x: padL + (i / Math.max(data.length - 1, 1)) * chartW,
        y: padT + chartH - ((d.value - min) / range) * chartH
    }));
    const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

    return (
        <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} preserveAspectRatio="xMidYMid meet" className="w-full" style={{ height: '110px' }}>
            {/* Y 軸 */}
            <line x1={padL} y1={padT - 4} x2={padL} y2={padT + chartH} stroke={AXIS_COLOR} strokeWidth={AXIS_W} />
            {/* X 軸 */}
            <line x1={padL} y1={padT + chartH} x2={SVG_W - padR} y2={padT + chartH} stroke={AXIS_COLOR} strokeWidth={AXIS_W} />
            {/* 網格線 */}
            {[0.25, 0.5, 0.75].map((r, i) => (
                <line key={i} x1={padL} y1={padT + chartH * (1 - r)} x2={SVG_W - padR} y2={padT + chartH * (1 - r)}
                    stroke={GRID_COLOR} strokeWidth="0.6" strokeDasharray="4 3" />
            ))}
            {/* 填色區域 */}
            <path d={`${pathD} L ${points[points.length - 1].x} ${padT + chartH} L ${points[0].x} ${padT + chartH} Z`}
                fill={color} opacity="0.1" />
            {/* 折線 */}
            <path d={pathD} fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" />
            {/* 資料點 + 標籤 */}
            {points.map((p, i) => (
                <g key={i}>
                    <circle cx={p.x} cy={p.y} r="4" fill="white" stroke={color} strokeWidth="2" />
                    <text x={p.x} y={SVG_H - 5} textAnchor="middle" fontSize={LABEL_SIZE} fill={LABEL_COLOR} fontWeight="500">{data[i].label}</text>
                </g>
            ))}
            {/* X 軸名稱 */}
            {axisX && <text x={padL + chartW / 2} y={SVG_H - 0} textAnchor="middle" fontSize="8" fill="#94a3b8" fontStyle="italic">{axisX}</text>}
            {/* Y 軸名稱 */}
            {axisY && <text x={6} y={padT + chartH / 2} textAnchor="middle" fontSize="8" fill="#94a3b8" fontStyle="italic" transform={`rotate(-90, 6, ${padT + chartH / 2})`}>{axisY}</text>}
        </svg>
    );
};

const MiniScatter = ({ data, color = '#6366f1', axisX, axisY }) => {
    const xs = data.map(d => d.x);
    const ys = data.map(d => d.y);
    const rawXMin = Math.min(...xs), rawXMax = Math.max(...xs);
    const rawYMin = Math.min(...ys), rawYMax = Math.max(...ys);
    const xDiff = rawXMax - rawXMin || 1;
    const yDiff = rawYMax - rawYMin || 1;
    const xMin = rawXMin - xDiff * 0.15, xMax = rawXMax + xDiff * 0.15;
    const yMin = rawYMin - yDiff * 0.15, yMax = rawYMax + yDiff * 0.15;
    const xRange = xMax - xMin;
    const yRange = yMax - yMin;
    const padL = 30, padR = 20, padT = 12, padB = 20;
    const chartW = SVG_W - padL - padR;
    const chartH = SVG_H - padT - padB;

    return (
        <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} preserveAspectRatio="xMidYMid meet" className="w-full" style={{ height: '110px' }}>
            {/* Y 軸 */}
            <line x1={padL} y1={padT - 4} x2={padL} y2={padT + chartH} stroke={AXIS_COLOR} strokeWidth={AXIS_W} />
            {/* X 軸 */}
            <line x1={padL} y1={padT + chartH} x2={SVG_W - padR} y2={padT + chartH} stroke={AXIS_COLOR} strokeWidth={AXIS_W} />
            {/* 網格線 */}
            {[0.25, 0.5, 0.75].map((r, i) => (
                <line key={i} x1={padL} y1={padT + chartH * (1 - r)} x2={SVG_W - padR} y2={padT + chartH * (1 - r)}
                    stroke={GRID_COLOR} strokeWidth="0.6" strokeDasharray="4 3" />
            ))}
            {/* X 軸標籤 */}
            {axisX && <text x={padL + chartW / 2} y={SVG_H - 3} textAnchor="middle" fontSize="8" fill="#94a3b8" fontStyle="italic">{axisX}</text>}
            {/* Y 軸標籤 */}
            {axisY && <text x={6} y={padT + chartH / 2} textAnchor="middle" fontSize="8" fill="#94a3b8" fontStyle="italic" transform={`rotate(-90, 6, ${padT + chartH / 2})`}>{axisY}</text>}
            {/* 散佈點 */}
            {data.map((d, i) => (
                <circle key={i}
                    cx={padL + ((d.x - xMin) / xRange) * chartW}
                    cy={padT + (1 - (d.y - yMin) / yRange) * chartH}
                    r="5" fill={color} opacity="0.6" stroke={color} strokeWidth="1" strokeOpacity="0.3" />
            ))}
        </svg>
    );
};

const MiniStackedBar = ({ data, colors = ['#6366f1', '#f43f5e', '#10b981'], axisX, axisY }) => {
    const padL = 30, padR = 20, padT = 10, padB = 22;
    const chartW = SVG_W - padL - padR;
    const chartH = SVG_H - padT - padB;
    const rawMaxTotal = Math.max(...data.map(d => d.segments.reduce((s, v) => s + v, 0)));
    const maxTotal = rawMaxTotal * 1.2;
    const barW = Math.min(55, chartW / data.length * 0.55);
    const gap = chartW / data.length;

    return (
        <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} preserveAspectRatio="xMidYMid meet" className="w-full" style={{ height: '110px' }}>
            {/* Y 軸 */}
            <line x1={padL} y1={padT - 4} x2={padL} y2={padT + chartH} stroke={AXIS_COLOR} strokeWidth={AXIS_W} />
            {/* X 軸 */}
            <line x1={padL} y1={padT + chartH} x2={SVG_W - padR} y2={padT + chartH} stroke={AXIS_COLOR} strokeWidth={AXIS_W} />
            {/* 網格線 */}
            {[0.25, 0.5, 0.75].map((r, i) => (
                <line key={i} x1={padL} y1={padT + chartH * (1 - r)} x2={SVG_W - padR} y2={padT + chartH * (1 - r)}
                    stroke={GRID_COLOR} strokeWidth="0.6" strokeDasharray="4 3" />
            ))}
            {/* 堆疊長條 */}
            {data.map((d, di) => {
                const cx = padL + gap * di + gap / 2;
                const total = d.segments.reduce((s, v) => s + v, 0);
                const totalH = Math.max(3, (total / maxTotal) * chartH);
                let cumH = 0;
                return (
                    <g key={di}>
                        {d.segments.map((seg, j) => {
                            const segH = (seg / total) * totalH;
                            const y = padT + chartH - cumH - segH;
                            cumH += segH;
                            return <rect key={j} x={cx - barW / 2} y={y} width={barW} height={segH}
                                fill={colors[j % colors.length]} opacity={0.85} />;
                        })}
                        <text x={cx} y={SVG_H - 5} textAnchor="middle" fontSize={LABEL_SIZE} fill={LABEL_COLOR} fontWeight="500">{d.label}</text>
                    </g>
                );
            })}
            {/* X 軸名稱 */}
            {axisX && <text x={padL + chartW / 2} y={SVG_H - 0} textAnchor="middle" fontSize="8" fill="#94a3b8" fontStyle="italic">{axisX}</text>}
            {/* Y 軸名稱 */}
            {axisY && <text x={6} y={padT + chartH / 2} textAnchor="middle" fontSize="8" fill="#94a3b8" fontStyle="italic" transform={`rotate(-90, 6, ${padT + chartH / 2})`}>{axisY}</text>}
        </svg>
    );
};

const MiniHistogram = ({ data, color = '#6366f1', axisX, axisY }) => {
    const padL = 30, padR = 10, padT = 10, padB = 22;
    const chartW = SVG_W - padL - padR;
    const chartH = SVG_H - padT - padB;
    const rawMax = Math.max(...data.map(d => d.value));
    const max = rawMax * 1.2;
    const barW = chartW / data.length;

    return (
        <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} preserveAspectRatio="xMidYMid meet" className="w-full" style={{ height: '110px' }}>
            {/* Y 軸 */}
            <line x1={padL} y1={padT - 4} x2={padL} y2={padT + chartH} stroke={AXIS_COLOR} strokeWidth={AXIS_W} />
            {/* X 軸 */}
            <line x1={padL} y1={padT + chartH} x2={SVG_W - padR} y2={padT + chartH} stroke={AXIS_COLOR} strokeWidth={AXIS_W} />
            {/* 網格線 */}
            {[0.25, 0.5, 0.75].map((r, i) => (
                <line key={i} x1={padL} y1={padT + chartH * (1 - r)} x2={SVG_W - padR} y2={padT + chartH * (1 - r)}
                    stroke={GRID_COLOR} strokeWidth="0.6" strokeDasharray="4 3" />
            ))}
            {/* 直方柱 */}
            {data.map((d, i) => {
                const h = Math.max(2, (d.value / max) * chartH);
                const x = padL + barW * i;
                return (
                    <g key={i}>
                        <rect x={x + 0.5} y={padT + chartH - h} width={barW - 1} height={h}
                            fill={color} opacity={0.7} />
                        <text x={x + barW / 2} y={SVG_H - 5} textAnchor="middle" fontSize="7" fill={LABEL_COLOR}>{d.label}</text>
                    </g>
                );
            })}
            {/* X 軸名稱 */}
            {axisX && <text x={padL + chartW / 2} y={SVG_H - 0} textAnchor="middle" fontSize="8" fill="#94a3b8" fontStyle="italic">{axisX}</text>}
            {/* Y 軸名稱 */}
            {axisY && <text x={6} y={padT + chartH / 2} textAnchor="middle" fontSize="8" fill="#94a3b8" fontStyle="italic" transform={`rotate(-90, 6, ${padT + chartH / 2})`}>{axisY}</text>}
        </svg>
    );
};

// ========== 圖表類型定義 ==========
const chartTypes = {
    bar: { name: '長條圖', icon: '📊', desc: '比較不同類別的數值大小' },
    pie: { name: '圓餅圖', icon: '🥧', desc: '顯示各部分佔整體的比例' },
    line: { name: '折線圖', icon: '📈', desc: '呈現隨時間的變化趨勢' },
    scatter: { name: '散佈圖', icon: '🔵', desc: '探索兩個數值變項的關係' },
    stacked: { name: '堆疊長條圖', icon: '📊', desc: '跨組別比較內含子分類' },
    histogram: { name: '直方圖', icon: '📐', desc: '呈現連續數據的分佈' }
};

// ========== 題目資料庫（10 題）==========
const questions = [
    {
        id: 1,
        scenario: "你調查了全校 500 位學生「最喜歡的社團類型」（運動、藝術、學術、服務、其他），想呈現各類型的佔比分佈。",
        dataHint: "分類資料 → 佔比",
        options: ['bar', 'pie', 'line', 'scatter'],
        best: 'pie',
        acceptable: ['bar'],
        bestReason: "圓餅圖最能直觀呈現「部分佔整體」的比例關係，一眼就能看出哪個類型最受歡迎。",
        acceptableReason: "長條圖也可以比較各類型人數，但不如圓餅圖直觀地呈現佔比。",
        wrongReason: "折線圖用於時間序列、散佈圖用於兩個數值變項，都不適合分類佔比資料。",
        previewData: { type: 'pie', data: [{ label: '運動', value: 35 }, { label: '藝術', value: 22 }, { label: '學術', value: 18 }, { label: '服務', value: 15 }, { label: '其他', value: 10 }], axisX: '社團類型', axisY: '人數' }
    },
    {
        id: 2,
        scenario: "你記錄了某班學生過去 6 次段考的平均分數，想觀察成績是否有進步的趨勢。",
        dataHint: "時間序列 → 趨勢",
        options: ['bar', 'line', 'pie', 'histogram'],
        best: 'line',
        acceptable: ['bar'],
        bestReason: "折線圖是呈現「隨時間變化的趨勢」的最佳選擇，能清楚看出上升、下降或波動。",
        acceptableReason: "長條圖可以比較各次考試的分數，但無法像折線圖一樣順暢呈現變化趨勢。",
        wrongReason: "圓餅圖用於佔比、直方圖用於分佈，都無法呈現時間變化趨勢。",
        previewData: { type: 'line', data: [{ label: '第1次', value: 68 }, { label: '第2次', value: 72 }, { label: '第3次', value: 70 }, { label: '第4次', value: 75 }, { label: '第5次', value: 78 }, { label: '第6次', value: 80 }], axisX: '段考次數', axisY: '平均分數' }
    },
    {
        id: 3,
        scenario: "你想了解「每天滑手機時間」和「睡眠品質分數」之間是否有關聯，收集了 150 位學生的數據。",
        dataHint: "兩個連續變項 → 相關性",
        options: ['scatter', 'bar', 'line', 'pie'],
        best: 'scatter',
        acceptable: [],
        bestReason: "散佈圖是探索兩個連續變項之間關係（正相關、負相關、無相關）的唯一合適圖表。每個點代表一位學生。",
        acceptableReason: "",
        wrongReason: "長條圖無法同時呈現兩個連續變項；折線圖需要有序的 X 軸（如時間）；圓餅圖完全不適用。",
        previewData: { type: 'scatter', data: [{ x: 1, y: 85 }, { x: 2, y: 78 }, { x: 2.5, y: 72 }, { x: 3, y: 70 }, { x: 3.5, y: 65 }, { x: 4, y: 58 }, { x: 4.5, y: 55 }, { x: 5, y: 50 }, { x: 1.5, y: 80 }, { x: 3, y: 68 }, { x: 2, y: 82 }, { x: 4, y: 62 }], axisX: '滑手機時間(hr)', axisY: '睡眠品質' }
    },
    {
        id: 4,
        scenario: "你對三個年級各抽樣 100 人，調查他們選擇「國文/英文/數學」作為最喜歡科目的比例，想同時比較各年級的選擇差異。",
        dataHint: "多組 × 多分類 → 跨組比較",
        options: ['stacked', 'pie', 'bar', 'line'],
        best: 'stacked',
        acceptable: ['bar'],
        bestReason: "堆疊長條圖能同時顯示每個年級的總量，也能看到各科目佔各年級的比例差異，一目了然。",
        acceptableReason: "分組長條圖也可以比較，但不如堆疊長條圖直觀地看到各年級內部的佔比變化。",
        wrongReason: "圓餅圖需要分成三張（各年級一張），不方便比較；折線圖不適合分類資料的跨組比較。",
        previewData: { type: 'stacked', data: [{ label: '高一', segments: [40, 35, 25] }, { label: '高二', segments: [30, 38, 32] }, { label: '高三', segments: [25, 28, 47] }], axisX: '年級', axisY: '人數' }
    },
    {
        id: 5,
        scenario: "你收集了全校 300 位學生的身高數據，想看身高是否呈現常態分佈。",
        dataHint: "一組連續數據 → 分佈形狀",
        options: ['histogram', 'bar', 'scatter', 'pie'],
        best: 'histogram',
        acceptable: [],
        bestReason: "直方圖專門用來呈現連續數據的「分佈形狀」，能一眼看出數據是否集中、對稱、偏態。",
        acceptableReason: "",
        wrongReason: "長條圖用於比較不同類別而非連續區間；散佈圖需要兩個變項；圓餅圖完全不適合。",
        previewData: { type: 'histogram', data: [{ label: '<155', value: 12 }, { label: '155-160', value: 35 }, { label: '160-165', value: 68 }, { label: '165-170', value: 92 }, { label: '170-175', value: 55 }, { label: '175-180', value: 28 }, { label: '>180', value: 10 }], axisX: '身高(cm)', axisY: '人數' }
    },
    {
        id: 6,
        scenario: "你比較男生和女生在「每週運動次數」的差異，各蒐集 80 份問卷，想比較兩組的平均值。",
        dataHint: "兩組 → 比較平均值",
        options: ['bar', 'pie', 'line', 'scatter'],
        best: 'bar',
        acceptable: [],
        bestReason: "長條圖最適合比較兩個（或少數幾個）類別的數值大小，簡潔明瞭。",
        acceptableReason: "",
        wrongReason: "圓餅圖無法比較兩組的平均值；折線圖需要時間軸；散佈圖需要兩個連續變項。",
        previewData: { type: 'bar', data: [{ label: '男生', value: 3.2 }, { label: '女生', value: 2.5 }], color: '#6366f1', axisX: '性別', axisY: '每週運動次數' }
    },
    {
        id: 7,
        scenario: "你追蹤一間飲料店的每日營業額，記錄了一個月（30 天）的銷售數據，想看哪些天生意特別好或特別差。",
        dataHint: "每日數據 → 時間趨勢 + 波動",
        options: ['line', 'bar', 'histogram', 'pie'],
        best: 'line',
        acceptable: ['bar'],
        bestReason: "30 天的每日數據用折線圖最清楚，能看出趨勢、波動和異常值（如週末高峰）。",
        acceptableReason: "長條圖可以顯示每天的數值，但 30 根長條會很擁擠，不如折線圖一目了然。",
        wrongReason: "直方圖是看「營業額的分佈」，不是每天的變化；圓餅圖完全不適用。",
        previewData: { type: 'line', data: [{ label: 'D1', value: 1200 }, { label: 'D5', value: 1500 }, { label: 'D10', value: 1100 }, { label: 'D15', value: 1800 }, { label: 'D20', value: 2200 }, { label: 'D25', value: 1600 }, { label: 'D30', value: 1900 }], axisX: '日期', axisY: '營業額(元)' }
    },
    {
        id: 8,
        scenario: "你想呈現班費的支出結構：印刷佔 30%、活動佔 40%、材料佔 20%、其他佔 10%。",
        dataHint: "佔比結構 → 整體=100%",
        options: ['pie', 'bar', 'stacked', 'line'],
        best: 'pie',
        acceptable: ['bar'],
        bestReason: "圓餅圖最適合呈現「各項佔總預算的比例」，能直覺地看出每項支出的大小。",
        acceptableReason: "長條圖也可以比較各項金額，但圓餅圖更直覺地呈現「整體 = 100%」的概念。",
        wrongReason: "堆疊長條圖是比較多組資料時用的；折線圖適合時間序列，不適合比例呈現。",
        previewData: { type: 'pie', data: [{ label: '活動', value: 40 }, { label: '印刷', value: 30 }, { label: '材料', value: 20 }, { label: '其他', value: 10 }], axisX: '支出項目', axisY: '百分比' }
    },
    {
        id: 9,
        scenario: "你收集了不同國家的「教育支出佔 GDP 比例」和「國民平均壽命」，想看兩者是否有關聯。",
        dataHint: "兩個連續變項 → 跨國比較",
        options: ['scatter', 'line', 'bar', 'stacked'],
        best: 'scatter',
        acceptable: [],
        bestReason: "兩個連續變項的關聯性用散佈圖最合適，每個點代表一個國家，能直觀看出是否有正/負相關。",
        acceptableReason: "",
        wrongReason: "折線圖不適合（沒有時間軸）、長條圖只能呈現一個變項、堆疊長條圖不適合兩個連續變項。",
        previewData: { type: 'scatter', data: [{ x: 3.5, y: 68 }, { x: 4.2, y: 72 }, { x: 5.0, y: 75 }, { x: 5.5, y: 78 }, { x: 6.0, y: 80 }, { x: 6.5, y: 82 }, { x: 7.0, y: 81 }, { x: 4.8, y: 74 }, { x: 5.8, y: 79 }, { x: 3.8, y: 70 }], axisX: '教育支出(%GDP)', axisY: '平均壽命(歲)' }
    },
    {
        id: 10,
        scenario: "🔥 綜合魔王：你調查了三個班級各 40 人的「學習風格偏好」（視覺型、聽覺型、動覺型），想同時比較各班的偏好差異，並看出每班內部的比例組成。",
        dataHint: "多組 × 多分類 → 組間比較 + 內部結構",
        options: ['stacked', 'bar', 'pie', 'histogram'],
        best: 'stacked',
        acceptable: ['bar'],
        bestReason: "堆疊長條圖能同時呈現各班的整體人數和各學習風格的佔比差異，是唯一能一張圖搞定「組間比較 + 內部結構」的圖表。",
        acceptableReason: "分組長條圖可以比較各班各學習風格的人數，但無法像堆疊圖一樣看到比例組成。",
        wrongReason: "圓餅圖要畫三張才能比較，而且無法放在同一張圖上比較；直方圖用於連續數據分佈，完全不適合。",
        previewData: { type: 'stacked', data: [{ label: '甲班', segments: [18, 12, 10] }, { label: '乙班', segments: [10, 20, 10] }, { label: '丙班', segments: [14, 8, 18] }], axisX: '班級', axisY: '人數' }
    }
];

// ========== 渲染迷你圖表預覽 ==========
const renderPreview = (preview) => {
    const { axisX, axisY } = preview;
    switch (preview.type) {
        case 'bar':
            return <MiniBar data={preview.data} color={preview.color || '#6366f1'} axisX={axisX} axisY={axisY} />;
        case 'pie':
            return <MiniPie data={preview.data} />;
        case 'line':
            return <MiniLine data={preview.data} axisX={axisX} axisY={axisY} />;
        case 'scatter':
            return <MiniScatter data={preview.data} axisX={axisX} axisY={axisY} />;
        case 'stacked':
            return <MiniStackedBar data={preview.data} axisX={axisX} axisY={axisY} />;
        case 'histogram':
            return <MiniHistogram data={preview.data} axisX={axisX} axisY={axisY} />;
        default:
            return null;
    }
};

// ========== Juice 動畫樣式注入 ==========
const injectMatcherStyles = () => {
    const id = 'chart-matcher-styles';
    if (document.getElementById(id)) return;
    const style = document.createElement('style');
    style.id = id;
    style.textContent = `
        @keyframes matcher-shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        @keyframes matcher-pop {
            0% { transform: scale(0.8); opacity: 0; }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); opacity: 1; }
        }
        @keyframes combo-fire {
            0% { transform: scale(1); }
            50% { transform: scale(1.3); }
            100% { transform: scale(1); }
        }
        @keyframes confetti-fall {
            0% { transform: translateY(-10px) rotate(0deg); opacity: 1; }
            100% { transform: translateY(60px) rotate(360deg); opacity: 0; }
        }
        .matcher-confetti-container {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            pointer-events: none;
            overflow: hidden;
            z-index: 50;
        }
        .matcher-confetti-piece {
            position: absolute;
            width: 8px;
            height: 8px;
            border-radius: 2px;
            animation: confetti-fall 1.5s ease-out forwards;
        }
    `;
    document.head.appendChild(style);
};

// ========== Confetti 元件 ==========
const Confetti = ({ show }) => {
    if (!show) return null;
    const colors = ['#6366f1', '#f43f5e', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];
    const pieces = Array.from({ length: 30 }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        delay: `${Math.random() * 0.5}s`,
        color: colors[i % colors.length],
        size: 6 + Math.random() * 6,
        rotation: Math.random() * 360
    }));
    return (
        <div className="matcher-confetti-container">
            {pieces.map(p => (
                <div key={p.id} className="matcher-confetti-piece" style={{
                    left: p.left,
                    top: `${Math.random() * 40}%`,
                    backgroundColor: p.color,
                    width: `${p.size}px`,
                    height: `${p.size}px`,
                    animationDelay: p.delay,
                    transform: `rotate(${p.rotation}deg)`
                }} />
            ))}
        </div>
    );
};

// ========== 遊戲主元件 ==========
export const ChartMatcherGame = () => {
    const [gameState, setGameState] = useState('start');
    const [currentIdx, setCurrentIdx] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [answerResult, setAnswerResult] = useState(null);
    const [results, setResults] = useState([]);
    // Juice states
    const [combo, setCombo] = useState(0);
    const [maxCombo, setMaxCombo] = useState(0);
    const [showConfetti, setShowConfetti] = useState(false);
    const [shakeCard, setShakeCard] = useState(false);
    const [comboAnim, setComboAnim] = useState(false);

    useEffect(() => { injectMatcherStyles(); }, []);

    const startGame = () => {
        setCurrentIdx(0);
        setScore(0);
        setSelectedAnswer(null);
        setAnswerResult(null);
        setResults([]);
        setCombo(0);
        setMaxCombo(0);
        setShowConfetti(false);
        setShakeCard(false);
        setGameState('playing');
    };

    const handleAnswer = (chartType) => {
        if (selectedAnswer) return;
        setSelectedAnswer(chartType);
        const q = questions[currentIdx];
        let result;
        if (chartType === q.best) {
            result = 'best';
            const newCombo = combo + 1;
            setCombo(newCombo);
            setMaxCombo(m => Math.max(m, newCombo));
            // Combo bonus: 3連擊+1, 5連擊+2
            let bonus = 3;
            if (newCombo >= 5) bonus = 5;
            else if (newCombo >= 3) bonus = 4;
            setScore(s => s + bonus);
            // Confetti!
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 1500);
            // Combo animation
            setComboAnim(true);
            setTimeout(() => setComboAnim(false), 600);
        } else if (q.acceptable.includes(chartType)) {
            result = 'acceptable';
            setScore(s => s + 1);
            setCombo(0); // 斷 combo
        } else {
            result = 'wrong';
            setCombo(0); // 斷 combo
            // Shake!
            setShakeCard(true);
            setTimeout(() => setShakeCard(false), 500);
        }
        setAnswerResult(result);
        setResults(prev => [...prev, { question: q, chosen: chartType, result }]);
    };

    const nextQuestion = () => {
        if (currentIdx < questions.length - 1) {
            setCurrentIdx(i => i + 1);
            setSelectedAnswer(null);
            setAnswerResult(null);
            setShakeCard(false);
        } else {
            setGameState('end');
        }
    };

    // ================= START SCREEN =================
    if (gameState === 'start') {
        return (
            <div className="bg-gradient-to-br from-violet-50 to-pink-50 rounded-xl overflow-hidden flex flex-col items-center justify-center p-6 md:py-16 font-sans min-h-[600px]">
                <div className="bg-white p-8 md:p-12 rounded-2xl shadow-xl max-w-xl w-full text-center border-t-8 border-violet-400 relative overflow-hidden">
                    <div className="absolute top-0 right-0 opacity-5 text-9xl -mt-4 -mr-4">🎨</div>
                    <div className="text-7xl mb-6">🎨</div>
                    <h1 className="text-3xl md:text-5xl font-black text-violet-600 mb-4 tracking-wide">圖表配對師</h1>
                    <h2 className="text-xl md:text-2xl font-bold text-slate-500 mb-6 border-b border-slate-200 pb-4">你會選什麼圖？</h2>
                    <p className="text-slate-500 text-lg mb-6 font-medium leading-relaxed">
                        10 個研究情境，<br />
                        你能幫數據找到<span className="text-violet-600 font-bold">最適合的圖表</span>嗎？
                    </p>

                    <div className="bg-violet-50 rounded-xl p-4 mb-6 text-left border border-violet-200">
                        <h3 className="text-sm font-bold text-violet-400 mb-3 tracking-wider">📋 計分規則</h3>
                        <div className="space-y-2 text-sm text-slate-600">
                            <p>🎯 選到<strong className="text-violet-600">最佳圖表</strong> → <strong className="text-violet-600">+3 分</strong></p>
                            <p>👍 選到<strong className="text-amber-600">可接受圖表</strong> → <strong className="text-amber-600">+1 分</strong></p>
                            <p>❌ 選到<strong className="text-rose-500">不適合的圖表</strong> → <strong className="text-rose-500">+0 分</strong></p>
                        </div>
                    </div>

                    <div className="bg-slate-50 rounded-xl p-4 mb-8 border border-slate-200">
                        <h3 className="text-sm font-bold text-slate-400 mb-3 tracking-wider">📊 涵蓋的圖表類型</h3>
                        <div className="grid grid-cols-2 gap-2 text-sm text-slate-600">
                            {Object.values(chartTypes).map((ct, i) => (
                                <div key={i} className="flex items-center gap-1.5">
                                    <span>{ct.icon}</span>
                                    <span className="font-medium">{ct.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={startGame}
                        className="bg-violet-500 hover:bg-violet-600 text-white font-black py-4 px-10 rounded-full text-xl transition transform hover:scale-105 shadow-lg active:scale-95"
                    >
                        開始配對 🎨
                    </button>
                </div>
            </div>
        );
    }

    // ================= END SCREEN =================
    if (gameState === 'end') {
        const maxScore = questions.length * 3;
        const percentage = Math.round((score / maxScore) * 100);
        let title = "";
        let color = "";
        if (percentage >= 90) { title = "🏆 圖表大師！"; color = "text-amber-500"; }
        else if (percentage >= 70) { title = "📊 資深配對師！"; color = "text-violet-600"; }
        else if (percentage >= 50) { title = "🎨 實習設計師！"; color = "text-emerald-600"; }
        else { title = "📉 圖表迷路了！再練練！"; color = "text-rose-500"; }

        const missedOrWeak = results.filter(r => r.result !== 'best');

        return (
            <div className="bg-gradient-to-br from-violet-50 to-pink-50 rounded-xl overflow-hidden flex flex-col items-center justify-center p-6 md:py-10 font-sans min-h-[600px]">
                <div className="bg-white p-8 rounded-2xl shadow-xl max-w-2xl w-full text-center border-t-8 border-violet-400">
                    <h1 className="text-3xl font-bold text-slate-400 mb-4 tracking-widest">配對報告</h1>
                    <div className="text-6xl font-black mb-2 text-violet-500">
                        {score} <span className="text-2xl text-slate-300">/ {maxScore}</span>
                    </div>
                    <p className="text-slate-400 mb-2">（{percentage}%）</p>
                    {maxCombo >= 3 && (
                        <p className="text-amber-500 font-bold mb-2">🔥 最高連續答對：{maxCombo} 連擊！</p>
                    )}
                    <h2 className={`text-3xl font-black mb-6 ${color}`}>{title}</h2>

                    <button
                        onClick={startGame}
                        className="bg-violet-100 hover:bg-violet-200 text-violet-600 font-bold py-3 px-8 rounded-full text-lg transition transform hover:scale-105 shadow-sm mb-8 border border-violet-200"
                    >
                        重新配對 🔄
                    </button>

                    {missedOrWeak.length > 0 && (
                        <div className="text-left bg-amber-50 p-6 rounded-xl border-l-8 border-amber-400 max-h-96 overflow-y-auto">
                            <h3 className="text-xl font-black mb-4 text-slate-700">📋 可加強的題目</h3>
                            <div className="space-y-4">
                                {missedOrWeak.map((r, i) => (
                                    <div key={i} className="bg-white p-4 rounded-lg border border-amber-200 shadow-sm">
                                        <p className="font-bold text-slate-700 mb-1 text-sm">Q{r.question.id}. {r.question.scenario.slice(0, 50)}...</p>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${r.result === 'acceptable' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-600'}`}>
                                                你選：{chartTypes[r.chosen].icon} {chartTypes[r.chosen].name}
                                                {r.result === 'acceptable' ? '（可接受）' : '（不適合）'}
                                            </span>
                                            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-violet-100 text-violet-600">
                                                最佳：{chartTypes[r.question.best].icon} {chartTypes[r.question.best].name}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {missedOrWeak.length === 0 && (
                        <div className="bg-emerald-50 text-emerald-700 border border-emerald-200 p-4 rounded-xl font-bold text-lg">
                            全部最佳配對！你是圖表大師！ 🎉
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // ================= PLAYING SCREEN =================
    const q = questions[currentIdx];
    if (!q) return null;
    const isBoss = q.scenario.includes('🔥');

    return (
        <div className="bg-gradient-to-br from-violet-50 to-pink-50 rounded-xl overflow-hidden flex flex-col items-center p-4 md:p-8 font-sans min-h-[600px]">
            <div className="max-w-4xl w-full">

                {/* Progress */}
                <div className="flex justify-between items-center mb-6 px-2">
                    <div className="bg-white text-violet-600 font-bold px-5 py-2 rounded-full shadow-sm text-lg border border-violet-200">
                        第 {currentIdx + 1} / {questions.length} 題
                    </div>
                    <div className="flex items-center gap-3">
                        {/* Combo indicator */}
                        {combo >= 2 && (
                            <div className="bg-amber-100 text-amber-700 font-black px-4 py-2 rounded-full shadow-sm text-lg border border-amber-300"
                                style={{ animation: comboAnim ? 'combo-fire 0.5s ease-out' : 'none' }}>
                                🔥 x{combo}
                                {combo >= 5 && ' 超神！'}
                                {combo >= 3 && combo < 5 && ' 火力全開！'}
                            </div>
                        )}
                        <div className="bg-white text-emerald-600 font-bold px-5 py-2 rounded-full shadow-sm text-lg border border-emerald-200">
                            {score} 分
                        </div>
                    </div>
                </div>

                {/* Question Card */}
                <div
                    className={`bg-white p-6 md:p-8 rounded-2xl shadow-lg mb-6 border-l-8 transition-all relative overflow-hidden ${isBoss ? 'border-purple-400 shadow-purple-100' : 'border-violet-400'}`}
                    style={{ animation: shakeCard ? 'matcher-shake 0.5s ease-in-out' : 'none' }}
                >
                    {/* Confetti */}
                    <Confetti show={showConfetti} />
                    {isBoss && (
                        <div className="absolute top-0 right-0 bg-purple-500 text-white text-xs font-black px-4 py-1 rounded-bl-lg tracking-widest animate-pulse">
                            🔥 魔王題
                        </div>
                    )}

                    <div className="flex items-start gap-3 mb-4">
                        <span className="text-3xl">📋</span>
                        <div>
                            <h2 className="text-lg font-bold text-slate-800 leading-relaxed">{q.scenario}</h2>
                            <p className="text-xs text-slate-400 mt-2 bg-slate-50 inline-block px-3 py-1 rounded-full border border-slate-200">
                                💡 提示：{q.dataHint}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Options */}
                {!selectedAnswer && (
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        {q.options.map(opt => (
                            <button key={opt} onClick={() => handleAnswer(opt)}
                                className="bg-white hover:bg-violet-50 border-2 border-slate-200 hover:border-violet-400 rounded-xl p-5 text-center transition-all hover:shadow-lg hover:-translate-y-1 group">
                                <div className="text-4xl mb-2">{chartTypes[opt].icon}</div>
                                <div className="text-lg font-black text-slate-700 group-hover:text-violet-600">{chartTypes[opt].name}</div>
                                <div className="text-xs text-slate-400 mt-1">{chartTypes[opt].desc}</div>
                            </button>
                        ))}
                    </div>
                )}

                {/* Answered: Show result + chart options with badges */}
                {selectedAnswer && (
                    <>
                        {/* Options with result badges */}
                        <div className="grid grid-cols-2 gap-3 mb-4">
                            {q.options.map(opt => {
                                let borderColor = 'border-slate-200';
                                let bg = 'bg-white';
                                let badge = null;

                                if (opt === q.best) {
                                    borderColor = 'border-violet-400';
                                    bg = 'bg-violet-50';
                                    badge = <span className="absolute -top-2 -right-2 bg-violet-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow">🎯 最佳</span>;
                                } else if (q.acceptable.includes(opt)) {
                                    borderColor = 'border-amber-300';
                                    bg = 'bg-amber-50';
                                    badge = <span className="absolute -top-2 -right-2 bg-amber-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow">👍 可接受</span>;
                                } else {
                                    borderColor = 'border-rose-200';
                                    bg = 'bg-rose-50';
                                    badge = <span className="absolute -top-2 -right-2 bg-rose-400 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow">❌ 不適合</span>;
                                }

                                const isSelected = opt === selectedAnswer;

                                return (
                                    <div key={opt} className={`relative ${bg} border-2 ${borderColor} rounded-xl p-3 text-center ${isSelected ? 'ring-2 ring-offset-2 ring-violet-500' : ''}`}>
                                        {badge}
                                        <div className="text-2xl mb-1">{chartTypes[opt].icon}</div>
                                        <div className="text-sm font-bold text-slate-700">{chartTypes[opt].name}</div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Feedback */}
                        <div className={`p-6 rounded-2xl shadow-lg mb-6 border-l-8 ${answerResult === 'best' ? 'bg-violet-50 border-violet-400' :
                            answerResult === 'acceptable' ? 'bg-amber-50 border-amber-400' :
                                'bg-rose-50 border-rose-400'
                            }`}>
                            <h3 className={`text-xl font-black mb-3 ${answerResult === 'best' ? 'text-violet-700' :
                                answerResult === 'acceptable' ? 'text-amber-700' :
                                    'text-rose-600'
                                }`}
                                style={{ animation: 'matcher-pop 0.4s ease-out' }}
                            >
                                {answerResult === 'best' && (combo >= 3 ? `🔥 完美配對！x${combo} Combo！+${combo >= 5 ? 5 : 4} 分` : '🎯 完美配對！+3 分')}
                                {answerResult === 'acceptable' && '👍 不錯，但有更好的選擇！+1 分'}
                                {answerResult === 'wrong' && '❌ 這張圖不太適合！+0 分'}
                            </h3>

                            {/* Best reason */}
                            <div className="mb-3">
                                <p className="text-sm font-bold text-violet-600 mb-1">🎯 為什麼 {chartTypes[q.best].name} 是最佳？</p>
                                <p className="text-slate-600 text-sm leading-relaxed">{q.bestReason}</p>
                            </div>

                            {/* Acceptable reason */}
                            {q.acceptable.length > 0 && q.acceptableReason && (
                                <div className="mb-3">
                                    <p className="text-sm font-bold text-amber-600 mb-1">👍 {q.acceptable.map(a => chartTypes[a].name).join('、')} 為什麼可接受？</p>
                                    <p className="text-slate-600 text-sm leading-relaxed">{q.acceptableReason}</p>
                                </div>
                            )}

                            {/* Wrong reason */}
                            <div className="mb-4">
                                <p className="text-sm font-bold text-rose-500 mb-1">❌ 其他選項為什麼不行？</p>
                                <p className="text-slate-600 text-sm leading-relaxed">{q.wrongReason}</p>
                            </div>

                            {/* Chart Preview */}
                            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                                <p className="text-xs font-bold text-slate-400 mb-2 tracking-wider">📊 最佳圖表預覽：{chartTypes[q.best].icon} {chartTypes[q.best].name}</p>
                                {renderPreview(q.previewData)}
                            </div>

                            <div className="text-right mt-4">
                                <button
                                    onClick={nextQuestion}
                                    className="bg-violet-500 hover:bg-violet-600 text-white font-black py-3 px-10 rounded-full text-xl transition transform hover:scale-105 shadow-lg"
                                >
                                    {currentIdx < questions.length - 1 ? '下一題 ➡️' : '查看配對報告 📋'}
                                </button>
                            </div>
                        </div>
                    </>
                )}

            </div>
        </div>
    );
};
