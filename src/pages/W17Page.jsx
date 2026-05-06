import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import CourseArc from '../components/ui/CourseArc';
import HeroBlock from '../components/ui/HeroBlock';
import TaskCard from '../components/ui/TaskCard';
import GroupSizeSelector from '../components/ui/GroupSizeSelector';
import './W17.css';
import {
    ArrowLeft,
    Users,
    Mic,
    BookOpen,
    Clock,
    Award,
    MessageCircle,
} from 'lucide-react';

/* ══════════════════════════════════════
 *  資料常數（對齊真實簡報 + 學習單 + 教案）
 * ══════════════════════════════════════ */

/* 90 分鐘活動主流程 + 5 分準備 + 5 分收尾 = 100 分鐘 */
const SCHEDULE = [
    { time: '0:00-0:05', activity: '場地布置 + 輪值規則確認', mode: '全班', icon: '🪑' },
    { time: '0:05-0:50', activity: '上半場 Gallery Walk（45 分鐘）', mode: '依組數輪值', icon: '🎨' },
    { time: '0:50-0:55', activity: '中場休息（換水 / 上廁所）', mode: '休息', icon: '☕' },
    { time: '0:55-1:40', activity: '下半場 Gallery Walk（45 分鐘）', mode: '依組數輪值', icon: '🎨' },
    { time: '1:40-1:45', activity: '收尾：填完兩份學習單最後欄位 + 老師結語', mode: '個人', icon: '🏆' },
];

/* 評分 4 向度（B 方案：完整度=門檻、其餘三向度合佔 100%）*/
const RUBRIC_LISTENER = [
    { dim: '✅ 完整度', weight: '門檻', desc: '聽滿 4 組 + 4 張筆記卡無空白。未達標 → 整份直接降一級。' },
    { dim: '📝 內容具體度', weight: '35%', desc: '能具體描述各組的研究問題、方法、發現。例（A）「他們用問卷比較段考前/平時，發現借書區人數差 3 倍」；例（C）「研究很有趣」。' },
    { dim: '❓ 提問品質', weight: '30%', desc: '針對方法、結論或延伸應用提問。例（A）「為什麼樣本只取 1 個班？」；例（C）「為什麼選這個題目？」。' },
    { dim: '💡 反思深度', weight: '35%', desc: '連結自身經驗或學習，提出獨到見解。例（A）「這組讓我想到我自己研究的盲點，下次想複製他們的編碼方式」；例（C）「我覺得他做得很棒」。' },
];
const RUBRIC_PRESENTER = [
    { dim: '✅ 完整度', weight: '門檻', desc: '分享滿 4 場 + 反思 4 題無空白。未達標 → 整份直接降一級。' },
    { dim: '📋 問題記錄', weight: '35%', desc: '具體記錄聽眾提問內容（不是「有人問問題」而是「他問 ___」）。例（A）「他問：你怎麼處理只填一直線的無效問卷？」；例（C）「有人問樣本」。' },
    { dim: '🔁 應答反思', weight: '30%', desc: '反思自己的回應好不好、哪題答不出來。例（A）「第 2 場我答不出『信效度』，因為我自己也不太懂——回家要補」；例（C）「都答得不錯」。' },
    { dim: '💡 反思深度', weight: '35%', desc: '從聽眾提問與互動，提出對研究的具體改進方向。例（A）「3 個聽眾都問樣本太小，下次要擴大到 3 個班」；例（C）「研究還可以更好」。' },
];

const JOURNEY_MAP = [
    { weeks: 'W1', ability: '初心', desc: '對 AI 的第一印象與第一判斷' },
    { weeks: 'W3-W4', ability: '問題意識', desc: '提出有意義的研究問題' },
    { weeks: 'W6', ability: '證據基礎', desc: '學術閱讀與批判性思考' },
    { weeks: 'W8-W10', ability: '科學嚴謹', desc: '設計與執行的品質意識' },
    { weeks: 'W11-W12', ability: '執行力', desc: '在不確定中持續推進' },
    { weeks: 'W13-W15', ability: '洞察力', desc: '從數據中讀出意義' },
    { weeks: 'W16-W17', ability: '溝通力', desc: '向他人清楚表達自己的發現' },
];

const DOS_AND_DONTS = {
    dos: [
        '認真聆聽每一組的分享',
        '主動提問，展現好奇心',
        '邊聽邊記，即時寫下',
        '尊重報告者，給予回饋',
        '準時換班，攤位有人',
    ],
    donts: [
        '只聽朋友那組',
        '滑手機、聊天',
        '活動結束才補寫',
        '提出攻擊性問題',
        '學習單抄襲敷衍',
    ],
};

/* ══════════════════════════════════════
 *  主元件
 * ══════════════════════════════════════ */
const W17Page = () => {
    useEffect(() => { window.scrollTo(0, 0); }, []);

    return (
        <div className="page-container animate-in-fade-slide">
            {/* TOP BAR */}
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-4 mb-8 md:mb-12 gap-3">
                <div className="text-[11px] font-mono text-[var(--ink-light)] flex items-center gap-2 min-w-0">
                    <span className="hidden md:inline">研究方法與專題 / 成果發表 / </span>
                    <span className="text-[var(--ink)] font-bold">Gallery Walk W17</span>
                </div>
                <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
                    <span className="bg-[var(--paper-warm)] text-[var(--ink)] text-[10px] font-bold px-2 py-0.5 rounded-[2px] font-mono">100 MINS</span>
                    <span className="hidden md:inline-block bg-[var(--ink)] text-white text-[10px] font-bold px-2 py-0.5 rounded-[2px] font-mono">AI-RED · D</span>
                </div>
            </div>

            {/* PAGE HEADER — Hero Block */}
            <HeroBlock
                kicker="R.I.B. 調查檔案 · 研究方法與專題 · W17"
                title="最終發表 Gallery Walk · "
                accentTitle="策展日"
                subtitle="像逛美術館一樣，自由走動聆聽各組的研究成果。每個人都有兩個身分——上半場顧攤分享、下半場走動聆聽（依組人數輪值）。紙本學習單兩份在課堂上填，這頁是行前說明 + 評分規準。"
                chain="W16 報告海報都好了——這週做最後一件事：站出去說、坐下來聽。其他組也會站出去——你會聽到 12 種完全不同的研究故事。"
                meta={[
                    { label: '活動時長', value: '90 分鐘（含 5 分休息）' },
                    { label: '報告者任務', value: '至少分享 4 場（每場 5-8 分鐘）' },
                    { label: '聆聽者任務', value: '至少聆聽 4 組 + 主動提問' },
                    { label: '繳交', value: '兩份紙本學習單（個人作業）' },
                ]}
            />
            {/* 改用 Home.jsx 的 5-phase studentArc 格式（原本 7-段細分屬 pacingArc） */}
            <CourseArc items={[
                { wk: 'W0–W3', name: '問題意識' , past: true },
                { wk: 'W4–W8', name: '研究規劃', past: true },
                { wk: 'W9–W10', name: '計畫定稿', past: true },
                { wk: 'W11–W12', name: '執行檢核', past: true },
                { wk: 'W13–W17', name: '分析與發表', now: true },
            ]} />

            {/* W17 沒有 lessonMaps W17Data，本節任務直接 inline 寫 */}
            <TaskCard
                weekNumber="W17"
                weekTitle="成果發表 · Gallery Walk"
                duration="90 分鐘 · 1 節課（含 5 分休息）"
                tasks={[
                    '報告者：分享 4 場（每場 5–8 分鐘）',
                    '聆聽者：聆聽 4 組 + 主動提問（至少各一次）',
                    '完成兩份紙本學習單（個人作業）+ 學術投資貼紙',
                ]}
                exportReminder="繳交兩份紙本學習單 — 完課！🎉"
            />

            {/* ═══ SCROLLING CONTENT ═══ */}
            <div className="prose-zh" style={{ maxWidth: 720, margin: '0 auto' }}>

            {/* 活動概述 */}
            <div className="card" style={{ marginTop: 24 }}>
                <div className="card-header">
                    <Users size={16} /> 什麼是 Gallery Walk？
                </div>
                <div className="card-body">
                    <p style={{ fontSize: 13, lineHeight: 1.85, marginBottom: 12 }}>
                        像逛美術館一樣，自由走動聆聽各組的研究成果。<strong>每個人都有兩個身分</strong>，兩份紙本學習單都要填。
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginTop: 12 }}>
                        <div style={{ padding: '12px', background: 'var(--paper-warm)', borderRadius: 'var(--radius-unified)', textAlign: 'center', fontSize: 12 }}>
                            <div style={{ fontSize: 22, marginBottom: 4 }}>🎤</div>
                            <strong>分享 ≥ 4 場</strong>
                        </div>
                        <div style={{ padding: '12px', background: 'var(--paper-warm)', borderRadius: 'var(--radius-unified)', textAlign: 'center', fontSize: 12 }}>
                            <div style={{ fontSize: 22, marginBottom: 4 }}>👂</div>
                            <strong>聆聽 ≥ 4 組</strong>
                        </div>
                        <div style={{ padding: '12px', background: 'var(--paper-warm)', borderRadius: 'var(--radius-unified)', textAlign: 'center', fontSize: 12 }}>
                            <div style={{ fontSize: 22, marginBottom: 4 }}>📝</div>
                            <strong>兩份學習單</strong>
                        </div>
                    </div>
                </div>
            </div>

            {/* 時程表 */}
            <div className="card" style={{ marginTop: 16 }}>
                <div className="card-header">
                    <Clock size={16} /> 今日時程（100 分鐘）
                </div>
                <div className="card-body">
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 1, background: 'var(--border)', border: '1px solid var(--border)', borderRadius: 'var(--radius-unified)', overflow: 'hidden' }}>
                        {SCHEDULE.map((s, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px', background: '#fff', fontSize: 12 }}>
                                <span style={{ fontSize: 16 }}>{s.icon}</span>
                                <span style={{ fontWeight: 700, color: 'var(--ink)', minWidth: 80 }}>{s.time}</span>
                                <span style={{ flex: 1, color: 'var(--ink-mid)' }}>{s.activity}</span>
                                <span style={{ fontSize: 11, color: 'var(--ink-mid)', opacity: 0.6 }}>{s.mode}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* 輪值表（依組數） — 用 GroupSizeSelector 共用組件 */}
            <div className="card" style={{ marginTop: 16 }}>
                <div className="card-header">
                    <Users size={16} /> 你的輪值時間（依組人數）
                </div>
                <div className="card-body">
                    <p style={{ fontSize: 12.5, color: 'var(--ink-mid)', lineHeight: 1.8, marginBottom: 12 }}>
                        <strong>請各組事先協調好輪值時間</strong>，確保攤位隨時有人。先選你的隊型：
                    </p>
                    <GroupSizeSelector
                        items={{
                            1: {
                                title: '1 人（Solo）',
                                content: (
                                    <div>
                                        <p style={{ marginBottom: 6 }}><strong>上半場 45 分</strong>：顧攤（分享 4-5 場，每場 5-8 分鐘）</p>
                                        <p style={{ marginBottom: 6 }}><strong>中場休息 5 分</strong></p>
                                        <p style={{ marginBottom: 6 }}><strong>下半場 45 分</strong>：聆聽（聽 4-5 組）</p>
                                        <p style={{ fontSize: 11, color: '#92400E', marginTop: 8 }}>💡 Solo 比較吃力，建議下半場集中聽 4 組就好，留時間填學習單。</p>
                                    </div>
                                ),
                            },
                            2: {
                                title: '2 人組',
                                content: (
                                    <ul className="list-disc pl-4 space-y-1">
                                        <li><strong>A：上半場 45 分顧攤</strong>，下半場 45 分聆聽</li>
                                        <li><strong>B：上半場 45 分聆聽</strong>，下半場 45 分顧攤</li>
                                    </ul>
                                ),
                            },
                            3: {
                                title: '3 人組',
                                content: (
                                    <div>
                                        <p style={{ marginBottom: 6 }}>每人輪值 30 分鐘顧攤，其他時間聆聽：</p>
                                        <ul className="list-disc pl-4 space-y-1">
                                            <li><strong>A 顧攤</strong>：0:05–0:35（上半場前 30 分）</li>
                                            <li><strong>B 顧攤</strong>：0:35–1:05（橫跨中場）</li>
                                            <li><strong>C 顧攤</strong>：1:05–1:40（下半場後 35 分）</li>
                                        </ul>
                                    </div>
                                ),
                            },
                            4: {
                                title: '4 人組',
                                content: (
                                    <ul className="list-disc pl-4 space-y-1">
                                        <li><strong>A、B：上半場 45 分顧攤</strong>，下半場 45 分聆聽</li>
                                        <li><strong>C、D：上半場 45 分聆聽</strong>，下半場 45 分顧攤</li>
                                    </ul>
                                ),
                            },
                        }}
                    />
                </div>
            </div>

            {/* 雙角色任務卡 */}
            <div className="w17-hint-grid" style={{ marginTop: 16 }}>
                <div className="w17-hint-card" style={{ background: '#FEF3C7', border: '1px solid #FDE68A' }}>
                    <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 8, color: '#92400E' }}>
                        <Mic size={14} style={{ verticalAlign: -2 }} /> 🎤 報告者任務
                    </div>
                    <div style={{ color: '#92400E', fontSize: 12, lineHeight: 1.85 }}>
                        <strong>你的任務</strong>：向來訪的同學介紹你的研究<br />
                        <strong>每場 5-8 分鐘</strong>：研究動機 → 方法過程 → 主要發現<br />
                        <strong>至少分享 4 場</strong>才算完成任務<br />
                        <strong>記錄聽眾提問</strong>到「報告者學習單」
                    </div>
                </div>
                <div className="w17-hint-card" style={{ background: '#EFF6FF', border: '1px solid #BFDBFE' }}>
                    <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 8, color: '#1E40AF' }}>
                        <BookOpen size={14} style={{ verticalAlign: -2 }} /> 👂 聆聽者任務
                    </div>
                    <div style={{ color: '#1E40AF', fontSize: 12, lineHeight: 1.85 }}>
                        <strong>你的任務</strong>：走動聆聽其他組的研究<br />
                        <strong>至少聆聽 4 組</strong>，填 4 張筆記卡<br />
                        <strong>每組聽完馬上記</strong>，不要等到最後<br />
                        <strong>主動提問</strong>，展現好奇心
                    </div>
                </div>
            </div>

            {/* 評分規準（B 方案：完整度=門檻、三向度共 100%）*/}
            <div className="card" style={{ marginTop: 16 }}>
                <div className="card-header">
                    <Award size={16} /> 學習單評分規準
                </div>
                <div className="card-body">
                    <p style={{ fontSize: 12.5, color: 'var(--ink-mid)', lineHeight: 1.8, marginBottom: 12 }}>
                        ⚠️ <strong>期末研究報告（組別分數）跟兩份學習單（個人分數）分開算。</strong>下方是學習單規準，每份各 100 分。
                    </p>

                    {/* 聆聽者 */}
                    <div style={{ marginBottom: 16 }}>
                        <p style={{ fontSize: 13, fontWeight: 700, color: '#1E40AF', marginBottom: 8 }}>👂 聆聽者學習單規準</p>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 1, background: 'var(--border)', border: '1px solid var(--border)', borderRadius: 'var(--radius-unified)', overflow: 'hidden' }}>
                            {RUBRIC_LISTENER.map((r, i) => (
                                <div key={i} style={{ padding: '10px 14px', background: '#fff', fontSize: 12, lineHeight: 1.7 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 3 }}>
                                        <strong style={{ color: 'var(--ink)' }}>{r.dim}</strong>
                                        <span style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 700 }}>{r.weight}</span>
                                    </div>
                                    <p style={{ color: 'var(--ink-mid)', margin: 0 }}>{r.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 報告者 */}
                    <div>
                        <p style={{ fontSize: 13, fontWeight: 700, color: '#92400E', marginBottom: 8 }}>🎤 報告者學習單規準</p>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 1, background: 'var(--border)', border: '1px solid var(--border)', borderRadius: 'var(--radius-unified)', overflow: 'hidden' }}>
                            {RUBRIC_PRESENTER.map((r, i) => (
                                <div key={i} style={{ padding: '10px 14px', background: '#fff', fontSize: 12, lineHeight: 1.7 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 3 }}>
                                        <strong style={{ color: 'var(--ink)' }}>{r.dim}</strong>
                                        <span style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 700 }}>{r.weight}</span>
                                    </div>
                                    <p style={{ color: 'var(--ink-mid)', margin: 0 }}>{r.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <p style={{ fontSize: 11.5, color: 'var(--ink-light)', lineHeight: 1.8, marginTop: 12, paddingTop: 10, borderTop: '1px solid var(--border)', fontStyle: 'italic' }}>
                        💡「完整度」是門檻條件——沒交滿（不到 4 組／4 場、欄位多處空白）整份學習單直接降一級。其他 3 向度的具體程度才是分數主軸。
                    </p>
                </div>
            </div>

            {/* 紙本學習單預覽 */}
            <div className="card" style={{ marginTop: 16, background: '#1a1a2e', border: 'none' }}>
                <div className="card-body" style={{ color: '#e2e8f0' }}>
                    <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>
                        <MessageCircle size={14} style={{ verticalAlign: -2 }} /> 紙本學習單提醒
                    </div>
                    <div style={{ fontSize: 12, lineHeight: 1.85, opacity: 0.85 }}>
                        <strong style={{ color: '#FDE68A' }}>報告者版：</strong>記錄 4 場被問的問題 + 我的回答 + 反思 4 題<br />
                        <strong style={{ color: '#93C5FD' }}>聆聽者版：</strong>4 張研究筆記卡（題目／問題與發現／做得好／我的提問／給我的啟發）+ 綜合反思 3 題<br /><br />
                        兩份都要填！每個人都同時是報告者跟聆聽者。
                    </div>
                </div>
            </div>

            {/* 紙本學習單預覽 - 報告者 */}
            <div className="card" style={{ marginTop: 12 }}>
                <div className="card-header" style={{ background: '#FEF3C7' }}>
                    <Mic size={16} /> 報告者版預覽 — 攤位分享紀錄
                </div>
                <div className="card-body">
                    <div style={{ fontSize: 12, color: 'var(--ink-mid)', lineHeight: 1.8 }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '60px 1fr 1fr', gap: 1, background: 'var(--border)', border: '1px solid var(--border)', borderRadius: 'var(--radius-unified)', overflow: 'hidden', marginBottom: 12 }}>
                            <div style={{ padding: '8px 12px', background: 'var(--paper-warm)', fontWeight: 700, fontSize: 11, textAlign: 'center' }}>場次</div>
                            <div style={{ padding: '8px 12px', background: 'var(--paper-warm)', fontWeight: 700, fontSize: 11 }}>聽眾問了什麼問題？</div>
                            <div style={{ padding: '8px 12px', background: 'var(--paper-warm)', fontWeight: 700, fontSize: 11 }}>我怎麼回答？答得好嗎？</div>
                            {[1,2,3,4].map(n => (
                                <React.Fragment key={n}>
                                    <div style={{ padding: '8px 12px', background: '#fff', fontWeight: 700, textAlign: 'center' }}>{n}</div>
                                    <div style={{ padding: '8px 12px', background: '#fff', color: '#ccc' }}>（課堂填寫）</div>
                                    <div style={{ padding: '8px 12px', background: '#fff', color: '#ccc' }}>（課堂填寫）</div>
                                </React.Fragment>
                            ))}
                        </div>
                        <strong>分享後反思 4 題：</strong><br />
                        1. 被問到印象最深刻的問題？為什麼印象深刻？<br />
                        2. 有沒有答不出來的問題？為什麼答不出來？<br />
                        3. 講了幾場後，你發現怎麼解釋最清楚？<br />
                        4. 從聽眾的提問中，你的研究還可以怎麼改進？
                    </div>
                </div>
            </div>

            {/* 紙本學習單預覽 - 聆聽者 */}
            <div className="card" style={{ marginTop: 12 }}>
                <div className="card-header" style={{ background: '#EFF6FF' }}>
                    <BookOpen size={16} /> 聆聽者版預覽 — 研究聆聽筆記
                </div>
                <div className="card-body">
                    <div style={{ fontSize: 12, color: 'var(--ink-mid)', lineHeight: 1.8 }}>
                        <strong>每組聽完填一張筆記卡（共 4 張），每張包含：</strong>
                        <div style={{ marginTop: 8, padding: '12px 16px', background: '#F8FAFC', borderRadius: 'var(--radius-unified)', border: '1px solid var(--border)' }}>
                            <div style={{ marginBottom: 6 }}>📝 <strong>研究題目：</strong>___</div>
                            <div style={{ marginBottom: 6 }}>🔍 這組想解決什麼問題？主要發現是什麼？</div>
                            <div style={{ marginBottom: 6 }}>✅ 這組做得好的地方（方法、呈現、發現）</div>
                            <div style={{ marginBottom: 6 }}>❓ 我想問的問題／好奇的地方</div>
                            <div>💡 這個研究給我的啟發（跟我的生活或研究的連結）</div>
                        </div>
                        <div style={{ marginTop: 12 }}>
                            <strong>綜合反思 3 題：</strong><br />
                            1. 今天聽到最有趣或印象深刻的研究是哪一組？為什麼？<br />
                            2. 從別組的研究中，你學到什麼可以應用在自己研究上的？<br />
                            3. 如果你是評審，「好的研究」應具備哪些特質？（列 3 點）
                        </div>
                    </div>
                </div>
            </div>

            {/* 注意事項：請這樣做 vs 請避免 */}
            <div className="w17-hint-grid" style={{ marginTop: 16 }}>
                <div className="w17-hint-card" style={{ background: '#F0FDF4', border: '1px solid #86EFAC' }}>
                    <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 8, color: '#15803D' }}>
                        ✅ 請這樣做
                    </div>
                    <ul style={{ color: '#166534', fontSize: 12, lineHeight: 1.85, listStyle: 'none', padding: 0, margin: 0 }}>
                        {DOS_AND_DONTS.dos.map((x, i) => (
                            <li key={i} style={{ marginBottom: 3 }}>👍 {x}</li>
                        ))}
                    </ul>
                </div>
                <div className="w17-hint-card" style={{ background: '#FEF2F2', border: '1px solid #FCA5A5' }}>
                    <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 8, color: '#B91C1C' }}>
                        ❌ 請避免
                    </div>
                    <ul style={{ color: '#991B1B', fontSize: 12, lineHeight: 1.85, listStyle: 'none', padding: 0, margin: 0 }}>
                        {DOS_AND_DONTS.donts.map((x, i) => (
                            <li key={i} style={{ marginBottom: 3 }}>👎 {x}</li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* 學期 AI 協作反思 — 已搬到 W14 寫，W17 是抽問日 */}
            <div className="card" style={{ marginTop: 16, padding: 16, background: '#FEF3C7', borderColor: '#D97706', borderWidth: 2 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 6 }}>
                    <p style={{ fontSize: 14, fontWeight: 700, color: '#92400E', margin: 0 }}>🎯 學期 AI 協作反思（今日抽問日）</p>
                    <span style={{ fontSize: 10, fontFamily: "'DM Mono', monospace", color: '#92400E', background: 'white', padding: '2px 8px', borderRadius: 4, border: '1px solid #D97706', flexShrink: 0 }}>跨週作業</span>
                </div>
                <p style={{ fontSize: 12, color: '#78350F', lineHeight: 1.75, marginBottom: 10 }}>
                    這份反思你應該已在 <strong>W14</strong> 寫完了——回頭打開 <Link to="/w14" style={{ color: '#92400E', fontWeight: 700, textDecoration: 'underline' }}>W14 頁面</Link> 翻到「學期 AI 協作反思」block 看你當時寫的內容。<br />
                    <strong>今天 Gallery Walk 中段老師會隨機點 3 位同學現場分享</strong>你 W14 寫的內容——所以你現在要做的事是：<strong>翻出來複習一下，準備好 1-2 句精華</strong>。
                </p>
                <div style={{ background: 'white', border: '1px dashed #D97706', borderRadius: 4, padding: '10px 14px', fontSize: 11.5, color: '#92400E', lineHeight: 1.8 }}>
                    📌 <strong>沒在 W14 寫過怎麼辦？</strong>馬上補——5 分鐘寫完即可。但被點到時就承認「我在 W14 沒寫，現場想一個給你」，誠實比裝有寫更尊重大家。<br />
                    💡 <strong>抽問問題會是哪個？</strong>三選一隨機：①「最讓你改變想法的一次 AI 協作」②「AI-RED 五字裡你最常忘的是哪一個？為什麼」③「你會推薦學弟妹怎麼用 AI 做研究？」
                </div>
            </div>

            {/* 本週結束，你應該要會 — B 標準格式 */}
            <div className="bg-white border border-[var(--border)] rounded-[var(--radius-unified)] overflow-hidden mb-4" style={{ marginTop: 24 }}>
                <div className="p-4 px-5 bg-[var(--paper-warm)] border-b border-[var(--border)] font-bold text-[13px]">
                    ✅ 本週結束，你應該要會
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-[1px] bg-[var(--border)]">
                    {[
                        '顧攤分享至少 4 場：清楚說出研究動機、方法、主要發現',
                        '走動聆聽至少 4 組：填完 4 張筆記卡，內容具體不空泛',
                        '提出至少 1 個有深度的問題（針對方法、結論或延伸應用）',
                        '從別組研究中帶走 1 個能應用到自己研究的具體做法',
                    ].map((item, i) => (
                        <div key={i} className="p-4 px-5 bg-white flex items-start gap-3">
                            <span className="text-[var(--success)] text-[16px] mt-0.5 flex-shrink-0">✓</span>
                            <span className="text-[13px] text-[var(--ink-mid)] leading-relaxed">{item}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* 全課程旅程 */}
            <div className="w17-finale-card" style={{ marginTop: 24 }}>
                <div className="w17-finale-title">恭喜你完成了整個研究旅程！</div>
                <div className="w17-finale-body">
                    這 17 週，你從一個想法開始，<br />
                    走過了題目診斷、工具設計、倫理審查、實地執行、AI 分析、報告撰寫。<br /><br />
                    你學到的最重要的東西不是任何一個研究技術，<br />
                    而是——<strong style={{ color: '#F59E0B' }}>遇到問題，你知道怎麼找下一步。</strong>
                </div>
            </div>

            {/* 旅程地圖 */}
            <div className="card" style={{ marginTop: 16 }}>
                <div className="card-header">
                    研究能力成長地圖
                </div>
                <div className="card-body">
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 1, background: 'var(--border)', border: '1px solid var(--border)', borderRadius: 'var(--radius-unified)', overflow: 'hidden' }}>
                        {JOURNEY_MAP.map((j, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px', background: '#fff', fontSize: 12 }}>
                                <span style={{ fontWeight: 700, color: 'var(--accent)', minWidth: 60 }}>{j.weeks}</span>
                                <span style={{ fontWeight: 700, color: 'var(--ink)', minWidth: 70 }}>{j.ability}</span>
                                <span style={{ color: 'var(--ink-mid)' }}>{j.desc}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* 底部導航 */}
            <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: 32, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
                <Link to="/w16" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600, color: 'var(--accent)', textDecoration: 'none' }}>
                    <ArrowLeft size={16} /> W16
                </Link>
            </div>

            </div>{/* end scrolling content wrapper */}
        </div>
    );
};

export { W17Page };
export default W17Page;
