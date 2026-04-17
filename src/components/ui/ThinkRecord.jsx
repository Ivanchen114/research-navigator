import React, { useState, useEffect, useRef, useCallback } from 'react';

/**
 * ThinkRecord — 自動存檔文字輸入框
 *
 * Props:
 *   dataKey   (string, required) — localStorage 鍵值，如 "w2-predict-1"
 *   prompt    (string)           — 提示文字
 *   placeholder (string)         — 輸入框提示
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
  scaffold,
  rows = 3,
  className = '',
}) {
  const [value, setValue] = useState('');
  const [status, setStatus] = useState('idle'); // idle | typing | saved | restored
  const timerRef = useRef(null);

  // 初始載入已存內容
  useEffect(() => {
    const records = readRecords();
    if (records[dataKey]) {
      setValue(records[dataKey]);
      setStatus('restored');
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
    <div className={`think-record-wrap ${className}`}>
      {prompt && (
        <div className="flex items-start gap-2 mb-2">
          <span className="text-[14px]">✏️</span>
          <p className="text-[14px] font-bold text-[var(--ink)] leading-relaxed">{prompt}</p>
        </div>
      )}

      {scaffold && scaffold.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-2">
          {scaffold.map((hint, i) => (
            <span
              key={i}
              className="inline-block text-[11px] px-2.5 py-1 rounded-full bg-[var(--accent-light)] text-[var(--accent)] border border-[var(--accent)]/15 font-mono cursor-default"
            >
              {hint}
            </span>
          ))}
        </div>
      )}

      <textarea
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={placeholder}
        rows={rows}
        className="w-full px-4 py-3 rounded-[var(--radius-unified)] border border-[var(--border)] bg-white text-[14px] leading-relaxed text-[var(--ink)] placeholder:text-[var(--ink-light)] focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/15 transition-all resize-y"
      />

      <div className={`text-[11px] font-mono mt-1.5 h-4 transition-colors ${statusColor[status]}`}>
        {statusText[status]}
      </div>
    </div>
  );
}

// 工具函式：讀取所有紀錄（供匯出用）
export { readRecords, STORAGE_KEY };
