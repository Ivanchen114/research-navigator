import React, { useState, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CourseArc from '../components/ui/CourseArc';
import './ToolRefinementPage.css';
import ThinkRecord from '../components/ui/ThinkRecord';
import StepEngine from '../components/ui/StepEngine';
import ExportButton from '../components/ui/ExportButton';
import { readRecords } from '../components/ui/ThinkRecord';
import {
    ArrowRight,
    CheckCircle2,
    Bot,
    Users,
    Copy,
    Check,
    Zap,
} from 'lucide-react';

/* ══════════════════════════════════════
 *  資料常數
 * ══════════════════════════════════════ */

const METHOD_OPTIONS = [
    { id: 'questionnaire', label: '📋 問卷組' },
    { id: 'interview', label: '🎤 訪談組' },
    { id: 'experiment', label: '🧪 實驗組' },
    { id: 'observation', label: '👀 觀察組' },
    { id: 'literature', label: '📚 文獻組' },
];

/* — 各方法 AI 檢核 Prompt — */
const AI_PROMPTS = {
    questionnaire: `我設計了一份問卷，請幫我檢查：
1. 有沒有問題不清楚？
2. 選項是否完整、互斥？
3. 有沒有雙重否定或雙重問題？
4. 倫理考量是否足夠（知情同意、隱私保護）？
5. 給我具體修改建議。

【貼上你的問卷】`,
    interview: `我設計了訪談大綱，請幫我檢查：
1. 問題是否開放式？
2. 追問設計是否合理？
3. 順序是否流暢（從簡單到深層）？
4. 倫理考量是否足夠？
5. 給我具體修改建議。

【貼上你的訪談大綱】`,
    experiment: `我設計了一個實驗，請幫我檢查：
1. 自變項與依變項的操作型定義清楚嗎？
2. 控制變項有遺漏嗎？
3. 實驗流程有邏輯漏洞嗎？
4. 倫理考量是否足夠？
5. 給我具體修改建議。

【貼上你的實驗設計】`,
    observation: `我設計了觀察紀錄表，請幫我檢查：
1. 觀察行為的定義夠具體嗎？（是外顯行為而非推測？）
2. 記錄方式來得及嗎？
3. 觀察時段和地點設定合理嗎？
4. 倫理考量是否足夠？
5. 給我具體修改建議。

【貼上你的觀察紀錄表設計】`,
    literature: `我設計了文獻分析架構，請幫我檢查：
1. 搜尋策略（關鍵字、篩選標準）夠精準嗎？
2. 比較矩陣的欄位能回答研究問題嗎？
3. 納入／排除標準合理嗎？
4. 來源品質分級方式合適嗎？
5. 給我具體修改建議。

【貼上你的文獻分析架構】`,
};

const GENERIC_PROMPT = `我設計了一份研究工具，請幫我檢查：
1. 有沒有不清楚的地方？
2. 設計有什麼邏輯漏洞？
3. 倫理考量足夠嗎？
4. 給我具體修改建議。

【貼上你的工具內容】`;

/* — AI 的限制 — */
const AI_LIMITS = [
    { icon: '👁️', title: 'AI 看的是「文字」', desc: '看不到實際填答或訪談時的感受' },
    { icon: '🏫', title: 'AI 不知道「文化脈絡」', desc: '高中生的用語習慣、本校的特殊情況' },
    { icon: '⏱️', title: 'AI 不知道「實際可行性」', desc: '問卷會不會太長、訪談會不會太久，填填看才知道' },
];

/* — 各方法配對指示 — */
const PAIRING_INSTRUCTIONS = {
    questionnaire: '找另一組同學互填問卷。填完後記錄：哪題不清楚？哪個選項不知道怎麼選？花了多久填完？',
    interview: '兩人一組互相模擬訪談。一人當訪談者、一人當受訪者，訪完後交換。注意：哪個問題讓你卡住？哪個追問太尬？',
    experiment: '找同學實際跑一遍實驗流程。記錄：指令清楚嗎？需要多久？有沒有突發狀況？',
    observation: '去實際場域試觀察 10 分鐘。記錄：來得及嗎？分類明確嗎？有沒有行為你歸不了類？',
    literature: '請同學看你的比較矩陣。問他：看得懂嗎？欄位有沒有多餘或遺漏？能回答你的研究問題嗎？',
};

/* — ExportButton 欄位 — */
const EXPORT_FIELDS = [
    /* Step 1 */
    { key: 'w10-tool-text', label: '工具文字版', question: '你貼給 AI 檢核的工具內容' },
    { key: 'w10-ai-raw-feedback', label: 'AI 原始回覆', question: 'AI 給你的檢核報告' },
    /* Step 2 */
    { key: 'w10-ai-judge', label: 'AI 建議判斷表', question: '逐條判斷 AI 建議' },
    { key: 'w10-judge-principle', label: '判斷原則', question: '你採納／不採納的理由是什麼？' },
    { key: 'w10-tool-revision', label: '第一輪修正紀錄', question: '根據 AI 建議修改了什麼？' },
    /* Step 3 */
    { key: 'w10-pilot-partner', label: '預試配對對象' },
    { key: 'w10-pilot-findings', label: '預試發現', question: '真人測試時發現了什麼問題？' },
    /* Step 4 */
    { key: 'w10-ai-found', label: 'AI 發現的問題' },
    { key: 'w10-human-found', label: '人工預試才發現的問題' },
    { key: 'w10-ai-effective', label: 'AI 建議效果評估', question: 'AI 建議的修改，預試後效果如何？' },
    { key: 'w10-final-revision', label: '最終修正紀錄', question: '預試後的最終修改' },
    /* Step 5 */
    { key: 'w10-ai-reflection', label: 'AI 協助研究反思', question: '使用 AI 協助研究工具設計的心得' },
];

/* ══════════════════════════════════════
 *  內部元件：可複製 Prompt 框
 * ══════════════════════════════════════ */

const CopyablePrompt = ({ text }) => {
    const [copied, setCopied] = useState(false);
    const handleCopy = useCallback(() => {
        navigator.clipboard.writeText(text).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }).catch(() => {
            /* fallback: select + copy */
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
        <div className="w10-prompt-box">
            <div className="w10-prompt-header">
                <span className="w10-prompt-label">
                    <Bot size={14} /> AI 檢核 Prompt — 複製後貼到 AI 對話窗
                </span>
                <button onClick={handleCopy} className="w10-copy-btn">
                    {copied ? <><Check size={12} /> 已複製</> : <><Copy size={12} /> 複製</>}
                </button>
            </div>
            <pre className="w10-prompt-text">{text}</pre>
        </div>
    );
};

/* ══════════════════════════════════════
 *  主元件
 * ══════════════════════════════════════ */

export const ToolRefinementPage = () => {
    const [w9Method, setW9Method] = useState('');
    const [w9Topic, setW9Topic] = useState('');
    const [detectedMethodId, setDetectedMethodId] = useState('');

    /* W9 資料帶入 */
    useEffect(() => {
        const saved = readRecords();
        const method = saved['w9-my-method']?.trim() || saved['w8-tool-method']?.trim() || '';
        const topic = saved['w8-merged-topic']?.trim() || saved['w8-research-question']?.trim() || '';
        if (method) setW9Method(method);
        if (topic) setW9Topic(topic);

        const ml = method.toLowerCase();
        if (ml.includes('問卷')) setDetectedMethodId('questionnaire');
        else if (ml.includes('訪談')) setDetectedMethodId('interview');
        else if (ml.includes('實驗')) setDetectedMethodId('experiment');
        else if (ml.includes('觀察')) setDetectedMethodId('observation');
        else if (ml.includes('文獻')) setDetectedMethodId('literature');
    }, []);

    const currentPrompt = AI_PROMPTS[detectedMethodId] || '';
    const currentPairing = PAIRING_INSTRUCTIONS[detectedMethodId] || '找同學互相測試你的研究工具。';

    /* ── 五步驟 ──────────────────────────────────────── */

    const steps = [
        /* ─── Step 1：AI 檢核站 ─── */
        {
            title: 'AI 檢核站',
            icon: '🤖',
            content: (
                <div className="space-y-8">
                    <p className="text-[14px] text-[var(--ink-mid)] leading-relaxed max-w-[720px]">
                        W9 你用三欄對應表完成了工具的「系統版」設計。今天讓 <strong className="text-[var(--ink)]">AI 當第一輪品管員</strong>——它能快速找出你沒注意到的問題。但記住：<strong className="text-[var(--accent)]">AI 不一定對，你要判斷！</strong>
                    </p>

                    {/* W9 帶入 */}
                    {(w9Topic || w9Method) && (
                        <div className="flex items-start gap-3 px-4 py-3 rounded-[var(--radius-unified)] bg-[var(--accent-light)] border border-[var(--accent)] text-[13px]">
                            <span className="text-[16px]">📎</span>
                            <div>
                                <span className="font-bold text-[var(--accent)]">W9 研究檔案帶入</span>
                                {w9Topic && <p className="text-[var(--ink-mid)] mt-0.5">研究題目：{w9Topic}</p>}
                                {w9Method && <p className="text-[var(--ink-mid)] mt-0.5">選用方法：{w9Method}</p>}
                            </div>
                        </div>
                    )}

                    {/* 任務流程 */}
                    <div className="bg-white border border-[var(--border)] rounded-[var(--radius-unified)] overflow-hidden">
                        <div className="px-5 py-3 bg-[var(--ink)] text-white flex items-center gap-2">
                            <Zap size={16} />
                            <span className="font-bold text-[13px]">今天的任務流程</span>
                        </div>
                        <div className="p-5 space-y-3 text-[13px] text-[var(--ink-mid)]">
                            {[
                                ['1️⃣', '把你的工具整理成文字版，貼給 AI 檢核'],
                                ['2️⃣', '逐條判斷 AI 的建議——採納？不採納？部分採納？'],
                                ['3️⃣', '根據判斷結果修正工具'],
                                ['4️⃣', '下節課人工預試——讓真人試用你的工具'],
                            ].map(([num, text], i) => (
                                <div key={i} className="flex items-start gap-3">
                                    <span className="text-[16px]">{num}</span>
                                    <span>{text}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* AI Prompt */}
                    <CopyablePrompt text={currentPrompt || GENERIC_PROMPT} />

                    {!currentPrompt && (
                        <div className="bg-[var(--paper-warm)] border border-[var(--border)] rounded-[var(--radius-unified)] p-4 text-[13px] text-[var(--ink-mid)]">
                            <strong className="text-[var(--ink)]">💡 提示：</strong> 未偵測到 W9 的方法選擇，顯示通用 Prompt。建議回 W9 完成三欄對應表後再來。
                        </div>
                    )}

                    {/* 貼工具 */}
                    <ThinkRecord
                        dataKey="w10-tool-text"
                        prompt="Step 1：把你的工具文字版貼在這裡（問卷題目／訪談大綱／實驗流程／觀察表／文獻架構）"
                        placeholder="從 Google 表單、Word 或 W9 的三欄對應表複製你的工具內容……"
                        rows={8}
                    />

                    {/* 貼 AI 回覆 */}
                    <ThinkRecord
                        dataKey="w10-ai-raw-feedback"
                        prompt="Step 2：把 AI 的檢核回覆貼在這裡"
                        placeholder="複製 AI（Claude／ChatGPT／Gemini）的完整回覆……"
                        rows={8}
                    />
                </div>
            ),
        },

        /* ─── Step 2：AI 建議判斷表 ─── */
        {
            title: 'AI 建議判斷表',
            icon: '⚖️',
            content: (
                <div className="space-y-8">
                    <p className="text-[14px] text-[var(--ink-mid)] leading-relaxed max-w-[720px]">
                        AI 給了一堆建議，但<strong className="text-[var(--ink)]">不是每條都要照做</strong>。逐條判斷：這個建議合理嗎？適合高中生的研究嗎？符合你的研究目的嗎？
                    </p>

                    {/* 三種判斷 */}
                    <div className="w10-judge-tips">
                        <div className="w10-judge-tip">
                            <span className="w10-judge-tip-icon">✅</span>
                            <div>
                                <strong>採納</strong>
                                <span>AI 說得對，改了會讓工具更好</span>
                            </div>
                        </div>
                        <div className="w10-judge-tip">
                            <span className="w10-judge-tip-icon">❌</span>
                            <div>
                                <strong>不採納</strong>
                                <span>AI 的建議不適用（太學術、不符文化、偏離研究目的）</span>
                            </div>
                        </div>
                        <div className="w10-judge-tip">
                            <span className="w10-judge-tip-icon">🔶</span>
                            <div>
                                <strong>部分採納</strong>
                                <span>方向對但需要調整，改成適合你的版本</span>
                            </div>
                        </div>
                    </div>

                    {/* 判斷表 */}
                    <ThinkRecord
                        dataKey="w10-ai-judge"
                        prompt="AI 建議判斷表：逐條記錄 AI 的建議，並寫下你的判斷"
                        placeholder={`建議 1：（AI 說了什麼？）\n→ 判斷：✅採納 / ❌不採納 / 🔶部分採納\n→ 理由：\n\n建議 2：\n→ 判斷：\n→ 理由：\n\n建議 3：\n→ 判斷：\n→ 理由：\n\n（繼續新增……）`}
                        scaffold={[
                            '建議___：AI 說___',
                            '→ 判斷：✅採納 / ❌不採納 / 🔶部分採納',
                            '→ 理由：___',
                        ]}
                        rows={14}
                    />

                    {/* 判斷原則 */}
                    <ThinkRecord
                        dataKey="w10-judge-principle"
                        prompt="你的判斷原則：什麼時候聽 AI 的？什麼時候不聽？"
                        placeholder={'我們採納 AI 建議是因為……\n我們不採納 AI 建議是因為……'}
                        scaffold={['我們聽 AI 的，通常是因為___', '我們不聽 AI 的，通常是因為___']}
                        rows={4}
                    />

                    {/* 修正紀錄 */}
                    <ThinkRecord
                        dataKey="w10-tool-revision"
                        prompt="第一輪修正紀錄：根據 AI 建議，你實際改了什麼？"
                        placeholder={'1. 第___題：原本___，改成___\n2. 新增___\n3. 刪除___'}
                        scaffold={['第__題原本___', '改成___', '因為___']}
                        rows={6}
                    />

                    {/* 選做提示 */}
                    <div className="bg-[var(--paper-warm)] border border-[var(--border)] rounded-[var(--radius-unified)] p-4 text-[13px]">
                        <strong className="text-[var(--ink)]">⚡ 選做：</strong>
                        <span className="text-[var(--ink-mid)] ml-1">修改完成後，可以把修正版再貼給 AI 看一次，確認問題是否解決。時間夠就做，不夠就直接進入下節課的人工預試。</span>
                    </div>
                </div>
            ),
        },

        /* ─── Step 3：人工預試 ─── */
        {
            title: '人工預試',
            icon: '🧪',
            content: (
                <div className="space-y-8">
                    <p className="text-[14px] text-[var(--ink-mid)] leading-relaxed max-w-[720px]">
                        AI 看的是文字，<strong className="text-[var(--ink)]">人工預試看的是真實體驗</strong>。讓真人試用你的工具，你會發現很多 AI 抓不到的問題。
                    </p>

                    {/* AI 的限制 */}
                    <div className="w10-limits-grid">
                        {AI_LIMITS.map((item, i) => (
                            <div key={i} className="w10-limit-card">
                                <span className="text-[20px]">{item.icon}</span>
                                <strong className="text-[13px] text-[var(--ink)]">{item.title}</strong>
                                <span className="text-[12px] text-[var(--ink-mid)] leading-relaxed">{item.desc}</span>
                            </div>
                        ))}
                    </div>

                    {/* 配對指示 */}
                    <div className="bg-white border border-[var(--border)] rounded-[var(--radius-unified)] overflow-hidden">
                        <div className="px-5 py-3 bg-[var(--accent)] text-white flex items-center gap-2">
                            <Users size={16} />
                            <span className="font-bold text-[13px]">預試配對方式</span>
                        </div>
                        <div className="p-5 text-[13px] text-[var(--ink-mid)] leading-relaxed">
                            {currentPairing}
                        </div>
                    </div>

                    {/* 預試對象 */}
                    <ThinkRecord
                        dataKey="w10-pilot-partner"
                        prompt="你和誰配對預試？"
                        placeholder="配對對象：___組／___同學"
                        rows={1}
                    />

                    {/* 預試發現 */}
                    <ThinkRecord
                        dataKey="w10-pilot-findings"
                        prompt="預試中發現了什麼問題？（記錄每一個卡住的地方）"
                        placeholder={`問題 1：第___題，對方說___\n問題 2：___\n問題 3：___\n整體花了___分鐘完成`}
                        scaffold={[
                            '第__題讓對方卡住，因為___',
                            '對方反映___',
                            '整體花了___分鐘',
                        ]}
                        rows={8}
                    />
                </div>
            ),
        },

        /* ─── Step 4：AI vs 人工比對 + 即時修正 ─── */
        {
            title: 'AI vs 人工比對',
            icon: '🔍',
            content: (
                <div className="space-y-8">
                    <p className="text-[14px] text-[var(--ink-mid)] leading-relaxed max-w-[720px]">
                        現在把 AI 的發現和人工預試的發現放在一起比較。<strong className="text-[var(--ink)]">誰找到了什麼？誰漏掉了什麼？</strong>
                    </p>

                    {/* 比對雙欄 */}
                    <div className="w10-compare-grid">
                        <div className="w10-compare-card w10-compare-ai">
                            <div className="w10-compare-header">
                                <Bot size={16} />
                                <span>AI 發現的問題</span>
                            </div>
                            <div className="w10-compare-body">
                                <ThinkRecord
                                    dataKey="w10-ai-found"
                                    prompt=""
                                    placeholder={'AI 指出了：\n1. ___\n2. ___\n3. ___'}
                                    rows={5}
                                />
                            </div>
                        </div>
                        <div className="w10-compare-card w10-compare-human">
                            <div className="w10-compare-header">
                                <Users size={16} />
                                <span>人工預試才發現的問題</span>
                            </div>
                            <div className="w10-compare-body">
                                <ThinkRecord
                                    dataKey="w10-human-found"
                                    prompt=""
                                    placeholder={'真人測試時才發現：\n1. ___\n2. ___\n3. ___'}
                                    rows={5}
                                />
                            </div>
                        </div>
                    </div>

                    {/* AI 建議效果 */}
                    <ThinkRecord
                        dataKey="w10-ai-effective"
                        prompt="AI 建議的修改，預試後效果如何？"
                        placeholder={'AI 建議修改的第___題：\n□ 有效，問題解決了\n□ 部分有效，還需要再改\n□ 無效，問題還在'}
                        scaffold={[
                            'AI 建議改的第__題，預試結果：___',
                            '有效／部分有效／無效',
                        ]}
                        rows={4}
                    />

                    {/* 最終修正 */}
                    <ThinkRecord
                        dataKey="w10-final-revision"
                        prompt="即時修正：根據人工預試結果，你最後改了什麼？"
                        placeholder={'1. 第___題改成___（因為預試時___）\n2. 刪掉___（因為___）\n3. 新增___（因為___）'}
                        scaffold={['第__題改成___', '因為預試時___']}
                        rows={6}
                    />
                </div>
            ),
        },

        /* ─── Step 5：回顧與繳交 ─── */
        {
            title: '回顧與繳交',
            icon: '📋',
            content: (
                <div className="space-y-8">
                    {/* AI 反思 */}
                    <ThinkRecord
                        dataKey="w10-ai-reflection"
                        prompt="使用 AI 協助研究工具設計，你學到了什麼？"
                        placeholder={'AI 給了哪些有用的建議？\nAI 給了哪些不適用的建議？\n你覺得 AI 協助研究最大的優勢和限制是什麼？'}
                        scaffold={[
                            'AI 最有用的建議是___',
                            'AI 最不適用的建議是___，因為___',
                            'AI 的優勢是___，限制是___',
                            '下次使用 AI 我會___',
                        ]}
                        rows={6}
                    />

                    {/* 今日重點 */}
                    <div className="bg-white border border-[var(--border)] rounded-[var(--radius-unified)] overflow-hidden">
                        <div className="px-5 py-3 bg-[var(--ink)] text-white font-bold text-[13px]">
                            💡 今日重點
                        </div>
                        <div className="p-5 space-y-3">
                            <div className="w10-summary-row">
                                <span className="w10-summary-icon">🤖</span>
                                <div>
                                    <strong className="text-[13px] text-[var(--ink)]">AI 的優勢</strong>
                                    <p className="text-[12px] text-[var(--ink-mid)]">快速找出明顯問題、提供專業建議、不會累</p>
                                </div>
                            </div>
                            <div className="w10-summary-row">
                                <span className="w10-summary-icon">🧑‍🤝‍🧑</span>
                                <div>
                                    <strong className="text-[13px] text-[var(--ink)]">人工預試的價值</strong>
                                    <p className="text-[12px] text-[var(--ink-mid)]">發現 AI 沒發現的問題、測試實際可行性、真實的受訪者體驗</p>
                                </div>
                            </div>
                            <div className="w10-summary-row">
                                <span className="w10-summary-icon">⭐</span>
                                <div>
                                    <strong className="text-[13px] text-[var(--ink)]">最佳組合</strong>
                                    <p className="text-[12px] text-[var(--accent)] font-bold">AI 第一輪檢核 → 人工預試 → 再修正</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 檢核清單 */}
                    <div className="bg-white border border-[var(--border)] rounded-[var(--radius-unified)] overflow-hidden">
                        <div className="p-4 px-5 bg-[var(--paper-warm)] border-b border-[var(--border)] font-bold text-[13px]">
                            ✅ W10 完成後，請確認
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-[1px] bg-[var(--border)]">
                            {[
                                '用 AI 檢核了你的研究工具',
                                '逐條判斷了 AI 建議（不盲從）',
                                '完成人工預試（真人測試）',
                                '比較了 AI 發現 vs 人工發現',
                                '根據雙重回饋修正了工具',
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
                        weekLabel="W10 AI 協助工具精進與預試"
                        fields={EXPORT_FIELDS}
                    />

                    {/* R.I.B. 遊戲連結 */}
                    <div className="bg-[var(--ink)] border-l-4 border-[#7C3AED] p-6 rounded-r-lg text-white shadow-xl">
                        <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                            <Bot className="text-[#7C3AED]" size={20} />
                            R.I.B. 連貫劇情：幽靈數據 Ch3 — 問卷迷霧
                        </h3>
                        <p className="text-[var(--ink-light)] text-sm mb-4">
                            Agent Amber 在社區發放的問卷出現了嚴重的設計缺陷。用你今天學到的 AI 審查技巧，幫她找出真相。
                        </p>
                        <Link to="/phantom/ch3" className="inline-flex items-center gap-2 bg-[#7C3AED] text-white px-4 py-2 rounded font-bold text-sm hover:opacity-90 transition-colors">
                            進入任務 <ArrowRight size={14} />
                        </Link>
                    </div>

                    {/* 下週預告 */}
                    <div className="next-week-preview">
                        <div className="next-week-header">
                            <span className="next-week-badge">NEXT WEEK</span>
                            <h3 className="next-week-title">W11 預告：倫理審查 + 正式施測準備</h3>
                        </div>
                        <div className="next-week-content">
                            <div className="next-week-col">
                                <div className="next-week-label">帶什麼來</div>
                                <p className="next-week-text">修正完畢的工具定稿（問卷／訪談大綱／實驗流程／觀察表）</p>
                            </div>
                            <div className="next-week-col">
                                <div className="next-week-label">做什麼</div>
                                <p className="next-week-text">倫理四問自查、知情同意書 AI 審查、蓋章出發——通過審查才能正式施測！</p>
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
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-4 mb-16">
                <div className="text-[11px] font-mono text-[var(--ink-light)] flex items-center gap-2">
                    研究方法與專題 / 資料蒐集 / <span className="text-[var(--ink)] font-bold">AI 工具精進 W10</span>
                </div>
                <div className="flex items-center gap-4">
                    <span className="bg-[var(--paper-warm)] text-[var(--ink)] text-[10px] font-bold px-2 py-0.5 rounded-[2px] font-mono">100 MINS</span>
                    <span className="bg-[var(--ink)] text-white text-[10px] font-bold px-2 py-0.5 rounded-[2px] font-mono">AI-RED · E</span>
                </div>
            </div>

            {/* PAGE HEADER */}
            <header className="max-w-[800px] mb-16">
                <div className="text-[11px] font-mono text-[var(--accent)] mb-3 tracking-[0.06em]">🤖 W10 · 資料蒐集 → 工具精進</div>
                <h1 className="font-serif text-[36px] font-bold leading-[1.2] text-[var(--ink)] mb-4 tracking-[-0.02em]">
                    方法深化 II：<span className="text-[var(--accent)] italic">AI 協助工具精進與預試</span>
                </h1>
                <p className="text-[15px] text-[var(--ink-mid)] max-w-[600px] leading-[1.75] mb-8">
                    用 AI 做第一輪品管，再用真人預試做第二輪驗證。AI 能快速找出明顯問題，但看不到真實體驗——兩輪把關，工具才定稿。
                </p>

                <CourseArc items={[
                    { wk: 'W1-W4', name: '探索\n定題', status: 'past' },
                    { wk: 'W5-W6', name: '文獻搜尋\n引用寫作', status: 'past' },
                    { wk: 'W7-W8', name: '方法選擇\n組隊企劃', status: 'past' },
                    { wk: 'W9', name: '工具設計\n處方診斷', status: 'past' },
                    { wk: 'W10', name: 'AI精進\n人工預試', status: 'now' },
                    { wk: 'W11', name: '倫理審查\n施測準備', status: '' },
                    { wk: 'W12-W15', name: '執行研究\n數據分析', status: '' },
                ]} />

                <div className="meta-grid">
                    {[
                        { label: '第一節', value: 'AI 檢核工具 + 判斷建議 + 第一輪修正' },
                        { label: '第二節', value: '人工預試 + AI vs 人工比對 + 最終修正' },
                        { label: '課堂產出', value: 'AI 建議判斷表 + 預試紀錄 + 工具修正版' },
                        { label: '前置要求', value: 'W9 工具初稿（三欄對應表成果）' },
                    ].map((item, idx) => (
                        <div key={idx} className="meta-item">
                            <div className="meta-label">{item.label}</div>
                            <div className="meta-value">{item.value}</div>
                        </div>
                    ))}
                </div>
            </header>

            {/* STEP ENGINE */}
            <StepEngine
                steps={steps}
                prevWeek={{ label: '回 W9 工具設計', to: '/w9' }}
                nextWeek={{ label: '前往 W11 倫理審查', to: '/w11' }}
            />
        </div>
    );
};
