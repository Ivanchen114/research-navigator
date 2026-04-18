import React, { useState, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

/**
 * StepEngine — 一屏一任務分步導覽
 *
 * Props:
 *   steps     (array, required) — [{ title, icon, content: <JSX> }, ...]
 *   prevWeek  (object)          — { label: '回 W1 模仿遊戲', to: '/w1' }
 *   nextWeek  (object)          — { label: '前往 W3 題目健檢', to: '/w3' }
 *   weekCode  (string)          — 顯示在底部檔案編號列，如 "R.I.B. · W2"
 *   flat      (boolean)         — 拿掉內容面板的白卡外殼，讓內容直接跟頁面背景融合
 *   className (string)
 */

export default function StepEngine({ steps, prevWeek, nextWeek, weekCode, flat = false, className = '' }) {
  const [current, setCurrent] = useState(0);
  const total = steps.length;
  const topRef = useRef(null);

  const isFirst = current === 0;
  const isLast = current === total - 1;

  const goTo = useCallback((idx) => {
    if (idx >= 0 && idx < total) {
      setCurrent(idx);
      requestAnimationFrame(() => {
        topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  }, [total]);

  return (
    <div className={`step-engine ${className}`} ref={topRef}>
      {/* STEP 計數器 — 當前步驟 / 總步驟 */}
      <div className="flex items-center justify-between mb-3">
        <div className="text-[10px] font-mono text-[var(--ink-light)] uppercase tracking-[0.18em]">
          STEP {current + 1} <span className="text-[var(--border-mid)]">/ {total}</span>
        </div>
        {steps[current]?.title && (
          <div className="text-[10px] font-mono text-[var(--ink-light)] uppercase tracking-[0.1em]">
            {steps[current].title}
          </div>
        )}
      </div>

      {/* TAB 列 */}
      <nav className="flex gap-1 mb-6 overflow-x-auto pb-1">
        {steps.map((step, i) => {
          const isActive = i === current;
          const isPast = i < current;
          return (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`
                flex items-center gap-1.5 px-3 py-2 rounded-[8px] text-[13px] font-mono
                whitespace-nowrap transition-all flex-shrink-0
                ${isActive
                  ? 'bg-[var(--ink)] text-white font-bold shadow-sm'
                  : isPast
                    ? 'bg-[var(--success-light)] text-[var(--success)] font-medium'
                    : 'bg-[var(--paper-warm)] text-[var(--ink-light)] hover:text-[var(--ink-mid)] hover:bg-[var(--paper)]'
                }
              `}
            >
              <span className="text-[12px]">{step.icon || `${i + 1}`}</span>
              <span>{step.title}</span>
              {isPast && <span className="text-[10px]">✓</span>}
            </button>
          );
        })}
      </nav>

      {/* 內容面板 */}
      <div
        className={
          flat
            ? 'step-engine-panel py-2 min-h-[200px]'
            : 'step-engine-panel bg-white border border-[var(--border)] rounded-[var(--radius-unified)] p-6 min-h-[200px]'
        }
      >
        {steps[current]?.content}
      </div>

      {/* 底部導覽 */}
      <div className="flex items-center justify-between mt-4">
        {/* 左側：上一步 或 回上週 */}
        {isFirst && prevWeek ? (
          <Link
            to={prevWeek.to}
            className="flex items-center gap-1 px-3 py-2 text-[13px] font-mono text-[var(--ink-light)] hover:text-[var(--ink)] transition-colors"
          >
            <ChevronLeft size={14} /> {prevWeek.label}
          </Link>
        ) : (
          <button
            onClick={() => goTo(current - 1)}
            disabled={isFirst}
            className="flex items-center gap-1 px-3 py-2 text-[13px] font-mono text-[var(--ink-mid)] hover:text-[var(--ink)] disabled:opacity-30 disabled:cursor-default transition-colors"
          >
            <ChevronLeft size={14} /> 上一步
          </button>
        )}

        {/* 圓點進度 */}
        <div className="flex items-center gap-2">
          {steps.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`
                w-2.5 h-2.5 rounded-full transition-all
                ${i === current
                  ? 'bg-[var(--accent)] scale-125'
                  : i < current
                    ? 'bg-[var(--success)]'
                    : 'bg-[var(--border-mid)]'
                }
              `}
              aria-label={`前往第 ${i + 1} 步`}
            />
          ))}
        </div>

        {/* 右側：下一步 或 前往下週 */}
        {isLast && nextWeek ? (
          <Link
            to={nextWeek.to}
            className="flex items-center gap-2 px-5 py-2.5 bg-[var(--ink)] text-white text-[13px] font-bold rounded-[8px] hover:opacity-90 transition-all group"
          >
            {nextWeek.label} <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        ) : (
          <button
            onClick={() => goTo(current + 1)}
            disabled={isLast}
            className="flex items-center gap-1 px-3 py-2 text-[13px] font-mono text-[var(--ink-mid)] hover:text-[var(--ink)] disabled:opacity-30 disabled:cursor-default transition-colors"
          >
            下一步 <ChevronRight size={14} />
          </button>
        )}
      </div>

      {/* 檔案編號頁尾 */}
      {weekCode && (
        <div className="mt-8 pt-4 border-t border-dashed border-[var(--border-mid)]/40 flex items-center justify-between text-[10px] font-mono text-[var(--ink-light)]/70 tracking-[0.15em]">
          <span>● {weekCode} · STEP {current + 1}</span>
          <span>{current + 1} / {total}</span>
        </div>
      )}
    </div>
  );
}
