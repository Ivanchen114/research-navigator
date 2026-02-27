import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ChevronRight, RefreshCw, CheckCircle2, AlertTriangle, FileSearch, ArrowRight } from 'lucide-react';

const DISEASES = [
    { id: 'big', name: ' encyclopedic disease (太大)', icon: '🌍', description: '範圍太大，例如想要研究「全球氣候變遷與人類未來」。', cure: '大 → 小 (縮小範圍，例如：單一學校的減塑行為)' },
    { id: 'empty', name: 'abstract philosophy disease (太空)', icon: '☁️', description: '太抽象無法測量，例如研究「幸福的真諦」。', cure: '空 → 實 (具體化，例如：每天睡眠時數與主觀快樂分數的關聯)' },
    { id: 'far', name: 'fortune telling/seance disease (太遠)', icon: '🔭', description: '接觸不到對象或資料，例如研究「外星人的飲食習慣」或「愛因斯坦的真實想法」。', cure: '遠 → 近 (找得到的對象，例如：科學班學生的物理學習態度)' },
    { id: 'hard', name: 'subjective bias/invalid method disease (太難)', icon: '🧗', description: '變因太多無法控制，或太容易流於主觀偏見。', cure: '難 → 易 (簡化變因，聚焦單一變項)' }
];

const METHODS = [
    { id: 'survey', name: '問卷研究 (Survey)', icon: '📋', rule: '探討廣泛的相關性、頻率、態度分佈。' },
    { id: 'interview', name: '訪談研究 (Interview)', icon: '🎤', rule: '探討深入的「為什麼」、個人經驗、價值觀。' },
    { id: 'experiment', name: '實驗研究 (Experiment)', icon: '🧪', rule: '驗證明確的因果關係，有實驗組與控制組。' },
    { id: 'observation', name: '觀察研究 (Observation)', icon: '👀', rule: '記錄自然環境中的真實行為表現。' },
    { id: 'literature', name: '文獻分析 (Literature)', icon: '📚', rule: '整合並比較現有二手資料，產出新觀點。' },
];

export const Wizard = () => {
    const [step, setStep] = useState(1);
    const [researchTopic, setResearchTopic] = useState('');
    const [selectedDiseases, setSelectedDiseases] = useState([]);
    const [refinedTopic, setRefinedTopic] = useState('');

    // Method selection answers
    const [methodAnswers, setMethodAnswers] = useState({});

    const handleNextStep = () => setStep((prev) => prev + 1);
    const handleReset = () => {
        setStep(1);
        setResearchTopic('');
        setSelectedDiseases([]);
        setRefinedTopic('');
        setMethodAnswers({});
    };

    const toggleDisease = (id) => {
        setSelectedDiseases(prev =>
            prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]
        );
    };

    const determineMethod = () => {
        if (methodAnswers.causeEffect === 'yes') return 'experiment';
        if (methodAnswers.deepWhy === 'yes') return 'interview';
        if (methodAnswers.broadStats === 'yes') return 'survey';
        if (methodAnswers.naturalBehavior === 'yes') return 'observation';
        return 'literature';
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-slate-800 flex items-center justify-center gap-3">
                    <FileSearch className="text-blue-600" size={32} />
                    W3 題目健檢與方法快篩
                </h1>
                <p className="text-slate-600 mt-2">萬用心法：把「大、空、遠、難」變成「小、實、近、易」</p>
            </div>

            {/* Progress Bar */}
            <div className="flex justify-between mb-8 relative">
                <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-200 -z-10 -translate-y-1/2 rounded-full"></div>
                <div className={`absolute top-1/2 left-0 h-1 bg-blue-500 -z-10 -translate-y-1/2 rounded-full transition-all duration-300`} style={{ width: `${((step - 1) / 3) * 100}%` }}></div>
                {[1, 2, 3, 4].map(s => (
                    <div key={s} className={`w-8 h-8 rounded-full flex items-center justify-center font-bold border-2 transition-colors ${step >= s ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-300 text-slate-400'}`}>
                        {s}
                    </div>
                ))}
            </div>

            {/* Step 1: Input Idea */}
            {step === 1 && (
                <Card className="animate-in slide-in-from-right-8">
                    <CardHeader>
                        <CardTitle>你的初步點子是什麼？</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-slate-600 text-sm">先別管對錯，把你現在腦海中想做的題目寫下來。例如：「我想研究死刑存廢」、「我想知道學生都花多少錢吃早餐」。</p>
                        <textarea
                            value={researchTopic}
                            onChange={(e) => setResearchTopic(e.target.value)}
                            className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-800"
                            rows="4"
                            placeholder="請輸入你的初步研究題目..."
                        />
                        <div className="flex justify-end">
                            <Button onClick={handleNextStep} disabled={!researchTopic.trim()}>
                                下一步：為題目把脈 <ChevronRight size={18} className="ml-1" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Step 2: Diagnosis (The 8 Diseases mapping to 4 root causes) */}
            {step === 2 && (
                <Card className="animate-in slide-in-from-right-8 border-l-4 border-l-amber-500">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-amber-800">
                            <AlertTriangle size={20} /> 題目健檢診斷
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="bg-slate-50 p-4 rounded-lg border">
                            <span className="text-xs font-bold text-slate-500">你原始的題目：</span>
                            <p className="text-slate-800 italic mt-1">「{researchTopic}」</p>
                        </div>

                        <div>
                            <p className="font-bold text-slate-700 mb-3">請誠實診斷，這個題目犯了哪幾種「病」？（可複選）</p>
                            <div className="grid md:grid-cols-2 gap-4">
                                {DISEASES.map(disease => (
                                    <div
                                        key={disease.id}
                                        onClick={() => toggleDisease(disease.id)}
                                        className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${selectedDiseases.includes(disease.id) ? 'border-amber-500 bg-amber-50' : 'border-slate-200 hover:border-amber-300'}`}
                                    >
                                        <div className="flex items-center gap-2 font-bold mb-2">
                                            <span className="text-2xl">{disease.icon}</span> {disease.name}
                                        </div>
                                        <p className="text-sm text-slate-600">{disease.description}</p>
                                        {selectedDiseases.includes(disease.id) && (
                                            <div className="mt-3 text-sm font-semibold text-emerald-700 bg-emerald-100 p-2 rounded">
                                                👉 解藥：{disease.cure}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-between items-center pt-4">
                            <Button variant="ghost" onClick={() => setStep(1)}>上一步</Button>
                            <Button onClick={handleNextStep} disabled={selectedDiseases.length === 0} className="bg-amber-600 hover:bg-amber-700">
                                服用解藥並修改 <ChevronRight size={18} className="ml-1" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Step 3: Refine */}
            {step === 3 && (
                <Card className="animate-in slide-in-from-right-8 border-l-4 border-l-emerald-500">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-emerald-800">
                            <CheckCircle2 size={20} /> 萬用心法：產生修正版題目
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="bg-slate-50 p-4 rounded-lg border mb-4">
                            <p className="text-xs text-slate-500 font-bold mb-2">請根據你剛才選擇的解藥來修改：</p>
                            <ul className="list-disc list-inside text-sm text-emerald-700 font-semibold space-y-1">
                                {selectedDiseases.map(id => {
                                    const d = DISEASES.find(x => x.id === id);
                                    return <li key={id}>{d.cure}</li>
                                })}
                            </ul>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                你的修正版題目（請確保能具體符合 5W1H）：
                            </label>
                            <textarea
                                value={refinedTopic}
                                onChange={(e) => setRefinedTopic(e.target.value)}
                                className="w-full p-4 border-2 border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-slate-800"
                                rows="3"
                                placeholder="例如：松山高中高一學生(Who/Where)每天睡眠總時數(What)與上課打瞌睡頻率(What)的關聯性研究。"
                            />
                        </div>

                        <div className="flex justify-between items-center pt-4">
                            <Button variant="ghost" onClick={() => setStep(2)}>上一步</Button>
                            <Button onClick={handleNextStep} disabled={!refinedTopic.trim()} className="bg-emerald-600 hover:bg-emerald-700">
                                下一步：方法快篩 <ChevronRight size={18} className="ml-1" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Step 4: Feasibility & Method Selection */}
            {step === 4 && (
                <Card className="animate-in slide-in-from-right-8 border-l-4 border-l-blue-500 shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-blue-800">🔬 研究方法快篩</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <p className="text-slate-600 mb-4">回答以下問題，我們幫你找出最適合的研究方法：</p>

                        <div className="space-y-4">
                            <div className="bg-blue-50 p-4 rounded-lg">
                                <p className="font-bold mb-3">1. 你想驗證明確的「A 導致 B」因果關係，且能控制實驗環境嗎？</p>
                                <div className="flex gap-4">
                                    <Button variant={methodAnswers.causeEffect === 'yes' ? 'primary' : 'secondary'} onClick={() => setMethodAnswers({ ...methodAnswers, causeEffect: 'yes' })}>是</Button>
                                    <Button variant={methodAnswers.causeEffect === 'no' ? 'primary' : 'secondary'} onClick={() => setMethodAnswers({ ...methodAnswers, causeEffect: 'no' })}>否</Button>
                                </div>
                            </div>

                            {methodAnswers.causeEffect === 'no' && (
                                <div className="bg-indigo-50 p-4 rounded-lg animate-in fade-in">
                                    <p className="font-bold mb-3">2. 你想深入了解少數人「為什麼這麼想」背後的深層原因或故事嗎？</p>
                                    <div className="flex gap-4">
                                        <Button variant={methodAnswers.deepWhy === 'yes' ? 'primary' : 'secondary'} onClick={() => setMethodAnswers({ ...methodAnswers, deepWhy: 'yes' })}>是</Button>
                                        <Button variant={methodAnswers.deepWhy === 'no' ? 'primary' : 'secondary'} onClick={() => setMethodAnswers({ ...methodAnswers, deepWhy: 'no' })}>否</Button>
                                    </div>
                                </div>
                            )}

                            {methodAnswers.deepWhy === 'no' && (
                                <div className="bg-cyan-50 p-4 rounded-lg animate-in fade-in">
                                    <p className="font-bold mb-3">3. 你想知道一大群人（如全校）的普遍態度、選擇比例或相關性嗎？</p>
                                    <div className="flex gap-4">
                                        <Button variant={methodAnswers.broadStats === 'yes' ? 'primary' : 'secondary'} onClick={() => setMethodAnswers({ ...methodAnswers, broadStats: 'yes' })}>是</Button>
                                        <Button variant={methodAnswers.broadStats === 'no' ? 'primary' : 'secondary'} onClick={() => setMethodAnswers({ ...methodAnswers, broadStats: 'no' })}>否</Button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Result Area */}
                        {Object.keys(methodAnswers).length > 0 && (
                            <div className="mt-8 pt-6 border-t-2 border-dashed border-slate-200 animate-in slide-in-from-bottom-4">
                                <h3 className="text-lg font-bold text-slate-800 text-center mb-4">🎉 診斷完成！為您開立處方：</h3>
                                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-6 rounded-xl text-center shadow-md">
                                    {(() => {
                                        const recommended = METHODS.find(m => m.id === determineMethod());
                                        return (
                                            <>
                                                <div className="text-5xl mb-4">{recommended.icon}</div>
                                                <h4 className="text-2xl font-bold mb-2">建議使用：{recommended.name}</h4>
                                                <p className="text-blue-100">{recommended.rule}</p>
                                                <p className="mt-4 pt-4 border-t border-blue-500/50 text-sm">
                                                    您的定案題目：<br />
                                                    <span className="font-bold text-white text-base">「{refinedTopic}」</span>
                                                </p>
                                            </>
                                        )
                                    })()}
                                </div>

                                <div className="flex justify-center mt-6">
                                    <Button variant="outline" onClick={handleReset} className="flex items-center gap-2">
                                        <RefreshCw size={16} /> 再測一次別的題目
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

        </div>
    );
};
