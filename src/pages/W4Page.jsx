import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Map, ArrowRight, CheckCircle2, ShieldAlert, Search, Zap, Palette, Users2, Target, BookOpen, ClipboardCheck, Lightbulb } from 'lucide-react';
import LessonMap from '../components/ui/LessonMap';
import { W4Data } from '../data/lessonMaps';

export const W4Page = () => {
    const [showLessonMap, setShowLessonMap] = useState(false);
    const [copyStatus, setCopyStatus] = useState({});
    const [selectedMethod, setSelectedMethod] = useState('');

    // Form States
    const [w3Topic, setW3Topic] = useState('');
    const [myDraftTitle, setMyDraftTitle] = useState('');
    const [myDraftAssumptions, setMyDraftAssumptions] = useState('');
    const [adviceAccept, setAdviceAccept] = useState('');
    const [adviceReject, setAdviceReject] = useState('');
    const [adviceUnsure, setAdviceUnsure] = useState('');
    const [finalTopic, setFinalTopic] = useState('');
    const [searchKeywords, setSearchKeywords] = useState('');
    const [apaFormat, setApaFormat] = useState('');

    const handleCopy = (id, text) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopyStatus(prev => ({ ...prev, [id]: true }));
            setTimeout(() => setCopyStatus(prev => ({ ...prev, [id]: false })), 1500);
        });
    };

    const posterPrompt = `我的研究海報需要以下元素：\n- 研究題目：${w3Topic || '【貼上 W3 定案題目】'}\n- 吸引人的標題草稿：${myDraftTitle || '【貼上你的草稿】'}\n- 預期發現草稿：${myDraftAssumptions || '【貼上你的預測】'}\n\n請幫我：\n1. 優化標題，讓它更吸引高中生，保持白話但加一點懸疑感\n2. 把預期發現改寫得更有研究感（加入「可能」「推測」等詞）\n3. 給我 2 個版本讓我選\n\n請保持在我原本的研究範圍內，不要幫我改題目方向。`;
    const keywordPrompt = `我的研究題目是：${finalTopic || '【貼上你的定案題目】'}\n\n請幫我：\n1. 列出 5 個相關的繁體中文學術關鍵字\n2. 列出 5 個對應的英文學術關鍵字\n3. 告訴我這個研究方向在學術界通常叫什麼名稱\n\n請不要改我的研究題目，只幫我找關鍵字。`;

    return (
        <div className="max-w-[1000px] mx-auto px-6 lg:px-12 py-12 animate-in fade-in slide-in-from-bottom-4 duration-500 font-sans text-[13px] leading-[1.6] text-[#1a1a2e] pb-32">
            <style dangerouslySetInnerHTML={{
                __html: `
                :root { --ink: #1a1a2e; --ink-mid: #4a4a6a; --ink-light: #8888aa; --paper: #f8f7f4; --paper-warm: #f0ede6; --accent: #2d5be3; --accent-light: #e8eeff; --gold: #c9a84c; --gold-light: #fdf6e3; --success: #2e7d5a; --success-light: #e8f5ee; --danger: #c0392b; --danger-light: #fdecea; --border: #dddbd5; --border-mid: #c8c5bc; }
                .w4-content { padding: 48px 60px; max-width: 1000px; margin: 0 auto; }
                .w4-round-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1px; background: var(--border); border: 1px solid var(--border); border-radius: 10px; overflow: hidden; margin-bottom: 24px; }
                .w4-round-item { background: #fff; padding: 16px 16px; }
                .w4-round-num { font-family: 'DM Mono', monospace; font-size: 22px; font-weight: 700; color: var(--accent); margin-bottom: 4px; }
                .w4-round-tag { font-family: 'DM Mono', monospace; font-size: 10px; padding: 2px 7px; border-radius: 3px; display: inline-block; margin-bottom: 8px; }
                .w4-round-desc { font-size: 12px; color: var(--ink-mid); line-height: 1.6; }
                .w4-search-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-top: 16px; }
                .w4-search-card { border: 1px solid var(--border); border-radius: 10px; padding: 20px; background: #fff; display: flex; align-items: flex-start; gap: 16px; transition: transform 0.15s; }
                .w4-search-card:hover { transform: translateY(-2px); border-color: var(--accent); }
                .w4-search-icon { width: 40px; height: 40px; background: var(--paper-warm); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: var(--accent); flex-shrink: 0; }
                .w4-page-eyebrow { font-size: 11px; font-family: 'DM Mono', monospace; color: var(--accent); margin-bottom: 12px; letter-spacing: 0.06em; }
                .w4-page-title { font-family: 'Noto Serif TC', serif; font-size: 42px; font-weight: 700; line-height: 1.2; color: var(--ink); margin-bottom: 12px; letter-spacing: -0.01em; }
                .w4-page-title em { font-style: normal; color: var(--accent); }
                .w4-page-subtitle { font-size: 16px; color: var(--ink-mid); line-height: 1.75; margin-bottom: 40px; max-width: 680px; }
                .w4-meta-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 56px; }
                .w4-meta-card { background: #fff; border: 1px solid var(--border); border-radius: 12px; padding: 16px 20px; }
                .w4-meta-label { font-size: 11px; color: var(--ink-light); margin-bottom: 8px; font-weight: 500; }
                .w4-meta-value { font-size: 14px; font-weight: 700; color: var(--ink); line-height: 1.4; }
                .w4-section-head { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; margin-top: 48px; }
                .w4-section-head h2 { font-family: 'Noto Serif TC', serif; font-size: 18px; font-weight: 700; color: var(--ink); white-space: nowrap; }
                .w4-section-head .line { flex: 1; height: 1px; background: var(--border); }
                .w4-section-head .mono { font-family: 'DM Mono', monospace; font-size: 10px; color: var(--ink-light); }
                .w4-section-desc { font-size: 14px; color: var(--ink-mid); margin-bottom: 32px; line-height: 1.6; max-width: 800px; }
                .w4-test-compare { display: grid; grid-template-columns: 1fr 1fr; gap: 1px; background: var(--border); border: 1px solid var(--border); border-radius: 10px; overflow: hidden; margin-bottom: 24px; }
                .w4-test-col { background: #fff; padding: 20px 22px; }
                .w4-test-col-hd { display: flex; align-items: center; gap: 8px; margin-bottom: 12px; }
                .w4-test-dot { width: 8px; height: 8px; border-radius: 50%; shrink: 0; }
                .w4-poster-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 1px; background: var(--border); border: 1px solid var(--border); border-radius: 10px; overflow: hidden; margin-bottom: 24px; }
                .w4-poster-item { background: #fff; padding: 14px 14px; }
                .w4-poster-num { font-family: 'DM Mono', monospace; font-size: 20px; font-weight: 700; color: var(--accent); margin-bottom: 4px; }
                .w4-poster-label { font-size: 13px; font-weight: 700; color: var(--ink); margin-bottom: 4px; }
                .w4-poster-desc { font-size: 11px; color: var(--ink-light); line-height: 1.6; }
                .w4-poster-item.highlight { background: var(--ink); }
                .w4-poster-item.highlight .w4-poster-num { color: var(--gold); }
                .w4-poster-item.highlight .w4-poster-label { color: #fff; }
                .w4-poster-item.highlight .w4-poster-desc { color: rgba(255,255,255,0.5); }
                .w4-round-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1px; background: var(--border); border: 1px solid var(--border); border-radius: 10px; overflow: hidden; margin-bottom: 12px; }
                .w4-round-item { background: #fff; padding: 16px 16px; }
                .w4-round-num { font-family: 'DM Mono', monospace; font-size: 22px; font-weight: 700; color: var(--accent); margin-bottom: 4px; }
                .w4-round-desc { font-size: 12px; color: var(--ink-mid); line-height: 1.6; }
                .w4-role-tag { font-family: 'DM Mono', monospace; font-size: 9px; padding: 2px 6px; border-radius: 3px; margin-right: 4px; }
                .w4-role-present { background: var(--danger-light); color: var(--danger); }
                .w4-role-walk { background: var(--accent-light); color: var(--accent); }
                .w4-sticky-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px; background: var(--border); border: 1px solid var(--border); border-radius: 10px; overflow: hidden; margin-bottom: 24px; }
                .w4-sticky-col { background: #fff; padding: 18px 20px; }
                .w4-sticky-col-hd { font-size: 13px; font-weight: 700; color: var(--ink); margin-bottom: 6px; display: flex; align-items: center; gap: 8px; }
                .w4-sticky-col-sub { font-size: 11px; color: var(--ink-light); line-height: 1.6; }
                .w4-method-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 8px; margin-bottom: 20px; }
                .w4-method-card { border: 1px solid var(--border); border-radius: 8px; padding: 14px 12px; background: #fff; text-align: center; cursor: pointer; transition: all 0.15s; }
                .w4-method-card.active { border-color: var(--accent); background: var(--accent-light); }
                .w4-method-card .icon { font-size: 20px; margin-bottom: 6px; }
                .w4-method-card .name { font-size: 13px; font-weight: 700; color: var(--ink); }
                .w4-method-card .en { font-size: 10px; font-family: 'DM Mono', monospace; color: var(--ink-light); margin-top: 2px; }
                .w4-prompt-box { border: 1px solid var(--border-mid); border-radius: 8px; overflow: hidden; margin: 12px 0; }
                .w4-prompt-hd { padding: 8px 14px; background: var(--ink); display: flex; align-items: center; gap: 8px; }
                .w4-prompt-hd span { font-family: 'DM Mono', monospace; font-size: 10px; color: rgba(255,255,255,0.5); }
                .w4-copy-btn { margin-left: auto; font-family: 'DM Mono', monospace; font-size: 10px; color: rgba(255,255,255,0.5); background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); padding: 2px 8px; border-radius: 3px; cursor: pointer; }
                .w4-copy-btn:hover { background: rgba(255,255,255,0.15); color: #fff; }
                .w4-prompt-body { padding: 14px 16px; background: #fafaf8; font-size: 12px; color: var(--ink-mid); line-height: 1.85; font-family: 'DM Mono', monospace; white-space: pre-wrap; }
                .w4-task-block { border: 1px solid var(--border); border-radius: 10px; overflow: hidden; background: #fff; margin-bottom: 12px; }
                .w4-task-hd { padding: 12px 20px; background: var(--paper-warm); border-bottom: 1px solid var(--border); display: flex; align-items: center; gap: 10px; }
                .w4-task-badge { font-family: 'DM Mono', monospace; font-size: 10px; background: var(--ink); color: #fff; padding: 2px 8px; border-radius: 3px; }
                .w4-task-title { font-size: 14px; font-weight: 700; color: var(--ink); }
                .w4-task-body { padding: 20px 24px; }
                .w4-task-ol { padding-left: 20px; font-size: 13px; color: var(--ink-mid); line-height: 2; }
                .w4-notice { margin-top: 14px; padding: 12px 16px; border-radius: 0 6px 6px 0; font-size: 13px; line-height: 1.75; border-left: 4px solid; color: var(--ink-mid); }
                .w4-notice-accent { background: var(--accent-light); border-left-color: var(--accent); }
                .w4-notice-gold { background: var(--gold-light); border-left-color: var(--gold); }
                .w4-notice-success { background: var(--success-light); border-left-color: var(--success); }
                .w4-hw-list { display: flex; flex-direction: column; gap: 1px; background: var(--border); }
                .w4-hw-item { background: #fff; padding: 12px 20px; display: flex; align-items: flex-start; gap: 16px; }
                .w4-hw-part { font-family: 'DM Mono', monospace; font-size: 11px; color: var(--accent); width: 70px; shrink: 0; font-weight: 700; }
                .w4-hw-name { font-size: 13px; color: var(--ink-mid); flex: 1; }
                .w4-next-week-preview { background: var(--ink); border-radius: 10px; overflow: hidden; margin-bottom: 48px; border: 1px solid var(--border); }
                .w4-next-week-header { padding: 16px 24px; border-bottom: 1px solid rgba(255,255,255,0.06); display: flex; align-items: center; gap: 10px; }
                .w4-next-week-badge { font-family: 'DM Mono', monospace; font-size: 10px; background: rgba(255,255,255,0.1); color: rgba(255,255,255,0.5); padding: 2px 8px; border-radius: 3px; }
                .w4-next-week-title { font-size: 14px; font-weight: 700; color: #fff; }
                .w4-next-week-content { display: grid; grid-template-columns: 1fr 1fr; gap: 1px; background: rgba(255,255,255,0.05); }
                .w4-next-week-col { background: var(--ink); padding: 20px 24px; }
                .w4-next-week-label { font-size: 10px; font-family: 'DM Mono', monospace; color: rgba(255,255,255,0.3); margin-bottom: 4px; }
                .w4-next-week-text { font-size: 13px; color: rgba(255,255,255,0.75); line-height: 1.75; }
                @media (max-width: 768px) { .w4-content { padding: 24px 20px; } .w4-meta-strip, .w4-test-compare, .w4-poster-grid, .w4-round-grid, .w4-sticky-grid, .w4-method-grid, .w4-next-week-content { grid-template-columns: 1fr; } }
            ` }} />
            {/* MAIN CONTENT */}
            {/* TOP BAR / NAVIGATION PATH */}
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
                    <span className="bg-[#2d5be3] text-white text-[10px] font-bold px-2 py-0.5 rounded-[2px] font-mono">互審與搜尋</span>
                </div>
            </div>

            {showLessonMap && (
                <div className="animate-in slide-in-from-top-4 duration-300">
                    <LessonMap data={W4Data} />
                </div>
            )}

            {/* PAGE HEADER */}
            <header>
                <div className="text-[11px] font-mono text-[#2d5be3] mb-3 tracking-[0.06em]">🖼 W4 · 研究規劃</div>
                <h1 className="font-serif text-[36px] font-bold leading-[1.2] text-[#1a1a2e] mb-4 tracking-[-0.02em]">
                    題目博覽會：<span className="text-[#2d5be3] italic">壓力測試→真正定案</span>
                </h1>
                <p className="text-[15px] text-[#4a4a6a] max-w-[600px] leading-[1.75] mb-8">
                    W3 的定案是入場券，W4 才是壓力測試。你的題目要在三十幾個同學面前站得住腳——過了，才算真正的定案。
                </p>

                {/* META CARDS */}
                <div className="w4-meta-grid">
                    {[
                        { label: '第一節', value: '海報 Pitch + 同儕互審健檢' },
                        { label: '第二節', value: '題目定案 + 關鍵文獻搜尋' },
                        { label: '課業產出', value: '最終題目 + 第一篇 APA 文獻' },
                        { label: '帶去 W5', value: '關鍵文獻內容 + 偵探心態' }
                    ].map((item, idx) => (
                        <div key={idx} className="w4-meta-card">
                            <div className="w4-meta-label">{item.label}</div>
                            <div className="w4-meta-value">{item.value}</div>
                        </div>
                    ))}
                </div>

                {/* COURSE ARC - Standard Version A */}
                <div className="mb-14">
                    <div className="text-[11px] text-[#8888aa] mb-4">課程弧線 · 你在哪裡</div>
                    <div className="grid grid-cols-7 border border-[#dddbd5] rounded-[12px] overflow-hidden">
                        {[
                            { wk: 'W1-W2', name: '探索階段\nRED公約', past: true },
                            { wk: 'W3', name: '題目健檢\n核心心法', past: true },
                            { wk: 'W4', name: '題目博覽會\n同儕互修', now: true },
                            { wk: 'W5-W6', name: '文獻鑑識\n診所分流' },
                            { wk: 'W7', name: '組隊決策\n企劃定案' },
                            { wk: 'W8-W10', name: '工具設計\n倫理審查' },
                            { wk: 'W11-W16', name: '執行研究\n成果發表' }
                        ].map((item, idx) => (
                            <div key={idx} className={`p-4 text-center border-r border-[#dddbd5] last:border-r-0 ${item.past ? 'bg-[#f0f7f4]' : item.now ? 'bg-[#1a1a2e]' : 'bg-[#f8f7f4]'}`}>
                                <div className={`text-[10px] font-mono mb-2 ${item.past ? 'text-[#2e7d5a]' : item.now ? 'text-white/40' : 'text-[#8888aa]'}`}>
                                    {item.wk} {item.now && '← 現在'}
                                </div>
                                <div className={`text-[11px] font-bold leading-tight ${item.past ? 'text-[#1a1a2e]' : item.now ? 'text-[#c9a84c]' : 'text-[#8888aa]'}`}>
                                    {item.name.split('\n').map((line, i) => <div key={i}>{line}</div>)}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </header>

            <div className="w4-section-head"><h2>學什麼</h2><div className="line"></div><div className="mono">CONCEPT</div></div>
            <p className="w4-section-desc">了解如何利用同儕回饋來精煉你的題目，並學習如何從圖書館與資料庫中挖出最相關的學術寶藏。</p>
            <div className="w4-test-compare">
                <div className="w4-test-col">
                    <div className="w4-test-col-hd"><div className="w4-test-dot" style={{ background: 'var(--gold)' }}></div><span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--gold)' }}>W3 最終定案</span><span style={{ fontFamily: 'DM Mono', fontSize: '10px', color: 'var(--ink-light)', marginLeft: '8px' }}>入場券</span></div>
                    <ul className="w4-task-ol"><li>你自己認可的版本</li><li>通過 5W1H + 可行性快篩</li><li>AI 幫你包裝過語言</li><li>只有你自己看過</li></ul>
                </div>
                <div className="w4-test-col" style={{ background: 'var(--success-light)' }}>
                    <div className="w4-test-col-hd"><div className="w4-test-dot" style={{ background: 'var(--success)' }}></div><span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--success)' }}>W4 最終定案</span><span style={{ fontFamily: 'DM Mono', fontSize: '10px', color: 'var(--success)', marginLeft: '8px', opacity: 0.6 }}>真正定案</span></div>
                    <ul className="w4-task-ol"><li>經過三十幾人壓力測試</li><li>收到同學的具體建議</li><li>你有判斷地接受或拒絕</li><li>你能清楚說明為什麼</li></ul>
                </div>
            </div>

            <div className="w4-poster-grid">
                {[
                    { n: '①', l: '吸引人的標題', d: '大字，讓人一眼停下來的那種' },
                    { n: '②', l: '正式研究題目', d: '比標題小一點，W3 的定案版本' },
                    { n: '③', l: '研究對象 Who', d: '具體的人或群體' },
                    { n: '④', l: '研究方法 How', d: '問卷 / 訪談 / 實驗 / 觀察 / 文獻' },
                    { n: '⑤', l: '預期發現', d: '2–3 點大膽猜測，讓人有話聊', h: true }
                ].map(item => (
                    <div className={`w4-poster-item ${item.h ? 'highlight' : ''}`} key={item.n}><div className="w4-poster-num">{item.n}</div><div className="w4-poster-label">{item.l}</div><div className="w4-poster-desc">{item.d}</div></div>
                ))}
            </div>

            {/* POSTER EXAMPLE */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px', marginTop: '28px' }}>
                <span style={{ fontFamily: '"DM Mono", monospace', fontSize: '10px', background: 'var(--success)', color: '#fff', padding: '3px 8px', borderRadius: '3px', letterSpacing: '0.06em' }}>範例 EXAMPLE</span>
                <span style={{ fontFamily: '"DM Mono", monospace', fontSize: '10px', color: 'var(--ink-light)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>優質海報範例：滑手機與睡眠</span>
            </div>

            <div className="w4-practice-block" style={{ marginBottom: '32px' }}>
                <div className="w4-practice-header" style={{ background: 'var(--success-light)' }}>
                    <CheckCircle2 size={16} className="text-[#2e7d5a]" />
                    <span className="w4-practice-title">案例：為什麼你的大腦停不下來？</span>
                    <span className="w4-practice-sub">這是一張會吸引人停下來的海報</span>
                </div>
                <div className="w4-practice-body">
                    {/* Visual Image Section - Top */}
                    <div className="mb-10">
                        <div style={{ fontSize: '11px', color: 'var(--ink-light)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>視覺海報 (A4 內容)</div>
                        <div style={{ border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden', background: '#fff', boxShadow: '0 8px 24px rgba(0,0,0,0.06)', maxWidth: '400px' }}>
                            <img src="/images/user_research_poster.png" alt="User Research Poster" style={{ width: '100%', height: 'auto', display: 'block' }} />
                        </div>
                    </div>

                    {/* Text Analysis Section - Bottom */}
                    <div style={{ borderTop: '1px solid var(--border)', paddingTop: '32px', display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 1.5fr', gap: '48px' }}>
                        {/* Analysis Column 1 */}
                        <div>
                            <div style={{ fontSize: '11px', color: 'var(--ink-light)', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>標題 & 題目</div>

                            <div className="mb-6">
                                <div style={{ fontSize: '11px', color: 'var(--ink-light)', marginBottom: '6px', opacity: 0.8, fontWeight: 500 }}>吸引人的標題</div>
                                <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--accent)', lineHeight: 1.4 }}>
                                    滑手機真的會讓你睡不好嗎？<br />為什麼你的大腦停不下來？
                                </div>
                            </div>

                            <div>
                                <div style={{ fontSize: '11px', color: 'var(--ink-light)', marginBottom: '6px', opacity: 0.8, fontWeight: 500 }}>正式研究題目</div>
                                <div style={{ fontSize: '14px', color: 'var(--ink)', fontWeight: 600, lineHeight: 1.5 }}>
                                    高中生睡前手機使用時數與課堂專注度之相關性探討
                                </div>
                            </div>
                        </div>

                        {/* Analysis Column 2 */}
                        <div>
                            <div style={{ fontSize: '11px', color: 'var(--ink-light)', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>預期發現 (AI 優化後)</div>
                            <ul className="w4-task-ol" style={{ marginTop: '0', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <li>
                                    <strong style={{ color: 'var(--ink)', fontSize: '14px' }}>推測一</strong><br />
                                    <span style={{ color: 'var(--ink-mid)' }}>睡前使用手機超過 1 小時的同學，其大腦灰質活動可能持續處於興奮狀態，導致隔天專注度明顯下降。</span>
                                </li>
                                <li>
                                    <strong style={{ color: 'var(--ink)', fontSize: '14px' }}>推測二</strong><br />
                                    <span style={{ color: 'var(--ink-mid)' }}>參與社群媒體互動（如 IG/TikTok）的視覺與心理刺激，可能比單純觀看影片更容易延後褪黑激素的分泌。</span>
                                </li>
                            </ul>
                            <div className="w4-notice" style={{ marginTop: '24px', background: 'var(--paper-warm)', borderColor: 'var(--border-mid)', fontSize: '12px' }}>
                                💡 <strong>核心對比</strong>：手寫海報（如圖）偏向白話且具備視覺亮點，右方文字則是 W3 定案後的專業轉換，兩者相輔相成。
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* STEP 2: Gallery Walk */}
            <div className="w4-section-head">
                <h2>階段 2：Gallery Walk 順轉模式</h2><div className="line"></div><div className="mono">15-46 MINS</div>
            </div>

            <div className="w4-practice-block" style={{ marginBottom: '24px' }}>
                <div className="w4-practice-header" style={{ background: 'var(--ink)', color: '#fff' }}>
                    <Users2 size={16} className="text-[var(--gold)]" />
                    <span className="w4-practice-title" style={{ color: '#fff' }}>說明遊戲規則：什麼是「順轉模式」？</span>
                    <span className="w4-practice-sub" style={{ opacity: 0.6 }}>每場 5 分鐘 · 鈴聲換場</span>
                </div>
                <div className="w4-practice-body">
                    <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--ink)', marginBottom: '12px' }}>
                        「好！海報都製作好了。現在我們要進行『Gallery Walk 順轉模式』。」
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
                        <div style={{ background: 'var(--paper-warm)', padding: '12px 16px', borderRadius: '8px', textAlign: 'center' }}>
                            <div style={{ fontSize: '11px', color: 'var(--ink-light)', marginBottom: '4px' }}>報告次數</div>
                            <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--accent)' }}>每人 1 次</div>
                        </div>
                        <div style={{ background: 'var(--paper-warm)', padding: '12px 16px', borderRadius: '8px', textAlign: 'center' }}>
                            <div style={{ fontSize: '11px', color: 'var(--ink-light)', marginBottom: '4px' }}>聆聽次數</div>
                            <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--accent)' }}>每人 3 次</div>
                        </div>
                        <div style={{ background: 'var(--paper-warm)', padding: '12px 16px', borderRadius: '8px', textAlign: 'center' }}>
                            <div style={{ fontSize: '11px', color: 'var(--ink-light)', marginBottom: '4px' }}>總計場數</div>
                            <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--accent)' }}>共 4 場</div>
                        </div>
                    </div>

                    <div className="w4-round-grid">
                        {[
                            { r: '01', t: '報告場', c: 'var(--danger-light)', tc: 'var(--danger)', d: '你在 A 位置報告，聽眾來找你' },
                            { r: '02', t: '聆聽場', c: 'var(--accent-light)', tc: 'var(--accent)', d: '你移到 B 位置聆聽' },
                            { r: '03', t: '聆聽場', c: 'var(--accent-light)', tc: 'var(--accent)', d: '你移到 C 位置聆聽' },
                            { r: '04', t: '聆聽場', c: 'var(--accent-light)', tc: 'var(--accent)', d: '你移到 D 位置聆聽' }
                        ].map(round => (
                            <div className="w4-round-item" key={round.r}>
                                <div className="w4-round-num">{round.r}</div>
                                <span className="w4-round-tag" style={{ background: round.c, color: round.tc }}>{round.t}</span>
                                <div className="w4-round-desc">{round.d}</div>
                            </div>
                        ))}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '24px' }}>
                        <div style={{ background: 'var(--paper)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--ink)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Target size={14} className="text-[var(--danger)]" /> 報告者任務
                            </div>
                            <div style={{ fontSize: '12px', color: 'var(--ink-mid)', lineHeight: 1.7 }}>
                                • 清楚說明你的題目與目的（3 分鐘）<br />
                                • 收集便利貼回饋<br />
                                • 如果聽眾沒給回饋，主動問他「你覺得哪裡不清楚？」
                            </div>
                        </div>
                        <div style={{ background: 'var(--paper)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--ink)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Palette size={14} className="text-[var(--accent)]" /> 聆聽者任務
                            </div>
                            <div style={{ fontSize: '12px', color: 'var(--ink-mid)', lineHeight: 1.7 }}>
                                • 認真聽，然後給予「具體」建議<br />
                                • 建議直接寫在海報上（正面或背面都可以）<br />
                                • 思考：這個研究真的做得出來嗎？
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px', background: 'var(--border)', border: '1px solid var(--border)', borderRadius: '8px', overflow: 'hidden', marginBottom: '24px' }}>
                <div style={{ background: 'white', padding: '18px 22px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--success)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <CheckCircle2 size={14} /> ✅ 具體且好的回饋範例
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <div style={{ fontSize: '12px', color: 'var(--ink-mid)', padding: '10px', background: 'var(--success-light)', borderRadius: '6px', border: '1px solid rgba(46,125,90,0.1)' }}>
                            <strong>範圍建議：</strong>「建議 Who 縮小到本校高一生，高中生範圍太大太難抽樣。」
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--ink-mid)', padding: '10px', background: 'var(--success-light)', borderRadius: '6px', border: '1px solid rgba(46,125,90,0.1)' }}>
                            <strong>方法建議：</strong>「用問卷可能查不出力口原因，要不要考慮訪談 2-3 個人？」
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--ink-mid)', padding: '10px', background: 'var(--success-light)', borderRadius: '6px', border: '1px solid rgba(46,125,90,0.1)' }}>
                            <strong>邏輯質疑：</strong>「為什麼 A 一定會導致 B？中間會不會有其他因素影響？」
                        </div>
                    </div>
                </div>
                <div style={{ background: 'white', padding: '18px 22px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--danger)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <ShieldAlert size={14} /> ❌ 需要避免的無效回饋
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <div style={{ fontSize: '12px', color: 'var(--ink-mid)', padding: '10px', background: 'var(--danger-light)', borderRadius: '6px', border: '1px solid rgba(192,57,43,0.1)' }}>
                            <strong>空泛稱讚：</strong>「感覺不錯」、「加油」、「還可以」、「讚」
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--ink-mid)', padding: '10px', background: 'var(--danger-light)', borderRadius: '6px', border: '1px solid rgba(192,57,43,0.1)' }}>
                            <strong>純粹攻擊：</strong>「你的題目爛透了」、「這沒人想看」、「不知道在寫什麼」
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--ink-mid)', padding: '10px', background: 'var(--danger-light)', borderRadius: '6px', border: '1px solid rgba(192,57,43,0.1)' }}>
                            <strong>模糊不清：</strong>「題目怪怪的」、「這可以做嗎？」(沒說哪裡怪、為什麼不能做)
                        </div>
                    </div>
                </div>
            </div>

            <div className="w4-sticky-grid">
                {[
                    { i: '✅', t: '我接受，我要改', s: '同學說得有道理，我的題目需要調整。把建議內容記下來，照著修改。' },
                    { i: '🚫', t: '我不接受，我有理由', s: '我考慮過了，但有充分的理由維持原設計。有判斷力地拒絕，比什麼都接受更重要。' },
                    { i: '🤔', t: '我不確定', s: '需要再想一想，或者問老師。先記下來，課間繼續討論。' }
                ].map(col => (
                    <div className="w4-sticky-col" key={col.t}><div className="w4-sticky-col-hd"><span>{col.i}</span> {col.t}</div><div className="w4-sticky-col-sub">{col.s}</div></div>
                ))}
            </div>

            {/* STEP 3: Literature Search */}
            <div className="w4-section-head">
                <h2>階段 3：文獻外援檢索</h2><div className="line"></div><div className="mono">SECOND PERIOD</div>
            </div>

            <div className="w4-practice-block">
                <div className="w4-practice-header" style={{ background: 'var(--accent)', color: '#fff' }}>
                    <Search size={16} className="text-[var(--gold)]" />
                    <span className="w4-practice-title" style={{ color: '#fff' }}>查找學術文獻：華藝與 Google Scholar</span>
                    <span className="w4-practice-sub" style={{ opacity: 0.6 }}>先從「摘要」看起</span>
                </div>
                <div className="w4-practice-body">
                    今天定案之後，你要找一篇跟你最相關的論文。不一定要讀完全部，先讀<strong>「摘要 (Abstract)」</strong>，確認這是不是你要的東西。

                    <div className="w4-search-grid">
                        <a href="https://scholar.google.com.tw/" target="_blank" rel="noreferrer" className="w4-search-card" style={{ textDecoration: 'none' }}>
                            <div className="w4-search-icon"><Search size={22} /></div>
                            <div>
                                <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--ink)', marginBottom: '4px' }}>Google Scholar</div>
                                <div style={{ fontSize: '11px', color: 'var(--ink-mid)', lineHeight: 1.5 }}>全球最大的學術搜尋引擎。輸入你的定案題目關鍵字，找相似研究。</div>
                            </div>
                        </a>
                        <a href="https://www.airitilibrary.com/" target="_blank" rel="noreferrer" className="w4-search-card" style={{ textDecoration: 'none' }}>
                            <div className="w4-search-icon"><BookOpen size={22} /></div>
                            <div>
                                <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--ink)', marginBottom: '4px' }}>華藝線上圖書館 (iRead)</div>
                                <div style={{ fontSize: '11px', color: 'var(--ink-mid)', lineHeight: 1.5 }}>收錄台灣最多的學位論文。在這裡找「碩博士論文」的摘要最有參考價值。</div>
                            </div>
                        </a>
                    </div>

                    <div className="w4-notice w4-notice-gold" style={{ marginTop: '20px' }}>
                        <div style={{ fontWeight: 700, marginBottom: '6px' }}>💡 為什麼要查？</div>
                        <div style={{ lineHeight: 1.7 }}>
                            1. <strong>看看別人怎麼設定對照組</strong>：你的研究對象會不會太窄？<br />
                            2. <strong>看看別人用什麼方法</strong>：問卷怎麼設計？訪談問什麼？<br />
                            3. <strong>看看別人的預期發現</strong>：跟你的猜測一樣嗎？
                        </div>
                    </div>
                </div>
            </div>

            <div className="w4-method-grid">
                {[
                    { i: '📋', n: '問卷研究', e: 'SURVEY' },
                    { i: '🎤', n: '訪談研究', e: 'INTERVIEW' },
                    { i: '🧪', n: '實驗研究', e: 'EXPERIMENT' },
                    { i: '👀', n: '觀察研究', e: 'OBSERVATION' },
                    { i: '📚', n: '文獻分析', e: 'LITERATURE' }
                ].map(m => (
                    <div className={`w4-method-card ${selectedMethod === m.n ? 'active' : ''}`} key={m.n} onClick={() => setSelectedMethod(m.n)}><div className="icon">{m.i}</div><div className="name">{m.n}</div><div className="en">{m.e}</div></div>
                ))}
            </div>
            <div className="w4-notice w4-notice-accent" style={{ marginBottom: '32px' }}>💡 你選哪個方法，決定你下週 W5 去哪一組。</div>

            <div className="w4-section-head"><h2>練什麼</h2><div className="line"></div><div className="mono">PRACTICE</div></div>
            <p className="w4-section-desc">實戰演練進階關鍵字搜尋技巧，學會評估 AI 建議的關鍵字，讓搜查範圍既廣且深。</p>
            <div className="w4-notice w4-notice-gold" style={{ marginBottom: '10px' }}>⚠️ 先自己寫標題草稿和預期發現，再把草稿交給 AI 優化。</div>
            <div className="w4-prompt-box">
                <div className="w4-prompt-hd"><span>PROMPT · 海報文案優化</span><button className="w4-copy-btn" onClick={() => handleCopy('p1', posterPrompt)}>{copyStatus['p1'] ? '已複製！' : '複製'}</button></div>
                <div className="w4-prompt-body">我的研究海報需要以下元素：<br />- 研究題目：【貼上 W3 定案題目】<br />- 吸引人的標題草稿：【貼上你的草稿】<br />- 預期發現草稿：【貼上你的預測】<br /><br />請幫我：<br />1. 優化標題，讓它更吸引高中生，保持白話但加一點懸疑感<br />2. 把預期發現改寫得更有研究感（加入「可能」「推測」等詞）<br />3. 給我 2 個版本讓我選</div>
            </div>

            <div className="w4-prompt-box">
                <div className="w4-prompt-hd"><span>PROMPT · 關鍵字擴充</span><button className="w4-copy-btn" onClick={() => handleCopy('p2', keywordPrompt)}>{copyStatus['p2'] ? '已複製！' : '複製'}</button></div>
                <div className="w4-prompt-body">我的研究題目是：【貼上你的定案題目】<br /><br />請幫我：<br />1. 列出 5 個相關的繁體中文學術關鍵字<br />2. 列出 5 個對應的英文學術關鍵字<br />3. 告訴我這個研究方向在學術界通常叫什麼名稱</div>
            </div>

            <div className="w4-apa-row"><div className="w4-apa-label">THESIS FORMAT</div><div className="w4-apa-val">作者（年份）。論文題目（碩士論文）。學校名稱。</div></div>

            <div className="w4-section-head"><h2>課堂任務</h2><div className="line"></div><div className="mono">IN-CLASS</div></div>
            <p className="w4-section-desc">參與 Gallery Walk 個人題目博覽會，收集同學的建議，並完成你的 W4 研究海報。</p>
            <div className="w4-task-block">
                <div className="w4-task-hd"><span className="w4-task-badge">TASK 1</span><span className="w4-task-title">製作手寫海報 (20 MINS)</span></div>
                <div className="w4-task-body"><ol className="w4-task-ol"><li>抄下 W3 定案題目</li><li>寫標題草稿 + 預期發現</li><li>用 AI 優化文案</li><li>在 A4 紙上手寫海報</li></ol><div className="w4-notice w4-notice-gold">💡 標題是給同學看的，題目是給評審看的。</div></div>
            </div>
            <div className="w4-task-block">
                <div className="w4-task-hd"><span className="w4-task-badge">TASK 2</span><span className="w4-task-title">Gallery Walk 順轉走讀 (30 MINS)</span></div>
                <div className="w4-task-body"><ol className="w4-task-ol"><li>海報貼桌上，四人一組（ABCD 座位）</li><li>每場 5 分鐘，聽鈴聲移動位置</li><li>給予至少 3 個具體建議（✅ 好的回饋）</li></ol></div>
            </div>
            <div className="w4-task-block">
                <div className="w4-task-hd"><span className="w4-task-badge">TASK 3</span><span className="w4-task-title">文獻檢索與最終定案 (30 MINS)</span></div>
                <div className="w4-task-body"><ol className="w4-task-ol"><li>整理便利貼，做決策分析</li><li>寫下 W4 最終定案題目</li><li>到 Scholar 或華藝找一篇論文摘要</li></ol><div className="w4-notice w4-notice-success">🏆 今天結束你手上有三個成果：W4 最終定案題目 + 論文摘要筆記 + 第一份 APA。</div></div>
            </div>

            <div className="w4-section-head"><h2>本週總結</h2><div className="line"></div><div className="mono">WRAP-UP</div></div>
            <div style={{ border: '1px solid var(--border)', borderRadius: '10px', overflow: 'hidden', marginBottom: '16px' }}>
                <div style={{ padding: '14px 20px', background: 'var(--paper-warm)', borderBottom: '1px solid var(--border)', fontSize: '14px', fontWeight: 700 }}>✅ 本週結束，你應該要會</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px', background: 'var(--border)' }}>
                    <div style={{ background: '#fff', padding: '14px 20px', fontSize: '13px' }}>✓ 2 分鐘內說清楚你的研究</div>
                    <div style={{ background: '#fff', padding: '14px 20px', fontSize: '13px' }}>✓ 有判斷地接受或拒絕建議</div>
                    <div style={{ background: '#fff', padding: '14px 20px', fontSize: '13px' }}>✓ 找到一篇相關論文並試寫 APA</div>
                    <div style={{ background: '#fff', padding: '14px 20px', fontSize: '13px' }}>✓ 確認 W4 最終定案題目</div>
                </div>
            </div>

            <div style={{ border: '1px solid var(--border)', borderRadius: '10px', overflow: 'hidden', marginBottom: '16px' }}>
                <div style={{ padding: '14px 20px', background: 'var(--paper-warm)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontFamily: 'DM Mono', fontSize: '10px', background: 'var(--ink)', color: '#fff', padding: '2px 8px', borderRadius: '3px' }}>HOMEWORK</span><span style={{ fontSize: '14px', fontWeight: 700 }}>本週作業</span><span style={{ marginLeft: 'auto', fontSize: '11px', color: 'var(--danger)', fontWeight: 'bold' }}>截止：今晚 11 點</span>
                </div>
                <div className="w4-hw-list">
                    {[
                        { p: '📷 照片', n: '海報拍照（便利貼貼在上面一起拍）' },
                        { p: '文字 1', n: '你的 W4 最終定案題目' },
                        { p: '文字 2', n: '你接受了哪一條同學建議、改了什麼' },
                        { p: '文字 3', n: '今天找到的那篇論文書目（試寫 APA）' }
                    ].map(hw => (
                        <div className="w4-hw-item" key={hw.p}><span className="w4-hw-part">{hw.p}</span><span className="w4-hw-name">{hw.n}</span></div>
                    ))}
                </div>
                <div style={{ padding: '12px 20px', background: 'var(--paper)', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}><span style={{ fontSize: '12px', color: 'var(--ink-light)' }}>Google Classroom 繳交照片＋三行文字</span><a href="https://classroom.google.com/" target="_blank" rel="noopener noreferrer" style={{ fontSize: '12px', color: 'var(--accent)', textDecoration: 'none' }}>→ Google Classroom</a></div>
            </div>

            <div className="w4-next-week-preview">
                <div className="w4-next-week-header">
                    <span className="w4-next-week-badge">NEXT WEEK</span>
                    <h3 className="w4-next-week-title">W5 預告</h3>
                </div>
                <div className="w4-next-week-content">
                    <div className="w4-next-week-col">
                        <div className="w4-next-week-label">W5 主題</div>
                        <p className="w4-next-week-text">五路分流——依照你的研究方法分組，深入學習設計技術。</p>
                    </div>
                    <div className="w4-next-week-col">
                        <div className="w4-next-week-label">你要確認</div>
                        <p className="w4-next-week-text">你的<strong className="text-white">研究方法（How）</strong>已經決定。</p>
                    </div>
                </div>
            </div>
            {/* NAVIGATION */}
            <div className="flex justify-between items-center py-12 border-t border-[#dddbd5]">
                <Link to="/w3" className="text-[13px] font-bold text-[#8888aa] hover:text-[#1a1a2e] flex items-center gap-2 transition-colors">
                    ← 回 W3 題目健檢
                </Link>
                <Link to="/w5" className="bg-[#1a1a2e] text-white px-8 py-3 rounded-[6px] text-[13px] font-bold hover:bg-[#2a2a4a] transition-all flex items-center gap-2 group">
                    前往 W5 文獻偵探社 <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>
        </div>
    );
};
