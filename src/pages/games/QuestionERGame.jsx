import React, { useState, useEffect } from 'react';

// 題目資料庫：10 個「生病的研究問題」
const patientData = [
    {
        id: 1,
        question: "什麼是溫室效應？",
        diagnosis: "Google 直接答症",
        correctRxs: ["把常識問題轉為在地探究", "縮小研究範圍"],
        options: [
            "把常識問題轉為在地探究",
            "縮小研究範圍",
            "加入衝突點",
            "增加可測量變項"
        ],
        healed: "本校教室冷氣使用量與學生節能意識之間的落差？",
        explanation: "這個問題 AI 一秒就能回答，代表它沒有研究價值。必須轉化為你身邊才看得到的「在地現象」，同時也必須「縮小範圍」到一個特定的場域（如學校）。",
        severity: "mild",
        tags: ["太常識", "AI能直接答"]
    },
    {
        id: 2,
        question: "青少年喜歡滑手機嗎？",
        diagnosis: "答案顯而易見症 + 封閉式提問症",
        correctRxs: ["加入衝突點", "改為開放式探究"],
        options: [
            "加入衝突點",
            "把常識問題轉為在地探究",
            "改為開放式探究",
            "增加可測量變項"
        ],
        healed: "為什麼本校學生明知滑手機影響睡眠，卻仍在睡前平均使用 2 小時以上？",
        explanation: "「喜歡滑手機」人人都知道，且「喜歡嗎？」只能回答是或否。加入「明知有害卻還是做」的衝突點，並改為問「為什麼」，問題就活了！",
        severity: "moderate",
        tags: ["太顯而易見", "缺乏衝突"]
    },
    {
        id: 3,
        question: "如何解決全球貧窮問題？",
        diagnosis: "範圍膨脹症",
        correctRxs: ["縮小研究範圍", "聚焦可行面"],
        options: [
            "縮小研究範圍",
            "聚焦可行面",
            "把常識問題轉為在地探究",
            "改為因果假設"
        ],
        healed: "本校弱勢補助學生在學用品支出上面臨哪些具體困難？",
        explanation: "全球貧窮這個題目寫一輩子都寫不完！要「縮小範圍」到你身邊，並「聚焦可行面」（如學用品支出），確保高中生有能力收集資料。",
        severity: "severe",
        tags: ["範圍太大", "無法執行"]
    },
    {
        id: 4,
        question: "社群媒體對年輕人有什麼影響？",
        diagnosis: "定義模糊症",
        correctRxs: ["增加可測量變項", "縮小研究範圍"],
        options: [
            "增加可測量變項",
            "縮小研究範圍",
            "加入衝突點",
            "把常識問題轉為在地探究"
        ],
        healed: "本校高一生每日 Instagram 使用時間與自我形象滿意度之間的關聯？",
        explanation: "「社群媒體」和「影響」太模糊了。必須把抽象概念換成具體「可測量」的變項（使用時間、滿意度分數），並將對象「縮小範圍」至高中生。",
        severity: "moderate",
        tags: ["定義模糊", "不可測量"]
    },
    {
        id: 5,
        question: "為什麼台灣教育這麼失敗？",
        diagnosis: "預設立場症",
        correctRxs: ["移除主觀價值判斷", "把常識問題轉為在地探究"],
        options: [
            "移除主觀價值判斷",
            "縮小研究範圍",
            "增加可測量變項",
            "把常識問題轉為在地探究"
        ],
        healed: "本校學生對 108 課綱自主學習計畫的執行困難與需求調查",
        explanation: "「教育失敗」是個人價值判斷，不是客觀事實。必須「移除主觀判斷」保持中立，並將龐大的台灣教育議題「轉為在地」（本校課綱執行狀況）。",
        severity: "severe",
        tags: ["預設立場", "主觀價值"]
    },
    {
        id: 6,
        question: "學生壓力大嗎？",
        diagnosis: "封閉式提問症 + 範圍膨脹症",
        correctRxs: ["改為開放式探究", "縮小研究範圍", "增加可測量變項"],
        options: [
            "改為開放式探究",
            "加入衝突點",
            "增加可測量變項",
            "縮小研究範圍"
        ],
        healed: "本校高三生在學測前三個月的壓力來源分佈？",
        explanation: "「大嗎？」只能答是或否，且「學生」範圍太廣、「壓力」難以量化。必須改為開放式（來源分佈）、縮小對象（高三生），並變成具體變項。",
        severity: "severe",
        tags: ["封閉式問題", "只能答是否"]
    },
    {
        id: 7,
        question: "網路霸凌會導致自殺嗎？",
        diagnosis: "倫理風險症 + 範圍膨脹症",
        correctRxs: ["降低敏感度並聚焦可行面", "移除因果斷定", "縮小研究範圍"],
        options: [
            "降低敏感度並聚焦可行面",
            "縮小研究範圍",
            "移除因果斷定",
            "增加可測量變項"
        ],
        healed: "高中生遭遇網路負面言論時的情緒反應與求助行為調查",
        explanation: "探討「自殺」會觸及重大倫理風險，且「導致」的因果關係極難由高中生證明。應「降低敏感度」探討情緒反應，並「移除絕對的因果斷定」。此外，沒有界定對象，也需要補上「縮小研究範圍」（如高中生）。",
        severity: "severe",
        tags: ["倫理敏感", "範圍太大"]
    },
    {
        id: 8,
        question: "手搖飲對身體好不好？",
        diagnosis: "Google 直接答症 + 定義模糊症",
        correctRxs: ["把常識問題轉為在地探究", "加入衝突點", "增加可測量變項"],
        options: [
            "把常識問題轉為在地探究",
            "改為開放式探究",
            "增加可測量變項",
            "加入衝突點"
        ],
        healed: "本校學生每週手搖飲消費杯數與其對含糖飲料健康風險認知程度間的落差？",
        explanation: "「好不好」大家心知肚明，缺乏研究張力，且「身體」定義模糊。加上「明知道不好還是喝」的衝突點，並改為可測量的「杯數」與「認知分數」。",
        severity: "boss",
        tags: ["雙重病症", "常識+封閉"]
    },
    {
        id: 9,
        question: "AI 會取代老師嗎？",
        diagnosis: "預測未來症 + 範圍膨脹症",
        correctRxs: ["改成現在式的可驗證問題", "把大哉問轉為在地探究", "縮小研究範圍"],
        options: [
            "改成現在式的可驗證問題",
            "縮小研究範圍",
            "移除主觀價值判斷",
            "把大哉問轉為在地探究"
        ],
        healed: "本校師生對 AI 輔助教學的接受度差異，以及雙方認為最適合的應用環節？",
        explanation: "這是一個沒有標準答案的「大哉問」，且「預測未來」無法收集數據驗證。必須把時間軸拉回「現在（改成可驗證的問題）」，並且不要空談世界趨勢，而是結合「縮小範圍」將大哉問「轉為在地探究」，討論校內師生目前的真實態度。",
        severity: "severe",
        tags: ["預測未來", "大哉問", "無法驗證"]
    },
    {
        id: 10,
        question: "🔥 為什麼現在的學生都不讀書只打遊戲而且品德越來越差同時也不尊重老師？",
        diagnosis: "多重器官衰竭症（超級重症）",
        correctRxs: ["拆解問題並逐一聚焦", "移除主觀價值判斷", "縮小研究範圍"],
        options: [
            "拆解問題並逐一聚焦",
            "移除主觀價值判斷",
            "縮小研究範圍",
            "改成現在式的可驗證問題"
        ],
        healed: "本校學生課後時間分配中，遊戲娛樂與課業複習的比例關係為何？",
        explanation: "這個問題塞了太多東西（多管問題）！必須「拆解」只挑一個重點做。同時含有強烈的「預設立場」（品德差），必須移除。並將對象「縮小」到特定群體。",
        severity: "boss",
        tags: ["預設立場", "多管問題", "範圍太大", "價值判斷"]
    }
];

// 病情嚴重度樣式
const severityStyles = {
    mild: { bg: "bg-green-50", border: "border-green-200", label: "輕症", color: "text-green-700", icon: "🤒" },
    moderate: { bg: "bg-amber-50", border: "border-amber-200", label: "中度", color: "text-amber-700", icon: "🤕" },
    severe: { bg: "bg-red-50", border: "border-red-200", label: "重症", color: "text-red-700", icon: "🚑" },
    boss: { bg: "bg-purple-50", border: "border-purple-200", label: "超級重症", color: "text-purple-700", icon: "☠️" }
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
    const [gameState, setGameState] = useState('start');
    const [playerName, setPlayerName] = useState('');
    const [patients, setPatients] = useState([]);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [score, setScore] = useState(0);

    // 現在是陣列型態的反選
    const [selectedRxs, setSelectedRxs] = useState([]);

    const [isAnswered, setIsAnswered] = useState(false);
    const [wrongCases, setWrongCases] = useState([]);
    const [showHealed, setShowHealed] = useState(false);
    const [timer, setTimer] = useState(0);

    // 新增：提示與重試機制
    const [hintUsed, setHintUsed] = useState(false);
    const [submitAttempts, setSubmitAttempts] = useState(0);
    const [partialFeedback, setPartialFeedback] = useState(null); // { type: 'success'|'missing'|'extra'|'both'|'fail', message: string, pts?: number }

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
        const prepared = patientData.map(p => ({
            ...p,
            shuffledOptions: shuffleArray(p.options)
        }));
        setPatients(prepared);
        setWrongCases([]);
        setCurrentIdx(0);
        setScore(0);
        setSelectedRxs([]); // 初始化為空陣列
        setIsAnswered(false);
        setShowHealed(false);
        setHintUsed(false);
        setSubmitAttempts(0);
        setPartialFeedback(null);
        setTimer(0);
        setGameState('playing');
    };

    const toggleRx = (option) => {
        if (isAnswered) return;
        // 如果正在顯示 partialFeedback (重試階段)，可以繼續切換，切換時維持 feedback (或者您可以選擇清空它)
        setSelectedRxs(prev =>
            prev.includes(option)
                ? prev.filter(item => item !== option)
                : [...prev, option]
        );
    };

    const submitAnswer = () => {
        if (isAnswered || selectedRxs.length === 0) return;

        const current = patients[currentIdx];

        // 判斷是否全對（無多選或少選）
        const isCorrect = arraysEqual(selectedRxs, current.correctRxs);

        if (isCorrect) {
            // 全對
            setIsAnswered(true);
            let pts = 10;
            if (hintUsed) pts -= 3;
            // 每次重試成功扣 2 分
            if (submitAttempts > 0) pts -= (submitAttempts * 2);
            // 最低得 1 分
            if (pts < 1) pts = 1;

            setScore(s => s + pts);
            setPartialFeedback({ type: 'success', message: `精準診斷！成功治癒病患`, pts: pts });
        } else {
            // 答錯邏輯
            if (submitAttempts === 0) {
                // 第一次答錯，給予提示
                const missing = current.correctRxs.filter(rx => !selectedRxs.includes(rx));
                const extra = selectedRxs.filter(rx => !current.correctRxs.includes(rx));

                let feedbackType = '';
                let message = '';

                if (missing.length > 0 && extra.length === 0) {
                    feedbackType = 'missing';
                    message = `你少開了 ${missing.length} 張處方！病患還沒痊癒。`;
                } else if (extra.length > 0 && missing.length === 0) {
                    feedbackType = 'extra';
                    message = `你多開了 ${extra.length} 張不必要的處方！會產生副作用。`;
                } else {
                    feedbackType = 'both';
                    message = `處方有誤！既少開了必備處方，又開了不必要的藥。`;
                }

                setPartialFeedback({
                    type: feedbackType,
                    message: message,
                    hint: `(重新評估扣 2 分)`
                });
                setSubmitAttempts(1);
            } else {
                // 第二次也答錯，直接失敗
                setIsAnswered(true);
                setWrongCases(prev => [...prev, current]);
                setPartialFeedback({ type: 'fail', message: `兩次處方皆有誤！發生醫療糾紛。`, pts: 0 });
            }
        }
    };

    const nextPatient = () => {
        if (currentIdx < patients.length - 1) {
            setCurrentIdx(i => i + 1);
            setSelectedRxs([]);
            setIsAnswered(false);
            setShowHealed(false);
            setHintUsed(false);
            setSubmitAttempts(0);
            setPartialFeedback(null);
        } else {
            setGameState('end');
        }
    };

    // ================= START SCREEN =================
    if (gameState === 'start') {
        return (
            <div className="relative rounded-sm overflow-hidden flex flex-col items-center justify-center p-6 md:py-16 font-sans text-rose-50 min-h-[700px] bg-cover bg-fixed bg-center shadow-2xl"
                style={{ backgroundImage: "url('/images/question_er_bg.png')" }}>
                <div className="absolute inset-0 bg-slate-900/75 backdrop-blur-none z-0"></div>

                <div className="bg-slate-900/60 backdrop-blur-lg p-8 md:p-12 rounded-sm shadow-[0_0_40px_rgba(244,63,94,0.2)] max-w-xl w-full text-center border border-white/10 border-t-[12px] border-t-rose-500 relative overflow-hidden z-10">
                    <div className="absolute top-0 right-0 opacity-10 text-9xl -mt-4 -mr-4 text-rose-400 drop-shadow-[0_0_15px_rgba(244,63,94,0.5)]">🏥</div>
                    <div className="text-7xl mb-6 animate-pulse drop-shadow-[0_0_15px_rgba(244,63,94,0.8)]">🚑</div>
                    <h1 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-300 to-red-500 mb-2 tracking-wide drop-shadow-sm">行動代號：靶心</h1>
                    <div className="text-sm md:text-base font-bold text-rose-300/80 mb-4 bg-rose-950/40 inline-block px-3 py-1 rounded border border-rose-500/20 tracking-wider">
                        🎯 研究問題精煉與對焦訓練
                    </div>
                    <p className="text-slate-300 mb-8 max-w-lg mx-auto leading-relaxed">
                        急診室湧入了 10 個<span className="text-rose-400 font-bold drop-shadow-[0_0_8px_rgba(244,63,94,0.6)]">「生病的研究問題」</span>！<br />
                        有些問題可能需要<span className="text-cyan-400 font-bold border-b-2 border-cyan-400/50 drop-shadow-[0_0_8px_rgba(34,211,238,0.6)] px-1">「多張處方」</span>才能治癒它。<br />
                        你能對症下藥，拿滿 <span className="font-bold text-amber-300 bg-amber-900/40 px-2 rounded border border-amber-500/30 drop-shadow-sm">100 分</span> 嗎？
                    </p>

                    <div className="bg-slate-800/50 rounded-sm p-6 mb-8 text-center border border-slate-600/50 shadow-inner">
                        <label className="block text-sm font-bold text-rose-300 mb-2 tracking-wider drop-shadow-sm">👨‍⚕️ 目前登入身分</label>
                        {playerName ? (
                            <div className="text-2xl font-black text-rose-400 border-b-2 border-rose-500/50 inline-block pb-1 px-4 drop-shadow-[0_0_10px_rgba(244,63,94,0.4)]">{playerName} 醫師</div>
                        ) : (
                            <div className="text-amber-400 font-bold mb-2 drop-shadow-sm">無法辨識身分！請返回總部大廳完成報到手續。</div>
                        )}

                        <h3 className="text-sm font-bold text-slate-400 mb-3 tracking-wider border-t border-slate-700 pt-6 mt-6">📋 值班須知（提示與重考機制）</h3>
                        <div className="space-y-3 text-sm text-slate-300 text-left">
                            <p className="flex items-start gap-2">✅ <span><span className="text-emerald-400 font-bold bg-emerald-900/40 px-2 rounded border border-emerald-500/20 shadow-sm">精準投藥 (+10 分)</span><br />完全正確勾選所有處方即可得分。</span></p>
                            <p className="flex items-start gap-2">🔄 <span><span className="text-amber-400 font-bold bg-amber-900/40 px-2 rounded border border-amber-500/20 shadow-sm">修改處方 (-2 分)</span><br />若第一次開錯藥，系統會給予提示，讓你修改並「補考」一次。</span></p>
                            <p className="flex items-start gap-2">⚠️ <span><span className="text-rose-400 font-bold bg-rose-900/40 px-2 rounded border border-rose-500/20 shadow-sm">醫療糾紛 (+0 分)</span><br />若修改後依然錯誤，就真的急救失敗了。</span></p>
                            <p className="flex items-start gap-2">🔍 <span><span className="text-cyan-400 font-bold bg-cyan-900/40 px-2 rounded border border-cyan-500/20 shadow-sm">顧問報告 (-3 分)</span><br />若完全沒頭緒，一開始就能花分數查看報告。</span></p>
                        </div>
                    </div>

                    <button
                        onClick={startGame}
                        disabled={!playerName}
                        className={`font-black py-4 px-10 rounded-sm text-xl transition-all duration-300 transform shadow-[0_0_20px_rgba(244,63,94,0.4)] flex items-center justify-center gap-2 mx-auto overflow-hidden group ${!playerName ? 'bg-slate-700 text-slate-500 cursor-not-allowed shadow-none' : 'bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white hover:scale-105 active:scale-95 hover:shadow-[0_0_30px_rgba(244,63,94,0.6)] border border-rose-400/50'}`}
                    >
                        <span className="relative z-10">穿上白袍，開始值班 🩺</span>
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
        if (score === 100) { title = "🏆 完美的神醫！"; color = "text-amber-400"; bg = "bg-amber-900/40"; borderColor = "border-amber-500/50"; }
        else if (score >= 80) { title = "👨‍⚕️ 主治醫師！"; color = "text-cyan-400"; bg = "bg-cyan-900/40"; borderColor = "border-cyan-500/50"; }
        else if (score >= 60) { title = "🩺 住院醫師！"; color = "text-emerald-400"; bg = "bg-emerald-900/40"; borderColor = "border-emerald-500/50"; }
        else { title = "💊 實習生，多加練習！"; color = "text-rose-400"; bg = "bg-rose-900/40"; borderColor = "border-rose-500/50"; }

        return (
            <div className="relative rounded-sm overflow-hidden flex flex-col items-center justify-center p-6 md:py-10 font-sans text-blue-50 min-h-[700px] bg-cover bg-fixed bg-center shadow-2xl"
                style={{ backgroundImage: "url('/images/question_er_bg.png')" }}>
                <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm z-0"></div>

                <div className="bg-slate-900/70 backdrop-blur-lg p-8 md:p-12 rounded-sm shadow-[0_0_50px_rgba(0,0,0,0.5)] max-w-2xl w-full text-center border-t-[12px] border-t-rose-500 border-x border-b border-white/10 relative z-10">
                    <div className="absolute top-6 left-6 text-rose-500/20 text-6xl drop-shadow-md">📋</div>
                    <h2 className="text-2xl font-black text-amber-500 mb-4 tracking-widest drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]">🎯 任務結案報告</h2>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6 relative z-10">
                        <div className="text-sm font-medium text-slate-400 bg-slate-800/60 shadow-inner px-4 py-1 rounded-sm border border-slate-600/50">值班時間：{formatTime(timer)}</div>
                        <div className="text-sm font-medium text-rose-300 bg-rose-900/40 shadow-inner px-4 py-1 rounded-sm border border-rose-500/30">主治醫師：<span className="font-bold">{playerName}</span></div>
                    </div>

                    <div className="flex flex-col items-center justify-center mb-6 relative z-10">
                        <div className="text-7xl font-black text-rose-400 tracking-tighter mb-2 drop-shadow-[0_0_15px_rgba(244,63,94,0.5)]">{score} <span className="text-3xl text-slate-500 font-medium">/ 100</span></div>
                        <h2 className={`text-2xl md:text-3xl font-black px-6 py-2 rounded-sm ${color} ${bg} border ${borderColor} mb-4 shadow-lg drop-shadow-md`}>{title}</h2>

                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest bg-slate-800/80 py-2 px-6 rounded-sm border border-slate-700 shadow-inner mb-2">請截圖此畫面作為紀錄</p>

                        <div className="flex gap-4 mt-6">
                            <div className="bg-emerald-900/40 border border-emerald-500/50 shadow-inner px-5 py-3 rounded-sm flex flex-col items-center">
                                <span className="text-emerald-400 font-black block text-2xl drop-shadow-sm">{10 - wrongCases.length}</span>
                                <span className="text-xs text-emerald-200/60 font-medium tracking-wider mt-1">成功治癒</span>
                            </div>
                            <div className="bg-rose-900/40 border border-rose-500/50 shadow-inner px-5 py-3 rounded-sm flex flex-col items-center">
                                <span className="text-rose-400 font-black block text-2xl drop-shadow-sm">{wrongCases.length}</span>
                                <span className="text-xs text-rose-200/60 font-medium tracking-wider mt-1">醫療誤診</span>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => setGameState('start')}
                        className="bg-slate-800/80 hover:bg-slate-700 text-rose-400 font-bold py-3 px-8 rounded-sm text-lg transition-all duration-300 transform hover:scale-105 shadow-[0_0_15px_rgba(244,63,94,0.2)] hover:shadow-[0_0_25px_rgba(244,63,94,0.5)] mb-8 border border-rose-500/50 flex items-center justify-center gap-2 mx-auto relative z-10 backdrop-blur-sm"
                    >
                        重新開始實習 🔄
                    </button>

                    {wrongCases.length > 0 && (
                        <div className="text-left bg-slate-800/40 p-6 md:p-8 rounded-sm border-l-8 border-rose-500 max-h-[400px] overflow-y-auto shadow-inner border-y border-r border-white/5 scrollbar-thin scrollbar-thumb-rose-700 scrollbar-track-slate-800">
                            <h3 className="text-xl font-black mb-6 flex items-center gap-2 text-rose-300 border-b border-slate-700 pb-4 drop-shadow-sm">
                                🚨 誤診檢討筆記
                            </h3>
                            <div className="space-y-5">
                                {wrongCases.map((wc, i) => (
                                    <div key={i} className="bg-slate-900/80 p-5 rounded-sm shadow-lg border border-slate-700 relative overflow-hidden group hover:border-rose-500/50 transition-colors">
                                        <div className="absolute top-0 left-0 w-1.5 h-full bg-rose-500 drop-shadow-[0_0_8px_rgba(244,63,94,0.8)]"></div>
                                        <p className="font-bold text-rose-100 text-lg mb-2 flex items-start gap-2">🤒「{wc.question}」</p>
                                        <p className="text-sm text-slate-300 mb-3 bg-slate-800/80 inline-block px-3 py-1.5 rounded border border-slate-600/50 shadow-inner">病因診斷：<span className="text-rose-300 font-bold">{wc.diagnosis}</span></p>
                                        <div className="mb-3">
                                            <p className="text-sm font-bold text-slate-400 mb-2">✅ 完整標準處方應為：</p>
                                            <div className="flex flex-wrap gap-2">
                                                {wc.correctRxs.map(rx => (
                                                    <span key={rx} className="bg-emerald-900/40 text-emerald-400 font-bold px-3 py-1 rounded-sm text-sm border border-emerald-500/40 shadow-inner">
                                                        💊 {rx}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {wrongCases.length === 0 && (
                        <div className="bg-emerald-900/40 text-emerald-400 border border-emerald-500/50 p-6 rounded-sm font-bold text-lg shadow-[0_0_20px_rgba(16,185,129,0.2)] flex items-center justify-center gap-3 mt-6 backdrop-blur-sm">
                            <span className="text-3xl drop-shadow-sm">🎉</span>
                            零誤診！各種疑難雜症都難不倒你！
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
        <div className="relative rounded-sm overflow-hidden flex flex-col items-center p-4 md:p-8 font-sans min-h-[700px] text-rose-50 bg-cover bg-fixed bg-center shadow-2xl"
            style={{ backgroundImage: "url('/images/question_er_bg.png')" }}>
            <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm z-0"></div>
            <div className="max-w-4xl w-full relative z-10">

                {/* Progress & Score */}
                <div className="flex flex-wrap justify-between items-center gap-3 mb-6 px-1">
                    <div className="bg-slate-900/60 backdrop-blur-sm text-slate-300 font-bold px-5 py-2 rounded-sm shadow-inner text-lg border border-slate-700 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-rose-500 animate-[pulse_1.5s_ease-in-out_infinite] shadow-[0_0_8px_rgba(244,63,94,0.8)]"></span>
                        病患 <span className="text-rose-400">{currentIdx + 1}</span> <span className="opacity-40 font-normal">/ {patients.length}</span>
                    </div>

                    <div className="bg-slate-900/60 backdrop-blur-sm text-emerald-400 font-bold px-5 py-2 rounded-sm shadow-inner text-lg border border-emerald-500/30 flex items-center gap-2">
                        <span>總積分</span>
                        <span className="bg-emerald-900/50 text-emerald-300 px-3 py-0.5 rounded-md font-black min-w-[3rem] text-center border border-emerald-500/20 shadow-inner drop-shadow-[0_0_5px_rgba(16,185,129,0.5)]">{score}</span>
                    </div>
                </div>

                {/* Patient Card */}
                <div className={`bg-slate-900/70 backdrop-blur-lg p-6 md:p-10 rounded-sm shadow-[0_0_40px_rgba(0,0,0,0.5)] mb-8 border-t-[8px] border-x border-b border-white/10 transition-all relative overflow-hidden group hover:border-rose-500/30 duration-500 ${isBoss ? 'border-t-purple-500 shadow-[0_0_50px_rgba(168,85,247,0.3)]' : 'border-t-rose-500'}`}>
                    {isBoss && (
                        <div className="absolute top-0 right-0 bg-purple-600/90 text-white text-xs font-black px-5 py-1.5 rounded-bl-xl tracking-widest animate-[pulse_2s_infinite] shadow-[0_0_15px_rgba(168,85,247,0.8)] border-b border-l border-purple-400/50 z-20 backdrop-blur-sm">
                            ☠️ 超級重症
                        </div>
                    )}

                    <div className="absolute -bottom-10 -right-10 text-9xl opacity-5 text-rose-500 pointer-events-none drop-shadow-[0_0_20px_rgba(244,63,94,0.5)]">
                        🏥
                    </div>

                    <div className="flex items-center gap-2 flex-wrap mb-4 pb-4 border-b border-slate-700 relative z-10">
                        {/* Always visible severity badge */}
                        <span className={`bg-slate-800/80 font-bold px-4 py-1.5 rounded-sm border border-slate-600 shadow-inner inline-flex items-center gap-1.5 ${current.severity === 'boss' ? 'text-purple-400 border-purple-500/50 drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]' : current.severity === 'severe' ? 'text-rose-400 border-rose-500/50 drop-shadow-[0_0_8px_rgba(244,63,94,0.5)]' : current.severity === 'moderate' ? 'text-amber-400 border-amber-500/50 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]' : 'text-emerald-400 border-emerald-500/50 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]'}`}>
                            <span className="text-base leading-none">{sv.icon}</span> {sv.label}
                        </span>

                        {/* Hint Area Toggle Info */}
                        {hintUsed && (
                            <span className="text-amber-400 bg-amber-900/30 px-3 py-1 text-xs font-bold rounded-sm border border-amber-500/30 ml-auto flex items-center gap-1 shadow-inner">
                                <span className="opacity-80 animate-ping h-2 w-2 rounded-full bg-amber-400 shadow-[0_0_5px_rgba(251,191,36,0.8)]"></span>
                                已啟用檢查報告 (-3 分)
                            </span>
                        )}
                        {submitAttempts > 0 && !isAnswered && (
                            <span className="text-amber-400 bg-amber-900/30 px-3 py-1 text-xs font-bold rounded-sm border border-amber-500/30 ml-2 flex items-center gap-1 shadow-inner">
                                <span>⚠️</span>
                                處方重調中 (-2 分)
                            </span>
                        )}
                    </div>

                    <div className="relative z-10 text-center py-4">
                        <p className="text-2xl md:text-3xl font-black text-rose-100 leading-tight drop-shadow-md">
                            「{current.question}」
                        </p>
                    </div>

                    {/* Hint Component */}
                    {(!hintUsed && !isAnswered) ? (
                        <div className="bg-slate-800/40 border border-slate-600/50 border-dashed rounded-sm p-5 flex flex-col items-center justify-center gap-3 mt-4 relative z-10 mx-auto max-w-md shadow-inner backdrop-blur-none">
                            <p className="text-slate-400 font-bold mb-1 text-sm">完全沒頭緒，不知道這病人哪裡有問題？</p>
                            <button
                                onClick={() => setHintUsed(true)}
                                className="bg-slate-800/80 hover:bg-slate-700 text-amber-400 font-bold py-2.5 px-6 rounded-sm transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 border border-slate-600 hover:border-amber-400/50 shadow-md hover:shadow-[0_0_15px_rgba(251,191,36,0.3)] w-full backdrop-blur-sm"
                            >
                                <span>🔍</span> 申請醫療顧問檢查報告
                                <span className="text-xs bg-amber-900/50 text-amber-300 px-2 py-0.5 rounded-md ml-1 border border-amber-500/30">扣 3 分</span>
                            </button>
                        </div>
                    ) : (
                        <div className="bg-slate-800/60 border-x border-b border-t-0 border-white/5 rounded-b-xl p-5 md:p-6 flex flex-col md:flex-row md:items-start justify-between gap-4 mt-6 relative z-10 animate-in fade-in slide-in-from-top-4 duration-300 -mx-6 md:-mx-10 -mb-6 md:-mb-10 shadow-inner backdrop-blur-sm">
                            {/* Tags */}
                            <div className="flex-1 space-y-2">
                                <span className="text-xs font-black tracking-widest text-slate-400 bg-slate-900/80 border border-slate-700 px-2 py-1 rounded inline-block shadow-inner">病徵標籤</span>
                                <div className="flex flex-wrap gap-2">
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
                                <div className="bg-rose-900/20 text-rose-300 px-4 py-3 rounded-sm border border-rose-500/30 shadow-inner">
                                    <span className="font-bold text-lg leading-snug drop-shadow-[0_0_5px_rgba(244,63,94,0.4)]">{current.diagnosis}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Prescription Options */}
                <h3 className="text-rose-200 font-bold text-base mb-4 px-2 tracking-wide flex items-center gap-2 drop-shadow-sm">
                    <span className="text-xl">💊</span>
                    <span>請選擇 <span className="text-cyan-400 border-b-2 border-cyan-400/50 font-black drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">所有</span> 病患需要的處方<span className="text-sm font-normal text-slate-400 ml-1">(可複選)</span>：</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {current.shuffledOptions.map((option) => {
                        const isSelected = selectedRxs.includes(option);
                        const isAcutallyCorrect = current.correctRxs.includes(option);

                        // 基礎樣式
                        let buttonStyle = "bg-slate-900/60 backdrop-blur-sm border border-slate-700 shadow-[0_4px_15px_rgba(0,0,0,0.3)] text-left transition-all duration-300 relative overflow-hidden group hover:border-cyan-400/50";

                        if (!isAnswered) {
                            // 答題中狀態
                            if (isSelected) {
                                buttonStyle = "bg-cyan-900/30 backdrop-blur-sm border border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.2)] text-left transition-all duration-300 translate-y-[2px] relative overflow-hidden";
                            } else {
                                buttonStyle = "bg-slate-900/60 backdrop-blur-sm border border-slate-700 shadow-[0_4px_15px_rgba(0,0,0,0.3)] text-left transition-all duration-300 hover:border-cyan-400/50 hover:bg-slate-800/80 active:translate-y-[1px] relative overflow-hidden group";
                            }
                        } else {
                            // 結算狀態
                            if (isAcutallyCorrect && isSelected) {
                                buttonStyle = "bg-emerald-900/30 backdrop-blur-sm border border-emerald-400 text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.3)] text-left transition-all duration-300 relative overflow-hidden";
                            } else if (isAcutallyCorrect && !isSelected) {
                                buttonStyle = "bg-slate-900/60 backdrop-blur-sm border border-rose-400 border-dashed text-slate-400 text-left transition-all duration-300 relative overflow-hidden opacity-80";
                            } else if (!isAcutallyCorrect && isSelected) {
                                buttonStyle = "bg-rose-900/30 backdrop-blur-sm border border-rose-500 text-rose-300 shadow-[0_0_20px_rgba(244,63,94,0.3)] text-left transition-all duration-300 relative overflow-hidden";
                            } else {
                                buttonStyle = "bg-slate-900/40 backdrop-blur-sm border border-slate-800 text-slate-500 opacity-50 text-left transition-all duration-300 relative overflow-hidden";
                            }
                        }

                        return (
                            <button
                                key={option}
                                onClick={() => toggleRx(option)}
                                disabled={isAnswered}
                                className={`flex items-center px-5 py-4 rounded-sm font-bold text-lg ${buttonStyle} ${isAnswered ? 'cursor-default' : 'cursor-pointer'}`}
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                <div className="flex items-center gap-4 w-full relative z-10">
                                    {/* 模擬 Checkbox */}
                                    <div className={`shrink-0 w-6 h-6 rounded flex items-center justify-center border-2 transition-colors shadow-inner ${!isAnswered
                                        ? (isSelected ? 'bg-cyan-500 border-cyan-400 text-white shadow-[0_0_10px_rgba(34,211,238,0.5)]' : 'border-slate-500 group-hover:border-cyan-400/50 bg-slate-800/80 text-slate-400')
                                        : (isAcutallyCorrect && isSelected ? 'bg-emerald-500 border-emerald-400 text-white shadow-[0_0_10px_rgba(16,185,129,0.5)]'
                                            : !isAcutallyCorrect && isSelected ? 'bg-rose-500 border-rose-400 text-white shadow-[0_0_10px_rgba(244,63,94,0.5)]'
                                                : isAcutallyCorrect && !isSelected ? 'border-rose-400 border-dashed bg-transparent text-rose-400'
                                                    : 'border-slate-700 bg-slate-800/50 text-slate-600')
                                        }`}>
                                        {(!isAnswered && isSelected) && '✓'}
                                        {isAnswered && isAcutallyCorrect && isSelected && '✓'}
                                        {isAnswered && !isAcutallyCorrect && isSelected && '✗'}
                                        {isAnswered && isAcutallyCorrect && !isSelected && '⚠️'}
                                    </div>
                                    <span className={`leading-snug ${(!isAnswered && !isSelected) ? 'text-slate-300 group-hover:text-rose-100' : ''}`}>{option}</span>
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* Partial Feedback Alert (Shown when hint is active) */}
                {partialFeedback && !isAnswered && (
                    <div className="w-full mb-6 bg-amber-900/30 backdrop-blur-sm border border-amber-500/50 border-dashed rounded-sm p-4 flex flex-col md:flex-row items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom-2 shadow-[0_0_20px_rgba(251,191,36,0.1)]">
                        <div className="flex items-start md:items-center gap-4">
                            <span className="text-3xl shrink-0 mt-1 md:mt-0 drop-shadow-md">🩺</span>
                            <div>
                                <h4 className="font-bold text-amber-400 text-lg mb-1 drop-shadow-[0_0_5px_rgba(251,191,36,0.5)]">{partialFeedback.message}</h4>
                                <p className="text-sm text-amber-200/80 font-medium">請重新思考並調整你的處方再送出 {partialFeedback.hint}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Submit / Feedback Area */}
                <div className="mb-6 flex flex-col items-center">
                    {!isAnswered ? (
                        <button
                            onClick={submitAnswer}
                            disabled={selectedRxs.length === 0}
                            className={`font-black py-4 px-12 rounded-sm text-xl transition-all duration-300 transform flex items-center gap-2 shadow-lg relative overflow-hidden group ${selectedRxs.length > 0 ? (submitAttempts > 0 ? 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-rose-50 border border-amber-400/50 shadow-[0_0_20px_rgba(245,158,11,0.4)]' : 'bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white hover:scale-105 active:scale-95 border border-rose-400/50 shadow-[0_0_20px_rgba(244,63,94,0.4)] hover:shadow-[0_0_30px_rgba(244,63,94,0.6)]') : 'bg-slate-800/80 text-slate-500 cursor-not-allowed border border-slate-700/50 backdrop-blur-none shadow-none'}`}
                        >
                            <span className="relative z-10">{submitAttempts === 0 ? '確認開立處方箋 📄' : '重新送出處方箋 🔄'}</span>
                        </button>
                    ) : (
                        <div className={`w-full p-6 md:p-8 rounded-sm shadow-[0_0_40px_rgba(0,0,0,0.5)] animate-in fade-in slide-in-from-bottom-4 border-l-[12px] backdrop-blur-lg border-y border-r border-white/10 ${partialFeedback?.type === 'success' ? 'bg-emerald-900/20 border-l-emerald-500' : 'bg-rose-900/20 border-l-rose-500'}`}>
                            <div className="flex items-start justify-between gap-4 mb-4">
                                <div className="flex items-center gap-4">
                                    <div className={`shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-2xl shadow-inner border ${partialFeedback?.type === 'success' ? 'bg-emerald-900/50 text-emerald-400 border-emerald-500/30' : 'bg-rose-900/50 text-rose-400 border-rose-500/30'}`}>
                                        {partialFeedback?.type === 'success' ? '🏥' : '🚨'}
                                    </div>
                                    <div>
                                        <h3 className={`text-xl md:text-2xl font-black mb-1 drop-shadow-[0_0_8px_currentColor] ${partialFeedback?.type === 'success' ? 'text-emerald-400' : 'text-rose-400'}`}>
                                            {partialFeedback?.message}
                                        </h3>
                                        {partialFeedback?.type !== 'success' && (
                                            <div className="text-sm text-emerald-400 font-bold bg-slate-900/80 p-2 rounded border border-emerald-500/30 shadow-inner inline-block mt-2">
                                                完整標準處方應為：{current.correctRxs.join(" ＋ ")}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className={`flex flex-col items-end shrink-0 bg-slate-900/60 p-3 rounded-sm border border-white/5 shadow-inner`}>
                                    <div className={`text-3xl font-black flex items-center gap-1 drop-shadow-md ${partialFeedback?.type === 'success' ? 'text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'text-slate-400'}`}>
                                        {partialFeedback?.type === 'success' ? `+${partialFeedback.pts}` : '0'} <span className="text-base font-bold text-slate-500">分</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-slate-900/60 p-5 rounded-sm border border-slate-700 shadow-inner mb-5 relative group hover:border-cyan-500/30 transition-colors">
                                <span className="absolute top-0 right-0 p-3 opacity-20 text-3xl pointer-events-none group-hover:opacity-40 transition-opacity">💡</span>
                                <p className="text-slate-300 text-lg font-medium leading-relaxed relative z-10 group-hover:text-rose-100 transition-colors">
                                    {current.explanation}
                                </p>
                            </div>

                            {/* Show healed question */}
                            {!showHealed ? (
                                <button
                                    onClick={() => setShowHealed(true)}
                                    className="bg-slate-800/80 hover:bg-slate-700 text-cyan-400 font-bold py-3 px-6 rounded-sm transition-all duration-300 mb-6 w-full md:w-auto flex justify-center items-center gap-2 border border-cyan-500/30 shadow-[0_0_15px_rgba(34,211,238,0.1)] hover:shadow-[0_0_20px_rgba(34,211,238,0.3)] backdrop-blur-none mx-auto md:mx-0"
                                >
                                    <span>👀</span> 查看治癒後的問題樣貌
                                </button>
                            ) : (
                                <div className="bg-cyan-900/20 border border-cyan-500/30 rounded-sm p-6 mb-6 relative overflow-hidden animate-in fade-in slide-in-from-top-2 backdrop-blur-none shadow-inner mx-auto md:mx-0">
                                    <div className="absolute top-0 left-0 w-1.5 h-full bg-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]"></div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="bg-cyan-900/80 text-cyan-300 text-xs font-black px-2 py-1 rounded-md tracking-widest border border-cyan-500/50 shadow-inner">AFTER</span>
                                        <p className="text-sm text-cyan-200/80 font-bold">治癒後的研究問題：</p>
                                    </div>
                                    <p className="text-cyan-100 text-xl font-bold leading-snug drop-shadow-[0_0_5px_rgba(34,211,238,0.3)]">「{current.healed}」</p>
                                </div>
                            )}

                            <div className="flex justify-end pt-5 border-t border-slate-700/50">
                                <button
                                    onClick={nextPatient}
                                    className={`font-black py-4 px-10 rounded-sm text-xl transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2 text-white overflow-hidden relative group ${currentIdx < patients.length - 1 ? 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 border border-cyan-400/50 shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:shadow-[0_0_30px_rgba(34,211,238,0.5)]' : 'bg-slate-700 hover:bg-slate-600 border border-slate-500'}`}
                                >
                                    <span className="relative z-10">
                                        {currentIdx < patients.length - 1 ? (
                                            <>呼叫下一位病患 <span className="text-2xl leading-none">🩺</span></>
                                        ) : (
                                            <>完成交班，查看報告 <span className="text-2xl leading-none drop-shadow-md">📋</span></>
                                        )}
                                    </span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};
