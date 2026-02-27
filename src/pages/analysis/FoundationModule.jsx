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
                    數據分析的本質
                </h3>
                <p className="mb-6 text-slate-600">做研究就像當偵探，而數據就是你蒐集到的「證物」。你的任務不是只把數據丟出來，而是要透過分析，講出一個有證據支持的「故事」。</p>

                <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 hover:shadow-md transition">
                        <h4 className="font-bold text-slate-700 mb-2">📊 描述 (Descriptive)</h4>
                        <p className="text-sm text-slate-600">客觀陳述數據呈現的樣貌。<br /><span className="text-xs bg-slate-200 px-1 rounded mt-2 inline-block">例：「平均睡眠 6.2 小時。」</span></p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 hover:shadow-md transition">
                        <h4 className="font-bold text-slate-700 mb-2">🧠 詮釋 (Interpretive)</h4>
                        <p className="text-sm text-slate-600">解讀數據背後的意義。<br /><span className="text-xs bg-slate-200 px-1 rounded mt-2 inline-block">例：「顯示睡眠不足是普遍現象。」</span></p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 hover:shadow-md transition">
                        <h4 className="font-bold text-slate-700 mb-2">🔍 批判 (Critical)</h4>
                        <p className="text-sm text-slate-600">檢視結論的限制與可信度。<br /><span className="text-xs bg-slate-200 px-1 rounded mt-2 inline-block">例：「但樣本僅限本校...」</span></p>
                    </div>
                </div>
            </div>

            {/* Content 2: AI-RED */}
            <div className="bg-emerald-50 p-6 rounded-xl shadow-sm border border-emerald-100 border-l-4 border-l-emerald-500">
                <h3 className="text-xl font-bold mb-4 text-emerald-900">🤖 AI 協作指南：AI-RED 原則</h3>
                <p className="mb-4 text-emerald-800">AI 是你的「研究助理」，不是你的「代筆者」。請再次確認你了解以下原則：</p>
                <ul className="space-y-3 text-sm text-emerald-800">
                    <li className="flex gap-3 items-start"><span className="font-bold whitespace-nowrap">Ascribe (歸屬)</span> <span>誠實揭露。在報告中寫出：「本研究使用 GenAI (ChatGPT/Claude) 輔助數據分析。」</span></li>
                    <li className="flex gap-3 items-start"><span className="font-bold whitespace-nowrap">Inquire (探詢)</span> <span>分階段引導，不要一次丟全部資料。</span></li>
                    <li className="flex gap-3 items-start"><span className="font-bold whitespace-nowrap">Reference (參照)</span> <span>保存你與 AI 的完整對話紀錄（截圖），作為研究歷程。</span></li>
                    <li className="flex gap-3 items-start"><span className="font-bold whitespace-nowrap text-red-600">Evaluate (評估)</span> <span><strong className="text-red-600">絕不照單全收</strong>。AI 算出的數字要驗證，解釋要思考邏輯。</span></li>
                    <li className="flex gap-3 items-start"><span className="font-bold whitespace-nowrap">Document (紀錄)</span> <span>記錄你如何「修正」AI 的建議。</span></li>
                </ul>
            </div>

            {/* Content 3: Correlation vs Causation */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                <h3 className="text-lg font-bold text-amber-800 mb-2">⚠️ 避開分析地雷：相關 ≠ 因果</h3>
                <div className="flex flex-col md:flex-row gap-6 items-center">
                    <div className="flex-1 text-sm text-amber-900 space-y-2">
                        <p><strong>現象：</strong>「愛吃早餐的學生，成績比較好」。</p>
                        <p>❌ <strong>錯誤推論：</strong>「吃早餐會讓成績變好」（因果）。</p>
                        <p>✅ <strong>正確解讀：</strong>「吃早餐習慣與成績表現有正相關」（相關）。</p>
                        <p className="text-xs mt-2 text-amber-700">原因：可能有「第三變項」（如：家庭社經地位高 → 有錢吃早餐 + 有錢補習）。</p>
                        <button
                            onClick={() => setShowChart(!showChart)}
                            className="mt-4 bg-amber-600 text-white px-4 py-2 rounded text-sm hover:bg-amber-700 transition shadow-sm w-full md:w-auto"
                        >
                            {showChart ? '隱藏圖表' : '顯示相關性圖表範例'}
                        </button>
                    </div>
                    {showChart && (
                        <div className="flex-1 w-full bg-white p-4 rounded shadow-sm border border-amber-100 flex items-center justify-center text-amber-600 text-sm font-bold h-64 animate-in fade-in">
                            <FoundationChart />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
