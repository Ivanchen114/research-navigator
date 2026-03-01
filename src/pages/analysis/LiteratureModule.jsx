import React from 'react';
import { DocLinkBtn } from '../../components/analysis/DocLinkBtn';
import { PromptBox, AIInstructionDropdown } from '../../components/analysis/PromptBox';

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

            {/* Step 1 */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                <h3 className="text-lg font-bold text-slate-800 mb-2">Step 1：文獻重點提取</h3>
                <p className="text-sm text-slate-600 mb-4">不再只有單純翻譯，而是提取核心論點與方法。</p>

                <AIInstructionDropdown title="重點摘要">
                    <PromptBox>
                        {`【任務】請閱讀以下這篇文獻的摘要。
1. 提取作者的核心論點 (Main Argument)。
2. 作者使用了什麼研究方法？
3. 這個研究的結論是什麼？
【文獻內容】[貼上摘要]`}
                    </PromptBox>
                </AIInstructionDropdown>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 border-l-4 border-l-indigo-500 p-6">
                <h3 className="text-lg font-bold text-slate-800 mb-2">Step 2：綜合矩陣 (Synthesis Matrix) 🔥</h3>
                <p className="text-sm text-slate-600 mb-4">利用 AI 幫你比較多篇文章，找出共識與分歧。這是文獻探討的靈魂！</p>

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

        </div>
    );
};
