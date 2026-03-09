import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    ShieldCheck, Map, ChevronRight, CheckCircle2, AlertCircle,
    Lock, ClipboardCheck, Users, Search, Heart, Wrench, Zap,
    MessageSquare, Sparkles, ArrowRight
} from 'lucide-react';
import LessonMap from '../components/ui/LessonMap';
import { W10Data } from '../data/lessonMaps';

export const W10Page = () => {
    const [showLessonMap, setShowLessonMap] = useState(false);

    const copyPrompt = async () => {
        const text = `我寫了一段問卷（或訪談）的知情同意說明，請幫我：

1. 從「16–18 歲高中生」的角度閱讀這段說明
2. 找出任何看不懂或容易誤解的詞彙與句子
3. 找出任何可能讓受訪者感到壓力或不舒服的語氣
4. 幫我改寫成更清楚、更友善的版本（保留所有必要資訊）

以下是我的知情同意說明：
【貼上你的知情同意說明】`;
        try {
            await navigator.clipboard.writeText(text);
            const btn = document.getElementById('copy-btn');
            if (btn) {
                const originalText = btn.innerHTML;
                btn.innerHTML = '✓ 已複製！';
                setTimeout(() => { btn.innerHTML = originalText; }, 2000);
            }
        } catch (err) {
            console.error('Failed to copy!', err);
        }
    };

    return (
        <div className="w-[100%] max-w-[1000px] mx-auto p-12 bg-[#f8f7f4]">
            <style dangerouslySetInnerHTML={{
                __html: `
                :root {
                    --ink: #1a1a2e;
                    --ink-mid: #4a4a6a;
                    --ink-light: #8888aa;
                    --paper: #f8f7f4;
                    --paper-warm: #f0ede6;
                    --accent: #2d5be3;
                    --accent-light: #e8eeff;
                    --gold: #c9a84c;
                    --gold-light: #fdf6e3;
                    --success: #2e7d5a;
                    --success-light: #e8f5ee;
                    --danger: #c0392b;
                    --danger-light: #fdecea;
                    --border: #dddbd5;
                    --border-mid: #c8c5bc;
                }

                @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+TC:wght@400;600;700&family=Noto+Sans+TC:wght@300;400;500;700&family=DM+Mono:wght@400;500&display=swap');

                .w10-meta-strip { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1px; background: var(--border); border: 1px solid var(--border); border-radius: 10px; overflow: hidden; margin-bottom: 48px; }
                .w10-meta-item { background: #fff; padding: 14px 18px; }
                .w10-meta-label { font-size: 10px; font-family: 'DM Mono', monospace; color: var(--ink-light); letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 4px; }
                .w10-meta-value { font-size: 13px; font-weight: 700; color: var(--ink); }

                .w10-section-head { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; margin-top: 48px; }
                .w10-section-title { font-family: 'Noto Serif TC', serif; font-size: 18px; font-weight: 700; color: var(--ink); white-space: nowrap; }
                .w10-section-line { flex: 1; height: 1px; background: var(--border); }
                .w10-section-tag { font-family: 'DM Mono', monospace; font-size: 10px; color: var(--ink-light); letter-spacing: 0.08em; }

                .w10-notice { padding: 11px 16px; border-radius: 0 6px 6px 0; font-size: 12px; line-height: 1.75; margin-bottom: 24px; border-left: 4px solid transparent; }
                .w10-notice-gold { background: var(--gold-light); color: #7a6020; border-left-color: var(--gold); }
                .w10-notice-accent { background: var(--accent-light); color: var(--accent); border-left-color: var(--accent); }
                .w10-notice-success { background: var(--success-light); color: var(--success); border-left-color: var(--success); }
                .w10-notice-danger { background: var(--danger-light); color: var(--danger); border-left-color: var(--danger); }

                .w10-flow-strip { display: grid; grid-template-columns: repeat(5, 1fr); gap: 1px; background: var(--border); border: 1px solid var(--border); border-radius: 10px; overflow: hidden; margin-bottom: 10px; }
                .w10-flow-item { background: #fff; padding: 14px 12px; text-align: center; }
                .w10-flow-item.active { background: var(--ink); }
                .w10-flow-letter { font-family: 'DM Mono', monospace; font-size: 18px; font-weight: 700; color: var(--border-mid); margin-bottom: 4px; }
                .w10-flow-item.active .w10-flow-letter { color: var(--gold); }
                .w10-flow-name { font-size: 11px; font-weight: 700; color: var(--ink-light); margin-bottom: 3px; }
                .w10-flow-item.active .w10-flow-name { color: #fff; }
                .w10-flow-desc { font-size: 10px; color: var(--ink-light); line-height: 1.5; }
                .w10-flow-item.active .w10-flow-desc { color: rgba(255,255,255,0.5); }

                .w10-ethics-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1px; background: var(--border); border: 1px solid var(--border); border-radius: 10px; overflow: hidden; margin-bottom: 24px; }
                .w10-ethics-card { background: #fff; padding: 20px 24px; }
                .w10-ethics-num { font-family: 'DM Mono', monospace; font-size: 24px; font-weight: 700; color: var(--border); margin-bottom: 8px; line-height: 1; }
                .w10-ethics-title { font-size: 15px; font-weight: 700; color: var(--ink); margin-bottom: 8px; }
                .w10-ethics-q { font-size: 12px; color: var(--ink-mid); line-height: 1.85; }
                .w10-ethics-flag { font-size: 11px; margin-top: 12px; padding: 5px 12px; border-radius: 4px; display: inline-block; font-weight: 500; }

                .w10-auth-block { background: #0f1225; border-radius: 10px; overflow: hidden; margin-bottom: 32px; border: 1px solid #2a2f4e; }
                .w10-auth-hd { padding: 14px 24px; border-bottom: 1px solid #2a2f4e; display: flex; align-items: center; gap: 12px; }
                .w10-auth-status-dot { width: 8px; height: 8px; border-radius: 50%; background: #c0392b; box-shadow: 0 0 6px #c0392b; flex-shrink: 0; }
                .w10-auth-label { font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 0.15em; color: rgba(255,255,255,0.35); text-transform: uppercase; }
                .w10-auth-title { font-size: 13px; font-weight: 700; color: #fff; margin-left: 4px; }
                .w10-auth-body { padding: 24px; }
                .w10-auth-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1px; background: #2a2f4e; border-radius: 6px; overflow: hidden; margin-bottom: 20px; }
                .w10-auth-item { background: #0f1225; padding: 16px 20px; }
                .w10-auth-item-label { font-family: 'DM Mono', monospace; font-size: 10px; color: rgba(255,255,255,0.3); letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 6px; }
                .w10-auth-item-value { font-size: 12px; color: rgba(255,255,255,0.75); line-height: 1.7; }
                .w10-auth-stamp-area { border: 1px dashed #2a2f4e; border-radius: 8px; padding: 24px; text-align: center; }
                .w10-auth-stamp-icon { font-size: 32px; margin-bottom: 10px; opacity: 0.4; }
                .w10-auth-stamp-text { font-family: 'DM Mono', monospace; font-size: 11px; color: rgba(255,255,255,0.3); letter-spacing: 0.08em; }
                .w10-auth-stamp-sub { font-size: 12px; color: rgba(255,255,255,0.4); margin-top: 8px; line-height: 1.7; }

                .w10-prompt-box { background: var(--ink); border-radius: 10px; overflow: hidden; margin-bottom: 32px; }
                .w10-prompt-hd { padding: 12px 20px; border-bottom: 1px solid rgba(255,255,255,0.08); display: flex; align-items: center; gap: 10px; }
                .w10-prompt-body { padding: 18px 20px; font-size: 12px; color: rgba(255,255,255,0.7); line-height: 1.9; font-family: 'DM Mono', monospace; white-space: pre-wrap; }
                .w10-prompt-btn { margin: 0 20px 16px; padding: 8px 16px; background: rgba(255,255,255,0.1); color: rgba(255,255,255,0.7); border: 1px solid rgba(255,255,255,0.15); border-radius: 5px; font-size: 12px; cursor: pointer; transition: all 0.2s; }
                .w10-prompt-btn:hover { background: rgba(255,255,255,0.18); color: #fff; }

                .w10-task-block { border: 1px solid var(--border); border-radius: 10px; overflow: hidden; background: #fff; margin-bottom: 16px; }
                .w10-task-hd { padding: 14px 20px; background: var(--paper-warm); border-bottom: 1px solid var(--border); display: flex; align-items: center; gap: 10px; }
                .w10-task-badge { font-family: 'DM Mono', monospace; font-size: 10px; background: var(--ink); color: #fff; padding: 2px 8px; border-radius: 3px; }
                .w10-task-title { font-size: 15px; font-weight: 700; color: var(--ink); }
                .w10-task-body { padding: 24px; }
                .w10-task-ol { padding-left: 20px; font-size: 13px; color: var(--ink-mid); line-height: 2.2; }

                .w10-summary-box { border: 1px solid var(--border); border-radius: 10px; overflow: hidden; margin-bottom: 16px; background: #fff; }
                .w10-summary-hd { padding: 14px 20px; background: var(--paper-warm); border-bottom: 1px solid var(--border); font-weight: 700; font-size: 14px; }
                .w10-summary-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1px; background: var(--border); }
                .w10-summary-item { background: #fff; padding: 16px 20px; display: flex; align-items: flex-start; gap: 10px; font-size: 13px; color: var(--ink-mid); }

                .w10-hw-list { background: var(--border); display: flex; flex-direction: column; gap: 1px; }
                .w10-hw-item { background: #fff; padding: 14px 20px; display: flex; align-items: flex-start; gap: 16px; }
                .w10-hw-part { font-family: 'DM Mono', monospace; font-size: 12px; color: var(--accent); width: 80px; flex-shrink: 0; font-weight: 700; padding-top: 2px; }
                .w10-hw-name { font-size: 13px; color: var(--ink-mid); flex: 1; line-height: 1.7; }

                .w10-next-week { background: var(--ink); border-radius: 10px; overflow: hidden; color: #fff; }
                .w10-next-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1px; background: rgba(255,255,255,0.08); }
                .w10-next-item { background: var(--ink); padding: 24px; }
                .w10-next-label { font-size: 10px; font-family: 'DM Mono', monospace; color: rgba(255,255,255,0.3); letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 10px; }
                .w10-next-text { font-size: 13px; color: rgba(255,255,255,0.75); line-height: 1.8; }
                
                .animate-in { animation: slideIn 0.3s ease-out; }
                @keyframes slideIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
            ` }} />

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
                    <span className="bg-[#1a1a2e] text-white text-[10px] font-bold px-2 py-0.5 rounded-[2px] font-mono">AI-RED · D</span>
                </div>
            </div>

            {showLessonMap && (
                <div className="animate-in slide-in-from-top-4 duration-300 mb-12">
                    <LessonMap data={W10Data} />
                </div>
            )}

            {/* PAGE HEADER */}
            <div className="max-w-[800px] mb-16">
                <div className="text-[#2d5be3] font-mono text-[11px] font-bold tracking-widest uppercase mb-4">🛡️ W10 · 資料蒐集</div>
                <h1 className="font-serif text-[42px] font-bold leading-[1.2] text-[#1a1a2e] mb-6 tracking-[-0.01em]">
                    倫理審查：<span className="text-[#2d5be3]">確認、授權、出發</span>
                </h1>
                <p className="text-[16px] text-[#4a4a6a] leading-relaxed">
                    W8–W9 你把工具設計好了。今天是出發前的最後一道關卡——確認你的研究不會傷害受訪者、保護他們的個資、取得真正的知情同意。通過審查，蓋章，才能正式開始施測。
                </p>
            </div>

            <div className="w10-meta-strip">
                <div className="w10-meta-item">
                    <div className="w10-meta-label">第一節</div>
                    <div className="w10-meta-value">工具定稿 + 倫理四問自查</div>
                </div>
                <div className="w10-meta-item">
                    <div className="w10-meta-label">第二節</div>
                    <div className="w10-meta-value">執行計畫書 + 施測啟動宣告</div>
                </div>
                <div className="w10-meta-item">
                    <div className="w10-meta-label">課堂產出</div>
                    <div className="w10-meta-value">倫理審查表 + 研究執行計畫書</div>
                </div>
                <div className="w10-meta-item">
                    <div className="w10-meta-label">蓋章通過後</div>
                    <div className="w10-meta-value">正式施測開始（W11–W12）</div>
                </div>
            </div>

            {/* 學什麼 SECTION */}
            <section className="mb-24">
                <div className="w10-section-head">
                    <h2 className="w10-section-title">學什麼</h2>
                    <div className="w10-section-line"></div>
                    <span className="w10-section-tag">CONCEPT</span>
                </div>

                <div className="text-[10px] font-mono text-[#8888aa] tracking-[0.1em] uppercase mb-4 flex items-center gap-2">
                    <Zap size={10} /> AI-RED 框架 · 今天的任務
                </div>

                <div className="w10-flow-strip mb-4">
                    {[
                        { l: 'A', name: 'Ascribe', d: '說明研究情境交給 AI' },
                        { l: 'I', name: 'Inquire', d: '問 AI：這段說明夠清楚嗎？' },
                        { l: 'R', name: 'Reference', d: '參考 AI 改寫建議，不照單全收' },
                        { l: 'E', name: 'Evaluate', d: '判斷哪些改法更友善、不失真' },
                        { l: 'D', name: 'Document', d: '填寫審查表，記錄判斷決定', active: true }
                    ].map((step, idx) => (
                        <div key={idx} className={`w10-flow-item ${step.active ? 'active' : ''}`}>
                            <div className="w10-flow-letter">{step.l}</div>
                            <div className="w10-flow-name">{step.name}</div>
                            <div className="w10-flow-desc">{step.d}</div>
                        </div>
                    ))}
                </div>

                <div className="w10-notice w10-notice-gold">
                    📋 今天的重點在 <strong>Document（記錄）</strong>：倫理審查不是背書，是真的把你的判斷寫下來。「我知道這樣做」不夠——要寫出「我這樣做是因為」。
                </div>

                <div className="text-[10px] font-mono text-[#8888aa] tracking-[0.1em] uppercase mb-4 flex items-center gap-2 mt-12">
                    🛡️ 倫理四問 · 不是背定義，是問你自己的研究
                </div>

                <div className="w10-ethics-grid">
                    <div className="w10-ethics-card">
                        <div className="w10-ethics-num">❶</div>
                        <div className="w10-ethics-title">知情同意</div>
                        <div className="w10-ethics-q">受訪者知道這是什麼研究嗎？你說了「幫我填一下」，還是清楚告知了目的、用途、可退出？</div>
                        <div className="w10-ethics-flag" style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>⚠️ 最容易省略的一關</div>
                    </div>
                    <div className="w10-ethics-card border-l border-[#dddbd5]">
                        <div className="w10-ethics-num">❷</div>
                        <div className="w10-ethics-title">保密性</div>
                        <div className="w10-ethics-q">工具有沒有收集學號、電話、姓名？如果是必要，你有保護機制嗎？不需要就刪掉。</div>
                        <div className="w10-ethics-flag" style={{ background: 'var(--danger-light)', color: 'var(--danger)' }}>🚫 非必要一律刪除</div>
                    </div>
                    <div className="w10-ethics-card border-t border-[#dddbd5]">
                        <div className="w10-ethics-num">❸</div>
                        <div className="w10-ethics-title">不傷害</div>
                        <div className="w10-ethics-q">題目有沒有涉及情緒、關係、外貌等敏感面？如果有，你想好萬一受訪者不舒服時怎麼處理？</div>
                        <div className="w10-ethics-flag" style={{ background: 'var(--gold-light)', color: '#7a6020' }}>💡 不是不能問，是要有準備</div>
                    </div>
                    <div className="w10-ethics-card border-l border-t border-[#dddbd5]">
                        <div className="w10-ethics-num">❹</div>
                        <div className="w10-ethics-title">自願性</div>
                        <div className="w10-ethics-q">你招募時會有隱性壓力嗎（如拜託好友、老師轉達）？受訪者真的能自在地說「不」嗎？</div>
                        <div className="w10-ethics-flag" style={{ background: 'var(--success-light)', color: 'var(--success)' }}>✅ 讓「不參與」跟「參與」一樣容易</div>
                    </div>
                </div>

                <div className="w10-notice w10-notice-accent">
                    🔑 倫理審查不是老師在刁難你——這四個問題是保護你自己：如果未來受訪者有任何不滿，這份審查表就是你當初已經認真思考過的證明。
                </div>

                <div className="text-[10px] font-mono text-[#8888aa] tracking-[0.1em] uppercase mb-4 mt-12">教師蓋章授權 · 通過才能施測</div>
                <div className="w10-auth-block">
                    <div className="w10-auth-hd">
                        <div className="w10-auth-status-dot"></div>
                        <span className="w10-auth-label">ETHICS CLEARANCE STATUS</span>
                        <span className="w10-auth-title">審查待通過</span>
                        <div className="ml-auto text-[10px] font-mono text-white/30 tracking-tight uppercase">W10 · SSSH RESEARCH</div>
                    </div>
                    <div className="w10-auth-body">
                        <div className="w10-auth-grid">
                            <div className="w10-auth-item">
                                <div className="w10-auth-item-label">老師會確認</div>
                                <div className="w10-auth-item-value">有沒有知情同意段落？有無明顯倫理風險？題目數量是否合理？</div>
                            </div>
                            <div className="w10-auth-item">
                                <div className="w10-auth-item-label">老師會問你</div>
                                <div className="w10-auth-item-value">「這研究最大的倫理風險是什麼？你打算怎麼防？」答得出來，蓋章。</div>
                            </div>
                            <div className="w10-auth-item">
                                <div className="w10-auth-item-label">蓋章時機</div>
                                <div className="w10-auth-item-value">第二節課巡迴各組個別審查。寫計畫書時，請準備好定稿供查閱。</div>
                            </div>
                        </div>
                        <div className="w10-auth-stamp-area">
                            <div className="w10-auth-stamp-icon">🔏</div>
                            <div className="w10-auth-stamp-text uppercase opacity-50 tracking-widest text-[10px] font-bold">AWAITING ETHICS CLEARANCE STAMP</div>
                            <div className="w10-auth-stamp-sub text-white/40">完成倫理四問自查 + AI 審查後，等老師巡迴到你的位置</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 練什麼 SECTION */}
            <section className="mb-24">
                <div className="w10-section-head">
                    <h2 className="w10-section-title">練什麼</h2>
                    <div className="w10-section-line"></div>
                    <span className="w10-section-tag">PRACTICE</span>
                </div>

                <div className="text-[10px] font-mono text-[#8888aa] tracking-[0.1em] uppercase mb-4">AI 輔導 · 找出知情同意書的語言盲點</div>
                <p className="text-[13px] text-[#4a4a6a] mb-6 leading-relaxed">
                    很多知情同意書寫得非常官方，但受訪者根本讀不懂。AI 可以幫你從「16–18 歲高中生」的角度讀一遍，找出哪裡看不懂、哪裡語氣太強硬。
                </p>

                <div className="w10-prompt-box">
                    <div className="w10-prompt-hd">
                        <span className="bg-[#c9a84c] text-[#1a1a2e] text-[10px] px-2 py-0.5 rounded font-mono font-bold">PROMPT</span>
                        <span className="text-white text-[13px] font-bold">知情同意書審查</span>
                    </div>
                    <div className="w10-prompt-body font-mono">
                        {`我寫了一段問卷（或訪談）的知情同意說明，請幫我：

1. 從「16–18 歲高中生」的角度閱讀這段說明
2. 找出任何看不懂或容易誤解的詞彙與句子
3. 找出任何可能讓受訪者感到壓力或不舒服的語氣
4. 幫我改寫成更清楚、更友善的版本（保留所有必要資訊）

以下是我的知情同意說明：
【貼上你的知情同意說明】`}
                    </div>
                    <button
                        id="copy-btn"
                        onClick={copyPrompt}
                        className="w10-prompt-btn flex items-center gap-2"
                    >
                        <ClipboardCheck size={14} /> 📋 複製這段 Prompt
                    </button>
                </div>

                <div className="w10-notice w10-notice-gold">
                    💡 AI 改寫的版本不一定完全適合你——可能改得太口語、或少掉了必要資訊。你要逐條判斷，決定採納還是調整，理由寫在學習單 Part 2。
                </div>
                <div className="w10-notice w10-notice-danger">
                    ⚠️ 知情同意書有幾個資訊不能省：研究目的、資料如何使用、參與是自願的、可以中途退出、聯絡方式。AI 有時候為了「友善」把這些刪掉，要注意。
                </div>
            </section>

            {/* 課堂任務 SECTION */}
            <section className="mb-24">
                <div className="w10-section-head">
                    <h2 className="w10-section-title">課堂任務</h2>
                    <div className="w10-section-line"></div>
                    <span className="w10-section-tag">IN-CLASS</span>
                </div>

                <div className="space-y-4">
                    <div className="w10-task-block">
                        <div className="w10-task-hd">
                            <span className="w10-task-badge">TASK 1</span>
                            <span className="w10-task-title">工具定稿自查（第一節，15 分鐘）</span>
                        </div>
                        <div className="w10-task-body">
                            <ol className="w10-task-ol">
                                <li>拿出 W9 修正後的工具，對照學習單 Part 0 的自查清單逐項確認。</li>
                                <li>跟旁邊不同組的同學交換，扮演「受訪者」讀一遍：有沒有看不懂的題目或不舒服的問題？</li>
                                <li>在學習單「預試進化論」欄填入：從初稿到定稿，最大的一個改變是什麼。</li>
                            </ol>
                        </div>
                    </div>

                    <div className="w10-task-block">
                        <div className="w10-task-hd">
                            <span className="w10-task-badge">TASK 2</span>
                            <span className="w10-task-title">倫理四問自查（第一節，15 分鐘）</span>
                        </div>
                        <div className="w10-task-body">
                            <ol className="w10-task-ol">
                                <li>翻到學習單 Part 1，針對你自己研究回答四個問題（真心思考，非背答案）。</li>
                                <li>敏感議題表格：誠實勾選情緒、家庭、感情等領域，並寫出應對方式。</li>
                                <li>資料保護計畫：資料存在哪、誰可以看、什麼時候刪除。</li>
                            </ol>
                        </div>
                    </div>

                    <div className="w10-task-block">
                        <div className="w10-task-hd">
                            <span className="w10-task-badge">TASK 3</span>
                            <span className="w10-task-title">AI 審查知情同意書（第一節，10 分鐘）</span>
                        </div>
                        <div className="w10-task-body">
                            <ol className="w10-task-ol">
                                <li>複製上方 Prompt，貼入知情同意說明讓 AI 審查。</li>
                                <li>整理 2–3 條建議到學習單 Part 2，並寫下判斷理由。</li>
                                <li>完成最終版知情同意書。</li>
                            </ol>
                        </div>
                    </div>

                    <div className="w10-task-block">
                        <div className="w10-task-hd">
                            <span className="w10-task-badge">TASK 4</span>
                            <span className="w10-task-title">研究執行計畫書（第二節，25 分鐘）</span>
                        </div>
                        <div className="w10-task-body">
                            <ol className="w10-task-ol">
                                <li>填寫 W11–W12 時程表、設定理想目標與最低底線。</li>
                                <li>針對五種困難寫備案：要有具體人、地、時、行動，非空泛話語。</li>
                                <li>選做：問 AI 此備案是否夠具體？如何更精確？</li>
                            </ol>
                        </div>
                    </div>
                </div>
            </section>

            {/* Wrapup SECTION */}
            <section className="mb-24">
                <div className="w10-section-head">
                    <h2 className="w10-section-title">本週總結</h2>
                    <div className="w10-section-line"></div>
                    <span className="w10-section-tag">WRAP-UP</span>
                </div>

                <div className="w10-summary-box">
                    <div className="w10-summary-hd">✅ 今天結束，你應該有</div>
                    <div className="w10-summary-grid">
                        <div className="w10-summary-item"><CheckCircle2 size={16} className="text-[#2e7d5a] mt-0.5 shrink-0" /> 倫理四問自查完成，教師蓋章通過</div>
                        <div className="w10-summary-item border-l border-[#dddbd5]"><CheckCircle2 size={16} className="text-[#2e7d5a] mt-0.5 shrink-0" /> 知情同意書最終版（AI 審查後修改）</div>
                        <div className="w10-summary-item border-t border-[#dddbd5]"><CheckCircle2 size={16} className="text-[#2e7d5a] mt-0.5 shrink-0" /> 研究執行計畫書（含具體備案）</div>
                        <div className="w10-summary-item border-l border-t border-[#dddbd5]"><CheckCircle2 size={16} className="text-[#2e7d5a] mt-0.5 shrink-0" /> 施測宣告完成，黑板出發表打卡 ✈️</div>
                    </div>
                </div>

                <div className="w10-summary-box">
                    <div className="w10-summary-hd">📋 課後作業</div>
                    <div className="w10-hw-list">
                        <div className="w10-hw-item">
                            <span className="w10-hw-part">上傳表單</span>
                            <span className="w10-hw-name">W10 學習單（全部完成）上傳 Google Classroom</span>
                        </div>
                        <div className="w10-hw-item">
                            <span className="w10-hw-part">工具定稿</span>
                            <span className="w10-hw-name">包含知情同意書的正式施測版本上傳。</span>
                        </div>
                        <div className="w10-hw-item">
                            <span className="w10-hw-part">開始施測</span>
                            <span className="w10-hw-name">按計畫 W11 課前就可以開始發問卷/約訪。不要等到上課才動。</span>
                        </div>
                    </div>
                </div>

                <div className="w10-next-week mt-8">
                    <div className="flex items-center gap-3 px-6 py-4 border-b border-white/10">
                        <Map size={18} />
                        <span className="font-bold text-[15px]">W11–W12 執行週：全力蒐集資料</span>
                    </div>
                    <div className="w10-next-grid">
                        <div className="w10-next-item">
                            <div className="w10-next-label">W11 研究診所 I</div>
                            <div className="w10-next-text">Open Office 模式，帶上資料進度隨時個別指導。</div>
                        </div>
                        <div className="w10-next-item">
                            <div className="w10-next-label">W12 研究診所 II</div>
                            <div className="w10-next-text">3 分鐘中期報告進度，並持續更新研究日誌。</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pagination */}
            <div className="flex justify-between items-center py-12 border-t border-[#dddbd5] mt-12">
                <Link to="/tool-refinement" className="flex items-center gap-2 text-[#8888aa] hover:text-[#1a1a2e] transition-colors text-[13px] font-bold no-underline">
                    <ChevronRight size={16} className="rotate-180" /> ← 回 W9 工具精進
                </Link>
                <Link to="/w11" className="flex items-center gap-2 bg-[#1a1a2e] text-white px-6 py-3 rounded-lg hover:bg-[#2a2a4a] transition-colors text-[13px] font-bold no-underline">
                    前往 W11 研究診所 I →
                </Link>
            </div>
        </div>
    );
};
