import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import CourseArc from '../components/ui/CourseArc';
import './ToolDesignPage.css';
import { ArrowRight, ClipboardList, Mic, TestTube2, Camera, FileSearch, Map, ShieldAlert, Stethoscope, Users, PenLine, Presentation, CheckCircle2 } from 'lucide-react';
import LessonMap from '../components/ui/LessonMap';
import { W8Data } from '../data/lessonMaps';

/* ─── 示範壞題資料 ─── */
const demoBadQuestions = [
    {
        method: '📋 問卷',
        bad: '你是否覺得睡眠品質很差，而且這讓你在學校很難集中注意力？',
        diagnosis: '一題問了兩件事（睡眠品質 + 注意力），受訪者無法只回答一個'
    },
    {
        method: '🎤 訪談',
        bad: '你壓力大嗎？為什麼？你怎麼解決？解決後有效嗎？',
        diagnosis: '四個問題塞在一起，受訪者不知道回答哪個、訪談無法深入'
    },
    {
        method: '👁 觀察',
        bad: '觀察學生是否在思考',
        diagnosis: '「思考」是內在狀態，無法直接觀察；應改為外顯行為（視線停留 10 秒、用筆書寫）'
    },
    {
        method: '🧪 實驗',
        bad: '全班都聽音樂讀書，一個月後發現成績進步',
        diagnosis: '沒有對照組，無法排除「練習效應」等其他原因'
    },
    {
        method: '📚 文獻',
        bad: '根據某部落格文章，熬夜會讓記憶力下降 50%',
        diagnosis: '來源不可信（非學術來源），數據無法查證'
    }
];

/* ─── 診斷規準速查 ─── */
const diagCriteriaA = [
    { no: '1', q: '每題只問一件事', iv: '使用開放式問題', ob: '觀察外顯可見的行為' },
    { no: '2', q: '選項完整且互不重疊', iv: '一次只問一件事', ob: '有操作型定義' },
    { no: '3', q: '無引導性語氣', iv: '不預設答案', ob: '時段與地點明確' },
    { no: '4', q: '量尺前後一致', iv: '設計追問問題', ob: '不干擾被觀察者' },
    { no: '5', q: '受訪者能回答', iv: '問具體情境', ob: '記錄方式清楚（畫記/計數）' },
];
const diagCriteriaB = [
    { no: '1', ex: '有操作型定義（變項可測量）', lit: '來源可信（學術期刊、政府報告）' },
    { no: '2', ex: '有對照組', lit: '有篩選標準（關鍵字、年份、來源類型）' },
    { no: '3', ex: '控制干擾變項（時間、環境一致）', lit: '涵蓋正反觀點（避免確認偏誤）' },
    { no: '4', ex: '測量方式客觀（數據而非感覺）', lit: '時效性合理（近 5–10 年）' },
    { no: '5', ex: '可重複執行（足夠樣本數）', lit: '忠實呈現原意（不斷章取義）' },
];

/* ─── 五大工具的錯誤類型與解藥 (保留原有互動地雷卡) ─── */
const methodPitfalls = {
    questionnaire: {
        id: 'questionnaire',
        icon: <ClipboardList size={20} />,
        name: '問卷法 (Questionnaire)',
        subtitle: '量表設計的毒點',
        errors: [
            { name: '誘導性提問', desc: '題目暗示了想要聽到的「正確答案」', consequence: '收到的回答有嚴重偏差，信度破產', bad: '「你同意手機會嚴重傷害睡眠嗎？」', good: '「你認為手機對睡眠的影響是？」' },
            { name: '選項不互斥', desc: '選項之間有重疊，填答者無所適從', consequence: '資料無法歸類，統計困難', bad: 'A. 0-10分 B. 10-20分 (那 10分 算哪個？)', good: 'A. 0-9分 B. 10-19分 C. 20分以上' },
            { name: '雙重問題', desc: '一題裡面同時問了兩件不同的事情', consequence: '不知道受訪者是在同意後半段還是前半段', bad: '「你覺得校規太多且不合理嗎？」', good: '拆成兩題：「校規數量適當嗎？」、「校規內容合理嗎？」' },
        ]
    },
    interview: {
        id: 'interview',
        icon: <Mic size={20} />,
        name: '訪談法 (Interview)',
        subtitle: '提問設計的毒點',
        errors: [
            { name: '封閉型提問', desc: '只能回答「是/否」，無法引導多說', consequence: '訪談三分鐘就結束，得不到深入資料', bad: '「你覺得讀書壓力很大嗎？」(答：對)', good: '「可不可以跟我分享一個最近壓力大或很輕鬆的經驗？」' },
            { name: '評斷性質詢', desc: '語氣帶有批判、質疑或高高在上', consequence: '受訪者產生防衛心，不願說出真心話', bad: '「你明明要考試，為什麼還要滑手機？」', good: '「準備考試時，通常是什麼原因會讓你想拿起手機？」' },
            { name: '連續轟炸提問', desc: '一口氣問了 3 個以上的連環問題', consequence: '受訪者腦袋當機，只會回答最後一個', bad: '「你幾點睡？睡前都在幹嘛？會覺得累嗎？」', good: '一次只問一題，等對方說完再追問。' },
        ]
    },
    experiment: {
        id: 'experiment',
        icon: <TestTube2 size={20} />,
        name: '實驗法 (Experiment)',
        subtitle: '實驗設計的毒點',
        errors: [
            { name: '干擾變項未控制', desc: '除了你想測的變數外，還有其他因素在影響', consequence: '無法證明因果關係', bad: '測驗「聽音樂是否提高專注力」，但兩組學生在不同時間（早/午）測。', good: '確保兩組都在「同一時間、同一溫度」下進行。' },
            { name: '缺乏對照組', desc: '只有實驗組，沒有沒接受干預的對照組', consequence: '不知道結果是不是自然發生的（安慰劑效應）', bad: '所有人每天喝人參茶，一個月後發現精神變好。', good: '一半喝人參茶（實驗組），一半喝安慰劑（對照組）。' },
            { name: '測量不客觀', desc: '實驗結果是由實驗者「主觀感覺」評分', consequence: '存在實驗者偏見', bad: '觀察者「覺得」這組學生比較專心。', good: '使用標準化專注力測驗考卷來計算分數。' },
        ]
    },
    observation: {
        id: 'observation',
        icon: <Camera size={20} />,
        name: '觀察法 (Observation)',
        subtitle: '紀錄方式的毒點',
        errors: [
            { name: '主觀推論紀錄', desc: '寫下觀察者的「感覺」而非客觀行為', consequence: '資料不客觀，淪為看圖說故事', bad: '「同學 A 看起來很生氣地敲桌子。」', good: '「同學 A 用力敲擊桌面 3 次，且眉頭深鎖。」' },
            { name: '觀察者效應', desc: '被觀察者發現你在看他，表現得和平常不同', consequence: '看到的是假象', bad: '老師站在學生旁邊觀察他有沒有專心。', good: '採自然觀察法，讓受觀察者習慣你的存在。' },
            { name: '指標定義模糊', desc: '要觀察的行為沒有明確的界定標準', consequence: '不同觀察者記錄出不同結果', bad: '觀察學生「幾次不專心」。', good: '定義：視線離開課本連續超過 10 秒即記一次。' },
        ]
    },
    literature: {
        id: 'literature',
        icon: <FileSearch size={20} />,
        name: '文獻法 (Literature)',
        subtitle: '資料選用的毒點',
        errors: [
            { name: '來源不可信', desc: '引用了未經查證的內容農場或個人網誌', consequence: '整篇論文基石崩塌，論點無效', bad: '「根據每日頭條報導，少睡四小時會變笨。」', good: '引用「台灣心理學刊」或「WHO」官方數據。' },
            { name: '斷章取義', desc: '只挑有利句子，扭曲了原作者本意', consequence: '違反學術倫理，構成學術不端', bad: '原文：「適量咖啡因有益但過量心悸。」你只引前半句。', good: '客觀呈現文獻的正反面限制。' },
            { name: '時效性過舊', desc: '引用了十幾年前的科技或社會數據', consequence: '現況早已變，數據無法支持論點', bad: '在 2024 年研究社群，引用 2005 年 MSN 研究。', good: '盡量尋找近 5-10 年內的文獻。' },
        ]
    }
};

export const ToolDesignPage = () => {
    const [activeMethod, setActiveMethod] = useState('questionnaire');
    const [showLessonMap, setShowLessonMap] = useState(false);

    const currentMethod = methodPitfalls[activeMethod];

    return (
        <div className="page-container animate-in-fade-slide">

            {/* TOP BAR */}
            <div className="flex items-center justify-between border-b border-[#dddbd5] pb-4 mb-16">
                <div className="text-[11px] font-mono text-[#8888aa] flex items-center gap-2">
                    研究方法與專題 / 資料蒐集 / <span className="text-[#1a1a2e] font-bold">研究工具診所 W9</span>
                </div>
                <div className="flex items-center gap-4">
                    <span className="bg-[#f0ede6] text-[#1a1a2e] text-[10px] font-bold px-2 py-0.5 rounded-[2px] font-mono">100 MINS</span>
                    <button
                        onClick={() => setShowLessonMap(!showLessonMap)}
                        className="text-[11px] text-[#8888aa] hover:text-[#2d5be3] transition-colors flex items-center gap-1 font-mono"
                    >
                        <Map size={12} /> {showLessonMap ? 'Hide Plan' : 'Instructor View'}
                    </button>
                    <span className="bg-[#1a1a2e] text-white text-[10px] font-bold px-2 py-0.5 rounded-[2px] font-mono">AI-RED · D</span>
                </div>
            </div>

            {showLessonMap && (
                <div className="animate-in slide-in-from-top-4 duration-300 mb-12">
                    <LessonMap data={W8Data} />
                </div>
            )}

            {/* PAGE HEADER */}
            <div className="max-w-[800px] mb-16">
                <div className="text-[#2d5be3] font-mono text-[11px] font-bold tracking-widest uppercase mb-4">🩺 W9 · 資料蒐集</div>
                <h1 className="font-serif text-[42px] font-bold leading-[1.2] text-[#1a1a2e] mb-6 tracking-[-0.01em]">
                    研究工具診所 Level 2：<span className="text-[#2d5be3]">品質診斷與修改</span>
                </h1>
                <p className="text-[16px] text-[#4a4a6a] leading-relaxed mb-8">
                    帶著 W8 的 3 題草稿走進診所。今天你要學會用診斷規準發現自己哪裡「錯」，互相診斷對方的草稿，然後修改擴充成 5–10 題的完整研究工具。
                </p>

                {/* GAME BANNER */}
                <div className="bg-[#1a1a2e] border-l-4 border-[#e11d48] p-6 rounded-r-lg mb-10 text-white shadow-xl">
                    <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                        <ShieldAlert className="text-[#e11d48]" size={20} />
                        即刻報到：行動代號防線
                    </h3>
                    <p className="text-[#8888aa] text-sm mb-4">
                        這是一場防禦戰！深入 10 個充滿致命設計缺陷的研究病例。揪出錯誤並開立正確處方，確保研究方法無懈可擊。
                    </p>
                    <Link to="/game/rx-inspector" className="inline-flex items-center gap-2 bg-[#e11d48] text-white px-4 py-2 rounded font-bold text-sm hover:bg-[#c4163c] transition-colors">
                        進入遊戲系統 <ArrowRight size={14} />
                    </Link>
                </div>

                {/* Course Arc */}
                <CourseArc items={W8Data.courseArc} />
            </div>

            {/* META STRIP */}
            <div className="w8-meta-strip">
                <div className="w8-meta-item">
                    <div className="w8-meta-label">第一節</div>
                    <div className="w8-meta-value">示範診斷 × 互相診斷</div>
                </div>
                <div className="w8-meta-item">
                    <div className="w8-meta-label">第二節</div>
                    <div className="w8-meta-value">精修 × 完成初版工具</div>
                </div>
                <div className="w8-meta-item">
                    <div className="w8-meta-label">前置要求</div>
                    <div className="w8-meta-value">W8 Part D 的 3 題草稿</div>
                </div>
                <div className="w8-meta-item">
                    <div className="w8-meta-label">課堂產出</div>
                    <div className="w8-meta-value">修改後 5–10 題初版工具</div>
                </div>
            </div>

            {/* ═══════ TASK 1：開場 ═══════ */}
            <section>
                <div className="w8-section-head">
                    <h2 className="w8-section-title">課堂流程</h2>
                    <div className="w8-section-line"></div>
                    <span className="w8-section-tag">IN-CLASS</span>
                </div>

                <div className="grid gap-6">

                    {/* TASK 1 — 開場 */}
                    <div className="w8-task-block">
                        <div className="w8-task-hd">
                            <span className="w8-task-badge">TASK 1</span>
                            <span className="w8-task-title">開場：確認草稿到位</span>
                            <span className="text-[11px] text-[#8888aa] font-mono ml-auto">5 min</span>
                        </div>
                        <div className="w8-task-body">
                            <p className="text-[14px] text-[#4a4a6a] mb-3">確認每位學生帶著 W8 Part D 的 3 題草稿進教室。沒帶的先用 5 分鐘默寫一題。</p>
                            <div className="bg-[#f8f7f4] border border-[#dddbd5] rounded-lg p-4 text-[13px] text-[#4a4a6a]">
                                <strong className="text-[#1a1a2e]">📢 本節三步驟：</strong>
                                <span className="ml-2">① 老師示範怎麼診斷 → ② 你們互相診斷 → ③ 第二節自己修改</span>
                            </div>
                        </div>
                    </div>

                    {/* TASK 2 — 教師示範診斷 */}
                    <div className="w8-task-block">
                        <div className="w8-task-hd">
                            <span className="w8-task-badge">TASK 2</span>
                            <span className="w8-task-title">教師示範診斷：三個典型壞題</span>
                            <span className="text-[11px] text-[#8888aa] font-mono ml-auto">15 min</span>
                        </div>
                        <div className="w8-task-body">
                            <p className="text-[14px] text-[#4a4a6a] mb-4">每種方法各示範 1 個典型壞題，帶全班走一遍「哪裡有問題？哪條規準？怎麼修？」</p>

                            <div className="overflow-x-auto">
                                <table className="w-full text-[13px] border-collapse">
                                    <thead>
                                        <tr className="bg-[#1a1a2e] text-white">
                                            <th className="p-3 text-left font-bold rounded-tl-lg">方法</th>
                                            <th className="p-3 text-left font-bold">壞題示範</th>
                                            <th className="p-3 text-left font-bold rounded-tr-lg">診斷出的問題</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {demoBadQuestions.map((item, idx) => (
                                            <tr key={idx} className={idx % 2 === 0 ? 'bg-[#f8f7f4]' : 'bg-white'}>
                                                <td className="p-3 font-bold text-[#0d7377] whitespace-nowrap">{item.method}</td>
                                                <td className="p-3 text-[#b91c1c]">{item.bad}</td>
                                                <td className="p-3 text-[#4a4a6a]">{item.diagnosis}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* TASK 3 — 互相診斷 */}
                    <div className="w8-task-block">
                        <div className="w8-task-hd">
                            <span className="w8-task-badge">TASK 3</span>
                            <span className="w8-task-title">各組互相診斷</span>
                            <span className="text-[11px] text-[#8888aa] font-mono ml-auto">18 min</span>
                        </div>
                        <div className="w8-task-body">
                            <p className="text-[14px] text-[#4a4a6a] mb-3">和隔壁組交換 3 題草稿，對照診斷規準圈出問題。</p>
                            <div className="bg-[#fef3c7] border border-[#d97706]/30 rounded-lg p-4 text-[13px] mb-4">
                                <strong className="text-[#d97706]">🎯 診斷目標：</strong>
                                <span className="text-[#4a4a6a] ml-1">每題至少找出 1 個可以改進的地方，並寫上是哪條規準出了問題。</span>
                            </div>

                            {/* 診斷規準速查表 */}
                            <div className="text-[11px] font-mono text-[#8888aa] tracking-[0.1em] uppercase mb-3">▸ 問卷 / 訪談 / 觀察法速查</div>
                            <div className="overflow-x-auto mb-4">
                                <table className="w-full text-[13px] border-collapse">
                                    <thead>
                                        <tr className="bg-[#0d7377] text-white">
                                            <th className="p-2.5 text-left font-bold w-8 rounded-tl-lg">#</th>
                                            <th className="p-2.5 text-left font-bold">問卷法</th>
                                            <th className="p-2.5 text-left font-bold">訪談法</th>
                                            <th className="p-2.5 text-left font-bold rounded-tr-lg">觀察法</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {diagCriteriaA.map((row, idx) => (
                                            <tr key={idx} className={idx % 2 === 0 ? 'bg-[#f5f5f5]' : 'bg-white'}>
                                                <td className="p-2.5 font-bold text-[#0d7377]">{row.no}</td>
                                                <td className="p-2.5">{row.q}</td>
                                                <td className="p-2.5 text-[#4a4a6a]">{row.iv}</td>
                                                <td className="p-2.5 text-[#4a4a6a]">{row.ob}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="text-[11px] font-mono text-[#8888aa] tracking-[0.1em] uppercase mb-3">▸ 實驗 / 文獻分析法速查</div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-[13px] border-collapse">
                                    <thead>
                                        <tr className="bg-[#0d7377] text-white">
                                            <th className="p-2.5 text-left font-bold w-8 rounded-tl-lg">#</th>
                                            <th className="p-2.5 text-left font-bold">實驗法</th>
                                            <th className="p-2.5 text-left font-bold rounded-tr-lg">文獻分析法</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {diagCriteriaB.map((row, idx) => (
                                            <tr key={idx} className={idx % 2 === 0 ? 'bg-[#f5f5f5]' : 'bg-white'}>
                                                <td className="p-2.5 font-bold text-[#0d7377]">{row.no}</td>
                                                <td className="p-2.5">{row.ex}</td>
                                                <td className="p-2.5 text-[#4a4a6a]">{row.lit}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* TASK 4 — 教師統整 */}
                    <div className="w8-task-block">
                        <div className="w8-task-hd">
                            <span className="w8-task-badge">TASK 4</span>
                            <span className="w8-task-title">教師統整常見問題</span>
                            <span className="text-[11px] text-[#8888aa] font-mono ml-auto">12 min</span>
                        </div>
                        <div className="w8-task-body">
                            <p className="text-[14px] text-[#4a4a6a] mb-3">各組分享在對方草稿裡發現的常見問題。</p>
                            <div className="bg-[#ede9fe] border border-[#7c3aed]/20 rounded-lg p-4 text-[13px]">
                                <strong className="text-[#7c3aed]">📊 三大常見錯誤：</strong>
                                <span className="text-[#4a4a6a] ml-1">一題問兩件事、引導性語氣、問了受訪者無法回答的事。</span>
                                <br />
                                <span className="text-[#4a4a6a] mt-1 inline-block">💡 養成一個問自己的習慣：「受訪者看到這題，會不會搞不清楚要回答什麼？」</span>
                            </div>
                        </div>
                    </div>

                    {/* ─── 第二節分隔 ─── */}
                    <div className="flex items-center gap-4 my-4">
                        <div className="h-px flex-1 bg-[#dddbd5]"></div>
                        <span className="text-[11px] font-mono text-[#8888aa] tracking-widest">第二節</span>
                        <div className="h-px flex-1 bg-[#dddbd5]"></div>
                    </div>

                    {/* TASK 5 — 精修草稿 */}
                    <div className="w8-task-block">
                        <div className="w8-task-hd">
                            <span className="w8-task-badge">TASK 5</span>
                            <span className="w8-task-title">精修草稿：從 3 題到 5–10 題</span>
                            <span className="text-[11px] text-[#8888aa] font-mono ml-auto">35 min</span>
                        </div>
                        <div className="w8-task-body">
                            <p className="text-[14px] text-[#4a4a6a] mb-4">
                                根據第一節的診斷結果修改草稿，並補充到 5–10 題完整版本。用學習單 Part C 逐題填寫修改過程。
                            </p>

                            <div className="bg-[#f8f7f4] border border-[#dddbd5] rounded-lg p-4 text-[13px] text-[#4a4a6a] mb-4">
                                <strong className="text-[#1a1a2e]">✍️ 修改時問自己三件事：</strong>
                                <ol className="mt-2 ml-4 space-y-1 list-decimal">
                                    <li>這題對應我的研究問題嗎？</li>
                                    <li>受訪者看得懂嗎？</li>
                                    <li>答案會幫我回答研究問題嗎？</li>
                                </ol>
                            </div>

                            <div className="bg-[#ede9fe] border border-[#7c3aed]/20 rounded-lg p-4 text-[13px]">
                                <strong className="text-[#7c3aed]">💡 各方法設計提示</strong>
                                <div className="mt-2 space-y-1.5 text-[#4a4a6a]">
                                    <p><strong>問卷法：</strong>通常 10–20 題；前幾題基本資料，中間核心問題，最後可有開放填答。</p>
                                    <p><strong>訪談法：</strong>訪綱 5–8 個主問題 + 每題下方 2–3 個追問；不要超過 15 個主問題。</p>
                                    <p><strong>觀察法：</strong>需要標題（地點、時間、對象）+ 觀察指標 + 記錄方式（畫記/計數/文字描述）。</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* TASK 6 — 展示 */}
                    <div className="w8-task-block">
                        <div className="w8-task-hd">
                            <span className="w8-task-badge">TASK 6</span>
                            <span className="w8-task-title">修前修後展示</span>
                            <span className="text-[11px] text-[#8888aa] font-mono ml-auto">10 min</span>
                        </div>
                        <div className="w8-task-body">
                            <p className="text-[14px] text-[#4a4a6a]">
                                每組選出改得最滿意的 1 題：展示修改前 vs 修改後，說明改了什麼、為什麼改。不需要解釋研究主題，直接講題目本身。
                            </p>
                        </div>
                    </div>

                    {/* TASK 7 — 收束 */}
                    <div className="w8-task-block">
                        <div className="w8-task-hd">
                            <span className="w8-task-badge">TASK 7</span>
                            <span className="w8-task-title">收束 + 預告 W10</span>
                            <span className="text-[11px] text-[#8888aa] font-mono ml-auto">5 min</span>
                        </div>
                        <div className="w8-task-body">
                            <p className="text-[14px] text-[#4a4a6a]">
                                下週 W10 做兩件事：① 進行研究倫理審查 ② 正式啟動資料收集。回家前請把初版工具再自己讀一遍。
                            </p>
                        </div>
                    </div>

                </div>
            </section>

            {/* ═══════ 地雷速查卡（保留互動元件）═══════ */}
            <section className="mt-20">
                <div className="w8-section-head">
                    <h2 className="w8-section-title">地雷速查卡</h2>
                    <div className="w8-section-line"></div>
                    <span className="w8-section-tag">REFERENCE</span>
                </div>

                <p className="text-[14px] text-[#4a4a6a] mb-6">
                    五種研究方法各有典型地雷。點選下方切換查看你的方法需要注意什麼。
                </p>

                <div className="w8-method-tabs">
                    {[
                        { id: 'questionnaire', label: '📋 問卷' },
                        { id: 'interview', label: '🎤 訪談' },
                        { id: 'experiment', label: '🧪 實驗' },
                        { id: 'observation', label: '👀 觀察' },
                        { id: 'literature', label: '📚 文獻' }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveMethod(tab.id)}
                            className={`w8-tab-btn ${activeMethod === tab.id ? 'active' : ''}`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="w8-panel">
                    <div className="w8-panel-hd">
                        <span className="w8-panel-badge">{currentMethod.name.split(' ')[0]}組</span>
                        <span className="text-[14px] font-bold">{currentMethod.name.split(' ')[0]}設計避險</span>
                    </div>
                    <div className="w8-panel-body">
                        <div className="w8-panel-section-title">核心地雷（務必避開）</div>
                        <div className="w8-pitfall-list">
                            {currentMethod.errors.map((err, idx) => (
                                <div key={idx} className="w8-pitfall-item">
                                    <div className="w8-pitfall-x">❌</div>
                                    <div className="w8-pitfall-text">
                                        <strong>{err.name}：</strong>{err.desc}<br />
                                        <span className="w8-pitfall-fix">✓ 改法：{err.good}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════ WRAP UP ═══════ */}
            <section className="mt-20">
                <div className="w8-section-head">
                    <h2 className="w8-section-title">本週總結</h2>
                    <div className="w8-section-line"></div>
                    <span className="w8-section-tag">WRAP-UP</span>
                </div>

                <div className="bg-white border border-[#dddbd5] rounded-[10px] overflow-hidden mb-4">
                    <div className="p-4 px-5 bg-[#f0ede6] border-b border-[#dddbd5] font-bold text-[13px]">
                        ✅ 本週結束，你應該要會
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-[1px] bg-[#dddbd5]">
                        {[
                            '用診斷規準找出草稿中的問題（不只憑感覺）',
                            '說出你的方法（問卷/訪談/觀察）的關鍵規準',
                            '完成 5–10 題的初版研究工具',
                            '記錄每題修改前後的差異與原因'
                        ].map((item, i) => (
                            <div key={i} className="p-4 px-6 bg-white flex items-start gap-3">
                                <span className="text-[#2e7d5a] mt-0.5">✓</span>
                                <span className="text-[13px] text-[#4a4a6a]">{item}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white border border-[#dddbd5] rounded-[10px] overflow-hidden mb-8">
                    <div className="p-4 px-5 bg-[#f0ede6] border-b border-[#dddbd5] flex items-center gap-3">
                        <span className="text-[10px] font-mono bg-[#1a1a2e] text-white px-2 py-0.5 rounded-[3px]">DELIVERABLES</span>
                        <span className="font-bold text-[13px]">本週產出</span>
                    </div>
                    <div className="divide-y divide-[#dddbd5]">
                        {[
                            { part: 'Part A', text: '診斷規準速查（課堂對照使用）' },
                            { part: 'Part B', text: '同儕診斷記錄（幫對方組診斷 3 題草稿）', badge: '課堂完成' },
                            { part: 'Part C', text: '修改記錄（修前 / 修後 / 原因，至少 3 題）', badge: '最重要' },
                        ].map((hw, idx) => (
                            <div key={idx} className="p-4 px-6 flex items-center justify-between text-[13px]">
                                <div className="flex items-center gap-6">
                                    <span className="font-bold font-mono w-12 shrink-0 text-[#2d5be3]">{hw.part}</span>
                                    <span className="text-[#4a4a6a]">{hw.text}</span>
                                </div>
                                {hw.badge && <span className="bg-[#fdecea] text-[#c0392b] text-[10px] px-2 py-0.5 rounded border border-[#c0392b]/20 font-bold">{hw.badge}</span>}
                            </div>
                        ))}
                    </div>
                    <div className="p-4 px-6 bg-[#f8f7f4] border-t border-[#dddbd5] flex items-center justify-between">
                        <span className="text-[12px] text-[#8888aa]">學習單在 Google Classroom 下載</span>
                        <a href="https://classroom.google.com/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-[12px] font-mono font-bold text-[#2d5be3]">
                            → Google Classroom
                        </a>
                    </div>
                </div>

                <div className="next-week-preview">
                    <div className="next-week-header">
                        <span className="next-week-badge">NEXT WEEK</span>
                        <h2 className="next-week-title">W10 預告：倫理審查 + 啟動資料收集</h2>
                    </div>
                    <div className="next-week-content">
                        <div className="next-week-col">
                            <div className="next-week-label">倫理審查</div>
                            <p className="next-week-text">W10 會進行研究倫理審查，確認你們的研究符合倫理規範。</p>
                        </div>
                        <div className="next-week-col">
                            <div className="next-week-label">準備工作</div>
                            <p className="next-week-text">⚠️ 把今天的初版工具再讀一遍：每題都能對應到你的研究問題嗎？</p>
                        </div>
                    </div>
                </div>

                <div className="flex justify-between items-center mt-16 pt-8 border-t border-[#dddbd5]">
                    <Link to="/w8" className="text-[13px] font-bold text-[#8888aa] hover:text-[#1a1a2e] flex items-center gap-2 transition-colors">
                        ← 回 W8 研究博覽會
                    </Link>
                    <Link to="/w10" className="bg-[#1a1a2e] text-white px-8 py-3 rounded-[6px] text-[13px] font-bold hover:bg-[#4a4a6a] transition-all flex items-center gap-2 group">
                        前往 W10 倫理審查 <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </section>

        </div>
    );
};
