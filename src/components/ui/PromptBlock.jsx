import React, { useState, useCallback } from 'react';
import { Bot, Copy, Check } from 'lucide-react';

/**
 * PromptBlock — 統一的 AI Prompt 顯示框（黑底 + 複製按鈕）
 *
 * 全站 W9/W10/W13/W14/W15 prompt 顯示統一用此元件。
 *
 * Props:
 * - text (string, required): prompt 內容（會放在 <pre> 裡）
 * - label (string): header 顯示的標籤，預設「AI Prompt — 點右邊複製」
 * - className: 額外 class
 *
 * 視覺：黑底白字 + 上方深灰 header bar + 一鍵複製按鈕（已複製時顯示 ✓ 已複製）
 */

const PromptBlock = ({ text, label, className = '' }) => {
    const [copied, setCopied] = useState(false);
    const handleCopy = useCallback(() => {
        navigator.clipboard.writeText(text).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }).catch(() => {
            /* fallback for older browsers */
            const ta = document.createElement('textarea');
            ta.value = text;
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    }, [text]);

    return (
        <div
            className={className}
            style={{
                borderRadius: 'var(--radius-unified)',
                overflow: 'hidden',
                background: '#0F172A',
            }}
        >
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 14px',
                    background: '#1E293B',
                    borderBottom: '1px solid rgba(255,255,255,0.08)',
                    gap: 8,
                }}
            >
                <span
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        fontSize: 11,
                        fontWeight: 700,
                        color: 'rgba(255,255,255,0.7)',
                        fontFamily: 'var(--font-mono)',
                        letterSpacing: '0.04em',
                    }}
                >
                    <Bot size={13} /> {label || 'AI Prompt — 點右邊複製'}
                </span>
                <button
                    onClick={handleCopy}
                    type="button"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                        padding: '4px 10px',
                        fontSize: 11,
                        fontWeight: 700,
                        color: '#fff',
                        background: copied ? '#16A34A' : 'var(--accent)',
                        border: 'none',
                        borderRadius: 4,
                        cursor: 'pointer',
                        flexShrink: 0,
                        transition: 'background 0.15s',
                    }}
                >
                    {copied ? <><Check size={12} /> 已複製</> : <><Copy size={12} /> 複製</>}
                </button>
            </div>
            <pre
                style={{
                    padding: 14,
                    margin: 0,
                    fontSize: 11.5,
                    lineHeight: 1.75,
                    color: '#E2E8F0',
                    fontFamily: 'var(--font-mono)',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    maxHeight: 480,
                    overflowY: 'auto',
                }}
            >
                {text}
            </pre>
        </div>
    );
};

export default PromptBlock;
export { PromptBlock };
