import React, { useState, useEffect, useCallback } from 'react';

/**
 * GroupSizeSelector — 學生先選 1/2/3/4 人組，下方只顯示對應分工
 *
 * Props:
 *   items     ({1:..., 2:..., 3:..., 4:...}) — 各人數對應的分工內容（ReactNode 或字串）
 *                每個 item 形狀建議：{ title?: string, content: ReactNode }
 *                若直接給 ReactNode，會當成 content 顯示。
 *   storageKey (string)  — 跨週共用的 localStorage 鍵值（預設 'rib-team-size'）
 *                學生在 W9 選了 3 人組，去 W10 也會自動帶過來。
 *   accent     (string)  — 主色（預設藍）
 *   bg         (string)  — 卡片背景（預設淺藍）
 *
 * 行為：
 *  - 4 顆按鈕永遠顯示在頂部，學生可以隨時切換
 *  - 還沒選擇前顯示提示框，不會佔大片版面
 *  - 選擇寫入 localStorage，跨頁/重整都記得
 */

const STORAGE_DEFAULT = 'rib-team-size';

export default function GroupSizeSelector({
    items,
    storageKey = STORAGE_DEFAULT,
    accent = '#0EA5E9',
    bg = '#F0F9FF',
    border = '#0EA5E9',
}) {
    const [size, setSize] = useState('');

    // 從 localStorage 讀取（mount + 跨視窗 storage 事件 + window focus 同步）
    const refresh = useCallback(() => {
        try {
            const v = localStorage.getItem(storageKey);
            if (v && ['1', '2', '3', '4'].includes(v)) setSize(v);
        } catch {}
    }, [storageKey]);

    useEffect(() => {
        refresh();
        const onStorage = (e) => { if (e.key === storageKey) refresh(); };
        window.addEventListener('storage', onStorage);
        window.addEventListener('focus', refresh);
        return () => {
            window.removeEventListener('storage', onStorage);
            window.removeEventListener('focus', refresh);
        };
    }, [refresh, storageKey]);

    const pick = (n) => {
        const s = String(n);
        setSize(s);
        try { localStorage.setItem(storageKey, s); } catch {}
    };

    const selected = items?.[size];
    const hasContent = selected !== undefined && selected !== null;

    return (
        <div>
            {/* 4 顆按鈕 */}
            <div className="flex flex-wrap gap-2 mb-3">
                {[1, 2, 3, 4].map((n) => {
                    const isActive = String(n) === size;
                    return (
                        <button
                            key={n}
                            type="button"
                            onClick={() => pick(n)}
                            className="px-3 py-1.5 text-[12.5px] font-bold rounded-[6px] border-2 transition-all"
                            style={{
                                background: isActive ? accent : '#fff',
                                color: isActive ? '#fff' : accent,
                                borderColor: accent,
                            }}
                        >
                            {n === 1 ? '1 人（Solo）' : `${n} 人組`}
                        </button>
                    );
                })}
                {size && (
                    <span className="ml-auto text-[10px] font-mono text-[var(--ink-light)] self-center">
                        💾 已記住你的選擇（W9/W10 共用）
                    </span>
                )}
            </div>

            {/* 內容區 */}
            {hasContent ? (
                <div
                    className="rounded-[6px] p-4 border"
                    style={{ background: '#fff', borderColor: `${border}55` }}
                >
                    {/* 若 item 是 {title, content} 物件，顯示 title；否則直接 render */}
                    {selected.title && (
                        <p className="text-[13px] font-bold mb-2" style={{ color: accent }}>
                            {selected.title}
                        </p>
                    )}
                    <div className="text-[12.5px] leading-relaxed text-[#0C4A6E]">
                        {selected.content || selected}
                    </div>
                </div>
            ) : (
                <div
                    className="rounded-[6px] p-4 text-center text-[12.5px] border-dashed border-2"
                    style={{ background: bg, borderColor: `${border}55`, color: accent }}
                >
                    👆 先選你的隊形，下方就會出現對應分工
                </div>
            )}
        </div>
    );
}
