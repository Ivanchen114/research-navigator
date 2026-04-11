import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Map, ArrowRight, ArrowLeft, BookOpen, Search, ShieldAlert, FileSearch, PenTool, CheckCircle2, AlertTriangle, FileText
} from 'lucide-react';
import LessonMap from '../components/ui/LessonMap';
import { W5Data } from '../data/lessonMaps';
import '../pages/LiteratureReview.css';

const colorMap = {
    r: { bg: 'bg-[#fdecea]', border: 'border-[#f5c6c0]', text: 'text-[#c0392b]', num: 'bg-[#c0392b]' },
    g: { bg: 'bg-[#eafaf1]', border: 'border-[#b2dfcc]', text: 'text-[#1e7e4c]', num: 'bg-[#1e7e4c]' },
    c: { bg: 'bg-[#eaf1fd]', border: 'border-[#b2c9f5]', text: 'text-[#2d5be3]', num: 'bg-[#2d5be3]' },
};

export const LiteratureReview = () => {
    const [showLessonMap, setShowLessonMap] = useState(false);
    return (
        <div className="page-container animate-in-fade-slide sherlock-theme">
            {/* TOP BAR */}
            <div className="flex items-center justify-between border-b border-[#dddbd5] pb-4 mb-12">
                <div className="text-[11px] font-mono text-[#8888aa] flex items-center gap-2">
                    研究方法與專題 / 研究規劃 / <span className="text-[#1a1a2e] font-bold">文獻偵探社 W6</span>
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
                    <LessonMap data={W5Data} />
                </div>
            )}

            {/* PAGE HEADER */}
            <header className="mb-16">
                <div className="text-[11px] font-mono text-[#c0392b] mb-3 tracking-[0.06em] uppercase">🕵️ W6 · 研究規劃</div>
                <h1 className="font-serif text-4xl font-bold leading-tight text-[#1a1a2e] mb-4 tracking-tight">
                    文獻偵探社：<span className="text-[#c0392b] italic">識破假改寫，寫出真文獻</span>
                </h1>
                <p className="text-base text-[#4a4a6a] max-w-[680px] leading-relaxed mb-10">
                    偵探社的工作只有一件事——找出文獻裡的問題，然後寫出一份任何人都挑不出毛病的文獻探討。
                    今天這堂課，你要學會識破兩種常見犯罪手法——<strong>換字抄襲</strong>與<strong>文獻堆砌</strong>。
                </p>

                {/* GAME BANNER */}
                <div className="bg-[#1a1a2e] border-l-4 border-[#c0392b] p-6 rounded-r-lg mb-10 text-white shadow-xl">
                    <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                        <ShieldAlert className="text-[#c0392b]" size={20} />
                        即刻報到：行動代號獵狐
                    </h3>
                    <p className="text-[#8888aa] text-sm mb-4">
                        前往遊戲訓練系統，完成入社前的基本特訓。破解五道引用謎題。
                    </p>
                    <Link to="/game/citation-detective" className="inline-flex items-center gap-2 bg-[#c0392b] text-white px-4 py-2 rounded font-bold text-sm hover:bg-[#a02c21] transition-colors">
                        進入遊戲系統 <ArrowRight size={14} />
                    </Link>
                </div>

                {/* META STRIP */}
                <div className="meta-strip">
                    {W5Data.metaCards.map((card, i) => (
                        <div className="meta-card" key={i}>
                            <div className="meta-label">{card.label}</div>
                            <div className="meta-value">{card.value}</div>
                        </div>
                    ))}
                </div>

                {/* CORE CONCEPTS */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-10">
                    {W5Data.coreConcepts.map((c, i) => {
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

                {/* 本週簡報 */}
                <div className="flex justify-end mt-8 mb-2">
                    <a
                        href="https://canva.link/hb3pdip2k9kvmca"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold tracking-wider text-[#8888aa] hover:text-[#1a1a2e] bg-[#f8f7f4] hover:bg-[#f0ede6] border border-[#dddbd5] hover:border-[#1a1a2e]/20 px-3 py-1.5 rounded-[5px] transition-all"
                    >
                        📊 本週簡報 ↗
                    </a>
                </div>
            </header>

            {/* SECTIONS */}
            <section className="mb-16">
                <h2 className="text-2xl font-bold font-serif text-[#1a1a2e] mb-6 flex items-center gap-2">
                    <FileSearch size={24} className="text-[#c0392b]" /> 工具一：遮蓋測試 (Paraphrasing)
                </h2>
                <div className="bg-white border border-[#dddbd5] p-6 rounded-lg shadow-sm">
                    <p className="text-[#4a4a6a] mb-4">
                        把原文遮住。只看你自己寫的版本，問自己：沒有原文，這段話還站得住腳嗎？
                        換字抄襲的人，原文一遮就寫不下去——因為他根本沒有讀懂，他只是在翻譯。
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-[#fdecea] p-4 rounded border border-[#f5c6c0]">
                            <strong>換字抄襲（失敗）</strong>：結構一模一樣，只換了詞彙。
                        </div>
                        <div className="bg-[#eafaf1] p-4 rounded border border-[#b2dfcc]">
                            <strong>真正改寫（成功）</strong>：換了切入角度，用自己的邏輯說故事。
                        </div>
                    </div>
                </div>
            </section>

            <section className="mb-16">
                <h2 className="text-2xl font-bold font-serif text-[#1a1a2e] mb-6 flex items-center gap-2">
                    <PenTool size={24} className="text-[#c0392b]" /> 工具二：三明治引用法 (Citation Sandwich)
                </h2>
                <div className="bg-white border border-[#dddbd5] p-6 rounded-lg shadow-sm">
                    <p className="text-[#4a4a6a] mb-6">如果你沒有加上你的觀點和分析，你只是在搬字，不是在做文獻探討。</p>
                    <div className="space-y-4">
                        <div className="flex gap-4 items-start">
                            <div className="w-8 h-8 rounded bg-[#f5f5f7] border border-[#ddd] flex items-center justify-center font-bold text-[#888]">1</div>
                            <div className="flex-1">
                                <h4 className="font-bold text-[#1a1a2e]">觀點句 (Top Bun)</h4>
                                <p className="text-sm text-[#4a4a6a]">你的主張與立場，你要證明的事情。</p>
                            </div>
                        </div>
                        <div className="flex gap-4 items-start">
                            <div className="w-8 h-8 rounded bg-[#f5f5f7] border border-[#ddd] flex items-center justify-center font-bold text-[#888]">2</div>
                            <div className="flex-1">
                                <h4 className="font-bold text-[#1a1a2e]">引用句 (Meat)</h4>
                                <p className="text-sm text-[#4a4a6a]">某某（年份）發現了什麼。物證，有具體發現與數據。</p>
                            </div>
                        </div>
                        <div className="flex gap-4 items-start">
                            <div className="w-8 h-8 rounded bg-[#f5f5f7] border border-[#ddd] flex items-center justify-center font-bold text-[#888]">3</div>
                            <div className="flex-1">
                                <h4 className="font-bold text-[#1a1a2e]">分析句 (Bottom Bun)</h4>
                                <p className="text-sm text-[#4a4a6a]">這個證據說明了什麼？跟你的研究題目有什麼關係？</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="mb-16">
                <h2 className="text-2xl font-bold font-serif text-[#1a1a2e] mb-6 flex items-center gap-2">
                    <BookOpen size={24} className="text-[#c0392b]" /> 工具三：多文獻整合 (Integration)
                </h2>
                <div className="bg-white border border-[#dddbd5] p-6 rounded-lg shadow-sm">
                    <p className="text-[#4a4a6a] mb-4">
                        偵探的工作不是把所有證據拍照上傳，而是從這些證據裡面提煉出一個故事。不是逐條排隊。
                    </p>
                    <div className="bg-[#f9f9fb] p-4 rounded text-sm text-[#4a4a6a] mb-4">
                        <strong className="text-[#1a1a2e]">破題：</strong>已知研究的方向<br/>
                        <strong className="text-[#1a1a2e]">帶入：</strong>首先...此外...進一步來看...<br/>
                        <strong className="text-[#1a1a2e]">連回題目：</strong>因此本研究旨在...
                    </div>
                </div>
            </section>

            {/* HOMEWORK */}
            <section className="bg-[#fcfbfc] border-t border-[#dddbd5] pt-12 mt-16 pb-20">
                <div className="max-w-[600px] mx-auto text-center">
                    <h2 className="text-xl font-serif font-bold text-[#1a1a2e] mb-6">結案確認</h2>
                    <div className="bg-white p-6 rounded-lg border border-[#e5e5e5] shadow-sm text-center">
                        <CheckCircle2 size={32} className="text-[#1e7e4c] mx-auto mb-3" />
                        <h3 className="font-bold text-[#1a1a2e] mb-2">上傳你的演練報告</h3>
                        <p className="text-[13px] text-[#4a4a6a] mb-4 text-left">
                            完成演練一至三，並必須取得同儕的審查驗屍意見，修改完畢後一起提交至 Google Classroom。
                        </p>
                    </div>
                </div>
            </section>

            {/* ── NAVIGATION ── */}
            <div className="flex justify-between items-center py-12 border-t border-[#dddbd5] mt-16 max-w-[940px] mx-auto px-10">
                <Link to="/w5" className="text-[13px] font-bold text-[#8888aa] hover:text-[#1a1a2e] flex items-center gap-2 transition-colors">
                    <ArrowLeft size={16} /> 回 W5 文獻搜尋入門
                </Link>
                <Link to="/w7" className="bg-[#1a1a2e] text-white px-8 py-3 rounded-lg text-[13px] font-bold hover:bg-[#c0392b] transition-all flex items-center gap-2 group shadow-lg shadow-[#1a1a2e]/10">
                    前往 W7 研究診所 <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>
        </div>
    );
};
