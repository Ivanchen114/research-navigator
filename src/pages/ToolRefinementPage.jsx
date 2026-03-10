import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './ToolRefinementPage.css';
import {
    Bot, Map, ChevronRight, CheckCircle2, AlertCircle,
    ArrowRight, Sparkles, MessageSquare, ClipboardCheck,
    Users, Search, ShieldCheck, Heart, Wrench, Zap
} from 'lucide-react';
import LessonMap from '../components/ui/LessonMap';
import CopyButton from '../components/ui/CopyButton';
import { W9Data } from '../data/lessonMaps';

export const ToolRefinementPage = () => {
    const [showLessonMap, setShowLessonMap] = useState(false);
    const [activePromptTab, setActivePromptTab] = useState('survey');
    const [expandedPractice, setExpandedPractice] = useState(null);
    const [unlockedAnswers, setUnlockedAnswers] = useState({});

    const togglePractice = (id) => {
        setExpandedPractice(expandedPractice === id ? null : id);
    };


    const unlockAnswer = (id, e) => {
        e.stopPropagation();
        setUnlockedAnswers(prev => ({ ...prev, [id]: true }));
    };

    return (
        <div className="page-container animate-in-fade-slide">
            {/* REMOVED: <style dangerouslySetInnerHTML /> - styles moved to index.css */}

            {/* TOP BAR */}
            <div className="flex items-center justify-between border-b border-[#dddbd5] pb-4 mb-16">
                <div className="text-[11px] font-mono text-[#8888aa] flex items-center gap-2">
                    研究方法與專題 / 資料蒐集 / <span className="text-[#1a1a2e] font-bold">工具精進 W9</span>
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
                <div className="animate-in slide-in-from-top-4 duration-300 mb-12">
                    <LessonMap data={W9Data} />
                </div>
            )}

            {/* PAGE HEADER */}
            <div className="max-w-[800px] mb-16">
                <div className="text-[#2d5be3] font-mono text-[11px] font-bold tracking-widest uppercase mb-4">🤖 W9 · 資料蒐集</div>
                <h1 className="font-serif text-[42px] font-bold leading-[1.2] text-[#1a1a2e] mb-6 tracking-[-0.01em]">
                    AI 協助工具精進：<span className="text-[#2d5be3]">審稿、判斷、預試</span>
                </h1>
                <p className="text-[16px] text-[#4a4a6a] leading-relaxed mb-8">
                    今天你要讓 AI 幫你審一輪初稿，但不是照單全收——你要評估 AI 的建議，決定哪些值得採納、哪些不適合你的研究。然後再用真實的人來預試，看看 AI 抓不到的問題是什麼。
                </p>

                {/* Course Arc - Standard Version A */}
                <div className="mb-14">
                    <div className="text-[11px] text-[#8888aa] mb-4">課程弧線 · 你在哪裡</div>
                    <div className="arc-grid">
                        {[
                            { wk: 'W1-W2', name: '探索階段\nRED公約', past: true },
                            { wk: 'W3-W4', name: '題目診斷\n博覽會', past: true },
                            { wk: 'W5', name: '企劃撰寫\n研究藍圖', past: true },
                            { wk: 'W6', name: '診所分流\n方法處方', past: true },
                            { wk: 'W7', name: '組隊決策\n企劃定案', past: true },
                            { wk: 'W8-W10', name: '工具設計\n倫理審查', now: true },
                            { wk: 'W13-W16', name: '數據轉譯\n解讀發表' }
                        ].map((item, idx) => (
                            <div key={idx} className={`arc-item ${item.past ? 'past' : item.now ? 'now' : ''}`}>
                                <div className="arc-wk">
                                    {item.wk} {item.now && '← 現在'}
                                </div>
                                <div className="arc-name">
                                    {item.name.split('\n').map((line, i) => <div key={i}>{line}</div>)}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="meta-strip">
                <div className="meta-item">
                    <div className="meta-label">第一節</div>
                    <div className="meta-value">AI 審稿 + 建議判斷</div>
                </div>
                <div className="meta-item">
                    <div className="meta-label">第二節</div>
                    <div className="meta-value">人工預試 + AI vs 預試比較</div>
                </div>
                <div className="meta-item">
                    <div className="meta-label">課堂產出</div>
                    <div className="meta-value">AI 建議判斷表 + 預試修改紀錄</div>
                </div>
                <div className="meta-item">
                    <div className="meta-label">帶去 W10</div>
                    <div className="meta-value">定稿工具（準備倫理審查）</div>
                </div>
            </div>

            {/* 學什麼 SECTION */}
            <section className="mb-24">
                <div className="w9-section-head">
                    <h2 className="w9-section-title">學什麼</h2>
                    <div className="w9-section-line"></div>
                    <span className="w9-section-tag">CONCEPT</span>
                </div>

                <div className="text-[10px] font-mono text-[#8888aa] tracking-[0.1em] uppercase mb-4 flex items-center gap-2">
                    <Zap size={10} /> AI-RED 框架 · 今天的任務
                </div>

                <div className="w9-flow-strip mb-4">
                    {[
                        { l: 'A', name: 'Ascribe', d: '說明研究情境交給 AI' },
                        { l: 'I', name: 'Inquire', d: '點出初稿設計問題', active: true },
                        { l: 'R', name: 'Reference', d: '視為審稿意見而非答案', active: true },
                        { l: 'E', name: 'Evaluate', d: '評估採納與否理由', active: true },
                        { l: 'D', name: 'Document', d: '紀錄判斷與修改歷程' }
                    ].map((step, idx) => (
                        <div key={idx} className={`w9-flow-item ${step.active ? 'active' : ''}`}>
                            <div className="w9-flow-letter">{step.l}</div>
                            <div className="w9-flow-name">{step.name}</div>
                            <div className="w9-flow-desc">{step.d}</div>
                        </div>
                    ))}
                </div>

                <div className="w9-notice w9-notice-gold">
                    💡 今天的重點在 <strong>Evaluate（評估）</strong>：AI 給的建議不一定對你的研究情境都適合，你才是最了解自己研究的人。每一條建議都要說理由，不能只寫「因為 AI 說」。
                </div>

                <div className="text-[10px] font-mono text-[#8888aa] tracking-[0.1em] uppercase mb-4 flex items-center gap-2 mt-12">
                    <ShieldCheck size={12} /> AI 審稿 vs 人工預試 · 各有強項
                </div>

                <div className="w9-compare-grid">
                    <div className="w9-compare-col">
                        <div className="w9-compare-hd">
                            <span className="w9-compare-tag" style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>🤖 AI 審稿</span>
                            <span className="w9-compare-title">擅長抓結構性問題</span>
                        </div>
                        <div className="w9-compare-body font-sans space-y-2">
                            <p>• 邏輯錯誤（誘導性、雙重問題）</p>
                            <p>• 選項設計缺陷（重疊、未窮盡）</p>
                            <p>• 題目順序是否合理</p>
                            <p>• 開場白是否有倫理要件</p>
                            <p className="text-red-600 font-bold mt-4">⚠️ AI 不知道：研究對象真實樣貌、校園情境</p>
                        </div>
                    </div>
                    <div className="w9-compare-col border-l border-[#dddbd5]">
                        <div className="w9-compare-hd">
                            <span className="w9-compare-tag" style={{ background: 'var(--success-light)', color: 'var(--success)' }}>🙋 人工預試</span>
                            <span className="w9-compare-title">抓到真實理解問題</span>
                        </div>
                        <div className="w9-compare-body font-sans space-y-2">
                            <p>• 「這題我看不懂在問什麼」</p>
                            <p>• 「這個選項沒有我的情況」</p>
                            <p>• 「填完太久了，我想放棄」</p>
                            <p>• 實際回答走向與預期不同</p>
                            <p className="text-[#2e7d5a] font-bold mt-4">✅ 人工發現的問題，通常是最優先修的</p>
                        </div>
                    </div>
                </div>

                <div className="w9-notice w9-notice-accent">
                    🔑 正確順序：<strong>AI 審稿（先）→ 根據判斷修改 → 人工預試（後）→ 再次修改</strong>。兩關都過，才算定稿。
                </div>

                <div className="text-[10px] font-mono text-[#8888aa] tracking-[0.1em] uppercase mb-4 mt-12">評估 AI 建議的三種結果</div>
                <div className="w9-verdict-row">
                    <div className="w9-verdict-item">
                        <div className="w9-verdict-tag text-[#2e7d5a]">✅ 採納</div>
                        <div className="w9-verdict-desc">建議有道理且符合情境。<br /><span className="text-[#8888aa]">例：「選項真的有重疊，修！」</span></div>
                    </div>
                    <div className="w9-verdict-item border-l border-[#dddbd5]">
                        <div className="w9-verdict-tag text-[#c0392b]">✗ 不採納</div>
                        <div className="w9-verdict-desc">不適合研究或基於情境不改。<br /><span className="text-[#8888aa]">例：「這題針對高中生，不必加成人。」</span></div>
                    </div>
                    <div className="w9-verdict-item border-l border-[#dddbd5]">
                        <div className="w9-verdict-tag text-[#c9a84c]">◑ 部分採納</div>
                        <div className="w9-verdict-desc">方向對但做法需自行調整。<br /><span className="text-[#8888aa]">例：「不拆兩題，但改為中性問法。」</span></div>
                    </div>
                </div>
            </section>

            {/* 練什麼 SECTION */}
            <section className="mb-24">
                <div className="w9-section-head">
                    <h2 className="w9-section-title">練什麼</h2>
                    <div className="w9-section-line"></div>
                    <span className="w9-section-tag">PRACTICE</span>
                </div>

                <div className="text-[10px] font-mono text-[#8888aa] tracking-[0.1em] uppercase mb-6">Step 1 · 選你的方法組，複製 Prompt 到 AI</div>

                <div className="flex gap-1 border-b border-[#dddbd5] mb-0">
                    {['survey', 'interview', 'other'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActivePromptTab(tab)}
                            className={`px-6 py-3 text-[12px] font-bold rounded-t-lg transition-all ${activePromptTab === tab ? 'bg-[#1a1a2e] text-white' : 'bg-[#f0ede6] text-[#4a4a6a]'
                                }`}
                        >
                            {tab === 'survey' ? '問卷組' : tab === 'interview' ? '訪談組' : '實驗/觀察/文獻'}
                        </button>
                    ))}
                </div>

                <div className="w9-prompt-box rounded-tr-none">
                    <div className="w9-prompt-hd">
                        <span className="bg-[#c9a84c] text-[#1a1a2e] text-[10px] px-2 py-0.5 rounded font-mono font-bold">PROMPT</span>
                        <span className="text-white text-[13px] font-bold">
                            {activePromptTab === 'survey' ? '問卷組專用審稿請求' : activePromptTab === 'interview' ? '訪談組專用審稿請求' : '多元方法審稿請求'}
                        </span>
                    </div>
                    <div className="w9-prompt-body" id={`prompt-text-${activePromptTab}`}>
                        {activePromptTab === 'survey' ? (
                            `我是高中生，正在進行研究專題，題目是「[你的研究題目]」。
研究對象是「[例：松山高中高一學生]」。

以下是我設計的問卷初稿：
[貼上你的問卷所有題目]

請你擔任「研究工具審稿者」，幫我檢查：
1. 有沒有問題不清楚、語意模糊的題目？
2. 選項是否完整（有沒有重疊或遺漏）？
3. 有沒有誘導性提問或雙重問題（一題問兩件事）？
4. 題目順序是否合理？
5. 研究說明和知情同意部分是否足夠？`
                        ) : activePromptTab === 'interview' ? (
                            `我是高中生，正在進行研究專題，題目是「[你的研究題目]」。
研究對象是「[例：松山高中高一學生]」。

以下是我設計的訪談大綱初稿：
[貼上你的訪談問題和追問設計]

請你擔任「研究工具審稿者」，幫我檢查：
1. 問題是否開放式？有沒有封閉式問題需要改成開放式？
2. 追問設計是否合理、夠深入？
3. 問題順序是否流暢、符合訪談節奏？
4. 問題數量是否合理（以 30-45 分鐘訪談為基準）？
5. 倫理考量是否足夠（開場說明、受訪者權益）？`
                        ) : (
                            `我是高中生，正在進行研究專題，題目是「[你的研究題目]」。
研究方法是「[實驗設計 / 系統性觀察 / 文獻分析]」。

以下是我的工具初稿：
[貼上實驗流程 / 觀察紀錄表 / 文獻分析架構]

請你擔任「研究工具審稿者」，幫我檢查：
1. 這份工具能不能回答我的研究問題？
2. 操作步驟或分類標準是否清楚、可重複？
3. 有沒有沒控制到的變因（實驗組）/ 過於主觀的分類（觀察組）/ 遺漏的分析角度（文獻組）？
4. 以高中生的資源和時間，這個設計實際上可行嗎？`
                        )}
                    </div>
                    <CopyButton
                        text={
                            activePromptTab === 'survey' ? (
                                `我是高中生，正在進行研究專題，題目是「[你的研究題目]」。
研究對象是「[例：松山高中高一學生]」。

以下是我設計的問卷初稿：
[貼上你的問卷所有題目]

請你擔任「研究工具審稿者」，幫我檢查：
1. 有沒有問題不清楚、語意模糊的題目？
2. 選項是否完整（有沒有重疊或遺漏）？
3. 有沒有誘導性提問或雙重問題（一題問兩件事）？
4. 題目順序是否合理？
5. 研究說明和知情同意部分是否足夠？`
                            ) : activePromptTab === 'interview' ? (
                                `我是高中生，正在進行研究專題，題目是「[你的研究題目]」。
研究對象是「[例：松山高中高一學生]」。

以下是我設計的訪談大綱初稿：
[貼上你的訪談問題和追問設計]

請你擔任「研究工具審稿者」，幫我檢查：
1. 問題是否開放式？有沒有封閉式問題需要改成開放式？
2. 追問設計是否合理、夠深入？
3. 問題順序是否流暢、符合訪談節奏？
4. 問題數量是否合理（以 30-45 分鐘訪談為基準）？
5. 倫理考量是否足夠（開場說明、受訪者權益）？`
                            ) : (
                                `我是高中生，正在進行研究專題，題目是「[你的研究題目]」。
研究方法是「[實驗設計 / 系統性觀察 / 文獻分析]」。

以下是我的工具初稿：
[貼上實驗流程 / 觀察紀錄表 / 文獻分析架構]

請你擔任「研究工具審稿者」，幫我檢查：
1. 這份工具能不能回答我的研究問題？
2. 操作步驟或分類標準是否清楚、可重複？
3. 有沒有沒控制到的變因（實驗組）/ 過於主觀的分類（觀察組）/ 遺漏的分析角度（文獻組）？
4. 以高中生的資源 and 時間，這個設計實際上可行嗎？`
                            )
                        }
                        className="w9-prompt-btn flex items-center gap-2"
                        label="📋 複製這段 Prompt"
                        successLabel="✓ 已複製！"
                    />
                </div>

                <div className="text-[10px] font-mono text-[#8888aa] tracking-[0.1em] uppercase mb-4 mt-12">Step 2 · 練習判斷：這條 AI 建議，你採納嗎？</div>
                <div className="space-y-4">
                    {[
                        {
                            id: 'p1',
                            badge: '建議 A',
                            title: '「這題是誘導性提問，『覺得重要』暗示了正面回答，建議改為『你認為手機使用對你的睡眠有什麼影響？』」',
                            ans: '✅ 建議採納。AI 說對了——「覺得重要」確實帶有預設立場。但要確認這樣改之後，這題還能回答你原本想問的問題。'
                        },
                        {
                            id: 'p2',
                            badge: '建議 B',
                            title: '「建議加入『大學生』和『成人』作為研究對象以增加研究的普遍性」',
                            ans: '✗ 不採納。AI 不了解你的資源限制。身為高中生，把範圍擴大到校外會讓研究失控，在你的情境裡根本做不到。'
                        },
                        {
                            id: 'p3',
                            badge: '建議 C',
                            title: '「第 7 題一次問了兩件事，建議拆成兩題」',
                            ans: '◑ 部分採納。指出問題正確，但怎麼拆、拆完是否都還在你的研究範圍內，解法由你自己決定。'
                        }
                    ].map((item) => (
                        <div key={item.id} className={`w9-practice-block ${expandedPractice === item.id ? 'open' : ''}`}>
                            <div className="w9-practice-hd" onClick={() => togglePractice(item.id)}>
                                <span className="bg-[#1a1a2e] text-white text-[10px] px-2 py-0.5 rounded font-mono font-bold shrink-0">{item.badge}</span>
                                <span className="text-[14px] font-bold text-[#1a1a2e] flex-1">「{item.title}」</span>
                                <ChevronRight size={16} className={`transition-transform duration-300 ${expandedPractice === item.id ? 'rotate-90' : ''}`} />
                            </div>
                            <div className="w9-practice-body">
                                {!unlockedAnswers[item.id] ? (
                                    <div
                                        onClick={(e) => unlockAnswer(item.id, e)}
                                        className="bg-[#f0ede6] border-2 border-dashed border-[#dddbd5] p-6 text-center cursor-pointer text-[#8888aa] text-[13px] rounded-lg hover:bg-white transition-colors"
                                    >
                                        👆 想好了再點這裡看分析
                                    </div>
                                ) : (
                                    <div className="bg-[#e8eeff] border-l-4 border-[#2d5be3] px-5 py-4 text-[#1a1a2e] text-[13px] leading-relaxed rounded-r-lg animate-in">
                                        {item.ans}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* 課堂任務 SECTION */}
            <section className="mb-24">
                <div className="w9-section-head">
                    <h2 className="w9-section-title">課堂任務</h2>
                    <div className="w9-section-line"></div>
                    <span className="w9-section-tag">IN-CLASS</span>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    <div className="w9-task-block">
                        <div className="w9-task-hd">
                            <span className="w9-task-badge">TASK 1</span>
                            <span className="w9-task-title">AI 審稿（第一節，25 分鐘）</span>
                        </div>
                        <div className="p-6 text-[13px] text-[#4a4a6a] leading-relaxed">
                            <ol className="list-decimal pl-5 space-y-2">
                                <li>使用上方 Prompt 將工具初稿交給 AI 審查。</li>
                                <li>至少整理 3 條 AI 建議紀錄到「AI 建議判斷表」。</li>
                            </ol>
                        </div>
                    </div>
                    <div className="w9-task-block">
                        <div className="w9-task-hd">
                            <span className="w9-task-badge">TASK 2</span>
                            <span className="w9-task-title">建議評估與判斷（第一節，15 分鐘）</span>
                        </div>
                        <div className="p-6 text-[13px] text-[#4a4a6a] leading-relaxed">
                            <ol className="list-decimal pl-5 space-y-2">
                                <li>小組討論各建議的採納結果，並寫下理由（至少 20 字）。</li>
                                <li>根據採納結果直接修改工具初稿。</li>
                            </ol>
                        </div>
                    </div>
                    <div className="w9-task-block">
                        <div className="w9-task-hd">
                            <span className="w9-task-badge">TASK 3</span>
                            <span className="w9-task-title">人工預試（第二節，20 分鐘）</span>
                        </div>
                        <div className="p-6 text-[13px] text-[#4a4a6a] leading-relaxed">
                            <ol className="list-decimal pl-5 space-y-2">
                                <li>問卷組找 3-5 人預填，觀察卡住與停頓點。</li>
                                <li>訪談組進行試訪，紀錄受訪者反應。</li>
                                <li>實驗/觀察組由老師指導進行可行性驗證。</li>
                            </ol>
                        </div>
                    </div>
                </div>
            </section>

            {/* Wrapup / Homework */}
            <section className="mb-24">
                <div className="w9-section-head">
                    <h2 className="w9-section-title">本週總結</h2>
                    <div className="w9-section-line"></div>
                    <span className="w9-section-tag">WRAP-UP</span>
                </div>

                <div className="bg-white border border-[#dddbd5] rounded-xl overflow-hidden mb-6">
                    <div className="bg-[#f0ede6] px-5 py-3 border-b border-[#dddbd5] font-bold text-[14px]">✅ 今天結束，你應該有</div>
                    <div className="grid grid-cols-2 bg-[#dddbd5] gap-[1px]">
                        {[
                            '完整的 AI 建議判斷表（至少 3 條紀錄）',
                            '完成人工預試且紀錄發現點',
                            'AI vs 人工盲點分析反思',
                            '完成工具定稿（W10 倫理審查用）'
                        ].map((txt, i) => (
                            <div key={i} className="bg-white p-4 flex items-center gap-2 text-[13px]">
                                <CheckCircle2 size={16} className="text-[#2e7d5a]" /> {txt}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="w9-next-week">
                    <div className="flex items-center gap-3 px-6 py-4 border-b border-white/10">
                        <Map size={18} />
                        <span className="font-bold text-[15px]">W10 倫理審查：研究正式啟動</span>
                    </div>
                    <div className="w9-next-grid">
                        <div className="w9-next-item">
                            <div className="text-[10px] text-white/40 uppercase mb-2 font-mono">NEXT WEEK BRING</div>
                            <p className="text-[13px] text-white/80 leading-relaxed">工具定稿紙本 + 知情同意書草稿。W10 會進行全班倫理互審，通過後才能開工。</p>
                        </div>
                        <div className="w9-next-item">
                            <div className="text-[10px] text-red-400 uppercase mb-2 font-mono">CRITICAL TASK</div>
                            <p className="text-[13px] text-white/80 leading-relaxed">W10 前必須完成定稿。未過審者無法開始蒐集資料，將影響後續所有進度。</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pagination */}
            <div className="flex justify-between items-center py-12 border-t border-[#dddbd5] mt-12">
                <Link to="/tool-design" className="flex items-center gap-2 text-[#8888aa] hover:text-[#1a1a2e] transition-colors text-[13px] font-bold no-underline">
                    <ChevronRight size={16} className="rotate-180" /> ← 回 W8 工具設計
                </Link>
                <Link to="/w10" className="flex items-center gap-2 bg-[#1a1a2e] text-white px-6 py-3 rounded-lg hover:bg-[#2a2a4a] transition-colors text-[13px] font-bold no-underline">
                    前往 W10 倫理審查 →
                </Link>
            </div>
        </div>
    );
};
