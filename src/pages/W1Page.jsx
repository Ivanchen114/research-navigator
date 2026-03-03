import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PromptBox } from '../components/analysis/PromptBox';
import { ShieldAlert, Fingerprint, CheckCircle2, AlertTriangle, Lightbulb, ArrowRight, BrainCircuit, Hand, Eye, Cpu, ChevronDown, ChevronUp } from 'lucide-react';

// 嫌疑犯檔案資料
const SUSPECTS = [
    {
        id: 1,
        content: `是否做過專題研究：沒有，但我想這個課程能帶給我嶄新的寶貴經驗。\n\n想像：這個課程能讓我學到如何用 excel、製作表單等，能對我未來，例如大學甚至出社會以後的能力打下基礎。\n\n期待：希望這個課程能讓我成為行動力、研究熱情、能力集於一身的人。`
    },
    {
        id: 2,
        content: `是否做過專題研究：沒有\n\n想像：可以學到研究的方法。\n\n期待：可以研究我感興趣的事，做一個專題報告。`
    },
    {
        id: 3,
        content: `是否做過專題研究：沒有。我一直覺得會做專題研究是一件很酷的事情，所以希望這學期可以學到很多。\n\n想像：會有很多表單和作業，因為要查很多資料所以會花很多時間，然後作業很難完成且需要很多腦汁（聽別班說的）。\n\n期待：會學到很多研究的方法，增進自己探索東西的能力，腦袋也能動比較快。`
    },
    {
        id: 4,
        content: `是否做過專題研究：有，國小時做過科展但後來沒有參加。決定一個感興趣的出題並查詢資料，設計實驗最後做實驗。整理得出的結果並生成結論，修改實驗再重新做實驗或者直接使用此結論。\n\n想像：透過老師的講解和課程內容學到更多關於「研究」的方法和方法論，實作中找到和自己有著相關性的結果並運用在自己的報告和工作，最終完成一份完整的研究以及成果。\n\n期待：能夠找到有對相同主題有興趣的同學並一起完成專題的報告，學習到現下正在研究的事物。能夠將自己所學的東西運用在日常生活甚至是未來的大學課業領域中。`
    },
    {
        id: 5,
        content: `是否做過專題研究：國小時跟同學一起研究花青素，過程中就是照著研究步驟做，實驗途中會有失誤會有誤差。\n\n想像：像實驗課那樣有變應，利用比較不同的操作變應找出最後的應變變應。\n\n期待：能夠讓自己在未來的研究中更加得心應手。`
    },
    {
        id: 6,
        content: `曾參加過科展，做過有關自然的探究。對於專題探究的部分我認為需對其有深入的調查方能夠得到完整的結果。\n\n想像：應是一個充滿有趣的課堂。\n\n期待：能夠通過這堂課來增加自我的能力。`
    },
    {
        id: 7,
        isAI: true,
        content: `是否做過專題研究：沒有，不過覺得這門課應該會很新鮮。\n\n想像：可以學到一些整理資料和做實驗的方法，知道怎麼把想法變成成果。\n\n期待：希望能找到自己有興趣的主題，最後能做出一份完整的專題。`
    },
];


const AIRED_STEPS = [
    {
        letter: 'A',
        label: 'Ascribe',
        chinese: '歸屬說明',
        color: 'text-red-600',
        bg: 'bg-red-50',
        border: 'border-red-200',
        desc: '誠實說明哪裡用了 AI、用了哪個工具、用來做什麼。',
        example: '例：「問卷題目的初稿，我用 Gemini 生成，再由我修改。」',
    },
    {
        letter: 'I',
        label: 'Inquire',
        chinese: '提問紀錄',
        color: 'text-amber-600',
        bg: 'bg-amber-50',
        border: 'border-amber-200',
        desc: '把你給 AI 的 Prompt 記錄下來。你的提問，就是你的思考軌跡。',
        example: '例：「我問 AI：請幫我分析這 40 份回答，哪些是工具型、哪些是思維型？」',
    },
    {
        letter: 'R',
        label: 'Reference',
        chinese: '引用標註',
        color: 'text-emerald-600',
        bg: 'bg-emerald-50',
        border: 'border-emerald-200',
        desc: 'AI 給你的資料來源在哪？你要去查證，不能盲信。',
        example: '例：AI 說某篇論文的結論，我去找到原文確認後才引用。',
    },
    {
        letter: 'E',
        label: 'Evaluate',
        chinese: '評估判斷',
        color: 'text-blue-600',
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        desc: 'AI 會胡說八道（幻覺）。你要判斷它說的對不對，不照單全收。',
        example: '例：AI 分析說「受訪者都很滿意」，但我重聽錄音發現其實是反諷。',
    },
    {
        letter: 'D',
        label: 'Document',
        chinese: '歷程記錄',
        color: 'text-purple-600',
        bg: 'bg-purple-50',
        border: 'border-purple-200',
        desc: '記錄你的決策過程：什麼是你決定的，什麼是 AI 建議的。',
        example: '例：保留與 AI 的對話紀錄，附在研究歷程中。',
    },
];

// 人機分工三件事
const THREE_SKILLS = [
    {
        icon: <Lightbulb size={28} />,
        key: '品味 Taste',
        tagline: 'AI 沒有好奇心',
        desc: '學會問好問題。AI 只能回答你問的，不會主動對世界產生疑問。研究的起點永遠是「人的好奇心」。',
        color: 'text-amber-600',
        bg: 'bg-amber-50',
        border: 'border-amber-200',
        week: 'W2–W3',
    },
    {
        icon: <Hand size={28} />,
        key: '接觸 Touch',
        tagline: 'AI 沒有身體',
        desc: '拿到 AI 拿不到的真實數據。問卷、訪談、觀察、現場蹲點——這些「帶著身體」的數據，只有你能取得。',
        color: 'text-emerald-600',
        bg: 'bg-emerald-50',
        border: 'border-emerald-200',
        week: 'W4–W10',
    },
    {
        icon: <BrainCircuit size={28} />,
        key: '判斷 Judgment',
        tagline: 'AI 會胡說八道',
        desc: '批判思考，識破 AI 的錯誤與偏見。數字背後的意義、受訪者的語氣、數據的代表性——這需要你的智慧。',
        color: 'text-blue-600',
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        week: 'W15–W16',
    },
];

export const W1Page = () => {
    const [pledgeSigned, setPledgeSigned] = useState(false);
    const [checkedSteps, setCheckedSteps] = useState({});
    const [openSuspect, setOpenSuspect] = useState(null);
    const [showTruth, setShowTruth] = useState(false);

    const toggleSuspect = (id) => setOpenSuspect(prev => prev === id ? null : id);
    const toggleTruth = () => setShowTruth(prev => !prev);

    const toggleStep = (letter) => {
        setCheckedSteps(prev => ({ ...prev, [letter]: !prev[letter] }));
    };

    const allChecked = AIRED_STEPS.every(s => checkedSteps[s.letter]);

    const generatePledgePrompt = () => `【角色】你是 AI-RED 協作教練。
【任務】請幫這位學生理解「使用 AI 做研究」的正確心態。
根據以下 AI-RED 五個步驟，
用台灣高中生可以理解的語言，
為每個步驟各舉一個「正確使用 AI」和「錯誤使用 AI」的具體例子，
格式：表格（步驟 | 正確做法範例 | 錯誤做法警示）。

AI-RED 五步驟：
A - Ascribe 歸屬說明（說清楚哪裡用了 AI）
I - Inquire 提問紀錄（記錄給 AI 的指令）
R - Reference 引用標註（查證 AI 的資料來源）
E - Evaluate 評估判斷（不照單全收，批判 AI 的回答）
D - Document 歷程記錄（保留與 AI 的對話）`;

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">

            {/* Header */}
            <header className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100 mb-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-amber-100 rounded-full blur-3xl opacity-40 -translate-y-1/2 translate-x-1/3" />
                <div className="relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-100 shadow-sm mb-4">
                        <ShieldAlert size={16} /> W1 研究啟動
                    </div>
                    <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
                        我是大腦，<span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-rose-500 drop-shadow-sm">AI 是工具</span>
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
                        AI 已強大到讓我們分不清真假——這堂課的目標，<br />是讓你成為「會用 AI，但不會被 AI 取代的研究者」。
                    </p>
                </div>
            </header>

            {/* Part 1: 模仿遊戲 */}
            <section className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 md:p-8 hover:shadow-md transition-shadow">
                <h2 className="text-2xl font-bold text-slate-800 mb-2 flex items-center gap-3">
                    <span className="text-2xl">🕵️</span> 模仿遊戲：誰是偽裝者？
                </h2>
                <p className="text-slate-500 text-sm mb-2">投影幕上有 7 位「學長姐」的回答，但其中 <strong>1 位</strong> 是由 AI 生成的冒牌貨。</p>
                <p className="text-slate-400 text-xs mb-6">👇 點擊每個檔案閱讀後，再猜猜誰是 AI！</p>

                {/* 嫌疑犯檔案列表 */}
                <div className="space-y-2 mb-8">
                    {SUSPECTS.map(s => (
                        <div
                            key={s.id}
                            className={`rounded-xl border overflow-hidden transition-all ${openSuspect === s.id
                                ? s.isAI ? 'border-rose-400 shadow-rose-100 shadow-md' : 'border-slate-300 shadow-sm'
                                : 'border-slate-200 hover:border-slate-300'
                                }`}
                        >
                            {/* 標題列（點擊展開） */}
                            <button
                                onClick={() => toggleSuspect(s.id)}
                                className={`w-full flex items-center justify-between px-5 py-3 text-left transition-colors ${openSuspect === s.id
                                    ? s.isAI ? 'bg-rose-950 text-white' : 'bg-slate-800 text-white'
                                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <span className={`font-mono font-black text-sm px-2 py-0.5 rounded ${openSuspect === s.id
                                        ? s.isAI ? 'bg-rose-800 text-rose-200' : 'bg-slate-700 text-slate-200'
                                        : 'bg-slate-200 text-slate-600'
                                        }`}>#{s.id}</span>
                                    <span className="font-bold text-sm">嫌疑犯檔案：第 {s.id} 號</span>
                                </div>
                                {openSuspect === s.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                            </button>

                            {/* 展開內容 */}
                            {openSuspect === s.id && (
                                <div className={`px-5 py-4 text-sm leading-relaxed whitespace-pre-line ${s.isAI ? 'bg-rose-50 text-rose-900 border-t border-rose-200' : 'bg-white text-slate-700 border-t border-slate-100'
                                    }`}>
                                    {s.content}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* 真相揭曉 */}
                <div className="mb-6">
                    <button
                        onClick={toggleTruth}
                        className={`w-full flex items-center justify-between p-6 rounded-2xl transition-all ${showTruth
                                ? 'bg-rose-950 text-white rounded-b-none'
                                : 'bg-slate-800 text-white hover:bg-slate-700 shadow-md'
                            } relative overflow-hidden`}
                    >
                        <div className="relative z-10 flex items-center gap-3">
                            <ShieldAlert className={showTruth ? 'text-rose-400' : 'text-rose-300'} />
                            <span className="font-black text-xl tracking-tight">🕵️ 揭曉偵探真相</span>
                        </div>
                        <div className="relative z-10 flex items-center gap-2">
                            <span className="text-xs font-mono opacity-60 uppercase tracking-widest">{showTruth ? 'Close' : 'Reveal'}</span>
                            {showTruth ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </div>
                        {showTruth && (
                            <div className="absolute inset-0 opacity-10 text-[200px] font-black text-rose-500 flex items-center justify-center select-none pointer-events-none -right-20">7</div>
                        )}
                    </button>

                    {showTruth && (
                        <div className="bg-rose-950 text-white rounded-b-2xl p-6 border-t border-rose-800/50 animate-in slide-in-from-top-2 duration-300">
                            <div className="relative z-10">
                                <div className="text-rose-300 text-xs font-mono tracking-widest mb-3 uppercase">// 真相揭曉</div>
                                <h3 className="text-2xl font-black mb-3 text-rose-100">真正的冒牌貨是 <span className="text-rose-400">7 號</span></h3>
                                <p className="text-rose-200 text-sm leading-relaxed">
                                    這份作品雖然看起來很用心，但其實是由 AI 生成的冒牌貨。
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* 核心觀念 */}
                <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                        <div className="text-amber-600 font-black text-sm mb-2">💡 核心發現 1</div>
                        <p className="text-slate-700 text-sm">現在的 AI，只要指令下得好，<strong>已經強大到讓我們分不出來</strong>。</p>
                    </div>
                    <div className="bg-red-50 rounded-xl p-4 border border-red-100">
                        <div className="text-red-600 font-black text-sm mb-2">⚠️ 核心發現 2</div>
                        <p className="text-slate-700 text-sm">「看不出來」，所以<strong>「誠實」變成唯一的防線</strong>。不是為了不被抓，而是確認「我」還存在。</p>
                    </div>
                    <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                        <div className="text-blue-600 font-black text-sm mb-2">🧭 核心發現 3</div>
                        <p className="text-slate-700 text-sm">如果連研究過程都是假的，你花一學期在這裡，<strong>只是在陪 AI 演戲而已</strong>。</p>
                    </div>
                </div>
            </section>

            {/* Part 2: AI-RED 公約 */}
            <section className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow">
                <div className="bg-slate-900 text-white p-6 md:p-8">
                    <h2 className="text-2xl font-bold flex items-center gap-3">
                        <Fingerprint className="text-cyan-400" size={28} />
                        AI-RED 協作公約
                    </h2>
                    <p className="text-slate-300 mt-2 text-sm">
                        因為 AI 已強大到以假亂真，這五個步驟是我們在 AI 時代做研究的標準動作。<br />
                        <strong className="text-cyan-400">這不是為了防弊，而是為了捍衛「真實的你」存在於研究中。</strong>
                    </p>
                </div>
                <div className="p-6 md:p-8 space-y-4">
                    {AIRED_STEPS.map(step => (
                        <div
                            key={step.letter}
                            onClick={() => toggleStep(step.letter)}
                            className={`flex gap-4 p-4 rounded-xl border cursor-pointer transition-all ${checkedSteps[step.letter]
                                ? 'bg-emerald-50 border-emerald-300 shadow-sm'
                                : `${step.bg} ${step.border}`
                                }`}
                        >
                            <div className="shrink-0 flex items-start gap-3">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xl ${checkedSteps[step.letter] ? 'bg-emerald-500 text-white' : 'bg-white border-2 ' + step.border + ' ' + step.color}`}>
                                    {checkedSteps[step.letter] ? <CheckCircle2 size={22} /> : step.letter}
                                </div>
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className={`font-black text-base ${checkedSteps[step.letter] ? 'text-emerald-700' : step.color}`}>{step.label}</span>
                                    <span className="text-slate-500 text-sm font-medium">{step.chinese}</span>
                                </div>
                                <p className="text-slate-700 text-sm mb-1">{step.desc}</p>
                                <p className="text-slate-500 text-xs italic">{step.example}</p>
                            </div>
                        </div>
                    ))}

                    {/* 簽署承諾 */}
                    <div className={`mt-6 rounded-2xl border-2 p-6 transition-all ${allChecked ? 'border-emerald-400 bg-emerald-50' : 'border-slate-200 bg-slate-50'}`}>
                        {!allChecked && (
                            <p className="text-slate-500 text-sm text-center mb-4">⬆️ 請先點擊上方五個步驟，確認你都理解了</p>
                        )}
                        {allChecked && !pledgeSigned && (
                            <div className="text-center">
                                <p className="text-emerald-700 font-bold mb-1">你已理解所有五個步驟！</p>
                                <p className="text-slate-600 text-sm mb-4">按下簽署，代表你承諾：在這學期的研究中，誠實記錄使用 AI 的過程，並對自己的研究成果負責。</p>
                                <button
                                    onClick={() => setPledgeSigned(true)}
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-black px-8 py-3 rounded-xl shadow-md hover:shadow-lg transition-all"
                                >
                                    ✍️ 我同意，簽署 AI-RED 公約
                                </button>
                            </div>
                        )}
                        {pledgeSigned && (
                            <div className="text-center">
                                <div className="text-5xl mb-3">🎖️</div>
                                <p className="text-emerald-700 font-black text-lg mb-1">公約已簽署！</p>
                                <p className="text-slate-600 text-sm">你已成為 AI-RED 研究者。我是大腦，AI 是副駕駛。</p>
                            </div>
                        )}
                    </div>

                    {/* AI Prompt 工具 */}
                    <div className="pt-6 border-t border-slate-200">
                        <h3 className="text-base font-bold text-slate-800 mb-2 flex items-center gap-2">
                            <Cpu size={18} className="text-blue-500" />
                            呼叫 AI：幫我理解 AI-RED 五步驟
                        </h3>
                        <p className="text-sm text-slate-500 mb-3">複製下方指令到 ChatGPT / Gemini，AI 會幫你用具體例子說明五個步驟。</p>
                        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                            <PromptBox>{generatePledgePrompt()}</PromptBox>
                        </div>
                    </div>
                </div>
            </section>

            {/* Part 3: 人機協作三件事 */}
            <section className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 md:p-8 hover:shadow-md transition-shadow">
                <h2 className="text-2xl font-bold text-slate-800 mb-2 flex items-center gap-3">
                    <BrainCircuit className="text-blue-600" size={28} />
                    為什麼還要上 18 週？
                </h2>
                <p className="text-slate-500 text-sm mb-6">
                    「老師，如果 AI 只要 30 秒就能分析資料，我們為什麼還要花 18 週？」<br />
                    <strong className="text-slate-700">因為我們練的，是 AI 永遠做不到的三件事。</strong>
                </p>

                {/* 人機分工示範 */}
                <div className="bg-slate-50 rounded-xl border border-slate-200 p-5 mb-6">
                    <p className="text-xs font-mono text-slate-400 tracking-widest mb-3 uppercase">// 課堂示範：老師的小研究</p>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                            <div className="text-blue-700 font-bold text-sm mb-2 flex items-center gap-2"><Eye size={16} /> 人（老師）做的事</div>
                            <ul className="space-y-1 text-sm text-slate-700">
                                <li>✅ 產生好奇心，提出研究問題</li>
                                <li>✅ 決定用 Google 表單蒐集資料</li>
                                <li>✅ <strong>解讀數據背後的教學意義</strong></li>
                            </ul>
                        </div>
                        <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
                            <div className="text-purple-700 font-bold text-sm mb-2 flex items-center gap-2"><Cpu size={16} /> AI（Gemini）做的事</div>
                            <ul className="space-y-1 text-sm text-slate-700">
                                <li>⚡ 30 秒內分類 40 筆文字</li>
                                <li>⚡ 計算各類百分比</li>
                                <li>⚡ 整理關鍵字與範例</li>
                            </ul>
                        </div>
                    </div>
                    <div className="mt-3 text-center text-sm font-bold text-slate-600">
                        結論：我是大腦（提問與解讀），AI 是手腳（運算）。缺一不可！
                    </div>
                </div>

                {/* 三件事卡片 */}
                <div className="grid md:grid-cols-3 gap-5">
                    {THREE_SKILLS.map(skill => (
                        <div key={skill.key} className={`rounded-2xl border p-5 flex flex-col ${skill.bg} ${skill.border}`}>
                            <div className={`${skill.color} mb-3`}>{skill.icon}</div>
                            <h3 className={`text-lg font-black ${skill.color} mb-1`}>{skill.key}</h3>
                            <p className="text-xs text-slate-500 italic mb-2">「{skill.tagline}」</p>
                            <p className="text-slate-700 text-sm leading-relaxed flex-1">{skill.desc}</p>
                            <div className="mt-3 text-xs font-mono text-slate-400 border-t border-current/10 pt-2">
                                👉 練習時間：{skill.week}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* 自我反思 */}
            <section className="bg-amber-50 rounded-3xl border border-amber-200 p-6 md:p-8">
                <h2 className="text-lg font-bold text-amber-800 mb-4 flex items-center gap-2">
                    <AlertTriangle size={20} /> W1 核心問題：你的答案是什麼？
                </h2>
                <div className="space-y-3">
                    <div className="bg-white rounded-xl p-4 border border-amber-100">
                        <p className="text-slate-600 text-sm font-medium mb-1">🤔 如果 AI 可以假冒你，什麼才能證明「這是我做的研究」？</p>
                        <p className="text-slate-400 text-xs">（在學習單 Part 1 的討論題中記錄你的答案）</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 border border-amber-100">
                        <p className="text-slate-600 text-sm font-medium mb-1">✍️ AI 可以幫我 ＿＿＿，但這學期我要練的是 ＿＿＿。</p>
                        <p className="text-slate-400 text-xs">（在學習單 Part 3 第 5 題中填寫）</p>
                    </div>
                </div>
            </section>

            {/* 下週預告 */}
            <div className="bg-slate-900 rounded-3xl p-6 text-white">
                <p className="text-slate-400 text-xs font-mono tracking-widest mb-2 uppercase">// 📢 下週 W2 預告</p>
                <p className="text-white font-bold text-lg mb-1">「問題意識的覺醒」</p>
                <p className="text-slate-300 text-sm mb-4">把你在 W1 學習單 Part 0 寫下的「生活觀察」帶過來。<br />下週我們把那顆種子，變成真正有深度的研究問題。</p>
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                    ⚠️ 請務必記得帶那個「讓你好奇的生活現象」！
                </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between pt-4 pb-12">
                <Link to="/discovery" className="inline-flex items-center gap-2 bg-slate-200 text-slate-700 px-5 py-3 rounded-lg font-semibold hover:bg-slate-300 transition">
                    ← 回 W0 觀察力啟動
                </Link>
                <Link to="/problem-focus" className="inline-flex items-center gap-2 bg-amber-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-amber-600 transition shadow-md hover:shadow-lg">
                    W2 問題意識鍛鍊 <ArrowRight size={20} />
                </Link>
            </div>

        </div>
    );
};
