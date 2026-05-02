import React, { useState, useCallback } from 'react';
import { Check, ArrowDownToLine } from 'lucide-react';
import { STORAGE_KEY } from './ThinkRecord';

/**
 * BackfillField — 跨週帶入失敗時的「現場補資料」小框。
 *
 * 用在學生中途加入／換裝置／清快取的情境：上一週的 dataKey 沒值，
 * 學生不用回到上一週網頁，可以把紙本／其他裝置上寫的內容直接貼進來，
 * 寫進 localStorage 同一個 key，下游帶入卡會立即接通。
 *
 * Props:
 *   dataKey      (string, required)  — 要寫入的 dataKey（如 'w3-final-topic'）
 *   label        (string)            — 上方說明文字
 *   placeholder  (string)            — 輸入框 placeholder
 *   buttonLabel  (string, default '補上') — 按鈕文字
 *   tone         ('warn' | 'neutral', default 'warn') — 視覺基調
 */
export default function BackfillField({
    dataKey,
    label,
    placeholder = '把紙本／其他裝置上寫的內容貼這裡…',
    buttonLabel = '補上',
    tone = 'warn',
}) {
    const [value, setValue] = useState('');
    const [saved, setSaved] = useState(false);

    const save = useCallback(() => {
        const v = value.trim();
        if (!v) return;
        try {
            const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
            all[dataKey] = v;
            localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
        } catch { /* ignore */ }
        setSaved(true);
        // 觸發 focus 事件讓所有 reference 卡 re-read
        window.dispatchEvent(new Event('focus'));
        // 2 秒後清掉「已補上」勝利狀態（讓老師後續還能看到輸入框）
        setTimeout(() => setSaved(false), 2000);
    }, [value, dataKey]);

    const wrapClass = tone === 'warn'
        ? 'border border-[var(--danger)]/40 bg-[var(--danger-light)]'
        : 'border border-[var(--border)] bg-[var(--paper-warm)]';

    return (
        <div className={`rounded-[var(--radius-unified)] p-4 space-y-3 ${wrapClass}`}>
            {label && (
                <div className="flex items-center gap-2 text-[12px] font-bold text-[var(--ink)] leading-relaxed">
                    <ArrowDownToLine size={14} className="text-[var(--danger)] shrink-0" />
                    <span>{label}</span>
                </div>
            )}
            <textarea
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={placeholder}
                rows={3}
                className="w-full p-3 text-[13px] text-[var(--ink)] bg-white border border-[var(--border)] rounded-[6px] focus:outline-none focus:border-[var(--accent)] resize-y leading-relaxed"
            />
            <div className="flex items-center gap-3">
                <button
                    type="button"
                    onClick={save}
                    disabled={!value.trim()}
                    className="px-4 py-1.5 rounded-[6px] text-[12px] font-bold transition-colors bg-[var(--ink)] text-white hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1.5"
                >
                    {saved ? (<><Check size={13} /> 已補上</>) : buttonLabel}
                </button>
                <span className="text-[11px] text-[var(--ink-light)]">
                    補上後，整條鏈會立即接通——你不用回上一週重打。
                </span>
            </div>
        </div>
    );
}
