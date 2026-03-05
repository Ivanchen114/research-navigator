import React, { useState } from 'react';
import { DocLinkBtn } from '../../components/analysis/DocLinkBtn';
import { PromptBox, AIInstructionDropdown } from '../../components/analysis/PromptBox';
import { ExperimentChart } from '../../components/analysis/ExperimentChart';
import { Bot, Scale, AlertTriangle, PenLine } from 'lucide-react';

export const ExperimentModule = () => {
    const [showChart, setShowChart] = useState(false);

    return (
        <div className="p-6 md:p-8 space-y-8 animate-in fade-in slide-in-from-right-4">

            {/* Header */}
            <header className="border-b border-slate-200 pb-4">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-4">
                            <h2 className="text-2xl font-bold text-slate-800">模組 3：實驗法數據 — 四層次寫作</h2>
                        </div>
                        <p className="text-slate-600 mt-2 text-sm">目標：除了證明獨變項的操作有效，更能產出包含研究限制的四層次結論。</p>
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

            {/* Step 2: First Round Analysis (W14) */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 border-l-4 border-l-blue-500 p-6">
                <div className="flex items-center gap-2 mb-2">
                    <Bot className="text-blue-600" />
                    <h3 className="text-lg font-bold text-slate-800">Step 2：AI 檢核與潤飾</h3>
                </div>
                <p className="text-sm text-slate-600 mb-4">把兩組的數據以及你的初稿丟給 AI，請它幫忙抓出未控制好的實驗變因。</p>

                <AIInstructionDropdown title="複製 Prompt：對齊學習單小卡 C">
                    <PromptBox>
                        {`我的研究主題是＿＿＿，研究問題是＿＿＿。
實驗組條件是＿＿＿，對照組條件是＿＿＿。

以下是我自己寫的四層結論初稿：【貼上初稿】

以下是實驗數據：【貼上數據】

請幫我：
1. 檢核描述層有無數字錯誤或遺漏，並建議修改。
2. 優化詮釋層，補充可能的原因解釋。
3. 回扣層我已經寫好內容和邏輯，請只幫我潤飾文句，不要改變意思。
4. 列出實驗研究常見的三種研究限制供我參考。
5. 根據以上修改建議，整合成一段完整的結論論述，回扣層請使用我原本寫的內容，不要自行改變邏輯。`}
                    </PromptBox>
                </AIInstructionDropdown>

                {/* Chart Placeholder */}
                <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-200 flex flex-col md:flex-row gap-6 items-center">
                    <div className="flex-1">
                        <h4 className="font-bold text-slate-800 text-sm mb-2">📊 【自學補充】成長幅度比較圖</h4>
                        <p className="text-xs text-slate-600 mb-3">視覺化是實驗法最有利的武器！試著比較實驗組與對照組的前後測差異。</p>
                        <button
                            onClick={() => setShowChart(!showChart)}
                            className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 shadow w-full transition"
                        >
                            {showChart ? '隱藏圖表' : '繪製折線圖範例'}
                        </button>
                    </div>
                    {showChart ? (
                        <div className="flex-1 w-full bg-white h-48 rounded shadow-sm border border-slate-200 flex items-center justify-center p-2 animate-in fade-in">
                            <ExperimentChart />
                        </div>
                    ) : (
                        <div className="flex-1 w-full bg-white h-48 rounded shadow-sm border border-slate-200 flex items-center justify-center text-slate-400 font-bold">
                            點擊左側按鈕顯示折線圖
                        </div>
                    )}
                </div>
            </div>

            {/* Step 3: Human Judgment (W14) */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 border-l-4 border-l-rose-500 p-6">
                <div className="flex items-center gap-2 mb-2">
                    <Scale className="text-rose-600" />
                    <h3 className="text-lg font-bold text-slate-800">Step 3：人工裁奪 (抓出干擾變因)</h3>
                </div>
                <p className="text-sm text-slate-600 mb-4">
                    AI 看到數字進步，就會說「實驗有效」。但做為研究者，你必須扮演<strong className="text-rose-600">魔鬼代言人</strong>進行嚴格審查：
                </p>

                <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-rose-50 p-4 rounded-xl border border-rose-100">
                        <h4 className="font-bold text-rose-800 mb-2 flex items-center gap-2">
                            <AlertTriangle size={18} /> 陷阱一：未被控制的變因
                        </h4>
                        <p className="text-sm text-slate-700 mb-2">
                            AI 說：「實驗組喝提神飲料後成績變好，證明飲料有效。」但你沒提到他們考試的時間不一樣？
                        </p>
                        <div className="bg-white p-2 rounded text-xs text-slate-600 border border-rose-200">
                            <strong>你的裁奪：</strong> 如果有變因沒有控制到（例如施測時間不同），就不能直接說是你的處理造成的。請在結論中補充未控制到的變因。
                        </div>
                    </div>
                    <div className="bg-rose-50 p-4 rounded-xl border border-rose-100">
                        <h4 className="font-bold text-rose-800 mb-2 flex items-center gap-2">
                            <AlertTriangle size={18} /> 陷阱二：霍桑效應 / 安慰劑
                        </h4>
                        <p className="text-sm text-slate-700 mb-2">
                            AI 認為結果極度完美，但受試者可能只是因為「知道自己在被實驗」而特別認真？
                        </p>
                        <div className="bg-white p-2 rounded text-xs text-slate-600 border border-rose-200">
                            <strong>你的裁奪：</strong> 不要宣稱「百分之百有用」，請寫：「數據顯示差異，但受限於＿＿，此結果為初步觀察，需謹慎解讀」。這比直接說有效更有學術誠信！
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
                    將兩組的差異數據、你自行撰寫的回扣內容、以及 AI 捕捉到的干擾變項，整合成完美的報告結論。
                </p>
                <div className="bg-emerald-50 p-5 rounded-lg border border-emerald-100 font-serif">
                    <p className="text-sm text-slate-700 leading-loose">
                        <strong className="text-emerald-700">【描述】與【詮釋】</strong><br />
                        根據實驗數據顯示，＿＿＿＿＿＿＿＿，其中最明顯的是實驗組的＿＿顯著高於對照組。這個結果顯示＿＿＿＿＿＿＿＿，可能的原因是受到了我們操弄＿＿帶來的影響。<br /><br />
                        <strong className="text-emerald-700">【回扣】(⭐確認內容是你自己的)</strong><br />
                        本研究原本想了解＿＿＿＿的影響。根據分析結果，本研究的答案是＿＿＿＿＿＿＿＿。但這個結論只能說明在特定條件下的差異，無法完全確定兩者之間具有無懈可擊的因果關係。<br /><br />
                        <strong className="text-emerald-700">【批判】(研究限制)</strong><br />
                        本研究的限制在於執行過程中受到＿＿＿＿的潛在影響（如霍桑效應或未完全控制的環境變因），因此結論不宜過度延伸推論。未來研究建議進一步排除＿＿變量以獲得更準確的結果。
                    </p>
                </div>
            </div>

        </div>
    );
};
