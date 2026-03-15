import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    BarChart2,
    TrendingUp,
    PieChart,
    ScatterChart,
    Info,
    CheckCircle2,
    ChevronDown,
    ArrowLeft,
    ArrowRight,
    Lightbulb,
    AlertTriangle,
    FileText,
    MousePointer2,
    Map
} from 'lucide-react';
import LessonMap from '../components/ui/LessonMap';
import { W13Data } from '../data/lessonMaps';

const ChartCard = ({ icon: Icon, type, name, trigger, keywords }) => (
    <div className="bg-white p-4 border-r border-[#dddbd5] last:border-r-0">
        <div className="text-2xl mb-2.5">
            <Icon size={28} className="text-[#1a1a2e]" />
        </div>
        <div className="font-mono text-[10px] font-bold text-[#8888aa] tracking-[0.1em] uppercase mb-1">
            {type}
        </div>
        <div className="text-[14px] font-bold text-[#1a1a2e] mb-2">
            {name}
        </div>
        <div className="text-[12px] text-[#4a4a6a] font-normal leading-[1.7]">
            {trigger}
        </div>
        <div className="flex flex-wrap gap-1.5 mt-2">
            {keywords.map((kw, idx) => (
                <span key={idx} className="inline-block text-[10px] font-['DM_Mono',monospace] bg-[#f0ede6] border border-[#dddbd5] px-1.5 py-0.5 rounded-[3px] text-[#4a4a6a]">
                    {kw}
                </span>
            ))}
        </div>
    </div>
);

const DecisionRow = ({ index, question, answer, bg, color }) => (
    <div className="bg-white p-[12px_20px] flex items-center gap-4 border-t first:border-t-0 border-[#dddbd5]">
        <span className="font-['DM_Mono',monospace] text-[13px] text-[#8888aa] w-5 shrink-0">{index}</span>
        <span className="text-[13px] text-[#1a1a2e] flex-1">{question}</span>
        <span className="text-[#8888aa] text-[12px]">→</span>
        <span className={`font-['DM_Mono',monospace] text-[12px] font-bold px-2.5 py-1 rounded-[4px] whitespace-nowrap ${bg} ${color}`}>
            {answer}
        </span>
    </div>
);

const FormatItem = ({ label, value, example, isDark }) => (
    <div className="grid grid-cols-[140px_1fr] border-t first:border-t-0 border-[#dddbd5]">
        <div className={`${isDark ? 'bg-[#1a1a2e] text-white' : 'bg-[#f0ede6] text-[#4a4a6a]'} p-[14px_16px] flex items-center font-bold text-[11px]`}>
            {label}
        </div>
        <div className="bg-white p-[14px_18px] text-[12px] text-[#4a4a6a] font-normal leading-[1.8]">
            <div dangerouslySetInnerHTML={{ __html: value }} />
            {example && (
                <div className="font-['DM_Mono',monospace] text-[11px] bg-[#f0ede6] border border-[#dddbd5] px-2.5 py-1 rounded-[4px] inline-block mt-1">
                    {example}
                </div>
            )}
        </div>
    </div>
);

const PracticeBlock = ({ badge, title, children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [unlockCount, setUnlockCount] = useState(0);
    const [isUnlocked, setIsUnlocked] = useState(false);

    const handleUnlock = (e) => {
        e.stopPropagation();
        const nextCount = unlockCount + 1;
        setUnlockCount(nextCount);
        if (nextCount >= 3) {
            setIsUnlocked(true);
        }
    };

    return (
        <div className={`border border-[#dddbd5] rounded-[10px] overflow-hidden mb-3 ${isOpen ? 'bg-white' : ''}`}>
            <div
                className="p-[14px_20px] bg-[#f0ede6] border-b border-[#dddbd5] flex items-center gap-2.5 cursor-pointer select-none"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="font-['DM_Mono',monospace] text-[10px] bg-[#1a1a2e] text-white px-2 py-0.5 rounded-[3px] shrink-0">
                    {badge}
                </span>
                <span className="text-[14px] font-bold text-[#1a1a2e] flex-1">
                    {title}
                </span>
                <ChevronDown size={16} className={`text-[#8888aa] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </div>
            {isOpen && (
                <div className="p-5 md:p-6 bg-white">
                    {!isUnlocked ? (
                        <>
                            <div className="mb-3 text-[13px] text-[#4a4a6a]">先填答案，再點解鎖。</div>
                            <div
                                className="bg-[#f0ede6] border border-dashed border-[#c8c5bc] rounded-lg p-3.5 text-center text-[13px] text-[#8888aa] cursor-pointer hover:bg-[#dddbd5] hover:text-[#4a4a6a] transition-colors"
                                onClick={handleUnlock}
                            >
                                <MousePointer2 size={16} className="inline mr-1" />
                                {unlockCount > 0 ? `👆 點三下看答案（還需再點 ${3 - unlockCount} 下）` : '👆 點三下看答案'}
                            </div>
                        </>
                    ) : (
                        <div className="animate-in fade-in duration-300">
                            {children}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

const TaskBlock = ({ badge, title, children }) => (
    <div className="border border-[#dddbd5] rounded-[10px] overflow-hidden bg-white mb-3">
        <div className="p-[12px_20px] bg-[#f0ede6] border-b border-[#dddbd5] flex items-center gap-2.5">
            <span className="font-['DM_Mono',monospace] text-[10px] bg-[#1a1a2e] text-white px-2 py-0.5 rounded-[3px]">
                {badge}
            </span>
            <span className="text-[14px] font-bold text-[#1a1a2e]">
                {title}
            </span>
        </div>
        <div className="p-5 md:p-6">
            {children}
        </div>
    </div>
);

export const W13Page = () => {
    const [showInstructorView, setShowInstructorView] = useState(false);

    return (
        <div className="page-container animate-in-fade-slide">
            {/* REMOVED: <style dangerouslySetInnerHTML /> - styles moved to index.css */}
            {/* TOP BAR / NAVIGATION PATH */}
            <div className="flex items-center justify-between border-b border-[#dddbd5] pb-4 mb-16">
                <div className="text-[11px] font-mono text-[#8888aa] flex items-center gap-2">
                    研究方法與專題 / 分析與撰寫 / <span className="text-[#1a1a2e] font-bold">讓數據自己說話 W13</span>
                </div>
                <div className="flex items-center gap-4">
                    <span className="bg-[#f0ede6] text-[#1a1a2e] text-[10px] font-bold px-2 py-0.5 rounded-[2px] font-mono">100 MINS</span>
                    <button
                        onClick={() => setShowInstructorView(!showInstructorView)}
                        className="text-[11px] text-[#8888aa] hover:text-[#2d5be3] transition-colors flex items-center gap-1 font-mono"
                    >
                        <Map size={12} /> {showInstructorView ? 'Hide Plan' : 'Instructor View'}
                    </button>
                    <span className="bg-[#1a1a2e] text-white text-[10px] font-bold px-2 py-0.5 rounded-[2px] font-mono">AI-RED · D</span>
                </div>
            </div>

            {showInstructorView && (
                <div className="mb-12 animate-in fade-in slide-in-from-top-4 duration-300">
                    <LessonMap data={W13Data} />
                </div>
            )}

            {/* PAGE HEADER */}
            <div className="max-w-[800px] mb-16">
                <div className="text-[#2d5be3] font-mono text-[11px] font-bold tracking-widest uppercase mb-4">📊 W13 · 分析與撰寫</div>
                <h1 className="font-serif text-[42px] font-bold leading-[1.2] text-[#1a1a2e] mb-6 tracking-[-0.01em]">
                    讓數據自己說話：<span className="text-[#2d5be3]">圖表選擇與圖說寫作</span>
                </h1>
                <p className="text-[16px] text-[#4a4a6a] leading-relaxed">
                    數據是食材，圖表是盤子。今天要學兩件事：選對盤子（圖表類型），以及幫圖表寫一段說明——哪裡是客觀描述、哪裡是主觀推論。
                </p>
            </div>

            {/* META STRIP */}
            <div className="meta-strip">
                {W13Data.metaCards.map((item, idx) => (
                    <div key={idx} className="meta-item">
                        <div className="meta-label">{item.label}</div>
                        <div className="meta-value">{item.value}</div>
                    </div>
                ))}
            </div>

            {/* COURSE ARC */}
            <div className="text-[11px] text-[#8888aa] mb-4 font-mono uppercase tracking-wider">課程弧線 · 你在哪裡</div>
            <div className="arc-grid">
                {W13Data.courseArc.map((item, idx) => (
                    <div key={idx} className={`arc-item ${item.past ? 'past' : item.now ? 'now' : ''}`}>
                        <div className="arc-wk">{item.wk} {item.now && '← 現在'}</div>
                        <div className="arc-name">{item.name.split('\n').map((line, i) => <div key={i}>{line}</div>)}</div>
                    </div>
                ))}
            </div>

            {/* Concept Section */}
            <div className="flex items-center gap-3 mb-6 mt-12 text-[#1a1a2e]">
                <h2 className="font-['Noto_Serif_TC',serif] text-[18px] font-bold whitespace-nowrap">學什麼</h2>
                <div className="h-[1px] flex-1 bg-[#dddbd5]"></div>
                <span className="font-['DM_Mono',monospace] text-[10px] text-[#8888aa] tracking-[0.08em]">CONCEPT</span>
            </div>

            {/* Four Main Charts */}
            <div className="text-[10px] font-['DM_Mono',monospace] text-[#8888aa] tracking-[0.1em] uppercase mb-2.5">
                觀念一 · 四大圖表速查
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 border border-[#dddbd5] rounded-[10px] overflow-hidden mb-3">
                <ChartCard
                    icon={TrendingUp} type="LINE" name="折線圖"
                    trigger="追蹤隨時間改變的趨勢。適合「每天、每週、每月」這類時間序列。"
                    keywords={["時間流動", "趨勢", "波動"]}
                />
                <ChartCard
                    icon={PieChart} type="PIE" name="圓餅圖"
                    trigger="呈現部分佔整體的比例。鐵則：所有選項加總必須剛好是 100%。"
                    keywords={["佔比", "結構", "單選題"]}
                />
                <ChartCard
                    icon={BarChart2} type="BAR" name="長條圖"
                    trigger="比較不同類別的大小或排名。複選題只能用這個，因為加總超過 100%。"
                    keywords={["比大小", "排名", "複選題"]}
                />
                <ChartCard
                    icon={ScatterChart} type="SCATTER" name="散佈圖"
                    trigger="找出兩個數值變數之間有沒有相關性。每個點代表一個觀察值。"
                    keywords={["相關性", "兩個變數", "分佈"]}
                />
            </div>

            <div className="text-[10px] font-['DM_Mono',monospace] text-[#8888aa] tracking-[0.1em] uppercase mb-2.5 mt-8">
                決策口訣 · 做圖表前先問自己四個問題
            </div>
            <div className="border border-[#dddbd5] rounded-[10px] overflow-hidden mb-3">
                <DecisionRow
                    index="❶" question="有時間在流動嗎？（每天、每月、趨勢）"
                    answer="📈 折線圖" bg="bg-[#e8eeff]" color="text-[#2d5be3]"
                />
                <DecisionRow
                    index="❷" question="在看部分佔整體的比例嗎？（且加總 = 100%）"
                    answer="🥧 圓餅圖" bg="bg-[#fdf6e3]" color="text-[#7a6020]"
                />
                <DecisionRow
                    index="❸" question="在找兩個數值變數之間的關係嗎？"
                    answer="🔵 散佈圖" bg="bg-[#e8f5ee]" color="text-[#2e7d5a]"
                />
                <DecisionRow
                    index="❹" question="都不是？在比大小、排名或是複選題嗎？"
                    answer="📊 長條圖" bg="bg-[#fdecea]" color="text-[#c0392b]"
                />
            </div>
            <div className="p-[11px_16px] bg-[#fdf6e3] text-[#7a6020] border-l-4 border-[#c9a84c] rounded-r-[6px] text-[12px] leading-[1.75] mb-12 flex items-start gap-2">
                <Lightbulb size={16} className="shrink-0 mt-0.5" />
                <div>💡 記不住的話，從 ❹ 往上問。大多數情況答案都是長條圖——因為長條圖最通用，有疑問就選它，再想想有沒有更精準的選擇。</div>
            </div>

            <div className="text-[10px] font-['DM_Mono',monospace] text-[#8888aa] tracking-[0.1em] uppercase mb-2.5 mt-8">
                觀念二 · 圖表格式三鐵則 + 一個防呆
            </div>
            <div className="border border-[#dddbd5] rounded-[10px] overflow-hidden mb-3">
                <FormatItem
                    label="📌 標題位置"
                    value="永遠放在圖表<strong>上方</strong>。格式：圖一：研究題目（N=有效樣本數）"
                    example="圖一：高二學生每日手機使用時數分布 (N=120)"
                />
                <FormatItem
                    label="📌 資料來源"
                    value="永遠放在圖表<strong>下方</strong>。自己做的圖：研究者繪製；引用別人的：作者（年份）"
                    example="資料來源：研究者繪製"
                />
                <FormatItem
                    label="📌 正文引用"
                    value="寫「<strong>如圖一所示</strong>」，<span class='text-[#c0392b]'>絕對不能寫「如上圖」或「如下圖」</span>——排版改動後上下會跑掉。"
                />
                <FormatItem
                    label="🛡️ N 值防呆"
                    value="「80% 的人有壓力」——這是 100 人的 80% 還是只有 5 個人的 80%？在圖表標題旁標上 <strong>(N=有效樣本數)</strong>。"
                    isDark={true}
                />
            </div>
            <div className="p-[11px_16px] bg-[#fdecea] text-[#c0392b] border-l-4 border-[#c0392b] rounded-r-[6px] text-[12px] leading-[1.75] mb-12 flex items-start gap-2">
                <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                <div>⚠️ 圖放進報告後，一定要在正文裡寫「如圖一所示」來引用它——不能只貼圖、不說明。貼圖不引用，讀者不知道圖跟你要說的話有什麼關係。</div>
            </div>

            <div className="text-[10px] font-['DM_Mono',monospace] text-[#8888aa] tracking-[0.1em] uppercase mb-2.5 mt-8">
                觀念三 · 一張圖的說明公式
            </div>
            <div className="grid grid-cols-1 md:grid-cols-[1fr_48px_1fr] border border-[#dddbd5] rounded-[10px] overflow-hidden mb-12 bg-[#dddbd5]">
                <div className="bg-white p-[20px_22px]">
                    <span className="font-['DM_Mono',monospace] text-[10px] font-bold bg-[#e8eeff] text-[#2d5be3] px-2 py-0.5 rounded-[3px] mb-2 inline-block">描述 Description</span>
                    <div className="text-[14px] font-bold text-[#1a1a2e] mb-2">客觀事實：你看到了什麼？</div>
                    <div className="text-[12px] text-[#4a4a6a] leading-[1.8] mb-2.5">報數字、報最高值、最低值、最明顯的那個趨勢。不加任何解釋。</div>
                    <div className="text-[12px] text-[#4a4a6a] leading-[1.8] pt-2.5 border-t border-[#dddbd5] italic">根據圖一，高達 80% 的學生在睡前滑手機超過一小時，僅 5% 表示不使用手機。</div>
                </div>
                <div className="bg-[#f0ede6] flex items-center justify-center text-[24px] text-[#8888aa] font-thin">+</div>
                <div className="bg-white p-[20px_22px]">
                    <span className="font-['DM_Mono',monospace] text-[10px] font-bold bg-[#e8f5ee] text-[#2e7d5a] px-2 py-0.5 rounded-[3px] mb-2 inline-block">推論 Inference</span>
                    <div className="text-[14px] font-bold text-[#1a1a2e] mb-2">主觀見解：這代表什麼？</div>
                    <div className="text-[12px] text-[#4a4a6a] leading-[1.8] mb-2.5">解釋意義、推測原因、連結研究問題。永遠說「<strong>可能</strong>」，不說「一定」。</div>
                    <div className="text-[12px] text-[#4a4a6a] leading-[1.8] pt-2.5 border-t border-[#dddbd5] italic">這可能反映出學生放學後缺乏其他休閒管道，或者手機已成為主要的放鬆方式。</div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 border border-[#dddbd5] rounded-[10px] overflow-hidden mb-12">
                <div className="p-4 bg-white border-r border-[#dddbd5]">
                    <div className="text-[11px] font-bold text-[#c0392b] mb-1.5">❌ 錯誤一：只報數字不推論</div>
                    <div className="text-[12px] text-[#4a4a6a] leading-[1.7]">像機器人唸數字，沒有分析價值。讀者自己會看圖，你要告訴他們這代表什麼。</div>
                    <div className="text-[11px] text-[#8888aa] mt-1.5 italic">「圖一顯示 80% 的學生使用手機。」——然後呢？</div>
                </div>
                <div className="p-4 bg-white border-r border-[#dddbd5]">
                    <div className="text-[11px] font-bold text-[#c0392b] mb-1.5">❌ 錯誤二：沒有數據就硬推論</div>
                    <div className="text-[12px] text-[#4a4a6a] leading-[1.7]">推論必須有數據支撐。從「喜歡喝手搖飲」跳到「不愛念書」——中間缺了邏輯。</div>
                    <div className="text-[11px] text-[#8888aa] mt-1.5 italic">「由此可見學生完全不在乎健康。」——數據在哪？</div>
                </div>
                <div className="p-4 bg-white">
                    <div className="text-[11px] font-bold text-[#c0392b] mb-1.5">❌ 錯誤三：量詞不精準</div>
                    <div className="text-[12px] text-[#4a4a6a] leading-[1.7]">「絕大多數」、「大部分」——到底是幾成？描述時要說清楚比例或數字。</div>
                    <div className="text-[11px] text-[#8888aa] mt-1.5 italic">「絕大多數人有壓力」≠ 「73.5% 的受訪者表示有壓力」</div>
                </div>
            </div>

            <div className="p-[11px_16px] bg-[#e8eeff] text-[#2d5be3] border-l-4 border-[#2d5be3] rounded-r-[6px] text-[12px] leading-[1.75] mb-12 flex items-start gap-2">
                <Info size={16} className="shrink-0 mt-0.5" />
                <div>🔑 一段好的圖說 = 描述句（引用數字，根據圖一）+ 推論句（說可能的原因或意義）。兩句都不能省。</div>
            </div>

            {/* Practice Section */}
            <div className="flex items-center gap-3 mb-6 mt-16 text-[#1a1a2e]">
                <h2 className="font-['Noto_Serif_TC',serif] text-[18px] font-bold whitespace-nowrap">練什麼</h2>
                <div className="h-[1px] flex-1 bg-[#dddbd5]"></div>
                <span className="font-['DM_Mono',monospace] text-[10px] text-[#8888aa] tracking-[0.08em]">PRACTICE</span>
            </div>

            <div className="text-[10px] font-['DM_Mono',monospace] text-[#8888aa] tracking-[0.1em] uppercase mb-2.5">
                演練 1 · 圖表決策直覺訓練
            </div>
            <p className="text-[13px] text-[#4a4a6a] mb-4">（A）圓餅圖　（B）長條圖　（C）折線圖　（D）散佈圖 — 填入代號，完成測試。</p>

            <PracticeBlock id="p1" badge="題 1" title="全班同學「數學成績」與「物理成績」是否有關聯">
                <div className="bg-[#e8f5ee] border-l-4 border-[#2e7d5a] p-4 rounded-r-[6px] text-[13px] text-[#4a4a6a]">
                    <strong className="text-[#2e7d5a]">D 散佈圖</strong><br /><br />
                    兩個數值變數（數學分數、物理分數）之間有沒有關聯——這正是散佈圖的用途。每個點代表一個學生，橫軸是數學，縱軸是物理。
                </div>
            </PracticeBlock>

            <PracticeBlock id="p2" badge="題 2" title="福利社過去三個月「珍珠奶茶」銷量的每日變化情形">
                <div className="bg-[#e8f5ee] border-l-4 border-[#2e7d5a] p-4 rounded-r-[6px] text-[13px] text-[#4a4a6a]">
                    <strong className="text-[#2e7d5a]">C 折線圖</strong><br /><br />
                    「每日變化」有時間軸在流動，所以是折線圖。能清楚看出趨勢——是週末賣得多、還是考試週賣得少？
                </div>
            </PracticeBlock>

            <PracticeBlock id="p3" badge="題 3" title="比較全校各班級的「整潔競賽」總分排名">
                <div className="bg-[#e8f5ee] border-l-4 border-[#2e7d5a] p-4 rounded-r-[6px] text-[13px] text-[#4a4a6a]">
                    <strong className="text-[#2e7d5a]">B 長條圖</strong><br /><br />
                    「比大小、排名」是長條圖的典型用途。每個班是一條長條，長短直接反映分數高低。
                </div>
            </PracticeBlock>

            <PracticeBlock id="p4" badge="題 4" title="分析自己一天 24 小時的時間分配比例">
                <div className="bg-[#e8f5ee] border-l-4 border-[#2e7d5a] p-4 rounded-r-[6px] text-[13px] text-[#4a4a6a]">
                    <strong className="text-[#2e7d5a]">A 圓餅圖</strong><br /><br />
                    24 小時加總剛好是 100%，符合圓餅圖的唯一條件。加起來就是整體的 100%。
                </div>
            </PracticeBlock>

            <div className="text-[10px] font-['DM_Mono',monospace] text-[#8888aa] tracking-[0.1em] uppercase mb-2.5 mt-8">
                演練 2 · 圖表除錯
            </div>
            <PracticeBlock id="p5" badge="除錯" title="小明問「你喜歡吃什麼水果？（可複選）」，蘋果 60%、香蕉 50%、芭樂 40%，他畫了圓餅圖。錯在哪？">
                <div className="bg-[#fdecea] border-l-4 border-[#c0392b] p-4 rounded-r-[6px] text-[13px] text-[#4a4a6a]">
                    <strong className="text-[#c0392b]">錯誤：圓餅圖的鐵則是加總 = 100%</strong><br /><br />
                    60% + 50% + 40% = 150%，遠超 100%。圓餅圖沒辦法切出 150% 的面積。<strong>複選題只能用長條圖</strong>。
                </div>
            </PracticeBlock>

            <div className="text-[10px] font-['DM_Mono',monospace] text-[#8888aa] tracking-[0.1em] uppercase mb-2.5 mt-8">
                演練 3 · 描述 + 推論 Case Study
            </div>
            <p className="text-[13px] text-[#4a4a6a] mb-4">老師帶著全班一起做，練習用別人的資料套用公式。</p>

            <div className="border border-[#dddbd5] rounded-[8px] overflow-hidden mb-3">
                <div className="bg-[#1a1a2e] p-[10px_16px] flex items-center gap-2.5 text-white">
                    <span className="font-['DM_Mono',monospace] text-[10px] bg-[#c9a84c] text-[#1a1a2e] px-2 py-0.5 rounded-[3px] font-bold">案例一</span>
                    <span className="text-[13px] font-bold">研究樣本背景</span>
                </div>
                <div className="p-4 bg-white">
                    <div className="text-[12px] text-[#4a4a6a] bg-[#f0ede6] border-l-4 border-[#c8c5bc] p-[8px_12px] rounded-r-[4px] mb-3 leading-[1.8]">
                        數據：年齡 19–25 歲者佔「絕大多數」（男生 77.3%，女生 86.83%）。
                    </div>
                    <div className="text-[12px] text-[#4a4a6a] leading-[2.0]">
                        （推論）這份問卷的主要調查對象大多為 <span className="inline-block border-b border-[#dddbd5] min-w-[120px] mx-1">大學學齡段青年</span>。<br /><br />
                        <strong className="text-[#c0392b] font-bold">重點討論：「絕大多數」這個說法精準嗎？</strong><br />
                        兩性比例差了將近 10%，說「絕大多數」會遮蔽細節。描述時應直接引用精確數字。
                    </div>
                </div>
            </div>

            <div className="border border-[#dddbd5] rounded-[8px] overflow-hidden mb-3">
                <div className="bg-[#1a1a2e] p-[10px_16px] flex items-center gap-2.5 text-white">
                    <span className="font-['DM_Mono',monospace] text-[10px] bg-[#c9a84c] text-[#1a1a2e] px-2 py-0.5 rounded-[3px] font-bold">案例二</span>
                    <span className="text-[13px] font-bold">兩性愛情觀</span>
                </div>
                <div className="p-4 bg-white">
                    <div className="text-[12px] text-[#4a4a6a] bg-[#f0ede6] border-l-4 border-[#c8c5bc] p-[8px_12px] rounded-r-[4px] mb-3 leading-[1.8]">
                        數據：Q1 曾有單戀經驗（男 78%、女 79%）；Q2 主動追求（男 56%、女 31%）。
                    </div>
                    <div className="text-[12px] text-[#4a4a6a] leading-[2.0]">
                        （描述）兩性在單戀經驗上比例相當（男 78%、女 79%）；但在主動追求上，男生（56%）顯著 <span className="inline-block border-b border-[#dddbd5] min-w-[60px] mx-1 pr-2">高</span> 於女生（31%）。<br /><br />
                        （推論）雖然單戀是兩性的共同經驗，但社會文化 <span className="text-[#8888aa]">可能</span> 仍傾向由 <span className="inline-block border-b border-[#dddbd5] min-w-[60px] mx-1 pr-2">男</span> 性扮演主動角色。
                    </div>
                </div>
            </div>

            <div className="border border-[#dddbd5] rounded-[8px] overflow-hidden mb-12">
                <div className="bg-[#1a1a2e] p-[10px_16px] flex items-center gap-2.5 text-white">
                    <span className="font-['DM_Mono',monospace] text-[10px] bg-[#c9a84c] text-[#1a1a2e] px-2 py-0.5 rounded-[3px] font-bold">案例三</span>
                    <span className="text-[13px] font-bold">整合兩個數字寫一段分析</span>
                </div>
                <div className="p-4 bg-white">
                    <div className="text-[12px] text-[#4a4a6a] bg-[#f0ede6] border-l-4 border-[#c8c5bc] p-[8px_12px] rounded-r-[4px] mb-3 leading-[1.8]">
                        數據：73.5% 民眾不滿現況；不滿主因是「結束刑期後的社會危害（如再犯）」（85.3%）。
                    </div>
                    <div className="text-[12px] text-[#4a4a6a] leading-[2.0]">
                        試著用「描述 + 推論」公式整合：<br /><br />
                        <span className="text-[#2d5be3] font-bold">【描述】</span>根據圖一，<span className="inline-block border-b border-[#dddbd5] min-w-[200px] mx-1">73.5% 民眾對現況表示不滿</span>，其中<span className="inline-block border-b border-[#dddbd5] min-w-[200px] mx-1">85.3% 指出再犯風險為關鍵主因</span>。<br /><br />
                        <span className="text-[#2e7d5a] font-bold">【推論】</span>這可能代表<span className="inline-block border-b border-[#dddbd5] min-w-[200px] mx-1">社會對更生制度信心不足</span>。<br /><br />
                        <div className="mt-4">
                            <PracticeBlock id="ans3" badge="參考" title="看參考答案">
                                <div className="bg-[#e8f5ee] border-l-4 border-[#2e7d5a] p-4 rounded-r-[6px] text-[13px] text-[#4a4a6a]">
                                    <strong className="text-[#2e7d5a]">參考答案：</strong><br /><br />
                                    【描述】根據圖一，73.5% 的民眾表示不滿，其中 85.3% 的不滿者將主因指向「結束刑期後對社會的潛在危害」。<br /><br />
                                    【推論】這可能代表民眾對現行司法與精神衛生體系的協作機制缺乏信心，或者對後續追蹤政策知情不足。
                                </div>
                            </PracticeBlock>
                        </div>
                    </div>
                </div>
            </div>

            {/* Class Task */}
            <div className="flex items-center gap-3 mb-6 mt-16 text-[#1a1a2e]">
                <h2 className="font-['Noto_Serif_TC',serif] text-[18px] font-bold whitespace-nowrap">課堂任務</h2>
                <div className="h-[1px] flex-1 bg-[#dddbd5]"></div>
                <span className="font-['DM_Mono',monospace] text-[10px] text-[#8888aa] tracking-[0.08em]">IN-CLASS</span>
            </div>

            <TaskBlock badge="TASK 1" title="製作你們組的圖表（第一節）">
                <ol className="list-decimal pl-5 text-[13px] text-[#4a4a6a] leading-[2.1]">
                    <li>打開你們的原始資料（Google 表單回覆 / 數據表）</li>
                    <li>挑選關鍵變項，用決策口訣決定圖表類型</li>
                    <li>用 Google 試算表、Excel 或 Canva 製作圖表</li>
                    <li>確認：標題（含 N 值）、資料來源、類型選擇正確</li>
                </ol>
                <div className="p-[11px_16px] bg-[#fdf6e3] text-[#7a6020] border-l-4 border-[#c9a84c] rounded-r-[6px] text-[12px] mt-4 leading-[1.75] flex items-start gap-2">
                    <Lightbulb size={16} className="shrink-0 mt-0.5" />
                    <div>💡 如果資料還沒整理好，老師有準備假資料讓你練習。等自己的資料整理完再替換。</div>
                </div>
            </TaskBlock>

            <TaskBlock badge="TASK 2" title="寫圖說段落（第二節）">
                <ol className="list-decimal pl-5 text-[13px] text-[#4a4a6a] leading-[2.1]">
                    <li>拿出圖表，對照公式寫下說明</li>
                    <li>寫描述句：「根據圖一，……（報數字）」</li>
                    <li>寫推論句：「這可能代表……（解釋意義）」</li>
                    <li>檢查：有沒有說「一定」？量詞是否精準？</li>
                </ol>
                <div className="p-[11px_16px] bg-[#fdecea] text-[#c0392b] border-l-4 border-[#c0392b] rounded-r-[6px] text-[12px] mt-4 leading-[1.75] flex items-start gap-2">
                    <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                    <div>⚠️ 如果你的推論句跳太快，老師會問你「這兩件事怎麼連起來？」。</div>
                </div>
            </TaskBlock>

            <TaskBlock badge="TASK 3" title="分享與討論（第二節）">
                <ol className="list-decimal pl-5 text-[13px] text-[#4a4a6a] leading-[2.1]">
                    <li>1–2 組分享你們的圖說段落</li>
                    <li>全班討論：描述夠精準嗎？推論有沒有跳太快？</li>
                    <li>在學習單 Part 2 預填 W14 的空格</li>
                </ol>
                <div className="p-[11px_16px] bg-[#e8eeff] text-[#2d5be3] border-l-4 border-[#2d5be3] rounded-r-[6px] text-[12px] mt-4 leading-[1.75] flex items-start gap-2">
                    <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
                    <div>🔑 今天學的是針對一張圖的局部說明。W14 要升級：把所有圖說整合成四層結論。</div>
                </div>
            </TaskBlock>

            {/* Wrap up Section */}
            <div className="flex items-center gap-3 mb-6 mt-16 text-[#1a1a2e]">
                <h2 className="font-['Noto_Serif_TC',serif] text-[18px] font-bold whitespace-nowrap">本週總結</h2>
                <div className="h-[1px] flex-1 bg-[#dddbd5]"></div>
                <span className="font-['DM_Mono',monospace] text-[10px] text-[#8888aa] tracking-[0.08em]">WRAP-UP</span>
            </div>

            <div className="border border-[#dddbd5] rounded-[10px] overflow-hidden mb-4">
                <div className="p-[14px_20px] bg-[#f0ede6] border-b border-[#dddbd5] text-[14px] font-bold text-[#1a1a2e]">✅ 本週結束，你應該要會</div>
                <div className="grid grid-cols-1 md:grid-cols-2 bg-[#dddbd5] gap-[1px]">
                    <div className="bg-white p-[14px_20px] flex items-start gap-2.5">
                        <CheckCircle2 size={16} className="text-[#2e7d5a] shrink-0 mt-0.5" />
                        <span className="text-[13px] text-[#4a4a6a]">至少一張圖表，格式正確（含 N 值、來源）</span>
                    </div>
                    <div className="bg-white p-[14px_20px] flex items-start gap-2.5">
                        <CheckCircle2 size={16} className="text-[#2e7d5a] shrink-0 mt-0.5" />
                        <span className="text-[13px] text-[#4a4a6a]">每張圖各有一段圖說（描述句 + 推論句）</span>
                    </div>
                    <div className="bg-white p-[14px_20px] flex items-start gap-2.5">
                        <CheckCircle2 size={16} className="text-[#2e7d5a] shrink-0 mt-0.5" />
                        <span className="text-[13px] text-[#4a4a6a]">能說出「描述」和「推論」的差別</span>
                    </div>
                    <div className="bg-white p-[14px_20px] flex items-start gap-2.5">
                        <CheckCircle2 size={16} className="text-[#2e7d5a] shrink-0 mt-0.5" />
                        <span className="text-[13px] text-[#4a4a6a]">學習單 Part 2 的 W14 預告欄已填</span>
                    </div>
                </div>
            </div>

            <div className="border border-[#dddbd5] rounded-[10px] overflow-hidden mb-12">
                <div className="p-[12px_20px] bg-[#f0ede6] border-b border-[#dddbd5] flex items-center gap-2.5">
                    <span className="text-[10px] font-mono bg-[#1a1a2e] text-white px-2 py-0.5 rounded-[3px]">HOMEWORK</span>
                    <span className="font-bold text-[14px] text-[#1a1a2e]">本週作業</span>
                </div>
                <div className="flex flex-col bg-[#dddbd5] gap-[1px]">
                    <div className="bg-white p-[11px_20px] flex items-start gap-4">
                        <span className="font-['DM_Mono',monospace] text-[11px] font-bold text-[#2d5be3] w-[72px] shrink-0 mt-0.5">圖說段落</span>
                        <span className="text-[13px] text-[#4a4a6a] flex-1 leading-[1.65]">完成所有圖表圖說段落，上傳 Classroom</span>
                    </div>
                    <div className="bg-white p-[11px_20px] flex items-start gap-4">
                        <span className="font-['DM_Mono',monospace] text-[11px] font-bold text-[#2d5be3] w-[72px] shrink-0 mt-0.5">帶去 W14</span>
                        <span className="text-[13px] text-[#4a4a6a] flex-1 leading-[1.65]">攜帶所有圖表、圖說段落與研究問題</span>
                    </div>
                </div>
                <div className="p-[12px_20px] bg-[#f8f7f4] border-t border-[#dddbd5] flex items-center justify-between">
                    <span className="text-[12px] text-[#8888aa]">學習單在 Google Classroom 下載</span>
                    <a href="https://classroom.google.com/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-[12px] font-mono font-bold text-[#2d5be3]">→ Google Classroom</a>
                </div>
            </div>

            {/* Dark Next Week Preview */}
            <div className="bg-[#1a1a2e] rounded-[10px] overflow-hidden mb-8">
                <div className="p-[16px_24px] border-b border-white border-opacity-5 flex items-center gap-2.5">
                    <span className="font-['DM_Mono',monospace] text-[10px] bg-white bg-opacity-10 text-white text-opacity-50 px-2 py-0.5 rounded-[3px]">NEXT WEEK</span>
                    <span className="text-[14px] font-bold text-white">W14 研究結論：四層寫作法</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 bg-white bg-opacity-5 gap-[1px]">
                    <div className="bg-[#1a1a2e] p-[20px_24px]">
                        <div className="text-[10px] font-['DM_Mono',monospace] text-white text-opacity-30 uppercase tracking-[0.08em] mb-2">今天學了兩層</div>
                        <div className="text-[13px] text-white text-opacity-75 leading-[1.75]">
                            描述（第一層）＋ 推論（第二層）。這是局部說明。W14 要升級——把發現整合成四層結論。
                        </div>
                    </div>
                    <div className="bg-[#1a1a2e] p-[20px_24px]">
                        <div className="text-[10px] font-['DM_Mono',monospace] text-white text-opacity-30 uppercase tracking-[0.08em] mb-2">下週揭曉：第三、四層</div>
                        <div className="text-[13px] text-white text-opacity-75 leading-[1.75]">
                            第三層：<strong className="text-white">___________</strong>（回頭看研究問題）<br />
                            第四層：<strong className="text-white">___________</strong>（你的結論有哪些不完美？）<br />
                            <span className="text-[11px] opacity-50 mt-1 block">答案 W14 揭曉！</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center py-8 border-t border-[#dddbd5]">
                <Link to="/w10" className="text-[13px] font-bold text-[#8888aa] hover:text-[#1a1a2e] transition-colors flex items-center gap-2">
                    <ArrowLeft size={16} /> 回 W10 倫理審查
                </Link>
                <Link to="/w14" className="bg-[#1a1a2e] hover:bg-[#2a2a4a] text-white px-6 py-2.5 rounded-[6px] text-[14px] font-bold transition-colors flex items-center gap-2">
                    前往 W14 研究結論 <ArrowRight size={16} />
                </Link>
            </div>

        </div>
    );
};
