import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './AboutPage.css';
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
      {/* 樣式抽到 AboutPage.css（已 import）*/}

      {/* HERO */}
      <div className="about-hero">
        <div className="about-hero-inner">
          <div className="kicker">About &nbsp;·&nbsp; 關於本站</div>
          <h1>不只是教學網站<br />是一座<span className="hl">研究訓練場</span></h1>
          <p className="lead">
            松山高中「研究方法與專題」校訂必修課程的教學輔助平台。
            我們把遊戲化機制寫進學科能力的骨架裡，讓高一學生在通關的過程中，完成一次完整的初階研究歷程。
          </p>
        </div>
      </div>

      <div className="about-inner">

        {/* STATS */}
        <div className="stats-row">
          <div className="sr-cell"><div className="sr-n">18</div><div className="sr-label">教學週次</div></div>
          <div className="sr-cell"><div className="sr-n">6</div><div className="sr-label">互動任務</div></div>
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
              這個站不一樣：六個互動任務各自對應一項研究能力維度，玩的過程本身就是在練能力，不是「練完能力再來玩」。
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
              全程在瀏覽器端，不上傳、不監控；資料留在學生自己手上。
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
              學生可以在自己的 Dossier 頁面看到能力分布；教師則可透過課堂展示、學生匯出或回報，掌握學習狀況。
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
              搭配 Prompt 實驗室，學生學的不只是「怎麼使用 AI」，而是<strong>如何在 AI 協助下保留自己的提問、判斷、證據與責任</strong>。
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
