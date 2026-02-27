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
                            文獻偵探社
                        </h1>
                        <p className="text-slate-600 mt-2 text-lg">
                            福爾摩斯的證物鑑識：不只找資料，還要「鑑識」資料。
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

            {/* Guide Sections */}
            <div className="grid md:grid-cols-2 gap-8">

                {/* 證物位階 */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="bg-slate-800 p-4 text-white">
                        <h3 className="font-bold text-lg flex items-center gap-2">
                            <span className="text-2xl">⚖️</span> 證物可信度等級 (A-D)
                        </h3>
                    </div>
                    <div className="p-6 space-y-4">
                        <div className="flex gap-4 items-start">
                            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 font-bold text-xl flex items-center justify-center shrink-0">A</div>
                            <div>
                                <h4 className="font-bold text-slate-800">學術期刊論文 / 碩博士論文</h4>
                                <p className="text-sm text-slate-600">經過專家審查（Peer Review）。可信度最高，主要觀點來源。</p>
                            </div>
                        </div>
                        <div className="flex gap-4 items-start">
                            <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 font-bold text-xl flex items-center justify-center shrink-0">B</div>
                            <div>
                                <h4 className="font-bold text-slate-800">政府報告 / 國際組織數據</h4>
                                <p className="text-sm text-slate-600">具備官方權威性（如：教育部、WHO）。數據分析的堅實後盾。</p>
                            </div>
                        </div>
                        <div className="flex gap-4 items-start">
                            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 font-bold text-xl flex items-center justify-center shrink-0">C</div>
                            <div>
                                <h4 className="font-bold text-slate-800">主流媒體 / 專家專欄</h4>
                                <p className="text-sm text-slate-600">天下雜誌、泛科學等。可用來幫助理解生硬概念，但不能作為唯一證據。</p>
                            </div>
                        </div>
                        <div className="flex gap-4 items-start">
                            <div className="w-12 h-12 rounded-full bg-red-100 text-red-700 font-bold text-xl flex items-center justify-center shrink-0">D</div>
                            <div>
                                <h4 className="font-bold text-slate-800">內容農場 / 個人社群文</h4>
                                <p className="text-sm text-slate-600">缺乏查證機制。通常帶有強烈情緒或標題殺人，<span className="text-red-600 font-bold">絕對不可引用於正式研究。</span></p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 正確引用法 */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
                    <div className="bg-blue-600 p-4 text-white">
                        <h3 className="font-bold text-lg flex items-center gap-2">
                            <span className="text-2xl">🍔</span> 正確引用：三明治構句法
                        </h3>
                    </div>
                    <div className="p-6 flex-1 flex flex-col justify-center">
                        <p className="text-sm text-slate-600 mb-6">引用一段前人的研究，就像做一個漢堡，必須要有上下兩層麵包包夾著精華的肉排。</p>

                        <div className="space-y-3 relative">
                            <div className="absolute left-4 top-4 bottom-4 w-1 bg-amber-200 rounded"></div>

                            <div className="pl-10 relative">
                                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-amber-400 border-2 border-white shadow-sm"></span>
                                <h4 className="font-bold text-amber-800 text-sm mb-1">上層麵包：引言 (Signal Phrase)</h4>
                                <p className="text-xs text-slate-600">介紹這是誰說的，或者為什麼要提這個。 <br /><span className="italic text-slate-500">例：「許多學生認為拖延只是時間管理問題。然而，Sirois (2018) 指出：」</span></p>
                            </div>

                            <div className="pl-10 relative">
                                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-red-400 border-2 border-white shadow-sm"></span>
                                <h4 className="font-bold text-red-800 text-sm mb-1">肉排：引用內容 (Quote/Paraphrase)</h4>
                                <p className="text-xs text-slate-600">直接引用（加引號）或是你用自己的話正確改寫的核心知識。<br /><span className="italic text-slate-500">例：「『拖延症並非單純的時間管理失敗，而是一種情緒調節的失敗。』」</span></p>
                            </div>

                            <div className="pl-10 relative">
                                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-amber-400 border-2 border-white shadow-sm"></span>
                                <h4 className="font-bold text-amber-800 text-sm mb-1">下層麵包：你的觀點 (Your Voice)</h4>
                                <p className="text-xs text-slate-600">解釋這句話跟你的研究有什麼關係，你的看法是什麼。<br /><span className="italic text-slate-500">例：「這提醒我們，制定讀書計畫時也要考慮情緒管理。」</span></p>
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
