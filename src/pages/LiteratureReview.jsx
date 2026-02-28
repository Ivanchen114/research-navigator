import React from 'react';
import { BookOpen, ShieldAlert, Cpu, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const LiteratureReview = () => {
    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">

            {/* Header */}
            <header className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-slate-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-amber-100 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/3"></div>
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-sm font-semibold mb-3">
                            <BookOpen size={16} /> W6 核心模組
                        </div>
                        <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
                            文獻偵探社與學術寫作倫理
                        </h1>
                        <p className="text-slate-600 mt-2 text-lg">
                            福爾摩斯的證物鑑識：不只找資料，還要學會「合法使用證據」。
                        </p>
                    </div>
                    {/* Link to the Interactive Game */}
                    <div className="shrink-0">
                        <Link
                            to="/game/citation-detective"
                            className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-md flex items-center gap-2 group"
                        >
                            <span>進入文獻偵探遊戲</span>
                            <span className="group-hover:translate-x-1 transition-transform">→</span>
                        </Link>
                    </div>
                </div>
            </header>

            {/* Core Idea */}
            <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-r-xl shadow-sm">
                <h3 className="text-xl font-bold text-amber-900 mb-3 flex items-center gap-2">
                    <ShieldAlert size={24} />
                    文獻鑑識的三大雷區
                </h3>
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                        <span className="font-bold text-red-600 block mb-2">💣 陷阱 1：孤兒引用</span>
                        <p className="text-sm text-slate-700">「只有肉，沒有漢堡包」。把引用的話直接丟出來，前面沒有引言介紹，後面沒有你的觀點解釋。</p>
                        <div className="mt-3 p-2 bg-slate-50 border border-slate-200 rounded text-xs">
                            <span className="text-red-500 font-bold">❌ 錯誤：</span> AI 很好用。(Wang, 2023) 所以我們要多用。
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                        <span className="font-bold text-red-600 block mb-2">💣 陷阱 2：換字抄襲</span>
                        <p className="text-sm text-slate-700">以為把「導致」改成「造成」、「下降」改成「降低」就不是抄襲。句型結構一樣，就是抄襲！</p>
                        <div className="mt-3 p-2 bg-slate-50 border border-slate-200 rounded text-xs">
                            <span className="text-red-500 font-bold">❌ 錯誤：</span> 睡眠不夠會造成前額葉運作降低。(陳, 2023)
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                        <span className="font-bold text-red-600 block mb-2">💣 陷阱 3：AI 幻覺論文</span>
                        <p className="text-sm text-slate-700">AI 給的文獻格式看起來超完美，但其實根本不存在這篇文章，或者作者和年份被張冠李戴。</p>
                        <div className="mt-3 p-2 bg-slate-50 border border-slate-200 rounded text-xs text-amber-600 font-semibold">
                            ⚠️ 必須回到 Google Scholar 查證真實性！
                        </div>
                    </div>
                </div>
            </div>

            {/* Guide Sections: Writing Ethics and Evidence */}
            <div className="space-y-8">
                {/* 寫作倫理：避免抄襲的實戰 */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="bg-rose-600 p-4 text-white">
                        <h3 className="font-bold text-lg flex items-center gap-2">
                            <span className="text-2xl">🚨</span> 學術寫作倫理：你踩雷了嗎？
                        </h3>
                    </div>
                    <div className="p-6">
                        <p className="text-slate-600 mb-6">找到 A 級文獻後，如果不懂「合法使用證據」，就會變成抄襲。快來看看這些實戰範例：</p>

                        <div className="grid md:grid-cols-2 gap-6">
                            {/* 改寫地雷 */}
                            <div className="bg-slate-50 p-5 rounded-lg border border-slate-200">
                                <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                                    <span className="text-rose-500">💣</span> 地雷 1：換字抄襲 (Patchwriting)
                                </h4>
                                <div className="space-y-4 text-sm">
                                    <div>
                                        <span className="font-bold text-slate-500 text-xs">原始觀點 (陳醫師, 2023)：</span>
                                        <div className="bg-white p-2 rounded border border-slate-200 mt-1">「睡眠不足會導致前額葉皮質功能下降，進而削弱學生的專注力與情緒控管能力。」</div>
                                    </div>
                                    <div>
                                        <span className="font-bold text-rose-600 text-xs">❌ 錯誤改寫 (句型完全沒變，只偷換幾個詞)：</span>
                                        <div className="bg-rose-50 p-2 rounded border border-rose-200 mt-1 text-rose-900">睡眠<span className="line-through decoration-rose-400">不夠</span>會<span className="line-through decoration-rose-400">造成</span>前額葉皮質<span className="line-through decoration-rose-400">運作降低</span>，進而<span className="line-through decoration-rose-400">減弱同學</span>的<span className="line-through decoration-rose-400">專心度</span>和<span className="line-through decoration-rose-400">情緒管理</span>。(陳醫師, 2023)</div>
                                    </div>
                                    <div>
                                        <span className="font-bold text-emerald-600 text-xs">✅ 優良改寫 (消化後重新組織)：</span>
                                        <div className="bg-emerald-50 p-2 rounded border border-emerald-200 mt-1 text-emerald-900">陳醫師 (2023) 指出，高中生的情緒管理與專注力問題，其生理成因很可能源自於睡眠缺乏所造成的前額葉功能衰退。</div>
                                    </div>
                                </div>
                            </div>

                            {/* 三明治法實戰 */}
                            <div className="bg-slate-50 p-5 rounded-lg border border-slate-200">
                                <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                                    <span className="text-emerald-500">🍔</span> 解藥：引用的三明治法則
                                </h4>
                                <p className="text-sm text-slate-600 mb-4">如果要「全文照抄」別人的權威名言，必須用你的觀點把肉包起來：</p>
                                <div className="space-y-3 relative text-sm">
                                    <div className="absolute left-4 top-4 bottom-4 w-1 bg-amber-200 rounded"></div>

                                    <div className="pl-10 relative">
                                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-amber-400 border-2 border-white shadow-sm"></span>
                                        <p className="font-bold text-amber-800 text-xs mb-1">上層麵包 (引入背景)：</p>
                                        <div className="bg-white p-2 rounded border border-slate-200">許多高中生認為拖延只是自己太懶散。然而，就如 <span className="font-bold text-blue-600">Sirois (2018)</span> 所指出的：</div>
                                    </div>

                                    <div className="pl-10 relative">
                                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-red-400 border-2 border-white shadow-sm"></span>
                                        <p className="font-bold text-red-800 text-xs mb-1">中間肉排 (全文照抄，必須加引號)：</p>
                                        <div className="bg-red-50 p-2 rounded border border-red-200 font-bold text-red-900">「拖延症並非單純的時間管理失敗，而是一種情緒調節的失敗。」</div>
                                    </div>

                                    <div className="pl-10 relative">
                                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-amber-400 border-2 border-white shadow-sm"></span>
                                        <p className="font-bold text-amber-800 text-xs mb-1">下層麵包 (你的推論/結論)：</p>
                                        <div className="bg-white p-2 rounded border border-slate-200">這句話提醒了我們，在本研究設計改善拖延的工具時，不能只給時間計畫表，還必須加入『情緒紓解』的輔助機制。</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 證物位階 */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="bg-slate-800 p-4 text-white">
                        <h3 className="font-bold text-lg flex items-center gap-2">
                            <span className="text-2xl">⚖️</span> 證物可信度等級 (A-D)
                        </h3>
                    </div>
                    <div className="p-6 grid md:grid-cols-2 gap-4">
                        <div className="flex gap-4 items-start bg-slate-50 p-4 rounded-lg">
                            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 font-bold text-xl flex items-center justify-center shrink-0">A</div>
                            <div>
                                <h4 className="font-bold text-slate-800">學術期刊論文 / 碩博士論文</h4>
                                <p className="text-sm text-slate-600">經過專家審查。可信度最高，是支持研究的<strong className="text-emerald-700">主證據</strong>。</p>
                            </div>
                        </div>
                        <div className="flex gap-4 items-start bg-slate-50 p-4 rounded-lg">
                            <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 font-bold text-xl flex items-center justify-center shrink-0">B</div>
                            <div>
                                <h4 className="font-bold text-slate-800">政府報告 / 專書章節</h4>
                                <p className="text-sm text-slate-600">具備官方權威性或專家背書。作為補強論點的<strong className="text-blue-700">輔助證據</strong>。</p>
                            </div>
                        </div>
                        <div className="flex gap-4 items-start bg-slate-50 p-4 rounded-lg">
                            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 font-bold text-xl flex items-center justify-center shrink-0">C</div>
                            <div>
                                <h4 className="font-bold text-slate-800">維基百科 / 內容農場 / 科普新聞</h4>
                                <p className="text-sm text-slate-600">只能用來「找關鍵字」或當<strong className="text-amber-700">背景線索</strong>，不能放進正式引註！</p>
                            </div>
                        </div>
                        <div className="flex gap-4 items-start bg-slate-50 p-4 rounded-lg">
                            <div className="w-12 h-12 rounded-full bg-red-100 text-red-700 font-bold text-xl flex items-center justify-center shrink-0">D</div>
                            <div>
                                <h4 className="font-bold text-slate-800">AI幻覺論文 / 找不到作者的發文</h4>
                                <p className="text-sm text-slate-600">格式再完美都是假的。<strong className="text-red-700">退回不採用，絕對不可引用！</strong></p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            {/* AI Tools for Lit Review */}
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl shadow-sm border border-indigo-100 p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6">
                    <Cpu className="text-indigo-600" size={28} />
                    <h2 className="text-2xl font-bold text-slate-800">AI 輔助閱讀與文獻整理 (NotebookLM)</h2>
                </div>

                <p className="text-slate-700 mb-6">
                    閱讀原始論文通常很耗時。W6 建議將找到的可信文獻上傳至 <a href="https://notebooklm.google.com/" target="_blank" rel="noreferrer" className="text-blue-600 font-bold hover:underline">Google NotebookLM</a>，建立你的「專屬文獻庫」，讓 AI 幫你快速摘要。
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white p-5 rounded-lg border border-slate-200">
                        <h4 className="font-bold text-indigo-900 mb-3 flex items-center gap-2">
                            <CheckCircle size={18} className="text-indigo-600" />
                            你可以問 NotebookLM：
                        </h4>
                        <ul className="space-y-3 text-sm text-slate-600">
                            <li className="flex gap-2">
                                <span className="text-indigo-400 font-bold">•</span>
                                <span>「請用高中生聽得懂的話，總括這三篇文獻對『拖延症成因』的看法。」</span>
                            </li>
                            <li className="flex gap-2">
                                <span className="text-indigo-400 font-bold">•</span>
                                <span>「文獻 A 和文獻 B 在『解決拖延症的方法』上，有沒有什麼不同的觀點？」</span>
                            </li>
                            <li className="flex gap-2">
                                <span className="text-indigo-400 font-bold">•</span>
                                <span>「請挑出這三篇文獻中，最常出現的 3 個專有名詞，並幫我解釋。」</span>
                            </li>
                        </ul>
                    </div>

                    <div className="bg-white p-5 rounded-lg border border-slate-200">
                        <h4 className="font-bold text-red-900 mb-3 flex items-center gap-2">
                            <ShieldAlert size={18} className="text-red-500" />
                            但絕對不可以：
                        </h4>
                        <ul className="space-y-3 text-sm text-slate-600">
                            <li className="flex gap-2">
                                <span className="text-red-400 font-bold">🚫</span>
                                <span><strong>直接複製 AI 摘要當作自己的內文。</strong> AI 可能會漏掉關鍵限制，或誇大結論。你必須親自閱讀 AI 提供的「來源標示 (Citations)」。</span>
                            </li>
                            <li className="flex gap-2">
                                <span className="text-red-400 font-bold">🚫</span>
                                <span><strong>要 AI 直接幫你找文獻。</strong>（如：「請給我 3 篇相關論文」）AI 自己生成的論文標題和作者極高機率是捏造的！你必須自己去 Google Scholar 找 PDF 餵給它。</span>
                            </li>
                        </ul>
                    </div>
                </div>

            </div>

        </div>
    );
};
