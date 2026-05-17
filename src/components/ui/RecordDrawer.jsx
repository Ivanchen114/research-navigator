import React, { useState, useEffect, useRef } from 'react';
import { FolderOpen, ChevronDown, Check, Circle } from 'lucide-react';
import ExportButton from './ExportButton';
import { readRecords } from './ThinkRecord';

/**
 * RecordDrawer — 本週所有 input 的「總覽 ＋ 匯出」view（方案 A）
 *
 * input 元件仍留在各 Step 裡填——這裡只「聚合呈現狀態 + 提供 ExportButton」，
 * 不是把 input 搬過來。預設收合，兩個主模式下都能開。
 *
 * Props:
 *   weekLabel    string — 週次標題，傳給 ExportButton
 *   fields       array  — EXPORT_FIELDS：會匯出、存在 rib_think_records 的欄位
 *                         [{ key, label, question? }, ...]
 *   extraFields  array  — 不匯出、但仍要在總覽顯示的欄位（元件自帶 dataKey）
 *                         [{ key, label, store: 'records' | 'standalone' }]
 *   choices      array  — ThinkChoice 選擇題結果，原樣 pass-through 給 ExportButton
 *                         [{ question, selected, correct }, ...]（不走 dataKey 欄位）
 */

function isStandaloneFilled(raw) {
    if (!raw) return false;
    try {
        const v = JSON.parse(raw);
        if (v && typeof v === 'object') {
            return Object.values(v).some((x) => x && String(x).trim());
        }
        return Boolean(String(v).trim());
    } catch {
        return Boolean(String(raw).trim());
    }
}

export default function RecordDrawer({ weekLabel = '', fields = [], extraFields = [], choices = [] }) {
    const [open, setOpen] = useState(false);
    const [snapshot, setSnapshot] = useState({ records: {}, standalone: {} });

    /* extraFields 是父元件 JSX 裡的字面陣列，每次 render 都是新 reference。
     * 用 ref 持有最新值，讓 useEffect 的 deps 只追蹤 open，避免無限 re-render。 */
    const extraFieldsRef = useRef(extraFields);
    useEffect(() => { extraFieldsRef.current = extraFields; });

    useEffect(() => {
        const refresh = () => {
            const records = readRecords();
            const standalone = {};
            extraFieldsRef.current.forEach((f) => {
                if (f.store === 'standalone') {
                    try { standalone[f.key] = localStorage.getItem(f.key); }
                    catch { standalone[f.key] = null; }
                }
            });
            setSnapshot({ records, standalone });
        };
        refresh();
        if (!open) return;
        const id = setInterval(refresh, 2000);
        return () => clearInterval(id);
    }, [open]); // extraFields 透過 ref 取用，不加入 deps 以防止無限迴圈

    const rows = [
        ...fields.map((f) => ({
            key: f.key,
            label: f.label,
            filled: Boolean((snapshot.records[f.key] || '').trim()),
            exported: true,
        })),
        ...extraFields.map((f) => ({
            key: f.key,
            label: f.label,
            filled: f.store === 'standalone'
                ? isStandaloneFilled(snapshot.standalone[f.key])
                : Boolean((snapshot.records[f.key] || '').trim()),
            exported: false,
        })),
    ];

    const filledCount = rows.filter((r) => r.filled).length;

    return (
        <div className="my-6 rounded-[var(--radius-unified)] border-2 border-[var(--ink)] overflow-hidden">
            <button
                onClick={() => setOpen((o) => !o)}
                className="w-full flex items-center gap-2 px-4 py-3 bg-[var(--ink)] text-white text-left"
            >
                <FolderOpen size={16} className="flex-shrink-0" />
                <span className="text-[13px] font-bold">📁 我的紀錄</span>
                {rows.length > 0 && (
                    <span className="text-[11px] font-mono opacity-70">
                        （{filledCount} / {rows.length} 已填）
                    </span>
                )}
                <ChevronDown
                    size={15}
                    className="ml-auto transition-transform"
                    style={{ transform: open ? 'rotate(180deg)' : 'none' }}
                />
            </button>

            {open && (
                <div className="bg-white p-4">
                    <p className="text-[11.5px] text-[var(--ink-light)] leading-[1.7] mb-3">
                        這裡是本週要填的格子總覽。內容仍在各 Step 裡填——這裡只幫你檢查還缺哪些、一鍵匯出繳交。
                    </p>
                    <div className="flex items-start gap-2 bg-[#FEF9C3] border border-[#FDE68A] rounded-[6px] px-3 py-2 mb-4">
                        <span className="text-[13px] shrink-0">⚠️</span>
                        <p className="text-[11px] text-[#78350F] leading-[1.65]">
                            紀錄只存在<strong>這個瀏覽器</strong>——換裝置、清除 Cache 或用無痕視窗會遺失。每週複製匯出貼到 Classroom，那份才是你的永久備份。
                        </p>
                    </div>
                    <ul className="flex flex-col gap-1 mb-4">
                        {rows.map((r) => (
                            <li key={r.key} className="flex items-start gap-2 text-[12px] leading-[1.6]">
                                {r.filled
                                    ? <Check size={14} className="text-[var(--success)] flex-shrink-0 mt-0.5" />
                                    : <Circle size={14} className="text-[var(--border-mid)] flex-shrink-0 mt-0.5" />}
                                <span className={r.filled ? 'text-[var(--ink-mid)]' : 'text-[var(--ink-light)]'}>
                                    {r.label}
                                    {!r.exported && (
                                        <span className="text-[10.5px] text-[var(--ink-light)]">（不匯出）</span>
                                    )}
                                </span>
                            </li>
                        ))}
                    </ul>
                    <ExportButton weekLabel={weekLabel} fields={fields} choices={choices} />
                </div>
            )}
        </div>
    );
}
