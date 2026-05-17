import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Home.css';
import {
    Search,
    BookOpen,
    Target,
    Compass,
    Map,
    Users,
    Stethoscope,
    Wrench,
    Microscope,
    FlaskConical,
    BarChart2,
    FileText,
    Palette,
    Trophy,
    Zap,
    Rocket,
    ChevronRight,
    ArrowRight,
} from 'lucide-react';

export const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="home-container animate-in fade-in duration-700">
      {/* 樣式抽到 Home.css（已 import）*/}

      {/* HERO */}
      <div className="hero">
        <div className="hero-inner">
          <div className="hero-left">
            <div className="hero-kicker">SSSH &nbsp;·&nbsp; 研究方法與專題 &nbsp;·&nbsp; 高一必修</div>
            <h1>松山高中<br /><span className="hl">研究方法與專題</span><br />學會提問、判斷與研究表達</h1>
            <p className="hero-sub">AI 可以協助整理資料、改寫文字、產生草稿。但<strong>研究問題、證據判斷與最後結論，仍然要由你負責</strong>——這個網站陪你走完 18 週，把複雜的研究方法變得有跡可循。</p>
          </div>
          <div className="hero-stats">
            <div className="stat"><div className="stat-n">W0–W17</div><div className="stat-label">課程週次</div></div>
            <div className="stat"><div className="stat-n">4</div><div className="stat-label">學習階段</div></div>
            <div className="stat"><div className="stat-n">6</div><div className="stat-label">互動任務</div></div>
            <div className="stat"><div className="stat-n">5</div><div className="stat-label">AI-RED 原則</div></div>
          </div>
        </div>
      </div>

      <div className="inner">

        {/* MISSION · 為什麼這門課 */}
        <div style={{
          background: 'linear-gradient(135deg, #1a1a2e 0%, #1E293B 100%)',
          color: '#fff',
          borderRadius: 12,
          padding: '40px 32px',
          marginBottom: 48,
          marginTop: 8,
          boxShadow: '0 12px 40px rgba(0,0,0,0.18)',
        }}>
          <div style={{
            fontSize: 11,
            fontFamily: 'var(--font-mono)',
            letterSpacing: '0.2em',
            color: '#FCD34D',
            textTransform: 'uppercase',
            fontWeight: 700,
            marginBottom: 12,
          }}>
            🎯 這門課為什麼存在
          </div>
          <h2 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 26,
            lineHeight: 1.45,
            fontWeight: 700,
            color: '#fff',
            marginBottom: 16,
            letterSpacing: '-0.01em',
          }}>
            AI 已經能幫你寫出漂亮的研究報告了。<br />
            但你看得出它哪裡錯嗎？敢挑戰它的結論嗎？
          </h2>
          <p style={{
            fontSize: 15,
            lineHeight: 1.95,
            color: 'rgba(255,255,255,0.88)',
            marginBottom: 20,
          }}>
            17 週後你帶走的不是一份研究，
            是「<strong style={{ color: '#FCD34D' }}>不會輕易相信任何答案</strong>」的能力。
            我們把這個能力叫做「<strong style={{ color: '#FCD34D' }}>裁決力</strong>」——AI 時代真正的剛性能力。
          </p>
          <div style={{
            background: 'rgba(255,255,255,0.08)',
            borderRadius: 8,
            padding: '20px 24px',
            marginTop: 8,
          }}>
            <div style={{
              fontSize: 12,
              fontFamily: 'var(--font-mono)',
              color: '#FCD34D',
              fontWeight: 700,
              marginBottom: 12,
              letterSpacing: '0.1em',
            }}>三大目標 · 裁決力的三個練習對象</div>
            <ul style={{
              fontSize: 13.5,
              lineHeight: 2.0,
              color: 'rgba(255,255,255,0.92)',
              listStyle: 'none',
              padding: 0,
              margin: 0,
            }}>
              <li>① <strong style={{ color: '#fff' }}>判斷外部資訊</strong>：AI、新聞、文獻、網紅引用——能問「樣本？因果？還是相關？」</li>
              <li>② <strong style={{ color: '#fff' }}>檢查自己的說法</strong>：寫研究時能指出「我這話不能說，因為 ___」</li>
              <li>③ <strong style={{ color: '#fff' }}>管理協作過程</strong>：能挑 AI 輸出的雷、能給同學具體可行動的建議</li>
            </ul>
          </div>
          <p style={{
            fontSize: 12,
            fontStyle: 'italic',
            color: 'rgba(255,255,255,0.55)',
            marginTop: 20,
            paddingTop: 16,
            borderTop: '1px solid rgba(255,255,255,0.15)',
          }}>
            💡 這門課不是教你背步驟、不是教你寫漂亮報告，
            是教你「<strong style={{ color: 'rgba(255,255,255,0.9)' }}>在 AI 介入下，保有自己判斷力</strong>」。
          </p>
        </div>

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
            <div className="j-eyebrow"><span className="j-step">Step 02</span><span className="j-range">W3 – W8</span></div>
            <div className="j-title">我在規劃研究</div>
            <div className="j-desc">8 種病例速查、三問法選方法、文獻探討、組隊決策——研究藍圖一次規劃完。</div>
            <div className="j-cta">題目健檢 <ArrowRight size={14} /></div>
          </Link>
          <Link className="jump-card" to="/w9">
            <div className="j-eyebrow"><span className="j-step">Step 03</span><span className="j-range">W9 – W13</span></div>
            <div className="j-title">我要進場收資料</div>
            <div className="j-desc">工具設計與精進、AI 倫理審查、資料蒐集執行週的完整支援。</div>
            <div className="j-cta">前往 W9 <ArrowRight size={14} /></div>
          </Link>
          <Link className="jump-card" to="/w14">
            <div className="j-eyebrow"><span className="j-step">Step 04</span><span className="j-range">W14 – W17</span></div>
            <div className="j-title">我有資料要分析</div>
            <div className="j-desc">數據轉譯、圖表選擇、四層結論寫作、海報設計全流程。</div>
            <div className="j-cta">前往 W14 <ArrowRight size={14} /></div>
          </Link>
          <Link className="jump-card primary full" style={{ background: '#4f46e5' }} to="/prompt-lab">
            <div className="j-eyebrow"><span className="j-step text-[#c7d2fe]">NEW Tool</span><span className="j-range bg-[#4338ca] text-[#a5b4fc] border-none">V2.0</span></div>
            <div className="j-title text-white">AI-RED Prompt 實驗室</div>
            <div className="j-desc text-indigo-100">人機協作專用的提問產生器，幫你寫出高品質的研究指令。</div>
            <div className="j-cta text-[#fbbf24]">進入實驗室 <Zap size={14} /></div>
          </Link>
        </div>

        {/* COURSE MAP */}
        <div className="section-head">
          <h2>課程地圖</h2>
          <div className="line"></div>
          <span className="tag">Course Roadmap · W0 – W17</span>
        </div>

        <div className="roadmap">

          {/* Phase 1 問題意識 W0–W3 */}
          <div className="phase">
            <div className="phase-head">
              <span className="ph-num">階段一</span>
              <span className="ph-divider"></span>
              <span className="ph-title">問題意識</span>
              <span className="ph-range">W0 – W3</span>
            </div>
            <div className="week-grid wg-4">
              <WeekCard num="W0" icon={<Search size={18} className="text-[#9090b0]" />} title="偵探特訓班" desc="研究思維入門，培養觀察力與問題意識。" path="/w0" />
              <WeekCard num="W1" icon={<BookOpen size={18} className="text-[#9090b0]" />} title="模仿遊戲" desc="認識 AI-RED 人機協作法則，建立協作倫理。" path="/w1" />
              <WeekCard num="W2" icon={<Target size={18} className="text-[#9090b0]" />} title="四段式框架" desc="把「為什麼」這種爛問題拆成情境→疑問→範圍→意圖四段。" path="/w2" />
              <WeekCard num="W3" icon={<Compass size={18} className="text-[#9090b0]" />} title="題目健檢" desc="8 種病例速查，用三問法找到對的研究方法。" path="/w3" mission={{ tag: 'BULLSEYE', name: '行動代號：靶心', path: '/game/question-er' }} />
            </div>
          </div>

          {/* Phase 2 研究規劃 W4–W8 */}
          <div className="phase">
            <div className="phase-head">
              <span className="ph-num">階段二</span>
              <span className="ph-divider"></span>
              <span className="ph-title">研究規劃</span>
              <span className="ph-range">W4 – W8</span>
            </div>
            <div className="week-grid wg-5">
              <WeekCard num="W4" icon={<Map size={18} className="text-[#9090b0]" />} title="方法地圖" desc="認識五種研究方法，用兩層判斷的決策樹幫題目找出主方法。" path="/w4" mission={{ tag: 'GEAR', name: '行動代號：裝備', path: '/game/tool-quiz' }} />
              <WeekCard num="W5" icon={<Target size={18} className="text-[#9090b0]" />} title="操作型定義" desc="把抽象概念變成可測指標——5 法各自的操作化策略。" path="/w5" />
              <WeekCard num="W6" icon={<Users size={18} className="text-[#9090b0]" />} title="海報博覽會" desc="A4 海報走讀 + 同儕回饋 + 組隊（Team 合題或 Solo 嚴格 5 項）。" path="/w6" />
              <WeekCard num="W7" icon={<Search size={18} className="text-[#9090b0]" />} title="文獻搜尋" desc="掌握資料庫手動檢索與精準標註 APA 證物標籤。" path="/w7" />
              <WeekCard num="W8" icon={<BookOpen size={18} className="text-[#9090b0]" />} title="文獻偵探社" desc="寫出真正的文獻探討，拆解與組合文獻線索。" path="/w8" mission={{ tag: 'MISSION', name: '行動代號：獵狐', path: '/game/citation-detective' }} />
            </div>
          </div>

          {/* Phase 3 計畫定稿 W9–W10 */}
          <div className="phase">
            <div className="phase-head">
              <span className="ph-num">階段三</span>
              <span className="ph-divider"></span>
              <span className="ph-title">計畫定稿</span>
              <span className="ph-range">W9 – W10</span>
            </div>
            <div className="week-grid wg-4">
              <WeekCard num="W9" icon={<Wrench size={18} className="text-[#9090b0]" />} title="計畫書 1-5 章" desc="五種方法分流，計畫書地基工程：題目／方法／變項／對象。" path="/w9" mission={{ tag: 'MISSION', name: '行動代號：防線', path: '/game/rx-inspector' }} />
              <WeekCard num="W10" icon={<Microscope size={18} className="text-[#9090b0]" />} title="計畫書整本定稿" desc="補完 1-13 章 + 第六章填具體題目 + 整本繳交，老師批改。" path="/w10" />
            </div>
          </div>

          {/* Phase 4 執行檢核 W11–W12 */}
          <div className="phase">
            <div className="phase-head">
              <span className="ph-num">階段四</span>
              <span className="ph-divider"></span>
              <span className="ph-title">執行檢核</span>
              <span className="ph-range">W11 – W12</span>
            </div>
            <div className="week-grid wg-4">
              <WeekCard num="W11" icon={<FlaskConical size={18} className="text-[#9090b0]" />} title="預試與倫理" desc="拿模板填工具 + 座位表一對一預試 + 倫理同意書 + 施測啟動。" path="/w11" />
              <WeekCard num="W12" icon={<Rocket size={18} className="text-[#9090b0]" />} title="期中短報" desc="各組 3min Pitch + 1min QA，全班同儕回饋當擋板。" path="/w12" />
            </div>
          </div>

          {/* Phase 5 分析與發表 W13–W17 */}
          <div className="phase">
            <div className="phase-head">
              <span className="ph-num">階段五</span>
              <span className="ph-divider"></span>
              <span className="ph-title">分析與發表</span>
              <span className="ph-range">W13 – W17</span>
            </div>
            <div className="week-grid wg-5">
              <WeekCard num="W13" icon={<Rocket size={18} className="text-[#9090b0]" />} title="資料整理週" desc="原始資料 → 分析表：5 法對照 + 範本／彙整 + 動手整理 + 繳交 Google Sheet 連結。" path="/w13" />
              <WeekCard num="W14" icon={<BarChart2 size={18} className="text-[#9090b0]" />} title="數據轉譯" desc="四大圖表選擇、格式規範、描述＋詮釋寫作。" path="/w14" mission={{ tag: 'DECADE', name: '行動代號：解碼', path: '/game/chart-matcher' }} />
              <WeekCard num="W15" icon={<FileText size={18} className="text-[#9090b0]" />} title="研究結論" desc="四層結論寫作：描述、詮釋、呼應文獻、批判限制。" path="/w15" mission={{ tag: 'FILTER', name: '行動代號：濾鏡', path: '/game/data-detective' }} />
              <WeekCard num="W16" icon={<Palette size={18} className="text-[#9090b0]" />} title="簡報與海報" desc="七章報告組裝、AI 潤色縫合、海報設計。" path="/w16" />
              <WeekCard num="W17" icon={<Trophy size={18} className="text-[#9090b0]" />} title="成果發表" desc="策展人登場，A/B 組輪替，學術投資貼紙。" path="/w17" />
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
            <span className="ar-title">AI 時代的五項使用準則</span>
          </div>
          <div className="ar-grid">
            <AIRedCell letter="A" en="Ascribe" zh="歸屬" desc="誠實說明哪裡用了 AI。" />
            <AIRedCell letter="I" en="Inquire" zh="提問" desc="精準提問，不依賴模糊指令。" />
            <AIRedCell letter="R" en="Reference" zh="引用" desc="查證 AI 給的資料來源。" />
            <AIRedCell letter="E" en="Evaluate" zh="評估" desc="判斷內容是否合理，不照單全收。" />
            <AIRedCell letter="D" en="Document" zh="紀錄" desc="保留與 AI 的對話紀錄。" />
          </div>
        </div>

        {/* FOOTER */}
        <div className="site-footer">
          <div className="footer-brand">SSSH · 研究方法與專題 · 松山高中</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link to="/about" style={{ fontFamily: "'DM Mono', monospace", fontSize: '11px', color: '#9090b0', textDecoration: 'none', letterSpacing: '0.06em', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = '#2d5be3'} onMouseLeave={e => e.target.style.color = '#9090b0'}>關於本站</Link>
            <div className="footer-version">AI-RED V2.0.4</div>
          </div>
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
