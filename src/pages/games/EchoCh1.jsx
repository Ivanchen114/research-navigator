import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FileText, AlertTriangle, CheckCircle,
    RotateCcw, ChevronRight, Lock, Volume2, VolumeX
} from 'lucide-react';

// ─── localStorage key 常數 ────────────────────────────────────────────────────
const STORAGE_KEYS = {
    agentName:   'rib_agent_name',
    ch1Complete: 'echo_ch1_complete',
    ch1Optimal:  'echo_ch1_optimal',
};

// ─── 失敗原因資料 ──────────────────────────────────────────────────────────────
const FAIL_REASONS = {
    ch1_A: {
        type: '任務中止：主觀詮釋污染觀察紀錄',
        detail: '「他是在故意散播還是好奇轉傳」是研究者的詮釋，不是觀察事實。把詮釋寫進紀錄，等於讓你的偏見從第一天就混入數據裡。觀察法的工作是記錄「發生了什麼」，不是記錄「我覺得為什麼會這樣」——描述行為，不詮釋動機。',
        concept: '觀察法核心：客觀紀錄的標準——描述行為，不詮釋動機',
        retryPhase: 'scene1',
    },
    ch1_C: {
        type: '任務中止：延遲紀錄導致記憶重構',
        detail: '記憶會在幾個小時內開始重新建構——你的大腦會保留「印象深刻」的部分，自動過濾「看起來不重要」的細節。謠言的擴散節點尤其容易消失：限時動態 24 小時就不見了，群組訊息可以被刪除。觀察紀錄必須即時。',
        concept: '觀察法核心：即時性原則——觀察當下就是最準確的時間點',
        retryPhase: 'scene1',
    },
    ch2_A: {
        type: '任務中止：欺騙研究對象違反研究倫理',
        detail: '「讓對方不知道你在截圖，數據更自然」這個想法有一定道理，但它的代價是欺騙。研究倫理的基本原則之一，是研究者不得以獲取數據為由欺瞞研究對象。更何況，被知悉後的行為改變通常比你想像的小——道德問題卻是真實的。',
        concept: '觀察法核心：觀察者倫理——不得以欺騙方式進行觀察',
        retryPhase: 'scene2',
    },
    ch2_C: {
        type: '任務中止：誤判觀察者效應的正確處理方式',
        detail: '被知悉不等於數據無效。正確做法是在紀錄中標注「觀察者存在已知情」，並在後續分析時討論這可能帶來的影響。完全放棄這組觀察是過度反應——如果「被任何人看見就放棄」，你根本無法完成任何田野觀察。',
        concept: '觀察法核心：觀察者效應（Observer Effect）的標注處理',
        retryPhase: 'scene2',
    },
    ch3_A: {
        type: '任務中止：選擇性保留數據，丟棄有效觀察',
        detail: '少數版本可能恰恰揭示了謠言的演變節點——甚至可能就是最原始的版本，後來才被改掉。「多的就是對的」是確認偏誤。觀察法的工作是記錄所有出現的現象，不是替現象做裁判。',
        concept: '觀察法核心：完整紀錄原則——不可選擇性保留對結論有利的觀察',
        retryPhase: 'scene3',
    },
};

// ─── 主元件 ───────────────────────────────────────────────────────────────────
export const EchoCh1 = () => {
    const navigate = useNavigate();
    const [phase, setPhase] = useState('briefing');
    const [failKey, setFailKey] = useState(null);
    const [foundOptimal, setFoundOptimal] = useState(false);
    const [agentName, setAgentName] = useState('探員');
    const [isMuted, setIsMuted] = useState(() => localStorage.getItem('echo_muted') === 'true');
    const [hadPrevOptimal, setHadPrevOptimal] = useState(false);

    // ── 音效設定（暫用 phantom 音檔，待 echo 音檔製作後替換） ──
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

    // ── 靜音同步 ──
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

    // ── 音效 phase 控制 ──
    useEffect(() => {
        if (!bgmRef.current || !heartbeatRef.current || !glitchRef.current) return;

        if (phase === 'scene1' || phase === 'scene2' || phase === 'choice1' || phase === 'choice2') {
            bgmRef.current.play().catch(e => console.log('BGM blocked', e));
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
        if (bgmRef.current) bgmRef.current.play().catch(() => {});
        if (heartbeatRef.current) heartbeatRef.current.play().then(() => heartbeatRef.current.pause()).catch(() => {});
        if (glitchRef.current) glitchRef.current.play().then(() => glitchRef.current.pause()).catch(() => {});
    };

    useEffect(() => {
        const name = localStorage.getItem(STORAGE_KEYS.agentName);
        if (name) setAgentName(name);
        setHadPrevOptimal(localStorage.getItem('phantom_ch5_optimal') === 'true');
        window.scrollTo(0, 0);

        // 預載圖片
        const imgs = [
            '/assets/echo/covers/echo_cover_ch1_bg_v1.webp',
            '/assets/echo/backgrounds/ch1/echo_ch1_classroom_corridor_v1.webp',
            '/assets/echo/backgrounds/ch1/echo_ch1_phone_screenshot_v1.webp',
            '/assets/echo/backgrounds/ch1/echo_ch1_notes_table_v1.webp',
            '/assets/echo/backgrounds/ch1/echo_ch1_fail_bg_v1.webp',
            '/assets/echo/backgrounds/ch1/echo_ch1_complete_bg_v1.webp',
        ];
        imgs.forEach(src => { const img = new Image(); img.src = src; });
    }, []);

    const fail = (key) => { setFailKey(key); setPhase('fail'); };

    const complete = (isOptimal) => {
        localStorage.setItem(STORAGE_KEYS.ch1Complete, 'true');
        if (isOptimal) localStorage.setItem(STORAGE_KEYS.ch1Optimal, 'true');
        setFoundOptimal(isOptimal);
        setPhase('complete');
    };

    const retry = () => {
        const target = failKey ? (FAIL_REASONS[failKey].retryPhase || 'briefing') : 'briefing';
        setPhase(target);
        setFailKey(null);
    };

    // ── 選項處理 ──
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
        complete(id === 'C');
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">

            {/* ── 頂部導覽 ────────────────────────────────────────────────── */}
            <div className="sticky top-0 z-10 border-b border-slate-800 bg-slate-900/90 backdrop-blur px-6 py-3 flex items-center gap-2 text-xs font-mono">
                <button onClick={() => navigate('/echo')} className="text-slate-500 hover:text-indigo-400 transition-colors">
                    R.I.B. 調查檔案
                </button>
                <span className="text-slate-700">/</span>
                <span className="text-indigo-400/70">回聲</span>
                <span className="text-slate-700">/</span>
                <span className="text-slate-300">第一章｜謠言現場</span>
                <div className="ml-auto flex items-center gap-3">
                    <button
                        onClick={toggleMute}
                        title={isMuted ? '開啟音效' : '靜音'}
                        className="text-slate-500 hover:text-indigo-400 transition-colors"
                    >
                        {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                    </button>
                    {agentName && <span className="text-slate-600 font-mono text-xs">{agentName}</span>}
                </div>
            </div>

            <div className="max-w-2xl mx-auto px-6 py-12">

                {/* ══ 任務簡報 ═══════════════════════════════════════════════ */}
                {phase === 'briefing' && (
                    <div>
                        {/* 封面橫幅 */}
                        <div className="relative w-full h-48 sm:h-64 rounded-lg overflow-hidden mb-8 border border-slate-700 shadow-2xl">
                            <div className="absolute inset-0 bg-cover bg-center transition-transform duration-[20s] hover:scale-105" style={{ backgroundImage: "url('/assets/echo/covers/echo_cover_ch1_bg_v1.webp')" }}></div>
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/80 via-slate-950/60 to-transparent"></div>
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
                            <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-overlay" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')" }}></div>
                            <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(100,100,255,0.04),rgba(0,0,255,0.02),rgba(100,0,255,0.04))] bg-[length:100%_4px,3px_100%] opacity-20"></div>
                            <div className="absolute bottom-6 left-6 right-6">
                                <ChapterLabel num="01" method="觀察法" />
                                <h1 className="text-3xl sm:text-4xl font-black text-white mt-2 drop-shadow-md">謠言現場</h1>
                            </div>
                        </div>

                        <div className="bg-slate-900 border border-slate-700 rounded p-6 mb-5 space-y-4">
                            <SectionLabel icon={<FileText size={13} />} text="任務簡報" />
                            <p className="text-slate-300 leading-relaxed text-sm">
                                班聯會長選舉結束三天後，一張截圖在班群和 IG 限時動態裡流傳，指控現任會長陳宇佳買票。48 小時內沒有人停下來確認截圖的真實性——謠言已經開始改變她在學校的處境。
                            </p>
                            <p className="text-slate-300 leading-relaxed text-sm">
                                你的第一步任務是以「期末研究項目」為由，系統性觀察謠言在三個平台（班群 LINE、IG 限時動態、走廊口頭傳播）的擴散模式。目標是建立一份可追溯的擴散地圖——不是替她申辯，而是先搞清楚「這件事是怎麼變大的」。
                            </p>
                            <div className="grid grid-cols-3 gap-4 border-t border-slate-700 pt-4 text-xs">
                                <MiniStat label="調查期間" value="謠言爆發後 72 小時" />
                                <MiniStat label="觀察平台" value="班群 / IG / 走廊" />
                                <MiniStat label="任務限制" value="不介入，不表態" />
                            </div>
                        </div>

                        {hadPrevOptimal && (
                            <div className="bg-indigo-950/20 border border-indigo-700/30 rounded p-4 mb-5 text-xs text-indigo-300/80 leading-relaxed">
                                <strong className="text-indigo-400">★ 前案線索繼承：</strong>在上一個案件中，你訓練出了對數位操弄痕跡的敏感度——進入這個案件，你更快注意到帳號行為模式的異常。
                            </div>
                        )}

                        <div className="bg-indigo-950/20 border border-indigo-700/30 rounded p-4 mb-8 text-xs text-indigo-300/80 leading-relaxed">
                            <strong className="text-indigo-400">觀察法的核心規則：</strong>只記錄你真正看到的事實——平台、時間、內容，不加入推測、判斷或情緒解讀。你的紀錄必須客觀到「換任何人來看，都能寫出同樣的東西」。
                        </div>

                        <PrimaryButton onClick={() => { unlockAudio(); setPhase('scene1'); }} label="開始調查" />
                    </div>
                )}

                {/* ══ 情境一 ═════════════════════════════════════════════════ */}
                {phase === 'scene1' && (
                    <SceneBlock
                        time="謠言爆發後第一天"
                        mediaUrl="/assets/echo/backgrounds/ch1/echo_ch1_classroom_corridor_v1.webp"
                        content={
                            <>
                                <p className="text-slate-300 leading-relaxed text-sm mb-4">
                                    謠言正在三個管道同時流傳。班群裡有人傳了截圖，幾秒後收回，但三個人已經截好了。IG 的限時動態一則接一則，附上「聽說…」的文字框。走廊裡有人側頭輕聲說了什麼，旁邊的人跟著笑了一下。
                                </p>
                                <p className="text-slate-300 leading-relaxed text-sm mb-4">
                                    陳宇佳拿起手機，通知欄跳出二十幾個新訊息。她把螢幕翻過去放在桌上，沒有打開。
                                </p>
                                <p className="text-slate-300 leading-relaxed text-sm">
                                    你打開筆記本，準備建立記錄系統。你需要決定：你要怎麼記？
                                </p>
                            </>
                        }
                        actionLabel="建立記錄系統"
                        onAction={() => setPhase('choice1')}
                    />
                )}

                {/* ══ 決策一 ═════════════════════════════════════════════════ */}
                {phase === 'choice1' && (
                    <ChoiceBlock
                        nodeNum="01"
                        directive="觀察紀錄只記錄可見事實，不加入研究者的詮釋"
                        question="你要怎麼建立這份擴散地圖的記錄系統？"
                        choices={[
                            {
                                id: 'A',
                                text: '在每個看到謠言的地方截圖存檔，同時根據你對那個人的了解，判斷他是在故意散播、還是只是好奇轉傳。',
                            },
                            {
                                id: 'B',
                                text: '建立追蹤表格：時間戳記、平台、傳播方向（原發→轉傳）、內容是否有變化，不加任何主觀評語。',
                            },
                            {
                                id: 'C',
                                text: '先記下今天的整體印象，明天再根據印象整理成正式紀錄——現在資訊量太大，邊記邊整理反而容易漏掉重要的。',
                            },
                        ]}
                        onChoice={handleChoice1}
                    />
                )}

                {/* ══ 情境二 ═════════════════════════════════════════════════ */}
                {phase === 'scene2' && (
                    <SceneBlock
                        time="謠言爆發後第二天"
                        mediaUrl="/assets/echo/backgrounds/ch1/echo_ch1_phone_screenshot_v1.webp"
                        content={
                            <>
                                <p className="text-slate-300 leading-relaxed text-sm mb-4">
                                    你在記錄 IG 上的限時動態時，旁邊的同學看見你在截圖，問你在幹嘛。
                                </p>
                                <p className="text-slate-300 leading-relaxed text-sm mb-4">
                                    你的表格裡已經有三十多筆紀錄了。繼續截圖，或是停下來——都是一個選擇。
                                </p>
                                <p className="text-slate-300 leading-relaxed text-sm">
                                    你需要決定怎麼回應，才能在不失去觀察機會的前提下，維持研究的倫理基礎。
                                </p>
                            </>
                        }
                        actionLabel="決定怎麼回應"
                        onAction={() => setPhase('choice2')}
                    />
                )}

                {/* ══ 決策二 ═════════════════════════════════════════════════ */}
                {phase === 'choice2' && (
                    <ChoiceBlock
                        nodeNum="02"
                        directive="被觀察者的知情同意權不得以數據品質為由犧牲"
                        question="旁邊的人問你在截圖幹嘛——你怎麼處理？"
                        choices={[
                            {
                                id: 'A',
                                text: '說「沒事，隨便看看」，繼續低頭記錄——被觀察者越不知情，行為越自然，數據越不受干擾。',
                            },
                            {
                                id: 'B',
                                text: '告訴他你在做一個關於「資訊傳播模式」的研究，不涉及任何是非判斷，繼續觀察，並在紀錄中標注「觀察者存在已被知悉」。',
                            },
                            {
                                id: 'C',
                                text: '停止這個位置的觀察，轉移到他看不到的地方繼續——觀察者一旦被知悉，這組數據就失去自然性了，繼續下去只是在浪費時間。',
                            },
                        ]}
                        onChoice={handleChoice2}
                    />
                )}

                {/* ══ 情境三 ═════════════════════════════════════════════════ */}
                {phase === 'scene3' && (
                    <SceneBlock
                        time="謠言爆發後第三天，整理紀錄"
                        mediaUrl="/assets/echo/backgrounds/ch1/echo_ch1_notes_table_v1.webp"
                        content={
                            <>
                                <p className="text-slate-300 leading-relaxed text-sm mb-4">
                                    三天下來你整理了 47 筆擴散記錄。
                                </p>
                                <p className="text-slate-300 leading-relaxed text-sm mb-4">
                                    你發現謠言在傳播過程中出現了兩個版本：一個說是「禮物卡」，另一個說是「現金」。大約在第 17 小時，兩個版本的傳播量出現了明顯的分叉。
                                </p>
                                <p className="text-slate-300 leading-relaxed text-sm">
                                    你的報告只能呈現一個清晰的版本——還是你應該如實記錄這個矛盾？
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
                        directive="觀察數據的完整性優先於報告的整潔度"
                        question="謠言出現了兩個版本，你要怎麼處理這個分叉？"
                        choices={[
                            {
                                id: 'A',
                                text: '查一下哪個版本流傳更廣，把少數版本當成「誤傳」處理，只保留主流版本讓報告更清晰。',
                            },
                            {
                                id: 'B',
                                text: '兩個版本都完整保留，用不同標記區分，報告中特別指出這個分叉——謠言內容出現版本分歧本身就是一個重要的觀察結果。',
                            },
                            {
                                id: 'C',
                                text: '兩個版本都完整保留並標記分叉。同時進一步追蹤：哪個版本先出現？分叉後各自的傳播速度有什麼差異？把這個時間點和來源帳號標為下一步的重點追蹤目標。',
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
                                <div className="absolute inset-0 bg-cover bg-center grayscale opacity-60" style={{ backgroundImage: "url('/assets/echo/backgrounds/ch1/echo_ch1_fail_bg_v1.webp')" }}></div>
                                <div className="absolute inset-0 bg-red-950/40 mix-blend-color-burn"></div>
                                <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22/%3E%3C/svg%3E')] mix-blend-overlay animate-pulse pointer-events-none"></div>
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
                        <div className="relative w-full h-48 rounded-sm overflow-hidden border border-indigo-900/50 mb-5 shadow-2xl">
                            <div className="absolute inset-0 bg-cover bg-center transition-transform duration-[15s] hover:scale-105" style={{ backgroundImage: "url('/assets/echo/backgrounds/ch1/echo_ch1_complete_bg_v1.webp')" }}></div>
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent"></div>
                            <div className="absolute inset-0 opacity-30 mix-blend-overlay pointer-events-none" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')" }}></div>
                            <div className="absolute bottom-4 left-4 text-indigo-400 font-mono text-xs tracking-[0.3em] font-black uppercase drop-shadow">Echo Trace Logged</div>
                        </div>

                        <div className="bg-indigo-950/20 border border-indigo-700/30 rounded p-6 mb-5">
                            <SectionLabel icon={<CheckCircle size={13} />} text="任務完成" color="text-indigo-400" />
                            <h2 className="text-xl font-black text-indigo-300 mt-3 mb-4">
                                {foundOptimal ? '★ 擴散地圖完整建立' : '擴散地圖建立完成'}
                            </h2>
                            <p className="text-slate-300 text-sm leading-relaxed mb-6">
                                {foundOptimal
                                    ? '你不只記錄了謠言的擴散路徑，還主動辨識出版本分叉的時間結構與可疑來源帳號。這份紀錄已超出基本觀察要求，為後續章節的調查埋下了第一條具體線索。'
                                    : '你完整記錄了謠言在三個平台的擴散軌跡，保留了兩個版本的分叉事實。這份紀錄具有可追溯性，可進入下一章的訪談階段。'
                                }
                            </p>

                            <div className="border-t border-indigo-700/20 pt-5">
                                <div className="font-mono text-xs text-indigo-500/70 tracking-widest mb-3">觀察紀錄已入庫</div>
                                <div className="space-y-2">
                                    <EvidenceItem text="班群 LINE：截圖於謠言爆發後 2 小時內開始流傳，存在「傳出→收回→再截圖」的模式" />
                                    <EvidenceItem text="IG 限時動態：謠言在 12 小時內累積 15 則獨立轉傳，部分附加評論文字" />
                                    <EvidenceItem text="走廊口頭傳播：無法精確追蹤，但觀察到群聚壓力效應——有人本來想發問卻刪掉" />
                                    <EvidenceItem text="謠言出現兩個版本（禮物卡 / 現金），版本分叉點出現在第 17 小時" />
                                    {foundOptimal
                                        ? <EvidenceItem
                                            text="★ 現金版本比禮物卡版本晚 2 小時出現。分叉起點追溯到兩個從未在學校相關話題發言、卻在第 17 小時突然同時活躍的匿名帳號——這是整個調查的第一條具體線索"
                                            highlight
                                          />
                                        : (
                                            <div className="flex items-center gap-2 text-slate-600 text-xs py-2 px-3">
                                                <Lock size={12} />
                                                <span>版本分叉的時間結構與來源帳號未追蹤（重試可解鎖完整線索）</span>
                                            </div>
                                        )
                                    }
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-900/60 border border-slate-800 rounded p-4 mb-5 text-xs text-slate-500 font-mono">
                            第二章｜訪談法：目擊者 — 已解鎖
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
        <span className="text-indigo-400 font-mono text-xs">{method}</span>
    </div>
);

const SectionLabel = ({ icon, text, color = 'text-indigo-400' }) => (
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
        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-4 rounded-sm transition-all flex items-center justify-center gap-2 text-sm"
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
                <div className="absolute inset-0 opacity-10 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(100,100,255,0.04),rgba(0,0,255,0.02),rgba(100,0,255,0.04))] bg-[length:100%_4px,3px_100%] mix-blend-overlay"></div>
                <div className="absolute top-4 left-4 font-mono text-indigo-400 font-bold text-[10px] tracking-widest bg-slate-950/80 px-2 py-1 rounded backdrop-blur-md border border-indigo-900/50 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
                    LOG • {time}
                </div>
            </div>
        )}
        <div className={`p-6 ${mediaUrl ? 'pt-4' : ''}`}>
            {!mediaUrl && <div className="font-mono text-indigo-600/60 text-xs tracking-widest mb-4">{time}</div>}
            <div className="text-slate-300 text-sm leading-relaxed mb-6 space-y-4">
                {content}
            </div>
            <button
                onClick={onAction}
                className="w-full bg-slate-800 hover:bg-slate-700 border border-transparent hover:border-indigo-500/50 text-slate-200 font-black py-4 rounded-sm transition-all flex items-center justify-center gap-2 text-sm"
            >
                {actionLabel} <ChevronRight size={16} />
            </button>
        </div>
    </div>
);

const ChoiceBlock = ({ nodeNum, question, choices, onChoice, directive }) => (
    <div>
        <div className="font-mono text-indigo-600/60 text-xs tracking-widest mb-2">決策節點 {nodeNum}</div>
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
                    className="w-full text-left bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-indigo-600/40 rounded p-5 transition-all group"
                >
                    <div className="flex items-start gap-3">
                        <span className="font-mono text-indigo-400 font-bold text-sm flex-shrink-0 mt-0.5 w-4">{c.id}</span>
                        <span className="text-slate-300 text-sm leading-relaxed group-hover:text-white transition-colors">{c.text}</span>
                    </div>
                </button>
            ))}
        </div>
    </div>
);

const EvidenceItem = ({ text, highlight }) => (
    <div className={`flex items-start gap-2 text-xs py-2 px-3 rounded-sm ${highlight ? 'bg-indigo-900/20 text-indigo-300' : 'text-slate-400'}`}>
        <span className={`flex-shrink-0 mt-0.5 ${highlight ? 'text-indigo-400' : 'text-slate-600'}`}>◆</span>
        <span>{text}</span>
    </div>
);
