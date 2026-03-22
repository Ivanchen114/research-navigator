import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FileText, AlertTriangle, CheckCircle,
    RotateCcw, ChevronRight, Lock
} from 'lucide-react';

// ─── localStorage key 常數 ───────────────────────────────────────────────────
const STORAGE_KEYS = {
    agentName:   'rib_agent_name',
    ch1Optimal:  'phantom_ch1_optimal',
    ch2Complete: 'phantom_ch2_complete',
    ch2Optimal:  'phantom_ch2_optimal',
};

// ─── 失敗原因資料 ────────────────────────────────────────────────────────────
const FAIL_REASONS = {
    n1_A: {
        type: '訪談中止：誘導性問句引發警覺',
        detail: '「讓數據分析更有效率」這個措辭暗示你已經知道有某種工具存在——一個普通的新生不會問得這麼有針對性。林志遠的眼神微微一變，接下來的回答從自然陳述變成了謹慎的套話。訪談法的第一句話就決定了整場對話能走多深——誘導性的措辭讓受訪者感覺到你「帶著目的來」，而這會同時影響回答的真實性，乃至對方的配合意願。',
        concept: '訪談法核心：誘導性問句（Leading Question）破壞回答的真實性，且可能直接中止訪談',
        retryPhase: 'scene1',
    },
    n1_C: {
        type: '訪談中止：封閉式問句限制資訊產出',
        detail: '「問卷還是訪談？」讓林志遠只能二選一。他回答「問卷吧」，然後就沒了——沒有細節、沒有背景、沒有你真正需要的東西。封閉式問句把一扇可能敞開的門，提前關上了。訪談變成問答，而非對話。',
        concept: '訪談法核心：封閉式問句（Closed Question）限制受訪者陳述空間，應改用開放式問法',
        retryPhase: 'scene1',
    },
    n2_C: {
        type: '訪談中止：隱性對質破壞信任關係',
        detail: '語氣聽起來像是在「釐清」，但「你剛才說……」這個句型讓林志遠意識到你一直在追蹤他的每一句話。他開始謹慎衡量每個字，接下來說什麼都像在「對帳」，回答越來越短。訪談中的矛盾要讓對方自己補充說明，而不是提醒他「你說過什麼」——前者是傾聽，後者讓人感覺被監視。',
        concept: '訪談法核心：追問技巧——釐清矛盾時保持中立語氣，而非帶有指責意味的對質',
        retryPhase: 'scene2',
    },
    n3_B: {
        type: '訪談中止：完全欺騙違反知情同意原則',
        detail: '「純粹好奇的轉學生」——這個謊言讓訪談繼續了，但代價是：你取得的任何資訊都不能算是在「受訪者知情且自願」的狀態下提供的。這份訪談資料的倫理基礎從這一刻開始動搖。研究倫理的底線不是不能有秘密，而是不能主動製造假象。',
        concept: '訪談法核心：知情同意原則（Informed Consent）——研究者不得對受訪者主動製造虛假情境',
        retryPhase: 'scene3',
    },
    n3_C: {
        type: '訪談中止：過早揭露導致資訊封鎖',
        detail: '林志遠沉默了幾秒，然後說：「我不知道你在說什麼，也沒什麼好說的。」隨後離開。這是調查中最常見的錯誤之一——在對方建立足夠信任之前暴露調查意圖，反而讓對方完全關閉。你得到的資訊量：零。',
        concept: '訪談法核心：信任建立（Rapport）是深度訪談的前提，揭露意圖需要時機判斷',
        retryPhase: 'scene3',
    },
};

// ─── 主元件 ─────────────────────────────────────────────────────────────────
export const PhantomCh2 = () => {
    const navigate = useNavigate();
    const [phase, setPhase] = useState('briefing');
    const [failKey, setFailKey] = useState(null);
    const [foundContradiction, setFoundContradiction] = useState(false);
    const [agentName, setAgentName] = useState('探員');
    const [hadCh1Optimal, setHadCh1Optimal] = useState(false);

    useEffect(() => {
        const name = localStorage.getItem(STORAGE_KEYS.agentName);
        if (name) setAgentName(name);
        setHadCh1Optimal(!!localStorage.getItem(STORAGE_KEYS.ch1Optimal));
        window.scrollTo(0, 0);
    }, [phase]);

    const fail = (key) => { setFailKey(key); setPhase('fail'); };

    const complete = (hasContradiction) => {
        localStorage.setItem(STORAGE_KEYS.ch2Complete, 'true');
        if (hasContradiction) localStorage.setItem(STORAGE_KEYS.ch2Optimal, 'true');
        setPhase('complete');
    };

    const retry = () => {
        const target = failKey ? (FAIL_REASONS[failKey].retryPhase || 'briefing') : 'briefing';
        if (target === 'scene1' || target === 'briefing') setFoundContradiction(false);
        setPhase(target);
        setFailKey(null);
    };

    // ── 選項處理 ──────────────────────────────────────────────────────────────
    const handleChoice1 = (id) => {
        if (id === 'A') return fail('n1_A');
        if (id === 'C') return fail('n1_C');
        setPhase('scene2');
    };

    const handleChoice2 = (id) => {
        if (id === 'C') return fail('n2_C');
        setFoundContradiction(id === 'B');
        setPhase('scene3');
    };

    const handleChoice3 = (id) => {
        if (id === 'B') return fail('n3_B');
        if (id === 'C') return fail('n3_C');
        complete(foundContradiction);
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">

            {/* ── 頂部導覽 ────────────────────────────────────────────────── */}
            <div className="sticky top-0 z-10 border-b border-slate-800 bg-slate-900/90 backdrop-blur px-6 py-3 flex items-center gap-2 text-xs font-mono">
                <button onClick={() => navigate('/phantom')} className="text-slate-500 hover:text-violet-400 transition-colors">
                    R.I.B. 調查檔案
                </button>
                <span className="text-slate-700">/</span>
                <span className="text-violet-400/70">幽靈數據</span>
                <span className="text-slate-700">/</span>
                <span className="text-slate-300">第二章｜線人接觸</span>
                <span className="ml-auto text-slate-600">{agentName}</span>
            </div>

            <div className="max-w-2xl mx-auto px-6 py-12">

                {/* ══ 任務簡報 ══════════════════════════════════════════════ */}
                {phase === 'briefing' && (
                    <div>
                        <ChapterLabel num="02" method="訪談法" />
                        <h1 className="text-3xl font-black text-white mb-6">線人接觸</h1>

                        {/* 前章線索繼承 */}
                        <div className="bg-slate-900/60 border border-slate-700/50 rounded p-4 mb-5 space-y-1.5">
                            <div className="font-mono text-xs text-slate-500 tracking-widest mb-2">◈ 來自第一章的線索</div>
                            <EvidenceItem text="C3：規律性左右張望，行為模式符合「操作後確認周圍狀況」的特徵" />
                            {hadCh1Optimal
                                ? <EvidenceItem text="C1：雙螢幕操作，使用含「研究問題、圖表輸出、結論草稿」的不明研究介面" highlight />
                                : <div className="flex items-center gap-2 text-slate-600 text-xs py-1.5 px-3"><Lock size={11} /><span>C1 詳細線索未取得（第一章最優路徑可解鎖）</span></div>
                            }
                        </div>

                        <div className="bg-slate-900 border border-slate-700 rounded p-6 mb-5 space-y-4">
                            <SectionLabel icon={<FileText size={13} />} text="任務簡報" />
                            <p className="text-slate-300 leading-relaxed text-sm">
                                根據第一章的觀察紀錄，總部鎖定了一名知情可能性最高的對象——研究組長 <strong className="text-slate-100">林志遠</strong>。他在班上擁有相當的信任度，也是最可能掌握工具傳播路徑的人。
                            </p>
                            <p className="text-slate-300 leading-relaxed text-sm">
                                你的任務是以非正式談話的方式進行訪談，在不引發警覺的前提下取得關鍵資訊。
                            </p>
                            <div className="grid grid-cols-3 gap-4 border-t border-slate-700 pt-4 text-xs">
                                <MiniStat label="地點" value="走廊 / 非正式場合" />
                                <MiniStat label="身份掩護" value="對研究方法有興趣的新生" />
                                <MiniStat label="任務限制" value="不得主動揭露調查目的" />
                            </div>
                        </div>

                        <div className="bg-violet-950/20 border border-violet-700/30 rounded p-4 mb-8 text-xs text-violet-300/80 leading-relaxed">
                            <strong className="text-violet-400">訪談法的核心規則：</strong>用開放式問題讓對方自由陳述，追問時保持中立語氣，不引導、不對質。你的角色是傾聽者，不是審訊者。
                        </div>

                        <PrimaryButton onClick={() => setPhase('scene1')} label="開始接觸" />
                    </div>
                )}

                {/* ══ 情境一 ════════════════════════════════════════════════ */}
                {phase === 'scene1' && (
                    <SceneBlock
                        time="放學後，走廊"
                        content={
                            <>
                                <p className="text-slate-300 leading-relaxed text-sm mb-4">
                                    你在走廊遇到了林志遠。他一個人，手上拿著一疊資料，看起來剛從教室出來。
                                </p>
                                <p className="text-slate-300 leading-relaxed text-sm mb-4">
                                    你上前打招呼，說自己是新生，最近在研究「高中生怎麼做研究」，想順便請教他幾個問題。他停下來，點了點頭。
                                </p>
                                <p className="text-slate-300 leading-relaxed text-sm">
                                    訪談的第一句話，決定了這整場對話的走向。
                                </p>
                            </>
                        }
                        actionLabel="開口發問"
                        onAction={() => setPhase('choice1')}
                    />
                )}

                {/* ══ 決策一 ════════════════════════════════════════════════ */}
                {phase === 'choice1' && (
                    <ChoiceBlock
                        nodeNum="01"
                        directive="以開放式問法讓對方自由陳述，不引導方向"
                        question="你的第一個問題是——"
                        choices={[
                            {
                                id: 'A',
                                text: '「聽說現在蠻多同學做研究都有在用一些輔助工具，讓數據分析更有效率——你平常在整理研究資料的時候，大概都用什麼方式？」',
                            },
                            {
                                id: 'B',
                                text: '「你好，我對高中生怎麼進行研究蒐集比較有興趣，你平常的研究流程大概是怎麼樣的？」',
                            },
                            {
                                id: 'C',
                                text: '「你做研究的時候，比較習慣用問卷蒐集資料，還是訪談？」',
                            },
                        ]}
                        onChoice={handleChoice1}
                    />
                )}

                {/* ══ 情境二 ════════════════════════════════════════════════ */}
                {phase === 'scene2' && (
                    <SceneBlock
                        time="訪談進行中"
                        content={
                            <>
                                <p className="text-slate-300 leading-relaxed text-sm mb-4">
                                    林志遠開始描述他的研究流程。他說得很流暢，從問題設定講到資料分析，看起來是有在認真做研究的人。
                                </p>
                                <p className="text-slate-300 leading-relaxed text-sm mb-4">
                                    說到一半，他提到：「我們班有些人喜歡用工具讓研究更有效率……不過我個人都是自己來，沒用什麼特別的東西。」
                                </p>
                                <p className="text-slate-300 leading-relaxed text-sm mb-4">
                                    但幾句話之後，他又說：「反正圖表那些，軟體都可以直接輸出，很方便。」
                                </p>
                                <p className="text-slate-400 leading-relaxed text-xs border-l-2 border-slate-700 pl-3 italic">
                                    剛才說沒用特別的工具——但「圖表可以直接輸出」這句話，不太像是在講 Excel。
                                </p>
                            </>
                        }
                        actionLabel="決定怎麼回應"
                        onAction={() => setPhase('choice2')}
                    />
                )}

                {/* ══ 決策二 ════════════════════════════════════════════════ */}
                {phase === 'choice2' && (
                    <ChoiceBlock
                        nodeNum="02"
                        directive="矛盾資訊是線索，追問時保持語氣自然、不帶指責"
                        question="林志遠說沒用特別工具，但又說「圖表可以直接輸出，很方便」。你怎麼回應？"
                        choices={[
                            {
                                id: 'A',
                                text: '繼續聽他說，點頭回應，不特別追問。',
                            },
                            {
                                id: 'B',
                                text: '「你說的『直接輸出』是什麼軟體？是一般的 Excel，還是有用到其他工具？」',
                            },
                            {
                                id: 'C',
                                text: '「所以你剛才說的『直接輸出』，用一般軟體也可以做到對嗎？我想再多了解一下——因為你前面有提到沒用什麼特別的東西。」',
                            },
                        ]}
                        onChoice={handleChoice2}
                    />
                )}

                {/* ══ 情境三 ════════════════════════════════════════════════ */}
                {phase === 'scene3' && (
                    <SceneBlock
                        time="訪談接近尾聲"
                        content={
                            <>
                                <p className="text-slate-300 leading-relaxed text-sm mb-4">
                                    訪談進行得比預期順利。林志遠說了不少，你也記下了幾個值得追查的細節。
                                </p>
                                <p className="text-slate-300 leading-relaxed text-sm mb-4">
                                    就在你準備收尾的時候，他突然停下來，用一種不確定的眼神看著你：
                                </p>
                                <p className="text-slate-200 leading-relaxed text-sm font-medium mb-4 border-l-2 border-violet-700/50 pl-3">
                                    「你說你是新生？但你問的問題感覺不太像只是對研究有興趣……你到底是誰？」
                                </p>
                                <p className="text-slate-500 text-xs italic">
                                    他沒有離開，但眼神在等一個回答。
                                </p>
                            </>
                        }
                        actionLabel="給他一個回答"
                        onAction={() => setPhase('choice3')}
                    />
                )}

                {/* ══ 決策三 ════════════════════════════════════════════════ */}
                {phase === 'choice3' && (
                    <ChoiceBlock
                        nodeNum="03"
                        directive="不完全欺騙，但也不完全揭露——尊重對方的決定權"
                        question="林志遠在等你的回答。你說——"
                        choices={[
                            {
                                id: 'A',
                                text: '「我對這個議題確實有特別的關注，不只是普通好奇。你如果覺得不舒服，我們可以就此打住，不用繼續。」',
                            },
                            {
                                id: 'B',
                                text: '「沒有啦，我真的只是轉學生，純粹對研究方法好奇，沒有其他原因。」',
                            },
                            {
                                id: 'C',
                                text: '「好，我承認——我在調查校內疑似流通的數據偽造工具，懷疑你可能知情。」',
                            },
                        ]}
                        onChoice={handleChoice3}
                    />
                )}

                {/* ══ 任務失敗 ══════════════════════════════════════════════ */}
                {phase === 'fail' && failKey && (() => {
                    const r = FAIL_REASONS[failKey];
                    return (
                        <div>
                            <div className="bg-red-950/30 border border-red-700/40 rounded p-6 mb-5">
                                <SectionLabel icon={<AlertTriangle size={13} />} text="任務中止報告" color="text-red-400" />
                                <h2 className="text-lg font-black text-red-300 mt-3 mb-4">{r.type}</h2>
                                <p className="text-slate-300 text-sm leading-relaxed mb-5">{r.detail}</p>
                                <div className="border-t border-red-700/20 pt-4">
                                    <span className="font-mono text-xs text-red-400/60">{r.concept}</span>
                                </div>
                            </div>
                            <button
                                onClick={retry}
                                className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-black py-4 rounded transition-all flex items-center justify-center gap-2 text-sm"
                            >
                                <RotateCcw size={15} /> 重新執行任務
                            </button>
                        </div>
                    );
                })()}

                {/* ══ 任務完成 ══════════════════════════════════════════════ */}
                {phase === 'complete' && (
                    <div>
                        <div className="bg-emerald-950/20 border border-emerald-700/30 rounded p-6 mb-5">
                            <SectionLabel icon={<CheckCircle size={13} />} text="任務完成" color="text-emerald-400" />
                            <h2 className="text-xl font-black text-emerald-300 mt-3 mb-4">訪談任務成功</h2>
                            <p className="text-slate-300 text-sm leading-relaxed mb-6">
                                你在不觸發對方防衛機制的情況下完成了訪談。開放式問題讓林志遠自由陳述，你也在過程中保持了中立的傾聽姿態，並在最後給予了他足夠的知情空間。這份訪談紀錄具有可信度，可進入下一步追查。
                            </p>

                            <div className="border-t border-emerald-700/20 pt-5">
                                <div className="font-mono text-xs text-emerald-500/70 tracking-widest mb-3">證據碎片已入庫</div>
                                <div className="space-y-2">
                                    <EvidenceItem text="林志遠知悉某個讓研究「更有效率」的工具，刻意以模糊語言迴避直接說明" />
                                    <EvidenceItem text="林志遠確認班上「有些人」在使用該工具，並非孤立案例" />
                                    {foundContradiction
                                        ? <EvidenceItem text="追問後確認工具具備「圖表直接輸出」功能——與第一章 C1 操作介面的功能描述吻合" highlight />
                                        : (
                                            <div className="flex items-center gap-2 text-slate-600 text-xs py-2 px-3">
                                                <Lock size={12} />
                                                <span>工具功能細節未追問（重試可解鎖完整線索）</span>
                                            </div>
                                        )
                                    }
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-900/60 border border-slate-800 rounded p-4 mb-5 text-xs text-slate-500 font-mono">
                            第三章｜問卷法：擴散追查 — 已解鎖
                        </div>

                        <PrimaryButton onClick={() => navigate('/phantom')} label="返回調查檔案" />
                    </div>
                )}

            </div>
        </div>
    );
};

// ─── 共用小元件 ──────────────────────────────────────────────────────────────

const ChapterLabel = ({ num, method }) => (
    <div className="flex items-center gap-3 mb-3">
        <span className="text-slate-600 font-mono text-xs">第 {num} 章</span>
        <span className="text-slate-700 text-xs">·</span>
        <span className="text-violet-400 font-mono text-xs">{method}</span>
    </div>
);

const SectionLabel = ({ icon, text, color = 'text-amber-500' }) => (
    <div className={`flex items-center gap-2 font-mono text-xs tracking-widest ${color}`}>
        {icon} {text}
    </div>
);

const MiniStat = ({ label, value }) => (
    <div>
        <div className="text-slate-600 mb-1">{label}</div>
        <div className="text-slate-200 font-mono text-xs">{value}</div>
    </div>
);

const PrimaryButton = ({ onClick, label }) => (
    <button
        onClick={onClick}
        className="w-full bg-amber-600 hover:bg-amber-500 text-slate-950 font-black py-4 rounded transition-all flex items-center justify-center gap-2 text-sm"
    >
        {label} <ChevronRight size={16} />
    </button>
);

const SceneBlock = ({ time, content, actionLabel, onAction }) => (
    <div>
        <div className="font-mono text-violet-600/60 text-xs tracking-widest mb-4">{time}</div>
        <div className="bg-slate-900 border border-slate-700 rounded p-6 mb-8">
            {content}
        </div>
        <button
            onClick={onAction}
            className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-black py-4 rounded transition-all flex items-center justify-center gap-2 text-sm"
        >
            {actionLabel} <ChevronRight size={16} />
        </button>
    </div>
);

const ChoiceBlock = ({ nodeNum, question, choices, onChoice, directive }) => (
    <div>
        <div className="font-mono text-violet-600/60 text-xs tracking-widest mb-2">決策節點 {nodeNum}</div>
        {directive && (
            <div className="text-[10px] font-mono text-slate-600 tracking-widest mb-4 flex items-center gap-2">
                <span className="text-slate-700">◈</span> 行動守則：{directive}
            </div>
        )}
        <h2 className="text-base font-black text-white mb-6">{question}</h2>
        <div className="space-y-3">
            {choices.map(c => (
                <button
                    key={c.id}
                    onClick={() => onChoice(c.id)}
                    className="w-full text-left bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-violet-600/40 rounded p-5 transition-all group"
                >
                    <div className="flex items-start gap-3">
                        <span className="font-mono text-violet-400 font-bold text-sm flex-shrink-0 mt-0.5 w-4">{c.id}</span>
                        <span className="text-slate-300 text-sm leading-relaxed group-hover:text-white transition-colors">{c.text}</span>
                    </div>
                </button>
            ))}
        </div>
    </div>
);

const EvidenceItem = ({ text, highlight }) => (
    <div className={`flex items-start gap-2 text-xs py-2 px-3 rounded-sm ${highlight ? 'bg-emerald-900/20 text-emerald-300' : 'text-slate-400'}`}>
        <span className={`flex-shrink-0 mt-0.5 ${highlight ? 'text-emerald-400' : 'text-slate-600'}`}>◆</span>
        <span>{text}</span>
    </div>
);
