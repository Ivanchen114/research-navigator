import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle2, Lock, Edit3, ShieldCheck } from 'lucide-react';
import { STORAGE_KEY as THINKRECORD_STORAGE_KEY } from './ThinkRecord';

/**
 * SignatureBlock — AI-RED 五字承諾簽署
 *
 * 教學設計：
 *   每條三選一（兩個範例承諾 + 自由發揮），五條都選完才解鎖簽名區。
 *   簽署後鎖定（防止學生反覆改），可按「修改」重新編輯。
 *   localStorage 永久保存，每週 Export 時帶出來。
 *
 * Props:
 *   dataKey  (string)   — localStorage key（預設 w1-aired-pledge）
 *   pledges  (array)    — 自訂承諾項；預設用 W1 的 AI-RED 5 條
 *   onChange (function) — 狀態變更時呼叫 (state) => void（給父元件追蹤）
 */

const DEFAULT_PLEDGES = [
    {
        letter: 'A', label: 'Ascribe', chinese: '標明工具',
        optionA: '我最容易隱瞞 AI 用法的時候，是自己寫得很順、卻不確定有沒有抄到 AI 的時候',
        optionB: '我最容易隱瞞 AI 用法的時候，是怕被同學覺得在作弊的時候',
    },
    {
        letter: 'I', label: 'Inquire', chinese: '提問紀錄',
        optionA: '留下 Prompt 紀錄能幫我之後想複製這種寫法時找得到',
        optionB: '留下 Prompt 紀錄能幫我看出自己問題問得好不好',
    },
    {
        letter: 'R', label: 'Reference', chinese: '引用標註',
        optionA: '我最容易直接相信 AI 的時候，是它講得很專業很完整的時候',
        optionB: '我最容易直接相信 AI 的時候，是我自己也不知道答案的時候',
    },
    {
        letter: 'E', label: 'Evaluate', chinese: '評估判斷',
        optionA: '我會用這個問題挑 AI 的毛病：「數字是哪來的？有出處嗎？」',
        optionB: '我會用這個問題挑 AI 的毛病：「這結論裡有沒有被跳過的人？」',
    },
    {
        letter: 'D', label: 'Document', chinese: '歷程記錄',
        optionA: '18 週後的我看到這份紀錄會發現：我怎麼從亂用 AI 變成有判斷力的人',
        optionB: '18 週後的我看到這份紀錄會發現：哪些事我堅持自己做，哪些事我學會交給 AI',
    },
];

function formatSignedAt(iso) {
    if (!iso) return '';
    try {
        const d = new Date(iso);
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const hh = String(d.getHours()).padStart(2, '0');
        const mm = String(d.getMinutes()).padStart(2, '0');
        return `${y}/${m}/${day} ${hh}:${mm}`;
    } catch { return ''; }
}

function buildExportText(state, pledges) {
    if (!state.signedAt || !state.signature) return '';
    const lines = pledges.map(p => {
        const c = state.choices[p.letter];
        let text = '（未選）';
        if (c === 'optionA') text = p.optionA;
        else if (c === 'optionB') text = p.optionB;
        else if (c === 'custom') text = (state.customTexts[p.letter] || '').trim() || '（未填）';
        return `${p.letter}（${p.chinese}）：${text}`;
    });
    return [
        ...lines,
        '',
        `簽署人：${state.signature}　·　簽署時間：${formatSignedAt(state.signedAt)}`,
    ].join('\n');
}

export default function SignatureBlock({ dataKey = 'w1-aired-pledge', pledges = DEFAULT_PLEDGES, onChange }) {
    const storageKey = `signature-block::${dataKey}`;

    const [state, setState] = useState(() => {
        try {
            const saved = localStorage.getItem(storageKey);
            if (saved) return JSON.parse(saved);
        } catch { /* ignore */ }
        return {
            choices: {},
            customTexts: {},
            signature: '',
            signedAt: null,
        };
    });

    /* 持久化 + 通知父元件 + 同步到 ThinkRecord STORAGE_KEY 供 ExportButton 讀取 */
    const onChangeRef = useRef(onChange);
    onChangeRef.current = onChange;
    useEffect(() => {
        try { localStorage.setItem(storageKey, JSON.stringify(state)); } catch { /* ignore */ }

        // 同步格式化字串到 ThinkRecord 的記錄表，讓 ExportButton 透過 dataKey 自動帶出
        if (state.signedAt && state.signature) {
            try {
                const records = JSON.parse(localStorage.getItem(THINKRECORD_STORAGE_KEY)) || {};
                records[dataKey] = buildExportText(state, pledges);
                localStorage.setItem(THINKRECORD_STORAGE_KEY, JSON.stringify(records));
            } catch { /* ignore */ }
        } else {
            // 未簽署 → 清掉 ThinkRecord 對應 key（避免殘留舊紀錄）
            try {
                const records = JSON.parse(localStorage.getItem(THINKRECORD_STORAGE_KEY)) || {};
                if (records[dataKey]) {
                    delete records[dataKey];
                    localStorage.setItem(THINKRECORD_STORAGE_KEY, JSON.stringify(records));
                }
            } catch { /* ignore */ }
        }

        if (onChangeRef.current) onChangeRef.current(state);
    }, [state, storageKey, dataKey, pledges]);

    const completedCount = pledges.filter(p => {
        const c = state.choices[p.letter];
        if (c === 'optionA' || c === 'optionB') return true;
        if (c === 'custom' && (state.customTexts[p.letter] || '').trim()) return true;
        return false;
    }).length;

    const allComplete = completedCount === pledges.length;
    const isSigned = !!(state.signedAt && state.signature);

    const handleChoice = (letter, choice) => {
        if (isSigned) return;
        setState(s => ({ ...s, choices: { ...s.choices, [letter]: choice } }));
    };
    const handleCustomText = (letter, text) => {
        if (isSigned) return;
        setState(s => ({ ...s, customTexts: { ...s.customTexts, [letter]: text } }));
    };
    const handleSignatureChange = (val) => {
        if (isSigned) return;
        setState(s => ({ ...s, signature: val }));
    };
    const handleSign = () => {
        if (!state.signature.trim() || !allComplete) return;
        setState(s => ({ ...s, signedAt: new Date().toISOString() }));
    };
    const handleEdit = () => {
        setState(s => ({ ...s, signedAt: null }));
    };

    return (
        <div className="border-2 border-[var(--accent)]/30 rounded-[var(--radius-unified)] overflow-hidden">
            {/* Header */}
            <div className="p-4 px-5 bg-[var(--accent-light)] border-b border-[var(--accent)]/20 flex items-center gap-3 flex-wrap">
                <ShieldCheck className="text-[var(--accent)]" size={20} />
                <div className="flex-1 min-w-0">
                    <div className="text-[10px] font-mono uppercase tracking-[0.15em] text-[var(--accent)] font-bold">AI-RED 協作公約</div>
                    <h4 className="font-serif text-[16px] font-bold text-[var(--ink)] mt-0.5">五字承諾 · 親手簽署</h4>
                </div>
                <div className="text-[11px] font-mono text-[var(--ink-mid)]">
                    已選 <span className="font-bold text-[var(--accent)] text-[14px]">{completedCount}</span> / {pledges.length}
                </div>
            </div>

            <div className="p-5 bg-white flex flex-col gap-4">
                <p className="text-[12.5px] text-[var(--ink-mid)] leading-[1.75]">
                    AI-RED 不是給老師看的——是給<strong>未來 18 週的自己</strong>看的。每條選一個最像你的承諾，或寫下自己的版本。五條都選完，才能簽下你的名字。
                </p>

                {/* 五條承諾 */}
                {pledges.map(p => {
                    const choice = state.choices[p.letter];
                    const customText = state.customTexts[p.letter] || '';
                    const isDone = (choice === 'optionA' || choice === 'optionB') ||
                                   (choice === 'custom' && customText.trim());

                    return (
                        <div key={p.letter} className={`border rounded-[var(--radius-unified)] overflow-hidden transition-colors ${isDone ? 'border-[var(--success)]/40 bg-[var(--success-light)]/30' : 'border-[var(--border)] bg-white'}`}>
                            {/* 字母 Header */}
                            <div className="p-3 px-4 bg-[var(--paper-warm)] border-b border-[var(--border)] flex items-center gap-3">
                                <div className={`w-9 h-9 rounded-full flex items-center justify-center font-mono font-bold text-[18px] ${isDone ? 'bg-[var(--success)] text-white' : 'bg-white border border-[var(--accent)]/30 text-[var(--accent)]'}`}>
                                    {isDone ? '✓' : p.letter}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-[13px] font-bold text-[var(--ink)]">{p.label} · {p.chinese}</div>
                                </div>
                            </div>

                            {/* 三個選項 */}
                            <div className="flex flex-col divide-y divide-[var(--border)]">
                                {/* 選項 A */}
                                <button
                                    type="button"
                                    onClick={() => handleChoice(p.letter, 'optionA')}
                                    disabled={isSigned}
                                    className={`text-left p-4 px-5 flex items-start gap-3 transition-colors ${choice === 'optionA' ? 'bg-[var(--accent-light)]' : 'bg-white hover:bg-[var(--paper)]'} ${isSigned ? 'cursor-default opacity-70' : 'cursor-pointer'}`}
                                >
                                    <div className={`shrink-0 w-5 h-5 rounded-full border-2 mt-0.5 flex items-center justify-center ${choice === 'optionA' ? 'border-[var(--accent)] bg-[var(--accent)]' : 'border-[var(--border)] bg-white'}`}>
                                        {choice === 'optionA' && <div className="w-2 h-2 rounded-full bg-white" />}
                                    </div>
                                    <span className="text-[13px] text-[var(--ink)] leading-[1.7] flex-1">{p.optionA}</span>
                                </button>

                                {/* 選項 B */}
                                <button
                                    type="button"
                                    onClick={() => handleChoice(p.letter, 'optionB')}
                                    disabled={isSigned}
                                    className={`text-left p-4 px-5 flex items-start gap-3 transition-colors ${choice === 'optionB' ? 'bg-[var(--accent-light)]' : 'bg-white hover:bg-[var(--paper)]'} ${isSigned ? 'cursor-default opacity-70' : 'cursor-pointer'}`}
                                >
                                    <div className={`shrink-0 w-5 h-5 rounded-full border-2 mt-0.5 flex items-center justify-center ${choice === 'optionB' ? 'border-[var(--accent)] bg-[var(--accent)]' : 'border-[var(--border)] bg-white'}`}>
                                        {choice === 'optionB' && <div className="w-2 h-2 rounded-full bg-white" />}
                                    </div>
                                    <span className="text-[13px] text-[var(--ink)] leading-[1.7] flex-1">{p.optionB}</span>
                                </button>

                                {/* 選項 C 自由發揮 */}
                                <div>
                                    <button
                                        type="button"
                                        onClick={() => handleChoice(p.letter, 'custom')}
                                        disabled={isSigned}
                                        className={`w-full text-left p-4 px-5 flex items-start gap-3 transition-colors ${choice === 'custom' ? 'bg-[var(--accent-light)]' : 'bg-white hover:bg-[var(--paper)]'} ${isSigned ? 'cursor-default opacity-70' : 'cursor-pointer'}`}
                                    >
                                        <div className={`shrink-0 w-5 h-5 rounded-full border-2 mt-0.5 flex items-center justify-center ${choice === 'custom' ? 'border-[var(--accent)] bg-[var(--accent)]' : 'border-[var(--border)] bg-white'}`}>
                                            {choice === 'custom' && <div className="w-2 h-2 rounded-full bg-white" />}
                                        </div>
                                        <span className="text-[13px] text-[var(--ink-mid)] italic leading-[1.7] flex-1">以上都不是，我的承諾是……</span>
                                    </button>
                                    {choice === 'custom' && (
                                        <div className="px-5 pb-4">
                                            <textarea
                                                value={customText}
                                                onChange={(e) => handleCustomText(p.letter, e.target.value)}
                                                disabled={isSigned}
                                                rows={2}
                                                placeholder={`我承諾遵守 ${p.label}，因為……`}
                                                className="w-full p-3 border border-[var(--accent)]/40 rounded-[6px] text-[13px] text-[var(--ink)] leading-[1.7] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30 bg-white"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}

                {/* 簽名區 */}
                <div className={`mt-2 p-5 rounded-[var(--radius-unified)] border-2 transition-all ${isSigned ? 'bg-[var(--success-light)] border-[var(--success)]' : allComplete ? 'bg-[var(--gold-light)] border-[var(--gold)]/40' : 'bg-[var(--paper)] border-dashed border-[var(--border)]'}`}>
                    {!isSigned && !allComplete && (
                        <div className="flex items-center gap-3 text-[var(--ink-light)]">
                            <Lock size={18} />
                            <span className="text-[13px]">還要選完 <strong className="text-[var(--accent)]">{pledges.length - completedCount}</strong> 條才能簽名</span>
                        </div>
                    )}

                    {!isSigned && allComplete && (
                        <div className="flex flex-col gap-3">
                            <div className="text-[12px] font-mono uppercase tracking-[0.12em] text-[var(--accent)] font-bold">✍️ 簽下你的承諾</div>
                            <p className="text-[12.5px] text-[var(--ink-mid)] leading-[1.7]">
                                簽完後這份承諾會永久保存——之後每週 Export 都會帶上你今天簽的內容。
                            </p>
                            <div className="flex flex-col sm:flex-row gap-2">
                                <input
                                    type="text"
                                    value={state.signature}
                                    onChange={(e) => handleSignatureChange(e.target.value)}
                                    placeholder="輸入你的姓名（例：王小明）"
                                    className="flex-1 p-3 border border-[var(--border)] rounded-[6px] text-[14px] text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30 bg-white"
                                />
                                <button
                                    type="button"
                                    onClick={handleSign}
                                    disabled={!state.signature.trim()}
                                    className={`px-6 py-3 rounded-[6px] font-bold text-[14px] transition-all ${state.signature.trim() ? 'bg-[var(--accent)] text-white hover:bg-[var(--accent)]/90 cursor-pointer' : 'bg-[var(--border)] text-[var(--ink-light)] cursor-not-allowed'}`}
                                >
                                    親手簽下
                                </button>
                            </div>
                        </div>
                    )}

                    {isSigned && (
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-3 flex-wrap">
                                <CheckCircle2 className="text-[var(--success)]" size={22} />
                                <div className="flex-1 min-w-0">
                                    <div className="text-[10px] font-mono uppercase tracking-[0.12em] text-[var(--success)] font-bold mb-0.5">已簽署</div>
                                    <div className="font-serif text-[18px] font-bold text-[var(--ink)] leading-tight">{state.signature}</div>
                                    <div className="text-[11px] font-mono text-[var(--ink-light)] mt-0.5">{formatSignedAt(state.signedAt)}</div>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleEdit}
                                    className="flex items-center gap-1 text-[12px] text-[var(--ink-light)] hover:text-[var(--accent)] transition-colors"
                                    style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                                >
                                    <Edit3 size={13} /> 修改
                                </button>
                            </div>
                            <p className="text-[11.5px] text-[var(--ink-mid)] italic mt-1 leading-[1.65]">
                                💡 接下來 17 週，每次 Export 都會在頁首帶上這份承諾——讓今天的你監督未來的你。
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

/* ── 給其他週／其他元件用的格式化函式 ── */
export function formatSignatureForExport(dataKey = 'w1-aired-pledge', pledges = DEFAULT_PLEDGES) {
    try {
        const saved = localStorage.getItem(`signature-block::${dataKey}`);
        if (!saved) return '';
        const state = JSON.parse(saved);
        return buildExportText(state, pledges);
    } catch { return ''; }
}

export { DEFAULT_PLEDGES };
