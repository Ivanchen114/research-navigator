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
                            <h2 className="text-2xl font-bold text-slate-800">模組 5：文獻分析法</h2>
                        </div>
                        <p className="text-slate-600 mt-2 text-sm">目標：綜合 (Synthesize) 與 比較 (Compare)，而非單純摘要。</p>
                    </div>
                    <DocLinkBtn href="https://docs.google.com/document/d/1NCc62n2kU5xRIM6uRTMU4howa4SnLlcG46iJ6cNJi-Q/edit?usp=drive_link">
                        完整指南
                    </DocLinkBtn>
                </div>
            </header>

            {/* Step 2: First Round Analysis (W14) */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 border-l-4 border-l-blue-500 p-6">
                <div className="flex items-center gap-2 mb-2">
                    <Bot className="text-blue-600" />
                    <h3 className="text-lg font-bold text-slate-800">Step 2：第一輪分析 (AI 找共識與缺口)</h3>
                </div>
                <p className="text-sm text-slate-600 mb-4">文獻探討最怕變成「流水帳摘要」。請把多篇文獻的重點或摘要餵給 AI，請它幫你進行<strong className="text-blue-600">比較 (Compare)</strong> 與 <strong className="text-blue-600">綜合 (Synthesize)</strong>。</p>

                <AIInstructionDropdown title="複製 Prompt：多篇文獻交叉比對">
                    <PromptBox>
                        {`【任務】我正在寫一篇文獻探討，主題是「＿＿＿」。
以下是我蒐集到的幾篇文獻摘要（或我整理的重點重點）：

[文獻 A]：(貼上標題與摘要)
[文獻 B]：(貼上標題與摘要)
[文獻 C]：(貼上標題與摘要)

請幫我綜合分析這三篇文獻：
1. 找出它們的「最大共識」是什麼？（大家都同意什麼？）
2. 找出它們的「分歧點」是什麼？（哪裡有爭議或不同觀點？）
3. 幫我找出一個上述文獻都還沒解決的「研究缺口 (Research Gap)」。`}
                    </PromptBox>
                </AIInstructionDropdown>
            </div>

            {/* Self-Learning: Synthesis Matrix */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
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
            </div>

            {/* Step 3: Human Judgment (W14) */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 border-l-4 border-l-rose-500 p-6">
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
            </div>

            {/* Step 4: Drafting (W14) */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 border-l-4 border-l-emerald-500 p-6">
                <div className="flex items-center gap-2 mb-2">
                    <PenLine className="text-emerald-600" />
                    <h3 className="text-lg font-bold text-slate-800">Step 4：黃金寫作草稿</h3>
                </div>
                <p className="text-sm text-slate-600 mb-4">
                    將 AI 幫你綜合的共識、你的裁奪與你找到的研究缺口，寫成文獻回顧的結語（請記錄到文件裡，這就是你報告第二章的結尾）。
                </p>
                <div className="bg-emerald-50 p-5 rounded-lg border border-emerald-100 font-serif">
                    <p className="text-sm text-slate-700 leading-loose">
                        <strong className="text-emerald-700">【數據/資料描述 (客觀現象、共識)】</strong><br />
                        綜合上述文獻可知，目前學界對於「＿＿＿＿」的看法，多數傾向認為＿＿＿＿（例如：某某因素是主要成因）。然而，在＿＿＿＿的傾向上，各方研究仍存在分歧。
                        <br /><br />
                        <strong className="text-emerald-700">【分析推論 (引出你的研究缺口)】</strong><br />
                        回顧過往文獻，雖然多數研究已探討了＿＿＿＿，但較少針對＿＿＿＿（你的切入點/特殊族群/新方法）進行深入分析。因此，本研究將試圖填補此一缺口，透過＿＿＿＿方法，進一步探討＿＿＿＿。
                    </p>
                </div>
            </div>

        </div>
    );
};
