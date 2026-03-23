import React, { useState, useEffect } from 'react';
import { patientData } from '../../data/patientData';

// 八個病（主診斷，單選）
const DIAGNOSIS_OPTIONS = [
    { id: 'A', icon: '🌫️', title: 'A｜抽象哲學病', subtitle: '概念太抽象，無法直接測量' },
    { id: 'B', icon: '🔮', title: 'B｜算命占卜病', subtitle: '在猜未來，現在無法驗證' },
    { id: 'C', icon: '📚', title: 'C｜百科全書病', subtitle: '範圍太大，像在搬運資料' },
    { id: 'D', icon: '⚖️', title: 'D｜主觀偏見病', subtitle: '題目裡偷偷放了自己的答案' },
    { id: 'E', icon: '⭕', title: 'E｜是非廢話病', subtitle: '只能回答有或沒有，研究會立刻結束' },
    { id: 'F', icon: '👻', title: 'F｜觀落陰病', subtitle: '研究對象接觸不到' },
    { id: 'G', icon: '🧪', title: 'G｜方法無效病', subtitle: '沒有可行方法蒐集資料或驗證' },
    { id: 'H', icon: '🌀', title: 'H｜變因失控病', subtitle: '影響因素太多，無法控制' }
];

// 四個處方（多選）
const CURE_OPTIONS = [
    { id: '小', icon: '💊', title: '[縮小藥丸] 大 → 小', subtitle: '聚焦特定對象/地點' },
    { id: '實', icon: '💉', title: '[具體疫苗] 空 → 實', subtitle: '轉為量化分數/時數/明確描述' },
    { id: '近', icon: '🚪', title: '[任意門探測儀] 遠 → 近', subtitle: '拉回現在/身邊/找得到的人' },
    { id: '易', icon: '🔪', title: '[降維手術刀] 難 → 易', subtitle: '改為可操作、可觀察、可蒐集資料' }
];

const severityStyles = {
    mild: { bg: "bg-green-50", border: "border-green-200", label: "輕症", color: "text-green-700", icon: "🟢" },
    moderate: { bg: "bg-amber-50", border: "border-amber-200", label: "中度", color: "text-amber-700", icon: "🟡" },
    severe: { bg: "bg-red-50", border: "border-red-200", label: "重症", color: "text-red-700", icon: "🔴" },
    boss: { bg: "bg-purple-50", border: "border-purple-200", label: "☠️ 多重器官衰竭", color: "text-purple-700", icon: "☠️" }
};

const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
};

const arraysEqual = (a, b) => {
    if (a.length !== b.length) return false;
    const sortedA = [...a].sort();
    const sortedB = [...b].sort();
    return sortedA.every((val, index) => val === sortedB[index]);
};

// ─── 示範題資料 ───────────────────────────────────────────
const DEMO_STEPS = [
    {
        phase: 'question',
        content: '2030 年最熱門的工作會是什麼？',
        note: '這是一道生病的研究題目。先不急著選答案，我們一起走一遍診斷流程。'
    },
    {
        phase: 'think1',
        content: '🔍 第一步：先看「能不能研究」',
        note: '這題在問「未來」——現在根本還沒發生，也沒有資料可以驗證。\n不管你用什麼方法，都碰不到2030年的資料。'
    },
    {
        phase: 'think2',
        content: '💡 所以優先病灶是？',
        note: '「2030年最熱門的工作」是在猜未來，現在無法驗證。\n→ 優先病灶：B｜算命占卜病\n\n你也可以說它「範圍太大（C）」，但那是共病。\n如果不先處理B，題目根本連資料都蒐集不到——所以先救B。'
    },
    {
        phase: 'think3',
        content: '💊 下藥：把它救活',
        note: '處方一：近（拉回現在，換成「目前」或「最近幾年」）\n\n治癒範例：\n「近五年台灣薪資成長最快的職業類別是哪些？」\n→ 有資料、找得到、高中生做得到 ✅'
    },
    {
        phase: 'key',
        content: '🎯 這關最重要的一句話',
        note: '你不是在找「也有道理的病」，\n而是在找「如果不先處理，整題就做不下去」的那個病。\n\n這就是優先搶救點。'
    }
];

export const QuestionERGame = () => {
    const [gameState, setGameState] = useState('start');
    const [demoStep, setDemoStep] = useState(0);
    const [playingPhase, setPlayingPhase] = useState('diagnosis');
    const [playerName, setPlayerName] = useState('');
    const [patients, setPatients] = useState([]);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [score, setScore] = useState(0);

    const [selectedDiagnosis, setSelectedDiagnosis] = useState(null);
    const [selectedCures, setSelectedCures] = useState([]);

    const [wrongCases, setWrongCases] = useState([]);
    const [timer, setTimer] = useState(0);

    const [currentQuestionPts, setCurrentQuestionPts] = useState(10);
    const [hintUsed, setHintUsed] = useState(false);
    const [showLightHint, setShowLightHint] = useState(false);
    const [showRxHint, setShowRxHint] = useState(false);
    const [partialFeedback, setPartialFeedback] = useState(null);
    const [selectedHealedOption, setSelectedHealedOption] = useState(null);

    useEffect(() => {
        const savedName = localStorage.getItem('rib_agent_name');
        if (savedName) setPlayerName(savedName);

        let interval;
        if (gameState === 'playing') {
            interval = setInterval(() => setTimer(t => t + 1), 1000);
        }
        return () => clearInterval(interval);
    }, [gameState]);

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const startGame = () => {
        const greens = shuffleArray(patientData.filter(p => p.id >= 1 && p.id <= 10)).slice(0, 2);
        const yellows = shuffleArray(patientData.filter(p => p.id >= 11 && p.id <= 20)).slice(0, 2);
        const reds = shuffleArray(patientData.filter(p => p.id >= 21 && p.id <= 30)).slice(0, 1);

        const selectedPatients = shuffleArray([...greens, ...yellows, ...reds]);

        const preparedPatients = selectedPatients.map(p => ({
            ...p,
            shuffledHealedOptions: shuffleArray(p.healedOptions)
        }));

        setPatients(preparedPatients);
        setWrongCases([]);
        setCurrentIdx(0);
        setScore(0);
        resetQuestionState();
        setTimer(0);
        setGameState('playing');
    };

    const resetQuestionState = () => {
        setSelectedDiagnosis(null);
        setSelectedCures([]);
        setCurrentQuestionPts(10);
        setHintUsed(false);
        setShowLightHint(false);
        setShowRxHint(false);
        setPartialFeedback(null);
        setSelectedHealedOption(null);
        setPlayingPhase('diagnosis');
    };

    const selectDiagnosis = (id) => {
        if (playingPhase !== 'diagnosis') return;
        setSelectedDiagnosis(id);
    };

    const toggleCure = (id) => {
        if (playingPhase !== 'prescription') return;
        setSelectedCures(prev =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    const handleMistake = (errorMsg) => {
        setPartialFeedback({
            type: 'error',
            title: '⚠️ 醫療事故！',
            message: errorMsg
        });

        setCurrentQuestionPts(0);
        if (!wrongCases.find(c => c.id === patients[currentIdx].id)) {
            setWrongCases(prev => [...prev, patients[currentIdx]]);
        }
    };

    const submitDiagnosis = () => {
        const current = patients[currentIdx];

        if (selectedDiagnosis === current.priorityDiagnosisKey) {
            setPlayingPhase('prescription');
            setPartialFeedback(null);
            return;
        }

        if (current.acceptableDiagnosisKeys?.includes(selectedDiagnosis)) {
            const selectedMeta = DIAGNOSIS_OPTIONS.find(d => d.id === selectedDiagnosis);
            const priorityMeta = DIAGNOSIS_OPTIONS.find(d => d.id === current.priorityDiagnosisKey);
            setPartialFeedback({
                type: 'warning',
                title: '🩺 抓到共病，但還不是優先搶救點',
                message:
                    `你抓到的「${selectedMeta?.title || selectedDiagnosis}」也是這題常見的共病之一，` +
                    `但本關更優先需要處理的是「${priorityMeta?.title || current.priorityDiagnosisKey}」。\n` +
                    `再想想：如果只能先救一刀，哪個問題不先處理，題目就根本做不下去？`,
                reason: current.priorityReason
            });
            setCurrentQuestionPts(pts => Math.max(0, pts - 2));
            return;
        }

        handleMistake("這個病灶和題目的核心卡點不太一致。先回頭想：這題現在最大的問題，是不能研究、範圍太大、概念太抽象，還是問法本身有偏？");
    };

    const submitPrescription = () => {
        const current = patients[currentIdx];
        if (arraysEqual(selectedCures, current.cures)) {
            setPlayingPhase('healedSelection');
            setPartialFeedback(null);
        } else {
            const needsCombo = current.cures.length > 1;
            let hintMsg = "這張處方還不夠完整！請重新想想：這題要從大→小、空→實、遠→近、難→易中的哪幾刀一起下去。";
            if (needsCombo) {
                hintMsg = "注意！主病灶只有一個，但急救方式常常不只一種。這題需要組合處方，請把所有需要的處方都選出來。";
            }
            handleMistake(hintMsg);
        }
    };

    const submitHealedSelection = (option) => {
        const current = patients[currentIdx];

        if (option.isCorrect) {
            setSelectedHealedOption(option);
            setPlayingPhase('healed');
            setScore(s => s + currentQuestionPts);

            const otherCorrect = current.shuffledHealedOptions.find(
                o => o.isCorrect && o.text !== option.text
            );

            setPartialFeedback({
                type: 'success',
                title: '💚 完美治癒',
                message: option.feedback,
                altMessage: otherCorrect ? `💡 另一條路也走得通：${otherCorrect.text}` : null,
                pts: currentQuestionPts
            });
        } else {
            handleMistake(option.feedback);
        }
    };

    const nextPatient = () => {
        if (currentIdx < patients.length - 1) {
            setCurrentIdx(i => i + 1);
            resetQuestionState();
        } else {
            localStorage.setItem('rib_score_question-er', JSON.stringify({score: score, maxScore: patients.length * 10, date: new Date().toISOString().split('T')[0]}));
            localStorage.setItem('rib_completed_question-er', 'true');
            setGameState('end');
        }
    };

    const useHint = () => {
        setHintUsed(true);
        setCurrentQuestionPts(Math.max(0, currentQuestionPts - 3));
    };

    const current = patients[currentIdx];
    const maxScore = patients.length * 10;
    const scoreRatio = maxScore > 0 ? (score / maxScore) : 0;

    const currentDiagnosisMeta = current
        ? DIAGNOSIS_OPTIONS.find(opt => opt.id === current.priorityDiagnosisKey)
        : null;

    // ================= START SCREEN =================
    if (gameState === 'start') {
        return (
            <div className="relative rounded-sm overflow-hidden flex flex-col items-center justify-center p-6 md:py-16 font-sans text-rose-50 min-h-[700px] bg-cover bg-fixed bg-center shadow-2xl"
                style={{ backgroundImage: "url('/images/question_er_bg.png')" }}>
                <div className="absolute inset-0 bg-[#0f172a]/85 z-0"></div>

                <div className="bg-[#1e293b]/70 backdrop-blur-lg p-8 md:p-12 rounded-sm shadow-[0_0_40px_rgba(45,212,191,0.15)] max-w-xl w-full text-center border border-white/5 border-t-[8px] border-t-teal-500 relative overflow-hidden z-10">
                    <div className="absolute top-0 right-0 opacity-[0.03] text-9xl -mt-4 -mr-4 text-teal-400">🏥</div>
                    <div className="text-7xl mb-6 animate-pulse drop-shadow-[0_0_15px_rgba(45,212,191,0.5)]">🩺</div>
                    <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-cyan-500 mb-2 tracking-wide">行動代號：靶心</h1>
                    <div className="text-sm md:text-base font-bold text-teal-300/80 mb-6 bg-teal-950/40 inline-block px-4 py-1.5 rounded-sm border border-teal-500/20 tracking-widest">
                        賽博法醫診斷室
                    </div>

                    {/* 核心概念區 */}
                    <div className="bg-teal-950/40 border border-teal-500/30 rounded-sm p-5 mb-4 text-left">
                        <div className="text-xs font-black tracking-widest text-teal-400 mb-3 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 inline-block"></span>
                            進場前須知：三件事
                        </div>
                        <div className="space-y-2.5 text-sm">
                            <p className="text-teal-100 font-bold leading-snug">
                                ① 一題可能多病，但先抓<span className="text-teal-300">優先搶救點</span>
                            </p>
                            <p className="text-teal-100 font-bold leading-snug">
                                ② 先看能不能研究，再看有沒有落地，再看問法有沒有偏
                            </p>
                            <p className="text-teal-100 font-bold leading-snug">
                                ③ 不要選看起來最厲害的題目，要選<span className="text-cyan-300">真的做得到的</span>
                            </p>
                        </div>
                    </div>

                    {/* 判斷順序小抄 */}
                    <div className="bg-slate-800/60 border border-slate-600/50 rounded-sm p-4 mb-4 text-left">
                        <div className="text-xs font-black tracking-widest text-slate-400 mb-3">⚡ 優先判斷順序</div>
                        <div className="space-y-1.5 text-xs font-semibold">
                            <div className="flex items-center gap-2">
                                <span className="bg-rose-900/60 text-rose-300 border border-rose-500/30 px-2 py-0.5 rounded text-[10px] font-black tracking-wider whitespace-nowrap">第一關</span>
                                <span className="text-slate-300">先看能不能研究：B算命、F觀落陰、G方法無效</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="bg-amber-900/60 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded text-[10px] font-black tracking-wider whitespace-nowrap">第二關</span>
                                <span className="text-slate-300">再看有沒有落地：C百科全書、A抽象哲學</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="bg-cyan-900/60 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 rounded text-[10px] font-black tracking-wider whitespace-nowrap">第三關</span>
                                <span className="text-slate-300">再看問法有沒有偏：E是非廢話、D主觀偏見</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="bg-purple-900/60 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded text-[10px] font-black tracking-wider whitespace-nowrap">最後才</span>
                                <span className="text-slate-300">H變因失控（高階重症，先把前三關排除）</span>
                            </div>
                        </div>
                    </div>

                    {/* 身分 + 按鈕 */}
                    <div className="bg-slate-800/50 rounded-sm p-4 mb-6 text-center border border-slate-600/50 shadow-inner">
                        <label className="block text-sm font-bold text-teal-300 mb-2 tracking-wider">👨‍⚕️ 目前登入身分</label>
                        {playerName ? (
                            <div className="text-2xl font-black text-teal-400 border-b-2 border-teal-500/50 inline-block pb-1 px-4">
                                {playerName} 醫師
                            </div>
                        ) : (
                            <div className="text-rose-400 font-bold text-sm">無法辨識身分！請返回總部大廳完成報到手續。</div>
                        )}
                    </div>

                    <div className="flex flex-col gap-3">
                        <button
                            onClick={() => { setDemoStep(0); setGameState('demo'); }}
                            className="font-bold py-3 px-8 rounded-sm text-sm tracking-widest transition-all duration-300 border border-teal-500/40 bg-teal-950/50 text-teal-300 hover:bg-teal-900/60 hover:text-teal-100 flex items-center justify-center gap-2"
                        >
                            🔬 先看示範題（建議新手）
                        </button>
                        <button
                            onClick={startGame}
                            disabled={!playerName}
                            className={`font-black py-4 px-10 rounded-sm text-lg tracking-widest transition-all duration-300 transform flex items-center justify-center gap-2 mx-auto ${!playerName ? 'bg-slate-700 text-slate-500 cursor-not-allowed' : 'bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white hover:scale-105 active:scale-95 border border-teal-400/50'}`}
                        >
                            <span>穿上白袍，開始值班</span>
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // ================= DEMO SCREEN =================
    if (gameState === 'demo') {
        const step = DEMO_STEPS[demoStep];
        const isLast = demoStep === DEMO_STEPS.length - 1;

        return (
            <div className="relative rounded-sm overflow-hidden flex flex-col items-center justify-center p-6 md:py-16 font-sans text-rose-50 min-h-[700px] bg-cover bg-fixed bg-center shadow-2xl"
                style={{ backgroundImage: "url('/images/question_er_bg.png')" }}>
                <div className="absolute inset-0 bg-[#0f172a]/90 z-0"></div>

                <div className="bg-[#1e293b]/80 backdrop-blur-lg p-8 md:p-12 rounded-sm shadow-[0_0_40px_rgba(45,212,191,0.15)] max-w-xl w-full border border-white/5 border-t-[8px] border-t-amber-500 relative z-10">
                    <div className="text-xs font-black tracking-widest text-amber-400 mb-2 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block animate-pulse"></span>
                        示範題演練 — {demoStep + 1} / {DEMO_STEPS.length}
                    </div>

                    {/* 進度條 */}
                    <div className="w-full bg-slate-700/50 rounded-full h-1.5 mb-8">
                        <div
                            className="bg-amber-400 h-1.5 rounded-full transition-all duration-500"
                            style={{ width: `${((demoStep + 1) / DEMO_STEPS.length) * 100}%` }}
                        ></div>
                    </div>

                    {step.phase === 'question' && (
                        <div className="text-center">
                            <div className="text-3xl mb-4">🤔</div>
                            <div className="bg-rose-950/40 border border-rose-500/30 rounded-sm p-6 mb-6">
                                <div className="text-xs font-bold text-rose-400 tracking-widest mb-2">這道題目生病了</div>
                                <p className="text-2xl font-black text-rose-100 leading-snug">{step.content}</p>
                            </div>
                            <p className="text-slate-300 text-sm leading-relaxed">{step.note}</p>
                        </div>
                    )}

                    {step.phase === 'think1' && (
                        <div>
                            <div className="text-2xl font-black text-amber-300 mb-4">{step.content}</div>
                            <div className="bg-slate-800/60 border border-amber-500/20 rounded-sm p-5">
                                <p className="text-slate-200 text-base leading-relaxed whitespace-pre-line">{step.note}</p>
                            </div>
                            <div className="mt-4 bg-rose-950/30 border border-rose-500/20 rounded-sm p-4">
                                <div className="text-xs font-bold text-rose-400 mb-2 tracking-wider">順序提醒</div>
                                <p className="text-sm text-slate-300">先問：<span className="text-rose-300 font-bold">這題現在能不能研究？</span><br/>不能研究的病要先處理，才能繼續討論「題目夠不夠具體」。</p>
                            </div>
                        </div>
                    )}

                    {step.phase === 'think2' && (
                        <div>
                            <div className="text-2xl font-black text-amber-300 mb-4">{step.content}</div>
                            <div className="bg-teal-950/40 border border-teal-500/30 rounded-sm p-5">
                                <p className="text-teal-100 text-sm leading-relaxed whitespace-pre-line font-medium">{step.note}</p>
                            </div>
                            <div className="mt-4 bg-amber-950/30 border border-amber-500/20 rounded-sm p-4">
                                <p className="text-xs text-amber-200/80 font-bold">💡 關鍵句</p>
                                <p className="text-sm text-amber-100 mt-1 leading-relaxed">你不是在找「也有道理的病」，而是找「如果不先處理，題目就做不下去」的那個。</p>
                            </div>
                        </div>
                    )}

                    {step.phase === 'think3' && (
                        <div>
                            <div className="text-2xl font-black text-cyan-300 mb-4">{step.content}</div>
                            <div className="bg-cyan-950/40 border border-cyan-500/30 rounded-sm p-5 space-y-3">
                                <p className="text-cyan-100 text-sm leading-relaxed whitespace-pre-line font-medium">{step.note}</p>
                            </div>
                            <div className="mt-4 bg-slate-800/60 border border-slate-600/50 rounded-sm p-4">
                                <p className="text-xs text-slate-400 font-bold tracking-wider mb-2">出院標準（選改題版本時用）</p>
                                <div className="flex gap-3 flex-wrap">
                                    <span className="text-xs bg-slate-700/60 border border-slate-600 px-3 py-1 rounded text-slate-200 font-bold">📦 小：有縮小嗎？</span>
                                    <span className="text-xs bg-slate-700/60 border border-slate-600 px-3 py-1 rounded text-slate-200 font-bold">🔬 實：能測量嗎？</span>
                                    <span className="text-xs bg-slate-700/60 border border-slate-600 px-3 py-1 rounded text-slate-200 font-bold">🚪 近：碰得到嗎？</span>
                                    <span className="text-xs bg-slate-700/60 border border-slate-600 px-3 py-1 rounded text-slate-200 font-bold">✂️ 易：兩週做得到嗎？</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {step.phase === 'key' && (
                        <div className="text-center">
                            <div className="text-5xl mb-4">🎯</div>
                            <div className="text-2xl font-black text-teal-300 mb-6">{step.content}</div>
                            <div className="bg-teal-950/50 border border-teal-400/40 rounded-sm p-6">
                                <p className="text-teal-100 text-base leading-relaxed whitespace-pre-line font-bold">{step.note}</p>
                            </div>
                        </div>
                    )}

                    <div className="flex gap-3 mt-8">
                        {demoStep > 0 && (
                            <button
                                onClick={() => setDemoStep(s => s - 1)}
                                className="flex-1 bg-slate-800/80 hover:bg-slate-700 text-slate-300 font-bold py-3 px-4 rounded-sm transition-all border border-slate-600 text-sm"
                            >
                                ← 上一步
                            </button>
                        )}
                        {demoStep === 0 && (
                            <button
                                onClick={() => setGameState('start')}
                                className="bg-slate-800/80 hover:bg-slate-700 text-slate-400 font-bold py-3 px-4 rounded-sm transition-all border border-slate-600 text-sm"
                            >
                                返回
                            </button>
                        )}
                        {!isLast ? (
                            <button
                                onClick={() => setDemoStep(s => s + 1)}
                                className="flex-1 bg-amber-600 hover:bg-amber-500 text-white font-black py-3 px-6 rounded-sm transition-all text-sm tracking-wider"
                            >
                                下一步 →
                            </button>
                        ) : (
                            <button
                                onClick={startGame}
                                disabled={!playerName}
                                className={`flex-1 font-black py-3 px-6 rounded-sm text-sm tracking-wider transition-all ${!playerName ? 'bg-slate-700 text-slate-500 cursor-not-allowed' : 'bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white'}`}
                            >
                                🩺 我懂了，開始值班！
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // ================= END SCREEN =================
    if (gameState === 'end') {
        let title = "";
        let color = "";
        let bg = "";
        let borderColor = "";

        if (scoreRatio === 1) { title = "🏆 完美賽博神醫！"; color = "text-amber-400"; bg = "bg-amber-900/40"; borderColor = "border-amber-500/50"; }
        else if (scoreRatio >= 0.8) { title = "👨‍⚕️ 首席主治醫師！"; color = "text-teal-400"; bg = "bg-teal-900/40"; borderColor = "border-teal-500/50"; }
        else if (scoreRatio >= 0.6) { title = "🩺 資深住院醫師！"; color = "text-emerald-400"; bg = "bg-emerald-900/40"; borderColor = "border-emerald-500/50"; }
        else { title = "💊 實習生，多練練吧！"; color = "text-rose-400"; bg = "bg-rose-900/40"; borderColor = "border-rose-500/50"; }

        return (
            <div className="relative rounded-sm overflow-hidden flex flex-col items-center justify-center p-6 md:py-10 font-sans text-blue-50 min-h-[700px] bg-cover bg-fixed bg-center shadow-2xl"
                style={{ backgroundImage: "url('/images/question_er_bg.png')" }}>
                <div className="absolute inset-0 bg-[#0f172a]/90 backdrop-blur-sm z-0"></div>

                <div className="bg-[#1e293b]/70 backdrop-blur-lg p-8 md:p-12 rounded-sm shadow-[0_0_50px_rgba(0,0,0,0.5)] max-w-2xl w-full text-center border-t-[8px] border-t-teal-500 border-x border-b border-white/5 relative z-10">
                    <h2 className="text-2xl font-black text-amber-500 mb-4 tracking-widest">🎯 任務結案報告</h2>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
                        <div className="text-sm font-medium text-slate-400 bg-slate-800/60 px-4 py-1 rounded-sm border border-slate-600/50">
                            值班時間：{formatTime(timer)}
                        </div>
                        <div className="text-sm font-medium text-teal-300 bg-teal-900/40 px-4 py-1 rounded-sm border border-teal-500/30">
                            主治醫師：<span className="font-bold">{playerName}</span>
                        </div>
                    </div>

                    <div className="flex flex-col items-center justify-center mb-6">
                        <div className="text-7xl font-black text-teal-400 tracking-tighter mb-2">
                            {score} <span className="text-3xl text-slate-500 font-medium">/ {maxScore}</span>
                        </div>
                        <div className="text-sm text-slate-400 mb-3">完成度：{Math.round(scoreRatio * 100)}%</div>
                        <h2 className={`text-2xl md:text-3xl font-black px-6 py-2 rounded-sm ${color} ${bg} border ${borderColor} mb-4`}>
                            {title}
                        </h2>

                        <div className="flex gap-4 mt-6">
                            <div className="bg-emerald-900/40 border border-emerald-500/50 px-5 py-3 rounded-sm flex flex-col items-center">
                                <span className="text-emerald-400 font-black block text-2xl">{patients.length - wrongCases.length}</span>
                                <span className="text-xs text-emerald-200/60 font-medium tracking-wider mt-1">一針見血</span>
                            </div>
                            <div className="bg-rose-900/40 border border-rose-500/50 px-5 py-3 rounded-sm flex flex-col items-center">
                                <span className="text-rose-400 font-black block text-2xl">{wrongCases.length}</span>
                                <span className="text-xs text-rose-200/60 font-medium tracking-wider mt-1">醫療誤診</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3 justify-center mt-6 mb-8">
                        <button
                            onClick={() => setGameState('start')}
                            className="bg-slate-800/80 hover:bg-slate-700 text-teal-400 font-bold py-3 px-6 rounded-sm text-base transition-all duration-300 border border-teal-500/50 flex items-center gap-2"
                        >
                            重新開始 🔄
                        </button>
                    </div>

                    {wrongCases.length > 0 && (
                        <div className="text-left bg-[#0f172a]/90 p-6 md:p-8 rounded-sm border-l-[6px] border-rose-500 max-h-[400px] overflow-y-auto shadow-inner border-y border-r border-white/5">
                            <h3 className="text-xl font-black mb-6 flex items-center gap-2 text-rose-300 border-b border-slate-700 pb-4">
                                🚨 誤診檢討筆記
                            </h3>
                            <div className="space-y-5">
                                {wrongCases.map((wc, i) => {
                                    const wcDiagnosis = DIAGNOSIS_OPTIONS.find(d => d.id === (wc.priorityDiagnosisKey || wc.primaryDiagnosisKey));
                                    return (
                                        <div key={i} className="bg-slate-800/80 p-5 rounded-sm shadow-lg border border-slate-700 relative overflow-hidden">
                                            <div className="absolute top-0 left-0 w-1.5 h-full bg-rose-500 opacity-60"></div>
                                            <p className="font-bold text-rose-100 text-lg mb-2">🤕「{wc.question}」</p>
                                            <div className="mb-3 space-y-2 mt-4 text-sm">
                                                <p className="font-bold text-slate-400">
                                                    ✅ 優先病灶：
                                                    <span className="text-rose-300 ml-1">{wcDiagnosis?.title || wc.diagnosis}</span>
                                                </p>
                                                {wc.coDiagnosisKeys?.length > 0 && (
                                                    <p className="font-bold text-slate-400">
                                                        🧩 常見共病：
                                                        <span className="text-amber-300 ml-1">
                                                            {wc.coDiagnosisKeys.map(id => DIAGNOSIS_OPTIONS.find(d => d.id === id)?.title || id).join('、')}
                                                        </span>
                                                    </p>
                                                )}
                                                <p className="font-bold text-slate-400">
                                                    ✅ 需要處方：
                                                    <span className="text-teal-300 ml-1">{wc.cures.join("、")}</span>
                                                </p>
                                                {wc.priorityReason && (
                                                    <div className="mt-2 bg-amber-950/20 p-3 rounded border-l-2 border-amber-500/40">
                                                        <span className="text-xs font-bold text-amber-300">💡 本關優先搶救點：</span>
                                                        <p className="text-xs text-slate-400 mt-1 leading-relaxed">{wc.priorityReason}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    <div className="text-left bg-slate-800/80 p-6 md:p-8 rounded-sm shadow-inner mt-6 border border-slate-700/80">
                        <h3 className="text-xl font-black mb-4 flex items-center gap-2 text-teal-300 border-b border-slate-700 pb-3">
                            📸 任務完成回報
                        </h3>
                        <div className="space-y-4 text-sm text-slate-300">
                            <p className="leading-relaxed">
                                請截圖本次「任務結案報告」，上傳至 Google Classroom。<br/>
                                經指揮官驗證後，可依本次稱號獲得任務加分。
                            </p>
                            <div className="bg-slate-900/50 p-4 rounded-sm border border-slate-700/50">
                                <p className="font-bold text-slate-400 mb-2">加分標準：</p>
                                <ul className="space-y-1">
                                    <li><span className="text-emerald-400">🩺 資深住院醫師</span>：+1 分</li>
                                    <li><span className="text-teal-400">👨‍⚕️ 首席主治醫師</span>：+2 分</li>
                                    <li><span className="text-amber-400">🏆 完美賽博神醫</span>：+3 分</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="text-left bg-[#0f172a]/90 p-6 md:p-8 rounded-sm shadow-inner mt-6 border-l-[6px] border-cyan-500 border-y border-r border-white/5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 opacity-[0.03] text-8xl -mt-4 -mr-4 text-cyan-400">⚠️</div>
                        <h3 className="text-xl font-black mb-4 flex items-center gap-2 text-cyan-400 border-b border-slate-700 pb-3 relative z-10">
                            ⚠️ 醫療團隊提醒
                        </h3>
                        <div className="space-y-3 text-sm text-slate-300 leading-relaxed relative z-10">
                            <p>
                                遊戲裡的「<span className="text-amber-400 font-bold">優先病灶</span>」不是唯一真相，而是這一關設定的<span className="text-amber-400 font-bold">優先搶救點</span>。
                            </p>
                            <p>
                                本系統提供的是「<span className="text-rose-400 font-bold">初步診斷</span>」，幫助你先看出題目最需要優先處理的卡點。
                            </p>
                            <p>
                                但真實研究世界比急診室複雜：一個題目可能同時有多種問題，也可能有不只一條可行的修題路線。
                            </p>
                            <p className="text-cyan-200/90 font-bold mt-2 pt-2 border-t border-cyan-900/50">
                                所以，遊戲過關不代表研究就完成；真正的專題，還要回到你的研究目的、研究對象、研究方法與資料可得性來判斷。
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // ================= PLAYING SCREEN =================
    if (!current) return null;

    const sevType = current.severity || "mild";
    const sv = severityStyles[sevType];
    const hasComboCures = current.cures.length > 1;
    const otherCorrectOptions = current.shuffledHealedOptions.filter(o => o.isCorrect && o.text !== selectedHealedOption?.text);

    return (
        <div className="relative rounded-sm overflow-hidden flex flex-col items-center p-4 md:p-8 font-sans min-h-[700px] text-teal-50 bg-[#064e3b] bg-cover bg-fixed bg-center shadow-2xl"
            style={{ backgroundImage: "url('/images/question_er_bg.png')" }}>
            <div className="absolute inset-0 bg-[#0f172a]/85 backdrop-blur-sm z-0"></div>
            <div className="max-w-4xl w-full relative z-10 flex flex-col items-center text-center">

                <div className="flex w-full justify-between items-center gap-3 mb-8">
                    <div className="text-slate-300 font-bold text-sm tracking-widest flex items-center gap-2 uppercase">
                        <span>Case <span className="text-teal-400 text-lg">{currentIdx + 1}</span>_{patients.length}</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-[pulse_1s_ease-in-out_infinite]"></span>
                    </div>

                    <div className="text-emerald-400 font-bold px-4 py-1.5 rounded-full border border-emerald-500/30 font-mono tracking-widest flex items-center gap-2">
                        SCORE <span className="text-emerald-300 font-black text-xl">{score}</span>
                        {playingPhase !== 'healed' && (
                            <span className="ml-2 text-xs text-teal-200/50 block">+(本題最高 {currentQuestionPts})</span>
                        )}
                    </div>
                </div>

                <div className="w-full max-w-2xl bg-[#1e293b]/80 backdrop-blur-md p-8 md:p-12 rounded-sm shadow-[0_0_40px_rgba(0,0,0,0.4)] mb-8 border border-white/5 relative overflow-hidden">
                    {hasComboCures && (
                        <div className="absolute top-0 right-0 bg-rose-600/90 text-white text-[10px] font-black px-6 py-1 tracking-[0.2em] transform translate-x-[20px] translate-y-[15px] rotate-45">
                            ⚠️ COMBO CURE
                        </div>
                    )}

                    <div className="flex items-center justify-center gap-2 flex-wrap mb-6">
                        <span className={`px-4 py-1 rounded border shadow-inner inline-flex items-center gap-1.5 text-xs font-black tracking-widest bg-[#0f172a]/80 ${sv.border} ${sv.color}`}>
                            {sv.icon} {sv.label}
                        </span>

                        {hintUsed && (
                            <span className="text-amber-400 bg-amber-900/30 px-3 py-1 text-xs font-bold rounded-sm border border-amber-500/30 ml-2 flex items-center gap-1 shadow-inner">
                                <span className="opacity-80 animate-ping h-2 w-2 rounded-full bg-amber-400"></span>
                                已啟用檢查報告
                            </span>
                        )}
                    </div>

                    <svg className="absolute bottom-0 left-0 w-full h-16 opacity-10 text-teal-400 pointer-events-none" viewBox="0 0 100 20" preserveAspectRatio="none">
                        <polyline points="0,10 20,10 25,5 30,15 35,2 40,18 45,10 100,10" fill="none" stroke="currentColor" strokeWidth="0.5" />
                    </svg>

                    <div className="relative z-10 py-6 my-2">
                        {playingPhase === 'healed' ? (
                            <div className="animate-in zoom-in-95 duration-500">
                                <p className="text-sm font-bold text-teal-400 tracking-widest mb-3 uppercase">
                                    ✓ 治癒完成的健康題目
                                </p>
                                <p className="text-2xl md:text-3xl font-black text-teal-50 leading-snug">
                                    {selectedHealedOption?.text}
                                </p>
                            </div>
                        ) : (
                            <p className="text-2xl md:text-3xl font-black text-rose-100 leading-snug">
                                {current.question}
                            </p>
                        )}
                    </div>
                </div>

                {/* ── 免費分層提示（diagnosis 關） ── */}
                {playingPhase === 'diagnosis' && (
                    <div className="w-full max-w-2xl mb-4">
                        <button
                            onClick={() => setShowLightHint(v => !v)}
                            className="w-full bg-slate-800/40 hover:bg-slate-800/70 border border-dashed border-slate-600/70 text-slate-300 hover:text-teal-300 font-bold py-2.5 px-5 rounded-sm transition-all flex items-center justify-center gap-2 text-sm"
                        >
                            <span>💡</span>
                            {showLightHint ? '收起判斷方向提示' : '不確定怎麼判斷？點我看提示方向（免費）'}
                        </button>
                        {showLightHint && (
                            <div className="bg-slate-800/70 border border-slate-600/50 border-t-0 rounded-b-sm p-5 animate-in fade-in slide-in-from-top-2 duration-200 text-left space-y-3">
                                <div className="flex items-start gap-3">
                                    <span className="bg-rose-900/60 text-rose-300 border border-rose-500/30 px-2 py-0.5 rounded text-[10px] font-black tracking-wider whitespace-nowrap mt-0.5">提示 1</span>
                                    <p className="text-sm text-slate-300 leading-relaxed">先問自己：這題現在是「<span className="text-rose-300 font-bold">根本不能研究</span>」，還是「<span className="text-amber-300 font-bold">可以研究但還沒落地</span>」？</p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <span className="bg-amber-900/60 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded text-[10px] font-black tracking-wider whitespace-nowrap mt-0.5">提示 2</span>
                                    <p className="text-sm text-slate-300 leading-relaxed">如果題目在<span className="text-rose-300 font-bold">問未來、碰不到對象、無法驗證</span> → 優先病灶通常不是 C、A、D、E。</p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <span className="bg-cyan-900/60 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 rounded text-[10px] font-black tracking-wider whitespace-nowrap mt-0.5">提示 3</span>
                                    <p className="text-sm text-slate-300 leading-relaxed">如果題目只是<span className="text-amber-300 font-bold">太大太抽象</span>，先別急著選 <span className="text-purple-300 font-bold">H（變因失控）</span>。H 通常是排除前三類後才用的高階重症。</p>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* ── 申請完整病歷（-3分） ── */}
                {(!hintUsed && playingPhase === 'diagnosis') && (
                    <div className="bg-slate-800/40 border border-slate-600/50 border-dashed rounded-sm p-4 flex flex-col items-center justify-center gap-2 mb-6 relative z-10 mx-auto max-w-md shadow-inner w-full">
                        <button
                            onClick={useHint}
                            className="bg-slate-800/80 hover:bg-slate-700 text-amber-400 font-bold py-2 px-6 rounded-sm transition-all flex items-center justify-center gap-2 border border-slate-600 hover:border-amber-400/50 text-sm"
                        >
                            <span>🔍</span> 申請醫療顧問完整病歷 (-3 分)
                        </button>
                    </div>
                )}

                {hintUsed && playingPhase !== 'healed' && (
                    <div className="bg-slate-800/60 border-x border-b border-t-0 border-white/5 rounded-b-xl p-5 md:p-6 flex flex-col md:flex-row md:items-start justify-between gap-4 relative z-10 animate-in fade-in slide-in-from-top-4 duration-300 w-full max-w-2xl mb-6 shadow-inner -mt-10">
                        <div className="flex-1 space-y-2">
                            <span className="text-xs font-black tracking-widest text-slate-400 bg-slate-900/80 border border-slate-700 px-2 py-1 rounded inline-block">病徵標籤</span>
                            <div className="flex flex-wrap gap-2 text-left">
                                {current.tags.map(tag => (
                                    <span key={tag} className="bg-slate-700/50 text-rose-200 font-semibold px-3 py-1.5 rounded-sm text-sm border border-slate-600">
                                        <span className="opacity-50 text-rose-400">#</span>{tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="flex-1 space-y-2">
                            <span className="text-xs font-black tracking-widest text-rose-400 bg-rose-900/40 border border-rose-500/30 px-2 py-1 rounded inline-block">醫療團隊初步評估</span>
                            <div className="bg-rose-900/20 text-rose-300 px-4 py-3 rounded-sm border border-rose-500/30 text-left">
                                <span className="font-bold text-base leading-snug">{current.diagnosis}</span>
                            </div>
                        </div>
                    </div>
                )}

                {playingPhase === 'diagnosis' && (
                    <div className="w-full max-w-2xl animate-in fade-in slide-in-from-bottom-4">
                        <h3 className="text-slate-300 font-bold tracking-widest mb-2 flex items-center justify-center gap-2">
                            <span className="text-xl">1.</span> 第一階段：優先病灶判讀
                        </h3>
                        {/* 常駐一行提示 */}
                        <p className="text-teal-400/80 text-xs font-bold mb-5 tracking-wider">
                            ⚡ 先找優先搶救點，不是找唯一真相——如果不先處理它，整題就做不下去
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                            {DIAGNOSIS_OPTIONS.map(opt => {
                                const isSelected = selectedDiagnosis === opt.id;
                                return (
                                    <button
                                        key={opt.id}
                                        onClick={() => selectDiagnosis(opt.id)}
                                        className={`p-4 rounded-sm border text-left transition-all flex flex-col items-start gap-1 justify-center min-h-[100px] ${isSelected ? 'bg-teal-900/40 border-teal-400 shadow-[0_0_15px_rgba(45,212,191,0.3)]' : 'bg-slate-800/40 border-slate-700 hover:border-teal-400/50 hover:bg-slate-800/80'}`}
                                    >
                                        <div className={`font-bold text-lg ${isSelected ? 'text-teal-300' : 'text-slate-200'}`}>
                                            <span className="mr-2">{opt.icon}</span>{opt.title}
                                        </div>
                                        <div className={`text-sm font-medium ${isSelected ? 'text-teal-100/80' : 'text-slate-400'}`}>
                                            {opt.subtitle}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        <button
                            onClick={submitDiagnosis}
                            disabled={!selectedDiagnosis}
                            className={`w-full py-4 rounded-sm font-black tracking-widest text-lg transition-all ${selectedDiagnosis ? 'bg-slate-100 text-slate-900 hover:bg-teal-400 hover:text-slate-900 hover:shadow-[0_0_20px_rgba(45,212,191,0.5)]' : 'bg-slate-800/50 text-slate-500 cursor-not-allowed'}`}
                        >
                            確認優先病灶
                        </button>
                    </div>
                )}

                {playingPhase === 'prescription' && (
                    <div className="w-full max-w-2xl animate-in fade-in slide-in-from-bottom-4">
                        <h3 className="text-slate-300 font-bold tracking-widest mb-2 flex items-center justify-center gap-2">
                            <span className="text-xl">2.</span> 第二階段：組合處方
                        </h3>
                        {/* 常駐一行提示 */}
                        <p className="text-cyan-400/80 text-xs font-bold mb-4 tracking-wider">
                            ⚡ 一個題目常常不只下一味藥——想想要把它救活，除了主病灶，還需要哪幾步？
                        </p>

                        {/* 可展開的處方指南 */}
                        <button
                            onClick={() => setShowRxHint(v => !v)}
                            className="w-full bg-slate-800/40 hover:bg-slate-800/70 border border-dashed border-cyan-700/50 text-slate-300 hover:text-cyan-300 font-bold py-2 px-5 rounded-sm transition-all flex items-center justify-center gap-2 text-sm mb-4"
                        >
                            <span>💊</span>
                            {showRxHint ? '收起處方指南' : '不確定下哪幾味藥？點我看處方指南（免費）'}
                        </button>
                        {showRxHint && (
                            <div className="bg-slate-800/70 border border-cyan-700/40 rounded-sm p-5 animate-in fade-in duration-200 text-left space-y-2.5 mb-5">
                                <div className="text-xs font-black text-cyan-400 tracking-widest mb-3">常見病症對應處方</div>
                                <div className="flex items-start gap-2">
                                    <span className="text-cyan-400 mt-0.5 text-base">💊</span>
                                    <p className="text-sm text-slate-300 leading-relaxed"><span className="text-cyan-300 font-bold">題目太大：</span>先縮對象、縮場域、縮情境 → 通常用「小」</p>
                                </div>
                                <div className="flex items-start gap-2">
                                    <span className="text-cyan-400 mt-0.5 text-base">💉</span>
                                    <p className="text-sm text-slate-300 leading-relaxed"><span className="text-cyan-300 font-bold">題目太空：</span>把抽象詞換成可觀察的變項 → 通常用「實」</p>
                                </div>
                                <div className="flex items-start gap-2">
                                    <span className="text-cyan-400 mt-0.5 text-base">🚪</span>
                                    <p className="text-sm text-slate-300 leading-relaxed"><span className="text-cyan-300 font-bold">題目碰不到：</span>換對象、換場域、換資料來源 → 通常用「近」</p>
                                </div>
                                <div className="flex items-start gap-2">
                                    <span className="text-cyan-400 mt-0.5 text-base">🔪</span>
                                    <p className="text-sm text-slate-300 leading-relaxed"><span className="text-cyan-300 font-bold">是非問法/太難操作：</span>改為差異、關聯、頻率、情境 → 通常用「易」</p>
                                </div>
                                <div className="mt-1 pt-3 border-t border-cyan-900/50 text-xs text-cyan-200/60 font-bold">多數題目需要 Combo，選到對的組合就算對！</div>
                            </div>
                        )}

                        <div className="flex flex-wrap items-center justify-center gap-2 mb-6 opacity-80">
                            <span className="text-xs text-slate-400">已確認優先病灶：</span>
                            <span className="text-xs font-bold bg-slate-800 border border-slate-700 px-2 py-0.5 rounded text-rose-300">
                                {currentDiagnosisMeta?.title || current.diagnosis}
                            </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                            {CURE_OPTIONS.map(opt => {
                                const isSelected = selectedCures.includes(opt.id);
                                return (
                                    <button
                                        key={opt.id}
                                        onClick={() => toggleCure(opt.id)}
                                        className={`p-4 rounded-sm border text-left transition-all flex flex-col items-start gap-1 justify-center min-h-[100px] ${isSelected ? 'bg-cyan-900/60 border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.3)]' : 'bg-slate-800/40 border-slate-700 hover:border-cyan-400/50 hover:bg-slate-800/80'}`}
                                    >
                                        <div className={`font-bold text-lg ${isSelected ? 'text-cyan-300' : 'text-slate-200'}`}>
                                            <span className="mr-2">{opt.icon}</span>{opt.title}
                                        </div>
                                        <div className={`text-sm font-medium ${isSelected ? 'text-cyan-100/80' : 'text-slate-400'}`}>
                                            {opt.subtitle}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        <button
                            onClick={submitPrescription}
                            disabled={selectedCures.length === 0}
                            className={`w-full py-4 rounded-sm font-black tracking-widest text-lg transition-all ${selectedCures.length > 0 ? 'bg-cyan-400 text-slate-900 hover:bg-cyan-300 hover:shadow-[0_0_25px_rgba(34,211,238,0.6)]' : 'bg-slate-800/50 text-slate-500 cursor-not-allowed'}`}
                        >
                            開立處方
                        </button>
                    </div>
                )}

                {playingPhase === 'healedSelection' && (
                    <div className="w-full max-w-2xl animate-in fade-in slide-in-from-bottom-4">
                        <h3 className="text-slate-300 font-bold tracking-widest mb-2 flex items-center justify-center gap-2">
                            <span className="text-xl">3.</span> 最終階段：驗收治癒結果
                        </h3>
                        <p className="text-slate-400 text-sm mb-4">
                            處方已生效！選出真正治癒後的好題目。某些題目不只一條路能救活，選到任一可行路徑都算正確。
                        </p>

                        {/* 出院標準小抄 */}
                        <div className="bg-slate-800/50 border border-slate-600/50 rounded-sm p-3 mb-5">
                            <div className="text-xs font-black text-slate-400 tracking-widest mb-2">📋 出院標準——不要選「最厲害」的，要選「真的做得到」的</div>
                            <div className="flex gap-2 flex-wrap">
                                <span className="text-xs bg-slate-700/60 border border-slate-600 px-3 py-1.5 rounded text-slate-200 font-bold flex items-center gap-1">📦 小<span className="text-slate-400 font-normal">範圍縮小了嗎？</span></span>
                                <span className="text-xs bg-slate-700/60 border border-slate-600 px-3 py-1.5 rounded text-slate-200 font-bold flex items-center gap-1">🔬 實<span className="text-slate-400 font-normal">能觀察測量嗎？</span></span>
                                <span className="text-xs bg-slate-700/60 border border-slate-600 px-3 py-1.5 rounded text-slate-200 font-bold flex items-center gap-1">🚪 近<span className="text-slate-400 font-normal">對象碰得到嗎？</span></span>
                                <span className="text-xs bg-slate-700/60 border border-slate-600 px-3 py-1.5 rounded text-slate-200 font-bold flex items-center gap-1">✂️ 易<span className="text-slate-400 font-normal">兩週內做得到嗎？</span></span>
                            </div>
                            <p className="text-xs text-amber-300/70 mt-2 font-bold">⚠️ 如果一題只是看起來比較學術，但更難做，還不算真正治好。</p>
                        </div>

                        <div className="flex flex-col gap-4 mb-6">
                            {current.shuffledHealedOptions.map((opt, i) => (
                                <button
                                    key={i}
                                    onClick={() => submitHealedSelection(opt)}
                                    className="p-5 rounded-sm border bg-slate-800/60 border-slate-600 text-slate-200 hover:border-teal-400 hover:bg-teal-900/20 text-left transition-all hover:shadow-[0_0_15px_rgba(45,212,191,0.2)]"
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="text-lg leading-snug font-bold">
                                            <span className="text-teal-400 mr-2 text-sm">▶</span>
                                            {opt.text}
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {partialFeedback && playingPhase !== 'healed' && (
                    <div className="w-full max-w-2xl mt-6">
                        {partialFeedback.type === 'warning' ? (
                            <div className="bg-amber-950/80 border border-amber-500/50 p-5 rounded-sm flex items-start gap-4 shadow-[0_0_20px_rgba(245,158,11,0.25)]">
                                <div className="text-3xl shrink-0">🩺</div>
                                <div className="text-left space-y-2">
                                    <h4 className="font-bold text-amber-400 text-lg">{partialFeedback.title}</h4>
                                    <p className="text-sm text-amber-200 font-medium leading-relaxed whitespace-pre-line">{partialFeedback.message}</p>
                                    {partialFeedback.reason && (
                                        <div className="mt-2 pt-2 border-t border-amber-500/30">
                                            <span className="text-xs font-bold text-amber-300">💡 本關優先搶救點：</span>
                                            <p className="text-xs text-amber-200/80 mt-1 leading-relaxed">{partialFeedback.reason}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="bg-rose-950/80 border border-rose-500/50 p-5 rounded-sm flex items-start gap-4 animate-[shake_0.5s] shadow-[0_0_20px_rgba(244,63,94,0.3)]">
                                <div className="text-3xl shrink-0">🚨</div>
                                <div className="text-left">
                                    <h4 className="font-bold text-rose-400 text-lg mb-1">{partialFeedback.title}</h4>
                                    <p className="text-sm text-rose-200 font-medium leading-loose">{partialFeedback.message}</p>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {playingPhase === 'healed' && (
                    <div className="w-full max-w-2xl animate-in fade-in slide-in-from-bottom-4">
                        <div className="bg-emerald-950/80 rounded-sm border border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.3)] mb-8 overflow-hidden">
                            <div className="bg-emerald-900/60 p-4 border-b border-emerald-500/30 flex items-center justify-between">
                                <h4 className="font-black tracking-widest text-lg text-emerald-400 flex items-center gap-2">
                                    <span>📋</span> 診療檢討報告
                                </h4>
                                <span className="text-xs font-bold text-emerald-200/60 tracking-widest bg-emerald-950/50 px-2 py-1 rounded">
                                    CASE CLOSED
                                </span>
                            </div>

                            <div className="p-6 md:p-8 space-y-6 text-left">
                                <div>
                                    <div className="text-xs font-black tracking-widest text-rose-400 mb-2 flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 inline-block"></span>
                                        主訴病兆分析
                                    </div>
                                    <div className="bg-slate-900/50 p-4 rounded border border-slate-700/50">
                                        <div className="mb-4 space-y-3">
                                            {current.explanation.map((step, idx) => (
                                                <div key={idx} className="flex items-start gap-2">
                                                    <span className="text-lg">{step.icon}</span>
                                                    <div>
                                                        <span className="text-sm font-bold text-slate-300">{step.label}：</span>
                                                        <span className="text-sm text-slate-400 leading-snug">{step.text}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="flex flex-wrap gap-2 items-center">
                                            <span className="text-xs text-slate-500">優先病灶：</span>
                                            <span className="text-xs font-bold bg-rose-950/40 border border-rose-500/30 text-rose-300 px-2 py-0.5 rounded">
                                                {currentDiagnosisMeta?.title || current.diagnosis}
                                            </span>
                                        </div>

                                        {current.coDiagnosisKeys?.length > 0 && (
                                            <div className="flex flex-wrap gap-2 items-center mt-2">
                                                <span className="text-xs text-slate-500">常見共病：</span>
                                                {current.coDiagnosisKeys.map(id => (
                                                    <span key={id} className="text-xs font-bold bg-amber-950/40 border border-amber-500/30 text-amber-300 px-2 py-0.5 rounded">
                                                        {DIAGNOSIS_OPTIONS.find(d => d.id === id)?.title || id}
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        <div className="flex flex-wrap gap-2 items-center mt-3">
                                            <span className="text-xs text-slate-500">處方組合：</span>
                                            {current.cures.map(c => (
                                                <span key={c} className="text-xs font-bold bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 px-2 py-0.5 rounded">
                                                    {CURE_OPTIONS.find(o => o.id === c)?.title || c}
                                                </span>
                                            ))}
                                        </div>

                                        {current.priorityReason && (
                                            <div className="mt-3 bg-amber-950/20 p-3 rounded border-l-2 border-amber-500/50">
                                                <div className="text-xs font-bold text-amber-300 mb-1">🎯 本關優先搶救點</div>
                                                <div className="text-xs text-slate-300 leading-relaxed">{current.priorityReason}</div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-rose-950/20 p-4 rounded border-l-2 border-rose-500/50">
                                        <div className="text-xs font-bold text-rose-400/80 mb-1">❌ 原始瑕疵題目</div>
                                        <div className="text-sm text-slate-300 font-medium leading-snug">
                                            {current.question}
                                        </div>
                                    </div>

                                    <div className="bg-emerald-950/30 p-4 rounded border-l-2 border-emerald-500/50">
                                        <div className="text-xs font-bold text-emerald-400 mb-1">✅ 成功治癒題目</div>
                                        <div className="text-sm text-emerald-100 font-bold leading-snug">
                                            {selectedHealedOption?.text}
                                        </div>

                                        {selectedHealedOption?.researchType && (
                                            <span className="inline-block mt-2 px-2 py-0.5 bg-emerald-900/60 border border-emerald-500/40 text-emerald-300 text-xs font-bold rounded-sm tracking-widest">
                                                {selectedHealedOption.researchType}研究
                                            </span>
                                        )}

                                        {otherCorrectOptions.length > 0 && (
                                            <div className="mt-3 pt-3 border-t border-emerald-500/30">
                                                <div className="text-xs font-bold text-emerald-300/80 mb-1">💡 另一條路也走得通：</div>
                                                {otherCorrectOptions.map((altOpt, idx) => (
                                                    <div key={idx} className="mt-1 flex flex-col items-start">
                                                        <div className="text-sm text-emerald-200/80 font-medium leading-snug">
                                                            {altOpt.text}
                                                        </div>
                                                        {altOpt.researchType && (
                                                            <span className="inline-block mt-1 px-2 py-0.5 bg-emerald-900/40 border border-emerald-500/30 text-emerald-400/80 text-[10px] font-bold rounded-sm tracking-widest">
                                                                {altOpt.researchType}研究
                                                            </span>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {partialFeedback?.message && (
                                    <div className="bg-emerald-900/20 border border-emerald-500/30 rounded-sm p-4">
                                        <div className="text-sm text-emerald-200 font-medium leading-relaxed">
                                            {partialFeedback.message}
                                        </div>
                                        {partialFeedback?.altMessage && (
                                            <div className="text-sm text-emerald-300 mt-2 font-bold">
                                                {partialFeedback.altMessage}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        <button
                            onClick={nextPatient}
                            className="bg-slate-800/80 hover:bg-slate-700 text-teal-400 hover:text-teal-300 font-bold tracking-widest py-4 px-10 rounded-sm w-full transition-all border border-teal-500/30 flex justify-center items-center gap-3 active:scale-[0.98]"
                        >
                            {currentIdx < patients.length - 1 ? '已了解，呼叫下一位病患 ⏭️' : '結束值班，查看總結報告 📊'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
