import React, { useState } from 'react';
import { DocLinkBtn } from '../../components/analysis/DocLinkBtn';
import { PromptBox, AIInstructionDropdown } from '../../components/analysis/PromptBox';
import { SurveyChart } from '../../components/analysis/SurveyChart';
import { Bot, BrainCircuit, PenLine, AlertTriangle, Scale } from 'lucide-react';

export const SurveyModule = () => {
    const [showChart, setShowChart] = useState(false);

    return (
        <div className="p-6 md:p-8 space-y-8 animate-in fade-in slide-in-from-right-4">

            {/* Header */}
            <header className="border-b border-slate-200 pb-4">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-4">
                            <h2 className="text-2xl font-bold text-slate-800">模組 1：量化問卷法 — 四層次寫作工作坊</h2>
                        </div>
                        <p className="text-slate-600 mt-2 text-sm">目標：不再只讓 AI 算數字，而是引導 AI 檢核你的初稿，陪你產出「描述 → 詮釋 → 回扣 → 批判」的嚴謹結論。</p>
                    </div>
                </div>
            </header>

            {/* Step 1: Data Cleaning */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                <h3 className="text-lg font-bold text-slate-800 mb-2">Step 1：把問卷餵給 AI 前的準備</h3>
                <p className="text-sm text-slate-600 mb-4">AI 很聰明，但如果餵給它垃圾，它也只能產出垃圾 (Garbage in, garbage out)。</p>
                <div className="bg-slate-50 p-4 rounded-lg mb-4">
                    <ul className="list-disc list-inside text-sm text-slate-600 space-y-2">
                        <li><strong>去除個資：</strong>把 Excel/CSV 中的姓名、Email 刪除或改成編號（R01, R02...）。</li>
                        <li><strong>簡化標題：</strong>把太長的題目改成簡短的變數名稱（例：「請問您平均每天花多少時間滑短影音？」 → 改成「Q1_短影音時數」）。</li>
                        <li><strong>刪除無效問卷：</strong>把沒填完的、全部選同一個選項的、亂填的（例如一天睡 25 小時）刪掉。</li>
                    </ul>
                </div>
            </div>

            {/* Step 2: First Round Analysis (W14) */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 border-l-4 border-l-blue-500 p-6">
                <div className="flex items-center gap-2 mb-2">
                    <Bot className="text-blue-600" />
                    <h3 className="text-lg font-bold text-slate-800">Step 2：AI 檢核與潤飾</h3>
                </div>
                <p className="text-sm text-slate-600 mb-4">把整理好的資料，加上你「自己先寫好的四層初稿」一起餵給 AI，請它找漏洞並提供建議。</p>

                <AIInstructionDropdown title="複製 Prompt：對齊學習單小卡 A">
                    <PromptBox>
                        {`我的研究主題是＿＿＿，研究問題是＿＿＿。

以下是我自己寫的四層結論初稿：【貼上初稿】

以下是問卷統計資料（已去除個資）：【貼上資料】

請幫我：
1. 檢核描述層有無數字錯誤或量詞不精準，並建議修改。
2. 優化詮釋層，補充可能遺漏的原因。
3. 回扣層我已經寫好內容和邏輯，請只幫我潤飾文句，不要改變意思。
4. 列出問卷研究常見的三種研究限制供我參考。
5. 根據以上修改建議，整合成一段完整的結論論述，回扣層請使用我原本寫的內容，不要自行改變邏輯。`}
                    </PromptBox>
                </AIInstructionDropdown>

                {/* Chart Placeholder (Retained for visual context) */}
                <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-200 flex flex-col md:flex-row gap-6 items-center">
                    <div className="flex-1">
                        <h4 className="font-bold text-slate-800 text-sm mb-2">📈 【自學補充】從圖表客觀看數據</h4>
                        <p className="text-xs text-slate-600 mb-3">若你已經能先畫出圖表，也可以試問自己：看到哪些最高、最低、轉折點？</p>
                        <button
                            onClick={() => setShowChart(!showChart)}
                            className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 shadow w-full transition"
                        >
                            {showChart ? '隱藏圖表' : '顯示長條圖範例'}
                        </button>
                    </div>
                    {showChart ? (
                        <div className="flex-1 w-full bg-white h-48 rounded shadow-sm border border-slate-200 flex items-center justify-center p-2 animate-in fade-in">
                            <SurveyChart />
                        </div>
                    ) : (
                        <div className="flex-1 w-full bg-white h-48 rounded border border-slate-200 border-dashed flex items-center justify-center text-slate-400 font-bold">
                            點擊左側按鈕顯示
                        </div>
                    )}
                </div>
            </div>

            {/* Step 3: Human Judgment (W14) */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 border-l-4 border-l-rose-500 p-6">
                <div className="flex items-center gap-2 mb-2">
                    <Scale className="text-rose-600" />
                    <h3 className="text-lg font-bold text-slate-800">Step 3：人工裁奪 (你的判斷時刻)</h3>
                </div>
                <p className="text-sm text-slate-600 mb-4">
                    AI 講得再好聽，你也<strong className="text-rose-600">不能照單全收</strong>！做為研究者，你必須對 AI 提出的相關性進行嚴格審查：
                </p>

                <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-rose-50 p-4 rounded-xl border border-rose-100">
                        <h4 className="font-bold text-rose-800 mb-2 flex items-center gap-2">
                            <AlertTriangle size={18} /> 陷阱一：相關不等於因果
                        </h4>
                        <p className="text-sm text-slate-700 mb-2">
                            AI 說：「有穿校服的人成績比較好，所以校服能提升智力」。這合理嗎？
                        </p>
                        <div className="bg-white p-2 rounded text-xs text-slate-600 border border-rose-200">
                            <strong>你的裁奪：</strong> 如果只是問卷調查，只能說兩者**「有正相關」**，不能說「因此導致」。
                        </div>
                    </div>
                    <div className="bg-rose-50 p-4 rounded-xl border border-rose-100">
                        <h4 className="font-bold text-rose-800 mb-2 flex items-center gap-2">
                            <AlertTriangle size={18} /> 陷阱二：忽略樣本限制
                        </h4>
                        <p className="text-sm text-slate-700 mb-2">
                            AI 說：「這清楚證明了現代高中生的習慣...」但你只發了 20 份給同班同學？
                        </p>
                        <div className="bg-white p-2 rounded text-xs text-slate-600 border border-rose-200">
                            <strong>你的裁奪：</strong> 由於樣本數有限且來源單一，必須在結論加上「**受限於樣本數，此結果僅供初步參考**」。
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
                    對照 AI 的建議與自己的初稿，做出最終裁奪，寫下完整的四層結論（這就是你 W15 要交的報告內容）。
                </p>
                <div className="bg-emerald-50 p-5 rounded-lg border border-emerald-100 font-serif">
                    <p className="text-sm text-slate-700 leading-loose">
                        <strong className="text-emerald-700">【描述】與【詮釋】</strong><br />
                        根據問卷統計結果顯示，＿＿＿＿＿＿＿＿，其中最明顯的是＿＿＿＿＿＿＿＿。這個結果顯示＿＿＿＿＿＿＿＿，可能的原因是＿＿＿＿＿＿＿＿。<br /><br />
                        <strong className="text-emerald-700">【回扣】(⭐確認內容是你自己的)</strong><br />
                        本研究原本想了解＿＿＿＿＿＿＿＿。根據分析結果，本研究的答案是＿＿＿＿＿＿＿＿。但這個結論只能說明＿＿＿＿＿＿＿＿，無法確定＿＿＿＿＿＿＿＿。<br /><br />
                        <strong className="text-emerald-700">【批判】(研究限制)</strong><br />
                        本研究的限制在於＿＿＿＿＿＿＿＿，因此結論不宜推論至＿＿＿＿＿＿＿＿。若要更完整回答這個問題，未來可以＿＿＿＿＿＿＿＿。
                    </p>
                </div>
            </div>
        </div>
    );
};
