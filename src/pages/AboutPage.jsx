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

          {/* 課程三句承諾 */}
          <div style={{
            marginTop: 28,
            padding: '20px 24px',
            background: 'rgba(255, 255, 255, 0.08)',
            borderLeft: '4px solid #FFD166',
            borderRadius: 8,
            maxWidth: 720,
          }}>
            <p style={{ fontSize: 13, color: '#FFD166', fontWeight: 700, marginBottom: 10, letterSpacing: '0.05em' }}>
              ✦ 我們訓練學生在 AI 時代學會三件事
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 8, fontSize: 15, lineHeight: 1.85 }}>
              <p>📌 <strong>問得出問題</strong>——不是找答案，而是學會問一個可以被研究的問題</p>
              <p>🔍 <strong>查得到證據</strong>——不是抄資料，而是學會判斷哪些資料可信</p>
              <p>⚖️ <strong>說得出限制</strong>——不把話說滿，承認研究還沒解決什麼</p>
            </div>
            <p style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.15)', fontSize: 13, fontStyle: 'italic', opacity: 0.85 }}>
              核心命題：<strong>AI 可以幫你把研究變順，但不能替你把研究變真。</strong>
            </p>
          </div>
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

            {/* AI 可做 / 不能替你做對照表 */}
            <div style={{ marginTop: 16 }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: '#5B21B6', marginBottom: 10 }}>
                📋 6 階段 AI 協作邊界
              </p>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '100px 1fr 1fr',
                gap: 1,
                background: '#E5E7EB',
                border: '1px solid #E5E7EB',
                borderRadius: 8,
                overflow: 'hidden',
                fontSize: 12.5,
              }}>
                <div style={{ padding: '10px 12px', background: '#F9FAFB', fontWeight: 700, color: '#374151' }}>階段</div>
                <div style={{ padding: '10px 12px', background: '#F0FDF4', fontWeight: 700, color: '#065F46' }}>✅ AI 可以幫你</div>
                <div style={{ padding: '10px 12px', background: '#FEF2F2', fontWeight: 700, color: '#991B1B' }}>❌ AI 不能替你做</div>
                {[
                  { stage: '發想', ok: '列問題、找角度、指出題目太大太空', no: '決定自己真正想研究什麼' },
                  { stage: '文獻', ok: '整理資料、摘要來源、比較觀點', no: '判斷資料是否可信' },
                  { stage: '方法', ok: '檢查問卷題目、訪談題綱、實驗變因', no: '決定方法是否合適' },
                  { stage: '分析', ok: '整理表格、提出可能趨勢', no: '面對資料不如預期時誠實' },
                  { stage: '結論', ok: '找論證漏洞、提醒限制', no: '承認研究限制' },
                  { stage: '發表', ok: '整理簡報、模擬評審提問', no: '公開回答追問' },
                ].map((r, i) => (
                  <React.Fragment key={i}>
                    <div style={{ padding: '10px 12px', background: '#fff', fontWeight: 700, color: '#374151' }}>{r.stage}</div>
                    <div style={{ padding: '10px 12px', background: '#fff', color: '#065F46', lineHeight: 1.7 }}>{r.ok}</div>
                    <div style={{ padding: '10px 12px', background: '#fff', color: '#991B1B', lineHeight: 1.7 }}>{r.no}</div>
                  </React.Fragment>
                ))}
              </div>
              <p style={{ marginTop: 10, fontSize: 12, color: '#6B7280', fontStyle: 'italic' }}>
                右欄是研究者的不可外包責任——AI 越強，這些越要由人扛住。
              </p>
            </div>
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
