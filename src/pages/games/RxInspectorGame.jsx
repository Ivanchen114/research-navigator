import React, { useState } from 'react';

// 6 份研究工具，每份有若干題目，部分題目埋了 bug
const instrumentData = [
    {
        id: 1,
        type: "問卷調查",
        title: "本校學生手機使用習慣問卷",
        target: "全校高一至高三學生",
        icon: "📋",
        items: [
            {
                text: "你每天使用手機的時間大約是多少？\n□ 1 小時以下 □ 1-2 小時 □ 2-3 小時 □ 3 小時以上",
                hasBug: false,
                bugType: null,
                explanation: null
            },
            {
                text: "你是否同意手機對學習有害且應該被禁止？\n□ 非常同意 □ 同意 □ 不同意 □ 非常不同意",
                hasBug: true,
                bugType: "雙管問題 (Double-barreled)",
                explanation: "同時問了兩件事：「有害」和「應該被禁止」。受試者可能覺得有害但不同意禁止，無法回答。應拆成兩題。"
            },
            {
                text: "你覺得使用手機對你的學業成績有什麼影響？\n□ 非常正面 □ 正面 □ 沒有影響 □ 負面 □ 非常負面",
                hasBug: false,
                bugType: null,
                explanation: null
            },
            {
                text: "聰明的學生都會控制手機使用時間，你同意嗎？\n□ 非常同意 □ 同意 □ 不同意 □ 非常不同意",
                hasBug: true,
                bugType: "引導性問題 (Leading Question)",
                explanation: "「聰明的學生都會...」暗示了應該控制，受試者會被引導回答「同意」。應改為中性措辭。"
            },
            {
                text: "你在以下哪些場合會使用手機？（可複選）\n□ 上課中 □ 下課休息 □ 午餐時間 □ 通勤途中 □ 睡覺前",
                hasBug: false,
                bugType: null,
                explanation: null
            }
        ]
    },
    {
        id: 2,
        type: "訪談大綱",
        title: "弱勢學生學習困境訪談",
        target: "領取午餐補助的同學",
        icon: "🎙️",
        items: [
            {
                text: "請問你領午餐補助是因為家裡很窮嗎？",
                hasBug: true,
                bugType: "倫理問題 (Ethics Violation)",
                explanation: "直接用「很窮」標籤化受訪者，侵犯隱私且造成心理傷害。應改為：「可以分享你申請補助的過程嗎？」"
            },
            {
                text: "在學習上，你覺得最困難的部分是什麼？",
                hasBug: false,
                bugType: null,
                explanation: null
            },
            {
                text: "你覺得學校提供的資源（如課輔、自習室）對你有幫助嗎？可以舉個例子嗎？",
                hasBug: false,
                bugType: null,
                explanation: null
            },
            {
                text: "你是不是因為家裡沒錢買參考書，所以成績才會比較差？",
                hasBug: true,
                bugType: "預設立場 + 引導性問題",
                explanation: "預設了「成績差」和「因為沒錢」兩個結論。訪談應該開放探索，不是驗證研究者的假設。"
            },
            {
                text: "如果可以改變一件跟學習有關的事，你最想改變什麼？",
                hasBug: false,
                bugType: null,
                explanation: null
            }
        ]
    },
    {
        id: 3,
        type: "問卷調查",
        title: "社團參與對學業影響問卷",
        target: "高二全體同學",
        icon: "📋",
        items: [
            {
                text: "你目前參加幾個社團？\n□ 0 個 □ 1 個 □ 2 個 □ 3 個以上",
                hasBug: false,
                bugType: null,
                explanation: null
            },
            {
                text: "你上次段考的全科平均排名落在？\n□ 前 10% □ 前 25% □ 前 50% □ 後 50%",
                hasBug: false,
                bugType: null,
                explanation: null
            },
            {
                text: "你每週花在社團的時間？\n□ 0 小時 □ 1-3 小時 □ 3-5 小時 □ 5-8 小時 □ 8 小時以上",
                hasBug: true,
                bugType: "選項重疊 (Overlapping Options)",
                explanation: "「1-3 小時」和「3-5 小時」在 3 的地方重疊了！花 3 小時的人到底選哪個？應改為 1-3、4-5、6-8。"
            },
            {
                text: "請問你的性別：\n□ 男 □ 女",
                hasBug: true,
                bugType: "選項不完整 (Exhaustiveness)",
                explanation: "缺少「其他」或「不願透露」選項，可能造成部分受試者無法作答，且不符合現代性別多元精神。"
            }
        ]
    },
    {
        id: 4,
        type: "實驗設計",
        title: "背景音樂對閱讀理解的影響實驗",
        target: "高一某班 36 位同學",
        icon: "🧪",
        items: [
            {
                text: "實驗組：在播放古典音樂的教室閱讀一篇文章\n對照組：在安靜的教室閱讀同一篇文章",
                hasBug: false,
                bugType: null,
                explanation: null
            },
            {
                text: "分組方式：讓學生自己選擇要去哪一組",
                hasBug: true,
                bugType: "自願偏誤 (Self-selection Bias)",
                explanation: "讓學生自己選組，喜歡音樂的人會去實驗組，不喜歡的去對照組。應該隨機分派才能排除個人偏好的干擾。"
            },
            {
                text: "測量工具：兩組做同一份閱讀理解測驗，共 20 題選擇題",
                hasBug: false,
                bugType: null,
                explanation: null
            },
            {
                text: "實驗時間：實驗組在早上第一節課進行，對照組在下午第七節課進行",
                hasBug: true,
                bugType: "混淆變項未控制 (Confounding Variable)",
                explanation: "早上精神好、下午昏沉，結果會受「時間」影響而不是「音樂」。兩組應在同一時段或隨機安排時段。"
            }
        ]
    },
    {
        id: 5,
        type: "問卷調查",
        title: "校園霸凌經驗調查",
        target: "全校學生（匿名填答）",
        icon: "📋",
        items: [
            {
                text: "你曾經在學校被霸凌過嗎？\n□ 有 □ 沒有",
                hasBug: true,
                bugType: "缺乏操作性定義 (No Operational Definition)",
                explanation: "什麼是「霸凌」？打人算、排擠算、開玩笑算嗎？每個人認知不同。應先定義霸凌的具體行為（如：被故意孤立、被肢體攻擊…）。"
            },
            {
                text: "你上學期被同學嘲笑或取綽號的頻率？\n□ 從未 □ 每月 1-2 次 □ 每週 1-2 次 □ 幾乎每天",
                hasBug: false,
                bugType: null,
                explanation: null
            },
            {
                text: "遇到不友善對待時，你通常會怎麼做？（可複選）\n□ 告訴老師 □ 告訴家人 □ 跟朋友說 □ 自己忍耐 □ 反擊回去 □ 其他",
                hasBug: false,
                bugType: null,
                explanation: null
            },
            {
                text: "請填寫你的班級與座號：___________",
                hasBug: true,
                bugType: "匿名性破壞 (Anonymity Breach)",
                explanation: "問卷標題寫「匿名填答」，但要求填班級座號就能辨識身分！霸凌議題極其敏感，破壞匿名性會讓受試者不敢說實話。"
            }
        ]
    },
    {
        id: 6,
        type: "🔥 綜合超級挑戰",
        title: "「本校學生午餐選擇因素」問卷（完整版）",
        target: "全校學生",
        icon: "📋",
        items: [
            {
                text: "你今天中午吃了什麼？（開放填答）\n_______________",
                hasBug: false,
                bugType: null,
                explanation: null
            },
            {
                text: "你選擇午餐時，最重視的因素是？（單選）\n□ 價格 □ 口味 □ 營養 □ 排隊時間 □ 朋友一起買",
                hasBug: false,
                bugType: null,
                explanation: null
            },
            {
                text: "你每天的午餐預算大概是多少？\n□ 50 元以下 □ 50-80 元 □ 80-100 元 □ 100-150 元",
                hasBug: true,
                bugType: "選項重疊 + 不完整",
                explanation: "50 和 80 的邊界重疊了。而且花 150 元以上的人沒選項可選！應改為「50 以下 / 51-80 / 81-100 / 101-150 / 150 以上」。"
            },
            {
                text: "你不覺得合作社的食物又貴又難吃嗎？\n□ 是 □ 不是",
                hasBug: true,
                bugType: "引導性問題 + 雙管問題",
                explanation: "「你不覺得...嗎？」是引導性措辭。而且同時問了「貴」和「難吃」兩件事（雙管問題），經典的兩個 bug 同時出現！"
            },
            {
                text: "如果學校引進新的午餐選項，你最希望增加什麼？（可複選）\n□ 便利商店 □ 外送平台 □ 素食餐盒 □ 自助沙拉吧 □ 其他:___",
                hasBug: false,
                bugType: null,
                explanation: null
            },
            {
                text: "關於午餐品質，你有什麼其他建議？（開放題）\n_______________",
                hasBug: false,
                bugType: null,
                explanation: null
            }
        ]
    }
];

// 洗牌
const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
};

export const RxInspectorGame = () => {
    const [gameState, setGameState] = useState('start');
    const [currentRound, setCurrentRound] = useState(0);
    const [flagged, setFlagged] = useState({}); // { itemIdx: true/false }
    const [isRevealed, setIsRevealed] = useState(false);
    const [roundScores, setRoundScores] = useState([]);
    const [totalCorrect, setTotalCorrect] = useState(0);
    const [totalBugs, setTotalBugs] = useState(0);

    const startGame = () => {
        setCurrentRound(0);
        setFlagged({});
        setIsRevealed(false);
        setRoundScores([]);
        setTotalCorrect(0);
        setTotalBugs(0);
        setGameState('playing');
    };

    const toggleFlag = (idx) => {
        if (isRevealed) return;
        setFlagged(prev => ({ ...prev, [idx]: !prev[idx] }));
    };

    const submitInspection = () => {
        const instrument = instrumentData[currentRound];
        let correct = 0;
        let bugs = 0;
        const details = [];

        instrument.items.forEach((item, idx) => {
            const playerFlagged = !!flagged[idx];
            if (item.hasBug) bugs++;
            if (item.hasBug && playerFlagged) {
                correct++;
                details.push({ idx, status: 'hit', item });
            } else if (item.hasBug && !playerFlagged) {
                details.push({ idx, status: 'missed', item });
            } else if (!item.hasBug && playerFlagged) {
                details.push({ idx, status: 'false-alarm', item });
            }
        });

        setTotalCorrect(prev => prev + correct);
        setTotalBugs(prev => prev + bugs);
        setRoundScores(prev => [...prev, { correct, bugs, details, instrument }]);
        setIsRevealed(true);
    };

    const nextRound = () => {
        if (currentRound < instrumentData.length - 1) {
            setCurrentRound(r => r + 1);
            setFlagged({});
            setIsRevealed(false);
        } else {
            setGameState('end');
        }
    };

    // ================= START SCREEN =================
    if (gameState === 'start') {
        return (
            <div className="bg-slate-800 rounded-xl overflow-hidden flex flex-col items-center justify-center p-6 md:py-16 font-sans text-slate-100 min-h-[600px]">
                <div className="bg-slate-900 p-8 md:p-12 rounded-2xl shadow-2xl max-w-xl w-full text-center border-t-8 border-emerald-500 relative overflow-hidden">
                    <div className="absolute top-0 right-0 opacity-10 text-9xl -mt-4 -mr-4">🔬</div>
                    <div className="text-7xl mb-6 animate-pulse">🐛</div>
                    <h1 className="text-3xl md:text-5xl font-black text-emerald-400 mb-4 tracking-wide drop-shadow-md">處方鑑定師</h1>
                    <h2 className="text-xl md:text-2xl font-bold text-slate-300 mb-6 border-b border-slate-700 pb-4">研究工具抓蟲大挑戰</h2>
                    <p className="text-slate-400 text-lg mb-8 font-medium leading-relaxed">
                        6 份研究工具送到了你的實驗室，<br />
                        裡面藏著各種<span className="text-red-400 font-bold">「設計 Bug」</span>！<br />
                        身為品管鑑定師的你，<br />
                        能把所有 <span className="text-emerald-400 font-bold border-b-2 border-emerald-500">🐛 Bug</span> 都抓出來嗎？
                    </p>
                    <div className="bg-slate-800 rounded-xl p-4 mb-8 text-left border border-slate-700">
                        <h3 className="text-sm font-bold text-slate-400 mb-3 tracking-wider">🔍 鑑定須知</h3>
                        <div className="space-y-2 text-sm text-slate-300">
                            <p>📋 每一關會出現一份<strong className="text-white">研究工具</strong>（問卷/訪談/實驗）</p>
                            <p>🐛 仔細檢查每一題，<strong className="text-red-400">點擊有 Bug 的題目</strong>標記它</p>
                            <p>⚠️ 小心！不是每一題都有問題，<strong className="text-amber-400">誤報也會扣分</strong></p>
                            <p>🎯 常見 Bug：雙管問題、引導性措辭、選項重疊、倫理問題...</p>
                        </div>
                    </div>
                    <button
                        onClick={startGame}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-black py-4 px-10 rounded-full text-xl transition transform hover:scale-105 shadow-[0_0_15px_rgba(16,185,129,0.5)] active:scale-95"
                    >
                        戴上放大鏡，開始鑑定 🔬
                    </button>
                </div>
            </div>
        );
    }

    // ================= END SCREEN =================
    if (gameState === 'end') {
        const accuracy = totalBugs > 0 ? Math.round((totalCorrect / totalBugs) * 100) : 0;
        let title = "";
        let color = "";
        if (accuracy === 100) { title = "🏆 金牌鑑定師！零漏網之蟲！"; color = "text-amber-400"; }
        else if (accuracy >= 75) { title = "🔬 資深鑑定師！眼光犀利！"; color = "text-blue-400"; }
        else if (accuracy >= 50) { title = "🐛 實習鑑定師！還需磨練！"; color = "text-green-400"; }
        else { title = "😵 品管不及格！重新訓練！"; color = "text-red-400"; }

        return (
            <div className="bg-slate-800 rounded-xl overflow-hidden flex flex-col items-center justify-center p-6 md:py-10 font-sans text-slate-100 min-h-[600px]">
                <div className="bg-slate-900 p-8 rounded-2xl shadow-2xl max-w-2xl w-full text-center border-t-8 border-emerald-500">
                    <h1 className="text-3xl font-bold text-slate-300 mb-4 tracking-widest">鑑定報告</h1>
                    <div className="text-7xl font-black mb-2 text-emerald-500">{totalCorrect} <span className="text-3xl text-slate-600">/ {totalBugs}</span></div>
                    <p className="text-slate-400 mb-2">Bug 命中率：{accuracy}%</p>
                    <h2 className={`text-3xl font-black mb-6 drop-shadow-md ${color}`}>{title}</h2>

                    <button
                        onClick={startGame}
                        className="bg-slate-700 hover:bg-slate-600 text-emerald-400 font-bold py-3 px-8 rounded-full text-lg transition transform hover:scale-105 shadow-lg mb-8 border border-slate-600"
                    >
                        重新鑑定 🔄
                    </button>

                    {/* Round-by-round review */}
                    <div className="text-left bg-slate-800 p-6 rounded-xl border-l-8 border-emerald-500 max-h-96 overflow-y-auto shadow-inner">
                        <h3 className="text-xl font-black mb-4 text-slate-200">📋 各關鑑定摘要</h3>
                        <div className="space-y-4">
                            {roundScores.map((rs, i) => (
                                <div key={i} className="bg-slate-700 p-4 rounded-lg border border-slate-600">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="font-bold text-slate-200">{rs.instrument.icon} {rs.instrument.title}</span>
                                        <span className={`text-sm font-bold px-3 py-1 rounded-full ${rs.correct === rs.bugs ? 'bg-emerald-900/50 text-emerald-400 border border-emerald-800' : 'bg-red-900/50 text-red-400 border border-red-800'}`}>
                                            {rs.correct}/{rs.bugs} Bug
                                        </span>
                                    </div>
                                    {rs.details.filter(d => d.status !== 'hit').map((d, j) => (
                                        <div key={j} className="text-sm mt-2">
                                            {d.status === 'missed' && (
                                                <p className="text-red-400">❌ 漏掉：{d.item.bugType}</p>
                                            )}
                                            {d.status === 'false-alarm' && (
                                                <p className="text-amber-400">⚠️ 誤報：第 {d.idx + 1} 題其實沒有 Bug</p>
                                            )}
                                        </div>
                                    ))}
                                    {rs.details.filter(d => d.status !== 'hit').length === 0 && (
                                        <p className="text-emerald-400 text-sm mt-1">✅ 完美鑑定！</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // ================= PLAYING SCREEN =================
    const instrument = instrumentData[currentRound];
    const bugCount = instrument.items.filter(i => i.hasBug).length;
    const flaggedCount = Object.values(flagged).filter(Boolean).length;
    const isBoss = instrument.type.includes('🔥');

    return (
        <div className="bg-slate-800 rounded-xl overflow-hidden flex flex-col items-center p-4 md:p-8 font-sans min-h-[600px]">
            <div className="max-w-4xl w-full">

                {/* Progress & Score */}
                <div className="flex justify-between items-center mb-6 px-2">
                    <div className="bg-slate-700 text-emerald-400 font-bold px-5 py-2 rounded-full shadow-sm text-lg border border-slate-600">
                        案件 {currentRound + 1} / {instrumentData.length}
                    </div>
                    <div className="bg-slate-700 text-amber-400 font-bold px-5 py-2 rounded-full shadow-sm text-sm border border-slate-600">
                        🐛 已標記 {flaggedCount} 個 Bug
                    </div>
                    <div className="bg-slate-700 text-emerald-400 font-bold px-5 py-2 rounded-full shadow-sm text-lg border border-slate-600">
                        累計: {totalCorrect} 🐛
                    </div>
                </div>

                {/* Instrument Header */}
                <div className={`bg-slate-900 p-6 rounded-2xl shadow-2xl mb-6 border-l-8 relative overflow-hidden ${isBoss ? 'border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.3)]' : 'border-emerald-500'}`}>
                    {isBoss && (
                        <div className="absolute top-0 right-0 bg-purple-600 text-white text-xs font-black px-4 py-1 rounded-bl-lg tracking-widest animate-pulse">
                            🔥 綜合挑戰
                        </div>
                    )}
                    <div className="flex items-center gap-3 mb-2">
                        <span className="text-3xl">{instrument.icon}</span>
                        <div>
                            <span className="text-xs text-slate-500 font-bold tracking-wider">{instrument.type}</span>
                            <h2 className="text-2xl font-bold text-slate-100">{instrument.title}</h2>
                        </div>
                    </div>
                    <p className="text-sm text-slate-400">對象：{instrument.target}</p>
                    {!isRevealed && (
                        <p className="text-sm text-amber-400 mt-3 font-bold">👆 點擊你認為有 Bug 的題目，再按「提交鑑定」</p>
                    )}
                </div>

                {/* Items List */}
                <div className="space-y-3 mb-6">
                    {instrument.items.map((item, idx) => {
                        const isFlagged = !!flagged[idx];
                        let cardStyle = "";
                        let labelContent = null;

                        if (!isRevealed) {
                            cardStyle = isFlagged
                                ? "bg-red-900/40 border-2 border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.2)]"
                                : "bg-slate-900 border-2 border-slate-700 hover:border-slate-500";
                        } else {
                            if (item.hasBug && isFlagged) {
                                cardStyle = "bg-emerald-900/30 border-2 border-emerald-500";
                                labelContent = <span className="bg-emerald-600 text-white text-xs font-bold px-2 py-1 rounded">✅ 正確！</span>;
                            } else if (item.hasBug && !isFlagged) {
                                cardStyle = "bg-red-900/30 border-2 border-red-500";
                                labelContent = <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">❌ 漏掉了！</span>;
                            } else if (!item.hasBug && isFlagged) {
                                cardStyle = "bg-amber-900/30 border-2 border-amber-500";
                                labelContent = <span className="bg-amber-600 text-white text-xs font-bold px-2 py-1 rounded">⚠️ 誤報</span>;
                            } else {
                                cardStyle = "bg-slate-900 border-2 border-slate-700 opacity-60";
                            }
                        }

                        return (
                            <div
                                key={idx}
                                onClick={() => toggleFlag(idx)}
                                className={`p-4 md:p-5 rounded-xl transition-all duration-200 ${cardStyle} ${!isRevealed ? 'cursor-pointer hover:shadow-lg' : ''}`}
                            >
                                <div className="flex items-start gap-3">
                                    <div className="shrink-0 mt-1">
                                        {!isRevealed ? (
                                            <div className={`w-6 h-6 rounded border-2 flex items-center justify-center text-sm ${isFlagged ? 'bg-red-500 border-red-500 text-white' : 'border-slate-500'}`}>
                                                {isFlagged ? '🐛' : ''}
                                            </div>
                                        ) : (
                                            <span className="text-lg">{item.hasBug ? '🐛' : '✨'}</span>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-xs text-slate-500 font-bold">第 {idx + 1} 題</span>
                                            {labelContent}
                                        </div>
                                        <p className="text-slate-200 whitespace-pre-line text-sm md:text-base">{item.text}</p>

                                        {isRevealed && item.hasBug && (
                                            <div className="mt-3 bg-slate-800 rounded-lg p-3 border border-slate-600">
                                                <p className="text-red-400 font-bold text-sm mb-1">🐛 Bug 類型：{item.bugType}</p>
                                                <p className="text-slate-300 text-sm">{item.explanation}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Actions */}
                <div className="text-right">
                    {!isRevealed ? (
                        <button
                            onClick={submitInspection}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white font-black py-3 px-10 rounded-full text-xl transition transform hover:scale-105 shadow-xl"
                        >
                            提交鑑定 🔍
                        </button>
                    ) : (
                        <div className="space-y-4">
                            <div className={`p-4 rounded-xl text-center font-bold text-lg ${roundScores[roundScores.length - 1]?.correct === bugCount
                                    ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-700'
                                    : 'bg-amber-900/30 text-amber-400 border border-amber-700'
                                }`}>
                                {roundScores[roundScores.length - 1]?.correct === bugCount
                                    ? `🎯 完美！找出全部 ${bugCount} 個 Bug！`
                                    : `找到 ${roundScores[roundScores.length - 1]?.correct || 0}/${bugCount} 個 Bug`}
                            </div>
                            <button
                                onClick={nextRound}
                                className="bg-emerald-600 hover:bg-emerald-500 text-white font-black py-3 px-10 rounded-full text-xl transition transform hover:scale-105 shadow-xl"
                            >
                                {currentRound < instrumentData.length - 1 ? '下一份工具 ➡️' : '查看鑑定報告 📋'}
                            </button>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};
