import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import CourseArc from '../components/ui/CourseArc';
import { W15Data } from '../data/lessonMaps';
import './W15.css';
import ThinkRecord from '../components/ui/ThinkRecord';
import PromptBlock from '../components/ui/PromptBlock';
import AIREDNarrative from '../components/ui/AIREDNarrative';
import StepEngine from '../components/ui/StepEngine';
import HeroBlock from '../components/ui/HeroBlock';
import TaskCard from '../components/ui/TaskCard';
import ExportButton from '../components/ui/ExportButton';
import ResetWeekButton from '../components/ui/ResetWeekButton';
import AICollaborationPrinciples from '../components/ui/AICollaborationPrinciples';
import AIDialogSubmission from '../components/ui/AIDialogSubmission';
import AIModePicker from '../components/ui/AIModePicker';
import { ResearcherRedlines } from '../components/ui/ResearcherRedlines';
import TrapRewritePractice from '../components/ui/TrapRewritePractice';
import ThreeColumnConclusion from '../components/ui/ThreeColumnConclusion';
import BraveScientistReflection from '../components/ui/BraveScientistReflection';
import { readRecords } from '../components/ui/ThinkRecord';
import {
    Bot,
    Copy,
    Check,
    Shield,
    Layers,
    PenTool,
    Scale,
    FileText,
    ArrowRight,
    ShieldAlert,
} from 'lucide-react';

/* ══════════════════════════════════════
 *  資料常數
 * ══════════════════════════════════════ */

const FOUR_LAYERS = [
    { name: '描述', color: '#2563EB', task: '報事實、報數字（看到了什麼）', ai: '人先寫，AI 檢核有無數字錯誤或量詞不精準', scaffold: '根據___，___，其中最明顯的是___。' },
    { name: '詮釋', color: '#7C3AED', task: '解釋意義、推測原因（這代表什麼）', ai: '人先寫，AI 優化並補充可能遺漏的原因', scaffold: '這個結果顯示___，可能的原因是___。' },
    { name: '回扣', color: '#DC2626', task: '回頭回答你最初的研究問題（你問的問題答了沒）', ai: '人寫內容和邏輯，AI 只能潤飾文句', scaffold: '本研究原本想了解___。根據分析結果，本研究的答案是___。但這個結論只能說明___，無法確定___。', star: true },
    { name: '批判', color: '#059669', task: '說出研究的限制（哪裡還沒做好）', ai: '人先寫，AI 補充常見限制類型供參考', scaffold: '本研究的限制在於___，因此結論不宜推論至___。若要更完整回答這個問題，未來可以___。' },
];

const METHOD_PROMPTS = {
    questionnaire: {
        label: '📋 問卷組',
        prompt: `我的研究主題是＿＿＿，研究問題是＿＿＿。

以下是我自己寫的四層結論初稿：【貼上初稿】

以下是問卷統計資料（已去除個資）：【貼上資料】

請幫我：
1. 檢核描述層有無數字錯誤或量詞不精準，並建議修改。
2. 優化詮釋層，補充可能遺漏的原因。
3. 回扣層我已經寫好內容和邏輯，請只幫我潤飾文句，不要改變意思。
4. 列出問卷研究常見的三種研究限制供我參考。
5. 根據以上修改建議，整合成一段完整的結論論述，回扣層請使用我原本寫的內容，不要自行改變邏輯。`,
        tips: ['相關不等於因果：「可能有相關」不是「導致」', '量詞要精準：38% 不是「多數」', '樣本數偏少（<30份）要加「本結果僅供初步參考」'],
    },
    interview: {
        label: '🎤 訪談組',
        prompt: `我的研究主題是＿＿＿，研究問題是＿＿＿。

以下是我自己寫的四層結論初稿：【貼上初稿】

以下是受訪者逐字稿（姓名已改為代號）：【貼上逐字稿】

請幫我：
1. 檢核描述層有無過度詮釋或遺漏重要現象，並建議修改。
2. 優化詮釋層，補充可能遺漏的意義。
3. 回扣層我已經寫好內容和邏輯，請只幫我潤飾文句，不要改變意思。
4. 列出質性訪談研究常見的三種研究限制供我參考。
5. 根據以上修改建議，整合成一段完整的結論論述，回扣層請使用我原本寫的內容，不要自行改變邏輯。`,
        tips: ['AI 說得比受訪者更強（過度詮釋：說超過受訪者實際說的）→ 對照原文', '只有 1 人說的 → 算個案，不能說成普遍現象', '多數受訪者都提到的 → 才算主要發現'],
    },
    experiment: {
        label: '🧪 實驗組',
        prompt: `我的研究主題是＿＿＿，研究問題是＿＿＿。
實驗組條件是＿＿＿，對照組條件是＿＿＿。

以下是我自己寫的四層結論初稿：【貼上初稿】

以下是實驗數據：【貼上數據】

請幫我：
1. 檢核描述層有無數字錯誤或遺漏，並建議修改。
2. 優化詮釋層，補充可能的原因解釋。
3. 回扣層我已經寫好內容和邏輯，請只幫我潤飾文句，不要改變意思。
4. 列出實驗研究常見的三種研究限制供我參考。
5. 根據以上修改建議，整合成一段完整的結論論述，回扣層請使用我原本寫的內容，不要自行改變邏輯。`,
        tips: ['有差異不等於有效：先確認干擾變因', '用「顯示差異」不是「證明效果」', '霍桑效應：被觀察者知道有人在看，行為可能改變'],
    },
    observation: {
        label: '👀 觀察組',
        prompt: `我的研究主題是＿＿＿，研究問題是＿＿＿。
觀察場景是＿＿＿。

以下是我自己寫的四層結論初稿：【貼上初稿】

以下是觀察記錄（已去除個資）：【貼上記錄】

請幫我：
1. 檢核描述層有無行為模式遺漏或頻率描述不精準，並建議修改。
2. 優化詮釋層，補充可能的脈絡解釋。
3. 回扣層我已經寫好內容和邏輯，請只幫我潤飾文句，不要改變意思。
4. 列出觀察研究常見的三種研究限制供我參考。
5. 根據以上修改建議，整合成一段完整的結論論述，回扣層請使用我原本寫的內容，不要自行改變邏輯。`,
        tips: ['補充脈絡：月考週、特殊活動要主動說明', '觀察者效應：被觀察者行為可能改變', '行為模式要有頻率支持，不能只憑印象'],
    },
    literature: {
        label: '📚 文獻組',
        prompt: `我的研究主題是＿＿＿，研究問題是＿＿＿。

以下是我自己寫的四層結論初稿：【貼上初稿】

以下是文獻摘要表（含作者、年份、主要發現）：【貼上摘要表】

請幫我：
1. 檢核描述層有無文獻引用錯誤或遺漏重要共識，並建議修改。
2. 優化詮釋層，補充文獻支持的可能解釋。
3. 回扣層我已經寫好內容和邏輯，請只幫我潤飾文句，不要改變意思。
4. 列出文獻研究常見的三種研究限制供我參考。
5. 根據以上修改建議，整合成一段完整的結論論述，回扣層請使用我原本寫的內容，不要自行改變邏輯。`,
        tips: ['AI 說「多項研究顯示」→ 確認是否真有 2 篇以上支持', 'AI 找的研究缺口 → 確認是否對應你的研究問題', '引用要有出處：作者＋年份，不能只說「有研究指出」'],
    },
};
const METHOD_KEYS = Object.keys(METHOD_PROMPTS);

const DEMO_EXAMPLE = {
    question: '高中生的手機使用時間是否與年級有關？',
    layers: [
        { name: '描述', color: '#2563EB', text: '根據問卷統計，67% 的受訪者每天使用手機超過三小時，其中高一生佔比最高（82%），高三生最低（51%）。' },
        { name: '詮釋', color: '#7C3AED', text: '手機使用時間隨年級升高而下降，推測高三生因升學壓力增加而主動減少使用時間，高一生課後自律習慣尚在建立中。' },
        { name: '回扣', color: '#DC2626', text: '本研究原本想了解手機使用時間是否與年級有關。根據分析結果，年級越高使用時間越短，兩者有相關性。但這個結論只能說明兩者有相關，無法確定是年級本身還是其他因素（如補習頻率）造成差異。' },
        { name: '批判', color: '#059669', text: '本研究樣本僅限兩班 60 人，且為自填問卷可能存在社會期許偏差，結論不宜推論至全體高中生。若要更完整回答這個問題，未來可擴大樣本並加入訪談交叉驗證。' },
    ],
};

const EXPORT_FIELDS = [
    { key: 'w15-draft-describe', label: '初稿：描述層' },
    { key: 'w15-draft-interpret', label: '初稿：詮釋層' },
    { key: 'w15-draft-anchor', label: '初稿：回扣層' },
    { key: 'w15-draft-critique', label: '初稿：批判層' },
    { key: 'w15-self-review', label: '自查紀錄', question: '自查後我發現了什麼問題？做了哪些修正？' },
    { key: 'w15-ai-feedback', label: 'AI 檢核建議紀錄' },
    { key: 'w15-judge-table', label: '裁奪紀錄' },
    { key: 'w15-rejected', label: '拒絕 AI 的建議與原因' },
    { key: 'w15-human-context', label: 'AI 說不出來但我知道的脈絡' },
    { key: 'w15-final-draft', label: '最終四層結論草稿' },
    { key: 'w15-ai-helpful', label: 'AI 最有幫助的地方' },
    { key: 'w15-ai-limit', label: 'AI 最大的限制' },
    { key: 'w15-ai-blind-trust', label: '完全相信 AI 會犯的錯' },
    { key: 'w15-ai-dialog-submission', label: 'AI 完整對話繳交方式（用了 AI 必填）', question: 'A 私人註解 / B 文件上傳並貼連結' },
    { key: 'w15-aired-record', label: 'AI-RED 敘事紀錄（用了 AI 必填）', question: '本週用 AI 壓力測試四層結論的最重要一次互動（A-I-R-E-D 五要素）' },
];

/* ══════════════════════════════════════
 *  內部元件
 * ══════════════════════════════════════ */

const CopyablePrompt = ({ text, label }) => {
    const [copied, setCopied] = useState(false);
    const handleCopy = useCallback(() => {
        navigator.clipboard.writeText(text).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }).catch(() => {
            const ta = document.createElement('textarea');
            ta.value = text;
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    }, [text]);

    return (
        <div style={{ borderRadius: 'var(--radius-unified)', overflow: 'hidden', background: '#1a1a2e' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', background: '#16213e', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.7)', fontFamily: 'var(--font-mono)' }}>
                    <Bot size={14} /> {label || 'AI Prompt — 複製後貼到 AI 對話窗'}
                </span>
                <button onClick={handleCopy} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 10px', fontSize: 11, fontWeight: 700, color: '#fff', background: 'var(--accent)', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
                    {copied ? <><Check size={12} /> 已複製</> : <><Copy size={12} /> 複製</>}
                </button>
            </div>
            <pre style={{ padding: 16, margin: 0, fontSize: 13, lineHeight: 1.7, color: '#e2e8f0', fontFamily: 'var(--font-mono)', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{text}</pre>
        </div>
    );
};

const MethodSelector = () => {
    const [selected, setSelected] = useState(() => {
        try { return localStorage.getItem('w15-method-selected') || null; } catch { return null; }
    });
    const saved = readRecords();
    const myMethod = saved['w9-my-method'] || saved['w8-tool-method'] || '';
    const autoDetect = () => {
        const t = (myMethod || '').toLowerCase();
        if (t.includes('問卷')) return 'questionnaire';
        if (t.includes('訪談')) return 'interview';
        if (t.includes('實驗')) return 'experiment';
        if (t.includes('觀察')) return 'observation';
        if (t.includes('文獻')) return 'literature';
        // fallback：未填或無法辨識時預設展開問卷組（最常見），避免空白看不到 prompt
        return 'questionnaire';
    };
    const active = selected || autoDetect();
    const current = active ? METHOD_PROMPTS[active] : null;

    return (
        <div>
            <div className="w15-method-tabs">
                {METHOD_KEYS.map(k => (
                    <button key={k} className={`w15-method-tab ${active === k ? 'active' : ''}`} onClick={() => { setSelected(k); try { localStorage.setItem('w15-method-selected', k); } catch {} }}>
                        {METHOD_PROMPTS[k].label}
                    </button>
                ))}
            </div>
            {current ? (
                <div className="flex flex-col gap-4">
                    <CopyablePrompt text={current.prompt} label={`${current.label} Prompt`} />
                    <div className="p-4 rounded-[var(--radius-unified)] border border-[#FCD34D] bg-[#FFFBEB]">
                        <p className="text-[12px] text-[#92400E] font-bold mb-2">🧠 人工裁奪提醒</p>
                        <div className="text-[12px] text-[#78350F] leading-relaxed flex flex-col gap-1">
                            {current.tips.map((tip, i) => <span key={i}>• {tip}</span>)}
                        </div>
                    </div>
                </div>
            ) : (
                <p className="text-[12px] text-[var(--ink-mid)]">請點選你的研究方法以顯示對應的 Prompt（已預設展開問卷組）。</p>
            )}
        </div>
    );
};

/* ══════════════════════════════════════
 *  主頁面
 * ══════════════════════════════════════ */

const W15Page = () => {
    const saved = readRecords();
    const myTopic = saved['w8-merged-topic'] || saved['w8-research-question'] || '';
    const myMethod = saved['w9-my-method'] || saved['w8-tool-method'] || '';
    const myQuestion = saved['w8-research-question'] || myTopic;
    /* W14 跨週帶入 */
    const w14Description = saved['w14-my-description'] || '';
    const w14Inference = saved['w14-my-inference'] || '';
    const w14Preview = saved['w14-w15-preview'] || '';
    /* AI 使用模式 */
    const [w15AiMode, setW15AiMode] = useState(() => {
        try {
            const r = JSON.parse(localStorage.getItem('rib_think_records')) || {};
            return r['w15-ai-mode'] || '';
        } catch { return ''; }
    });

    const steps = [
        {
            title: '四層升級',
            icon: <Layers size={18} />,
            content: (
                <div className="flex flex-col gap-6 prose-zh">
                    <div className="p-5 rounded-[var(--radius-unified)] border border-[var(--border)] bg-[var(--paper-warm)]">
                        <p className="text-[14px] font-bold text-[var(--ink)] mb-2">🎓 升級！從局部到全局</p>
                        <p className="text-[13px] text-[var(--ink-mid)] leading-relaxed">
                            W14 的描述＋推論是「一張圖的說明」，是局部的。今天要把<strong>整份研究的所有發現整合起來</strong>，寫出一個真正的研究結論。
                        </p>
                    </div>

                    {/* 名詞升級：W14 推論 → W15 詮釋（獨立卡，避免被忽略） */}
                    <div className="p-4 rounded-[var(--radius-unified)] border-2 border-[#DDD6FE] bg-[#F5F3FF]">
                        <p className="text-[13px] font-bold text-[#5B21B6] mb-2">📖 名詞升級：W14「推論」→ W15「詮釋」</p>
                        <p className="text-[12px] text-[#4C1D95] leading-relaxed mb-2">
                            兩個詞<strong>意思完全一樣</strong>，都是「解釋數據背後的意義」——只是學術上用「詮釋」。
                            今天開始你會看到「四層」用學術名：<strong>描述 / 詮釋 / 回扣 / 批判</strong>。
                        </p>
                        <div className="bg-white border border-[#DDD6FE] rounded p-2.5">
                            <p className="text-[11px] text-[#4C1D95] font-mono leading-relaxed">
                                W14 你寫的：「<span className="text-[#991B1B]">推論</span>」<br />
                                = W15 開始叫：「<span className="text-[#5B21B6]">詮釋</span>」<br />
                                你不用改 W14 的稿，只是名稱換了。
                            </p>
                        </div>
                    </div>

                    {/* 從 W14 帶入 — 描述/推論作為四層的雛型 */}
                    {(w14Description || w14Inference) && (
                        <div className="p-4 rounded-[var(--radius-unified)] bg-[#F0F9FF] border-2 border-[#BAE6FD]">
                            <p className="text-[13px] text-[#0369A1] font-bold mb-2">📂 你 W14 寫的（這就是四層結論的「描述+詮釋」雛型）</p>
                            {w14Description && (
                                <div className="mb-2">
                                    <p className="text-[11px] text-[#075985] font-bold uppercase tracking-wider mb-1">🔵 W14 描述</p>
                                    <p className="text-[12px] text-[#0C4A6E] leading-relaxed">{w14Description}</p>
                                </div>
                            )}
                            {w14Inference && (
                                <div>
                                    <p className="text-[11px] text-[#075985] font-bold uppercase tracking-wider mb-1">🔴 W14 推論（=今天的「詮釋」）</p>
                                    <p className="text-[12px] text-[#0C4A6E] leading-relaxed">{w14Inference}</p>
                                </div>
                            )}
                            <p className="text-[11px] text-[#0369A1] italic mt-2 leading-relaxed border-t border-[#BAE6FD] pt-2">
                                💡 W14 是針對「一張圖」寫的；本週要把這個雛型升級為整份研究的結論，再加兩層（回扣、批判）。
                            </p>
                        </div>
                    )}

                    {/* W14 伏筆揭曉 */}
                    {w14Preview && (
                        <div className="p-4 rounded-[var(--radius-unified)] border-2 border-dashed border-[var(--accent)] bg-[#FFFBEB]">
                            <p className="text-[12px] text-[var(--accent)] font-bold mb-2">🔮 你 W14 末對「第三層、第四層」的猜測</p>
                            <p className="text-[12px] text-[var(--ink)] leading-relaxed mb-2 italic">{w14Preview}</p>
                            <p className="text-[11px] text-[var(--ink-mid)] leading-relaxed border-t border-[var(--accent)] pt-2">
                                🎯 <strong>答案揭曉：</strong>第三層是「<strong>回扣</strong>」（直接回答研究問題）、第四層是「<strong>批判</strong>」（說出研究的限制）。猜對幾項？下面架構圖完整展開。
                            </p>
                        </div>
                    )}

                    {!w14Preview && (
                        <div className="p-4 rounded-[var(--radius-unified)] border-2 border-dashed border-[var(--accent)] bg-[#FFFBEB]">
                            <p className="text-[12px] text-[var(--accent)] font-bold mb-2">🔮 W14 沒寫伏筆？沒關係，直接看答案</p>
                            <div className="grid md:grid-cols-2 gap-3 text-[12px]">
                                <div className="p-3 rounded-[var(--radius-unified)] bg-white border border-[#FCD34D]">
                                    <p className="font-bold text-[#DC2626] mb-1">⭐ 第三層：回扣</p>
                                    <p className="text-[var(--ink-mid)] leading-relaxed">直接回答你最初的研究問題（你問的問題答了沒）</p>
                                </div>
                                <div className="p-3 rounded-[var(--radius-unified)] bg-white border border-[#FCD34D]">
                                    <p className="font-bold text-[#059669] mb-1">🔍 第四層：批判</p>
                                    <p className="text-[var(--ink-mid)] leading-relaxed">說出研究的限制（哪裡還沒做好、結論不能推到哪）</p>
                                </div>
                            </div>
                            <p className="text-[11px] text-[var(--ink-light)] italic mt-2 leading-relaxed">
                                💡 下方架構圖會完整展開四層細節。下次 W14 末記得寫伏筆，揭曉時對照「你猜的 vs 答案」會更有印象。
                            </p>
                        </div>
                    )}

                    <div>
                        <p className="text-[13px] font-bold text-[var(--ink)] mb-3">📐 四層結論架構</p>
                        <div className="w15-layer-grid">
                            {FOUR_LAYERS.map((layer, i) => (
                                <div key={i} className="w15-layer-row">
                                    <div className="w15-layer-badge" style={{ background: layer.color }}>{layer.star && '⭐ '}{layer.name}</div>
                                    <div className="w15-layer-content">
                                        <span className="w15-layer-task">{layer.task}</span>
                                        <span className="w15-layer-ai">AI 角色：{layer.ai}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="p-4 rounded-[var(--radius-unified)] border border-[#FCA5A5] bg-[#FEF2F2]">
                        <p className="text-[13px] text-[#DC2626] font-bold mb-1">⭐ 回扣層為什麼特別？</p>
                        <p className="text-[12px] text-[#991B1B] leading-relaxed mb-3">
                            AI 可以幫你把回扣層的文句說得更通順，但<strong>內容和邏輯只能由你來寫</strong>。因為只有你知道你當初為什麼要做這個研究、你的問題問的是什麼。
                        </p>
                        <div className="bg-white border border-[#FCA5A5] rounded p-3">
                            <p className="text-[12px] font-bold text-[#991B1B] mb-2">📖 「潤飾」是什麼意思？哪些算 ✅、哪些算 ❌</p>
                            <p className="text-[11.5px] text-[#7F1D1D] mb-3">
                                你寫：「<span className="font-mono">我發現滑手機久的人成績比較差，有相關</span>」
                            </p>
                            <div className="grid md:grid-cols-2 gap-2">
                                <div className="border border-[#86EFAC] bg-[#F0FDF4] rounded p-2.5">
                                    <p className="text-[11px] font-bold text-[#166534] mb-1">✅ AI 改成這樣 · 算潤飾（接受）</p>
                                    <p className="text-[11px] text-[#166534] font-mono leading-relaxed mb-1.5">
                                        「本研究發現使用手機時間與學業成績呈現負相關。」
                                    </p>
                                    <p className="text-[10.5px] text-[#166534]">→ 用詞學術化，但<strong>意思沒變</strong>（還是「相關」）</p>
                                </div>
                                <div className="border border-[#FCA5A5] bg-[#FEF2F2] rounded p-2.5">
                                    <p className="text-[11px] font-bold text-[#991B1B] mb-1">❌ AI 改成這樣 · 算改意思（拒絕）</p>
                                    <p className="text-[11px] text-[#991B1B] font-mono leading-relaxed mb-1.5">
                                        「本研究<u>證實</u>滑手機<u>導致</u>成績下降。」
                                    </p>
                                    <p className="text-[10.5px] text-[#991B1B]">→ 從「相關」改成「證實／導致」（因果），<strong>研究的靈魂被換了</strong></p>
                                </div>
                            </div>
                            <p className="text-[11px] text-[#991B1B] italic mt-2 leading-relaxed">
                                💡 判斷法：AI 改完後，「結論強度」一樣嗎？「能說明什麼／無法確定什麼」邊界一樣嗎？變強了或變廣了 = 改意思 = 拒絕。
                            </p>
                        </div>
                    </div>
                    {/* 回扣層多方法範例 */}
                    <div className="p-4 rounded-[var(--radius-unified)] border border-[var(--border)] bg-white">
                        <p className="text-[13px] font-bold text-[var(--ink)] mb-3">📌 回扣層範例：不同方法怎麼寫？</p>
                        <div className="flex flex-col gap-3">
                            <div className="p-3 rounded-[var(--radius-unified)] bg-[#EFF6FF] border border-[#BFDBFE]">
                                <p className="text-[11px] font-bold text-[#1E40AF] mb-1">📋 問卷研究</p>
                                <p className="text-[12px] text-[#1E40AF] leading-relaxed">
                                    「本研究原本想了解<u>社群媒體使用時間與焦慮感的關係</u>。根據 87 份有效問卷的分析結果，每日使用超過 3 小時的學生焦慮量表平均分數顯著高於 1 小時以下的學生。因此，<strong>社群媒體使用時間與焦慮感之間存在正相關</strong>。但本結論僅能說明兩者相關，<strong>無法確定</strong>是社群媒體導致焦慮，還是焦慮的人更傾向使用社群媒體。」
                                </p>
                            </div>
                            <div className="p-3 rounded-[var(--radius-unified)] bg-[#F0FDF4] border border-[#BBF7D0]">
                                <p className="text-[11px] font-bold text-[#166534] mb-1">🎤 訪談研究</p>
                                <p className="text-[12px] text-[#166534] leading-relaxed">
                                    「本研究原本想了解<u>高中生選擇補習的決策歷程</u>。根據 6 位受訪者的訪談分析，多數學生表示補習決定主要來自<strong>同儕壓力而非自我需求</strong>，且決策過程中家長的意見扮演關鍵角色。但本結論僅反映特定學校的 6 位學生經驗，<strong>不宜推論至</strong>所有高中生。」
                                </p>
                            </div>
                            <div className="p-3 rounded-[var(--radius-unified)] bg-[#FEF3C7] border border-[#FDE68A]">
                                <p className="text-[11px] font-bold text-[#92400E] mb-1">🔬 實驗研究</p>
                                <p className="text-[12px] text-[#92400E] leading-relaxed">
                                    「本研究原本想了解<u>背景音樂是否影響記憶力測驗表現</u>。實驗結果顯示，安靜組的平均分數（82.3）高於音樂組（74.1），差異達統計顯著。因此，<strong>背景音樂對短期記憶有負面影響</strong>。但本實驗僅測試了流行音樂，<strong>無法確定</strong>古典音樂或白噪音是否有相同效果。」
                                </p>
                            </div>
                            <div className="p-3 rounded-[var(--radius-unified)] bg-[#FDF2F8] border border-[#FBCFE8]">
                                <p className="text-[11px] font-bold text-[#9D174D] mb-1">👀 觀察研究</p>
                                <p className="text-[12px] text-[#9D174D] leading-relaxed">
                                    「本研究原本想了解<u>高中生在自習課的專注行為樣貌</u>。觀察 4 節自習課共 132 次取樣，發現「滑手機」與「組內聊天」分別佔 38% 與 22%，遠高於「閱讀／書寫」的 28%。因此，<strong>自習課的實際專注比例低於課表預期</strong>。但本結論僅來自單一班級的觀察樣本，<strong>不宜推論至</strong>不同年級或不同教師管理風格的班級。」
                                </p>
                            </div>
                            <div className="p-3 rounded-[var(--radius-unified)] bg-[#F5F3FF] border border-[#DDD6FE]">
                                <p className="text-[11px] font-bold text-[#5B21B6] mb-1">📚 文獻研究</p>
                                <p className="text-[12px] text-[#5B21B6] leading-relaxed">
                                    「本研究原本想了解<u>近 10 年高中生數位學習成效的研究取向變化</u>。比較 12 篇期刊論文後，發現 2014–2018 年聚焦「載具普及率」，2019 年後轉向「自主學習能力」。因此，<strong>研究焦點已從硬體進入學習者主體性</strong>。但本回顧僅納入中文期刊，<strong>無法確定</strong>英文文獻是否呈現相同走向。」
                                </p>
                            </div>
                        </div>
                        <p className="text-[11px] text-[var(--ink-mid)] mt-3">
                            注意共同結構：「原本想了解___」→「根據結果，___」→「因此答案是___」→「但只能說明___，無法確定___」。<strong>5 種方法都遵循同一架構</strong>——這是研究方法課的核心：方法不同，邏輯共通。
                        </p>
                    </div>

                    <div>
                        <p className="text-[13px] font-bold text-[var(--ink)] mb-2">📖 示範：完整四層</p>
                        <p className="text-[12px] text-[var(--ink-mid)] mb-3">研究問題：{DEMO_EXAMPLE.question}</p>
                        <div className="w15-layer-grid">
                            {DEMO_EXAMPLE.layers.map((d, i) => (
                                <div key={i} className="w15-layer-row">
                                    <div className="w15-layer-badge" style={{ background: d.color, minWidth: 60 }}>{d.name}</div>
                                    <div className="w15-layer-content">
                                        <span className="text-[12px] text-[var(--ink-mid)] leading-relaxed">{d.text}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ),
        },
        {
            title: '自己先寫',
            icon: <PenTool size={18} />,
            content: (
                <div className="flex flex-col gap-6 prose-zh">
                    <div className="p-4 rounded-[var(--radius-unified)] border border-[var(--border)] bg-[var(--paper-warm)]">
                        <p className="text-[14px] font-bold text-[var(--ink)] mb-1">✍️ 你先寫，AI 再幫你檢核</p>
                        <p className="text-[12px] text-[var(--ink-mid)] leading-relaxed">
                            寫得醜沒關係——先把骨架搭出來，第二節課 AI 會幫你把醜句子變漂亮！<strong>不准停筆！</strong>
                        </p>
                    </div>
                    {myQuestion && (
                        <div className="p-4 rounded-[var(--radius-unified)] bg-[#F0F9FF] border border-[#BAE6FD]">
                            <p className="text-[12px] text-[#0369A1] font-bold mb-1">📂 你的研究問題</p>
                            <p className="text-[13px] text-[#0C4A6E]">{myQuestion}</p>
                            {myMethod && <p className="text-[12px] text-[#0369A1] mt-1">方法：{myMethod}</p>}
                        </div>
                    )}
                    <div>
                        <p className="text-[13px] font-bold mb-2" style={{ color: '#2563EB' }}>📊 第一層：描述</p>
                        <ThinkRecord dataKey="w15-draft-describe" prompt="根據你的資料，你看到了什麼？報事實、報數字、報最明顯的現象。" scaffold={[FOUR_LAYERS[0].scaffold]} />
                    </div>
                    <div>
                        <p className="text-[13px] font-bold mb-2" style={{ color: '#7C3AED' }}>💡 第二層：詮釋</p>
                        <ThinkRecord dataKey="w15-draft-interpret" prompt="這代表什麼意義？可能的原因是什麼？" scaffold={[FOUR_LAYERS[1].scaffold]} />
                    </div>
                    <div>
                        <p className="text-[13px] font-bold mb-2" style={{ color: '#DC2626' }}>⭐ 第三層：回扣（內容和邏輯只能你自己寫！）</p>
                        <ThinkRecord dataKey="w15-draft-anchor" prompt="直接回答你的研究問題。這個結論能說明什麼？不能確定什麼？" scaffold={[FOUR_LAYERS[2].scaffold]} />
                    </div>
                    <div>
                        <p className="text-[13px] font-bold mb-2" style={{ color: '#059669' }}>🔍 第四層：批判</p>
                        <ThinkRecord dataKey="w15-draft-critique" prompt="你的研究有什麼限制？結論不宜推論到哪裡？未來可以怎麼改進？" scaffold={[FOUR_LAYERS[3].scaffold]} />
                    </div>
                </div>
            ),
        },
        {
            title: '自我檢視',
            icon: <Scale size={18} />,
            content: (
                <div className="flex flex-col gap-6 prose-zh">
                    <div className="p-4 rounded-[var(--radius-unified)] border border-[var(--border)] bg-[var(--paper-warm)]">
                        <p className="text-[14px] font-bold text-[var(--ink)] mb-1">🔍 對著自己初稿做四層自查</p>
                        <p className="text-[12px] text-[var(--ink-mid)] leading-relaxed">
                            Step 2 寫好了初稿，<strong>不用急著找 AI</strong>——先自己重讀一遍。
                            初學者最常踩的雷不是「文句不漂亮」，而是「描述層偷渡因果」「詮釋層用沒問過的變項」「回扣層忘了回答自己的研究問題」。這些自己就抓得到。
                        </p>
                    </div>

                    {/* 個資提醒（為下一步用 AI 預備） */}
                    <div className="p-4 rounded-[var(--radius-unified)] border border-[#FCD34D] bg-[#FFFBEB]">
                        <p className="text-[12px] text-[#92400E] font-bold mb-1">⚠️ 注意：若下一步要用 AI 檢核，記得先清個資</p>
                        <p className="text-[11px] text-[#78350F] leading-relaxed">
                            問卷／訪談資料貼給 AI 前，必須清掉姓名、學號、Line 暱稱（受訪者改 A、B、C）。這是你 W11 簽知情同意書承諾的事。
                        </p>
                    </div>

                    {/* 名詞白話化：相關 vs 因果（最常踩的雷） */}
                    <div className="p-4 rounded-[var(--radius-unified)] border-2 border-[#FCA5A5] bg-[#FEF2F2]">
                        <p className="text-[13px] font-bold text-[#991B1B] mb-2">📖 先搞懂一個詞：相關 vs 因果（高一最容易踩的雷）</p>
                        <div className="grid md:grid-cols-2 gap-2">
                            <div className="bg-white border border-[#FCA5A5] rounded p-3">
                                <p className="text-[12px] font-bold text-[#1E40AF] mb-1">📊 相關 = 「常一起發生」</p>
                                <p className="text-[11.5px] text-[#1E3A8A] leading-relaxed mb-1.5">
                                    兩件事常一起出現，但不確定誰先誰後、誰造成誰。
                                </p>
                                <p className="text-[11px] text-[#1E40AF] italic">
                                    例：「滑手機時間長」和「成績低」常一起出現——但<strong>誰造成誰？</strong>不確定。可能滑手機讓成績差、也可能成績差才滑手機解悶。
                                </p>
                            </div>
                            <div className="bg-white border border-[#FCA5A5] rounded p-3">
                                <p className="text-[12px] font-bold text-[#991B1B] mb-1">⚡ 因果 = 「A 導致 B」</p>
                                <p className="text-[11.5px] text-[#7F1D1D] leading-relaxed mb-1.5">
                                    可以證明 A 改變會讓 B 跟著改變（要排除其他可能）。
                                </p>
                                <p className="text-[11px] text-[#991B1B] italic">
                                    例：「給藥組存活率高於對照組」——藥物導致存活率提高（已控制其他變因）。
                                </p>
                            </div>
                        </div>
                        <p className="text-[11px] text-[#991B1B] italic mt-3 leading-relaxed">
                            💡 高中研究<strong>幾乎都只能說「相關」</strong>，不能說「因為」「導致」「造成」。
                            想說因果？要做嚴格實驗（實驗組 vs 對照組 + 控制其他變因）——問卷／訪談／觀察都做不到。
                        </p>
                    </div>

                    {/* 四層自查清單 */}
                    <div>
                        <p className="text-[13px] font-bold text-[var(--ink)] mb-3">📋 四層自查清單（對著你 Step 2 寫的初稿一條條檢）</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="rounded-[var(--radius-unified)] border-2 border-[#BFDBFE] bg-[#EFF6FF] p-4">
                                <p className="text-[12px] font-bold text-[#1E40AF] mb-2">🔵 描述層</p>
                                <ul className="text-[11.5px] text-[#1E3A8A] leading-relaxed space-y-1">
                                    <li>☐ 所有數字都跟原始資料對得上嗎？</li>
                                    <li>☐ 量詞是否精準（不寫「許多」「大多數」這類模糊詞）？</li>
                                    <li>☐ 有沒有偷渡因果（「因為／導致」是詮釋層的事）？</li>
                                    <li>☐ N 值有清楚交代嗎？</li>
                                </ul>
                            </div>
                            <div className="rounded-[var(--radius-unified)] border-2 border-[#DDD6FE] bg-[#F5F3FF] p-4">
                                <p className="text-[12px] font-bold text-[#5B21B6] mb-2">🟣 詮釋層</p>
                                <ul className="text-[11.5px] text-[#4C1D95] leading-relaxed space-y-1">
                                    <li>☐ 解釋的「原因」是不是用了我問卷沒問過的變項？</li>
                                    <li>☐ 訪談組：有沒有過度詮釋（說超過受訪者實際說的）？</li>
                                    <li>☐ 有沒有區分「相關」與「因果」？</li>
                                    <li>☐ 推論有資料支持，不是我的個人猜測？</li>
                                </ul>
                            </div>
                            <div className="rounded-[var(--radius-unified)] border-2 border-[#FCA5A5] bg-[#FEF2F2] p-4">
                                <p className="text-[12px] font-bold text-[#991B1B] mb-2">🔴 回扣層（核心）</p>
                                <ul className="text-[11.5px] text-[#7F1D1D] leading-relaxed space-y-1">
                                    <li>☐ 有直接回答我最初的研究問題嗎？</li>
                                    <li>☐ 結論強度合理嗎（不寫「證明」「證實」）？</li>
                                    <li>☐ 「能說明什麼／無法確定什麼」兩部分都寫了嗎？</li>
                                    <li>☐ 範圍合理嗎（沒有過度推論到研究範圍外的對象）？</li>
                                </ul>
                            </div>
                            <div className="rounded-[var(--radius-unified)] border-2 border-[#86EFAC] bg-[#F0FDF4] p-4">
                                <p className="text-[12px] font-bold text-[#166534] mb-2">🟢 批判層</p>
                                <ul className="text-[11.5px] text-[#166534] leading-relaxed space-y-1">
                                    <li>☐ 至少列了 2 個研究限制嗎？</li>
                                    <li>☐ 限制有具體（例：樣本只 N=60／自填問卷有社會期許）？</li>
                                    <li>☐ 有說明結論不宜推論到哪些對象？</li>
                                    <li>☐ 提了未來可改進方向嗎？</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* 自查紀錄 */}
                    <ThinkRecord
                        dataKey="w15-self-review"
                        prompt="自查後我發現了什麼問題？做了哪些修正？"
                        scaffold={[
                            '描述層改了：（哪幾個地方）',
                            '詮釋層改了：',
                            '回扣層改了：',
                            '批判層改了：',
                        ]}
                    />

                    {/* 最終四層結論定稿（必繳）— 唯一最終版欄位 */}
                    <div className="p-4 rounded-[var(--radius-unified)] border-2 border-[var(--accent)]">
                        <p className="text-[14px] font-bold text-[var(--accent)] mb-1">📝 四層結論最終版（必繳 · 唯一最終欄位）</p>
                        <p className="text-[12px] text-[var(--ink-mid)] mb-3">
                            這是本週<strong>必繳的成果</strong>，<strong>不論你接下來要不要用 AI 補修</strong>都繳這格——
                            繳交時匯出的就是這格內容。
                            <br />
                            <span className="inline-block mt-2 px-2 py-1 rounded bg-[#F0FDF4] border border-[#86EFAC] text-[11px] text-[#166534]">
                                💡 工作流：先填「自查版」→ 若 Step 4 用 AI 修出更好的版本 → <strong>回來直接覆蓋</strong>這格 → 不再開新欄位
                            </span>
                        </p>
                        <ThinkRecord
                            dataKey="w15-final-draft"
                            prompt="四層結論最終版（你採信為定稿的那一版）"
                            scaffold={[
                                '【描述】...',
                                '【詮釋】...',
                                '【回扣】本研究原本想了解___。根據分析結果，___。但這個結論只能說明___，無法確定___。',
                                '【批判】本研究的限制在於___，因此結論不宜推論至___。未來可以___。',
                            ]}
                        />
                    </div>

                    <div className="p-4 rounded-[var(--radius-unified)] border border-[var(--border)]">
                        <p className="text-[12px] font-bold text-[var(--ink)] mb-2">📋 這份草稿對應期末報告的章節</p>
                        <div className="text-[12px] text-[var(--ink-mid)] leading-relaxed flex flex-col gap-1">
                            <span><strong>第四章 研究結果</strong> → 放【描述層】</span>
                            <span><strong>第五章 討論與結論</strong> → 放【詮釋層】＋【回扣層】＋【批判層】</span>
                        </div>
                    </div>
                </div>
            ),
        },
        {
            title: '補充·AI 檢核（可選）',
            icon: <Bot size={18} />,
            content: (
                <div className="flex flex-col gap-6 prose-zh">
                    {/* 開場：AI 不是必修 */}
                    <div className="p-5 rounded-[var(--radius-unified)] border-2 border-[var(--accent)] bg-[#F8F8FB]">
                        <p className="text-[15px] font-bold text-[var(--accent)] mb-2">🤖 AI 是嚴格教練 · 你可以選擇不用</p>
                        <p className="text-[12px] text-[var(--ink)] leading-relaxed">
                            Step 3 自查通過了，初稿已達本週基本要求。
                            如果想被「AI 嚴格教練」再壓力測試一輪——找盲點、補強研究限制、潤飾文句——可挑下方一種模式。
                            <strong>用了 AI 一定要做裁奪（不能照單全收），並繳完整對話。</strong>
                        </p>
                    </div>

                    {/* AI 協作三原則（W15 角色：嚴格教練） */}
                    <AICollaborationPrinciples week="15" role="critic" compact={true} />

                    {/* 個資鐵規 */}
                    <div className="w15-privacy-card">
                        <div className="w15-privacy-header"><Shield size={16} /> ⚠️ 餵 AI 之前的鐵規</div>
                        <div className="w15-privacy-body">
                            <p className="mb-2">你在 W11 簽了知情同意書，承諾保護受訪者的個人資料。現在要把資料貼給 AI，是個資外流的風險點。</p>
                            <p className="font-bold">📋 問卷：刪除所有姓名、學號、Line 暱稱再貼</p>
                            <p className="font-bold">🎤 訪談：受訪者真實姓名改為代號（A、B、C）再貼</p>
                            <p className="mt-2 font-bold">沒有完成個資清除就把資料貼給 AI，就是違反你對受訪者的承諾。</p>
                        </div>
                    </div>

                    {/* AI 模式選擇（含 standalone 不用 AI） */}
                    <AIModePicker week="15" taskName="四層結論檢核" onChange={setW15AiMode} />

                    {/* standalone：不用 AI */}
                    {w15AiMode === 'standalone' && (
                        <div className="rounded-[var(--radius-unified)] border-2 border-[#BFDBFE] bg-[#EFF6FF] p-5">
                            <p className="text-[14px] font-bold text-[#1E40AF] mb-2">🚫 你選擇不用 AI</p>
                            <p className="text-[12px] text-[#1E3A8A] leading-relaxed">
                                完全 OK——Step 3 自查已經夠紮實。直接到下一步繳交即可（AI-RED 紀錄留空不會扣分）。
                            </p>
                        </div>
                    )}

                    {/* 教學型 */}
                    {w15AiMode === 'teach' && (
                        <div className="rounded-[var(--radius-unified)] border-2 border-[#86EFAC] bg-[#F0FDF4] p-5 space-y-3">
                            <p className="text-[14px] font-bold text-[#166534]">🎓 教學型 Prompt（我寫不出四層）</p>
                            <p className="text-[12px] text-[#166534] leading-relaxed">
                                如果 Step 2 卡關完全寫不出來，可以請 Gemini 示範一個極簡範例給你照做。
                                <strong>看完範例自己回 Step 2 寫一次</strong>，不要直接抄。
                            </p>
                            <PromptBlock text={`我在做研究，需要寫「四層結論」（描述、詮釋、回扣、批判），但我完全不知道怎麼寫。

【我的研究】
- 方法：問卷／訪談／實驗／觀察／文獻
- 研究問題：___
- 主要發現（一句話）：___
- 樣本：N=___，對象是 ___

【請你做】
1. 用我的研究主題，示範一個極簡四層結論範例（每層 1-2 句即可）
2. 用簡單話解釋每一層的「任務是什麼、不能做什麼」
3. 給我四層的「填空模板」，我可以照著填

【不要做】
- 不要替我寫出完整的最終版
- 我會看完範例後自己寫一次再給你檢查`} />
                        </div>
                    )}

                    {/* 驗收型 */}
                    {w15AiMode === 'verify' && (
                        <>
                            {/* 三層紅線判斷卡 */}
                            <div className="p-4 rounded-[var(--radius-unified)] border-2 border-[#DC2626] bg-[#FEF2F2]">
                                <p className="text-[13px] font-bold text-[#991B1B] mb-2">🚦 AI 改稿時——哪些可採納、哪些是紅線</p>
                                <p className="text-[11.5px] text-[#7F1D1D] leading-relaxed mb-3">
                                    AI 會把建議混在一起送回來，你必須<strong>逐條判斷</strong>。三層各有自己的紅線。
                                </p>
                                <div className="grid md:grid-cols-3 gap-2">
                                    <div className="bg-white border border-[#2563EB] rounded-[6px] p-3">
                                        <p className="text-[12px] font-bold text-[#1E40AF] mb-1">🔵 描述層（事實）</p>
                                        <p className="text-[11px] text-[#1E3A8A] leading-[1.7] mb-1"><strong>✅ 可採納：</strong>數字錯誤、量詞不精準（「許多」→「62%」）、時態一致</p>
                                        <p className="text-[11px] text-[#991B1B] leading-[1.7]"><strong>❌ 紅線：</strong>AI 加「因為／所以／導致」這些因果詞——那是詮釋層的事，描述層不能有</p>
                                    </div>
                                    <div className="bg-white border border-[#7C3AED] rounded-[6px] p-3">
                                        <p className="text-[12px] font-bold text-[#5B21B6] mb-1">🟣 詮釋層（推論）</p>
                                        <p className="text-[11px] text-[#4C1D95] leading-[1.7] mb-1"><strong>✅ 可採納：</strong>補你沒想到的合理解釋、提醒「相關 ≠ 因果」</p>
                                        <p className="text-[11px] text-[#991B1B] leading-[1.7]"><strong>❌ 紅線：</strong>AI 用<strong>你問卷沒問過的變項</strong>當原因（例：你沒問升學壓力，AI 卻寫「因為升學壓力」）——拒絕</p>
                                    </div>
                                    <div className="bg-white border border-[#DC2626] rounded-[6px] p-3">
                                        <p className="text-[12px] font-bold text-[#991B1B] mb-1">🔴 回扣層（核心）</p>
                                        <p className="text-[11px] text-[#7F1D1D] leading-[1.7] mb-1"><strong>✅ 可採納：</strong>句子變通順、用詞更學術（「我發現」→「本研究發現」）</p>
                                        <p className="text-[11px] text-[#991B1B] leading-[1.7]"><strong>❌ 紅線：</strong>AI 改了<strong>你的研究問題答案</strong>、加了你沒做的限制、改了結論強度（「有相關」→「有顯著相關」）——這是研究的靈魂，不能讓 AI 動</p>
                                    </div>
                                </div>
                                <p className="text-[11px] text-[#991B1B] italic leading-relaxed mt-2">
                                    💡 紅線判斷法：問自己「<strong>這條建議是『換更好聽的說法』還是『換內容』？</strong>」換內容＝拒絕。
                                </p>
                                {/* 常見失誤具體例：3 個學生最容易踩的紅線 */}
                                <details className="mt-2 bg-white border border-[#DC2626] rounded">
                                    <summary className="cursor-pointer px-3 py-2 hover:bg-[#FEF2F2] flex items-center gap-2">
                                        <span className="text-[11.5px] font-bold text-[#991B1B]">📋 學生最容易踩的 3 個紅線（點開看實例）</span>
                                        <span className="ml-auto text-[10px] font-mono text-[#991B1B]">▼</span>
                                    </summary>
                                    <div className="border-t border-[#DC2626] px-4 py-3 space-y-2 text-[11.5px] text-[#7F1D1D] leading-relaxed">
                                        <div>
                                            <p className="font-bold text-[#991B1B] mb-0.5">❌ 失誤 1：你寫「相關」、AI 改成「導致」</p>
                                            <p>你：「使用手機時間和成績有相關」→ AI 改：「使用手機<u>導致</u>成績下降」← 結論強度被換，<strong>拒絕</strong>。</p>
                                        </div>
                                        <div>
                                            <p className="font-bold text-[#991B1B] mb-0.5">❌ 失誤 2：你訪問 6 人、AI 改成「高中生普遍認為」</p>
                                            <p>你：「6 位受訪者多數提到家長期待」→ AI 改：「<u>高中生普遍認為</u>家長期待是主因」← 推論範圍被擴大，<strong>拒絕</strong>。</p>
                                        </div>
                                        <div>
                                            <p className="font-bold text-[#991B1B] mb-0.5">❌ 失誤 3：你沒問升學壓力、AI 卻寫「可能因為升學壓力」</p>
                                            <p>你問卷只有滑手機+成績兩變項 → AI 詮釋層加：「可能因為升學壓力導致」← AI 用了你<strong>沒問過的變項</strong>，<strong>拒絕</strong>。</p>
                                        </div>
                                    </div>
                                </details>
                            </div>

                            <div>
                                <p className="text-[14px] font-bold text-[var(--ink)] mb-2">🥊 驗收型：選擇你的研究方法，取得對應的檢核 Prompt</p>
                                <p className="text-[11.5px] text-[var(--ink-mid)] mb-2 leading-relaxed">
                                    預設帶入<strong className="text-[var(--ink)]">你 W9 選的方法</strong>，但 5 個分頁都可以點——這是研究方法課，<strong className="text-[var(--ink)]">看一下別組的 Prompt 怎麼下，是這節課該做的事</strong>。
                                </p>
                                <div className="bg-[var(--paper-warm)] border border-[var(--border)] rounded p-2 mb-3 text-[11px] text-[var(--ink-mid)] leading-relaxed">
                                    📋 <strong>三步驟用法：</strong>
                                    ① 點你的方法分頁 → ② 複製 Prompt 貼到 Gemini → ③ <strong>記得把【貼上初稿】【貼上資料】兩個括號替換成你實際的內容</strong>，否則 AI 會問你資料在哪。
                                </div>
                                <MethodSelector />
                            </div>

                            {/* 跨工具：Prompt 範本庫（自學） */}
                            <div className="bg-[var(--paper-warm)] border border-[var(--border)] rounded-[var(--radius-unified)] p-3 flex items-center justify-between gap-3">
                                <p className="text-[12px] text-[var(--ink-mid)] leading-relaxed">
                                    💡 想看更進階的 5 法檢核 prompt？回 <strong className="text-[var(--ink)]">Prompt 範本庫</strong>看 Step 2-5 進階版——自學用，不影響本週繳交。
                                </p>
                                <a
                                    href="/analysis-station"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 bg-[var(--accent)] text-white px-3 py-1.5 rounded-[var(--radius-unified)] font-bold text-[12px] hover:opacity-90 transition-opacity no-underline flex-shrink-0"
                                >
                                    📚 開範本庫
                                </a>
                            </div>

                            {/* AI 建議紀錄 */}
                            <ThinkRecord
                                dataKey="w15-ai-feedback"
                                prompt="AI 提供了哪些建議？分別記錄描述層、詮釋層、回扣層潤飾、研究限制的建議重點。"
                                scaffold={['描述層建議：...', '詮釋層建議：...', '回扣層潤飾：...', '研究限制建議：1.__ 2.__ 3.__']}
                            />

                            {/* 人工裁奪 */}
                            <div className="p-4 rounded-[var(--radius-unified)] border border-[var(--border)] bg-[var(--paper-warm)]">
                                <p className="text-[14px] font-bold text-[var(--ink)] mb-1">⚖️ 人工裁奪 · 對照 AI 版本，逐條判斷</p>
                                <p className="text-[12px] text-[var(--ink-mid)] leading-relaxed">
                                    AI 給你的是建議，不是答案。每一條都要決定：<strong>採納、不採納、還是修改後採納</strong>。
                                </p>
                            </div>
                            <ThinkRecord
                                dataKey="w15-judge-table"
                                prompt="逐條記錄 AI 的建議和你的裁奪（採納/不採納/修改後採納），並說明原因。"
                                scaffold={['建議1：___。裁奪：___。原因：...', '建議2：___。裁奪：___。原因：...', '建議3：___。裁奪：___。原因：...']}
                                placeholder="品質下限：至少 3 條建議要寫到「原因」（不能只寫『採納』兩字）。AI 通常給 5-10 條，全採納或全拒絕都是失格——學會挑、會說為什麼，才是本步驟的核心。"
                            />
                            <ThinkRecord
                                dataKey="w15-rejected"
                                prompt="我拒絕了 AI 哪個建議？原因是什麼？"
                                scaffold={['我拒絕了___，因為...']}
                            />
                            <ThinkRecord
                                dataKey="w15-human-context"
                                prompt="有什麼是 AI 說不出來、但我知道的研究脈絡？"
                                scaffold={['AI 不知道的是...，但我知道因為...']}
                            />

                            <div className="p-4 rounded-[var(--radius-unified)] border-2 border-[var(--accent)] bg-[#F8F8FB]">
                                <p className="text-[12px] font-bold text-[var(--accent)] mb-2">📝 採納 AI 建議？回 Step 3 覆蓋同一格</p>
                                <p className="text-[11px] text-[var(--ink-mid)] leading-relaxed">
                                    本週<strong>只有一個「最終版」欄位</strong>（在 Step 3）。
                                    若你採納 AI 建議寫出更好的版本——<strong>回 Step 3 直接覆蓋同一格</strong>，匯出時就會是 AI 修後版。
                                    沒覆蓋 = 以你 Step 3 寫的自查版為準。
                                    <strong className="text-[var(--accent)]">不要在這裡開新欄位</strong>——避免「不知道哪版才是定稿」的混亂。
                                </p>
                            </div>

                            {/* 完整對話繳交 */}
                            <AIDialogSubmission week="15" taskName="四層結論檢核對話" required={true} />
                        </>
                    )}

                    {!w15AiMode && (
                        <div className="rounded-[var(--radius-unified)] border border-[var(--border)] bg-[var(--paper-warm)] p-3">
                            <p className="text-[12px] text-[var(--ink-mid)] leading-relaxed">
                                ☝️ 上方先選一個 AI 使用模式：教學型（寫不出來）／驗收型（有初版了找盲點）／不用 AI。
                            </p>
                        </div>
                    )}
                </div>
            ),
        },
        {
            title: '回顧繳交',
            icon: <FileText size={18} />,
            content: (
                <div className="flex flex-col gap-6 prose-zh">
                    <div className="p-4 rounded-[var(--radius-unified)] border border-[var(--border)] bg-[var(--paper-warm)]">
                        <p className="text-[14px] font-bold text-[var(--ink)] mb-1">💡 AI 協作反思</p>
                        <p className="text-[12px] text-[var(--ink-mid)]">回顧今天和 AI 的協作過程。</p>
                    </div>
                    <ThinkRecord dataKey="w15-ai-helpful" prompt="今天 AI 最有幫助的地方是什麼？" />
                    <ThinkRecord dataKey="w15-ai-limit" prompt="今天 AI 最大的限制是什麼？" />
                    <ThinkRecord dataKey="w15-ai-blind-trust" prompt="如果我完全相信 AI，我會犯什麼錯？" />
                    {/* AIRED 敘事紀錄（用了 AI 必填） */}
                    {(w15AiMode === 'teach' || w15AiMode === 'verify') ? (
                        <AIREDNarrative week="15" hint="本週用 AI 壓力測試四層結論：A=Gemini Pro / I=方法別 prompt / R=AI 找到的限制與盲點 / E=我同意/不同意哪些 / D=採納哪些修正" />
                    ) : (
                        <AIREDNarrative week="15" hint="本週若有用 AI 檢核四層結論，記下最關鍵的一次互動" optional={true} />
                    )}

                    {/* 本週結束，你應該要會 — B 標準格式 */}
                    <div className="bg-white border border-[var(--border)] rounded-[var(--radius-unified)] overflow-hidden mb-4">
                        <div className="p-4 px-5 bg-[var(--paper-warm)] border-b border-[var(--border)] font-bold text-[13px]">
                            ✅ 本週結束，你應該要會
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-[1px] bg-[var(--border)]">
                            {[
                                                '寫出四層次結論（描述／詮釋／回扣／批判）',
                                                '用四層自查清單抓出自己初稿的問題',
                                                '若選用 AI 檢核：保留自己的最終裁奪權，識別紅線',
                                                '反思「完全相信 AI 會犯的錯」並用紅線守住',
                            ].map((item, i) => (
                                <div key={i} className="p-4 px-5 bg-white flex items-start gap-3">
                                    <span className="text-[var(--success)] text-[16px] mt-0.5 flex-shrink-0">✓</span>
                                    <span className="text-[13px] text-[var(--ink-mid)] leading-relaxed">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <ExportButton weekLabel="W15 從圖的說明到研究結論：四層次寫作工作坊" fields={EXPORT_FIELDS} />

                    {/* 遊戲彩蛋 */}
                    <div className="bg-[var(--ink)] border-l-4 border-[var(--danger)] p-6 rounded-r-lg text-white shadow-xl">
                        <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                            <ShieldAlert className="text-[var(--danger)]" size={20} />
                            R.I.B. 單元挑戰：行動代號濾鏡
                        </h3>
                        <p className="text-[var(--ink-light)] text-sm mb-4">
                            資料裁奪能力——面對可疑數據或結論，你能挑出真正該採納的那一份嗎？
                        </p>
                        <Link to="/game/data-detective" className="inline-flex items-center gap-2 bg-[var(--danger)] text-white px-4 py-2 rounded font-bold text-sm hover:opacity-90 transition-colors">
                            進入濾鏡 <ArrowRight size={14} />
                        </Link>
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
                    <span className="hidden md:inline">研究方法與專題 / 分析與報告 / </span><span className="text-[var(--ink)] font-bold">研究結論 W15</span>
                </div>
                <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
                    <span className="bg-[var(--paper-warm)] text-[var(--ink)] text-[10px] font-bold px-2 py-0.5 rounded-[2px] font-mono">100 MINS</span>
                    <ResetWeekButton weekPrefix="w15-" />
                    <span className="hidden md:inline-block bg-[var(--ink)] text-white text-[10px] font-bold px-2 py-0.5 rounded-[2px] font-mono">AI-RED · D</span>
                </div>
            </div>

            {/* PAGE HEADER — Hero Block */}
            <HeroBlock
                kicker="R.I.B. 調查檔案 · 研究方法與專題 · W15"
                title="四層結論 · "
                accentTitle="從圖的說明到研究結論"
                subtitle="W14 寫的是「一張圖的說明」。今天升級：用描述、詮釋、回扣、批判四層整合整份研究。先自己寫、再自己自查；想再被 AI 嚴格教練檢一輪？可選用，不強迫。"
                chain="W14 你會說明一張圖了——但整份研究有十幾張圖、訪談、文獻。怎麼整合成『所以我發現了什麼』？這週寫研究結論（描述／詮釋／回扣／批判 四層整合）。"
                meta={[
                    { label: '本週任務', value: '四層結論寫作 + 自查 + 補充 AI 檢核（可選）' },
                    { label: '時長', value: '100 MINS' },
                    { label: '課堂產出', value: '自查通過的四層結論定稿' },
                    { label: '下週預告', value: 'W16 報告與海報' },
                ]}
            />
            <CourseArc items={W15Data.courseArc} />

            <TaskCard
                weekNumber="W15"
                weekTitle={W15Data.title}
                duration={`${W15Data.duration} 分鐘 · ${W15Data.durationDesc}`}
                tasks={[
                    '四層寫作法 — 描述 / 詮釋 / 回扣 / 批判',
                    '回扣層練習 — 把你的發現連回研究問題',
                    '批判層練習 — 寫出至少 3 個研究限制',
                ]}
                exportReminder="匯出 W15 結論章 → W16 報告整合"
            />

            {/* W15 任務前警戒語 — 2 條核心紅線（相關≠因果 + 寫研究限制段）*/}
            <ResearcherRedlines mode="warning" stage="W15" />

            {/* STEP ENGINE */}
            <StepEngine
                steps={steps}
                prevWeek={{ label: '回 W14 圖表與圖說', to: '/w14' }}
                nextWeek={{ label: '前往 W16 報告與海報', to: '/w16' }}
            flat
            />

            {/* W15 三欄結論寫作鷹架 — 寫結論前先把每句話分類「能說 / 謹慎說 / 不能說」 */}
            <ThreeColumnConclusion dataKey="w15-three-column" />

            {/* W15 改寫練習 — 反糾察隊配套（雷 #3「證實了」）*/}
            <TrapRewritePractice
                trapNumber={3}
                stage="W15"
                title="「證實了」太武斷"
                wrong="這證實了充足的睡眠是維持高中生課堂專注力的最關鍵基石。"
                issue="「證實」是因果用詞——單一研究、N=22、自評偏誤、無對照組，憑什麼「證實」？「最關鍵」是過度推論。"
                hint="把「證實」改成研究員的保守語氣（本研究發現 / 初步觀察到）。把「最關鍵基石」拿掉強因果。"
                shouldDo="本研究在 22 位高一學生中初步觀察到：睡眠時數較高的學生，自評專注力傾向較高。但本研究設計無法判斷睡眠是否為「最關鍵」因素。"
                dataKey="w15-trap-rewrite-3"
            />

            {/* W15 末 Brave Scientist 反思 — 反「學術糾察隊效應」配套 */}
            <BraveScientistReflection dataKey="w15-brave-scientist" />

            {/* W15 階段紅線完整版 — 7 條 · 做完反思用 */}
            <ResearcherRedlines mode="subset" stage="W15" collapsible />
        </div>
    );
};

export { W15Page };
export default W15Page;
