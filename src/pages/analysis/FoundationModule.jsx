import React, { useState } from 'react';
import { DocLinkBtn } from '../../components/analysis/DocLinkBtn';
import { FoundationChart } from '../../components/analysis/FoundationChart';
import { Bot, BrainCircuit, PenLine } from 'lucide-react';

export const FoundationModule = () => {
    const [showChart, setShowChart] = useState(false);

    return (
        <div className="p-6 md:p-8 space-y-8 animate-in fade-in slide-in-from-right-4">
            {/* Header */}
            <header className="border-b border-slate-200 pb-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">Part 1：數據分析基礎邏輯</h2>
                        <div className="flex flex-wrap gap-4 mt-2 text-sm text-slate-500">
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded font-medium">必讀</span>
                            <span>⏱️ 閱讀時間：約 10 分鐘</span>
                        </div>
                    </div>
                    <DocLinkBtn href="https://docs.google.com/document/d/12m5loeNoYrVKApfZKQRh3rvWX2oDKMqeII4S7zLMWQ0/edit?usp=drive_link">
                        閱讀完整教材文本
                    </DocLinkBtn>
                </div>
            </header>

            {/* W14 Core Process */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl shadow-sm border border-blue-100">
                <h3 className="text-xl font-bold mb-4 text-slate-800 flex items-center gap-2">
                    <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">🚀</span>
                    W14 核心協作任務：先寫初稿，AI 來檢核
                </h3>
                <p className="mb-6 text-slate-700 text-sm">
                    在這場寫作工作坊中，我們的主軸是「<strong className="text-blue-700">人先寫骨幹，AI 協助檢核與潤飾</strong>」。請依照你選擇的研究方法（左側選單），進行以下三步驟：
                </p>
                <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-blue-100 flex flex-col gap-2 relative">
                        <div className="flex items-center gap-2 text-blue-700 font-bold">
                            <PenLine size={20} /> 1. 自己寫初稿
                        </div>
                        <p className="text-sm text-slate-600">不依靠 AI，自己先依循「四層寫作架構」寫出數字、推論與解答。</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-rose-100 flex flex-col gap-2 relative">
                        <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-rose-100 text-rose-500 rounded-full flex items-center justify-center hidden md:flex">➔</div>
                        <div className="flex items-center gap-2 text-rose-700 font-bold">
                            <Bot size={20} /> 2. AI 檢核與潤飾
                        </div>
                        <p className="text-sm text-slate-600">完成個資清除後，將資料與初稿餵給 AI，請它找漏洞、優化敘述，並提出研究限制建議。</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-emerald-100 flex flex-col gap-2 relative">
                        <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center hidden md:flex">➔</div>
                        <div className="flex items-center gap-2 text-emerald-700 font-bold">
                            <BrainCircuit size={20} /> 3. 人工最後裁奪
                        </div>
                        <p className="text-sm text-slate-600">你是唯一的裁判！對照 AI 的建議，決定採納或拒絕，產出最終的四層結論段落，帶去 W15 報告使用。</p>
                    </div>
                </div>
            </div>

            {/* Privacy Warning */}
            <div className="bg-rose-50 p-6 rounded-xl shadow-sm border-2 border-rose-200 animate-pulse-slow">
                <h3 className="text-xl font-bold mb-3 text-rose-900 flex items-center gap-2">
                    <span className="text-2xl">⚠️</span> 隱私淨身警告 (餵給 AI 前必看)
                </h3>
                <p className="text-slate-800 font-medium mb-2">
                    把資料貼給 AI 會面臨個資外流風險。這是對受訪者的承諾，更是研究倫理的鐵規：
                </p>
                <ul className="list-disc list-inside space-y-2 text-slate-700 font-bold ml-2">
                    <li>問卷組：必須刪除表格內所有人的姓名、學號、Line 暱稱。</li>
                    <li>訪談組 / 觀察組：必須將受訪者真實姓名改為代號 (受訪者 A、B、C)。</li>
                </ul>
                <p className="mt-4 text-sm text-rose-700 bg-rose-100 p-2 rounded-lg border border-rose-200">
                    絕對禁止：未完成個資清除，不可將任何資料交給 AI。
                </p>
            </div>

            {/* Content 1: Nature of Data Analysis */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <h3 className="text-xl font-bold mb-4 text-slate-800 flex items-center gap-2">
                    <span className="bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">1</span>
                    如何寫好研究結論？四層次寫作法
                </h3>
                <p className="mb-6 text-slate-600">
                    W13 學的是「單獨一張圖」的局部說明。W14 要大升級，將整份研究的所有發現整合，寫出真正的研究結論。
                    一個完整嚴謹的研究結論，必須包含這四個層次：
                </p>

                <div className="space-y-6">
                    {/* Layer 1: Descriptive */}
                    <div className="bg-slate-50 p-5 rounded-lg border-l-4 border-l-indigo-500 border border-slate-200">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="text-xl">📊</span>
                            <h4 className="font-bold text-lg text-slate-800">層次一：描述 (Descriptive)</h4>
                        </div>
                        <p className="text-sm text-slate-700 mb-3">
                            <strong>目標：客觀陳述數據呈現的樣貌，不參雜個人感覺。</strong>
                        </p>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="bg-emerald-50 p-3 rounded border border-emerald-100">
                                <span className="text-emerald-700 font-bold text-sm block mb-1">✅ 這樣寫才對：</span>
                                <ul className="text-sm text-slate-600 list-disc list-inside space-y-1">
                                    <li>精準引用數字（例：佔 38%）</li>
                                    <li>兼顧兩極與中間值（例：分數介於 59-88分）</li>
                                    <li>真實描述趨勢（例：上下波動）</li>
                                </ul>
                            </div>
                            <div className="bg-rose-50 p-3 rounded border border-rose-100">
                                <span className="text-rose-700 font-bold text-sm block mb-1">❌ 常見地雷：</span>
                                <ul className="text-sm text-slate-600 list-disc list-inside space-y-1">
                                    <li><strong>量詞失準：</strong> 把 38% 說成「絕大多數」</li>
                                    <li><strong>誇大差距：</strong> 差 5% 卻說「差距懸殊」</li>
                                    <li><strong>忽略重要數據：</strong> 只提最高最低，無視中間的 60%</li>
                                    <li><strong>錯誤趨勢歸納：</strong> 明明波動很大卻說「穩定成長」</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Layer 2: Interpretive */}
                    <div className="bg-slate-50 p-5 rounded-lg border-l-4 border-l-amber-500 border border-slate-200">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="text-xl">🧠</span>
                            <h4 className="font-bold text-lg text-slate-800">層次二：詮釋 (Interpretive)</h4>
                        </div>
                        <p className="text-sm text-slate-700 mb-3">
                            <strong>目標：解讀數字背後的意義，回答「那又怎樣 (So what?)」。</strong>
                        </p>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="bg-emerald-50 p-3 rounded border border-emerald-100">
                                <span className="text-emerald-700 font-bold text-sm block mb-1">✅ 這樣寫才對：</span>
                                <ul className="text-sm text-slate-600 list-disc list-inside space-y-1">
                                    <li>探討變項間的「相關性」</li>
                                    <li>推論造成這種現象的可能原因</li>
                                    <li>將數據結果與原本的研究動機連結</li>
                                </ul>
                            </div>
                            <div className="bg-rose-50 p-3 rounded border border-rose-100">
                                <span className="text-rose-700 font-bold text-sm block mb-1">❌ 常見地雷：</span>
                                <ul className="text-sm text-slate-600 list-disc list-inside space-y-1">
                                    <li><strong>把相關當因果：</strong> 例：「吃早餐『導致』成績好」 (❌) → 應改為「兩者有『正相關』」。</li>
                                    <li><strong>過度詮釋（腦補）：</strong> 隨意套用未經證實的成見。</li>
                                    <li><strong>用詞過強：</strong> 用「證明」、「絕對」等武斷字眼（研究只能說「支持了某個假設」或「顯示某種趨勢」）。</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Layer 3: Reflective */}
                    <div className="bg-rose-50 p-5 rounded-lg border-l-4 border-l-rose-500 border border-slate-200 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-rose-200/50 rounded-bl-full -z-10 blur-xl"></div>
                        <div className="flex items-center gap-2 mb-3">
                            <span className="text-xl">🎯</span>
                            <h4 className="font-bold text-lg text-rose-900">層次三：回扣 (Reflective)</h4>
                        </div>
                        <p className="text-sm text-rose-800 mb-3 font-medium">
                            <strong>目標：直接回答你當初的研究問題。</strong><br />
                            <span className="text-rose-600">⭐ 鐵律：這層的內容和邏輯 只能由你親自完成。AI 只能幫你潤飾，因為只有你知道你最初想問什麼！</span>
                        </p>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="bg-white p-3 rounded border border-rose-100 shadow-sm">
                                <span className="text-rose-700 font-bold text-sm block mb-1">✅ 這樣寫才對：</span>
                                <ul className="text-sm text-slate-600 list-disc list-inside space-y-1">
                                    <li>明確宣告：「本研究原本想了解... 答案是...」</li>
                                    <li>釐清歸因界線：「只能說明有相關，無法確定是因果」</li>
                                </ul>
                            </div>
                            <div className="bg-white p-3 rounded border border-rose-100 shadow-sm">
                                <span className="text-rose-700 font-bold text-sm block mb-1">❌ 常見地雷：</span>
                                <ul className="text-sm text-slate-600 list-disc list-inside space-y-1">
                                    <li><strong>答非所問：</strong> 研究問題在問「動機」，結論卻一直在聊「結果」。</li>
                                    <li><strong>依賴 AI：</strong> 讓 AI 自己編造研究目的與邏輯。</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Layer 4: Critical */}
                    <div className="bg-slate-50 p-5 rounded-lg border-l-4 border-l-emerald-500 border border-slate-200">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="text-xl">🔍</span>
                            <h4 className="font-bold text-lg text-slate-800">層次四：批判 (Critical)</h4>
                        </div>
                        <p className="text-sm text-slate-700 mb-3">
                            <strong>目標：檢視自己這份結論的限制與可信度，展現研究者的嚴謹態度 (說出研究限制)。</strong>
                        </p>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="bg-emerald-50 p-3 rounded border border-emerald-100">
                                <span className="text-emerald-700 font-bold text-sm block mb-1">✅ 這樣寫才對：</span>
                                <ul className="text-sm text-slate-600 list-disc list-inside space-y-1">
                                    <li>主動承認樣本代表性不足（如：只發了高一部分班級）</li>
                                    <li>指出可能被遺漏的「干擾變項」（例：影響成績的其實是補習時間，不是吃早餐）</li>
                                    <li>指出這份研究無法回答的問題</li>
                                </ul>
                            </div>
                            <div className="bg-rose-50 p-3 rounded border border-rose-100">
                                <span className="text-rose-700 font-bold text-sm block mb-1">❌ 常見地雷：</span>
                                <ul className="text-sm text-slate-600 list-disc list-inside space-y-1">
                                    <li><strong>過度推論：</strong> 只調查了松山高中 50 人，就寫「現在的高中生都...」。</li>
                                    <li><strong>隱瞞瑕疵：</strong> 明知道問卷設計有瑕疵或回收數量太少，卻假裝沒事。</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content 2: Data Translation Games */}
            <div className="bg-amber-50 p-6 rounded-xl shadow-sm border border-amber-100 mt-8">
                <h3 className="text-xl font-bold mb-4 text-amber-900 flex items-center gap-2">
                    <span className="bg-amber-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">2</span>
                    實戰演練：客觀數據解讀與批判性思維培養
                </h3>
                <p className="mb-6 text-slate-700">
                    歡迎來到「行動代號：濾鏡」！在這裡，你將化身為數據偵探，運用你的批判性思維，從看似合理的分析報告中，找出隱藏的偏誤、錯誤詮釋或不當結論。每一份報告都可能藏著「假象」，你的任務就是揭露它們，還原數據的「真相」！
                </p>
                <div className="grid md:grid-cols-1 gap-6">
                    <div className="bg-white p-5 rounded-lg border border-slate-200 flex flex-col items-center text-center max-w-lg mx-auto w-full">
                        <div className="text-4xl mb-3">🕵️‍♂️</div>
                        <h4 className="font-bold text-slate-800 mb-2">行動代號：濾鏡</h4>
                        <p className="text-sm text-slate-600 mb-4 flex-1">有些研究的推論充滿「神邏輯」。你能找出報告中過度推論的地方嗎？</p>
                        <a href="/game/data-detective" className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-lg font-bold transition-colors w-full inline-block">進入任務：行動代號：濾鏡</a>
                    </div>
                </div>
            </div>
        </div>
    );
};
