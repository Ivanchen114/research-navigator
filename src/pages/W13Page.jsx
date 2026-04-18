import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import CourseArc from '../components/ui/CourseArc';
import './W13.css';
import ThinkRecord from '../components/ui/ThinkRecord';
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

/* — 關帳入場券標準 — */
const TICKET_STANDARDS = [
    { icon: '📋', method: '問卷', requirement: '下載成 Excel，並刪除一直線亂填的無效問卷' },
    { icon: '🎤', method: '訪談', requirement: '錄音必須轉成逐字稿文字檔（可用雅婷 / Whisper / NotebookLM 免費轉）' },
    { icon: '🧪', method: '實驗', requirement: '手寫數據全部打字建成 Excel 表格' },
    { icon: '👀', method: '觀察', requirement: '手寫紀錄全部打字建成 Word/Excel，並統計各類行為頻率' },
    { icon: '📚', method: '文獻', requirement: '每篇都有摘要表（作者 / 年份 / 主要發現 / 和我研究的關聯）' },
];

/* — 資料品質自查項目 — */
const QUALITY_CHECKS = [
    '問卷：無效問卷（一直線填、全選同一個）已標記或刪除',
    '訪談：錄音已轉成逐字稿（至少初稿）',
    '實驗：數據記錄完整，沒有漏格',
    '觀察：每次紀錄都有日期、時段、地點',
    '文獻：每篇都有摘要表（作者/年份/發現/關聯）',
    '所有原始資料已數位化（打字建檔）',
];

/* — AI 初步探勘 Prompt（健康組用） — */
const EXPLORE_PROMPT = `這是我的研究資料，請扮演資料分析師。
請列出你在這份資料中看到的 3 個「最有趣的趨勢」或「最反常的現象」，並說明理由。

【貼上你的部分資料：前幾份問卷回答 / 訪談逐字稿片段 / 實驗數據】`;

/* — AI 補救策略 Prompt — */
const RESCUE_PROMPT = `我是高中生，正在做研究專題，資料蒐集快截止了但進度落後。

【我的研究方法】＿＿＿（問卷 / 訪談 / 實驗 / 觀察）
【目標數量】＿＿＿
【目前蒐集到】＿＿＿
【剩餘時間】這週結束前必須收齊
【最大困難】＿＿＿

請幫我：
1. 擬一個「每日行動計畫」（從今天到截止日，每天做什麼）
2. 建議 2-3 個加速蒐集的策略
3. 如果真的來不及，怎麼調整目標並誠實記錄在研究限制中`;

/* — ExportButton 欄位 — */
const EXPORT_FIELDS = [
    { key: 'w13-pitch-notes', label: '盤點筆記', question: '聽其他組報告時的筆記與啟發' },
    { key: 'w13-surprise', label: '最意外的發現', question: '蒐集過程中最意外的發現' },
    { key: 'w13-diary-1', label: '關鍵行動 1' },
    { key: 'w13-diary-2', label: '關鍵行動 2' },
    { key: 'w13-diary-3', label: '關鍵行動 3' },
    { key: 'w13-data-status', label: '資料收齊狀況', question: '最終蒐集量、達成率、品質自查' },
    { key: 'w13-w14-question', label: 'W14 帶過去的問題' },
    { key: 'w13-ai-explore', label: 'AI 初步探勘紀錄' },
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

/* 資料品質自查清單 */
const QualityChecklist = () => {
    const [checks, setChecks] = useState(() => {
        try { return JSON.parse(localStorage.getItem('w13-quality-checks') || 'null') || QUALITY_CHECKS.map(() => false); } catch { return QUALITY_CHECKS.map(() => false); }
    });
    const toggle = (i) => {
        const next = checks.map((v, j) => j === i ? !v : v);
        setChecks(next);
        try { localStorage.setItem('w13-quality-checks', JSON.stringify(next)); } catch {}
    };
    const allChecked = checks.every(Boolean);
    /* 只顯示與自己方法相關的項目 — 但因為不確定每個學生的方法，全部顯示讓他們自行勾選適用的 */

    return (
        <div>
            <div className="w13-confirm-grid">
                {QUALITY_CHECKS.map((item, i) => (
                    <div
                        key={i}
                        className={`w13-confirm-item ${checks[i] ? 'checked' : ''}`}
                        onClick={() => toggle(i)}
                    >
                        <div className="w13-confirm-box">
                            {checks[i] && <Check size={14} />}
                        </div>
                        <span>{item}</span>
                    </div>
                ))}
            </div>
            {allChecked && (
                <div className="mt-3 p-3 rounded-[var(--radius-unified)] bg-[#F0FDF4] border border-[var(--success)] text-[13px] text-[var(--success)] font-bold flex items-center gap-2">
                    <Check size={16} /> 全部通過！你準備好進入 W14 資料分析了！
                </div>
            )}
        </div>
    );
};

/* ══════════════════════════════════════
 *  主頁面
 * ══════════════════════════════════════ */

const W13Page = () => {
    const saved = readRecords();
    const myTopic = saved['w8-merged-topic'] || saved['w8-research-question'] || '';
    const myMethod = saved['w9-my-method'] || saved['w8-tool-method'] || '';

    /* 讀取 W12 已準備的中期報告 */
    const midStatus = saved['w12-midterm-status'] || '';
    const midGap = saved['w12-midterm-gap'] || '';
    const midPlan = saved['w12-midterm-plan'] || '';
    const hasMidPrep = midStatus || midGap || midPlan;

    return (
        <div className="page-container animate-in-fade-slide">
            {/* TOP BAR */}
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-4 mb-16">
                <div className="text-[11px] font-mono text-[var(--ink-light)] flex items-center gap-2">
                    研究方法與專題 / 執行蒐集 / <span className="text-[var(--ink)] font-bold">中期盤點 W13</span>
                </div>
                <div className="flex items-center gap-4">
                    <span className="bg-[var(--paper-warm)] text-[var(--ink)] text-[10px] font-bold px-2 py-0.5 rounded-[2px] font-mono">100 MINS</span>
                    <span className="bg-[var(--ink)] text-white text-[10px] font-bold px-2 py-0.5 rounded-[2px] font-mono">AI-RED · D</span>
                </div>
            </div>

            {/* PAGE HEADER */}
            <header className="max-w-[800px] mb-16">
                <div className="text-[11px] font-mono text-[var(--accent)] mb-3 tracking-[0.06em]">📢 W13 · 執行蒐集階段</div>
                <h1 className="font-serif text-[36px] font-bold leading-[1.2] text-[var(--ink)] mb-4 tracking-[-0.02em]">
                    中期盤點與資料收齊 · <span className="text-[var(--accent)] italic">蒐集最後一週</span>
                </h1>
                <p className="text-[15px] text-[var(--ink-mid)] max-w-[600px] leading-[1.75] mb-8">
                    上半場：中期盤點 Pitch 公開進度。下半場：最後衝刺蒐集＋資料關帳清洗。W13 結束後不能再蒐集新資料！
                </p>

                <CourseArc items={[
                    { wk: 'W1-W2', name: '探索階段\nRED公約', past: true },
                    { wk: 'W3-W4', name: '題目診斷\n博覽會', past: true },
                    { wk: 'W5-W7', name: '規劃分流\n企劃定案', past: true },
                    { wk: 'W8-W10', name: '工具設計\n倫理審查', past: true },
                    { wk: 'W11-W13', name: '執行階段\n自主研究', now: true },
                    { wk: 'W14-W15', name: '數據轉譯\n圖表結論' },
                    { wk: 'W16-W17', name: '成果簡報\n博覽發表' },
                ]} />

                <div className="meta-grid">
                    {[
                        { label: '第一節', value: '中期盤點 Pitch（每組 1 分鐘）' },
                        { label: '第二節', value: '最後衝刺蒐集 + 資料關帳清洗' },
                        { label: '課堂產出', value: 'Pitch 報告 + 資料品質自查' },
                        { label: '帶去 W14', value: '清洗好的數位化資料檔案' },
                    ].map((item, idx) => (
                        <div key={idx} className="meta-item">
                            <div className="meta-label">{item.label}</div>
                            <div className="meta-value">{item.value}</div>
                        </div>
                    ))}
                </div>
            </header>

            {/* ═══ SCROLLING CONTENT ═══ */}
            <div className="mx-auto" style={{ maxWidth: 720 }}>

            <div className="p-5 rounded-[var(--radius-unified)] border border-[var(--border)] bg-[var(--paper-warm)]">
                <p className="text-[16px] font-bold text-[var(--ink)] mb-2">📢 資料蒐集最後一週！</p>
                <p className="text-[13px] text-[var(--ink-mid)] leading-relaxed">
                    上半場：每組照模板做 <strong>1 分鐘中期盤點 Pitch</strong>，公開進度、互相施壓。
                    <br />下半場：最後衝刺蒐集 + 資料關帳清洗。
                    <br /><strong>W13 結束後不能再蒐集新資料，W14 開始進入分析！</strong>
                </p>
            </div>

            {/* ═══ 第一節：中期盤點 Pitch ═══ */}
            <h2 className="text-[15px] font-bold text-[var(--ink)] mt-8 mb-3">🎤 中期盤點 Pitch</h2>

            {/* 填空模板 */}
            <div className="w13-pitch-template">
                <div className="w13-pitch-header">
                    📋 電梯簡報模板（照唸填空處，不自由發揮！）
                </div>
                <div className="w13-pitch-body">
                    我們是做
                    <span className="w13-pitch-blank">{myMethod || '___'}</span>
                    法的，
                    <br />目標是
                    <span className="w13-pitch-blank">___</span>
                    ，目前已蒐集到
                    <span className="w13-pitch-blank">___</span>
                    ，達成率約
                    <span className="w13-pitch-blank">___%</span>
                    。
                    <br /><br />
                    我們目前最大的缺口是：
                    <span className="w13-pitch-blank" style={{ minWidth: 200 }}>___</span>
                    。
                    <br /><br />
                    為了在這週結束前收齊，我們接下來的具體行動是：
                    <span className="w13-pitch-blank" style={{ minWidth: 200 }}>___</span>
                    。
                    <br /><br />
                    蒐集過程中最意外的發現是：
                    <span className="w13-pitch-blank" style={{ minWidth: 200 }}>___</span>
                    。
                </div>
            </div>

            {/* W12 已準備的中期報告資料帶入 */}
            {hasMidPrep && (
                <div className="mt-4 p-4 rounded-[var(--radius-unified)] bg-[#F0F9FF] border border-[#BAE6FD]">
                    <p className="text-[12px] text-[#0369A1] font-bold mb-2">📂 你在 W12 已準備的報告內容</p>
                    {midStatus && <p className="text-[12px] text-[#0C4A6E] mb-1"><strong>現況：</strong>{midStatus}</p>}
                    {midGap && <p className="text-[12px] text-[#0C4A6E] mb-1"><strong>缺口：</strong>{midGap}</p>}
                    {midPlan && <p className="text-[12px] text-[#0C4A6E]"><strong>計畫：</strong>{midPlan}</p>}
                </div>
            )}

            {/* 聽講筆記 */}
            <div className="mt-5">
                <p className="text-[13px] font-bold text-[var(--ink)] mb-2">📝 聽其他組報告時，記下對你有啟發的事</p>
                <ThinkRecord
                    dataKey="w13-pitch-notes"
                    prompt="哪一組的經驗讓你印象深刻？他們的缺口或解法跟你有什麼關係？"
                    scaffold={[
                        '___組的方法是...，他們遇到的問題是...',
                        '對我的啟發：...',
                    ]}
                />
            </div>

            {/* 最意外的發現 */}
            <div className="mt-4">
                <ThinkRecord
                    dataKey="w13-surprise"
                    prompt="蒐集過程中最意外的發現是什麼？（Pitch 時會用到！）"
                    scaffold={['我本來以為...，但實際蒐集後發現...']}
                />
            </div>

            {/* ═══ 關帳標準 ═══ */}
            <h2 className="text-[15px] font-bold text-[var(--ink)] mt-8 mb-3">🎫 W14 入場券標準</h2>
            <p className="text-[12px] text-[var(--ink-mid)] mb-3">
                資料收齊 ≠ 可以進 W14。你必須把資料<strong>洗好、切好</strong>，才能進廚房！
            </p>
            <div className="w13-ticket-grid">
                {TICKET_STANDARDS.map((t, i) => (
                    <div key={i} className="w13-ticket-row">
                        <span className="w13-ticket-icon">{t.icon}</span>
                        <span className="w13-ticket-method">{t.method}</span>
                        <span>{t.requirement}</span>
                    </div>
                ))}
            </div>

            {/* ═══ AI 工具箱 ═══ */}
            <h2 className="text-[15px] font-bold text-[var(--ink)] mt-8 mb-3">🤖 AI 工具箱</h2>

            <div className="flex flex-col gap-5">
                <div>
                    <p className="text-[13px] font-bold text-[var(--ink)] mb-2">🚨 進度落後？AI 補救策略</p>
                    <p className="text-[12px] text-[var(--ink-mid)] mb-2">讓 AI 幫你擬每日行動計畫和加速策略。</p>
                    <CopyablePrompt text={RESCUE_PROMPT} label="AI 補救策略 Prompt" />
                </div>

                <div>
                    <p className="text-[13px] font-bold text-[var(--ink)] mb-2">🚀 已達標？AI 初步探勘</p>
                    <p className="text-[12px] text-[var(--ink-mid)] mb-2">資料清洗完了？嚐一下 W14 的味道——讓 AI 幫你找有趣的趨勢。</p>
                    <CopyablePrompt text={EXPLORE_PROMPT} label="AI 初步探勘 Prompt" />
                </div>

                <ThinkRecord
                    dataKey="w13-ai-explore"
                    prompt="AI 探勘紀錄：AI 說了什麼？你覺得哪些有道理、哪些是過度詮釋？"
                    scaffold={[
                        'AI 找到的趨勢/現象：...',
                        '我的判斷：合理 / 過度詮釋 / 部分有道理，因為...',
                    ]}
                />
            </div>

            {/* ═══ 分隔線：資料確認區 ═══ */}
            <div className="mt-10 mb-6 flex items-center gap-3">
                <div className="flex-1 h-px bg-[var(--border)]" />
                <span className="text-[13px] font-bold text-[var(--ink-mid)]">📦 資料關帳確認</span>
                <div className="flex-1 h-px bg-[var(--border)]" />
            </div>

            <p className="text-[12px] text-[var(--ink-mid)] mb-4 leading-relaxed">
                誠實填！不是為了交差，是為了讓你知道帶著什麼進入 W14。勾選適用於你的方法的項目。
            </p>

            {/* 資料量確認 */}
            <ThinkRecord
                dataKey="w13-data-status"
                prompt="最終蒐集量與品質確認：你的方法、最終數量、原定目標、達成率、有無品質問題"
                scaffold={[
                    '方法：___，最終蒐集 ___，目標 ___，達成率約 ___%',
                    '品質問題：有 / 沒有（如果有，說明如何處理）',
                    '數位化狀態：已完成 / 還需要___',
                ]}
            />

            {/* 品質自查清單 */}
            <div className="mt-4">
                <p className="text-[13px] font-bold text-[var(--ink)] mb-2">🔍 資料品質自查（勾選你已完成的項目）</p>
                <QualityChecklist />
            </div>

            {/* W14 帶過去的問題 */}
            <div className="mt-4">
                <ThinkRecord
                    dataKey="w13-w14-question"
                    prompt="在開始分析之前，你已經預見什麼困難或疑問？"
                    scaffold={['我擔心的是...', '我不確定的是...']}
                />
            </div>

            {/* ═══ 分隔線：研究日誌 ═══ */}
            <div className="mt-10 mb-6 flex items-center gap-3">
                <div className="flex-1 h-px bg-[var(--border)]" />
                <span className="text-[13px] font-bold text-[var(--ink-mid)]">✏️ 研究日誌</span>
                <div className="flex-1 h-px bg-[var(--border)]" />
            </div>

            <p className="text-[12px] text-[var(--ink-mid)] mb-4 leading-relaxed">
                延續 W12 格式，記錄本週 <strong>3 個關鍵行動</strong>。
            </p>

            <div className="flex flex-col gap-4">
                <ThinkRecord
                    dataKey="w13-diary-1"
                    prompt="🔑 關鍵行動 1：日期、做了什麼、結果/困難、下一步"
                    scaffold={['日期：___月___日', '我做了：...', '結果/困難：...', '下一步：...']}
                />
                <ThinkRecord
                    dataKey="w13-diary-2"
                    prompt="🔑 關鍵行動 2：日期、做了什麼、結果/困難、下一步"
                    scaffold={['日期：___月___日', '我做了：...', '結果/困難：...', '下一步：...']}
                />
                <ThinkRecord
                    dataKey="w13-diary-3"
                    prompt="🔑 關鍵行動 3：日期、做了什麼、結果/困難、下一步"
                    scaffold={['日期：___月___日', '我做了：...', '結果/困難：...', '下一步：...']}
                />
            </div>

            {/* ═══ 學期轉折提醒 ═══ */}
            <div className="mt-8 p-5 rounded-[var(--radius-unified)] bg-gradient-to-br from-[#1a1a2e] to-[#16213e] text-white text-center">
                <p className="text-[20px] mb-2">🔄</p>
                <p className="text-[15px] font-bold mb-2">身份轉換</p>
                <p className="text-[13px] opacity-80 leading-relaxed">
                    從今天之後，你不再是「蒐集資料的研究員」。
                    <br />你變成「<strong>分析資料的研究員</strong>」！
                </p>
                <div className="mt-4 text-[12px] opacity-60 text-left mx-auto" style={{ maxWidth: 400 }}>
                    <p className="font-bold mb-1">W14 攜帶物品：</p>
                    <p>📋 問卷組：Google 表單連結 + Excel</p>
                    <p>🎤 訪談組：逐字稿文件</p>
                    <p>🧪 實驗組：整理好的數據表格</p>
                    <p>👀 觀察組：觀察紀錄 + 頻率統計</p>
                    <p>📚 文獻組：每篇摘要表 + 交叉比較筆記</p>
                </div>
            </div>

            {/* ═══ 匯出 ═══ */}
            <div className="mt-6">
                <ExportButton
                    weekLabel="W13 執行週 II：中期盤點與資料收齊"
                    fields={EXPORT_FIELDS}
                />
            </div>

            {/* ── 底部導航 ── */}
            <div className="mt-8 flex justify-between items-center">
                <Link to="/w12" className="flex items-center gap-1 text-[13px] text-[var(--ink-mid)] no-underline hover:text-[var(--accent)]">
                    <ArrowLeft size={14} /> W12
                </Link>
                <Link to="/w14" className="flex items-center gap-1 text-[13px] text-[var(--ink-mid)] no-underline hover:text-[var(--accent)]">
                    W14 <ArrowRight size={14} />
                </Link>
            </div>

            </div>{/* end scrolling content wrapper */}
        </div>
    );
};

export { W13Page };
export default W13Page;
