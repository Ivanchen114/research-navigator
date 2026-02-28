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
            <div className="bg-slate-50/50 rounded-xl overflow-hidden flex flex-col items-center justify-center p-6 md:py-16 font-sans text-slate-800 min-h-[600px]">
                <div className="bg-white p-8 md:p-12 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] max-w-xl w-full text-center border-t-[12px] border-red-500 relative overflow-hidden">
                    <div className="absolute top-0 right-0 opacity-5 text-9xl -mt-4 -mr-4 text-slate-900">🏥</div>
                    <div className="text-7xl mb-6 animate-pulse">🚑</div>
                    <h1 className="text-3xl md:text-5xl font-black text-slate-800 mb-4 tracking-wide">Level 1：問題急診室</h1>
                    <h2 className="text-xl md:text-2xl font-bold text-slate-500 mb-6 border-b border-slate-100 pb-4">研究問題健檢大挑戰</h2>
                    <p className="text-slate-600 text-lg mb-8 font-medium leading-relaxed">
                        急診室湧入了 10 個<span className="text-red-500 font-bold">「生病的研究問題」</span>！<br />
                        有些問題可能需要<span className="text-blue-500 font-bold border-b-2 border-blue-200 px-1">「多張處方」</span>才能治癒它。<br />
                        你能對症下藥，拿滿 <span className="font-bold text-slate-800 bg-yellow-200 px-2 rounded">100 分</span> 嗎？
                    </p>

                    <div className="bg-slate-50 rounded-2xl p-6 mb-8 text-left border border-slate-200 shadow-sm">
                        <label className="block text-sm font-bold text-slate-700 mb-2 tracking-wider">👨‍⚕️ 急診醫師代號 (姓名)</label>
                        <input
                            type="text"
                            value={playerName}
                            onChange={(e) => setPlayerName(e.target.value)}
                            placeholder="請輸入你的名字..."
                            className="w-full bg-white border-2 border-slate-200 focus:border-red-400 rounded-xl outline-none px-4 py-3 font-bold text-lg text-slate-800 placeholder-slate-300 mb-5 transition-colors text-center"
                        />

                        <h3 className="text-sm font-bold text-slate-500 mb-3 tracking-wider border-t border-slate-200 pt-4">📋 值班須知（提示與重考機制）</h3>
                        <div className="space-y-3 text-sm text-slate-600">
                            <p className="flex items-start gap-2">✅ <span><span className="text-emerald-600 font-bold bg-emerald-50 px-2 rounded">精準投藥 (+10 分)</span><br />完全正確勾選所有處方即可得分。</span></p>
                            <p className="flex items-start gap-2">🔄 <span><span className="text-amber-600 font-bold bg-amber-50 px-2 rounded">修改處方 (-2 分)</span><br />若第一次開錯藥，系統會給予提示（例如：少開/多開），讓你修改並「補考」一次。</span></p>
                            <p className="flex items-start gap-2">⚠️ <span><span className="text-red-500 font-bold bg-red-50 px-2 rounded">醫療糾紛 (+0 分)</span><br />若修改後依然錯誤，就真的急救失敗了。</span></p>
                            <p className="flex items-start gap-2">🔍 <span><span className="text-blue-500 font-bold bg-blue-50 px-2 rounded">顧問報告 (-3 分)</span><br />若完全沒頭緒，一開始就能花分數查看報告。</span></p>
                        </div>
                    </div>

                    <button
                        onClick={startGame}
                        disabled={!playerName.trim()}
                        className={`font-black py-4 px-10 rounded-full text-xl transition transform shadow-[0_8px_20px_rgba(239,68,68,0.3)] hover:shadow-[0_12px_25px_rgba(239,68,68,0.4)] flex items-center justify-center gap-2 mx-auto ${!playerName.trim() ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none hover:shadow-none' : 'bg-red-500 hover:bg-red-600 text-white hover:scale-105 active:scale-95'}`}
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
        let bg = "";
        if (score === 100) { title = "🏆 完美的神醫！"; color = "text-amber-600"; bg = "bg-amber-50"; }
        else if (score >= 80) { title = "👨‍⚕️ 主治醫師！"; color = "text-blue-600"; bg = "bg-blue-50"; }
        else if (score >= 60) { title = "🩺 住院醫師！"; color = "text-emerald-600"; bg = "bg-emerald-50"; }
        else { title = "💊 實習生，多加練習！"; color = "text-red-600"; bg = "bg-red-50"; }

        return (
            <div className="bg-slate-50/50 rounded-xl overflow-hidden flex flex-col items-center justify-center p-6 md:py-10 font-sans text-slate-800 min-h-[600px]">
                <div className="bg-white p-8 md:p-12 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] max-w-2xl w-full text-center border-t-[12px] border-blue-500 relative">
                    <div className="absolute top-6 left-6 text-slate-200 text-6xl">📋</div>
                    <h1 className="text-2xl font-bold text-slate-400 mb-2 tracking-widest relative z-10">急診交班報告</h1>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6 relative z-10">
                        <div className="text-sm font-medium text-slate-400 bg-slate-50 px-4 py-1 rounded-full border border-slate-200">值班時間：{formatTime(timer)}</div>
                        <div className="text-sm font-medium text-blue-600 bg-blue-50 px-4 py-1 rounded-full border border-blue-200">主治醫師：<span className="font-bold">{playerName}</span></div>
                    </div>

                    <div className="flex flex-col items-center justify-center mb-6 relative z-10">
                        <div className="text-7xl font-black text-blue-600 tracking-tighter mb-2">{score} <span className="text-3xl text-slate-300 font-medium">/ 100</span></div>
                        <h2 className={`text-2xl md:text-3xl font-black px-6 py-2 rounded-2xl ${color} ${bg} mb-4`}>{title}</h2>

                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest bg-slate-50 py-2 px-6 rounded-lg border border-slate-200 mb-2">請截圖此頁面作為紀錄</p>

                        <div className="flex gap-4 mt-6">
                            <div className="bg-emerald-50 border border-emerald-100 px-4 py-2 rounded-lg">
                                <span className="text-emerald-600 font-bold block text-xl">{10 - wrongCases.length}</span>
                                <span className="text-xs text-emerald-800 font-medium">成功治癒</span>
                            </div>
                            <div className="bg-red-50 border border-red-100 px-4 py-2 rounded-lg">
                                <span className="text-red-600 font-bold block text-xl">{wrongCases.length}</span>
                                <span className="text-xs text-red-800 font-medium">醫療誤診</span>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => setGameState('start')}
                        className="bg-white hover:bg-slate-50 text-blue-600 font-bold py-3 px-8 rounded-full text-lg transition transform hover:scale-105 shadow-md hover:shadow-lg mb-8 border-2 border-blue-100 flex items-center justify-center gap-2 mx-auto"
                    >
                        重新開始實習 🔄
                    </button>

                    {wrongCases.length > 0 && (
                        <div className="text-left bg-slate-50 p-6 md:p-8 rounded-2xl border-l-8 border-red-400 max-h-[400px] overflow-y-auto shadow-inner">
                            <h3 className="text-xl font-black mb-6 flex items-center gap-2 text-slate-700 border-b border-slate-200 pb-4">
                                🚨 誤診檢討筆記
                            </h3>
                            <div className="space-y-5">
                                {wrongCases.map((wc, i) => (
                                    <div key={i} className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 relative overflow-hidden">
                                        <div className="absolute top-0 left-0 w-1 h-full bg-red-400"></div>
                                        <p className="font-bold text-slate-800 text-lg mb-2 flex items-start gap-2">🤒「{wc.question}」</p>
                                        <p className="text-sm text-slate-500 mb-3 bg-slate-50 inline-block px-2 py-1 rounded">病因診斷：{wc.diagnosis}</p>
                                        <div className="mb-3">
                                            <p className="text-sm font-bold text-slate-500 mb-2">✅ 完整標準處方應為：</p>
                                            <div className="flex flex-wrap gap-2">
                                                {wc.correctRxs.map(rx => (
                                                    <span key={rx} className="bg-emerald-50 text-emerald-700 font-bold px-3 py-1 rounded-lg text-sm border border-emerald-200">
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
                        <div className="bg-emerald-50 text-emerald-700 border border-emerald-200 p-6 rounded-2xl font-bold text-lg shadow-sm flex items-center justify-center gap-3 mt-6">
                            <span className="text-3xl">🎉</span>
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
        <div className="bg-slate-50/50 rounded-xl overflow-hidden flex flex-col items-center p-4 md:p-8 font-sans min-h-[600px] text-slate-800">
            <div className="max-w-4xl w-full">

                {/* Progress & Score */}
                <div className="flex flex-wrap justify-between items-center gap-3 mb-6 px-1">
                    <div className="bg-white text-slate-500 font-bold px-5 py-2 rounded-full shadow-sm text-lg border border-slate-200 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                        病患 {currentIdx + 1} <span className="opacity-40 font-normal">/ {patients.length}</span>
                    </div>

                    <div className="bg-white text-emerald-600 font-bold px-5 py-2 rounded-full shadow-sm text-lg border border-emerald-200 flex items-center gap-2">
                        <span>總積分</span>
                        <span className="bg-emerald-100 text-emerald-700 px-3 py-0.5 rounded-md font-black min-w-[3rem] text-center">{score}</span>
                    </div>
                </div>

                {/* Patient Card */}
                <div className={`bg-white p-6 md:p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] mb-8 border-t-[8px] transition-all relative overflow-hidden ${isBoss ? 'border-purple-500 shadow-[0_10px_40px_rgba(168,85,247,0.15)]' : 'border-blue-400'}`}>
                    {isBoss && (
                        <div className="absolute top-0 right-0 bg-purple-500 text-white text-xs font-black px-5 py-1.5 rounded-bl-xl tracking-widest animate-pulse shadow-md z-10">
                            ☠️ 超級重症
                        </div>
                    )}

                    <div className="absolute -bottom-10 -right-10 text-9xl opacity-5 text-slate-900 pointer-events-none">
                        🏥
                    </div>

                    <div className="flex items-center gap-2 flex-wrap mb-4 pb-4 border-b border-slate-100 relative z-10">
                        {/* Always visible severity badge */}
                        <span className={`${sv.bg} ${sv.color} font-bold px-4 py-1.5 rounded-xl border ${sv.border} shadow-sm inline-flex items-center gap-1.5`}>
                            <span className="text-base leading-none">{sv.icon}</span> {sv.label}
                        </span>

                        {/* Hint Area Toggle Info */}
                        {hintUsed && (
                            <span className="text-amber-600 bg-amber-50 px-3 py-1 text-xs font-bold rounded-full border border-amber-200 ml-auto flex items-center gap-1">
                                <span className="opacity-70 animate-ping h-2 w-2 rounded-full bg-amber-500"></span>
                                已啟用檢查報告 (-3 分)
                            </span>
                        )}
                        {submitAttempts > 0 && !isAnswered && (
                            <span className="text-amber-500 bg-amber-50 px-3 py-1 text-xs font-bold rounded-full border border-amber-200 ml-2 flex items-center gap-1">
                                <span>⚠️</span>
                                處方重調中 (-2 分)
                            </span>
                        )}
                    </div>

                    <div className="relative z-10 text-center py-4">
                        <p className="text-2xl md:text-3xl font-black text-slate-800 leading-tight">
                            「{current.question}」
                        </p>
                    </div>

                    {/* Hint Component */}
                    {(!hintUsed && !isAnswered) ? (
                        <div className="bg-slate-50 border border-slate-200 border-dashed rounded-2xl p-5 flex flex-col items-center justify-center gap-3 mt-4 relative z-10 mx-auto max-w-md">
                            <p className="text-slate-500 font-bold mb-1 text-sm">完全沒頭緒，不知道這病人哪裡有問題？</p>
                            <button
                                onClick={() => setHintUsed(true)}
                                className="bg-white hover:bg-amber-50 text-amber-700 font-bold py-2.5 px-6 rounded-xl transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 border border-slate-200 hover:border-amber-300 shadow-sm w-full"
                            >
                                <span>🔍</span> 申請醫療顧問檢查報告
                                <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-md ml-1 border border-amber-200">扣 3 分</span>
                            </button>
                        </div>
                    ) : (
                        <div className="bg-slate-50 border-x border-b border-t-0 border-slate-200 rounded-b-xl p-5 md:p-6 flex flex-col md:flex-row md:items-start justify-between gap-4 mt-6 relative z-10 animate-in fade-in slide-in-from-top-4 duration-300 -mx-6 md:-mx-10 -mb-6 md:-mb-10 shadow-inner">
                            {/* Tags */}
                            <div className="flex-1 space-y-2">
                                <span className="text-xs font-black tracking-widest text-slate-400 bg-slate-200/50 px-2 py-1 rounded inline-block">病徵標籤</span>
                                <div className="flex flex-wrap gap-2">
                                    {current.tags.map(tag => (
                                        <span key={tag} className="bg-white text-slate-600 font-semibold px-3 py-1.5 rounded-lg text-sm border border-slate-200 shadow-sm leading-none flex items-center gap-1">
                                            <span className="opacity-50">#</span>{tag}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Diagnosis */}
                            <div className="flex-1 space-y-2">
                                <span className="text-xs font-black tracking-widest text-red-500 bg-red-100/50 px-2 py-1 rounded inline-block">醫療團隊初步評估</span>
                                <div className="bg-red-50 text-red-700 px-4 py-3 rounded-xl border border-red-200 shadow-sm">
                                    <span className="font-bold text-lg leading-snug">{current.diagnosis}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Prescription Options */}
                <h3 className="text-slate-600 font-bold text-base mb-4 px-2 tracking-wide flex items-center gap-2">
                    <span className="text-xl">💊</span>
                    <span>請選擇 <span className="text-blue-600 border-b-2 border-blue-200 font-black">所有</span> 病患需要的處方<span className="text-sm font-normal text-slate-400 ml-1">(可複選)</span>：</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {current.shuffledOptions.map((option) => {
                        const isSelected = selectedRxs.includes(option);
                        const isAcutallyCorrect = current.correctRxs.includes(option);

                        // 基礎樣式
                        let buttonStyle = "bg-white text-slate-600 border-2 shadow-sm text-left transition-all duration-200";

                        if (!isAnswered) {
                            // 答題中狀態
                            if (isSelected) {
                                buttonStyle += " border-blue-500 bg-blue-50 translate-y-[2px] shadow-none";
                            } else {
                                buttonStyle += " border-slate-200 hover:border-blue-300 hover:bg-slate-50 active:translate-y-[1px]";
                            }
                        } else {
                            // 結算狀態
                            if (isAcutallyCorrect && isSelected) {
                                buttonStyle += " border-emerald-500 bg-emerald-50 text-emerald-800 shadow-[0_0_10px_rgba(16,185,129,0.2)]";
                            } else if (isAcutallyCorrect && !isSelected) {
                                buttonStyle += " border-red-400 border-dashed bg-white text-slate-400";
                            } else if (!isAcutallyCorrect && isSelected) {
                                buttonStyle += " border-red-400 bg-red-50 text-red-600";
                            } else {
                                buttonStyle += " border-slate-100 bg-white text-slate-300 opacity-60";
                            }
                        }

                        return (
                            <button
                                key={option}
                                onClick={() => toggleRx(option)}
                                disabled={isAnswered}
                                className={`group flex items-center px-5 py-4 rounded-2xl font-bold text-lg ${buttonStyle} ${isAnswered ? 'cursor-default transition-none' : 'cursor-pointer'}`}
                            >
                                <div className="flex items-center gap-4 w-full">
                                    {/* 模擬 Checkbox */}
                                    <div className={`shrink-0 w-6 h-6 rounded flex items-center justify-center border-2 transition-colors ${!isAnswered
                                        ? (isSelected ? 'bg-blue-500 border-blue-500 text-white' : 'border-slate-300 group-hover:border-blue-400 bg-white')
                                        : (isAcutallyCorrect && isSelected ? 'bg-emerald-500 border-emerald-500 text-white'
                                            : !isAcutallyCorrect && isSelected ? 'bg-red-400 border-red-400 text-white'
                                                : isAcutallyCorrect && !isSelected ? 'border-red-400 bg-transparent text-red-400'
                                                    : 'border-slate-200 bg-slate-100')
                                        }`}>
                                        {(!isAnswered && isSelected) && '✓'}
                                        {isAnswered && isAcutallyCorrect && isSelected && '✓'}
                                        {isAnswered && !isAcutallyCorrect && isSelected && '✗'}
                                        {isAnswered && isAcutallyCorrect && !isSelected && '⚠️'}
                                    </div>
                                    <span className="leading-snug">{option}</span>
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* Partial Feedback Alert (Shown when hint is active) */}
                {partialFeedback && !isAnswered && (
                    <div className="w-full mb-6 bg-amber-50 border-2 border-dashed border-amber-300 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom-2 shadow-sm">
                        <div className="flex items-start md:items-center gap-4">
                            <span className="text-3xl shrink-0 mt-1 md:mt-0">🩺</span>
                            <div>
                                <h4 className="font-bold text-amber-700 text-lg mb-1">{partialFeedback.message}</h4>
                                <p className="text-sm text-amber-600 font-medium">請重新思考並調整你的處方再送出 {partialFeedback.hint}</p>
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
                            className={`font-black py-4 px-12 rounded-full text-xl transition transform flex items-center gap-2 shadow-lg ${selectedRxs.length > 0 ? (submitAttempts > 0 ? 'bg-amber-500 hover:bg-amber-600 text-white' : 'bg-slate-800 hover:bg-slate-900 text-white hover:scale-105 active:scale-95') : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'}`}
                        >
                            {submitAttempts === 0 ? '確認開立處方箋 📄' : '重新送出處方箋 🔄'}
                        </button>
                    ) : (
                        <div className={`w-full p-6 md:p-8 rounded-3xl shadow-lg animate-in fade-in slide-in-from-bottom-4 border-l-[12px] ${partialFeedback?.type === 'success' ? 'bg-white border-emerald-500' : 'bg-red-50/50 border-red-500'}`}>
                            <div className="flex items-start justify-between gap-4 mb-4">
                                <div className="flex items-center gap-4">
                                    <div className={`shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-2xl shadow-sm ${partialFeedback?.type === 'success' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                                        {partialFeedback?.type === 'success' ? '🏥' : '🚨'}
                                    </div>
                                    <div>
                                        <h3 className={`text-xl md:text-2xl font-black mb-1 ${partialFeedback?.type === 'success' ? 'text-emerald-600' : 'text-red-600'}`}>
                                            {partialFeedback?.message}
                                        </h3>
                                        {partialFeedback?.type !== 'success' && (
                                            <div className="text-sm text-red-700 font-bold bg-white p-2 rounded border border-red-100 shadow-sm inline-block">
                                                完整標準處方應為：{current.correctRxs.join(" ＋ ")}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className={`flex flex-col items-end shrink-0`}>
                                    <div className={`text-3xl font-black flex items-center gap-1 ${partialFeedback?.type === 'success' ? 'text-emerald-500' : 'text-slate-300'}`}>
                                        {partialFeedback?.type === 'success' ? `+${partialFeedback.pts}` : '0'} <span className="text-base font-bold">分</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm mb-5 relative">
                                <span className="absolute top-0 right-0 p-3 opacity-20 text-3xl pointer-events-none">💡</span>
                                <p className="text-slate-600 text-lg font-medium leading-relaxed relative z-10">
                                    {current.explanation}
                                </p>
                            </div>

                            {/* Show healed question */}
                            {!showHealed ? (
                                <button
                                    onClick={() => setShowHealed(true)}
                                    className="bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold py-3 px-6 rounded-xl transition mb-6 w-full md:w-auto flex justify-center items-center gap-2 border border-blue-200"
                                >
                                    <span>👀</span> 查看治癒後的問題樣貌
                                </button>
                            ) : (
                                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-6 relative overflow-hidden animate-in fade-in slide-in-from-top-2">
                                    <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-500"></div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="bg-blue-100 text-blue-600 text-xs font-black px-2 py-1 rounded-md tracking-widest">AFTER</span>
                                        <p className="text-sm text-blue-800 font-bold">治癒後的研究問題：</p>
                                    </div>
                                    <p className="text-blue-900 text-xl font-bold leading-snug">「{current.healed}」</p>
                                </div>
                            )}

                            <div className="flex justify-end pt-4 border-t border-slate-200">
                                <button
                                    onClick={nextPatient}
                                    className={`font-black py-4 px-10 rounded-full text-xl transition transform hover:scale-105 shadow-md flex items-center gap-2 text-white ${currentIdx < patients.length - 1 ? 'bg-blue-600 hover:bg-blue-700' : 'bg-slate-800 hover:bg-slate-900'}`}
                                >
                                    {currentIdx < patients.length - 1 ? (
                                        <>呼叫下一位病患 <span className="text-2xl leading-none">🩺</span></>
                                    ) : (
                                        <>完成交班，查看報告 <span className="text-2xl leading-none">📋</span></>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};
