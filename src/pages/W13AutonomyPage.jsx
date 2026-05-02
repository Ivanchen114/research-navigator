import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CourseArc from '../components/ui/CourseArc';
import HeroBlock from '../components/ui/HeroBlock';
import ThinkRecord from '../components/ui/ThinkRecord';
import ExportButton from '../components/ui/ExportButton';
import ResetWeekButton from '../components/ui/ResetWeekButton';
import LessonMap from '../components/ui/LessonMap';
import { readRecords } from '../components/ui/ThinkRecord';
import { Map, ArrowRight, Activity, Coffee, AlertTriangle, Flame } from 'lucide-react';

/* ══════════════════════════════════════
 *  資料常數
 * ══════════════════════════════════════ */

const STATUS_OPTIONS = [
    {
        id: 'healthy',
        label: '🟢 健康',
        title: '進度正常 · 我有東西繼續做',
        accent: 'var(--success)',
        bg: '#F0FDF4',
        border: '#86EFAC',
        icon: Coffee,
        guide: '今天適合：做 W14 資料整理的暖身（把問卷／訪談初步看一遍，挑出 2–3 個你覺得最有趣的點）。如果今天進度比預期快，留一個段落記下「下週要繼續處理什麼」，避免下週開機慢。',
    },
    {
        id: 'warning',
        label: '🟡 預警',
        title: '進度有點掉 · 還救得回來',
        accent: '#D97706',
        bg: '#FFFBEB',
        border: '#FCD34D',
        icon: AlertTriangle,
        guide: '今天適合：先寫一張「卡關清單」（卡在哪一步、為什麼卡），帶一張清單到我這邊 5 分鐘 office hour——比一個人耗一節課快十倍。今天的目標不是把進度補完，是「找到下一步是什麼」。',
    },
    {
        id: 'falling',
        label: '🔴 落後',
        title: '進度嚴重落後 · 需要止血',
        accent: '#DC2626',
        bg: '#FEF2F2',
        border: '#FCA5A5',
        icon: Flame,
        guide: '今天適合：跟我約 10 分鐘——我們不是補進度，是「重新訂一個學期能跑完的最小版本」。坦白比硬撐更省你的時間。今天結束前至少完成下方三格繳交，讓我知道你目前到哪裡。',
    },
];

/* — ExportButton 欄位 — */
const EXPORT_FIELDS = [
    { key: 'w13-progress-status', label: '本週進度自評', question: '🟢 健康／🟡 預警／🔴 落後（三選一）' },
    { key: 'w13-today-done', label: '今天我做了什麼？', question: '具體列出今天 100 分鐘做了哪些事（3 行內）' },
    { key: 'w13-w14-question', label: '下週 W14 我最想解決的問題', question: '帶到 W14 資料分析課要解的關鍵問題（1–2 行）' },
];

/* ══════════════════════════════════════
 *  進度自評三按鈕（自動寫 dataKey）
 * ══════════════════════════════════════ */

const STATUS_KEY = 'w13-progress-status';
const STORAGE_KEY = 'rib_think_records';

const ProgressSelector = ({ value, onChange }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {STATUS_OPTIONS.map(opt => {
                const Icon = opt.icon;
                const picked = value === opt.id;
                return (
                    <button
                        key={opt.id}
                        type="button"
                        onClick={() => onChange(opt.id)}
                        className="text-left rounded-[var(--radius-unified)] border-2 p-4 transition-all"
                        style={{
                            background: picked ? opt.bg : '#fff',
                            borderColor: picked ? opt.accent : 'var(--border)',
                            boxShadow: picked ? '0 0 0 3px rgba(0,0,0,0.04)' : 'none',
                        }}
                    >
                        <div className="flex items-center gap-2 mb-1">
                            <Icon size={16} style={{ color: opt.accent }} />
                            <span className="font-bold text-[14px]" style={{ color: picked ? opt.accent : 'var(--ink)' }}>
                                {opt.label}
                            </span>
                        </div>
                        <p className="text-[12px] text-[var(--ink-mid)] leading-relaxed">{opt.title}</p>
                    </button>
                );
            })}
        </div>
    );
};

/* ══════════════════════════════════════
 *  主頁面
 * ══════════════════════════════════════ */

const W13AutonomyPage = () => {
    const [showLessonMap, setShowLessonMap] = useState(false);
    const [status, setStatus] = useState(() => {
        try {
            const r = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
            return r[STATUS_KEY] || '';
        } catch { return ''; }
    });

    const handleStatus = (id) => {
        setStatus(id);
        try {
            const r = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
            r[STATUS_KEY] = id;
            localStorage.setItem(STORAGE_KEY, JSON.stringify(r));
        } catch {}
    };

    const picked = STATUS_OPTIONS.find(o => o.id === status);

    /* 試著從先前週次抓題目 */
    const saved = readRecords();
    const myTopic = saved['w8-merged-topic'] || saved['w8-research-question'] || saved['w4-final-topic'] || saved['w3-final-topic'] || '';

    return (
        <div className="page-container animate-in-fade-slide">
            {/* TOP BAR */}
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-4 mb-8 md:mb-12 gap-3">
                <div className="text-[11px] font-mono text-[var(--ink-light)] flex items-center gap-2 min-w-0">
                    <span className="hidden md:inline">研究方法與專題 / 執行檢核 / </span>
                    <span className="text-[var(--ink)] font-bold">自主進度 W13</span>
                </div>
                <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
                    <span className="bg-[var(--paper-warm)] text-[var(--ink)] text-[10px] font-bold px-2 py-0.5 rounded-[2px] font-mono">100 MINS</span>
                    <ResetWeekButton weekPrefix="w13-" />
                    <button
                        onClick={() => setShowLessonMap(!showLessonMap)}
                        className="text-[11px] text-[var(--ink-light)] hover:text-[var(--accent)] transition-colors flex items-center gap-1 font-mono"
                    >
                        <Map size={12} /> <span className="hidden md:inline">{showLessonMap ? 'Hide Plan' : 'Instructor View'}</span>
                    </button>
                    <span className="hidden md:inline-block bg-[var(--ink)] text-white text-[10px] font-bold px-2 py-0.5 rounded-[2px] font-mono">FLEX · SELF</span>
                </div>
            </div>

            {showLessonMap && (
                <div className="mb-6 p-5 rounded-[var(--radius-unified)] bg-[var(--paper-warm)] border border-[var(--border)] text-[13px] text-[var(--ink-mid)] leading-relaxed">
                    <p className="font-bold text-[var(--ink)] mb-2">📋 教師備忘 · W13 自主週運作方式</p>
                    <ol className="list-decimal pl-5 space-y-1">
                        <li>進教室後給 5 分鐘讓全班完成「進度自評」（綠／黃／紅按鈕）。</li>
                        <li>紅燈優先排 office hour（10 分鐘 / 組），目標不是補進度，是重新對齊「最小可完成版本」。</li>
                        <li>黃燈帶卡關清單來談 5 分鐘。綠燈自主推進 W14 暖身。</li>
                        <li>下課前最後 10 分鐘，全班回到網頁完成 3 格繳交 + 匯出。</li>
                        <li>本週不批改成績，只看出席 + 是否有交。下週 W14 開頭會用學生自填的「W14 我最想解決的問題」當開場。</li>
                    </ol>
                </div>
            )}

            {/* HERO */}
            <HeroBlock
                kicker="R.I.B. 調查檔案 · 研究方法與專題 · W13"
                title="自主進度："
                accentTitle="今天你自己當總指揮"
                subtitle="這是學期裡唯一一週沒有新教學的彈性週。為什麼留？因為前面 12 週把你推到很多不同地方，每組現在的痛點都不一樣——統一上課等於對誰都不對。今天先用三個按鈕誠實標記自己的位置，再決定怎麼用這 100 分鐘。"
                chain="W12 你交了期中短報，老師看完了——但問題是：每一組剩下要解的事都不一樣。今天不開新內容，把節奏交還給你。"
                meta={[
                    { label: '課堂節奏', value: '5 分鐘自評 → 90 分鐘自主推進（含 office hour）→ 10 分鐘繳交' },
                    { label: '時長', value: '100 MINS' },
                    { label: '今天的產出', value: '進度自評 + 今天做了什麼 + 下週要解的問題（共 3 格）' },
                    { label: '帶去 W14', value: '你寫的「W14 最想解決的問題」會變成 W14 開場素材' },
                ]}
            />
            <CourseArc items={[
                { wk: 'W1-W2', name: '探索階段\nRED 公約', status: 'past' },
                { wk: 'W3-W4', name: '題目決定\n方法地圖', status: 'past' },
                { wk: 'W5-W6', name: '操作型定義\n博覽會 / 組隊', status: 'past' },
                { wk: 'W7-W8', name: '文獻搜尋\n寫作引用', status: 'past' },
                { wk: 'W9-W11', name: '工具設計\n預試與倫理', status: 'past' },
                { wk: 'W12', name: '期中短報', status: 'past' },
                { wk: 'W13', name: '自主進度\n彈性週', status: 'now' },
                { wk: 'W14-W17', name: '數據解讀\n發表', status: 'future' },
            ]} />

            {myTopic && (
                <div className="mt-6 mb-2 px-4 py-3 rounded-[var(--radius-unified)] bg-[var(--paper-warm)] border border-[var(--border)] text-[13px] flex items-start gap-2">
                    <span className="text-[16px]">📎</span>
                    <div>
                        <span className="font-bold text-[var(--ink)]">你目前的研究題目</span>
                        <p className="text-[var(--ink-mid)] mt-0.5">{myTopic}</p>
                    </div>
                </div>
            )}

            {/* ─── 區塊 1：三按鈕自評 + 分流指引 ─── */}
            <section className="mt-10 space-y-4 prose-zh">
                <div className="flex items-center gap-2">
                    <Activity size={18} className="text-[var(--accent)]" />
                    <h2 className="text-[18px] font-bold text-[var(--ink)] m-0">第一步 · 誠實標記你的位置</h2>
                </div>
                <p className="text-[13px] text-[var(--ink-mid)] leading-relaxed max-w-[720px]">
                    沒有標準答案，也不打分數。選哪一個只決定一件事：你今天的 100 分鐘該怎麼用，以及要不要找老師談。
                </p>

                <ProgressSelector value={status} onChange={handleStatus} />

                {picked && (
                    <div
                        className="mt-2 p-4 rounded-[var(--radius-unified)] border-l-4 animate-in slide-in-from-top-2 duration-200"
                        style={{ background: picked.bg, borderLeftColor: picked.accent }}
                    >
                        <div className="text-[11px] font-mono font-bold uppercase tracking-wider mb-2" style={{ color: picked.accent }}>
                            建議路線 · {picked.label}
                        </div>
                        <p className="text-[13px] text-[var(--ink)] leading-relaxed m-0">{picked.guide}</p>
                    </div>
                )}
            </section>

            {/* ─── 區塊 2：極簡 3 格繳交 ─── */}
            <section className="mt-12 space-y-5 prose-zh">
                <div className="flex items-center gap-2">
                    <span className="text-[18px]">📝</span>
                    <h2 className="text-[18px] font-bold text-[var(--ink)] m-0">第二步 · 下課前 10 分鐘填完 3 格</h2>
                </div>
                <p className="text-[13px] text-[var(--ink-mid)] leading-relaxed max-w-[720px]">
                    本週不寫長文。下面三格是底線——讓老師知道你今天到哪、下週要往哪。寫完按下方按鈕匯出。
                </p>

                <ThinkRecord
                    dataKey="w13-today-done"
                    prompt="① 今天我做了什麼？"
                    placeholder="條列今天 100 分鐘的具體動作。例：① 整理問卷 Excel（刪掉 3 份亂填的） ② 跟 A 同學討論回收率 ③ 試畫了一張長條圖但看不懂。"
                    rows={4}
                />

                <ThinkRecord
                    dataKey="w13-w14-question"
                    prompt="② 下週 W14 資料分析課，我最想先解決什麼問題？"
                    placeholder="一兩行就好。例：我有 80 份問卷，但不知道該畫長條圖還是圓餅圖／我訪談逐字稿太多，不知道怎麼歸納主題。"
                    rows={3}
                />

                <div className="px-4 py-3 rounded-[var(--radius-unified)] bg-[#EFF6FF] border border-[#BFDBFE] text-[12px] text-[#1E40AF] leading-relaxed">
                    💡 第 ③ 格其實已經在第一步填好了——就是你按下的那顆綠／黃／紅按鈕。三格全齊，按下方匯出。
                </div>

                {/* 本週結束，你應該要會 — B 標準格式 */}
                <div className="bg-white border border-[var(--border)] rounded-[var(--radius-unified)] overflow-hidden mb-4">
                    <div className="p-4 px-5 bg-[var(--paper-warm)] border-b border-[var(--border)] font-bold text-[13px]">
                        ✅ 本週結束，你應該要會
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-[1px] bg-[var(--border)]">
                        {[
                                            '誠實標記自己的進度（綠／黃／紅）並選對應節奏',
                                            '在 100 分鐘內具體推進研究，不要 idle',
                                            '預判下週 W14 資料分析會卡的關鍵問題',
                                            '必要時主動找老師 office hour（紅燈組必做）',
                        ].map((item, i) => (
                            <div key={i} className="p-4 px-5 bg-white flex items-start gap-3">
                                <span className="text-[var(--success)] text-[16px] mt-0.5 flex-shrink-0">✓</span>
                                <span className="text-[13px] text-[var(--ink-mid)] leading-relaxed">{item}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <ExportButton
                    weekLabel="W13 自主進度（彈性週）"
                    fields={EXPORT_FIELDS}
                />
            </section>

            {/* ─── 下週預告 ─── */}
            <section className="mt-12 mb-6 p-6 rounded-[var(--radius-unified)] bg-[var(--ink)] text-white">
                <div className="flex items-center gap-2 mb-3">
                    <span className="bg-[var(--accent)] text-[10px] font-bold px-2 py-0.5 rounded-[2px] font-mono">NEXT WEEK</span>
                    <h3 className="text-[16px] font-bold m-0">W14 預告 · 讓數據自己說話</h3>
                </div>
                <div className="grid md:grid-cols-2 gap-6 text-[13px] leading-relaxed">
                    <div>
                        <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--accent)] mb-1">W14 主題</div>
                        <p className="text-[rgba(255,255,255,0.85)] m-0">圖表選擇與圖的說明——同一份數據，用錯圖會說錯話。下週會分四種常見圖（長條、折線、圓餅、散布）的適用場景，並練習為自己的圖寫一段 standalone 的圖說。</p>
                    </div>
                    <div>
                        <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--accent)] mb-1">你要帶來</div>
                        <p className="text-[rgba(255,255,255,0.85)] m-0">本週填的「W14 最想解決的問題」會變成課堂開場——準備好接話。如果今天打了紅燈，下週開課前先把 office hour 約掉。</p>
                    </div>
                </div>
                <div className="mt-5 flex justify-end">
                    <Link
                        to="/w14"
                        className="inline-flex items-center gap-2 bg-[var(--accent)] text-white px-4 py-2 rounded-[var(--radius-unified)] font-bold text-[13px] hover:opacity-90 transition-opacity"
                    >
                        前往 W14 解碼 <ArrowRight size={14} />
                    </Link>
                </div>
            </section>
        </div>
    );
};

export { W13AutonomyPage };
export default W13AutonomyPage;
