import React from 'react';

/**
 * HeroBlock — 偵探檔案開場 hero
 * 深墨底 + serif 大字 + 金色斜體重點 + 檔案編號橫線
 *
 * Props:
 *   kicker       string — 左上細線旁的檔案編號，如 "R.I.B. 調查檔案 · 研究方法與專題 · W2"
 *   title        string — 主標黑色部分，如 "問題意識的覺醒："
 *   accentTitle  string — 金色斜體重點，如 "把好奇心變成好問題"
 *   subtitle     string — 副標內文
 *   meta         array  — [{ label, value }, ...]，底部四欄統計條（可選）
 *   className    string
 */
export default function HeroBlock({
    kicker,
    title,
    accentTitle,
    subtitle,
    meta,
    className = '',
}) {
    return (
        <div
            className={`hero-block relative overflow-hidden bg-[#14142a] text-white -mx-6 sm:mx-0 rounded-none sm:rounded-[8px] px-6 sm:px-10 md:px-14 py-14 md:py-20 mb-10 md:mb-12 ${className}`}
        >
            {/* 點陣網格背景 */}
            <div
                className="absolute inset-0 opacity-[0.06] pointer-events-none"
                style={{
                    backgroundImage:
                        'radial-gradient(rgba(255,255,255,0.8) 1px, transparent 1px)',
                    backgroundSize: '16px 16px',
                }}
            />

            <div className="relative max-w-[780px]">
                {/* KICKER — 檔案編號線 */}
                {kicker && (
                    <div className="flex items-center gap-3 mb-8">
                        <span className="block w-8 h-[1px] bg-[#c9a84c]/60" />
                        <span className="text-[11px] font-mono tracking-[0.18em] text-white/50 uppercase">
                            {kicker}
                        </span>
                    </div>
                )}

                {/* TITLE */}
                <h1 className="font-serif font-bold leading-[1.15] tracking-[-0.02em] mb-5 text-[34px] md:text-[50px]">
                    {title}
                    {accentTitle && (
                        <span className="text-[#c9a84c] italic"> {accentTitle}</span>
                    )}
                </h1>

                {/* SUBTITLE */}
                {subtitle && (
                    <p className="text-[14px] md:text-[15px] text-white/70 max-w-[620px] leading-[1.75]">
                        {subtitle}
                    </p>
                )}

                {/* META 條 */}
                {meta && meta.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-4 pt-8 mt-10 border-t border-white/10">
                        {meta.map((m, i) => (
                            <div key={i}>
                                <div className="text-[10px] font-mono text-white/40 uppercase tracking-[0.1em] mb-1.5">
                                    {m.label}
                                </div>
                                <div className="text-[13px] md:text-[14px] font-bold text-white">
                                    {m.value}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
