import React, { useState, useCallback } from 'react';
import CourseArc from '../components/ui/CourseArc';
import { W14Data } from '../data/lessonMaps';
import './W15.css';
import ThinkRecord from '../components/ui/ThinkRecord';
import AIREDNarrative from '../components/ui/AIREDNarrative';
import StepEngine from '../components/ui/StepEngine';
import HeroBlock from '../components/ui/HeroBlock';
import ExportButton from '../components/ui/ExportButton';
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
} from 'lucide-react';

/* ══════════════════════════════════════
 *  資料常數
 * ══════════════════════════════════════ */

const FOUR_LAYERS = [
    { name: '描述', color: '#2563EB', task: '客觀報告數據或現象', ai: '人先寫，AI 檢核有無數字錯誤或量詞不精準', scaffold: '根據___，___，其中最明顯的是___。' },
    { name: '詮釋', color: '#7C3AED', task: '解釋意義、推測原因', ai: '人先寫，AI 優化並補充可能遺漏的原因', scaffold: '這個結果顯示___，可能的原因是___。' },
    { name: '回扣', color: '#DC2626', task: '直接回答研究問題', ai: '人寫內容和邏輯，AI 只能潤飾文句', scaffold: '本研究原本想了解___。根據分析結果，本研究的答案是___。但這個結論只能說明___，無法確定___。', star: true },
    { name: '批判', color: '#059669', task: '說出研究的限制', ai: '人先寫，AI 補充常見限制類型供參考', scaffold: '本研究的限制在於___，因此結論不宜推論至___。若要更完整回答這個問題，未來可以___。' },
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
        tips: ['AI 說得比受訪者更強 → 就是過度詮釋，對照原文', '只有 1 人說的 → 個案，不能說成普遍現象', '多數受訪者都提到的 → 才算主要發現'],
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
    { key: 'w15-foreshadow', label: 'W14 伏筆填答' },
    { key: 'w15-draft-describe', label: '初稿：描述層' },
    { key: 'w15-draft-interpret', label: '初稿：詮釋層' },
    { key: 'w15-draft-anchor', label: '初稿：回扣層' },
    { key: 'w15-draft-critique', label: '初稿：批判層' },
    { key: 'w15-ai-feedback', label: 'AI 檢核建議紀錄' },
    { key: 'w15-judge-table', label: '裁奪紀錄' },
    { key: 'w15-rejected', label: '拒絕 AI 的建議與原因' },
    { key: 'w15-human-context', label: 'AI 說不出來但我知道的脈絡' },
    { key: 'w15-final-draft', label: '最終四層結論草稿' },
    { key: 'w15-ai-helpful', label: 'AI 最有幫助的地方' },
    { key: 'w15-ai-limit', label: 'AI 最大的限制' },
    { key: 'w15-ai-blind-trust', label: '完全相信 AI 會犯的錯' },
    { key: 'w15-aired-record', label: 'AI-RED 敘事紀錄', question: '本週最重要的一次 AI 互動（A-I-R-E-D 五要素）' },
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
        const t = myMethod.toLowerCase();
        if (t.includes('問卷')) return 'questionnaire';
        if (t.includes('訪談')) return 'interview';
        if (t.includes('實驗')) return 'experiment';
        if (t.includes('觀察')) return 'observation';
        if (t.includes('文獻')) return 'literature';
        return null;
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
                <p className="text-[12px] text-[var(--ink-mid)]">請點選你的研究方法以顯示對應的 Prompt。</p>
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
                        <p className="text-[12px] text-[var(--ink-mid)] leading-relaxed mt-2" style={{ borderTop: '1px dashed var(--border)', paddingTop: 8 }}>
                            💡 <strong>名詞升級：</strong>W14 的「推論」在學術上更精確的說法是「詮釋」——意思一樣，都是「解釋數據背後的意義」。今天開始我們用四層學術名稱：描述、詮釋、回扣、批判。
                        </p>
                    </div>
                    <ThinkRecord dataKey="w15-foreshadow" prompt="W14 留下的伏筆：結論的第三層叫___，任務是___。第四層叫___，任務是___。" scaffold={['第三層叫做「回扣」，任務是：直接回答研究問題', '第四層叫做「批判」，任務是：說出研究的限制']} />
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
                        <p className="text-[12px] text-[#991B1B] leading-relaxed">
                            AI 可以幫你把回扣層的文句說得更通順，但<strong>內容和邏輯只能由你來寫</strong>。因為只有你知道你當初為什麼要做這個研究、你的問題問的是什麼。
                        </p>
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
                        </div>
                        <p className="text-[11px] text-[var(--ink-mid)] mt-3">
                            注意共同結構：「原本想了解___」→「根據結果，___」→「因此答案是___」→「但只能說明___，無法確定___」
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
            title: 'AI 檢核',
            icon: <Bot size={18} />,
            content: (
                <div className="flex flex-col gap-6 prose-zh">
                    <div className="w15-privacy-card">
                        <div className="w15-privacy-header"><Shield size={16} /> ⚠️ 餵 AI 之前的鐵規</div>
                        <div className="w15-privacy-body">
                            <p className="mb-2">你在 W11 簽了知情同意書，承諾保護受訪者的個人資料。現在要把資料貼給 AI，是個資外流的風險點。</p>
                            <p className="font-bold">📋 問卷：刪除所有姓名、學號、Line 暱稱再貼</p>
                            <p className="font-bold">🎤 訪談：受訪者真實姓名改為代號（A、B、C）再貼</p>
                            <p className="mt-2 font-bold">沒有完成個資清除就把資料貼給 AI，就是違反你對受訪者的承諾。</p>
                        </div>
                    </div>
                    <div>
                        <p className="text-[14px] font-bold text-[var(--ink)] mb-2">🗂️ 選擇你的研究方法，取得對應的 Prompt</p>
                        <MethodSelector />
                    </div>
                    <ThinkRecord dataKey="w15-ai-feedback" prompt="AI 提供了哪些建議？分別記錄描述層、詮釋層、回扣層潤飾、研究限制的建議重點。" scaffold={['描述層建議：...', '詮釋層建議：...', '回扣層潤飾：...', '研究限制建議：1.__ 2.__ 3.__']} />
                </div>
            ),
        },
        {
            title: '人工裁奪',
            icon: <Scale size={18} />,
            content: (
                <div className="flex flex-col gap-6 prose-zh">
                    <div className="p-4 rounded-[var(--radius-unified)] border border-[var(--border)] bg-[var(--paper-warm)]">
                        <p className="text-[14px] font-bold text-[var(--ink)] mb-1">⚖️ 對照 AI 版本，逐條判斷</p>
                        <p className="text-[12px] text-[var(--ink-mid)] leading-relaxed">
                            AI 給你的是建議，不是答案。每一條都要決定：<strong>採納、不採納、還是修改後採納</strong>。
                        </p>
                    </div>
                    <ThinkRecord dataKey="w15-judge-table" prompt="逐條記錄 AI 的建議和你的裁奪（採納/不採納/修改後採納），並說明原因。" scaffold={['建議1：___。裁奪：___。原因：...', '建議2：___。裁奪：___。原因：...', '建議3：___。裁奪：___。原因：...']} />
                    <ThinkRecord dataKey="w15-rejected" prompt="我拒絕了 AI 哪個建議？原因是什麼？" scaffold={['我拒絕了___，因為...']} />
                    <ThinkRecord dataKey="w15-human-context" prompt="有什麼是 AI 說不出來、但我知道的研究脈絡？" scaffold={['AI 不知道的是...，但我知道因為...']} />
                    <div className="p-4 rounded-[var(--radius-unified)] border-2 border-[var(--accent)]">
                        <p className="text-[14px] font-bold text-[var(--accent)] mb-3">📝 最終四層結論草稿</p>
                        <ThinkRecord dataKey="w15-final-draft" prompt="整合後的最終版本。確認回扣層的內容還是你自己的，AI 只改了文句。" scaffold={['【描述】...', '【詮釋】...', '【回扣】本研究原本想了解___。根據分析結果，___。但這個結論只能說明___，無法確定___。', '【批判】本研究的限制在於___，因此結論不宜推論至___。未來可以___。']} />
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
                                        {/* AIRED 敘事紀錄（循序漸進：五欄 → 一段話） */}
                    <AIREDNarrative week="15" hint="這週用 AI 檢核四層結論" />

                    <ExportButton weekLabel="W15 從圖的說明到研究結論：四層次寫作工作坊" fields={EXPORT_FIELDS} />
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
                    <span className="hidden md:inline-block bg-[var(--ink)] text-white text-[10px] font-bold px-2 py-0.5 rounded-[2px] font-mono">AI-RED · D</span>
                </div>
            </div>

            {/* PAGE HEADER — Hero Block */}
            <HeroBlock
                kicker="R.I.B. 調查檔案 · 研究方法與專題 · W15"
                title="四層結論 · "
                accentTitle="從圖的說明到研究結論"
                subtitle="W14 的描述＋推論是「一張圖的說明」。今天升級：把整份研究的所有發現整合，用描述、詮釋、回扣、批判四層寫出完整研究結論。"
                meta={[
                    { label: '本週任務', value: '四層結論寫作 + AI 檢核 + 人工裁奪' },
                    { label: '時長', value: '100 MINS' },
                    { label: '課堂產出', value: '研究結論定稿 + 章節對應' },
                    { label: '下週預告', value: 'W16 報告與海報' },
                ]}
            />
            <CourseArc items={W14Data.courseArc} />

            {/* STEP ENGINE */}
            <StepEngine
                steps={steps}
                prevWeek={{ label: '回 W14 圖表與圖說', to: '/w14' }}
                nextWeek={{ label: '前往 W16 報告與海報', to: '/w16' }}
            flat
            />
        </div>
    );
};

export { W15Page };
export default W15Page;
