import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Stethoscope,
    ArrowRight,
    Gamepad2,
    Lightbulb,
    HelpCircle,
    CheckCircle2,
    Map,
    ClipboardList,
    Mic,
    TestTube2,
    Eye,
    BookOpen,
    ChevronRight,
    Activity,
    Lock,
    Unlock,
    Download
} from 'lucide-react';
import LessonMap from '../components/ui/LessonMap';
import { W6Data } from '../data/lessonMaps';

const CATEGORIES = [
    { icon: '📋', name: '問卷科', desc: '想知道比例、趨勢、多少人', id: 'survey' },
    { icon: '🎤', name: '訪談科', desc: '想知道原因、想法、為什麼', id: 'interview' },
    { icon: '🧪', name: '實驗科', desc: '想證明 A 會導致 B', id: 'experiment' },
    { icon: '👀', name: '觀察科', desc: '想記錄真實行為，不靠自報', id: 'observation' },
    { icon: '📚', name: '文獻科', desc: '想整理現有研究的趨勢', id: 'literature' },
];

const TRIAGE_QUESTIONS = [
    { id: '❶', q: '我要「比例／趨勢」還是「原因／故事」？', results: ['比例趨勢 → 📋 問卷', '原因故事 → 🎤 訪談'] },
    { id: '❷', q: '我要「證明因果」還是「描述現象」？', results: ['證明因果 → 🧪 實驗', '描述現象 → 其他方法'] },
    { id: '❸', q: '我要「真實行為」還是「想法態度」？', results: ['真實行為 → 👀 觀察', '想法態度 → 問卷／訪談'] },
    { id: '❹', q: '附加：我要「整理現有研究」嗎？', results: ['是 → 📚 文獻'] },
];

const PRACTICE_ROUNDS = [
    {
        title: 'Round 1 · 單一方法',
        cases: [
            { q: '「我想知道全校高一每天睡滿七小時的人比例」', a: '📋 問卷科' },
            { q: '「我想知道睡不著的同學睡前都在想什麼」', a: '🎤 訪談科' },
            { q: '「我想知道圖書館午休大家在做什麼」', a: '👀 觀察科' },
            { q: '「我想知道某種記憶方法是否真的有效」', a: '🧪 實驗科' },
        ]
    },
    {
        title: 'Round 2 · 複合方法（主 + 輔）',
        cases: [
            { q: '「手機使用會不會影響睡眠？影響機制是什麼？」', a: '📋 主 + 🎤 輔' },
            { q: '「上課分心頻率多高？通常在哪些時段？」', a: '👀 主 + 📋 輔' },
            { q: '「走廊奔跑為什麼一直發生？哪些規範有效？」', a: '🎤 主 + 👀 輔' },
        ]
    }
];

const Y_CASES = [
    { id: 'YQ1', wrong: '原掛：問卷科', goal: '理解睡前「焦慮想法」是如何形成的？', correct: '🎤 訪談科', reason: '焦慮想法的形成涉及複雜的心理機制，問卷選項只能調查「現象分布」，無法挖掘「為何如此」的深層原因，應用訪談深度探索。' },
    { id: 'YQ2', wrong: '原掛：問卷科', goal: '了解午休時，學生「實際使用手機」的真實行為。', correct: '👀 觀察科', reason: '涉及違反校規的行為，學生在問卷中極可能說謊（社會期許偏誤）。要得知「實際行為」，應在不干預的情況下直接觀察記錄。' },
    { id: 'YI1', wrong: '原掛：訪談科', goal: '估計全校 1500 人中，每天使用 AI 超過 30 分鐘的人數比例。', correct: '📋 問卷科', reason: '訪談樣本數極少，無法推論至母體。要知道「比例」與「全校趨勢」，應進行大量隨機抽樣問卷。' },
    { id: 'YI2', wrong: '原掛：訪談科', goal: '證實「圖像記憶法」是否真的能提升成績（因果關係）。', correct: '🧪 實驗科', reason: '訪談只能得到主觀感覺，無法排除干擾變項。要證明因果關係，必須透過對照組與測驗數據。' },
    { id: 'YE1', wrong: '原掛：實驗科', goal: '了解含糖飲料攝取與體重的「現況趨勢」（不想介入）。', correct: '📋 問卷 / 📚 文獻', reason: '研究目的明確說「不想介入」，但實驗科的核心就是人為介入。若要看現況相關性，應用問卷調查飲食習慣與體重。' },
    { id: 'YE2', wrong: '原掛：實驗科', goal: '了解學生在圖書館午休時「實際上」都在做什麼。', correct: '👀 觀察科', reason: '實驗科的人為設定環境會破壞「自然性」。要看學生自然反應，應在旁側錄或記錄，不干預。' },
    { id: 'YO1', wrong: '原掛：觀察科', goal: '了解學生為什麼會害怕上台報告（內心原因）。', correct: '🎤 訪談科', reason: '觀察科只能紀錄外顯行為（發抖、流汗），無法得知內心想法。表情僵硬可能是沒睡好，必須直接詢問內心感受。' },
    { id: 'YO2', wrong: '原掛：觀察科', goal: '了解學生使用 AI 寫作業的「動機」與「價值衝突」。', correct: '🎤 訪談科', reason: '作業成品是結果，無法顯現動機與內心衝突。觀察法無法透視腦內的抉擇過程，應與學生直接對話。' },
    { id: 'YL1', wrong: '原掛：文獻科', goal: '找出「本校高一學生」使用 AI 的實際頻率與用途。', correct: '📋 問卷科', reason: '文獻查到的是別人的研究結果，無法代表「本校現況」。要獲得在地化的第一手資料，應針對全校發放問卷。' },
    { id: 'YL2', wrong: '原掛：文獻科', goal: '判斷「番茄鐘學習法」對本班同學是否有效（驗證成效）。', correct: '🧪 實驗科', reason: '文獻只能知道理論上是否有用，無法得知「對本班」是否有用。要驗證成效，必須讓同學實際操作並記錄前後測成績。' },
    { id: 'YQ3', wrong: '原掛：問卷科', goal: '驗證考試與精神狀態的因果關係。', correct: '🧪 實驗科', reason: '因果關係需透過操弄自變項來測量。問卷問的是「意見」，不代表生理上的真實反應。' },
    { id: 'YI3', wrong: '原掛：訪談科', goal: '了解「全台灣」高中生手搖飲花費（具代表性數據）。', correct: '📋 問卷 / 📚 文獻', reason: '3 個好友的訪談完全無法代表全台灣。要得知大規模平均數據，應進行抽樣問卷或查閱政府統計資料。' },
    { id: 'YE3', wrong: '原掛：實驗科', goal: '了解吉他社的「社團文化」與「互動氣氛」。', correct: '👀 觀察科', reason: '文化與氣氛是長期互動形成的。實驗科的人為操弄會瞬間摧毀真實的互動模式，應進行長期參與觀察。' },
    { id: 'YO3', wrong: '原掛：觀察科', goal: '了解學生「未來大學想讀什麼科系」的規劃。', correct: '📋 問卷 / 🎤 訪談', reason: '未來規劃屬於內心想法，無法從外表或行為觀察得知。應用問卷進行大規模志向調查，或用訪談深入了解決策過程。' },
    { id: 'YL3', wrong: '原掛：文獻科', goal: '了解「本班導師」的真實看法與標準。', correct: '🎤 訪談科', reason: '書本寫的是一般性理論，不代表特定對象的觀點。要了解特定導師的標準，直接去約談老師最準確。' }
];

export const ClinicPage = () => {
    const [showLessonMap, setShowLessonMap] = useState(false);
    const [revealedCases, setRevealedCases] = useState({});
    const [revealedYCases, setRevealedYCases] = useState({});
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [lockClickCount, setLockClickCount] = useState(0);

    const toggleCase = (id) => {
        setRevealedCases(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const toggleYCase = (id) => {
        if (!isUnlocked) {
            alert('🔒 存取被拒：診斷報告已加密，請小組討論後由老師解鎖。');
            return;
        }
        setRevealedYCases(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const handleLockClick = () => {
        const next = lockClickCount + 1;
        setLockClickCount(next);
        if (next >= 3) {
            setIsUnlocked(true);
        }
    };

    return (
        <div className="max-w-5xl mx-auto px-6 lg:px-12 py-8 space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-500 font-['Noto_Sans_TC',sans-serif] text-[14px] leading-[1.6] text-[#1a1a2e] pb-32">

            {/* TOP BAR / NAVIGATION PATH */}
            <div className="flex items-center justify-between border-b border-[#dddbd5] pb-4 -mt-4">
                <div className="text-[11px] font-['DM_Mono',monospace] text-[#8888aa] flex items-center gap-2">
                    研究規劃 / <span>研究診所 W6</span>
                </div>
                <div className="flex items-center gap-4">
                    <span className="bg-[#f0ede6] text-[#1a1a2e] text-[10px] font-bold px-2 py-0.5 rounded-[2px] font-['DM_Mono',monospace]">100 MINS</span>
                    <button
                        onClick={() => setShowLessonMap(!showLessonMap)}
                        className="text-[11px] text-[#8888aa] hover:text-[#2d5be3] transition-colors flex items-center gap-1 font-['DM_Mono',monospace]"
                    >
                        <Map size={12} /> {showLessonMap ? 'Hide Plan' : 'Instructor View'}
                    </button>
                </div>
            </div>

            {showLessonMap && (
                <div className="animate-in slide-in-from-top-4 duration-300">
                    <LessonMap data={W6Data} />
                </div>
            )}

            {/* PAGE HEADER */}
            <header>
                <div className="text-[11px] font-['DM_Mono',monospace] text-[#2d5be3] mb-3 tracking-[0.2em] uppercase">🏥 W6 · 核心模組</div>
                <h1 className="font-['Noto_Serif_TC',serif] text-[42px] font-bold leading-[1.2] text-[#1a1a2e] mb-4 tracking-[-0.02em]">
                    研究診所：<br />
                    <span className="text-[#2d5be3]">掛號判斷工作坊</span>
                </h1>
                <p className="text-[16px] text-[#4a4a6a] max-w-[650px] leading-relaxed">
                    你知道要研究什麼，但你知道要怎麼研究嗎？今天只學一件事：<strong>分科三問</strong>——用三個問題判斷你的研究該掛哪一科。掛錯科，後面所有努力都白費。
                </p>

                {/* META STRIP */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-[1px] bg-[#dddbd5] border border-[#dddbd5] rounded-[10px] overflow-hidden mt-10 shadow-sm">
                    {[
                        { label: '本週任務', value: '掛號判斷 · Level 1' },
                        { label: '課堂產出', value: '3 份 Y 型病例' },
                        { label: '課後作業', value: '學習單 (下週一)' },
                        { label: '下週預告', value: 'W7 分科三問小考' }
                    ].map((item, idx) => (
                        <div key={idx} className="bg-white p-5">
                            <div className="text-[9px] font-['DM_Mono',monospace] text-[#8888aa] uppercase tracking-widest mb-1">{item.label}</div>
                            <div className="text-[13px] font-bold text-[#1a1a2e]">{item.value}</div>
                        </div>
                    ))}
                </div>
            </header>

            {/* PART 1: 學什麼 (CONCEPT) */}
            <section className="space-y-10">
                <div className="flex items-center gap-4">
                    <h2 className="font-['Noto_Serif_TC',serif] text-[20px] font-bold text-[#1a1a2e] whitespace-nowrap">學什麼</h2>
                    <div className="h-px bg-[#dddbd5] flex-1"></div>
                    <span className="text-[10px] font-['DM_Mono',monospace] text-[#8888aa] uppercase tracking-widest">Concept</span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {CATEGORIES.map((cat) => (
                        <div key={cat.id} className="bg-white border border-[#dddbd5] p-5 rounded-[8px] text-center hover:border-[#2d5be3] transition-colors group">
                            <div className="text-[32px] mb-3 group-hover:scale-110 transition-transform">{cat.icon}</div>
                            <h3 className="font-bold text-[14px] text-[#1a1a2e] mb-1">{cat.name}</h3>
                            <p className="text-[11px] text-[#8888aa] leading-tight">{cat.desc}</p>
                        </div>
                    ))}
                </div>

                <div className="border-2 border-[#1a1a2e] rounded-[10px] overflow-hidden">
                    <div className="bg-[#1a1a2e] p-4 text-white font-['Noto_Serif_TC',serif] font-bold flex items-center gap-2">
                        <ClipboardList size={20} /> 分科三問速查卡
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-[1px] bg-[#dddbd5]">
                        {TRIAGE_QUESTIONS.map((tq) => (
                            <div key={tq.id} className="bg-white p-6 space-y-4">
                                <div className="flex items-start gap-2">
                                    <span className="text-[14px] font-['DM_Mono',monospace] font-bold text-[#2d5be3]">{tq.id}</span>
                                    <h4 className="font-bold text-[13px] text-[#1a1a2e] leading-snug">{tq.q}</h4>
                                </div>
                                <div className="space-y-1.5 pl-6">
                                    {tq.results.map((res, i) => (
                                        <div key={i} className="text-[12px] text-[#4a4a6a]">
                                            <span className="bg-[#f0ede6] px-1.5 py-0.5 rounded-[2px] text-[10px] font-bold mr-2">RESULT</span>
                                            {res}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* PART 2: 練什麼 (PRACTICE) */}
            <section className="space-y-10">
                <div className="flex items-center gap-4">
                    <h2 className="font-['Noto_Serif_TC',serif] text-[20px] font-bold text-[#1a1a2e] whitespace-nowrap">練什麼</h2>
                    <div className="h-px bg-[#dddbd5] flex-1"></div>
                    <span className="text-[10px] font-['DM_Mono',monospace] text-[#8888aa] uppercase tracking-widest">Practice</span>
                </div>

                {/* 急診分流練習 */}
                <div className="bg-white border border-[#dddbd5] rounded-[10px] overflow-hidden shadow-sm">
                    <div className="bg-[#f8f7f4] p-5 border-b border-[#dddbd5] flex items-center justify-between">
                        <div className="flex items-center gap-2 font-bold text-[#1a1a2e]">
                            <Activity className="text-[#2d5be3]" size={18} /> ⚡ 急診分流練習
                        </div>
                        <span className="text-[11px] text-[#8888aa]">點擊右側診斷按鈕查看結果</span>
                    </div>
                    {PRACTICE_ROUNDS.map((round, rIdx) => (
                        <div key={rIdx} className="border-b last:border-b-0 border-[#dddbd5]">
                            <div className="px-6 py-3 bg-[#f0ede6]/50 text-[10px] font-['DM_Mono',monospace] font-bold text-[#8888aa] uppercase tracking-widest">
                                {round.title}
                            </div>
                            <div className="divide-y divide-[#dddbd5]">
                                {round.cases.map((c, cIdx) => (
                                    <div key={cIdx} className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group hover:bg-[#f8f7f4] transition-colors">
                                        <p className="text-[14px] text-[#1a1a2e] italic">「{c.q}」</p>
                                        <div className="flex items-center gap-3 shrink-0">
                                            {revealedCases[`${rIdx}-${cIdx}`] && (
                                                <div className="text-[13px] font-bold text-[#2d5be3] bg-[#e8eeff] px-2 py-1 rounded-[4px] border border-[#2d5be3]/20 animate-in slide-in-from-right-2">
                                                    {c.a}
                                                </div>
                                            )}
                                            <button
                                                onClick={() => toggleCase(`${rIdx}-${cIdx}`)}
                                                className={`px-4 py-1.5 rounded-[4px] text-[11px] font-bold transition-all ${revealedCases[`${rIdx}-${cIdx}`] ? 'bg-[#1a1a2e] text-white' : 'border border-[#1a1a2e] text-[#1a1a2e] hover:bg-[#1a1a2e] hover:text-white'}`}
                                            >
                                                {revealedCases[`${rIdx}-${cIdx}`] ? 'RESET' : 'DIAGNOSIS'}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Y型病例庫 */}
                <div className="space-y-6">
                    <div className="bg-[#fdf2f2] border border-[#f2dada] p-6 rounded-[10px] flex items-start gap-4">
                        <Stethoscope className="text-[#e32d5b] shrink-0 mt-1" size={20} />
                        <div className="space-y-1">
                            <h4 className="font-bold text-[15px] text-[#1a1a2e] flex items-center gap-2">
                                🩺 Y 型病例庫 (Triage Database)
                                <button onClick={handleLockClick} className="opacity-0 w-8 h-8 -ml-2 select-none"></button>
                                {isUnlocked && <span className="text-[10px] bg-[#2e7d5a] text-white px-2 py-0.5 rounded-full flex items-center gap-1 font-normal"><Unlock size={10} /> 主治醫師權限開啟</span>}
                            </h4>
                            <p className="text-[13px] text-[#4a4a6a]">以下是 15 份掛錯科的真實案例。先看研究目的，自己判斷應該掛哪科，再由老師解鎖看答案。</p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        {Y_CASES.map((y) => (
                            <div key={y.id} className="bg-white border border-[#dddbd5] rounded-[8px] overflow-hidden flex flex-col group hover:border-[#8888aa] transition-colors">
                                <div className="bg-[#f0ede6] px-4 py-2 border-b border-[#dddbd5] flex items-center justify-between">
                                    <span className="text-[10px] font-['DM_Mono',monospace] font-bold text-[#8888aa] tracking-widest">{y.id}</span>
                                    <span className="text-[10px] font-bold text-[#e32d5b] px-2 py-0.5 bg-[#fdf2f2] rounded-[2px] border border-[#f2dada]">{y.wrong}</span>
                                </div>
                                <div className="p-5 flex-1 space-y-4">
                                    <div>
                                        <div className="text-[10px] font-bold text-[#8888aa] uppercase tracking-wider mb-1">Research Goal</div>
                                        <p className="text-[14px] font-medium text-[#1a1a2e] leading-snug">{y.goal}</p>
                                    </div>

                                    {revealedYCases[y.id] ? (
                                        <div className="bg-[#e8f5ee] border border-[#2e7d5a]/20 p-4 rounded-[4px] animate-in zoom-in-95 duration-200">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="text-[10px] font-bold text-[#2e7d5a] uppercase">Correct Triage:</span>
                                                <span className="font-bold text-[13px] text-[#1a1a2e]">{y.correct}</span>
                                            </div>
                                            <p className="text-[12px] text-[#4a4a6a] leading-relaxed italic border-t border-[#2e7d5a]/10 pt-2 mt-2">
                                                「{y.reason}」
                                            </p>
                                            <button onClick={() => setRevealedYCases(prev => ({ ...prev, [y.id]: false }))} className="text-[10px] text-[#8888aa] mt-3 underline block">收起診斷</button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => toggleYCase(y.id)}
                                            className="w-full py-2 bg-[#f8f7f4] border border-[#dddbd5] rounded-[4px] text-[11px] font-bold text-[#4a4a6a] hover:bg-[#1a1a2e] hover:text-white transition-all flex items-center justify-center gap-2"
                                        >
                                            <ChevronRight size={14} /> 檢索診斷書
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* PART 3: 課堂任務 (IN-CLASS) */}
            <section className="space-y-10">
                <div className="flex items-center gap-4">
                    <h2 className="font-['Noto_Serif_TC',serif] text-[20px] font-bold text-[#1a1a2e] whitespace-nowrap">課堂任務</h2>
                    <div className="h-px bg-[#dddbd5] flex-1"></div>
                    <span className="text-[10px] font-['DM_Mono',monospace] text-[#8888aa] uppercase tracking-widest">In-Class Task</span>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    <div className="bg-white border-2 border-[#1a1a2e] p-8 rounded-[10px] relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform"><CheckCircle2 size={100} /></div>
                        <div className="relative z-10 space-y-6">
                            <div className="flex items-center gap-3">
                                <span className="bg-[#2d5be3] text-white text-[10px] font-bold px-3 py-1 rounded-full font-['DM_Mono',monospace]">TASK 01</span>
                                <h3 className="font-bold text-[18px] text-[#1a1a2e]">小組 Y 型病例診斷</h3>
                            </div>
                            <ol className="space-y-3 text-[14px] text-[#4a4a6a] list-decimal pl-5">
                                <li>領取三份 Y 型實體病例紙本</li>
                                <li>判斷是否掛對科？應改掛哪科？</li>
                                <li>用「分科三問」說出一句理由</li>
                                <li>全組簽名並拍照上傳封印</li>
                            </ol>
                            <div className="pt-4 flex items-center gap-4 text-[12px] text-[#8888aa]">
                                <span className="flex items-center gap-1"><Download size={14} /> 線上對照</span>
                                <span className="flex items-center gap-1"><Activity size={14} /> 課堂內繳交</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#f0ede6] border border-[#dddbd5] p-8 rounded-[10px] relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform"><HelpCircle size={100} /></div>
                        <div className="relative z-10 space-y-6">
                            <div className="flex items-center gap-3">
                                <span className="bg-[#1a1a2e] text-white text-[10px] font-bold px-3 py-1 rounded-full font-['DM_Mono',monospace]">TASK 02</span>
                                <h3 className="font-bold text-[18px] text-[#1a1a2e]">口頭會診</h3>
                            </div>
                            <ul className="space-y-3 text-[14px] text-[#4a4a6a] list-disc pl-5">
                                <li>鄰近兩組配對，進行交叉報告</li>
                                <li>報告時間：每組 5 分鐘診斷說明</li>
                                <li>攻防時間：1 分鐘挑戰或補充</li>
                                <li><strong>注意：</strong>挑戰者必須說出理由，不能只說「我覺得」</li>
                            </ul>
                            <div className="pt-4 flex items-center gap-4 text-[12px] text-[#8888aa]">
                                <span className="flex items-center gap-1 font-bold">🎯 目標：達成診斷共識</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* PART 4: 本週總結 (WRAP-UP) */}
            <section className="space-y-10">
                <div className="flex items-center gap-4">
                    <h2 className="font-['Noto_Serif_TC',serif] text-[20px] font-bold text-[#1a1a2e] whitespace-nowrap">本週總結</h2>
                    <div className="h-px bg-[#dddbd5] flex-1"></div>
                    <span className="text-[10px] font-['DM_Mono',monospace] text-[#8888aa] uppercase tracking-widest">Wrap-Up</span>
                </div>

                <div className="bg-white border border-[#dddbd5] rounded-[10px] overflow-hidden">
                    <div className="bg-[#f8f7f4] p-5 border-b border-[#dddbd5] font-bold flex items-center gap-2">
                        <CheckCircle2 className="text-[#2e7d5a]" size={18} /> 本週結束，你應該要學會：
                    </div>
                    <div className="grid md:grid-cols-2 gap-[1px] bg-[#dddbd5]">
                        {[
                            '用「分科三問」判斷研究問題該掛哪科',
                            '辨識問卷、訪談、實驗、觀察、文獻的適用情境',
                            '能指出「掛錯科」的理由所在',
                            '為自己的 W4 題目選出主要方法'
                        ].map((goal, idx) => (
                            <div key={idx} className="bg-white p-5 flex items-start gap-4">
                                <div className="text-[#2e7d5a] mt-1 shrink-0"><CheckCircle2 size={14} /></div>
                                <p className="text-[13px] text-[#4a4a6a]">{goal}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 本週作業 */}
                <div className="bg-white border-2 border-[#1a1a2e] rounded-[10px] overflow-hidden">
                    <div className="bg-[#1a1a2e] p-5 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-white font-bold">
                            <BookOpen size={18} /> 本週作業：學習單撰寫
                        </div>
                        <span className="text-[11px] font-['DM_Mono',monospace] text-white/60">DEADLINE: 下週一 23:59</span>
                    </div>
                    <div className="divide-y divide-[#dddbd5]">
                        {[
                            { part: 'PART 1', text: '分科三問：用自己的話說，不要抄速查卡', badge: null },
                            { part: 'PART 2', text: '幫你的 W4 題目初診掛號', badge: 'CRITICAL' },
                            { part: 'PART 3', text: 'AI 補漏記錄 (推薦執行)', badge: null },
                            { part: 'PART 4', text: '學習反思與下週規劃', badge: null },
                        ].map((hw, idx) => (
                            <div key={idx} className="p-4 px-6 flex items-center justify-between group hover:bg-[#f8f7f4] transition-colors">
                                <div className="flex items-center gap-4">
                                    <span className="text-[10px] font-['DM_Mono',monospace] font-black text-[#2d5be3] w-12">{hw.part}</span>
                                    <span className="text-[13px] text-[#1a1a2e]">{hw.text}</span>
                                </div>
                                {hw.badge && <span className="text-[9px] font-bold text-[#e32d5b] px-1.5 py-0.5 border border-[#e32d5b]/30 rounded-[2px]">{hw.badge}</span>}
                            </div>
                        ))}
                    </div>
                    <div className="p-5 bg-[#f8f7f4] border-t border-[#dddbd5] flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="text-[12px] text-[#8888aa]">學習單模板已放在 Google Classroom 請自行下載並於截止日前上傳。</p>
                        <a href="https://classroom.google.com/" target="_blank" rel="noopener noreferrer" className="bg-[#1a1a2e] text-white px-6 py-2 rounded-[4px] text-[12px] font-bold hover:bg-[#2d5be3] transition-colors flex items-center gap-2">
                            前往 Classroom <ArrowRight size={14} />
                        </a>
                    </div>
                </div>

                {/* 下週預告 */}
                <div className="bg-[#1a1a2e] rounded-[10px] p-10 text-white relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-500">
                        <Gamepad2 size={120} />
                    </div>
                    <div className="relative z-10">
                        <div className="text-[#2d5be3] text-[10px] font-['DM_Mono',monospace] tracking-widest mb-4 uppercase">Next Stop: W7 Prediction</div>
                        <h3 className="text-[24px] font-bold mb-8 font-['Noto_Serif_TC',serif]">下一站：文獻偵探社與組隊決策</h3>

                        <div className="grid md:grid-cols-2 gap-8 divide-x divide-white/10">
                            <div className="space-y-2">
                                <h4 className="font-bold text-[#f0ede6] text-[15px]">W7 上半節</h4>
                                <p className="text-white/60 text-[13px] leading-relaxed">文獻偵探社——學會判斷一篇論文可不可信，排除假資料。</p>
                            </div>
                            <div className="pl-8 space-y-2">
                                <h4 className="font-bold text-[#f0ede6] text-[15px]">W7 下半節</h4>
                                <p className="text-white/60 text-[13px] leading-relaxed">分科三問正式小考 + 正式組隊。記得帶 W4 定案題目來！</p>
                            </div>
                        </div>

                        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-8 border-t border-white/10 pt-8">
                            <Link to="/literature-review" className="text-[13px] font-bold text-white/40 hover:text-white flex items-center gap-2 transition-colors">
                                ← 回 W5 文獻探討
                            </Link>
                            <Link to="/team-formation" className="bg-white text-[#1a1a2e] px-10 py-3 rounded-[4px] text-[14px] font-bold hover:bg-[#2d5be3] hover:text-white transition-all flex items-center gap-2">
                                前往 W7 組隊決策 <ArrowRight size={18} />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};
