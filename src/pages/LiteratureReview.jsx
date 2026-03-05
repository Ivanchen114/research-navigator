import React, { useState } from 'react';
import { BookOpen, ShieldAlert, CheckCircle, FileSearch, PenTool, AlertTriangle, Info, FileText, Bot, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PromptBox } from '../components/analysis/PromptBox';

export const LiteratureReview = () => {
    const [myTopic, setMyTopic] = useState('');
    const [searchKeywords, setSearchKeywords] = useState('');
    const [foundPaper, setFoundPaper] = useState('');

    const keywordPrompt = `我的研究題目是：${myTopic || '【你的題目】'}

請幫我：
1. 列出 5-8 個適合的中文關鍵字
2. 給我對應的英文關鍵字
3. 建議哪些關鍵字組合在資料庫搜尋最有效

請用表格呈現，並說明每個關鍵字的用途。`;

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">

            {/* Header */}
            <header className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100 mb-8 relative overflow-hidden text-center">
                <div className="absolute top-0 right-0 w-64 h-64 bg-amber-100 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/3" />
                <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-100 shadow-sm mb-4">
                        <BookOpen size={16} /> W5 核心模組
                    </div>
                    <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight text-center mb-4 leading-snug pb-2">
                        文獻偵探社與<span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600">學術寫作倫理</span>
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed mb-6">
                        福爾摩斯的證物鑑識：不只找資料，還要學會「合法使用證據」。
                    </p>
                    <div className="flex justify-center">
                        <Link
                            to="/game/citation-detective"
                            className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-md flex items-center gap-2 group text-lg"
                        >
                            <span>進入遊戲：行動代號：引註追緝</span>
                            <span className="group-hover:translate-x-1 transition-transform">→</span>
                        </Link>
                    </div>
                </div>
            </header>

            {/* Section 0: Literature Search */}
            <section className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 md:p-8 hover:shadow-md transition-shadow mb-8">
                <div className="flex items-center gap-3 border-b-2 border-slate-100 pb-4 mb-6">
                    <div className="p-2 bg-blue-600 rounded-xl text-white shadow-sm">
                        <Search size={24} />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800">課前熱身：資料搜集入門</h2>
                </div>

                <div className="space-y-8">
                    {/* 三步驟說明 */}
                    <div className="grid md:grid-cols-3 gap-4">
                        {[
                            { icon: '📚', title: '1. 華藝資料庫', desc: '台灣最大的學術資料庫，碩博士論文、期刊都在這裡' },
                            { icon: '🤖', title: '2. AI 關鍵字生成', desc: 'AI 幫你想出更多搜尋關鍵字，找到你沒想到的資料' },
                            { icon: '📝', title: '3. 辨識 APA 格式', desc: '知道引用格式長什麼樣，避免落入抄襲的陷阱' },
                        ].map(item => (
                            <div key={item.title} className="bg-blue-50 rounded-2xl border border-blue-100 p-5 text-center transition-transform hover:-translate-y-1">
                                <div className="text-4xl mb-3">{item.icon}</div>
                                <p className="font-bold text-blue-800 text-base mb-2">{item.title}</p>
                                <p className="text-blue-600 text-sm">{item.desc}</p>
                            </div>
                        ))}
                    </div>

                    {/* 華藝搜尋策略 */}
                    <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6">
                        <p className="font-bold text-slate-800 text-lg mb-4 flex items-center gap-2"><BookOpen size={20} className="text-slate-600" /> 華藝搜尋三步驟</p>
                        <div className="space-y-3 text-slate-700">
                            <div className="flex gap-3 items-start"><span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-black shrink-0 mt-0.5">1</span><span className="leading-relaxed"><strong>列出關鍵字</strong>：把題目的核心概念拆開（如「手機使用」「睡眠品質」「高中生」）</span></div>
                            <div className="flex gap-3 items-start"><span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-black shrink-0 mt-0.5">2</span><span className="leading-relaxed"><strong>搜尋 → 加條件</strong>：結果太多就加「台灣」「近 5 年」「碩博士論文」</span></div>
                            <div className="flex gap-3 items-start"><span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-black shrink-0 mt-0.5">3</span><span className="leading-relaxed"><strong>先看標題和摘要</strong>，再決定要不要下載全文</span></div>
                        </div>
                        <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800 flex items-start gap-2">
                            <AlertTriangle size={18} className="shrink-0 mt-0.5" />
                            <p><strong>注意：</strong>關鍵字不要太具體！不要搜「松山高中」，改搜「高中生」。太具體找不到，太廣泛結果太多——兩者都要用進階搜尋來平衡。</p>
                        </div>
                    </div>

                    {/* 實作練習 */}
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* 左：我的搜巡記錄 */}
                        <div className="space-y-4">
                            <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                                <PenTool size={20} className="text-blue-600" /> 我的搜尋記錄
                            </h3>
                            <div>
                                <label className="text-sm text-slate-600 font-bold mb-1 block">我的研究題目</label>
                                <input
                                    className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-400 transition-all shadow-sm"
                                    placeholder="輸入你的研究題目..."
                                    value={myTopic}
                                    onChange={e => setMyTopic(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="text-sm text-slate-600 font-bold mb-1 block">我的關鍵字（至少 3 個）</label>
                                <input
                                    className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-400 transition-all shadow-sm"
                                    placeholder="例：手機使用 / 睡眠品質 / 高中生"
                                    value={searchKeywords}
                                    onChange={e => setSearchKeywords(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="text-sm text-slate-600 font-bold mb-1 block">找到的相關研究（標題 + 作者 + 年份）</label>
                                <textarea
                                    className="w-full border border-slate-300 rounded-xl p-4 text-sm focus:ring-2 focus:ring-blue-400 transition-all min-h-[100px] shadow-sm"
                                    placeholder="標題：__________________&#10;作者：_____ 年份：_____"
                                    value={foundPaper}
                                    onChange={e => setFoundPaper(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* 右：AI 關鍵字生成 */}
                        <div className="space-y-4">
                            <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                                <Bot size={20} className="text-blue-600" /> AI 關鍵字生成助手
                            </h3>
                            <p className="text-sm text-slate-600">讓 AI 幫你想出更多中英文關鍵字，突破搜尋瓶頸。</p>
                            <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 shadow-inner">
                                <PromptBox>{keywordPrompt}</PromptBox>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section 1: Concept 1 */}
            <section className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 md:p-8 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 border-b-2 border-slate-100 pb-4 mb-6">
                    <div className="p-2 bg-amber-600 rounded-xl text-white shadow-sm">
                        <ShieldAlert size={24} />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800">觀念一：避免「無意抄襲」與「換字抄襲」</h2>
                </div>
                <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed space-y-4">
                    <p className="text-lg">在學術寫作中，<strong>引用 (Citation)</strong> 是為了區分「別人的貢獻」與「你的原創」。</p>
                    <div className="grid md:grid-cols-3 gap-6 mt-6">
                        <div className="bg-rose-50 p-6 rounded-2xl border border-rose-100 hover:-translate-y-1 transition-transform">
                            <span className="font-bold text-rose-700 block mb-3 text-lg flex items-center gap-2">
                                <AlertTriangle size={20} /> 無意抄襲
                            </span>
                            <p className="text-sm text-rose-900/80">因為粗心忘記標註來源，即便不是故意的，客觀上仍構成抄襲。</p>
                        </div>
                        <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100 hover:-translate-y-1 transition-transform">
                            <span className="font-bold text-amber-700 block mb-3 text-lg flex items-center gap-2">
                                <AlertTriangle size={20} /> 換字抄襲 (Patchwriting)
                            </span>
                            <p className="text-sm text-amber-900/80">只把「使用」改成「應用」、「因此」改成「所以」，但<strong>句型結構完全沒變</strong>。</p>
                        </div>
                        <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100 hover:-translate-y-1 transition-transform">
                            <span className="font-bold text-emerald-700 block mb-3 text-lg flex items-center gap-2">
                                <CheckCircle size={20} /> 正確的改寫 (Paraphrasing)
                            </span>
                            <p className="text-sm text-emerald-900/80">消化吸收後，用自己的句型與語言重述，保留原意但表達方式完全不同。</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Practical Exercise 1 */}
            <section className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl shadow-md border border-slate-700 p-6 md:p-8 text-white mt-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500 rounded-full blur-[100px] opacity-10"></div>
                <div className="relative z-10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-amber-500 rounded-xl text-slate-900 shadow-sm font-black flex items-center justify-center w-10 h-10 shrink-0">
                                1
                            </div>
                            <h2 className="text-2xl font-bold text-amber-400">實戰特訓 1：改寫偵錯</h2>
                        </div>
                        <div className="bg-slate-800 border border-slate-600 text-slate-300 px-4 py-2 rounded-full text-sm flex items-center gap-2">
                            <FileSearch size={16} className="text-amber-400" /> 搭配紙本學習單作答
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-700">
                            <h4 className="text-amber-300 font-bold mb-4 flex items-center gap-2"><FileText size={18} /> 【案發情境】</h4>
                            <p className="text-slate-300 mb-6">下列是一位同學的改寫紀錄，請以特務的眼光判斷他是否犯了「換字抄襲」的錯誤。</p>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="bg-slate-800 p-5 rounded-xl border-l-4 border-slate-500 relative shadow-lg">
                                    <span className="absolute -top-3 left-4 bg-slate-700 text-slate-300 text-xs px-2 py-1 rounded-md font-bold">原始文獻 (王研究員, 2024)</span>
                                    <p className="text-slate-200 mt-2 leading-relaxed">「中等強度的有氧運動能促進大腦海馬迴的血液循環，進而提升短期記憶的固化效率，對準備大考的學生有顯著幫助。」</p>
                                </div>
                                <div className="bg-slate-800 p-5 rounded-xl border-l-4 border-rose-500 relative shadow-lg">
                                    <span className="absolute -top-3 left-4 bg-rose-900 text-rose-300 text-xs px-2 py-1 rounded-md font-bold">某位學生的改寫</span>
                                    <p className="text-slate-200 mt-2 leading-relaxed">中等程度的有氧運動可以增加大腦海馬迴的血液流動，進而提高短暫記憶的儲存效率，對準備重要考試的同學有明顯幫助。(王研究員, 2024)</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-[1px] rounded-2xl">
                            <div className="bg-slate-900 text-white p-6 rounded-2xl">
                                <h4 className="font-bold text-amber-400 mb-3 flex items-center gap-2 text-lg">
                                    <PenTool size={20} /> 特務行動指示
                                </h4>
                                <p className="text-slate-300 leading-relaxed mb-4">
                                    請拿出你的<strong>紙本學習單</strong>（實戰演練 1），完成以下兩項任務：
                                </p>
                                <ul className="list-disc pl-6 space-y-3 text-slate-100 font-medium tracking-wide">
                                    <li>指出這位學生的改寫有什麼破綻？盲點在哪裡？</li>
                                    <li>請親自示範一次真正的改寫，用你自己的話重述這段概念。</li>
                                </ul>

                                <div className="mt-8 pt-6 border-t border-slate-700/50">
                                    <details className="group marker:content-['']">
                                        <summary className="cursor-pointer text-amber-400 font-bold flex items-center gap-2 outline-none hover:text-amber-300 transition-colors w-max select-none">
                                            <CheckCircle size={18} /> 點擊查看參考解答
                                        </summary>
                                        <div className="mt-4 space-y-3 pl-7">
                                            <p className="text-sm text-slate-300 leading-relaxed">
                                                <strong className="text-rose-400">破綻：</strong> 這是典型的「換字抄襲」！學生只是把「強度」換成「程度」、「促進」換成「增加」、「短期記憶」換成「短暫記憶」，整體句型結構完全沒有自己消化過。
                                            </p>
                                            <p className="text-sm text-emerald-300 leading-relaxed">
                                                <strong className="text-emerald-400">示範改寫：</strong> 王研究員 (2024) 指出，面臨大考壓力的學生如果能維持適度的有氧運動，將有助於促進大腦血液循環，從而增強短期記憶的學習成效。
                                            </p>
                                        </div>
                                    </details>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Concept 2 */}
            <section className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 md:p-8 hover:shadow-md transition-shadow mt-8">
                <div className="flex items-center gap-3 border-b-2 border-slate-100 pb-4 mb-6">
                    <div className="p-2 bg-emerald-600 rounded-xl text-white shadow-sm">
                        <BookOpen size={24} />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800">觀念二：直接引用與「三明治寫作法」</h2>
                </div>
                <div className="text-slate-700 leading-relaxed space-y-6">
                    <p className="text-lg">當原文是定義、法律條文、權威名言或數據時，我們通常會選擇<strong>「直接引用」</strong>（全文照抄並加引號）。<br />但直接引用不能硬生生地丟進文章裡，必須用<strong>三明治法</strong>包裹起來，讓上下文通順：</p>

                    <div className="max-w-2xl mx-auto bg-slate-50 p-8 rounded-3xl border border-slate-200 space-y-6 relative mt-8">
                        <div className="absolute left-10 top-12 bottom-12 w-1.5 bg-amber-200 rounded-full hidden md:block"></div>

                        <div className="md:pl-16 relative">
                            <span className="absolute left-[-2rem] top-1/2 -translate-y-1/2 text-4xl hidden md:block">🍞</span>
                            <div className="bg-white p-5 rounded-2xl border border-amber-200 shadow-sm hover:shadow-md transition-shadow">
                                <h4 className="font-bold text-amber-800 text-lg mb-2 flex items-center gap-2">上層麵包 <span className="text-sm font-normal text-amber-600 bg-amber-50 px-2 py-0.5 rounded">(引入)</span></h4>
                                <p className="text-slate-600">介紹這句話是誰說的，或是這句話出現的時空背景。</p>
                            </div>
                        </div>

                        <div className="md:pl-16 relative">
                            <span className="absolute left-[-2rem] top-1/2 -translate-y-1/2 text-4xl hidden md:block">🥩</span>
                            <div className="bg-white p-5 rounded-2xl border border-rose-200 shadow-sm hover:shadow-md transition-shadow">
                                <h4 className="font-bold text-rose-800 text-lg mb-2 flex items-center gap-2">中間內餡 <span className="text-sm font-normal text-rose-600 bg-rose-50 px-2 py-0.5 rounded">(引用)</span></h4>
                                <p className="text-slate-600">放入引用的內容正文 <strong className="text-rose-600">(記得一定要加引號)</strong>。</p>
                            </div>
                        </div>

                        <div className="md:pl-16 relative">
                            <span className="absolute left-[-2rem] top-1/2 -translate-y-1/2 text-4xl hidden md:block">🍞</span>
                            <div className="bg-white p-5 rounded-2xl border border-amber-200 shadow-sm hover:shadow-md transition-shadow">
                                <h4 className="font-bold text-amber-800 text-lg mb-2 flex items-center gap-2">下層麵包 <span className="text-sm font-normal text-amber-600 bg-amber-50 px-2 py-0.5 rounded">(解釋)</span></h4>
                                <p className="text-slate-600">解釋這句話對你的研究有什麼實質意義，或是帶出你的論點。</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Practical Exercise 2 */}
            <section className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl shadow-md border border-slate-700 p-6 md:p-8 text-white mt-8 relative overflow-hidden">
                <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-emerald-500 rounded-full blur-[100px] opacity-10"></div>
                <div className="relative z-10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-emerald-500 rounded-xl text-slate-900 shadow-sm font-black flex items-center justify-center w-10 h-10 shrink-0">
                                2
                            </div>
                            <h2 className="text-2xl font-bold text-emerald-400">實戰特訓 2：組合三明治</h2>
                        </div>
                        <div className="bg-slate-800 border border-slate-600 text-slate-300 px-4 py-2 rounded-full text-sm flex items-center gap-2">
                            <FileSearch size={16} className="text-emerald-400" /> 搭配紙本學習單作答
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-700">
                            <h4 className="text-emerald-300 font-bold mb-4 flex items-center gap-2"><Info size={18} /> 【案發情境】</h4>
                            <p className="text-slate-300 mb-4">請將下列名言引用到一篇關於「數位時代的學習專注力」的文章中。</p>
                            <div className="bg-slate-800 p-5 rounded-xl border-l-4 border-emerald-500 relative shadow-lg">
                                <span className="absolute -top-3 left-4 bg-emerald-900 text-emerald-300 text-xs px-2 py-1 rounded-md font-bold">重要證物 (來源：認知學者 Dr. Miller, 2022)</span>
                                <p className="text-slate-200 mt-2 italic text-lg leading-relaxed">
                                    「人類大腦在進行數位多工處理時，實際上是在不同任務間快速切換注意力，這不僅會消耗更多認知資源，還會使錯誤率大幅上升。」
                                </p>
                            </div>
                        </div>

                        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-[1px] rounded-2xl">
                            <div className="bg-slate-900 text-white p-6 rounded-2xl">
                                <div className="flex flex-col md:flex-row gap-6 items-start">
                                    <div className="flex-1">
                                        <h4 className="font-bold text-emerald-400 mb-3 flex items-center gap-2 text-lg">
                                            <PenTool size={20} /> 特務行動指示
                                        </h4>
                                        <p className="text-slate-300 leading-relaxed mb-4 tracking-wide">
                                            請在你的<strong>紙本學習單</strong>（實戰演練 2）上作答。運用三明治法則，將長官給的「重要證物」完美地融入你的情報分析報告中。
                                        </p>
                                    </div>
                                    <div className="bg-slate-800 border border-emerald-900/50 p-5 rounded-xl md:w-72 shrink-0 shadow-inner">
                                        <span className="block mb-3 font-bold text-emerald-400 text-sm">💡 破案步驟拆解：</span>
                                        <ul className="space-y-3 text-sm text-slate-300">
                                            <li className="flex gap-3 items-start"><span className="text-amber-500 text-lg">🍞</span> <span className="pt-0.5">先點出一般人對多工處理的迷思</span></li>
                                            <li className="flex gap-3 items-start"><span className="text-rose-500 text-lg">🥩</span> <span className="pt-0.5">引用 Miller 的觀點 <strong className="text-rose-300">(加引號)</strong></span></li>
                                            <li className="flex gap-3 items-start"><span className="text-amber-500 text-lg">🍞</span> <span className="pt-0.5">總結這對深度學習習慣的啟示</span></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-slate-700/50">
                                <details className="group marker:content-['']">
                                    <summary className="cursor-pointer text-emerald-400 font-bold flex items-center gap-2 outline-none hover:text-emerald-300 transition-colors w-max select-none">
                                        <CheckCircle size={18} /> 點擊查看參考解答
                                    </summary>
                                    <div className="mt-4 space-y-4 pl-7 text-sm">
                                        <p className="text-slate-300 leading-relaxed flex gap-2">
                                            <span className="text-amber-500 text-base">🍞</span> <span>許多高中生在讀書時喜歡同時聽音樂、回訊息，認為自己擅長多工處理，但大腦科學未必支持這種策略。</span>
                                        </p>
                                        <p className="text-slate-300 leading-relaxed flex gap-2">
                                            <span className="text-rose-500 text-base">🥩</span> <span>根據認知學者 Dr. Miller (2022) 所述：「人類大腦在進行數位多工處理時，實際上是在不同任務間快速切換注意力，這不僅會消耗更多認知資源，還會使錯誤率大幅上升。」</span>
                                        </p>
                                        <p className="text-slate-300 leading-relaxed flex gap-2">
                                            <span className="text-amber-500 text-base">🍞</span> <span>這意味著，如果我們希望在專題研究中產出高品質的思路，就必須刻意放下手機，建立排除數位干擾的深度工作時間。</span>
                                        </p>
                                    </div>
                                </details>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="grid md:grid-cols-2 gap-8 mt-8">
                {/* 補充1 */}
                <section className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 hover:shadow-md transition-shadow">
                    <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <span className="text-blue-500">ℹ️</span> 【補充 1】引註格式規範
                    </h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 text-slate-600 border-b-2 border-slate-200">
                                    <th className="p-3 font-bold">引註類型</th>
                                    <th className="p-3 font-bold">格式</th>
                                    <th className="p-3 font-bold">範例</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                <tr>
                                    <td className="p-3 font-medium text-slate-800 border-b border-slate-50">句尾引用</td>
                                    <td className="p-3 text-slate-600 border-b border-slate-50">內容... (作者, 年份)。</td>
                                    <td className="p-3 text-slate-600 border-b border-slate-50">造成壓力 (王大明, 2023)。</td>
                                </tr>
                                <tr>
                                    <td className="p-3 font-medium text-slate-800 border-b border-slate-50">句首引用</td>
                                    <td className="p-3 text-slate-600 border-b border-slate-50">根據作者 (年份) 的研究...</td>
                                    <td className="p-3 text-slate-600 border-b border-slate-50">根據王大明 (2023) 提出...</td>
                                </tr>
                                <tr>
                                    <td className="p-3 font-medium text-slate-800">機構作者</td>
                                    <td className="p-3 text-slate-600">一次：全稱<br />二次：簡稱</td>
                                    <td className="p-3 text-slate-600">(衛生福利部, 2024)<br />(衛福部, 2024)</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* References */}
                <section className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 hover:shadow-md transition-shadow">
                    <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <BookOpen size={20} className="text-blue-600" /> 參考文獻 (References)
                    </h3>
                    <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                        位於報告的最後一部分，需列出文中所有引用過的資料，並依特定學術格式排列。
                    </p>
                    <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl flex items-start gap-3">
                        <div className="text-indigo-600 mt-0.5">💡</div>
                        <p className="text-sm text-indigo-900 font-medium leading-relaxed">
                            <span className="font-bold">局長提醒：</span>文中有引用的，參考文獻名單中一定要列出；相對的，如果在內文中沒引用，就絕對不要塞進參考名單充數。
                        </p>
                    </div>
                </section>
            </div>

            {/* Concept 3 */}
            <section className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 md:p-8 hover:shadow-md transition-shadow mt-8">
                <div className="flex items-center gap-3 border-b-2 border-slate-100 pb-4 mb-6">
                    <div className="p-2 bg-blue-600 rounded-xl text-white shadow-sm">
                        <BookOpen size={24} />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800">觀念三：多重文獻綜合</h2>
                </div>
                <div className="text-slate-700 leading-relaxed max-w-3xl space-y-4">
                    <p className="text-lg">在小論文中，我們很少只引用單一一篇資料。通常需要將不同來源（甚至觀點相反）的資料<strong>整合在同一個段落中</strong>，以展現你的綜合分析能力。</p>
                </div>
            </section>

            {/* Practical Exercise 3 */}
            <section className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl shadow-md border border-slate-700 p-6 md:p-8 text-white mt-8 mb-8 relative overflow-hidden">
                <div className="absolute top-1/2 right-1/2 w-96 h-96 bg-blue-500 rounded-full blur-[120px] opacity-10 translate-x-1/2 -translate-y-1/2"></div>
                <div className="relative z-10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-500 rounded-xl text-white shadow-sm font-black flex items-center justify-center w-10 h-10 shrink-0">
                                3
                            </div>
                            <h2 className="text-2xl font-bold text-blue-400">實戰特訓 3：情報綜合分析</h2>
                        </div>
                        <div className="bg-slate-800 border border-slate-600 text-slate-300 px-4 py-2 rounded-full text-sm flex items-center gap-2">
                            <FileSearch size={16} className="text-blue-400" /> 搭配紙本學習單作答
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-700">
                            <h4 className="text-blue-300 font-bold mb-4 flex items-center gap-2"><Info size={18} /> 【案發情境】</h4>
                            <p className="text-slate-300 mb-6">探員，我們收到了兩份觀點不同的情報，關於「高中生是否適合使用生成式 AI 輔助學習」。請綜合分析它們。</p>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="bg-slate-800 p-5 rounded-xl border-t-4 border-indigo-500 relative shadow-lg">
                                    <div className="absolute top-0 right-0 p-2 opacity-10 text-6xl font-black italic">A</div>
                                    <span className="inline-block bg-indigo-900 text-indigo-300 text-xs px-2 py-1 rounded font-bold mb-3">檔案 A (科技教育學會, 2023)</span>
                                    <p className="text-slate-200 leading-relaxed relative z-10">「生成式 AI 能快速提供思路框架與資料統整，大幅縮短學生在專題初期的摸索時間，是極佳的腦力激盪夥伴。」</p>
                                </div>
                                <div className="bg-slate-800 p-5 rounded-xl border-t-4 border-rose-500 relative shadow-lg">
                                    <div className="absolute top-0 right-0 p-2 opacity-10 text-6xl font-black italic">B</div>
                                    <span className="inline-block bg-rose-900 text-rose-300 text-xs px-2 py-1 rounded font-bold mb-3">檔案 B (高教研究中心, 2024)</span>
                                    <p className="text-slate-200 leading-relaxed relative z-10">「過度依賴 AI 直接生成文本的學生，其批判性思維與邏輯推理能力在一年後出現顯著衰退的現象。」</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-[1px] rounded-2xl">
                            <div className="bg-slate-900 text-white p-6 rounded-2xl">
                                <div className="flex flex-col md:flex-row gap-6 items-start">
                                    <div className="flex-1">
                                        <h4 className="font-bold text-blue-400 mb-3 flex items-center gap-2 text-lg">
                                            <PenTool size={20} /> 最終考核任務
                                        </h4>
                                        <p className="text-slate-300 leading-relaxed tracking-wide">
                                            請在<strong>紙本學習單</strong>（實戰演練 3）上，寫下一段約 50-80 字的短文。綜合考量這兩份情報，產出一份客觀的最終結論報告。
                                        </p>
                                    </div>
                                    <div className="bg-slate-800 border border-blue-900/50 p-5 rounded-xl md:w-72 shrink-0 shadow-inner">
                                        <span className="block mb-3 font-bold text-blue-400 text-sm">🏅 總部評分標準：</span>
                                        <ul className="space-y-3 text-sm text-slate-300">
                                            <li className="flex gap-2 items-start"><CheckCircle size={16} className="text-emerald-500 shrink-0 mt-0.5" /> <span>同時提及正反面觀點</span></li>
                                            <li className="flex gap-2 items-start"><CheckCircle size={16} className="text-emerald-500 shrink-0 mt-0.5" /> <span>正確標註兩處情報出處</span></li>
                                            <li className="flex gap-2 items-start"><CheckCircle size={16} className="text-emerald-500 shrink-0 mt-0.5" /> <span>提出個人見解或平衡建議</span></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-slate-700/50">
                                <details className="group marker:content-['']">
                                    <summary className="cursor-pointer text-blue-400 font-bold flex items-center gap-2 outline-none hover:text-blue-300 transition-colors w-max select-none">
                                        <CheckCircle size={18} /> 點擊查看參考解答
                                    </summary>
                                    <div className="mt-4 pl-7 text-sm">
                                        <p className="text-slate-300 leading-relaxed">
                                            關於高中生使用生成式 AI 輔助學習，各方存在不同建議。科技教育學會 (2023) 肯定其作為「腦力激盪夥伴」的價值，能有效協助學生突破研究初期的瓶頸；然而，高教研究中心 (2024) 則提出警告，指出過度依賴 AI 直接生成內容會削弱學生的批判與邏輯思維。綜合兩者觀點，學生應將 AI 視為協助「發想」與「框架統整」的工具，而非代替自己思考與寫作的代筆者，方能在享受科技便利的同時確保自身素養的提升。
                                        </p>
                                    </div>
                                </details>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};
