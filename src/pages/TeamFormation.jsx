import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import CourseArc from '../components/ui/CourseArc';
import './TeamFormation.css';
import { Users, ArrowRight, CheckCircle2, Search, Map, Zap, Target, Telescope, BookOpen } from 'lucide-react';
import LessonMap from '../components/ui/LessonMap';
import { W7Data } from '../data/lessonMaps';

export const TeamFormation = () => {
    const [showLessonMap, setShowLessonMap] = useState(false);

    return (
        <div className="page-container animate-in-fade-slide">

            {/* TOP BAR */}
            <div className="flex items-center justify-between border-b border-[#dddbd5] pb-4 mb-16">
                <div className="text-[11px] font-mono text-[#8888aa] flex items-center gap-2">
                    研究方法與專題 / 研究規劃 / <span className="text-[#1a1a2e] font-bold">研究博覽會 W8</span>
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
                <div className="w7-content pb-0">
                    <div className="animate-in slide-in-from-top-4 duration-300">
                        <LessonMap data={W7Data} />
                    </div>
                </div>
            )}

            <div className="w7-content">
                <div className="w7-top-breadcrumb">
                    <span>🔭 W8</span>
                    <span className="w7-breadcrumb-sep">·</span>
                    <span>研究規劃</span>
                    <span className="w7-breadcrumb-sep">→</span>
                    <span>裝備執行</span>
                </div>

                <h1 className="w7-page-title">
                    研究博覽會：<span className="text-[#2d5be3]">組隊 × 合題 × 企劃書</span>
                </h1>
                <p className="w7-page-subtitle">
                    今天是課程的轉折點——從一個人的研究，變成一個團隊的研究。
                    找到隊友、把題目合併、寫出一份研究企劃書，然後預寫 3 題工具草稿帶去 W9 診所。
                </p>

                <div className="w7-meta-grid">
                    {[
                        { label: '第一節', value: '博覽會展示 + 合題規則 + 組隊確認' },
                        { label: '第二節', value: '企劃書撰寫 + 3 題工具草稿' },
                        { label: '課堂產出', value: '分組名單 + 企劃書初稿 + 3 題草稿' },
                        { label: '帶去 W9', value: '3 題草稿問題（你的掛號單）' }
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

                <CourseArc items={W7Data.courseArc} />

                {/* ═══ 合題三情境 ═══ */}
                <div className="w7-sub-label">合題規則 · 三種情境判斷</div>
                <div className="w7-expo-grid">
                    {[
                        { n: '✅', t: '同一現象，不同角度', d: '「高中生每天睡幾小時？」＋「睡眠不足對考試的影響？」→ 合成「睡眠時數與高中生學業表現的關係」', color: '#059669' },
                        { n: '✅', t: '因果鏈相連，互為變項', d: '「高中生每天用社群媒體幾小時？」＋「高中生的焦慮感有多強？」→ 合成「社群媒體使用時間是否影響青少年焦慮感」', color: '#059669' },
                        { n: '⚠️', t: '主題差距過大 → 重新搭配', d: '「學校午餐滿意度」＋「高中生職業志向」→ 幾乎無交集，強行合題會讓研究失焦。建議重新找隊友。', color: '#D97706' }
                    ].map((item, idx) => (
                        <div key={idx} className="w7-expo-card">
                            <span className="w7-expo-num" style={{ color: item.color }}>{item.n}</span>
                            <span className="w7-expo-title">{item.t}</span>
                            <p className="w7-expo-desc">{item.d}</p>
                        </div>
                    ))}
                </div>

                <div className="w7-notice w7-notice-gold" style={{ marginBottom: '48px' }}>
                    ⚠️ 合題禁忌：不要讓同一份問卷同時問兩個完全不同方向的問題——受訪者會一頭霧水。
                    方法不同不代表不能合作：可以各自負責不同子研究問題，只要整體主題一致即可。
                </div>

                {/* ═══ 主題 vs 問題 ═══ */}
                <div className="w7-sub-label">「研究主題」vs「研究問題」· 範例對照</div>
                <div className="bg-white border border-[#dddbd5] rounded-[10px] overflow-hidden mb-12">
                    <div className="grid grid-cols-[80px_1fr_1fr] gap-[1px] bg-[#dddbd5]">
                        <div className="bg-[#1a1a2e] p-3 px-4 text-[11px] font-bold text-white font-mono"></div>
                        <div className="bg-[#1a1a2e] p-3 px-4 text-[11px] font-bold text-white">① 研究主題（像書名）</div>
                        <div className="bg-[#1a1a2e] p-3 px-4 text-[11px] font-bold text-white">② 研究問題（要回答的核心題目）</div>

                        <div className="bg-[#e8eeff] p-3 px-4 text-[11px] font-bold text-[#2d5be3] font-mono">因果型</div>
                        <div className="bg-white p-3 px-4 text-[13px] text-[#4a4a6a]">社群媒體使用與青少年焦慮感</div>
                        <div className="bg-white p-3 px-4 text-[13px] text-[#4a4a6a]">每日 IG 使用時間<strong>是否影響</strong>高中生的焦慮程度？</div>

                        <div className="bg-[#e8f5ee] p-3 px-4 text-[11px] font-bold text-[#2e7d5a] font-mono">相關型</div>
                        <div className="bg-[#fafaf8] p-3 px-4 text-[13px] text-[#4a4a6a]">高中生睡眠品質與學業表現</div>
                        <div className="bg-[#fafaf8] p-3 px-4 text-[13px] text-[#4a4a6a]">就寢時間與段考成績之間<strong>有什麼關係</strong>？</div>

                        <div className="bg-[#faf5e4] p-3 px-4 text-[11px] font-bold text-[#c9a84c] font-mono">描述型</div>
                        <div className="bg-white p-3 px-4 text-[13px] text-[#4a4a6a]">校園午餐滿意度調查</div>
                        <div className="bg-white p-3 px-4 text-[13px] text-[#4a4a6a]">松山高中學生對午餐菜色、份量、價格的<strong>滿意程度如何</strong>？</div>
                    </div>
                </div>

                {/* ═══ 課堂任務 ═══ */}
                <div className="w7-section-divider">
                    <h2 className="w7-section-title">課堂任務</h2>
                    <div className="w7-section-line"></div>
                    <span className="w7-section-tag">IN-CLASS</span>
                </div>

                {/* TASK 1: 開場 */}
                <div className="w7-task-box">
                    <div className="w7-task-header">
                        <span className="w7-task-badge">TASK 1</span>
                        <span className="w7-task-title">開場回顧（第一節 0:00–0:05，5 分鐘）</span>
                    </div>
                    <div className="w7-task-content">
                        <ul className="w7-task-ul">
                            <li className="w7-task-li">回顧 W7 研究診所：你已經有了個人題目和方法判斷</li>
                            <li className="w7-task-li">本節任務：找到隊友、把題目合併、寫出研究企劃書</li>
                            <li className="w7-task-li">確認 W7 學習單已帶來（個人研究題目 + 判斷的研究方法）</li>
                        </ul>
                    </div>
                </div>

                {/* TASK 2: 博覽會 */}
                <div className="w7-task-box">
                    <div className="w7-task-header">
                        <span className="w7-task-badge">TASK 2</span>
                        <span className="w7-task-title">研究博覽會（第一節 0:05–0:25，20 分鐘）</span>
                    </div>
                    <div className="w7-task-content">
                        <ul className="w7-task-ul">
                            <li className="w7-task-li">每人 1 分鐘介紹三件事：① 我想研究什麼 ② 我的研究問題 ③ 我打算用什麼方法</li>
                            <li className="w7-task-li">全班輪流（按座位順序），班級人數多時可改為 4 人小組輪流</li>
                            <li className="w7-task-li">邊聽邊記：在學習單 Part A 記下 2–3 位讓你心動的潛在隊友姓名與題目</li>
                        </ul>
                        <div className="w7-notice w7-notice-accent">
                            💡 聆聽重點：有沒有人的題目和你很像，或者可以互補？
                        </div>
                    </div>
                </div>

                {/* TASK 3: 合題規則 */}
                <div className="w7-task-box">
                    <div className="w7-task-header">
                        <span className="w7-task-badge">TASK 3</span>
                        <span className="w7-task-title">合題規則講解 + 試配對（第一節 0:25–0:35，10 分鐘）</span>
                    </div>
                    <div className="w7-task-content">
                        <ul className="w7-task-ul">
                            <li className="w7-task-li">學習三種合題情境（見上方「合題規則」），判斷自己屬於哪種</li>
                            <li className="w7-task-li">合題的關鍵：找到兩個題目的<strong>共同核心</strong>，不是硬湊</li>
                            <li className="w7-task-li">合題後的研究問題用三種句型寫：「是否影響」（因果）/「有什麼關係」（相關）/「現況為何」（描述）</li>
                        </ul>
                    </div>
                </div>

                {/* TASK 4: 組隊確認 */}
                <div className="w7-task-box">
                    <div className="w7-task-header">
                        <span className="w7-task-badge">TASK 4</span>
                        <span className="w7-task-title">組隊確認 + 初步合題（第一節 0:35–0:50，15 分鐘）</span>
                    </div>
                    <div className="w7-task-content">
                        <ul className="w7-task-ul">
                            <li className="w7-task-li">每組 2–4 人，根據博覽會記下的名單找隊友</li>
                            <li className="w7-task-li">在學習單 Part B 記錄：你們的題目能不能合？合成什麼？</li>
                            <li className="w7-task-li">還沒找到隊友的同學舉手，老師協助媒合</li>
                        </ul>
                        <div className="w7-notice w7-notice-success">
                            ✅ 分組確認後，填寫 Part B「合題結果」，教師統一記錄分組名單。
                        </div>
                    </div>
                </div>

                {/* TASK 5: 企劃書 */}
                <div className="w7-task-box">
                    <div className="w7-task-header">
                        <span className="w7-task-badge">TASK 5</span>
                        <span className="w7-task-title">企劃書撰寫（第二節 0:00–0:35，35 分鐘）</span>
                    </div>
                    <div className="w7-task-content">
                        <p className="text-[13px] text-[#4a4a6a] mb-3 leading-relaxed">
                            企劃書是你們研究的地圖——讓你和隊友知道：我們要去哪裡、怎麼去、誰負責什麼。
                        </p>
                        <div className="bg-white border border-[#dddbd5] rounded-lg overflow-hidden mb-4">
                            <div className="grid grid-cols-[40px_1fr_2fr] gap-[1px] bg-[#dddbd5] text-[12px]">
                                <div className="bg-[#0D7377] p-2 px-3 font-bold text-white text-center">#</div>
                                <div className="bg-[#0D7377] p-2 px-3 font-bold text-white">欄位</div>
                                <div className="bg-[#0D7377] p-2 px-3 font-bold text-white">說明</div>
                                {[
                                    ['1', '組名 & 成員', '組名自訂；列出所有成員'],
                                    ['2', '分工表', '每人負責哪個子問題 or 任務'],
                                    ['3', '研究主題', '合題後的大主題（10–20 字）'],
                                    ['4', '研究問題', '因果型 / 相關型 / 描述型句型'],
                                    ['5', '研究方法', '方法名稱 + 理由（參考 W7）'],
                                    ['6', '研究對象', '對誰？多少人/案例？'],
                                    ['7', '時程規劃', 'W9–W14 各做什麼？']
                                ].map(([no, field, note], i) => (
                                    <React.Fragment key={i}>
                                        <div className={`${i % 2 === 0 ? 'bg-[#f5f5f5]' : 'bg-white'} p-2 px-3 font-bold text-[#0D7377] text-center`}>{no}</div>
                                        <div className={`${i % 2 === 0 ? 'bg-[#f5f5f5]' : 'bg-white'} p-2 px-3 font-bold text-[#1a1a2e]`}>{field}</div>
                                        <div className={`${i % 2 === 0 ? 'bg-[#f5f5f5]' : 'bg-white'} p-2 px-3 text-[#4a4a6a]`}>{note}</div>
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>
                        <div className="w7-notice w7-notice-accent">
                            💡 欄位 4 是核心：如果問題太廣（如「學生壓力」），要縮小範疇（如「期中考週的睡眠壓力」）。
                        </div>
                    </div>
                </div>

                {/* TASK 6: 工具草稿 */}
                <div className="w7-task-box">
                    <div className="w7-task-header">
                        <span className="w7-task-badge">TASK 6</span>
                        <span className="w7-task-title">預寫 3 題工具草稿（第二節 0:35–0:45，10 分鐘）</span>
                    </div>
                    <div className="w7-task-content">
                        <p className="text-[13px] text-[#4a4a6a] mb-3 leading-relaxed">
                            對照你在企劃書選定的方法，寫出 3 題草稿。W9 的診所會幫你們把關品質——草稿就是你的掛號單。
                        </p>
                        <div className="bg-white border border-[#dddbd5] rounded-lg overflow-hidden mb-4">
                            <div className="grid grid-cols-[80px_1fr_2fr] gap-[1px] bg-[#dddbd5] text-[12px]">
                                <div className="bg-[#0D7377] p-2 px-3 font-bold text-white">方法</div>
                                <div className="bg-[#0D7377] p-2 px-3 font-bold text-white">草稿長什麼樣</div>
                                <div className="bg-[#0D7377] p-2 px-3 font-bold text-white">範例</div>
                                {[
                                    ['問卷法', '封閉式問題（含選項）', '你每天使用 IG 的時間大約多長？ □不到30分 □30-60分 □1-2小時 □超過2小時'],
                                    ['訪談法', '開放式問題', '可以描述一下你通常在什麼情境下會打開 IG 嗎？'],
                                    ['觀察法', '觀察指標（誰＋情境＋行為）', '午休時間，觀察教室內有多少人在滑手機（每5分鐘記錄一次）'],
                                    ['實驗法', '操作步驟（操弄＋測量）', '實驗組用番茄鐘25分鐘讀書，對照組自由讀書，測量記憶測驗分數'],
                                    ['文獻分析', '搜尋策略（關鍵字＋篩選）', '關鍵字「青少年+社群媒體+焦慮」，篩選近5年、中英文期刊']
                                ].map(([method, shape, example], i) => (
                                    <React.Fragment key={i}>
                                        <div className={`${i % 2 === 0 ? 'bg-[#f5f5f5]' : 'bg-white'} p-2 px-3 font-bold text-[#0D7377]`}>{method}</div>
                                        <div className={`${i % 2 === 0 ? 'bg-[#f5f5f5]' : 'bg-white'} p-2 px-3 text-[#4a4a6a]`}>{shape}</div>
                                        <div className={`${i % 2 === 0 ? 'bg-[#f5f5f5]' : 'bg-white'} p-2 px-3 text-[#4a4a6a]`}>{example}</div>
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>
                        <div className="w7-notice w7-notice-danger">
                            ⚠️ 這 3 題草稿不計分，但 W9 要帶來診所——沒有草稿就沒辦法診斷！
                        </div>
                    </div>
                </div>

                {/* TASK 7: 收束 */}
                <div className="w7-task-box" style={{ marginBottom: '64px' }}>
                    <div className="w7-task-header">
                        <span className="w7-task-badge">TASK 7</span>
                        <span className="w7-task-title">各組簡報 + 收束（第二節 0:45–0:50，5 分鐘）</span>
                    </div>
                    <div className="w7-task-content">
                        <ul className="w7-task-ul">
                            <li className="w7-task-li">每組 30 秒電梯簡報：你們的研究主題是什麼，打算問誰</li>
                            <li className="w7-task-li">今天完成了重要一步：從個人題目，變成團隊研究計畫</li>
                            <li className="w7-task-li">下週 W9，帶著 3 題草稿問題，一起來診斷品質</li>
                        </ul>
                    </div>
                </div>

                {/* ═══ 總結 ═══ */}
                <div className="w7-section-divider">
                    <h2 className="w7-section-title">本週總結</h2>
                    <div className="w7-section-line"></div>
                    <span className="w7-section-tag">WRAP-UP</span>
                </div>

                <div className="bg-white border border-[#dddbd5] rounded-[10px] overflow-hidden mb-6">
                    <div className="p-4 px-5 bg-[#f0ede6] border-b border-[#dddbd5] font-bold text-[13px]">
                        ✅ 本週結束，你應該要會
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-[1px] bg-[#dddbd5]">
                        {[
                            '完成分組，確認組員名單',
                            '把個人題目合併為團隊研究主題',
                            '完成研究企劃書初稿（含分工表）',
                            '寫好 3 題工具草稿，準備帶到 W9 診所'
                        ].map((item, i) => (
                            <div key={i} className="p-4 px-6 bg-white flex items-start gap-3">
                                <span className="text-[#2e7d5a] mt-0.5">✓</span>
                                <span className="text-[13px] text-[#4a4a6a]">{item}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 下週預告 */}
                <div className="next-week-preview">
                    <div className="next-week-header">
                        <span className="next-week-badge">NEXT WEEK</span>
                        <h3 className="next-week-title">W9 工具設計 預告</h3>
                    </div>
                    <div className="next-week-content">
                        <div className="next-week-col">
                            <div className="next-week-label">帶什麼來</div>
                            <p className="next-week-text">你的 3 題草稿問題——這是你的「掛號單」，沒有草稿就沒辦法進診所。</p>
                        </div>
                        <div className="next-week-col">
                            <div className="next-week-label">做什麼</div>
                            <p className="next-week-text">老師用「診所模式」逐題診斷你的問卷/訪綱/觀察指標品質，升級為 2.0 版。</p>
                        </div>
                    </div>
                </div>

                <div style={{ padding: '32px 0 64px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Link to="/w7" className="text-[14px] font-bold text-[#8888aa] hover:text-[#1a1a2e] transition-colors flex items-center gap-2">
                        ← 回 W7 研究診所
                    </Link>
                    <Link to="/w9" className="bg-[#1a1a2e] text-white px-6 py-3 rounded-lg font-bold text-[14px] hover:bg-slate-800 transition-colors flex items-center gap-2">
                        前往 W9 工具設計 →
                    </Link>
                </div>
            </div>
        </div>
    );
};
