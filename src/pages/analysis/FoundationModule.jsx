import React, { useState } from 'react';
import { DocLinkBtn } from '../../components/analysis/DocLinkBtn';
import { FoundationChart } from '../../components/analysis/FoundationChart';

export const FoundationModule = () => {
    const [showChart, setShowChart] = useState(false);

    return (
        <div className="p-6 md:p-8 space-y-8 animate-in fade-in slide-in-from-right-4">
            {/* Header */}
            <header className="border-b border-slate-200 pb-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">Part 1：數據分析基礎邏輯</h2>
                        <div className="flex flex-wrap gap-4 mt-2 text-sm text-slate-500">
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded font-medium">必讀</span>
                            <span>⏱️ 閱讀時間：約 10 分鐘</span>
                        </div>
                    </div>
                    <DocLinkBtn href="https://docs.google.com/document/d/12m5loeNoYrVKApfZKQRh3rvWX2oDKMqeII4S7zLMWQ0/edit?usp=drive_link">
                        閱讀完整教材文本
                    </DocLinkBtn>
                </div>
            </header>

            {/* Content 1: Nature of Data Analysis */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <h3 className="text-xl font-bold mb-4 text-slate-800 flex items-center gap-2">
                    <span className="bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">1</span>
                    如何寫好研究結論？三層次分析法
                </h3>
                <p className="mb-6 text-slate-600">
                    做研究就像當偵探，數據只是你蒐集到的「證物」。
                    很多人以為把圖表貼上去、數字報一報就是結論，其實那只完成了一小部分。
                    一個完整嚴謹的研究結論，必須通過以下三個層次：
                </p>

                <div className="space-y-6">
                    {/* Layer 1: Descriptive */}
                    <div className="bg-slate-50 p-5 rounded-lg border-l-4 border-l-indigo-500 border border-slate-200">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="text-xl">📊</span>
                            <h4 className="font-bold text-lg text-slate-800">層次一：描述 (Descriptive)</h4>
                        </div>
                        <p className="text-sm text-slate-700 mb-3">
                            <strong>目標：客觀陳述數據呈現的樣貌，不參雜個人感覺。</strong>
                        </p>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="bg-emerald-50 p-3 rounded border border-emerald-100">
                                <span className="text-emerald-700 font-bold text-sm block mb-1">✅ 這樣寫才對：</span>
                                <ul className="text-sm text-slate-600 list-disc list-inside space-y-1">
                                    <li>精準引用數字（例：佔 38%）</li>
                                    <li>兼顧兩極與中間值（例：分數介於 59-88分）</li>
                                    <li>真實描述趨勢（例：上下波動）</li>
                                </ul>
                            </div>
                            <div className="bg-rose-50 p-3 rounded border border-rose-100">
                                <span className="text-rose-700 font-bold text-sm block mb-1">❌ 常見地雷：</span>
                                <ul className="text-sm text-slate-600 list-disc list-inside space-y-1">
                                    <li><strong>量詞失準：</strong> 把 38% 說成「絕大多數」</li>
                                    <li><strong>誇大差距：</strong> 差 5% 卻說「差距懸殊」</li>
                                    <li><strong>忽略重要數據：</strong> 只提最高最低，無視中間的 60%</li>
                                    <li><strong>錯誤趨勢歸納：</strong> 明明波動很大卻說「穩定成長」</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Layer 2: Interpretive */}
                    <div className="bg-slate-50 p-5 rounded-lg border-l-4 border-l-amber-500 border border-slate-200">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="text-xl">🧠</span>
                            <h4 className="font-bold text-lg text-slate-800">層次二：詮釋 (Interpretive)</h4>
                        </div>
                        <p className="text-sm text-slate-700 mb-3">
                            <strong>目標：解讀數字背後的意義，回答「那又怎樣 (So what?)」。</strong>
                        </p>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="bg-emerald-50 p-3 rounded border border-emerald-100">
                                <span className="text-emerald-700 font-bold text-sm block mb-1">✅ 這樣寫才對：</span>
                                <ul className="text-sm text-slate-600 list-disc list-inside space-y-1">
                                    <li>探討變項間的「相關性」</li>
                                    <li>推論造成這種現象的可能原因</li>
                                    <li>將數據結果與原本的研究動機連結</li>
                                </ul>
                            </div>
                            <div className="bg-rose-50 p-3 rounded border border-rose-100">
                                <span className="text-rose-700 font-bold text-sm block mb-1">❌ 常見地雷：</span>
                                <ul className="text-sm text-slate-600 list-disc list-inside space-y-1">
                                    <li><strong>把相關當因果：</strong> 例：「吃早餐『導致』成績好」 (❌) → 應改為「兩者有『正相關』」。</li>
                                    <li><strong>過度詮釋（腦補）：</strong> 隨意套用未經證實的成見。</li>
                                    <li><strong>用詞過強：</strong> 用「證明」、「絕對」等武斷字眼（研究只能說「支持了某個假設」或「顯示某種趨勢」）。</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Layer 3: Critical */}
                    <div className="bg-slate-50 p-5 rounded-lg border-l-4 border-l-emerald-500 border border-slate-200">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="text-xl">🔍</span>
                            <h4 className="font-bold text-lg text-slate-800">層次三：批判 (Critical)</h4>
                        </div>
                        <p className="text-sm text-slate-700 mb-3">
                            <strong>目標：檢視自己這份結論的限制與可信度，展現研究者的嚴謹態度。</strong>
                        </p>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="bg-emerald-50 p-3 rounded border border-emerald-100">
                                <span className="text-emerald-700 font-bold text-sm block mb-1">✅ 這樣寫才對：</span>
                                <ul className="text-sm text-slate-600 list-disc list-inside space-y-1">
                                    <li>主動承認樣本代表性不足（如：只發了高一部分班級）</li>
                                    <li>指出可能被遺漏的「干擾變項」（例：影響成績的其實是補習時間，不是吃早餐）</li>
                                    <li>指出這份研究無法回答的問題</li>
                                </ul>
                            </div>
                            <div className="bg-rose-50 p-3 rounded border border-rose-100">
                                <span className="text-rose-700 font-bold text-sm block mb-1">❌ 常見地雷：</span>
                                <ul className="text-sm text-slate-600 list-disc list-inside space-y-1">
                                    <li><strong>過度推論：</strong> 只調查了松山高中 50 人，就寫「現在的高中生都...」。</li>
                                    <li><strong>隱瞞瑕疵：</strong> 明知道問卷設計有瑕疵或回收數量太少，卻假裝沒事。</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content 2: AI-RED */}
        </div>
    );
};
