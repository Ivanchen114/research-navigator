import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import CourseArc from '../components/ui/CourseArc';
import { Map, ArrowRight, ArrowLeft, CheckCircle2, Users2, Target, Lightbulb, Zap, MessageSquare, Brain } from 'lucide-react';
import LessonMap from '../components/ui/LessonMap';
import CopyButton from '../components/ui/CopyButton';
import { W4Data } from '../data/lessonMaps';

export const W4Page = () => {
    const [showLessonMap, setShowLessonMap] = useState(false);
    const [w3Topic, setW3Topic] = useState('');
    const [titleDraft, setTitleDraft] = useState('');
    const [myMotivation, setMyMotivation] = useState('');

    const titlePrompt = `我的研究題目是：${w3Topic || '【填入你的 W3 定案題目】'}\n我自己想的標題草稿是：${titleDraft || '【填入你的直覺標題】'}\n我的研究動機：${myMotivation || '【填入你的研究動機】'}\n\n請幫我優化這個標題，讓它更吸引人，用問句，20字以內，不要完全取代我的想法。給我3個版本。`;

    return (
        <div className="page-container animate-in-fade-slide">
            {/* TOP BAR */}
            <div className="flex items-center justify-between border-b border-[#dddbd5] pb-4 mb-12">
                <div className="text-[11px] font-mono text-[#8888aa] flex items-center gap-2">
                    研究方法與專題 / 研究規劃 / <span className="text-[#1a1a2e] font-bold">題目博覽會 W4</span>
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
                <div className="mb-12">
                    <LessonMap data={W4Data} />
                </div>
            )}

            {/* PAGE HEADER */}
            <header className="mb-16">
                <div className="text-[11px] font-mono text-[#2d5be3] mb-3 tracking-[0.06em] uppercase">🖼 W4 · 研究規劃</div>
                <h1 className="font-serif text-4xl font-bold leading-tight text-[#1a1a2e] mb-4 tracking-tight">
                    題目博覽會：<span className="text-[#2d5be3] italic">找回動機 → 真正定案</span>
                </h1>
                <p className="text-base text-[#4a4a6a] max-w-[680px] leading-relaxed mb-10">
                    W3 的定案是題目，W4 的任務是補上「為什麼」。先把研究動機整理清楚，再帶著動機做海報、走 Gallery Walk——讓別人 30 秒內懂你在研究什麼、為什麼要研究。
                </p>

                {/* COURSE ARC */}
                <CourseArc items={W4Data.courseArc} />

                {/* META STRIP */}
                <div className="meta-strip">
                    {W4Data.metaCards.map((item, idx) => (
                        <div key={idx} className="meta-item">
                            <div className="meta-label">{item.label}</div>
                            <div className="meta-value">{item.value}</div>
                        </div>
                    ))}
                </div>

                {/* 本週簡報 */}
                <div className="flex justify-end mb-8 -mt-2">
                    <a
                        href="https://www.canva.com/design/DAG_fvz_ltA/9mk0-f069kZftd9CAscZwg/view?utm_content=DAG_fvz_ltA&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=hcc21326267"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold tracking-wider text-[#8888aa] hover:text-[#1a1a2e] bg-[#f8f7f4] hover:bg-[#f0ede6] border border-[#dddbd5] hover:border-[#1a1a2e]/20 px-3 py-1.5 rounded-[5px] transition-all"
                    >
                        📊 本週簡報 ↗
                    </a>
                </div>
            </header>

            {/* CONCEPT */}
            <div className="section-head">
                <h2>學什麼</h2>
                <div className="line"></div>
                <span className="mono">CONCEPT</span>
            </div>
            <p className="section-desc">W1–W3 你找到了題目，W4 要補上「為什麼」——把三週的好奇心整理成一段說得出口的研究動機，然後公開驗證。</p>

            {/* W1-W4 Journey */}
            <div className="content-grid grid-cols-2 md:grid-cols-4 mb-14">
                {[
                    { wk: 'W1', icon: '👀', title: '找到畫面', desc: '什麼讓你好奇？找到那個讓你停下來的畫面。', past: true },
                    { wk: 'W2', icon: '❓', title: '形成問題', desc: '把畫面轉成問題，問出 Why / How / What。', past: true },
                    { wk: 'W3', icon: '🎯', title: '定案題目', desc: '把問題磨成可以做的研究題目，通過 5W1H 快篩。', past: true },
                    { wk: 'W4', icon: '💡', title: '找回動機', desc: '把題目連回你的好奇心，整理成說得出口的研究動機。', now: true },
                ].map((item) => (
                    <div key={item.wk} className={`p-5 flex flex-col gap-2 ${item.now ? 'bg-[#1a1a2e] text-white' : 'bg-white'}`}>
                        <div className={`font-mono text-xl font-bold ${item.now ? 'text-[#c9a84c]' : 'text-[#2d5be3]'}`}>{item.wk}</div>
                        <div className="text-xl">{item.icon}</div>
                        <div className={`font-bold text-[13px] ${item.now ? 'text-white' : 'text-[#1a1a2e]'}`}>{item.title}</div>
                        <div className={`text-[11px] leading-relaxed ${item.now ? 'text-white/60' : 'text-[#8888aa]'}`}>{item.desc}</div>
                    </div>
                ))}
            </div>

            {/* ─────────────── 第一節課 ─────────────── */}
            <div className="section-head">
                <h2>第一節課</h2>
                <div className="line"></div>
                <span className="mono">PERIOD 1 · 50 MINS</span>
            </div>

            {/* PART 0: 研究動機整理 */}
            <div className="border border-[#dddbd5] rounded-xl overflow-hidden bg-white mb-8">
                <div className="p-4 px-5 bg-[#1a1a2e] flex items-center gap-3">
                    <Brain size={16} className="text-[#c9a84c]" />
                    <span className="font-bold text-sm text-white">Part 0｜研究動機整理</span>
                    <span className="ml-auto font-mono text-[10px] text-white/50">0:05–0:35 · 30 分鐘</span>
                </div>

                <div className="divide-y divide-[#dddbd5]">
                    {/* Step 0 */}
                    <div className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="bg-[#f0ede6] text-[#1a1a2e] text-[10px] font-mono font-bold px-2 py-0.5 rounded">STEP 0</span>
                            <span className="font-bold text-[13px] text-[#1a1a2e]">自己回答三個問題</span>
                            <span className="ml-auto font-mono text-[10px] text-[#8888aa]">3 分鐘 · 不准用 AI</span>
                        </div>
                        <p className="text-[12px] text-[#4a4a6a] mb-4 leading-relaxed">翻出 W3 學習單，看你的最終定案題目。然後靠自己回答以下三個問題——不管格式，用跟朋友聊天的方式說。</p>
                        <div className="bg-[#f8f7f4] rounded-lg border border-[#dddbd5] overflow-hidden">
                            <div className="grid grid-cols-2 bg-[#1a1a2e] text-white text-[10px] font-mono uppercase tracking-wider">
                                <div className="px-4 py-2">問題</div>
                                <div className="px-4 py-2 border-l border-white/10">我的回答（在學習單上寫）</div>
                            </div>
                            {[
                                '我最早是從什麼畫面或生活經歷來的？',
                                '哪裡讓我覺得奇怪或困惑？',
                                '我最想知道的答案是什麼？',
                            ].map((q, i) => (
                                <div key={i} className={`grid grid-cols-2 text-[12px] border-t border-[#dddbd5] ${i % 2 === 0 ? 'bg-white' : 'bg-[#f8f7f4]'}`}>
                                    <div className="px-4 py-3 text-[#1a1a2e] font-medium">{q}</div>
                                    <div className="px-4 py-3 border-l border-[#dddbd5] text-[#8888aa] italic text-[11px]">（學習單 Step 0 填寫）</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Step 1 */}
                    <div className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="bg-[#f0ede6] text-[#1a1a2e] text-[10px] font-mono font-bold px-2 py-0.5 rounded">STEP 1</span>
                            <span className="font-bold text-[13px] text-[#1a1a2e]">自己先寫白話版動機</span>
                            <span className="ml-auto font-mono text-[10px] text-[#8888aa]">5 分鐘 · 不准用 AI</span>
                        </div>
                        <p className="text-[12px] text-[#4a4a6a] mb-4 leading-relaxed">根據剛才三個問題，用自己的話把研究動機寫出來。<strong>3 到 5 句話就好</strong>，不用管學術格式，就像跟朋友解釋一樣。</p>
                        <div className="notice notice-gold text-[12px]">
                            💡 <strong>好的研究動機三要素：</strong>有具體畫面、有說出困惑、說得清楚你想知道什麼。三個都有，這段動機就夠用了。
                        </div>
                    </div>

                    {/* Step 2 */}
                    <div className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="bg-[#2d5be3] text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded">STEP 2</span>
                            <span className="font-bold text-[13px] text-[#1a1a2e]">送給研究動機教練審核</span>
                            <span className="ml-auto font-mono text-[10px] text-[#8888aa]">14 分鐘</span>
                        </div>
                        <p className="text-[12px] text-[#4a4a6a] mb-5 leading-relaxed">
                            打開「研究動機教練」，告訴它<strong>「我已經寫好了」</strong>，然後把你的 W3 定案題目和 Step 1 的白話版動機一起貼給它。
                            它會幫你審核，告訴你哪裡可以更強。根據回饋，決定要不要修改。
                        </p>
                        <a
                            href="https://gemini.google.com/gem/1ujK5kRzW8QFNEtWa8F5mq0b_9JL4iDFx?usp=sharing"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-start gap-4 p-5 border border-[#dddbd5] rounded-xl hover:border-[#2d5be3] hover:shadow-lg hover:shadow-[#2d5be3]/5 transition-all bg-[#f8f7f4] hover:bg-white mb-4"
                        >
                            <div className="w-10 h-10 rounded-lg bg-[#f0ede6] flex items-center justify-center text-xl shrink-0 group-hover:bg-[#2d5be3] transition-colors">🤖</div>
                            <div className="flex-1 min-w-0">
                                <div className="font-bold text-[#1a1a2e] text-[13px] mb-0.5">研究動機教練</div>
                                <div className="text-[10px] font-mono text-[#8888aa] uppercase tracking-wider mb-2">Gemini Gem · 對話式審核</div>
                                <div className="text-[12px] text-[#4a4a6a] leading-relaxed">從你的定案題目出發，幫你審核動機的三個要素，整理成一段你說得出口的研究動機。</div>
                                <div className="mt-2 text-[11px] font-mono font-bold text-[#2d5be3]">開啟 Gemini Gem ↗</div>
                            </div>
                        </a>
                        <div className="notice notice-accent text-[12px]">
                            ⚠️ 教練給你回饋，<strong>選擇還是你來做</strong>。你自己的版本如果說得出口，直接用就好——AI 的版本是備用，不是標準答案。
                        </div>
                    </div>

                    {/* Step 3: 我的選擇 */}
                    <div className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="bg-[#f0ede6] text-[#1a1a2e] text-[10px] font-mono font-bold px-2 py-0.5 rounded">STEP 3</span>
                            <span className="font-bold text-[13px] text-[#1a1a2e]">我的選擇</span>
                        </div>
                        <div className="bg-[#f8f7f4] rounded-lg border border-[#dddbd5] overflow-hidden">
                            <div className="grid grid-cols-2 bg-[#1a1a2e] text-white text-[10px] font-mono uppercase tracking-wider">
                                <div className="px-4 py-2">選擇選項</div>
                                <div className="px-4 py-2 border-l border-white/10">說明與理由（學習單填寫）</div>
                            </div>
                            {[
                                { opt: '✅ 我的版本不用改，直接用', desc: '直接用 Step 1 的白話版——說得出口就夠了' },
                                { opt: '🔀 我參考教練的融合一版', desc: '根據回饋自己修改，取中間版本' },
                                { opt: '🤖 選教練給的動機版本', desc: '我選這個的理由：（在學習單填寫）' },
                            ].map((row, i) => (
                                <div key={i} className={`grid grid-cols-2 text-[12px] border-t border-[#dddbd5] ${i % 2 === 0 ? 'bg-white' : 'bg-[#f8f7f4]'}`}>
                                    <div className="px-4 py-3 text-[#1a1a2e] font-medium">{row.opt}</div>
                                    <div className="px-4 py-3 border-l border-[#dddbd5] text-[#8888aa] italic text-[11px]">{row.desc}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 確認定案 */}
                    <div className="p-6 bg-[#f8f7f4]">
                        <div className="flex items-center gap-3 mb-3">
                            <Target size={15} className="text-[#2e7d5a]" />
                            <span className="font-bold text-[13px] text-[#1a1a2e]">確認定案</span>
                            <span className="ml-auto font-mono text-[10px] text-[#8888aa]">0:30–0:35 · 5 分鐘</span>
                        </div>
                        <p className="text-[12px] text-[#4a4a6a] leading-relaxed mb-3">
                            靶心框填好了嗎？<strong>把你的研究動機唸一遍給旁邊同學聽</strong>——不是背，是說給他聽。
                            他能不能在 <strong>30 秒內</strong>理解你為什麼要研究這個？能的話，這段動機完成了。
                        </p>
                        <div className="border-2 border-dashed border-[#2e7d5a]/40 rounded-xl p-4 bg-white">
                            <div className="text-[11px] font-mono text-[#2e7d5a] uppercase tracking-wider mb-2">🎯 我的 W4 研究動機定案（在學習單上填寫）</div>
                            <div className="text-[12px] text-[#8888aa] italic">研究動機有具體畫面、有困惑、說得出想知道什麼……</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* PART 1: 海報製作 */}
            <div className="border border-[#dddbd5] rounded-xl overflow-hidden bg-white mb-16">
                <div className="p-4 px-5 bg-[#f0ede6] border-b border-[#dddbd5] flex items-center gap-3">
                    <Zap size={15} className="text-[#1a1a2e]" />
                    <span className="font-bold text-[13px] text-[#1a1a2e]">Part 1｜海報製作</span>
                    <span className="ml-auto font-mono text-[10px] text-[#8888aa]">0:35–0:50 · 15 分鐘</span>
                </div>
                <div className="p-6">
                    <p className="text-[13px] text-[#4a4a6a] mb-6 leading-relaxed">
                        海報是你研究的廣告——目的是讓等一下走讀的同學 <strong>30 秒內</strong>看懂你在研究什麼、為什麼研究。海報四格：<strong>標題 / 副標（正式題目）/ 研究動機 / 製作人姓名班級座號</strong>。
                    </p>

                    {/* 範例海報 */}
                    <div className="mb-7">
                        <div className="text-[11px] font-mono text-[#8888aa] uppercase tracking-wider mb-3 flex items-center gap-2">
                            <span className="inline-block w-3 h-px bg-[#dddbd5]"></span>
                            範例海報（同學真實作品）
                            <span className="inline-block flex-1 h-px bg-[#dddbd5]"></span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-2">
                            {/* 左：實體手寫照片 */}
                            <div className="flex flex-col items-center gap-2">
                                <div className="border-2 border-[#dddbd5] rounded-xl overflow-hidden shadow-sm w-full">
                                    <img
                                        src="/images/user_research_poster.png"
                                        alt="同學手寫海報範例"
                                        className="w-full object-cover"
                                    />
                                </div>
                                <div className="text-[10px] font-mono text-[#8888aa]">▲ 實體手寫版</div>
                            </div>
                            {/* 右：數位卡片版 */}
                            <div className="flex flex-col items-center gap-2">
                                <div className="border-2 border-[#dddbd5] rounded-xl overflow-hidden bg-white w-full shadow-sm">
                                    {/* 海報主體 */}
                                    <div className="p-6 space-y-4">
                                        {/* 標題 */}
                                        <div>
                                            <div className="text-[10px] font-mono text-[#8888aa] uppercase mb-1.5">① 吸引人的標題</div>
                                            <div className="font-bold text-[20px] leading-tight text-[#1a1a2e]">
                                                「機」不可失眠——<br />滑手機真的讓你睡更差嗎？
                                            </div>
                                        </div>
                                        {/* 副標 */}
                                        <div>
                                            <div className="text-[10px] font-mono text-[#8888aa] uppercase mb-1">② 副標 · 正式研究題目</div>
                                            <div className="text-[12px] text-[#4a4a6a] leading-relaxed">
                                                本校高一生睡前手機使用內容類型與睡眠品質之差異研究
                                            </div>
                                        </div>
                                        {/* 研究動機 */}
                                        <div>
                                            <div className="text-[10px] font-mono text-[#8888aa] uppercase mb-1">③ 研究動機</div>
                                            <div className="text-[12px] text-[#4a4a6a] leading-relaxed">
                                                每次說好「滑一下就睡」，結果一抬頭已經快12點。隔天上課眼皮超重，但我不確定是睡太晚的問題，還是「滑手機這件事本身」讓大腦沒辦法關機。我還發現自己看影片比看限動更難停下來——所以我想知道：睡前滑不同類型的內容，對隔天的狀態影響一樣嗎？
                                            </div>
                                        </div>
                                        {/* 製作人 */}
                                        <div className="flex items-center justify-between pt-2 border-t border-[#dddbd5]">
                                            <div className="text-[10px] font-mono text-[#8888aa] uppercase">④ 製作人</div>
                                            <div className="text-[12px] font-bold text-[#1a1a2e]">王小明 101-15</div>
                                        </div>
                                    </div>
                                    {/* 同學回饋區 */}
                                    <div className="border-t-2 border-dashed border-[#dddbd5] px-6 py-3 bg-[#f8f7f4]">
                                        <div className="text-[10px] font-mono text-[#8888aa] uppercase mb-2">同學回饋區</div>
                                        <div className="space-y-2">
                                            {[1,2,3].map(n => (
                                                <div key={n} className="h-5 border-b border-dotted border-[#dddbd5]" />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-[10px] font-mono text-[#8888aa]">▲ 數位對照版</div>
                            </div>
                        </div>
                        <div className="text-center text-[10px] font-mono text-[#8888aa] mt-1">好的海報讓人 30 秒看懂「你研究什麼」和「為什麼研究」</div>
                    </div>

                    {/* Poster fields */}
                    <div className="content-grid grid-cols-2 md:grid-cols-4 mb-6">
                        {[
                            { n: '①', l: '吸引人的標題', d: '口語問句，讓人一眼停下來' },
                            { n: '②', l: '正式研究題目', d: 'W3 定案版本（副標）' },
                            { n: '③', l: '研究動機', d: '靶心框的定案版本直接抄' },
                            { n: '④', l: '製作人資訊', d: '姓名 / 班級 / 座號', h: true },
                        ].map(item => (
                            <div key={item.n} className={`p-5 flex flex-col gap-2 ${item.h ? 'bg-[#1a1a2e] text-white' : 'bg-[#f8f7f4]'}`}>
                                <div className={`font-mono text-xl font-bold ${item.h ? 'text-[#c9a84c]' : 'text-[#2d5be3]'}`}>{item.n}</div>
                                <div className={`font-bold text-[13px] ${item.h ? 'text-white' : 'text-[#1a1a2e]'}`}>{item.l}</div>
                                <div className={`text-[11px] leading-relaxed ${item.h ? 'text-white/50' : 'text-[#8888aa]'}`}>{item.d}</div>
                            </div>
                        ))}
                    </div>

                    {/* Step 0: Draft */}
                    <div className="mb-5">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="bg-[#f0ede6] text-[#1a1a2e] text-[10px] font-mono font-bold px-2 py-0.5 rounded">STEP 0</span>
                            <span className="font-bold text-[13px] text-[#1a1a2e]">自主草稿</span>
                            <span className="ml-auto font-mono text-[10px] text-[#8888aa]">3 分鐘 · 不准用 AI</span>
                        </div>
                        <p className="text-[12px] text-[#4a4a6a]">先靠自己想一個口語標題，不用完美，就是你對這個研究的直覺說法。</p>
                    </div>

                    {/* Step 2: AI Title Optimization */}
                    <div className="border border-[#dddbd5] rounded-xl overflow-hidden mb-5">
                        <div className="p-4 px-5 bg-[#f8f7f4] border-b border-[#dddbd5] flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <span className="bg-[#2d5be3] text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded">STEP 2</span>
                                <span className="font-bold text-[13px] text-[#1a1a2e]">問 AI 優化標題</span>
                                <span className="font-mono text-[10px] text-[#8888aa]">5 分鐘</span>
                            </div>
                            <CopyButton text={titlePrompt} label="複製 Prompt" />
                        </div>
                        <div className="p-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-[11px] font-mono text-[#8888aa] mb-2 uppercase">W3 定案題目</label>
                                    <input
                                        type="text"
                                        value={w3Topic}
                                        onChange={(e) => setW3Topic(e.target.value)}
                                        placeholder="貼上你的正式研究題目..."
                                        className="w-full p-3 bg-[#f8f7f4] border border-[#dddbd5] rounded-lg text-sm focus:outline-none focus:border-[#2d5be3]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-mono text-[#8888aa] mb-2 uppercase">Step 0 標題草稿</label>
                                    <input
                                        type="text"
                                        value={titleDraft}
                                        onChange={(e) => setTitleDraft(e.target.value)}
                                        placeholder="貼上你的直覺標題..."
                                        className="w-full p-3 bg-[#f8f7f4] border border-[#dddbd5] rounded-lg text-sm focus:outline-none focus:border-[#2d5be3]"
                                    />
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="block text-[11px] font-mono text-[#8888aa] mb-2 uppercase">研究動機（Part 0 定案版本）</label>
                                <textarea
                                    value={myMotivation}
                                    onChange={(e) => setMyMotivation(e.target.value)}
                                    placeholder="貼上你的研究動機定案版本..."
                                    rows={3}
                                    className="w-full p-3 bg-[#f8f7f4] border border-[#dddbd5] rounded-lg text-sm focus:outline-none focus:border-[#2d5be3] resize-none"
                                />
                            </div>
                            <div className="p-4 bg-[#f8f7f4] rounded-lg border border-dashed border-[#dddbd5] font-mono text-[11px] text-[#4a4a6a] whitespace-pre-wrap">
                                {titlePrompt}
                            </div>
                        </div>
                    </div>

                    {/* Step 3 */}
                    <div className="notice notice-success text-[12px]">
                        ✏️ <strong>Step 3：手寫海報（5 分鐘）</strong>——在 A4 紙上完成四格。研究動機那格，把靶心框裡的定案版本直接抄過去，不用重寫。
                    </div>
                </div>
            </div>

            {/* ─────────────── 第二節課 ─────────────── */}
            <div className="section-head">
                <h2>第二節課</h2>
                <div className="line"></div>
                <span className="mono">PERIOD 2 · 50 MINS</span>
            </div>
            <p className="section-desc">帶著你的海報，在教室內進行走讀驗證。每組 4 人輪流坐鎮報告，其他人順時針移動聆聽。重點是說出「你為什麼要研究這個」。</p>

            {/* 前置作業：分配場次 */}
            <div className="border border-[#dddbd5] rounded-xl overflow-hidden bg-white mb-6">
                <div className="p-4 px-5 bg-[#f0ede6] border-b border-[#dddbd5] flex items-center gap-3">
                    <Users2 size={15} className="text-[#1a1a2e]" />
                    <span className="font-bold text-[13px] text-[#1a1a2e]">前置作業：分配場次</span>
                    <span className="ml-auto font-mono text-[10px] text-[#8888aa]">0:00–0:03 · 3 分鐘</span>
                </div>
                <div className="p-5 space-y-4">
                    <p className="text-[13px] text-[#4a4a6a] leading-relaxed">
                        Gallery Walk 開始前，每組 4 人先分配報告場次：
                        <span className="font-bold text-[#1a1a2e]"> 誰是第 1 場、第 2 場、第 3 場、第 4 場的報告者。</span>
                        每人只報告 1 次，但會聆聽 3 次。
                    </p>
                    <div className="bg-[#f8f7f4] rounded-lg border border-[#dddbd5] overflow-hidden">
                        <div className="grid grid-cols-3 bg-[#1a1a2e] text-white text-[10px] font-mono uppercase tracking-wider">
                            <div className="px-4 py-2">場次</div>
                            <div className="px-4 py-2 border-l border-white/10">誰坐鎮報告</div>
                            <div className="px-4 py-2 border-l border-white/10">其他人去哪裡</div>
                        </div>
                        {[
                            { round: '第 1 場', stay: 'A 坐鎮報告', move: 'B、C、D → 第二組聆聽' },
                            { round: '第 2 場', stay: 'B 回來坐鎮', move: 'C、D → 第三組，A 也追過去' },
                            { round: '第 3 場', stay: 'C 回來坐鎮', move: 'D → 第四組，A、B 也追過去' },
                            { round: '第 4 場', stay: 'D 回來坐鎮', move: 'A、B、C → 繼續往下走' },
                        ].map((row, i) => (
                            <div key={i} className={`grid grid-cols-3 text-[12px] border-t border-[#dddbd5] ${i % 2 === 0 ? 'bg-white' : 'bg-[#f8f7f4]'}`}>
                                <div className="px-4 py-2.5 font-mono font-bold text-[#2d5be3]">{row.round}</div>
                                <div className="px-4 py-2.5 border-l border-[#dddbd5] text-[#1a1a2e] font-bold">{row.stay}</div>
                                <div className="px-4 py-2.5 border-l border-[#dddbd5] text-[#4a4a6a]">{row.move}</div>
                            </div>
                        ))}
                    </div>
                    <div className="flex flex-col gap-1.5 text-[12px] text-[#4a4a6a]">
                        <p><span className="font-bold text-[#1a1a2e]">報告者：</span>輪到你的場次 → 回到自己的桌子坐鎮，說你的<strong>研究動機與題目</strong>（重點是「為什麼」）</p>
                        <p><span className="font-bold text-[#1a1a2e]">聆聽者：</span>認真聽，把建議直接寫在對方海報上 → 🔔 鈴聲響，繼續往下一組移動</p>
                    </div>
                </div>
            </div>

            {/* 四場輪次卡片 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                {W4Data.galleryWalkRounds.map(item => (
                    <div className="bg-[#f8f7f4] border border-[#dddbd5] rounded-xl p-5" key={item.n}>
                        <div className="font-mono text-[11px] text-[#8888aa] mb-1">{item.time}</div>
                        <div className="font-mono text-lg font-bold text-[#2d5be3] mb-1">{item.n}</div>
                        <div className="inline-block font-mono text-[9px] px-1.5 py-0.5 rounded mb-2 bg-[#fdecea] text-[#c0392b]">
                            {item.who}
                        </div>
                        <div className="text-[12px] text-[#4a4a6a] leading-relaxed">{item.d}</div>
                    </div>
                ))}
            </div>

            <div className="notice notice-accent mb-8">
                🔔 <strong>計時提醒</strong>：每一場 5 分鐘，鈴聲響立刻移動。輪到你報告時回到自己的桌子坐鎮。
            </div>

            {/* 評論規則 */}
            <div className="flex items-center gap-3 mb-4">
                <span className="section-label !mb-0">留下建議</span>
                <span className="text-[10px] font-mono text-[#8888aa] uppercase tracking-wider">Gallery Walk 的評論規則</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {W4Data.commentRules.map((rule, idx) => (
                    <div key={idx} className="bg-white border border-[#dddbd5] rounded-xl p-5 flex flex-col gap-3">
                        <div className="flex items-center gap-2 font-bold text-[#1a1a2e]">
                            {rule.type === 'positive' && <CheckCircle2 size={16} className="text-[#2e7d5a]" />}
                            {rule.type === 'suggestion' && <Lightbulb size={16} className="text-[#c9a84c]" />}
                            {rule.type === 'question' && <MessageSquare size={16} className="text-[#2d5be3]" />}
                            <span>{rule.label}</span>
                        </div>
                        <p className="text-[11px] text-[#8888aa] leading-relaxed">{rule.desc}</p>
                    </div>
                ))}
            </div>

            <div className="notice notice-gold mb-16 text-[12px]">
                💡 <strong>建議怎麼寫：說具體的。</strong>例如「研究動機有畫面，讚」或「Who 可以再縮小」。<strong>不要只寫「很好」或「加油」。</strong>
            </div>

            {/* PART 2: 題目最終定案 */}
            <div className="border border-[#dddbd5] rounded-xl overflow-hidden bg-white mb-16">
                <div className="p-4 px-5 bg-[#1a1a2e] flex items-center gap-3">
                    <Target size={16} className="text-[#c9a84c]" />
                    <span className="font-bold text-sm text-white">Part 2｜題目最終定案</span>
                    <span className="ml-auto font-mono text-[10px] text-white/50">0:33–0:48 · 15 分鐘</span>
                </div>
                <div className="p-6 space-y-6">
                    <p className="text-[13px] text-[#4a4a6a] leading-relaxed">
                        看看海報上同學給你的建議，花 2 分鐘想想要不要採納。然後在學習單 Part 2 填入你的 W4 最終版——<strong>這個題目和研究動機，會跟著你到學期末。</strong>
                    </p>
                    {/* Gallery Walk 建議紀錄表 */}
                    <div className="bg-[#f8f7f4] rounded-lg border border-[#dddbd5] overflow-hidden mb-4">
                        <div className="grid grid-cols-[2rem_1fr_5rem_1fr] bg-[#1a1a2e] text-white text-[10px] font-mono uppercase tracking-wider">
                            <div className="px-3 py-2">#</div>
                            <div className="px-4 py-2 border-l border-white/10">同學或老師給的建議內容</div>
                            <div className="px-3 py-2 border-l border-white/10 text-center">是否採納</div>
                            <div className="px-4 py-2 border-l border-white/10">理由</div>
                        </div>
                        {[1, 2, 3].map((n) => (
                            <div key={n} className={`grid grid-cols-[2rem_1fr_5rem_1fr] text-[12px] border-t border-[#dddbd5] ${n % 2 === 0 ? 'bg-[#f8f7f4]' : 'bg-white'}`}>
                                <div className="px-3 py-3 font-mono font-bold text-[#2d5be3]">{n}</div>
                                <div className="px-4 py-3 border-l border-[#dddbd5] text-[#8888aa] italic text-[11px]">（在學習單填寫）</div>
                                <div className="px-3 py-3 border-l border-[#dddbd5] text-[#8888aa] text-[10px] text-center">是 ／ 否</div>
                                <div className="px-4 py-3 border-l border-[#dddbd5] text-[#8888aa] italic text-[11px]">（在學習單填寫）</div>
                            </div>
                        ))}
                    </div>
                    <div className="p-5 bg-[#f8f7f4] rounded-xl border-2 border-dashed border-[#2e7d5a]/40">
                        <div className="text-[11px] font-mono text-[#2e7d5a] uppercase mb-3">🎯 W4 個人最終定案</div>
                        <div className="space-y-2 text-[12px] text-[#8888aa] italic">
                            <p>最終研究題目：＿＿＿＿＿＿＿＿＿</p>
                            <p>最終研究動機：＿＿＿＿＿＿＿＿＿</p>
                        </div>
                    </div>
                    <div className="notice notice-success text-[12px]">
                        🏆 <strong>從 W1 到 W4，你完成了問題形成的完整旅程：</strong>W1 找畫面 → W2 形成問題 → W3 定案題目 → W4 連回動機。你手上這個題目和動機，是真正屬於你的。
                    </div>
                </div>
            </div>

            {/* AI 教練 */}
            <div className="mb-16">
                <div className="flex items-center gap-3 mb-4">
                    <span className="section-label !mb-0">AI 教練</span>
                    <span className="text-[10px] font-mono text-[#8888aa] uppercase tracking-wider">Gemini Gems · 對話式輔助工具</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <a
                        href="https://gemini.google.com/gem/1ujK5kRzW8QFNEtWa8F5mq0b_9JL4iDFx?usp=sharing"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group p-5 border border-[#dddbd5] rounded-xl hover:border-[#2d5be3] hover:shadow-lg hover:shadow-[#2d5be3]/5 transition-all bg-white"
                    >
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-lg bg-[#f0ede6] flex items-center justify-center text-xl shrink-0 group-hover:bg-[#2d5be3] transition-colors">🤖</div>
                            <div className="flex-1 min-w-0">
                                <div className="font-bold text-[#1a1a2e] text-[13px] mb-0.5">研究動機教練</div>
                                <div className="text-[10px] font-mono text-[#8888aa] uppercase tracking-wider mb-2">W1–W3 回顧整理 · Part 0 Step 2 使用</div>
                                <div className="text-[12px] text-[#4a4a6a] leading-relaxed">從你的定案題目出發，幫你把三週的觀察與好奇心串連起來，整理成一段你說得出口的研究動機。</div>
                                <div className="mt-3 text-[11px] font-mono font-bold text-[#2d5be3]">開啟 Gemini Gem ↗</div>
                            </div>
                        </div>
                    </a>
                    <a
                        href="https://gemini.google.com/gem/1yF7FqRoQWUQGBtFLrGvbuul61OMGbgAv?usp=sharing"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group p-5 border border-[#dddbd5] rounded-xl hover:border-[#2d5be3] hover:shadow-lg hover:shadow-[#2d5be3]/5 transition-all bg-white"
                    >
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-lg bg-[#f0ede6] flex items-center justify-center text-xl shrink-0 group-hover:bg-[#2d5be3] transition-colors">💬</div>
                            <div className="flex-1 min-w-0">
                                <div className="font-bold text-[#1a1a2e] text-[13px] mb-0.5">Q-Coach 問題意識教練</div>
                                <div className="text-[10px] font-mono text-[#8888aa] uppercase tracking-wider mb-2">問題聚焦 × 題目優化</div>
                                <div className="text-[12px] text-[#4a4a6a] leading-relaxed">幫助你從生活觀察中發展出具體可行的研究題目，透過對話式提問與檢核，引導聚焦問題意識、並優化研究方向。</div>
                                <div className="mt-3 text-[11px] font-mono font-bold text-[#2d5be3]">開啟 Gemini Gem ↗</div>
                            </div>
                        </div>
                    </a>
                </div>
            </div>

            {/* PART 3: AI-RED 記錄 */}
            <div className="border border-[#dddbd5] rounded-xl overflow-hidden bg-white mb-16">
                <div className="p-4 px-5 bg-[#f0ede6] border-b border-[#dddbd5] flex items-center gap-3">
                    <span className="text-base">🤖</span>
                    <span className="font-bold text-[13px] text-[#1a1a2e]">Part 3｜AI-RED 記錄</span>
                    <span className="ml-auto font-mono text-[10px] text-[#8888aa]">完成後填寫</span>
                </div>
                <div className="bg-[#f8f7f4] rounded-lg border border-[#dddbd5] overflow-hidden m-5">
                    <div className="grid grid-cols-[6rem_1fr] bg-[#1a1a2e] text-white text-[10px] font-mono uppercase tracking-wider">
                        <div className="px-4 py-2">項目</div>
                        <div className="px-4 py-2 border-l border-white/10">內容記錄（請在學習單填寫具體資訊）</div>
                    </div>
                    {[
                        { key: 'A · Agent', val: '我使用了 ChatGPT / Claude / Gemini / 其他' },
                        { key: 'I · Interaction', val: '我問了 AI：（填入具體提問）' },
                        { key: 'R · Review', val: '我的評估：合理 ／ 有問題 ／ 部分合理' },
                        { key: 'E · Evaluation', val: '原因說明：（為什麼這樣評估）' },
                        { key: 'D · Dialogue', val: '對話名稱：（截圖或記錄對話）' },
                    ].map((row, i) => (
                        <div key={i} className={`grid grid-cols-[6rem_1fr] text-[12px] border-t border-[#dddbd5] ${i % 2 === 0 ? 'bg-white' : 'bg-[#f8f7f4]'}`}>
                            <div className="px-4 py-3 font-mono font-bold text-[#2d5be3] text-[10px]">{row.key}</div>
                            <div className="px-4 py-3 border-l border-[#dddbd5] text-[#8888aa] italic text-[11px]">{row.val}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* WRAP-UP & HOMEWORK */}
            <div className="section-head">
                <h2>本週總結</h2>
                <div className="line"></div>
                <span className="mono">WRAP-UP</span>
            </div>

            <div className="border border-[#dddbd5] rounded-xl overflow-hidden bg-white mb-6">
                <div className="p-4 bg-[#f0ede6] border-b border-[#dddbd5] font-bold text-sm text-[#1a1a2e]">
                    ✅ 本週結束，你應該要會
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#dddbd5] bg-[#dddbd5]">
                    <div className="p-4 px-6 bg-white text-[13px] text-[#4a4a6a]">✓ 說得出「我為什麼要研究這個」</div>
                    <div className="p-4 px-6 bg-white text-[13px] text-[#4a4a6a]">✓ 研究動機有具體畫面、有困惑、說得出想知道什麼</div>
                    <div className="p-4 px-6 bg-white text-[13px] text-[#4a4a6a]">✓ 完成手寫海報（四格）</div>
                    <div className="p-4 px-6 bg-white text-[13px] text-[#4a4a6a]">✓ 確認 W4 最終定案題目與研究動機</div>
                </div>
            </div>

            <div className="border border-[#dddbd5] rounded-xl overflow-hidden bg-white mb-16">
                <div className="p-4 bg-[#f0ede6] border-b border-[#dddbd5] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="bg-[#1a1a2e] text-white text-[10px] font-mono px-2 py-0.5 rounded">HOMEWORK</span>
                        <span className="font-bold text-sm text-[#1a1a2e]">本週作業</span>
                    </div>
                    <span className="text-[11px] font-bold text-[#c0392b]">截止：{W4Data.homework.deadline}</span>
                </div>
                <div className="divide-y divide-[#dddbd5]">
                    {W4Data.homework.items.map((hw, idx) => (
                        <div className="p-4 px-6 flex items-center gap-6" key={idx}>
                            <span className="font-mono text-[11px] font-bold text-[#2d5be3] w-16 shrink-0">{hw.p}</span>
                            <span className="text-[13px] text-[#4a4a6a]">{hw.n}</span>
                        </div>
                    ))}
                </div>
                <div className="p-4 px-6 bg-[#f8f7f4] border-t border-[#dddbd5] flex items-center justify-between text-[12px]">
                    <span className="text-[#8888aa]">{W4Data.homework.footer}</span>
                    <a href="https://classroom.google.com/" target="_blank" rel="noopener noreferrer" className="text-[#2d5be3] font-bold hover:underline">→ Google Classroom</a>
                </div>
            </div>

            {/* NEXT WEEK PREVIEW */}
            <div className="next-week-preview">
                <div className="next-week-header">
                    <span className="next-week-badge">NEXT WEEK</span>
                    <h3 className="next-week-title">W5 預告</h3>
                </div>
                <div className="next-week-content">
                    <div className="next-week-col">
                        <div className="next-week-label">W5 主題</div>
                        <p className="next-week-text">文獻搜尋入門——為你的研究找到 3 篇真實可信的相關研究。</p>
                    </div>
                    <div className="next-week-col border-l border-white/5">
                        <div className="next-week-label">你會學到</div>
                        <p className="next-week-text">用<strong className="text-white underline decoration-[#c9a84c] underline-offset-4">華藝資料庫</strong>找論文、AI 生成關鍵字、寫 APA 格式。</p>
                    </div>
                </div>
            </div>

            {/* NAVIGATION */}
            <div className="flex justify-between items-center py-12 border-t border-[#dddbd5]">
                <Link to="/w3" className="text-[13px] font-bold text-[#8888aa] hover:text-[#1a1a2e] flex items-center gap-2 transition-colors">
                    <ArrowLeft size={16} /> 回 W3 題目健檢
                </Link>
                <Link to="/w5" className="bg-[#1a1a2e] text-white px-8 py-3 rounded-lg text-[13px] font-bold hover:bg-[#2d5be3] transition-all flex items-center gap-2 group shadow-lg shadow-[#1a1a2e]/10">
                    前往 W5 文獻搜尋入門 <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>
        </div>
    );
};
