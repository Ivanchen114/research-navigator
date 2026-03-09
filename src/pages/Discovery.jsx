import React, { useState } from 'react';
import {
    Eye,
    Search,
    Zap,
    CheckCircle2,
    AlertCircle,
    Flame,
    Ghost,
    ChevronDown,
    ChevronUp,
    Brain,
    Flag,
    Lock,
    MessageCircle,
    Layout,
    Clock,
    ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const Discovery = () => {
    // Interaction states
    const [revealed, setRevealed] = useState({
        trial1: false,
        turtle1: false,
        turtle2: false
    });

    const toggleReveal = (key) => {
        setRevealed(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div className="min-h-screen bg-[#f8f7f4] text-[#1a1a2e] font-sans">
            {/* 
        NOTE: We are skipping the Sidebar and Topbar from the provided HTML 
        because they are already handled by the global App layout. 
        We focus on the .content section logic.
      */}

            <div className="p-12 max-w-[920px] mx-auto animate-in fade-in duration-700">

                {/* HEADER */}
                <div className="text-[11px] font-mono text-[#2d5be3] mb-3 tracking-wider">🕵️ W0 · 前導課程</div>
                <h1 className="font-serif text-4xl font-bold leading-tight text-[#1a1a2e] mb-2 tracking-tight">
                    偵探特訓班：<span className="text-[#2d5be3] italic not-serif">The Detective Camp</span>
                </h1>
                <p className="text-[15px] text-[#4a4a6a] leading-relaxed mb-8 max-w-[600px]">
                    研究不是死讀書，研究是現場辦案。今天你不是學生，你是偵探——三個試煉，三把劍，找出真相。
                </p>

                {/* META STRIP */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-[1px] bg-[#dddbd5] border border-[#dddbd5] rounded-[10px] overflow-hidden mb-12 shadow-sm">
                    <div className="bg-white p-4 text-center md:text-left">
                        <div className="text-[10px] font-mono text-[#8888aa] tracking-widest uppercase mb-1">本週任務</div>
                        <div className="text-[13px] font-bold text-[#1a1a2e]">偵探試煉 · Level 0</div>
                    </div>
                    <div className="bg-white p-4 text-center md:text-left">
                        <div className="text-[10px] font-mono text-[#8888aa] tracking-widest uppercase mb-1">課堂產出</div>
                        <div className="text-[13px] font-bold text-[#1a1a2e]">三把劍筆記</div>
                    </div>
                    <div className="bg-white p-4 text-center md:text-left">
                        <div className="text-[10px] font-mono text-[#8888aa] tracking-widest uppercase mb-1">下週預告</div>
                        <div className="text-[13px] font-bold text-[#1a1a2e]">W1 模仿遊戲 + AI-RED</div>
                    </div>
                </div>

                {/* ══ 學什麼 ══ */}
                <div className="flex items-center gap-3 mb-5 mt-12">
                    <h2 className="font-serif text-[18px] font-bold text-[#1a1a2e] whitespace-nowrap">學什麼</h2>
                    <div className="flex-1 h-[1px] bg-[#dddbd5]"></div>
                    <div className="font-mono text-[10px] text-[#8888aa] tracking-widest whitespace-nowrap uppercase">Concept</div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
                    {[
                        { num: '第一把劍', icon: '🔍', name: '觀察力', en: 'Observation', desc: '看見問題的眼。眼睛盯著螢幕，不代表你看見了真相。研究者必須訓練自己看見別人沒看見的東西。' },
                        { num: '第二把劍', icon: '🧪', name: '假設檢定', en: 'Hypothesis Testing', desc: '先提假設，再蒐集證據，再修正假設。不要反過來——不能先看答案再解釋。' },
                        { num: '第三把劍', icon: '🧠', name: '批判思考', en: 'Critical Thinking', desc: '識破謊言的心。表面的答案不一定是真正的答案。你的任務是挑戰一切理所當然。' }
                    ].map((sword, i) => (
                        <div key={i} className="border border-[#dddbd5] rounded-[10px] bg-white overflow-hidden transition-all hover:border-[#2d5be3]/30">
                            <div className="px-4 pt-3 font-mono text-[10px] text-[#2d5be3] tracking-widest uppercase">{sword.num}</div>
                            <div className="p-4 pt-2">
                                <div className="text-3xl mb-2">{sword.icon}</div>
                                <div className="font-serif text-base font-bold text-[#1a1a2e] mb-0.5">{sword.name}</div>
                                <div className="font-mono text-[10px] text-[#8888aa] mb-2 tracking-wider">{sword.en}</div>
                                <p className="text-xs text-[#4a4a6a] leading-relaxed">{sword.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ══ 練什麼 ══ */}
                <div className="flex items-center gap-3 mb-5 mt-12">
                    <h2 className="font-serif text-[18px] font-bold text-[#1a1a2e] whitespace-nowrap">練什麼</h2>
                    <div className="flex-1 h-[1px] bg-[#dddbd5]"></div>
                    <div className="font-mono text-[10px] text-[#8888aa] tracking-widest whitespace-nowrap uppercase">Practice</div>
                </div>

                {/* 試煉一 */}
                <div className="border border-[#dddbd5] rounded-[10px] overflow-hidden bg-white mb-4">
                    <div className="px-5 py-3.5 bg-[#f0ede6] border-b border-[#dddbd5] flex items-center gap-2.5">
                        <span className="font-mono text-[10px] bg-[#1a1a2e] text-white px-2 py-0.5 rounded-[3px] tracking-wider uppercase">試煉一</span>
                        <span className="font-bold text-sm text-[#1a1a2e]">專注力測試——看見真相了嗎？</span>
                        <span className="text-[12px] text-[#8888aa] ml-auto">不注意視盲實驗</span>
                    </div>
                    <div className="p-5">
                        <div className="border-l-4 border-[#2d5be3] px-4 py-3 bg-[#e8eeff] text-[13px] text-[#4a4a6a] leading-relaxed rounded-r-[6px] mb-4">
                            🎬 觀看影片，專心數<strong>白衣人</strong>一共傳了幾次球。
                        </div>

                        <div className="font-mono text-[10px] text-[#8888aa] tracking-[0.1em] uppercase mb-2.5">影片結束後，回答以下問題</div>

                        <div className="flex flex-col gap-2 mb-4">
                            {[
                                { emoji: '🦍', text: '你有看到大猩猩走進畫面嗎？' },
                                { emoji: '🟥', text: '你有看到背景窗簾顏色改變嗎？' },
                                { emoji: '🚶', text: '你有看到黑衣人悄悄離場嗎？' }
                            ].map((q, i) => (
                                <div key={i} className="border border-[#dddbd5] rounded-[6px] px-4 py-3 bg-white flex items-center gap-3">
                                    <span className="text-xl">{q.emoji}</span>
                                    <span className="text-[13px] text-[#1a1a2e] font-medium">{q.text}</span>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={() => toggleReveal('trial1')}
                            className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 bg-[#e8eeff] border border-[#2d5be3]/20 rounded-[5px] text-[#2d5be3] text-xs font-mono tracking-wide transition-colors hover:bg-[#dce6ff] mb-2.5"
                        >
                            {revealed.trial1 ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                            {revealed.trial1 ? '收起解說' : '看實驗解說'}
                        </button>

                        {revealed.trial1 && (
                            <div className="border border-[#dddbd5] rounded-[8px] overflow-hidden animate-in slide-in-from-top-2 duration-300">
                                <div className="px-4 py-3 bg-[#f0ede6] border-b border-[#dddbd5] text-[12px] font-bold text-[#1a1a2e]">💡 這就是「不注意視盲」</div>
                                <div className="p-4 text-[13px] text-[#4a4a6a] leading-relaxed bg-white">
                                    當你專注在一件事上，眼睛會<strong>自動過濾掉</strong>其他資訊——就算大猩猩從你眼前走過，你也看不見。<br /><br />
                                    研究者必須對抗這個天性。<strong>第一把劍：觀察力</strong>，就是訓練你看見別人沒看見的東西。
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* 試煉二 */}
                <div className="border border-[#dddbd5] rounded-[10px] overflow-hidden bg-white mb-4">
                    <div className="px-5 py-3.5 bg-[#f0ede6] border-b border-[#dddbd5] flex items-center gap-2.5">
                        <span className="font-mono text-[10px] bg-[#1a1a2e] text-white px-2 py-0.5 rounded-[3px] tracking-wider uppercase">試煉二</span>
                        <span className="font-bold text-sm text-[#1a1a2e]">海龜湯遊戲——邏輯與假設</span>
                        <span className="text-[12px] text-[#8888aa] ml-auto">先假設，再提問</span>
                    </div>
                    <div className="p-5">
                        {/* Level 1 */}
                        <div className="border-2 border-[#1a1a2e] rounded-[8px] overflow-hidden mb-4 shadow-sm">
                            <div className="px-4 py-2 bg-[#1a1a2e] text-white font-mono text-[11px] tracking-widest flex items-center gap-2">
                                <span className="bg-white/15 px-1.5 py-0.5 rounded-[3px] text-[10px]">Level 1</span>
                                奇怪的考試
                            </div>
                            <div className="p-4 bg-white text-sm font-bold text-[#1a1a2e] leading-relaxed">
                                小明寫字速度飛快，交出的卻是一份<span className="text-[#2d5be3]">白卷</span>，但他得到了<span className="text-[#2d5be3]">滿分 100 分</span>。
                            </div>
                            <div className="px-4 py-2.5 bg-[#f0ede6] text-[12px] text-[#4a4a6a] border-t border-[#dddbd5] flex items-center gap-1.5">
                                <MessageCircle size={14} className="text-[#8888aa]" /> 📌 規則：只能問是／否問題。
                            </div>
                        </div>

                        <button
                            onClick={() => toggleReveal('turtle1')}
                            className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 bg-[#e8eeff] border border-[#2d5be3]/20 rounded-[5px] text-[#2d5be3] text-xs font-mono tracking-wide mb-4 transition-colors hover:bg-[#dce6ff]"
                        >
                            {revealed.turtle1 ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                            {revealed.turtle1 ? '收起答案' : '看答案'}
                        </button>

                        {revealed.turtle1 && (
                            <div className="mb-5 animate-in slide-in-from-top-2 duration-300">
                                <div className="border border-[#dddbd5] rounded-[6px] overflow-hidden">
                                    <div className="px-4 py-2 bg-[#e8f5ee] text-[12px] font-bold text-[#2e7d5a] border-b border-[#2e7d5a]/15 flex items-center gap-1.5">
                                        <CheckCircle2 size={14} /> ✓ 真相揭曉
                                    </div>
                                    <div className="p-3.5 text-[13px] text-[#4a4a6a] leading-relaxed bg-white">
                                        這是一場「打字速度測驗」。評分標準是速度，不是內容。白卷反而是最快的。
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Level 2 */}
                        <div className="border-2 border-[#1a1a2e] rounded-[8px] overflow-hidden mb-4 shadow-sm">
                            <div className="px-4 py-2 bg-[#1a1a2e] text-white font-mono text-[11px] tracking-widest flex items-center gap-2">
                                <span className="bg-white/15 px-1.5 py-0.5 rounded-[3px] text-[10px]">Level 2</span>
                                沙漠中的半根火柴
                            </div>
                            <div className="p-4 bg-white text-sm font-bold text-[#1a1a2e] leading-relaxed">
                                沙漠中央躺著一具屍體，手裡握著<span className="text-[#2d5be3]">半根火柴</span>，周圍沒有任何足跡。
                            </div>
                            <div className="px-4 py-2.5 bg-[#f0ede6] text-[12px] text-[#4a4a6a] border-t border-[#dddbd5] flex items-center gap-1.5">
                                <AlertCircle size={14} className="text-[#8888aa]" /> ⚠️ 規則升級：必須先<strong>寫下你的假設</strong>，再提問。不能直接猜答案。
                            </div>
                        </div>

                        <button
                            onClick={() => toggleReveal('turtle2')}
                            className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 bg-[#e8eeff] border border-[#2d5be3]/20 rounded-[5px] text-[#2d5be3] text-xs font-mono tracking-wide transition-colors hover:bg-[#dce6ff]"
                        >
                            {revealed.turtle2 ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                            {revealed.turtle2 ? '收起答案' : '看答案'}
                        </button>

                        {revealed.turtle2 && (
                            <div className="mt-4 animate-in slide-in-from-top-2 duration-300">
                                <div className="border border-[#dddbd5] rounded-[6px] overflow-hidden mb-2.5">
                                    <div className="px-4 py-2 bg-[#e8f5ee] text-[12px] font-bold text-[#2e7d5a] border-b border-[#2e7d5a]/15 flex items-center gap-1.5">
                                        <CheckCircle2 size={14} /> ✓ 真相揭曉
                                    </div>
                                    <div className="p-3.5 text-[13px] text-[#4a4a6a] leading-relaxed bg-white">
                                        一群人搭熱氣球迷路，因為超重必須有人跳下。大家抽籤，這個人抽到最短的那根——半根火柴。沒有足跡，因為他是從空中落下的。
                                    </div>
                                </div>
                                <div className="border-l-[3px] border-[#2d5be3] p-3.5 bg-[#e8eeff] text-[12px] text-[#4a4a6a] leading-relaxed rounded-r-[6px]">
                                    ⚔️ <strong>第二把劍登場：</strong>你注意到了嗎？Level 2 要你先寫假設再提問——這就是假設檢定的核心。先猜方向，再蒐集證據，再修正猜測。<br /><br />
                                    ⚔️ <strong>第三把劍登場：</strong>你有沒有懷疑過「為什麼一定是熱氣球」？能對看似合理的答案提出挑戰，就是批判思考。
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* 試煉三 */}
                <div className="border border-[#dddbd5] rounded-[10px] overflow-hidden bg-white mb-10">
                    <div className="px-5 py-3.5 bg-[#f0ede6] border-b border-[#dddbd5] flex items-center gap-2.5">
                        <span className="font-mono text-[10px] bg-[#1a1a2e] text-white px-2 py-0.5 rounded-[3px] tracking-wider uppercase">試煉三</span>
                        <span className="font-bold text-sm text-[#1a1a2e]">挑戰全知者——AI 的盲點</span>
                        <span className="text-[12px] text-[#8888aa] ml-auto">問 AI 它回答不了的問題</span>
                    </div>
                    <div className="p-5">
                        <div className="border-l-[3px] border-[#c9a84c] px-4 py-3 bg-[#fdf6e3] text-[13px] text-[#4a4a6a] leading-relaxed rounded-r-[6px] mb-4">
                            現場實測：把以下三個問題丟給 AI，看看它怎麼回答。
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 mb-4">
                            {[
                                { tag: '在地知識', q: '松山高中福利社今天賣什麼？', ans: 'AI：我沒有這個資訊…' },
                                { tag: '在地知識', q: '我們學校最嚴格的老師是誰？', ans: 'AI：我無法得知特定學校的…' },
                                { tag: '個人知識', q: '我今天早餐吃什麼？', ans: 'AI：我沒有關於你個人的…' }
                            ].map((item, i) => (
                                <div key={i} className="border border-[#dddbd5] rounded-[8px] p-3.5 bg-white transition-all hover:border-[#2d5be3]/20">
                                    <div className="font-mono text-[10px] text-[#c0392b] bg-[#fdecea] border border-[#c0392b]/20 px-2 py-0.5 rounded-[3px] inline-block mb-2 uppercase tracking-wide">{item.tag}</div>
                                    <div className="text-[13px] font-bold text-[#1a1a2e] leading-snug mb-2">{item.q}</div>
                                    <div className="mt-2 py-2 px-2.5 bg-[#f0ede6] rounded-[5px] text-[11px] text-[#8888aa] italic">{item.ans}</div>
                                </div>
                            ))}
                        </div>

                        <div className="border border-[#dddbd5] rounded-[8px] overflow-hidden">
                            <div className="px-4 py-3 bg-[#f0ede6] border-b border-[#dddbd5] text-[12px] font-bold text-[#1a1a2e]">💡 研究者的價值在哪裡？</div>
                            <div className="p-4 text-[13px] text-[#4a4a6a] leading-relaxed bg-white">
                                AI 擅長回答全球性的一般知識。但它不知道<strong>在地的、個人的、此時此刻的</strong>真相。<br /><br />
                                研究者的價值，就是發現 AI 不知道的事。這就是為什麼你要親自<strong>調查、訪談、觀察</strong>——沒有人能代替你去現場。
                            </div>
                        </div>
                    </div>
                </div>

                {/* ══ 課堂任務 ══ */}
                <div className="flex items-center gap-3 mb-5">
                    <h2 className="font-serif text-[18px] font-bold text-[#1a1a2e] whitespace-nowrap">課堂任務</h2>
                    <div className="flex-1 h-[1px] bg-[#dddbd5]"></div>
                    <div className="font-mono text-[10px] text-[#8888aa] tracking-widest whitespace-nowrap uppercase">In-Class</div>
                </div>

                <div className="border border-[#dddbd5] rounded-[10px] overflow-hidden bg-white mb-4">
                    <div className="px-5 py-3.5 bg-[#f0ede6] border-b border-[#dddbd5] flex items-center gap-2.5">
                        <span className="font-mono text-[10px] bg-[#2d5be3] text-white px-2 py-0.5 rounded-[3px] tracking-wider uppercase">TASK 1</span>
                        <span className="font-bold text-sm text-[#1a1a2e]">海龜湯攻防</span>
                    </div>
                    <div className="p-4 px-5 text-[13px] text-[#4a4a6a] leading-loose">
                        Level 2 的提問，每個人至少要問一個問題。<br /><br />
                        <ol className="list-decimal pl-5 flex flex-col gap-1">
                            <li>先在紙上寫下你的假設（猜方向，不是猜答案）</li>
                            <li>根據假設，設計你的是／否問題</li>
                            <li>聽到線索後，更新你的假設</li>
                            <li>重複，直到找出真相</li>
                        </ol>
                        <div className="mt-4 border-l-[3px] border-[#2d5be3] p-3 bg-[#e8eeff] rounded-r-[6px]">
                            🏅 問出關鍵<strong>變項</strong>的人加分。直接問「他是被推下去的嗎？」不算——要問的是讓你縮小範圍的問題。
                        </div>
                    </div>
                </div>

                <div className="border border-[#dddbd5] rounded-[10px] overflow-hidden bg-white mb-10">
                    <div className="px-5 py-3.5 bg-[#f0ede6] border-b border-[#dddbd5] flex items-center gap-2.5">
                        <span className="font-mono text-[10px] bg-[#2d5be3] text-white px-2 py-0.5 rounded-[3px] tracking-wider uppercase">TASK 2</span>
                        <span className="font-bold text-sm text-[#1a1a2e]">三把劍筆記</span>
                    </div>
                    <div className="p-4 px-5 text-[13px] text-[#4a4a6a] leading-loose">
                        用<strong>自己的話</strong>，在學習單上寫下三把劍各是什麼意思。不能抄黑板，要用你聽懂的話說。<br /><br />
                        <ol className="list-decimal pl-5 flex flex-col gap-1">
                            <li>觀察力：我的理解是…</li>
                            <li>假設檢定：我的理解是…</li>
                            <li>批判思考：我的理解是…</li>
                        </ol>
                    </div>
                </div>

                {/* ══ 本週總結 ══ */}
                <div className="flex items-center gap-3 mb-5">
                    <h2 className="font-serif text-[18px] font-bold text-[#1a1a2e] whitespace-nowrap">本週總結</h2>
                    <div className="flex-1 h-[1px] bg-[#dddbd5]"></div>
                    <div className="font-mono text-[10px] text-[#8888aa] tracking-widest whitespace-nowrap uppercase">Week Wrap-up</div>
                </div>

                {/* 學會什麼 */}
                <div className="border border-[#dddbd5] rounded-[10px] overflow-hidden bg-white mb-4">
                    <div className="px-5 py-3.5 bg-[#f0ede6] border-b border-[#dddbd5] font-bold text-sm text-[#1a1a2e] flex items-center gap-2">
                        <CheckCircle2 size={16} className="text-[#2e7d5a]" /> ✅ 本週結束，你應該要會
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-[1px] bg-[#dddbd5]">
                        {[
                            '說出什麼是不注意視盲，並解釋它和研究的關係',
                            '用自己的話說明三把劍：觀察力、假設檢定、批判思考',
                            '解釋為什麼研究者的價值在於發現 AI 不知道的事',
                            '在海龜湯完成至少一次假設 → 提問 → 修正的循環'
                        ].map((item, i) => (
                            <div key={i} className="bg-white p-4.5 flex gap-2.5 items-start">
                                <span className="text-[#2e7d5a] text-sm shrink-0 mt-0.5">✓</span>
                                <span className="text-[13px] text-[#4a4a6a] leading-relaxed">{item}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 座右銘 */}
                <div className="border-2 border-[#1a1a2e] rounded-[10px] p-6 bg-[#1a1a2e] flex flex-wrap items-center justify-around gap-4 mb-4 shadow-md">
                    {[
                        { icon: '👁', title: '保持好奇', sub: 'Stay Curious' },
                        { icon: '🔎', title: '尋找證據', sub: 'Seek Evidence' },
                        { icon: '🛡', title: '不被騙', sub: 'Think Critically' }
                    ].map((motto, i) => (
                        <React.Fragment key={i}>
                            <div className="text-center group">
                                <div className="text-2xl mb-1.5 transition-transform group-hover:scale-110 duration-300">{motto.icon}</div>
                                <div className="font-serif text-[15px] font-bold text-white uppercase tracking-wide">{motto.title}</div>
                                <div className="text-[11px] text-white/50 mt-0.5 font-mono tracking-wider">{motto.sub}</div>
                            </div>
                            {i < 2 && <div className="hidden md:block w-[1px] h-12 bg-white/15"></div>}
                        </React.Fragment>
                    ))}
                </div>

                {/* 下週預告 */}
                <div className="border border-white/10 rounded-[10px] overflow-hidden bg-[#1a1a2e] mb-12 shadow-inner">
                    <div className="px-5 py-3.5 border-b border-white/5 flex items-center gap-2.5">
                        <span className="font-mono text-[10px] bg-white/10 text-white/70 px-2 py-0.5 rounded-[3px] tracking-widest uppercase">Next Week</span>
                        <span className="font-bold text-sm text-white">W1 預告</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-[1px] bg-white/5">
                        <div className="bg-[#1a1a2e] p-5">
                            <div className="font-mono text-[10px] text-white/30 tracking-widest mb-1.5 uppercase">W1 上半節</div>
                            <div className="text-[13px] text-white/80 leading-relaxed">模仿遊戲——7 份作品裡有 1 份是 AI 寫的，你找得出來嗎？</div>
                        </div>
                        <div className="bg-[#1a1a2e] p-5">
                            <div className="font-mono text-[10px] text-white/30 tracking-widest mb-1.5 uppercase">W1 下半節</div>
                            <div className="text-[13px] text-white/80 leading-relaxed">
                                <span className="text-white font-bold">簽署 AI-RED 公約</span> + 人機協作現場演示。不用帶任何東西，準時來就好。
                            </div>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <div className="flex justify-between items-center py-12 border-t border-[#dddbd5]">
                    <div />
                    <Link to="/w1" className="bg-[#1a1a2e] text-white px-8 py-3 rounded-[6px] text-[13px] font-bold hover:bg-[#2a2a4a] transition-all flex items-center gap-2 group">
                        前往 W1 模仿遊戲 <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

            </div>
        </div>
    );
};


