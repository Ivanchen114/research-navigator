import React, { useState } from 'react';
import {
    BookOpen,
    ShieldAlert,
    CheckCircle2,
    FileSearch,
    PenTool,
    AlertTriangle,
    Info,
    FileText,
    Bot,
    Search,
    Map,
    ArrowRight,
    Gamepad2,
    CheckCircle,
    ChevronRight,
    Download
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { PromptBox } from '../components/analysis/PromptBox';
import LessonMap from '../components/ui/LessonMap';
import { W5Data } from '../data/lessonMaps';

export const LiteratureReview = () => {
    const [myTopic, setMyTopic] = useState('');
    const [searchKeywords, setSearchKeywords] = useState('');
    const [foundPaper, setFoundPaper] = useState('');
    const [showLessonMap, setShowLessonMap] = useState(false);

    // Unlock Answer State
    const [unlockCounts, setUnlockCounts] = useState({});
    const [revealedAnswers, setRevealedAnswers] = useState({});

    const handleUnlock = (id) => {
        const nextCount = (unlockCounts[id] || 0) + 1;
        setUnlockCounts(prev => ({ ...prev, [id]: nextCount }));
        if (nextCount >= 3) {
            setRevealedAnswers(prev => ({ ...prev, [id]: true }));
        }
    };

    const keywordPrompt = `我的研究題目是：${myTopic || '【你的題目】'}

請幫我：
1. 列出 5-8 個適合的中文關鍵字
2. 給我對應的英文關鍵字
3. 建議哪些關鍵字組合在資料庫搜尋最有效

請用表格呈現，並說明每個關鍵字的用途。`;

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 font-sans text-[14px] leading-[1.6] text-[#1a1a2e]">

            <style dangerouslySetInnerHTML={{
                __html: `
                .w5-meta-strip { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1px; background: var(--border); border: 1px solid var(--border); border-radius: 10px; overflow: hidden; }
                @media (min-width: 768px) { .w5-meta-strip { grid-template-columns: repeat(4, 1fr); } }
                .w5-meta-item { background: #fff; padding: 14px 18px; }
                .w5-meta-label { font-size: 10px; font-family: 'DM Mono', monospace; color: var(--ink-light); letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 4px; }
                .w5-meta-value { font-size: 13px; font-weight: 700; color: var(--ink); }
                .w5-topbar { height: 52px; background: #fff; border-bottom: 1px solid var(--border); display: flex; align-items: center; padding: 0 48px; position: sticky; top: 0; z-index: 50; }
                .w5-topbar-path { font-size: 12px; color: var(--ink-light); font-family: 'DM Mono', monospace; display: flex; align-items: center; gap: 8px; }
                .w5-topbar-path span { color: var(--ink-mid); }
                .w5-topbar-right { margin-left: auto; display: flex; align-items: center; gap: 10px; }
                .w5-topbar-tag { font-size: 11px; padding: 4px 10px; border: 1px solid var(--border); border-radius: 4px; color: var(--ink-mid); font-family: 'DM Mono', monospace; }
                .w5-content { padding: 48px 60px; max-width: 940px; margin: 0 auto; }

                .w5-section-head { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; }
                .w5-section-head h2 { font-family: 'Noto_Serif_TC', serif; font-size: 18px; font-weight: 700; color: var(--ink); white-space: nowrap; }
                .w5-section-head .line { flex: 1; height: 1px; background: var(--border); }
                .w5-section-head .mono { font-family: 'DM Mono', monospace; font-size: 10px; color: var(--ink-light); letter-spacing: 0.08em; }

                .w5-grade-grid { display: grid; grid-template-columns: repeat(1, 1fr); gap: 1px; background: var(--border); border: 1px solid var(--border); border-radius: 10px; overflow: hidden; }
                @media (min-width: 640px) { .w5-grade-grid { grid-template-columns: repeat(2, 1fr); } }
                @media (min-width: 1024px) { .w5-grade-grid { grid-template-columns: repeat(4, 1fr); } }
                .w5-grade-card { background: #fff; padding: 18px 16px; transition: background 0.2s; }
                .w5-grade-card:hover { background: var(--paper); }
                .w5-grade-usage { margin-top: 8px; font-size: 11px; padding: 6px 8px; border-radius: 4px; line-height: 1.5; }

                .w5-plag-row { display: grid; grid-template-columns: 1fr; gap: 1px; background: var(--border); border: 1px solid var(--border); border-radius: 10px; overflow: hidden; }
                @media (min-width: 768px) { .w5-plag-row { grid-template-columns: repeat(3, 1fr); } }
                .w5-plag-card { background: #fff; padding: 18px 20px; }

                .w5-sandwich { border: 1px solid var(--border); border-radius: 10px; overflow: hidden; }
                .w5-sandwich-layer { display: flex; align-items: flex-start; gap: 16px; padding: 16px 20px; }

                .w5-notice { margin-top: 14px; padding: 12px 16px; border-radius: 0 6px 6px 0; font-size: 12px; line-height: 1.75; }
                .w5-notice-gold    { background: var(--gold-light); color: #7a6020; border-left: 4px solid var(--gold); }
                .w5-notice-accent  { background: var(--accent-light); color: var(--accent); border-left: 4px solid var(--accent); }
                .w5-notice-success { background: var(--success-light); color: var(--success); border-left: 4px solid var(--success); }
                .w5-notice-danger  { background: var(--danger-light); color: var(--danger); border-left: 4px solid var(--danger); }

                .w5-hw-item { background: #fff; padding: 12px 20px; display: flex; align-items: flex-start; gap: 16px; }
                .w5-hw-part { font-family: 'DM Mono', monospace; font-size: 11px; color: var(--accent); width: 80px; flex-shrink: 0; font-weight: 700; }
                .w5-hw-name { font-size: 13px; color: var(--ink-mid); flex: 1; }
            ` }} />

            {/* TOP BAR / NAVIGATION PATH */}
            <div className="w5-topbar">
                <div className="w5-topbar-path">
                    研究方法與專題 / 研究規劃 / <span>文獻偵探社 W5</span>
                </div>
                <div className="w5-topbar-right">
                    <button
                        onClick={() => setShowLessonMap(!showLessonMap)}
                        className="text-[11px] text-[#8888aa] hover:text-[#2d5be3] transition-colors flex items-center gap-1 font-['DM_Mono',monospace] mr-2"
                    >
                        <Map size={12} /> {showLessonMap ? 'Hide Plan' : 'Instructor View'}
                    </button>
                    <span className="w5-topbar-tag">100 MINS</span>
                </div>
            </div>

            {showLessonMap && (
                <div className="animate-in slide-in-from-top-4 duration-300 max-w-5xl mx-auto px-6 lg:px-12 mt-8">
                    <LessonMap data={W5Data} />
                </div>
            )}

            <div className="w5-content space-y-16 pb-32">

                {/* PAGE HEADER */}
                <header>
                    <div className="text-[11px] font-['DM_Mono',monospace] text-[#2d5be3] mb-3 tracking-[0.2em] uppercase">🕵️ W5 · 研究規劃</div>
                    <h1 className="font-['Noto_Serif_TC',serif] text-[42px] font-bold leading-[1.2] text-[#1a1a2e] mb-4 tracking-[-0.02em]">
                        文獻偵探社：<br />
                        找對<span className="text-[#2d5be3]">證據</span>，寫對<span className="text-[#2d5be3]">引用</span>
                    </h1>
                    <p className="text-[16px] text-[#4a4a6a] max-w-[650px] leading-relaxed">
                        AI 會幫你找文獻，但 AI 也會造假。今天你要學兩種能力：<strong>鑑識文獻的真偽與等級</strong>，以及<strong>合法引用而不抄襲</strong>。
                    </p>

                    {/* META STRIP */}
                    <div className="w5-meta-strip mt-10 shadow-sm">
                        {[
                            { label: '本週核心', value: '文獻鑑識 + 引用寫作' },
                            { label: '課堂產出', value: '文獻偵探任務單' },
                            { label: '本週作業', value: '引用偵錯遊戲 + 任務單' },
                            { label: '帶去 W6', value: '3 篇真實文獻書目' }
                        ].map((item, idx) => (
                            <div key={idx} className="w5-meta-item">
                                <div className="w5-meta-label">{item.label}</div>
                                <div className="w5-meta-value">{item.value}</div>
                            </div>
                        ))}
                    </div>
                </header>

                {/* ═══ 學什麼 ═══ */}
                <section className="space-y-10">
                    <div className="w5-section-head">
                        <h2>學什麼</h2>
                        <div className="line"></div>
                        <span className="mono">CONCEPT</span>
                    </div>

                    {/* 四級制 */}
                    <div className="space-y-4">
                        <div className="text-[10px] font-['DM_Mono',monospace] color-[#8888aa] uppercase tracking-widest">文獻可信度 · 四級判定標準</div>
                        <div className="w5-grade-grid shadow-sm">
                            <div className="w5-grade-card">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-2.5 h-2.5 rounded-full bg-[#2e7d5a]"></div>
                                    <span className="font-['DM_Mono',monospace] font-bold text-[#2e7d5a]">A 級</span>
                                </div>
                                <span className="font-bold text-[13px] block mb-1">主證據</span>
                                <div className="text-[11px] text-[#8888aa] leading-relaxed">同儕審查學術期刊<br />碩博士論文<br />政府/學術機構研究報告</div>
                                <div className="w5-grade-usage bg-[#e8f5ee] text-[#2e7d5a]">可當核心論據</div>
                            </div>
                            <div className="w5-grade-card">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-2.5 h-2.5 rounded-full bg-[#2d5be3]"></div>
                                    <span className="font-['DM_Mono',monospace] font-bold text-[#2d5be3]">B 級</span>
                                </div>
                                <span className="font-bold text-[13px] block mb-1">輔助證據</span>
                                <div className="text-[11px] text-[#8888aa] leading-relaxed">專家專書章節<br />官方智庫白皮書<br />正式專業媒體深度報導</div>
                                <div className="w5-grade-usage bg-[#e8eeff] text-[#2d5be3]">補脈絡，不能作唯一主證</div>
                            </div>
                            <div className="w5-grade-card">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-2.5 h-2.5 rounded-full bg-[#c9a84c]"></div>
                                    <span className="font-['DM_Mono',monospace] font-bold text-[#c9a84c]">C 級</span>
                                </div>
                                <span className="font-bold text-[13px] block mb-1">背景線索</span>
                                <div className="text-[11px] text-[#8888aa] leading-relaxed">科普書籍<br />維基百科<br />一般科普網站</div>
                                <div className="w5-grade-usage bg-[#fdf6e3] text-[#7a6020]">找方向、找關鍵字用</div>
                            </div>
                            <div className="w5-grade-card bg-[#f0ede6]">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-2.5 h-2.5 rounded-full bg-[#c0392b]"></div>
                                    <span className="font-['DM_Mono',monospace] font-bold text-[#c0392b]">D 級</span>
                                </div>
                                <span className="font-bold text-[13px] block mb-1">不採用</span>
                                <div className="text-[11px] text-[#8888aa] leading-relaxed">AI 幻覺（查無此文）<br />內容農場、論壇貼文<br />社群媒體（含個人貼文）</div>
                                <div className="w5-grade-usage bg-[#fdecea] text-[#c0392b]">直接淘汰，不列入引用</div>
                            </div>
                        </div>
                    </div>

                    {/* 查核步驟 */}
                    <div className="grid md:grid-cols-2 gap-px bg-[#dddbd5] border border-[#dddbd5] rounded-[10px] overflow-hidden">
                        <div className="bg-white p-6 flex items-start gap-5">
                            <span className="text-[28px] font-['DM_Mono',monospace] font-bold text-[#2d5be3] leading-none">01</span>
                            <div>
                                <h4 className="font-bold text-[14px] mb-2">Google Scholar 查作者</h4>
                                <p className="text-[12px] text-[#4a4a6a] leading-relaxed">這個作者真的存在嗎？搜尋作者名字，看看他的學術主頁或其他論文是否找得到。</p>
                            </div>
                        </div>
                        <div className="bg-white p-6 flex items-start gap-5">
                            <span className="text-[28px] font-['DM_Mono',monospace] font-bold text-[#2d5be3] leading-none">02</span>
                            <div>
                                <h4 className="font-bold text-[14px] mb-2">華藝或 Scholar 查摘要</h4>
                                <p className="text-[12px] text-[#4a4a6a] leading-relaxed">這篇論文真的存在嗎？能找到摘要才算通過。標題、作者、摘要都對，才能用。</p>
                            </div>
                        </div>
                    </div>

                    <div className="w5-notice w5-notice-danger">
                        ⚠️ 第一節課的證物鑑識實戰期間：<strong>禁止用 ChatGPT / NotebookLM 幫你判斷</strong>，你要自己去查證！查不到也是一種答案。
                    </div>

                    {/* 三種引用方式 */}
                    <div className="space-y-4 pt-6">
                        <div className="text-[10px] font-['DM_Mono',monospace] color-[#8888aa] uppercase tracking-widest">學術寫作倫理 · 三種引用狀況</div>
                        <div className="w5-plag-row shadow-sm">
                            {[
                                { icon: '❌', title: '無意抄襲', color: 'text-[#c0392b]', bg: 'bg-[#fdecea]', text: '粗心忘記標註來源。即便不是故意的，客觀上仍構成抄襲。', ex: '「睡眠不足會導致前額葉皮質功能下降…」↳ 忘記寫 (陳醫師, 2023)' },
                                { icon: '⚠️', title: '換字抄襲 Patchwriting', color: 'text-[#c9a84c]', bg: 'bg-[#fdf6e3]', text: '只把「使用」改成「應用」、「因此」改成「所以」，但句型結構完全沒變。', ex: '「睡眠不夠會造成前額葉皮質運作降低…」↳ 看起來不一樣，其實還是抄' },
                                { icon: '✅', title: '正確改寫 Paraphrasing', color: 'text-[#2e7d5a]', bg: 'bg-[#e8f5ee]', text: '消化吸收後，用自己的句型與語言重述，保留原意但表達方式完全不同。', ex: '打散句型、重組因果關係 ↳ 真正的理解後才能這樣寫' },
                            ].map((item, idx) => (
                                <div key={idx} className="w5-plag-card">
                                    <div className="text-[20px] mb-2">{item.icon}</div>
                                    <h4 className={`font-bold text-[14px] ${item.color} mb-2`}>{item.title}</h4>
                                    <p className="text-[12px] text-[#4a4a6a] leading-relaxed mb-4">{item.text}</p>
                                    <div className={`p-3 rounded-[4px] text-[11px] italic leading-relaxed ${item.bg} ${item.color}`}>
                                        {item.ex}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 三明治法 */}
                    <div className="space-y-6 pt-6">
                        <div className="text-[10px] font-['DM_Mono',monospace] color-[#8888aa] uppercase tracking-widest">直接引用 · 三明治寫作法 Sandwich Method</div>
                        <div className="w5-notice w5-notice-gold shadow-sm" style={{ borderLeftWidth: '4px' }}>
                            當原文是定義、權威名言或精確數據時，用直接引用。但不能把引文硬丟進去——那叫做「孤兒引用」（只有肉，沒有麵包）。
                        </div>

                        <div className="w5-sandwich shadow-sm">
                            <div className="w5-sandwich-layer bg-[#fdf6e3]">
                                <span className="text-[20px]">🍞</span>
                                <div>
                                    <div className="text-[10px] font-bold text-[#c9a84c] uppercase tracking-widest mb-1">Top / 引入</div>
                                    <h4 className="font-bold text-[13px] mb-1">上層麵包</h4>
                                    <p className="text-[12px] text-[#4a4a6a]">介紹背景，說明這句話是誰說的、在什麼脈絡下說的。讓讀者先有準備。</p>
                                </div>
                            </div>
                            <div className="h-px bg-[#dddbd5]"></div>
                            <div className="w5-sandwich-layer bg-white">
                                <span className="text-[20px]">🥩</span>
                                <div>
                                    <div className="text-[10px] font-bold text-[#1a1a2e] uppercase tracking-widest mb-1">Meat / 引用</div>
                                    <h4 className="font-bold text-[13px] mb-1">中間內餡</h4>
                                    <p className="text-[12px] text-[#4a4a6a]">放入加了引號的逐字原文，並在末尾標上引用來源 (作者, 年份)。</p>
                                </div>
                            </div>
                            <div className="h-px bg-[#dddbd5]"></div>
                            <div className="w5-sandwich-layer bg-[#e8f5ee]">
                                <span className="text-[20px]">🍞</span>
                                <div>
                                    <div className="text-[10px] font-bold text-[#2e7d5a] uppercase tracking-widest mb-1">Bottom / 解釋</div>
                                    <h4 className="font-bold text-[13px] mb-1">下層麵包</h4>
                                    <p className="text-[12px] text-[#4a4a6a]">解釋這句話對你的研究有什麼意義。不要讓引文自己說話，你要告訴讀者為什麼這張圖片很重要。</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-px bg-[#dddbd5] border border-[#dddbd5] rounded-[10px] overflow-hidden">
                            <div className="bg-[#fdecea] p-5">
                                <h5 className="font-bold text-[11px] text-[#c0392b] mb-2 uppercase">❌ 孤兒引用（只有肉）</h5>
                                <p className="text-[12px] text-[#4a4a6a] italic">「AI很好用。」(Wang, 2023)<br /><br />讀者不知道這句話跟你在說什麼有什麼關係。</p>
                            </div>
                            <div className="bg-[#e8f5ee] p-5">
                                <h5 className="font-bold text-[11px] text-[#2e7d5a] mb-2 uppercase">✅ 三明治法（有頭有尾）</h5>
                                <p className="text-[12px] text-[#4a4a6a] leading-relaxed">
                                    🍞 許多研究已指出AI工具的潛力…<br />
                                    🥩 Wang (2023) 指出「AI很好用」<br />
                                    🍞 這說明在學習情境中，AI確實…
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ═══ 練什麼 ═══ */}
                <section className="space-y-10">
                    <div className="w5-section-head">
                        <h2>練什麼</h2>
                        <div className="line"></div>
                        <span className="mono">PRACTICE</span>
                    </div>

                    {/* 練習 1 */}
                    <div className="bg-white border border-[#dddbd5] rounded-[10px] overflow-hidden shadow-sm">
                        <div className="bg-[#f0ede6] p-4 px-6 border-b border-[#dddbd5] flex items-center gap-3">
                            <span className="bg-[#1a1a2e] text-white text-[10px] font-bold px-2 py-0.5 rounded-[2px] font-['DM_Mono',monospace]">TASK 01</span>
                            <h3 className="font-bold text-[14px]">改寫偵錯：這是換字抄襲嗎？</h3>
                        </div>
                        <div className="p-8 space-y-6">
                            <div className="space-y-2">
                                <div className="text-[10px] text-[#8888aa] font-bold uppercase tracking-widest">原始文獻（陳醫師，2023）</div>
                                <div className="bg-[#f8f7f4] border border-[#dddbd5] p-4 px-6 rounded-[6px] text-[13px] italic text-[#4a4a6a] leading-relaxed">
                                    「睡眠不足會導致前額葉皮質功能下降，進而削弱學生的專注力與情緒控管能力，長期下來可能引發焦慮症狀。」
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="text-[10px] text-[#c0392b] font-bold uppercase tracking-widest">某位同學的改寫</div>
                                <div className="bg-[#fdecea] border border-[#f2dada] p-4 px-6 rounded-[6px] text-[13px] italic text-[#4a4a6a] leading-relaxed">
                                    睡眠不夠會<span className="bg-[#f2b8b1] px-1 rounded mx-0.5">造成</span>前額葉皮質<span className="bg-[#f2b8b1] px-1 rounded mx-0.5">運作降低</span>，進而<span className="bg-[#f2b8b1] px-1 rounded mx-0.5">減弱</span>同學的<span className="bg-[#f2b8b1] px-1 rounded mx-0.5">專心度和情緒管理</span>，時間久了可能<span className="bg-[#f2b8b1] px-1 rounded mx-0.5">產生焦慮的問題</span>。（陳醫師，2023）
                                </div>
                                <p className="text-[11px] text-[#c0392b]">↑ 標色的詞是改掉的地方——句型結構完全沒變，這就是換字抄襲。</p>
                            </div>

                            <div className="pt-4 border-t border-[#dddbd5]">
                                {revealedAnswers['p1'] ? (
                                    <div className="bg-[#e8f5ee] border border-[#2e7d5a]/20 p-5 rounded-[6px] animate-in zoom-in-95 duration-200">
                                        <h5 className="font-bold text-[13px] text-[#2e7d5a] mb-2 uppercase flex items-center gap-2">
                                            <CheckCircle size={16} /> 正確改寫示範
                                        </h5>
                                        <p className="text-[13px] text-[#4a4a6a] leading-relaxed">
                                            根據陳醫師（2023）的研究，睡眠的重要性不只是讓身體休息。當一個人睡眠不足時，大腦負責高階思考的前額葉區域會受到影響，學生因此在課堂上更難集中注意力、也更容易情緒失控。若長期累積，還可能發展為焦慮問題。<br /><br />
                                            <span className="text-[11px] opacity-70 italic">關鍵：把「原因→結果」的結構改成「結論→機制→長期影響」，語言完全換過，但原意保留。</span>
                                        </p>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => handleUnlock('p1')}
                                        className="text-[11px] font-bold text-[#8888aa] border border-[#dddbd5] px-4 py-2 rounded-[4px] hover:border-[#2d5be3] hover:text-[#2d5be3] transition-all font-['DM_Mono',monospace]"
                                    >
                                        {unlockCounts['p1'] > 0 ? `UNLOCK ANSWER (CLICK ${3 - unlockCounts['p1']} MORE)` : 'TEACHER UNLOCK'}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* 練習 2 */}
                    <div className="bg-white border border-[#dddbd5] rounded-[10px] overflow-hidden shadow-sm">
                        <div className="bg-[#f0ede6] p-4 px-6 border-b border-[#dddbd5] flex items-center gap-3">
                            <span className="bg-[#1a1a2e] text-white text-[10px] font-bold px-2 py-0.5 rounded-[2px] font-['DM_Mono',monospace]">TASK 02</span>
                            <h3 className="font-bold text-[14px]">三明治法：把這句話寫進段落</h3>
                        </div>
                        <div className="p-8 space-y-6">
                            <div className="space-y-2">
                                <div className="text-[10px] text-[#8888aa] font-bold uppercase tracking-widest">原始文獻（Sirois，2018）</div>
                                <div className="bg-[#f8f7f4] border border-[#dddbd5] p-4 px-6 rounded-[6px] text-[13px] italic text-[#4a4a6a] leading-relaxed">
                                    「拖延症並非單純的時間管理失敗，而是一種情緒調節的失敗。人們透過拖延來逃避任務帶來的負面情緒。」
                                </div>
                            </div>
                            <p className="text-[13px] text-[#4a4a6a]">任務：用三明治法，把這句話寫入一篇關於「高中生讀書計畫」的文章段落中。</p>
                            <p className="text-[11px] text-[#8888aa] italic">提示：上層麵包說一般人對拖延的誤解 → 中層引用 Sirois → 下層說明這對制定讀書計畫的啟示</p>

                            <div className="pt-4 border-t border-[#dddbd5]">
                                {revealedAnswers['p2'] ? (
                                    <div className="bg-[#e8f5ee] border border-[#2e7d5a]/20 p-5 rounded-[6px] animate-in zoom-in-95 duration-200">
                                        <h5 className="font-bold text-[13px] text-[#2e7d5a] mb-6 uppercase flex items-center gap-2">
                                            <CheckCircle size={16} /> 三明治法示範
                                        </h5>
                                        <div className="space-y-4 text-[13px] text-[#4a4a6a] leading-relaxed">
                                            <div className="flex gap-4">
                                                <span className="font-bold text-[#c9a84c] shrink-0">🍞 上層：</span>
                                                <p>很多學生在面對讀書計畫失敗時，第一反應是「我時間管理太差了」。然而，心理學研究提醒我們，問題的根源可能並不在此。</p>
                                            </div>
                                            <div className="flex gap-4">
                                                <span className="font-bold text-[#1a1a2e] shrink-0">🥩 中層：</span>
                                                <p>Sirois（2018）指出，「拖延症並非單純的時間管理失敗，而是一種情緒調節的失敗。」</p>
                                            </div>
                                            <div className="flex gap-4">
                                                <span className="font-bold text-[#2e7d5a] shrink-0">🍞 下層：</span>
                                                <p>這對高中生的讀書計畫設計有重要啟示——如果計畫的科目讓人感到焦慮或厭倦，學生就會本能地逃避。因此，有效的計畫不只要安排時間，還要照顧情緒。</p>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => handleUnlock('p2')}
                                        className="text-[11px] font-bold text-[#8888aa] border border-[#dddbd5] px-4 py-2 rounded-[4px] hover:border-[#2d5be3] hover:text-[#2d5be3] transition-all font-['DM_Mono',monospace]"
                                    >
                                        {unlockCounts['p2'] > 0 ? `UNLOCK ANSWER (CLICK ${3 - unlockCounts['p2']} MORE)` : 'TEACHER UNLOCK'}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* 五份證物預覽 */}
                    <div className="space-y-4 pt-6">
                        <div className="text-[10px] font-['DM_Mono',monospace] color-[#8888aa] uppercase tracking-widest">課堂實戰 · 五份證物預覽</div>
                        <div className="grid md:grid-cols-2 gap-4">
                            {[
                                { id: '證物 A', title: '台中市高中職學生數學焦慮與學業成就關係之研究', meta: '鄭淑米 · 2006 · 國立臺灣師範大學碩士論文', color: 'bg-[#e8f5ee] text-[#2e7d5a]' },
                                { id: '證物 B', title: 'Smartphone Usage and Sleep Quality in Taiwanese Adolescents', meta: 'Michael Chen, Sarah Wang · 2023 · Journal of Sleep Research', color: 'bg-[#fdecea] text-[#c0392b]' },
                                { id: '證物 C', title: '我的不正經人生觀', meta: '黃益中 · 2019 · 寶瓶文化（科普書）', color: 'bg-[#fdf6e3] text-[#7a6020]' },
                                { id: '證物 D', title: '生活小竅門 教你如何治療燒傷燙傷', meta: '每日頭條 · 生活竅門點點通 · 2016', color: 'bg-[#fdecea] text-[#c0392b]' },
                            ].map((item, idx) => (
                                <div key={idx} className="bg-white border border-[#dddbd5] p-5 rounded-[8px] hover:border-[#8888aa] transition-colors group">
                                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-[2px] mb-3 inline-block font-['DM_Mono',monospace] ${item.color}`}>{item.id}</span>
                                    <h4 className="font-bold text-[13px] text-[#1a1a2e] mb-1">{item.title}</h4>
                                    <p className="text-[11px] text-[#8888aa] leading-relaxed">{item.meta}</p>
                                </div>
                            ))}
                        </div>
                        <div className="bg-white border border-[#dddbd5] p-5 rounded-[8px] flex items-center gap-5">
                            <span className="text-[9px] font-bold px-2 py-0.5 rounded-[2px] font-['DM_Mono',monospace] bg-[#fdecea] text-[#c0392b]">證物 E</span>
                            <div>
                                <h4 className="font-bold text-[13px] text-[#1a1a2e] mb-1">【Facebook 貼文】國家教育研究院｜全國多所學校開始限制學生上課使用手機…</h4>
                                <p className="text-[11px] text-[#8888aa]">國家教育研究院官方 FB · 2026年1月5日</p>
                            </div>
                        </div>
                        <div className="w5-notice w5-notice-gold" style={{ borderLeftWidth: '4px' }}>
                            💡 其中有 A、B、D 三種問題——有查無此人的 AI 幻覺、有內容農場、也有難辨的社群貼文。自己去查，不能靠 AI 幫你判斷。
                        </div>
                    </div>
                </section>

                {/* ═══ 課堂任務 ═══ */}
                <section className="space-y-10">
                    <div className="w5-section-head">
                        <h2>課堂任務</h2>
                        <div className="line"></div>
                        <span className="mono">IN-CLASS</span>
                    </div>

                    <div className="space-y-4">
                        {[
                            { id: '1', title: '小組證物鑑識實戰（第一節，禁 AI）', icon: <Search size={18} />, bg: 'bg-[#fdecea]', border: 'border-[#f2dada]', notice: '🔍 查不到也是一種答案。標題聳動不一定假，社群發文不一定真——判斷的依據是查核路徑，不是感覺。', tasks: ['領取一組五份證物包 + 鑑識紀錄表', '小組討論，判定每份證物的等級 (A / B / C / D)', '每份至少寫出 2 個判定理由，並記下查核路徑', '老師公布答案：特別注意證物 B 是 AI 幻覺'] },
                            { id: '2', title: '寫作倫理特訓——改寫 + 三明治法（第一節後半）', icon: <PenTool size={18} />, bg: 'bg-[#fdf6e3]', border: 'border-[#f4ede6]', notice: '💡 實戰演練 3（多重文獻綜合）視時間而定，未完成可當課後作業。', tasks: ['拿出任務單（正面），看「實戰演練 1」', '判斷：那位同學的改寫犯了什麼錯？畫線圈出來', '自己動筆，寫出正確的改寫版本 (打散句型重組)', '看「實戰演練 2」，用三明治法把 Sirois 的拖延症名言寫進段落', '注意：最容易漏掉的是下層麵包'] },
                        ].map(task => (
                            <div key={task.id} className="bg-white border border-[#dddbd5] rounded-[10px] overflow-hidden shadow-sm">
                                <div className="bg-[#f0ede6] p-4 px-6 border-b border-[#dddbd5] flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className="bg-[#1a1a2e] text-white text-[10px] font-bold px-2 py-0.5 rounded-[2px] font-['DM_Mono',monospace]">TASK 0{task.id}</span>
                                        <h3 className="font-bold text-[14px]">{task.title}</h3>
                                    </div>
                                    <div className="text-[#8888aa]">{task.icon}</div>
                                </div>
                                <div className="p-8">
                                    <ul className="space-y-3 mb-6">
                                        {task.tasks.map((t, i) => (
                                            <li key={i} className="flex items-start gap-3 text-[13px] text-[#4a4a6a]">
                                                <span className="text-[#2d5be3] mt-1 shrink-0"><CheckCircle2 size={14} /></span>
                                                {t}
                                            </li>
                                        ))}
                                    </ul>
                                    <div className={`w5-notice ${task.id === '1' ? 'w5-notice-danger' : 'w5-notice-gold'}`}>
                                        {task.notice}
                                    </div>
                                </div>
                            </div>
                        ))}

                        <div className="bg-white border border-[#dddbd5] rounded-[10px] overflow-hidden shadow-sm">
                            <div className="bg-[#f0ede6] p-4 px-6 border-b border-[#dddbd5] flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span className="bg-[#2d5be3] text-white text-[10px] font-bold px-2 py-0.5 rounded-[2px] font-['DM_Mono',monospace]">TASK 03</span>
                                    <h3 className="font-bold text-[14px]">找自己的 3 篇文獻 + NotebookLM 實戰（第二節）</h3>
                                </div>
                                <div className="text-[#8888aa]"><Bot size={18} /></div>
                            </div>
                            <div className="p-8 space-y-8">
                                <div className="grid md:grid-cols-2 gap-10">
                                    <div className="space-y-4">
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold text-[#8888aa] uppercase tracking-widest font-['DM_Mono',monospace]">My Topic</label>
                                            <input
                                                className="w-full border border-[#dddbd5] rounded-[4px] px-4 py-2.5 text-[13px] focus:outline-none focus:border-[#2d5be3] bg-[#f8f7f4]"
                                                placeholder="輸入 W4 定案題目..."
                                                value={myTopic}
                                                onChange={e => setMyTopic(e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold text-[#8888aa] uppercase tracking-widest font-['DM_Mono',monospace]">AI Key Recommendation</label>
                                            <div className="bg-[#f0ede6] rounded-[6px] p-5">
                                                <PromptBox variant="paper">{keywordPrompt}</PromptBox>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <ul className="space-y-3">
                                            {[
                                                '翻到任務單背面，找與 W4 題目相關的文獻',
                                                '找到後一定要親自查證：作者存在嗎？摘要呢？',
                                                '填寫三份文獻的標題、作者、年份、選用理由',
                                                '把文獻丟給 NotebookLM，找「共同發現」',
                                                '完成報告：寫出「為什麼我的題目值得研究」',
                                            ].map((t, i) => (
                                                <li key={i} className="flex items-start gap-3 text-[13px] text-[#4a4a6a]">
                                                    <span className="text-[#2d5be3] mt-1 shrink-0"><CheckCircle2 size={14} /></span>
                                                    {t}
                                                </li>
                                            ))}
                                        </ul>
                                        <div className="w5-notice w5-notice-accent">
                                            🤖 AI 可能給你假文獻！每一篇都要自己去查證真實性。
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white border border-[#dddbd5] rounded-[10px] overflow-hidden shadow-sm">
                            <div className="bg-[#f0ede6] p-4 px-6 border-b border-[#dddbd5] flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span className="bg-[#2e7d5a] text-white text-[10px] font-bold px-2 py-0.5 rounded-[2px] font-['DM_Mono',monospace]">TASK 04</span>
                                    <h3 className="font-bold text-[14px]">同儕互審 Peer Review（第二節後半）</h3>
                                </div>
                                <div className="text-[#8888aa]"><CheckCircle size={18} /></div>
                            </div>
                            <div className="p-8">
                                <div className="grid md:grid-cols-2 gap-10">
                                    <ul className="space-y-3">
                                        {[
                                            '跟鄰座同學互換任務單',
                                            '幫對方查證那 3 篇文獻，填寫灰色欄位',
                                            '標記文獻等級 (A / B / C / D)',
                                            '發現問題文獻時，請告知對方更換',
                                            '確認無誤後，於任務單底部簽名並上傳',
                                        ].map((t, i) => (
                                            <li key={i} className="flex items-start gap-3 text-[13px] text-[#4a4a6a]">
                                                <span className="text-[#2e7d5a] mt-1 shrink-0"><CheckCircle2 size={14} /></span>
                                                {t}
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="space-y-4">
                                        <div className="w5-notice w5-notice-success">
                                            ✅ 你的簽名代表：「我已協助查證並確認三篇文獻真實可信。」這是本週最重要的成果。
                                        </div>
                                        <div className="p-5 border border-dashed border-[#ddd] rounded-[6px] flex flex-col items-center justify-center gap-2 text-[#8888aa]">
                                            <div className="text-[20px]">✍️</div>
                                            <span className="text-[11px] font-bold">小組誠信背書區域</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ═══ 本週總結 ═══ */}
                <section className="space-y-10">
                    <div className="w5-section-head">
                        <h2>本週總結</h2>
                        <div className="line"></div>
                        <span className="mono">WRAP-UP</span>
                    </div>

                    <div className="bg-white border border-[#dddbd5] rounded-[10px] overflow-hidden">
                        <div className="bg-[#f8f7f4] p-5 border-b border-[#dddbd5] font-bold flex items-center gap-2">
                            <CheckCircle2 className="text-[#2e7d5a]" size={18} /> 本週結束，你應該要學會：
                        </div>
                        <div className="grid md:grid-cols-2 gap-px bg-[#dddbd5]">
                            {[
                                '用 A/B/C/D 四級判定文獻可信度，找出 AI 幻覺',
                                '辨識「換字抄襲」和「正確改寫」的差別，並能實際動筆',
                                '用三明治法（上層引入 + 引用 + 下層解釋）做直接引用',
                                '找到 3 篇真實可信的文獻，並能說明每篇的選用理由'
                            ].map((goal, idx) => (
                                <div key={idx} className="bg-white p-5 flex items-start gap-4">
                                    <div className="text-[#2e7d5a] mt-1 shrink-0"><CheckCircle2 size={14} /></div>
                                    <p className="text-[13px] text-[#4a4a6a]">{goal}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 本週作業 */}
                    <div className="bg-white border-2 border-[#1a1a2e] rounded-[10px] overflow-hidden">
                        <div className="bg-[#1a1a2e] p-5 flex items-center justify-between">
                            <div className="flex items-center gap-2 text-white font-bold">
                                <BookOpen size={18} /> 本週作業
                            </div>
                            <span className="text-[11px] font-['DM_Mono',monospace] text-white/60">DEADLINE: 下週一 23:59</span>
                        </div>
                        <div className="divide-y divide-[#dddbd5]">
                            {[
                                { part: '任務單', text: '文獻偵探任務單（雙面）拍照上傳', badge: 'IN-CLASS' },
                                { part: '線上闖關', text: '引用偵錯遊戲（10 題）過關截圖', badge: 'AFTER-CLASS' },
                                { part: '必備證物', text: '3 篇已查證文獻書目（帶去 W6 使用）', badge: 'CRITICAL' },
                            ].map((hw, idx) => (
                                <div key={idx} className="w5-hw-item group hover:bg-[#f8f7f4] transition-colors">
                                    <span className="w5-hw-part">{hw.part}</span>
                                    <span className="w5-hw-name">{hw.text}</span>
                                    <span className={`text-[9px] font-bold px-1.5 py-0.5 border rounded-[2px] ${hw.badge === 'CRITICAL' ? 'text-[#c0392b] border-[#f2dada] bg-[#fdecea]' :
                                        hw.badge === 'IN-CLASS' ? 'text-[#2e7d5a] border-[#e8f5ee] bg-[#e8f5ee]' :
                                            'text-[#2d5be3] border-[#e8eeff] bg-[#e8eeff]'
                                        }`}>{hw.badge}</span>
                                </div>
                            ))}
                        </div>
                        <div className="p-5 bg-[#f8f7f4] border-t border-[#dddbd5] flex flex-col sm:flex-row items-center justify-between gap-4">
                            <p className="text-[12px] text-[#8888aa]">請將作業（任務單投影、遊戲截圖）統一上傳至 Google Classroom。</p>
                            <a href="https://classroom.google.com/" target="_blank" rel="noopener noreferrer" className="bg-[#1a1a2e] text-white px-6 py-2 rounded-[4px] text-[12px] font-bold hover:bg-[#2d5be3] transition-colors flex items-center gap-2">
                                Classroom <ArrowRight size={14} />
                            </a>
                        </div>
                    </div>

                    {/* 下週預告 */}
                    <div className="bg-[#1a1a2e] rounded-[10px] p-10 text-white relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-500">
                            <AlertTriangle size={120} />
                        </div>
                        <div className="relative z-10">
                            <div className="text-[#2d5be3] text-[10px] font-['DM_Mono',monospace] tracking-widest mb-4 uppercase">Next Stop: W6 Clinic</div>
                            <h3 className="text-[24px] font-bold mb-8 font-['Noto_Serif_TC',serif]">下一站：研究診所與分科設計</h3>

                            <div className="grid md:grid-cols-2 gap-8 divide-x divide-white/10">
                                <div className="space-y-2">
                                    <h4 className="font-bold text-[#f0ede6] text-[15px]">W6 主題</h4>
                                    <p className="text-white/60 text-[13px] leading-relaxed">研究診所——依照研究方法分組，學習問卷 / 訪談 / 實驗 / 觀察 / 文獻分析的細節設計。</p>
                                </div>
                                <div className="pl-8 space-y-2">
                                    <h4 className="font-bold text-[#f0ede6] text-[15px]">⚠️ 必備裝備</h4>
                                    <p className="text-white/60 text-[13px] leading-relaxed">你要帶來 <strong>3 篇已查證的真實文獻書目</strong>。沒有文獻等於沒有工具，請在這週務必完成。</p>
                                </div>
                            </div>

                            <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-8 border-t border-white/10 pt-8">
                                <Link to="/w4" className="text-[13px] font-bold text-white/40 hover:text-white flex items-center gap-2 transition-colors">
                                    ← 回 W4 題目博覽會
                                </Link>
                                <Link to="/clinic" className="bg-white text-[#1a1a2e] px-10 py-3 rounded-[4px] text-[14px] font-bold hover:bg-[#2d5be3] hover:text-white transition-all flex items-center gap-2">
                                    前往 W6 研究診所 <ArrowRight size={18} />
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* 進入遊戲 CTA */}
                    <div className="bg-[#fdecea] border-2 border-[#c0392b] rounded-[10px] p-10 text-center relative overflow-hidden group">
                        <div className="absolute -top-10 -right-10 opacity-5 group-hover:rotate-12 transition-transform duration-700">
                            <Gamepad2 size={200} />
                        </div>
                        <h3 className="text-[22px] font-bold text-[#1a1a2e] mb-4 font-['Noto_Serif_TC',serif]">準備好接受挑戰了嗎？</h3>
                        <p className="text-[#4a4a6a] text-[15px] max-w-[600px] mx-auto leading-relaxed mb-8">
                            進入「行動代號：獵狐」，考驗你在各類學術陷阱中找出真相的眼力。
                        </p>
                        <Link
                            to="/game/citation-detective"
                            className="inline-flex items-center gap-3 bg-[#c0392b] text-white px-10 py-4 rounded-[6px] text-[16px] font-bold hover:bg-[#1a1a2e] transition-all shadow-lg hover:translate-y-[-2px]"
                        >
                            <Gamepad2 size={22} />
                            進入遊戲：行動代號：獵狐 <ArrowRight size={20} />
                        </Link>
                    </div>
                </section>
            </div>
        </div>
    );
};
