import React from 'react';
import { DocLinkBtn } from '../../components/analysis/DocLinkBtn';
import { PromptBox, AIInstructionDropdown } from '../../components/analysis/PromptBox';
import { Bot, Scale, AlertTriangle, PenLine, Info, ArrowRight } from 'lucide-react';

export const ObservationModule = () => {
    return (
        <div className="p-8 md:p-12 space-y-12 animate-in fade-in slide-in-from-right-4 duration-500 font-['Noto_Sans_TC',sans-serif] text-[14px] leading-[1.6] text-[#1a1a2e]">

            {/* Header */}
            <header className="space-y-4">
                <div className="flex items-center gap-2">
                    <span className="bg-[#2e7d5a] text-white text-[10px] font-bold px-2 py-0.5 rounded-[2px] font-['DM_Mono',monospace] uppercase tracking-wider">Method 04</span>
                    <span className="text-[11px] text-[#8888aa] font-['DM_Mono',monospace] tracking-widest uppercase">Observational / 實地觀察記錄分析</span>
                </div>
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <h2 className="font-['Noto_Serif_TC',serif] text-[28px] font-bold text-[#1a1a2e] leading-tight">觀察法：四層次寫作工作坊</h2>
                    <DocLinkBtn href="https://docs.google.com/document/d/1s_LLHFyh-GA8X0m1bAWssmVtVsC7xgaFaRWOS86APRk/edit?usp=drive_link">
                        完整指南
                    </DocLinkBtn>
                </div>
                <p className="text-[14px] text-[#4a4a6a] max-w-[600px] leading-relaxed">
                    除了從行為中發現模式，更能產出包含「田野脈絡觀點」與「環境變項」的嚴謹觀察結論。
                </p>
            </header>

            {/* Step 2: AI Audit */}
            <section className="space-y-6">
                <div className="flex items-center gap-3 border-b border-[#dddbd5] pb-2 text-[#2d5be3]">
                    <span className="font-['DM_Mono',monospace] text-[12px] font-bold">STEP 02</span>
                    <h3 className="font-bold text-[16px] text-[#1a1a2e]">AI 檢核與潤飾</h3>
                </div>
                <div className="bg-[#1a1a2e] text-white rounded-[10px] p-10 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:scale-110 transition-transform duration-700">
                        <Bot size={120} />
                    </div>
                    <div className="relative z-10 space-y-8">
                        <p className="text-white/60 text-[13px] leading-relaxed max-w-[600px]">
                            將你的四層初稿、連同田野筆記或頻率統計表餵給 AI。請它扮演第二雙眼睛，檢查你的描述是否有過多主觀臆測。
                        </p>

                        <div className="bg-black/40 rounded-[8px] border border-white/10 p-6 space-y-6 font-['DM_Mono',monospace]">
                            <div className="flex items-center justify-between border-b border-white/5 pb-4">
                                <div className="text-[10px] font-bold text-[#2d5be3] uppercase tracking-widest">// Observation Audit Prompt</div>
                                <button className="text-[10px] text-white/30 hover:text-white transition-colors">COPY</button>
                            </div>
                            <div className="text-[12px] leading-relaxed text-white/80">
                                <p>觀察場景：＿＿＿（如：學校圖書館）</p>
                                <p className="mt-2 text-white/40">我的四層初稿：【貼上初稿】</p>
                                <p className="text-white/40">觀察紀錄：【貼上內容】</p>
                                <div className="mt-4 p-4 bg-white/5 rounded border-l-2 border-[#2d5be3] space-y-2">
                                    <p>1. 檢核描述層有無「非客觀」的臆測言詞。</p>
                                    <p>2. 優化詮釋層，補充可能被我忽略的環境脈絡因素。</p>
                                    <p>3. 「回扣層」主意已定，請僅輔助文句潤飾。</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-[#f8f7f4] border border-[#dddbd5] rounded-[6px] p-6 flex flex-col md:flex-row gap-6 items-start">
                    <div className="shrink-0 pt-1 text-[#2d5be3]"><Info size={20} /></div>
                    <div className="space-y-2">
                        <h4 className="font-bold text-[#1a1a2e] text-[13px] uppercase tracking-wider font-['DM_Mono',monospace]">Data Types // 資料型態說明</h4>
                        <p className="text-[12px] text-[#8888aa] leading-relaxed">
                            不論你的資料是「量」的（舉手頻率統計）還是「質」的（情境描述筆記），AI 均能協助分析行為模式。重點在於<strong>將行為與環境連結</strong>。
                        </p>
                    </div>
                </div>
            </section>

            {/* Step 3: Human Judgment */}
            <section className="space-y-6">
                <div className="flex items-center gap-3 border-b border-[#dddbd5] pb-2 text-[#e32d5b]">
                    <span className="font-['DM_Mono',monospace] text-[12px] font-bold">STEP 03</span>
                    <h3 className="font-bold text-[16px] text-[#1a1a2e]">人工裁奪：我是現場見證者</h3>
                </div>
                <p className="text-[14px] text-[#4a4a6a] max-w-[600px] leading-relaxed italic">
                    AI 只能讀到「文字」，但<strong>只有你到過現場</strong>。你的責任是找回被 AI 抽象化的情境真相。
                </p>
                <div className="grid md:grid-cols-2 gap-6 mt-8">
                    {[
                        { title: '陷阱：忽略特殊事件', desc: 'AI 說「圖書館沒人閱覽」，但你觀察的那週適逢畢業旅行或期末考週？', fix: '裁奪：這是關鍵的「脈絡因素」。必須在限制中標註特殊事件對頻率的影響。' },
                        { title: '陷阱：觀察者效應', desc: 'AI 覺得大家都很守規矩。但會不會是因為你拿著板子盯著他們看？', fix: '裁奪：要誠實！若受觀察者知情，可能產生行為偏差，必須寫進限制中。' },
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
                <div className="bg-white border-2 border-[#1a1a2e] rounded-[10px] p-8 space-y-8 relative overflow-hidden shadow-xl text-[15px]">
                    <div className="flex items-center gap-3 opacity-20">
                        <PenLine size={24} />
                        <span className="font-['DM_Mono',monospace] text-[10px] uppercase tracking-widest font-bold">Field Findings / W14 Final Output</span>
                    </div>

                    <div className="space-y-8 font-['Noto_Serif_TC',serif] leading-loose">
                        <div className="space-y-4">
                            <span className="bg-[#2e7d5a] text-white px-2 py-0.5 text-[10px] font-bold font-['DM_Mono',monospace] uppercase">L1/L2: Behavioral Patterns</span>
                            <p className="border-b border-[#dddbd5] pb-4">
                                在共計＿＿次的實地觀察中，我們記錄到＿＿行為穩定出現（或：出現頻率高達＿＿）。此現象反應出該場域的＿＿背景，其導火線可能是＿＿＿＿。
                            </p>
                        </div>
                        <div className="space-y-4 bg-[#f8f7f4] p-6 rounded-[4px] border-l-4 border-[#1a1a2e]">
                            <div className="flex items-center justify-between">
                                <span className="bg-[#1a1a2e] text-white px-2 py-0.5 text-[10px] font-bold font-['DM_Mono',monospace] uppercase">L3: Contextual Conclusion</span>
                            </div>
                            <p className="leading-loose">
                                針對原本想了解的＿＿狀況。綜合現場觀察與筆記，本研究得出＿＿的回答。
                            </p>
                        </div>
                        <div className="space-y-4">
                            <span className="bg-[#e32d5b] text-white px-2 py-0.5 text-[10px] font-bold font-['DM_Mono',monospace] uppercase">L4: Observational Limits</span>
                            <p className="text-[#4a4a6a]">
                                唯需注意觀察者效應，且期間適逢＿＿等特定環境變因，結論不宜擴大推論至其他不具此特質之場域。
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};
