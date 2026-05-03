import React from 'react';
import { Brain, Target, FileText, Lightbulb, GraduationCap, Swords } from 'lucide-react';

/**
 * AI 協作三原則 + 對話四步驟 + 雙模式說明（W13/W14/W15 分析階段共用）
 *
 * Props:
 * - week: '13' | '14' | '15'（不影響顯示，僅作 dataKey 區分）
 * - role: 'assistant' | 'mirror' | 'critic'（決定 AI 角色描述）
 *   - assistant: AI=助理（W13 編碼／執行）
 *   - mirror: AI=反思鏡（W14 視覺化／找漏洞）
 *   - critic: AI=嚴格教練（W15 壓力測試／壓 hold）
 * - compact: 可選，true 時只顯示三原則不顯示四步驟與雙模式說明
 */

const ROLE_DESC = {
    assistant: { emoji: '🛠️', label: 'AI = 編碼助理 / 整理夥伴', tip: 'AI 幫你把資料填進你定的結構，但結構你自己定' },
    mirror: { emoji: '🪞', label: 'AI = 反思鏡 + 視覺化夥伴', tip: 'AI 幫你畫圖、戳你沒看到的趨勢；可以教你也可以驗收你' },
    critic: { emoji: '🥊', label: 'AI = 嚴格教練', tip: 'AI 壓力測試你的結論初稿，找你忽略的漏洞，但改寫由你來' },
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

const AICollaborationPrinciples = ({ week = '13', role = 'assistant', compact = false }) => {
    const roleInfo = ROLE_DESC[role] || ROLE_DESC.assistant;

    return (
        <div className="flex flex-col gap-4">
            {/* AI 角色卡 */}
            <div className="rounded-[var(--radius-unified)] border-2 border-[var(--accent)] bg-[#F8F8FB] p-4">
                <p className="text-[12px] font-bold text-[var(--accent)] mb-1 flex items-center gap-2">
                    <Lightbulb size={14} /> 本週 AI 的角色
                </p>
                <p className="text-[14px] font-bold text-[var(--ink)] mb-1">
                    {roleInfo.emoji} {roleInfo.label}
                </p>
                <p className="text-[12px] text-[var(--ink-mid)] leading-relaxed">{roleInfo.tip}</p>
            </div>

            {/* 雙模式光譜 */}
            {!compact && (
                <div>
                    <p className="text-[13px] font-bold text-[var(--ink)] mb-2">🌗 AI 雙模式：你能力光譜的兩端都合法</p>
                    <p className="text-[12px] text-[var(--ink-mid)] mb-3 leading-relaxed">
                        AI 不只是「驗收工具」——學生能力是光譜的，<strong>不會的就請 AI 教，會的就請 AI 檢查</strong>。選對模式才是關鍵。
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {MODES_INFO.map((m, i) => {
                            const Icon = m.icon;
                            return (
                                <div
                                    key={i}
                                    className="rounded-[var(--radius-unified)] border-l-4 border border-[var(--border)] p-4"
                                    style={{ borderLeftColor: m.accent, background: m.bg }}
                                >
                                    <div className="flex items-center gap-2 mb-2">
                                        <Icon size={16} style={{ color: m.accent }} />
                                        <span className="text-[13px] font-bold" style={{ color: m.accent }}>
                                            {m.emoji} {m.title}
                                        </span>
                                    </div>
                                    <p className="text-[11px] font-bold text-[var(--ink)] mb-1">用在：{m.when}</p>
                                    <p className="text-[11px] italic mb-2 leading-relaxed" style={{ color: m.accent }}>
                                        {m.prompt_form}
                                    </p>
                                    <p className="text-[11px] text-[var(--ink-mid)] leading-relaxed">
                                        ⚠️ 風險：{m.risk} → 對策：{m.cure}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* 三原則 */}
            <div>
                <p className="text-[13px] font-bold text-[var(--ink)] mb-3">🤝 AI 協作三原則</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {PRINCIPLES.map((p) => {
                        const Icon = p.icon;
                        return (
                            <div
                                key={p.num}
                                className="rounded-[var(--radius-unified)] border-l-4 border border-[var(--border)] p-4"
                                style={{ borderLeftColor: p.accent, background: p.bg }}
                            >
                                <div className="flex items-center gap-2 mb-2">
                                    <Icon size={16} style={{ color: p.accent }} />
                                    <span className="text-[10px] font-mono font-bold" style={{ color: p.accent }}>
                                        原則 {p.num}
                                    </span>
                                </div>
                                <p className="text-[13px] font-bold text-[var(--ink)] mb-1">{p.title}</p>
                                <p className="text-[11px] text-[var(--ink-mid)] leading-relaxed mb-2">{p.body}</p>
                                <p className="text-[11px] font-bold leading-relaxed border-t border-[var(--border)] pt-2"
                                   style={{ color: p.accent }}>
                                    💡 {p.tagline}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* 對話四步驟 */}
            {!compact && (
                <div>
                    <p className="text-[13px] font-bold text-[var(--ink)] mb-3">🔄 每次跟 AI 互動，都跑這四步</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {STEPS.map((s) => (
                            <div key={s.n} className="rounded-[var(--radius-unified)] border border-[var(--border)] bg-white p-3">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-[16px] font-bold text-[var(--accent)]">{s.n}</span>
                                    <span className="text-[12px] font-bold text-[var(--ink)]">{s.label}</span>
                                </div>
                                <p className="text-[11px] text-[var(--ink-mid)] leading-relaxed">{s.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AICollaborationPrinciples;
export { AICollaborationPrinciples };
