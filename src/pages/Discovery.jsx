import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { PromptBox, AIInstructionDropdown } from '../components/analysis/PromptBox';
import { Search, Lightbulb, PenTool, ArrowRight, Eye, ShieldAlert, BrainCircuit } from 'lucide-react';

export const Discovery = () => {
    const [observation, setObservation] = useState('');
    const [expectation, setExpectation] = useState('');
    const [reality, setReality] = useState('');
    const [draftQuestion, setDraftQuestion] = useState('');

    const generatePrompt = () => {
        return `【角色】你是一位嚴格但有啟發性的高中專題研究指導老師。
【任務】請對學生的「問題意識」初稿進行健檢，並給予引導。
【規則】
1. 絕對不要直接給出完整的研究題目。
2. 請指出這個問題是否太過常識（AI 就能直接回答）？
3. 請引導學生思考：這個現象背後的「衝突點」或「變項」還可以怎麼深化？

【學生草稿】
- 觀察到的具體現象：${observation || '(未填寫)'}
- 原本理所當然的期待：${expectation || '(未填寫)'}
- 實際發生的落差：${reality || '(未填寫)'}
- 初步提出的問題：${draftQuestion || '(未填寫)'}`;
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">

            {/* Header Section */}
            <div className="text-center space-y-4 mb-12">
                <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight">
                    第一步：發掘問題
                </h1>
                <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                    好的研究不是坐在書桌前想出來的，而是從生活中的「不尋常」看出來的。<br /> 帶上偵探的裝備，我們開始辦案吧！
                </p>
            </div>

            {/* The 3 Swords Section */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <ShieldAlert className="text-blue-600" />
                    偵探的三把劍 (W0)
                </h2>
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition">
                        <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
                            <Eye size={24} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800 mb-2">1. 觀察力</h3>
                        <p className="text-sm text-slate-600">看見別人沒看見的細節。真正的研究者能「看見大猩猩」。</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition">
                        <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                            <Search size={24} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800 mb-2">2. 假設檢定</h3>
                        <p className="text-sm text-slate-600">像玩「海龜湯」，先大膽假設，再小心求證。</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition">
                        <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-4">
                            <BrainCircuit size={24} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800 mb-2">3. 批判思考</h3>
                        <p className="text-sm text-slate-600">不盲從權威，識破表面現象背後的矛盾與謊言。</p>
                    </div>
                </div>
            </section>

            {/* The Question Builder */}
            <section>
                <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
                    <div className="bg-slate-800 text-white p-6 md:p-8">
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            <PenTool className="text-blue-400" />
                            問題意識鍛鍊所 (W2)
                        </h2>
                        <p className="text-slate-300 mt-2">
                            不要問「AI 知道答案」的問題（如：什麼是溫室效應？）。<br />
                            要問「只有在你的學校、你的社團、你的生活中」才看得到的在地問題。
                        </p>
                    </div>

                    <div className="p-6 md:p-8 space-y-8">
                        {/* Step 1 */}
                        <div className="space-y-3">
                            <h3 className="text-lg font-bold justify-start flex items-center gap-2 text-slate-800">
                                <span className="bg-blue-100 text-blue-800 w-6 h-6 rounded-full flex items-center justify-center text-sm">1</span>
                                覺察現象 (Observation)
                            </h3>
                            <p className="text-sm text-slate-500">像攝影機一樣，你具體看到了什麼畫面？（例：每天中午，合作社賣 65 元的難吃便當總是大排長龍，而旁邊 50 元的卻沒人買。）</p>
                            <textarea
                                className="w-full border border-slate-300 rounded-lg p-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all min-h-[100px]"
                                placeholder="請客觀描述你看到的場景..."
                                value={observation}
                                onChange={(e) => setObservation(e.target.value)}
                            />
                        </div>

                        {/* Step 2 */}
                        <div className="space-y-3 bg-slate-50 p-6 rounded-xl border border-slate-100">
                            <h3 className="text-lg font-bold justify-start flex items-center gap-2 text-slate-800">
                                <span className="bg-blue-100 text-blue-800 w-6 h-6 rounded-full flex items-center justify-center text-sm">2</span>
                                發現落差 (The Gap)
                            </h3>
                            <p className="text-sm text-slate-500 mb-4">為什麼這個現象很奇怪？它違背了什麼常理？</p>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">A. 理所當然的期待 (應該要...)</label>
                                    <textarea
                                        className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
                                        placeholder="例：學生應該會想省錢買便宜的。"
                                        value={expectation}
                                        onChange={(e) => setExpectation(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">B. 實際發生的現象 (但卻...)</label>
                                    <textarea
                                        className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
                                        placeholder="例：卻寧願排隊買貴又難吃的。"
                                        value={reality}
                                        onChange={(e) => setReality(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="flex justify-center mt-2">
                                <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-bold border border-red-200">
                                    ↑ 這個衝突點，就是研究的價值 ↑
                                </span>
                            </div>
                        </div>

                        {/* Step 3 */}
                        <div className="space-y-3">
                            <h3 className="text-lg font-bold justify-start flex items-center gap-2 text-slate-800">
                                <span className="bg-blue-100 text-blue-800 w-6 h-6 rounded-full flex items-center justify-center text-sm">3</span>
                                試寫問題 (The Question)
                            </h3>
                            <p className="text-sm text-slate-500">基於上述落差，用「為什麼」或「如何」開頭，寫下你的研究問題。</p>
                            <textarea
                                className="w-full border border-blue-300 bg-blue-50 rounded-lg p-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium text-blue-900 min-h-[80px]"
                                placeholder="例：為什麼本校學生在購買午餐時，展現出非理性的消費行為？背後有哪些影響因素？"
                                value={draftQuestion}
                                onChange={(e) => setDraftQuestion(e.target.value)}
                            />
                        </div>

                        {/* AI Assistant Hook */}
                        <div className="pt-6 border-t border-slate-200">
                            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <Lightbulb className="text-amber-500" />
                                呼叫 AI 指導老師
                            </h3>
                            <p className="text-sm text-slate-600 mb-4">寫得差不多了嗎？生成專屬指令，讓 AI 幫你健檢這個問題是否具備研究價值（AI-RED 提示：請自行判斷 AI 的建議是否合理，不要照單全收！）。</p>

                            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                                <PromptBox>
                                    {generatePrompt()}
                                </PromptBox>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* Navigation to next step */}
            <div className="flex justify-end pt-8 pb-12">
                <Link to="/wizard" className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition shadow-md hover:shadow-lg">
                    問題寫好了，前進「方法快篩」 <ArrowRight size={20} />
                </Link>
            </div>

        </div>
    );
};
