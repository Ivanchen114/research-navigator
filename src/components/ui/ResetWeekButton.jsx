import React, { useCallback } from 'react';
import { RotateCcw } from 'lucide-react';
import { STORAGE_KEY } from './ThinkRecord';

/**
 * ResetWeekButton — TOP BAR 右側的「重置本週」小按鈕
 *
 * 用途：學生想重寫整週填寫時用（共用電腦借來、填錯方向、老師示範後清資料）。
 * 清 `rib_think_records` 中所有以 weekPrefix 開頭的 key（含 AIREDNarrative 內部用的
 * ThinkRecord），以及 `think-choice::{weekPrefix}...` 這類有帶 dataKey 的選擇題。
 *
 * 不會清：
 *  - 跨週帶入（如 w4-final-topic 在 w8 自動帶入後已經複製進 w8-my-topic）
 *  - 劇情/遊戲旗標（phantom_*, rib_score_*）
 *  - ThinkChoice 用 prompt 當 key 的（舊寫法，無法按 prefix 判定——實務上各題有自己的重做按鈕）
 *
 * Props:
 *   weekPrefix (string, required)  — 如 "w8-"、"w10-"
 */
export default function ResetWeekButton({ weekPrefix }) {
    const handleReset = useCallback(() => {
        const weekName = weekPrefix.replace(/-$/, '').toUpperCase();
        if (!window.confirm(`確定要清空「${weekName}」所有填寫內容嗎？\n\n此動作無法復原。`)) return;
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) {
                const records = JSON.parse(raw);
                const cleaned = Object.fromEntries(
                    Object.entries(records).filter(([k]) => !k.startsWith(weekPrefix))
                );
                localStorage.setItem(STORAGE_KEY, JSON.stringify(cleaned));
            }
            // ThinkChoice 有 dataKey 的：key 長這樣 `think-choice::w8-xxx`
            Object.keys(localStorage)
                .filter(k => k.startsWith(`think-choice::${weekPrefix}`))
                .forEach(k => localStorage.removeItem(k));
        } catch {
            /* noop */
        }
        window.location.reload();
    }, [weekPrefix]);

    return (
        <button
            onClick={handleReset}
            className="text-[11px] text-[var(--ink-light)] hover:text-[var(--danger)] transition-colors flex items-center gap-1 font-mono"
            title={`清空 ${weekPrefix.replace(/-$/, '').toUpperCase()} 所有填寫內容`}
            type="button"
        >
            <RotateCcw size={12} /> <span className="hidden md:inline">重置本週</span>
        </button>
    );
}
