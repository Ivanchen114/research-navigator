import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FileText, AlertTriangle, CheckCircle,
    RotateCcw, ChevronRight, Volume2, VolumeX
} from 'lucide-react';

// ─── localStorage key 常數 ────────────────────────────────────────────────────
const STORAGE_KEYS = {
    agentName:   'rib_agent_name',
    ch5Complete: 'echo_ch5_complete',
    ch5Optimal:  'echo_ch5_optimal',
};

// ─── 失敗原因資料 ──────────────────────────────────────────────────────────────
const FAIL_REASONS = {
    ch1_A: {
        type: '任務中止：N=1 且選擇偏誤，測試的問題錯了',
        detail: '找技術最好的人，你問的問題變成了「最強的人能做到嗎」，而不是「一般人輕鬆能做到嗎」。這兩個問題對案件有完全不同的意義。如果只有技術頂尖的人才能偽造，那這個謠言的製造者是誰，範圍就大幅縮小了——但你的設計無法得出這個結論。',
        concept: '實驗法核心：實驗設計的問題定義——測試的對象必須對應你想回答的問題',
        retryPhase: 'scene1',
    },
    ch1_C: {
        type: '任務中止：研究者自行測試，結論無法推論至他人',
        detail: '「因為我做到了」不是有效的研究結論——讀者會問：「但你懂技術，你不是一般人」。研究者的個人能力不能代表一般情況。自行測試的另一個問題是，你同時是研究者和受試者，客觀性從根本上受損。',
        concept: '實驗法核心：受試者獨立性——研究者不應同時擔任受試者',
        retryPhase: 'scene1',
    },
    ch2_A: {
        type: '任務中止：排除不符期待的數據，是研究誠信的底線',
        detail: '那個「做不到」的結果，反而可能是最重要的發現——它告訴你偽造的難易度和使用者環境有關。更重要的是：如果那個「做不到」的設備系統比較常見，那這整個謠言的技術門檻其實比你想的高，可能的造假者範圍就縮小了。你扔掉了最有價值的線索。',
        concept: '實驗法核心：研究誠信——不可刪除不符合期待的數據',
        retryPhase: 'scene2',
    },
    ch2_C: {
        type: '任務中止：把自然出現的多樣性誤認為「設計失誤」',
        detail: '「不一致代表設計有問題」有個根本缺陷：如果研究對象本來就是多樣的，強迫他們在相同條件下測試反而消除了真實世界的多樣性。你的研究問題正是「一般學生」，而「一般學生」本來就用不同設備。三個人結果不同，是真實的發現，不是雜訊。',
        concept: '實驗法核心：異常結果的意義——意料外的結果往往是重要發現，不是錯誤',
        retryPhase: 'scene2',
    },
    ch3_A: {
        type: '任務中止：未經同意公開可識別資訊，讓參與者承擔社會風險',
        detail: '列出姓名和班級，讓三個幫你做實驗的同學，被打上「協助偽造截圖」的標籤——即使是為了研究目的。他們沒有同意承擔這個社會風險，也沒有料到自己的名字會出現在一份關於謠言案件的報告中。說服力不能以他人的個資風險換取。',
        concept: '實驗法核心：研究倫理——研究對象的個人資訊必須受到保護',
        retryPhase: 'scene3',
    },
    ch3_C: {
        type: '任務中止：過度匿名讓讀者無法評估方法有效性',
        detail: '「有人能輕鬆完成偽造」是一個沒有任何研究依據的陳述。讀者無法知道是幾個人、什麼背景、什麼條件。代號（A、B、C）加上設備環境，已經足夠讓讀者評估方法可靠性，同時不洩露任何可識別資訊。過度匿名不是保護，是讓整個實驗喪失說服力。',
        concept: '實驗法核心：匿名化的邊界——保護隱私不等於消除方法透明度',
        retryPhase: 'scene3',
    },
};

// ─── 主元件 ───────────────────────────────────────────────────────────────────
export const EchoCh5 = () => {
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
        setHadPrevOptimal(localStorage.getItem('echo_ch4_optimal') === 'true');
        window.scrollTo(0, 0);

        const imgs = [
            '/assets/echo/covers/echo_cover_ch5_bg_v1.webp',
            '/assets/echo/backgrounds/ch5/echo_ch5_experiment_design_v1.webp',
            '/assets/echo/backgrounds/ch5/echo_ch5_unexpected_result_v1.webp',
            '/assets/echo/backgrounds/ch5/echo_ch5_report_writing_v1.webp',
            '/assets/echo/backgrounds/ch5/echo_ch5_fail_bg_v1.webp',
            '/assets/echo/backgrounds/ch5/echo_ch5_complete_bg_v1.webp',
        ];
        imgs.forEach(src => { const img = new Image(); img.src = src; });
    }, []);

    const fail = (key) => { setFailKey(key); setPhase('fail'); };

    // Ch5 Node3 only has one pass option (B), which is also the optimal
    const complete = () => {
        localStorage.setItem(STORAGE_KEYS.ch5Complete, 'true');
        localStorage.setItem(STORAGE_KEYS.ch5Optimal, 'true');
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
                <button onClick={() => navigate('/echo')} className="text-slate-500 hover:text-amber-400 transition-colors">
                    R.I.B. 調查檔案
                </button>
                <span className="text-slate-700">/</span>
                <span className="text-amber-400/70">回聲</span>
                <span className="text-slate-700">/</span>
                <span className="text-slate-300">第五章｜可控重現</span>
                <div className="ml-auto flex items-center gap-3">
                    <button onClick={toggleMute} title={isMuted ? '開啟音效' : '靜音'} className="text-slate-500 hover:text-amber-400 transition-colors">
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
                            <div className="absolute inset-0 bg-cover bg-center transition-transform duration-[20s] hover:scale-105" style={{ backgroundImage: "url('/assets/echo/covers/echo_cover_ch5_bg_v1.webp')" }}></div>
                            <div className="absolute inset-0 bg-gradient-to-br from-amber-950/60 via-slate-950/60 to-transparent"></div>
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
                            <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-overlay" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/%3E%3C/svg%3E')" }}></div>
                            <div className="absolute bottom-6 left-6 right-6">
                                <ChapterLabel num="05" method="實驗法" />
                                <h1 className="text-3xl sm:text-4xl font-black text-white mt-2 drop-shadow-md">可控重現</h1>
                            </div>
                        </div>

                        <div className="bg-slate-900 border border-slate-700 rounded p-6 mb-5 space-y-4">
                            <SectionLabel icon={<FileText size={13} />} text="任務簡報" />
                            <p className="text-slate-300 leading-relaxed text-sm">
                                到了這一步，你已經知道這張圖有太多不合理：版本分叉、時間軸矛盾、規則框架根本不成立。可是「不合理」，還不是最後一步。
                            </p>
                            <p className="text-slate-300 leading-relaxed text-sm">
                                你現在要測的是另一件事——這種「看起來足夠像真相的表象」，到底能不能被普通人輕易做出來。如果偽造門檻極低，就意味著「截圖存在」不等於「事情發生過」。
                            </p>
                            <div className="grid grid-cols-3 gap-4 border-t border-slate-700 pt-4 text-xs">
                                <MiniStat label="實驗目標" value="偽造門檻測試" />
                                <MiniStat label="受試者" value="一般學生 3 位" />
                                <MiniStat label="對照設計" value="實驗組 vs 真實截圖" />
                            </div>
                        </div>

                        {hadPrevOptimal && (
                            <div className="bg-amber-950/20 border border-amber-700/30 rounded p-4 mb-5 text-xs text-amber-300/80 leading-relaxed">
                                <strong className="text-amber-400">★ 前章線索繼承：</strong>你知道截圖中描述的情境在時間上根本不可能成立。實驗的目標因此從「能不能偽造」升級為「這麼精準的情境是怎麼設計出來的」。
                            </div>
                        )}

                        <div className="bg-amber-950/20 border border-amber-700/30 rounded p-4 mb-8 text-xs text-amber-300/80 leading-relaxed">
                            <strong className="text-amber-400">實驗法的核心規則：</strong>受試者必須對應研究問題，異常結果是發現而非錯誤，研究對象的個資需受保護，匿名化不等於消除方法透明度。
                        </div>

                        <PrimaryButton onClick={() => { unlockAudio(); setPhase('scene1'); }} label="開始設計實驗" />
                    </div>
                )}

                {/* ══ 情境一 ═════════════════════════════════════════════════ */}
                {phase === 'scene1' && (
                    <SceneBlock
                        time="規劃重現實驗"
                        mediaUrl="/assets/echo/backgrounds/ch5/echo_ch5_experiment_design_v1.webp"
                        content={
                            <>
                                <p className="text-slate-300 leading-relaxed text-sm mb-4">
                                    你需要設計一個實驗，測試「像那張截圖這樣的外觀，偽造起來有多容易」。
                                </p>
                                <p className="text-slate-300 leading-relaxed text-sm mb-4">
                                    這個問題的答案，取決於你選誰來測試——選錯了測試對象，你得到的結論就跟你想問的問題對不上。
                                </p>
                                <p className="text-slate-300 leading-relaxed text-sm">
                                    你要怎麼設計這個實驗？
                                </p>
                            </>
                        }
                        actionLabel="決定實驗設計"
                        onAction={() => setPhase('choice1')}
                    />
                )}

                {/* ══ 決策一 ═════════════════════════════════════════════════ */}
                {phase === 'choice1' && (
                    <ChoiceBlock
                        nodeNum="01"
                        directive="實驗設計的受試者必須對應你想回答的問題"
                        question="你要怎麼設計截圖偽造可複製性的實驗？"
                        choices={[
                            {
                                id: 'A',
                                text: '找一個技術最好的同學，讓他試著偽造一份類似截圖，看能不能以假亂真——如果連他都做到了，就代表截圖可能是假的。',
                            },
                            {
                                id: 'B',
                                text: '設計有對照組的實驗：實驗組是隨機找三個沒有特殊技術的普通同學，各自獨立嘗試重現相似外觀；對照組用真實的對話截圖（取得同意）做比對基準。評估「一般使用者」的難易度。',
                            },
                            {
                                id: 'C',
                                text: '自己親自試做一次，如果你都能輕鬆完成，那代表任何人都可以做到——你還能直接描述整個過程，讓報告更有說服力。',
                            },
                        ]}
                        onChoice={handleChoice1}
                    />
                )}

                {/* ══ 情境二 ═════════════════════════════════════════════════ */}
                {phase === 'scene2' && (
                    <SceneBlock
                        time="三個測試者中，兩個輕鬆完成，一個完全做不到"
                        mediaUrl="/assets/echo/backgrounds/ch5/echo_ch5_unexpected_result_v1.webp"
                        content={
                            <>
                                <p className="text-slate-300 leading-relaxed text-sm mb-4">
                                    實驗結果出來了。三個普通學生中，兩個相對順利地重現了相似的外觀，一個完全做不到——因為他用的是不同的手機系統，介面排版邏輯完全不一樣。
                                </p>
                                <p className="text-slate-300 leading-relaxed text-sm mb-4">
                                    這個「做不到」的結果是你事先沒有預期的。
                                </p>
                                <p className="text-slate-300 leading-relaxed text-sm">
                                    你怎麼處理這個意外？
                                </p>
                            </>
                        }
                        actionLabel="決定如何處理"
                        onAction={() => setPhase('choice2')}
                    />
                )}

                {/* ══ 決策二 ═════════════════════════════════════════════════ */}
                {phase === 'choice2' && (
                    <ChoiceBlock
                        nodeNum="02"
                        directive="意料外的結果往往是重要發現——不可刪除，也不是設計失誤"
                        question="三個測試者結果不一致——你怎麼處理這個意外？"
                        choices={[
                            {
                                id: 'A',
                                text: '把那個「做不到」的結果排除——他用的是少數設備系統，不代表一般情況，保留他的數據只會讓結論變得模糊。',
                            },
                            {
                                id: 'B',
                                text: '三個結果都完整記錄，指出設備差異導致結果分歧，並分析這對案件的意義：如果截圖需要特定設備才能重現相似外觀，那就縮小了可能的造假者範圍。',
                            },
                            {
                                id: 'C',
                                text: '三個結果不一致代表實驗設計本身有問題，條件沒控制好。這次測試無效，需要重新設計一個更嚴格控制變因的實驗。',
                            },
                        ]}
                        onChoice={handleChoice2}
                    />
                )}

                {/* ══ 情境三 ═════════════════════════════════════════════════ */}
                {phase === 'scene3' && (
                    <SceneBlock
                        time="撰寫最終報告，需要描述三個參與實驗的同學"
                        mediaUrl="/assets/echo/backgrounds/ch5/echo_ch5_report_writing_v1.webp"
                        content={
                            <>
                                <p className="text-slate-300 leading-relaxed text-sm mb-4">
                                    三個幫你做實驗的同學，他們的測試過程和結果需要出現在報告中。
                                </p>
                                <p className="text-slate-300 leading-relaxed text-sm mb-4">
                                    你要保護他們的個人資訊——他們沒有打算讓自己的名字和一份關於謠言案件的調查報告綁在一起。但你也不能讓報告的方法論失去可信度。
                                </p>
                                <p className="text-slate-300 leading-relaxed text-sm">
                                    你要怎麼在報告中呈現這三位參與者？
                                </p>
                            </>
                        }
                        actionLabel="決定呈現方式"
                        onAction={() => setPhase('choice3')}
                    />
                )}

                {/* ══ 決策三 ═════════════════════════════════════════════════ */}
                {phase === 'choice3' && (
                    <ChoiceBlock
                        nodeNum="03"
                        directive="保護個資不等於消除方法透明度——代號＋設備環境已足夠"
                        question="你要怎麼在報告中呈現三位參與實驗的同學？"
                        choices={[
                            {
                                id: 'A',
                                text: '列出他們的姓名和班級，讓報告更具說服力——真實的同學參與了實驗，讀者可以自行核實。',
                            },
                            {
                                id: 'B',
                                text: '使用代號（參與者 A、B、C），記錄設備環境和結果，不涉及個人可識別資訊。報告方法論說明中，寫明「已取得參與者口頭同意」。',
                            },
                            {
                                id: 'C',
                                text: '整個實驗部分都匿名呈現，連設備系統也不寫，只描述結論：「有人能完成相似外觀的重現」——過多細節可能讓別人追溯到參與者是誰。',
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
                                <div className="absolute inset-0 bg-cover bg-center grayscale opacity-60" style={{ backgroundImage: "url('/assets/echo/backgrounds/ch5/echo_ch5_fail_bg_v1.webp')" }}></div>
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

                {/* ══ 任務完成（含 allOptimal 結案結語） ═════════════════════ */}
                {phase === 'complete' && (() => {
                    const allOptimal = ['ch1', 'ch2', 'ch3', 'ch4', 'ch5'].every(
                        n => localStorage.getItem(`echo_${n}_optimal`) === 'true'
                    );
                    return (
                        <div>
                            <div className="relative w-full h-48 rounded-sm overflow-hidden border border-amber-900/50 mb-5 shadow-2xl">
                                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-[15s] hover:scale-105" style={{ backgroundImage: "url('/assets/echo/backgrounds/ch5/echo_ch5_complete_bg_v1.webp')" }}></div>
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent"></div>
                                <div className="absolute inset-0 opacity-30 mix-blend-overlay pointer-events-none" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/%3E%3C/svg%3E')" }}></div>
                                <div className="absolute bottom-4 left-4 text-amber-400 font-mono text-xs tracking-[0.3em] font-black uppercase drop-shadow">
                                    {allOptimal ? 'ECHO — Case Closed // Full Record Unlocked' : 'ECHO — Case Closed'}
                                </div>
                            </div>

                            {/* ── 本章完成紀錄 ── */}
                            <div className="bg-amber-950/20 border border-amber-700/30 rounded p-6 mb-5">
                                <SectionLabel icon={<CheckCircle size={13} />} text="第五章完成" color="text-amber-400" />
                                <h2 className="text-xl font-black text-amber-300 mt-3 mb-4">★ 重現實驗完成</h2>
                                <p className="text-slate-300 text-sm leading-relaxed mb-6">
                                    你設計了有對照組的實驗，完整記錄了三個不同結果，並用代號保護了參與者。更重要的是：那個「做不到」的結果，反而告訴你了截圖對設備的依賴性——縮小了可能造假者的範圍。
                                </p>
                                <div className="border-t border-amber-700/20 pt-5">
                                    <div className="font-mono text-xs text-amber-500/70 tracking-widest mb-3">實驗結果已入庫</div>
                                    <div className="space-y-2">
                                        <EvidenceItem text="參與者 A：使用主流手機系統，順利重現相似外觀，耗時約 8 分鐘" />
                                        <EvidenceItem text="參與者 B：使用主流手機系統，順利重現相似外觀，耗時約 12 分鐘" />
                                        <EvidenceItem text="參與者 C：使用少數手機系統，介面排版邏輯不同，無法重現——偽造需要特定設備條件" />
                                        <EvidenceItem
                                            text="★ 能輕鬆重現的參與者 A、B 所使用的手機型號，在技術鑑識上與第一章觀察到的兩個匿名帳號活躍節點顯示為同一型號的裝置——五章的調查，最終指向同一個技術特徵"
                                            highlight
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* ── 一般通關結語 ── */}
                            <div className="bg-slate-900 border border-slate-700 rounded p-6 mb-5">
                                <div className="font-mono text-xs text-slate-500 tracking-widest mb-4">ECHO — 案件結案</div>
                                <p className="text-slate-300 text-sm leading-relaxed mb-4">
                                    五週的調查，五種方法，從不同角度逐一拆解了這場謠言。截圖是偽造的，時間軸無法成立，散播源頭有跡可循。案件結案，相關資料移交給學校行政。
                                </p>
                                <p className="text-slate-300 text-sm leading-relaxed mb-4">
                                    陳宇佳重返班聯會。但謠言留下的那些眼神，沒有那麼快消失。
                                </p>
                                <p className="text-slate-300 text-sm leading-relaxed mb-4">
                                    你沒有抓出一個能替所有事負責的人；你抓出的，是一整套讓錯誤訊息變得可信、變得可傳、最後像共識一樣存在的機制。
                                </p>
                                <p className="text-slate-300 text-sm leading-relaxed mb-4">
                                    學校在一個月後啟動了一場全年級的班級討論，主題是：「我們怎麼決定相信一件事？」沒有人因為這場謠言受到懲處——傳謠的人太多，而且大多數人只是「沒有停下來問一句」。沒有人能保證下次不再發生。但至少這一次，有人把過程講清楚了。
                                </p>
                                <p className="text-slate-400 text-xs leading-relaxed italic">
                                    後來有人私下承認，自己其實從一開始就覺得那張圖怪怪的，只是當時沒說。真正讓謠言長大的，從來不只是一張假圖，而是那些沒有被說出口的懷疑。
                                </p>
                            </div>

                            {/* ── 完美通關追加段落 ── */}
                            {allOptimal && (
                                <div className="bg-amber-950/20 border border-amber-600/40 rounded p-6 mb-5">
                                    <div className="font-mono text-xs text-amber-500/80 tracking-widest mb-4">完整調查紀錄解鎖 — ECHO FULL RECORD</div>
                                    <p className="text-amber-200 text-sm leading-relaxed mb-5">
                                        你不只破解了這個案件，你還記錄了一場謠言從第一個字到全面擴散的完整路徑：
                                    </p>
                                    <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
                                        <div className="flex gap-3">
                                            <span className="text-amber-500 flex-shrink-0 font-mono font-bold">Ch1</span>
                                            <span>最早流傳的截圖存在兩個版本。現金版本比禮物卡版本晚出現了兩小時，版本分叉指向兩個同時活躍的匿名帳號。</span>
                                        </div>
                                        <div className="flex gap-3">
                                            <span className="text-amber-500 flex-shrink-0 font-mono font-bold">Ch2</span>
                                            <span>外部時間戳顯示陳思妤不是「第一個看到的人」，她是第二批。那 5 分鐘的差距，指向同一個班群裡另一個人。</span>
                                        </div>
                                        <div className="flex gap-3">
                                            <span className="text-amber-500 flex-shrink-0 font-mono font-bold">Ch3</span>
                                            <span>問卷開放題裡，三位不同班的受訪者都提到「福利社後方樓梯口」和那句「這樣比較安全」——這個細節從未出現在任何公開截圖版本裡，指向一個更早、刻意低調的私下傳播源。</span>
                                        </div>
                                        <div className="flex gap-3">
                                            <span className="text-amber-500 flex-shrink-0 font-mono font-bold">Ch4</span>
                                            <span>班聯會選舉規則顯示截圖描述的情境在時間框架下根本不可能成立——陳宇佳當晚有可被調閱的出入紀錄。</span>
                                        </div>
                                        <div className="flex gap-3">
                                            <span className="text-amber-500 flex-shrink-0 font-mono font-bold">Ch5</span>
                                            <span>製造截圖所需的設備型號，與第一章觀察到的匿名帳號技術特徵吻合——五章的調查，最終指向同一個技術特徵。</span>
                                        </div>
                                    </div>
                                    <div className="border-t border-amber-700/30 pt-4 mt-5">
                                        <p className="text-amber-400/80 text-xs font-mono">
                                            R.I.B. 把這份調查報告歸入資料庫。<br />
                                            檔案標題是：<strong className="text-amber-300">ECHO — 一個群體如何把不確定，變成確信。</strong>
                                        </p>
                                    </div>
                                </div>
                            )}

                            {!allOptimal && (
                                <div className="bg-slate-900/60 border border-slate-700 rounded p-4 mb-5 text-xs text-slate-500 font-mono leading-relaxed">
                                    案件結案 — 仍有部分細節標著「待確認」的黃色標籤。如果你願意，可以重新進入案件，試著把每一個決策點都推到最深處。
                                </div>
                            )}

                            <PrimaryButton
                                onClick={() => navigate('/echo')}
                                label={allOptimal ? '案件完結，查閱完整檔案' : '再次挑戰，找出所有線索'}
                            />
                        </div>
                    );
                })()}

            </div>
        </div>
    );
};

// ─── 共用小元件 ───────────────────────────────────────────────────────────────

const ChapterLabel = ({ num, method }) => (
    <div className="flex items-center gap-3 mb-3">
        <span className="text-slate-600 font-mono text-xs">第 {num} 章</span>
        <span className="text-slate-700 text-xs">·</span>
        <span className="text-amber-400 font-mono text-xs">{method}</span>
    </div>
);

const SectionLabel = ({ icon, text, color = 'text-amber-400' }) => (
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
                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-[10s] hover:scale-[1.03] origin-bottom" style={{ backgroundImage: `url('${mediaUrl}')` }} />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
                <div className="absolute inset-0 opacity-10 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(200,150,50,0.04),rgba(180,120,0,0.02),rgba(200,150,50,0.04))] bg-[length:100%_4px,3px_100%] mix-blend-overlay"></div>
                <div className="absolute top-4 left-4 font-mono text-amber-400 font-bold text-[10px] tracking-widest bg-slate-950/80 px-2 py-1 rounded backdrop-blur-md border border-amber-900/50 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                    LOG • {time}
                </div>
            </div>
        )}
        <div className={`p-6 ${mediaUrl ? 'pt-4' : ''}`}>
            {!mediaUrl && <div className="font-mono text-amber-600/60 text-xs tracking-widest mb-4">{time}</div>}
            <div className="text-slate-300 text-sm leading-relaxed mb-6 space-y-4">{content}</div>
            <button onClick={onAction} className="w-full bg-slate-800 hover:bg-slate-700 border border-transparent hover:border-amber-500/50 text-slate-200 font-black py-4 rounded-sm transition-all flex items-center justify-center gap-2 text-sm">
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
                <button key={c.id} onClick={() => onChoice(c.id)} className="w-full text-left bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-amber-600/40 rounded p-5 transition-all group">
                    <div className="flex items-start gap-3">
                        <span className="font-mono text-amber-400 font-bold text-sm flex-shrink-0 mt-0.5 w-4">{c.id}</span>
                        <span className="text-slate-300 text-sm leading-relaxed group-hover:text-white transition-colors">{c.text}</span>
                    </div>
                </button>
            ))}
        </div>
    </div>
);

const EvidenceItem = ({ text, highlight }) => (
    <div className={`flex items-start gap-2 text-xs py-2 px-3 rounded-sm ${highlight ? 'bg-amber-900/20 text-amber-300' : 'text-slate-400'}`}>
        <span className={`flex-shrink-0 mt-0.5 ${highlight ? 'text-amber-400' : 'text-slate-600'}`}>◆</span>
        <span>{text}</span>
    </div>
);
