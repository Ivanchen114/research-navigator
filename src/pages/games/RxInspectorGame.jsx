import React, { useState } from 'react';

// 10 份研究工具病例 (問卷、訪談、實驗、觀察、文獻)
const instrumentData = [
    {
        id: 1,
        type: "問卷專科 📋",
        title: "XQ1 病例：手機使用與睡眠趨勢",
        target: "高中學生",
        icon: "📋",
        items: [
            {
                text: "【問卷題目】你有自己的智慧型手機嗎？\n□ 有 □ 沒有",
                hasBug: false,
                bugType: null,
                explanation: null
            },
            {
                text: "【問卷題目】你同意手機會嚴重傷害睡眠嗎？\n(1) 非常同意 (2) 同意 (3) 普通 (4) 不同意",
                hasBug: true,
                bugType: "誘導性提問 + 缺漏選項",
                explanation: "「嚴重傷害」帶有先入為主的預設立場，會誘導填答者；另外選項明顯缺少了「非常不同意」。",
                correction: "你認為手機使用對睡眠的影響為何？\n(1)非常有幫助 (2)有幫助 (3)沒影響 (4)有負面影響 (5)有嚴重負面影響"
            },
            {
                text: "【問卷題目】你睡前滑手機多久？\nA. 0-10分鐘 B. 10-20分鐘 C. 20-30分鐘",
                hasBug: true,
                bugType: "選項重疊 + 選項不完整",
                explanation: "10 和 20 分鐘的邊界重疊了！且超過 30 分鐘的人完全無法作答。應改為「0-10, 11-20, 21-30, 31分鐘以上」。",
                correction: "你睡前通常滑手機多久？\nA. 10分鐘以內 B. 11-20分鐘 C. 21-30分鐘 D. 31分鐘以上"
            },
            {
                text: "【問卷題目】你通常在床上還是書桌前滑手機？\n□ 在床上 □ 在書桌前 □ 其他",
                hasBug: false,
                bugType: null,
                explanation: null
            },
            {
                text: "【問卷題目】你最近一週平均睡眠時間？\nA. 6小時 B. 7小時",
                hasBug: true,
                bugType: "選項極度不完整",
                explanation: "只給 6 和 7 小時，那睡 5 小時或 8 小時的人直接變成問卷孤兒。",
                correction: "你最近一週平均睡眠時間？\nA. 未滿6小時 B. 6-7小時 C. 7-8小時 D. 8小時以上"
            }
        ]
    },
    {
        id: 2,
        type: "問卷專科 📋",
        title: "XQ2 病例：運動與情緒關聯",
        target: "高中學生",
        icon: "📋",
        items: [
            {
                text: "【問卷題目】你每週運動幾天？\nA. 1-3天 B. 3-5天 C. 5-7天",
                hasBug: true,
                bugType: "選項重疊 + 選項不完整",
                explanation: "3 和 5 重疊了！且完全沒運動 (0天) 的人沒得選。",
                correction: "你每週運動幾天？\nA. 0天 B. 1-2天 C. 3-4天 D. 5天以上"
            },
            {
                text: "【問卷題目】你最常做的運動是什麼種類？\n□ 跑步 □ 球類 □ 游泳 □ 健身 □ 其他",
                hasBug: false,
                bugType: null,
                explanation: null
            },
            {
                text: "【問卷題目】運動後你心情變好而且更有自信嗎？\n(1) 非常不同意 ~ (5) 非常同意",
                hasBug: true,
                bugType: "雙管問題 (Double-barreled)",
                explanation: "一題裡面同時問了「心情變好」和「更有自信」兩件事，若受試者心情變好但自信沒變，會無法作答。",
                correction: "請拆成兩題測量：\n1. 運動後你的心情有變好嗎？\n2. 運動後你有變得更有自信嗎？"
            },
            {
                text: "【問卷題目】你每次運動多久？\nA. 0-30分鐘 B. 30-60分鐘 C. 60分鐘以上",
                hasBug: true,
                bugType: "選項重疊",
                explanation: "30 和 60 分鐘重疊了，會造成統計時的困擾。應改為「0-30, 31-60, 61以上」。",
                correction: "你每次運動通常多久？\nA. 30分鐘以內 B. 31-60分鐘 C. 61分鐘以上"
            }
        ]
    },
    {
        id: 3,
        type: "訪談專科 🎙️",
        title: "XI1 病例：AI 對學習策略的影響",
        target: "高中學生",
        icon: "🎙️",
        items: [
            {
                text: "【訪談大綱】請問你平常會使用哪些 AI 工具來輔助學習？",
                hasBug: false,
                bugType: null,
                explanation: null
            },
            {
                text: "【訪談大綱】你覺得 AI 對學習有哪些幫助？",
                hasBug: true,
                bugType: "單向誘導 / 預設立場",
                explanation: "這句問法預設了 AI 一定有「幫助」，只問好處沒問壞處，會導致正向回答偏誤。應改為：「你覺得 AI 對學習有什麼影響？」",
                correction: "「你認為使用 AI 對你的學習帶來了什麼樣的改變或影響？請與無使用前做個對比。」"
            },
            {
                text: "【訪談大綱】你會不會覺得 AI 讓你做報告更有效率？\n(限定回答：是 / 否)",
                hasBug: true,
                bugType: "封閉式提問",
                explanation: "訪談是為了發掘深度資訊，問只能答「是/否」的問題，會直接把天聊死。",
                correction: "「使用 AI 之後，你在做報告的流程或效率上有什麼改變嗎？可以舉個例子嗎？」"
            },
            {
                text: "【訪談大綱】你同不同意 AI 讓現在的學生變懶惰了？",
                hasBug: true,
                bugType: "價值審判 + 封閉式提問",
                explanation: "帶有「變懶惰」的負面價值判斷，且問「同不同意」容易讓受訪者無法展開論述。",
                correction: "「有些人認為 AI 會改變學生的學習態度，你有什麼看法呢？」"
            }
        ]
    },
    {
        id: 4,
        type: "訪談專科 🎙️",
        title: "XI2 病例：睡眠困難的原因與應對",
        target: "失眠的高中生",
        icon: "🎙️",
        items: [
            {
                text: "【訪談大綱】你睡不著時都在想什麼、為什麼會想這些、想的時候感覺怎樣、最後怎麼解決的？",
                hasBug: true,
                bugType: "多重問題 (疊加提問)",
                explanation: "一口氣問了 4 個連環問題，一般人根本記不住！受訪者通常只會回答最後一個。訪談應一次問一個問題。",
                correction: "先問一題就好：「當你睡不著的時候，腦海中通常會浮現哪些想法？」(後續再搭配追問即可)"
            },
            {
                text: "【訪談大綱】通常在什麼情況下，你會發現自己難以入睡？",
                hasBug: false,
                bugType: null,
                explanation: null
            },
            {
                text: "【訪談大綱】你覺得自己是不是因為不夠自律才睡不著？",
                hasBug: true,
                bugType: "價值批判 / 使人防衛",
                explanation: "帶有「不夠自律」的批評貶義，一問出來受訪者的防衛機制就會開啟，絕對聽不到真心話。",
                correction: "「回顧這些難以入眠的夜晚，你覺得影響你入睡時間的可能原因有哪些？」"
            },
            {
                text: "【訪談大綱】你爸媽覺得你睡不好是不是因為一直玩手機？",
                hasBug: true,
                bugType: "猜測他人想法",
                explanation: "受訪者不是他爸媽，無法代表爸媽回答這個問題，就算回答了也只是他通靈幻想出來的二手資訊。",
                correction: "轉聚焦回受訪者的經歷：「當你晚睡時，你父母通常會有什麼反應或跟你說些什麼？」"
            }
        ]
    },
    {
        id: 5,
        type: "實驗專科 🧪",
        title: "XE1 病例：背景音樂是否提升專注力",
        target: "同班同學",
        icon: "🧪",
        items: [
            {
                text: "【實驗操控】自變項（操弄）：音樂好不好聽\n(播放一首我覺得好聽的歌，再播一首難聽的歌)",
                hasBug: true,
                bugType: "主觀定義 / 缺乏客觀操作",
                explanation: "什麼叫「好聽/難聽」？極度主觀。實驗變項必須具體客觀，例如「有歌詞 vs. 無歌詞」、「白噪音 vs. 流行樂」。",
                correction: "明確定義自變項條件：\nA組：播放不具歌詞的白噪音 (客觀明確)\nB組：播放含有歌詞的華語流行歌曲"
            },
            {
                text: "【測量工具設計】測驗題材：兩組人都閱讀同一篇英文文章",
                hasBug: false,
                bugType: null,
                explanation: null
            },
            {
                text: "【實驗測量】依變項（測量）：學習效果\n(讀書30分鐘後，發問卷問：「你覺得自己專注度有幾分？」)",
                hasBug: true,
                bugType: "主觀自評缺乏效度",
                explanation: "要測「學習效果」，不能只用人類極端不可靠的自我主觀感覺。應該進行客觀評量（考 10 題閱讀測驗看答對率）。",
                correction: "改用客觀測量工具：讓兩組受試者閱讀一篇未讀過的未見短文，並進行 10 題選擇題測驗，以「答對題數」作為客觀學習成效指標。"
            },
            {
                text: "【實驗控制】控制變項：無\n（所有學生都一起在同一間教室受測）",
                hasBug: true,
                bugType: "控制變項不足",
                explanation: "就算教室控制了，學生原本的「英文程度」、「睡眠狀況」都會嚴重干擾結果！需納入控制或平分能力。",
                correction: "增加個人控制變項：\n1. 透過隨機分派將學生打散到兩組，以平均初始能力差異。\n2. 測驗前需以問卷確認受試者昨晚睡眠時數皆在相似範圍。"
            }
        ]
    },
    {
        id: 6,
        type: "實驗專科 🧪",
        title: "XE2 病例：咖啡因與專注力實驗",
        target: "班上同學",
        icon: "🧪",
        items: [
            {
                text: "【分組方式】A組：平常有喝咖啡習慣且自願喝的。\nB組 (對照組)：平常不喝咖啡的人。",
                hasBug: true,
                bugType: "自願偏誤 / 未隨機分派",
                explanation: "兩組立足點不平等！常喝咖啡的人可能本來就比較適應考試。必須「隨機分派」才能排除本身體質或習慣差異的干擾。",
                correction: "招募自願受試者後，將所有受試者打散抽籤，「隨機分派」一半分入 A 組，一半分入 B 組。"
            },
            {
                text: "【實驗環境】統一在早上 9 點的同一間教室進行",
                hasBug: false,
                bugType: null,
                explanation: null
            },
            {
                text: "【實驗流程】A組喝一杯美式咖啡，B組喝水。20分鐘後考數學。",
                hasBug: true,
                bugType: "安慰劑效應未控制",
                explanation: "B組知道自己喝的是水，心理上會覺得「完了沒效」。實驗至少應給B組喝「去咖啡因」的假咖啡（單盲設計），讓大家不知道自己喝了什麼。",
                correction: "導入單盲設計：A 組喝含咖啡因的咖啡，B 組也喝相同口味、溫度、外包裝的「無咖啡因咖啡」，且不告知他們哪杯是真的。"
            }
        ]
    },
    {
        id: 7,
        type: "觀察專科 👀",
        title: "XO1 病例：午休手機行為觀察",
        target: "高中學生",
        icon: "👀",
        items: [
            {
                text: "【觀察紀錄】對象 A：一直在滑手機，感覺玩很兇，很誇張。",
                hasBug: true,
                bugType: "主觀評價",
                explanation: "觀察紀錄必須客觀。什麼叫「玩很兇」？應該確切記錄實質動作，如「連續使用手機達 20 分鐘，螢幕顯示影片畫面」。",
                correction: "客觀記錄動作與持續時間：「對象 A 在午休 30 分鐘內，持續注視手機螢幕達接續的 25 分鐘。」"
            },
            {
                text: "【觀察紀錄】對象 B：偶爾拿起來看，皺著眉頭，應該是在回重要的訊息。",
                hasBug: true,
                bugType: "過度推論他人內心",
                explanation: "你沒有讀心術，無法「看」出訊息重不重要，這都是觀察者的腦補。只能記錄「皺眉、打字」。",
                correction: "只記錄可見的行為表面：「對象 B 午休期間拿起手機 3 次，每次約 2 分鐘，注視螢幕時有皺眉動作，並進行雙手打字。」"
            },
            {
                text: "【觀察紀錄】對象 C：趴在桌上，雙眼閉上超過 15 分鐘，無使用手機。",
                hasBug: false,
                bugType: null,
                explanation: null
            },
            {
                text: "【觀察總結】結論：大部分學生午休都愛玩手機，且缺乏自制力。",
                hasBug: true,
                bugType: "以偏概全 / 道德批判",
                explanation: "只看了 3 個人不能得出「大部分學生」的結論，且「缺乏自制力」是強烈的道德批判，觀察紀錄不可涉及道德。 ",
                correction: "中立總結客觀數據：「隨機選取之 3 位觀察樣本中，有 2 位在午休期間有使用手機行為，1 位全程無使用，尚需擴大觀察母數以進行總結。」"
            }
        ]
    },
    {
        id: 8,
        type: "觀察專科 👀",
        title: "XO2 病例：走廊奔跑行為觀察",
        target: "高一學生",
        icon: "👀",
        items: [
            {
                text: "【時地設定】時間與地點：星期二早自習下課（只有這一天一次）。高一走廊。",
                hasBug: true,
                bugType: "取樣偏差 / 代表性不足",
                explanation: "只觀察某一天的 10 分鐘，可能剛好那天是發成績單大家急著跑？必須「多次、不同時段」長期觀察才具代表性。",
                correction: "擴大觀察時間樣本：於一週五天中，隨機選取不同的 5 個下課時段 (如早修後、第二節下課、午休前) 分別進行各 10 分鐘的觀測。"
            },
            {
                text: "【客觀紀錄】紀錄：發現短短 10 分鐘內有 5 個人奔跑。",
                hasBug: false,
                bugType: null,
                explanation: null
            },
            {
                text: "【觀察站位】觀察角度：站在走廊盡頭固定位置，視野涵蓋整條走廊",
                hasBug: false,
                bugType: null,
                explanation: null
            },
            {
                text: "【觀察結論】結論：本校學生「普遍」都有在走廊奔跑的習慣，且安全意識低落。",
                hasBug: true,
                bugType: "誇大推論",
                explanation: "「10 分鐘內 5 個人奔跑」，全校有上千人。5 個人完全不能代表全校的「普遍習慣」，推論過於誇張。",
                correction: "精確陳述觀察範圍內的行為計數極限：「本次週二考完試的早自習下課 10 分鐘內，高一某走廊觀測點共記錄到 5 起奔跑行為。」"
            }
        ]
    },
    {
        id: 9,
        type: "文獻專科 📚",
        title: "XL1 病例：AI 學習成效趨勢",
        target: "學術文獻",
        icon: "📚",
        items: [
            {
                text: "【文獻搜尋策略】關鍵字範圍限制：「學生」、「AI」、「學習」\n(Google Scholar 出現 1,500,000 筆)",
                hasBug: false,
                bugType: null,
                explanation: null
            },
            {
                text: "【篩選標準】處理方式：\n從第一頁開始瀏覽，隨便挑了 20 篇順眼的論文下載。",
                hasBug: true,
                bugType: "缺乏篩選標準",
                explanation: "「順眼」是什麼學術標準？做文獻回顧必須有客觀的篩選條件（例如：限縮近三年內、被引用次數大於 10...）。",
                correction: "訂定明確的納入/排除條件：\n「篩選發表於近五年 (2020-2024)、被引用次數超過 20 次，且研究對象必須是『中學生』的實證文獻。」"
            },
            {
                text: "【閱讀策略】閱讀方式：\n全部精讀，每篇從第一頁讀到最後一頁，然後寫摘要。",
                hasBug: true,
                bugType: "效率低落 / 策略錯誤",
                explanation: "找文獻時不該一開始就從頭精讀！應該先掃描「摘要(Abstract)」和「結論」，經過淘汰判定真相關後，少數核心文獻才需精讀。",
                correction: "採取三層式閱讀漏斗：\n第一層只看「標題+摘要」過濾海量不相關論文；第二層看「最後結論+圖表」抓取重點；真正高度相關的核心文獻才花時間「全文精讀」。"
            }
        ]
    },
    {
        id: 10,
        type: "文獻專科 📚",
        title: "XL2 病例：整理 AI 正反觀點",
        target: "學術報告",
        icon: "📚",
        items: [
            {
                text: "【文獻整理】論文 A 說 AI 有用。論文 B 說 AI 讓人變笨。\n論文 C 說改善寫作。論文 D 說有倫理問題。論文 E 說發展快。",
                hasBug: true,
                bugType: "大鍋炒 / 報流水帳",
                explanation: "這只是把別人的結論一條一條列出來（清單式堆疊），完全沒有任何統整分類和交叉比較研析。",
                correction: "針對「主題概念」進行分類對話：\n「綜合文獻，AI 應用為雙面刃。在正面效益上，多數學者指出可改善寫作 (論文A, C)；然在潛在風險上，學者較擔憂依賴與倫理顧慮 (論文B, D)。」"
            },
            {
                text: "【文獻歸納】依據上述文獻，我們可將 AI 的影響歸納為「功能面向」與「認知面向」探討。",
                hasBug: false,
                bugType: null,
                explanation: null
            },
            {
                text: "【小結撰寫】結論：以上就是我的文獻探討。",
                hasBug: true,
                bugType: "缺乏研究主體性",
                explanation: "文獻探討不是單純報告別人的書摘！最後結語必須總結「前人沒做好的漏洞是什麼」，並帶出「所以本研究接下來要做什麼」。",
                correction: "寫出 Research Gap (研究缺口) 與本研究定位：\n「雖然過去文獻多已探討 AI 的功能與普遍道德風險，但較少針對『本市文組高中生寫作歷程』的衝擊進行實證測量。因此本研究將聚焦於此缺口填補...」"
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
    const [playerName, setPlayerName] = useState('');
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
            <div className="bg-slate-50/50 rounded-xl overflow-hidden flex flex-col items-center justify-center p-6 md:py-16 font-sans text-slate-800 min-h-[600px]">
                <div className="bg-white p-8 md:p-12 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] max-w-xl w-full text-center border-t-[12px] border-blue-500 relative overflow-hidden">
                    <div className="absolute top-0 right-0 opacity-5 text-9xl -mt-4 -mr-4 text-slate-900">🏥</div>
                    <div className="text-7xl mb-6 animate-pulse">🩺</div>
                    <h1 className="text-3xl md:text-5xl font-black text-slate-800 mb-4 tracking-wide drop-shadow-sm">Level 2：處方診斷室</h1>
                    <h2 className="text-xl md:text-2xl font-bold text-slate-500 mb-6 border-b border-slate-100 pb-4">研究工具深度診斷挑戰</h2>
                    <p className="text-slate-600 text-lg mb-8 font-medium leading-relaxed">
                        10 份研究工具病例送到了你的診間，<br />
                        裡面藏著各種<span className="text-red-500 font-bold">「有毒的設計處方」</span>！<br />
                        身為 Level 2 專科醫師的你，<br />
                        能把所有 <span className="text-blue-500 font-bold border-b-2 border-blue-200">💊 隱藏病徵 (Bug)</span> 都抓出來嗎？
                    </p>
                    <div className="bg-slate-50 rounded-2xl p-6 mb-8 text-left border border-slate-200 shadow-sm">
                        <label className="block text-sm font-bold text-slate-700 mb-2 tracking-wider">👨‍⚕️ 專科醫師代號 (姓名)</label>
                        <input
                            type="text"
                            value={playerName}
                            onChange={(e) => setPlayerName(e.target.value)}
                            placeholder="請輸入你的名字..."
                            className="w-full bg-white border-2 border-slate-200 focus:border-blue-400 rounded-xl outline-none px-4 py-3 font-bold text-lg text-slate-800 placeholder-slate-300 mb-5 transition-colors text-center"
                        />
                        <h3 className="text-sm font-bold text-slate-500 mb-3 tracking-wider border-t border-slate-200 pt-4">📋 看診須知</h3>
                        <div className="space-y-3 text-sm text-slate-600">
                            <p className="flex items-start gap-2">🩺 <span>每一關會出現一份<strong className="text-blue-600 font-bold bg-blue-50 px-1 rounded">研究工具病例</strong>（問卷/訪談/實驗...）</span></p>
                            <p className="flex items-start gap-2">💊 <span>仔細檢查每一題，<strong className="text-red-500 font-bold bg-red-50 px-1 rounded">點擊有病的題目</strong>標記它</span></p>
                            <p className="flex items-start gap-2">⚠️ <span>小心！不是每一題都有問題，<strong className="text-amber-600 font-bold bg-amber-50 px-1 rounded">誤診也會扣分</strong></span></p>
                            <p className="flex items-start gap-2">🎯 <span>常見病徵：雙管問題、誘導性措辭、安慰劑效應未控制...</span></p>
                        </div>
                    </div>
                    <button
                        onClick={startGame}
                        disabled={!playerName.trim()}
                        className={`font-black py-4 px-10 rounded-full text-xl transition transform shadow-[0_8px_20px_rgba(59,130,246,0.3)] hover:shadow-[0_12px_25px_rgba(59,130,246,0.4)] flex items-center justify-center gap-2 mx-auto ${!playerName.trim() ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none hover:shadow-none' : 'bg-blue-500 hover:bg-blue-600 text-white hover:scale-105 active:scale-95'}`}
                    >
                        穿上白袍，開始看診 🩺
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
        let bg = "";
        if (accuracy === 100) { title = "🏆 神醫！零漏網之病！"; color = "text-amber-600"; bg = "bg-amber-50"; }
        else if (accuracy >= 75) { title = "👨‍⚕️ 主治醫師！眼光犀利！"; color = "text-blue-600"; bg = "bg-blue-50"; }
        else if (accuracy >= 50) { title = "🩺 住院醫師！還需磨練！"; color = "text-emerald-600"; bg = "bg-emerald-50"; }
        else { title = "🚨 醫療糾紛！重新訓練！"; color = "text-red-600"; bg = "bg-red-50"; }

        return (
            <div className="bg-slate-50/50 rounded-xl overflow-hidden flex flex-col items-center justify-center p-6 md:py-10 font-sans text-slate-800 min-h-[600px]">
                <div className="bg-white p-8 md:p-12 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] max-w-2xl w-full text-center border-t-[12px] border-blue-500 relative">
                    <div className="absolute top-6 left-6 text-slate-200 text-6xl">📋</div>
                    <h1 className="text-2xl font-bold text-slate-400 mb-2 tracking-widest relative z-10">看診報告單</h1>

                    <div className="mb-4 relative z-10">
                        <p className="text-sm font-bold text-slate-400 tracking-wider">專科醫師</p>
                        <p className="text-2xl font-black text-blue-600 border-b-2 border-slate-200 inline-block px-8 pb-1">{playerName}</p>
                    </div>

                    <div className="flex flex-col items-center justify-center mb-6 relative z-10">
                        <div className="text-7xl font-black text-blue-600 tracking-tighter mb-2">{totalCorrect} <span className="text-3xl text-slate-300 font-medium">/ {totalBugs}</span></div>
                        <p className="text-slate-500 mb-6 font-bold bg-slate-50 px-4 py-1 rounded-full border border-slate-200">病徵命中率：{accuracy}%</p>
                        <h2 className={`text-2xl md:text-3xl font-black px-6 py-2 rounded-2xl ${color} ${bg} mb-4`}>{title}</h2>

                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest bg-slate-50 py-2 px-6 rounded-lg border border-slate-200">請截圖此頁面作為紀錄</p>
                    </div>

                    <button
                        onClick={() => setGameState('start')}
                        className="bg-white hover:bg-slate-50 text-blue-600 font-bold py-3 px-8 rounded-full text-lg transition transform hover:scale-105 shadow-md hover:shadow-lg mb-8 border-2 border-blue-100 flex items-center justify-center gap-2 mx-auto relative z-10"
                    >
                        重新開始實習 🔄
                    </button>

                    {/* Round-by-round review */}
                    <div className="text-left bg-slate-50 p-6 md:p-8 rounded-2xl border-l-8 border-blue-400 max-h-96 overflow-y-auto shadow-inner">
                        <h3 className="text-xl font-black mb-6 flex items-center gap-2 text-slate-700 border-b border-slate-200 pb-4">📋 各病例看診紀錄</h3>
                        <div className="space-y-5">
                            {roundScores.map((rs, i) => (
                                <div key={i} className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 relative overflow-hidden">
                                    <div className={`absolute top-0 left-0 w-1 h-full ${rs.correct === rs.bugs && rs.details.filter(d => d.status === 'false-alarm').length === 0 ? 'bg-emerald-400' : 'bg-red-400'}`}></div>
                                    <div className="flex justify-between items-center mb-3">
                                        <span className="font-bold text-slate-800 text-lg flex items-center gap-2">{rs.instrument.icon} {rs.instrument.title}</span>
                                        <span className={`text-sm font-bold px-3 py-1 rounded-full ${rs.correct === rs.bugs && rs.details.filter(d => d.status === 'false-alarm').length === 0 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                                            {rs.correct}/{rs.bugs} 病徵
                                        </span>
                                    </div>
                                    <div className="space-y-2">
                                        {rs.details.filter(d => d.status !== 'hit').map((d, j) => (
                                            <div key={j} className="text-sm">
                                                {d.status === 'missed' && (
                                                    <p className="flex items-start gap-2 text-slate-600"><span className="text-red-500 font-bold shrink-0">❌ 漏診：</span><span>{d.item.bugType}</span></p>
                                                )}
                                                {d.status === 'false-alarm' && (
                                                    <p className="flex items-start gap-2 text-slate-600"><span className="text-amber-500 font-bold shrink-0">⚠️ 誤診：</span><span>第 {d.idx + 1} 題其實很健康</span></p>
                                                )}
                                            </div>
                                        ))}
                                        {rs.details.filter(d => d.status !== 'hit').length === 0 && (
                                            <p className="text-emerald-600 font-bold text-sm mt-1">✅ 完美揪出所有病徵！</p>
                                        )}
                                    </div>
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
        <div className="bg-slate-50/50 rounded-xl overflow-hidden flex flex-col items-center p-4 md:p-8 font-sans min-h-[600px] text-slate-800">
            <div className="max-w-4xl w-full">

                {/* Progress & Score */}
                <div className="flex flex-wrap justify-between items-center gap-3 mb-6 px-1">
                    <div className="bg-white text-slate-500 font-bold px-5 py-2 rounded-full shadow-sm text-lg border border-slate-200 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                        病例 {currentRound + 1} <span className="opacity-40 font-normal">/ {instrumentData.length}</span>
                    </div>

                    <div className="flex gap-2">
                        <div className="bg-white text-amber-600 font-bold px-4 py-2 rounded-full shadow-sm text-sm border border-amber-200 flex items-center gap-1">
                            💊 已開 {flaggedCount} 張處方
                        </div>
                        <div className="bg-white text-emerald-600 font-bold px-4 py-2 rounded-full shadow-sm text-sm border border-emerald-200 flex items-center gap-1">
                            ✅ 累計: {totalCorrect} 命中
                        </div>
                    </div>
                </div>

                {/* Instrument Header */}
                <div className={`bg-white p-6 md:p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] mb-8 border-t-[8px] transition-all relative overflow-hidden ${isBoss ? 'border-purple-500 shadow-[0_10px_40px_rgba(168,85,247,0.15)]' : 'border-blue-400'}`}>
                    {isBoss && (
                        <div className="absolute top-0 right-0 bg-purple-500 text-white text-xs font-black px-5 py-1.5 rounded-bl-xl tracking-widest animate-pulse shadow-md z-10">
                            ☠️ 綜合重症
                        </div>
                    )}
                    <div className="absolute -bottom-10 -right-10 text-9xl opacity-5 text-slate-900 pointer-events-none">
                        🏥
                    </div>

                    <div className="flex items-center gap-4 mb-3 relative z-10">
                        <span className="text-4xl md:text-5xl">{instrument.icon}</span>
                        <div>
                            <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded font-bold tracking-wider border border-blue-100">{instrument.type}</span>
                            <h2 className="text-2xl md:text-3xl font-black text-slate-800 mt-2">{instrument.title}</h2>
                        </div>
                    </div>
                    <p className="text-sm text-slate-500 font-bold bg-slate-50 inline-block px-3 py-1 rounded-md border border-slate-100 relative z-10">對象：{instrument.target}</p>

                    {!isRevealed && (
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-6 flex items-center gap-3 relative z-10 mx-auto w-full shadow-inner animate-in fade-in slide-in-from-bottom-2">
                            <span className="text-2xl shrink-0">👆</span>
                            <p className="text-amber-700 font-bold text-sm md:text-base">這份工具設計裡藏著「有毒的病徵」！請點擊你認為有病的題目，再按「開立處方箋」。</p>
                        </div>
                    )}
                </div>

                {/* Items List */}
                <div className="space-y-4 mb-8">
                    {instrument.items.map((item, idx) => {
                        const isFlagged = !!flagged[idx];
                        let cardStyle = "";
                        let labelContent = null;

                        if (!isRevealed) {
                            cardStyle = isFlagged
                                ? "bg-red-50/80 border-2 border-red-400 shadow-[0_0_10px_rgba(239,68,68,0.15)] translate-y-[2px]"
                                : "bg-white border-2 border-slate-200 hover:border-blue-300 hover:bg-slate-50 active:translate-y-[1px] shadow-sm";
                        } else {
                            if (item.hasBug && isFlagged) {
                                cardStyle = "bg-emerald-50 border-2 border-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.1)]";
                                labelContent = <span className="bg-emerald-100 text-emerald-700 border border-emerald-300 text-xs font-bold px-2 py-1 rounded shadow-sm">✅ 命中病徵！</span>;
                            } else if (item.hasBug && !isFlagged) {
                                cardStyle = "bg-white border-2 border-red-300 border-dashed opacity-80";
                                labelContent = <span className="bg-red-50 text-red-600 border border-red-200 text-xs font-bold px-2 py-1 rounded">❌ 漏診了！</span>;
                            } else if (!item.hasBug && isFlagged) {
                                cardStyle = "bg-amber-50 border-2 border-amber-400";
                                labelContent = <span className="bg-amber-100 text-amber-700 border border-amber-300 text-xs font-bold px-2 py-1 rounded">⚠️ 誤診</span>;
                            } else {
                                cardStyle = "bg-slate-50 border-2 border-slate-100 opacity-50";
                            }
                        }

                        return (
                            <div
                                key={idx}
                                onClick={() => toggleFlag(idx)}
                                className={`p-5 md:p-6 rounded-2xl transition-all duration-200 ${cardStyle} ${!isRevealed ? 'cursor-pointer' : ''}`}
                            >
                                <div className="flex items-start gap-4">
                                    <div className="shrink-0 mt-1">
                                        {!isRevealed ? (
                                            <div className={`w-7 h-7 rounded border-2 flex items-center justify-center text-sm transition-colors ${isFlagged ? 'bg-red-500 border-red-500 text-white shadow-sm' : 'border-slate-300 bg-white group-hover:border-blue-400'}`}>
                                                {isFlagged ? '🖍️' : ''}
                                            </div>
                                        ) : (
                                            <span className="text-2xl">{item.hasBug ? '💊' : '✨'}</span>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="text-sm text-slate-400 font-bold bg-slate-100 px-2 py-0.5 rounded">第 {idx + 1} 題</span>
                                            {labelContent}
                                        </div>
                                        <p className={`whitespace-pre-line text-base md:text-lg font-medium leading-relaxed ${isRevealed && isFlagged && item.hasBug ? 'text-slate-800 line-through decoration-red-400 decoration-2' : 'text-slate-700'}`}>{item.text}</p>

                                        {isRevealed && item.hasBug && (
                                            <div className="mt-4 bg-white rounded-xl p-4 border-l-[6px] border-emerald-400 shadow-sm relative overflow-hidden">
                                                <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-50 rounded-bl-full -mr-8 -mt-8 opacity-50"></div>
                                                <p className="text-emerald-600 font-black text-sm mb-2 flex items-center gap-1">▍ 診斷名稱：{item.bugType}</p>
                                                <p className="text-slate-600 text-sm md:text-base leading-relaxed font-medium relative z-10 mb-3">{item.explanation}</p>
                                                {item.correction && (
                                                    <div className="pt-3 border-t border-slate-100 relative z-10">
                                                        <p className="text-blue-600 font-extrabold text-sm mb-1 flex items-center gap-1">▍ 改寫處方：</p>
                                                        <p className="text-slate-700 text-sm md:text-base leading-relaxed font-bold bg-blue-50/50 p-2 rounded-lg">{item.correction}</p>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Actions */}
                <div className="flex flex-col items-center pb-8 border-t border-slate-200 pt-8">
                    {!isRevealed ? (
                        <button
                            onClick={submitInspection}
                            disabled={flaggedCount === 0}
                            className={`font-black py-4 px-12 rounded-full text-xl transition transform flex items-center justify-center gap-2 shadow-lg w-full md:w-auto ${flaggedCount > 0 ? 'bg-slate-800 hover:bg-slate-900 text-white hover:scale-105 active:scale-95' : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'}`}
                        >
                            開立處方箋 📄
                        </button>
                    ) : (
                        <div className="w-full">
                            <div className={`w-full p-6 rounded-2xl text-center mb-6 shadow-sm border-l-8 font-bold text-lg ${roundScores[roundScores.length - 1]?.correct === bugCount && roundScores[roundScores.length - 1]?.details.filter(d => d.status === 'false-alarm').length === 0
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-500'
                                : 'bg-amber-50 text-amber-700 border-amber-500'
                                }`}>
                                {roundScores[roundScores.length - 1]?.correct === bugCount && roundScores[roundScores.length - 1]?.details.filter(d => d.status === 'false-alarm').length === 0
                                    ? `🎯 太神啦！精準診斷出全部 ${bugCount} 個病徵！`
                                    : `找到 ${roundScores[roundScores.length - 1]?.correct || 0}/${bugCount} 個病徵。`}
                            </div>
                            <button
                                onClick={nextRound}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-black py-4 px-10 rounded-full text-xl transition transform hover:scale-105 shadow-md flex items-center justify-center gap-2 w-full md:w-auto mx-auto"
                            >
                                {currentRound < instrumentData.length - 1 ? (
                                    <>呼叫下一位病例 <span className="text-2xl leading-none">🩺</span></>
                                ) : (
                                    <>完成看診，查看報告 <span className="text-2xl leading-none">📋</span></>
                                )}
                            </button>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};
