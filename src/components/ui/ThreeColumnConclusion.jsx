import React, { useState, useEffect } from 'react';
import { Check, AlertTriangle, X } from 'lucide-react';

/**
 * W15 三欄結論寫作鷹架 — 把每句話分類成「資料支持 / 推論 / 不能說」
 *
 * 核心邏輯：寫結論時，每寫一句話都要問自己——這句屬於哪一欄？
 *   - 資料支持（綠）：N=X 中觀察到 Y，純描述
 *   - 推論（黃）：可能是…，但需更多研究確認，謹慎推測
 *   - 不能說（紅）：⛔ 因果語氣 / ⛔ 推廣全體 / ⛔ 機制腦補 → 必須改寫或刪除
 *
 * Props:
 * - dataKey：localStorage 儲存鍵
 */
export const ThreeColumnConclusion = ({ dataKey = 'w15-three-column' }) => {
    const [data, setData] = useState({ supported: '', inferred: '', forbidden: '' });

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
            <div className="bg-[var(--paper-warm)] border-2 border-[var(--ink)] rounded-[var(--radius-unified)] p-4 md:p-5">
                <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle size={18} className="text-[var(--ink)]" />
                    <h3 className="font-bold text-[15px] text-[var(--ink)] m-0">📊 三欄結論寫作鷹架</h3>
                </div>
                <p className="text-[12px] text-[var(--ink-mid)] leading-[1.85] mb-4">
                    寫結論前先把你想說的話分類進三欄——<strong>「能說 / 謹慎說 / 絕對不能說」</strong>。寫完再合成完整結論段。
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {/* 資料支持 */}
                    <div className="rounded border-2 border-[#10B981] bg-[#F0FDF4] p-3">
                        <div className="flex items-center gap-1.5 mb-2">
                            <Check size={15} className="text-[#059669]" />
                            <p className="font-bold text-[12.5px] text-[#065F46] m-0">✓ 資料支持</p>
                        </div>
                        <p className="text-[10.5px] text-[#065F46] italic mb-2 leading-[1.7]">
                            純描述，N=X 中觀察到 Y。<strong>只報數字。</strong>
                        </p>
                        <textarea
                            value={data.supported}
                            onChange={e => update('supported', e.target.value)}
                            placeholder="例：N=22 中睡眠 ≥8 小時組平均專注力 8.0 分；睡眠 <6 小時組平均 4.5 分。"
                            rows={5}
                            className="w-full text-[12px] leading-[1.7] p-2 border border-[#86EFAC] rounded resize-y bg-white focus:outline-none focus:border-[#059669]"
                        />
                    </div>

                    {/* 推論 */}
                    <div className="rounded border-2 border-[#F59E0B] bg-[#FFFBEB] p-3">
                        <div className="flex items-center gap-1.5 mb-2">
                            <AlertTriangle size={15} className="text-[#D97706]" />
                            <p className="font-bold text-[12.5px] text-[#92400E] m-0">△ 推論（謹慎）</p>
                        </div>
                        <p className="text-[10.5px] text-[#92400E] italic mb-2 leading-[1.7]">
                            可能是…，但需更多研究。用「可能 / 看似 / 傾向」。
                        </p>
                        <textarea
                            value={data.inferred}
                            onChange={e => update('inferred', e.target.value)}
                            placeholder="例：兩變項看似呈正向關聯，可能反映睡眠對專注力的影響，但本研究無法判斷因果方向。"
                            rows={5}
                            className="w-full text-[12px] leading-[1.7] p-2 border border-[#FCD34D] rounded resize-y bg-white focus:outline-none focus:border-[#D97706]"
                        />
                    </div>

                    {/* 不能說 */}
                    <div className="rounded border-2 border-[#DC2626] bg-[#FEF2F2] p-3">
                        <div className="flex items-center gap-1.5 mb-2">
                            <X size={15} className="text-[#DC2626]" />
                            <p className="font-bold text-[12.5px] text-[#991B1B] m-0">⛔ 絕對不能說</p>
                        </div>
                        <p className="text-[10.5px] text-[#991B1B] italic mb-2 leading-[1.7]">
                            列出你<strong>本來想寫但發現不能寫</strong>的句子（記下來練判斷力）。
                        </p>
                        <textarea
                            value={data.forbidden}
                            onChange={e => update('forbidden', e.target.value)}
                            placeholder="例：⛔「睡眠不足導致專注力下降」（因果語氣）⛔「台灣高中生都該⋯」（過度推廣）⛔「補習壓縮 REM 睡眠」（機制腦補）"
                            rows={5}
                            className="w-full text-[12px] leading-[1.7] p-2 border border-[#FCA5A5] rounded resize-y bg-white focus:outline-none focus:border-[#DC2626]"
                        />
                    </div>
                </div>

                <p className="text-[11px] text-[var(--ink-mid)] italic mt-3 leading-[1.85]">
                    💡 <strong>第三欄是反思工具</strong>——把你「本來想寫但發現不能寫」的句子記下來，練的就是研究員的判斷力。
                </p>
            </div>
        </div>
    );
};

export default ThreeColumnConclusion;
