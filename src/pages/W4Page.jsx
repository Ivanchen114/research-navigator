import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Map, ArrowRight, ArrowLeft, CheckCircle2, ShieldAlert, Search, Zap, Palette, Users2, Target, BookOpen, ClipboardCheck, Lightbulb } from 'lucide-react';
import LessonMap from '../components/ui/LessonMap';
import CopyButton from '../components/ui/CopyButton';
import { W4Data } from '../data/lessonMaps';

export const W4Page = () => {
    const [showLessonMap, setShowLessonMap] = useState(false);
    const [selectedMethod, setSelectedMethod] = useState('');

    // Form States
    const [w3Topic, setW3Topic] = useState('');
    const [myDraftTitle, setMyDraftTitle] = useState('');
    const [myDraftAssumptions, setMyDraftAssumptions] = useState('');
    const [finalTopic, setFinalTopic] = useState('');

    const posterPrompt = `我的研究海報需要以下元素：\n- 研究題目：${w3Topic || '【貼上 W3 定案題目】'}\n- 吸引人的標題草稿：${myDraftTitle || '【貼上你的草稿】'}\n- 預期發現草稿：${myDraftAssumptions || '【貼上你的預測】'}\n\n請幫我：\n1. 優化標題，讓它更吸引高中生，保持白話但加一點懸疑感\n2. 把預期發現改寫得更有研究感（加入「可能」「推測」等詞）\n3. 給我 2 個版本讓我選\n\n請保持在我原本的研究範圍內，不要幫我改題目方向。`;
    const keywordPrompt = `我的研究題目是：${finalTopic || '【貼上你的定案題目】'}\n\n請幫我：\n1. 列出 5 個相關的繁體中文學術關鍵字\n2. 列出 5 個對應的英文學術關鍵字\n3. 告訴我這個研究方向在學術界通常叫什麼名稱\n\n請不要改我的研究題目，只幫我找關鍵字。`;

    return (
        <div className="page-container animate-in-fade-slide">
            {/* TOP BAR / NAVIGATION PATH */}
            <div className="flex items-center justify-between border-b border-[#dddbd5] pb-4 mb-12">
                <div className="text-[11px] font-mono text-[#8888aa] flex items-center gap-2">
                    研究方法與專題 / 研究規劃 / <span className="text-[#1a1a2e] font-bold">題目博覽會 W4</span>
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
                <div className="mb-12">
                    <LessonMap data={W4Data} />
                </div>
            )}

            {/* PAGE HEADER */}
            <header className="mb-16">
                <div className="text-[11px] font-mono text-[#2d5be3] mb-3 tracking-[0.06em] uppercase">🖼 W4 · 研究規劃</div>
                <h1 className="font-serif text-4xl font-bold leading-tight text-[#1a1a2e] mb-4 tracking-tight">
                    題目博覽會：<span className="text-[#2d5be3] italic">壓力測試 → 真正定案</span>
                </h1>
                <p className="text-base text-[#4a4a6a] max-w-[680px] leading-relaxed mb-10">
                    W3 的定案是入場券，W4 才是壓力測試。你的題目要在三十幾個同學面前站得住腳——過了，才算真正的定案。
                </p>

                {/* META STRIP */}
                <div className="meta-strip">
                    {W4Data.metaCards.map((item, idx) => (
                        <div key={idx} className="meta-item">
                            <div className="meta-label">{item.label}</div>
                            <div className="meta-value">{item.value}</div>
                        </div>
                    ))}
                </div>

                {/* COURSE ARC */}
                <div className="mb-14">
                    <div className="text-[11px] font-mono text-[#8888aa] mb-4 uppercase tracking-wider">課程弧線 · 你在哪裡</div>
                    <div className="arc-grid">
                        {W4Data.courseArc.map((item, idx) => (
                            <div key={idx} className={`arc-item ${item.past ? 'past' : item.now ? 'now' : ''}`}>
                                <div className="arc-wk">{item.wk} {item.now && '← 現在'}</div>
                                <div className="arc-name">{item.name.split('\n').map((line, i) => <div key={i}>{line}</div>)}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </header>

            <div className="section-head">
                <h2>學什麼</h2>
                <div className="line"></div>
                <span className="mono">CONCEPT</span>
            </div>
            <p className="section-desc">了解如何利用同儕回饋來精煉你的題目，並學習如何從圖書館與資料庫中挖出最相關的學術寶藏。</p>

            {/* PRESSURE TEST COMPARISON */}
            <div className="content-grid grid-cols-1 md:grid-cols-2 mb-12">
                <div className="content-item border-r border-[#dddbd5]">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-2 h-2 rounded-full bg-[#c9a84c]"></div>
                        <span className="font-bold text-[#c9a84c] text-[13px]">W3 最終定案</span>
                        <span className="font-mono text-[10px] text-[#8888aa] ml-2 uppercase">入場券</span>
                    </div>
                    <ul className="list-disc pl-5 space-y-2 text-sm text-[#4a4a6a]">
                        <li>你自己認可的版本</li>
                        <li>通過 5W1H + 可行性快篩</li>
                        <li>AI 幫你包裝過語言</li>
                        <li>只有你自己看過</li>
                    </ul>
                </div>
                <div className="content-item bg-[#f0f7f4]">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-2 h-2 rounded-full bg-[#2e7d5a]"></div>
                        <span className="font-bold text-[#2e7d5a] text-[13px]">W4 最終定案</span>
                        <span className="font-mono text-[10px] text-[#2e7d5a]/60 ml-2 uppercase">真正定案</span>
                    </div>
                    <ul className="list-disc pl-5 space-y-2 text-sm text-[#4a4a6a]">
                        <li>經過三十幾人壓力測試</li>
                        <li>收到同學的具體建議</li>
                        <li>你有判斷地接受或拒絕</li>
                        <li>你能清楚說明為什麼</li>
                    </ul>
                </div>
            </div>

            {/* POSTER GRID */}
            <div className="content-grid grid-cols-2 md:grid-cols-5 mb-14">
                {W4Data.posterElements.map(item => (
                    <div className={`p-5 flex flex-col gap-2 ${item.h ? 'bg-[#1a1a2e] text-white' : 'bg-white'}`} key={item.n}>
                        <div className={`font-mono text-xl font-bold ${item.h ? 'text-[#c9a84c]' : 'text-[#2d5be3]'}`}>{item.n}</div>
                        <div className={`font-bold text-[13px] ${item.h ? 'text-white' : 'text-[#1a1a2e]'}`}>{item.l}</div>
                        <div className={`text-[11px] leading-relaxed ${item.h ? 'text-white/50' : 'text-[#8888aa]'}`}>{item.d}</div>
                    </div>
                ))}
            </div>

            {/* POSTER EXAMPLE */}
            <div className="flex items-center gap-3 mb-4">
                <span className="section-label !mb-0">範例 EXAMPLE</span>
                <span className="text-[10px] font-mono text-[#8888aa] uppercase tracking-wider">優質海報範例：滑手機與睡眠</span>
            </div>

            <div className="border border-[#dddbd5] rounded-xl overflow-hidden bg-white mb-16 shadow-sm">
                <div className="p-4 px-5 bg-[#f0f7f4] border-b border-[#dddbd5] flex items-center gap-3">
                    <CheckCircle2 size={16} className="text-[#2e7d5a]" />
                    <span className="font-bold text-sm text-[#1a1a2e]">案例：為什麼你的大腦停不下來？</span>
                    <span className="text-[11px] text-[#2e7d5a]/60 ml-auto">這是一張會吸引人停下來的海報</span>
                </div>
                <div className="p-8 md:p-12">
                    <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-12">
                        {/* Visual Column */}
                        <div>
                            <div className="text-[11px] font-mono text-[#8888aa] mb-4 uppercase tracking-widest font-bold">視覺海報 (A4 內容)</div>
                            <div className="border border-[#dddbd5] rounded-xl overflow-hidden shadow-xl shadow-black/5 aspect-[1/1.414] bg-[#f8f7f4] flex items-center justify-center group overflow-hidden relative">
                                <img src="/images/user_research_poster.png" alt="User Research Poster" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors pointer-events-none"></div>
                            </div>
                        </div>

                        {/* Analysis Column */}
                        <div className="flex flex-col">
                            <div className="text-[11px] font-mono text-[#8888aa] mb-6 uppercase tracking-widest font-bold">文字分析 (W3 定案轉換)</div>
                            <div className="space-y-8 mb-10">
                                <div className="p-5 bg-[#f8f7f4] rounded-lg border-l-4 border-[#2d5be3]">
                                    <div className="text-[11px] font-mono text-[#8888aa] mb-2 uppercase">標題 & 題目</div>
                                    <h4 className="text-xl font-bold text-[#1a1a2e] mb-2 leading-tight">滑手機真的會讓你睡不好嗎？為什麼你的大腦停不下來？</h4>
                                    <p className="text-[13px] text-[#4a4a6a] italic">正式研究題目：高中生睡前手機使用時數與課堂專注度之相關性探討</p>
                                </div>
                                <div className="p-5 bg-[#f8f7f4] rounded-lg border-l-4 border-[#c9a84c]">
                                    <div className="text-[11px] font-mono text-[#8888aa] mb-4 uppercase">預期發現 (AI 優化後)</div>
                                    <ol className="space-y-4 list-decimal pl-4">
                                        <li className="text-[13px] text-[#4a4a6a] leading-relaxed">
                                            <span className="font-bold block mb-1">推測一</span>
                                            睡前使用手機超過 1 小時的同學，其大腦灰質活動可能持續處於興奮狀態，導致隔天專注度明顯下降。
                                        </li>
                                        <li className="text-[13px] text-[#4a4a6a] leading-relaxed">
                                            <span className="font-bold block mb-1">推測二</span>
                                            參與社群媒體互動（如 IG/TikTok）的視覺與心理刺激，可能比單純觀看影片更容易延後褪黑激素的分泌。
                                        </li>
                                    </ol>
                                </div>
                            </div>
                            <div className="notice notice-gold !mt-auto text-[12px]">
                                💡 <strong>核心對比</strong>：手寫海報（如圖）偏向白話且具備視覺亮點，右方文字則是 W3 定案後的專業轉換，兩者相輔相成。
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* GALLERY WALK */}
            <div className="section-head">
                <h2>做什麼：第一節</h2>
                <div className="line"></div>
                <span className="mono">GALLERY WALK</span>
            </div>
            <p className="section-desc">帶著你的 A4 海報（W3 定案題目），在教室內進行走讀健檢。每個人既是「報告者」也是「評論者」。</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                {W4Data.galleryWalkRounds.map(item => (
                    <div className="bg-[#f8f7f4] border border-[#dddbd5] rounded-xl p-5" key={item.n}>
                        <div className="font-mono text-xl font-bold text-[#2d5be3] mb-1">{item.n}</div>
                        <div className={`inline-block font-mono text-[9px] px-1.5 py-0.5 rounded mb-2 ${item.r === 'present' ? 'bg-[#fdecea] text-[#c0392b]' : 'bg-[#e8eeff] text-[#2d5be3]'}`}>
                            {item.r === 'present' ? 'PRESENTING' : 'WALKING'}
                        </div>
                        <div className="text-[12px] text-[#4a4a6a] leading-relaxed">{item.d}</div>
                    </div>
                ))}
            </div>

            <div className="notice notice-accent mb-12">
                🕙 <strong>計時提醒</strong>：每一輪報告時間為 6 分鐘，中間有 1 分鐘走位換位。請把握時間 Pitch！
            </div>

            {/* STICKY NOTES RULES */}
            <div className="flex items-center gap-3 mb-4">
                <span className="section-label !mb-0">互動互動互動！</span>
                <span className="text-[10px] font-mono text-[#8888aa] uppercase tracking-wider">Gallery Walk 的評論規則</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
                {W4Data.commentRules.map((rule, idx) => (
                    <div key={idx} className="bg-white border border-[#dddbd5] rounded-xl p-5 flex flex-col gap-3">
                        <div className="flex items-center gap-2 font-bold text-[#1a1a2e]">
                            {rule.type === 'positive' && <CheckCircle2 size={16} className="text-[#2e7d5a]" />}
                            {rule.type === 'suggestion' && <Lightbulb size={16} className="text-[#c9a84c]" />}
                            {rule.type === 'question' && <Search size={16} className="text-[#2d5be3]" />}
                            <span>{rule.label}</span>
                        </div>
                        <p className="text-[11px] text-[#8888aa] leading-relaxed">
                            {rule.desc}
                        </p>
                    </div>
                ))}
            </div>

            {/* STEP 3: Literature Search */}
            <div className="section-head">
                <h2>階段 3：文獻外援檢索</h2>
                <div className="line"></div>
                <span className="mono">SECOND PERIOD</span>
            </div>

            <div className="border border-[#dddbd5] rounded-xl overflow-hidden bg-white mb-8">
                <div className="p-4 px-5 bg-[#2d5be3] flex items-center gap-3">
                    <Search size={16} className="text-[#c9a84c]" />
                    <span className="font-bold text-sm text-white">查找學術文獻：華藝與 Google Scholar</span>
                    <span className="text-[11px] text-white/60 ml-auto">從「摘要 Abstract」開始</span>
                </div>
                <div className="p-8">
                    <p className="text-sm text-[#4a4a6a] leading-relaxed mb-8">
                        今天定案之後，你要找一篇跟你最相關的論文。不一定要讀完全部，先讀 <strong>「摘要 (Abstract)」</strong>，確認這是不是你要的東西。
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <a href="https://scholar.google.com.tw/" target="_blank" rel="noreferrer" className="group p-5 border border-[#dddbd5] rounded-xl hover:border-[#2d5be3] hover:shadow-lg hover:shadow-[#2d5be3]/5 transition-all">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-lg bg-[#f0ede6] flex items-center justify-center text-[#2d5be3] group-hover:bg-[#2d5be3] group-hover:text-white transition-colors">
                                    <Search size={22} />
                                </div>
                                <div>
                                    <div className="font-bold text-[#1a1a2e] mb-1">Google Scholar</div>
                                    <div className="text-[11px] text-[#8888aa]">全球最大的學術搜尋引擎</div>
                                </div>
                            </div>
                        </a>
                        <a href="https://www.airitilibrary.com/" target="_blank" rel="noreferrer" className="group p-5 border border-[#dddbd5] rounded-xl hover:border-[#2d5be3] hover:shadow-lg hover:shadow-[#2d5be3]/5 transition-all">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-lg bg-[#f0ede6] flex items-center justify-center text-[#2d5be3] group-hover:bg-[#2d5be3] group-hover:text-white transition-colors">
                                    <BookOpen size={22} />
                                </div>
                                <div>
                                    <div className="font-bold text-[#1a1a2e] mb-1">華藝線上圖書館</div>
                                    <div className="text-[11px] text-[#8888aa]">收錄台灣最多的碩博士論文</div>
                                </div>
                            </div>
                        </a>
                    </div>

                    <div className="notice notice-gold mb-0">
                        <div className="font-bold mb-2">💡 搜尋關鍵字技巧</div>
                        <ul className="list-disc pl-5 space-y-1 text-[12px]">
                            <li><strong>不要直接搜整句題目</strong>（如：滑手機對專注度的影響）</li>
                            <li><strong>使用關鍵字組合</strong>（如：高中生 AND 手機使用 AND 專注度）</li>
                            <li><strong>找對標研究</strong>：看看別人怎麼設定對照組、用什麼問卷。</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* METHOD SELECTION */}
            <div className="flex items-center gap-3 mb-6">
                <span className="section-label !mb-0">五路分流</span>
                <span className="text-[10px] font-mono text-[#8888aa] uppercase tracking-wider">選擇你的研究方法</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
                {W4Data.methodSelection.map(m => (
                    <button
                        key={m.n}
                        onClick={() => setSelectedMethod(m.n)}
                        className={`p-4 border rounded-xl transition-all flex flex-col items-center gap-1 ${selectedMethod === m.n ? 'border-[#2d5be3] bg-[#e8eeff] shadow-sm' : 'border-[#dddbd5] bg-white hover:border-[#2d5be3]/50'}`}
                    >
                        <span className="text-2xl mb-1">{m.i}</span>
                        <span className="font-bold text-[13px] text-[#1a1a2e]">{m.n}</span>
                        <span className="font-mono text-[9px] text-[#8888aa]">{m.e}</span>
                    </button>
                ))}
            </div>
            <div className="notice notice-accent mb-16">
                💡 你選哪個方法，決定你下週 W5 去哪一組。
            </div>

            {/* AI COLLABORATION */}
            <div className="section-head">
                <h2>練什麼</h2>
                <div className="line"></div>
                <span className="mono">AI PRACTICE</span>
            </div>
            <p className="section-desc">實戰演練進階關鍵字搜尋技巧，學會評估 AI 建議的關鍵字，讓搜查範圍既廣且深。</p>

            <div className="space-y-6 mb-16">
                {/* PROMPT 1 */}
                <div className="border border-[#dddbd5] rounded-xl overflow-hidden bg-white shadow-sm">
                    <div className="p-4 px-6 bg-[#f8f7f4] border-b border-[#dddbd5] flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Zap size={16} className="text-[#2d5be3]" />
                            <span className="font-bold text-sm text-[#1a1a2e]">Prompt A：海報文案優化</span>
                        </div>
                        <CopyButton text={posterPrompt} label="複製此 Prompt" />
                    </div>
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-[11px] font-mono text-[#8888aa] mb-2 uppercase">W3 定案題目</label>
                                    <input
                                        type="text"
                                        value={w3Topic}
                                        onChange={(e) => setW3Topic(e.target.value)}
                                        placeholder="貼上你的題目..."
                                        className="w-full p-3 bg-[#f8f7f4] border border-[#dddbd5] rounded-lg text-sm focus:outline-none focus:border-[#2d5be3]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-mono text-[#8888aa] mb-2 uppercase">標題草稿</label>
                                    <input
                                        type="text"
                                        value={myDraftTitle}
                                        onChange={(e) => setMyDraftTitle(e.target.value)}
                                        placeholder="例如：滑手機與睡眠..."
                                        className="w-full p-3 bg-[#f8f7f4] border border-[#dddbd5] rounded-lg text-sm focus:outline-none focus:border-[#2d5be3]"
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <label className="block text-[11px] font-mono text-[#8888aa] mb-2 uppercase">預期發現草稿</label>
                                <textarea
                                    value={myDraftAssumptions}
                                    onChange={(e) => setMyDraftAssumptions(e.target.value)}
                                    placeholder="貼上你的預測..."
                                    className="flex-1 w-full p-3 bg-[#f8f7f4] border border-[#dddbd5] rounded-lg text-sm focus:outline-none focus:border-[#2d5be3] min-h-[100px]"
                                />
                            </div>
                        </div>
                        <div className="p-4 bg-[#f8f7f4] rounded-lg border border-dashed border-[#dddbd5] font-mono text-[11px] text-[#4a4a6a] whitespace-pre-wrap">
                            {posterPrompt}
                        </div>
                    </div>
                </div>

                {/* PROMPT 2 */}
                <div className="border border-[#dddbd5] rounded-xl overflow-hidden bg-white shadow-sm">
                    <div className="p-4 px-6 bg-[#f8f7f4] border-b border-[#dddbd5] flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Search size={16} className="text-[#2d5be3]" />
                            <span className="font-bold text-sm text-[#1a1a2e]">Prompt B：關鍵字擴充</span>
                        </div>
                        <CopyButton text={keywordPrompt} label="複製此 Prompt" />
                    </div>
                    <div className="p-6">
                        <div className="mb-6">
                            <label className="block text-[11px] font-mono text-[#8888aa] mb-2 uppercase">最終定案題目</label>
                            <input
                                type="text"
                                value={finalTopic}
                                onChange={(e) => setFinalTopic(e.target.value)}
                                placeholder="貼上最終題目..."
                                className="w-full p-3 bg-[#f8f7f4] border border-[#dddbd5] rounded-lg text-sm focus:outline-none focus:border-[#2d5be3]"
                            />
                        </div>
                        <div className="p-4 bg-[#f8f7f4] rounded-lg border border-dashed border-[#dddbd5] font-mono text-[11px] text-[#4a4a6a] whitespace-pre-wrap">
                            {keywordPrompt}
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-4 bg-[#f8f7f4] border border-[#dddbd5] rounded-xl flex items-center justify-between mb-16">
                <div className="text-[11px] font-mono text-[#8888aa] uppercase tracking-wider">APA Thesis Format</div>
                <div className="text-sm font-bold text-[#1a1a2e]">作者（年份）。論文題目（碩士論文）。學校名稱。</div>
            </div>

            {/* IN-CLASS TASKS */}
            <div className="section-head">
                <h2>課堂任務</h2>
                <div className="line"></div>
                <span className="mono">IN-CLASS</span>
            </div>
            <p className="section-desc">參與 Gallery Walk 個人題目博覽會，收集同學的建議，並完成你的 W4 研究海報。</p>

            <div className="space-y-4 mb-16">
                {W4Data.tasks.map((task, idx) => (
                    <div key={idx} className="border border-[#dddbd5] rounded-xl overflow-hidden bg-white">
                        <div className="p-4 bg-[#f8f7f4] border-b border-[#dddbd5] flex items-center gap-3">
                            <span className="section-label !mb-0">{task.badge}</span>
                            <span className="font-bold text-sm text-[#1a1a2e]">{task.title}</span>
                        </div>
                        <div className="p-6">
                            <ol className="list-decimal pl-5 space-y-2 text-sm text-[#4a4a6a]">
                                {task.steps.map((step, sIdx) => (
                                    <li key={sIdx}>{step}</li>
                                ))}
                            </ol>
                            {task.note && (
                                <div className={`notice ${task.noteColor === 'success' ? 'notice-success' : 'notice-gold'} mt-4`}>
                                    {task.note}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* WRAP-UP & HOMEWORK */}
            <div className="section-head">
                <h2>本週總結</h2>
                <div className="line"></div>
                <span className="mono">WRAP-UP</span>
            </div>

            <div className="border border-[#dddbd5] rounded-xl overflow-hidden bg-white mb-6">
                <div className="p-4 bg-[#f8f7f4] border-b border-[#dddbd5] font-bold text-sm text-[#1a1a2e]">
                    ✅ 本週結束，你應該要會
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#dddbd5] bg-[#dddbd5]">
                    <div className="p-4 px-6 bg-white text-[13px] text-[#4a4a6a]">✓ 2 分鐘內說清楚你的研究</div>
                    <div className="p-4 px-6 bg-white text-[13px] text-[#4a4a6a]">✓ 有判斷地接受或拒絕建議</div>
                    <div className="p-4 px-6 bg-white text-[13px] text-[#4a4a6a]">✓ 找到一篇相關論文並試寫 APA</div>
                    <div className="p-4 px-6 bg-white text-[13px] text-[#4a4a6a]">✓ 確認 W4 最終定案題目</div>
                </div>
            </div>

            <div className="border border-[#dddbd5] rounded-xl overflow-hidden bg-white mb-16">
                <div className="p-4 bg-[#f8f7f4] border-b border-[#dddbd5] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="bg-[#1a1a2e] text-white text-[10px] font-mono px-2 py-0.5 rounded">HOMEWORK</span>
                        <span className="font-bold text-sm text-[#1a1a2e]">本週作業</span>
                    </div>
                    <span className="text-[11px] font-bold text-[#c0392b]">截止：{W4Data.homework.deadline}</span>
                </div>
                <div className="divide-y divide-[#dddbd5]">
                    {W4Data.homework.items.map((hw, idx) => (
                        <div className="p-4 px-6 flex items-center gap-6" key={idx}>
                            <span className="font-mono text-[11px] font-bold text-[#2d5be3] w-16 shrink-0">{hw.p}</span>
                            <span className="text-[13px] text-[#4a4a6a]">{hw.n}</span>
                        </div>
                    ))}
                </div>
                <div className="p-4 px-6 bg-[#f8f7f4] border-t border-[#dddbd5] flex items-center justify-between text-[12px]">
                    <span className="text-[#8888aa]">{W4Data.homework.footer}</span>
                    <a href="https://classroom.google.com/" target="_blank" rel="noopener noreferrer" className="text-[#2d5be3] font-bold hover:underline">→ Google Classroom</a>
                </div>
            </div>

            {/* NEXT WEEK PREVIEW */}
            <div className="next-week-preview">
                <div className="next-week-header">
                    <span className="next-week-badge">NEXT WEEK</span>
                    <h3 className="next-week-title">W5 預告</h3>
                </div>
                <div className="next-week-content">
                    <div className="next-week-col">
                        <div className="next-week-label">W5 主題</div>
                        <p className="next-week-text">五路分流——依照你的研究方法分組，深入學習設計技術。</p>
                    </div>
                    <div className="next-week-col border-l border-white/5">
                        <div className="next-week-label">你要確認</div>
                        <p className="next-week-text">你的 <strong className="text-white underline decoration-[#c9a84c] underline-offset-4">研究方法 (How)</strong> 已經決定。</p>
                    </div>
                </div>
            </div>

            {/* NAVIGATION */}
            <div className="flex justify-between items-center py-12 border-t border-[#dddbd5]">
                <Link to="/w3" className="text-[13px] font-bold text-[#8888aa] hover:text-[#1a1a2e] flex items-center gap-2 transition-colors">
                    <ArrowLeft size={16} /> 回 W3 題目健檢
                </Link>
                <Link to="/w5" className="bg-[#1a1a2e] text-white px-8 py-3 rounded-lg text-[13px] font-bold hover:bg-[#2d5be3] transition-all flex items-center gap-2 group shadow-lg shadow-[#1a1a2e]/10">
                    前往 W5 文獻偵探社 <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>
        </div>
    );
};
