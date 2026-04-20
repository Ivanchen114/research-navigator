import React, { useState, useEffect, useRef, useCallback } from 'react';

/**
 * ThinkRecord — 自動存檔文字輸入框
 *
 * Props:
 *   dataKey   (string, required) — localStorage 鍵值，如 "w2-predict-1"
 *   prompt    (string)           — 提示文字
 *   placeholder (string)         — 輸入框提示（打字後消失，屬 HTML 原生行為）
 *   defaultTemplate (string)     — 預設樣板文字：若 localStorage 沒存過，載入此值作為初始內容（可覆寫），打字不會消失。適合長樣板（三欄表、檢核清單）。
 *   scaffold  (array)            — 鷹架句型提示，如 ['我觀察到…', '我覺得奇怪的是…']
 *   rows      (number)           — textarea 行數，預設 3
 *   className (string)           — 額外 class
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

export default function ThinkRecord({
  dataKey,
  prompt,
  placeholder = '寫下你的想法…',
  defaultTemplate,
  scaffold,
  rows = 3,
  className = '',
}) {
  const [value, setValue] = useState('');
  const [status, setStatus] = useState('idle'); // idle | typing | saved | restored
  const timerRef = useRef(null);
  // 用 ref 存 defaultTemplate，避免「變動的樣板字串」觸發 useEffect 重跑覆蓋使用者已打但未存的輸入
  const defaultTemplateRef = useRef(defaultTemplate);
  defaultTemplateRef.current = defaultTemplate;

  // 載入對應 dataKey 的內容——**必須**在 dataKey 切換時重置，否則 React 重用 instance（例如 StepEngine 切 tab）會讓舊內容污染新格子
  // 若 localStorage 沒存過（undefined）且有 defaultTemplate，載入樣板作初始內容；學生改動才會存檔覆寫
  useEffect(() => {
    const records = readRecords();
    const stored = records[dataKey];
    if (stored !== undefined) {
      setValue(stored);
      setStatus(stored ? 'restored' : 'idle');
    } else if (defaultTemplateRef.current) {
      setValue(defaultTemplateRef.current);
      setStatus('idle');
    } else {
      setValue('');
      setStatus('idle');
    }
  }, [dataKey]);

  const handleChange = useCallback((e) => {
    const v = e.target.value;
    setValue(v);
    setStatus('typing');

    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      saveRecord(dataKey, v);
      setStatus('saved');
    }, 800);
  }, [dataKey]);

  const handleBlur = useCallback(() => {
    if (value) {
      clearTimeout(timerRef.current);
      saveRecord(dataKey, value);
      setStatus('saved');
    }
  }, [dataKey, value]);

  const statusText = {
    idle: '',
    typing: '輸入中…',
    saved: '✓ 已自動儲存',
    restored: '↑ 已載入上次紀錄',
  };

  const statusColor = {
    idle: 'text-transparent',
    typing: 'text-[var(--ink-light)]',
    saved: 'text-[var(--success)]',
    restored: 'text-[var(--accent)]',
  };

  return (
    <div className={`think-record-wrap border-l-4 border-[var(--accent)] bg-white pl-4 pr-3 py-3 rounded-r-[8px] shadow-[0_1px_0_var(--border)] ${className}`}>
      {/* 「要你填」徽章——一眼辨識這格是輸入框 */}
      <div className="flex items-center gap-2 mb-2 flex-wrap">
        <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold bg-[var(--accent)] text-white px-2 py-0.5 rounded-[2px] tracking-wider">
          ✍️ 輪到你填
        </span>
        {prompt && (
          <p className="text-[14px] font-bold text-[var(--ink)] leading-relaxed m-0">{prompt}</p>
        )}
      </div>

      {scaffold && scaffold.length > 0 && (
        <div className="mb-2">
          <div className="text-[10px] font-mono text-[var(--ink-light)] uppercase tracking-[0.1em] mb-1">
            💡 提示句型（參考用，不是要按的按鈕）
          </div>
          <div className="flex flex-wrap gap-1.5">
            {scaffold.map((hint, i) => (
              <span
                key={i}
                className="inline-block text-[11px] px-2.5 py-1 rounded-full bg-[var(--paper-warm)] text-[var(--ink-light)] border border-dashed border-[var(--border)] font-mono cursor-default italic"
              >
                {hint}
              </span>
            ))}
          </div>
        </div>
      )}

      <textarea
        name={dataKey}
        autoComplete="off"
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={placeholder}
        rows={rows}
        className="w-full px-4 py-3 rounded-[var(--radius-unified)] border-2 border-[var(--accent)]/30 bg-[var(--accent-light)]/20 text-[14px] leading-relaxed text-[var(--ink)] placeholder:text-[var(--ink-light)] focus:outline-none focus:border-[var(--accent)] focus:bg-white focus:ring-2 focus:ring-[var(--accent)]/15 transition-all resize-y"
      />

      <div className={`text-[11px] font-mono mt-1.5 h-4 transition-colors ${statusColor[status]}`}>
        {statusText[status]}
      </div>
    </div>
  );
}

// 工具函式：讀取所有紀錄（供匯出用）
export { readRecords, STORAGE_KEY };
