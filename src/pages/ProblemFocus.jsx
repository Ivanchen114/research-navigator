import React, { useState, useCallback, useEffect } from 'react';
import CourseArc from '../components/ui/CourseArc';
import ThinkRecord from '../components/ui/ThinkRecord';
import ThinkChoice from '../components/ui/ThinkChoice';
import StepEngine from '../components/ui/StepEngine';
import HeroBlock from '../components/ui/HeroBlock';
import TaskCard from '../components/ui/TaskCard';
import ResetWeekButton from '../components/ui/ResetWeekButton';
import CopyButton from '../components/ui/CopyButton';
import StepBriefing from '../components/ui/StepBriefing';
import { readRecords, STORAGE_KEY } from '../components/ui/ThinkRecord';
import { Map } from 'lucide-react';
import LessonMap from '../components/ui/LessonMap';
import BackfillField from '../components/ui/BackfillField';
import { W2Data } from '../data/lessonMaps';
import { ModeProvider, useMode } from '../context/ModeContext';
import { useProjector } from '../context/ProjectorContext';
import ModeSwitch from '../components/ui/ModeSwitch';
import DepthBlock from '../components/ui/DepthBlock';
import ContentTypeChip from '../components/ui/ContentTypeChip';
import RecordDrawer from '../components/ui/RecordDrawer';
import ExportButton from '../components/ui/ExportButton';
import './ProblemFocus.css';

/* ── 資料常數 ── */

const FOUR_STEPS = [
    {
        step: '階段一', short: '觀察', prefix: '', suffix: '現象', name: '觀察現象', who: 'human', whotxt: '先由你觀察',
        how: '像攝影機一樣，具體描述你看到的畫面。不解釋，只描述。',
        ex: '段考前圖書館閱覽室爆滿，連地板都坐人；旁邊的借書區和書架區空無一人，連燈都沒開全。',
    },
    {
        step: '階段二', short: '落差', prefix: '發現', suffix: '', name: '發現落差', who: 'both', whotxt: '人主導，AI 可協助',
        how: '這裡有什麼矛盾？哪裡怪怪的？「應該是⋯但實際上⋯」',
        ex: '圖書館的核心存在應該是「借閱書籍」，但段考期間它變成了只有桌椅功能、沒有閱讀功能的大型K書房。大家湧向圖書館，卻完全不碰最珍貴的資源：書。',
    },
    {
        step: '階段三', short: '假設', prefix: '展開', suffix: '', name: '展開假設', who: 'both', whotxt: '⚠️ 先發散，別急著鎖死',
        how: '這個矛盾背後可能的解釋是什麼？至少 3 個、最多 5 個，不要只想一個就鎖死。',
        ex: '① 考試壓力推學生找個地方讀／② 同儕氛圍（看到別人讀就讀）／③ 圖書館的「讀書感」儀式／④ 空教室沒冷氣、沒安靜感／⑤ 家裡讀不下去。',
    },
    {
        step: '階段四', short: '鎖定', prefix: '', suffix: '研究問題', name: '鎖定研究問題', who: 'ai', whotxt: '人先挑，AI 協助修句',
        how: '從上一段假設中挑一個你最想先研究的，寫成 A／B／C 型句。AI 協助翻譯成學術語言，但「挑哪個」是你的研究設計決定。',
        ex: '【A型】我想探究「考試壓力」如何影響學生對「圖書館空間使用」的選擇。（從 ① 出發；②③ 留待後續研究）',
    },
];

const ABC_TYPES = [
    { l: 'A', t: '影響型', p: '「A 如何影響 B？」', m: '📋 問卷 / 🧪 實驗', e: '例：「考試壓力如何影響圖書館空間選擇？」' },
    { l: 'B', t: '比較型', p: '「A 和 B 有什麼不同？」', m: '📋 問卷 / 📚 資料分析', e: '例：「考前 vs 考後，圖書館使用者行為有何不同？」' },
    { l: 'C', t: '深究型', p: '「A 背後的原因是什麼？」', m: '🎤 訪談 / 👀 觀察', e: '例：「學生選圖書館K書而非空教室的心理原因是什麼？」' },
];

/* PROMPT_AUDIT_TEMPLATE — 研究問題審核器的 Prompt 模板，W2AuditPrompt 動態帶入學生填過的內容。 */
const PROMPT_AUDIT_TEMPLATE = (data) => {
    const fb = (s, label) => s || `[ ${label} ]`;
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
   · A 型：要清楚指出「自變項」（＝你理化課的「操縱變因」，我改的那個條件，例如：考試壓力大小）與「依變項」（＝「應變變因」，我觀察／測量的結果，例如：圖書館空間選擇）
   · B 型：要清楚對照兩個對象／情境
   · C 型：要明確指出「機制／原因」是研究焦點，也就是你想追問「為什麼會這樣」

② 改寫建議：給我 1 個更精準的改寫版本（不超過 1 句），並用 1 句話說明你改了什麼、為什麼。

⚠️ 不要直接幫我換型——如果你覺得我選錯型，請在「結構審核」裡說明，但「改寫版本」請維持我選的型。`;
};

const EXPORT_FIELDS = [
    { key: 'w2-practice1-phenomenon', label: '[暖身 ①垃圾] 現象', question: '像攝影機一樣描述（暖身練習，重點是熟悉三步）' },
    { key: 'w2-practice1-gap', label: '[暖身 ①垃圾] 落差', question: '應該是⋯但實際上⋯（暖身）' },
    { key: 'w2-practice1-hypotheses', label: '[暖身 ①垃圾] 假設', question: '可能的 3-5 個解釋（暖身）' },
    { key: 'w2-practice2-phenomenon', label: '[暖身 ②課堂] 現象', question: '像攝影機一樣描述（暖身）' },
    { key: 'w2-practice2-gap', label: '[暖身 ②課堂] 落差', question: '應該是⋯但實際上⋯（暖身）' },
    { key: 'w2-practice2-hypotheses', label: '[暖身 ②課堂] 假設', question: '可能的 3-5 個解釋（暖身）' },
    { key: 'w2-step1-phenomenon', label: '階段一 現象', question: '像攝影機一樣，你看到了什麼？（至少 30 字）' },
    { key: 'w2-step2-gap', label: '階段二 落差', question: '哪裡跟你想的不一樣？矛盾在哪？' },
    { key: 'w2-step3-question', label: '階段三 展開假設', question: '這個矛盾背後可能的 3-5 個解釋' },
    { key: 'w2-abc-judgment', label: '第一輪：挑選假設＋ABC 型判斷', question: '你選哪個假設？為什麼選它？它屬於 A／B／C 哪型？' },
    { key: 'w2-rq-draft', label: '第一輪：研究問題草稿（自寫）', question: '你自己先寫一句研究問題（給 AI 審用的）' },
    { key: 'w2-ai-intent-choice', label: '第三輪：AI 審核後的決定', question: '審核後你決定保留自己的、採 AI 改寫、還是混合？' },
    { key: 'w2-final-intent', label: '最終研究問題', question: '你的最終研究問題（帶去 W3 的版本）' },
    { key: 'w2-aired-ask', label: 'AI 互動：我問', question: '提示詞的核心是什麼？一句話' },
    { key: 'w2-aired-said', label: 'AI 互動：AI 指出', question: 'AI 說我的問題出在哪？一句話' },
    { key: 'w2-aired-decide', label: 'AI 互動：我決定', question: '保留 / 採用 / 混合，因為？' },
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
                    <span className="text-[11px] font-mono font-bold text-[var(--ink-light)] shrink-0 w-[80px]">階段一 現象</span>
                    <span className="text-[var(--ink-mid)] whitespace-pre-wrap line-clamp-2">{phenomenon}</span>
                </div>
            )}
            {gap && (
                <div className="flex items-baseline gap-2">
                    <span className="text-[11px] font-mono font-bold text-[var(--ink-light)] shrink-0 w-[80px]">階段二 落差</span>
                    <span className="text-[var(--ink-mid)] whitespace-pre-wrap line-clamp-2">{gap}</span>
                </div>
            )}
            {hypotheses && (
                <div className="flex items-start gap-2">
                    <span className="text-[11px] font-mono font-bold text-[var(--accent)] shrink-0 w-[80px] mt-0.5">階段三 假設</span>
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
                label="⚠️ 還沒偵測到「AI 協作」第一輪的挑選——想直接從定稿階段開始？把『我選假設 ___，因為 ___，這是 X 型』貼這裡，下方會根據 ABC 型給你翻譯句型提示。"
                placeholder={'例：我選假設①「考試壓力」，因為這個變項最容易設計問卷量測。我判斷是 A 型（影響型）。'}
                buttonLabel="補上挑選＋判斷"
            />
        );
    }

    const ABC_LABELS = { A: '影響型', B: '比較型', C: '深究型' };
    const ABC_HINT = {
        A: '建議套用句型 1：「我想探究『___』如何影響『___』」',
        B: '建議套用句型 2：「我想比較『___』和『___』的差異」',
        C: '建議套用句型 3：「我想深究『___』背後的原因」',
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
                    <span className="text-[11px] font-mono font-bold text-[var(--ink-light)] shrink-0 w-[88px] mt-0.5">階段三 假設</span>
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
                    <span className="text-[11px] font-mono font-bold text-[var(--ink-light)] shrink-0 w-[88px]">階段一 現象</span>
                    <span className="text-[var(--ink-mid)] whitespace-pre-wrap line-clamp-2">{phenomenon}</span>
                </div>
            )}
            <p className="text-[11px] text-[var(--ink-light)] italic pt-1 border-t border-[var(--border)]">
                💡 這格是參考——把上面審核後定稿的研究問題寫成完整句。
            </p>
        </div>
    );
}

/* ── InlineField：Prompt 框裡的「就地補填」輸入格 ──
 *  onBlur 時寫入 localStorage，觸發 W2AuditPrompt 的 refresh，欄位就變成琥珀高亮。
 *  使用 uncontrolled（無 value prop），避免 1.5s 刷新打斷輸入游標。
 */
function InlineField({ fieldKey, label, multiline, onSave }) {
    const handleBlur = (e) => {
        const val = e.target.value.trim();
        if (!val) return;
        const records = readRecords();
        records[fieldKey] = val;
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(records)); } catch {}
        if (onSave) onSave();
    };
    const cls = [
        'bg-amber-50 border border-amber-300 rounded px-2 py-0.5',
        'text-[12.5px] font-mono text-[var(--ink)]',
        'placeholder:text-[var(--ink-light)] placeholder:italic',
        'outline-none focus:ring-1 focus:ring-amber-400',
        'w-full',
    ].join(' ');
    if (multiline) {
        return <textarea className={`${cls} resize-none block mt-0.5`} rows={3} placeholder={`在這裡填入${label}…`} onBlur={handleBlur} />;
    }
    return <input type="text" className={`${cls} block mt-0.5`} placeholder={`在這裡填入${label}…`} onBlur={handleBlur} />;
}

/* localStorage key 對應表 */
const PROMPT_FIELD_CONFIG = {
    phenomenon: { key: 'w2-step1-phenomenon', label: '現象' },
    gap:        { key: 'w2-step2-gap',        label: '落差' },
    hypotheses: { key: 'w2-step3-question',   label: '假設清單' },
    judgment:   { key: 'w2-abc-judgment',     label: '選定假設與 ABC 判型' },
    draft:      { key: 'w2-rq-draft',         label: '研究問題草稿' },
};

/* ── W2AuditPrompt：動態組「研究問題審核器」Prompt ──
 *  填過的欄位→琥珀高亮；沒填的欄位→就地輸入格（onBlur 寫回 localStorage，同步到前面的 ThinkRecord）
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
        const interval = setInterval(refresh, 1500);
        window.addEventListener('focus', refresh);
        return () => {
            clearInterval(interval);
            window.removeEventListener('focus', refresh);
        };
    }, [refresh]);

    const promptText = PROMPT_AUDIT_TEMPLATE(data);
    const missingCount = [data.phenomenon, data.gap, data.hypotheses, data.judgment, data.draft].filter(v => !v).length;

    /* 填了 → 琥珀底色高亮；沒填 → 就地輸入格（onBlur 寫回 localStorage + 觸發 refresh） */
    const hl = (fieldName) => {
        const val = data[fieldName];
        const { key, label } = PROMPT_FIELD_CONFIG[fieldName];
        if (val) return <span className="bg-amber-100 text-amber-900 rounded px-0.5" style={{ whiteSpace: 'pre-wrap' }}>{val}</span>;
        return <InlineField fieldKey={key} label={label} multiline={fieldName === 'hypotheses' || fieldName === 'judgment'} onSave={refresh} />;
    };

    return (
        <div className="prompt-box mt-4">
            {/* 4 步驟使用說明 — 讓學生第一眼就知道這個方塊要怎麼互動 */}
            <div className="px-4 py-3 bg-[#FEFCE8] border-b border-[#FDE68A] grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5">
                {[
                    { n: '①', t: '橘色文字', d: '你前面填過的，已自動帶入' },
                    { n: '②', t: '空白框', d: '還沒填的，可以直接在這裡補，前面步驟會同步' },
                    { n: '③', t: '確認都有內容', d: '按右上角「複製」把整段 Prompt 複製' },
                    { n: '④', t: '貼到 AI', d: '貼到 ChatGPT / Claude / Gemini，等回覆後再回來填第三輪' },
                ].map(s => (
                    <div key={s.n} className="flex items-start gap-2">
                        <span className="text-[11px] font-mono font-bold text-[#92400E] shrink-0">{s.n}</span>
                        <span className="text-[11.5px] text-[#78350F] leading-[1.6]">
                            <strong>{s.t}</strong> = {s.d}
                        </span>
                    </div>
                ))}
            </div>
            <div className="prompt-hd">
                <span>PROMPT · 研究問題審核器（已自動帶入你寫過的內容）</span>
                <CopyButton text={promptText} label="複製" />
            </div>
            <div className="prompt-body">
                <div className="text-[12.5px] leading-[1.85] font-mono space-y-1.5 text-[var(--ink-mid)]">
                    <p>我是高中生，正在做研究專題。請扮演研究方法老師幫我審核我寫的「研究問題草稿」。</p>
                    <p className="pt-1 font-bold text-[var(--ink)]">【我的四段式思考歷程】</p>
                    <div>觀察現象：{hl('phenomenon')}</div>
                    <div>發現落差：{hl('gap')}</div>
                    <div>列出假設：{hl('hypotheses')}</div>
                    <div>選定假設＋判型：{hl('judgment')}</div>
                    <p className="pt-1 font-bold text-[var(--ink)]">【我的研究問題草稿】</p>
                    <div>{hl('draft')}</div>
                    <p className="pt-1">請你做兩件事：</p>
                    <p>① 結構審核：這個句子有沒有符合我選的型（A 影響型／B 比較型／C 深究型）的結構標準？如果結構漏了什麼，請具體指出。</p>
                    <p className="pl-3">· A 型：要清楚指出「自變項」與「依變項」</p>
                    <p className="pl-3">· B 型：要清楚對照兩個對象／情境</p>
                    <p className="pl-3">· C 型：要明確指出「機制／原因」是研究焦點</p>
                    <p>② 改寫建議：給我 1 個更精準的改寫版本（不超過 1 句），並用 1 句話說明你改了什麼、為什麼。</p>
                    <p className="pt-1">⚠️ 不要直接幫我換型——如果你覺得我選錯型，請在「結構審核」裡說明，但「改寫版本」請維持我選的型。</p>
                </div>
            </div>
            {missingCount > 0 && (
                <div className="px-3 py-2 text-[11px] text-[#1d4ed8] bg-[#eff6ff] border-t border-[var(--border)]">
                    沒填的格可以直接在 Prompt 框裡輸入，填完後前面的步驟也會同步。
                </div>
            )}
        </div>
    );
}

/* ── 看圖暖身：合成圖 + Tab 切換兩個練習 ──
 *  圖片：/public/images/w2/w2-scene-pair.jpg（學生用合成圖一張）
 *  練習各 3 格 ThinkRecord（dataKey: keyPrefix-phenomenon/gap/hypotheses，已納入 EXPORT_FIELDS）
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
                    <span className="text-[11px] font-mono uppercase tracking-[0.1em] text-[var(--ink-light)]">暖身用，重點是熟悉三步</span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                    <ContentTypeChip type="練" />
                    <h4 className="font-serif text-[18px] md:text-[20px] font-bold text-[var(--ink)] m-0 leading-[1.4]">看圖暖身（兩個練習）</h4>
                </div>
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
                    <div className="aspect-[16/9] flex flex-col items-center justify-center gap-2 px-6 text-center text-[12px] text-[var(--ink-mid)] leading-[1.7]">
                        <span>圖片暫時載不出來，先用文字想像場景試做：</span>
                        <span className="text-[var(--ink-light)]">左：垃圾爆滿的角落（公共空間失序）／右：課堂上老師在講課，但學生睡覺、滑手機（學習場域失序）</span>
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

            {/* 焦點提示（圖片載入失敗時隱藏，因為左右方位指示沒有意義） */}
            {!imgError && (
                <div
                    className="px-3 py-2 rounded-[var(--radius-unified)] text-[12px] font-medium"
                    style={{ background: tab.bg, color: tab.accent }}
                >
                    👉 {tab.focus}
                </div>
            )}

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

            <div className="w2-notice block">❌ 階段三 不要只想一個假設就鎖死——研究的起點是承認「答案可能不只一個」。</div>
        </div>
    );
}

/* ── 主組件 ── */

const ProblemFocusContent = () => {
    const { mode } = useMode();
    const { projector } = useProjector();
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
                        <Map size={12} /> {showLessonMap ? '收起流程' : '教師流程'}
                    </button>
                </div>
            </div>

            {showLessonMap && (
                <div className="animate-in slide-in-from-top-4 duration-300">
                    <LessonMap data={W2Data} />
                </div>
            )}

            {/* PAGE HEADER — Hero Block（第一屏只留三句，spec §6-1）*/}
            <HeroBlock
                kicker="R.I.B. 調查檔案 · 研究方法與專題 · W2"
                question="我的好奇，能不能變成可研究的問題？"
                title="問題意識的覺醒："
                accentTitle="把好奇心變成好問題"
                todo={[
                    { label: '今天做什麼', value: '把 W1 的生活觀察，用四段式框架收斂成一個可研究的問題。' },
                    { label: '為什麼做', value: '一句「為什麼」太大不能研究，要先切成「可以拿來研究」的問題。' },
                    { label: '今天交什麼', value: '個人＝W2 學習紀錄（含最終研究問題，帶去 W3）。' },
                ]}
                chain="W1 你偵測到 AI 偽裝者、簽了誠信公約，種下了生活觀察種子——W2 要把那顆種子變成真正可以研究的問題。"
                meta={[
                  { label: '第一節', value: '四段式框架——觀察 → 落差 → 假設 → 鎖定研究問題' },
                  { label: '第二節', value: 'ABC 探究句型 + AI 協作定問題 + 最終題目確認' },
                  { label: '課堂產出', value: '個人 W2 學習紀錄（含最終研究問題，帶去 W3）' },
                  { label: '前置要求', value: 'W1 生活觀察種子（一個讓你好奇的生活現象）' },
                ]}
            />

            {/* 三模式切換 */}
            <ModeSwitch />

            {/* 自學補課路線 — 只在自學模式顯示（spec §5；W2 為 full 週）*/}
            {mode === 'self-study' && (
                <div className="my-5 rounded-[var(--radius-unified)] border-2 border-[#0284C7] bg-[#F0F9FF] p-4 md:p-5">
                    <p className="text-[14px] font-bold text-[#075985] mb-1">📖 自學補課路線 · W2 可「完整自學」</p>
                    <p className="text-[11.5px] text-[#0C4A6E] leading-[1.7] mb-3">
                        W2 全部是個人作業——四段式框架練習、看圖暖身、改寫 W1 觀察、AI 協作三輪、寫最終研究問題，沒有小組或老師示範環節。
                    </p>
                    <ol className="text-[12px] text-[#0C4A6E] leading-[1.85] list-none m-0 p-0 space-y-1">
                        <li><strong>① 先看：</strong>Step 1 四段式框架（觀察／落差／假設／鎖定）＋ ABC 三型</li>
                        <li><strong>② 做：</strong>Step 2 看圖暖身、Step 3 改寫 W1 觀察跑前三步、Step 4 AI 協作三輪、Step 5 寫最終研究問題</li>
                        <li><strong>③ 補紀錄：</strong>暖身三格／人腦練習三格／挑假設＋ABC 判斷／研究問題草稿／AI 審後決定／最終研究問題／AI-RED／反思</li>
                        <li><strong>④ 交：</strong>整理 W2 學習紀錄，依老師指定方式上傳到 Google Classroom</li>
                        <li><strong>⑤ 本週可完整自學</strong>——無需真人環節；若要完成 AI 協作段落，請使用你平常可登入的 AI 工具。</li>
                    </ol>
                    <div className="mt-3 pt-3 border-t border-[#0284C7]/30">
                        <p className="text-[12px] font-bold text-[#075985] mb-1">⛑️ 最低完成版（缺課學生：至少做到這些才算補到核心）</p>
                        <p className="text-[11.5px] text-[#0C4A6E] leading-[1.85] m-0">
                            ① 用四段式框架把 W1 觀察寫成現象／落差／假設三格　② 挑一個假設、判 ABC 型、自寫研究問題草稿　③ 寫最終研究問題（帶去 W3，必填）　④ 填 AI-RED　⑤ 整理 W2 紀錄上傳 Classroom
                        </p>
                    </div>
                </div>
            )}

            {/* 我的紀錄抽屜 — 兩模式都能開（spec §3 方案 A：總覽＋匯出，input 留 Step）*/}
            <RecordDrawer
                weekLabel="W2 問題意識的覺醒"
                fields={EXPORT_FIELDS}
                choices={choiceResults}
            />

            {/* 為什麼是這週 + 本週資訊 — 深度補充 */}

            <CourseArc items={W2Data.courseArc} />

            <TaskCard
                weekNumber="W2"
                weekTitle={W2Data.title}
                duration={`${W2Data.duration} 分鐘 · ${W2Data.durationDesc}`}
                tasks={[
                    '四段式框架練習 — 觀察 → 落差 → 假設 → 鎖定研究問題',
                    'ABC 探究句型 — 從假設中挑一個，套上 A／B／C 三型之一',
                    '把 W1 的「想知道」轉成 W2 的「研究問題」',
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
                                <h3 className="font-serif text-[22px] md:text-[24px] font-bold text-[var(--ink)] mb-4 leading-[1.4]">一句「為什麼」，還不能研究</h3>
                                <p className="text-[15px] md:text-[16px] text-[var(--ink-mid)] leading-[1.85]">
                                    研究不是問十萬個為什麼，而是有層次地把畫面變成學術問題。
                                </p>
                                <div className="mt-4 p-4 rounded-[var(--radius-unified)] bg-[var(--gold-light)] border-l-[4px] border-[var(--gold)]">
                                    <p className="text-[13.5px] text-[var(--ink)] leading-[1.75] m-0">
                                        💡 <strong>這一段你不用背術語</strong>，只要記住兩件事：<strong>先描述畫面</strong>，不急著解釋；<strong>先列多個可能原因</strong>，不急著選答案。
                                    </p>
                                </div>
                            </div>

                            <StepBriefing
                                lines={[
                                    { label: '學', text: '四段式思考框架（觀察→落差→假設→鎖定問題）和 ABC 三種句型' },
                                ]}
                            />


                            {/* 「為什麼還不能研究」示範 — 白底 + 左側紅框，降低整塊彩度 */}
                            <div className="bg-white border border-[var(--border)] border-l-[3px] border-l-[var(--danger)] rounded-[8px] p-5 md:p-6">
                                <div className="text-[11px] font-mono uppercase tracking-[0.12em] text-[var(--danger)] mb-3">
                                    先打破這個習慣
                                </div>
                                <p className="text-[15px] md:text-[16px] text-[var(--ink)] leading-[1.85] mb-4">
                                    「<strong className="text-[var(--danger)]">為什麼圖書館人很多？</strong>」— 太大，還不能直接研究。
                                </p>
                                <p className="text-[14px] md:text-[15px] text-[var(--ink-mid)] leading-[1.85] mb-4">
                                    → 因為要讀書！→ 因為有冷氣！→ 因為要考試！<br />
                                    都對，但你要研究什麼？不知道。問了等於沒問。
                                </p>
                                <p className="text-[14px] md:text-[15px] text-[var(--ink-mid)] leading-[1.85] m-0">
                                    這種問題的特徵：<strong className="text-[var(--ink)]">太大、太空、太發散</strong>——不是不能問，是要<strong className="text-[var(--ink)]">再切一刀</strong>。今天你要學怎麼切。
                                </p>
                            </div>

                            {/* 四段式思考框架 — 壓縮版：大數字 + 一句怎麼想；範例折進 DepthBlock */}
                            <div className="flex items-center gap-2 mb-2">
                                <ContentTypeChip type="學" />
                                <p className="text-[13px] font-bold text-[var(--ink)]">四段式思考框架</p>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {FOUR_STEPS.map((row, i) => (
                                    <div key={i} className="p-4 bg-white rounded-[10px] border border-[var(--border)] flex flex-col gap-2">
                                        <div className="flex items-center gap-2">
                                            <div className="shrink-0 w-6 h-6 flex items-center justify-center rounded font-mono font-bold text-[11px] text-white bg-[var(--accent)]">{i + 1}</div>
                                            <span className="text-[10px] font-mono text-[var(--ink-light)]">{row.step}</span>
                                            <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${row.who === 'human' ? 'bg-[#ECFDF5] text-[#059669]' : row.who === 'ai' ? 'bg-[#EFF6FF] text-[#2563EB]' : 'bg-[var(--paper)] text-[var(--ink-light)]'}`}>{row.whotxt}</span>
                                        </div>
                                        <div className="flex items-baseline gap-1 flex-wrap leading-[1.2]">
                                            {row.prefix && <span className="font-serif text-[16px] text-[var(--ink-mid)]">{row.prefix}</span>}
                                            <span className="font-serif font-bold text-[var(--ink)]" style={{ fontSize: '36px' }}>{row.short}</span>
                                            {row.suffix && <span className="font-serif text-[16px] text-[var(--ink-mid)]">{row.suffix}</span>}
                                        </div>
                                        <div className="text-[12px] text-[var(--ink-mid)] leading-[1.6]">{row.how}</div>
                                    </div>
                                ))}
                            </div>
                            <DepthBlock title="看完整範例">
                                <div className="text-[10px] font-mono text-[var(--ink-light)] uppercase tracking-[0.1em] mb-3">圖書館示範案例（一步一步走）</div>
                                <div className="flex flex-col gap-2">
                                    {FOUR_STEPS.map((row, i) => (
                                        <div key={i} className="flex items-start gap-3 p-3 bg-white rounded-[8px] border border-[var(--border)]">
                                            <div className="shrink-0 w-7 h-7 flex items-center justify-center rounded font-mono font-bold text-[12px] text-white bg-[var(--accent)]">{i + 1}</div>
                                            <div>
                                                <div className="font-bold text-[12px] text-[var(--ink)] mb-1">{row.name}</div>
                                                <div className="text-[12px] text-[var(--ink-mid)] italic leading-[1.65]">{row.ex}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </DepthBlock>

                            {/* ABC 三型快速預覽 — Step 4 判型時才出現完整卡片 */}
                            <div className="flex items-center gap-2 mb-2">
                                <ContentTypeChip type="學" />
                                <p className="text-[13px] font-bold text-[var(--ink)]">三種探究句型（A / B / C）</p>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                {ABC_TYPES.map(card => {
                                    const color = card.l === 'A' ? '#16a34a' : card.l === 'B' ? '#0ea5e9' : '#7c3aed';
                                    const bg = card.l === 'A' ? '#f0fdf4' : card.l === 'B' ? '#f0f9ff' : '#faf5ff';
                                    return (
                                        <div key={card.l} className="p-4 rounded-[10px] border-2 flex flex-col gap-1.5" style={{ background: bg, borderColor: color + '50' }}>
                                            <div className="font-mono font-bold leading-[1]" style={{ fontSize: '40px', color }}>{card.l}</div>
                                            <div className="font-serif font-bold text-[22px] text-[var(--ink)] leading-[1.2]">{card.t}</div>
                                            <div className="text-[12.5px] font-mono leading-[1.6]" style={{ color }}>{card.p}</div>
                                        </div>
                                    );
                                })}
                            </div>
                            <p className="text-[11.5px] text-[var(--ink-light)] mt-1">→ Step 4 挑假設時，每型的完整說明、範例和同一觀察三種切法會再出現。</p>

                            <div className="w2-notice" style={{ margin: 0 }}>
                                💡 拿著你選定的假設問自己：你最想知道的是「影響」、「差異」還是「原因」？這一步先由你判斷，不急著問 AI。
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

                /* ──────── Step 2: 暖身練習（看圖暖身）──────── */
                {
                    title: '暖身練習',
                    icon: '🎯',
                    content: (
                        <div className="flex flex-col gap-8 prose-zh">
                            <div>
                                <div className="text-[10px] font-mono text-[var(--ink-light)] uppercase tracking-[0.12em] mb-3">PART 2 · 第一節課 · 先自己觀察與發散</div>
                                <h3 className="font-serif text-[22px] md:text-[24px] font-bold text-[var(--ink)] mb-4 leading-[1.4]">先用範例練手感</h3>
                                <p className="text-[15px] md:text-[16px] text-[var(--ink-mid)] leading-[1.85]">
                                    用下方兩個範例場景試跑「現象 → 落差 → 展開假設」三步。3 分鐘 / 場景，節奏快、不分享。做完按 Next 進「人腦練習」階段，換你自己的 W1 觀察上場。
                                </p>
                            </div>

                            <StepBriefing
                                lines={[
                                    { label: '練', text: '看圖寫四段式三格（現象、落差、3-5 個假設）——暖身用，重點是熟悉框架' },
                                ]}
                            />

                            <PracticeTabs />
                        </div>
                    ),
                },

                /* ──────── Step 3: 人腦練習（改寫 W1 觀察）──────── */
                {
                    title: '人腦練習',
                    icon: '✍️',
                    content: (
                        <div className="flex flex-col gap-8 prose-zh">
                            <div>
                                <div className="text-[10px] font-mono text-[var(--ink-light)] uppercase tracking-[0.12em] mb-3">PART 2.5 · 第一節課 · 主菜</div>
                                <h3 className="font-serif text-[22px] md:text-[24px] font-bold text-[var(--ink)] mb-4 leading-[1.4]">換你的 W1 觀察上場</h3>
                                <p className="text-[15px] md:text-[16px] text-[var(--ink-mid)] leading-[1.85]">
                                    暖身完了。用你 W1 的生活觀察跑一輪四段框架的前三步——這是後面所有 Step 的起點，10 分鐘，全程人腦。
                                </p>
                            </div>

                            <StepBriefing
                                lines={[
                                    { label: '做', text: '把 W1 的生活觀察改寫成三格：現象、落差、3-5 個可能解釋' },
                                ]}
                            />

                            {/* 練習 0：核心！有 W1 種子 → 顯示帶入；沒有 → 現場補上 */}
                            <div className="flex items-center gap-2 mb-2">
                                <ContentTypeChip type="做" />
                                <p className="text-[13px] font-bold text-[var(--ink)]">改寫你的 W1 觀察（現象 → 落差 → 假設）</p>
                            </div>
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
                                    <div className="w2-notice warn" style={{ marginTop: '12px' }}>⏰ 給你 10 分鐘。這階段先不用 AI，先靠自己的觀察和感受。</div>
                                </div>
                            </div>

                            <ThinkRecord
                                dataKey="w2-step1-phenomenon"
                                prompt="階段一 觀察現象：像攝影機一樣，你看到了什麼？（至少 30 字）"
                                placeholder="描述你觀察到的具體畫面，不解釋，只描述…"
                                scaffold={['在（地點），我看到…', '具體來說…', '（時間/頻率）…']}
                                rows={3}
                            />
                            <ThinkRecord
                                dataKey="w2-step2-gap"
                                prompt="階段二 發現落差：哪裡跟你想的不一樣？矛盾在哪？"
                                placeholder="這裡有什麼矛盾？應該是…但實際上…"
                                scaffold={['應該是…但實際上…', '奇怪的是…', '照理說…卻…']}
                                rows={3}
                            />
                            <ThinkRecord
                                dataKey="w2-step3-question"
                                prompt="階段三 展開假設：這個矛盾背後可能的解釋是什麼？至少 3 個、最多 5 個。先發散，不要只想一個就鎖死。"
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

                /* ──────── Step 4: 人腦先行 ──────── */
                {
                    title: '人腦先行',
                    icon: '🧠',
                    content: (
                        <div className="flex flex-col gap-8 prose-zh">
                            <div>
                                <div className="text-[10px] font-mono text-[var(--ink-light)] uppercase tracking-[0.12em] mb-3">第二節課 · AI 協作準備</div>
                                <h3 className="font-serif text-[22px] md:text-[24px] font-bold text-[var(--ink)] mb-4 leading-[1.4]">先自己挑、自己寫——AI 等下才出場</h3>
                                <p className="text-[15px] md:text-[16px] text-[var(--ink-mid)] leading-[1.85]">
                                    這步驟只靠你自己：從假設清單裡挑一個、判定 ABC 型、自己寫出一句研究問題草稿。寫完才輪到 AI 來審。
                                </p>
                            </div>

                            <StepBriefing
                                lines={[
                                    { label: '做', text: '挑一個假設、定 A/B/C 型、自寫一句研究問題草稿' },
                                    { label: '注意', text: '這一格全程不准用 AI——你寫的草稿是下一步 AI 審核的材料' },
                                ]}
                            />

                            <div className="w2-notice warn">
                                ★ <strong>不准用 AI！</strong>挑一個假設、判 ABC 型、自寫一句研究問題草稿。下一步 AI 要審的就是你在這裡寫的東西——先自己寫才有得審。
                            </div>

                            {/* ABC 三型完整說明 — 判型用 */}
                            <div className="flex items-center gap-2 mb-1">
                                <ContentTypeChip type="學" />
                                <p className="text-[12px] font-bold text-[var(--ink-mid)]">三種探究句型完整說明（判型用）</p>
                            </div>
                            <div className="flex flex-col gap-2">
                                {ABC_TYPES.map(card => (
                                    <div key={card.l} className="bg-white border border-[var(--border)] rounded-[10px] overflow-hidden">
                                        <div className="flex items-center gap-3 px-4 py-2.5" style={{ background: card.l === 'A' ? '#f0fdf4' : card.l === 'B' ? '#f0f9ff' : '#faf5ff' }}>
                                            <span className="shrink-0 w-7 h-7 flex items-center justify-center rounded font-mono font-bold text-[12px] text-white" style={{ background: card.l === 'A' ? '#16a34a' : card.l === 'B' ? '#0ea5e9' : '#7c3aed' }}>{card.l}</span>
                                            <span className="font-bold text-[13.5px] text-[var(--ink)]">{card.t}</span>
                                            <span className="text-[12.5px] text-[var(--ink-mid)]">{card.p}</span>
                                        </div>
                                        <div className="px-4 py-2 text-[12px] text-[var(--ink-mid)] space-y-0.5 border-t border-[var(--border)]">
                                            <div><span className="font-medium text-[var(--ink-light)]">適用方法：</span>{card.m}</div>
                                            <div className="italic text-[var(--ink-light)]">{card.e}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* 三焦點示範卡 — 從 Step 1 移來，「正要判型」時看範例效果最好 */}
                            <DepthBlock title="看完整範例：同一觀察，三種切法">
                            <div className="rounded-[var(--radius-unified)] border-2 border-[var(--accent)]/30 overflow-hidden">
                                <div className="p-4 px-5 bg-[var(--accent-light)] border-b border-[var(--accent)]/20">
                                    <div className="text-[10px] font-mono uppercase tracking-[0.15em] text-[var(--accent)] font-bold mb-1">同一觀察 · 多種切法</div>
                                    <h4 className="font-serif text-[17px] font-bold text-[var(--ink)] leading-[1.5]">同一個觀察，三種研究問題</h4>
                                    <p className="text-[12.5px] text-[var(--ink-mid)] mt-2 leading-[1.75]">
                                        「圖書館段考爆滿」——一個現象，可以切出三個完全不同的研究焦點。<strong>專業研究者的差別不是想出更多答案，而是看出同一個現象有幾種切法</strong>。
                                    </p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[var(--border)]">
                                    {[
                                        {
                                            focus: '壓力越大，越往圖書館跑？',
                                            contrast: '壓力 → 場所',
                                            type: 'A',
                                            typeColor: 'bg-[#16a34a]',
                                            question: '段考壓力越大，高一學生是不是越傾向去圖書館讀書，而不是在家或空教室？壓力的高低真的會改變場所選擇嗎？',
                                        },
                                        {
                                            focus: '考前爆滿，考後冷清',
                                            contrast: '考前 vs 考後',
                                            type: 'B',
                                            typeColor: 'bg-[#0ea5e9]',
                                            question: '大家考前擠爆圖書館，到底是為了「讀書效率」，還是為了緩解「如果不去就沒在讀書」的焦慮感？',
                                        },
                                        {
                                            focus: '又吵又擠，卻覺得好讀書',
                                            contrast: '安靜 vs 擁擠',
                                            type: 'C',
                                            typeColor: 'bg-[#7c3aed]',
                                            question: '當圖書館變得又擠又吵時，為什麼學生還覺得那裡「比較好讀書」？這種「讀書氛圍」是怎麼產生的？',
                                        },
                                    ].map((f, i) => (
                                        <div key={i} className="p-4 px-5 bg-white flex flex-col gap-2">
                                            <div className="flex items-center gap-2">
                                                <span className={`text-white text-[11px] font-bold font-mono px-2 py-0.5 rounded ${f.typeColor}`}>{f.type} 型</span>
                                                <span className="text-[10px] font-mono uppercase tracking-[0.1em] text-[var(--ink-light)]">焦點 {i + 1}</span>
                                            </div>
                                            <div>
                                                <div className="font-bold text-[14px] text-[var(--ink)]">{f.focus}</div>
                                                <div className="text-[11px] font-mono text-[var(--ink-light)] mt-0.5">{f.contrast}</div>
                                            </div>
                                            <p className="text-[12.5px] text-[var(--ink-mid)] leading-[1.7] italic">「{f.question}」</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="p-3 px-5 bg-[var(--paper)] border-t border-[var(--border)] text-[11.5px] text-[var(--ink-light)] leading-[1.7]">
                                    💡 注意：三個焦點都是<strong>同一個觀察</strong>切出來的——這就是 Step 3「先發散 3-5 個假設」的真正用意。<strong>不發散，你就只會看到第一個冒出來的角度</strong>。
                                </div>
                            </div>
                            </DepthBlock>

                            <W2Beat1RefCard />

                            <div className="flex items-center gap-2 mb-1">
                                <ContentTypeChip type="做" />
                                <p className="text-[12px] font-bold text-[var(--ink-mid)]">挑假設 + 判 ABC 型</p>
                            </div>
                            <ThinkRecord
                                dataKey="w2-abc-judgment"
                                prompt="（先挑）你選哪一個假設？為什麼？它屬於 A / B / C 哪一型？"
                                placeholder="例：我選假設①「考試壓力」。因為這個變項最容易設計問卷量測，而且我自己就有切身經驗。判斷是 A 型（影響型）——我想看的是壓力對空間選擇的影響。"
                                scaffold={[
                                    '我選假設 ___（從「人腦練習」階段的清單挑一個）',
                                    '因為 ___（為什麼先研究這個：可量測？切身經驗？社會意義？）',
                                    '判斷是 ___ 型（A 影響型／B 比較型／C 深究型）',
                                ]}
                                rows={4}
                            />

                            <div className="flex items-center gap-2 mb-1">
                                <ContentTypeChip type="做" />
                                <p className="text-[12px] font-bold text-[var(--ink-mid)]">自寫研究問題草稿</p>
                            </div>
                            <ThinkRecord
                                dataKey="w2-rq-draft"
                                prompt="（再寫）根據上面選定的假設＋型，自寫一句研究問題草稿（不必完美，AI 等下會審）"
                                placeholder="例（A 型）：段考前一週的考試壓力，如何影響松山高中高一學生選擇圖書館作為讀書場所的傾向？"
                                scaffold={[
                                    'A 型：「___」如何影響「___」',
                                    'B 型：「___」和「___」在「___」上有何不同',
                                    'C 型：「___」背後的「機制／原因」是什麼',
                                ]}
                                rows={3}
                            />

                            <div className="px-4 py-3 rounded-[var(--radius-unified)] bg-[var(--success-light)] border border-[var(--success)]/30 text-[13px] text-[var(--ink-mid)] leading-[1.75]">
                                ✅ <strong>兩格都填完了嗎？</strong>下一步 AI 會審你寫的這句研究問題——草稿寫得越具體，AI 的審核回饋越有用。
                            </div>
                        </div>
                    ),
                },

                /* ──────── Step 5: AI 協作 ──────── */
                {
                    title: 'AI 協作',
                    icon: '🤖',
                    content: (
                        <div className="flex flex-col gap-8 prose-zh">
                            <div>
                                <div className="text-[10px] font-mono text-[var(--ink-light)] uppercase tracking-[0.12em] mb-3">第二節課 · AI 審核 + 定稿</div>
                                <h3 className="font-serif text-[22px] md:text-[24px] font-bold text-[var(--ink)] mb-4 leading-[1.4]">AI 當教練，你當作者</h3>
                                <p className="text-[15px] md:text-[16px] text-[var(--ink-mid)] leading-[1.85]">
                                    你在 Step 4 已經自己寫好草稿了。這一步把草稿交給 AI 審，看 AI 怎麼說——然後由你決定要不要採納。這就是「人腦 → AI 審 → 人腦定稿」的三輪框架。
                                </p>
                                <p className="text-[12.5px] text-[var(--ink-light)] leading-[1.8] mt-2">
                                    🔖 還記得 W1 你簽的 <strong className="text-[var(--ink-mid)]">I（Inquire・提問紀錄）</strong>嗎？「先自己想 → 再問 AI → 留下紀錄」——你剛才的 Step 4 就是「先自己想」，現在這步是「再問 AI」。
                                </p>
                            </div>

                            <StepBriefing
                                lines={[
                                    { label: '練', text: '把研究問題交給 AI 審，看回饋，決定要不要採納' },
                                    { label: '練', text: 'ThinkChoice：判斷 AI 能幫哪些步驟（AI-RED 的 E）' },
                                ]}
                            />

                            {/* 選用：AI 補假設小提示 */}
                            <div className="px-4 py-3 rounded-[var(--radius-unified)] bg-[#FAFAF7] border border-dashed border-[var(--border)] text-[12.5px] text-[var(--ink-mid)] leading-relaxed">
                                <span className="font-bold text-[var(--ink)]">💡 假設展開在 Step 3 卡住？選用提示：</span>
                                把自己的落差與已列出的假設貼給 AI，請它補 1-2 個可能漏掉的角度。<strong>AI 補出的內容只能當候選角度</strong>——最後仍要由你判斷哪些真的適合研究。
                            </div>

                            {/* 第二輪：AI 審核（動態 Prompt） */}
                            <div>
                                <p className="text-[14px] md:text-[15px] text-[var(--ink-mid)] leading-[1.85]">
                                    <strong className="text-[var(--ink)]">第二輪 · AI 審核：</strong>下方 Prompt 已經把你 Step 3–4 寫的內容（觀察、落差、假設、選定假設、草稿）自動帶進去了。確認橘色欄位都有內容後，按右上角複製，貼到 ChatGPT / Claude / Gemini，等 AI 回覆。
                                </p>
                                <W2AuditPrompt />
                            </div>

                            {/* 第三輪：人腦定稿 */}
                            <div>
                                <p className="text-[14px] md:text-[15px] text-[var(--ink-mid)] leading-[1.85]">
                                    <strong className="text-[var(--ink)]">第三輪 · 人腦定稿：</strong>看完 AI 的結構審核，決定怎麼處理——<strong className="text-[var(--ink)]">保留自己的</strong>／<strong className="text-[var(--ink)]">採 AI 改寫</strong>／<strong className="text-[var(--ink)]">混合</strong>。⚠️ 重點不是「採不採 AI」，而是你能說出 AI 指出了什麼、你認不認同那個問題。
                                </p>
                            </div>

                            <ThinkRecord
                                dataKey="w2-ai-intent-choice"
                                prompt="AI 審完後，你怎麼回應它的意見？"
                                placeholder="例：AI 在結構審核裡說我的 A 型句子沒有清楚指出「依變項」——我認同這個問題，因為「選擇圖書館的傾向」確實不夠清楚。我把它改成「選擇圖書館作為主要讀書場所的比例」，採 AI 的改法，但保留了我自己的「段考前一週」這個時間範圍。"
                                scaffold={[
                                    'AI 在「結構審核」裡說：___（具體說了什麼問題）',
                                    '我認同 / 不認同這個問題，因為：___',
                                    '所以我決定（保留自己的／採 AI 改寫／混合）：___',
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
                                feedback="階段一觀察、階段二落差、階段三列假設這些「動腦」的事必須你先做（AI 沒去過你的學校）。AI 真正幫得上的：階段三列完後提醒你可能漏想的角度，以及階段四幫你檢查研究問題句型是否清楚。但研究設計決定（挑哪個假設、定哪一型）必須由你做。"
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
                                    你已經完成「挑假設 → 自寫草稿 → AI 審 → 定稿」四個動作。現在把第三輪定稿的版本改寫成完整的研究問題句（像「我想探究 ___ 如何影響 ___」這種完整句），這就是帶去 W3 的版本。寫完記得填 AI-RED。
                                </p>
                            </div>

                            <StepBriefing
                                lines={[
                                    { label: '做', text: '寫下最終研究問題——這就是 W3 要健檢的版本' },
                                ]}
                            />

                            <W2Step4RefCard />

                            <div className="flex items-center gap-2 mb-2">
                                <ContentTypeChip type="做" />
                                <p className="text-[13px] font-bold text-[var(--ink)]">寫下最終研究問題（帶去 W3）</p>
                            </div>
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

                            {/* AI-RED 快速版（W2 專屬填空版，取代全格式 AI-RED） */}
                            <div className="bg-[var(--paper-warm)] border border-[var(--border)] rounded-[var(--radius-unified)] overflow-hidden">
                                <div className="px-4 py-2.5 bg-[var(--paper)] border-b border-[var(--border)] flex items-center gap-2">
                                    <span className="text-[10px] font-mono font-bold uppercase tracking-[0.12em] text-[var(--ink-light)]">AI-RED · 快速版</span>
                                    <span className="text-[10px] text-[var(--ink-light)]">— 三句話，2 分鐘填完</span>
                                </div>
                                <div className="px-4 pt-3 pb-1 text-[11.5px] text-[var(--ink-light)] leading-[1.7]">
                                    W2 的 AI 互動細節已記錄在上方「研究問題審核器」Prompt 框裡，這裡只需要用三句話提煉最關鍵的決策過程，對應 AI-RED 的核心三要素。
                                </div>
                                <div className="p-4 space-y-3">
                                    <ThinkRecord
                                        dataKey="w2-aired-ask"
                                        prompt="A（Ask 提問）我問 AI：提示詞的核心是什麼？一句話。"
                                        placeholder="例：我請 AI 審核我的 A 型研究問題草稿，看結構有沒有清楚指出自變項和依變項。"
                                        rows={2}
                                    />
                                    <ThinkRecord
                                        dataKey="w2-aired-said"
                                        prompt="I+R（Interact 互動 · Review 審視）AI 指出：它說我的問題出在哪？一句話。"
                                        placeholder="例：AI 說我的依變項「選擇圖書館的傾向」不夠具體，無法量測。"
                                        rows={2}
                                    />
                                    <ThinkRecord
                                        dataKey="w2-aired-decide"
                                        prompt="E+D（Evaluate 評估 · Decide 決定）我決定：保留 / 採用 / 混合，因為？"
                                        placeholder="例：混合——保留我的時間範圍「段考前一週」，但採 AI 的改法把依變項改成「選擇圖書館作為主要讀書場所的比例」。"
                                        rows={2}
                                    />
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
                        </div>
                    ),
                },

                /* ──────── Step 6: 回顧與繳交 ──────── */
                {
                    title: '回顧與繳交',
                    icon: '📋',
                    content: (
                        <div className="flex flex-col gap-8 prose-zh">
                            <StepBriefing
                                lines={[
                                    { label: '做', text: '寫下你最卡的一段，整理 W2 學習紀錄' },
                                ]}
                            />

                            <div className="bg-white border border-[var(--border)] rounded-[var(--radius-unified)] overflow-hidden">
                                <div className="p-4 px-5 bg-[var(--paper-warm)] border-b border-[var(--border)] font-bold text-[13px]">
                                    ✅ 本週結束，你應該要會
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-[1px] bg-[var(--border)]">
                                    {[
                                        '說出一句「為什麼」為什麼還不能直接研究，並用四段式框架（觀察 / 落差 / 展開假設 / 鎖定研究問題）把它切成可研究的問題',
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

                            {/* 一鍵複製繳交 */}
                            <div className="bg-[#EFF6FF] border-2 border-[#1E40AF] rounded-[var(--radius-unified)] p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <ContentTypeChip type="交出" />
                                    <span className="text-[10px] font-mono font-bold bg-[#1E40AF] text-white px-2 py-0.5 rounded-[3px] uppercase tracking-wider">📤 最後一步</span>
                                    <span className="text-[14px] font-bold text-[#1E40AF]">複製 W2 學習紀錄 → 貼 Google Classroom</span>
                                </div>
                                <p className="text-[12px] text-[#1E3A8A] leading-relaxed mb-3">
                                    包含：三焦點練習／我的改寫題目／AI 輔助紀錄（如有）。W3 診斷課會接這份。
                                </p>
                                <ExportButton
                                    weekLabel="W2 焦點轉化"
                                    fields={EXPORT_FIELDS}
                                    buttonText="複製 W2 學習紀錄"
                                />
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

export const ProblemFocus = () => (
    <ModeProvider week="W2">
        <ProblemFocusContent />
    </ModeProvider>
);
