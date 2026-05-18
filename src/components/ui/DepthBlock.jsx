import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useMode } from '../../context/ModeContext';
import { useProjector } from '../../context/ProjectorContext';

/**
 * DepthBlock — 包「深度補充」內容（完整說明／範例詳解／為什麼重要／常見錯誤）。
 *
 *   上課模式：預設收合、標題可見、可手動點開（不是隱藏——學生卡住時要找得到）。
 *   自學模式：預設展開。
 *   投影顯示：一律收合（即使自學模式），老師需要時手動點開——優先於 mode 判斷。
 *
 * 切換模式／投影狀態時重設展開狀態（視為刻意 reset）；單一狀態內學生仍可手動開合。
 *
 * title 只能用固定詞表（三模式架構 spec §6-2），其餘一律 fallback 成「延伸補充」：
 *   想知道為什麼？／看完整範例／常見錯誤／AI 使用提醒／延伸補充
 */

const DEPTH_TITLES = ['想知道為什麼？', '看完整範例', '常見錯誤', 'AI 使用提醒', '延伸補充'];

export default function DepthBlock({ title = '延伸補充', children, forceOpen = false }) {
    const { mode } = useMode();
    const { projector } = useProjector();
    // 投影顯示一律收合；否則自學模式或 forceOpen 時展開、上課模式收合
    const defaultOpen = !projector && (mode === 'self-study' || forceOpen);
    const [open, setOpen] = useState(defaultOpen);

    useEffect(() => {
        if (forceOpen) setOpen(true);   // forceOpen 變 true 時強制展開（e.g. 選了文獻分析法）
        else setOpen(defaultOpen);
    }, [defaultOpen, forceOpen]);

    const safeTitle = DEPTH_TITLES.includes(title) ? title : '延伸補充';

    return (
        <div className="my-4 rounded-[var(--radius-unified)] border border-dashed border-[var(--border-mid)] bg-[var(--paper-warm)] overflow-hidden">
            <button
                onClick={() => setOpen((o) => !o)}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-left hover:bg-[var(--paper)] transition-colors"
            >
                {open
                    ? <ChevronDown size={15} className="text-[var(--ink-light)] flex-shrink-0" />
                    : <ChevronRight size={15} className="text-[var(--ink-light)] flex-shrink-0" />}
                <span className="text-[12.5px] font-bold text-[var(--ink-mid)]">{safeTitle}</span>
                {!open && (
                    <span className="ml-auto text-[10.5px] font-mono text-[var(--ink-light)]">點開看</span>
                )}
            </button>
            {open && (
                <div className="px-4 pb-4 pt-1 border-t border-dashed border-[var(--border)]">
                    {children}
                </div>
            )}
        </div>
    );
}
