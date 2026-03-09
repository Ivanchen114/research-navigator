import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, User, ArrowRight, CheckCircle2, Search, Map, Zap, Music, Camera, Mic, Info } from 'lucide-react';
import LessonMap from '../components/ui/LessonMap';
import { W7Data } from '../data/lessonMaps';

export const TeamFormation = () => {
    const [showLessonMap, setShowLessonMap] = useState(false);

    return (
        <div className="max-w-[1000px] mx-auto px-6 lg:px-12 py-12 animate-in fade-in slide-in-from-bottom-4 duration-500 font-sans text-[13px] leading-[1.6] text-[#1a1a2e] pb-32">
            <style dangerouslySetInnerHTML={{
                __html: `
                :root { --ink: #1a1a2e; --ink-mid: #4a4a6a; --ink-light: #8888aa; --paper: #f8f7f4; --paper-warm: #f0ede6; --accent: #2d5be3; --accent-light: #e8eeff; --gold: #c9a84c; --gold-light: #fdf6e3; --success: #2e7d5a; --success-light: #e8f5ee; --danger: #c0392b; --danger-light: #fdecea; --border: #dddbd5; --border-mid: #c8c5bc; }
                .w7-content { padding: 48px 0; max-width: 1000px; margin: 0 auto; }
                
                .w7-top-breadcrumb { display: flex; align-items: center; gap: 8px; font-size: 12px; margin-bottom: 24px; color: var(--accent); font-weight: 500; }
                .w7-breadcrumb-sep { color: var(--ink-light); margin: 0 4px; }

                .w7-page-title { font-family: 'Noto Serif TC', serif; font-size: 42px; font-weight: 700; line-height: 1.2; color: var(--ink); margin-bottom: 12px; letter-spacing: -0.01em; }
                .w7-page-title em { font-style: normal; color: var(--accent); }
                .w7-page-subtitle { font-size: 16px; color: var(--ink-mid); line-height: 1.75; margin-bottom: 40px; max-width: 680px; }

                .w7-meta-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 56px; }
                .w7-meta-card { background: #fff; border: 1px solid var(--border); border-radius: 12px; padding: 16px 20px; }
                .w7-meta-label { font-size: 11px; color: var(--ink-light); margin-bottom: 8px; font-weight: 500; }
                .w7-meta-value { font-size: 14px; font-weight: 700; color: var(--ink); line-height: 1.4; }

                .w7-section-divider { display: flex; align-items: center; gap: 16px; margin: 56px 0 24px; }
                .w7-section-title { font-family: 'Noto Serif TC', serif; font-size: 22px; font-weight: 700; color: var(--ink); white-space: nowrap; }
                .w7-section-line { flex: 1; height: 1px; background: var(--border); }
                .w7-section-tag { font-family: 'DM Mono', monospace; font-size: 11px; color: var(--ink-light); letter-spacing: 0.1em; text-transform: uppercase; }

                .w7-sub-label { font-size: 12px; color: var(--ink-light); margin-bottom: 16px; }

                .w7-timeline { display: grid; grid-template-columns: repeat(7, 1fr); border: 1px solid var(--border); border-radius: 12px; overflow: hidden; margin-bottom: 40px; }
                .w7-timeline-item { padding: 16px 12px; text-align: center; border-right: 1px solid var(--border); }
                .w7-timeline-item:last-child { border-right: none; }
                .w7-timeline-item.past { background: #f0f7f4; }
                .w7-timeline-item.now { background: #1a1a2e; }
                .w7-timeline-item.future { background: #f8f7f4; }
                .w7-time-wk { font-family: 'DM Mono', monospace; font-size: 11px; font-weight: 600; margin-bottom: 6px; }
                .past .w7-time-wk { color: #2e7d5a; }
                .now .w7-time-wk { color: rgba(255,255,255,0.4); }
                .future .w7-time-wk { color: var(--ink-light); }
                .w7-time-name { font-size: 13px; font-weight: 700; line-height: 1.4; }
                .past .w7-time-name { color: var(--ink); }
                .now .w7-time-name { color: var(--gold); }
                .future .w7-time-name { color: var(--ink-light); }

                .w7-decision-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 32px; }
                .w7-decision-card { background: #fff; border: 1px solid var(--border); border-radius: 12px; padding: 24px 28px; position: relative; }
                .w7-decision-hd { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
                .w7-decision-icon { font-size: 24px; }
                .w7-decision-title { font-size: 17px; font-weight: 700; color: var(--ink); }
                .w7-decision-meta { font-size: 12px; color: var(--ink-light); margin-left: auto; }
                .w7-decision-ul { list-style: none; padding: 0; }
                .w7-decision-li { font-size: 13px; color: var(--ink-mid); line-height: 2; display: flex; align-items: flex-start; gap: 8px; }
                .w7-decision-li::before { content: "•"; color: var(--ink-light); }

                .w7-solo-hub { background: #1a1a2e; border-radius: 12px; padding: 0; overflow: hidden; margin-bottom: 48px; }
                .w7-hub-hd { padding: 16px 24px; border-bottom: 1px solid rgba(255,255,255,0.1); display: flex; align-items: center; gap: 12px; }
                .w7-hub-badge { font-family: 'DM Mono', monospace; font-size: 11px; background: var(--gold); color: #1a1a2e; padding: 2px 8px; border-radius: 4px; font-weight: 700; }
                .w7-hub-title { font-size: 15px; font-weight: 700; color: #fff; }
                .w7-hub-body { display: grid; grid-template-columns: 1fr 1fr; }
                .w7-hub-col { padding: 24px 32px; border-right: 1px solid rgba(255,255,255,0.1); }
                .w7-hub-col:last-child { border-right: none; }
                .w7-hub-label { font-size: 11px; color: rgba(255,255,255,0.4); margin-bottom: 12px; font-family: 'DM Mono', monospace; text-transform: uppercase; }
                .w7-hub-text { font-size: 14px; color: rgba(255,255,255,0.7); line-height: 1.8; }
                .w7-hub-ul { list-style: none; padding: 0; }
                .w7-hub-li { font-size: 14px; color: rgba(255,255,255,0.7); line-height: 2; margin-bottom: 4px; }

                .w7-expo-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 24px; }
                .w7-expo-card { background: #fff; border: 1px solid var(--border); border-radius: 12px; padding: 20px; }
                .w7-expo-num { font-family: 'DM Mono', monospace; font-size: 24px; font-weight: 700; color: var(--accent); margin-bottom: 8px; display: block; border: 1px solid var(--accent-light); width: 40px; height: 40px; display: flex; items-center; justify-center; border-radius: 50%; padding-top: 2px;}
                .w7-expo-title { font-size: 15px; font-weight: 700; color: var(--ink); margin-bottom: 6px; display: block; }
                .w7-expo-desc { font-size: 13px; color: var(--ink-mid); line-height: 1.7; }

                .w7-music-bar { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 40px; }
                .w7-mbar { border-radius: 8px; padding: 16px 20px; display: flex; align-items: flex-start; gap: 12px; }
                .w7-mbar-hd { font-size: 13px; font-weight: 700; margin-bottom: 4px; }
                .w7-mbar-desc { font-size: 13px; color: var(--ink-mid); }

                .w7-pitch-row { background: #fff; border: 1px solid var(--border); border-radius: 12px; padding: 20px 24px; display: flex; align-items: flex-start; gap: 20px; margin-bottom: 12px; border-left: 4px solid var(--accent); }
                .w7-pitch-idx { width: 28px; height: 28px; border-radius: 50%; background: var(--accent-light); color: var(--accent); display: flex; align-items: center; justify-center; font-weight: 800; font-family: 'DM Mono', monospace; flex-shrink: 0; margin-top: 2px; }
                .w7-pitch-content { font-size: 14px; color: var(--ink-mid); line-height: 1.8; }
                .w7-pitch-content strong { color: var(--ink); font-weight: 700; }

                .w7-task-box { background: #fff; border: 1px solid var(--border); border-radius: 12px; overflow: hidden; margin-bottom: 24px; }
                .w7-task-header { background: #f0ede6; padding: 14px 24px; border-bottom: 1px solid var(--border); display: flex; align-items: center; gap: 12px; }
                .w7-task-badge { background: #1a1a2e; color: #fff; font-size: 11px; font-weight: 800; font-family: 'DM Mono', monospace; padding: 2px 10px; border-radius: 4px; }
                .w7-task-title { font-size: 15px; font-weight: 700; color: var(--ink); }
                .w7-task-content { padding: 24px 32px; }
                .w7-task-ul { list-style: none; padding: 0; margin: 0; }
                .w7-task-li { font-size: 14px; color: var(--ink-mid); line-height: 2.2; position: relative; padding-left: 20px; }
                .w7-task-li::before { content: "1."; position: absolute; left: 0; color: var(--accent); font-weight: 700; }
                .w7-task-li:nth-child(2)::before { content: "2."; }
                .w7-task-li:nth-child(3)::before { content: "3."; }
                .w7-task-li:nth-child(4)::before { content: "4."; }
                .w7-task-li:nth-child(5)::before { content: "5."; }
                .w7-task-li:nth-child(6)::before { content: "6."; }

                .w7-hw-card { border: 1px solid var(--border); border-radius: 12px; overflow: hidden; margin-bottom: 20px; background: #fff; }
                .w7-hw-hd { padding: 14px 24px; background: #f8f7f4; border-bottom: 1px solid var(--border); display: flex; align-items: center; gap: 12px; }
                .w7-hw-tag { font-size: 11px; font-weight: 800; padding: 2px 10px; border-radius: 4px; font-family: 'Noto Sans TC', sans-serif; }
                .w7-hw-name { font-size: 15px; font-weight: 700; }
                .w7-hw-row { display: grid; grid-template-columns: 100px 1fr; border-bottom: 1px solid var(--border); }
                .w7-hw-row:last-child { border-bottom: none; }
                .w7-hw-label { padding: 16px 24px; color: var(--accent); font-weight: 700; font-size: 13px; }
                .w7-hw-desc { padding: 16px 24px; color: var(--ink-mid); font-size: 14px; }

                @media (max-width: 768px) {
                    .w7-content { padding: 24px 20px; }
                    .w7-meta-grid, .w7-timeline, .w7-decision-grid, .w7-hub-body, .w7-expo-grid, .w7-music-bar, .w7-hw-row { grid-template-columns: 1fr; }
                    .w7-hw-row { border-bottom: 1px solid var(--border); }
                    .w7-hw-label { padding-bottom: 0; }
                    .w7-next-week-content { grid-template-columns: 1fr; }
                }

                /* Next Week Preview */
                .w7-next-week-preview { background: var(--ink); border-radius: 12px; overflow: hidden; margin: 48px 0; border: 1px solid var(--border); }
                .w7-next-week-header { padding: 16px 24px; border-bottom: 1px solid rgba(255,255,255,0.06); display: flex; align-items: center; gap: 10px; }
                .w7-next-week-badge { font-family: 'DM Mono', monospace; font-size: 10px; background: rgba(255,255,255,0.1); color: rgba(255,255,255,0.5); padding: 2px 8px; border-radius: 3px; }
                .w7-next-week-title { font-size: 14px; font-weight: 700; color: #fff; }
                .w7-next-week-content { display: grid; grid-template-columns: 1fr 1fr; gap: 1px; background: rgba(255,255,255,0.05); }
                .w7-next-week-col { background: var(--ink); padding: 20px 24px; }
                .w7-next-week-label { font-size: 10px; font-family: 'DM Mono', monospace; color: rgba(255,255,255,0.3); margin-bottom: 4px; }
                .w7-next-week-text { font-size: 13px; color: rgba(255,255,255,0.75); line-height: 1.75; }

                /* Instructor toggle styles */
                .w7-topbar { height: 52px; background: #fff; border-bottom: 1px solid var(--border); display: flex; align-items: center; padding: 0 48px; position: sticky; top: 0; z-index: 50; }
                .w7-top-right { margin-left: auto; display: flex; align-items: center; gap: 16px; }
            ` }} />

            {/* TOP BAR / NAVIGATION PATH */}
            <div className="flex items-center justify-between border-b border-[#dddbd5] pb-4 mb-16">
                <div className="text-[11px] font-mono text-[#8888aa] flex items-center gap-2">
                    研究方法與專題 / 研究規劃 / <span className="text-[#1a1a2e] font-bold">組隊決策週 W7</span>
                </div>
                <div className="flex items-center gap-4">
                    <span className="bg-[#f0ede6] text-[#1a1a2e] text-[10px] font-bold px-2 py-0.5 rounded-[2px] font-mono">100 MINS</span>
                    <button
                        onClick={() => setShowLessonMap(!showLessonMap)}
                        className="text-[11px] text-[#8888aa] hover:text-[#2d5be3] transition-colors flex items-center gap-1 font-mono"
                    >
                        <Map size={12} /> {showLessonMap ? 'Hide Plan' : 'Instructor View'}
                    </button>
                    <span className="bg-[#1a1a2e] text-white text-[10px] font-bold px-2 py-0.5 rounded-[2px] font-mono">轉折點</span>
                </div>
            </div>

            {showLessonMap && (
                <div className="w7-content pb-0">
                    <div className="animate-in slide-in-from-top-4 duration-300">
                        <LessonMap data={W7Data} />
                    </div>
                </div>
            )}

            <div className="w7-content">
                <div className="w7-top-breadcrumb">
                    <span>🤝 W7</span>
                    <span className="w7-breadcrumb-sep">·</span>
                    <span>研究規劃</span>
                    <span className="w7-breadcrumb-sep">→</span>
                    <span>資料蒐集</span>
                </div>

                <h1 className="w7-page-title">
                    組隊決策週：<span className="text-[#2d5be3]">從個人到團隊</span>
                </h1>
                <p className="w7-page-subtitle">
                    今天是課程的轉折點。你要決定：找隊友，還是獨自研究？不管哪條路，今天都會建立你在這門課的「研究網絡」。
                </p>

                <div className="w7-meta-grid">
                    {[
                        { label: '第一節', value: '線上測驗 + 研究博覽會' },
                        { label: '第二節', value: '確定組隊 + 題目決策 + 企劃書' },
                        { label: '課堂產出', value: '研究企劃書（小組版 or Solo 版）' },
                        { label: '帶去 W8', value: '確定題目 + 研究方法' }
                    ].map((item, idx) => (
                        <div key={idx} className="w7-meta-card">
                            <div className="w7-meta-label">{item.label}</div>
                            <div className="w7-meta-value">{item.value}</div>
                        </div>
                    ))}
                </div>

                <div className="w7-section-divider">
                    <h2 className="w7-section-title">學什麼</h2>
                    <div className="w7-section-line"></div>
                    <span className="w7-section-tag">CONCEPT</span>
                </div>

                <div className="w7-sub-label">課程弧線 · 你在哪裡</div>
                <div className="w7-timeline">
                    <div className="w7-timeline-item past">
                        <div className="w7-time-wk">W1-W4</div>
                        <div className="w7-time-name">問題意識<br />題目定案</div>
                    </div>
                    <div className="w7-timeline-item past">
                        <div className="w7-time-wk">W5</div>
                        <div className="w7-time-name">文獻<br />偵探社</div>
                    </div>
                    <div className="w7-timeline-item past">
                        <div className="w7-time-wk">W6</div>
                        <div className="w7-time-name">研究<br />診所</div>
                    </div>
                    <div className="w7-timeline-item now">
                        <div className="w7-time-wk" style={{ color: 'rgba(255,255,255,0.4)' }}>W7 ← 現在</div>
                        <div className="w7-time-name">組隊<br />決策週</div>
                    </div>
                    <div className="w7-timeline-item future">
                        <div className="w7-time-wk">W8-W10</div>
                        <div className="w7-time-name">方法深化<br />訓練</div>
                    </div>
                    <div className="w7-timeline-item future">
                        <div className="w7-time-wk">W11-W15</div>
                        <div className="w7-time-name">執行<br />研究</div>
                    </div>
                    <div className="w7-timeline-item future">
                        <div className="w7-time-wk">W16</div>
                        <div className="w7-time-name">Gallery<br />Walk</div>
                    </div>
                </div>

                <div className="w7-sub-label">今天的決定 · 兩條都是好路</div>
                <div className="w7-decision-grid">
                    <div className="w7-decision-card">
                        <div className="w7-decision-hd">
                            <span className="w7-decision-icon">👥</span>
                            <span className="w7-decision-title">小組研究</span>
                            <span className="w7-decision-meta">2-4 人</span>
                        </div>
                        <ul className="w7-decision-ul">
                            <li className="w7-decision-li">可以分工，題目可以更大</li>
                            <li className="w7-decision-li">互相支持，互相檢視</li>
                            <li className="w7-decision-li">需要協調溝通</li>
                            <li className="w7-decision-li">整合各人的 W5/W6 文獻</li>
                        </ul>
                    </div>
                    <div className="w7-decision-card" style={{ borderLeft: '4px solid var(--gold)' }}>
                        <div className="w7-decision-hd">
                            <span className="w7-decision-icon">🧑‍💻</span>
                            <span className="w7-decision-title">個人研究 (Solo)</span>
                            <span className="w7-decision-meta" style={{ background: 'var(--gold-light)', color: 'var(--gold)', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>Solo Zone</span>
                        </div>
                        <ul className="w7-decision-ul">
                            <li className="w7-decision-li">進度完全自己掌控</li>
                            <li className="w7-decision-li">題目聚焦，不需要協調</li>
                            <li className="w7-decision-li">培養獨立研究能力</li>
                            <li className="w7-decision-li">有 Solo Zone 夥伴 + 老師特別照顧</li>
                        </ul>
                    </div>
                </div>

                <div className="w7-solo-hub">
                    <div className="w7-hub-hd">
                        <span className="w7-hub-badge">SOLO ZONE</span>
                        <span className="w7-hub-title">獨立工作者共享空間</span>
                    </div>
                    <div className="w7-hub-body">
                        <div className="w7-hub-col">
                            <div className="w7-hub-label">SOLO ZONE 是什麼</div>
                            <div className="w7-hub-text">
                                就像咖啡廳的共享工作空間——你們題目不同，但可以互相看企劃書、給建議、共享資源、互相打氣。<br /><br />
                                選擇個人研究，不代表孤單。
                            </div>
                        </div>
                        <div className="w7-hub-col">
                            <div className="w7-hub-label">SOLO ZONE 有什麼</div>
                            <ul className="w7-hub-ul">
                                <li className="w7-hub-li">· 老師特別照顧個人研究者</li>
                                <li className="w7-hub-li">· Solo Zone 群組（老師會建立）</li>
                                <li className="w7-hub-li">· 每週 Solo Zone 互助討論</li>
                                <li className="w7-hub-li">· W8 前都可以調整（加入小組也行）</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="w7-sub-label">研究博覽會 · 三輪走讀規則</div>
                <div className="w7-expo-grid">
                    {[
                        { n: '1', t: '同類聚集', d: '依研究方法走到對應區域，跟用同樣方法的人交流——看看同一個方法可以研究多少不同題目。' },
                        { n: '2', t: '跨界交流', d: '換到不同方法的區域，比較你的方法和對方的方法各有什麼優缺點，學習不同的思考方式。' },
                        { n: '3', t: '自由交流', d: '自由走動：找隊友、建立研究網絡、或確認自己要 Solo。不一定要找朋友，要找題目相近或能力互補的人。' }
                    ].map((item, idx) => (
                        <div key={idx} className="w7-expo-card">
                            <span className="w7-expo-num">{item.n}</span>
                            <span className="w7-expo-title">{item.t}</span>
                            <p className="w7-expo-desc">{item.d}</p>
                        </div>
                    ))}
                </div>

                <div className="w7-music-bar">
                    <div className="w7-mbar" style={{ background: 'var(--success-light)', color: 'var(--success)' }}>
                        <div className="mt-1"><Music size={16} /></div>
                        <div>
                            <div className="w7-mbar-hd">音樂播放 = 可以交流</div>
                            <div className="w7-mbar-desc">自由走動，互相拍照研究交流卡</div>
                        </div>
                    </div>
                    <div className="w7-mbar" style={{ background: 'var(--danger-light)', color: 'var(--danger)' }}>
                        <div className="mt-1"><Zap size={16} /></div>
                        <div>
                            <div className="w7-mbar-hd">音樂停止 = 立刻換人</div>
                            <div className="w7-mbar-desc">不能繼續跟同一個人聊，馬上移動</div>
                        </div>
                    </div>
                </div>

                <div className="w7-notice w7-notice-accent" style={{ marginBottom: '48px' }}>
                    📸 拍照存檔不只是找隊友——你在拍的是「全班研究網絡」。未來跨組請教、尋求協助，那些照片就是你的聯絡簿。
                </div>

                <div className="w7-sub-label" style={{ fontFamily: "'DM Mono', monospace", letterSpacing: '0.1em' }}>PITCH 自己的研究 · 30 秒結構</div>
                {[
                    { i: '1', t: <><strong>我在研究什麼：</strong>「嗨！我是 ＿＿，我想研究 ＿＿。」</> },
                    { i: '2', t: <><strong>王牌文獻撐腰：</strong>「我有一篇文獻是 ＿＿（作者、年份），發現 ＿＿，所以我覺得這個題目值得做。」</> },
                    { i: '3', t: <><strong>互相認識：</strong>「你在研究什麼？」→ 有興趣就拍照存檔。</> }
                ].map((row, idx) => (
                    <div key={idx} className="w7-pitch-row">
                        <div className="w7-pitch-idx">{row.i}</div>
                        <div className="w7-pitch-content">{row.t}</div>
                    </div>
                ))}

                <div className="w7-section-divider" style={{ marginTop: '72px' }}>
                    <h2 className="w7-section-title">課堂任務</h2>
                    <div className="w7-section-line"></div>
                    <span className="w7-section-tag">IN-CLASS</span>
                </div>

                <div className="w7-task-box">
                    <div className="w7-task-header">
                        <span className="w7-task-badge">TASK 1</span>
                        <span className="w7-task-title">線上測驗（第一節，25 分鐘）</span>
                    </div>
                    <div className="w7-task-content">
                        <ul className="w7-task-ul">
                            <li className="w7-task-li">登入酷AI學習系統，找到「W7 研究判斷力測驗」</li>
                            <li className="w7-task-li">個人測驗，不可討論，25 分鐘內完成送出</li>
                            <li className="w7-task-li">測驗涵蓋三個部分：問題意識（W1–W4）、文獻鑑識（W5）、研究診所（W6）</li>
                        </ul>
                        <div className="w7-notice w7-notice-danger">
                            ⚠️ 測驗期間老師不回答題目內容問題，操作有困難才舉手。
                        </div>
                    </div>
                </div>

                <div className="w7-task-box">
                    <div className="w7-task-header">
                        <span className="w7-task-badge">TASK 2</span>
                        <span className="w7-task-title">填寫研究交流卡 + 三輪博覽會（第一節後半）</span>
                    </div>
                    <div className="w7-task-content">
                        <ul className="w7-task-ul">
                            <li className="w7-task-li">領取研究交流卡（A5 橫式），填寫你的題目、<strong>王牌文獻（W5 成果）</strong>、研究方法、技能</li>
                            <li className="w7-task-li">填好後拿在胸前（像研討會掛牌）</li>
                            <li className="w7-task-li">第 1 輪：走到對應方法區域，跟同方法的人交流</li>
                            <li className="w7-task-li">第 2 輪：換到不同方法區域，比較方法優缺點</li>
                            <li className="w7-task-li">第 3 輪：自由走動，找隊友或建立研究網絡</li>
                            <li className="w7-task-li">每遇到有興趣的研究，就拍照存檔</li>
                        </ul>
                        <div className="w7-notice w7-notice-gold">
                            💡 王牌文獻填寫提示：寫 W5 找到的文獻，格式：「Chen (2023) 發現手機影響睡眠，所以我的題目有研究必要！」有文獻支持，Pitch 說服力大幅提升。
                        </div>
                    </div>
                </div>

                <div className="w7-task-box">
                    <div className="w7-task-header">
                        <span className="w7-task-badge">TASK 3</span>
                        <span className="w7-task-title">確定組隊 + 登記表單（第二節前半）</span>
                    </div>
                    <div className="w7-task-content">
                        <ul className="w7-task-ul">
                            <li className="w7-task-li">決定：小組研究（2–4 人）或個人研究（Solo）</li>
                            <li className="w7-task-li">小組：確認組員、建立群組、推選組長</li>
                            <li className="w7-task-li">Solo：移動到 Solo Zone，認識其他獨立工作者</li>
                            <li className="w7-task-li">掃描 QR Code 填寫「W7 組隊登記表」</li>
                        </ul>
                        <div className="w7-notice w7-notice-success">
                            ✅ W8 前都可以調整。Solo 的人之後想加入小組也沒關係，先填表登記再說。
                        </div>
                    </div>
                </div>

                <div className="w7-task-box">
                    <div className="w7-task-header">
                        <span className="w7-task-badge">TASK 4</span>
                        <span className="w7-task-title">Pitch 題目 + 確認最終題目（第二節中段）</span>
                    </div>
                    <div className="w7-task-content">
                        <ul className="w7-task-ul">
                            <li className="w7-task-li"><strong>小組：</strong>每人輪流 Pitch 自己的題目（2–3 分鐘），重點強調王牌文獻支持</li>
                            <li className="w7-task-li"><strong>小組：</strong>討論合併可能，共識決或投票決，確定小組題目</li>
                            <li className="w7-task-li"><strong>Solo：</strong>老師個別指導，確認題目縮小到個人可完成的規模（問卷建議 100–150 份，訪談建議 5–8 人）</li>
                            <li className="w7-task-li">掃描 QR Code 填寫「W7 題目登記表」</li>
                        </ul>
                        <div className="w7-notice w7-notice-accent">
                            💡 題目要考慮：你們有幾週執行（W11–W14 共 4 週）？做得完嗎？寧可小而精，不要大而空。
                        </div>
                    </div>
                </div>

                <div className="w7-task-box" style={{ marginBottom: '64px' }}>
                    <div className="w7-task-header">
                        <span className="w7-task-badge">TASK 5</span>
                        <span className="w7-task-title">填寫研究企劃書（第二節後半，18 分鐘）</span>
                    </div>
                    <div className="w7-task-content">
                        <ul className="w7-task-ul">
                            <li className="w7-task-li">領取企劃書：小組版（含分工表 + 組員簽名）或 Solo 版（含支援網絡 + 備案欄）</li>
                            <li className="w7-task-li">填寫題目、研究方法、分工（小組）或時程（Solo）</li>
                            <li className="w7-task-li">整合各人的 W5 文獻，至少 3 篇填入文獻支持欄</li>
                            <li className="w7-task-li">所有組員簽名（小組）或個人簽名（Solo）</li>
                            <li className="w7-task-li">企劃書拍照上傳 Google Classroom</li>
                        </ul>
                        <div className="w7-notice w7-notice-gold">
                            ⚠️ 企劃書不只是作業——W8–W15 老師會用這份追蹤你們的進度，請認真填。
                        </div>
                    </div>
                </div>

                <div className="w7-section-divider">
                    <h2 className="w7-section-title">本週總結</h2>
                    <div className="w7-section-line"></div>
                    <span className="w7-section-tag">WRAP-UP</span>
                </div>

                <div className="w7-hw-card">
                    <div className="w7-hw-hd">
                        <span className="w7-hw-tag" style={{ background: '#1a1a2e', color: '#fff' }}>全體</span>
                        <span className="w7-hw-name">個人作業</span>
                    </div>
                    <div className="w7-hw-row">
                        <div className="w7-hw-label">測驗檢視</div>
                        <div className="w7-hw-desc">登入酷AI系統查看測驗結果，訂正錯誤題目</div>
                    </div>
                    <div className="w7-hw-row">
                        <div className="w7-hw-label">網絡整理</div>
                        <div className="w7-hw-desc">整理研究博覽會拍的照片，分類：可能合作 / 可請教 / 有趣題目，上傳 Google Classroom</div>
                    </div>
                </div>

                <div className="w7-hw-card">
                    <div className="w7-hw-hd">
                        <span className="w7-hw-tag" style={{ background: 'var(--accent)', color: '#fff' }}>小組</span>
                        <span className="w7-hw-name">小組追加作業</span>
                    </div>
                    <div className="w7-hw-row">
                        <div className="w7-hw-label">建立群組</div>
                        <div className="w7-hw-desc">建立 Line / Discord 群組，截圖上傳 Google Classroom</div>
                    </div>
                    <div className="w7-hw-row">
                        <div className="w7-hw-label">分享文獻</div>
                        <div className="w7-hw-desc">每人分享 W5 找到的文獻，整合到共用資料夾（至少 3 篇）</div>
                    </div>
                </div>

                <div className="w7-hw-card">
                    <div className="w7-hw-hd">
                        <span className="w7-hw-tag" style={{ background: 'var(--gold)', color: '#1a1a2e' }}>Solo</span>
                        <span className="w7-hw-name">Solo 研究者追加作業</span>
                    </div>
                    <div className="w7-hw-row">
                        <div className="w7-hw-label">可行性檢核</div>
                        <div className="w7-hw-desc">確認題目規模合理：樣本數 OK？時間夠？方法熟悉？如有問題請在 W8 前調整</div>
                    </div>
                    <div className="w7-hw-row">
                        <div className="w7-hw-label">加入群組</div>
                        <div className="w7-hw-desc">加入老師建立的 Solo Zone 群組，自我介紹並分享你的研究題目</div>
                    </div>
                </div>

                <div className="w7-next-week-preview">
                    <div className="w7-next-week-header">
                        <span className="w7-next-week-badge">NEXT WEEK</span>
                        <h3 className="w7-next-week-title">W8 工具設計 預告</h3>
                    </div>
                    <div className="w7-next-week-content">
                        <div className="w7-next-week-col">
                            <div className="w7-next-week-label">W8 上半節</div>
                            <p className="w7-next-week-text">各科工具核心邏輯：問卷、訪談、實驗樣樣通。</p>
                        </div>
                        <div className="w7-next-week-col">
                            <div className="w7-next-week-label">W8 下半節</div>
                            <p className="w7-next-week-text">設計你的研究工具 1.0 版本，避開常見的設計大坑。</p>
                        </div>
                    </div>
                </div>

                <div style={{ padding: '32px 0 64px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Link to="/w6" className="text-[14px] font-bold text-[#8888aa] hover:text-[#1a1a2e] transition-colors flex items-center gap-2">
                        ← 回 W6 研究診所
                    </Link>
                    <Link to="/tool-design" className="bg-[#1a1a2e] text-white px-6 py-3 rounded-lg font-bold text-[14px] hover:bg-slate-800 transition-colors flex items-center gap-2">
                        前往 W8 工具設計 →
                    </Link>
                </div>
            </div>
        </div>
    );
};
