import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import CourseArc from '../components/ui/CourseArc';
import HeroBlock from '../components/ui/HeroBlock';
import TaskCard from '../components/ui/TaskCard';
import LessonMap from '../components/ui/LessonMap';
import './W12.css';
import ThinkRecord from '../components/ui/ThinkRecord';
import ExportButton from '../components/ui/ExportButton';
import ResetWeekButton from '../components/ui/ResetWeekButton';
import { readRecords } from '../components/ui/ThinkRecord';
import { W12Data } from '../data/lessonMaps';
import {
    ArrowRight,
    ArrowLeft,
    AlertCircle,
    Clock,
    Star,
    Map,
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

/* — 評分基準（4 維 × 4 級）— */
const RUBRIC = [
    {
        dim: 'A',
        title: '計畫書定稿度',
        levels: [
            '1-5 章還沒寫完',
            '1-5 章完整、第六章雛形',
            '1-13 章都寫了，少數章節粗',
            '全 13 章定稿級、跨章邏輯通',
        ],
    },
    {
        dim: 'B',
        title: '工具實體完成度',
        levels: [
            '還是 docx 上的題目',
            '有載具但版型亂',
            '載具完整可施測',
            '載具 + 知情同意 + 紀錄表都齊全',
        ],
    },
    {
        dim: 'C',
        title: 'Pilot 共識發現深度',
        note: '看 W11 Pilot 紀錄文件（短報不講 Pilot 段，由 Classroom 上的紀錄評分）',
        levels: [
            '寫「都沒發現」',
            '找出最弱題但沒講為什麼',
            '最弱題 + 全組合議出共通模式',
            '共識 + 具體證據（多人 partner 都卡）+ 已修正',
        ],
    },
    {
        dim: 'D',
        title: '報告清晰度',
        levels: [
            '念稿 / 超時 / 重點不明',
            '大致講清楚但散',
            '結構好、5 段都講到（含 3 篇文獻對話）',
            '結構好 + 自然不念稿 + 在 3 分鐘內',
        ],
    },
];

/* — 短報卡 5 段（學生 W11 結束課後在 Form 填）— */
/* 朗讀速率：高中生中速約 200 字/分鐘 ≈ 3.3 字/秒 → 30 秒 ~100 字、60 秒 ~200 字 */
/* 總時長 180 秒 = 15+20+30+90+25（文獻探討 3 篇佔最大塊：90 秒講 3 篇對話）*/
const REPORT_SECTIONS = [
    { idx: 1, time: '15 秒', title: '研究題目', desc: '一句話寫清楚——你要研究什麼', limit: '30 字內 ≈ 15 秒' },
    { idx: 2, time: '20 秒', title: '研究動機', desc: '為什麼想做這個——一句話的好奇或痛點', limit: '50 字內 ≈ 20 秒' },
    { idx: 3, time: '30 秒', title: '研究方法 + 工具實體', desc: '研究方法 + 工具實體類型（如「Google Form 25 題」）', limit: '80 字內 ≈ 30 秒' },
    { idx: 4, time: '90 秒', title: '文獻探討（3 篇對話）', desc: '3 篇關鍵文獻 — 比較不同專家觀點、呈現研究現況與未解決問題（每篇含 APA + 核心觀點 + 跟其他文獻或本研究的差異）', limit: '每篇 100 字 × 3 ≈ 90 秒（最大塊）' },
    { idx: 5, time: '25 秒', title: '目前進度', desc: '計畫書到哪 / 工具實體做到哪 / W11 Pilot 後修了什麼', limit: '80 字內 ≈ 25 秒' },
];

/* — 100 min 課堂流程（對齊學校 50/10/50 作息）— */
const LESSON_FLOW = [
    { time: '0:00-0:05', label: '開場 + 規則', desc: '邊聽可以邊填表；每組之間留 1 min 確保填完。', dur: 5 },
    { time: '0:05-0:40', label: 'Round 1：7 組短報', desc: '每組 5 min（3 短報 + 1 老師提問 + 1 緩衝填表）', dur: 35 },
    { time: '0:40-0:50', label: '緩衝', desc: '補填漏掉的回饋', dur: 10 },
    { time: '0:50-1:00', label: '⚠️ 下課', desc: '學校作息', dur: 10 },
    { time: '1:00-1:30', label: 'Round 2：6 組短報', desc: '同 Round 1 流程', dur: 30 },
    { time: '1:30-1:50', label: '老師總結 + 收尾', desc: '集體痛點 + W13 督促名單（評分私下給，不公告）', dur: 20 },
];

/* — ExportButton 欄位 — */
const EXPORT_FIELDS = [
    { key: 'w12-listening-takeaway', label: '聽完 12 組學到什麼', question: '哪一組的設計／Pilot 發現最讓你想回頭改自己的？' },
    { key: 'w12-self-revision', label: '我們組要改什麼', question: '同儕回饋 + 老師評分後，W13 前要修的具體項目' },
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
                        <Map size={12} /> <span className="hidden md:inline">{showLessonMap ? 'Hide Plan' : 'Instructor View'}</span>
                    </button>
                    <span className="hidden md:inline-block bg-[var(--ink)] text-white text-[10px] font-bold px-2 py-0.5 rounded-[2px] font-mono">AI-RED · D</span>
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
                title="期中進度短報 · "
                accentTitle="同儕擋板"
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
                { wk: 'W12', name: '期中短報\n同儕擋板', now: true },
                { wk: 'W13-W14', name: '執行 + 數據\n圖表結論' },
                { wk: 'W15-W17', name: '成果簡報\n博覽發表' },
            ]} />

            <TaskCard
                weekNumber="W12"
                weekTitle={W12Data.title}
                duration={`${W12Data.duration} 分鐘 · ${W12Data.durationDesc}`}
                tasks={[
                    '各組期中短報 — 3 min Pitch + 1 min QA',
                    '全班同儕回饋 Form — 6 漏洞勾選 + 30 字建議 + 30 字學到什麼',
                    '老師當場評分（4 維 × 4 級 = 16 分）',
                ]}
                exportReminder="收齊同儕回饋 → 下週調整研究設計依據"
            />

            {/* ═══ SCROLLING CONTENT ═══ */}
            <div className="mx-auto prose-zh space-y-6" style={{ maxWidth: 760 }}>

                {/* 入場警告 */}
                <div className="mt-2 p-5 rounded-[var(--radius-unified)] border-2 border-[#DC2626] bg-[#FEF2F2]">
                    <div className="flex items-start gap-3">
                        <AlertCircle size={24} className="text-[#DC2626] flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-[15px] font-bold text-[#991B1B] mb-2">⏰ 上課前先確認三件事</p>
                            <ol className="text-[12.5px] text-[#7F1D1D] leading-[1.85] list-decimal pl-5 space-y-1">
                                <li>全組已在 W11-W12 之間自約 30 min 合議完研究設計（題目 / 動機 / 方法 / 文獻 3 篇 / 進度 / 預期蒐集）</li>
                                <li>組長已在 <strong>今天 8:00 前</strong>填好短報 Google Form（沒填 = D 維度直接扣 4 分）</li>
                                <li>每位同學手機 / 筆電上課準備好——課堂內要填同儕回饋 Form 12 次</li>
                            </ol>
                        </div>
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

                {/* 三大課堂工具（每班老師獨立部署，連結走 GC）*/}
                <div>
                    <h3 className="font-serif text-[18px] md:text-[20px] font-bold text-[var(--ink)] mb-3">🔗 今天會用到的三個工具</h3>

                    <div className="bg-[#FEF3C7] border-2 border-[#D97706] rounded-[var(--radius-unified)] p-4 mb-4">
                        <p className="text-[13px] font-bold text-[#92400E] mb-1.5">⚠️ 連結要找你「自己班老師」發的</p>
                        <p className="text-[12.5px] text-[#78350F] leading-relaxed">
                            這個網頁全校共用，<strong>每班老師會建立自己班的 Form 和投影系統</strong>（避免兩班資料混在一起）。具體連結請到<strong className="text-[#92400E]">你自己班的 Google Classroom</strong> 找老師公告——<u>不要點別班同學分享的連結</u>，會填到別班老師的 Sheet。
                        </p>
                    </div>

                    <div className="space-y-3">
                        <ToolInfoCard
                            icon="📝"
                            title="① 短報 Google Form（W11 結束 → W12 上課前 8:00 截止）"
                            desc="組長代填。5 段內容：題目 / 動機 / 方法+工具 / 文獻探討（3 篇 APA + 對話）/ 目前進度。連結到自己班 GC 找。"
                        />
                        <ToolInfoCard
                            icon="🖥️"
                            title="② 投影 Web App（老師上課時投影）"
                            desc="各組短報內容輪播 + 計時器 + 即時同儕回饋彙整。報告者上台對著自己那頁講。連結老師上課會投影、不用學生點。"
                        />
                        <ToolInfoCard
                            icon="✏️"
                            title="③ 同儕回饋 Form（W12 課堂中填，每組 1 分鐘）"
                            desc={'3 題：漏洞勾選（6 選 1）+ 給該組一句具體建議（30 字）+ 我學到什麼（30 字）。13 組 → 每位同學填 12 次（不評自己）。連結到自己班 GC 找。📋 30 字「具體建議」三句式：「我發現___ → 建議改成___ → 理由___」。範例：「題 5 跟題 8 在問同個概念 → 建議刪題 8 → 受測者會疑惑」。'}
                        />
                    </div>
                </div>

                {/* 短報卡 5 段內容 */}
                <div>
                    <h3 className="font-serif text-[18px] md:text-[20px] font-bold text-[var(--ink)] mb-2">📄 你的短報卡 — 5 段 3 分鐘</h3>
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
                </div>

                {/* 評分基準 */}
                <div>
                    <h3 className="font-serif text-[18px] md:text-[20px] font-bold text-[var(--ink)] mb-2 flex items-center gap-2">
                        <Star size={18} className="text-[#EA580C]" /> 評分基準（4 維 × 4 級 = 16 分滿分）
                    </h3>
                    <div className="bg-[#FFFBEB] border border-[#FCD34D] rounded-[6px] p-3 mb-3 text-[12px] text-[#78350F] leading-relaxed">
                        ⚖️ <strong>評分分流：</strong>
                        <strong className="text-[#92400E]">A 維度</strong>看你 Classroom 上計畫書檔案實際狀態；
                        <strong className="text-[#92400E]">C 維度（Pilot 共識）</strong>看你 W11 Pilot 紀錄文件（短報不講 Pilot 段）；
                        <strong className="text-[#92400E]">B / D 維度</strong>主要看今天<strong>短報 5 段</strong>的表現。
                        <strong>意思：</strong>就算短報講得不錯，計畫書如果停在第六章雛形，A 還是會低分；W11 Pilot 紀錄空白，C 還是會低分。
                    </div>
                    <h3 className="hidden">
                    </h3>
                    <p className="text-[12.5px] text-[var(--ink-mid)] leading-relaxed mb-3">
                        老師現場記分、私下給組長（不公告排名）。<strong>13-16 ★★★★ ／ 9-12 ★★★ ／ 5-8 ★★ ／ 4 ★</strong>。分數 ≤ 8 的組 W13 前要找老師談。
                    </p>
                    <div className="space-y-2">
                        {RUBRIC.map((r) => (
                            <details key={r.dim} className="bg-white border border-[var(--border)] rounded-[var(--radius-unified)]">
                                <summary className="cursor-pointer px-4 py-2 text-[13px] font-bold text-[var(--ink)] flex items-center justify-between">
                                    <span><span className="text-[var(--accent)] mr-2">{r.dim}.</span>{r.title}</span>
                                    <span className="text-[11px] text-[var(--ink-light)] font-normal">展開 4 級 ▼</span>
                                </summary>
                                {r.note && (
                                    <p className="px-4 pb-2 text-[11.5px] text-[var(--ink-light)] italic leading-[1.7]">📌 {r.note}</p>
                                )}
                                <div className="px-4 pb-3 grid grid-cols-1 md:grid-cols-4 gap-2 text-[11.5px]">
                                    {r.levels.map((lv, i) => (
                                        <div key={i} className="bg-[var(--paper-warm)] border border-[var(--border)] rounded-[6px] p-2">
                                            <p className="font-bold text-[var(--ink)]">{i + 1} 分</p>
                                            <p className="text-[var(--ink-mid)] leading-[1.7] mt-0.5">{lv}</p>
                                        </div>
                                    ))}
                                </div>
                            </details>
                        ))}
                    </div>
                </div>

                {/* 同儕回饋紅線 */}
                <div className="p-4 rounded-[var(--radius-unified)] bg-[#F0FDF4] border-2 border-[#10B981]">
                    <p className="text-[14px] font-bold text-[#065F46] mb-2">📝 你聽 12 組短報時，每組要填 3 題（1 分鐘內）</p>
                    <ul className="text-[12.5px] text-[#047857] leading-[1.85] list-decimal pl-5 space-y-1">
                        <li><strong>這組最大的計畫漏洞是？</strong>（單選 6 個漏洞——下方定義）</li>
                        <li><strong>給這組一句具體建議</strong>（30 字內、必填）</li>
                        <li><strong>我從這組學到什麼？</strong>（30 字內、必填）</li>
                    </ul>

                    {/* 6 漏洞定義 — 對齊新短報 5 段內容 */}
                    <div className="mt-3 bg-white border border-[#10B981]/40 rounded-[var(--radius-unified)] p-3">
                        <p className="font-bold text-[12.5px] text-[#065F46] mb-2">🎯 6 個漏洞選項是什麼意思？（對齊短報 5 段：題目 / 動機 / 方法 / 文獻 / 進度）</p>
                        <div className="grid md:grid-cols-2 gap-2 text-[11.5px] leading-[1.75]">
                            <div className="bg-[var(--paper-warm)] rounded-[6px] p-2">
                                <p className="font-bold text-[var(--ink)]">① 題目模糊</p>
                                <p className="text-[var(--ink-mid)]">一句話講不清楚 / 範圍太大太小 / 抽象到無法操作</p>
                            </div>
                            <div className="bg-[var(--paper-warm)] rounded-[6px] p-2">
                                <p className="font-bold text-[var(--ink)]">② 動機不充分</p>
                                <p className="text-[var(--ink-mid)]">為什麼想做沒講清楚 / 動機跟題目連不起來</p>
                            </div>
                            <div className="bg-[var(--paper-warm)] rounded-[6px] p-2">
                                <p className="font-bold text-[var(--ink)]">③ 方法跟研究問題對不上</p>
                                <p className="text-[var(--ink-mid)]">想知道因果卻用問卷（只能看相關）；想知道感受卻用是非題（要訪談才深）</p>
                            </div>
                            <div className="bg-[var(--paper-warm)] rounded-[6px] p-2">
                                <p className="font-bold text-[var(--ink)]">④ 文獻沒對話</p>
                                <p className="text-[var(--ink-mid)]">3 篇都重複同一觀點 / 沒比較專家差異 / 沒講跟本研究的關係</p>
                            </div>
                            <div className="bg-[var(--paper-warm)] rounded-[6px] p-2">
                                <p className="font-bold text-[var(--ink)]">⑤ APA 格式錯誤</p>
                                <p className="text-[var(--ink-mid)]">引用格式不對 / 缺資訊（年、卷、頁碼）/ 3 篇格式不一致</p>
                            </div>
                            <div className="bg-[var(--paper-warm)] rounded-[6px] p-2">
                                <p className="font-bold text-[var(--ink)]">⑥ 進度落後或太籠統</p>
                                <p className="text-[var(--ink-mid)]">計畫書章節停在某段沒進展 / 工具實體還沒做出來 / 進度寫得太抽象</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-3 grid md:grid-cols-2 gap-2 text-[11.5px]">
                        <div className="bg-white border border-[#10B981]/40 rounded-[6px] p-2.5">
                            <p className="font-bold text-[#065F46] mb-1">✅ 接受的建議寫法</p>
                            <ul className="text-[#047857] leading-[1.8] list-disc pl-4 space-y-0.5">
                                <li>「題目「XX 行為」太抽象，建議改成可觀察的指標（漏洞①）」</li>
                                <li>「文獻 1 跟 3 都講同一件事，建議換一篇對立觀點（漏洞④）」</li>
                                <li>「APA 缺卷期頁碼——格式：作者(年)。篇名。期刊, 卷(期), 頁碼（漏洞⑤）」</li>
                            </ul>
                        </div>
                        <div className="bg-white border border-[#DC2626]/40 rounded-[6px] p-2.5">
                            <p className="font-bold text-[#991B1B] mb-1">❌ 不接受（不算分）</p>
                            <p className="text-[#7F1D1D] leading-[1.8]">「加油」「祝順利」「很棒」「不錯」「很好」這類沒內容的回饋——學到什麼也禁寫「都很棒」。</p>
                        </div>
                    </div>
                </div>

                {/* 流程地圖 */}
                <div>
                    <h3 className="font-serif text-[18px] md:text-[20px] font-bold text-[var(--ink)] mb-2 flex items-center gap-2">
                        <Clock size={18} /> 100 min 流程
                    </h3>
                    <div className="space-y-1.5">
                        {LESSON_FLOW.map((s, i) => (
                            <div key={i} className="flex gap-3 p-2.5 bg-white border border-[var(--border)] rounded-[6px] text-[12.5px]">
                                <span className="font-mono text-[11px] text-[var(--ink-light)] w-[80px] flex-shrink-0">{s.time}</span>
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-[var(--ink)]">{s.label} <span className="text-[10px] font-mono text-[var(--ink-light)] ml-1">{s.dur} min</span></p>
                                    <p className="text-[11.5px] text-[var(--ink-mid)] leading-[1.8] mt-0.5">{s.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 課後反思 */}
                <div className="space-y-3">
                    <h3 className="font-serif text-[18px] md:text-[20px] font-bold text-[var(--ink)] mb-2">📝 課後反思（聽完 12 組之後）</h3>
                    <ThinkRecord
                        dataKey="w12-listening-takeaway"
                        prompt="哪一組的設計／Pilot 發現最讓你想回頭改自己的？"
                        placeholder="例：第 7 組的 Pilot 發現受訪者把『家庭壓力』理解成『經濟壓力』——讓我想到我們組的『學習壓力』可能也有類似歧義。"
                        rows={4}
                    />
                    <ThinkRecord
                        dataKey="w12-self-revision"
                        prompt="同儕回饋 + 老師評分後，我們組 W13 前要修的具體項目是？"
                        defaultTemplate={'要修 1：\n  → 怎麼改：\n  → 期限：\n\n要修 2：\n  → 怎麼改：\n  → 期限：'}
                        placeholder="例：要修 1：第 5 題雙重問題（同儕第 8 票漏洞）→ 拆成兩題 → W13 前完成 Form 改版"
                        rows={6}
                    />
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
                                            '接住老師當場 4 維 × 4 級評分，識別自己的弱項',
                        ].map((item, i) => (
                            <div key={i} className="p-4 px-5 bg-white flex items-start gap-3">
                                <span className="text-[var(--success)] text-[16px] mt-0.5 flex-shrink-0">✓</span>
                                <span className="text-[13px] text-[var(--ink-mid)] leading-relaxed">{item}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <ExportButton
                    weekLabel="W12 期中進度短報"
                    fields={EXPORT_FIELDS}
                />

                {/* W13 預告 */}
                <div className="bg-[var(--ink)] border-l-4 border-[var(--accent)] p-5 md:p-6 rounded-r-lg text-white shadow-xl">
                    <span className="font-mono text-[11px] font-bold tracking-[0.2em] text-[var(--accent)] uppercase">W13 預告 · 中期盤點 + 資料收齊最後一週</span>
                    <div className="font-bold text-[17px] md:text-[18px] mt-2 mb-3 leading-tight">
                        最後衝刺週：W13 結束後不能再蒐集新資料
                    </div>
                    <ul className="text-[12.5px] text-white/85 leading-[1.95] space-y-1 pl-4">
                        <li>・依 W12 同儕回饋 + 老師評分修工具</li>
                        <li>・施測進度衝刺（如進度落後請找老師討論補救方案）</li>
                        <li>・W13 資料關帳清洗 → 進 W14 圖表分析</li>
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
