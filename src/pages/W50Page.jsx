import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Map, ArrowRight, ArrowLeft, CheckCircle2,
    BookOpen, Search, Bot, FileText, AlertTriangle, Info
} from 'lucide-react';
import LessonMap from '../components/ui/LessonMap';
import CopyButton from '../components/ui/CopyButton';
import { W50Data } from '../data/lessonMaps';

/* ─────────────────── helpers ─────────────────── */
const colorMap = {
    r: { bg: 'bg-[#fdecea]', border: 'border-[#f5c6c0]', text: 'text-[#c0392b]', num: 'bg-[#c0392b]' },
    g: { bg: 'bg-[#eafaf1]', border: 'border-[#b2dfcc]', text: 'text-[#1e7e4c]', num: 'bg-[#1e7e4c]' },
    c: { bg: 'bg-[#eaf1fd]', border: 'border-[#b2c9f5]', text: 'text-[#2d5be3]', num: 'bg-[#2d5be3]' },
};

const gradeLevels = [
    {
        grade: 'A', color: 'bg-[#1e7e4c]', label: 'A 級｜可以當主要證據',
        examples: '碩博士論文、同儕審查期刊',
        note: '今天的目標'
    },
    {
        grade: 'B', color: 'bg-[#2d5be3]', label: 'B 級｜輔助參考',
        examples: '專家專書、官方報告',
        note: '今天的目標'
    },
    {
        grade: 'C', color: 'bg-[#c9a84c]', label: 'C 級｜找方向用，不能當證據',
        examples: '科普網站、維基百科',
        note: '幫你找關鍵字，但不能引用'
    },
    {
        grade: 'D', color: 'bg-[#c0392b]', label: 'D 級｜不採用',
        examples: 'AI 生成的假文獻、內容農場',
        note: 'W5.1 會教你辨識'
    },
];

/* ─────────────────── component ─────────────────── */
export const W50Page = () => {
    const [showLessonMap, setShowLessonMap] = useState(false);
    const [myTopic, setMyTopic] = useState('');
    const [kw1, setKw1] = useState('');
    const [kw2, setKw2] = useState('');
    const [kw3, setKw3] = useState('');

    /* Part 1 找到的第一篇文獻 */
    const [lit1Title, setLit1Title] = useState('');
    const [lit1Author, setLit1Author] = useState('');
    const [lit1Year, setLit1Year] = useState('');

    /* Part 3 APA 格式 */
    const [apa1, setApa1] = useState('');
    const [apa2, setApa2] = useState('');
    const [apa3, setApa3] = useState('');

    /* AI 關鍵字 prompt */
    const keywordPrompt =
        `我的研究題目是：${myTopic || '【填入你的 W4 定案題目】'}

請幫我：
1. 列出 5–8 個適合在華藝資料庫搜尋的中文關鍵字
2. 給我對應的英文關鍵字
3. 建議哪些關鍵字組合最有效

請用表格呈現。`;

    return (
        <div className="page-container animate-in-fade-slide">

            {/* TOP BAR */}
            <div className="flex items-center justify-between border-b border-[#dddbd5] pb-4 mb-12">
                <div className="text-[11px] font-mono text-[#8888aa] flex items-center gap-2">
                    研究方法與專題 / 研究規劃 / <span className="text-[#1a1a2e] font-bold">文獻搜尋入門 W5.0</span>
                </div>
                <div className="flex items-center gap-4">
                    <span className="bg-[#f0ede6] text-[#1a1a2e] text-[10px] font-bold px-2 py-0.5 rounded-[2px] font-mono">100 MINS</span>
                    <button
                        onClick={() => setShowLessonMap(!showLessonMap)}
                        className="text-[11px] text-[#8888aa] hover:text-[#2d5be3] transition-colors flex items-center gap-1 font-mono"
                    >
                        <Map size={12} /> {showLessonMap ? 'Hide Plan' : 'Instructor View'}
                    </button>
                    <span className="bg-[#1a1a2e] text-white text-[10px] font-bold px-2 py-0.5 rounded-[2px] font-mono">AI-GREEN · B</span>
                </div>
            </div>

            {showLessonMap && (
                <div className="mb-12">
                    <LessonMap data={W50Data} />
                </div>
            )}

            {/* PAGE HEADER */}
            <header className="mb-16">
                <div className="text-[11px] font-mono text-[#2d5be3] mb-3 tracking-[0.06em] uppercase">📚 W5.0 · 研究規劃</div>
                <h1 className="font-serif text-4xl font-bold leading-tight text-[#1a1a2e] mb-4 tracking-tight">
                    文獻搜尋入門：<span className="text-[#2d5be3] italic">找對資料，打好地基</span>
                </h1>
                <p className="text-base text-[#4a4a6a] max-w-[680px] leading-relaxed mb-10">
                    W4 完成了題目與研究動機的定案。W5.0 的任務是往前走一步：為自己的研究找到文獻基礎。
                    這週只做一件事——<strong>找到 3 篇真實可信的相關研究</strong>。真偽鑑識和引用倫理留到 W5.1，這週先建立「找文獻」的基本操作能力。
                </p>

                {/* COURSE ARC */}
                <div className="mb-10">
                    <div className="text-[11px] font-mono text-[#8888aa] mb-4 uppercase tracking-wider">課程弧線 · 你在哪裡</div>
                    <div className="arc-grid">
                        {W50Data.courseArc.map((item, idx) => (
                            <div key={idx} className={`arc-item ${item.past ? 'past' : item.now ? 'now' : ''}`}>
                                <div className="arc-wk">{item.wk} {item.now && '← 現在'}</div>
                                <div className="arc-name">{item.name.split('\n').map((line, i) => <div key={i}>{line}</div>)}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* META STRIP */}
                <div className="meta-strip">
                    {W50Data.metaCards.map((card, i) => (
                        <div className="meta-card" key={i}>
                            <div className="meta-label">{card.label}</div>
                            <div className="meta-value">{card.value}</div>
                        </div>
                    ))}
                </div>

                {/* CORE CONCEPTS */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-10">
                    {W50Data.coreConcepts.map((c, i) => {
                        const cl = colorMap[c.colorConfig];
                        return (
                            <div key={i} className={`${cl.bg} border ${cl.border} rounded-lg p-5`}>
                                <div className={`inline-flex items-center justify-center w-6 h-6 rounded-full ${cl.num} text-white text-[11px] font-bold mb-3`}>
                                    {i + 1}
                                </div>
                                <div className={`text-[13px] font-bold ${cl.text} mb-1`}>{c.title}</div>
                                <div className="text-[11px] text-[#8888aa] mb-2 font-mono">{c.subtitle}</div>
                                <div className="text-[12px] text-[#4a4a6a] leading-relaxed">{c.desc}</div>
                            </div>
                        );
                    })}
                </div>
            </header>

            {/* ── PART 0：我的定案題目 ── */}
            <section className="mb-16">
                <div className="flex items-center gap-3 mb-6">
                    <span className="bg-[#1a1a2e] text-white text-[11px] font-bold px-3 py-1 rounded-full font-mono">PART 0</span>
                    <h2 className="text-[18px] font-bold text-[#1a1a2e]">我的 W4 定案題目</h2>
                </div>
                <div className="bg-[#f0ede6] rounded-lg p-6 border border-[#dddbd5]">
                    <div className="text-[12px] font-mono text-[#8888aa] mb-2">從 W4 帶來 · 今天的出發點</div>
                    <input
                        type="text"
                        value={myTopic}
                        onChange={e => setMyTopic(e.target.value)}
                        placeholder="填入你的 W4 最終定案題目，方便後面自動帶入 AI prompt…"
                        className="w-full bg-white border border-[#dddbd5] rounded px-4 py-3 text-[14px] text-[#1a1a2e] placeholder-[#b0b0c0] focus:outline-none focus:ring-2 focus:ring-[#2d5be3]/30"
                    />
                    <p className="text-[11px] text-[#8888aa] mt-2">填完後，下方的 AI prompt 會自動帶入你的題目。</p>
                </div>
            </section>

            {/* ═══════════════════════════════════
                第一節：為什麼要找文獻 + 華藝操作
            ═══════════════════════════════════ */}
            <div className="flex items-center gap-3 mb-8">
                <div className="h-px flex-1 bg-[#dddbd5]" />
                <span className="text-[11px] font-mono font-bold text-[#8888aa] px-4 py-1.5 bg-[#f0ede6] rounded-full border border-[#dddbd5] tracking-wider">第一節 · 50 分鐘</span>
                <div className="h-px flex-1 bg-[#dddbd5]" />
            </div>

            {/* ── 為什麼要找文獻 ── */}
            <section className="mb-12">
                <div className="flex items-center gap-2 mb-5">
                    <BookOpen size={16} className="text-[#2d5be3]" />
                    <h2 className="text-[16px] font-bold text-[#1a1a2e]">為什麼要找文獻？</h2>
                    <span className="text-[11px] font-mono text-[#8888aa]">0:05–0:12</span>
                </div>

                {/* 三個理由 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    {[
                        { n: '01', title: '避免重複', desc: '別人已經做過的，你不用再做一遍。但你要先知道別人做過什麼，才能找到你的切入點。', icon: '🔄' },
                        { n: '02', title: '學方法', desc: '別人怎麼設計問卷、怎麼訪談、怎麼分析——你可以學。', icon: '🛠️' },
                        { n: '03', title: '支持論點', desc: '你的研究動機說「我發現這個現象」，文獻幫你說「其他研究也發現類似的事」，讓你的研究站得住腳。', icon: '🏛️' },
                    ].map(item => (
                        <div key={item.n} className="bg-white border border-[#dddbd5] rounded-lg p-5">
                            <div className="text-2xl mb-3">{item.icon}</div>
                            <div className="text-[11px] font-mono text-[#2d5be3] font-bold mb-1">理由 {item.n}</div>
                            <div className="text-[14px] font-bold text-[#1a1a2e] mb-2">{item.title}</div>
                            <div className="text-[12px] text-[#4a4a6a] leading-relaxed">{item.desc}</div>
                        </div>
                    ))}
                </div>

                {/* 文獻等級 */}
                <div className="border border-[#dddbd5] rounded-lg overflow-hidden">
                    <div className="bg-[#1a1a2e] px-6 py-3 flex items-center gap-2">
                        <span className="text-white text-[13px] font-bold">文獻等級快速說明</span>
                        <span className="text-[#8888aa] text-[11px] font-mono ml-auto">今天目標：A 或 B 級</span>
                    </div>
                    <div className="divide-y divide-[#dddbd5]">
                        {gradeLevels.map(g => (
                            <div key={g.grade} className="flex items-center gap-4 px-6 py-4">
                                <span className={`${g.color} text-white text-[12px] font-bold w-8 h-8 rounded-full flex items-center justify-center shrink-0`}>{g.grade}</span>
                                <div className="flex-1">
                                    <div className="text-[13px] font-bold text-[#1a1a2e]">{g.label}</div>
                                    <div className="text-[11px] text-[#4a4a6a]">{g.examples}</div>
                                </div>
                                <div className="text-[11px] font-mono text-[#8888aa] text-right">{g.note}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── 華藝資料庫操作 ── */}
            <section className="mb-12">
                <div className="flex items-center gap-2 mb-5">
                    <Search size={16} className="text-[#2d5be3]" />
                    <h2 className="text-[16px] font-bold text-[#1a1a2e]">華藝資料庫搜尋步驟</h2>
                    <span className="text-[11px] font-mono text-[#8888aa]">0:12–0:25</span>
                </div>
                <div className="bg-[#f0ede6] rounded-lg p-6 border border-[#dddbd5] mb-6">
                    <div className="text-[12px] font-mono text-[#8888aa] mb-4">以「本校高一生手機使用與睡眠品質的關係」為示範題目</div>
                    <div className="space-y-4">
                        {[
                            { step: 'Step 1', label: '列出關鍵字', tip: '手機使用 ／ 睡眠品質 ／ 高中生' },
                            { step: 'Step 2', label: '搜尋', tip: '輸入關鍵字，先看搜到幾篇' },
                            { step: 'Step 3', label: '加限制條件', tip: '台灣研究 + 近 5 年 + 碩博士論文 → 大幅縮小結果' },
                            { step: 'Step 4', label: '看標題和摘要', tip: '先看標題，再看摘要最後一段「本研究發現」，確認跟你的題目有交集，再下載全文' },
                        ].map((s, i) => (
                            <div key={i} className="flex items-start gap-4">
                                <span className="bg-[#1a1a2e] text-white text-[10px] font-bold px-2 py-0.5 rounded font-mono shrink-0 mt-0.5">{s.step}</span>
                                <div>
                                    <span className="text-[13px] font-bold text-[#1a1a2e]">{s.label}</span>
                                    <span className="text-[12px] text-[#4a4a6a] ml-2">{s.tip}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* AI 幻覺警告 */}
                <div className="bg-[#fdecea] border border-[#f5c6c0] rounded-lg p-5 flex items-start gap-4">
                    <AlertTriangle size={18} className="text-[#c0392b] shrink-0 mt-0.5" />
                    <div>
                        <div className="text-[13px] font-bold text-[#c0392b] mb-1">⚠️ AI 找文獻的陷阱</div>
                        <p className="text-[12px] text-[#4a4a6a] leading-relaxed">
                            AI 會給你格式完美、看起來真實、但<strong>根本不存在</strong>的假論文——作者是假的、標題是假的、期刊是假的。這叫做 <strong>AI 幻覺</strong>。
                            今天找到的文獻，都要親自在華藝或 Google Scholar 查證，確認作者存在、摘要存在，才算數。
                        </p>
                        <div className="text-[11px] font-mono text-[#c0392b] mt-2">W5.1 會專門練習辨識假文獻。今天先記住：AI 找到的一定要查證。</div>
                    </div>
                </div>
            </section>

            {/* ── PART 1：學生實作 ── */}
            <section className="mb-16">
                <div className="flex items-center gap-3 mb-6">
                    <span className="bg-[#2d5be3] text-white text-[11px] font-bold px-3 py-1 rounded-full font-mono">PART 1</span>
                    <h2 className="text-[18px] font-bold text-[#1a1a2e]">華藝資料庫查找練習</h2>
                    <span className="text-[11px] font-mono text-[#8888aa]">0:25–0:50</span>
                </div>
                <div className="bg-white border border-[#dddbd5] rounded-lg overflow-hidden">
                    <div className="bg-[#f0ede6] px-6 py-3 border-b border-[#dddbd5]">
                        <span className="text-[12px] font-bold text-[#1a1a2e]">我的關鍵字</span>
                        <span className="text-[11px] text-[#8888aa] ml-3">從定案題目提取 3 個核心概念</span>
                    </div>
                    <div className="p-6">
                        <div className="grid grid-cols-3 gap-4 mb-6">
                            {[
                                { label: '關鍵字 1', val: kw1, set: setKw1 },
                                { label: '關鍵字 2', val: kw2, set: setKw2 },
                                { label: '關鍵字 3', val: kw3, set: setKw3 },
                            ].map((kw, i) => (
                                <div key={i}>
                                    <div className="text-[11px] font-mono text-[#8888aa] mb-1">{kw.label}</div>
                                    <input
                                        type="text"
                                        value={kw.val}
                                        onChange={e => kw.set(e.target.value)}
                                        placeholder={['手機使用', '睡眠品質', '高中生'][i]}
                                        className="w-full border border-[#dddbd5] rounded px-3 py-2 text-[13px] text-[#1a1a2e] placeholder-[#c0c0d0] focus:outline-none focus:ring-2 focus:ring-[#2d5be3]/30"
                                    />
                                </div>
                            ))}
                        </div>

                        <div className="text-[11px] font-mono text-[#8888aa] mb-2">找到的第一篇研究（稍後補到 3 篇）</div>
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <div className="text-[11px] font-mono text-[#8888aa] mb-1">標題</div>
                                <input type="text" value={lit1Title} onChange={e => setLit1Title(e.target.value)}
                                    placeholder="論文或期刊標題"
                                    className="w-full border border-[#dddbd5] rounded px-3 py-2 text-[13px] text-[#1a1a2e] placeholder-[#c0c0d0] focus:outline-none focus:ring-2 focus:ring-[#2d5be3]/30" />
                            </div>
                            <div>
                                <div className="text-[11px] font-mono text-[#8888aa] mb-1">作者</div>
                                <input type="text" value={lit1Author} onChange={e => setLit1Author(e.target.value)}
                                    placeholder="王小華"
                                    className="w-full border border-[#dddbd5] rounded px-3 py-2 text-[13px] text-[#1a1a2e] placeholder-[#c0c0d0] focus:outline-none focus:ring-2 focus:ring-[#2d5be3]/30" />
                            </div>
                            <div>
                                <div className="text-[11px] font-mono text-[#8888aa] mb-1">年份</div>
                                <input type="text" value={lit1Year} onChange={e => setLit1Year(e.target.value)}
                                    placeholder="2022"
                                    className="w-full border border-[#dddbd5] rounded px-3 py-2 text-[13px] text-[#1a1a2e] placeholder-[#c0c0d0] focus:outline-none focus:ring-2 focus:ring-[#2d5be3]/30" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════
                第二節：AI 協作 + APA
            ═══════════════════════════════════ */}
            <div className="flex items-center gap-3 mb-8">
                <div className="h-px flex-1 bg-[#dddbd5]" />
                <span className="text-[11px] font-mono font-bold text-[#8888aa] px-4 py-1.5 bg-[#f0ede6] rounded-full border border-[#dddbd5] tracking-wider">第二節 · 50 分鐘</span>
                <div className="h-px flex-1 bg-[#dddbd5]" />
            </div>

            {/* ── PART 2：AI 關鍵字協作 ── */}
            <section className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                    <span className="bg-[#1e7e4c] text-white text-[11px] font-bold px-3 py-1 rounded-full font-mono">PART 2</span>
                    <h2 className="text-[18px] font-bold text-[#1a1a2e]">AI 關鍵字生成協作</h2>
                    <span className="text-[11px] font-mono text-[#8888aa]">0:00–0:20</span>
                </div>

                <div className="bg-[#eafaf1] border border-[#b2dfcc] rounded-lg p-5 mb-6 flex items-start gap-3">
                    <Info size={15} className="text-[#1e7e4c] shrink-0 mt-0.5" />
                    <p className="text-[12px] text-[#4a4a6a] leading-relaxed">
                        AI 可以幫你<strong>生成更多關鍵字</strong>，讓你找到更多相關研究。但 AI 可能給你太專業的詞、太廣泛的詞，或根本不對的詞——<strong>你要篩選</strong>。
                    </p>
                </div>

                <div className="border border-[#dddbd5] rounded-lg overflow-hidden mb-6">
                    <div className="bg-[#1a1a2e] px-5 py-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Bot size={14} className="text-[#8888aa]" />
                            <span className="text-white text-[12px] font-bold">Step 1 · AI 關鍵字 Prompt</span>
                        </div>
                        <CopyButton text={keywordPrompt} label="複製 Prompt" />
                    </div>
                    <div className="bg-[#f8f7f4] p-5">
                        <pre className="text-[12px] text-[#4a4a6a] font-mono whitespace-pre-wrap leading-relaxed">{keywordPrompt}</pre>
                    </div>
                    <div className="bg-[#f0ede6] border-t border-[#dddbd5] px-5 py-3 text-[11px] text-[#8888aa]">
                        先填入上方「Part 0 定案題目」，prompt 就會自動帶入你的題目。
                    </div>
                </div>

                <div className="bg-white border border-[#dddbd5] rounded-lg p-5">
                    <div className="text-[12px] font-bold text-[#1a1a2e] mb-3">Step 2 · 我的選擇</div>
                    <p className="text-[12px] text-[#4a4a6a] mb-4 leading-relaxed">
                        AI 給你一張關鍵字表格後：篩選哪些適合你的題目 → 回到華藝用這些關鍵字再搜一次 → 把新找到的文獻補進清單。
                    </p>
                    <div className="bg-[#fdecea] border border-[#f5c6c0] rounded p-4 text-[12px] text-[#4a4a6a] leading-relaxed">
                        <strong className="text-[#c0392b]">不用的關鍵字也要記下來，並說明為什麼不用</strong>——這是培養你對自己研究的判斷力。
                    </div>
                </div>
            </section>

            {/* ── PART 3：APA 格式 ── */}
            <section className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                    <span className="bg-[#c0392b] text-white text-[11px] font-bold px-3 py-1 rounded-full font-mono">PART 3</span>
                    <h2 className="text-[18px] font-bold text-[#1a1a2e]">APA 格式 · 3 篇文獻清單</h2>
                    <span className="text-[11px] font-mono text-[#8888aa]">0:20–0:35</span>
                </div>

                {/* 為什麼要 APA */}
                <div className="bg-[#f0ede6] rounded-lg p-5 border border-[#dddbd5] mb-6">
                    <p className="text-[13px] text-[#4a4a6a] leading-relaxed">
                        你寫報告時說「有研究發現手機會影響睡眠」，有人問：哪個研究？誰做的？你要能回答。這就是<strong>引用</strong>。
                        APA 格式讓每個人都能用同一套規則找到你引用的那篇研究。
                    </p>
                </div>

                {/* 格式模板 */}
                <div className="border border-[#dddbd5] rounded-lg overflow-hidden mb-8">
                    <div className="bg-[#1a1a2e] px-5 py-3">
                        <span className="text-white text-[12px] font-bold">APA 格式模板 · 收好，整學期都會用</span>
                    </div>
                    <div className="divide-y divide-[#dddbd5]">
                        <div className="p-5">
                            <div className="text-[11px] font-mono text-[#2d5be3] font-bold mb-2">碩博士論文</div>
                            <div className="font-mono text-[12px] text-[#1a1a2e] bg-[#f8f7f4] rounded p-3 mb-2">
                                作者（年份）。論文名稱。學校名稱碩士／博士論文，地點。
                            </div>
                            <div className="text-[11px] text-[#8888aa]">
                                範例：王小華（2022）。高中生學習動機與學業成就之研究。國立政治大學碩士論文，台北市。
                            </div>
                        </div>
                        <div className="p-5">
                            <div className="text-[11px] font-mono text-[#2d5be3] font-bold mb-2">期刊論文</div>
                            <div className="font-mono text-[12px] text-[#1a1a2e] bg-[#f8f7f4] rounded p-3 mb-2">
                                作者（年份）。文章名稱。期刊名稱，卷（期），頁碼。
                            </div>
                            <div className="text-[11px] text-[#8888aa]">
                                範例：李大明（2021）。青少年社群媒體使用行為分析。教育研究月刊，25（3），45–67。
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3 篇填寫區 */}
                <div className="space-y-4">
                    {[
                        { n: '文獻 1', val: apa1, set: setApa1 },
                        { n: '文獻 2', val: apa2, set: setApa2 },
                        { n: '文獻 3', val: apa3, set: setApa3 },
                    ].map((item, i) => (
                        <div key={i} className="border border-[#dddbd5] rounded-lg overflow-hidden">
                            <div className="bg-[#f0ede6] px-5 py-2 border-b border-[#dddbd5] flex items-center justify-between">
                                <span className="text-[12px] font-bold text-[#1a1a2e]">{item.n}</span>
                                <span className="text-[10px] font-mono text-[#8888aa]">⚠️ 親自在華藝或 Google Scholar 查證後才填</span>
                            </div>
                            <div className="p-5">
                                <textarea
                                    value={item.val}
                                    onChange={e => item.set(e.target.value)}
                                    placeholder={`${item.n} 的 APA 格式：作者（年份）。論文名稱。…`}
                                    rows={3}
                                    className="w-full border border-[#dddbd5] rounded px-3 py-2 text-[13px] text-[#1a1a2e] placeholder-[#c0c0d0] font-mono focus:outline-none focus:ring-2 focus:ring-[#2d5be3]/30 resize-none"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── WRAP-UP ── */}
            <section className="mb-12">
                <div className="bg-[#f0ede6] rounded-lg overflow-hidden border border-[#dddbd5]">
                    <div className="px-6 py-4 border-b border-[#dddbd5]">
                        <span className="text-[14px] font-bold text-[#1a1a2e]">✅ 本週結束，你應該要會</span>
                    </div>
                    <div className="divide-y divide-[#dddbd5]">
                        {[
                            '用華藝資料庫找文獻——知道怎麼縮小搜尋範圍，找到相關的研究',
                            '用 AI 生成關鍵字——AI 給選項，你來判斷',
                            '親自查證 3 篇 A/B 級文獻——確認作者存在、摘要存在',
                            'APA 格式——怎麼正確記錄你的來源',
                        ].map((item, i) => (
                            <div key={i} className="px-6 py-4 flex items-start gap-3">
                                <CheckCircle2 size={16} className="text-[#1e7e4c] shrink-0 mt-0.5" />
                                <span className="text-[13px] text-[#1a1a2e]">{item}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── HOMEWORK ── */}
            <section className="mb-12">
                <div className="text-[11px] font-mono text-[#8888aa] mb-4 uppercase tracking-wider">本週作業</div>
                <div className="border border-[#dddbd5] rounded-lg overflow-hidden">
                    <div className="bg-[#f0ede6] px-6 py-3 flex items-center justify-between border-b border-[#dddbd5]">
                        <span className="text-[13px] font-bold text-[#1a1a2e]">繳交清單</span>
                        <span className="text-[11px] font-bold text-[#c0392b]">截止：{W50Data.homework.deadline}</span>
                    </div>
                    <div className="divide-y divide-[#dddbd5]">
                        {W50Data.homework.items.map((hw, idx) => (
                            <div className="p-4 px-6 flex items-center gap-6" key={idx}>
                                <span className="font-mono text-[11px] font-bold text-[#2d5be3] w-16 shrink-0">{hw.p}</span>
                                <span className="text-[13px] text-[#4a4a6a]">{hw.n}</span>
                            </div>
                        ))}
                    </div>
                    <div className="p-4 px-6 bg-[#f8f7f4] border-t border-[#dddbd5] flex items-center justify-between text-[12px]">
                        <span className="text-[#8888aa]">{W50Data.homework.footer}</span>
                        <a href="https://classroom.google.com/" target="_blank" rel="noopener noreferrer"
                            className="text-[#2d5be3] font-bold hover:underline">→ Google Classroom</a>
                    </div>
                </div>
            </section>

            {/* ── NEXT WEEK PREVIEW ── */}
            <div className="next-week-preview">
                <div className="next-week-header">
                    <span className="next-week-badge">NEXT WEEK</span>
                    <h3 className="next-week-title">W5.1 預告</h3>
                </div>
                <div className="next-week-content">
                    <div className="next-week-col">
                        <div className="next-week-label">W5.1 主題</div>
                        <p className="next-week-text">文獻偵探社——你的 3 篇文獻，能通過同學的查核嗎？</p>
                    </div>
                    <div className="next-week-col border-l border-white/5">
                        <div className="next-week-label">你會學到</div>
                        <p className="next-week-text">辨識 <strong className="text-white underline decoration-[#c9a84c] underline-offset-4">AI 假文獻</strong>、合法引用、不踩抄襲的地雷。</p>
                    </div>
                </div>
            </div>

            {/* ── NAVIGATION ── */}
            <div className="flex justify-between items-center py-12 border-t border-[#dddbd5]">
                <Link to="/w4" className="text-[13px] font-bold text-[#8888aa] hover:text-[#1a1a2e] flex items-center gap-2 transition-colors">
                    <ArrowLeft size={16} /> 回 W4 題目博覽會
                </Link>
                <Link to="/w5" className="bg-[#1a1a2e] text-white px-8 py-3 rounded-lg text-[13px] font-bold hover:bg-[#2d5be3] transition-all flex items-center gap-2 group shadow-lg shadow-[#1a1a2e]/10">
                    前往 W5.1 文獻偵探社 <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>

        </div>
    );
};
