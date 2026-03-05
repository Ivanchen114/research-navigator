import React from 'react';
import { DocLinkBtn } from '../../components/analysis/DocLinkBtn';
import { PromptBox, AIInstructionDropdown } from '../../components/analysis/PromptBox';
import { Bot, Scale, AlertTriangle, PenLine } from 'lucide-react';

export const ObservationModule = () => {
    return (
        <div className="p-6 md:p-8 space-y-8 animate-in fade-in slide-in-from-right-4">

            {/* Header */}
            <header className="border-b border-slate-200 pb-4">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-4">
                            <h2 className="text-2xl font-bold text-slate-800">模組 4：觀察法記錄 — 四層次寫作</h2>
                        </div>
                        <p className="text-slate-600 mt-2 text-sm">目標：除了從行為中發現模式，也能產出包含田野脈絡觀點的四層次結論。</p>
                    </div>
                    <DocLinkBtn href="https://docs.google.com/document/d/1s_LLHFyh-GA8X0m1bAWssmVtVsC7xgaFaRWOS86APRk/edit?usp=drive_link">
                        完整指南
                    </DocLinkBtn>
                </div>
            </header >

            {/* Step 2: First Round Analysis (W14) */}
            < div className="bg-white rounded-xl shadow-sm border border-slate-100 border-l-4 border-l-blue-500 p-6" >
                <div className="flex items-center gap-2 mb-2">
                    <Bot className="text-blue-600" />
                    <h3 className="text-lg font-bold text-slate-800">Step 2：AI 檢核與潤飾</h3>
                </div>
                <p className="text-sm text-slate-600 mb-4">把你寫好的四層初稿，連同你的田野筆記或頻率統計餵給 AI 檢驗。</p>

                <AIInstructionDropdown title="複製 Prompt：對齊學習單小卡 D">
                    <PromptBox>
                        {`我的研究主題是＿＿＿，研究問題是＿＿＿。
觀察場景是＿＿＿（如：學校圖書館）。

以下是我自己寫的四層結論初稿：【貼上初稿】

以下是觀察紀錄（或頻率統計）：【貼上紀錄】

請幫我：
1. 檢核描述層有無主觀臆測，並建議如何改成客觀行為描述。
2. 優化詮釋層，補充可能被我忽略的環境脈絡因素。
3. 回扣層我已經寫好內容和邏輯，請只幫我潤飾文句，不要改變意思。
4. 列出參與式觀察研究常見的三種研究限制供我參考。
5. 根據以上修改建議，整合成一段完整的結論論述，回扣層請使用我原本寫的內容，不要自行改變邏輯。`}
                    </PromptBox>
                </AIInstructionDropdown>

                <div className="mt-4 bg-blue-50 text-sm text-blue-800 p-3 rounded border border-blue-100">
                    💡 <strong>自學補充 (資料型態)：</strong> 你的資料可能是「量」的（例如：舉手次數、滑手機次數統計表），也可能是「質」的（一段情境描述的筆記）。AI 均可協助處理。
                </div>
            </div >

            {/* Step 3: Human Judgment (W14) */}
            < div className="bg-white rounded-xl shadow-sm border border-slate-100 border-l-4 border-l-rose-500 p-6" >
                <div className="flex items-center gap-2 mb-2">
                    <Scale className="text-rose-600" />
                    <h3 className="text-lg font-bold text-slate-800">Step 3：人工裁奪 (找回情境脈絡)</h3>
                </div>
                <p className="text-sm text-slate-600 mb-4">
                    AI 只能看到文字，但<strong className="text-rose-600">只有你在現場</strong>！你必須確認 AI 找出的模式是否符合真實情境：
                </p>

                <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-rose-50 p-4 rounded-xl border border-rose-100">
                        <h4 className="font-bold text-rose-800 mb-2 flex items-center gap-2">
                            <AlertTriangle size={18} /> 陷阱一：忽略特殊時段
                        </h4>
                        <p className="text-sm text-slate-700 mb-2">
                            AI 說「圖書館根本沒人去借書」，但你觀察的那週剛好是畢業旅行？
                        </p>
                        <div className="bg-white p-2 rounded text-xs text-slate-600 border border-rose-200">
                            <strong>你的裁奪：</strong> 這是最關鍵的「脈絡因素 (Context)」。如果遇到特殊事件，必須在結論中加上「注意：觀察期間適逢＿＿，可能影響頻率，為本研究之限制」。
                        </div>
                    </div>
                    <div className="bg-rose-50 p-4 rounded-xl border border-rose-100">
                        <h4 className="font-bold text-rose-800 mb-2 flex items-center gap-2">
                            <AlertTriangle size={18} /> 陷阱二：觀察者效應
                        </h4>
                        <p className="text-sm text-slate-700 mb-2">
                            AI 覺得大家都很安靜守規矩。但會不會是因為你拿著記錄板站在那裡盯著他們看？
                        </p>
                        <div className="bg-white p-2 rounded text-xs text-slate-600 border border-rose-200">
                            <strong>你的裁奪：</strong> 在寫結論時要誠實！若當時受觀察者知道你的存在，可能產生行為改變，這點也必須被「批判」寫進限制中。
                        </div>
                    </div>
                </div>
            </div >

            {/* Step 4: Drafting (W14) */}
            < div className="bg-white rounded-xl shadow-sm border border-slate-100 border-l-4 border-l-emerald-500 p-6" >
                <div className="flex items-center gap-2 mb-2">
                    <PenLine className="text-emerald-600" />
                    <h3 className="text-lg font-bold text-slate-800">Step 4：最終四層結論定案</h3>
                </div>
                <p className="text-sm text-slate-600 mb-4">
                    將觀察頻率、情境與你的脈絡裁奪寫成最終結論（請記錄到文件裡，這就是你報告內容）。
                </p>
                <div className="bg-emerald-50 p-5 rounded-lg border border-emerald-100 font-serif">
                    <p className="text-sm text-slate-700 leading-loose">
                        <strong className="text-emerald-700">【描述】與【詮釋】</strong><br />
                        在共計＿＿次的實地觀察中，我們記錄到＿＿行為共出現＿＿次（或：我們觀察到最穩定的行為模式是...）。這個現象顯示＿＿＿＿＿＿＿＿，可能的原因是該場域特有的＿＿＿＿脈絡造成的。<br /><br />
                        <strong className="text-emerald-700">【回扣】(⭐確認內容是你自己的)</strong><br />
                        本研究原本想了解＿＿＿＿的真實狀況。綜合現場觀察，本研究的答案是＿＿＿＿＿＿＿＿。但這個結論只能說明在該特定場域與時間點的狀況，無法確定其他情境下是否相同。<br /><br />
                        <strong className="text-emerald-700">【批判】(研究限制)</strong><br />
                        本研究的限制在於觀察者現身可能引發「觀察者效應」（受試者改變原本行徑），且觀察期間適逢＿＿＿＿等特殊事件，因此現象可能無法常態推論。
                    </p>
                </div>
            </div >

        </div >
    );
};
