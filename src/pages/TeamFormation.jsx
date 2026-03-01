import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, User, ArrowRight, CheckCircle2, Search } from 'lucide-react';

export const TeamFormation = () => {
    const [teamType, setTeamType] = useState('team'); // 'team' or 'solo'

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">

            {/* Header */}
            <header className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100 mb-8 relative overflow-hidden text-center">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-100 rounded-full blur-3xl opacity-40 -translate-y-1/2 translate-x-1/3" />
                <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 shadow-sm mb-4">
                        <Users size={16} /> W7 核心模組
                    </div>
                    <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600 drop-shadow-sm">組隊決策週 (Research Matchmaking)</span>
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
                        進入方法實作前，確認你的最佳戰友，或是宣示成為極客 (Solo)。
                    </p>
                </div>
            </header>

            {/* Selection Tabs */}
            <div className="flex bg-slate-100 p-1 rounded-xl w-full max-w-md mx-auto">
                <button
                    onClick={() => setTeamType('team')}
                    className={`flex-1 py-3 px-4 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${teamType === 'team' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    <Users size={18} />
                    尋找戰友 (2-4人)
                </button>
                <button
                    onClick={() => setTeamType('solo')}
                    className={`flex-1 py-3 px-4 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${teamType === 'solo' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    <User size={18} />
                    極客行動 (Solo)
                </button>
            </div>

            {/* Conditional Content */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 md:p-8 hover:shadow-md transition-shadow">
                {teamType === 'team' ? (
                    <div className="space-y-6 animate-fade-in">
                        <div className="flex items-start gap-4">
                            <div className="bg-emerald-100 p-3 rounded-full text-emerald-600 shrink-0 hidden md:block">
                                <Search size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-800 mb-2">研究博覽會交流指南</h3>
                                <p className="text-slate-600 mb-4">
                                    先別急著找好朋友一組！利用「研究交流卡」去找尋跟你擁有共同興趣，或是能力互補的人。
                                </p>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl hover:-translate-y-1 transition-transform">
                                        <h4 className="font-bold text-slate-700 mb-3 flex items-center gap-2">
                                            <span className="text-emerald-500"><CheckCircle2 size={16} /></span>
                                            能力互補最重要
                                        </h4>
                                        <ul className="text-sm text-slate-600 space-y-1 pl-6 list-disc">
                                            <li>有人擅長找文獻 (W6)</li>
                                            <li>有人精通數據統整 (Excel)</li>
                                            <li>有人點滿溝通技巧 (訪談)</li>
                                            <li>有人專注美感 (簡報設計)</li>
                                        </ul>
                                    </div>
                                    <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl hover:-translate-y-1 transition-transform">
                                        <h4 className="font-bold text-slate-700 mb-3 flex items-center gap-2">
                                            <span className="text-emerald-500"><CheckCircle2 size={16} /></span>
                                            企劃書檢核清單
                                        </h4>
                                        <ul className="text-sm text-slate-600 space-y-1 pl-6 list-disc">
                                            <li>明確的 1-3 個研究問題</li>
                                            <li>確認要使用的方法 (W5)</li>
                                            <li>整合所有組員的王牌文獻 (W6)</li>
                                            <li>合理的工作分配與進度追蹤</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6 animate-fade-in">
                        <div className="flex items-start gap-4">
                            <div className="bg-blue-100 p-3 rounded-full text-blue-600 shrink-0 hidden md:block">
                                <User size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-800 mb-2">Solo 研究者生存法則</h3>
                                <p className="text-slate-600 mb-4">
                                    選擇一個人做沒有比較輕鬆，但你可以完全掌握自己的節奏。以下是你需要注意的事項：
                                </p>

                                <div className="space-y-4 tracking-wide leading-relaxed">
                                    <div className="bg-blue-50 border-l-4 border-blue-500 p-5 rounded-r-2xl">
                                        <h4 className="font-bold text-blue-900 mb-2">⚖️ 規模控制</h4>
                                        <p className="text-sm text-slate-700">不要選太龐大的題目。例如：問卷 100 份即可，訪談 5 人即可。別把自己累垮。</p>
                                    </div>
                                    <div className="bg-blue-50 border-l-4 border-blue-500 p-5 rounded-r-2xl">
                                        <h4 className="font-bold text-blue-900 mb-2">🆘 主動求援</h4>
                                        <p className="text-sm text-slate-700">你沒有組員可以討論，所以遇到卡關時，必須主動去找老師，或是利用 AI 進行初步除錯。</p>
                                    </div>
                                    <div className="bg-blue-50 border-l-4 border-blue-500 p-5 rounded-r-2xl">
                                        <h4 className="font-bold text-blue-900 mb-2">🛡️ 尋找 Solo 夥伴</h4>
                                        <p className="text-sm text-slate-700">跟班上其他的 Solo 者結盟！雖然題目不同，但在預試問卷、同儕互審時，你們可以互相幫忙。</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Next Step CTA */}
            <div className="mt-8 text-center bg-slate-50 p-8 rounded-3xl border border-slate-200 hover:shadow-md transition-shadow">
                <h3 className="text-xl font-bold text-slate-800 mb-4">組隊完成，準備進入實戰！</h3>
                <p className="text-slate-600 mb-6 leading-relaxed">接下來將依據你們選擇的研究方法（問卷、訪談、實驗、觀察）進行分流訓練。</p>
                <div className="flex justify-center">
                    <Link to="/analysis" className="bg-slate-800 hover:bg-slate-900 text-white px-6 py-3 rounded-lg font-bold text-sm transition-colors flex items-center gap-2">
                        前往數據分析模組
                        <ArrowRight size={16} />
                    </Link>
                </div>
            </div>

        </div>
    );
};
