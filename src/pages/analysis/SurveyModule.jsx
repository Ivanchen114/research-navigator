import React, { useState } from 'react';
import { DocLinkBtn } from '../../components/analysis/DocLinkBtn';
import { PromptBox, AIInstructionDropdown } from '../../components/analysis/PromptBox';
import { SurveyChart } from '../../components/analysis/SurveyChart';

export const SurveyModule = () => {
    const [showChart, setShowChart] = useState(false);

    return (
        <div className="p-6 md:p-8 space-y-8 animate-in fade-in slide-in-from-right-4">

            {/* Header */}
            <header className="border-b border-slate-200 pb-4">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-4">
                            <h2 className="text-2xl font-bold text-slate-800">模組 1：問卷法數據分析</h2>
                        </div>
                        <p className="text-slate-600 mt-2 text-sm">目標：從數字中找出趨勢 (Patterns) 與 差異 (Differences)。</p>
                    </div>
                    <DocLinkBtn href="https://docs.google.com/document/d/1YKAnS69vvyTPLUcXj-oY0Hx7F7-CqMJWFdAuN0D3A8o/edit?usp=drive_link">
                        完整指南
                    </DocLinkBtn>
                </div>
            </header>

            {/* Step 1 */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                <h3 className="text-lg font-bold text-slate-800 mb-2">Step 1：數據清理 (Data Cleaning)</h3>
                <p className="text-sm text-slate-600 mb-4">在分析前，必須將數據整理成 AI 看得懂的格式。</p>
                <ul className="list-disc list-inside text-sm text-slate-600 mb-4 space-y-1 bg-slate-50 p-4 rounded-lg">
                    <li><strong>匿名化：</strong>將姓名改為編號（R01, R02...）。</li>
                    <li><strong>簡化標題：</strong>將冗長的題目改為代號（如「Q1_睡眠時間」）。</li>
                    <li><strong>檢查異常：</strong>刪除亂填的問卷（如全部填一樣的選項）。</li>
                </ul>

                <AIInstructionDropdown title="數據檢查">
                    <PromptBox>
                        {`【角色】你是一位專業的數據分析師。
【任務】請檢查我上傳的問卷數據 CSV 檔。
1. 告訴我有效樣本數是多少？
2. 檢查是否有異常值（例如：每天睡眠 25 小時）或明顯的填答錯誤。
3. 根據欄位名稱，歸納出這份問卷主要包含哪些變項。`}
                    </PromptBox>
                </AIInstructionDropdown>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 border-l-4 border-l-blue-500 p-6">
                <h3 className="text-lg font-bold text-slate-800 mb-2">Step 3：交叉分析 (Cross-Tabulation) 🔥 重點</h3>
                <p className="text-sm text-slate-600 mb-4">這是研究最精彩的部分！探討「不同背景」的人是否有「不同想法」。</p>

                <AIInstructionDropdown title="分組比較">
                    <PromptBox>
                        {`【研究問題】我想探討「年級」是否會影響「社團參與意願」。
【變項】自變項：年級；依變項：社團參與意願（Q5）。
【任務】
1. 請進行交叉分析，比較高一與高二在 Q5 的平均數差異。
2. 判斷這個差異是否顯著（或差異幅度大嗎？）
3. 請幫我生成一個適合的圖表建議，並告訴我 X 軸與 Y 軸應設定為什麼。`}
                    </PromptBox>
                </AIInstructionDropdown>

                {/* Chart Placeholder */}
                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100 flex flex-col md:flex-row gap-6 items-center">
                    <div className="flex-1">
                        <h4 className="font-bold text-blue-900 text-sm mb-2">📈 模擬分析結果</h4>
                        <p className="text-xs text-blue-800 mb-3">假設問題：「年級」vs「社團投入時數」。</p>
                        <button
                            onClick={() => setShowChart(!showChart)}
                            className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 shadow w-full transition"
                        >
                            {showChart ? '隱藏圖表' : '執行模擬圖表'}
                        </button>
                    </div>
                    {showChart ? (
                        <div className="flex-1 w-full bg-white h-48 rounded shadow-sm border border-blue-100 flex items-center justify-center p-2 animate-in fade-in">
                            <SurveyChart />
                        </div>
                    ) : (
                        <div className="flex-1 w-full bg-white h-48 rounded shadow-sm border border-blue-100 flex items-center justify-center text-blue-400 font-bold">
                            點擊左側按鈕顯示長條圖
                        </div>
                    )}
                </div>
            </div>

            {/* Step 4 */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                <h3 className="text-lg font-bold text-slate-800 mb-2">Step 4：開放式問題分析</h3>
                <p className="text-sm text-slate-600 mb-4">針對問卷最後「還有什麼想說的？」這類文字題。</p>
                <AIInstructionDropdown title="質性分類">
                    <PromptBox>
                        {`【任務】針對問卷中的開放式問題：「你認為學校午餐需要改進的地方？」，請進行主題分析。
1. 閱讀所有回覆，歸納出 3-5 個主要提到的問題點（Themes）。
2. 統計每個主題被提及的次數。
3. 為每個主題挑選 1 句最具代表性的學生原話（Quote）。`}
                    </PromptBox>
                </AIInstructionDropdown>
            </div>

        </div>
    );
};
