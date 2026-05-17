import React, { useState } from 'react';
import { BarChart3 } from 'lucide-react';

/**
 * W14 選圖引導卡（靜態流程引導，不填網頁）
 * - 點選圖表類型查看說明與對應軸提示
 * - 引導去 Google Slides 記錄選圖決策
 * - 圓餅圖無 XY 軸，自動換成「類別 / 比例」
 */

const CHART_TYPES = [
    {
        id: 'bar',
        label: '長條圖',
        use: '比較不同類別的數值（有 / 沒有、高 / 中 / 低分組對比）',
        axes: { x: '橫軸：類別（如：高 / 中 / 低手機使用組）', y: '縱軸：數值（如：平均段考成績）' },
    },
    {
        id: 'scatter',
        label: '散佈圖',
        use: '看兩個連續變項的關聯（X 與 Y 是否一起變動）',
        axes: { x: '橫軸：一個連續變項（如：每日手機使用時數）', y: '縱軸：另一個連續變項（如：段考成績）' },
    },
    {
        id: 'line',
        label: '折線圖',
        use: '看時間序列趨勢（每天、每週的變化）',
        axes: { x: '橫軸：時間單位（如：第 1 週 / 第 2 週…）', y: '縱軸：你在追蹤的數值' },
    },
    {
        id: 'pie',
        label: '圓餅圖',
        use: '看組成比例（各類別佔總體的百分比）',
        axes: { x: '類別：有哪幾種選項？（加總必須 = 100%）', y: '比例：每個類別佔幾%？' },
        noPie: true,
    },
    {
        id: 'mixed',
        label: '混合圖',
        use: '同一張圖看兩個不同尺度的指標（左軸 / 右軸）',
        axes: { x: '橫軸：共用的類別或時間軸', y: '左軸 / 右軸：兩個不同單位的指標' },
    },
];

export const ChartChoiceChecker = () => {
    const [selected, setSelected] = useState(null);
    const chart = CHART_TYPES.find(t => t.id === selected);

    return (
        <div className="rounded-[var(--radius-unified)] border-2 border-[#C4B5FD] bg-[#F5F3FF] p-4 flex flex-col gap-4">
            <div className="flex items-center gap-2">
                <BarChart3 size={18} className="text-[#7C3AED]" />
                <p className="font-bold text-[13.5px] text-[#7C3AED] m-0">選圖引導</p>
            </div>

            {/* 五種圖選擇 */}
            <div>
                <p className="text-[12px] text-[#5B21B6] font-bold mb-2">① 點一種圖，看它適合什麼情況</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    {CHART_TYPES.map(t => (
                        <button
                            key={t.id}
                            onClick={() => setSelected(selected === t.id ? null : t.id)}
                            className={`text-left p-2.5 rounded border-2 text-[12px] leading-[1.7] transition-colors ${
                                selected === t.id
                                    ? 'bg-[#7C3AED] text-white border-[#6D28D9]'
                                    : 'bg-white text-[var(--ink)] border-[#C4B5FD] hover:bg-[#EDE9FE]'
                            }`}
                        >
                            <p className="font-bold m-0 mb-0.5">{t.label}</p>
                            <p className="text-[10.5px] m-0 opacity-90">{t.use}</p>
                        </button>
                    ))}
                </div>
            </div>

            {/* 選了之後：顯示軸的說明 */}
            {chart && (
                <div className="rounded border-2 border-[#7C3AED] bg-white p-3 flex flex-col gap-2">
                    <p className="font-bold text-[12.5px] text-[#7C3AED] m-0">
                        {chart.label}　的軸怎麼設定？
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <div className="bg-[#F5F3FF] rounded p-2">
                            <p className="text-[10px] font-bold text-[#7C3AED] uppercase tracking-wider mb-1">
                                {chart.noPie ? '類別' : '② 橫軸 X'}
                            </p>
                            <p className="text-[12px] text-[#4C1D95] leading-relaxed m-0">{chart.axes.x}</p>
                        </div>
                        <div className="bg-[#F5F3FF] rounded p-2">
                            <p className="text-[10px] font-bold text-[#7C3AED] uppercase tracking-wider mb-1">
                                {chart.noPie ? '比例' : '③ 縱軸 Y'}
                            </p>
                            <p className="text-[12px] text-[#4C1D95] leading-relaxed m-0">{chart.axes.y}</p>
                        </div>
                    </div>
                    {chart.noPie && (
                        <p className="text-[11px] text-[#DC2626] bg-[#FEF2F2] rounded px-2 py-1 m-0">
                            ⚠️ 圓餅圖沒有 XY 軸——各類別加總必須等於 100%，否則不能用圓餅圖。
                        </p>
                    )}
                </div>
            )}

            {/* 去 Google Slides 記錄 */}
            <div className="rounded border border-[#BAE6FD] bg-[#F0F9FF] px-3 py-2.5">
                <p className="text-[12px] text-[#0369A1] leading-relaxed m-0">
                    🖊️ 決定好後，把以下三件事記在<strong>小組 Google Slides / Doc</strong>：<br />
                    <span className="text-[11.5px]">① 選哪種圖　② 橫縱軸（或類別 / 比例）各放什麼　③ 為什麼選這種圖（一句話）</span>
                </p>
            </div>
        </div>
    );
};

export default ChartChoiceChecker;
