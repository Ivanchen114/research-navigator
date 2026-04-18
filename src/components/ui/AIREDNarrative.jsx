import React, { useState } from 'react';
import ThinkRecord from './ThinkRecord';

/**
 * AIREDNarrative — AI-RED 敘事版記錄框
 *
 * 教學邏輯：W2 完整五欄表格、W4 單欄打底之後，學生應該能把 AIRED 寫成一段
 * 自然敘事。即使本週課堂沒規定用 AI，只要學生自主用了 AI 協助研究，就要記錄。
 *
 * Props:
 *   week    (string, required)  — 週次識別，用來組 dataKey，如 "3"、"10"、"11"
 *   hint    (string, optional)  — 本週情境提示
 *   rows    (number, default 10)
 *   optional(boolean, default false) — 若為 true，顯示「本週沒用到 AI 可跳過」
 */

const DEFAULT_SCAFFOLD = [
    'A 我使用___（ChatGPT/Gemini/Claude），丟了我的___給它',
    'I 我問它：___',
    'AI 回應：___（貼 AI 的關鍵回覆或摘要重點）',
    'R 我查證了___（用 Google／再追問 AI／問老師／查原始文獻）',
    'E 評估：我 採納／部分採納／拒絕 了 AI 的建議，因為___',
    'D 對話記錄：___（對話名稱或連結，方便日後回查）',
];

const DEFAULT_PLACEHOLDER = `點開下方範例看兩種寫法（採納 vs 不採納），然後用你自己的話寫下本週印象最重要的一次 AI 互動…`;

/* —— 範例：採納型 —— */
const EXAMPLE_ADOPT = `我使用 Gemini，丟了我的研究題目和動機給它，詢問它針對我的題目有什麼需要修改、哪些地方不夠聚焦。

Gemini 回應說我的題目「變項太模糊」，建議把「手機使用」具體化為「每日使用時數」，並說根據某研究，高中生平均使用時數是 4 小時。

我去查證——用 Google 搜尋「高中生手機使用時數 研究」，找到兩篇文獻確實有類似數字。我採納了 Gemini 把「手機使用」改成「每日使用時數」的建議，但沒引用它說的那個數據，因為我要用自己找到的一手文獻。

對話記錄：Gemini - 題目聚焦討論 0418`;

/* —— 範例：不採納型 —— */
const EXAMPLE_REJECT = `我使用 ChatGPT，丟了我設計的問卷題目請它幫忙檢查。

ChatGPT 回應說我的第 3 題「選項不夠完整」，建議加入「以上皆是／以上皆非」兩個選項。

我去問了老師，老師說「以上皆是／皆非」會讓資料分析失去意義，因為你不知道學生到底認同哪幾項。我也追問 ChatGPT 為什麼建議這樣做，它回答只是為了讓選項看起來完整。

我拒絕了這個建議，反而把第 3 題改成複選題。教訓：AI 在「格式完整性」上的直覺不一定符合研究目的，要靠人判斷。

對話記錄：ChatGPT - 問卷檢核 0418（未採納）`;

/* —— 範例：部分採納型 —— */
const EXAMPLE_PARTIAL = `我使用 Claude，把我的訪談大綱貼給它，問它「哪些題目會讓受訪者不敢說實話」。

Claude 指出 5 題裡面有 2 題過於直接（例如「你覺得老師公平嗎？」），建議改成情境題（「如果你看到老師對不同學生有不同反應，你通常怎麼解讀？」）。另外它也建議刪掉一題我覺得很重要的問題。

我去問了兩位同學這 2 題會不會有壓力，他們都說會——所以我採納了改情境題的建議。但 Claude 建議刪的那題我保留，因為那題是我研究動機的核心，不能少。

對話記錄：Claude - 訪談大綱潤飾 0418`;

function ExampleToggle({ label, children, color = 'success' }) {
    const [open, setOpen] = useState(false);
    const colorMap = {
        success: 'bg-[var(--success-light)] border-[var(--success)]/30 text-[var(--success)]',
        danger: 'bg-[var(--danger-light)] border-[var(--danger)]/30 text-[var(--danger)]',
        warn: 'bg-[var(--accent-light)] border-[var(--accent)]/30 text-[var(--accent)]',
    };
    return (
        <div className={`rounded-[6px] border ${colorMap[color]} overflow-hidden`}>
            <button
                type="button"
                onClick={() => setOpen(v => !v)}
                className={`w-full flex items-center justify-between px-3 py-2 text-[12px] font-mono font-bold ${colorMap[color]} hover:opacity-80 transition`}
            >
                <span>{label}</span>
                <span className="text-[10px]">{open ? '收起 ▲' : '展開看範例 ▼'}</span>
            </button>
            {open && (
                <div className="px-4 py-3 bg-white text-[13px] text-[var(--ink-mid)] leading-[1.85] whitespace-pre-wrap border-t border-[var(--border)] font-sans">
                    {children}
                </div>
            )}
        </div>
    );
}

export default function AIREDNarrative({ week, hint, rows = 10, optional = false }) {
    const dataKey = `w${week}-aired-record`;
    const prompt = hint
        ? `AI-RED 敘事紀錄 · ${hint}（寫下這次最重要的一次 AI 互動，涵蓋 A-I-R-E-D 五個要素）`
        : 'AI-RED 敘事紀錄（寫下這次最重要的一次 AI 互動，涵蓋 A-I-R-E-D 五個要素）';

    return (
        <div className="rounded-[8px] border border-[var(--accent)]/25 bg-[var(--accent-light)]/40 p-4 md:p-5">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="inline-block bg-[var(--ink)] text-white text-[10px] font-bold px-2 py-0.5 rounded-[2px] font-mono tracking-wider">AI-RED</span>
                <span className="text-[11px] font-mono text-[var(--ink-light)] uppercase tracking-[0.1em]">敘事版 · 循序漸進</span>
                {optional && (
                    <span className="text-[10px] font-mono bg-[var(--ink-light)]/15 text-[var(--ink-mid)] px-2 py-0.5 rounded-full">本週若沒用 AI 可略過</span>
                )}
            </div>
            <p className="text-[13px] text-[var(--ink-mid)] leading-[1.75] mb-3">
                五欄表格是訓練輪，現在用<strong className="text-[var(--ink)]">一段話</strong>把最重要的一次 AI 互動寫下來。{optional ? '就算課堂沒規定用 AI，只要你自主用過——就值得記錄。' : ''}重點不是填滿五欄，而是讓 A-I-R-E-D 變成你自然的思考節奏。
            </p>

            {/* 範例展開區 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-4">
                <ExampleToggle label="① 採納型範例" color="success">{EXAMPLE_ADOPT}</ExampleToggle>
                <ExampleToggle label="② 不採納型範例" color="danger">{EXAMPLE_REJECT}</ExampleToggle>
                <ExampleToggle label="③ 部分採納型範例" color="warn">{EXAMPLE_PARTIAL}</ExampleToggle>
            </div>

            <ThinkRecord
                dataKey={dataKey}
                prompt={prompt}
                placeholder={DEFAULT_PLACEHOLDER}
                scaffold={DEFAULT_SCAFFOLD}
                rows={rows}
            />
        </div>
    );
}
