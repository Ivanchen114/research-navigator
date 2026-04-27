import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import CourseArc from '../components/ui/CourseArc';
import HeroBlock from '../components/ui/HeroBlock';
import ThinkRecord from '../components/ui/ThinkRecord';
import './W17.css';
import {
    ArrowLeft,
    Users,
    Mic,
    BookOpen,
    Clock,
    Award,
    Star,
    MessageCircle,
} from 'lucide-react';

/* ══════════════════════════════════════
 *  資料常數
 * ══════════════════════════════════════ */

const SCHEDULE = [
    { time: '0:00-0:10', activity: '場地布置 + A/B 輪替規則說明', mode: '全班', icon: '🪑' },
    { time: '0:10-0:12', activity: '30 秒電梯簡報開嗓', mode: '全班', icon: '🎙️' },
    { time: '0:12-0:45', activity: '第一輪 Gallery Walk（A 報告，B 聆聽）', mode: 'A 守攤 / B 走動', icon: '🚶' },
    { time: '0:45-0:50', activity: '中場換位', mode: '全班', icon: '🔄' },
    { time: '0:50-1:25', activity: '第二輪 Gallery Walk（B 報告，A 聆聽）', mode: 'B 守攤 / A 走動', icon: '🚶' },
    { time: '1:25-1:33', activity: '填完兩份學習單最後欄位', mode: '個人', icon: '✍️' },
    { time: '1:33-1:40', activity: '學術投資統計 + AI 最佳提問獎 + 結語', mode: '全班', icon: '🏆' },
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

/* ══════════════════════════════════════
 *  主元件（純說明頁，無互動填寫）
 * ══════════════════════════════════════ */
const W17Page = () => {
    useEffect(() => { window.scrollTo(0, 0); }, []);

    return (
        <div className="page-container animate-in-fade-slide">
            {/* TOP BAR */}
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-4 mb-8 md:mb-12 gap-3">
                <div className="text-[11px] font-mono text-[var(--ink-light)] flex items-center gap-2 min-w-0">
                    <span className="hidden md:inline">研究方法與專題 / 成果發表 / </span><span className="text-[var(--ink)] font-bold">Gallery Walk W17</span>
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
                subtitle="今天每個人都是知識的生產者，也是知識的接收者。紙本學習單發表時填寫，這頁只是行前說明。"
                meta={[
                    { label: '第一節', value: 'Gallery Walk 第一輪（A 守攤 / B 走動）' },
                    { label: '第二節', value: 'Gallery Walk 第二輪 + 學術投資統計' },
                    { label: '課堂產出', value: '報告者 + 聆聽者學習單（紙本）' },
                    { label: '前置要求', value: '列印好的海報 + 報告定稿' },
                ]}
            />
            <CourseArc items={[
                { wk: 'W1-W2', name: '探索階段\nRED公約', past: true },
                { wk: 'W3-W4', name: '題目診斷\n博覽會', past: true },
                { wk: 'W5-W7', name: '規劃分流\n企劃定案', past: true },
                { wk: 'W8-W10', name: '工具設計\n倫理審查', past: true },
                { wk: 'W11-W13', name: '執行階段\n自主研究', past: true },
                { wk: 'W14-W15', name: '數據轉譯\n圖表結論', past: true },
                { wk: 'W16-W17', name: '成果簡報\n博覽發表', now: true },
            ]} />

            {/* ═══ SCROLLING CONTENT ═══ */}
            <div style={{ maxWidth: 720, margin: '0 auto' }}>

            {/* A/B 輪替 */}
            <div className="card" style={{ marginTop: 24 }}>
                <div className="card-header">
                    <Users size={16} /> A/B 輪替機制
                </div>
                <div className="card-body">
                    <p style={{ fontSize: 13, lineHeight: 1.8, marginBottom: 16 }}>
                        全班分成 A、B 兩組。<strong>每個人都有兩個身分</strong>——報告者和聆聽者，兩份紙本學習單都要填。
                    </p>
                    <div className="w17-rotation-grid">
                        <div className="w17-rotation-cell w17-rotation-header" />
                        <div className="w17-rotation-cell w17-rotation-header">第一輪（35 min）</div>
                        <div className="w17-rotation-cell w17-rotation-header">第二輪（35 min）</div>
                        <div className="w17-rotation-cell w17-rotation-header">A 組</div>
                        <div className="w17-rotation-cell" style={{ background: '#FEF3C7' }}>🎤 守攤報告</div>
                        <div className="w17-rotation-cell" style={{ background: '#EFF6FF' }}>📚 走動聆聽</div>
                        <div className="w17-rotation-cell w17-rotation-header">B 組</div>
                        <div className="w17-rotation-cell" style={{ background: '#EFF6FF' }}>📚 走動聆聽</div>
                        <div className="w17-rotation-cell" style={{ background: '#FEF3C7' }}>🎤 守攤報告</div>
                    </div>
                </div>
            </div>

            {/* 雙提示卡 */}
            <div className="w17-hint-grid" style={{ marginTop: 16 }}>
                <div className="w17-hint-card" style={{ background: '#FEF3C7', border: '1px solid #FDE68A' }}>
                    <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 8, color: '#92400E' }}>
                        <Mic size={14} style={{ verticalAlign: -2 }} /> 報告者提示
                    </div>
                    <div style={{ color: '#92400E', fontSize: 12, lineHeight: 1.7 }}>
                        先說研究的「為什麼」，再說「發現什麼」<br />
                        每場 2-3 分鐘，不是念海報，是說故事<br />
                        聽眾問的問題記在<strong>報告者學習單</strong>
                    </div>
                </div>
                <div className="w17-hint-card" style={{ background: '#EFF6FF', border: '1px solid #BFDBFE' }}>
                    <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 8, color: '#1E40AF' }}>
                        <BookOpen size={14} style={{ verticalAlign: -2 }} /> 聆聽者提示
                    </div>
                    <div style={{ color: '#1E40AF', fontSize: 12, lineHeight: 1.7 }}>
                        目標：至少聽 4 組 → 填 4 張筆記卡<br />
                        每組聽完馬上記，不要等到最後<br />
                        你有 <strong>3 張圓點貼紙</strong>（學術投資），投給最好的組
                    </div>
                </div>
            </div>

            {/* 30 秒電梯簡報 */}
            <div className="card" style={{ marginTop: 16 }}>
                <div className="card-header">
                    <Mic size={16} /> 30 秒電梯簡報公式
                </div>
                <div className="card-body">
                    <div className="w17-pitch-formula">
                        「你有沒有遇過<span className="w17-pitch-blank">某個生活痛點</span>？<br />
                        我們發現其實是因為<span className="w17-pitch-blank">核心發現</span>！<br />
                        我們是怎麼證實的呢？<span className="w17-pitch-blank">一句話帶過方法</span>」
                    </div>
                </div>
            </div>

            {/* 時程表 */}
            <div className="card" style={{ marginTop: 16 }}>
                <div className="card-header">
                    <Clock size={16} /> 今日時程
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

            {/* 學術投資機制 */}
            <div className="w17-sticker-card" style={{ marginTop: 16 }}>
                <div className="w17-sticker-header">
                    <Award size={16} /> 學術投資機制
                </div>
                <div className="w17-sticker-body">
                    聆聽者每人有 <strong>3 張圓點貼紙</strong>。聽完報告後，如果覺得這組「方法很嚴謹」或「發現超有趣」，在他們海報角落貼一張。不能投自己組，也不能 3 張全投同一組。最後統計哪一組最受學術投資人青睞！
                </div>
            </div>

            {/* AI 最佳提問獎 */}
            <div className="card" style={{ marginTop: 16 }}>
                <div className="card-header">
                    <Star size={16} /> AI 最佳提問獎
                </div>
                <div className="card-body" style={{ fontSize: 12, lineHeight: 1.8, color: 'var(--ink-mid)' }}>
                    如果你用 AI 幫你想出了一個連報告者都答不出來、但又非常有深度的「神問題」，在聆聽者學習單上打一個 ⭐。下課前老師會抽幾位分享——最棒的神問題可以加分！
                </div>
            </div>

            {/* 紙本學習單提醒 */}
            <div className="card" style={{ marginTop: 16, background: '#1a1a2e', border: 'none' }}>
                <div className="card-body" style={{ color: '#e2e8f0' }}>
                    <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>
                        <MessageCircle size={14} style={{ verticalAlign: -2 }} /> 紙本學習單提醒
                    </div>
                    <div style={{ fontSize: 12, lineHeight: 1.8, opacity: 0.85 }}>
                        <strong style={{ color: '#FDE68A' }}>報告者版：</strong>記錄 4 場被問的問題 + 你的回答 + 分享後反思 4 題<br />
                        <strong style={{ color: '#93C5FD' }}>聆聽者版：</strong>至少聽 4 組，填 4 張筆記卡 + 綜合反思 3 題<br /><br />
                        兩份都要填！A/B 輪替，每個人兩個身分都要做。
                    </div>
                </div>
            </div>

            {/* 紙本學習單預覽 */}
            <div className="card" style={{ marginTop: 16 }}>
                <div className="card-header" style={{ background: '#FEF3C7' }}>
                    <Mic size={16} /> 報告者版 — 攤位分享紀錄
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

            <div className="card" style={{ marginTop: 12 }}>
                <div className="card-header" style={{ background: '#EFF6FF' }}>
                    <BookOpen size={16} /> 聆聽者版 — 研究聆聽筆記
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

            {/* 🤖 30 秒電梯簡報 AI 練稿（開嗓前用） */}
            <details className="card" style={{ marginTop: 16, padding: 12, borderColor: 'var(--accent)', borderWidth: 2 }}>
                <summary style={{ cursor: 'pointer', fontSize: 13, fontWeight: 700, color: 'var(--accent)' }}>
                    🎤 30 秒電梯簡報 AI 練稿（緊張的話打開）
                </summary>
                <div style={{ marginTop: 10, fontSize: 12, color: 'var(--ink-mid)', lineHeight: 1.7 }}>
                    <p>把研究丟給 AI，請它扮演聽眾打回票——你才知道哪些話會卡耳朵。</p>
                    <pre style={{ background: '#0F172A', color: '#E2E8F0', fontSize: 11, padding: 10, borderRadius: 6, marginTop: 8, whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>{`我要做 30 秒電梯簡報，研究是：
- 題目：___
- 用什麼方法：___
- 主要發現一句話：___
- 限制一句話：___

請扮演路過攤位 30 秒的同學/家長，告訴我：
1. 哪一句話聽不懂或被你跳過？
2. 我這 30 秒最想讓你記住的一件事是什麼？(看你能不能抓對)
3. 給我一個更吸睛的開場句（不超過 10 個字）。`}</pre>
                    <p style={{ fontStyle: 'italic', color: 'var(--ink-light)', marginTop: 8 }}>💡 AI 的開場句是參考——上台還是用你自己順口的版本。</p>
                </div>
            </details>

            {/* 🎯 學期 AI 協作反思（最後一次 AIRED） */}
            <div className="card" style={{ marginTop: 16, padding: 16, background: '#FEF3C7', borderColor: '#D97706', borderWidth: 2 }}>
                <p style={{ fontSize: 14, fontWeight: 700, color: '#92400E', marginBottom: 6 }}>🎯 學期 AI 協作反思（最後一份紀錄）</p>
                <p style={{ fontSize: 12, color: '#78350F', lineHeight: 1.7, marginBottom: 10 }}>
                    這 17 週你跟 AI 共事很多次。回頭看：你跟 AI 的關係是怎麼變化的？AI-RED 公約對你來說從「規則」變成什麼？這份反思會比任何成績單都更說明你學到了什麼。
                </p>
                <ThinkRecord
                    dataKey="w17-ai-reflection"
                    prompt="這學期跟 AI 協作的經驗，最讓你改變想法的是什麼？"
                    placeholder="例：我原本以為 AI 給的建議都該照單全收，但 W11 那次我的問卷被 AI 改到完全不像我自己的研究——那次之後我才真的懂『AI 給選項，人做選擇』的意思。"
                    scaffold={[
                        '我最初對 AI 的看法是…',
                        '一個讓我改變想法的具體事件：…',
                        '現在我對「人機協作」的理解是…',
                    ]}
                    rows={6}
                />
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
