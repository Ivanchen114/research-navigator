import React, { useState, useEffect } from 'react';
import { GraduationCap, Swords, UserCheck } from 'lucide-react';

/**
 * AI 使用模式選擇器（W13/W14/W15 共用）
 *
 * Props:
 * - week: '13' | '14' | '15'（決定 dataKey: w{week}-ai-mode）
 * - taskName: string（顯示在說明文字上，例如「資料整理」「畫圖」「四層結論」）
 * - onChange: (mode: 'teach'|'verify'|'') => void  父頁可監聽，做 conditional UI
 *
 * dataKey: w{week}-ai-mode  值：'teach' | 'verify'
 *
 * 設計：兩按鈕選擇 + 對應的提示語。學生選錯模式才是問題。
 */

const STORAGE_KEY = 'rib_think_records';

const MODES = [
    {
        id: 'teach',
        emoji: '🎓',
        label: '從零到一 · 教學型',
        sub: 'AI 角色：老師 / 示範者',
        desc: '我不知道怎麼下手 → 請 AI 教我、給範例、拆步驟',
        prompt: '「請示範一個極簡範例，我看完自己照著做」',
        accent: '#059669',
        bg: '#F0FDF4',
        icon: GraduationCap,
    },
    {
        id: 'verify',
        emoji: '🥊',
        label: '從 1 到 100 · 驗收型',
        sub: 'AI 角色：教練 / 壓力測試',
        desc: '我有初版了 → 請 AI 找漏洞、戳盲點、檢查邊界',
        prompt: '「我寫了 X，請從研究方法老師角度找 3 個問題」',
        accent: '#DC2626',
        bg: '#FEF2F2',
        icon: Swords,
    },
    {
        id: 'standalone',
        emoji: '🚫',
        label: '不用 AI · 全靠自己',
        sub: '完全合法的選擇',
        desc: '這次想自己練手 → 不用 AI（要寫一行為什麼選這條）',
        prompt: 'AI 是輔助不是必修——選不用，但要自覺地選',
        accent: '#6B7280',
        bg: '#F9FAFB',
        icon: UserCheck,
    },
];

const AIModePicker = ({ week, taskName = 'AI 互動', onChange }) => {
    const dataKey = `w${week}-ai-mode`;
    const [mode, setMode] = useState(() => {
        try {
            const r = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
            return r[dataKey] || '';
        } catch { return ''; }
    });

    useEffect(() => {
        if (typeof onChange === 'function') onChange(mode);
    }, [mode, onChange]);

    const handlePick = (id) => {
        setMode(id);
        try {
            const r = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
            r[dataKey] = id;
            localStorage.setItem(STORAGE_KEY, JSON.stringify(r));
        } catch {}
    };

    const picked = MODES.find(m => m.id === mode);

    return (
        <div className="flex flex-col gap-3">
            <div>
                <p className="text-[13px] font-bold text-[var(--ink)] mb-2 flex items-center gap-2">
                    🎯 你目前在哪？選一個 AI 使用模式
                </p>
                <p className="text-[12px] text-[var(--ink-mid)] mb-3 leading-relaxed">
                    AI 是雙向工具——可以從零開始教你（老師），也可以幫你檢查初版（教練）。
                    <strong>選對模式</strong>，AI 才幫得上忙；選錯模式（不會卻硬撐 / 都會了還用教學版），就會卡住或被 AI 主導。
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {MODES.map((m) => {
                    const Icon = m.icon;
                    const isPicked = mode === m.id;
                    return (
                        <button
                            key={m.id}
                            type="button"
                            onClick={() => handlePick(m.id)}
                            className="text-left rounded-[var(--radius-unified)] border-2 p-4 transition-all"
                            style={{
                                background: isPicked ? m.bg : '#fff',
                                borderColor: isPicked ? m.accent : 'var(--border)',
                                boxShadow: isPicked ? '0 0 0 3px rgba(0,0,0,0.04)' : 'none',
                            }}
                        >
                            <div className="flex items-center gap-2 mb-1">
                                <Icon size={18} style={{ color: m.accent }} />
                                <span className="text-[14px] font-bold" style={{ color: isPicked ? m.accent : 'var(--ink)' }}>
                                    {m.emoji} {m.label}
                                </span>
                            </div>
                            <p className="text-[11px] font-mono uppercase tracking-wider mb-2" style={{ color: m.accent }}>
                                {m.sub}
                            </p>
                            <p className="text-[12px] text-[var(--ink-mid)] leading-relaxed mb-2">{m.desc}</p>
                            <p className="text-[11px] italic leading-relaxed" style={{ color: m.accent }}>
                                💬 {m.prompt}
                            </p>
                        </button>
                    );
                })}
            </div>

            {picked && (
                <div
                    className="p-3 rounded-[var(--radius-unified)] border-l-4 text-[12px] leading-relaxed"
                    style={{ background: picked.bg, borderLeftColor: picked.accent, color: picked.accent }}
                >
                    <strong>已選：{picked.label}</strong>——
                    {picked.id === 'standalone'
                        ? '下方不會顯示 AI prompt（你選自己做）。但仍要寫一行 AIRED 紀錄為什麼選不用 AI。'
                        : `下方會顯示對應的 prompt 範本。${taskName}結束後，繳交開頭也記得標明「【${picked.id === 'teach' ? '教學型' : '驗收型'}】」。`
                    }
                </div>
            )}
        </div>
    );
};

export default AIModePicker;
export { AIModePicker };
