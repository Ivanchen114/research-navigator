import React, { useState, useEffect } from 'react';
import { Search, CheckCircle2, XCircle, AlertTriangle, ArrowRight, ChevronRight, Bug, Award, RefreshCw } from 'lucide-react';

const QUESTIONS_DATA = [
    {
        id: 1,
        title: "基礎判斷",
        prompt: "前提：以下句子視為學生整理文獻後的寫法，而非逐字照抄原文。\n\n睡眠不足會導致前額葉功能下降，影響學生專注力（陳醫師，2023）。",
        correctOX: "O",
        correctType: null,
        explanation: "引用格式正確，且有將資訊整理成自己的敘述方式。這題的重點是：文獻有被納入句子中，而不是孤立地掛在後面。",
        fixExample: "無須修正，這是一個標準的括號引用範例。",
        highlightHints: []
    },
    {
        id: 2,
        title: "比對原文",
        prompt: "原文：「睡眠不足會導致前額葉皮質功能下降，進而削弱學生的專注力與情緒控管能力。」（陳醫師，2023）\n\n學生寫：睡眠不夠會造成前額葉皮質運作降低，進而減弱同學的專心度和情緒管理。（陳醫師，2023）",
        correctOX: "X",
        correctType: "patchwriting",
        explanation: "這是「換字抄襲」。句型結構、邏輯順序與原文幾乎一模一樣，只是替換了同義詞。",
        fixExample: "修正版：陳醫師（2023）指出，睡眠不足不僅影響大腦前額葉功能，更會同時削弱學生的專注力與情緒調節能力。\n（建議：讀懂後蓋上書本，用自己的話重講一遍）",
        highlightHints: ["睡眠不夠會造成", "前額葉皮質運作降低", "減弱同學的專心度"]
    },
    {
        id: 3,
        title: "孤兒引用 ⭐",
        prompt: "AI很好用。(Wang, 2023) 所以我們要多用。",
        correctOX: "X",
        correctType: "orphan",
        explanation: "這是「孤兒引用」。引文像孤兒一樣被丟在句中，沒有前面鋪陳，也沒有後面解釋這則文獻到底支持了什麼觀點。",
        fixExample: "修正版（三明治法）：\n近年來科技融入教學已成趨勢（上片麵包）。Wang (2023) 指出 AI 工具能顯著提升學習效率（肉片）。因此，教師應適度引導學生使用工具（下片麵包）。",
        highlightHints: ["(Wang, 2023)"]
    },
    {
        id: 4,
        title: "常見疏漏",
        prompt: "研究顯示，適度飲用咖啡能提升大腦警覺性。",
        correctOX: "X",
        correctType: "missing_citation",
        explanation: "提到「研究顯示」卻沒有附上來源，讀者無法驗證是哪一份研究。",
        fixExample: "修正版：\n研究顯示，適度飲用咖啡能提升大腦警覺性（Lin, 2020）。\n或：Lin (2020) 的研究指出，適度飲用咖啡能提升大腦警覺性。",
        highlightHints: ["研究顯示"]
    },
    {
        id: 5,
        title: "改寫練習",
        prompt: "原文：「研究顯示，適度飲用咖啡因能短暫提升大腦的警覺性。」（林教授，2020）\n\n學生寫：根據林教授（2020）的研究，青少年若飲用適量咖啡，可能在短時間內較為清醒。",
        correctOX: "O",
        correctType: null,
        explanation: "這是一個可接受的改寫。語意大致保留、句構也有改變，且清楚標示來源。不過若要更精確，『咖啡因』與『咖啡』並不完全等同，學術寫作中仍要注意概念精準度。",
        fixExample: "表現很好！這就是用自己的話重述（Paraphrasing）。若想更精確，可把『咖啡』改回『含咖啡因飲品』或直接保留『咖啡因』。",
        highlightHints: []
    },
    {
        id: 6,
        title: "引用格式",
        prompt: "原文：「拖延症並非單純的時間管理失敗，而是一種情緒調節的失敗。」（Sirois, 2018）\n\n學生寫：根據Sirois（2018）的研究，拖延症並非單純的時間管理失敗，而是一種情緒調節的失敗。",
        correctOX: "X",
        correctType: "missing_quotes",
        explanation: "這是「直接引用但沒引號」。後半句完全照抄原文，必須加上引號，否則會被視為抄襲。",
        fixExample: "修正版1（加引號）：Sirois (2018) 強調：「拖延症並非單純的時間管理失敗，而是一種情緒調節的失敗。」\n修正版2（改寫）：Sirois (2018) 認為拖延症的主因其實是情緒調節失靈，而非時間管理不當。",
        highlightHints: ["拖延症並非單純的時間管理失敗，而是一種情緒調節的失敗"]
    },
    {
        id: 7,
        title: "孤兒引用 ⭐",
        prompt: "根據研究，手機使用會影響睡眠（Chen, 2023; Wang, 2022）。",
        correctOX: "X",
        correctType: "orphan",
        explanation: "這也是「孤兒引用」，但屬於進階型。它不是沒有文獻，而是文獻沒有被清楚整合進論點裡：『影響睡眠』太籠統，讀者不知道是如何影響、影響什麼面向。",
        fixExample: "修正版：\n多項研究證實，睡前使用手機的藍光會抑制褪黑激素分泌，導致入睡困難（Chen, 2023; Wang, 2022）。",
        highlightHints: ["根據研究，手機使用會影響睡眠"]
    },
    {
        id: 8,
        title: "三明治法",
        prompt: "許多學生認為拖延只是時間管理問題。然而，Sirois (2018) 指出：「拖延症並非單純的時間管理失敗，而是一種情緒調節的失敗。」這提醒我們，制定讀書計畫時也要考慮情緒管理。",
        correctOX: "O",
        correctType: null,
        explanation: "完美的「三明治法」！\n上層麵包（背景）→ 肉片（引用文獻+引號）→ 下層麵包（個人觀點/總結）。",
        fixExample: "優秀的示範！引用文獻是為了支持你的觀點，而不是取代你的觀點。",
        highlightHints: []
    },
    {
        id: 9,
        title: "串燒引用 ⭐",
        prompt: "研究指出手機影響睡眠（A, 2020）。另一研究發現運動有益健康（B, 2021）。還有研究說壓力影響學習（C, 2022）。",
        correctOX: "X",
        correctType: "orphan",
        explanation: "這是「孤兒串燒」。只是把一堆文獻堆疊在一起，缺乏邏輯連結與作者的主張。",
        fixExample: "修正版：\n影響學生身心健康的因素眾多。A (2020) 與 C (2022) 分別指出手機成癮與學業壓力是主因，而 B (2021) 則建議透過規律運動來緩解上述問題。",
        highlightHints: ["研究指出", "另一研究發現", "還有研究說"]
    },
    {
        id: 10,
        title: "綜合應用",
        prompt: "前提：以下句子視為學生整合多篇文獻後的寫法。\n\n多篇研究指出，睡眠不足與高中生的學業表現、情緒穩定及人際互動皆有關聯（陳醫師，2023；林教授，2022；王研究，2021），顯示睡眠品質可能對青少年發展具有多面向影響。",
        correctOX: "O",
        correctType: null,
        explanation: "這是正確的綜合引用（Synthesis）。作者不是把文獻一條條排開，而是把多個來源整合成一個較高層次的論點。",
        fixExample: "這是進階技巧！將不同來源的資訊整合成一個完整論述，而不是單純堆疊引用。",
        highlightHints: []
    }
];

const ERROR_TYPES = [
    { id: 'orphan', label: '孤兒引用（只有引用沒有說明）' },
    { id: 'patchwriting', label: '換字抄襲（句構幾乎不變）' },
    { id: 'missing_citation', label: '忘記標註來源' },
    { id: 'missing_quotes', label: '直接引用但沒引號' },
];

const REVIEW_TIPS = {
    orphan: "孤兒引用就像「只給肉片沒給麵包」。記得用「三明治法」：先寫前言（上麵包），放入引用（肉），再加自己的解釋（下麵包）。",
    patchwriting: "換字抄襲是大忌！不要只換同義詞。請讀懂原文後，蓋上書本，用「完全不同」的句型重新講一遍。",
    missing_citation: "只要提到「研究顯示」、「數據指出」，就一定要在後面括號加上 (作者, 年份)。",
    missing_quotes: "如果是逐字照抄（超過 3-5 個字連續相同），一定要加「引號」，不然就是剽竊。",
};

// UI Components
const renderQuestionCard = (prompt) => {
    if (prompt.includes("原文：") && prompt.includes("學生寫：")) {
        const parts = prompt.split(/原文：|學生寫：/);
        return (
            <div className="space-y-4 w-full text-left font-sans">
                <div className="bg-slate-800/60 p-4 rounded-sm border-l-[6px] border-slate-500 shadow-sm relative">
                    <div className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">📄 原文 (Original)</div>
                    <div className="text-slate-200 leading-relaxed font-medium">{parts[1]?.trim()}</div>
                </div>
                <div className="bg-red-900/20 p-4 rounded-sm border-l-[6px] border-red-500 shadow-sm relative">
                    <div className="text-xs font-bold text-red-400 mb-2 uppercase tracking-widest">✍️ 學生寫法 (Suspect)</div>
                    <div className="text-red-100 leading-relaxed font-semibold">{parts[2]?.trim()}</div>
                </div>
            </div>
        );
    }
    return <div className="bg-slate-800/40 p-6 shadow-sm rounded-sm border border-slate-600 text-lg md:text-xl text-slate-200 font-medium whitespace-pre-line leading-relaxed min-h-[150px]">{prompt}</div>;
};

const renderHighlight = (text, highlights) => {
    const processHighlights = (content) => {
        if (!highlights || highlights.length === 0) return content;
        let parts = content.split(new RegExp(`(${highlights.join('|')})`, 'g'));
        return parts.map((part, i) => highlights.includes(part) ? <span key={i} className="bg-yellow-200 text-red-600 font-bold px-1 rounded">{part}</span> : part);
    };
    if (text.includes("原文：")) {
        const parts = text.split(/原文：|學生寫：/);
        return (
            <div className="space-y-4 text-sm md:text-base font-sans mt-3">
                <div className="bg-slate-800/60 p-4 rounded-sm border border-slate-600">
                    <div className="text-xs font-bold text-slate-400 mb-1 uppercase">📄 原文</div>
                    <div className="text-slate-300">{processHighlights(parts[1]?.trim() || "")}</div>
                </div>
                <div className="bg-red-900/20 p-4 rounded-sm border border-red-800/50">
                    <div className="text-xs font-bold text-red-400 mb-1 uppercase">✍️ 學生寫法</div>
                    <div className="text-red-100">{processHighlights(parts[2]?.trim() || "")}</div>
                </div>
            </div>
        )
    }
    return <div className="bg-slate-800/60 p-4 rounded-sm border border-slate-600 whitespace-pre-line text-slate-200 font-medium">{processHighlights(text)}</div>;
};

export const CitationDetectiveGame = () => {
    const [gameState, setGameState] = useState('intro');
    const [currentQIndex, setCurrentQIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [userAnswers, setUserAnswers] = useState([]);
    const [selectedOX, setSelectedOX] = useState(null);
    const [selectedType, setSelectedType] = useState(null);
    const [shuffledQuestions, setShuffledQuestions] = useState([]);
    const [isRandom] = useState(true);
    const [playerName, setPlayerName] = useState("");

    // 從 localStorage 讀取全域探員代號
    React.useEffect(() => {
        const savedName = localStorage.getItem('rib_agent_name');
        if (savedName) {
            setPlayerName(savedName);
        }
    }, []);

    const MAX_SCORE = QUESTIONS_DATA.reduce((sum, q) => sum + (q.correctOX === 'X' ? 2 : 1), 0);

    const initQuestions = () => {
        let q = [...QUESTIONS_DATA];
        if (isRandom) q.sort(() => Math.random() - 0.5);
        setShuffledQuestions(q);
    };



    const currentQ = shuffledQuestions[currentQIndex] || QUESTIONS_DATA[0];

    const enterTutorial = () => {
        if (!playerName.trim()) return;
        initQuestions();
        setGameState('tutorial');
    };

    const startGame = () => {
        setScore(0);
        setCurrentQIndex(0);
        setUserAnswers([]);
        if (gameState === 'intro') initQuestions();
        setGameState('playing');
        resetRound();
    };

    const resetRound = () => {
        setSelectedOX(null);
        setSelectedType(null);
    };

    const handleOXSelect = (choice) => {
        setSelectedOX(choice);
        if (choice === 'O') setSelectedType(null);
    };

    const handleSubmit = () => {
        if (!selectedOX) return;
        if (selectedOX === 'X' && !selectedType) return;

        let points = 0;
        let isCorrectJudgment = false;
        let isCorrectType = false;

        if (selectedOX === currentQ.correctOX) {
            points += 1;
            isCorrectJudgment = true;
        }

        if (currentQ.correctOX === 'X' && isCorrectJudgment && selectedType === currentQ.correctType) {
            points += 1;
            isCorrectType = true;
        }

        setScore(prev => prev + points);
        setUserAnswers(prev => [...prev, {
            questionId: currentQ.id,
            correctOX: currentQ.correctOX,
            userOX: selectedOX,
            correctType: currentQ.correctType,
            userType: selectedType,
            points,
            isCorrectJudgment,
            isCorrectType
        }]);
        setGameState('feedback');
    };

    const nextQuestion = () => {
        if (currentQIndex < shuffledQuestions.length - 1) {
            setCurrentQIndex(prev => prev + 1);
            setGameState('playing');
            resetRound();
        } else {
            localStorage.setItem('rib_score_citation-detective', JSON.stringify({score: score, maxScore: MAX_SCORE, date: new Date().toISOString().split('T')[0]}));
            localStorage.setItem('rib_completed_citation-detective', 'true');
            setGameState('result');
        }
    };

    const getDetectiveLevel = (finalScore) => {
        if (finalScore >= 15) return '👑 福爾摩斯';
        if (finalScore >= 12) return '⭐ 資深探長';
        if (finalScore >= 8) return '🔍 鑑識探員';
        return '🔰 見習探員';
    };

    const getWeakestPoint = () => {
        const errorCounts = {};
        userAnswers.forEach(ans => {
            if (ans.correctOX === 'X' && (!ans.isCorrectJudgment || !ans.isCorrectType)) {
                const type = ans.correctType;
                if (type) errorCounts[type] = (errorCounts[type] || 0) + 1;
            }
        });
        let maxType = null;
        let maxCount = 0;
        Object.entries(errorCounts).forEach(([type, count]) => {
            if (count > maxCount) {
                maxCount = count;
                maxType = type;
            }
        });
        return maxType ? REVIEW_TIPS[maxType] : "你的表現非常均衡，繼續保持！";
    };

    const getLastAnswerStatus = () => {
        const last = userAnswers[userAnswers.length - 1];
        if (!last) return 'error';

        if (currentQ.correctOX === 'O') {
            return last.isCorrectJudgment ? 'full' : 'wrong';
        }
        if (currentQ.correctOX === 'X') {
            if (last.points === 2) return 'full';
            if (last.points === 1) return 'partial';
            return 'wrong';
        }
        return 'wrong';
    };

    const showDebug = playerName.toLowerCase().includes("debug") || playerName.toLowerCase().includes("admin");
    const getDebugInfo = () => {
        if (!showDebug) return null;
        if (gameState !== 'playing' && gameState !== 'feedback') return null;
        return (
            <div className="absolute bottom-2 right-2 bg-black/80 text-green-400 text-xs p-2 rounded z-50 font-mono">
                <div className="font-bold border-b border-green-500/50 mb-1 flex items-center gap-1"><Bug size={12} /> DEBUG</div>
                Q_ID: {currentQ.id} | TYPE: {currentQ.correctOX}<br />
                ANS: {currentQ.correctType || "NULL"}<br />
                IDX: {currentQIndex}
            </div>
        );
    }

    // ================= INTRO SCREEN =================
    if (gameState === 'intro') {
        return (
            <div className="relative rounded-sm overflow-hidden flex flex-col items-center justify-center p-6 md:py-16 font-sans text-rose-50 min-h-[700px] bg-cover bg-fixed bg-center shadow-2xl"
                style={{ backgroundImage: "url('/images/detective_board_bg.png')" }}>

                {/* 玻璃擬物化深色遮罩 */}
                <div className="absolute inset-0 bg-slate-900/80  z-0"></div>

                <div className="bg-slate-900/70 p-8 md:p-12 rounded-sm shadow-[0_0_40px_rgba(0,0,0,0.5)] max-w-xl w-full text-center border-t-[8px] border-amber-500 relative overflow-hidden z-10  border border-white/10 group hover:border-amber-500/30 transition-colors duration-500">
                    <div className="absolute top-0 right-0 opacity-5 text-9xl -mt-4 -mr-4 text-white pointer-events-none drop-shadow-md">🕵️‍♂️</div>

                    <div className="text-7xl mb-6 animate-pulse drop-shadow-[0_0_15px_rgba(251,191,36,0.5)]">🔍</div>
                    <h1 className="text-3xl md:text-5xl font-['Noto_Serif_TC',serif] font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500 mb-2 tracking-widest drop-shadow-sm">行動代號：獵狐</h1>
                    <div className="text-sm md:text-base font-bold text-amber-300/80 mb-6 bg-amber-950/40 inline-block px-3 py-1 rounded border border-amber-500/20 tracking-wider">
                        🎯 文獻真偽辨識與學術倫理審查
                    </div>
                    <div className="flex items-center justify-center gap-4 mb-6 relative">
                        <div className="h-px bg-gradient-to-r from-transparent via-slate-500 to-transparent flex-1"></div>
                        <h2 className="text-xl md:text-2xl font-bold text-slate-300 tracking-wider">引用文獻偵錯特訓</h2>
                        <div className="h-px bg-gradient-to-r from-transparent via-slate-500 to-transparent flex-1"></div>
                    </div>

                    <p className="text-slate-200 text-lg mb-8 font-medium leading-relaxed">
                        我們攔截了 10 份<span className="text-amber-400 font-bold drop-shadow-[0_0_5px_currentColor]">可疑的學術報告</span>！<br />
                        有些引用可能藏著<span className="text-rose-400 font-bold border-b border-rose-500/50 pb-0.5">「抄襲嫌疑」</span>或是格式錯誤。<br />
                        你能火眼金睛，揪出所有違規嗎？
                    </p>

                    <div className="bg-slate-950/60 rounded-sm p-6 mb-8 text-center border border-slate-700/50 shadow-inner ">
                        <label className="block text-sm font-bold text-slate-400 mb-2 tracking-widest uppercase">🕵️‍♂️ 目前登入身分</label>
                        {playerName ? (
                            <div className="text-2xl font-black text-amber-500 border-b border-amber-500/30 inline-block pb-1 px-4 drop-shadow-[0_0_8px_rgba(245,158,11,0.3)] flex items-center gap-2 justify-center">
                                {playerName} <span className="text-lg text-amber-300/70 font-bold tracking-widest">探員</span>
                            </div>
                        ) : (
                            <div className="text-rose-400 font-bold mb-2 flex items-center justify-center gap-2 bg-rose-950/50 py-2 px-4 rounded-sm border border-rose-900/50">
                                <span className="text-xl">⚠️</span> 無法辨識身分！請返回總部大廳完成報到手續。
                            </div>
                        )}
                        {!playerName && (
                            <p className="text-xs text-slate-500 mt-2">（訪客模式將無法參與最終排行榜排名）</p>
                        )}
                        <h3 className="text-sm font-bold text-slate-400 mb-3 tracking-wider border-t border-slate-700/50 pt-4 mt-6">📋 任務簡報</h3>
                        <div className="space-y-2.5 text-sm text-slate-300 text-left bg-slate-900/50 p-4 rounded-sm border border-slate-700/30">
                            <p className="flex items-start gap-2.5">
                                <span className="text-amber-400 shrink-0 mt-0.5">📁</span>
                                <span>指揮部攔截了 <strong className="text-amber-300">10 份可疑學術引用</strong>，等待特工逐一鑑識</span>
                            </p>
                            <p className="flex items-start gap-2.5">
                                <span className="text-emerald-400 shrink-0 mt-0.5">🔍</span>
                                <span>判斷每份是 <strong className="text-emerald-300">合法（PASS）</strong> 還是 <strong className="text-rose-300">違規（REJECT）</strong>；若為違規，需進一步指認錯誤罪名</span>
                            </p>
                            <p className="flex items-start gap-2.5">
                                <span className="text-amber-400 shrink-0 mt-0.5">🏆</span>
                                <span><strong className="text-amber-300">計分</strong>：PASS 判斷正確 <span className="text-emerald-300 font-bold">+1 分</span>；REJECT 判斷＋指認均正確 <span className="text-emerald-300 font-bold">+2 分</span></span>
                            </p>
                            <p className="flex items-start gap-2.5">
                                <span className="text-rose-400 shrink-0 mt-0.5">⚠️</span>
                                <span>4 種違規罪名：<span className="text-slate-400 text-xs leading-relaxed">孤兒引用 · 換字抄襲 · 忘記標註來源 · 直接引用未加引號</span></span>
                            </p>
                            <p className="flex items-start gap-2.5">
                                <span className="text-cyan-400 shrink-0 mt-0.5">📖</span>
                                <span>點擊下方按鈕將先進入 <strong className="text-cyan-300">引用規範圖鑑</strong>，熟讀後再正式開案</span>
                            </p>
                        </div>
                    </div>

                    <div className="relative z-10 w-full mb-4">
                        <div className="absolute inset-0 bg-amber-500/20 blur-xl rounded-full scale-110 opacity-0 group-hover:opacity-100 transition-opacity duration-500 mx-auto w-3/4"></div>
                        <button
                            onClick={enterTutorial}
                            disabled={!playerName}
                            className={`w-full font-black py-4 px-10 rounded-sm text-xl md:text-2xl transition-all duration-300 transform flex items-center justify-center gap-3 mx-auto relative overflow-hidden group ${!playerName
                                ? 'bg-slate-800 text-slate-600 border border-slate-700 cursor-not-allowed'
                                : 'bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-slate-950 hover:-translate-y-1 shadow-[0_5px_20px_rgba(245,158,11,0.4)] hover:shadow-[0_8px_25px_rgba(245,158,11,0.6)]'
                                }`}
                        >
                            {playerName && <span className="absolute inset-0 w-full h-full bg-white/20 -skew-x-12 -translate-x-full group-hover:animate-shimmer"></span>}
                            <span className="relative z-10 flex items-center justify-center gap-2">開始職前訓練 <ArrowRight size={24} className={playerName ? 'text-slate-900' : 'text-slate-600'} /></span>
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // ================= TUTORIAL SCREEN =================
    if (gameState === 'tutorial') {
        return (
            <div className="relative rounded-sm overflow-hidden flex flex-col items-center justify-center p-6 md:py-16 font-sans text-rose-50 min-h-[700px] bg-cover bg-fixed bg-center shadow-2xl"
                style={{ backgroundImage: "url('/images/detective_board_bg.png')" }}>

                <div className="absolute inset-0 bg-slate-900/80  z-0"></div>

                <div className="bg-slate-900/80 p-8 md:p-12 rounded-sm shadow-[0_0_40px_rgba(0,0,0,0.5)] max-w-4xl w-full border-t-[8px] border-cyan-500 relative z-10  border-x border-b border-white/10">
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center gap-2 bg-cyan-950/60 text-cyan-400 font-bold px-4 py-1.5 rounded-sm text-sm mb-6 tracking-widest uppercase border border-cyan-500/30 shadow-inner">
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                            Tutorial
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-500 mb-6 drop-shadow-sm tracking-wide">
                            引用規範與違規圖鑑
                        </h2>
                        <p className="text-cyan-100/70 text-lg font-medium tracking-wider">
                            請熟讀以下規則，這是破案的唯一線索。
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-12">
                        {/* PASS */}
                        <div className="bg-slate-800/60 p-6 md:p-8 rounded-sm border border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.1)] relative overflow-hidden group hover:border-emerald-500/50 transition-colors">
                            <div className="absolute -right-6 -top-6 text-7xl opacity-5 group-hover:opacity-10 transition-opacity text-emerald-500">✅</div>
                            <h3 className="flex items-center gap-3 font-black text-emerald-400 text-2xl border-b border-emerald-500/30 pb-4 mb-6 drop-shadow-[0_0_8px_currentColor]">
                                <CheckCircle2 size={28} /> 合法引用標準 (PASS)
                            </h3>
                            <ul className="space-y-5 text-slate-300 font-medium">
                                <li className="flex gap-4 items-start">
                                    <span className="bg-emerald-900/80 text-emerald-400 border border-emerald-500/50 font-black w-7 h-7 rounded flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(16,185,129,0.2)]">1</span>
                                    <span><strong className="text-emerald-300">改寫 (Paraphrasing)</strong>：消化原文後，用「自己的話」重新敘述，且意思不變。</span>
                                </li>
                                <li className="flex gap-4 items-start">
                                    <span className="bg-emerald-900/80 text-emerald-400 border border-emerald-500/50 font-black w-7 h-7 rounded flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(16,185,129,0.2)]">2</span>
                                    <span><strong className="text-emerald-300">三明治法</strong>：導讀(麵包) + 引用(肉) + 詮釋(麵包)。引用不能孤單存在。</span>
                                </li>
                                <li className="flex gap-4 items-start">
                                    <span className="bg-emerald-900/80 text-emerald-400 border border-emerald-500/50 font-black w-7 h-7 rounded flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(16,185,129,0.2)]">3</span>
                                    <span><strong className="text-emerald-300">格式正確</strong>：清楚標示出處，例如：(Chen, 2023) 或「根據 Chen (2023) 指出...」。</span>
                                </li>
                            </ul>
                        </div>

                        {/* REJECT */}
                        <div className="bg-slate-800/60 p-6 md:p-8 rounded-sm border border-rose-500/30 shadow-[0_0_20px_rgba(244,63,94,0.1)] relative overflow-hidden group hover:border-rose-500/50 transition-colors">
                            <div className="absolute -right-6 -top-6 text-7xl opacity-5 group-hover:opacity-10 transition-opacity text-rose-500">❌</div>
                            <h3 className="flex items-center gap-3 font-black text-rose-400 text-2xl border-b border-rose-500/30 pb-4 mb-6 drop-shadow-[0_0_8px_currentColor]">
                                <XCircle size={28} /> 常見違規樣態 (REJECT)
                            </h3>
                            <ul className="space-y-4 text-slate-300 font-medium">
                                <li className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                                    <span className="bg-rose-950/80 text-rose-400 border border-rose-500/30 font-bold px-3 py-1 rounded shrink-0 shadow-inner whitespace-nowrap self-start">孤兒引用</span>
                                    <span className="pt-1">引號直接丟在句子裡，沒頭沒尾，沒人介紹它。</span>
                                </li>
                                <li className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                                    <span className="bg-rose-950/80 text-rose-400 border border-rose-500/30 font-bold px-3 py-1 rounded shrink-0 shadow-inner whitespace-nowrap self-start">換字抄襲</span>
                                    <span className="pt-1">句型結構跟原文一樣，只是把「導致」換成「造成」。</span>
                                </li>
                                <li className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                                    <span className="bg-rose-950/80 text-rose-400 border border-rose-500/30 font-bold px-3 py-1 rounded shrink-0 shadow-inner whitespace-nowrap self-start">重點隱匿</span>
                                    <span className="pt-1">寫了「研究顯示」卻沒寫是誰的研究，忘記標註。</span>
                                </li>
                                <li className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                                    <span className="bg-rose-950/80 text-rose-400 border border-rose-500/30 font-bold px-3 py-1 rounded shrink-0 shadow-inner whitespace-nowrap self-start">隱密剽竊</span>
                                    <span className="pt-1">逐字照抄原文，卻沒有加上「」引號。</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="text-center">
                        <button
                            onClick={startGame}
                            className={`font-black py-4 px-12 rounded-sm text-xl md:text-2xl transition-all duration-300 transform flex items-center justify-center gap-3 mx-auto relative overflow-hidden group bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white hover:-translate-y-1 shadow-[0_5px_20px_rgba(6,182,212,0.4)] hover:shadow-[0_8px_25px_rgba(6,182,212,0.6)]`}
                        >
                            <span className="absolute inset-0 w-full h-full bg-white/20 -skew-x-12 -translate-x-full group-hover:animate-shimmer"></span>
                            <span className="relative z-10 flex items-center justify-center gap-2">我已熟讀，開始辦案 <ArrowRight size={28} /></span>
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // ================= RESULT SCREEN =================
    if (gameState === 'result') {
        const level = getDetectiveLevel(score);
        let titleColor = "text-amber-400";
        let titleBg = "bg-amber-950/50 border-amber-500/30";

        if (score >= 15) { titleColor = "text-amber-400"; titleBg = "bg-amber-950/50 border-amber-500/30"; }
        else if (score >= 12) { titleColor = "text-cyan-400"; titleBg = "bg-cyan-950/50 border-cyan-500/30"; }
        else if (score >= 8) { titleColor = "text-emerald-400"; titleBg = "bg-emerald-950/50 border-emerald-500/30"; }
        else { titleColor = "text-rose-400"; titleBg = "bg-rose-950/50 border-rose-500/30"; }

        return (
            <div className="relative rounded-sm overflow-hidden flex flex-col items-center justify-center p-6 md:py-10 font-sans text-rose-50 min-h-[700px] bg-cover bg-fixed bg-center shadow-2xl"
                style={{ backgroundImage: "url('/images/detective_board_bg.png')" }}>

                <div className="absolute inset-0 bg-slate-900/80  z-0"></div>

                <div className="bg-slate-900/70 p-8 md:p-12 rounded-sm shadow-[0_0_40px_rgba(0,0,0,0.5)] max-w-2xl w-full text-center border-t-[8px] border-amber-500 relative overflow-hidden z-10  border-x border-b border-white/10 group hover:border-amber-500/30 transition-colors duration-500">
                    <div className="absolute top-6 left-6 text-slate-500/20 text-6xl pointer-events-none drop-shadow-md">📋</div>
                    <div className="absolute -bottom-10 -right-10 text-9xl opacity-[0.03] text-amber-500 pointer-events-none drop-shadow-[0_0_20px_rgba(251,191,36,0.5)] flex flex-col items-center">
                        <div>📁</div>
                        <div className="-mt-8 text-7xl font-mono tracking-tighter">CONFIDENTIAL</div>
                    </div>

                    <h1 className="text-2xl font-bold text-cyan-400 mb-2 tracking-widest relative z-10 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">🦊 獵狐結案報告</h1>

                    <div className="mb-6 relative z-10">
                        <p className="text-sm font-bold text-slate-500 tracking-widest uppercase mb-1">探員代號</p>
                        <p className="text-2xl font-black text-amber-500 border-b border-amber-500/30 inline-block px-8 pb-1 drop-shadow-[0_0_8px_rgba(245,158,11,0.3)]">{playerName}</p>
                    </div>

                    <div className="flex flex-col items-center justify-center mb-8 relative z-10">
                        <div className="bg-slate-900/80 text-amber-400 p-5 rounded-full mb-6 shadow-inner border border-amber-500/30 ring-4 ring-amber-500/10 drop-shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                            <Award size={56} />
                        </div>
                        <div className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-amber-300 to-amber-600 tracking-tighter mb-4 drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]">
                            {score} <span className="text-4xl text-slate-600/80 font-medium tracking-normal">/ {MAX_SCORE}</span>
                        </div>
                        <h2 className={`text-2xl md:text-3xl font-black px-8 py-3 rounded-sm ${titleColor} ${titleBg} border shadow-inner mb-2 drop-shadow-[0_0_10px_currentColor] tracking-widest`}>
                            {level}
                        </h2>
                    </div>

                    {/* 任務完成回報 */}
                    <div className="bg-slate-900/60 p-6 rounded-sm border border-cyan-500/30 shadow-inner text-left mb-4 relative z-10 overflow-hidden">
                        <div className="absolute top-0 right-0 opacity-[0.04] text-7xl -mt-2 -mr-2 text-cyan-400 pointer-events-none">📸</div>
                        <h3 className="font-black text-cyan-400 flex items-center gap-2 mb-4 border-b border-slate-700/50 pb-3 text-lg drop-shadow-[0_0_5px_currentColor] relative z-10">
                            📸 任務完成回報
                        </h3>
                        <div className="space-y-3 text-sm text-slate-300 relative z-10">
                            <p className="leading-relaxed">
                                請截圖本次「獵狐結案報告」，上傳至 Google Classroom。<br />
                                經指揮官驗證後，可依本次稱號獲得任務加分。
                            </p>
                            <div className="bg-slate-950/60 p-4 rounded-sm border border-slate-700/50">
                                <p className="font-bold text-slate-400 mb-2 text-xs uppercase tracking-widest">加分標準：</p>
                                <ul className="space-y-1.5">
                                    <li className="flex items-center gap-2"><span className="text-emerald-400 font-bold">🔍 鑑識探員</span><span className="text-slate-500">：+1 分</span></li>
                                    <li className="flex items-center gap-2"><span className="text-cyan-400 font-bold">⭐ 資深探長</span><span className="text-slate-500">：+2 分</span></li>
                                    <li className="flex items-center gap-2"><span className="text-amber-400 font-bold">👑 福爾摩斯</span><span className="text-slate-500">：+3 分</span></li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* 指揮官提醒 */}
                    <div className="bg-slate-900/70 p-6 rounded-sm border-l-[6px] border-l-rose-500 border-t border-r border-b border-white/5 shadow-inner text-left mb-4 relative z-10 overflow-hidden">
                        <div className="absolute top-0 right-0 opacity-[0.03] text-8xl -mt-4 -mr-4 text-rose-400 pointer-events-none">⚠️</div>
                        <h3 className="font-black text-rose-400 flex items-center gap-2 mb-4 border-b border-slate-700/50 pb-3 text-lg drop-shadow-[0_0_5px_currentColor] relative z-10">
                            ⚠️ 指揮官提醒
                        </h3>
                        <div className="space-y-3 text-sm text-slate-300 leading-relaxed relative z-10">
                            <p>
                                本系統提供的是「<span className="text-rose-400 font-bold">文獻引用的初步鑑識訓練</span>」，幫助你快速辨識常見的格式錯誤、孤兒引用與換字抄襲。
                            </p>
                            <p>
                                但真實的學術寫作比本次任務更複雜：一段文字是否妥當，不只看格式是否正確，還要看你是否真正理解文獻、是否合理整合證據，以及是否清楚表達自己的觀點。
                            </p>
                            <p className="text-rose-200/90 font-bold mt-2 pt-2 border-t border-rose-900/50">
                                所以，遊戲破關不代表文獻使用已經完全合格；真正的寫作，仍要回到你的論點、證據與學術誠信來判斷。
                            </p>
                        </div>
                    </div>

                    {/* 指揮官行動建議 */}
                    <div className="bg-slate-900/60 p-6 rounded-sm border-l-[6px] border-l-amber-500 border-t border-r border-b border-white/5 shadow-inner text-left mb-10 relative z-10 ">
                        <h3 className="font-black text-amber-400 flex items-center gap-2 mb-4 border-b border-slate-700/50 pb-3 text-lg drop-shadow-[0_0_5px_currentColor]">
                            <AlertTriangle size={22} className="text-amber-500" /> 🧭 指揮官行動建議
                        </h3>
                        <p className="text-slate-200 font-medium leading-relaxed text-lg">{getWeakestPoint()}</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 justify-center relative z-10">
                        <button
                            onClick={() => setGameState('intro')}
                            className="group bg-slate-800/80 hover:bg-slate-700 text-amber-400 font-bold py-3 px-8 rounded-sm text-base transition-all border border-slate-600 hover:border-amber-500/50 inline-flex items-center justify-center gap-2"
                        >
                            <RefreshCw size={18} className="group-hover:rotate-180 transition-transform duration-500" /> 重新接受特訓
                        </button>
                        <a
                            href="/games"
                            className="bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold py-3 px-8 rounded-sm text-base transition-all border border-amber-400/50 inline-flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(245,158,11,0.3)]"
                        >
                            ← 返回指揮中心
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    // ================= PLAYING / FEEDBACK SCREEN =================
    return (
        <div className="relative rounded-sm overflow-hidden flex flex-col items-center p-4 md:p-8 font-sans min-h-[700px] text-rose-50 shadow-2xl bg-cover bg-fixed bg-center"
            style={{ backgroundImage: "url('/images/detective_board_bg.png')" }}>
            <div className="absolute inset-0 bg-slate-900/80  z-0"></div>
            {getDebugInfo()}
            <div className="max-w-4xl w-full flex flex-col h-full">

                {/* Header */}
                <div className="flex flex-wrap justify-between items-center gap-3 mb-4 px-1 shrink-0">
                    <div className="bg-slate-900/80 text-slate-300 font-bold px-5 py-2 rounded-sm shadow-sm text-lg border border-slate-700/60 flex items-center gap-2 backdrop-blur-sm">
                        <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse drop-shadow-[0_0_4px_rgba(251,191,36,0.8)]"></span>
                        案件 {currentQIndex + 1} <span className="opacity-40 font-normal">/ {shuffledQuestions.length}</span>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* 進度點 */}
                        <div className="hidden sm:flex items-center gap-1">
                            {shuffledQuestions.map((_, i) => (
                                <div key={i} className={`rounded-full transition-all duration-300 ${i < currentQIndex ? 'w-2 h-2 bg-amber-500' : i === currentQIndex ? 'w-3 h-3 bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.8)]' : 'w-1.5 h-1.5 bg-slate-700'}`}></div>
                            ))}
                        </div>
                        <div className="text-right bg-slate-900/80 px-4 py-2 rounded-sm border border-slate-700/60 backdrop-blur-sm">
                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest block leading-tight">任務積分</span>
                            <span className="text-xl font-black text-amber-400 leading-tight drop-shadow-[0_0_6px_rgba(251,191,36,0.5)]">{score}</span>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-900/80 p-6 md:p-8 rounded-sm shadow-[0_0_40px_rgba(0,0,0,0.5)] border-t-[8px] border-amber-500 border-x border-b border-white/10 relative flex-1 flex flex-col backdrop-blur-sm overflow-hidden">
                    {/* 角落裝飾線 */}
                    <div className="absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2 border-amber-500/30 pointer-events-none"></div>
                    <div className="absolute bottom-3 right-3 w-5 h-5 border-b-2 border-r-2 border-amber-500/30 pointer-events-none"></div>
                    {/* CASE FILE 浮水印 */}
                    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-slate-600/[0.07] text-6xl font-black uppercase tracking-[0.3em] pointer-events-none select-none rotate-[-12deg] whitespace-nowrap">CASE FILE</div>

                    <div className="absolute top-0 right-6 bg-amber-500/20 text-amber-300 text-xs font-black px-4 py-1.5 rounded-b-lg tracking-widest border border-amber-500/30 border-t-0 shadow-[0_0_10px_rgba(251,191,36,0.2)]">
                        {currentQ.title}
                    </div>

                    {gameState === 'playing' ? (
                        <>
                            {/* EXHIBIT 標題 */}
                            <div className="flex items-center gap-2 mt-4 mb-2">
                                <div className="h-px flex-1 bg-gradient-to-r from-transparent to-amber-500/20"></div>
                                <span className="text-[10px] font-black text-amber-500/50 tracking-[0.25em] uppercase">📎 Exhibit #{currentQIndex + 1}</span>
                                <div className="h-px flex-1 bg-gradient-to-l from-transparent to-amber-500/20"></div>
                            </div>

                            <div className="flex-1 flex flex-col justify-center min-h-0 pb-4">
                                {renderQuestionCard(currentQ.prompt)}
                            </div>

                            <div className="shrink-0 pt-4 mt-2 border-t border-dashed border-slate-700/50">
                                {/* VERDICT 標題 */}
                                <div className="text-center mb-3">
                                    <span className="text-[10px] font-black text-slate-600 tracking-[0.3em] uppercase">⚖ Verdict</span>
                                </div>
                                <div className="flex gap-4 md:gap-6 justify-center mb-6">
                                    <button
                                        onClick={() => handleOXSelect('O')}
                                        className={`group flex-1 max-w-[150px] py-5 rounded-xl border-4 flex flex-col items-center justify-center transition-all transform hover:scale-105 active:scale-95 ${selectedOX === 'O' ? 'border-emerald-500 bg-emerald-900/30 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)]' : 'border-slate-600 text-slate-500 hover:border-emerald-600 hover:bg-emerald-900/20 bg-slate-800/50'}`}
                                    >
                                        <CheckCircle2 size={36} className="mb-2" />
                                        <span className="font-black text-base">合法引用</span>
                                        <span className="text-xs font-bold opacity-60 mt-0.5 uppercase tracking-widest">Pass</span>
                                    </button>
                                    <button
                                        onClick={() => handleOXSelect('X')}
                                        className={`group flex-1 max-w-[150px] py-5 rounded-xl border-4 flex flex-col items-center justify-center transition-all transform hover:scale-105 active:scale-95 ${selectedOX === 'X' ? 'border-red-500 bg-red-900/30 text-red-400 shadow-[0_0_20px_rgba(239,68,68,0.3)]' : 'border-slate-600 text-slate-500 hover:border-red-600 hover:bg-red-900/20 bg-slate-800/50'}`}
                                    >
                                        <XCircle size={36} className="mb-2" />
                                        <span className="font-black text-base">引用錯誤</span>
                                        <span className="text-xs font-bold opacity-60 mt-0.5 uppercase tracking-widest">Reject</span>
                                    </button>
                                </div>

                                {selectedOX === 'X' && (
                                    <div className="bg-slate-800/60 p-5 md:p-6 rounded-sm border border-slate-600 mb-6 animate-in fade-in slide-in-from-bottom-2">
                                        <h4 className="text-sm font-black text-slate-300 mb-3 border-b border-slate-700 pb-2">請指認錯誤類型 (必填)：</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
                                            {ERROR_TYPES.map((type) => (
                                                <label key={type.id} className={`flex items-center p-3 rounded-sm cursor-pointer transition-colors border-2 ${selectedType === type.id ? 'bg-red-900/30 border-red-500 shadow-sm' : 'border-slate-600 bg-slate-800/40 hover:border-red-600/50'}`}>
                                                    <input type="radio" name="errorType" value={type.id} checked={selectedType === type.id} onChange={() => setSelectedType(type.id)} className="w-4 h-4 text-red-600 border-gray-600 focus:ring-red-500 bg-slate-700" />
                                                    <span className={`ml-3 font-bold text-sm md:text-base ${selectedType === type.id ? 'text-red-300' : 'text-slate-300'}`}>{type.label}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                <button
                                    onClick={() => handleSubmit()}
                                    disabled={!selectedOX || (selectedOX === 'X' && !selectedType)}
                                    className={`w-full py-4 rounded-sm font-black text-lg md:text-xl tracking-widest transition-all ${(!selectedOX || (selectedOX === 'X' && !selectedType)) ? 'bg-slate-700/50 text-slate-500 cursor-not-allowed border border-slate-600' : 'bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-900 shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_30px_rgba(245,158,11,0.5)] hover:-translate-y-1 active:translate-y-0'}`}
                                >
                                    提交證據 SUBMIT
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col animate-in fade-in slide-in-from-bottom-4 py-2">
                            <div className={`shrink-0 p-4 md:p-6 mb-6 rounded-sm border-2 text-center shadow-sm ${getLastAnswerStatus() === 'full' ? 'bg-emerald-900/40 border-emerald-500/60 text-emerald-300' : getLastAnswerStatus() === 'partial' ? 'bg-amber-900/40 border-amber-500/60 text-amber-300' : 'bg-red-900/40 border-red-500/60 text-red-300'}`}>
                                <div className="text-2xl md:text-3xl font-black mb-2 flex items-center justify-center gap-3">
                                    {getLastAnswerStatus() === 'full' ? <><CheckCircle2 size={32} /> 完美破案！</> : getLastAnswerStatus() === 'partial' ? <><AlertTriangle size={32} /> 部分正確</> : <><XCircle size={32} /> 判斷錯誤</>}
                                </div>
                                <div className="text-sm md:text-base font-bold opacity-90 tracking-wide">本題得分：+{userAnswers[userAnswers.length - 1]?.points} (總分: {score})</div>
                            </div>

                            {getLastAnswerStatus() === 'partial' && (
                                <div className="text-center text-sm mb-6 bg-red-900/30 p-4 rounded-sm border-2 border-red-700/50 shadow-inner">
                                    <span className="font-black text-red-400 text-base mb-2 block">罪名指認錯誤！</span>
                                    你選擇了：<span className="text-slate-500 line-through font-bold inline-block mx-2">{ERROR_TYPES.find(t => t.id === userAnswers[userAnswers.length - 1].userType)?.label}</span><br />
                                    正解應為：<span className="text-emerald-400 font-black text-lg inline-block mt-2 bg-emerald-900/50 px-3 py-1 rounded border border-emerald-700/50">{ERROR_TYPES.find(t => t.id === currentQ.correctType)?.label}</span>
                                </div>
                            )}

                            <div className="space-y-6 flex-1 overflow-y-auto">
                                <div className="bg-slate-800/60 p-5 rounded-sm border border-slate-700">
                                    <h4 className="text-sm font-black text-cyan-400 mb-3 flex items-center gap-2 drop-shadow-[0_0_5px_currentColor]"><Search size={18} /> 偵探分析報告</h4>
                                    <p className="text-slate-200 font-medium leading-relaxed">{currentQ.explanation}</p>
                                    {renderHighlight(currentQ.prompt, currentQ.highlightHints)}
                                </div>
                                <div className="bg-emerald-900/25 p-5 rounded-sm border border-emerald-700/50 relative shadow-sm">
                                    <h4 className="text-sm font-black text-emerald-400 mb-2 flex items-center gap-2 drop-shadow-[0_0_5px_currentColor]"><CheckCircle2 size={18} /> 典範修正示範</h4>
                                    <div className="text-slate-200 whitespace-pre-line font-medium leading-relaxed">{currentQ.fixExample}</div>
                                </div>
                            </div>

                            <div className="pt-6 mt-4 border-t-2 border-slate-700/50 shrink-0">
                                <button onClick={nextQuestion} className="w-full bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-900 font-black py-4 rounded-sm flex items-center justify-center gap-2 text-lg shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_30px_rgba(245,158,11,0.5)] hover:-translate-y-1 transition-all">
                                    {currentQIndex < shuffledQuestions.length - 1 ? '處理下一個案件' : '查看結案報告'} <ChevronRight size={24} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
