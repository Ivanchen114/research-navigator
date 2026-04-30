import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import CourseArc from '../components/ui/CourseArc';
import HeroBlock from '../components/ui/HeroBlock';
import LessonMap from '../components/ui/LessonMap';
import './W12.css';
import ThinkRecord from '../components/ui/ThinkRecord';
import AIREDNarrative from '../components/ui/AIREDNarrative';
import ExportButton from '../components/ui/ExportButton';
import ResetWeekButton from '../components/ui/ResetWeekButton';
import { readRecords } from '../components/ui/ThinkRecord';
import { W12Data } from '../data/lessonMaps';
import {
    ArrowRight,
    ArrowLeft,
    AlertCircle,
    ExternalLink,
    Clock,
    Star,
    Map,
} from 'lucide-react';

/* ══════════════════════════════════════
 *  外部連結 — 老師部署完 Apps Script / Google Form 後在這裡填入
 *  部署 SOP 見 outputs/W12_期中短報_部署SOP.docx
 * ══════════════════════════════════════ */
const REPORT_FORM_URL = '';        // 短報 Google Form（學生 W11 結束課後填）
const PEER_FEEDBACK_FORM_URL = ''; // 同儕回饋 Google Form（W12 課堂填）
const PRESENTATION_WEB_APP_URL = ''; // Apps Script Web App（老師投影）

/* ══════════════════════════════════════
 *  資料常數
 * ══════════════════════════════════════ */

/* — 評分基準（5 維 × 4 級）— */
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
        levels: [
            '寫「都沒發現」',
            '找出最弱題但沒講為什麼',
            '最弱題 + 全組合議出共通模式',
            '共識 + 具體證據（多人 partner 都卡）+ 已修正',
        ],
    },
    {
        dim: 'D',
        title: 'Plan B 具體度',
        levels: [
            '沒寫或只寫「會努力」',
            '提了風險但沒應變',
            '風險 + 應變但沒期限',
            '情境 + 應變 + 期限三件齊備',
        ],
    },
    {
        dim: 'E',
        title: '報告清晰度',
        levels: [
            '念稿 / 超時 / 重點不明',
            '大致講清楚但散',
            '結構好、5 段都講到',
            '結構好 + 自然不念稿 + 在 3 分鐘內',
        ],
    },
];

/* — 短報卡 5 段（學生 W11 結束課後在 Form 填）— */
const REPORT_SECTIONS = [
    { idx: 1, time: '30 秒', title: '題目 + 動機', desc: '一句話研究題目 + 一句話為什麼想做', limit: '各 50 字' },
    { idx: 2, time: '30 秒', title: '方法 + 工具', desc: '研究方法 + 工具實體類型（如「Google Form 25 題」）', limit: '80 字' },
    { idx: 3, time: '60 秒', title: 'Pilot 共識發現', desc: '全組合議的 1-2 個共通工具弱點 + 已修正什麼', limit: '200 字' },
    { idx: 4, time: '30 秒', title: '目前進度', desc: '計畫書到哪／工具實體做到哪', limit: '80 字' },
    { idx: 5, time: '30 秒', title: '預期蒐集 + Plan B', desc: '樣本目標／時程／Plan B 一句話', limit: '100 字' },
];

/* — 100 min 課堂流程 — */
const LESSON_FLOW = [
    { time: '0:00-0:05', label: '開場 + 規則說明', desc: 'Pitch 模板說明、計時器示範、同儕 Form 假人示範填法', dur: 5 },
    { time: '0:05-0:35', label: 'Round 1：6 組短報（3+1）', desc: '每組 3 分鐘短報 + 1 分鐘老師選題提問；同儕同步在 Form 填回饋', dur: 30 },
    { time: '0:35-0:40', label: '中場休息', desc: '舒緩 + 同儕回饋補填', dur: 5 },
    { time: '0:40-1:15', label: 'Round 2：7 組短報（3+1）', desc: '同 Round 1', dur: 35 },
    { time: '1:15-1:30', label: '老師總評 + 評分公告', desc: '集體痛點整理 + W13 督促名單 + 評分張貼', dur: 15 },
    { time: '1:30-1:40', label: 'Buffer', desc: '萬一拖時間用', dur: 10 },
];

/* — ExportButton 欄位 — */
const EXPORT_FIELDS = [
    { key: 'w12-listening-takeaway', label: '聽完 12 組學到什麼', question: '哪一組的設計／Pilot 發現最讓你想回頭改自己的？' },
    { key: 'w12-self-revision', label: '我們組要改什麼', question: '同儕回饋 + 老師評分後，W13 前要修的具體項目' },
    { key: 'w12-aired-record', label: 'W12 AIRED 敘事', question: '本週 AI 互動（含 W11 → W12 之間的合議）' },
];

/* ══════════════════════════════════════
 *  外部連結卡
 * ══════════════════════════════════════ */
const ExternalLinkCard = ({ url, title, desc, icon, color }) => {
    const isReady = !!url;
    return (
        <div className={`p-4 rounded-[var(--radius-unified)] border-2 ${isReady ? `border-[${color}]` : 'border-dashed border-[var(--border)]'} ${isReady ? 'bg-white' : 'bg-[var(--paper-warm)]'}`}>
            <div className="flex items-start gap-3">
                <span className="text-[24px] flex-shrink-0">{icon}</span>
                <div className="flex-1 min-w-0">
                    <p className="font-bold text-[14px] text-[var(--ink)] mb-1">{title}</p>
                    <p className="text-[12px] text-[var(--ink-mid)] leading-relaxed mb-2">{desc}</p>
                    {isReady ? (
                        <a href={url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[12px] font-bold text-[var(--accent)] no-underline hover:underline">
                            開啟連結 <ExternalLink size={12} />
                        </a>
                    ) : (
                        <p className="text-[11.5px] text-[var(--ink-light)] italic">⏳ 老師尚未部署完成；上課前會在 Google Classroom 公告連結。</p>
                    )}
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
                accentTitle="13 組 × 同儕擋板"
                subtitle="正式施測前的最後一道擋板。每組 3 分鐘短報 + 1 分鐘老師選題提問。同學透過 Google Form 即時回饋你的計畫漏洞——你看不到的，30 個聽眾總有人看出。"
                meta={[
                    { label: '第一節', value: '開場 5 + Round 1 六組短報 30 + 中場 5（共 40 min，後 10 min 銜接 R2）' },
                    { label: '第二節', value: 'Round 2 七組短報 35 + 老師總評 15' },
                    { label: '課堂產出', value: '13 組短報投影 + 全班同儕回饋 Form + 老師當場評分' },
                    { label: '前置要求', value: 'W11 結束 7 天內全組合議 + 組長已填短報 Form（W12 上課前 8:00 截止）' },
                ]}
            />

            <CourseArc items={[
                { wk: 'W1-W2', name: '探索階段\nRED公約', past: true },
                { wk: 'W3-W4', name: '題目診斷\n博覽會', past: true },
                { wk: 'W5-W7', name: '規劃分流\n企劃定案', past: true },
                { wk: 'W8-W11', name: '工具設計\n預試倫理', past: true },
                { wk: 'W12', name: '期中短報\n同儕擋板', now: true },
                { wk: 'W13-W14', name: '執行 + 數據\n圖表結論' },
                { wk: 'W15-W17', name: '成果簡報\n博覽發表' },
            ]} />

            {/* ═══ SCROLLING CONTENT ═══ */}
            <div className="mx-auto prose-zh space-y-6" style={{ maxWidth: 760 }}>

                {/* 入場警告 */}
                <div className="mt-2 p-5 rounded-[var(--radius-unified)] border-2 border-[#DC2626] bg-[#FEF2F2]">
                    <div className="flex items-start gap-3">
                        <AlertCircle size={24} className="text-[#DC2626] flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-[15px] font-bold text-[#991B1B] mb-2">⏰ 上課前先確認三件事</p>
                            <ol className="text-[12.5px] text-[#7F1D1D] leading-[1.85] list-decimal pl-5 space-y-1">
                                <li>全組已在 W11-W12 之間自約 30 min 合議出 Pilot 共識發現</li>
                                <li>組長已在 <strong>今天 8:00 前</strong>填好短報 Google Form（沒填 = E 維度直接扣 4 分）</li>
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

                {/* 三大課堂連結 */}
                <div>
                    <h3 className="font-serif text-[18px] md:text-[20px] font-bold text-[var(--ink)] mb-3">🔗 今天會用到的三個連結</h3>
                    <div className="space-y-3">
                        <ExternalLinkCard
                            icon="📝"
                            title="① 短報 Google Form（W11 結束 → W12 上課前 8:00 截止）"
                            desc="組長代填。5 段內容：題目+動機 / 方法+工具 / Pilot 共識 / 進度 / 預期+Plan B。"
                            url={REPORT_FORM_URL}
                            color="#0284C7"
                        />
                        <ExternalLinkCard
                            icon="🖥️"
                            title="② 投影 Web App（老師上課時投影）"
                            desc="13 組短報內容輪播 + 計時器 + 即時同儕回饋彙整。報告者上台對著自己那頁講。"
                            url={PRESENTATION_WEB_APP_URL}
                            color="#7C3AED"
                        />
                        <ExternalLinkCard
                            icon="✏️"
                            title="③ 同儕回饋 Form（W12 課堂中填，每組 1 分鐘）"
                            desc="3 題：漏洞勾選（5 選 1）+ 給該組一句具體建議（30 字）+ 我學到什麼（30 字）。每位同學要填 12 次（不評自己）。"
                            url={PEER_FEEDBACK_FORM_URL}
                            color="#10B981"
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

                {/* 小組合議鷹架 */}
                <div className="p-4 rounded-[var(--radius-unified)] bg-[#FFFBEB] border-2 border-[#D97706]">
                    <p className="text-[14px] font-bold text-[#92400E] mb-2">🪜 Pilot 共識合議鷹架（W11 結束後 30 min 自約完成）</p>
                    <p className="text-[12.5px] text-[#78350F] leading-[1.85] mb-3">
                        小組 4 人各自跨方法 1 對 1 Pilot、partner 不同、發現各異——「合議」就是把這些攤開找共通模式：
                    </p>
                    <ol className="text-[12.5px] text-[#78350F] leading-[1.85] list-decimal pl-5 space-y-1.5">
                        <li><strong>攤開</strong>：每人寫下自己 Pilot 最痛的 1 個發現（10 min）</li>
                        <li><strong>找共識</strong>：哪個發現「不只我這個 partner 卡住、別人 partner 也類似」？這就是工具弱點，不是個人偏差（10 min）</li>
                        <li><strong>寫共識（200 字內）</strong>：「我們組共通弱點是 [X]、證據 [A 同學 B 同學 partner 都卡題 5]、已修正 [改成 ___]」（10 min）</li>
                    </ol>
                    <p className="text-[11.5px] text-[#92400E] italic mt-2 pt-2 border-t border-[#D97706]/30">
                        💡 全組覺得「都沒發現」？回 W11 Step 3 用「AI 反向質問鷹架」——AI 一定挑得出 3 點。
                    </p>
                </div>

                {/* 評分基準 */}
                <div>
                    <h3 className="font-serif text-[18px] md:text-[20px] font-bold text-[var(--ink)] mb-2 flex items-center gap-2">
                        <Star size={18} className="text-[#EA580C]" /> 評分基準（5 維 × 4 級 = 20 分滿分）
                    </h3>
                    <p className="text-[12.5px] text-[var(--ink-mid)] leading-relaxed mb-3">
                        老師當場給分當壓力槓桿。<strong>17-20 ★★★★ ／ 13-16 ★★★ ／ 9-12 ★★ ／ 5-8 ★</strong>。分數 ≤ 12 的組 W13 前要找老師談。
                    </p>
                    <div className="space-y-2">
                        {RUBRIC.map((r) => (
                            <details key={r.dim} className="bg-white border border-[var(--border)] rounded-[var(--radius-unified)]">
                                <summary className="cursor-pointer px-4 py-2 text-[13px] font-bold text-[var(--ink)] flex items-center justify-between">
                                    <span><span className="text-[var(--accent)] mr-2">{r.dim}.</span>{r.title}</span>
                                    <span className="text-[11px] text-[var(--ink-light)] font-normal">展開 4 級 ▼</span>
                                </summary>
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
                        <li><strong>這組最大的計畫漏洞是？</strong>（單選 5 個漏洞選項）</li>
                        <li><strong>給這組一句具體建議</strong>（30 字內、必填）</li>
                        <li><strong>我從這組學到什麼？</strong>（30 字內、必填）</li>
                    </ul>
                    <div className="mt-3 grid md:grid-cols-2 gap-2 text-[11.5px]">
                        <div className="bg-white border border-[#10B981]/40 rounded-[6px] p-2.5">
                            <p className="font-bold text-[#065F46] mb-1">✅ 接受的建議寫法</p>
                            <ul className="text-[#047857] leading-[1.8] list-disc pl-4 space-y-0.5">
                                <li>「建議把 Q5 拆兩題，你問的是兩件事（W9 雙重問題）」</li>
                                <li>「Plan B 要寫期限——『改線上訪談』要訂 W13 中前完成」</li>
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

                {/* AIRED */}
                <AIREDNarrative week="12" hint="本週重點 AI 互動：W11→W12 之間 AI 反向質問（如有用）／合議時 AI 輔助整理共識" optional={false} />

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
                        <li>・施測進度衝刺（依你今天的 Plan B 啟動條件）</li>
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
