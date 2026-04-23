import React, { useState, useCallback, useEffect } from 'react';
import CourseArc from '../components/ui/CourseArc';
import './W11.css';
import ThinkRecord from '../components/ui/ThinkRecord';
import AIREDNarrative from '../components/ui/AIREDNarrative';
import StepEngine from '../components/ui/StepEngine';
import HeroBlock from '../components/ui/HeroBlock';
import ExportButton from '../components/ui/ExportButton';
import ResetWeekButton from '../components/ui/ResetWeekButton';
import { readRecords } from '../components/ui/ThinkRecord';
import {
    CheckCircle2,
    Bot,
    Copy,
    Check,
    Plane,
    Users,
    Radio,
    Unlock,
} from 'lucide-react';

/* ══════════════════════════════════════
 *  資料常數
 * ══════════════════════════════════════ */

/* — 定稿自查清單 — */
const TOOL_CHECKLIST = [
    '研究說明／知情同意區塊已包含在工具中',
    '每道題目都對應至少一個研究問題',
    '已用錯誤類型速查卡自我檢查（W9 的卡）',
    '工具長度合理（問卷 15–30 題；訪談 5–10 題）',
    '已完成 W10 的 AI 檢核 + 人工預試，並根據回饋修正',
];

/* — 倫理四問 — */
const ETHICS_QUESTIONS = [
    {
        id: 'consent',
        icon: '📝',
        title: '知情同意',
        color: '#2563EB',
        question: '受訪者知道這是什麼研究嗎？你打算怎麼告知他們？',
        hint: '問卷開頭 or 訪談前要先說明：研究目的、所需時間、資料用途。',
    },
    {
        id: 'privacy',
        icon: '🔐',
        title: '保密性',
        color: '#7C3AED',
        question: '你的工具有沒有收集可辨識個人身份的資料（學號、電話）？',
        hint: '有 → 必要嗎？不必要就刪掉。必要就說明保密措施。',
    },
    {
        id: 'harm',
        icon: '🛡️',
        title: '不傷害',
        color: '#DC2626',
        question: '你的題目有沒有涉及敏感領域（情緒、家庭、感情、身體、成績）？',
        hint: '有敏感題 → 可以保留，但要有應對方式（如：加上「如不方便可跳過」）。',
    },
    {
        id: 'voluntary',
        icon: '🤝',
        title: '自願性',
        color: '#059669',
        question: '你打算怎麼招募受訪者？有沒有隱性壓力的可能？',
        hint: '拜託朋友填 → 他們很難拒絕。要明確說「不填完全沒關係」。',
    },
];

/* — 知情同意書 AI 審查 Prompt — */
const CONSENT_PROMPT = `我寫了一段問卷（或訪談）的知情同意說明，請幫我：

1. 從「16-18歲高中生」的角度閱讀這段說明
2. 找出任何看不懂或容易誤解的詞彙與句子
3. 找出任何可能讓受訪者感到壓力或不舒服的語氣
4. 幫我改寫成更清楚、更友善的版本（保留所有必要資訊）

以下是我的知情同意說明：
【貼上你的知情同意說明】`;

/* — Pilot Test 方法分流指示（方法組內輪轉） — */
const PILOT_INSTRUCTIONS = {
    questionnaire: {
        label: '📋 問卷組',
        format: 'A→B→C 輪填',
        steps: [
            '組內 3 人一輪：A 填 B 的問卷、B 填 C、C 填 A',
            '填答時計時（每人應 5 分鐘內填完，超過代表太長）',
            '填答時用便利貼標「卡點」：看不懂的題、選項選不出來的題、誤解的題',
            '填完後 3 分鐘口頭回饋給問卷設計者',
        ],
    },
    interview: {
        label: '🎤 訪談組',
        format: '兩人一組互相模擬',
        steps: [
            'A 當受訪者 B 當訪談者，跑訪綱 15 分鐘（不用跑完，抓主要 3-4 題）',
            '訪後 3 分鐘回饋：哪題卡住？哪題追問太尬？',
            '角色互換再 15 分鐘',
            '互相把發現寫在下方紀錄',
        ],
    },
    experiment: {
        label: '🧪 實驗組（架設圖審核）',
        format: '互看設計圖，不跑實驗',
        steps: [
            '把你的實驗架設圖攤開（變項控制表 + 流程 Step 1-5 + 分組方式）',
            '和另一位實驗組交換圖',
            '用四問審對方：(1) 除自變項外其他真的都一樣？(2) 怎麼控制先前差異？(3) 測量客觀？(4) 4 週內做得完？',
            '互換紀錄發現的漏洞',
        ],
    },
    observation: {
        label: '👀 觀察組',
        format: '同學扮受觀察者',
        steps: [
            '找一位同學讓你觀察 10 分鐘（做任何事都可）',
            '你用自己設計的紀錄表即時紀錄',
            '結束後檢查：類別夠清楚嗎？分類速度跟得上嗎？有沒有不知道該歸哪類的行為？',
            '和同學討論發現',
        ],
    },
    literature: {
        label: '📚 文獻組',
        format: '互閱比較矩陣',
        steps: [
            '把你的比較矩陣（至少 3 篇文獻、7+ 欄）給同學看',
            '同學讀 10 分鐘後回答三問：欄位看得懂嗎？有沒有欄位多餘或遺漏？能回答研究問題嗎？',
            '角色互換',
            '互相把發現寫下來',
        ],
    },
};


/* — 備案 AI 審查 Prompt — */
const BACKUP_PROMPT = `這是我的研究備案：【貼上你的備案內容】

請判斷：這個備案夠具體嗎？
有沒有明確的「人」、「地點」、「時間」、「行動」？
如果不夠具體，幫我改得更具體。`;

/* — ExportButton 欄位 — */
const EXPORT_FIELDS = [
    /* Step 1：入場 + 配對指示 */
    { key: 'w11-w10-feedback-quick', label: 'W10 老師回饋快速摘要', question: '老師對 W10 計畫書定稿的主要建議' },
    /* Step 2：Pilot Test 實戰 */
    { key: 'w11-pilot-partner', label: 'Pilot Test 對象', question: '組內輪轉配對到誰？' },
    { key: 'w11-pilot-findings', label: 'Pilot Test 發現', question: '預試者的口頭 + 書面回饋、工具卡點' },
    /* Step 3：工具修正 + 倫理審查 */
    { key: 'w11-tool-final-revision', label: '工具第二輪修正', question: '根據 Pilot 回饋要改的地方' },
    { key: 'w11-ethics-consent', label: '倫理 · 知情同意' },
    { key: 'w11-ethics-privacy', label: '倫理 · 保密性' },
    { key: 'w11-ethics-harm', label: '倫理 · 不傷害' },
    { key: 'w11-ethics-voluntary', label: '倫理 · 自願性' },
    { key: 'w11-consent-ai', label: 'AI 知情同意書審查回覆' },
    { key: 'w11-consent-judge', label: 'AI 建議採納判斷' },
    { key: 'w11-consent-final', label: '知情同意書最終版' },
    /* Step 4：施測啟動 + AIRED */
    { key: 'w11-plan-target', label: '施測目標與底線' },
    { key: 'w11-plan-schedule', label: 'W12-W13 執行時程' },
    { key: 'w11-plan-backup', label: '應急備案' },
    { key: 'w11-launch', label: '施測啟動宣告' },
    { key: 'w11-aired-record', label: 'W11 完整 AIRED 敘事', question: '本週最重要的一次 AI 互動（A-I-R-E-D 五要素）' },
];

/* ══════════════════════════════════════
 *  內部元件
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
        <div className="w11-prompt-box">
            <div className="w11-prompt-header">
                <span className="w11-prompt-label">
                    <Bot size={14} /> {label || 'AI Prompt — 複製後貼到 AI 對話窗'}
                </span>
                <button onClick={handleCopy} className="w11-copy-btn">
                    {copied ? <><Check size={12} /> 已複製</> : <><Copy size={12} /> 複製</>}
                </button>
            </div>
            <pre className="w11-prompt-text">{text}</pre>
        </div>
    );
};

/* 互動式自查清單 */
const InteractiveChecklist = () => {
    const [checks, setChecks] = useState(() => TOOL_CHECKLIST.map(() => false));
    const toggle = (i) => setChecks(prev => prev.map((v, j) => j === i ? !v : v));
    const allChecked = checks.every(Boolean);

    return (
        <div>
            <div className="w11-checklist">
                {TOOL_CHECKLIST.map((item, i) => (
                    <div
                        key={i}
                        className={`w11-check-item ${checks[i] ? 'checked' : ''}`}
                        onClick={() => toggle(i)}
                    >
                        <div className="w11-check-box">
                            {checks[i] && <Check size={14} />}
                        </div>
                        <span>{item}</span>
                    </div>
                ))}
            </div>
            {allChecked && (
                <div className="mt-4 bg-[#F0FDF4] border border-[var(--success)] rounded-[var(--radius-unified)] p-4 text-[13px] text-[var(--success)] font-bold flex items-center gap-2">
                    <CheckCircle2 size={16} /> 自查全部通過！可以進入倫理審查。
                </div>
            )}
        </div>
    );
};

/* ══════════════════════════════════════
 *  老師秘密審查按鈕（⚖ 連續點 5 次觸發）
 * ══════════════════════════════════════ */

const TeacherApprovalBadge = () => {
    const [clicks, setClicks] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [teacherName, setTeacherName] = useState('');
    const [approval, setApproval] = useState(() => {
        try {
            const raw = localStorage.getItem('w11-teacher-approval');
            return raw ? JSON.parse(raw) : null;
        } catch { return null; }
    });

    const handleSecretClick = () => {
        const next = clicks + 1;
        if (next >= 5) {
            setShowModal(true);
            setClicks(0);
        } else {
            setClicks(next);
            setTimeout(() => setClicks(0), 2000);
        }
    };

    const confirmApproval = () => {
        const name = teacherName.trim();
        if (!name) return;
        const record = {
            approved: true,
            teacher: name,
            timestamp: new Date().toISOString(),
        };
        try { localStorage.setItem('w11-teacher-approval', JSON.stringify(record)); } catch {}
        setApproval(record);
        setShowModal(false);
        setTeacherName('');
    };

    const resetApproval = () => {
        if (!window.confirm('確定取消教師審查通過狀態？')) return;
        try { localStorage.removeItem('w11-teacher-approval'); } catch {}
        setApproval(null);
    };

    if (approval && approval.approved) {
        return (
            <div className="bg-[#F0FDF4] border-2 border-[var(--success)] rounded-[var(--radius-unified)] p-4 flex items-start gap-3">
                <CheckCircle2 size={20} className="text-[var(--success)] flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                    <div className="font-bold text-[14px] text-[var(--success)]">✅ 已通過教師倫理審查</div>
                    <div className="text-[12px] text-[var(--ink-mid)] mt-1">
                        審查老師：<strong>{approval.teacher}</strong>
                        <br />時間：{new Date(approval.timestamp).toLocaleString('zh-TW')}
                    </div>
                </div>
                <button
                    onClick={resetApproval}
                    className="text-[10px] text-[var(--ink-light)] hover:text-[var(--danger)] font-mono"
                    title="老師取消審查（誤操作用）"
                    type="button"
                >取消</button>
            </div>
        );
    }

    return (
        <>
            <div className="bg-[#FEF3C7] border border-[#D97706]/30 rounded-[var(--radius-unified)] p-4 flex items-start gap-3">
                <span
                    onClick={handleSecretClick}
                    className="text-[20px] cursor-pointer select-none flex-shrink-0"
                    title=""
                    style={{ userSelect: 'none' }}
                >⚖</span>
                <div className="flex-1 min-w-0">
                    <div className="font-bold text-[13px] text-[#92400E]">尚未通過教師倫理審查</div>
                    <div className="text-[11.5px] text-[#92400E]/85 mt-1 leading-relaxed">
                        完成上方知情同意書定稿後，把計畫書拿給老師當面審查。老師會在這裡蓋章。
                    </div>
                </div>
            </div>
            {showModal && (
                <div
                    className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
                    onClick={() => setShowModal(false)}
                >
                    <div
                        className="bg-white rounded-[var(--radius-unified)] max-w-[400px] w-full p-5 space-y-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center gap-2">
                            <span className="text-[24px]">⚖</span>
                            <h3 className="font-bold text-[16px] text-[var(--ink)]">教師倫理審查通過</h3>
                        </div>
                        <p className="text-[13px] text-[var(--ink-mid)] leading-relaxed">
                            僅老師操作。請輸入您的姓名以完成審查紀錄。
                        </p>
                        <input
                            type="text"
                            value={teacherName}
                            onChange={(e) => setTeacherName(e.target.value)}
                            placeholder="例：張 OO 老師"
                            className="w-full border border-[var(--border)] rounded-[6px] px-3 py-2 text-[14px]"
                            autoFocus
                        />
                        <div className="flex gap-2 justify-end">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 text-[13px] text-[var(--ink-mid)]"
                                type="button"
                            >取消</button>
                            <button
                                onClick={confirmApproval}
                                disabled={!teacherName.trim()}
                                className="bg-[var(--success)] text-white px-4 py-2 rounded-[6px] text-[13px] font-bold disabled:opacity-50"
                                type="button"
                            >確認通過</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

/* ══════════════════════════════════════
 *  主元件
 * ══════════════════════════════════════ */

export const W11Page = () => {
    const [w9Method, setW9Method] = useState('');
    const [w9Topic, setW9Topic] = useState('');

    useEffect(() => {
        const saved = readRecords();
        const method = saved['w9-my-method']?.trim() || saved['w8-tool-method']?.trim() || '';
        const topic = saved['w8-merged-topic']?.trim() || saved['w8-research-question']?.trim() || '';
        if (method) setW9Method(method);
        if (topic) setW9Topic(topic);
    }, []);

    /* ── 五步驟 ──────────────────────────────────────── */

    const steps = [
        /* ─── Step 1：入場 + 讀 W10 回饋 + Pilot 配對指示（第一節 15 min）─── */
        {
            title: '入場 + Pilot 配對指示',
            icon: '📬',
            content: (
                <div className="space-y-8 prose-zh">
                    {/* 讀 W10 老師回饋（5 min） */}
                    <div className="bg-white border-2 border-[var(--accent)] rounded-[var(--radius-unified)] p-5 max-w-[720px]">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-[18px]">📬</span>
                            <span className="font-bold text-[14px] text-[var(--ink)]">開始前：先看老師對 W10 計畫書定稿的回饋（5 分鐘）</span>
                        </div>
                        <p className="text-[13px] text-[var(--ink-mid)] leading-relaxed mb-3">
                            老師已在 <strong>Google Classroom</strong> 發回 W10 計畫書的批改。請先打開看過，把老師<strong className="text-[var(--ink)]">最主要</strong>的一兩句建議記下來——這會影響你今天 Pilot 要特別注意的點。
                        </p>
                        <ThinkRecord
                            dataKey="w11-w10-feedback-quick"
                            prompt="老師對我 W10 計畫書最主要的建議是？"
                            placeholder="例：第六章問卷題目太多要砍、第七章實施時程要更具體、倫理章節不夠深入⋯⋯"
                            rows={3}
                        />
                        <p className="text-[11px] text-[var(--ink-light)] leading-relaxed mt-2">
                            💡 還沒拿到回饋？可能老師還在批。先往下做 Pilot，之後有回饋再回頭修正。
                        </p>
                    </div>

                    {/* Pilot Test 配對指示（10 min） */}
                    <div>
                        <h4 className="font-serif text-[18px] md:text-[20px] font-bold text-[var(--ink)] mb-2">
                            Pilot Test 配對方式：方法組內輪轉
                        </h4>
                        <p className="text-[13px] text-[var(--ink-mid)] leading-relaxed mb-4">
                            Pilot Test 的重點是<strong className="text-[var(--ink)]">抓工具的毛病</strong>，不是驗證假設。同方法組內互測最有效——你們都懂彼此的研究方法語言，能給最精準的回饋。
                        </p>

                        {/* 依方法分流的指示卡 */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {Object.entries(PILOT_INSTRUCTIONS).map(([mid, info]) => (
                                <div key={mid} className="bg-white border border-[var(--border)] rounded-[var(--radius-unified)] p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="font-bold text-[13px] text-[var(--ink)]">{info.label}</span>
                                        <span className="text-[10px] font-mono text-[var(--ink-light)] bg-[var(--paper-warm)] px-1.5 py-0.5 rounded">{info.format}</span>
                                    </div>
                                    <ol className="text-[12px] text-[var(--ink-mid)] leading-[1.85] space-y-1 list-decimal list-inside">
                                        {info.steps.map((s, i) => <li key={i}>{s}</li>)}
                                    </ol>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 知情同意提前預告 */}
                    <div className="w7-notice w7-notice-gold">
                        📢 <strong>預試前先讀一段知情同意給預試者聽</strong>：即使是同學當預試者，也要告知「這是研究預試、回饋會被紀錄、可以隨時停」。這是倫理的第一課。Step 3 還會正式審查知情同意書。
                    </div>
                </div>
            ),
        },

        /* ─── Step 2：Pilot Test 實戰紀錄（第一節 35 min）─── */
        {
            title: 'Pilot Test 實戰紀錄',
            icon: '🧪',
            content: (
                <div className="space-y-8 prose-zh">
                    <p className="text-[14px] text-[var(--ink-mid)] leading-relaxed max-w-[720px]">
                        依 Step 1 的指示執行 Pilot Test。過程中隨時把發現的問題記下來——<strong className="text-[var(--ink)]">預試時卡住的地方，正式施測時會放大十倍</strong>。
                    </p>

                    <ThinkRecord
                        dataKey="w11-pilot-partner"
                        prompt="你和誰配對？簡短寫一句對方的研究主題讓老師知道你做了 Pilot"
                        placeholder="例：和訪談組的小明配對，他研究「資優生的挫折經驗」"
                        rows={2}
                    />

                    <ThinkRecord
                        dataKey="w11-pilot-findings"
                        prompt="Pilot Test 發現（預試者的回饋 + 你自己觀察到的工具卡點）"
                        defaultTemplate={'預試者回饋（口頭或書面）：\n1. ___\n2. ___\n3. ___\n\n我自己觀察到的問題（用自己的話）：\n1. ___\n2. ___\n\n【實驗組專用】架設圖被挑出的漏洞：\n・控制變項漏洞：___\n・流程邏輯漏洞：___'}
                        rows={12}
                    />

                    <div className="w7-notice w7-notice-teal">
                        ✅ Pilot 紀錄寫完 → 下節課進入第二輪修正 + 倫理審查 + 施測啟動。
                    </div>
                </div>
            ),
        },

        /* ─── Step 3：工具修正 + 倫理審查（第二節 30 min）─── */
        {
            title: '工具修正 + 倫理審查',
            icon: '⚖',
            content: (
                <div className="space-y-8 prose-zh">
                    {/* 第二輪工具修正 */}
                    <div>
                        <h4 className="font-serif text-[18px] md:text-[20px] font-bold text-[var(--ink)] mb-2">
                            第二輪工具修正（根據 Pilot 回饋）
                        </h4>
                        <p className="text-[13px] text-[var(--ink-mid)] leading-relaxed mb-4">
                            把 Step 2 的 Pilot 發現整理成具體修改清單，直接改 docx 第六章工具。這是你工具的最後一版——從現在開始不再大改。
                        </p>
                        <ThinkRecord
                            dataKey="w11-tool-final-revision"
                            prompt="根據 Pilot 發現要改的地方（對應 docx 第六章）"
                            defaultTemplate={'修正 1：第___題原本「___」→ 改成「___」（原因：___）\n修正 2：___\n修正 3：___\n\n【實驗組】架設圖要改的地方：\n___'}
                            rows={8}
                        />
                    </div>

                    {/* 倫理四問自查 */}
                    <div>
                        <h4 className="font-serif text-[18px] md:text-[20px] font-bold text-[var(--ink)] mb-2">
                            倫理四問自查
                        </h4>
                        <p className="text-[13px] text-[var(--ink-mid)] leading-relaxed mb-4">
                            逐一回答四個問題——這是研究倫理的基礎底線。每題都要具體回答，不可寫「有注意」。
                        </p>
                        <div className="space-y-4">
                            {ETHICS_QUESTIONS.map((q) => (
                                <div key={q.id} className="bg-white border border-[var(--border)] rounded-[var(--radius-unified)] overflow-hidden">
                                    <div className="px-5 py-3 flex items-center gap-2 border-b border-[var(--border)]" style={{ backgroundColor: `${q.color}12` }}>
                                        <span className="text-[18px]">{q.icon}</span>
                                        <span className="font-bold text-[14px]" style={{ color: q.color }}>{q.title}</span>
                                    </div>
                                    <div className="p-5">
                                        <p className="text-[13px] text-[var(--ink-mid)] mb-2"><strong className="text-[var(--ink)]">{q.question}</strong></p>
                                        <p className="text-[11.5px] text-[var(--ink-light)] mb-3 leading-relaxed">💡 {q.hint}</p>
                                        <ThinkRecord
                                            dataKey={`w11-ethics-${q.id}`}
                                            prompt={`我對「${q.title}」的具體做法`}
                                            rows={3}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 知情同意書 AI 審查 */}
                    <div>
                        <h4 className="font-serif text-[18px] md:text-[20px] font-bold text-[var(--ink)] mb-2">
                            知情同意書 AI 審查
                        </h4>
                        <p className="text-[13px] text-[var(--ink-mid)] leading-relaxed mb-4">
                            把你要給受訪者看的知情同意說明貼給 AI，讓它從 16-18 歲高中生的角度檢查有沒有看不懂、有壓力的地方。
                        </p>
                        <CopyablePrompt text={CONSENT_PROMPT} label="知情同意書 AI 審查 Prompt" />
                        <div className="mt-4 space-y-4">
                            <ThinkRecord
                                dataKey="w11-consent-ai"
                                prompt="AI 審查回覆（貼上原文）"
                                placeholder="貼上 AI 的完整回覆，含所有修改建議"
                                rows={8}
                            />
                            <ThinkRecord
                                dataKey="w11-consent-judge"
                                prompt="AI 建議採納判斷"
                                defaultTemplate={'建議 1：___ → ✅ 採納 / ❌ 不採納（理由：___）\n建議 2：___ → ___\n建議 3：___ → ___'}
                                rows={6}
                            />
                            <ThinkRecord
                                dataKey="w11-consent-final"
                                prompt="知情同意書最終版（改好的完整版）"
                                placeholder="貼上修訂後的完整知情同意說明——正式施測時就用這版"
                                rows={10}
                            />
                        </div>
                    </div>

                    {/* 教師蓋章區塊（秘密按鈕） */}
                    <div>
                        <h4 className="font-serif text-[18px] md:text-[20px] font-bold text-[var(--ink)] mb-2">
                            教師倫理審查
                        </h4>
                        <p className="text-[13px] text-[var(--ink-mid)] leading-relaxed mb-4">
                            完成上方倫理四問 + 知情同意書定稿後，把整份計畫書拿給老師當面審查。通過後，施測才能正式啟動。
                        </p>
                        <TeacherApprovalBadge />
                    </div>
                </div>
            ),
        },

        /* ─── Step 4：施測啟動 + AIRED + W12 預告（第二節 20 min）─── */
        {
            title: '施測啟動 + AIRED',
            icon: '🛫',
            content: (
                <div className="space-y-8 prose-zh">
                    {/* 施測啟動 */}
                    <div>
                        <h4 className="font-serif text-[18px] md:text-[20px] font-bold text-[var(--ink)] mb-2">
                            施測啟動
                        </h4>
                        <p className="text-[13px] text-[var(--ink-mid)] leading-relaxed mb-4">
                            W12-W13 正式施測。現在把目標、時程、備案寫清楚——有寫的和沒寫的完成率差兩倍以上。
                        </p>
                        <div className="space-y-4">
                            <ThinkRecord
                                dataKey="w11-plan-target"
                                prompt="施測目標與底線"
                                defaultTemplate={'目標：收集 ___ 份有效樣本（問卷）／訪談 ___ 位／觀察 ___ 次／分析 ___ 篇文獻\n底線（最低可接受）：___\n預期日期：W___'}
                                rows={5}
                            />
                            <ThinkRecord
                                dataKey="w11-plan-schedule"
                                prompt="W12-W13 執行時程"
                                defaultTemplate={'W12 前半週：___\nW12 後半週：___\nW13 前半週：___\nW13 後半週：___'}
                                rows={6}
                            />
                            <ThinkRecord
                                dataKey="w11-plan-backup"
                                prompt="應急備案（Plan B）"
                                defaultTemplate={'如果 ___（問題）發生 → 我會 ___（應變）\n例：如果問卷回收率太低（<60%）→ 我會延長時程一週 + 改由課堂發放'}
                                rows={5}
                            />
                            <ThinkRecord
                                dataKey="w11-launch"
                                prompt="施測啟動宣告（寫一句話，告訴未來的自己這個研究值得做）"
                                placeholder="例：我要幫高一學生搞清楚「睡眠與專注力」的真實關係，讓他們有資料可以反駁「多睡就能變好」的直覺。"
                                rows={3}
                            />
                        </div>
                    </div>

                    {/* AIRED 敘事 */}
                    <div>
                        <h4 className="font-serif text-[18px] md:text-[20px] font-bold text-[var(--ink)] mb-2">
                            W11 AIRED 敘事（本週最重要的 AI 互動）
                        </h4>
                        <p className="text-[13px] text-[var(--ink-mid)] leading-relaxed mb-4">
                            本週主要的 AI 互動是<strong className="text-[var(--ink)]">知情同意書 AI 審查</strong>。用 AIRED 五要素記錄。
                        </p>
                        <AIREDNarrative
                            week="11"
                            hint="本週主要 AI 互動：知情同意書 AI 審查"
                            optional={false}
                        />
                    </div>

                    {/* ExportButton */}
                    <ExportButton
                        weekLabel="W11 Pilot Test + 倫理審查 + 施測啟動"
                        fields={EXPORT_FIELDS}
                    />

                    {/* W12 預告 */}
                    <div className="bg-[var(--ink)] border-l-4 border-[var(--accent)] p-5 md:p-6 rounded-r-lg text-white shadow-xl">
                        <div className="flex items-center gap-2 mb-3">
                            <Plane size={20} className="text-[var(--accent)]" />
                            <span className="font-mono text-[11px] font-bold tracking-[0.2em] text-[var(--accent)] uppercase">W12 預告 · 正式施測</span>
                        </div>
                        <div className="font-bold text-[17px] md:text-[18px] mb-3 leading-tight">
                            下週開始正式資料蒐集
                        </div>
                        <p className="text-[13px] text-white/85 leading-[1.9] mb-3">
                            W12 第一節：施測前檢核 + 開始發送工具。<br />
                            W12 第二節：初步資料回饋 + 調整策略。
                        </p>
                        <ul className="text-[12.5px] text-white/85 leading-[1.95] space-y-1 mb-4 pl-4">
                            <li>・把工具實體化（問卷轉 Google Form、訪綱印出、觀察表印出）</li>
                            <li>・聯絡實際受訪者／受測者／觀察場域</li>
                            <li>・帶著上面的執行時程與備案來上課</li>
                        </ul>
                        <p className="text-[12.5px] text-white/70 leading-[1.9] font-mono">
                            課後任務：準備工具實體 + 聯絡施測對象
                        </p>
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
                    <span className="hidden md:inline">研究方法與專題 / 資料蒐集 / </span><span className="text-[var(--ink)] font-bold">倫理審查 W11</span>
                </div>
                <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
                    <span className="bg-[var(--paper-warm)] text-[var(--ink)] text-[10px] font-bold px-2 py-0.5 rounded-[2px] font-mono">100 MINS</span>
                    <ResetWeekButton weekPrefix="w11-" />
                    <span className="hidden md:inline-block bg-[var(--ink)] text-white text-[10px] font-bold px-2 py-0.5 rounded-[2px] font-mono">AI-RED · E</span>
                </div>
            </div>

            {/* PAGE HEADER — Hero Block */}
            <HeroBlock
                kicker="R.I.B. 調查檔案 · 研究方法與專題 · W11"
                title="Pilot Test · "
                accentTitle="倫理審查 · 施測啟動"
                subtitle="設計階段的最後一關：真人預試抓工具毛病、倫理審查守底線、正式啟動施測。AI 已幫你檢核過結構，這週讓真人幫你找 AI 看不到的問題。"
                meta={[
                    { label: '第一節', value: '讀 W10 回饋 + Pilot Test 配對 + 實戰紀錄' },
                    { label: '第二節', value: '工具第二輪修正 + 倫理四問 + 知情同意書 AI 審 + 教師審查 + 施測啟動' },
                    { label: '課堂產出', value: 'Pilot 發現 + 工具定版 + 倫理審查通過 + 施測計畫' },
                    { label: '前置要求', value: 'W10 計畫書已定稿（全本 13 章含工具）' },
                ]}
            />
            <CourseArc items={[
                    { wk: 'W1-W4', name: '探索\n定題', status: 'past' },
                    { wk: 'W5-W6', name: '文獻搜尋\n引用寫作', status: 'past' },
                    { wk: 'W7-W8', name: '方法選擇\n組隊企劃', status: 'past' },
                    { wk: 'W9-W10', name: '工具設計\nAI精進預試', status: 'past' },
                    { wk: 'W11', name: '倫理審查\n施測啟動', status: 'now' },
                    { wk: 'W12-W13', name: '執行研究\n蒐集資料', status: '' },
                    { wk: 'W14-W17', name: '分析報告\n發表', status: '' },
                ]} />

            {/* STEP ENGINE */}
            <StepEngine
                steps={steps}
                prevWeek={{ label: '回 W10 工具精進', to: '/w10' }}
                nextWeek={{ label: '前往 W12 研究執行', to: '/w12' }}
            flat
            />
        </div>
    );
};
