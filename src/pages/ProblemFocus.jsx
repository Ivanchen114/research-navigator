import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Map } from 'lucide-react';
import LessonMap from '../components/ui/LessonMap';
import { W2Data } from '../data/lessonMaps';

export const ProblemFocus = () => {
    const [showLessonMap, setShowLessonMap] = useState(false);
    const [copyStatus, setCopyStatus] = useState({});

    const handleCopy = (id, text) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopyStatus(prev => ({ ...prev, [id]: true }));
            setTimeout(() => setCopyStatus(prev => ({ ...prev, [id]: false })), 1500);
        });
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 font-sans text-[14px] leading-[1.6] text-[#1a1a2e]">
            {/* INLINE CSS FROM USER */}
            <style dangerouslySetInnerHTML={{
                __html: `
                :root {
                    --ink: #1a1a2e; --ink-mid: #4a4a6a; --ink-light: #8888aa;
                    --paper: #f8f7f4; --paper-warm: #f0ede6;
                    --accent: #2d5be3; --accent-light: #e8eeff;
                    --gold: #c9a84c; --gold-light: #fdf6e3;
                    --success: #2e7d5a; --success-light: #e8f5ee;
                    --danger: #c0392b; --danger-light: #fdecea;
                    --border: #dddbd5; --border-mid: #c8c5bc;
                }
                .w2-topbar { height: 52px; background: #fff; border-bottom: 1px solid var(--border); display: flex; align-items: center; padding: 0 48px; position: sticky; top: 0; z-index: 50; }
                .w2-topbar-path { font-size: 12px; color: var(--ink-light); font-family: 'DM Mono', monospace; display: flex; align-items: center; gap: 8px; }
                .w2-topbar-path span { color: var(--ink-mid); }
                .w2-topbar-right { margin-left: auto; display: flex; align-items: center; gap: 10px; }
                .w2-topbar-tag { font-size: 11px; padding: 4px 10px; border: 1px solid var(--border); border-radius: 4px; color: var(--ink-mid); font-family: 'DM Mono', monospace; }
                .w2-content { padding: 48px 60px; max-width: 940px; margin: 0 auto; }

                .w2-page-eyebrow { font-size: 11px; font-family: 'DM Mono', monospace; color: var(--accent); margin-bottom: 12px; letter-spacing: 0.06em; }
                .w2-page-title { font-family: 'Noto Serif TC', serif; font-size: 36px; font-weight: 700; line-height: 1.2; color: var(--ink); margin-bottom: 8px; letter-spacing: -0.02em; }
                .w2-page-title em { font-style: normal; color: var(--accent); }
                .w2-page-subtitle { font-size: 15px; color: var(--ink-mid); line-height: 1.75; margin-bottom: 32px; max-width: 620px; }
                .w2-meta-strip { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1px; background: var(--border); border: 1px solid var(--border); border-radius: 10px; overflow: hidden; margin-bottom: 48px; }
                .w2-meta-item { background: #fff; padding: 14px 18px; }
                .w2-meta-label { font-size: 10px; font-family: 'DM Mono', monospace; color: var(--ink-light); letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 4px; }
                .w2-meta-value { font-size: 13px; font-weight: 700; color: var(--ink); }

                .w2-section-head { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; margin-top: 48px; }
                .w2-section-head h2 { font-family: 'Noto Serif TC', serif; font-size: 18px; font-weight: 700; color: var(--ink); white-space: nowrap; }
                .w2-section-head .line { flex: 1; height: 1px; background: var(--border); }
                .w2-section-head .mono { font-family: 'DM Mono', monospace; font-size: 10px; color: var(--ink-light); letter-spacing: 0.08em; white-space: nowrap; }

                .w2-fw-table { width: 100%; border-collapse: collapse; border: 1px solid var(--border); border-radius: 10px; overflow: hidden; margin-bottom: 20px; }
                .w2-fw-table thead th { background: var(--ink); color: #fff; padding: 11px 16px; font-size: 11px; font-family: 'DM Mono', monospace; letter-spacing: 0.06em; text-align: left; border-right: 1px solid rgba(255,255,255,0.08); }
                .w2-fw-table tbody td { padding: 14px 16px; border: 1px solid var(--border); background: #fff; vertical-align: top; font-size: 13px; color: var(--ink-mid); line-height: 1.75; }
                .w2-fw-table tbody tr:hover td { background: var(--paper); }
                .w2-step-tag { font-family: 'DM Mono', monospace; font-size: 10px; color: var(--accent); display: block; margin-bottom: 3px; letter-spacing: 0.06em; }
                .w2-step-name { font-size: 14px; font-weight: 700; color: var(--ink); display: block; margin-bottom: 5px; }
                .w2-step-who { display: inline-block; font-size: 10px; font-family: 'DM Mono', monospace; padding: 2px 7px; border-radius: 3px; }
                .w2-step-who.human { background: var(--success-light); color: var(--success); }
                .w2-step-who.both  { background: var(--gold-light); color: var(--gold); }
                .w2-step-who.ai    { background: var(--accent-light); color: var(--accent); }

                .w2-abc-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px; background: var(--border); border: 1px solid var(--border); border-radius: 10px; overflow: hidden; margin-bottom: 10px; }
                .w2-abc-col { background: #fff; padding: 16px; }
                .w2-abc-letter { font-family: 'DM Mono', monospace; font-size: 26px; font-weight: 700; color: var(--accent); margin-bottom: 2px; }
                .w2-abc-type { font-size: 14px; font-weight: 700; color: var(--ink); margin-bottom: 3px; }
                .w2-abc-pattern { font-family: 'DM Mono', monospace; font-size: 11px; color: var(--ink-light); margin-bottom: 10px; }
                .w2-abc-method { font-size: 11px; color: var(--ink-mid); padding: 7px 10px; background: var(--paper-warm); border-radius: 5px; margin-bottom: 8px; }
                .w2-abc-example { font-size: 12px; color: var(--ink-mid); line-height: 1.65; border-top: 1px solid var(--border); padding-top: 10px; }

                .w2-practice-block { border: 1px solid var(--border); border-radius: 10px; overflow: hidden; background: #fff; margin-bottom: 12px; }
                .w2-practice-header { padding: 12px 18px; background: var(--paper-warm); border-bottom: 1px solid var(--border); display: flex; align-items: center; gap: 10px; }
                .w2-practice-badge { font-family: 'DM Mono', monospace; font-size: 10px; padding: 2px 8px; border-radius: 3px; letter-spacing: 0.05em; }
                .w2-pb-human { background: var(--success); color: #fff; }
                .w2-pb-ai    { background: var(--accent); color: #fff; }
                .w2-pb-star  { background: var(--danger); color: #fff; }
                .w2-practice-title { font-size: 14px; font-weight: 700; color: var(--ink); }
                .w2-practice-sub { font-size: 12px; color: var(--ink-light); margin-left: auto; }
                .w2-practice-body { padding: 16px 20px; font-size: 13px; color: var(--ink-mid); line-height: 1.85; }

                .w2-prompt-box { border: 1px solid var(--border-mid); border-radius: 8px; overflow: hidden; margin: 12px 0; }
                .w2-prompt-hd { padding: 8px 14px; background: var(--ink); display: flex; align-items: center; gap: 8px; }
                .w2-prompt-hd span { font-family: 'DM Mono', monospace; font-size: 10px; color: rgba(255,255,255,0.5); letter-spacing: 0.08em; }
                .w2-copy-btn { margin-left: auto; font-family: 'DM Mono', monospace; font-size: 10px; color: rgba(255,255,255,0.5); background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); padding: 2px 8px; border-radius: 3px; cursor: pointer; transition: all 0.15s; }
                .w2-copy-btn:hover { background: rgba(255,255,255,0.15); color: #fff; }
                .w2-prompt-body { padding: 14px 16px; background: #fafaf8; font-size: 12px; color: var(--ink-mid); line-height: 1.85; font-family: 'DM Mono', monospace; white-space: pre-wrap; }

                .w2-notice { border-left: 4px solid var(--accent); padding: 12px 16px; background: var(--accent-light); font-size: 13px; color: var(--ink-mid); line-height: 1.7; border-radius: 0 6px 6px 0; margin-bottom: 12px; }
                .w2-notice.warn  { border-left-color: var(--gold);    background: var(--gold-light); }
                .w2-notice.ok    { border-left-color: var(--success); background: var(--success-light); }
                .w2-notice.block { border-left-color: var(--danger);  background: var(--danger-light); }

                .w2-aired-table { display: flex; flex-direction: column; gap: 1px; background: var(--border); border: 1px solid var(--border); border-radius: 8px; overflow: hidden; margin-top: 14px; }
                .w2-aired-row-item { display: grid; grid-template-columns: 130px 1fr; gap: 1px; background: var(--border); }
                .w2-aired-key { background: var(--paper-warm); padding: 11px 14px; display: flex; align-items: flex-start; gap: 8px; }
                .w2-aired-letter { font-family: 'DM Mono', monospace; font-size: 14px; font-weight: 700; color: var(--accent); }
                .w2-aired-word { font-size: 11px; color: var(--ink-mid); line-height: 1.4; }
                .w2-aired-val { background: #fff; padding: 11px 14px; font-size: 12px; color: var(--ink-mid); line-height: 1.7; }
                @media (max-width: 768px) {
                    .w2-content { padding: 24px 20px; }
                    .w2-topbar { padding: 0 20px; }
                    .w2-meta-strip { grid-template-columns: 1fr 1fr; }
                    .w2-abc-row { grid-template-columns: 1fr; }
                    .w2-fw-table thead { display: none; }
                    .w2-fw-table tbody td { display: block; border: none; border-bottom: 1px solid var(--border); }
                }
            ` }} />

            {/* TOPBAR */}
            <div className="w2-topbar">
                <div className="w2-topbar-path">
                    研究方法與專題 / <span>問題意識</span> / <span>問題意識的覺醒 W2</span>
                </div>
                <div className="w2-topbar-right">
                    <button
                        onClick={() => setShowLessonMap(!showLessonMap)}
                        className="text-[11px] text-[#8888aa] hover:text-[#2d5be3] transition-colors flex items-center gap-1 font-['DM_Mono',monospace] mr-2"
                    >
                        <Map size={12} /> {showLessonMap ? 'Hide Plan' : 'Instructor View'}
                    </button>
                    <span className="w2-topbar-tag">可投影</span>
                    <span className="w2-topbar-tag">100 分鐘</span>
                </div>
            </div>

            {showLessonMap && (
                <div className="animate-in slide-in-from-top-4 duration-300 max-w-5xl mx-auto px-6 lg:px-12 mt-8">
                    <LessonMap data={W2Data} />
                </div>
            )}

            {/* MAIN CONTENT */}
            <div className="w2-content">
                <div className="w2-page-eyebrow">🔬 W2 · 品味訓練</div>
                <h1 className="w2-page-title">問題意識的覺醒：<em>把好奇心變成好問題</em></h1>
                <p className="w2-page-subtitle">「為什麼」是爛問題——太大、太空、太發散。今天你要學四段式思考框架。第一節靠自己，第二節用 AI 協助翻譯。</p>

                <div className="w2-meta-strip">
                    <div className="w2-meta-item"><div className="w2-meta-label">本週核心</div><div className="w2-meta-value">練「品味」</div></div>
                    <div className="w2-meta-item"><div className="w2-meta-label">課堂產出</div><div className="w2-meta-value">探究意圖（初稿）</div></div>
                    <div className="w2-meta-item"><div className="w2-meta-label">本週作業</div><div className="w2-meta-value">學習單（下週一）</div></div>
                    <div className="w2-meta-item"><div className="w2-meta-label">帶去 W3</div><div className="w2-meta-value">最終探究意圖</div></div>
                </div>

                {/* ══ 學什麼 ══ */}
                <div className="w2-section-head">
                    <h2>學什麼</h2><div className="line"></div><div className="mono">CONCEPT</div>
                </div>

                <div className="w2-practice-block">
                    <div className="w2-practice-header" style={{ background: 'var(--danger)', color: '#fff' }}>
                        <span className="font-bold text-[12px]">⚠️ 先打破這個習慣</span>
                    </div>
                    <div className="w2-practice-body">
                        「<strong style={{ color: 'var(--danger)' }}>為什麼圖書館人很多？</strong>」— 爛問題。<br />
                        → 因為要讀書！→ 因為有冷氣！→ 因為要考試！都對，但你要研究什麼？不知道。問了等於沒問。<br /><br />
                        爛問題的特徵：太大、太空、太發散。今天你要學怎麼改掉它。
                    </div>
                </div>

                <div style={{ fontFamily: '"DM Mono", monospace', fontSize: '10px', color: 'var(--ink-light)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '10px' }}>四段式思考框架 · 圖書館示範案例</div>
                <table className="w2-fw-table">
                    <thead>
                        <tr>
                            <th style={{ width: '170px' }}>步驟</th>
                            <th style={{ width: '200px' }}>怎麼想</th>
                            <th>範例（圖書館案例）</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[
                            { step: 'STEP 1', name: '覺察現象', who: 'human', whotxt: '⚠️ 只有人能做', how: '像攝影機一樣，具體描述你看到的畫面。不解釋，只描述。', ex: '段考前圖書館閱覽室爆滿，連地板都坐人；旁邊的借書區和書架區空無一人，連燈都沒開全。' },
                            { step: 'STEP 2', name: '發現落差', who: 'both', whotxt: '人主導，AI 可協助', how: '這裡有什麼矛盾？哪裡怪怪的？「應該是⋯但實際上⋯」', ex: '圖書館的核心存在應該是「借閱書籍」，但段考期間它變成了只有桌椅功能、沒有閱讀功能的大型K書房。大家湧向圖書館，卻完全不碰最珍貴的資源：書。' },
                            { step: 'STEP 3', name: '鎖定核心疑問', who: 'human', whotxt: '⚠️ 你的好奇心，白話說', how: '從矛盾裡，你最想搞清楚的那一件事是什麼？白話文，不管格式。', ex: '「既然只是要桌子，為什麼大家不去空教室或咖啡廳，非要擠在一個充滿自己不讀的書的地方？」' },
                            { step: 'STEP 4', name: '探究意圖', who: 'ai', whotxt: '第二節 · AI 協助翻譯', how: '把白話疑問套上學術研究句型。第二節課重點。', ex: '【A型】我想探究「考試壓力」如何影響學生對「圖書館空間使用」的選擇。' }
                        ].map((row, i) => (
                            <tr key={i}>
                                <td>
                                    <span className="w2-step-tag">{row.step}</span>
                                    <span className="w2-step-name">{row.name}</span>
                                    <span className={`w2-step-who ${row.who}`}>{row.whotxt}</span>
                                </td>
                                <td>{row.how}</td>
                                <td>{row.ex}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div style={{ fontFamily: '"DM Mono", monospace', fontSize: '10px', color: 'var(--ink-light)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '10px', marginTop: '28px' }}>Step 4 的三種探究句型（ABC 型）</div>
                <div className="w2-abc-row">
                    {[
                        { l: 'A', t: '影響型', p: '「A 如何影響 B？」', m: '📋 問卷 / 🧪 實驗', e: '例：「考試壓力如何影響圖書館空間選擇？」' },
                        { l: 'B', t: '比較型', p: '「A 和 B 有什麼不同？」', m: '📋 問卷 / 📚 資料分析', e: '例：「考前 vs 考後，圖書館使用者行為有何不同？」' },
                        { l: 'C', t: '深究型', p: '「A 背後的原因是什麼？」', m: '🎤 訪談 / 👀 觀察', e: '例：「學生選圖書館K書而非空教室的心理原因是什麼？」' }
                    ].map(card => (
                        <div className="w2-abc-col" key={card.l}>
                            <div className="w2-abc-letter">{card.l}</div>
                            <div className="w2-abc-type">{card.t}</div>
                            <div className="w2-abc-pattern">{card.p}</div>
                            <div className="w2-abc-method">{card.m}</div>
                            <div className="w2-abc-example">{card.e}</div>
                        </div>
                    ))}
                </div>
                <div className="w2-notice">
                    💡 拿著你的核心疑問問自己：你最想知道的是「影響」、「差異」還是「原因」？這個判斷由你來做，不准問 AI！
                </div>

                {/* ══ 練什麼 ══ */}
                <div className="w2-section-head">
                    <h2>練什麼</h2><div className="line"></div><div className="mono">PRACTICE</div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                    <span style={{ fontFamily: '"DM Mono", monospace', fontSize: '10px', background: 'var(--success)', color: '#fff', padding: '3px 8px', borderRadius: '3px', letterSpacing: '0.06em' }}>第一節</span>
                    <span style={{ fontFamily: '"DM Mono", monospace', fontSize: '10px', color: 'var(--ink-light)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>人腦專區 · 禁止使用 AI</span>
                </div>

                <div className="w2-practice-block">
                    <div className="w2-practice-header">
                        <span className="w2-practice-badge w2-pb-human">人腦</span>
                        <span className="w2-practice-title">圖片轉化戰（Part 2 練習 1 & 2）</span>
                        <span className="w2-practice-sub">先練手感</span>
                    </div>
                    <div className="w2-practice-body">
                        老師投影兩張對比圖片，練習用前三步快速思考。節奏要快，不分享，Step 3 白話說就好。<br /><br />
                        對每張圖片分別完成：
                        <ol style={{ margin: '8px 0 0 20px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <li><strong>現象：</strong>像攝影機一樣描述（至少 30 字，不解釋，只描述）</li>
                            <li><strong>落差：</strong>哪裡矛盾？規則與現實的衝突在哪？（至少 30 字）</li>
                            <li><strong>核心疑問：</strong>你最想搞清楚的那件事，白話說出來</li>
                        </ol>
                        <div className="w2-notice block" style={{ marginTop: '12px' }}>❌ 禁止用「為什麼」開頭。Step 3 不需要學術格式，說白話就好。</div>
                    </div>
                </div>

                <div className="w2-practice-block" style={{ border: '2px solid var(--danger)' }}>
                    <div className="w2-practice-header" style={{ background: 'var(--danger-light)', borderColor: 'var(--danger)' }}>
                        <span className="w2-practice-badge w2-pb-star">最重要</span>
                        <span className="w2-practice-title">練習 0：改寫你的 W1 觀察</span>
                        <span className="w2-practice-sub">⭐ 後面所有步驟的起點</span>
                    </div>
                    <div className="w2-practice-body">
                        拿出 W1 學習單 Part 0 第 3 題你寫的那個生活現象，用四段式思考的<strong>前三步</strong>重新寫一遍。<br /><br />
                        <ol style={{ margin: '8px 0 0 20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <li><strong>現象（具體畫面）：</strong>像攝影機一樣，你看到了什麼？至少 30 字。</li>
                            <li><strong>落差（矛盾/奇怪之處）：</strong>哪裡跟你想的不一樣？規則與現實的衝突是什麼？</li>
                            <li><strong>核心疑問（白話文）：</strong>你最想搞清楚的那一件事，不管格式，白話說出來。</li>
                        </ol>
                        <div className="w2-notice warn" style={{ marginTop: '12px' }}>⏰ 給你 10 分鐘。這階段不准用 AI，先靠自己的觀察 and 感受。</div>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '32px 0 14px' }}>
                    <span style={{ fontFamily: '"DM Mono", monospace', fontSize: '10px', background: 'var(--accent)', color: '#fff', padding: '3px 8px', borderRadius: '3px', letterSpacing: '0.06em' }}>第二節</span>
                    <span style={{ fontFamily: '"DM Mono", monospace', fontSize: '10px', color: 'var(--ink-light)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>AI 協作 · Prompt 已準備好</span>
                </div>

                <div className="w2-practice-block">
                    <div className="w2-practice-header">
                        <span className="w2-practice-badge w2-pb-ai">AI 協作</span>
                        <span className="w2-practice-title">落差擴充器（Part 2.5）</span>
                        <span className="w2-practice-sub">AI 給選項，你做判斷</span>
                    </div>
                    <div className="w2-practice-body">
                        AI 沒去過你的學校，觀察只能靠人。但它可以從多角度幫你找矛盾，當你的第二雙眼睛。把練習 0 的現象貼進去：

                        <div className="w2-prompt-box">
                            <div className="w2-prompt-hd">
                                <span>PROMPT · 落差擴充器</span>
                                <button className="w2-copy-btn" onClick={() => handleCopy('p1', `我觀察到一個現象：[請貼上你的現象]\n\n請幫我從 5 個不同角度，找出這個現象中可能的「矛盾」或「奇怪之處」。\n（例如：時間對比、空間對比、行為對比、群體對比、邏輯矛盾）\n\n請給我 5 個不同的矛盾點，每個用一句話說明。`)}>
                                    {copyStatus['p1'] ? '已複製！' : '複製'}
                                </button>
                            </div>
                            <div className="w2-prompt-body" id="p1">
                                我觀察到一個現象：[請貼上你的現象]<br /><br />
                                請幫我從 5 個不同角度，找出這個現象中可能的「矛盾」或「奇怪之處」。<br />
                                （例如：時間對比、空間對比、行為對比、群體對比、邏輯矛盾）<br /><br />
                                請給我 5 個不同的矛盾點，每個用一句話說明。
                            </div>
                        </div>

                        <div style={{ fontSize: '13px', color: 'var(--ink-mid)', lineHeight: '1.8', marginTop: '10px' }}>
                            AI 給了 5 個選項之後，問自己：<br />
                            → 這個矛盾我<strong>真的觀察到了嗎</strong>？（AI 在猜，不代表真實）<br />
                            → 這個矛盾我<strong>有興趣深究嗎</strong>？<br />
                            如果 5 個都不對，就用你原本的落差——AI 只是放大鏡，你才是眼睛。
                        </div>
                    </div>
                </div>

                <div className="w2-practice-block">
                    <div className="w2-practice-header">
                        <span className="w2-practice-badge w2-pb-ai">AI 協作</span>
                        <span className="w2-practice-title">探究意圖生成器（Part 3）</span>
                        <span className="w2-practice-sub">完成 Step 4</span>
                    </div>
                    <div className="w2-practice-body">
                        <div className="w2-notice warn">
                            ★ <strong>先做 Step 0，不准用 AI！</strong>看著你練習 0 的核心疑問，自己判斷是 A / B / C 型，填在 Part 3 Step 0。再往下。
                        </div>

                        現象、落差、核心疑問都填好後，貼進下方 Prompt，請 AI 翻譯成三種方向，然後<strong>你選一個</strong>。

                        <div className="w2-prompt-box">
                            <div className="w2-prompt-hd">
                                <span>PROMPT · 探究意圖生成器</span>
                                <button className="w2-copy-btn" onClick={() => handleCopy('p2', `我觀察到：[你的現象]\n發現落差：[你最終決定的落差]\n我最想搞清楚的核心疑問是：[你的白話疑問]\n\n請幫我把這個白話疑問，轉化為 3 種不同專業研究方向的「探究意圖」：\n\nA. 影響型（某因素如何影響某結果）\nB. 比較型（兩種對象/情境的差異）\nC. 深究型（某現象的運作機制/背後原因）\n\n每個方向請用一句話說明，並標註適合的研究方法。`)}>
                                    {copyStatus['p2'] ? '已複製！' : '複製'}
                                </button>
                            </div>
                            <div className="w2-prompt-body" id="p2">
                                我觀察到：[你的現象]<br />
                                發現落差：[你最終決定的落差]<br />
                                我最想搞清楚的核心疑問是：[你的白話疑問]<br /><br />
                                請幫我把這個白話疑問，轉化為 3 種不同專業研究方向的「探究意圖」：<br /><br />
                                A. 影響型（某因素如何影響某結果）<br />
                                B. 比較型（兩種對象/情境的差異）<br />
                                C. 深究型（某現象的運作機制/背後原因）<br /><br />
                                每個方向請用一句話說明，並標註適合的研究方法。
                            </div>
                        </div>

                        {/* AI-RED Table */}
                        <div style={{ fontFamily: '"DM Mono", monospace', fontSize: '10px', color: 'var(--ink-light)', letterSpacing: '0.08em', textTransform: 'uppercase', margin: '16px 0 8px' }}>完成後填 AI-RED 記錄（Part 3 Step 5）</div>
                        <div className="w2-aired-table">
                            {[
                                { l: 'A', w: 'Ascribe\n歸屬說明', v: '用了哪個 AI 工具？做什麼用？（ChatGPT / Claude / Gemini…）' },
                                { l: 'I', w: 'Inquire\n提問紀錄', v: '把你用過的 Prompt（包括追問）都貼上來，不要只貼最後一次。' },
                                { l: 'R', w: 'Reference\n引用標註', v: 'AI 生成內容不需查來源，填「無（AI 生成）」即可。' },
                                { l: 'E', w: 'Evaluate\n評估判斷', v: 'AI 給的建議合理嗎？哪裡需要修正？你的判斷寫在這裡。' },
                                { l: 'D', w: 'Document\n歷程記錄', v: '保存對話名稱或連結。Gemini 可匯出成 Google 文件直接存雲端。' }
                            ].map(row => (
                                <div className="w2-aired-row-item" key={row.l}>
                                    <div className="w2-aired-key">
                                        <span className="w2-aired-letter">{row.l}</span>
                                        <div className="w2-aired-word" style={{ whiteSpace: 'pre-line' }}>{row.w}</div>
                                    </div>
                                    <div className="w2-aired-val">{row.v}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ══ 課堂任務 ══ */}
                <div className="w2-section-head">
                    <h2>課堂任務</h2><div className="line"></div><div className="mono">IN-CLASS</div>
                </div>

                <div className="w2-practice-block" style={{ marginBottom: '40px' }}>
                    <div className="w2-practice-header" style={{ fontWeight: 700 }}>今天下課前要完成三件事</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--border)' }}>
                        {[
                            { tag: '人腦', bg: 'var(--success-light)', c: 'var(--success)', t: '練習 1 & 2 + 練習 0 — 完成 Step 1–3', s: '第一節課，禁止使用 AI' },
                            { tag: 'AI協作', bg: 'var(--accent-light)', c: 'var(--accent)', t: 'Part 2.5 落差擴充器 — 選出最終落差並說明理由', s: '第二節課' },
                            { tag: 'AI協作', bg: 'var(--accent-light)', c: 'var(--accent)', t: 'Part 3 探究意圖生成器 — 選定方向，填 AI-RED', s: '⭐ 最重要。下週帶最終探究意圖去 W3', sc: 'var(--danger)' }
                        ].map((task, i) => (
                            <div key={i} style={{ background: '#fff', padding: '14px 20px', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                                <span style={{ fontFamily: '"DM Mono", monospace', fontSize: '11px', color: task.c, background: task.bg, padding: '2px 8px', borderRadius: '3px', flexShrink: 0, marginTop: '2px' }}>{task.tag}</span>
                                <div>
                                    <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--ink)', marginBottom: '2px' }}>{task.t}</div>
                                    <div style={{ fontSize: '12px', color: task.sc || 'var(--ink-light)' }}>{task.s}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div style={{ padding: '12px 20px', background: 'var(--paper-warm)', borderTop: '1px solid var(--border)', fontSize: '13px', color: 'var(--ink-mid)' }}>
                        📤 完成後上傳至 Google Classroom，截止：<strong>下週一 23:59</strong>
                    </div>
                </div>

                {/* ══ 本週總結 ══ */}
                <div className="w2-section-head">
                    <h2>本週總結</h2><div className="line"></div><div className="mono">WEEK WRAP-UP</div>
                </div>

                <div className="w2-practice-block">
                    <div className="w2-practice-header" style={{ fontWeight: 700 }}>✅ 本週結束，你應該要會</div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1px', background: 'var(--border)' }}>
                        {[
                            '說出「為什麼」是爛問題的原因，並用四段式框架改造它',
                            '區分 A / B / C 三種探究句型，知道各自對應什麼研究方法',
                            '用 AI 找落差、翻譯句型，但選擇是自己做的',
                            '寫出最終探究意圖（Part 3 Step 4），下週帶去 W3'
                        ].map((txt, i) => (
                            <div key={i} style={{ background: '#fff', padding: '14px 18px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                                <span style={{ color: 'var(--success)', flexShrink: 0, marginTop: '2px' }}>✓</span>
                                <span style={{ fontSize: '13px', color: 'var(--ink-mid)', lineHeight: '1.65' }}>{txt}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="w2-practice-block" style={{ marginBottom: '48px' }}>
                    <div className="w2-practice-header" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontFamily: '"DM Mono", monospace', fontSize: '10px', background: 'var(--ink)', color: '#fff', padding: '2px 7px', borderRadius: '3px' }}>HOMEWORK</span>
                        <span style={{ fontWeight: 700 }}>本週作業</span>
                        <span style={{ marginLeft: 'auto', fontFamily: '"DM Mono", monospace', fontSize: '11px', color: 'var(--ink-light)' }}>截止：下週一 23:59</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--border)' }}>
                        {[
                            { p: 'Part 2', t: '練習 1 & 2 + 練習 0（Step 1–3）' },
                            { p: 'Part 2.5', t: 'AI 協作 1：落差擴充器' },
                            { p: 'Part 3', t: 'AI 協作 2：探究意圖生成器（含 AI-RED Step 5）', star: true },
                            { p: 'Part Z', t: '自我檢核（5 項打勾）' }
                        ].map((hw, i) => (
                            <div key={i} style={{ background: '#fff', padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <span style={{ fontFamily: '"DM Mono", monospace', fontSize: '11px', color: 'var(--accent)', width: '70px', flexShrink: 0 }}>{hw.p}</span>
                                <span style={{ fontSize: '13px', color: 'var(--ink-mid)' }}>
                                    {hw.t}
                                    {hw.star && <span style={{ fontFamily: '"DM Mono", monospace', fontSize: '10px', background: 'var(--danger-light)', color: 'var(--danger)', border: '1px solid rgba(192,57,43,0.2)', padding: '1px 6px', borderRadius: '3px', marginLeft: '8px' }}>最重要</span>}
                                </span>
                            </div>
                        ))}
                    </div>
                    <div style={{ padding: '14px 20px', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '13px', color: 'var(--ink-mid)' }}>學習單在 Google Classroom 下載</span>
                        <a href="#" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontFamily: '"DM Mono", monospace', color: 'var(--accent)', background: 'var(--accent-light)', border: '1px solid rgba(45,91,227,0.2)', padding: '6px 14px', borderRadius: '5px', textDecoration: 'none' }}>→ Google Classroom</a>
                    </div>
                </div>

                <div style={{ border: '1px solid var(--border)', borderRadius: '10px', overflow: 'hidden', background: 'var(--ink)', marginBottom: '48px' }}>
                    <div style={{ padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontFamily: '"DM Mono", monospace', fontSize: '10px', background: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.7)', padding: '2px 7px', borderRadius: '3px', letterSpacing: '0.05em' }}>NEXT WEEK</span>
                        <span style={{ fontWeight: 700, fontSize: '14px', color: '#fff' }}>W3 預告</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1px', background: 'rgba(255,255,255,0.06)' }}>
                        <div style={{ background: 'var(--ink)', padding: '16px 20px' }}>
                            <div style={{ fontFamily: '"DM Mono", monospace', fontSize: '10px', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.08em', marginBottom: '6px' }}>W3 主題</div>
                            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.85)', lineHeight: '1.65' }}>題目健檢——診斷 8 種爛題目、5W1H 規格化、可行性快篩、AI 優化成專業版本。</div>
                        </div>
                        <div style={{ background: 'var(--ink)', padding: '16px 20px' }}>
                            <div style={{ fontFamily: '"DM Mono", monospace', fontSize: '10px', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.08em', marginBottom: '6px' }}>你要帶來</div>
                            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.85)', lineHeight: '1.65' }}><strong style={{ color: '#fff' }}>你的最終探究意圖</strong>（Part 3 Step 4）——那就是下週的「病人」，沒有帶就沒得健檢。</div>
                        </div>
                    </div>
                </div>

                {/* NAVIGATION */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '32px 0', borderTop: '1px solid var(--border)', marginBottom: '16px' }}>
                    <Link to="/w1" style={{ fontSize: '13px', fontWeight: 700, color: 'var(--ink-light)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        ← 回 W1 模仿遊戲
                    </Link>
                    <Link to="/w3" style={{ background: 'var(--ink)', color: '#fff', padding: '10px 24px', borderRadius: '6px', fontSize: '14px', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        前往 W3 題目健檢 →
                    </Link>
                </div>
            </div>
        </div>
    );
};
