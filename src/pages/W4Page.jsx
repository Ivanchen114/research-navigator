import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PromptBox } from '../components/analysis/PromptBox';
import { CheckCircle2, ChevronDown, ChevronUp, ArrowRight, Users, Map } from 'lucide-react';
import LessonMap from '../components/ui/LessonMap';
import { W4Data } from '../data/lessonMaps';

// ── 可折疊區塊 ───────────────────────────────────────────────
const SectionHeader = ({ id, title, icon, subtitle, badge, openSection, toggleSection }) => (
    <button
        onClick={() => toggleSection(id)}
        className={`w-full flex items-center justify-between px-6 py-5 text-left transition-colors border ${openSection === id
                ? 'bg-[#1a1a2e] text-white border-[#1a1a2e] rounded-t-[10px]'
                : 'bg-white text-[#1a1a2e] border-[#dddbd5] hover:bg-[#f8f7f4] rounded-[10px]'
            }`}
    >
        <div className="flex items-center gap-4">
            <span className="text-[20px]">{icon}</span>
            <div>
                <div className="flex items-center gap-3">
                    <span className="font-bold text-[16px]">{title}</span>
                    {badge && (
                        <span className={`text-[10px] px-1.5 py-[1px] rounded-[3px] font-['DM_Mono',monospace] tracking-wider uppercase ${openSection === id ? 'bg-white/10 text-white/70' : 'bg-[#2d5be3] text-white'
                            }`}>{badge}</span>
                    )}
                </div>
                {subtitle && <p className={`text-[12px] mt-1 ${openSection === id ? 'text-white/60' : 'text-[#8888aa]'}`}>{subtitle}</p>}
            </div>
        </div>
        {openSection === id ? <ChevronUp size={20} className="opacity-50" /> : <ChevronDown size={20} className="opacity-50" />}
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
        <div className="max-w-5xl mx-auto px-6 lg:px-12 py-8 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 font-['Noto_Sans_TC',sans-serif] text-[14px] leading-[1.6] text-[#1a1a2e] pb-16">

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
                    <LessonMap data={W4Data} />
                </div>
            )}

            {/* Header */}
            <header className="mb-14 pt-8">
                <div className="text-[11px] font-['DM_Mono',monospace] tracking-[0.12em] uppercase text-[#2d5be3] mb-3 flex items-center gap-2">
                    <Users size={14} /> W4 標題博覽會
                </div>
                <h1 className="font-['Noto_Serif_TC',serif] text-[38px] font-bold leading-[1.25] text-[#1a1a2e] mb-4 tracking-[-0.02em]">
                    Gallery Walk：<br className="hidden md:block" />
                    <span className="text-[#2d5be3] font-normal italic">全班幫你把關</span>
                </h1>
                <p className="text-[15px] text-[#4a4a6a] leading-[1.75] max-w-[560px]">
                    在你的題目接受考驗之前，它是你自己的草稿。通過同儕壓力測試的題目，才是真正的定案。
                </p>
            </header>

            {/* Part 0 & 1：海報製作 */}
            <section className="space-y-4">
                <SectionHeader id="part0" title="Part 0 & 1｜海報製作與 AI 優化" icon="🎨" subtitle="先靠自己想破頭，再讓 AI 幫你變好懂。" badge="Draft Phase" {...props} />
                {openSection === 'part0' && (
                    <div className="bg-white p-8 space-y-8 border-x border-b border-[#dddbd5] rounded-b-[10px] animate-in slide-in-from-top-2 duration-300">
                        <div className="bg-[#f0ede6] border-l-4 border-[#c9a84c] p-5">
                            <p className="text-[#1a1a2e] text-[13px] font-medium">
                                ⚠️ <strong>先人後 AI：</strong>請先完整填寫 Step 0 的三個欄位，再使用 AI 優化提示詞。
                            </p>
                        </div>

                        <div className="bg-[#f8f7f4] border border-[#dddbd5] rounded-[10px] p-8 space-y-6">
                            <div className="flex items-center gap-3 mb-2">
                                <span className="w-6 h-6 rounded-full bg-[#1a1a2e] text-white flex items-center justify-center font-bold text-[12px] font-['DM_Mono',monospace]">0</span>
                                <h3 className="font-bold text-[15px] text-[#1a1a2e]">海報草擬區（不准用 AI）</h3>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[12px] font-bold text-[#4a4a6a]">1. 從 W3 帶來的最終定案題目</label>
                                <textarea
                                    className="w-full border border-[#dddbd5] rounded-[6px] p-4 text-[13px] focus:outline-none focus:border-[#2d5be3] min-h-[60px] bg-white transition-all"
                                    placeholder="貼上上週 W3 的定案題目..."
                                    value={w3Topic}
                                    onChange={e => setW3Topic(e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[12px] font-bold text-[#4a4a6a]">2. 吸引人的標題草稿（白話文就好）</label>
                                <textarea
                                    className="w-full border border-[#dddbd5] rounded-[6px] p-4 text-[13px] focus:outline-none focus:border-[#2d5be3] min-h-[60px] bg-white transition-all"
                                    placeholder="例：滑手機真的會讓你睡不好嗎？"
                                    value={myDraftTitle}
                                    onChange={e => setMyDraftTitle(e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[12px] font-bold text-[#4a4a6a]">3. 預測研究發現（大膽猜測 2-3 點）</label>
                                <textarea
                                    className="w-full border border-[#dddbd5] rounded-[6px] p-4 text-[13px] focus:outline-none focus:border-[#2d5be3] min-h-[90px] bg-white transition-all"
                                    placeholder="- 猜測 1：___________&#10;- 猜測 2：___________"
                                    value={myDraftAssumptions}
                                    onChange={e => setMyDraftAssumptions(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-3 mb-2">
                                <span className="w-6 h-6 rounded-full bg-[#2d5be3] text-white flex items-center justify-center font-bold text-[12px] font-['DM_Mono',monospace]">1</span>
                                <h3 className="font-bold text-[15px] text-[#1a1a2e]">AI 優化：複製 Prompt</h3>
                            </div>
                            <div className="bg-[#f0f4ff] border border-[#2d5be3]/20 rounded-[8px] p-6">
                                <PromptBox variant="paper">{posterPrompt}</PromptBox>
                            </div>
                            <p className="text-[12px] text-[#8888aa] text-center italic">
                                💡 建議：選好一個版本後，手寫在你的 A4 海報紙上，準備開始 Gallery Walk！
                            </p>
                        </div>
                    </div>
                )}
            </section>

            {/* Part 2：Gallery Walk 意見整理 */}
            <section className="space-y-4">
                <SectionHeader id="part2" title="Part 2｜壓力測試：意見整理" icon="📝" subtitle="從遍地便利貼中，歸納出最具挑戰性的關鍵建議。" {...props} />
                {openSection === 'part2' && (
                    <div className="bg-white p-8 space-y-8 border-x border-b border-[#dddbd5] rounded-b-[10px] animate-in slide-in-from-top-2 duration-300">
                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="space-y-3">
                                <label className="font-bold text-[#2e7d5a] text-[12px] uppercase tracking-wider font-['DM_Mono',monospace]">01 Accept / 接受並修改</label>
                                <textarea
                                    className="w-full border border-[#dddbd5] rounded-[6px] p-4 text-[13px] focus:outline-none focus:border-[#2e7d5a] min-h-[140px] bg-[#f0f9f4]/50"
                                    placeholder="哪些建議說中了你的盲點？"
                                    value={adviceAccept}
                                    onChange={e => setAdviceAccept(e.target.value)}
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="font-bold text-[#e32d5b] text-[12px] uppercase tracking-wider font-['DM_Mono',monospace]">02 Reject / 暫不採納</label>
                                <textarea
                                    className="w-full border border-[#dddbd5] rounded-[6px] p-4 text-[13px] focus:outline-none focus:border-[#e32d5b] min-h-[140px] bg-[#fdf2f2]/50"
                                    placeholder="哪些建議你覺得不可行？理由是什麼？"
                                    value={adviceReject}
                                    onChange={e => setAdviceReject(e.target.value)}
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="font-bold text-[#c9a84c] text-[12px] uppercase tracking-wider font-['DM_Mono',monospace]">03 Unsure / 待確認</label>
                                <textarea
                                    className="w-full border border-[#dddbd5] rounded-[6px] p-4 text-[13px] focus:outline-none focus:border-[#c9a84c] min-h-[140px] bg-[#fffaf0]/50"
                                    placeholder="哪些問題讓你陷入沈思？需要問老師嗎？"
                                    value={adviceUnsure}
                                    onChange={e => setAdviceUnsure(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </section>

            {/* Part 3：W4 最終定案 */}
            <section className="space-y-4">
                <SectionHeader id="part3" title="Part 3｜W4 最終定案" icon="🏆" subtitle="經歷了同儕挑戰，這是你整個學期要守護的題目。" badge="Final Target" {...props} />
                {openSection === 'part3' && (
                    <div className="bg-white p-8 space-y-10 border-x border-b border-[#dddbd5] rounded-b-[10px] animate-in slide-in-from-top-2 duration-300">
                        <div className="space-y-4">
                            <label className="font-bold text-[#1a1a2e] text-[15px] flex items-center gap-2">
                                <CheckCircle2 size={18} className="text-[#2d5be3]" /> 最終確認：我的研究題目
                            </label>
                            <textarea
                                className="w-full border-2 border-[#1a1a2e] bg-[#f8f7f4] rounded-[10px] p-6 font-bold text-[#1a1a2e] text-[18px] focus:outline-none leading-relaxed transition-all"
                                placeholder="採納建議後的最終版題目（這將是你的最終參賽題目）"
                                value={finalTopic}
                                onChange={e => setFinalTopic(e.target.value)}
                            />
                        </div>

                        <div className="space-y-5">
                            <label className="font-bold text-[#1a1a2e] text-[14px] block">
                                🛠️ 主要研究方法（決定你下週的分流組別）
                            </label>
                            <div className="grid grid-cols-5 gap-3">
                                {['問卷', '訪談', '實驗', '觀察', '文獻'].map(method => (
                                    <button
                                        key={method}
                                        onClick={() => setSelectedMethod(method)}
                                        className={`px-4 py-3 rounded-[6px] text-[13px] font-bold border transition-all ${selectedMethod === method
                                            ? 'bg-[#1a1a2e] text-white border-[#1a1a2e]'
                                            : 'bg-white text-[#4a4a6a] border-[#dddbd5] hover:border-[#1a1a2e]'
                                            }`}
                                    >
                                        {method}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {finalTopic && selectedMethod && (
                            <div className="bg-[#1a1a2e] text-white rounded-[10px] p-8 text-center animate-in zoom-in-95">
                                <div className="text-[#2d5be3] text-[10px] font-['DM_Mono',monospace] tracking-[0.2em] uppercase mb-3">Project Official Launch</div>
                                <h4 className="text-[22px] font-['Noto_Serif_TC',serif] font-bold mb-4">「{finalTopic}」</h4>
                                <p className="text-white/50 text-[13px]">
                                    你已準備好使用 <strong>{selectedMethod}</strong> 方法進行深度探究。
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </section>

            {/* Part 4：文獻搜尋 */}
            <section className="space-y-4">
                <SectionHeader id="part4" title="Part 4｜文獻搜尋入門" icon="📚" subtitle="看看別人做過什麼。這是一場關於「已知」的前哨戰。" {...props} />
                {openSection === 'part4' && (
                    <div className="bg-white p-8 space-y-8 border-x border-b border-[#dddbd5] rounded-b-[10px] animate-in slide-in-from-top-2 duration-300">
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <label className="font-bold text-[#1a1a2e] text-[14px] block flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#2d5be3]"></span> 1. 搜尋關鍵字 (Keywords)
                                </label>
                                <input
                                    className="w-full border border-[#dddbd5] rounded-[6px] px-4 py-3 text-[13px] focus:outline-none focus:border-[#2d5be3] bg-[#f8f7f4]"
                                    placeholder="中/英學術關鍵字 (2-3個)..."
                                    value={searchKeywords}
                                    onChange={e => setSearchKeywords(e.target.value)}
                                />
                                <p className="text-[11px] text-[#8888aa] leading-relaxed">
                                    💡 貼心提示：可以使用 AI 列出關鍵字，再去「華藝資料庫」進行精準檢索。
                                </p>
                            </div>
                            <div className="space-y-4">
                                <label className="font-bold text-[#1a1a2e] text-[14px] block flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#2d5be3]"></span> 2. 文獻引用練習 (APA)
                                </label>
                                <textarea
                                    className="w-full border border-[#dddbd5] rounded-[6px] p-4 text-[13px] focus:outline-none focus:border-[#2d5be3] min-h-[90px] bg-[#f8f7f4]"
                                    placeholder="作者（年份）。題目（類型）。學校/期刊。"
                                    value={apaFormat}
                                    onChange={e => setApaFormat(e.target.value)}
                                />
                                <p className="text-[11px] text-[#8888aa]">
                                    例：陳小明（2023）。高中生打藥與否之研究（碩士論文）。松山高中。
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </section>

            {/* 下週預告 */}
            <div className="bg-[#f8f7f4] border border-[#dddbd5] rounded-[10px] p-8 text-center">
                <p className="text-[#8888aa] text-[10px] font-['DM_Mono',monospace] tracking-[0.2em] mb-3 uppercase">// Next Phase</p>
                <h3 className="text-[18px] font-bold text-[#1a1a2e] mb-2 font-['Noto_Serif_TC',serif]">五路分流：開始研究的漫長旅程</h3>
                <p className="text-[#4a4a6a] text-[13px] max-w-[600px] mx-auto leading-relaxed">
                    你今天選定的「研究方法」將決定下週的分流組別。我們將開始針對不同的研究工具進行專項訓練。
                </p>
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center py-12 border-t border-[#dddbd5]">
                <Link to="/wizard" className="text-[13px] font-bold text-[#8888aa] hover:text-[#1a1a2e] flex items-center gap-2 transition-colors">
                    ← 回 W3 題目健檢
                </Link>
                <Link to="/literature-review" className="bg-[#1a1a2e] text-white px-8 py-3 rounded-[6px] text-[14px] font-bold hover:bg-[#2a2a4a] transition-all flex items-center gap-2 group">
                    前進「文獻鑑識 W6」 <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>

        </div>
    );
};
