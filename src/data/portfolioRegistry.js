// 學習歷程策展室 · 欄位登記表
// 集中定義每週的 weekLabel、weekRoute 與所有 ThinkRecord dataKey 的對應標籤與題目
// 來源：各週 Page 的 <ExportButton fields={...} />
// 任何週次的欄位有變動時，同步更新此檔即可，Portfolio.jsx 會自動反映

export const PORTFOLIO_REGISTRY = [
  {
    weekNum: 0,
    weekLabel: 'W0 偵探特訓班',
    weekRoute: '/w0',
    fields: [],
  },
  {
    weekNum: 1,
    weekLabel: 'W1 模仿遊戲',
    weekRoute: '/w1',
    fields: [
      { key: 'w1-research-exp', label: '我與研究的距離', question: '你做過「研究」嗎？說說你的經驗' },
      { key: 'w1-life-observe', label: '生活觀察種子', question: '寫下一個讓你覺得奇怪、不合理的生活現象' },
      { key: 'w1-suspect-reason', label: '模仿遊戲：我的推理', question: '你覺得 AI 是幾號？為什麼？' },
      { key: 'w1-imitation-reaction', label: '模仿遊戲：揭曉後的反應', question: '知道真相後，你的反應是？' },
      { key: 'w1-aired-hard', label: 'AI-RED 最難遵守的一條', question: 'AI-RED 五個步驟裡，你覺得哪一個最難遵守？為什麼？' },
      { key: 'w1-human-ai-observe', label: '人機協作觀察筆記', question: '觀察老師示範後，哪些步驟是人做的？哪些是 AI 做的？' },
      { key: 'w1-self-expect', label: '對自己的期許', question: '經過今天的課，你對這學期的自己有什麼期許？' },
      { key: 'w1-aired-record', label: 'AI-RED 敘事紀錄', question: '本週最重要的一次 AI 互動（A-I-R-E-D 五要素）' },
    ],
  },
  {
    weekNum: 2,
    weekLabel: 'W2 問題意識的覺醒',
    weekRoute: '/w2',
    fields: [
      { key: 'w2-practice1-phenomenon', label: '[暖身 ①垃圾] 現象', question: '像攝影機一樣描述（暖身練習，評分寬鬆）' },
      { key: 'w2-practice1-gap', label: '[暖身 ①垃圾] 落差', question: '應該是⋯但實際上⋯（暖身）' },
      { key: 'w2-practice1-hypotheses', label: '[暖身 ①垃圾] 假設', question: '可能的 3-5 個解釋（暖身）' },
      { key: 'w2-practice2-phenomenon', label: '[暖身 ②課堂] 現象', question: '像攝影機一樣描述（暖身）' },
      { key: 'w2-practice2-gap', label: '[暖身 ②課堂] 落差', question: '應該是⋯但實際上⋯（暖身）' },
      { key: 'w2-practice2-hypotheses', label: '[暖身 ②課堂] 假設', question: '可能的 3-5 個解釋（暖身）' },
      { key: 'w2-step1-phenomenon', label: 'Step 1 現象', question: '像攝影機一樣，你看到了什麼？（至少 30 字）' },
      { key: 'w2-step2-gap', label: 'Step 2 落差', question: '哪裡跟你想的不一樣？矛盾在哪？' },
      { key: 'w2-step3-question', label: 'Step 3 展開假設', question: '這個矛盾背後可能的 3-5 個解釋' },
      { key: 'w2-abc-judgment', label: '第一輪：挑選假設＋ABC 型判斷', question: '你選哪個假設？為什麼選它？它屬於 A／B／C 哪型？' },
      { key: 'w2-rq-draft', label: '第一輪：研究問題草稿（自寫）', question: '你自己先寫一句研究問題（給 AI 審用的）' },
      { key: 'w2-ai-intent-choice', label: '第三輪：AI 審核後的決定', question: '審核後你決定保留自己的、採 AI 改寫、還是混合？' },
      { key: 'w2-final-intent', label: '最終研究問題', question: '你的最終研究問題（帶去 W3 的版本）' },
      { key: 'w2-aired-record', label: 'AI-RED 敘事紀錄', question: '本週最重要的一次 AI 互動（A-I-R-E-D 五要素）' },
    ],
  },
  {
    weekNum: 3,
    weekLabel: 'W3 題目健檢',
    weekRoute: '/w3',
    fields: [
      { key: 'w3-obstacle-feel', label: '碰壁體驗', question: '看完兩題碰壁情境後，你覺得「題目生病」是什麼感覺？' },
      { key: 'w3-disease-quiz', label: '病症快問快答', question: '選一個你覺得最難判斷的病症，說說為什麼難。' },
      { key: 'w3-drill-personal', label: '人腦練習（個人）', question: '自選一題爛題目，診斷是什麼病？用心法怎麼改？' },
      { key: 'w3-drill-group', label: '小組診斷', question: '小組選了哪一題？一起怎麼改的？' },
      { key: 'w3-ai-collab-compare', label: 'AI 協作練手：比對差異', question: '你的診斷 vs AI 的診斷，哪裡不同？' },
      { key: 'w3-ai-collab-choose', label: 'AI 協作練手：選擇理由', question: 'AI 給了 3 個改法，你選了哪個？為什麼？' },
      { key: 'w3-aired-record', label: 'AI-RED 敘事紀錄', question: '本週最重要的一次 AI 互動（A-I-R-E-D 五要素）' },
    ],
  },
  {
    weekNum: 4,
    weekLabel: 'W4 方法地圖',
    weekRoute: '/w4',
    fields: [
      { key: 'w4-my-topic', label: '我這週要選方法的題目', question: '從 W3 帶入的定案題目（可微調）' },
      { key: 'w4-layer1', label: '第一層判斷（資料來源）', question: '我的資料要自己收集，還是分析已有文本？' },
      { key: 'w4-layer2', label: '第二層判斷（三題分流）', question: '最關鍵的那一條分科問題（❶／❷／❸）以及我的回答' },
      { key: 'w4-main-method', label: '主要方法', question: '問卷／訪談／實驗／觀察／文獻分析？（文獻分析請寫子類型：歷史／內容／論述／敘事）' },
      { key: 'w4-reason', label: '選擇理由', question: '為什麼選這個方法？請引用兩層判斷中的某一條' },
      { key: 'w4-aux-method', label: '輔助方法', question: '需要輔助方法嗎？是什麼？為什麼？' },
      { key: 'w4-reflect-confused', label: '反思 1：最易搞混的方法', question: '你最容易搞混的兩種方法是哪兩個？關鍵差別在哪一條兩層判斷？' },
      { key: 'w4-reflect-literature', label: '反思 2：文獻 vs 文獻分析', question: '「文獻回顧」與「文獻分析法」的差別是什麼？你的題目會走哪一條？' },
      { key: 'w4-aired-record', label: 'AI-RED 敘事紀錄', question: '本週最重要的一次 AI 互動（A-I-R-E-D 五要素）—— 本週 optional，沒用 AI 可跳過' },
    ],
  },
  {
    weekNum: 5,
    weekLabel: 'W5 操作型定義',
    weekRoute: '/w5',
    fields: [
      { key: 'w5-my-topic', label: '我的題目（從 W4 帶入）' },
      { key: 'w5-my-method', label: '我的主要方法（從 W4 帶入）' },
      { key: 'w5-core-concept', label: '核心概念', question: '我題目最關鍵的核心概念是什麼？（壓力／動機／學習效果……）' },
      { key: 'w5-operationalize', label: '操作型定義', question: '這個概念怎麼測／怎麼問／怎麼觀察？對應你的方法。' },
      { key: 'w5-pos-neg', label: '正反例', question: '什麼算？什麼不算？至少各一個例子。' },
      { key: 'w5-reflect', label: '反思：模糊→可測的轉化', question: '把抽象概念變可測，最難的是什麼？你怎麼克服？' },
      { key: 'w5-aired-record', label: 'AI-RED 敘事紀錄', question: '本週最重要的一次 AI 互動（A-I-R-E-D 五要素）' },
    ],
  },
  {
    weekNum: 6,
    weekLabel: 'W6 海報博覽會 + 組隊',
    weekRoute: '/w6',
    fields: [
      { key: 'w6-from-w3-topic', label: 'W3 帶入：題目' },
      { key: 'w6-from-w4-method', label: 'W4 帶入：主方法' },
      { key: 'w6-from-w5-operationalize', label: 'W5 帶入：操作型定義' },
      { key: 'w6-walk-feedback', label: '走讀蒐集到的回饋（3 位同學一人一條）', question: '海報⑤格上 3 位同學各寫了什麼？' },
      { key: 'w6-route', label: '路線選擇', question: 'Team 合題組隊 / Solo 單飛' },
      { key: 'w6-team-topic', label: '【Team 線】合題後的共同題目' },
      { key: 'w6-team-members', label: '【Team 線】隊員與分工' },
      { key: 'w6-team-rationale', label: '【Team 線】合題理由', question: '為什麼這幾個人題目可以合？' },
      { key: 'w6-solo-reason', label: '【Solo 線】非 Solo 不可的理由' },
      { key: 'w6-solo-workload', label: '【Solo 線】4 章工作量規劃' },
      { key: 'w6-solo-risk', label: '【Solo 線】三大風險' },
      { key: 'w6-solo-rescue', label: '【Solo 線】求援計畫' },
      { key: 'w6-solo-planb', label: '【Solo 線】Plan B 備案' },
      { key: 'w6-reflect', label: '反思：走讀最重要的 1 條回饋', question: '哪一條建議最有用？你怎麼處理？' },
      { key: 'w6-aired-record', label: 'AI-RED 敘事紀錄', question: '本週最重要的一次 AI 互動（A-I-R-E-D 五要素）' },
    ],
  },
  {
    weekNum: 7,
    weekLabel: 'W7 文獻搜尋',
    weekRoute: '/w7',
    fields: [
      { key: 'w7-topic', label: '本週題目（從前面週次帶入）', question: '你帶到 W7 找文獻的題目是什麼？' },
      { key: 'w7-search-keywords', label: '搜尋關鍵字', question: '你用了哪些關鍵字去華藝搜尋？' },
      { key: 'w7-search-strategy', label: '搜尋策略', question: '你用了什麼搜尋策略？（搜尋位置、限制條件、資料庫）' },
      { key: 'w7-found-paper', label: '找到的第一篇文獻', question: '你找到哪篇論文？標題、作者、年份、跟你的題目有什麼關係？' },
      { key: 'w7-apa-practice', label: 'APA 格式練習', question: '用 APA 格式寫出你找到的那篇論文的書目' },
      { key: 'w7-forensic-a', label: '證物 A 鑑識', question: '證物 A 你判定什麼等級？理由和查核路徑是？' },
      { key: 'w7-forensic-b', label: '證物 B 鑑識', question: '證物 B 你判定什麼等級？理由和查核路徑是？' },
      { key: 'w7-forensic-c', label: '證物 C 鑑識', question: '證物 C 你判定什麼等級？理由和查核路徑是？' },
      { key: 'w7-forensic-d', label: '證物 D 鑑識', question: '證物 D 你判定什麼等級？理由和查核路徑是？' },
      { key: 'w7-forensic-e', label: '證物 E 鑑識', question: '證物 E 你判定什麼等級？理由和查核路徑是？' },
      { key: 'w7-hardest', label: '小組總結：最難判斷的證物', question: '你們組覺得最難判斷的是哪一張？為什麼？' },
      { key: 'w7-aired-record', label: 'AI-RED 敘事紀錄', question: '本週最重要的一次 AI 互動（A-I-R-E-D 五要素）' },
    ],
  },
  {
    weekNum: 8,
    weekLabel: 'W8 文獻偵探社',
    weekRoute: '/w8',
    fields: [
      { key: 'w8-detect-a', label: '學生甲偵錯', question: '學生甲的改寫有什麼問題？你勾了哪些、理由是什麼？' },
      { key: 'w8-detect-b', label: '學生乙偵錯', question: '學生乙的改寫有什麼問題？你勾了哪些、理由是什麼？' },
      { key: 'w8-my-rewrite', label: '我的改寫', question: '把原文遮住，用自己的話改寫王大明（2022）的研究發現' },
      { key: 'w8-sandwich-ref', label: '三明治引用：選用文獻', question: '你用哪篇文獻來練三明治引用？（作者年份）' },
      { key: 'w8-sandwich-claim', label: '三明治：觀點句', question: '第 1 層觀點句——你的主張是什麼？' },
      { key: 'w8-sandwich-evidence', label: '三明治：引用句', question: '第 2 層引用句——某某（年份）發現了什麼？' },
      { key: 'w8-sandwich-analysis', label: '三明治：分析句', question: '第 3 層分析句——這個證據說明了什麼？跟你的研究有什麼關係？' },
      { key: 'w8-lit-review', label: '文獻探討段落（演練 3）', question: '用三篇文獻寫出至少 5 句的文獻探討，最後一句連回你的研究題目' },
      { key: 'w8-peer-review', label: '同儕幫我審查的結果', question: '同儕幫你審查演練 3 後，給了什麼具體建議？你根據建議修改了什麼？' },
      { key: 'w8-aired-record', label: 'AI-RED 敘事紀錄', question: '本週最重要的一次 AI 互動（A-I-R-E-D 五要素）' },
    ],
  },
  {
    weekNum: 9,
    weekLabel: 'W9 診斷語言 × 五章地基工程',
    weekRoute: '/w9',
    fields: [
        { key: 'w9-my-method', label: '我的研究方法' },
      { key: 'w9-ai-mode', label: 'AI 使用模式', question: '🎓 教學型（寫不出某章請示範）/ 🥊 驗收型（有初稿請壓力測試）' },
      { key: 'w9-plan-ai-check', label: 'AI 互動後的判斷紀錄', question: 'AI 指出的問題 / 給的範例 + 採納/不採納決定' },
      { key: 'w9-ai-dialog-submission', label: 'AI 完整對話繳交方式（必填）', question: 'A 私人註解 / B 文件上傳並貼連結' },
      { key: 'w9-plan-ch1-checklist', label: '五章地基工程進度', question: '本節繳交驗收 7 項勾選' },
      { key: 'w9-aired-record', label: 'W9 完整 AIRED 敘事（含 AI 檢核 R 欄位）', question: '本週最重要的一次 AI 互動（A-I-R-E-D 五要素）' },
      { key: 'w9-homework-commitment', label: '課後三件事時間承諾（選填）', question: '打算什麼時候補第三、四章／跑 AI／上傳 GC？' },
    ],
  },
  {
    weekNum: 10,
    weekLabel: 'W10 工具設計 × 整本 AI 檢核 × 定稿繳交',
    weekRoute: '/w10',
    fields: [
      { key: 'w10-entry-self-report', label: '入場自報（W9 docx 完成度）', question: '第二~五章章節完成狀況' },
      { key: 'w10-w9-feedback-quick', label: 'W9 老師回饋快速摘要', question: '老師對 W9 計畫書第一~五章的主要建議' },
      { key: 'w10-tool-design-notes', label: '工具設計關鍵決策', question: '第六章工具設計中的 2-3 個關鍵決定' },
      { key: 'w10-teacher-consult', label: '老師諮詢區紀錄', question: '老師指出的主要問題 + 我修了什麼 + 想送 AI 的' },
      { key: 'w10-ai-mode', label: 'AI 使用模式', question: '🎓 教學型（不知怎麼設計題目請示範）/ 🥊 驗收型（有題目初稿請找毛病）' },
      { key: 'w10-ai-dialog-submission', label: 'AI 完整對話繳交方式（必填）', question: 'A 私人註解 / B 文件上傳並貼連結' },
      { key: 'w10-ai-raw-feedback', label: 'AI 回覆原文（含 A+I 前置）', question: 'A: 用什麼 AI | I: 問了什麼 | R: AI 完整回覆' },
      { key: 'w10-ai-judge', label: 'AI 建議採納判斷（E: Evaluation）', question: '採納／不採納／部分採納的決定與理由' },
      { key: 'w10-tool-revision', label: '整本修正紀錄（D: Decision）', question: '根據 AI 建議修改了哪些章節？' },
    ],
  },
  {
    weekNum: 11,
    weekLabel: 'W11 Pilot Test × 倫理審查 × 施測啟動',
    weekRoute: '/w11',
    fields: [
      { key: 'w11-w10-feedback-quick', label: 'W10 老師回饋快速摘要', question: '老師對 W10 計畫書定稿的主要建議' },
      { key: 'w11-pilot-partner', label: 'Pilot Test 對象', question: '組內輪轉配對到誰？' },
      { key: 'w11-pilot-findings', label: 'Pilot Test 發現', question: '預試者的口頭 + 書面回饋、工具卡點' },
      { key: 'w11-tool-final-revision', label: '工具第二輪修正', question: '根據 Pilot 回饋要改的地方' },
      { key: 'w11-ethics-consent', label: '倫理 · 知情同意' },
      { key: 'w11-ethics-privacy', label: '倫理 · 保密性' },
      { key: 'w11-ethics-harm', label: '倫理 · 不傷害' },
      { key: 'w11-ethics-voluntary', label: '倫理 · 自願性' },
      { key: 'w11-consent-ai', label: 'AI 知情同意書審查回覆' },
      { key: 'w11-consent-judge', label: 'AI 建議採納判斷' },
      { key: 'w11-plan-target', label: '施測目標與底線' },
      { key: 'w11-plan-schedule', label: 'W12-W13 執行時程' },
      { key: 'w11-plan-backup', label: '應急備案' },
      { key: 'w11-launch', label: '施測啟動宣告' },
      { key: 'w11-aired-record', label: 'W11 完整 AIRED 敘事', question: '本週最重要的一次 AI 互動（A-I-R-E-D 五要素）' },
    ],
  },
  {
    weekNum: 12,
    weekLabel: 'W12 執行週 I：研究診所 Open Office',
    weekRoute: '/w12',
    fields: [
      { key: 'w12-feedback-summary', label: 'W11 老師回饋摘要（用自己的話）', question: '老師指出我們最主要的問題是？' },
      { key: 'w12-feedback-action', label: '讀完 W11 回饋後的行動轉譯', question: '今天最該先處理的一件事 + 怎麼做？' },
      { key: 'w12-diary-1', label: '關鍵行動 1' },
      { key: 'w12-diary-2', label: '關鍵行動 2' },
      { key: 'w12-diary-3', label: '關鍵行動 3' },
      { key: 'w12-pivot-record', label: '轉向決策（失敗 framing）', question: '我這週發現了什麼跟原計畫不一樣的事？我打算怎麼調整？' },
      { key: 'w12-midterm-status', label: 'W13 中期報告：現況' },
      { key: 'w12-midterm-gap', label: 'W13 中期報告：缺口' },
      { key: 'w12-midterm-plan', label: 'W13 中期報告：計畫' },
      { key: 'w12-aired-record', label: 'AI-RED 敘事紀錄', question: '本週最重要的一次 AI 互動（A-I-R-E-D 五要素）' },
    ],
  },
  {
    weekNum: 13,
    weekLabel: 'W13 資料整理週：原始資料 → 分析表',
    weekRoute: '/w13',
    fields: [
      { key: 'w13-method', label: '我的研究方法', question: '問卷／訪談／實驗／觀察／文獻分析' },
      { key: 'w13-data-state', label: '我的原始資料現況', question: '我手上原本的資料是什麼樣子？來自哪裡？' },
      { key: 'w13-table-structure', label: '我的分析表結構（必做）', question: '欄位名稱列表 + 列數 + N 值 + 編碼類別（如果是訪談/觀察/文獻）' },
      { key: 'w13-route-choice', label: '我選的整理路線', question: '純人工 or AI 輔助？為什麼？' },
      { key: 'w13-ai-mode', label: 'AI 使用模式（路線 B）', question: '🎓 教學型（從零到一）/ 🥊 驗收型（從 1 到 100）' },
      { key: 'w13-ai-validation', label: 'AI 輔助驗收紀錄（路線 B 必填）', question: '我做了哪些驗收？發現 AI 哪裡跑偏 / 幻覺？' },
      { key: 'w13-ai-dialog-submission', label: 'AI 完整對話繳交方式（路線 B 必填）', question: '我用哪種方式繳交完整對話？（A 私人註解 / B 文件上傳並貼連結）' },
      { key: 'w13-table-link', label: '分析表連結（必繳）', question: '我的 Google Sheet（或 Excel）公開／可閱讀連結' },
      { key: 'w13-progress-status', label: '整理進度自評', question: '🟢 已成型／🟡 半成品／🔴 還在掙扎' },
      { key: 'w13-w14-question', label: 'W14 第一張圖', question: '下週我要請 Gemini 幫我畫的第一張圖是什麼？想看什麼變項？' },
      { key: 'w13-aired-record', label: 'AI-RED 敘事紀錄（路線 B 必填）', question: '本週用 AI 整理資料的最重要互動（A-I-R-E-D 五要素）' },
    ],
  },
  {
    weekNum: 14,
    weekLabel: 'W14 讓數據自己說話：圖表選擇與圖的說明',
    weekRoute: '/w14',
    fields: [
      { key: 'w14-chart-exercise', label: '圖表決策演練', question: '四題圖表配對答案' },
      { key: 'w14-chart-debug', label: '圖表除錯', question: '小明的圓餅圖錯在哪？' },
      { key: 'w14-format-exercise', label: '格式規範演練' },
      { key: 'w14-case-3', label: '描述+推論整合練習' },
      { key: 'w14-ai-mode', label: 'AI 使用模式', question: '🎓 教學型（從零到一）/ 🥊 驗收型（從 1 到 100）' },
      { key: 'w14-pre-judgment', label: '草圖判讀（驗收型必填）', question: '我預期會看到什麼趨勢？最重要的發現是什麼？' },
      { key: 'w14-teach-reflection', label: '教學型反思（教學型必填）', question: 'AI 教我什麼？我自己選什麼方向？' },
      { key: 'w14-my-chart-type', label: '我的圖表類型與理由' },
      { key: 'w14-ai-blindspot', label: 'AI 找到的盲點 / 我沒注意到的趨勢' },
      { key: 'w14-validation-check', label: '圖表驗收結果' },
      { key: 'w14-my-description', label: '我的描述（藍筆）' },
      { key: 'w14-my-inference', label: '我的推論（紅筆）' },
      { key: 'w14-ai-pressure-test', label: 'AI 壓力測試後我做了哪些修正' },
      { key: 'w14-ai-dialog-submission', label: 'AI 完整對話繳交方式（必填）', question: 'A 私人註解 / B 文件上傳並貼連結' },
      { key: 'w14-w15-preview', label: 'W15 預告：結論的第三層和第四層' },
      { key: 'w14-aired-record', label: 'AI-RED 敘事紀錄（本週必填）', question: '本週用 AI 畫圖的最重要一次互動（A-I-R-E-D 五要素）' },
    ],
  },
  {
    weekNum: 15,
    weekLabel: 'W15 從圖的說明到研究結論：四層次寫作工作坊',
    weekRoute: '/w15',
    fields: [
      { key: 'w15-foreshadow', label: 'W14 伏筆填答' },
      { key: 'w15-ai-mode', label: 'AI 使用模式', question: '🎓 教學型（寫不出來請示範）/ 🥊 驗收型（有初稿請壓力測試）' },
      { key: 'w15-draft-describe', label: '初稿：描述層' },
      { key: 'w15-draft-interpret', label: '初稿：詮釋層' },
      { key: 'w15-draft-anchor', label: '初稿：回扣層' },
      { key: 'w15-draft-critique', label: '初稿：批判層' },
      { key: 'w15-ai-feedback', label: 'AI 檢核建議紀錄' },
      { key: 'w15-judge-table', label: '裁奪紀錄' },
      { key: 'w15-rejected', label: '拒絕 AI 的建議與原因' },
      { key: 'w15-human-context', label: 'AI 說不出來但我知道的脈絡' },
      { key: 'w15-final-draft', label: '最終四層結論草稿' },
      { key: 'w15-ai-helpful', label: 'AI 最有幫助的地方' },
      { key: 'w15-ai-limit', label: 'AI 最大的限制' },
      { key: 'w15-ai-blind-trust', label: '完全相信 AI 會犯的錯' },
      { key: 'w15-ai-dialog-submission', label: 'AI 完整對話繳交方式（必填）', question: 'A 私人註解 / B 文件上傳並貼連結' },
      { key: 'w15-aired-record', label: 'AI-RED 敘事紀錄（必填）', question: '本週用 AI 壓力測試四層結論的最重要一次互動（A-I-R-E-D 五要素）' },
    ],
  },
  {
    weekNum: 16,
    weekLabel: 'W16 報告撰寫與海報製作',
    weekRoute: '/w16',
    fields: [
      { key: 'w16-role', label: '我的角色' },
      { key: 'w16-abstract-cores', label: '各章核心句' },
      { key: 'w16-abstract-ai', label: 'AI 摘要初稿' },
      { key: 'w16-abstract-edit', label: '我修改的部分' },
      { key: 'w16-abstract-final', label: '最終摘要' },
      { key: 'w16-polish-chapter', label: 'AI 潤色紀錄（哪一章）' },
      { key: 'w16-polish-diff', label: 'AI 潤色差異' },
      { key: 'w16-polish-judge', label: '保留/刪掉/改回去' },
      { key: 'w16-checkup-result', label: 'AI 健檢結果' },
      { key: 'w16-checkup-action', label: '我決定改什麼' },
      { key: 'w16-poster-title', label: '海報大標題' },
      { key: 'w16-poster-finding', label: '最核心發現' },
      { key: 'w16-poster-chart', label: '關鍵圖表' },
      { key: 'w16-poster-conclusion', label: '海報結論' },
      { key: 'w16-peer-memory', label: '同儕 3 秒記住的' },
      { key: 'w16-peer-reflect', label: '互評反思' },
      { key: 'w16-aired-record', label: 'AI-RED 敘事紀錄', question: '本週最重要的一次 AI 互動（A-I-R-E-D 五要素）' },
    ],
  },
  {
    weekNum: 17,
    weekLabel: 'W17 Gallery Walk 成果發表',
    weekRoute: '/w17',
    fields: [],
  },
];

/**
 * 讀取學生所有 ThinkRecord，並與 registry 交叉比對，
 * 回傳每週「已填欄位」的摘要列表。
 *
 * @returns {Array<{ weekNum, weekLabel, weekRoute, filled, total, moments }>}
 *   moments: [{ key, label, question, value }] 只包含有填值的欄位
 */
export function buildTimeline() {
  let records = {};
  try {
    const raw = localStorage.getItem('rib_think_records');
    if (raw) records = JSON.parse(raw);
  } catch {
    records = {};
  }

  return PORTFOLIO_REGISTRY.map((week) => {
    const moments = week.fields
      .map((f) => {
        const val = (records[f.key] || '').trim();
        if (!val) return null;
        return {
          key: f.key,
          label: f.label,
          question: f.question || '',
          value: val,
        };
      })
      .filter(Boolean);

    return {
      weekNum: week.weekNum,
      weekLabel: week.weekLabel,
      weekRoute: week.weekRoute,
      filled: moments.length,
      total: week.fields.length,
      moments,
    };
  });
}

export const PORTFOLIO_CURATION_KEY = 'researchNavigator_portfolioCuration';

/**
 * 從 localStorage 讀取策展狀態
 * 結構：{ selected: { [key]: true }, reflections: { [key]: { why, now } }, meta: { name, class, title, semesterReflection } }
 */
export function readCuration() {
  try {
    const raw = localStorage.getItem(PORTFOLIO_CURATION_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return { selected: {}, reflections: {}, meta: {} };
}

export function writeCuration(state) {
  try {
    localStorage.setItem(PORTFOLIO_CURATION_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

export const MAX_CURATED = 10;
