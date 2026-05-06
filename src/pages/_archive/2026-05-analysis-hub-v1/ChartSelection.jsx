import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import {
    LineChart,
    PieChart,
    BarChart,
    ScatterChart,
    CheckCircle2,
    AlertCircle,
    Lightbulb,
    Quote,
    TrendingUp,
    Info,
    PenTool,
    BookOpen,
    Search,
    Rocket,
    ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ChartSelection = () => {
    const navigate = useNavigate();
    const [activeExercise, setActiveExercise] = useState(null);

    const chartTypes = [
        {
            type: '折線圖 (Line)',
            icon: <LineChart className="text-[#2d5be3]" />,
            usage: '看趨勢、時間變化',
            keywords: '隨時間、波動',
            color: 'bg-white',
            borderColor: 'border-[#dddbd5]'
        },
        {
            type: '圓餅圖 (Pie)',
            icon: <PieChart className="text-[#e32d5b]" />,
            usage: '看比例、結構',
            keywords: '佔比、總和100%',
            color: 'bg-white',
            borderColor: 'border-[#dddbd5]'
        },
        {
            type: '長條圖 (Bar)',
            icon: <BarChart className="text-[#2e7d5a]" />,
            usage: '看比較、排名',
            keywords: '比大小、第一名',
            color: 'bg-white',
            borderColor: 'border-[#dddbd5]'
        },
        {
            type: '散佈圖 (Scatter)',
            icon: <ScatterChart className="text-[#c9a84c]" />,
            usage: '看相關性',
            keywords: '關係、分佈',
            color: 'bg-white',
            borderColor: 'border-[#dddbd5]'
        }
    ];

    const exercises = [
        { q: "1. 全班同學「數學成績」與「物理成績」是否有關聯。", a: "(D) 散佈圖", reason: "觀察兩個連續變項之間的互動關係。" },
        { q: "2. 福利社過去三個月「珍珠奶茶」銷量的每日變化情形。", a: "(C) 折線圖", reason: "展現時間軸上的數據波動趨勢。" },
        { q: "3. 比較全校各班級的「整潔競賽」總分排名。", a: "(B) 長條圖", reason: "適合進行類別間的大型數值比較。" },
        { q: "4. 分析自己一天 24 小時的時間分配比例。", a: "(A) 圓餅圖", reason: "展現各組成部分佔整體的權重。" }
    ];

    return (
        <div className="max-w-6xl mx-auto px-8 md:px-12 py-12 space-y-16 animate-in fade-in duration-700 font-['Noto_Sans_TC',sans-serif] text-[14px] leading-[1.6] text-[#1a1a2e]">

            {/* Header */}
            <header className="space-y-6 pt-8">
                <div className="flex items-center gap-2">
                    <span className="bg-[#1a1a2e] text-white text-[10px] font-bold px-2 py-0.5 rounded-[2px] font-['DM_Mono',monospace] uppercase tracking-wider">Principles</span>
                    <span className="text-[11px] text-[#8888aa] font-['DM_Mono',monospace] tracking-widest uppercase">Data Visualization / 數據視覺化原則</span>
                </div>
                <h1 className="font-['Noto_Serif_TC',serif] text-[42px] font-bold text-[#1a1a2e] leading-[1.1] max-w-[800px]">
                    選圖表如同選盤子：讓數據說出最清楚的話
                </h1>
                <p className="text-[16px] text-[#4a4a6a] max-w-[600px] leading-relaxed">
                    數據是食材，圖表是盤子。本模組將教你如何根據研究目的選擇最合適的「盤子」，讓你的數據說出最有力、最清楚的話。
                </p>
            </header>

            {/* Section 1: Chart Toolset */}
            <section className="space-y-8">
                <div className="flex items-center justify-between border-b border-[#dddbd5] pb-4">
                    <h2 className="font-bold text-[18px] text-[#1a1a2e] font-['Noto_Serif_TC',serif]">觀念一：選對圖表工具 (Chart Types)</h2>
                    <span className="text-[11px] text-[#8888aa] font-['DM_Mono',monospace] uppercase tracking-widest">Logic Selection</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {chartTypes.map((item, idx) => (
                        <div key={idx} className="group bg-white border border-[#dddbd5] rounded-[10px] p-8 space-y-6 transition-all hover:border-[#1a1a2e] hover:shadow-xl">
                            <div className="w-12 h-12 bg-[#f8f7f4] rounded-full flex items-center justify-center transition-transform group-hover:scale-110">
                                {item.icon}
                            </div>
                            <div className="space-y-2">
                                <h3 className="font-bold text-[15px] font-['Noto_Serif_TC',serif]">{item.type}</h3>
                                <p className="text-[12px] text-[#4a4a6a]">{item.usage}</p>
                            </div>
                            <div className="flex flex-wrap gap-2 pt-2">
                                <span className="px-2 py-0.5 bg-[#f8f7f4] border border-[#dddbd5] rounded-[2px] text-[10px] font-bold text-[#8888aa] uppercase tracking-tighter">#{item.keywords}</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="bg-[#1a1a2e] text-white rounded-[10px] p-10 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:scale-110 transition-transform duration-700">
                        <TrendingUp size={160} />
                    </div>
                    <div className="relative z-10 space-y-8">
                        <div className="flex items-center gap-3 text-[#c9a84c]">
                            <Lightbulb size={20} />
                            <h3 className="font-bold text-[16px] uppercase tracking-widest font-['DM_Mono',monospace]">Decision Engine // 快速決策核心</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            {[
                                { n: '01', t: '時間流動？', a: '→ 折線圖', c: 'text-[#2d5be3]' },
                                { n: '02', t: '部分佔比？', a: '→ 圓餅圖', c: 'text-[#e32d5b]' },
                                { n: '03', t: '兩者關係？', a: '→ 散佈圖', c: 'text-[#c9a84c]' },
                                { n: '04', t: '比大或排名？', a: '→ 長條圖', c: 'text-[#2e7d5a]' },
                            ].map(step => (
                                <div key={step.n} className="space-y-2 border-l border-white/10 pl-6">
                                    <span className="block text-[10px] font-bold opacity-30 font-['DM_Mono',monospace]">{step.n}</span>
                                    <p className="text-[13px] font-bold">{step.t}</p>
                                    <p className={`text-[12px] font-black ${step.c}`}>{step.a}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Section 2: Interactive Practice */}
            <section className="space-y-8">
                <div className="flex items-center justify-between border-b border-[#dddbd5] pb-4">
                    <h2 className="font-bold text-[18px] text-[#1a1a2e] font-['Noto_Serif_TC',serif]">實戰演練：圖表直覺測試</h2>
                    <span className="text-[11px] text-[#8888aa] font-['DM_Mono',monospace] uppercase tracking-widest">Judgment Test</span>
                </div>

                <div className="grid md:grid-cols-1 gap-4">
                    {exercises.map((ex, i) => (
                        <div key={i} className="flex flex-col bg-[#f8f7f4] border border-[#dddbd5] rounded-[6px] overflow-hidden">
                            <div className="px-8 py-5 flex items-center justify-between group cursor-pointer hover:bg-white transition-colors"
                                onClick={() => setActiveExercise(activeExercise === i ? null : i)}>
                                <span className="font-medium text-[#1a1a2e]">{ex.q}</span>
                                <div className={`transition-transform duration-300 ${activeExercise === i ? 'rotate-90' : ''}`}>
                                    <ArrowRight size={16} className="text-[#8888aa]" />
                                </div>
                            </div>
                            {activeExercise === i && (
                                <div className="px-8 py-6 bg-white border-t border-[#dddbd5] space-y-2 animate-in slide-in-from-top-2">
                                    <p className="font-bold text-[#1a1a2e] flex items-center gap-2">
                                        <CheckCircle2 size={16} className="text-[#2e7d5a]" /> {ex.a}
                                    </p>
                                    <p className="text-[13px] text-[#8888aa] pl-6 leading-relaxed">{ex.reason}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="bg-[#fdf2f2] border border-[#f2dada] rounded-[10px] p-8 space-y-6">
                    <h3 className="font-bold text-[18px] text-[#e32d5b] font-['Noto_Serif_TC',serif] flex items-center gap-3">
                        <AlertCircle size={24} /> 圖表除錯案 (Debug Case)
                    </h3>
                    <div className="grid md:grid-cols-2 gap-10">
                        <div className="space-y-4">
                            <p className="text-[11px] font-black text-[#e32d5b] uppercase tracking-widest">Bug Scenario // 情境</p>
                            <div className="bg-white p-6 border border-[#f2dada] rounded-[6px] space-y-4 font-['Noto_Serif_TC',serif] italic leading-loose text-[#4a4a6a]">
                                「你喜歡吃什麼？(可複選)」<br />
                                結果：蘋果 60%、香蕉 50%、芭樂 40%。<br />
                                小明最後選用 <span className="underline decoration-[#e32d5b] decoration-2 underline-offset-4 font-bold text-[#1a1a2e]">圓餅圖</span>。
                            </div>
                        </div>
                        <div className="space-y-4">
                            <p className="text-[11px] font-black text-[#2e7d5a] uppercase tracking-widest">Logic Fix // 修正</p>
                            <div className="space-y-4 text-[13px] text-[#4a4a6a] leading-relaxed">
                                <p className="font-bold text-[#1a1a2e]">為什麼錯了？</p>
                                <p>圓餅圖的總和 <strong className="text-[#e32d5b]">必須精確等於 100%</strong>。複選題的加總通常會爆表，顯示的是「被勾選頻率」。</p>
                                <p className="p-3 bg-[#e8fff3] border border-[#c1e6d1] rounded-[4px] text-[#2e7d5a] font-bold">
                                    ✓ 正確方案：請使用「長條圖」來比較不同選項的排名。
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section 3: Professional Standard */}
            <section className="space-y-8">
                <div className="flex items-center justify-between border-b border-[#dddbd5] pb-4">
                    <h2 className="font-bold text-[18px] text-[#1a1a2e] font-['Noto_Serif_TC',serif]">觀念二：專業引用的物理規範</h2>
                    <span className="text-[11px] text-[#8888aa] font-['DM_Mono',monospace] uppercase tracking-widest">APA Standard</span>
                </div>
                <div className="grid md:grid-cols-2 gap-8">
                    {[
                        { title: '標題格式 (Title)', pos: '放在圖表上方', note: '必加 N=有效樣本數', bg: 'bg-[#f8f7f4]', border: 'border-[#dddbd5]' },
                        { title: '來源標示 (Source)', pos: '放在圖表下方', note: '資料來源：研究者繪製', bg: 'bg-[#f8f7f4]', border: 'border-[#dddbd5]' },
                    ].map(item => (
                        <div key={item.title} className={`${item.bg} border ${item.border} rounded-[10px] p-8 space-y-6 relative overflow-hidden`}>
                            <h4 className="font-bold text-[14px] text-[#1a1a2e] uppercase tracking-wider font-['DM_Mono',monospace]">{item.title}</h4>
                            <p className="text-[16px] font-['Noto_Serif_TC',serif] font-bold text-[#1a1a2e] leading-snug">
                                {item.pos}
                            </p>
                            <p className="text-[12px] text-[#8888aa] italic">{item.note}</p>
                            <div className="pt-4 opacity-10">
                                <Search size={40} />
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Section 4: Storytelling Formula */}
            <section className="space-y-8">
                <div className="flex items-center justify-between border-b border-[#dddbd5] pb-4">
                    <h2 className="font-bold text-[18px] text-[#1a1a2e] font-['Noto_Serif_TC',serif]">觀念三：數據說故事 (寫作公式)</h2>
                    <span className="text-[11px] text-[#8888aa] font-['DM_Mono',monospace] uppercase tracking-widest">Storytelling Layer</span>
                </div>

                <div className="bg-[#1a1a2e] text-white rounded-[10px] p-12 space-y-12">
                    <div className="flex flex-col items-center text-center space-y-6">
                        <span className="text-[11px] font-bold text-[#c9a84c] uppercase tracking-[0.2em] font-['DM_Mono',monospace]">The Golden Formula</span>
                        <div className="text-[28px] md:text-[36px] font-['Noto_Serif_TC',serif] font-bold leading-tight">
                            數據分析 = <span className="text-[#2d5be3]">數據描述</span> + <span className="text-[#e32d5b]">分析推論</span>
                        </div>
                        <p className="text-[14px] text-white/50 max-w-[500px]">將客觀事實與主觀見解精密分離，是建立學術權威感的第一步。</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-[1px] bg-white/10 rounded-[6px] overflow-hidden">
                        <div className="bg-white/5 p-8 space-y-4">
                            <h4 className="font-bold text-[14px] text-[#2d5be3] uppercase tracking-widest font-['DM_Mono',monospace]">01. Description // 描述</h4>
                            <p className="text-[13px] text-white/70 leading-relaxed italic">「你看到了什麼事實？」</p>
                            <p className="text-[12px] leading-relaxed opacity-60">找出最高點、最低點、平均數。不可加入猜測。</p>
                            <div className="p-3 bg-white/5 rounded text-[11px] border border-white/10 font-serif">✏️ 根據圖表一顯示，19~25 歲的比例高達 80%...</div>
                        </div>
                        <div className="bg-white/5 p-8 space-y-4">
                            <h4 className="font-bold text-[14px] text-[#e32d5b] uppercase tracking-widest font-['DM_Mono',monospace]">02. Inference // 推論</h4>
                            <p className="text-[13px] text-white/70 leading-relaxed italic">「這代表什麼意義？」</p>
                            <p className="text-[12px] leading-relaxed opacity-60">趨勢的原因分析、生活連結、打破迷思的洞察。</p>
                            <div className="p-3 bg-white/5 rounded text-[11px] border border-white/10 font-serif">✏️ 這顯示出 X 是核心因素，主因是學生對 Y 的...</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Games CTA */}
            <section className="pt-12 text-center space-y-8">
                <div className="max-w-[800px] mx-auto space-y-4">
                    <h3 className="text-[24px] font-['Noto_Serif_TC',serif] font-bold text-[#1a1a2e]">實戰演練：行動代號「解碼」</h3>
                    <p className="text-[14px] text-[#8888aa] leading-relaxed">
                        10 個情報戰略情境，你能幫數據找到最適合的對象嗎？化身情報特務，將雜亂消息配對成最高效的視覺化圖表。
                    </p>
                </div>
                <button
                    onClick={() => navigate('/game/chart-matcher')}
                    className="group relative inline-flex items-center gap-4 bg-[#1a1a2e] text-white px-10 py-4 rounded-[4px] font-bold text-[15px] transition-all hover:bg-[#2d5be3] hover:-translate-y-1 shadow-2xl"
                >
                    進入任務：行動代號：解碼
                    <ArrowRight size={18} className="transition-transform group-hover:translate-x-2" />
                </button>
            </section>

            {/* Footer Navigation */}
            <section className="border-t border-[#dddbd5] pt-12 text-center">
                <button
                    onClick={() => navigate('/analysis')}
                    className="inline-flex items-center gap-3 text-[12px] font-bold text-[#1a1a2e] uppercase tracking-[0.2em] font-['DM_Mono',monospace] hover:text-[#2d5be3] transition-colors"
                >
                    Next Step: Enter W14 Analysis Hall
                    <TrendingUp size={16} />
                </button>
            </section>
        </div>
    );
};
