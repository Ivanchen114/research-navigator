import React, { useState, useCallback, useEffect } from 'react';
import CourseArc from '../components/ui/CourseArc';
import ThinkRecord from '../components/ui/ThinkRecord';
import ThinkChoice from '../components/ui/ThinkChoice';
import StepEngine from '../components/ui/StepEngine';
import HeroBlock from '../components/ui/HeroBlock';
import ExportButton from '../components/ui/ExportButton';
import ResetWeekButton from '../components/ui/ResetWeekButton';
import CopyButton from '../components/ui/CopyButton';
import { readRecords } from '../components/ui/ThinkRecord';
import {
    Map,
    CheckCircle2,
    Users2,
    Lightbulb,
    MessageSquare,
    Brain,
} from 'lucide-react';
import LessonMap from '../components/ui/LessonMap';
import { W4Data } from '../data/lessonMaps';

/* ── 資料常數 ── */

const W5H1_ITEMS = [
    { w: 'Who', l: '對象', q: '研究的是誰？要具體到一個可接觸的群體。' },
    { w: 'Where', l: '場域', q: '在哪個地點或範圍內進行？' },
    { w: 'What', l: '變項', q: '核心概念是什麼？要能測量。' },
    { w: 'When', l: '時間', q: '有特定的時間點或情境嗎？' },
    { w: 'How', l: '方法', q: '用問卷？訪談？觀察？文獻？實驗？' },
];

const COLLAB_STEPS_OWN = [
    { n: '1', t: '修改初稿', d: '寫出你 5W1H 修改後的題目。', s: 'step-human' },
    { n: '2', t: '問 AI 診斷', d: '讓 AI 幫你做最後掃描。', s: 'step-ai' },
    { n: '3', t: '確認心意', d: '聽聽看就好，還是你做主。', s: 'step-you' },
    { n: '4', t: '要 3 個建議', d: '請 AI 給三個方向的修改建議。', s: 'step-ai' },
    { n: '5', t: '你來選', d: '選出一個方向。', s: 'step-you' },
    { n: '6', t: '機器包裝', d: '使用下方【句型優化器】產生專業標題。', s: 'step-ai' },
    { n: '7', t: '定案！', d: '產出你的【W4 專題定案題目】，帶進海報。', s: 'step-you step-green', badge: '帶入海報' },
];

const TITLE_PROMPT = `我的研究題目初稿是：【請貼上你的初稿】

請幫我優化成更專業的版本：
1. 加上學術量化或質性動作（如：探討、相關性、差異分析、影響）
2. 讓 Who(研究對象) / What(研究變數) 描述更精確
3. 確保高中生可以執行，字數不要過長

請給我 3 個優化版本。`;

const POSTER_PROMPT = `我的研究海報需要以下元素：
- 研究題目：【貼上 W3 定案題目】
- 吸引人的標題草稿：【貼上你的草稿】
- 預期發現草稿：【貼上你的預測】

請幫我：
1. 優化標題，讓它更吸引高中生，保持白話但加一點懸疑感
2. 把預期發現改寫得更有研究感（加入「可能」「推測」等詞）
3. 給我 2 個版本讓我選

請保持在我原本的研究範圍內，不要幫我改題目方向。`;

const POSTER_FIELDS = [
    { n: '①', l: '吸引人的標題', d: '口語問句，讓人一眼停下來' },
    { n: '②', l: '正式研究題目', d: 'W3 定案版本（副標）' },
    { n: '③', l: '研究動機', d: '為什麼想研究這個？' },
    { n: '④', l: '製作人資訊', d: '姓名 / 班級 / 座號' },
];

const EXPORT_FIELDS = [
    { key: 'w4-5w1h-who', label: '5W1H — Who（對象）', question: '研究的是誰？要具體到一個可接觸的群體。' },
    { key: 'w4-5w1h-where', label: '5W1H — Where（場域）', question: '在哪個地點或範圍內進行？' },
    { key: 'w4-5w1h-what', label: '5W1H — What（變項）', question: '核心概念是什麼？要能測量。' },
    { key: 'w4-5w1h-when', label: '5W1H — When（時間）', question: '有特定的時間點或情境嗎？' },
    { key: 'w4-5w1h-how', label: '5W1H — How（方法）', question: '用問卷？訪談？觀察？文獻？實驗？' },
    { key: 'w4-initial-topic', label: 'AI 包裝後的定案題目', question: '經過 AI 句型優化後，你帶進海報的題目是什麼？' },
    { key: 'w4-aired-record', label: 'AI-RED 記錄', question: '這次 AI 協作中，你的 AI-RED 五欄分別記了什麼？' },
    { key: 'w4-motivation-raw', label: '白話版動機（自己寫的）', question: '用跟朋友聊天的方式，說說你為什麼想研究這個題目？' },
    { key: 'w4-title-draft', label: '標題草稿', question: '用口語問句寫一個吸引人的標題' },
    { key: 'w4-prediction', label: '預期發現', question: '你預測這個研究可能發現什麼？大膽猜 2-3 個' },
    { key: 'w4-feedback-accept', label: 'Gallery Walk：我接受的建議', question: '同學給的建議中，你接受了哪些？怎麼改？' },
    { key: 'w4-feedback-reject', label: 'Gallery Walk：我不接受的建議', question: '你不採納哪些建議？理由是？' },
    { key: 'w4-final-topic', label: 'W4 最終定案題目', question: '經過壓力測試後，你的最終定案題目是什麼？' },
    { key: 'w4-final-motivation', label: 'W4 最終研究動機', question: '你的最終研究動機是什麼？' },
];

/* ── 主組件 ── */

export const W4Page = () => {
    const [showLessonMap, setShowLessonMap] = useState(false);
    const [choiceResults, setChoiceResults] = useState([]);

    /* 帶入上週題目：優先 W3 最終定案（w3-final-topic），退回 W2 最終探究意圖 */
    const [w2Intent, setW2Intent] = useState('');
    const [w2Source, setW2Source] = useState('w2'); // 'w3' | 'w2'
    useEffect(() => {
        const records = readRecords();
        const w3Final = (records['w3-final-topic'] || '').trim();
        const w2Final = (records['w2-final-intent'] || '').trim();
        if (w3Final) {
            setW2Intent(w3Final);
            setW2Source('w3');
        } else {
            setW2Intent(w2Final);
            setW2Source('w2');
        }
    }, []);

    const trackChoice = useCallback((question, selected, correct) => {
        setChoiceResults(prev => {
            const idx = prev.findIndex(c => c.question === question);
            const entry = { question, selected, correct };
            if (idx >= 0) { const next = [...prev]; next[idx] = entry; return next; }
            return [...prev, entry];
        });
    }, []);

    /* ── 五個步驟 ── */

    const steps = [
        /* ──────────────────────────────────────
         * STEP 1: 5W1H 規格化 + AI 包裝
         * ────────────────────────────────────── */
        {
            title: '5W1H 規格化',
            icon: '🔪',
            content: (
                <div className="space-y-10 prose-zh">
                    {/* W1-W4 旅程回顧 */}
                    <div>
                        <div className="section-head"><h2>從 W3 到 W4</h2><div className="line"></div><span className="mono">WARM-UP</span></div>
                        <p className="section-desc">
                            W3 你學會了診斷 8 種爛題型。但光會挑毛病不夠——今天要把你自己的題目切開、規格化、讓 AI 包裝，再做成海報接受同學的壓力測試。
                        </p>

                        <div className="content-grid mb-8" style={{ '--cols': 4 }}>
                            {[
                                { wk: 'W1', icon: '👀', title: '找到畫面', desc: '什麼讓你好奇？', past: true },
                                { wk: 'W2', icon: '❓', title: '形成問題', desc: '把畫面轉成問題', past: true },
                                { wk: 'W3', icon: '🏥', title: '題目健檢', desc: '診斷病症 + AI 練手', past: true },
                                { wk: 'W4', icon: '🎯', title: '定案 + 壓測', desc: '5W1H → 海報 → Gallery Walk', now: true },
                            ].map(item => (
                                <div key={item.wk} className={`p-5 flex flex-col gap-2 ${item.now ? 'bg-[var(--ink)] text-white' : 'bg-white'}`}>
                                    <div className={`font-mono text-xl font-bold ${item.now ? 'text-[var(--gold)]' : 'text-[var(--accent)]'}`}>{item.wk}</div>
                                    <div className="text-xl">{item.icon}</div>
                                    <div className={`font-bold text-[13px] ${item.now ? 'text-white' : 'text-[var(--ink)]'}`}>{item.title}</div>
                                    <div className={`text-[11px] leading-relaxed ${item.now ? 'text-white/60' : 'text-[var(--ink-light)]'}`}>{item.desc}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 5W1H 規格化 */}
                    <div>
                        <div className="section-head"><h2>5W1H 規格化</h2><div className="line"></div><span className="mono">不准用 AI · 15 分鐘</span></div>
                        <p className="section-desc">
                            拿出你帶進來的題目（優先 W3 最終定案，沒做 W3 就用 W2 最終探究意圖），用 5W1H 再切一次。Gallery Walk 會有人挑戰你，現在多磨一刀。
                        </p>

                        {w2Intent && (
                            <div className="bg-[var(--accent-light)] border border-[var(--accent)]/20 rounded-lg p-4 flex items-start gap-3 mb-6">
                                <span className="text-[16px]">📎</span>
                                <div>
                                    <div className="text-[11px] font-mono text-[var(--accent)] uppercase tracking-wider mb-1">
                                        {w2Source === 'w3' ? 'W3 最終定案題目（Part 5 Step 7）' : 'W2 最終探究意圖（你還沒做 W3 的 Part 5）'}
                                    </div>
                                    <p className="text-[13px] text-[var(--ink)] leading-relaxed font-medium">{w2Intent}</p>
                                    <p className="text-[11px] text-[var(--ink-light)] mt-1">
                                        {w2Source === 'w3' ? '用 5W1H 再切一次，看看通不通得過 Gallery Walk。' : '建議先回 W3 做完 Part 4+5 再來，這裡會順很多。'}
                                    </p>
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-6">
                            {W5H1_ITEMS.map(item => (
                                <div className="bg-white border border-[var(--border)] rounded-xl p-4 flex flex-col gap-2" key={item.w}>
                                    <div className="font-mono font-bold text-[var(--accent)] text-[16px]">{item.w}</div>
                                    <div className="font-bold text-[13px] text-[var(--ink)]">{item.l}</div>
                                    <div className="text-[11px] text-[var(--ink-light)] leading-relaxed">{item.q}</div>
                                </div>
                            ))}
                        </div>

                        <div className="p-4 bg-[var(--danger-light)] rounded-[6px] border border-[var(--danger)]/20 mb-6">
                            <strong className="text-[var(--danger)] text-[13px] block mb-2">⚡ 殘酷的可行性快篩</strong>
                            <p className="text-[12px] text-[var(--ink-mid)]">檢查你選的方法做不做得到：發得完問卷嗎？約得到人訪談嗎？有設備做實驗嗎？只要一項不行，馬上退件重修。</p>
                        </div>

                        <div className="space-y-3">
                            <div className="text-[12px] font-bold font-mono text-[var(--ink-light)] tracking-wider mb-1">✏️ 把你的題目切開填入</div>
                            {W5H1_ITEMS.map(item => (
                                <ThinkRecord
                                    key={item.w}
                                    dataKey={`w4-5w1h-${item.w.toLowerCase()}`}
                                    prompt={`${item.w}（${item.l}）${item.w === 'When' ? '　⸺ 選填' : ''}`}
                                    placeholder={item.q}
                                    rows={1}
                                />
                            ))}
                        </div>
                    </div>

                    {/* AI 最終協作 */}
                    <div>
                        <div className="section-head"><h2>AI 句型包裝</h2><div className="line"></div><span className="mono">15 分鐘</span></div>
                        <p className="section-desc">
                            你的題目通過快篩了！現在請 AI 把粗糙的初稿包裝成專業學術標題，帶進下一步的海報。
                        </p>

                        <div className="border border-[var(--border)] rounded-xl overflow-hidden bg-white mb-6">
                            <div className="p-4 px-5 bg-[var(--paper-warm)] border-b border-[var(--border)] flex items-center gap-3">
                                <Brain size={15} className="text-[var(--ink)]" />
                                <span className="font-bold text-[13px] text-[var(--ink)]">AI 協作 7 步驟</span>
                            </div>
                            <div className="p-5 space-y-3">
                                {COLLAB_STEPS_OWN.map(step => (
                                    <div className="flex gap-4" key={step.n}>
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-mono font-bold text-[13px] flex-shrink-0 ${step.s.includes('step-green') ? 'bg-[var(--success)] text-white' : step.s.includes('step-ai') ? 'bg-[var(--accent-light)] text-[var(--accent)]' : 'bg-[var(--paper-warm)] text-[var(--ink)]'}`}>{step.n}</div>
                                        <div>
                                            <div className="font-bold text-[13px] text-[var(--ink)] mb-0.5 flex items-center gap-2">
                                                {step.t} {step.badge && <span className="inline-block text-[10px] font-mono font-bold bg-[var(--success)] text-white px-2 py-0.5 rounded-full">{step.badge}</span>}
                                            </div>
                                            <div className="text-[12px] text-[var(--ink-mid)] leading-relaxed">{step.d}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Prompt 句型優化器 */}
                        <div className="prompt-box mb-6">
                            <div className="prompt-hd">
                                <span>PROMPT · 句型優化器 (Step 6 用)</span>
                                <CopyButton text={TITLE_PROMPT} label="複製" />
                            </div>
                            <div className="prompt-body">
                                我的研究題目初稿是：【請貼上你的初稿】<br /><br />
                                請幫我優化成更專業的版本：<br />
                                1. 加上學術量化或質性動作（如：探討、相關性、差異分析、影響）<br />
                                2. 讓 Who(研究對象) / What(研究變數) 描述更精確<br />
                                3. 確保高中生可以執行，字數不要過長<br /><br />
                                請給我 3 個優化版本。
                            </div>
                        </div>

                        <div className="space-y-4">
                            <ThinkRecord
                                dataKey="w4-initial-topic"
                                prompt="經過 AI 句型優化後，你帶進海報的定案題目是什麼？"
                                scaffold={['我的定案題目是：…', '這個題目符合小實近易的…項']}
                                rows={3}
                            />
                            <ThinkRecord
                                dataKey="w4-aired-record"
                                prompt="這次 AI 協作中，你的 AI-RED 五欄分別記了什麼？"
                                scaffold={['A (歸屬)：我用了哪個 AI、做什麼…', 'I (提問)：我問了什麼、為什麼這樣問…', 'R (引用)：AI 給的來源是什麼？我有去查嗎？可信嗎？', 'E (評估)：AI 的回答合理嗎？有沒有錯或偏見？', 'D (記錄)：我做了什麼決策？AI 扮演什麼角色？']}
                                rows={6}
                            />
                        </div>
                    </div>
                </div>
            ),
        },

        /* ──────────────────────────────────────
         * STEP 2: 海報製作
         * ────────────────────────────────────── */
        {
            title: '海報製作',
            icon: '🎨',
            content: (
                <div className="space-y-10 prose-zh">
                    {/* 自主草稿：研究動機 + 標題草稿 */}
                    <div>
                        <div className="section-head"><h2>自主草稿</h2><div className="line"></div><span className="mono">不准用 AI · 10 分鐘</span></div>
                        <p className="section-desc">
                            拿著剛才定案的題目，靠自己寫出白話版動機和吸引人的海報標題草稿。
                        </p>

                        <ThinkRecord
                            dataKey="w4-motivation-raw"
                            prompt="用跟朋友聊天的方式，說說你為什麼想研究這個題目？"
                            scaffold={['我最早是從…注意到這件事', '讓我覺得奇怪的是…', '我最想知道的答案是…']}
                            rows={4}
                        />

                        <div className="mt-4">
                            <ThinkRecord
                                dataKey="w4-title-draft"
                                prompt="用口語問句寫一個吸引人的標題（讓路過的同學想停下來問你）"
                                placeholder="例如：滑手機真的讓你睡更差嗎？"
                                scaffold={['…真的會…嗎？', '為什麼…？', '你有沒有發現…']}
                                rows={2}
                            />
                        </div>

                        <div className="mt-4">
                            <ThinkRecord
                                dataKey="w4-prediction"
                                prompt="你預測這個研究可能發現什麼？大膽猜 2-3 個（猜錯不扣分）"
                                scaffold={['我猜最可能的結果是…', '如果出乎意料的話…', '另一個可能是…']}
                                rows={3}
                            />
                        </div>
                    </div>

                    {/* AI 優化 + 海報製作 */}
                    <div>
                        <div className="section-head"><h2>AI 優化 + 手寫海報</h2><div className="line"></div><span className="mono">15 分鐘</span></div>

                        {/* 研究動機教練 */}
                        <a
                            href="https://gemini.google.com/gem/1ujK5kRzW8QFNEtWa8F5mq0b_9JL4iDFx?usp=sharing"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-start gap-4 p-5 border border-[var(--border)] rounded-xl hover:border-[var(--accent)] hover:shadow-lg transition-all bg-white mb-4"
                        >
                            <div className="w-10 h-10 rounded-lg bg-[var(--paper-warm)] flex items-center justify-center text-xl shrink-0 group-hover:bg-[var(--accent)] transition-colors">🤖</div>
                            <div className="flex-1 min-w-0">
                                <div className="font-bold text-[var(--ink)] text-[13px] mb-0.5">研究動機教練</div>
                                <div className="text-[10px] font-mono text-[var(--ink-light)] uppercase tracking-wider mb-2">Gemini Gem · 對話式審核</div>
                                <div className="text-[12px] text-[var(--ink-mid)] leading-relaxed">幫你審核動機三要素（有畫面、有困惑、說得清楚想知道什麼），告訴你哪裡可以更強。</div>
                                <div className="mt-2 text-[11px] font-mono font-bold text-[var(--accent)]">開啟 Gemini Gem ↗</div>
                            </div>
                        </a>

                        {/* Prompt：海報文案優化 */}
                        <div className="prompt-box mb-6">
                            <div className="prompt-hd">
                                <span>PROMPT · 海報文案優化</span>
                                <CopyButton text={POSTER_PROMPT} label="複製" />
                            </div>
                            <div className="prompt-body">
                                我的研究海報需要以下元素：<br />
                                - 研究題目：【貼上 W3 定案題目】<br />
                                - 吸引人的標題草稿：【貼上你的草稿】<br />
                                - 預期發現草稿：【貼上你的預測】<br /><br />
                                請幫我：<br />
                                1. 優化標題，讓它更吸引高中生，保持白話但加一點懸疑感<br />
                                2. 把預期發現改寫得更有研究感（加入「可能」「推測」等詞）<br />
                                3. 給我 2 個版本讓我選<br /><br />
                                請保持在我原本的研究範圍內，不要幫我改題目方向。
                            </div>
                        </div>

                        <div className="notice notice-accent text-[12px] mb-6">
                            ⚠️ AI 的角色是幫你把已經想好的東西<strong>說得更好聽</strong>，不是幫你重新想。如果 AI 改了你的研究方向，告訴它：「請不要改我的範圍，只優化表達方式。」
                        </div>

                        {/* 海報四格 */}
                        <div className="text-[12px] font-bold font-mono text-[var(--ink-light)] mb-2 tracking-wider">海報必備四格</div>
                        <div className="content-grid mb-4" style={{ '--cols': 4 }}>
                            {POSTER_FIELDS.map((item, i) => (
                                <div key={item.n} className={`p-5 flex flex-col gap-2 ${i === 3 ? 'bg-[var(--ink)] text-white' : 'bg-[var(--paper)]'}`}>
                                    <div className={`font-mono text-xl font-bold ${i === 3 ? 'text-[var(--gold)]' : 'text-[var(--accent)]'}`}>{item.n}</div>
                                    <div className={`font-bold text-[13px] ${i === 3 ? 'text-white' : 'text-[var(--ink)]'}`}>{item.l}</div>
                                    <div className={`text-[11px] leading-relaxed ${i === 3 ? 'text-white/50' : 'text-[var(--ink-light)]'}`}>{item.d}</div>
                                </div>
                            ))}
                        </div>

                        {/* 範例海報 */}
                        <div className="border border-[var(--border)] rounded-xl overflow-hidden bg-white">
                            <div className="p-3 px-4 bg-[var(--paper-warm)] border-b border-[var(--border)] text-[11px] font-mono text-[var(--ink-light)] tracking-wider">
                                範例海報（同學真實作品）
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                                <div className="flex flex-col items-center gap-2">
                                    <div className="border border-[var(--border)] rounded-xl overflow-hidden w-full">
                                        <img src="/images/user_research_poster.png" alt="同學手寫海報範例" className="w-full object-cover" />
                                    </div>
                                    <div className="text-[10px] font-mono text-[var(--ink-light)]">▲ 實體手寫版</div>
                                </div>
                                <div className="flex flex-col items-center gap-2">
                                    <div className="border border-[var(--border)] rounded-xl overflow-hidden bg-white w-full">
                                        <div className="p-5 space-y-3">
                                            <div>
                                                <div className="text-[10px] font-mono text-[var(--ink-light)] uppercase mb-1">① 標題</div>
                                                <div className="font-bold text-[18px] leading-tight text-[var(--ink)]">「機」不可失眠——<br />滑手機真的讓你睡更差嗎？</div>
                                            </div>
                                            <div>
                                                <div className="text-[10px] font-mono text-[var(--ink-light)] uppercase mb-1">② 正式題目</div>
                                                <div className="text-[12px] text-[var(--ink-mid)]">本校高一生睡前手機使用內容類型與睡眠品質之差異研究</div>
                                            </div>
                                            <div>
                                                <div className="text-[10px] font-mono text-[var(--ink-light)] uppercase mb-1">③ 研究動機</div>
                                                <div className="text-[12px] text-[var(--ink-mid)] leading-relaxed">每次說好「滑一下就睡」，結果一抬頭已經快12點。我不確定是睡太晚的問題，還是滑手機本身讓大腦沒辦法關機。</div>
                                            </div>
                                            <div className="flex items-center justify-between pt-2 border-t border-[var(--border)]">
                                                <div className="text-[10px] font-mono text-[var(--ink-light)]">④ 製作人</div>
                                                <div className="text-[12px] font-bold text-[var(--ink)]">王小明 101-15</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-[10px] font-mono text-[var(--ink-light)]">▲ 數位對照版</div>
                                </div>
                            </div>
                        </div>

                        <div className="notice notice-success text-[12px] mt-4">
                            ✏️ <strong>手寫海報（5 分鐘）</strong>——在 A4 紙上完成四格。不用美工，字跡清楚就好。
                        </div>
                    </div>
                </div>
            ),
        },

        /* ──────────────────────────────────────
         * STEP 3: Gallery Walk
         * ────────────────────────────────────── */
        {
            title: 'Gallery Walk',
            icon: '🚶',
            content: (
                <div className="space-y-8 prose-zh">
                    <div className="section-head"><h2>Gallery Walk 四輪走讀</h2><div className="line"></div><span className="mono">23 分鐘</span></div>
                    <p className="section-desc">
                        每組 4 人。一個人留在海報旁報告，另外三個人去逛別人的。聽完給具體建議，不能只寫「很好」。
                    </p>

                    {/* 分組規則 */}
                    <div className="border border-[var(--border)] rounded-xl overflow-hidden bg-white mb-4">
                        <div className="p-4 px-5 bg-[var(--paper-warm)] border-b border-[var(--border)] flex items-center gap-3">
                            <Users2 size={15} className="text-[var(--ink)]" />
                            <span className="font-bold text-[13px] text-[var(--ink)]">分配場次</span>
                        </div>
                        <div className="p-5">
                            <p className="text-[13px] text-[var(--ink-mid)] leading-relaxed mb-4">
                                每組 4 人先分配報告場次。每人只報告 1 次，但會聆聽 3 次。
                            </p>
                            <div className="bg-[var(--paper)] rounded-lg border border-[var(--border)] overflow-hidden">
                                <div className="grid grid-cols-3 bg-[var(--ink)] text-white text-[10px] font-mono uppercase tracking-wider">
                                    <div className="px-4 py-2">場次</div>
                                    <div className="px-4 py-2 border-l border-white/10">誰坐鎮報告</div>
                                    <div className="px-4 py-2 border-l border-white/10">其他人</div>
                                </div>
                                {[
                                    { round: '第 1 場', stay: 'A 坐鎮報告', move: 'B、C、D 聆聽' },
                                    { round: '第 2 場', stay: 'B 坐鎮報告', move: 'A、C、D 聆聽' },
                                    { round: '第 3 場', stay: 'C 坐鎮報告', move: 'A、B、D 聆聽' },
                                    { round: '第 4 場', stay: 'D 坐鎮報告', move: 'A、B、C 聆聽' },
                                ].map((row, i) => (
                                    <div key={i} className={`grid grid-cols-3 text-[12px] border-t border-[var(--border)] ${i % 2 === 0 ? 'bg-white' : 'bg-[var(--paper)]'}`}>
                                        <div className="px-4 py-2.5 font-mono font-bold text-[var(--accent)]">{row.round}</div>
                                        <div className="px-4 py-2.5 border-l border-[var(--border)] text-[var(--ink)] font-bold">{row.stay}</div>
                                        <div className="px-4 py-2.5 border-l border-[var(--border)] text-[var(--ink-mid)]">{row.move}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* 評論規則 */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        {[
                            { icon: <CheckCircle2 size={16} className="text-[var(--success)]" />, label: '具體肯定', desc: '說出哪裡好，例如「研究動機有畫面，讓人想繼續聽」' },
                            { icon: <Lightbulb size={16} className="text-[var(--gold)]" />, label: '具體建議', desc: '例如「Who 太大，縮到本校比較可行」「問卷樣本建議至少 50 人」' },
                            { icon: <MessageSquare size={16} className="text-[var(--accent)]" />, label: '好奇提問', desc: '例如「你預測的結果如果反過來呢？」「你打算怎麼找受試者？」' },
                        ].map((rule, idx) => (
                            <div key={idx} className="bg-white border border-[var(--border)] rounded-xl p-5 flex flex-col gap-3">
                                <div className="flex items-center gap-2 font-bold text-[var(--ink)]">{rule.icon}<span>{rule.label}</span></div>
                                <p className="text-[11px] text-[var(--ink-light)] leading-relaxed">{rule.desc}</p>
                            </div>
                        ))}
                    </div>

                    <div className="notice notice-gold text-[12px] mb-4">
                        💡 <strong>建議怎麼寫：說具體的。</strong>不要只寫「很好」或「加油」——這種不算，會被請你重寫。
                    </div>

                    <div className="notice notice-accent text-[12px]">
                        🔔 <strong>計時提醒</strong>：每一場 5 分鐘，鈴聲響立刻移動。四輪結束，你會收到大概 12 張建議，這是你今天最重要的資產。
                    </div>
                </div>
            ),
        },

        /* ──────────────────────────────────────
         * STEP 4: 題目最終定案
         * ────────────────────────────────────── */
        {
            title: '題目最終定案',
            icon: '🎯',
            content: (
                <div className="space-y-8 prose-zh">
                    <div className="section-head"><h2>整理建議 → 最終定案</h2><div className="line"></div><span className="mono">15 分鐘</span></div>
                    <p className="section-desc">
                        看看同學給你的建議，分成三類。不是所有建議都要採納——有判斷力地接受，比什麼都接受更重要。
                    </p>

                    {/* 三類分法 */}
                    <div className="content-grid grid-cols-1 md:grid-cols-3 mb-6">
                        {[
                            { tag: '✅ 我接受，我要改', desc: '同學說得對，我的題目需要調整', color: 'bg-[var(--success-light)]' },
                            { tag: '❌ 我不接受，有理由', desc: '我考慮過了，有充分理由維持原設計', color: 'bg-[var(--danger-light)]' },
                            { tag: '❓ 我不確定', desc: '需要再想想，或者問老師', color: 'bg-[var(--gold-light)]' },
                        ].map((cat, i) => (
                            <div key={i} className={`p-5 rounded-xl ${cat.color}`}>
                                <div className="font-bold text-[13px] text-[var(--ink)] mb-2">{cat.tag}</div>
                                <p className="text-[12px] text-[var(--ink-mid)]">{cat.desc}</p>
                            </div>
                        ))}
                    </div>

                    <ThinkRecord
                        dataKey="w4-feedback-accept"
                        prompt="你接受了哪些建議？打算怎麼改？"
                        scaffold={['同學說…', '我覺得他說得對，因為…', '我打算把…改成…']}
                        rows={4}
                    />

                    <div className="mt-4">
                        <ThinkRecord
                            dataKey="w4-feedback-reject"
                            prompt="你不採納哪些建議？理由是？"
                            scaffold={['有人說…', '但我不改，因為…', '我的考量是…']}
                            rows={3}
                        />
                    </div>

                    {/* 最終定案框 */}
                    <div className="mt-6 p-5 bg-[var(--paper)] rounded-xl border-2 border-dashed border-[var(--success)]/40">
                        <div className="text-[11px] font-mono text-[var(--success)] uppercase mb-4 tracking-wider">🎯 W4 個人最終定案</div>
                        <div className="space-y-4">
                            <ThinkRecord
                                dataKey="w4-final-topic"
                                prompt="你的 W4 最終定案題目（這個跟著你走一整個學期）"
                                scaffold={['我的最終題目是：…']}
                                rows={2}
                            />
                            <ThinkRecord
                                dataKey="w4-final-motivation"
                                prompt="你的最終研究動機"
                                scaffold={['我想研究這個是因為…', '我最想知道的是…']}
                                rows={3}
                            />
                        </div>
                    </div>

                    <ThinkChoice
                        dataKey="w4-tc1"
                        prompt="你的 W4 定案跟 W3 比，有改變嗎？"
                        options={[
                            { label: 'A', text: '有改，根據同學建議調整了' },
                            { label: 'B', text: '微調，小地方修一修' },
                            { label: 'C', text: '維持 W3 原版，同學的建議不夠有說服力' },
                        ]}
                        answer="A"
                        feedback="不管選哪個都沒有對錯！重要的是你有理由。能清楚說出「為什麼改」或「為什麼不改」，才是這堂課的核心。"
                        onAnswer={(sel, ok) => trackChoice('你的 W4 定案跟 W3 比，有改變嗎？', sel, ok)}
                    />
                </div>
            ),
        },

        /* ──────────────────────────────────────
         * STEP 5: 回顧與繳交
         * ────────────────────────────────────── */
        {
            title: '回顧與繳交',
            icon: '📋',
            content: (
                <div className="space-y-8 prose-zh">
                    {/* 檢核清單 */}
                    <div className="bg-white border border-[var(--border)] rounded-xl overflow-hidden">
                        <div className="p-4 px-5 bg-[var(--paper-warm)] border-b border-[var(--border)] font-bold text-[13px]">
                            ✅ 本週結束，你應該要會
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-[1px] bg-[var(--border)]">
                            {[
                                '用 5W1H 把模糊題目切成可執行的規格',
                                '通過可行性快篩，確認研究方法做得到',
                                '用 AI 包裝出專業學術標題，並記錄 AI-RED',
                                '完成手寫海報（四格）並接受 Gallery Walk 壓力測試',
                                '分類同學建議（接受 / 不接受 / 不確定）',
                                '確認 W4 最終定案題目與研究動機',
                            ].map((item, i) => (
                                <div key={i} className="p-4 px-6 bg-white flex items-start gap-3">
                                    <CheckCircle2 size={16} className="text-[var(--success)] mt-0.5 flex-shrink-0" />
                                    <span className="text-[13px] text-[var(--ink-mid)]">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 一鍵複製 */}
                    <ExportButton
                        weekLabel="W4 題目博覽會"
                        fields={EXPORT_FIELDS}
                        choices={choiceResults}
                    />

                    {/* AI 教練連結 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <a href="https://gemini.google.com/gem/1ujK5kRzW8QFNEtWa8F5mq0b_9JL4iDFx?usp=sharing" target="_blank" rel="noopener noreferrer"
                            className="group p-5 border border-[var(--border)] rounded-xl hover:border-[var(--accent)] transition-all bg-white">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-lg bg-[var(--paper-warm)] flex items-center justify-center text-xl shrink-0 group-hover:bg-[var(--accent)] transition-colors">🤖</div>
                                <div>
                                    <div className="font-bold text-[var(--ink)] text-[13px]">研究動機教練</div>
                                    <div className="text-[11px] font-mono text-[var(--accent)] mt-1">開啟 Gemini Gem ↗</div>
                                </div>
                            </div>
                        </a>
                        <a href="https://gemini.google.com/gem/1yF7FqRoQWUQGBtFLrGvbuul61OMGbgAv?usp=sharing" target="_blank" rel="noopener noreferrer"
                            className="group p-5 border border-[var(--border)] rounded-xl hover:border-[var(--accent)] transition-all bg-white">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-lg bg-[var(--paper-warm)] flex items-center justify-center text-xl shrink-0 group-hover:bg-[var(--accent)] transition-colors">💬</div>
                                <div>
                                    <div className="font-bold text-[var(--ink)] text-[13px]">Q-Coach 問題意識教練</div>
                                    <div className="text-[11px] font-mono text-[var(--accent)] mt-1">開啟 Gemini Gem ↗</div>
                                </div>
                            </div>
                        </a>
                    </div>

                    {/* 下週預告 */}
                    <div className="next-week-preview">
                        <div className="next-week-header">
                            <span className="next-week-badge">NEXT WEEK</span>
                            <h3 className="next-week-title">W5 預告</h3>
                        </div>
                        <div className="next-week-content">
                            <div className="next-week-col">
                                <div className="next-week-label">W5 主題</div>
                                <p className="next-week-text">文獻搜尋——學會用華藝資料庫找論文、辨別文獻等級、練習 APA 格式。</p>
                            </div>
                            <div className="next-week-col">
                                <div className="next-week-label">你要確認</div>
                                <p className="next-week-text">帶著你的<strong>最終定案題目</strong>來，下週要用它拆關鍵字搜尋文獻。</p>
                            </div>
                        </div>
                    </div>
                </div>
            ),
        },
    ];

    return (
        <div className="page-container animate-in-fade-slide">
            {/* TOP BAR */}
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-4 mb-8 md:mb-12 gap-3">
                <div className="text-[11px] font-mono text-[var(--ink-light)] flex items-center gap-2 min-w-0">
                    <span className="hidden md:inline">研究方法與專題 / 研究規劃 / </span><span className="text-[var(--ink)] font-bold">題目博覽會 W4</span>
                </div>
                <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
                    <span className="bg-[var(--paper-warm)] text-[var(--ink)] text-[10px] font-bold px-2 py-0.5 rounded-[2px] font-mono">100 MINS</span>
                    <ResetWeekButton weekPrefix="w4-" />
                    <button
                        onClick={() => setShowLessonMap(!showLessonMap)}
                        className="text-[11px] text-[var(--ink-light)] hover:text-[var(--accent)] transition-colors flex items-center gap-1 font-mono"
                    >
                        <Map size={12} /> <span className="hidden md:inline">{showLessonMap ? 'Hide Plan' : 'Instructor View'}</span>
                    </button>
                    <span className="hidden md:inline-block bg-[var(--ink)] text-white text-[10px] font-bold px-2 py-0.5 rounded-[2px] font-mono">AI-RED · D</span>
                </div>
            </div>

            {showLessonMap && (
                <div className="animate-in slide-in-from-top-4 duration-300">
                    <LessonMap data={W4Data} />
                </div>
            )}

            {/* PAGE HEADER — Hero Block */}
            <HeroBlock
                kicker="R.I.B. 調查檔案 · 研究方法與專題 · W4"
                title="題目定案："
                accentTitle="規格化 → 海報 → 壓力測試"
                subtitle="先用 5W1H 把模糊的題目切成可執行的規格，讓 AI 包裝成學術標題，做海報公開展示，再接受同學的 Gallery Walk 壓力測試。撐過去了才是真正定案。"
                meta={[
                    { label: '本週任務', value: '5W1H 規格化 + 海報 + Gallery Walk' },
                    { label: '時長', value: '100 MINS' },
                    { label: '課堂產出', value: '最終定案題目 + 研究動機' },
                    { label: '下週預告', value: 'W5 文獻搜尋' },
                ]}
            />
            <CourseArc items={W4Data.courseArc} />

            {/* 本週簡報 */}
            <div className="flex justify-end mb-8 -mt-2">
                <a
                    href="https://canva.link/hdvnkubddcklm56"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold tracking-wider text-[var(--ink-light)] hover:text-[var(--ink)] bg-[var(--paper)] hover:bg-[var(--paper-warm)] border border-[var(--border)] hover:border-[var(--ink)]/20 px-3 py-1.5 rounded-[5px] transition-all"
                >
                    📊 本週簡報 ↗
                </a>
            </div>

            {/* STEP ENGINE */}
            <StepEngine
                steps={steps}
                prevWeek={{ label: '回 W3 題目健檢', to: '/w3' }}
                nextWeek={{ label: '前往 W5 文獻搜尋入門', to: '/w5' }}
            flat
            />
        </div>
    );
};
