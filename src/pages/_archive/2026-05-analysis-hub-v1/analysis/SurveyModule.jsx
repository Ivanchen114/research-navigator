import React, { useState } from 'react';
import { DocLinkBtn } from '../../components/analysis/DocLinkBtn';
import { PromptBox, AIInstructionDropdown } from '../../components/analysis/PromptBox';
import { SurveyChart } from '../../components/analysis/SurveyChart';
import { Bot, BrainCircuit, PenLine, AlertTriangle, Scale, Info, ArrowRight } from 'lucide-react';

export const SurveyModule = () => {
    const [showChart, setShowChart] = useState(false);

    return (
        <div className="p-8 md:p-12 space-y-12 animate-in fade-in slide-in-from-right-4 duration-500 font-['Noto_Sans_TC',sans-serif] text-[14px] leading-[1.6] text-[#1a1a2e]">

            {/* Header */}
            <header className="space-y-4">
                <div className="flex items-center gap-2">
                    <span className="bg-[#2d5be3] text-white text-[10px] font-bold px-2 py-0.5 rounded-[2px] font-['DM_Mono',monospace] uppercase tracking-wider">Method 01</span>
                    <span className="text-[11px] text-[#8888aa] font-['DM_Mono',monospace] tracking-widest uppercase">Quantitative / 問卷分析</span>
                </div>
                <h2 className="font-['Noto_Serif_TC',serif] text-[28px] font-bold text-[#1a1a2e] leading-tight">量化問卷法：四層次寫作工作坊</h2>
                <p className="text-[14px] text-[#4a4a6a] max-w-[600px] leading-relaxed">
                    不再只讓 AI 算數字，而是引導 AI 檢核你的初稿，陪你產出「描述 → 詮釋 → 回扣 → 批判」的嚴謹結論。
                </p>
            </header>

            {/* Step 1: Data Cleaning */}
            <section className="space-y-6">
                <div className="flex items-center gap-3 border-b border-[#dddbd5] pb-2">
                    <span className="font-['DM_Mono',monospace] text-[12px] font-bold text-[#8888aa]">STEP 01</span>
                    <h3 className="font-bold text-[16px] text-[#1a1a2e]">餵給 AI 前的「隱私淨身」</h3>
                </div>
                <div className="bg-[#f8f7f4] border border-[#dddbd5] rounded-[6px] p-8 space-y-6">
                    <p className="text-[13px] text-[#4a4a6a] italic">AI 很聰明，但如果餵給它垃圾資料，它也只能產出垃圾 (Garbage in, garbage out)。</p>
                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            { title: '去除個資', desc: '刪除 Excel/CSV 中所有人的姓名、學號、社群帳號。' },
                            { title: '簡化標題', desc: '將冗長題目改為變數（例：Q1_使用時數）。' },
                            { title: '排除無效件', desc: '刪除填答不完整、亂填或邏輯相互矛盾的樣本。' },
                        ].map(item => (
                            <div key={item.title} className="space-y-2">
                                <h4 className="font-bold text-[13px] text-[#1a1a2e] flex items-center gap-2 text-[#2d5be3]">
                                    <div className="w-1.5 h-1.5 rounded-full bg-current"></div> {item.title}
                                </h4>
                                <p className="text-[12px] text-[#8888aa] leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
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
                            將整理後的數據，連同你<strong>親自撰寫的四層初稿</strong>交給 AI。請它扮演審查教授，指出論點中的統計矛盾或語氣瑕疵。
                        </p>

                        <div className="bg-black/40 rounded-[8px] border border-white/10 p-6 space-y-6 font-['DM_Mono',monospace]">
                            <div className="flex items-center justify-between border-b border-white/5 pb-4">
                                <div className="text-[10px] font-bold text-[#2d5be3] uppercase tracking-widest">// Analysis Audit Prompt</div>
                                <button className="text-[10px] text-white/30 hover:text-white transition-colors">COPY</button>
                            </div>
                            <div className="text-[12px] leading-relaxed text-white/80">
                                <p>我寫了四層結論初稿：【貼上初稿】</p>
                                <p className="mt-2 text-white/40">問卷統計資料（已淨身）：【貼上數據】</p>
                                <div className="mt-4 p-4 bg-white/5 rounded border-l-2 border-[#2d5be3] space-y-2">
                                    <p>1. 檢核「描述層」有無數字錯誤或量詞不精準。</p>
                                    <p>2. 優化「詮釋層」，補充可能遺漏的相關聯想。</p>
                                    <p>3. 「回扣層」內容請僅幫我潤飾，不要改變我的主見。</p>
                                    <p>4. 建議這類問卷常見的三種研究限制。</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Optional Chart Toggle */}
                <div className="bg-[#f8f7f4] border border-[#dddbd5] rounded-[6px] p-6 flex flex-col md:flex-row gap-10 items-center">
                    <div className="flex-1 space-y-4">
                        <h4 className="font-bold text-[#1a1a2e] text-[14px] flex items-center gap-2">
                            <span className="text-xl">📈</span> 自學補充：從圖表觀看趨勢
                        </h4>
                        <p className="text-[12px] text-[#8888aa] leading-relaxed">
                            若你已經初步繪製圖表，試著問：最高與最低點代表什麼？轉折點發生在哪？
                        </p>
                        <button
                            onClick={() => setShowChart(!showChart)}
                            className="bg-[#1a1a2e] text-white px-6 py-2 rounded-[4px] text-[12px] font-bold hover:bg-[#2a2a4a] transition-all"
                        >
                            {showChart ? '隱藏圖表' : '顯示長條圖範例'}
                        </button>
                    </div>
                    {showChart && (
                        <div className="w-full md:w-64 h-48 bg-white border border-[#dddbd5] rounded-[4px] p-4 animate-in zoom-in-95 duration-300 shadow-sm">
                            <SurveyChart />
                        </div>
                    )}
                </div>
            </section>

            {/* Step 3: Human Judgment */}
            <section className="space-y-6">
                <div className="flex items-center gap-3 border-b border-[#dddbd5] pb-2 text-[#e32d5b]">
                    <span className="font-['DM_Mono',monospace] text-[12px] font-bold">STEP 03</span>
                    <h3 className="font-bold text-[16px] text-[#1a1a2e]">人工裁奪：破解「偽相關」</h3>
                </div>
                <p className="text-[14px] text-[#4a4a6a] max-w-[600px] leading-relaxed italic">
                    AI 講得再好聽，你也<strong>不能照單全收</strong>。研究者的尊嚴在於你的判斷。
                </p>
                <div className="grid md:grid-cols-2 gap-6 mt-8">
                    {[
                        { title: '陷阱：相關 ≠ 因果', desc: 'AI 說：「有穿校服的人成績好，所以校服提升智力」。', fix: '裁奪：在問卷中，我們只能宣稱兩者「有正相關」，不能斷定因果關係。' },
                        { title: '陷阱：過度推論', desc: 'AI 說：「這證明了全國高中生的習慣」。', fix: '裁奪：樣本數受限（僅 50 人），結論必須註明「此結果僅供初步參考」。' },
                    ].map(item => (
                        <div key={item.title} className="p-6 border border-[#dddbd5] rounded-[10px] space-y-4 hover:border-[#e32d5b] transition-colors bg-white shadow-sm">
                            <h4 className="font-bold text-[14px] text-[#e32d5b] flex items-center gap-2">
                                <AlertTriangle size={16} /> {item.title}
                            </h4>
                            <p className="text-[12px] text-[#8888aa] leading-relaxed">{item.desc}</p>
                            <div className="bg-[#f0f9f4] p-3 rounded-[4px] border border-[#2e7d5a]/20 text-[12px] font-bold text-[#2e7d5a]">
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
                        <span className="font-['DM_Mono',monospace] text-[10px] uppercase tracking-widest font-bold">Drafting Form / W14 Final Output</span>
                    </div>

                    <div className="space-y-8 font-['Noto_Serif_TC',serif] leading-loose text-[15px]">
                        <div className="space-y-4">
                            <span className="bg-[#2d5be3] text-white px-2 py-0.5 text-[10px] font-bold font-['DM_Mono',monospace] uppercase">L1/L2: Analysis</span>
                            <p className="border-b border-[#dddbd5] pb-4">
                                根據問卷統計結果顯示，＿＿＿＿＿＿＿＿，其中最明顯的是＿＿＿＿＿＿＿＿。這個結果顯示＿＿＿＿＿＿＿＿，可能的原因是＿＿＿＿＿＿＿＿。
                            </p>
                        </div>
                        <div className="space-y-4 bg-[#f8f7f4] p-6 rounded-[4px] border-l-4 border-[#1a1a2e]">
                            <div className="flex items-center justify-between">
                                <span className="bg-[#1a1a2e] text-white px-2 py-0.5 text-[10px] font-bold font-['DM_Mono',monospace] uppercase">L3: Reflection (Human Logic Only)</span>
                                <Info size={14} className="text-[#1a1a2e] opacity-40" />
                            </div>
                            <p className="leading-loose">
                                本研究原本旨在了解＿＿＿＿＿＿＿＿。根據分析，本研究的回答是＿＿＿＿＿＿＿＿。但需注意此結果僅說明＿＿＿＿＿＿＿＿。
                            </p>
                        </div>
                        <div className="space-y-4">
                            <span className="bg-[#e32d5b] text-white px-2 py-0.5 text-[10px] font-bold font-['DM_Mono',monospace] uppercase">L4: Critical Thinking</span>
                            <p className="text-[#4a4a6a]">
                                本研究的限制在於＿＿＿＿＿＿＿＿。因此不宜推論至＿＿＿＿＿＿＿＿。若要更完整回答此問題，未來可以＿＿＿＿＿＿＿＿。
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};
