import React, { useState, useEffect } from 'react';
import { BarChart3, Eye, Bot, CheckCircle2 } from 'lucide-react';

/**
 * W14 選圖判斷檢核卡 — 學生先選圖+寫理由 → AI 助理可幫檢核 → 人定案
 *
 * 教學重點：
 *   - W14 不是教「會用工具畫圖」，是教「會選對的圖呈現資料」
 *   - 學生不會用試算表沒關係，可以給 Gemini AI canvas 畫
 *   - 但選圖判斷必須學生自己做（不能 prompt「幫我選最適合的圖」）
 *
 * Props:
 * - dataKey：localStorage 儲存鍵
 */

const CHART_TYPES = [
    { id: 'scatter', label: '散佈圖', use: '看兩個連續變項的關聯（如 X 與 Y 是否一起變動）' },
    { id: 'bar', label: '長條圖', use: '比較不同類別的數值（有/沒有、高/中/低分組對比）' },
    { id: 'line', label: '折線圖', use: '看時間序列趨勢（每天、每週的變化）' },
    { id: 'pie', label: '圓餅圖', use: '看「比例分佈」（各類別佔總體的百分比）' },
    { id: 'mixed', label: '混合圖', use: '同一張圖看兩個不同尺度的指標（左軸/右軸）' },
];

const PROMPT_RULES = [
    '✗ 禁用：「幫我把資料畫成最適合的圖」（這把選圖判斷外包了）',
    '✓ 允許：「我選散佈圖，X 軸 = 睡眠時數，Y 軸 = 專注力，請幫我畫」',
    '✓ 允許：「我畫了長條圖，請檢查標題是否中性、軸是否清楚」',
];

export const ChartChoiceChecker = ({ dataKey = 'w14-chart-choice' }) => {
    const [data, setData] = useState({
        chartType: '',
        xAxis: '',
        yAxis: '',
        reason: '',
    });
    const [showAITip, setShowAITip] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem(dataKey);
        if (saved) {
            try { setData(JSON.parse(saved)); } catch {}
        }
    }, [dataKey]);

    const update = (col, value) => {
        const next = { ...data, [col]: value };
        setData(next);
        localStorage.setItem(dataKey, JSON.stringify(next));
    };

    return (
        <div className="my-6">
            <div className="bg-[#F5F3FF] border-2 border-[#8B5CF6] rounded-[var(--radius-unified)] p-4 md:p-5">
                <div className="flex items-center gap-2 mb-2">
                    <BarChart3 size={20} className="text-[#7C3AED]" />
                    <h3 className="font-bold text-[15px] text-[#7C3AED] m-0">📊 選圖判斷檢核卡</h3>
                </div>
                <p className="text-[12px] text-[#5B21B6] leading-[1.85] mb-4">
                    <strong>動手前先決定：</strong>用哪種圖、X 軸放什麼、Y 軸放什麼。決定好<strong>再讓 AI 幫你畫</strong>——選圖判斷必須是你做。
                </p>

                {/* Step 1: 選圖類型 */}
                <div className="mb-4">
                    <p className="font-bold text-[12.5px] text-[#5B21B6] mb-2">① 你選哪種圖？</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                        {CHART_TYPES.map(t => (
                            <button
                                key={t.id}
                                onClick={() => update('chartType', t.id)}
                                className={`text-left p-2.5 rounded border-2 text-[12px] leading-[1.7] transition-colors ${
                                    data.chartType === t.id
                                        ? 'bg-[#8B5CF6] text-white border-[#7C3AED]'
                                        : 'bg-white text-[var(--ink)] border-[#C4B5FD] hover:bg-[#EDE9FE]'
                                }`}
                            >
                                <p className="font-bold m-0 mb-0.5">{t.label}</p>
                                <p className="text-[10.5px] m-0 opacity-90">{t.use}</p>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Step 2: 軸 + 理由 */}
                {data.chartType && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                            <div>
                                <p className="font-bold text-[12px] text-[#5B21B6] mb-1">② X 軸（橫軸）放什麼？</p>
                                <input
                                    value={data.xAxis}
                                    onChange={e => update('xAxis', e.target.value)}
                                    placeholder="例：睡眠時數（小時）"
                                    className="w-full text-[12.5px] p-2 bg-white border border-[#C4B5FD] rounded focus:outline-none focus:border-[#7C3AED]"
                                />
                            </div>
                            <div>
                                <p className="font-bold text-[12px] text-[#5B21B6] mb-1">③ Y 軸（縱軸）放什麼？</p>
                                <input
                                    value={data.yAxis}
                                    onChange={e => update('yAxis', e.target.value)}
                                    placeholder="例：自評專注力（1-10 分）"
                                    className="w-full text-[12.5px] p-2 bg-white border border-[#C4B5FD] rounded focus:outline-none focus:border-[#7C3AED]"
                                />
                            </div>
                        </div>

                        <div className="mb-3">
                            <p className="font-bold text-[12px] text-[#5B21B6] mb-1">④ 為什麼選這種圖？</p>
                            <textarea
                                value={data.reason}
                                onChange={e => update('reason', e.target.value)}
                                placeholder="例：我們有兩個連續變項（睡眠 vs 專注力），想看是否有關聯——散佈圖最適合呈現點分佈與趨勢。"
                                rows={2}
                                className="w-full text-[12.5px] leading-[1.85] p-2 bg-white border border-[#C4B5FD] rounded resize-y focus:outline-none focus:border-[#7C3AED]"
                            />
                        </div>
                    </>
                )}

                {/* AI 助理檢核（教學型）*/}
                <button
                    onClick={() => setShowAITip(!showAITip)}
                    className="inline-flex items-center gap-1 text-[12px] font-bold px-3 py-1.5 rounded text-white bg-[#7C3AED] hover:bg-[#6D28D9]"
                >
                    <Bot size={13} /> {showAITip ? '收起' : '看 AI 助理檢核 prompt'}
                </button>

                {showAITip && (
                    <div className="mt-3 bg-white border-l-4 border-[#7C3AED] rounded-r p-3">
                        <p className="font-bold text-[12px] text-[#5B21B6] mb-2 flex items-center gap-1">
                            <CheckCircle2 size={13} /> 把以下 prompt 貼給 Gemini / ChatGPT，讓 AI 幫你檢核
                        </p>
                        <pre className="bg-[#F5F3FF] text-[11.5px] font-mono text-[#5B21B6] p-2 rounded whitespace-pre-wrap leading-[1.8] mb-3">
{`我選了 ${data.chartType || '___'} 圖，X 軸 = ${data.xAxis || '___'}，Y 軸 = ${data.yAxis || '___'}。
我的選圖理由是：${data.reason || '___'}

請幫我檢核（用 W14 視覺化紅線）：
1. 這個圖型適合呈現我的兩個變項嗎？
2. X / Y 軸放對了嗎（變數類型對應正確）？
3. 我的理由有沒有踩到「圖表標題用因果語氣」「過度修飾趨勢詞」這類雷？

只給我建議，不要直接告訴我答案——我自己決定要不要採納。`}
                        </pre>
                        <p className="text-[11px] text-[#5B21B6] italic m-0 leading-[1.85]">
                            💡 <strong>注意</strong>：AI 是助理（檢核 + 給建議），不是決策者。最後選哪種圖、要不要採納建議——<strong>你自己決定</strong>。
                        </p>
                    </div>
                )}

                {/* prompt 規則提醒 */}
                <details className="mt-4 bg-white border border-[#C4B5FD] rounded">
                    <summary className="cursor-pointer px-3 py-2 text-[11.5px] font-bold text-[#5B21B6] hover:bg-[#F5F3FF]">
                        📛 給 AI 畫圖時的紅線（點開看）▼
                    </summary>
                    <ul className="border-t border-[#C4B5FD] p-3 list-none space-y-1 m-0">
                        {PROMPT_RULES.map((rule, i) => (
                            <li key={i} className="text-[11.5px] text-[var(--ink-mid)] leading-[1.85]">
                                {rule}
                            </li>
                        ))}
                    </ul>
                </details>
            </div>
        </div>
    );
};

export default ChartChoiceChecker;
