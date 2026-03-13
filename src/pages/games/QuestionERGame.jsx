import React, { useState, useEffect } from 'react';
import { patientData } from '../../data/patientData'; // 匯入新的 30 題庫

// 掃描器選項 (病理切片)
const CAUSE_OPTIONS = [
    { id: '大', label: '🔎 [太大] 範圍膨脹' },
    { id: '空', label: '🌫️ [太空] 抽象不具體' },
    { id: '遠', label: '🔭 [太遠] 對象接觸不到' },
    { id: '難', label: '🤯 [太難] 無法驗證、主觀' }
];

// 處方卡片 (對症下藥)
const CURE_OPTIONS = [
    { id: '小', label: '💊 [縮小藥丸] 大 → 小' },
    { id: '實', label: '💉 [具體疫苗] 空 → 實' },
    { id: '近', label: '🚪 [任意門探測儀] 遠 → 近' },
    { id: '易', label: '🔪 [降維手術刀] 難 → 易' }
];

// 病情嚴重度樣式
const severityStyles = {
    mild: { bg: "bg-green-50", border: "border-green-200", label: "輕症 (單病灶)", color: "text-green-700", icon: "🟢" },
    moderate: { bg: "bg-amber-50", border: "border-amber-200", label: "中度 (雙併發)", color: "text-amber-700", icon: "🟡" },
    severe: { bg: "bg-red-50", border: "border-red-200", label: "重症 (大Combo)", color: "text-red-700", icon: "🔴" },
    boss: { bg: "bg-purple-50", border: "border-purple-200", label: "🚨多重器官衰竭", color: "text-purple-700", icon: "☠️" }
};

// 洗牌函式
const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
};

// 陣列比較工具（不論順序）
const arraysEqual = (a, b) => {
    if (a.length !== b.length) return false;
    const sortedA = [...a].sort();
    const sortedB = [...b].sort();
    return sortedA.every((val, index) => val === sortedB[index]);
};

export const QuestionERGame = () => {
    const [gameState, setGameState] = useState('start'); // 'start', 'playing', 'end'
    const [playingPhase, setPlayingPhase] = useState('diagnosis'); // 'diagnosis', 'prescription', 'healedSelection', 'healed'
    const [playerName, setPlayerName] = useState('');
    const [patients, setPatients] = useState([]);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [score, setScore] = useState(0);

    const [selectedCauses, setSelectedCauses] = useState([]);
    const [selectedCures, setSelectedCures] = useState([]);

    const [wrongCases, setWrongCases] = useState([]); // 記錄曾經錯過(被扣過分)的題目
    const [timer, setTimer] = useState(0);

    // Track score deduction for current question
    const [currentQuestionPts, setCurrentQuestionPts] = useState(10);
    const [hintUsed, setHintUsed] = useState(false);
    const [partialFeedback, setPartialFeedback] = useState(null);

    // Timer & Player Name
    useEffect(() => {
        const savedName = localStorage.getItem('rib_agent_name');
        if (savedName) {
            setPlayerName(savedName);
        }

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
        // 從 30 題中隨機挑選 10 題 (4 綠, 3 黃, 3 紅)
        const greens = shuffleArray(patientData.filter(p => p.id >= 1 && p.id <= 10)).slice(0, 4);
        const yellows = shuffleArray(patientData.filter(p => p.id >= 11 && p.id <= 20)).slice(0, 3);
        const reds = shuffleArray(patientData.filter(p => p.id >= 21 && p.id <= 30)).slice(0, 3);
        
        const selectedPatients = shuffleArray([...greens, ...yellows, ...reds]);

        // 將每題的 healedOptions 打亂順序
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
        setSelectedCauses([]);
        setSelectedCures([]);
        setCurrentQuestionPts(10);
        setHintUsed(false);
        setPartialFeedback(null);
        setPlayingPhase('diagnosis');
    };

    const toggleCause = (id) => {
        if (playingPhase !== 'diagnosis') return;
        setSelectedCauses(prev =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    const toggleCure = (id) => {
        if (playingPhase !== 'prescription') return;
        setSelectedCures(prev =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    // 處理錯誤：扣分並標記為錯題（強制重新作答，直到對為止）
    const handleMistake = (errorMsg) => {
        setPartialFeedback({
            type: 'error',
            title: '⚠️ 醫療事故！',
            message: errorMsg
        });
        
        // 分數歸零，並加入錯題本（如果還沒加過）
        setCurrentQuestionPts(0);
        if (!wrongCases.find(c => c.id === patients[currentIdx].id)) {
            setWrongCases(prev => [...prev, patients[currentIdx]]);
        }
    };

    const submitDiagnosis = () => {
        const current = patients[currentIdx];
        if (arraysEqual(selectedCauses, current.causes)) {
            // Correct Diagnosis
            setPlayingPhase('prescription');
            setPartialFeedback(null);
        } else {
            // Wrong Diagnosis -> Forced Retry
            handleMistake("你的切片診斷有誤！病患的心跳加快了，請重新檢視「大空遠難」的特徵。你必須診斷正確才能進行下一步。");
        }
    };

    const submitPrescription = () => {
        const current = patients[currentIdx];
        if (arraysEqual(selectedCures, current.cures)) {
            // Correct Cure -> go to healedSelection
            setPlayingPhase('healedSelection');
            setPartialFeedback(null);
        } else {
            // Wrong Cure -> Forced Retry
            const missing = current.cures.filter(c => !selectedCures.includes(c));
            let hintMsg = "你開的處方無法治好這個病因！若是抽象名詞太空洞，應施打「具體疫苗」；如果是範圍太大，則需要「縮小藥丸」唷！別忘了對症下藥！";
            if(current.causes.length > 1 && selectedCures.length < missing.length){
                hintMsg = "注意！這名病患有多重併發症，你需要同時打出 Combo 處方箋！你必須開對藥才能進行下一步。";
            }
            handleMistake(hintMsg);
        }
    };

    const submitHealedSelection = (option) => {
        if (option.isCorrect) {
            // Correct Healed Selection
            setPlayingPhase('healed');
            setScore(s => s + currentQuestionPts); // 結算這題分數
            setPartialFeedback({
                type: 'success',
                title: '💚 完美治癒',
                message: option.feedback,
                pts: currentQuestionPts
            });
        } else {
            // Wrong Healed Selection
            handleMistake(option.feedback);
        }
    };

    const nextPatient = () => {
        if (currentIdx < patients.length - 1) {
            setCurrentIdx(i => i + 1);
            resetQuestionState();
        } else {
            setGameState('end');
        }
    };

    const useHint = () => {
        setHintUsed(true);
        setCurrentQuestionPts(Math.max(0, currentQuestionPts - 3)); // 扣 3 分
    };

    // ================= START SCREEN =================
    if (gameState === 'start') {
        return (
            <div className="relative rounded-sm overflow-hidden flex flex-col items-center justify-center p-6 md:py-16 font-sans text-rose-50 min-h-[700px] bg-cover bg-fixed bg-center shadow-2xl"
                style={{ backgroundImage: "url('/images/question_er_bg.png')" }}>
                <div className="absolute inset-0 bg-[#0f172a]/85 backdrop-blur-none z-0"></div>

                <div className="bg-[#1e293b]/70 backdrop-blur-lg p-8 md:p-12 rounded-sm shadow-[0_0_40px_rgba(45,212,191,0.15)] max-w-xl w-full text-center border border-white/5 border-t-[8px] border-t-teal-500 relative overflow-hidden z-10">
                    <div className="absolute top-0 right-0 opacity-[0.03] text-9xl -mt-4 -mr-4 text-teal-400">🏥</div>
                    <div className="text-7xl mb-6 animate-pulse drop-shadow-[0_0_15px_rgba(45,212,191,0.5)]">🩺</div>
                    <h1 className="text-4xl md:text-5xl font-sans font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-cyan-500 mb-2 tracking-wide drop-shadow-sm">行動代號：靶心</h1>
                    <div className="text-sm md:text-base font-bold text-teal-300/80 mb-4 bg-teal-950/40 inline-block px-4 py-1.5 rounded-sm border border-teal-500/20 tracking-widest">
                        賽博法醫診斷室
                    </div>
                    <div className="bg-slate-800/50 rounded-sm p-6 mb-8 text-center border border-slate-600/50 shadow-inner">
                        <label className="block text-sm font-bold text-teal-300 mb-2 tracking-wider drop-shadow-sm">👨‍⚕️ 目前登入身分</label>
                        {playerName ? (
                            <div className="text-2xl font-black text-teal-400 border-b-2 border-teal-500/50 inline-block pb-1 px-4 drop-shadow-[0_0_10px_rgba(45,212,191,0.4)]">{playerName} 醫師</div>
                        ) : (
                            <div className="text-rose-400 font-bold mb-2 drop-shadow-sm">無法辨識身分！請返回總部大廳完成報到手續。</div>
                        )}
                        <h3 className="text-sm font-bold text-slate-400 mb-3 tracking-wider border-t border-slate-700 pt-6 mt-6">📋 看診須知</h3>
                        <div className="space-y-3 text-sm text-slate-300 text-left md:px-4">
                            <p className="flex items-start gap-2">🩺 <span>急診室湧入了 10 個<strong className="text-rose-400 font-bold bg-rose-900/40 px-1 rounded shadow-sm border border-rose-500/20">「生病的研究問題」</strong></span></p>
                            <p className="flex items-start gap-2">🔎 <span>身為法醫，你必須先透過切片找出導致題目標籤化的病因</span></p>
                            <p className="flex items-start gap-2">💊 <span>再搭配小、實、近、易進行對症下藥。多重併發症可能需要<strong className="text-teal-400 font-bold bg-teal-900/40 px-1 rounded shadow-sm border border-teal-500/20">連環 Combo</strong>！</span></p>
                            <p className="flex items-start gap-2">⚠️ <span>若答錯將被扣分並<strong className="text-amber-400 font-bold bg-amber-900/40 px-1 rounded shadow-sm border border-amber-500/20">強制重答</strong>，直到正確為止</span></p>
                        </div>
                    </div>

                    <button
                        onClick={startGame}
                        disabled={!playerName}
                        className={`font-black py-4 px-10 rounded-sm text-lg tracking-widest transition-all duration-300 transform shadow-[0_0_20px_rgba(20,184,166,0.3)] flex items-center justify-center gap-2 mx-auto overflow-hidden group ${!playerName ? 'bg-slate-700 text-slate-500 cursor-not-allowed shadow-none' : 'bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white hover:scale-105 active:scale-95 hover:shadow-[0_0_30px_rgba(20,184,166,0.5)] border border-teal-400/50'}`}
                    >
                        <span className="relative z-10">穿上白袍，開始值班</span>
                    </button>
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
        if (score === 100) { title = "🏆 完美賽博神醫！"; color = "text-amber-400"; bg = "bg-amber-900/40"; borderColor = "border-amber-500/50"; }
        else if (score >= 80) { title = "👨‍⚕️ 首席主治醫師！"; color = "text-teal-400"; bg = "bg-teal-900/40"; borderColor = "border-teal-500/50"; }
        else if (score >= 60) { title = "🩺 資深住院醫師！"; color = "text-emerald-400"; bg = "bg-emerald-900/40"; borderColor = "border-emerald-500/50"; }
        else { title = "💊 實習生，多練練吧！"; color = "text-rose-400"; bg = "bg-rose-900/40"; borderColor = "border-rose-500/50"; }

        return (
            <div className="relative rounded-sm overflow-hidden flex flex-col items-center justify-center p-6 md:py-10 font-sans text-blue-50 min-h-[700px] bg-cover bg-fixed bg-center shadow-2xl"
                style={{ backgroundImage: "url('/images/question_er_bg.png')" }}>
                <div className="absolute inset-0 bg-[#0f172a]/90 backdrop-blur-sm z-0"></div>

                <div className="bg-[#1e293b]/70 backdrop-blur-lg p-8 md:p-12 rounded-sm shadow-[0_0_50px_rgba(0,0,0,0.5)] max-w-2xl w-full text-center border-t-[8px] border-t-teal-500 border-x border-b border-white/5 relative z-10">
                    <h2 className="text-2xl font-black text-amber-500 mb-4 tracking-widest drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]">🎯 任務結案報告</h2>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6 relative z-10">
                        <div className="text-sm font-medium text-slate-400 bg-slate-800/60 shadow-inner px-4 py-1 rounded-sm border border-slate-600/50">值班時間：{formatTime(timer)}</div>
                        <div className="text-sm font-medium text-teal-300 bg-teal-900/40 shadow-inner px-4 py-1 rounded-sm border border-teal-500/30">主治醫師：<span className="font-bold">{playerName}</span></div>
                    </div>

                    <div className="flex flex-col items-center justify-center mb-6 relative z-10">
                        <div className="text-7xl font-black text-teal-400 tracking-tighter mb-2 drop-shadow-[0_0_15px_rgba(45,212,191,0.5)]">{score} <span className="text-3xl text-slate-500 font-medium">/ 100</span></div>
                        <h2 className={`text-2xl md:text-3xl font-black px-6 py-2 rounded-sm ${color} ${bg} border ${borderColor} mb-4 shadow-lg drop-shadow-md`}>{title}</h2>

                        <div className="flex gap-4 mt-6">
                            <div className="bg-emerald-900/40 border border-emerald-500/50 shadow-inner px-5 py-3 rounded-sm flex flex-col items-center">
                                <span className="text-emerald-400 font-black block text-2xl drop-shadow-sm">{10 - wrongCases.length}</span>
                                <span className="text-xs text-emerald-200/60 font-medium tracking-wider mt-1">一針見血 (滿分)</span>
                            </div>
                            <div className="bg-rose-900/40 border border-rose-500/50 shadow-inner px-5 py-3 rounded-sm flex flex-col items-center">
                                <span className="text-rose-400 font-black block text-2xl drop-shadow-sm">{wrongCases.length}</span>
                                <span className="text-xs text-rose-200/60 font-medium tracking-wider mt-1">醫療誤診 (扣分)</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3 justify-center mt-6 mb-8">
                        <button
                            onClick={() => setGameState('start')}
                            className="bg-slate-800/80 hover:bg-slate-700 text-teal-400 font-bold py-3 px-6 rounded-sm text-base transition-all duration-300 border border-teal-500/50 flex items-center gap-2 backdrop-blur-sm"
                        >
                            重新開始 🔄
                        </button>
                    </div>

                    {wrongCases.length > 0 && (
                        <div className="text-left bg-[#0f172a]/90 p-6 md:p-8 rounded-sm border-l-[6px] border-rose-500 max-h-[400px] overflow-y-auto shadow-inner border-y border-r border-white/5 scrollbar-thin scrollbar-thumb-teal-700 scrollbar-track-slate-800">
                            <h3 className="text-xl font-black mb-6 flex items-center gap-2 text-rose-300 border-b border-slate-700 pb-4 drop-shadow-sm">
                                🚨 誤診檢討筆記
                            </h3>
                            <div className="space-y-5">
                                {wrongCases.map((wc, i) => (
                                    <div key={i} className="bg-slate-800/80 p-5 rounded-sm shadow-lg border border-slate-700 relative overflow-hidden group hover:border-teal-500/50 transition-colors">
                                        <div className="absolute top-0 left-0 w-1.5 h-full bg-rose-500 opacity-60"></div>
                                        <p className="font-bold text-rose-100 text-lg mb-2 flex items-start gap-2 max-w-[90%]">🤕「{wc.question}」</p>
                                        <div className="mb-3 space-y-2 mt-4 text-sm">
                                            <p className="font-bold text-slate-400">✅ 正確病因： <span className="text-rose-300 ml-1">{wc.causes.join(", ")}</span> (需服用：<span className="text-teal-300">{wc.cures.join(", ")}</span>)</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // ================= PLAYING SCREEN =================
    const current = patients[currentIdx];
    if (!current) return null;
    let sevType = "mild";
    if (current.id > 10 && current.id <= 20) sevType = "moderate";
    if (current.id > 20) sevType = "severe";
    if (current.id > 20 && current.causes.length > 1) sevType = "boss";

    const sv = severityStyles[sevType];
    const isBoss = sevType === 'boss' || sevType === 'moderate' || current.causes.length > 1;

    return (
        <div className="relative rounded-sm overflow-hidden flex flex-col items-center p-4 md:p-8 font-sans min-h-[700px] text-teal-50 bg-[#064e3b] bg-cover bg-fixed bg-center shadow-2xl"
            style={{ backgroundImage: "url('/images/question_er_bg.png')" }}>
            <div className="absolute inset-0 bg-[#0f172a]/85 backdrop-blur-sm z-0"></div>
            <div className="max-w-4xl w-full relative z-10 flex flex-col items-center text-center">

                {/* Progress & Score */}
                <div className="flex w-full justify-between items-center gap-3 mb-8">
                    <div className="text-slate-300 font-bold text-sm tracking-widest flex items-center gap-2 uppercase">
                        <span>Case <span className="text-teal-400 text-lg">{currentIdx + 1}</span>_{patients.length}</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-[pulse_1s_ease-in-out_infinite] shadow-[0_0_8px_rgba(244,63,94,0.8)]"></span>
                    </div>

                    <div className="text-emerald-400 font-bold px-4 py-1.5 rounded-full border border-emerald-500/30 font-mono tracking-widest flex items-center gap-2">
                        SCORE <span className="text-emerald-300 font-black text-xl drop-shadow-[0_0_5px_rgba(16,185,129,0.5)]">{score}</span>
                        {/* Currently solving potential score */}
                        {playingPhase !== 'healed' && (
                            <span className="ml-2 text-xs text-teal-200/50 block">+(本題最高 {currentQuestionPts})</span>
                        )}
                    </div>
                </div>

                {/* Patient / Question Card */}
                <div className={`w-full max-w-2xl bg-[#1e293b]/80 backdrop-blur-md p-8 md:p-12 rounded-sm shadow-[0_0_40px_rgba(0,0,0,0.4)] mb-8 border border-white/5 transition-all relative overflow-hidden group hover:border-teal-500/30 duration-500`}>
                    
                    {isBoss && (
                        <div className="absolute top-0 right-0 bg-rose-600/90 text-white text-[10px] font-black px-6 py-1 tracking-[0.2em] transform translate-x-[20px] translate-y-[15px] rotate-45 shadow-[0_0_15px_rgba(244,63,94,0.6)]">
                            ⚠️ MULTIPLE COMBO
                        </div>
                    )}

                    <div className="flex items-center justify-center gap-2 flex-wrap mb-6">
                        <span className={`px-4 py-1 rounded border shadow-inner inline-flex items-center gap-1.5 text-xs font-black tracking-widest bg-[#0f172a]/80 ${sv.border} ${sv.color}`}>
                            {sv.icon} {sv.label}
                        </span>

                        {hintUsed && (
                             <span className="text-amber-400 bg-amber-900/30 px-3 py-1 text-xs font-bold rounded-sm border border-amber-500/30 ml-2 flex items-center gap-1 shadow-inner">
                                <span className="opacity-80 animate-ping h-2 w-2 rounded-full bg-amber-400 shadow-[0_0_5px_rgba(251,191,36,0.8)]"></span>
                                已啟用檢查報告
                            </span>
                        )}
                    </div>

                    {/* ECG Line (Decorative) */}
                    <svg className="absolute bottom-0 left-0 w-full h-16 opacity-10 text-teal-400 pointer-events-none" viewBox="0 0 100 20" preserveAspectRatio="none">
                        <polyline points="0,10 20,10 25,5 30,15 35,2 40,18 45,10 100,10" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="100 0" />
                    </svg>

                    <div className="relative z-10 py-6 my-2">
                        {playingPhase === 'healed' ? (
                            <div className="animate-in zoom-in-95 duration-500">
                                <p className="text-sm font-bold text-teal-400 tracking-widest mb-3 uppercase drop-shadow-[0_0_8px_rgba(45,212,191,0.5)]">
                                    ✓ 治癒完成的健康題目
                                </p>
                                <p className="text-2xl md:text-3xl font-black text-teal-50 leading-snug drop-shadow-md">
                                    {current.shuffledHealedOptions.find(o => o.isCorrect).text}
                                </p>
                            </div>
                        ) : (
                            <p className="text-2xl md:text-3xl font-black text-rose-100 leading-snug drop-shadow-md">
                                {current.question}
                            </p>
                        )}
                    </div>
                </div>

                {/* Hint Component */}
                {(!hintUsed && playingPhase === 'diagnosis') && (
                    <div className="bg-slate-800/40 border border-slate-600/50 border-dashed rounded-sm p-4 flex flex-col items-center justify-center gap-2 mb-6 relative z-10 mx-auto max-w-md shadow-inner backdrop-blur-none">
                        <button
                            onClick={useHint}
                            className="bg-slate-800/80 hover:bg-slate-700 text-amber-400 font-bold py-2 px-6 rounded-sm transition-all flex items-center justify-center gap-2 border border-slate-600 hover:border-amber-400/50 text-sm"
                        >
                            <span>🔍</span> 申請醫療顧問檢查報告 (-3 分)
                        </button>
                    </div>
                )}
                {hintUsed && playingPhase !== 'healed' && (
                    <div className="bg-slate-800/60 border-x border-b border-t-0 border-white/5 rounded-b-xl p-5 md:p-6 flex flex-col md:flex-row md:items-start justify-between gap-4 relative z-10 animate-in fade-in slide-in-from-top-4 duration-300 w-full max-w-2xl mb-6 shadow-inner backdrop-blur-sm -mt-10">
                        {/* Tags */}
                        <div className="flex-1 space-y-2">
                            <span className="text-xs font-black tracking-widest text-slate-400 bg-slate-900/80 border border-slate-700 px-2 py-1 rounded inline-block shadow-inner">病徵標籤</span>
                            <div className="flex flex-wrap gap-2 text-left">
                                {current.tags.map(tag => (
                                    <span key={tag} className="bg-slate-700/50 text-rose-200 font-semibold px-3 py-1.5 rounded-sm text-sm border border-slate-600 shadow-sm leading-none flex items-center gap-1">
                                        <span className="opacity-50 text-rose-400">#</span>{tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Diagnosis */}
                        <div className="flex-1 space-y-2">
                            <span className="text-xs font-black tracking-widest text-rose-400 bg-rose-900/40 border border-rose-500/30 px-2 py-1 rounded inline-block shadow-inner">醫療團隊初步評估</span>
                            <div className="bg-rose-900/20 text-rose-300 px-4 py-3 rounded-sm border border-rose-500/30 shadow-inner text-left">
                                <span className="font-bold text-base leading-snug drop-shadow-[0_0_5px_rgba(244,63,94,0.4)]">{current.diagnosis}</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* GAME PHASES UI */}
                {playingPhase === 'diagnosis' && (
                    <div className="w-full max-w-2xl animate-in fade-in slide-in-from-bottom-4">
                        <h3 className="text-slate-300 font-bold tracking-widest mb-4 flex items-center justify-center gap-2">
                            <span className="text-xl">1.</span> 第一階段：病理切片 {isBoss && <span className="text-rose-400 text-xs">(含併發症，可多選)</span>}
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                            {CAUSE_OPTIONS.map(opt => {
                                const isSelected = selectedCauses.includes(opt.id);
                                return (
                                    <button key={opt.id} onClick={() => toggleCause(opt.id)}
                                        className={`p-4 rounded-sm border font-bold text-left transition-all ${isSelected ? 'bg-teal-900/40 border-teal-400 text-teal-200 shadow-[0_0_15px_rgba(45,212,191,0.3)]' : 'bg-slate-800/40 border-slate-700 text-slate-400 hover:border-teal-400/50 hover:text-teal-100'}`}>
                                        {opt.label}
                                    </button>
                                );
                            })}
                        </div>
                        <button onClick={submitDiagnosis} disabled={selectedCauses.length === 0}
                            className={`w-full py-4 rounded-sm font-black tracking-widest text-lg transition-all ${selectedCauses.length > 0 ? 'bg-slate-100 text-slate-900 hover:bg-teal-400 hover:text-slate-900 hover:shadow-[0_0_20px_rgba(45,212,191,0.5)]' : 'bg-slate-800/50 text-slate-500 cursor-not-allowed'}`}>
                            確定病因
                        </button>
                    </div>
                )}

                {playingPhase === 'prescription' && (
                    <div className="w-full max-w-2xl animate-in fade-in slide-in-from-bottom-4">
                        <h3 className="text-slate-300 font-bold tracking-widest mb-4 flex items-center justify-center gap-2">
                            <span className="text-xl">2.</span> 第二階段：對症下藥 {isBoss && <span className="text-teal-400 text-xs">(請打出 Combo 連擊處方！)</span>}
                        </h3>
                        {/* Display confirmed diagnosis as a subtle reminder */}
                        <div className="flex flex-wrap items-center justify-center gap-2 mb-6 opacity-60 pointer-events-none">
                            <span className="text-xs text-slate-400">已確認病灶：</span>
                            {selectedCauses.map(c => 
                                <span key={c} className="text-xs font-bold bg-slate-800 border border-slate-700 px-2 py-0.5 rounded text-rose-300">{c} 的問題</span>
                            )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                            {CURE_OPTIONS.map(opt => {
                                const isSelected = selectedCures.includes(opt.id);
                                return (
                                    <button key={opt.id} onClick={() => toggleCure(opt.id)}
                                        className={`p-4 rounded-sm border font-bold text-left transition-all ${isSelected ? 'bg-cyan-900/60 border-cyan-400 text-cyan-200 shadow-[0_0_15px_rgba(34,211,238,0.3)]' : 'bg-slate-800/40 border-slate-700 text-slate-400 hover:border-cyan-400/50 hover:text-cyan-100'}`}>
                                        {opt.label}
                                    </button>
                                );
                            })}
                        </div>
                        <button onClick={submitPrescription} disabled={selectedCures.length === 0}
                            className={`w-full py-4 rounded-sm font-black tracking-widest text-lg transition-all ${selectedCures.length > 0 ? 'bg-cyan-400 text-slate-900 hover:bg-cyan-300 hover:shadow-[0_0_25px_rgba(34,211,238,0.6)]' : 'bg-slate-800/50 text-slate-500 cursor-not-allowed'}`}>
                            開立處方
                        </button>
                    </div>
                )}

                {playingPhase === 'healedSelection' && (
                    <div className="w-full max-w-2xl animate-in fade-in slide-in-from-bottom-4">
                        <h3 className="text-slate-300 font-bold tracking-widest mb-4 flex items-center justify-center gap-2">
                            <span className="text-xl">3.</span> 最終階段：驗收治癒結果
                        </h3>
                        <p className="text-slate-400 text-sm mb-6">處方已生效！請根據你開立的處方，選擇出哪一個是真正治癒後的好題目：</p>

                        <div className="flex flex-col gap-4 mb-6">
                            {current.shuffledHealedOptions.map((opt, i) => (
                                <button key={i} onClick={() => submitHealedSelection(opt)}
                                    className="p-5 rounded-sm border bg-slate-800/60 border-slate-600 text-slate-200 hover:border-teal-400 hover:bg-teal-900/20 text-left transition-all hover:shadow-[0_0_15px_rgba(45,212,191,0.2)] text-lg leading-snug font-bold">
                                    <span className="text-teal-400 mr-2 text-sm">▶</span>
                                    {opt.text}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Error Reports Popups */}
                {partialFeedback && playingPhase !== 'healed' && (
                    <div className="w-full max-w-2xl mt-6">
                        <div className="bg-rose-950/80 border border-rose-500/50 p-5 rounded-sm flex items-start gap-4 animate-[shake_0.5s] shadow-[0_0_20px_rgba(244,63,94,0.3)]">
                            <div className="text-3xl shrink-0 drop-shadow-md">🚨</div>
                            <div className="text-left">
                                <h4 className="font-bold text-rose-400 text-lg mb-1 drop-shadow-sm">{partialFeedback.title}</h4>
                                <p className="text-sm text-rose-200 font-medium leading-loose">{partialFeedback.message}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Healed Result Screen */}
                {playingPhase === 'healed' && (
                    <div className="w-full max-w-2xl animate-in fade-in slide-in-from-bottom-4">
                        <div className={`p-6 rounded-sm border flex items-start gap-4 mb-8 text-left bg-[#064e3b]/80 border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.2)]`}>
                            <div className="text-4xl shrink-0 mt-1">💡</div>
                            <div>
                                <h4 className={`font-black tracking-widest text-xl mb-2 text-emerald-400`}>{partialFeedback?.title}</h4>
                                <p className="text-slate-300 font-medium leading-relaxed mb-4">{current.explanation}</p>
                            </div>
                        </div>

                        <button onClick={nextPatient} className="bg-slate-800/80 hover:bg-slate-700 text-teal-400 hover:text-teal-300 font-bold tracking-widest py-4 px-10 rounded-sm w-full transition-all border border-teal-500/30 flex justify-center items-center gap-3 active:scale-[0.98]">
                            {currentIdx < patients.length - 1 ? '呼叫下一位病患 ⏭️' : '結束值班，查看報告 📊'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
