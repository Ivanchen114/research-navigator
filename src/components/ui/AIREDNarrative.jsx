import React, { useState } from 'react';
import ThinkRecord from './ThinkRecord';

/**
 * AIREDNarrative — AI-RED 敘事版記錄框
 *
 * Props:
 *   week    (string, required)  — 週次識別，用來組 dataKey，如 "3"、"10"、"11"
 *   hint    (string, optional)  — 本週情境提示（顯示於標題列）
 *   rows    (number, default 10)
 *   optional(boolean, default false) — 若為 true，顯示「本週沒用到 AI 可跳過」
 */

/* ── AIRED 鷹架（縱向清單，每列一行，顏色清楚標示） ── */
const AIRED_ROWS = [
    {
        key: 'A',
        text: '我使用___（ChatGPT / Gemini / Claude），丟了我的___給它',
        color: '#1D4ED8',
        bg: '#EFF6FF',
        border: '#BFDBFE',
    },
    {
        key: 'I',
        text: '我問它：___',
        color: '#6D28D9',
        bg: '#F5F3FF',
        border: '#DDD6FE',
    },
    {
        key: '↓',
        text: 'AI 回應：___（貼 AI 的關鍵回覆或摘要重點）',
        color: '#6B7280',
        bg: '#F9FAFB',
        border: '#E5E7EB',
        indent: true,
    },
    {
        key: 'R',
        text: '我查證了___（查原始資料／找可靠來源／問老師或同學）',
        color: '#0F766E',
        bg: '#F0FDFA',
        border: '#99F6E4',
    },
    {
        key: 'E',
        text: '評估：我 採納／部分採納／拒絕 了 AI 的建議，因為___',
        color: '#B45309',
        bg: '#FFFBEB',
        border: '#FCD34D',
    },
    {
        key: 'D',
        text: '對話記錄：___（對話名稱或連結，方便日後回查）',
        color: '#475569',
        bg: '#F8FAFC',
        border: '#CBD5E1',
    },
];

const DEFAULT_PLACEHOLDER = `用你自己的話把這次 AI 互動寫下來，按 A → I → R → E → D 的順序各寫一句話就夠了。`;

/* —— 範例：採納型 —— */
const EXAMPLE_ADOPT = `A 我使用 Gemini，丟了我的研究題目和動機給它。
I 我問它：「這個題目有什麼地方不夠聚焦？」
  AI 回應：說我的題目「變項太模糊」，建議把「手機使用」具體化為「每日使用時數」，並說某研究指出高中生平均使用時數 4 小時。
R 我查證了——Google 搜尋「高中生手機使用時數 研究」，找到兩篇文獻確實有類似數字。
E 評估：我採納了把「手機使用」改成「每日使用時數」的建議，但沒引用它說的那個數據，因為我要用自己查到、來源清楚的文獻。
D 對話記錄：Gemini - 題目聚焦討論 0418`;

/* —— 範例：不採納型 —— */
const EXAMPLE_REJECT = `A 我使用 ChatGPT，丟了我設計的問卷題目請它幫忙檢查。
I 我問它：「這些選項有沒有問題？」
  AI 回應：說我的第 3 題「選項不夠完整」，建議加入「以上皆是／以上皆非」兩個選項。
R 我去問了老師，老師說「以上皆是／皆非」會讓資料分析失去意義。我也追問 ChatGPT 為什麼建議這樣做，它回答只是為了讓選項看起來完整。
E 評估：我拒絕了這個建議，反而把第 3 題改成複選題。AI 在「格式完整性」上的直覺不一定符合研究目的。
D 對話記錄：ChatGPT - 問卷檢核 0418（未採納）`;

/* —— 範例：部分採納型 —— */
const EXAMPLE_PARTIAL = `A 我使用 Claude，把我的訪談大綱貼給它。
I 我問它：「哪些題目會讓受訪者不敢說實話？」
  AI 回應：指出 5 題裡 2 題過於直接，建議改成情境題；另外也建議刪掉一題我覺得很重要的問題。
R 我去問了兩位同學這 2 題會不會有壓力，他們都說會——確認了 AI 的判斷。
E 評估：我採納了改情境題的建議；但 AI 建議刪的那題我保留，因為那題是我研究動機的核心。
D 對話記錄：Claude - 訪談大綱潤飾 0418`;

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
                <div className="px-4 py-3 bg-white text-[12.5px] text-[var(--ink-mid)] leading-[1.9] whitespace-pre-wrap border-t border-[var(--border)] font-sans">
                    {children}
                </div>
            )}
        </div>
    );
}

/* 縱向鷹架清單 */
function AiredScaffold() {
    return (
        <div className="mb-3 rounded-[6px] border border-[var(--border)] overflow-hidden text-[12px]">
            <div className="px-3 py-1.5 bg-[var(--paper-warm)] border-b border-[var(--border)]">
                <span className="text-[10px] font-mono text-[var(--ink-light)] uppercase tracking-[0.1em]">
                    💡 鷹架提示（寫完後不用保留這些標籤，直接寫你的版本）
                </span>
            </div>
            {AIRED_ROWS.map((row) => (
                <div
                    key={row.key}
                    className="flex items-start border-b last:border-b-0"
                    style={{ borderColor: row.border, background: row.bg }}
                >
                    {/* 標籤欄 */}
                    <div
                        className="w-9 shrink-0 flex items-center justify-center py-2.5 self-stretch border-r"
                        style={{ borderColor: row.border }}
                    >
                        <span
                            className={`text-[11px] font-mono font-bold ${row.indent ? 'opacity-50' : ''}`}
                            style={{ color: row.color }}
                        >
                            {row.key}
                        </span>
                    </div>
                    {/* 內容欄 */}
                    <div className={`px-3 py-2.5 flex-1 leading-relaxed ${row.indent ? 'pl-6' : ''}`}>
                        <span
                            className={`${row.indent ? 'text-[11.5px] text-[#9CA3AF] italic' : 'text-[12px]'}`}
                            style={row.indent ? {} : { color: row.color }}
                        >
                            {row.indent ? row.text : (
                                <>
                                    <strong style={{ color: row.color }}>{row.key}</strong>
                                    <span className="text-[var(--ink-mid)]">　{row.text.replace(/^[A-Z↓]+\s*/, '')}</span>
                                </>
                            )}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default function AIREDNarrative({ week, hint, rows = 10, optional = false }) {
    const dataKey = `w${week}-aired-record`;
    const prompt = hint
        ? `AI-RED 敘事紀錄 · ${hint}`
        : 'AI-RED 敘事紀錄（寫下這次最重要的一次 AI 互動）';

    return (
        <div className="rounded-[8px] border border-[var(--accent)]/25 bg-[var(--accent-light)]/40 p-4 md:p-5">
            {/* 標題列 */}
            <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="inline-block bg-[var(--ink)] text-white text-[10px] font-bold px-2 py-0.5 rounded-[2px] font-mono tracking-wider">AI-RED</span>
                <span className="text-[11px] font-mono text-[var(--ink-light)] uppercase tracking-[0.1em]">敘事版 · 一次最關鍵的互動</span>
                {optional && (
                    <span className="text-[10px] font-mono bg-[var(--ink-light)]/15 text-[var(--ink-mid)] px-2 py-0.5 rounded-full">本週若沒用 AI 可略過</span>
                )}
            </div>

            {/* 說明 */}
            <p className="text-[13px] text-[var(--ink-mid)] leading-[1.75] mb-3">
                每個要素<strong className="text-[var(--ink)]">寫一句話</strong>就夠了——重點是 R（你怎麼查證）和 E（你怎麼判斷採納或拒絕）。
                {optional ? ' 課堂沒規定用 AI 也算，只要你用了就記下來。' : ''}
            </p>

            {/* 縱向鷹架 */}
            <AiredScaffold />

            {/* 範例展開區 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-4">
                <ExampleToggle label="① 採納型範例" color="success">{EXAMPLE_ADOPT}</ExampleToggle>
                <ExampleToggle label="② 不採納型範例" color="danger">{EXAMPLE_REJECT}</ExampleToggle>
                <ExampleToggle label="③ 部分採納型範例" color="warn">{EXAMPLE_PARTIAL}</ExampleToggle>
            </div>

            {/* 作答框（scaffold 由上方自訂清單取代，這裡傳空陣列避免 pill 重複出現） */}
            <ThinkRecord
                dataKey={dataKey}
                prompt={prompt}
                placeholder={DEFAULT_PLACEHOLDER}
                scaffold={[]}
                rows={rows}
            />
        </div>
    );
}
