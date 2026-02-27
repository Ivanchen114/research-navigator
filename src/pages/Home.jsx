import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Search, BrainCircuit, BarChart2, ArrowRight, BookOpen, Users, Gamepad2 } from 'lucide-react';

export const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* Hero Section */}
            <section className="text-center py-12 md:py-20 space-y-6">
                <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-2xl mb-4">
                    <BrainCircuit className="w-12 h-12 text-blue-600" />
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
                    從發現問題到數據分析<br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                        AI 陪你做研究
                    </span>
                </h1>
                <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto">
                    這不是一個幫你寫作業的工具，而是一個專屬你的「研究教練」。
                    讓我們透過人機協作，把複雜的研究方法變得像通關遊戲一樣簡單！
                </p>
            </section>

            {/* Choose Your Path Section */}
            <section>
                <h2 className="text-2xl font-bold text-center text-slate-800 mb-8">
                    你現在的研究進度在哪裡？
                </h2>

                <div className="grid md:grid-cols-2 gap-6">

                    {/* Path 1: Idea Generation & Method Selection */}
                    <Card className="hover:shadow-lg transition-shadow duration-300 border-2 border-transparent hover:border-blue-100 cursor-pointer group" onClick={() => navigate('/discovery')}>
                        <CardContent className="p-8 flex flex-col items-center text-center space-y-4 h-full">
                            <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center transform group-hover:scale-110 transition-transform">
                                <Search size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800">
                                第一步：發掘問題 (W0-W2)
                            </h3>
                            <p className="text-slate-600 flex-1">
                                「我還沒有題目...」或「我的問題好像太大太廢話...」<br />
                                沒關係，來這裡用<strong>發掘問題筆記本</strong>幫你的現象找落差！
                            </p>
                            <Button
                                variant="outline"
                                className="w-full mt-4 group-hover:bg-blue-600 group-hover:text-white border-blue-600"
                            >
                                進入問題發掘所 <ArrowRight size={16} className="ml-2" />
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Path 2: Data Analysis */}
                    <Card className="hover:shadow-lg transition-shadow duration-300 border-2 border-transparent hover:border-indigo-100 cursor-pointer group" onClick={() => navigate('/analysis')}>
                        <CardContent className="p-8 flex flex-col items-center text-center space-y-4 h-full">
                            <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center transform group-hover:scale-110 transition-transform">
                                <BarChart2 size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800">
                                已蒐集資料，準備分析
                            </h3>
                            <p className="text-slate-600 flex-1">
                                「我有問卷數據/訪談稿了，接下來救命啊...」<br />
                                來這裡，學習如何正確使用 AI 下指令，產出精美圖表與洞察。
                            </p>
                            <Button
                                variant="outline"
                                className="w-full mt-4 group-hover:bg-indigo-600 group-hover:text-white border-indigo-600 text-indigo-600 hover:bg-indigo-50 focus:ring-indigo-500"
                            >
                                進入數據分析模組 <ArrowRight size={16} className="ml-2" />
                            </Button>
                        </CardContent>
                    </Card>

                </div>
            </section>

            {/* Additional Modules Section */}
            <section>
                <h2 className="text-2xl font-bold text-center text-slate-800 mb-8">
                    更多學習模組
                </h2>
                <div className="grid md:grid-cols-4 gap-4">
                    <Card className="hover:shadow-lg transition-shadow duration-300 cursor-pointer group" onClick={() => navigate('/literature-review')}>
                        <CardContent className="p-6 flex flex-col items-center text-center space-y-3">
                            <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center transform group-hover:scale-110 transition-transform">
                                <BookOpen size={24} />
                            </div>
                            <h3 className="text-base font-bold text-slate-800">文獻鑑識 (W6)</h3>
                            <p className="text-sm text-slate-500">學會辨別資料可信度、避免孤兒引用與換字抄襲。</p>
                        </CardContent>
                    </Card>
                    <Card className="hover:shadow-lg transition-shadow duration-300 cursor-pointer group" onClick={() => navigate('/team-formation')}>
                        <CardContent className="p-6 flex flex-col items-center text-center space-y-3">
                            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center transform group-hover:scale-110 transition-transform">
                                <Users size={24} />
                            </div>
                            <h3 className="text-base font-bold text-slate-800">組隊決策 (W7)</h3>
                            <p className="text-sm text-slate-500">找到能力互補的夥伴，或是宣告成為 Solo 極客。</p>
                        </CardContent>
                    </Card>
                    <Card className="hover:shadow-lg transition-shadow duration-300 cursor-pointer group" onClick={() => navigate('/game/tool-quiz')}>
                        <CardContent className="p-6 flex flex-col items-center text-center space-y-3">
                            <div className="w-12 h-12 bg-slate-200 text-slate-700 rounded-full flex items-center justify-center transform group-hover:scale-110 transition-transform">
                                <Gamepad2 size={24} />
                            </div>
                            <h3 className="text-base font-bold text-slate-800">辦案工具大考驗</h3>
                            <p className="text-sm text-slate-500">11 道委託案件，測試你的研究方法判斷力！</p>
                        </CardContent>
                    </Card>
                    <Card className="hover:shadow-lg transition-shadow duration-300 cursor-pointer group" onClick={() => navigate('/game/citation-detective')}>
                        <CardContent className="p-6 flex flex-col items-center text-center space-y-3">
                            <div className="w-12 h-12 bg-stone-200 text-stone-700 rounded-full flex items-center justify-center transform group-hover:scale-110 transition-transform">
                                <Search size={24} />
                            </div>
                            <h3 className="text-base font-bold text-slate-800">文獻偵探社</h3>
                            <p className="text-sm text-slate-500">限時破案！判斷引用的合法性與常見違規。</p>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* AI-RED Ethical Guide */}
            <section className="mt-16 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 -mt-16 -mr-16 text-slate-700 opacity-50">
                    <BrainCircuit size={200} />
                </div>
                <div className="relative z-10">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                        <span className="bg-emerald-500 text-white p-2 rounded-lg text-sm">協作法則</span>
                        牢記 AI-RED 五大原則
                    </h2>
                    <p className="text-slate-300 mb-8 max-w-2xl">
                        AI 是你的「研究助理」，不是你的「代筆者」。在使用本網站工具前，請承諾遵守以下準則：
                    </p>

                    <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
                        <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700">
                            <div className="font-bold text-emerald-400 text-lg mb-1">Ascribe</div>
                            <div className="text-sm font-medium text-white mb-2">誠實歸屬</div>
                            <div className="text-xs text-slate-400">在報告中標示使用 AI 輔助。</div>
                        </div>
                        <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700">
                            <div className="font-bold text-emerald-400 text-lg mb-1">Inquire</div>
                            <div className="text-sm font-medium text-white mb-2">引導探詢</div>
                            <div className="text-xs text-slate-400">分段下指令，而非一次丟給 AI。</div>
                        </div>
                        <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700">
                            <div className="font-bold text-emerald-400 text-lg mb-1">Reference</div>
                            <div className="text-sm font-medium text-white mb-2">保存參照</div>
                            <div className="text-xs text-slate-400">留存與 AI 的對話紀錄截圖。</div>
                        </div>
                        <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700">
                            <div className="font-bold text-emerald-400 text-lg mb-1">Evaluate</div>
                            <div className="text-sm font-medium text-white mb-2">批判評估</div>
                            <div className="text-xs text-slate-400">驗證 AI 給的數據，不照單全收。</div>
                        </div>
                        <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700">
                            <div className="font-bold text-emerald-400 text-lg mb-1">Document</div>
                            <div className="text-sm font-medium text-white mb-2">詳實紀錄</div>
                            <div className="text-xs text-slate-400">紀錄你如何「修正」AI 的建議。</div>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
};
