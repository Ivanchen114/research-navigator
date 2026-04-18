import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import CourseArc from '../components/ui/CourseArc';
import ThinkRecord from '../components/ui/ThinkRecord';
import AIREDNarrative from '../components/ui/AIREDNarrative';
import ThinkChoice from '../components/ui/ThinkChoice';
import StepEngine from '../components/ui/StepEngine';
import HeroBlock from '../components/ui/HeroBlock';
import ExportButton from '../components/ui/ExportButton';
import {
    CheckCircle2,
    ArrowRight,
    ChevronUp,
    Map,
    Activity,
} from 'lucide-react';
import LessonMap from '../components/ui/LessonMap';
import { W1Data } from '../data/lessonMaps';

/* ── 資料常數 ── */

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

const EXPORT_FIELDS = [
    { key: 'w1-research-exp', label: '我與研究的距離', question: '你做過「研究」嗎？說說你的經驗' },
    { key: 'w1-life-observe', label: '生活觀察種子', question: '寫下一個讓你覺得奇怪、不合理的生活現象' },
    { key: 'w1-suspect-reason', label: '模仿遊戲：我的推理', question: '你覺得 AI 是幾號？為什麼？' },
    { key: 'w1-imitation-reaction', label: '模仿遊戲：揭曉後的反應', question: '知道真相後，你的反應是？' },
    { key: 'w1-aired-hard', label: 'AI-RED 最難遵守的一條', question: 'AI-RED 五個步驟裡，你覺得哪一個最難遵守？為什麼？' },
    { key: 'w1-human-ai-observe', label: '人機協作觀察筆記', question: '觀察老師示範後，哪些步驟是人做的？哪些是 AI 做的？' },
    { key: 'w1-self-expect', label: '對自己的期許', question: '經過今天的課，你對這學期的自己有什麼期許？' },
    { key: 'w1-aired-record', label: 'AI-RED 敘事紀錄', question: '本週最重要的一次 AI 互動（A-I-R-E-D 五要素）' },
];

/* ── 主組件 ── */

export const W1Page = () => {
    const [showLessonMap, setShowLessonMap] = useState(false);
    const [showTruth, setShowTruth] = useState(false);
    const [revealClicks, setRevealClicks] = useState(0);
    const REVEAL_THRESHOLD = 10;

    const handleRevealClick = useCallback(() => {
        if (showTruth) {
            setShowTruth(false);
            return;
        }
        const next = revealClicks + 1;
        setRevealClicks(next);
        if (next >= REVEAL_THRESHOLD) {
            setShowTruth(true);
        }
    }, [showTruth, revealClicks]);

    // 追蹤選擇題結果（供匯出用）
    const [choiceResults, setChoiceResults] = useState([]);
    const trackChoice = useCallback((question, selected, correct) => {
        setChoiceResults(prev => {
            const existing = prev.findIndex(c => c.question === question);
            const entry = { question, selected, correct };
            if (existing >= 0) {
                const next = [...prev];
                next[existing] = entry;
                return next;
            }
            return [...prev, entry];
        });
    }, []);

    return (
        <div className="page-container animate-in-fade-slide">

            {/* TOP BAR */}
            <div className="flex items-center justify-between border-b border-[#dddbd5] pb-4 mb-8 md:mb-12 gap-3">
                <div className="text-[11px] font-mono text-[#8888aa] flex items-center gap-2 min-w-0">
                    <span className="hidden md:inline">研究方法與專題 / 識能探索 / </span>
                    <span className="text-[#1a1a2e] font-bold truncate">模仿遊戲 W1</span>
                </div>
                <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
                    <span className="bg-[#f0ede6] text-[#1a1a2e] text-[10px] font-bold px-2 py-0.5 rounded-[2px] font-mono">100 MINS</span>
                    <button
                        onClick={() => setShowLessonMap(!showLessonMap)}
                        className="text-[11px] text-[#8888aa] hover:text-[#2d5be3] transition-colors flex items-center gap-1 font-mono"
                    >
                        <Map size={12} /> <span className="hidden md:inline">{showLessonMap ? 'Hide Plan' : 'Instructor View'}</span>
                    </button>
                    <span className="hidden md:inline bg-[#1a1a2e] text-white text-[10px] font-bold px-2 py-0.5 rounded-[2px] font-mono">AI-RED · D</span>
                </div>
            </div>

            {showLessonMap && (
                <div className="animate-in slide-in-from-top-4 duration-300">
                    <LessonMap data={W1Data} />
                </div>
            )}

            {/* PAGE HEADER — Hero Block */}
            <HeroBlock
                kicker="R.I.B. 調查檔案 · 研究方法與專題 · W1"
                title="模仿遊戲："
                accentTitle="我寫→我猜→我怕→我簽"
                subtitle="AI 已經強大到讓你分不清楚了。所以「誠實」變成唯一的防線——今天你要親手簽下這個承諾。"
                meta={[
                    { label: '本週任務', value: '找出偽裝者 + 簽署公約' },
                    { label: '時長', value: '100 MINS' },
                    { label: '課堂產出', value: '好奇心種子' },
                    { label: '下週預告', value: '你觀察到的生活現象' },
                ]}
            />
            <CourseArc items={W1Data.courseArc} />

            {/* 本週簡報 */}
            <div className="flex justify-end mb-8 -mt-2">
                <a
                    href="https://canva.link/o1izdmpclpoy1t0"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold tracking-wider text-[#8888aa] hover:text-[#1a1a2e] bg-[#f8f7f4] hover:bg-[#f0ede6] border border-[#dddbd5] hover:border-[#1a1a2e]/20 px-3 py-1.5 rounded-[5px] transition-all"
                >
                    📊 本週簡報 ↗
                </a>
            </div>

            {/* ══════════ STEP ENGINE ══════════ */}
            <StepEngine
              prevWeek={{ label: '回 W0 偵探特訓班', to: '/w0' }}
              nextWeek={{ label: '前往 W2 問題意識', to: '/w2' }}
              flat
              steps={[

                /* ──────── Step 1: 暖身 ──────── */
                {
                    title: '暖身',
                    icon: '🌱',
                    content: (
                        <div className="flex flex-col gap-6 prose-zh">
                            <div>
                                <div className="text-[10px] font-mono text-[var(--ink-light)] uppercase tracking-[0.1em] mb-2">PART 0 · 我與研究的距離</div>
                                <h3 className="font-serif text-[20px] font-bold text-[var(--ink)] mb-3">在開始之前，先認識自己</h3>
                                <p className="text-[14px] text-[var(--ink-mid)] leading-relaxed">
                                    不管你有沒有做過研究，這門課都從零開始。先回答兩個問題，讓老師認識你。
                                </p>
                            </div>

                            <ThinkRecord
                                dataKey="w1-research-exp"
                                prompt="你做過「研究」嗎？不管是科展、小論文、還是自己查資料解決問題——說說你的經驗（沒有也OK，寫「沒有」就好）"
                                placeholder="例如：國小做過科展，主題是…／完全沒有，但我對…有興趣"
                                scaffold={['我做過/沒做過…', '主題是…', '過程中我學到…']}
                                rows={3}
                            />

                            <div className="p-4 rounded-[var(--radius-unified)] bg-[var(--success-light)] border border-[var(--success)]/20">
                                <p className="text-[13px] font-bold text-[var(--success)] mb-2">🌱 下面這題非常重要——它是你整學期研究題目的種子</p>
                                <p className="text-[13px] text-[var(--ink-mid)] leading-relaxed">
                                    觀察你的學校、日常生活、通勤路上、或最近看到的新聞。寫下一個讓你覺得「奇怪」「不合理」或「好想知道為什麼」的現象。不用很學術，寫你真正有感覺的事。
                                </p>
                            </div>

                            <ThinkRecord
                                dataKey="w1-life-observe"
                                prompt="我觀察到……"
                                placeholder="例如：每天經過學校福利社，明明有賣便當但幾乎沒人買，大家都跑去全家…"
                                scaffold={['在（地點/時間），我注意到…', '奇怪的是…', '我想知道…']}
                                rows={4}
                            />

                            <div className="p-3 rounded-[var(--radius-unified)] bg-[var(--accent-light)] border border-[var(--accent)]/15 text-[13px] text-[var(--ink-mid)]">
                                💡 這個觀察下週 W2 要用——老師會帶你把它變成正式的研究問題。
                            </div>
                        </div>
                    ),
                },

                /* ──────── Step 2: 模仿遊戲 ──────── */
                {
                    title: '模仿遊戲',
                    icon: '🕵️',
                    content: (
                        <div className="flex flex-col gap-6 prose-zh">
                            <div>
                                <div className="text-[10px] font-mono text-[var(--ink-light)] uppercase tracking-[0.1em] mb-2">PART 1 · 找出偽裝者</div>
                                <h3 className="font-serif text-[20px] font-bold text-[var(--ink)] mb-3">7 份自述裡，有 1 份是 AI 寫的</h3>
                                <p className="text-[14px] text-[var(--ink-mid)] leading-relaxed">
                                    下面是 7 位同學回答「你對這門課的想像與期待」的自述。其中一份是 AI 偽裝的——你能找出來嗎？
                                </p>
                            </div>

                            <div className="p-3 rounded-[var(--radius-unified)] bg-[var(--gold-light)] border border-[var(--gold)]/20 text-[13px] text-[var(--ink-mid)]">
                                先自己判斷，再小組討論。不要直接說答案——要說出<strong>你的理由</strong>。
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {SUSPECTS.map(s => (
                                    <div key={s.id} className="border border-[var(--border)] rounded-lg overflow-hidden flex flex-col">
                                        <div className="p-3 px-4 bg-[var(--paper)] border-b border-[var(--border)] text-[11px] font-mono text-[var(--ink-light)]">
                                            嫌疑犯 #{s.id}
                                        </div>
                                        <div className="p-4 text-[13px] text-[var(--ink-mid)] leading-relaxed flex-1 bg-white">
                                            <div dangerouslySetInnerHTML={{ __html: s.content.replace(/\n/g, '<br/>').replace(/想像：/g, '<strong>想像：</strong>').replace(/期待：/g, '<strong>期待：</strong>') }} />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <ThinkRecord
                                dataKey="w1-suspect-reason"
                                prompt="我覺得 AI 是 _____ 號，因為……"
                                placeholder="寫下你選的號碼和判斷理由。哪裡看起來不像真人？哪裡太完美？"
                                scaffold={['我選___號', '因為他的回答…', '跟其他人比起來…']}
                                rows={3}
                            />

                            {/* 揭曉按鈕 — 按 10 次才解鎖 */}
                            <button
                                onClick={handleRevealClick}
                                className={`w-full p-6 border rounded-[var(--radius-unified)] flex items-center justify-between transition-all ${showTruth ? 'bg-[var(--ink)] text-white border-[var(--ink)]' : 'bg-white text-[var(--ink)] border-[var(--border)] hover:border-[var(--ink)]'}`}
                            >
                                <div className="flex items-center gap-3 font-bold text-[16px]">
                                    <Activity className={showTruth ? 'text-[var(--gold)]' : 'text-[var(--accent)]'} size={24} />
                                    {showTruth
                                        ? '收起真相'
                                        : revealClicks === 0
                                            ? '揭曉真相：誰是偽裝者？'
                                            : `確定要偷看？再按 ${REVEAL_THRESHOLD - revealClicks} 次`
                                    }
                                </div>
                                {showTruth
                                    ? <ChevronUp size={20} />
                                    : <div className="flex gap-1">
                                        {Array.from({ length: REVEAL_THRESHOLD }).map((_, i) => (
                                            <div
                                                key={i}
                                                className={`w-2 h-2 rounded-full transition-colors ${i < revealClicks ? 'bg-[var(--accent)]' : 'bg-[var(--border)]'}`}
                                            />
                                        ))}
                                    </div>
                                }
                            </button>

                            {showTruth && (
                                <div className="animate-in slide-in-from-top-2 duration-500 flex flex-col gap-4">
                                    <div className="border-2 border-[var(--success)]/20 bg-white rounded-lg overflow-hidden">
                                        <div className="p-3 px-4 bg-[var(--success-light)] border-b border-[var(--success)]/10 text-[13px] font-bold text-[var(--success)] flex items-center gap-2">
                                            <CheckCircle2 size={16} /> 答案揭曉：AI 是 7 號
                                        </div>
                                        <div className="p-5 text-[13px] text-[var(--ink-mid)] leading-[1.8] space-y-3">
                                            <p>7 號是老師<strong>特意叫 AI 生成</strong>的——Prompt 只有一句：「請用高中生的口吻寫一段對研究課的想像與期待。」</p>
                                            <p>AI 可以隨心所欲地模仿任何語氣。它之所以能騙過你，不是因為 AI 太強，而是因為——<strong>很多人平常寫東西就很空泛</strong>。沒有個人細節、沒有具體場景、沒有自己的話，AI 隨便寫就能混進去。</p>
                                            <p>換句話說：<strong>如果你寫得跟 AI 一樣，那你的存在感在哪？</strong></p>
                                        </div>
                                    </div>

                                    <div className="p-4 rounded-[var(--radius-unified)] bg-[var(--danger-light)] border border-[var(--danger)]/20 text-[13px] text-[var(--ink-mid)] leading-relaxed">
                                        💡 這就是為什麼這門課要求誠實標註 AI 的使用——不是不准用，而是你要讓人看得出來「你」在哪裡。
                                    </div>

                                    <ThinkRecord
                                        dataKey="w1-imitation-reaction"
                                        prompt="知道真相後，你的反應是？（震驚？早就知道？還是覺得 AI 根本不難分辨？）"
                                        placeholder="例如：我超震驚，因為我一開始選的是…"
                                        scaffold={['我的反應是…', '我原本以為…', '這讓我覺得…']}
                                        rows={3}
                                    />
                                </div>
                            )}
                        </div>
                    ),
                },

                /* ──────── Step 3: AI-RED 公約 ──────── */
                {
                    title: 'AI-RED 公約',
                    icon: '🛡️',
                    content: (
                        <div className="flex flex-col gap-6 prose-zh">
                            <div>
                                <div className="text-[10px] font-mono text-[var(--ink-light)] uppercase tracking-[0.1em] mb-2">PART 2 · 簽署誠信公約</div>
                                <h3 className="font-serif text-[20px] font-bold text-[var(--ink)] mb-3">AI-RED：五步驟協作框架</h3>
                                <p className="text-[14px] text-[var(--ink-mid)] leading-relaxed">
                                    這門課你可以用 AI——但必須遵守 AI-RED。不是為了老師，而是為了確認「你」還存在。
                                </p>
                            </div>

                            {/* AI-RED 五格 */}
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-[1px] bg-[var(--border)] border border-[var(--border)] rounded-[var(--radius-unified)] overflow-hidden">
                                {AIRED_STEPS.map(step => (
                                    <div key={step.letter} className="p-4 bg-white">
                                        <div className="text-[22px] font-bold font-mono mb-1 text-[var(--accent)]">{step.letter}</div>
                                        <div className="text-[13px] font-bold text-[var(--ink)] mb-0.5">{step.label}</div>
                                        <div className="text-[11px] text-[var(--ink-light)] mb-2">{step.chinese}</div>
                                        <p className="text-[11px] text-[var(--ink-mid)] leading-relaxed">{step.desc}</p>
                                    </div>
                                ))}
                            </div>

                            {/* 人機分工 */}
                            <div className="text-[10px] font-mono text-[var(--ink-light)] uppercase tracking-[0.1em]">人機分工</div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-[1px] bg-[var(--border)] border border-[var(--border)] rounded-[var(--radius-unified)] overflow-hidden">
                                <div className="bg-white">
                                    <div className="p-3 px-4 bg-[var(--paper-warm)] border-b border-[var(--border)] flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="text-base">🧠</span>
                                            <span className="font-bold text-[var(--ink)] text-[13px]">人類負責</span>
                                        </div>
                                        <span className="text-[10px] font-mono text-[var(--accent)]">大腦</span>
                                    </div>
                                    <div className="divide-y divide-[var(--border)]">
                                        {['決定想研究什麼（問題意識）', '設計蒐集資料的方式', '解讀數據背後的意義'].map((item, i) => (
                                            <div key={i} className="p-3 px-4 flex items-start gap-2.5 text-[13px] text-[var(--ink-mid)]">
                                                <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] mt-[7px] shrink-0" />
                                                {item}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="bg-white">
                                    <div className="p-3 px-4 bg-[var(--paper-warm)] border-b border-[var(--border)] flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="text-base">⚙️</span>
                                            <span className="font-bold text-[var(--ink)] text-[13px]">AI 負責</span>
                                        </div>
                                        <span className="text-[10px] font-mono text-[var(--ink-light)]">手腳</span>
                                    </div>
                                    <div className="divide-y divide-[var(--border)]">
                                        {['快速分類大量文字', '計算比例與統計', '整理與格式化結果'].map((item, i) => (
                                            <div key={i} className="p-3 px-4 flex items-start gap-2.5 text-[13px] text-[var(--ink-mid)]">
                                                <div className="w-1.5 h-1.5 rounded-full bg-[var(--ink-light)] mt-[7px] shrink-0" />
                                                {item}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="p-3 rounded-[var(--radius-unified)] bg-[var(--accent-light)] border border-[var(--accent)]/15 text-[13px] text-[var(--ink-mid)]">
                                💡 <strong>結論：</strong>我是大腦（提問與解讀），AI 是手腳（運算）。缺一不可——但方向永遠由人來定。
                            </div>

                            <ThinkChoice
                                prompt="理解檢核：以下哪一項是「人類」該做的事？"
                                options={[
                                    { label: 'A', text: '把 300 份問卷的答案分類統計' },
                                    { label: 'B', text: '決定問卷要問哪些問題' },
                                    { label: 'C', text: '把文字整理成表格' },
                                ]}
                                answer="B"
                                feedback="「問什麼」是研究的方向——只有人能決定。分類統計和整理格式是 AI 的強項。記住：大腦定方向，手腳做執行。"
                                onAnswer={(selected, correct) => trackChoice('人類該做的事', selected, correct)}
                            />

                            <ThinkRecord
                                dataKey="w1-aired-hard"
                                prompt="AI-RED 五個步驟裡，你覺得哪一個最難遵守？為什麼？"
                                placeholder="例如：我覺得 R（引用標註）最難，因為我常常懶得去查 AI 說的對不對…"
                                scaffold={['我覺得___最難', '因為在實際使用時…', '我可能會…']}
                                rows={3}
                            />
                        </div>
                    ),
                },

                /* ──────── Step 4: 課堂活動 ──────── */
                {
                    title: '課堂活動',
                    icon: '🤝',
                    content: (
                        <div className="flex flex-col gap-6 prose-zh">
                            <div>
                                <div className="text-[10px] font-mono text-[var(--ink-light)] uppercase tracking-[0.1em] mb-2">PART 3 · 現場實驗：人機協作</div>
                                <h3 className="font-serif text-[20px] font-bold text-[var(--ink)] mb-3">觀察老師示範一次真正的研究流程</h3>
                                <p className="text-[14px] text-[var(--ink-mid)] leading-relaxed">
                                    老師會現場用 AI 協助做一個迷你研究，你的任務是<strong>觀察並記錄</strong>：哪些步驟是人做的、哪些是 AI 做的。
                                </p>
                            </div>

                            {/* 三件 AI 做不到的事 */}
                            <div className="text-[10px] font-mono text-[var(--ink-light)] uppercase tracking-[0.1em]">這學期要練的三件 AI 做不到的事</div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                {[
                                    { icon: '👅', title: '品味', en: 'Taste', desc: 'AI 沒有好奇心。我們要學問好問題——不是 AI 叫你問的問題，而是你真正想知道的。', next: '→ W2–W3 練這個' },
                                    { icon: '🤝', title: '接觸', en: 'Touch', desc: 'AI 沒有身體。我們要學拿到真實數據——去現場、去問人、去觀察。', next: '→ W4–W10 練這個' },
                                    { icon: '⚖️', title: '判斷', en: 'Judgment', desc: 'AI 會胡說八道。我們要學批判思考——對數字和結論都要追問「這合理嗎？」', next: '→ W14–W16 練這個' }
                                ].map((skill, i) => (
                                    <div key={i} className="bg-white border border-[var(--border)] rounded-[var(--radius-unified)] overflow-hidden flex flex-col">
                                        <div className="p-5 pb-0">
                                            <div className="text-[28px] mb-3">{skill.icon}</div>
                                            <h4 className="font-serif text-[16px] font-bold text-[var(--ink)]">{skill.title}</h4>
                                            <div className="text-[10px] font-mono text-[var(--ink-light)] uppercase mb-3">{skill.en}</div>
                                            <p className="text-[12px] text-[var(--ink-mid)] leading-[1.65] mb-4">{skill.desc}</p>
                                        </div>
                                        <div className="p-3 px-5 bg-[var(--paper)] border-t border-[var(--border)] text-[10px] font-mono text-[var(--accent)] tracking-[0.05em]">
                                            {skill.next}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <ThinkRecord
                                dataKey="w1-human-ai-observe"
                                prompt="觀察老師的示範後，寫下你注意到的：哪些步驟是人做的？哪些是 AI 做的？有什麼讓你意外的嗎？"
                                placeholder="例如：老師自己決定了研究問題，但讓 AI 幫忙整理文獻清單。意外的是…"
                                scaffold={['人做的：…', 'AI 做的：…', '讓我意外的是…']}
                                rows={4}
                            />

                            <ThinkRecord
                                dataKey="w1-self-expect"
                                prompt="經過今天的課，你對這學期的自己有什麼期許？"
                                placeholder="一句話就好。例如：我希望學會自己找答案，而不是什麼都問 AI…"
                                scaffold={['這學期我希望…', '我想學會…']}
                                rows={2}
                            />
                        </div>
                    ),
                },

                /* ──────── Step 5: 回顧與繳交 ──────── */
                {
                    title: '回顧與繳交',
                    icon: '📋',
                    content: (
                        <div className="flex flex-col gap-6 prose-zh">
                            <div>
                                <div className="text-[10px] font-mono text-[var(--ink-light)] uppercase tracking-[0.1em] mb-2">WRAP-UP</div>
                                <h3 className="font-serif text-[20px] font-bold text-[var(--ink)] mb-3">本週結束，你應該要會</h3>
                            </div>

                            <div className="bg-white border border-[var(--border)] rounded-[var(--radius-unified)] overflow-hidden">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-[1px] bg-[var(--border)]">
                                    {[
                                        '說出為什麼「看不出來」反而讓誠實更重要',
                                        '用自己的話解釋 AI-RED 每個字母的意思',
                                        '說明人與 AI 在研究中各自負責什麼',
                                        '寫下一個讓你好奇的生活現象（下週要帶來）'
                                    ].map((item, i) => (
                                        <div key={i} className="p-4 px-5 bg-white flex items-start gap-3">
                                            <span className="text-[var(--success)] mt-0.5">✓</span>
                                            <span className="text-[13px] text-[var(--ink-mid)]">{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                                                        {/* AIRED 敘事紀錄（循序漸進：五欄 → 一段話） */}
                            <AIREDNarrative week="1" hint="這週你和 AI 玩模仿遊戲" />

                            {/* 一鍵複製 */}
                            <ExportButton
                                weekLabel="W1 模仿遊戲"
                                fields={EXPORT_FIELDS}
                                choices={choiceResults}
                            />

                            <div className="p-3 rounded-[var(--radius-unified)] bg-[var(--success-light)] border border-[var(--success)]/20 text-[13px] text-[var(--ink-mid)]">
                                📤 複製後，打開 Google Classroom 貼上繳交即可。
                            </div>

                            {/* 遊戲預告 */}
                            <div className="border border-[var(--border)] rounded-[var(--radius-unified)] overflow-hidden bg-[var(--ink)]">
                                <div className="p-5 text-center">
                                    <div className="text-[10px] font-mono text-[var(--ink-light)] uppercase tracking-[0.15em] mb-2">R.I.B. 探員系統</div>
                                    <p className="text-[14px] text-white/80 leading-relaxed">
                                        從下週開始，每次學完新技能，你的<strong className="text-white">探員檔案</strong>就會解鎖一個任務。<br />
                                        做得越好，軍階越高。先去看看你的檔案 👇
                                    </p>
                                    <Link
                                        to="/dossier"
                                        className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 bg-white/10 hover:bg-white/15 text-white text-[13px] font-bold rounded-[8px] transition-colors"
                                    >
                                        查看探員檔案 <ArrowRight size={14} />
                                    </Link>
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
                                        <p className="next-week-text"><strong className="text-white">你在 Step 1 寫的生活觀察</strong>——那就是你研究題目的起點。沒有帶，W2 的課你會跟不上。</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ),
                },

            ]} />
        </div>
    );
};
