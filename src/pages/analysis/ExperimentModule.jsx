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

            {/* Step 2: First Round Analysis (W14) */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 border-l-4 border-l-blue-500 p-6">
                <div className="flex items-center gap-2 mb-2">
                    <Bot className="text-blue-600" />
                    <h3 className="text-lg font-bold text-slate-800">Step 2：第一輪分析 (AI 比較差異)</h3>
                </div>
                <p className="text-sm text-slate-600 mb-4">把兩組的數據餵給 AI，請它發揮運算優勢，快速比較差異並提出可能的原因假設。</p>

                <AIInstructionDropdown title="複製 Prompt：對照組數據解析">
                    <PromptBox>
                        {`【任務】我做了實驗研究，主題是「＿＿＿」。
- 實驗組條件：【在此說明】
- 對照組條件：【在此說明】

以下是我的實驗數據（如：兩組的平均、標準差或原始統計）：
【在此貼上數據表】

請幫我：
1. 比較實驗組和對照組的數據差異。
2. 判斷這個差異是否「顯著」（從描述上的差距來推論）。
3. 提出 3 個可能的原因，解釋為什麼有（或沒有）這樣的差異？`}
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
                    <h3 className="text-lg font-bold text-slate-800">Step 4：黃金寫作草稿</h3>
                </div>
                <p className="text-sm text-slate-600 mb-4">
                    將兩組的比較數據與你的裁奪結合，寫出嚴謹的實驗結論初稿（請將這段記錄到文件裡，這就是你 W15 要交的報告內容）。
                </p>
                <div className="bg-emerald-50 p-5 rounded-lg border border-emerald-100 font-serif">
                    <p className="text-sm text-slate-700 leading-loose">
                        <strong className="text-emerald-700">【數據/資料描述 (客觀)】</strong><br />
                        本研究探討「＿＿＿＿」的影響。實驗結果顯示，實驗組在＿＿測試上的平均分數為＿＿分，而對照組為＿＿分；兩者相差＿＿分。
                        <br /><br />
                        <strong className="text-emerald-700">【分析推論 (主觀但有依據)】</strong><br />
                        此結果顯示出＿＿操弄可能對＿＿產生正向影響。然而，由於本實驗在執行過程中，受到＿＿＿＿（列出未控制好的變因或環境限制）的影響，因此我們對此結果持保留態度，建議未來研究能進一步控制上述變項。
                    </p>
                </div>
            </div>

        </div>
    );
};
