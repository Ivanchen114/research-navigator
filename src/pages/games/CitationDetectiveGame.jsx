import React, { useState, useEffect } from 'react';
import { Search, CheckCircle2, XCircle, AlertTriangle, ArrowRight, ChevronRight, Bug, Award, RefreshCw } from 'lucide-react';

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

// UI Components
const renderQuestionCard = (prompt) => {
    if (prompt.includes("原文：") && prompt.includes("學生寫：")) {
        const parts = prompt.split(/原文：|學生寫：/);
        return (
            <div className="space-y-4 w-full text-left font-sans">
                <div className="bg-slate-50 p-4 rounded-xl border-l-[6px] border-slate-300 shadow-sm relative">
                    <div className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">📄 原文 (Original)</div>
                    <div className="text-slate-700 leading-relaxed font-medium">{parts[1]?.trim()}</div>
                </div>
                <div className="bg-red-50 p-4 rounded-xl border-l-[6px] border-red-400 shadow-sm relative">
                    <div className="text-xs font-bold text-red-500 mb-2 uppercase tracking-widest">✍️ 學生寫法 (Suspect)</div>
                    <div className="text-stone-800 leading-relaxed font-semibold">{parts[2]?.trim()}</div>
                </div>
            </div>
        );
    }
    return <div className="bg-white p-6 shadow-sm rounded-xl border border-slate-200 text-lg md:text-xl text-slate-800 font-medium whitespace-pre-line leading-relaxed min-h-[150px]">{prompt}</div>;
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
                <div className="bg-white p-4 rounded-xl border border-slate-200">
                    <div className="text-xs font-bold text-slate-400 mb-1 uppercase">📄 原文</div>
                    <div className="text-slate-600">{processHighlights(parts[1]?.trim() || "")}</div>
                </div>
                <div className="bg-red-50 p-4 rounded-xl border border-red-100">
                    <div className="text-xs font-bold text-red-400 mb-1 uppercase">✍️ 學生寫法</div>
                    <div className="text-stone-800">{processHighlights(parts[2]?.trim() || "")}</div>
                </div>
            </div>
        )
    }
    return <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 whitespace-pre-line text-slate-700 font-medium">{processHighlights(text)}</div>;
};

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
            <div className="bg-slate-50/50 rounded-xl overflow-hidden flex flex-col items-center justify-center p-6 md:py-16 font-sans text-slate-800 min-h-[600px]">
                <div className="bg-white p-8 md:p-12 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] max-w-xl w-full text-center border-t-[12px] border-amber-500 relative overflow-hidden">
                    <div className="absolute top-0 right-0 opacity-5 text-9xl -mt-4 -mr-4 text-slate-900">🕵️‍♂️</div>
                    <div className="text-7xl mb-6 animate-bounce">🔍</div>
                    <h1 className="text-3xl md:text-5xl font-black text-slate-800 mb-4 tracking-wide">文獻偵探社</h1>
                    <h2 className="text-xl md:text-2xl font-bold text-slate-500 mb-6 border-b border-slate-100 pb-4">引用文獻偵錯特訓</h2>

                    <p className="text-slate-600 text-lg mb-8 font-medium leading-relaxed">
                        我們攔截了 10 份<span className="text-amber-600 font-bold">可疑的學術報告</span>！<br />
                        有些引用可能藏著<span className="text-red-500 font-bold border-b-2 border-red-200 px-1">「抄襲嫌疑」</span>或是格式錯誤。<br />
                        你能火眼金睛，揪出所有違規嗎？
                    </p>

                    <div className="bg-slate-50 rounded-2xl p-6 mb-8 text-left border border-slate-200 shadow-sm">
                        <label className="block text-sm font-bold text-slate-700 mb-2 tracking-wider">🕵️‍♂️ 探員代號 (姓名)</label>
                        <input
                            type="text"
                            value={playerName}
                            onChange={(e) => setPlayerName(e.target.value)}
                            placeholder="請輸入你的探員代號..."
                            className="w-full bg-white border-2 border-slate-200 focus:border-amber-400 rounded-xl outline-none px-4 py-3 font-bold text-lg text-slate-800 placeholder-slate-300 mb-5 transition-colors text-center"
                        />

                        <h3 className="text-sm font-bold text-slate-500 mb-3 tracking-wider border-t border-slate-200 pt-4">📋 任務簡報</h3>
                        <div className="space-y-3 text-sm text-slate-600">
                            <p className="flex items-start gap-2">✅ <span><strong className="text-emerald-600">合法引用</strong>：判斷完全正確且無抄襲。</span></p>
                            <p className="flex items-start gap-2">❌ <span><strong className="text-red-500">引用錯誤</strong>：有抄襲嫌疑或格式錯誤，需進一步指認違規罪名。</span></p>
                            <p className="flex items-start gap-2">⏳ <span><strong className="text-amber-600">限時挑戰</strong>：每題 20 秒，請快速反應。</span></p>
                        </div>
                    </div>

                    <button
                        onClick={enterTutorial}
                        disabled={!playerName.trim()}
                        className={`font-black py-4 px-10 rounded-full text-xl transition transform shadow-[0_8px_20px_rgba(245,158,11,0.3)] hover:shadow-[0_12px_25px_rgba(245,158,11,0.4)] flex items-center justify-center gap-2 mx-auto ${!playerName.trim() ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none hover:shadow-none' : 'bg-amber-500 hover:bg-amber-600 text-white hover:scale-105 active:scale-95'}`}
                    >
                        開始職前訓練 <ArrowRight size={24} />
                    </button>
                </div>
            </div>
        );
    }

    // ================= TUTORIAL SCREEN =================
    if (gameState === 'tutorial') {
        return (
            <div className="bg-slate-50/50 rounded-xl overflow-hidden flex flex-col items-center justify-center p-6 md:py-16 font-sans text-slate-800 min-h-[600px]">
                <div className="bg-white p-8 md:p-12 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] max-w-4xl w-full border-t-[12px] border-blue-500 relative">
                    <div className="text-center mb-8">
                        <div className="inline-block bg-blue-100 text-blue-800 font-black px-4 py-1 rounded-full text-sm mb-4 tracking-widest uppercase">Tutorial</div>
                        <h2 className="text-3xl md:text-4xl font-black text-slate-800 mb-4">引用規範與違規圖鑑</h2>
                        <p className="text-slate-500 text-lg font-medium">請熟讀以下規則，這是破案的關鍵。</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-10">
                        <div className="bg-emerald-50 p-6 rounded-2xl border-2 border-emerald-100 shadow-sm">
                            <h3 className="flex items-center gap-2 font-black text-emerald-700 text-xl border-b-2 border-emerald-200 pb-3 mb-4"><CheckCircle2 size={24} /> 合法引用標準 (PASS)</h3>
                            <ul className="space-y-4 text-slate-700 font-medium">
                                <li className="flex gap-3"><span className="bg-emerald-200 text-emerald-800 font-black w-6 h-6 rounded-full flex items-center justify-center shrink-0">1</span><span><strong className="text-emerald-700">改寫 (Paraphrasing)</strong>：消化原文後，用「自己的話」重新敘述，且意思不變。</span></li>
                                <li className="flex gap-3"><span className="bg-emerald-200 text-emerald-800 font-black w-6 h-6 rounded-full flex items-center justify-center shrink-0">2</span><span><strong className="text-emerald-700">三明治法</strong>：導讀(麵包) + 引用(肉) + 詮釋(麵包)。引用不能孤單存在。</span></li>
                                <li className="flex gap-3"><span className="bg-emerald-200 text-emerald-800 font-black w-6 h-6 rounded-full flex items-center justify-center shrink-0">3</span><span><strong className="text-emerald-700">格式正確</strong>：清楚標示出處，例如：(Chen, 2023) 或「根據 Chen (2023) 指出...」。</span></li>
                            </ul>
                        </div>
                        <div className="bg-red-50 p-6 rounded-2xl border-2 border-red-100 shadow-sm">
                            <h3 className="flex items-center gap-2 font-black text-red-700 text-xl border-b-2 border-red-200 pb-3 mb-4"><XCircle size={24} /> 常見違規樣態 (REJECT)</h3>
                            <ul className="space-y-4 text-slate-700 font-medium">
                                <li className="flex gap-3"><span className="bg-red-200 text-red-800 font-black px-2 py-0.5 rounded shrink-0">孤兒引用</span><span>引號直接丟在句子裡，沒頭沒尾，沒人介紹它。</span></li>
                                <li className="flex gap-3"><span className="bg-red-200 text-red-800 font-black px-2 py-0.5 rounded shrink-0">換字抄襲</span><span>句型結構跟原文一樣，只是把「導致」換成「造成」。</span></li>
                                <li className="flex gap-3"><span className="bg-red-200 text-red-800 font-black px-2 py-0.5 rounded shrink-0">重點隱匿</span><span>寫了「研究顯示」卻沒寫是誰的研究，忘記標註。</span></li>
                                <li className="flex gap-3"><span className="bg-red-200 text-red-800 font-black px-2 py-0.5 rounded shrink-0">隱密剽竊</span><span>逐字照抄原文，卻沒有加上「」引號。</span></li>
                            </ul>
                        </div>
                    </div>

                    <div className="text-center">
                        <button onClick={startGame} className="bg-blue-500 hover:bg-blue-600 text-white font-black py-4 px-10 rounded-full text-xl transition transform hover:scale-105 shadow-lg active:scale-95 inline-flex items-center gap-2">
                            我已熟讀，開始辦案 <ArrowRight size={24} />
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // ================= RESULT SCREEN =================
    if (gameState === 'result') {
        const level = getDetectiveLevel(score);
        let titleColor = "text-amber-600";
        let titleBg = "bg-amber-50";

        if (score >= 15) { titleColor = "text-amber-600"; titleBg = "bg-amber-50"; }
        else if (score >= 12) { titleColor = "text-blue-600"; titleBg = "bg-blue-50"; }
        else if (score >= 8) { titleColor = "text-emerald-600"; titleBg = "bg-emerald-50"; }
        else { titleColor = "text-red-600"; titleBg = "bg-red-50"; }

        return (
            <div className="bg-slate-50/50 rounded-xl overflow-hidden flex flex-col items-center justify-center p-6 md:py-10 font-sans text-slate-800 min-h-[600px]">
                <div className="bg-white p-8 md:p-12 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] max-w-2xl w-full text-center border-t-[12px] border-amber-500 relative">
                    <div className="absolute top-6 left-6 text-slate-200 text-6xl">📋</div>
                    <h1 className="text-2xl font-bold text-slate-400 mb-2 tracking-widest relative z-10">結案報告單</h1>

                    <div className="mb-4 relative z-10">
                        <p className="text-sm font-bold text-slate-400 tracking-wider">探員代號</p>
                        <p className="text-2xl font-black text-slate-800 border-b-2 border-slate-200 inline-block px-8 pb-1">{playerName}</p>
                    </div>

                    <div className="flex flex-col items-center justify-center mb-8 relative z-10">
                        <div className="bg-amber-100 text-amber-800 p-4 rounded-full mb-4 shadow-sm border-4 border-amber-200"><Award size={48} /></div>
                        <div className="text-7xl font-black text-amber-500 tracking-tighter mb-2">{score} <span className="text-3xl text-slate-300 font-medium">/ {MAX_SCORE}</span></div>
                        <h2 className={`text-2xl md:text-3xl font-black px-6 py-2 rounded-2xl ${titleColor} ${titleBg} mb-4`}>{level}</h2>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest bg-slate-50 py-2 px-6 rounded-lg border border-slate-200">請截圖此頁面作為紀錄</p>
                    </div>

                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 shadow-inner text-left mb-8">
                        <h3 className="font-black text-slate-700 flex items-center gap-2 mb-3 border-b border-slate-200 pb-2"><AlertTriangle size={20} className="text-amber-500" /> 探長給你的建議紀錄</h3>
                        <p className="text-slate-600 font-medium leading-relaxed">{getWeakestPoint()}</p>
                    </div>

                    <button
                        onClick={() => setGameState('intro')}
                        className="bg-white hover:bg-slate-50 text-slate-600 font-bold py-3 px-8 rounded-full text-lg transition transform hover:scale-105 shadow-md hover:shadow-lg border-2 border-slate-200 flex items-center justify-center gap-2 mx-auto relative z-10"
                    >
                        <RefreshCw size={20} /> 重新調查
                    </button>
                </div>
            </div>
        );
    }

    // ================= PLAYING / FEEDBACK SCREEN =================
    return (
        <div className="bg-slate-50/50 rounded-xl overflow-hidden flex flex-col items-center p-4 md:p-8 font-sans min-h-[600px] text-slate-800">
            {getDebugInfo()}
            <div className="max-w-4xl w-full flex flex-col h-full">

                {/* Header */}
                <div className="flex flex-wrap justify-between items-center gap-3 mb-6 px-1 shrink-0">
                    <div className="bg-white text-slate-500 font-bold px-5 py-2 rounded-full shadow-sm text-lg border border-slate-200 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                        案件 {currentQIndex + 1} <span className="opacity-40 font-normal">/ {shuffledQuestions.length}</span>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block leading-tight">任務積分</span>
                            <span className="text-xl font-black text-amber-600 leading-tight">{score}</span>
                        </div>
                        <div className={`w-14 h-14 rounded-full flex items-center justify-center border-4 font-black text-xl shadow-sm ${timer <= 5 ? 'border-red-500 bg-red-50 text-red-600 animate-pulse' : 'border-slate-200 bg-white text-slate-600'}`}>
                            {timer}
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 md:p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border-t-[8px] border-amber-400 relative flex-1 flex flex-col">
                    <div className="absolute top-0 right-6 bg-amber-400 text-white text-xs font-black px-4 py-1.5 rounded-b-lg tracking-widest shadow-sm">
                        {currentQ.title}
                    </div>

                    {gameState === 'playing' ? (
                        <>
                            <div className="flex-1 flex flex-col justify-center min-h-0 py-6">
                                {renderQuestionCard(currentQ.prompt)}
                            </div>

                            <div className="shrink-0 pt-6 mt-4 border-t-2 border-dashed border-slate-200">
                                <div className="flex gap-4 md:gap-8 justify-center mb-6">
                                    <button
                                        onClick={() => handleOXSelect('O')}
                                        className={`group flex-1 max-w-[200px] aspect-square rounded-2xl md:rounded-[2rem] border-4 flex flex-col items-center justify-center transition-all transform hover:scale-105 active:scale-95 ${selectedOX === 'O' ? 'border-emerald-500 bg-emerald-50 text-emerald-600 shadow-md' : 'border-slate-200 text-slate-400 hover:border-emerald-300 hover:bg-emerald-50/50 bg-white'}`}
                                    >
                                        <CheckCircle2 size={48} className="mb-3" />
                                        <span className="font-black text-lg md:text-xl">合法引用</span>
                                        <span className="text-xs font-bold opacity-70 mt-1 uppercase tracking-widest">Pass</span>
                                    </button>
                                    <button
                                        onClick={() => handleOXSelect('X')}
                                        className={`group flex-1 max-w-[200px] aspect-square rounded-2xl md:rounded-[2rem] border-4 flex flex-col items-center justify-center transition-all transform hover:scale-105 active:scale-95 ${selectedOX === 'X' ? 'border-red-500 bg-red-50 text-red-600 shadow-md' : 'border-slate-200 text-slate-400 hover:border-red-300 hover:bg-red-50/50 bg-white'}`}
                                    >
                                        <XCircle size={48} className="mb-3" />
                                        <span className="font-black text-lg md:text-xl">引用錯誤</span>
                                        <span className="text-xs font-bold opacity-70 mt-1 uppercase tracking-widest">Reject</span>
                                    </button>
                                </div>

                                {selectedOX === 'X' && (
                                    <div className="bg-slate-50 p-5 md:p-6 rounded-2xl border border-slate-200 mb-6 animate-in fade-in slide-in-from-bottom-2">
                                        <h4 className="text-sm font-black text-slate-700 mb-3 border-b border-slate-200 pb-2">請指認錯誤類型 (必填)：</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
                                            {ERROR_TYPES.map((type) => (
                                                <label key={type.id} className={`flex items-center p-3 rounded-xl cursor-pointer transition-colors border-2 ${selectedType === type.id ? 'bg-white border-red-500 shadow-sm' : 'border-slate-200 bg-white hover:border-red-300'}`}>
                                                    <input type="radio" name="errorType" value={type.id} checked={selectedType === type.id} onChange={() => setSelectedType(type.id)} className="w-4 h-4 text-red-600 border-gray-300 focus:ring-red-500" />
                                                    <span className={`ml-3 font-bold text-sm md:text-base ${selectedType === type.id ? 'text-red-700' : 'text-slate-600'}`}>{type.label}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                <button
                                    onClick={() => handleSubmit()}
                                    disabled={!selectedOX || (selectedOX === 'X' && !selectedType)}
                                    className={`w-full py-4 rounded-2xl font-black text-lg md:text-xl tracking-widest transition-all ${(!selectedOX || (selectedOX === 'X' && !selectedType)) ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-slate-800 text-white hover:bg-slate-900 shadow-[0_8px_20px_rgba(15,23,42,0.2)] hover:shadow-[0_12px_25px_rgba(15,23,42,0.3)] hover:-translate-y-1 active:translate-y-0'}`}
                                >
                                    提交證據 SUBMIT
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col animate-in fade-in slide-in-from-bottom-4 py-2">
                            <div className={`shrink-0 p-4 md:p-6 mb-6 rounded-2xl border-2 text-center shadow-sm ${getLastAnswerStatus() === 'full' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : getLastAnswerStatus() === 'partial' ? 'bg-amber-50 border-amber-200 text-amber-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
                                <div className="text-2xl md:text-3xl font-black mb-2 flex items-center justify-center gap-3">
                                    {getLastAnswerStatus() === 'full' ? <><CheckCircle2 size={32} /> 完美破案！</> : getLastAnswerStatus() === 'partial' ? <><AlertTriangle size={32} /> 部分正確</> : <><XCircle size={32} /> 判斷錯誤</>}
                                </div>
                                <div className="text-sm md:text-base font-bold opacity-90 tracking-wide">本題得分：+{userAnswers[userAnswers.length - 1]?.points} (總分: {score})</div>
                            </div>

                            {getLastAnswerStatus() === 'partial' && (
                                <div className="text-center text-sm mb-6 bg-red-50 p-4 rounded-xl border-2 border-red-100 shadow-inner">
                                    <span className="font-black text-red-700 text-base mb-2 block">罪名指認錯誤！</span>
                                    你選擇了：<span className="text-slate-500 line-through font-bold inline-block mx-2">{ERROR_TYPES.find(t => t.id === userAnswers[userAnswers.length - 1].userType)?.label}</span><br />
                                    正解應為：<span className="text-emerald-600 font-black text-lg inline-block mt-2 bg-emerald-100 px-3 py-1 rounded">{ERROR_TYPES.find(t => t.id === currentQ.correctType)?.label}</span>
                                </div>
                            )}

                            <div className="space-y-6 flex-1 overflow-y-auto">
                                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
                                    <h4 className="text-sm font-black text-slate-500 mb-3 flex items-center gap-2"><Search size={18} className="text-blue-500" /> 偵探分析報告</h4>
                                    <p className="text-slate-800 font-medium leading-relaxed">{currentQ.explanation}</p>
                                    {renderHighlight(currentQ.prompt, currentQ.highlightHints)}
                                </div>
                                <div className="bg-emerald-50 p-5 rounded-2xl border border-emerald-100 relative shadow-sm">
                                    <h4 className="text-sm font-black text-emerald-700 mb-2 flex items-center gap-2"><CheckCircle2 size={18} /> 典範修正示範</h4>
                                    <div className="text-stone-800 whitespace-pre-line font-medium leading-relaxed">{currentQ.fixExample}</div>
                                </div>
                            </div>

                            <div className="pt-6 mt-4 border-t-2 border-slate-100 shrink-0">
                                <button onClick={nextQuestion} className="w-full bg-slate-800 hover:bg-slate-900 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 text-lg shadow-lg hover:-translate-y-1 transition-all">
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
