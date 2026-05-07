import React, { useState, useEffect } from 'react';
import { Award, Sparkles } from 'lucide-react';

/**
 * Brave Scientist 誠實反思卡 — W15 末用，反「學術糾察隊效應」配套
 *
 * 教學目的：
 *   - 訓練學生「找雷」之後，最大的副作用是「怕踩雷不敢下結論」
 *   - 這張卡告訴他們：研究本來就有極限，誠實寫研究限制 = 研究員的勳章，不是缺點
 *   - 「我們雖有 X 限制，但仍誠實觀察到 Y」是研究員的標準語態
 *
 * Props:
 * - dataKey：localStorage 儲存鍵
 */
export const BraveScientistReflection = ({ dataKey = 'w15-brave-scientist' }) => {
    const [data, setData] = useState({ limit: '', observed: '' });

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
            <div className="bg-gradient-to-br from-[#1F2937] to-[#0F172A] rounded-[var(--radius-unified)] p-5 md:p-6 text-white shadow-xl">
                <div className="flex items-center gap-2 mb-3">
                    <Award size={22} className="text-[#FCD34D]" />
                    <p className="font-mono text-[11px] font-bold tracking-[0.2em] text-[#FCD34D] uppercase">Brave Scientist · 誠實宣言</p>
                </div>
                <h3 className="font-serif text-[20px] md:text-[24px] font-bold leading-tight mb-3">
                    研究本來就有極限——
                    <br className="md:hidden" />
                    誠實寫限制是研究員的勳章
                </h3>
                <p className="text-[13px] text-white/85 leading-[1.95] mb-5">
                    找雷不是為了讓你「<strong className="text-[#FCD34D]">怕踩雷不敢下結論</strong>」。完美研究不存在——好研究員的差別是：
                    <strong className="text-[#FCD34D]">「敢下結論 + 誠實寫限制」</strong>。
                    <br/>
                    把你研究的限制大方寫出來——這不是缺點，是<strong className="text-[#FCD34D]">研究員的勳章</strong>。
                </p>

                {/* 兩格：限制 + 觀察 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                    <div className="bg-white/10 rounded p-3">
                        <p className="font-bold text-[12px] text-[#FCA5A5] uppercase tracking-wider mb-2">📌 我們研究的最大限制</p>
                        <textarea
                            value={data.limit}
                            onChange={e => update('limit', e.target.value)}
                            placeholder="例：N=22 是小樣本／自陳問卷可能受社會期許影響／橫斷研究無法看時間順序⋯"
                            rows={4}
                            className="w-full text-[12.5px] leading-[1.85] p-2 bg-white/95 text-[var(--ink)] rounded resize-y focus:outline-none focus:ring-2 focus:ring-[#FCD34D]"
                        />
                    </div>
                    <div className="bg-white/10 rounded p-3">
                        <p className="font-bold text-[12px] text-[#86EFAC] uppercase tracking-wider mb-2">✨ 但我們仍誠實觀察到</p>
                        <textarea
                            value={data.observed}
                            onChange={e => update('observed', e.target.value)}
                            placeholder="例：在本研究 22 位學生中，睡眠時數較高的學生，自評專注力分數也傾向較高。"
                            rows={4}
                            className="w-full text-[12.5px] leading-[1.85] p-2 bg-white/95 text-[var(--ink)] rounded resize-y focus:outline-none focus:ring-2 focus:ring-[#FCD34D]"
                        />
                    </div>
                </div>

                {/* 句型範例 */}
                <div className="bg-white/10 border-l-4 border-[#FCD34D] rounded-r p-3 mb-4">
                    <p className="text-[11px] font-mono font-bold text-[#FCD34D] uppercase mb-1.5">🎤 標準句型</p>
                    <p className="text-[13px] text-white/95 italic leading-[1.85] m-0">
                        「我們的研究<strong className="text-[#FCD34D]">雖然有 ___（限制）</strong>，
                        但<strong className="text-[#FCD34D]">仍誠實觀察到 ___（資料事實）</strong>。」
                    </p>
                </div>

                <div className="flex items-start gap-2 text-[12px] text-white/70 italic leading-[1.85]">
                    <Sparkles size={14} className="text-[#FCD34D] mt-0.5 flex-shrink-0" />
                    <p className="m-0">
                        <strong className="text-white/90">三方哲學：</strong>承認自己做不到，本身就是最高級的研究能力。謹慎不是把話說到沒內容——而是<strong className="text-[#FCD34D]">既誠實又有價值</strong>。
                    </p>
                </div>
            </div>
        </div>
    );
};

export default BraveScientistReflection;
