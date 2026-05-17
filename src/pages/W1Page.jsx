import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import CourseArc from '../components/ui/CourseArc';
import ThinkRecord from '../components/ui/ThinkRecord';
import ThinkChoice from '../components/ui/ThinkChoice';
import StepEngine from '../components/ui/StepEngine';
import HeroBlock from '../components/ui/HeroBlock';
import TaskCard from '../components/ui/TaskCard';
import ResetWeekButton from '../components/ui/ResetWeekButton';
import SignatureBlock from '../components/ui/SignatureBlock';
import StepBriefing from '../components/ui/StepBriefing';
import {
    CheckCircle2,
    ArrowRight,
    ChevronUp,
    Map,
    Activity,
} from 'lucide-react';
import LessonMap from '../components/ui/LessonMap';
import { W1Data } from '../data/lessonMaps';
import { ModeProvider, useMode } from '../context/ModeContext';
import { useProjector } from '../context/ProjectorContext';
import ModeSwitch from '../components/ui/ModeSwitch';
import DepthBlock from '../components/ui/DepthBlock';
import RecordDrawer from '../components/ui/RecordDrawer';
import ExportButton from '../components/ui/ExportButton';
import ContentTypeChip from '../components/ui/ContentTypeChip';

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

/* ── 自學補課用：模擬學生回答包（10 筆，問題：「你認為做研究是什麼？」）
 *   由老師示範段使用，讓自學生可以把這包貼進 AI 自己跑一遍 AI-RED 流程
 */
const MOCK_RESEARCH_VIEWS = [
    { id: 1, text: '研究就是查資料，整理成報告交給老師。' },
    { id: 2, text: '我覺得研究是問一個問題，然後想辦法找到答案。不一定要做實驗，查文章也算。' },
    { id: 3, text: '研究是要設計實驗，蒐集數據，然後做統計分析，看結果有沒有意義。' },
    { id: 4, text: '研究就是用比較嚴謹的方式去証明一件事是真的還是假的。' },
    { id: 5, text: '做研究就是要觀察你感興趣的現象，把你看到的記錄下來，最後說你發現了什麼。' },
    { id: 6, text: '我覺得研究是一個解決問題的過程，要先找到問題，再想辦法去解決它。' },
    { id: 7, text: '研究對我來說就是找資料、做問卷、跑 SPSS，感覺很難。' },
    { id: 8, text: '研究是用系統化的方式去探索你不知道的事情，而且要能讓別人重複你做的步驟。' },
    { id: 9, text: '就是寫小論文吧？查一堆資料然後整理成一篇文章。' },
    { id: 10, text: '研究是你對某件事有好奇心，然後去找證據驗證你的猜測是對還是錯。' },
];

const AIRED_STEPS = [
    { letter: 'A', label: 'Ascribe', chinese: '標明工具', desc: '我用了哪個 AI 工具？用它做什麼事？' },
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
    { key: 'w1-aired-pledge', label: 'AI-RED 協作公約 · 我親手簽下的五字承諾', question: '對 A/I/R/E/D 五字各選一條我能做到的承諾，並簽下姓名' },
    { key: 'w1-human-ai-observe', label: '人機協作觀察筆記', question: '觀察老師示範後，哪些步驟是人做的？哪些是 AI 做的？' },
    { key: 'w1-self-expect', label: '對自己的期許', question: '經過今天的課，你對這學期的自己有什麼期許？' },
];

/* ── 主組件 ── */

const W1PageContent = () => {
    const { mode } = useMode();
    const { projector } = useProjector();
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
                    <ResetWeekButton weekPrefix="w1-" />
                    <button
                        onClick={() => setShowLessonMap(!showLessonMap)}
                        className="text-[11px] text-[#8888aa] hover:text-[#2d5be3] transition-colors flex items-center gap-1 font-mono"
                    >
                        <Map size={12} /> <span className="hidden md:inline">{showLessonMap ? '收起流程' : '教師流程'}</span>
                    </button>
                </div>
            </div>

            {showLessonMap && (
                <div className="animate-in slide-in-from-top-4 duration-300">
                    <LessonMap data={W1Data} />
                </div>
            )}

            {/* PAGE HEADER — Hero Block（第一屏只留三句，spec §6-1）*/}
            <HeroBlock
                kicker="R.I.B. 調查檔案 · 研究方法與專題 · W1"
                question="一段看起來像研究的文字，憑什麼相信？"
                title="模仿遊戲："
                accentTitle="我寫→我猜→我怕→我簽"
                todo={[
                    { label: '今天做什麼', value: '找出 7 份自述裡的 AI 偽裝者，簽下 AI-RED 誠信公約。' },
                    { label: '為什麼做', value: 'AI 時代你交出的東西要「真的是你做的」，這是 18 週研究的地基。' },
                    { label: '今天交什麼', value: 'W1 學習紀錄上傳 Classroom（含 AI-RED 公約簽署）。' },
                ]}
                chain="這是研究課的第一堂——先不急著做研究，先知道 AI 時代你跟 AI 的分工邊界是什麼，再簽下 18 週的合作公約。"
                meta={[
                  { label: '第一節', value: '模仿遊戲——找出 7 份自述中的 AI 偽裝者 + 討論判斷標準' },
                  { label: '第二節', value: 'AI-RED 誠信公約簽署 + 不能外包三件事 + 生活觀察種子' },
                  { label: '課堂產出', value: 'W1 學習紀錄（含 AI-RED 公約簽署）' },
                  { label: '前置要求', value: '無（第一週，帶著好奇心來就夠了）' },
                ]}
            />

            {/* 三模式切換 */}
            <ModeSwitch />

            {/* 自學補課路線 — 只在自學模式顯示（spec §5）*/}
            {mode === 'self-study' && (
                <div className="my-5 rounded-[var(--radius-unified)] border-2 border-[#0284C7] bg-[#F0F9FF] p-4 md:p-5">
                    <p className="text-[14px] font-bold text-[#075985] mb-1">📖 自學補課路線 · W1 可「部分自學」</p>
                    <p className="text-[11.5px] text-[#0C4A6E] leading-[1.7] mb-3">
                        模仿遊戲、AI-RED 五字、簽公約、看現場示範說明、寫生活觀察種子都能自學；模仿遊戲的小組討論、Step 4 老師現場人機協作示範是課堂活動。
                    </p>
                    <ol className="text-[12px] text-[#0C4A6E] leading-[1.85] list-none m-0 p-0 space-y-1">
                        <li><strong>① 先看：</strong>Step 2 模仿遊戲（7 份自述）＋ Step 3 AI-RED 五字與人機分工</li>
                        <li><strong>② 做：</strong>Step 2 寫推理理由、Step 3 簽 AI-RED 公約、Step 4 讀現場示範說明、Step 5 寫生活觀察種子</li>
                        <li><strong>③ 補紀錄：</strong>研究經驗／模仿遊戲推理＋揭曉反應／公約簽署／人機協作觀察／對自己的期許／生活觀察種子</li>
                        <li><strong>④ 交：</strong>整理 W1 學習紀錄，依老師指定方式上傳到 Google Classroom</li>
                        <li><strong>⑤ 需要找人：</strong>模仿遊戲的小組討論、Step 4 老師現場人機協作示範是課堂活動，自學看頁面說明補</li>
                    </ol>
                    <div className="mt-3 pt-3 border-t border-[#0284C7]/30">
                        <p className="text-[12px] font-bold text-[#075985] mb-1">⛑️ 最低完成版（缺課學生：至少做到這些才算補到核心）</p>
                        <p className="text-[11.5px] text-[#0C4A6E] leading-[1.85] m-0">
                            ① 完成模仿遊戲推理（選號＋理由）　② 簽署 AI-RED 公約　③ 寫生活觀察種子（W2 要用，必填）　④ 整理 W1 紀錄上傳 Classroom
                        </p>
                    </div>
                </div>
            )}

            {/* 我的紀錄抽屜 — 兩模式都能開（spec §3 方案 A：總覽＋匯出，input 留 Step）*/}
            <RecordDrawer
                weekLabel="W1 模仿遊戲"
                fields={EXPORT_FIELDS}
                choices={choiceResults}
            />

            {/* R.I.B. 說明 + 為什麼是這週 + 本週資訊 — 深度補充 */}

            <CourseArc items={W1Data.courseArc} />

            <TaskCard
                weekNumber="W1"
                weekTitle={W1Data.title}
                duration={`${W1Data.duration} 分鐘 · ${W1Data.durationDesc}`}
                tasks={[
                    'AI-RED 協作公約 — 五字逐條承諾、親手簽下名字',
                    '不能外包的三件事 — 認識品味、接觸、判斷三大研究責任',
                    '生活觀察種子 — 寫下一個讓你好奇的生活現象（W2 要用）',
                ]}
                exportReminder="匯出 W1 紀錄（含你簽署的 AI-RED 公約） → 之後每週匯出都會自動帶上"
            />

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
                                    不管你有沒有做過研究，這門課都從零開始。先回答一個問題，讓老師認識你。
                                </p>
                            </div>

                            <StepBriefing
                                lines={[
                                    { label: '做', text: '寫下你做過研究或報告的經驗（沒做過寫「沒有」也行）' },
                                ]}
                            />

                            <div className="flex items-center gap-2 mb-1">
                                <ContentTypeChip type="練" />
                                <p className="text-[12px] font-bold text-[var(--ink-mid)]">暖身紀錄</p>
                            </div>
                            <ThinkRecord
                                dataKey="w1-research-exp"
                                prompt="你做過「研究」嗎？不管是科展、小論文、還是自己查資料解決問題——說說你的經驗（沒有也OK，寫「沒有」就好）"
                                placeholder="例如：國小做過科展，主題是…／完全沒有，但我對…有興趣"
                                scaffold={['我做過/沒做過…', '主題是…', '過程中我學到…']}
                                rows={3}
                            />

                            <div className="p-3 rounded-[var(--radius-unified)] bg-[var(--paper-warm)] border border-dashed border-[var(--border)] text-[12.5px] text-[var(--ink-light)] leading-relaxed">
                                💡 暖身就這一題。「生活觀察種子」（你下週 W2 要用的）會放在第 5 步——讓你經歷今天的所有刺激（模仿遊戲、AI-RED、人機協作）後再寫，比現在硬擠出來品質更好。
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

                            <StepBriefing
                                lines={[
                                    { label: '做', text: '閱讀 7 份回答，找出 AI 寫的那份，寫下判斷理由' },
                                ]}
                            />

                            <div className="p-3 rounded-[var(--radius-unified)] bg-[var(--gold-light)] border border-[var(--gold)]/20 text-[13px] text-[var(--ink-mid)]">
                                先自己判斷，再小組討論。不要直接說答案——要說出<strong>你的理由</strong>。
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {SUSPECTS.map(s => (
                                    <div key={s.id} className="border border-[var(--border)] rounded-lg overflow-hidden flex flex-col">
                                        <div className="p-3 px-4 bg-[var(--paper)] border-b border-[var(--border)] text-[11px] font-mono text-[var(--ink-light)]">
                                            偽裝者 #{s.id}
                                        </div>
                                        <div className="p-4 text-[13px] text-[var(--ink-mid)] leading-relaxed flex-1 bg-white">
                                            <div dangerouslySetInnerHTML={{ __html: s.content.replace(/\n/g, '<br/>').replace(/想像：/g, '<strong>想像：</strong>').replace(/期待：/g, '<strong>期待：</strong>') }} />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="flex items-center gap-2 mb-1">
                                <ContentTypeChip type="做" />
                                <p className="text-[12px] font-bold text-[var(--ink-mid)]">推理紀錄</p>
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
                                            : `小組討論完再揭曉，再按 ${REVEAL_THRESHOLD - revealClicks} 次解鎖`
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
                                            <p>AI 能寫出很合理、很像人的文字。<strong>真正值得追問的不是「像不像人」</strong>，而是：這些細節從哪裡來？有沒有真實經驗或證據支撐？說這段話的人，願不願意為它負責？所以這門課不是要你寫得不像 AI，而是要你<strong>說得出：哪些內容是你真的看見、查過、想過，並願意負責的</strong>。</p>
                                            <p>換句話說：<strong>如果你寫得跟 AI 一樣，你跟 AI 寫的差別在哪？</strong></p>
                                        </div>
                                    </div>

                                    <div className="p-4 rounded-[var(--radius-unified)] bg-[var(--danger-light)] border border-[var(--danger)]/20 text-[13px] text-[var(--ink-mid)] leading-relaxed">
                                        💡 這就是為什麼這門課要求誠實標註 AI 的使用——不是不准用，而是你要讓人看得出來「你」在哪裡。
                                    </div>

                                    <div className="flex items-center gap-2 mb-1">
                                        <ContentTypeChip type="做" />
                                        <p className="text-[12px] font-bold text-[var(--ink-mid)]">揭曉後紀錄</p>
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
                                    這門課你可以用 AI——但必須遵守 AI-RED。不是為了讓老師抓你，而是為了讓你自己分得清：<strong>哪些是 AI 幫的，哪些是你判斷後決定留下的</strong>。
                                </p>
                            </div>

                            <StepBriefing
                                lines={[
                                    { label: '學', text: 'AI-RED 五個字的意義（Reliable / Ethical / Documented…）' },
                                    { label: '做', text: '為每個字選一條承諾，親手簽名' },
                                ]}
                            />

                            {/* AI-RED 五格 */}
                            <div className="flex items-center gap-2 mb-2">
                                <ContentTypeChip type="學" />
                                <p className="text-[13px] font-bold text-[var(--ink)]">AI-RED 五個字的意義</p>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-[1px] bg-[var(--border)] border border-[var(--border)] rounded-[var(--radius-unified)] overflow-hidden">
                                {AIRED_STEPS.map(step => (
                                    <div key={step.letter} className="p-4 bg-white">
                                        <div className="text-[22px] font-bold font-mono mb-1 text-[var(--accent)]">{step.letter}</div>
                                        <div className="text-[13px] font-bold text-[var(--ink)] mb-0.5">{step.label}</div>
                                        <div className="text-[11px] text-[var(--ink-light)] mb-2">{step.chinese}</div>
                                        <p className="text-[11px] text-[var(--ink-mid)] leading-relaxed">{step.desc}</p>
                                    </div>
                                ))}
                            </div>

                            {/* 人機分工雙欄 — 完整說明，深度補充（結論卡留在外面）*/}
                            <DepthBlock title="人機分工說明">
                            <div className="text-[10px] font-mono text-[var(--ink-light)] uppercase tracking-[0.1em] mb-2">人機分工</div>
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
                                            <span className="font-bold text-[var(--ink)] text-[13px]">AI 協助</span>
                                        </div>
                                        <span className="text-[10px] font-mono text-[var(--ink-light)]">輔助</span>
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
                            </DepthBlock>

                            <div className="p-3 rounded-[var(--radius-unified)] bg-[var(--accent-light)] border border-[var(--accent)]/15 text-[13px] text-[var(--ink-mid)]">
                                💡 <strong>結論：</strong>人負責方向、判準與解讀；AI 協助整理、分類與產生草稿。能不能採用，最後仍由人判斷。
                            </div>

                            <ThinkChoice
                                dataKey="w1-tc1"
                                prompt="理解檢核：以下哪一項是「人類」該做的事？"
                                options={[
                                    { label: 'A', text: '把 300 份問卷的答案分類統計' },
                                    { label: 'B', text: '決定問卷要問哪些問題' },
                                    { label: 'C', text: '把文字整理成表格' },
                                ]}
                                answer="B"
                                feedback="「問什麼」是研究的方向——只有人能決定。分類統計和整理格式是 AI 的強項。記住：方向由人定，整理交給 AI。"
                                onAnswer={(selected, correct) => trackChoice('人類該做的事', selected, correct)}
                            />

                            {/* AI-RED 五字承諾 + 親手簽署（取代舊版「最難遵守的一條」反思題） */}
                            <div className="flex items-center gap-2 mb-2">
                                <ContentTypeChip type="交出" />
                                <p className="text-[13px] font-bold text-[var(--ink)]">AI-RED 協作公約 · 親手簽署</p>
                            </div>
                            <SignatureBlock />
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
                                <h3 className="font-serif text-[20px] font-bold text-[var(--ink)] mb-3">
                                    {mode === 'self-study' ? '自學版：用模擬資料自己跑一遍 AI-RED' : '老師現場做一個關於「你們」的研究'}
                                </h3>
                                <p className="text-[14px] text-[var(--ink-mid)] leading-relaxed">
                                    {mode === 'self-study'
                                        ? '這個環節在課堂上是老師即時示範——你現在看到的是自學替代版。下面有一包 10 筆「模擬同學回答」，你來扮演老師的角色：把資料貼進 AI，用 Prompt 範本跑一遍，最後比對 AI 的歸納和原始資料有什麼落差。'
                                        : '5 分鐘後，我們會用 AI 知道高一同學眼中的「研究」是什麼樣子——而資料就來自你們剛剛填的表單。你的任務不只是觀察，你就是研究參與者。'
                                    }
                                </p>
                            </div>

                            <StepBriefing
                                lines={mode === 'self-study' ? [
                                    { label: '做', text: '把下方模擬資料貼進 AI，用提示詞範本分析' },
                                    { label: '練', text: '比對 AI 歸納與原始 10 筆，找出 AI 省略或美化的地方' },
                                    { label: '記', text: '寫下：人做了哪些步驟、AI 做了什麼、哪裡讓你意外' },
                                ] : [
                                    { label: '看', text: '觀察老師示範：填表 → 貼提示詞 → 讀 AI 歸納' },
                                    { label: '學', text: '看 AI-RED 五字如何對應剛才的每個動作' },
                                    { label: '記', text: '寫下你觀察到的：人做了什麼、AI 做了什麼' },
                                ]}
                            />

                            {/* ── 自學替代版 ── */}
                            {mode === 'self-study' && (
                                <div className="flex flex-col gap-5">
                                    {/* 模擬資料包 */}
                                    <div className="rounded-[var(--radius-unified)] border border-[var(--border)] overflow-hidden">
                                        <div className="px-4 py-3 bg-[var(--paper-warm)] border-b border-[var(--border)] flex items-center gap-2">
                                            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--ink-light)]">自學版 · 模擬資料包</span>
                                            <span className="text-[12px] font-bold text-[var(--ink)]">「你認為做研究是什麼？」— 10 筆模擬同學回答</span>
                                        </div>
                                        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-2">
                                            {MOCK_RESEARCH_VIEWS.map(v => (
                                                <div key={v.id} className="flex items-start gap-2.5 bg-white border border-[var(--border)] rounded-[8px] p-3">
                                                    <span className="text-[10px] font-mono font-bold text-[var(--ink-light)] shrink-0 mt-0.5">#{v.id}</span>
                                                    <span className="text-[12.5px] text-[var(--ink-mid)] leading-[1.65]">{v.text}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* 步驟說明 */}
                                    <div className="flex flex-col gap-3">
                                        {[
                                            { n: '①', t: '複製上面的 Prompt 範本', d: '展開下方「看完整範例」，複製那段 Prompt（角色 + 任務 + 分類定義 + 步驟 + 資料佔位符）。' },
                                            { n: '②', t: '把 10 筆資料貼進去', d: '把上方 10 筆回答，替換 Prompt 末尾「[貼上學生回答]」的位置，整段貼到 ChatGPT / Claude / Gemini。' },
                                            { n: '③', t: '等 AI 回覆，比對原始資料', d: 'AI 會給你分類結果和歸納。回來對照 10 筆原始回答：AI 有沒有把哪筆歸錯？有沒有省略某種聲音？美化了什麼？' },
                                            { n: '④', t: '填下方觀察紀錄', d: '把你比對後的發現寫進「人機協作觀察紀錄」，重點是：人做了什麼、AI 做了什麼、AI 的歸納漏了什麼。' },
                                        ].map(s => (
                                            <div key={s.n} className="flex items-start gap-3 bg-[var(--accent-light)] border border-[var(--accent)]/20 rounded-[8px] p-3">
                                                <span className="shrink-0 w-7 h-7 flex items-center justify-center rounded-full font-mono font-bold text-[13px] text-white bg-[var(--accent)]">{s.n}</span>
                                                <div>
                                                    <div className="font-bold text-[13px] text-[var(--ink)] mb-0.5">{s.t}</div>
                                                    <div className="text-[12px] text-[var(--ink-mid)] leading-[1.65]">{s.d}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* ── 課堂版：第 1-2 步（現場填表 + QR）── */}
                            {mode !== 'self-study' && (
                                <>
                                <div className="border border-[var(--accent)]/30 rounded-[var(--radius-unified)] overflow-hidden">
                                    <div className="p-3 px-4 bg-[var(--accent-light)] border-b border-[var(--accent)]/20 flex items-center gap-2 flex-wrap">
                                        <span className="text-[10px] font-mono uppercase tracking-[0.1em] text-[var(--accent)] font-bold">現場示範 · 第 1 步</span>
                                        <span className="text-[11px] text-[var(--ink-light)]">問題意識 (Problem Consciousness)</span>
                                    </div>
                                    <div className="p-5 bg-white">
                                        <p className="text-[15px] font-serif text-[var(--ink)] leading-[1.7] mb-3">
                                            「松山高中一年級學生認為的『研究』，是偏向<strong className="text-[var(--accent)]">『工具操作型』</strong>還是<strong className="text-[var(--accent)]">『思維探究型』</strong>？」
                                        </p>
                                        <p className="text-[12px] text-[var(--ink-mid)] italic mb-3">
                                            因為我想知道，這會影響我的教學設計。
                                        </p>
                                        <div className="p-3 rounded-[6px] bg-[var(--paper)] text-[11.5px] text-[var(--ink-light)] leading-[1.7]">
                                            💡「工具操作型／思維探究型」只是老師今天這個示範研究用的分類，<strong>不代表你的想法好壞</strong>——誠實寫就好。
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4 rounded-[var(--radius-unified)] bg-[var(--success-light)] border border-[var(--success)]/30">
                                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                                        <span className="text-[10px] font-mono uppercase tracking-[0.1em] text-[var(--success)] font-bold">現場示範 · 第 2 步</span>
                                        <span className="text-[11px] text-[var(--ink-light)]">資料蒐集（你就是樣本）</span>
                                    </div>
                                    <p className="text-[13px] text-[var(--ink-mid)] leading-[1.75] mb-3">
                                        掃 QR Code 或點連結，5 分鐘內填寫「<strong>你認為做研究是什麼？</strong>」——一句話就好，不用學術。
                                    </p>
                                    <div className="flex items-center gap-5 flex-wrap mb-3">
                                        <img
                                            src="https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=https://forms.gle/Hw2saiLWLR8HwGBH6&margin=4"
                                            alt="Google 表單 QR Code"
                                            className="w-[100px] h-[100px] rounded-[8px] border border-[var(--border)]"
                                        />
                                        <div className="flex flex-col gap-2">
                                            <a
                                                href="https://forms.gle/Hw2saiLWLR8HwGBH6"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[var(--radius-unified)] bg-[var(--success)] text-white text-[13px] font-bold hover:opacity-90 transition-opacity"
                                            >
                                                📋 開啟 Google 表單
                                            </a>
                                            <span className="text-[11px] text-[var(--ink-light)] font-mono">forms.gle/Hw2saiLWLR8HwGBH6</span>
                                        </div>
                                    </div>
                                </div>
                                </>
                            )}

                            {/* 現場示範流程 · 第 3 步：提示詞範本 */}
                            <div className="border border-[var(--border)] rounded-[var(--radius-unified)] overflow-hidden">
                                <div className="p-3 px-4 bg-[var(--ink)] text-white flex items-center gap-2 flex-wrap">
                                    <span className="text-[10px] font-mono uppercase tracking-[0.1em] font-bold">現場示範 · 第 3 步</span>
                                    <span className="text-[11px] text-white/70">提示詞範本（這就是 AI-RED 的 I — Inquire）</span>
                                </div>
                                <pre className="p-5 bg-[#0f1419] text-[12.5px] font-mono text-[#fbbf24] leading-[1.85] overflow-x-auto whitespace-pre-wrap m-0">{`你是一位資深教育研究員。
我想了解高一學生對「研究」的認知。
以下是 N 位學生對「你認為做研究是什麼」的回答。

請幫我：
1. 將這些回答分類為「工具操作型」
   （認為研究=找資料、做問卷、跑數據）
   和「思維探究型」
   （認為研究=思考、發現問題、解釋現象）
2. 統計各類型的比例
3. 列出代表性的回答範例
4. 歸納前 5 大主題

資料如下：
[貼上學生回答]`}</pre>
                                <div className="p-3 px-5 bg-[var(--paper)] border-t border-[var(--border)] text-[11.5px] text-[var(--ink-light)] leading-[1.7]">
                                    💡 注意提示詞的結構：<strong>角色 + 任務 + 分類定義 + 步驟編號 + 資料</strong>。這樣問，AI 才知道要用什麼資料、做什麼分析、輸出什麼結果——<strong>重點不是把提示詞寫漂亮，是把研究任務說清楚</strong>。W2 開始會反覆練這個。
                                </div>
                            </div>

                            {/* 現場示範流程 · 第 4 步：Evaluate 揭穿 */}
                            <div className="p-4 rounded-[var(--radius-unified)] bg-[var(--danger-light)] border border-[var(--danger)]/25">
                                <div className="flex items-center gap-2 mb-2 flex-wrap">
                                    <span className="text-[10px] font-mono uppercase tracking-[0.1em] text-[var(--danger)] font-bold">現場示範 · 第 4 步</span>
                                    <span className="text-[11px] text-[var(--ink-light)]">回頭比對 AI 的歸納（這是 AI-RED 的 E）</span>
                                </div>
                                <p className="text-[13px] text-[var(--ink-mid)] leading-[1.75]">
                                    AI 會給出漂亮歸納——但<strong>它可能跳過了什麼？</strong>老師會回頭比對原始資料，找出 AI <strong>美化或省略</strong>的地方。例如，AI 通常會把「研究是被老師逼著做的事」這種負面回答歸到「其他」，或乾脆不提。
                                </p>
                                <p className="text-[12px] text-[var(--ink-light)] mt-2 italic leading-[1.75]">
                                    ⚠️ 這就是這門課的關鍵時刻——<strong>AI 給的歸納漂亮 ≠ 正確</strong>。你要回頭比對原始資料。
                                </p>
                            </div>

                            {/* AI-RED 情境回顧 — 示範剛結束，用剛才的流程串連五個字 */}
                            <div className="rounded-[var(--radius-unified)] border-2 border-[var(--accent)]/40 bg-[var(--accent-light)] p-4">
                                <p className="text-[11px] font-mono uppercase tracking-[0.1em] text-[var(--accent)] font-bold mb-2">
                                    {mode === 'self-study' ? '你剛才自己跑的流程，其實已經走完了一次 AI-RED' : '剛才老師的示範，其實已經走完了一次 AI-RED'}
                                </p>
                                <div className="flex flex-col gap-2">
                                    {(mode === 'self-study' ? [
                                        { letter: 'A', text: '你說：「我用 ChatGPT / Claude 把這 10 筆回答分類」——這是在標明工具和用途' },
                                        { letter: 'I', text: '你貼進去的 Prompt 問 AI：「請把這些回答分成幾種研究觀念」——這是提問紀錄' },
                                        { letter: 'R', text: 'AI 給出分類結果，你要對照 10 筆原始回答確認有沒有分對——這是引用標註' },
                                        { letter: 'E', text: '你發現 AI 把某幾筆歸錯或省略，自己判斷後記下落差——這是評估判斷' },
                                        { letter: 'D', text: '你在觀察紀錄裡寫：「AI 協助分類，最終判斷由我做」——這是歷程記錄' },
                                    ] : [
                                        { letter: 'A', text: '老師說：「我用 Gemini 把你們的回答分類」——這是在標明工具和用途' },
                                        { letter: 'I', text: '老師問 AI 的問題是：「請把這些回答分成幾種研究觀念」——這是提問紀錄' },
                                        { letter: 'R', text: 'AI 給出分類結果，老師要對照你們的原始回答確認有沒有分對——這是引用標註' },
                                        { letter: 'E', text: '老師發現 AI 把某幾份歸錯類，自己判斷後調整——這是評估判斷' },
                                        { letter: 'D', text: '老師在研究紀錄裡寫：「AI 協助分類，最終判斷由我做」——這是歷程記錄' },
                                    ]).map(({ letter, text }) => (
                                        <div key={letter} className="flex items-start gap-3">
                                            <span className="shrink-0 w-6 h-6 flex items-center justify-center rounded font-mono font-bold text-[13px] text-white bg-[var(--accent)]">{letter}</span>
                                            <p className="text-[12.5px] text-[var(--ink-mid)] leading-[1.75] m-0">{text}</p>
                                        </div>
                                    ))}
                                </div>
                                <p className="text-[11.5px] text-[var(--ink-light)] mt-3 italic">這五個動作，就是你這學期每次用 AI 都要做的事。</p>
                            </div>

                            {/* 30 秒 vs 18 週 轉折 */}
                            <div className="p-6 rounded-[var(--radius-unified)] bg-[var(--ink)] text-white text-center">
                                <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-[var(--gold)] mb-3">轉折：你應該會有的疑問</div>
                                <h4 className="font-serif font-bold leading-[1.55] mb-3 text-headline">
                                    如果 AI 只要 <span className="text-[var(--gold)]">30 秒</span> 就能做完分析，<br />
                                    那我們為什麼要花 <span className="text-[var(--gold)]">18 週</span> 上這門課？
                                </h4>
                                <p className="text-[13px] text-white/70">
                                    答案就在下面三張卡。
                                </p>
                            </div>

                            {/* 不能外包的三件事 */}
                            <div className="flex items-center gap-2 mb-2">
                                <ContentTypeChip type="學" />
                                <p className="text-[13px] font-bold text-[var(--ink)]">這學期你不能外包的三件事</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                {[
                                    { icon: '👅', title: '品味', en: 'Taste', desc: 'AI 可以幫你列問題，但不能替你決定哪個問題值得研究。你要學會分辨：我真正想知道的是什麼？', next: '→ W2–W3 練這個' },
                                    { icon: '🤝', title: '接觸', en: 'Touch', desc: 'AI 可以整理資料，但不能替你親自觀察、訪問、蒐集證據。研究要碰到真實世界。', next: '→ W4–W10 練這個' },
                                    { icon: '⚖️', title: '判斷', en: 'Judgment', desc: 'AI 會胡說八道，也可能產生錯誤、偏誤，或把資料整理得太漂亮。你要回頭檢查：這個數字合理嗎？這個結論有證據嗎？', next: '→ W14–W16 練這個' }
                                ].map((skill, i) => (
                                    <div key={i} className="bg-white border border-[var(--border)] rounded-[var(--radius-unified)] overflow-hidden flex flex-col">
                                        <div className="p-5 pb-0">
                                            <div className="text-[28px] mb-3">{skill.icon}</div>
                                            <h4 className="font-serif font-bold text-[var(--ink)] text-display">{skill.title}</h4>
                                            <div className="text-[10px] font-mono text-[var(--ink-light)] uppercase mb-3">{skill.en}</div>
                                            <p className="text-[12px] text-[var(--ink-mid)] leading-[1.65] mb-4">{skill.desc}</p>
                                        </div>
                                        <div className="p-3 px-5 bg-[var(--paper)] border-t border-[var(--border)] text-[10px] font-mono text-[var(--accent)] tracking-[0.05em]">
                                            {skill.next}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* 收尾標語 */}
                            <div className="p-5 rounded-[var(--radius-unified)] bg-[var(--gold-light)] border-2 border-[var(--gold)]/30 text-center">
                                <p className="font-serif text-[28px] text-[var(--ink)] font-bold leading-[1.55]">
                                    AI 不會自己想做研究，<br />
                                    <span className="text-[var(--accent)]">起點永遠是人的好奇心。</span>
                                </p>
                            </div>

                            <div className="flex items-center gap-2 mb-1">
                                <ContentTypeChip type="做" />
                                <p className="text-[12px] font-bold text-[var(--ink-mid)]">人機協作觀察紀錄</p>
                            </div>
                            <ThinkRecord
                                dataKey="w1-human-ai-observe"
                                prompt={mode === 'self-study'
                                    ? '跑完自學版分析後，寫下你注意到的：人做了哪些步驟？AI 做了什麼？哪個地方讓你意外？'
                                    : '觀察老師的示範後，寫下你注意到的：哪些步驟是人做的？哪些是 AI 做的？有什麼讓你意外的嗎？'}
                                placeholder="例如：老師自己決定了研究問題，但讓 AI 幫忙整理和分類。意外的是…"
                                scaffold={['人做的：…', 'AI 做的：…', '讓我意外的是…']}
                                rows={4}
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
                            <StepBriefing
                                lines={[
                                    { label: '做', text: '寫下一個讓你有感的生活現象——這是 W2 的研究種子' },
                                ]}
                            />

                            <div className="bg-white border border-[var(--border)] rounded-[var(--radius-unified)] overflow-hidden">
                                <div className="p-4 px-5 bg-[var(--paper-warm)] border-b border-[var(--border)] font-bold text-[13px]">
                                    ✅ 本週結束，你應該要會
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-[1px] bg-[var(--border)]">
                                    {[
                                        '說出為什麼「看不出來」反而讓誠實更重要',
                                        '用自己的話解釋 AI-RED 每個字母的意思',
                                        '說明人與 AI 在研究中各自負責什麼',
                                        '寫下一個讓你好奇的生活現象（下週要帶來）',
                                    ].map((item, i) => (
                                        <div key={i} className="p-4 px-5 bg-white flex items-start gap-3">
                                            <span className="text-[var(--success)] text-[16px] mt-0.5 flex-shrink-0">✓</span>
                                            <span className="text-[13px] text-[var(--ink-mid)] leading-relaxed">{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* 🪞 對自己的期許（從 Step 4 搬來——課程結束後再反思，比課堂活動中途填更自然） */}
                            <div className="flex items-center gap-2 mb-1">
                                <ContentTypeChip type="做" />
                                <p className="text-[12px] font-bold text-[var(--ink-mid)]">對自己的期許</p>
                            </div>
                            <ThinkRecord
                                dataKey="w1-self-expect"
                                prompt="經過今天的課，你對這學期的自己有什麼期許？"
                                placeholder="一句話就好。例如：我希望學會自己找答案，而不是什麼都問 AI…"
                                scaffold={['這學期我希望…', '我想學會…']}
                                rows={2}
                            />

                            {/* 🌱 生活觀察種子（從 Step 1 搬到此處——讓學生經歷完整課程後再寫） */}
                            <div className="p-5 rounded-[var(--radius-unified)] bg-[var(--success-light)] border-2 border-[var(--success)]/30">
                                <div className="flex items-center gap-2 mb-2">
                                    <ContentTypeChip type="做" />
                                    <p className="text-[13px] font-bold text-[var(--success)]">🌱 你下週 W2 的種子——現在再寫，比上課一開始更有感</p>
                                </div>
                                <p className="text-[12.5px] text-[var(--ink-mid)] leading-relaxed mb-3">
                                    如果一上課就要你寫「你好奇什麼」，腦袋多半是空的——這很正常。
                                    但現在你經歷了模仿遊戲（看到 AI 多強）、AI-RED 公約（誠實是底線）、現場研究示範（人做判斷、AI 做歸納）——
                                    你已經有「研究者的眼睛」可以借用一下了。
                                    現在寫下你最近真的有感覺的一個現象，不用學術。
                                </p>
                                <ThinkRecord
                                    dataKey="w1-life-observe"
                                    prompt="我觀察到一個讓我覺得「奇怪」「不合理」或「好想知道為什麼」的現象……"
                                    placeholder="例如：每天經過學校福利社，明明有賣便當但幾乎沒人買，大家都跑去全家——奇怪的是，全家比較貴。"
                                    scaffold={[
                                        '在（地點/時間），我注意到…',
                                        '奇怪的是…（對比、矛盾、反直覺）',
                                        '我想知道…（不要急著問為什麼，先描述你想搞清楚的事）',
                                    ]}
                                    rows={4}
                                />
                                <p className="text-[11px] text-[var(--ink-light)] mt-2 italic">
                                    💡 這個觀察下週 W2 一進教室就會自動帶入——老師會帶你把它變成正式的研究問題。
                                </p>
                            </div>

                            {/* 一鍵複製繳交 */}
                            <div className="bg-[#EFF6FF] border-2 border-[#1E40AF] rounded-[var(--radius-unified)] p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <ContentTypeChip type="交出" />
                                    <span className="text-[10px] font-mono font-bold bg-[#1E40AF] text-white px-2 py-0.5 rounded-[3px] uppercase tracking-wider">📤 最後一步</span>
                                    <span className="text-[14px] font-bold text-[#1E40AF]">複製 W1 學習紀錄 → 貼 Google Classroom</span>
                                </div>
                                <p className="text-[12px] text-[#1E3A8A] leading-relaxed mb-3">
                                    包含：R.I.B. 公約選擇／我的研究期待／好奇清單／AI 輔助紀錄（如有）。
                                </p>
                                <ExportButton
                                    weekLabel="W1 探索定題"
                                    fields={EXPORT_FIELDS}
                                    buttonText="複製 W1 學習紀錄"
                                />
                            </div>

                            {/* 遊戲預告 */}
                            <div className="border border-[var(--border)] rounded-[var(--radius-unified)] overflow-hidden bg-[var(--ink)]">
                                <div className="p-5 text-center">
                                    <div className="text-[10px] font-mono text-[var(--ink-light)] uppercase tracking-[0.15em] mb-2">R.I.B. 探員系統</div>
                                    <p className="text-[14px] text-white/80 leading-relaxed">
                                        從下週開始，每次學完新技能，你的<strong className="text-white">探員檔案</strong>會累積<strong className="text-white">軍階紀錄與研究技能足跡</strong>。<br />
                                        <span className="text-white/60 text-[12px]">這不是排名、也不算成績——是讓你看見自己這學期做過哪些研究練習。</span>
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
                                        <p className="next-week-text"><strong className="text-white">你在 Step 5 寫的生活觀察</strong>——那就是你研究題目的起點。有帶來，W2 會更好上手。</p>
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

export const W1Page = () => (
    <ModeProvider week="W1">
        <W1PageContent />
    </ModeProvider>
);
