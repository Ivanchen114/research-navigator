import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ChevronRight, RefreshCw, CheckCircle2, AlertTriangle, FileSearch, BookOpen, Search, Eye, ClipboardList, Mic, TestTube2, ArrowDown } from 'lucide-react';

const DISEASES = [
    { id: 'big', name: '範圍太大 (大)', icon: '🌍', description: '想要研究「全球氣候變遷」或「全台灣高中生」。', cure: '大 → 小 (縮小範圍，例如：單一學校的減塑行為)' },
    { id: 'empty', name: '太過抽象 (空)', icon: '☁️', description: '太抽象無法測量，例如研究「幸福的真諦」。', cure: '空 → 實 (具體化，例如：每天睡眠時數與主觀快樂分數的關聯)' },
    { id: 'far', name: '接觸不到 (遠)', icon: '🔭', description: '接觸不到對象或資料，例如研究「愛因斯坦的真實想法」。', cure: '遠 → 近 (找得到的對象，例如：科學班學生的學習態度)' },
    { id: 'hard', name: '變因太難 (難)', icon: '🧗', description: '變因太多無法控制，或主題太過專業超出高中生能力。', cure: '難 → 易 (簡化變因，聚焦單一變項)' }
];

const METHODS = [
    { id: 'survey', name: '問卷研究 (Survey)', icon: <ClipboardList size={24} />, rule: '探討廣泛的相關性、頻率、態度分佈。', desc: '適合收集大量數據看整體趨勢。' },
    { id: 'interview', name: '訪談研究 (Interview)', icon: <Mic size={24} />, rule: '探討深入的「為什麼」、個人經驗、價值觀。', desc: '適合挖掘少數人的深層想法。' },
    { id: 'experiment', name: '實驗研究 (Experiment)', icon: <TestTube2 size={24} />, rule: '驗證明確的因果關係，有實驗組與控制組。', desc: '適合控制變數來比較差異。' },
    { id: 'observation', name: '觀察研究 (Observation)', icon: <Eye size={24} />, rule: '記錄自然環境中的真實行為表現。', desc: '適合看別人「實際怎麼做」而非「怎麼說」。' },
    { id: 'literature', name: '文獻分析 (Literature)', icon: <BookOpen size={24} />, rule: '整合並比較現有二手資料，產出新觀點。', desc: '不親自收集新數據，而是分析歷史文本。' },
];

export const Wizard = () => {
    const [step, setStep] = useState(1);
    const [researchTopic, setResearchTopic] = useState('');
    const [selectedDiseases, setSelectedDiseases] = useState([]);
    const [refinedTopic, setRefinedTopic] = useState('');
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

    // Only show result when we've reached a terminal node in the decision tree
    const isTerminal = () => {
        if (methodAnswers.causeEffect === 'yes') return true;  // → experiment
        if (methodAnswers.deepWhy === 'yes') return true;       // → interview
        if (methodAnswers.broadStats === 'yes') return true;    // → survey
        if (methodAnswers.naturalBehavior === 'yes') return true; // → observation
        if (methodAnswers.naturalBehavior === 'no') return true;  // → literature
        return false;
    };

    // Visual tree branch connector
    const TreeBranch = ({ answer, isYes }) => {
        if (!answer) return null;
        const isActive = answer === (isYes ? 'yes' : 'no');
        if (!isActive) return null;
        return (
            <div className="flex justify-center py-2">
                <div className="flex flex-col items-center">
                    <div className={`w-0.5 h-6 ${isYes ? 'bg-emerald-400' : 'bg-slate-300'}`} />
                    <div className={`text-xs font-bold px-3 py-1 rounded-full ${isYes ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                        {isYes ? '✓ 是' : '✗ 否 → 繼續往下'}
                    </div>
                    <div className={`w-0.5 h-6 ${isYes ? 'bg-emerald-400' : 'bg-slate-300'}`} />
                </div>
            </div>
        );
    };

    // Result card component
    const ResultCard = ({ method }) => {
        const recommended = METHODS.find(m => m.id === method);
        return (
            <div className="animate-in zoom-in-95 duration-300 mt-2">
                <div className="bg-slate-900 text-white p-8 rounded-2xl text-center shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500 rounded-full blur-3xl opacity-20 translate-x-1/2 -translate-y-1/2" />
                    <div className="relative z-10">
                        <h3 className="text-blue-400 font-bold tracking-widest text-sm mb-4">🎯 系統判定最佳方法</h3>
                        <div className="text-white flex justify-center mb-4 scale-150">{recommended.icon}</div>
                        <h4 className="text-3xl font-extrabold mb-3 text-white">{recommended.name}</h4>
                        <p className="text-slate-300 mb-6 max-w-md mx-auto">{recommended.rule}</p>
                        <div className="bg-white/10 p-4 rounded-xl border border-white/20 text-left">
                            <span className="text-blue-300 text-xs font-bold uppercase tracking-wider block mb-1">你的定案題目</span>
                            <span className="font-bold text-white text-lg">「{refinedTopic}」</span>
                        </div>
                    </div>
                </div>
                <div className="flex justify-center mt-6 gap-4">
                    <Button variant="outline" onClick={handleReset} className="flex items-center gap-2">
                        <RefreshCw size={16} /> 放棄重來
                    </Button>
                </div>
            </div>
        );
    };

    return (
        <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in duration-500 pb-16">

            {/* ===== Header ===== */}
            <div className="text-center pt-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-semibold mb-4">
                    <Search size={16} /> 發現與對焦階段 (W3)
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 tracking-tight mb-4">
                    題目健檢與方法快篩
                </h1>
                <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                    做研究最怕一開始題目就走偏！<br />在讓 AI 幫你健檢前，先來了解一下好題目的標準，以及五大研究方法的武器庫。
                </p>
            </div>

            {/* ===== 觀念一：四大絕症 ===== */}
            <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
                <h2 className="text-2xl font-bold text-slate-800 mb-2 flex items-center gap-2">
                    <AlertTriangle className="text-amber-500" />
                    觀念一：新手題目的「四大絕症」
                </h2>
                <p className="text-slate-600 mb-8">如果你的題目不幸中了以下任何一種病，研究一定會卡關。請牢記我們的萬用解藥：「大空遠難 → 小實近易」。</p>
                <div className="grid md:grid-cols-2 gap-6">
                    {DISEASES.map((disease) => (
                        <div key={disease.id} className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                            <div className="flex items-start gap-4">
                                <span className="text-4xl">{disease.icon}</span>
                                <div>
                                    <h3 className="font-bold text-lg text-slate-800 mb-1">{disease.name}</h3>
                                    <p className="text-sm text-slate-600 mb-3">{disease.description}</p>
                                    <div className="bg-emerald-100 text-emerald-800 text-sm font-semibold p-2 rounded">
                                        👉 解藥：{disease.cure}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ===== 觀念二：五大研究方法 ===== */}
            <section className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl shadow-sm border border-indigo-100 p-8">
                <h2 className="text-2xl font-bold text-slate-800 mb-2 flex items-center gap-2">
                    <FileSearch className="text-indigo-600" />
                    觀念二：五大研究方法挑選法則
                </h2>
                <p className="text-slate-600 mb-8">確認題目沒病後，你要選對工具。就像你要喝湯不會拿叉子，選錯方法會讓你白忙一場。</p>
                <div className="grid md:grid-cols-5 gap-4">
                    {METHODS.map((method) => (
                        <div key={method.id} className="bg-white rounded-xl p-4 border border-indigo-100 shadow-sm flex flex-col items-center text-center hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-3">
                                {method.icon}
                            </div>
                            <h3 className="font-bold text-slate-800 text-sm mb-2">{method.name.split(' ')[0]}</h3>
                            <p className="text-xs text-slate-500">{method.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ===== Divider ===== */}
            <div className="flex flex-col items-center justify-center py-4 opacity-50">
                <ArrowDown className="text-slate-400 animate-bounce" size={32} />
                <span className="text-sm font-bold text-slate-500 uppercase tracking-widest mt-2">進入實戰沙盤</span>
            </div>

            {/* ===== Interactive Wizard Tool ===== */}
            <div id="wizard-tool" className="scroll-mt-8">
                {/* Progress Bar */}
                <div className="flex justify-between mb-8 relative max-w-2xl mx-auto">
                    <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-200 -z-10 -translate-y-1/2 rounded-full" />
                    <div
                        className="absolute top-1/2 left-0 h-1 bg-blue-500 -z-10 -translate-y-1/2 rounded-full transition-all duration-300"
                        style={{ width: `${((step - 1) / 3) * 100}%` }}
                    />
                    {[1, 2, 3, 4].map(s => (
                        <div
                            key={s}
                            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 transition-colors ${step >= s ? 'bg-blue-600 border-blue-600 text-white shadow-md' : 'bg-white border-slate-300 text-slate-400'}`}
                        >
                            {s}
                        </div>
                    ))}
                </div>

                {/* ---- Step 1 ---- */}
                {step === 1 && (
                    <Card className="animate-in slide-in-from-right-8 max-w-2xl mx-auto shadow-md border-t-4 border-t-blue-500">
                        <CardHeader>
                            <CardTitle>Step 1: 你的初步點子是什麼？</CardTitle>
                            <CardDescription>先別管對錯，把你現在腦海中想做的題目寫下來。</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <textarea
                                value={researchTopic}
                                onChange={(e) => setResearchTopic(e.target.value)}
                                className="w-full p-4 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-800 bg-slate-50"
                                rows="4"
                                placeholder='例如：「我想研究死刑存廢」、「我想知道學生都花多少錢吃早餐」...'
                            />
                            <div className="flex justify-end">
                                <Button onClick={handleNextStep} disabled={!researchTopic.trim()} size="lg">
                                    下一步：自我把脈 <ChevronRight size={18} className="ml-1" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* ---- Step 2 ---- */}
                {step === 2 && (
                    <Card className="animate-in slide-in-from-right-8 border-l-4 border-l-amber-500 max-w-3xl mx-auto shadow-md">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-amber-800">
                                <AlertTriangle size={20} /> Step 2: 題目健檢診斷
                            </CardTitle>
                            <CardDescription>對照上方的「四大絕症」，你覺得自己的題目犯了哪幾種病？（可複選）</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                                <span className="text-xs font-bold text-slate-500">你的原版題目：</span>
                                <p className="text-slate-800 font-medium mt-1 text-lg">「{researchTopic}」</p>
                            </div>
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
                                            <div className="mt-2 text-sm font-semibold text-emerald-700 bg-emerald-100/50 p-2 rounded">
                                                👉 下一步要用解藥：{disease.cure}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-between items-center pt-4">
                                <Button variant="outline" onClick={() => setStep(1)}>上一步</Button>
                                <Button onClick={handleNextStep} disabled={selectedDiseases.length === 0} className="bg-amber-600 hover:bg-amber-700" size="lg">
                                    服用解藥並修改 <ChevronRight size={18} className="ml-1" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* ---- Step 3 ---- */}
                {step === 3 && (
                    <Card className="animate-in slide-in-from-right-8 border-l-4 border-l-emerald-500 max-w-2xl mx-auto shadow-md">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-emerald-800">
                                <CheckCircle2 size={20} /> Step 3: 產生修正版題目
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-100 mb-4">
                                <p className="text-xs text-emerald-800 font-bold mb-2">請根據你剛才選擇的解藥來修改：</p>
                                <ul className="list-disc list-inside text-sm text-emerald-700 font-semibold space-y-1">
                                    {selectedDiseases.map(id => {
                                        const d = DISEASES.find(x => x.id === id);
                                        return <li key={id}>{d.cure}</li>;
                                    })}
                                </ul>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">
                                    你的修正版題目（請確保能具體符合人物、地點、事件）：
                                </label>
                                <textarea
                                    value={refinedTopic}
                                    onChange={(e) => setRefinedTopic(e.target.value)}
                                    className="w-full p-4 border-2 border-emerald-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-slate-800"
                                    rows="3"
                                    placeholder="例如：松山高中高一學生(對象)每天睡眠時數(變數A)與上課打瞌睡頻率(變數B)的關聯性研究。"
                                />
                            </div>
                            <div className="flex justify-between items-center pt-4">
                                <Button variant="outline" onClick={() => setStep(2)}>上一步</Button>
                                <Button onClick={handleNextStep} disabled={!refinedTopic.trim()} className="bg-emerald-600 hover:bg-emerald-700" size="lg">
                                    下一步：進入方法快篩 <ChevronRight size={18} className="ml-1" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* ---- Step 4: Decision Tree ---- */}
                {step === 4 && (
                    <div className="max-w-3xl mx-auto animate-in slide-in-from-right-8">
                        <Card className="border-t-8 border-t-blue-600 shadow-xl mb-8">
                            <CardHeader className="text-center pb-2">
                                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <TestTube2 size={32} />
                                </div>
                                <CardTitle className="text-2xl text-slate-800">Step 4: 研究方法決策樹</CardTitle>
                                <CardDescription>順著樹枝往下走，回答問題後就能找到最適合你的研究方法！</CardDescription>
                            </CardHeader>
                        </Card>

                        {/* ===== TREE VISUALIZATION ===== */}
                        <div className="relative">
                            {/* Vertical trunk line */}
                            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-slate-200 -translate-x-1/2 -z-10" />

                            {/* Root node */}
                            <div className="flex justify-center mb-2">
                                <div className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-md z-10">
                                    🌳 開始診斷
                                </div>
                            </div>

                            {/* Q1: Experiment */}
                            <div className="relative bg-white rounded-2xl border-2 border-blue-200 p-6 shadow-sm mb-0 z-10">
                                <div className="absolute -top-3 left-6 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">Q1</div>
                                <p className="font-bold text-slate-800 mt-1 mb-4">
                                    你想驗證明確的「A 導致 B」因果關係，而且有辦法「控制」部分受試者的體驗（例如有實驗組、對照組）嗎？
                                </p>
                                <div className="flex gap-3 flex-wrap">
                                    <Button
                                        variant={methodAnswers.causeEffect === 'yes' ? 'default' : 'outline'}
                                        className={methodAnswers.causeEffect === 'yes' ? 'bg-emerald-600 hover:bg-emerald-700' : ''}
                                        onClick={() => setMethodAnswers({ causeEffect: 'yes' })}
                                    >
                                        ✓ 是，我可以做實驗
                                    </Button>
                                    <Button
                                        variant={methodAnswers.causeEffect === 'no' ? 'default' : 'outline'}
                                        className={methodAnswers.causeEffect === 'no' ? 'bg-slate-600 hover:bg-slate-700' : ''}
                                        onClick={() => setMethodAnswers({ causeEffect: 'no' })}
                                    >
                                        ✗ 否，我無法控制他們
                                    </Button>
                                </div>
                            </div>

                            {/* Q1 → YES → Experiment */}
                            {methodAnswers.causeEffect === 'yes' && (
                                <>
                                    <TreeBranch answer="yes" isYes={true} />
                                    <ResultCard method="experiment" />
                                </>
                            )}

                            {/* Q1 → NO → Q2 */}
                            {methodAnswers.causeEffect === 'no' && (
                                <>
                                    <TreeBranch answer="no" isYes={false} />

                                    {/* Q2: Interview */}
                                    <div className="relative bg-white rounded-2xl border-2 border-indigo-200 p-6 shadow-sm mb-0 z-10 animate-in fade-in slide-in-from-top-4">
                                        <div className="absolute -top-3 left-6 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full">Q2</div>
                                        <p className="font-bold text-slate-800 mt-1 mb-4">
                                            你想深入了解某個特定群體「為什麼這麼想」，挖出他們背後的深層原因、人生經驗或價值觀嗎？
                                        </p>
                                        <div className="flex gap-3 flex-wrap">
                                            <Button
                                                variant={methodAnswers.deepWhy === 'yes' ? 'default' : 'outline'}
                                                className={methodAnswers.deepWhy === 'yes' ? 'bg-emerald-600 hover:bg-emerald-700' : ''}
                                                onClick={() => setMethodAnswers({ causeEffect: 'no', deepWhy: 'yes' })}
                                            >
                                                ✓ 是，我想深聊
                                            </Button>
                                            <Button
                                                variant={methodAnswers.deepWhy === 'no' ? 'default' : 'outline'}
                                                className={methodAnswers.deepWhy === 'no' ? 'bg-slate-600 hover:bg-slate-700' : ''}
                                                onClick={() => setMethodAnswers({ causeEffect: 'no', deepWhy: 'no' })}
                                            >
                                                ✗ 否，沒那麼深
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Q2 → YES → Interview */}
                                    {methodAnswers.deepWhy === 'yes' && (
                                        <>
                                            <TreeBranch answer="yes" isYes={true} />
                                            <ResultCard method="interview" />
                                        </>
                                    )}

                                    {/* Q2 → NO → Q3 */}
                                    {methodAnswers.deepWhy === 'no' && (
                                        <>
                                            <TreeBranch answer="no" isYes={false} />

                                            {/* Q3: Survey */}
                                            <div className="relative bg-white rounded-2xl border-2 border-cyan-200 p-6 shadow-sm mb-0 z-10 animate-in fade-in slide-in-from-top-4">
                                                <div className="absolute -top-3 left-6 bg-cyan-600 text-white text-xs font-bold px-3 py-1 rounded-full">Q3</div>
                                                <p className="font-bold text-slate-800 mt-1 mb-4">
                                                    你想知道一大群人（例如全校幾百人）的普遍態度、選擇偏好的「比例分佈」，或者是變數之間的「相關性」嗎？
                                                </p>
                                                <div className="flex gap-3 flex-wrap">
                                                    <Button
                                                        variant={methodAnswers.broadStats === 'yes' ? 'default' : 'outline'}
                                                        className={methodAnswers.broadStats === 'yes' ? 'bg-emerald-600 hover:bg-emerald-700' : ''}
                                                        onClick={() => setMethodAnswers({ causeEffect: 'no', deepWhy: 'no', broadStats: 'yes' })}
                                                    >
                                                        ✓ 是，我想看大趨勢
                                                    </Button>
                                                    <Button
                                                        variant={methodAnswers.broadStats === 'no' ? 'default' : 'outline'}
                                                        className={methodAnswers.broadStats === 'no' ? 'bg-slate-600 hover:bg-slate-700' : ''}
                                                        onClick={() => setMethodAnswers({ causeEffect: 'no', deepWhy: 'no', broadStats: 'no' })}
                                                    >
                                                        ✗ 否，不發問卷
                                                    </Button>
                                                </div>
                                            </div>

                                            {/* Q3 → YES → Survey */}
                                            {methodAnswers.broadStats === 'yes' && (
                                                <>
                                                    <TreeBranch answer="yes" isYes={true} />
                                                    <ResultCard method="survey" />
                                                </>
                                            )}

                                            {/* Q3 → NO → Q4 */}
                                            {methodAnswers.broadStats === 'no' && (
                                                <>
                                                    <TreeBranch answer="no" isYes={false} />

                                                    {/* Q4: Observation */}
                                                    <div className="relative bg-white rounded-2xl border-2 border-amber-200 p-6 shadow-sm mb-0 z-10 animate-in fade-in slide-in-from-top-4">
                                                        <div className="absolute -top-3 left-6 bg-amber-600 text-white text-xs font-bold px-3 py-1 rounded-full">Q4</div>
                                                        <p className="font-bold text-slate-800 mt-1 mb-4">
                                                            那麼，你是想要不打擾對象，默默記錄他們在自然狀態下的「真實行為表現」（例如：中午熱食部排隊動線）嗎？
                                                        </p>
                                                        <div className="flex gap-3 flex-wrap">
                                                            <Button
                                                                variant={methodAnswers.naturalBehavior === 'yes' ? 'default' : 'outline'}
                                                                className={methodAnswers.naturalBehavior === 'yes' ? 'bg-emerald-600 hover:bg-emerald-700' : ''}
                                                                onClick={() => setMethodAnswers({ causeEffect: 'no', deepWhy: 'no', broadStats: 'no', naturalBehavior: 'yes' })}
                                                            >
                                                                ✓ 是，我想做田野觀察
                                                            </Button>
                                                            <Button
                                                                variant={methodAnswers.naturalBehavior === 'no' ? 'default' : 'outline'}
                                                                className={methodAnswers.naturalBehavior === 'no' ? 'bg-slate-600 hover:bg-slate-700' : ''}
                                                                onClick={() => setMethodAnswers({ causeEffect: 'no', deepWhy: 'no', broadStats: 'no', naturalBehavior: 'no' })}
                                                            >
                                                                ✗ 否，以上都不是
                                                            </Button>
                                                        </div>
                                                    </div>

                                                    {/* Q4 → YES → Observation */}
                                                    {methodAnswers.naturalBehavior === 'yes' && (
                                                        <>
                                                            <TreeBranch answer="yes" isYes={true} />
                                                            <ResultCard method="observation" />
                                                        </>
                                                    )}

                                                    {/* Q4 → NO → Literature */}
                                                    {methodAnswers.naturalBehavior === 'no' && (
                                                        <>
                                                            <TreeBranch answer="no" isYes={false} />
                                                            <div className="flex justify-center py-2">
                                                                <div className="flex flex-col items-center">
                                                                    <div className="w-0.5 h-4 bg-purple-400" />
                                                                    <div className="text-xs font-bold px-3 py-1 rounded-full bg-purple-100 text-purple-700">
                                                                        🔚 所有「否」→ 最後歸宿
                                                                    </div>
                                                                    <div className="w-0.5 h-4 bg-purple-400" />
                                                                </div>
                                                            </div>
                                                            <ResultCard method="literature" />
                                                        </>
                                                    )}
                                                </>
                                            )}
                                        </>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
