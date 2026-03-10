import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    ArrowLeft,
    CheckCircle2,
    Gamepad2,
    ArrowRight,
    Copy,
    Search,
    PenTool,
    Bot,
    CheckCircle,
    ChevronRight,
    Award,
    Mic,
    BookMarked,
    Users,
    Lightbulb,
    Trophy,
    GraduationCap
} from 'lucide-react';
import CopyButton from '../components/ui/CopyButton';

export const W16Page = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);


    return (
        <div className="page-container animate-in-fade-slide">
            {/* REMOVED: <style dangerouslySetInnerHTML /> - styles moved to index.css */}

            {/* TOP BAR */}
            <div className="flex items-center justify-between border-b border-[#dddbd5] pb-4 mb-16">
                <div className="text-[11px] font-mono text-[#8888aa] flex items-center gap-2">
                    研究方法與專題 / 成果發表 / <span className="text-[#1a1a2e] font-bold">Gallery Walk W16</span>
                </div>
                <div className="flex items-center gap-4">
                    <span className="bg-[#f0ede6] text-[#1a1a2e] text-[10px] font-bold px-2 py-0.5 rounded-[2px] font-mono">100 MINS</span>
                    <span className="bg-[#c9a84c] text-[#1a1a2e] text-[10px] font-bold px-2 py-0.5 rounded-[2px] font-mono">🏁 終點站</span>
                    <span className="bg-[#1a1a2e] text-white text-[10px] font-bold px-2 py-0.5 rounded-[2px] font-mono">AI-RED · D</span>
                </div>
            </div>

            {/* PAGE HEADER */}
            <div className="max-w-[800px] mb-16">
                <div className="text-[#c9a84c] font-mono text-[11px] font-bold tracking-widest uppercase mb-4">🏆 W16 · 成果發表</div>
                <h1 className="font-serif text-[42px] font-bold leading-[1.2] text-[#1a1a2e] mb-6 tracking-[-0.01em]">
                    Gallery Walk：<span className="text-[#c9a84c]">策展人上場</span>
                </h1>
                <p className="text-[16px] text-[#4a4a6a] leading-relaxed mb-8">
                    終點線。今天你是策展人，也是觀眾。站在自己的海報旁說清楚你的研究；走到別人面前，用一個好問題深化你的理解。16 週的旅程，今天收尾。
                </p>

                {/* Course Arc - Completion Version */}
                <div className="mb-14">
                    <div className="text-[11px] text-[#8888aa] mb-4">課程弧線 · 全部完成</div>
                    <div className="arc-grid">
                        {[
                            { wk: 'W1-W4', name: '問題意識\n題目定案' },
                            { wk: 'W5-W7', name: '研究規劃\n文獻鑑識' },
                            { wk: 'W8-W10', name: '工具設計\n倫理審查' },
                            { wk: 'W11-W12', name: '執行研究\n資料蒐集' },
                            { wk: 'W13-W14', name: '圖表製作\n四層結論' },
                            { wk: 'W15', name: '報告組裝\n海報設計' },
                            { wk: 'W16', name: 'Gallery Walk\n🏁', now: true }
                        ].map((item, idx) => (
                            <div key={idx} className={`arc-item ${item.now ? 'now' : ''}`}>
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
                    <div className="meta-value">場布 + 第一輪發表</div>
                </div>
                <div className="meta-item">
                    <div className="meta-label">第二節</div>
                    <div className="meta-value">第二輪發表 + 後設反思</div>
                </div>
                <div className="meta-item">
                    <div className="meta-label">兩份學習單</div>
                    <div className="meta-value">報告者版 + 聆聽者版</div>
                </div>
                <div className="meta-item">
                    <div className="meta-label">課後</div>
                    <div className="meta-value">慶祝！🎉</div>
                </div>
            </div>

            {/* 今天怎麼運作 SECTION */}
            <section>
                <div className="section-head">
                    <h2>今天怎麼運作</h2>
                    <div className="line"></div>
                    <span className="mono">HOW IT WORKS</span>
                </div>

                <div className="text-[11px] font-mono text-[#8888aa] tracking-[0.1em] uppercase mb-4">A / B 組輪替機制</div>
                <div className="w16-ab-table">
                    <div className="w16-ab-table-hd">
                        <div className="w16-ab-hd-cell">組別</div>
                        <div className="w16-ab-hd-cell">第一輪（前 35 分鐘）</div>
                        <div className="w16-ab-hd-cell">第二輪（後 35 分鐘）</div>
                    </div>
                    <div className="w16-ab-table-row">
                        <div className="w16-ab-cell group">A</div>
                        <div className="w16-ab-cell">
                            <span className="w16-ab-role-tag bg-[#fdf6e3] text-[#7a6020]">🎤 報告者</span><br />
                            守著海報，接待聆聽者，記錄被問的問題
                        </div>
                        <div className="w16-ab-cell">
                            <span className="w16-ab-role-tag bg-[#e8eeff] text-[#2d5be3]">📚 聆聽者</span><br />
                            拿學習單自由走動，至少聽 4 組，填 4 張筆記卡
                        </div>
                    </div>
                    <div className="w16-ab-table-row">
                        <div className="w16-ab-cell group">B</div>
                        <div className="w16-ab-cell">
                            <span className="w16-ab-role-tag bg-[#e8eeff] text-[#2d5be3]">📚 聆聽者</span><br />
                            拿學習單自由走動，至少聽 4 組，填 4 張筆記卡
                        </div>
                        <div className="w16-ab-cell">
                            <span className="w16-ab-role-tag bg-[#fdf6e3] text-[#7a6020]">🎤 報告者</span><br />
                            守著海報，接待聆聽者，記錄被問的問題
                        </div>
                    </div>
                </div>

                <div className="notice notice-accent">
                    🔑 每個人最終都有兩個身分，兩份學習單都要填完才算完成今天的任務。
                </div>

                <div className="text-[11px] font-mono text-[#8888aa] tracking-[0.1em] uppercase mb-4 mt-12">兩個角色，各自的任務</div>
                <div className="w16-role-pair">
                    <div className="w16-role-card">
                        <div className="w16-role-emoji">🎤</div>
                        <div className="w16-role-name">報告者</div>
                        <ul className="w16-role-task-list">
                            <li>站在海報旁，等待聆聽者走過來</li>
                            <li>2–3 分鐘說清楚你的研究——不是念海報，是說故事</li>
                            <li>先說「為什麼做」，再說「發現了什麼」</li>
                            <li>每場接待結束，立刻在報告者學習單記錄被問的問題</li>
                            <li>目標：完成 4 場以上的接待</li>
                        </ul>
                    </div>
                    <div className="w16-role-card">
                        <div className="w16-role-emoji">📚</div>
                        <div className="w16-role-name">聆聽者</div>
                        <ul className="w16-role-task-list">
                            <li>拿著聆聽者學習單，自由走動</li>
                            <li>走近海報，聽完報告者說明</li>
                            <li>問至少一個問題——好問題比貼紙更有價值</li>
                            <li>每聽完一組，馬上填一張筆記卡，不要等到最後補</li>
                            <li>目標：聽 4 組以上，填 4 張筆記卡</li>
                        </ul>
                    </div>
                </div>

                <div className="text-[11px] font-mono text-[#8888aa] tracking-[0.1em] uppercase mb-4 mt-12">學術投資機制</div>
                <div className="border border-[#dddbd5] rounded-[10px] overflow-hidden mb-8">
                    <div className="bg-[#1a1a2e] p-4 flex items-center gap-3">
                        <Award className="text-[#c9a84c]" size={20} />
                        <span className="text-[14px] font-bold text-white">學術投資財：每人 3 張圓點貼紙</span>
                    </div>
                    <div className="bg-white p-5">
                        <div className="grid grid-cols-3 gap-px bg-[#dddbd5] rounded-[6px] overflow-hidden mb-4">
                            <div className="bg-[#f0f7f4] p-4 text-center">
                                <Trophy className="text-[#2e7d5a] mx-auto mb-2" size={20} />
                                <div className="text-[12px] font-bold">方法很嚴謹</div>
                                <div className="text-[10px] text-[#8888aa] mt-1">工具設計、倫理、樣本都很扎實</div>
                            </div>
                            <div className="bg-[#f0f7f4] p-4 text-center">
                                <Lightbulb className="text-[#c9a84c] mx-auto mb-2" size={20} />
                                <div className="text-[12px] font-bold">發現超有趣</div>
                                <div className="text-[10px] text-[#8888aa] mt-1">結論讓你意外或很想繼續追問</div>
                            </div>
                            <div className="bg-[#f0f7f4] p-4 text-center">
                                <Award className="text-[#2d5be3] mx-auto mb-2" size={20} />
                                <div className="text-[12px] font-bold">海報一眼看懂</div>
                                <div className="text-[10px] text-[#8888aa] mt-1">3 秒就知道他們在研究什麼</div>
                            </div>
                        </div>
                        <p className="text-[12px] text-[#4a4a6a] leading-relaxed">
                            三張貼紙不能全投同一組，也不能投給自己組。最後統計誰獲得最多學術投資——不算分數，但代表同學對你研究的認可。
                        </p>
                    </div>
                </div>
            </section>

            {/* 課堂任務 SECTION */}
            <section>
                <div className="section-head">
                    <h2>課堂任務</h2>
                    <div className="line"></div>
                    <span className="mono">IN-CLASS</span>
                </div>

                {/* 第一節 */}
                <div className="w16-session-divider">
                    <span className="w16-session-badge">第一節</span>
                    <div className="w16-session-line"></div>
                    <span className="w16-session-desc">場地布置 + 第一輪 · 50 分鐘</span>
                </div>

                <div className="w16-task-block">
                    <div className="w16-task-hd">
                        <span className="w16-task-badge">TASK 1</span>
                        <span className="w16-task-title">場地布置（0:00–0:08，8 分鐘）</span>
                    </div>
                    <div className="w16-task-body">
                        <ol className="w16-task-ol">
                            <li>所有海報貼在教室兩側牆壁或黑板上，不能坐在原位報告</li>
                            <li>中間桌椅全部推遠，讓走動空間出來</li>
                            <li>確認電子展示設備（平板、投影）正常運作</li>
                        </ol>
                    </div>
                </div>

                <div className="w16-task-block">
                    <div className="w16-task-hd">
                        <span className="w16-task-badge">TASK 2</span>
                        <span className="w16-task-title">A 組報告者暖身（0:08–0:10，2 分鐘）</span>
                    </div>
                    <div className="w16-task-body">
                        <p className="text-[13px] text-[#4a4a6a] mb-4">正式開始前，A 組先用這個公式練習 30 秒開場白：</p>
                        <div className="w16-warmup-formula">
                            <div className="w16-warmup-hd">
                                <span className="text-[10px] font-bold text-[#c9a84c] font-mono tracking-widest uppercase">30 Second Pitch Formula</span>
                            </div>
                            <div className="w16-warmup-body">
                                <div className="w16-formula-line">「你有沒有遇過 <span className="w16-formula-slot">生活中的問題</span> ？」</div>
                                <div className="w16-formula-line">「我們發現其實是因為 <span className="w16-formula-slot">核心發現（一句話）</span> ！」</div>
                                <div className="w16-formula-line">「我們是怎麼證實的？ <span className="w16-formula-slot">用 N 個樣本調查證實</span> 。」</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="w16-task-block">
                    <div className="w16-task-hd">
                        <span className="w16-task-badge">TASK 3</span>
                        <span className="w16-task-title">第一輪 Gallery Walk（0:10–0:45，35 分鐘）</span>
                    </div>
                    <div className="w16-task-body">
                        {/* AI 提問助手 */}
                        <div className="prompt-box">
                            <div className="prompt-hd">
                                <span className="bg-[#c9a84c] text-[#1a1a2e] text-[10px] px-2 py-0.5 rounded font-mono font-bold">選配 PROMPT</span>
                                <span className="text-white text-[13px] font-bold">AI 提問生成器（想不到問題時使用）</span>
                            </div>
                            <div className="prompt-body">
                                {`我剛剛聽了一組同學的研究，他們研究的是「＿＿＿」，
主要發現是「＿＿＿」。

請幫我想 3 個有深度的問題，我可以去問他們：
1. 一個關於「研究方法」的問題
2. 一個關於「研究限制」的問題
3. 一個關於「未來應用」的問題`}
                            </div>
                            <CopyButton
                                text={`我剛剛聽了一組同學的研究，他們研究的是「＿＿＿」，
主要發現是「＿＿＿」。

請幫我想 3 個有深度的問題，我可以去問他們：
1. 一個關於「研究方法」的問題
2. 一個關於「研究限制」的問題
3. 一個關於「未來應用」的問題`}
                                className="border-t border-[#dddbd5] px-4 py-3 text-[12px] text-[#8888aa] hover:text-[#1a1a2e] hover:bg-[#f0ede6] transition-colors flex items-center gap-2 w-full"
                                label="📋 複製這段 Prompt"
                                successLabel="✓ 已複製！"
                            />
                        </div>
                        <div className="notice notice-success">
                            ⭐ <strong>AI 最佳提問獎：</strong>如果你用 AI 想出了一個讓報告者答不出來但很有深度的「神問題」，請在學習單上打星號！
                        </div>
                    </div>
                </div>

                {/* 第二節 */}
                <div className="w16-session-divider">
                    <span className="w16-session-badge">第二節</span>
                    <div className="w16-session-line"></div>
                    <span className="w16-session-desc">第二輪 + 後設反思 · 50 分鐘</span>
                </div>

                <div className="w16-task-block">
                    <div className="w16-task-hd">
                        <span className="w16-task-badge">TASK 4</span>
                        <span className="w16-task-title">第二輪 Gallery Walk（0:00–0:35，35 分鐘）</span>
                    </div>
                    <div className="w16-task-body">
                        <p className="text-[13px] text-[#4a4a6a]">角色互換。現在換 B 組守在海報旁，A 組出發聽報告並完成 3 張貼紙投資。</p>
                    </div>
                </div>

                <div className="w16-task-block">
                    <div className="w16-task-hd">
                        <span className="w16-task-badge">TASK 5</span>
                        <span className="w16-task-title">填完學習單最後欄（0:35–0:43，8 分鐘）</span>
                    </div>
                    <div className="w16-task-body">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="bg-[#fdf6e3] p-4 rounded-lg">
                                <div className="text-[11px] font-bold text-[#7a6020] mb-2 uppercase flex items-center gap-2"><Mic size={14} /> 報告者反思</div>
                                <div className="text-[12px] text-[#7a6020] space-y-2">
                                    <p>• 被問到最深刻的問題？</p>
                                    <p>• 答不出來的問題是什麼？</p>
                                    <p>• 幾場後發現怎麼解釋最清楚？</p>
                                </div>
                            </div>
                            <div className="bg-[#e8eeff] p-4 rounded-lg">
                                <div className="text-[11px] font-bold text-[#2d5be3] mb-2 uppercase flex items-center gap-2"><BookMarked size={14} /> 聆聽者反思</div>
                                <div className="text-[12px] text-[#2d5be3] space-y-2">
                                    <p>• 今天最有共鳴的研究？</p>
                                    <p>• 別組的方法有什麼可學？</p>
                                    <p>• 你心中好的研究特質？</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 本週總結 SECTION */}
            <section className="mt-20">
                <div className="section-head">
                    <h2>本週總結</h2>
                    <div className="line"></div>
                    <span className="mono">WRAP-UP</span>
                </div>

                <div className="grid grid-cols-2 gap-4 border border-[#dddbd5] rounded-[10px] overflow-hidden">
                    <div className="bg-[#f0f7f4] p-5 flex items-start gap-3">
                        <CheckCircle2 className="text-[#2e7d5a]" size={18} />
                        <span className="text-[13px] text-[#1a1a2e] font-bold">報告者單：4 場接待紀錄 + 反思</span>
                    </div>
                    <div className="bg-[#f0f7f4] p-5 flex items-start gap-3">
                        <CheckCircle2 className="text-[#2e7d5a]" size={18} />
                        <span className="text-[13px] text-[#1a1a2e] font-bold">聆聽者單：4 組筆記 + 反思</span>
                    </div>
                    <div className="bg-[#f0f7f4] p-5 flex items-start gap-3">
                        <CheckCircle2 className="text-[#2e7d5a]" size={18} />
                        <span className="text-[13px] text-[#1a1a2e] font-bold">3 張圓點貼紙已投出</span>
                    </div>
                    <div className="bg-[#f0f7f4] p-5 flex items-start gap-3">
                        <CheckCircle2 className="text-[#2e7d5a]" size={18} />
                        <span className="text-[13px] text-[#1a1a2e] font-bold">已上傳 Google Classroom</span>
                    </div>
                </div>

                <div className="mt-12">
                    <div className="text-[11px] font-mono text-[#8888aa] tracking-[0.1em] uppercase mb-4">選修 · 學習歷程檔案整合建議</div>
                    <div className="w16-portfolio-table">
                        <div className="w16-pt-hd">
                            <div className="w16-pt-hd-cell">週次</div>
                            <div className="w16-pt-hd-cell">核心學習單</div>
                            <div className="w16-pt-hd-cell">代表的能力</div>
                        </div>
                        <div className="w16-pt-row">
                            <div className="w16-pt-cell wk">W1-W4</div>
                            <div className="w16-pt-cell title">問題意識與方法快篩</div>
                            <div className="w16-pt-cell">提出有價值的問題</div>
                        </div>
                        <div className="w16-pt-row">
                            <div className="w16-pt-cell wk">W5-W8</div>
                            <div className="w16-pt-cell title">文獻鑑識與工具設計</div>
                            <div className="w16-pt-cell">資料查證與嚴謹邏輯</div>
                        </div>
                        <div className="w16-pt-row">
                            <div className="w16-pt-cell wk">W13-W14</div>
                            <div className="w16-pt-cell title">數據轉譯與核心結論</div>
                            <div className="w16-pt-cell">洞察數據背後的意義</div>
                        </div>
                        <div className="w16-pt-row">
                            <div className="w16-pt-cell wk">W15-W16</div>
                            <div className="w16-pt-cell title">海報設計與發表筆記</div>
                            <div className="w16-pt-cell">溝通表達與後設思考</div>
                        </div>
                    </div>
                </div>

                <div className="w16-closing-banner">
                    <div className="w16-closing-hd">
                        <div className="w16-closing-eyebrow">W0 → W16 · 全程完賽</div>
                        <div className="w16-closing-title">你學到的最重要的東西，<br />不是任何一個研究技術。</div>
                        <div className="w16-closing-sub">
                            是——遇到問題，你知道怎麼找下一步。<br />
                            這 16 週，你從一個想法出發，走過了問題意識、研究規劃、工具設計、分析報告，最後站在這裡把它說給別人聽。恭喜你們完成了！🎉
                        </div>
                    </div>
                    <div className="w16-closing-phases">
                        <div className="w16-closing-phase">
                            <div className="w16-cp-label">Phase 01</div>
                            <div className="w16-cp-title">問題意識</div>
                            <div className="w16-cp-weeks">W0 – W2</div>
                        </div>
                        <div className="w16-closing-phase">
                            <div className="w16-cp-label">Phase 02</div>
                            <div className="w16-cp-title">研究規劃</div>
                            <div className="w16-cp-weeks">W3 – W7</div>
                        </div>
                        <div className="w16-closing-phase">
                            <div className="w16-cp-label">Phase 03</div>
                            <div className="w16-cp-title">裝備執行</div>
                            <div className="w16-cp-weeks">W8 – W12</div>
                        </div>
                        <div className="w16-closing-phase">
                            <div className="w16-cp-label">Phase 04</div>
                            <div className="w16-cp-title">成果發表</div>
                            <div className="w16-cp-weeks">W13 – W16</div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-between items-center mt-16 pt-8 border-t border-[#dddbd5]">
                    <Link to="/w15" className="text-[13px] font-bold text-[#8888aa] hover:text-[#1a1a2e] flex items-center gap-2 transition-colors">
                        ← 回 W15 簡報設計
                    </Link>
                    <div className="flex items-center gap-2 bg-[#c9a84c] text-[#1a1a2e] px-8 py-3 rounded-[6px] text-[14px] font-bold">
                        🎉 課程完成！ <GraduationCap size={20} />
                    </div>
                </div>
            </section>
        </div>
    );
};
