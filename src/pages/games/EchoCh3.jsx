import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FileText, AlertTriangle, CheckCircle,
    RotateCcw, ChevronRight, Lock, Volume2, VolumeX
} from 'lucide-react';

// ─── localStorage key 常數 ────────────────────────────────────────────────────
const STORAGE_KEYS = {
    agentName:   'rib_agent_name',
    ch3Complete: 'echo_ch3_complete',
    ch3Optimal:  'echo_ch3_optimal',
};

// ─── 失敗原因資料 ──────────────────────────────────────────────────────────────
const FAIL_REASONS = {
    ch1_A: {
        type: '任務中止：直接具名問題造成二次傷害，且數據嚴重偏誤',
        detail: '在問卷裡讓全年級對一個具名同學「投票定罪」，不只是方法論問題——這可能對當事人造成二次傷害。而且這種設計會嚴重受「社會期望效應」影響：沒有人想讓別人覺得自己相信謠言，所以大家傾向選「不確定」——這樣的數據什麼都測不到。',
        concept: '問卷法核心：敏感問題的間接設計——避免讓受訪者直接替具名對象下判斷',
        retryPhase: 'scene1',
    },
    ch1_C: {
        type: '任務中止：免責聲明無法降低真實的社會風險',
        detail: '「本調查不會影響陳宇佳的學生身分」這句話，你根本無法保證——問卷可能被截圖，結果可能外洩。更糟的是，這句話反而讓受訪者意識到「這個調查是有可能影響她的，只是他說不會」，反而提高了焦慮。免責聲明是法律概念，不是降低受訪者心理壓力的有效工具。',
        concept: '問卷法核心：研究倫理——研究者不應做無法兌現的保證',
        retryPhase: 'scene1',
    },
    ch2_A: {
        type: '任務中止：滾雪球抽樣造成嚴重的選擇偏誤',
        detail: '你的人際網絡不是隨機的。你認識的人的朋友，在這件事上很可能立場接近——大家住在同一個「資訊泡泡」裡，看到的謠言版本可能也一樣。滾雪球適合用來找「有特定特徵的稀少群體」，不適合用來測量整個年級的意見分佈。',
        concept: '問卷法核心：抽樣方式決定代表性——滾雪球抽樣的使用限制',
        retryPhase: 'scene2',
    },
    ch2_C: {
        type: '任務中止：自願填答偏誤，數據呈現極化',
        detail: '「有意願」就會點開連結的人，往往是對事件「有強烈感受」的人：最憤怒的和最力挺陳宇佳的。對這件事「沒意見」或「不關心」的人不會點開。你得到的數據，將嚴重偏向兩個極端，讓你誤判整體年級的實際感受。',
        concept: '問卷法核心：自願填答偏誤（Volunteer Bias）——自願者不代表全體',
        retryPhase: 'scene2',
    },
    ch3_A: {
        type: '任務中止：把相關性詮釋為因果關係',
        detail: '「謠言蔓延→大家覺得可疑」聽起來很合理，但還有另一個可能：也許選舉前就已經有人對陳宇佳有疑慮，謠言只是讓那些原有的疑慮有了出口。問卷無法區分這兩種可能——說「這正是蔓延的必然結果」，是你把一個假設直接寫成了結論。',
        concept: '問卷法核心：相關不等於因果——問卷只能顯示現況，不能解釋原因',
        retryPhase: 'scene3',
    },
};

// ─── 主元件 ───────────────────────────────────────────────────────────────────
export const EchoCh3 = () => {
    const navigate = useNavigate();
    const [phase, setPhase] = useState('briefing');
    const [failKey, setFailKey] = useState(null);
    const [foundOptimal, setFoundOptimal] = useState(false);
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
        setHadPrevOptimal(localStorage.getItem('echo_ch2_optimal') === 'true');
        window.scrollTo(0, 0);

        const imgs = [
            '/assets/echo/covers/echo_cover_ch3_bg_v1.webp',
            '/assets/echo/backgrounds/ch3/echo_ch3_survey_design_v1.webp',
            '/assets/echo/backgrounds/ch3/echo_ch3_sampling_v1.webp',
            '/assets/echo/backgrounds/ch3/echo_ch3_data_results_v1.webp',
            '/assets/echo/backgrounds/ch3/echo_ch3_fail_bg_v1.webp',
            '/assets/echo/backgrounds/ch3/echo_ch3_complete_bg_v1.webp',
        ];
        imgs.forEach(src => { const img = new Image(); img.src = src; });
    }, []);

    const fail = (key) => { setFailKey(key); setPhase('fail'); };

    const complete = (isOptimal) => {
        localStorage.setItem(STORAGE_KEYS.ch3Complete, 'true');
        if (isOptimal) localStorage.setItem(STORAGE_KEYS.ch3Optimal, 'true');
        setFoundOptimal(isOptimal);
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

    // Node 3: A=fail, B=pass(no star), C=pass+optimal ← ✅/⭐ split
    const handleChoice3 = (id) => {
        if (id === 'A') return fail('ch3_A');
        complete(id === 'C');
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">

            {/* ── 頂部導覽 ────────────────────────────────────────────────── */}
            <div className="sticky top-0 z-10 border-b border-slate-800 bg-slate-900/90 backdrop-blur px-6 py-3 flex items-center gap-2 text-xs font-mono">
                <button onClick={() => navigate('/echo')} className="text-slate-500 hover:text-sky-400 transition-colors">
                    R.I.B. 調查檔案
                </button>
                <span className="text-slate-700">/</span>
                <span className="text-sky-400/70">回聲</span>
                <span className="text-slate-700">/</span>
                <span className="text-slate-300">第三章｜聲紋追蹤</span>
                <div className="ml-auto flex items-center gap-3">
                    <button onClick={toggleMute} title={isMuted ? '開啟音效' : '靜音'} className="text-slate-500 hover:text-sky-400 transition-colors">
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
                            <div className="absolute inset-0 bg-cover bg-center transition-transform duration-[20s] hover:scale-105" style={{ backgroundImage: "url('/assets/echo/covers/echo_cover_ch3_bg_v1.webp')" }}></div>
                            <div className="absolute inset-0 bg-gradient-to-br from-slate-800/80 via-slate-950/60 to-transparent"></div>
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
                            <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-overlay" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/%3E%3C/svg%3E')" }}></div>
                            <div className="absolute bottom-6 left-6 right-6">
                                <ChapterLabel num="03" method="問卷法" />
                                <h1 className="text-3xl sm:text-4xl font-black text-white mt-2 drop-shadow-md">聲紋追蹤</h1>
                            </div>
                        </div>

                        <div className="bg-slate-900 border border-slate-700 rounded p-6 mb-5 space-y-4">
                            <SectionLabel icon={<FileText size={13} />} text="任務簡報" />
                            <p className="text-slate-300 leading-relaxed text-sm">
                                前兩章你追蹤了謠言怎麼走、誰說了什麼。但你還不知道整個年級的「接收狀態」——有多少人看過？他們相信到什麼程度？而更關鍵的是：有沒有人接收到一個截圖之外的版本，一個從來沒有出現在任何公開傳播裡的細節？
                            </p>
                            <p className="text-slate-300 leading-relaxed text-sm">
                                一個謠言最危險的時刻，不是它被大聲說出來的時候，而是它開始像背景噪音一樣流動——連查證這個念頭都懶得出現的時候。
                            </p>
                            <p className="text-slate-300 leading-relaxed text-sm">
                                這一章不只是在測量風向——你要在海量回答裡，聽有沒有同一個聲音從不同地方冒出來。
                            </p>
                            <div className="grid grid-cols-3 gap-4 border-t border-slate-700 pt-4 text-xs">
                                <MiniStat label="調查對象" value="全年級 240 人" />
                                <MiniStat label="工具" value="問卷（量化＋開放題）" />
                                <MiniStat label="核心目標" value="找出幽靈說法" />
                            </div>
                        </div>

                        {hadPrevOptimal && (
                            <div className="bg-sky-950/20 border border-sky-700/30 rounded p-4 mb-5 text-xs text-sky-300/80 leading-relaxed">
                                <strong className="text-sky-400">★ 前章線索繼承：</strong>你知道陳思妤不是「第一個看到的人」，在問卷中加入了「謠言接收時間點」的開放題，試圖找到另一批「更早」的目擊者。
                            </div>
                        )}

                        <div className="bg-sky-950/20 border border-sky-700/30 rounded p-4 mb-8 text-xs text-sky-300/80 leading-relaxed">
                            <strong className="text-sky-400">問卷法的核心規則：</strong>敏感問題要間接設計，抽樣要具代表性，結果詮釋要誠實說明局限——相關不等於因果。
                        </div>

                        <PrimaryButton onClick={() => { unlockAudio(); setPhase('scene1'); }} label="開始設計問卷" />
                    </div>
                )}

                {/* ══ 情境一 ═════════════════════════════════════════════════ */}
                {phase === 'scene1' && (
                    <SceneBlock
                        time="設計問卷題目"
                        mediaUrl="/assets/echo/backgrounds/ch3/echo_ch3_survey_design_v1.webp"
                        content={
                            <>
                                <p className="text-slate-300 leading-relaxed text-sm mb-4">
                                    你需要在問卷中詢問大家對「陳宇佳事件」的看法，但這是個涉及具名同學的敏感問題。
                                </p>
                                <p className="text-slate-300 leading-relaxed text-sm mb-4">
                                    問得太直接，可能傷害當事人，也會讓數據失真；問得太迴避，又得不到你需要的資訊。
                                </p>
                                <p className="text-slate-300 leading-relaxed text-sm">
                                    你打算怎麼設計這道敏感題？
                                </p>
                            </>
                        }
                        actionLabel="決定問句設計"
                        onAction={() => setPhase('choice1')}
                    />
                )}

                {/* ══ 決策一 ═════════════════════════════════════════════════ */}
                {phase === 'choice1' && (
                    <ChoiceBlock
                        nodeNum="01"
                        directive="敏感問題要間接處理，不讓受訪者替具名對象直接下判斷"
                        question="問卷裡涉及陳宇佳事件的題目，你要怎麼設計？"
                        choices={[
                            {
                                id: 'A',
                                text: '直接問：「你認為陳宇佳在選舉中有沒有行賄？」提供「有」、「沒有」、「不確定」三個選項——這樣最直接，最容易分析。',
                            },
                            {
                                id: 'B',
                                text: '分層設計：先問「你有沒有看過那則傳言？」，有看過才進入下一題，問「看完之後你認為可信度如何（1–5 分）？」——不直接要求受訪者替具名當事人定罪。',
                            },
                            {
                                id: 'C',
                                text: '在問卷說明加一句：「本調查不會影響陳宇佳的學生身分，請放心作答」——加了免責聲明，受訪者就能更誠實回答敏感問題。',
                            },
                        ]}
                        onChoice={handleChoice1}
                    />
                )}

                {/* ══ 情境二 ═════════════════════════════════════════════════ */}
                {phase === 'scene2' && (
                    <SceneBlock
                        time="決定發放對象"
                        mediaUrl="/assets/echo/backgrounds/ch3/echo_ch3_sampling_v1.webp"
                        content={
                            <>
                                <p className="text-slate-300 leading-relaxed text-sm mb-4">
                                    全年級 240 人，你打算抽樣調查。但你的時間有限——你不可能問遍所有人。
                                </p>
                                <p className="text-slate-300 leading-relaxed text-sm mb-4">
                                    抽樣的方式決定你得到的是「有代表性的意見」，還是「某個偏斜群體的回答」。
                                </p>
                                <p className="text-slate-300 leading-relaxed text-sm">
                                    你要怎麼抽？
                                </p>
                            </>
                        }
                        actionLabel="決定抽樣方式"
                        onAction={() => setPhase('choice2')}
                    />
                )}

                {/* ══ 決策二 ═════════════════════════════════════════════════ */}
                {phase === 'choice2' && (
                    <ChoiceBlock
                        nodeNum="02"
                        directive="抽樣方式決定代表性——樣本必須能反映整體，而非某個偏斜群體"
                        question="全年級 240 人，你要怎麼抽樣？"
                        choices={[
                            {
                                id: 'A',
                                text: '從自己認識的同學開始，每個人再介紹一兩個，滾雪球抽樣——效率最高，而且透過熟人介紹回收率更好。',
                            },
                            {
                                id: 'B',
                                text: '請教務處提供名冊，從每個班隨機抽取 10%，確保各班比例一致。',
                            },
                            {
                                id: 'C',
                                text: '在全年級的公開班群發連結，讓有意願的人自填——樣本越多越好，自願填寫也代表他們願意認真作答。',
                            },
                        ]}
                        onChoice={handleChoice2}
                    />
                )}

                {/* ══ 情境三 ═════════════════════════════════════════════════ */}
                {phase === 'scene3' && (
                    <SceneBlock
                        time="問卷回收，整理數據"
                        mediaUrl="/assets/echo/backgrounds/ch3/echo_ch3_data_results_v1.webp"
                        content={
                            <>
                                <p className="text-slate-300 leading-relaxed text-sm mb-4">
                                    問卷回收了。65% 的受訪者說「覺得事情有些可疑」，但只有 18% 說「確定相信謠言是真的」。
                                </p>
                                <p className="text-slate-300 leading-relaxed text-sm mb-4">
                                    你在整理開放題時，注意到一個異常：有三位來自不同班級的受訪者，在描述「最早聽到謠言的場合」時，都提到了同一個非常具體的細節——一個從未出現在任何公開截圖版本裡的描述。
                                </p>
                                <p className="text-slate-300 leading-relaxed text-sm">
                                    你在報告中打算怎麼詮釋這個結果？
                                </p>
                            </>
                        }
                        actionLabel="撰寫結果詮釋"
                        onAction={() => setPhase('choice3')}
                    />
                )}

                {/* ══ 決策三 ═════════════════════════════════════════════════ */}
                {phase === 'choice3' && (
                    <ChoiceBlock
                        nodeNum="03"
                        directive="問卷只能顯示現況，不能解釋原因；但異常值本身就是值得追查的訊號"
                        question="65% 覺得可疑，開放題出現了異常重複細節——你怎麼在報告中詮釋？"
                        choices={[
                            {
                                id: 'A',
                                text: '65% 覺得可疑，代表謠言已經對陳宇佳的形象造成顯著損害——這正是行賄謠言在校園蔓延後的必然結果，可以支持謠言傷害力的結論。',
                            },
                            {
                                id: 'B',
                                text: '這 65% 只能說明「謠言讓很多人產生疑慮」，但無法確認原因是謠言還是其他因素。報告只呈現數據，誠實說明問卷無法回答「為什麼」。',
                            },
                            {
                                id: 'C',
                                text: '這 65% 只能說明「謠言讓很多人產生疑慮」，無法確認因果。另外，我在整理開放題時注意到：有三位來自不同班級的受訪者，都提到禮物卡是在「福利社後方樓梯口」交的，還說了一句「這樣比較安全」——這個說法從未出現在任何公開截圖版本裡，值得下一步追查。',
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
                                <div className="absolute inset-0 bg-cover bg-center grayscale opacity-60" style={{ backgroundImage: "url('/assets/echo/backgrounds/ch3/echo_ch3_fail_bg_v1.webp')" }}></div>
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
                        <div className="relative w-full h-48 rounded-sm overflow-hidden border border-sky-900/50 mb-5 shadow-2xl">
                            <div className="absolute inset-0 bg-cover bg-center transition-transform duration-[15s] hover:scale-105" style={{ backgroundImage: "url('/assets/echo/backgrounds/ch3/echo_ch3_complete_bg_v1.webp')" }}></div>
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent"></div>
                            <div className="absolute inset-0 opacity-30 mix-blend-overlay pointer-events-none" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/%3E%3C/svg%3E')" }}></div>
                            <div className="absolute bottom-4 left-4 text-sky-400 font-mono text-xs tracking-[0.3em] font-black uppercase drop-shadow">Signal Pattern Detected</div>
                        </div>

                        <div className="bg-sky-950/20 border border-sky-700/30 rounded p-6 mb-5">
                            <SectionLabel icon={<CheckCircle size={13} />} text="任務完成" color="text-sky-400" />
                            <h2 className="text-xl font-black text-sky-300 mt-3 mb-4">
                                {foundOptimal ? '★ 幽靈聲紋找到了' : '問卷調查完成'}
                            </h2>
                            <p className="text-slate-300 text-sm leading-relaxed mb-6">
                                {foundOptimal
                                    ? '你不只誠實呈現數據局限，還在開放題裡發現了一個異常訊號：三個互不相識的受訪者說出了同一個從未公開流傳過的具體細節——這不是巧合，這是第一條可能指向刻意植入的線索。'
                                    : '你誠實呈現了問卷數據，並清楚說明問卷只能顯示現況而無法解釋因果。這份紀錄具有方法論的完整性，可進入下一章的文獻分析。'
                                }
                            </p>

                            <div className="border-t border-sky-700/20 pt-5">
                                <div className="font-mono text-xs text-sky-500/70 tracking-widest mb-3">問卷數據已入庫</div>
                                <div className="space-y-2">
                                    <EvidenceItem text="有效回收：24 份（各班隨機抽樣 10%，回收率 85%）" />
                                    <EvidenceItem text="65% 受訪者：「覺得事情有些可疑」，18% 確定相信謠言為真" />
                                    <EvidenceItem text="數據詮釋：相關不等於因果，問卷無法確認疑慮的原因" />
                                    {foundOptimal
                                        ? <EvidenceItem
                                            text="★ 開放題異常：三位來自不同班級的受訪者，均提到禮物卡是在「福利社後方樓梯口」交的，對方還說「這樣比較安全」——這個細節從未出現在任何公開截圖版本裡，三個互不相識的人說出同一個看不見來源的具體場景"
                                            highlight
                                          />
                                        : (
                                            <div className="flex items-center gap-2 text-slate-600 text-xs py-2 px-3">
                                                <Lock size={12} />
                                                <span>開放題異常訊號未發現（重試可解鎖完整線索）</span>
                                            </div>
                                        )
                                    }
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-900/60 border border-slate-800 rounded p-5 mb-5">
                            <p className="text-slate-400 text-xs leading-relaxed mb-1">最危險的從來不是「很多人看過」，而是「很多人以為別人一定都看過了」。當一則訊息開始像空氣一樣流動，查證就會第一個消失。</p>
                            <p className="text-slate-400 text-xs leading-relaxed mb-3">而當不同來源的人都提到同一個從未公開的細節，問題就不只是大家怎麼傳——而是最早那個版本到底長什麼樣子。</p>
                            <div className="font-mono text-xs text-slate-600">第四章｜文獻分析：截圖解剖 — 已解鎖</div>
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
        <span className="text-sky-400 font-mono text-xs">{method}</span>
    </div>
);

const SectionLabel = ({ icon, text, color = 'text-sky-400' }) => (
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
        className="w-full bg-sky-700 hover:bg-sky-600 text-white font-black py-4 rounded-sm transition-all flex items-center justify-center gap-2 text-sm"
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
                <div className="absolute inset-0 opacity-10 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(50,150,200,0.04),rgba(0,100,200,0.02),rgba(50,150,200,0.04))] bg-[length:100%_4px,3px_100%] mix-blend-overlay"></div>
                <div className="absolute top-4 left-4 font-mono text-sky-400 font-bold text-[10px] tracking-widest bg-slate-950/80 px-2 py-1 rounded backdrop-blur-md border border-sky-900/50 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse"></span>
                    LOG • {time}
                </div>
            </div>
        )}
        <div className={`p-6 ${mediaUrl ? 'pt-4' : ''}`}>
            {!mediaUrl && <div className="font-mono text-sky-600/60 text-xs tracking-widest mb-4">{time}</div>}
            <div className="text-slate-300 text-sm leading-relaxed mb-6 space-y-4">{content}</div>
            <button onClick={onAction} className="w-full bg-slate-800 hover:bg-slate-700 border border-transparent hover:border-sky-500/50 text-slate-200 font-black py-4 rounded-sm transition-all flex items-center justify-center gap-2 text-sm">
                {actionLabel} <ChevronRight size={16} />
            </button>
        </div>
    </div>
);

const ChoiceBlock = ({ nodeNum, question, choices, onChoice, directive }) => (
    <div>
        <div className="font-mono text-sky-600/60 text-xs tracking-widest mb-2">決策節點 {nodeNum}</div>
        {directive && (
            <div className="text-[10px] font-mono text-slate-600 tracking-widest mb-4 flex items-center gap-2">
                <span className="text-slate-700">◈</span> 行動守則：{directive}
            </div>
        )}
        <h2 className="text-base font-black text-white mb-6">{question}</h2>
        <div className="space-y-3">
            {choices.map(c => (
                <button key={c.id} onClick={() => onChoice(c.id)} className="w-full text-left bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-sky-600/40 rounded p-5 transition-all group">
                    <div className="flex items-start gap-3">
                        <span className="font-mono text-sky-400 font-bold text-sm flex-shrink-0 mt-0.5 w-4">{c.id}</span>
                        <span className="text-slate-300 text-sm leading-relaxed group-hover:text-white transition-colors">{c.text}</span>
                    </div>
                </button>
            ))}
        </div>
    </div>
);

const EvidenceItem = ({ text, highlight }) => (
    <div className={`flex items-start gap-2 text-xs py-2 px-3 rounded-sm ${highlight ? 'bg-sky-900/20 text-sky-300' : 'text-slate-400'}`}>
        <span className={`flex-shrink-0 mt-0.5 ${highlight ? 'text-sky-400' : 'text-slate-600'}`}>◆</span>
        <span>{text}</span>
    </div>
);
