import React, { useState, useEffect } from 'react';
import { MessageSquare } from 'lucide-react';
import ThinkRecord from './ThinkRecord';

/**
 * AI 完整對話繳交說明卡 + ThinkRecord 確認（W13/W14/W15 共用）
 *
 * Props:
 * - week: '13' | '14' | '15'（決定 dataKey 與檔名建議）
 * - taskName: string，例如「資料整理」「圖表判讀」「四層結論檢核」
 * - required: boolean，預設 true
 * - readMode: boolean，預設 true 表示自動讀 localStorage 裡的 ai-mode
 *   並依模式調整繳交開頭註明 + 反思題
 *
 * dataKey: w{week}-ai-dialog-submission
 *
 * 設計：開頭註明 + 反思題會依「教學型 / 驗收型」分流
 */

const STORAGE_KEY = 'rib_think_records';

const MODE_LABEL = {
    teach: { tag: '【教學型】', desc: '我從零到一', emoji: '🎓' },
    verify: { tag: '【驗收型】', desc: '我從 1 到 100', emoji: '🥊' },
};

const MODE_REFLECTIONS = {
    teach: [
        '我選的繳交方式：A 貼在 GC 私人註解 / B 上傳 Google Doc',
        '若 B：文件連結 ___',
        '從這個對話我學到什麼（核心觀念 / 步驟）：',
        '我自己照著做的版本是：（不能是 AI 範例的複製）',
    ],
    verify: [
        '我選的繳交方式：A 貼在 GC 私人註解 / B 上傳 Google Doc',
        '若 B：文件連結 ___',
        'AI 找到我哪些盲點 / 漏洞：',
        '我採納哪些、不採納哪些，為什麼：',
    ],
    none: [
        '我選的繳交方式：A 貼在 GC 私人註解 / B 上傳 Google Doc',
        '若 B：文件連結 ___',
        '我用了哪種模式（教學型 / 驗收型）+ 開頭已註明：',
    ],
};

const AIDialogSubmission = ({ week, taskName = 'AI 互動', required = true }) => {
    const submissionKey = `w${week}-ai-dialog-submission`;
    const modeKey = `w${week}-ai-mode`;
    const fileName = `組別_W${week}_AI對話`;

    const [mode, setMode] = useState(() => {
        try {
            const r = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
            return r[modeKey] || '';
        } catch { return ''; }
    });

    /* 監聽 storage 變化，模式切換時即時更新 */
    useEffect(() => {
        const checkMode = () => {
            try {
                const r = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
                setMode(r[modeKey] || '');
            } catch {}
        };
        const id = setInterval(checkMode, 500);
        return () => clearInterval(id);
    }, [modeKey]);

    const m = MODE_LABEL[mode];
    const reflections = MODE_REFLECTIONS[mode] || MODE_REFLECTIONS.none;
    const taggedTask = m ? `${m.tag}${taskName}` : taskName;

    /* standalone 模式：不用 AI，沒對話可繳，整個元件不顯示 */
    if (mode === 'standalone') {
        return (
            <div className="rounded-[var(--radius-unified)] border border-[#D1D5DB] bg-[#F9FAFB] p-3">
                <p className="text-[12px] text-[#6B7280] leading-relaxed">
                    🚫 你選了「不用 AI · 全靠自己」——本次沒有 AI 對話需要繳交。請在下方 AIRED 區寫一行為什麼選不用 AI。
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-3">
            <div className="rounded-[var(--radius-unified)] border-2 border-[#FCD34D] bg-[#FFFBEB] p-4">
                <p className="text-[13px] font-bold text-[#92400E] mb-2 flex items-center gap-2">
                    <MessageSquare size={14} /> 完整對話繳交{required ? '（必繳）' : '（建議）'}
                </p>
                <p className="text-[11px] text-[#78350F] leading-relaxed mb-3">
                    分析階段的 AI 互動會有大量<strong>來回對話</strong>——你會丟一輪、AI 回、你修、再丟一輪。
                    為了讓老師看見你怎麼跟 AI 對話、怎麼判斷修正，請把<strong>完整對話</strong>繳交（不只是最後採納版本）。
                </p>
                <div className="text-[11px] text-[#78350F] leading-relaxed space-y-1 mb-3">
                    <p>📋 <strong>方式 A：</strong>複製整個對話貼到 Google Classroom 的<strong>私人註解</strong></p>
                    <p>📄 <strong>方式 B：</strong>開 Google Doc 貼進去，命名 <code className="bg-white px-1 py-0.5 rounded text-[10px] font-mono">{fileName}</code>，上傳到 GC</p>
                </div>
                <p className="text-[11px] text-[#92400E] font-bold leading-relaxed border-t border-[#FCD34D] pt-2">
                    ⚠️ 必須在文件 / 註解開頭註明：「<strong>這是與 Gemini 的{taggedTask}完整對話{m ? `——${m.desc}` : ''}</strong>」
                </p>
                {!m && (
                    <p className="text-[11px] text-[#92400E] italic mt-2 leading-relaxed">
                        💡 上方還沒選 AI 使用模式 — 選了之後此處會自動加上「【教學型】」或「【驗收型】」標籤。
                    </p>
                )}
            </div>

            <ThinkRecord
                dataKey={submissionKey}
                prompt={`完整對話繳交方式 + 反思${required ? '（必填）' : '（選填）'}`}
                scaffold={reflections}
            />
        </div>
    );
};

export default AIDialogSubmission;
export { AIDialogSubmission };
