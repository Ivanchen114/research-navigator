import React, { useState, useEffect } from 'react';
import { Check } from 'lucide-react';

/**
 * Checklist — 可勾選自查清單（狀態自動存檔）
 *
 * Props:
 *   dataKey   (string, required) — localStorage 鍵值，如 "w9-basic-checklist-questionnaire"
 *   prompt    (string)           — 提示文字
 *   items     (string[])         — 檢核項陣列
 *   className (string)
 *
 * 存檔格式：序列化字串存入 rib_think_records[dataKey]
 *   例：「☑ 開場白已寫好\n☐ 基本變項設計完成\n☑ 題目數量已確認」
 *   — 如此 ExportButton 可直接把該槽位內容當字串輸出，不需特別處理。
 */

const STORAGE_KEY = 'rib_think_records';

function readRecords() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; }
    catch { return {}; }
}

function saveRecord(key, value) {
    const records = readRecords();
    records[key] = value;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

export default function Checklist({ dataKey, prompt, items = [], className = '' }) {
    const [checks, setChecks] = useState(() => items.map(() => false));

    // 載入：從 localStorage 字串還原 boolean array
    useEffect(() => {
        const records = readRecords();
        const stored = records[dataKey];
        if (stored && typeof stored === 'string') {
            const lines = stored.split('\n');
            const restored = items.map((item) => {
                const line = lines.find((l) => l.includes(item));
                return line ? line.trim().startsWith('☑') : false;
            });
            setChecks(restored);
        } else {
            setChecks(items.map(() => false));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dataKey, items.join('|')]);

    const toggle = (i) => {
        setChecks((prev) => {
            const next = prev.map((v, j) => (j === i ? !v : v));
            const serialized = items
                .map((item, idx) => `${next[idx] ? '☑' : '☐'} ${item}`)
                .join('\n');
            saveRecord(dataKey, serialized);
            return next;
        });
    };

    const checkedCount = checks.filter(Boolean).length;
    const allChecked = items.length > 0 && checkedCount === items.length;

    return (
        <div className={`border-l-4 border-[var(--accent)] bg-white pl-4 pr-3 py-3 rounded-r-[8px] shadow-[0_1px_0_var(--border)] ${className}`}>
            {/* 徽章 + prompt + 進度 */}
            <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold bg-[var(--accent)] text-white px-2 py-0.5 rounded-[2px] tracking-wider">
                    ☑ 逐項勾選
                </span>
                {prompt && (
                    <p className="text-[14px] font-bold text-[var(--ink)] leading-relaxed m-0">{prompt}</p>
                )}
                <span className="text-[11px] font-mono text-[var(--ink-light)] ml-auto">
                    {checkedCount}/{items.length}
                </span>
            </div>

            {/* 檢核項 */}
            <div className="flex flex-col gap-1.5">
                {items.map((item, i) => (
                    <button
                        key={i}
                        type="button"
                        onClick={() => toggle(i)}
                        className={`flex items-start gap-2 px-3 py-2 rounded-[6px] border transition-all text-left ${
                            checks[i]
                                ? 'bg-[var(--success)]/10 border-[var(--success)] text-[var(--ink)]'
                                : 'bg-[var(--paper-warm)] border-[var(--border)] text-[var(--ink-mid)] hover:border-[var(--accent)]'
                        }`}
                    >
                        <span
                            className={`flex-shrink-0 w-4 h-4 mt-0.5 rounded-[3px] border-2 flex items-center justify-center ${
                                checks[i]
                                    ? 'bg-[var(--success)] border-[var(--success)] text-white'
                                    : 'bg-white border-[var(--border)]'
                            }`}
                        >
                            {checks[i] && <Check size={11} strokeWidth={3} />}
                        </span>
                        <span className="text-[13px] leading-relaxed">{item}</span>
                    </button>
                ))}
            </div>

            {allChecked && (
                <div className="mt-2 bg-[var(--success)]/10 border border-[var(--success)] rounded-[6px] px-3 py-1.5 text-[12px] text-[var(--success)] font-bold flex items-center gap-2">
                    ✓ 這區自查全部通過
                </div>
            )}
        </div>
    );
}
