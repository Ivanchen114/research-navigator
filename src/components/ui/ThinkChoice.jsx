import React, { useState, useEffect, useRef } from 'react';

/**
 * ThinkChoice — 即時選擇題回饋（含 localStorage 持久化）
 *
 * Props:
 *   prompt    (string, required)  — 題目（同時作為 localStorage key）
 *   options   (array, required)   — [{ label: 'A', text: '選項文字' }, ...]
 *   answer    (string, required)  — 正確答案的 label，如 "B"
 *   feedback  (string)            — 答對後顯示的解說
 *   onAnswer  (function)          — 選擇後的回呼 (label, isCorrect) => void
 *   dataKey   (string)            — 自訂 localStorage key（可選，預設用 prompt）
 *   className (string)            — 額外 class
 */

export default function ThinkChoice({
  prompt,
  options,
  answer,
  feedback,
  onAnswer,
  dataKey,
  className = '',
}) {
  const storageKey = `think-choice::${dataKey || prompt}`;
  const [selected, setSelected] = useState(() => {
    try { return localStorage.getItem(storageKey) || null; } catch { return null; }
  });
  const answered = selected !== null;
  const isCorrect = selected === answer;

  /* 恢復時通知父元件 */
  const onAnswerRef = useRef(onAnswer);
  onAnswerRef.current = onAnswer;
  const mountedRef = useRef(false);
  useEffect(() => {
    if (!mountedRef.current && selected !== null && onAnswerRef.current) {
      onAnswerRef.current(selected, selected === answer);
    }
    mountedRef.current = true;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSelect = (label) => {
    if (answered) return;
    setSelected(label);
    try { localStorage.setItem(storageKey, label); } catch {}
    if (onAnswer) onAnswer(label, label === answer);
  };

  const handleReset = () => {
    setSelected(null);
    try { localStorage.removeItem(storageKey); } catch {}
  };

  return (
    <div className={`think-choice-wrap ${className}`}>
      {/* 題目 */}
      <div className="flex items-start gap-2 mb-3">
        <span className="text-[14px]">🎯</span>
        <p className="text-[14px] font-bold text-[var(--ink)] leading-relaxed flex-1">{prompt}</p>
        {answered && (
          <button
            onClick={handleReset}
            className="flex-shrink-0 text-[11px] text-[var(--ink-light)] hover:text-[var(--accent)] transition-colors"
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px 0' }}
          >
            重新作答
          </button>
        )}
      </div>

      {/* 選項 */}
      <div className="flex flex-col gap-2">
        {options.map((opt) => {
          const isThis = selected === opt.label;
          const isAnswer = opt.label === answer;

          let borderColor = 'border-[var(--border)]';
          let bgColor = 'bg-white';
          let textColor = 'text-[var(--ink)]';
          let labelBg = 'bg-[var(--paper-warm)]';
          let cursor = 'cursor-pointer hover:border-[var(--accent)] hover:bg-[var(--accent-light)]/30';

          if (answered) {
            cursor = 'cursor-default';
            if (isAnswer) {
              borderColor = 'border-[var(--success)]';
              bgColor = 'bg-[var(--success-light)]';
              labelBg = 'bg-[var(--success)]';
              textColor = 'text-[var(--success)]';
            } else if (isThis && !isCorrect) {
              borderColor = 'border-[var(--danger)]';
              bgColor = 'bg-[var(--danger-light)]';
              labelBg = 'bg-[var(--danger)]';
              textColor = 'text-[var(--danger)]';
            } else {
              borderColor = 'border-[var(--border)]';
              bgColor = 'bg-[var(--paper)]';
              textColor = 'text-[var(--ink-light)]';
            }
          }

          return (
            <button
              key={opt.label}
              onClick={() => handleSelect(opt.label)}
              disabled={answered}
              className={`flex items-center gap-3 w-full text-left px-4 py-3 rounded-[var(--radius-unified)] border ${borderColor} ${bgColor} ${cursor} transition-all`}
            >
              <span className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-bold font-mono ${answered && (isAnswer || isThis) ? 'text-white' : 'text-[var(--ink-mid)]'} ${labelBg} transition-colors`}>
                {answered && isAnswer ? '✓' : answered && isThis && !isCorrect ? '✗' : opt.label}
              </span>
              <span className={`text-[14px] leading-snug ${textColor} transition-colors`}>
                {opt.text}
              </span>
            </button>
          );
        })}
      </div>

      {/* 回饋 */}
      {answered && feedback && (
        <div className={`mt-3 px-4 py-3 rounded-[var(--radius-unified)] text-[13px] leading-relaxed border-l-[3px] ${isCorrect ? 'bg-[var(--success-light)] border-[var(--success)] text-[var(--ink)]' : 'bg-[var(--danger-light)] border-[var(--danger)] text-[var(--ink)]'}`}>
          {isCorrect ? '✅ ' : '❌ '}{feedback}
        </div>
      )}
    </div>
  );
}
