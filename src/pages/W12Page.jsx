import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import CourseArc from '../components/ui/CourseArc';
import HeroBlock from '../components/ui/HeroBlock';
import './W12.css';
import ThinkRecord from '../components/ui/ThinkRecord';
import AIREDNarrative from '../components/ui/AIREDNarrative';
import ExportButton from '../components/ui/ExportButton';
import { readRecords } from '../components/ui/ThinkRecord';
import {
    ArrowRight,
    ArrowLeft,
    Bot,
    Copy,
    Check,
    AlertTriangle,
} from 'lucide-react';

/* ══════════════════════════════════════
 *  資料常數
 * ══════════════════════════════════════ */

/* — 三色掛號說明 — */
const TRIAGE_ZONES = [
    { icon: '🔴', label: '急診區', desc: '卡關，完全做不下去', className: 'w12-triage-red' },
    { icon: '🟡', label: '門診區', desc: '有問題，但還能繼續做', className: 'w12-triage-yellow' },
    { icon: '🟢', label: '健康區', desc: '順利推進中', className: 'w12-triage-green' },
];

/* — 各方法組常見困難速查 — */
const TROUBLE_CARDS = [
    {
        method: '📋 問卷組',
        issues: [
            { q: '回收率很低', a: '不要只丟連結！先傳訊息問「可以幫我嗎？」，等回覆 OK 再貼連結。用 AI 寫邀請話術。' },
            { q: '品質差（全勾同選項）', a: '這叫「應付作答」，標記出來，分析時說明比例與處理方式，這是正常的研究限制。' },
            { q: '找不到受訪者', a: '用 AI 當話術教練！請 AI 幫你寫 2 種不同語氣的 LINE 邀請訊息。' },
        ],
    },
    {
        method: '🎤 訪談組',
        issues: [
            { q: '受訪者話很少', a: '你問了封閉式問題！改成開放式：「可以舉個例子嗎？」讓對方說故事，不是說答案。' },
            { q: '錄音品質很差', a: '選安靜場地！用 AI 轉錄工具（NotebookLM / Whisper）輔助，放慢播放速度仔細聽。' },
            { q: '受訪者臨時爽約', a: '同時聯絡備用受訪者，不要只等一個人。啟動 W11 的備案！' },
        ],
    },
    {
        method: '🧪 實驗組',
        issues: [
            { q: '實驗組與對照組人數差很多', a: '繼續招募人數少的那組。如果真的找不到，在分析時說明樣本數不均等是研究限制。' },
            { q: '變因沒控制好', a: '如果還來得及就重做（同一時段）。來不及就在報告中誠實說明這個限制。' },
        ],
    },
    {
        method: '👀 觀察組',
        issues: [
            { q: '觀察時對方行為改變', a: '這叫「觀察者效應」！先讓他們習慣你的存在，或用不明顯的記錄方式。' },
            { q: '紀錄表填得一團亂', a: '操作性定義不夠清楚！把模糊的分類改成具體行為（如：低頭看手機超過 5 秒）。' },
        ],
    },
    {
        method: '📚 文獻組',
        issues: [
            { q: '讀不懂論文', a: '先看摘要→結論→引言→結果→圖表。不要從頭到尾硬讀，先判斷值不值得深讀。' },
            { q: '找不到相關文獻', a: '用 AI 翻譯英文關鍵字！請 AI 建議 Google Scholar 搜尋組合。' },
        ],
    },
];

/* — 等待急救包 — */
const RESCUE_TASKS = [
    { icon: '📝', title: '預寫第三章', desc: '把你這週如何找受訪者、發了幾份、怎麼做實驗的過程，用文字打成草稿。這就是期末報告「研究方法」章節！' },
    { icon: '📚', title: '整理文獻格式', desc: '把 W6 找的文獻按 APA 格式整理成參考文獻清單，報告末尾直接貼上。' },
    { icon: '🧹', title: '資料清洗預習', desc: '打開 Google 表單後台，檢查已回收的問卷，辨認並標記「一直線亂填」的無效問卷。' },
];

/* — AI Prompts — */
const TALK_PROMPT = `我要邀請一位 [對象：例如輔導老師/同學/學弟妹] 進行 [時間：例如 15 分鐘] 的學術訪談（或填寫問卷），
我是高中生，請幫我寫一封 LINE 邀請訊息，
語氣要有禮貌、真誠，說明研究目的與所需時間，不要給對方壓力，
請給我 2 種不同語氣的版本。`;

const KEYWORD_PROMPT = `我的研究題目是「＿＿＿」，
請幫我：
1. 翻譯成英文關鍵字（至少 3 組不同組合）
2. 建議我用 Google Scholar 搜尋哪些組合
3. 如果有相關的英文專有名詞，也請列出`;

const PROGRESS_REVIEW_PROMPT = `我是高中生，正在做一個研究專題。以下是我目前的進度：

【研究題目】＿＿＿
【研究方法】＿＿＿（問卷 / 訪談 / 實驗 / 觀察 / 文獻）
【目前蒐集狀態】已完成 ＿＿＿，目標是 ＿＿＿
【剩餘時間】還有大約 1 週可以蒐集資料
【遇到的困難】＿＿＿

請幫我：
1. 判斷我目前的進度是否合理（來得及 / 有風險 / 很危險）
2. 如果有風險，具體建議我怎麼加速
3. 如果我的困難有解法，給我 2-3 個可行的選項
4. 提醒我有沒有什麼容易忽略的事`;

const DIARY_REVIEW_PROMPT = `以下是我這週的三條研究日誌：

【關鍵行動 1】＿＿＿
【關鍵行動 2】＿＿＿
【關鍵行動 3】＿＿＿

請幫我檢查：
1. 每條紀錄有沒有寫到「做了什麼 + 結果/困難 + 下一步」？
2. 有沒有太模糊的地方需要補充細節？
3. 我的「下一步」是否夠具體、可執行？
4. 整體來看，我這週的研究推進方向有沒有問題？`;

/* — ExportButton 欄位（只剩日誌部分） — */
const EXPORT_FIELDS = [
    { key: 'w12-diary-1', label: '關鍵行動 1' },
    { key: 'w12-diary-2', label: '關鍵行動 2' },
    { key: 'w12-diary-3', label: '關鍵行動 3' },
    { key: 'w12-midterm-status', label: 'W13 中期報告：現況' },
    { key: 'w12-midterm-gap', label: 'W13 中期報告：缺口' },
    { key: 'w12-midterm-plan', label: 'W13 中期報告：計畫' },
    { key: 'w12-aired-record', label: 'AI-RED 敘事紀錄', question: '本週最重要的一次 AI 互動（A-I-R-E-D 五要素）' },
];

/* ══════════════════════════════════════
 *  內部元件
 * ══════════════════════════════════════ */

/* 可複製 Prompt 框 */
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
            <pre style={{ padding: 16, margin: 0, fontSize: 13, lineHeight: 1.7, color: '#e2e8f0', fontFamily: 'var(--font-mono)', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{text}</pre>
        </div>
    );
};

/* 困難速查卡（可展開） */
const TroubleCard = ({ card }) => {
    const [open, setOpen] = useState(false);
    return (
        <div className="w12-trouble-card">
            <div className="w12-trouble-header" style={{ cursor: 'pointer' }} onClick={() => setOpen(!open)}>
                <span>{card.method}</span>
                <span style={{ marginLeft: 'auto', fontSize: 12, opacity: 0.5 }}>{open ? '收起 ▲' : '展開 ▼'}</span>
            </div>
            {open && (
                <div className="w12-trouble-body">
                    {card.issues.map((issue, i) => (
                        <div key={i} className={i > 0 ? 'mt-3 pt-3 border-t border-[var(--border)]' : ''}>
                            <p className="text-[12px] font-bold text-[var(--ink)] mb-1">❓ {issue.q}</p>
                            <p className="text-[12px] text-[var(--ink-mid)] leading-relaxed">💡 {issue.a}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

/* ══════════════════════════════════════
 *  主頁面：工具面板 + 底部日誌
 * ══════════════════════════════════════ */

const W12Page = () => {
    const saved = readRecords();
    const myMethod = saved['w9-my-method'] || saved['w8-tool-method'] || '';
    const myTopic = saved['w8-merged-topic'] || saved['w8-research-question'] || '';

    return (
        <div className="page-container animate-in-fade-slide">
            {/* TOP BAR */}
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-4 mb-8 md:mb-12 gap-3">
                <div className="text-[11px] font-mono text-[var(--ink-light)] flex items-center gap-2 min-w-0">
                    <span className="hidden md:inline">研究方法與專題 / 執行蒐集 / </span><span className="text-[var(--ink)] font-bold">研究診所 W12</span>
                </div>
                <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
                    <span className="bg-[var(--paper-warm)] text-[var(--ink)] text-[10px] font-bold px-2 py-0.5 rounded-[2px] font-mono">100 MINS</span>
                    <span className="hidden md:inline-block bg-[var(--ink)] text-white text-[10px] font-bold px-2 py-0.5 rounded-[2px] font-mono">AI-RED · D</span>
                </div>
            </div>

            {/* PAGE HEADER — Hero Block */}
            <HeroBlock
                kicker="R.I.B. 調查檔案 · 研究方法與專題 · W12"
                title="研究診所 Open Office · "
                accentTitle="自由工作時間"
                subtitle="這堂課沒有老師台上講課。整堂課是自由工作時間＋個別診所。核心任務只有一個：把資料蒐集回來。"
                meta={[
                    { label: '第一節', value: '自由工作時間 + 個別診所掛號' },
                    { label: '第二節', value: '研究日誌 + W13 中期報告預備' },
                    { label: '課堂產出', value: '研究日誌 ×3 + 中期報告草稿' },
                    { label: '前置要求', value: 'W11 工具已設計 + 資料蒐集進行中' },
                ]}
            />
            <CourseArc items={[
                    { wk: 'W1-W2', name: '探索階段\nRED公約', past: true },
                    { wk: 'W3-W4', name: '題目診斷\n博覽會', past: true },
                    { wk: 'W5-W7', name: '規劃分流\n企劃定案', past: true },
                    { wk: 'W8-W10', name: '工具設計\n倫理審查', past: true },
                    { wk: 'W11-W12', name: '執行階段\n自主研究', now: true },
                    { wk: 'W13-W14', name: '數據轉譯\n圖表結論' },
                    { wk: 'W15-W16', name: '成果簡報\n博覽發表' },
                ]} />

            {/* ═══ SCROLLING CONTENT ═══ */}
            <div className="mx-auto" style={{ maxWidth: 720 }}>

            <div className="p-5 rounded-[var(--radius-unified)] border border-[var(--border)] bg-[var(--paper-warm)]">
                <p className="text-[16px] font-bold text-[var(--ink)] mb-2">🏥 今天的教室是「研究診所」</p>
                <p className="text-[13px] text-[var(--ink-mid)] leading-relaxed">
                    這個頁面是你的工具箱——遇到問題就來翻，不用填寫。最後 10 分鐘再寫研究日誌。
                </p>
            </div>

            {/* 前週資料帶入 */}
            {myTopic && (
                <div className="mt-4 p-4 rounded-[var(--radius-unified)] bg-[#F0F9FF] border border-[#BAE6FD]">
                    <p className="text-[12px] text-[#0369A1] font-bold mb-1">📂 你的研究</p>
                    <p className="text-[13px] text-[#0C4A6E]">{myTopic}</p>
                    {myMethod && <p className="text-[12px] text-[#0369A1] mt-1">方法：{myMethod}</p>}
                </div>
            )}

            {/* ═══ 工具區 ═══ */}

            {/* ── 1. 三色掛號提醒 ── */}
            <h2 className="text-[15px] font-bold text-[var(--ink)] mt-8 mb-3">✈️ 研究診所掛號板</h2>
            <p className="text-[12px] text-[var(--ink-mid)] mb-3">在黑板上把組名貼到對應區域，老師從急診區開始看診。</p>
            <div className="w12-triage-grid">
                {TRIAGE_ZONES.map(z => (
                    <div key={z.label} className={`w12-triage-card ${z.className}`}>
                        <div className="w12-triage-icon">{z.icon}</div>
                        <div className="w12-triage-label">{z.label}</div>
                        <div className="w12-triage-desc">{z.desc}</div>
                    </div>
                ))}
            </div>

            {/* 求助三招 */}
            <div className="mt-4 p-4 rounded-[var(--radius-unified)] border border-[var(--border)]">
                <p className="text-[13px] font-bold text-[var(--ink)] mb-2">遇到困難的三個辦法</p>
                <div className="text-[12px] text-[var(--ink-mid)] leading-relaxed flex flex-col gap-1">
                    <span>🤖 <strong>先問 AI</strong>，讓 AI 給你 3 個選項</span>
                    <span>🧑‍🤝‍🧑 <strong>問旁邊同學</strong>，看看有沒有一樣的狀況</span>
                    <span>🙋 <strong>黑板掛號</strong>，老師會來找你</span>
                </div>
            </div>

            {/* ── 2. 困難速查卡 ── */}
            <h2 className="text-[15px] font-bold text-[var(--ink)] mt-8 mb-3">🩺 困難速查卡</h2>
            <p className="text-[12px] text-[var(--ink-mid)] mb-3">不知道怎麼處理？找到你的方法，看看常見解法。</p>
            <div className="w12-trouble-grid">
                {TROUBLE_CARDS.map((card, ci) => (
                    <TroubleCard key={ci} card={card} />
                ))}
            </div>

            {/* ── 3. AI 工具箱 ── */}
            <h2 className="text-[15px] font-bold text-[var(--ink)] mt-8 mb-3">🤖 AI 工具箱</h2>
            <p className="text-[12px] text-[var(--ink-mid)] mb-4">複製 Prompt，貼到 AI 對話窗，把 ＿＿＿ 的部分換成你的內容。</p>

            <div className="flex flex-col gap-5">
                <div>
                    <p className="text-[13px] font-bold text-[var(--ink)] mb-2">📊 AI 進度健檢</p>
                    <p className="text-[12px] text-[var(--ink-mid)] mb-2">把你目前的蒐集狀態貼進去，AI 幫你判斷進度風險並給加速建議。</p>
                    <CopyablePrompt text={PROGRESS_REVIEW_PROMPT} label="AI 進度健檢 Prompt" />
                </div>

                <div>
                    <p className="text-[13px] font-bold text-[var(--ink)] mb-2">💬 不敢開口？AI 話術教練</p>
                    <p className="text-[12px] text-[var(--ink-mid)] mb-2">不知道怎麼邀請受訪者？AI 幫你寫邀請訊息。</p>
                    <CopyablePrompt text={TALK_PROMPT} label="AI 話術教練 Prompt" />
                </div>

                <div>
                    <p className="text-[13px] font-bold text-[var(--ink)] mb-2">🔍 找不到文獻？AI 關鍵字翻譯</p>
                    <p className="text-[12px] text-[var(--ink-mid)] mb-2">中文搜尋結果太少？讓 AI 產生英文關鍵字組合。</p>
                    <CopyablePrompt text={KEYWORD_PROMPT} label="AI 英文關鍵字 Prompt" />
                </div>

                <div>
                    <p className="text-[13px] font-bold text-[var(--ink)] mb-2">📖 AI 日誌審查</p>
                    <p className="text-[12px] text-[var(--ink-mid)] mb-2">寫完研究日誌後，貼給 AI 檢查有沒有太模糊、漏掉細節的地方。</p>
                    <CopyablePrompt text={DIARY_REVIEW_PROMPT} label="AI 日誌審查 Prompt" />
                </div>
            </div>

            {/* AI 限制提醒 */}
            <div className="mt-4 p-4 rounded-[var(--radius-unified)] border border-[#FCD34D] bg-[#FFFBEB]">
                <p className="text-[12px] text-[#92400E] flex items-center gap-2 mb-1">
                    <AlertTriangle size={14} /> <strong>AI 的限制提醒</strong>
                </p>
                <div className="text-[12px] text-[#78350F] leading-relaxed flex flex-col gap-1">
                    <span>• AI 只能處理文字，看不到你的表情、語氣、現場氛圍</span>
                    <span>• AI 不了解你的學校文化和同學關係</span>
                    <span>• AI 無法幫你做可行性測試——只有真人能告訴你工具好不好用</span>
                </div>
            </div>

            {/* ── 4. 等待急救包 ── */}
            <h2 className="text-[15px] font-bold text-[var(--ink)] mt-8 mb-3">📦 等待急救包</h2>
            <p className="text-[12px] text-[var(--ink-mid)] mb-3">正在等資料回收？做這三件事讓等待時間有意義：</p>
            <div className="w12-rescue-grid">
                {RESCUE_TASKS.map((task, i) => (
                    <div key={i} className="w12-rescue-card">
                        <span className="text-[20px]">{task.icon}</span>
                        <span className="text-[13px] font-bold text-[var(--ink)]">{task.title}</span>
                        <span className="text-[11px] text-[var(--ink-mid)] leading-relaxed">{task.desc}</span>
                    </div>
                ))}
            </div>

            {/* ═══ 分隔線：下方為繳交區 ═══ */}
            <div className="mt-10 mb-6 flex items-center gap-3">
                <div className="flex-1 h-px bg-[var(--border)]" />
                <span className="text-[13px] font-bold text-[var(--ink-mid)]">✏️ 最後 10 分鐘：研究日誌</span>
                <div className="flex-1 h-px bg-[var(--border)]" />
            </div>

            <p className="text-[12px] text-[var(--ink-mid)] mb-4 leading-relaxed">
                記錄本週<strong>最重要的 3 個關鍵行動或挫折</strong>。真實發生的事才有反思價值！
                寫完後可以用底部的「AI 日誌審查」Prompt 請 AI 幫你檢查。
            </p>

            {/* ── 研究日誌 ── */}
            <div className="flex flex-col gap-4">
                <ThinkRecord
                    dataKey="w12-diary-1"
                    prompt="🔑 關鍵行動 1：日期、做了什麼、結果/困難、下一步"
                    scaffold={['日期：___月___日', '我做了：...', '結果/困難：...', '下一步：...']}
                />
                <ThinkRecord
                    dataKey="w12-diary-2"
                    prompt="🔑 關鍵行動 2：日期、做了什麼、結果/困難、下一步"
                    scaffold={['日期：___月___日', '我做了：...', '結果/困難：...', '下一步：...']}
                />
                <ThinkRecord
                    dataKey="w12-diary-3"
                    prompt="🔑 關鍵行動 3：日期、做了什麼、結果/困難、下一步"
                    scaffold={['日期：___月___日', '我做了：...', '結果/困難：...', '下一步：...']}
                />
            </div>

            {/* ── W13 中期報告預備 ── */}
            <div className="mt-6 p-5 rounded-[var(--radius-unified)] border-2 border-dashed border-[var(--accent)] bg-[#F0F4FF]">
                <p className="text-[14px] font-bold text-[var(--accent)] mb-1">📢 W13 中期報告預備</p>
                <p className="text-[12px] text-[var(--ink-mid)] mb-4 leading-relaxed">
                    下週 W13 每組要做 <strong>3 分鐘中期報告</strong>，先想好你要說什麼：
                </p>
                <div className="flex flex-col gap-4">
                    <ThinkRecord dataKey="w12-midterm-status" prompt="① 我目前蒐集到了什麼？（現況）" scaffold={['目前我已經...']} />
                    <ThinkRecord dataKey="w12-midterm-gap" prompt="② 我還差什麼？（缺口）" scaffold={['我還需要...']} />
                    <ThinkRecord dataKey="w12-midterm-plan" prompt="③ 我接下來怎麼補？（計畫）" scaffold={['我打算在___之前，用___方式來...']} />
                </div>
            </div>

            {/* 截止提醒 */}
            <div className="mt-4 p-4 rounded-[var(--radius-unified)] border border-[#FCA5A5] bg-[#FEF2F2]">
                <p className="text-[13px] text-[#DC2626] font-bold flex items-center gap-2">
                    <AlertTriangle size={14} /> W13 結束後不能再蒐集資料！W14 開始進入資料分析！
                </p>
            </div>

            {/* ── 匯出 ── */}
            <div className="mt-6">
                                {/* AIRED 敘事紀錄（循序漸進：五欄 → 一段話） */}
                <AIREDNarrative week="12" hint="資料蒐集遇到困難可能問 AI" optional={true} />

                <ExportButton
                    weekLabel="W12 執行週 I：研究診所 Open Office"
                    fields={EXPORT_FIELDS}
                />
            </div>

            {/* ── 底部導航 ── */}
            <div className="mt-8 flex justify-between items-center">
                <Link to="/w11" className="flex items-center gap-1 text-[13px] text-[var(--ink-mid)] no-underline hover:text-[var(--accent)]">
                    <ArrowLeft size={14} /> W11
                </Link>
                <Link to="/w13" className="flex items-center gap-1 text-[13px] text-[var(--ink-mid)] no-underline hover:text-[var(--accent)]">
                    W13 <ArrowRight size={14} />
                </Link>
            </div>

            </div>{/* end scrolling content wrapper */}
        </div>
    );
};

export { W12Page };
export default W12Page;
