import React, { useState } from 'react';
import { DocLinkBtn } from '../../components/analysis/DocLinkBtn';
import { FoundationChart } from '../../components/analysis/FoundationChart';
import { Bot, BrainCircuit, PenLine, AlertTriangle, CheckCircle2, Info, ArrowRight } from 'lucide-react';

export const FoundationModule = () => {
    const [showChart, setShowChart] = useState(false);

    return (
        <div className="p-8 md:p-12 space-y-12 animate-in fade-in slide-in-from-right-4 duration-500 font-['Noto_Sans_TC',sans-serif] text-[14px] leading-[1.6] text-[#1a1a2e]">
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 overflow-hidden">
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <span className="bg-[#2d5be3] text-white text-[10px] font-bold px-2 py-0.5 rounded-[2px] font-['DM_Mono',monospace] uppercase tracking-wider">Required</span>
                        <span className="text-[11px] text-[#8888aa] font-['DM_Mono',monospace] tracking-widest uppercase">⏱️ 10 min read</span>
                    </div>
                    <h2 className="font-['Noto_Serif_TC',serif] text-[28px] font-bold text-[#1a1a2e] leading-tight flex items-center gap-3">
                        Part 1：數據分析基礎邏輯
                    </h2>
                </div>
                <DocLinkBtn href="https://docs.google.com/document/d/12m5loeNoYrVKApfZKQRh3rvWX2oDKMqeII4S7zLMWQ0/edit?usp=drive_link">
                    閱讀完整教材文本
                </DocLinkBtn>
            </header>

            {/* W14 Core Process */}
            <section className="bg-[#f8f7f4] border border-[#dddbd5] rounded-[10px] p-8 space-y-8">
                <div className="flex items-center gap-3">
                    <span className="bg-[#1a1a2e] text-white w-6 h-6 rounded-full flex items-center justify-center text-[12px] font-bold font-['DM_Mono',monospace]">🚀</span>
                    <h3 className="font-['Noto_Serif_TC',serif] text-[20px] font-bold text-[#1a1a2e]">
                        W14 核心協作任務：先寫初稿，AI 來檢核
                    </h3>
                </div>

                <p className="text-[14px] text-[#4a4a6a] max-w-[600px] leading-relaxed italic border-l-2 border-[#2d5be3] pl-4">
                    在這場寫作工作坊中，我們的主軸是「<strong className="text-[#1a1a2e]">人先寫骨幹，AI 協助檢核與潤飾</strong>」。請依照你選擇的研究方法，進行以下三步驟：
                </p>

                <div className="grid md:grid-cols-3 gap-[1px] bg-[#dddbd5] border border-[#dddbd5] rounded-[6px] overflow-hidden">
                    <div className="bg-white p-6 space-y-4 hover:bg-[#f8f7f4] transition-colors group">
                        <div className="flex items-center gap-3 text-[#1a1a2e] font-bold text-[14px]">
                            <PenLine size={18} className="group-hover:text-[#2d5be3] transition-colors" /> 1. 自己寫初稿
                        </div>
                        <p className="text-[12px] text-[#8888aa] leading-relaxed">依照「四層寫作架構」寫出數字、推論與解答。</p>
                    </div>
                    <div className="bg-white p-6 space-y-4 hover:bg-[#f8f7f4] transition-colors group relative">
                        <div className="flex items-center gap-3 text-[#1a1a2e] font-bold text-[14px]">
                            <Bot size={18} className="group-hover:text-[#e32d5b] transition-colors" /> 2. AI 檢核與潤飾
                        </div>
                        <p className="text-[12px] text-[#8888aa] leading-relaxed">執行隱私淨身後，由 AI 優化敘述並指出漏洞。</p>
                    </div>
                    <div className="bg-white p-6 space-y-4 hover:bg-[#f8f7f4] transition-colors group">
                        <div className="flex items-center gap-3 text-[#1a1a2e] font-bold text-[14px]">
                            <BrainCircuit size={18} className="group-hover:text-[#2e7d5a] transition-colors" /> 3. 人工最後裁奪
                        </div>
                        <p className="text-[12px] text-[#8888aa] leading-relaxed">你是唯一的裁判！對照建議，產出最終的四層段落。</p>
                    </div>
                </div>
            </section>

            {/* Privacy Warning */}
            <section className="bg-[#1a1a2e] text-white p-8 rounded-[10px] relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
                    <AlertTriangle size={80} />
                </div>
                <div className="relative z-10 space-y-4">
                    <h3 className="font-['Noto_Serif_TC',serif] text-[18px] font-bold text-[#e32d5b] flex items-center gap-3 tracking-wide">
                        ⚠️ 隱私淨身警告 (餵給 AI 前必看)
                    </h3>
                    <p className="text-white/70 text-[13px] leading-relaxed max-w-[600px]">
                        數據上傳 AI 面臨個資外流風險。這是對受訪者的承諾，更是研究倫理的鐵規：
                    </p>
                    <ul className="grid md:grid-cols-2 gap-4 mt-6">
                        <li className="bg-white/5 p-4 border-l-2 border-[#e32d5b] rounded-r-[4px]">
                            <span className="font-bold block text-[12px] mb-2 font-['DM_Mono',monospace] uppercase text-white/40">Questionnaire</span>
                            <span className="text-[13px] font-medium">刪除表格內所有姓名、學號、社群暱稱。</span>
                        </li>
                        <li className="bg-white/5 p-4 border-l-2 border-[#c9a84c] rounded-r-[4px]">
                            <span className="font-bold block text-[12px] mb-2 font-['DM_Mono',monospace] uppercase text-white/40">Interview / Obs.</span>
                            <span className="text-[13px] font-medium">受訪者真實姓名改為代號 (例如：受訪者 A)。</span>
                        </li>
                    </ul>
                    <div className="mt-6 flex items-center gap-2 text-[#e32d5b] font-bold text-[12px] bg-[#e32d5b]/10 p-3 rounded-[4px] border border-[#e32d5b]/20">
                        <Info size={14} /> 絕對禁止：未完成個資清除，不准交給 AI。
                    </div>
                </div>
            </section>

            {/* Content 1: 4 Layers */}
            <section className="space-y-8">
                <div className="flex items-baseline gap-3">
                    <h3 className="font-['Noto_Serif_TC',serif] text-[22px] font-bold text-[#1a1a2e]">
                        如何寫好研究結論？四層次寫作法
                    </h3>
                </div>
                <p className="text-[14px] text-[#4a4a6a] max-w-[700px] leading-relaxed">
                    將所有發現整合，寫出嚴謹的研究結論。一個完整的結論段落必須包含以下四個層次：
                </p>

                <div className="space-y-12">
                    {/* Layer 1: Descriptive */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 border-b-2 border-[#2d5be3] pb-2 w-fit">
                            <span className="text-[18px]">📊</span>
                            <h4 className="font-bold font-['Noto_Serif_TC',serif] text-[18px] text-[#1a1a2e]">層次一：描述 (Descriptive)</h4>
                        </div>
                        <p className="text-[13px] text-[#4a4a6a] italic">目標：客觀陳述數據呈現的樣貌，不參雜個人感覺。</p>
                        <div className="grid md:grid-cols-2 gap-[1px] bg-[#dddbd5] border border-[#dddbd5] rounded-[6px] overflow-hidden">
                            <div className="bg-white p-6 space-y-4">
                                <span className="text-[10px] font-bold text-[#2e7d5a] uppercase tracking-widest block font-['DM_Mono',monospace]">Best Practice</span>
                                <ul className="text-[12px] text-[#4a4a6a] space-y-2 list-inside list-disc marker:text-[#2e7d5a]">
                                    <li>精準引用數字（例：佔 38%）</li>
                                    <li>兼顧兩極與中間值</li>
                                    <li>真實描述數據趨勢</li>
                                </ul>
                            </div>
                            <div className="bg-[#fdf2f2] p-6 space-y-4">
                                <span className="text-[10px] font-bold text-[#e32d5b] uppercase tracking-widest block font-['DM_Mono',monospace]">Risks</span>
                                <ul className="text-[12px] text-[#e32d5b] space-y-2 list-inside list-disc marker:text-[#e32d5b]/50">
                                    <li><strong>量詞失準：</strong> 把 38% 說成「絕大多數」</li>
                                    <li><strong>誇大差距：</strong> 差 5% 就說「差距懸殊」</li>
                                    <li><strong>忽略重要數據：</strong> 無視中間 60% 的樣貌</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Layer 2: Interpretive */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 border-b-2 border-[#c9a84c] pb-2 w-fit">
                            <span className="text-[18px]">🧠</span>
                            <h4 className="font-bold font-['Noto_Serif_TC',serif] text-[18px] text-[#1a1a2e]">層次二：詮釋 (Interpretive)</h4>
                        </div>
                        <p className="text-[13px] text-[#4a4a6a] italic">目標：解讀數字背後的意義，回答「那又怎樣 (So what?)」。</p>
                        <div className="grid md:grid-cols-2 gap-[1px] bg-[#dddbd5] border border-[#dddbd5] rounded-[6px] overflow-hidden">
                            <div className="bg-white p-6 space-y-4">
                                <span className="text-[10px] font-bold text-[#2e7d5a] uppercase tracking-widest block font-['DM_Mono',monospace]">Best Practice</span>
                                <ul className="text-[12px] text-[#4a4a6a] space-y-2 list-inside list-disc marker:text-[#2e7d5a]">
                                    <li>探討變項間的「相關性」</li>
                                    <li>推論造成現象的可能原因</li>
                                    <li>將數據結果與原本動機連結</li>
                                </ul>
                            </div>
                            <div className="bg-[#f0f9f4] p-6 space-y-4">
                                <span className="text-[10px] font-bold text-[#2e7d5a] uppercase tracking-widest block font-['DM_Mono',monospace]">Note</span>
                                <div className="p-4 bg-white/50 rounded-[4px] border border-[#2e7d5a]/10 space-y-3">
                                    <p className="text-[11px] leading-relaxed text-[#1a1a2e]">
                                        <strong className="text-[#e32d5b]">陷阱：</strong> 把「相關」當「因果」。<br />
                                        <span className="opacity-60 italic">例：吃早餐「導致」成績好 (❌)</span><br />
                                        <span className="font-bold">正解：兩者具備高度「正相關」(✅)</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Layer 3: Reflective */}
                    <div className="space-y-4 bg-[#f8f7f4] p-8 rounded-[10px] border border-[#dddbd5] relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#2d5be3] opacity-[0.03] rounded-bl-full pointer-events-none"></div>
                        <div className="flex items-center gap-3 border-b-2 border-[#1a1a2e] pb-2 w-fit">
                            <span className="text-[18px]">🎯</span>
                            <h4 className="font-bold font-['Noto_Serif_TC',serif] text-[18px] text-[#1a1a2e]">層次三：回扣 (Reflective)</h4>
                        </div>
                        <p className="text-[13px] text-[#4a4a6a] italic">目標：直接回答最初的研究問題。 AI 無法代替你的邏輯心臟。</p>
                        <div className="bg-white p-6 rounded-[4px] border border-[#dddbd5] mt-4 space-y-4">
                            <div className="flex items-center gap-2 text-[#2d5be3] font-bold text-[12px]">
                                <Info size={14} /> 核心鐵律
                            </div>
                            <p className="text-[14px] text-[#1a1a2e] leading-relaxed">
                                這層的內容和邏輯 <strong>只能由你親自完成</strong>。AI 只能幫你潤飾，因為只有你知道你最初想問什麼！明確宣告：「本研究原本旨在了解... 最終答案發現是...」
                            </p>
                        </div>
                    </div>

                    {/* Layer 4: Critical */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 border-b-2 border-[#2e7d5a] pb-2 w-fit">
                            <span className="text-[18px]">🔍</span>
                            <h4 className="font-bold font-['Noto_Serif_TC',serif] text-[18px] text-[#1a1a2e]">層次四：批判 (Critical)</h4>
                        </div>
                        <p className="text-[13px] text-[#4a4a6a] italic">目標：檢視結論的限制與可信度，展現嚴謹的研究者態度。</p>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="bg-white p-6 border border-[#dddbd5] rounded-[6px] space-y-4">
                                <h5 className="font-bold text-[12px] uppercase tracking-wider text-[#2e7d5a]">嚴謹自檢表</h5>
                                <ul className="text-[12px] text-[#4a4a6a] space-y-2 list-inside list-disc">
                                    <li>主動承認樣本代表性不足</li>
                                    <li>指出被遺漏的干擾變項</li>
                                    <li>誠實面對研究無法回答的問題</li>
                                </ul>
                            </div>
                            <div className="bg-white p-6 border border-[#dddbd5] rounded-[6px] space-y-4">
                                <h5 className="font-bold text-[12px] uppercase tracking-wider text-[#e32d5b]">警戒地雷</h5>
                                <ul className="text-[12px] text-[#4a4a6a] space-y-2 list-inside list-disc">
                                    <li><strong>過度推論：</strong> 調查了 2 個班就說「全世界的高中生...」</li>
                                    <li><strong>隱瞞瑕疵：</strong> 刻意忽視回收數過少的問題</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Content 2: Detective Game */}
            <section className="pt-8">
                <div className="bg-[#f0ede6] border border-[#dddbd5] rounded-[10px] p-10 flex flex-col md:flex-row gap-10 items-center">
                    <div className="flex-1 space-y-4 text-center md:text-left">
                        <div className="text-[10px] font-bold text-[#c9a84c] uppercase tracking-[0.2em] font-['DM_Mono',monospace]">Advanced Training // 進階思維特訓</div>
                        <h3 className="font-['Noto_Serif_TC',serif] text-[24px] font-bold text-[#1a1a2e]">行動代號：濾鏡</h3>
                        <p className="text-[14px] text-[#4a4a6a] leading-relaxed max-w-[500px]">
                            化身數據偵探，從看似合理的報告中找出隱藏的偏誤與神邏輯。鍛鍊你看穿「數據假象」的雙眼。
                        </p>
                    </div>
                    <div className="shrink-0 w-full md:w-fit">
                        <a href="/game/data-detective" className="flex items-center justify-center gap-2 bg-[#1a1a2e] text-white px-10 py-4 rounded-[6px] font-bold text-[15px] hover:bg-[#2a2a4a] transition-all shadow-lg group">
                            進入模擬任務 <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
};
