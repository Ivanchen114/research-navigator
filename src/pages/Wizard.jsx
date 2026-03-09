import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Map, ArrowRight } from 'lucide-react';
import LessonMap from '../components/ui/LessonMap';
import { W3Data } from '../data/lessonMaps';

export const Wizard = () => {
    const [showLessonMap, setShowLessonMap] = useState(false);
    const [copyStatus, setCopyStatus] = useState({});
    const [unlockCounts, setUnlockCounts] = useState({});
    const [revealedAnswers, setRevealedAnswers] = useState({});
    const [obstacleStates, setObstacleStates] = useState({ a: false, b: false });

    const handleCopy = (id, text) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopyStatus(prev => ({ ...prev, [id]: true }));
            setTimeout(() => setCopyStatus(prev => ({ ...prev, [id]: false })), 1500);
        });
    };

    const handleUnlock = (id) => {
        const newCount = (unlockCounts[id] || 0) + 1;
        setUnlockCounts(prev => ({ ...prev, [id]: newCount }));
        if (newCount >= 3) setRevealedAnswers(prev => ({ ...prev, [id]: true }));
    };

    return (
        <div className="max-w-[1000px] mx-auto px-6 lg:px-12 py-12 animate-in fade-in slide-in-from-bottom-4 duration-500 font-sans text-[13px] leading-[1.6] text-[#1a1a2e] pb-32">
            <style dangerouslySetInnerHTML={{
                __html: `
                :root { --ink: #1a1a2e; --ink-mid: #4a4a6a; --ink-light: #8888aa; --paper: #f8f7f4; --paper-warm: #f0ede6; --accent: #2d5be3; --accent-light: #e8eeff; --gold: #c9a84c; --gold-light: #fdf6e3; --success: #2e7d5a; --success-light: #e8f5ee; --danger: #c0392b; --danger-light: #fdecea; --border: #dddbd5; --border-mid: #c8c5bc; }
                .w3-meta-strip { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px; background: var(--border); border: 1px solid var(--border); border-radius: 10px; overflow: hidden; margin-bottom: 48px; }
                .w3-meta-item { background: #fff; padding: 14px 18px; }
                .w3-meta-label { font-size: 10px; font-family: 'DM Mono', monospace; color: var(--ink-light); margin-bottom: 4px; }
                .w3-meta-value { font-size: 13px; font-weight: 700; color: var(--ink); }
                .w3-section-head { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; margin-top: 48px; }
                .w3-section-head h2 { font-family: 'Noto Serif TC', serif; font-size: 18px; font-weight: 700; color: var(--ink); white-space: nowrap; }
                .w3-section-head .line { flex: 1; height: 1px; background: var(--border); }
                .w3-section-head .mono { font-family: 'DM Mono', monospace; font-size: 10px; color: var(--ink-light); }
                .w3-disease-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1px; background: var(--border); border: 1px solid var(--border); border-radius: 10px; overflow: hidden; margin-bottom: 24px; }
                .w3-disease-card { background: #fff; padding: 14px 16px; }
                .w3-disease-code { font-family: 'DM Mono', monospace; font-size: 20px; font-weight: 700; color: var(--accent); margin-bottom: 4px; }
                .w3-disease-name { font-size: 13px; font-weight: 700; color: var(--ink); margin-bottom: 4px; }
                .w3-disease-symptom { font-size: 11px; color: var(--ink-light); line-height: 1.6; }
                .w3-mantra-box { border: 2px solid var(--ink); border-radius: 10px; overflow: hidden; margin-bottom: 20px; }
                .w3-mantra-hd { background: var(--ink); color: #fff; padding: 14px 20px; display: flex; align-items: center; gap: 12px; }
                .w3-mantra-hd .title { font-family: 'Noto Serif TC', serif; font-size: 15px; font-weight: 700; }
                .w3-mantra-core { padding: 20px; background: #fff; text-align: center; }
                .w3-mantra-rows { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1px; background: var(--border); border: 1px solid var(--border); border-radius: 8px; overflow: hidden; }
                .w3-mantra-row-item { background: #fff; padding: 12px 14px; text-align: center; }
                .w3-mantra-from { font-size: 18px; font-weight: 700; color: var(--danger); font-family: 'Noto Serif TC', serif; }
                .w3-mantra-to { font-size: 18px; font-weight: 700; color: var(--success); font-family: 'Noto Serif TC', serif; }
                .w3-mantra-arrow-sm { font-size: 12px; color: var(--ink-light); margin: 2px 0; }
                .w3-w5h1-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 1px; background: var(--border); border: 1px solid var(--border); border-radius: 10px; overflow: hidden; margin-bottom: 20px; }
                .w3-w5h1-item { background: #fff; padding: 14px 14px; }
                .w3-w5h1-w { font-family: 'DM Mono', monospace; font-size: 22px; font-weight: 700; color: var(--accent); margin-bottom: 2px; }
                .w3-w5h1-label { font-size: 13px; font-weight: 700; color: var(--ink); margin-bottom: 4px; }
                .w3-w5h1-q { font-size: 11px; color: var(--ink-light); line-height: 1.6; }
                .w3-patient-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 16px; }
                .w3-patient-card { border: 1px solid var(--border); border-radius: 8px; overflow: hidden; background: #fff; }
                .w3-patient-hd { padding: 8px 14px; background: var(--paper-warm); border-bottom: 1px solid var(--border); display: flex; align-items: center; gap: 8px; }
                .w3-patient-num { font-family: 'DM Mono', monospace; font-size: 10px; color: var(--ink-light); }
                .w3-unlock-btn { opacity: 0; background: none; border: none; cursor: pointer; padding: 4px; font-size: 10px; margin-left: auto; transition: opacity 0.2s; }
                .w3-unlock-btn:hover { opacity: 0.5; }
                .w3-patient-body { padding: 12px 14px; font-size: 13px; color: var(--ink); font-weight: 500; }
                .w3-patient-answer { padding: 10px 14px; background: var(--success-light); border-top: 1px solid var(--border); font-size: 12px; color: var(--success); line-height: 1.6; }
                .w3-drill-section { margin-bottom: 20px; }
                .w3-drill-level-hd { display: flex; align-items: center; gap: 10px; padding: 10px 16px; border-radius: 6px; margin-bottom: 10px; }
                .w3-drill-level-hd.green { background: var(--success-light); }
                .w3-drill-dot { width: 10px; height: 10px; border-radius: 50%; shrink: 0; }
                .w3-drill-dot.green { background: var(--success); }
                .w3-drill-level-title { font-size: 13px; font-weight: 700; color: var(--success); }
                .w3-drill-pills { display: flex; flex-wrap: wrap; gap: 8px; }
                .w3-drill-pill { font-size: 12px; color: var(--ink-mid); background: #fff; border: 1px solid var(--border); border-radius: 20px; padding: 5px 12px; }
                .w3-collab-steps { display: flex; flex-direction: column; gap: 1px; background: var(--border); border: 1px solid var(--border); border-radius: 10px; overflow: hidden; margin-bottom: 20px; }
                .w3-collab-step { background: #fff; padding: 14px 20px; display: flex; align-items: flex-start; gap: 16px; }
                .w3-collab-step-num { width: 28px; height: 28px; border-radius: 4px; display: flex; align-items: center; justify-content: center; font-family: 'DM Mono', monospace; font-size: 12px; font-weight: 700; shrink: 0; }
                .w3-step-human { background: var(--success-light); color: var(--success); }
                .w3-step-ai    { background: var(--accent-light); color: var(--accent); }
                .w3-step-you   { background: var(--gold-light); color: var(--gold); border: 1px solid rgba(201,168,76,0.3); }
                .w3-collab-step-title { font-size: 13px; font-weight: 700; color: var(--ink); margin-bottom: 3px; }
                .w3-collab-step-desc { font-size: 12px; color: var(--ink-mid); line-height: 1.65; }
                .w3-prompt-box { border: 1px solid var(--border-mid); border-radius: 8px; overflow: hidden; margin: 12px 0; }
                .w3-prompt-hd { padding: 8px 14px; background: var(--ink); display: flex; align-items: center; gap: 8px; }
                .w3-prompt-hd span { font-family: 'DM Mono', monospace; font-size: 10px; color: rgba(255,255,255,0.5); }
                .w3-copy-btn { margin-left: auto; font-family: 'DM Mono', monospace; font-size: 10px; color: rgba(255,255,255,0.5); background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); padding: 2px 8px; border-radius: 3px; cursor: pointer; }
                .w3-copy-btn:hover { background: rgba(255,255,255,0.15); color: #fff; }
                .w3-prompt-body { padding: 14px 16px; background: #fafaf8; font-size: 12px; color: var(--ink-mid); line-height: 1.85; font-family: 'DM Mono', monospace; white-space: pre-wrap; }
                .w3-task-block { border: 1px solid var(--border); border-radius: 10px; overflow: hidden; background: #fff; margin-bottom: 12px; }
                .w3-task-hd { padding: 12px 20px; background: var(--paper-warm); border-bottom: 1px solid var(--border); display: flex; align-items: center; gap: 10px; }
                .w3-task-badge { font-family: 'DM Mono', monospace; font-size: 10px; background: var(--ink); color: #fff; padding: 2px 8px; border-radius: 3px; }
                .w3-task-title { font-size: 13px; font-weight: 700; color: var(--ink); }
                .w3-task-body { padding: 20px 24px; }
                .w3-hw-block { border: 1px solid var(--border); border-radius: 10px; overflow: hidden; margin-bottom: 16px; }
                .w3-hw-header { padding: 14px 20px; background: var(--paper-warm); border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; }
                .w3-hw-header-left { display: flex; align-items: center; gap: 10px; }
                .w3-hw-header-title { font-size: 13px; font-weight: 700; }
                .w3-hw-deadline { font-size: 11px; color: var(--danger); font-weight: bold; }
                .w3-next-week-preview { background: var(--ink); border-radius: 10px; overflow: hidden; margin-bottom: 48px; border: 1px solid var(--border); }
                .w3-next-week-header { padding: 16px 24px; border-bottom: 1px solid rgba(255,255,255,0.06); display: flex; align-items: center; gap: 10px; }
                .w3-next-week-badge { font-family: 'DM Mono', monospace; font-size: 10px; background: rgba(255,255,255,0.1); color: rgba(255,255,255,0.5); padding: 2px 8px; border-radius: 3px; }
                .w3-next-week-title { font-size: 14px; font-weight: 700; color: #fff; }
                .w3-next-week-content { display: grid; grid-template-columns: 1fr 1fr; gap: 1px; background: rgba(255,255,255,0.05); }
                .w3-next-week-col { background: var(--ink); padding: 20px 24px; }
                .w3-next-week-label { font-size: 10px; font-family: 'DM Mono', monospace; color: rgba(255,255,255,0.3); margin-bottom: 4px; }
                .w3-next-week-text { font-size: 13px; color: rgba(255,255,255,0.75); line-height: 1.75; }
                @media (max-width: 768px) { .w3-content { padding: 24px 20px; } .w3-topbar { padding: 0 20px; } .w3-meta-strip, .w3-disease-grid, .w3-mantra-rows, .w3-w5h1-grid, .w3-patient-grid, .w3-next-week-content { grid-template-columns: 1fr; } }
            ` }} />

            {/* TOP BAR / NAVIGATION PATH */}
            <div className="flex items-center justify-between border-b border-[#dddbd5] pb-4 mb-16">
                <div className="text-[11px] font-mono text-[#8888aa] flex items-center gap-2">
                    研究方法與專題 / 研究規劃 / <span className="text-[#1a1a2e] font-bold">題目健檢 W3</span>
                </div>
                <div className="flex items-center gap-4">
                    <span className="bg-[#f0ede6] text-[#1a1a2e] text-[10px] font-bold px-2 py-0.5 rounded-[2px] font-mono">100 MINS</span>
                    <button
                        onClick={() => setShowLessonMap(!showLessonMap)}
                        className="text-[11px] text-[#8888aa] hover:text-[#2d5be3] transition-colors flex items-center gap-1 font-mono"
                    >
                        <Map size={12} /> {showLessonMap ? 'Hide Plan' : 'Instructor View'}
                    </button>
                </div>
            </div>

            {showLessonMap && (
                <div className="animate-in slide-in-from-top-4 duration-300">
                    <LessonMap data={W3Data} />
                </div>
            )}

            {/* PAGE HEADER */}
            <header>
                <div className="text-[11px] font-mono text-[#2d5be3] mb-3 tracking-[0.06em]">🏥 W3 · 研究規劃</div>
                <h1 className="font-serif text-[36px] font-bold leading-[1.2] text-[#1a1a2e] mb-4 tracking-[-0.02em]">
                    題目健檢：<span className="text-[#2d5be3] italic">碰壁→診斷→救活→定案</span>
                </h1>
                <p className="text-[15px] text-[#4a4a6a] max-w-[600px] leading-[1.75] mb-8">
                    好的研究不是「想出來」的，是「磨出來」的。今天我們先感受「碰壁」的真實感，再學會用一個心法診斷並救活你的原石題目。
                </p>

                {/* META STRIP */}
                <div className="w3-meta-strip">
                    {[
                        { label: '本週任務', value: '碰壁體驗 + 診斷8題 + AI協作' },
                        { label: '課堂產出', value: 'W3 最終定案題目' },
                        { label: '下週預告', value: 'W4 題目博覽會' }
                    ].map((item, idx) => (
                        <div key={idx} className="w3-meta-item">
                            <div className="text-[10px] font-mono text-[#8888aa] uppercase tracking-[0.08em] mb-1">{item.label}</div>
                            <div className="text-[13px] font-bold text-[#1a1a2e]">{item.value}</div>
                        </div>
                    ))}
                </div>
            </header>

            {/* PHASE 0: OBSTACLE EXPERIENCE */}
            <div className="w3-section-head"><h2>碰壁體驗</h2><div className="line"></div><div className="mono">PHASE 0</div></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
                <div className="border border-[#dddbd5] rounded-[10px] overflow-hidden bg-white">
                    <div className="p-4 bg-[#f0ede6] border-b border-[#dddbd5] font-bold">題目 A</div>
                    <div className="p-5">
                        <p className="text-[14px] font-medium text-[#1a1a2e] mb-4">高中生上課使用手機的頻率，與課堂專注程度之間有什麼關係？</p>
                        <button
                            onClick={() => setObstacleStates(prev => ({ ...prev, a: !prev.a }))}
                            className={`w-full py-2 text-[12px] font-bold rounded flex items-center justify-center gap-2 transition-all ${obstacleStates.a ? 'bg-[#c0392b] text-white' : 'bg-[#e8eeff] text-[#2d5be3]'}`}>
                            {obstacleStates.a ? '⚠️ 現實考驗：無法執行' : '🔍 這是好題目嗎？試試看第一步...'}
                        </button>
                        {obstacleStates.a && (
                            <div className="mt-4 p-4 bg-[#fdecea] rounded-[6px] text-[#c0392b] text-[12px] leading-relaxed animate-in fade-in slide-in-from-top-2">
                                <strong>卡住了吧？</strong> 「專注程度」要怎麼問？叫同學自己填，他們會說實話嗎？你要上課盯著別人記次數嗎？你自己也要上課耶！
                            </div>
                        )}
                    </div>
                </div>
                <div className="border border-[#dddbd5] rounded-[10px] overflow-hidden bg-white">
                    <div className="p-4 bg-[#f0ede6] border-b border-[#dddbd5] font-bold">題目 B</div>
                    <div className="p-5">
                        <p className="text-[14px] font-medium text-[#1a1a2e] mb-4">與我關係親近的朋友，在社群媒體上收到的推薦內容相似程度是否更高？</p>
                        <button
                            onClick={() => setObstacleStates(prev => ({ ...prev, b: !prev.b }))}
                            className={`w-full py-2 text-[12px] font-bold rounded flex items-center justify-center gap-2 transition-all ${obstacleStates.b ? 'bg-[#c0392b] text-white' : 'bg-[#e8eeff] text-[#2d5be3]'}`}>
                            {obstacleStates.b ? '⚠️ 現實考驗：無法驗證' : '🔍 這是好題目嗎？試試看第一步...'}
                        </button>
                        {obstacleStates.b && (
                            <div className="mt-4 p-4 bg-[#fdecea] rounded-[6px] text-[#c0392b] text-[12px] leading-relaxed animate-in fade-in slide-in-from-top-2">
                                <strong>發現了嗎？</strong> 你怎麼知道朋友的演算法長什麼樣子？叫他截圖？要截幾張？兩個人的推薦頁要怎麼比相似度？越說越複雜了。
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="w3-section-head"><h2>學什麼</h2><div className="line"></div><div className="mono">CONCEPT</div></div>
            <div className="w3-disease-grid">
                {[
                    { c: 'A', n: '抽象哲學病', s: '題目太玄、定義不清，無法測量' },
                    { c: 'B', n: '算命占卜病', s: '試圖預測未來還沒發生的事' },
                    { c: 'C', n: '百科全書病', s: '題目範圍太大，網路查就有答案' },
                    { c: 'D', n: '主觀偏見病', s: '題目帶有強烈預設立場，不客觀' },
                    { c: 'E', n: '是非廢話病', s: '答案只有「有/沒有」，顯而易見' },
                    { c: 'F', n: '觀落陰病', s: '對象已過世、太大咖、接觸不到' },
                    { c: 'G', n: '方法無效病', s: '無法透過觀察、實驗、問卷驗證' },
                    { c: 'H', n: '變因失控病', s: '影響因素太多太雜，無法控制' }
                ].map(d => (
                    <div className="w3-disease-card" key={d.c}><div className="w3-disease-code">{d.c}</div><div className="w3-disease-name">{d.n}</div><div className="w3-disease-symptom">{d.s}</div></div>
                ))}
            </div>
            <div className="w3-mantra-box">
                <div className="w3-mantra-hd"><div className="title">萬用急救心法：把「大、空、遠、難」變成「小、實、近、易」</div></div>
                <div className="w3-mantra-core">
                    <div className="w3-mantra-rows">
                        {[
                            { f: '大', t: '小', d: '範圍縮小' },
                            { f: '空', t: '實', d: '抽象具體化' },
                            { f: '遠', t: '近', d: '對象可及化' },
                            { f: '難', t: '易', d: '方法可行化' }
                        ].map(m => (
                            <div className="w3-mantra-row-item" key={m.f}><div className="w3-mantra-from">{m.f}</div><div className="w3-mantra-arrow-sm">↓</div><div className="w3-mantra-to">{m.t}</div><div className="w3-mantra-desc">{m.d}</div></div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="w3-w5h1-grid">
                {[
                    { w: 'Who', l: '對象', q: '研究的是誰？要具體到一個可接觸的群體。' },
                    { w: 'Where', l: '場域', q: '在哪個地點或範圍內進行？' },
                    { w: 'What', l: '變項', q: '核心概念是什麼？要能測量。' },
                    { w: 'When', l: '時間', q: '有特定的時間點或情境嗎？' },
                    { w: 'How', l: '方法', q: '用問卷？訪談？觀察？文獻？實驗？' }
                ].map(item => (
                    <div className="w3-w5h1-item" key={item.w}><div className="w3-w5h1-w">{item.w}</div><div className="w3-w5h1-label">{item.l}</div><div className="w3-w5h1-q">{item.q}</div></div>
                ))}
            </div>
            <div className="w3-section-head"><h2>練什麼</h2><div className="line"></div><div className="mono">PRACTICE</div></div>
            <div className="w3-task-block">
                <div className="w3-task-hd"><span className="w3-task-badge">PART 1</span><span className="w3-task-title">🏥 急診室大作戰：8 個病人</span></div>
                <div className="w3-task-body">
                    <div className="w3-patient-grid">
                        {[
                            { id: 'a1', n: '1', t: '吃早餐對學測成績的影響', a: 'H 變因失控病 — 影響學測成績的因素太多，無法只控制早餐這一個變因。' },
                            { id: 'a2', n: '2', t: '探究幸福的真諦', a: 'A 抽象哲學病 — 「幸福」太抽象，無法測量，研究無從下手。' },
                            { id: 'a3', n: '3', t: '訪談愛因斯坦對相對論的看法', a: 'F 觀落陰病 — 對象已過世 140 多年，接觸不到。' },
                            { id: 'a4', n: '4', t: '為什麼貓咪比狗狗可愛？', a: 'D 主觀偏見病 — 預設「貓比狗可愛」，帶有強烈主觀立場。' },
                            { id: 'a5', n: '5', t: '高中生有沒有在使用手機？', a: 'E 是非廢話病 — 答案顯而易見，「有」，研究毫為意義。' },
                            { id: 'a6', n: '6', t: '全球暖化的成因與防治', a: 'C 百科全書病 — 範圍橫跨全球，資料網路查就有，不需要研究。' },
                            { id: 'a7', n: '7', t: '上帝真的存在嗎？', a: 'G 方法無效病 — 無法透過觀察、問卷、實驗任何方式驗證。' },
                            { id: 'a8', n: '8', t: '2028 年奧運誰會拿金牌？', a: 'B 算命占卜病 — 預測未來尚未發生的事，無從驗證。' }
                        ].map(p => (
                            <div className="w3-patient-card" key={p.id}>
                                <div className="w3-patient-hd"><span className="w3-patient-num">病人 #{p.n}</span>{!revealedAnswers[p.id] && <button className="w3-unlock-btn" onClick={() => handleUnlock(p.id)}>🔓</button>}</div>
                                <div className="w3-patient-body">{p.t}</div>
                                {revealedAnswers[p.id] && <div className="w3-patient-answer"><strong>{p.a.split(' ')[0]}</strong> {p.a.substring(p.a.indexOf(' ') + 1)}</div>}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="w3-collab-steps">
                {[
                    { n: '1', t: '你先診斷', d: '從 30 題中再選 1 題，先自己判斷是哪種病。', s: 'w3-step-human' },
                    { n: '2', t: '問 AI 診斷', d: '把題目貼給 AI，問它「這個研究題目有什麼問題？」', s: 'w3-step-ai' },
                    { n: '3', t: '比對差異', d: '你的診斷 vs AI 的診斷，一樣嗎？', s: 'w3-step-you' },
                    { n: '4', t: '問 AI 給 3 個改法', d: '讓 AI 給你 3 個不同的修改版本。', s: 'w3-step-ai' },
                    { n: '5', t: '你選一個', d: '選哪個理由必須是你的判斷。', s: 'w3-step-you' }
                ].map(step => (
                    <div className="w3-collab-step" key={step.n}><div className={`w3-collab-step-num ${step.s}`}>{step.n}</div><div className="w3-collab-step-content"><div className="w3-collab-step-title">{step.t}</div><div className="w3-collab-step-desc">{step.d}</div></div></div>
                ))}
            </div>
            <div className="w3-prompt-box">
                <div className="w3-prompt-hd"><span>PROMPT · 句型優化器</span><button className="w3-copy-btn" onClick={() => handleCopy('p1', `我的研究題目初稿是：【請貼上你的初稿】\n\n請幫我優化成更專業的版本：\n1. 加上學術量化或質性動作（如：探討、相關性、差異分析、影響）\n2. 讓 Who(研究對象) / What(研究變數) 描述更精確\n3. 確保高中生可以執行，字數不要過長\n請給我 3 個優化版本。`)}>{copyStatus['p1'] ? '已複製！' : '複製'}</button></div>
                <div className="w3-prompt-body">我的研究題目初稿是：【請貼上你的初稿】<br /><br />請幫我優化成更專業的版本：<br />1. 加上學術量化或質性動作（如：探討、相關性、差異分析、影響）<br />2. 讓 Who(研究對象) / What(研究變數) 描述更精確<br />3. 確保高中生可以執行，字數不要過長<br /><br />請給我 3 個優化版本。</div>
            </div>

            <div className="w3-section-head"><h2>本週總結</h2><div className="line"></div><div className="mono">WRAP-UP</div></div>

            <div className="w3-hw-block">
                <div className="w3-hw-header">
                    <div className="w3-hw-header-left">
                        <span className="w3-task-badge">HOMEWORK</span>
                        <span className="w3-hw-header-title">本週作業</span>
                    </div>
                    <span className="w3-hw-deadline">截止：下週一 23:59</span>
                </div>
                <div className="w3-hw-list">
                    {[
                        { p: 'Part 1', n: '急診室大作戰：8 題診斷填代號' },
                        { p: 'Part 2', n: '人的診斷練習：自選 2 題，不准用 AI' },
                        { p: 'Part 3', n: 'AI 協作工作坊：5 步驟 + AI-RED 記錄' },
                        { p: 'Part 4', n: '同儕驗證（互換學習單 + 簽名）' },
                        { p: 'Part 5', n: '5W1H 規格化（帶入 W2 探究意圖）' },
                        { p: 'Part 6', n: '可行性快篩（全部通過才算完成）' },
                        { p: 'Part 7', n: 'AI 句型優化器 + 最終定案題目', b: '最終定案' }
                    ].map(hw => (
                        <div className="w3-hw-item" key={hw.p}><span className="w3-hw-part">{hw.p}</span><span className="w3-hw-name">{hw.n}</span>{hw.b && <span className="w3-hw-badge">{hw.b}</span>}</div>
                    ))}
                </div>
                <div className="w3-hw-foot">
                    <span style={{ fontSize: '12px', color: 'var(--ink-light)' }}>學習單在 Google Classroom 下載</span>
                    <a href="#" className="w3-gc-link">→ Google Classroom</a>
                </div>
            </div>

            <div className="w3-next-week-preview">
                <div className="w3-next-week-header">
                    <span className="w3-next-week-badge">NEXT WEEK</span>
                    <h3 className="w3-next-week-title">W4 預告</h3>
                </div>
                <div className="w3-next-week-content">
                    <div className="w3-next-week-col">
                        <div className="w3-next-week-label">W4 主題</div>
                        <p className="w3-next-week-text">Gallery Walk 題目博覽會——帶著你的定案題目公諸於世。</p>
                    </div>
                    <div className="w3-next-week-col">
                        <div className="w3-next-week-label">你要帶來</div>
                        <p className="w3-next-week-text"><strong>海報</strong>：包含定案題目、Who、How、為什麼想研究。</p>
                    </div>
                </div>
            </div>
            <div className="flex justify-between items-center py-12 border-t border-[#dddbd5]">
                <Link to="/w2" className="text-[13px] font-bold text-[#8888aa] hover:text-[#1a1a2e] flex items-center gap-2 transition-colors">
                    ← 回 W2 問題意識
                </Link>
                <Link to="/w4" className="bg-[#1a1a2e] text-white px-8 py-3 rounded-[6px] text-[13px] font-bold hover:bg-[#2a2a4a] transition-all flex items-center gap-2 group">
                    前往 W4 題目博覽會 <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>
        </div>
    );
};
