import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Search, BrainCircuit, BarChart2, ArrowRight, BookOpen, Users, Gamepad2, Navigation2, Stethoscope, Wrench, HeartPulse, Bug, ChartNoAxesCombined, Palette, TrendingUp, Map, Compass, Target, Rocket, Flag } from 'lucide-react';

export const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* Hero Section */}
            <section className="text-center py-12 md:py-20 space-y-6">
                <div className="flex flex-col items-center gap-3 mb-4">
                    <img src="/songshan-logo.svg" alt="松山高中" className="w-16 h-16 bg-white rounded-2xl p-2 shadow-lg" />
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold tracking-wider">
                        松山高中 × 研究方法與專題
                    </span>
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
                    從發現問題到解讀結論<br />
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
                                產出研究結論
                            </h3>
                            <p className="text-slate-600 flex-1">
                                「我有問卷數據/訪談稿了，接下來救命啊...」<br />
                                來這裡，學習如何正確使用 AI 下指令，產出精美圖表與洞察。
                            </p>
                            <Button
                                variant="outline"
                                className="w-full mt-4 group-hover:bg-indigo-600 group-hover:text-white border-indigo-600 text-indigo-600 hover:bg-indigo-50 focus:ring-indigo-500"
                            >
                                進入解讀與結論模組 <ArrowRight size={16} className="ml-2" />
                            </Button>
                        </CardContent>
                    </Card>

                </div>
            </section>

            {/* Course Roadmap Section */}
            <section className="relative max-w-4xl mx-auto py-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                        研究準備地圖 (Course Roadmap)
                    </h2>
                    <p className="text-sm text-slate-500 mt-2">
                        按照週次循序漸進，點擊各階段的卡片以前往對應的學習模組與遊戲。
                    </p>
                </div>

                {/* 垂直時間軸線 */}
                <div className="absolute left-[39px] md:left-16 top-40 bottom-24 w-1 bg-slate-200 rounded-full z-0"></div>

                <div className="space-y-12 relative z-10 pl-[80px] md:pl-36">
                    {/* Phase 1 */}
                    <div className="relative group">
                        <div className="absolute -left-[80px] md:-left-[108px] top-4 w-14 h-14 md:w-20 md:h-20 bg-white rounded-full border-4 border-amber-100 text-amber-500 z-10 shadow-sm group-hover:scale-110 group-hover:border-amber-400 group-hover:shadow-md transition-all flex flex-col items-center justify-center">
                            <Map size={24} className="md:w-8 md:h-8" />
                            <span className="text-[10px] md:text-xs font-bold mt-0.5">Phase 1</span>
                        </div>
                        <Card className="hover:shadow-xl hover:border-amber-200 transition-all duration-300">
                            <CardContent className="p-0">
                                <div className="bg-amber-50 px-5 py-3 border-b border-amber-100 flex items-center">
                                    <h3 className="font-bold text-amber-900 text-lg">
                                        啟航與問題意識 <span className="text-amber-600 font-medium text-sm ml-2">W0-W2</span>
                                    </h3>
                                </div>
                                <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white">
                                    <div className="flex items-start gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 cursor-pointer" onClick={() => navigate('/discovery')}>
                                        <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center shrink-0"><Search size={20} /></div>
                                        <div>
                                            <h4 className="font-bold text-slate-800 text-sm mb-1">發掘問題筆記本</h4>
                                            <p className="text-xs text-slate-500">幫你的現象找落差，鍛鍊問題意識。</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 cursor-pointer" onClick={() => navigate('/game/question-er')}>
                                        <div className="w-10 h-10 bg-red-100 text-red-600 rounded-lg flex items-center justify-center shrink-0"><HeartPulse size={20} /></div>
                                        <div>
                                            <h4 className="font-bold text-slate-800 text-sm mb-1">Level 1：問題急診室</h4>
                                            <p className="text-xs text-slate-500">10個生病的研究問題，你能開立處方嗎？</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Phase 2 */}
                    <div className="relative group">
                        <div className="absolute -left-[80px] md:-left-[108px] top-4 w-14 h-14 md:w-20 md:h-20 bg-white rounded-full border-4 border-blue-100 text-blue-500 z-10 shadow-sm group-hover:scale-110 group-hover:border-blue-400 group-hover:shadow-md transition-all flex flex-col items-center justify-center">
                            <Compass size={24} className="md:w-8 md:h-8" />
                            <span className="text-[10px] md:text-xs font-bold mt-0.5">Phase 2</span>
                        </div>
                        <Card className="hover:shadow-xl hover:border-blue-200 transition-all duration-300">
                            <CardContent className="p-0">
                                <div className="bg-blue-50 px-5 py-3 border-b border-blue-100 flex items-center">
                                    <h3 className="font-bold text-blue-900 text-lg">
                                        方法快篩與文獻回顧 <span className="text-blue-600 font-medium text-sm ml-2">W3-W6</span>
                                    </h3>
                                </div>
                                <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white">
                                    <div className="flex items-start gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 cursor-pointer" onClick={() => navigate('/wizard')}>
                                        <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center shrink-0"><Navigation2 size={20} /></div>
                                        <div>
                                            <h4 className="font-bold text-slate-800 text-sm mb-1">方法快篩 (W3-W4)</h4>
                                            <p className="text-xs text-slate-500">回答三問題，鎖定適合的方法。</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 cursor-pointer" onClick={() => navigate('/game/tool-quiz')}>
                                        <div className="w-10 h-10 bg-slate-200 text-slate-700 rounded-lg flex items-center justify-center shrink-0"><Gamepad2 size={20} /></div>
                                        <div>
                                            <h4 className="font-bold text-slate-800 text-sm mb-1">辦案工具大考驗 (W3-W5)</h4>
                                            <p className="text-xs text-slate-500">11 道委託案件，測試你的判斷力！</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 cursor-pointer" onClick={() => navigate('/clinic')}>
                                        <div className="w-10 h-10 bg-red-100 text-red-600 rounded-lg flex items-center justify-center shrink-0"><Stethoscope size={20} /></div>
                                        <div>
                                            <h4 className="font-bold text-slate-800 text-sm mb-1">研究診所 (W5)</h4>
                                            <p className="text-xs text-slate-500">用分科三問確認選對研究工具。</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 cursor-pointer" onClick={() => navigate('/literature-review')}>
                                        <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center shrink-0"><BookOpen size={20} /></div>
                                        <div>
                                            <h4 className="font-bold text-slate-800 text-sm mb-1">文獻鑑識 (W6)</h4>
                                            <p className="text-xs text-slate-500">學會辨別可信度與避免抄襲。</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 cursor-pointer sm:col-span-2" onClick={() => navigate('/game/citation-detective')}>
                                        <div className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-lg flex items-center justify-center shrink-0"><Search size={20} /></div>
                                        <div>
                                            <h4 className="font-bold text-slate-800 text-sm mb-1">文獻偵探社 (W6)</h4>
                                            <p className="text-xs text-slate-500">限時破案！判斷引用合法性與常見違規。</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Phase 3 */}
                    <div className="relative group">
                        <div className="absolute -left-[80px] md:-left-[108px] top-4 w-14 h-14 md:w-20 md:h-20 bg-white rounded-full border-4 border-emerald-100 text-emerald-500 z-10 shadow-sm group-hover:scale-110 group-hover:border-emerald-400 group-hover:shadow-md transition-all flex flex-col items-center justify-center">
                            <Flag size={24} className="md:w-8 md:h-8" />
                            <span className="text-[10px] md:text-xs font-bold mt-0.5">Phase 3</span>
                        </div>
                        <Card className="hover:shadow-xl hover:border-emerald-200 transition-all duration-300">
                            <CardContent className="p-0">
                                <div className="bg-emerald-50 px-5 py-3 border-b border-emerald-100 flex items-center">
                                    <h3 className="font-bold text-emerald-900 text-lg">
                                        組隊與決策 <span className="text-emerald-600 font-medium text-sm ml-2">W7</span>
                                    </h3>
                                </div>
                                <div className="p-5 grid grid-cols-1 bg-white">
                                    <div className="flex items-start gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 cursor-pointer" onClick={() => navigate('/team-formation')}>
                                        <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center shrink-0"><Users size={20} /></div>
                                        <div>
                                            <h4 className="font-bold text-slate-800 text-sm mb-1">組隊決策指南</h4>
                                            <p className="text-xs text-slate-500">找到能力互補的夥伴，或宣告成為 Solo 極客。</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Phase 4 */}
                    <div className="relative group">
                        <div className="absolute -left-[80px] md:-left-[108px] top-4 w-14 h-14 md:w-20 md:h-20 bg-white rounded-full border-4 border-indigo-100 text-indigo-500 z-10 shadow-sm group-hover:scale-110 group-hover:border-indigo-400 group-hover:shadow-md transition-all flex flex-col items-center justify-center">
                            <Target size={24} className="md:w-8 md:h-8" />
                            <span className="text-[10px] md:text-xs font-bold mt-0.5">Phase 4</span>
                        </div>
                        <Card className="hover:shadow-xl hover:border-indigo-200 transition-all duration-300">
                            <CardContent className="p-0">
                                <div className="bg-indigo-50 px-5 py-3 border-b border-indigo-100 flex items-center">
                                    <h3 className="font-bold text-indigo-900 text-lg">
                                        研究工具設計 <span className="text-indigo-600 font-medium text-sm ml-2">W8-W9</span>
                                    </h3>
                                </div>
                                <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white">
                                    <div className="flex items-start gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 cursor-pointer" onClick={() => navigate('/tool-design')}>
                                        <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center shrink-0"><Wrench size={20} /></div>
                                        <div>
                                            <h4 className="font-bold text-slate-800 text-sm mb-1">工具設計指南</h4>
                                            <p className="text-xs text-slate-500">學會處方診斷三大標準。</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 cursor-pointer" onClick={() => navigate('/game/rx-inspector')}>
                                        <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center shrink-0"><Bug size={20} /></div>
                                        <div>
                                            <h4 className="font-bold text-slate-800 text-sm mb-1">Level 2：處方診斷室</h4>
                                            <p className="text-xs text-slate-500">找出研究工具裡的設計 Bug！</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Phase 5 */}
                    <div className="relative group">
                        <div className="absolute -left-[80px] md:-left-[108px] top-4 w-14 h-14 md:w-20 md:h-20 bg-white rounded-full border-4 border-violet-100 text-violet-500 z-10 shadow-sm group-hover:scale-110 group-hover:border-violet-400 group-hover:shadow-md transition-all flex flex-col items-center justify-center">
                            <Rocket size={24} className="md:w-8 md:h-8" />
                            <span className="text-[10px] md:text-xs font-bold mt-0.5">Phase 5</span>
                        </div>
                        <Card className="hover:shadow-xl hover:border-violet-200 transition-all duration-300">
                            <CardContent className="p-0">
                                <div className="bg-violet-50 px-5 py-3 border-b border-violet-100 flex items-center">
                                    <h3 className="font-bold text-violet-900 text-lg">
                                        數據分析與結論 <span className="text-violet-600 font-medium text-sm ml-2">W10+</span>
                                    </h3>
                                </div>
                                <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white">
                                    <div className="flex items-start gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 cursor-pointer" onClick={() => navigate('/analysis')}>
                                        <div className="w-10 h-10 bg-violet-100 text-violet-600 rounded-lg flex items-center justify-center shrink-0"><BarChart2 size={20} /></div>
                                        <div>
                                            <h4 className="font-bold text-slate-800 text-sm mb-1">解讀與結論大廳</h4>
                                            <p className="text-xs text-slate-500">數據清洗、AI輔助洞察寫作。</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 cursor-pointer" onClick={() => navigate('/chart-selection')}>
                                        <div className="w-10 h-10 bg-sky-100 text-sky-600 rounded-lg flex items-center justify-center shrink-0"><TrendingUp size={20} /></div>
                                        <div>
                                            <h4 className="font-bold text-slate-800 text-sm mb-1">圖表選用原則</h4>
                                            <p className="text-xs text-slate-500">選圖表如選盤子，掌握數據說故事的黃金公式。</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 cursor-pointer" onClick={() => navigate('/game/chart-matcher')}>
                                        <div className="w-10 h-10 bg-fuchsia-100 text-fuchsia-600 rounded-lg flex items-center justify-center shrink-0"><Palette size={20} /></div>
                                        <div>
                                            <h4 className="font-bold text-slate-800 text-sm mb-1">圖表配對師</h4>
                                            <p className="text-xs text-slate-500">什麼數據配什麼圖？幫數據找最佳圖表！</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 cursor-pointer" onClick={() => navigate('/game/data-detective')}>
                                        <div className="w-10 h-10 bg-cyan-100 text-cyan-600 rounded-lg flex items-center justify-center shrink-0"><ChartNoAxesCombined size={20} /></div>
                                        <div>
                                            <h4 className="font-bold text-slate-800 text-sm mb-1">數據偵探</h4>
                                            <p className="text-xs text-slate-500">分辨正確推論和過度解讀！</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

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
