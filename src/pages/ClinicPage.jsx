import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './ClinicPage.css';
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
    { id: 'YQ1', wrong: '原掛：問卷科', goal: '理解睡前「焦慮想法」是如何形成的？（深層原因）', correct: '🎤 訪談科', reason: '焦慮想法的形成涉及複雜的心理機制，問卷選項只能調查「現象分布」，無法挖掘「為何如此」的深層原因，應用訪談深度探索。' },
    { id: 'YQ2', wrong: '原掛：問卷科', goal: '了解午休時，學生「實際使用手機」的真實行為。', correct: '👀 觀察科', reason: '涉及違反校規的行為，學生在問卷中極可能說謊（社會期許偏誤）。要得知「實際行為」，應在不干預的情況下直接觀察記錄。' },
    { id: 'YI1', wrong: '原掛：訪談科', goal: '估計全校 1500 人中，每天使用 AI 超過 30 分鐘的人數「比例」。', correct: '📋 問卷科', reason: '訪談樣本數極少，無法推論至母體。要知道「比例」與「全校趨勢」，應進行大量隨機抽樣問卷。' },
    { id: 'YI2', wrong: '原掛：訪談科', goal: '證實「圖像記憶法」是否真的能提升成績（因果關係）。', correct: '🧪 實驗科', reason: '訪談只能得到主觀感覺，無法排除干擾變項。要證明因果關係，必須透過對照組與測驗數據。' },
    { id: 'YE1', wrong: '原掛：實驗科', goal: '了解含糖飲料攝取與體重的「現況趨勢」（不想介入）。', correct: '📋 問卷科 或 📚 文獻科', reason: '研究目的明確說「不想介入」，但實驗科的核心就是人為介入。若要看現況相關性，應用問卷調查飲食習慣與體重。' },
    { id: 'YE2', wrong: '原掛：實驗科', goal: '了解學生在圖書館午休時「實際上」都在做什麼（自然行為）。', correct: '👀 觀察科', reason: '實驗科的人為設定環境會破壞「自然性」。要看學生自然反應，應在旁側錄或記錄，不干預。' },
    { id: 'YO1', wrong: '原掛：觀察科', goal: '了解學生為什麼會害怕上台報告（內心恐懼原因）。', correct: '🎤 訪談科', reason: '觀察科只能紀錄外顯行為（發抖、流汗），無法得知內心想法。表情僵硬可能是沒睡好，必須直接詢問內心感受。' },
    { id: 'YO2', wrong: '原掛：觀察科', goal: '了解學生使用 AI 寫作業的「動機」與「價值衝突」。', correct: '🎤 訪談科', reason: '作業成品是結果，無法顯現動機與內心衝突。觀察法無法透視腦內的抉擇過程，應與學生直接對話。' },
    { id: 'YL1', wrong: '原掛：文獻科', goal: '找出「本校高一學生」使用 AI 的實際頻率與用途（在地資料）。', correct: '📋 問卷科', reason: '文獻查到的是別人的研究結果，無法代表「本校現況」。要獲得在地化的第一手資料，應針對全校發放問卷。' },
    { id: 'YL2', wrong: '原掛：文獻科', goal: '判斷「番茄鐘學習法」對本班同學是否有效（驗證成效）。', correct: '🧪 實驗科', reason: '文獻只能知道理論上是否有用，無法得知「對本班」是否有用。要驗證成效，必須讓同學實際操作並記錄前後測成績。' },
    { id: 'YQ3', wrong: '原掛：問卷科', goal: '驗證考試與精神狀態的因果關係。', correct: '🧪 實驗科', reason: '因果關係需操弄自變項（考試 vs. 沒考試）來測量。問卷問的是意見，不代表生理上的真實反應。' },
    { id: 'YI3', wrong: '原掛：訪談科', goal: '了解「全台灣」高中生手搖飲花費（具代表性數據）。', correct: '📋 問卷科 或 📚 文獻科', reason: '3 個好友的訪談完全無法代表全台灣。要得知大規模平均數據，應進行抽樣問卷或查閱政府統計資料。' },
    { id: 'YE3', wrong: '原掛：實驗科', goal: '了解吉他社的「社團文化」與「互動氣氛」。', correct: '👀 觀察科', reason: '文化與氣氛是長期互動形成的。實驗科的人為操弄會瞬間摧毀真實的互動模式，應進行長期參與觀察。' },
    { id: 'YO3', wrong: '原掛：觀察科', goal: '了解學生「未來大學想讀什麼科系」的規劃。', correct: '📋 問卷科 或 🎤 訪談科', reason: '未來規劃屬於內心想法，無法從外表或行為觀察得知。應用問卷進行大規模志向調查，或用訪談深入了解決策過程。' },
    { id: 'YL3', wrong: '原掛：文獻科', goal: '了解「本班導師」的真實看法與評分標準。', correct: '🎤 訪談科', reason: '書本寫的是一般性理論，不代表特定對象的觀點。要了解特定導師的標準，直接約談老師最準確。' }
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
        <div className="page-container animate-in-fade-slide">
            {/* REMOVED: <style> - styles moved to index.css */}

            {/* TOP BAR / NAVIGATION PATH */}
            <div className="flex items-center justify-between border-b border-[#dddbd5] pb-4 mb-16">
                <div className="text-[11px] font-mono text-[#8888aa] flex items-center gap-2">
                    研究方法與專題 / 研究規劃 / <span className="text-[#1a1a2e] font-bold">研究診所 W6</span>
                </div>
                <div className="flex items-center gap-4">
                    <span className="bg-[#f0ede6] text-[#1a1a2e] text-[10px] font-bold px-2 py-0.5 rounded-[2px] font-mono">100 MINS</span>
                    <button
                        onClick={() => setShowLessonMap(!showLessonMap)}
                        className="text-[11px] text-[#8888aa] hover:text-[#2d5be3] transition-colors flex items-center gap-1 font-mono"
                    >
                        <Map size={12} /> {showLessonMap ? 'Hide Plan' : 'Instructor View'}
                    </button>
                    <span className="bg-[#1a1a2e] text-white text-[10px] font-bold px-2 py-0.5 rounded-[2px] font-mono">AI-RED · D</span>
                </div>
            </div>

            {showLessonMap && (
                <div className="animate-in slide-in-from-top-4 duration-300">
                    <LessonMap data={W6Data} />
                </div>
            )}

            {/* PAGE HEADER */}
            <header className="max-w-[800px] mb-16">
                <div className="text-[11px] font-mono text-[#2d5be3] mb-3 tracking-[0.06em]">🩺 W6 · 研究規劃</div>
                <h1 className="font-serif text-[36px] font-bold leading-[1.2] text-[#1a1a2e] mb-4 tracking-[-0.02em]">
                    研究診所：<span className="text-[#2d5be3] italic">分流建議與方法處方</span>
                </h1>
                <p className="text-[15px] text-[#4a4a6a] max-w-[600px] leading-[1.75] mb-8">
                    你的題目適合用什麼方法？問卷、訪談、還是實驗？今天進入診所分流，讓老師和 AI 幫你開出最適合的「方法處方」。
                </p>

                {/* Course Arc - Standard Version A */}
                <div className="mb-14">
                    <div className="text-[11px] text-[#8888aa] mb-4">課程弧線 · 你在哪裡</div>
                    <div className="arc-grid">
                        {[
                            { wk: 'W1-W2', name: '探索階段\nRED公約', status: 'past' },
                            { wk: 'W3-W4', name: '題目診斷\n博覽會', status: 'past' },
                            { wk: 'W5', name: '企劃撰寫\n研究藍圖', status: 'past' },
                            { wk: 'W6', name: '診所分流\n方法處方', status: 'now' },
                            { wk: 'W7', name: '組隊決策\n企劃定案' },
                            { wk: 'W8-W10', name: '工具設計\n倫理審查' },
                            { wk: 'W13-W16', name: '數據轉譯\n解讀發表' }
                        ].map((item, idx) => (
                            <div key={idx} className={`arc-item ${item.status === 'past' ? 'past' : item.status === 'now' ? 'now' : ''}`}>
                                <div className="arc-wk">
                                    {item.wk} {item.status === 'now' && '← 現在'}
                                </div>
                                <div className="arc-name">
                                    {item.name.split('\n').map((line, i) => <div key={i}>{line}</div>)}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* META CARDS */}
                <div className="meta-grid">
                    {[
                        { label: '第一節', value: '五科分流實戰 + 複合案例挑戰' },
                        { label: '第二節', value: '方法掛號診斷 + 救活研究原石' },
                        { label: '課課產出', value: 'W6 最終定案方法與路徑' },
                        { label: '帶去 W7', value: '確定題目與方法 + 組隊企劃' }
                    ].map((item, idx) => (
                        <div key={idx} className="meta-item">
                            <div className="meta-label">{item.label}</div>
                            <div className="meta-value">{item.value}</div>
                        </div>
                    ))}
                </div>

            </header>

            {/* PART 1: 學什麼 (CONCEPT) */}
            <section className="mb-16">
                <div className="w6-section-head">
                    <h2>學什麼</h2>
                    <div className="line"></div>
                    <span className="mono">CONCEPT</span>
                </div>
                <p className="clinic-section-desc">掌握「分科三問」篩選標準，學會判斷研究問題該「掛哪一科」，讓你的研究事半功倍。</p>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
                    {CATEGORIES.map((cat) => (
                        <div key={cat.id} className="w6-method-card group">
                            <div className="w6-method-icon group-hover:scale-110 transition-transform">{cat.icon}</div>
                            <h3 className="w6-method-name">{cat.name}</h3>
                            <p className="w6-method-desc">{cat.desc}</p>
                        </div>
                    ))}
                </div>

                <div className="w6-speed-card">
                    <div className="w6-speed-header">
                        <Activity size={18} /> 🏥 分科三問速查卡
                    </div>
                    <div className="w6-speed-body">
                        {TRIAGE_QUESTIONS.map((tq) => (
                            <div key={tq.id} className="w6-speed-q">
                                <div className="w6-speed-q-num">{tq.id}</div>
                                <div className="w6-speed-q-text">{tq.q}</div>
                                <div className="flex flex-col gap-1.5">
                                    {tq.results.map((res, i) => {
                                        const [label, method] = res.split(' → ');
                                        return (
                                            <div key={i} className="flex items-center gap-2 text-[12px] text-[#4a4a6a]">
                                                {label} → <span className="w6-method-tag whitespace-nowrap">{method}</span>
                                            </div>
                                        );
                                    })}
                                    {tq.id === '❹' && (
                                        <div className="text-[10px] text-[#8888aa] mt-1 pt-2 border-t border-[#f0ede6]">
                                            ⚠️ 錯誤類型速查卡在 W8 發放
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* PART 2: 練什麼 (PRACTICE) */}
            <section className="mb-16">
                <div className="w6-section-head">
                    <h2>練什麼</h2>
                    <div className="line"></div>
                    <span className="mono">PRACTICE</span>
                </div>
                <p className="clinic-section-desc">透過急診搶答與病例診斷，挑戰你的直覺反應，精準找出錯誤掛號的原因。</p>

                {/* 急診分流練習 */}
                <div className="w6-quiz-block mb-10 shadow-sm">
                    <div className="w6-quiz-header">
                        <div className="flex items-center gap-2 font-bold text-[#1a1a2e]">
                            <Activity className="text-[#2d5be3]" size={18} /> ⚡ 急診分流練習
                        </div>
                        <span className="text-[11px] text-[#8888aa] ml-auto">先自己判斷，再看答案</span>
                    </div>
                    {PRACTICE_ROUNDS.map((round, rIdx) => (
                        <div key={rIdx} className="border-b last:border-b-0 border-[#dddbd5]">
                            <div className="px-6 py-2.5 bg-[#f0ede6]/50 text-[10px] font-['DM_Mono',monospace] font-bold text-[#2d5be3] uppercase tracking-widest">
                                {round.title}
                            </div>
                            <div className="divide-y divide-[#dddbd5]">
                                {round.cases.map((c, cIdx) => (
                                    <div key={cIdx} className="w6-quiz-item group hover:bg-[#f8f7f4] transition-colors">
                                        <p className="text-[13px] text-[#1a1a2e]">「{c.q}」</p>
                                        <div className="flex items-center gap-3 shrink-0">
                                            {revealedCases[`${rIdx}-${cIdx}`] && (
                                                <div className="text-[12px] font-bold font-mono text-[#2d5be3] bg-[#e8eeff] px-2 py-0.5 rounded-[4px] border border-[#2d5be3]/20 animate-in zoom-in-95">
                                                    {c.a}
                                                </div>
                                            )}
                                            <button
                                                onClick={() => toggleCase(`${rIdx}-${cIdx}`)}
                                                className={`px-3 py-1 rounded-[4px] text-[10px] font-bold transition-all ${revealedCases[`${rIdx}-${cIdx}`] ? 'bg-[#1a1a2e] text-white' : 'border border-[#1a1a2e] text-[#1a1a2e] hover:bg-[#1a1a2e] hover:text-white'}`}
                                            >
                                                {revealedCases[`${rIdx}-${cIdx}`] ? 'RESET' : 'SHOW ANSWER'}
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
                    <div className="w6-notice mb-6">
                        🩺 以下是 15 份 Y 型病例（掛錯科的真實案例）。先看研究目的，自己判斷應該掛哪科，再點開答案。
                    </div>

                    <div className="text-[10px] font-mono text-[#8888aa] uppercase tracking-[0.1em] mb-4">病例資料庫 · 原版病例系列</div>
                    <div className="grid md:grid-cols-2 gap-4">
                        {Y_CASES.slice(0, 10).map((y) => (
                            <div key={y.id} className="w6-case-card flex flex-col group">
                                <div className="w6-case-top">
                                    <span className="text-[10px] font-mono font-bold text-[#8888aa] tracking-widest">{y.id}</span>
                                    <span className="ml-auto text-[9px] font-bold text-[#e32d5b] px-2 py-0.5 bg-[#fdf2f2] rounded-[3px] border border-[#e32d5b]/20 lowercase font-mono">{y.wrong}</span>
                                </div>
                                <div className="p-5 flex-1 space-y-4">
                                    <div>
                                        <div className="text-[10px] font-bold text-[#8888aa] uppercase tracking-wider mb-1">Research Purpose</div>
                                        <p className="text-[13px] font-bold text-[#1a1a2e] leading-snug">{y.goal}</p>
                                    </div>

                                    <div className="relative">
                                        <button
                                            onClick={() => toggleYCase(y.id)}
                                            className="w-full py-2 bg-[#f0ede6] text-[#2d5be3] text-[11px] font-mono font-bold rounded-[5px] border border-[#2d5be3]/10 hover:bg-[#2d5be3] hover:text-white transition-all flex items-center justify-center gap-2"
                                        >
                                            {revealedYCases[y.id] ? '▲ 收起診斷' : '▼ 看診斷結果'}
                                        </button>

                                        {revealedYCases[y.id] && (
                                            <div className="mt-3 bg-white border border-[#dddbd5] rounded-[6px] overflow-hidden animate-in slide-in-from-top-2 duration-200">
                                                <div className="bg-[#e8f5ee] px-3 py-2 border-b border-[#2e7d5a]/20 flex items-center gap-2">
                                                    <span className="text-[10px] font-black text-[#2e7d5a] uppercase">Correct:</span>
                                                    <span className="font-bold text-[12px] text-[#1a1a2e]">{y.correct}</span>
                                                </div>
                                                <div className="p-3 text-[12px] text-[#4a4a6a] leading-relaxed italic">
                                                    {y.reason}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="text-[10px] font-mono text-[#8888aa] uppercase tracking-[0.1em] mt-12 mb-4">病例資料庫 · 進階病例系列</div>
                    <div className="grid md:grid-cols-2 gap-4">
                        {Y_CASES.slice(10).map((y) => (
                            <div key={y.id} className="w6-case-card flex flex-col group">
                                <div className="w6-case-top">
                                    <span className="text-[10px] font-mono font-bold text-[#8888aa] tracking-widest">{y.id}</span>
                                    <span className="ml-auto text-[9px] font-bold text-[#e32d5b] px-2 py-0.5 bg-[#fdf2f2] rounded-[3px] border border-[#e32d5b]/20 lowercase font-mono">{y.wrong}</span>
                                </div>
                                <div className="p-5 flex-1 space-y-4">
                                    <div>
                                        <div className="text-[10px] font-bold text-[#8888aa] uppercase tracking-wider mb-1">Research Purpose</div>
                                        <p className="text-[13px] font-bold text-[#1a1a2e] leading-snug">{y.goal}</p>
                                    </div>

                                    <div className="relative">
                                        <button
                                            onClick={() => toggleYCase(y.id)}
                                            className="w-full py-2 bg-[#f0ede6] text-[#2d5be3] text-[11px] font-mono font-bold rounded-[5px] border border-[#2d5be3]/10 hover:bg-[#2d5be3] hover:text-white transition-all flex items-center justify-center gap-2"
                                        >
                                            {revealedYCases[y.id] ? '▲ 收起診斷' : '▼ 看診斷結果'}
                                        </button>

                                        {revealedYCases[y.id] && (
                                            <div className="mt-3 bg-white border border-[#dddbd5] rounded-[6px] overflow-hidden animate-in slide-in-from-top-2 duration-200">
                                                <div className="bg-[#e8f5ee] px-3 py-2 border-b border-[#2e7d5a]/20 flex items-center gap-2">
                                                    <span className="text-[10px] font-black text-[#2e7d5a] uppercase">Correct:</span>
                                                    <span className="font-bold text-[12px] text-[#1a1a2e]">{y.correct}</span>
                                                </div>
                                                <div className="p-3 text-[12px] text-[#4a4a6a] leading-relaxed italic">
                                                    {y.reason}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Lock Indicator */}
                    {!isUnlocked && (
                        <div className="mt-8 flex flex-col items-center gap-4 py-8 border-2 border-dashed border-[#dddbd5] rounded-[10px] opacity-60">
                            <Lock size={32} className="text-[#8888aa]" />
                            <div className="text-center">
                                <p className="text-[12px] font-bold text-[#1a1a2e]">診斷書已加密封存</p>
                                <p className="text-[11px] text-[#8888aa]">請小組討論完成後，由主治醫師 (老師) 統一解鎖</p>
                            </div>
                            <button onClick={handleLockClick} className="px-6 py-2 bg-[#1a1a2e] text-white text-[11px] font-bold rounded-full hover:bg-[#2d5be3] transition-colors">
                                {lockClickCount > 0 ? `解鎖中 (${lockClickCount}/3)...` : '醫師權限核可'}
                            </button>
                        </div>
                    )}
                </div>
            </section>

            {/* PART 3: 課堂任務 (IN-CLASS) */}
            <section className="mb-16">
                <div className="w6-section-head">
                    <h2>課堂任務</h2>
                    <div className="line"></div>
                    <span className="mono">IN-CLASS</span>
                </div>
                <p className="clinic-section-desc">進入「研究診所」會診現場，與組員共同診斷 3 份 Y 型病例，並與同儕交換意見。</p>

                <div className="grid md:grid-cols-2 gap-8 mb-8">
                    <div className="w6-task-block group">
                        <div className="w6-task-header">
                            <span className="w6-task-badge">TASK 1</span>
                            <span className="w6-task-title">小組 Y 型病例診斷</span>
                        </div>
                        <div className="w6-task-body">
                            每組領取三份 Y 型病例紙本，完成診斷後拍照上傳 Google Classroom。<br /><br />
                            <ol className="list-decimal pl-5 space-y-1">
                                <li>判斷這份病例掛對科了嗎？</li>
                                <li>應該掛哪科？</li>
                                <li>用分科三問說一句理由</li>
                                <li>寫在診斷區，全組簽名</li>
                            </ol>
                        </div>
                    </div>

                    <div className="w6-task-block group bg-[#f0ede6]/30">
                        <div className="w6-task-header">
                            <span className="w6-task-badge bg-[#1a1a2e]">TASK 2</span>
                            <span className="w6-task-title">口頭會診</span>
                        </div>
                        <div className="w6-task-body">
                            鄰近兩組互相配對，交叉報告你們的診斷結果。<br /><br />
                            <ol className="list-decimal pl-5 space-y-1">
                                <li>A 組報告三份病例診斷結果（5 分鐘）</li>
                                <li>B 組挑戰或補充（1 分鐘）</li>
                                <li>換邊，B 組報告（5 分鐘）</li>
                                <li>A 組挑戰或補充（1 分鐘）</li>
                            </ol>
                            <br />
                            挑戰的人要說出理由，不是只說「我覺得不對」。
                        </div>
                    </div>
                </div>

                <div className="w6-notice w6-notice-gold">
                    📤 檔名格式：<strong>組別_病例編號</strong>，例：第一組_YQ1 &nbsp;·&nbsp; 截止：今天課堂內
                </div>
            </section>

            {/* PART 4: 本週總結 (WRAP-UP) */}
            <section className="pb-24">
                <div className="w6-section-head">
                    <h2>本週總結</h2>
                    <div className="line"></div>
                    <div className="mono uppercase">Wrap-Up</div>
                </div>

                {/* 學會什麼 */}
                <div className="bg-white border border-[#dddbd5] rounded-[10px] overflow-hidden mb-4">
                    <div className="p-4 px-5 bg-[#f0ede6] border-b border-[#dddbd5] font-bold text-[13px]">
                        ✅ 本週結束，你應該要會
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-[1px] bg-[#dddbd5]">
                        {[
                            { text: <>用<strong>分科三問</strong>判斷一個研究問題該掛哪科</> },
                            { text: <>辨識<strong>問卷、訪談、實驗、觀察、文獻</strong>各自的適用情境</> },
                            { text: <>看到「掛錯科」的病例，能<strong>說出理由</strong>指出問題所在</> },
                            { text: <>為你自己的 W4 題目選出<strong>主要方法</strong>並說明理由</> }
                        ].map((goal, idx) => (
                            <div key={idx} className="p-4 px-6 bg-white flex items-start gap-3">
                                <span className="text-[#2e7d5a] mt-0.5">✓</span>
                                <span className="text-[13px] text-[#4a4a6a]">{goal.text}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 本週作業 */}
                <div className="bg-white border border-[#dddbd5] rounded-[10px] overflow-hidden mb-12">
                    <div className="p-4 px-5 bg-[#f0ede6] border-b border-[#dddbd5] flex items-center gap-3">
                        <span className="text-[10px] font-mono bg-[#1a1a2e] text-white px-2 py-0.5 rounded-[3px]">HOMEWORK</span>
                        <span className="font-bold text-[13px]">本週作業</span>
                    </div>
                    <div className="divide-y divide-[#dddbd5]">
                        {[
                            { part: 'Part 1', text: '分科三問——用你自己的話說，不要抄速查卡' },
                            { part: 'Part 2', text: '幫你的 W4 題目掛號', badge: '最重要' },
                            { part: 'Part 3', text: 'AI 補漏記錄（選做但推薦）', light: true },
                            { part: 'Part 4', text: '整體反思', light: true },
                        ].map((hw, idx) => (
                            <div key={idx} className="p-4 px-6 flex items-center justify-between text-[13px]">
                                <div className="flex items-center gap-6">
                                    <span className={`font-bold font-mono w-12 shrink-0 ${hw.light ? 'text-[#8888aa]' : 'text-[#2d5be3]'}`}>{hw.part}</span>
                                    <span className={hw.light ? 'text-[#8888aa]' : 'text-[#4a4a6a]'}>{hw.text}</span>
                                </div>
                                {hw.badge && <span className="bg-[#fdecea] text-[#c0392b] text-[10px] px-2 py-0.5 rounded border border-[#c0392b]/20 font-bold">{hw.badge}</span>}
                            </div>
                        ))}
                    </div>
                    <div className="p-4 px-6 bg-[#f8f7f4] border-t border-[#dddbd5] flex items-center justify-between">
                        <span className="text-[12px] text-[#8888aa]">學習單在 Google Classroom 下載</span>
                        <a href="https://classroom.google.com/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-[12px] font-mono font-bold text-[#2d5be3]">
                            → Google Classroom
                        </a>
                    </div>
                </div>

                {/* 導航與預告 */}
                <section className="space-y-8">
                    <div className="w6-next-week-preview">
                        <div className="w6-next-week-header">
                            <span className="w6-next-week-badge">NEXT WEEK</span>
                            <h3 className="w6-next-week-title">W7 預告</h3>
                        </div>
                        <div className="w6-next-week-content">
                            <div className="w6-next-week-col">
                                <div className="w6-next-week-label">W7 上半節</div>
                                <p className="w6-next-week-text">文獻偵探社——學會判斷一篇論文可不可信，排除假資料。</p>
                            </div>
                            <div className="w6-next-week-col">
                                <div className="w6-next-week-label">W7 下半節</div>
                                <p className="w6-next-week-text"><strong className="text-white">分科三問小考</strong> + 正式組隊。記得帶 W4 定案題目來！</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-between items-center py-12 border-t border-[#dddbd5]">
                        <Link to="/w5" className="text-[13px] font-bold text-[#8888aa] hover:text-[#1a1a2e] flex items-center gap-2 transition-colors">
                            ← 回 W5 文獻偵探社
                        </Link>
                        <Link to="/team-formation" className="bg-[#1a1a2e] text-white px-8 py-3 rounded-[6px] text-[13px] font-bold hover:bg-[#4a4a6a] transition-all flex items-center gap-2 group">
                            前往 W7 組隊決策 <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </section>
            </section>
        </div>
    );
};
