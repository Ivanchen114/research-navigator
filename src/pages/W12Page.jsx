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

/* — 100 min 課堂流程（對齊學校 50/10/50 作息）— */
const LESSON_FLOW = [
    { time: '0:00-0:05', label: '開場 + 規則', desc: '老師說明全堂規則：聽報告時就同步填回饋表，每組結束留 1 min 把沒填完的補完。', dur: 5 },
    { time: '0:05-0:40', label: 'Round 1：7 組短報', desc: '每組 5 min（3 短報 + 1 老師提問 + 1 補填）。確認同儕回饋 Form 連結就位——每組填一份，不評自己組。', dur: 35 },
    { time: '0:40-0:50', label: '緩衝', desc: '補填漏掉的回饋', dur: 10 },
    { time: '0:50-1:00', label: '⚠️ 下課', desc: '學校作息', dur: 10 },
    { time: '1:00-1:30', label: 'Round 2：6 組短報', desc: '同 Round 1 流程', dur: 30 },
    { time: '1:30-1:50', label: '老師總結 + 收尾', desc: '集體痛點 + W13 督促名單（評分私下給，不公告）', dur: 20 },
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
                    '全班同儕回饋 Form — 6 漏洞勾選 + 30 字建議 + 30 字學到什麼',
                ]}
                exportReminder="收齊同儕回饋 → 下週調整研究設計依據"
            />

            {/* ═══ SCROLLING CONTENT ═══ */}
            <div className="mx-auto prose-zh space-y-6" style={{ maxWidth: 760 }}>

                {/* 入場警告 */}
                <div className="mt-2 p-5 rounded-[var(--radius-unified)] border-2 border-[#DC2626] bg-[#FEF2F2]">
                    <div className="flex items-center gap-2 mb-3">
                        <AlertCircle size={20} className="text-[#DC2626] flex-shrink-0" />
                        <ContentTypeChip type="注意" />
                        <p className="text-[15px] font-bold text-[#991B1B]">⏰ 上課前先確認三件事</p>
                    </div>
                    <div className="space-y-2">
                        {/* 項目 1 */}
                        <div className="flex gap-3 bg-[#FEE2E2] rounded-lg p-3">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#DC2626] text-white text-[12px] font-bold flex items-center justify-center">1</span>
                            <div>
                                <p className="text-[13.5px] font-bold text-[#7F1D1D]">⚠️ 計劃書＋工具書已繳交至小組作業區</p>
                                <p className="text-[11.5px] text-[#991B1B] mt-0.5">明天截止——今天沒繳、明天補繳算遲交，老師批改期中成績用</p>
                            </div>
                        </div>
                        {/* 項目 2 */}
                        <div className="flex gap-3 bg-[#FEE2E2] rounded-lg p-3">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#DC2626] text-white text-[12px] font-bold flex items-center justify-center">2</span>
                            <div>
                                <p className="text-[13.5px] font-bold text-[#7F1D1D]">報告前填好短報 Google Form</p>
                                <p className="text-[11.5px] text-[#991B1B] mt-0.5">沒填 = 無法報告 = 沒有期中成績</p>
                            </div>
                        </div>
                        {/* 項目 3 */}
                        <div className="flex gap-3 bg-[#FEE2E2] rounded-lg p-3">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#DC2626] text-white text-[12px] font-bold flex items-center justify-center">3</span>
                            <div>
                                <p className="text-[13.5px] font-bold text-[#7F1D1D]">手機上課準備好</p>
                                <p className="text-[11.5px] text-[#991B1B] mt-0.5">課堂內要填同儕回饋 Form——每組一份，不評自己組</p>
                            </div>
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
                            desc={'3 題：漏洞勾選（6 選 1）+ 給該組一句具體建議（30 字）+ 我學到什麼（30 字）。每組填一份（不評自己組）。連結到自己班 GC 找。'}
                        />
                    </div>
                </div>

                {/* 同儕回饋紅線 */}
                <div className="p-4 rounded-[var(--radius-unified)] bg-[#F0FDF4] border-2 border-[#10B981]">
                    <div className="flex items-center gap-2 mb-2">
                        <ContentTypeChip type="做" />
                        <p className="text-[14px] font-bold text-[#065F46]">📝 每聽完一組短報，填 3 題（1 分鐘內，不評自己組）</p>
                    </div>
                    <ul className="text-[12.5px] text-[#047857] leading-[1.85] list-decimal pl-5 space-y-1">
                        <li><strong>這組最大的計畫漏洞是？</strong>（單選 6 個漏洞——下方定義）</li>
                        <li><strong>給這組一句具體建議</strong>（30 字內、必填）</li>
                        <li><strong>我從這組學到什麼？</strong>（30 字內、必填）</li>
                    </ul>

                    {/* 30 字三句式範本（放在「給建議」說明旁）*/}
                    <div className="mt-3 bg-white border border-[#10B981]/40 rounded-[var(--radius-unified)] p-3">
                        <p className="font-bold text-[12.5px] text-[#065F46] mb-1">📋 第 2 題「30 字具體建議」三句式</p>
                        <p className="text-[11.5px] text-[#047857] leading-[1.85]">
                            「<strong>我發現___ → 建議改成___ → 理由___</strong>」。範例：「題 5 跟題 8 在問同個概念 → 建議刪題 8 → 受測者會疑惑」。
                        </p>
                    </div>

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
                                <p className="text-[var(--ink-mid)]">計畫書章節停在某段沒進展 / 本組工具設計書還沒做出來 / 進度寫得太抽象</p>
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

                {/* 評分規準 */}
                <div className="bg-white border border-[var(--border)] rounded-[var(--radius-unified)] overflow-hidden">
                    <div className="px-5 py-3 bg-[var(--ink)] flex items-center gap-2">
                        <span className="text-white font-bold text-[13px]">📊 W12 上課分數評分規準</span>
                        <span className="ml-auto text-white/60 text-[11px] font-mono">同儕回饋 Form 內容 + 參與度</span>
                    </div>
                    <div className="p-5 space-y-5">
                        {/* 份數 */}
                        <div>
                            <p className="font-bold text-[13px] text-[var(--ink)] mb-2">① 回饋份數（量）</p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                                {[
                                    { level: '✅ 滿分', desc: '12 組全填（每組都給回饋）', color: 'border-[var(--success)] bg-[#F0FDF4] text-[var(--success)]' },
                                    { level: '🟡 及格', desc: '至少填 10 組', color: 'border-[#D97706] bg-[#FFFBEB] text-[#92400E]' },
                                    { level: '❌ 低分', desc: '少於 10 組', color: 'border-[#DC2626] bg-[#FEF2F2] text-[#991B1B]' },
                                ].map(({ level, desc, color }) => (
                                    <div key={level} className={`border rounded p-3 ${color}`}>
                                        <p className="font-bold text-[12px] mb-0.5">{level}</p>
                                        <p className="text-[11.5px] leading-relaxed">{desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 品質 */}
                        <div>
                            <p className="font-bold text-[13px] text-[var(--ink)] mb-2">② 回饋品質（老師會抽查 3–5 份）</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div className="border-2 border-[#DC2626] bg-[#FEF2F2] rounded p-3">
                                    <p className="font-bold text-[12px] text-[#991B1B] mb-2">❌ 不計分——空洞型回饋</p>
                                    <ul className="text-[12px] text-[#7F1D1D] leading-[1.85] space-y-1">
                                        <li>・只寫「加油」「很棒」「不錯」→ 不計</li>
                                        <li>・「計畫漏洞」全部不勾 → 扣分</li>
                                        <li>・「我從這組學到什麼」少於 15 字 → 不計</li>
                                        <li>・複製貼上同一句話給每組 → 不計</li>
                                    </ul>
                                </div>
                                <div className="border-2 border-[var(--success)] bg-[#F0FDF4] rounded p-3">
                                    <p className="font-bold text-[12px] text-[var(--success)] mb-2">✅ 計分——具體型回饋</p>
                                    <ul className="text-[12px] text-[#065F46] leading-[1.85] space-y-1">
                                        <li>・「計畫漏洞」勾選具體類別並說明原因</li>
                                        <li>・「我學到什麼」提到對方問題 + 遷移到自己組</li>
                                        <li>・「具體建議」援引課堂概念（W3/W9 等）加分</li>
                                        <li>・文字有自己的觀察，不只勾選選項</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* 總結 */}
                        <div className="bg-[var(--paper-warm)] rounded p-3 border border-[var(--border)]">
                            <p className="text-[12px] text-[var(--ink-mid)] leading-[1.85]">
                                💡 <strong>評分邏輯</strong>：老師看的不是你填了幾格，是你的回饋對那組有沒有幫助。一份有洞察的具體回饋，比十份「加油」值錢。
                            </p>
                        </div>
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
