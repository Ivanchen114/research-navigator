import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    ShieldAlert,
    Fingerprint,
    CheckCircle2,
    AlertTriangle,
    Lightbulb,
    ArrowRight,
    BrainCircuit,
    Hand,
    Eye,
    Cpu,
    ChevronDown,
    ChevronUp,
    Map,
    Info,
    Coffee,
    Target,
    ChevronRight,
    Play,
    Activity,
    Gamepad2
} from 'lucide-react';
import LessonMap from '../components/ui/LessonMap';
import { W1Data } from '../data/lessonMaps';

const SUSPECTS = [
    { id: 1, content: `我沒有做過專題研究，但我想這個課程能帶給我嶄新的寶貴經驗。\n\n想像：這個課程能讓我學到如何用 Excel、製作表單等，能對我未來，例如大學甚至出社會以後的能力打下基礎。\n\n期待：希望這個課程能讓我成為行動力、研究熱情、能力集於一身的人。` },
    { id: 2, content: `是否做過專題研究：沒有\n\n想像：可以學到研究的方法。\n\n期待：可以研究我感興趣的事，做一個專題報告。` },
    { id: 3, content: `是否做過專題研究：沒有。我一直覺得會做專題研究是一件很酷的事情，所以希望這學期可以學到很多。\n\n想像：會有很多表單和作業，因為要查很多資料所以會花很多時間，然後作業很難完成且需要很多腦汁（聽別班說的）。\n\n期待：增進自己探索東西的能力，腦袋也能動比較快。` },
    { id: 4, content: `是否做過專題研究：有，國小時做過科展但後來沒有參加。決定一個感興趣的出題並查詢資料，設計實驗最後做實驗，整理得出的結論。\n\n想像：透過老師的講解學到更多關於「研究」的方法和方法論，找到和自己有相關性的結果。\n\n期待：能找到有相同主題有興趣的同學並一起完成，學習到現下正在研究的事物。` },
    { id: 5, content: `是否做過專題研究：國小時跟同學一起研究花青素，過程中就是照著研究步驟做，實驗途中會有失誤會有誤差。\n\n想像：像實驗課那樣有變因，利用比較不同的操作變因找出最後的應變變因。\n\n期待：能夠讓自己在未來的研究中更加得心應手。` },
    { id: 6, content: `曾參加過科展，做過有關自然的探究。對於專題探究的部分我認為需對其有深入的調查方能夠得到完整的結果。\n\n想像：應是一個充滿有趣的課堂。\n\n期待：能夠通過這堂課來增加自我的能力。` },
    { id: 7, isAI: true, content: `是否做過專題研究：沒有，不過覺得這門課應該會很新鮮。\n\n想像：可以學到一些整理資料和做實驗的方法，知道怎麼把想法變成成果。\n\n期待：希望能找到自己有興趣的主題，最後能做出一份完整的專題。` },
];

const AIRED_STEPS = [
    { letter: 'A', label: 'Ascribe', chinese: '歸屬說明', desc: '我用了哪個 AI 工具？用它做什麼事？' },
    { letter: 'I', label: 'Inquire', chinese: '提問紀錄', desc: '我向 AI 提出了什麼問題？為什麼這樣問？' },
    { letter: 'R', label: 'Reference', chinese: '引用標註', desc: 'AI 給的資料來源是什麼？可信嗎？去查了嗎？' },
    { letter: 'E', label: 'Evaluate', chinese: '評估判斷', desc: 'AI 的回答合理嗎？有沒有錯誤或偏見？' },
    { letter: 'D', label: 'Document', chinese: '歷程記錄', desc: '我做了哪些決策？AI 在我的研究裡扮演什麼角色？' },
];

export const W1Page = () => {
    const [showLessonMap, setShowLessonMap] = useState(false);
    const [pledgeSigned, setPledgeSigned] = useState(false);
    const [checkedSteps, setCheckedSteps] = useState({});
    const [showTruth, setShowTruth] = useState(false);

    const toggleStep = (letter) => setCheckedSteps(prev => ({ ...prev, [letter]: !prev[letter] }));
    const allChecked = AIRED_STEPS.every(s => checkedSteps[s.letter]);

    return (
        <div className="page-container animate-in-fade-slide">


            {/* TOP BAR / NAVIGATION PATH */}
            <div className="flex items-center justify-between border-b border-[#dddbd5] pb-4 mb-16">
                <div className="text-[11px] font-mono text-[#8888aa] flex items-center gap-2">
                    研究方法與專題 / 識能探索 / <span className="text-[#1a1a2e] font-bold">模仿遊戲 W1</span>
                </div>
                <div className="flex items-center gap-4">
                    <span className="bg-[#f0ede6] text-[#1a1a2e] text-[10px] font-bold px-2 py-0.5 rounded-[2px] font-mono">100 MINS</span>
                    <button
                        onClick={() => setShowLessonMap(!showLessonMap)}
                        className="text-[11px] text-[#8888aa] hover:text-[#2d5be3] transition-colors flex items-center gap-1 font-mono"
                    >
                        <Map size={12} /> {showLessonMap ? 'Hide Plan' : 'Instructor View'}
                    </button>
                    <span className="bg-[#1a1a2e] text-white text-[10px] font-bold px-2 py-0.5 rounded-[2px] font-mono">AI-RED · D</span>
                </div>
            </div>

            {showLessonMap && (
                <div className="animate-in slide-in-from-top-4 duration-300">
                    <LessonMap data={W1Data} />
                </div>
            )}

            {/* PAGE HEADER */}
            <header>
                <div className="text-[11px] font-mono text-[#2d5be3] mb-3 tracking-[0.06em]">🎭 W1 · 啟動課程</div>
                <h1 className="font-serif text-[36px] font-bold leading-[1.2] text-[#1a1a2e] mb-4 tracking-[-0.02em]">
                    模仿遊戲：<span className="text-[#2d5be3] italic">我寫→我猜→我怕→我簽</span>
                </h1>
                <p className="text-[15px] text-[#4a4a6a] max-w-[600px] leading-[1.75] mb-8">
                    AI 已經強大到讓你分不清楚了。所以「誠實」變成唯一的防線——今天你要親手簽下這個承諾。
                </p>

                {/* COURSE ARC */}
                <div className="mb-14">
                    <div className="text-[11px] text-[#8888aa] mb-4">課程弧線 · 你在哪裡</div>
                    <div className="arc-grid">
                        {W1Data.courseArc.map((item, idx) => (
                            <div key={idx} className={`arc-item ${item.past ? 'past' : item.now ? 'now' : ''}`}>
                                <div className="arc-wk">
                                    {item.wk} {item.now && '← 現在'}
                                </div>
                                <div className="arc-name">
                                    {item.name.split('\n').map((line, i) => <div key={i}>{line}</div>)}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </header>
            {/* META STRIP */}
            <div className="meta-strip">
                {W1Data.metaCards.map((item, idx) => (
                    <div key={idx} className="meta-item">
                        <div className="meta-label">{item.label}</div>
                        <div className="meta-value">{item.value}</div>
                    </div>
                ))}
            </div>

            {/* 本週簡報 */}
            <div className="flex justify-end mb-8 -mt-2">
                <a
                    href="https://www.canva.com/design/DAG_UaPfL_A/ngSypCYmBU9L2xoOrtM2ew/watch?utm_content=DAG_UaPfL_A&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=h308172ce6f"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold tracking-wider text-[#8888aa] hover:text-[#1a1a2e] bg-[#f8f7f4] hover:bg-[#f0ede6] border border-[#dddbd5] hover:border-[#1a1a2e]/20 px-3 py-1.5 rounded-[5px] transition-all"
                >
                    📊 本週簡報 ↗
                </a>
            </div>

            {/* PART 1: 學什麼 (CONCEPT) */}
            <section>
                <div className="section-head">
                    <h2>學什麼</h2>
                    <div className="line"></div>
                    <div className="mono">CONCEPT</div>
                </div>
                <p className="section-desc">認識 AI-RED 協作公約，學習如何在 AI 輔助下依然保持研究者的誠實與獨立。</p>

                <div className="space-y-6">
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-[1px] bg-[var(--border)] border border-[var(--border)] rounded-[10px] overflow-hidden">
                        {AIRED_STEPS.map(step => (
                            <div
                                key={step.letter}
                                onClick={() => toggleStep(step.letter)}
                                className={`p-4 cursor-pointer transition-all ${checkedSteps[step.letter] ? 'bg-[var(--accent-light)]' : 'bg-white hover:bg-[var(--paper)]'}`}
                            >
                                <div className={`text-[22px] font-bold font-mono mb-1 text-[var(--accent)]`}>
                                    {step.letter}
                                </div>
                                <div className="text-[13px] font-bold text-[#1a1a2e] mb-0.5">{step.label}</div>
                                <div className="text-[11px] text-[#8888aa] mb-2">{step.chinese}</div>
                                <p className="text-[11px] text-[#4a4a6a] leading-relaxed">{step.desc}</p>
                                {checkedSteps[step.letter] && (
                                    <div className="mt-2 text-[#2e7d5a]">
                                        <CheckCircle2 size={14} />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* 人機分工 */}
                <div className="space-y-4">
                    <div className="text-[10px] font-mono text-[#8888aa] uppercase tracking-[0.1em]">人機分工</div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-[1px] bg-[var(--border)] border border-[var(--border)] rounded-[10px] overflow-hidden">
                        <div className="bg-white">
                            <div className="p-3 px-4 bg-[#f0ede6] border-b border-[#dddbd5] flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="text-base">🧠</span>
                                    <span className="font-bold text-[#1a1a2e] text-[13px]">人類負責</span>
                                </div>
                                <span className="text-[10px] font-mono text-[#2d5be3]">大腦</span>
                            </div>
                            <div className="divide-y divide-[#dddbd5]">
                                {['決定想研究什麼（問題意識）', '設計蒐集資料的方式', '解讀數據背後的意義'].map((item, i) => (
                                    <div key={i} className="p-3 px-4 flex items-start gap-2.5 text-[13px] text-[#4a4a6a]">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#2d5be3] mt-[7px] shrink-0" />
                                        {item}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="bg-white">
                            <div className="p-3 px-4 bg-[#f0ede6] border-b border-[#dddbd5] flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="text-base">⚙️</span>
                                    <span className="font-bold text-[#1a1a2e] text-[13px]">AI 負責</span>
                                </div>
                                <span className="text-[10px] font-mono text-[#8888aa]">手腳</span>
                            </div>
                            <div className="divide-y divide-[#dddbd5]">
                                {['快速分類大量文字', '計算比例與統計', '整理與格式化結果'].map((item, i) => (
                                    <div key={i} className="p-3 px-4 flex items-start gap-2.5 text-[13px] text-[#4a4a6a]">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#8888aa] mt-[7px] shrink-0" />
                                        {item}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="notice notice-accent">
                        💡 <strong>結論：</strong>我是大腦（提問與解讀），AI 是手腳（運算）。缺一不可——但方向永遠由人來定。
                    </div>
                </div>
            </section>

            {/* PART 2: 練什麼 (PRACTICE) */}
            <section>
                <div className="section-head">
                    <h2>練什麼</h2>
                    <div className="line"></div>
                    <div className="mono">PRACTICE</div>
                </div>
                <p className="section-desc">挑戰你的「眼力」！在 7 份自述中，你能找出哪一個是 AI 偽裝而成的嗎？</p>

                <div className="bg-white border border-[#dddbd5] rounded-[10px] overflow-hidden">
                    <div className="p-4 bg-[#f0ede6] border-b border-[#dddbd5] flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="bg-[#c0392b] text-white text-[10px] px-2 py-0.5 rounded-[3px] font-mono">TASK</span>
                            <span className="font-bold text-[13px]">🕵️ 找出偽裝者</span>
                        </div>
                        <span className="text-[12px] text-[#8888aa]">7 份作品中有 1 份是 AI 寫的</span>
                    </div>
                    <div className="p-6 md:p-8 space-y-6">
                        <div className="notice notice-gold">
                            先自己判斷，再小組討論。不要直接說答案——要說出<strong>你的理由</strong>。
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {SUSPECTS.map(s => (
                                <div key={s.id} className="border border-[#dddbd5] rounded-lg overflow-hidden flex flex-col">
                                    <div className="p-3 px-4 bg-[#f8f7f4] border-b border-[#dddbd5] text-[11px] font-mono text-[#8888aa]">
                                        嫌疑犯 #{s.id}
                                    </div>
                                    <div className="p-4 text-[13px] text-[#4a4a6a] leading-relaxed flex-1">
                                        <div dangerouslySetInnerHTML={{ __html: s.content.replace(/\n/g, '<br/>').replace(/想像：/g, '<strong>想像：</strong>').replace(/期待：/g, '<strong>期待：</strong>') }} />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={() => setShowTruth(!showTruth)}
                            className={`w-full p-8 border rounded-[10px] flex items-center justify-between transition-all ${showTruth ? 'bg-[#1a1a2e] text-white border-[#1a1a2e]' : 'bg-white text-[#1a1a2e] border-[#dddbd5] hover:border-[#1a1a2e]'
                                }`}
                        >
                            <div className="flex items-center gap-4 font-bold text-[17px]">
                                <Activity className={showTruth ? 'text-[#c9a84c]' : 'text-[#2d5be3]'} size={28} />
                                揭曉真相：誰是偽裝者？
                            </div>
                            {showTruth ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                        </button>

                        {showTruth && (
                            <div className="animate-in slide-in-from-top-2 duration-500">
                                <div className="border-2 border-[#2e7d5a]/20 bg-white rounded-lg overflow-hidden">
                                    <div className="p-3 px-4 bg-[#e8f5ee] border-b border-[#2e7d5a]/10 text-[13px] font-bold text-[#2e7d5a] flex items-center gap-2">
                                        <CheckCircle2 size={16} /> ✓ 答案揭曉：AI 是 7 號
                                    </div>
                                    <div className="p-4 md:p-6 text-[13px] text-[#4a4a6a] leading-[1.8] space-y-4">
                                        <p>7 號的回答用詞工整、有具體方法（整理資料、做實驗）、有期待（做出完整專題）——看起來很真實。</p>
                                        <p>但仔細看：<strong>沒有任何個人細節</strong>，沒有生活場景，沒有自己的話，沒有情緒起伏。每句話都是正確的，但沒有一句是「這個人特有的」。</p>
                                        <div className="notice notice-accent">
                                            💡 這說明了一件事：現在的 AI，只要指令下得好，已經讓我們分不出來了。所以「誠實標註」是研究者最重要的底線——不是為了不被抓到，而是為了確認「我」還存在。
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* 這學期要練的三件事 */}
                <div className="space-y-4 pt-4">
                    <div className="text-[10px] font-mono text-[#8888aa] uppercase tracking-[0.1em]">這學期要練的三件 AI 做不到的事</div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {[
                            { icon: '👅', title: '品味', en: 'Taste', desc: 'AI 沒有好奇心。我們要學問好問題——不是問 AI 叫你問的問題，而是你真正想知道的問題學術研究。', next: '→ W2–W3 練這個' },
                            { icon: '🤝', title: '接觸', en: 'Touch', desc: 'AI 沒有身體。我們要學拿到真實數據——去現場、去問人、去觀察，拿到 AI 永遠拿不到的東西。', next: '→ W4–W10 練這個' },
                            { icon: '⚖️', title: '判斷', en: 'Judgment', desc: 'AI 會胡說八道。我們要學批判思考——不照單全收，對數字 and 結論都要追問「這合理嗎？」', next: '→ W15–W16 練這個' }
                        ].map((skill, i) => (
                            <div key={i} className="bg-white border border-[#dddbd5] rounded-[10px] overflow-hidden flex flex-col">
                                <div className="p-5 pb-0">
                                    <div className="text-[28px] mb-3">{skill.icon}</div>
                                    <h3 className="font-serif text-[16px] font-bold text-[#1a1a2e]">{skill.title}</h3>
                                    <div className="text-[10px] font-mono text-[#8888aa] uppercase mb-3">{skill.en}</div>
                                    <p className="text-[12px] text-[#4a4a6a] leading-[1.65] flex-1 mb-4">{skill.desc}</p>
                                </div>
                                <div className="p-3 px-5 bg-[#f8f7f4] border-t border-[#dddbd5] text-[10px] font-mono text-[#2d5be3] tracking-[0.05em]">
                                    {skill.next}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* PART 3: 課堂任務 (IN-CLASS) */}
            <section>
                <div className="section-head">
                    <h2>課堂任務</h2>
                    <div className="line"></div>
                    <div className="mono">IN-CLASS</div>
                </div>
                <p className="section-desc">從模仿遊戲出發，最後簽署誠信宣言，並播下你的「好奇心種子」。</p>

                <div className="grid grid-cols-1 gap-6">
                    {[
                        {
                            id: 1,
                            title: '找出偽裝者',
                            subtitle: '閱讀 7 份作品，找出哪一份是 AI 寫的。先個人判斷，再小組討論。',
                            steps: ['閱讀 7 份作品，個人先圈選嫌疑犯', '寫下你的判斷理由：哪裡看起來不像真人？', '小組討論，統一答案', '全班舉手投票'],
                            notice: '揭曉後思考：你猜對了嗎？如果猜錯了，是被哪個細節騙了？',
                            variant: 'primary'
                        },
                        {
                            id: 2,
                            title: '簽署 AI-RED 公約',
                            subtitle: '這不是為了老師，而是為了確認「你」還存在。',
                            steps: ['閱讀 AI-RED 五步驟說明', '勾選承諾事項', '簽名並寫下日期'],
                            notice: '如果連研究過程都是假的，你坐在這裡一個學期，只是在陪 AI 演戲。',
                            variant: 'warn'
                        },
                        {
                            id: 3,
                            title: '寫下你的好奇心種子',
                            subtitle: '觀察你的學校、日常生活、或最近看到的事。',
                            steps: ['寫下：「我觀察到……」', '不用很學術，寫你真正有感覺的事'],
                            notice: '🌱 這個觀察就是你的種子——下週 W2 上課一定要帶來，我們要把它變成研究問題。',
                            variant: 'success'
                        }
                    ].map(task => (
                        <div key={task.id} className="bg-white border border-[#dddbd5] rounded-[10px] overflow-hidden">
                            <div className="p-3.5 px-5 bg-[#f8f7f4] border-b border-[#dddbd5] flex items-center gap-3">
                                <span className={`font-mono text-white px-2 py-0.5 rounded-[3px] text-[10px] font-bold tracking-wide 
                                    ${task.variant === 'primary' ? 'bg-[#2d5be3]' : task.variant === 'warn' ? 'bg-[#c9a84c]' : 'bg-[#2e7d5a]'}`
                                }>
                                    TASK {task.id}
                                </span>
                                <h3 className="font-bold text-[13px] text-[#1a1a2e]">{task.title}</h3>
                            </div>
                            <div className="p-6 md:p-8 space-y-6">
                                {task.subtitle && (
                                    <p className="text-[13px] text-[#4a4a6a] leading-relaxed mb-4">
                                        {task.subtitle}
                                    </p>
                                )}
                                <ol className="list-decimal list-outside ml-6 space-y-2 text-[13px] text-[#4a4a6a]">
                                    {task.steps.map((s, idx) => (
                                        <li key={idx} className="leading-relaxed pl-1">{s}</li>
                                    ))}
                                </ol>
                                {task.notice && (
                                    <div className={`mt-6 p-4 px-5 rounded-r-lg text-[13px] leading-relaxed border-l-4 
                                        ${task.variant === 'primary' ? 'bg-[#e8eeff] text-[#4a4a6a] border-[#2d5be3]' :
                                            task.variant === 'warn' ? 'bg-[#fdf6e3] text-[#c9a84c] border-[#c9a84c]' :
                                                'bg-[#e8f5ee] text-[#2e7d5a] border-[#2e7d5a]'
                                        }`}>
                                        {task.notice}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* PART 4: 本週總結 (WRAP-UP) */}
            <section>
                <div className="section-head">
                    <h2>本週總結</h2>
                    <div className="line"></div>
                    <div className="mono">WRAP-UP</div>
                </div>

                <div className="bg-white border border-[#dddbd5] rounded-[10px] overflow-hidden">
                    <div className="p-4 px-5 bg-[#f0ede6] border-b border-[#dddbd5] font-bold text-[13px]">
                        ✅ 本週結束，你應該要會
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-[1px] bg-[#dddbd5]">
                        {[
                            '說出為什麼「看不出來」反而讓誠實更重要',
                            '用自己的話解釋 AI-RED 每個字母的意思',
                            '說明人與 AI 在研究中各自負責什麼',
                            '寫下一個讓你好奇的生活現象，下週帶來'
                        ].map((item, i) => (
                            <div key={i} className="p-4 px-6 bg-white flex items-start gap-3">
                                <span className="text-[#2e7d5a] mt-0.5">✓</span>
                                <span className="text-[13px] text-[#4a4a6a]">{item}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 作業 */}
                <div className="bg-white border border-[#dddbd5] rounded-[10px] overflow-hidden">
                    <div className="p-4 px-5 bg-[#f0ede6] border-b border-[#dddbd5] flex items-center gap-3">
                        <span className="text-[10px] font-mono bg-[#1a1a2e] text-white px-2 py-0.5 rounded-[3px]">HOMEWORK</span>
                        <span className="font-bold text-[13px]">本週作業</span>
                    </div>
                    <div className="divide-y divide-[#dddbd5]">
                        {[
                            { part: 'Part 0', name: '我與研究的距離（含生活觀察第 3 題）' },
                            { part: 'Part 1', name: '模仿遊戲：偵探筆記 + 推理與討論 + 真相揭曉' },
                            { part: 'Part 2', name: 'AI-RED 公約簽署', badge: '必簽' },
                            { part: 'Part 3', name: '現場實驗：人機協作（包含自我期許）' },
                            { part: 'Part Z', name: '自我檢核（4 項打勾）' }
                        ].map((hw, i) => (
                            <div key={i} className="p-4 px-6 flex items-center justify-between text-[13px]">
                                <div className="flex items-center gap-6">
                                    <span className="font-bold font-mono text-[#2d5be3] w-12 shrink-0">{hw.part}</span>
                                    <span className="text-[#4a4a6a]">{hw.name}</span>
                                </div>
                                {hw.badge && <span className="bg-[#fdecea] text-[#c0392b] text-[10px] px-2 py-0.5 rounded border border-[#c0392b]/20 font-bold">{hw.badge}</span>}
                            </div>
                        ))}
                    </div>
                    <div className="p-4 px-6 bg-[#f8f7f4] border-t border-[#dddbd5] flex items-center justify-between mt-auto">
                        <span className="text-[12px] text-[#8888aa]">學習單在 Google Classroom 下載</span>
                        <a href="https://classroom.google.com/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-[12px] font-mono font-bold text-[#2d5be3]">
                            → Google Classroom
                        </a>
                    </div>
                </div>

                {/* 下週預告 */}
                <div className="next-week-preview">
                    <div className="next-week-header">
                        <span className="next-week-badge">NEXT WEEK</span>
                        <h3 className="next-week-title">W2 預告</h3>
                    </div>
                    <div className="next-week-content">
                        <div className="next-week-col">
                            <div className="next-week-label">W2 主題</div>
                            <p className="next-week-text">問題意識的覺醒——把模糊的「為什麼」，變成清楚的「我想探究」。</p>
                        </div>
                        <div className="next-week-col">
                            <div className="next-week-label">你要帶來</div>
                            <p className="next-week-text"><strong>你今天寫的生活觀察</strong>——那就是你研究題目的起點。沒有帶，W2 的課你會跟不上。</p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <div className="flex justify-between items-center py-12 border-t border-[#dddbd5]">
                    <Link to="/w0" className="text-[13px] font-bold text-[#8888aa] hover:text-[#1a1a2e] flex items-center gap-2 transition-colors">
                        ← 回 W0 偵探特訓班
                    </Link>
                    <Link to="/w2" className="bg-[#1a1a2e] text-white px-8 py-3 rounded-[6px] text-[13px] font-bold hover:bg-[#2a2a4a] transition-all flex items-center gap-2 group">
                        前往 W2 問題意識 <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </section>
        </div >
    );
};