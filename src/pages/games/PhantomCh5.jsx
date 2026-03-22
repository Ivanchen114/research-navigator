import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FileText, AlertTriangle, CheckCircle,
    RotateCcw, ChevronRight, Lock, ShieldCheck
} from 'lucide-react';

const STORAGE_KEYS = {
    agentName:   'rib_agent_name',
    ch4Optimal:  'phantom_ch4_optimal',
    ch5Complete: 'phantom_ch5_complete',
    ch5Optimal:  'phantom_ch5_optimal',
};

const FAIL_REASONS = {
    n1_A: {
        type: '任務中止：缺乏對照組，實驗無法成立',
        detail: '「目標明確」不代表實驗設計正確。把工具生成的數據拿去比對報告數據，即使兩者相似，你仍然無法排除一個替代解釋：「也許真實的問卷數據本來就長這樣」。對照組的作用正是提供一個基準，讓你能說「工具數據和真實數據有差異」，而不只是「工具數據和報告數據很像」。沒有對照組，你驗證的只是相似性，而不是異常性。',
        concept: '實驗法核心：對照組（Control Group）——沒有對照就無法排除替代解釋',
        retryPhase: 'scene1',
    },
    n1_C: {
        type: '任務中止：對照組設計存在根本缺陷',
        detail: '你自己手動輸入的「正常數據」，是你根據自己對正常數據的理解設計的——這組數據本身就帶有你的主觀判斷。這樣的對照組不是「真實的對照」，而是「你期望工具數據不同於的那種數據」。對照組必須來自真實的獨立來源，不能由研究者自行設計。',
        concept: '實驗法核心：對照組的獨立性——對照組資料不得由研究者主觀設計',
        retryPhase: 'scene1',
    },
    n2_A: {
        type: '任務中止：操縱實驗結果以符合假設',
        detail: '為了讓輸出結果更接近報告數據而調整參數——這不是科學，這是倒果為因。你不是在測試工具能不能生成假數據，而是在倒推「如果是真的，它應該長什麼樣」。這樣的操作讓實驗喪失了獨立性，你的結論從這一刻起就無效了。',
        concept: '實驗法核心：研究誠信——不得調整實驗以符合預期結果，這是最嚴重的研究不誠信行為之一',
        retryPhase: 'scene2',
    },
    n2_C: {
        type: '任務中止：放棄有價值的差異發現',
        detail: '15% 的差異不是失敗，是一個發現。它可能代表工具有不同版本，或使用者有不同的參數設定。真正的實驗很少第一次就完美復現——差異本身往往比完全吻合更有科學價值。放棄這組數據，等於扔掉了可能是最重要的線索。',
        concept: '實驗法核心：異常結果的價值——意料之外的發現往往是研究突破的起點，不應輕易放棄',
        retryPhase: 'scene2',
    },
    n3_B: {
        type: '任務中止：在報告中揭露個人可識別資訊',
        detail: '班級加學號，在有限的學生群體中幾乎等於直接點名。即使這份報告只在學校內流通，在未取得當事人同意的情況下公開可識別的個人資訊，違反了基本的個人資料保護原則。「研究需要說服力」不構成違反個資法規的理由。',
        concept: '研究倫理核心：個人資料保護——研究對象的可識別資訊必須匿名化，說服力不能以侵犯隱私換取',
        retryPhase: 'scene3',
    },
    n3_C: {
        type: '任務中止：過度自我審查導致報告失去說服力',
        detail: '代號已經足夠保護當事人的隱私了。把所有涉及具體觀察對象的段落一起刪除，讓報告喪失了最核心的實地佐證——你辛苦蒐集了四章的田野資料，最後全部消失在報告裡。正確的做法是匿名呈現，而不是完全刪除。',
        concept: '研究倫理核心：匿名化（Anonymization）——以代號保護隱私，不等於必須刪除所有案例資料',
        retryPhase: 'scene3',
    },
};

export const PhantomCh5 = () => {
    const navigate = useNavigate();
    const [phase, setPhase] = useState('briefing');
    const [failKey, setFailKey] = useState(null);
    const [foundOptimal, setFoundOptimal] = useState(false);
    const [agentName, setAgentName] = useState('探員');
    const [hadCh4Optimal, setHadCh4Optimal] = useState(false);

    useEffect(() => {
        const name = localStorage.getItem(STORAGE_KEYS.agentName);
        if (name) setAgentName(name);
        setHadCh4Optimal(!!localStorage.getItem(STORAGE_KEYS.ch4Optimal));
        window.scrollTo(0, 0);
    }, [phase]);

    const fail = (key) => { setFailKey(key); setPhase('fail'); };

    const complete = (isOptimal) => {
        localStorage.setItem(STORAGE_KEYS.ch5Complete, 'true');
        if (isOptimal) localStorage.setItem(STORAGE_KEYS.ch5Optimal, 'true');
        setPhase('complete');
    };

    const retry = () => {
        const target = failKey ? (FAIL_REASONS[failKey].retryPhase || 'briefing') : 'briefing';
        if (target === 'scene1' || target === 'briefing') setFoundOptimal(false);
        setPhase(target);
        setFailKey(null);
    };

    const handleChoice1 = (id) => {
        if (id === 'A') return fail('n1_A');
        if (id === 'C') return fail('n1_C');
        setFoundOptimal(true); // 只有 B 能過，foundOptimal=true
        setPhase('scene2');
    };

    const handleChoice2 = (id) => {
        if (id === 'A') return fail('n2_A');
        if (id === 'C') return fail('n2_C');
        setPhase('scene3'); // B 通過
    };

    const handleChoice3 = (id) => {
        if (id === 'B') return fail('n3_B');
        if (id === 'C') return fail('n3_C');
        complete(foundOptimal);
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">

            <div className="sticky top-0 z-10 border-b border-slate-800 bg-slate-900/90 backdrop-blur px-6 py-3 flex items-center gap-2 text-xs font-mono">
                <button onClick={() => navigate('/phantom')} className="text-slate-500 hover:text-rose-400 transition-colors">
                    R.I.B. 調查檔案
                </button>
                <span className="text-slate-700">/</span>
                <span className="text-rose-400/70">幽靈數據</span>
                <span className="text-slate-700">/</span>
                <span className="text-slate-300">第五章｜重現測試</span>
                <span className="ml-auto text-slate-600">{agentName}</span>
            </div>

            <div className="max-w-2xl mx-auto px-6 py-12">

                {phase === 'briefing' && (
                    <div>
                        <ChapterLabel num="05" method="實驗法" />
                        <h1 className="text-3xl font-black text-white mb-6">重現測試</h1>

                        <div className="bg-slate-900/60 border border-slate-700/50 rounded p-4 mb-5 space-y-1.5">
                            <div className="font-mono text-xs text-slate-500 tracking-widest mb-2">◈ 來自前章的線索</div>
                            <EvidenceItem text="競賽提交版本的最後修改時間戳記晚於截止日 72 小時" />
                            {hadCh4Optimal
                                ? <EvidenceItem text="報告數據呈現異常完美的常態分佈，與真實問卷資料的自然分佈有顯著差異——疑似工具生成" highlight />
                                : <div className="flex items-center gap-2 text-slate-600 text-xs py-1.5 px-3"><Lock size={11} /><span>數據分佈異常的詳細分析未取得（第四章最優路徑可解鎖）</span></div>
                            }
                        </div>

                        <div className="bg-slate-900 border border-slate-700 rounded p-6 mb-5 space-y-4">
                            <SectionLabel icon={<FileText size={13} />} text="任務簡報" />
                            <p className="text-slate-300 leading-relaxed text-sm">
                                你已經從四個不同角度蒐集了大量間接證據。現在，你需要最後一塊：直接在實驗室中重現「幽靈數據工具」的運作，確認它能做到報告裡的事。這將是整個調查的最終驗證。
                            </p>
                            <div className="grid grid-cols-3 gap-4 border-t border-slate-700 pt-4 text-xs">
                                <MiniStat label="實驗目標" value="重現工具生成數據的過程" />
                                <MiniStat label="對照基準" value="第三章問卷真實回覆" />
                                <MiniStat label="最終目標" value="建立完整舉證鏈" />
                            </div>
                        </div>

                        <div className="bg-rose-950/20 border border-rose-700/30 rounded p-4 mb-8 text-xs text-rose-300/80 leading-relaxed">
                            <strong className="text-rose-400">實驗法的核心規則：</strong>必須設計對照組；結果如實記錄，不得為符合假設而調整；研究對象的資料必須以符合倫理的方式呈現。
                        </div>

                        <PrimaryButton onClick={() => setPhase('scene1')} label="進入實驗室" />
                    </div>
                )}

                {phase === 'scene1' && (
                    <SceneBlock
                        time="實驗設計階段"
                        content={
                            <>
                                <p className="text-slate-300 leading-relaxed text-sm mb-4">
                                    你取得了那套「幽靈數據工具」的副本。它的介面正如第一章觀察到的那樣——有「研究問題」、「資料整理」、「圖表輸出」、「結論草稿」四個模組。
                                </p>
                                <p className="text-slate-300 leading-relaxed text-sm mb-4">
                                    在實際執行之前，你需要先確定實驗設計。你想比較工具生成的數據和真實問卷數據有什麼不同，但「怎麼比」本身就是一個方法學決定。
                                </p>
                                <p className="text-slate-400 text-xs italic leading-relaxed">
                                    你的第三章還留著 23 份真實問卷回覆。
                                </p>
                            </>
                        }
                        actionLabel="決定實驗設計"
                        onAction={() => setPhase('choice1')}
                    />
                )}

                {phase === 'choice1' && (
                    <ChoiceBlock
                        nodeNum="01"
                        directive="實驗必須有明確的對照基準，才能確認觀察到的差異是真實的"
                        question="你要怎麼設計這個重現實驗？"
                        choices={[
                            { id: 'A', text: '讓工具生成一組數據，直接和第四章取得的報告數據做比對——目標明確：確認工具能否生成這種特徵的數據。' },
                            { id: 'B', text: '設計兩組：實驗組使用工具生成數據，對照組從第三章的 23 份真實問卷隨機抽樣。比較兩組的分佈特徵。' },
                            { id: 'C', text: '自己手動輸入一組「一般正常問卷應有的數據」作為對照，看工具生成的數據和手動輸入的是否有差異。' },
                        ]}
                        onChoice={handleChoice1}
                    />
                )}

                {phase === 'scene2' && (
                    <SceneBlock
                        time="實驗執行，第一輪結果"
                        content={
                            <>
                                <p className="text-slate-300 leading-relaxed text-sm mb-4">
                                    實驗進行完畢。工具確實能夠生成符合指定常態分佈參數的數據，這一點得到了確認。
                                </p>
                                <p className="text-slate-300 leading-relaxed text-sm mb-4">
                                    但對照比較顯示了一個你沒預期到的細節：工具生成的數據，標準差比報告中的數據<strong className="text-rose-300">小了約 15%</strong>。均值接近，但離散程度有系統性差異。
                                </p>
                                <p className="text-slate-400 text-xs italic leading-relaxed border-l-2 border-rose-700/40 pl-3">
                                    這可能代表工具有不同版本，或當年的使用者調整過參數。也可能是其他原因。
                                </p>
                            </>
                        }
                        actionLabel="決定如何處理這個差異"
                        onAction={() => setPhase('choice2')}
                    />
                )}

                {phase === 'choice2' && (
                    <ChoiceBlock
                        nodeNum="02"
                        directive="意料之外的結果是發現，不是失敗——如實記錄比強迫吻合更有科學價值"
                        question="工具生成的數據和報告的數據有 15% 的標準差差異。你怎麼處理？"
                        choices={[
                            { id: 'A', text: '調整工具的參數設定，重新生成，讓輸出結果更接近報告中的分佈，再記錄這個版本的結果。' },
                            { id: 'B', text: '如實記錄這個差異，分析可能的原因（工具版本差異、使用者設定不同），並在報告中完整呈現兩組的所有數值。' },
                            { id: 'C', text: '15% 的差異超過了合理誤差範圍，宣告本次實驗未能成功重現，重新設計實驗方案。' },
                        ]}
                        onChoice={handleChoice2}
                    />
                )}

                {phase === 'scene3' && (
                    <SceneBlock
                        time="最終報告撰寫"
                        content={
                            <>
                                <p className="text-slate-300 leading-relaxed text-sm mb-4">
                                    五週的調查即將收尾。你整理好了所有章節的發現，準備提交最終報告給 R.I.B. 總部。
                                </p>
                                <p className="text-slate-300 leading-relaxed text-sm mb-4">
                                    報告中涉及了多個具體的調查對象：圖書館電腦區的 C1、C3，受訪者林志遠，以及問卷填答者。這些人的資訊如何呈現，是最後一個必須決定的問題。
                                </p>
                                <p className="text-slate-400 text-xs italic leading-relaxed">
                                    這份報告的讀者只有 R.I.B. 總部，但它仍然必須符合研究倫理的基本標準。
                                </p>
                            </>
                        }
                        actionLabel="決定如何呈現調查對象"
                        onAction={() => setPhase('choice3')}
                    />
                )}

                {phase === 'choice3' && (
                    <ChoiceBlock
                        nodeNum="03"
                        directive="保護當事人隱私的方式是匿名化，而不是刪除所有相關記錄"
                        question="報告中的調查對象資訊，你要如何呈現？"
                        choices={[
                            { id: 'A', text: '全程使用代號（C1、C3、受訪者 L）和抽象化描述，不透露任何可識別的個人資訊，但保留所有案例細節。' },
                            { id: 'B', text: '在附錄中列出每位調查對象的班級與學號，讓報告結論更具說服力和可追溯性。' },
                            { id: 'C', text: '為了確保萬無一失，把所有提到具體觀察對象的段落全部刪除，只保留統計數字。' },
                        ]}
                        onChoice={handleChoice3}
                    />
                )}

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
                            <button onClick={retry} className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-black py-4 rounded transition-all flex items-center justify-center gap-2 text-sm">
                                <RotateCcw size={15} /> 重新執行任務
                            </button>
                        </div>
                    );
                })()}

                {phase === 'complete' && (
                    <div>
                        {/* 全案告破 */}
                        <div className="bg-amber-950/20 border border-amber-600/40 rounded p-6 mb-5 text-center">
                            <div className="flex justify-center mb-3">
                                <ShieldCheck size={40} className="text-amber-400" />
                            </div>
                            <div className="font-mono text-xs text-amber-600/80 tracking-[0.4em] mb-2">CASE CLOSED</div>
                            <h2 className="text-2xl font-black text-amber-300 mb-3">全案告破</h2>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                五個章節、五種研究方法、五週時間。你從觀察到訪談，從問卷到文獻，最後在實驗室完成了最終驗證。幽靈數據工具的真相，已經有了完整的調查記錄。
                            </p>
                        </div>

                        <div className="bg-emerald-950/20 border border-emerald-700/30 rounded p-6 mb-5">
                            <SectionLabel icon={<CheckCircle size={13} />} text="第五章任務完成" color="text-emerald-400" />
                            <h2 className="text-xl font-black text-emerald-300 mt-3 mb-4">實驗驗證成功</h2>
                            <p className="text-slate-300 text-sm leading-relaxed mb-6">
                                你設計了嚴謹的對照實驗，如實記錄了預期之外的差異，並以符合倫理的方式呈現所有調查對象。這份報告可以提交。
                            </p>

                            <div className="border-t border-emerald-700/20 pt-5">
                                <div className="font-mono text-xs text-emerald-500/70 tracking-widest mb-3">最終證據清單</div>
                                <div className="space-y-2">
                                    <EvidenceItem text="實驗確認工具能夠生成符合指定常態分佈參數的數據，功能與報告數據特徵吻合" />
                                    <EvidenceItem text="工具生成數據的標準差系統性偏小（約 15%），與真實問卷資料的自然離散程度有顯著差異" />
                                    {foundOptimal
                                        ? <EvidenceItem text="此標準差差異可作為技術特徵，用於鑑別「工具生成數據」與「真實調查數據」——提供未來核查的技術依據" highlight />
                                        : <div className="flex items-center gap-2 text-slate-600 text-xs py-2 px-3"><Lock size={12} /><span>嚴謹對照組設計下的完整技術特徵分析（重試可解鎖）</span></div>
                                    }
                                </div>
                            </div>
                        </div>

                        {/* 案件摘要 */}
                        <div className="bg-slate-900/60 border border-slate-700/50 rounded p-5 mb-5">
                            <div className="font-mono text-xs text-slate-500 tracking-widest mb-4">◈ 幽靈數據案件調查摘要</div>
                            <div className="space-y-2 text-xs text-slate-400 leading-relaxed">
                                <div className="flex items-start gap-2"><span className="text-sky-500 flex-shrink-0">第1章</span><span>觀察確認可疑行為模式，發現不明研究介面</span></div>
                                <div className="flex items-start gap-2"><span className="text-violet-500 flex-shrink-0">第2章</span><span>訪談取得知情者確認工具存在，鎖定核心功能</span></div>
                                <div className="flex items-start gap-2"><span className="text-amber-500 flex-shrink-0">第3章</span><span>問卷確認擴散規模：43% 知道有人使用，非孤立現象</span></div>
                                <div className="flex items-start gap-2"><span className="text-emerald-500 flex-shrink-0">第4章</span><span>文獻比對發現：引用文獻偽造、修改時間異常、數據分佈可疑</span></div>
                                <div className="flex items-start gap-2"><span className="text-rose-500 flex-shrink-0">第5章</span><span>實驗重現確認工具能力，建立可鑑別的技術特徵</span></div>
                            </div>
                        </div>

                        <PrimaryButton onClick={() => navigate('/phantom')} label="返回調查檔案" />
                    </div>
                )}

            </div>
        </div>
    );
};

const ChapterLabel = ({ num, method }) => (
    <div className="flex items-center gap-3 mb-3">
        <span className="text-slate-600 font-mono text-xs">第 {num} 章</span>
        <span className="text-slate-700 text-xs">·</span>
        <span className="text-rose-400 font-mono text-xs">{method}</span>
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
    <button onClick={onClick} className="w-full bg-amber-600 hover:bg-amber-500 text-slate-950 font-black py-4 rounded transition-all flex items-center justify-center gap-2 text-sm">
        {label} <ChevronRight size={16} />
    </button>
);

const SceneBlock = ({ time, content, actionLabel, onAction }) => (
    <div>
        <div className="font-mono text-rose-600/60 text-xs tracking-widest mb-4">{time}</div>
        <div className="bg-slate-900 border border-slate-700 rounded p-6 mb-8">{content}</div>
        <button onClick={onAction} className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-black py-4 rounded transition-all flex items-center justify-center gap-2 text-sm">
            {actionLabel} <ChevronRight size={16} />
        </button>
    </div>
);

const ChoiceBlock = ({ nodeNum, question, choices, onChoice, directive }) => (
    <div>
        <div className="font-mono text-rose-600/60 text-xs tracking-widest mb-2">決策節點 {nodeNum}</div>
        {directive && (
            <div className="text-[10px] font-mono text-slate-600 tracking-widest mb-4 flex items-center gap-2">
                <span className="text-slate-700">◈</span> 行動守則：{directive}
            </div>
        )}
        <h2 className="text-base font-black text-white mb-6">{question}</h2>
        <div className="space-y-3">
            {choices.map(c => (
                <button key={c.id} onClick={() => onChoice(c.id)}
                    className="w-full text-left bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-rose-600/40 rounded p-5 transition-all group">
                    <div className="flex items-start gap-3">
                        <span className="font-mono text-rose-400 font-bold text-sm flex-shrink-0 mt-0.5 w-4">{c.id}</span>
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
