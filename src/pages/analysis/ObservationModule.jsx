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
                            <h2 className="text-2xl font-bold text-slate-800">模組 4：觀察法記錄分析</h2>
                        </div>
                        <p className="text-slate-600 mt-2 text-sm">目標：從行為中發現模式 (Patterns)。</p>
                    </div>
                    <DocLinkBtn href="https://docs.google.com/document/d/1s_LLHFyh-GA8X0m1bAWssmVtVsC7xgaFaRWOS86APRk/edit?usp=drive_link">
                        完整指南
                    </DocLinkBtn>
                </div>
            </header>

            {/* Step 2: First Round Analysis (W14) */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 border-l-4 border-l-blue-500 p-6">
                <div className="flex items-center gap-2 mb-2">
                    <Bot className="text-blue-600" />
                    <h3 className="text-lg font-bold text-slate-800">Step 2：第一輪分析 (AI 找行為模式)</h3>
                </div>
                <p className="text-sm text-slate-600 mb-4">把你的田野筆記或頻率統計餵給 AI，請它幫你在混亂的記錄中找出「規律」與「例外」。</p>

                <AIInstructionDropdown title="複製 Prompt：田野觀察解析">
                    <PromptBox>
                        {`【任務】我做了觀察研究，主題是「＿＿＿」，
觀察場景是「＿＿＿（如：學校圖書館、午休的教室等）」。

以下是我的觀察記錄（可以是整理過的頻率統計，或是逐日田野筆記）：
【在此貼上觀察記錄】

請幫我：
1. 找出觀察資料中最穩定出現的 3 個「行為模式」。
2. 找出任何「例外」或「不規律」的現象。
3. 提出 2-3 個可能解釋這些模式背後隱含的原因或心理需求？`}
                    </PromptBox>
                </AIInstructionDropdown>

                <div className="mt-4 bg-blue-50 text-sm text-blue-800 p-3 rounded border border-blue-100">
                    💡 <strong>自學補充 (資料型態)：</strong> 你的資料可能是「量」的（例如：舉手次數、滑手機次數統計表），也可能是「質」的（一段情境描述的筆記）。AI 均可協助處理。
                </div>
            </div>

            {/* Step 3: Human Judgment (W14) */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 border-l-4 border-l-rose-500 p-6">
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
            </div>

            {/* Step 4: Drafting (W14) */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 border-l-4 border-l-emerald-500 p-6">
                <div className="flex items-center gap-2 mb-2">
                    <PenLine className="text-emerald-600" />
                    <h3 className="text-lg font-bold text-slate-800">Step 4：黃金寫作草稿</h3>
                </div>
                <p className="text-sm text-slate-600 mb-4">
                    將觀察頻率、情境與你的脈絡裁奪寫成結論初稿（請將這段記錄到文件裡，這就是你 W15 要交的報告內容）。
                </p>
                <div className="bg-emerald-50 p-5 rounded-lg border border-emerald-100 font-serif">
                    <p className="text-sm text-slate-700 leading-loose">
                        <strong className="text-emerald-700">【數據/資料描述 (客觀)】</strong><br />
                        在共計＿＿次的實地觀察中，我們記錄到＿＿行為共出現＿＿次。其中頻率最高的時段/情境為＿＿＿＿。值得注意的是，我們也觀察到一個例外現象：＿＿＿＿＿。
                        <br /><br />
                        <strong className="text-emerald-700">【分析推論 (主觀但有依據)】</strong><br />
                        此一穩定的行為模式，可能與環境中的＿＿＿＿因素有關。然而，由於觀察期間適逢＿＿＿＿（脈絡因素或觀察者干擾），可能導致特定行為頻率的暫時改變，未來若要進一步確認，建議延長觀察期或採用隱蔽式觀察。
                    </p>
                </div>
            </div>

        </div>
    );
};
