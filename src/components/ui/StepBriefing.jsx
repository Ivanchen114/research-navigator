import React from 'react';
import { Target, ArrowRightCircle } from 'lucide-react';

/**
 * StepBriefing — 每個 Step 開頭的任務說明卡
 *
 * 教學設計：
 *   學生點進 Step 後第一眼就看到「我現在要做什麼 + 做完該做什麼」，
 *   降低資訊密度過高造成的迷路感。
 *
 * Props（二擇一）：
 *   lines  {label, text}[]  結構化多行（學 / 做 / 練 / 交出 / 注意…）—— 推薦新用法
 *   task   string           舊版單行模式，向後相容
 *
 *   done   string           完成後的下一個動作指示（選填，兩種模式都支援）
 */

/* ── 標籤底色對照 ── */
const LABEL_COLOR = {
    學:  '#2563EB',   // 藍
    做:  '#059669',   // 綠
    練:  '#7C3AED',   // 紫
    交出: '#D97706',  // 琥珀
    注意: '#DC2626',  // 紅
};
const defaultColor = '#9B7F2A';   // 預設金

function labelBg(label) {
    return LABEL_COLOR[label] ?? defaultColor;
}

export default function StepBriefing({ task, done, lines }) {

    /* ── 結構化多行模式 ── */
    if (lines && lines.length > 0) {
        return (
            <div className="rounded-[var(--radius-unified)] border-l-[4px] border-[var(--gold)] bg-[var(--gold-light)] flex flex-col">
                <div className="flex flex-col gap-2.5 p-4 px-5">
                    {lines.map(({ label, text }, i) => (
                        <div key={i} className="flex items-start gap-2.5">
                            <span
                                className="shrink-0 text-[9.5px] font-mono font-bold tracking-[0.08em] text-white px-1.5 py-0.5 rounded mt-[3px]"
                                style={{ background: labelBg(label) }}
                            >
                                {label}
                            </span>
                            <p className="text-[13.5px] text-[var(--ink)] leading-[1.75] m-0">{text}</p>
                        </div>
                    ))}
                </div>
                {done && (
                    <div className="flex items-start gap-2.5 px-5 py-3 border-t border-[var(--gold)]/30 bg-white/40">
                        <ArrowRightCircle className="text-[var(--ink-mid)] shrink-0 mt-0.5" size={15} />
                        <div>
                            <div className="text-[9.5px] font-mono uppercase tracking-[0.15em] text-[var(--ink-light)] font-bold mb-0.5">完成後</div>
                            <p className="text-[12.5px] text-[var(--ink-mid)] leading-[1.7] m-0">{done}</p>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    /* ── 舊版單行模式（向後相容）── */
    return (
        <div className="rounded-[var(--radius-unified)] overflow-hidden border-l-[4px] border-[var(--gold)] bg-[var(--gold-light)] flex flex-col sm:flex-row">
            {/* 任務區 */}
            <div className="flex items-start gap-3 p-4 px-5 flex-1 min-w-0">
                <Target className="text-[var(--gold)] shrink-0 mt-0.5" size={20} strokeWidth={2.25} />
                <div className="flex-1 min-w-0">
                    <div className="text-[10px] font-mono uppercase tracking-[0.15em] text-[var(--gold)] font-bold mb-1">本步任務</div>
                    <p className="text-[14px] text-[var(--ink)] leading-[1.7] font-bold">{task}</p>
                </div>
            </div>

            {/* 完成後（選填）*/}
            {done && (
                <div className="flex items-start gap-3 p-4 px-5 sm:border-l border-t sm:border-t-0 border-[var(--gold)]/25 bg-white/40 flex-1 min-w-0">
                    <ArrowRightCircle className="text-[var(--ink-mid)] shrink-0 mt-0.5" size={18} />
                    <div className="flex-1 min-w-0">
                        <div className="text-[10px] font-mono uppercase tracking-[0.15em] text-[var(--ink-mid)] font-bold mb-1">完成後</div>
                        <p className="text-[13px] text-[var(--ink-mid)] leading-[1.7]">{done}</p>
                    </div>
                </div>
            )}
        </div>
    );
}
