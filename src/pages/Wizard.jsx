import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Link } from 'react-router-dom';
import { ChevronRight, RefreshCw, CheckCircle2, AlertTriangle, FileSearch, BookOpen, Search, Eye, ClipboardList, Mic, TestTube2, ArrowDown, Map, Gamepad2, ArrowRight, ChevronUp, ChevronDown } from 'lucide-react';
import LessonMap from '../components/ui/LessonMap';
import { W3Data } from '../data/lessonMaps';

const DISEASES = [
    { id: 'big', name: '範圍太大 (大)', icon: '🌍', description: '想要研究「全球氣候變遷」或「全台灣高中生」。', cure: '大 → 小 (縮小範圍，例如：單一學校的減塑行為)' },
    { id: 'empty', name: '太過抽象 (空)', icon: '☁️', description: '太抽象無法測量，例如研究「幸福的真諦」。', cure: '空 → 實 (具體化，例如：每天睡眠時數與主觀快樂分數的關聯)' },
    { id: 'far', name: '接觸不到 (遠)', icon: '🔭', description: '接觸不到對象或資料，例如研究「愛因斯坦的真實想法」。', cure: '遠 → 近 (找得到的對象，例如：科學班學生的學習態度)' },
    { id: 'hard', name: '變因太難 (難)', icon: '🧗', description: '變因太多無法控制，或主題太過專業超出高中生能力。', cure: '難 → 易 (簡化變因，聚焦單一變項)' }
];

const METHODS = [
    { id: 'survey', name: '問卷研究 (Survey)', icon: <ClipboardList size={22} />, rule: '探討廣泛的相關性、頻率、態度分佈。', desc: '適合收集大量數據看整體趨勢。' },
    { id: 'interview', name: '訪談研究 (Interview)', icon: <Mic size={22} />, rule: '探討深入的「為什麼」、個人經驗、價值觀。', desc: '適合挖掘少數人的深層想法。' },
    { id: 'experiment', name: '實驗研究 (Experiment)', icon: <TestTube2 size={22} />, rule: '驗證明確的因果關係，有實驗組與控制組。', desc: '適合控制變數來比較差異。' },
    { id: 'observation', name: '觀察研究 (Observation)', icon: <Eye size={22} />, rule: '記錄自然環境中的真實行為表現。', desc: '適合看別人「實際怎麼做」而非「怎麼說」。' },
    { id: 'literature', name: '文獻分析 (Literature)', icon: <BookOpen size={22} />, rule: '整合並比較現有二手資料，產出新觀點。', desc: '不親自收集新數據，而是分析歷史文本。' },
];

export const Wizard = () => {
    const [step, setStep] = useState(1);
    const [researchTopic, setResearchTopic] = useState('');
    const [selectedDiseases, setSelectedDiseases] = useState([]);
    const [refinedTopic, setRefinedTopic] = useState('');
    const [methodAnswers, setMethodAnswers] = useState({});
    const [showLessonMap, setShowLessonMap] = useState(false);

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

    const isTerminal = () => {
        if (methodAnswers.causeEffect === 'yes') return true;
        if (methodAnswers.deepWhy === 'yes') return true;
        if (methodAnswers.broadStats === 'yes') return true;
        if (methodAnswers.naturalBehavior === 'yes') return true;
        if (methodAnswers.naturalBehavior === 'no') return true;
        return false;
    };

    // Result card component updated for Version A
    const ResultCard = ({ method }) => {
        const recommended = METHODS.find(m => m.id === method);
        return (
            <div className="animate-in zoom-in-95 duration-500 mt-6 max-w-[600px] mx-auto">
                <div className="bg-[#1a1a2e] text-white p-10 rounded-[10px] text-center relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="text-[#2d5be3] font-['DM_Mono',monospace] font-bold text-[11px] tracking-[0.2em] uppercase mb-6">🎯 Recommended Method</div>
                        <div className="text-white flex justify-center mb-4">{recommended.icon}</div>
                        <h4 className="text-[28px] font-bold mb-3 font-['Noto_Serif_TC',serif]">{recommended.name}</h4>
                        <p className="text-white/60 text-[14px] mb-8 leading-relaxed px-4">{recommended.rule}</p>
                        <div className="bg-white/5 border border-white/10 p-6 rounded-[6px] text-left">
                            <span className="text-white/40 text-[10px] font-bold uppercase tracking-wider block mb-2 font-['DM_Mono',monospace]">Drafted Topic / 你的定案題目</span>
                            <span className="font-bold text-white text-[16px] leading-relaxed">「{refinedTopic}」</span>
                        </div>
                    </div>
                </div>
                <div className="flex justify-center mt-6">
                    <button onClick={handleReset} className="flex items-center gap-2 text-[12px] text-[#8888aa] hover:text-[#e32d5b] transition-colors font-bold">
                        <RefreshCw size={14} /> 放棄重來
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className="max-w-[900px] mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 font-['Noto_Sans_TC',sans-serif] text-[14px] leading-[1.6] text-[#1a1a2e] pb-16">

            {/* ===== Lesson Map Toggle (Teacher Only) ===== */}
            <div className="flex justify-end pt-2 pb-0 -mb-8 relative z-20">
                <button
                    onClick={() => setShowLessonMap(!showLessonMap)}
                    className="flex items-center gap-1.5 text-[11px] text-[#8888aa] hover:text-[#2d5be3] transition-colors opacity-60 hover:opacity-100 font-['DM_Mono',monospace]"
                    title="教師專用：顯示課程地圖"
                >
                    <Map size={12} />
                    {showLessonMap ? 'Hide Map' : 'Instructor View'}
                </button>
            </div>

            {showLessonMap && (
                <div className="mb-4 animate-in slide-in-from-top-4 duration-300">
                    <LessonMap data={W3Data} />
                </div>
            )}

            {/* Header */}
            <header className="mb-14 pt-8">
                <div className="text-[11px] font-['DM_Mono',monospace] tracking-[0.12em] uppercase text-[#2d5be3] mb-3 flex items-center gap-2">
                    <Search size={14} /> W3 題目健檢
                </div>
                <h1 className="font-['Noto_Serif_TC',serif] text-[38px] font-bold leading-[1.25] text-[#1a1a2e] mb-4 tracking-[-0.02em]">
                    題目健檢與<br className="hidden md:block" />
                    <span className="text-[#2d5be3] font-normal italic">方法快篩</span>
                </h1>
                <p className="text-[15px] text-[#4a4a6a] leading-[1.75] max-w-[560px]">
                    做研究最怕一開始題目就走偏。在讓 AI 幫你優化前，先學會診斷題目的「四大絕症」，並找到最適合你的武器。
                </p>
            </header>

            {/* 觀念一：四大絕症 */}
            <section className="mb-14">
                <div className="flex items-baseline gap-3 mb-6">
                    <h2 className="font-['Noto_Serif_TC',serif] text-[20px] font-bold text-[#1a1a2e] flex items-center gap-2">
                        🛑 觀念一：新手題目的「四大絕症」
                    </h2>
                </div>
                <div className="grid md:grid-cols-2 gap-[1px] bg-[#dddbd5] border border-[#dddbd5] rounded-[10px] overflow-hidden">
                    {DISEASES.map((disease) => (
                        <div key={disease.id} className="bg-white p-6 flex flex-col hover:bg-[#f8f7f4] transition-colors">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="text-[24px]">{disease.icon}</span>
                                <h3 className="font-bold text-[15px] text-[#1a1a2e]">{disease.name}</h3>
                            </div>
                            <p className="text-[13px] text-[#4a4a6a] leading-relaxed mb-4 flex-1">{disease.description}</p>
                            <div className="bg-[#f0ede6] border-l-2 border-[#2e7d5a] p-3 text-[12px] text-[#1a1a2e] font-medium leading-[1.6]">
                                <span className="text-[#2e7d5a] font-bold">👉 解藥：</span>
                                {disease.cure}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* 遊戲入口 */}
            <div className="bg-[#1a1a2e] rounded-[10px] p-8 text-white relative mb-14 overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
                    <Gamepad2 size={80} />
                </div>
                <div className="relative z-10 max-w-[600px]">
                    <div className="text-[#e32d5b] text-[10px] font-['DM_Mono',monospace] tracking-widest mb-4 uppercase">// Interactive Training</div>
                    <h3 className="text-[20px] font-bold mb-3">🎮 行動代號：靶心</h3>
                    <p className="text-white/60 text-[13px] leading-relaxed mb-8">
                        急診室大作戰！在混亂的文獻海中找對方向，鍛鍊從「現象」提煉出「研究問題」的精確度。這關卡將為陷入迷惘的探員對症下藥。
                    </p>
                    <Link
                        to="/game/question-er"
                        className="inline-flex items-center gap-2 bg-[#e32d5b] text-white px-6 py-3 rounded-[6px] text-[14px] font-bold hover:bg-[#f33d6b] transition-all"
                    >
                        進入行動任務 <ArrowRight size={16} />
                    </Link>
                </div>
            </div>

            {/* 觀念二：五大研究方法 */}
            <section className="mb-14">
                <div className="flex items-baseline gap-3 mb-6">
                    <h2 className="font-['Noto_Serif_TC',serif] text-[20px] font-bold text-[#1a1a2e] flex items-center gap-2">
                        🛠️ 觀念二：五大研究方法挑選法則
                    </h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-[1px] bg-[#dddbd5] border border-[#dddbd5] rounded-[10px] overflow-hidden">
                    {METHODS.map((method) => (
                        <div key={method.id} className="bg-white p-5 flex flex-col items-center text-center hover:bg-[#f8f7f4] transition-colors">
                            <div className="w-10 h-10 bg-[#f0ede6] text-[#1a1a2e] rounded-md flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
                                {method.icon}
                            </div>
                            <h3 className="font-bold text-[#1a1a2e] text-[13px] mb-2">{method.name.split(' ')[0]}</h3>
                            <p className="text-[11px] text-[#8888aa] leading-normal">{method.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* 分隔線 */}
            <div className="flex flex-col items-center justify-center py-6 opacity-40">
                <ArrowDown className="text-[#8888aa] animate-bounce" size={24} />
                <span className="text-[10px] font-['DM_Mono',monospace] font-bold tracking-[0.2em] mt-2 uppercase text-[#8888aa]">Interactive Sandbox / 進入實戰</span>
            </div>

            {/* Step Wizard Container */}
            <div className="space-y-12">
                {/* Stepper */}
                <div className="flex justify-center items-center gap-4 py-8">
                    {[1, 2, 3, 4].map(s => (
                        <React.Fragment key={s}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-[12px] transition-all font-['DM_Mono',monospace] ${step >= s ? 'bg-[#1a1a2e] text-white' : 'bg-[#f0ede6] text-[#8888aa] border border-[#dddbd5]'}`}>
                                {s}
                            </div>
                            {s < 4 && <div className={`h-[1px] w-8 ${step > s ? 'bg-[#1a1a2e]' : 'bg-[#dddbd5]'}`} />}
                        </React.Fragment>
                    ))}
                </div>

                {/* Step 1 */}
                {step === 1 && (
                    <div className="max-w-[650px] mx-auto animate-in slide-in-from-bottom-4 duration-500">
                        <div className="bg-white border border-[#dddbd5] rounded-[10px] p-8 space-y-6 shadow-sm">
                            <div>
                                <h3 className="text-[18px] font-bold text-[#1a1a2e] mb-2 font-['Noto_Serif_TC',serif]">Step 1: 你的初步點子</h3>
                                <p className="text-[#8888aa] text-[13px]">先別管對錯，把你腦中初步想的主題寫下來。</p>
                            </div>
                            <textarea
                                value={researchTopic}
                                onChange={(e) => setResearchTopic(e.target.value)}
                                className="w-full p-5 border border-[#dddbd5] rounded-[6px] focus:outline-none focus:border-[#2d5be3] transition-all text-[#1a1a2e] bg-[#f8f7f4] min-h-[120px] text-[14px]"
                                placeholder='例如：「我想研究死刑存廢」、「我想知道學生都花多少錢吃早餐」...'
                            />
                            <div className="flex justify-end pt-4">
                                <button
                                    onClick={handleNextStep}
                                    disabled={!researchTopic.trim()}
                                    className="bg-[#1a1a2e] text-white px-8 py-3 rounded-[6px] text-[14px] font-bold items-center flex gap-2 disabled:opacity-20 transition-all hover:bg-[#2a2a4a]"
                                >
                                    下一步：自我把脈 <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 2 */}
                {step === 2 && (
                    <div className="max-w-[750px] mx-auto animate-in slide-in-from-bottom-4 duration-500">
                        <div className="bg-white border border-[#dddbd5] rounded-[10px] p-8 space-y-8 shadow-sm">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-[18px] font-bold text-[#1a1a2e] mb-2 font-['Noto_Serif_TC',serif]">Step 2: 題目健檢診斷</h3>
                                    <p className="text-[#8888aa] text-[13px]">你覺得自己的題目犯了哪幾種「絕症」？（可複選）</p>
                                </div>
                                <div className="bg-[#f8f7f4] px-4 py-2 rounded-[6px] border border-[#dddbd5] max-w-[300px]">
                                    <span className="text-[10px] font-bold text-[#8888aa] uppercase block mb-1">Your Draft</span>
                                    <p className="text-[#1a1a2e] font-bold text-[12px] truncate">「{researchTopic}」</p>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                {DISEASES.map(disease => (
                                    <div
                                        key={disease.id}
                                        onClick={() => toggleDisease(disease.id)}
                                        className={`p-5 border rounded-[8px] cursor-pointer transition-all ${selectedDiseases.includes(disease.id) ? 'border-[#c9a84c] bg-[#f8f7f4]' : 'border-[#dddbd5] hover:border-[#1a1a2e]'}`}
                                    >
                                        <div className="flex items-center gap-3 font-bold text-[14px] mb-2 text-[#1a1a2e]">
                                            <span className="text-xl">{disease.icon}</span> {disease.name}
                                        </div>
                                        <p className="text-[12px] text-[#4a4a6a] leading-relaxed mb-3">{disease.description}</p>
                                        {selectedDiseases.includes(disease.id) && (
                                            <div className="text-[11px] font-bold text-[#2e7d5a] bg-white border border-[#2e7d5a]/20 p-2 rounded scale-95 origin-left">
                                                解藥：{disease.cure}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="flex justify-between items-center pt-6 border-t border-[#f0ede6]">
                                <button onClick={() => setStep(1)} className="text-[13px] text-[#8888aa] font-bold hover:text-[#1a1a2e]">上一步</button>
                                <button
                                    onClick={handleNextStep}
                                    disabled={selectedDiseases.length === 0}
                                    className="bg-[#c9a84c] text-white px-8 py-3 rounded-[6px] text-[14px] font-bold items-center flex gap-2 disabled:opacity-20 transition-all hover:bg-[#d9b85c]"
                                >
                                    服用解藥改題 <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 3 */}
                {step === 3 && (
                    <div className="max-w-[650px] mx-auto animate-in slide-in-from-bottom-4 duration-500">
                        <div className="bg-white border border-[#dddbd5] rounded-[10px] p-8 space-y-6 shadow-sm">
                            <h3 className="text-[18px] font-bold text-[#1a1a2e] mb-2 font-['Noto_Serif_TC',serif]">Step 3: 修正版題目</h3>

                            <div className="bg-[#f0f9f4] border border-[#2e7d5a]/20 p-5 rounded-[8px]">
                                <p className="text-[11px] text-[#2e7d5a] font-bold mb-3 uppercase tracking-widest font-['DM_Mono',monospace]">Prescription / 修改建議</p>
                                <ul className="space-y-2">
                                    {selectedDiseases.map(id => (
                                        <li key={id} className="text-[13px] text-[#4a4a6a] flex gap-2">
                                            <span className="text-[#2e7d5a]">●</span> {DISEASES.find(x => x.id === id).cure}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[13px] font-bold text-[#4a4a6a]">你的修正版題目：</label>
                                <textarea
                                    value={refinedTopic}
                                    onChange={(e) => setRefinedTopic(e.target.value)}
                                    className="w-full p-5 border border-[#dddbd5] rounded-[6px] focus:outline-none focus:border-[#2e7d5a] transition-all text-[#1a1a2e] bg-white min-h-[100px] text-[14px] font-medium leading-relaxed"
                                    placeholder="例如：松山高中高一學生(對象)每天睡眠時數(變數A)與上課打瞌睡頻率(變數B)的關聯研究。"
                                />
                                <p className="text-[11px] text-[#8888aa]">💡 提示：盡量包含具體的人物、地點、事件變項。</p>
                            </div>

                            <div className="flex justify-between items-center pt-6">
                                <button onClick={() => setStep(2)} className="text-[13px] text-[#8888aa] font-bold hover:text-[#1a1a2e]">上一步</button>
                                <button
                                    onClick={handleNextStep}
                                    disabled={!refinedTopic.trim()}
                                    className="bg-[#2e7d5a] text-white px-8 py-3 rounded-[6px] text-[14px] font-bold items-center flex gap-2 disabled:opacity-20 transition-all hover:bg-[#3e8d6a]"
                                >
                                    下一步：方法快篩 <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 4: Decision Tree */}
                {step === 4 && (
                    <div className="max-w-[750px] mx-auto animate-in slide-in-from-bottom-4 duration-500 space-y-12">
                        <div className="bg-white border border-[#dddbd5] rounded-[10px] p-10 shadow-sm text-center relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-10 opacity-[0.03]">
                                <TestTube2 size={120} />
                            </div>
                            <h3 className="text-[24px] font-bold text-[#1a1a2e] mb-3 font-['Noto_Serif_TC',serif]">Step 4: 研究方法決策樹</h3>
                            <p className="text-[#4a4a6a] text-[14px] max-w-[500px] mx-auto leading-relaxed">順著直覺往下走，透過幾個關鍵提問，幫你鎖定最適合目前題目的武器。</p>
                        </div>

                        {/* Interactive Tree Section */}
                        <div className="relative space-y-6">
                            {/* Question Nodes */}
                            {/* Q1: Experiment */}
                            <div className="bg-white border border-[#dddbd5] rounded-[10px] p-8 shadow-sm animate-in fade-in duration-500">
                                <div className="text-[10px] font-['DM_Mono',monospace] font-bold text-[#2d5be3] uppercase tracking-[0.2em] mb-4">Question 01</div>
                                <p className="text-[15px] font-bold text-[#1a1a2e] mb-6 leading-relaxed">
                                    你想驗證明確的「A 導致 B」因果關係，且有辦法「控制」部分受試者的體驗（例如有實驗組、對照組）嗎？
                                </p>
                                <div className="flex gap-4">
                                    <button
                                        onClick={() => setMethodAnswers({ causeEffect: 'yes' })}
                                        className={`px-6 py-2.5 rounded-[4px] text-[13px] font-bold border transition-all ${methodAnswers.causeEffect === 'yes' ? 'bg-[#1a1a2e] text-white border-[#1a1a2e]' : 'bg-white text-[#4a4a6a] border-[#dddbd5] hover:border-[#1a1a2e]'}`}
                                    >
                                        ✓ 是，我可以做實驗
                                    </button>
                                    <button
                                        onClick={() => setMethodAnswers({ causeEffect: 'no' })}
                                        className={`px-6 py-2.5 rounded-[4px] text-[13px] font-bold border transition-all ${methodAnswers.causeEffect === 'no' ? 'bg-[#1a1a2e] text-white border-[#1a1a2e]' : 'bg-white text-[#4a4a6a] border-[#dddbd5] hover:border-[#1a1a2e]'}`}
                                    >
                                        ✗ 否，我無法控制受試者
                                    </button>
                                </div>
                            </div>

                            {methodAnswers.causeEffect === 'yes' && <ResultCard method="experiment" />}

                            {/* Q2 */}
                            {methodAnswers.causeEffect === 'no' && (
                                <div className="bg-white border border-[#dddbd5] rounded-[10px] p-8 shadow-sm animate-in slide-in-from-top-4 duration-500">
                                    <div className="text-[10px] font-['DM_Mono',monospace] font-bold text-[#2d5be3] uppercase tracking-[0.2em] mb-4">Question 02</div>
                                    <p className="text-[15px] font-bold text-[#1a1a2e] mb-6 leading-relaxed">
                                        你想深入了解某個特定群體「為什麼這麼想」，挖出他們背後的深層原因、個人經驗或價值觀嗎？
                                    </p>
                                    <div className="flex gap-4">
                                        <button
                                            onClick={() => setMethodAnswers({ causeEffect: 'no', deepWhy: 'yes' })}
                                            className={`px-6 py-2.5 rounded-[4px] text-[13px] font-bold border transition-all ${methodAnswers.deepWhy === 'yes' ? 'bg-[#1a1a2e] text-white border-[#1a1a2e]' : 'bg-white text-[#4a4a6a] border-[#dddbd5] hover:border-[#1a1a2e]'}`}
                                        >
                                            ✓ 是，我想進行深聊
                                        </button>
                                        <button
                                            onClick={() => setMethodAnswers({ causeEffect: 'no', deepWhy: 'no' })}
                                            className={`px-6 py-2.5 rounded-[4px] text-[13px] font-bold border transition-all ${methodAnswers.deepWhy === 'no' ? 'bg-[#1a1a2e] text-white border-[#1a1a2e]' : 'bg-white text-[#4a4a6a] border-[#dddbd5] hover:border-[#1a1a2e]'}`}
                                        >
                                            ✗ 否，我不需要挖那麼深
                                        </button>
                                    </div>
                                </div>
                            )}

                            {methodAnswers.deepWhy === 'yes' && <ResultCard method="interview" />}

                            {/* Q3 */}
                            {methodAnswers.deepWhy === 'no' && (
                                <div className="bg-white border border-[#dddbd5] rounded-[10px] p-8 shadow-sm animate-in slide-in-from-top-4 duration-500">
                                    <div className="text-[10px] font-['DM_Mono',monospace] font-bold text-[#2d5be3] uppercase tracking-[0.2em] mb-4">Question 03</div>
                                    <p className="text-[15px] font-bold text-[#1a1a2e] mb-6 leading-relaxed">
                                        你想知道一大群人（例如全校幾百人）的普遍態度、選擇偏好的「比例分佈」，或是變數間的「相關性」嗎？
                                    </p>
                                    <div className="flex gap-4">
                                        <button
                                            onClick={() => setMethodAnswers({ causeEffect: 'no', deepWhy: 'no', broadStats: 'yes' })}
                                            className={`px-6 py-2.5 rounded-[4px] text-[13px] font-bold border transition-all ${methodAnswers.broadStats === 'yes' ? 'bg-[#1a1a2e] text-white border-[#1a1a2e]' : 'bg-white text-[#4a4a6a] border-[#dddbd5] hover:border-[#1a1a2e]'}`}
                                        >
                                            ✓ 是，我想掌握整體趨勢
                                        </button>
                                        <button
                                            onClick={() => setMethodAnswers({ causeEffect: 'no', deepWhy: 'no', broadStats: 'no' })}
                                            className={`px-6 py-2.5 rounded-[4px] text-[13px] font-bold border transition-all ${methodAnswers.broadStats === 'no' ? 'bg-[#1a1a2e] text-white border-[#1a1a2e]' : 'bg-white text-[#4a4a6a] border-[#dddbd5] hover:border-[#1a1a2e]'}`}
                                        >
                                            ✗ 否，我不打算發放問卷
                                        </button>
                                    </div>
                                </div>
                            )}

                            {methodAnswers.broadStats === 'yes' && <ResultCard method="survey" />}

                            {/* Q4 */}
                            {methodAnswers.broadStats === 'no' && (
                                <div className="bg-white border border-[#dddbd5] rounded-[10px] p-8 shadow-sm animate-in slide-in-from-top-4 duration-500">
                                    <div className="text-[10px] font-['DM_Mono',monospace] font-bold text-[#2d5be3] uppercase tracking-[0.2em] mb-4">Question 04</div>
                                    <p className="text-[15px] font-bold text-[#1a1a2e] mb-6 leading-relaxed">
                                        那麼，你是否想在不打擾對象的情況下，記錄他們在自然狀態下的「真實行為表現」？
                                    </p>
                                    <div className="flex gap-4">
                                        <button
                                            onClick={() => setMethodAnswers({ causeEffect: 'no', deepWhy: 'no', broadStats: 'no', naturalBehavior: 'yes' })}
                                            className={`px-6 py-2.5 rounded-[4px] text-[13px] font-bold border transition-all ${methodAnswers.naturalBehavior === 'yes' ? 'bg-[#1a1a2e] text-white border-[#1a1a2e]' : 'bg-white text-[#4a4a6a] border-[#dddbd5] hover:border-[#1a1a2e]'}`}
                                        >
                                            ✓ 是，我想做現場觀察
                                        </button>
                                        <button
                                            onClick={() => setMethodAnswers({ causeEffect: 'no', deepWhy: 'no', broadStats: 'no', naturalBehavior: 'no' })}
                                            className={`px-6 py-2.5 rounded-[4px] text-[13px] font-bold border transition-all ${methodAnswers.naturalBehavior === 'no' ? 'bg-[#1a1a2e] text-white border-[#1a1a2e]' : 'bg-white text-[#4a4a6a] border-[#dddbd5] hover:border-[#1a1a2e]'}`}
                                        >
                                            ✗ 否，以上皆不需要
                                        </button>
                                    </div>
                                </div>
                            )}

                            {methodAnswers.naturalBehavior === 'yes' && <ResultCard method="observation" />}
                            {methodAnswers.naturalBehavior === 'no' && <ResultCard method="literature" />}
                        </div>
                    </div>
                )}
            </div>

            {/* AI 句型優化器 */}
            {isTerminal() && refinedTopic && (
                <section className="bg-white border border-[#dddbd5] rounded-[10px] p-10 space-y-8 animate-in slide-in-from-bottom-6 duration-700">
                    <div className="flex items-baseline gap-3">
                        <h2 className="font-['Noto_Serif_TC',serif] text-[22px] font-bold text-[#1a1a2e]">
                            🤖 最後一步｜AI 句型優化器
                        </h2>
                    </div>
                    <p className="text-[#4a4a6a] text-[14px] leading-relaxed">
                        題目通過健檢、方法也確定了！現在請 AI 幫你把題目包裝成更專業的學術版本。記住：AI 給你選項，決定權在你。
                    </p>

                    <div className="space-y-8 max-w-[700px]">
                        <div className="space-y-4">
                            <label className="font-bold text-[#1a1a2e] text-[14px] block flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#1a1a2e]"></span> Step 1 / 寫下題目初稿
                            </label>
                            <textarea
                                className="w-full border border-[#dddbd5] rounded-[6px] p-5 text-[14px] focus:outline-none focus:border-[#2d5be3] min-h-[80px] bg-[#f8f7f4]"
                                placeholder={`參考「${refinedTopic}」試著寫出初步的研究題目...`}
                                value={methodAnswers._draft || ''}
                                onChange={e => setMethodAnswers(prev => ({ ...prev, _draft: e.target.value }))}
                            />
                        </div>

                        {methodAnswers._draft && (
                            <div className="animate-in fade-in duration-300">
                                <label className="font-bold text-[#1a1a2e] text-[14px] block mb-3 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#2d5be3]"></span> Step 2 / 複製 Prompt 給 AI
                                </label>
                                <div className="bg-[#f0ede6] p-6 rounded-[8px] border border-[#dddbd5]">
                                    <PromptBox variant="paper">{`我的研究題目初稿是：${methodAnswers._draft}\n\n請幫我優化成更專業的版本：\n1. 加上學術學術關鍵字（如：相關性、差異分析、影響、探討）\n2. 讓 Who（研究對象）、What（研究焦點）更具體\n3. 保持在 30 字以內，確保高中生做得到\n請給我 3 個優化版本（A/B/C），並簡單說明改動重點。`}</PromptBox>
                                </div>
                            </div>
                        )}

                        <div className="pt-8 border-t border-[#f0ede6]">
                            <label className="font-bold text-[#1a1a2e] text-[14px] block mb-4 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#2e7d5a]"></span> Step 3 / 我的最終定案
                            </label>
                            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-4">
                                {['初稿', '優化 A', '優化 B', '優化 C', '手動調整'].map(opt => (
                                    <button
                                        key={opt}
                                        onClick={() => setMethodAnswers(prev => ({ ...prev, _choice: opt }))}
                                        className={`py-2 px-1 rounded-md border text-[11px] font-bold transition-all ${methodAnswers._choice === opt ? 'bg-[#1a1a2e] border-[#1a1a2e] text-white' : 'bg-white border-[#dddbd5] text-[#4a4a6a] hover:border-[#1a1a2e]'}`}
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>
                            <textarea
                                className="w-full border-2 border-[#1a1a2e] bg-white rounded-[6px] p-5 font-bold text-[#1a1a2e] text-[15px] focus:outline-none min-h-[90px] leading-relaxed"
                                placeholder="🎯 W3 最終定案題目寫在這裡..."
                                value={methodAnswers._final || ''}
                                onChange={e => setMethodAnswers(prev => ({ ...prev, _final: e.target.value }))}
                            />
                            {methodAnswers._final && (
                                <div className="mt-6 bg-[#1a1a2e] text-white rounded-[8px] p-6 text-center animate-in zoom-in-95 duration-500 shadow-xl">
                                    <div className="text-[#2d5be3] text-[9px] font-['DM_Mono',monospace] tracking-[0.2em] uppercase mb-2">Final Goal achieved</div>
                                    <p className="text-[20px] font-bold font-['Noto_Serif_TC',serif] leading-tight">「{methodAnswers._final}」</p>
                                    <p className="text-white/40 text-[11px] mt-4">這是你 W4 Gallery Walk 的正式參賽畫作！</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Navigation Out */}
                    <div className="flex justify-end pt-12 items-center border-t border-[#f0ede6]">
                        <Link to="/w4" className="bg-[#1a1a2e] text-white px-8 py-3 rounded-[6px] text-[14px] font-bold hover:bg-[#2a2a4a] transition-all flex items-center gap-2 group">
                            前進 W4 題目博覽會 <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </section>
            )}

            {/* Back to W2 */}
            {step === 1 && (
                <div className="flex justify-start">
                    <Link to="/problem-focus" className="text-[13px] font-bold text-[#8888aa] hover:text-[#1a1a2e] flex items-center gap-2">
                        ← 回 W2 問題意識
                    </Link>
                </div>
            )}

        </div>
    );
};
