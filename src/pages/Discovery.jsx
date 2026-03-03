import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Eye, BrainCircuit, ArrowRight } from 'lucide-react';

export const Discovery = () => {
    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">

            {/* Header */}
            <header className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100 mb-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-40 -translate-y-1/2 translate-x-1/3" />
                <div className="relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100 shadow-sm mb-4">
                        <Search size={16} /> W0 觀察力啟動
                    </div>
                    <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
                        第一步：<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 drop-shadow-sm">發掘問題</span>
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
                        好的研究不是坐在書桌前想出來的，而是從生活中的「不尋常」看出來的。<br />
                        帶上偵探的裝備，我們開始辦案吧！
                    </p>
                </div>
            </header>

            {/* 偵探的三把劍 */}
            <section className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 md:p-8 hover:shadow-md transition-shadow">
                <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                    🗡️ 偵探的三把劍 (W0)
                </h2>
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition flex flex-col">
                        <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
                            <Eye size={24} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800 mb-2">1. 觀察力</h3>
                        <p className="text-sm text-slate-600 flex-1">看見別人沒看見的細節。真正的研究者能「看見大猩猩」。</p>
                        <a href="https://youtu.be/IGQmdoK_ZfY?si=DTPHxNBlYX0NYuba" target="_blank" rel="noopener noreferrer"
                            className="mt-4 inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 hover:underline font-medium">
                            🎬 看影片：你看見大猩猩了嗎？
                        </a>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition flex flex-col">
                        <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                            <Search size={24} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800 mb-2">2. 假設檢定</h3>
                        <p className="text-sm text-slate-600 flex-1">像玩「海龜湯」，先大膽假設，再小心求證。</p>
                        <a href="https://lateralthinkingpuzzles.org/zh-TW" target="_blank" rel="noopener noreferrer"
                            className="mt-4 inline-flex items-center gap-1 text-xs text-emerald-600 hover:text-emerald-800 hover:underline font-medium">
                            🐢 玩海龜湯練習假設思維
                        </a>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition flex flex-col">
                        <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-4">
                            <BrainCircuit size={24} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800 mb-2">3. 批判思考</h3>
                        <p className="text-sm text-slate-600 flex-1">不盲從權威，識破表面現象背後的矛盾與謊言。</p>
                    </div>
                </div>
            </section>

            {/* 生活觀察種子任務 */}
            <section className="bg-amber-50 rounded-3xl border border-amber-200 p-6 md:p-8">
                <h2 className="text-2xl font-bold text-amber-800 mb-4 flex items-center gap-3">
                    🌱 今天的任務：種下種子
                </h2>
                <p className="text-slate-700 mb-4 leading-relaxed">
                    在學習單 Part 0 第 3 題，寫下你的一個「生活觀察」——
                    <strong className="text-amber-800">最近有什麼現象讓你感到好奇、奇怪或困擾？</strong>
                </p>
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div className="bg-white rounded-xl p-4 border border-amber-100 shadow-sm">
                        <p className="text-xs text-amber-600 font-bold mb-2 uppercase tracking-wider">💡 可以這樣觀察</p>
                        <ul className="space-y-2 text-sm text-slate-700">
                            <li>🏫 學校裡：為什麼合作社熱食總是搶不到？</li>
                            <li>👥 班級中：為什麼大家都喜歡聚集在走廊？</li>
                            <li>📱 日常生活：為什麼某個 app 越用越上癮？</li>
                        </ul>
                    </div>
                    <div className="bg-white rounded-xl p-4 border border-amber-100 shadow-sm">
                        <p className="text-xs text-red-600 font-bold mb-2 uppercase tracking-wider">⚠️ 老師的提醒</p>
                        <ul className="space-y-2 text-sm text-slate-700">
                            <li>❌ 不要寫「社會問題」（太大，無法研究）</li>
                            <li>❌ 不要寫「普通常識」（AI 能直接回答的）</li>
                            <li>✅ 要寫「你真的看得見、摸得到」的現象</li>
                        </ul>
                    </div>
                </div>
                <div className="bg-amber-100 rounded-xl p-4 border border-amber-300">
                    <p className="text-amber-900 font-bold text-sm">
                        📢 這個觀察，下週 W1 上課要用！請認真寫，它是你研究問題的第一顆種子。
                    </p>
                </div>
            </section>

            {/* 本週學習路徑 */}
            <section className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 md:p-8">
                <h2 className="text-xl font-bold text-slate-800 mb-5">📍 W0 → W2 學習路徑</h2>
                <div className="flex flex-col md:flex-row items-stretch gap-3">
                    {[
                        { step: 'W0', title: '觀察力啟動', desc: '培養看見「不尋常」的眼睛，種下觀察種子', active: true },
                        { step: 'W1', title: '研究啟動 & AI-RED 公約', desc: 'AI 模仿遊戲 + 簽署公約 + 人機協作示範', active: false, path: '/w1' },
                        { step: 'W2', title: '問題意識鍛鍊', desc: '把觀察 → 落差 → 研究問題，AI 健檢你的草稿', active: false, path: '/problem-focus' },
                    ].map((item, i) => (
                        <React.Fragment key={item.step}>
                            <div className={`flex-1 rounded-xl p-4 border ${item.active ? 'bg-blue-50 border-blue-200' : 'bg-slate-50 border-slate-200'}`}>
                                <div className={`text-xs font-mono font-bold mb-1 ${item.active ? 'text-blue-600' : 'text-slate-400'}`}>{item.step}</div>
                                <div className={`font-bold text-sm mb-1 ${item.active ? 'text-blue-800' : 'text-slate-600'}`}>{item.title}</div>
                                <p className="text-xs text-slate-500">{item.desc}</p>
                                {item.path && (
                                    <Link to={item.path} className="mt-2 inline-flex items-center gap-1 text-xs text-blue-600 hover:underline font-medium">
                                        前往 <ArrowRight size={12} />
                                    </Link>
                                )}
                            </div>
                            {i < 2 && <div className="hidden md:flex items-center text-slate-300 text-2xl">→</div>}
                        </React.Fragment>
                    ))}
                </div>
            </section>

            {/* Navigation */}
            <div className="flex justify-end pt-4 pb-12">
                <Link to="/w1" className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition shadow-md hover:shadow-lg">
                    觀察種子種好了，前進 W1 <ArrowRight size={20} />
                </Link>
            </div>
        </div>
    );
};
