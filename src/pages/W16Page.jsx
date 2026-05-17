import React, { useState } from 'react';
import CourseArc from '../components/ui/CourseArc';
import './W16.css';
import ThinkRecord from '../components/ui/ThinkRecord';
import AIREDNarrative from '../components/ui/AIREDNarrative';
import StepEngine from '../components/ui/StepEngine';
import HeroBlock from '../components/ui/HeroBlock';
import TaskCard from '../components/ui/TaskCard';
import ExportButton from '../components/ui/ExportButton';
import ResetWeekButton from '../components/ui/ResetWeekButton';
import LessonMap from '../components/ui/LessonMap';
import { W16Data } from '../data/lessonMaps';
import ContentTypeChip from '../components/ui/ContentTypeChip';
import {
    Layout,
    PenTool,
    Eye,
    Download,
    Award,
    FileText,
    Map,
    BookOpen,
    Target,
    AlertTriangle,
} from 'lucide-react';

/* ══════════════════════════════════════
 *  資料常數
 * ══════════════════════════════════════ */

/* 7 項評分規準（對齊「期末研究報告_評分規準_2026海報版」）*/
const RUBRIC_7 = [
    { num: '一', title: '前言（動機與目的）',     weight: 15, area: 'A1 #1  ① ② 動機 + 研究問題' },
    { num: '二', title: '文獻探討',                weight: 15, area: 'A1 #1  ③ 文獻發現（3 篇 + 缺口）' },
    { num: '三', title: '研究方法',                weight: 10, area: 'A1 #1  ④ 方法／對象／工具／流程' },
    { num: '四', title: '研究分析與詮釋',          weight: 20, area: 'A1 #2  核心呈現 + ⑤ 主要發現' },
    { num: '五', title: '研究資料完整性',          weight: 10, area: 'A1 #2  QR Code（連結原始資料 zip）' },
    { num: '六', title: '結論與建議',              weight: 20, area: 'A1 #2  ⑥ 結論 + ⑦ 限制與建議' },
    { num: '七', title: '參考文獻、格式、倫理',    weight: 10, area: 'A1 #2  參考文獻 + 整體排版' },
];

/* 海報視覺四字訣 */
const POSTER_RULES = [
    { word: '大', icon: '🔍', desc: '主標題要大、最重要的發現要大',     color: '#EFF6FF', textColor: '#1E40AF' },
    { word: '少', icon: '✂️', desc: '字越少越好、每區塊不超過 3 行',    color: '#FEF2F2', textColor: '#991B1B' },
    { word: '準', icon: '🎯', desc: '只放最重要的 1 個發現，不是全部',  color: '#F0FDF4', textColor: '#166534' },
    { word: '亮', icon: '💡', desc: '圖表是武器，放中間放最大',         color: '#FEF9C3', textColor: '#854D0E' },
];

/* 海報排版規範（規準七 50%）*/
const FORMAT_RULES = [
    { rule: '對齊',     desc: '所有區塊文字左對齊或居中對齊「擇一」一致' },
    { rule: '字級層次', desc: '標題 ≥ 96pt、區塊小標 ≥ 30pt、內文 ≥ 18pt（A1 印出後遠看 1m 可讀）' },
    { rule: '配色',     desc: '主色 + 強調色 + 中性灰，最多 3 色' },
    { rule: '字體',     desc: '建議思源黑體 / 思源宋體；禁用標楷體（遠看糊）；不混用 ≥ 3 種字體' },
];

/* 輕量化 Export 4 欄 */
const EXPORT_FIELDS = [
    { key: 'w16-poster-progress', label: '製作進度自評', question: '線框圖 / 雛形 / 細節調整 / 已定稿（四選一）' },
    { key: 'w16-poster-tradeoff', label: '內容取捨紀錄', question: '因為海報空間限制，我刪掉/簡化了什麼？為什麼？' },
    { key: 'w16-rubric-self-check', label: '7 項規準自查', question: '我最沒把握的是哪一項？打算 W17 前怎麼補？' },
    { key: 'w16-aired-record', label: 'AI-RED 敘事紀錄', question: '本週最重要的一次 AI 互動（A-I-R-E-D 五要素）' },
];

/* ══════════════════════════════════════
 *  主元件
 * ══════════════════════════════════════ */
const W16Page = () => {
    const [showLessonMap, setShowLessonMap] = useState(false);

    const steps = [
        /* ── Step 1 海報入門 + 7 項規準 ── */
        {
            title: '海報入門',
            icon: <BookOpen size={18} />,
            content: (
                <div className="prose-zh">
                    {/* 開場：為什麼用海報 */}
                    <div className="card">
                        <div className="card-header">
                            <Target size={16} /> 為什麼用海報當期末成果？
                        </div>
                        <div className="card-body">
                            <p style={{ fontSize: 13, lineHeight: 1.85, marginBottom: 12 }}>
                                海報是一份能在 <strong>3 秒內被讀懂的研究報告</strong>——逼你從一學期的研究裡<strong>抓出最重要的東西</strong>。能在兩張 A1 內把研究說清楚，這本身就是研究功力。
                            </p>
                            <p style={{ fontSize: 13, lineHeight: 1.85, color: 'var(--ink-mid)' }}>
                                W17 Gallery Walk 你會親自顧攤分享，海報就是你的「招牌」。<br />
                                <strong>本週目標</strong>：兩張 A1 海報，老師印出來，下週直接上場。
                            </p>
                        </div>
                    </div>

                    {/* 7 項評分規準（對齊期末規準）*/}
                    <div className="card" style={{ marginTop: 16 }}>
                        <div className="card-header" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <ContentTypeChip type="學" />
                            <Award size={16} /> 海報怎麼被評分？— 7 項規準（總分 100）
                        </div>
                        <div className="card-body">
                            <p style={{ fontSize: 12.5, color: 'var(--ink-mid)', marginBottom: 12, lineHeight: 1.8 }}>
                                這份就是<strong>期末研究報告的評分規準</strong>（去年版本 + 海報版註腳）。先看清楚每一項對應海報哪個區塊，後面製作時就知道哪格不能漏。
                            </p>
                            <div style={{ display: 'grid', gridTemplateColumns: '60px 1fr 60px 1fr', gap: 1, background: 'var(--border)', border: '1px solid var(--border)', borderRadius: 'var(--radius-unified)', overflow: 'hidden' }}>
                                <div style={{ padding: '8px 10px', background: 'var(--paper-warm)', fontSize: 11, fontWeight: 700, color: 'var(--ink)' }}>項</div>
                                <div style={{ padding: '8px 10px', background: 'var(--paper-warm)', fontSize: 11, fontWeight: 700, color: 'var(--ink)' }}>評分項目</div>
                                <div style={{ padding: '8px 10px', background: 'var(--paper-warm)', fontSize: 11, fontWeight: 700, color: 'var(--ink)' }}>權重</div>
                                <div style={{ padding: '8px 10px', background: 'var(--paper-warm)', fontSize: 11, fontWeight: 700, color: 'var(--ink)' }}>對應海報區塊</div>
                                {RUBRIC_7.map(r => (
                                    <React.Fragment key={r.num}>
                                        <div style={{ padding: '10px 10px', background: '#fff', fontSize: 12, fontWeight: 700, color: 'var(--accent)' }}>{r.num}</div>
                                        <div style={{ padding: '10px 10px', background: '#fff', fontSize: 12, color: 'var(--ink)' }}>{r.title}</div>
                                        <div style={{ padding: '10px 10px', background: '#fff', fontSize: 12, fontWeight: 700, color: 'var(--ink)' }}>{r.weight}%</div>
                                        <div style={{ padding: '10px 10px', background: '#fff', fontSize: 11.5, color: 'var(--ink-mid)' }}>{r.area}</div>
                                    </React.Fragment>
                                ))}
                            </div>
                            <div style={{ marginTop: 12, padding: '10px 14px', background: '#FFFBEB', borderLeft: '3px solid #F59E0B', borderRadius: 4, fontSize: 12, color: '#92400E', lineHeight: 1.8 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}><ContentTypeChip type="注意" /></div>
                                ⚠️ <strong>規準五（資料完整性 10%）海報放不下原始資料</strong>——組長要把問卷原稿／訪談逐字稿／實驗紀錄壓成 zip，上傳到 Google Classroom（檔名：<code>組別_原始資料.zip</code>）。<strong>逾期未交者該項以不及格計。</strong>
                            </div>
                        </div>
                    </div>
                </div>
            ),
        },

        /* ── Step 2 海報架構 + 模板下載 ── */
        {
            title: '海報架構',
            icon: <Layout size={18} />,
            content: (
                <div className="prose-zh">
                    <div className="card">
                        <div className="card-header">
                            <Layout size={16} /> 兩張 A1 = 一張 A0（並排呈現）
                        </div>
                        <div className="card-body">
                            <p style={{ fontSize: 13, lineHeight: 1.85, marginBottom: 12 }}>
                                海報故事流向「左 → 右」：<strong>左 A1 講為什麼跟怎麼做、右 A1 講發現跟意義</strong>。下方是 7 個區塊的分配，跟 7 項規準完全對應。
                            </p>

                            {/* 兩張 A1 區塊圖 */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 12 }}>
                                <div style={{ background: '#EFF6FF', border: '2px solid #1E40AF', borderRadius: 'var(--radius-unified)', padding: 14 }}>
                                    <div style={{ fontSize: 14, fontWeight: 700, color: '#1E40AF', marginBottom: 8 }}>A1 #1（左 · 故事與方法）</div>
                                    <div style={{ fontSize: 12, lineHeight: 2, color: '#1E40AF' }}>
                                        <div><strong>大標題</strong> + 作者班級日期</div>
                                        <div>① 為什麼研究這個（規準一）</div>
                                        <div>② 研究問題（規準一）</div>
                                        <div>③ 文獻發現（規準二）</div>
                                        <div>④ 研究方法（規準三）</div>
                                    </div>
                                </div>
                                <div style={{ background: '#F0FDF4', border: '2px solid #166534', borderRadius: 'var(--radius-unified)', padding: 14 }}>
                                    <div style={{ fontSize: 14, fontWeight: 700, color: '#166534', marginBottom: 8 }}>A1 #2（右 · 發現與意義）</div>
                                    <div style={{ fontSize: 12, lineHeight: 2, color: '#166534' }}>
                                        <div>★ <strong>核心呈現</strong>（規準四）</div>
                                        <div>⑤ 主要發現（規準四）</div>
                                        <div>⑥ 結論（規準六）</div>
                                        <div>⑦ 限制與建議（規準六）</div>
                                        <div>參考文獻 + QR（規準七 + 五）</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 視覺範本參考圖（GPT 設計版）*/}
                    <div className="card" style={{ marginTop: 16 }}>
                        <div className="card-header">
                            <Eye size={16} /> 視覺範本參考（看完整海報長什麼樣）
                        </div>
                        <div className="card-body">
                            <p style={{ fontSize: 13, lineHeight: 1.85, marginBottom: 12 }}>
                                下方兩張是<strong>已加上規準角標</strong>的視覺範本——你做的時候對照這個樣子，知道每個區塊長怎樣才合格。實際下載的是「乾淨版」，學生製作後印 A1 用。
                            </p>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                                <div>
                                    <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--ink-mid)', marginBottom: 6, textAlign: 'center' }}>A1 #1（左 · 故事與方法）</div>
                                    <img
                                        src="/images/w16/poster-sample-left.png"
                                        alt="A1 #1 範本：研究標題 + 動機 + 研究問題 + 文獻發現 + 研究方法"
                                        style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 'var(--radius-unified)', border: '1px solid var(--border)', background: '#F8FAFC' }}
                                        onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextElementSibling.style.display = 'block'; }}
                                    />
                                    <div style={{ display: 'none', padding: 24, border: '2px dashed var(--border)', borderRadius: 'var(--radius-unified)', textAlign: 'center', fontSize: 12, color: 'var(--ink-light)' }}>
                                        圖片載入中⋯⋯<br />路徑：/images/w16/poster-sample-left.png
                                    </div>
                                </div>
                                <div>
                                    <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--ink-mid)', marginBottom: 6, textAlign: 'center' }}>A1 #2（右 · 發現與意義）</div>
                                    <img
                                        src="/images/w16/poster-sample-right.png"
                                        alt="A1 #2 範本：核心呈現 + 主要發現 + 結論 + 限制 + 參考文獻 + QR Code"
                                        style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 'var(--radius-unified)', border: '1px solid var(--border)', background: '#F8FAFC' }}
                                        onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextElementSibling.style.display = 'block'; }}
                                    />
                                    <div style={{ display: 'none', padding: 24, border: '2px dashed var(--border)', borderRadius: 'var(--radius-unified)', textAlign: 'center', fontSize: 12, color: 'var(--ink-light)' }}>
                                        圖片載入中⋯⋯<br />路徑：/images/w16/poster-sample-right.png
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 模板下載（只剩乾淨版）*/}
                    <div className="card" style={{ marginTop: 16, border: '2px solid var(--accent)' }}>
                        <div className="card-header" style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>
                            <Download size={16} /> 海報 PowerPoint 模板下載
                        </div>
                        <div className="card-body">
                            <p style={{ fontSize: 13, lineHeight: 1.85, marginBottom: 8 }}>
                                這份就是你要動手改的<strong>乾淨版 PPT</strong>。版面已對齊 7 項規準，你要把自己的研究內容整理進 7 個區塊，並貼上最能呈現研究發現的核心視覺，最後匯出 PDF 給老師印 A1。
                            </p>
                            <div style={{ fontSize: 12, lineHeight: 1.8, color: '#4B5563', background: '#F9FAFB', border: '1px dashed #D1D5DB', borderRadius: 8, padding: '10px 14px', marginBottom: 12 }}>
                                💡 <strong>這只是參考模板——以下都可以自由調整：</strong><br />
                                🎨 配色主題（換主題色，建議不超過 3 色）／🖼️ 照片與插圖（研究現場、問卷截圖、自製圖表）／✍️ 標題字體與大小／🌈 背景底紋或漸層／🔲 區塊內文字與圖的比例<br />
                                <span style={{ color: '#DC2626', fontWeight: 700 }}>不能動的</span>：7 個區塊的存在與對應內容（規準有對應，改掉會影響評分）。
                            </div>
                            <a
                                href="/templates/research-poster-template-clean.pptx"
                                download
                                style={{
                                    display: 'block', padding: 16,
                                    background: '#F0FDF4', border: '2px solid #166534',
                                    borderRadius: 'var(--radius-unified)', textDecoration: 'none',
                                }}
                            >
                                <div style={{ fontSize: 14, fontWeight: 700, color: '#166534', marginBottom: 4 }}>📥 research-poster-template-clean.pptx</div>
                                <div style={{ fontSize: 12, color: '#14532D', lineHeight: 1.7 }}>
                                    含兩張 A1 投影片（左：故事與方法 / 右：發現與意義）。可用 PowerPoint / Google 簡報 / Keynote / Canva 開啟編輯。
                                </div>
                            </a>
                            <p style={{ fontSize: 11.5, color: 'var(--ink-mid)', marginTop: 12, fontStyle: 'italic', lineHeight: 1.7 }}>
                                💡 完成後匯出 PDF 給老師印 A1。
                            </p>
                        </div>
                    </div>
                </div>
            ),
        },

        /* ── Step 3 海報製作（直接開模板改）── */
        {
            title: '海報製作',
            icon: <PenTool size={18} />,
            content: (
                <div className="prose-zh">
                    {/* 直接開模板：兩條路 */}
                    <div className="card">
                        <div className="card-header">
                            <PenTool size={16} /> 第一步：打開模板，兩條路
                        </div>
                        <div className="card-body">
                            <p style={{ fontSize: 13, lineHeight: 1.85, marginBottom: 12 }}>
                                你已經在 Step 2 下載 <strong>乾淨版 PPT</strong>。直接開來改，不必從零畫——版面已經對齊 7 項規準。
                            </p>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                                <div style={{ background: '#FEF3C7', border: '2px solid #F59E0B', borderRadius: 'var(--radius-unified)', padding: 14 }}>
                                    <div style={{ fontSize: 13, fontWeight: 700, color: '#92400E', marginBottom: 8 }}>路線 A · PowerPoint / Google 簡報 / Keynote</div>
                                    <div style={{ fontSize: 12, lineHeight: 1.85, color: '#78350F' }}>
                                        雙擊 PPT 檔，直接編輯。<br />
                                        Google 簡報：上傳到 Drive 後右鍵「以 Google 簡報開啟」。<br />
                                        Keynote：拖進 Keynote 自動轉檔。
                                    </div>
                                </div>
                                <div style={{ background: '#EFF6FF', border: '2px solid #3B82F6', borderRadius: 'var(--radius-unified)', padding: 14 }}>
                                    <div style={{ fontSize: 13, fontWeight: 700, color: '#1E40AF', marginBottom: 8 }}>路線 B · Canva（推薦給已有 Canva 帳號）</div>
                                    <div style={{ fontSize: 12, lineHeight: 1.85, color: '#1E3A8A' }}>
                                        登入 Canva → 建立新設計 → 「上傳」標籤頁 → 把 PPT 拖進去。<br />
                                        Canva 自動轉成可編輯的圖文，每張 slide 變一頁設計。
                                    </div>
                                </div>
                            </div>
                            <div style={{ marginTop: 12, padding: '12px 16px', background: 'var(--paper-warm)', border: '1px solid var(--border)', borderRadius: 'var(--radius-unified)', fontSize: 12, color: 'var(--ink-mid)', lineHeight: 1.85 }}>
                                💡 <strong>不論哪條路</strong>，做完匯出 <strong>PDF</strong> 給老師印 A1。Canva 也支援匯出 PDF（File → Download → PDF Print）。
                            </div>
                        </div>
                    </div>

                    {/* 替換內容流程 */}
                    <div className="card" style={{ marginTop: 16 }}>
                        <div className="card-header">
                            <FileText size={16} /> 第二步：整理內容（不改版面）
                        </div>
                        <div className="card-body">
                            <p style={{ fontSize: 13, lineHeight: 1.85, marginBottom: 12 }}>
                                模板版面已對齊評分規準，<strong>不要改動版面</strong>。但版面只是容器——<strong>內容要由你決定哪些留下、哪些刪掉</strong>。具體兩個動作：
                            </p>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 1, background: 'var(--border)', border: '1px solid var(--border)', borderRadius: 'var(--radius-unified)', overflow: 'hidden' }}>
                                <div style={{ padding: '10px 14px', background: '#fff', fontSize: 12.5, lineHeight: 1.85 }}>
                                    <strong style={{ color: 'var(--accent)' }}>① 整理每格的內容</strong>——把「請置換」的 placeholder 換成你研究的精華（題目、動機、文獻、方法、結論）。這一步<strong>不是直接複製計畫書</strong>，要思考海報空間有限，每格只留最重要的
                                </div>
                                <div style={{ padding: '10px 14px', background: '#fff', fontSize: 12.5, lineHeight: 1.85 }}>
                                    <strong style={{ color: 'var(--accent)' }}>② 整理 A1 #2 的核心呈現</strong>——把示範圖刪掉，<strong>從 W14 多張圖中選一張最能代表研究發現的</strong>貼上去（質性組可放主題矩陣或關鍵引文卡，置中對齊）
                                </div>
                            </div>
                            <p style={{ fontSize: 12, color: 'var(--ink-light)', marginTop: 12, fontStyle: 'italic' }}>
                                ⚠️ 千萬不要重新調整文字框位置或改色塊邊框——除非你很確定要做什麼。模板的對齊跟配色都是「規準七 50%」的依據。
                            </p>
                        </div>
                    </div>

                    {/* 5 種方法核心呈現對照表 */}
                    <div className="card" style={{ marginTop: 16 }}>
                        <div className="card-header">
                            <FileText size={16} /> 第三步：你的方法該放什麼到「核心呈現」？
                        </div>
                        <div className="card-body">
                            <p style={{ fontSize: 13, lineHeight: 1.85, marginBottom: 12 }}>
                                A1 #2 的「核心呈現」位置是 <strong>規準四（20%）</strong>的關鍵——但 5 種方法該放的東西不一樣。對照下表找你那種：
                            </p>
                            <div style={{ display: 'grid', gridTemplateColumns: '110px 150px 1fr', gap: 1, background: 'var(--border)', border: '1px solid var(--border)', borderRadius: 'var(--radius-unified)', overflow: 'hidden' }}>
                                <div style={{ padding: '8px 10px', background: 'var(--paper-warm)', fontSize: 11, fontWeight: 700, color: 'var(--ink)' }}>方法</div>
                                <div style={{ padding: '8px 10px', background: 'var(--paper-warm)', fontSize: 11, fontWeight: 700, color: 'var(--ink)' }}>核心呈現該放什麼</div>
                                <div style={{ padding: '8px 10px', background: 'var(--paper-warm)', fontSize: 11, fontWeight: 700, color: 'var(--ink)' }}>具體範例</div>
                                {[
                                    { m: '📋 問卷', show: '量化圖表',     ex: '長條圖（人次比較）／圓餅圖（比例）／量表平均值分布／交叉表' },
                                    { m: '🧪 實驗', show: '前後測比較',   ex: '實驗組 vs 對照組柱狀圖／折線圖（時間變化）／效應量標註' },
                                    { m: '👀 觀察', show: '行為頻率統計', ex: '行為類別 × 次數柱狀圖／時間分布熱圖／空間分布示意圖' },
                                    { m: '🎤 訪談', show: '主題編碼 + 代表引文', ex: '主題分類矩陣（主題 × 受訪者）／3 個關鍵引文卡（含受訪者代號 P1/P2/P3）' },
                                    { m: '📚 文獻分析',  show: '依子類型而異',  ex: '② 歷史：時間軸／因果鏈圖｜③ 內容：編碼計次表／詞頻長條圖／共現矩陣｜④ 論述：立場光譜圖／話語對照表／框架分類｜⑤ 敘事：情節結構圖／角色關係圖' },
                                ].map((r, i) => (
                                    <React.Fragment key={i}>
                                        <div style={{ padding: '10px 10px', background: '#fff', fontSize: 12.5, fontWeight: 700, color: 'var(--ink)' }}>{r.m}</div>
                                        <div style={{ padding: '10px 10px', background: '#fff', fontSize: 12, fontWeight: 700, color: 'var(--accent)' }}>{r.show}</div>
                                        <div style={{ padding: '10px 10px', background: '#fff', fontSize: 11.5, color: 'var(--ink-mid)', lineHeight: 1.7 }}>{r.ex}</div>
                                    </React.Fragment>
                                ))}
                            </div>
                            <p style={{ fontSize: 11.5, color: 'var(--ink-mid)', marginTop: 12, fontStyle: 'italic', lineHeight: 1.7 }}>
                                💡 訪談組／文獻組常見錯誤：硬塞長條圖（強行量化質性資料）→ 規準四 D。<strong>找對的呈現方式比硬塞圖表重要。</strong>
                            </p>
                        </div>
                    </div>

                    {/* 視覺四字訣 */}
                    <div className="card" style={{ marginTop: 16 }}>
                        <div className="card-header" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <ContentTypeChip type="學" />
                            <Eye size={16} /> 第四步：3 秒吸引力法則（大、少、準、亮）
                        </div>
                        <div className="card-body">
                            <p style={{ fontSize: 13, lineHeight: 1.85, marginBottom: 12 }}>
                                W17 Gallery Walk 沒有聽眾會讀你的論文。他們在 <strong>3 秒內</strong>決定要不要停下來。決定停下來的不是「字多」，是這 4 件事：
                            </p>
                            <div className="w16-poster-grid">
                                {POSTER_RULES.map(r => (
                                    <div className="w16-poster-card" key={r.word} style={{ background: r.color, color: r.textColor }}>
                                        <div className="w16-poster-icon">{r.icon}</div>
                                        <div className="w16-poster-word">{r.word}</div>
                                        <div className="w16-poster-desc">{r.desc}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* 排版規範（規準七 50%）*/}
                    <div className="card" style={{ marginTop: 16 }}>
                        <div className="card-header" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <ContentTypeChip type="注意" />
                            <Award size={16} /> 排版規範（規準七 50% · 模板已內建）
                        </div>
                        <div className="card-body">
                            <p style={{ fontSize: 13, lineHeight: 1.85, marginBottom: 12, color: 'var(--ink-mid)' }}>
                                這 4 條<strong>會被打分</strong>。模板已經做好，你只要<strong>不亂改色塊跟字型</strong>就 OK。
                            </p>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 1, background: 'var(--border)', border: '1px solid var(--border)', borderRadius: 'var(--radius-unified)', overflow: 'hidden' }}>
                                {FORMAT_RULES.map((f, i) => (
                                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '10px 14px', background: '#fff', fontSize: 12 }}>
                                        <span style={{ fontWeight: 700, color: 'var(--accent)', minWidth: 70, fontSize: 13 }}>{f.rule}</span>
                                        <span style={{ color: 'var(--ink-mid)', lineHeight: 1.7 }}>{f.desc}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* AI 用法提示（不放 prompt 模板，只說怎麼用）*/}
                    <div className="card" style={{ marginTop: 16, background: '#FAFAF7', border: '1px dashed var(--border)' }}>
                        <div className="card-body">
                            <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink)', marginBottom: 8 }}>💡 想用 AI 幫忙？可以這樣用</p>
                            <div style={{ fontSize: 12.5, color: 'var(--ink-mid)', lineHeight: 1.95 }}>
                                · <strong>標題吸睛改寫</strong>：把你研究題目原版貼給 AI，請它「保持原意，改成更吸引人的問句或驚人數字版」<br />
                                · <strong>結論句精簡</strong>：把 W15 寫的結論貼給 AI，請它「壓縮成 2 句話的海報結論」<br />
                                · <strong>圖示／配色建議</strong>：可以請 AI 提供視覺方向，但最後要檢查是否符合你的研究主題與資料，<strong>不要為了好看改變研究意思</strong>。<br />
                                <span style={{ color: 'var(--ink-light)', fontStyle: 'italic' }}>⚠️ 不要叫 AI 從零生成整張海報內容——你的研究內容只有你才知道對不對。AI 可以協助標題改寫、句子精簡、圖示與配色建議；但<strong>不能替你決定研究內容，也不能改變你的研究結論</strong>。</span>
                            </div>
                        </div>
                    </div>
                </div>
            ),
        },

        /* ── Step 4 收尾繳交 ── */
        {
            title: '收尾繳交',
            icon: <FileText size={18} />,
            content: (
                <div className="prose-zh">
                    {/* 上課紀錄 3 欄 */}
                    <div className="card">
                        <div className="card-header" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <ContentTypeChip type="做" />
                            <Target size={16} /> 上課紀錄（3 格 + AI-RED）
                        </div>
                        <div className="card-body">
                            <p style={{ fontSize: 12.5, color: 'var(--ink-mid)', lineHeight: 1.85, marginBottom: 16 }}>
                                海報本身才是<strong>期末分數的主軸</strong>（依 7 項規準評）。網頁這 3 格是<strong>製作過程的紀錄</strong>——記下今天做的判斷與選擇，讓老師知道你的思考歷程。
                            </p>

                            <ThinkRecord
                                dataKey="w16-poster-progress"
                                prompt="① 製作進度自評（請填一個）"
                                placeholder="線框圖完成 / 雛形完成 / 細節調整中 / 已定稿"
                                rows={2}
                            />
                            <ThinkRecord
                                dataKey="w16-poster-tradeoff"
                                prompt="② 內容取捨：因為海報空間限制，我刪掉/簡化了什麼？為什麼是這個不是那個？"
                                placeholder="例：我把 5 篇文獻砍到 3 篇，因為剩下 2 篇主要在補背景、不是核心發現的依據——把空間留給更重要的研究方法說明。"
                                scaffold={[
                                    '我刪掉 / 簡化的是 ___',
                                    '保留的是 ___',
                                    '取捨理由：因為 ___',
                                ]}
                                rows={4}
                            />
                            <ThinkRecord
                                dataKey="w16-rubric-self-check"
                                prompt="③ 7 項規準自查：我最沒把握的是哪一項？打算 W17 前怎麼補？"
                                placeholder="例：我最沒把握規準五（資料完整性），因為我還沒整理問卷原稿——本週末前要弄成 zip 上傳 GC。"
                                scaffold={[
                                    '我最沒把握第 ___ 項（一/二/三/四/五/六/七）',
                                    '原因：___',
                                    'W17 前我要 ___（具體動作 + 期限）',
                                    '組長確認：原始資料 zip 是否已上傳 GC？（是 / 否，預計 ___ 前完成）',
                                ]}
                                rows={4}
                            />
                        </div>
                    </div>

                    {/* AI-RED */}
                    <div style={{ marginTop: 16 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                            <ContentTypeChip type="交出" />
                            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink)' }}>AI-RED 敘事紀錄</span>
                        </div>
                        <AIREDNarrative
                            week="16"
                            hint="本週可能用 AI 做的事：寫海報標題、潤色發現句、生成視覺素材（示意圖／背景）。注意：AI 可協助視覺素材，但不可捏造或改造研究數據圖表——核心呈現用 W14 的真實圖表。"
                            optional={true}
                        />
                    </div>

                    {/* 本週結束，你應該要會 — B 標準格式 */}
                    <div className="bg-white border border-[var(--border)] rounded-[var(--radius-unified)] overflow-hidden mb-4" style={{ marginTop: 16 }}>
                        <div className="p-4 px-5 bg-[var(--paper-warm)] border-b border-[var(--border)] font-bold text-[13px]">
                            ✅ 本週結束，你應該要會
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-[1px] bg-[var(--border)]">
                            {[
                                '看懂期末 7 項規準，知道海報哪一格對應哪一項評分',
                                '在兩張 A1 海報內把 7 個區塊整理清楚，每項規準都有對應內容',
                                '依視覺技巧（大／少／準／亮）做取捨——不是塞越多越好',
                                '依排版規範（對齊／字級／3 色／字體）製作海報——這也是評分項',
                            ].map((item, i) => (
                                <div key={i} className="p-4 px-5 bg-white flex items-start gap-3">
                                    <span className="text-[var(--success)] text-[16px] mt-0.5 flex-shrink-0">✓</span>
                                    <span className="text-[13px] text-[var(--ink-mid)] leading-relaxed">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 一鍵複製繳交 */}
                    <div className="bg-[#EFF6FF] border-2 border-[#1E40AF] rounded-[var(--radius-unified)] p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <ContentTypeChip type="交出" />
                            <span className="text-[10px] font-mono font-bold bg-[#1E40AF] text-white px-2 py-0.5 rounded-[3px] uppercase tracking-wider">📤 最後一步</span>
                            <span className="text-[14px] font-bold text-[#1E40AF]">複製 W16 學習紀錄 → 貼 Google Classroom</span>
                        </div>
                        <p className="text-[12px] text-[#1E3A8A] leading-relaxed mb-3">
                            包含：製作進度自評／內容取捨紀錄／7 項規準自查／AI-RED 敘事紀錄（如有）。
                        </p>
                        <ExportButton
                            weekLabel="W16 海報製作（製作過程紀錄）"
                            fields={EXPORT_FIELDS}
                            buttonText="複製 W16 學習紀錄"
                        />
                    </div>

                    {/* W17 預告 */}
                    <div className="card" style={{ marginTop: 16, background: '#1a1a2e', border: 'none' }}>
                        <div className="card-body" style={{ color: '#e2e8f0' }}>
                            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8, color: '#FCD34D' }}>
                                🎨 W17 預告 · Gallery Walk 策展日
                            </div>
                            <div style={{ fontSize: 12, lineHeight: 1.85, opacity: 0.9 }}>
                                本週 PDF 匯出後傳給老師，老師會在 W17 前印好 A1 海報。<br />
                                W17 上半場顧攤分享、下半場走動聆聽，每個人都會填兩份紙本學習單。<br />
                                <strong style={{ color: '#FCD34D' }}>記得：原始資料壓縮檔（規準五）由組長代繳到 Google Classroom，逾期未交者該項以不及格計。</strong>
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
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-4 mb-8 md:mb-12 gap-3">
                <div className="text-[11px] font-mono text-[var(--ink-light)] flex items-center gap-2 min-w-0">
                    <span className="hidden md:inline">研究方法與專題 / 分析與報告 / </span><span className="text-[var(--ink)] font-bold">海報製作 W16</span>
                </div>
                <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
                    <span className="bg-[var(--paper-warm)] text-[var(--ink)] text-[10px] font-bold px-2 py-0.5 rounded-[2px] font-mono">100 MINS</span>
                    <ResetWeekButton weekPrefix="w16-" />
                    <button
                        onClick={() => setShowLessonMap(!showLessonMap)}
                        className="text-[11px] text-[var(--ink-light)] hover:text-[var(--accent)] transition-colors flex items-center gap-1 font-mono"
                        type="button"
                    >
                        <Map size={12} /> <span className="hidden md:inline">{showLessonMap ? 'Hide Plan' : 'Instructor View'}</span>
                    </button>
                </div>
            </div>

            {showLessonMap && (
                <div className="animate-in slide-in-from-top-4 duration-300 mb-8">
                    <LessonMap data={W16Data} />
                </div>
            )}

            {/* PAGE HEADER — Hero Block */}
            <HeroBlock
                kicker="R.I.B. 調查檔案 · 研究方法與專題 · W16"
                todo={[
                  { label: '今天做什麼', value: '把研究核心壓縮進兩張 A1 海報的七個區塊，完成 W17 上場版本。' },
                  { label: '為什麼做', value: 'W15 寫完四層次結論——現在要把它變成 3 秒可讀的視覺版，下週就是真人來問的場子。' },
                  { label: '今天交什麼', value: '海報 PDF（送老師印 A1）+ 原始資料 zip（組長）+ 個人 W16 網頁歷程。' },
                ]}
                question="別人看得懂我怎麼得到結論嗎？"
                title="海報製作 · "
                accentTitle="兩張 A1 把研究說清楚"
                subtitle="期末成果不是 Word 報告，是兩張 A1 海報。本週把 W1-W15 累積的研究內容，整理成 7 個清楚區塊，下週 W17 上場。海報本身就是期末研究報告——依 7 項規準打分。"
                chain="W15 你寫完四層次結論——是時候把整份研究壓縮成兩張海報，讓 3 秒內路過的同學就能 get 你的核心發現。"
                meta={[
                    { label: '第一節', value: '海報入門 + 7 項規準 + 兩張 A1 架構' },
                    { label: '第二節', value: '線框圖 + 視覺技巧 + 製作 + 收尾繳交' },
                    { label: '課堂產出', value: '兩張 A1 海報（課堂完成雛形 → 課後補完匯出 PDF）+ 製作紀錄' },
                    { label: '前置要求', value: 'W15 研究結論章初稿 + W14 圖表圖說（海報素材來源）' },
                ]}
            />
            <CourseArc items={[
                    { wk: 'W1-W2', name: '探索階段\nRED公約', status: 'past' },
                    { wk: 'W3-W4', name: '題目診斷\n方法地圖', status: 'past' },
                    { wk: 'W5-W8', name: '操作型定義／海報／文獻', status: 'past' },
                    { wk: 'W9-W11', name: '工具設計\n倫理審查', status: 'past' },
                    { wk: 'W11-W13', name: '執行階段\n自主研究', status: 'past' },
                    { wk: 'W14-W15', name: '數據轉譯\n圖表結論', status: 'past' },
                    { wk: 'W16-W17', name: '海報製作\nGallery Walk', status: 'now' },
                ]} />

            <TaskCard
                weekNumber="W16"
                weekTitle={W16Data.title}
                duration={`${W16Data.duration} 分鐘 · ${W16Data.durationDesc}`}
                tasks={[
                    '海報入門：7 項規準 + 兩張 A1 架構',
                    '海報架構：模板下載 + 5 法核心呈現對照',
                    '海報製作：直接開模板改 + 上課紀錄 3 格 + 收尾繳交',
                ]}
                exportReminder="小組繳交海報 PDF + 原始資料 zip（組長代繳）；個人繳交 W16 網頁歷程 docx → W17 Gallery Walk 用"
            />

            {/* STEP ENGINE */}
            <StepEngine
                steps={steps}
                prevWeek={{ label: '回 W15 研究結論', to: '/w15' }}
                nextWeek={{ label: '前往 W17 成果發表', to: '/w17' }}
            flat
            />
        </div>
    );
};

export { W16Page };
export default W16Page;
