import React, { useState } from 'react';
import { DocLinkBtn } from '../../components/analysis/DocLinkBtn';
import { PromptBox, AIInstructionDropdown } from '../../components/analysis/PromptBox';
import { SurveyChart } from '../../components/analysis/SurveyChart';

export const SurveyModule = () => {
    const [showChart, setShowChart] = useState(false);

    return (
        <div className="p-6 md:p-8 space-y-8 animate-in fade-in slide-in-from-right-4">

            {/* Header */}
            <header className="border-b border-slate-200 pb-4">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-4">
                            <h2 className="text-2xl font-bold text-slate-800">模組 1：量化問卷法 — 三段式結論速成</h2>
                        </div>
                        <p className="text-slate-600 mt-2 text-sm">目標：不再只讓 AI 算數字，而是分三次提問，引導 AI 陪你寫出「描述 → 詮釋 → 批判」的嚴謹結論。</p>
                    </div>
                </div>
            </header>

            {/* Step 1: Data Cleaning */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                <h3 className="text-lg font-bold text-slate-800 mb-2">Step 1：把問卷餵給 AI 前的準備</h3>
                <p className="text-sm text-slate-600 mb-4">AI 很聰明，但如果餵給它垃圾，它也只能產出垃圾 (Garbage in, garbage out)。</p>
                <div className="bg-slate-50 p-4 rounded-lg mb-4">
                    <ul className="list-disc list-inside text-sm text-slate-600 space-y-2">
                        <li><strong>去除個資：</strong>把 Excel/CSV 中的姓名、Email 刪除或改成編號（R01, R02...）。</li>
                        <li><strong>簡化標題：</strong>把太長的題目改成簡短的變數名稱（例：「請問您平均每天花多少時間滑短影音？」 → 改成「Q1_短影音時數」）。</li>
                        <li><strong>刪除無效問卷：</strong>把沒填完的、全部選同一個選項的、亂填的（例如一天睡 25 小時）刪掉。</li>
                    </ul>
                </div>
            </div>

            {/* Step 2: Descriptive */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 border-l-4 border-l-indigo-500 p-6">
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">📊</span>
                    <h3 className="text-lg font-bold text-indigo-900">Step 2：第一問 — 產出純客觀的「描述」</h3>
                </div>
                <p className="text-sm text-slate-600 mb-4">把整理好的資料上傳給 AI。這個階段我們**嚴格禁止 AI 腦補**，只要它幫我們算數字和點出差異。</p>

                <AIInstructionDropdown title="複製 Prompt：客觀數據描述">
                    <PromptBox>
                        {`【角色】你是一個嚴謹的數據分析師，現在只做純粹的客觀統計，絕對不加任何主觀解釋或推論。
【任務】請讀取我上傳的問卷資料，幫我分析「自變項 X」對「依變項 Y」的影響。
【要求】
1. 請幫我算出各群體的平均數與標準差，或是各選項的百分比。
2. 請指出最高、最低及中間群體的差異。
3. [重要] 用詞必須極度客觀。不能使用「懸殊」、「絕大多數」、「穩定成長」等誇飾或非量化字眼。如果有顯著差異，只要說「XX 的平均數高於 YY」即可。`}
                    </PromptBox>
                </AIInstructionDropdown>

                {/* Chart Placeholder */}
                <div className="mt-6 p-4 bg-indigo-50 rounded-lg border border-indigo-100 flex flex-col md:flex-row gap-6 items-center">
                    <div className="flex-1">
                        <h4 className="font-bold text-indigo-900 text-sm mb-2">📈 模擬從數據找圖表特徵</h4>
                        <p className="text-xs text-indigo-800 mb-3">假設：我們先看懂圖表上的客觀現象。</p>
                        <button
                            onClick={() => setShowChart(!showChart)}
                            className="bg-indigo-600 text-white px-4 py-2 rounded text-sm hover:bg-indigo-700 shadow w-full transition"
                        >
                            {showChart ? '隱藏圖表' : '顯示圖表範例'}
                        </button>
                    </div>
                    {showChart ? (
                        <div className="flex-1 w-full bg-white h-48 rounded shadow-sm border border-indigo-100 flex items-center justify-center p-2 animate-in fade-in">
                            <SurveyChart />
                        </div>
                    ) : (
                        <div className="flex-1 w-full bg-white h-48 rounded border border-indigo-100 border-dashed flex items-center justify-center text-indigo-300 font-bold">
                            點擊左側按鈕顯示
                        </div>
                    )}
                </div>
            </div>

            {/* Step 3: Interpretive */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 border-l-4 border-l-amber-500 p-6">
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">🧠</span>
                    <h3 className="text-lg font-bold text-amber-900">Step 3：第二問 — 發展深度的「詮釋」</h3>
                </div>
                <p className="text-sm text-slate-600 mb-4">拿到客觀數據後，現在我們要借用 AI 的腦袋，幫這份數據找「意義」與「可能的原因」。</p>

                <AIInstructionDropdown title="複製 Prompt：多角度意義詮釋">
                    <PromptBox>
                        {`【角色】你是一個深思熟慮的研究者。
【任務】基於我們剛剛產出的「客觀數據描述」，幫我進行深度的解讀。
【要求】
1. 為什麼會出現這樣的數據結果？請列出至少 3 種可能的推論或假設。
2. 這些現象說明了什麼核心問題？(回答 So what?)
3. [重要] 語氣必須保留彈性，使用「這可能暗示著」、「這顯示了某種趨勢」，絕對不能使用「這證明了」、「這肯定是因為」等武斷字眼的因果論斷。`}
                    </PromptBox>
                </AIInstructionDropdown>
            </div>

            {/* Step 4: Critical */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 border-l-4 border-l-emerald-500 p-6">
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">🔍</span>
                    <h3 className="text-lg font-bold text-emerald-900">Step 4：第三問 — 進行嚴厲的「批判」</h3>
                </div>
                <p className="text-sm text-slate-600 mb-4">最精彩的一步！我們不能盲目相信剛才的結論，讓 AI 當評審來找碴。</p>

                <AIInstructionDropdown title="複製 Prompt：找碴自我檢驗">
                    <PromptBox>
                        {`【角色】你是一個極度嚴格、專門找碴的大學教授評審。
【任務】請檢視我們剛才的「客觀描述」與「主觀詮釋」，用力找出結論中的破綻。
【要求】
請條列出 3-5 個這個結論的「研究限制」或「可能漏洞」。你可以從以下幾個方向找碴：
1. 樣本代表性：高中生的數據能推論到所有人嗎？男生女生比例對嗎？
2. 變數遺漏：有沒有可能其實是「第三變項」造成的？（比如影響成績的不是社團，而是補習）
3. 問卷設計瑕疵：我們的題目會不會有誘導性？或是選項太少導致受訪者亂填？
請言詞犀利地指出這些限制。`}
                    </PromptBox>
                </AIInstructionDropdown>
                <div className="mt-4 bg-emerald-50 text-sm text-emerald-800 p-3 rounded border border-emerald-100">
                    💡 <strong>寫入報告：</strong> 拿到 AI 的找碴後，不要把整份報告廢掉！挑出 1-2 個最合理的限制，寫在報告最後的「研究限制與建議」中。這會讓評審覺得你非常嚴謹！
                </div>
            </div>
        </div>
    );
};
