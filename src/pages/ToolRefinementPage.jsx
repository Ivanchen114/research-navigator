import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './ToolRefinementPage.css';
import CourseArc from '../components/ui/CourseArc';
import { Map, ChevronRight, CheckCircle2, ArrowRight, Scale, Shield, Heart, BarChart3, Users } from 'lucide-react';
import LessonMap from '../components/ui/LessonMap';
import { W9Data } from '../data/lessonMaps';

/* ─── 五大倫理原則 ─── */
const ethicsPrinciples = [
    {
        icon: '🤝', name: '知情同意', en: 'Informed Consent',
        desc: '受訪者有權知道研究目的、內容、資料用途，並在了解後自願參與。',
        question: '你有沒有告訴受訪者你在做什麼？他們有沒有機會拒絕？',
        example: '問卷前應有說明文字：「本問卷用於研究 __，資料匿名，填寫自願，可隨時停止。」'
    },
    {
        icon: '🔒', name: '隱私保護', en: 'Privacy & Confidentiality',
        desc: '個人資料應保密，不能公開能識別特定個人的資訊（姓名、學號、班級等）。',
        question: '你的問卷或訪談紀錄會不會讓人猜出是誰說的？',
        example: '訪談逐字稿應匿名化：「受訪者 A 說：……」而非使用真名。'
    },
    {
        icon: '💚', name: '不造成傷害', en: 'Do No Harm',
        desc: '研究過程不應讓參與者感到不適、受到傷害、或受到歧視，包括心理上的不舒服。',
        question: '你的題目有沒有可能讓受訪者感到被冒犯、被評判，或觸碰到敏感議題？',
        example: '避免問「你覺得你的成績差是因為不努力嗎」——帶有評判意味。'
    },
    {
        icon: '📊', name: '誠實呈現資料', en: 'Integrity',
        desc: '不捏造資料，不選擇性刪除不合預期的結果，如實呈現所有收集到的資訊。',
        question: '如果收集到的資料和你預期的不一樣，你會怎麼做？',
        example: '「我們發現假說不成立，這本身就是重要的發現」——這才是科學態度。'
    },
    {
        icon: '⚖️', name: '公平對待', en: 'Justice & Fairness',
        desc: '研究對象的選擇應有合理理由，不應歧視特定群體，也不應讓某些人承擔不公平的風險。',
        question: '你選擇研究對象的理由是什麼？有沒有排除某些人而沒有說明理由？',
        example: '「只問成績好的人」會造成取樣偏誤，也可能讓成績較差的人覺得被排除。'
    }
];

export const ToolRefinementPage = () => {
    const [showLessonMap, setShowLessonMap] = useState(false);
    const [expandedPrinciple, setExpandedPrinciple] = useState(null);

    return (
        <div className="page-container animate-in-fade-slide">

            {/* TOP BAR */}
            <div className="flex items-center justify-between border-b border-[#dddbd5] pb-4 mb-16">
                <div className="text-[11px] font-mono text-[#8888aa] flex items-center gap-2">
                    研究方法與專題 / 資料蒐集 / <span className="text-[#1a1a2e] font-bold">倫理審查 W10</span>
                </div>
                <div className="flex items-center gap-4">
                    <span className="bg-[#f0ede6] text-[#1a1a2e] text-[10px] font-bold px-2 py-0.5 rounded-[2px] font-mono">100 MINS</span>
                    <button
                        onClick={() => setShowLessonMap(!showLessonMap)}
                        className="text-[11px] text-[#8888aa] hover:text-[#2d5be3] transition-colors flex items-center gap-1 font-mono"
                    >
                        <Map size={12} /> {showLessonMap ? 'Hide Plan' : 'Instructor View'}
                    </button>
                    <span className="bg-[#1a1a2e] text-white text-[10px] font-bold px-2 py-0.5 rounded-[2px] font-mono">AI-RED · E</span>
                </div>
            </div>

            {showLessonMap && (
                <div className="animate-in slide-in-from-top-4 duration-300 mb-12">
                    <LessonMap data={W9Data} />
                </div>
            )}

            {/* PAGE HEADER */}
            <div className="max-w-[800px] mb-16">
                <div className="text-[#2d5be3] font-mono text-[11px] font-bold tracking-widest uppercase mb-4">⚖️ W10 · 資料蒐集</div>
                <h1 className="font-serif text-[42px] font-bold leading-[1.2] text-[#1a1a2e] mb-6 tracking-[-0.01em]">
                    研究倫理審查：<span className="text-[#2d5be3]">五大原則 × 自審 × 啟動</span>
                </h1>
                <p className="text-[16px] text-[#4a4a6a] leading-relaxed mb-8">
                    你的研究工具已經準備好了。但在出去找人做問卷、訪談之前，我們需要停下來問一個問題：這樣做，對嗎？通過倫理審查，拿到啟動許可，你的研究才算正式啟程。
                </p>

                {/* Course Arc */}
                {W9Data.courseArc && <CourseArc items={W9Data.courseArc} />}
            </div>

            {/* META STRIP */}
            <div className="meta-strip">
                <div className="meta-item">
                    <div className="meta-label">第一節</div>
                    <div className="meta-value">五大倫理原則 × 自我審查</div>
                </div>
                <div className="meta-item">
                    <div className="meta-label">第二節</div>
                    <div className="meta-value">口頭報告 × 取得許可 × 啟動</div>
                </div>
                <div className="meta-item">
                    <div className="meta-label">前置準備</div>
                    <div className="meta-value">W9 完成的研究工具初版</div>
                </div>
                <div className="meta-item">
                    <div className="meta-label">課堂產出</div>
                    <div className="meta-value">倫理審查表 + 執行計畫 + 啟動許可</div>
                </div>
            </div>

            {/* ═══════ 五大原則 ═══════ */}
            <section className="mb-24">
                <div className="w9-section-head">
                    <h2 className="w9-section-title">學什麼</h2>
                    <div className="w9-section-line"></div>
                    <span className="w9-section-tag">CONCEPT</span>
                </div>

                <div className="text-[11px] font-mono text-[#8888aa] tracking-[0.1em] uppercase mb-6">五大研究倫理原則</div>

                <div className="space-y-4">
                    {ethicsPrinciples.map((p, idx) => (
                        <div key={idx} className="bg-white border border-[#dddbd5] rounded-xl overflow-hidden">
                            <div
                                className="flex items-center gap-4 p-5 cursor-pointer hover:bg-[#f8f7f4] transition-colors"
                                onClick={() => setExpandedPrinciple(expandedPrinciple === idx ? null : idx)}
                            >
                                <span className="text-2xl">{p.icon}</span>
                                <div className="flex-1">
                                    <div className="font-bold text-[15px] text-[#1a1a2e]">原則 {idx + 1}：{p.name}</div>
                                    <div className="text-[12px] text-[#8888aa] font-mono">{p.en}</div>
                                </div>
                                <ChevronRight size={16} className={`text-[#8888aa] transition-transform duration-300 ${expandedPrinciple === idx ? 'rotate-90' : ''}`} />
                            </div>
                            {expandedPrinciple === idx && (
                                <div className="border-t border-[#dddbd5] p-5 bg-[#f8f7f4] space-y-3 text-[13px] animate-in">
                                    <p className="text-[#4a4a6a]">{p.desc}</p>
                                    <div className="bg-[#fef3c7] border border-[#d97706]/30 rounded-lg p-3">
                                        <strong className="text-[#d97706]">🔍 自問：</strong>
                                        <span className="text-[#4a4a6a] ml-1">{p.question}</span>
                                    </div>
                                    <div className="bg-[#d1fae5] border border-[#059669]/20 rounded-lg p-3">
                                        <strong className="text-[#059669]">✅ 範例：</strong>
                                        <span className="text-[#4a4a6a] ml-1">{p.example}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            {/* ═══════ 課堂流程 ═══════ */}
            <section className="mb-24">
                <div className="w9-section-head">
                    <h2 className="w9-section-title">課堂流程</h2>
                    <div className="w9-section-line"></div>
                    <span className="w9-section-tag">IN-CLASS</span>
                </div>

                <div className="grid gap-6">

                    {/* TASK 1 */}
                    <div className="w9-task-block">
                        <div className="w9-task-hd">
                            <span className="w9-task-badge">TASK 1</span>
                            <span className="w9-task-title">開場：為什麼需要倫理審查？</span>
                            <span className="text-[11px] text-[#8888aa] font-mono ml-auto">5 min</span>
                        </div>
                        <div className="p-6 text-[13px] text-[#4a4a6a]">
                            所有嚴肅的研究——不管是大學、醫院還是政府機構——在收集資料前都必須通過倫理審查。今天模擬這個流程：你們自己審查，老師幫你們把關。
                        </div>
                    </div>

                    {/* TASK 2 */}
                    <div className="w9-task-block">
                        <div className="w9-task-hd">
                            <span className="w9-task-badge">TASK 2</span>
                            <span className="w9-task-title">五大倫理原則講解 + 舉例</span>
                            <span className="text-[11px] text-[#8888aa] font-mono ml-auto">20 min</span>
                        </div>
                        <div className="p-6 text-[13px] text-[#4a4a6a]">
                            依序介紹五大原則，每個原則配舉例。讓學生思考：「如果違反這個原則，會發生什麼事？」
                        </div>
                    </div>

                    {/* TASK 3 */}
                    <div className="w9-task-block">
                        <div className="w9-task-hd">
                            <span className="w9-task-badge">TASK 3</span>
                            <span className="w9-task-title">自我倫理審查</span>
                            <span className="text-[11px] text-[#8888aa] font-mono ml-auto">20 min</span>
                        </div>
                        <div className="p-6 text-[13px] text-[#4a4a6a]">
                            <p className="mb-3">拿出研究工具和企劃書，用學習單 Part B 的倫理審查表逐條自我評估。</p>
                            <div className="bg-[#fef3c7] border border-[#d97706]/30 rounded-lg p-4">
                                <strong className="text-[#d97706]">⚠️ 高風險議題提醒：</strong>
                                <span className="ml-1">涉及「成績、體重、家庭、心理健康」的題目需要特別注意——這些是容易造成不適的敏感議題。</span>
                            </div>
                        </div>
                    </div>

                    {/* TASK 4 */}
                    <div className="w9-task-block">
                        <div className="w9-task-hd">
                            <span className="w9-task-badge">TASK 4</span>
                            <span className="w9-task-title">互相審查</span>
                            <span className="text-[11px] text-[#8888aa] font-mono ml-auto">5 min</span>
                        </div>
                        <div className="p-6 text-[13px] text-[#4a4a6a]">
                            和旁邊的組交換審查表，看看有沒有他們沒注意到的風險。寫下一個你認為他們需要特別注意的地方。
                        </div>
                    </div>

                    {/* 第二節分隔 */}
                    <div className="flex items-center gap-4 my-4">
                        <div className="h-px flex-1 bg-[#dddbd5]"></div>
                        <span className="text-[11px] font-mono text-[#8888aa] tracking-widest">第二節</span>
                        <div className="h-px flex-1 bg-[#dddbd5]"></div>
                    </div>

                    {/* TASK 5 */}
                    <div className="w9-task-block">
                        <div className="w9-task-hd">
                            <span className="w9-task-badge">TASK 5</span>
                            <span className="w9-task-title">各組口頭報告倫理審查結果</span>
                            <span className="text-[11px] text-[#8888aa] font-mono ml-auto">20 min</span>
                        </div>
                        <div className="p-6 text-[13px] text-[#4a4a6a]">
                            <p className="mb-3">每組 2 分鐘報告：</p>
                            <div className="bg-[#f8f7f4] border border-[#dddbd5] rounded-lg p-4">
                                <ol className="list-decimal ml-4 space-y-1">
                                    <li>研究主題（一句話）</li>
                                    <li>研究方法（問卷 / 訪談 / 觀察 / 實驗 / 文獻）</li>
                                    <li>哪個原則是你們的主要風險？如何處理？</li>
                                    <li>同儕審查的補充意見？你們如何回應？</li>
                                </ol>
                            </div>
                        </div>
                    </div>

                    {/* TASK 6 */}
                    <div className="w9-task-block">
                        <div className="w9-task-hd">
                            <span className="w9-task-badge">TASK 6</span>
                            <span className="w9-task-title">修正 + 取得「研究啟動許可」</span>
                            <span className="text-[11px] text-[#8888aa] font-mono ml-auto">15 min</span>
                        </div>
                        <div className="p-6 text-[13px] text-[#4a4a6a]">
                            <p className="mb-3">根據報告和討論進行最後修正。填寫學習單 Part C「研究啟動確認表」——這就是你們的研究許可證。</p>
                            <div className="bg-[#d1fae5] border border-[#059669]/20 rounded-lg p-4">
                                <strong className="text-[#059669]">🛡️ 通過標準：</strong>
                                <span className="ml-1">不需要「零風險」——重點是你能識別風險並有合理的處理方案。</span>
                            </div>
                        </div>
                    </div>

                    {/* TASK 7 */}
                    <div className="w9-task-block">
                        <div className="w9-task-hd">
                            <span className="w9-task-badge">TASK 7</span>
                            <span className="w9-task-title">執行計畫確認 + 正式啟動資料收集</span>
                            <span className="text-[11px] text-[#8888aa] font-mono ml-auto">13 min</span>
                        </div>
                        <div className="p-6 text-[13px] text-[#4a4a6a]">
                            <p className="mb-3">恭喜取得研究啟動許可！確認每人具體行動計畫：誰負責找多少位受訪者、什麼時候完成、資料怎麼整理。</p>
                            <div className="bg-[#ede9fe] border border-[#7c3aed]/20 rounded-lg p-4">
                                <strong className="text-[#7c3aed]">📅 資料收集時程建議</strong>
                                <div className="mt-2 space-y-1">
                                    <p><strong>問卷法：</strong>1 週內完成發放與回收（第 1 天設計 Google 表單，第 2–5 天收集）。</p>
                                    <p><strong>訪談法：</strong>至少訪談 2–3 位受訪者，每次 15–30 分鐘，需提前約好時間。</p>
                                    <p><strong>觀察法：</strong>至少觀察 3 個不同時段 / 場次，每次至少 20 分鐘。</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* TASK 8 */}
                    <div className="w9-task-block">
                        <div className="w9-task-hd">
                            <span className="w9-task-badge">TASK 8</span>
                            <span className="w9-task-title">收束 + W11 預告</span>
                            <span className="text-[11px] text-[#8888aa] font-mono ml-auto">2 min</span>
                        </div>
                        <div className="p-6 text-[13px] text-[#4a4a6a]">
                            W11 進行資料收集中期回顧。遇到問題不要慌：受訪者不夠、題目理解有誤、觀察條件不符——都是正常的，帶來一起解決。
                        </div>
                    </div>

                </div>
            </section>

            {/* ═══════ WRAP UP ═══════ */}
            <section className="mb-24">
                <div className="w9-section-head">
                    <h2 className="w9-section-title">本週總結</h2>
                    <div className="w9-section-line"></div>
                    <span className="w9-section-tag">WRAP-UP</span>
                </div>

                <div className="bg-white border border-[#dddbd5] rounded-xl overflow-hidden mb-6">
                    <div className="bg-[#f0ede6] px-5 py-3 border-b border-[#dddbd5] font-bold text-[14px]">✅ 本週結束，你應該要會</div>
                    <div className="grid grid-cols-2 bg-[#dddbd5] gap-[1px]">
                        {[
                            '說出五大研究倫理原則的核心精神',
                            '用倫理審查表評估自己的研究計畫',
                            '識別研究中的倫理風險並提出處理方案',
                            '制定具體可行的資料收集執行計畫'
                        ].map((txt, i) => (
                            <div key={i} className="bg-white p-4 flex items-center gap-2 text-[13px]">
                                <CheckCircle2 size={16} className="text-[#2e7d5a]" /> {txt}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white border border-[#dddbd5] rounded-xl overflow-hidden mb-6">
                    <div className="bg-[#f0ede6] px-5 py-3 border-b border-[#dddbd5] flex items-center gap-3">
                        <span className="text-[10px] font-mono bg-[#1a1a2e] text-white px-2 py-0.5 rounded-[3px]">DELIVERABLES</span>
                        <span className="font-bold text-[13px]">本週產出</span>
                    </div>
                    <div className="divide-y divide-[#dddbd5]">
                        {[
                            { part: 'Part A', text: '五大倫理原則速記（用自己的話）' },
                            { part: 'Part B', text: '自我倫理審查表（五大原則逐條評估）', badge: '課堂完成' },
                            { part: 'Part C', text: '研究啟動確認表（即許可證）', badge: '最重要' },
                            { part: 'Part D', text: '資料收集執行計畫（W10 課後 → W11 課前）' },
                        ].map((hw, idx) => (
                            <div key={idx} className="p-4 px-6 flex items-center justify-between text-[13px]">
                                <div className="flex items-center gap-6">
                                    <span className="font-bold font-mono w-12 shrink-0 text-[#2d5be3]">{hw.part}</span>
                                    <span className="text-[#4a4a6a]">{hw.text}</span>
                                </div>
                                {hw.badge && <span className="bg-[#fdecea] text-[#c0392b] text-[10px] px-2 py-0.5 rounded border border-[#c0392b]/20 font-bold">{hw.badge}</span>}
                            </div>
                        ))}
                    </div>
                    <div className="p-4 px-6 bg-[#f8f7f4] border-t border-[#dddbd5] flex items-center justify-between">
                        <span className="text-[12px] text-[#8888aa]">學習單在 Google Classroom 下載</span>
                        <a href="https://classroom.google.com/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-[12px] font-mono font-bold text-[#2d5be3]">
                            → Google Classroom
                        </a>
                    </div>
                </div>

                <div className="w9-next-week">
                    <div className="flex items-center gap-3 px-6 py-4 border-b border-white/10">
                        <Map size={18} />
                        <span className="font-bold text-[15px]">W11 預告：資料收集中期回顧</span>
                    </div>
                    <div className="w9-next-grid">
                        <div className="w9-next-item">
                            <div className="text-[10px] text-white/40 uppercase mb-2 font-mono">收集中</div>
                            <p className="text-[13px] text-white/80 leading-relaxed">這 2 週是你們的資料收集窗口。W11 回來帶著你已經收集到的資料和遇到的問題。</p>
                        </div>
                        <div className="w9-next-item">
                            <div className="text-[10px] text-red-400 uppercase mb-2 font-mono">注意</div>
                            <p className="text-[13px] text-white/80 leading-relaxed">資料收集不需要完美，需要的是誠實。遇到問題帶來 W11 一起解決。</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pagination */}
            <div className="flex justify-between items-center py-12 border-t border-[#dddbd5] mt-12">
                <Link to="/w9" className="flex items-center gap-2 text-[#8888aa] hover:text-[#1a1a2e] transition-colors text-[13px] font-bold no-underline">
                    ← 回 W9 品質診斷
                </Link>
                <Link to="/w11" className="flex items-center gap-2 bg-[#1a1a2e] text-white px-6 py-3 rounded-lg hover:bg-[#2a2a4a] transition-colors text-[13px] font-bold no-underline">
                    前往 W11 資料收集 <ArrowRight size={16} />
                </Link>
            </div>
        </div>
    );
};
