import React, { useState } from 'react';
import { DocLinkBtn } from '../../components/analysis/DocLinkBtn';
import { PromptBox, AIInstructionDropdown } from '../../components/analysis/PromptBox';
import { Bot, Scale, AlertTriangle, PenLine } from 'lucide-react';

export const InterviewModule = () => {
    const [isHighlighted, setIsHighlighted] = useState(false);

    return (
        <div className="p-6 md:p-8 space-y-8 animate-in fade-in slide-in-from-right-4">

            {/* Header */}
            <header className="border-b border-slate-200 pb-4">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-4">
                            <h2 className="text-2xl font-bold text-slate-800">模組 2：訪談法逐字稿分析</h2>
                        </div>
                        <p className="text-slate-600 mt-2 text-sm">目標：從對話中提煉出主題 (Themes) 與架構 (Framework)。</p>
                    </div>
                    <DocLinkBtn href="https://docs.google.com/document/d/13NFmhIYg96BKhc871oTlnAS2r812O-hdbBl-LYNcEog/edit?usp=drive_link">
                        完整指南
                    </DocLinkBtn>
                </div>
            </header>

            {/* Concept */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                <h3 className="text-lg font-bold text-slate-800 mb-4">核心概念：編碼 (Coding)</h3>
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div className="bg-slate-50 p-3 rounded border">
                        <strong className="text-blue-700">1. 開放編碼</strong>
                        <p className="text-slate-500 mt-1">把受訪者的一段話貼上標籤（如：「壓力大」）。</p>
                    </div>
                    <div className="bg-slate-50 p-3 rounded border">
                        <strong className="text-emerald-700">2. 主軸編碼</strong>
                        <p className="text-slate-500 mt-1">把相似的標籤歸類成大類別（如：「壓力大」+「想逃避」→「負面情緒調適」）。</p>
                    </div>
                    <div className="bg-slate-50 p-3 rounded border">
                        <strong className="text-purple-700">3. 選擇編碼</strong>
                        <p className="text-slate-500 mt-1">找出最核心的故事線。</p>
                    </div>
                </div>
            </div>

            {/* Step 2: First Round Analysis (W14) */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 border-l-4 border-l-blue-500 p-6">
                <div className="flex items-center gap-2 mb-2">
                    <Bot className="text-blue-600" />
                    <h3 className="text-lg font-bold text-slate-800">Step 2：第一輪分析 (AI 主題編碼)</h3>
                </div>
                <p className="text-sm text-slate-600 mb-4">
                    這是質性研究的核心：從長篇連篇的逐字稿中萃取「關鍵概念」。請將**單一受訪者**的逐字稿餵給 AI：
                </p>

                <AIInstructionDropdown title="複製 Prompt：受訪者獨立編碼">
                    <PromptBox>
                        {`【任務】我做了訪談研究，主題是「＿＿＿」。
以下是其中一位受訪者的部分逐字稿：

【在此貼上該位受訪者的逐字稿】

請幫我：
1. 為這段逐字稿做「主題編碼」：找出 3-5 個重複出現的核心主題。
2. 從原文中找出每個主題的「代表句子」（必須完全直接引用原話）。
3. 標注這位受訪者是否有任何「反常或獨特」的觀點？
4. 用 1-2 句話精準總結這位受訪者的整體立場。`}
                    </PromptBox>
                </AIInstructionDropdown>

                {/* Simulation block retained for visual learning */}
                <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <h4 className="font-bold text-slate-800 text-sm mb-2">📝 【自學補充】編碼概念模擬</h4>
                    <p className="text-xs text-slate-600 mb-3">點擊按鈕，看看人腦如何從逐字稿中提取概念標籤（開放編碼）。</p>

                    <div className="bg-white p-4 rounded text-sm italic mb-3 leading-relaxed border-l-2 border-slate-300">
                        {isHighlighted ? (
                            <>
                                「每次段考後看到校排，我就覺得<span className="bg-red-200 px-1 rounded mx-1 font-semibold text-red-900">很想吐</span>。雖然爸媽沒說什麼，但<span className="bg-blue-200 px-1 rounded mx-1 font-semibold text-blue-900">看著同學都在補習</span>，我就覺得自己是不是不夠努力？這種感覺真的很<span className="bg-red-200 px-1 rounded mx-1 font-semibold text-red-900">窒息</span>。」
                            </>
                        ) : (
                            <>
                                「每次段考後看到校排，我就覺得很想吐。雖然爸媽沒說什麼，但看著同學都在補習，我就覺得自己是不是不夠努力？這種感覺真的很窒息。」
                            </>
                        )}
                    </div>

                    <button
                        onClick={() => setIsHighlighted(!isHighlighted)}
                        className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700 shadow transition-colors"
                    >
                        {isHighlighted ? '隱藏編碼標記' : '顯示編碼標記'}
                    </button>

                    {isHighlighted && (
                        <div className="mt-3 flex gap-4 text-xs animate-in fade-in">
                            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-400"></span> 生理反應</span>
                            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-400"></span> 同儕壓力</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Step 3: Human Judgment (W14) */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 border-l-4 border-l-rose-500 p-6">
                <div className="flex items-center gap-2 mb-2">
                    <Scale className="text-rose-600" />
                    <h3 className="text-lg font-bold text-slate-800">Step 3：人工裁奪 (找回脈絡)</h3>
                </div>
                <p className="text-sm text-slate-600 mb-4">
                    AI 很容易「超譯」受訪者的話。當所有受訪者都被 AI 跑過一輪後，你必須擔任最高審查員：
                </p>

                <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-rose-50 p-4 rounded-xl border border-rose-100">
                        <h4 className="font-bold text-rose-800 mb-2 flex items-center gap-2">
                            <AlertTriangle size={18} /> 陷阱一：AI 過度詮釋
                        </h4>
                        <p className="text-sm text-slate-700 mb-2">
                            AI 說受訪者表現出「對體制的深刻絕望」，但原話只是「我覺得學校便當很難吃」。
                        </p>
                        <div className="bg-white p-2 rounded text-xs text-slate-600 border border-rose-200">
                            <strong>你的裁奪：</strong> 必須嚴格對照「原文」！如果 AI 歸納的主題名稱太誇張，請手動下修，讓主題貼合受訪者真正的意思。
                        </div>
                    </div>
                    <div className="bg-rose-50 p-4 rounded-xl border border-rose-100">
                        <h4 className="font-bold text-rose-800 mb-2 flex items-center gap-2">
                            <AlertTriangle size={18} /> 陷阱二：錯把個案當全貌
                        </h4>
                        <p className="text-sm text-slate-700 mb-2">
                            AI 覺得某個觀點超級有趣，你就把它寫成大家都有的通病。
                        </p>
                        <div className="bg-white p-2 rounded text-xs text-slate-600 border border-rose-200">
                            <strong>你的裁奪：</strong> 把 5 位受訪者的主題排開。**多人提到的才是核心發現**，只有 1 人提到的是「特殊個案」，必須在結論中區隔開來！
                        </div>
                    </div>
                </div>
            </div>

            {/* Step 4: Drafting (W14) */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 border-l-4 border-l-emerald-500 p-6">
                <div className="flex items-center gap-2 mb-2">
                    <PenLine className="text-emerald-600" />
                    <h3 className="text-lg font-bold text-slate-800">Step 4：黃金寫作草稿</h3>
                </div>
                <p className="text-sm text-slate-600 mb-4">
                    質性研究的結論必須「圖文並茂」，也就是要有你的歸納，也要有受訪者原汁原味的引號。你可以這樣寫下初稿：
                </p>
                <div className="bg-emerald-50 p-5 rounded-lg border border-emerald-100 font-serif">
                    <p className="text-sm text-slate-700 leading-loose">
                        <strong className="text-emerald-700">【數據/資料描述 (客觀)】</strong><br />
                        在本次訪談的 {`{5}`} 位受訪者中，有 {`{4}`} 位皆提及「＿＿＿＿主題」經驗。例如，受訪者 A 表示：「＿＿＿（完全引述原話）＿＿＿」；受訪者 B 亦指出：「＿＿＿」。
                        <br /><br />
                        <strong className="text-emerald-700">【分析推論 (主觀但有依據)】</strong><br />
                        綜合上述意見，此現象可能代表＿＿＿＿＿＿。相對地，受訪者 C 則提出了截然不同的視角，他認為「＿＿＿」，這顯示出在＿＿＿＿（某種群體或情境）下，可能存在不同的考量脈絡。
                    </p>
                </div>
            </div>

        </div>
    );
};
