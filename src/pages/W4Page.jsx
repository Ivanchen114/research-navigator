import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PromptBox } from '../components/analysis/PromptBox';
import { CheckCircle2, ChevronDown, ChevronUp, ArrowRight, Users, BookOpen, Search, Bot } from 'lucide-react';

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

    // Part 0：海報製作
    const [myTopic, setMyTopic] = useState('');
    const [myWho, setMyWho] = useState('');
    const [myHow, setMyHow] = useState('');
    const [myDraftTitle, setMyDraftTitle] = useState('');
    const [myDraftAssumptions, setMyDraftAssumptions] = useState('');

    // Part 2：題目定案
    const [finalTopic, setFinalTopic] = useState('');

    const posterPrompt = `我的研究題目是：${myTopic || '【你的題目】'}
研究對象：${myWho || '【Who】'}
研究方法：${myHow || '【How】'}
我自己想的海報標題草稿：${myDraftTitle || '（未填）'}
我自己想的預期發現草稿：${myDraftAssumptions || '（未填）'}

請幫我優化海報文案，包含：
1. 優化我的標題（讓它更吸引人，可用問句，20 字以內）
2. 幫我補充或優化「預期發現」，給我 3 個假設
請根據我的草稿調整，不要完全取代我的想法，讓內容簡單讓高中生看懂。`;

    const props = { openSection, toggleSection };

    return (
        <div className="max-w-4xl mx-auto space-y-5 animate-in fade-in duration-500">

            {/* Header */}
            <header className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-100 rounded-full blur-3xl opacity-40 -translate-y-1/2 translate-x-1/3" />
                <div className="relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100 mb-4">
                        <Users size={16} /> W4 題目博覽會
                    </div>
                    <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-3">
                        Gallery Walk：<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">讓全班幫你把關</span>
                    </h1>
                    <p className="text-slate-600 max-w-2xl mx-auto leading-relaxed">
                        帶著 W3 的定案題目，辦一場個人研究博覽會。<br />
                        用同儕的眼睛檢驗你的題目，再學習怎麼找文獻支撐。
                    </p>
                </div>
            </header>

            {/* Part 0：海報快速製作 */}
            <div className="rounded-2xl overflow-hidden border border-slate-200">
                <SectionHeader id="part0" title="Part 0｜🤖 AI 海報快速製作" icon="🎨" subtitle="用 AI 幫你設計海報文案，10 分鐘完成！最後手寫在 A4 紙上。" badge="AI 協作" {...props} />
                {openSection === 'part0' && (
                    <div className="bg-white p-6 md:p-8 space-y-5 border-t border-slate-100">
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
                            ⚠️ <strong>順序很重要：</strong>Step 0 先自己草稿（不准用 AI！）→ Step 1 填基本資訊 → Step 2 再讓 AI 優化！最後手寫在 A4 紙上。
                        </div>

                        {/* Step 0：先自己草稿 */}
                        <div className="bg-orange-50 border-2 border-orange-300 rounded-xl p-5 space-y-4">
                            <p className="font-bold text-orange-800 text-sm flex items-center gap-2">
                                <span className="bg-orange-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs font-black">0</span>
                                Step 0：先自己草稿（不准用 AI！）
                            </p>
                            <div>
                                <label className="text-sm font-bold text-slate-700 block mb-2">我想用什麼標題吸引同學？（白話文，不用管格式！）</label>
                                <textarea
                                    className="w-full border border-orange-300 bg-white rounded-xl p-3 text-sm focus:ring-2 focus:ring-orange-400 transition-all min-h-[56px]"
                                    placeholder="例：滑手機真的會讓你睡不好嗎？ / 圖書館裡到底有沒有人在真的看書？"
                                    value={myDraftTitle}
                                    onChange={e => setMyDraftTitle(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="text-sm font-bold text-slate-700 block mb-2">我預測研究可能發現什麼？（大膽猜，寫 2-3 個）</label>
                                <textarea
                                    className="w-full border border-orange-300 bg-white rounded-xl p-3 text-sm focus:ring-2 focus:ring-orange-400 transition-all min-h-[80px]"
                                    placeholder="猜測 1：___________&#10;猜測 2：___________&#10;猜測 3：___________"
                                    value={myDraftAssumptions}
                                    onChange={e => setMyDraftAssumptions(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Step 1：填入基本資訊 */}
                        <div>
                            <p className="font-bold text-slate-700 text-sm flex items-center gap-2 mb-3">
                                <span className="bg-slate-700 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs font-black">1</span>
                                Step 1：填入基本資訊（從 W3 帶來）
                            </p>
                            <div className="grid md:grid-cols-3 gap-3">
                                <div>
                                    <label className="font-bold text-slate-700 text-sm block mb-2">我的研究題目（從 W3 帶來）</label>
                                    <textarea
                                        className="w-full border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-400 transition-all min-h-[72px]"
                                        placeholder="貼上 W3 的最終定案題目…"
                                        value={myTopic}
                                        onChange={e => setMyTopic(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="font-bold text-slate-700 text-sm block mb-2">研究對象（Who）</label>
                                    <textarea
                                        className="w-full border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-400 transition-all min-h-[72px]"
                                        placeholder="例：本校高一生（50人）"
                                        value={myWho}
                                        onChange={e => setMyWho(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="font-bold text-slate-700 text-sm block mb-2">研究方法（How）</label>
                                    <textarea
                                        className="w-full border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-400 transition-all min-h-[72px]"
                                        placeholder="例：問卷調查"
                                        value={myHow}
                                        onChange={e => setMyHow(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Step 2：AI 優化 */}
                        <div>
                            <p className="font-bold text-slate-700 text-sm flex items-center gap-2 mb-3">
                                <span className="bg-blue-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs font-black">2</span>
                                Step 2：複製這段 Prompt 給 AI（讓它優化你的草稿）
                            </p>
                            <div className="bg-slate-50 rounded-xl border border-slate-200 p-4">
                                <PromptBox>{posterPrompt}</PromptBox>
                            </div>

                        </div>

                        {/* 海報格式參考 */}
                        <div className="pt-4 border-t border-slate-100">
                            <label className="font-bold text-slate-700 text-sm block mb-4 flex items-center gap-2">
                                <BookOpen size={16} className="text-indigo-500" /> 📋 海報格式參考範例
                            </label>
                            <div className="bg-slate-50 rounded-2xl p-4 md:p-6 border border-slate-200">
                                <div className="max-w-md mx-auto shadow-xl rounded-lg overflow-hidden border border-slate-300 transform transition-transform hover:scale-[1.02]">
                                    <img
                                        src="/images/user_research_poster.png"
                                        alt="Research Poster Template"
                                        className="w-full h-auto block"
                                    />
                                </div>
                                <p className="text-center text-slate-500 text-xs mt-4 italic">
                                    💡 提示：海報標題要夠吸引人（問句式），內容要簡潔好讀。最後請**手寫在 A4 紙上**。
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Part 1：Gallery Walk 說明 */}
            <div className="rounded-2xl overflow-hidden border border-slate-200">
                <SectionHeader id="part1" title="Part 1｜🚶 Gallery Walk 走讀規則" icon="🖼️" subtitle="四輪走讀，每場 5 分鐘——讓全班幫你把關！" {...props} />
                {openSection === 'part1' && (
                    <div className="bg-white p-6 md:p-8 space-y-5 border-t border-slate-100">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                                <p className="font-bold text-blue-800 text-sm mb-3">📢 你的角色輪換</p>
                                <div className="space-y-2 text-sm text-blue-700">
                                    <div className="flex items-start gap-2"><span className="font-black shrink-0">第一場</span><span>在自己的位置報告，聽眾來找你</span></div>
                                    <div className="flex items-start gap-2"><span className="font-black shrink-0">第二場</span><span>移動到 B 位置聆聽別人</span></div>
                                    <div className="flex items-start gap-2"><span className="font-black shrink-0">第三場</span><span>移動到 C 位置聆聽別人</span></div>
                                    <div className="flex items-start gap-2"><span className="font-black shrink-0">第四場</span><span>移動到 D 位置聆聽別人</span></div>
                                </div>
                            </div>
                            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                                <p className="font-bold text-emerald-800 text-sm mb-3">✏️ 給同學的建議怎麼寫</p>
                                <div className="space-y-1 text-sm">
                                    <p className="text-emerald-700">✅ <strong>好的：</strong>「你的 Who 很具體，讚！」</p>
                                    <p className="text-emerald-700">✅ <strong>好的：</strong>「建議 Who 縮小到本校高一生」</p>
                                    <p className="text-emerald-700">✅ <strong>好的：</strong>「方法用問卷，但樣本能去到 50 人嗎？」</p>
                                    <p className="text-red-600">❌ <strong>不好：</strong>「你的題目爛透了」（沒有理由）</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                            <p className="font-bold text-amber-800 text-sm mb-2">👀 同時觀察——為日後組隊準備（W7）</p>
                            <p className="text-amber-700 text-sm">今天還是個人題目，但你可以開始留意：誰的題目跟我相近？誰用的研究方法跟我一樣？</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Part 2：題目最終定案 */}
            <div className="rounded-2xl overflow-hidden border border-purple-200">
                <SectionHeader id="part2" title="Part 2｜🎯 題目最終定案" icon="🎯" subtitle="看完同學建議，決定要不要修改——這就是陪你到學期末的題目！" {...props} />
                {openSection === 'part2' && (
                    <div className="bg-white p-6 md:p-8 space-y-5 border-t border-purple-100">
                        <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 text-sm text-purple-800">
                            📝 Gallery Walk 後，請閱讀同學寫在你海報上的建議，思考：這個建議合理嗎？我應該採納嗎？
                        </div>

                        <div className="space-y-3">
                            <label className="font-bold text-slate-700 text-sm block">同學給我的建議（從海報上抄下來）</label>
                            <div className="space-y-2">
                                {[1, 2, 3].map(n => (
                                    <div key={n} className="flex gap-3 items-start">
                                        <span className="bg-purple-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs font-black shrink-0 mt-2">{n}</span>
                                        <input
                                            className="flex-1 border border-slate-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-purple-400 transition-all"
                                            placeholder={`建議 ${n}：`}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="font-bold text-slate-700 text-sm block mb-2">🎯 我的 W4 最終定案題目</label>
                            <textarea
                                className="w-full border-2 border-purple-400 bg-purple-50 rounded-xl p-4 font-bold text-purple-900 text-sm focus:ring-2 focus:ring-purple-500 transition-all min-h-[80px]"
                                placeholder="採納建議後的最終版題目（這個題目會跟著你到學期末！）"
                                value={finalTopic}
                                onChange={e => setFinalTopic(e.target.value)}
                            />
                            {finalTopic && (
                                <div className="mt-3 bg-purple-100 border border-purple-300 rounded-xl p-4 text-center">
                                    <p className="text-purple-600 text-xs font-mono uppercase tracking-widest mb-1">🏆 W4 最終定案題目</p>
                                    <p className="text-purple-900 font-black text-base">「{finalTopic}」</p>
                                    <p className="text-purple-600 text-xs mt-1">恭喜完成「問題形成階段」（W1-W4）！</p>
                                </div>
                            )}
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
                                '我已完成 Part 0 的 AI 海報，並手寫在 A4 紙上。',
                                '我已參加 Gallery Walk，報告了 1 次，聆聽了 3 次。',
                                '我已看完同學的建議，並決定是否修改題目。',
                                '我的「W4 最終定案題目」已填好（Part 2）。',
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
                <p className="text-white font-bold text-lg mb-1">「文獻偵探社與學術寫作倫理」</p>
                <p className="text-slate-300 text-sm mb-3">你會學到：如何鑑識文獻真偽（A-D 級）、正確引用格式、防範抄襲的技巧。</p>
                <div className="bg-blue-500/20 border border-blue-500/40 rounded-xl p-3">
                    <p className="text-blue-300 font-bold text-sm">⚠️ 記得帶著你驕傲的「W4 最終定案題目」前來報到！</p>
                </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between pt-2 pb-12">
                <Link to="/wizard" className="inline-flex items-center gap-2 bg-slate-200 text-slate-700 px-5 py-3 rounded-lg font-semibold hover:bg-slate-300 transition">
                    ← 回 W3
                </Link>
                <Link to="/literature-review" className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition shadow-md hover:shadow-lg">
                    前進「文獻偵探社 W5」<ArrowRight size={20} />
                </Link>
            </div>
        </div>
    );
};
