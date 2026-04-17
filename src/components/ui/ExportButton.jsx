import React, { useState, useCallback } from 'react';
import { Copy, Check, Download } from 'lucide-react';
import { readRecords } from './ThinkRecord';

/**
 * ExportButton — 一鍵複製本頁所有學習紀錄
 *
 * Props:
 *   weekLabel  (string)  — 週次標題，如 "W1 模仿遊戲"
 *   fields     (array)   — 要匯出的欄位定義
 *     [{ key: 'w1-seed', label: '生活觀察種子', question: '題目文字（選填）' }, ...]
 *   choices    (array)   — 選擇題結果（由父組件傳入）
 *     [{ question: '...', selected: 'B', correct: true }, ...]
 *   className  (string)
 */

export default function ExportButton({
  weekLabel = '',
  fields = [],
  choices = [],
  className = '',
}) {
  const [copied, setCopied] = useState(false);

  const buildText = useCallback(() => {
    const records = readRecords();
    const now = new Date();
    const dateStr = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')}`;

    let lines = [];
    lines.push(`【${weekLabel}｜上課紀錄】`);
    lines.push(`日期：${dateStr}`);
    lines.push('');

    // 文字紀錄
    let hasContent = false;
    fields.forEach((f, i) => {
      const val = records[f.key]?.trim();
      if (val) {
        hasContent = true;
        lines.push(`■ ${f.label}`);
        if (f.question) lines.push(`  Q: ${f.question}`);
        lines.push(`  ${val}`);
        lines.push('');
      }
    });

    // 選擇題
    if (choices.length > 0) {
      lines.push('■ 理解檢核');
      choices.forEach((c, i) => {
        if (c.selected) {
          const mark = c.correct ? '✓' : '✗';
          lines.push(`Q${i + 1}: ${c.question}`);
          lines.push(`→ ${c.selected} (${mark})`);
        }
      });
      lines.push('');
      hasContent = true;
    }

    if (!hasContent) return null;

    lines.push('---');
    lines.push('松山高中 研究方法與專題 · 上課紀錄');
    return lines.join('\n');
  }, [weekLabel, fields, choices]);

  const handleCopy = useCallback(async () => {
    const text = buildText();
    if (!text) {
      alert('還沒有填寫任何紀錄！先完成課堂練習再複製。');
      return;
    }
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.cssText = 'position:fixed;left:-9999px';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  }, [buildText]);

  return (
    <button
      onClick={handleCopy}
      className={`
        w-full flex items-center justify-center gap-3 px-6 py-4
        rounded-[var(--radius-unified)] border-2 font-bold text-[14px]
        transition-all
        ${copied
          ? 'bg-[var(--success-light)] border-[var(--success)] text-[var(--success)]'
          : 'bg-[var(--ink)] border-[var(--ink)] text-white hover:bg-[var(--ink)]/90'
        }
        ${className}
      `}
    >
      {copied ? (
        <>
          <Check size={18} />
          已複製！請貼到 Google Classroom 繳交
        </>
      ) : (
        <>
          <Copy size={18} />
          一鍵複製本堂課紀錄
        </>
      )}
    </button>
  );
}
