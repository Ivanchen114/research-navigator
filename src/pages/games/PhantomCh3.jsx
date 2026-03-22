import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FileText, AlertTriangle, CheckCircle,
    RotateCcw, ChevronRight, Lock, Volume2, VolumeX
} from 'lucide-react';

const STORAGE_KEYS = {
    agentName:   'rib_agent_name',
    ch2Optimal:  'phantom_ch2_optimal',
    ch3Complete: 'phantom_ch3_complete',
    ch3Optimal:  'phantom_ch3_optimal',
};

const FAIL_REASONS = {
    n1_A: {
        type: '任務中止：誘導性問卷題目導致結果失效',
        detail: '「讓研究結果看起來更完整、更漂亮」——這個措辭已經預設了工具是有益的，受訪者的回答會受到引導而失真。蒐集來的問卷數據，從這一刻起就喪失了反映真實情況的能力。問卷題目一旦有偏誤，無論回收多少份都無法補救。',
        concept: '問卷法核心：題目設計的中立性——問句不應預設答案方向',
        retryPhase: 'scene1',
    },
    n2_A: {
        type: '任務中止：方便取樣導致嚴重選擇偏誤',
        detail: '「願意轉傳」的人和「被轉傳到」的人，本來就不是隨機的——他們可能是特定圈子的朋友，或對這個話題特別有感的人。你得到的樣本，代表的是「願意填問卷的那群人」，不是你想了解的「全體學生」。方便取樣省了力氣，卻讓結論失去推論基礎。',
        concept: '問卷法核心：抽樣方法的代表性——方便取樣（Convenience Sampling）無法確保樣本代表母體',
        retryPhase: 'scene2',
    },
    n2_C: {
        type: '任務中止：隱性強制填答違反研究倫理',
        detail: '「謝謝配合」聽起來很客氣，但把問卷連結公告給全班、附上「今天幫忙填完」的期限，實際上等於取消了拒絕的選項。在班級群組裡，沒有回應本身就會造成社會壓力。研究參與必須是真正自願的——當填答者是因為「大家都要填」而按下送出，他們的回答未必反映真實想法。',
        concept: '問卷法核心：自願參與原則——研究對象有拒絕參與的權利，隱性壓力同樣違反基本研究倫理',
        retryPhase: 'scene2',
    },
    n3_B: {
        type: '任務中止：隱性強制違反知情同意原則',
        detail: '「如果可以的話」聽起來像是在給對方選擇，但前面已強調「這份資料對研究很重要」，再加上一個明確的今日期限——在這樣的組合下，許多人會感受到壓力而被迫填寫，而不是出於真正的意願。研究倫理中的「自願參與」，不只是字面上沒有「要求」，而是確保填答者在沒有心理壓力的情況下做出選擇。',
        concept: '問卷法核心：知情同意與自願參與——催填措辭不得帶有強制意涵，即使語氣客氣',
        retryPhase: 'scene3',
    },
    n3_C: {
        type: '任務中止：丟棄有效資料，重新設計',
        detail: '77% 的回收率在社會科學研究中已屬合理範圍。丟掉這批資料、重新設計問卷，不只浪費時間，也浪費了這 23 位已填答者的努力。正確的做法是分析現有資料，並在報告中誠實說明回收率及其對結論的潛在限制。',
        concept: '問卷法核心：回收率判斷——不完美的回收率應如實呈現，而非重來；丟棄有效資料是研究資源的浪費',
        retryPhase: 'scene3',
    },
};

export const PhantomCh3 = () => {
    const navigate = useNavigate();
    const [phase, setPhase] = useState('briefing');
    const [failKey, setFailKey] = useState(null);
    const [foundOptimal, setFoundOptimal] = useState(false);
    const [agentName, setAgentName] = useState('探員');
    const [hadCh2Optimal, setHadCh2Optimal] = useState(false);
    const [isMuted, setIsMuted] = useState(() => localStorage.getItem('phantom_muted') === 'true');

    // ── 音效設定 ──
    const bgmRef = useRef(null);
    const tensionRef = useRef(null);
    const glitchRef = useRef(null);

    useEffect(() => {
        bgmRef.current = new Audio('/assets/phantom/audio/dragon-studio-creepy-industrial-hum-482882.mp3');
        bgmRef.current.loop = true;
        bgmRef.current.volume = 0.2;
        bgmRef.current.muted = isMuted;

        tensionRef.current = new Audio('/assets/phantom/audio/dragon-studio-heartbeat-sound-372448.mp3');
        tensionRef.current.volume = 0.8;
        tensionRef.current.muted = isMuted;

        glitchRef.current = new Audio('/assets/phantom/audio/virtual_vibes-glitch-sound-effect-hd-379466.mp3');
        glitchRef.current.volume = 0.4;
        glitchRef.current.muted = isMuted;

        return () => {
            if (bgmRef.current) bgmRef.current.pause();
            if (tensionRef.current) tensionRef.current.pause();
            if (glitchRef.current) glitchRef.current.pause();
        };
    }, []);

    // ── 靜音同步 ──
    useEffect(() => {
        if (bgmRef.current) bgmRef.current.muted = isMuted;
        if (tensionRef.current) tensionRef.current.muted = isMuted;
        if (glitchRef.current) glitchRef.current.muted = isMuted;
    }, [isMuted]);

    const toggleMute = () => {
        const newMuted = !isMuted;
        setIsMuted(newMuted);
        localStorage.setItem('phantom_muted', String(newMuted));
    };

    const unlockAudio = () => {
        if (bgmRef.current) bgmRef.current.play().catch(() => {});
        if (tensionRef.current) tensionRef.current.play().then(() => tensionRef.current.pause()).catch(() => {});
        if (glitchRef.current) glitchRef.current.play().then(() => glitchRef.current.pause()).catch(() => {});
    };

    useEffect(() => {
        if (!bgmRef.current || !tensionRef.current || !glitchRef.current) return;

        if (phase === 'scene1' || phase === 'scene2' || phase === 'choice1' || phase === 'choice2') {
            bgmRef.current.play().catch(e => console.log('BGM blocked by browser', e));
        }

        if (phase === 'scene3') {
            tensionRef.current.currentTime = 0;
            tensionRef.current.play().catch(e => console.log('Tension blocked', e));
        }
        
        if (phase === 'fail') {
            bgmRef.current.pause();
            tensionRef.current.pause();
            glitchRef.current.volume = 0.6;
            glitchRef.current.currentTime = 0;
            glitchRef.current.play().catch(e => console.log('Glitch blocked', e));
        }

        if (phase === 'complete') {
            bgmRef.current.pause();
            tensionRef.current.pause();
        }

        if (phase === 'briefing') {
            bgmRef.current.pause();
            bgmRef.current.currentTime = 0;
            tensionRef.current.pause();
            tensionRef.current.currentTime = 0;
        }
    }, [phase]);

    useEffect(() => {
        const name = localStorage.getItem(STORAGE_KEYS.agentName);
        if (name) setAgentName(name);
        setHadCh2Optimal(!!localStorage.getItem(STORAGE_KEYS.ch2Optimal));
        window.scrollTo(0, 0);

        // Preload WebP images for performance
        const pImages = [
            '/assets/phantom/covers/phantom_cover_ch3_bg_v1.webp',
            '/assets/phantom/backgrounds/ch3/phantom_ch3_question_design_bg_v1.webp',
            '/assets/phantom/backgrounds/ch3/phantom_ch3_sampling_strategy_bg_v1.webp',
            '/assets/phantom/backgrounds/ch3/phantom_ch3_response_rate_bg_v1.webp',
            '/assets/phantom/backgrounds/ch3/phantom_ch3_classroom_distribution_bg_v1.webp',
            '/assets/phantom/backgrounds/ch3/phantom_ch3_data_review_bg_v1.webp',
            '/assets/phantom/backgrounds/ch3/phantom_ch3_spread_pattern_bg_v1.webp'
        ];
        pImages.forEach(src => { const img = new Image(); img.src = src; });
    }, [phase]);

    const fail = (key) => { setFailKey(key); setPhase('fail'); };

    const complete = (isOptimal) => {
        localStorage.setItem(STORAGE_KEYS.ch3Complete, 'true');
        if (isOptimal) localStorage.setItem(STORAGE_KEYS.ch3Optimal, 'true');
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
        setFoundOptimal(id === 'C'); // C=重寫=最優；B=刪除=次佳
        setPhase('scene2');
    };

    const handleChoice2 = (id) => {
        if (id === 'A') return fail('n2_A');
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
                <button onClick={() => navigate('/phantom')} className="text-slate-500 hover:text-amber-400 transition-colors">
                    R.I.B. 調查檔案
                </button>
                <span className="text-slate-700">/</span>
                <span className="text-amber-400/70">幽靈數據</span>
                <span className="text-slate-700">/</span>
                <span className="text-slate-300">第三章｜擴散追查</span>
                <div className="ml-auto flex items-center gap-3">
                    <button
                        onClick={toggleMute}
                        title={isMuted ? '開啟音效' : '靜音'}
                        className="text-slate-500 hover:text-amber-400 transition-colors"
                    >
                        {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                    </button>
                    {agentName && <span className="text-slate-600 font-mono text-xs">{agentName}</span>}
                </div>
            </div>

            <div className="max-w-2xl mx-auto px-6 py-12">

                {phase === 'briefing' && (
                    <div>
                        {/* 封面橫幅 */}
                        <div className="relative w-full h-48 sm:h-64 rounded-lg overflow-hidden mb-8 border border-slate-700 shadow-2xl">
                            <div className="absolute inset-0 bg-cover bg-center transition-transform duration-[20s] hover:scale-105" style={{ backgroundImage: "url('/assets/phantom/covers/phantom_cover_ch3_bg_v1.webp')" }}></div>
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent"></div>
                            {/* Scanlines & Noise */}
                            <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-overlay" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')" }}></div>
                            <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] opacity-20"></div>
                            
                            <div className="absolute bottom-6 left-6 right-6">
                                <ChapterLabel num="03" method="問卷法" />
                                <h1 className="text-3xl sm:text-4xl font-black text-white mt-2 drop-shadow-md">擴散追查</h1>
                            </div>
                        </div>

                        <div className="bg-slate-900/60 border border-slate-700/50 rounded p-4 mb-5 space-y-1.5">
                            <div className="font-mono text-xs text-slate-500 tracking-widest mb-2">◈ 來自前章的線索</div>
                            <EvidenceItem text="林志遠確認班上「有些人」在使用該工具，並非孤立案例" />
                            {hadCh2Optimal
                                ? <EvidenceItem text="追問確認工具具備「圖表直接輸出」功能——使用者不需要懂統計，工具會自動產生" highlight />
                                : <div className="flex items-center gap-2 text-slate-600 text-xs py-1.5 px-3"><Lock size={11} /><span>工具功能細節未取得（第二章最優路徑可解鎖）</span></div>
                            }
                        </div>

                        <div className="bg-slate-900 border border-slate-700 rounded p-6 mb-5 space-y-4">
                            <SectionLabel icon={<FileText size={13} />} text="任務簡報" />
                            <p className="text-slate-300 leading-relaxed text-sm">
                                訪談只能讓你接觸到個別知情者的說法。現在你需要更大範圍的資料：這個工具在校內到底有多普及？有多少人在使用？你決定以「研究方法使用習慣調查」為名，設計一份匿名問卷，發放給三個班級。
                            </p>
                            <div className="grid grid-cols-3 gap-4 border-t border-slate-700 pt-4 text-xs">
                                <MiniStat label="發放對象" value="三個班，各隨機抽樣" />
                                <MiniStat label="問卷性質" value="匿名，自願填寫" />
                                <MiniStat label="任務限制" value="不得以調查為由強制填答" />
                            </div>
                        </div>

                        <div className="bg-amber-950/20 border border-amber-700/30 rounded p-4 mb-8 text-xs text-amber-300/80 leading-relaxed">
                            <strong className="text-amber-400">問卷法的核心規則：</strong>題目設計必須中立、不引導；抽樣必須具有代表性；填答必須完全出於自願。每一個環節的疏漏，都會讓整份資料的可信度打折扣。
                        </div>

                        <PrimaryButton onClick={() => { unlockAudio(); setPhase('scene1'); }} label="開始設計問卷" />
                    </div>
                )}

                {phase === 'scene1' && (
                    <SceneBlock
                        time="問卷草稿審查"
                        mediaUrl="/assets/phantom/backgrounds/ch3/phantom_ch3_question_design_bg_v1.webp"
                        content={
                            <>
                                <p className="text-slate-300 leading-relaxed text-sm mb-4">
                                    你花了兩個小時草擬了一份十題的問卷，主題設定為「高中生研究資料蒐集習慣調查」。
                                </p>
                                <p className="text-slate-300 leading-relaxed text-sm mb-4">
                                    寄出前你仔細重讀每一道題。讀到第三題時，你停下來了：
                                </p>
                                <div className="bg-slate-800/60 border border-slate-700 rounded p-4 text-sm text-slate-200 font-medium leading-relaxed">
                                    第3題：「你是否使用過那些能讓研究結果看起來<span className="text-amber-400">更完整、更漂亮</span>的輔助工具？」
                                </div>
                            </>
                        }
                        actionLabel="決定怎麼處理這題"
                        onAction={() => setPhase('choice1')}
                    />
                )}

                {phase === 'choice1' && (
                    <ChoiceBlock
                        nodeNum="01"
                        directive="問卷題目不得預設答案方向或帶有引導性措辭"
                        question="第3題的措辭讓你停頓了。你打算怎麼做？"
                        choices={[
                            { id: 'A', text: '措辭沒有大問題，問的方向是對的，直接寄出。' },
                            { id: 'B', text: '把第3題整題刪掉，少問一個問題總比問錯好。' },
                            { id: 'C', text: '修改措辭：「你是否曾使用非 Excel 或 Word 的工具來協助研究資料整理或分析？」' },
                        ]}
                        onChoice={handleChoice1}
                    />
                )}

                {phase === 'scene2' && (
                    <SceneBlock
                        time="抽樣策略決定"
                        mediaUrl="/assets/phantom/backgrounds/ch3/phantom_ch3_sampling_strategy_bg_v1.webp"
                        content={
                            <>
                                <p className="text-slate-300 leading-relaxed text-sm mb-4">
                                    問卷題目定稿，共九題（或十題）。現在你需要決定：要讓哪些人填？
                                </p>
                                <p className="text-slate-300 leading-relaxed text-sm mb-4">
                                    你鎖定了三個班級，目標是從每班抽取 10 人，共 30 份樣本。但「怎麼抽」這件事本身，就是一個研究方法的決定。
                                </p>
                                <p className="text-slate-400 text-xs italic leading-relaxed">
                                    抽樣方式決定了你的結論能不能推論到更廣泛的學生群體。
                                </p>
                            </>
                        }
                        actionLabel="決定抽樣方式"
                        onAction={() => setPhase('choice2')}
                    />
                )}

                {phase === 'choice2' && (
                    <ChoiceBlock
                        nodeNum="02"
                        directive="樣本必須能代表你想了解的母體，不能只代表方便取得的人"
                        question="你要怎麼決定誰來填這份問卷？"
                        choices={[
                            { id: 'A', text: '把問卷傳給幾個認識的同學，請他們再轉傳給有意願填的人。' },
                            { id: 'B', text: '向三個班的導師取得名冊，從每班各隨機抽取 10 人，直接邀請他們填寫。' },
                            { id: 'C', text: '在三個班的班群貼出連結，附上說明：「這是本學期的研究記錄，麻煩各位同學今天幫忙填完，謝謝大家的配合。」' },
                        ]}
                        onChoice={handleChoice2}
                    />
                )}

                {phase === 'scene3' && (
                    <SceneBlock
                        time="三天後，回收結果"
                        mediaUrl="/assets/phantom/backgrounds/ch3/phantom_ch3_response_rate_bg_v1.webp"
                        content={
                            <>
                                <p className="text-slate-300 leading-relaxed text-sm mb-4">
                                    問卷發出去了。三天過後，你打開後台查看：
                                </p>
                                <div className="bg-slate-800/60 border border-slate-700 rounded p-4 text-sm text-slate-200 mb-4">
                                    <div className="font-mono text-xs text-slate-500 mb-2">回收狀態</div>
                                    <div className="text-2xl font-black text-white">23 <span className="text-slate-500 text-base font-normal">/ 30 份</span></div>
                                    <div className="text-xs text-slate-400 mt-1">回收率 77%　有效回覆 23 份</div>
                                </div>
                                <p className="text-slate-400 text-xs leading-relaxed italic">
                                    剩下 7 人沒有回應。可能是太忙、沒看到邀請，或者選擇不參與。
                                </p>
                            </>
                        }
                        actionLabel="決定如何處理"
                        onAction={() => setPhase('choice3')}
                    />
                )}

                {phase === 'choice3' && (
                    <ChoiceBlock
                        nodeNum="03"
                        directive="不完美的資料應誠實呈現限制，而非用不當手段補救"
                        question="30 份中有 23 份回覆，回收率 77%。你怎麼處理？"
                        choices={[
                            { id: 'A', text: '以現有的 23 份進行分析，在報告中標注回收率（77%）及對結論的潛在影響。' },
                            { id: 'B', text: '再發一次提醒給未填的 7 人，說明這份資料對研究很重要，「如果可以的話，希望今天前填完，非常感謝」。' },
                            { id: 'C', text: '認為樣本不夠完整，把這批問卷全部作廢，重新設計一份更短、更好填的版本。' },
                        ]}
                        onChoice={handleChoice3}
                    />
                )}

                {phase === 'fail' && failKey && (() => {
                    const r = FAIL_REASONS[failKey];
                    return (
                        <div>
                            <div className="relative w-full h-40 rounded-sm overflow-hidden border border-red-900/50 mb-5 shadow-2xl">
                                <div className="absolute inset-0 bg-cover bg-center grayscale opacity-60" style={{ backgroundImage: "url('/assets/phantom/backgrounds/ch3/phantom_ch3_classroom_distribution_bg_v1.webp')" }}></div>
                                <div className="absolute inset-0 bg-red-950/40 mix-blend-color-burn"></div>
                                <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22/%3E%3C/svg%3E')] mix-blend-overlay animate-pulse pointer-events-none"></div>
                                <div className="absolute bottom-4 left-4 text-red-500 font-mono text-xs tracking-[0.3em] font-black uppercase drop-shadow">Survey Compromised // Aborted</div>
                            </div>
                            <div className="bg-red-950/30 border border-red-700/40 rounded p-6 mb-5">
                                <SectionLabel icon={<AlertTriangle size={13} />} text="任務中止報告" color="text-red-400" />
                                <h2 className="text-lg font-black text-red-300 mt-3 mb-4">{r.type}</h2>
                                <p className="text-slate-300 text-sm leading-relaxed mb-5">{r.detail}</p>
                                <div className="border-t border-red-700/20 pt-4">
                                    <span className="font-mono text-xs text-red-400/60">{r.concept}</span>
                                </div>
                            </div>
                            <button onClick={() => { unlockAudio(); retry(); }} className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-black py-4 rounded transition-all flex items-center justify-center gap-2 text-sm">
                                <RotateCcw size={15} /> 重新執行任務
                            </button>
                        </div>
                    );
                })()}

                {phase === 'complete' && (
                    <div>
                        <div className="relative w-full h-48 rounded-sm overflow-hidden border border-emerald-900/50 mb-5 shadow-2xl">
                            <div className="absolute inset-0 bg-cover bg-center transition-transform duration-[15s] hover:scale-105" style={{ backgroundImage: "url('/assets/phantom/backgrounds/ch3/phantom_ch3_data_review_bg_v1.webp')" }}></div>
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent"></div>
                            <div className="absolute inset-0 opacity-30 mix-blend-overlay pointer-events-none" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')" }}></div>
                            <div className="absolute bottom-4 left-4 text-emerald-400 font-mono text-xs tracking-[0.3em] font-black uppercase drop-shadow">Data Aggregation Complete</div>
                        </div>
                        <div className="bg-emerald-950/20 border border-emerald-700/30 rounded p-6 mb-5">
                            <SectionLabel icon={<CheckCircle size={13} />} text="任務完成" color="text-emerald-400" />
                            <h2 className="text-xl font-black text-emerald-300 mt-3 mb-4">問卷調查任務成功</h2>
                            <p className="text-slate-300 text-sm leading-relaxed mb-6">
                                你完成了一份在設計與執行上皆符合研究倫理的問卷調查。題目中立、抽樣具代表性、填答自願，並如實呈現資料限制。這份調查結果為工具擴散程度提供了量化根據。
                            </p>
                            <div className="border-t border-emerald-700/20 pt-5">
                                <div className="font-mono text-xs text-emerald-500/70 tracking-widest mb-3">證據碎片已入庫</div>
                                <div className="space-y-2">
                                    <EvidenceItem text="23 份有效回覆中，26% 表示曾使用「非 Excel / Word 的研究輔助工具」" />
                                    <EvidenceItem text="43% 表示知道班上同學在使用此類工具——使用者遠不止觀察到的 C1、C3" />
                                    {foundOptimal
                                        ? (
                                            <div className="mt-4 border border-emerald-500/20 rounded-sm overflow-hidden content-start">
                                                <div className="relative h-16 w-full">
                                                    <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/assets/phantom/backgrounds/ch3/phantom_ch3_spread_pattern_bg_v1.webp')" }}></div>
                                                    <div className="absolute inset-0 bg-emerald-950/60"></div>
                                                    <div className="absolute inset-0 flex items-center px-4 font-mono text-xs text-emerald-400 tracking-widest">SPREAD PATTERN CONFIRMED</div>
                                                </div>
                                                <div className="p-3 bg-emerald-950/40">
                                                    <EvidenceItem text="中性題目設計下，自由填寫欄顯示受訪者描述的工具功能集中在「圖表輸出」與「結論整理」，與訪談線索高度吻合" highlight />
                                                </div>
                                            </div>
                                        )
                                        : <div className="flex items-center gap-2 text-slate-600 text-xs py-2 px-3 mt-2"><Lock size={12} /><span>題目已刪除，工具功能細節未能從問卷取得（重試可解鎖）</span></div>
                                    }
                                </div>
                            </div>
                        </div>
                        <div className="bg-slate-900/60 border border-slate-800 rounded p-4 mb-5 text-xs text-slate-500 font-mono">
                            第四章｜文獻分析：檔案比對 — 已解鎖
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
        <span className="text-amber-400 font-mono text-xs">{method}</span>
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
                
                <div className="absolute top-4 left-4 font-mono text-amber-400 font-bold text-[10px] tracking-widest bg-slate-950/80 px-2 py-1 rounded backdrop-blur-md border border-amber-900/50 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                    REC • {time}
                </div>
            </div>
        )}

        <div className={`p-6 ${mediaUrl ? 'pt-4' : ''}`}>
            {!mediaUrl && <div className="font-mono text-amber-600/60 text-xs tracking-widest mb-4">{time}</div>}
            
            <div className="text-slate-300 text-sm leading-relaxed mb-6 space-y-4">
                {content}
            </div>
            
            <button
                onClick={onAction}
                className="w-full bg-slate-800 hover:bg-slate-700 border border-transparent hover:border-amber-500/50 text-slate-200 font-black py-4 rounded transition-all flex items-center justify-center gap-2 text-sm"
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
                <button key={c.id} onClick={() => onChoice(c.id)}
                    className="w-full text-left bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-amber-600/40 rounded p-5 transition-all group">
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
    <div className={`flex items-start gap-2 text-xs py-2 px-3 rounded-sm ${highlight ? 'bg-emerald-900/20 text-emerald-300' : 'text-slate-400'}`}>
        <span className={`flex-shrink-0 mt-0.5 ${highlight ? 'text-emerald-400' : 'text-slate-600'}`}>◆</span>
        <span>{text}</span>
    </div>
);
