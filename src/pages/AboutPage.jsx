import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Gamepad2,
    Brain,
    BarChart2,
    ArrowLeft,
    BookOpen,
    BookMarked,
} from 'lucide-react';

export const AboutPage = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="about-container animate-in fade-in duration-700">
      <style dangerouslySetInnerHTML={{ __html: `
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
          --border: #d8d4ca;
          --border-light: #e8e4dc;
        }

        .about-container {
          font-family: 'Noto Sans TC', sans-serif;
          background: var(--paper);
          color: var(--ink);
          min-height: 100vh;
          background-image: radial-gradient(circle, #c8c4ba 1px, transparent 1px);
          background-size: 28px 28px;
        }

        .about-inner { max-width: 780px; margin: 0 auto; padding: 0 40px; }

        /* ═══ HERO BANNER ═══ */
        .about-hero {
          background: var(--ink);
          position: relative;
          overflow: hidden;
          margin-bottom: 48px;
        }
        .about-hero::before {
          content: '';
          position: absolute; inset: 0;
          background-image: repeating-linear-gradient(
            -55deg, transparent, transparent 40px,
            rgba(255,255,255,0.018) 40px, rgba(255,255,255,0.018) 41px
          );
          pointer-events: none;
        }
        .about-hero-inner {
          max-width: 780px; margin: 0 auto;
          padding: 64px 40px 52px;
          position: relative; z-index: 1;
        }
        .about-hero .kicker {
          font-family: 'DM Mono', monospace;
          font-size: 10px; letter-spacing: 0.18em;
          color: rgba(255,255,255,0.3);
          text-transform: uppercase;
          margin-bottom: 20px;
          display: flex; align-items: center; gap: 10px;
        }
        .about-hero .kicker::before {
          content: ''; display: inline-block;
          width: 20px; height: 1px;
          background: rgba(255,255,255,0.25);
        }
        .about-hero h1 {
          font-family: 'Noto Serif TC', serif;
          font-size: 36px; font-weight: 700;
          line-height: 1.2; color: #fff;
          margin-bottom: 16px;
        }
        .about-hero h1 .hl { color: var(--gold); }
        .about-hero .lead {
          font-size: 15px; color: rgba(255,255,255,0.5);
          line-height: 1.8; max-width: 560px;
        }

        /* ═══ SECTION ═══ */
        .about-section { margin-bottom: 48px; }
        .about-section h2 {
          font-family: 'Noto Serif TC', serif;
          font-size: 22px; font-weight: 700; color: var(--ink);
          margin-bottom: 8px; display: flex; align-items: center; gap: 10px;
        }
        .about-section h2 .sec-tag {
          font-family: 'DM Mono', monospace;
          font-size: 9px; letter-spacing: 0.12em;
          color: var(--gold); text-transform: uppercase;
          background: var(--gold-pale);
          padding: 2px 8px; border-radius: 3px;
        }
        .about-section .subtitle {
          font-size: 13px; color: var(--ink-light);
          margin-bottom: 20px; line-height: 1.6;
        }

        /* Highlight cards */
        .hl-card {
          background: #fff;
          border: 1px solid var(--border);
          border-radius: 10px;
          padding: 28px 28px 24px;
          margin-bottom: 16px;
          transition: all 0.15s ease;
        }
        .hl-card:hover {
          box-shadow: 0 2px 12px rgba(0,0,0,0.04);
          transform: translateY(-1px);
        }
        .hl-card .card-head {
          display: flex; align-items: center; gap: 12px;
          margin-bottom: 14px;
        }
        .hl-card .card-icon {
          width: 36px; height: 36px;
          border-radius: 8px; display: flex;
          align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .hl-card h3 {
          font-family: 'Noto Serif TC', serif;
          font-size: 16px; font-weight: 700;
          color: var(--ink); line-height: 1.3;
        }
        .hl-card h3 .en {
          font-family: 'DM Mono', monospace;
          font-size: 10px; color: var(--ink-light);
          display: block; margin-top: 2px;
          letter-spacing: 0.05em; font-weight: 400;
        }
        .hl-card p {
          font-size: 14px; color: var(--ink-mid);
          line-height: 1.85;
        }
        .hl-card .example {
          margin-top: 12px; padding: 12px 16px;
          background: var(--paper); border-radius: 6px;
          font-size: 12px; color: var(--ink-mid);
          line-height: 1.7; border-left: 3px solid var(--border);
        }
        .hl-card .example strong {
          color: var(--ink); font-weight: 600;
        }

        /* Purpose layer cards */
        .layer-grid {
          display: grid; grid-template-columns: repeat(3, 1fr);
          gap: 1px; background: var(--border);
          border: 1px solid var(--border);
          border-radius: 10px; overflow: hidden;
        }
        .layer-cell {
          background: #fff; padding: 24px 22px;
        }
        .layer-num {
          font-family: 'DM Mono', monospace;
          font-size: 28px; font-weight: 500;
          color: #e4e0d8; margin-bottom: 8px;
        }
        .layer-title {
          font-size: 15px; font-weight: 700;
          color: var(--ink); margin-bottom: 8px;
        }
        .layer-desc {
          font-size: 12px; color: var(--ink-mid);
          line-height: 1.75;
        }

        /* Stats row */
        .stats-row {
          display: grid; grid-template-columns: repeat(4, 1fr);
          gap: 1px; background: var(--border);
          border: 1px solid var(--border);
          border-radius: 10px; overflow: hidden;
          margin-bottom: 48px;
        }
        .sr-cell {
          background: #fff; padding: 22px 18px;
          text-align: center;
        }
        .sr-n {
          font-family: 'DM Mono', monospace;
          font-size: 28px; font-weight: 500;
          color: var(--ink); margin-bottom: 4px;
        }
        .sr-label {
          font-size: 11px; color: var(--ink-light);
        }

        /* Back link */
        .back-link {
          display: inline-flex; align-items: center; gap: 6px;
          font-family: 'DM Mono', monospace; font-size: 12px;
          color: var(--accent); text-decoration: none;
          margin-bottom: 48px; transition: gap 0.2s;
        }
        .back-link:hover { gap: 10px; }

        /* Footer */
        .about-footer {
          border-top: 1px solid var(--border);
          padding: 32px 0 56px;
          display: flex; align-items: center; justify-content: space-between;
        }
        .footer-brand {
          font-family: 'DM Mono', monospace; font-size: 11px;
          color: var(--ink-light); letter-spacing: 0.06em;
        }
        .footer-version {
          font-family: 'DM Mono', monospace; font-size: 10px;
          background: var(--ink); color: rgba(255,255,255,0.5);
          padding: 3px 10px; border-radius: 4px;
        }

        @media (max-width: 700px) {
          .layer-grid { grid-template-columns: 1fr; }
          .stats-row { grid-template-columns: repeat(2, 1fr); }
          .about-inner { padding: 0 24px; }
          .about-hero-inner { padding: 48px 24px 40px; }
          .about-hero h1 { font-size: 28px; }
        }
      `}} />

      {/* HERO */}
      <div className="about-hero">
        <div className="about-hero-inner">
          <div className="kicker">About &nbsp;·&nbsp; 關於本站</div>
          <h1>不只是教學網站<br />是一座<span className="hl">研究訓練場</span></h1>
          <p className="lead">
            松山高中「研究方法與專題」校訂必修課程的教學輔助平台。
            我們把遊戲化機制寫進學科能力的骨架裡，讓高一學生在通關的過程中，真正學會做研究。
          </p>
        </div>
      </div>

      <div className="about-inner">

        {/* STATS */}
        <div className="stats-row">
          <div className="sr-cell"><div className="sr-n">18</div><div className="sr-label">教學週次</div></div>
          <div className="sr-cell"><div className="sr-n">6</div><div className="sr-label">技能挑戰</div></div>
          <div className="sr-cell"><div className="sr-n">10</div><div className="sr-label">敘事章節</div></div>
          <div className="sr-cell"><div className="sr-n">5</div><div className="sr-label">AI-RED 原則</div></div>
        </div>

        {/* HIGHLIGHT 1: 遊戲化是結構 */}
        <div className="about-section">
          <h2>
            設計亮點
            <span className="sec-tag">Highlights</span>
          </h2>
          <p className="subtitle">這個網站和一般教學平台有什麼不同？</p>

          <div className="hl-card">
            <div className="card-head">
              <div className="card-icon" style={{ background: '#e8eeff' }}>
                <Gamepad2 size={18} color="#2d5be3" />
              </div>
              <h3>遊戲化不是裝飾，而是結構<span className="en">Gamification as Architecture</span></h3>
            </div>
            <p>
              很多教學網站的遊戲化只是貼徽章、加排行榜——本質上還是「做完作業換獎勵」的行為主義套路。
              這個站不一樣：六個技能挑戰各自對應一項研究能力維度，玩的過程本身就是在練能力，不是「練完能力再來玩」。
            </p>
            <div className="example">
              <strong>靶心</strong>練問題聚焦、<strong>獵狐</strong>練引用判斷、<strong>濾鏡</strong>練數據篩選、<strong>防線</strong>練研究倫理、<strong>裝備</strong>練方法選擇、<strong>解碼</strong>練圖表解讀——六個挑戰最終匯入探員檔案的六角能力雷達圖。
            </div>
          </div>

          <div className="hl-card">
            <div className="card-head">
              <div className="card-icon" style={{ background: '#fdeef0' }}>
                <BookMarked size={18} color="#c5456b" />
              </div>
              <h3>學習歷程不是作業集，是自我策展<span className="en">Self-Curation, not a Homework Dump</span></h3>
            </div>
            <p>
              大多數平台把學期末的「學習歷程檔案」等同於「作業總匯出」——這是對大學招生準備的根本誤解。
              這個站分開兩件事：每週一鍵匯出文字貼到 Classroom 是給老師評分的；
              而「學習歷程策展室」是學生自己的作品。
              系統把整學期所有思考紀錄攤開，學生親手挑出 10 則關鍵時刻，
              為每一則補上「當時為什麼寫」與「現在回看怎麼想」——三層交錯的，正是大學教授想看到的思考軌跡。
            </p>
            <div className="example">
              <strong>Timeline</strong>（盤點整學期紀錄）→ <strong>Curate</strong>（挑選 + 雙層反思）→ <strong>Export</strong>（一鍵列印 A4 襯線版 PDF）。
              全程在瀏覽器端，不上傳、不監控；主權在學生手上。
            </div>
          </div>

          <div className="hl-card">
            <div className="card-head">
              <div className="card-icon" style={{ background: '#faf5e4' }}>
                <BookOpen size={18} color="#c9a84c" />
              </div>
              <h3>敘事驅動的情境遷移<span className="en">Narrative-Driven Transfer</span></h3>
            </div>
            <p>
              兩套系列共十章，把觀察、訪談、問卷、文獻、實驗五種研究方法包進偵探故事：
              《幽靈數據》作為教學期間的情境錨點、《回聲》則以同樣五項技能換一套情境進行遷移練習。
              學生在敘事壓力下做方法論判斷——這不是獎勵機制，而是情境遷移：
              在故事裡為虛構案件選擇研究方法時，他們正在練的是真實研究中最核心的決策能力。
            </p>
            <div className="example">
              每章設計 Pass / Fail 二元結局與 Smart Retry 機制：失敗時回到選錯的場景重新選擇，而非退回起點。<br />
              章節之間劇情連貫，前一章的線索會影響下一章的對話細節。
            </div>
          </div>

          <div className="hl-card">
            <div className="card-head">
              <div className="card-icon" style={{ background: '#e8f5ee' }}>
                <BarChart2 size={18} color="#2e7d5a" />
              </div>
              <h3>隱形的形成性評量<span className="en">Stealth Formative Assessment</span></h3>
            </div>
            <p>
              探員檔案（Agent Dossier）的六角雷達圖即時反映學生的六維能力分布，
              不需要另外出測驗。成績留在學生端（localStorage），降低「被監控」的壓力，
              讓評量回歸它該有的樣子——幫助學習，而不是製造焦慮。
            </p>
            <div className="example">
              每個遊戲結束自動寫入成績，探員檔案即時換算為百分比，並根據總體表現給予「特務軍階」。
              老師在課堂上只需要投影 Dossier 頁面，就能看到全班能力分布趨勢。
            </div>
          </div>

          <div className="hl-card">
            <div className="card-head">
              <div className="card-icon" style={{ background: '#f3eeff' }}>
                <Brain size={18} color="#7c3aed" />
              </div>
              <h3>AI 協作有框架，不是放牛吃草<span className="en">AI-RED: Structured AI Collaboration</span></h3>
            </div>
            <p>
              AI-RED 五原則（歸屬、提問、引用、評估、紀錄）貫穿 18 週課程。
              前幾週的學習單有完整的 AI 使用引導與記錄欄位，
              後期逐步簡化為三行「AI 使用簡記」，讓學生從被引導走向自主反思。
              搭配 Prompt 實驗室，學生學的不只是「怎麼用 AI」，而是「怎麼負責任地用 AI 做研究」。
            </p>
          </div>
        </div>

        {/* PURPOSE */}
        <div className="about-section">
          <h2>
            設置目的
            <span className="sec-tag">Purpose</span>
          </h2>
          <p className="subtitle">為什麼要做這個網站？三個層次的設計意圖。</p>

          <div className="layer-grid">
            <div className="layer-cell">
              <div className="layer-num">01</div>
              <div className="layer-title">動機引擎</div>
              <div className="layer-desc">
                高一學生對「研究方法」天然無感。
                特務主題與探員檔案把抽象的學術技能，
                轉譯成可感知的身分成長——
                從菜鳥探員晉升為資深特務的過程，就是學習研究方法的過程。
              </div>
            </div>
            <div className="layer-cell">
              <div className="layer-num">02</div>
              <div className="layer-title">隱形評量</div>
              <div className="layer-desc">
                Dossier 雷達圖讓老師和學生即時看到六維能力分布，
                不用另外出紙筆測驗。
                成績留在學生裝置上，降低監控感，
                讓評量回歸「幫助學習」的本質。
              </div>
            </div>
            <div className="layer-cell">
              <div className="layer-num">03</div>
              <div className="layer-title">教學錨點</div>
              <div className="layer-desc">
                每週頁面不只是課程大綱的網頁版，
                它給教師一個可投影、可即時點開遊戲的操作介面。
                「翻開課本第幾頁」變成「點進本週任務」——
                讓教學節奏有了數位化的支撐點。
              </div>
            </div>
          </div>
        </div>

        {/* BACK */}
        <Link className="back-link" to="/">
          <ArrowLeft size={14} /> 回到首頁
        </Link>

        {/* FOOTER */}
        <div className="about-footer">
          <div className="footer-brand">SSSH · 研究方法與專題 · 松山高中</div>
          <div className="footer-version">AI-RED V2.0.4</div>
        </div>

      </div>
    </div>
  );
};
