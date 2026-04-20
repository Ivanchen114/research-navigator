import React, { useState, useCallback } from 'react';
import { Bot, Copy, Check, PenLine } from 'lucide-react';
import ThinkRecord from './ThinkRecord';

/**
 * AIAssistToggle — 讓學生自主選擇是否使用 AI 協助。
 *
 * 三狀態：
 *   未選     → 顯示兩個選項（🤖 要用 AI / ✍️ 自己寫）
 *   選「用」 → 展開可複製 Prompt + 強制記錄 ThinkRecord
 *   選「跳」 → 摺疊為一行提示，使用者直接進下面的填寫區
 *
 * Props:
 *   id                (string, required) — 用來當 localStorage key（ai-toggle::{id}）
 *   title             (string)           — 標題文字
 *   reason            (string)           — 副標，簡述 AI 能幫什麼
 *   prompt            (string)           — 單一 Prompt 文字（method-agnostic）
 *   promptByMethod    (object)           — { questionnaire: '...', interview: '...', ... }
 *   method            (string)           — 目前偵測到的方法 id；與 promptByMethod 搭配使用
 *   recordKey         (string, required) — ThinkRecord 的 dataKey
 *   recordPrompt      (string)           — ThinkRecord 題目
 *   recordPlaceholder (string)           — ThinkRecord placeholder
 */

const CopyBox = ({ text }) => {
    const [copied, setCopied] = useState(false);
    const copy = useCallback(() => {
        navigator.clipboard.writeText(text).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }).catch(() => {
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
        <div className="bg-white border border-[var(--border)] rounded-[var(--radius-unified)] overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 bg-[var(--ink)] text-white">
                <span className="text-[11px] font-mono font-bold flex items-center gap-1.5">
                    <Bot size={12} /> AI Prompt — 複製後貼到 AI 對話窗
                </span>
                <button
                    onClick={copy}
                    className="text-[11px] flex items-center gap-1 hover:opacity-80"
                    style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}
                    type="button"
                >
                    {copied ? <><Check size={11} /> 已複製</> : <><Copy size={11} /> 複製</>}
                </button>
            </div>
            <pre className="p-3 text-[12px] text-[var(--ink)] whitespace-pre-wrap font-mono leading-relaxed bg-[var(--paper-warm)]">{text}</pre>
        </div>
    );
};

export default function AIAssistToggle({
    id,
    title = '需要 AI 協助嗎？',
    reason = '',
    prompt = '',
    promptByMethod = null,
    method = '',
    recordKey,
    recordPrompt = '你從 AI 給的版本中選了什麼？刷掉什麼？為什麼？',
    recordPlaceholder = '我選了___版本，因為___\n我刷掉___版本，因為___',
}) {
    const storageKey = `ai-toggle::${id}`;
    const [choice, setChoice] = useState(() => {
        try { return localStorage.getItem(storageKey) || null; } catch { return null; }
    });

    const pick = (c) => {
        setChoice(c);
        try { localStorage.setItem(storageKey, c); } catch {}
    };
    const reset = () => {
        setChoice(null);
        try { localStorage.removeItem(storageKey); } catch {}
    };

    const activePrompt = promptByMethod ? (promptByMethod[method] || prompt) : prompt;

    return (
        <div className="border border-[var(--border)] rounded-[var(--radius-unified)] overflow-hidden bg-white">
            <div className="px-4 py-3 bg-[var(--paper-warm)] border-b border-[var(--border)] flex items-center gap-2">
                <span className="text-[14px]">🤖</span>
                <span className="font-bold text-[13px] text-[var(--ink)] flex-1">{title}</span>
                <span className="text-[10px] font-mono text-[var(--ink-light)] hidden md:inline">OPT-IN</span>
                {choice && (
                    <button
                        onClick={reset}
                        className="text-[11px] text-[var(--ink-light)] hover:text-[var(--accent)] transition-colors"
                        style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                        type="button"
                    >
                        變更
                    </button>
                )}
            </div>

            {!choice && (
                <div className="p-4 space-y-3">
                    {reason && (
                        <p className="text-[13px] text-[var(--ink-mid)] leading-relaxed">{reason}</p>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <button
                            onClick={() => pick('use')}
                            className="p-3 rounded-[8px] border border-[var(--border)] bg-white hover:border-[var(--accent)] hover:bg-[var(--accent-light)]/30 transition-all text-left cursor-pointer"
                            type="button"
                        >
                            <span className="text-[16px]">🤖</span>
                            <strong className="block text-[13px] text-[var(--ink)] mt-0.5">要用 AI 協助</strong>
                            <span className="text-[11px] text-[var(--ink-mid)] block">看 Prompt 後要留判斷紀錄</span>
                        </button>
                        <button
                            onClick={() => pick('skip')}
                            className="p-3 rounded-[8px] border border-[var(--border)] bg-white hover:border-[var(--accent)] hover:bg-[var(--accent-light)]/30 transition-all text-left cursor-pointer"
                            type="button"
                        >
                            <span className="text-[16px]">✍️</span>
                            <strong className="block text-[13px] text-[var(--ink)] mt-0.5">自己寫</strong>
                            <span className="text-[11px] text-[var(--ink-mid)] block">跳過 AI，直接進下方填寫區</span>
                        </button>
                    </div>
                </div>
            )}

            {choice === 'skip' && (
                <div className="p-4 flex items-center gap-2 text-[12px] text-[var(--ink-light)]">
                    <PenLine size={13} />
                    <span>已選擇自己寫——下方填寫區請直接動手。</span>
                </div>
            )}

            {choice === 'use' && (
                <div className="p-4 space-y-4">
                    {activePrompt ? (
                        <CopyBox text={activePrompt} />
                    ) : (
                        <div className="bg-[var(--paper-warm)] border border-[var(--border)] rounded-[6px] p-3 text-[12px] text-[var(--ink-mid)]">
                            ⚠️ 未偵測到研究方法。請先回上一步選擇方法，這裡才會顯示對應的 Prompt。
                        </div>
                    )}

                    <div className="bg-[var(--danger-light)] border-l-[3px] border-[var(--danger)] p-3 rounded-[4px] text-[12px] text-[var(--ink)] leading-relaxed">
                        <strong>⚠️ 必填記錄：</strong>用了 AI 就要留下判斷軌跡（AIRED 精神：Decide 要留證）。下方紀錄欄沒填 → Export 會缺這一格，代表你還沒完成這個環節。
                    </div>

                    <ThinkRecord
                        dataKey={recordKey}
                        prompt={recordPrompt}
                        placeholder={recordPlaceholder}
                        rows={5}
                    />
                </div>
            )}
        </div>
    );
}
