import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FileText, AlertTriangle, CheckCircle,
    RotateCcw, ChevronRight, Volume2, VolumeX
} from 'lucide-react';

// ─── localStorage key 常數 ────────────────────────────────────────────────────
const STORAGE_KEYS = {
    agentName:   'rib_agent_name',
    ch2Complete: 'echo_ch2_complete',
    ch2Optimal:  'echo_ch2_optimal',
};

// ─── 失敗原因資料 ──────────────────────────────────────────────────────────────
const FAIL_REASONS = {
    ch1_A: {
        type: '任務中止：帶有道德評判的問句導致防禦性回答',
        detail: '「你有沒有想過陳宇佳的感受？」這種問句不是在蒐集資訊，而是在進行道德評判。受訪者面對這種問題，不是防禦性地解釋自己，就是說出她認為你「想聽的」答案。兩種情況下，你得到的都不是真實資訊——你只是在拿訪談做評判工具。',
        concept: '訪談法核心：中立問句——問句不應預設立場或引導道德評價',
        retryPhase: 'scene1',
    },
    ch1_C: {
        type: '任務中止：缺乏結構的訪談無法比較多位受訪者的說法',
        detail: '開放靈活的訪談適合探索性研究，但你現在需要追蹤同一件事在三個人之間的版本差異。如果每個人的問題都不一樣，你就沒辦法逐條比對他們的說法。完全不準備問題，訪談很容易被受訪者帶著走，問到的是她想說的，而不是你需要知道的。',
        concept: '訪談法核心：半結構式訪談的設計邏輯',
        retryPhase: 'scene1',
    },
    ch2_A: {
        type: '任務中止：對質式語言讓受訪者關閉',
        detail: '直接說「我不相信你」會讓受訪者本能地自我保護。即使他真的在說謊，你也不會在這個瞬間得到真相——你只會得到一個更圓融的謊言，或者讓他停止配合。訪談的藝術是讓矛盾自然浮現，不是逼受訪者當場認罪。',
        concept: '訪談法核心：矛盾處理技巧——以細節問句讓矛盾自我暴露',
        retryPhase: 'scene2',
    },
    ch2_C: {
        type: '任務中止：放棄追問，讓未核實說法直接進入紀錄',
        detail: '「不要在訪談中戳破受訪者」這個原則是對的，但它的意思是「不要直接對質」，不是「完全不追問矛盾」。一個「認識那個人」卻說不出名字的陳述，在研究紀錄上是一個巨大的漏洞。完全跳過，等於讓你的報告建立在一個你知道站不住腳的說法上。',
        concept: '訪談法核心：核實義務——察覺矛盾後必須追問，但方式要間接',
        retryPhase: 'scene2',
    },
    ch3_A: {
        type: '任務中止：多數決不等於事實',
        detail: '三個人同樣記錯的可能性很高，尤其他們都在同一個社交圈、都看到同一則謠言。「兩個人都這樣說」只代表「這個說法流傳廣」，不代表它是真的。把「重疊最多」當成「最可信」，是把社群共識誤認為事實。',
        concept: '訪談法核心：三角驗證（Triangulation）——不以多數決判斷真假，而以外部獨立來源確認',
        retryPhase: 'scene3',
    },
    ch3_C: {
        type: '任務中止：放棄主動驗證，三角驗證形同虛設',
        detail: '「記憶不可靠，所以記錄矛盾但不解讀」不是三角驗證，那只是存檔。三角驗證的意義在於主動找第三個獨立來源，去確認兩個說法中哪一個更接近可驗證的事實。放棄這個步驟，等於讓矛盾永遠是謎。',
        concept: '訪談法核心：三角驗證的執行——主動尋找外部參照點，而非被動存檔矛盾',
        retryPhase: 'scene3',
    },
};

// ─── 主元件 ───────────────────────────────────────────────────────────────────
export const EchoCh2 = () => {
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
        setHadPrevOptimal(localStorage.getItem('echo_ch1_optimal') === 'true');
        window.scrollTo(0, 0);

        const imgs = [
            '/assets/echo/covers/echo_cover_ch2_bg_v1.webp',
            '/assets/echo/backgrounds/ch2/echo_ch2_interview_prep_v1.webp',
            '/assets/echo/backgrounds/ch2/echo_ch2_interview_conflict_v1.webp',
            '/assets/echo/backgrounds/ch2/echo_ch2_compare_notes_v1.webp',
            '/assets/echo/backgrounds/ch2/echo_ch2_fail_bg_v1.webp',
            '/assets/echo/backgrounds/ch2/echo_ch2_complete_bg_v1.webp',
        ];
        imgs.forEach(src => { const img = new Image(); img.src = src; });
    }, []);

    const fail = (key) => { setFailKey(key); setPhase('fail'); };

    // Ch2 Node3 only has one pass option (B) and it is also the optimal
    const complete = () => {
        localStorage.setItem(STORAGE_KEYS.ch2Complete, 'true');
        localStorage.setItem(STORAGE_KEYS.ch2Optimal, 'true');
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
                <button onClick={() => navigate('/echo')} className="text-slate-500 hover:text-violet-400 transition-colors">
                    R.I.B. 調查檔案
                </button>
                <span className="text-slate-700">/</span>
                <span className="text-violet-400/70">回聲</span>
                <span className="text-slate-700">/</span>
                <span className="text-slate-300">第二章｜目擊者</span>
                <div className="ml-auto flex items-center gap-3">
                    <button onClick={toggleMute} title={isMuted ? '開啟音效' : '靜音'} className="text-slate-500 hover:text-violet-400 transition-colors">
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
                            <div className="absolute inset-0 bg-cover bg-center transition-transform duration-[20s] hover:scale-105" style={{ backgroundImage: "url('/assets/echo/covers/echo_cover_ch2_bg_v1.webp')" }}></div>
                            <div className="absolute inset-0 bg-gradient-to-br from-violet-950/80 via-slate-950/60 to-transparent"></div>
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
                            <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-overlay" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/%3E%3C/svg%3E')" }}></div>
                            <div className="absolute bottom-6 left-6 right-6">
                                <ChapterLabel num="02" method="訪談法" />
                                <h1 className="text-3xl sm:text-4xl font-black text-white mt-2 drop-shadow-md">目擊者</h1>
                            </div>
                        </div>

                        <div className="bg-slate-900 border border-slate-700 rounded p-6 mb-5 space-y-4">
                            <SectionLabel icon={<FileText size={13} />} text="任務簡報" />
                            <p className="text-slate-300 leading-relaxed text-sm">
                                你帶著第一章的擴散地圖，找到了三個聲稱「最早看到截圖」的人，逐一進行訪談。
                            </p>
                            <p className="text-slate-300 leading-relaxed text-sm">
                                三個人的說法在幾個關鍵時間點互相矛盾。你需要在不破壞信任關係的前提下，找出哪個說法可以被外部資料支撐。
                            </p>
                            <p className="text-slate-300 leading-relaxed text-sm">
                                你手上的擴散地圖已經指出了幾個關鍵節點。但節點不會自己說話——截圖是誰先看到的、誰只是跟著轉、誰在轉述時悄悄多加了一句，只有從人口中問出來，才能把路徑真正分開。
                            </p>
                            <div className="grid grid-cols-3 gap-4 border-t border-slate-700 pt-4 text-xs">
                                <MiniStat label="受訪者" value="陳思妤 / 林國軒 / 王昱霖" />
                                <MiniStat label="訪談方式" value="半結構式一對一" />
                                <MiniStat label="核心目標" value="版本矛盾與三角驗證" />
                            </div>
                        </div>

                        {hadPrevOptimal && (
                            <div className="bg-violet-950/20 border border-violet-700/30 rounded p-4 mb-5 text-xs text-violet-300/80 leading-relaxed">
                                <strong className="text-violet-400">★ 前章線索繼承：</strong>你知道謠言在第 17 小時出現了版本分叉——在訪談中，你可以精確追問「那個時間點前後你在做什麼」。
                            </div>
                        )}

                        <div className="bg-violet-950/20 border border-violet-700/30 rounded p-4 mb-8 text-xs text-violet-300/80 leading-relaxed">
                            <strong className="text-violet-400">訪談法的核心規則：</strong>問句要中立，不帶評判；察覺矛盾時要追問細節，讓矛盾自己浮現，而不是直接對質。
                        </div>

                        <PrimaryButton onClick={() => { unlockAudio(); setPhase('scene1'); }} label="開始訪談" />
                    </div>
                )}

                {/* ══ 情境一 ═════════════════════════════════════════════════ */}
                {phase === 'scene1' && (
                    <SceneBlock
                        time="訪談陳思妤之前"
                        mediaUrl="/assets/echo/backgrounds/ch2/echo_ch2_interview_prep_v1.webp"
                        content={
                            <>
                                <p className="text-slate-300 leading-relaxed text-sm mb-4">
                                    陳思妤是第一個公開轉發截圖的人。她說是「朋友傳給我的」，說話快，語尾常帶保留：「我也不確定啦，可是大家那時候都在看……」
                                </p>
                                <p className="text-slate-300 leading-relaxed text-sm mb-4">
                                    她不一定是惡意的，但她是讓謠言第一步走出去的人。你需要知道：她第一次看到截圖是什麼時候、從哪裡來的、看到之後她做了什麼。
                                </p>
                                <p className="text-slate-300 leading-relaxed text-sm">
                                    你列出了幾個問題，但你需要決定怎麼問。
                                </p>
                            </>
                        }
                        actionLabel="設計問句"
                        onAction={() => setPhase('choice1')}
                    />
                )}

                {/* ══ 決策一 ═════════════════════════════════════════════════ */}
                {phase === 'choice1' && (
                    <ChoiceBlock
                        nodeNum="01"
                        directive="訪談問句要聚焦事實，不帶道德評判"
                        question="你打算怎麼問陳思妤？"
                        choices={[
                            {
                                id: 'A',
                                text: '問她：「你為什麼要轉發？你有沒有想過陳宇佳的感受？你真的相信這是真的嗎？」——讓她在回答過程中也自我反思一下。',
                            },
                            {
                                id: 'B',
                                text: '設計行為性的開放問句：「你第一次看到這張截圖是什麼時候？」「當時從哪裡看到的？」「看到之後你做了什麼？」——聚焦時間、來源、行動，不評判。',
                            },
                            {
                                id: 'C',
                                text: '不事先設計問題，根據對話隨機應變——預設問題會讓訪談太死板，反而問不出她真正知道什麼。',
                            },
                        ]}
                        onChoice={handleChoice1}
                    />
                )}

                {/* ══ 情境二 ═════════════════════════════════════════════════ */}
                {phase === 'scene2' && (
                    <SceneBlock
                        time="訪談林國軒｜他說了「我認識那個人」"
                        mediaUrl="/assets/echo/backgrounds/ch2/echo_ch2_interview_conflict_v1.webp"
                        content={
                            <>
                                <p className="text-slate-300 leading-relaxed text-sm mb-4">
                                    林國軒告訴你，他認識那個「親身拿到禮物卡」的人。但被問到名字時，他說：「我答應不說出來。反正懂的人就懂。」
                                </p>
                                <p className="text-slate-300 leading-relaxed text-sm mb-4">
                                    他每次的說法都比上一次多一點細節，越說越真——但所有細節都無從核實。你知道他傳播的不是資訊，是「知情感」本身。
                                </p>
                                <p className="text-slate-300 leading-relaxed text-sm">
                                    你需要繼續追問，但不能逼他關閉配合。
                                </p>
                            </>
                        }
                        actionLabel="繼續追問"
                        onAction={() => setPhase('choice2')}
                    />
                )}

                {/* ══ 決策二 ═════════════════════════════════════════════════ */}
                {phase === 'choice2' && (
                    <ChoiceBlock
                        nodeNum="02"
                        directive="察覺矛盾後必須追問，但方式要間接，讓細節自己說話"
                        question="林國軒說認識那個人卻說不出名字——你怎麼繼續？"
                        choices={[
                            {
                                id: 'A',
                                text: '說：「你說認識她，照理說不難告訴我她是誰——如果連名字都說不出來，我很難相信你說的是真的。」直接表明你的懷疑。',
                            },
                            {
                                id: 'B',
                                text: '換個角度追問細節：「你是什麼管道知道這件事的？」「大概是什麼時候、什麼場合？」「你們通常在哪裡碰面？」——讓矛盾自己在細節中浮現。',
                            },
                            {
                                id: 'C',
                                text: '接受他的說法，把「有人拿到禮物卡」記錄為「待確認線索」，繼續下一個問題——訪談中不宜戳破受訪者，以免他整個關閉配合。',
                            },
                        ]}
                        onChoice={handleChoice2}
                    />
                )}

                {/* ══ 情境三 ═════════════════════════════════════════════════ */}
                {phase === 'scene3' && (
                    <SceneBlock
                        time="三次訪談全部完成，整理紀錄"
                        mediaUrl="/assets/echo/backgrounds/ch2/echo_ch2_compare_notes_v1.webp"
                        content={
                            <>
                                <p className="text-slate-300 leading-relaxed text-sm mb-4">
                                    三個人的說法在一個關鍵時間點有出入：陳思妤說她「晚上九點前」就看到截圖，但林國軒說是「晚上十一點之後」，王昱霖說他根本「沒看到過任何截圖」——選舉制度很完整，沒有異常。
                                </p>
                                <p className="text-slate-300 leading-relaxed text-sm mb-4">
                                    三個人的立場各自不同：隨波轉傳的、知情感的、想讓事情安靜下去的。
                                </p>
                                <p className="text-slate-300 leading-relaxed text-sm">
                                    你如何確認哪個版本可信？
                                </p>
                            </>
                        }
                        actionLabel="進行三角驗證"
                        onAction={() => setPhase('choice3')}
                    />
                )}

                {/* ══ 決策三 ═════════════════════════════════════════════════ */}
                {phase === 'choice3' && (
                    <ChoiceBlock
                        nodeNum="03"
                        directive="三角驗證需要外部獨立來源，多數決不等於事實"
                        question="三個人時間說法互相矛盾，你要怎麼確認哪個版本可信？"
                        choices={[
                            {
                                id: 'A',
                                text: '找出三人說法中「重疊最多」的部分，把那些視為可信事實，差異的地方可能只是記憶誤差，不必深究。',
                            },
                            {
                                id: 'B',
                                text: '把三人說法逐條對照，標出一致與矛盾，再尋找外部資料——班群的訊息時間戳、IG 帳號的公開活動紀錄——交叉確認哪個版本與外部事實吻合。',
                            },
                            {
                                id: 'C',
                                text: '三個人互相矛盾代表記憶本來就不可靠。把這三份訪談都記錄下來，結論留到後面章節用其他方法確認，現在不過度解讀。',
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
                                <div className="absolute inset-0 bg-cover bg-center grayscale opacity-60" style={{ backgroundImage: "url('/assets/echo/backgrounds/ch2/echo_ch2_fail_bg_v1.webp')" }}></div>
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
                            <button
                                onClick={() => { unlockAudio(); retry(); }}
                                className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-black py-4 rounded-sm transition-all flex items-center justify-center gap-2 text-sm"
                            >
                                <RotateCcw size={15} /> 重新執行任務
                            </button>
                        </div>
                    );
                })()}

                {/* ══ 任務完成 ════════════════════════════════════════════════ */}
                {phase === 'complete' && (
                    <div>
                        <div className="relative w-full h-48 rounded-sm overflow-hidden border border-violet-900/50 mb-5 shadow-2xl">
                            <div className="absolute inset-0 bg-cover bg-center transition-transform duration-[15s] hover:scale-105" style={{ backgroundImage: "url('/assets/echo/backgrounds/ch2/echo_ch2_complete_bg_v1.webp')" }}></div>
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent"></div>
                            <div className="absolute inset-0 opacity-30 mix-blend-overlay pointer-events-none" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/%3E%3C/svg%3E')" }}></div>
                            <div className="absolute bottom-4 left-4 text-violet-400 font-mono text-xs tracking-[0.3em] font-black uppercase drop-shadow">Witness Testimony Logged</div>
                        </div>

                        <div className="bg-violet-950/20 border border-violet-700/30 rounded p-6 mb-5">
                            <SectionLabel icon={<CheckCircle size={13} />} text="任務完成" color="text-violet-400" />
                            <h2 className="text-xl font-black text-violet-300 mt-3 mb-4">★ 三角驗證完成</h2>
                            <p className="text-slate-300 text-sm leading-relaxed mb-6">
                                你不只記錄了三個人的說法，還主動用外部資料進行了交叉驗證。這次訪談找到了一個外部時間戳指向的具體矛盾——謠言的擴散路徑裡，藏著一個被低估的節點。
                            </p>

                            <div className="border-t border-violet-700/20 pt-5">
                                <div className="font-mono text-xs text-violet-500/70 tracking-widest mb-3">訪談紀錄已入庫</div>
                                <div className="space-y-2">
                                    <EvidenceItem text="陳思妤（轉傳者）：說「朋友傳給我的」，第一個公開轉發，但具體來源模糊" />
                                    <EvidenceItem text="林國軒（聲稱知情者）：說認識「拿到禮物卡的人」，但所有細節都無法核實——傳播的是知情感，不是資訊" />
                                    <EvidenceItem text="王昱霖（制度保護者）：說選舉沒有異常，說得太快、太乾淨，優先維護的是制度而非真相" />
                                    <EvidenceItem
                                        text="★ 外部時間戳顯示：陳思妤轉發的時間點是晚上 9:12，但班群裡最早出現截圖的紀錄是 9:07——她不是「第一個看到的人」，她是第二批。那 5 分鐘的差距，指向同一個班群裡另一個人"
                                        highlight
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-900/60 border border-slate-800 rounded p-5 mb-5">
                            <p className="text-slate-400 text-xs leading-relaxed mb-3">三個訪談讓你看見了早期路徑。但三個人的視角，再完整也只是局部。你現在需要知道的，不只是「誰先說」——而是整個年級已經有多少人把這件事當成大家都知道的事。</p>
                            <div className="font-mono text-xs text-slate-600">第三章｜問卷法：聲紋追蹤 — 已解鎖</div>
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
        <span className="text-violet-400 font-mono text-xs">{method}</span>
    </div>
);

const SectionLabel = ({ icon, text, color = 'text-violet-400' }) => (
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
        className="w-full bg-violet-700 hover:bg-violet-600 text-white font-black py-4 rounded-sm transition-all flex items-center justify-center gap-2 text-sm"
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
                <div className="absolute inset-0 opacity-10 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(120,80,255,0.04),rgba(80,0,255,0.02),rgba(150,0,255,0.04))] bg-[length:100%_4px,3px_100%] mix-blend-overlay"></div>
                <div className="absolute top-4 left-4 font-mono text-violet-400 font-bold text-[10px] tracking-widest bg-slate-950/80 px-2 py-1 rounded backdrop-blur-md border border-violet-900/50 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse"></span>
                    LOG • {time}
                </div>
            </div>
        )}
        <div className={`p-6 ${mediaUrl ? 'pt-4' : ''}`}>
            {!mediaUrl && <div className="font-mono text-violet-600/60 text-xs tracking-widest mb-4">{time}</div>}
            <div className="text-slate-300 text-sm leading-relaxed mb-6 space-y-4">{content}</div>
            <button onClick={onAction} className="w-full bg-slate-800 hover:bg-slate-700 border border-transparent hover:border-violet-500/50 text-slate-200 font-black py-4 rounded-sm transition-all flex items-center justify-center gap-2 text-sm">
                {actionLabel} <ChevronRight size={16} />
            </button>
        </div>
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
                <button key={c.id} onClick={() => onChoice(c.id)} className="w-full text-left bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-violet-600/40 rounded p-5 transition-all group">
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
    <div className={`flex items-start gap-2 text-xs py-2 px-3 rounded-sm ${highlight ? 'bg-violet-900/20 text-violet-300' : 'text-slate-400'}`}>
        <span className={`flex-shrink-0 mt-0.5 ${highlight ? 'text-violet-400' : 'text-slate-600'}`}>◆</span>
        <span>{text}</span>
    </div>
);
