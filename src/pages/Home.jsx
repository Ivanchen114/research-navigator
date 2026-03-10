import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  BookOpen,
  Target,
  Compass,
  Users,
  Stethoscope,
  Gamepad2,
  Wrench,
  Microscope,
  FlaskConical,
  BarChart2,
  FileText,
  Palette,
  Trophy,
  Zap,
  ChevronRight,
  ArrowRight
} from 'lucide-react';

export const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="home-container animate-in fade-in duration-700">
      <style dangerouslySetInnerHTML={{
        __html: `
                @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+TC:wght@400;600;700&family=Noto+Sans+TC:wght@300;400;500;700&family=DM+Mono:ital,wght@0,400;0,500;1,400&display=swap');

                :root {
                  --ink: #1a1a2e;
                  --ink-mid: #4a4a6a;
                  --ink-light: #9090b0;
                  --paper: #f7f5f0;
                  --paper-warm: #edeae2;
                  --accent: #2d5be3;
                  --accent-light: #e8eeff;
                  --gold: #c9a84c;
                  --gold-pale: #faf5e4;
                  --success: #2e7d5a;
                  --success-light: #e8f5ee;
                  --border: #d8d4ca;
                  --border-light: #e8e4dc;
                }

                .home-container {
                  font-family: 'Noto Sans TC', sans-serif;
                  background: var(--paper);
                  color: var(--ink);
                  min-height: 100vh;
                  background-image: radial-gradient(circle, #c8c4ba 1px, transparent 1px);
                  background-size: 28px 28px;
                  background-attachment: fixed;
                }

                .inner { max-width: 940px; margin: 0 auto; padding: 0 40px; }

                /* ═══ HERO ═══ */
                .hero {
                  background: var(--ink);
                  position: relative;
                  overflow: hidden;
                  margin-bottom: 56px;
                }
                .hero::before {
                  content: '';
                  position: absolute; inset: 0;
                  background-image: repeating-linear-gradient(
                    -55deg, transparent, transparent 40px,
                    rgba(255,255,255,0.018) 40px, rgba(255,255,255,0.018) 41px
                  );
                  pointer-events: none;
                }
                .hero-inner {
                  max-width: 940px; margin: 0 auto;
                  padding: 80px 40px 64px;
                  position: relative; z-index: 1;
                  display: grid;
                  grid-template-columns: 1fr auto;
                  gap: 40px;
                  align-items: end;
                }
                .hero-left { max-width: 580px; }
                .hero-kicker {
                  font-family: 'DM Mono', monospace;
                  font-size: 10px; letter-spacing: 0.18em;
                  color: rgba(255,255,255,0.3);
                  text-transform: uppercase;
                  margin-bottom: 24px;
                  display: flex; align-items: center; gap: 10px;
                }
                .hero-kicker::before {
                  content: '';
                  display: inline-block; width: 20px; height: 1px;
                  background: rgba(255,255,255,0.25);
                }
                .hero h1 {
                  font-family: 'Noto Serif TC', serif;
                  font-size: 48px; font-weight: 700;
                  line-height: 1.15; letter-spacing: -0.025em;
                  color: #fff; margin-bottom: 24px;
                }
                .hero h1 .hl {
                  color: var(--gold);
                }
                .hero-sub {
                  font-size: 15px; color: rgba(255,255,255,0.5);
                  line-height: 1.8; max-width: 480px;
                }
                .hero-stats {
                  display: grid; grid-template-columns: 1fr 1fr;
                  gap: 1px; background: rgba(255,255,255,0.06);
                  border: 1px solid rgba(255,255,255,0.08);
                  border-radius: 10px; overflow: hidden;
                  align-self: end; min-width: 220px;
                }
                .stat {
                  padding: 18px 20px;
                  background: rgba(255,255,255,0.03);
                }
                .stat-n {
                  font-family: 'DM Mono', monospace;
                  font-size: 24px; font-weight: 500;
                  color: #fff; line-height: 1;
                  margin-bottom: 4px;
                }
                .stat-label {
                  font-size: 10px; color: rgba(255,255,255,0.35);
                  white-space: nowrap;
                }

                 /* Mission strip */
                .wc-mission {
                  border-top: 1px solid rgba(0,0,0,0.04);
                  background: var(--ink);
                  padding: 9px 16px;
                  display: flex; align-items: center; gap: 8px;
                  text-decoration: none; cursor: pointer;
                  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
                  position: relative;
                  overflow: hidden;
                }
                .wc-mission::before {
                  content: '';
                  position: absolute; top: 0; left: -100%; width: 60%; height: 100%;
                  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.07), transparent);
                  transition: 0.6s ease;
                }
                .wc-mission:hover::before { left: 140%; }
                .wc-mission:hover { 
                  background: #252540;
                }
                .wm-bolt { 
                  font-size: 11px; flex-shrink: 0; 
                  color: #c9a84c;
                  animation: flicker 2.5s ease-in-out infinite;
                }
                @keyframes flicker {
                  0%, 100% { opacity: 1; }
                  50% { opacity: 0.5; }
                }
                .wm-tag {
                  font-family: 'DM Mono', monospace; font-size: 8px; font-weight: 700;
                  color: #c9a84c; letter-spacing: 0.14em; flex-shrink: 0; text-transform: uppercase;
                  background: rgba(201, 168, 76, 0.12);
                  padding: 2px 7px; border-radius: 2px;
                  border: 1px solid rgba(201, 168, 76, 0.25);
                }
                .wm-sep { color: rgba(255,255,255,0.12); font-size: 10px; flex-shrink: 0; }
                .wm-name { font-size: 10.5px; font-weight: 600; color: rgba(255,255,255,0.75); flex: 1; line-height: 1.3; letter-spacing: 0.025em; }
                .wm-arrow {
                  font-family: 'DM Mono', monospace; font-size: 12px;
                  color: rgba(255,255,255,0.25); flex-shrink: 0; 
                  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), color 0.2s;
                }
                .wc-mission:hover .wm-arrow { transform: translateX(5px); color: #c9a84c; }
                .wc-mission:hover .wm-name { color: rgba(255,255,255,0.95); }


                /* ═══ QUICK JUMP ═══ */
                .jump-grid {
                  display: grid; grid-template-columns: repeat(3, 1fr);
                  gap: 1px; background: var(--border);
                  border: 1px solid var(--border);
                  border-radius: 10px; overflow: hidden;
                  margin-bottom: 64px;
                }
                .jump-card {
                  background: #fff; padding: 24px 24px 22px;
                  text-decoration: none; color: inherit;
                  display: flex; flex-direction: column;
                  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .jump-card:hover { background: #fdfcfa; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.03); }
                .jump-card.primary { background: var(--ink); }
                .jump-card.primary:hover { background: #242436; }
                .j-eyebrow {
                  display: flex; align-items: center; gap: 8px;
                  margin-bottom: 14px;
                }
                .j-step {
                  font-family: 'DM Mono', monospace; font-size: 10px;
                  font-weight: 700; color: var(--accent);
                  text-transform: uppercase; letter-spacing: 0.06em;
                }
                .jump-card.primary .j-step { color: var(--gold); }
                .j-range {
                  font-family: 'DM Mono', monospace; font-size: 10px;
                  color: var(--ink-light); background: var(--paper-warm);
                  padding: 1px 6px; border-radius: 3px;
                }
                .jump-card.primary .j-range { background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.4); }
                .j-title {
                  font-family: 'Noto Serif TC', serif;
                  font-size: 17px; font-weight: 700;
                  color: var(--ink); margin-bottom: 10px; line-height: 1.3;
                }
                .jump-card.primary .j-title { color: #fff; }
                .j-desc {
                  font-size: 12px; color: var(--ink-mid);
                  line-height: 1.8; flex: 1;
                }
                .jump-card.primary .j-desc { color: rgba(255,255,255,0.5); }
                .j-cta {
                  margin-top: 18px;
                  font-family: 'DM Mono', monospace; font-size: 11px;
                  color: var(--accent); font-weight: 700;
                  display: flex; align-items: center; gap: 4px;
                }
                .jump-card.primary .j-cta { color: var(--gold); }

                /* ═══ ROADMAP ═══ */
                .roadmap { display: flex; flex-direction: column; gap: 2px; margin-bottom: 64px; }

                .phase { border: 1px solid var(--border); border-radius: 10px; overflow: hidden; }
                .phase + .phase { margin-top: 12px; }

                .phase-head {
                  background: var(--ink); padding: 14px 22px;
                  display: flex; align-items: center; gap: 14px;
                  position: relative;
                }
                .ph-num {
                  font-family: 'DM Mono', monospace; font-size: 10px;
                  color: rgba(255,255,255,0.3); letter-spacing: 0.1em;
                  text-transform: uppercase;
                }
                .ph-divider { width: 1px; height: 12px; background: rgba(255,255,255,0.12); }
                .ph-title {
                  font-family: 'Noto Serif TC', serif;
                  font-size: 15px; font-weight: 700; color: #fff;
                }
                .ph-range {
                  font-family: 'DM Mono', monospace; font-size: 10px;
                  color: var(--gold); margin-left: auto;
                  background: rgba(201,168,76,0.12);
                  padding: 2px 8px; border-radius: 3px;
                }

                /* Week grid */
                .week-grid { display: grid; gap: 1px; background: var(--border-light); }
                .wg-3 { grid-template-columns: repeat(3, 1fr); }
                .wg-4 { grid-template-columns: repeat(4, 1fr); }
                .wg-6 { grid-template-columns: repeat(6, 1fr); }

                /* Week card — normal */
                .week-card {
                  background: #fff;
                  display: flex; flex-direction: column;
                  transition: all 0.15s ease;
                }
                .week-card:hover { background: #fdfcfa; z-index: 2; position: relative; }

                .wc-body {
                  padding: 20px 22px 18px;
                  flex: 1; display: flex; flex-direction: column;
                  cursor: pointer; text-decoration: none; color: inherit;
                }
                .wc-num {
                  font-family: 'DM Mono', monospace;
                  font-size: 11px; font-weight: 500; letter-spacing: 0.08em;
                  color: var(--ink-light);
                  margin-bottom: 12px;
                  display: flex; align-items: center; gap: 8px;
                }
                .wc-num::after { content: ''; flex: 1; height: 1px; background: var(--border-light); }
                .wc-icon { font-size: 18px; margin-bottom: 8px; line-height: 1; display: flex; align-items: center; }
                .wc-title { font-size: 13px; font-weight: 700; color: var(--ink); line-height: 1.4; margin-bottom: 6px; }
                .wc-desc { font-size: 11px; color: var(--ink-mid); line-height: 1.6; flex: 1; }
                .wc-goto {
                  font-family: 'DM Mono', monospace; font-size: 9px;
                  color: var(--accent); margin-top: 10px;
                  opacity: 0; transition: all 0.2s; letter-spacing: 0.06em;
                  display: flex; align-items: center; gap: 4px;
                }
                .week-card:hover .wc-goto { opacity: 1; transform: translateX(2px); }

                /* Week card — 實作週 (implementation) */
                .week-card.impl {
                  background: var(--paper-warm);
                  pointer-events: none;
                }
                .week-card.impl .wc-body { cursor: default; }
                .week-card.impl .wc-num { color: var(--success); }
                .week-card.impl .wc-num::after { background: rgba(46,125,90,0.15); }
                .week-card.impl .wc-icon { filter: grayscale(0.3); opacity: 0.7; }
                .week-card.impl .wc-title { color: var(--ink-mid); }
                .week-card.impl .wc-desc { color: var(--ink-light); }
                .impl-badge {
                  margin: 0 16px 16px;
                  display: flex; align-items: center; gap: 6px;
                  padding: 6px 12px;
                  background: rgba(46,125,90,0.08);
                  border: 1px solid rgba(46,125,90,0.18);
                  border-radius: 5px;
                }
                .impl-dot {
                  width: 6px; height: 6px; border-radius: 50%;
                  background: var(--success); flex-shrink: 0;
                  animation: pulse 2s infinite;
                }
                @keyframes pulse {
                  0%, 100% { opacity: 1; scale: 1; }
                  50% { opacity: 0.4; scale: 0.8; }
                }
                .impl-text {
                  font-family: 'DM Mono', monospace; font-size: 9px;
                  color: var(--success); letter-spacing: 0.08em;
                  text-transform: uppercase; font-weight: 700;
                }
                .impl-sub {
                  font-size: 10px; color: #5aaa80; margin-left: auto;
                }

                /* ═══ AI-RED ═══ */
                .ai-red {
                  border: 1px solid var(--border); border-radius: 12px;
                  overflow: hidden; margin-bottom: 64px;
                  background: #fff;
                }
                .ar-head {
                  background: var(--ink); padding: 16px 24px;
                  display: flex; align-items: center; gap: 14px;
                }
                .ar-badge {
                  font-family: 'DM Mono', monospace; font-size: 10px;
                  background: rgba(255,255,255,0.07); color: rgba(255,255,255,0.35);
                  border: 1px solid rgba(255,255,255,0.1);
                  padding: 2px 8px; border-radius: 3px; letter-spacing: 0.1em;
                }
                .ar-title { font-size: 14px; font-weight: 700; color: #fff; }
                .ar-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 1px; background: var(--border-light); }
                .ar-cell { background: #fff; padding: 24px 22px 20px; }
                .ar-letter {
                  font-family: 'DM Mono', monospace; font-size: 36px; font-weight: 500;
                  color: #e4e0d8; line-height: 1; margin-bottom: 12px;
                }
                .ar-en { font-size: 11px; font-weight: 700; color: var(--accent); margin-bottom: 4px; letter-spacing: 0.04em; text-transform: uppercase; }
                .ar-zh { font-size: 13px; font-weight: 700; color: var(--ink); margin-bottom: 8px; }
                .ar-desc { font-size: 12px; color: var(--ink-mid); line-height: 1.7; }

                /* ═══ FOOTER ═══ */
                .site-footer {
                  border-top: 1px solid var(--border);
                  padding: 32px 0 56px;
                  display: flex; align-items: center; justify-content: space-between;
                }
                .footer-brand {
                  font-family: 'DM Mono', monospace; font-size: 11px;
                  color: var(--ink-light); letter-spacing: 0.06em;
                  display: flex; align-items: center; gap: 8px;
                }
                .footer-version {
                  font-family: 'DM Mono', monospace; font-size: 10px;
                  background: var(--ink); color: rgba(255,255,255,0.5);
                  padding: 3px 10px; border-radius: 4px;
                }

                @media (max-width: 900px) {
                  .jump-grid { grid-template-columns: 1fr; }
                  .wg-3, .wg-4, .wg-6 { grid-template-columns: repeat(2, 1fr); }
                  .ar-grid { grid-template-columns: repeat(2, 1fr); }
                  .hero-inner { grid-template-columns: 1fr; }
                  .hero h1 { font-size: 36px; }
                }
                @media (max-width: 600px) {
                  .wg-3, .wg-4, .wg-6 { grid-template-columns: 1fr; }
                  .ar-grid { grid-template-columns: 1fr; }
                  .inner { padding: 0 24px; }
                  .hero-inner { padding: 60px 24px 48px; }
                }
                `
      }} />

      {/* HERO */}
      <div className="hero">
        <div className="hero-inner">
          <div className="hero-left">
            <div className="hero-kicker">SSSH &nbsp;·&nbsp; 研究方法與專題 &nbsp;·&nbsp; 高一必修</div>
            <h1>從發現問題<br />到解讀結論，<br /><span className="hl">AI 陪你做研究</span></h1>
            <p className="hero-sub">這不是幫你寫作業的工具，而是你的研究教練。透過人機協作，把複雜的研究方法變得像通關遊戲一樣有跡可循。</p>
          </div>
          <div className="hero-stats">
            <div className="stat"><div className="stat-n">W0–W16</div><div className="stat-label">課程週次</div></div>
            <div className="stat"><div className="stat-n">4</div><div class="stat-label">學習階段</div></div>
            <div className="stat"><div className="stat-n">6</div><div class="stat-label">互動任務</div></div>
            <div className="stat"><div className="stat-n">5</div><div class="stat-label">AI-RED 原則</div></div>
          </div>
        </div>
      </div>

      <div className="inner">

        {/* QUICK JUMP */}
        <div className="section-head">
          <h2>快速入口</h2>
          <div className="line"></div>
          <span className="tag">Quick Jump</span>
        </div>
        <div className="jump-grid">
          <Link className="jump-card" to="/w2">
            <div className="j-eyebrow"><span className="j-step">Step 01</span><span className="j-range">W0 – W2</span></div>
            <div className="j-title">我還沒有題目</div>
            <div className="j-desc">從觀察力開始，鍛鍊「看見問題」的直覺，找出你真正想研究的問題。</div>
            <div className="j-cta">前往 W2 <ArrowRight size={14} /></div>
          </Link>
          <Link className="jump-card" to="/w3">
            <div className="j-eyebrow"><span className="j-step">Step 02</span><span className="j-range">W3 – W10</span></div>
            <div className="j-title">我要選研究方法</div>
            <div className="j-desc">8 種病例速查，三問法找到對的研究方法，工具設計、AI 審稿一站搞定。</div>
            <div className="j-cta">題目健檢 <ArrowRight size={14} /></div>
          </Link>
          <Link className="jump-card primary" to="/w13">
            <div className="j-eyebrow"><span className="j-step">Step 03</span><span className="j-range">W13 – W16</span></div>
            <div className="j-title">我有資料，但不知道怎麼分析</div>
            <div className="j-desc">數據轉譯、圖表選擇、四層結論寫作、海報設計全流程。</div>
            <div className="j-cta">前往 W13 <ArrowRight size={14} /></div>
          </Link>
        </div>

        {/* COURSE MAP */}
        <div className="section-head">
          <h2>課程地圖</h2>
          <div className="line"></div>
          <span className="tag">Course Roadmap · W0 – W16</span>
        </div>

        <div className="roadmap">

          {/* Phase 1 問題意識 W0–W2 */}
          <div className="phase">
            <div className="phase-head">
              <span className="ph-num">Phase 01</span>
              <span className="ph-divider"></span>
              <span className="ph-title">問題意識</span>
              <span className="ph-range">W0 – W2</span>
            </div>
            <div className="week-grid wg-3">
              <WeekCard num="W0" icon={<Search size={18} className="text-[#9090b0]" />} title="偵探特訓班" desc="研究思維入門，培養觀察力與問題意識。" path="/w0" />
              <WeekCard num="W1" icon={<BookOpen size={18} className="text-[#9090b0]" />} title="模仿遊戲" desc="認識 AI-RED 人機協作法則，建立協作倫理。" path="/w1" />
              <WeekCard num="W2" icon={<Target size={18} className="text-[#9090b0]" />} title="問題意識的覺醒" desc="把觀察到的現象轉化成可以研究的問題。" path="/w2" />
            </div>
          </div>

          {/* Phase 2 研究規劃 W3–W6 */}
          <div className="phase">
            <div className="phase-head">
              <span className="ph-num">Phase 02</span>
              <span className="ph-divider"></span>
              <span className="ph-title">研究規劃</span>
              <span className="ph-range">W3 – W6</span>
            </div>
            <div className="week-grid wg-4">
              <WeekCard num="W3" icon={<Compass size={18} className="text-[#9090b0]" />} title="題目健檢" desc="8 種病例速查，用三問法找到對的研究方法。" path="/w3" mission={{ tag: 'BULLSEYE', name: '行動代號：靶心', path: '/game/question-er' }} />
              <WeekCard num="W4" icon={<Palette size={18} className="text-[#9090b0]" />} title="題目博覽會" desc="辦一場個人展覽，讓同學幫你把關研究方向。" path="/w4" />
              <WeekCard num="W5" icon={<BookOpen size={18} className="text-[#9090b0]" />} title="文獻偵探社" desc="辨別文獻可信度，建立正確引用規範。" path="/w5" mission={{ tag: 'MISSION', name: '行動代號：獵狐', path: '/game/citation-detective' }} />
              <WeekCard num="W6" icon={<Stethoscope size={18} className="text-[#9090b0]" />} title="研究診所" desc="依研究方法分流，深入學習各方法特性。" path="/w6" mission={{ tag: 'GEAR', name: '行動代號：裝備', path: '/game/tool-quiz' }} />
            </div>
          </div>

          {/* Phase 3 裝備執行 W7–W12 */}
          <div className="phase">
            <div className="phase-head">
              <span className="ph-num">Phase 03</span>
              <span className="ph-divider"></span>
              <span className="ph-title">裝備執行</span>
              <span className="ph-range">W7 – W12</span>
            </div>
            <div className="week-grid wg-6">
              <WeekCard num="W7" icon={<Users size={18} className="text-[#9090b0]" />} title="組隊決策週" desc="找能力互補的夥伴，或宣告 Solo 研究。" path="/w7" />
              <WeekCard num="W8" icon={<Wrench size={18} className="text-[#9090b0]" />} title="工具設計" desc="問卷、訪談、實驗各組深化工具設計。" path="/tool-design" mission={{ tag: 'MISSION', name: '行動代號：防線', path: '/game/rx-inspector' }} />
              <WeekCard num="W9" icon={<Microscope size={18} className="text-[#9090b0]" />} title="工具精進" desc="AI 審稿 + 人工預試雙重把關，工具定稿。" path="/w9" />
              <WeekCard num="W10" icon={<FlaskConical size={18} className="text-[#9090b0]" />} title="倫理審查" desc="四問自查、知情同意書 AI 審查、蓋章出發。" path="/w10" />
              <ImplWeek num="W11" title="研究診所 I" desc="Open Office 執行週，資料蒐集第一週。" />
              <ImplWeek num="W12" title="研究診所 II" desc="中期進度盤點，最後衝刺，資料收齊。" />
            </div>
          </div>

          {/* Phase 4 分析報告 W13–W16 */}
          <div className="phase">
            <div className="phase-head">
              <span className="ph-num">Phase 04</span>
              <span className="ph-divider"></span>
              <span className="ph-title">分析報告</span>
              <span className="ph-range">W13 – W16</span>
            </div>
            <div className="week-grid wg-4">
              <WeekCard num="W13" icon={<BarChart2 size={18} className="text-[#9090b0]" />} title="數據轉譯" desc="四大圖表選擇、格式規範、描述＋詮釋寫作。" path="/w13" mission={{ tag: 'DECADE', name: '行動代號：解碼', path: '/game/chart-matcher' }} />
              <WeekCard num="W14" icon={<FileText size={18} className="text-[#9090b0]" />} title="研究結論" desc="四層結論寫作：描述、詮釋、回扣文獻、批判限制。" path="/w14" mission={{ tag: 'FILTER', name: '行動代號：濾鏡', path: '/game/data-detective' }} />
              <WeekCard num="W15" icon={<Palette size={18} className="text-[#9090b0]" />} title="簡報與海報" desc="七章報告組裝、AI 潤色縫合、海報設計。" path="/w15" />
              <WeekCard num="W16" icon={<Trophy size={18} className="text-[#9090b0]" />} title="成果發表" desc="策展人登場，A/B 組輪替，學術投資貼紙。" path="/w16" />
            </div>
          </div>

        </div>

        {/* AI-RED FRAMEWORK */}
        <div className="section-head">
          <h2>AI-RED 學習框架</h2>
          <div className="line"></div>
          <span className="tag">貫穿全課程</span>
        </div>

        <div className="ai-red">
          <div className="ar-head">
            <span className="ar-badge">AI-RED V2.0.4</span>
            <span className="ar-title">每次使用 AI，你都應該走過這五步</span>
          </div>
          <div className="ar-grid">
            <AIRedCell letter="A" en="Ascribe" zh="指定角色" desc="告訴 AI 它在這個任務中是誰，設定正確的協作框架。" />
            <AIRedCell letter="I" en="Inquire" zh="精準提問" desc="用具體、有脈絡的問題取代模糊指令，才能得到有用的回應。" />
            <AIRedCell letter="R" en="Reference" zh="提供素材" desc="把你的原始資料、數據、草稿餵給 AI，讓它有東西可以工作。" />
            <AIRedCell letter="E" en="Evaluate" zh="批判評估" desc="AI 給的每一行都要過你的腦，對的留、錯的改、沒有的補。" />
            <AIRedCell letter="D" en="Document" zh="記錄裁奪" desc="把你「接受了什麼、拒絕了什麼、為什麼」寫下來。這才是學習的痕跡。" />
          </div>
        </div>

        {/* FOOTER */}
        <div className="site-footer">
          <div className="footer-brand">SSSH · 研究方法與專題 · 松山高中</div>
          <div className="footer-version">AI-RED V2.0.4</div>
        </div>

      </div>
    </div>
  );
};

const WeekCard = ({ num, icon, title, desc, path, mission }) => (
  <div className="week-card">
    <Link className="wc-body" to={path}>
      <div className="wc-num">{num}</div>
      <div className="wc-icon">{icon}</div>
      <div className="wc-title">{title}</div>
      <div className="wc-desc">{desc}</div>
      <div className="wc-goto">進入週次 <ChevronRight size={10} /></div>
    </Link>
    {mission && (
      <Link className="wc-mission" to={mission.path}>
        <Zap className="wm-bolt text-[#c9a030]" size={10} />
        <span className="wm-tag">{mission.tag}</span>
        <span className="wm-sep">/</span>
        <span className="wm-name">{mission.name}</span>
        <span className="wm-arrow">→</span>
      </Link>
    )}
  </div>
);

const ImplWeek = ({ num, title, desc }) => (
  <div className="week-card impl">
    <div className="wc-body">
      <div className="wc-num">{num}</div>
      <div className="wc-icon">🚀</div>
      <div className="wc-title">{title}</div>
      <div className="wc-desc">{desc}</div>
    </div>
    <div className="impl-badge">
      <span className="impl-dot"></span>
      <span className="impl-text">實作週</span>
      <span className="impl-sub">無教材</span>
    </div>
  </div>
);

const AIRedCell = ({ letter, en, zh, desc }) => (
  <div className="ar-cell">
    <div className="ar-letter">{letter}</div>
    <div className="ar-en">{en}</div>
    <div className="ar-zh">{zh}</div>
    <div className="ar-desc">{desc}</div>
  </div>
);
