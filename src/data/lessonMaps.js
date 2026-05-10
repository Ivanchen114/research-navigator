/**
 * pacingArc：教學節奏細分（8 個段落，2 週為單位）
 * 學生主地圖請看 Home.jsx 的 5 phase studentArc。
 * 不要在學生頁面直接用 pacingArc，避免兩種地圖打架。
 */
export const pacingArc = [
    { wk: 'W1-W2', name: '探索階段\nRED 公約' },
    { wk: 'W3-W4', name: '題目診斷\n方法地圖' },
    { wk: 'W5-W6', name: '操作型定義\n海報博覽會' },
    { wk: 'W7-W8', name: '文獻偵探\n引用寫作' },
    { wk: 'W9-W11', name: '工具設計\n倫理審查' },
    { wk: 'W12', name: '期中短報\n進度檢核' },
    { wk: 'W13-W14', name: '數據轉譯\n結論寫作' },
    { wk: 'W15-W17', name: '成果簡報\n博覽發表' }
];

export const W3Data = {
    id: "W3",
    title: "題目健檢與 AI 協作工作坊",
    duration: 100,
    durationDesc: "2 節課",
    coreConcepts: [
        {
            prefix: "①",
            title: "萬用急救心法",
            subtitle: "大 → 小 ／ 空 → 實 ／ 遠 → 近 ／ 難 → 易",
            desc: "建立人類自己的基礎判斷力",
            colorConfig: "r"
        },
        {
            prefix: "②",
            title: "人機協作框架",
            subtitle: "AI 給選項，人做選擇與判斷",
            desc: "學會駕馭 AI，而不是被 AI 取代",
            colorConfig: "g"
        }
    ],
    periods: [
        {
            badge: "第一節",
            title: "看病 + 練識別（Step 1-2）",
            duration: 50,
            hasBreakAfter: true,
            stages: [
                {
                    timeStart: "0:00",
                    timeEnd: "0:04",
                    duration: "4 min",
                    colorClass: "c3",
                    icon: "🧱",
                    title: "Step 1｜碰壁體驗",
                    desc: "投影兩個看似合理但其實做不動的題目，追問學生第一步要怎麼做，讓他們親身感受『題目生病』的卡住感。",
                    tags: ["直接對決", "碰壁體驗"]
                },
                {
                    timeStart: "0:04",
                    timeEnd: "0:08",
                    duration: "4 min",
                    colorClass: "c3",
                    icon: "🌉",
                    title: "Step 2 暖身｜W2 → W3 銜接 + 8 病症介紹",
                    desc: "回顧 W2 探究意圖（『原石』），介紹 8 種題目病症（A 抽象哲學／B 算命占卜／C 百科全書／D 個案／E 太私／F 玄學／G 無聊／H 無範圍）。",
                    tags: ["呼應 W2", "病症觀念"]
                },
                {
                    timeStart: "0:08",
                    timeEnd: "0:20",
                    duration: "12 min",
                    colorClass: "c1",
                    icon: "🏥",
                    title: "Step 2 PART 1｜題目健檢大作戰：小組會診",
                    desc: "4–5 人一組，討論投影幕上的 8 個病題目，依據病例選單判斷各題生了什麼病，填入學習單 Part 1。",
                    tags: ["小組討論", "學習單 Part 1"]
                },
                {
                    timeStart: "0:20",
                    timeEnd: "0:28",
                    duration: "8 min",
                    colorClass: "c1",
                    icon: "🩺",
                    title: "Step 2 揭曉｜總醫師巡房 8 題答案",
                    desc: "逐題揭曉診斷結果，重點說明『為什麼這題生病』，先建立病感，不急著教怎麼改。",
                    tags: ["老師解說", "建立病感"],
                    additionalNotes: "📌 題1→H　題2→A　題3→F　題4→D　題5→E　題6→C　題7→G　題8→B"
                },
                {
                    timeStart: "0:28",
                    timeEnd: "0:40",
                    duration: "12 min",
                    colorClass: "c4",
                    icon: "💪",
                    title: "Step 2｜個人診斷練習（30 題選 2，禁用 AI）",
                    desc: "學生從 30 題爛題目中自行選 2 題，不准用 AI，先靠自己診斷、寫出修正版題目。",
                    tags: ["個人練習", "學習單 Part 2", "🚫 禁用 AI"]
                },
                {
                    timeStart: "0:40",
                    timeEnd: "0:48",
                    duration: "8 min",
                    colorClass: "c5",
                    icon: "🧠",
                    title: "Step 2 小組｜黃卡／紅卡會診",
                    desc: "每組從黃卡或紅卡中選 1 題，不准用 AI，一起診斷、把個人判斷說出來並與組員協商。",
                    tags: ["小組共作", "高階挑戰", "學習單 Part 2 第二表格"]
                },
                {
                    timeStart: "0:48",
                    timeEnd: "0:50",
                    duration: "2 min",
                    colorClass: "c3",
                    icon: "💭",
                    title: "Step 2 末｜disease-quiz 反思",
                    desc: "ThinkRecord：選一個你覺得最難判斷的病症，說說為什麼難。",
                    tags: ["反思", "ThinkRecord"],
                    keyPoint: "🎯 第一節收在『識別』——先練自己會看病，第二節才教怎麼下刀。"
                }
            ]
        },
        {
            badge: "第二節",
            title: "下刀工坊 + 自己題目（Step 3-6）",
            duration: 50,
            hasBreakAfter: false,
            stages: [
                {
                    timeStart: "0:00",
                    timeEnd: "0:05",
                    duration: "5 min",
                    colorClass: "c2",
                    icon: "💊",
                    title: "Step 3｜萬用急救心法 + 暱稱對映卡",
                    desc: "4 把刀（範圍縮小／抽象具體化／對象可及化／方法可行化）+ 8 病對應心法 + 遊戲暱稱對映（縮小藥丸／具體疫苗／任意門探測儀／降維手術刀）。",
                    tags: ["核心心法", "4 把刀", "暱稱對映"]
                },
                {
                    timeStart: "0:05",
                    timeEnd: "0:13",
                    duration: "8 min",
                    colorClass: "c2",
                    icon: "📖",
                    title: "Step 3｜4 把刀心路歷程展開卡",
                    desc: "看 4 個爛題目範例（追星文化／快樂感／2030 職業／課堂專注度），對應 4 把刀。每張卡先自己想 30 秒、再點開看老練研究者的心路獨白。",
                    tags: ["互動展開", "心路歷程", "看示範"]
                },
                {
                    timeStart: "0:13",
                    timeEnd: "0:20",
                    duration: "7 min",
                    colorClass: "c4",
                    icon: "✏️",
                    title: "Step 3｜練手題（自己對社群媒體題下刀）",
                    desc: "固定爛題目「探討高中生使用社群媒體的影響」——選一把主刀、寫自己的改寫版（≥15 字）、寫完才解鎖示範對照。",
                    tags: ["練手", "下刀實作", "productive struggle"]
                },
                {
                    timeStart: "0:20",
                    timeEnd: "0:32",
                    duration: "12 min",
                    colorClass: "c4",
                    icon: "🔪",
                    title: "Step 4｜對自己題目下刀（Part 4）",
                    desc: "回到自己 W2 探究意圖：自診（病症 + 心法）→ 5W1H 規格化（Who/Where/What/How/When）→ 修正版題目。",
                    tags: ["自己題目", "5W1H", "Part 4"],
                    additionalNotes: "必備四格：Who／Where／What／How；若寫不出來，表示題目仍然不夠小、不夠實、不夠近、或不夠易。"
                },
                {
                    timeStart: "0:32",
                    timeEnd: "0:45",
                    duration: "13 min",
                    colorClass: "c1",
                    icon: "✨",
                    title: "Step 5｜AI 共診定案（Part 5 AI 7 步）",
                    desc: "先根據 Part 4 自己寫出專屬初稿 → 請 AI 診斷 → 比對差異 → AI 提供 3 方案 → 自己選 → AI 優化 → 最終定案 + AI-RED。",
                    tags: ["AI 7 步", "最終定案", "AI-RED"],
                    additionalNotes: "Step 1 自寫初稿 → Step 2 問 AI 診斷 → Step 3 比對差異 → Step 4 問 AI 給 3 方案 → Step 5 自己選 → Step 6 問 AI 優化 → Step 7 最終定案 + AI-RED",
                    keyPoint: "🎯 最重要的不是 AI 生出幾句漂亮話，而是學生能不能說出：『我為什麼選這個版本，因為它做得到。』"
                },
                {
                    timeStart: "0:45",
                    timeEnd: "0:50",
                    duration: "5 min",
                    colorClass: "c3",
                    icon: "🏁",
                    title: "Step 6｜回顧繳交 + 出院標準確認",
                    desc: "總結今天從碰壁→識別→下刀→自己題目→AI 共診的流程。確認學生手上的 W3 題目已能帶往 W4。",
                    tags: ["總結收束", "W4 預告"],
                    additionalNotes: "出院標準：5W1H 至少能填 4 格、符合小實近易至少 2 項、兩週內能蒐集到資料。"
                }
            ]
        }
    ],
    summaries: [
        {
            icon: "🩺",
            label: "課堂產出 1",
            text: "8 題診斷紀錄＋急救練習<br><small style=\"font-size:11px;color:#888;\">建立人的判斷力</small>"
        },
        {
            icon: "🤖",
            label: "課堂產出 2",
            text: "AI 協作紀錄<br><small style=\"font-size:11px;color:#888;\">含比對差異與選擇理由</small>"
        },
        {
            icon: "🔪",
            label: "課堂產出 3",
            text: "5W1H 規格化表<br><small style=\"font-size:11px;color:#888;\">回到自己的題目動刀</small>"
        },
        {
            icon: "🎯",
            label: "最終產出",
            text: "W3 最終定案題目<br><small style=\"font-size:11px;color:#ccc;\">帶去 W4 方法地圖</small>"
        }
    ],
    legends: [
        { colorClass: "lm-c1", label: "診斷 / 定案" },
        { colorClass: "lm-c2", label: "心法 / AI 協作" },
        { colorClass: "lm-c3", label: "導入 / 總結" },
        { colorClass: "lm-c4", label: "個人練習 / 規格化" },
        { colorClass: "lm-c5", label: "小組共作 / 互動" }
    ],
    courseArc: pacingArc.map((item, idx) => ({
        ...item,
        past: idx < 1,
        now: idx === 1
    }))
};

export const W1Data = {
    id: "W1",
    title: "研究方法啟動：模仿遊戲與人機協作",
    duration: 100,
    durationDesc: "2 節課",
    metaCards: [
        { label: '本週任務', value: '找出偽裝者 + 簽署公約' },
        { label: '課課產出', value: '好奇心種子' },
        { label: '下週預告', value: '你觀察到的生活現象' }
    ],
    courseArc: pacingArc.map(item => ({
        ...item,
        now: item.wk === 'W1-W2'
    })),
    coreConcepts: [
        {
            prefix: "①",
            title: "AI-RED 協作公約",
            subtitle: "捍衛真實，不是防弊",
            desc: "Ascribe, Inquire, Reference, Evaluate, Document",
            colorConfig: "r"
        },
        {
            prefix: "②",
            title: "三件 AI 做不到的事",
            subtitle: "品味、接觸、判斷",
            desc: "學會駕馭 AI 而非被 AI 取代",
            colorConfig: "g"
        }
    ],
    periods: [
        {
            badge: "第一節",
            title: "模仿遊戲",
            duration: 50,
            hasBreakAfter: true,
            stages: [
                {
                    timeStart: "0:00",
                    timeEnd: "0:10",
                    duration: "10 min",
                    colorClass: "c3",
                    icon: "✍️",
                    title: "一、 暖身：我與研究的距離",
                    desc: "寫下對研究的想法與生活中好奇的現象。建立真實作品對照基準。",
                    tags: ["個人寫作", "生活觀察"]
                },
                {
                    timeStart: "0:10",
                    timeEnd: "0:25",
                    duration: "15 min",
                    colorClass: "c1",
                    icon: "🕵️",
                    title: "二、 找出偽裝者",
                    desc: "閱讀 7 份學長姐作品（其中 1 份是 AI 假冒），分組討論並投票找出 AI。",
                    tags: ["小組討論", "圖靈測試"]
                },
                {
                    timeStart: "0:25",
                    timeEnd: "0:35",
                    duration: "10 min",
                    colorClass: "c5",
                    icon: "😲",
                    title: "三、 揭曉與震撼教育",
                    desc: "公佈答案。說明 AI 已通過圖靈測試，『誠實』變成唯一的防線。",
                    tags: ["震撼教育", "價值反思", "全班討論"],
                    keyPoint: "⚠️ 教學重點：讓學生發現 AI 難以分辨，引出簽署公約的需求。"
                },
                {
                    timeStart: "0:35",
                    timeEnd: "0:50",
                    duration: "15 min",
                    colorClass: "c2",
                    icon: "📝",
                    title: "四、 簽署 AI-RED 公約",
                    desc: "講解 AI-RED 五步驟，學生簽署承諾書。",
                    tags: ["倫理規範", "簽署儀式", "AI-RED"]
                }
            ]
        },
        {
            badge: "第二節",
            title: "現場研究演示秀",
            duration: 50,
            hasBreakAfter: false,
            stages: [
                {
                    timeStart: "0:00",
                    timeEnd: "0:10",
                    duration: "10 min",
                    colorClass: "c3",
                    icon: "💡",
                    title: "五、 建立問題意識 & 蒐集資料",
                    desc: "老師提出問題意識，讓學生填寫 Google 表單蒐集數據（人的行動）。",
                    tags: ["問題意識", "數據蒐集"]
                },
                {
                    timeStart: "0:10",
                    timeEnd: "0:25",
                    duration: "15 min",
                    colorClass: "c4",
                    icon: "🤖",
                    title: "六、 AI 實況分析",
                    desc: "老師實作將收集的資料丟給 AI，展示 AI 高速整理與分類資料的能力（AI 協助）。",
                    tags: ["AI 實地展演", "資料處理"]
                },
                {
                    timeStart: "0:25",
                    timeEnd: "0:35",
                    duration: "10 min",
                    colorClass: "c1",
                    icon: "🧠",
                    title: "七、 解讀數據：人在迴圈中",
                    desc: "教師示範如何解讀 AI 的數字，賦予教學意義（人的判斷）。總結人與 AI 的分工。",
                    tags: ["解讀分析", "人機分工"],
                    keyPoint: "🎯 人負責方向、判準與解讀；AI 協助整理、分類與產生草稿。"
                },
                {
                    timeStart: "0:35",
                    timeEnd: "0:50",
                    duration: "15 min",
                    colorClass: "c2",
                    icon: "🎯",
                    title: "八、 品味、接觸、判斷",
                    desc: "總結這學期要練的三件事：品味（問好問題）、接觸（拿真實數據）、判斷（批判思考）。",
                    tags: ["核心價值", "課程預告"]
                }
            ]
        }
    ],
    summaries: [
        {
            icon: "📝",
            label: "課堂產出",
            text: "AI-RED 公約簽署<br><small style=\"font-size:11px;color:#888;\">歷程紀錄承諾</small>"
        }
    ],
    legends: [
        { colorClass: "lm-c3", label: "暖身 / 問題建立" },
        { colorClass: "lm-c1", label: "辨識 / 解讀" },
        { colorClass: "lm-c5", label: "震撼教育" },
        { colorClass: "lm-c2", label: "規範 / 總結" },
        { colorClass: "lm-c4", label: "AI 實作" }
    ]
};

export const W2Data = {
    id: "W2",
    title: "問題意識的覺醒",
    duration: 100,
    durationDesc: "2 節課",
    courseArc: pacingArc.map((item, idx) => ({
        ...item,
        past: false,
        now: idx === 0
    })),
    coreConcepts: [
        {
            prefix: "①",
            title: "四段式思考框架",
            subtitle: "觀察 → 落差 → 展開假設 → 鎖定研究問題",
            desc: "不再問空泛的「為什麼」，逼自己先發散再收斂",
            colorConfig: "r"
        },
        {
            prefix: "②",
            title: "ABC 探究句型",
            subtitle: "影響型 / 比較型 / 深究型",
            desc: "把選定的假設翻譯成研究問題",
            colorConfig: "b"
        }
    ],
    periods: [
        {
            badge: "第一節",
            title: "四段式思考 ＆ 發散假設",
            duration: 50,
            hasBreakAfter: true,
            stages: [
                {
                    timeStart: "0:00",
                    timeEnd: "0:05",
                    duration: "5 min",
                    colorClass: "c3",
                    icon: "🌉",
                    title: "一、 暖身概念（Step 1 觀念建立 · 前段）",
                    desc: "呼應 W1 生活觀察種子，點出「問為什麼」是爛問題，導入把好奇心變成好問題的需求。",
                    tags: ["舊證連結", "點出盲點"]
                },
                {
                    timeStart: "0:05",
                    timeEnd: "0:20",
                    duration: "15 min",
                    colorClass: "c1",
                    icon: "🧠",
                    title: "二、 四段式思考框架與示範（Step 1 觀念建立 · 後段）",
                    desc: "講解觀察、落差、展開假設、鎖定研究問題。以圖書館現象示範完整拆解。",
                    tags: ["概念講解", "教師示範"],
                    keyPoint: "⚠️ 步驟 3（展開假設）必須列 3-5 個，不能只想一個就鎖死——研究的起點是承認「答案可能不只一個」。"
                },
                {
                    timeStart: "0:20",
                    timeEnd: "0:35",
                    duration: "15 min",
                    colorClass: "c4",
                    icon: "🖼️",
                    title: "三、 圖片轉化戰（Step 2 暖身練習）",
                    desc: "看合成圖兩個場景（垃圾爆滿 / 課堂失序），用 Tab 切換各做一輪「現象 → 落差 → 展開假設」。",
                    tags: ["情境練習", "快速實作", "🚫 禁用 AI"]
                },
                {
                    timeStart: "0:35",
                    timeEnd: "0:50",
                    duration: "15 min",
                    colorClass: "c2",
                    icon: "✍️",
                    title: "四、 改寫你的 W1 觀察（Step 3 人腦練習）",
                    desc: "拿 W1 自己的生活觀察種子，用四段框架的前三步重寫。這是後面所有 step 的起點。",
                    tags: ["個人創作", "聚焦核心", "🚫 禁用 AI"]
                }
            ]
        },
        {
            badge: "第二節",
            title: "AI 協作 ＆ 探究意圖定案",
            duration: 50,
            hasBreakAfter: false,
            stages: [
                {
                    timeStart: "0:00",
                    timeEnd: "0:10",
                    duration: "10 min",
                    colorClass: "c1",
                    icon: "🧩",
                    title: "五、 ABC 探究句型 + 拍 1 自選假設（Step 4 AI 協作 · 前段）",
                    desc: "介紹影響型 (A)、比較型 (B)、深究型 (C)。學生從上一段的 3-5 個假設挑一個、寫選它的理由、判斷 ABC 型。全程禁用 AI。",
                    tags: ["概念講解", "人腦先行", "🚫 拍 1 禁 AI"],
                    keyPoint: "🎯 「挑哪個假設」「定哪一型」是研究設計決定，必須由你做。"
                },
                {
                    timeStart: "0:10",
                    timeEnd: "0:35",
                    duration: "25 min",
                    colorClass: "c5",
                    icon: "✨",
                    title: "六、 探究意圖生成器（Step 4 AI 協作 · 三拍）",
                    desc: "拍 2：學生餵 Prompt 給 AI，請 AI 把選定假設翻譯成 A/B/C 三種句型。拍 3：學生比對自判 vs AI 建議，選一個真正打動的。",
                    tags: ["AI 實作", "三拍流程", "AI-RED 紀錄"],
                    keyPoint: "🔍 AI 是放大鏡，你才是眼睛——AI 給選項，人做最終判斷。"
                },
                {
                    timeStart: "0:35",
                    timeEnd: "0:50",
                    duration: "15 min",
                    colorClass: "c3",
                    icon: "🏆",
                    title: "七、 探究意圖定案 + 反思 + 繳交（Step 5 + Step 6）",
                    desc: "寫最終探究意圖完整句（帶去 W3 的版本）→ 反思卡在四段哪一段 → 一鍵匯出貼到 Google Classroom。預告 W3 題目健檢。",
                    tags: ["最終產出", "反思", "繳交"]
                }
            ]
        }
    ],
    summaries: [
        {
            icon: "📝",
            label: "暖身 + 主練習產出",
            text: "圖片 ① 垃圾 / ② 課堂 暖身×6 格<br>+ W1 觀察主練習 ×3 格<br><small style=\"font-size:11px;color:#888;\">用四段框架走完前三步</small>"
        },
        {
            icon: "🤖",
            label: "AI 協作紀錄",
            text: "AI-RED 敘事紀錄<br><small style=\"font-size:11px;color:#888;\">本週唯一 AI 工具：探究意圖生成器</small>"
        },
        {
            icon: "🎯",
            label: "最終產出",
            text: "W2 最終探究意圖<br><small style=\"font-size:11px;color:#ccc;\">帶到 W3 作為「病人」做題目健檢</small>"
        }
    ],
    legends: [
        { colorClass: "lm-c3", label: "暖身 / 總結" },
        { colorClass: "lm-c1", label: "框架 / 概念" },
        { colorClass: "lm-c4", label: "快速練習" },
        { colorClass: "lm-c2", label: "個人寫作" },
        { colorClass: "lm-c5", label: "AI 協作實作" }
    ]
};

export const W4Data = {
    id: "W4",
    title: "方法地圖：認識方法 + 兩層判斷",
    duration: 100,
    durationDesc: "2 節課",
    metaCards: [
        { label: '第一節', value: '五種方法 → 互動決策樹 → 10 題測驗' },
        { label: '第二節', value: '為自己題目選路 + 反思 + 繳交' },
        { label: '課堂產出', value: '主要方法 + 選擇理由（+ 輔助方法）' },
        { label: '帶去 W5', value: '主要方法選擇（W5 操作型定義要用）' }
    ],
    courseArc: pacingArc.map((item, idx) => ({
        ...item,
        past: idx < 1,
        now: idx === 1
    })),
    coreConcepts: [
        {
            prefix: "①",
            title: "兩層判斷",
            subtitle: "L1 自蒐／文獻 → L2 三題分流",
            desc: "用互動決策樹幫題目挑出主方法",
            colorConfig: "r"
        },
        {
            prefix: "②",
            title: "10 題驗收",
            subtitle: "分科判斷測驗",
            desc: "把兩層判斷套到別人題目上，立即看懂錯在哪",
            colorConfig: "b"
        },
        {
            prefix: "③",
            title: "為自己題目選路",
            subtitle: "為 W3 定案題目選方法",
            desc: "寫出方法 + 引用兩層判斷哪一條 + 是否需要輔助",
            colorConfig: "c"
        }
    ],
    periods: [
        {
            badge: "第一節",
            title: "認識 5 種方法 → 互動決策樹 → 10 題驗收",
            duration: 50,
            hasBreakAfter: true,
            stages: [
                {
                    timeStart: "0:00",
                    timeEnd: "0:05",
                    duration: "5 min",
                    colorClass: "c3",
                    icon: "🩺",
                    title: "一、 開場 — 為什麼是這週",
                    desc: "W3 你決定了題目——但「題目」不會自動變成「資料」。這週做一個決定：你的題目要用哪一種方法去收／去問／去看？",
                    tags: ["連貫鏈", "目標建立"]
                },
                {
                    timeStart: "0:05",
                    timeEnd: "0:13",
                    duration: "8 min",
                    colorClass: "c1",
                    icon: "📋",
                    title: "二、 Step 1A 五種方法卡牌導覽",
                    desc: "問卷／訪談／實驗／觀察／文獻——各自的目的、強項、弱點、適用情境。先給「量化 vs 質性」兩條根的概念。",
                    tags: ["概念講解", "標準建立"]
                },
                {
                    timeStart: "0:13",
                    timeEnd: "0:23",
                    duration: "10 min",
                    colorClass: "c1",
                    icon: "🌳",
                    title: "三、 Step 1B 互動決策樹（兩層判斷）",
                    desc: "L1 點選「自蒐 vs 文獻」→ L2 三題獨立分流：❶ 比例還是原因 ❷ 能否操控 ❸ 真實行為／自然現象 vs 想法態度。含自然科學分流卡 + ThinkChoice 暖身。",
                    tags: ["互動操作", "判斷推理"],
                    keyPoint: "⚠️ L2 三題不必都答，挑最貼近題目的那條。"
                },
                {
                    timeStart: "0:23",
                    timeEnd: "0:35",
                    duration: "12 min",
                    colorClass: "c4",
                    icon: "🎯",
                    title: "四、 Step 2 分科判斷 10 題測驗",
                    desc: "個別作答，自動跳題，現場驗收兩層判斷的理解。錯題會在 Step 4 反思時用到。",
                    tags: ["個人測驗", "即時驗收"]
                },
                {
                    timeStart: "0:35",
                    timeEnd: "0:50",
                    duration: "15 min",
                    colorClass: "c4",
                    icon: "💬",
                    title: "五、 測驗講評 + 易混淆方法澄清",
                    desc: "挑 3 題易錯題現場講解（特別是訪談 vs 問卷、實驗 vs 觀察、文獻三用途）；老師補充自然科學題的觀察+實驗組合。",
                    tags: ["教師講評", "概念澄清"]
                }
            ]
        },
        {
            badge: "第二節",
            title: "為自己題目選路 → 反思 → 繳交",
            duration: 50,
            hasBreakAfter: false,
            stages: [
                {
                    timeStart: "0:00",
                    timeEnd: "0:05",
                    duration: "5 min",
                    colorClass: "c3",
                    icon: "📎",
                    title: "六、 Step 3 開場 + 帶入 W3 題目",
                    desc: "讀入 W3 定案題目（自動帶入卡）。重申：剛才是練習別人題目，現在是真槍實彈。",
                    tags: ["連貫鏈", "目標聚焦"]
                },
                {
                    timeStart: "0:05",
                    timeEnd: "0:20",
                    duration: "15 min",
                    colorClass: "c2",
                    icon: "🩺",
                    title: "七、 Step 3 為題目選路 — 兩層判斷 + 方法 + 理由",
                    desc: "ThinkRecord 連寫 5 格：L1 判斷／L2 判斷／主要方法／選擇理由（必引用兩層判斷某條）／輔助方法（如需）。",
                    tags: ["個人應用", "理由表態"]
                },
                {
                    timeStart: "0:20",
                    timeEnd: "0:25",
                    duration: "5 min",
                    colorClass: "c5",
                    icon: "🗣️",
                    title: "八、 Step 3 同儕挑戰",
                    desc: "兩人一組互念：「我用 ___ 法因為 ___」。對方挑戰：「真的要的是比例還是原因？」「資料是自己收還是分析別人寫的？」",
                    tags: ["同儕對話", "口頭驗證"]
                },
                {
                    timeStart: "0:25",
                    timeEnd: "0:38",
                    duration: "13 min",
                    colorClass: "c5",
                    icon: "💭",
                    title: "九、 Step 4 反思 4 題",
                    desc: "兩題核心反思：最易搞混的方法（含 L2 對齊）、文獻回顧 vs 文獻分析法——後設認知收束。",
                    tags: ["後設認知", "整理收束"]
                },
                {
                    timeStart: "0:38",
                    timeEnd: "0:50",
                    duration: "12 min",
                    colorClass: "c3",
                    icon: "🏁",
                    title: "十、 Step 5 回顧繳交 + W5 預告",
                    desc: "AI-RED 敘事紀錄（optional）→ ExportButton 匯出 → 上傳 Google Classroom。預告 W5 操作型定義：把方法接到「可實際蒐集」的指標。",
                    tags: ["成果繳交", "下週預告"]
                }
            ]
        }
    ],
    summaries: [
        {
            icon: "🌳",
            label: "課堂產出",
            text: "主要方法 + 選擇理由<br><small style=\"font-size:11px;color:#888;\">（+ 輔助方法如需要）</small>"
        },
        {
            icon: "🎯",
            label: "技能驗收",
            text: "10 題分科判斷測驗<br><small style=\"font-size:11px;color:#888;\">兩層判斷理解</small>"
        },
        {
            icon: "🌉",
            label: "兌現點",
            text: "W3 題目 → W4 方法 → W5 操作型定義<br><small style=\"font-size:11px;color:#ccc;\">題目→測量的橋</small>"
        }
    ],
    legends: [
        { colorClass: "lm-c1", label: "概念 / 示範" },
        { colorClass: "lm-c4", label: "快速演練 / 測驗" },
        { colorClass: "lm-c2", label: "個人寫作 / 應用" },
        { colorClass: "lm-c5", label: "同儕交流 / 反思" },
        { colorClass: "lm-c3", label: "開場 / 總結" }
    ]
};


export const W5Data = {
    id: "W5",
    title: "操作型定義：把好奇變可測",
    duration: 100,
    durationDesc: "2 節課",
    metaCards: [
        { label: '第一節', value: '概念建立 + 5 法策略分流' },
        { label: '第二節', value: '為自己題目寫 + 同儕挑戰 + 反思' },
        { label: '課堂產出', value: '核心概念 + 操作型定義 + 正反例（三格）' },
        { label: '帶去 W6', value: '操作型定義（海報必填內容）' }
    ],
    courseArc: pacingArc.map((item, idx) => ({
        ...item,
        past: idx < 2,
        now: idx === 2
    })),
    coreConcepts: [
        {
            prefix: "①",
            title: "操作型定義",
            subtitle: "把抽象變可測",
            desc: "「壓力／動機／效果」這類抽象概念變成「誰來測都得到一樣的數字／類別」",
            colorConfig: "r"
        },
        {
            prefix: "②",
            title: "5 法策略",
            subtitle: "對齊 W4 主方法",
            desc: "問卷／訪談／實驗／觀察／文獻分析各自的操作化公式不同",
            colorConfig: "b"
        },
        {
            prefix: "③",
            title: "三件事",
            subtitle: "可測量／正反例／一致",
            desc: "操作型定義要做到的 3 個檢核點，缺一都會出問題",
            colorConfig: "c"
        }
    ],
    periods: [
        {
            badge: "第一節",
            title: "概念建立 → 5 法策略分流",
            duration: 50,
            hasBreakAfter: true,
            stages: [
                {
                    timeStart: "0:00", timeEnd: "0:05", duration: "5 min",
                    colorClass: "c3", icon: "📎",
                    title: "一、 開場 + 連貫鏈定位",
                    desc: "W3 題目 / W4 方法 / 這週把好奇變可測——三件齊了，這週是把方法接到「可實際蒐集」的橋。",
                    tags: ["連貫鏈", "目標建立"]
                },
                {
                    timeStart: "0:05", timeEnd: "0:15", duration: "10 min",
                    colorClass: "c1", icon: "📐",
                    title: "二、 操作型定義是什麼 + 「壓力」三方法對照範例",
                    desc: "概念講解：把抽象變成可測。展示「高中生壓力」用問卷／訪談／觀察各自的操作型定義。",
                    tags: ["概念講解", "範例對照"]
                },
                {
                    timeStart: "0:15", timeEnd: "0:24", duration: "9 min",
                    colorClass: "c1", icon: "⚠️",
                    title: "三、 三件事檢核（三大卡）+ 對錯例討論",
                    desc: "可測量／有正反例／前後一致——三大卡並列，每張對／錯例配對，挑 1-2 張現場討論。",
                    tags: ["關鍵原則", "對錯例"],
                    keyPoint: "⚠️ 三件事缺一都會讓研究數據打架，這是後面寫工具的地基。"
                },
                {
                    timeStart: "0:24", timeEnd: "0:29", duration: "5 min",
                    colorClass: "c2", icon: "📝",
                    title: "四、 集體共寫示範｜「上課專心」一題",
                    desc: "從『讀範例』到『自己寫』的鷹架。老師帶全班跑「上課專心」一題（觀察法）：抽核心概念→寫操作型定義→列正反例→三件事檢核。展開卡 4 步驟。",
                    tags: ["師生共寫", "鷹架"],
                    keyPoint: "💡 沒做這段，下半節弱生會在第一格就卡住。"
                },
                {
                    timeStart: "0:29", timeEnd: "0:44", duration: "15 min",
                    colorClass: "c4", icon: "🧰",
                    title: "五、 5 法操作型定義策略——學生分流自學",
                    desc: "5 法 tabs：學生點開自己 W4 主方法那張深讀（公式 + 描述 + 範例），再看 1 張輔助方法（如有）。文獻分析學生看 4 子類型範例。",
                    tags: ["互動 tabs", "個別分流"]
                },
                {
                    timeStart: "0:44", timeEnd: "0:50", duration: "6 min",
                    colorClass: "c5", icon: "🔁",
                    title: "六、 換場 + 第二節預告",
                    desc: "「下半節你的題目要動手了」——預告 Step 4 三格寫作。",
                    tags: ["換場", "預告"]
                }
            ]
        },
        {
            badge: "第二節",
            title: "個人實作 → 同儕挑戰 → 反思繳交",
            duration: 50,
            hasBreakAfter: false,
            stages: [
                {
                    timeStart: "0:00", timeEnd: "0:05", duration: "5 min",
                    colorClass: "c3", icon: "🎯",
                    title: "七、 暖機 + 帶入卡再次調出",
                    desc: "讀一遍 W4 帶入的「題目 + 主方法」，確認三格要寫什麼。",
                    tags: ["連貫鏈", "目標聚焦"]
                },
                {
                    timeStart: "0:05", timeEnd: "0:06", duration: "1 min",
                    colorClass: "c4", icon: "🎯",
                    title: "八、 核心概念抽取暖身（3 題範例）",
                    desc: "Step 4 開頭的展開卡——3 個範例題目，學生心裡圈核心概念再展開揭曉。避免在第一格直接卡死。",
                    tags: ["暖身", "鷹架"]
                },
                {
                    timeStart: "0:06", timeEnd: "0:25", duration: "19 min",
                    colorClass: "c2", icon: "✍️",
                    title: "九、 寫三格——核心概念 + 操作型定義 + 正反例",
                    desc: "ThinkRecord 連寫三格。placeholder/scaffold 會根據 W4 方法動態切換對應範例。",
                    tags: ["個人實作", "兌現點"],
                    keyPoint: "⚠️ 寫一次、用三次：W7-W8 計畫書、W9 工具設計都會用到。"
                },
                {
                    timeStart: "0:25", timeEnd: "0:31", duration: "6 min",
                    colorClass: "c5", icon: "🗣️",
                    title: "十、 同儕挑戰——正反例分得開嗎",
                    desc: "兩兩交換唸自己的核心概念 + 操作型定義。對方用「正反例分得開嗎？」挑戰。分不開就回頭修。",
                    tags: ["同儕對話", "口頭驗證"]
                },
                {
                    timeStart: "0:31", timeEnd: "0:40", duration: "9 min",
                    colorClass: "c5", icon: "💭",
                    title: "十一、 反思——模糊→可測最難的轉化",
                    desc: "1 題反思：把抽象變可測，最難的是什麼？怎麼克服？（後設認知收束）",
                    tags: ["後設認知", "反思"]
                },
                {
                    timeStart: "0:40", timeEnd: "0:48", duration: "8 min",
                    colorClass: "c5", icon: "🤖",
                    title: "十二、 AI-RED（optional）+ 檢核清單走讀",
                    desc: "AI-RED 敘事紀錄（操作型定義可能用 AI 發散候選版本）+ 本週檢核清單 4 項打勾。",
                    tags: ["AI-RED", "檢核"]
                },
                {
                    timeStart: "0:48", timeEnd: "0:50", duration: "2 min",
                    colorClass: "c3", icon: "🏁",
                    title: "十三、 ExportButton 匯出 + W6 預告",
                    desc: "一鍵複製本週紀錄貼 Google Classroom。預告 W6 海報博覽會 + 組隊（操作型定義是海報必填內容）。",
                    tags: ["成果繳交", "下週預告"]
                }
            ]
        }
    ],
    summaries: [
        {
            icon: "📐",
            label: "課堂產出",
            text: "核心概念 + 操作型定義 + 正反例<br><small style=\"font-size:11px;color:#888;\">三格寫一次、用三次（W7-W8/W9）</small>"
        },
        {
            icon: "🧰",
            label: "技能驗收",
            text: "為自己題目寫操作型定義<br><small style=\"font-size:11px;color:#888;\">同儕挑戰：正反例分得開嗎</small>"
        },
        {
            icon: "🌉",
            label: "兌現點",
            text: "W4 方法 → W5 可測指標 → W6 海報<br><small style=\"font-size:11px;color:#ccc;\">把好奇變可實際蒐集</small>"
        }
    ],
    legends: [
        { colorClass: "lm-c1", label: "概念 / 示範" },
        { colorClass: "lm-c4", label: "互動操作 / 分流" },
        { colorClass: "lm-c2", label: "個人寫作 / 應用" },
        { colorClass: "lm-c5", label: "同儕交流 / 反思" },
        { colorClass: "lm-c3", label: "開場 / 總結" }
    ]
};

export const W6Data = {
    id: "W6",
    title: "海報博覽會 + 組隊（含 Solo）",
    duration: 100,
    durationDesc: "2 節課",
    metaCards: [
        { label: '第一節', value: '海報製作 + Gallery Walk 走讀' },
        { label: '第二節', value: '找合題夥伴 + 路線決定 + 反思' },
        { label: '課堂產出', value: 'A4 海報 + 走讀回饋 + 路線（Team / Solo）' },
        { label: '帶去 W7', value: '題目／方法／路線——文獻搜尋的起點' }
    ],
    courseArc: pacingArc.map((item, idx) => ({
        ...item,
        past: idx < 2,
        now: idx === 2
    })),
    coreConcepts: [
        {
            prefix: "①",
            title: "三件齊一張",
            subtitle: "題目+方法+操作型定義",
            desc: "把 W3-W5 三週累積的東西塞進 A4 四格手寫海報",
            colorConfig: "r"
        },
        {
            prefix: "②",
            title: "三色便利貼",
            subtitle: "粉紅 / 黃 / 藍",
            desc: "認可 / 具體建議 / 想問的問題——回饋要可執行",
            colorConfig: "b"
        },
        {
            prefix: "③",
            title: "Solo 嚴格 5 項",
            subtitle: "理由+工作量+風險+求援+Plan B",
            desc: "Solo 不是不想合作，是題目客觀只能你一人——5 項全寫才算合格",
            colorConfig: "c"
        }
    ],
    periods: [
        {
            badge: "第一節",
            title: "海報製作 → Gallery Walk 走讀",
            duration: 50,
            hasBreakAfter: true,
            stages: [
                {
                    timeStart: "0:00", timeEnd: "0:02", duration: "2 min",
                    colorClass: "c3", icon: "📎",
                    title: "一、 開場 + 帶入卡",
                    desc: "三週累積一次調出：W3 題目 / W4 方法 / W5 操作型定義——這張海報的硬內容。",
                    tags: ["連貫鏈", "目標建立"]
                },
                {
                    timeStart: "0:02", timeEnd: "0:27", duration: "25 min",
                    colorClass: "c2", icon: "🎨",
                    title: "二、 Step 1 海報製作（A4 紙本手寫）",
                    desc: "四格範本：① 題目 ② 主方法 ③ 核心概念+操作型定義 ④ 為什麼想研究這個。動機格在網頁寫，標題優化可選 AI。",
                    tags: ["紙本手寫", "先人後 AI"],
                    keyPoint: "⚠️ 不准用 AI 寫內容——只有最後標題優化可以開 AI。"
                },
                {
                    timeStart: "0:27", timeEnd: "0:30", duration: "3 min",
                    colorClass: "c3", icon: "📋",
                    title: "三、 Gallery Walk 規則說明",
                    desc: "ABCD 四輪走讀（每輪 5 min）+ 三色便利貼規則：粉紅認可 / 黃建議 / 藍提問。",
                    tags: ["規則說明", "走讀準備"]
                },
                {
                    timeStart: "0:30", timeEnd: "0:50", duration: "20 min",
                    colorClass: "c5", icon: "👀",
                    title: "四、 Step 2 四輪走讀（每輪 5 min）",
                    desc: "ABCD 輪流坐鎮報告，其他人移動聆聽 + 貼便利貼。重點挑戰問題：「正反例分得開嗎？」",
                    tags: ["走讀", "同儕回饋"]
                }
            ]
        },
        {
            badge: "第二節",
            title: "找合題夥伴 → 路線決定 → 反思繳交",
            duration: 50,
            hasBreakAfter: false,
            stages: [
                {
                    timeStart: "0:00", timeEnd: "0:08", duration: "8 min",
                    colorClass: "c2", icon: "📝",
                    title: "五、 走讀回饋紀錄",
                    desc: "回到座位讀自己海報蒐集的便利貼，挑最重要 3 條寫進 ThinkRecord。",
                    tags: ["個人寫作", "回饋整理"]
                },
                {
                    timeStart: "0:08", timeEnd: "0:23", duration: "15 min",
                    colorClass: "c4", icon: "🤝",
                    title: "六、 Step 3 找合題夥伴 / 確認 Solo",
                    desc: "看走讀回饋判斷：題目近 + 方法互補的同學湊合題；題目核心只能自己做的選 Solo。雙路線判斷指引並列。",
                    tags: ["路線判斷", "個別決策"]
                },
                {
                    timeStart: "0:23", timeEnd: "0:43", duration: "20 min",
                    colorClass: "c2", icon: "🛤️",
                    title: "七、 Step 4 路線決定",
                    desc: "Team 線：3 人合題 + 隊員分工 + 合題理由（3 格）。Solo 線：嚴格 5 項全寫——非 Solo 不可的理由 / 4 章工作量規劃 / 三大風險 / 求援計畫 / Plan B。",
                    tags: ["個人實作", "雙路線"],
                    keyPoint: "⚠️ Solo 5 項不全會在 W12 中期短報被退件——這是契約。"
                },
                {
                    timeStart: "0:43", timeEnd: "0:48", duration: "5 min",
                    colorClass: "c5", icon: "💭",
                    title: "八、 Step 5 反思",
                    desc: "1 題反思：走讀蒐集的便利貼裡，最戳到你的 1 條是什麼？怎麼處理？",
                    tags: ["後設認知", "回饋處理"]
                },
                {
                    timeStart: "0:48", timeEnd: "0:50", duration: "2 min",
                    colorClass: "c3", icon: "🏁",
                    title: "九、 ExportButton 匯出 + W7 預告",
                    desc: "一鍵複製本週紀錄貼 Google Classroom。預告 W7 文獻搜尋入門（A-D 證據分級＋華藝四步）。",
                    tags: ["成果繳交", "下週預告"]
                }
            ]
        }
    ],
    summaries: [
        {
            icon: "🎨",
            label: "課堂產出",
            text: "A4 海報 + 走讀回饋 + 路線決定<br><small style=\"font-size:11px;color:#888;\">三週累積一次驗收</small>"
        },
        {
            icon: "👀",
            label: "同儕驗收",
            text: "Gallery Walk 4 輪 + 三色便利貼<br><small style=\"font-size:11px;color:#888;\">收到別人才看得到的盲點</small>"
        },
        {
            icon: "🛤️",
            label: "路線決定",
            text: "Team 合題 / Solo 嚴格 5 項<br><small style=\"font-size:11px;color:#ccc;\">下半學期的工作型態定案</small>"
        }
    ],
    legends: [
        { colorClass: "lm-c1", label: "概念 / 示範" },
        { colorClass: "lm-c4", label: "走讀 / 互動" },
        { colorClass: "lm-c2", label: "個人寫作 / 應用" },
        { colorClass: "lm-c5", label: "同儕交流 / 反思" },
        { colorClass: "lm-c3", label: "開場 / 總結" }
    ]
};

export const W7Data = {
    id: "W7",
    title: "文獻搜尋入門：A-D 證據分級 + 華藝四步",
    duration: 100,
    durationDesc: "2 節課",
    metaCards: [
        { label: '第一節', value: '檔案室手動搜尋 + APA 格式' },
        { label: '第二節', value: '證物 A-D 等級鑑識 + 小組任務' },
        { label: '課堂產出', value: '1 篇真實證物文獻 + APA 書目' },
        { label: '帶去 W8', value: '找到的文獻——下週寫成文獻探討段落' }
    ],
    courseArc: pacingArc.map((item, idx) => ({
        ...item,
        past: idx < 2,
        now: idx === 2
    })),
    coreConcepts: [
        {
            prefix: "①",
            title: "手動搜索",
            subtitle: "先手動搜尋,建立查找路徑",
            desc: "華藝四步：關鍵字 → 搜尋 → 限縮 → 標題摘要全文",
            colorConfig: "r"
        },
        {
            prefix: "②",
            title: "證物 A-D 分級",
            subtitle: "鑑識文獻可信度",
            desc: "A 主要證據 / B 輔助 / C 找方向用 / D 不能用",
            colorConfig: "b"
        },
        {
            prefix: "③",
            title: "APA 格式",
            subtitle: "標準證物標籤",
            desc: "作者(年份). 標題. 期刊／出版社. DOI",
            colorConfig: "c"
        }
    ],
    periods: [
        {
            badge: "第一節",
            title: "檔案室手動搜尋 → APA 標籤",
            duration: 50,
            hasBreakAfter: true,
            stages: [
                {
                    timeStart: "0:00", timeEnd: "0:05", duration: "5 min",
                    colorClass: "c3", icon: "🏛️",
                    title: "一、 開場 + W6 帶入",
                    desc: "從 W6 海報博覽會 / 組隊定的題目帶入——你要為這個題目找文獻。",
                    tags: ["連貫鏈", "目標建立"]
                },
                {
                    timeStart: "0:05", timeEnd: "0:15", duration: "10 min",
                    colorClass: "c4", icon: "🗺️",
                    title: "二、 擬定搜尋策略",
                    desc: "列 3 組關鍵字、設定年份／資料庫／文件類型限制——填搜尋計畫書。",
                    tags: ["關鍵字策略"]
                },
                {
                    timeStart: "0:15", timeEnd: "0:40", duration: "25 min",
                    colorClass: "c1", icon: "👀",
                    title: "三、 華藝實戰：找到第一篇",
                    desc: "登入碩博士論文系統，獨立找出 1 篇符合題目的文獻——先靠自己手動建立查找路徑。",
                    tags: ["華藝實戰", "獨立找尋"],
                    keyPoint: "⚠️ AI 找文獻容易給虛構書目（內容農場、捏造作者）——這週訓練學生自己找。"
                },
                {
                    timeStart: "0:40", timeEnd: "0:50", duration: "10 min",
                    colorClass: "c2", icon: "🏷️",
                    title: "四、 APA 格式標籤練習",
                    desc: "對照 APA 規範清單，幫找到的文獻貼上標準格式書目。",
                    tags: ["APA 格式"]
                }
            ]
        },
        {
            badge: "第二節",
            title: "證物 A-D 鑑識大賽 → 反思繳交",
            duration: 50,
            hasBreakAfter: false,
            stages: [
                {
                    timeStart: "0:00", timeEnd: "0:10", duration: "10 min",
                    colorClass: "c1", icon: "⚖️",
                    title: "五、 證物等級定義",
                    desc: "A 主要證據（碩博論文／同儕審查期刊）、B 輔助（官方報告／專書）、C 找方向（科普／維基）、D 不能用（內容農場／AI 偽造）。",
                    tags: ["證據分級"]
                },
                {
                    timeStart: "0:10", timeEnd: "0:40", duration: "30 min",
                    colorClass: "c2", icon: "🔬",
                    title: "六、 小組鑑識任務（證物 A-E）",
                    desc: "發放 5 張神秘證物卡——調查是名校碩論還是內容農場，寫下查核路徑。",
                    tags: ["小組合作", "查核實戰"]
                },
                {
                    timeStart: "0:40", timeEnd: "0:48", duration: "8 min",
                    colorClass: "c5", icon: "💭",
                    title: "七、 反思 + AI-RED",
                    desc: "1 題反思：今天最容易誤判的是哪張證物？AI-RED 紀錄（optional）。",
                    tags: ["後設認知"]
                },
                {
                    timeStart: "0:48", timeEnd: "0:50", duration: "2 min",
                    colorClass: "c3", icon: "🏁",
                    title: "八、 ExportButton + W8 預告",
                    desc: "預告 W8 文獻偵探社：把今天找到的 A 級文獻寫進文獻探討段落。",
                    tags: ["成果繳交", "下週預告"]
                }
            ]
        }
    ],
    summaries: [
        {
            icon: "📚",
            label: "課堂產出",
            text: "1 篇真實 A 級文獻 + APA 書目<br><small style=\"font-size:11px;color:#888;\">下週直接拿來寫</small>"
        },
        {
            icon: "🔬",
            label: "技能驗收",
            text: "5 張證物 A-D 等級鑑識<br><small style=\"font-size:11px;color:#888;\">能說出查核路徑</small>"
        },
        {
            icon: "🌉",
            label: "兌現點",
            text: "W6 題目 → W7 找文獻 → W8 寫文獻<br><small style=\"font-size:11px;color:#ccc;\">三週連動</small>"
        }
    ],
    legends: [
        { colorClass: "lm-c1", label: "概念 / 示範" },
        { colorClass: "lm-c4", label: "規劃 / 演練" },
        { colorClass: "lm-c2", label: "個人寫作 / 應用" },
        { colorClass: "lm-c5", label: "同儕交流 / 反思" },
        { colorClass: "lm-c3", label: "開場 / 總結" }
    ]
};

export const W8Data = {
    id: "W8",
    title: "文獻偵探社：寫出真正的文獻探討",
    duration: 100,
    durationDesc: "2 節課",
    metaCards: [
        { label: '第一節', value: '識破換字抄襲 + 三明治引用法' },
        { label: '第二節', value: '多文獻整合 + 同儕審查' },
        { label: '課堂產出', value: '5 句以上文獻探討段落（連回題目）' },
        { label: '帶去 W9', value: '文獻探討段落（計畫書第二章地基）' }
    ],
    courseArc: pacingArc.map((item, idx) => ({
        ...item,
        past: idx < 2,
        now: idx === 2
    })),
    coreConcepts: [
        {
            prefix: "①",
            title: "遮蓋測試",
            subtitle: "識破換字抄襲",
            desc: "遮住原文自己寫——確認結構是自己掌握、不是抄改",
            colorConfig: "r"
        },
        {
            prefix: "②",
            title: "三明治引用",
            subtitle: "觀點 + 引用 + 分析",
            desc: "頭中尾三層——讓讀者知道你引這篇要說什麼",
            colorConfig: "b"
        },
        {
            prefix: "③",
            title: "多文獻整合",
            subtitle: "提煉故事、不堆砌",
            desc: "三篇文獻寫成有方向的段落——最後一句連回題目",
            colorConfig: "c"
        }
    ],
    periods: [
        {
            badge: "第一節",
            title: "犯罪鑑識 + 三明治引用工具",
            duration: 50,
            hasBreakAfter: true,
            stages: [
                {
                    timeStart: "0:00", timeEnd: "0:10", duration: "10 min",
                    colorClass: "c3", icon: "🕵️",
                    title: "一、 W7 偵察成果回顧 + 入社儀式",
                    desc: "把 W7 找到的 A 級文獻調出來——這週要把它寫成文獻探討段落。介紹兩種報告犯罪：換字抄襲、文獻堆砌。",
                    tags: ["連貫鏈", "情境導入"]
                },
                {
                    timeStart: "0:10", timeEnd: "0:25", duration: "15 min",
                    colorClass: "c1", icon: "🚫",
                    title: "二、 犯罪現場一：換字抄襲 + 遮蓋測試",
                    desc: "比較兩個版本差異，介紹「遮蓋測試」偵查工具——遮住原文自己寫，看結構是不是自己的。",
                    tags: ["遮蓋測試"]
                },
                {
                    timeStart: "0:25", timeEnd: "0:40", duration: "15 min",
                    colorClass: "c4", icon: "🍔",
                    title: "三、 偵探工具：三明治引用法",
                    desc: "頭（觀點）→ 中（引用）→ 尾（分析）三層結構——讓引用有結論。",
                    tags: ["三層結構", "寫作格式"]
                },
                {
                    timeStart: "0:40", timeEnd: "0:50", duration: "10 min",
                    colorClass: "c2", icon: "📚",
                    title: "四、 偵探工具：多文獻整合",
                    desc: "教三篇文獻怎麼用邏輯串連而非條列堆砌——同意 / 補充 / 反駁 三種關係。",
                    tags: ["多文獻", "串連語感"]
                }
            ]
        },
        {
            badge: "第二節",
            title: "實戰演練 + 同儕互審",
            duration: 50,
            hasBreakAfter: false,
            stages: [
                {
                    timeStart: "0:00", timeEnd: "0:15", duration: "15 min",
                    colorClass: "c1", icon: "🔍",
                    title: "五、 演練一：偵錯改寫",
                    desc: "找出甲乙學生的犯罪手法（換字抄襲 / 堆砌）並自己實作正確改寫。",
                    tags: ["實地演練", "糾錯"]
                },
                {
                    timeStart: "0:15", timeEnd: "0:25", duration: "10 min",
                    colorClass: "c2", icon: "🍔",
                    title: "六、 演練二：三明治實戰",
                    desc: "用 W7 找到的文獻，實地撰寫一個三層完整引用——觀點 + 引用 + 分析。",
                    tags: ["自有文獻應用"]
                },
                {
                    timeStart: "0:25", timeEnd: "0:40", duration: "15 min",
                    colorClass: "c4", icon: "📑",
                    title: "七、 演練三：文獻探討段落",
                    desc: "用三篇文獻寫一個 ≥ 5 句的段落——最後一句一定要連回自己的研究題目。",
                    tags: ["核心產出"],
                    keyPoint: "⚠️ 最後一句連回題目 = 文獻探討的「地基檢核」——沒連回就是堆砌。"
                },
                {
                    timeStart: "0:40", timeEnd: "0:48", duration: "8 min",
                    colorClass: "c5", icon: "⚖️",
                    title: "八、 同儕審查 + 反思",
                    desc: "交換段落用檢核表互審：① 三明治三層完整？ ② 最後一句連回題目？ ③ 不是換字抄襲？1 題反思。",
                    tags: ["同儕審查", "後設認知"]
                },
                {
                    timeStart: "0:48", timeEnd: "0:50", duration: "2 min",
                    colorClass: "c3", icon: "🏁",
                    title: "九、 ExportButton + W9 預告",
                    desc: "預告 W9 計畫書 1-5 章——這段文獻探討會直接搬進計畫書第二章。",
                    tags: ["成果繳交", "下週預告"]
                }
            ]
        }
    ],
    summaries: [
        {
            icon: "📑",
            label: "課堂產出",
            text: "≥ 5 句文獻探討段落<br><small style=\"font-size:11px;color:#888;\">三明治結構 + 連回題目</small>"
        },
        {
            icon: "⚖️",
            label: "技能驗收",
            text: "同儕互審通過 3 項檢核<br><small style=\"font-size:11px;color:#888;\">不是換字抄襲</small>"
        },
        {
            icon: "🌉",
            label: "兌現點",
            text: "W7 找文獻 → W8 寫文獻 → W9 第二章<br><small style=\"font-size:11px;color:#ccc;\">寫一次、用一學期</small>"
        }
    ],
    legends: [
        { colorClass: "lm-c1", label: "概念講解" },
        { colorClass: "lm-c4", label: "演練 / 實作" },
        { colorClass: "lm-c2", label: "個人寫作" },
        { colorClass: "lm-c5", label: "同儕審查 / 反思" },
        { colorClass: "lm-c3", label: "開場 / 總結" }
    ]
};

export const W9Data = {
    id: "W9",
    title: "計畫書 1-5 章地基工程",
    duration: 100,
    durationDesc: "2 節課",
    courseArc: pacingArc.map((item, idx) => ({
        ...item,
        past: idx < 3,
        now: idx === 3
    })),
    coreConcepts: [
        {
            prefix: "①",
            title: "讀 W8 老師回饋",
            subtitle: "把建議納入計畫書修正",
            desc: "進場 5 分鐘看 GC 批改；W8 老師主要建議用一兩句記下",
            colorConfig: "r"
        },
        {
            prefix: "②",
            title: "第一章動機擴寫",
            subtitle: "W3 一句話 → W9 一段話（3 問鷹架）",
            desc: "對照 W3 個人 vs W8 組內題目；用「情境/空缺/解決什麼」3 問擴寫；含學生實例 + 4 種常犯錯誤",
            colorConfig: "y"
        },
        {
            prefix: "③",
            title: "計畫書 2-5 章組裝",
            subtitle: "在計畫書把第二到五章寫到雛形",
            desc: "2 文獻、3 研究方法、4 變項定義、5 抽樣對象——W2-W8 素材整合 + 分章工作流",
            colorConfig: "b"
        },
        {
            prefix: "④",
            title: "AI 工作坊（雙模式）",
            subtitle: "教學型 / 驗收型 + 完整對話繳交",
            desc: "寫不出來 → 教學型請 AI 給範例；有初稿 → 驗收型請 AI 找盲點。完整對話繳到 GC",
            colorConfig: "g"
        }
    ],
    periods: [
        {
            badge: "第一節",
            title: "讀回饋 × 計畫書 1-5 章組裝（前段）",
            duration: 50,
            hasBreakAfter: true,
            stages: [
                {
                    timeStart: "0:00",
                    timeStartFormatted: "00:00",
                    duration: 5,
                    colorClass: "c3",
                    icon: "📢",
                    title: "一、 開場：本週目標",
                    desc: "把計畫書 1-5 章寫到雛形，整合 W2-W8 素材 + W8 老師回饋。工具品質與第六章題目設計移到 W10。"
                },
                {
                    timeStart: "0:05",
                    timeStartFormatted: "00:05",
                    duration: 10,
                    colorClass: "c2",
                    icon: "📬",
                    title: "二、 Step 1 讀 W8 老師回饋 + 1-5 章地圖",
                    desc: "打開 GC 看 W8 批改，記下老師最主要的一兩句建議；對照 1-5 章地圖確認每章對應的 W2-W8 素材。",
                    tags: ["W8 回饋", "章節地圖"]
                },
                {
                    timeStart: "0:15",
                    timeStartFormatted: "00:15",
                    duration: 20,
                    colorClass: "c4",
                    icon: "🔥",
                    title: "三、 Step 2 第一章動機擴寫",
                    desc: "對照 W3 個人 vs W8 組內題目，用 3 問（情境/空缺/解決什麼）把動機從一句話擴成一段。看學生實例 + 4 種常犯錯誤對照。",
                    tags: ["W3→W9 橋", "3 問鷹架"]
                },
                {
                    timeStart: "0:35",
                    timeStartFormatted: "00:35",
                    duration: 15,
                    colorClass: "c2",
                    icon: "✍️",
                    title: "四、 Step 3 計畫書組裝（前段：第二章）",
                    desc: "依分章工作流分配誰寫哪章；先把第二章關鍵詞操作型定義寫到雛形。",
                    tags: ["分章工作流", "第二章"]
                }
            ]
        },
        {
            badge: "第二節",
            title: "計畫書組裝（後段） × AI 工作坊 × 回顧繳交",
            duration: 50,
            hasBreakAfter: false,
            stages: [
                {
                    timeStart: "0:00",
                    timeStartFormatted: "00:00",
                    duration: 30,
                    colorClass: "c2",
                    icon: "✍️",
                    title: "五、 Step 3 計畫書組裝（後段：第三、四、五章）",
                    desc: "第五章對象/抽樣/人數定版；第三、四章寫骨架（文獻 2-3 篇 + 變項清單，定版留課後）。",
                    tags: ["分章工作流", "第三、四、五章"]
                },
                {
                    timeStart: "0:30",
                    timeStartFormatted: "00:30",
                    duration: 15,
                    colorClass: "c4",
                    icon: "🤖",
                    title: "六、 Step 4 AI 工作坊（雙模式）",
                    desc: "選教學型（卡關章節請 AI 給範例）或驗收型（有初稿請 AI 找盲點）；複製 prompt 帶回家跑（深度思考模式）；預想式寫 AI-RED A/I/E/D，R 回家補。",
                    tags: ["雙模式", "完整對話繳交"]
                },
                {
                    timeStart: "0:45",
                    timeStartFormatted: "00:45",
                    duration: 5,
                    colorClass: "c3",
                    icon: "📤",
                    title: "七、 Step 5 回顧繳交 + 時間承諾",
                    desc: "勾驗收 Checklist → 時間承諾（課後補第三、四章定版 + 跑 AI + 上傳 GC）→ ExportButton 匯出。",
                    tags: ["時間承諾", "繳交"]
                }
            ]
        }
    ],
    summaries: [
        {
            icon: "📋",
            label: "核心產出",
            text: "計畫書 1-5 章雛形<br><small style=\"font-size:11px;color:#888;\">W2-W8 素材整合 + W8 建議納入</small>"
        },
        {
            icon: "🤖",
            label: "AI 工作坊",
            text: "雙模式（教學型 / 驗收型）<br><small style=\"font-size:11px;color:#888;\">完整對話繳到 GC</small>"
        },
        {
            icon: "📦",
            label: "課後任務",
            text: "第三、四章定版 + 跑 AI<br><small style=\"font-size:11px;color:#888;\">W10 第一節前完成</small>"
        }
    ],
    legends: [
        { colorClass: "lm-c1", label: "概念講解" },
        { colorClass: "lm-c2", label: "個人 / 小組實作" },
        { colorClass: "lm-c4", label: "分流 / 決策" },
        { colorClass: "lm-c5", label: "同儕互動" },
        { colorClass: "lm-c3", label: "說明 / 收束" }
    ]
};

export const W10Data = {
    id: "W10",
    title: "工具設計 × 整本計畫書 AI 檢核 × 定稿繳交",
    duration: 100,
    durationDesc: "2 節課",
    courseArc: pacingArc.map((item, idx) => ({
        ...item,
        past: idx < 3,
        now: idx === 3
    })),
    coreConcepts: [
        {
            prefix: "①",
            title: "方法工具書 + 4 集教學影片",
            subtitle: "5 法 4 區塊（題型／原則／陷阱／範例）",
            desc: "看完老師親拍影片 + V→R→F 判準 + 自己方法 4 區塊，回 docx 寫第六章題目",
            colorConfig: "r"
        },
        {
            prefix: "②",
            title: "自我與同儕診斷",
            subtitle: "自己挑 → 同學挑 → AI 補漏",
            desc: "V→R→F 自查 + 雷區小測驗 + 跨組同儕互審。AI 工作坊只負責挑不出但覺得怪的",
            colorConfig: "b"
        },
        {
            prefix: "③",
            title: "AI 工作坊 + 整本繳交",
            subtitle: "雙模式 + 第七到十三章補完",
            desc: "AI 工作坊（教學型 / 驗收型）+ 整本繳到 GC，下週 W11 拿老師第三次建議",
            colorConfig: "g"
        }
    ],
    periods: [
        {
            badge: "第一節",
            title: "入場 × 讀回饋 × 方法工具書 × 寫第六章題目",
            duration: 50,
            hasBreakAfter: true,
            stages: [
                {
                    timeStart: "0:00",
                    timeEnd: "0:05",
                    duration: "5 min",
                    colorClass: "c3",
                    icon: "🚦",
                    title: "一、 入場擋板 + 讀 W9 老師回饋",
                    desc: "PrepStatusCheck 讀 W9 完成度；打開 GC 看 W9 計畫書 1-5 章批改，記下老師最主要建議。",
                    tags: ["入場擋板", "W9 回饋"]
                },
                {
                    timeStart: "0:05",
                    timeEnd: "0:10",
                    duration: "5 min",
                    colorClass: "c3",
                    icon: "🎯",
                    title: "二、 Step 1 開場 + 第六章流程",
                    desc: "本節目標：在 docx 第六章寫題目。方法從 W9 自動帶入；必要時手動切換。",
                    tags: ["方法分流"]
                },
                {
                    timeStart: "0:10",
                    timeEnd: "0:35",
                    duration: "25 min",
                    colorClass: "c1",
                    icon: "📚",
                    title: "三、 Step 2 方法工具書（含 4 集教學影片）",
                    desc: "看老師親拍 4 集影片（文獻／訪談／觀察／實驗）+ V→R→F 三大判準 + 自己方法的 4 區塊（題型／原則／陷阱／範例）。",
                    tags: ["影片預習", "5 法 4 區塊"]
                },
                {
                    timeStart: "0:35",
                    timeEnd: "0:50",
                    duration: "15 min",
                    colorClass: "c2",
                    icon: "✍️",
                    title: "四、 Step 2 docx 第六章寫題目（前段）",
                    desc: "依方法寫題目雛形：問卷／訪談／實驗／觀察／文獻分析架構。網頁 ThinkRecord 只記 2-3 個關鍵決定。",
                    tags: ["docx 動手", "第六章雛形"]
                }
            ]
        },
        {
            badge: "第二節",
            title: "AI 工作坊 × 老師諮詢 × 整本繳交",
            duration: 50,
            hasBreakAfter: false,
            stages: [
                {
                    timeStart: "0:00",
                    timeEnd: "0:20",
                    duration: "20 min",
                    colorClass: "c1",
                    icon: "🤖",
                    title: "五、 Step 3 AI 工作坊（雙模式 + 不用 AI 三選一）",
                    desc: "選教學型（卡關請 AI 給範例）／驗收型（有題目請 AI 找毛病）／不用 AI（自己練手）三選一；完整對話繳到 GC；寫 AI-RED 紀錄。",
                    tags: ["三模式", "完整對話繳交"]
                },
                {
                    timeStart: "0:20",
                    timeEnd: "0:40",
                    duration: "20 min",
                    colorClass: "c4",
                    icon: "🧑‍🏫",
                    title: "六、 Step 4 老師諮詢區",
                    desc: "老師隨機抽組到諮詢區報告進度（5 min/組），帶 AI 跑過的計畫書讓老師最終把關。沒被抽到的可主動排隊。",
                    tags: ["最終把關", "隨機抽組"]
                },
                {
                    timeStart: "0:40",
                    timeEnd: "0:48",
                    duration: "8 min",
                    colorClass: "c2",
                    icon: "📤",
                    title: "七、 Step 5 七到十三章補完 + 整本繳交",
                    desc: "第七到十三章模板套用補完（時程／倫理／AI聲明／參考文獻）；整本計畫書上傳 GC。第八章＋第九章(三) 草稿即可。",
                    tags: ["第七~十三章", "整本繳交"]
                },
                {
                    timeStart: "0:48",
                    timeEnd: "0:50",
                    duration: "2 min",
                    colorClass: "c5",
                    icon: "🔮",
                    title: "八、 Step 6 繳交確認 + W11 預告",
                    desc: "ExportButton 匯出網頁紀錄；W11 拿到老師第三次建議再修工具 + 實體工具轉換（Google Form／紙本）+ 跨班 Pilot。",
                    tags: ["匯出", "W11 預告"]
                }
            ]
        }
    ],
    summaries: [
        {
            icon: "🔧",
            label: "核心產出",
            text: "計畫書 13 章全到位<br><small style=\"font-size:11px;color:#888;\">第六章寫題目 + 七到十三章模板套用</small>"
        },
        {
            icon: "🤝",
            label: "AI + 老師雙層把關",
            text: "AI 工作坊自查 → 老師諮詢區把關<br><small style=\"font-size:11px;color:#888;\">三模式可選（含「不用 AI」）</small>"
        },
        {
            icon: "📅",
            label: "課後任務",
            text: "等老師第三次建議<br><small style=\"font-size:11px;color:#ccc;\">W11 實體工具轉換 + 跨班 Pilot</small>"
        }
    ],
    legends: [
        { colorClass: "lm-c1", label: "示範 / 診斷" },
        { colorClass: "lm-c2", label: "精修 / 實作" },
        { colorClass: "lm-c4", label: "統整 / 確認" },
        { colorClass: "lm-c5", label: "互動 / 展示" },
        { colorClass: "lm-c3", label: "說明 / 收束" }
    ]
};

export const W11Data = {
    id: "W11",
    title: "工具實體 × 跨方法 Pilot × 倫理 × 施測啟動",
    duration: 100,
    durationDesc: "2 節課",
    courseArc: pacingArc.map((item, idx) => ({
        ...item,
        past: idx < 4,
        now: idx === 4
    })),
    coreConcepts: [
        {
            prefix: "①",
            title: "工具實體（題目轉載具）",
            subtitle: "Google Form / 訪綱卡 / 紀錄表",
            desc: "W10 寫題目，W11 把題目搬到能施測的載具上；含關鍵呈現決策",
            colorConfig: "r"
        },
        {
            prefix: "②",
            title: "座位表一對一跨方法預試（Pilot）",
            subtitle: "雙向紀錄 + 自我檢核",
            desc: "對方不一定同方法，模擬真實受測者；4 件事每組都要做（知情/計時/觀察/雙向紀錄）",
            colorConfig: "b"
        },
        {
            prefix: "③",
            title: "倫理四原則自查",
            subtitle: "對照小組設計實踐",
            desc: "知情/隱私/不傷害/自願——對照四原則，記錄這四個在自己研究要怎麼實踐",
            colorConfig: "g"
        },
        {
            prefix: "④",
            title: "工具繳交",
            subtitle: "Classroom 繳工具實體 + 上課歷程 docx",
            desc: "工具實體（Form／訪綱／紀錄表）連結 + 一鍵匯出歷程 docx 一起貼到 Classroom；老師收回統一給回饋",
            colorConfig: "y"
        }
    ],
    periods: [
        {
            badge: "第一節",
            title: "讀 W10 回饋 × 修星號項 × 把題目轉成施測載具",
            duration: 50,
            hasBreakAfter: true,
            stages: [
                {
                    timeStart: "0:00",
                    timeEnd: "0:05",
                    duration: "5 min",
                    colorClass: "c2",
                    icon: "📬",
                    title: "一、 Step 1 開場：讀 W10 老師回饋",
                    desc: "打開 Google Classroom 看 W10 整本計畫書批改，把老師最主要的建議記下來。",
                    tags: ["W10 回饋", "快速讀取"]
                },
                {
                    timeStart: "0:05",
                    timeEnd: "0:15",
                    duration: "10 min",
                    colorClass: "c4",
                    icon: "⭐",
                    title: "二、 Step 1 修補 ★★★ 必改項",
                    desc: "依老師標的星號等級分流：★★★ 今天必修、★★ 有空再修、★ 提醒。把 ★★★ 項目寫成具體修補計畫並動手改 docx。",
                    tags: ["星號分級", "聚焦必改"]
                },
                {
                    timeStart: "0:15",
                    timeEnd: "0:25",
                    duration: "10 min",
                    colorClass: "c1",
                    icon: "🛠️",
                    title: "三、 Step 2 拿模板 + W10 vs W11 分工說明",
                    desc: "依主方法／補充方法／文獻子類型，下載對應的工具實體模板（Google Form 範本／訪綱／紀錄表）。明確：今天不改題目內容，只把寫好的題目搬上載具。",
                    tags: ["GDrive 模板", "5 法分流"]
                },
                {
                    timeStart: "0:25",
                    timeEnd: "0:50",
                    duration: "25 min",
                    colorClass: "c5",
                    icon: "🧱",
                    title: "四、 Step 2 把題目搬上載具",
                    desc: "問卷轉 Form／訪綱印卡／紀錄表設欄位／文獻編碼表填類別。載具本體留在學生手上（不在網頁填連結），下節 Pilot 直接用，改完再隨計畫書一起繳到 GC。",
                    tags: ["工具實體", "5 法分流"]
                }
            ]
        },
        {
            badge: "第二節",
            title: "座位表一對一預試（Pilot） × 倫理 × 施測啟動",
            duration: 50,
            hasBreakAfter: false,
            stages: [
                {
                    timeStart: "0:00",
                    timeEnd: "0:05",
                    duration: "5 min",
                    colorClass: "c4",
                    icon: "🗺",
                    title: "五、 Step 3 配對指示 + 4 件事說明",
                    desc: "老師投影座位表一對一跨方法配對。讀「當作真的施測 4 件事」：知情同意短版／計時／專注觀察／雙向紀錄。",
                    tags: ["座位表", "跨方法"]
                },
                {
                    timeStart: "0:05",
                    timeEnd: "0:30",
                    duration: "25 min",
                    colorClass: "c5",
                    icon: "🧪",
                    title: "六、 Step 3 Pilot 互測 + 雙向紀錄",
                    desc: "前 12 分鐘 A 當研究者測 B、後 12 分鐘 B 當研究者測 A。各自寫 partner / findings / as-subject 三格紀錄；過程拍 1-2 張不露臉照存證。",
                    tags: ["Pilot 實戰", "雙向紀錄"]
                },
                {
                    timeStart: "0:30",
                    timeEnd: "0:35",
                    duration: "5 min",
                    colorClass: "c2",
                    icon: "🔧",
                    title: "七、 Step 4 工具第二輪修正（依 Pilot 改）",
                    desc: "依 Pilot 發現整理具體修改清單：題目改用詞、量表改點數、載具版面調整、實驗組架設圖補洞——直接寫進 w11-tool-final-revision，並回 docx 改。",
                    tags: ["最後一版", "依 Pilot 改"]
                },
                {
                    timeStart: "0:35",
                    timeEnd: "0:45",
                    duration: "10 min",
                    colorClass: "c4",
                    icon: "⚖",
                    title: "八、 Step 5 倫理四原則自查",
                    desc: "對照知情同意／隱私／不傷害／自願四原則，回頭審查小組的研究設計，記錄這四個在自己研究要怎麼實踐（合併一格紀錄、不拆四題）。",
                    tags: ["四原則", "小組設計實踐"]
                },
                {
                    timeStart: "0:45",
                    timeEnd: "0:50",
                    duration: "5 min",
                    colorClass: "c3",
                    icon: "🛫",
                    title: "九、 Step 6 收尾：工具實體繳交 + W12 預告",
                    desc: "5 min 內完成：① 工具實體連結貼到 Classroom 本週作業 ② 一鍵匯出網頁歷程 docx 一起貼（含 Pilot 紀錄、第二輪修正、倫理四原則）③ 看 W12 預告。老師收回工具書統一給回饋。",
                    tags: ["工具繳交", "歷程匯出", "W12 預告"]
                }
            ]
        }
    ],
    summaries: [
        {
            icon: "🛠️",
            label: "工具實體",
            text: "題目搬上施測載具<br><small style=\"font-size:11px;color:#888;\">Google Form／訪綱卡／紀錄表</small>"
        },
        {
            icon: "🧪",
            label: "Pilot 發現",
            text: "座位表一對一跨方法預試（Pilot）<br><small style=\"font-size:11px;color:#888;\">當研究者紀錄 + 自我檢核</small>"
        },
        {
            icon: "⚖",
            label: "倫理審查",
            text: "倫理四原則 · 小組實踐紀錄<br><small style=\"font-size:11px;color:#888;\">老師收回工具書統一給回饋</small>"
        },
        {
            icon: "🛫",
            label: "施測啟動",
            text: "目標／時程／備案／啟動宣告<br><small style=\"font-size:11px;color:#ccc;\">W12 正式蒐集資料</small>"
        }
    ],
    legends: [
        { colorClass: "lm-c1", label: "概念 / 講解" },
        { colorClass: "lm-c2", label: "實作 / 計畫" },
        { colorClass: "lm-c4", label: "修正 / 許可" },
        { colorClass: "lm-c5", label: "互動 / 報告" },
        { colorClass: "lm-c3", label: "說明 / 收束" }
    ]
};

export const W12Data = {
    id: "W12",
    title: "期中進度短報 · 同儕把關",
    duration: 100,
    durationDesc: "2 節課",
    courseArc: pacingArc.map((item, idx) => ({
        ...item,
        past: idx < 5,
        now: idx === 5
    })),
    coreConcepts: [
        {
            prefix: "①",
            title: "各組期中短報",
            subtitle: "3 min Pitch + 1 min QA",
            desc: "5 段內容：題目 / 動機 / 方法+工具 / 文獻探討 3 篇 / 進度（含預期蒐集）",
            colorConfig: "r"
        },
        {
            prefix: "②",
            title: "全班同儕回饋 Form",
            subtitle: "6 漏洞選擇 + 30 字建議 + 30 字學到什麼",
            desc: "每位同學聽 12 組各填一次；老師當場投影回饋分布",
            colorConfig: "b"
        },
        {
            prefix: "③",
            title: "老師當場評分（4 維 × 4 級 = 16 分）",
            subtitle: "計畫書 / 工具 / Pilot 紀錄 / 報告清晰度",
            desc: "≤12 分組 W13 前要找老師談；公開壓力槓桿督促進度",
            colorConfig: "g"
        }
    ],
    periods: [
        {
            badge: "第一節",
            title: "開場 + Round 1（7 組短報）",
            duration: 50,
            hasBreakAfter: true,
            stages: [
                {
                    timeStart: "0:00",
                    timeEnd: "0:05",
                    duration: "5 min",
                    colorClass: "c1",
                    icon: "📢",
                    title: "一、 開場 + 規則",
                    desc: "邊聽可以邊填表；每組之間留 1 分鐘確保填完。",
                    tags: ["規則"]
                },
                {
                    timeStart: "0:05",
                    timeEnd: "0:40",
                    duration: "35 min",
                    colorClass: "c5",
                    icon: "🎤",
                    title: "二、 Round 1：7 組短報",
                    desc: "每組 5 min（3 短報 + 1 老師提問 + 1 緩衝給聽眾把同儕 Form 填完）",
                    tags: ["短報×7"]
                },
                {
                    timeStart: "0:40",
                    timeEnd: "0:50",
                    duration: "10 min",
                    colorClass: "c2",
                    icon: "⏳",
                    title: "三、 緩衝",
                    desc: "補填漏掉的回饋",
                    tags: ["緩衝"]
                }
            ]
        },
        {
            badge: "第二節",
            title: "Round 2（6 組短報）+ 老師總結",
            duration: 50,
            hasBreakAfter: false,
            stages: [
                {
                    timeStart: "1:00",
                    timeEnd: "1:30",
                    duration: "30 min",
                    colorClass: "c5",
                    icon: "🎤",
                    title: "四、 Round 2：6 組短報",
                    desc: "同 Round 1 流程",
                    tags: ["短報×6"]
                },
                {
                    timeStart: "1:30",
                    timeEnd: "1:50",
                    duration: "20 min",
                    colorClass: "c4",
                    icon: "🏁",
                    title: "五、 老師總結 + 收尾",
                    desc: "集體痛點 + W13 督促名單（評分私下給組長，不公告）",
                    tags: ["總結", "W13 督促"]
                }
            ]
        }
    ],
    summaries: [
        {
            icon: "🎤",
            label: "全班短報",
            text: "施測前最後一道擋板<br><small style=\"font-size:11px;color:#888;\">3 min Pitch + 1 min QA</small>"
        },
        {
            icon: "✏️",
            label: "同儕回饋",
            text: "全班 30 人填 Google Form<br><small style=\"font-size:11px;color:#888;\">漏洞 5 選 1 + 建議 + 學到</small>"
        },
        {
            icon: "⭐",
            label: "老師評分",
            text: "4 維 × 4 級 = 16 分<br><small style=\"font-size:11px;color:#888;\">當場給分；督促 W13 前修正</small>"
        },
        {
            icon: "📤",
            label: "課後反思",
            text: "聽完學到什麼 + 自組要改什麼<br><small style=\"font-size:11px;color:#ccc;\">W13 進入最後衝刺</small>"
        }
    ],
    legends: [
        { colorClass: "lm-c1", label: "概念 / 講解" },
        { colorClass: "lm-c2", label: "實作 / 計畫" },
        { colorClass: "lm-c4", label: "修正 / 許可" },
        { colorClass: "lm-c5", label: "互動 / 報告" },
        { colorClass: "lm-c3", label: "說明 / 收束" }
    ]
};

export const W13Data = {
    id: "W13",
    title: "資料整理週：把原始資料變成可分析的表",
    description: "W11-W12 用第六章工具蒐集到一堆原始資料——但還不能直接交給 Gemini 畫圖。本週把它轉成「分析表」：欄位清楚、N 值明確，下週 W14 才畫得了圖。",
    periods: [
        {
            name: "第一節",
            duration: "50 min",
            title: "認識資料樣態 × 範本與彙整",
            stages: [
                { time: "0:00 - 0:15", title: "① 認識資料樣態", desc: "5 法原始資料 → 分析表對照表；學生自我定位（我手上是還沒整理還是已半結構化）。", tags: ["對照表", "自我定位"], colorClass: "lm-c1" },
                { time: "0:15 - 0:30", title: "② 範本與彙整教學", desc: "問卷／訪談／實驗組看「分析表結構範本」；觀察／文獻組看「xlsx 彙整教學」。", tags: ["範本", "兩條路徑"], colorClass: "lm-c1" },
                { time: "0:30 - 0:50", title: "③ 動手整理（前段）", desc: "建立分析表的欄位 header + 第一筆資料；老師巡視確認結構正確。", tags: ["實作", "建表"], colorClass: "lm-c2" }
            ]
        },
        {
            name: "第二節",
            duration: "50 min",
            title: "動手整理 × 收尾繳交",
            stages: [
                { time: "0:00 - 0:35", title: "④ 動手整理（後段）", desc: "把資料填進分析表；進度自評（綠／黃／紅）；老師優先協助紅燈組。", tags: ["實作", "巡視"], colorClass: "lm-c2" },
                { time: "0:35 - 0:50", title: "⑤ 收尾繳交", desc: "貼分析表連結（必繳）+ 寫表結構摘要 + 預告 W14 第一張圖；匯出。", tags: ["繳交", "預告"], colorClass: "lm-c3" }
            ]
        }
    ],
    summaries: [
        {
            icon: "📊",
            label: "資料樣態",
            text: "5 法原始資料 → 分析表對照<br><small style=\"font-size:11px;color:#888;\">問卷 / 訪談 / 實驗 / 觀察 / 文獻</small>"
        },
        {
            icon: "🧰",
            label: "兩條路徑",
            text: "從零建表 vs 彙整 xlsx<br><small style=\"font-size:11px;color:#888;\">問訪實 vs 觀察文獻</small>"
        },
        {
            icon: "🔗",
            label: "繳交分析表連結",
            text: "Google Sheet 公開連結<br><small style=\"font-size:11px;color:#ccc;\">W14 直接讀取畫圖</small>"
        }
    ],
    legends: [
        { colorClass: "lm-c1", label: "概念 / 範本" },
        { colorClass: "lm-c2", label: "實作 / 整理" },
        { colorClass: "lm-c3", label: "說明 / 收束" }
    ]
};

export const W14Data = {
    id: "W14",
    title: "讓數據自己說話：圖表選擇與圖說寫作",
    duration: 100,
    durationDesc: "2 節課",
    metaCards: [
        { label: '第一節', value: '選對盤子：四大圖表與格式規範' },
        { label: '第二節', value: '描述 vs 推論 × Chart Swap 互評' },
        { label: '課堂產出', value: '圖表初稿 + 圖說段落 + 互評回饋' },
        { label: '帶去 W14', value: '完整圖表，準備撰寫結論' }
    ],
    courseArc: pacingArc.map((item, idx) => ({
        ...item,
        past: idx < 5,
        now: idx === 5
    })),
    coreConcepts: [
        {
            prefix: "①",
            title: "四大圖表速查",
            subtitle: "折線、圓餅、長條、散佈",
            desc: "選對盤子，數據才好讀",
            colorConfig: "r"
        },
        {
            prefix: "②",
            title: "圖說寫作公式",
            subtitle: "描述 (客觀) + 推論 (主觀)",
            desc: "讓讀者看懂數據背後的意義",
            colorConfig: "b"
        }
    ],
    periods: [
        {
            badge: "第一節",
            title: "選對盤子：四大圖表與格式規範",
            duration: 50,
            hasBreakAfter: true,
            stages: [
                {
                    timeStart: "0:00",
                    timeEnd: "0:15",
                    duration: "15 min",
                    colorClass: "c1",
                    icon: "📊",
                    title: "觀念一｜四大圖表與決策口訣",
                    desc: "講解折線、圓餅、長條、散佈圖的適用場景。從「長條圖」出發的排除法決策流程。",
                    tags: ["圖表類型", "決策邏輯"]
                },
                {
                    timeStart: "0:15",
                    timeEnd: "0:30",
                    duration: "15 min",
                    colorClass: "c4",
                    icon: "📌",
                    title: "觀念二｜圖表格式三鐵則",
                    desc: "標題位置（上）、資料來源（下）、正文引用（如圖一所示）。強調 N 值防呆的重要性。",
                    tags: ["格式規範", "學術要求"]
                },
                {
                    timeStart: "0:30",
                    timeEnd: "0:45",
                    duration: "15 min",
                    colorClass: "c2",
                    icon: "🎨",
                    title: "實戰一｜圖表決策直覺訓練",
                    desc: "處理 4 個演練題，判斷最適合的圖表類型。討論複選題為何不能用圓餅圖。",
                    tags: ["互動演練", "除錯練習"]
                },
                {
                    timeStart: "0:45",
                    timeEnd: "0:50",
                    duration: "5 min",
                    colorClass: "c3",
                    icon: "🏁",
                    title: "小結：第一節收尾",
                    desc: "確認每組都至少決定了一種圖表類型，並開啟原始資料準備製圖。",
                    tags: ["小組進度"]
                }
            ]
        },
        {
            badge: "第二節",
            title: "賦予意義：描述 vs 推論",
            duration: 50,
            hasBreakAfter: false,
            stages: [
                {
                    timeStart: "0:00",
                    timeEnd: "0:15",
                    duration: "15 min",
                    colorClass: "c1",
                    icon: "⚖️",
                    title: "觀念三｜一張圖的說明公式",
                    desc: "區分客觀事實（描述）與主觀見解（推論）。講解「可能」二字在推論中的關鍵地位。",
                    tags: ["寫作公式", "逻辑分析"]
                },
                {
                    timeStart: "0:15",
                    timeEnd: "0:30",
                    duration: "15 min",
                    colorClass: "c5",
                    icon: "🧩",
                    title: "演練二｜Case Study 深度拆解",
                    desc: "透過三種案例練習填空。討論「絕大多數」等模糊量詞的陷阱，學習引用精確數字。",
                    tags: ["案例分析", "精準語言"]
                },
                {
                    timeStart: "0:30",
                    timeEnd: "0:40",
                    duration: "10 min",
                    colorClass: "c2",
                    icon: "✍️",
                    title: "實戰二｜寫下你們的圖說段落",
                    desc: "各組針對自製圖表，用藍紅筆區分完成「描述」與「推論」兩部分寫作。",
                    tags: ["個人/小組寫作", "實作挑戰"]
                },
                {
                    timeStart: "0:40",
                    timeEnd: "0:48",
                    duration: "8 min",
                    colorClass: "c4",
                    icon: "🔄",
                    title: "Chart Swap 同儕互評",
                    desc: "單向輪轉配對，把圖表+圖說交給另一組。對照 6 項清單（圖表類型、格式、N 值、描述精準度、推論合理性、邏輯連貫）逐項打勾，口頭回報最大問題。",
                    tags: ["同儕互評", "品質檢查"]
                },
                {
                    timeStart: "0:48",
                    timeEnd: "0:50",
                    duration: "2 min",
                    colorClass: "c3",
                    icon: "🏆",
                    title: "總結與 W15 預告",
                    desc: "預看 W15 四層結論。根據 Chart Swap 回饋回家修正，確認各組已準備好圖解與圖說。",
                    tags: ["總結收斂", "下週預告"]
                }
            ]
        }
    ],
    summaries: [
        {
            icon: "📈",
            label: "圖表初稿",
            text: "正確格式的統計圖表<br><small style=\"font-size:11px;color:#888;\">含標題、N值與來源</small>"
        },
        {
            icon: "📝",
            label: "圖說段落",
            text: "描述+推論寫作練習<br><small style=\"font-size:11px;color:#888;\">數據賦能與意義詮釋</small>"
        }
    ],
    legends: [
        { colorClass: "lm-c1", label: "核心觀念" },
        { colorClass: "lm-c4", label: "同儕互評" },
        { colorClass: "lm-c2", label: "互動演練" },
        { colorClass: "lm-c5", label: "案例拆解" },
        { colorClass: "lm-c3", label: "小結預告" }
    ]
};
export const W15Data = {
    id: "W15",
    title: "研究結論：四層寫作法",
    duration: 100,
    durationDesc: "2 節課",
    metaCards: [
        { label: '第一節', value: '四層公式 + 呼應層精練' },
        { label: '第二節', value: '批判層 + AI 輔助整合' },
        { label: '課業產出', value: '完整四層結論段落' },
        { label: '帶去 W15', value: '結論定稿，準備簡報' }
    ],
    courseArc: pacingArc.map((item, idx) => ({
        ...item,
        past: idx < 6,
        now: idx === 6
    })),
    coreConcepts: [
        {
            prefix: "①",
            title: "四層寫作法",
            subtitle: "描述 / 詮釋 / 呼應 / 批判",
            desc: "建立完整、嚴謹的研究結論結構",
            colorConfig: "r"
        },
        {
            prefix: "②",
            title: "呼應層核心",
            subtitle: "連結發現與研究問題",
            desc: "確保研究有頭有尾，回答最初的疑問",
            colorConfig: "b"
        }
    ],
    periods: [
        {
            badge: "第一節",
            title: "四層公式與呼應精練",
            duration: 50,
            hasBreakAfter: true,
            stages: [
                {
                    timeStart: "0:00",
                    timeEnd: "0:15",
                    duration: "15 min",
                    colorClass: "c1",
                    icon: "🧱",
                    title: "觀念：四層寫作法核心邏輯",
                    desc: "介紹從局部圖說到完整結論的升級過程，講解四層公式（Description, Interpretation, Callback, Critique）。",
                    tags: ["概念導入"]
                },
                {
                    timeStart: "0:15",
                    timeEnd: "0:30",
                    duration: "15 min",
                    colorClass: "c4",
                    icon: "🏥",
                    title: "演練：診斷缺失的層級",
                    desc: "透過兩個案例演練，讓學生學會辨識一段結論中缺少了哪一層，強化結構意識。",
                    tags: ["互動演練"]
                },
                {
                    timeStart: "0:30",
                    timeEnd: "0:50",
                    duration: "20 min",
                    colorClass: "c2",
                    icon: "✍️",
                    title: "實作：撰寫呼應層草稿",
                    desc: "學生翻閱 W3 題目，對比現有發現，填寫學習單呼應層草稿。",
                    tags: ["個人實作", "連回題目"]
                }
            ]
        },
        {
            badge: "第二節",
            title: "批判層與 AI 整合",
            duration: 50,
            hasBreakAfter: false,
            stages: [
                {
                    timeStart: "0:00",
                    timeEnd: "0:15",
                    duration: "15 min",
                    colorClass: "c1",
                    icon: "⚠️",
                    title: "觀念：研究限制的真諦",
                    desc: "講解樣本、工具、時間、測量等四種常見限制，說明批判層是研究誠信的體現。",
                    tags: ["倫理教育"]
                },
                {
                    timeStart: "0:15",
                    timeEnd: "0:35",
                    duration: "20 min",
                    colorClass: "c2",
                    icon: "🔬",
                    title: "實作：撰寫批判層草稿",
                    desc: "學生診斷自身研究的邊界，選取 1–2 個最相關的限制進行撰寫。",
                    tags: ["批判思考"]
                },
                {
                    timeStart: "0:35",
                    timeEnd: "0:50",
                    duration: "15 min",
                    colorClass: "c5",
                    icon: "🤖",
                    title: "AI 輔助：結構優化與表達磨練",
                    desc: "掃除個資後，貼上 Prompt 請 AI 潤擬四層草稿，並記錄 AI-RED。",
                    tags: ["AI 協作", "AI-RED"]
                }
            ]
        }
    ],
    summaries: [
        {
            icon: "📝",
            label: "課堂產出",
            text: "完整四層結論段落<br><small style=\"font-size:11px;color:#888;\">含 AI 潤稿歷程</small>"
        }
    ],
    legends: [
        { colorClass: "lm-c1", label: "概念 / 觀念" },
        { colorClass: "lm-c2", label: "實作 / 寫作" },
        { colorClass: "lm-c4", label: "診斷 / 演練" },
        { colorClass: "lm-c5", label: "AI 輔助" }
    ]
};

export const W16Data = {
    id: "W16",
    title: "報告撰寫與海報製作：從數據到故事",
    duration: 100,
    durationDesc: "2 節課",
    courseArc: pacingArc.map((item, idx) => ({
        ...item,
        past: idx < 7,
        now: idx === 7
    })),
    coreConcepts: [
        {
            prefix: "①",
            title: "七步組裝",
            subtitle: "搬運 → 縫合 → 潤色",
            desc: "80% 內容前 15 週已寫完，現在只要組裝",
            colorConfig: "r"
        },
        {
            prefix: "②",
            title: "AI 潤色校對",
            subtitle: "縫合稿 + 人工校對",
            desc: "AI 協助縫合與語氣調整，人工把關事實與邏輯",
            colorConfig: "b"
        },
        {
            prefix: "③",
            title: "海報設計",
            subtitle: "A1 海報 + 發表預演",
            desc: "把七章壓縮到一張海報，能在 3 分鐘內說完",
            colorConfig: "g"
        }
    ],
    periods: [
        {
            badge: "第一節",
            title: "七步組裝 × AI 潤色 × 人工校對",
            duration: 50,
            hasBreakAfter: true,
            stages: [
                {
                    timeStart: "0:00",
                    timeStartFormatted: "00:00",
                    duration: 5,
                    colorClass: "c3",
                    icon: "📦",
                    title: "一、 開場：組裝出發",
                    desc: "好消息：報告已寫完 80%。前 15 週學習單都是原料，今天只需搬運、縫合、潤色。",
                    tags: ["動機", "框架"]
                },
                {
                    timeStart: "0:05",
                    timeStartFormatted: "00:05",
                    duration: 15,
                    colorClass: "c1",
                    icon: "🧭",
                    title: "二、 七步組裝清單",
                    desc: "依七章清單逐項核對學習單來源：動機（W2）、文獻（W5-6）、方法（W8-11）、結果（W14）、結論（W15）。",
                    tags: ["章節對照"]
                },
                {
                    timeStart: "0:20",
                    timeStartFormatted: "00:20",
                    duration: 20,
                    colorClass: "c5",
                    icon: "🤖",
                    title: "三、 AI 組裝 Prompt",
                    desc: "貼入七章素材與風格指引，讓 AI 產生縫合稿；同步記錄 AI-RED 五要素（A-I-R-E-D）。",
                    tags: ["AI 協作", "AI-RED"]
                },
                {
                    timeStart: "0:40",
                    timeStartFormatted: "00:40",
                    duration: 10,
                    colorClass: "c4",
                    icon: "🔍",
                    title: "四、 人工校對",
                    desc: "逐章檢查 AI 是否扭曲事實、補數據、跳結論；標出需要人工改寫的段落。",
                    tags: ["把關", "AI 限制"]
                }
            ]
        },
        {
            badge: "第二節",
            title: "海報製作 × 發表預演 × 繳交",
            duration: 50,
            hasBreakAfter: false,
            stages: [
                {
                    timeStart: "0:00",
                    timeStartFormatted: "00:00",
                    duration: 15,
                    colorClass: "c1",
                    icon: "🗺️",
                    title: "五、 海報規劃",
                    desc: "A1 海報骨架：題目、動機、方法、關鍵圖、結論、限制。先畫手稿版面，再開工。",
                    tags: ["版面配置", "視覺層級"]
                },
                {
                    timeStart: "0:15",
                    timeStartFormatted: "00:15",
                    duration: 25,
                    colorClass: "c2",
                    icon: "🎨",
                    title: "六、 海報製作",
                    desc: "使用 Canva / Figma / Slides 模板填入內容，掌握三大準則：圖大於字、標題可讀、留白乾淨。",
                    tags: ["核心產出"]
                },
                {
                    timeStart: "0:40",
                    timeStartFormatted: "00:40",
                    duration: 10,
                    colorClass: "c5",
                    icon: "🎙️",
                    title: "七、 發表預演 + 繳交",
                    desc: "組內 3 分鐘電梯簡報預演，繳交報告定稿與海報檔；預告 W17 策展人登場。",
                    tags: ["預演", "銜接 W17"]
                }
            ]
        }
    ],
    summaries: [
        {
            icon: "📄",
            label: "核心產出",
            text: "研究報告定稿<br><small style=\"font-size:11px;color:#888;\">七章組裝完成</small>"
        },
        {
            icon: "🖼️",
            label: "發表工具",
            text: "A1 海報檔 + 3 分鐘簡報<br><small style=\"font-size:11px;color:#888;\">W17 成果發表用</small>"
        },
        {
            icon: "🤖",
            label: "AI 紀錄",
            text: "組裝 Prompt + AI-RED 紀錄<br><small style=\"font-size:11px;color:#888;\">誠實揭露協作歷程</small>"
        }
    ],
    legends: [
        { colorClass: "lm-c1", label: "概念 / 架構" },
        { colorClass: "lm-c2", label: "個人 / 小組實作" },
        { colorClass: "lm-c4", label: "校對 / 把關" },
        { colorClass: "lm-c5", label: "AI 協作 / 發表" },
        { colorClass: "lm-c3", label: "說明 / 收束" }
    ]
};
