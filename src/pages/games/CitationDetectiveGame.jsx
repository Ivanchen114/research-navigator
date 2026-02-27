import React, { useState, useEffect } from 'react';
import { Search, CheckCircle2, XCircle, AlertTriangle, Award, RefreshCw, ArrowRight, Fingerprint, Briefcase, ChevronRight, Bug } from 'lucide-react';

const QUESTIONS_DATA = [
    { id: 1, title: "基礎判斷", prompt: "睡眠不足會導致前額葉功能下降，影響學生專注力（陳醫師，2023）。", correctOX: "O", correctType: null, explanation: "引用格式正確，且有將資訊消化為自己的語句。", fixExample: "無須修正，這是一個標準的括號引用範例。", highlightHints: [] },
    { id: 2, title: "比對原文", prompt: "原文：「睡眠不足會導致前額葉皮質功能下降，進而削弱學生的專注力與情緒控管能力。」（陳醫師，2023）\n\n學生寫：睡眠不夠會造成前額葉皮質運作降低，進而減弱同學的專心度和情緒管理。（陳醫師，2023）", correctOX: "X", correctType: "patchwriting", explanation: "這是「換字抄襲」。句型結構、邏輯順序與原文幾乎一模一樣，只是替換了同義詞。", fixExample: "修正版：陳醫師（2023）指出，睡眠不足不僅影響大腦前額葉功能，更會同時削弱學生的專注力與情緒調節能力。\n（建議：讀懂後蓋上書本，用自己的話重講一遍）", highlightHints: ["睡眠不夠會造成", "前額葉皮質運作降低", "減弱同學的專心度"] },
    { id: 3, title: "孤兒引用 ⭐", prompt: "AI很好用。(Wang, 2023) 所以我們要多用。", correctOX: "X", correctType: "orphan", explanation: "這是「孤兒引用」。引號像孤兒一樣被丟在句中，沒有導讀（前情提要）也沒有解釋（這句話這明了什麼）。", fixExample: "修正版（三明治法）：\n近年來科技融入教學已成趨勢（上片麵包）。Wang (2023) 指出 AI 工具能顯著提升學習效率（肉片）。因此，教師應適度引導學生使用工具（下片麵包）。", highlightHints: ["(Wang, 2023)"] },
    { id: 4, title: "常見疏漏", prompt: "研究顯示，適度飲用咖啡能提升大腦警覺性。", correctOX: "X", correctType: "missing_citation", explanation: "提到「研究顯示」卻沒有附上來源，讀者無法驗證是哪一份研究。", fixExample: "修正版：\n研究顯示，適度飲用咖啡能提升大腦警覺性（Lin, 2020）。\n或：Lin (2020) 的研究指出，適度飲用咖啡能提升大腦警覺性。", highlightHints: ["研究顯示"] },
    { id: 5, title: "改寫練習", prompt: "原文：「研究顯示，適度飲用咖啡因能短暫提升大腦的警覺性。」（林教授，2020）\n\n學生寫：根據林教授（2020）的研究，青少年若飲用適量咖啡，可能在短時間內較為清醒。", correctOX: "O", correctType: null, explanation: "正確改寫。語意保留但句構已改變，且清楚標示來源。", fixExample: "表現很好！這就是用自己的話重述（Paraphrasing）。", highlightHints: [] },
    { id: 6, title: "引用格式", prompt: "原文：「拖延症並非單純的時間管理失敗，而是一種情緒調節的失敗。」（Sirois, 2018）\n\n學生寫：根據Sirois（2018）的研究，拖延症並非單純的時間管理失敗，而是一種情緒調節的失敗。", correctOX: "X", correctType: "missing_quotes", explanation: "這是「直接引用但沒引號」。後半句完全照抄原文，必須加上引號，否則會被視為抄襲。", fixExample: "修正版1（加引號）：Sirois (2018) 強調：「拖延症並非單純的時間管理失敗，而是一種情緒調節的失敗。」\n修正版2（改寫）：Sirois (2018) 認為拖延症的主因其實是情緒調節失靈，而非時間管理不當。", highlightHints: ["拖延症並非單純的時間管理失敗，而是一種情緒調節的失敗"] },
    { id: 7, title: "孤兒引用 ⭐", prompt: "根據研究，手機使用會影響睡眠（Chen, 2023; Wang, 2022）。", correctOX: "X", correctType: "orphan", explanation: "典型的「孤兒引用」。括號內的文獻無法支撐這句話的具體內容（怎麼影響？正向還是負向？）。", fixExample: "修正版：\n多項研究證實，睡前使用手機的藍光會抑制褪黑激素分泌，導致入睡困難（Chen, 2023; Wang, 2022）。", highlightHints: ["根據研究，手機使用會影響睡眠"] },
    { id: 8, title: "三明治法", prompt: "許多學生認為拖延只是時間管理問題。然而，Sirois (2018) 指出：「拖延症並非單純的時間管理失敗，而是一種情緒調節的失敗。」這提醒我們，制定讀書計畫時也要考慮情緒管理。", correctOX: "O", correctType: null, explanation: "完美的「三明治法」！\n上層麵包（背景）→ 肉片（引用文獻+引號）→ 下層麵包（個人觀點/總結）。", fixExample: "優秀的示範！引用文獻是為了支持你的觀點，而不是取代你的觀點。", highlightHints: [] },
    { id: 9, title: "串燒引用 ⭐", prompt: "研究指出手機影響睡眠（A, 2020）。另一研究發現運動有益健康（B, 2021）。還有研究說壓力影響學習（C, 2022）。", correctOX: "X", correctType: "orphan", explanation: "這是「孤兒串燒」。只是把一堆文獻堆疊在一起，缺乏邏輯連結與作者的主張。", fixExample: "修正版：\n影響學生身心健康的因素眾多。A (2020) 與 C (2022) 分別指出手機成癮與學業壓力是主因，而 B (2021) 則建議透過規律運動來緩解上述問題。", highlightHints: ["研究指出", "另一研究發現", "還有研究說"] },
    { id: 10, title: "綜合應用", prompt: "關於高中生睡眠問題，研究顯示睡眠不足會影響學業成績（陳醫師，2023）、情緒穩定（林教授，2022）以及人際關係（王研究，2021），顯示睡眠品質對青少年發展具有多面向影響。", correctOX: "O", correctType: null, explanation: "正確引用多篇文獻來支持一個綜合性的論點（Synthesis）。", fixExample: "這是進階技巧！將不同來源的資訊整合成一個完整的論述。", highlightHints: [] }
];

const ERROR_TYPES = [
    { id: 'orphan', label: '孤兒引用（只有引用沒有說明）' },
    { id: 'patchwriting', label: '換字抄襲（句構幾乎不變）' },
    { id: 'missing_citation', label: '忘記標註來源' },
    { id: 'missing_quotes', label: '直接引用但沒引號' },
    { id: 'uncertain', label: '不確定 / 其他' }
];

const REVIEW_TIPS = {
    orphan: "孤兒引用就像「只給肉片沒給麵包」。記得用「三明治法」：先寫前言（上麵包），放入引用（肉），再加自己的解釋（下麵包）。",
    patchwriting: "換字抄襲是大忌！不要只換同義詞。請讀懂原文後，蓋上書本，用「完全不同」的句型重新講一遍。",
    missing_citation: "只要提到「研究顯示」、「數據指出」，就一定要在後面括號加上 (作者, 年份)。",
    missing_quotes: "如果是逐字照抄（超過 3-5 個字連續相同），一定要加「引號」，不然就是剽竊。",
};

// --- Custom CSS to be injected ---
const gameStyles = `
.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.05); }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #d1c4aa; border-radius: 4px; }
.font-typewriter { font-family: 'Courier Prime', 'Noto Serif TC', monospace; }
.folder-tab { clip-path: polygon(0 0, 85% 0, 92% 100%, 0% 100%); }
.paper-texture {
  background-color: #fcfbf7;
  background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.5' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.05'/%3E%3C/svg%3E");
}
@keyframes slide-down { from { transform: translateY(-20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
.animate-slide-down { animation: slide-down 0.4s ease-out forwards; }
.polaroid { background: white; padding: 8px 8px 24px 8px; box-shadow: 2px 3px 6px rgba(0,0,0,0.2); transform: rotate(-2deg); }
`;

// --- UI Components ---
const DetectiveBadge = ({ level, name }) => {
    let badgeColor = "", borderColor = "", iconColor = "";
    if (level === '福爾摩斯') { badgeColor = "bg-yellow-100"; borderColor = "border-yellow-600"; iconColor = "text-yellow-700"; }
    else if (level === '資深偵探') { badgeColor = "bg-stone-200"; borderColor = "border-stone-600"; iconColor = "text-stone-700"; }
    else { badgeColor = "bg-orange-50"; borderColor = "border-orange-300"; iconColor = "text-orange-700"; }

    return (
        <div className={`relative p-4 md:p-6 border-4 double ${borderColor} ${badgeColor} rounded-xl shadow-xl flex flex-col items-center justify-center max-w-[240px] md:max-w-xs mx-auto transform rotate-1`}>
            <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-3 h-3 rounded-full bg-gray-400 shadow-inner border border-gray-500"></div>
            <div className="mb-2 mt-2"><Award className={`w-12 h-12 md:w-16 md:h-16 ${iconColor}`} strokeWidth={1.5} /></div>
            <div className={`font-serif font-black text-lg md:text-xl uppercase tracking-widest ${iconColor} border-b-2 ${borderColor} pb-1 mb-2`}>{level}</div>
            <div className="font-typewriter text-[10px] md:text-xs text-stone-600 uppercase mb-1">探員姓名 (Agent Name)</div>
            <div className="font-handwriting text-xl md:text-2xl font-bold text-blue-900 border-b border-stone-400 w-full text-center pb-1 font-serif">{name}</div>
            <div className="mt-2 md:mt-4 flex gap-2">
                <div className="w-6 h-6 md:w-8 md:h-8 rounded-full border border-stone-400 bg-stone-300 flex items-center justify-center opacity-50"><Fingerprint size={16} className="text-stone-600" /></div>
                <div className="text-[9px] md:text-[10px] text-stone-500 leading-tight text-left font-typewriter">貝克街<br />文獻偵探社</div>
            </div>
        </div>
    );
};

const CrimeSceneMarker = ({ letter, selected }) => (
    <div className={`w-6 h-6 md:w-8 md:h-8 flex items-center justify-center font-bold text-sm md:text-lg rounded shadow-sm border-2 shrink-0 ${selected ? 'bg-yellow-400 border-yellow-600 text-yellow-900' : 'bg-yellow-100 border-yellow-300 text-yellow-700'}`}>{letter}</div>
);

const renderQuestionCard = (prompt) => {
    if (prompt.includes("原文：") && prompt.includes("學生寫：")) {
        const parts = prompt.split(/原文：|學生寫：/);
        return (
            <div className="space-y-4 w-full text-left font-typewriter">
                <div className="bg-[#fdfbf7] p-3 md:p-4 shadow-sm border border-stone-300 relative transform -rotate-1 min-h-[100px]">
                    <div className="absolute -top-3 left-2 bg-stone-600 text-stone-100 text-[10px] md:text-xs px-2 py-0.5 font-bold uppercase tracking-wider shadow-sm">【證物 A】原文 (Original)</div>
                    <div className="mt-1 md:mt-2 text-stone-800 whitespace-pre-line leading-relaxed text-sm md:text-base border-l-2 border-stone-300 pl-3">{parts[1]?.trim()}</div>
                </div>
                <div className="bg-[#fffefe] p-3 md:p-4 shadow-md border border-stone-200 relative transform rotate-1 min-h-[100px]">
                    <div className="absolute -top-3 left-2 bg-red-800 text-red-50 text-[10px] md:text-xs px-2 py-0.5 font-bold uppercase tracking-wider shadow-sm">【證物 B】學生寫法 (Suspect)</div>
                    <div className="mt-1 md:mt-2 text-stone-900 font-medium whitespace-pre-line leading-relaxed text-sm md:text-base border-l-2 border-red-800 pl-3">{parts[2]?.trim()}</div>
                </div>
            </div>
        );
    }
    return <div className="bg-white p-4 md:p-6 shadow-sm border border-stone-200 font-typewriter text-base md:text-xl text-stone-800 whitespace-pre-line leading-relaxed min-h-[150px]">{prompt}</div>;
};

const renderHighlight = (text, highlights) => {
    const processHighlights = (content) => {
        if (!highlights || highlights.length === 0) return content;
        let parts = content.split(new RegExp(`(${highlights.join('|')})`, 'g'));
        return parts.map((part, i) => highlights.includes(part) ? <span key={i} className="bg-yellow-200 decoration-red-500 decoration-wavy underline decoration-2 px-1">{part}</span> : part);
    };
    if (text.includes("原文：")) {
        const parts = text.split(/原文：|學生寫：/);
        return (
            <div className="space-y-2 md:space-y-4 text-xs md:text-sm font-typewriter">
                <div className="text-stone-500 border-l-4 border-stone-300 pl-2">{processHighlights(parts[1]?.trim() || "")}</div>
                <div className="text-stone-800 border-l-4 border-red-400 pl-2 bg-red-50/50 p-2">{processHighlights(parts[2]?.trim() || "")}</div>
            </div>
        )
    }
    return <div className="whitespace-pre-line font-typewriter text-xs md:text-base">{processHighlights(text)}</div>;
};

const CaseFileContainer = ({ children, title, headerRight, debugInfo }) => (
    <div className="w-full max-w-5xl mx-auto bg-[#e6dcc8] rounded-lg md:rounded-xl shadow-2xl overflow-hidden relative border-t-2 border-[#d6ccb8] flex flex-col h-full min-h-[600px]">
        <style>{gameStyles}</style>
        <div className="absolute top-0 left-0 w-32 md:w-48 h-8 md:h-10 bg-[#d1c4aa] folder-tab shadow-inner z-0"></div>
        <div className="relative z-10 bg-[#d1c4aa]/50 border-b border-[#bfae92] p-2 md:p-4 flex justify-between items-end h-14 md:h-20 pb-2 md:pb-3 shrink-0">
            <div className="flex flex-col">
                <span className="text-[8px] md:text-[10px] uppercase tracking-[0.2em] text-stone-500 font-bold ml-1">機密偵查檔案</span>
                <h2 className="text-base md:text-2xl font-bold text-stone-800 font-serif flex items-center gap-2"><Briefcase size={20} className="md:w-6 md:h-6 text-stone-700" /> {title}</h2>
            </div>
            <div className="flex items-center gap-2">{headerRight}</div>
        </div>
        <div className="p-2 md:p-6 bg-[#e6dcc8] flex-1 overflow-hidden relative">
            <div className="paper-texture bg-[#fcfbf7] shadow-lg w-full h-full relative flex flex-col overflow-hidden">
                <div className="md:pl-12 h-full w-full overflow-hidden p-3 md:p-8 flex flex-col">
                    {children}
                </div>
                {debugInfo && (
                    <div className="absolute bottom-2 right-2 opacity-50 hover:opacity-100 bg-black/80 text-green-400 text-[10px] p-2 rounded z-50 font-mono pointer-events-none">
                        <div className="flex items-center gap-1 font-bold border-b border-green-500/50 mb-1"><Bug size={10} /> DEBUG MODE</div>
                        {debugInfo}
                    </div>
                )}
            </div>
        </div>
    </div>
);

export const CitationDetectiveGame = () => {
    const [gameState, setGameState] = useState('intro');
    const [currentQIndex, setCurrentQIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [timer, setTimer] = useState(20);
    const [userAnswers, setUserAnswers] = useState([]);
    const [selectedOX, setSelectedOX] = useState(null);
    const [selectedType, setSelectedType] = useState(null);
    const [shuffledQuestions, setShuffledQuestions] = useState([]);
    const [isRandom] = useState(true);
    const [playerName, setPlayerName] = useState("");

    const MAX_SCORE = 16;

    const initQuestions = () => {
        let q = [...QUESTIONS_DATA];
        if (isRandom) q.sort(() => Math.random() - 0.5);
        setShuffledQuestions(q);
    };

    useEffect(() => {
        let interval;
        if (gameState === 'playing' && timer > 0) {
            interval = setInterval(() => setTimer(prev => prev - 1), 1000);
        } else if (timer === 0 && gameState === 'playing') {
            handleSubmit(true);
        }
        return () => clearInterval(interval);
    }, [timer, gameState]);

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
        setTimer(20);
        setSelectedOX(null);
        setSelectedType(null);
    };

    const handleOXSelect = (choice) => {
        setSelectedOX(choice);
        if (choice === 'O') setSelectedType(null);
    };

    const handleSubmit = (isTimeOut = false) => {
        if (!isTimeOut && !selectedOX) return;
        if (!isTimeOut && selectedOX === 'X' && !selectedType) return;

        let points = 0;
        let isCorrectJudgment = false;
        let isCorrectType = false;

        if (!isTimeOut && selectedOX === currentQ.correctOX) {
            points += 1;
            isCorrectJudgment = true;
        }

        if (!isTimeOut && currentQ.correctOX === 'X' && isCorrectJudgment && selectedType === currentQ.correctType) {
            points += 1;
            isCorrectType = true;
        }

        setScore(prev => prev + points);
        setUserAnswers(prev => [...prev, {
            questionId: currentQ.id,
            correctOX: currentQ.correctOX,
            userOX: isTimeOut ? 'TimeOut' : selectedOX,
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
            setGameState('result');
        }
    };

    const getDetectiveLevel = (finalScore) => {
        if (finalScore >= 15) return '福爾摩斯';
        if (finalScore >= 12) return '資深偵探';
        if (finalScore >= 8) return '鑑識探員';
        return '見習探員';
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
            <div>
                Q_ID: {currentQ.id} | TYPE: {currentQ.correctOX}<br />
                ANS: {currentQ.correctType || "NULL"}<br />
                Current_IDX: {currentQIndex}
            </div>
        );
    }

    // --- Screens ---
    if (gameState === 'intro') {
        return (
            <div className="bg-[#2c241b] rounded-xl overflow-hidden p-6" style={{ backgroundImage: 'radial-gradient(#3a3125 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
                <CaseFileContainer title="W6 文獻偵探社" headerRight={<div className="text-stone-500 font-typewriter text-[10px] md:text-xs">TOP SECRET</div>}>
                    <div className="flex flex-col items-center justify-center h-full space-y-4 md:space-y-8 text-center overflow-y-auto custom-scrollbar">
                        <div className="border-4 border-stone-800 p-3 md:p-6 rounded-full shrink-0"><Search className="w-10 h-10 md:w-16 md:h-16 text-stone-800" /></div>
                        <div className="space-y-1 md:space-y-2 shrink-0">
                            <h1 className="text-2xl md:text-4xl font-serif font-black text-stone-900 tracking-tight">偵探入職測驗</h1>
                            <p className="font-typewriter text-stone-600 text-sm md:text-base">引用文獻偵錯特訓</p>
                        </div>
                        <div className="w-full max-w-sm bg-stone-100 p-3 md:p-6 border-2 border-stone-300 border-dashed rounded-lg transform -rotate-1 relative shrink-0">
                            <div className="absolute -top-3 bg-stone-200 text-stone-600 px-2 text-[10px] md:text-xs font-bold uppercase">探員資料</div>
                            <label className="block text-left text-[10px] md:text-xs font-bold text-stone-500 uppercase mb-1">探員代號 (姓名)：</label>
                            <input type="text" value={playerName} onChange={(e) => setPlayerName(e.target.value)} placeholder="請輸入你的名字..." className="w-full bg-transparent border-b-2 border-stone-400 focus:border-stone-800 outline-none px-2 py-1 font-typewriter text-base md:text-xl text-stone-800 placeholder-stone-300" />
                        </div>
                        <div className="text-left w-full max-w-md space-y-1 md:space-y-2 text-xs md:text-sm text-stone-700 bg-yellow-50/50 p-3 md:p-4 border-l-4 border-yellow-600 font-typewriter shrink-0">
                            <div className="font-bold uppercase text-yellow-800 mb-1">任務簡報：</div>
                            <p className="flex items-center gap-1"><CheckCircle2 size={14} className="text-emerald-700" /> 引用正確且無抄襲 → <strong>選「合法引用」</strong></p>
                            <p className="flex items-center gap-1"><XCircle size={14} className="text-red-700" /> 有抄襲嫌疑或格式錯 → <strong>選「引用錯誤」</strong></p>
                            <hr className="border-yellow-600/30 my-2" />
                            <p>- 10 個可疑案件，限時破案</p>
                        </div>
                        <button onClick={enterTutorial} disabled={!playerName.trim()} className={`group relative px-6 md:px-8 py-2 md:py-3 font-bold text-white transition-all transform hover:-translate-y-1 active:translate-y-0 shrink-0 ${!playerName.trim() ? 'grayscale cursor-not-allowed opacity-50' : ''}`}>
                            <div className="absolute inset-0 bg-stone-900 rounded shadow-lg transform rotate-1 group-hover:rotate-2 transition-transform"></div>
                            <div className="relative flex items-center gap-2 font-typewriter text-base md:text-lg tracking-widest">開始職前訓練 <ArrowRight size={18} /></div>
                        </button>
                    </div>
                </CaseFileContainer>
            </div>
        );
    }

    if (gameState === 'tutorial') {
        return (
            <div className="bg-[#2c241b] rounded-xl overflow-hidden p-6" style={{ backgroundImage: 'radial-gradient(#3a3125 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
                <CaseFileContainer title="探員職前訓練手冊" headerRight={<div className="text-stone-500 font-typewriter text-[10px] md:text-xs">MANUAL</div>}>
                    <div className="h-full flex flex-col overflow-y-auto custom-scrollbar">
                        <div className="text-center mb-4">
                            <h2 className="text-xl md:text-2xl font-black text-stone-900 mb-1">引用規範與違規圖鑑</h2>
                            <p className="text-stone-500 text-xs md:text-sm font-typewriter">請熟讀以下規則，這是破案的關鍵。</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 flex-1">
                            <div className="bg-emerald-50/50 p-4 rounded-lg border-2 border-emerald-100">
                                <h3 className="flex items-center gap-2 font-bold text-emerald-800 border-b-2 border-emerald-200 pb-2 mb-3"><CheckCircle2 size={20} /> 合法引用標準 (PASS)</h3>
                                <ul className="space-y-4 text-stone-700 text-sm md:text-base">
                                    <li className="flex gap-2"><span className="font-bold text-emerald-700 shrink-0">1. 改寫 (Paraphrasing)：</span><span>消化原文後，用「自己的話」重新敘述，且意思不變。</span></li>
                                    <li className="flex gap-2"><span className="font-bold text-emerald-700 shrink-0">2. 三明治法：</span><span>導讀(麵包) + 引用(肉) + 詮釋(麵包)。引用不能孤單存在。</span></li>
                                    <li className="flex gap-2"><span className="font-bold text-emerald-700 shrink-0">3. 格式正確：</span><span>清楚標示出處，例如：(Chen, 2023) 或「根據 Chen (2023) 指出...」。</span></li>
                                </ul>
                            </div>
                            <div className="bg-red-50/50 p-4 rounded-lg border-2 border-red-100">
                                <h3 className="flex items-center gap-2 font-bold text-red-800 border-b-2 border-red-200 pb-2 mb-3"><XCircle size={20} /> 常見違規樣態 (REJECT)</h3>
                                <ul className="space-y-3 text-stone-700 text-xs md:text-sm">
                                    <li className="flex flex-col"><span className="font-bold text-red-700">A. 孤兒引用：</span><span>引號直接丟在句子裡，沒頭沒尾，沒人介紹它。</span></li>
                                    <li className="flex flex-col"><span className="font-bold text-red-700">B. 換字抄襲：</span><span>句型結構跟原文一樣，只是把「導致」換成「造成」。</span></li>
                                    <li className="flex flex-col"><span className="font-bold text-red-700">C. 忘記標註：</span><span>寫了「研究顯示」卻沒寫是誰的研究。</span></li>
                                    <li className="flex flex-col"><span className="font-bold text-red-700">D. 沒加引號：</span><span>逐字照抄原文，卻沒有加上「」引號。</span></li>
                                </ul>
                            </div>
                        </div>
                        <div className="mt-6 md:mt-8 text-center shrink-0 pb-4">
                            <button onClick={startGame} className="group relative px-8 py-3 font-bold text-white transition-all transform hover:-translate-y-1 active:translate-y-0 inline-block">
                                <div className="absolute inset-0 bg-stone-900 rounded shadow-lg transform rotate-1 group-hover:rotate-2 transition-transform"></div>
                                <div className="relative flex items-center gap-2 font-typewriter text-lg tracking-widest">我已熟讀，開始辦案 <ArrowRight size={18} /></div>
                            </button>
                        </div>
                    </div>
                </CaseFileContainer>
            </div>
        );
    }

    if (gameState === 'result') {
        const level = getDetectiveLevel(score);
        return (
            <div className="bg-[#2c241b] rounded-xl overflow-hidden p-6" style={{ backgroundImage: 'radial-gradient(#3a3125 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
                <CaseFileContainer title="結案報告書" headerRight={<div className="text-red-700 font-bold border-2 border-red-700 px-2 py-1 transform -rotate-6 text-[10px] md:text-sm">結案 (CLOSED)</div>}>
                    <div className="flex flex-col items-center h-full justify-center space-y-4 md:space-y-8 overflow-y-auto custom-scrollbar">
                        <div className="w-full bg-stone-200/50 p-4 md:p-8 rounded-lg border border-stone-300 text-center shrink-0">
                            <DetectiveBadge level={level} name={playerName} />
                            <div className="mt-4 md:mt-6 flex justify-center items-baseline gap-2 font-typewriter text-stone-700">
                                <span className="text-xs md:text-sm">最終積分：</span>
                                <span className="text-2xl md:text-4xl font-bold text-stone-900">{score}</span>
                                <span className="text-xs md:text-sm text-stone-500">/ {MAX_SCORE}</span>
                            </div>
                        </div>
                        <div className="polaroid bg-yellow-100 text-stone-800 text-xs md:text-sm font-typewriter w-full max-w-md mx-auto shrink-0">
                            <div className="font-bold border-b border-yellow-200 pb-2 mb-2 flex items-center gap-2 text-red-800"><AlertTriangle size={16} /> 探長筆記</div>
                            <p className="leading-relaxed">{getWeakestPoint()}</p>
                        </div>
                        <div className="w-full text-center shrink-0">
                            <p className="text-[10px] md:text-xs text-stone-400 font-typewriter mb-4 uppercase tracking-widest">請截圖此頁面作為紀錄</p>
                            <button onClick={() => setGameState('intro')} className="inline-flex items-center gap-2 text-stone-600 hover:text-stone-900 font-bold border-b-2 border-transparent hover:border-stone-900 transition-colors pb-1"><RefreshCw size={16} /> 重新調查</button>
                        </div>
                    </div>
                </CaseFileContainer>
            </div>
        );
    }

    return (
        <div className="bg-[#2c241b] rounded-xl overflow-hidden p-6" style={{ backgroundImage: 'radial-gradient(#3a3125 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
            <CaseFileContainer title={`案件編號 #${currentQIndex + 1}`}
                headerRight={
                    <div className="flex items-center gap-4">
                        <div className="flex flex-col items-end">
                            <span className="text-[8px] md:text-[10px] uppercase text-stone-500 font-bold">剩餘時間</span>
                            <div className={`font-typewriter text-lg md:text-xl font-bold ${timer <= 5 ? 'text-red-600 animate-pulse' : 'text-stone-700'}`}>00:{timer.toString().padStart(2, '0')}</div>
                        </div>
                    </div>
                }
                debugInfo={getDebugInfo()}
            >
                {gameState === 'playing' ? (
                    <div className="flex flex-col h-full">
                        <div className="flex-1 flex flex-col justify-center min-h-0 overflow-y-auto custom-scrollbar">
                            {renderQuestionCard(currentQ.prompt)}
                        </div>
                        <div className="shrink-0 mt-2 md:mt-4 pt-2 md:pt-4 border-t-2 border-dashed border-stone-300">
                            <div className="flex gap-4 md:gap-6 justify-center mb-4 md:mb-6">
                                <button onClick={() => handleOXSelect('O')} className={`group w-24 h-24 md:w-32 md:h-32 rounded-full border-4 flex flex-col items-center justify-center transition-all transform hover:scale-105 active:scale-95 shrink-0 ${selectedOX === 'O' ? 'border-emerald-700 bg-emerald-50 text-emerald-800 shadow-inner' : 'border-stone-300 text-stone-400 hover:border-emerald-300 hover:text-emerald-600 bg-white'}`}>
                                    <CheckCircle2 size={28} className="mb-1 md:size-36" /><span className="font-serif font-bold text-sm md:text-lg">合法引用<br />(PASS)</span>
                                </button>
                                <button onClick={() => handleOXSelect('X')} className={`group w-24 h-24 md:w-32 md:h-32 rounded-full border-4 flex flex-col items-center justify-center transition-all transform hover:scale-105 active:scale-95 shrink-0 ${selectedOX === 'X' ? 'border-red-800 bg-red-50 text-red-900 shadow-inner' : 'border-stone-300 text-stone-400 hover:border-red-300 hover:text-red-600 bg-white'}`}>
                                    <XCircle size={28} className="mb-1 md:size-36" /><span className="font-serif font-bold text-sm md:text-lg">引用錯誤<br />(REJECT)</span>
                                </button>
                            </div>
                            {selectedOX === 'X' && (
                                <div className="bg-stone-100 p-2 md:p-4 rounded border border-stone-200 mb-4 animate-in fade-in relative shrink-0">
                                    <div className="absolute -top-3 left-4 bg-stone-800 text-white px-2 py-0.5 text-[10px] md:text-xs font-bold uppercase">指認違規項目</div>
                                    <div className="grid grid-cols-1 gap-1 md:gap-2 mt-2">
                                        {ERROR_TYPES.map((type, idx) => (
                                            <label key={type.id} className={`flex items-center p-1.5 md:p-2.5 rounded cursor-pointer transition-colors border-l-4 ${selectedType === type.id ? 'bg-white border-red-800 shadow-sm' : 'border-transparent hover:bg-stone-200'}`}>
                                                <input type="radio" name="errorType" value={type.id} checked={selectedType === type.id} onChange={() => setSelectedType(type.id)} className="hidden" />
                                                <div className="mr-2 md:mr-3"><CrimeSceneMarker letter={String.fromCharCode(65 + idx)} selected={selectedType === type.id} /></div>
                                                <span className={`font-medium text-xs md:text-base ${selectedType === type.id ? 'text-stone-900' : 'text-stone-600'}`}>{type.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}
                            <button onClick={() => handleSubmit()} disabled={!selectedOX || (selectedOX === 'X' && !selectedType)} className={`w-full py-3 md:py-4 font-bold text-sm md:text-lg tracking-widest uppercase transition-colors shrink-0 ${(!selectedOX || (selectedOX === 'X' && !selectedType)) ? 'bg-stone-200 text-stone-400 cursor-not-allowed' : 'bg-stone-900 text-stone-100 hover:bg-black shadow-lg rounded-b-lg'}`}>提交證據 (SUBMIT)</button>
                        </div>
                    </div>
                ) : (
                    <div className="animate-in fade-in slide-in-from-bottom-4 relative h-full flex flex-col">
                        <div className={`shrink-0 p-3 md:p-4 mb-2 md:mb-4 rounded-lg border-l-4 text-center shadow-sm animate-slide-down ${getLastAnswerStatus() === 'full' ? 'bg-emerald-50 border-emerald-500 text-emerald-800' : getLastAnswerStatus() === 'partial' ? 'bg-yellow-50 border-yellow-500 text-yellow-800' : 'bg-red-50 border-red-500 text-red-800'}`}>
                            <div className="text-xl md:text-2xl font-black mb-1 flex items-center justify-center gap-2">
                                {getLastAnswerStatus() === 'full' ? <><CheckCircle2 size={24} /> 完全正確！</> : getLastAnswerStatus() === 'partial' ? <><AlertTriangle size={24} /> 部分正確</> : <><XCircle size={24} /> 判斷錯誤</>}
                            </div>
                            <div className="text-xs md:text-sm font-bold opacity-80">本題得分：+{userAnswers[userAnswers.length - 1]?.points} (總分: {score})</div>
                        </div>

                        {getLastAnswerStatus() === 'partial' && (
                            <div className="text-center text-xs md:text-sm text-stone-700 mb-4 bg-yellow-50/80 p-2 rounded border border-yellow-200 font-typewriter">
                                <span className="font-bold text-yellow-800">可惜！罪名指認錯誤。</span><br />
                                你選擇了：<span className="text-red-600 line-through decoration-2">{ERROR_TYPES.find(t => t.id === userAnswers[userAnswers.length - 1].userType)?.label}</span><br />
                                正解應為：<span className="text-emerald-700 font-bold underline decoration-wavy">{ERROR_TYPES.find(t => t.id === currentQ.correctType)?.label}</span>
                            </div>
                        )}

                        <div className="space-y-4 md:space-y-6 flex-1 overflow-y-auto custom-scrollbar pr-1 md:pr-2">
                            <div className="space-y-1 md:space-y-2">
                                <h4 className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-stone-400 flex items-center gap-2"><Fingerprint size={14} /> 證據分析</h4>
                                <div className="bg-stone-50 border border-stone-200 p-3 md:p-4 font-typewriter text-stone-800 text-xs md:text-sm leading-relaxed">{renderHighlight(currentQ.prompt, currentQ.highlightHints)}</div>
                            </div>
                            <div className="space-y-1 md:space-y-2">
                                <h4 className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-blue-800/60 flex items-center gap-2"><Search size={14} /> 偵探日誌</h4>
                                <p className="text-stone-900 font-serif leading-relaxed border-l-2 border-blue-800/30 pl-4 italic text-sm md:text-base">"{currentQ.explanation}"</p>
                            </div>
                            <div className="relative bg-[#fff] p-4 md:p-6 shadow-md transform rotate-1 border border-stone-200 mt-2 md:mt-4">
                                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-6 h-6 md:w-8 h-8 rounded-full bg-stone-300 border border-stone-400 flex items-center justify-center"><div className="w-1.5 h-1.5 bg-stone-500 rounded-full"></div></div>
                                <h4 className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-green-800 mb-2">修正示範</h4>
                                <div className="font-typewriter text-stone-800 whitespace-pre-line text-xs md:text-sm">{currentQ.fixExample}</div>
                            </div>
                        </div>
                        <div className="pt-3 md:pt-6 mt-2 md:mt-4 border-t border-stone-200 shrink-0">
                            <button onClick={nextQuestion} className="w-full bg-stone-800 hover:bg-stone-900 text-stone-100 font-bold py-3 flex items-center justify-center gap-2 uppercase tracking-widest text-xs md:text-sm rounded-b-lg">下一個案件 <ChevronRight size={16} /></button>
                        </div>
                    </div>
                )}
            </CaseFileContainer>
        </div>
    );
};
