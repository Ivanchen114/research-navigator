import React, { useState, useEffect } from 'react';
import { PenLine, Eye, Check } from 'lucide-react';

/**
 * 找雷後的「改寫練習」— 反糾察隊配套
 * 不只指出哪裡錯，還要練習改寫成正解。從拆解切換到創作。
 *
 * Props:
 * - trapId / trapNumber：雷編號（顯示用）
 * - stage：W13 / W14 / W15
 * - title：雷的標題
 * - wrong：原始錯句（AI 寫的）
 * - issue：為什麼錯（簡短）
 * - hint：改寫提示（給學生方向，不給答案）
 * - shouldDo：老師示範改法（按鈕揭示）
 * - dataKey：localStorage 儲存鍵（讓改寫稿能跨 session 保留 + 匯出 portfolio）
 */
const STAGE_THEME = {
    W13: { accent: '#0EA5E9', bg: '#F0F9FF', border: '#7DD3FC' },
    W14: { accent: '#8B5CF6', bg: '#F5F3FF', border: '#C4B5FD' },
    W15: { accent: '#E11D48', bg: '#FFF1F2', border: '#FDA4AF' },
};

/* 與 ThinkRecord / AIModePicker 共用同一個聚合儲存——讓 ExportButton（readRecords）撈得到。
 * 舊版曾把 dataKey 寫成獨立的 top-level localStorage key，掛載時做一次性遷移撿回來。 */
const STORE_KEY = 'rib_think_records';

function readStore() {
    try { return JSON.parse(localStorage.getItem(STORE_KEY)) || {}; }
    catch { return {}; }
}

function writeStore(key, value) {
    const r = readStore();
    r[key] = value;
    localStorage.setItem(STORE_KEY, JSON.stringify(r));
}

export const TrapRewritePractice = ({
    trapNumber,
    stage = 'W15',
    title,
    wrong,
    issue,
    hint,
    shouldDo,
    dataKey,
}) => {
    const [text, setText] = useState('');
    const [showAnswer, setShowAnswer] = useState(false);
    const theme = STAGE_THEME[stage] || STAGE_THEME.W15;

    useEffect(() => {
        if (!dataKey) return;
        const store = readStore();
        if (store[dataKey] !== undefined) {
            setText(store[dataKey]);
        } else {
            // 一次性遷移：舊版存在獨立 localStorage key，撿回聚合儲存
            const legacy = localStorage.getItem(dataKey);
            if (legacy) {
                setText(legacy);
                writeStore(dataKey, legacy);
            }
        }
    }, [dataKey]);

    const handleChange = (e) => {
        const val = e.target.value;
        setText(val);
        if (dataKey) writeStore(dataKey, val);
    };

    return (
        <div
            className="my-6 rounded-[var(--radius-unified)] border-2 p-4 md:p-5"
            style={{ borderColor: theme.border, background: theme.bg }}
        >
            <div className="flex items-center gap-2 mb-3">
                <PenLine size={18} style={{ color: theme.accent }} />
                <p className="font-bold text-[14px] m-0" style={{ color: theme.accent }}>
                    🪞 改寫練習 · 雷 #{trapNumber}：{title}
                </p>
            </div>

            {/* 原始錯句 */}
            <div className="bg-[#FEE2E2] border-l-4 border-[#DC2626] rounded-r p-3 mb-3">
                <p className="text-[11px] font-mono font-bold text-[#991B1B] uppercase mb-1">✗ AI 原始錯句</p>
                <p className="text-[13px] text-[#7F1D1D] italic leading-[1.85] m-0">「{wrong}」</p>
                {issue && (
                    <p className="text-[11.5px] text-[#7F1D1D] mt-2 pt-2 border-t border-[#FCA5A5]/50">
                        <strong>為什麼錯：</strong>{issue}
                    </p>
                )}
            </div>

            {/* 改寫提示 */}
            {hint && (
                <p className="text-[12px] leading-[1.85] mb-2" style={{ color: theme.accent }}>
                    💡 <strong>改寫方向：</strong>{hint}
                </p>
            )}

            {/* 改寫輸入區 */}
            <div className="bg-white rounded p-3 border border-[var(--border)]">
                <p className="text-[11px] font-mono font-bold uppercase tracking-wider mb-2" style={{ color: theme.accent }}>
                    ✏️ 你的改寫
                </p>
                <textarea
                    value={text}
                    onChange={handleChange}
                    placeholder="動手寫一個正解版本——資料只看到什麼？哪些不能說？"
                    rows={3}
                    className="w-full text-[13px] leading-[1.85] p-2 border border-[var(--border)] rounded resize-y focus:outline-none focus:border-[var(--accent)]"
                />
            </div>

            {/* 揭示老師示範 */}
            {shouldDo && (
                <div className="mt-3">
                    {!showAnswer ? (
                        <button
                            onClick={() => setShowAnswer(true)}
                            className="inline-flex items-center gap-1 text-[12px] font-bold px-3 py-1.5 rounded text-white hover:opacity-90"
                            style={{ background: theme.accent }}
                        >
                            <Eye size={13} /> 看老師示範改法（寫完再點）
                        </button>
                    ) : (
                        <div className="bg-[#D1FAE5] border-l-4 border-[#10B981] rounded-r p-3">
                            <p className="text-[11px] font-mono font-bold text-[#065F46] uppercase mb-1 flex items-center gap-1">
                                <Check size={13} /> 老師示範改法
                            </p>
                            <p className="text-[13px] text-[#065F46] leading-[1.85] m-0">{shouldDo}</p>
                            <p className="text-[10.5px] text-[#047857] italic mt-2 pt-2 border-t border-[#86EFAC]">
                                💡 改法不只一種——你的版本只要符合「資料看到什麼 + 不下因果 + 不過度修飾」就 OK。
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default TrapRewritePractice;
