import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import CourseArc from '../components/ui/CourseArc';
import { Map, ArrowRight, ShieldAlert } from 'lucide-react';
import LessonMap from '../components/ui/LessonMap';
import CopyButton from '../components/ui/CopyButton';
import { W3Data } from '../data/lessonMaps';
import './Wizard.css';

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
        <div className="page-container animate-in-fade-slide">
            {/* REMOVED: <style dangerouslySetInnerHTML /> - styles moved to index.css */}

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
                    <span className="bg-[#1a1a2e] text-white text-[10px] font-bold px-2 py-0.5 rounded-[2px] font-mono">AI-RED · D</span>
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
                <p className="text-[15px] text-[#4a4a6a] max-w-[600px] leading-[1.75] mb-10">
                    好的研究不是「想出來」的，是「磨出來」的。今天我們先感受「碰壁」的真實感，再學會用一個心法診斷並救活你的原石題目。
                </p>

                {/* GAME BANNER */}
                <div className="bg-[#1a1a2e] border-l-4 border-[#c0392b] p-6 rounded-r-lg mb-10 text-white shadow-xl">
                    <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                        <ShieldAlert className="text-[#c0392b]" size={20} />
                        即刻報到：行動代號靶心
                    </h3>
                    <p className="text-[#8888aa] text-sm mb-4">
                        幫助你在混亂的文獻海中找對方向，鍛鍊從「現象」提煉出「研究問題」的精確度。
                    </p>
                    <Link to="/game/question-er" className="inline-flex items-center gap-2 bg-[#c0392b] text-white px-4 py-2 rounded font-bold text-sm hover:bg-[#a02c21] transition-colors">
                        進入遊戲系統 <ArrowRight size={14} />
                    </Link>
                </div>

                {/* COURSE ARC */}
                <CourseArc items={W3Data.courseArc} />
            </header>

            {/* META STRIP */}
            <div className="meta-strip">
                {[
                    { label: '本週任務', value: '診斷8題 + AI協作 + 快篩定案' },
                    { label: '課堂產出', value: 'W3 最終定案題目' },
                    { label: '下週預告', value: '定案題目 + 海報資料' }
                ].map((item, idx) => (
                    <div key={idx} className="meta-item">
                        <div className="meta-label">{item.label}</div>
                        <div className="meta-value">{item.value}</div>
                    </div>
                ))}
            </div>
            


            {/* 本週簡報 */}
            <div className="flex justify-end mb-8 -mt-2">
                <a
                    href="https://www.canva.com/design/DAHBD3GXOss/Jk1LDcgqNxhfnOwGSZfRZw/view?utm_content=DAHBD3GXOss&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=ha0e9516172"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold tracking-wider text-[#8888aa] hover:text-[#1a1a2e] bg-[#f8f7f4] hover:bg-[#f0ede6] border border-[#dddbd5] hover:border-[#1a1a2e]/20 px-3 py-1.5 rounded-[5px] transition-all"
                >
                    📊 本週簡報 ↗
                </a>
            </div>

            {/* PHASE 0: OBSTACLE EXPERIENCE */}
            <div className="w3-section-head"><h2>碰壁體驗</h2><div className="line"></div><div className="mono">PHASE 0</div></div>
            <p className="w3-section-desc">在進入診斷之前，我們先透過兩組情境感受一下：為什麼有些題目看起來沒問題，實作起來卻會處處碰壁？</p>
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
            <p className="w3-section-desc">掌握 8 種常見的「題目病症」與解決心法，學習如何將抽象的點子轉化為具備可行性的研究題目。</p>
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
                    <div style={{ fontSize: '10px', fontFamily: 'DM Mono', color: 'var(--ink-light)', marginTop: '16px', marginBottom: '8px' }}>8 種病對應心法</div>
                    <div className="w3-mantra-map">
                        {[
                            { id: 'A', m: '空 → 實' },
                            { id: 'B', m: '遠 → 近（未來→現在）' },
                            { id: 'C', m: '大 → 小' },
                            { id: 'D', m: '難 → 易（主觀→客觀）' },
                            { id: 'E', m: '空 → 實（有無→程度）' },
                            { id: 'F', m: '遠 → 近（換找得到的）' },
                            { id: 'G', m: '難 → 易（形→可觀察）' },
                            { id: 'H', m: '大→小 + 難→易' }
                        ].map(item => (
                            <div className="w3-mantra-map-item" key={item.id}>
                                <strong>{item.id} 病對應</strong>
                                {item.m}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="w3-notice w3-notice-gold">
                💡 如果你的題目太大、太空、太遠、太難——回頭用萬用心法修！
            </div>
            <div className="w3-section-head"><h2>練什麼</h2><div className="line"></div><div className="mono">PRACTICE</div></div>
            <p className="w3-section-desc">
                請練習診斷學長的題目出了什麼問題？試著用心法救救看這些題目，並練習在不依賴 AI 的情況下先進行初步修正，最後才導入 AI 協作，將你的研究原石優化成專業版本。
            </p>
            <div className="w3-task-block">
                <div className="w3-task-hd"><span className="w3-task-badge">PART 1</span><span className="w3-task-title">🏥 急診室大作戰：8 個病人</span></div>
                <div className="w3-task-body">
                    <div className="w3-notice w3-notice-gold" style={{ marginBottom: '14px' }}>
                        先自己診斷，再小組討論。填入你認為的病名代號——要說出你的理由！
                    </div>
                    <div className="w3-patient-grid">
                        {[
                            { id: 'a1', n: '1', t: '吃早餐對學測成績的影響', a: 'H 變因失控病 — 影響學測成績的因素太多，無法只控制早餐這一個變因。' },
                            { id: 'a2', n: '2', t: '探究幸福的真諦', a: 'A 抽象哲學病 — 「幸福」太抽象，無法測量，研究無從下手。' },
                            { id: 'a3', n: '3', t: '訪談愛因斯坦對相對論的看法', a: 'F 觀落陰病 — 對象已過世 140 多年，接觸不到。' },
                            { id: 'a4', n: '4', t: '為什麼團隊合作比單打獨鬥更好？', a: 'D 主觀偏見病 — 預定「合作更好」，帶有強烈主觀立場。' },
                            { id: 'a5', n: '5', t: '高中生有沒有在使用手機？', a: 'E 是非廢話病 — 答案顯而易見，「有」，研究毫無意義。' },
                            { id: 'a6', n: '6', t: '全球暖化的成因與防治', a: 'C 百科全書病 — 範圍橫跨全球，資料網路查就有，不需要研究。' },
                            { id: 'a7', n: '7', t: '上帝真的存在嗎？', a: 'G 方法無效病 — 無法透過觀察、問卷、實驗任何方式驗證。' },
                            { id: 'a8', n: '8', t: '2028 年奧運誰會拿金牌？', a: 'B 算命占卜病 — 預測未來尚未發生的事，無從驗證。' }
                        ].map(p => (
                            <div className="w3-patient-card" key={p.id}>
                                <div className="w3-patient-hd"><span className="w3-patient-num">病人 #{p.n}</span>{!revealedAnswers[p.id] && <button className="w3-unlock-btn" onClick={() => handleUnlock(p.id)} title="隱藏解鎖按鈕">🔓</button>}</div>
                                <div className="w3-patient-body">{p.t}</div>
                                {revealedAnswers[p.id] && <div className="w3-patient-answer animate-in fade-in slide-in-from-top-2"><strong>{p.a.split(' ')[0]}</strong> {p.a.substring(p.a.indexOf(' '))}</div>}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {/* PART 2: HUMAN DRILL */}
            <div className="w3-task-block">
                <div className="w3-task-hd"><span className="w3-task-badge">PART 2</span><span className="w3-task-title">💪 人的診斷練習（不准用 AI！）</span></div>
                <div className="w3-task-body">
                    <div className="w3-notice w3-notice-success" style={{ marginBottom: '24px' }}>
                        先知道自己有多少斤兩，再駕馭 AI。第一節課不能開 AI，自己診斷、自己用心法改。
                    </div>

                    <div className="drill-section">
                        <div className="w3-drill-level-hd green">
                            <div className="w3-drill-dot green"></div>
                            <span className="w3-drill-level-title">🟢 綠卡 — 新手好救</span>
                        </div>
                        <div className="w3-drill-pills mb-6">
                            {['探究美的本質', '本校學生有沒有在用社群媒體？', '2030 年最熱門的工作', '全球暖化的成因與解決', '本校學生有沒有在段考前熬夜？', '本校學生有沒有在上課偷滑手機？', '為什麼我們班那麼吵？', '高中生為什麼很常遲到？', '高中福利社為什麼都很難吃？', '高中生是不是都會熬夜？'].map(p => (
                                <div className="w3-drill-pill" key={p}>{p}</div>
                            ))}
                        </div>
                    </div>

                    <div className="drill-section">
                        <div className="w3-drill-level-hd yellow">
                            <div className="w3-drill-dot yellow"></div>
                            <span className="w3-drill-level-title yellow">🟡 黃卡 — 進階疊加</span>
                        </div>
                        <div className="w3-drill-pills mb-6">
                            {['為什麼現代人越來越不快樂？', '人類存在的意義', '為什麼讀書比打電動更好？', '台灣的教育制度好不好？', '訪談賈伯斯的創新理念', '為什麼高中生上課都不專心？', '為什麼段考週壓力特別大？', '為什麼有些老師上課很無聊？', '為什麼班上同學不愛運動？', '為什麼社團活動常常辦不出成效？'].map(p => (
                                <div className="w3-drill-pill" key={p}>{p}</div>
                            ))}
                        </div>
                    </div>

                    <div className="drill-section">
                        <div className="w3-drill-level-hd red">
                            <div className="w3-drill-dot red"></div>
                            <span className="w3-drill-level-title red">🔴 紅卡 — 魔王挑戰</span>
                        </div>
                        <div className="w3-drill-pills mb-6">
                            {['早餐對人生成就的影響', '靈魂到底存不存在？', '手機使用對學業成績的影響', '滑手機會不會讓人變笨？', '補習到底有沒有用？', '高中生談戀愛會影響成績？', 'IG / 抖音讓高中生焦慮嗎？', '為什麼有些同學天生較會讀書？', '訪談現任總統對教改看法', '為什麼有些人天生較聰明？'].map(p => (
                                <div className="w3-drill-pill" key={p}>{p}</div>
                            ))}
                        </div>
                    </div>

                    <div className="w3-hint-strip">
                        <div className="w3-hint-strip-hd">🔎 萬用提示條 — 卡住就看這裡</div>
                        <div className="w3-hint-body">
                            {[
                                { f: '大 → 小', t: '範圍太廣 → 縮到本校/年級/某班' },
                                { f: '空 → 實', t: '太抽象 → 換成可測量指標' },
                                { f: '遠 → 近', t: '找不到人 → 換成找得到的人' },
                                { f: '難 → 易', t: '變因太多 → 改成短期指標/聚焦單一' }
                            ].map(h => (
                                <div className="w3-hint-item" key={h.f}>
                                    <div className="w3-hint-from">{h.f.split(' ')[0]}</div>
                                    <div className="w3-hint-text">{h.t}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="w3-task-block">
                <div className="w3-task-hd"><span className="w3-task-badge">PART 3</span><span className="w3-task-title">🤖 AI 協作工作坊（練手感）</span></div>
                <div className="w3-task-body">
                    <div className="w3-notice" style={{ marginBottom: '24px' }}>
                        選 1 題爛題目來練手。重點不是 AI 改得多好，而是<strong>你怎麼選、為什麼選</strong>。
                    </div>
                    <div className="w3-collab-steps">
                        {[
                            { n: '1', t: '你先診斷', d: '從 30 題中再選 1 題，先自己判斷是哪種病。', s: 'w3-step-human' },
                            { n: '2', t: '問 AI 診斷', d: '把題目貼給 AI，問它「這個研究題目有什麼問題？」', s: 'w3-step-ai' },
                            { n: '3', t: '比對差異', d: '你的診斷 vs AI 的診斷，一樣嗎？', s: 'w3-step-you' },
                            { n: '4', t: '問 AI 給 3 個改法', d: '讓 AI 給你 3 個不同的修改版本。', s: 'w3-step-ai' },
                            { n: '5', t: '你選一個', d: '選哪個理由必須是你的判斷。', s: 'w3-step-you', badge: 'AI 做不到' },
                            { n: 'RED', t: '記錄 AI-RED', d: '填寫完整的 AI-RED 五欄：Ascribe / Inquire / Reference / Evaluate / Document。', s: 'w3-collab-step-num step-red' }
                        ].map(step => (
                            <div className="w3-collab-step" key={step.n}>
                                <div className={step.s.includes('step-num') ? step.s : `w3-collab-step-num ${step.s}`}>{step.n}</div>
                                <div className="w3-collab-step-content">
                                    <div className="w3-collab-step-title">
                                        {step.t} {step.badge && <span className="w3-core-badge">{step.badge}</span>}
                                    </div>
                                    <div className="w3-collab-step-desc">{step.d}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* PART 4 & 5: YOUR OWN TOPIC */}
            <div className="w3-task-block">
                <div className="w3-task-hd"><span className="w3-task-badge" style={{ background: '#e67e22' }}>PART 4</span><span className="w3-task-title">🔪 5W1H 規格化（回到你自己的題目）</span></div>
                <div className="w3-task-body">
                    <div className="w3-notice w3-notice-gold" style={{ marginBottom: '24px' }}>
                        拿出 W2 你的「最終探究意圖」，用 5W1H 切開它。只要有一格寫不出來或做不到，就用心法立刻修改！
                    </div>
                    
                    <div className="w3-w5h1-grid mb-6">
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
                    
                    <div className="p-4 bg-[#fdecea] rounded-[6px] border border-[#c0392b]/20">
                        <strong className="text-[#c0392b] text-[13px] block mb-2">⚡ 殘酷的可行性快篩</strong>
                        <p className="text-[12px] text-[#4a4a6a]">檢查你選的方法做不做得到：發得完問卷嗎？約得到人訪談嗎？有設備做實驗嗎？只要一項不行，馬上退件重修。</p>
                    </div>
                </div>
            </div>

            <div className="w3-task-block">
                <div className="w3-task-hd"><span className="w3-task-badge" style={{ background: '#9b59b6' }}>PART 5</span><span className="w3-task-title">🤖 AI 最終協作（你的題目）</span></div>
                <div className="w3-task-body">
                    <div className="w3-notice" style={{ marginBottom: '24px' }}>
                        你的題目通過快篩了！現在請 AI 把這個粗糙的初稿，包裝成專業的學術標題。
                    </div>
                    
                    <div className="w3-collab-steps mb-8">
                        {[
                            { n: '1', t: '修改初稿', d: '寫出你 5W1H 修改後的題目。', s: 'w3-step-human' },
                            { n: '2', t: '問 AI 診斷', d: '讓 AI 幫你做最後掃描。', s: 'w3-step-ai' },
                            { n: '3', t: '確認心意', d: '聽聽看就好，還是你做主。', s: 'w3-step-you' },
                            { n: '4', t: '要 3 個建議', d: '請 AI 給三個方向的修改建議。', s: 'w3-step-ai' },
                            { n: '5', t: '你來選', d: '選出一個方向。', s: 'w3-step-you' },
                            { n: '6', t: '機器包裝', d: '使用下方【句型優化器】產生專業標題。', s: 'w3-step-ai' },
                            { n: '7', t: '定案！', d: '產出你最終的【W3 專題定案題目】。', s: 'w3-step-you step-green', badge: '學期起點' }
                        ].map(step => (
                            <div className="w3-collab-step" key={step.n}>
                                <div className={step.s.includes('step-num') ? step.s : `w3-collab-step-num ${step.s}`}>{step.n}</div>
                                <div className="w3-collab-step-content">
                                    <div className="w3-collab-step-title">
                                        {step.t} {step.badge && <span className="w3-core-badge" style={{ background: '#27ae60' }}>{step.badge}</span>}
                                    </div>
                                    <div className="w3-collab-step-desc">{step.d}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="prompt-box">
                        <div className="prompt-hd"><span>PROMPT · 句型優化器 (Step 6 用)</span><CopyButton text={`我的研究題目初稿是：【請貼上你的初稿】\n\n請幫我優化成更專業的版本：\n1. 加上學術量化或質性動作（如：探討、相關性、差異分析、影響）\n2. 讓 Who(研究對象) / What(研究變數) 描述更精確\n3. 確保高中生可以執行，字數不要過長\n請給我 3 個優化版本。`} label="複製" /></div>
                        <div className="prompt-body">我的研究題目初稿是：【請貼上你的初稿】<br /><br />請幫我優化成更專業的版本：<br />1. 加上學術量化或質性動作（如：探討、相關性、差異分析、影響）<br />2. 讓 Who(研究對象) / What(研究變數) 描述更精確<br />3. 確保高中生可以執行，字數不要過長<br /><br />請給我 3 個優化版本。</div>
                    </div>
                </div>
            </div>

            <div className="w3-section-head"><h2>本週總結</h2><div className="line"></div><div className="mono">WRAP-UP</div></div>

            <div className="bg-white border border-[#dddbd5] rounded-[10px] overflow-hidden mb-4">
                <div className="p-4 px-5 bg-[#f0ede6] border-b border-[#dddbd5] font-bold text-[13px]">
                    ✅ 本週結束，你應該要會
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-[1px] bg-[#dddbd5]">
                    {[
                        '看懂 8 種爛題型，能說出每種問題在哪裡',
                        '用 5W1H 框架把模糊題目規格化成專業版本',
                        '通過可行性快篩的全部關卡，確認題目能執行',
                        '產出一個有 AI-RED 記錄的最終定案題目'
                    ].map((item, i) => (
                        <div key={i} className="p-4 px-6 bg-white flex items-start gap-3">
                            <span className="text-[#2e7d5a] mt-0.5">✓</span>
                            <span className="text-[13px] text-[#4a4a6a]">{item}</span>
                        </div>
                    ))}
                </div>
            </div>

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
                        { p: 'Part 3', n: 'AI 協作工作坊（練手感）' },
                        { p: 'Part 4', n: '5W1H 規格化（回到你自己的題目）' },
                        { p: 'Part 5', n: 'AI 最終協作 + 產生定案', b: '最終定案' },
                        { p: 'AI-RED', n: '完整記錄 AI 使用歷程' },
                        { p: 'Part Z', n: '自我檢核（5 項全部打勾）' }
                    ].map(hw => (
                        <div className="w3-hw-item" key={hw.p}><span className="w3-hw-part">{hw.p}</span><span className="w3-hw-name">{hw.n}</span>{hw.b && <span className="w3-hw-badge">{hw.b}</span>}</div>
                    ))}
                </div>
                <div className="w3-hw-foot">
                    <span style={{ fontSize: '12px', color: 'var(--ink-light)' }}>學習單在 Google Classroom 下載</span>
                    <a href="https://classroom.google.com/" target="_blank" rel="noopener noreferrer" className="w3-gc-link">→ Google Classroom</a>
                </div>
            </div>

            <div className="next-week-preview">
                <div className="next-week-header">
                    <span className="next-week-badge">NEXT WEEK</span>
                    <h3 className="next-week-title">W4 預告</h3>
                </div>
                <div className="next-week-content">
                    <div className="next-week-col">
                        <div className="next-week-label">W4 主題</div>
                        <p className="next-week-text">Gallery Walk 題目博覽會——帶著你的定案題目公諸於世。</p>
                    </div>
                    <div className="next-week-col">
                        <div className="next-week-label">你要帶來</div>
                        <p className="next-week-text"><strong>海報</strong>：包含定案題目、Who、How、為什麼想研究。</p>
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
