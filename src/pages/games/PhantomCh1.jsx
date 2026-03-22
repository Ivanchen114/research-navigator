import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FileText, AlertTriangle, CheckCircle,
    RotateCcw, ChevronRight, Lock
} from 'lucide-react';

// ─── localStorage key 常數 ───────────────────────────────────────────────────
const STORAGE_KEYS = {
    agentName:   'rib_agent_name',
    ch1Complete: 'phantom_ch1_complete',
    ch1Optimal:  'phantom_ch1_optimal',
};

// ─── 失敗原因資料 ────────────────────────────────────────────────────────────
// retryPhase：失敗後重試應回到的 phase（而非每次都重頭）
const FAIL_REASONS = {
    ch1_A: {
        type: '任務中止：觀察紀錄含主觀推測',
        detail: '「確認四周無人注意」、「不希望被他人察覺的跡象」、「刻意隱蔽的行為動機」——這些都是你對行為「意圖」的推測，不是你真正看到的事實。「往左右掃視」是可觀察的行為；「確認無人注意」是你對這個動作背後原因的解釋。兩者看起來很像，但在研究記錄上有本質差異：前者任何人來看都一樣，後者是你加進去的解讀。',
        concept: '觀察法核心：客觀記錄 vs. 主觀推論',
        retryPhase: 'scene1',
    },
    ch1_C: {
        type: '任務中止：紀錄資訊量不足',
        detail: '「在用電腦查東西」對圖書館裡任何人都成立，沒有任何分析價值。有效的觀察紀錄要具體到「換一個人來看，也會寫出一樣的東西」。時間、位置、具體動作、頻率——這些才讓資料有辦法被分析。',
        concept: '觀察法核心：紀錄的可驗證性',
        retryPhase: 'scene1',
    },
    ch2_B: {
        type: '任務中止：觀察紀錄出現斷點',
        detail: '完全放棄原始目標，全面改追 C1，你對 C3 的觀察就斷了。觀察法要求資料完整性——你可以擴大觀察範圍，但不能讓原始任務的紀錄憑空消失。接下來的比較與分析將失去基準。',
        concept: '觀察法核心：觀察範圍的一致性',
        retryPhase: 'scene2',
    },
    ch3_B: {
        type: '任務中止：觀察者效應觸發',
        detail: 'C3 察覺到你的視線，隨即關閉畫面；C1 也收起筆電，兩人提前離場。你後來記錄到的，已經不是自然狀態下的行為，這份資料從這一刻開始失真。觀察法最忌諱的，就是讓對象知道自己被觀察。',
        concept: '觀察法核心：觀察者效應（Observer Effect）',
        isConsequence: true,
        retryPhase: 'scene3',
    },
    ch3_C: {
        type: '任務中止：方法混用',
        detail: '走過去直接問對方，這已經不是觀察法——而是訪談法了。兩種方法蒐集的資料性質不同，不能混在同一個步驟裡執行。第二章才是你動口的時候；現在的任務是保持距離，保全觀察的自然性。',
        concept: '觀察法核心：研究方法的界限',
        retryPhase: 'scene3',
    },
};

// ─── 主元件 ─────────────────────────────────────────────────────────────────
export const PhantomCh1 = () => {
    const navigate = useNavigate();
    const [phase, setPhase] = useState('briefing');
    const [failKey, setFailKey] = useState(null);
    const [foundC1Clue, setFoundC1Clue] = useState(false);
    const [agentName, setAgentName] = useState('探員');

    // ── 音效設定 ──
    const bgmRef = useRef(null);
    const heartbeatRef = useRef(null);
    const glitchRef = useRef(null);

    useEffect(() => {
        bgmRef.current = new Audio('/assets/phantom/audio/dragon-studio-creepy-industrial-hum-482882.mp3');
        bgmRef.current.loop = true;
        bgmRef.current.volume = 0.2;

        heartbeatRef.current = new Audio('/assets/phantom/audio/dragon-studio-heartbeat-sound-372448.mp3');
        heartbeatRef.current.volume = 0.8;

        glitchRef.current = new Audio('/assets/phantom/audio/virtual_vibes-glitch-sound-effect-hd-379466.mp3');
        glitchRef.current.volume = 0.5;

        return () => {
            if (bgmRef.current) bgmRef.current.pause();
            if (heartbeatRef.current) heartbeatRef.current.pause();
            if (glitchRef.current) glitchRef.current.pause();
        };
    }, []);

    useEffect(() => {
        if (!bgmRef.current || !heartbeatRef.current || !glitchRef.current) return;

        if (phase === 'scene1' || phase === 'scene2' || phase === 'choice1' || phase === 'choice2') {
            bgmRef.current.play().catch(e => console.log('BGM blocked by browser', e));
        }

        if (phase === 'scene3') {
            heartbeatRef.current.currentTime = 0;
            heartbeatRef.current.play().catch(e => console.log('Heartbeat blocked', e));
        }
        
        if (phase === 'fail') {
            bgmRef.current.pause();
            heartbeatRef.current.pause();
            glitchRef.current.volume = 0.6;
            glitchRef.current.currentTime = 0;
            glitchRef.current.play().catch(e => console.log('Glitch blocked', e));
        }

        if (phase === 'complete') {
            bgmRef.current.pause();
            heartbeatRef.current.pause();
            glitchRef.current.volume = 0.2;
            glitchRef.current.currentTime = 0;
            glitchRef.current.play().catch(e => console.log('Glitch blocked', e));
        }

        if (phase === 'briefing') {
            bgmRef.current.pause();
            bgmRef.current.currentTime = 0;
            heartbeatRef.current.pause();
            heartbeatRef.current.currentTime = 0;
        }
    }, [phase]);

    // ── 手機版音效解鎖 ──
    const unlockAudio = () => {
        // 這些調用必須在 onClick 的同步執行路徑中
        if (bgmRef.current) {
            bgmRef.current.play().catch(() => {});
        }
        if (heartbeatRef.current) {
            heartbeatRef.current.play().then(() => heartbeatRef.current.pause()).catch(() => {});
        }
        if (glitchRef.current) {
            glitchRef.current.play().then(() => glitchRef.current.pause()).catch(() => {});
        }
    };

    useEffect(() => {
        const name = localStorage.getItem(STORAGE_KEYS.agentName);
        if (name) setAgentName(name);
        window.scrollTo(0, 0);
    }, [phase]);

    const fail = (key) => { setFailKey(key); setPhase('fail'); };

    const complete = (hasC1) => {
        localStorage.setItem(STORAGE_KEYS.ch1Complete, 'true');
        if (hasC1) localStorage.setItem(STORAGE_KEYS.ch1Optimal, 'true');
        setPhase('complete');
    };

    // 失敗後回到失敗節點所在的情境，而非從頭重來
    const retry = () => {
        const target = failKey ? (FAIL_REASONS[failKey].retryPhase || 'briefing') : 'briefing';
        // 若回到第一個節點之前，重置線索旗標
        if (target === 'scene1' || target === 'briefing') setFoundC1Clue(false);
        setPhase(target);
        setFailKey(null);
    };

    // ── 選項處理 ──────────────────────────────────────────────────────────────
    const handleChoice1 = (id) => {
        if (id === 'A') return fail('ch1_A');
        if (id === 'C') return fail('ch1_C');
        setPhase('scene2');
    };

    const handleChoice2 = (id) => {
        if (id === 'B') return fail('ch2_B');
        const optimal = id === 'C';
        setFoundC1Clue(optimal);
        setPhase('scene3');
    };

    const handleChoice3 = (id) => {
        if (id === 'B') return fail('ch3_B');
        if (id === 'C') return fail('ch3_C');
        complete(foundC1Clue);
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">

            {/* ── 頂部導覽 ────────────────────────────────────────────────── */}
            <div className="sticky top-0 z-10 border-b border-slate-800 bg-slate-900/90 backdrop-blur px-6 py-3 flex items-center gap-2 text-xs font-mono">
                <button onClick={() => navigate('/phantom')} className="text-slate-500 hover:text-amber-400 transition-colors">
                    R.I.B. 調查檔案
                </button>
                <span className="text-slate-700">/</span>
                <span className="text-amber-400/70">幽靈數據</span>
                <span className="text-slate-700">/</span>
                <span className="text-slate-300">第一章｜潛伏監看</span>
                <span className="ml-auto text-slate-600">{agentName}</span>
            </div>

            <div className="max-w-2xl mx-auto px-6 py-12">

                {/* ══ 任務簡報 ══════════════════════════════════════════════ */}
                {phase === 'briefing' && (
                    <div>
                        {/* 封面橫幅 */}
                        <div className="relative w-full h-48 sm:h-64 rounded-lg overflow-hidden mb-8 border border-slate-700 shadow-2xl">
                            <div className="absolute inset-0 bg-cover bg-center transition-transform duration-[20s] hover:scale-105" style={{ backgroundImage: "url('/assets/phantom/covers/phantom_cover_ch1_bg_v1.png')" }}></div>
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent"></div>
                            {/* Scanlines & Noise */}
                            <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-overlay" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')" }}></div>
                            <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] opacity-20"></div>
                            
                            <div className="absolute bottom-6 left-6 right-6">
                                <ChapterLabel num="01" method="觀察法" />
                                <h1 className="text-3xl sm:text-4xl font-black text-white mt-2 drop-shadow-md">潛伏監看</h1>
                            </div>
                        </div>

                        <div className="bg-slate-900 border border-slate-700 rounded p-6 mb-5 space-y-4">
                            <SectionLabel icon={<FileText size={13} />} text="任務簡報" />
                            <p className="text-slate-300 leading-relaxed text-sm">
                                R.I.B. 收到匿名情報：圖書館二樓電腦區，是「幽靈數據工具」使用者的主要活動地點。總部要求你在不引起注意的情況下，進行第一手觀察，記錄可疑行為模式。
                            </p>
                            <div className="grid grid-cols-3 gap-4 border-t border-slate-700 pt-4 text-xs">
                                <MiniStat label="任務時間" value="15:20 – 16:10" />
                                <MiniStat label="地點" value="圖書館二樓電腦區" />
                                <MiniStat label="任務限制" value="不得主動接觸對象" />
                            </div>
                        </div>

                        <div className="bg-amber-950/20 border border-amber-700/30 rounded p-4 mb-8 text-xs text-amber-300/80 leading-relaxed">
                            <strong className="text-amber-400">觀察法的核心規則：</strong>只記錄你真正看到的行為，不加入推測或情緒判斷。你的筆記必須客觀到「換任何人來看，都能寫出同樣的東西」。
                        </div>

                        <PrimaryButton onClick={() => { unlockAudio(); setPhase('scene1'); }} label="開始任務" />
                    </div>
                )}

                {/* ══ 情境一 ════════════════════════════════════════════════ */}
                {phase === 'scene1' && (
                    <SceneBlock
                        time="15:22"
                        mediaUrl="/assets/phantom/backgrounds/ch1/phantom_ch1_library_peek_bg_v1.png"
                        content={
                            <>
                                <p className="text-slate-300 leading-relaxed text-sm mb-4">
                                    你喬裝成自習生，坐在書架後方的角落位置。視線穿過書架縫隙，可以看到電腦區的五台桌機。
                                </p>
                                <p className="text-slate-300 leading-relaxed text-sm mb-4">
                                    C3 號座位坐著一個戴黑色帽子的學生，已經在操作電腦十多分鐘。他打字速度很快，每隔幾分鐘就往左右兩側張望一下，視線在周圍掃過後繼續看螢幕。
                                </p>
                                <p className="text-slate-300 leading-relaxed text-sm">
                                    你打開田野筆記頁面，準備記下第一筆觀察紀錄。
                                </p>
                            </>
                        }
                        actionLabel="記下第一筆觀察"
                        onAction={() => setPhase('choice1')}
                    />
                )}

                {/* ══ 決策一 ════════════════════════════════════════════════ */}
                {phase === 'choice1' && (
                    <ChoiceBlock
                        nodeNum="01"
                        directive="紀錄只限可直接觀察到的事實，不加任何推測"
                        question="你要怎麼記錄這個學生的行為？"
                        choices={[
                            {
                                id: 'A',
                                text: '「C3，男，黑帽，15:22 起持續使用桌機。每隔 2–3 分鐘往左右掃視（確認四周無人注意），面部表情顯示明顯緊繃，操作上呈現不希望被他人察覺的跡象，研判存在刻意隱蔽的行為動機。」',
                            },
                            {
                                id: 'B',
                                text: '「C3，戴黑帽，男，約16歲。15:22 開始使用電腦。每隔 2–3 分鐘往兩側張望，持續約 1 秒。打字速度快，無明顯停頓。」',
                            },
                            {
                                id: 'C',
                                text: '「C3 的學生在用電腦查研究資料，看起來在做功課。」',
                            },
                        ]}
                        onChoice={handleChoice1}
                    />
                )}

                {/* ══ 情境二 ════════════════════════════════════════════════ */}
                {phase === 'scene2' && (
                    <SceneBlock
                        time="15:41"
                        mediaUrl="/assets/phantom/backgrounds/ch1/phantom_ch1_computer_closeup_bg_v1.png"
                        content={
                            <>
                                <p className="text-slate-300 leading-relaxed text-sm mb-4">
                                    C3 的行為模式穩定，你持續記錄。這時，一個綁馬尾的女學生走進來，坐到 C1 號座位。
                                </p>
                                <p className="text-slate-300 leading-relaxed text-sm mb-4">
                                    她同時打開了自己的筆電，也開了圖書館的桌機——兩個螢幕並用。你瞥到她筆電畫面上有一個你不認識的介面：有「研究問題」、「資料整理」、「圖表輸出」、「結論草稿」幾個區塊，不像任何一般的搜尋引擎或文件系統。
                                </p>
                                <p className="text-slate-300 leading-relaxed text-sm">
                                    你的任務原本只針對 C3。
                                </p>
                            </>
                        }
                        actionLabel="做出判斷"
                        onAction={() => setPhase('choice2')}
                    />
                )}

                {/* ══ 決策二 ════════════════════════════════════════════════ */}
                {phase === 'choice2' && (
                    <ChoiceBlock
                        nodeNum="02"
                        directive="有效情報不放棄，但不得中斷主觀察對象"
                        question="出現了任務外的可疑線索，你要怎麼處理？"
                        choices={[
                            {
                                id: 'A',
                                text: '繼續專注觀察 C3，C1 不是任務目標，不要分心。',
                            },
                            {
                                id: 'B',
                                text: 'C3 已累積了一定的觀察紀錄，C1 的不明介面才是更關鍵的線索——把觀察重心轉移到 C1，把握時機詳細記錄她的操作。',
                            },
                            {
                                id: 'C',
                                text: '在筆記上補記 C1 的異常情況，同時繼續以 C3 為主要觀察對象，兩邊都記。',
                            },
                        ]}
                        onChoice={handleChoice2}
                    />
                )}

                {/* ══ 情境三 ════════════════════════════════════════════════ */}
                {phase === 'scene3' && (
                    <SceneBlock
                        time="16:07"
                        mediaUrl="/assets/phantom/backgrounds/ch1/phantom_ch1_targeted_view_bg_v1.png"
                        content={
                            <>
                                <p className="text-slate-300 leading-relaxed text-sm mb-4">
                                    你已經觀察了將近五十分鐘。C3 的行為模式越來越清晰，筆記也越來越完整。
                                </p>
                                <p className="text-slate-300 leading-relaxed text-sm mb-4">
                                    就在快要收工的時候，C3 突然把椅子往後推，轉過頭來，目光直接掃向你這排書架。
                                </p>
                                <p className="text-slate-300 leading-relaxed text-sm">
                                    你的筆記頁面還開著，螢幕亮度沒有調低。他的視線在你身上停了兩秒。
                                </p>
                            </>
                        }
                        actionLabel="決定怎麼反應"
                        onAction={() => setPhase('choice3')}
                    />
                )}

                {/* ══ 決策三 ════════════════════════════════════════════════ */}
                {phase === 'choice3' && (
                    <ChoiceBlock
                        nodeNum="03"
                        directive="觀察任務以不暴露身份為最高原則"
                        question="你可能已經被注意到了，怎麼辦？"
                        choices={[
                            {
                                id: 'A',
                                text: '立刻關掉筆記頁面，低頭翻講義，讓對方以為你只是在自習。',
                            },
                            {
                                id: 'B',
                                text: '沒關係，繼續記錄——反正他也不知道你在觀察他。',
                            },
                            {
                                id: 'C',
                                text: '直接走過去，問他在做什麼研究，趁機多取得一些資訊。',
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
                            <div className="relative w-full h-40 rounded-sm overflow-hidden border border-red-900/50 mb-5 shadow-2xl">
                                <div className="absolute inset-0 bg-cover bg-center grayscale opacity-60" style={{ backgroundImage: "url('/assets/phantom/backgrounds/ch1/phantom_ch1_library_empty_bg_v1.png')" }}></div>
                                <div className="absolute inset-0 bg-red-950/40 mix-blend-color-burn"></div>
                                <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22/%3E%3C/svg%3E')] mix-blend-overlay animate-pulse pointer-events-none"></div>
                                <div className="absolute bottom-4 left-4 text-red-500 font-mono text-xs tracking-[0.3em] font-black uppercase drop-shadow">System Warning // Task Aborted</div>
                            </div>
                            {r.isConsequence && (
                                <div className="bg-slate-900 border border-slate-700 rounded-sm p-5 mb-5 text-sm text-slate-400 leading-relaxed">
                                    C3 察覺到你的視線後，迅速關閉了螢幕畫面；C1 也同時收起了筆電。兩人對視一眼，隨即提前離場。圖書館電腦區恢復安靜——你的觀察工作在這一刻中斷。
                                </div>
                            )}
                            <div className="bg-red-950/30 border border-red-700/40 rounded p-6 mb-5">
                                <SectionLabel icon={<AlertTriangle size={13} />} text="任務中止報告" color="text-red-400" />
                                <h2 className="text-lg font-black text-red-300 mt-3 mb-4">{r.type}</h2>
                                <p className="text-slate-300 text-sm leading-relaxed mb-5">{r.detail}</p>
                                <div className="border-t border-red-700/20 pt-4">
                                    <span className="font-mono text-xs text-red-400/60">{r.concept}</span>
                                </div>
                            </div>
                            <button
                                onClick={() => { unlockAudio(); retry(); }}
                                className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-black py-4 rounded-sm transition-all flex items-center justify-center gap-2 text-sm"
                            >
                                <RotateCcw size={15} /> 重新執行任務
                            </button>
                        </div>
                    );
                })()}

                {/* ══ 任務完成 ══════════════════════════════════════════════ */}
                {phase === 'complete' && (
                    <div>
                        <div className="relative w-full h-48 rounded-sm overflow-hidden border border-emerald-900/50 mb-5 shadow-2xl">
                            <div className="absolute inset-0 bg-cover bg-center transition-transform duration-[15s] hover:scale-105" style={{ backgroundImage: "url('/assets/phantom/backgrounds/ch1/phantom_ch1_library_glitch_bg_v1.png')" }}></div>
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent"></div>
                            <div className="absolute inset-0 opacity-30 mix-blend-overlay pointer-events-none" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')" }}></div>
                            <div className="absolute bottom-4 left-4 text-emerald-400 font-mono text-xs tracking-[0.3em] font-black uppercase drop-shadow">Data Fragment Captured</div>
                        </div>
                        <div className="bg-emerald-950/20 border border-emerald-700/30 rounded p-6 mb-5">
                            <SectionLabel icon={<CheckCircle size={13} />} text="任務完成" color="text-emerald-400" />
                            <h2 className="text-xl font-black text-emerald-300 mt-3 mb-4">觀察任務成功</h2>
                            <p className="text-slate-300 text-sm leading-relaxed mb-6">
                                你在不干擾被觀察者自然行為的前提下，完成了完整的田野觀察。紀錄保持客觀，資料具有可信度，可進入下一階段分析。
                            </p>

                            <div className="border-t border-emerald-700/20 pt-5">
                                <div className="font-mono text-xs text-emerald-500/70 tracking-widest mb-3">證據碎片已入庫</div>
                                <div className="space-y-2">
                                    <EvidenceItem text="C3：規律性左右張望，每 2–3 分鐘一次，持續約 1 秒" />
                                    <EvidenceItem text="C3：打字速度快且持續，符合主動操作特徵" />
                                    {foundC1Clue
                                        ? <EvidenceItem text="C1：雙螢幕操作，筆電出現含「研究問題、圖表輸出、結論草稿」的不明研究介面" highlight />
                                        : (
                                            <div className="flex items-center gap-2 text-slate-600 text-xs py-2 px-3">
                                                <Lock size={12} />
                                                <span>C1 相關線索未取得（重試可解鎖完整情報）</span>
                                            </div>
                                        )
                                    }
                                    <EvidenceItem text="兩人於觀察末段存在短暫目光交流，C1 警覺性高" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-900/60 border border-slate-800 rounded p-4 mb-5 text-xs text-slate-500 font-mono">
                            第二章｜訪談法：線人接觸 — 已解鎖
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
        <span className="text-sky-400 font-mono text-xs">{method}</span>
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
        className="w-full bg-amber-600 hover:bg-amber-500 text-slate-950 font-black py-4 rounded-sm transition-all flex items-center justify-center gap-2 text-sm"
    >
        {label} <ChevronRight size={16} />
    </button>
);

const SceneBlock = ({ time, content, actionLabel, onAction, mediaUrl }) => (
    <div className="overflow-hidden bg-slate-900 border border-slate-700 rounded-lg mb-8 shadow-2xl">
        {mediaUrl && (
            <div className="relative w-full aspect-[21/9] bg-slate-950">
                <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-[10s] hover:scale-[1.03] origin-bottom"
                    style={{ backgroundImage: `url('${mediaUrl}')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
                <div className="absolute inset-0 opacity-10 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] mix-blend-overlay"></div>
                
                <div className="absolute top-4 left-4 font-mono text-sky-400 font-bold text-[10px] tracking-widest bg-slate-950/80 px-2 py-1 rounded backdrop-blur-md border border-sky-900/50 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse"></span>
                    REC • {time}
                </div>
            </div>
        )}

        <div className={`p-6 ${mediaUrl ? 'pt-4' : ''}`}>
            {!mediaUrl && <div className="font-mono text-sky-600/60 text-xs tracking-widest mb-4">{time}</div>}
            
            <div className="text-slate-300 text-sm leading-relaxed mb-6 space-y-4">
                {content}
            </div>
            
            <button
                onClick={onAction}
                className="w-full bg-slate-800 hover:bg-slate-700 border border-transparent hover:border-sky-500/50 text-slate-200 font-black py-4 rounded-sm transition-all flex items-center justify-center gap-2 text-sm"
            >
                {actionLabel} <ChevronRight size={16} />
            </button>
        </div>
    </div>
);

const ChoiceBlock = ({ nodeNum, question, choices, onChoice, directive }) => (
    <div>
        <div className="font-mono text-amber-600/60 text-xs tracking-widest mb-2">決策節點 {nodeNum}</div>
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
                    className="w-full text-left bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-amber-600/40 rounded p-5 transition-all group"
                >
                    <div className="flex items-start gap-3">
                        <span className="font-mono text-amber-500 font-bold text-sm flex-shrink-0 mt-0.5 w-4">{c.id}</span>
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
