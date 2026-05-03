import React from 'react';
import { Brain, Target, FileText, Lightbulb, GraduationCap, Swords } from 'lucide-react';

/**
 * AI 協作三原則 + 對話四步驟 + 雙模式說明（W13/W14/W15 分析階段共用）
 *
 * 設計：角色卡常駐（每週不同要看）+ 詳細教學內容（雙模式光譜 + 三原則 + 四步驟）摺疊
 * 學生第一週點開細看，之後直接收合不擋路。
 *
 * Props:
 * - week: '9' | '10' | '13' | '14' | '15'（不影響顯示，僅 dataKey 區分）
 * - role: 'assistant' | 'mirror' | 'critic'（決定 AI 角色雙身描述）
 * - compact: 保留向後相容，預設 false。當前版本所有教學內容都已摺疊，prop 已不影響顯示。
 */

const ROLE_DESC = {
    assistant: {
        emoji: '🛠️',
        label: 'AI = 整理夥伴（雙身：老師 / 助理）',
        tip: '依下方你選的模式變身——🎓 教學型時當老師教你分析表怎麼設；🥊 驗收型時當助理依你定的結構幫你填內容、找盲點。',
    },
    mirror: {
        emoji: '🪞',
        label: 'AI = 視覺化夥伴（雙身：老師 / 反思鏡）',
        tip: '依下方你選的模式變身——🎓 教學型時當老師示範資料能畫什麼圖；🥊 驗收型時當反思鏡畫你選的圖、戳你沒看到的趨勢。',
    },
    critic: {
        emoji: '🥊',
        label: 'AI = 寫作夥伴（雙身：老師 / 教練）',
        tip: '依下方你選的模式變身——🎓 教學型時當老師示範極簡範例給你照寫；🥊 驗收型時當教練壓力測試你的初稿、找漏洞。',
    },
};

const PRINCIPLES = [
    {
        num: '1',
        title: '先說明起點，AI 才知道怎麼幫',
        body: '說「我完全不會」或「我寫了 X」都行——說不清楚自己在哪，AI 就會猜。AI 猜的常常不是你要的。',
        tagline: '說清楚你在哪',
        accent: '#2563EB',
        bg: '#EFF6FF',
        icon: Brain,
    },
    {
        num: '2',
        title: 'AI 是壓力測試器 / 老師，不是答案機',
        body: 'AI 的價值是「找你想不到的角度、戳你的盲點」或「示範一次給你照做」，不是給標準答案讓你複製。',
        tagline: 'AI 找漏洞 / 給範例，你做決定',
        accent: '#7C3AED',
        bg: '#F5F3FF',
        icon: Target,
    },
    {
        num: '3',
        title: '過程比結果重要',
        body: '老師要看你怎麼跟 AI 對話、判斷、修——不是只看你最後採納的版本。',
        tagline: '完整對話繳交',
        accent: '#D97706',
        bg: '#FFFBEB',
        icon: FileText,
    },
];

const STEPS = [
    { n: '①', label: '準備', desc: '想清楚自己在哪：完全不會 / 有概念了 / 有初版了' },
    { n: '②', label: '指令', desc: '依模式給 prompt（教學型「請示範」/ 驗收型「請找漏洞」）' },
    { n: '③', label: '驗收', desc: '檢查 AI 回應：幻覺？跑偏？我自己改寫過了嗎？' },
    { n: '④', label: '決策', desc: '採納哪些、改哪些、為什麼——這就是 AIRED 的 D' },
];

const MODES_INFO = [
    {
        emoji: '🎓',
        title: '從零到一 · 教學型',
        when: '我不知道怎麼下手',
        prompt_form: '「請示範一個極簡範例，給我可以照著做的步驟」',
        risk: '被動接受 AI 框架',
        cure: 'AI 給範例後，你自己改一次',
        accent: '#059669',
        bg: '#F0FDF4',
        icon: GraduationCap,
    },
    {
        emoji: '🥊',
        title: '從 1 到 100 · 驗收型',
        when: '我有初版了',
        prompt_form: '「我寫了 X，請從研究方法老師角度找 3 個問題」',
        risk: 'AI 改寫太多就變成 AI 寫的',
        cure: 'AI 只指問題，改寫由你',
        accent: '#DC2626',
        bg: '#FEF2F2',
        icon: Swords,
    },
];

const AICollaborationPrinciples = ({ week = '13', role = 'assistant', showRoleCard = true }) => {
    const roleInfo = ROLE_DESC[role] || ROLE_DESC.assistant;

    return (
        <div className="flex flex-col gap-3">
            {/* 角色卡（常駐 · 緊湊版）— 若旁邊已有「核心原則卡」可關閉避免重複 */}
            {showRoleCard && (
                <div className="rounded-[var(--radius-unified)] border border-[var(--accent)] bg-[#F8F8FB] p-3">
                    <div className="flex items-start gap-2">
                        <Lightbulb size={14} className="text-[var(--accent)] mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                            <p className="text-[12.5px] font-bold text-[var(--ink)]">
                                {roleInfo.emoji} 本週 AI：{roleInfo.label}
                            </p>
                            <p className="text-[11.5px] text-[var(--ink-mid)] leading-relaxed mt-1">{roleInfo.tip}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* 詳細教學內容（預設摺疊）*/}
            <details className="rounded-[var(--radius-unified)] border border-[var(--border)] bg-white overflow-hidden">
                <summary className="cursor-pointer px-4 py-2.5 hover:bg-[var(--paper-warm)] transition-colors flex items-center justify-between gap-2">
                    <span className="text-[12px] text-[var(--ink-mid)]">
                        📖 <strong className="text-[var(--ink)]">AI 協作三原則</strong>：說清楚你在哪 · AI 找漏洞 · 完整對話繳交
                        <span className="text-[var(--ink-light)] ml-1">（點開看雙模式光譜 + 對話四步驟）</span>
                    </span>
                    <span className="text-[10px] font-mono text-[var(--ink-light)] flex-shrink-0">▼</span>
                </summary>
                <div className="border-t border-[var(--border)] p-4 space-y-5 bg-[#FAFAF9]">
                    {/* 雙模式光譜 */}
                    <div>
                        <p className="text-[12px] font-bold text-[var(--ink)] mb-2">🌗 AI 雙模式：能力光譜兩端都合法</p>
                        <p className="text-[11px] text-[var(--ink-mid)] mb-2 leading-relaxed">
                            不會的請 AI 教，會的請 AI 檢查。選對模式才是關鍵。
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {MODES_INFO.map((m, i) => {
                                const Icon = m.icon;
                                return (
                                    <div
                                        key={i}
                                        className="rounded-[var(--radius-unified)] border-l-4 border border-[var(--border)] p-3"
                                        style={{ borderLeftColor: m.accent, background: m.bg }}
                                    >
                                        <div className="flex items-center gap-1.5 mb-1">
                                            <Icon size={14} style={{ color: m.accent }} />
                                            <span className="text-[12px] font-bold" style={{ color: m.accent }}>
                                                {m.emoji} {m.title}
                                            </span>
                                        </div>
                                        <p className="text-[11px] font-bold text-[var(--ink)] mb-1">用在：{m.when}</p>
                                        <p className="text-[10.5px] italic mb-1.5 leading-relaxed" style={{ color: m.accent }}>
                                            {m.prompt_form}
                                        </p>
                                        <p className="text-[10.5px] text-[var(--ink-mid)] leading-relaxed">
                                            ⚠️ {m.risk} → {m.cure}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* 三原則 */}
                    <div>
                        <p className="text-[12px] font-bold text-[var(--ink)] mb-2">🤝 三原則詳細說明</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                            {PRINCIPLES.map((p) => {
                                const Icon = p.icon;
                                return (
                                    <div
                                        key={p.num}
                                        className="rounded-[var(--radius-unified)] border-l-4 border border-[var(--border)] p-3"
                                        style={{ borderLeftColor: p.accent, background: p.bg }}
                                    >
                                        <div className="flex items-center gap-1.5 mb-1">
                                            <Icon size={14} style={{ color: p.accent }} />
                                            <span className="text-[10px] font-mono font-bold" style={{ color: p.accent }}>
                                                原則 {p.num}
                                            </span>
                                        </div>
                                        <p className="text-[12px] font-bold text-[var(--ink)] mb-1">{p.title}</p>
                                        <p className="text-[10.5px] text-[var(--ink-mid)] leading-relaxed mb-1.5">{p.body}</p>
                                        <p className="text-[10.5px] font-bold leading-relaxed border-t border-[var(--border)] pt-1.5"
                                           style={{ color: p.accent }}>
                                            💡 {p.tagline}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* 對話四步驟 */}
                    <div>
                        <p className="text-[12px] font-bold text-[var(--ink)] mb-2">🔄 每次跟 AI 互動，都跑這四步</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                            {STEPS.map((s) => (
                                <div key={s.n} className="rounded-[var(--radius-unified)] border border-[var(--border)] bg-white p-2.5">
                                    <div className="flex items-center gap-1.5 mb-1">
                                        <span className="text-[14px] font-bold text-[var(--accent)]">{s.n}</span>
                                        <span className="text-[11px] font-bold text-[var(--ink)]">{s.label}</span>
                                    </div>
                                    <p className="text-[10.5px] text-[var(--ink-mid)] leading-relaxed">{s.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </details>
        </div>
    );
};

export default AICollaborationPrinciples;
export { AICollaborationPrinciples };
