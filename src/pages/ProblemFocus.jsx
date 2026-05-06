import React, { useState, useCallback, useEffect } from 'react';
import CourseArc from '../components/ui/CourseArc';
import ThinkRecord from '../components/ui/ThinkRecord';
import ThinkChoice from '../components/ui/ThinkChoice';
import StepEngine from '../components/ui/StepEngine';
import HeroBlock from '../components/ui/HeroBlock';
import TaskCard from '../components/ui/TaskCard';
import AIREDNarrative from '../components/ui/AIREDNarrative';
import ExportButton from '../components/ui/ExportButton';
import ResetWeekButton from '../components/ui/ResetWeekButton';
import CopyButton from '../components/ui/CopyButton';
import { readRecords } from '../components/ui/ThinkRecord';
import { Map } from 'lucide-react';
import LessonMap from '../components/ui/LessonMap';
import BackfillField from '../components/ui/BackfillField';
import { W2Data } from '../data/lessonMaps';
import './ProblemFocus.css';

/* ── 資料常數 ── */

const FOUR_STEPS = [
    {
        step: 'STEP 1', name: '觀察現象', who: 'human', whotxt: '⚠️ 只有人能做',
        how: '像攝影機一樣，具體描述你看到的畫面。不解釋，只描述。',
        ex: '段考前圖書館閱覽室爆滿，連地板都坐人；旁邊的借書區和書架區空無一人，連燈都沒開全。',
    },
    {
        step: 'STEP 2', name: '發現落差', who: 'both', whotxt: '人主導，AI 可協助',
        how: '這裡有什麼矛盾？哪裡怪怪的？「應該是⋯但實際上⋯」',
        ex: '圖書館的核心存在應該是「借閱書籍」，但段考期間它變成了只有桌椅功能、沒有閱讀功能的大型K書房。大家湧向圖書館，卻完全不碰最珍貴的資源：書。',
    },
    {
        step: 'STEP 3', name: '展開假設', who: 'both', whotxt: '⚠️ 先發散，別急著鎖死',
        how: '這個矛盾背後可能的解釋是什麼？至少 3 個、最多 5 個，不要只想一個就鎖死。',
        ex: '① 考試壓力推學生找個地方讀／② 同儕氛圍（看到別人讀就讀）／③ 圖書館的「讀書感」儀式／④ 空教室沒冷氣、沒安靜感／⑤ 家裡讀不下去。',
    },
    {
        step: 'STEP 4', name: '鎖定研究問題', who: 'ai', whotxt: '第二節 · 從假設中挑一個',
        how: '從上一段假設中挑一個你最想先研究的，寫成 A／B／C 型句。AI 協助翻譯成學術語言，但「挑哪個」是你的研究設計決定。',
        ex: '【A型】我想探究「考試壓力」如何影響學生對「圖書館空間使用」的選擇。（從 ① 出發；②③ 留待後續研究）',
    },
];

const ABC_TYPES = [
    { l: 'A', t: '影響型', p: '「A 如何影響 B？」', m: '📋 問卷 / 🧪 實驗', e: '例：「考試壓力如何影響圖書館空間選擇？」' },
    { l: 'B', t: '比較型', p: '「A 和 B 有什麼不同？」', m: '📋 問卷 / 📚 資料分析', e: '例：「考前 vs 考後，圖書館使用者行為有何不同？」' },
    { l: 'C', t: '深究型', p: '「A 背後的原因是什麼？」', m: '🎤 訪談 / 👀 觀察', e: '例：「學生選圖書館K書而非空教室的心理原因是什麼？」' },
];

/* PROMPT_INTENT 改成動態組（W2AuditPrompt 元件內 build），這個常數已不用。
 * 保留 placeholder 字串供 fallback 顯示用。
 */
const PROMPT_AUDIT_TEMPLATE = (data) => {
    const fb = (s, label) => s || `[ ⚠️ 沒抓到「${label}」，請回前面補齊 ]`;
    return `我是高中生，正在做研究專題。請扮演研究方法老師幫我審核我寫的「研究問題草稿」。

【我的四段式思考歷程】
觀察現象：${fb(data.phenomenon, '現象')}
發現落差：${fb(data.gap, '落差')}
列出假設：${fb(data.hypotheses, '假設清單')}
選定假設＋判型：${fb(data.judgment, '選定假設與 ABC 判型')}

【我的研究問題草稿】
${fb(data.draft, '研究問題草稿')}

請你做兩件事：

① 結構審核：這個句子有沒有符合我選的型（A 影響型／B 比較型／C 深究型）的結構標準？如果結構漏了什麼，請具體指出。
   · A 型：要清楚指出「自變項」（我改的那個條件，例如：考試壓力大小）與「依變項」（我觀察／測量的結果，例如：圖書館空間選擇）
   · B 型：要清楚對照兩個對象／情境
   · C 型：要明確指出「機制／原因」是研究焦點

② 改寫建議：給我 1 個更精準的改寫版本（不超過 1 句），並用 1 句話說明你改了什麼、為什麼。

⚠️ 不要直接幫我換型——如果你覺得我選錯型，請在「結構審核」裡說明，但「改寫版本」請維持我選的型。`;
};

const EXPORT_FIELDS = [
    { key: 'w2-practice1-phenomenon', label: '[暖身 ①垃圾] 現象', question: '像攝影機一樣描述（暖身練習，評分寬鬆）' },
    { key: 'w2-practice1-gap', label: '[暖身 ①垃圾] 落差', question: '應該是⋯但實際上⋯（暖身）' },
    { key: 'w2-practice1-hypotheses', label: '[暖身 ①垃圾] 假設', question: '可能的 3-5 個解釋（暖身）' },
    { key: 'w2-practice2-phenomenon', label: '[暖身 ②課堂] 現象', question: '像攝影機一樣描述（暖身）' },
    { key: 'w2-practice2-gap', label: '[暖身 ②課堂] 落差', question: '應該是⋯但實際上⋯（暖身）' },
    { key: 'w2-practice2-hypotheses', label: '[暖身 ②課堂] 假設', question: '可能的 3-5 個解釋（暖身）' },
    { key: 'w2-step1-phenomenon', label: 'Step 1 現象', question: '像攝影機一樣，你看到了什麼？（至少 30 字）' },
    { key: 'w2-step2-gap', label: 'Step 2 落差', question: '哪裡跟你想的不一樣？矛盾在哪？' },
    { key: 'w2-step3-question', label: 'Step 3 展開假設', question: '這個矛盾背後可能的 3-5 個解釋' },
    { key: 'w2-abc-judgment', label: '第一輪：挑選假設＋ABC 型判斷', question: '你選哪個假設？為什麼選它？它屬於 A／B／C 哪型？' },
    { key: 'w2-rq-draft', label: '第一輪：研究問題草稿（自寫）', question: '你自己先寫一句研究問題（給 AI 審用的）' },
    { key: 'w2-ai-intent-choice', label: '第三輪：AI 審核後的決定', question: '審核後你決定保留自己的、採 AI 改寫、還是混合？' },
    { key: 'w2-final-intent', label: '最終研究問題', question: '你的最終研究問題（帶去 W3 的版本）' },
    { key: 'w2-aired-record', label: 'AI-RED 敘事紀錄', question: '本週最重要的一次 AI 互動（A-I-R-E-D 五要素）' },
    { key: 'w2-reflect-stuck', label: '反思：卡在哪一段', question: '四段式框架你卡在哪一段？為什麼那段最難？' },
];

/* ── Step 4 第一輪帶入卡：把 Step 2「人腦練習」的三格內容（現象／落差／假設清單）
 *    顯示出來，讓學生挑一個假設時不用翻回上一個 Step ── */
function W2Beat1RefCard() {
    const [phenomenon, setPhenomenon] = useState('');
    const [gap, setGap] = useState('');
    const [hypotheses, setHypotheses] = useState('');

    const refresh = useCallback(() => {
        const records = readRecords();
        setPhenomenon((records['w2-step1-phenomenon'] || '').trim());
        setGap((records['w2-step2-gap'] || '').trim());
        setHypotheses((records['w2-step3-question'] || '').trim());
    }, []);

    useEffect(() => {
        refresh();
        window.addEventListener('focus', refresh);
        return () => window.removeEventListener('focus', refresh);
    }, [refresh]);

    if (!phenomenon && !gap && !hypotheses) {
        return (
            <div className="mb-3">
                <BackfillField
                    dataKey="w2-step3-question"
                    label="⚠️ 還沒偵測到「人腦練習」階段的內容——想直接從這個 AI 協作階段開始？把你列出的 3-5 個假設貼這裡，下方就能挑一個並判斷 ABC 型。"
                    placeholder={'例：① 考試壓力 ② 同儕氛圍 ③ 圖書館「讀書感」儀式 ④ 空教室沒冷氣 ⑤ 家裡讀不下去'}
                    buttonLabel="補上假設清單"
                />
            </div>
        );
    }

    return (
        <div className="bg-[var(--paper-warm)] border border-[var(--border)] rounded-[8px] p-4 space-y-2 text-[12.5px] mb-3">
            <div className="text-[10px] font-mono text-[var(--ink-light)] uppercase tracking-wider">
                📎 你「人腦練習」階段寫過的（不用翻回去）
            </div>
            {phenomenon && (
                <div className="flex items-baseline gap-2">
                    <span className="text-[11px] font-mono font-bold text-[var(--ink-light)] shrink-0 w-[80px]">Step 1 現象</span>
                    <span className="text-[var(--ink-mid)] whitespace-pre-wrap line-clamp-2">{phenomenon}</span>
                </div>
            )}
            {gap && (
                <div className="flex items-baseline gap-2">
                    <span className="text-[11px] font-mono font-bold text-[var(--ink-light)] shrink-0 w-[80px]">Step 2 落差</span>
                    <span className="text-[var(--ink-mid)] whitespace-pre-wrap line-clamp-2">{gap}</span>
                </div>
            )}
            {hypotheses && (
                <div className="flex items-start gap-2">
                    <span className="text-[11px] font-mono font-bold text-[var(--accent)] shrink-0 w-[80px] mt-0.5">Step 3 假設</span>
                    <span className="text-[var(--ink)] whitespace-pre-wrap font-medium">{hypotheses}</span>
                </div>
            )}
            <p className="text-[11px] text-[var(--ink-light)] italic pt-1 border-t border-[var(--border)]">
                💡 從假設清單裡挑一個你最想先研究的，下方寫「我選 ___ + 為什麼 + 它屬於 ABC 哪一型」。
            </p>
        </div>
    );
}

/* ── Step 4 帶入卡：把 Step 1 現象 / Step 3 核心疑問 / ABC 判斷顯示出來，
 *    讓學生定稿時不用翻回上一步 ── */
function W2Step4RefCard() {
    const [phenomenon, setPhenomenon] = useState('');
    const [question, setQuestion] = useState('');
    const [abcJudgment, setAbcJudgment] = useState('');
    const [abcType, setAbcType] = useState(null); // 'A' | 'B' | 'C' | null

    const refresh = useCallback(() => {
        const records = readRecords();
        setPhenomenon((records['w2-step1-phenomenon'] || '').trim());
        setQuestion((records['w2-step3-question'] || '').trim());
        const j = (records['w2-abc-judgment'] || '').trim();
        setAbcJudgment(j);
        // 偵測 ABC 型（白話初稿裡很可能寫「我判斷是 A 型」「B 型」「C 型」）
        const m = j.match(/[ABC](?=\s*型)/);
        setAbcType(m ? m[0] : null);
    }, []);

    useEffect(() => {
        refresh();
        window.addEventListener('focus', refresh);
        return () => window.removeEventListener('focus', refresh);
    }, [refresh]);

    if (!phenomenon && !question && !abcJudgment) {
        return (
            <BackfillField
                dataKey="w2-abc-judgment"
                label="⚠️ 還沒偵測到「AI 協作」第一輪的挑選——想直接從定稿階段開始？把『我選假設 ___，因為 ___，這是 X 型』貼這裡，下方 scaffold 會根據 ABC 型給你翻譯提示。"
                placeholder={'例：我選假設①「考試壓力」，因為這個變項最容易設計問卷量測。我判斷是 A 型（影響型）。'}
                buttonLabel="補上挑選＋判斷"
            />
        );
    }

    const ABC_LABELS = { A: '影響型', B: '比較型', C: '深究型' };
    const ABC_HINT = {
        A: '建議用 scaffold 第 1 條：「我想探究『___』如何影響『___』」',
        B: '建議用 scaffold 第 2 條：「我想比較『___』和『___』的差異」',
        C: '建議用 scaffold 第 3 條：「我想深究『___』背後的原因」',
    };

    return (
        <div className="bg-[var(--paper-warm)] border border-[var(--border)] rounded-[10px] p-4 space-y-2 text-[12.5px]">
            <div className="text-[10px] font-mono text-[var(--ink-light)] uppercase tracking-wider">
                📎 你前面寫過的（不用翻回去）
            </div>
            {abcType && (
                <div className="flex items-baseline gap-2">
                    <span className="text-[11px] font-mono font-bold text-[var(--accent)] shrink-0">ABC 判斷</span>
                    <span className="text-[var(--ink)]">
                        <strong>{abcType} 型（{ABC_LABELS[abcType]}）</strong>
                        <span className="text-[11px] text-[var(--ink-light)] ml-2">— {ABC_HINT[abcType]}</span>
                    </span>
                </div>
            )}
            {question && (
                <div className="flex items-start gap-2">
                    <span className="text-[11px] font-mono font-bold text-[var(--ink-light)] shrink-0 w-[88px] mt-0.5">Step 3 假設</span>
                    <span className="text-[var(--ink)] whitespace-pre-wrap line-clamp-3">{question}</span>
                </div>
            )}
            {abcJudgment && (
                <div className="flex items-start gap-2">
                    <span className="text-[11px] font-mono font-bold text-[var(--ink-light)] shrink-0 w-[88px] mt-0.5">挑選＋判斷</span>
                    <span className="text-[var(--ink)] whitespace-pre-wrap">{abcJudgment}</span>
                </div>
            )}
            {phenomenon && (
                <div className="flex items-baseline gap-2">
                    <span className="text-[11px] font-mono font-bold text-[var(--ink-light)] shrink-0 w-[88px]">Step 1 現象</span>
                    <span className="text-[var(--ink-mid)] whitespace-pre-wrap line-clamp-2">{phenomenon}</span>
                </div>
            )}
            <p className="text-[11px] text-[var(--ink-light)] italic pt-1 border-t border-[var(--border)]">
                💡 這格是參考——把上面審核後定稿的研究問題寫成完整句。
            </p>
        </div>
    );
}

/* ── W2AuditPrompt：動態組「研究問題審核器」Prompt ──
 *  從 localStorage 讀取四段思考歷程 + 草稿，組成完整 Prompt 給學生 Copy
 *  缺資料的欄位顯示「⚠️ 沒抓到，請回前面補齊」，並在底部顯示警示橫條
 */
function W2AuditPrompt() {
    const [data, setData] = useState({
        phenomenon: '', gap: '', hypotheses: '', judgment: '', draft: '',
    });

    const refresh = useCallback(() => {
        const r = readRecords();
        setData({
            phenomenon: (r['w2-step1-phenomenon'] || '').trim(),
            gap: (r['w2-step2-gap'] || '').trim(),
            hypotheses: (r['w2-step3-question'] || '').trim(),
            judgment: (r['w2-abc-judgment'] || '').trim(),
            draft: (r['w2-rq-draft'] || '').trim(),
        });
    }, []);

    useEffect(() => {
        refresh();
        const interval = setInterval(refresh, 1500); // 每 1.5 秒同步一次（學生在同頁打字也能看到 Prompt 更新）
        window.addEventListener('focus', refresh);
        return () => {
            clearInterval(interval);
            window.removeEventListener('focus', refresh);
        };
    }, [refresh]);

    const promptText = PROMPT_AUDIT_TEMPLATE(data);
    const missing = !data.phenomenon || !data.gap || !data.hypotheses || !data.judgment || !data.draft;

    return (
        <div className="prompt-box mt-4">
            <div className="prompt-hd">
                <span>PROMPT · 研究問題審核器（已自動帶入你寫過的內容）</span>
                <CopyButton text={promptText} label="複製" />
            </div>
            <div className="prompt-body" style={{ whiteSpace: 'pre-wrap' }}>{promptText}</div>
            {missing && (
                <div className="px-3 py-2 text-[11px] text-[var(--danger)] bg-[var(--danger-light)] border-t border-[var(--border)]">
                    ⚠️ 上方標 ⚠️ 的欄位請先回前面 Step 補齊，AI 才能審核完整。
                </div>
            )}
        </div>
    );
}

/* ── 圖片轉化戰：合成圖 + Tab 切換兩個練習 ──
 *  圖片：/public/images/w2/w2-scene-pair.jpg（學生用合成圖一張）
 *  練習各 3 格 ThinkRecord（不納入 ExportButton，純練手感）
 *  圖載入失敗時 fallback 灰底佔位，不會壞畫面
 */
const PRACTICE_TABS = [
    {
        id: 'p1',
        label: '① 垃圾爆滿',
        focus: '請聚焦在圖的左半邊',
        accent: '#6b4a2e',
        bg: '#f5f0e6',
        keyPrefix: 'w2-practice1',
        placeholderHint: '例：垃圾桶旁邊地上堆滿垃圾袋／飲料罐散落，但垃圾桶蓋是合上的⋯⋯',
    },
    {
        id: 'p2',
        label: '② 課堂失序',
        focus: '請聚焦在圖的右半邊',
        accent: '#5a3e7e',
        bg: '#efe9f5',
        keyPrefix: 'w2-practice2',
        placeholderHint: '例：老師正在黑板上推導力學公式，前排同學趴睡、後排同學在玩手遊⋯⋯',
    },
];

function PracticeTabs() {
    const [active, setActive] = useState('p1');
    const [imgError, setImgError] = useState(false);
    const tab = PRACTICE_TABS.find(t => t.id === active);

    return (
        <div className="space-y-4">
            {/* Header */}
            <div>
                <div className="flex items-center gap-2 mb-3">
                    <span className="text-[10px] font-mono uppercase tracking-[0.12em] px-2 py-0.5 rounded bg-[#f0ede6] text-[#6b4a2e]">人腦</span>
                    <span className="text-[11px] font-mono uppercase tracking-[0.1em] text-[var(--ink-light)]">先練手感（會匯入學習紀錄，但評分寬鬆）</span>
                </div>
                <h4 className="font-serif text-[18px] md:text-[20px] font-bold text-[var(--ink)] mb-2 leading-[1.4]">
                    圖片轉化戰（兩個練習）
                </h4>
                <p className="text-[14px] md:text-[15px] text-[var(--ink-mid)] leading-[1.85] m-0">
                    看下方合成圖的兩個場景，分別用「現象 → 落差 → 展開假設」三步快速思考。節奏要快，3 分鐘 / 場景。
                </p>
            </div>

            {/* 合成圖 */}
            <div className="rounded-[var(--radius-unified)] border border-[var(--border)] overflow-hidden bg-[#f5f5f0]">
                {!imgError ? (
                    <img
                        src="/images/w2/w2-scene-pair.jpg"
                        alt="左：垃圾爆滿的角落（公共空間失序）／右：課堂上老師講課但學生睡覺與滑手機（學習場域失序）"
                        className="block w-full h-auto"
                        onError={() => setImgError(true)}
                    />
                ) : (
                    <div className="aspect-[16/9] flex items-center justify-center text-[12px] text-[var(--ink-light)] font-mono">
                        圖片載入中⋯⋯（路徑：/images/w2/w2-scene-pair.jpg）
                    </div>
                )}
            </div>

            {/* Tab 切換 */}
            <div className="flex border-b border-[var(--border)]">
                {PRACTICE_TABS.map(t => {
                    const isActive = t.id === active;
                    return (
                        <button
                            key={t.id}
                            type="button"
                            onClick={() => setActive(t.id)}
                            className="px-4 py-2.5 text-[13px] font-bold transition-colors -mb-px border-b-2"
                            style={{
                                color: isActive ? t.accent : 'var(--ink-light)',
                                borderBottomColor: isActive ? t.accent : 'transparent',
                                background: isActive ? t.bg : 'transparent',
                            }}
                        >
                            {t.label}
                        </button>
                    );
                })}
            </div>

            {/* 焦點提示 */}
            <div
                className="px-3 py-2 rounded-[var(--radius-unified)] text-[12px] font-medium"
                style={{ background: tab.bg, color: tab.accent }}
            >
                👉 {tab.focus}
            </div>

            {/* 三格快速 ThinkRecord */}
            <div className="space-y-3">
                <ThinkRecord
                    dataKey={`${tab.keyPrefix}-phenomenon`}
                    prompt="① 現象：像攝影機一樣描述（不解釋，只描述）"
                    placeholder={tab.placeholderHint}
                    rows={2}
                />
                <ThinkRecord
                    dataKey={`${tab.keyPrefix}-gap`}
                    prompt="② 落差：應該是⋯但實際上⋯"
                    placeholder="例：學校貼了告示「丟完請關蓋」，但實際上垃圾根本沒進桶／例：教室是學習場域，但實際上一半學生在打瞌睡⋯⋯"
                    rows={2}
                />
                <ThinkRecord
                    dataKey={`${tab.keyPrefix}-hypotheses`}
                    prompt="③ 展開假設：這個矛盾背後可能的 3-5 個解釋"
                    placeholder={`① 可能是…\n② 也可能是…\n③ 還可能是…`}
                    rows={4}
                />
            </div>

            <div className="w2-notice block">❌ Step 3 不要只想一個假設就鎖死——研究的起點是承認「答案可能不只一個」。</div>
        </div>
    );
}

/* ── 主組件 ── */

export const ProblemFocus = () => {
    const [showLessonMap, setShowLessonMap] = useState(false);

    /* W1 生活觀察帶入 */
    const [w1Observe, setW1Observe] = useState('');
    useEffect(() => {
        const refresh = () => {
            const records = readRecords();
            setW1Observe(records['w1-life-observe'] || '');
        };
        refresh();
        window.addEventListener('focus', refresh);
        return () => window.removeEventListener('focus', refresh);
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
                    <ResetWeekButton weekPrefix="w2-" />
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
                subtitle="「為什麼」是爛問題——太大、太空、太發散。今天你要學四段式思考框架：觀察 → 落差 → 展開假設 → 鎖定研究問題。第一節靠自己發散，第二節用 AI 協助收斂與翻譯。"
                chain="研究是從『我想知道』開始的——但光想還不能研究。這週要把腦中的好奇，變成『可以拿來研究』的問題。"
                meta={[
                    { label: '本週任務', value: '練「品味」' },
                    { label: '時長', value: '100 MINS' },
                    { label: '課堂產出', value: '研究問題（定稿）' },
                    { label: '下週預告', value: '題目健檢 W3' },
                ]}
            />
            <CourseArc items={W2Data.courseArc} />

            <TaskCard
                weekNumber="W2"
                weekTitle={W2Data.title}
                duration={`${W2Data.duration} 分鐘 · ${W2Data.durationDesc}`}
                tasks={[
                    '四段式框架練習 — 觀察 → 落差 → 假設 → 鎖定研究問題',
                    'ABC 探究句型 — 寫出影響型／比較型／深究型題目各一條',
                    '把 W1 的「想知道」轉成 W2 的「探究意圖」',
                ]}
                exportReminder="匯出 W2 探究意圖 → 下週帶進 W3 題目健檢上手術台"
            />

            {/* ══════════ STEP ENGINE ══════════ */}
            <StepEngine
              weekCode="R.I.B. · W2"
              prevWeek={{ label: '回 W1 模仿遊戲', to: '/w1' }}
              nextWeek={{ label: '前往 W3 題目健檢', to: '/w3' }}
              flat
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
                                💡 拿著你選定的假設問自己：你最想知道的是「影響」、「差異」還是「原因」？這個判斷由你來做，不准問 AI！
                            </div>

                            {/* 理解檢核 */}
                            <ThinkChoice
                                dataKey="w2-tc1"
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

                /* ──────── Step 2: 暖身練習（圖片轉化戰）──────── */
                {
                    title: '暖身練習',
                    icon: '🎯',
                    content: (
                        <div className="flex flex-col gap-8 prose-zh">
                            <div>
                                <div className="text-[10px] font-mono text-[var(--ink-light)] uppercase tracking-[0.12em] mb-3">PART 2 · 第一節課 · 禁止使用 AI</div>
                                <h3 className="font-serif text-[22px] md:text-[24px] font-bold text-[var(--ink)] mb-4 leading-[1.4]">先用範例練手感</h3>
                                <p className="text-[15px] md:text-[16px] text-[var(--ink-mid)] leading-[1.85]">
                                    用下方兩個範例場景試跑「現象 → 落差 → 展開假設」三步。3 分鐘 / 場景，節奏快、不分享。做完按 Next 進「人腦練習」階段，換你自己的 W1 觀察上場。
                                </p>
                            </div>
                            <PracticeTabs />
                        </div>
                    ),
                },

                /* ──────── Step 3: 人腦練習（改寫 W1 觀察）──────── */
                {
                    title: '人腦練習',
                    icon: '🧠',
                    content: (
                        <div className="flex flex-col gap-8 prose-zh">
                            <div>
                                <div className="text-[10px] font-mono text-[var(--ink-light)] uppercase tracking-[0.12em] mb-3">PART 2.5 · 第一節課 · 主菜</div>
                                <h3 className="font-serif text-[22px] md:text-[24px] font-bold text-[var(--ink)] mb-4 leading-[1.4]">換你的 W1 觀察上場</h3>
                                <p className="text-[15px] md:text-[16px] text-[var(--ink-mid)] leading-[1.85]">
                                    暖身完了。用你 W1 的生活觀察跑一輪四段框架的前三步——這是後面所有 Step 的起點，10 分鐘，全程人腦。
                                </p>
                            </div>

                            {/* 練習 0：核心！有 W1 種子 → 顯示帶入；沒有 → 現場補上 */}
                            {w1Observe ? (
                                <div style={{ background: 'var(--accent-light)', border: '1px solid color-mix(in srgb, var(--accent) 20%, transparent)', borderRadius: '10px', padding: '16px 20px', display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '0' }}>
                                    <span style={{ fontSize: '16px' }}>📎</span>
                                    <div>
                                        <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>W1 你的生活觀察種子</div>
                                        <p style={{ fontSize: '13px', color: 'var(--ink)', lineHeight: '1.6', fontWeight: 500 }}>{w1Observe}</p>
                                        <p style={{ fontSize: '11px', color: 'var(--ink-light)', marginTop: '4px' }}>用四段式思考，把這個觀察升級成下面的三步。</p>
                                    </div>
                                </div>
                            ) : (
                                <BackfillField
                                    dataKey="w1-life-observe"
                                    label="⚠️ 沒偵測到你 W1 的生活觀察種子——把你上週寫的『最近覺得奇怪的現象』貼這裡，下方四段式練習就有起點。"
                                    placeholder="例：每次段考前一週，圖書館借書區反而沒人，自習區卻擠爆。"
                                    buttonLabel="補上 W1 觀察"
                                />
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
                                prompt="Step 3 展開假設：這個矛盾背後可能的解釋是什麼？至少 3 個、最多 5 個。先發散，不要只想一個就鎖死。"
                                placeholder={`① 可能是…\n② 也可能是…\n③ 還可能是…\n（最多到 ⑤）`}
                                scaffold={[
                                    '① 可能是… / ② 也可能是… / ③ 還可能是…',
                                    '別只寫一個——研究的起點是承認「答案可能不只一個」',
                                    '不知道哪個對沒關係，下一段你會挑一個先研究',
                                ]}
                                rows={5}
                            />
                        </div>
                    ),
                },

                /* ──────── Step 4: AI 協作 ──────── */
                {
                    title: 'AI 協作',
                    icon: '🤖',
                    content: (
                        <div className="flex flex-col gap-8 prose-zh">
                            <div>
                                <div className="text-[10px] font-mono text-[var(--ink-light)] uppercase tracking-[0.12em] mb-3">第二節課 · AI 協作三輪</div>
                                <h3 className="font-serif text-[22px] md:text-[24px] font-bold text-[var(--ink)] mb-4 leading-[1.4]">AI 當教練，你當作者</h3>
                                <p className="text-[15px] md:text-[16px] text-[var(--ink-mid)] leading-[1.85]">
                                    這週的 AI 不負責「寫」研究問題，負責「審」你寫的研究問題。本週唯一的 AI 工具：<strong className="text-[var(--ink)]">研究問題審核器</strong>（三輪流程）。
                                </p>
                            </div>

                            {/* 選用：AI 補假設小提示（不是完整工具，學生卡住才用）*/}
                            <div className="px-4 py-3 rounded-[var(--radius-unified)] bg-[#FAFAF7] border border-dashed border-[var(--border)] text-[12.5px] text-[var(--ink-mid)] leading-relaxed">
                                <span className="font-bold text-[var(--ink)]">💡 假設展開卡住？選用提示：</span>
                                把你「人腦練習」階段寫的落差 + 列的 3-5 個假設貼給 AI，問：「我可能漏想了哪 1-2 個假設？」AI 補完你再判斷哪些是真的、哪些是它在套話。<strong>但「列假設」這件事必須你先做</strong>——直接叫 AI 列等於跳過 Step 3。
                            </div>

                            {/* 研究問題審核器 — 自寫 → AI 審 → 定稿 */}
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="text-[10px] font-mono uppercase tracking-[0.12em] px-2 py-0.5 rounded bg-[#e6efff] text-[#2d5be3]">AI 協作</span>
                                    <span className="text-[11px] font-mono uppercase tracking-[0.1em] text-[var(--ink-light)]">自寫 → AI 審 → 定稿</span>
                                </div>
                                <h4 className="font-serif text-[18px] md:text-[20px] font-bold text-[var(--ink)] mb-3 leading-[1.4]">
                                    研究問題審核器
                                </h4>
                                <p className="text-[14px] md:text-[15px] text-[var(--ink-mid)] leading-[1.85]">
                                    跑三輪：<strong className="text-[var(--ink)]">先自己挑＋寫</strong> → <strong className="text-[var(--ink)]">給 AI 審</strong> → <strong className="text-[var(--ink)]">由你定稿</strong>。順序倒了就變成 AI 主導、你背書。
                                </p>
                            </div>

                            {/* 第一輪：人腦先行（挑假設+判型+寫草稿） */}
                            <div>
                                <div className="w2-notice warn mb-3">
                                    ★ <strong>第一輪 · 人腦先行：不准用 AI！</strong>挑一個假設、判 ABC 型、自寫一句研究問題草稿。AI 等下要審的就是你寫的這句。
                                </div>
                                <W2Beat1RefCard />
                                <ThinkRecord
                                    dataKey="w2-abc-judgment"
                                    prompt="（1-1）你選哪一個假設？為什麼？它屬於 A / B / C 哪一型？"
                                    placeholder="例：我選假設①「考試壓力」。因為這個變項最容易設計問卷量測，而且我自己就有切身經驗。判斷是 A 型（影響型）——我想看的是壓力對空間選擇的影響。"
                                    scaffold={[
                                        '我選假設 ___（從「人腦練習」階段的清單挑一個）',
                                        '因為 ___（為什麼先研究這個：可量測？切身經驗？社會意義？）',
                                        '判斷是 ___ 型（A 影響型／B 比較型／C 深究型）',
                                    ]}
                                    rows={4}
                                />
                                <div className="mt-4">
                                    <ThinkRecord
                                        dataKey="w2-rq-draft"
                                        prompt="（1-2）根據上面選定的假設＋型，自寫一句研究問題草稿（不必完美，AI 等下會審）"
                                        placeholder="例（A 型）：段考前一週的考試壓力，如何影響松山高中高一學生選擇圖書館作為讀書場所的傾向？"
                                        scaffold={[
                                            'A 型：「___」如何影響「___」',
                                            'B 型：「___」和「___」在「___」上有何不同',
                                            'C 型：「___」背後的「機制／原因」是什麼',
                                        ]}
                                        rows={3}
                                    />
                                </div>
                            </div>

                            {/* 第二輪：AI 審核（動態 Prompt） */}
                            <div>
                                <p className="text-[14px] md:text-[15px] text-[var(--ink-mid)] leading-[1.85]">
                                    <strong className="text-[var(--ink)]">第二輪 · AI 審核：</strong>下方 Prompt 已經把你前面寫的內容（觀察、落差、假設、選定假設、草稿）自動帶進去了。直接按複製貼到 ChatGPT / Claude / Gemini，AI 會回給你「結構審核」+「一個改寫建議」。
                                </p>
                                <W2AuditPrompt />
                            </div>

                            {/* 第三輪：人腦定稿（保留/採用/混合） */}
                            <div>
                                <p className="text-[14px] md:text-[15px] text-[var(--ink-mid)] leading-[1.85]">
                                    <strong className="text-[var(--ink)]">第三輪 · 人腦定稿：</strong>看完 AI 審核，決定怎麼定稿——<strong className="text-[var(--ink)]">保留自己的</strong>（AI 說 OK 或你不認同它的改寫）／<strong className="text-[var(--ink)]">採 AI 改寫</strong>（它的版本更精準）／<strong className="text-[var(--ink)]">混合</strong>（取雙方各一半）。⚠️ AI 不是裁判，你才是。
                                </p>
                            </div>

                            <ThinkRecord
                                dataKey="w2-ai-intent-choice"
                                prompt="AI 審完後，你決定怎麼定稿？為什麼？"
                                placeholder="例：我選混合——AI 抓到我原版漏了「自變項清楚化」，但它建議的『考試壓力指數』太抽象。我採它「指出時間範圍」的改法，但保留我「考試壓力」原詞。"
                                scaffold={[
                                    '我決定：保留自己的／採 AI 改寫／混合',
                                    '因為 AI 點出 ___（什麼結構問題或更好的寫法）',
                                    '但我不接受 AI 的 ___（如果有不接受的部分），因為 ___',
                                ]}
                                rows={4}
                            />

                            <ThinkChoice
                                dataKey="w2-tc2"
                                prompt="小測驗：AI 在「四段式思考」中可以幫忙哪些步驟？"
                                options={[
                                    { label: 'A', text: 'Step 1 + Step 2（觀察現象和發現落差）都可交給 AI' },
                                    { label: 'B', text: 'Step 3 補充假設 + Step 4 翻譯句型——但「挑哪個假設先研究」「最終定哪型」是人決定' },
                                    { label: 'C', text: '全部四個步驟都可以交給 AI' },
                                ]}
                                answer="B"
                                feedback="Step 1 觀察、Step 2 落差、Step 3 列假設這些「動腦」的事必須你先做（AI 沒去過你的學校）。AI 真正幫得上的：Step 3 列完之後幫你補「漏想了什麼」，以及 Step 4 把白話翻譯成學術句型。但研究設計決定（挑哪個假設、定哪一型）必須由你做。"
                                onAnswer={(selected, correct) => trackChoice('AI 可幫忙的步驟', selected, correct)}
                            />
                        </div>
                    ),
                },

                /* ──────── Step 5: 最終研究問題 ──────── */
                {
                    title: '研究問題',
                    icon: '🎯',
                    content: (
                        <div className="flex flex-col gap-8 prose-zh">
                            <div>
                                <div className="text-[10px] font-mono text-[var(--ink-light)] uppercase tracking-[0.12em] mb-3">PART 3 FINAL · 定案 + AI-RED</div>
                                <h3 className="font-serif text-[22px] md:text-[24px] font-bold text-[var(--ink)] mb-4 leading-[1.4]">選定你的研究方向</h3>
                                <p className="text-[15px] md:text-[16px] text-[var(--ink-mid)] leading-[1.85]">
                                    你已經完成「挑假設 → 自寫草稿 → AI 審 → 定稿」四個動作。現在把第三輪定稿的版本改寫成完整的研究問題句（主詞＋動詞＋對象），這就是帶去 W3 的版本。寫完記得填 AI-RED。
                                </p>
                            </div>

                            <W2Step4RefCard />

                            <ThinkRecord
                                dataKey="w2-final-intent"
                                prompt="把第三輪定稿的研究問題寫成完整句子（帶去 W3 的版本）"
                                placeholder="例：我想探究「段考前一週的考試壓力」如何影響「松山高中高一學生對圖書館空間使用」的選擇。"
                                scaffold={[
                                    'A 影響型：我想探究「___」如何影響「___」',
                                    'B 比較型：我想比較「___」和「___」的差異',
                                    'C 深究型：我想深究「___」背後的原因／機制',
                                ]}
                                rows={3}
                            />

                            {/* AI-RED 敘事紀錄（對齊其他週） */}
                            <AIREDNarrative week="2" hint="研究問題審核器是 W2 的 AI 核心工具——記錄一次最關鍵的互動。" optional={false} />
                        </div>
                    ),
                },

                /* ──────── Step 6: 回顧與繳交 ──────── */
                {
                    title: '回顧與繳交',
                    icon: '📋',
                    content: (
                        <div className="flex flex-col gap-8 prose-zh">
                            <div className="bg-white border border-[var(--border)] rounded-[var(--radius-unified)] overflow-hidden">
                                <div className="p-4 px-5 bg-[var(--paper-warm)] border-b border-[var(--border)] font-bold text-[13px]">
                                    ✅ 本週結束，你應該要會
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-[1px] bg-[var(--border)]">
                                    {[
                                        '說出「為什麼」是爛問題的原因，並用四段式框架（觀察 / 落差 / 展開假設 / 鎖定研究問題）改造它',
                                        '面對矛盾時先列 3-5 個可能假設，不只想一個就鎖死',
                                        '區分 A / B / C 三種探究句型，知道各自對應什麼研究方法',
                                        '用 AI 補假設、翻譯句型——但「挑哪個假設」「定哪型」是自己做的',
                                    ].map((item, i) => (
                                        <div key={i} className="p-4 px-5 bg-white flex items-start gap-3">
                                            <span className="text-[var(--success)] text-[16px] mt-0.5 flex-shrink-0">✓</span>
                                            <span className="text-[13px] text-[var(--ink-mid)] leading-relaxed">{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* 反思 — 一題，逼學生點出卡點 */}
                            <ThinkRecord
                                dataKey="w2-reflect-stuck"
                                prompt="✍️ 反思：四段式框架（觀察 → 落差 → 展開假設 → 鎖定研究問題）你卡在哪一段？為什麼那段最難？"
                                placeholder="例：我卡在『展開假設』那段。觀察跟落差還算順，但要我針對同一個矛盾想出 3-5 個可能解釋就卡住——因為平常想事情習慣只想一個答案。後來發現：硬逼自己列第 4、第 5 個假設時，反而冒出意想不到的角度。"
                                scaffold={['我卡在第 ___ 段（觀察 / 落差 / 展開假設 / 鎖定研究問題）', '為什麼最難…', '我後來怎麼處理或還沒處理…']}
                                rows={4}
                            />

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
                                        <p className="next-week-text"><strong className="text-white">你的最終研究問題</strong>——那就是下週的「病人」，沒有帶就沒得健檢。</p>
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
