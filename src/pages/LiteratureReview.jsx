import React, { useState } from 'react';
import { BookOpen, ShieldAlert, CheckCircle, FileSearch, PenTool, AlertTriangle, Info, FileText, Bot, Search, Map } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PromptBox } from '../components/analysis/PromptBox';
import LessonMap from '../components/ui/LessonMap';
import { W5Data } from '../data/lessonMaps';

export const LiteratureReview = () => {
    const [myTopic, setMyTopic] = useState('');
    const [searchKeywords, setSearchKeywords] = useState('');
    const [foundPaper, setFoundPaper] = useState('');
    const [showLessonMap, setShowLessonMap] = useState(false);

    const keywordPrompt = `我的研究題目是：${myTopic || '【你的題目】'}

請幫我：
1. 列出 5-8 個適合的中文關鍵字
2. 給我對應的英文關鍵字
3. 建議哪些關鍵字組合在資料庫搜尋最有效

請用表格呈現，並說明每個關鍵字的用途。`;

    return (
        <div className="max-w-5xl mx-auto px-6 lg:px-12 py-8 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 font-['Noto_Sans_TC',sans-serif] text-[14px] leading-[1.6] text-[#1a1a2e] pb-16">

            {/* ===== Lesson Map Toggle (Teacher Only) ===== */}
            <div className="flex justify-end pt-2 pb-0 -mb-8 relative z-20">
                <button
                    onClick={() => setShowLessonMap(!showLessonMap)}
                    className="flex items-center gap-1.5 text-[11px] text-[#8888aa] hover:text-[#2d5be3] transition-colors opacity-60 hover:opacity-100 font-['DM_Mono',monospace]"
                    title="教師專用：顯示課程地圖"
                >
                    <Map size={12} />
                    {showLessonMap ? 'Hide Map' : 'Instructor View'}
                </button>
            </div>

            {showLessonMap && (
                <div className="mb-4 animate-in slide-in-from-top-4 duration-300">
                    <LessonMap data={W5Data} />
                </div>
            )}

            {/* Header */}
            <header className="mb-14 pt-8">
                <div className="text-[11px] font-['DM_Mono',monospace] tracking-[0.12em] uppercase text-[#2d5be3] mb-3 flex items-center gap-2">
                    <BookOpen size={14} /> W5 核心模組
                </div>
                <h1 className="font-['Noto_Serif_TC',serif] text-[38px] font-bold leading-[1.25] text-[#1a1a2e] mb-4 tracking-[-0.02em]">
                    文獻偵探社與<br className="hidden md:block" />
                    <span className="text-[#2d5be3] font-normal italic">學術寫作倫理</span>
                </h1>
                <p className="text-[15px] text-[#4a4a6a] leading-[1.75] max-w-[560px]">
                    福爾摩斯的證物鑑識：不只找資料，還要學會「合法使用證據」。
                </p>
                <div className="mt-8 flex justify-start">
                    <Link
                        to="/game/citation-detective"
                        className="inline-flex items-center gap-2 bg-[#1a1a2e] text-white px-6 py-3 rounded-[6px] text-[14px] font-bold hover:bg-[#2a2a4a] transition-all group shadow-sm hover:shadow-md"
                    >
                        進入遊戲：行動代號：獵狐 <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </header>

            {/* Section 0: Literature Search */}
            <section className="mb-14">
                <div className="flex items-baseline gap-3 mb-6">
                    <h2 className="font-['Noto_Serif_TC',serif] text-[20px] font-bold text-[#1a1a2e] flex items-center gap-2">
                        🕵️ 課前熱身：資料搜集入門
                    </h2>
                </div>

                <div className="space-y-8">
                    {/* 三步驟圖示 */}
                    <div className="grid md:grid-cols-3 gap-[1px] bg-[#dddbd5] border border-[#dddbd5] rounded-[10px] overflow-hidden">
                        {[
                            { icon: '📚', title: '1. 華藝資料庫', desc: '台灣最大的學術資料庫，找尋論文與期刊。' },
                            { icon: '🤖', title: '2. AI 關鍵字生成', desc: '擴展搜尋視角，找到你沒想到的資料。' },
                            { icon: '📝', title: '3. 辨識 APA 格式', desc: '掌握引用規範，避免落入抄襲陷阱。' },
                        ].map(item => (
                            <div key={item.title} className="bg-white p-6 text-center hover:bg-[#f8f7f4] transition-colors">
                                <div className="text-[28px] mb-3">{item.icon}</div>
                                <h4 className="font-bold text-[#1a1a2e] text-[14px] mb-2">{item.title}</h4>
                                <p className="text-[#8888aa] text-[12px] leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>

                    {/* 搜尋策略卡片 */}
                    <div className="bg-[#f8f7f4] rounded-[10px] border border-[#dddbd5] p-8">
                        <h4 className="font-bold text-[#1a1a2e] text-[15px] mb-6 flex items-center gap-2">
                            <FileSearch size={18} className="text-[#2d5be3]" /> 華藝搜尋三步驟
                        </h4>
                        <div className="grid md:grid-cols-3 gap-6">
                            {[
                                { step: '1', label: '列出關鍵字', text: '拆解題目核心概念，如「手機使用」、「睡眠品質」。' },
                                { step: '2', label: '加條件過濾', text: '結果太多時，鎖定「近5年」、「碩博士論文」。' },
                                { step: '3', label: '看摘要選文', text: '先讀摘要判斷價值，再決定是否下載全文。' },
                            ].map(item => (
                                <div key={item.step} className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-bold bg-[#1a1a2e] text-white w-4 h-4 flex items-center justify-center rounded-[2px] font-['DM_Mono',monospace]">{item.step}</span>
                                        <span className="font-bold text-[13px] text-[#1a1a2e]">{item.label}</span>
                                    </div>
                                    <p className="text-[12px] text-[#4a4a6a] leading-relaxed pl-6">{item.text}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 實作區 */}
                    <div className="grid md:grid-cols-2 gap-10">
                        {/* 左：搜巡記錄 */}
                        <div className="space-y-6">
                            <h4 className="font-bold text-[#1a1a2e] text-[14px] border-b border-[#dddbd5] pb-2 flex items-center gap-2">
                                <PenTool size={16} className="text-[#2d5be3]" /> 我的搜尋記錄
                            </h4>
                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-[12px] font-bold text-[#8888aa] uppercase tracking-wider font-['DM_Mono',monospace]">Research Topic</label>
                                    <input
                                        className="w-full border border-[#dddbd5] rounded-[4px] px-4 py-2.5 text-[13px] focus:outline-none focus:border-[#2d5be3] bg-[#f8f7f4]/50"
                                        placeholder="輸入你的研究題目..."
                                        value={myTopic}
                                        onChange={e => setMyTopic(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[12px] font-bold text-[#8888aa] uppercase tracking-wider font-['DM_Mono',monospace]">Keywords</label>
                                    <input
                                        className="w-full border border-[#dddbd5] rounded-[4px] px-4 py-2.5 text-[13px] focus:outline-none focus:border-[#2d5be3] bg-[#f8f7f4]/50"
                                        placeholder="例：手機使用 / 睡眠品質"
                                        value={searchKeywords}
                                        onChange={e => setSearchKeywords(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[12px] font-bold text-[#8888aa] uppercase tracking-wider font-['DM_Mono',monospace]">Found Research</label>
                                    <textarea
                                        className="w-full border border-[#dddbd5] rounded-[4px] p-4 text-[13px] focus:outline-none focus:border-[#2d5be3] bg-[#f8f7f4]/50 min-h-[90px]"
                                        placeholder="標題：__________________&#10;作者：_____ 年份：_____"
                                        value={foundPaper}
                                        onChange={e => setFoundPaper(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* 右：AI 助攻 */}
                        <div className="space-y-6">
                            <h4 className="font-bold text-[#1a1a2e] text-[14px] border-b border-[#dddbd5] pb-2 flex items-center gap-2">
                                <Bot size={16} className="text-[#2d5be3]" /> AI 關鍵字生成
                            </h4>
                            <div className="bg-[#f0ede6] p-6 rounded-[8px] border border-[#dddbd5] shadow-inner">
                                <PromptBox variant="paper">{keywordPrompt}</PromptBox>
                            </div>
                            <p className="text-[11px] text-[#8888aa] text-center italic">讓 AI 幫你擴展中英文學術詞彙，突破搜尋瓶頸。</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 觀念一：改寫倫理 */}
            <section className="mb-14">
                <div className="flex items-baseline gap-3 mb-6">
                    <h2 className="font-['Noto_Serif_TC',serif] text-[20px] font-bold text-[#1a1a2e] flex items-center gap-2">
                        ⚖️ 觀念一：避免「無意抄襲」與「換字抄襲」
                    </h2>
                </div>
                <div className="grid md:grid-cols-3 gap-[1px] bg-[#dddbd5] border border-[#dddbd5] rounded-[10px] overflow-hidden">
                    {[
                        { title: '無意抄襲', color: 'text-[#e32d5b]', desc: '粗心漏標來源。即便非故意，客觀上仍構成學術抄襲。' },
                        { title: '換字抄襲', color: 'text-[#c9a84c]', desc: '僅抽換同義詞，句型結構完全不變，這是新手最常犯的錯。' },
                        { title: '正確改寫', color: 'text-[#2e7d5a]', desc: '消化吸收後，用自己的邏輯與語言重述原意（Paraphrasing）。' },
                    ].map(item => (
                        <div key={item.title} className="bg-white p-6 hover:bg-[#f8f7f4] transition-colors group">
                            <h4 className={`font-bold text-[15px] mb-3 ${item.color}`}>{item.title}</h4>
                            <p className="text-[#4a4a6a] text-[12px] leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* 實戰特訓 1 */}
            <section className="bg-[#1a1a2e] text-white rounded-[10px] p-10 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-10 opacity-[0.03]">
                    <ShieldAlert size={120} />
                </div>
                <div className="relative z-10 space-y-8">
                    <div className="flex items-center gap-4">
                        <div className="bg-[#e32d5b] text-white w-8 h-8 rounded-md flex items-center justify-center font-bold text-[14px] font-['DM_Mono',monospace]">1</div>
                        <h2 className="text-[20px] font-bold font-['Noto_Serif_TC',serif] tracking-wide text-[#e32d5b]">實戰特訓 1：改寫偵錯</h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <div className="text-[10px] font-['DM_Mono',monospace] tracking-[0.2em] uppercase text-white/30">Original Source / 原始文獻</div>
                            <div className="bg-white/5 border-l-2 border-white/20 p-5 rounded-r-[6px] italic text-[14px] leading-relaxed">
                                「中等強度的有氧運動能促進大腦海馬迴的血液循環，進而提升短期記憶的固化效率，對準備大考的學生有顯著幫助。」
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="text-[10px] font-['DM_Mono',monospace] tracking-[0.2em] uppercase text-[#e32d5b]/60 font-bold">Suspect Rewrite / 某同學的改寫</div>
                            <div className="bg-white/5 border-l-2 border-[#e32d5b]/50 p-5 rounded-r-[6px] text-[14px] leading-relaxed">
                                中等程度的有氧運動可以增加大腦海馬迴的血液流動，進而提高短暫記憶的儲存效率，對準備重要考試的同學有明顯幫助。(王研究員, 2024)
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/10 rounded-[8px] p-6 border border-white/5 space-y-4">
                        <h4 className="font-bold text-[14px] flex items-center gap-2 text-[#e32d5b]">
                            <PenTool size={16} /> 特務行動指示
                        </h4>
                        <p className="text-white/70 text-[13px]">
                            請在<strong>紙本學習單</strong>上指出這段改寫的破綻，並親自示範一次「高段位」的改寫技巧。
                        </p>
                        <details className="group marker:content-['']">
                            <summary className="cursor-pointer text-[12px] font-bold text-white/40 hover:text-[#e32d5b] transition-colors select-none outline-none">
                                [ 點擊解碼官方解答 ]
                            </summary>
                            <div className="mt-4 p-4 bg-black/20 rounded-[4px] space-y-2 border-t border-white/5 animate-in fade-in duration-300">
                                <p className="text-[12px] leading-relaxed"><strong className="text-[#e32d5b]">破綻分析：</strong> 典型換字抄襲。僅替換近義詞，整體句構與原句完全吻合。</p>
                                <p className="text-[12px] leading-relaxed italic text-white/60">示範：王研究員 (2024) 指出，面臨大考壓力的學生如果能維持適度的有氧運動，將有助於促進大腦血液循環，從而增強短期記憶的學習成效。</p>
                            </div>
                        </details>
                    </div>
                </div>
            </section>

            {/* 觀念二：三明治寫作法 */}
            <section className="mb-14">
                <div className="flex items-baseline gap-3 mb-6">
                    <h2 className="font-['Noto_Serif_TC',serif] text-[20px] font-bold text-[#1a1a2e] flex items-center gap-2">
                        🥪 觀念二：直接引用與「三明治寫作法」
                    </h2>
                </div>
                <p className="text-[#4a4a6a] text-[14px] mb-10 leading-relaxed max-w-[650px]">
                    遇到法律條文、權威定義或名言時，我們照抄全文（直接引用）。但不能硬塞，必須用「三明治」包起來才好入口。
                </p>

                <div className="max-w-[700px] space-y-4">
                    <div className="bg-white border border-[#dddbd5] p-5 rounded-[6px] relative flex gap-6 items-center hover:bg-[#f8f7f4] transition-colors">
                        <div className="bg-[#f0ede6] px-3 py-1 text-[11px] font-bold font-['DM_Mono',monospace] absolute -top-3 left-6 border border-[#dddbd5] rounded uppercase">Top / 引入</div>
                        <span className="text-2xl opacity-40 grayscale">🍞</span>
                        <div>
                            <h4 className="font-bold text-[14px] text-[#1a1a2e] mb-1">上層麵包</h4>
                            <p className="text-[12px] text-[#8888aa]">交代引用的時空背景、講述者身份。</p>
                        </div>
                    </div>
                    <div className="bg-[#fdf2f2] border border-[#f2dada] p-5 rounded-[6px] relative flex gap-6 items-center shadow-sm">
                        <div className="bg-[#e32d5b] text-white px-3 py-1 text-[11px] font-bold font-['DM_Mono',monospace] absolute -top-3 left-6 rounded uppercase">Meat / 引用</div>
                        <span className="text-2xl drop-shadow-sm">🥩</span>
                        <div>
                            <h4 className="font-bold text-[14px] text-[#e32d5b] mb-1">中間內餡</h4>
                            <p className="text-[12px] text-[#e32d5b]/70 font-medium">放入引用正文，記住：<span className="underline underline-offset-4">一定要加引號</span>。</p>
                        </div>
                    </div>
                    <div className="bg-white border border-[#dddbd5] p-5 rounded-[6px] relative flex gap-6 items-center hover:bg-[#f8f7f4] transition-colors">
                        <div className="bg-[#f0ede6] px-3 py-1 text-[11px] font-bold font-['DM_Mono',monospace] absolute -top-3 left-6 border border-[#dddbd5] rounded uppercase">Bottom / 解釋</div>
                        <span className="text-2xl opacity-40 grayscale">🍞</span>
                        <div>
                            <h4 className="font-bold text-[14px] text-[#1a1a2e] mb-1">下層麵包</h4>
                            <p className="text-[12px] text-[#8888aa]">說明這段話對你的研究代表什麼意義。</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 實戰特訓 2 */}
            <section className="bg-[#1a1a2e] text-white rounded-[10px] p-10 relative overflow-hidden">
                <div className="absolute -bottom-10 -left-10 opacity-[0.03]">
                    <FileText size={180} />
                </div>
                <div className="relative z-10 space-y-8">
                    <div className="flex items-center gap-4">
                        <div className="bg-[#2e7d5a] text-white w-8 h-8 rounded-md flex items-center justify-center font-bold text-[14px] font-['DM_Mono',monospace]">2</div>
                        <h2 className="text-[20px] font-bold font-['Noto_Serif_TC',serif] tracking-wide text-[#2e7d5a]">實戰特訓 2：組合三明治</h2>
                    </div>

                    <div className="bg-white/5 border-l-2 border-[#2e7d5a] p-6 rounded-r-[10px]">
                        <div className="text-[10px] font-['DM_Mono',monospace] tracking-[0.2em] uppercase text-white/30 mb-4">Target Evidence / 重要證物</div>
                        <p className="text-[16px] italic font-['Noto_Serif_TC',serif] leading-relaxed text-[#2e7d5a]/90">
                            「人類大腦在進行數位多工處理時，實際上是在不同任務間快速切換注意力，這不僅會消耗更多認知資源，還會使錯誤率大幅上升。」
                        </p>
                        <p className="text-[11px] text-white/30 mt-4 text-right">—— Dr. Miller, 2022</p>
                    </div>

                    <div className="bg-white/10 rounded-[8px] p-6 border border-white/5 flex flex-col md:flex-row gap-8">
                        <div className="flex-1 space-y-3">
                            <h4 className="font-bold text-[14px] text-[#2e7d5a] flex items-center gap-2 uppercase tracking-widest font-['DM_Mono',monospace]">Mission Instruction</h4>
                            <p className="text-white/70 text-[13px] leading-relaxed">
                                使用<strong>三明治法</strong>將這段證物融入你的報告中。請確保引入（🍞）、引用（🥩）、解釋（🍞）三位一體。
                            </p>
                        </div>
                        <div className="md:w-64 space-y-2">
                            <details className="group marker:content-['']">
                                <summary className="cursor-pointer text-[12px] font-bold text-white/40 hover:text-[#2e7d5a] transition-colors select-none outline-none">
                                    [ 查看參考範本 ]
                                </summary>
                                <div className="mt-4 text-[11px] leading-relaxed text-white/60 p-4 bg-black/20 rounded">
                                    許多高中生認為讀書時能同時處理多項數位訊息，但科學對此抱持疑慮。Dr. Miller (2022) 指出：「人類大腦在進行數位多工處理時...使錯誤率大幅上升。」這意即若追求高品質的研究產現，我們必須建立排除干擾的深度專注時間。
                                </div>
                            </details>
                        </div>
                    </div>
                </div>
            </section>

            {/* 補充與參考 */}
            <div className="grid md:grid-cols-2 gap-10">
                <section className="space-y-6">
                    <h4 className="font-bold text-[#1a1a2e] text-[14px] border-b border-[#dddbd5] pb-2 flex items-center gap-2">
                        📋 引註格式速查
                    </h4>
                    <div className="bg-white border border-[#dddbd5] rounded-[6px] overflow-hidden">
                        <table className="w-full text-left text-[12px]">
                            <thead className="bg-[#f8f7f4] border-b border-[#dddbd5]">
                                <tr>
                                    <th className="px-4 py-2 font-bold text-[#8888aa]">類型</th>
                                    <th className="px-4 py-2 font-bold text-[#8888aa]">格式範例</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#dddbd5]">
                                <tr>
                                    <td className="px-4 py-3 font-bold">句尾式</td>
                                    <td className="px-4 py-3">造成壓力 (王大明, 2023)。</td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-3 font-bold">句首式</td>
                                    <td className="px-4 py-3">王大明 (2023) 研究發現...</td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-3 font-bold">多人聯合</td>
                                    <td className="px-4 py-3">(王大明等, 2023)</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                <section className="space-y-6">
                    <h4 className="font-bold text-[#1a1a2e] text-[14px] border-b border-[#dddbd5] pb-2 flex items-center gap-2">
                        🧩 多重文獻綜合
                    </h4>
                    <div className="bg-[#f0f4ff] border-l-4 border-[#2d5be3] p-5 rounded-r-[6px]">
                        <p className="text-[13px] text-[#1a3db0] leading-relaxed">
                            <strong>高階技巧：</strong>在小論文中，通常會將不同來源（甚至觀點相反）的資料整合在同一段。這能展現你的綜合分析能力，而不只是單純的資料搬運。
                        </p>
                    </div>
                </section>
            </div>

            {/* 實戰特訓 3 */}
            <section className="bg-[#1a1a2e] text-white rounded-[10px] p-10 relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03]">
                    <Search size={300} />
                </div>
                <div className="relative z-10 space-y-8">
                    <div className="flex items-center gap-4">
                        <div className="bg-[#2d5be3] text-white w-8 h-8 rounded-md flex items-center justify-center font-bold text-[14px] font-['DM_Mono',monospace]">3</div>
                        <h2 className="text-[20px] font-bold font-['Noto_Serif_TC',serif] tracking-wide text-[#2d5be3]">實戰特訓 3：情報綜合分析</h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 pb-6">
                        <div className="p-5 border border-white/10 rounded-[6px] bg-white/[0.02]">
                            <span className="text-[10px] font-bold text-[#2d5be3] uppercase block mb-3 font-['DM_Mono',monospace]">File A / 科技教育學會</span>
                            <p className="text-[13px] text-white/70 leading-relaxed italic">「生成式 AI 能快速提供思路框架，大幅縮短學生在專題初期的摸索時間。」</p>
                        </div>
                        <div className="p-5 border border-white/10 rounded-[6px] bg-white/[0.02]">
                            <span className="text-[10px] font-bold text-[#e32d5b] uppercase block mb-3 font-['DM_Mono',monospace]">File B / 高教研究中心</span>
                            <p className="text-[13px] text-white/70 leading-relaxed italic">「過度依賴 AI 直接生成文本的學生，其批判性思維在一年後出現顯著衰退。」</p>
                        </div>
                    </div>

                    <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row gap-10 items-start">
                        <div className="flex-1 space-y-4">
                            <h4 className="font-bold text-[14px] text-[#2d5be3] flex items-center gap-2 uppercase tracking-widest font-['DM_Mono',monospace]">Final Assessment</h4>
                            <p className="text-white/70 text-[14px] leading-relaxed">
                                請在學習單上寫下 50-80 字的短文。綜合考量 A 與 B 的情報，產出一份具備主見且平衡的最終報告。
                            </p>
                        </div>
                        <div className="md:w-64 bg-black/40 p-5 rounded-[8px] border border-white/5">
                            <h5 className="text-[11px] font-bold text-white/40 mb-3 tracking-widest uppercase">Score Matrix / 評分指標</h5>
                            <ul className="space-y-2 text-[11px] text-white/60">
                                <li className="flex gap-2"><span className="text-[#2e7d5a]">✓</span> 同時提及正反觀點</li>
                                <li className="flex gap-2"><span className="text-[#2e7d5a]">✓</span> 正確標註兩處出處</li>
                                <li className="flex gap-2"><span className="text-[#2e7d5a]">✓</span> 提出中肯的個人見解</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Navigation */}
            <div className="flex justify-between items-center py-12 border-t border-[#dddbd5]">
                <Link to="/w4" className="text-[13px] font-bold text-[#8888aa] hover:text-[#1a1a2e] flex items-center gap-2 transition-colors">
                    ← 回 W4 標題博覽會
                </Link>
                <div className="flex gap-4">
                    <Link to="/clinic" className="bg-[#1a1a2e] text-white px-8 py-3 rounded-[6px] text-[14px] font-bold hover:bg-[#2a2a4a] transition-all flex items-center gap-2 group">
                        前往研究急診室 <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>

        </div>
    );
};
