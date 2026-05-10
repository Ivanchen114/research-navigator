import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ChevronRight, Eye, X, Check } from 'lucide-react';
import { REDLINES, STAGE_THEME, getRedlinesByStage } from '../../data/redlines';

/**
 * 研究員紅線卡 — W13/W14/W15 跨週共用
 *
 * Props:
 * - mode: 'full' (FindTraps 用) | 'subset' (W13/W14/W15 完整版) | 'warning' (任務前警戒語)
 * - stage: 'W13' | 'W14' | 'W15'（subset / warning 必填）
 * - linkToFindTraps: subset 模式顯示「在找雷挑戰看完整 17 條」連結（預設 true）
 * - linkToWeek: full 模式顯示「在 W14 詳細學」連結（預設 true）
 * - defaultOpen: full 模式下三段預設展開？（預設 false）
 * - collapsible: subset 模式下整張卡可摺疊（預設 false）
 */
export const ResearcherRedlines = ({
    mode = 'subset',
    stage,
    linkToFindTraps = true,
    linkToWeek = true,
    defaultOpen = false,
    collapsible = false,
}) => {
    if ((mode === 'subset' || mode === 'warning') && !stage) {
        return null;
    }

    if (mode === 'full') {
        return <FullRedlines linkToWeek={linkToWeek} defaultOpen={defaultOpen} />;
    }

    if (mode === 'warning') {
        return <WarningRedlines stage={stage} />;
    }

    return (
        <SubsetRedlines
            stage={stage}
            linkToFindTraps={linkToFindTraps}
            collapsible={collapsible}
        />
    );
};

/* ─── 警戒語版（任務前用，只顯示 core 條目，極簡）─── */
const WarningRedlines = ({ stage }) => {
    const items = getRedlinesByStage(stage, 'core');
    const theme = STAGE_THEME[stage];
    if (!theme || items.length === 0) return null;

    return (
        <div className="my-6 max-w-[820px] mx-auto">
            <div
                className="rounded-[var(--radius-unified)] border-l-4 p-3 md:p-4"
                style={{ borderColor: theme.accent, background: theme.bg }}
            >
                <div className="flex items-center gap-2 mb-2">
                    <ShieldAlert size={16} style={{ color: theme.accent }} />
                    <p className="font-bold text-[12.5px] m-0" style={{ color: theme.accent }}>
                        ⚠️ 動手前·先看 {items.length} 條核心警戒語
                    </p>
                </div>
                <ul className="space-y-1 list-none p-0 m-0">
                    {items.map(r => (
                        <li key={r.id} className="text-[12px] leading-[1.85] flex items-baseline gap-1.5" style={{ color: theme.accent }}>
                            <span className="font-mono text-[10px] font-bold flex-shrink-0">{r.id}</span>
                            <span className="font-bold">{r.title}</span>
                            <span className="text-[var(--ink-mid)] font-normal">— {r.body}</span>
                        </li>
                    ))}
                </ul>
                <p className="text-[10.5px] italic mt-2 pt-2 border-t" style={{ color: theme.accent, borderColor: theme.border }}>
                    💡 完整 {getRedlinesByStage(stage).length} 條（含進階）會在做完任務後出現，現在先記住這 {items.length} 條就好。
                </p>
            </div>
        </div>
    );
};

/* ─── 完整版（FindTraps 全攤開）─── */
const FullRedlines = ({ linkToWeek, defaultOpen }) => {
    return (
        <div className="my-8 max-w-[860px] mx-auto">
            <div className="bg-white border-2 border-[var(--ink)] rounded-[var(--radius-unified)] p-5 md:p-6">
                <div className="flex items-center gap-2 mb-4">
                    <ShieldAlert size={22} className="text-[var(--ink)]" />
                    <h3 className="font-bold text-[16px] md:text-[18px] text-[var(--ink)] m-0">
                        研究員 17 條紅線 · 全攤開
                    </h3>
                </div>
                <p className="text-[12.5px] text-[var(--ink-mid)] leading-[1.85] mb-5">
                    這 17 條是研究員在<strong>「資料整理 → 視覺化 → 結論」</strong>三階段必須守的紅線。
                    每條都附 <span className="text-[#DC2626] font-bold">✗ 錯句</span> 與 <span className="text-[#059669] font-bold">✓ 正句</span> 對照——把抽象規則變成可辨認的句型。
                </p>
                {['W13', 'W14', 'W15'].map(s => (
                    <StageBlock
                        key={s}
                        stage={s}
                        items={getRedlinesByStage(s)}
                        linkToWeek={linkToWeek}
                        defaultOpen={defaultOpen}
                    />
                ))}
            </div>
        </div>
    );
};

/* ─── 子集版（W13/W14/W15 各週用）─── */
const SubsetRedlines = ({ stage, linkToFindTraps, collapsible }) => {
    const items = getRedlinesByStage(stage);
    const theme = STAGE_THEME[stage];
    const [open, setOpen] = useState(!collapsible); // collapsible=true 預設關，false 預設開
    if (!theme) return null;

    if (collapsible && !open) {
        return (
            <div className="my-6 max-w-[820px] mx-auto">
                <button
                    onClick={() => setOpen(true)}
                    className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-[var(--radius-unified)] border-2 hover:opacity-90 transition-opacity"
                    style={{ borderColor: theme.border, background: theme.bg }}
                >
                    <div className="flex items-center gap-2">
                        <ShieldAlert size={18} style={{ color: theme.accent }} />
                        <span className="font-bold text-[14px]" style={{ color: theme.accent }}>
                            📋 {stage} 階段研究員紅線 · {theme.label}（{items.length} 條）
                        </span>
                    </div>
                    <span className="text-[11px] font-mono" style={{ color: theme.accent }}>
                        點開查看 ▼
                    </span>
                </button>
            </div>
        );
    }

    return (
        <div className="my-6 max-w-[820px] mx-auto">
            <div
                className="rounded-[var(--radius-unified)] border-2 p-4 md:p-5"
                style={{ borderColor: theme.border, background: theme.bg }}
            >
                <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                        <ShieldAlert size={18} style={{ color: theme.accent }} />
                        <h3 className="font-bold text-[14px] md:text-[15px] m-0" style={{ color: theme.accent }}>
                            {stage} 階段研究員紅線 · {theme.label}（{items.length} 條）
                        </h3>
                    </div>
                    {collapsible && (
                        <button
                            onClick={() => setOpen(false)}
                            className="text-[11px] font-mono hover:underline"
                            style={{ color: theme.accent }}
                        >
                            收合 ▲
                        </button>
                    )}
                </div>
                <p className="text-[11.5px] leading-[1.85] mb-3" style={{ color: theme.accent }}>
                    這 {items.length} 條紅線是<strong>本週的核心規則</strong>——做這週任務時，每條都會用到。每條附 ✗ 錯句 / ✓ 正句對照。
                </p>
                <ol className="space-y-2 list-none p-0 m-0">
                    {items.map((r, i) => (
                        <RedlineRow key={r.id} item={r} index={i + 1} accent={theme.accent} />
                    ))}
                </ol>
                {linkToFindTraps && (
                    <div className="mt-4 pt-3 border-t" style={{ borderColor: theme.border }}>
                        <Link
                            to="/find-traps"
                            className="inline-flex items-center gap-1 text-[12px] font-bold no-underline hover:underline"
                            style={{ color: theme.accent }}
                        >
                            <Eye size={14} />
                            看完整 17 條 + 反例（AI 報告找雷大挑戰）
                            <ChevronRight size={14} />
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

/* ─── 階段區塊（FullRedlines 內用）─── */
const StageBlock = ({ stage, items, linkToWeek, defaultOpen }) => {
    const theme = STAGE_THEME[stage];
    const [open, setOpen] = useState(defaultOpen);
    const route = `/${stage.toLowerCase()}`;

    return (
        <div
            className="rounded-[var(--radius-unified)] border-2 mb-3 overflow-hidden"
            style={{ borderColor: theme.border, background: theme.bg }}
        >
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between p-3 text-left hover:opacity-90 transition-opacity"
                style={{ background: theme.bg }}
            >
                <div className="flex items-center gap-2">
                    <span
                        className="font-mono text-[10.5px] font-bold uppercase tracking-wider px-2 py-0.5 rounded"
                        style={{ background: theme.accent, color: 'white' }}
                    >
                        {stage}
                    </span>
                    <span className="font-bold text-[14px]" style={{ color: theme.accent }}>
                        {theme.label}（{items.length} 條）
                    </span>
                </div>
                <ChevronRight
                    size={16}
                    style={{
                        color: theme.accent,
                        transform: open ? 'rotate(90deg)' : 'none',
                        transition: 'transform 0.2s',
                    }}
                />
            </button>
            {open && (
                <div className="p-3 pt-0">
                    <ol className="space-y-2 list-none p-0 m-0">
                        {items.map((r, i) => (
                            <RedlineRow key={r.id} item={r} index={i + 1} accent={theme.accent} />
                        ))}
                    </ol>
                    {linkToWeek && (
                        <div className="mt-3 pt-3 border-t" style={{ borderColor: theme.border }}>
                            <Link
                                to={route}
                                className="inline-flex items-center gap-1 text-[12px] font-bold no-underline hover:underline"
                                style={{ color: theme.accent }}
                            >
                                在 {stage} 詳細學
                                <ChevronRight size={14} />
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

/* ─── 單條紅線（含 ✗/✓ 對照）─── */
const RedlineRow = ({ item, index, accent }) => {
    return (
        <li
            className="bg-white rounded p-2.5 border-l-4"
            style={{ borderColor: accent }}
        >
            <div className="flex items-baseline gap-2 mb-1">
                <span
                    className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded"
                    style={{ background: accent, color: 'white' }}
                >
                    {item.id}
                </span>
                <p className="font-bold text-[13px] m-0" style={{ color: accent }}>
                    {item.title}
                </p>
                {item.relatedTrap && (
                    <span
                        className="ml-auto text-[10px] font-mono text-[#7F1D1D] bg-[#FEE2E2] px-1.5 py-0.5 rounded whitespace-nowrap cursor-help"
                        title={`對應「AI 報告找雷挑戰」的第 ${item.relatedTrap} 個錯誤案例`}
                    >
                        ↔ 雷 #{item.relatedTrap}
                    </span>
                )}
            </div>
            <p className="text-[12px] text-[var(--ink-mid)] leading-[1.85] m-0 pl-1 mb-2">
                {item.body}
            </p>
            {(item.wrong || item.right) && (
                <div className="space-y-1 pl-1">
                    {item.wrong && (
                        <div className="flex gap-1.5 items-start text-[11.5px] leading-[1.7]">
                            <X size={13} className="text-[#DC2626] mt-0.5 flex-shrink-0" />
                            <p className="m-0 text-[#7F1D1D]"><span className="font-bold text-[#DC2626]">✗</span> {item.wrong}</p>
                        </div>
                    )}
                    {item.right && (
                        <div className="flex gap-1.5 items-start text-[11.5px] leading-[1.7]">
                            <Check size={13} className="text-[#059669] mt-0.5 flex-shrink-0" />
                            <p className="m-0 text-[#065F46]"><span className="font-bold text-[#059669]">✓</span> {item.right}</p>
                        </div>
                    )}
                </div>
            )}
        </li>
    );
};

export default ResearcherRedlines;
