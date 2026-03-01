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
    Search
} from 'lucide-react';

export const ChartSelection = () => {
    const [activeExercise, setActiveExercise] = useState(null);

    const chartTypes = [
        {
            type: '折線圖 (Line)',
            icon: <LineChart className="text-blue-500" />,
            usage: '看趨勢、時間變化',
            keywords: '隨時間、波動',
            color: 'bg-blue-50',
            borderColor: 'border-blue-100'
        },
        {
            type: '圓餅圖 (Pie)',
            icon: <PieChart className="text-rose-500" />,
            usage: '看比例、結構',
            keywords: '佔比、總和100%',
            color: 'bg-rose-50',
            borderColor: 'border-rose-100'
        },
        {
            type: '長條圖 (Bar)',
            icon: <BarChart className="text-emerald-500" />,
            usage: '看比較、排名',
            keywords: '比大小、第一名、複選題',
            color: 'bg-emerald-50',
            borderColor: 'border-emerald-100'
        },
        {
            type: '散佈圖 (Scatter)',
            icon: <ScatterChart className="text-amber-500" />,
            usage: '看相關性',
            keywords: '關係、分佈',
            color: 'bg-amber-50',
            borderColor: 'border-amber-100'
        }
    ];

    const exercises = [
        { q: "1. 全班同學「數學成績」與「物理成績」是否有關聯。", a: "(D) 散佈圖", reason: "看兩個變項之間的關係。" },
        { q: "2. 福利社過去三個月「珍珠奶茶」銷量的每日變化情形。", a: "(C) 折線圖", reason: "有時間流動的趨勢。" },
        { q: "3. 比較全校各班級的「整潔競賽」總分排名。", a: "(B) 長條圖", reason: "看比較與排名。" },
        { q: "4. 分析自己一天24小時的時間分配比例。", a: "(A) 圓餅圖", reason: "看部分佔整體的佔比。" }
    ];

    return (
        <div className="max-w-5xl mx-auto space-y-12 pb-20 animate-in fade-in duration-500">
            {/* Header */}
            <header className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100 mb-12 relative overflow-hidden text-center">
                <div className="absolute top-0 right-0 w-64 h-64 bg-violet-100 rounded-full blur-3xl opacity-40 -translate-y-1/2 translate-x-1/3" />
                <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-50 text-violet-700 border border-violet-100 shadow-sm mb-4">
                        <TrendingUp size={16} /> DATA VISUALIZATION
                    </div>
                    <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight gap-3 justify-center text-center mb-4">
                        選圖表如同選盤子：<span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-fuchsia-600 drop-shadow-sm">數據視覺化原則</span>
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
                        數據是食材，圖表是盤子。選錯圖表，數據就無法說話。
                    </p>
                </div>
            </header>

            {/* Section 1: Chart Selection */}
            <section className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 md:p-8 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 border-b-2 border-slate-100 pb-4 mb-6">
                    <div className="p-2 bg-blue-600 rounded-xl text-white shadow-sm">
                        <BookOpen size={24} />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800">觀念四：選對圖表工具</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {chartTypes.map((item, idx) => (
                        <Card key={idx} className={`${item.color} border-2 ${item.borderColor} shadow-none hover:shadow-md transition-all`}>
                            <CardContent className="p-5 flex flex-col items-center text-center space-y-3">
                                <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center">
                                    {item.icon}
                                </div>
                                <h3 className="font-bold text-slate-800">{item.type}</h3>
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter mb-1">用途</p>
                                    <p className="text-sm text-slate-700 font-medium">{item.usage}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter mb-1">關鍵字</p>
                                    <p className="text-sm text-slate-600 italic">#{item.keywords}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="bg-slate-900 rounded-3xl p-6 md:p-8 text-white overflow-hidden relative group mt-8 shadow-md">
                    <div className="absolute right-0 top-0 opacity-10 group-hover:rotate-12 transition-transform">
                        <TrendingUp size={160} />
                    </div>
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <Lightbulb className="text-amber-400" /> ⚡ 快速決策口訣
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
                        <div className="flex items-start gap-3 bg-white/10 p-4 rounded-xl">
                            <span className="font-black text-blue-400 text-lg">1</span>
                            <p className="text-sm">有時間在流動嗎？ <br /><strong className="text-blue-300">→ 折線圖</strong></p>
                        </div>
                        <div className="flex items-start gap-3 bg-white/10 p-4 rounded-xl">
                            <span className="font-black text-rose-400 text-lg">2</span>
                            <p className="text-sm">是在看部分佔整體的比例嗎？<br /><strong className="text-rose-300">→ 圓餅圖</strong></p>
                        </div>
                        <div className="flex items-start gap-3 bg-white/10 p-4 rounded-xl">
                            <span className="font-black text-emerald-400 text-lg">3</span>
                            <p className="text-sm">是在找兩個變數的關係嗎？<br /><strong className="text-emerald-300">→ 散佈圖</strong></p>
                        </div>
                        <div className="flex items-start gap-3 bg-white/10 p-4 rounded-xl">
                            <span className="font-black text-amber-400 text-lg">4</span>
                            <p className="text-sm">都不是？那是比大小或排名嗎？<br /><strong className="text-amber-300">→ 長條圖</strong></p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section 2: Practice Cases */}
            <section className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 space-y-8 hover:shadow-md transition-shadow">
                <div>
                    <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                        <PenTool className="text-indigo-500" size={28} /> 實戰演練：圖表決策直覺訓練
                    </h3>
                    <div className="space-y-4">
                        {exercises.map((ex, i) => (
                            <div key={i} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors border border-slate-100 group">
                                <span className="text-slate-700 font-medium">{ex.q}</span>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setActiveExercise(activeExercise === i ? null : i)}
                                    className={`mt-2 sm:mt-0 ${activeExercise === i ? 'bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-700' : 'text-indigo-600 border-indigo-200'}`}
                                >
                                    {activeExercise === i ? '隱藏解答' : '顯示解答'}
                                </Button>
                                {activeExercise === i && (
                                    <div className="w-full mt-4 p-4 bg-white rounded-lg border-l-4 border-indigo-500 animate-in slide-in-from-left duration-300">
                                        <p className="font-bold text-indigo-700 mb-1">{ex.a}</p>
                                        <p className="text-sm text-slate-500">{ex.reason}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="pt-8 border-t border-slate-100">
                    <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3 text-red-600">
                        <AlertCircle size={28} /> 圖表除錯案 (Chart Debugging)
                    </h3>
                    <div className="bg-red-50 p-6 rounded-2xl border border-red-100">
                        <p className="font-bold text-slate-800 mb-2">情境案例：</p>
                        <p className="text-slate-700 leading-relaxed mb-4">
                            小明做問卷：「你喜歡吃什麼水果？(可複選)」。<br />
                            結果：蘋果 60%、香蕉 50%、芭樂 40%。<br />
                            小明最後選用 <span className="underline font-bold decoration-red-400">圓餅圖</span>。
                        </p>
                        <div className="p-4 bg-white rounded-xl border border-red-200">
                            <p className="text-sm font-bold text-red-700 mb-1">💡 為什麼錯了？</p>
                            <p className="text-sm text-slate-600">
                                圓餅圖的唯一核心原則是「部分佔整體的比例」，且<strong className="text-slate-800">總和必須剛好等於 100%</strong>。
                                複選題的加總通常會超過 100%，這時應該使用<strong className="text-slate-800">「長條圖」</strong>來比較不同選項被勾選的次數或排名。
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section 3: Citation Format */}
            <section className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 md:p-8 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 border-b-2 border-slate-100 pb-4 mb-6">
                    <div className="p-2 bg-emerald-600 rounded-xl text-white shadow-sm">
                        <Info size={24} />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800">觀念五：圖表引用格式</h2>
                </div>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-200">
                            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4">
                                <CheckCircle2 size={24} />
                            </div>
                            <h4 className="font-bold text-slate-800 mb-2">📌 標題格式</h4>
                            <p className="text-sm text-slate-600 mb-4">
                                必須放在圖表的<strong className="text-slate-900 underline decoration-blue-300">上方</strong>。
                            </p>
                            <div className="p-3 bg-slate-50 rounded border border-dashed border-slate-300 font-mono text-xs text-center">
                                圖一：高二學生社團參與時數
                                <div className="mt-2 h-20 w-4/5 mx-auto bg-slate-200 rounded flex items-center justify-center text-[10px] text-slate-400 italic">
                                    ( 此處為圖表圖片 )
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-200">
                            <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                                <Search size={24} />
                            </div>
                            <h4 className="font-bold text-slate-800 mb-2">📌 來源標示</h4>
                            <p className="text-sm text-slate-600 mb-4">
                                必須放在圖表的<strong className="text-slate-900 underline decoration-emerald-300">下方</strong>。
                            </p>
                            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                                <p className="text-xs font-bold text-emerald-800 mb-1">格式規範提示：</p>
                                <ul className="text-xs text-emerald-700 space-y-1 list-disc pl-4">
                                    <li>引用他人的圖：標註原作者與年份。</li>
                                    <li>自己問卷跑出來的：標註<strong className="text-slate-900">「資料來源：研究者繪製」</strong>。</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section 4: Storytelling */}
            <section className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 md:p-8 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 border-b-2 border-slate-100 pb-4 mb-6">
                    <div className="p-2 bg-amber-600 rounded-xl text-white shadow-sm">
                        <Quote size={24} />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800">觀念六：數據說故事 (描述 vs. 推論)</h2>
                </div>

                <div className="bg-amber-50 rounded-3xl p-8 border border-amber-100">
                    <h3 className="text-xl font-bold text-amber-900 mb-6 flex items-center gap-2">
                        💡 黃金寫作公式
                    </h3>
                    <div className="flex flex-col items-center justify-center py-6 px-4 bg-white rounded-2xl border-2 border-amber-200 shadow-sm mb-8">
                        <p className="text-2xl font-black text-slate-800 tracking-tighter text-center">
                            數據分析段落 = <span className="text-blue-600">數據描述</span> (客觀事實) + <span className="text-rose-600">分析推論</span> (主觀見解)
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-white p-6 rounded-2xl border border-blue-100 shadow-sm">
                            <h4 className="font-bold text-blue-800 mb-3 flex items-center gap-2">
                                📊 數據描述 (Description)
                            </h4>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                客觀事實。<strong className="text-slate-800 italic">「你看到了什麼？」</strong><br />
                                包含：最高、最低、平均數、顯著的轉折點。
                            </p>
                            <div className="mt-4 p-3 bg-blue-50 text-blue-700 text-xs rounded-lg font-medium">
                                ✏️ 範例：根據圖表顯示，19~25 歲的比例高達 80%...
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-2xl border border-rose-100 shadow-sm">
                            <h4 className="font-bold text-rose-800 mb-3 flex items-center gap-2">
                                💡 分析推論 (Inference)
                            </h4>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                主觀見解。<strong className="text-slate-800 italic">「這代表什麼？」</strong><br />
                                包含：趨勢的原因分析、對研究的意義、打破原本的迷思。
                            </p>
                            <div className="mt-4 p-3 bg-rose-50 text-rose-700 text-xs rounded-lg font-medium">
                                ✏️ 範例：這顯示出 X 是主要因素，可能原因為學生對 Y 的偏好...
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-4 pt-8">
                    <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                        📑 實戰案例分析 (Case Study)
                    </h3>
                    <div className="grid grid-cols-1 gap-4">
                        <div className="p-5 bg-white rounded-xl border border-slate-200 hover:border-violet-300 transition-colors group">
                            <p className="text-xs font-bold text-violet-500 mb-1">案例三：精神病患處置民調</p>
                            <p className="text-sm text-slate-700 mb-3">數據：73.5% 民眾不滿現況；不滿主因是「結束刑期後的社會危害」(85.3%)。</p>
                            <div className="p-3 bg-violet-50 rounded-lg group-hover:bg-violet-100 transition-colors">
                                <p className="text-sm text-slate-800">
                                    <strong className="text-violet-700">綜合分析：</strong> 超過七成民眾不滿現況，進一步分析發現，民眾最大的擔憂源自於對<strong className="text-violet-900 border-b-2 border-violet-300">結束刑期後再犯</strong>的恐懼。
                                </p>
                            </div>
                        </div>
                        {/* More cases can be added here if needed */}
                    </div>
                </div>
            </section>
        </div>
    );
};
