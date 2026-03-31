import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FileText, AlertTriangle, CheckCircle,
    RotateCcw, ChevronRight, Volume2, VolumeX
} from 'lucide-react';

// ─── localStorage key 常數 ────────────────────────────────────────────────────
const STORAGE_KEYS = {
    agentName:   'rib_agent_name',
    ch4Complete: 'echo_ch4_complete',
    ch4Optimal:  'echo_ch4_optimal',
};

// ─── 失敗原因資料 ──────────────────────────────────────────────────────────────
const FAIL_REASONS = {
    ch1_A: {
        type: '任務中止：以「多數」判斷原始版本，邏輯上不成立',
        detail: '差異最小的兩個版本，可能是因為它們從同一個中間人那裡拿到，而不是因為它們「最接近原始」。第三個版本反而可能是最原始的，後來才被其他人不小心修改。你必須先找到外部驗證點，而不是靠「哪個最多人有」決定誰更真實。',
        concept: '文獻分析核心：版本比對——差異的規律比多數決更重要',
        retryPhase: 'scene1',
    },
    ch1_C: {
        type: '任務中止：「共同有的部分」可能是最早被植入的造假內容',
        detail: '如果截圖從一開始就是偽造的，三個版本共同有的部分，可能恰恰是造假者一開始就放進去的核心假訊息。把「大家都有」視為「可以信任」，等於用傳播廣度代替真實性判斷——這是謠言設計者最希望你犯的錯誤。',
        concept: '文獻分析核心：不以流通廣度判斷可信度',
        retryPhase: 'scene1',
    },
    ch2_A: {
        type: '任務中止：過度仰賴單一間接證據做決定性結論',
        detail: 'EXIF 時間戳記確實有說服力，但任何影像編輯軟體都可以修改它。如果你在報告中把它列為「決定性結論」，對方只需要說一句「那個可以改的」，你的整個結論就崩潰了。在單一間接證據上建立決定性結論，是研究報告最脆弱的狀態。',
        concept: '文獻分析核心：間接證據的使用限制——必須說明局限性，不可做超出證據範圍的結論',
        retryPhase: 'scene2',
    },
    ch2_C: {
        type: '任務中止：因預設對方會反駁而主動略去有效證據',
        detail: '「怕被反駁就不提」等於主動降低分析的完整性。正確做法是提出這個證據，同時誠實說明它的局限——這樣即使對方說「可以改的」，你的回應是「我已經說明它是輔助性證據，需要與其他資料一起看」。主動說明弱點，反而讓分析更有說服力，而不是更薄弱。',
        concept: '文獻分析核心：完整呈現義務——說明局限≠刪除證據',
        retryPhase: 'scene2',
    },
    ch3_A: {
        type: '任務中止：引用無法核實的匿名陳述作為研究依據',
        detail: '三個匿名帳號說「是真的」，可能是同一個人用三個帳號，也可能是協調一致的造謠行動——這正是謠言操弄的常見手法。「多個匿名帳號說法一致」是社群操弄的特徵之一，不是可信度的保證。引用它，等於讓你的報告被謠言的製造邏輯反將一軍。',
        concept: '文獻分析核心：可追溯性——只有可核實來源才可引用作為依據',
        retryPhase: 'scene3',
    },
    ch3_C: {
        type: '任務中止：完全忽略放棄記錄，損失潛在的分析材料',
        detail: '「無法引用」不等於「應該忽略」。這三個帳號雖然不能作為結論依據，但它們的存在、時間點、說法的同質性，本身就是一種可分析的現象——也許能指向一個協調操弄的節點。記錄在附錄並標注「無法核實」，比完全不記錄更完整。',
        concept: '文獻分析核心：不可核實資料的處理——記錄並標注，而非忽略',
        retryPhase: 'scene3',
    },
};

// ─── 主元件 ───────────────────────────────────────────────────────────────────
export const EchoCh4 = () => {
    const navigate = useNavigate();
    const [phase, setPhase] = useState('briefing');
    const [failKey, setFailKey] = useState(null);
    const [agentName, setAgentName] = useState('探員');
    const [isMuted, setIsMuted] = useState(() => localStorage.getItem('echo_muted') === 'true');
    const [hadPrevOptimal, setHadPrevOptimal] = useState(false);

    const bgmRef = useRef(null);
    const heartbeatRef = useRef(null);
    const glitchRef = useRef(null);

    useEffect(() => {
        bgmRef.current = new Audio('/assets/phantom/audio/dragon-studio-creepy-industrial-hum-482882.mp3');
        bgmRef.current.loop = true;
        bgmRef.current.volume = 0.15;
        bgmRef.current.muted = isMuted;

        heartbeatRef.current = new Audio('/assets/phantom/audio/dragon-studio-heartbeat-sound-372448.mp3');
        heartbeatRef.current.volume = 0.8;
        heartbeatRef.current.muted = isMuted;

        glitchRef.current = new Audio('/assets/phantom/audio/virtual_vibes-glitch-sound-effect-hd-379466.mp3');
        glitchRef.current.volume = 0.5;
        glitchRef.current.muted = isMuted;

        return () => {
            if (bgmRef.current) bgmRef.current.pause();
            if (heartbeatRef.current) heartbeatRef.current.pause();
            if (glitchRef.current) glitchRef.current.pause();
        };
    }, []);

    useEffect(() => {
        if (bgmRef.current) bgmRef.current.muted = isMuted;
        if (heartbeatRef.current) heartbeatRef.current.muted = isMuted;
        if (glitchRef.current) glitchRef.current.muted = isMuted;
    }, [isMuted]);

    const toggleMute = () => {
        const newMuted = !isMuted;
        setIsMuted(newMuted);
        localStorage.setItem('echo_muted', String(newMuted));
    };

    useEffect(() => {
        // 切換階段時自動回到最上方
        window.scrollTo(0, 0);

        if (!bgmRef.current || !heartbeatRef.current || !glitchRef.current) return;

        if (phase === 'scene1' || phase === 'scene2' || phase === 'choice1' || phase === 'choice2') {
            bgmRef.current.play().catch(() => {});
        }
        if (phase === 'scene3') {
            heartbeatRef.current.currentTime = 0;
            heartbeatRef.current.play().catch(() => {});
        }
        if (phase === 'fail') {
            bgmRef.current.pause();
            heartbeatRef.current.pause();
            glitchRef.current.volume = 0.6;
            glitchRef.current.currentTime = 0;
            glitchRef.current.play().catch(() => {});
        }
        if (phase === 'complete') {
            bgmRef.current.pause();
            heartbeatRef.current.pause();
            glitchRef.current.volume = 0.2;
            glitchRef.current.currentTime = 0;
            glitchRef.current.play().catch(() => {});
        }
        if (phase === 'briefing') {
            bgmRef.current.pause();
            bgmRef.current.currentTime = 0;
            heartbeatRef.current.pause();
            heartbeatRef.current.currentTime = 0;
        }
    }, [phase]);

    const unlockAudio = () => {
        if (bgmRef.current) bgmRef.current.play().catch(() => {});
        if (heartbeatRef.current) heartbeatRef.current.play().then(() => heartbeatRef.current.pause()).catch(() => {});
        if (glitchRef.current) glitchRef.current.play().then(() => glitchRef.current.pause()).catch(() => {});
    };

    useEffect(() => {
        const name = localStorage.getItem(STORAGE_KEYS.agentName);
        if (name) setAgentName(name);
        setHadPrevOptimal(localStorage.getItem('echo_ch3_optimal') === 'true');
        window.scrollTo(0, 0);

        const imgs = [
            '/assets/echo/covers/echo_cover_ch4_bg_v1.webp',
            '/assets/echo/backgrounds/ch4/echo_ch4_three_screenshots_v1.webp',
            '/assets/echo/backgrounds/ch4/echo_ch4_exif_data_v1.webp',
            '/assets/echo/backgrounds/ch4/echo_ch4_anonymous_thread_v1.webp',
            '/assets/echo/backgrounds/ch4/echo_ch4_fail_bg_v1.webp',
            '/assets/echo/backgrounds/ch4/echo_ch4_complete_bg_v1.webp',
        ];
        imgs.forEach(src => { const img = new Image(); img.src = src; });
    }, []);

    const fail = (key) => { setFailKey(key); setPhase('fail'); };

    // Ch4 Node3 only has one pass option (B) and it is also the optimal
    const complete = () => {
        localStorage.setItem(STORAGE_KEYS.ch4Complete, 'true');
        localStorage.setItem(STORAGE_KEYS.ch4Optimal, 'true');
        setPhase('complete');
    };

    const retry = () => {
        const target = failKey ? (FAIL_REASONS[failKey].retryPhase || 'briefing') : 'briefing';
        setPhase(target);
        setFailKey(null);
    };

    const handleChoice1 = (id) => {
        if (id === 'A') return fail('ch1_A');
        if (id === 'C') return fail('ch1_C');
        setPhase('scene2');
    };

    const handleChoice2 = (id) => {
        if (id === 'A') return fail('ch2_A');
        if (id === 'C') return fail('ch2_C');
        setPhase('scene3');
    };

    const handleChoice3 = (id) => {
        if (id === 'A') return fail('ch3_A');
        if (id === 'C') return fail('ch3_C');
        complete();
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">

            {/* ── 頂部導覽 ────────────────────────────────────────────────── */}
            <div className="sticky top-0 z-10 border-b border-slate-800 bg-slate-900/90 backdrop-blur px-6 py-3 flex items-center gap-2 text-xs font-mono">
                <button onClick={() => navigate('/echo')} className="text-slate-500 hover:text-cyan-400 transition-colors">
                    R.I.B. 調查檔案
                </button>
                <span className="text-slate-700">/</span>
                <span className="text-cyan-400/70">回聲</span>
                <span className="text-slate-700">/</span>
                <span className="text-slate-300">第四章｜截圖解剖</span>
                <div className="ml-auto flex items-center gap-3">
                    <button onClick={toggleMute} title={isMuted ? '開啟音效' : '靜音'} className="text-slate-500 hover:text-cyan-400 transition-colors">
                        {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                    </button>
                    {agentName && <span className="text-slate-600 font-mono text-xs">{agentName}</span>}
                </div>
            </div>

            <div className="max-w-2xl mx-auto px-6 py-12">

                {/* ══ 任務簡報 ═══════════════════════════════════════════════ */}
                {phase === 'briefing' && (
                    <div>
                        <div className="relative w-full h-48 sm:h-64 rounded-lg overflow-hidden mb-8 border border-slate-700 shadow-2xl">
                            <div className="absolute inset-0 bg-cover bg-center transition-transform duration-[20s] hover:scale-105" style={{ backgroundImage: "url('/assets/echo/covers/echo_cover_ch4_bg_v1.webp')" }}></div>
                            <div className="absolute inset-0 bg-gradient-to-br from-cyan-950/80 via-slate-950/60 to-transparent"></div>
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
                            <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-overlay" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/%3E%3C/svg%3E')" }}></div>
                            <div className="absolute bottom-6 left-6 right-6">
                                <ChapterLabel num="04" method="文獻分析" />
                                <h1 className="text-3xl sm:text-4xl font-black text-white mt-2 drop-shadow-md">截圖解剖</h1>
                            </div>
                        </div>

                        <div className="bg-slate-900 border border-slate-700 rounded p-6 mb-5 space-y-4">
                            <SectionLabel icon={<FileText size={13} />} text="任務簡報" />
                            <p className="text-slate-300 leading-relaxed text-sm">
                                問卷告訴你謠言傳得多廣、傳得多深——但它告訴不了你那張圖本身是什麼東西。你需要回到最原始的問題：這張截圖，從一開始就是真的嗎？
                            </p>
                            <p className="text-slate-300 leading-relaxed text-sm">
                                R.I.B. 技術部門協助取得了那張「關鍵截圖」的三個傳播版本，以及班聯會的公開選舉紀錄。你需要系統性分析截圖的真偽，並與外部可核實資料交叉比對。
                            </p>
                            <p className="text-slate-300 leading-relaxed text-sm">
                                資料不只有「可用」和「不可用」兩種——它們有不同的證據重量：有些能直接支撐結論，有些只能作為脈絡，有些記錄下來但不能被當成判定依據。
                            </p>
                            <div className="grid grid-cols-3 gap-4 border-t border-slate-700 pt-4 text-xs">
                                <MiniStat label="分析材料" value="截圖 3 個版本" />
                                <MiniStat label="外部資料" value="班聯會選舉紀錄" />
                                <MiniStat label="核心目標" value="版本比對與真偽鑑定" />
                            </div>
                        </div>

                        {hadPrevOptimal && (
                            <div className="bg-cyan-950/20 border border-cyan-700/30 rounded p-4 mb-5 text-xs text-cyan-300/80 leading-relaxed">
                                <strong className="text-cyan-400">★ 前章線索繼承：</strong>你知道有個截圖版本之外的「私下口述細節」在流傳——你可以用它來比對截圖中的語言，看是否與口述版本吻合。
                            </div>
                        )}

                        <div className="bg-cyan-950/20 border border-cyan-700/30 rounded p-4 mb-8 text-xs text-cyan-300/80 leading-relaxed">
                            <strong className="text-cyan-400">文獻分析的核心規則：</strong>版本比對要逐行比較，說明每個證據的局限，只引用可追溯來源——無法核實的資料記錄並標注，不作為結論依據。
                        </div>

                        <PrimaryButton onClick={() => { unlockAudio(); setPhase('scene1'); }} label="開始鑑定" />
                    </div>
                )}

                {/* ══ 情境一 ═════════════════════════════════════════════════ */}
                {phase === 'scene1' && (
                    <SceneBlock
                        time="三個版本的截圖並排在桌上"
                        mediaUrl="/assets/echo/backgrounds/ch4/echo_ch4_three_screenshots_v1.webp"
                        content={
                            <>
                                <p className="text-slate-300 leading-relaxed text-sm mb-4">
                                    你手上有三個傳播版本的截圖。它們有微妙差異：字體大小、時間格式、訊息排列方式略有不同。
                                </p>
                                <p className="text-slate-300 leading-relaxed text-sm mb-4">
                                    如果截圖是被偽造的，差異可能指向造假的過程；如果是真實截圖在流傳中被修改，差異的規律又不一樣。
                                </p>
                                <p className="text-slate-300 leading-relaxed text-sm">
                                    你打算怎麼分析這三個版本之間的差異？
                                </p>
                            </>
                        }
                        actionLabel="開始版本比對"
                        onAction={() => setPhase('choice1')}
                    />
                )}

                {/* ══ 決策一 ═════════════════════════════════════════════════ */}
                {phase === 'choice1' && (
                    <ChoiceBlock
                        nodeNum="01"
                        directive="版本比對要記錄差異的規律，不預設哪個版本更可信"
                        question="三個版本的截圖有微妙差異——你怎麼分析？"
                        choices={[
                            {
                                id: 'A',
                                text: '找出差異最小的兩個版本，把它們當成「最接近原始」的來源，第三個版本可能是有人修改過的，可信度較低。',
                            },
                            {
                                id: 'B',
                                text: '把三個版本逐行對照，為每一個差異標注「位置、改動方向（增加/刪除/替換）、涉及哪些元素」，不預設哪個更可信，先把差異的規律記錄下來再分析。',
                            },
                            {
                                id: 'C',
                                text: '聚焦在三個版本「共同有的部分」——三個版本都有的段落才是最可信的核心內容，差異的地方可能是流傳過程中被各自竄改的。',
                            },
                        ]}
                        onChoice={handleChoice1}
                    />
                )}

                {/* ══ 情境二 ═════════════════════════════════════════════════ */}
                {phase === 'scene2' && (
                    <SceneBlock
                        time="技術部門提供了截圖的 EXIF 資料"
                        mediaUrl="/assets/echo/backgrounds/ch4/echo_ch4_exif_data_v1.webp"
                        content={
                            <>
                                <p className="text-slate-300 leading-relaxed text-sm mb-4">
                                    EXIF 資料顯示，截圖的建立時間比謠言開始擴散早了整整兩天。
                                </p>
                                <p className="text-slate-300 leading-relaxed text-sm mb-4">
                                    這是一個強力的線索——但你也知道，EXIF 資料可以被軟體修改，它是技術性的間接證據，不是物理性的直接證據。
                                </p>
                                <p className="text-slate-300 leading-relaxed text-sm">
                                    你要怎麼在報告中運用這個發現？
                                </p>
                            </>
                        }
                        actionLabel="決定如何使用"
                        onAction={() => setPhase('choice2')}
                    />
                )}

                {/* ══ 決策二 ═════════════════════════════════════════════════ */}
                {phase === 'choice2' && (
                    <ChoiceBlock
                        nodeNum="02"
                        directive="間接證據必須說明局限性，不可做超出證據範圍的結論"
                        question="EXIF 時間戳記顯示截圖比謠言擴散早了兩天——你怎麼用這個發現？"
                        choices={[
                            {
                                id: 'A',
                                text: '這兩天的時間差幾乎可以確認截圖是事先準備好的——這是最有力的鑑偽證據，在報告中列為決定性結論。',
                            },
                            {
                                id: 'B',
                                text: '把 EXIF 時間戳記列入分析，同時說明其限制：EXIF 可以被軟體修改，因此它是「輔助性證據」而非「決定性證據」，需要與其他資料交叉確認。',
                            },
                            {
                                id: 'C',
                                text: 'EXIF 是間接的技術證據，在同學之間提出來對方一定會說「那個可以改的」，反而讓整個分析顯得薄弱。不提這個比較好。',
                            },
                        ]}
                        onChoice={handleChoice2}
                    />
                )}

                {/* ══ 情境三 ═════════════════════════════════════════════════ */}
                {phase === 'scene3' && (
                    <SceneBlock
                        time="搜尋外部參照資料時，在匿名討論串看到相關陳述"
                        mediaUrl="/assets/echo/backgrounds/ch4/echo_ch4_anonymous_thread_v1.webp"
                        content={
                            <>
                                <p className="text-slate-300 leading-relaxed text-sm mb-4">
                                    你找到一個匿名討論串，裡面有三個匿名帳號說：「我就是那個親身拿到禮物卡的人的朋友，這是真的。」
                                </p>
                                <p className="text-slate-300 leading-relaxed text-sm mb-4">
                                    三個帳號說法高度一致，但都無法核實身份——你想起第一章觀察到的兩個匿名帳號在謠言分叉點同時活躍。這種一致性可能是真實見證，也可能是協調的社群操弄。
                                </p>
                                <p className="text-slate-300 leading-relaxed text-sm">
                                    你要怎麼處理這些陳述？
                                </p>
                            </>
                        }
                        actionLabel="決定如何處理"
                        onAction={() => setPhase('choice3')}
                    />
                )}

                {/* ══ 決策三 ═════════════════════════════════════════════════ */}
                {phase === 'choice3' && (
                    <ChoiceBlock
                        nodeNum="03"
                        directive="可追溯性是引用依據的前提——無法核實的資料記錄並標注，不作為結論"
                        question="三個匿名帳號一致說「是真的」——你怎麼處理？"
                        choices={[
                            {
                                id: 'A',
                                text: '三個人一致說「是真的」，這是佐證。雖然匿名，但多人同說法本身就有參考價值，在分析報告中引用為「社群佐證」。',
                            },
                            {
                                id: 'B',
                                text: '只使用可追溯來源的資料：班聯會的公開紀錄、可驗證的時間序列。匿名陳述記錄在附錄，標注「無法核實」，不作為結論依據。',
                            },
                            {
                                id: 'C',
                                text: '這種匿名說法根本沒有意義，完全忽略它，繼續找其他資料。',
                            },
                        ]}
                        onChoice={handleChoice3}
                    />
                )}

                {/* ══ 任務失敗 ════════════════════════════════════════════════ */}
                {phase === 'fail' && failKey && (() => {
                    const r = FAIL_REASONS[failKey];
                    return (
                        <div>
                            <div className="relative w-full h-40 rounded-sm overflow-hidden border border-red-900/50 mb-5 shadow-2xl">
                                <div className="absolute inset-0 bg-cover bg-center grayscale opacity-60" style={{ backgroundImage: "url('/assets/echo/backgrounds/ch4/echo_ch4_fail_bg_v1.webp')" }}></div>
                                <div className="absolute inset-0 bg-red-950/40 mix-blend-color-burn"></div>
                                <div className="absolute inset-0 opacity-20 animate-pulse pointer-events-none bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/%3E%3C/svg%3E')] mix-blend-overlay"></div>
                                <div className="absolute bottom-4 left-4 text-red-500 font-mono text-xs tracking-[0.3em] font-black uppercase drop-shadow">System Warning // Task Aborted</div>
                            </div>
                            <div className="bg-red-950/30 border border-red-700/40 rounded p-6 mb-5">
                                <SectionLabel icon={<AlertTriangle size={13} />} text="任務中止報告" color="text-red-400" />
                                <h2 className="text-lg font-black text-red-300 mt-3 mb-4">{r.type}</h2>
                                <p className="text-slate-300 text-sm leading-relaxed mb-5">{r.detail}</p>
                                <div className="border-t border-red-700/20 pt-4">
                                    <span className="font-mono text-xs text-red-400/60">{r.concept}</span>
                                </div>
                            </div>
                            <button onClick={() => { unlockAudio(); retry(); }} className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-black py-4 rounded-sm transition-all flex items-center justify-center gap-2 text-sm">
                                <RotateCcw size={15} /> 重新執行任務
                            </button>
                        </div>
                    );
                })()}

                {/* ══ 任務完成 ════════════════════════════════════════════════ */}
                {phase === 'complete' && (
                    <div>
                        <div className="relative w-full h-48 rounded-sm overflow-hidden border border-cyan-900/50 mb-5 shadow-2xl">
                            <div className="absolute inset-0 bg-cover bg-center transition-transform duration-[15s] hover:scale-105" style={{ backgroundImage: "url('/assets/echo/backgrounds/ch4/echo_ch4_complete_bg_v1.webp')" }}></div>
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent"></div>
                            <div className="absolute inset-0 opacity-30 mix-blend-overlay pointer-events-none" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/%3E%3C/svg%3E')" }}></div>
                            <div className="absolute bottom-4 left-4 text-cyan-400 font-mono text-xs tracking-[0.3em] font-black uppercase drop-shadow">Document Analysis Complete</div>
                        </div>

                        <div className="bg-cyan-950/20 border border-cyan-700/30 rounded p-6 mb-5">
                            <SectionLabel icon={<CheckCircle size={13} />} text="任務完成" color="text-cyan-400" />
                            <h2 className="text-xl font-black text-cyan-300 mt-3 mb-4">★ 截圖鑑定完成</h2>
                            <p className="text-slate-300 text-sm leading-relaxed mb-6">
                                你系統性地比對了三個截圖版本、正確處理了 EXIF 間接證據、並在可追溯性的框架下篩選了資料引用。最重要的是：你找到了一個班聯會公開選舉規則指向的邏輯矛盾——截圖所描述的情境，在時間框架下根本不可能成立。
                            </p>

                            <div className="border-t border-cyan-700/20 pt-5">
                                <div className="font-mono text-xs text-cyan-500/70 tracking-widest mb-3">文獻分析報告已入庫</div>
                                <div className="space-y-2">
                                    <EvidenceItem text="三個截圖版本的差異規律：字體大小和時間格式的改動，符合「二次修改」而非「不同裝置截圖」的特徵" />
                                    <EvidenceItem text="EXIF 時間戳記（輔助性）：截圖建立時間比謠言擴散早兩天，但 EXIF 可被修改，不作為決定性證據" />
                                    <EvidenceItem text="匿名討論串陳述：已記錄在附錄，標注「無法核實」，三帳號高度一致性本身是值得注意的模式" />
                                    <EvidenceItem
                                        text="★ 班聯會選舉規則顯示：候選人在投票前 48 小時進入「沉默期」，不得以任何形式接觸選民。截圖中描述的「投票前一晚禮物卡交換」，在規則框架下根本無法在任何已知地點發生——陳宇佳當晚有可被調閱的出入紀錄"
                                        highlight
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-900/60 border border-slate-800 rounded p-5 mb-5">
                            <p className="text-slate-400 text-xs leading-relaxed mb-3">你已經有時間線、有版本矛盾，也有邏輯上的不可能。現在缺的不是更多懷疑——而是一個能被反覆檢查的答案。如果這種表象能被穩定重現，它就不只是傳言，而是設計。</p>
                            <div className="font-mono text-xs text-slate-600">第五章｜實驗法：可控重現 — 已解鎖</div>
                        </div>

                        <PrimaryButton onClick={() => navigate('/echo')} label="返回調查檔案" />
                    </div>
                )}

            </div>
        </div>
    );
};

// ─── 共用小元件 ───────────────────────────────────────────────────────────────

const ChapterLabel = ({ num, method }) => (
    <div className="flex items-center gap-3 mb-3">
        <span className="text-slate-600 font-mono text-xs">第 {num} 章</span>
        <span className="text-slate-700 text-xs">·</span>
        <span className="text-cyan-400 font-mono text-xs">{method}</span>
    </div>
);

const SectionLabel = ({ icon, text, color = 'text-cyan-400' }) => (
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
        className="w-full bg-cyan-700 hover:bg-cyan-600 text-white font-black py-4 rounded-sm transition-all flex items-center justify-center gap-2 text-sm"
    >
        {label} <ChevronRight size={16} />
    </button>
);

const SceneBlock = ({ time, content, actionLabel, onAction, mediaUrl }) => (
    <div className="overflow-hidden bg-slate-900 border border-slate-700 rounded-lg mb-8 shadow-2xl">
        {mediaUrl && (
            <div className="relative w-full aspect-[21/9] bg-slate-950">
                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-[10s] hover:scale-[1.03] origin-bottom" style={{ backgroundImage: `url('${mediaUrl}')` }} />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
                <div className="absolute inset-0 opacity-10 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(0,200,200,0.04),rgba(0,150,200,0.02),rgba(0,200,200,0.04))] bg-[length:100%_4px,3px_100%] mix-blend-overlay"></div>
                <div className="absolute top-4 left-4 font-mono text-cyan-400 font-bold text-[10px] tracking-widest bg-slate-950/80 px-2 py-1 rounded backdrop-blur-md border border-cyan-900/50 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse"></span>
                    LOG • {time}
                </div>
            </div>
        )}
        <div className={`p-6 ${mediaUrl ? 'pt-4' : ''}`}>
            {!mediaUrl && <div className="font-mono text-cyan-600/60 text-xs tracking-widest mb-4">{time}</div>}
            <div className="text-slate-300 text-sm leading-relaxed mb-6 space-y-4">{content}</div>
            <button onClick={onAction} className="w-full bg-slate-800 hover:bg-slate-700 border border-transparent hover:border-cyan-500/50 text-slate-200 font-black py-4 rounded-sm transition-all flex items-center justify-center gap-2 text-sm">
                {actionLabel} <ChevronRight size={16} />
            </button>
        </div>
    </div>
);

const ChoiceBlock = ({ nodeNum, question, choices, onChoice, directive }) => (
    <div>
        <div className="font-mono text-cyan-600/60 text-xs tracking-widest mb-2">決策節點 {nodeNum}</div>
        {directive && (
            <div className="text-[10px] font-mono text-slate-600 tracking-widest mb-4 flex items-center gap-2">
                <span className="text-slate-700">◈</span> 行動守則：{directive}
            </div>
        )}
        <h2 className="text-base font-black text-white mb-6">{question}</h2>
        <div className="space-y-3">
            {choices.map(c => (
                <button key={c.id} onClick={() => onChoice(c.id)} className="w-full text-left bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-cyan-600/40 rounded p-5 transition-all group">
                    <div className="flex items-start gap-3">
                        <span className="font-mono text-cyan-400 font-bold text-sm flex-shrink-0 mt-0.5 w-4">{c.id}</span>
                        <span className="text-slate-300 text-sm leading-relaxed group-hover:text-white transition-colors">{c.text}</span>
                    </div>
                </button>
            ))}
        </div>
    </div>
);

const EvidenceItem = ({ text, highlight }) => (
    <div className={`flex items-start gap-2 text-xs py-2 px-3 rounded-sm ${highlight ? 'bg-cyan-900/20 text-cyan-300' : 'text-slate-400'}`}>
        <span className={`flex-shrink-0 mt-0.5 ${highlight ? 'text-cyan-400' : 'text-slate-600'}`}>◆</span>
        <span>{text}</span>
    </div>
);
