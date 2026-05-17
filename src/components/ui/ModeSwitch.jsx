import React from 'react';
import { useMode } from '../../context/ModeContext';

/**
 * ModeSwitch — 頂部模式切換 UI ＋ 模式指引小字
 *
 * 兩個主模式互斥切換：上課跟做 / 自學補課。
 *「我的紀錄」不在這裡——那是 RecordDrawer（抽屜，兩模式都能開）。
 *
 * mode state 由 ModeProvider 管，這裡只負責切換 UI。
 */

const MODES = [
    { id: 'class', label: '🚀 上課跟做' },
    { id: 'self-study', label: '📖 自學補課' },
];

export default function ModeSwitch() {
    const { mode, setMode } = useMode();

    return (
        <div className="my-5">
            <div className="flex flex-wrap gap-2">
                {MODES.map((m) => {
                    const active = mode === m.id;
                    return (
                        <button
                            key={m.id}
                            onClick={() => setMode(m.id)}
                            className="px-4 py-2 rounded-[var(--radius-unified)] text-[13px] font-bold border-2 transition-colors"
                            style={
                                active
                                    ? { background: 'var(--ink)', borderColor: 'var(--ink)', color: '#fff' }
                                    : { background: '#fff', borderColor: 'var(--border)', color: 'var(--ink-light)' }
                            }
                        >
                            {m.label}
                        </button>
                    );
                })}
            </div>
            <div className="mt-2 text-[11.5px] text-[var(--ink-light)] leading-[1.7]">
                <span className="block">上課跟做：老師在場時使用。</span>
                <span className="block">自學補課：請假、補課或想看完整說明時使用。</span>
            </div>
        </div>
    );
}
