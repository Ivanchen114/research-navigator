import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Map, Ruler, ArrowLeft, Lightbulb, AlertTriangle } from 'lucide-react';

/* ══════════════════════════════════════
 *  資料：12 個操作型定義範例（5 法）
 * ══════════════════════════════════════ */

const METHOD_TABS = [
    { id: 'survey',       icon: '📋', name: '問卷',       color: 'var(--accent)',  bg: 'var(--accent-light)' },
    { id: 'interview',    icon: '🎤', name: '訪談',       color: '#7c3aed',        bg: '#f3f0ff' },
    { id: 'experiment',   icon: '🧪', name: '實驗',       color: '#d97706',        bg: '#fef3c7' },
    { id: 'observation',  icon: '👀', name: '觀察',       color: 'var(--success)', bg: 'var(--success-light)' },
    { id: 'literature',   icon: '📚', name: '文獻分析',   color: '#6b21a8',        bg: '#f5f3ff' },
];

/**
 * 每個範例的欄位
 *  - title: 標題（題目／概念）
 *  - concept: 核心概念
 *  - opdef: 操作型定義（主版／入門版）
 *  - opdefV2: 改良版（optional，會用 details 收合）
 *  - posExamples / negExamples: 正反例陣列
 *  - threeChecks: { measurable, posneg, consistent } 三件事檢核
 *  - note: 學生看完該注意的提醒（optional）
 */
const EXAMPLES = {
    survey: [
        {
            title: '考前焦慮',
            concept: '考前焦慮（受試者在重要考試前的情緒狀態）',
            opdef: '改編 STAI-S 狀態焦慮量表 6 題，5 點李克特量尺（1=非常不同意 ～ 5=非常同意）。題項涵蓋緊張感、心跳加速、注意力難集中、預期失敗等。**6 題加總分數（範圍 6-30）作為「考前焦慮」分數**。',
            posExamples: ['「我覺得心跳加速」5 分', '「我擔心會考不好」5 分', '「我感到肚子不舒服」4 分'],
            negExamples: ['「我覺得很平靜」5 分（反向題，計分時要倒）', '只填一兩題（無效樣本）'],
            threeChecks: {
                measurable: '6 題加總分數（具體分數區間）',
                posneg: '量表已有標準答題，研究者不需自訂正反例',
                consistent: '量表題項與計分方式整個研究固定不變',
            },
            note: '量表型最容易做——找已驗證的中文量表（如 STAI、PSS、CES-D）改編就好。',
        },
        {
            title: '課業壓力',
            concept: '課業壓力（學業要求帶來的心理負荷感）',
            opdef: 'PSS-10 知覺壓力量表 10 題，5 點李克特（0-4）。例：「過去一個月你多常感到無法應付要做的事？」**10 題加總分數（0-40）作為「課業壓力」分數**。',
            posExamples: ['加總得分 ≥ 27 分（高壓力組）', '加總得分 14-26 分（中壓力組）', '加總得分 ≤ 13 分（低壓力組）'],
            negExamples: ['只填 5 題（題項不全，視為無效）', '所有題目都選同一個分數（疑似亂答）'],
            threeChecks: {
                measurable: '量表分數（0-40 的連續變項）',
                posneg: '高/中/低三組由分數區間切，不需自訂正反例',
                consistent: '同一份量表用整個研究',
            },
        },
        {
            title: '滑手機成癮',
            concept: '社群媒體成癮傾向',
            opdef: '改編 BSMAS（Bergen 社群媒體成癮量表）6 題，5 點李克特（1-5）。題項涵蓋顯著性（時間佔據）、忍耐性（用越久才滿足）、復發性（戒不掉）等。**6 題加總分數 ≥ 19 分視為「成癮傾向組」**。',
            posExamples: ['加總 ≥ 19 → 成癮傾向組', '加總 14-18 → 高使用組', '加總 ≤ 13 → 低使用組'],
            negExamples: ['只測「使用時數」當成癮指標（時數長 ≠ 成癮，要看心理依賴）'],
            threeChecks: {
                measurable: '量表分數（連續）+ 切點分組（類別）',
                posneg: '量表分組標準明確',
                consistent: '量表分組標準整個研究固定',
            },
            note: '常見錯誤：只用「每天使用時數」當操作型定義——時數長不等於成癮，重點是心理依賴。',
        },
        {
            title: '班級歸屬感（自設量表型）',
            concept: '班級歸屬感（個體對班級的情感連結與認同程度）——**沒有現成量表**，自己設計',
            opdef: '**自設 4 題**，每題對應一個向度，5 點李克特（1=非常不同意 ～ 5=非常同意）。**4 題加總分數（4-20）作為「班級歸屬感」分數**。\n\n**自設題目（4 個向度）**：\n① 情感認同：「我覺得這個班級就像一個團體」\n② 行動投入：「我願意為班級的事情多付出時間」\n③ 連結感：「在班上發生的事情，跟我有關係」\n④ 重要性：「離開這個班級我會覺得失落」\n\n**為何這 4 題**：參考組織歸屬感（OCB）三向度（情感／規範／持續）+ 班級情境調整。**寫研究計畫書時要說明這個對應**。',
            posExamples: ['加總 ≥ 17 → 高歸屬感（4 題都填 4-5 分）', '加總 12-16 → 中歸屬感', '加總 ≤ 11 → 低歸屬感', '預試（pilot）找 5-10 人先答看看，回收後檢查：有沒有哪題大家都填同分？'],
            negExamples: ['用封閉題「你喜歡這個班級嗎？」（yes/no 不適合李克特，鑑別力低）', '只用 1 題（「我有歸屬感嗎」）→ 沒涵蓋多個向度', '4 題全是同方向陳述（容易引導作答，建議至少 1 題反向）', '自設完直接發出去（沒做 pilot，可能題目根本看不懂）'],
            threeChecks: {
                measurable: '4 題加總分數（4-20 連續變項）+ 切點分組',
                posneg: '需自訂題目方向（正向／反向陳述）+ 預試確認鑑別力',
                consistent: '4 題量表整個研究固定不變；計分方式（含反向題倒分）一致',
            },
            note: '⚠️ **自設量表最大雷：沒人驗證過你這 4 題真的測歸屬感**。降風險 3 招——① **參考已驗證量表**的向度設計（不是抄題目，是抄結構）② **預試**（5-10 人先答）③ **跟老師討論**內容效度。寫操作型定義時要老實標明「自設量表，未經正式效度檢驗」，這是學術誠信。',
        },
    ],
    interview: [
        {
            title: '為什麼選這個社團',
            concept: '社團選擇的決策歷程（包括觸發因素、考量點、最終決定）',
            opdef: '訪綱主問：「請描述你決定加入這個社團的整個過程——從第一次知道到報名的那段時間發生了什麼？」**編碼類別**：① 觸發因素（誰／什麼引起注意）② 考量點（時間／興趣／朋友／升學）③ 決定關鍵（最後讓你下決心的那一刻）。',
            posExamples: ['「我是看到學長在迎新表演——這算 ① 觸發因素（學長）」', '「我考量過社團時間會不會撞到補習——這算 ② 考量點（時間）」'],
            negExamples: ['「我就是想參加啊」（沒有具體觸發／考量／關鍵——要追問）', '只記到結論「我選了 X 社」（沒有歷程資訊——要回頭問）'],
            threeChecks: {
                measurable: '受訪者口述事件 → 編碼進 3 類別 → 計次',
                posneg: '正反例就是「能不能編進類別」',
                consistent: '同一份訪綱+編碼簿用整個研究（建議雙人編碼一致率 ≥ 80%）',
            },
            note: '訪談的操作化重點不是訪綱寫得漂亮——是「**編碼類別**」要先想好，否則訪完一堆口述沒法分析。',
        },
        {
            title: '轉學生的適應歷程',
            concept: '轉入新環境後的心理與行為適應過程',
            opdef: '訪綱主問：「請從你決定轉學那天開始，講到現在——這段時間你經歷了哪些變化？」**編碼類別**：① 衝擊期（不適應／挫折／想回原校）② 摸索期（嘗試認識／找定位）③ 融入期（建立關係／投入學習）。每位受訪者標記三期的時間點與關鍵事件。',
            posExamples: ['「剛來第二週我哭了一個晚上」→ ① 衝擊期', '「第一個月我開始參加社團」→ ② 摸索期', '「現在我已經有固定的朋友圈」→ ③ 融入期'],
            negExamples: ['「我一開始就很適應」（沒有歷程）→ 追問「真的完全沒不適應的時刻嗎」'],
            threeChecks: {
                measurable: '三期時間點 + 關鍵事件數',
                posneg: '事件能不能歸到三期之一',
                consistent: '三期定義整個研究固定',
            },
        },
    ],
    experiment: [
        {
            title: '站立桌 vs 坐式桌對專注的影響',
            concept: '桌型對學習專注的影響',
            opdef: '**自變項**（操控）：桌型（站立桌組 / 坐式桌組）。**依變項**（測量）：專注力 = ① 算術測驗得分（30 題 5 分鐘）+ ② 自評專注度（1-5 分）。**控制變項**：受試者前一晚睡眠 ≥ 6 小時、實驗時段固定下午 2-3 點、教室光線 / 溫度 / 音量保持一致。',
            posExamples: ['站立組 vs 坐式組得分平均差 ≥ 2 分（有效果）', '同組內得分標準差 ≤ 3（一致性高）'],
            negExamples: ['沒控制睡眠（前晚熬夜的人混在組裡 → 結果不能歸因到桌型）', '兩組做不同題目（無法比較）'],
            threeChecks: {
                measurable: '得分（連續）+ 自評（順序）',
                posneg: '組別清楚（操控）；測量工具固定',
                consistent: '同一份題目、同樣計時、同樣計分整個實驗',
            },
            note: '實驗最容易踩的雷：**控制變項漏寫**——光控制不寫出來，結果不能歸因到自變項。',
        },
        {
            title: '聽音樂背單字 vs 安靜背',
            concept: '背景音樂對短期記憶的影響',
            opdef: '**自變項**：背景條件（巴哈賦格 60dB / 完全安靜）。**依變項**：5 分鐘後立即回憶 10 個不相關英文單字的得分（0-10）。**控制變項**：受試者母語為中文、英文程度 PR 50-70 區間、單字難度一致（GSAT 字頻 1-2 級）、實驗時段固定上午、未事先看過單字表。',
            posExamples: ['音樂組 vs 安靜組得分差 ≥ 1 分', '同組內得分穩定（標準差 ≤ 2）'],
            negExamples: ['兩組用不同單字表（無法比較難度）', '沒控制英文程度（強者集中在一組會偏誤）'],
            threeChecks: {
                measurable: '回憶得分（0-10）',
                posneg: '組別操控明確；計分標準固定',
                consistent: '單字表、計時、計分方式整個實驗一致',
            },
        },
    ],
    observation: [
        {
            title: '上課專心 v1（入門版）',
            concept: '上課專心（外顯指標：目視學習行為 on-task behavior）',
            opdef: '**行為類別**：視線停留在老師／黑板／課本連續 ≥ 10 秒，且當下無滑手機、趴睡、與旁人交談的動作。**計次方式**：一節課 50 分鐘，每 5 分鐘記錄一次該學生當下是否符合「專心」（10 次觀察點）。',
            posExamples: ['抄筆記同時眼睛看黑板', '舉手發問', '盯著老師示範實驗操作'],
            negExamples: ['滑手機（即使課本攤開）', '趴桌睡覺', '跟同學講話 ≥ 5 秒（非課程相關）'],
            threeChecks: {
                measurable: '10 個觀察點中符合「專心」的次數',
                posneg: '行為類別有明確時間閾值',
                consistent: '整堂課用同一定義',
            },
            note: '⚠️ 這個入門版有兩個盲點：① 觀察者要盯著學生眼睛才能判斷視線方向，班級規模做不到；② 「10 秒」可能反而是發呆。**改良版見下一張**。',
        },
        {
            title: '上課專心 v2（嚴謹版：時間取樣法）',
            concept: '上課專心 = 目視學習行為比率（on-task ratio）',
            opdef: '**方法**：每 2 分鐘掃描全班一次（50 分鐘 = 25 次掃描）。**分類**：① **A 在學習**（on-task）：眼睛朝向老師／黑板／課本／筆記本，且當下無干擾物。② **B 離題**（off-task）：滑手機、趴桌睡、與旁人非課程相關交談 ≥ 5 秒、發呆望窗外 ≥ 30 秒。③ **C 灰色**（過渡）：換姿勢、揉眼、喝水、整理書包 < 30 秒。**指標**：on-task 比率 = A 次數 ÷ (A+B) 次數，C 不計入分母（避免污染）。',
            posExamples: ['抄筆記、看黑板、舉手發問 → A', '完整 25 次掃描中 20 次為 A → on-task 比率 = 20/22 = 90.9%（C 排除 3 次）'],
            negExamples: ['滑手機、趴睡、聊閒天 → B', '揉眼睛 5 秒 → C（不污染分母）'],
            threeChecks: {
                measurable: 'on-task 比率（百分比，連續變項）',
                posneg: '三類定義精確；時間閾值具體；C 區處理污染',
                consistent: '掃描頻率、分類標準整個研究固定；建議雙人觀察一致率 ≥ 80%',
            },
            note: '✅ 這版可班級規模執行（一次掃描全班 30 秒）+ 雙人觀察一致率高 + 老實標明測的是「行為層 on-task」不是「內在心智狀態」。教學意義：**操作型定義要迭代，越精細越好**。',
        },
        {
            title: '下課的活動類型分布',
            concept: '下課時段學生的活動類型',
            opdef: '**方法**：下課 10 分鐘內，每 30 秒掃描一次（共 20 次掃描），記錄目標學生當下的行為類別。**分類**：① **靜態**：坐在位置上閱讀／滑手機／睡覺。② **移動**：走動／跑步／到別班。③ **社交**：≥ 2 人對話 ≥ 30 秒。④ **進食**：吃零食／喝飲料。⑤ **打掃／雜務**：擦黑板／倒垃圾／搬東西。',
            posExamples: ['坐位置上滑手機 → ①', '在走廊跑跳 → ②', '跟兩個同學圍著聊天 → ③'],
            negExamples: ['一個人發呆但沒移動 → 歸 ①（靜態）；社交至少 2 人 + 30 秒，缺一不算'],
            threeChecks: {
                measurable: '5 類別各自的次數 + 比例',
                posneg: '類別有具體判準（人數 / 時間 / 動作）',
                consistent: '5 類別整個研究固定',
            },
            note: '✅ 這題比「上課專心」**好做太多**——純行為分類，沒有內在狀態問題，雙人觀察一致率天然高。**選題目時優先挑這種「外顯行為」型概念**。',
        },
        {
            title: '圖書館自習的離座頻率',
            concept: '自習時的離座行為（可能反映分心、疲勞、社交需求）',
            opdef: '**方法**：自習 90 分鐘內，每次目標學生**起身離開座位**就計 1 次（不論時間長短）。**離座定義**：臀部離開椅面 ≥ 3 秒，且身體完全離開原座位範圍（≥ 50 公分）。**附帶記錄**：離座原因（觀察+標註：上廁所／找書／跟人講話／單純走動）。',
            posExamples: ['起身去廁所 → 1 次（原因：上廁所）', '起身找書架書 → 1 次（原因：找書）'],
            negExamples: ['伸懶腰但臀部沒離座 → 0 次', '挪動屁股換姿勢 → 0 次（範圍 < 50 公分）'],
            threeChecks: {
                measurable: '離座次數（90 分鐘內計次）',
                posneg: '離座定義有時間+空間閾值',
                consistent: '同一定義整個研究',
            },
        },
    ],
    literature: [
        {
            title: '校刊 5 年 AI 主題的論述變化（論述分析）',
            concept: '校刊對 AI 議題的論述立場演變',
            opdef: '**分析單位**：每篇校刊文章中提及「AI／人工智慧／ChatGPT／機器學習」的**段落**。**編碼類別**（論述策略）：① **強調**（讚美 AI 帶來的好處）② **淡化**（中性、技術介紹、不評價）③ **批評**（擔憂取代人類、學術誠信、隱私問題）。每段歸一類；模糊段標記為「未分類」並排除。**雙人編碼一致率 ≥ 80%** 才採用。',
            posExamples: ['「AI 將大幅提升學習效率」→ ① 強調', '「ChatGPT 是基於 Transformer 架構的語言模型」→ ② 淡化', '「學生用 AI 寫作業，等於放棄學習」→ ③ 批評'],
            negExamples: ['「AI 是個工具，看怎麼用」（兩面論述）→ 標未分類，不計入', '只用一個關鍵字搜尋（範圍太窄，遺漏其他相關文章）'],
            threeChecks: {
                measurable: '三類段落的次數+比例（連續變項+類別）',
                posneg: '三類有具體判準，未分類有處理',
                consistent: '同一份編碼簿整個研究',
            },
            note: '文獻分析的關鍵不是「找了多少篇」——是**編碼類別清楚**+雙人編碼一致率達標。',
        },
        {
            title: 'YouTuber 教育影片的內容分布（內容分析）',
            concept: '教育類 YouTube 影片的主題與形式分布',
            opdef: '**分析單位**：每支影片。**篩選條件**：訂閱數 ≥ 10 萬的台灣教育類頻道，2024 年發布的影片。**編碼類別**：① **主題**（學科教學／學習方法／升學資訊／生活技能）② **形式**（白板教學／實境拍攝／動畫／訪談）③ **長度**（短：< 5 分／中：5-15 分／長：> 15 分）。每支影片三類別都標。',
            posExamples: ['白板講解英文文法 15 分 → 主題：學科；形式：白板；長度：中', '實際操作實驗的影片 → 形式：實境'],
            negExamples: ['只看標題不看內容（標題可能誤導，要看影片開頭 1 分鐘）', '把「形式」與「主題」混淆'],
            threeChecks: {
                measurable: '三類別各自的次數+比例',
                posneg: '類別有具體判準（影片時長閾值、形式定義）',
                consistent: '同一份編碼簿整個研究；雙人編碼一致率 ≥ 80%',
            },
        },
    ],
};

/* ══════════════════════════════════════
 *  範例卡 component
 * ══════════════════════════════════════ */
function ExampleCard({ example, color, bg }) {
    return (
        <div className="bg-white border-2 rounded-[var(--radius-unified)] overflow-hidden" style={{ borderColor: color }}>
            <div className="px-5 py-3 flex items-center gap-2" style={{ background: bg }}>
                <Ruler size={16} style={{ color }} />
                <span className="font-bold text-[14px]" style={{ color }}>{example.title}</span>
            </div>
            <div className="p-5 space-y-3 text-[12.5px] leading-relaxed">
                {/* 核心概念 */}
                <div className="bg-[var(--paper-warm)] border-l-3 p-3 rounded-r-[6px]" style={{ borderLeftColor: color }}>
                    <div className="text-[10px] font-mono font-bold uppercase tracking-wider mb-1" style={{ color }}>① 核心概念</div>
                    <div className="text-[var(--ink)]">{example.concept}</div>
                </div>

                {/* 操作型定義 */}
                <div className="bg-white border border-[var(--border)] rounded-[6px] p-3">
                    <div className="text-[10px] font-mono font-bold uppercase tracking-wider mb-1.5" style={{ color }}>② 操作型定義</div>
                    <div className="text-[var(--ink-mid)] whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: example.opdef.replace(/\*\*(.+?)\*\*/g, '<strong class="text-[var(--ink)]">$1</strong>') }} />
                </div>

                {/* 正反例 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div className="bg-[var(--success-light)] border border-[var(--success)]/30 rounded-[6px] p-3">
                        <div className="text-[10px] font-mono font-bold text-[var(--success)] uppercase tracking-wider mb-1.5">✅ 正例（算）</div>
                        <ul className="list-disc list-inside text-[12px] space-y-0.5">
                            {example.posExamples.map((p, i) => <li key={i}>{p}</li>)}
                        </ul>
                    </div>
                    <div className="bg-[#FEF2F2] border border-[var(--danger)]/30 rounded-[6px] p-3">
                        <div className="text-[10px] font-mono font-bold text-[var(--danger)] uppercase tracking-wider mb-1.5">❌ 反例（不算 / 雷區）</div>
                        <ul className="list-disc list-inside text-[12px] space-y-0.5">
                            {example.negExamples.map((p, i) => <li key={i}>{p}</li>)}
                        </ul>
                    </div>
                </div>

                {/* 三件事檢核 */}
                <details className="bg-[var(--paper-warm)] rounded-[6px] border border-[var(--border)]">
                    <summary className="px-3 py-2 text-[12px] font-bold cursor-pointer hover:bg-[var(--gold-light)]">
                        🔍 三件事檢核（展開看）
                    </summary>
                    <div className="px-4 py-3 text-[12px] text-[var(--ink-mid)] leading-relaxed border-t border-[var(--border)] space-y-1">
                        <p>✅ <strong className="text-[var(--ink)]">可測量</strong>：{example.threeChecks.measurable}</p>
                        <p>✅ <strong className="text-[var(--ink)]">有正反例</strong>：{example.threeChecks.posneg}</p>
                        <p>✅ <strong className="text-[var(--ink)]">前後一致</strong>：{example.threeChecks.consistent}</p>
                    </div>
                </details>

                {/* 學生提醒（optional）—— note 支援 **粗體** Markdown，與 opdef 同步 */}
                {example.note && (
                    <div className="bg-[var(--gold-light)] border-l-3 border-[var(--gold)] p-3 rounded-r-[6px] text-[12px] text-[var(--ink)] leading-relaxed flex items-start gap-1.5">
                        <Lightbulb size={14} className="flex-shrink-0 mt-0.5 text-[var(--gold)]" />
                        <span dangerouslySetInnerHTML={{ __html: example.note.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>') }} />
                    </div>
                )}
            </div>
        </div>
    );
}

/* ══════════════════════════════════════
 *  主元件
 * ══════════════════════════════════════ */
export const OperationalizePage = () => {
    const [activeMethod, setActiveMethod] = useState('survey');
    const examples = EXAMPLES[activeMethod] || [];
    const tab = METHOD_TABS.find(m => m.id === activeMethod);

    return (
        <div className="page-container animate-in-fade-slide">
            {/* TOP BAR */}
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-4 mb-8 md:mb-12 gap-3">
                <div className="text-[11px] font-mono text-[var(--ink-light)] flex items-center gap-2 min-w-0">
                    <span className="hidden md:inline">研究方法與專題 / 研究工具 / </span>
                    <span className="text-[var(--ink)] font-bold">操作型定義範例庫</span>
                </div>
                <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
                    <span className="bg-[var(--paper-warm)] text-[var(--ink)] text-[10px] font-bold px-2 py-0.5 rounded-[2px] font-mono">SELF-LEARN</span>
                    <Link to="/w5" className="text-[11px] text-[var(--ink-light)] hover:text-[var(--accent)] transition-colors flex items-center gap-1 font-mono">
                        <ArrowLeft size={12} /> 回 W5 操作型定義
                    </Link>
                </div>
            </div>

            {/* HERO */}
            <div className="bg-[var(--paper-warm)] border border-[var(--border)] rounded-[var(--radius-unified)] p-6 mb-8">
                <div className="text-[11px] font-mono text-[var(--ink-mid)] tracking-wider mb-1">RESEARCH TOOLBOOK</div>
                <h1 className="text-[24px] font-bold text-[var(--ink)] mb-2">📐 操作型定義範例庫</h1>
                <p className="text-[13px] text-[var(--ink-mid)] leading-relaxed max-w-[760px]">
                    給想看更多範例的同學自學參考。共 <strong className="text-[var(--ink)]">13 個範例</strong>（5 法各 2-4 個，含「上課專心」入門版 vs 嚴謹版、問卷組「量表改編 vs 自設量表」兩種路線）。每張卡都有：核心概念 / 操作型定義 / 正反例 / 三件事檢核。
                </p>
                <div className="bg-white border-l-3 border-[var(--gold)] p-3 rounded-r-[6px] mt-4 text-[12px] text-[var(--ink-mid)] leading-relaxed">
                    <AlertTriangle size={14} className="inline mr-1 text-[var(--gold)]" />
                    <strong className="text-[var(--ink)]">怎麼用：</strong>先點開你 W4 主方法那個 tab → 找跟你題目最像的範例 → 套結構回去寫自己的（不是抄）。
                </div>
            </div>

            {/* TAB BAR */}
            <div className="flex flex-wrap gap-2 mb-6">
                {METHOD_TABS.map(m => {
                    const isActive = activeMethod === m.id;
                    return (
                        <button
                            key={m.id}
                            onClick={() => setActiveMethod(m.id)}
                            className={[
                                'px-4 py-2 rounded-[6px] border-2 text-[13px] font-bold transition-all flex items-center gap-1.5',
                                isActive
                                    ? 'border-[var(--ink)] bg-white shadow-sm'
                                    : 'border-[var(--border)] bg-white hover:border-[var(--accent)]',
                            ].join(' ')}
                            style={isActive ? { color: m.color } : { color: 'var(--ink-mid)' }}
                        >
                            <span className="text-[15px]">{m.icon}</span>
                            <span>{m.name}</span>
                            <span className="ml-1 text-[10px] font-mono opacity-60">{(EXAMPLES[m.id] || []).length}</span>
                        </button>
                    );
                })}
            </div>

            {/* 各方法的路線提示（如果適用） */}
            {activeMethod === 'survey' && (
                <div className="bg-[var(--accent-light)] border-l-4 border-[var(--accent)] p-3 rounded-r-[6px] mb-4 text-[12.5px] text-[var(--ink)] leading-relaxed">
                    <strong className="text-[var(--ink)]">📋 問卷組的兩條路線：</strong>
                    <span className="ml-1">①「**量表改編型**」（前 3 例）——你的概念有現成已驗證量表，找來改編就好（最省心）。</span>
                    <span>②「**自設量表型**」（第 4 例）——找不到現成量表，自己設計題目（要做 pilot + 寫設計理由）。</span>
                    <span className="block text-[11.5px] text-[var(--ink-light)] italic mt-1">先問自己：我的概念（例：壓力／焦慮）是不是心理學常測的？是 → 路線 ①；不是（例：班級歸屬感、補習依賴）→ 路線 ②。</span>
                </div>
            )}

            {/* EXAMPLES */}
            <div className="space-y-6">
                {examples.length > 0 ? (
                    examples.map((ex, i) => (
                        <ExampleCard key={i} example={ex} color={tab.color} bg={tab.bg} />
                    ))
                ) : (
                    <p className="text-[13px] text-[var(--ink-light)] italic">這個方法的範例還在補充中。</p>
                )}
            </div>

            {/* FOOTER */}
            <div className="mt-12 pt-6 border-t border-[var(--border)] text-[12px] text-[var(--ink-light)] leading-relaxed">
                <p>💡 範例<strong>不是標準答案</strong>——你題目的核心概念可能不在這裡，要套結構自己想。看完還是寫不出？回 <Link to="/w5" className="text-[var(--accent)] hover:underline">W5 操作型定義</Link> 找老師。</p>
            </div>
        </div>
    );
};

export default OperationalizePage;
