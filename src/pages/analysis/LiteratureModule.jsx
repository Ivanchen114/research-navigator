import React from 'react';
import { DocLinkBtn } from '../../components/analysis/DocLinkBtn';
import { PromptBox, AIInstructionDropdown } from '../../components/analysis/PromptBox';
import { Bot, Scale, AlertTriangle, PenLine, Info, ArrowRight } from 'lucide-react';

export const LiteratureModule = () => {
    return (
        <div className="p-8 md:p-12 space-y-12 animate-in fade-in slide-in-from-right-4 duration-500 font-['Noto_Sans_TC',sans-serif] text-[14px] leading-[1.6] text-[#1a1a2e]">

            {/* Header */}
            <header className="space-y-4">
                <div className="flex items-center gap-2">
                    <span className="bg-[#1a1a2e] text-white text-[10px] font-bold px-2 py-0.5 rounded-[2px] font-['DM_Mono',monospace] uppercase tracking-wider">Method 05</span>
                    <span className="text-[11px] text-[#8888aa] font-['DM_Mono',monospace] tracking-widest uppercase">Secondary / 文獻分析與綜合回顧</span>
                </div>
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <h2 className="font-['Noto_Serif_TC',serif] text-[28px] font-bold text-[#1a1a2e] leading-tight">文獻分析：四層次寫作工作坊</h2>
                    <DocLinkBtn href="https://docs.google.com/document/d/1NCc62n2kU5xRIM6uRTMU4howa4SnLlcG46iJ6cNJi-Q/edit?usp=drive_link">
                        完整指南
                    </DocLinkBtn>
                </div>
                <p className="text-[14px] text-[#4a4a6a] max-w-[600px] leading-relaxed">
                    綜合 (Synthesize) 多方觀點，並確認你提出的「研究缺口」具有足夠的說服力與邏輯基礎。
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
                            將你對多篇文獻的歸納小結與<strong>四層初稿</strong>交給 AI。請它檢查你是否誤讀了學界共識，或「研究缺口」轉折得太硬。
                        </p>

                        <div className="bg-black/40 rounded-[8px] border border-white/10 p-6 space-y-6 font-['DM_Mono',monospace]">
                            <div className="flex items-center justify-between border-b border-white/5 pb-4">
                                <div className="text-[10px] font-bold text-[#2d5be3] uppercase tracking-widest">// Literature Audit Prompt</div>
                                <button className="text-[10px] text-white/30 hover:text-white transition-colors">COPY</button>
                            </div>
                            <div className="text-[12px] leading-relaxed text-white/80">
                                <p>研究主題：＿＿＿</p>
                                <p className="mt-2 text-white/40">文獻回顧小結初稿：【貼上初稿】</p>
                                <p className="text-white/40">主要文獻摘要：[文獻 A] ... [文獻 B] ...</p>
                                <div className="mt-4 p-4 bg-white/5 rounded border-l-2 border-[#2d5be3] space-y-2">
                                    <p>1. 檢核我歸納的「學界共識與分歧」是否客觀準確。</p>
                                    <p>2. 我的「研究缺口」邏輯是否順暢，能否自然導向我的題目？</p>
                                    <p>3. 建議文獻探討常見的三種限制（如搜查時效性等）。</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Self-Learning: Matrix */}
            <section className="space-y-6">
                <div className="flex items-center gap-3 border-b border-[#dddbd5] pb-2">
                    <h3 className="font-bold text-[16px] text-[#1a1a2e] font-['Noto_Serif_TC',serif]">進階工具：綜合矩陣 (Synthesis Matrix)</h3>
                </div>
                <div className="bg-[#f8f7f4] border border-[#dddbd5] rounded-[6px] p-10 space-y-8">
                    <div className="flex flex-col md:flex-row gap-10">
                        <div className="flex-1 space-y-4">
                            <p className="text-[13px] text-[#4a4a6a] leading-relaxed">
                                資料多到不知如何整理？請 AI 幫你畫出「綜合矩陣」。這是文獻探討的靈魂，能一眼看出學派間的對立。
                            </p>
                            <div className="p-4 bg-white border border-[#dddbd5] rounded-[4px] font-['DM_Mono',monospace] space-y-3">
                                <div className="text-[10px] font-bold text-[#8888aa] uppercase tracking-widest">// Comparative Matrix Prompt</div>
                                <p className="text-[12px] text-[#1a1a2e] leading-relaxed">
                                    「請幫我製作一個比較表格 (Matrix)，比較文章 A, B, C 在『主因』與『解方』的異同，並找出他們的共識與分歧。」
                                </p>
                            </div>
                        </div>

                        <div className="flex-1 overflow-hidden shadow-xl rounded-[6px] border border-[#1a1a2e] bg-white">
                            <table className="w-full text-[12px]">
                                <thead className="bg-[#1a1a2e] text-white">
                                    <tr>
                                        <th className="p-4 text-left font-bold uppercase tracking-wider font-['DM_Mono',monospace]">Dimension / 面向</th>
                                        <th className="p-4 text-left border-l border-white/10">文獻 A (心理)</th>
                                        <th className="p-4 text-left border-l border-white/10">文獻 B (社會)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-b border-[#dddbd5]">
                                        <td className="p-4 font-bold bg-[#f8f7f4]">核心成因</td>
                                        <td className="p-4">內部焦慮</td>
                                        <td className="p-4 border-l border-[#dddbd5]">環境連結需求</td>
                                    </tr>
                                    <tr>
                                        <td className="p-4 font-bold bg-[#f8f7f4]">建議解方</td>
                                        <td className="p-4 text-[#e32d5b] font-bold italic">個人諮商</td>
                                        <td className="p-4 border-l border-[#dddbd5] text-[#2d5be3] font-bold italic">社群機制調整</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <p className="text-center text-[11px] text-[#8888aa] font-medium italic underline decoration-[#dddbd5] underline-offset-4">綜合矩陣範例：清楚展現學科間的視角分歧。</p>
                </div>
            </section>

            {/* Step 3: Human Judgment */}
            <section className="space-y-6">
                <div className="flex items-center gap-3 border-b border-[#dddbd5] pb-2 text-[#e32d5b]">
                    <span className="font-['DM_Mono',monospace] text-[12px] font-bold">STEP 03</span>
                    <h3 className="font-bold text-[16px] text-[#1a1a2e]">人工裁奪：對焦你的研究</h3>
                </div>
                <p className="text-[14px] text-[#4a4a6a] max-w-[600px] leading-relaxed italic">
                    AI 找出的「缺口」往往極其宏大或空泛。你必須將它拉回你那小而美的研究題目。
                </p>
                <div className="grid md:grid-cols-2 gap-6 mt-8">
                    {[
                        { title: '陷阱：模糊的假共識', desc: 'AI 說這三篇都同意手機讓人變笨。但其實一篇指注意力，一篇指記憶力，概念並不相同。', fix: '裁奪：必須自己對照原始文獻！在寫作時區分清楚不同的認知維度，避免混為一談。' },
                        { title: '陷阱：偏離主題的缺口', desc: 'AI 找出的缺口是「缺乏對長輩的探討」，但你的題目明明是關於「高中生」。', fix: '裁奪：拒絕 AI 建議的缺口！手動引導回：「雖然已有高中生研究，但缺乏『質性訪談』的角度」。' },
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
                        <span className="font-['DM_Mono',monospace] text-[10px] uppercase tracking-widest font-bold">Literature Review / W14 Final Output</span>
                    </div>

                    <div className="space-y-8 font-['Noto_Serif_TC',serif] leading-loose">
                        <div className="space-y-4">
                            <span className="bg-[#2d5be3] text-white px-2 py-0.5 text-[10px] font-bold font-['DM_Mono',monospace] uppercase">L1/L2: Scholarly Consensus</span>
                            <p className="border-b border-[#dddbd5] pb-4">
                                綜合上述文獻，目前學界對於「＿＿＿＿」多傾向於認為＿＿＿＿。然而，在＿＿＿＿的細節上各方研究仍存有顯著分歧，這反應出＿＿＿＿。
                            </p>
                        </div>
                        <div className="space-y-4 bg-[#f8f7f4] p-6 rounded-[4px] border-l-4 border-[#1a1a2e]">
                            <div className="flex items-center justify-between">
                                <span className="bg-[#1a1a2e] text-white px-2 py-0.5 text-[10px] font-bold font-['DM_Mono',monospace] uppercase">L3: Research Gap</span>
                                <Info size={14} className="text-[#1a1a2e] opacity-40" />
                            </div>
                            <p className="leading-loose italic">
                                雖然過去研究已探究了＿＿＿＿。然而，對於＿＿＿＿（這就是你本研究要填補的拼圖）的了解仍相對空窗。本研究旨在填補此一缺口。
                            </p>
                        </div>
                        <div className="space-y-4">
                            <span className="bg-[#e32d5b] text-white px-2 py-0.5 text-[10px] font-bold font-['DM_Mono',monospace] uppercase">L4: Scope Limits</span>
                            <p className="text-[#4a4a6a]">
                                唯需注意，本章回顧主要受限於現有國內二手資料之數量，且部分資料年代可能面臨時效性挑戰。
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};
