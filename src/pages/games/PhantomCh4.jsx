import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FileText, AlertTriangle, CheckCircle,
    RotateCcw, ChevronRight, Lock
} from 'lucide-react';

const STORAGE_KEYS = {
    agentName:   'rib_agent_name',
    ch3Optimal:  'phantom_ch3_optimal',
    ch4Complete: 'phantom_ch4_complete',
    ch4Optimal:  'phantom_ch4_optimal',
};

const FAIL_REASONS = {
    n1_A: {
        type: '任務中止：接受無法核實的引用文獻',
        detail: '格式完整不等於文獻真實存在。引用的期刊名稱、作者、頁碼都可以偽造——唯一能確認的方式，是進資料庫實際查詢。你跳過了這個步驟，讓一筆可能是捏造的引用就這樣通過了審查。文獻分析的第一要務，是確認每一筆來源真實存在。',
        concept: '文獻分析核心：文獻核實（Citation Verification）——格式正確不代表文獻真實存在',
        retryPhase: 'scene1',
    },
    n2_B: {
        type: '任務中止：忽略元數據，失去關鍵時間證據',
        detail: '數位文件的「最後修改時間」是系統自動記錄的，除非刻意竄改，否則具有相當高的可信度。把它歸類為「技術誤差」而不採用，等於主動放棄了一筆可以建立時間軸的重要證據。元數據在數位鑑識中具有法律效力，不可輕易忽略。',
        concept: '文獻分析核心：元數據（Metadata）作為證據——數位文件的時間戳記是可信的輔助證據',
        retryPhase: 'scene2',
    },
    n2_C: {
        type: '任務中止：個人筆記不構成研究記錄',
        detail: '只寫在個人筆記裡的發現，在正式的研究報告中不存在。文獻分析的結果必須以可驗證的方式記錄下來——任何閱讀你報告的人，都應該能夠根據你的記錄追溯到同樣的發現。「我有記但沒寫進去」在研究上等於沒有記錄。',
        concept: '文獻分析核心：研究記錄的可追溯性——所有重要發現必須寫入正式分析文件',
        retryPhase: 'scene2',
    },
    n3_B: {
        type: '任務中止：確認偏誤，只選支持假設的證據',
        detail: '「清晰有力」聽起來是好的寫作目標，但把「只呈現有利的發現」當成達成這個目標的方式，正是確認偏誤最常見的包裝。研究者的工作是完整呈現所有發現——包括那些讓你的結論顯得沒那麼確定的部分。一份經過挑選的分析，讀者不會看到「清晰結論」，而是會質疑你隱藏了什麼。',
        concept: '文獻分析核心：確認偏誤（Confirmation Bias）——研究者不應選擇性使用符合預期的資料',
        retryPhase: 'scene3',
    },
    n3_C: {
        type: '任務中止：顧慮爭議而隱匿重要發現',
        detail: '擔心結論可能指向特定人物，所以選擇不寫——這是研究誠信的底線問題。正確的做法是匿名化（使用代號），而不是隱匿發現。隱瞞重要的分析結果，等於讓一份研究失去了它最核心的價值：告訴讀者真相。',
        concept: '文獻分析核心：研究誠信——重要發現不應因擔心爭議而隱匿，應以匿名方式呈現',
        retryPhase: 'scene3',
    },
};

export const PhantomCh4 = () => {
    const navigate = useNavigate();
    const [phase, setPhase] = useState('briefing');
    const [failKey, setFailKey] = useState(null);
    const [foundOptimal, setFoundOptimal] = useState(false);
    const [agentName, setAgentName] = useState('探員');
    const [hadCh3Optimal, setHadCh3Optimal] = useState(false);

    useEffect(() => {
        const name = localStorage.getItem(STORAGE_KEYS.agentName);
        if (name) setAgentName(name);
        setHadCh3Optimal(!!localStorage.getItem(STORAGE_KEYS.ch3Optimal));
        window.scrollTo(0, 0);
    }, [phase]);

    const fail = (key) => { setFailKey(key); setPhase('fail'); };

    const complete = (isOptimal) => {
        localStorage.setItem(STORAGE_KEYS.ch4Complete, 'true');
        if (isOptimal) localStorage.setItem(STORAGE_KEYS.ch4Optimal, 'true');
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
        setFoundOptimal(id === 'B'); // B=標記無法核實=最優；C=標記待確認=次佳
        setPhase('scene2');
    };

    const handleChoice2 = (id) => {
        if (id === 'B') return fail('n2_B');
        if (id === 'C') return fail('n2_C');
        setPhase('scene3');
    };

    const handleChoice3 = (id) => {
        if (id === 'B') return fail('n3_B');
        if (id === 'C') return fail('n3_C');
        complete(foundOptimal);
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">

            <div className="sticky top-0 z-10 border-b border-slate-800 bg-slate-900/90 backdrop-blur px-6 py-3 flex items-center gap-2 text-xs font-mono">
                <button onClick={() => navigate('/phantom')} className="text-slate-500 hover:text-emerald-400 transition-colors">
                    R.I.B. 調查檔案
                </button>
                <span className="text-slate-700">/</span>
                <span className="text-emerald-400/70">幽靈數據</span>
                <span className="text-slate-700">/</span>
                <span className="text-slate-300">第四章｜檔案比對</span>
                <span className="ml-auto text-slate-600">{agentName}</span>
            </div>

            <div className="max-w-2xl mx-auto px-6 py-12">

                {phase === 'briefing' && (
                    <div>
                        <ChapterLabel num="04" method="文獻分析" />
                        <h1 className="text-3xl font-black text-white mb-6">檔案比對</h1>

                        <div className="bg-slate-900/60 border border-slate-700/50 rounded p-4 mb-5 space-y-1.5">
                            <div className="font-mono text-xs text-slate-500 tracking-widest mb-2">◈ 來自前章的線索</div>
                            <EvidenceItem text="問卷顯示 43% 的受訪者知道班上有人在使用研究輔助工具——規模比預期大" />
                            {hadCh3Optimal
                                ? <EvidenceItem text="自由填寫欄中，工具功能集中描述為「圖表輸出」與「結論整理」，與訪談、觀察線索三方吻合" highlight />
                                : <div className="flex items-center gap-2 text-slate-600 text-xs py-1.5 px-3"><Lock size={11} /><span>問卷開放題資料未取得（第三章最優路徑可解鎖）</span></div>
                            }
                        </div>

                        <div className="bg-slate-900 border border-slate-700 rounded p-6 mb-5 space-y-4">
                            <SectionLabel icon={<FileText size={13} />} text="任務簡報" />
                            <p className="text-slate-300 leading-relaxed text-sm">
                                總部批准你調閱三年前那份得獎研究的完整電子檔。你取得了兩個版本：競賽投稿版與校內存檔版，以及報告的完整引用清單。你的任務是交叉比對這些文件，找出造假的時間節點與手法。
                            </p>
                            <div className="grid grid-cols-3 gap-4 border-t border-slate-700 pt-4 text-xs">
                                <MiniStat label="調閱資料" value="得獎報告完整版" />
                                <MiniStat label="比對對象" value="引用文獻、元數據" />
                                <MiniStat label="任務核心" value="找出造假時間節點" />
                            </div>
                        </div>

                        <div className="bg-emerald-950/20 border border-emerald-700/30 rounded p-4 mb-8 text-xs text-emerald-300/80 leading-relaxed">
                            <strong className="text-emerald-400">文獻分析的核心規則：</strong>每一筆引用都必須可追溯；元數據是數位文件的隱藏記錄；所有發現，無論支持或反對你的假設，都必須完整記錄。
                        </div>

                        <PrimaryButton onClick={() => setPhase('scene1')} label="開始比對" />
                    </div>
                )}

                {phase === 'scene1' && (
                    <SceneBlock
                        time="引用清單審查"
                        content={
                            <>
                                <p className="text-slate-300 leading-relaxed text-sm mb-4">
                                    你打開報告的參考文獻頁。引用清單共 22 筆，格式規整。你開始逐一進資料庫核查。
                                </p>
                                <p className="text-slate-300 leading-relaxed text-sm mb-4">
                                    讀到第 14 筆時，你停下來：
                                </p>
                                <div className="bg-slate-800/60 border border-slate-700 rounded p-4 text-sm text-slate-200 leading-relaxed">
                                    <span className="text-emerald-400/60 font-mono text-xs block mb-2">參考文獻 #14</span>
                                    陳等人（2021）。高中生研究方法使用現況調查。<em>教育科學期刊</em>，第 18 卷第 3 期，頁 48–62。
                                </div>
                                <p className="text-slate-400 text-xs italic mt-4 leading-relaxed">
                                    你在 Google Scholar、台灣期刊論文系統、HyRead 三個資料庫中查詢「教育科學期刊 第18卷」——一筆結果都找不到。
                                </p>
                            </>
                        }
                        actionLabel="決定怎麼處理"
                        onAction={() => setPhase('choice1')}
                    />
                )}

                {phase === 'choice1' && (
                    <ChoiceBlock
                        nodeNum="01"
                        directive="文獻核實的唯一標準是能否在資料庫中查到，格式完整不等於文獻存在"
                        question="你在三個資料庫中都查不到這筆引用。你怎麼處理？"
                        choices={[
                            { id: 'A', text: '引用格式完整，作者、期刊、頁碼都有，應該沒問題，繼續核查其他文獻。' },
                            { id: 'B', text: '查不到就是查不到。在分析報告中標記為「無法核實」，記錄所有查詢過的資料庫與結果。' },
                            { id: 'C', text: '有可能是小型期刊資料庫收錄延遲。暫時標記為「待確認」，繼續後續分析。' },
                        ]}
                        onChoice={handleChoice1}
                    />
                )}

                {phase === 'scene2' && (
                    <SceneBlock
                        time="檔案元數據檢查"
                        content={
                            <>
                                <p className="text-slate-300 leading-relaxed text-sm mb-4">
                                    你向學校存檔系統申請調閱當年競賽提交的電子檔原始版本。系統批准後，你下載了檔案，右鍵查看屬性。
                                </p>
                                <div className="bg-slate-800/60 border border-slate-700 rounded p-4 text-sm text-slate-200 mb-4 space-y-2">
                                    <div className="flex justify-between text-xs">
                                        <span className="text-slate-500 font-mono">競賽截止時間</span>
                                        <span className="text-slate-300">10月 15日　17:00</span>
                                    </div>
                                    <div className="flex justify-between text-xs">
                                        <span className="text-slate-500 font-mono">檔案建立時間</span>
                                        <span className="text-slate-300">9月 3日　14:22</span>
                                    </div>
                                    <div className="flex justify-between text-xs border-t border-slate-700/60 pt-2">
                                        <span className="text-emerald-400/70 font-mono">最後修改時間</span>
                                        <span className="text-emerald-300 font-bold">10月 18日　凌晨 02:47</span>
                                    </div>
                                </div>
                                <p className="text-slate-400 text-xs italic leading-relaxed">
                                    最後修改時間比競賽截止晚了整整 72 小時。
                                </p>
                            </>
                        }
                        actionLabel="決定如何記錄"
                        onAction={() => setPhase('choice2')}
                    />
                )}

                {phase === 'choice2' && (
                    <ChoiceBlock
                        nodeNum="02"
                        directive="元數據是數位文件的客觀記錄，必須列入分析"
                        question="提交版本的最後修改時間，比競賽截止晚了 72 小時。你怎麼記錄這個發現？"
                        choices={[
                            { id: 'A', text: '製作詳細時間軸，把修改時間戳記、截止日、提交紀錄三者對照，記錄為重要異常，納入分析報告。' },
                            { id: 'B', text: '檔案時間戳可能因電腦時區設定或系統誤差而不準確，不應當作可靠的證據使用。標記為不可靠，不採用。' },
                            { id: 'C', text: '有記錄這個時間差，但考量這只是間接證據，決定不在書面報告中列出，僅保留在個人筆記裡。' },
                        ]}
                        onChoice={handleChoice2}
                    />
                )}

                {phase === 'scene3' && (
                    <SceneBlock
                        time="數據分佈交叉比對"
                        content={
                            <>
                                <p className="text-slate-300 leading-relaxed text-sm mb-4">
                                    你把報告中的問卷數據拉出來，和你在第三章取得的真實問卷回覆做比對。
                                </p>
                                <p className="text-slate-300 leading-relaxed text-sm mb-4">
                                    發現令你皺眉：報告的數據呈現出高度對稱的常態分佈——所有組別的標準差幾乎相同，均值之間的差距精準到小數點後兩位。
                                </p>
                                <p className="text-slate-400 text-xs italic leading-relaxed border-l-2 border-emerald-700/40 pl-3">
                                    真實的問卷調查資料，通常會有自然的不規則性——有人跳題、有人極端值、有人填中間值。這份數據太整齊了。
                                </p>
                            </>
                        }
                        actionLabel="決定如何呈現發現"
                        onAction={() => setPhase('choice3')}
                    />
                )}

                {phase === 'choice3' && (
                    <ChoiceBlock
                        nodeNum="03"
                        directive="所有發現都必須完整記錄，包括不確定的部分"
                        question="你有了幾項重要發現，但結論仍有一定的不確定性。你怎麼撰寫分析報告？"
                        choices={[
                            { id: 'A', text: '完整列出所有發現——無法核實的引用、時間戳記異常、數據分佈過於規整——同時說明各項證據的確定程度，讓讀者自行判斷。' },
                            { id: 'B', text: '報告的核心是提出清晰有力的結論——把最關鍵的發現集中呈現，少用「可能」、「不確定」等模糊字眼，讓讀者可以清楚看到調查指向哪裡。' },
                            { id: 'C', text: '由於這些發現可能指向特定同學，決定不將異常分佈記錄進正式報告，等有更確鑿的實驗證據再說。' },
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
                        <div className="bg-emerald-950/20 border border-emerald-700/30 rounded p-6 mb-5">
                            <SectionLabel icon={<CheckCircle size={13} />} text="任務完成" color="text-emerald-400" />
                            <h2 className="text-xl font-black text-emerald-300 mt-3 mb-4">文獻比對任務成功</h2>
                            <p className="text-slate-300 text-sm leading-relaxed mb-6">
                                你完成了一份嚴謹的文獻分析報告：核實了所有引用來源，記錄了元數據異常，並完整呈現所有發現。這份報告為第五章的實驗驗證提供了明確的調查方向。
                            </p>
                            <div className="border-t border-emerald-700/20 pt-5">
                                <div className="font-mono text-xs text-emerald-500/70 tracking-widest mb-3">證據碎片已入庫</div>
                                <div className="space-y-2">
                                    <EvidenceItem text="引用文獻「陳等人（2021）教育科學期刊」在三個主要資料庫中均無法查到" />
                                    <EvidenceItem text="競賽提交版本的最後修改時間戳記晚於截止日 72 小時" />
                                    {foundOptimal
                                        ? <EvidenceItem text="報告數據呈現異常完美的常態分佈，標準差與均值比例過於規整，與真實問卷資料的自然分佈有顯著差異" highlight />
                                        : <div className="flex items-center gap-2 text-slate-600 text-xs py-2 px-3"><Lock size={12} /><span>數據分佈異常發現未詳細記錄（重試可解鎖完整分析）</span></div>
                                    }
                                </div>
                            </div>
                        </div>
                        <div className="bg-slate-900/60 border border-slate-800 rounded p-4 mb-5 text-xs text-slate-500 font-mono">
                            第五章｜實驗法：重現測試 — 已解鎖
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
        <span className="text-emerald-400 font-mono text-xs">{method}</span>
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
        <div className="font-mono text-emerald-600/60 text-xs tracking-widest mb-4">{time}</div>
        <div className="bg-slate-900 border border-slate-700 rounded p-6 mb-8">{content}</div>
        <button onClick={onAction} className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-black py-4 rounded transition-all flex items-center justify-center gap-2 text-sm">
            {actionLabel} <ChevronRight size={16} />
        </button>
    </div>
);

const ChoiceBlock = ({ nodeNum, question, choices, onChoice, directive }) => (
    <div>
        <div className="font-mono text-emerald-600/60 text-xs tracking-widest mb-2">決策節點 {nodeNum}</div>
        {directive && (
            <div className="text-[10px] font-mono text-slate-600 tracking-widest mb-4 flex items-center gap-2">
                <span className="text-slate-700">◈</span> 行動守則：{directive}
            </div>
        )}
        <h2 className="text-base font-black text-white mb-6">{question}</h2>
        <div className="space-y-3">
            {choices.map(c => (
                <button key={c.id} onClick={() => onChoice(c.id)}
                    className="w-full text-left bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-emerald-600/40 rounded p-5 transition-all group">
                    <div className="flex items-start gap-3">
                        <span className="font-mono text-emerald-400 font-bold text-sm flex-shrink-0 mt-0.5 w-4">{c.id}</span>
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
