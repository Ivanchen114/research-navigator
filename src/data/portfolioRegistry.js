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
      { key: 'w2-step1-phenomenon', label: 'Step 1 現象', question: '像攝影機一樣，你看到了什麼？（至少 30 字）' },
      { key: 'w2-step2-gap', label: 'Step 2 落差', question: '哪裡跟你想的不一樣？矛盾在哪？' },
      { key: 'w2-step3-question', label: 'Step 3 核心疑問', question: '你最想搞清楚的那一件事，白話說' },
      { key: 'w2-ai-gap-choice', label: 'AI 落差擴充：我的選擇', question: 'AI 給了 5 個落差，你選了哪一個？為什麼？' },
      { key: 'w2-abc-judgment', label: 'ABC 型判斷（人腦先行）', question: '你判斷是哪一型？為什麼？白話初稿？' },
      { key: 'w2-ai-intent-choice', label: 'AI 三方向：我的選擇', question: 'AI 給了 3 個方向，你選哪一個？為什麼？' },
      { key: 'w2-final-intent', label: '最終探究意圖', question: '你的最終探究意圖（帶去 W3 的版本）' },
      { key: 'w2-aired-record', label: 'AI-RED 記錄', question: '用了什麼 AI、問了什麼、你的評估' },
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
    weekLabel: 'W4 題目博覽會',
    weekRoute: '/w4',
    fields: [
      { key: 'w4-5w1h-who', label: '5W1H — Who（對象）', question: '研究的是誰？要具體到一個可接觸的群體。' },
      { key: 'w4-5w1h-where', label: '5W1H — Where（場域）', question: '在哪個地點或範圍內進行？' },
      { key: 'w4-5w1h-what', label: '5W1H — What（變項）', question: '核心概念是什麼？要能測量。' },
      { key: 'w4-5w1h-when', label: '5W1H — When（時間）', question: '有特定的時間點或情境嗎？' },
      { key: 'w4-5w1h-how', label: '5W1H — How（方法）', question: '用問卷？訪談？觀察？文獻？實驗？' },
      { key: 'w4-initial-topic', label: 'AI 包裝後的定案題目', question: '經過 AI 句型優化後，你帶進海報的題目是什麼？' },
      { key: 'w4-aired-record', label: 'AI-RED 記錄', question: '這次 AI 協作中，你的 AI-RED 五欄分別記了什麼？' },
      { key: 'w4-motivation-raw', label: '白話版動機（自己寫的）', question: '用跟朋友聊天的方式，說說你為什麼想研究這個題目？' },
      { key: 'w4-title-draft', label: '標題草稿', question: '用口語問句寫一個吸引人的標題' },
      { key: 'w4-prediction', label: '預期發現', question: '你預測這個研究可能發現什麼？大膽猜 2-3 個' },
      { key: 'w4-feedback-accept', label: 'Gallery Walk：我接受的建議', question: '同學給的建議中，你接受了哪些？怎麼改？' },
      { key: 'w4-feedback-reject', label: 'Gallery Walk：我不接受的建議', question: '你不採納哪些建議？理由是？' },
      { key: 'w4-final-topic', label: 'W4 最終定案題目', question: '經過壓力測試後，你的最終定案題目是什麼？' },
      { key: 'w4-final-motivation', label: 'W4 最終研究動機', question: '你的最終研究動機是什麼？' },
    ],
  },
  {
    weekNum: 5,
    weekLabel: 'W5 文獻搜尋入門',
    weekRoute: '/w5',
    fields: [
      { key: 'w5-topic', label: 'W4 定案題目（帶入）', question: '你的 W4 最終定案題目是什麼？' },
      { key: 'w5-search-keywords', label: '搜尋關鍵字', question: '你用了哪些關鍵字去華藝搜尋？' },
      { key: 'w5-search-strategy', label: '搜尋策略', question: '你用了什麼搜尋策略？（搜尋位置、限制條件、資料庫）' },
      { key: 'w5-found-paper', label: '找到的第一篇文獻', question: '你找到哪篇論文？標題、作者、年份、跟你的題目有什麼關係？' },
      { key: 'w5-apa-practice', label: 'APA 格式練習', question: '用 APA 格式寫出你找到的那篇論文的書目' },
      { key: 'w5-forensic-a', label: '證物 A 鑑識', question: '證物 A 你判定什麼等級？理由和查核路徑是？' },
      { key: 'w5-forensic-b', label: '證物 B 鑑識', question: '證物 B 你判定什麼等級？理由和查核路徑是？' },
      { key: 'w5-forensic-c', label: '證物 C 鑑識', question: '證物 C 你判定什麼等級？理由和查核路徑是？' },
      { key: 'w5-forensic-d', label: '證物 D 鑑識', question: '證物 D 你判定什麼等級？理由和查核路徑是？' },
      { key: 'w5-forensic-e', label: '證物 E 鑑識', question: '證物 E 你判定什麼等級？理由和查核路徑是？' },
      { key: 'w5-hardest', label: '小組總結：最難判斷的證物', question: '你們組覺得最難判斷的是哪一張？為什麼？' },
      { key: 'w5-aired-record', label: 'AI-RED 敘事紀錄', question: '本週最重要的一次 AI 互動（A-I-R-E-D 五要素）' },
    ],
  },
  {
    weekNum: 6,
    weekLabel: 'W6 文獻偵探社',
    weekRoute: '/w6',
    fields: [
      { key: 'w6-detect-a', label: '學生甲偵錯', question: '學生甲的改寫有什麼問題？你勾了哪些、理由是什麼？' },
      { key: 'w6-detect-b', label: '學生乙偵錯', question: '學生乙的改寫有什麼問題？你勾了哪些、理由是什麼？' },
      { key: 'w6-my-rewrite', label: '我的改寫', question: '把原文遮住，用自己的話改寫王大明（2022）的研究發現' },
      { key: 'w6-sandwich-ref', label: '三明治引用：選用文獻', question: '你用哪篇文獻來練三明治引用？（作者年份）' },
      { key: 'w6-sandwich-claim', label: '三明治：觀點句', question: '第 1 層觀點句——你的主張是什麼？' },
      { key: 'w6-sandwich-evidence', label: '三明治：引用句', question: '第 2 層引用句——某某（年份）發現了什麼？' },
      { key: 'w6-sandwich-analysis', label: '三明治：分析句', question: '第 3 層分析句——這個證據說明了什麼？跟你的研究有什麼關係？' },
      { key: 'w6-lit-review', label: '文獻探討段落（演練3）', question: '用三篇文獻寫出至少 5 句的文獻探討，最後一句連回你的研究題目' },
      { key: 'w6-peer-review', label: '同儕幫我審查的結果', question: '同儕幫你審查演練 3 後，給了什麼具體建議？你根據建議修改了什麼？' },
      { key: 'w6-aired-record', label: 'AI-RED 敘事紀錄', question: '本週最重要的一次 AI 互動（A-I-R-E-D 五要素）' },
    ],
  },
  {
    weekNum: 7,
    weekLabel: 'W7 研究診所',
    weekRoute: '/w7',
    fields: [
      { key: 'w7-my-topic', label: '我的 W4 定案題目' },
      { key: 'w7-layer1', label: '第一層判斷', question: '我的資料要自己收集，還是分析已有文本？' },
      { key: 'w7-layer2', label: '第二層判斷', question: '最關鍵的那一條分科問題，以及我的回答' },
      { key: 'w7-main-method', label: '我選定的主要方法', question: '問卷/訪談/實驗/觀察/文獻？' },
      { key: 'w7-reason', label: '選擇理由', question: '為什麼選這個方法？請引用兩層判斷中的某一條' },
      { key: 'w7-aux-method', label: '輔助方法', question: '需要輔助方法嗎？是什麼？為什麼？' },
      { key: 'w7-reflect-wrong', label: '反思：測驗錯題', question: '你錯了哪幾題？錯的原因是什麼？' },
      { key: 'w7-reflect-confused', label: '反思：最易搞混的方法', question: '你最容易搞混的兩種方法是哪兩個？' },
      { key: 'w7-reflect-insight', label: '反思：新想法', question: '幫自己的題目掛號後，你對研究方向有什麼新的想法？' },
      { key: 'w7-reflect-literature', label: '反思：文獻法用途', question: '文獻法的三種用途中，你的題目有可能用到哪一種？' },
      { key: 'w7-aired-record', label: 'AI-RED 敘事紀錄', question: '本週最重要的一次 AI 互動（A-I-R-E-D 五要素）' },
    ],
  },
  {
    weekNum: 8,
    weekLabel: 'W8 研究博覽會',
    weekRoute: '/w8',
    fields: [
      { key: 'w8-my-topic', label: '我的研究題目' },
      { key: 'w8-my-ref', label: '我的王牌文獻' },
      { key: 'w8-my-method', label: '我打算用什麼方法' },
      { key: 'w8-listen-notes', label: '聆聽紀錄', question: '讓我心動的潛在隊友' },
      { key: 'w8-group-rationale', label: '組隊理由', question: '為什麼我們決定同一組？（合題前先寫下動機）' },
      { key: 'w8-teammates', label: '隊友姓名 & 題目' },
      { key: 'w8-merge-discussion', label: '合題討論紀錄', question: '共同核心是什麼？合成什麼大主題？' },
      { key: 'w8-merge-type', label: '合題情境判斷', question: '情境 1/2/3？' },
      { key: 'w8-team-members', label: '組長 + 成員名單' },
      { key: 'w8-merged-topic', label: '合題後研究主題' },
      { key: 'w8-research-question', label: '研究問題', question: '因果型/相關型/描述型' },
      { key: 'w8-method-reason', label: '研究方法 + 理由' },
      { key: 'w8-target', label: '研究對象' },
      { key: 'w8-tool-method', label: '我們組選用的研究方法' },
      { key: 'w8-draft-q1', label: '草稿題目 1' },
      { key: 'w8-draft-q2', label: '草稿題目 2' },
      { key: 'w8-draft-q3', label: '草稿題目 3' },
      { key: 'w8-draft-check', label: '自我檢核', question: '這 3 題和研究問題有關嗎？覺得怪怪的地方？' },
      { key: 'w8-aired-record', label: 'AI-RED 敘事紀錄', question: '本週最重要的一次 AI 互動（A-I-R-E-D 五要素）' },
    ],
  },
  {
    weekNum: 9,
    weekLabel: 'W9 工具設計基礎',
    weekRoute: '/w9',
    fields: [
      { key: 'w9-xcase-diagnosis', label: '壞題診斷練習', question: '你在 X 型病例中找到了什麼問題？' },
      { key: 'w9-my-method', label: '我的分流方法' },
      { key: 'w9-three-col-q1', label: '三欄對應表：研究問題 1', question: '研究問題→變項→題目設計' },
      { key: 'w9-three-col-q2', label: '三欄對應表：研究問題 2', question: '研究問題→變項→題目設計' },
      { key: 'w9-three-col-q3', label: '三欄對應表：研究問題 3', question: '研究問題→變項→題目設計' },
      { key: 'w9-basic-info-check', label: '基本資料 / 知情同意 / 結構確認' },
      { key: 'w9-peer-from', label: '我診斷了哪一組' },
      { key: 'w9-peer-diagnosis', label: '同儕處方診斷紀錄', question: '在對方的工具初稿中發現什麼問題？' },
      { key: 'w9-received-feedback', label: '我收到的回饋', question: '別組醫師給我們的處方是什麼？' },
      { key: 'w9-revision-plan', label: '修改決定', question: '根據回饋，我們最大的修改方向是什麼？' },
      { key: 'w9-aired-record', label: 'AI-RED 敘事紀錄', question: '本週最重要的一次 AI 互動（A-I-R-E-D 五要素）' },
    ],
  },
  {
    weekNum: 10,
    weekLabel: 'W10 AI 協助工具精進與預試',
    weekRoute: '/w10',
    fields: [
      { key: 'w10-tool-text', label: '工具文字版', question: '你貼給 AI 檢核的工具內容' },
      { key: 'w10-ai-raw-feedback', label: 'AI 原始回覆', question: 'AI 給你的檢核報告' },
      { key: 'w10-ai-judge', label: 'AI 建議判斷表', question: '逐條判斷 AI 建議' },
      { key: 'w10-judge-principle', label: '判斷原則', question: '你採納／不採納的理由是什麼？' },
      { key: 'w10-tool-revision', label: '第一輪修正紀錄', question: '根據 AI 建議修改了什麼？' },
      { key: 'w10-pilot-partner', label: '預試配對對象' },
      { key: 'w10-pilot-findings', label: '預試發現', question: '真人測試時發現了什麼問題？' },
      { key: 'w10-ai-found', label: 'AI 發現的問題' },
      { key: 'w10-human-found', label: '人工預試才發現的問題' },
      { key: 'w10-ai-effective', label: 'AI 建議效果評估', question: 'AI 建議的修改，預試後效果如何？' },
      { key: 'w10-final-revision', label: '最終修正紀錄', question: '預試後的最終修改' },
      { key: 'w10-ai-reflection', label: 'AI 協助研究反思', question: '使用 AI 協助研究工具設計的心得' },
      { key: 'w10-aired-record', label: 'AI-RED 敘事紀錄', question: '本週最重要的一次 AI 互動（A-I-R-E-D 五要素）' },
    ],
  },
  {
    weekNum: 11,
    weekLabel: 'W11 工具定案 · 倫理審查 · 施測啟動',
    weekRoute: '/w11',
    fields: [
      { key: 'w11-evolution', label: '預試進化論', question: '經過 W10 的 AI 檢核與人工預試，最大的改變是什麼？' },
      { key: 'w11-peer-final', label: '同儕最終確認', question: '同學以受訪者角色看完後的回饋' },
      { key: 'w11-ethics-consent', label: '倫理：知情同意' },
      { key: 'w11-ethics-privacy', label: '倫理：保密性' },
      { key: 'w11-ethics-harm', label: '倫理：不傷害' },
      { key: 'w11-ethics-voluntary', label: '倫理：自願性' },
      { key: 'w11-data-plan', label: '資料保護計畫' },
      { key: 'w11-consent-ai', label: 'AI 知情同意書審查回饋' },
      { key: 'w11-consent-judge', label: 'AI 建議判斷' },
      { key: 'w11-consent-final', label: '知情同意書最終版' },
      { key: 'w11-plan-target', label: '目標與底線' },
      { key: 'w11-plan-schedule', label: '執行時程' },
      { key: 'w11-plan-backup', label: '應急備案' },
      { key: 'w11-launch', label: '施測啟動宣告' },
      { key: 'w11-aired-record', label: 'AI-RED 敘事紀錄', question: '本週最重要的一次 AI 互動（A-I-R-E-D 五要素）' },
    ],
  },
  {
    weekNum: 12,
    weekLabel: 'W12 執行週 I：研究診所 Open Office',
    weekRoute: '/w12',
    fields: [
      { key: 'w12-diary-1', label: '關鍵行動 1' },
      { key: 'w12-diary-2', label: '關鍵行動 2' },
      { key: 'w12-diary-3', label: '關鍵行動 3' },
      { key: 'w12-midterm-status', label: 'W13 中期報告：現況' },
      { key: 'w12-midterm-gap', label: 'W13 中期報告：缺口' },
      { key: 'w12-midterm-plan', label: 'W13 中期報告：計畫' },
      { key: 'w12-aired-record', label: 'AI-RED 敘事紀錄', question: '本週最重要的一次 AI 互動（A-I-R-E-D 五要素）' },
    ],
  },
  {
    weekNum: 13,
    weekLabel: 'W13 執行週 II：中期盤點與資料收齊',
    weekRoute: '/w13',
    fields: [
      { key: 'w13-pitch-notes', label: '盤點筆記', question: '聽其他組報告時的筆記與啟發' },
      { key: 'w13-surprise', label: '最意外的發現', question: '蒐集過程中最意外的發現' },
      { key: 'w13-diary-1', label: '關鍵行動 1' },
      { key: 'w13-diary-2', label: '關鍵行動 2' },
      { key: 'w13-diary-3', label: '關鍵行動 3' },
      { key: 'w13-data-status', label: '資料收齊狀況', question: '最終蒐集量、達成率、品質自查' },
      { key: 'w13-w14-question', label: 'W14 帶過去的問題' },
      { key: 'w13-ai-explore', label: 'AI 初步探勘紀錄' },
      { key: 'w13-aired-record', label: 'AI-RED 敘事紀錄', question: '本週最重要的一次 AI 互動（A-I-R-E-D 五要素）' },
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
      { key: 'w14-case-1', label: '案例一：研究樣本背景' },
      { key: 'w14-case-2', label: '案例二：兩性愛情觀' },
      { key: 'w14-case-3', label: '案例三：精神病患民調' },
      { key: 'w14-my-chart-type', label: '我的圖表類型與理由' },
      { key: 'w14-my-description', label: '我的描述（藍筆）' },
      { key: 'w14-my-inference', label: '我的推論（紅筆）' },
      { key: 'w14-w15-preview', label: 'W15 預告：結論的第三層和第四層' },
      { key: 'w14-aired-record', label: 'AI-RED 敘事紀錄', question: '本週最重要的一次 AI 互動（A-I-R-E-D 五要素）' },
    ],
  },
  {
    weekNum: 15,
    weekLabel: 'W15 從圖的說明到研究結論：四層次寫作工作坊',
    weekRoute: '/w15',
    fields: [
      { key: 'w15-foreshadow', label: 'W14 伏筆填答' },
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
      { key: 'w15-aired-record', label: 'AI-RED 敘事紀錄', question: '本週最重要的一次 AI 互動（A-I-R-E-D 五要素）' },
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
