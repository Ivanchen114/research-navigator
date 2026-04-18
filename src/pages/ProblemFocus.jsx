import React, { useState, useCallback, useEffect } from 'react';
import CourseArc from '../components/ui/CourseArc';
import ThinkRecord from '../components/ui/ThinkRecord';
import ThinkChoice from '../components/ui/ThinkChoice';
import StepEngine from '../components/ui/StepEngine';
import HeroBlock from '../components/ui/HeroBlock';
import ExportButton from '../components/ui/ExportButton';
import CopyButton from '../components/ui/CopyButton';
import { readRecords } from '../components/ui/ThinkRecord';
import { Map } from 'lucide-react';
import LessonMap from '../components/ui/LessonMap';
import { W2Data } from '../data/lessonMaps';
import './ProblemFocus.css';

/* ── 資料常數 ── */

const FOUR_STEPS = [
    {
        step: 'STEP 1', name: '覺察現象', who: 'human', whotxt: '⚠️ 只有人能做',
        how: '像攝影機一樣，具體描述你看到的畫面。不解釋，只描述。',
        ex: '段考前圖書館閱覽室爆滿，連地板都坐人；旁邊的借書區和書架區空無一人，連燈都沒開全。',
    },
    {
        step: 'STEP 2', name: '發現落差', who: 'both', whotxt: '人主導，AI 可協助',
        how: '這裡有什麼矛盾？哪裡怪怪的？「應該是⋯但實際上⋯」',
        ex: '圖書館的核心存在應該是「借閱書籍」，但段考期間它變成了只有桌椅功能、沒有閱讀功能的大型K書房。大家湧向圖書館，卻完全不碰最珍貴的資源：書。',
    },
    {
        step: 'STEP 3', name: '鎖定核心疑問', who: 'human', whotxt: '⚠️ 你的好奇心，白話說',
        how: '從矛盾裡，你最想搞清楚的那一件事是什麼？白話文，不管格式。',
        ex: '「既然只是要桌子，為什麼大家不去空教室或咖啡廳，非要擠在一個充滿自己不讀的書的地方？」',
    },
    {
        step: 'STEP 4', name: '探究意圖', who: 'ai', whotxt: '第二節 · AI 協助翻譯',
        how: '把白話疑問套上學術研究句型。第二節課重點。',
        ex: '【A型】我想探究「考試壓力」如何影響學生對「圖書館空間使用」的選擇。',
    },
];

const ABC_TYPES = [
    { l: 'A', t: '影響型', p: '「A 如何影響 B？」', m: '📋 問卷 / 🧪 實驗', e: '例：「考試壓力如何影響圖書館空間選擇？」' },
    { l: 'B', t: '比較型', p: '「A 和 B 有什麼不同？」', m: '📋 問卷 / 📚 資料分析', e: '例：「考前 vs 考後，圖書館使用者行為有何不同？」' },
    { l: 'C', t: '深究型', p: '「A 背後的原因是什麼？」', m: '🎤 訪談 / 👀 觀察', e: '例：「學生選圖書館K書而非空教室的心理原因是什麼？」' },
];

const AIRED_FIELDS = [
    { l: 'A', w: 'Ascribe\n歸屬說明', v: '用了哪個 AI 工具？做什麼用？（ChatGPT / Claude / Gemini…）' },
    { l: 'I', w: 'Inquire\n提問紀錄', v: '把你用過的 Prompt（包括追問）都貼上來，不要只貼最後一次。' },
    { l: 'R', w: 'Reference\n引用標註', v: 'AI 生成內容不需查來源，填「無（AI 生成）」即可。' },
    { l: 'E', w: 'Evaluate\n評估判斷', v: 'AI 給的建議合理嗎？哪裡需要修正？你的判斷寫在這裡。' },
    { l: 'D', w: 'Document\n歷程記錄', v: '保存對話名稱或連結。Gemini 可匯出成 Google 文件直接存雲端。' },
];

const PROMPT_GAP = `我觀察到一個現象：[請貼上你的現象]

請幫我從 5 個不同角度，找出這個現象中可能的「矛盾」或「奇怪之處」。
（例如：時間對比、空間對比、行為對比、群體對比、邏輯矛盾）

請給我 5 個不同的矛盾點，每個用一句話說明。`;

const PROMPT_INTENT = `我觀察到：[你的現象]
發現落差：[你最終決定的落差]
我最想搞清楚的核心疑問是：[你的白話疑問]

請幫我把這個白話疑問，轉化為 3 種不同專業研究方向的「探究意圖」：

A. 影響型（某因素如何影響某結果）
B. 比較型（兩種對象/情境的差異）
C. 深究型（某現象的運作機制/背後原因）

每個方向請用一句話說明，並標註適合的研究方法。`;

const EXPORT_FIELDS = [
    { key: 'w2-step1-phenomenon', label: 'Step 1 現象', question: '像攝影機一樣，你看到了什麼？（至少 30 字）' },
    { key: 'w2-step2-gap', label: 'Step 2 落差', question: '哪裡跟你想的不一樣？矛盾在哪？' },
    { key: 'w2-step3-question', label: 'Step 3 核心疑問', question: '你最想搞清楚的那一件事，白話說' },
    { key: 'w2-ai-gap-choice', label: 'AI 落差擴充：我的選擇', question: 'AI 給了 5 個落差，你選了哪一個？為什麼？' },
    { key: 'w2-abc-judgment', label: 'ABC 型判斷', question: '你判斷是哪一型？為什麼？' },
    { key: 'w2-final-intent', label: '最終探究意圖', question: '你的最終探究意圖（帶去 W3 的版本）' },
    { key: 'w2-aired-record', label: 'AI-RED 記錄', question: '用了什麼 AI、問了什麼、你的評估' },
];

/* ── 主組件 ── */

export const ProblemFocus = () => {
    const [showLessonMap, setShowLessonMap] = useState(false);

    /* W1 生活觀察帶入 */
    const [w1Observe, setW1Observe] = useState('');
    useEffect(() => {
        const records = readRecords();
        setW1Observe(records['w1-life-observe'] || '');
    }, []);

    // 追蹤選擇題結果（供匯出用）
    const [choiceResults, setChoiceResults] = useState([]);
    const trackChoice = useCallback((question, selected, correct) => {
        setChoiceResults(prev => {
            const existing = prev.findIndex(c => c.question === question);
            const entry = { question, selected, correct };
            if (existing >= 0) {
                const next = [...prev];
                next[existing] = entry;
                return next;
            }
            return [...prev, entry];
        });
    }, []);

    return (
        <div className="page-container animate-in-fade-slide">

            {/* TOP BAR */}
            <div className="flex items-center justify-between border-b border-[#dddbd5] pb-4 mb-16">
                <div className="text-[11px] font-mono text-[#8888aa] flex items-center gap-2">
                    研究方法與專題 / 識能探索 / <span className="text-[#1a1a2e] font-bold">問題意識 W2</span>
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
                    <LessonMap data={W2Data} />
                </div>
            )}

            {/* PAGE HEADER — Hero Block */}
            <HeroBlock
                kicker="R.I.B. 調查檔案 · 研究方法與專題 · W2"
                title="問題意識的覺醒："
                accentTitle="把好奇心變成好問題"
                subtitle="「為什麼」是爛問題——太大、太空、太發散。今天你要學四段式思考框架。第一節靠自己，第二節用 AI 協助翻譯。"
                meta={[
                    { label: '本週任務', value: '練「品味」' },
                    { label: '時長', value: '100 MINS' },
                    { label: '課堂產出', value: '探究意圖（初稿）' },
                    { label: '下週預告', value: '題目健檢 W3' },
                ]}
            />
            <CourseArc items={W2Data.courseArc} />

            {/* 本週簡報 */}
            <div className="flex justify-end mb-8 -mt-2">
                <a
                    href="https://canva.link/ag9uchyk20tau82"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold tracking-wider text-[#8888aa] hover:text-[#1a1a2e] bg-[#f8f7f4] hover:bg-[#f0ede6] border border-[#dddbd5] hover:border-[#1a1a2e]/20 px-3 py-1.5 rounded-[5px] transition-all"
                >
                    📊 本週簡報 ↗
                </a>
            </div>

            {/* ══════════ STEP ENGINE ══════════ */}
            <StepEngine
              weekCode="R.I.B. · W2"
              prevWeek={{ label: '回 W1 模仿遊戲', to: '/w1' }}
              nextWeek={{ label: '前往 W3 題目健檢', to: '/w3' }}
              steps={[

                /* ──────── Step 1: 觀念建立 ──────── */
                {
                    title: '觀念建立',
                    icon: '🔬',
                    content: (
                        <div className="flex flex-col gap-8 prose-zh">
                            <div>
                                <div className="text-[10px] font-mono text-[var(--ink-light)] uppercase tracking-[0.1em] mb-3">PART 1 · 認識四段式思考框架</div>
                                <h3 className="font-serif text-[22px] md:text-[24px] font-bold text-[var(--ink)] mb-4 leading-[1.4]">「為什麼」是爛問題</h3>
                                <p className="text-[15px] md:text-[16px] text-[var(--ink-mid)] leading-[1.85]">
                                    研究不是問十萬個為什麼，而是有層次地把畫面變成學術問題。
                                </p>
                            </div>

                            {/* 爛問題示範 — 白底 + 左側紅框，降低整塊彩度 */}
                            <div className="bg-white border border-[var(--border)] border-l-[3px] border-l-[var(--danger)] rounded-[8px] p-5 md:p-6">
                                <div className="text-[11px] font-mono uppercase tracking-[0.12em] text-[var(--danger)] mb-3">
                                    先打破這個習慣
                                </div>
                                <p className="text-[15px] md:text-[16px] text-[var(--ink)] leading-[1.85] mb-4">
                                    「<strong className="text-[var(--danger)]">為什麼圖書館人很多？</strong>」— 爛問題。
                                </p>
                                <p className="text-[14px] md:text-[15px] text-[var(--ink-mid)] leading-[1.85] mb-4">
                                    → 因為要讀書！→ 因為有冷氣！→ 因為要考試！<br />
                                    都對，但你要研究什麼？不知道。問了等於沒問。
                                </p>
                                <p className="text-[14px] md:text-[15px] text-[var(--ink-mid)] leading-[1.85] m-0">
                                    爛問題的特徵：<strong className="text-[var(--ink)]">太大、太空、太發散</strong>。今天你要學怎麼改掉它。
                                </p>
                            </div>

                            {/* 四段式思考框架表格 */}
                            <div style={{ fontFamily: '"DM Mono", monospace', fontSize: '10px', color: 'var(--ink-light)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '-14px' }}>四段式思考框架 · 圖書館示範案例</div>
                            <table className="w2-fw-table">
                                <thead>
                                    <tr>
                                        <th style={{ width: '170px' }}>步驟</th>
                                        <th style={{ width: '200px' }}>怎麼想</th>
                                        <th>範例（圖書館案例）</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {FOUR_STEPS.map((row, i) => (
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

                            {/* ABC 三種句型 */}
                            <div style={{ fontFamily: '"DM Mono", monospace', fontSize: '10px', color: 'var(--ink-light)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '-14px' }}>Step 4 的三種探究句型（ABC 型）</div>
                            <div className="w2-abc-row">
                                {ABC_TYPES.map(card => (
                                    <div className="w2-abc-col" key={card.l}>
                                        <div className="w2-abc-letter">{card.l}</div>
                                        <div className="w2-abc-type">{card.t}</div>
                                        <div className="w2-abc-pattern">{card.p}</div>
                                        <div className="w2-abc-method">{card.m}</div>
                                        <div className="w2-abc-example">{card.e}</div>
                                    </div>
                                ))}
                            </div>

                            <div className="w2-notice" style={{ margin: 0 }}>
                                💡 拿著你的核心疑問問自己：你最想知道的是「影響」、「差異」還是「原因」？這個判斷由你來做，不准問 AI！
                            </div>

                            {/* 理解檢核 */}
                            <ThinkChoice
                                prompt="小測驗：「段考前後，學生使用圖書館的方式有何不同？」這屬於哪一型？"
                                options={[
                                    { label: 'A', text: '影響型 — 某因素如何影響某結果' },
                                    { label: 'B', text: '比較型 — 兩種情境的差異' },
                                    { label: 'C', text: '深究型 — 某現象背後的原因' },
                                ]}
                                answer="B"
                                feedback="「段考前 vs 段考後」是兩種情境的比較，關鍵詞是「有何不同」。影響型會問「考試壓力如何影響⋯」，深究型會問「為什麼學生要⋯」。"
                                onAnswer={(selected, correct) => trackChoice('ABC句型判斷', selected, correct)}
                            />
                        </div>
                    ),
                },

                /* ──────── Step 2: 人腦練習 ──────── */
                {
                    title: '人腦練習',
                    icon: '🧠',
                    content: (
                        <div className="flex flex-col gap-8 prose-zh">
                            <div>
                                <div className="text-[10px] font-mono text-[var(--ink-light)] uppercase tracking-[0.12em] mb-3">PART 2 · 第一節課 · 禁止使用 AI</div>
                                <h3 className="font-serif text-[22px] md:text-[24px] font-bold text-[var(--ink)] mb-4 leading-[1.4]">從觀察到核心疑問（人自己做）</h3>
                                <p className="text-[15px] md:text-[16px] text-[var(--ink-mid)] leading-[1.85]">
                                    先練手感：跟著老師投影的圖片做兩輪快速練習，再改寫你 W1 的觀察。全程人腦，不准碰 AI。
                                </p>
                            </div>

                            {/* 圖片練習 1 & 2 */}
                            <div className="w2-practice-block" style={{ margin: 0 }}>
                                <div className="w2-practice-header">
                                    <span className="w2-practice-badge w2-pb-human">人腦</span>
                                    <span className="w2-practice-title">圖片轉化戰（練習 1 & 2）</span>
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

                            {/* 練習 0：核心！ */}
                            {w1Observe && (
                                <div style={{ background: 'var(--accent-light)', border: '1px solid color-mix(in srgb, var(--accent) 20%, transparent)', borderRadius: '10px', padding: '16px 20px', display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '0' }}>
                                    <span style={{ fontSize: '16px' }}>📎</span>
                                    <div>
                                        <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>W1 你的生活觀察種子</div>
                                        <p style={{ fontSize: '13px', color: 'var(--ink)', lineHeight: '1.6', fontWeight: 500 }}>{w1Observe}</p>
                                        <p style={{ fontSize: '11px', color: 'var(--ink-light)', marginTop: '4px' }}>用四段式思考，把這個觀察升級成下面的三步。</p>
                                    </div>
                                </div>
                            )}
                            <div className="w2-practice-block" style={{ margin: 0, border: '2px solid var(--danger)' }}>
                                <div className="w2-practice-header" style={{ background: 'var(--danger-light)', borderColor: 'var(--danger)' }}>
                                    <span className="w2-practice-badge w2-pb-star">最重要</span>
                                    <span className="w2-practice-title">練習 0：改寫你的 W1 觀察</span>
                                    <span className="w2-practice-sub">⭐ 後面所有步驟的起點</span>
                                </div>
                                <div className="w2-practice-body">
                                    拿出 W1 你寫的那個生活現象，用四段式思考的<strong>前三步</strong>重新寫一遍。
                                    <div className="w2-notice warn" style={{ marginTop: '12px' }}>⏰ 給你 10 分鐘。這階段不准用 AI，先靠自己的觀察和感受。</div>
                                </div>
                            </div>

                            <ThinkRecord
                                dataKey="w2-step1-phenomenon"
                                prompt="Step 1 現象：像攝影機一樣，你看到了什麼？（至少 30 字）"
                                placeholder="描述你觀察到的具體畫面，不解釋，只描述…"
                                scaffold={['在（地點），我看到…', '具體來說…', '（時間/頻率）…']}
                                rows={3}
                            />
                            <ThinkRecord
                                dataKey="w2-step2-gap"
                                prompt="Step 2 落差：哪裡跟你想的不一樣？矛盾在哪？"
                                placeholder="這裡有什麼矛盾？應該是…但實際上…"
                                scaffold={['應該是…但實際上…', '奇怪的是…', '照理說…卻…']}
                                rows={3}
                            />
                            <ThinkRecord
                                dataKey="w2-step3-question"
                                prompt="Step 3 核心疑問：你最想搞清楚的那一件事，白話說"
                                placeholder="不管格式，白話說出來就好…"
                                scaffold={['我最想搞清楚的是…', '到底是因為…還是…']}
                                rows={2}
                            />
                        </div>
                    ),
                },

                /* ──────── Step 3: AI 協作 ──────── */
                {
                    title: 'AI 協作',
                    icon: '🤖',
                    content: (
                        <div className="flex flex-col gap-8 prose-zh">
                            <div>
                                <div className="text-[10px] font-mono text-[var(--ink-light)] uppercase tracking-[0.12em] mb-3">PART 2.5 + PART 3 · 第二節課</div>
                                <h3 className="font-serif text-[22px] md:text-[24px] font-bold text-[var(--ink)] mb-4 leading-[1.4]">AI 當放大鏡，你當眼睛</h3>
                                <p className="text-[15px] md:text-[16px] text-[var(--ink-mid)] leading-[1.85]">
                                    AI 沒去過你的學校，觀察只能靠人。但它可以從多角度幫你找矛盾，還能把白話文翻譯成學術句型。
                                </p>
                            </div>

                            {/* 落差擴充器 */}
                            <div className="w2-practice-block" style={{ margin: 0 }}>
                                <div className="w2-practice-header">
                                    <span className="w2-practice-badge w2-pb-ai">AI 協作</span>
                                    <span className="w2-practice-title">落差擴充器</span>
                                    <span className="w2-practice-sub">AI 給選項，你做判斷</span>
                                </div>
                                <div className="w2-practice-body">
                                    把 Step 2 寫好的現象貼進去，讓 AI 幫你從多角度找矛盾：

                                    <div className="prompt-box">
                                        <div className="prompt-hd">
                                            <span>PROMPT · 落差擴充器</span>
                                            <CopyButton text={PROMPT_GAP} label="複製" />
                                        </div>
                                        <div className="prompt-body">
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

                            <ThinkRecord
                                dataKey="w2-ai-gap-choice"
                                prompt="AI 給了 5 個落差，你最終選了哪一個？為什麼？（如果都不對，寫「用我自己的」）"
                                placeholder="我選了第___個，因為…"
                                scaffold={['我選第___個', '因為我真的觀察到…', '這個矛盾讓我想深究…']}
                                rows={2}
                            />

                            {/* 分隔 */}
                            <div className="w-full h-px bg-[var(--border)]" />

                            {/* 探究意圖生成器 */}
                            <div className="w2-practice-block" style={{ margin: 0 }}>
                                <div className="w2-practice-header">
                                    <span className="w2-practice-badge w2-pb-ai">AI 協作</span>
                                    <span className="w2-practice-title">探究意圖生成器</span>
                                    <span className="w2-practice-sub">完成 Step 4</span>
                                </div>
                                <div className="w2-practice-body">
                                    <div className="w2-notice warn" style={{ marginBottom: '12px' }}>
                                        ★ <strong>先做判斷，不准用 AI！</strong>看著你的核心疑問，自己判斷是 A / B / C 型。
                                    </div>

                                    判斷好之後，把現象、落差、核心疑問都填進下方 Prompt，請 AI 翻譯成三種方向，然後<strong>你選一個</strong>。

                                    <div className="prompt-box">
                                        <div className="prompt-hd">
                                            <span>PROMPT · 探究意圖生成器</span>
                                            <CopyButton text={PROMPT_INTENT} label="複製" />
                                        </div>
                                        <div className="prompt-body">
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
                                </div>
                            </div>

                            <ThinkRecord
                                dataKey="w2-abc-judgment"
                                prompt="你自己判斷是哪一型？為什麼？（在 AI 翻譯之前先填）"
                                placeholder="我判斷是 ___ 型，因為我最想知道的是…"
                                scaffold={['我判斷是___型', '因為我最想知道的是「影響/差異/原因」']}
                                rows={2}
                            />

                            <ThinkChoice
                                prompt="小測驗：AI 在「四段式思考」中可以幫忙哪些步驟？"
                                options={[
                                    { label: 'A', text: 'Step 1 + Step 2（觀察現象和發現落差）' },
                                    { label: 'B', text: 'Step 2 + Step 4（擴充落差和翻譯句型）' },
                                    { label: 'C', text: '全部四個步驟都可以交給 AI' },
                                ]}
                                answer="B"
                                feedback="Step 1 觀察現象只有人能做（AI 沒去過你的學校），Step 3 核心疑問是你的好奇心。AI 能幫的是 Step 2 從多角度找矛盾，以及 Step 4 把白話翻譯成學術句型。"
                                onAnswer={(selected, correct) => trackChoice('AI 可幫忙的步驟', selected, correct)}
                            />
                        </div>
                    ),
                },

                /* ──────── Step 4: 最終探究意圖 ──────── */
                {
                    title: '探究意圖',
                    icon: '🎯',
                    content: (
                        <div className="flex flex-col gap-8 prose-zh">
                            <div>
                                <div className="text-[10px] font-mono text-[var(--ink-light)] uppercase tracking-[0.12em] mb-3">PART 3 FINAL · 定案 + AI-RED</div>
                                <h3 className="font-serif text-[22px] md:text-[24px] font-bold text-[var(--ink)] mb-4 leading-[1.4]">選定你的研究方向</h3>
                                <p className="text-[15px] md:text-[16px] text-[var(--ink-mid)] leading-[1.85]">
                                    AI 給了三種方向，現在由你選一個——選擇的標準是：做得到、有興趣、方向清楚。選完記得填 AI-RED。
                                </p>
                            </div>

                            <ThinkRecord
                                dataKey="w2-final-intent"
                                prompt="你的最終探究意圖（寫完整句子，這是你帶去 W3 的版本）"
                                placeholder="我想探究「___」如何影響/比較/深究「___」…"
                                scaffold={['我想探究「___」如何影響「___」', '我想比較「___」和「___」的差異', '我想深究「___」背後的原因']}
                                rows={3}
                            />

                            {/* AI-RED 記錄表 */}
                            <div style={{ fontFamily: '"DM Mono", monospace', fontSize: '10px', color: 'var(--ink-light)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>AI-RED 記錄</div>
                            <div className="w2-aired-table">
                                {AIRED_FIELDS.map(row => (
                                    <div className="w2-aired-row-item" key={row.l}>
                                        <div className="w2-aired-key">
                                            <span className="w2-aired-letter">{row.l}</span>
                                            <div className="w2-aired-word" style={{ whiteSpace: 'pre-line' }}>{row.w}</div>
                                        </div>
                                        <div className="w2-aired-val">{row.v}</div>
                                    </div>
                                ))}
                            </div>

                            <ThinkRecord
                                dataKey="w2-aired-record"
                                prompt="把你的 AI-RED 記錄寫在這裡（用了什麼 AI、問了什麼 Prompt、你的評估）"
                                placeholder="A: 我用了 ChatGPT，做落差擴充和探究意圖翻譯。\nI: 我問了…\nR: 無（AI 生成）。\nE: AI 給的建議大致合理，但…\nD: 最終我選了…"
                                scaffold={['A: 我用了___', 'I: 我問了___', 'E: AI 的建議___', 'D: 最終我選了___']}
                                rows={6}
                            />
                        </div>
                    ),
                },

                /* ──────── Step 5: 回顧與繳交 ──────── */
                {
                    title: '回顧與繳交',
                    icon: '📋',
                    content: (
                        <div className="flex flex-col gap-8 prose-zh">
                            <div>
                                <div className="text-[10px] font-mono text-[var(--ink-light)] uppercase tracking-[0.12em] mb-3">WRAP-UP</div>
                                <h3 className="font-serif text-[22px] md:text-[24px] font-bold text-[var(--ink)] mb-4 leading-[1.4]">本週結束，你應該要會</h3>
                            </div>

                            <div className="bg-white border border-[var(--border)] rounded-[var(--radius-unified)] overflow-hidden">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-[1px] bg-[var(--border)]">
                                    {[
                                        '說出「為什麼」是爛問題的原因，並用四段式框架改造它',
                                        '區分 A / B / C 三種探究句型，知道各自對應什麼研究方法',
                                        '用 AI 找落差、翻譯句型，但選擇是自己做的',
                                        '寫出最終探究意圖，下週帶去 W3 題目健檢',
                                    ].map((txt, i) => (
                                        <div key={i} className="p-5 bg-white flex items-start gap-3">
                                            <span className="text-[var(--success)] mt-0.5 text-[15px]">✓</span>
                                            <span className="text-[14px] md:text-[15px] text-[var(--ink-mid)] leading-[1.75]">{txt}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* 一鍵複製 */}
                            <ExportButton
                                weekLabel="W2 問題意識的覺醒"
                                fields={EXPORT_FIELDS}
                                choices={choiceResults}
                            />

                            <div className="p-3 rounded-[var(--radius-unified)] bg-[var(--success-light)] border border-[var(--success)]/20 text-[13px] text-[var(--ink-mid)]">
                                📤 複製後，打開 Google Classroom 貼上繳交即可。
                            </div>

                            {/* 下週預告 */}
                            <div className="next-week-preview">
                                <div className="next-week-header">
                                    <span className="next-week-badge">NEXT WEEK</span>
                                    <h3 className="next-week-title">W3 預告</h3>
                                </div>
                                <div className="next-week-content">
                                    <div className="next-week-col">
                                        <div className="next-week-label">W3 主題</div>
                                        <p className="next-week-text">題目健檢——診斷 8 種爛題目、5W1H 規格化、可行性快篩、AI 優化成專業版本。</p>
                                    </div>
                                    <div className="next-week-col">
                                        <div className="next-week-label">你要帶來</div>
                                        <p className="next-week-text"><strong className="text-white">你的最終探究意圖</strong>——那就是下週的「病人」，沒有帶就沒得健檢。</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ),
                },

            ]} />
        </div>
    );
};
