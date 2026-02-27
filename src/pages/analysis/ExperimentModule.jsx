import React, { useState } from 'react';
import { DocLinkBtn } from '../../components/analysis/DocLinkBtn';
import { PromptBox, AIInstructionDropdown } from '../../components/analysis/PromptBox';
import { ExperimentChart } from '../../components/analysis/ExperimentChart';

export const ExperimentModule = () => {
    const [showChart, setShowChart] = useState(false);

    return (
        <div className="p-6 md:p-8 space-y-8 animate-in fade-in slide-in-from-right-4">

            {/* Header */}
            <header className="border-b border-slate-200 pb-4">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-4">
                            <h2 className="text-2xl font-bold text-slate-800">模組 3：實驗法數據分析</h2>
                        </div>
                        <p className="text-slate-600 mt-2 text-sm">目標：證明「獨變項 (X)」的操弄，確實導致了「依變項 (Y)」的改變。</p>
                    </div>
                    <DocLinkBtn href="https://docs.google.com/document/d/1RMvSA-ee7DUVFpxrOh6FhqocE0Q2QNgcQA_PO8fik2c/edit?usp=drive_link">
                        完整指南
                    </DocLinkBtn>
                </div>
            </header>

            {/* Step 1 */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                <h3 className="text-lg font-bold text-slate-800 mb-2">Step 1：實驗設計檢核</h3>
                <p className="text-sm text-slate-600 mb-4">在跑統計前，先確認邏輯漏洞。</p>

                <AIInstructionDropdown title="設計檢核">
                    <PromptBox>
                        {`【我的實驗設計】
- 研究目的：測試「聽古典音樂」是否能提升「數學計算速度」。
- 實驗組：15人，邊聽莫札特邊寫考卷。
- 控制組：15人，安靜環境寫考卷。
- 測量：兩組皆進行前測與後測。

【任務】
1. 請檢視這個設計，有哪些可能的「干擾變項」我沒考慮到？（例如：受試者原本的數學程度？）
2. 這個設計屬於「真實驗」還是「準實驗」？這對我的結論有什麼限制？`}
                    </PromptBox>
                </AIInstructionDropdown>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 border-l-4 border-l-purple-500 p-6">
                <h3 className="text-lg font-bold text-slate-800 mb-2">Step 3：因果推論 (Causal Inference)</h3>
                <p className="text-sm text-slate-600 mb-4">最重要的一步：確認真的是因為實驗處理才進步的嗎？</p>

                <AIInstructionDropdown title="推論與圖表">
                    <PromptBox>
                        {`【分析結果】實驗組平均 85 分，控制組平均 75 分。
【任務】
1. 請建議我如何用圖表呈現這個結果？（例如：長條圖比較兩組差異）。
2. 請幫我扮演「魔鬼代言人」：除了「聽音樂有效」之外，還有什麼原因可能導致實驗組考比較好？（例如：霍桑效應/安慰劑效應？）。
3. 請幫我修正結論的語氣，避免過度武斷。`}
                    </PromptBox>
                </AIInstructionDropdown>

                {/* Chart Placeholder */}
                <div className="mt-6 p-4 bg-purple-50 rounded-lg border border-purple-100 flex flex-col md:flex-row gap-6 items-center">
                    <div className="flex-1">
                        <h4 className="font-bold text-purple-900 text-sm mb-2">📊 成長幅度比較圖</h4>
                        <p className="text-xs text-purple-800 mb-3">比較實驗組與控制組的前後測差異。</p>
                        <button
                            onClick={() => setShowChart(!showChart)}
                            className="bg-purple-600 text-white px-4 py-2 rounded text-sm hover:bg-purple-700 shadow w-full transition"
                        >
                            {showChart ? '隱藏圖表' : '繪製圖表'}
                        </button>
                    </div>
                    {showChart ? (
                        <div className="flex-1 w-full bg-white h-48 rounded shadow-sm border border-purple-100 flex items-center justify-center p-2 animate-in fade-in">
                            <ExperimentChart />
                        </div>
                    ) : (
                        <div className="flex-1 w-full bg-white h-48 rounded shadow-sm border border-purple-100 flex items-center justify-center text-purple-400 font-bold">
                            點擊左側按鈕顯示折線圖
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
};
