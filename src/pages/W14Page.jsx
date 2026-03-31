import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import CourseArc from '../components/ui/CourseArc';
import {
    ChevronRight, ArrowLeft, ArrowRight, ClipboardCheck,
    Zap, Sparkles, MessageSquare, BookOpen, Search,
    ShieldCheck, CheckCircle2, AlertCircle, Map, ShieldAlert
} from 'lucide-react';
import LessonMap from '../components/ui/LessonMap';
import CopyButton from '../components/ui/CopyButton';
import { W14Data } from '../data/lessonMaps';

export const W14Page = () => {
    const [showLessonMap, setShowLessonMap] = useState(false);
    const [openPractices, setOpenPractices] = useState({});
    const [unlockCounts, setUnlockCounts] = useState({});

    const togglePractice = (id) => {
        setOpenPractices(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const handleUnlock = (id) => {
        setUnlockCounts(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
    };

    const promptText = `以下是我初步寫的四層研究結論草稿，請幫我：

1. 確認四層結構是否完整（描述 / 詮釋 / 回扣 / 批判）
2. 指出哪一層寫得最薄弱，並說明原因
3. 幫我改寫最薄弱的那一層（保留我的研究內容，只改表達方式）
4. 確認詮釋層有沒有說「可能」，有沒有跳太快

以下是我的草稿：

【第一層 描述】
（貼上你的描述句）

【第二層 詮釋】
（貼上你的詮釋句）

【第三層 回扣】
（貼上你的回扣句）

【第四層 批判】
（貼上你的批判句）`;

    return (
        <div className="page-container animate-in-fade-slide">

            {/* TOP BAR / NAVIGATION PATH */}
            <div className="flex items-center justify-between border-b border-[#dddbd5] pb-4 mb-12">
                <div className="text-[11px] font-mono text-[#8888aa] flex items-center gap-2">
                    研究方法與專題 / 分析與撰寫 / <span className="text-[#1a1a2e] font-bold">研究結論 W15</span>
                </div>
                <div className="flex items-center gap-4">
                    <span className="bg-[#f0ede6] text-[#1a1a2e] text-[10px] font-bold px-2 py-0.5 rounded-[2px] font-mono">100 MINS</span>
                    <button
                        onClick={() => setShowLessonMap(!showLessonMap)}
                        className="text-[11px] text-[#8888aa] hover:text-[#2d5be3] transition-colors flex items-center gap-1 font-mono"
                    >
                        <Map size={12} /> {showLessonMap ? 'Hide Plan' : 'Instructor View'}
                    </button>
                    <span className="bg-[#1a1a2e] text-white text-[10px] font-bold px-2 py-0.5 rounded-[2px] font-mono">AI-RED · D</span>
                </div>
            </div>

            {showLessonMap && (
                <div className="animate-in slide-in-from-top-4 duration-300 mb-12">
                    <LessonMap data={W14Data} />
                </div>
            )}

            {/* PAGE HEADER */}
            <div className="section-head mb-8">
                <div className="flex flex-col">
                    <span className="text-[11px] font-mono text-[#2d5be3] tracking-widest uppercase mb-2">✍️ W15 · 分析與撰寫</span>
                    <h1 className="text-3xl font-bold text-[#1a1a2e] font-serif">研究結論：<em className="text-[#2d5be3] not-italic">四層寫作法</em></h1>
                </div>
            </div>
            <p className="section-desc mb-12">
                W13 學了描述和詮釋，那只是局部說明。今天要升級：把所有發現整合成一份研究的完整結論。四層寫下來，就是你這學期研究最有價值的那幾段話。
            </p>

            {/* GAME BANNER */}
            <div className="bg-[#1a1a2e] border-l-4 border-[#10b981] p-6 rounded-r-lg mb-10 text-white shadow-xl mt-6">
                <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                    <ShieldAlert className="text-[#10b981]" size={20} />
                    即刻報到：行動代號濾鏡
                </h3>
                <p className="text-[#8888aa] text-sm mb-4">
                    數字會說話，但有時候會說謊。戴上真相濾鏡，識破數據陷阱，學習從客觀數據中得出穩健結論。
                </p>
                <Link to="/game/data-detective" className="inline-flex items-center gap-2 bg-[#10b981] text-white px-4 py-2 rounded font-bold text-sm hover:bg-[#0d9467] transition-colors">
                    進入遊戲系統 <ArrowRight size={14} />
                </Link>
            </div>

            {/* META STRIP */}
            <div className="meta-strip">
                {W14Data.metaCards.map((item, idx) => (
                    <div key={idx} className="meta-item">
                        <div className="meta-label">{item.label}</div>
                        <div className="meta-value">{item.value}</div>
                    </div>
                ))}
            </div>



            {/* COURSE ARC */}
            <CourseArc items={W14Data.courseArc} />

            {/* 學什麼 SECTION */}
            <div className="section-head">
                <h2>學什麼</h2>
                <div className="line"></div>
                <span className="mono">CONCEPT</span>
            </div>

            <span className="section-label">觀念一 · 四層公式一覽：從局部說明到完整結論</span>

            {/* 升級對比 */}
            <div className="upgrade-banner">
                <div className="upgrade-col">
                    <div className="upgrade-label">W13 局部說明（一張圖）</div>
                    <div className="upgrade-title">描述 + 詮釋</div>
                    <div className="upgrade-desc">針對單一圖表寫兩句話。是拼圖的一塊，不是全貌。</div>
                </div>
                <div className="upgrade-arrow">→</div>
                <div className="upgrade-col !bg-[#e8eeff]">
                    <div className="upgrade-label !text-[#2d5be3]">W14 完整結論（整份研究）</div>
                    <div className="upgrade-title !text-[#2d5be3]">描述 → 詮釋 → 回扣 → 批判</div>
                    <div className="upgrade-desc !text-[#3a4a8a]">把所有圖說整合成研究的核心主張。有頭有尾，有觀點，有自我檢視。</div>
                </div>
            </div>

            {/* 四層公式 */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-px bg-[#dddbd5] border border-[#dddbd5] rounded-xl overflow-hidden mb-12">
                {[
                    { num: '01', tag: 'Description', tagColor: 'bg-[#e8eeff] text-[#2d5be3]', title: '你看到了什麼？', desc: '整合所有圖表中最重要的數字，誠實報告資料顯示的事實。不加解釋，只報數字。', start: '根據圖一……', ex: '根據圖一，80% 的受訪學生表示睡前使用手機超過一小時。' },
                    { num: '02', tag: 'Interpretation', tagColor: 'bg-[#e8f5ee] text-[#2e7d5a]', title: '這代表什麼？', desc: '解釋數字背後的意義，推測可能原因。記住：永遠說「可能」，不說「一定」。', start: '這可能代表……', ex: '這可能反映出學生放學後缺乏其他休覽管道，手機成為主要解壓方式。' },
                    { num: '03', tag: 'Callback', tagColor: 'bg-[#fdf6e3] text-[#7a6020]', title: '這回答了研究問題嗎？', desc: '把發現拉回到你一開始提的研究問題。這步驟只有你能寫——AI 不知道你的問題是什麼。', start: '回到本研究的問題……', ex: '回到本研究的問題，手機使用確實與睡眠品質有顯著關聯，初步支持我們的假設。' },
                    { num: '04', tag: 'Critique', tagColor: 'bg-[#fdecea] text-[#c0392b]', title: '這個結論有哪些不足？', desc: '主動指出你的研究限制：樣本、方法、時間、測量工具的侷限。誠實的研究者才這樣說。', start: '然而，本研究仍有限制……', ex: '然而，本研究樣本僅限本校一年級，且為自填問卷，結果可能受社會期望影響。' }
                ].map((layer, i) => (
                    <div key={i} className="bg-white p-5 flex flex-col h-full">
                        <div className="text-2xl font-mono font-bold text-[#dddbd5] mb-2 leading-none">{layer.num}</div>
                        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase self-start mb-2 ${layer.tagColor}`}>{layer.tag}</span>
                        <div className="text-sm font-bold text-[#1a1a2e] mb-2">{layer.title}</div>
                        <div className="text-[12px] text-[#4a4a6a] leading-relaxed mb-4">{layer.desc}</div>
                        <div className="mt-auto">
                            <div className="text-[10px] font-mono p-1 px-2 rounded bg-[#f0ede6] border border-[#dddbd5] text-[#4a4a6a] mb-2 inline-block">{layer.start}</div>
                            <div className="text-[11px] text-[#8888aa] italic leading-snug border-t border-[#dddbd5] pt-2">{layer.ex}</div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="notice notice-gold">
                💡 四層中，第三層「回扣」是最容易省略的——學生常常詮釋完就結束了。但回扣是整份研究的靈魂：你花了這麼多週收資料，到底有沒有回答你最初的問題？
            </div>

            {/* 觀念二：回扣層精講 */}
            <span className="section-label !mt-10">觀念二 · 第三層「回扣」：只有你能寫的那一句話</span>

            <div className="border border-[#dddbd5] rounded-xl overflow-hidden mb-12">
                <div className="p-4 px-5 bg-[#f0ede6] border-b border-[#dddbd5] flex items-center gap-3">
                    <span className="text-[10px] font-mono bg-[#1a1a2e] text-white px-2 py-0.5 rounded-[3px]">CALLBACK</span>
                    <span className="font-bold text-sm text-[#1a1a2e]">把發現拉回研究問題——這一步 AI 幫不了你</span>
                </div>
                <div className="p-5 bg-white">
                    <div className="text-sm font-bold text-[#1a1a2e] mb-3">核心問題：「你的資料有沒有回答你一開始的研究問題？」</div>
                    <div className="notice notice-accent !mb-4">
                        🔑 回扣層不是再說一遍發現，而是明確連結：「我的發現 → 我的研究問題 → 支持還是不支持？」
                    </div>
                    <ul className="space-y-2 mb-6">
                        {['說清楚你的研究問題是什麼（複習一下，不要假設讀者記得）', '說你的發現「支持」、「部分支持」還是「不支持」你的假設', '如果發現出乎意料，也要誠實說「與預期不符，這可能是因為……」', '不需要長——一到兩句話就夠，但要精準'].map((li, i) => (
                            <li key={i} className="text-[12px] text-[#4a4a6a] leading-relaxed pl-5 relative before:content-['→'] before:absolute before:left-0 before:text-[#8888aa]">{li}</li>
                        ))}
                    </ul>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#dddbd5] border border-[#dddbd5] rounded-lg overflow-hidden">
                        <div className="bg-white p-4">
                            <div className="text-[11px] font-bold text-[#c0392b] mb-2">❌ 沒有回扣（只是再詮釋一次）</div>
                            <div className="text-[12px] text-[#4a4a6a] leading-relaxed">「由此可見，手機使用對學生影響很大，值得重視。」</div>
                            <div className="text-[11px] text-[#8888aa] italic mt-2">——這只是感想，沒有連回研究問題。</div>
                        </div>
                        <div className="bg-white p-4">
                            <div className="text-[11px] font-bold text-[#2e7d5a] mb-2">✅ 有回扣（明確連回）</div>
                            <div className="text-[12px] text-[#4a4a6a] leading-relaxed">「回到本研究的問題——『高中生手機使用習慣是否與睡眠品質有關？』，本次調查結果支持此關聯性存在，尤其在睡前使用時間超過一小時的群體中最為顯著。」</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 觀念三：批判層精講 */}
            <span className="section-label !mt-10">觀念三 · 第四層「批判」：誠實的研究者才懂自我檢視</span>

            <div className="border border-[#dddbd5] rounded-xl overflow-hidden mb-12">
                <div className="p-4 px-5 bg-[#f0ede6] border-b border-[#dddbd5] flex items-center gap-3">
                    <span className="text-[10px] font-mono bg-[#1a1a2e] text-white px-2 py-0.5 rounded-[3px]">CRITIQUE</span>
                    <span className="font-bold text-sm text-[#1a1a2e]">研究限制不是扣分，是研究誠信的體現</span>
                </div>
                <div className="p-5 bg-white">
                    <div className="text-sm font-bold text-[#1a1a2e] mb-3">你要問自己：「如果有人想挑戰我的結論，最容易從哪裡下手？」</div>
                    <div className="notice notice-danger !mb-4">
                        ⚠️ 寫批判層不是在貶低自己的研究——是在說「我知道這份研究的邊界在哪裡」，這是嚴謹的表現。
                    </div>

                    {/* 四種常見限制 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#dddbd5] border border-[#dddbd5] rounded-lg overflow-hidden mb-4">
                        {[
                            { icon: '📦', title: '樣本限制', desc: '只調查了某一個班、某一個年齡層，結果不一定能代表所有人。', ex: '「本研究僅以本校一年級為對象……」' },
                            { icon: '🛠️', title: '工具限制', desc: '自填問卷可能受到社會期望影響，訪談可能因訪者不同而有差異。', ex: '「自填問卷可能導致受訪者……」' },
                            { icon: '⏱️', title: '時間限制', desc: '只在某一個時間點蒐集資料，無法反映長期變化或季節影響。', ex: '「本研究為橫斷性調查，未能追蹤……」' },
                            { icon: '📐', title: '測量限制', desc: '「壓力」、「幸福感」這類概念很難用幾道題目完整測量到。', ex: '「量表題目有限，可能未能全面反映……」' }
                        ].map((limit, i) => (
                            <div key={i} className="bg-white p-4">
                                <div className="text-[11px] font-bold text-[#1a1a2e] mb-1.5">{limit.icon} {limit.title}</div>
                                <div className="text-[12px] text-[#4a4a6a] leading-relaxed mb-2">{limit.desc}</div>
                                <div className="text-[11px] font-mono text-[#8888aa] italic">{limit.ex}</div>
                            </div>
                        ))}
                    </div>

                    <div className="notice notice-gold text-[12px]">
                        💡 選 1–2 個跟你研究最相關的限制，說清楚「是什麼限制」以及「這個限制對結論可能有什麼影響」。不要把四種都列出來，那樣反而顯得不真誠。
                    </div>
                </div>
            </div>

            {/* 練什麼 SECTION */}
            <div className="section-head mt-16">
                <h2>練什麼</h2>
                <div className="line"></div>
                <span className="mono">PRACTICE</span>
            </div>

            <span className="section-label">演練 1 · 四層診斷：這段文字缺了哪一層？</span>
            <p className="text-[13px] text-[#4a4a6a] mb-6">判斷下面每段文字屬於四層中的哪一層，並說出缺少了什麼。</p>

            <div className="space-y-4 mb-12">
                {[
                    {
                        id: 'p1',
                        badge: '題 1',
                        title: '「由此可見，現代高中生普遍有睡眠不足的問題，這對身心健康影響深遠。」',
                        thinking: '先想想：這是哪一層？缺了什麼？',
                        answer: (
                            <>
                                <strong className="text-[#2e7d5a]">這是「詮釋」層，但不完整——缺少描述層和回扣層。</strong><br /><br />
                                說「普遍」沒有報數字（缺描述）；說「影響深遠」是感想，但沒有連回原本的研究問題（缺回扣）。正確寫法應該先說數字，再詮釋，再把發現拉回研究問題。
                            </>
                        )
                    },
                    {
                        id: 'p2',
                        badge: '題 2',
                        title: '「根據圖三，64.2% 的受訪者表示曾因壓力而影響飲食。這可能代表壓力是影響飲食習慣的重要因素之一。回到本研究的問題，壓力與飲食的關聯確實存在。然而，本研究僅調查高一學生，結果不能推論至其他族群。」',
                        thinking: '先判斷：四層都有嗎？有沒有任何一層寫得不夠好？',
                        answer: (
                            <>
                                <strong className="text-[#2e7d5a]">四層都有！這是一段完整的結論。</strong><br /><br />
                                描述：64.2% 的數字。詮釋：「可能代表壓力是重要因素」（有說「可能」✓）。回扣：「回到本研究的問題」（有明確連回 ✓）。批判：「僅調查高一學生」（有說明限制 ✓）。<br /><br />
                                小建議：回扣那句可以再精確一點，說「支持」或「部分支持」，不是只說「確實存在」。
                            </>
                        )
                    }
                ].map((item) => (
                    <div key={item.id} className={`border border-[#dddbd5] rounded-xl overflow-hidden transition-all ${openPractices[item.id] ? 'ring-1 ring-[#2d5be3]/20 shadow-sm' : ''}`}>
                        <div
                            className="p-4 px-5 bg-[#f8f7f4] border-b border-[#dddbd5] flex items-center gap-4 cursor-pointer hover:bg-[#f0ede6] transition-colors"
                            onClick={() => togglePractice(item.id)}
                        >
                            <span className="text-[10px] font-mono bg-[#1a1a2e] text-white px-2 py-0.5 rounded-[3px] shrink-0">{item.badge}</span>
                            <span className="text-sm font-bold text-[#1a1a2e] flex-1 line-clamp-1">{item.title}</span>
                            <ChevronRight size={16} className={`text-[#8888aa] transition-transform duration-300 ${openPractices[item.id] ? 'rotate-90' : ''}`} />
                        </div>
                        {openPractices[item.id] && (
                            <div className="p-6 bg-white animate-in-fade-slide">
                                <div className="text-[13px] text-[#4a4a6a] mb-4 font-medium">{item.thinking}</div>
                                {unlockCounts[item.id] >= 3 ? (
                                    <div className="bg-[#e8f5ee] border-l-4 border-[#2e7d5a] rounded-r-lg p-5 text-[13px] text-[#4a4a6a] leading-relaxed">
                                        {item.answer}
                                    </div>
                                ) : (
                                    <div
                                        className="bg-[#f8f7f4] border-2 border-dashed border-[#dddbd5] rounded-xl p-8 text-center cursor-pointer hover:border-[#2d5be3]/40 hover:bg-[#f0ede6] transition-all group"
                                        onClick={() => handleUnlock(item.id)}
                                    >
                                        <div className="text-[13px] text-[#8888aa] group-hover:text-[#2d5be3] font-medium">
                                            {unlockCounts[item.id] > 0 ? `再點 ${3 - unlockCounts[item.id]} 下顯示答案` : '👆 點三下看答案'}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <span className="section-label !mt-8">演練 2 · 學習單 Part 3 四層草稿</span>
            <p className="text-[13px] text-[#4a4a6a] mb-6">用你自己的研究寫四層。每一層都有格式說明，填寫後帶去 Task 3 討論。</p>

            {/* WORKSHEET PART 3 */}
            <div className="border border-[#dddbd5] rounded-xl overflow-hidden mb-12">
                <div className="p-4 px-5 bg-[#1a1a2e] flex items-center gap-3">
                    <span className="text-[10px] font-mono bg-[#c9a84c] text-[#1a1a2e] px-2 py-0.5 rounded-[3px] font-bold">PART 3</span>
                    <span className="font-bold text-sm text-white">最終草稿：四層結論</span>
                </div>
                <div className="divide-y divide-[#dddbd5]">
                    {[
                        { num: '第一層', name: '描述', eng: 'Description', meta: '整合所有圖表中最重要的數字，客觀陳述。只報事實，不加解釋。', hint: '↑ 請將 Part 1 修改後的描述句填入下方', starter: '根據圖一（或圖二⋯⋯），', area: '在此填入描述句，直接引用數字，不加任何詮釋⋯⋯' },
                        { num: '第二層', name: '詮釋', eng: 'Interpretation', meta: '解釋數字代表什麼意義，推測可能原因。永遠說「可能」。', hint: '↑ 請將 Part 1 修改後的詮釋句填入下方', starter: '這可能代表⋯⋯', area: '在此填入詮釋句，說明可能原因或意義⋯⋯' },
                        { num: '第三層', name: '回扣', eng: 'Callback', meta: '把發現連回你的研究問題。說「支持」、「部分支持」或「不支持」。只有你能寫這層。', starter: '回到本研究的問題⋯⋯，本次發現（支持／部分支持／不支持）⋯⋯', area: '先寫出你的研究問題，再說你的發現是否回答了它⋯⋯' },
                        { num: '第四層', name: '批判', eng: 'Critique', meta: '說出 1–2 個研究限制，以及這些限制對結論可能有什麼影響。', starter: '然而，本研究仍有限制⋯⋯', area: '說出最相關的 1–2 個限制，並說明對結論的影響⋯⋯' }
                    ].map((layer, i) => (
                        <div key={i} className="bg-white">
                            <div className="grid grid-cols-[160px_1fr] border-b border-[#dddbd5]">
                                <div className="p-4 bg-[#f8f7f4] flex flex-col justify-center gap-1">
                                    <span className="text-[10px] font-mono text-[#8888aa]">{layer.num}</span>
                                    <span className="text-sm font-bold text-[#1a1a2e]">{layer.name}</span>
                                    <span className="text-[10px] font-mono text-[#8888aa] uppercase tracking-wider">{layer.eng}</span>
                                </div>
                                <div className="p-4 flex items-center text-[12px] text-[#4a4a6a] leading-relaxed">
                                    {layer.meta}
                                </div>
                            </div>
                            <div className="p-5">
                                {layer.hint && <div className="text-[11px] font-mono text-[#2d5be3] bg-[#e8eeff] border border-[#2d5be3]/20 px-3 py-1 rounded inline-block mb-3">{layer.hint}</div>}
                                <div className="mb-2 text-[12px] text-[#4a4a6a]">
                                    <span className="font-mono bg-[#f0ede6] border border-[#dddbd5] px-2 py-0.5 rounded mr-2">{layer.starter}</span>
                                </div>
                                <div className="bg-[#f8f7f4] border border-dashed border-[#dddbd5] rounded-lg p-3 min-h-[80px] text-[12px] text-[#8888aa]">
                                    {layer.area}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* AI PROMPT */}
            <div className="section-head mt-16">
                <h2>AI 輔助</h2>
                <div className="line"></div>
                <span className="mono">AI ASSIST</span>
            </div>
            <p className="section-desc mb-6">
                先完成四層草稿，清除所有個人資料後，再用這段 Prompt 請 AI 協助潤稿——不是讓 AI 幫你想，是讓 AI 幫你說得更清楚。
            </p>

            <div className="notice notice-danger !mb-6">
                ⚠️ 餵給 AI 之前，請先確認：刪除所有受訪者姓名、學號、班級等可識別資訊。把「甲同學」改成「受訪者 A」，訪談逐字稿同理。
            </div>

            <div className="bg-[#1a1a2e] rounded-xl overflow-hidden mb-8">
                <div className="p-3 px-5 border-b border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="text-[10px] font-mono bg-[#c9a84c] text-[#1a1a2e] px-2 py-0.5 rounded-[3px] font-bold">PROMPT</span>
                        <span className="font-bold text-sm text-white">四層結論潤稿</span>
                    </div>
                    <CopyButton text={promptText} size={14} className="text-white/60 hover:text-white" />
                </div>
                <div className="p-5 overflow-x-auto">
                    <pre className="text-[12px] text-white/70 font-mono leading-relaxed whitespace-pre-wrap">
                        {promptText}
                    </pre>
                </div>
            </div>

            <div className="notice notice-gold mb-16">
                💡 AI 幫你改寫之後，要逐句對照：改得更清楚了嗎？有沒有改掉你原本想說的意思？有沒有把「可能」拿掉、變成武斷的說法？最終版本要是你自己確認過的，不是直接貼上 AI 的版本。
            </div>

            {/* 課堂任務 SECTION */}
            <div className="section-head mt-16">
                <h2>課堂任務</h2>
                <div className="line"></div>
                <span className="mono">IN-CLASS</span>
            </div>

            <div className="space-y-4 mb-16">
                {[
                    { badge: 'TASK 1', title: '整理材料：把 W13 的圖說帶進來（第一節，10 分鐘）', ol: ['打開 W13 的學習單，確認每張圖各有一段描述句＋詮釋句', '選出你認為最能回答研究問題的 1–2 張圖的圖說，作為今天四層的基礎', '把選定的描述句和詮釋句填入學習單 Part 3 的第一、二層'], notice: '💡 如果 W13 的圖說有任何「推論跳太快」的地方，現在修正，不要把錯誤帶進結論。' },
                    { badge: 'TASK 2', title: '寫回扣層（第一節，20 分鐘）', ol: ['翻出你們在 W3 寫的研究問題，放在眼前', '問自己：「我找到的這些資料，有沒有回答這個問題？」', '用「支持 / 部分支持 / 不支持」其中一個詞開始寫回扣句', '填入學習單 Part 3 第三層'], notice: '🔑 老師巡視時會問：「這個發現如何回答你的問題？」——你要能用一句話說清楚，不是只說「有關聯」。', noticeClass: 'notice-accent' }
                ].map((task, i) => (
                    <div key={i} className="border border-[#dddbd5] rounded-xl overflow-hidden bg-white">
                        <div className="p-4 px-5 bg-[#f8f7f4] border-b border-[#dddbd5] flex items-center gap-3">
                            <span className="text-[10px] font-mono bg-[#1a1a2e] text-white px-2 py-0.5 rounded-[3px]">{task.badge}</span>
                            <span className="font-bold text-sm text-[#1a1a2e]">{task.title}</span>
                        </div>
                        <div className="p-6">
                            <ol className="list-decimal pl-5 space-y-2 text-sm text-[#4a4a6a]">
                                {task.ol.map((li, j) => <li key={j}>{li}</li>)}
                            </ol>
                            <div className={`notice ${task.noticeClass || 'notice-gold'} !mt-6 text-[12px]`}>
                                {task.notice}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* 本週總結 SECTION */}
            <div className="section-head mt-20">
                <h2>本週總結</h2>
                <div className="line"></div>
                <span className="mono">WRAP-UP</span>
            </div>

            <div className="border border-[#dddbd5] rounded-xl overflow-hidden bg-white mb-4">
                <div className="p-4 px-5 bg-[#f0ede6] border-b border-[#dddbd5] font-bold text-sm text-[#1a1a2e]">✅ 本週結束，你應該要會</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#dddbd5]">
                    {[
                        '學習單 Part 3 四層草稿全部填完',
                        '回扣層明確說出「支持 / 部分支持 / 不支持」',
                        '批判層指出 1–2 個具體研究限制',
                        'AI 建議記錄在 Part 4，並說明採納理由'
                    ].map((item, i) => (
                        <div key={i} className="bg-white p-4 flex items-start gap-4 text-[13px] text-[#4a4a6a]">
                            <CheckCircle2 size={16} className="text-[#2e7d5a] mt-0.5 shrink-0" />
                            <span>{item}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="border border-[#dddbd5] rounded-xl overflow-hidden bg-white mb-12">
                <div className="p-4 px-5 bg-[#f0ede6] border-b border-[#dddbd5] flex items-center gap-3">
                    <span className="text-[10px] font-mono bg-[#1a1a2e] text-white px-2 py-0.5 rounded-[3px]">HOMEWORK</span>
                    <span className="font-bold text-sm text-[#1a1a2e]">本週作業</span>
                </div>
                <div className="divide-y divide-[#dddbd5]">
                    {[
                        { part: '定稿上傳', name: '四層結論最終版（含 AI 紀錄）上傳 Google Classroom' },
                        { part: '帶去 W16', name: '四層結論定稿 + 所有圖表，是 W15 簡報製作的直接素材' }
                    ].map((hw, i) => (
                        <div key={i} className="p-4 px-6 flex items-start gap-6 text-[13px]">
                            <span className="font-mono font-bold text-[#2d5be3] w-20 shrink-0 uppercase tracking-wider text-[11px]">{hw.part}</span>
                            <span className="text-[#4a4a6a]">{hw.name}</span>
                        </div>
                    ))}
                </div>
                <div className="p-4 px-6 bg-[#f8f7f4] border-t border-[#dddbd5] flex items-center justify-between">
                    <span className="text-[12px] text-[#8888aa]">學習單在 Google Classroom 下載</span>
                    <a href="https://classroom.google.com/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-[12px] font-mono font-bold text-[#2d5be3]">→ Google Classroom</a>
                </div>
            </div>

            {/* 下週預告 */}
            <div className="next-week-preview">
                <div className="next-week-header">
                    <span className="next-week-badge">NEXT WEEK</span>
                    <h3 className="next-week-title">W16 簡報設計：把四層結論變成一張投影片</h3>
                </div>
                <div className="next-week-content">
                    <div className="next-week-col">
                        <div className="next-week-label">今天完成了</div>
                        <p className="next-week-text">四層結論——整份研究最核心的文字產出。W16 的任務是把這些話「翻譯」成觀眾看得懂、印象深刻的視覺化呈現。</p>
                    </div>
                    <div className="next-week-col">
                        <div className="next-week-label">下週學什麼</div>
                        <div className="next-week-text">
                            一頁一個訊息的投影片邏輯<br />
                            文字精簡：從段落到標題句<br />
                            圖表放大：讓視覺說話
                        </div>
                    </div>
                </div>
            </div>

            {/* NAVIGATION */}
            <div className="flex justify-between items-center py-12 border-t border-[#dddbd5] mt-12">
                <Link to="/w14" className="flex items-center gap-2 text-[#8888aa] hover:text-[#1a1a2e] transition-colors text-[13px] font-bold no-underline">
                    <ArrowLeft size={18} /> ← 回 W14 數據轉譯
                </Link>
                <Link to="/w16" className="flex items-center gap-2 bg-[#1a1a2e] text-white px-8 py-3 rounded-lg hover:bg-[#2a2a4a] transition-all text-[13px] font-bold no-underline group shadow-lg shadow-[#1a1a2e]/10">
                    前往 W16 簡報設計 <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>
        </div>
    );
};
