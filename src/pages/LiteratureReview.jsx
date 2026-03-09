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
    const [expandedSpecimens, setExpandedSpecimens] = useState({});

    // Toggle specimen expansion
    const toggleSpecimen = (id) => {
        setExpandedSpecimens(prev => ({ ...prev, [id]: !prev[id] }));
    };

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
        <div className="max-w-[1000px] mx-auto px-6 lg:px-12 py-12 animate-in fade-in slide-in-from-bottom-4 duration-500 font-sans text-[13px] leading-[1.6] text-[#1a1a2e] pb-32">
            <style dangerouslySetInnerHTML={{
                __html: `
                :root {
                    --ink: #1a1a2e; --ink-mid: #4a4a6a; --ink-light: #8888aa;
                    --paper: #f8f7f4; --paper-warm: #f0ede6;
                    --accent: #2d5be3; --accent-light: #e8eeff;
                    --gold: #c9a84c; --gold-light: #fdf6e3;
                    --success: #2e7d5a; --success-light: #e8f5ee;
                    --danger: #c0392b; --danger-light: #fdecea;
                    --border: #dddbd5; --border-mid: #c8c5bc;
                }
                .w5-meta-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 56px; }
                .w5-meta-card { background: #fff; border: 1px solid var(--border); border-radius: 12px; padding: 16px 20px; }
                .w5-meta-label { font-size: 11px; color: var(--ink-light); margin-bottom: 8px; font-weight: 500; }
                .w5-meta-value { font-size: 14px; font-weight: 700; color: var(--ink); line-height: 1.4; }
                
                .w5-grade-grid { display: grid; grid-template-columns: repeat(1, 1fr); gap: 1px; background: var(--border); border: 1px solid var(--border); border-radius: 10px; overflow: hidden; margin-bottom: 24px; }
                @media (min-width: 768px) { .w5-grade-grid { grid-template-columns: repeat(4, 1fr); } }
                .w5-grade-card { background: #fff; padding: 18px 16px; }
                .w5-grade-badge { display: inline-flex; align-items: center; gap: 6px; margin-bottom: 10px; }
                .w5-grade-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
                .w5-grade-letter { font-family: 'DM Mono', monospace; font-size: 16px; font-weight: 700; }
                .w5-grade-name { font-size: 11px; font-weight: 700; color: var(--ink); display: block; margin-bottom: 4px; }
                .w5-grade-examples { font-size: 11px; color: var(--ink-light); line-height: 1.7; }
                .w5-grade-usage { margin-top: 8px; font-size: 11px; padding: 6px 8px; border-radius: 4px; line-height: 1.5; }

                .w5-plagiarism-row { display: grid; grid-template-columns: 1fr; gap: 1px; background: var(--border); border: 1px solid var(--border); border-radius: 10px; overflow: hidden; margin-bottom: 24px; }
                @media (min-width: 768px) { .w5-plagiarism-row { grid-template-columns: repeat(3, 1fr); } }
                .w5-plag-card { background: #fff; padding: 18px 20px; }
                .w5-plag-icon { font-size: 18px; margin-bottom: 8px; }
                .w5-plag-title { font-size: 13px; font-weight: 700; color: var(--ink); margin-bottom: 6px; }
                .w5-plag-desc { font-size: 12px; color: var(--ink-mid); line-height: 1.7; }
                .w5-plag-example { margin-top: 10px; padding: 8px 10px; border-radius: 4px; font-size: 11px; line-height: 1.7; font-style: italic; }

                .w5-sandwich { border: 1px solid var(--border); border-radius: 10px; overflow: hidden; margin-bottom: 24px; }
                .w5-sandwich-layer { display: flex; align-items: flex-start; gap: 16px; padding: 16px 20px; }
                .w5-sandwich-icon { font-size: 20px; flex-shrink: 0; margin-top: 1px; }
                .w5-sandwich-role { font-size: 11px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; margin-bottom: 4px; }
                .w5-sandwich-desc { font-size: 13px; color: var(--ink-mid); line-height: 1.65; }

                .w5-specimen-grid { display: grid; grid-template-columns: 1fr; gap: 1px; background: var(--border); border: 1px solid var(--border); border-radius: 8px; overflow: hidden; margin-bottom: 12px; }
                @media (min-width: 768px) { .w5-specimen-grid { grid-template-columns: 1fr 1fr; } }
                .w5-specimen { background: #fff; padding: 14px 16px; }
                .w5-specimen-tag { font-family: 'DM Mono', monospace; font-size: 9px; padding: 2px 7px; border-radius: 3px; margin-bottom: 8px; display: inline-block; }
                .w5-specimen-title { font-size: 12px; font-weight: 700; color: var(--ink); margin-bottom: 4px; }
                .w5-specimen-meta { font-size: 11px; color: var(--ink-light); line-height: 1.65; }

                .w5-next-week-preview { background: var(--ink); border-radius: 10px; overflow: hidden; margin-bottom: 48px; border: 1px solid var(--border); }
                .w5-next-week-header { padding: 16px 24px; border-bottom: 1px solid rgba(255,255,255,0.06); display: flex; align-items: center; gap: 10px; }
                .w5-next-week-badge { font-family: 'DM Mono', monospace; font-size: 10px; background: rgba(255,255,255,0.1); color: rgba(255,255,255,0.5); padding: 2px 8px; border-radius: 3px; }
                .w5-next-week-title { font-size: 14px; font-weight: 700; color: #fff; }
                .w5-next-week-content { display: grid; grid-template-columns: 1fr 1fr; gap: 1px; background: rgba(255,255,255,0.05); }
                .w5-next-week-col { background: var(--ink); padding: 20px 24px; }
                .w5-next-week-label { font-size: 10px; font-family: 'DM Mono', monospace; color: rgba(255,255,255,0.3); margin-bottom: 4px; }
                .w5-next-week-text { font-size: 13px; color: rgba(255,255,255,0.75); line-height: 1.75; }

                .w5-notice { padding: 12px 16px; border-radius: 0 6px 6px 0; font-size: 13px; line-height: 1.75; margin-bottom: 32px; border-left: 4px solid transparent; }
                .w5-notice-danger { background: var(--danger-light); color: var(--danger); border-left-color: var(--danger); }
                .w5-notice-gold { background: var(--gold-light); color: #7a6020; border-left-color: var(--gold); }
                .w5-notice-accent { background: var(--accent-light); color: var(--accent); border-left-color: var(--accent); }
                .w5-notice-success { background: var(--success-light); color: var(--success); border-left-color: var(--success); }

                .w5-hw-item { background: #fff; padding: 12px 20px; display: flex; align-items: flex-start; gap: 16px; }
                .w5-hw-part { font-family: 'DM Mono', monospace; font-size: 11px; color: var(--accent); width: 80px; flex-shrink: 0; font-weight: 700; padding-top: 1px; }
                .w5-hw-name { font-size: 13px; color: var(--ink-mid); flex: 1; line-height: 1.65; }

                .w5-section-head { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; margin-top: 48px; }
                .w5-section-head h2 { font-family: 'Noto Serif TC', serif; font-size: 18px; font-weight: 700; color: var(--ink); white-space: nowrap; }
                .w5-section-head .line { flex: 1; height: 1px; background: var(--border); }
                .w5-section-head .mono { font-family: 'DM Mono', monospace; font-size: 10px; color: var(--ink-light); letter-spacing: 0.08em; }

                .w5-meta-strip { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px; background: var(--border); border: 1px solid var(--border); border-radius: 10px; overflow: hidden; margin-bottom: 48px; }
                .w5-meta-item { background: #fff; padding: 14px 18px; }
                .w5-meta-label { font-size: 10px; font-family: 'DM Mono', monospace; color: var(--ink-light); letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 4px; }
                .w5-meta-value { font-size: 13px; font-weight: 700; color: var(--ink); }
                .w5-section-desc { font-size: 14px; color: var(--ink-mid); margin-bottom: 32px; line-height: 1.6; max-width: 800px; }

                /* Forensic Record Sheet */
                .w5-record-card { border: 2px solid var(--ink); border-radius: 12px; overflow: hidden; background: #fff; margin-top: 48px; }
                .w5-record-hd { background: var(--ink); color: #fff; padding: 20px 24px; display: flex; align-items: center; justify-content: space-between; }
                .w5-record-title { font-family: 'Noto Serif TC', serif; font-size: 18px; font-weight: 700; }
                .w5-record-fields { padding: 20px 24px; display: grid; grid-template-columns: 1fr 2fr; gap: 20px; border-bottom: 1px solid var(--border); background: var(--paper-warm); }
                .w5-field-item { display: flex; align-items: center; gap: 12px; }
                .w5-field-label { font-size: 11px; font-weight: 700; color: var(--ink-mid); white-space: nowrap; }
                .w5-field-input { flex: 1; border-bottom: 1px solid var(--border-mid); background: transparent; padding: 4px 0; font-size: 13px; }
                .w5-record-rules { padding: 24px; }
                .w5-rule-title { font-size: 12px; font-weight: 700; color: var(--ink); margin-bottom: 16px; display: flex; align-items: center; gap: 8px; }
                .w5-rule-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
                .w5-rule-item { }
                .w5-rule-label { font-size: 10px; font-weight: 700; color: var(--accent); margin-bottom: 4px; display: block; }
                .w5-rule-desc { font-size: 12px; color: var(--ink-mid); line-height: 1.6; }

                .w5-specimen-grid { display: grid; grid-template-columns: 1fr; gap: 12px; margin-bottom: 12px; }
                .w5-specimen { background: #fff; border: 1px solid var(--border); border-radius: 10px; overflow: hidden; cursor: pointer; transition: all 0.2s; }
                .w5-specimen:hover { border-color: var(--accent); transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
                .w5-specimen-hd { padding: 16px 20px; display: flex; align-items: center; gap: 12px; }
                .w5-specimen-body { padding: 0 20px 20px 20px; border-top: 1px solid var(--paper-warm); background: #fafaf8; animation: slideDown 0.3s ease-out; }
                @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
                .w5-specimen-expand-btn { margin-left: auto; color: var(--ink-light); }
                .w5-specimen-detail-section { margin-top: 16px; }
                .w5-specimen-detail-label { font-size: 10px; font-weight: 700; color: var(--ink-light); text-transform: uppercase; margin-bottom: 4px; display: block; }
                .w5-specimen-detail-content { font-size: 12px; color: var(--ink-mid); line-height: 1.7; }
                .w5-specimen-link { color: var(--accent); text-decoration: underline; word-break: break-all; }

                @media (max-width: 768px) { .w5-meta-strip, .w5-record-fields, .w5-rule-grid { grid-template-columns: 1fr; } }
            ` }} />

            {/* TOP BAR / NAVIGATION PATH */}
            <div className="flex items-center justify-between border-b border-[#dddbd5] pb-4 mb-16">
                <div className="text-[11px] font-mono text-[#8888aa] flex items-center gap-2">
                    研究方法與專題 / 研究規劃 / <span className="text-[#1a1a2e] font-bold">文獻偵探社 W5</span>
                </div>
                <div className="flex items-center gap-4">
                    <span className="bg-[#f0ede6] text-[#1a1a2e] text-[10px] font-bold px-2 py-0.5 rounded-[2px] font-mono">100 MINS</span>
                    <button
                        onClick={() => setShowLessonMap(!showLessonMap)}
                        className="text-[11px] text-[#8888aa] hover:text-[#2d5be3] transition-colors flex items-center gap-1 font-mono"
                    >
                        <Map size={12} /> {showLessonMap ? 'Hide Plan' : 'Instructor View'}
                    </button>
                    <span className="bg-[#2d5be3] text-white text-[10px] font-bold px-2 py-0.5 rounded-[2px] font-mono">鑑識週</span>
                </div>
            </div>

            {showLessonMap && (
                <div className="animate-in slide-in-from-top-4 duration-300">
                    <LessonMap data={W5Data} />
                </div>
            )}

            {/* PAGE HEADER */}
            <header>
                <div className="text-[11px] font-mono text-[#2d5be3] mb-3 tracking-[0.06em]">🕵️ W5 · 研究規劃</div>
                <h1 className="font-serif text-[36px] font-bold leading-[1.2] text-[#1a1a2e] mb-4 tracking-[-0.02em]">
                    文獻偵探社：<span className="text-[#2d5be3] italic">找對證據，寫對引用</span>
                </h1>
                <p className="text-[15px] text-[#4a4a6a] max-w-[600px] leading-[1.75] mb-8">
                    AI 會幫你找文獻，但 AI 也會造假。今天你要學兩種能力：鑑識文獻的真偽與等級，以及合法引用而不抄襲。
                </p>

                {/* META STRIP */}
                <div className="w5-meta-strip">
                    {[
                        { label: '本週任務', value: '文獻鑑識 + 引用寫作' },
                        { label: '課堂產出', value: '文獻偵探任務單（雙面）' },
                        { label: '下週預告', value: '3 篇已查證的真實文獻' }
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
                <p className="w5-section-desc">掌握文獻等級 (A–D) 的判定標準與兩大查核路徑，學會親手分辨學術真相與 AI 幻覺。</p>

                {/* 四級制 */}
                <div className="space-y-4">
                    <div className="text-[10px] font-['DM_Mono',monospace] text-[#8888aa] uppercase tracking-widest">文獻可信度 · 四級判定標準</div>
                    <div className="w5-grade-grid">
                        <div className="w5-grade-card">
                            <div className="w5-grade-badge"><div className="w5-grade-dot" style={{ background: '#2e7d5a' }}></div><span className="w5-grade-letter" style={{ color: '#2e7d5a' }}>A 級</span></div>
                            <span className="w5-grade-name">主證據</span>
                            <div className="w5-grade-examples">同儕審查學術期刊<br />碩博士論文<br />政府/學術機構研究報告</div>
                            <div className="w5-grade-usage" style={{ background: 'var(--success-light)', color: 'var(--success)' }}>可當核心論據</div>
                        </div>
                        <div className="w5-grade-card">
                            <div className="w5-grade-badge"><div className="w5-grade-dot" style={{ background: '#2d5be3' }}></div><span className="w5-grade-letter" style={{ color: '#2d5be3' }}>B 級</span></div>
                            <span className="w5-grade-name">輔助證據</span>
                            <div className="w5-grade-examples">專家專書章節<br />官方智庫白皮書<br />正式專業媒體深度報導</div>
                            <div className="w5-grade-usage" style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>補脈絡，不能作唯一主證</div>
                        </div>
                        <div className="w5-grade-card">
                            <div className="w5-grade-badge"><div className="w5-grade-dot" style={{ background: 'var(--gold)' }}></div><span className="w5-grade-letter" style={{ color: 'var(--gold)' }}>C 級</span></div>
                            <span className="w5-grade-name">背景線索</span>
                            <div className="w5-grade-examples">科普書籍<br />維基百科<br />一般科普網站</div>
                            <div className="w5-grade-usage" style={{ background: 'var(--gold-light)', color: '#7a6020' }}>找方向、找關鍵字用，不當正式引用</div>
                        </div>
                        <div className="w5-grade-card" style={{ background: 'var(--paper-warm)' }}>
                            <div className="w5-grade-badge"><div className="w5-grade-dot" style={{ background: 'var(--danger)' }}></div><span className="w5-grade-letter" style={{ color: 'var(--danger)' }}>D 級</span></div>
                            <span className="w5-grade-name">不採用</span>
                            <div className="w5-grade-examples">AI 幻覺（查無此文）<br />內容農場、論壇貼文<br />社群媒體（含教授個人貼文）</div>
                            <div className="w5-grade-usage" style={{ background: 'var(--danger-light)', color: 'var(--danger)' }}>直接淘汰，格式再完美也不算</div>
                        </div>
                    </div>
                </div>

                {/* 查核步驟 */}
                <div className="space-y-4">
                    <div className="text-[10px] font-['DM_Mono',monospace] text-[#8888aa] uppercase tracking-widest">文獻查核 · 兩步驟</div>
                    <div className="grid md:grid-cols-2 gap-px bg-[#dddbd5] border border-[#dddbd5] rounded-[10px] overflow-hidden">
                        <div className="bg-white p-6 flex items-start gap-5">
                            <span className="text-[22px] font-bold text-[#2d5be3] font-mono leading-none">01</span>
                            <div>
                                <h4 className="font-bold text-[13px] mb-1">Google Scholar 查作者</h4>
                                <p className="text-[12px] text-[#4a4a6a] leading-relaxed">這個作者真的存在嗎？搜尋作者名字，看看他的學術主頁或其他論文是否找得到。</p>
                            </div>
                        </div>
                        <div className="bg-white p-6 flex items-start gap-5">
                            <span className="text-[22px] font-bold text-[#2d5be3] font-mono leading-none">02</span>
                            <div>
                                <h4 className="font-bold text-[13px] mb-1">華藝或 Scholar 查摘要</h4>
                                <p className="text-[12px] text-[#4a4a6a] leading-relaxed">這篇論文真的存在嗎？能找到摘要才算通過。標題、作者、摘要都對，才能用。</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="w5-notice w5-notice-danger">
                    ⚠️ 第一節課的證物鑑識實戰期間：<strong>禁止用 ChatGPT / NotebookLM 幫你判斷</strong>，你要自己去查證！查不到也是一種答案。
                </div>

                {/* 避免抄襲 */}
                <div className="space-y-4 pt-6">
                    <div className="text-[10px] font-['DM_Mono',monospace] text-[#8888aa] uppercase tracking-widest">學術寫作倫理 · 避坑指南</div>
                    <div className="w5-plagiarism-row">
                        {[
                            { icon: '❌', title: '無意抄襲', color: 'text-[#c0392b]', bg: 'bg-[#fdecea]', text: '粗心忘記標註來源。即便不是故意的，客觀上仍構成抄襲。', ex: '「睡眠不足會導致前額葉皮質功能下降…」↳ 忘記寫 (陳醫師, 2023)' },
                            { icon: '⚠️', title: '換字抄襲 Patchwriting', color: 'text-[#c9a84c]', bg: 'bg-[#fdf6e3]', text: '只把「使用」改成「應用」、「因此」改成「所以」，但句型結構完全沒變。', ex: '「睡眠不夠會造成前額葉皮質運作降低…」↳ 看起來不一樣，其實還是抄' },
                            { icon: '✅', title: '正確改寫 Paraphrasing', color: 'text-[#2e7d5a]', bg: 'bg-[#e8f5ee]', text: '消化吸收後，用自己的句型與語言重述，保留原意但表達方式完全不同。', ex: '打散句型、重組因果關係 ↳ 真正的理解後才能這樣寫' },
                        ].map((item, idx) => (
                            <div key={idx} className="w5-plag-card">
                                <div className="w5-plag-icon">{item.icon}</div>
                                <h4 className={`w5-plag-title ${item.color}`}>{item.title}</h4>
                                <p className="w5-plag-desc">{item.text}</p>
                                <div className={`w5-plag-example ${item.bg} ${item.color}`}>
                                    {item.ex}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 三明治法 */}
                <div className="space-y-6 pt-6">
                    <div className="text-[10px] font-['DM_Mono',monospace] text-[#8888aa] uppercase tracking-widest">直接引用 · 三明治寫作法 Sandwich Method</div>
                    <div className="w5-notice w5-notice-accent">
                        當原文是定義、權威名言或精確數據時，用直接引用。但不能把引文硬丟進去——那叫做「孤兒引用」（只有肉，沒有麵包）。
                    </div>

                    <div className="w5-sandwich">
                        <div className="w5-sandwich-layer bg-[#fdf6e3]">
                            <span className="w5-sandwich-icon">🍞</span>
                            <div>
                                <div className="w5-sandwich-role" style={{ color: 'var(--gold)' }}>Top / 引入</div>
                                <div className="w5-sandwich-desc">介紹背景，說明這句話是誰說的、在什麼脈絡下說的。讓讀者先有準備。</div>
                            </div>
                        </div>
                        <div className="h-px bg-[var(--border)]"></div>
                        <div className="w5-sandwich-layer bg-white">
                            <span className="w5-sandwich-icon">🥩</span>
                            <div>
                                <div className="w5-sandwich-role" style={{ color: 'var(--ink)' }}>Meat / 引用</div>
                                <div className="w5-sandwich-desc">放入加了引號的逐字原文，並在末尾標上引用來源 (作者, 年份)。</div>
                            </div>
                        </div>
                        <div className="h-px bg-[var(--border)]"></div>
                        <div className="w5-sandwich-layer bg-[#e8f5ee]">
                            <span className="w5-sandwich-icon">🍞</span>
                            <div>
                                <div className="w5-sandwich-role" style={{ color: 'var(--success)' }}>Bottom / 解釋</div>
                                <div className="w5-sandwich-desc">解釋這句話對你的研究有什麼意義。不要讓引文自己說話，你要告訴讀者為什麼這張圖片很重要。</div>
                            </div>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-px bg-[var(--border)] border border-[var(--border)] rounded-[10px] overflow-hidden">
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
            </section >

            {/* ═══ 練什麼 ═══ */}
            <section className="space-y-10">
                <div className="w5-section-head">
                    <h2>練什麼</h2>
                    <div className="line"></div>
                    <span className="mono">PRACTICE</span>
                </div>
                <p className="w5-section-desc">請觀看原始文獻與同學改寫，判斷這位學生的改寫有什麼問題？並練習正確的改寫，用你自己的話重述這段概念。</p>

                {/* 練習 1 */}
                <div className="bg-white border border-[var(--border)] rounded-[10px] overflow-hidden shadow-sm">
                    <div className="bg-[var(--paper-warm)] p-4 px-6 border-b border-[var(--border)] flex items-center gap-3">
                        <span className="bg-[var(--ink)] text-white text-[10px] font-bold px-2 py-0.5 rounded-[2px] font-mono">TASK 01</span>
                        <h3 className="font-bold text-[13px] text-[#1a1a2e]">改寫偵錯：這是「換字抄襲」嗎？</h3>
                    </div>
                    <div className="p-8 space-y-6">
                        <div className="space-y-2">
                            <div className="text-[10px] text-[var(--ink-light)] font-bold uppercase tracking-widest">原始文獻（陳醫師，2023）</div>
                            <div className="bg-[var(--paper)] border border-[var(--border)] p-4 px-6 rounded-[6px] text-[13px] italic text-[var(--ink-mid)] leading-relaxed">
                                「睡眠不足會導致前額葉皮質功能下降，進而削弱學生的專注力與情緒控管能力，長期下來可能引發焦慮症狀。」
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="text-[10px] text-[var(--danger)] font-bold uppercase tracking-widest">某位同學的改寫</div>
                            <div className="bg-[var(--danger-light)] border border-[#f2dada] p-4 px-6 rounded-[6px] text-[13px] italic text-[var(--ink-mid)] leading-relaxed">
                                睡眠不夠會<span className="bg-[#f2b8b1] px-1 rounded mx-0.5">造成</span>前額葉皮質<span className="bg-[#f2b8b1] px-1 rounded mx-0.5">運作降低</span>，進而<span className="bg-[#f2b8b1] px-1 rounded mx-0.5">減弱</span>同學的<span className="bg-[#f2b8b1] px-1 rounded mx-0.5">專心度和情緒管理</span>，時間久了可能<span className="bg-[#f2b8b1] px-1 rounded mx-0.5">產生焦慮的問題</span>。（陳醫師，2023）
                            </div>
                            <p className="text-[11px] text-[var(--danger)]">↑ 標色的詞是改掉的地方——句型結構完全沒變，這就是換字抄襲。</p>
                        </div>

                        <div className="pt-4 border-t border-[var(--border)]">
                            {revealedAnswers['p1'] ? (
                                <div className="bg-[var(--success-light)] border border-[var(--success)]/20 p-5 rounded-[6px] animate-in zoom-in-95 duration-200">
                                    <h5 className="font-bold text-[13px] text-[var(--success)] mb-2 uppercase flex items-center gap-2">
                                        <CheckCircle size={16} /> 正確改寫示範
                                    </h5>
                                    <p className="text-[13px] text-[var(--ink-mid)] leading-relaxed">
                                        根據陳醫師（2023）的研究，睡眠的重要性不只是讓身體休息。當一個人睡眠不足時，大腦負責高階思考的前額葉區域會受到影響，學生因此在課堂上更難集中注意力、也更容易情緒失控。若長期累積，還可能發展為焦慮問題。<br /><br />
                                        <span className="text-[11px] opacity-70 italic">關鍵：把「原因→結果」的結構改成「結論→機制→長期影響」，語言完全換過，但原意保留。</span>
                                    </p>
                                </div>
                            ) : (
                                <button
                                    onClick={() => handleUnlock('p1')}
                                    className="text-[11px] font-bold text-[var(--ink-light)] border border-[var(--border)] px-4 py-2 rounded-[4px] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all font-mono"
                                >
                                    {unlockCounts['p1'] > 0 ? `UNLOCK ANSWER (CLICK ${3 - unlockCounts['p1']} MORE)` : 'TEACHER UNLOCK'}
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* 練習 2 */}
                <div className="bg-white border border-[var(--border)] rounded-[10px] overflow-hidden shadow-sm">
                    <div className="bg-[var(--paper-warm)] p-4 px-6 border-b border-[var(--border)] flex items-center gap-3">
                        <span className="bg-[var(--ink)] text-white text-[10px] font-bold px-2 py-0.5 rounded-[2px] font-mono">TASK 02</span>
                        <h3 className="font-bold text-[13px] text-[#1a1a2e]">三明治法：把這句話寫進段落</h3>
                    </div>
                    <div className="p-8 space-y-6">
                        <div className="space-y-2">
                            <div className="text-[10px] text-[var(--ink-light)] font-bold uppercase tracking-widest">原始文獻（Sirois，2018）</div>
                            <div className="bg-[var(--paper)] border border-[var(--border)] p-4 px-6 rounded-[6px] text-[13px] italic text-[var(--ink-mid)] leading-relaxed">
                                「拖延症並非單純的時間管理失敗，而是一種情緒調節的失敗。人們透過拖延來逃避任務帶來的負面情緒。」
                            </div>
                        </div>
                        <p className="text-[13px] text-[var(--ink-mid)]">任務：用三明治法，把這句話寫入一篇關於「高中生讀書計畫」的文章段落中。</p>
                        <p className="text-[11px] text-[var(--ink-light)] italic">提示：上層麵包說一般人對拖延的誤解 → 中層引用 Sirois → 下層說明這對制定讀書計畫的啟示</p>

                        <div className="pt-4 border-t border-[var(--border)]">
                            {revealedAnswers['p2'] ? (
                                <div className="bg-[var(--success-light)] border border-[var(--success)]/20 p-5 rounded-[6px] animate-in zoom-in-95 duration-200">
                                    <h5 className="font-bold text-[13px] text-[var(--success)] mb-6 uppercase flex items-center gap-2">
                                        <CheckCircle size={16} /> 三明治法示範
                                    </h5>
                                    <div className="space-y-4 text-[13px] text-[var(--ink-mid)] leading-relaxed">
                                        <div className="flex gap-4">
                                            <span className="font-bold text-[var(--gold)] shrink-0">🍞 上層：</span>
                                            <p>許多學生在面對讀書計畫失敗時，第一反應常是責怪自己時間管理不善。然而，心理學研究提醒我們，拖延的根源可能比想像中更複雜。</p>
                                        </div>
                                        <div className="flex gap-4">
                                            <span className="font-bold text-[var(--ink)] shrink-0">🥩 中層：</span>
                                            <p>Sirois（2018）指出，「拖延症並非單純的時間管理失敗，而是一種情緒調節的失敗。人們透過拖延來逃避任務帶來的負面情緒。」</p>
                                        </div>
                                        <div className="flex gap-4">
                                            <span className="font-bold text-[var(--success)] shrink-0">🍞 下層：</span>
                                            <p>這對高中生制定計畫有重要啟示：若我們只追求排滿進度而忽略了對困難科目的畏懼，計畫終將因心理逃避而失效。因此，有效的時間管理必須包含對負面情緒的覺察與調節。</p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <button
                                    onClick={() => handleUnlock('p2')}
                                    className="text-[11px] font-bold text-[var(--ink-light)] border border-[var(--border)] px-4 py-2 rounded-[4px] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all font-mono"
                                >
                                    {unlockCounts['p2'] > 0 ? `UNLOCK ANSWER (CLICK ${3 - unlockCounts['p2']} MORE)` : 'TEACHER UNLOCK'}
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* 練習 3 */}
                <div className="bg-white border border-[var(--border)] rounded-[10px] overflow-hidden shadow-sm">
                    <div className="bg-[var(--paper-warm)] p-4 px-6 border-b border-[var(--border)] flex items-center gap-3">
                        <span className="bg-[var(--ink)] text-white text-[10px] font-bold px-2 py-0.5 rounded-[2px] font-mono">TASK 03</span>
                        <h3 className="font-bold text-[13px] text-[#1a1a2e]">挑戰：多重文獻綜合</h3>
                    </div>
                    <div className="p-8 space-y-6">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <div className="text-[10px] text-[var(--ink-light)] font-bold uppercase tracking-widest">文獻 A（Lee，2021）</div>
                                <div className="bg-[var(--paper)] border border-[var(--border)] p-3 rounded-[6px] text-[12px] italic text-[var(--ink-mid)]">
                                    「手機通知會引發多巴胺分泌，使大腦不斷期待新訊息，導致深度工作能力下降。」
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="text-[10px] text-[var(--ink-light)] font-bold uppercase tracking-widest">文獻 B（Smith，2022）</div>
                                <div className="bg-[var(--paper)] border border-[var(--border)] p-3 rounded-[6px] text-[12px] italic text-[var(--ink-mid)]">
                                    「頻繁切換任務（如邊讀書邊回訊息）會增加 40% 的認知負擔，並降低學習成效率。」
                                </div>
                            </div>
                        </div>
                        <p className="text-[13px] text-[var(--ink-mid)]">任務：嘗試將這兩篇文獻整合成一句話，說明手機對學習的負面影響。</p>

                        <div className="pt-4 border-t border-[var(--border)]">
                            {revealedAnswers['p3'] ? (
                                <div className="bg-[var(--success-light)] border border-[var(--success)]/20 p-5 rounded-[6px] animate-in zoom-in-95 duration-200">
                                    <h5 className="font-bold text-[13px] text-[var(--success)] mb-2 uppercase flex items-center gap-2">
                                        <CheckCircle size={16} /> 綜合寫作示範
                                    </h5>
                                    <p className="text-[13px] text-[var(--ink-mid)] leading-relaxed">
                                        研究顯示，手機通知不僅會透過多巴胺機制干擾大腦專注於深層事務（Lee, 2021），隨之而來的任務切換更會大幅增加大腦的認知負荷，進而損害整體的學習績效（Smith, 2022）。<br /><br />
                                        <span className="text-[11px] opacity-70 italic">關鍵：用一個邏輯（干擾機制 → 認知後果）把兩者串起來，並分別標記出處。</span>
                                    </p>
                                </div>
                            ) : (
                                <button
                                    onClick={() => handleUnlock('p3')}
                                    className="text-[11px] font-bold text-[var(--ink-light)] border border-[var(--border)] px-4 py-2 rounded-[4px] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all font-mono"
                                >
                                    {unlockCounts['p3'] > 0 ? `UNLOCK ANSWER (CLICK ${3 - unlockCounts['p3']} MORE)` : 'TEACHER UNLOCK'}
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* 五份證物預覽 */}
                <div className="space-y-4 pt-6">
                    <div className="text-[10px] font-['DM_Mono',monospace] text-[var(--ink-light)] uppercase tracking-widest">課堂實戰 · 五份證物預覽（點擊展開鑑定細節）</div>
                    <p className="w5-section-desc" style={{ marginTop: '8px', marginBottom: '0' }}>
                        請小組成員共同協作，運用課堂所學的文獻等級 (A–D) 與查核路徑，依序鑑定下列五份證物的真實性與學術價值。
                    </p>
                    <div className="w5-specimen-grid">
                        {[
                            {
                                id: 'A',
                                title: '台中市高中職學生數學焦慮、數學自我效能與數學學業成就關係之研究',
                                badge: '證物 A',
                                color: 'var(--success)',
                                bg: 'var(--success-light)',
                                info: [
                                    { label: '作者', content: '鄭淑米' },
                                    { label: '指導教授', content: '蔡蓉青' },
                                    { label: '年份', content: '2006' },
                                    { label: '來源', content: '碩士論文' }
                                ],
                                abstract: '本研究旨在瞭解高中職一年級學生數學焦慮與數學自我效能的現況，並探討其與數學學業成就之關係。研究採問卷調查法，抽樣若干學生，回收有效問卷後進行統計分析。',
                                link: 'https://www.airitilibrary.com/Article/Detail/U0021-2304200714313183'
                            },
                            {
                                id: 'B',
                                title: 'Smartphone Usage and Sleep Quality in Taiwanese Adolescents: A Longitudinal Study',
                                badge: '證物 B',
                                color: 'var(--danger)',
                                bg: 'var(--danger-light)',
                                info: [
                                    { label: 'Authors', content: 'Michael Chen, Sarah Wang' },
                                    { label: 'Year', content: '2023' },
                                    { label: 'Journal', content: 'Journal of Sleep Research and Technology' },
                                    { label: 'Volume', content: 'Vol. 18(4), pp. 234-251' },
                                    { label: 'DOI', content: '10.1177/0272989X241231721' }
                                ],
                                abstract: 'This longitudinal study followed Taiwanese high school students for three years. Results indicated that excessive smartphone use predicted poorer sleep outcomes. The authors recommend stricter school policies to reduce smartphone exposure.',
                                keywords: 'smartphone use; sleep quality; adolescents; longitudinal'
                            },
                            {
                                id: 'C',
                                title: '我的不正經人生觀',
                                badge: '證物 C',
                                color: 'var(--gold)',
                                bg: 'var(--gold-light)',
                                info: [
                                    { label: '作者', content: '黃益中' },
                                    { label: '出版社', content: '寶瓶文化' },
                                    { label: '出版年', content: '2019' },
                                    { label: 'ISBN', content: '978-986-406-159-4' }
                                ],
                                abstract: '本書以教育現場的案例與社會觀察，討論青少年成長、學習動機、人際互動與價值選擇等議題。內容包含作者的觀點、故事與整理。'
                            },
                            {
                                id: 'D',
                                title: '生活小竅門 教你如何治療燒傷燙傷',
                                badge: '證物 D',
                                color: 'var(--danger)',
                                bg: 'var(--danger-light)',
                                info: [
                                    { label: '來源', content: '每日頭條' },
                                    { label: '作者', content: '生活竅門點點通' },
                                    { label: '日期', content: '2016-11-03' },
                                    { label: '主要主張', content: '使用蔥葉貼敷、蛋清、大白菜等民間療法處理燒燙傷。' }
                                ],
                                abstract: '文章整理燒燙傷常見來源與民間處理法：蔥葉貼敷、蛋清加糖、蛋膜貼敷、蛋黃熬油、大白菜外敷、蘆薈塗抹、石灰香油膏等。並強調第一時間以清潔冷水沖洗或浸泡降溫止痛、減少起泡。',
                                link: 'www.health-info-farm.com/xxx'
                            },
                            {
                                id: 'E',
                                title: '【Facebook 貼文】國家教育研究院｜全國多所學校開始限制學生上課使用手機…',
                                badge: '證物 E',
                                color: 'var(--accent)',
                                bg: 'var(--accent-light)',
                                info: [
                                    { label: '發佈者', content: '國家教育研究院🏛️' },
                                    { label: '粉專連結', content: '國家教育研究院官方 FB' },
                                    { label: '發佈日期', content: '2026年1月5日 17:05' }
                                ],
                                abstract: '全國多所學校開始限制學生上課使用手機，休息時間也有 63% 禁用。老師們普遍支持，期望恢復純粹的學習環境。但面對 AI 與數位時代，也有教師持保留態度。科技與教育該如何平衡？',
                                link: 'https://is.gd/xDIT6f'
                            }
                        ].map((specimen) => (
                            <div
                                key={specimen.id}
                                className="w5-specimen"
                                onClick={() => toggleSpecimen(specimen.id)}
                            >
                                <div className="w5-specimen-hd">
                                    <span
                                        className="w5-specimen-tag"
                                        style={{ background: specimen.bg, color: specimen.color }}
                                    >
                                        {specimen.badge}
                                    </span>
                                    <h4 className="w5-specimen-title">{specimen.title}</h4>
                                    <div className="w5-specimen-expand-btn">
                                        {expandedSpecimens[specimen.id] ? <ChevronRight size={16} className="rotate-90" /> : <ChevronRight size={16} />}
                                    </div>
                                </div>
                                {expandedSpecimens[specimen.id] && (
                                    <div className="w5-specimen-body">
                                        <div className="grid grid-cols-2 gap-4">
                                            {specimen.info.map((info, idx) => (
                                                <div key={idx} className="w5-specimen-detail-section">
                                                    <span className="w5-specimen-detail-label">{info.label}</span>
                                                    <div className="w5-specimen-detail-content">{info.content}</div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="w5-specimen-detail-section">
                                            <span className="w5-specimen-detail-label">{specimen.id === 'D' || specimen.id === 'C' ? '內容節錄 / 簡介' : '摘要節錄'}</span>
                                            <div className="w5-specimen-detail-content italic">{specimen.abstract}</div>
                                        </div>
                                        {specimen.keywords && (
                                            <div className="w5-specimen-detail-section">
                                                <span className="w5-specimen-detail-label">Keywords</span>
                                                <div className="w5-specimen-detail-content font-mono text-[10px]">{specimen.keywords}</div>
                                            </div>
                                        )}
                                        {specimen.link && (
                                            <div className="w5-specimen-detail-section border-t border-[var(--border)] pt-3">
                                                <span className="w5-specimen-detail-label">連結</span>
                                                <a href={specimen.link} target="_blank" rel="noopener noreferrer" className="w5-specimen-link text-[11px]" onClick={(e) => e.stopPropagation()}>
                                                    {specimen.link}
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="w5-notice w5-notice-gold">
                        💡 <strong>查證提醒</strong>：其中隱藏了 A、B、D 三種陷阱——包括「查無此人」的 AI 幻覺、內容農場、以及難辨等級的社群發文。請依照兩步驟路徑進行偵查。
                    </div>
                </div>
            </section >

            {/* ═══ 課堂任務 ═══ */}
            <section className="space-y-10">
                <div className="w5-section-head">
                    <h2>課堂任務</h2>
                    <div className="line"></div>
                    <span className="mono">IN-CLASS</span>
                </div>
                <p className="w5-section-desc">第一節課你將與小組成員一起鑑識五份神秘證物；第二節課則要為自己的研究題目找齊三篇真實文獻並進行互審。</p>

                <div className="space-y-4">
                    {[
                        { id: '1', title: '小組證物鑑識實戰（第一節，禁 AI）', icon: <Search size={18} />, bg: 'bg-[#fdecea]', border: 'border-[#f2dada]', notice: '🔍 查不到也是一種答案。標題聳動不一定假，社群發文不一定真——判斷的依據是查核路徑，不是感覺。', tasks: ['領取一組五份證物包 + 鑑識紀錄表', '小組討論，判定每份證物的等級 (A / B / C / D)', '每份至少寫出 2 個判定理由，並記下查核路徑', '老師公布答案：特別注意證物 B 是 AI 幻覺'] },
                        { id: '2', title: '寫作倫理特訓——改寫 + 三明治法（第一節後半）', icon: <PenTool size={18} />, bg: 'bg-[#fdf6e3]', border: 'border-[#f4ede6]', notice: '💡 實戰演練 3（多重文獻綜合）視時間而定，未完成可當課後作業。', tasks: ['拿出任務單（正面），看「實戰演練 1」', '判斷：那位同學的改寫犯了什麼錯？畫線圈出來', '自己動筆，寫出正確的改寫版本 (打散句型重組)', '看「實戰演練 2」，用三明治法把 Sirois 的拖延症名言寫進段落', '注意：最容易漏掉的是下層麵包'] },
                    ].map(task => (
                        <div key={task.id} className="bg-white border border-[#dddbd5] rounded-[10px] overflow-hidden shadow-sm">
                            <div className="bg-[#f0ede6] p-4 px-6 border-b border-[#dddbd5] flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span className="bg-[#1a1a2e] text-white text-[10px] font-bold px-2 py-0.5 rounded-[2px] font-mono">TASK 0{task.id}</span>
                                    <h3 className="font-bold text-[13px] text-[#1a1a2e]">{task.title}</h3>
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
                                <span className="bg-[#2d5be3] text-white text-[10px] font-bold px-2 py-0.5 rounded-[2px] font-mono">TASK 03</span>
                                <h3 className="font-bold text-[13px] text-[#1a1a2e]">找自己的 3 篇文獻 + NotebookLM 實戰（第二節）</h3>
                            </div>
                            <div className="text-[#8888aa]"><Bot size={18} /></div>
                        </div>
                        <div className="p-8 space-y-8">
                            <div className="grid md:grid-cols-2 gap-10">
                                <div className="space-y-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-[#8888aa] uppercase tracking-widest font-mono">My Topic</label>
                                        <input
                                            className="w-full border border-[#dddbd5] rounded-[4px] px-4 py-2.5 text-[13px] focus:outline-none focus:border-[#2d5be3] bg-[#f8f7f4]"
                                            placeholder="輸入 W4 定案題目..."
                                            value={myTopic}
                                            onChange={e => setMyTopic(e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-[#8888aa] uppercase tracking-widest font-mono">AI Key Recommendation</label>
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
                                    <div className="w5-notice w5-notice-danger">
                                        🤖 AI 可能給你假文獻！每一篇都要自己去查證真實性。
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-[#dddbd5] rounded-[10px] overflow-hidden shadow-sm">
                        <div className="bg-[#f0ede6] p-4 px-6 border-b border-[#dddbd5] flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <span className="bg-[#2e7d5a] text-white text-[10px] font-bold px-2 py-0.5 rounded-[2px] font-mono">TASK 04</span>
                                <h3 className="font-bold text-[13px] text-[#1a1a2e]">同儕互審 Peer Review（第二節後半）</h3>
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

                    {/* 文獻偵探社：證物鑑識紀錄表 */}
                    <div className="w5-record-card">
                        <div className="w5-record-hd">
                            <div className="w5-record-title">W5 文獻偵探社：證物鑑識紀錄表</div>
                            <div className="text-[10px] font-mono opacity-60">FORM ID: W5-SPECIMEN-FORENSICS</div>
                        </div>
                        <div className="w5-record-fields">
                            <div className="w5-field-item">
                                <span className="w5-field-label">組別：</span>
                                <input className="w5-field-input" placeholder="NO." />
                            </div>
                            <div className="w5-field-item">
                                <span className="w5-field-label">探員簽名：</span>
                                <input className="w5-field-input" placeholder="班級座號姓名" />
                            </div>
                        </div>
                        <div className="w5-record-rules">
                            <div className="w5-rule-title">
                                <ShieldAlert size={14} className="text-var(--danger)" /> 【鑑識規則】
                            </div>
                            <div className="w5-rule-grid">
                                <div className="w5-rule-item">
                                    <span className="w5-rule-label">等級判定</span>
                                    <p className="w5-rule-desc">A級 (主證據) / B級 (輔助) / C級 (背景) / D級 (不採用)</p>
                                </div>
                                <div className="w5-rule-item">
                                    <span className="w5-rule-label">用途說明</span>
                                    <p className="w5-rule-desc">參考課堂投影片說明之文獻定位與引用時機。</p>
                                </div>
                                <div className="w5-rule-item">
                                    <span className="w5-rule-label">理由陳述</span>
                                    <p className="w5-rule-desc">至少寫出 2 個你在證物中看到的查核線索。</p>
                                </div>
                                <div className="w5-rule-item">
                                    <span className="w5-rule-label">查核路徑</span>
                                    <p className="w5-rule-desc">記錄你是如何查證該文獻真實性的（如：Google Scholar）。</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-var(--paper-warm) p-4 px-6 border-t border-var(--border) text-[11px] text-var(--ink-light) italic">
                            💡 請對每個證物（A–E）進行嚴密判定，查核路徑需具備可複現性。
                        </div>
                    </div>
                </div>
            </section >

            {/* ═══ 本週總結 ═══ */}
            <section className="space-y-10">
                <div className="w5-section-head">
                    <h2>本週總結</h2>
                    <div className="line"></div>
                    <span className="mono">WRAP-UP</span>
                </div>

                <div className="bg-white border border-[var(--border)] rounded-[10px] overflow-hidden shadow-sm">
                    <div className="bg-[var(--paper-warm)] p-5 border-b border-[var(--border)] font-bold flex items-center gap-2">
                        <span className="text-[var(--success)]"><CheckCircle2 size={18} /></span> 本週結束，你應該要學會：
                    </div>
                    <div className="grid md:grid-cols-2 gap-px bg-[var(--border)]">
                        {[
                            '用 A/B/C/D 四級判定文獻可信度，找出 AI 幻覺',
                            '辨識「換字抄襲」和「正確改寫」的差別，並能實際動筆',
                            '用三明治法（上層引入 + 引用 + 下層解釋）做直接引用',
                            '找到 3 篇真實可信的文獻，並能說明每篇的選用理由'
                        ].map((goal, idx) => (
                            <div key={idx} className="bg-white p-5 flex items-start gap-4">
                                <span className="text-[var(--success)] mt-1"><CheckCircle2 size={14} /></span>
                                <p className="text-[13px] text-[var(--ink-mid)]">{goal}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 本週作業 */}
                <div className="bg-white border-2 border-[var(--ink)] rounded-[10px] overflow-hidden shadow-sm">
                    <div className="bg-[var(--ink)] p-5 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-white font-bold">
                            <BookOpen size={18} /> 本週作業
                        </div>
                        <span className="text-[11px] font-mono text-white/60">DEADLINE: 下週一 23:59</span>
                    </div>
                    <div className="divide-y divide-[var(--border)]">
                        {[
                            { part: '任務單', text: '文獻偵探任務單（雙面）拍照上傳', badge: 'IN-CLASS' },
                            { part: '線上闖關', text: '引用偵錯遊戲（10 題）過關截圖', badge: 'AFTER-CLASS' },
                            { part: '必備證物', text: '3 篇已查證文獻書目（帶去 W6 使用）', badge: 'CRITICAL' },
                        ].map((hw, idx) => (
                            <div key={idx} className="w5-hw-item group hover:bg-[var(--paper)] transition-colors">
                                <span className="w5-hw-part">{hw.part}</span>
                                <span className="w5-hw-name">{hw.text}</span>
                                <span className={`text-[9px] font-bold px-1.5 py-0.5 border rounded-[2px] ${hw.badge === 'CRITICAL' ? 'text-[var(--danger)] border-[var(--danger-light)] bg-[var(--danger-light)]' :
                                    hw.badge === 'IN-CLASS' ? 'text-[var(--success)] border-[var(--success-light)] bg-[var(--success-light)]' :
                                        'text-[var(--accent)] border-[var(--accent-light)] bg-[var(--accent-light)]'
                                    }`}>{hw.badge}</span>
                            </div>
                        ))}
                    </div>
                    <div className="p-5 bg-[var(--paper-warm)] border-t border-[var(--border)] flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="text-[12px] text-[var(--ink-light)]">請將作業（任務單折疊、遊戲截圖）統一上傳至 Google Classroom。</p>
                        <a href="https://classroom.google.com/" target="_blank" rel="noopener noreferrer" className="bg-[var(--ink)] text-white px-6 py-2 rounded-[4px] text-[12px] font-bold hover:bg-[var(--accent)] transition-colors flex items-center gap-2">
                            Classroom <ArrowRight size={14} />
                        </a>
                    </div>
                </div>

                {/* 導航與預告 */}
                <section className="space-y-8">
                    <div className="w5-next-week-preview">
                        <div className="w5-next-week-header">
                            <span className="w5-next-week-badge">NEXT WEEK</span>
                            <h3 className="w5-next-week-title">W6 預告</h3>
                        </div>
                        <div className="w5-next-week-content">
                            <div className="w5-next-week-col">
                                <div className="w5-next-week-label">W6 主題</div>
                                <p className="w5-next-week-text">研究診所——依照研究方法分組，深入學習問卷 / 訪談 / 實驗 / 觀察 / 文獻分析各自的細節設計。</p>
                            </div>
                            <div className="w5-next-week-col">
                                <div className="w5-next-week-label">你要帶來</div>
                                <p className="w5-next-week-text"><strong>3 篇已查證的真實文獻書目</strong>——W6 課堂會直接用。沒有文獻等於沒有帶教材，請確認在這週完成。</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-between items-center py-12 border-t border-[var(--border)]">
                        <Link to="/w4" className="text-[13px] font-bold text-[var(--ink-light)] hover:text-[var(--ink)] flex items-center gap-2 transition-colors">
                            ← 回 W4 題目博覽會
                        </Link>
                        <Link to="/w6" className="bg-[var(--ink)] text-white px-8 py-3 rounded-[6px] text-[13px] font-bold hover:bg-[var(--ink-mid)] transition-all flex items-center gap-2 group">
                            前往 W6 研究診所 <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </section>

                {/* 進入遊戲 CTA */}
                <div className="bg-[var(--danger-light)] border-2 border-[var(--danger)] rounded-[10px] p-10 text-center relative overflow-hidden group">
                    <div className="absolute -top-10 -right-10 opacity-5 group-hover:rotate-12 transition-transform duration-700">
                        <Gamepad2 size={200} />
                    </div>
                    <h3 className="text-[22px] font-bold text-[var(--ink)] mb-4 font-['Noto_Serif_TC',serif]">準備好接受挑戰了嗎？</h3>
                    <p className="text-[var(--ink-mid)] text-[15px] max-w-[600px] mx-auto leading-relaxed mb-8">
                        進入「行動代號：獵狐」，考驗你在各類學術陷阱中找出真相的眼力。
                    </p>
                    <Link
                        to="/game/citation-detective"
                        className="inline-flex items-center gap-3 bg-[var(--danger)] text-white px-10 py-4 rounded-[6px] text-[16px] font-bold hover:bg-[var(--ink)] transition-all shadow-lg hover:translate-y-[-2px]"
                    >
                        <Gamepad2 size={22} />
                        進入遊戲：行動代號：獵狐 <ArrowRight size={20} />
                    </Link>
                </div>
            </section>
        </div>
    );
};
