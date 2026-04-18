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

/* — 備案 AI 審查 Prompt — */
const BACKUP_PROMPT = `這是我的研究備案：【貼上你的備案內容】

請判斷：這個備案夠具體嗎？
有沒有明確的「人」、「地點」、「時間」、「行動」？
如果不夠具體，幫我改得更具體。`;

/* — ExportButton 欄位 — */
const EXPORT_FIELDS = [
    /* Step 1 */
    { key: 'w11-evolution', label: '預試進化論', question: '經過 W10 的 AI 檢核與人工預試，最大的改變是什麼？' },
    { key: 'w11-peer-final', label: '同儕最終確認', question: '同學以受訪者角色看完後的回饋' },
    /* Step 2 */
    { key: 'w11-ethics-consent', label: '倫理：知情同意' },
    { key: 'w11-ethics-privacy', label: '倫理：保密性' },
    { key: 'w11-ethics-harm', label: '倫理：不傷害' },
    { key: 'w11-ethics-voluntary', label: '倫理：自願性' },
    { key: 'w11-data-plan', label: '資料保護計畫' },
    /* Step 3 */
    { key: 'w11-consent-ai', label: 'AI 知情同意書審查回饋' },
    { key: 'w11-consent-judge', label: 'AI 建議判斷' },
    { key: 'w11-consent-final', label: '知情同意書最終版' },
    /* Step 4 */
    { key: 'w11-plan-target', label: '目標與底線' },
    { key: 'w11-plan-schedule', label: '執行時程' },
    { key: 'w11-plan-backup', label: '應急備案' },
    /* Step 5 */
    { key: 'w11-launch', label: '施測啟動宣告' },
    { key: 'w11-aired-record', label: 'AI-RED 敘事紀錄', question: '本週最重要的一次 AI 互動（A-I-R-E-D 五要素）' },
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
        /* ─── Step 1：工具定稿確認 ─── */
        {
            title: '工具定稿確認',
            icon: '📋',
            content: (
                <div className="space-y-8 prose-zh">
                    <p className="text-[14px] text-[var(--ink-mid)] leading-relaxed max-w-[720px]">
                        W9 設計工具、W10 用 AI 和真人雙重把關。今天是準備<strong className="text-[var(--ink)]">「出門」的最後一天</strong>——工具帶好了嗎？知情同意書準備好了嗎？知道誰要去找誰、什麼時候要回來嗎？
                    </p>

                    {/* 帶入 */}
                    {(w9Topic || w9Method) && (
                        <div className="flex items-start gap-3 px-4 py-3 rounded-[var(--radius-unified)] bg-[var(--accent-light)] border border-[var(--accent)] text-[13px]">
                            <span className="text-[16px]">📎</span>
                            <div>
                                <span className="font-bold text-[var(--accent)]">研究檔案帶入</span>
                                {w9Topic && <p className="text-[var(--ink-mid)] mt-0.5">研究題目：{w9Topic}</p>}
                                {w9Method && <p className="text-[var(--ink-mid)] mt-0.5">選用方法：{w9Method}</p>}
                            </div>
                        </div>
                    )}

                    {/* 自查清單 */}
                    <div>
                        <div className="text-[11px] font-mono text-[var(--ink-light)] uppercase tracking-wider mb-3">工具定稿必備元素（缺一不可）</div>
                        <InteractiveChecklist />
                    </div>

                    {/* 預試進化論 */}
                    <ThinkRecord
                        dataKey="w11-evolution"
                        prompt="預試進化論：經過 W10 的 AI 檢核與人工預試，你這份「最終定稿」做了最大的一個改變是什麼？"
                        placeholder="我們最大的改變是___，因為 AI 建議／預試時發現___"
                        scaffold={['最大的改變是___', '因為___', '改完之後___']}
                        rows={4}
                    />

                    {/* 同儕最終確認 */}
                    <div className="bg-[var(--paper-warm)] border border-[var(--border)] rounded-[var(--radius-unified)] p-5">
                        <div className="flex items-center gap-2 mb-3">
                            <Users size={16} className="text-[var(--ink)]" />
                            <span className="font-bold text-[13px] text-[var(--ink)]">同儕最終確認（5 分鐘）</span>
                        </div>
                        <p className="text-[13px] text-[var(--ink-mid)] leading-relaxed mb-4">
                            跟旁邊<strong>不同組</strong>的同學交換看。扮演受訪者角色：你知道這研究在做什麼嗎？有沒有哪題看不懂？有沒有哪題讓你感到不舒服？
                        </p>
                    </div>

                    <ThinkRecord
                        dataKey="w11-peer-final"
                        prompt="同學以受訪者角色看完後，給了什麼回饋？"
                        placeholder="同學說他看不懂第___題……&#10;同學覺得___讓他不太舒服……&#10;同學建議___"
                        rows={4}
                    />
                </div>
            ),
        },

        /* ─── Step 2：倫理四問自查 ─── */
        {
            title: '倫理四問自查',
            icon: '⚖️',
            content: (
                <div className="space-y-8 prose-zh">
                    <p className="text-[14px] text-[var(--ink-mid)] leading-relaxed max-w-[720px]">
                        不是背定義，是<strong className="text-[var(--ink)]">真的問你自己的研究</strong>。每一題都要針對你自己的工具回答。
                    </p>

                    {/* 四問卡片 + ThinkRecord */}
                    <div className="w11-ethics-grid">
                        {ETHICS_QUESTIONS.map((eq) => (
                            <div key={eq.id} className="w11-ethics-card">
                                <div className="w11-ethics-header" style={{ background: eq.color + '10', color: eq.color }}>
                                    <span className="text-[18px]">{eq.icon}</span>
                                    <span>❰{eq.title}❱</span>
                                </div>
                                <div className="w11-ethics-body">
                                    <div className="w11-ethics-question">{eq.question}</div>
                                    <div className="text-[11px] text-[var(--ink-light)] mb-3 leading-relaxed">💡 {eq.hint}</div>
                                    <ThinkRecord
                                        dataKey={`w11-ethics-${eq.id}`}
                                        prompt=""
                                        placeholder="針對你自己的研究回答……"
                                        rows={3}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* 資料保護計畫 */}
                    <ThinkRecord
                        dataKey="w11-data-plan"
                        prompt="資料保護計畫：蒐集完畢後，資料怎麼處理？"
                        placeholder="資料儲存方式：□ 僅本人可看的雲端 □ 組員共用文件 □ 紙本&#10;誰可以接觸：□ 只有研究者 □ 加上指導老師&#10;何時刪除：□ 報告繳交後 □ 本學年結束後"
                        rows={3}
                    />

                    {/* 蓋章提示 */}
                    <div className="w11-stamp-banner">
                        <span className="w11-stamp-icon">🔖</span>
                        <div>
                            <strong className="text-[14px] text-[var(--success)]">教師審查蓋章</strong>
                            <p className="text-[13px] text-[var(--ink-mid)] mt-1">
                                老師會在第二節課帶著印章走動，問你：「你們最大的倫理風險是什麼？你怎麼防？」答得出來就蓋章！沒蓋到章不能出發施測。
                            </p>
                        </div>
                    </div>
                </div>
            ),
        },

        /* ─── Step 3：AI 知情同意書審查 ─── */
        {
            title: 'AI 知情同意書審查',
            icon: '🤖',
            content: (
                <div className="space-y-8 prose-zh">
                    <p className="text-[14px] text-[var(--ink-mid)] leading-relaxed max-w-[720px]">
                        很多知情同意書寫得很官方，受訪者根本讀不懂。用 AI 幫你找出<strong className="text-[var(--ink)]">語言盲點</strong>——讓 16-18 歲的高中生也能完全理解。
                    </p>

                    {/* Prompt */}
                    <CopyablePrompt text={CONSENT_PROMPT} label="倫理審查 Prompt — 複製後貼到 AI 對話窗" />

                    {/* AI 回覆 */}
                    <ThinkRecord
                        dataKey="w11-consent-ai"
                        prompt="Step 1：把 AI 的審查回覆貼在這裡"
                        placeholder="複製 AI 的完整回覆……"
                        rows={8}
                    />

                    {/* 判斷 */}
                    <ThinkRecord
                        dataKey="w11-consent-judge"
                        prompt="Step 2：判斷 AI 的建議（採納／不採納／部分採納）"
                        placeholder={`建議 1：AI 說___\n→ 判斷：✅採納 / ❌不採納 / 🔶部分採納\n→ 理由：\n\n建議 2：\n→ 判斷：\n→ 理由：`}
                        scaffold={[
                            '建議___：AI 說___',
                            '→ 判斷：✅ / ❌ / 🔶',
                            '→ 理由：___',
                        ]}
                        rows={8}
                    />

                    {/* 最終版 */}
                    <ThinkRecord
                        dataKey="w11-consent-final"
                        prompt="Step 3：知情同意書最終版（把你修改後的版本貼在這裡）"
                        placeholder="本問卷（訪談）用於研究___，由松山高中___年___班學生進行。&#10;填答約需___分鐘，所有資料匿名處理，僅用於本研究。&#10;參與完全自願，您隨時可以停止填答，不會影響任何權益。&#10;&#10;□ 我已閱讀以上說明，同意參與本研究。"
                        rows={6}
                    />
                </div>
            ),
        },

        /* ─── Step 4：研究執行計畫書 ─── */
        {
            title: '研究執行計畫書',
            icon: '🗺️',
            content: (
                <div className="space-y-8 prose-zh">
                    <p className="text-[14px] text-[var(--ink-mid)] leading-relaxed max-w-[720px]">
                        有了工具還不夠，還要知道：<strong className="text-[var(--ink)]">誰去找誰？什麼時候做完？萬一遇到困難怎麼辦？</strong>越具體越好。
                    </p>

                    {/* 目標 */}
                    <ThinkRecord
                        dataKey="w11-plan-target"
                        prompt="目標與底線：你打算蒐集多少？萬一不夠怎麼辦？"
                        placeholder="理想目標：___份問卷 / ___位受訪者 / ___次觀察 / ___篇文獻&#10;最低底線：___份 / ___位（萬一回收率低的保底數字）"
                        scaffold={['理想目標：___', '最低底線：___', '差距的話我打算___']}
                        rows={4}
                    />

                    {/* 時程 */}
                    <ThinkRecord
                        dataKey="w11-plan-schedule"
                        prompt="詳細執行時程：W12-W13 你每天具體要做什麼？"
                        placeholder="W12 第一天：___（負責人：___）&#10;W12 第二天：___&#10;W12 第三天：___&#10;W13 第一天：___&#10;W13 最後一天：所有資料收齊！"
                        scaffold={['W12 第__天：做___', '負責人：___', 'W13 最後一天：資料收齊']}
                        rows={8}
                    />

                    {/* 備案 */}
                    <div className="flex items-start gap-3 px-4 py-3 rounded-[var(--radius-unified)] bg-[#FEF2F2] border border-[var(--danger)]/20 text-[13px]">
                        <span className="text-[16px]">⚠️</span>
                        <div>
                            <span className="font-bold text-[var(--danger)]">備案不能只寫「多找幾個人」！</span>
                            <p className="text-[var(--ink-mid)] mt-1">
                                必須寫出具體的<strong>人、地點、時間、行動</strong>。
                            </p>
                            <p className="text-[var(--ink-mid)] mt-1">
                                ❌ 爛備案：多傳給幾個人看看。<br />
                                ✅ 好備案：印 30 份紙本，由○○在禮拜三午休去高一 A 班現場發放；同時請李○○轉發到社團群組。
                            </p>
                        </div>
                    </div>

                    <ThinkRecord
                        dataKey="w11-plan-backup"
                        prompt="應急備案：如果遇到困難，你的具體行動是什麼？（人、地、時、事）"
                        placeholder="困難 1：回收率不足 → 備案：由___在___（時間）去___（地點）做___&#10;困難 2：受訪者取消 → 備案：___&#10;困難 3：___"
                        scaffold={['困難___：___', '備案：由___在___去___做___']}
                        rows={6}
                    />

                    {/* AI 備案審查 */}
                    <CopyablePrompt text={BACKUP_PROMPT} label="備案具體性審查 — 讓 AI 幫你檢查備案夠不夠具體" />
                </div>
            ),
        },

        /* ─── Step 5：回顧與繳交 ─── */
        {
            title: '回顧與繳交',
            icon: '🛫',
            content: (
                <div className="space-y-8 prose-zh">
                    {/* 施測啟動宣告 */}
                    <div className="w11-launch-card">
                        <Plane size={32} className="mx-auto mb-4 text-[var(--gold)]" />
                        <h3 className="text-[20px] font-bold mb-2">施測啟動宣告</h3>
                        <p className="text-[rgba(255,255,255,0.6)] text-[13px] mb-6">
                            填完之後，大聲念給你的夥伴聽——然後去黑板的「研究航班出發表」打卡起飛！
                        </p>
                    </div>

                    <ThinkRecord
                        dataKey="w11-launch"
                        prompt="我的施測啟動宣告"
                        placeholder="我的研究題目是：___&#10;在接下來的 W12-W13，我打算：___&#10;我的目標是蒐集：___&#10;我預計遇到最大的挑戰是：___&#10;我的備案是：___"
                        scaffold={[
                            '我的研究題目是：___',
                            '接下來兩週我打算：___',
                            '我的目標是蒐集：___',
                            '最大的挑戰：___',
                            '我的備案：___',
                        ]}
                        rows={8}
                    />

                    {/* AIRED 敘事版 · 本週 AI 互動總結 */}
                    <AIREDNarrative week="11" hint="這週你用 AI 審查知情同意書或備案具體性" />

                    {/* 檢核清單 */}
                    <div className="bg-white border border-[var(--border)] rounded-[var(--radius-unified)] overflow-hidden">
                        <div className="p-4 px-5 bg-[var(--paper-warm)] border-b border-[var(--border)] font-bold text-[13px]">
                            ✅ W11 完成後，請確認
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-[1px] bg-[var(--border)]">
                            {[
                                '工具定稿自查完成，同儕確認完成',
                                '倫理四問自查完成，取得教師蓋章',
                                'AI 審查知情同意書完成',
                                '研究執行計畫書完成（時程 + 備案）',
                                '施測啟動宣告已念給夥伴聽',
                                '在黑板航班表上打卡起飛',
                            ].map((item, i) => (
                                <div key={i} className="p-4 px-6 bg-white flex items-start gap-3">
                                    <CheckCircle2 size={16} className="text-[var(--success)] mt-0.5 flex-shrink-0" />
                                    <span className="text-[13px] text-[var(--ink-mid)]">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 一鍵複製 */}
                    <ExportButton
                        weekLabel="W11 工具定案 · 倫理審查 · 施測啟動"
                        fields={EXPORT_FIELDS}
                    />

                    {/* 連貫劇情解鎖通知（不穿插；僅告知） */}
                    <div className="border border-indigo-500/40 bg-indigo-500/5 rounded-lg p-4 flex items-start gap-3">
                        <Unlock size={18} className="text-indigo-500 flex-shrink-0 mt-0.5" />
                        <div className="text-[13px] text-[var(--ink-mid)] leading-[1.7]">
                            <span className="font-bold text-[var(--ink)] flex items-center gap-1.5 mb-1">
                                <Radio size={14} className="text-indigo-500" /> R.I.B. 連貫劇情解鎖：《回聲》Ch1-5
                            </span>
                            完成倫理審查訓練後，你已具備判斷「該不該做」的能力。
                            請從左側側邊欄 <strong>🎮 R.I.B. 調查檔案 → 回聲</strong> 進入挑戰。本系列倫理強度較高，需要你細心權衡。
                        </div>
                    </div>

                    {/* 下週預告 */}
                    <div className="next-week-preview">
                        <div className="next-week-header">
                            <span className="next-week-badge">NEXT WEEK</span>
                            <h3 className="next-week-title">W12-W13 預告：執行週！全力蒐集資料</h3>
                        </div>
                        <div className="next-week-content">
                            <div className="next-week-col">
                                <div className="next-week-label">課堂模式</div>
                                <p className="next-week-text">研究診所 Open Office——老師個別指導，你全力蒐集資料</p>
                            </div>
                            <div className="next-week-col">
                                <div className="next-week-label">注意</div>
                                <p className="next-week-text">W13 會有 3 分鐘快速中期報告。每週填寫研究日誌（做了什麼？遇到什麼？怎麼解決？）</p>
                            </div>
                        </div>
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
                title="工具定案 · "
                accentTitle="倫理審查 · 施測啟動"
                subtitle="整個「設計階段」的總結，也是「執行階段」的正式開門。今天做三件事：繳交工具定稿、通過倫理審查、正式宣告開始施測。"
                meta={[
                    { label: '第一節', value: '工具定稿 + 倫理四問自查 + 知情同意書審查' },
                    { label: '第二節', value: '研究執行計畫書 + 教師蓋章 + 施測啟動' },
                    { label: '課堂產出', value: '工具定稿 + 倫理審查表 + 執行計畫書' },
                    { label: '前置要求', value: 'W10 修正完畢的工具' },
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
