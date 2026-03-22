import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FileText, AlertTriangle, CheckCircle,
    RotateCcw, ChevronRight, Lock, ShieldCheck, Volume2, VolumeX
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

        if (phase === 'scene1' || phase === 'scene2' || phase === 'scene3' || phase === 'choice1' || phase === 'choice2' || phase === 'choice3') {
            bgmRef.current.play().catch(e => console.log('BGM blocked by browser', e));
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
        setHadCh4Optimal(!!localStorage.getItem(STORAGE_KEYS.ch4Optimal));
        window.scrollTo(0, 0);

        // Preload images
        const pImages = [
            '/assets/phantom/covers/phantom_cover_ch5_bg_v1.webp',
            '/assets/phantom/backgrounds/ch5/phantom_ch5_lab_setup_bg_v1.webp',
            '/assets/phantom/backgrounds/ch5/phantom_ch5_control_design_bg_v1.webp',
            '/assets/phantom/backgrounds/ch5/phantom_ch5_unexpected_result_bg_v1.webp',
            '/assets/phantom/backgrounds/ch5/phantom_ch5_ethics_consent_bg_v1.webp',
            '/assets/phantom/backgrounds/ch5/phantom_ch5_signature_match_bg_v1.webp',
            '/assets/phantom/backgrounds/ch5/phantom_ch5_case_closed_bg_v1.webp'
        ];
        pImages.forEach(src => { const img = new Image(); img.src = src; });
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
                <button onClick={() => navigate('/phantom')} className="text-slate-500 hover:text-violet-400 transition-colors">
                    R.I.B. 調查檔案
                </button>
                <span className="text-slate-700">/</span>
                <span className="text-violet-400/70">幽靈數據</span>
                <span className="text-slate-700">/</span>
                <span className="text-slate-300">第五章｜重現測試</span>
                <div className="ml-auto flex items-center gap-3">
                    <button
                        onClick={toggleMute}
                        title={isMuted ? '開啟音效' : '靜音'}
                        className="text-slate-500 hover:text-violet-400 transition-colors"
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
                            <div className="absolute inset-0 bg-cover bg-center transition-transform duration-[20s] hover:scale-105" style={{ backgroundImage: "url('/assets/phantom/covers/phantom_cover_ch5_bg_v1.webp')" }}></div>
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent"></div>
                            {/* Scanlines & Noise */}
                            <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-overlay" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')" }}></div>
                            <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(100,0,255,0.06),rgba(0,100,255,0.02),rgba(50,0,255,0.06))] bg-[length:100%_4px,3px_100%] opacity-20"></div>
                            
                            <div className="absolute bottom-6 left-6 right-6">
                                <ChapterLabel num="05" method="實驗法" />
                                <h1 className="text-3xl sm:text-4xl font-black text-white mt-2 drop-shadow-md">重現測試</h1>
                            </div>
                        </div>

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
                            <div className="relative w-full h-32 rounded-sm overflow-hidden border border-slate-700 mb-4 shadow-inner">
                                <div className="absolute inset-0 bg-cover bg-center opacity-70" style={{ backgroundImage: "url('/assets/phantom/backgrounds/ch5/phantom_ch5_lab_setup_bg_v1.webp')" }}></div>
                                <div className="absolute inset-0 bg-violet-950/20 mix-blend-color"></div>
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
                                <div className="absolute bottom-2 left-2 text-[10px] text-violet-500 font-mono uppercase tracking-[0.2em] opacity-80 decoration-violet-800/50 underline underline-offset-4">Location: Data Lab // Isolated Environment</div>
                            </div>
                            <p className="text-slate-300 leading-relaxed text-sm">
                                你已經從四個不同角度蒐集了大量間接證據。現在，你需要最後一塊：直接在實驗室中重現「幽靈數據工具」的運作，確認它能做到報告裡的事。這將是整個調查的最終驗證。
                            </p>
                            <div className="grid grid-cols-3 gap-4 border-t border-slate-700 pt-4 text-xs">
                                <MiniStat label="實驗目標" value="重現工具生成數據的過程" />
                                <MiniStat label="對照基準" value="第三章問卷真實回覆" />
                                <MiniStat label="最終目標" value="建立完整舉證鏈" />
                            </div>
                        </div>

                        <div className="bg-violet-950/20 border border-violet-700/30 rounded p-4 mb-8 text-xs text-violet-300/80 leading-relaxed">
                            <strong className="text-violet-400">實驗法的核心規則：</strong>必須設計對照組；結果如實記錄，不得為符合假設而調整；研究對象的資料必須以符合倫理的方式呈現。
                        </div>

                        <PrimaryButton onClick={() => { unlockAudio(); setPhase('scene1'); }} label="進入實驗室" />
                    </div>
                )}

                {phase === 'scene1' && (
                    <SceneBlock
                        time="階段一：實驗設計"
                        mediaUrl="/assets/phantom/backgrounds/ch5/phantom_ch5_control_design_bg_v1.webp"
                        content={
                            <>
                                <p className="text-slate-300 leading-relaxed text-sm mb-4">
                                    你取得了那套「幽靈數據工具」的副本。它的介面正如第一章觀察到的那樣——有「研究問題」、「資料整理」、「圖表輸出」、「結論草稿」四個模組。
                                </p>
                                <p className="text-slate-300 leading-relaxed text-sm mb-4">
                                    在實際執行測試之前，你需要先確定<span className="text-violet-300">實驗設計</span>。你的目標是驗證這項工具是否可以自動憑空生成與原報告極為相似的虛假資料。但「怎麼比」本身就是一個嚴肅的方法學決定。
                                </p>
                                <p className="text-slate-400 text-xs italic leading-relaxed border-l-2 border-slate-700 pl-3">
                                    你的第三章還留著 23 份真實問卷回覆的原始檔案。
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
                        directive="實驗必須有明確的對照基準，才能排除替代解釋，確認變因的影響"
                        mediaUrl="/assets/phantom/backgrounds/ch5/phantom_ch5_control_design_bg_v1.webp"
                        question="你要怎麼設計這個重現實驗？"
                        choices={[
                            { id: 'A', text: '讓工具生成一組數據，直接和第四章取得的報告數據做比對——目標明確：確認工具能否生成這種特徵的數據。' },
                            { id: 'B', text: '設計兩組：實驗組使用工具生成數據，對照組從第三章的 23 份真實問卷抽樣。比較工具生成是否與真實數據有顯著特徵異常。' },
                            { id: 'C', text: '自己手動隨便輸入一組「一般正常問卷應有的數據」作為對照，看工具生成的數據和手動編造的是否有明顯差異。' },
                        ]}
                        onChoice={handleChoice1}
                    />
                )}

                {phase === 'scene2' && (
                    <SceneBlock
                        time="階段二：首輪測試結果"
                        mediaUrl="/assets/phantom/backgrounds/ch5/phantom_ch5_unexpected_result_bg_v1.webp"
                        content={
                            <>
                                <p className="text-slate-300 leading-relaxed text-sm mb-4">
                                    第一輪實驗進行完畢。這款大語言模型輔助工具確實能夠生成符合指定常態分佈參數的虛假數據，這一點得到了確認。
                                </p>
                                <p className="text-slate-300 leading-relaxed text-sm mb-4">
                                    但系統卻亮起了黃燈，因為對照比較顯示了一個你沒預期到的細節：工具生成的數據，標準差比原報告中的數據<strong className="text-amber-500">小了約 15%</strong>。雖然均值極為接近，但離散程度發生了系統性偏移。
                                </p>
                                <p className="text-slate-400 text-xs italic leading-relaxed border-l-2 border-violet-700/40 pl-3">
                                    這可能代表當下使用的工具版本不同、或是當年學生手動調整過參數。面對這不完美的再現，你必須做出應對。
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
                        mediaUrl="/assets/phantom/backgrounds/ch5/phantom_ch5_unexpected_result_bg_v1.webp"
                        question="工具生成的初版數據和報告有 15% 的標準差偏差。你該怎麼辦？"
                        choices={[
                            { id: 'A', text: '調整工具的微調參數，重新生成，確保輸出結果完美貼合報告中的分佈，證明工具可以100%仿製。' },
                            { id: 'B', text: '如實記錄了這個 15% 的標準差減少，推論可能存在工具版本迭代或使用者參與因素，不刪改任何原始測試數據。' },
                            { id: 'C', text: '這 15% 的差異代表實驗徹底失敗。無法100%重現就不算鐵證，刪除本次紀錄並重新規劃。' },
                        ]}
                        onChoice={handleChoice2}
                    />
                )}

                {phase === 'scene3' && (
                    <SceneBlock
                        time="階段三：報告與倫理審查"
                        mediaUrl="/assets/phantom/backgrounds/ch5/phantom_ch5_ethics_consent_bg_v1.webp"
                        content={
                            <>
                                <p className="text-slate-300 leading-relaxed text-sm mb-4">
                                    五週的調查即將收尾。你已經整理好了所有章節的發現，正準備編譯成結案報告，提交給 R.I.B. 總部。
                                </p>
                                <p className="text-slate-300 leading-relaxed text-sm mb-4">
                                    報告中詳細涉及了這些日子的實證：圖書館電腦區的 C1、C3，受訪者林志遠，以及被當作真實對照組的問卷填答者。作為一份要正式歸檔的研究報告，這些證人的資料該如何呈現，是送出前的最後一道門檻。
                                </p>
                                <p className="text-slate-400 text-xs italic leading-relaxed border-l-2 border-violet-700/30 pl-3">
                                    這份調查雖然只有少數管理層會閱讀，但它在法律與研究界裡，仍必須死守基本的研究倫理與保護原則。
                                </p>
                            </>
                        }
                        actionLabel="決定如何處理實證資料"
                        onAction={() => setPhase('choice3')}
                    />
                )}

                {phase === 'choice3' && (
                    <ChoiceBlock
                        nodeNum="03"
                        directive="保護當事人隱私的方式是匿名化，而不是刪除所有相關紀錄，保留論證基礎"
                        mediaUrl="/assets/phantom/backgrounds/ch5/phantom_ch5_ethics_consent_bg_v1.webp"
                        question="面對含有個人細節的調查對象資料，你決定在最終報告中怎麼呈現？"
                        choices={[
                            { id: 'A', text: '全程使用代號（如：對象 C1，受訪者 L）與去識別化描述，剝除可辨識個資，但完整保留其供述與觀察細節。' },
                            { id: 'B', text: '於機密附錄中如實建立對照清冊，列出具體班級與學號等姓名資料，確保本案可以隨時追溯其證據力。' },
                            { id: 'C', text: '安全第一，為避免任何洩密風險，將報告中所有涉及實地觀察人物的段落全部抽掉，僅呈現冷僻的程式與數據分析。' },
                        ]}
                        onChoice={handleChoice3}
                    />
                )}

                {phase === 'fail' && failKey && (() => {
                    const r = FAIL_REASONS[failKey];
                    return (
                        <div>
                            <div className="relative w-full h-40 rounded-sm overflow-hidden border border-red-900/50 mb-5 shadow-2xl">
                                <div className="absolute inset-0 bg-cover bg-center grayscale opacity-60" style={{ backgroundImage: "url('/assets/phantom/backgrounds/ch5/phantom_ch5_lab_setup_bg_v1.webp')" }}></div>
                                <div className="absolute inset-0 bg-red-950/40 mix-blend-color-burn"></div>
                                <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22/%3E%3C/svg%3E')] mix-blend-overlay animate-pulse pointer-events-none"></div>
                                <div className="absolute bottom-4 left-4 text-red-500 font-mono text-xs tracking-[0.3em] font-black uppercase drop-shadow">EXPERIMENT COMPROMISED // ERROR 199</div>
                            </div>

                            <div className="bg-red-950/30 border border-red-700/40 rounded p-6 mb-5">
                                <SectionLabel icon={<AlertTriangle size={13} />} text="任務中止報告" color="text-red-400" />
                                <h2 className="text-lg font-black text-red-300 mt-3 mb-4">{r.type}</h2>
                                <p className="text-slate-300 text-sm leading-relaxed mb-5">{r.detail}</p>
                                <div className="border-t border-red-700/20 pt-4">
                                    <span className="font-mono text-xs text-red-400/60">{r.concept}</span>
                                </div>
                            </div>
                            <button onClick={() => { unlockAudio(); retry(); }} className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-black py-4 rounded transition-all flex items-center justify-center gap-2 text-sm border border-slate-600">
                                <RotateCcw size={15} /> 重新執行驗證
                            </button>
                        </div>
                    );
                })()}

                {phase === 'complete' && (
                    <div>
                        {/* 全案告破 */}
                        <div className="relative w-full h-56 sm:h-64 rounded-lg overflow-hidden border border-violet-800/60 mb-6 shadow-[0_0_30px_rgba(139,92,246,0.15)]">
                            <div className="absolute inset-0 bg-cover bg-center transition-transform duration-[20s] hover:scale-105" style={{ backgroundImage: "url('/assets/phantom/backgrounds/ch5/phantom_ch5_case_closed_bg_v1.webp')" }}></div>
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent"></div>
                            <div className="absolute inset-0 opacity-40 mix-blend-color" style={{ backgroundImage: "linear-gradient(rgba(139, 92, 246, 0.2), rgba(16, 185, 129, 0.1))" }}></div>
                            
                            <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none pb-4">
                                <ShieldCheck size={48} className="text-violet-400 drop-shadow-[0_0_10px_rgba(139,92,246,0.8)] mb-3" />
                                <div className="font-mono text-xs text-violet-300 tracking-[0.6em] mb-1">R.I.B. FINALIZED</div>
                                <h2 className="text-3xl font-black text-white drop-shadow-md">結案報告提交</h2>
                            </div>
                        </div>

                        <div className="bg-slate-900 border border-slate-700/30 rounded p-6 mb-5">
                            <SectionLabel icon={<CheckCircle size={13} />} text="第五章任務完成" color="text-violet-400" />
                            <p className="text-slate-300 text-sm leading-relaxed my-5">
                                五個章節、五種研究方法、五週時間。你從觀察到訪談，從問卷到文獻，最後在實驗室完成了這場實證的最後一哩路。幽靈數據工具的使用軌跡與底層邏輯，已經被你嚴密鎖定。這份無可挑剔的報告會成為 R.I.B. 的典範調查樣本。
                            </p>

                            <div className="border-t border-slate-700/20 pt-5">
                                <div className="font-mono text-xs text-violet-400/70 tracking-widest mb-3 uppercase">Final Evidence Output</div>
                                <div className="space-y-2">
                                    <EvidenceItem text="實驗成功重現！實驗組與控制組的嚴控設計排除了任何工具外的干擾因素。" />
                                    <EvidenceItem text="所有測試皆完全匿名處理，合乎高等研究倫理，未侵犯受測者權益。" />
                                    {foundOptimal
                                        ? (
                                            <div className="relative mt-4">
                                            <div className="relative w-full h-24 mb-3 rounded-sm overflow-hidden border border-emerald-900/30">
                                                <div className="absolute inset-0 bg-cover bg-center opacity-80" style={{ backgroundImage: "url('/assets/phantom/backgrounds/ch5/phantom_ch5_signature_match_bg_v1.webp')" }}></div>
                                                <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/80 to-transparent"></div>
                                                <div className="absolute inset-0 mix-blend-color bg-emerald-900/40"></div>
                                            </div>
                                            <EvidenceItem text="終極洞見：抓死工具 15% 標準差流失的指紋特徵！此項技術特徵被成功留檔，成為鑑定 AI 偽造數據的系統性判準證物！" highlight />
                                            </div>
                                          )
                                        : <div className="flex items-center gap-2 text-slate-600 text-xs py-2 px-3 bg-slate-950 rounded-sm border border-slate-800"><Lock size={12} /><span>最高驗證成就：工具瑕疵技術特徵鑑識（重試可解鎖完美查核）</span></div>
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
    <button onClick={onClick} className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-black py-4 rounded transition-all flex items-center justify-center gap-2 text-sm border border-slate-600 hover:border-violet-500/50 shadow-lg">
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
                <div className="absolute inset-0 opacity-15 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(100,50,255,0.06),rgba(0,200,255,0.02),rgba(50,0,255,0.06))] bg-[length:100%_4px,3px_100%] mix-blend-overlay"></div>
                
                <div className="absolute top-4 left-4 font-mono text-violet-300 font-bold text-[10px] tracking-widest bg-slate-950/80 px-2 py-1 rounded backdrop-blur-md border border-violet-900/50 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-[pulse_2s_infinite]"></span>
                    SYS.LOG • {time}
                </div>
            </div>
        )}

        <div className={`p-6 ${mediaUrl ? 'pt-4' : ''}`}>
            {!mediaUrl && <div className="font-mono text-violet-400/60 text-xs tracking-widest mb-4">{time}</div>}
            
            <div className="text-slate-300 text-sm leading-relaxed mb-6 space-y-4">
                {content}
            </div>
            
            <button
                onClick={onAction}
                className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-600 hover:border-violet-500/50 text-slate-200 font-black py-4 rounded transition-all flex items-center justify-center gap-2 text-sm"
            >
                {actionLabel} <ChevronRight size={16} />
            </button>
        </div>
    </div>
);

const ChoiceBlock = ({ nodeNum, question, choices, onChoice, directive, mediaUrl }) => (
    <div>
        <div className="font-mono text-violet-400/60 text-xs tracking-widest mb-2 border-l-2 border-violet-500/50 pl-2">決策節點 {nodeNum}</div>
        {directive && (
            <div className="text-[10px] font-mono text-violet-300/80 tracking-widest mb-4 flex items-center gap-2 bg-violet-950/20 py-1.5 px-3 rounded border border-violet-900/30">
                <span className="text-violet-400">◈</span> 高限控制：{directive}
            </div>
        )}
        {mediaUrl && (
            <div className="relative w-full h-40 sm:h-48 rounded-lg overflow-hidden border border-slate-700 mb-6 shadow-xl">
                <div className="absolute inset-0 bg-cover bg-center opacity-80" style={{ backgroundImage: `url('${mediaUrl}')` }}></div>
                <div className="absolute inset-0 bg-slate-900/40 mix-blend-multiply"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/20 to-transparent"></div>
            </div>
        )}
        <h2 className="text-base font-black text-white mb-6 leading-relaxed">{question}</h2>
        <div className="space-y-3">
            {choices.map(c => (
                <button key={c.id} onClick={() => onChoice(c.id)}
                    className="w-full text-left bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-violet-600/40 rounded p-5 transition-all group shadow-sm hover:shadow-violet-900/20">
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
