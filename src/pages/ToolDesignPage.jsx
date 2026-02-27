import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Wrench, ArrowRight, AlertTriangle, ShieldCheck, Scale, Heart, CheckCircle2, ClipboardList, Mic, TestTube2, Camera } from 'lucide-react';

const errorTypes = [
    { name: '誘導性提問', desc: '題目已經暗示「正確答案」', consequence: '收到的回答有偏差，不可信', example: '❌「你同意手機會嚴重傷害睡眠嗎？」' },
    { name: '選項不互斥', desc: '選項之間有重疊', consequence: '無法歸類，統計困難', example: '❌ A.0-10分 B.10-20分（10分算哪個？）' },
    { name: '選項不完整', desc: '缺少可能的答案', consequence: '填答者被迫勾選不符合的選項', example: '❌ 只有 A.6小時 B.7小時（5小時或8小時呢？）' },
    { name: '雙重問題', desc: '一題問兩件事', consequence: '不知道受訪者在回答哪個', example: '❌「你覺得校規太多且不合理嗎？」' },
    { name: '假開放真預設', desc: '看似開放的問題，但已暗示答案方向', consequence: '受訪者不會說出真心話', example: '❌「你為什麼覺得高中生都很愛滑手機？」' },
    { name: '社會期許偏誤', desc: '問了讓人「不好意思說實話」的問題', consequence: '數據失真', example: '❌「你有沒有考試作弊過？」' },
];

const xCaseDemo = {
    title: '病例 XQ1',
    purpose: '手機使用與睡眠趨勢調查',
    questions: [
        {
            q: '1. 你同意手機會嚴重傷害睡眠嗎？\n   1非常同意 2同意 3普通 4不同意',
            problem: '誘導性提問',
            detail: '「嚴重傷害」已經預設立場',
            fix: '改為：「你認為手機對睡眠的影響是？」1非常負面 2負面 3沒影響 4正面 5非常正面',
        },
        {
            q: '2. 你睡前滑手機多久？\n   A. 0-10分鐘 B. 10-20分鐘 C. 20-30分鐘',
            problem: '選項不完整',
            detail: '如果滑 30 分鐘以上怎麼辦？',
            fix: '加「D. 30分鐘以上」',
        },
        {
            q: '3. 你最近一週平均睡眠時間？\n   A. 6小時 B. 7小時',
            problem: '選項不完整',
            detail: '如果睡 5 小時或 8 小時怎麼辦？',
            fix: '改為：A. 少於6小時 B. 6-7小時 C. 7-8小時 D. 8小時以上',
        },
    ],
};

export const ToolDesignPage = () => {
    const [showXCase, setShowXCase] = useState(false);
    const [showEthics, setShowEthics] = useState(false);

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">

            {/* Header */}
            <header className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-slate-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-40 -translate-y-1/2 translate-x-1/3"></div>
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-semibold mb-3">
                            <Wrench size={16} /> W8–W9 核心模組
                        </div>
                        <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
                            🔧 工具設計工作坊
                        </h1>
                        <p className="text-slate-600 mt-2 text-lg">
                            Level 2 處方診斷 — 工具設計得好不好？哪裡有毒？怎麼解毒？
                        </p>
                    </div>
                    <div className="shrink-0 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-sm text-amber-800">
                        <strong>前置條件</strong>
                        <p className="text-xs mt-1">W5 掛號判斷 ✅ → W7 已組隊 ✅</p>
                    </div>
                </div>
            </header>

            {/* W5→W8 銜接 */}
            <div className="bg-gradient-to-r from-red-50 to-blue-50 rounded-xl border border-slate-200 p-6 shadow-sm">
                <h2 className="text-lg font-bold text-slate-800 mb-3">從掛號到處方的升級</h2>
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-white rounded-lg p-4 border border-red-100">
                        <span className="font-bold text-red-700 block mb-1">W5 掛號判斷 (Level 1)</span>
                        <p className="text-sm text-slate-600">「該用什麼方法？」</p>
                        <p className="text-xs text-slate-400 mt-1">→ 分科三問 + Y 型病例</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-blue-100">
                        <span className="font-bold text-blue-700 block mb-1">W8 處方判斷 (Level 2) ← 你在這裡</span>
                        <p className="text-sm text-slate-600">「工具設計得好不好？」</p>
                        <p className="text-xs text-slate-400 mt-1">→ 三大標準 + X 型病例 + 錯誤類型卡</p>
                    </div>
                </div>
            </div>

            {/* 處方診斷：壞範例 */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 md:p-8">
                <h2 className="text-xl font-bold text-slate-800 mb-2 flex items-center gap-2">
                    <AlertTriangle className="text-amber-500" size={22} />
                    處方診斷熱身：先看壞範例
                </h2>
                <p className="text-slate-600 text-sm mb-4">
                    在動手設計之前，先來看看「壞掉的工具」長什麼樣！
                </p>

                <button
                    onClick={() => setShowXCase(!showXCase)}
                    className="bg-amber-600 hover:bg-amber-700 text-white px-5 py-2.5 rounded-lg text-sm font-bold transition-colors shadow-sm mb-4"
                >
                    {showXCase ? '收起壞範例' : '🔍 展開病例 XQ1 診斷'}
                </button>

                {showXCase && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                            <h3 className="font-bold text-amber-900 mb-1">【{xCaseDemo.title}】</h3>
                            <p className="text-sm text-amber-800">研究目的：{xCaseDemo.purpose}</p>
                        </div>

                        {xCaseDemo.questions.map((item, idx) => (
                            <div key={idx} className="bg-slate-50 rounded-lg border border-slate-200 p-4 space-y-2">
                                <pre className="text-sm text-slate-700 whitespace-pre-wrap font-sans">{item.q}</pre>
                                <div className="border-t border-slate-200 pt-2 mt-2 space-y-1">
                                    <p className="text-sm">
                                        <span className="font-bold text-red-600">❌ 問題：</span>
                                        <span className="font-semibold text-red-800">{item.problem}</span> — {item.detail}
                                    </p>
                                    <p className="text-sm">
                                        <span className="font-bold text-green-600">✅ 改法：</span>
                                        <span className="text-slate-700">{item.fix}</span>
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* 錯誤類型速查 */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 md:p-8">
                <h2 className="text-xl font-bold text-slate-800 mb-2">🃏 錯誤類型速查卡</h2>
                <p className="text-slate-600 text-sm mb-6">設計工具時旁邊放著這張卡，隨時自我檢查！</p>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {errorTypes.map((err) => (
                        <div key={err.name} className="bg-red-50/60 rounded-lg border border-red-100 p-4 hover:shadow-md transition-shadow">
                            <h4 className="font-bold text-red-800 text-sm mb-1">{err.name}</h4>
                            <p className="text-xs text-slate-600 mb-2">{err.desc}</p>
                            <p className="text-xs text-red-600 mb-2">⚠️ 後果：{err.consequence}</p>
                            <div className="bg-white rounded p-2 text-xs text-slate-500 border border-red-50">
                                {err.example}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 好工具三大標準 */}
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl shadow-sm border border-emerald-100 p-6 md:p-8">
                <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <ShieldCheck className="text-emerald-600" size={24} />
                    好工具的三大標準
                </h2>

                <div className="grid md:grid-cols-3 gap-6">
                    {/* 有效性 */}
                    <div className="bg-white rounded-xl p-5 shadow-sm border border-emerald-100">
                        <div className="text-3xl mb-3">🎯</div>
                        <h3 className="text-lg font-bold text-emerald-800 mb-2">有效性 (Validity)</h3>
                        <p className="text-sm text-slate-600 mb-3">能測到你想測的東西</p>
                        <div className="space-y-2 text-sm">
                            <div className="bg-red-50 p-2 rounded border border-red-100">
                                <span className="text-red-600 font-bold text-xs">❌ 無效：</span>
                                <span className="text-slate-600 text-xs">「你覺得睡眠重要嗎？」→ 問不出睡眠時間！</span>
                            </div>
                            <div className="bg-green-50 p-2 rounded border border-green-100">
                                <span className="text-green-600 font-bold text-xs">✅ 有效：</span>
                                <span className="text-slate-600 text-xs">「你平日幾點睡覺？」→ 直接測到睡眠時間！</span>
                            </div>
                        </div>
                        <div className="mt-3 bg-emerald-50 p-2 rounded text-xs text-emerald-800">
                            <strong>自檢：</strong>「我這題問的東西，跟我的研究問題直接相關嗎？」
                        </div>
                    </div>

                    {/* 可靠性 */}
                    <div className="bg-white rounded-xl p-5 shadow-sm border border-emerald-100">
                        <div className="text-3xl mb-3">⚖️</div>
                        <h3 className="text-lg font-bold text-emerald-800 mb-2">可靠性 (Reliability)</h3>
                        <p className="text-sm text-slate-600 mb-3">測出來的結果穩定</p>
                        <div className="space-y-2 text-sm">
                            <div className="bg-red-50 p-2 rounded border border-red-100">
                                <span className="text-red-600 font-bold text-xs">❌ 不可靠：</span>
                                <span className="text-slate-600 text-xs">「你常常熬夜嗎？」→ 「常常」標準不同！</span>
                            </div>
                            <div className="bg-green-50 p-2 rounded border border-green-100">
                                <span className="text-green-600 font-bold text-xs">✅ 可靠：</span>
                                <span className="text-slate-600 text-xs">「上週你有幾天超過12點才睡？」→ 明確可數！</span>
                            </div>
                        </div>
                        <div className="mt-3 bg-emerald-50 p-2 rounded text-xs text-emerald-800">
                            <strong>自檢：</strong>「換一個人來填，會不會因為看不懂而填出不同東西？」
                        </div>
                    </div>

                    {/* 可行性 */}
                    <div className="bg-white rounded-xl p-5 shadow-sm border border-emerald-100">
                        <div className="text-3xl mb-3">⏱️</div>
                        <h3 className="text-lg font-bold text-emerald-800 mb-2">可行性 (Feasibility)</h3>
                        <p className="text-sm text-slate-600 mb-3">你做得到、受訪者願意配合</p>
                        <div className="space-y-2 text-sm">
                            <div className="bg-red-50 p-2 rounded border border-red-100">
                                <span className="text-red-600 font-bold text-xs">❌ 不可行：</span>
                                <span className="text-slate-600 text-xs">問卷100題、訪談5小時、實驗100人×3天</span>
                            </div>
                            <div className="bg-green-50 p-2 rounded border border-green-100">
                                <span className="text-green-600 font-bold text-xs">✅ 可行：</span>
                                <span className="text-slate-600 text-xs">問卷20-30題、訪談30-60分、實驗10-15人</span>
                            </div>
                        </div>
                        <div className="mt-3 bg-emerald-50 p-2 rounded text-xs text-emerald-800">
                            <strong>自檢：</strong>「我真的做得完嗎？受訪者願意配合嗎？」
                        </div>
                    </div>
                </div>
            </div>

            {/* 研究倫理 */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 md:p-8">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        <Heart className="text-pink-500" size={22} />
                        研究倫理四大原則
                    </h2>
                    <button
                        onClick={() => setShowEthics(!showEthics)}
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                        {showEthics ? '收起知情同意範本' : '查看知情同意範本'}
                    </button>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                    {[
                        { icon: '📝', name: '知情同意', eng: 'Informed Consent', desc: '受訪者要知道研究目的、願意參加' },
                        { icon: '🔒', name: '保密性', eng: 'Confidentiality', desc: '不能洩漏受訪者身份' },
                        { icon: '🛡️', name: '不傷害', eng: 'Do No Harm', desc: '不能造成心理或生理傷害' },
                        { icon: '🤝', name: '自願性', eng: 'Voluntariness', desc: '可以隨時退出，不受懲罰' },
                    ].map((p) => (
                        <div key={p.name} className="bg-pink-50/40 rounded-lg border border-pink-100 p-4 flex gap-3 items-start">
                            <span className="text-2xl shrink-0">{p.icon}</span>
                            <div>
                                <h4 className="font-bold text-slate-800 text-sm">{p.name} ({p.eng})</h4>
                                <p className="text-xs text-slate-600 mt-1">{p.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {showEthics && (
                    <div className="bg-slate-50 rounded-lg border border-slate-200 p-5 text-sm text-slate-700 animate-in fade-in slide-in-from-top-2 duration-300">
                        <h4 className="font-bold text-slate-800 mb-3">📋 知情同意範本</h4>
                        <div className="bg-white p-4 rounded border border-slate-200 text-xs leading-relaxed whitespace-pre-line font-mono">
                            {`各位同學好，

我們是 ○○ 高中的學生，正在進行一項關於
「高中生睡眠時間與學業成績關係」的研究。

本研究目的是了解睡眠與成績的關係，
所有資料僅供學術使用，不會公開個人身份。
填答約需 10 分鐘，您可以隨時停止。

感謝您的參與！

□ 我已閱讀以上說明，同意參加本研究`}
                        </div>
                        <p className="mt-3 text-xs text-amber-700 font-bold">
                            ⚠️ 每份問卷和訪談大綱的開頭，都必須有類似的知情同意說明！
                        </p>
                    </div>
                )}
            </div>

            {/* 分流工作坊入口 */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 md:p-8">
                <h2 className="text-xl font-bold text-slate-800 mb-2">🔀 分流工作坊：選擇你的方法</h2>
                <p className="text-slate-600 text-sm mb-6">依照你在 W7 決定的研究方法，進入對應的設計指引。</p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { icon: <ClipboardList size={28} />, name: '問卷組', desc: '設計 Likert 量表式問卷', color: 'blue', tab: 'survey' },
                        { icon: <Mic size={28} />, name: '訪談組', desc: '設計半結構式訪談大綱', color: 'orange', tab: 'interview' },
                        { icon: <TestTube2 size={28} />, name: '實驗組', desc: '設計實驗流程與變項控制表', color: 'purple', tab: 'experiment' },
                        { icon: <Camera size={28} />, name: '觀察組', desc: '設計觀察紀錄表', color: 'teal', tab: 'observation' },
                    ].map((g) => (
                        <Link
                            key={g.name}
                            to={`/analysis?tab=${g.tab}`}
                            className="bg-slate-50 hover:bg-slate-100 rounded-xl p-5 border border-slate-200 text-center transition-all hover:shadow-md group"
                        >
                            <div className="text-slate-400 group-hover:text-slate-700 transition-colors flex justify-center mb-2">
                                {g.icon}
                            </div>
                            <h3 className="font-bold text-slate-800 text-sm">{g.name}</h3>
                            <p className="text-xs text-slate-500 mt-1">{g.desc}</p>
                        </Link>
                    ))}
                </div>
            </div>

            {/* W9 預告 */}
            <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-xl shadow-lg p-6 md:p-8 text-white">
                <h3 className="text-xl font-bold mb-2">🤖 W9 預告：AI 協助工具精進與預試</h3>
                <p className="text-violet-100 text-sm mb-4">
                    設計完初稿後，你會學到如何用 AI 來「壓力測試」你的工具！
                    <br />但記住——AI 可以幫你找到 80% 的問題，剩下 20% 一定要靠真人預試！
                </p>
                <Link
                    to="/analysis"
                    className="inline-flex items-center gap-2 bg-white text-indigo-700 hover:bg-indigo-50 px-5 py-2.5 rounded-lg font-bold text-sm transition-colors"
                >
                    前往數據分析模組 (W10+)
                    <ArrowRight size={16} />
                </Link>
            </div>

        </div>
    );
};
