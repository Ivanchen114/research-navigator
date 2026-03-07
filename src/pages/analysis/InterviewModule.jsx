import React, { useState } from 'react';
import { DocLinkBtn } from '../../components/analysis/DocLinkBtn';
import { PromptBox, AIInstructionDropdown } from '../../components/analysis/PromptBox';
import { Bot, Scale, AlertTriangle, PenLine, ArrowRight } from 'lucide-react';

export const InterviewModule = () => {
    const [isHighlighted, setIsHighlighted] = useState(false);

    return (
        <div className="p-8 md:p-12 space-y-12 animate-in fade-in slide-in-from-right-4 duration-500 font-['Noto_Sans_TC',sans-serif] text-[14px] leading-[1.6] text-[#1a1a2e]">

            {/* Header */}
            <header className="space-y-4">
                <div className="flex items-center gap-2">
                    <span className="bg-[#c9a84c] text-white text-[10px] font-bold px-2 py-0.5 rounded-[2px] font-['DM_Mono',monospace] uppercase tracking-wider">Method 02</span>
                    <span className="text-[11px] text-[#8888aa] font-['DM_Mono',monospace] tracking-widest uppercase">Qualitative / 訪談逐字稿分析</span>
                </div>
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <h2 className="font-['Noto_Serif_TC',serif] text-[28px] font-bold text-[#1a1a2e] leading-tight">訪談法：四層次寫作工作坊</h2>
                    <DocLinkBtn href="https://docs.google.com/document/d/13NFmhIYg96BKhc871oTlnAS2r812O-hdbBl-LYNcEog/edit?usp=drive_link">
                        完整指南
                    </DocLinkBtn>
                </div>
                <p className="text-[14px] text-[#4a4a6a] max-w-[600px] leading-relaxed">
                    從對話中提煉主題，加上你的初稿，讓 AI 協助檢核並產出堅實的質性研究結論。
                </p>
            </header>

            {/* Concept: Coding */}
            <section className="space-y-6">
                <div className="flex items-center gap-3 border-b border-[#dddbd5] pb-2">
                    <h3 className="font-bold text-[16px] text-[#1a1a2e] font-['Noto_Serif_TC',serif]">核心概念：編碼 (Coding)</h3>
                </div>
                <div className="grid md:grid-cols-3 gap-[1px] bg-[#dddbd5] border border-[#dddbd5] rounded-[10px] overflow-hidden">
                    {[
                        { title: '1. 開放編碼', color: 'text-[#2d5be3]', desc: '將受訪者的原始話語貼上重點標籤。', label: '例：「壓力大」' },
                        { title: '2. 主軸編碼', color: 'text-[#2e7d5a]', desc: '將相似標籤歸納成核心類別。', label: '例：情緒調適' },
                        { title: '3. 選擇編碼', color: 'text-[#1a1a2e]', desc: '找出貫穿所有對話的故事主軸。', label: '例：成長機制' },
                    ].map(item => (
                        <div key={item.title} className="bg-white p-6 space-y-3 hover:bg-[#f8f7f4] transition-colors">
                            <h4 className={`font-bold text-[14px] ${item.color}`}>{item.title}</h4>
                            <p className="text-[12px] text-[#8888aa] leading-relaxed">{item.desc}</p>
                            <span className="inline-block px-2 py-0.5 bg-[#f8f7f4] border border-[#dddbd5] rounded-[2px] text-[10px] font-bold text-[#4a4a6a] uppercase tracking-wider">{item.label}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* Step 2: AI Audit */}
            <section className="space-y-6">
                <div className="flex items-center gap-3 border-b border-[#dddbd5] pb-2 text-[#c9a84c]">
                    <span className="font-['DM_Mono',monospace] text-[12px] font-bold">STEP 02</span>
                    <h3 className="font-bold text-[16px] text-[#1a1a2e]">AI 檢核與潤飾</h3>
                </div>
                <div className="bg-[#1a1a2e] text-white rounded-[10px] p-10 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:scale-110 transition-transform duration-700">
                        <Bot size={120} />
                    </div>
                    <div className="relative z-10 space-y-8">
                        <p className="text-white/60 text-[13px] leading-relaxed max-w-[600px]">
                            質性研究強調「脈絡」。將你的四層初稿與<strong>已匿名處理</strong>的逐字稿餵給 AI，請它找回被你忽略的轉折或潛台詞。
                        </p>

                        <div className="bg-black/40 rounded-[8px] border border-white/10 p-6 space-y-6 font-['DM_Mono',monospace]">
                            <div className="flex items-center justify-between border-b border-white/5 pb-4">
                                <div className="text-[10px] font-bold text-[#c9a84c] uppercase tracking-widest">// Qualitative Audit Prompt</div>
                                <button className="text-[10px] text-white/30 hover:text-white transition-colors">COPY</button>
                            </div>
                            <div className="text-[12px] leading-relaxed text-white/80">
                                <p>我寫了四層結論初稿：【貼上初稿】</p>
                                <p className="mt-2 text-white/40">匿名逐字稿：【貼上內容】</p>
                                <div className="mt-4 p-4 bg-white/5 rounded border-l-2 border-[#c9a84c] space-y-2 text-white/90">
                                    <p>1. 檢核描述層有無「超譯」或遺漏重要語氣現象。</p>
                                    <p>2. 優化詮釋層，建議可能的隱含意義。</p>
                                    <p>3. 「回扣層」主見已定，請只輔助文字修飾。</p>
                                    <p>4. 建議這份訪談內容可能存在的三種研究限制。</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Simulation block */}
                <div className="bg-[#f8f7f4] border border-[#dddbd5] rounded-[6px] p-8 space-y-6">
                    <h4 className="font-bold text-[#1a1a2e] text-[14px] flex items-center gap-2">
                        <span className="text-xl">📝</span> 自學補充：編碼概念模擬
                    </h4>
                    <p className="text-[12px] text-[#8888aa] leading-relaxed">
                        點擊按鈕，觀察訪談研究者如何從一段話中提取標籤。
                    </p>

                    <div className="bg-white p-6 rounded-[4px] text-[15px] italic border-l-2 border-[#dddbd5] shadow-inner font-['Noto_Serif_TC',serif] leading-loose text-[#4a4a6a]">
                        {isHighlighted ? (
                            <>
                                「每次段考後看到校排，我就覺得<span className="bg-[#fdf2f2] text-[#e32d5b] px-1 font-bold underline decoration-2 underline-offset-4">很想吐</span>。雖然爸媽沒說什麼，但<span className="bg-[#f0f4ff] text-[#2d5be3] px-1 font-bold underline decoration-2 underline-offset-4">看著同學都在補習</span>，我就覺得自己是不是不夠努力？這種感覺真的很<span className="bg-[#fdf2f2] text-[#e32d5b] px-1 font-bold underline decoration-2 underline-offset-4">窒息</span>。」
                            </>
                        ) : (
                            <>
                                「每次段考後看到校排，我就覺得很想吐。雖然爸媽沒說什麼，但看著同學都在補習，我就覺得自己是不是不夠努力？這種感覺真的很窒息。」
                            </>
                        )}
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex gap-4">
                            {isHighlighted && (
                                <div className="flex gap-4 animate-in fade-in duration-500">
                                    <span className="flex items-center gap-1 text-[11px] font-bold text-[#e32d5b] uppercase tracking-widest"><div className="w-2 h-2 rounded-full bg-current"></div> 生理反應</span>
                                    <span className="flex items-center gap-1 text-[11px] font-bold text-[#2d5be3] uppercase tracking-widest"><div className="w-2 h-2 rounded-full bg-current"></div> 同儕壓力</span>
                                </div>
                            )}
                        </div>
                        <button
                            onClick={() => setIsHighlighted(!isHighlighted)}
                            className={`px-6 py-2 rounded-[4px] text-[12px] font-bold transition-all border ${isHighlighted ? 'bg-[#1a1a2e] text-white border-[#1a1a2e]' : 'bg-white text-[#1a1a2e] border-[#dddbd5] hover:border-[#1a1a2e]'}`}
                        >
                            {isHighlighted ? '隱藏編碼標記' : '顯示編碼標記'}
                        </button>
                    </div>
                </div>
            </section>

            {/* Step 3: Human Judgment */}
            <section className="space-y-6">
                <div className="flex items-center gap-3 border-b border-[#dddbd5] pb-2 text-[#e32d5b]">
                    <span className="font-['DM_Mono',monospace] text-[12px] font-bold">STEP 03</span>
                    <h3 className="font-bold text-[16px] text-[#1a1a2e]">人工裁奪：找回生命脈絡</h3>
                </div>
                <p className="text-[14px] text-[#4a4a6a] max-w-[600px] leading-relaxed italic">
                    AI 擅長歸納，但容易「超譯」。你的任務是確保結論貼合原意，而非 AI 的妄想。
                </p>
                <div className="grid md:grid-cols-2 gap-6 mt-8">
                    {[
                        { title: '陷阱：AI 的誇大超譯', desc: 'AI 說受訪者表現出「對體制的深刻絕望」，但原話只是「這便當不好吃」。', fix: '裁奪：嚴格對照「原文」！如果 AI 歸納的主題太誇張，手動下修主題名稱。' },
                        { title: '陷阱：錯把個案當全貌', desc: 'AI 覺得某個觀點很有趣，你就把它寫成大家都有的通病。', fix: '裁奪：多人提到的才是「核心發現」；單人提到的應標註為「特殊個案」。' },
                    ].map(item => (
                        <div key={item.title} className="p-6 border border-[#dddbd5] rounded-[10px] space-y-4 hover:border-[#e32d5b] transition-colors bg-white shadow-sm">
                            <h4 className="font-bold text-[14px] text-[#e32d5b] flex items-center gap-2">
                                <AlertTriangle size={16} /> {item.title}
                            </h4>
                            <p className="text-[12px] text-[#8888aa] leading-relaxed">{item.desc}</p>
                            <div className="bg-[#fdf2f2] p-3 rounded-[4px] border border-[#f2dada] text-[12px] font-bold text-[#e32d5b]">
                                ✓ {item.fix}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Step 4: Final Drafting */}
            <section className="space-y-6">
                <div className="flex items-center gap-3 border-b border-[#dddbd5] pb-2 text-[#2e7d5a]">
                    <span className="font-['DM_Mono',monospace] text-[12px] font-bold">STEP 04</span>
                    <h3 className="font-bold text-[16px] text-[#1a1a2e]">最終四層結論定案</h3>
                </div>
                <div className="bg-white border-2 border-[#1a1a2e] rounded-[10px] p-8 space-y-8 relative overflow-hidden shadow-xl">
                    <div className="flex items-center gap-3 opacity-20">
                        <PenLine size={24} />
                        <span className="font-['DM_Mono',monospace] text-[10px] uppercase tracking-widest font-bold">Formal Findings / W14 Final Output</span>
                    </div>

                    <div className="space-y-8 font-['Noto_Serif_TC',serif] leading-loose text-[15px]">
                        <div className="space-y-4">
                            <span className="bg-[#c9a84c] text-white px-2 py-0.5 text-[10px] font-bold font-['DM_Mono',monospace] uppercase">L1/L2: Qualitative Interpretation</span>
                            <p className="border-b border-[#dddbd5] pb-4">
                                根據訪談結果顯示，大部分受訪者皆提及「...」（放入原話引言）。這個結果顯示＿＿＿＿＿＿＿＿，其背後的深意可能是＿＿＿＿＿＿＿＿。
                            </p>
                        </div>
                        <div className="space-y-4 bg-[#f8f7f4] p-6 rounded-[4px] border-l-4 border-[#1a1a2e]">
                            <div className="flex items-center justify-between">
                                <span className="bg-[#1a1a2e] text-white px-2 py-0.5 text-[10px] font-bold font-['DM_Mono',monospace] uppercase">L3: Core Thesis</span>
                            </div>
                            <p className="leading-loose">
                                本研究原本旨在探訪＿＿＿＿＿。綜合受訪者心聲，本研究的答案是＿＿＿＿＿＿＿＿。
                            </p>
                        </div>
                        <div className="space-y-4">
                            <span className="bg-[#e32d5b] text-white px-2 py-0.5 text-[10px] font-bold font-['DM_Mono',monospace] uppercase">L4: Study Limitations</span>
                            <p className="text-[#4a4a6a]">
                                本研究受限於訪談對象的特定背景（如：僅限高三學生），因此不宜以此推廣全貌。未來研究可建議＿＿＿＿＿＿＿＿。
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};
