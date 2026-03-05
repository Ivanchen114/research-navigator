import React from 'react';
import { DocLinkBtn } from '../../components/analysis/DocLinkBtn';
import { PromptBox, AIInstructionDropdown } from '../../components/analysis/PromptBox';
import { Bot, Scale, AlertTriangle, PenLine } from 'lucide-react';

export const LiteratureModule = () => {
    return (
        <div className="p-6 md:p-8 space-y-8 animate-in fade-in slide-in-from-right-4">

            {/* Header */}
            <header className="border-b border-slate-200 pb-4">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-4">
                            <h2 className="text-2xl font-bold text-slate-800">模組 5：文獻分析 — 四層次寫作</h2>
                        </div>
                        <p className="text-slate-600 mt-2 text-sm">目標：綜合 (Synthesize) 觀點並確認你提出的「研究缺口」具有說服力。</p>
                    </div>
                    <DocLinkBtn href="https://docs.google.com/document/d/1NCc62n2kU5xRIM6uRTMU4howa4SnLlcG46iJ6cNJi-Q/edit?usp=drive_link">
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
                <p className="text-sm text-slate-600 mb-4">把多篇文獻摘要和你試圖找出的「研究缺口（初稿）」餵給 AI，請它幫你檢驗邏輯推求是否合理。</p>

                <AIInstructionDropdown title="複製 Prompt：對齊學習單小卡 E">
                    <PromptBox>
                        {`我的研究主題是＿＿＿，研究問題是＿＿＿。

以下是我自己寫的第二章文獻回顧小結初稿：【貼上初稿】

以下是我參考的主要文獻摘要：
[文獻 A]：...
[文獻 B]：...

請幫我：
1. 檢核描述層與詮釋層，確認我歸納的「學界共識與分歧」是否客觀準確。
2. 回扣層我已經寫出「過往研究沒做到的缺口，就是我這篇研究要做的」，請只潤飾文句並檢查邏輯是否順暢，不要改變我主張的缺口。
3. 列出文獻回顧常見的三種限制（如搜查範圍、語言限制等）供我參考。
4. 根據以上修改建議，整合成一段完整的結論論述，回扣層請使用我原本寫的內容。`}
                    </PromptBox>
                </AIInstructionDropdown>
            </div >

            {/* Self-Learning: Synthesis Matrix */}
            < div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6" >
                <h3 className="text-lg font-bold text-slate-800 mb-2">📝 【自學補充】綜合矩陣 (Synthesis Matrix)</h3>
                <p className="text-sm text-slate-600 mb-4">如果你的文獻很多，可以請 AI 先幫你畫出這個表格，這是文獻探討的靈魂！</p>

                <AIInstructionDropdown title="比較矩陣">
                    <PromptBox>
                        {`【資料】我蒐集了三篇關於「手機成癮」的文章摘要（A, B, C）。
- 文章 A 認為主因是「社交焦慮」。
- 文章 B 認為主因是「遊戲機制」。
- 文章 C 認為是「家庭疏離」。

【任務】
1. 請幫我製作一個比較表格 (Matrix)。
2. 比較這三篇文章在「成癮原因」、「建議解方」的異同。
3. 找出他們的共識與分歧點。`}
                    </PromptBox>
                </AIInstructionDropdown>

                {/* Matrix Table */}
                <div className="mt-6 overflow-x-auto shadow-sm border border-slate-200 rounded-lg">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-indigo-50 text-indigo-900">
                            <tr>
                                <th className="p-3 border-b border-indigo-100">面向</th>
                                <th className="p-3 border-b border-indigo-100 border-l">文獻 A (心理學)</th>
                                <th className="p-3 border-b border-indigo-100 border-l">文獻 B (社會學)</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white">
                            <tr className="border-b border-slate-100">
                                <td className="p-3 font-bold bg-slate-50 border-r border-slate-100 w-24">成因</td>
                                <td className="p-3">個人焦慮</td>
                                <td className="p-3 border-l border-slate-100">同儕連結需求</td>
                            </tr>
                            <tr>
                                <td className="p-3 font-bold bg-slate-50 border-r border-slate-100 w-24">解方</td>
                                <td className="p-3 text-red-600 font-medium">心理諮商 (個人)</td>
                                <td className="p-3 text-blue-600 font-medium border-l border-slate-100">建立真實社群 (環境)</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <p className="text-xs text-center text-slate-500 mt-3">👆 綜合矩陣範例：清楚看出不同學科的觀點差異。</p>
            </div >

            {/* Step 3: Human Judgment (W14) */}
            < div className="bg-white rounded-xl shadow-sm border border-slate-100 border-l-4 border-l-rose-500 p-6" >
                <div className="flex items-center gap-2 mb-2">
                    <Scale className="text-rose-600" />
                    <h3 className="text-lg font-bold text-slate-800">Step 3：人工裁奪 (對焦你的研究)</h3>
                </div>
                <p className="text-sm text-slate-600 mb-4">
                    AI 找出的「缺口」可能非常空泛（例如說需要更多研究）。你必須把它<strong className="text-rose-600">拉回你自己的研究題目</strong>：
                </p>

                <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-rose-50 p-4 rounded-xl border border-rose-100">
                        <h4 className="font-bold text-rose-800 mb-2 flex items-center gap-2">
                            <AlertTriangle size={18} /> 陷阱一：假共識
                        </h4>
                        <p className="text-sm text-slate-700 mb-2">
                            AI 說這三篇都同意手機會讓人變笨。但其實其中一篇說的是「短期記憶下降」，另一篇是「注意力不集中」。
                        </p>
                        <div className="bg-white p-2 rounded text-xs text-slate-600 border border-rose-200">
                            <strong>你的裁奪：</strong> 必須自己回去看那幾篇文獻，確認他們指稱的概念是否真的相同。在寫作時要把概念定義清楚。
                        </div>
                    </div>
                    <div className="bg-rose-50 p-4 rounded-xl border border-rose-100">
                        <h4 className="font-bold text-rose-800 mb-2 flex items-center gap-2">
                            <AlertTriangle size={18} /> 陷阱二：偏離你的研究
                        </h4>
                        <p className="text-sm text-slate-700 mb-2">
                            AI 找出的缺口是「過去研究缺乏對 50 歲以上成人的探討」。但你的題目明明是研究高中生？
                        </p>
                        <div className="bg-white p-2 rounded text-xs text-slate-600 border border-rose-200">
                            <strong>你的裁奪：</strong> 拒絕 AI 的缺口！你必須自己引導：過去研究雖然探討了高中生，但多半是「量化問卷」，因此「本研究的缺口」在於採用質性訪談來深入了解。
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
                    將 AI 幫你綜合的共識、加上你親自勾勒出的「研究缺口」，寫成文獻回顧的結語（這將收尾你的報告第二章）。
                </p>
                <div className="bg-emerald-50 p-5 rounded-lg border border-emerald-100 font-serif">
                    <p className="text-sm text-slate-700 leading-loose">
                        <strong className="text-emerald-700">【描述】與【詮釋】(學界共識)</strong><br />
                        綜合上述文獻可知，目前學界對於「＿＿＿＿」的看法，多數傾向認為＿＿＿＿。然而，在＿＿＿＿的傾向上，各方研究所持理由仍存在分歧，可能的原因是他們研究對象的不同。<br /><br />
                        <strong className="text-emerald-700">【回扣】(研究缺口⭐必須是你自己想做的)</strong><br />
                        過去研究多半集中於探討＿＿＿＿，然而，對於＿＿＿＿（這就是你本篇研究的焦點，例如某個沒被訪問過的族群或新興現象）的了解仍相對空窗。因此，本研究的發起正是為了填補此一缺口，將藉由後續的研究方法，揭示這塊拼圖。<br /><br />
                        <strong className="text-emerald-700">【批判】(研究限制)</strong><br />
                        本章節的回顧受限於目前國內文獻的數量，且部分資料年代可能面臨時代變遷的挑戰。
                    </p>
                </div>
            </div >

        </div >
    );
};
