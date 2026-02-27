import React, { useState } from 'react';
import { DocLinkBtn } from '../../components/analysis/DocLinkBtn';
import { PromptBox, AIInstructionDropdown } from '../../components/analysis/PromptBox';

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

            {/* Step 2 & Simulation */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 border-l-4 border-l-orange-500 p-6">
                <h3 className="text-lg font-bold text-slate-800 mb-2">Step 3：主題分析 (Thematic Analysis) 🔥</h3>
                <p className="text-sm text-slate-600 mb-4">這是質性研究的核心，找出關鍵概念。</p>

                <AIInstructionDropdown title="主題歸納">
                    <PromptBox>
                        {`【任務】請對這份訪談稿進行「主題分析」。
1. 找出文本中反覆出現的關鍵概念，歸納出 3-5 個核心主題 (Themes)。
2. 針對每個主題，請提供：
   - 主題名稱（精準且吸睛，例如：「無所不在的焦慮」）
   - 主題定義（這個主題在說什麼？）
   - **證據引用 (Quotes)**：請直接從文本中摘錄 2 句受訪者的原話來證明。`}
                    </PromptBox>
                </AIInstructionDropdown>

                {/* Simulation */}
                <div className="mt-6 p-4 bg-orange-50 rounded-lg border border-orange-100">
                    <h4 className="font-bold text-orange-900 text-sm mb-2">📝 編碼模擬</h4>
                    <p className="text-xs text-orange-800 mb-3">點擊按鈕，看看如何從逐字稿中提取主題。</p>

                    <div className="bg-white p-4 rounded text-sm italic mb-3 leading-relaxed border-l-2 border-orange-200">
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
                        className="bg-orange-600 text-white px-3 py-1 rounded text-xs hover:bg-orange-700 shadow transition-colors"
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

        </div>
    );
};
