import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PromptBox } from '../components/analysis/PromptBox';
import { ShieldAlert, Fingerprint, CheckCircle2, AlertTriangle, Lightbulb, ArrowRight, BrainCircuit, Hand, Eye, Cpu, ChevronDown, ChevronUp, Map } from 'lucide-react';
import LessonMap from '../components/ui/LessonMap';
import { W1Data } from '../data/lessonMaps';

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
        chinese: '歸屬',
        color: 'text-[#e32d5b]',
        bg: 'bg-white',
        border: 'border-[#dddbd5]',
        desc: '誠實說明哪裡用了 AI。',
        example: '例：「問卷題目的初稿，我用 Gemini 生成，再由我修改。」',
    },
    {
        letter: 'I',
        label: 'Inquire',
        chinese: '提問',
        color: 'text-[#c9a84c]',
        bg: 'bg-white',
        border: 'border-[#dddbd5]',
        desc: '精準提問，不依賴模糊指令。你的提問，就是你的思考軌跡。',
        example: '例：「我問 AI：請幫我分析這 40 份回答，哪些是工具型、哪些是思維型？」',
    },
    {
        letter: 'R',
        label: 'Reference',
        chinese: '引用',
        color: 'text-[#2e7d5a]',
        bg: 'bg-white',
        border: 'border-[#dddbd5]',
        desc: '查證 AI 給的資料來源。不能盲信。',
        example: '例：AI 說某篇論文的結論，我去找到原文確認後才引用。',
    },
    {
        letter: 'E',
        label: 'Evaluate',
        chinese: '評估',
        color: 'text-[#2d5be3]',
        bg: 'bg-white',
        border: 'border-[#dddbd5]',
        desc: '判斷內容是否合理，不照單全收。AI 會胡說八道（幻覺）。',
        example: '例：AI 分析說「受訪者都很滿意」，但我重聽錄音發現其實是反諷。',
    },
    {
        letter: 'D',
        label: 'Document',
        chinese: '紀錄',
        color: 'text-[#8a2be2]',
        bg: 'bg-white',
        border: 'border-[#dddbd5]',
        desc: '保留與 AI 的對話紀錄。',
        example: '例：保留與 AI 的對話紀錄，附在研究歷程中。',
    },
];

const THREE_SKILLS = [
    {
        icon: <Lightbulb size={24} />,
        key: '品味 Taste',
        tagline: 'AI 沒有好奇心',
        desc: '學會問好問題。AI 只能回答你問的，不會主動對世界產生疑問。研究的起點永遠是「人的好奇心」。',
        color: 'text-[#c9a84c]',
        bg: 'bg-white',
        border: 'border-[#dddbd5]',
        week: 'W2–W3',
    },
    {
        icon: <Hand size={24} />,
        key: '接觸 Touch',
        tagline: 'AI 沒有身體',
        desc: '拿到 AI 拿不到的真實數據。問卷、訪談、觀察、現場蹲點——這些「帶著身體」的數據，只有你能取得。',
        color: 'text-[#2e7d5a]',
        bg: 'bg-white',
        border: 'border-[#dddbd5]',
        week: 'W4–W10',
    },
    {
        icon: <BrainCircuit size={24} />,
        key: '判斷 Judgment',
        tagline: 'AI 會胡說八道',
        desc: '批判思考，識破 AI 的錯誤與偏見。數字背後的意義、受訪者的語氣、數據的代表性——這需要你的智慧。',
        color: 'text-[#2d5be3]',
        bg: 'bg-white',
        border: 'border-[#dddbd5]',
        week: 'W15–W16',
    },
];

export const W1Page = () => {
    const [pledgeSigned, setPledgeSigned] = useState(false);
    const [checkedSteps, setCheckedSteps] = useState({});
    const [openSuspect, setOpenSuspect] = useState(null);
    const [showTruth, setShowTruth] = useState(false);
    const [showLessonMap, setShowLessonMap] = useState(false);

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
        <div className="max-w-[900px] mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 font-['Noto_Sans_TC',sans-serif] text-[14px] leading-[1.6] text-[#1a1a2e]">

            {/* ===== Lesson Map Toggle (Teacher Only) ===== */}
            <div className="flex justify-end pt-2 pb-0 -mb-8 relative z-20">
                <button
                    onClick={() => setShowLessonMap(!showLessonMap)}
                    className="flex items-center gap-1.5 text-[11px] text-[#8888aa] hover:text-[#2d5be3] transition-colors opacity-60 hover:opacity-100 font-['DM_Mono',monospace]"
                    title="教師專用：顯示課程地圖"
                >
                    <Map size={12} />
                    {showLessonMap ? 'Hide Map' : 'Instructor View'}
                </button>
            </div>

            {showLessonMap && (
                <div className="mb-4 animate-in slide-in-from-top-4 duration-300">
                    <LessonMap data={W1Data} />
                </div>
            )}

            {/* Header */}
            <header className="mb-14 pt-8">
                <div className="text-[11px] font-['DM_Mono',monospace] tracking-[0.12em] uppercase text-[#2d5be3] mb-3 flex items-center gap-2">
                    <ShieldAlert size={14} /> W1 研究啟動
                </div>
                <h1 className="font-['Noto_Serif_TC',serif] text-[38px] font-bold leading-[1.25] text-[#1a1a2e] mb-4 tracking-[-0.02em]">
                    我是大腦，<br className="hidden md:block" />
                    <span className="text-[#2d5be3] font-normal italic">AI 是工具</span>
                </h1>
                <p className="text-[15px] text-[#4a4a6a] leading-[1.75] max-w-[560px]">
                    AI 已強大到讓我們分不清真假——這堂課的目標，是讓你成為「會用 AI，但不會被 AI 取代的研究者」。
                </p>
            </header>

            {/* Part 1: 模仿遊戲 */}
            <section className="mb-14">
                <div className="flex items-baseline gap-3 mb-4">
                    <h2 className="font-['Noto_Serif_TC',serif] text-[20px] font-bold text-[#1a1a2e]">
                        🕵️ 模仿遊戲：誰是偽裝者？
                    </h2>
                </div>
                <p className="text-[#4a4a6a] text-[14px] mb-6 leading-relaxed">
                    投影幕上有 7 位「學長姐」的回答，但其中 <strong>1 位</strong> 是由 AI 生成的冒牌貨。點擊檔案閱讀後，再猜猜誰是 AI！
                </p>

                {/* 嫌疑犯檔案列表 */}
                <div className="grid grid-cols-1 gap-[1px] bg-[#dddbd5] border border-[#dddbd5] rounded-[10px] overflow-hidden mb-8">
                    {SUSPECTS.map(s => (
                        <div key={s.id} className="bg-white">
                            <button
                                onClick={() => toggleSuspect(s.id)}
                                className={`w-full flex items-center justify-between px-6 py-4 text-left transition-colors ${openSuspect === s.id
                                    ? s.isAI ? 'bg-[#1a1a2e] text-white' : 'bg-[#f8f7f4] text-[#1a1a2e]'
                                    : 'hover:bg-[#f8f7f4] text-[#1a1a2e]'
                                    }`}
                            >
                                <div className="flex items-center gap-4">
                                    <span className={`font-['DM_Mono',monospace] font-bold text-[12px] px-2 py-0.5 rounded ${openSuspect === s.id
                                        ? s.isAI ? 'bg-white/10 text-white' : 'bg-[#dddbd5] text-[#4a4a6a]'
                                        : 'bg-[#f0ede6] text-[#8888aa]'
                                        }`}>#{s.id}</span>
                                    <span className="font-bold text-[14px]">嫌疑犯檔案：第 {s.id} 號</span>
                                </div>
                                {openSuspect === s.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                            </button>

                            {openSuspect === s.id && (
                                <div className={`px-14 py-6 text-[13px] leading-[1.7] whitespace-pre-line animate-in fade-in duration-300 ${s.isAI ? 'bg-[#1a1a2e] text-white/90 border-t border-white/10' : 'bg-white text-[#4a4a6a] border-t border-[#f0ede6]'
                                    }`}>
                                    {s.content}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* 真相揭曉 */}
                <div className="mb-10">
                    <button
                        onClick={toggleTruth}
                        className={`w-full flex items-center justify-between p-6 transition-all border ${showTruth
                            ? 'bg-[#1a1a2e] text-white border-[#1a1a2e] rounded-t-[10px]'
                            : 'bg-white text-[#1a1a2e] border-[#dddbd5] hover:bg-[#f8f7f4] rounded-[10px]'
                            }`}
                    >
                        <div className="flex items-center gap-3">
                            <ShieldAlert className={showTruth ? 'text-[#c9a84c]' : 'text-[#2d5be3]'} size={24} />
                            <span className="font-bold text-[16px] tracking-tight">🕵️ 揭曉偵探真相</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-['DM_Mono',monospace] opacity-60 uppercase tracking-widest">{showTruth ? 'Close' : 'Reveal'}</span>
                            {showTruth ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </div>
                    </button>

                    {showTruth && (
                        <div className="bg-[#1a1a2e] text-white rounded-b-[10px] p-8 border-t border-white/10 animate-in slide-in-from-top-2 duration-300 relative overflow-hidden">
                            <div className="absolute top-0 right-0 -mt-10 -mr-10 text-white/5 font-black text-[200px] leading-none select-none pointer-events-none">
                                7
                            </div>
                            <div className="relative z-10">
                                <div className="text-white/50 text-[10px] font-['DM_Mono',monospace] tracking-widest mb-3 uppercase">// 真相揭曉</div>
                                <h3 className="text-[22px] font-bold mb-3 text-white">真正的冒牌貨是 <span className="text-[#c9a84c]">7 號</span></h3>
                                <p className="text-white/80 text-[14px] leading-relaxed max-w-[500px]">
                                    這份回答雖然格式工整、語氣客氣，但缺乏了其他「真人」學生檔案中常見的瑣碎細節或口語化的轉折。在 AI 時代，「誠實」不再只是道德問題，更是證明你存在的唯一方式。
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* 核心觀念 */}
                <div className="grid md:grid-cols-3 gap-[1px] bg-[#dddbd5] border border-[#dddbd5] rounded-[10px] overflow-hidden">
                    <div className="bg-white p-6 flex flex-col">
                        <div className="text-[#c9a84c] font-['DM_Mono',monospace] font-bold text-[10px] mb-3 uppercase tracking-[0.1em]">💡 核心發現 1</div>
                        <p className="text-[#4a4a6a] text-[13px] leading-[1.6]">現在的 AI，只要指令下得好，<strong>已經強大到讓我們分不出來</strong>。</p>
                    </div>
                    <div className="bg-white p-6 flex flex-col">
                        <div className="text-[#e32d5b] font-['DM_Mono',monospace] font-bold text-[10px] mb-3 uppercase tracking-[0.1em]">⚠️ 核心發現 2</div>
                        <p className="text-[#4a4a6a] text-[13px] leading-[1.6]">「看不出來」，所以<strong>「誠實」變成唯一的防線</strong>。不是為了不被抓，而是確認「我」還存在。</p>
                    </div>
                    <div className="bg-white p-6 flex flex-col">
                        <div className="text-[#2d5be3] font-['DM_Mono',monospace] font-bold text-[10px] mb-3 uppercase tracking-[0.1em]">🧭 核心發現 3</div>
                        <p className="text-[#4a4a6a] text-[13px] leading-[1.6]">如果連研究過程都是假的，你花一學期在這裡，<strong>只是在陪 AI 演戲而已</strong>。</p>
                    </div>
                </div>
            </section>

            {/* Part 2: AI-RED 公約 */}
            <section className="mb-14 border border-[#dddbd5] rounded-[10px] overflow-hidden bg-white">
                <div className="bg-[#1a1a2e] text-white p-8">
                    <div className="flex items-center gap-3 mb-3">
                        <Fingerprint className="text-[#2d5be3]" size={28} />
                        <h2 className="font-['Noto_Serif_TC',serif] text-[20px] font-bold">AI-RED 協作公約</h2>
                    </div>
                    <p className="text-white/70 text-[14px] leading-relaxed max-w-[600px]">
                        因為 AI 已強大到以假亂真，這五個步驟是我們在 AI 時代做研究的標準動作。<br />
                        <strong className="text-white font-bold opacity-100">這不是為了防弊，而是為了捍衛「真實的你」存在於研究中。</strong>
                    </p>
                </div>
                <div className="p-8 space-y-4">
                    {AIRED_STEPS.map(step => (
                        <div
                            key={step.letter}
                            onClick={() => toggleStep(step.letter)}
                            className={`flex gap-5 p-5 rounded-[8px] border transition-all cursor-pointer ${checkedSteps[step.letter]
                                ? 'bg-[#f8f7f4] border-[#2d5be3] shadow-sm'
                                : `bg-white border-[#dddbd5] hover:bg-[#f8f7f4]`
                                }`}
                        >
                            <div className="shrink-0">
                                <div className={`w-10 h-10 rounded-md flex items-center justify-center font-bold text-[18px] transition-colors ${checkedSteps[step.letter] ? 'bg-[#2d5be3] text-white' : 'bg-[#f0ede6] text-[#8888aa]'}`}>
                                    {checkedSteps[step.letter] ? <CheckCircle2 size={22} /> : step.letter}
                                </div>
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className={`font-bold text-[15px] ${checkedSteps[step.letter] ? 'text-[#1a1a2e]' : 'text-[#4a4a6a]'}`}>{step.label}</span>
                                    <span className="text-[#8888aa] text-[12px] font-medium">{step.chinese}</span>
                                </div>
                                <p className="text-[#4a4a6a] text-[13px] mb-1.5 leading-[1.6]">{step.desc}</p>
                                <p className="text-[#8888aa] text-[11px] italic leading-[1.5]">{step.example}</p>
                            </div>
                        </div>
                    ))}

                    {/* 簽署承諾 */}
                    <div className={`mt-10 rounded-[10px] border-2 p-8 transition-all flex flex-col items-center text-center ${allChecked ? 'border-[#2e7d5a] bg-[#f0f9f4]' : 'border-dashed border-[#dddbd5] bg-[#f8f7f4]'}`}>
                        {!allChecked && (
                            <p className="text-[#8888aa] text-[13px]">⬆️ 請先點擊並理解上方五個步驟</p>
                        )}
                        {allChecked && !pledgeSigned && (
                            <div className="animate-in fade-in duration-500">
                                <div className="text-[#2e7d5a] font-bold mb-2 text-[16px]">你已完全理解 AI-RED！</div>
                                <p className="text-[#4a4a6a] text-[13px] mb-6 max-w-[400px]">
                                    按下簽署，代表你承諾在這學期的研究中，<br className="hidden sm:block" />誠實記錄使用 AI 的過程，並對成果負責。
                                </p>
                                <button
                                    onClick={() => setPledgeSigned(true)}
                                    className="bg-[#1a1a2e] hover:bg-[#2a2a4a] text-white font-bold px-10 py-3 rounded-[6px] transition-all"
                                >
                                    ✍️ 我同意，簽署 AI-RED 公約
                                </button>
                            </div>
                        )}
                        {pledgeSigned && (
                            <div className="animate-in zoom-in-95 duration-500">
                                <div className="text-[40px] mb-2">🏅</div>
                                <div className="text-[#2e7d5a] font-bold text-[18px] mb-1">公約已簽署</div>
                                <p className="text-[#4a4a6a] text-[13px]">你已正式成為 AI-RED 研究者。</p>
                            </div>
                        )}
                    </div>

                    {/* AI Prompt 工具 */}
                    <div className="mt-8 pt-8 border-t border-[#f0ede6]">
                        <div className="flex items-center gap-2 mb-4">
                            <Cpu size={18} className="text-[#2d5be3]" />
                            <h3 className="text-[14px] font-bold text-[#1a1a2e]">
                                呼叫 AI：幫我理解 AI-RED 五步驟
                            </h3>
                        </div>
                        <div className="bg-[#f0ede6] p-5 rounded-[8px] border border-[#dddbd5]">
                            <p className="text-[12px] text-[#4a4a6a] mb-4">複製下方指令到 ChatGPT / Gemini，AI 會用具體例子說明這五個步驟。</p>
                            <PromptBox variant="paper">{generatePledgePrompt()}</PromptBox>
                        </div>
                    </div>
                </div>
            </section>

            {/* Part 3: 人機協作三件事 */}
            <section className="mb-14">
                <div className="flex items-baseline gap-3 mb-4">
                    <h2 className="font-['Noto_Serif_TC',serif] text-[20px] font-bold text-[#1a1a2e] flex items-center gap-3">
                        <BrainCircuit className="text-[#2d5be3]" size={24} />
                        為什麼還要上 18 週？
                    </h2>
                </div>
                <p className="text-[#4a4a6a] text-[14px] mb-8 leading-relaxed max-w-[600px]">
                    「老師，如果 AI 只要 30 秒就能分析資料，我們為什麼還要花 18 週？」<br />
                    因為我們練的，是 <strong className="text-[#1a1a2e]">AI 永遠做不到的三件事</strong>。
                </p>

                {/* 人機分工示範 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-[1px] bg-[#dddbd5] border border-[#dddbd5] rounded-[10px] overflow-hidden mb-8">
                    <div className="bg-white p-6">
                        <div className="text-[#1a1a2e] font-bold text-[13px] mb-4 flex items-center gap-2">
                            人（老師）做的事
                        </div>
                        <ul className="space-y-3 text-[13px] text-[#4a4a6a]">
                            <li className="flex gap-2"><span className="text-[#2e7d5a]">✓</span> 產生好奇心，提出研究問題</li>
                            <li className="flex gap-2"><span className="text-[#2e7d5a]">✓</span> 決定用 Google 表單蒐集實體數據</li>
                            <li className="flex gap-2"><span className="text-[#2e7d5a]">✓</span> <strong>解讀數據背後對教學的真實意義</strong></li>
                        </ul>
                    </div>
                    <div className="bg-white p-6">
                        <div className="text-[#1a1a2e] font-bold text-[13px] mb-4 flex items-center gap-2">
                            AI（Gemini）做的事
                        </div>
                        <ul className="space-y-3 text-[13px] text-[#4a4a6a]">
                            <li className="flex gap-2"><span className="text-[#2d5be3]">⚡</span> 30 秒內分類 40 筆文字資料</li>
                            <li className="flex gap-2"><span className="text-[#2d5be3]">⚡</span> 精準計算各類百分比</li>
                            <li className="flex gap-2"><span className="text-[#2d5be3]">⚡</span> 整理趨勢、關鍵字與範例項</li>
                        </ul>
                    </div>
                    <div className="md:col-span-2 bg-[#f8f7f4] p-4 text-center text-[13px] font-bold text-[#1a1a2e] border-t border-[#dddbd5]">
                        我是大腦（提問與解讀），AI 是手腳（運算）。
                    </div>
                </div>

                {/* 三件事卡片 */}
                <div className="grid md:grid-cols-3 gap-[1px] bg-[#dddbd5] border border-[#dddbd5] rounded-[10px] overflow-hidden">
                    {THREE_SKILLS.map(skill => (
                        <div key={skill.key} className="bg-white p-6 hover:bg-[#f8f7f4] transition-colors flex flex-col">
                            <div className={`${skill.color} mb-4`}>{skill.icon}</div>
                            <h3 className="text-[14px] font-bold text-[#1a1a2e] mb-1">{skill.key}</h3>
                            <p className="text-[10px] font-['DM_Mono',monospace] text-[#8888aa] italic mb-3">"{skill.tagline}"</p>
                            <p className="text-[12px] text-[#4a4a6a] leading-[1.6] flex-1">{skill.desc}</p>
                            <div className="mt-6 pt-4 border-t border-[#f0ede6] text-[10px] font-['DM_Mono',monospace] text-[#8888aa]">
                                📍 練習時間 / {skill.week}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* 反思與下一週 */}
            <div className="grid md:grid-cols-2 gap-8 mb-12">
                {/* 自我反思 */}
                <div className="border border-[#c9a84c]/40 rounded-[10px] p-8 bg-white">
                    <h2 className="text-[16px] font-bold text-[#1a1a2e] mb-5 flex items-center gap-2">
                        <AlertTriangle size={20} className="text-[#c9a84c]" /> W1 核心問題
                    </h2>
                    <div className="space-y-6">
                        <div>
                            <p className="text-[13px] text-[#1a1a2e] font-bold mb-1">🤔 什麼才能證明「這是我做的研究」？</p>
                            <p className="text-[11px] text-[#8888aa]">請在學習單 Part 1 的討論題中記錄</p>
                        </div>
                        <div>
                            <p className="text-[13px] text-[#1a1a2e] font-bold mb-1">✍️ AI 可以幫我 ＿＿，但我正要練習 ＿＿。</p>
                            <p className="text-[11px] text-[#8888aa]">請在學習單 Part 3 第 5 題中填寫</p>
                        </div>
                    </div>
                </div>

                {/* 下週預告 */}
                <div className="bg-[#1a1a2e] rounded-[10px] p-8 text-white relative flex flex-col justify-center">
                    <div className="text-white/30 text-[10px] font-['DM_Mono',monospace] tracking-widest mb-4 uppercase">// Next Week</div>
                    <p className="text-[18px] font-bold mb-2">W2 問題意識的覺醒</p>
                    <p className="text-white/70 text-[13px] leading-relaxed mb-4">
                        把在學習單上的「生活觀察」帶過來。下週要把那顆種子變成真正深度的研究問題。
                    </p>
                    <div className="flex items-center gap-2 text-[#c9a84c] font-bold text-[12px]">
                        ⚠️ 務必記得帶那個讓你好奇的現象！
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center py-12 border-t border-[#dddbd5]">
                <Link to="/discovery" className="text-[13px] font-bold text-[#8888aa] hover:text-[#1a1a2e] flex items-center gap-2 transition-colors">
                    ← 回 W0 觀察力啟動
                </Link>
                <Link to="/problem-focus" className="bg-[#1a1a2e] text-white px-8 py-3 rounded-[6px] text-[14px] font-bold hover:bg-[#2a2a4a] transition-all flex items-center gap-2">
                    W2 問題意識鍛鍊 <ArrowRight size={18} />
                </Link>
            </div>

        </div>
    );
};
