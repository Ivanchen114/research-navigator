import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import CourseArc from '../components/ui/CourseArc';
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
        note: 'W6 會教你辨識'
    },
];

/* ─────────────────── component ─────────────────── */
export const W50Page = () => {
    const [showLessonMap, setShowLessonMap] = useState(false);
    const [myTopic, setMyTopic] = useState('');
    const [kw1, setKw1] = useState('');
    const [kw2, setKw2] = useState('');
    const [kw3, setKw3] = useState('');

    /* Part 1 搜尋策略 */
    const [searchStrategy, setSearchStrategy] = useState({
        type: { full: false, title: false, abstract: false },
        limit: { taiwan: false, years: false, thesis: false },
        db: { airiti: false, ncl: false }
    });

    /* Part 1 找到的第一篇文獻 */
    const [lit1, setLit1] = useState({
        title: '', author: '', year: '', source: '', relation: ''
    });

    /* Part 3 APA 格式 */
    const [apa1, setApa1] = useState('');
    const [apaCheck, setApaCheck] = useState({
        name: false, year: false, title: false,
        db: false, type: false, location: false
    });

    /* Part 4 證物鑑識 */
    const [forensics, setForensics] = useState({
        A: { grade: '', reason: '', path: '' },
        B: { grade: '', reason: '', path: '' },
        C: { grade: '', reason: '', path: '' },
        D: { grade: '', reason: '', path: '' },
        E: { grade: '', reason: '', path: '' },
    });

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
                    研究方法與專題 / 研究規劃 / <span className="text-[#1a1a2e] font-bold">文獻搜尋入門 W5</span>
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
                <div className="text-[11px] font-mono text-[#2d5be3] mb-3 tracking-[0.06em] uppercase">📚 W5 · 研究規劃</div>
                <h1 className="font-serif text-4xl font-bold leading-tight text-[#1a1a2e] mb-4 tracking-tight">
                    文獻搜尋入門：<span className="text-[#2d5be3] italic">找對資料，打好地基</span>
                </h1>
                <p className="text-base text-[#4a4a6a] max-w-[680px] leading-relaxed mb-10">
                    W4 完成了題目與研究動機的定案。W5 的任務是往前走一步：為自己的研究找到文獻基礎。
                    這週只做一件事——<strong>找到 1 篇真實可信的相關研究</strong>。真偽鑑識和引用倫理留到 W6，這週先建立「找文獻」的基本操作能力。
                </p>

                {/* COURSE ARC */}
                <CourseArc items={W50Data.courseArc} />

                {/* META STRIP */}
                <div className="meta-strip">
                    {W50Data.metaCards.map((card, i) => (
                        <div className="meta-card" key={i}>
                            <div className="meta-label">{card.label}</div>
                            <div className="meta-value">{card.value}</div>
                        </div>
                    ))}
                </div>

                {/* 本週簡報 */}
                <div className="flex justify-end mb-8 -mt-2">
                    <a
                        href="https://canva.link/uxnn3h5uxwzloy7"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold tracking-wider text-[#8888aa] hover:text-[#1a1a2e] bg-[#f8f7f4] hover:bg-[#f0ede6] border border-[#dddbd5] hover:border-[#1a1a2e]/20 px-3 py-1.5 rounded-[5px] transition-all"
                    >
                        📊 本週簡報 ↗
                    </a>
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
                        <div className="text-[11px] font-mono text-[#c0392b] mt-2">W6 會專門練習辨識假文獻。今天先記住：AI 找到的一定要查證。</div>
                    </div>
                </div>
            </section>

            {/* ── PART 1：學生實作 ── */}
            <section className="mb-16">
                <div className="flex items-center gap-3 mb-6">
                    <span className="bg-[#2d5be3] text-white text-[11px] font-bold px-3 py-1 rounded-full font-mono">PART 1</span>
                    <h2 className="text-[18px] font-bold text-[#1a1a2e]">資料庫查找練習（不准用 AI！）</h2>
                    <span className="text-[11px] font-mono text-[#8888aa]">0:25–0:50</span>
                </div>

                {/* 搜尋策略 */}
                <div className="bg-white border border-[#dddbd5] rounded-lg overflow-hidden mb-6">
                    <div className="bg-[#f0ede6] px-6 py-3 border-b border-[#dddbd5] flex items-center justify-between">
                        <span className="text-[12px] font-bold text-[#1a1a2e]">我的搜尋策略</span>
                        <span className="text-[10px] font-mono text-[#bf4040] font-bold">🚫 限時內不准用 AI</span>
                    </div>
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                            <div>
                                <div className="text-[11px] font-mono text-[#8888aa] mb-3 uppercase tracking-wider">關鍵字組合</div>
                                <div className="flex gap-3">
                                    <input type="text" value={kw1} onChange={e => setKw1(e.target.value)} placeholder="關鍵字 1" className="w-full border border-[#dddbd5] rounded px-3 py-2 text-[13px] text-[#1a1a2e] focus:outline-none focus:ring-2 focus:ring-[#2d5be3]/30" />
                                    <input type="text" value={kw2} onChange={e => setKw2(e.target.value)} placeholder="關鍵字 2" className="w-full border border-[#dddbd5] rounded px-3 py-2 text-[13px] text-[#1a1a2e] focus:outline-none focus:ring-2 focus:ring-[#2d5be3]/30" />
                                    <input type="text" value={kw3} onChange={e => setKw3(e.target.value)} placeholder="關鍵字 3" className="w-full border border-[#dddbd5] rounded px-3 py-2 text-[13px] text-[#1a1a2e] focus:outline-none focus:ring-2 focus:ring-[#2d5be3]/30" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <div className="text-[11px] font-mono text-[#8888aa] mb-3 uppercase tracking-wider">搜尋位置</div>
                                    <div className="space-y-2">
                                        {Object.entries({ full: '全文搜尋', title: '標題搜尋', abstract: '摘要搜尋' }).map(([key, label]) => (
                                            <label key={key} className="flex items-center gap-2 cursor-pointer group">
                                                <input
                                                    type="checkbox"
                                                    checked={searchStrategy.type[key]}
                                                    onChange={() => setSearchStrategy(prev => ({ ...prev, type: { ...prev.type, [key]: !prev.type[key] } }))}
                                                    className="w-3.5 h-3.5 border-[#dddbd5] rounded text-[#2d5be3] focus:ring-0"
                                                />
                                                <span className="text-[12px] text-[#4a4a6a] group-hover:text-[#1a1a2e] transition-colors">{label}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-[11px] font-mono text-[#8888aa] mb-3 uppercase tracking-wider">限制條件</div>
                                    <div className="space-y-2">
                                        {Object.entries({ taiwan: '臺灣研究', years: '近 5 年', thesis: '碩博士論文' }).map(([key, label]) => (
                                            <label key={key} className="flex items-center gap-2 cursor-pointer group">
                                                <input
                                                    type="checkbox"
                                                    checked={searchStrategy.limit[key]}
                                                    onChange={() => setSearchStrategy(prev => ({ ...prev, limit: { ...prev.limit, [key]: !prev.limit[key] } }))}
                                                    className="w-3.5 h-3.5 border-[#dddbd5] rounded text-[#2d5be3] focus:ring-0"
                                                />
                                                <span className="text-[12px] text-[#4a4a6a] group-hover:text-[#1a1a2e] transition-colors">{label}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="text-[11px] font-mono text-[#8888aa] mb-3 uppercase tracking-wider">使用的資料庫</div>
                            <div className="flex gap-6">
                                {Object.entries({ airiti: '華藝線上圖書館', ncl: '國家圖書館碩博士論文系統' }).map(([key, label]) => (
                                    <label key={key} className="flex items-center gap-2 cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            checked={searchStrategy.db[key]}
                                            onChange={() => setSearchStrategy(prev => ({ ...prev, db: { ...prev.db, [key]: !prev.db[key] } }))}
                                            className="w-3.5 h-3.5 border-[#dddbd5] rounded text-[#2d5be3] focus:ring-0"
                                        />
                                        <span className="text-[12px] text-[#4a4a6a] group-hover:text-[#1a1a2e] transition-colors">{label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 找到的研究 */}
                <div className="bg-white border border-[#dddbd5] rounded-lg overflow-hidden">
                    <div className="bg-[#1a1a2e] px-6 py-3 flex items-center justify-between">
                        <span className="text-white text-[12px] font-bold">我找到的研究（先填 1 篇）</span>
                    </div>
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-[11px] font-mono text-[#8888aa] mb-1.5 uppercase tracking-wider">文獻標題</label>
                                    <input type="text" value={lit1.title} onChange={e => setLit1(prev => ({ ...prev, title: e.target.value }))} placeholder="例如：高中職學生數學焦慮之研究..." className="w-full border border-[#dddbd5] rounded px-3 py-2.5 text-[14px] text-[#1a1a2e] focus:outline-none focus:ring-2 focus:ring-[#2d5be3]/30" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[11px] font-mono text-[#8888aa] mb-1.5 uppercase tracking-wider">作者</label>
                                        <input type="text" value={lit1.author} onChange={e => setLit1(prev => ({ ...prev, author: e.target.value }))} placeholder="作者姓名" className="w-full border border-[#dddbd5] rounded px-3 py-2.5 text-[13px] text-[#1a1a2e] focus:outline-none focus:ring-2 focus:ring-[#2d5be3]/30" />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-mono text-[#8888aa] mb-1.5 uppercase tracking-wider">年份</label>
                                        <input type="text" value={lit1.year} onChange={e => setLit1(prev => ({ ...prev, year: e.target.value }))} placeholder="2024" className="w-full border border-[#dddbd5] rounded px-3 py-2.5 text-[13px] text-[#1a1a2e] focus:outline-none focus:ring-2 focus:ring-[#2d5be3]/30" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[11px] font-mono text-[#8888aa] mb-1.5 uppercase tracking-wider">期刊名稱／學校研究所</label>
                                    <input type="text" value={lit1.source} onChange={e => setLit1(prev => ({ ...prev, source: e.target.value }))} placeholder="例如：教育學刊..." className="w-full border border-[#dddbd5] rounded px-3 py-2.5 text-[13px] text-[#1a1a2e] focus:outline-none focus:ring-2 focus:ring-[#2d5be3]/30" />
                                </div>
                            </div>
                            <div className="flex flex-col h-full">
                                <label className="block text-[11px] font-mono text-[#8888aa] mb-1.5 uppercase tracking-wider">這篇跟我的題目有什麼關係？</label>
                                <textarea value={lit1.relation} onChange={e => setLit1(prev => ({ ...prev, relation: e.target.value }))} placeholder="它是支持你的觀點？提供了調查數據？..." className="flex-1 w-full border border-[#dddbd5] rounded px-4 py-3 text-[13px] text-[#4a4a6a] leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-[#2d5be3]/30" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── 第二節 ── */}
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
                </div>
            </section>

            {/* ── PART 3：APA 格式 ── */}
            <section className="mb-16">
                <div className="flex items-center gap-3 mb-6">
                    <span className="bg-[#c0392b] text-white text-[11px] font-bold px-3 py-1 rounded-full font-mono">PART 3</span>
                    <h2 className="text-[18px] font-bold text-[#1a1a2e]">APA 格式與查核清單</h2>
                    <span className="text-[11px] font-mono text-[#8888aa]">0:20–0:35</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="border border-[#dddbd5] rounded-lg p-5">
                        <div className="text-[12px] font-bold text-[#1a1a2e] mb-4">APA 格式填寫（第一篇）</div>
                        <textarea
                            value={apa1}
                            onChange={e => setApa1(e.target.value)}
                            placeholder="作者（年份）。論文名稱。學校名稱碩士／博士論文，地點。"
                            rows={4}
                            className="w-full border border-[#dddbd5] rounded px-3 py-2 text-[13px] font-mono focus:ring-2 focus:ring-[#2d5be3]/30 resize-none"
                        />
                    </div>
                    <div className="bg-[#f0ede6] rounded-lg p-5 border border-[#dddbd5]">
                        <div className="text-[12px] font-bold text-[#1a1a2e] mb-4">格式查核清單</div>
                        <div className="grid grid-cols-2 gap-3">
                            {Object.entries({ name: '作者全名', year: '括弧年份', title: '文章/論文標題', db: '資料庫/期刊名', type: '論文種類/卷期', location: '出版地(論文)' }).map(([key, label]) => (
                                <label key={key} className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={apaCheck[key]}
                                        onChange={() => setApaCheck(prev => ({ ...prev, [key]: !prev[key] }))}
                                        className="w-3.5 h-3.5 rounded text-[#c0392b] focus:ring-0"
                                    />
                                    <span className="text-[11px] text-[#4a4a6a]">{label}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── PART 4：證物鑑識大賽 ── */}
            <section className="mb-16">
                <div className="flex items-center gap-3 mb-6">
                    <span className="bg-[#1a1a2e] text-white text-[11px] font-bold px-3 py-1 rounded-full font-mono">PART 4</span>
                    <h2 className="text-[18px] font-bold text-[#1a1a2e]">證物鑑識大賽：等級判定</h2>
                    <span className="text-[11px] font-mono text-[#8888aa]">0:00–0:30 (第二節)</span>
                </div>
                <div className="space-y-6">
                    {[
                        { id: 'A', title: '台中市高中職學生數學焦慮...', desc: '作者：鄭淑米。碩士論文。探討高中職一年級學生數學焦慮與數學自我效能之關係。', link: 'https://www.airitilibrary.com/Article/Detail/U0021-2304200714313183' },
                        { id: 'B', title: 'Smartphone Usage and Sleep Quality...', desc: 'Authors: Michael Chen, Sarah Wang. 2023 Journal Release. Longitudinal study tracking Taiwanese adolescents for 3 years.', link: 'DOI: 10.1177/0272989X241231721' },
                        { id: 'C', title: '我的不正經人生觀', desc: '作者：黃益中。出版社：寶瓶文化。討論青少年成長、學習動機、人際互動等社會觀察。' },
                        { id: 'D', title: '生活小竅門 教你如何治療燒傷...', desc: '來源：每日頭條。整理燒燙傷民間處理法：蔥葉貼敷、蛋清加糖等。網址：www.health-info-farm.com' },
                        { id: 'E', title: '【FB 貼文】國家教育研究院', desc: '平台：Facebook。討論學校限制手機使用的現況。連結：https://is.gd/xDIT6f' },
                    ].map((item) => (
                        <div key={item.id} className="bg-white border border-[#dddbd5] rounded-xl overflow-hidden shadow-sm">
                            <div className="bg-[#1a1a2e] px-6 py-3 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span className="text-[#c9a84c] font-mono font-bold text-[14px]">證物 {item.id}</span>
                                    <span className="text-white text-[13px] font-medium truncate max-w-[400px]">{item.title}</span>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="mb-4">
                                    <p className="text-[12px] text-[#4a4a6a] italic leading-relaxed">「{item.desc}」</p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <div className="text-[11px] font-bold text-[#8888aa] mb-2 uppercase tracking-wider">判定等級</div>
                                        <div className="flex gap-2">
                                            {['A', 'B', 'C', 'D'].map(level => (
                                                <button
                                                    key={level}
                                                    onClick={() => setForensics(prev => ({ ...prev, [item.id]: { ...prev[item.id], grade: level } }))}
                                                    className={`w-8 h-8 rounded-full font-bold text-[11px] border-2 flex items-center justify-center
                                                        ${forensics[item.id].grade === level 
                                                            ? `${gradeLevels.find(g => g.grade === level).color} border-transparent text-white` 
                                                            : 'border-[#f0ede6] text-[#8888aa]'}`}
                                                >
                                                    {level}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="md:col-span-2 space-y-4">
                                        <div>
                                            <div className="text-[11px] font-bold text-[#8888aa] mb-1 uppercase tracking-wider">判定理由</div>
                                            <input type="text" value={forensics[item.id].reason} onChange={e => setForensics(prev => ({ ...prev, [item.id]: { ...prev[item.id], reason: e.target.value } }))} placeholder="為什麼是這個等級？" className="w-full bg-[#f8f7f4] border border-[#dddbd5] rounded px-3 py-1.5 text-[12px]" />
                                        </div>
                                        <div>
                                            <div className="text-[11px] font-bold text-[#8888aa] mb-1 uppercase tracking-wider">查核路徑 (如：華藝搜尋/Google查作者/DOI查證)</div>
                                            <input type="text" value={forensics[item.id].path} onChange={e => setForensics(prev => ({ ...prev, [item.id]: { ...prev[item.id], path: e.target.value } }))} placeholder="你是怎麼查證這份證物的真實性的？" className="w-full bg-[#f8f7f4] border border-[#dddbd5] rounded px-3 py-1.5 text-[12px]" />
                                        </div>
                                    </div>
                                </div>
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
                            '親自查證 1 篇 A/B 級文獻——確認作者存在、摘要存在',
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
                </div>
            </section>

            {/* ── NAVIGATION ── */}
            <div className="flex justify-between items-center py-12 border-t border-[#dddbd5]">
                <Link to="/w4" className="text-[13px] font-bold text-[#8888aa] hover:text-[#1a1a2e] flex items-center gap-2 transition-colors">
                    <ArrowLeft size={16} /> 回 W4 題目博覽會
                </Link>
                <Link to="/w6" className="bg-[#1a1a2e] text-white px-8 py-3 rounded-lg text-[13px] font-bold hover:bg-[#2d5be3] transition-all flex items-center gap-2 group shadow-lg shadow-[#1a1a2e]/10">
                    前往 W6 文獻偵探社 <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>

        </div>
    );
};
