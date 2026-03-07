import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Eye, BrainCircuit, ArrowRight, Map } from 'lucide-react';
import LessonMap from '../components/ui/LessonMap';
import { W0Data } from '../data/lessonMaps';

export const Discovery = () => {
    const [showLessonMap, setShowLessonMap] = useState(false);

    return (
        <div className="max-w-5xl mx-auto px-6 lg:px-12 py-8 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 font-['Noto_Sans_TC',sans-serif] text-[14px] leading-[1.6] text-[#1a1a2e]">

            {/* ===== Lesson Map Toggle (Teacher Only) ===== */}
            <div className="flex justify-end pt-2 pb-0 -mb-8 relative z-20">
                <button
                    onClick={() => setShowLessonMap(!showLessonMap)}
                    className="flex items-center gap-1.5 text-[11px] text-[#8888aa] hover:text-[#2d5be3] transition-colors opacity-60 hover:opacity-100 font-['DM_Mono',monospace]"
                    title="教師專用：顯示課程地圖"
                >
                    <Map size={12} />
                    {showLessonMap ? 'Hide Map' : 'Instructor View'}
                </button>
            </div>

            {showLessonMap && (
                <div className="mb-4 animate-in slide-in-from-top-4 duration-300">
                    <LessonMap data={W0Data} />
                </div>
            )}

            {/* Header */}
            <header className="mb-14 pt-8">
                <div className="text-[11px] font-['DM_Mono',monospace] tracking-[0.12em] uppercase text-[#2d5be3] mb-3 flex items-center gap-2">
                    <Search size={14} /> W0 觀察力啟動
                </div>
                <h1 className="font-['Noto_Serif_TC',serif] text-[38px] font-bold leading-[1.25] text-[#1a1a2e] mb-4 tracking-[-0.02em]">
                    第一步：<br className="hidden md:block" />
                    <span className="text-[#2d5be3] font-normal italic">發掘問題</span>
                </h1>
                <p className="text-[15px] text-[#4a4a6a] leading-[1.75] max-w-[560px]">
                    好的研究不是坐在書桌前想出來的，而是從生活中的「不尋常」看出來的。<br />
                    帶上偵探的裝備，我們開始辦案吧！
                </p>
            </header>

            {/* 偵探的三把劍 */}
            <section className="mb-14">
                <div className="flex items-baseline gap-3 mb-6">
                    <h2 className="font-['Noto_Serif_TC',serif] text-[20px] font-bold text-[#1a1a2e] flex items-center gap-2">
                        🗡️ 偵探的三把劍
                    </h2>
                    <div className="text-[13px] text-[#8888aa] font-['DM_Mono',monospace]">
                        W0
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-[1px] bg-[#dddbd5] border border-[#dddbd5] rounded-[10px] overflow-hidden">
                    <div className="bg-white p-[20px_24px] hover:bg-[#f8f7f4] transition-colors flex flex-col">
                        <div className="w-8 h-8 rounded-md border border-[#dddbd5] bg-[#f0ede6] text-[#1a1a2e] flex items-center justify-center mb-4">
                            <Eye size={16} />
                        </div>
                        <h3 className="text-[14px] font-bold text-[#1a1a2e] mb-2">1. 觀察力</h3>
                        <p className="text-[12px] text-[#4a4a6a] leading-[1.55] flex-1">看見別人沒看見的細節。真正的研究者能「看見大猩猩」。</p>
                        <a href="https://youtu.be/IGQmdoK_ZfY?si=DTPHxNBlYX0NYuba" target="_blank" rel="noopener noreferrer"
                            className="mt-4 text-[12px] text-[#2d5be3] hover:underline font-medium inline-flex items-center gap-1 self-start">
                            🎬 看影片：你看見大猩猩了嗎？
                        </a>
                    </div>
                    <div className="bg-white p-[20px_24px] hover:bg-[#f8f7f4] transition-colors flex flex-col">
                        <div className="w-8 h-8 rounded-md border border-[#dddbd5] bg-[#f0ede6] text-[#1a1a2e] flex items-center justify-center mb-4">
                            <Search size={16} />
                        </div>
                        <h3 className="text-[14px] font-bold text-[#1a1a2e] mb-2">2. 假設檢定</h3>
                        <p className="text-[12px] text-[#4a4a6a] leading-[1.55] flex-1">像玩「海龜湯」，先大膽假設，再小心求證。</p>
                        <a href="https://lateralthinkingpuzzles.org/zh-TW" target="_blank" rel="noopener noreferrer"
                            className="mt-4 text-[12px] text-[#2e7d5a] hover:underline font-medium inline-flex items-center gap-1 self-start">
                            🐢 玩海龜湯練習假設思維
                        </a>
                    </div>
                    <div className="bg-white p-[20px_24px] hover:bg-[#f8f7f4] transition-colors flex flex-col">
                        <div className="w-8 h-8 rounded-md border border-[#dddbd5] bg-[#f0ede6] text-[#1a1a2e] flex items-center justify-center mb-4">
                            <BrainCircuit size={16} />
                        </div>
                        <h3 className="text-[14px] font-bold text-[#1a1a2e] mb-2">3. 批判思考</h3>
                        <p className="text-[12px] text-[#4a4a6a] leading-[1.55] flex-1">不盲從權威，識破表面現象背後的矛盾與謊言。</p>
                    </div>
                </div>
            </section>

            {/* 生活觀察種子任務 */}
            <section className="mb-14 border border-[#c9a84c]/30 rounded-[10px] overflow-hidden bg-white">
                <div className="p-[20px_24px] border-b border-[#c9a84c]/30 bg-[#f8f7f4] flex items-center gap-3">
                    <span className="text-[11px] font-['DM_Mono',monospace] bg-[#c9a84c] text-white px-2 py-[3px] rounded tracking-[0.06em]">
                        任務 Task
                    </span>
                    <h2 className="font-bold text-[15px] text-[#1a1a2e] flex items-center gap-2">
                        🌱 今天的任務：種下種子
                    </h2>
                </div>

                <div className="p-[24px]">
                    <p className="text-[14px] text-[#1a1a2e] mb-6 leading-[1.6]">
                        在學習單 Part 0 第 3 題，寫下你的一個「生活觀察」——<br />
                        <strong className="text-[#c9a84c] mt-1 inline-block font-bold">最近有什麼現象讓你感到好奇、奇怪或困擾？</strong>
                    </p>

                    <div className="grid md:grid-cols-2 gap-[1px] bg-[#dddbd5] border border-[#dddbd5] rounded-[6px] overflow-hidden mb-6">
                        <div className="bg-white p-5">
                            <p className="text-[10px] text-[#c9a84c] font-['DM_Mono',monospace] font-bold mb-3 uppercase tracking-[0.1em]">💡 可以這樣觀察</p>
                            <ul className="space-y-3 text-[13px] text-[#4a4a6a] leading-[1.5]">
                                <li className="flex gap-2"><span className="shrink-0 text-[14px]">🏫</span> <span>學校裡：為什麼合作社熱食總是搶不到？</span></li>
                                <li className="flex gap-2"><span className="shrink-0 text-[14px]">👥</span> <span>班級中：為什麼大家都喜歡聚集在走廊？</span></li>
                                <li className="flex gap-2"><span className="shrink-0 text-[14px]">📱</span> <span>日常生活：為什麼某個 app 越用越上癮？</span></li>
                            </ul>
                        </div>
                        <div className="bg-white p-5">
                            <p className="text-[10px] text-[#e32d5b] font-['DM_Mono',monospace] font-bold mb-3 uppercase tracking-[0.1em]">⚠️ 老師的提醒</p>
                            <ul className="space-y-3 text-[13px] text-[#4a4a6a] leading-[1.5]">
                                <li className="flex gap-2"><span className="text-red-500 font-bold shrink-0">✕</span> <span>不要寫「社會問題」（太大，無法研究）</span></li>
                                <li className="flex gap-2"><span className="text-red-500 font-bold shrink-0">✕</span> <span>不要寫「普通常識」（AI 能直接回答的）</span></li>
                                <li className="flex gap-2"><span className="text-[#2e7d5a] font-bold shrink-0">✓</span> <span>要寫「你真的看得見、摸得到」的現象</span></li>
                            </ul>
                        </div>
                    </div>

                    <div className="bg-[#f0ede6] border-l-4 border-[#c9a84c] p-4 text-[13px] text-[#1a1a2e] font-medium leading-[1.5]">
                        📢 這個觀察，下週 W1 上課要用！請認真寫，它是你研究問題的第一顆種子。
                    </div>
                </div>
            </section>

            {/* 本週學習路徑 */}
            <section className="mb-14">
                <div className="flex items-baseline gap-3 mb-6">
                    <h2 className="font-['Noto_Serif_TC',serif] text-[20px] font-bold text-[#1a1a2e]">
                        學習路徑
                    </h2>
                    <div className="text-[13px] text-[#8888aa] font-['DM_Mono',monospace]">
                        W0 → W2
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-[1px] bg-[#dddbd5] border border-[#dddbd5] rounded-[10px] overflow-hidden">
                    {[
                        { step: 'W0', title: '觀察力啟動', desc: '培養看見「不尋常」的眼睛，種下觀察種子', active: true },
                        { step: 'W1', title: '研究啟動 & AI-RED 公約', desc: 'AI 模仿遊戲 + 簽署公約 + 人機協作示範', active: false, path: '/w1' },
                        { step: 'W2', title: '問題意識鍛鍊', desc: '把觀察 → 落差 → 研究問題，AI 健檢你的草稿', active: false, path: '/problem-focus' },
                    ].map((item, i) => (
                        <div key={item.step} className={`p-[20px_24px] flex flex-col transition-colors ${item.active ? 'bg-[#1a1a2e] text-white' : 'bg-white hover:bg-[#f8f7f4]'}`}>
                            <div className={`text-[10px] font-['DM_Mono',monospace] font-bold mb-2 tracking-[0.08em] ${item.active ? 'text-[#e8eeff]' : 'text-[#8888aa]'}`}>
                                {item.step}
                            </div>
                            <div className={`text-[14px] font-bold mb-2 ${item.active ? 'text-white' : 'text-[#1a1a2e]'}`}>
                                {item.title}
                            </div>
                            <p className={`text-[12px] leading-[1.55] flex-1 ${item.active ? 'text-white/80' : 'text-[#4a4a6a]'}`}>
                                {item.desc}
                            </p>
                            {item.path && (
                                <Link to={item.path} className={`mt-4 inline-flex items-center gap-1 text-[12px] font-medium self-end transition-opacity opacity-0 md:opacity-100 ${item.active ? '' : 'group-hover:opacity-100 text-[#2d5be3]'}`}>
                                    前往 <ArrowRight size={14} />
                                </Link>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            {/* Navigation */}
            <div className="flex justify-end pt-4 pb-12">
                <Link to="/w1" className="inline-flex items-center justify-center gap-2 bg-[#1a1a2e] text-white px-[24px] py-[12px] rounded-[6px] text-[14px] font-bold hover:bg-[#2a2a4a] transition-colors border border-transparent">
                    觀察種子種好了，前進 W1 <ArrowRight size={16} />
                </Link>
            </div>

        </div>
    );
};
