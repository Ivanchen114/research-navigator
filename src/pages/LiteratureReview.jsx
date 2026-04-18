import React, { useState, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CourseArc from '../components/ui/CourseArc';
import ThinkRecord from '../components/ui/ThinkRecord';
import AIREDNarrative from '../components/ui/AIREDNarrative';
import ThinkChoice from '../components/ui/ThinkChoice';
import StepEngine from '../components/ui/StepEngine';
import HeroBlock from '../components/ui/HeroBlock';
import ExportButton from '../components/ui/ExportButton';
import { readRecords, STORAGE_KEY } from '../components/ui/ThinkRecord';
import {
    Map,
    ArrowRight,
    CheckCircle2,
    ShieldAlert,
    EyeOff,
} from 'lucide-react';
import LessonMap from '../components/ui/LessonMap';
import { W5Data } from '../data/lessonMaps';
import '../pages/LiteratureReview.css';

/* ══════════════════════════════════════
 *  資料常數
 * ══════════════════════════════════════ */

/* — 觀念 1：換字抄襲 vs 真正改寫 — */
const PLAGIARISM_COMPARE = {
    original: '陳明（2022）發現，每天睡前使用手機超過 90 分鐘的學生，睡眠品質顯著較差。',
    bad: {
        label: '❌ 換字抄襲',
        text: '此研究發現，每日睡前滑手機超過 90 分鐘之學生，其睡眠品質明顯比較差。',
        explain: '只換了詞，句子結構完全一樣！',
    },
    good: {
        label: '✅ 真正的改寫',
        text: '陳明（2022）的研究指出，高中生睡前的手機使用習慣與睡眠品質有關，使用時間越長，睡眠狀況越差。',
        explain: '用自己的話重新整理，保留意思但不照抄結構。',
    },
};

/* — 觀念 2：三明治引用法 — */
const SANDWICH_LAYERS = [
    { layer: 1, role: '觀點句', emoji: '🍞', color: 'var(--accent)', func: '說出你的論點（Claim）', example: '社群媒體的過度使用可能對青少年心理健康造成負面影響。' },
    { layer: 2, role: '引用句', emoji: '🥩', color: 'var(--danger)', func: '引用支持的研究（Evidence）', example: '陳美玲（2021）針對北部高中生的研究發現，每日使用社群媒體超過三小時者，焦慮量表得分顯著較高。' },
    { layer: 3, role: '分析句', emoji: '🍞', color: 'var(--success)', func: '解釋為什麼重要（Analysis）', example: '這顯示社群媒體使用量與情緒狀態之間存在關聯，長時間使用可能不利於心理健康。' },
];

/* — 觀念 3：多文獻整合 — */
const INTEGRATION_STRUCTURE = [
    { position: '第一句（破題）', func: '帶出主題，說明已有研究', sample: '「關於＿＿，已有不少研究探討。」' },
    { position: '第二—四句（文獻帶入）', func: '分別帶入 3 篇文獻發現，用自己的話串連', sample: '「某某（年份）發現⋯⋯進一步指出⋯⋯此外⋯⋯」' },
    { position: '最後一句（連回題目）', func: '綜合並連回自己的研究方向', sample: '「綜合以上研究，⋯⋯這與本研究想探討的方向一致。」' },
];

/* — 演練 1：改寫偵錯 — */
const ORIGINAL_PASSAGE = {
    author: '王大明（2022）',
    text: '王大明（2022）以新北市高中生為對象（N = 326），以睡眠品質量表與手機使用問卷進行調查。結果顯示，每日睡前使用手機超過 90 分鐘者，其睡眠品質顯著較差（p < .01），且白天嗜睡程度也較高。',
};

const STUDENT_A = {
    text: '此研究針對新北市高中學生（N = 326），使用睡眠量表與手機問卷進行調查，發現每天睡前滑手機超過 90 分鐘之學生，睡眠品質明顯比較差（p < .01），白天也容易打瞌睡。',
    issues: [
        { id: 'a-swap', label: '換字抄襲——只換了字詞，句子結構完全一樣' },
        { id: 'a-nocite', label: '沒有引用——沒有標注（作者，年份）' },
        { id: 'a-incomplete', label: '資訊不完整——重要發現沒有帶到' },
    ],
};

const STUDENT_B = {
    text: '有研究發現，過度使用手機會影響睡眠。',
    issues: [
        { id: 'b-swap', label: '換字抄襲——只換了字詞，句子結構完全一樣' },
        { id: 'b-nocite', label: '沒有引用——沒有標注（作者，年份）' },
        { id: 'b-vague', label: '太模糊——沒有帶到具體的研究對象或數據' },
    ],
};

/* — 演練 3：四組素材包 — */
const MATERIAL_PACKS = [
    {
        id: 'A', label: '媒體識讀', subtitle: '數位時代的訊息辨識能力',
        sources: [
            { author: '林政達（2022）', summary: '以全台高中生為對象（N = 850），研究發現超過六成學生在收到通訊軟體（如 LINE）轉發的健康資訊時，不會主動進行事實查核，容易受到誇大標題或片面內容影響。' },
            { author: '台灣事實查核中心（2023）', summary: '分析指出，錯誤訊息常利用「恐懼」或「對立」等情緒進行傳播。這類具高度情感煽動性的內容，其擴散速度比一般正確資訊更快。' },
            { author: '蘇怡文（2021）', summary: '針對實施「數位識讀課程」的班級進行實驗（N = 120），結果顯示學習過查核工具的學生，對假新聞的敏感度顯著提升，且分享錯誤訊息的行為下降。' },
        ],
    },
    {
        id: 'B', label: '心理健康', subtitle: '社群媒體使用與青少年焦慮',
        sources: [
            { author: '陳美玲（2021）', summary: '以北部四所高中生為對象（N = 412），研究發現每日使用社群媒體超過 3 小時者，其焦慮量表得分顯著較高，顯示長時間接觸社群媒體可能增加心理負擔。' },
            { author: '林志豪（2022）', summary: '針對中部高中生進行研究（N = 356），發現越常在社群平台上進行外貌比較的學生，對自我形象的滿意度越低，且自尊感有下降趨勢。' },
            { author: '王怡君（2023）', summary: '以南部高中生為樣本（N = 389），研究指出睡前使用社群媒體時間越長，睡眠品質越差，並更容易出現白天疲倦與注意力不集中的情形。' },
        ],
    },
    {
        id: 'C', label: '生成式 AI', subtitle: '生成式 AI 對自主學習的影響',
        sources: [
            { author: '吳大中（2023）', summary: '調查高中生使用 ChatGPT 輔助寫作的情形（N = 250），發現 AI 能有效降低寫作初期的焦慮感，但若過度依賴，可能導致個人風格流失。' },
            { author: '張雅筑（2024）', summary: '針對學術倫理進行研究，發現若學生缺乏批判性思考能力，在使用 AI 蒐集資料時，約有 40% 的機率會誤信 AI 所生成的錯誤資訊。' },
            { author: '黃國華（2023）', summary: '實驗發現，採取「人機協作」模式的學生，在創意表現與邏輯組織上，均優於完全人工或完全仰賴 AI 產出的作品。' },
        ],
    },
    {
        id: 'D', label: '環境永續', subtitle: '青少年的減塑認知與行為落差',
        sources: [
            { author: '陳志明（2020）', summary: '調查顯示，雖然 85% 的高中生認同環保減塑的重要性，但在日常生活中固定自備環保杯與餐具的比例不到 30%，顯示認知與行動之間存在落差。' },
            { author: '綠色和平組織（2022）', summary: '研究指出，微塑膠已透過食物鏈進入生物體，長期累積可能對生態系統及人體健康造成負面影響，顯示減塑議題具有迫切性。' },
            { author: '李佳穎（2023）', summary: '研究發現，「同儕效應」是影響環保行為的重要因素。當班級中推動集體減塑競賽時，學生的減塑行為執行率提升 45%，顯著優於單純宣導教育。' },
        ],
    },
];

/* — 寫作鷹架 — */
const SCAFFOLD_A = '關於＿＿＿＿，已有不少研究進行探討。首先，＿＿（作者，年份）發現，＿＿＿＿。此外，＿＿（作者，年份）也指出，＿＿＿＿。進一步來看，＿＿（作者，年份）認為，＿＿＿＿。綜合以上研究可見，＿＿＿＿，這也與本研究想探討的＿＿＿＿有關。';
const SCAFFOLD_B = '綜觀現有關於＿＿＿＿的研究，學者多從＿＿＿＿與＿＿＿＿等面向進行探討。例如，＿＿（作者，年份）發現＿＿＿＿；而＿＿（作者，年份）也指出＿＿＿＿。這兩項研究都顯示，＿＿＿＿。另外，＿＿（作者，年份）從另一個角度提出＿＿＿＿，補充了前述研究的理解。綜合以上文獻可知，＿＿＿＿，因此本研究想進一步探討＿＿＿＿。';

const SENTENCE_TOOLKIT = [
    { cat: '破題句', items: ['關於＿＿，已有許多研究進行探討。', '近年來，愈來愈多研究開始關注＿＿。', '在＿＿方面，相關研究已提出不少發現。'] },
    { cat: '串連文獻', items: ['首先，＿＿（作者，年份）指出……', '此外，＿＿（作者，年份）也發現……', '進一步來看，＿＿（作者，年份）認為……', '與此相似，＿＿（作者，年份）發現……', '從另一個角度來看，＿＿（作者，年份）則指出……'] },
    { cat: '綜合分析', items: ['由此可見，＿＿。', '綜合上述研究，可以發現＿＿。', '這些研究共同顯示＿＿。'] },
    { cat: '連回題目', items: ['這與本研究欲探討的＿＿有密切關聯。', '因此，本研究想進一步了解＿＿。', '這也成為本研究關注＿＿的重要理由。'] },
];

/* — 同儕會診 — */
const PEER_REVIEW_ITEMS = [
    { id: 'pr-rewrite', label: '改寫與整合', question: '這段文獻探討有沒有用自己的話整理三篇研究？是否避免了逐條翻寫或換字抄襲？' },
    { id: 'pr-cite', label: '引用格式', question: '每次提到文獻時，是否都有正確標示（作者，年份）？' },
    { id: 'pr-logic', label: '文獻完整性與邏輯', question: '三篇文獻是否都有帶到？句子之間是否有邏輯關係，而不是排排站？' },
    { id: 'pr-link', label: '總結與連回題目', question: '最後一句是否有統整文獻，並連回自己的研究題目？' },
];

/* — 匯出欄位 — */
const EXPORT_FIELDS = [
    { key: 'w6-detect-a', label: '學生甲偵錯', question: '學生甲的改寫有什麼問題？你勾了哪些、理由是什麼？' },
    { key: 'w6-detect-b', label: '學生乙偵錯', question: '學生乙的改寫有什麼問題？你勾了哪些、理由是什麼？' },
    { key: 'w6-my-rewrite', label: '我的改寫', question: '把原文遮住，用自己的話改寫王大明（2022）的研究發現' },
    { key: 'w6-sandwich-ref', label: '三明治引用：選用文獻', question: '你用哪篇文獻來練三明治引用？（作者年份）' },
    { key: 'w6-sandwich-claim', label: '三明治：觀點句', question: '第 1 層觀點句——你的主張是什麼？' },
    { key: 'w6-sandwich-evidence', label: '三明治：引用句', question: '第 2 層引用句——某某（年份）發現了什麼？' },
    { key: 'w6-sandwich-analysis', label: '三明治：分析句', question: '第 3 層分析句——這個證據說明了什麼？跟你的研究有什麼關係？' },
    { key: 'w6-lit-review', label: '文獻探討段落（演練3）', question: '用三篇文獻寫出至少 5 句的文獻探討，最後一句連回你的研究題目' },
    { key: 'w6-peer-review', label: '同儕幫我審查的結果', question: '同儕幫你審查演練 3 後，給了什麼具體建議？你根據建議修改了什麼？' },
    { key: 'w6-aired-record', label: 'AI-RED 敘事紀錄', question: '本週最重要的一次 AI 互動（A-I-R-E-D 五要素）' },
];

/* ══════════════════════════════════════
 *  主組件
 * ══════════════════════════════════════ */

export const LiteratureReview = () => {
    const [showLessonMap, setShowLessonMap] = useState(false);
    const [choiceResults, setChoiceResults] = useState([]);

    /* 演練 1：學生甲乙勾選 */
    const [checksA, setChecksA] = useState({ 'a-swap': false, 'a-nocite': false, 'a-incomplete': false });
    const [checksB, setChecksB] = useState({ 'b-swap': false, 'b-nocite': false, 'b-vague': false });

    /* 演練 3：素材包選擇 */
    const [selectedPack, setSelectedPack] = useState('');

    /* 句型工具箱展開 */
    const [showToolkit, setShowToolkit] = useState(false);

    /* 同儕會診勾選 */
    const [peerChecks, setPeerChecks] = useState({ 'pr-rewrite': '', 'pr-cite': '', 'pr-logic': '', 'pr-link': '' });

    /* W5 文獻帶入 */
    const [w5Paper, setW5Paper] = useState('');

    useEffect(() => {
        const records = readRecords();
        const w5Val = records['w5-found-paper'] || '';
        setW5Paper(w5Val);
        // 如果 w6-sandwich-ref 還是空的，自動帶入 W5 的文獻
        if (w5Val && !records['w6-sandwich-ref']) {
            records['w6-sandwich-ref'] = w5Val;
            localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
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
         * STEP 1: 換字抄襲 + 改寫偵錯
         * ────────────────────────────────────── */
        {
            title: '換字抄襲 → 改寫偵錯',
            icon: '🔍',
            content: (
                <div className="space-y-8 prose-zh">
                    {/* ── 觀念 1 ── */}
                    <div className="section-head"><h2>觀念：換字抄襲 vs. 真正的改寫</h2><div className="line"></div><span className="mono">15 分鐘</span></div>

                    <div className="notice notice-accent text-[13px] leading-relaxed">
                        偵探社的工作只有一件事——<strong>找出文獻裡的問題，然後寫出一份任何人都挑不出毛病的文獻探討。</strong><br /><br />
                        第一種犯罪手法叫<strong>換字抄襲</strong>：結構一模一樣、骨架一模一樣，只是穿了一件不同的衣服。
                    </div>

                    <p className="section-desc">
                        改寫不是把詞換掉——<strong>改寫是用你自己的話說出作者的發現。</strong>
                    </p>

                    {/* 原文 */}
                    <div className="bg-[var(--paper-warm)] border border-[var(--border)] rounded-lg p-5 mb-4">
                        <div className="text-[11px] font-mono text-[var(--ink-light)] uppercase tracking-wider mb-2">【原文】</div>
                        <p className="text-[14px] text-[var(--ink)] leading-relaxed">{PLAGIARISM_COMPARE.original}</p>
                    </div>

                    {/* 對照 */}
                    <div className="content-grid" style={{ '--cols': 2 }}>
                        <div className="bg-[var(--danger-light)] border border-[var(--danger)]/30 rounded-lg p-5">
                            <div className="font-bold text-[var(--danger)] text-[14px] mb-2">{PLAGIARISM_COMPARE.bad.label}</div>
                            <p className="text-[13px] text-[var(--ink-mid)] leading-relaxed mb-3 italic">「{PLAGIARISM_COMPARE.bad.text}」</p>
                            <div className="text-[12px] text-[var(--danger)] font-medium">→ {PLAGIARISM_COMPARE.bad.explain}</div>
                        </div>
                        <div className="bg-[var(--success-light)] border border-[var(--success)]/30 rounded-lg p-5">
                            <div className="font-bold text-[var(--success)] text-[14px] mb-2">{PLAGIARISM_COMPARE.good.label}</div>
                            <p className="text-[13px] text-[var(--ink-mid)] leading-relaxed mb-3 italic">「{PLAGIARISM_COMPARE.good.text}」</p>
                            <div className="text-[12px] text-[var(--success)] font-medium">→ {PLAGIARISM_COMPARE.good.explain}</div>
                        </div>
                    </div>

                    {/* 遮蓋測試 */}
                    <div className="bg-white border-2 border-[var(--ink)] rounded-xl p-5 flex items-start gap-4">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[var(--ink)] text-white flex items-center justify-center">
                            <EyeOff size={18} />
                        </div>
                        <div>
                            <div className="font-bold text-[var(--ink)] text-[14px] mb-1">偵探工具：遮蓋測試</div>
                            <p className="text-[13px] text-[var(--ink-mid)] leading-relaxed">
                                把原文遮起來。只看你自己寫的版本，問自己：<strong>沒有原文，這段話還站得住腳嗎？</strong><br />
                                換字抄襲的人，原文一遮就寫不下去——因為他根本沒有讀懂。<br />
                                真正改寫的人，就算原文消失，他也說得出這篇研究在說什麼——因為他懂了。
                            </p>
                        </div>
                    </div>

                    {/* ── 演練 1 ── */}
                    <div className="section-head mt-12"><h2>演練 1：改寫偵錯</h2><div className="line"></div><span className="mono">15 分鐘</span></div>
                    <p className="section-desc">
                        讀原文，審查學生甲和學生乙的改寫版本，找出問題，然後自己寫一個正確的改寫。
                    </p>

                    {/* 原文 */}
                    <div className="bg-[var(--ink)] text-white rounded-xl p-6">
                        <div className="text-[11px] font-mono text-[var(--ink-light)] uppercase tracking-wider mb-3">▌ 原文發現（請勿抄寫這段）</div>
                        <p className="text-[14px] leading-relaxed">{ORIGINAL_PASSAGE.text}</p>
                    </div>

                    {/* 學生甲 */}
                    <div className="bg-white border border-[var(--border)] rounded-xl overflow-hidden">
                        <div className="p-4 px-5 bg-[var(--danger-light)] border-b border-[var(--border)] font-bold text-[13px] text-[var(--danger)]">
                            ▌ 學生甲的改寫
                        </div>
                        <div className="p-5">
                            <p className="text-[13px] text-[var(--ink-mid)] leading-relaxed italic mb-4">「{STUDENT_A.text}」</p>
                            <div className="text-[12px] font-bold text-[var(--ink)] mb-3">學生甲的問題（可複選）：</div>
                            <div className="space-y-2">
                                {STUDENT_A.issues.map(issue => (
                                    <label key={issue.id} className="flex items-start gap-3 cursor-pointer group">
                                        <div
                                            className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${checksA[issue.id] ? 'bg-[var(--danger)] border-[var(--danger)] text-white' : 'border-[var(--border)] group-hover:border-[var(--ink-light)]'}`}
                                            onClick={() => setChecksA(prev => ({ ...prev, [issue.id]: !prev[issue.id] }))}
                                        >
                                            {checksA[issue.id] && <CheckCircle2 size={12} />}
                                        </div>
                                        <span className="text-[13px] text-[var(--ink-mid)]">{issue.label}</span>
                                    </label>
                                ))}
                            </div>
                            <ThinkRecord
                                dataKey="w6-detect-a"
                                prompt="說明：學生甲的改寫哪裡有問題？"
                                scaffold={['學生甲的問題在於…', '結構上…']}
                                rows={3}
                            />
                        </div>
                    </div>

                    {/* 學生乙 */}
                    <div className="bg-white border border-[var(--border)] rounded-xl overflow-hidden">
                        <div className="p-4 px-5 bg-[var(--gold-light)] border-b border-[var(--border)] font-bold text-[13px] text-[var(--gold)]">
                            ▌ 學生乙的改寫
                        </div>
                        <div className="p-5">
                            <p className="text-[13px] text-[var(--ink-mid)] leading-relaxed italic mb-4">「{STUDENT_B.text}」</p>
                            <div className="text-[12px] font-bold text-[var(--ink)] mb-3">學生乙的問題（可複選）：</div>
                            <div className="space-y-2">
                                {STUDENT_B.issues.map(issue => (
                                    <label key={issue.id} className="flex items-start gap-3 cursor-pointer group">
                                        <div
                                            className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${checksB[issue.id] ? 'bg-[var(--gold)] border-[var(--gold)] text-white' : 'border-[var(--border)] group-hover:border-[var(--ink-light)]'}`}
                                            onClick={() => setChecksB(prev => ({ ...prev, [issue.id]: !prev[issue.id] }))}
                                        >
                                            {checksB[issue.id] && <CheckCircle2 size={12} />}
                                        </div>
                                        <span className="text-[13px] text-[var(--ink-mid)]">{issue.label}</span>
                                    </label>
                                ))}
                            </div>
                            <ThinkRecord
                                dataKey="w6-detect-b"
                                prompt="說明：學生乙的改寫哪裡有問題？"
                                scaffold={['學生乙的問題在於…', '缺少了…']}
                                rows={3}
                            />
                        </div>
                    </div>

                    {/* 我的改寫 */}
                    <div className="bg-white border-2 border-[var(--ink)] rounded-xl overflow-hidden">
                        <div className="p-4 px-5 bg-[var(--ink)] text-white font-bold text-[13px] flex items-center gap-2">
                            <EyeOff size={16} /> ▌ 我的改寫（用自己的話，記得加（作者，年份））
                        </div>
                        <div className="p-5">
                            <div className="notice notice-accent text-[12px] mb-4">
                                💡 把原文遮住，憑你的理解寫。用<strong>遮蓋測試</strong>驗證：沒有原文，這段話能不能獨立成立？
                            </div>
                            <ThinkRecord
                                dataKey="w6-my-rewrite"
                                prompt="用你自己的話改寫王大明（2022）的研究發現："
                                scaffold={['王大明（2022）的研究指出…', '其結果顯示…', '這意味著…']}
                                rows={5}
                            />
                        </div>
                    </div>

                    <ThinkChoice
                        question="以下哪個是「遮蓋測試」的核心判斷標準？"
                        options={[
                            { label: 'A', text: '看改寫有沒有用到跟原文不一樣的詞彙' },
                            { label: 'B', text: '把原文遮住後，改寫能不能獨立成立、不依賴原文結構' },
                            { label: 'C', text: '比較原文和改寫的字數是否相同' },
                        ]}
                        answer="B"
                        onAnswer={trackChoice}
                    />
                </div>
            ),
        },

        /* ──────────────────────────────────────
         * STEP 2: 三明治引用法 + 三明治實戰
         * ────────────────────────────────────── */
        {
            title: '三明治引用法 → 實戰',
            icon: '🥪',
            content: (
                <div className="space-y-8 prose-zh">
                    {/* ── 觀念 2 ── */}
                    <div className="section-head"><h2>觀念：三明治引用法</h2><div className="line"></div><span className="mono">15 分鐘</span></div>
                    <p className="section-desc">
                        文獻引用不是甩出一句別人說的話——<strong>你要告訴讀者這句話為什麼重要。</strong>
                    </p>

                    <div className="bg-white border border-[var(--border)] rounded-xl overflow-hidden">
                        {SANDWICH_LAYERS.map((layer, i) => (
                            <div key={i} className={`flex items-start gap-4 p-5 ${i < SANDWICH_LAYERS.length - 1 ? 'border-b border-[var(--border)]' : ''}`}>
                                <div className="text-[24px] flex-shrink-0">{layer.emoji}</div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-1">
                                        <span className="font-bold text-[14px]" style={{ color: layer.color }}>第 {layer.layer} 層　{layer.role}</span>
                                        <span className="text-[11px] text-[var(--ink-light)] font-mono">{layer.func}</span>
                                    </div>
                                    <p className="text-[13px] text-[var(--ink-mid)] leading-relaxed italic">「{layer.example}」</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="notice notice-gold text-[12px]">
                        💡 <strong>第 3 層是最常被省略的，也是最關鍵的。</strong>少了它，你的引用就是沒有結論的案件。三層合起來，才是完整的引用。
                    </div>

                    <ThinkChoice
                        question="三明治引用法的第 3 層（分析句）的功能是什麼？"
                        options={[
                            { label: 'A', text: '重複第 2 層的引用內容，換個說法再說一遍' },
                            { label: 'B', text: '解釋這個證據的意義，說明跟你的研究有什麼關係' },
                            { label: 'C', text: '再引用另一篇研究來補充第 2 層' },
                        ]}
                        answer="B"
                        onAnswer={trackChoice}
                    />

                    {/* ── 演練 2 ── */}
                    <div className="section-head mt-12"><h2>演練 2：三明治實戰</h2><div className="line"></div><span className="mono">10 分鐘</span></div>
                    <p className="section-desc">
                        用你上週（W5）找到的那篇文獻，寫出一個完整的三明治引用。三格，觀點句、引用句、分析句，每格至少一句話。
                    </p>

                    <div className="notice notice-gold text-[12px]">
                        ⚡ 出發前確認三件事：<br />
                        ① 觀點句是<strong>你自己的主張</strong>，不是從文獻裡複製出來的。<br />
                        ② 引用句要有<strong>作者、年份、具體發現</strong>——缺一不可。<br />
                        ③ 分析句要解釋這篇研究對你的研究題目<strong>有什麼意義</strong>，不能只是把引用句換個說法再說一遍。
                    </div>

                    {/* W5 帶入提示 */}
                    {w5Paper && (
                        <div className="bg-[var(--accent-light)] border border-[var(--accent)]/20 rounded-lg p-4 flex items-start gap-3">
                            <span className="text-[16px]">📎</span>
                            <div>
                                <div className="text-[11px] font-mono text-[var(--accent)] uppercase tracking-wider mb-1">自動帶入 W5 文獻</div>
                                <p className="text-[13px] text-[var(--ink-mid)] leading-relaxed">{w5Paper}</p>
                                <p className="text-[11px] text-[var(--ink-light)] mt-1">如果你想換一篇，可以在下方修改。</p>
                            </div>
                        </div>
                    )}

                    {/* 選用文獻 */}
                    <ThinkRecord
                        dataKey="w6-sandwich-ref"
                        prompt="我選用的文獻（作者年份）："
                        scaffold={['我在 W5 找到的那篇是…']}
                        rows={2}
                    />

                    {/* 三層結構：單一卡片 */}
                    <div className="bg-white border border-[var(--border)] rounded-xl overflow-hidden">
                        {SANDWICH_LAYERS.map((layer, i) => (
                            <div key={layer.layer} className={i < SANDWICH_LAYERS.length - 1 ? 'border-b border-[var(--border)]' : ''}>
                                <div className="p-3 px-5 flex items-center gap-3" style={{ background: `color-mix(in srgb, ${layer.color} 8%, white)` }}>
                                    <span className="text-[18px]">{layer.emoji}</span>
                                    <span className="font-bold text-[13px]" style={{ color: layer.color }}>第 {layer.layer} 層　{layer.role}</span>
                                    <span className="text-[11px] text-[var(--ink-light)] font-mono ml-auto">{layer.func}</span>
                                </div>
                                <div className="px-5 pb-4 pt-2">
                                    <ThinkRecord
                                        dataKey={`w6-sandwich-${layer.layer === 1 ? 'claim' : layer.layer === 2 ? 'evidence' : 'analysis'}`}
                                        prompt={`第 ${layer.layer} 層 ${layer.role}：`}
                                        scaffold={
                                            layer.layer === 1
                                                ? ['我認為…', '…可能對…造成影響。']
                                                : layer.layer === 2
                                                    ? ['某某（年份）的研究發現…', '其中具體指出…']
                                                    : ['這個發現說明了…', '對我的研究而言，這意味著…']
                                        }
                                        rows={3}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="notice notice-danger text-[12px]">
                        ⚠️ 如果你的第三層只是把第二層換個說法說一遍，那叫做<strong>偽裝的分析句</strong>——看起來有三層，其實只有兩層。真正的分析句要說出這篇研究的<strong>意義</strong>，不是重複它的<strong>內容</strong>。
                    </div>
                </div>
            ),
        },

        /* ──────────────────────────────────────
         * STEP 3: 多文獻整合 + 文獻探討寫作
         * ────────────────────────────────────── */
        {
            title: '多文獻整合 → 結案報告',
            icon: '📝',
            content: (
                <div className="space-y-8 prose-zh">
                    {/* ── 觀念 3 ── */}
                    <div className="section-head"><h2>觀念：多文獻整合原則</h2><div className="line"></div><span className="mono">10 分鐘</span></div>
                    <p className="section-desc">
                        文獻探討不是把三篇摘要排排站——<strong>是用自己的論述邏輯把三篇的發現串起來。</strong>
                    </p>

                    <div className="notice notice-danger text-[12px] mb-4">
                        ⚠️ <strong>最常見的失敗版本：</strong>「王小明（2020）發現……李大華（2021）發現……陳阿花（2022）發現……」三行三個研究各說各的，然後停。這不是文獻探討，這是證據陳列室。
                    </div>

                    <div className="bg-white border border-[var(--border)] rounded-xl overflow-hidden">
                        <div className="p-4 px-5 bg-[var(--paper-warm)] border-b border-[var(--border)] font-bold text-[13px]">
                            📚 三個結構位置
                        </div>
                        {INTEGRATION_STRUCTURE.map((row, i) => (
                            <div key={i} className={`grid grid-cols-1 md:grid-cols-3 gap-4 p-5 ${i < INTEGRATION_STRUCTURE.length - 1 ? 'border-b border-[var(--border)]' : ''}`}>
                                <div className="font-bold text-[13px] text-[var(--ink)]">{row.position}</div>
                                <div className="text-[13px] text-[var(--ink-mid)]">{row.func}</div>
                                <div className="text-[12px] text-[var(--accent)] italic font-medium">{row.sample}</div>
                            </div>
                        ))}
                    </div>

                    {/* ── 演練 3 ── */}
                    <div className="section-head mt-12"><h2>演練 3：結案報告——文獻探討寫作</h2><div className="line"></div><span className="mono">15 分鐘</span></div>
                    <p className="section-desc">
                        從老師提供的四組素材包中選一組，讀裡面三篇研究的摘要，寫出一段完整的文獻探討。
                    </p>

                    <div className="notice notice-danger text-[12px]">
                        ⚠️ <strong>寫作要求：</strong>至少 5 句、三篇文獻都要帶到、每提到一篇都要有（作者，年份）、不可以逐條抄寫素材、要用自己的話整合、<strong>最後一句要連回自己的研究題目。</strong>
                    </div>

                    {/* 素材包選擇 */}
                    <div className="text-[13px] font-bold text-[var(--ink)] mb-3">📚 選擇素材包（四選一）：</div>
                    <div className="content-grid" style={{ '--cols': 4 }}>
                        {MATERIAL_PACKS.map(pack => (
                            <button
                                key={pack.id}
                                onClick={() => setSelectedPack(pack.id)}
                                className={`text-left p-4 rounded-xl border-2 transition-all ${selectedPack === pack.id ? 'border-[var(--accent)] bg-[var(--accent-light)]' : 'border-[var(--border)] bg-white hover:border-[var(--ink-light)]'}`}
                            >
                                <div className="text-[16px] font-bold mb-1">{pack.id}</div>
                                <div className="text-[13px] font-bold text-[var(--ink)]">{pack.label}</div>
                                <div className="text-[11px] text-[var(--ink-light)]">{pack.subtitle}</div>
                            </button>
                        ))}
                    </div>

                    {/* 展開選中的素材包 */}
                    {selectedPack && (
                        <div className="bg-white border border-[var(--border)] rounded-xl overflow-hidden animate-in">
                            <div className="p-4 px-5 bg-[var(--accent-light)] border-b border-[var(--border)] font-bold text-[13px] text-[var(--accent)]">
                                素材包 {selectedPack}　｜　{MATERIAL_PACKS.find(p => p.id === selectedPack)?.label}
                            </div>
                            <div className="divide-y divide-[var(--border)]">
                                {MATERIAL_PACKS.find(p => p.id === selectedPack)?.sources.map((src, i) => (
                                    <div key={i} className="p-5">
                                        <div className="text-[12px] font-bold text-[var(--accent)] mb-1">文獻 {i + 1}　{src.author}</div>
                                        <p className="text-[13px] text-[var(--ink-mid)] leading-relaxed">{src.summary}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* 寫作鷹架 */}
                    <div className="text-[13px] font-bold text-[var(--ink)] mb-2 mt-6">🧱 寫作鷹架（參考用，不要整段照抄）：</div>
                    <div className="content-grid" style={{ '--cols': 2 }}>
                        <div className="bg-white border border-[var(--border)] rounded-xl p-5">
                            <div className="text-[12px] font-bold text-[var(--accent)] mb-2">A 版｜基礎模板</div>
                            <p className="text-[12px] text-[var(--ink-mid)] leading-[1.8] italic">{SCAFFOLD_A}</p>
                        </div>
                        <div className="bg-white border border-[var(--border)] rounded-xl p-5">
                            <div className="text-[12px] font-bold text-[var(--accent)] mb-2">B 版｜進階模板</div>
                            <p className="text-[12px] text-[var(--ink-mid)] leading-[1.8] italic">{SCAFFOLD_B}</p>
                        </div>
                    </div>

                    {/* 句型工具箱 */}
                    <button
                        onClick={() => setShowToolkit(prev => !prev)}
                        className="text-[12px] font-mono text-[var(--accent)] hover:text-[var(--ink)] transition-colors cursor-pointer"
                    >
                        {showToolkit ? '▼ 收起句型工具箱' : '▶ 展開句型工具箱'}
                    </button>

                    {showToolkit && (
                        <div className="content-grid animate-in" style={{ '--cols': 2 }}>
                            {SENTENCE_TOOLKIT.map((group, i) => (
                                <div key={i} className="bg-[var(--paper)] border border-[var(--border)] rounded-lg p-4">
                                    <div className="text-[11px] font-bold text-[var(--accent)] mb-2">{group.cat}</div>
                                    <ul className="space-y-1">
                                        {group.items.map((item, j) => (
                                            <li key={j} className="text-[12px] text-[var(--ink-mid)] leading-relaxed">・{item}</li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* 作答區 */}
                    <ThinkRecord
                        dataKey="w6-lit-review"
                        prompt="我的文獻探討（演練 3 作答區）："
                        scaffold={['關於…，已有不少研究進行探討。', '首先，…（年份）發現…', '綜合以上研究可見，…這也與本研究想探討的…']}
                        rows={10}
                    />
                </div>
            ),
        },

        /* ──────────────────────────────────────
         * STEP 4: 同儕會診
         * ────────────────────────────────────── */
        {
            title: '同儕會診：互相驗屍',
            icon: '🏥',
            content: (
                <div className="space-y-8 prose-zh">
                    <div className="section-head"><h2>同儕會診：互相驗屍</h2><div className="line"></div><span className="mono">10 分鐘</span></div>
                    <p className="section-desc">
                        兩人一組，交換演練 3 的文獻探討段落。依照四個審查項目，給出具體修改建議。<strong>不要寫「很好」「很清楚」——那叫敷衍結案。</strong>
                    </p>

                    <div className="notice notice-accent text-[12px]">
                        💡 請同儕在你的載具上勾選審查結果。好的審查意見是<strong>一句可以直接用來修改的建議</strong>，例如：「第三篇文獻的引用沒有加年份」、「最後一句沒有連回研究題目」。
                    </div>

                    <div className="bg-white border border-[var(--border)] rounded-xl overflow-hidden">
                        <div className="p-4 px-5 bg-[var(--paper-warm)] border-b border-[var(--border)] font-bold text-[13px]">
                            🏥 同儕會診表　｜　請同儕在這裡幫你審查演練 3
                        </div>
                        <div className="divide-y divide-[var(--border)]">
                            {PEER_REVIEW_ITEMS.map((item, i) => {
                                const LEVELS = [
                                    { key: 'pass', icon: '✓', label: '通過', color: 'var(--success)' },
                                    { key: 'partial', icon: '△', label: '部分需修改', color: 'var(--gold)' },
                                    { key: 'fail', icon: '✗', label: '需大幅修改', color: 'var(--danger)' },
                                ];
                                return (
                                    <div key={item.id} className="p-5">
                                        <div className="text-[12px] font-bold text-[var(--accent)] mb-1">審查項目 {i + 1}　｜　{item.label}</div>
                                        <p className="text-[12px] text-[var(--ink-light)] italic mb-3">{item.question}</p>
                                        <div className="flex flex-wrap gap-3">
                                            {LEVELS.map(lv => {
                                                const selected = peerChecks[item.id] === lv.key;
                                                return (
                                                    <button
                                                        key={lv.key}
                                                        onClick={() => setPeerChecks(prev => ({ ...prev, [item.id]: lv.key }))}
                                                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[12px] font-medium border-2 transition-all ${selected ? 'text-white' : 'text-[var(--ink-mid)] border-[var(--border)] hover:border-[var(--ink-light)]'}`}
                                                        style={selected ? { background: lv.color, borderColor: lv.color } : {}}
                                                    >
                                                        <span className="text-[11px]">{lv.icon}</span>
                                                        {lv.label}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <ThinkRecord
                        dataKey="w6-peer-review"
                        prompt="同儕幫你審查後，給了什麼具體建議？你根據建議修改了什麼？"
                        scaffold={['同儕指出的問題是…', '我修改了…', '修改後的差異在於…']}
                        rows={5}
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
                                '用遮蓋測試判斷改寫品質——看結構，不看表面',
                                '三明治引用法——觀點句、引用句、分析句缺一不可',
                                '多文獻整合——不是排排站，是串成有邏輯的段落',
                                '演練 1：找出甲乙的改寫問題，並寫出自己的正確改寫',
                                '演練 2：用 W5 文獻寫出完整三明治引用',
                                '演練 3：用三篇文獻寫出文獻探討，最後一句連回題目',
                            ].map((item, i) => (
                                <div key={i} className="p-4 px-6 bg-white flex items-start gap-3">
                                    <CheckCircle2 size={16} className="text-[var(--success)] mt-0.5 flex-shrink-0" />
                                    <span className="text-[13px] text-[var(--ink-mid)]">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                                        {/* AIRED 敘事紀錄（循序漸進：五欄 → 一段話） */}
                    <AIREDNarrative week="6" hint="寫文獻探討可能用 AI 幫忙潤稿" optional={true} />

                    {/* 一鍵複製 */}
                    <ExportButton
                        weekLabel="W6 文獻偵探社"
                        fields={EXPORT_FIELDS}
                        choices={choiceResults}
                    />

                    {/* 遊戲彩蛋 */}
                    <div className="bg-[var(--ink)] border-l-4 border-[var(--danger)] p-6 rounded-r-lg text-white shadow-xl">
                        <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                            <ShieldAlert className="text-[var(--danger)]" size={20} />
                            R.I.B. 單元挑戰：行動代號獵狐
                        </h3>
                        <p className="text-[var(--ink-light)] text-sm mb-4">
                            追蹤研究文獻來源的能力——你能辨認哪些引用是真實可查的、哪些是偽造的嗎？
                        </p>
                        <Link to="/game/citation-detective" className="inline-flex items-center gap-2 bg-[var(--danger)] text-white px-4 py-2 rounded font-bold text-sm hover:opacity-90 transition-colors">
                            進入獵狐 <ArrowRight size={14} />
                        </Link>
                    </div>

                    {/* 下週預告 */}
                    <div className="next-week-preview">
                        <div className="next-week-header">
                            <span className="next-week-badge">NEXT WEEK</span>
                            <h3 className="next-week-title">W7 預告</h3>
                        </div>
                        <div className="next-week-content">
                            <div className="next-week-col">
                                <div className="next-week-label">W7 主題</div>
                                <p className="next-week-text">研究診所——根據你的研究方法（問卷/訪談/實驗/觀察/文獻）掛號分流，學習對應的研究設計。</p>
                            </div>
                            <div className="next-week-col">
                                <div className="next-week-label">你要帶來</div>
                                <p className="next-week-text">確認你的 <strong>How（研究方法）</strong>。W4 的 5W1H 裡你填了什麼方法？那就是你下週要去的科別。</p>
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
                    <span className="hidden md:inline">研究方法與專題 / 研究規劃 / </span><span className="text-[var(--ink)] font-bold">文獻偵探社 W6</span>
                </div>
                <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
                    <span className="bg-[var(--paper-warm)] text-[var(--ink)] text-[10px] font-bold px-2 py-0.5 rounded-[2px] font-mono">100 MINS</span>
                    <button
                        onClick={() => setShowLessonMap(!showLessonMap)}
                        className="text-[11px] text-[var(--ink-light)] hover:text-[var(--accent)] transition-colors flex items-center gap-1 font-mono"
                    >
                        <Map size={12} /> <span className="hidden md:inline">{showLessonMap ? 'Hide Plan' : 'Instructor View'}</span>
                    </button>
                    <span className="hidden md:inline-block bg-[var(--ink)] text-white text-[10px] font-bold px-2 py-0.5 rounded-[2px] font-mono">AI-RED · A</span>
                </div>
            </div>

            {showLessonMap && (
                <div className="animate-in slide-in-from-top-4 duration-300">
                    <LessonMap data={W5Data} />
                </div>
            )}

            {/* PAGE HEADER — Hero Block */}
            <HeroBlock
                kicker="R.I.B. 調查檔案 · 研究方法與專題 · W6"
                title="文獻偵探社："
                accentTitle="識破假改寫，寫出真文獻"
                subtitle="偵探社的工作只有一件事——找出文獻裡的問題，然後寫出一份任何人都挑不出毛病的文獻探討。今天要學會識破兩種常見犯罪手法：換字抄襲與文獻堆砌，並親手寫出合格的文獻探討段落。"
                meta={[
                    { label: '本週任務', value: '觀念 3 招 + 改寫偵錯 + 三明治' },
                    { label: '時長', value: '100 MINS' },
                    { label: '課堂產出', value: '演練 1-3 + 同儕會診後修改稿' },
                    { label: '下週預告', value: 'W7 研究診所：掛號分流' },
                ]}
            />
            <CourseArc items={W5Data.courseArc} />

            {/* 本週簡報 */}
            <div className="flex justify-end mb-8 -mt-2">
                <a
                    href="https://canva.link/hb3pdip2k9kvmca"
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
                prevWeek={{ label: '回 W5 文獻搜尋入門', to: '/w5' }}
                nextWeek={{ label: '前往 W7 研究診所', to: '/w7' }}
            flat
            />
        </div>
    );
};
