import React, { useState, useCallback } from 'react';
import CourseArc from '../components/ui/CourseArc';
import './W16.css';
import ThinkRecord from '../components/ui/ThinkRecord';
import AIREDNarrative from '../components/ui/AIREDNarrative';
import StepEngine from '../components/ui/StepEngine';
import HeroBlock from '../components/ui/HeroBlock';
import ExportButton from '../components/ui/ExportButton';
import ResetWeekButton from '../components/ui/ResetWeekButton';
import LessonMap from '../components/ui/LessonMap';
import { W16Data } from '../data/lessonMaps';
import { readRecords } from '../components/ui/ThinkRecord';
import {
    ArrowRight,
    Bot,
    Copy,
    Check,
    Package,
    PenTool,
    Layout,
    Users,
    FileText,
    Eye,
    CheckSquare,
    Map,
} from 'lucide-react';

/* ══════════════════════════════════════
 *  資料常數
 * ══════════════════════════════════════ */

const ASSEMBLY_STEPS = [
    { num: 1, chapter: '第一章：引言', source: 'W3-W4 學習單', task: '「我為什麼做這個研究」＋「我的研究問題是什麼」', words: '150-200 字', time: '5 min', color: '#2563EB' },
    { num: 2, chapter: '第二章：文獻探討', source: 'W6 學習單', task: '3 篇以上文獻摘要與比較＋「目前研究的缺口在於…」', words: '250-350 字', time: '5 min', color: '#7C3AED' },
    { num: 3, chapter: '第三章：研究方法', source: 'W10 學習單', task: '方法名稱、參與者、工具、流程＋知情同意聲明', words: '150-250 字', time: '5 min', color: '#059669' },
    { num: 4, chapter: '第四章：研究結果', source: 'W14 學習單', task: '2 個主要發現的客觀描述句＋圖表標注位置', words: '200-300 字', time: '10 min', color: '#D97706' },
    { num: 5, chapter: '第五章：討論與結論', source: 'W14-W15 學習單', task: '主觀推論句＋研究限制＋未來建議', words: '200-300 字', time: '5 min', color: '#DC2626' },
    { num: 6, chapter: '參考文獻', source: 'W6 文獻清單', task: '直接複製 APA 格式清單，確認格式統一', words: '—', time: '5 min', color: '#6B7280' },
    { num: 7, chapter: '摘要 (Abstract)', source: '今天用 AI 生成', task: '用 AI 摘要 Prompt 生成初稿，再人工修改', words: '150-200 字', time: '10 min', color: '#0891B2' },
];

const ROLES = [
    { name: '搬運工', emoji: '📦', steps: 'Step 1-3', task: '找 W3-W10 學習單，把引言、文獻、方法貼進去', color: '#EFF6FF', border: '#BFDBFE' },
    { name: '數據官', emoji: '📊', steps: 'Step 4-5', task: '找 W14-W15 的圖表跟描述句，負責貼到正確位置', color: '#FEF3C7', border: '#FDE68A' },
    { name: 'AI 溝通師', emoji: '🤖', steps: 'Step 6-7', task: '開 AI 工具，負責潤色、摘要、縫合 Prompt', color: '#F0FDF4', border: '#BBF7D0' },
];

const POSTER_RULES = [
    { word: '大', icon: '🔍', desc: '主標題要大，最重要的發現要大', color: '#EFF6FF', textColor: '#1E40AF' },
    { word: '少', icon: '✂️', desc: '字越少越好，每區塊不超過三行', color: '#FEF2F2', textColor: '#991B1B' },
    { word: '準', icon: '🎯', desc: '只放最重要的一個發現，不是全部', color: '#F0FDF4', textColor: '#166534' },
    { word: '亮', icon: '💡', desc: '圖表是武器，放中間，放最大', color: '#FEF9C3', textColor: '#854D0E' },
];

const PROMPTS = {
    polish: `我寫了一段研究報告的草稿，請幫我：
1. 在「不改變我的核心發現」的前提下，讓這段話更有學術嚴謹感
2. 指出有沒有邏輯不通的地方
3. 修正語法錯誤
⚠️ 不可以自己捏造我沒有的數據，如果要舉例請先告訴我

以下是我的草稿：
【貼上你的文字片段】`,
    abstract: `我的研究標題是「＿＿＿」，以下是各章的核心句子：

引言核心：研究問題是…
文獻核心：目前文獻指出…
方法核心：本研究使用……蒐集了……的資料
結果核心：主要發現是…
結論核心：此研究說明了…

請幫我寫一段 150-200 字的中文研究摘要。
格式：目的 → 方法 → 主要發現 → 結論。
語氣：學術、簡潔、第三人稱為主。`,
    stitch: `我把小論文的不同章節拼在一起了。
請幫我閱讀以下【第 __ 章結尾】與【第 __ 章開頭】的段落：

【貼上兩段文字】

請：
1. 不要改變我的原意與任何數據
2. 幫我在兩段之間加上 1-2 句「過渡句（Transition）」
3. 把語氣統一成客觀的學術第三人稱
讓這兩段讀起來像同一篇文章。`,
    checkup: `我是高中生，剛完成一份研究小論文。
請你扮演「論文健檢醫生」，閱讀我上傳的 PDF 報告，然後只做診斷、不動刀修改。

請依以下五項逐一檢查，每項給「✅ 通過」或「⚠️ 需注意」，並用一句話說明理由：

1.【結構完整】五章（引言、文獻、方法、結果、討論）＋摘要＋參考文獻，有沒有缺少的？
2.【前後一致】研究問題、方法、結果、結論之間的邏輯鏈有沒有斷掉？
3.【結論回扣】第五章的結論有沒有直接回答第一章提出的研究問題？
4.【描述 vs. 推論】第四章有沒有偷渡主觀推論？第五章有沒有把推論當事實寫？
5.【參考文獻】格式是否統一（APA）？文中引用和文末清單有沒有對不上的？

⚠️ 規則：
- 你只能「指出問題」，不可以幫我改寫任何一句話
- 如果某項通過，也請告訴我為什麼通過
- 最後給一個 0-5 的「健康指數」（5 = 非常健康）`,
};

const EXPORT_FIELDS = [
    { key: 'w16-role', label: '我的角色' },
    { key: 'w16-abstract-cores', label: '各章核心句' },
    { key: 'w16-abstract-ai', label: 'AI 摘要初稿' },
    { key: 'w16-abstract-edit', label: '我修改的部分' },
    { key: 'w16-abstract-final', label: '最終摘要' },
    { key: 'w16-polish-chapter', label: 'AI 潤色紀錄（哪一章）' },
    { key: 'w16-polish-diff', label: 'AI 潤色差異' },
    { key: 'w16-polish-judge', label: '保留/刪掉/改回去' },
    { key: 'w16-checkup-result', label: 'AI 健檢結果' },
    { key: 'w16-checkup-action', label: '我決定改什麼' },
    { key: 'w16-poster-title', label: '海報大標題' },
    { key: 'w16-poster-finding', label: '最核心發現' },
    { key: 'w16-poster-chart', label: '關鍵圖表' },
    { key: 'w16-poster-conclusion', label: '海報結論' },
    { key: 'w16-peer-memory', label: '同儕 3 秒記住的' },
    { key: 'w16-peer-reflect', label: '互評反思' },
    { key: 'w16-aired-record', label: 'AI-RED 敘事紀錄', question: '本週最重要的一次 AI 互動（A-I-R-E-D 五要素）' },
];

/* ══════════════════════════════════════
 *  CopyablePrompt 元件
 * ══════════════════════════════════════ */
const CopyablePrompt = ({ text, label }) => {
    const [copied, setCopied] = useState(false);
    const handleCopy = useCallback(() => {
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
        <div style={{ borderRadius: 'var(--radius-unified)', overflow: 'hidden', background: '#1a1a2e' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', background: '#16213e', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.7)', fontFamily: 'var(--font-mono)' }}>
                    <Bot size={14} /> {label || 'AI Prompt — 複製後貼到 AI 對話窗'}
                </span>
                <button onClick={handleCopy} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 10px', fontSize: 11, fontWeight: 700, color: '#fff', background: 'var(--accent)', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
                    {copied ? <><Check size={12} /> 已複製</> : <><Copy size={12} /> 複製</>}
                </button>
            </div>
            <pre style={{ margin: 0, padding: 16, fontSize: 12, color: '#e2e8f0', whiteSpace: 'pre-wrap', wordBreak: 'break-word', lineHeight: 1.7, fontFamily: 'var(--font-mono)' }}>
                {text}
            </pre>
        </div>
    );
};

/* ══════════════════════════════════════
 *  互動式自查清單
 * ══════════════════════════════════════ */
const AssemblyChecklist = () => {
    const [checked, setChecked] = useState(() => {
        try { return JSON.parse(localStorage.getItem('w16-assembly-check') || '{}'); } catch { return {}; }
    });
    const toggle = (key) => {
        const next = { ...checked, [key]: !checked[key] };
        setChecked(next);
        localStorage.setItem('w16-assembly-check', JSON.stringify(next));
    };
    const items = [
        { key: 'ch1', label: 'Step 1 — 第一章：引言（W3-W4 素材整合）' },
        { key: 'ch2', label: 'Step 2 — 第二章：文獻探討（W6 文獻摘要整合）' },
        { key: 'ch3', label: 'Step 3 — 第三章：研究方法（W10 方法說明整合）' },
        { key: 'ch4', label: 'Step 4 — 第四章：研究結果（W14 客觀描述整合＋圖表）' },
        { key: 'ch5', label: 'Step 5 — 第五章：討論與結論（W14-W15 推論＋限制）' },
        { key: 'ch6', label: 'Step 6 — 參考文獻（W6 APA 格式清單）' },
        { key: 'stitch', label: '縫合檢查 — 各章節之間的過渡句已確認' },
    ];
    const allDone = items.every(i => checked[i.key]);

    return (
        <div>
            <div className="w16-checklist">
                {items.map(item => (
                    <div key={item.key} className="w16-check-item" onClick={() => toggle(item.key)}>
                        <div className={`w16-check-box ${checked[item.key] ? 'checked' : ''}`}>
                            {checked[item.key] && <Check size={14} />}
                        </div>
                        <span>{item.label}</span>
                    </div>
                ))}
            </div>
            {allDone && (
                <div style={{ marginTop: 12, padding: '10px 16px', borderRadius: 'var(--radius-unified)', background: '#F0FDF4', border: '1px solid #BBF7D0', fontSize: 12, fontWeight: 700, color: '#166534', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Check size={16} /> 七步組裝全數完成！可以進入 Step 7 摘要了
                </div>
            )}
        </div>
    );
};

/* ══════════════════════════════════════
 *  主元件
 * ══════════════════════════════════════ */
const W16Page = () => {
    const [showLessonMap, setShowLessonMap] = useState(false);
    /* 讀取前週資料 */
    const prev = readRecords(['w15-draft-describe', 'w15-draft-interpret', 'w15-draft-anchor', 'w15-draft-critique', 'w14-my-chart-type', 'w14-my-description', 'w14-my-inference']);
    const topic = localStorage.getItem('w4-initial-topic') || '';
    const method = localStorage.getItem('w8-method') || localStorage.getItem('w7-method') || '';

    const steps = [
        /* ── Step 1 ── */
        {
            title: '組裝出發',
            icon: <Package size={18} />,
            content: (
                <div className="prose-zh">
                    <div className="card">
                        <div className="card-header">
                            <FileText size={16} /> 報告 = 你已經寫好的碎片
                        </div>
                        <div className="card-body" style={{ fontSize: 13, lineHeight: 1.8 }}>
                            好消息：<strong>你已經寫完 80%</strong>。前 15 週每份學習單都藏著報告的原料，現在只需要「搬運 → 縫合 → 潤色」三步組裝。
                        </div>
                    </div>

                    {/* 七步組裝清單 */}
                    <div className="card" style={{ marginTop: 16 }}>
                        <div className="card-header">
                            <CheckSquare size={16} /> 七步組裝清單
                        </div>
                        <div className="card-body">
                            <div className="w16-assembly-grid">
                                {ASSEMBLY_STEPS.map(s => (
                                    <div className="w16-assembly-row" key={s.num}>
                                        <div className="w16-assembly-num" style={{ background: s.color }}>{s.num}</div>
                                        <div className="w16-assembly-body">
                                            <div className="w16-assembly-title">{s.chapter}</div>
                                            <div>{s.task}</div>
                                            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 4 }}>
                                                <span className="w16-assembly-source">來源：{s.source}</span>
                                                <span className="w16-assembly-time">{s.time}</span>
                                                {s.words !== '—' && <span className="w16-assembly-time">{s.words}</span>}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* 角色分工 */}
                    <div className="card" style={{ marginTop: 16 }}>
                        <div className="card-header">
                            <Users size={16} /> 三人分工（Solo 全包）
                        </div>
                        <div className="card-body">
                            <div className="w16-role-grid">
                                {ROLES.map(r => (
                                    <div className="w16-role-card" key={r.name} style={{ background: r.color, borderColor: r.border }}>
                                        <div className="w16-role-header" style={{ background: 'rgba(255,255,255,0.5)' }}>
                                            {r.emoji} {r.name}
                                        </div>
                                        <div className="w16-role-body">
                                            <div style={{ fontWeight: 700, marginBottom: 4 }}>{r.steps}</div>
                                            {r.task}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <ThinkRecord
                                dataKey="w16-role"
                                prompt="今天我的角色是？（搬運工／數據官／AI 溝通師／Solo 全包）"
                                scaffold={['搬運工', '數據官', 'AI 溝通師', 'Solo（全包）']}
                            />
                        </div>
                    </div>
                </div>
            ),
        },

        /* ── Step 2 ── */
        {
            title: '報告組裝 + AI 潤色',
            icon: <PenTool size={18} />,
            content: (
                <div className="prose-zh">
                    {/* 組裝進度追蹤 */}
                    <div className="card">
                        <div className="card-header">
                            <CheckSquare size={16} /> 組裝進度（完成就打勾）
                        </div>
                        <div className="card-body">
                            <AssemblyChecklist />
                        </div>
                    </div>

                    {/* Step 7 摘要 */}
                    <div className="card" style={{ marginTop: 16 }}>
                        <div className="card-header">
                            <FileText size={16} /> Step 7 — 摘要生成（最後做）
                        </div>
                        <div className="card-body">
                            <p style={{ fontSize: 12, color: 'var(--ink-mid)', marginBottom: 12 }}>
                                先填入各章核心句，再用下方 Prompt 讓 AI 幫你生成摘要初稿：
                            </p>
                            <ThinkRecord
                                dataKey="w16-abstract-cores"
                                prompt="各章核心句（一章一句）"
                                scaffold={[
                                    '引言核心：',
                                    '文獻核心：',
                                    '方法核心：',
                                    '結果核心：',
                                    '結論核心：',
                                ]}
                            />
                            <div style={{ marginTop: 12 }}>
                                <CopyablePrompt text={PROMPTS.abstract} label="摘要生成 Prompt" />
                            </div>
                            <ThinkRecord
                                dataKey="w16-abstract-ai"
                                prompt="AI 生成的摘要初稿（貼上）"
                            />
                            <ThinkRecord
                                dataKey="w16-abstract-edit"
                                prompt="我修改了哪些部分？AI 哪裡說錯了？語氣哪裡不對？"
                            />
                            <ThinkRecord
                                dataKey="w16-abstract-final"
                                prompt="最終確定的摘要（150-200 字）"
                            />
                        </div>
                    </div>

                    {/* AI 潤色 Prompt */}
                    <div className="card" style={{ marginTop: 16 }}>
                        <div className="card-header">
                            <Bot size={16} /> AI 文字潤色（至少做一次）
                        </div>
                        <div className="card-body">
                            <CopyablePrompt text={PROMPTS.polish} label="學術語言優化 Prompt" />
                            <ThinkRecord
                                dataKey="w16-polish-chapter"
                                prompt="我選的段落來自第___章，AI 改了哪些東西？（用自己的話描述）"
                            />
                            <ThinkRecord
                                dataKey="w16-polish-diff"
                                prompt="AI 潤色後的版本有哪些改動？"
                            />
                            <ThinkRecord
                                dataKey="w16-polish-judge"
                                prompt="我保留的／我刪掉的／我改回去的"
                            />
                        </div>
                    </div>

                    {/* 縫合 Prompt */}
                    <div className="card" style={{ marginTop: 16 }}>
                        <div className="card-header">
                            <Bot size={16} /> 章節縫合手術（選用）
                        </div>
                        <div className="card-body">
                            <p style={{ fontSize: 12, color: 'var(--ink-mid)', marginBottom: 12 }}>
                                如果你把不同章節拼在一起後，讀起來像「不同人寫的」——用這個 Prompt 做縫合手術：
                            </p>
                            <CopyablePrompt text={PROMPTS.stitch} label="章節縫合 Prompt" />
                        </div>
                    </div>

                    {/* 完稿健檢 */}
                    <div className="card" style={{ marginTop: 16, border: '2px solid var(--accent)' }}>
                        <div className="card-header" style={{ background: 'var(--accent)', color: '#fff' }}>
                            <FileText size={16} /> 完稿健檢（組裝完成後用）
                        </div>
                        <div className="card-body">
                            <p style={{ fontSize: 13, lineHeight: 1.8, marginBottom: 12 }}>
                                報告在 Canva 排版完成後，<strong>匯出 PDF → 上傳給 AI</strong>。AI 只做診斷、不動刀——你拿到「健檢報告」後自己決定改什麼。
                            </p>
                            <div style={{ padding: '10px 16px', background: '#FEF3C7', borderRadius: 'var(--radius-unified)', fontSize: 12, color: '#92400E', lineHeight: 1.7, marginBottom: 12 }}>
                                <strong>操作步驟：</strong>Canva → 右上角「分享」→「下載」→ 選 PDF → 上傳到 ChatGPT 或 Claude → 貼上下方 Prompt
                            </div>
                            <CopyablePrompt text={PROMPTS.checkup} label="完稿健檢 Prompt（上傳 PDF 後使用）" />
                            <ThinkRecord
                                dataKey="w16-checkup-result"
                                prompt="AI 健檢結果（貼上 AI 的五項診斷＋健康指數）"
                            />
                            <ThinkRecord
                                dataKey="w16-checkup-action"
                                prompt="我決定改什麼？哪些 AI 說的有道理？哪些我選擇不改？為什麼？"
                                scaffold={[
                                    '我決定修改的：',
                                    '我選擇不改的（原因）：',
                                ]}
                            />
                        </div>
                    </div>
                </div>
            ),
        },

        /* ── Step 3 ── */
        {
            title: '海報規劃',
            icon: <Layout size={18} />,
            content: (
                <div className="prose-zh">
                    <div className="card">
                        <div className="card-header">
                            <Eye size={16} /> 3 秒吸引力法則：大、少、準、亮
                        </div>
                        <div className="card-body">
                            <p style={{ fontSize: 13, lineHeight: 1.8, marginBottom: 16 }}>
                                下週 Gallery Walk，沒有聽眾會讀你的論文。他們在走過來的 <strong>3 秒內</strong> 決定要不要停下來聽你說話。那 3 秒，靠的是你的海報。
                            </p>
                            <div className="w16-poster-grid">
                                {POSTER_RULES.map(r => (
                                    <div className="w16-poster-card" key={r.word} style={{ background: r.color, color: r.textColor }}>
                                        <div className="w16-poster-icon">{r.icon}</div>
                                        <div className="w16-poster-word">{r.word}</div>
                                        <div className="w16-poster-desc">{r.desc}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* 海報文字規劃 */}
                    <div className="card" style={{ marginTop: 16 }}>
                        <div className="card-header">
                            <PenTool size={16} /> 海報文字規劃（先想好再排版）
                        </div>
                        <div className="card-body">
                            <ThinkRecord
                                dataKey="w16-poster-title"
                                prompt="大標題（要吸引人停下來！建議用問句或驚人數字）"
                                scaffold={['試試問句：「為什麼___？」', '或驚人數字：「___% 的高中生竟然___」']}
                            />
                            <ThinkRecord
                                dataKey="w16-poster-finding"
                                prompt="最核心的一個發現（一句話，可以是數字）"
                            />
                            <ThinkRecord
                                dataKey="w16-poster-chart"
                                prompt="關鍵圖表——你打算放哪一張？（W14 或 W15 做的哪一個？）"
                            />
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 8 }}>
                                <div>
                                    <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--ink-mid)', marginBottom: 4 }}>左區：研究動機（一句話）</div>
                                    <ThinkRecord dataKey="w16-poster-motive" prompt="一句話說清楚為什麼做這個研究" />
                                </div>
                                <div>
                                    <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--ink-mid)', marginBottom: 4 }}>右區：研究方法（一句話）</div>
                                    <ThinkRecord dataKey="w16-poster-method" prompt="一句話說清楚你用什麼方法" />
                                </div>
                            </div>
                            <ThinkRecord
                                dataKey="w16-poster-conclusion"
                                prompt="結論（不超過三點，每點一行）"
                                scaffold={['1.', '2.', '3.']}
                            />
                        </div>
                    </div>
                </div>
            ),
        },

        /* ── Step 4 ── */
        {
            title: '海報製作',
            icon: <Layout size={18} />,
            content: (
                <div className="prose-zh">
                    {/* 紙筆線框圖 */}
                    <div className="card" style={{ border: '2px solid #DC2626' }}>
                        <div className="card-header" style={{ background: '#FEF2F2', color: '#991B1B' }}>
                            ⚠️ 先畫紙筆線框圖！禁止打開電腦
                        </div>
                        <div className="card-body" style={{ background: '#FEF2F2' }}>
                            <p style={{ fontSize: 13, lineHeight: 1.8, color: '#991B1B', fontWeight: 600, marginBottom: 12 }}>
                                前 15 分鐘嚴禁打開電腦。先在紙上畫好版面配置——哪裡放標題、哪裡放圖表、重點在哪裡。<br />
                                沒有拿給老師（或組長）看的，不准打開 Canva！
                            </p>
                            <div style={{
                                background: '#fff',
                                border: '2px dashed #FECACA',
                                borderRadius: 'var(--radius-unified)',
                                padding: 20,
                                fontFamily: 'var(--font-mono)',
                                fontSize: 11,
                                color: '#6B7280',
                                lineHeight: 2,
                                whiteSpace: 'pre-line',
                            }}>
{`┌─────────────────────────────────────┐
│          【研究大標題】               │
│                                     │
│ [左上：研究動機]   [右上：研究方法]     │
│  一句話            一句話             │
│                                     │
│       [ 中央：最強圖表展現區 ]         │
│       （全海報最顯眼的位置）           │
│                                     │
│ [左下：關鍵發現]   [右下：結論]        │
│  1.                摘要一句最震撼重點   │
│  2.                                 │
│  3.               [QR Code]          │
└─────────────────────────────────────┘`}
                            </div>
                            <p style={{ fontSize: 11, color: '#991B1B', marginTop: 8 }}>
                                海報的重點是排版邏輯，不是漂亮的花邊。先確認最重要的發現有沒有放中間，再考慮美化。
                            </p>
                        </div>
                    </div>

                    {/* 製作提示 */}
                    <div className="card" style={{ marginTop: 16 }}>
                        <div className="card-header">
                            <Layout size={16} /> 數位版製作提示
                        </div>
                        <div className="card-body" style={{ fontSize: 12, lineHeight: 1.8, color: 'var(--ink-mid)' }}>
                            <p>線框圖確認後才可以打開電腦（Canva / Google 簡報 / 手繪皆可）。</p>
                            <p style={{ marginTop: 8 }}><strong>常見陷阱提醒：</strong></p>
                            <div style={{ marginTop: 8, padding: '12px 16px', background: 'var(--paper-warm)', borderRadius: 'var(--radius-unified)', fontSize: 12, lineHeight: 1.8 }}>
                                「我想換一個很漂亮的背景」→ 先確認最重要發現有沒有放中間、字數有沒有控制。花邊是最後一步！<br />
                                「內容很多，刪掉覺得少了」→ 完整內容在報告裡，海報只需讓人走過來問「這是什麼？」<br />
                                「標題太學術了」→ 試改成問句：「為什麼高中生越補習反而越焦慮？」
                            </div>
                        </div>
                    </div>
                </div>
            ),
        },

        /* ── Step 5 ── */
        {
            title: '回顧繳交',
            icon: <FileText size={18} />,
            content: (
                <div className="prose-zh">
                    {/* 同儕 3 秒互評 */}
                    <div className="w16-review-card">
                        <div className="w16-review-header">
                            <Eye size={16} /> 同儕 3 秒互評
                        </div>
                        <div className="w16-review-body">
                            <p style={{ marginBottom: 12 }}>
                                把你的海報草稿給旁邊的同學看 <strong>3 秒</strong>，然後問他：「你記住了什麼？」
                            </p>
                            <ThinkRecord
                                dataKey="w16-peer-memory"
                                prompt="同學看了 3 秒後，他記得的是什麼？"
                            />
                            <ThinkRecord
                                dataKey="w16-peer-reflect"
                                prompt="我最重要的東西有被記住嗎？如果沒有，我打算怎麼調整？"
                                scaffold={[
                                    '有被記住 → 不需要大改',
                                    '沒有被記住 → 我打算把「___」放更大',
                                ]}
                            />
                        </div>
                    </div>

                    {/* W17 預告 */}
                    <div className="card" style={{ marginTop: 16, background: '#1a1a2e', border: 'none' }}>
                        <div className="card-body" style={{ color: '#e2e8f0' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                                <ArrowRight size={16} style={{ color: 'var(--accent)' }} />
                                <span style={{ fontSize: 13, fontWeight: 700 }}>下週 W17 最終戰：Gallery Walk 發表會</span>
                            </div>
                            <div style={{ fontSize: 12, lineHeight: 1.8, opacity: 0.8 }}>
                                必須攜帶：海報（紙本或電子）＋ 2 分鐘宣傳話術<br />
                                你是報告者，也是聆聽者！A/B 組輪替，每個人兩個身分都要做。
                            </div>
                        </div>
                    </div>

                    <div style={{ marginTop: 20 }}>
                                                {/* AIRED 敘事紀錄（循序漸進：五欄 → 一段話） */}
                        <AIREDNarrative week="16" hint="這週用 AI 組裝研究報告" />

                        <ExportButton
                            weekLabel="W16 報告撰寫與海報製作"
                            fields={EXPORT_FIELDS}
                        />
                    </div>
                </div>
            ),
        },
    ];

    return (
        <div className="page-container animate-in-fade-slide">
            {/* TOP BAR */}
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-4 mb-8 md:mb-12 gap-3">
                <div className="text-[11px] font-mono text-[var(--ink-light)] flex items-center gap-2 min-w-0">
                    <span className="hidden md:inline">研究方法與專題 / 分析與報告 / </span><span className="text-[var(--ink)] font-bold">報告與海報 W16</span>
                </div>
                <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
                    <span className="bg-[var(--paper-warm)] text-[var(--ink)] text-[10px] font-bold px-2 py-0.5 rounded-[2px] font-mono">100 MINS</span>
                    <ResetWeekButton weekPrefix="w16-" />
                    <button
                        onClick={() => setShowLessonMap(!showLessonMap)}
                        className="text-[11px] text-[var(--ink-light)] hover:text-[var(--accent)] transition-colors flex items-center gap-1 font-mono"
                        type="button"
                    >
                        <Map size={12} /> <span className="hidden md:inline">{showLessonMap ? 'Hide Plan' : 'Instructor View'}</span>
                    </button>
                    <span className="hidden md:inline-block bg-[var(--ink)] text-white text-[10px] font-bold px-2 py-0.5 rounded-[2px] font-mono">AI-RED · D</span>
                </div>
            </div>

            {showLessonMap && (
                <div className="animate-in slide-in-from-top-4 duration-300 mb-8">
                    <LessonMap data={W16Data} />
                </div>
            )}

            {/* PAGE HEADER — Hero Block */}
            <HeroBlock
                kicker="R.I.B. 調查檔案 · 研究方法與專題 · W16"
                title="報告撰寫與海報製作 · "
                accentTitle="從數據到故事"
                subtitle="好消息：你已經寫完 80%。前 15 週每份學習單都藏著報告的原料，現在只需要「搬運 → 縫合 → 潤色」三步組裝。"
                meta={[
                    { label: '第一節', value: '七步組裝清單 + AI 組裝 Prompt + 人工校對' },
                    { label: '第二節', value: '海報製作 + 發表預演 + 繳交報告' },
                    { label: '課堂產出', value: '研究報告初稿 + A1 海報' },
                    { label: '帶去 W17', value: '列印好的海報 + 報告定稿' },
                ]}
            />
            <CourseArc items={[
                    { wk: 'W1-W2', name: '探索階段\nRED公約', past: true },
                    { wk: 'W3-W4', name: '題目診斷\n博覽會', past: true },
                    { wk: 'W5-W7', name: '規劃分流\n企劃定案', past: true },
                    { wk: 'W8-W10', name: '工具設計\n倫理審查', past: true },
                    { wk: 'W11-W12', name: '執行階段\n自主研究', past: true },
                    { wk: 'W13-W14', name: '數據轉譯\n圖表結論', past: true },
                    { wk: 'W15-W16', name: '成果簡報\n博覽發表', now: true },
                ]} />

            {/* STEP ENGINE */}
            <StepEngine
                steps={steps}
                prevWeek={{ label: '回 W15 研究結論', to: '/w15' }}
                nextWeek={{ label: '前往 W17 成果發表', to: '/w17' }}
            flat
            />
        </div>
    );
};

export { W16Page };
export default W16Page;
