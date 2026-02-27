import React, { useState, useEffect } from 'react';

// 題目資料庫：10 個「生病的研究問題」
const patientData = [
    {
        id: 1,
        question: "什麼是溫室效應？",
        diagnosis: "Google 直接答症",
        correctRx: "把常識問題轉為在地探究",
        options: [
            "把常識問題轉為在地探究",
            "縮小研究範圍",
            "加入衝突點",
            "增加可測量變項"
        ],
        healed: "本校教室冷氣使用量與學生節能意識之間的落差？",
        explanation: "這個問題 AI 一秒就能回答，代表它沒有研究價值。必須轉化為你身邊才看得到的「在地現象」。",
        severity: "mild",
        tags: ["太常識", "AI能直接答"]
    },
    {
        id: 2,
        question: "青少年喜歡滑手機嗎？",
        diagnosis: "答案顯而易見症",
        correctRx: "加入衝突點",
        options: [
            "加入衝突點",
            "把常識問題轉為在地探究",
            "縮小研究範圍",
            "增加可測量變項"
        ],
        healed: "為什麼本校學生明知滑手機影響睡眠，卻仍在睡前平均使用 2 小時以上？",
        explanation: "「喜歡滑手機」人人都知道，毫無懸念。加入「明知有害卻還是做」的衝突點，問題就活了！",
        severity: "mild",
        tags: ["太顯而易見", "缺乏衝突"]
    },
    {
        id: 3,
        question: "如何解決全球貧窮問題？",
        diagnosis: "範圍膨脹症",
        correctRx: "縮小研究範圍",
        options: [
            "縮小研究範圍",
            "加入衝突點",
            "把常識問題轉為在地探究",
            "改成因果假設"
        ],
        healed: "本校弱勢補助學生在學用品支出上面臨哪些具體困難？",
        explanation: "全球貧窮這個題目寫一輩子都寫不完！要縮小到你能在學校裡實際研究的規模。",
        severity: "severe",
        tags: ["範圍太大", "無法執行"]
    },
    {
        id: 4,
        question: "社群媒體對年輕人有什麼影響？",
        diagnosis: "定義模糊症",
        correctRx: "增加可測量變項",
        options: [
            "增加可測量變項",
            "縮小研究範圍",
            "加入衝突點",
            "把常識問題轉為在地探究"
        ],
        healed: "本校高一生每日 Instagram 使用時間與自我形象滿意度之間的關聯？",
        explanation: "「社群媒體」是哪個？「影響」是什麼影響？把模糊的詞彙換成具體、可測量的變項！",
        severity: "moderate",
        tags: ["定義模糊", "不可測量"]
    },
    {
        id: 5,
        question: "為什麼台灣教育這麼失敗？",
        diagnosis: "預設立場症",
        correctRx: "移除主觀價值判斷",
        options: [
            "移除主觀價值判斷",
            "縮小研究範圍",
            "增加可測量變項",
            "把常識問題轉為在地探究"
        ],
        healed: "本校學生對 108 課綱自主學習計畫的執行困難與需求調查",
        explanation: "「教育失敗」是你的個人判斷（價值觀），不是客觀事實。研究問題必須保持中立。",
        severity: "severe",
        tags: ["預設立場", "主觀價值"]
    },
    {
        id: 6,
        question: "學生壓力大嗎？",
        diagnosis: "封閉式提問症",
        correctRx: "改為開放式探究",
        options: [
            "改為開放式探究",
            "加入衝突點",
            "增加可測量變項",
            "縮小研究範圍"
        ],
        healed: "本校高三生在學測前三個月的壓力來源分佈，以及採取的紓壓策略有哪些？",
        explanation: "「大嗎？」只能答「大」或「不大」，調查就結束了。改為「有哪些」「分佈如何」就能挖出豐富的資料。",
        severity: "moderate",
        tags: ["封閉式問題", "只能答是否"]
    },
    {
        id: 7,
        question: "網路霸凌會導致自殺嗎？",
        diagnosis: "倫理風險症",
        correctRx: "降低敏感度並聚焦可行面",
        options: [
            "降低敏感度並聚焦可行面",
            "縮小研究範圍",
            "移除主觀價值判斷",
            "增加可測量變項"
        ],
        healed: "本校學生遭遇網路負面言論時的情緒反應與求助行為調查",
        explanation: "直接詢問「自殺」會觸及重大倫理問題，高中生研究不適合處理。但可以從「負面情緒」和「求助行為」的角度切入。",
        severity: "severe",
        tags: ["倫理敏感", "高風險議題"]
    },
    {
        id: 8,
        question: "手搖飲對身體好不好？",
        diagnosis: "Google 直接答症 + 封閉式提問症",
        correctRx: "把常識問題轉為在地探究",
        options: [
            "把常識問題轉為在地探究",
            "改為開放式探究",
            "增加可測量變項",
            "加入衝突點"
        ],
        healed: "本校學生每週手搖飲消費次數與其對含糖飲料健康風險的認知程度之間的落差？",
        explanation: "「好不好」是常識問題又是封閉式提問。轉化為「消費行為」與「健康認知」的落差，就有了在地性和衝突點！",
        severity: "moderate",
        tags: ["雙重病症", "常識+封閉"]
    },
    {
        id: 9,
        question: "AI 會取代老師嗎？",
        diagnosis: "預測未來症",
        correctRx: "改成現在式的可驗證問題",
        options: [
            "改成現在式的可驗證問題",
            "縮小研究範圍",
            "移除主觀價值判斷",
            "把常識問題轉為在地探究"
        ],
        healed: "本校師生對 AI 輔助教學的接受度差異，以及雙方認為 AI 最適合協助哪些教學環節？",
        explanation: "預測未來不是研究，是占卜！把問題拉回「現在」：目前師生怎麼看？有什麼落差可以測量？",
        severity: "moderate",
        tags: ["預測未來", "無法驗證"]
    },
    {
        id: 10,
        question: "🔥 為什麼現在的學生都不讀書只打遊戲而且品德越來越差同時也不尊重老師？",
        diagnosis: "多重器官衰竭症（超級重症）",
        correctRx: "拆解問題並逐一聚焦",
        options: [
            "拆解問題並逐一聚焦",
            "移除主觀價值判斷",
            "縮小研究範圍",
            "改成現在式的可驗證問題"
        ],
        healed: "本校學生課後時間分配中，遊戲娛樂與課業複習的比例，以及影響此分配的因素？",
        explanation: "這個問題同時有：預設立場（品德差）、範圍太大（所有學生）、多管問題（讀書+遊戲+品德+尊師）。必須拆開來，一次只問一件事！",
        severity: "boss",
        tags: ["預設立場", "多管問題", "範圍太大", "價值判斷"]
    }
];

// 病情嚴重度樣式
const severityStyles = {
    mild: { bg: "bg-green-900/30", border: "border-green-500", label: "輕症", color: "text-green-400", icon: "🤒" },
    moderate: { bg: "bg-amber-900/30", border: "border-amber-500", label: "中度", color: "text-amber-400", icon: "🤕" },
    severe: { bg: "bg-red-900/30", border: "border-red-500", label: "重症", color: "text-red-400", icon: "🚑" },
    boss: { bg: "bg-purple-900/30", border: "border-purple-500", label: "超級重症", color: "text-purple-400", icon: "☠️" }
};

// 洗牌
const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
};

export const QuestionERGame = () => {
    const [gameState, setGameState] = useState('start');
    const [patients, setPatients] = useState([]);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedRx, setSelectedRx] = useState(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [wrongCases, setWrongCases] = useState([]);
    const [showHealed, setShowHealed] = useState(false);
    const [timer, setTimer] = useState(0);

    // Timer
    useEffect(() => {
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
        const prepared = patientData.map(p => ({
            ...p,
            shuffledOptions: shuffleArray(p.options)
        }));
        setPatients(prepared);
        setWrongCases([]);
        setCurrentIdx(0);
        setScore(0);
        setSelectedRx(null);
        setIsAnswered(false);
        setShowHealed(false);
        setTimer(0);
        setGameState('playing');
    };

    const handleAnswer = (answer) => {
        if (isAnswered) return;
        setSelectedRx(answer);
        setIsAnswered(true);
        const current = patients[currentIdx];
        if (answer === current.correctRx) {
            setScore(s => s + 1);
        } else {
            setWrongCases(prev => [...prev, current]);
        }
    };

    const nextPatient = () => {
        if (currentIdx < patients.length - 1) {
            setCurrentIdx(i => i + 1);
            setSelectedRx(null);
            setIsAnswered(false);
            setShowHealed(false);
        } else {
            setGameState('end');
        }
    };

    // ================= START SCREEN =================
    if (gameState === 'start') {
        return (
            <div className="bg-slate-800 rounded-xl overflow-hidden flex flex-col items-center justify-center p-6 md:py-16 font-sans text-slate-100 min-h-[600px]">
                <div className="bg-slate-900 p-8 md:p-12 rounded-2xl shadow-2xl max-w-xl w-full text-center border-t-8 border-red-500 relative overflow-hidden">
                    <div className="absolute top-0 right-0 opacity-10 text-9xl -mt-4 -mr-4">🏥</div>
                    <div className="text-7xl mb-6 animate-pulse">🚑</div>
                    <h1 className="text-3xl md:text-5xl font-black text-red-400 mb-4 tracking-wide drop-shadow-md">問題急診室</h1>
                    <h2 className="text-xl md:text-2xl font-bold text-slate-300 mb-6 border-b border-slate-700 pb-4">研究問題健檢大挑戰</h2>
                    <p className="text-slate-400 text-lg mb-8 font-medium leading-relaxed">
                        急診室湧入了 10 個<span className="text-red-400 font-bold">「生病的研究問題」</span>！<br />
                        身為急診主治醫師的你，<br />
                        能正確<span className="text-emerald-400 font-bold border-b-2 border-emerald-500">「診斷病因」</span>並開出<span className="text-blue-400 font-bold border-b-2 border-blue-500">「正確處方」</span>嗎？
                    </p>
                    <div className="bg-slate-800 rounded-xl p-4 mb-8 text-left border border-slate-700">
                        <h3 className="text-sm font-bold text-slate-400 mb-3 tracking-wider">📋 值班須知</h3>
                        <div className="space-y-2 text-sm text-slate-300">
                            <p>🤒 <span className="text-green-400 font-semibold">輕症</span> → 常識型問題，簡單修正</p>
                            <p>🤕 <span className="text-amber-400 font-semibold">中度</span> → 有多重問題，需要仔細判斷</p>
                            <p>🚑 <span className="text-red-400 font-semibold">重症</span> → 嚴重瑕疵，需要大幅改造</p>
                            <p>☠️ <span className="text-purple-400 font-semibold">超級重症</span> → 魔王級，多重器官衰竭</p>
                        </div>
                    </div>
                    <button
                        onClick={startGame}
                        className="bg-red-600 hover:bg-red-500 text-white font-black py-4 px-10 rounded-full text-xl transition transform hover:scale-105 shadow-[0_0_15px_rgba(239,68,68,0.5)] active:scale-95"
                    >
                        穿上白袍，開始值班 🩺
                    </button>
                </div>
            </div>
        );
    }

    // ================= END SCREEN =================
    if (gameState === 'end') {
        let title = "";
        let color = "";
        if (score === 10) { title = "🏆 年度最佳主治醫師！"; color = "text-amber-400"; }
        else if (score >= 8) { title = "👨‍⚕️ 資深主治醫師！"; color = "text-blue-400"; }
        else if (score >= 5) { title = "🩺 住院醫師！"; color = "text-green-400"; }
        else { title = "💊 實習生，還要多練習！"; color = "text-red-400"; }

        return (
            <div className="bg-slate-800 rounded-xl overflow-hidden flex flex-col items-center justify-center p-6 md:py-10 font-sans text-slate-100 min-h-[600px]">
                <div className="bg-slate-900 p-8 rounded-2xl shadow-2xl max-w-2xl w-full text-center border-t-8 border-red-500">
                    <h1 className="text-3xl font-bold text-slate-300 mb-4 tracking-widest">值班報告</h1>
                    <div className="text-sm text-slate-500 mb-4">值班時間：{formatTime(timer)}</div>
                    <div className="text-7xl font-black mb-2 text-red-500">{score} <span className="text-3xl text-slate-600">/ 10</span></div>
                    <h2 className={`text-3xl font-black mb-6 drop-shadow-md ${color}`}>{title}</h2>

                    <button
                        onClick={startGame}
                        className="bg-slate-700 hover:bg-slate-600 text-red-400 font-bold py-3 px-8 rounded-full text-lg transition transform hover:scale-105 shadow-lg mb-8 border border-slate-600"
                    >
                        重新值班 🔄
                    </button>

                    {wrongCases.length > 0 && (
                        <div className="text-left bg-slate-800 p-6 rounded-xl border-l-8 border-red-500 max-h-96 overflow-y-auto shadow-inner">
                            <h3 className="text-xl font-black mb-4 flex items-center gap-2 text-slate-200">
                                📋 誤診紀錄
                            </h3>
                            <div className="space-y-4">
                                {wrongCases.map((wc, i) => (
                                    <div key={i} className="bg-slate-700 p-4 rounded-lg shadow-sm border border-slate-600">
                                        <p className="font-bold text-red-300 text-lg mb-2">🤒 "{wc.question}"</p>
                                        <p className="text-sm text-slate-400 mb-1">病因：{wc.diagnosis}</p>
                                        <span className="bg-emerald-900/50 text-emerald-400 font-bold px-3 py-1 rounded-full text-sm border border-emerald-800">
                                            ✅ 正確處方：{wc.correctRx}
                                        </span>
                                        <p className="text-sm text-blue-300 mt-2">💊 治癒後：「{wc.healed}」</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {wrongCases.length === 0 && (
                        <div className="bg-emerald-900/30 text-emerald-400 border border-emerald-800 p-4 rounded-xl font-bold text-lg">
                            零誤診！你已經完全掌握研究問題的健檢之道了！ 🎉
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // ================= PLAYING SCREEN =================
    const current = patients[currentIdx];
    if (!current) return null;
    const sv = severityStyles[current.severity];
    const isBoss = current.severity === 'boss';

    return (
        <div className="bg-slate-800 rounded-xl overflow-hidden flex flex-col items-center p-4 md:p-8 font-sans min-h-[600px]">
            <div className="max-w-4xl w-full">

                {/* Progress & Score */}
                <div className="flex justify-between items-center mb-6 px-2">
                    <div className="bg-slate-700 text-red-400 font-bold px-5 py-2 rounded-full shadow-sm text-lg border border-slate-600">
                        病患 {currentIdx + 1} / {patients.length}
                    </div>
                    <div className="bg-slate-700 text-slate-400 font-mono px-4 py-2 rounded-full text-sm border border-slate-600">
                        ⏱ {formatTime(timer)}
                    </div>
                    <div className="bg-slate-700 text-emerald-400 font-bold px-5 py-2 rounded-full shadow-sm text-lg border border-slate-600">
                        治癒: {score}
                    </div>
                </div>

                {/* Patient Card */}
                <div className={`bg-slate-900 p-6 md:p-8 rounded-2xl shadow-2xl mb-6 border-l-8 transition-all relative overflow-hidden ${sv.border} ${isBoss ? 'shadow-[0_0_20px_rgba(168,85,247,0.3)]' : ''}`}>
                    {isBoss && (
                        <div className="absolute top-0 right-0 bg-purple-600 text-white text-xs font-black px-4 py-1 rounded-bl-lg tracking-widest animate-pulse">
                            ☠️ 超級重症
                        </div>
                    )}

                    {/* Severity badge */}
                    <div className="flex items-center gap-3 mb-4">
                        <span className={`${sv.bg} ${sv.color} font-bold px-3 py-1 rounded-full text-sm border ${sv.border}`}>
                            {sv.icon} {sv.label}
                        </span>
                        <span className="text-slate-500 text-sm font-bold">病因：{current.diagnosis}</span>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                        {current.tags.map(tag => (
                            <span key={tag} className="bg-slate-800 text-red-400 font-bold px-3 py-1 rounded-md text-sm tracking-wider border border-slate-700 shadow-sm">
                                #{tag}
                            </span>
                        ))}
                    </div>

                    <h2 className="text-sm text-slate-400 font-bold mb-2 tracking-widest">【 病患的研究問題 】</h2>
                    <p className="text-2xl md:text-3xl font-bold text-slate-100 leading-snug">
                        「{current.question}」
                    </p>
                </div>

                {/* Prescription Options */}
                <h3 className="text-slate-400 font-bold text-sm mb-3 px-2 tracking-wider">💊 請選擇正確的處方：</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {current.shuffledOptions.map((option) => {
                        const isSelected = selectedRx === option;
                        const isCorrect = option === current.correctRx;

                        let buttonStyle = "bg-slate-800 text-slate-300 hover:bg-slate-700 border-2 border-slate-600 hover:border-blue-500 hover:text-blue-400";

                        if (isAnswered) {
                            if (isCorrect) {
                                buttonStyle = "bg-emerald-700 text-white border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)] scale-[1.02]";
                            } else if (isSelected && !isCorrect) {
                                buttonStyle = "bg-red-900/80 text-white border-red-500 shadow-inner opacity-90";
                            } else {
                                buttonStyle = "bg-slate-800 text-slate-600 border-slate-700 opacity-50 cursor-not-allowed";
                            }
                        }

                        return (
                            <button
                                key={option}
                                onClick={() => handleAnswer(option)}
                                disabled={isAnswered}
                                className={`flex items-center justify-center p-4 md:p-5 rounded-xl font-bold text-lg transition-all duration-200 ${buttonStyle} ${!isAnswered ? 'hover:shadow-lg hover:-translate-y-1' : ''}`}
                            >
                                💊 {option}
                            </button>
                        );
                    })}
                </div>

                {/* Feedback */}
                {isAnswered && (
                    <div className={`p-6 rounded-2xl shadow-2xl animate-in fade-in slide-in-from-bottom-4 border-l-8 ${selectedRx === current.correctRx ? 'bg-emerald-900/30 border-emerald-500' : 'bg-red-900/30 border-red-500'}`}>
                        <h3 className={`text-2xl font-black mb-3 ${selectedRx === current.correctRx ? 'text-emerald-400' : 'text-red-400'}`}>
                            {selectedRx === current.correctRx
                                ? `✅ 正確診斷！處方：${current.correctRx}`
                                : `❌ 誤診！正確處方應為：${current.correctRx}`}
                        </h3>
                        <p className="text-slate-200 text-lg font-medium leading-relaxed mb-4">
                            {current.explanation}
                        </p>

                        {/* Show healed question */}
                        {!showHealed ? (
                            <button
                                onClick={() => setShowHealed(true)}
                                className="bg-blue-600/30 hover:bg-blue-600/50 text-blue-300 border border-blue-500 font-bold py-2 px-6 rounded-full text-sm transition mb-4"
                            >
                                💡 看看治癒後的問題長什麼樣
                            </button>
                        ) : (
                            <div className="bg-blue-900/30 border border-blue-700 rounded-xl p-4 mb-4">
                                <p className="text-sm text-blue-400 font-bold mb-1">🩹 治癒後的研究問題：</p>
                                <p className="text-blue-200 text-lg font-medium">「{current.healed}」</p>
                            </div>
                        )}

                        <div className="text-right">
                            <button
                                onClick={nextPatient}
                                className="bg-red-600 hover:bg-red-500 text-white font-black py-3 px-10 rounded-full text-xl transition transform hover:scale-105 shadow-xl"
                            >
                                {currentIdx < patients.length - 1 ? '下一位病患 ➡️' : '查看值班報告 📋'}
                            </button>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};
