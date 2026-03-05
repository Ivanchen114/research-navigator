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
                            <h2 className="text-2xl font-bold text-slate-800">模組 2：訪談法逐字稿 — 四層次寫作</h2>
                        </div>
                        <p className="text-slate-600 mt-2 text-sm">目標：從對話中提煉主題，加上你的初稿，讓 AI 協助檢核並產出堅實的結論。</p>
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
                    <h3 className="text-lg font-bold text-slate-800">Step 2：AI 檢核與潤飾</h3>
                </div>
                <p className="text-sm text-slate-600 mb-4">
                    將你的「四層結論初稿」與「受訪者的逐字稿（已取代稱）」餵給 AI：
                </p>

                <AIInstructionDropdown title="複製 Prompt：對齊學習單小卡 B">
                    <PromptBox>
                        {`我的研究主題是＿＿＿，研究問題是＿＿＿。

以下是我自己寫的四層結論初稿：【貼上初稿】

以下是受訪者逐字稿（姓名已改為代號）：【貼上逐字稿】

請幫我：
1. 檢核描述層有無過度詮釋或遺漏重要現象，並建議修改。
2. 優化詮釋層，補充可能遺漏的意義。
3. 回扣層我已經寫好內容和邏輯，請只幫我潤飾文句，不要改變意思。
4. 列出質性訪談研究常見的三種研究限制供我參考。
5. 根據以上修改建議，整合成一段完整的結論論述，回扣層請使用我原本寫的內容，不要自行改變邏輯。`}
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
                    <h3 className="text-lg font-bold text-slate-800">Step 4：最終四層結論定案</h3>
                </div>
                <p className="text-sm text-slate-600 mb-4">
                    質性研究的結論必須「圖文並茂」（有歸納也有原汁原味的引述）。請對照 AI 建議與你的初稿寫下最終版本：
                </p>
                <div className="bg-emerald-50 p-5 rounded-lg border border-emerald-100 font-serif">
                    <p className="text-sm text-slate-700 leading-loose">
                        <strong className="text-emerald-700">【描述】與【詮釋】</strong><br />
                        根據訪談結果顯示，＿＿＿＿＿＿＿＿，其中最明顯的是大部分受訪者皆提及「...」（放入一到兩句精彩引言）。這個結果顯示＿＿＿＿＿＿＿＿，可能的原因是＿＿＿＿＿＿＿＿。<br /><br />
                        <strong className="text-emerald-700">【回扣】(⭐確認內容是你自己的)</strong><br />
                        本研究原本想了解＿＿＿＿＿＿＿＿。綜合訪談分析，本研究的答案是＿＿＿＿＿＿＿＿。但這個結論只能說明＿＿＿＿＿＿＿＿，無法確定＿＿＿＿＿＿＿＿。<br /><br />
                        <strong className="text-emerald-700">【批判】(研究限制)</strong><br />
                        本研究的限制在於訪談樣本僅基於特定＿＿＿＿，因此結論不宜推論至全體。若要更完整回答這個問題，未來可以加入問卷量化調查或增加其他領域受訪者。
                    </p>
                </div>
            </div>

        </div>
    );
};
