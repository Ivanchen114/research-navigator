import React, { useState } from 'react';
import { DocLinkBtn } from '../../components/analysis/DocLinkBtn';
import { PromptBox, AIInstructionDropdown } from '../../components/analysis/PromptBox';
import { ExperimentChart } from '../../components/analysis/ExperimentChart';
import { Bot, Scale, AlertTriangle, PenLine, ArrowRight, Info } from 'lucide-react';

export const ExperimentModule = () => {
    const [showChart, setShowChart] = useState(false);

    return (
        <div className="p-8 md:p-12 space-y-12 animate-in fade-in slide-in-from-right-4 duration-500 font-['Noto_Sans_TC',sans-serif] text-[14px] leading-[1.6] text-[#1a1a2e]">

            {/* Header */}
            <header className="space-y-4">
                <div className="flex items-center gap-2">
                    <span className="bg-[#1a1a2e] text-white text-[10px] font-bold px-2 py-0.5 rounded-[2px] font-['DM_Mono',monospace] uppercase tracking-wider">Method 03</span>
                    <span className="text-[11px] text-[#8888aa] font-['DM_Mono',monospace] tracking-widest uppercase">Experimental / 實驗數據分析</span>
                </div>
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <h2 className="font-['Noto_Serif_TC',serif] text-[28px] font-bold text-[#1a1a2e] leading-tight">實驗法：四層次寫作工作坊</h2>
                    <DocLinkBtn href="https://docs.google.com/document/d/1RMvSA-ee7DUVFpxrOh6FhqocE0Q2QNgcQA_PO8fik2c/edit?usp=drive_link">
                        完整指南
                    </DocLinkBtn>
                </div>
                <p className="text-[14px] text-[#4a4a6a] max-w-[600px] leading-relaxed">
                    除了證明獨變項的操作有效，更能產出包含「干擾變因」與「研究限制」的嚴謹實驗結論。
                </p>
            </header>

            {/* Step 1: Design Audit */}
            <section className="space-y-6">
                <div className="flex items-center gap-3 border-b border-[#dddbd5] pb-2">
                    <span className="font-['DM_Mono',monospace] text-[12px] font-bold text-[#8888aa]">STEP 01</span>
                    <h3 className="font-bold text-[16px] text-[#1a1a2e]">實驗設計邏輯自查</h3>
                </div>
                <div className="bg-[#f8f7f4] border border-[#dddbd5] rounded-[6px] p-8 space-y-6">
                    <div className="flex items-start gap-4">
                        <div className="shrink-0 w-8 h-8 rounded-full bg-[#1a1a2e] text-white flex items-center justify-center font-bold text-[12px]">?</div>
                        <div className="space-y-2">
                            <p className="text-[13px] text-[#1a1a2e] font-bold leading-relaxed">在分析數據前，先讓 AI 幫你找出實驗設計的「隱形漏洞」。</p>
                            <p className="text-[12px] text-[#8888aa] leading-relaxed">很多時候實驗看似成功，其實是被受試者程度或施測環境干擾了。</p>
                        </div>
                    </div>

                    <div className="bg-white border border-[#dddbd5] rounded-[4px] p-6 space-y-6 font-['DM_Mono',monospace]">
                        <div className="text-[10px] font-bold text-[#8888aa] uppercase tracking-widest">// Design Audit Prompt</div>
                        <div className="text-[12px] leading-relaxed text-[#4a4a6a]">
                            <p>【我的實驗設計】</p>
                            <p className="mt-2">• 研究目的：測試「聽音樂」是否提升「解題速度」</p>
                            <p>• 實驗組：聽莫札特；對照組：安靜環境</p>
                            <p>• 測量：兩組皆進行前後測</p>
                            <div className="mt-4 p-4 bg-[#f8f7f4] border-l-2 border-[#1a1a2e] text-[#1a1a2e]">
                                任務：請指出這個設計中有哪些潛在的「干擾變項」？屬於真實驗還是準實驗？
                            </div>
                        </div>
                    </div>
                </div>
            </section>

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
                            將兩組的前後測差異與<strong>四層結論初稿</strong>交給 AI。請它檢查你的推論是否跳躍，或是否過度歸功於你的實驗介入。
                        </p>

                        <div className="bg-black/40 rounded-[8px] border border-white/10 p-6 space-y-6 font-['DM_Mono',monospace]">
                            <div className="flex items-center justify-between border-b border-white/5 pb-4">
                                <div className="text-[10px] font-bold text-[#2d5be3] uppercase tracking-widest">// Statistical Audit Prompt</div>
                                <button className="text-[10px] text-white/30 hover:text-white transition-colors">COPY</button>
                            </div>
                            <div className="text-[12px] leading-relaxed text-white/80">
                                <p>這是我自己寫的四層初稿：【貼上初稿】</p>
                                <p className="mt-2 text-white/40">實驗室數據：【貼上數據】</p>
                                <div className="mt-4 p-4 bg-white/5 rounded border-l-2 border-[#2d5be3] space-y-2">
                                    <p>1. 檢核描述層的成長百分比計算是否精確。</p>
                                    <p>2. 優化詮釋層，建議可能的科學解釋或外部干擾因素。</p>
                                    <p>3. 「回扣層」主見已定，輔助修飾文句即可。</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Optional Chart Toggle */}
                <div className="bg-[#f8f7f4] border border-[#dddbd5] rounded-[6px] p-6 flex flex-col md:flex-row gap-10 items-center">
                    <div className="flex-1 space-y-4">
                        <h4 className="font-bold text-[#1a1a2e] text-[14px] flex items-center gap-2">
                            <span className="text-xl">📊</span> 自學補充：成長幅度比較
                        </h4>
                        <p className="text-[12px] text-[#8888aa] leading-relaxed">
                            視覺化是實驗法最有利的武器。繪製折線圖觀察「斜率」的差異。
                        </p>
                        <button
                            onClick={() => setShowChart(!showChart)}
                            className="bg-[#1a1a2e] text-white px-6 py-2 rounded-[4px] text-[12px] font-bold hover:bg-[#2a2a4a] transition-all"
                        >
                            {showChart ? '隱藏圖表' : '繪製折線圖範例'}
                        </button>
                    </div>
                    {showChart && (
                        <div className="w-full md:w-64 h-48 bg-white border border-[#dddbd5] rounded-[4px] p-4 animate-in zoom-in-95 duration-300 shadow-sm">
                            <ExperimentChart />
                        </div>
                    )}
                </div>
            </section>

            {/* Step 3: Human Judgment */}
            <section className="space-y-6">
                <div className="flex items-center gap-3 border-b border-[#dddbd5] pb-2 text-[#e32d5b]">
                    <span className="font-['DM_Mono',monospace] text-[12px] font-bold">STEP 03</span>
                    <h3 className="font-bold text-[16px] text-[#1a1a2e]">人工裁奪：魔鬼代言人</h3>
                </div>
                <p className="text-[14px] text-[#4a4a6a] max-w-[600px] leading-relaxed italic">
                    AI 看到數字進步，就會宣稱「有效」。但研究者必須保持懷疑，找出可能存在的瑕疵。
                </p>
                <div className="grid md:grid-cols-2 gap-6 mt-8">
                    {[
                        { title: '陷阱：未受控的時空', desc: '實驗組喝飲料成績變好，但你沒提到兩組考試的時間（早 vs 晚）不一樣？', fix: '裁奪：如果施測環境不統一，不能斷定因果。必須在結論老實承認此變因。' },
                        { title: '陷阱：霍桑效應', desc: '數據太完美，但受試者可能只是因為「知道在被觀察」而特別努力。', fix: '裁奪：不要宣稱「百分之百有用」。改寫為「數據顯示差異，但受限於情境需謹慎解讀」。' },
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
                        <span className="font-['DM_Mono',monospace] text-[10px] uppercase tracking-widest font-bold">Scientific Report / W14 Final Output</span>
                    </div>

                    <div className="space-y-8 font-['Noto_Serif_TC',serif] leading-loose">
                        <div className="space-y-4">
                            <span className="bg-[#2d5be3] text-white px-2 py-0.5 text-[10px] font-bold font-['DM_Mono',monospace] uppercase">L1/L2: Experimental Evidence</span>
                            <p className="border-b border-[#dddbd5] pb-4">
                                根據實驗數據顯示，實驗組在前測與後測之間有＿＿％的顯著成長。這顯示操作＿＿具有一定成效，其背後原理可能是＿＿＿＿。
                            </p>
                        </div>
                        <div className="space-y-4 bg-[#f8f7f4] p-6 rounded-[4px] border-l-4 border-[#1a1a2e]">
                            <div className="flex items-center justify-between">
                                <span className="bg-[#1a1a2e] text-white px-2 py-0.5 text-[10px] font-bold font-['DM_Mono',monospace] uppercase">L3: Hypothesis Confirmation</span>
                            </div>
                            <p className="leading-loose">
                                本研究原旨在驗證＿＿。分析結果（支持/不支持）了原假設，這說明＿＿＿＿＿。
                            </p>
                        </div>
                        <div className="space-y-4">
                            <span className="bg-[#e32d5b] text-white px-2 py-0.5 text-[10px] font-bold font-['DM_Mono',monospace] uppercase">L4: Methodological Reflection</span>
                            <p className="text-[#4a4a6a]">
                                唯需注意，本實驗未完全控制之變項包含＿＿＿＿，可能影響結果之純淨度。未來建議採用更嚴謹的對照機制。
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};
