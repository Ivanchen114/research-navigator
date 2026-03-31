import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import CourseArc from '../components/ui/CourseArc';
import './ToolDesignPage.css';
import { Wrench, ArrowRight, AlertTriangle, ShieldCheck, Heart, ClipboardList, Mic, TestTube2, Camera, Target, Zap, FileSearch, Scale, Map, Gamepad2, ShieldAlert } from 'lucide-react';
import LessonMap from '../components/ui/LessonMap';
import { W8Data } from '../data/lessonMaps';

// 五大工具的錯誤類型與解藥 (5 Methods Pitfalls Data)
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
            {/* REMOVED: <style dangerouslySetInnerHTML /> - styles moved to index.css */}


            {/* TOP BAR */}
            <div className="flex items-center justify-between border-b border-[#dddbd5] pb-4 mb-16">
                <div className="text-[11px] font-mono text-[#8888aa] flex items-center gap-2">
                    研究方法與專題 / 資料蒐集 / <span className="text-[#1a1a2e] font-bold">工具設計 W8</span>
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
                <div className="text-[#2d5be3] font-mono text-[11px] font-bold tracking-widest uppercase mb-4">🔧 W8 · 資料蒐集</div>
                <h1 className="font-serif text-[42px] font-bold leading-[1.2] text-[#1a1a2e] mb-6 tracking-[-0.01em]">
                    工具設計：<span className="text-[#2d5be3]">處方診斷與三大標準</span>
                </h1>
                <p className="text-[16px] text-[#4a4a6a] leading-relaxed mb-8">
                    你在 W6 學會「選方法」。今天要升級到 Level 2——學會設計出好的工具，知道壞工具長什麼樣，然後動手寫出初稿。
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

                {/* Course Arc - Standard Version A */}
                <CourseArc items={W8Data.courseArc} />
            </div>

            <div className="w8-meta-strip">
                <div className="w8-meta-item">
                    <div className="w8-meta-label">第一節</div>
                    <div className="w8-meta-value">Level 2 診斷 + 三大標準</div>
                </div>
                <div className="w8-meta-item">
                    <div className="w8-meta-label">第二節</div>
                    <div className="w8-meta-value">分流工作坊：工具實作初稿</div>
                </div>
                <div className="w8-meta-item">
                    <div className="w8-meta-label">課堂產出</div>
                    <div className="w8-meta-value">工具初稿 (問卷/訪談大綱...)</div>
                </div>
                <div className="w8-meta-item">
                    <div className="w8-meta-label">帶去 W9</div>
                    <div className="w8-meta-value">初稿 → 上機 + 真實預試</div>
                </div>
            </div>



            {/* 學什麼 SECTION */}
            <section>
                <div className="w8-section-head">
                    <h2 className="w8-section-title">學什麼</h2>
                    <div className="w8-section-line"></div>
                    <span className="w8-section-tag">CONCEPT</span>
                </div>

                <div className="text-[11px] font-mono text-[#8888aa] tracking-[0.1em] uppercase mb-4">診斷等級升級</div>
                <div className="w8-level-banner">
                    <div className="w8-level-card">
                        <span className="w8-level-tag text-[#2e7d5a] bg-[#e8f5ee]">W6 · LEVEL 1 ✓</span>
                        <div className="w8-level-title">掛號判斷</div>
                        <div className="w8-level-desc">你的研究問題適合什麼方法？<br />→ 問卷 / 訪談 / 實驗 / 觀察 / 文獻</div>
                    </div>
                    <div className="w8-level-card now">
                        <span className="w8-level-tag text-[#1a1a2e] bg-[#c9a84c]">W8 · LEVEL 2 ← 現在</span>
                        <div className="w8-level-title">處方診斷</div>
                        <div className="w8-level-desc">你設計的工具有沒有毛病？<br />→ 抓雷、修正、確保工具有效可靠</div>
                    </div>
                </div>

                <div className="text-[11px] font-mono text-[#8888aa] tracking-[0.1em] uppercase mb-4">好工具三大標準</div>
                <div className="w8-standards-grid">
                    <div className="w8-std-card">
                        <div className="w8-std-icon">🎯</div>
                        <div className="w8-std-title">有效性</div>
                        <div className="w8-std-en">Validity</div>
                        <div className="w8-std-bad">❌ 「你覺得睡眠重要嗎？」<br />（問不出時間）</div>
                        <div className="w8-std-good">✓ 「你平日幾點睡覺？」<br />（直接測到目標）</div>
                    </div>
                    <div className="w8-std-card">
                        <div className="w8-std-icon">📏</div>
                        <div className="w8-std-title">可靠性</div>
                        <div className="w8-std-en">Reliability</div>
                        <div className="w8-std-bad">❌ 「你常常熬夜嗎？」<br />（各人理解不同）</div>
                        <div className="w8-std-good">✓ 「上週有幾天過 12 點睡？」<br />（數值客觀穩定）</div>
                    </div>
                    <div className="w8-std-card">
                        <div className="w8-std-icon">✅</div>
                        <div className="w8-std-title">可行性</div>
                        <div className="w8-std-en">Feasibility</div>
                        <div className="w8-std-bad">❌ 問卷 100 題 / 訪談 5 小時<br />（對方會中途放棄）</div>
                        <div className="w8-std-good">✓ 問卷 15題 / 訪談 30分鐘<br />（時間規劃合理）</div>
                    </div>
                </div>

                <div className="text-[11px] font-mono text-[#8888aa] tracking-[0.1em] uppercase mb-4">常見錯誤速查 · 防雷卡</div>
                <div className="w8-errors-grid">
                    <div className="w8-err-item">
                        <span className="w8-err-tag">ERROR 01</span>
                        <div className="w8-err-name">誘導性提問</div>
                        <div className="w8-err-bad">❌ 「你同意手機會嚴重傷害睡眠嗎？」</div>
                        <div className="w8-err-good">✓ 「你認為手機對睡眠的影響是？」</div>
                    </div>
                    <div className="w8-err-item">
                        <span className="w8-err-tag">ERROR 02</span>
                        <div className="w8-err-name">選項重疊</div>
                        <div className="w8-err-bad">❌ 0–10 分鐘、10–20 分鐘</div>
                        <div className="w8-err-good">✓ 10 分鐘以下、11–20 分鐘</div>
                    </div>
                    <div className="w8-err-item">
                        <span className="w8-err-tag">ERROR 03</span>
                        <div className="w8-err-name">選項不完整</div>
                        <div className="w8-err-bad">❌ 只有 A 或 B</div>
                        <div className="w8-err-good">✓ 包含「其他」或極端值選項</div>
                    </div>
                    <div className="w8-err-item">
                        <span className="w8-err-tag">ERROR 04</span>
                        <div className="w8-err-name">雙重問題</div>
                        <div className="w8-err-bad">❌ 「餐廳便宜又好吃嗎？」</div>
                        <div className="w8-err-good">✓ 拆成兩個獨立問題</div>
                    </div>
                </div>
            </section>

            {/* 練什麼 SECTION */}
            <section className="mt-20">
                <div className="w8-section-head">
                    <h2 className="w8-section-title">練什麼</h2>
                    <div className="w8-section-line"></div>
                    <span className="w8-section-tag">PRACTICE</span>
                </div>

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
                        <div className="w8-panel-section-title">核心地雷（今天務必避開）</div>
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
                        <div className="w8-notice w8-notice-success mb-0">
                            ✅ <strong>目標：</strong>今天完成初稿。W9 將進行真實預試。
                        </div>
                    </div>
                </div>
            </section>

            {/* 課堂任務 SECTION */}
            <section className="mt-20">
                <div className="w8-section-head">
                    <h2 className="w8-section-title">課堂任務</h2>
                    <div className="w8-section-line"></div>
                    <span className="w8-section-tag">IN-CLASS</span>
                </div>

                <div className="grid gap-6">
                    <div className="w8-task-block">
                        <div className="w8-task-hd"><span className="w8-task-badge">TASK 1</span><span className="w8-task-title">X 型病例診斷</span></div>
                        <div className="w8-task-body"><ol className="w8-task-ol"><li>診斷病例 XQ1 問卷</li><li>指出踩到的地雷並修改</li></ol></div>
                    </div>
                    <div className="w8-task-block">
                        <div className="w8-task-hd"><span className="w8-task-badge">TASK 2</span><span className="w8-task-title">實作工具初稿</span></div>
                        <div className="w8-task-body"><p className="text-[14px] text-[#4a4a6a]">完成三欄對應表並設計出工具初稿內容。</p></div>
                    </div>
                </div>
            </section>

            {/* WRAP UP SECTION */}
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
                            '說出三大設計標準：能測到、能分析、高中生能做',
                            '看到一份工具稿，能指出至少 2 個設計地雷',
                            '完成 1.0 版研究工具初稿（三欄對應表填完）',
                            '說出你的方法有哪些獨特地雷需要注意'
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
                        <span className="text-[10px] font-mono bg-[#1a1a2e] text-white px-2 py-0.5 rounded-[3px]">HOMEWORK</span>
                        <span className="font-bold text-[13px]">本週作業</span>
                    </div>
                    <div className="divide-y divide-[#dddbd5]">
                        {[
                            { part: 'Part 1', text: '工具初稿完整版（三欄對應表 + 所有題目）' },
                            { part: 'Part 2', text: 'AI 審稿記錄（至少 3 條 AI-RED 記錄）', badge: '最重要' },
                            { part: 'Part Z', text: '自我檢核（攜帶初稿準備 W9 真人預試）', light: true },
                        ].map((hw, idx) => (
                            <div key={idx} className="p-4 px-6 flex items-center justify-between text-[13px]">
                                <div className="flex items-center gap-6">
                                    <span className={`font-bold font-mono w-12 shrink-0 ${hw.light ? 'text-[#8888aa]' : 'text-[#2d5be3]'}`}>{hw.part}</span>
                                    <span className={hw.light ? 'text-[#8888aa]' : 'text-[#4a4a6a]'}>{hw.text}</span>
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
                        <h2 className="next-week-title">W9 預告：工具精進與預試</h2>
                    </div>
                    <div className="next-week-content">
                        <div className="next-week-col">
                            <div className="next-week-label">真實反饋</div>
                            <p className="next-week-text">W9 會找真實的人進行測試並進行數位化上機實作。</p>
                        </div>
                        <div className="next-week-col">
                            <div className="next-week-label">準備工作</div>
                            <p className="next-week-text">⚠️ 下週請務必攜帶筆電。問卷組需完成數位化。</p>
                        </div>
                    </div>
                </div>

                <div className="flex justify-between items-center mt-16 pt-8 border-t border-[#dddbd5]">
                    <Link to="/w8" className="text-[13px] font-bold text-[#8888aa] hover:text-[#1a1a2e] flex items-center gap-2 transition-colors">
                        ← 回 W8 組隊決策週
                    </Link>
                    <Link to="/w10" className="bg-[#1a1a2e] text-white px-8 py-3 rounded-[6px] text-[13px] font-bold hover:bg-[#4a4a6a] transition-all flex items-center gap-2 group">
                        前往 W10 工具精進 <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </section>

        </div>
    );
};
