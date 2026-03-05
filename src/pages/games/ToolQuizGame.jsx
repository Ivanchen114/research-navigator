import React, { useState } from 'react';

// 題目資料庫：11題 (固定順序，魔王題選項改為具體方法組合)
const quizData = [
    {
        id: 1,
        topic: "委託一：調查本校高一學生的睡眠時間與段考成績的相關性",
        correct: "問卷調查",
        options: ["問卷調查", "深度訪談", "實驗設計", "觀察記錄", "文獻/內容分析", "混合方法"],
        explanation: "✅ 破案線索：需要大樣本和量化數據來跑相關統計。問卷的重點放在睡眠變項與干擾變項（如補習時間）。",
        tags: ["量化數據", "大樣本", "相關性"]
    },
    {
        id: 2,
        topic: "委託二：探究資優生面對學習挫折的深層心理經驗與心態轉折",
        correct: "深度訪談",
        options: ["問卷調查", "深度訪談", "實驗設計", "觀察記錄", "文獻/內容分析", "混合方法"],
        explanation: "✅ 破案線索：挫折是個複雜的故事，我們需要聽故事、追問細節與脈絡。這也可以搭配「半結構式訪談」來進行。",
        tags: ["深層經驗", "個人脈絡", "故事與細節"]
    },
    {
        id: 3,
        topic: "委託三：驗證喝無糖綠茶是否能比喝純水「顯著提升」背單字的速度",
        correct: "實驗設計",
        options: ["問卷調查", "深度訪談", "實驗設計", "觀察記錄", "文獻/內容分析", "混合方法"],
        explanation: "✅ 破案線索：這有明確的「因果假設」。你的工具是整個「實驗流程」，需要操弄變項並設立對照組。",
        tags: ["因果關係", "操弄變項", "控制組/實驗組"]
    },
    {
        id: 4,
        topic: "委託四：查明高中生在走廊邊走邊滑手機的真實狀況與發生碰撞的次數",
        correct: "觀察記錄",
        options: ["問卷調查", "深度訪談", "實驗設計", "觀察記錄", "文獻/內容分析", "混合方法"],
        explanation: "✅ 破案線索：發問卷大家可能會騙你（社會期許偏誤），所以要現場看！記得要先下「操作性定義」（什麼算碰撞？）。",
        tags: ["真實行為", "避免社會期許", "操作性定義"]
    },
    {
        id: 5,
        topic: "委託五：分析過去十年台灣流行歌歌詞中，出現「焦慮」相關詞彙的頻率變化",
        correct: "文獻/內容分析",
        options: ["問卷調查", "深度訪談", "實驗設計", "觀察記錄", "文獻/內容分析", "混合方法"],
        explanation: "✅ 破案線索：你不用去訪談歌手，而是要收集現成資料。你需要先定義詞庫並建立「編碼規則」來計數。",
        tags: ["現成文本", "編碼規則", "頻率計數"]
    },
    {
        id: 6,
        topic: "🔥 魔王委託：統計全校對新版運動服的滿意度比例，並深入了解極度不滿意者的具體抱怨",
        correct: "問卷調查 + 深度訪談",
        options: [
            "問卷調查 + 深度訪談",
            "觀察記錄 + 深度訪談",
            "文獻/內容分析 + 問卷調查",
            "實驗設計 + 觀察記錄",
            "問卷調查 + 實驗設計",
            "實驗設計 + 深度訪談"
        ],
        explanation: "✅ 破案線索：問「滿意度比例」要用【問卷調查】掌握廣度，問「具體抱怨」要用【深度訪談】挖掘原因（先問卷找出極端者，再目的抽樣訪談）！",
        tags: ["廣度加深度", "比例與原因", "多重工具"]
    },
    {
        id: 7,
        topic: "委託七：探討單親家庭高中生在面對大學科系選擇時的內心掙扎與家庭期望",
        correct: "深度訪談",
        options: ["問卷調查", "深度訪談", "實驗設計", "觀察記錄", "文獻/內容分析", "混合方法"],
        explanation: "✅ 破案線索：這涉及非常個人且深層的情感，需要建立信任並深入聊天。倫理上要注意保密與避免貼標籤。",
        tags: ["敏感議題", "信任建立", "深入追問"]
    },
    {
        id: 8,
        topic: "委託八：測量不同顏色（紅色 vs. 藍色）的重點筆，對學生閱讀理解測驗分數的影響",
        correct: "實驗設計",
        options: ["問卷調查", "深度訪談", "實驗設計", "觀察記錄", "文獻/內容分析", "混合方法"],
        explanation: "✅ 破案線索：要探討因果關係，必須將學生分組，並嚴格控制文章難度、作答時間等干擾變項。",
        tags: ["因果假設", "隨機分派", "控制干擾"]
    },
    {
        id: 9,
        topic: "委託九：勘查學校合作社在下課十分鐘內，學生排隊動線的順暢度與結帳瓶頸",
        correct: "觀察記錄",
        options: ["問卷調查", "深度訪談", "實驗設計", "觀察記錄", "文獻/內容分析", "混合方法"],
        explanation: "✅ 破案線索：你必須站在現場看！工具是「觀察紀錄表」，可以用來記錄等待時間、並畫出堵點熱區圖。",
        tags: ["現場流程", "動線分析", "計時/計數"]
    },
    {
        id: 10,
        topic: "委託十：比較台灣三大報紙在報導「108課綱」時，新聞標題的正負面用詞比例",
        correct: "文獻/內容分析",
        options: ["問卷調查", "深度訪談", "實驗設計", "觀察記錄", "文獻/內容分析", "混合方法"],
        explanation: "✅ 破案線索：這是在分析現成的文本資料。重點是要界定「正負面詞」的判準，並最好做同儕交叉編碼算一致率！",
        tags: ["文本編碼", "正負面判準", "一致率"]
    },
    {
        id: 11,
        topic: "🔥 終極魔王委託：追蹤過去二十年校刊『校規爭議』報導的篇幅變化，並還原當年撰寫報導的學長姐的心路歷程",
        correct: "文獻/內容分析 + 深度訪談",
        options: [
            "文獻/內容分析 + 深度訪談",
            "觀察記錄 + 文獻/內容分析",
            "問卷調查 + 深度訪談",
            "實驗設計 + 文獻/內容分析",
            "觀察記錄 + 深度訪談",
            "文獻/內容分析 + 問卷調查"
        ],
        explanation: "✅ 破案線索：需要【文獻/內容分析】來量化過去二十年的校刊文本，再加上【深度訪談】當年作者來了解背後的歷史脈絡，這是非常強大的跨時空研究！",
        tags: ["文本分析+人物訪談", "歷史脈絡", "多重證據"]
    }
];

// 偵探風格圖示
const toolIcons = {
    "問卷調查": "📋",
    "深度訪談": "🎙️",
    "實驗設計": "🧪",
    "觀察記錄": "👁️",
    "文獻/內容分析": "🗄️",
    "混合方法": "🧰"
};

// 處理混合選項的圖示渲染
const getOptionIcon = (optionText) => {
    if (optionText.includes(' + ')) {
        const parts = optionText.split(' + ');
        return `${toolIcons[parts[0]] || '❓'} ${toolIcons[parts[1]] || '❓'}`;
    }
    return toolIcons[optionText] || "🧰";
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

export const ToolQuizGame = () => {
    const [gameState, setGameState] = useState('start'); // 'start', 'playing', 'end'
    const [gameQuestions, setGameQuestions] = useState([]);
    const [wrongQuestions, setWrongQuestions] = useState([]);
    const [currentQIndex, setCurrentQIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [playerName, setPlayerName] = useState('');

    // 從 localStorage 讀取全域探員代號
    React.useEffect(() => {
        const savedName = localStorage.getItem('rib_agent_name');
        if (savedName) {
            setPlayerName(savedName);
        }
    }, []);

    const startGame = () => {
        const orderedQuestions = quizData.map(q => ({
            ...q,
            shuffledOptions: shuffleArray(q.options)
        }));
        setGameQuestions(orderedQuestions);
        setWrongQuestions([]);
        setCurrentQIndex(0);
        setScore(0);
        setSelectedAnswer(null);
        setIsAnswered(false);
        setGameState('playing');
    };

    const handleAnswer = (answer) => {
        if (isAnswered) return;
        setSelectedAnswer(answer);
        setIsAnswered(true);

        const currentQ = gameQuestions[currentQIndex];
        if (answer === currentQ.correct) {
            setScore(s => s + 1);
        } else {
            setWrongQuestions(prev => [...prev, currentQ]);
        }
    };

    const nextQuestion = () => {
        if (currentQIndex < gameQuestions.length - 1) {
            setCurrentQIndex(currentQIndex + 1);
            setSelectedAnswer(null);
            setIsAnswered(false);
        } else {
            setGameState('end');
        }
    };

    // ================= START SCREEN =================
    if (gameState === 'start') {
        return (
            <div className="relative rounded-xl overflow-hidden flex flex-col items-center justify-center p-6 md:py-16 font-sans text-rose-50 min-h-[700px] bg-cover bg-fixed bg-center shadow-2xl"
                style={{ backgroundImage: "url('/images/tool_quiz_bg.png')" }}>

                <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-none z-0"></div>

                <div className="bg-slate-900/70 p-8 md:p-12 rounded-3xl shadow-[0_0_40px_rgba(0,0,0,0.5)] max-w-xl w-full text-center border-t-[8px] border-amber-500 relative overflow-hidden z-10 backdrop-blur-sm border-x border-b border-white/10 group hover:border-amber-500/50 transition-colors duration-500">
                    <div className="absolute top-0 right-0 opacity-[0.03] text-9xl -mt-4 -mr-4 pointer-events-none drop-shadow-[0_0_20px_rgba(251,191,36,0.5)]">🔍</div>
                    <div className="text-7xl mb-6 animate-[bounce_2s_infinite]">🕵️‍♂️</div>

                    <h1 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-500 mb-2 tracking-wide drop-shadow-[0_0_10px_rgba(251,191,36,0.3)]">行動代號：裝備</h1>
                    <div className="text-sm md:text-base font-bold text-amber-300/80 mb-6 bg-amber-950/40 inline-block px-3 py-1 rounded border border-amber-500/20 tracking-wider">
                        🎯 研究工具與資料蒐集方法辨識
                    </div>
                    <h2 className="text-xl md:text-2xl font-bold text-slate-300 mb-6 pb-4 relative">
                        辦案工具大考驗
                        <div className="absolute bottom-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-slate-500 to-transparent"></div>
                    </h2>

                    <p className="text-slate-300 text-lg mb-8 font-medium leading-relaxed drop-shadow-sm">
                        真相永遠只有一個！<br />
                        面對 11 個越來越困難的研究委託，<br />身為首席調查員的你，<br />該從工具箱拔出哪一項<span className="text-amber-400 font-bold ml-1 drop-shadow-[0_0_5px_rgba(251,191,36,0.6)]">「辦案道具」</span>？
                    </p>

                    <div className="bg-slate-800/60 rounded-2xl p-6 mb-8 text-center border border-slate-700/50 shadow-inner block backdrop-blur-none relative group-hover:border-amber-500/30 transition-colors">
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-slate-900 px-3 py-1 rounded-full border border-slate-700 text-xs font-bold text-slate-400 tracking-wider shadow-sm z-10">
                            🕵️‍♂️ 目前登入身分
                        </div>
                        <div className="mt-2">
                            {playerName ? (
                                <div className="text-2xl font-black text-amber-400 inline-block px-4 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]">{playerName} 探員</div>
                            ) : (
                                <div className="text-rose-400 font-bold animate-pulse flex items-center justify-center gap-2">
                                    <span>🚨</span> 無法辨識身分！請返回總部大廳完成報到手續。
                                </div>
                            )}
                        </div>
                    </div>

                    <button
                        onClick={startGame}
                        disabled={!playerName}
                        className={`font-black py-4 px-10 rounded-full text-xl transition-all duration-300 transform flex items-center justify-center gap-2 mx-auto relative overflow-hidden group w-full md:w-auto ${!playerName
                            ? 'bg-slate-800/80 text-slate-500 cursor-not-allowed border border-slate-700/50 backdrop-blur-none'
                            : 'bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-900 hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:shadow-[0_0_30px_rgba(245,158,11,0.6)] border border-amber-300/50'
                            }`}
                    >
                        <span className="relative z-10 flex items-center gap-2">接下委託，開始辦案 <span>🔍</span></span>
                        {playerName && <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></div>}
                    </button>
                </div>
            </div>
        );
    }

    // ================= END SCREEN =================
    if (gameState === 'end') {
        let title = "";
        let color = "";
        if (score === 11) { title = "🕵️‍♂️ 福爾摩斯級神探！"; color = "text-amber-400"; }
        else if (score >= 8) { title = "🚔 菁英調查員！"; color = "text-emerald-400"; }
        else if (score >= 5) { title = "🔍 菜鳥見習生！"; color = "text-slate-300"; }
        else { title = "🚨 案發現場破壞者！"; color = "text-rose-500"; }

        return (
            <div className="relative rounded-xl overflow-hidden flex flex-col items-center justify-center p-6 md:py-10 font-sans text-rose-50 min-h-[700px] bg-cover bg-fixed bg-center shadow-2xl"
                style={{ backgroundImage: "url('/images/tool_quiz_bg.png')" }}>

                <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm z-0"></div>

                <div className="bg-slate-900/70 p-8 rounded-3xl shadow-[0_0_40px_rgba(0,0,0,0.5)] max-w-2xl w-full text-center border-t-[8px] border-amber-500 relative overflow-hidden z-10 backdrop-blur-sm border-x border-b border-white/10 group hover:border-amber-500/30 transition-colors duration-500">
                    <div className="absolute top-6 left-6 text-slate-500/20 text-6xl pointer-events-none drop-shadow-md">📝</div>
                    <div className="absolute -bottom-10 -right-10 text-9xl opacity-[0.03] text-amber-500 pointer-events-none drop-shadow-[0_0_20px_rgba(251,191,36,0.5)] flex flex-col items-center">
                        <div>📁</div>
                        <div className="-mt-8 text-7xl font-mono tracking-tighter">CONFIDENTIAL</div>
                    </div>

                    <h1 className="text-2xl font-bold text-slate-400 mb-2 tracking-[0.3em] relative z-10 uppercase">
                        ✅ 裝備檢定報告
                    </h1>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8 relative z-10">
                        <div className="text-sm font-medium text-amber-300 bg-amber-950/50 px-5 py-2 rounded-full border border-amber-500/30 shadow-[0_0_15px_rgba(251,191,36,0.2)] flex items-center gap-2">
                            首席探員：<span className="font-black text-amber-400 text-lg drop-shadow-[0_0_5px_currentColor]">{playerName}</span>
                        </div>
                    </div>

                    <div className="text-8xl font-black mb-2 text-transparent bg-clip-text bg-gradient-to-b from-amber-300 to-amber-600 relative z-10 drop-shadow-[0_0_15px_rgba(245,158,11,0.5)] tracking-tighter">
                        {score} <span className="text-4xl text-slate-600/80 tracking-normal">/ 11</span>
                    </div>

                    <h2 className={`text-4xl font-black mb-6 drop-shadow-[0_0_10px_currentColor] ${color} relative z-10 tracking-widest`}>
                        {title}
                    </h2>

                    <p className="text-xs text-slate-300 font-bold uppercase tracking-[0.2em] bg-slate-900/80 py-2.5 px-6 rounded-lg border border-white/10 mb-8 inline-flex items-center gap-2 relative z-10 backdrop-blur-none shadow-inner group-hover:border-amber-500/30 transition-colors">
                        <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse shadow-[0_0_5px_rgba(244,63,94,0.8)]"></span>
                        請截圖此頁面作為紀錄
                    </p>

                    <div className="relative z-10 flex justify-center mb-10 w-full relative">
                        <button
                            onClick={startGame}
                            className="bg-slate-800/80 backdrop-blur-none hover:bg-slate-700 text-amber-400 font-bold py-3 px-8 rounded-full text-lg transition-all duration-300 transform hover:-translate-y-1 shadow-[0_4px_15px_rgba(0,0,0,0.5)] border border-slate-600 hover:border-amber-500/50 hover:text-amber-300 group inline-flex items-center gap-2"
                        >
                            重新調查 <span className="group-hover:rotate-180 transition-transform duration-500 inline-block">🔄</span>
                        </button>
                    </div>

                    {/* 錯題回顧區塊 */}
                    {wrongQuestions.length > 0 && (
                        <div className="text-left bg-slate-900/60 p-6 rounded-2xl border-l-[6px] border-l-rose-500 border-t border-r border-b border-white/5 max-h-96 overflow-y-auto shadow-inner backdrop-blur-sm relative z-10 scrollbar-thin scrollbar-thumb-rose-900 scrollbar-track-slate-900">
                            <h3 className="text-xl font-black mb-5 flex items-center gap-2 text-rose-50 border-b border-slate-700/50 pb-3">
                                <span className="text-rose-500 text-2xl drop-shadow-[0_0_5px_currentColor]">📁</span> 破案失敗紀錄 <span className="text-slate-400 text-sm font-normal ml-2 tracking-widest">(錯題回顧)</span>
                            </h3>
                            <div className="space-y-4">
                                {wrongQuestions.map((wq, i) => (
                                    <div key={i} className="bg-slate-800/80 p-5 rounded-xl shadow-lg border border-slate-700/50 group overflow-hidden relative">
                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-rose-500 to-transparent opacity-50 group-hover:opacity-100 transition-opacity"></div>
                                        <p className="font-bold text-rose-100 text-lg mb-3 leading-relaxed">{wq.topic}</p>
                                        <div className="flex flex-wrap items-center gap-2 mb-3">
                                            <span className="bg-emerald-950/60 text-emerald-400 font-bold px-4 py-1.5 rounded-md text-sm border border-emerald-500/30 shadow-inner inline-flex items-center gap-2">
                                                <span className="text-emerald-500">✅ 正確道具：</span>
                                                <span className="bg-emerald-900/80 px-2 pl-1.5 py-0.5 rounded text-emerald-100 flex items-center gap-1 shadow-sm border border-emerald-700">
                                                    <span>{getOptionIcon(wq.correct)}</span> {wq.correct}
                                                </span>
                                            </span>
                                        </div>
                                        {/* 錯題的判準標籤 */}
                                        <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-slate-700/30">
                                            {wq.tags.map(tag => (
                                                <span key={tag} className="bg-slate-900/80 text-amber-500/80 text-xs font-bold px-2 py-0.5 rounded border border-slate-700/50 flex items-center gap-1">
                                                    <span className="opacity-50">#</span>{tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {wrongQuestions.length === 0 && (
                        <div className="bg-gradient-to-r from-emerald-900/40 via-emerald-800/40 to-emerald-900/40 text-emerald-300 border border-emerald-500/40 p-6 rounded-2xl font-bold text-lg relative z-10 backdrop-blur-sm shadow-[0_0_30px_rgba(16,185,129,0.15)] flex flex-col items-center gap-3">
                            <span className="text-4xl drop-shadow-[0_0_10px_currentColor] mb-1">🎉</span>
                            <span className="tracking-wide">完美破案！毫無破綻的推理</span>
                            <span className="text-emerald-200/70 text-sm font-medium">你已經完全掌握研究工具的精髓了！</span>
                        </div>
                    )}

                </div>
            </div>
        );
    }

    // ================= PLAYING SCREEN =================
    const currentQ = gameQuestions[currentQIndex];
    if (!currentQ) return null;

    const isBossLevel = currentQ.topic.includes("魔王");

    return (
        <div className="relative rounded-xl overflow-hidden flex flex-col items-center p-4 md:p-8 font-sans min-h-[700px] text-rose-50 bg-cover bg-fixed bg-center shadow-2xl"
            style={{ backgroundImage: "url('/images/tool_quiz_bg.png')" }}>
            <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-none z-0"></div>

            <div className="max-w-4xl w-full relative z-10">

                {/* Progress and Score */}
                <div className="flex justify-between items-center mb-6 px-1">
                    <div className="bg-slate-900/60 backdrop-blur-sm text-slate-300 font-bold px-5 py-2 rounded-full shadow-inner text-lg border border-slate-700 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-amber-500 animate-[pulse_1.5s_ease-in-out_infinite] shadow-[0_0_8px_rgba(245,158,11,0.8)]"></span>
                        檔案夾 <span className="text-amber-400">{currentQIndex + 1}</span> <span className="opacity-40 font-normal">/ {gameQuestions.length}</span>
                    </div>

                    <div className="bg-slate-900/60 backdrop-blur-sm text-emerald-400 font-bold px-5 py-2 rounded-full shadow-inner text-lg border border-emerald-500/30 flex items-center gap-2">
                        <span>成功破案</span>
                        <span className="bg-emerald-900/50 text-emerald-300 px-3 py-0.5 rounded-md font-black min-w-[3rem] text-center border border-emerald-500/20 shadow-inner drop-shadow-[0_0_5px_rgba(16,185,129,0.5)]">{score}</span>
                    </div>
                </div>

                {/* Question Card */}
                <div className={`bg-slate-900/70 backdrop-blur-lg p-6 md:p-8 rounded-3xl shadow-[0_0_40px_rgba(0,0,0,0.5)] mb-6 border-t-[8px] border-x border-b border-white/10 transition-all relative overflow-hidden group hover:border-amber-500/30 duration-500 ${isBossLevel ? 'border-t-rose-500 shadow-[0_0_50px_rgba(244,63,94,0.3)]' : 'border-t-amber-500'}`}>
                    {isBossLevel && (
                        <div className="absolute top-0 right-0 bg-rose-600/90 text-white text-xs font-black px-5 py-1.5 rounded-bl-xl tracking-widest animate-[pulse_2s_infinite] shadow-[0_0_15px_rgba(244,63,94,0.8)] border-b border-l border-rose-400/50 z-20 backdrop-blur-sm">
                            ⚠️ 高難度混合委託
                        </div>
                    )}

                    <div className="absolute -bottom-5 -right-5 text-9xl opacity-[0.03] text-amber-500 pointer-events-none drop-shadow-[0_0_20px_rgba(251,191,36,0.5)]">
                        📁
                    </div>

                    {/* 判準標籤 (Tags) */}
                    <div className="flex flex-wrap gap-2 mb-4 mt-2 relative z-10">
                        {currentQ.tags.map(tag => (
                            <span key={tag} className="bg-slate-800/80 text-amber-400 font-bold px-3 py-1.5 rounded-lg text-sm tracking-wider border border-slate-600 shadow-sm leading-none flex items-center gap-1 drop-shadow-sm">
                                <span className="opacity-50 text-amber-500">#</span>{tag}
                            </span>
                        ))}
                    </div>

                    <h2 className="text-sm text-slate-400 font-bold mb-3 tracking-widest relative z-10 flex items-center gap-2">
                        <span className="text-amber-500/70">▶</span> 【 案情描述 】
                    </h2>

                    <p className="text-2xl md:text-3xl font-bold text-amber-50 leading-snug relative z-10 drop-shadow-md">
                        {currentQ.topic}
                    </p>
                </div>

                {/* Options Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6">
                    {currentQ.shuffledOptions.map((option) => {
                        const isSelected = selectedAnswer === option;
                        const isCorrect = option === currentQ.correct;
                        const isComboOption = option.includes(' + ');

                        let buttonStyle = "bg-slate-900/60 backdrop-blur-sm text-slate-300 border border-slate-700 shadow-[0_4px_15px_rgba(0,0,0,0.3)] hover:border-amber-400/50 hover:text-amber-300 group transition-all duration-300 relative overflow-hidden";

                        if (isAnswered) {
                            if (isCorrect) {
                                buttonStyle = "bg-emerald-900/30 backdrop-blur-sm text-emerald-300 border border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)] scale-105 z-10 relative overflow-hidden";
                            } else if (isSelected && !isCorrect) {
                                buttonStyle = "bg-rose-900/30 backdrop-blur-sm text-rose-300 border border-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.3)] relative overflow-hidden";
                            } else {
                                buttonStyle = "bg-slate-900/40 backdrop-blur-sm text-slate-500 border border-slate-800 opacity-50 cursor-not-allowed relative overflow-hidden";
                            }
                        }

                        return (
                            <button
                                key={option}
                                onClick={() => handleAnswer(option)}
                                disabled={isAnswered}
                                className={`flex flex-col md:flex-row items-center justify-center p-4 md:p-6 rounded-2xl font-bold transition-all duration-300 ${buttonStyle} ${!isAnswered ? 'hover:-translate-y-1' : ''}`}
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                                <span className={`text-3xl md:text-3xl md:mr-3 mb-2 md:mb-0 drop-shadow-md tracking-widest whitespace-nowrap relative z-10 transition-transform duration-300 group-hover:scale-110 ${(!isAnswered || (isAnswered && !isSelected && !isCorrect)) ? 'group-hover:drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]' : ''}`}>
                                    {getOptionIcon(option)}
                                </span>
                                <span className={`relative z-10 ${isComboOption ? 'text-sm md:text-base leading-tight' : 'text-lg'} ${(!isAnswered || (isAnswered && !isSelected && !isCorrect)) ? 'group-hover:text-amber-100' : ''}`}>
                                    {option}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* Feedback Section */}
                {isAnswered && (
                    <div className={`p-6 md:p-8 rounded-3xl shadow-[0_0_40px_rgba(0,0,0,0.5)] animate-in fade-in slide-in-from-bottom-4 border-l-[12px] backdrop-blur-lg border-y border-r border-white/10 ${selectedAnswer === currentQ.correct ? 'bg-emerald-900/20 border-l-emerald-500' : 'bg-rose-900/20 border-l-rose-500'}`}>
                        <div className="flex items-start justify-between gap-4 mb-4">
                            <div className="flex items-center gap-4 w-full">
                                <div className={`shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-2xl shadow-inner border ${selectedAnswer === currentQ.correct ? 'bg-emerald-900/50 text-emerald-400 border-emerald-500/30' : 'bg-rose-900/50 text-rose-400 border-rose-500/30'}`}>
                                    {selectedAnswer === currentQ.correct ? '🎯' : '🚨'}
                                </div>
                                <div>
                                    <h3 className={`text-xl md:text-2xl font-black mb-1 drop-shadow-[0_0_8px_currentColor] ${selectedAnswer === currentQ.correct ? 'text-emerald-400' : 'text-rose-400'}`}>
                                        {selectedAnswer === currentQ.correct
                                            ? `推理正確！成功結案`
                                            : `推理錯誤！現場遭到破壞`}
                                    </h3>

                                    <div className={`text-sm md:text-base font-bold bg-slate-900/80 p-2 md:p-3 rounded border shadow-inner inline-flex items-center gap-2 mt-2 ${selectedAnswer === currentQ.correct ? 'border-emerald-500/30 text-emerald-300' : 'border-rose-500/30 text-rose-300'}`}>
                                        <span className="opacity-70">{selectedAnswer === currentQ.correct ? '使用道具：' : '正確道具應為：'}</span>
                                        <span className="text-lg bg-slate-800 px-2 py-0.5 rounded border border-slate-700 shadow-sm">{getOptionIcon(currentQ.correct)} {currentQ.correct}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <p className="text-slate-200 text-lg md:text-xl font-medium leading-relaxed mb-6">
                            {currentQ.explanation}
                        </p>
                        <div className="flex justify-end pt-5 border-t border-slate-700/50">
                            <button
                                onClick={nextQuestion}
                                className={`font-black py-4 px-10 rounded-full text-xl transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2 text-white overflow-hidden relative group ${currentQIndex < gameQuestions.length - 1 ? 'bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 border border-amber-400/50 shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_30px_rgba(245,158,11,0.5)]' : 'bg-slate-700 hover:bg-slate-600 border border-slate-500'}`}
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    {currentQIndex < gameQuestions.length - 1 ? (
                                        <>調查下一案 <span className="text-2xl leading-none">➡️</span></>
                                    ) : (
                                        <>查看結案報告 <span className="text-2xl leading-none drop-shadow-md">📁</span></>
                                    )}
                                </span>
                            </button>
                        </div>
                    </div>
                )}

            </div>
        </div >
    );
};
