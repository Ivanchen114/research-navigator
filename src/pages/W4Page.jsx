import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PromptBox } from '../components/analysis/PromptBox';
import { CheckCircle2, ChevronDown, ChevronUp, ArrowRight, Users, BookOpen, Search, Bot, Map } from 'lucide-react';
import LessonMap from '../components/ui/LessonMap';
import { W4Data } from '../data/lessonMaps';

// ── 可折疊區塊 ───────────────────────────────────────────────
const SectionHeader = ({ id, title, icon, subtitle, badge, openSection, toggleSection }) => (
    <button
        onClick={() => toggleSection(id)}
        className={`w-full flex items-center justify-between p-5 md:p-6 rounded-2xl text-left transition-all ${openSection === id ? 'bg-slate-900 text-white rounded-b-none' : 'bg-white border border-slate-200 hover:border-slate-300 hover:shadow-sm'}`}
    >
        <div className="flex items-center gap-3">
            <span className="text-xl">{icon}</span>
            <div>
                <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-black text-base">{title}</span>
                    {badge && (
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${openSection === id ? 'bg-slate-700 text-slate-300' : 'bg-amber-100 text-amber-700'}`}>{badge}</span>
                    )}
                </div>
                {subtitle && <p className={`text-xs mt-0.5 ${openSection === id ? 'text-slate-400' : 'text-slate-500'}`}>{subtitle}</p>}
            </div>
        </div>
        {openSection === id ? <ChevronUp size={20} className="text-slate-400 shrink-0" /> : <ChevronDown size={20} className="text-slate-400 shrink-0" />}
    </button>
);

export const W4Page = () => {
    const [openSection, setOpenSection] = useState('part0');
    const toggleSection = (id) => setOpenSection(prev => prev === id ? null : id);
    const [showLessonMap, setShowLessonMap] = useState(false);

    // Part 0：海報草稿區
    const [w3Topic, setW3Topic] = useState('');
    const [myDraftTitle, setMyDraftTitle] = useState('');
    const [myDraftAssumptions, setMyDraftAssumptions] = useState('');

    // Part 2：壓力測試
    const [adviceAccept, setAdviceAccept] = useState('');
    const [adviceReject, setAdviceReject] = useState('');
    const [adviceUnsure, setAdviceUnsure] = useState('');

    // Part 3：W4 最終定案
    const [finalTopic, setFinalTopic] = useState('');
    const [selectedMethod, setSelectedMethod] = useState('');

    // Part 4：文獻搜尋
    const [searchKeywords, setSearchKeywords] = useState('');
    const [apaFormat, setApaFormat] = useState('');

    const posterPrompt = `我的研究海報需要以下元素：
- 研究題目：${w3Topic || '【從 W3 帶來的題目】'}
- 吸引人的標題草稿：${myDraftTitle || '【你的草稿】'}
- 預期發現草稿：\n${myDraftAssumptions || '【你的預測】'}

請幫我：
1. 優化標題，讓它更吸引高中生，保持白話但加一點懸疑感
2. 把預期發現改寫得更有研究感（加入「可能」「推測」等詞）
3. 給我 2 個版本讓我選

請保持在我原本的研究範圍內，不要幫我改題目方向。`;

    const props = { openSection, toggleSection };

    return (
        <div className="max-w-4xl mx-auto space-y-5 animate-in fade-in duration-500">

            {/* ===== Lesson Map Toggle (Teacher Only) ===== */}
            <div className="flex justify-end pt-2 pb-0 -mb-6 relative z-20 pr-4">
                <button
                    onClick={() => setShowLessonMap(!showLessonMap)}
                    className="flex items-center gap-1.5 text-[11px] text-slate-300 hover:text-indigo-500 transition-colors opacity-60 hover:opacity-100 font-mono"
                    title="教師專用：顯示課程地圖"
                >
                    <Map size={12} />
                    {showLessonMap ? 'Hide Map' : 'Instructor View'}
                </button>
            </div>

            {showLessonMap && (
                <div className="mb-4 animate-in slide-in-from-top-4 duration-300">
                    <LessonMap data={W4Data} />
                </div>
            )}

            {/* Header */}
            <header className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-100 rounded-full blur-3xl opacity-40 -translate-y-1/2 translate-x-1/3" />
                <div className="relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100 mb-4">
                        <Users size={16} /> W4 題目博覽會與資料搜集入門
                    </div>
                    <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-3">
                        Gallery Walk：<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">讓全班幫你把關</span>
                    </h1>
                    <p className="text-slate-600 max-w-2xl mx-auto leading-relaxed">
                        在你的題目接受考驗之前，它是你自己的草稿。<br />
                        通過同儕壓力測試的題目，才是真正的定案。
                    </p>
                </div>
            </header>

            {/* Part 0 & 1：海報製作與 AI 優化 */}
            <div className="rounded-2xl overflow-hidden border border-slate-200">
                <SectionHeader id="part0" title="Part 0 & 1｜🎨 海報草稿與 AI 優化" icon="🎨" subtitle="先靠自己想破頭，再讓 AI 幫你變好懂！" badge="先人後 AI" {...props} />
                {openSection === 'part0' && (
                    <div className="bg-white p-6 md:p-8 space-y-6 border-t border-slate-100">
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
                            ⚠️ <strong>順位第一：</strong>先完全靠自己寫 Step 0（不准用 AI！），再去複製 Step 1 的提示詞。
                        </div>

                        {/* Step 0：自主草稿 */}
                        <div className="bg-orange-50 border-2 border-orange-300 rounded-xl p-5 space-y-4">
                            <p className="font-bold text-orange-800 text-sm flex items-center gap-2">
                                <span className="bg-orange-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs font-black">0</span>
                                Step 0：海報草稿區（不准用 AI！）
                            </p>
                            <div>
                                <label className="text-sm font-bold text-slate-700 block mb-2">1. 從 W3 帶來的最終定案題目</label>
                                <textarea
                                    className="w-full border border-orange-300 bg-white rounded-xl p-3 text-sm focus:ring-2 focus:ring-orange-400 transition-all min-h-[56px]"
                                    placeholder="貼上 W3 的定案題目..."
                                    value={w3Topic}
                                    onChange={e => setW3Topic(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="text-sm font-bold text-slate-700 block mb-2">2. 吸引人的海報標題草稿（白話文就好）</label>
                                <textarea
                                    className="w-full border border-orange-300 bg-white rounded-xl p-3 text-sm focus:ring-2 focus:ring-orange-400 transition-all min-h-[56px]"
                                    placeholder="例：滑手機真的會讓你睡不好嗎？"
                                    value={myDraftTitle}
                                    onChange={e => setMyDraftTitle(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="text-sm font-bold text-slate-700 block mb-2">3. 預測研究發現草稿（大膽猜測 2-3 點）</label>
                                <textarea
                                    className="w-full border border-orange-300 bg-white rounded-xl p-3 text-sm focus:ring-2 focus:ring-orange-400 transition-all min-h-[80px]"
                                    placeholder="- 猜測 1：___________&#10;- 猜測 2：___________"
                                    value={myDraftAssumptions}
                                    onChange={e => setMyDraftAssumptions(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Step 1：AI 優化 */}
                        <div>
                            <p className="font-bold text-slate-700 text-sm flex items-center gap-2 mb-3">
                                <span className="bg-blue-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs font-black">1</span>
                                Step 1 AI 優化：複製這段 Prompt 給 AI
                            </p>
                            <div className="bg-slate-50 rounded-xl border border-slate-200 p-4">
                                <PromptBox>{posterPrompt}</PromptBox>
                            </div>
                            <p className="text-center text-slate-500 text-xs mt-4 mt-2 mb-2">
                                💡 選好 AI 給的其中一個版本，加上你的研究對象與方法，**手寫在 A4 海報紙上**！
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Part 2：Gallery Walk 意見整理 */}
            <div className="rounded-2xl overflow-hidden border border-slate-200">
                <SectionHeader id="part2" title="Part 2｜📝 壓力測試（意見整理）" icon="📝" subtitle="從 Gallery Walk 收到的便利貼中，歸納 3 條關鍵建議。" {...props} />
                {openSection === 'part2' && (
                    <div className="bg-white p-6 md:p-8 space-y-5 border-t border-slate-100">
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
                            🔍 整理便利貼：把同學的建議分成這三類，記下你最在意的點。
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="font-bold text-emerald-700 text-sm block mb-2">1. 我接受，而且我要修改的部分：</label>
                                <textarea
                                    className="w-full border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-emerald-400 transition-all min-h-[56px]"
                                    placeholder="同學說：..."
                                    value={adviceAccept}
                                    onChange={e => setAdviceAccept(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="font-bold text-rose-700 text-sm block mb-2">2. 我不接受，我有理由（或者我覺得不可行）的部分：</label>
                                <textarea
                                    className="w-full border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-rose-400 transition-all min-h-[56px]"
                                    placeholder="同學說：...；我的理由是：..."
                                    value={adviceReject}
                                    onChange={e => setAdviceReject(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="font-bold text-amber-700 text-sm block mb-2">3. 我不確定，需要再想一想或問老師的部分：</label>
                                <textarea
                                    className="w-full border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-amber-400 transition-all min-h-[56px]"
                                    placeholder="同學問了：..."
                                    value={adviceUnsure}
                                    onChange={e => setAdviceUnsure(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Part 3：W4 最終定案 */}
            <div className="rounded-2xl overflow-hidden border border-purple-200">
                <SectionHeader id="part3" title="Part 3｜🏆 W4 最終定案（最重要的成果）" icon="🏆" subtitle="經歷了三十幾人的挑戰，這是你接下來整個學期要做的題目。" {...props} />
                {openSection === 'part3' && (
                    <div className="bg-white p-6 md:p-8 space-y-5 border-t border-purple-100">
                        <div>
                            <label className="font-bold text-slate-700 text-sm block mb-2">🏆 我的 W4 最終定案題目</label>
                            <textarea
                                className="w-full border-2 border-purple-400 bg-purple-50 rounded-xl p-4 font-bold text-purple-900 text-sm focus:ring-2 focus:ring-purple-500 transition-all min-h-[80px]"
                                placeholder="採納建議後的最終版題目（這個題目會跟著你到學期末！）"
                                value={finalTopic}
                                onChange={e => setFinalTopic(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="font-bold text-slate-700 text-sm block mb-3">🛠️ 我的主要研究方法（決定你下週 W5 去哪一組！）</label>
                            <div className="flex flex-wrap gap-2">
                                {['問卷', '訪談', '實驗', '觀察', '文獻'].map(method => (
                                    <button
                                        key={method}
                                        onClick={() => setSelectedMethod(method)}
                                        className={`px-4 py-2 rounded-full text-sm font-bold border-2 transition-all ${selectedMethod === method
                                            ? 'bg-purple-600 text-white border-purple-600'
                                            : 'bg-white text-slate-600 border-slate-200 hover:border-purple-300'
                                            }`}
                                    >
                                        {method}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {finalTopic && selectedMethod && (
                            <div className="mt-4 bg-purple-100 border border-purple-300 rounded-xl p-4 text-center">
                                <p className="text-purple-600 text-xs font-mono uppercase tracking-widest mb-1">🏁 準備啟程</p>
                                <p className="text-purple-900 font-black text-base">「{finalTopic}」</p>
                                <p className="text-purple-600 text-sm mt-2">你將使用 <strong>{selectedMethod}</strong> 方法進行研究！</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Part 4：文獻搜尋入門 */}
            <div className="rounded-2xl overflow-hidden border border-slate-200">
                <SectionHeader id="part4" title="Part 4｜📚 文獻搜尋入門（預習）" icon="📚" subtitle="看看別人有沒有做過類似的研究，這叫做「文獻探討」。" {...props} />
                {openSection === 'part4' && (
                    <div className="bg-white p-6 md:p-8 space-y-5 border-t border-slate-100">
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
                            🔍 <strong>用 AI 幫你找關鍵字：</strong> 把定案題目給 AI，請它列出「中/英學術關鍵字」，挑選 2-3 個去華藝資料庫搜尋。
                        </div>

                        <div>
                            <label className="font-bold text-slate-700 text-sm block mb-2">1. 我用來搜尋的關鍵字（2-3個）</label>
                            <input
                                className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 transition-all"
                                placeholder="例：課堂專注度、手機使用..."
                                value={searchKeywords}
                                onChange={e => setSearchKeywords(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="font-bold text-slate-700 text-sm block mb-2">2. 找到的一篇相關文章（練習 APA 格式）</label>
                            <p className="text-xs text-slate-500 mb-2">格式：作者（年份）。論文題目（碩士論文/期刊名稱）。學校名稱。</p>
                            <textarea
                                className="w-full border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-400 transition-all min-h-[56px]"
                                placeholder="例：陳小明（2022）。高中生睡眠時間與學業成績關係之研究（碩士論文）。國立台灣師範大學。"
                                value={apaFormat}
                                onChange={e => setApaFormat(e.target.value)}
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Part Z：自我檢核 */}
            <div className="rounded-2xl overflow-hidden border border-slate-200">
                <SectionHeader id="partz" title="Part Z｜✅ 自我檢核" icon="✅" subtitle="繳交前確認！" {...props} />
                {openSection === 'partz' && (
                    <div className="bg-white p-6 md:p-8 border-t border-slate-100">
                        <div className="space-y-3">
                            {[
                                '我已完成海報草稿，並手寫在 A4 紙上。',
                                '我已參加 Gallery Walk，並收集到同學的具體建議。',
                                '我的「W4 最終定案題目」和「研究方法」已經決定好了。',
                                '我已在資料庫找到一篇論文，並試著寫下 APA 格式。'
                            ].map(item => (
                                <label key={item} className="flex items-start gap-3 cursor-pointer group">
                                    <input type="checkbox" className="mt-0.5 w-4 h-4 rounded text-emerald-600 cursor-pointer" />
                                    <span className="text-sm text-slate-700 group-hover:text-slate-900">{item}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* 下週預告 */}
            <div className="bg-slate-900 rounded-3xl p-6 text-white">
                <p className="text-slate-400 text-xs font-mono tracking-widest mb-2 uppercase">// 📢 下週 W5 預告</p>
                <p className="text-white font-bold text-lg mb-1">五路分流：開始研究的漫長旅程</p>
                <p className="text-slate-300 text-sm mb-3">你今天在 W4 最終定案選定的「研究方法」，決定了你下週要去哪一組！下週我們將開始五路分流探索。</p>
            </div>

            {/* Navigation */}
            <div className="flex justify-between pt-2 pb-12">
                <Link to="/wizard" className="inline-flex items-center gap-2 bg-slate-200 text-slate-700 px-5 py-3 rounded-lg font-semibold hover:bg-slate-300 transition">
                    ← 回 W3
                </Link>
                <Link to="/literature-review" className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition shadow-md hover:shadow-lg">
                    前進「文獻鑑識 W6」<ArrowRight size={20} />
                </Link>
            </div>
        </div>
    );
};
