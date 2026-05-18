import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import CourseArc from '../components/ui/CourseArc';
import HeroBlock from '../components/ui/HeroBlock';
import TaskCard from '../components/ui/TaskCard';
import LessonMap from '../components/ui/LessonMap';
import './W12.css';
import ResetWeekButton from '../components/ui/ResetWeekButton';
import { readRecords } from '../components/ui/ThinkRecord';
import { W12Data } from '../data/lessonMaps';
import ContentTypeChip from '../components/ui/ContentTypeChip';
import {
    ArrowRight,
    ArrowLeft,
    AlertCircle,
    Clock,
    Map,
    ChevronDown,
} from 'lucide-react';

/* ══════════════════════════════════════
 *  外部連結 — 老師部署完 Apps Script / Google Form 後在這裡填入
 *  部署 SOP 見 outputs/W12_期中短報_部署SOP.docx
 * ══════════════════════════════════════ */
/* ⚠️ 注意：本網頁是全校統一頁面，每班老師獨立部署自己的系統。
 *    Form / Web App 連結由各班老師透過 Google Classroom 發給自己班學生，
 *    不寫死在此頁，避免兩班錯亂。 */

/* ══════════════════════════════════════
 *  資料常數
 * ══════════════════════════════════════ */

/* — 短報卡 5 段（學生 W11 結束課後在 Form 填）— */
/* 朗讀速率：高中生中速約 200 字/分鐘 ≈ 3.3 字/秒 → 30 秒 ~100 字、60 秒 ~200 字 */
/* 總時長 180 秒 = 15+20+30+90+25（文獻探討 3 篇佔最大塊：90 秒講 3 篇對話）*/
const REPORT_SECTIONS = [
    { idx: 1, time: '15 秒', title: '研究題目', desc: '一句話寫清楚——你要研究什麼', limit: '30 字內 ≈ 15 秒' },
    { idx: 2, time: '20 秒', title: '研究動機', desc: '為什麼想做這個——一句話的好奇或痛點', limit: '50 字內 ≈ 20 秒' },
    { idx: 3, time: '30 秒', title: '研究方法 + 本組工具設計書', desc: '研究方法 + 本組工具設計書類型（如「Google Form 25 題」）', limit: '80 字內 ≈ 30 秒' },
    { idx: 4, time: '90 秒', title: '文獻探討（3 篇對話）', desc: '3 篇關鍵文獻 — 比較不同專家觀點、呈現研究現況與未解決問題（每篇含 APA + 核心觀點 + 跟其他文獻或本研究的差異）', limit: '每篇 100 字 × 3 ≈ 90 秒（最大塊）' },
    { idx: 5, time: '25 秒', title: '目前進度', desc: '計畫書到哪 / 本組工具設計書做到哪 / W11 Pilot 後修了什麼', limit: '80 字內 ≈ 25 秒' },
];



/* ══════════════════════════════════════
 *  工具卡（不含連結 — 每班老師獨立部署，連結走 GC）
 * ══════════════════════════════════════ */
const ToolInfoCard = ({ title, desc, icon }) => {
    return (
        <div className="p-4 rounded-[var(--radius-unified)] border border-[var(--border)] bg-white">
            <div className="flex items-start gap-3">
                <span className="text-[24px] flex-shrink-0">{icon}</span>
                <div className="flex-1 min-w-0">
                    <p className="font-bold text-[14px] text-[var(--ink)] mb-1">{title}</p>
                    <p className="text-[12px] text-[var(--ink-mid)] leading-relaxed">{desc}</p>
                </div>
            </div>
        </div>
    );
};

/* ══════════════════════════════════════
 *  主頁面
 * ══════════════════════════════════════ */

const W12Page = () => {
    const [showLessonMap, setShowLessonMap] = useState(false);
    const [showHoles, setShowHoles] = useState(false);
    const [showQ2Ex, setShowQ2Ex] = useState(false);
    const [showQ3Ex, setShowQ3Ex] = useState(false);
    const saved = readRecords();
    const myMethod = saved['w9-my-method'] || saved['w8-tool-method'] || '';
    const mySecondary = saved['w8-tool-method-secondary'] || '';
    const myTopic = saved['w8-merged-topic'] || saved['w8-research-question'] || '';

    return (
        <div className="page-container animate-in-fade-slide">
            {/* TOP BAR */}
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-4 mb-8 md:mb-12 gap-3">
                <div className="text-[11px] font-mono text-[var(--ink-light)] flex items-center gap-2 min-w-0">
                    <span className="hidden md:inline">研究方法與專題 / 執行蒐集 / </span><span className="text-[var(--ink)] font-bold">期中進度短報 W12</span>
                </div>
                <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
                    <span className="bg-[var(--paper-warm)] text-[var(--ink)] text-[10px] font-bold px-2 py-0.5 rounded-[2px] font-mono">100 MINS</span>
                    <ResetWeekButton weekPrefix="w12-" />
                    <button
                        onClick={() => setShowLessonMap(!showLessonMap)}
                        className="text-[11px] text-[var(--ink-light)] hover:text-[var(--accent)] transition-colors flex items-center gap-1 font-mono"
                        type="button"
                    >
                        <Map size={12} /> <span className="hidden md:inline">{showLessonMap ? '收起流程' : '教師流程'}</span>
                    </button>
                </div>
            </div>

            {showLessonMap && (
                <div className="animate-in slide-in-from-top-4 duration-300 mb-8">
                    <LessonMap data={W12Data} />
                </div>
            )}

            {/* PAGE HEADER */}
            <HeroBlock
                kicker="R.I.B. 調查檔案 · 研究方法與專題 · W12"
                todo={[
                  { label: '今天做什麼', value: '上台 3 分鐘短報，用 Form 給每一組回饋。' },
                  { label: '為什麼做', value: 'W11 工具要上線了，先讓全班 30 雙眼睛找出你自己看不到的漏洞，報完才真的知道哪裡要修。' },
                  { label: '今天交什麼', value: '同儕回饋 Form（至少 10 組，建議全 12 組，回饋要具體有意義才算）。' },
                ]}
                question="還沒開始做之前，我的研究設計站得住嗎？"
                title="期中進度短報 · "
                accentTitle="同儕把關"
                subtitle="正式施測前的最後一道擋板。每組 3 分鐘短報 + 1 分鐘老師選題提問。同學透過 Google Form 即時回饋你的計畫漏洞——你看不到的，30 個聽眾總有人看出。"
                chain="W11 工具上線、要開始施測了——但別急。先把計畫拉出來給全班看，你想不到的漏洞，30 雙眼睛總有人看到。"
                meta={[
                    { label: '第一節', value: '開場 + Round 1 七組短報（每組 5 min）+ 緩衝' },
                    { label: '第二節', value: 'Round 2 六組短報 + 老師總結（評分私下給，不公告）' },
                    { label: '課堂產出', value: '各組短報投影 + 全班同儕回饋 Form + 老師私下評分' },
                    { label: '前置要求', value: 'W11 結束 7 天內全組合議 + 組長已填短報 Form（W12 上課前 8:00 截止）' },
                ]}
            />

            <CourseArc items={[
                { wk: 'W1-W2', name: '探索階段\nRED公約', past: true },
                { wk: 'W3-W4', name: '題目診斷\n方法地圖', past: true },
                { wk: 'W5-W8', name: '操作型定義／海報／文獻', past: true },
                { wk: 'W9-W11', name: '工具設計\n倫理審查', past: true },
                { wk: 'W12', name: '期中短報\n同儕把關', now: true },
                { wk: 'W13-W14', name: '執行 + 數據\n圖表結論' },
                { wk: 'W15-W17', name: '成果簡報\n博覽發表' },
            ]} />

            <TaskCard
                weekNumber="W12"
                weekTitle={W12Data.title}
                duration={`${W12Data.duration} 分鐘 · ${W12Data.durationDesc}`}
                tasks={[
                    '各組期中短報 — 3 分鐘報告 + 1 分鐘提問',
                    '全班同儕回饋 Form — 至少 10 組，必填「學到什麼」',
                ]}
            />

            {/* ═══ SCROLLING CONTENT ═══ */}
            <div className="mx-auto prose-zh space-y-6" style={{ maxWidth: 760 }}>

                {/* 入場警告 */}
                <div className="mt-2 p-5 rounded-[var(--radius-unified)] border-2 border-[#DC2626] bg-[#FEF2F2]">
                    <div className="flex items-center gap-2 mb-3">
                        <AlertCircle size={20} className="text-[#DC2626] flex-shrink-0" />
                        <ContentTypeChip type="注意" />
                        <p className="text-[15px] font-bold text-[#991B1B]">⏰ 上課前先確認兩件事</p>
                    </div>
                    <div className="space-y-2">
                        <div className="flex gap-3 bg-[#FEE2E2] rounded-lg p-3">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#DC2626] text-white text-[12px] font-bold flex items-center justify-center">1</span>
                            <div>
                                <p className="text-[13.5px] font-bold text-[#7F1D1D]">⚠️ 計劃書＋工具書已繳交至小組作業區</p>
                                <p className="text-[11.5px] text-[#991B1B] mt-0.5">繳交期限至 5/20（三）23:59——老師批改期中報告成績用，逾期算遲交</p>
                            </div>
                        </div>
                        <div className="flex gap-3 bg-[#FEE2E2] rounded-lg p-3">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#DC2626] text-white text-[12px] font-bold flex items-center justify-center">2</span>
                            <div>
                                <p className="text-[13.5px] font-bold text-[#7F1D1D]">報告前填好短報 Google Form（組長代填）</p>
                                <p className="text-[11.5px] text-[#991B1B] mt-0.5">沒填 = 無法報告 = 沒有期中成績</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 兩張大字卡 — 課堂節奏 + 評分核心 */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-[var(--accent)] rounded-lg p-4 text-center">
                        <p className="text-white text-[16px] font-bold leading-[1.65]">每組 3 分鐘短報<br/>報完 → 立刻填回饋<br/>1 分鐘內</p>
                        <p className="text-white/60 text-[11px] mt-1.5">不評自己組</p>
                    </div>
                    <div className="bg-[var(--ink)] rounded-lg p-4 text-center">
                        <p className="text-white text-[16px] font-bold leading-[1.65]">一句有遷移的話<br/>比十句「加油」值錢</p>
                        <p className="text-white/50 text-[11px] mt-1.5">學到什麼：從對方拿到什麼、用在哪</p>
                    </div>
                </div>

                {/* 前週資料帶入 */}
                {myTopic && (
                    <div className="p-4 rounded-[var(--radius-unified)] bg-[#F0F9FF] border border-[#BAE6FD]">
                        <p className="text-[12px] text-[#0369A1] font-bold mb-1">📂 你的研究</p>
                        <p className="text-[13px] text-[#0C4A6E]">{myTopic}</p>
                        {myMethod && <p className="text-[12px] text-[#0369A1] mt-1">主方法：{myMethod}{mySecondary && <span className="text-[#065F46]">　｜　補充：{mySecondary}</span>}</p>}
                    </div>
                )}

                {/* 同儕回饋 Form 說明 + 評分 */}
                <div className="p-4 rounded-[var(--radius-unified)] bg-[#F0FDF4] border-2 border-[#10B981]">
                    <div className="flex items-center gap-2 mb-1">
                        <ContentTypeChip type="做" />
                        <p className="text-[14px] font-bold text-[#065F46]">✏️ 同儕回饋 Form — <span className="underline decoration-2">每個人</span>對每一組各填一份，至少 10 組</p>
                    </div>
                    <p className="text-[11.5px] text-[#047857] mb-1">老師會提供 QR code。</p>
                    <p className="text-[12px] font-bold text-[#065F46] bg-[#D1FAE5] rounded px-2 py-1 mb-3 inline-block">🧑‍💻 這是個人上課成績，不是組別——全組都要填自己的</p>
                    <ul className="text-[12.5px] text-[#047857] leading-[1.85] list-decimal pl-5 space-y-1">
                        <li><strong>這組最大的計畫漏洞是？</strong>（單選 6 個漏洞——下方定義）</li>
                        <li><strong>我從這組學到什麼？</strong>（30 字內，<strong>必填</strong>——把對方優點拿來修自己用）</li>
                        <li><strong>給這組一句具體建議</strong>（30 字內，選填）</li>
                    </ul>
                </div>

                {/* 範本：必填「學到什麼」— 黑底金字 */}
                <div className="bg-white border border-[var(--border)] rounded-[var(--radius-unified)] overflow-hidden">
                    <div className="px-4 py-2.5 bg-[var(--ink)] flex items-center justify-between">
                        <p className="font-bold text-[13px] text-[#F59E0B]">📋 第 2 題「學到什麼」怎麼寫</p>
                        <span className="text-[11px] text-[#F59E0B]/70 font-mono">必填</span>
                    </div>
                    <div className="px-4 py-3">
                        <p className="text-[12px] text-[var(--ink-mid)] leading-[1.85]">
                            句型：「<strong className="text-[var(--ink)]">他們___做得好（或有___問題）→ 我們組也___，要改成___</strong>」
                        </p>
                    </div>
                    <button onClick={() => setShowQ2Ex(v => !v)} className="w-full flex items-center justify-between px-4 py-2 bg-[var(--paper-warm)] border-t border-[var(--border)] text-left">
                        <span className="text-[11.5px] font-bold text-[var(--ink)]">看正例 / 反例</span>
                        <ChevronDown size={14} className={`text-[var(--ink-light)] transition-transform ${showQ2Ex ? 'rotate-180' : ''}`} />
                    </button>
                    {showQ2Ex && (
                        <div className="px-4 pb-3 pt-2 space-y-2 text-[11.5px]">
                            <div className="flex gap-2 bg-white border border-[#10B981]/50 rounded p-2.5">
                                <span className="text-[#10B981] font-bold flex-shrink-0">✅</span>
                                <span className="text-[#065F46]">「他們文獻三篇有互相比較觀點——我們組三篇只是各自介紹，要回去補一段比較。」</span>
                            </div>
                            <div className="flex gap-2 bg-white border border-[#10B981]/50 rounded p-2.5">
                                <span className="text-[#10B981] font-bold flex-shrink-0">✅</span>
                                <span className="text-[#065F46]">「他們 Pilot 後刪掉重複題目很清楚——我們組還沒做這步，下週要補。」</span>
                            </div>
                            <div className="flex gap-2 bg-white border border-[#DC2626]/40 rounded p-2.5">
                                <span className="text-[#DC2626] font-bold flex-shrink-0">❌</span>
                                <span className="text-[#7F1D1D]">「他們表現很好，值得學習。」<span className="text-[#991B1B]/60 ml-1">沒指出具體哪裡、沒連回自己組</span></span>
                            </div>
                        </div>
                    )}
                </div>

                {/* 範本：選填「具體建議」— 黑底金字 */}
                <div className="bg-white border border-[var(--border)] rounded-[var(--radius-unified)] overflow-hidden">
                    <div className="px-4 py-2.5 bg-[var(--ink)] flex items-center justify-between">
                        <p className="font-bold text-[13px] text-[#F59E0B]">📋 第 3 題「具體建議」怎麼寫</p>
                        <span className="text-[11px] text-[#F59E0B]/70 font-mono">選填，寫了加分</span>
                    </div>
                    <div className="px-4 py-3">
                        <p className="text-[12px] text-[var(--ink-mid)] leading-[1.85]">
                            句型：「<strong className="text-[var(--ink)]">我發現___ → 建議改成___ → 理由___</strong>」
                        </p>
                    </div>
                    <button onClick={() => setShowQ3Ex(v => !v)} className="w-full flex items-center justify-between px-4 py-2 bg-[var(--paper-warm)] border-t border-[var(--border)] text-left">
                        <span className="text-[11.5px] font-bold text-[var(--ink)]">看正例 / 反例</span>
                        <ChevronDown size={14} className={`text-[var(--ink-light)] transition-transform ${showQ3Ex ? 'rotate-180' : ''}`} />
                    </button>
                    {showQ3Ex && (
                        <div className="px-4 pb-3 pt-2 space-y-2 text-[11.5px]">
                            <div className="flex gap-2 bg-white border border-[#10B981]/50 rounded p-2.5">
                                <span className="text-[#10B981] font-bold flex-shrink-0">✅</span>
                                <span className="text-[#065F46]">「題 5 跟題 8 在問同個概念 → 建議刪題 8 → 受測者會疑惑、作答不一致。」</span>
                            </div>
                            <div className="flex gap-2 bg-white border border-[#10B981]/50 rounded p-2.5">
                                <span className="text-[#10B981] font-bold flex-shrink-0">✅</span>
                                <span className="text-[#065F46]">「文獻 2 沒說明出版年 → 建議補齊 APA 格式 → 計畫書引用會被扣分。」</span>
                            </div>
                            <div className="flex gap-2 bg-white border border-[#DC2626]/40 rounded p-2.5">
                                <span className="text-[#DC2626] font-bold flex-shrink-0">❌</span>
                                <span className="text-[#7F1D1D]">「建議你們加油繼續努力！」<span className="text-[#991B1B]/60 ml-1">沒有具體問題、沒有方向</span></span>
                            </div>
                        </div>
                    )}
                </div>

                {/* 6 漏洞定義（收合） */}
                <div className="bg-white border border-[var(--border)] rounded-[var(--radius-unified)] overflow-hidden">
                        <button
                            onClick={() => setShowHoles(h => !h)}
                            className="w-full flex items-center justify-between px-3 py-2.5 text-left"
                        >
                            <p className="font-bold text-[12.5px] text-[#065F46]">🎯 6 個漏洞選項是什麼意思？</p>
                            <ChevronDown size={15} className={`text-[#10B981] flex-shrink-0 transition-transform ${showHoles ? 'rotate-180' : ''}`} />
                        </button>
                        {showHoles && (
                            <div className="px-3 pb-3 grid md:grid-cols-2 gap-2 text-[11.5px] leading-[1.75]">
                                {[
                                    { t: '① 題目模糊', d: '一句話講不清楚 / 範圍太大太小 / 抽象到無法操作' },
                                    { t: '② 動機不充分', d: '為什麼想做沒講清楚 / 動機跟題目連不起來' },
                                    { t: '③ 方法跟研究問題對不上', d: '想知道因果卻用問卷；想知道感受卻用是非題' },
                                    { t: '④ 文獻沒對話', d: '3 篇都重複同一觀點 / 沒比較專家差異 / 沒連回本研究' },
                                    { t: '⑤ APA 格式錯誤', d: '引用格式不對 / 缺資訊（年、卷、頁碼）/ 3 篇不一致' },
                                    { t: '⑥ 進度落後或太籠統', d: '章節停在某段 / 本組工具書還沒做出來 / 進度太抽象' },
                                ].map(({ t, d }) => (
                                    <div key={t} className="bg-[var(--paper-warm)] rounded-[6px] p-2">
                                        <p className="font-bold text-[var(--ink)]">{t}</p>
                                        <p className="text-[var(--ink-mid)]">{d}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>



                    {/* 評分規準 */}
                    <p className="mt-4 text-[11px] font-bold text-[var(--ink-mid)] uppercase tracking-wider font-mono mb-2">📊 本週評分規準</p>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-[#F0FDF4] border-2 border-[#10B981]/60 rounded-lg p-4 text-center">
                            <p className="text-[#065F46] text-[15px] font-bold leading-[1.7]">依回饋份數評分<br/>10 份滿分</p>
                        </div>
                        <div className="bg-[#FFF7ED] border-2 border-[#F59E0B]/60 rounded-lg p-4 text-center">
                            <p className="text-[#92400E] text-[15px] font-bold leading-[1.7]">有寫具體建議<br/>品質加分</p>
                        </div>
                    </div>{/* end 評分規準 */}

                {/* 短報卡 5 段內容 */}
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <ContentTypeChip type="學" />
                        <h3 className="font-serif text-[18px] md:text-[20px] font-bold text-[var(--ink)]">📄 你的短報卡 — 5 段 3 分鐘</h3>
                    </div>
                    <p className="text-[12.5px] text-[var(--ink-mid)] leading-relaxed mb-3">
                        組長已在課前填進 Form。上課時老師輪播投影，你對著自己那頁講。
                    </p>
                    <div className="overflow-x-auto">
                        <table className="w-full text-[12.5px] border-collapse">
                            <thead>
                                <tr className="bg-[var(--ink)] text-white">
                                    <th className="p-2 text-left font-bold">段</th>
                                    <th className="p-2 text-left font-bold">時長</th>
                                    <th className="p-2 text-left font-bold">內容</th>
                                    <th className="p-2 text-left font-bold">字數</th>
                                </tr>
                            </thead>
                            <tbody>
                                {REPORT_SECTIONS.map((s) => (
                                    <tr key={s.idx} className="border-b border-[var(--border)]">
                                        <td className="p-2 font-bold text-[var(--accent)]">{s.idx}</td>
                                        <td className="p-2 font-mono text-[11.5px] text-[var(--ink-mid)]">{s.time}</td>
                                        <td className="p-2"><strong>{s.title}</strong>　<span className="text-[var(--ink-mid)]">{s.desc}</span></td>
                                        <td className="p-2 text-[11.5px] text-[var(--ink-light)]">{s.limit}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {/* 文獻 90 秒範例（3 篇對話對高一抽象，給可仿的範例）*/}
                    <div className="mt-3 bg-[#F5F3FF] border border-[#DDD6FE] rounded-[var(--radius-unified)] p-3.5">
                        <p className="text-[12.5px] font-bold text-[#5B21B6] mb-1.5">📖 第 4 段「文獻探討 90 秒」長什麼樣（可仿的範例）</p>
                        <p className="text-[12px] text-[#4C1D95] leading-[1.95] mb-2">
                            「陳明德（2023）發現高中生每天用社群超過 3 小時，焦慮分數明顯較高；但林佳穎（2022）指出真正影響的不是『時數』而是『比較行為』——同樣 3 小時，只看朋友動態的人比看新聞的人更焦慮。王思婷（2024）再補一刀：她追蹤發現焦慮高的人會用更多社群，因果可能是反過來的。三篇放在一起看，時數、使用方式、因果方向都還沒定論——這正是本研究想在我們學校高一生身上釐清的。」
                        </p>
                        <p className="text-[11px] text-[#6D28D9] italic leading-relaxed">
                            💡 對話 ≠ 各講一次：用「<strong>A 發現…但 B 指出…C 再補…</strong>」串起來，<strong>比較／補充／反駁</strong>三選一，最後一句連回本研究。口語講 APA 只要「作者（年份）」就好，完整 APA 留在計畫書。
                        </p>
                    </div>
                </div>



                {/* 課後反思（靜態思考題，不用繳交） */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2 mb-2">
                        <ContentTypeChip type="學" />
                        <h3 className="font-serif text-[18px] md:text-[20px] font-bold text-[var(--ink)]">📝 聽完之後，自己想一想</h3>
                    </div>
                    <p className="text-[12px] text-[var(--ink-light)] italic">這兩個問題不用繳交——表單裡已有類似的反思題。自己想清楚就好。</p>
                    <div className="space-y-2">
                        {[
                            '哪一組的設計／Pilot 發現最讓你想回頭改自己的？（對方的漏洞，你們組有沒有同樣的問題？）',
                            '同儕回饋 + 老師評分後，我們組 W13 前要修的具體項目是什麼？（修什麼、怎麼改、誰負責、什麼時候完成？）',
                        ].map((q, i) => (
                            <div key={i} className="flex items-start gap-3 p-3.5 bg-[var(--paper-warm)] rounded-[var(--radius-unified)] border border-[var(--border)]">
                                <span className="font-mono text-[11px] font-bold text-[var(--ink-light)] mt-0.5 flex-shrink-0">Q{i + 1}</span>
                                <p className="text-[13px] text-[var(--ink-mid)] leading-[1.75]">{q}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 本週結束，你應該要會 — B 標準格式 */}
                <div className="bg-white border border-[var(--border)] rounded-[var(--radius-unified)] overflow-hidden mb-4">
                    <div className="p-4 px-5 bg-[var(--paper-warm)] border-b border-[var(--border)] font-bold text-[13px]">
                        ✅ 本週結束，你應該要會
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-[1px] bg-[var(--border)]">
                        {[
                                            '上台 3 分鐘短報自己的研究進度（題目 / 動機 / 方法 / 3 篇文獻 / 目前進度）',
                                            '聽完 12 組短報並用 Form 給每組具體回饋',
                                            '整理「聽別組學到什麼」並轉成自己組要改的事',
                        ].map((item, i) => (
                            <div key={i} className="p-4 px-5 bg-white flex items-start gap-3">
                                <span className="text-[var(--success)] text-[16px] mt-0.5 flex-shrink-0">✓</span>
                                <span className="text-[13px] text-[var(--ink-mid)] leading-relaxed">{item}</span>
                            </div>
                        ))}
                    </div>
                </div>


                {/* W13 預告 */}
                <div className="bg-[var(--ink)] border-l-4 border-[var(--accent)] p-5 md:p-6 rounded-r-lg text-white shadow-xl">
                    <span className="font-mono text-[11px] font-bold tracking-[0.2em] text-[var(--accent)] uppercase">W13 預告 · 資料整理週：原始資料 → 分析表</span>
                    <div className="font-bold text-[17px] md:text-[18px] mt-2 mb-3 leading-tight">
                        把收回來的資料整理成可以分析的表
                    </div>
                    <ul className="text-[12.5px] text-white/85 leading-[1.95] space-y-1 pl-4">
                        <li>・找雷挑戰暖身：AI 報告踩了哪 3 條紅線（異常≠剔除／剔除規則事前明示／保留處理紀錄）</li>
                        <li>・依方法 5 法對照：問卷／訪談／實驗／觀察／文獻——你的原始資料怎麼整成分析表</li>
                        <li>・施測收尾 + 原始資料整理（如施測還沒收完，這週邊收邊整）</li>
                        <li>・W13 整理完 → 進 W14 圖表分析</li>
                    </ul>
                </div>

                {/* 底部導航 */}
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
