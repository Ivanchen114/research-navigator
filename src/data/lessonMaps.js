export const baseCourseArc = [
    { wk: 'W1-W2', name: '探索階段\nRED公約' },
    { wk: 'W3-W4', name: '題目診斷\n博覽會' },
    { wk: 'W5-W7', name: '規劃分流\n企劃定案' },
    { wk: 'W8-W10', name: '工具設計\n倫理審查' },
    { wk: 'W11-W12', name: '執行階段\n自主研究' },
    { wk: 'W13', name: '數據轉譯\n圖表製作' },
    { wk: 'W14', name: '研究結論\n四層整合' },
    { wk: 'W15-W16', name: '成果簡報\n博覽發表' }
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
            title: "診斷・心法・人的練習",
            duration: 50,
            hasBreakAfter: true,
            stages: [
                {
                    timeStart: "0:00",
                    timeEnd: "0:04",
                    duration: "4 min",
                    colorClass: "c3",
                    icon: "🧱",
                    title: "階段 0｜碰壁體驗：你真的做得到嗎？",
                    desc: "不先講道理，直接投影兩個看似合理但其實做不動的題目，追問學生第一步要怎麼做，讓他們親身感受『題目生病』的卡住感。",
                    tags: ["直接對決", "碰壁體驗"]
                },
                {
                    timeStart: "0:04",
                    timeEnd: "0:09",
                    duration: "5 min",
                    colorClass: "c3",
                    icon: "🌉",
                    title: "階段 1｜暖身：從 W2 走到 W3",
                    desc: "回顧上週的探究意圖，說明 W2 產出的只是『原石』，今天要做的是題目健檢、急救與修正。",
                    tags: ["回扣 W2", "課程定位"]
                },
                {
                    timeStart: "0:09",
                    timeEnd: "0:21",
                    duration: "12 min",
                    colorClass: "c1",
                    icon: "🏥",
                    title: "階段 2a-b｜Part 1 題目健檢大作戰：小組會診",
                    desc: "4–5 人一組，討論投影幕上的 8 個病題目，依據病例選單判斷各題生了什麼病，填入學習單 Part 1。",
                    tags: ["小組討論", "學習單 Part 1"]
                },
                {
                    timeStart: "0:21",
                    timeEnd: "0:29",
                    duration: "8 min",
                    colorClass: "c1",
                    icon: "🩺",
                    title: "階段 2c｜總醫師巡房：揭曉 8 題答案",
                    desc: "逐題揭曉診斷結果，重點說明『為什麼這題生病』，先建立病感，不急著教怎麼改。",
                    tags: ["老師解說", "建立病感"],
                    additionalNotes: "📌 題1→H　題2→A　題3→F　題4→D　題5→E　題6→C　題7→G　題8→B"
                },
                {
                    timeStart: "0:29",
                    timeEnd: "0:34",
                    duration: "5 min",
                    colorClass: "c2",
                    icon: "💊",
                    title: "階段 3｜萬用急救心法：大空遠難 → 小實近易",
                    desc: "發放急救寶典，講解四大轉換。讓學生知道 8 種病不用死背，核心其實都回到四個轉換方向。",
                    tags: ["核心心法", "急救寶典"]
                },
                {
                    timeStart: "0:34",
                    timeEnd: "0:44",
                    duration: "10 min",
                    colorClass: "c4",
                    icon: "💪",
                    title: "階段 4｜Part 2 個人診斷練習（禁用 AI）",
                    desc: "學生從 30 題爛題目中自行選 2 題，不准用 AI，先靠自己診斷、套用心法、寫出修正版題目。",
                    tags: ["個人練習", "學習單 Part 2", "🚫 禁用 AI"]
                },
                {
                    timeStart: "0:44",
                    timeEnd: "0:50",
                    duration: "6 min",
                    colorClass: "c5",
                    icon: "🧠",
                    title: "階段 5｜Part 2 小組討論：黃卡／紅卡會診",
                    desc: "每組從黃卡或紅卡中選 1 題，不准用 AI，一起診斷、一起急救，練習把個人判斷說出來並與組員協商。",
                    tags: ["小組共作", "高階挑戰", "學習單 Part 2 第二表格"],
                    keyPoint: "🎯 第一節收在『人的判斷力』，先練自己會看病，再進入第二節的人機協作。"
                }
            ]
        },
        {
            badge: "第二節",
            title: "AI 協作・規格化・最終定案",
            duration: 50,
            hasBreakAfter: false,
            stages: [
                {
                    timeStart: "0:00",
                    timeEnd: "0:18",
                    duration: "18 min",
                    colorClass: "c2",
                    icon: "🤖",
                    title: "階段 6｜Part 3 AI 協作工作坊：先用別人的題目練兵",
                    desc: "學生從剛才個人練習的題目中選 1 題，依照學習單流程操作：先自己診斷，再問 AI，接著比較差異、請 AI 提出三個版本，最後由自己做選擇。",
                    tags: ["AI 協作", "學習單 Part 3", "人機協作"],
                    additionalNotes: "Step 1 人先診斷 → Step 2 問 AI 診斷 → Step 3 比對差異 → Step 4 問 AI 給 3 個方案 → Step 5 自己選並說明理由",
                    keyPoint: "⚠️ 教學重點：不是『叫 AI 幫我改』，長度不是重點，重點是『我判斷 AI 給的哪個版本比較值得選』。"
                },
                {
                    timeStart: "0:18",
                    timeEnd: "0:30",
                    duration: "12 min",
                    colorClass: "c4",
                    icon: "🔪",
                    title: "階段 7｜Part 4 回到自己的題目：5W1H 規格化",
                    desc: "回到自己 W2 的最終探究意圖，先不靠 AI，利用 5W1H 把題目切開，確認對象、場域、變項、方法與條件是否足夠清楚。",
                    tags: ["學習單 Part 4", "5W1H", "規格化"],
                    additionalNotes: "必備四格：Who／Where／What／How；若寫不出來，表示題目仍然不夠小、不夠實、不夠近、或不夠易。"
                },
                {
                    timeStart: "0:30",
                    timeEnd: "0:48",
                    duration: "18 min",
                    colorClass: "c1",
                    icon: "✨",
                    title: "階段 8｜Part 5 AI 協作自己的題目：從初稿磨到定案",
                    desc: "先根據 Part 4 自己寫出專屬初稿，再請 AI 進行診斷、提供三個修改方向、在做優化。學生最後必須自己選出最終定案版本，並完成 AI-RED 記錄。",
                    tags: ["學習單 Part 5", "最終定案", "AI-RED"],
                    additionalNotes: "Step 1 自寫初稿 → Step 2 問 AI 診斷 → Step 3 比對差異 → Step 4 問 AI 給 3 方案 → Step 5 自己選 → Step 6 問 AI 優化 → Step 7 最終定案 + AI-RED",
                    keyPoint: "🎯 最重要的不是 AI 生出幾句漂亮話，而是學生能不能說出：『我為什麼選這個版本，因為它做得到。』"
                },
                {
                    timeStart: "0:48",
                    timeEnd: "0:50",
                    duration: "2 min",
                    colorClass: "c3",
                    icon: "🏁",
                    title: "階段 9｜總結：急救出院標準確認",
                    desc: "總結今天從碰壁、診斷、急救、協作，到題目定案的流程。確認學生手上的 W3 題目已能帶往 W4 題目博覽會。",
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
            text: "W3 最終定案題目<br><small style=\"font-size:11px;color:#ccc;\">帶去 W4 題目博覽會</small>"
        }
    ],
    legends: [
        { colorClass: "lm-c1", label: "診斷 / 定案" },
        { colorClass: "lm-c2", label: "心法 / AI 協作" },
        { colorClass: "lm-c3", label: "導入 / 總結" },
        { colorClass: "lm-c4", label: "個人練習 / 規格化" },
        { colorClass: "lm-c5", label: "小組共作 / 互動" }
    ],
    courseArc: baseCourseArc.map((item, idx) => ({
        ...item,
        past: idx < 1,
        now: idx === 1
    }))
};

export const W0Data = {
    id: "W0",
    title: "前導課程：偵探特訓班",
    duration: 50,
    durationDesc: "1 節課",
    coreConcepts: [
        {
            prefix: "①",
            title: "觀察力",
            subtitle: "看見問題的眼",
            desc: "不注意視盲 (Inattentional Blindness)",
            colorConfig: "r"
        },
        {
            prefix: "②",
            title: "假設檢定",
            subtitle: "蒐集證據、修正假設",
            desc: "邏輯與假設",
            colorConfig: "c"
        },
        {
            prefix: "③",
            title: "批判思考",
            subtitle: "識破謊言的心",
            desc: "尋找證據、不被騙",
            colorConfig: "y"
        }
    ],
    periods: [
        {
            badge: "全課",
            title: "偵探試煉的開始",
            duration: 50,
            hasBreakAfter: false,
            stages: [
                {
                    timeStart: "0:00",
                    timeEnd: "0:05",
                    duration: "5 min",
                    colorClass: "c3",
                    icon: "🕵️",
                    title: "一、 開場：偵探試煉的開始",
                    desc: "情境營造：老師投影簡報首頁「TOP SECRET」，宣佈今天不講課，而是進行「偵探特訓」。",
                    tags: ["情境營造", "暖身提問"]
                },
                {
                    timeStart: "0:05",
                    timeEnd: "0:15",
                    duration: "10 min",
                    colorClass: "c1",
                    icon: "👀",
                    title: "二、 試煉一：專注力測試",
                    desc: "任務指令：請學生觀看影片，算出「白衣人傳球幾次」。反轉揭曉是否有看到大猩猩。理論導引：不注意視盲。",
                    tags: ["觀察力", "實驗影片"],
                    keyPoint: "⚠️ 第一把劍：觀察力 (Observation)，這是看見問題的眼。"
                },
                {
                    timeStart: "0:15",
                    timeEnd: "0:40",
                    duration: "25 min",
                    colorClass: "c4",
                    icon: "🐢",
                    title: "三、 試煉二：海龜湯遊戲",
                    desc: "Level 1：奇怪的考試 (只能問 Yes/No)。Level 2：沙漠中的半根火柴 (必須先寫假設，再提問)。",
                    tags: ["邏輯訓練", "假設檢定", "批判思考"],
                    additionalNotes: "第二把劍：假設檢定。第三把劍：批判思考。"
                },
                {
                    timeStart: "0:40",
                    timeEnd: "0:50",
                    duration: "10 min",
                    colorClass: "c2",
                    icon: "🤖",
                    title: "四、 試煉三：挑戰全知者",
                    desc: "現場向 AI 詢問關於松山高中的在地問題。說明 AI 的盲點與研究的價值（發現 AI 不知道的事）。結案報告與下週預告。",
                    tags: ["AI 實測", "研究價值", "總結預告"]
                }
            ]
        }
    ],
    summaries: [],
    legends: [
        { colorClass: "lm-c1", label: "觀察力" },
        { colorClass: "lm-c4", label: "邏輯 / 假設" },
        { colorClass: "lm-c2", label: "AI 實測" },
        { colorClass: "lm-c3", label: "開場 / 總結" }
    ]
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
    courseArc: baseCourseArc.map(item => ({
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
                    keyPoint: "🎯 教師是大腦（提問與解讀），AI 是手腳（運算）。"
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
    courseArc: baseCourseArc.map((item, idx) => ({
        ...item,
        past: false,
        now: idx === 0
    })),
    coreConcepts: [
        {
            prefix: "①",
            title: "四段式思考框架",
            subtitle: "現象 → 落差 → 核心疑問 → 探究意圖",
            desc: "不再問空泛的「為什麼」",
            colorConfig: "r"
        },
        {
            prefix: "②",
            title: "ABC 探究句型",
            subtitle: "影響型 / 比較型 / 原因型",
            desc: "把白話文變成學術研究",
            colorConfig: "b"
        }
    ],
    periods: [
        {
            badge: "第一節",
            title: "四段式思考 ＆ 發現落差",
            duration: 50,
            hasBreakAfter: true,
            stages: [
                {
                    timeStart: "0:00",
                    timeEnd: "0:08",
                    duration: "8 min",
                    colorClass: "c3",
                    icon: "🌉",
                    title: "一、 暖身概念",
                    desc: "回扣 W1 的現象紀錄，點出「問為什麼」是爛問題，導入把好奇心變成好問題的需求。",
                    tags: ["舊證連結", "點出盲點"]
                },
                {
                    timeStart: "0:08",
                    timeEnd: "0:23",
                    duration: "15 min",
                    colorClass: "c1",
                    icon: "🧠",
                    title: "二、 四段式思考框架與示範",
                    desc: "講解現象、落差、核心疑問、探究意圖。以圖書館現象示範拆解過程。",
                    tags: ["概念講解", "教師示範"],
                    keyPoint: "⚠️ 步驟 3（核心疑問）就是真實的好奇心，用白話文說出來即可。"
                },
                {
                    timeStart: "0:23",
                    timeEnd: "0:30",
                    duration: "7 min",
                    colorClass: "c4",
                    icon: "🖼️",
                    title: "三、 圖片轉化戰（先練手感）",
                    desc: "看兩組圖片（例如熱食部 vs 福利社），快速練習寫出現象、落差、和核心疑問。",
                    tags: ["情境練習", "快速實作"]
                },
                {
                    timeStart: "0:30",
                    timeEnd: "0:45",
                    duration: "15 min",
                    colorClass: "c2",
                    icon: "✍️",
                    title: "四、 練習 0：改寫你的觀察",
                    desc: "拿出自己的 W1 原石現象，用前三步驟改寫。(禁止使用 AI)",
                    tags: ["個人創作", "聚焦核心", "🚫 禁用 AI"]
                },
                {
                    timeStart: "0:45",
                    timeEnd: "0:50",
                    duration: "5 min",
                    colorClass: "c5",
                    icon: "🤖",
                    title: "五、 AI 協作示範：落差擴充器",
                    desc: "老師示範如何把現象餵給 AI，讓 AI 幫忙從不同角度找出自己沒注意到的「矛盾點」。",
                    tags: ["AI 應用示範"]
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
                    colorClass: "c5",
                    icon: "🤖",
                    title: "六、 AI 協作 1：實作落差擴充器",
                    desc: "學生自己操作 Prompt 讓 AI 給 5 個矛盾點，並判斷選出最真實、最感興趣的。(學習單 Part 2.5)",
                    tags: ["AI 實作", "人類判斷"],
                    keyPoint: "🎯 AI 是放大鏡，但我是眼睛！ AI 給選項，人做選擇。"
                },
                {
                    timeStart: "0:10",
                    timeEnd: "0:20",
                    duration: "10 min",
                    colorClass: "c1",
                    icon: "🧩",
                    title: "七、 介紹 ABC 探究句型",
                    desc: "介紹影響型(A)、比較型(B)、深究型(C)。讓學生用自己的「核心疑問」去選擇對應的入口方向。(學習單 Part 3 Step 0)",
                    tags: ["概念講解", "方向定位"]
                },
                {
                    timeStart: "0:20",
                    timeEnd: "0:35",
                    duration: "15 min",
                    colorClass: "c2",
                    icon: "✨",
                    title: "八、 AI 協作 2：探究意圖生成器",
                    desc: "將白話文餵給 AI 翻譯成 A/B/C 三種學術方向。學生自行挑選一種作為最終意圖，並記錄 AI-RED。",
                    tags: ["AI 實作", "最終產出", "AI-RED 紀錄"]
                },
                {
                    timeStart: "0:35",
                    timeEnd: "0:50",
                    duration: "15 min",
                    colorClass: "c3",
                    icon: "🏆",
                    title: "九、 總結與預告",
                    desc: "複習人與 AI 各自擅長的事。預告 W3 的「題目健檢」。",
                    tags: ["總結收斂", "下週預告"]
                }
            ]
        }
    ],
    summaries: [
        {
            icon: "📝",
            label: "練習產出",
            text: "四段式思考草稿<br><small style=\"font-size:11px;color:#888;\">白話文核心疑問</small>"
        },
        {
            icon: "🤖",
            label: "協作紀錄",
            text: "AI-RED 記錄表<br><small style=\"font-size:11px;color:#888;\">落差補充 / 句型生成</small>"
        },
        {
            icon: "🎯",
            label: "最終產出",
            text: "W2 最終探究意圖<br><small style=\"font-size:11px;color:#ccc;\">帶到 W3 作為病人</small>"
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
    title: "題目博覽會與研究動機定案",
    duration: 100,
    durationDesc: "2 節課",
    metaCards: [
        { label: '第一節', value: '研究動機整理 + 海報製作' },
        { label: '第二節', value: 'Gallery Walk + 題目最終定案' },
        { label: '課後產出', value: 'W4 最終定案題目 + 研究動機' },
        { label: '帶去 W5', value: '定案題目與研究動機' }
    ],
    courseArc: baseCourseArc.map((item, idx) => ({
        ...item,
        past: idx < 1,
        now: idx === 1
    })),
    coreConcepts: [
        {
            prefix: "①",
            title: "研究動機",
            subtitle: "說得出來才算真的懂",
            desc: "把三週的好奇心整理成一段說得出口的話",
            colorConfig: "r"
        },
        {
            prefix: "②",
            title: "先人後 AI",
            subtitle: "自己先寫，再讓 AI 審核",
            desc: "動機整理與標題優化的核心原則",
            colorConfig: "g"
        },
        {
            prefix: "③",
            title: "同儕驗證",
            subtitle: "Gallery Walk 走讀驗收",
            desc: "透過報告與聆聽確認題目可行性",
            colorConfig: "c"
        }
    ],
    galleryWalkRounds: [
        { n: '第 1 場', time: '00:03–00:08', who: 'A 坐鎮', d: 'A 回到自己的桌子報告，B、C、D 順時針移到下一組聆聽', r: 'present' },
        { n: '第 2 場', time: '00:08–00:13', who: 'B 坐鎮', d: 'B 回來坐鎮報告，C、D 繼續移，A 也追過去', r: 'present' },
        { n: '第 3 場', time: '00:13–00:18', who: 'C 坐鎮', d: 'C 回來坐鎮報告，D 繼續移，A、B 也追過去', r: 'present' },
        { n: '第 4 場', time: '00:18–00:23', who: 'D 坐鎮', d: 'D 回來坐鎮報告，A、B、C 繼續往下走', r: 'present' }
    ],
    commentRules: [
        { type: 'positive', label: '粉紅色：我認可的地方', desc: '動機有畫面、標題吸引人、題目本身有社會意義——說具體是哪裡打動你。' },
        { type: 'suggestion', label: '黃色：具體建議 / 點子', desc: '「研究對象可以縮小」、「動機這句話可以再補一個畫面」、「標題建議改為...」。' },
        { type: 'question', label: '藍色：我想問的問題', desc: '「你為什麼會想做這個？」、「你的專注度要怎麼測量？」——讓報告者感受到哪裡還說不清楚。' }
    ],
    tasks: [
        {
            badge: 'PART 0',
            title: '研究動機整理（先人後 AI）',
            steps: [
                'Step 0：翻出 W3 定案題目，自己回答三個問題（限時 3 分鐘，不准開 AI）',
                'Step 1：根據三個問題，用白話文寫出研究動機 3–5 句（限時 5 分鐘，不准開 AI）',
                'Step 2：打開「研究動機教練」，把定案題目和白話版動機一起貼給它，收到回饋後自己決定要不要修改',
                '確認：把定案版動機填進靶心框，唸給旁邊同學聽，30 秒內能理解就完成'
            ],
            note: '⚠️ 順序不能顛倒：先自己寫，再開 AI。'
        },
        {
            badge: 'PART 1',
            title: '海報製作（先人後 AI）',
            steps: [
                'Step 0：自己先想一個口語標題（3 分鐘，不用完美）',
                'Step 2：把標題草稿和正式題目貼給 AI 優化，選一個版本或自己改',
                'Step 3：在 A4 紙上手寫四格海報（標題 / 副標 / 研究動機 / 製作人）'
            ],
            note: '💡 研究動機那格：把靶心框裡的定案版本直接抄過去。'
        },
        {
            badge: 'PART 2',
            title: '題目最終定案',
            steps: [
                '看海報上同學給的建議，決定要不要採納',
                '在學習單 Part 2 填入 W4 最終題目與研究動機',
                '舉手確認：「我的題目和研究動機都定案了」'
            ],
            note: '🏆 從 W1 到 W4，你完成了問題形成的完整旅程。這個題目和動機是真正屬於你的。',
            noteColor: 'success'
        }
    ],
    homework: {
        deadline: '下次上課前',
        items: [
            { p: '學習單', n: 'W4 學習單（Part 0–Part Z 全部完成）上傳 Google Classroom' },
            { p: '定案確認', n: 'W4 最終研究題目與研究動機（已填入 Part 2 定案框）' }
        ],
        footer: '學習單在 Google Classroom 下載'
    },
    periods: [
        {
            badge: "第一節",
            title: "研究動機整理與海報製作",
            duration: 50,
            hasBreakAfter: true,
            stages: [
                {
                    timeStart: "0:00",
                    timeEnd: "0:05",
                    duration: "5 min",
                    colorClass: "c3",
                    icon: "🔁",
                    title: "一、 回扣與定位",
                    desc: "回顧 W3 定案題目，引導學生感受「說不出動機」的問題。",
                    tags: ["回扣", "問題意識"]
                },
                {
                    timeStart: "0:05",
                    timeEnd: "0:35",
                    duration: "30 min",
                    colorClass: "c1",
                    icon: "💡",
                    title: "二、 Part 0：研究動機整理",
                    desc: "三步走：自己回答三問題（3 min）→ 自己寫白話版（5 min）→ 研究動機教練審核（14 min）→ 確認定案（5 min）",
                    tags: ["先人後 AI", "動機整理", "Gemini Gem"],
                    keyPoint: "⚠️ 先自己寫，再開 AI。順序不能顛倒。"
                },
                {
                    timeStart: "0:35",
                    timeEnd: "0:50",
                    duration: "15 min",
                    colorClass: "c2",
                    icon: "🎨",
                    title: "三、 Part 1：海報製作",
                    desc: "草稿標題（3 min）→ AI 優化標題（5 min）→ 手寫 A4 海報四格（5 min）",
                    tags: ["海報製作", "先人後 AI"]
                }
            ]
        },
        {
            badge: "第二節",
            title: "Gallery Walk 與題目最終定案",
            duration: 50,
            hasBreakAfter: false,
            stages: [
                {
                    timeStart: "0:00",
                    timeEnd: "0:03",
                    duration: "3 min",
                    colorClass: "c3",
                    icon: "📋",
                    title: "一、 Gallery Walk 規則說明",
                    desc: "說明四輪走讀規則（ABCD 輪流坐鎮、順時針移動），分配場次。",
                    tags: ["同儕互評", "規則說明"]
                },
                {
                    timeStart: "0:03",
                    timeEnd: "0:23",
                    duration: "20 min",
                    colorClass: "c1",
                    icon: "🗣️",
                    title: "二、 四輪走讀",
                    desc: "每場 5 分鐘，報告者說研究動機與題目，聆聽者在海報上留下建議。",
                    tags: ["走讀", "發表練習"],
                    keyPoint: "⚠️ 重點：說出「你為什麼要研究這個」。"
                },
                {
                    timeStart: "0:23",
                    timeEnd: "0:33",
                    duration: "10 min",
                    colorClass: "c4",
                    icon: "💬",
                    title: "三、 回座位 + 教師點評",
                    desc: "挑 2–3 個海報點評研究動機品質，示範「有畫面的動機」vs「只說結論的動機」。",
                    tags: ["教師示範", "動機品質"]
                },
                {
                    timeStart: "0:33",
                    timeEnd: "0:48",
                    duration: "15 min",
                    colorClass: "c2",
                    icon: "🎯",
                    title: "四、 Part 2：題目最終定案",
                    desc: "根據同學建議，決定修改或保留，填入 W4 最終定案框。",
                    tags: ["最終定案", "批判思考"]
                },
                {
                    timeStart: "0:48",
                    timeEnd: "0:50",
                    duration: "2 min",
                    colorClass: "c5",
                    icon: "📢",
                    title: "五、 總結與預告",
                    desc: "W1→W4 旅程總結，預告 W5 文獻搜尋入門。",
                    tags: ["總結", "預告"]
                }
            ]
        }
    ],
    legendColors: [
        { colorClass: "lm-c1", label: "主要活動" },
        { colorClass: "lm-c2", label: "AI 輔助實作" },
        { colorClass: "lm-c3", label: "開場 / 說明" },
        { colorClass: "lm-c4", label: "評量 / 點評" },
        { colorClass: "lm-c5", label: "總結 / 預告" }
    ]
};


export const W50Data = {
    id: "W50",
    title: "文獻搜尋入門",
    duration: 100,
    durationDesc: "2 節課",
    metaCards: [
        { label: '第一節', value: '為什麼要找文獻 + 華藝實作' },
        { label: '第二節', value: 'AI關鍵字協作 + APA格式' },
        { label: '課後產出', value: '3篇已查證文獻 + APA清單' },
        { label: '帶去 W5', value: '3篇文獻（準備接受同學查核）' }
    ],
    courseArc: baseCourseArc.map((item, idx) => ({
        ...item,
        past: idx < 2,
        now: idx === 2
    })),
    coreConcepts: [
        {
            prefix: "①",
            title: "找對地方",
            subtitle: "華藝資料庫 vs. Google",
            desc: "學術資料庫找 A/B 級文獻，AI 只能幫你生成關鍵字",
            colorConfig: "r"
        },
        {
            prefix: "②",
            title: "人的判斷",
            subtitle: "AI 給選項，你來篩選",
            desc: "AI 關鍵字是工具，相關性由你決定",
            colorConfig: "g"
        },
        {
            prefix: "③",
            title: "APA格式",
            subtitle: "讓別人找得到你的來源",
            desc: "正確記錄文獻，整學期都會用到",
            colorConfig: "c"
        }
    ],
    periods: [
        {
            badge: "第一節",
            title: "為什麼要找文獻 + 華藝資料庫實作",
            duration: 50,
            hasBreakAfter: true,
            stages: [
                {
                    timeStart: "0:00", timeEnd: "0:05", duration: "5 min",
                    colorClass: "c3", icon: "🔗",
                    title: "回扣與定位",
                    desc: "回顧 W4 定案的題目與研究動機，說明 W5.0 的任務：找到 3 篇真實可信的相關研究。",
                    tags: ["回扣 W4", "課程定位"]
                },
                {
                    timeStart: "0:05", timeEnd: "0:12", duration: "7 min",
                    colorClass: "c1", icon: "📚",
                    title: "為什麼要找文獻",
                    desc: "三個理由：避免重複、學方法、支持論點。文獻等級快速說明（A–D），今天目標 A/B 級。",
                    tags: ["概念講解", "等級說明"]
                },
                {
                    timeStart: "0:12", timeEnd: "0:25", duration: "13 min",
                    colorClass: "c1", icon: "🖥️",
                    title: "華藝資料庫操作示範",
                    desc: "登入 → 列關鍵字 → 搜尋 → 加限制條件（台灣/近5年/碩博士論文）→ 看標題和摘要。提醒 AI 幻覺陷阱。",
                    tags: ["教師示範", "操作演練", "🚫 AI假文獻警告"]
                },
                {
                    timeStart: "0:25", timeEnd: "0:50", duration: "25 min",
                    colorClass: "c4", icon: "🔍",
                    title: "Part 1 學生實作：華藝找文獻",
                    desc: "帶著 W4 定案題目，在華藝自行搜尋並找到至少 1 篇相關研究。教師巡視並提示關鍵字策略。",
                    tags: ["獨立實作", "學生操作"]
                }
            ]
        },
        {
            badge: "第二節",
            title: "AI關鍵字協作 + APA格式教學",
            duration: 50,
            hasBreakAfter: false,
            stages: [
                {
                    timeStart: "0:00", timeEnd: "0:20", duration: "20 min",
                    colorClass: "c2", icon: "🤖",
                    title: "Part 2 AI關鍵字協作",
                    desc: "用 AI 生成關鍵字表格，回到華藝再搜一次，比較差異，補充文獻清單到 3 篇。",
                    tags: ["AI協作", "人來判斷"]
                },
                {
                    timeStart: "0:20", timeEnd: "0:35", duration: "15 min",
                    colorClass: "c3", icon: "📝",
                    title: "Part 3 APA格式教學與實作",
                    desc: "說明 APA 格式的目的，介紹碩博士論文與期刊論文兩種模板，學生實作 3 篇文獻格式。",
                    tags: ["格式教學", "實作練習"]
                },
                {
                    timeStart: "0:35", timeEnd: "0:50", duration: "15 min",
                    colorClass: "c2", icon: "✅",
                    title: "整理確認與總結",
                    desc: "確認每人有 3 篇 A/B 級文獻並已查證。2–3 位學生分享，教師點評關聯性。預告 W5 文獻偵探社。",
                    tags: ["確認產出", "預告下週"]
                }
            ]
        }
    ],
    tasks: [
        { id: 1, title: "PART 1 華藝文獻搜尋", desc: "帶著題目關鍵字，在華藝資料庫找到至少 1 篇相關研究" },
        { id: 2, title: "PART 2 AI 關鍵字協作", desc: "問 AI 生成關鍵字，篩選後回到資料庫補充文獻到 3 篇" },
        { id: 3, title: "PART 3 APA 格式清單", desc: "3 篇文獻都完成 APA 格式，並親自查證作者和摘要存在" }
    ],
    homework: {
        deadline: '下次上課前',
        items: [
            { p: '學習單', n: '完成 Part 1–4，上傳至 Google Classroom' },
            { p: '查證確認', n: '3 篇文獻都在華藝或 Google Scholar 親自看過摘要' }
        ],
        footer: '學習單在 Google Classroom 下載'
    }
};


export const W5Data = {
    id: "W5",
    title: "文獻偵探社與學術寫作倫理",
    duration: 100,
    durationDesc: "2 節課",
    coreConcepts: [
        {
            prefix: "①",
            title: "判讀真偽",
            subtitle: "找對證據：A-D 級鑑識",
            desc: "AI 會造假，你必須學會查證",
            colorConfig: "r"
        },
        {
            prefix: "②",
            title: "合法使用",
            subtitle: "寫對引用：防範抄襲",
            desc: "正確改寫與三明治寫作法",
            colorConfig: "g"
        }
    ],
    periods: [
        {
            badge: "第一節",
            title: "證物鑑識與防範抄襲",
            duration: 50,
            hasBreakAfter: true,
            stages: [
                {
                    timeStart: "0:00",
                    timeEnd: "0:05",
                    duration: "5 min",
                    colorClass: "c3",
                    icon: "🕵️",
                    title: "一、 開場與兩大任務",
                    desc: "說明真實世界充滿『假論文』與『無意抄襲』陷阱。任務：Level 1 證物鑑識，Level 2 合法引用。",
                    tags: ["情境營造", "目標建立"]
                },
                {
                    timeStart: "0:05",
                    timeEnd: "0:15",
                    duration: "10 min",
                    colorClass: "c1",
                    icon: "⚖️",
                    title: "二、 說明 A-D 證物等級",
                    desc: "介紹主證據(A)、輔助證據(B)、背景線索(C)、不採用(D)。教師示範用 Google Scholar 與華藝查證。",
                    tags: ["概念講解", "教師示範"]
                },
                {
                    timeStart: "0:15",
                    timeEnd: "0:35",
                    duration: "20 min",
                    colorClass: "c4",
                    icon: "🔍",
                    title: "三、 小組鑑識實戰 (禁 AI)",
                    desc: "分發 5 份證物，小組動手查證 A-E 的真偽與等級。隨後投票與教師解答。",
                    tags: ["小組挑戰", "實機操作", "🚫 禁用 AI"]
                },
                {
                    timeStart: "0:35",
                    timeEnd: "0:50",
                    duration: "15 min",
                    colorClass: "c2",
                    icon: "✍️",
                    title: "四、 寫作倫理 I：正確改寫",
                    desc: "認識『無意抄襲』與『換字抄襲』。全班實戰演練：改寫一段醫學文獻，並由教師點評。",
                    tags: ["改寫實戰", "防範抄襲"]
                }
            ]
        },
        {
            badge: "第二節",
            title: "三明治法與 NotebookLM 實戰",
            duration: 50,
            hasBreakAfter: false,
            stages: [
                {
                    timeStart: "0:00",
                    timeEnd: "0:15",
                    duration: "15 min",
                    colorClass: "c2",
                    icon: "🥪",
                    title: "五、 寫作倫理 II：三明治法",
                    desc: "避免孤兒引用！學習直接引用的三層結構：引入 → 引用 → 解釋。學生動筆進行 50 字寫作練習。",
                    tags: ["直接引用", "實戰練習"]
                },
                {
                    timeStart: "0:15",
                    timeEnd: "0:25",
                    duration: "10 min",
                    colorClass: "c1",
                    icon: "🗣️",
                    title: "六、 多重文獻對話",
                    desc: "介紹如何在一段話中綜合不同觀點。預告課後的線上闖關作業『引用偵錯遊戲』。",
                    tags: ["綜合分析", "遊戲首發"]
                },
                {
                    timeStart: "0:25",
                    timeEnd: "0:43",
                    duration: "18 min",
                    colorClass: "c5",
                    icon: "🔬",
                    title: "七、 自己的文獻與同儕互審",
                    desc: "回到個人 W4 題目，找齊 3 篇文獻。交換任務單，由旁邊同學檢查作者真偽與等級。",
                    tags: ["個人任務", "同儕查核"]
                },
                {
                    timeStart: "0:43",
                    timeEnd: "0:50",
                    duration: "7 min",
                    colorClass: "c4",
                    icon: "🤖",
                    title: "八、 NotebookLM 整理與結案",
                    desc: "丟入 3 篇文獻讓 NotebookLM 找『研究缺口』。用剛學的引用技巧，寫下題目值得研究的辯護結案。",
                    tags: ["AI 總結", "最終產出"]
                }
            ]
        }
    ],
    summaries: [
        {
            icon: "📝",
            label: "課堂產出",
            text: "兩種寫作實戰<br><small style=\"font-size:11px;color:#888;\">正確改寫與三明治法</small>"
        },
        {
            icon: "🔍",
            label: "鑑識紀錄",
            text: "3 篇真實文獻<br><small style=\"font-size:11px;color:#888;\">通過同學互審確認</small>"
        },
        {
            icon: "🎮",
            label: "課後驗收",
            text: "引用偵錯遊戲過關<br><small style=\"font-size:11px;color:#ccc;\">防範抄襲 10 連測</small>"
        }
    ],
    legends: [
        { colorClass: "lm-c1", label: "概念 / 說明" },
        { colorClass: "lm-c4", label: "小組挑戰 / 實作" },
        { colorClass: "lm-c2", label: "寫作演練" },
        { colorClass: "lm-c3", label: "情境 / 結尾" }
    ]
};

export const W6Data = {
    id: "W6",
    title: "研究診所：掛號判斷工作坊",
    duration: 100,
    durationDesc: "2 節課",
    coreConcepts: [
        {
            prefix: "①",
            title: "掛號診斷",
            subtitle: "Level 1 研究方法判定",
            desc: "這個問題該用問卷、訪談、實驗還是觀察？",
            colorConfig: "r"
        },
        {
            prefix: "②",
            title: "分流判斷",
            subtitle: "分科三問十字準星",
            desc: "要比例還是原因？要因果還是現象？",
            colorConfig: "b"
        }
    ],
    periods: [
        {
            badge: "第一節",
            title: "建立診斷標準 + 小組實戰",
            duration: 50,
            hasBreakAfter: true,
            stages: [
                {
                    timeStart: "0:00",
                    timeEnd: "0:05",
                    duration: "5 min",
                    colorClass: "c3",
                    icon: "🏥",
                    title: "一、 開場定位",
                    desc: "歡迎來到研究診所！今天你們是實習醫師，要學會判斷研究問題該「掛哪一科」才不會白費努力。",
                    tags: ["情境營造", "目標建立"]
                },
                {
                    timeStart: "0:05",
                    timeEnd: "0:12",
                    duration: "7 min",
                    colorClass: "c1",
                    icon: "⚖️",
                    title: "二、 Level 1 掛號診斷標準",
                    desc: "講解分科三問：1.比例vs原因 2.因果vs現象 3.行為vs想法。帶出五大方法（問卷、訪談、實驗、觀察、文獻）。",
                    tags: ["概念講解", "標準建立"]
                },
                {
                    timeStart: "0:12",
                    timeEnd: "0:20",
                    duration: "8 min",
                    colorClass: "c4",
                    icon: "⏱️",
                    title: "三、 急診分流練習",
                    desc: "全班搶答！舉牌判斷單一方法與複合方法，並用分科三問說明理由。",
                    tags: ["全班互動", "快速演練"]
                },
                {
                    timeStart: "0:20",
                    timeEnd: "0:30",
                    duration: "10 min",
                    colorClass: "c1",
                    icon: "👨‍🏫",
                    title: "四、 全班示範掛號診斷",
                    desc: "看病例 YQ1，示範如何拆解研究目的並用分科三問抓出錯誤掛號。",
                    tags: ["教師示範", "流程拆解"]
                },
                {
                    timeStart: "0:30",
                    timeEnd: "0:50",
                    duration: "20 min",
                    colorClass: "c2",
                    icon: "🧠",
                    title: "五、 發病例 + 小組掛號診斷",
                    desc: "每組領取 3 份 Y 型病例，全組討論判斷是否掛錯科，並寫下應掛科別與理由。",
                    tags: ["小組挑戰", "實機操作"]
                }
            ]
        },
        {
            badge: "第二節",
            title: "互動遊戲 + 口頭會診",
            duration: 50,
            hasBreakAfter: false,
            stages: [
                {
                    timeStart: "0:00",
                    timeEnd: "0:15",
                    duration: "15 min",
                    colorClass: "c4",
                    icon: "🎮",
                    title: "六、 互動遊戲挑戰",
                    desc: "使用《辦案工具大考驗》遊戲，11 個情境全班搶答，考驗直覺反應。",
                    tags: ["遊戲驗收", "快速複習"]
                },
                {
                    timeStart: "0:15",
                    timeEnd: "0:30",
                    duration: "15 min",
                    colorClass: "c5",
                    icon: "🗣️",
                    title: "七、 口頭會診",
                    desc: "兩組輪流報告病例判斷結果，並互相提出挑戰與補充。",
                    tags: ["同儕交流", "批判思考"]
                },
                {
                    timeStart: "0:30",
                    timeEnd: "0:40",
                    duration: "10 min",
                    colorClass: "c2",
                    icon: "📝",
                    title: "八、 整理病例 + 拍照上傳",
                    desc: "確認 3 份病例判斷完整、全員簽名，拍照上傳至 Google Classroom結案。",
                    tags: ["成果產出", "任務收斂"]
                },
                {
                    timeStart: "0:40",
                    timeEnd: "0:50",
                    duration: "10 min",
                    colorClass: "c3",
                    icon: "🏁",
                    title: "九、 收束與預告",
                    desc: "總結分科三問。說明課後作業（後設認知學習單與 AI 補漏），並預告 W7/W8 分組與處方診斷。",
                    tags: ["課程總結", "下週預告"]
                }
            ]
        }
    ],
    summaries: [
        {
            icon: "📋",
            label: "課堂產出",
            text: "3 份 Y 型病例診斷<br><small style=\"font-size:11px;color:#888;\">含判定理由</small>"
        },
        {
            icon: "🎮",
            label: "遊戲驗收",
            text: "辦案工具大考驗<br><small style=\"font-size:11px;color:#888;\">11 題情境闖關</small>"
        },
        {
            icon: "🗣️",
            label: "能力養成",
            text: "會診交流<br><small style=\"font-size:11px;color:#ccc;\">論述與挑戰能力</small>"
        }
    ],
    legends: [
        { colorClass: "lm-c1", label: "概念 / 示範" },
        { colorClass: "lm-c4", label: "快速演練 / 遊戲" },
        { colorClass: "lm-c2", label: "小組討論 / 產出" },
        { colorClass: "lm-c5", label: "同儕交流" },
        { colorClass: "lm-c3", label: "情境 / 總結" }
    ]
};

export const W7Data = {
    id: "W7",
    title: "組隊決策週：從個人到團隊",
    duration: 100,
    durationDesc: "2 節課",
    courseArc: baseCourseArc.map((item, idx) => ({
        ...item,
        past: idx < 2,
        now: idx === 2
    })),
    coreConcepts: [
        {
            prefix: "①",
            title: "團隊協作力",
            subtitle: "1 + 1 > 2",
            desc: "分工互補、整合文獻與企劃",
            colorConfig: "r"
        },
        {
            prefix: "②",
            title: "獨立研究力",
            subtitle: "掌控節奏、聚焦精悍",
            desc: "Solo Zone 互助、題目規模控制",
            colorConfig: "b"
        }
    ],
    periods: [
        {
            badge: "第一節",
            title: "線上測驗 ＆ 研究博覽會",
            duration: 50,
            hasBreakAfter: true,
            stages: [
                {
                    timeStart: "0:00",
                    timeStartFormatted: "00:00",
                    duration: 5,
                    colorClass: "c3",
                    icon: "📝",
                    title: "一、 開場與測驗說明",
                    desc: "說明 W7 是重要轉折點。宣佈第一節任務：判定研究判斷力與建立網絡。"
                },
                {
                    timeStart: "0:05",
                    timeStartFormatted: "00:05",
                    duration: 25,
                    colorClass: "c1",
                    icon: "🧠",
                    title: "二、 線上測驗（W1-W6 總結驗收）",
                    desc: "酷AI系統個人測驗，不可討論。測驗後揭曉部分易錯點。",
                    tags: ["個人測驗", "總結驗收"]
                },
                {
                    timeStart: "0:30",
                    timeStartFormatted: "00:30",
                    duration: 5,
                    colorClass: "c2",
                    icon: "🎫",
                    title: "三、 填寫研究交流卡",
                    desc: "領取交流卡並填寫：題目、王牌文獻、方法與技能。",
                    tags: ["個人產出"]
                },
                {
                    timeStart: "0:35",
                    timeStartFormatted: "00:35",
                    duration: 15,
                    colorClass: "c5",
                    icon: "🎪",
                    title: "四、 三輪走讀博覽會",
                    desc: "第一輪：同類聚集交流。第二輪：跨界交流。第三輪：自由尋求夥伴。",
                    tags: ["自由走讀", "拍照記錄"]
                }
            ]
        },
        {
            badge: "第二節",
            title: "確定組隊 ＆ 企劃書定案",
            duration: 50,
            hasBreakAfter: false,
            stages: [
                {
                    timeStart: "0:00",
                    timeStartFormatted: "00:00",
                    duration: 10,
                    colorClass: "c3",
                    icon: "🤝",
                    title: "五、 確定組隊 ＆ 登記表單",
                    desc: "決定小組或 Solo。組長建立群組，Solo 進入 Solo Zone。填寫組隊登記表。",
                    tags: ["決策表單"]
                },
                {
                    timeStart: "0:10",
                    timeStartFormatted: "00:10",
                    duration: 15,
                    colorClass: "c1",
                    icon: "🎙️",
                    title: "六、 Pitch 題目 ＆ 定案",
                    desc: "每人輪流 Pitch 題目。小組討論合併方案，確定最終題目。填寫題目登記表。",
                    tags: ["共識決策"]
                },
                {
                    timeStart: "0:25",
                    timeStartFormatted: "00:25",
                    duration: 18,
                    colorClass: "c4",
                    icon: "📄",
                    title: "七、 填寫研究企劃書",
                    desc: "整合 W5 文獻。完成企劃書（分工/時程），簽名並上傳 Google Classroom。",
                    tags: ["核心產出"]
                },
                {
                    timeStart: "0:43",
                    timeStartFormatted: "00:43",
                    duration: 7,
                    colorClass: "c2",
                    icon: "🚀",
                    title: "八、 結案與 W8 預告",
                    desc: "總結全班研究網絡建立。預告下週依方法分流進入「工具設計」。",
                    tags: ["階段完結"]
                }
            ]
        }
    ],
    summaries: [
        {
            icon: "📋",
            label: "核心產出",
            text: "研究企劃書<br><small style=\"font-size:11px;color:#888;\">含分工與 3 篇文獻</small>"
        },
        {
            icon: "📈",
            label: "學習軌跡",
            text: "研究判斷力測驗紀錄<br><small style=\"font-size:11px;color:#888;\">確認 W1-W6 掌握度</small>"
        },
        {
            icon: "🕸️",
            label: "人際資產",
            text: "班級研究網絡照片<br><small style=\"font-size:11px;color:#ccc;\">跨組交流聯絡簿</small>"
        }
    ],
    legends: [
        { colorClass: "lm-c1", label: "測驗 / 會診" },
        { colorClass: "lm-c4", label: "企劃 / 決策" },
        { colorClass: "lm-c2", label: "個人產出" },
        { colorClass: "lm-c5", label: "互動 / 走讀" },
        { colorClass: "lm-c3", label: "說明 / 引導" }
    ]
};

export const W8Data = {
    id: "W8",
    title: "工具設計：處方診斷與三大標準",
    duration: 100,
    durationDesc: "2 節課",
    courseArc: baseCourseArc.map((item, idx) => ({
        ...item,
        past: idx < 3,
        now: idx === 3
    })),
    coreConcepts: [
        {
            prefix: "①",
            title: "處方診斷",
            subtitle: "Level 2 抓雷、修正",
            desc: "確保工具有效可靠",
            colorConfig: "r"
        },
        {
            prefix: "②",
            title: "好工具三大標準",
            subtitle: "有效性、可靠性、可行性",
            desc: "建立專業工具的判斷力",
            colorConfig: "g"
        }
    ],
    periods: [
        {
            badge: "第一節",
            title: "Level 2 診斷 + 三大標準",
            duration: 50,
            hasBreakAfter: true,
            stages: [
                {
                    timeStart: "0:00",
                    timeEnd: "0:10",
                    duration: "10 min",
                    colorClass: "c3",
                    icon: "🔧",
                    title: "一、 開場與 Level 升級",
                    desc: "回顧 W6 掛號判斷。宣佈今天進入 Level 2 處方診斷：不只要選對方法，更要修好工具。",
                    tags: ["開場引導", "Level 升級"]
                },
                {
                    timeStart: "0:10",
                    timeEnd: "0:25",
                    duration: "15 min",
                    colorClass: "c1",
                    icon: "⚖️",
                    title: "二、 好工具三大標準 (V.R.F.)",
                    desc: "詳細介紹有效性 (Validity)、可靠性 (Reliability)、可行性 (Feasibility)。舉例說明為什麼「你常熬夜嗎？」是爛題目。",
                    tags: ["概念講解", "標準建立"]
                },
                {
                    timeStart: "0:10",
                    timeEnd: "0:25",
                    duration: "15 min",
                    colorClass: "c4",
                    icon: "⚡",
                    title: "三、 常見錯誤速查防雷",
                    desc: "介紹誘導性提問、選項重疊、雙重問題等四大閃避地雷。現場進行 5 分鐘快問快答。",
                    tags: ["快速演練", "避雷訓練"]
                },
                {
                    timeStart: "0:40",
                    timeEnd: "0:50",
                    duration: "10 min",
                    colorClass: "c2",
                    icon: "🏥",
                    title: "四、 病例 XQ1 診斷實戰",
                    desc: "投影 X 型病例問卷，由全班共同指出雷點並現場提出修改方案（處方）。",
                    tags: ["實戰示範", "處方開立"]
                }
            ]
        },
        {
            badge: "第二節",
            title: "分流工作坊：工具實作初稿",
            duration: 50,
            hasBreakAfter: false,
            stages: [
                {
                    timeStart: "0:00",
                    timeEnd: "0:10",
                    duration: "10 min",
                    colorClass: "c3",
                    icon: "🤝",
                    title: "五、 依方法分流與任務啟動",
                    desc: "依據 W7 組隊結果，按方法（問卷/訪談...）分流就座。說明「三欄對應表」任務。",
                    tags: ["任務啟動", "分流就座"]
                },
                {
                    timeStart: "0:10",
                    timeEnd: "0:35",
                    duration: "25 min",
                    colorClass: "c2",
                    icon: "✍️",
                    title: "六、 工具開發工作坊 (禁 AI 第一版)",
                    desc: "小組討論：將「探究意圖」拆解為具體問題。完成三欄對應表一組，產出第一版草稿。",
                    tags: ["共識開發", "初稿產出", "🚫 禁用 AI"]
                },
                {
                    timeStart: "0:35",
                    timeEnd: "0:45",
                    duration: "10 min",
                    colorClass: "c5",
                    icon: "🗣️",
                    title: "七、 同儕互診與雷點互查",
                    desc: "兩兩交換初稿，對照「三大標準」與「四大雷點」進行互查回饋。",
                    tags: ["同儕審核", "互查回饋"]
                },
                {
                    timeStart: "0:45",
                    timeEnd: "0:50",
                    duration: "5 min",
                    colorClass: "c4",
                    icon: "🚀",
                    title: "八、 總結與 W9 準備",
                    desc: "收回初稿。預告 W9 將上機進行數位化與真實預試。提醒攜帶筆電。",
                    tags: ["總結預告", "工具定案"]
                }
            ]
        }
    ],
    summaries: [
        {
            icon: "📝",
            label: "初稿產出",
            text: "工具設計三欄對應表<br><small style=\"font-size:11px;color:#888;\">含研究問題與題目對應</small>"
        },
        {
            icon: "🛡️",
            label: "避險驗證",
            text: "四大雷點查證紀錄<br><small style=\"font-size:11px;color:#888;\">通過同儕互查驗證</small>"
        },
        {
            icon: "📅",
            label: "重要預告",
            text: "W9 上機與真實預試<br><small style=\"font-size:11px;color:#ccc;\">進入真實場域前哨站</small>"
        }
    ],
    legends: [
        { colorClass: "lm-c1", label: "概念 / 診斷" },
        { colorClass: "lm-c2", label: "實作 / 開發" },
        { colorClass: "lm-c4", label: "避雷 / 總結" },
        { colorClass: "lm-c5", label: "互動 / 互診" },
        { colorClass: "lm-c3", label: "說明 / 引導" }
    ]
};

export const W9Data = {
    id: "W9",
    title: "工具精進與預試：AI 審稿與人工驗證",
    duration: 100,
    durationDesc: "2 節課",
    coreConcepts: [
        {
            prefix: "①",
            title: "AI 協助精進",
            subtitle: "AI-RED 評估與判斷",
            desc: "利用 AI 進行第一輪工具審查",
            colorConfig: "b"
        },
        {
            prefix: "②",
            title: "真實預試",
            subtitle: "抓出 AI 看不到的死角",
            desc: "透過真實反映修正工具細節",
            colorConfig: "g"
        }
    ],
    periods: [
        {
            badge: "第一節",
            title: "AI 審稿 + 建議判斷",
            duration: 50,
            hasBreakAfter: true,
            stages: [
                {
                    timeStart: "0:00",
                    timeEnd: "0:10",
                    duration: "10 min",
                    colorClass: "c3",
                    icon: "🤖",
                    title: "一、 AI-RED 審稿啟動",
                    desc: "將工具初稿交給 AI，並說明研究背景。進行 A (Ascribe) 與 I (Inquire) 階段。",
                    tags: ["AI 互動", "審查啟動"]
                },
                {
                    timeStart: "0:10",
                    timeEnd: "0:25",
                    duration: "15 min",
                    colorClass: "c1",
                    icon: "⚖️",
                    title: "二、 AI 建議判斷與評估",
                    desc: "針對 AI 提出的建議進行 R (Reference) 與 E (Evaluate)。區分採納、拒絕或部分採納。",
                    tags: ["邏輯思考", "判斷決策"]
                },
                {
                    timeStart: "0:25",
                    timeEnd: "0:50",
                    duration: "25 min",
                    colorClass: "c2",
                    icon: "✍️",
                    title: "三、 工具第一輪修正",
                    desc: "根據評估後的 AI 建議，直接修改問卷或訪談大綱。產出「經 AI 強化後」的版本。",
                    tags: ["工具開發", "快速修正"]
                }
            ]
        },
        {
            badge: "第二節",
            title: "人工預試 + AI vs 預試比較",
            duration: 50,
            hasBreakAfter: false,
            stages: [
                {
                    timeStart: "0:00",
                    timeEnd: "0:25",
                    duration: "25 min",
                    colorClass: "c5",
                    icon: "👥",
                    title: "四、 真實場域預試 (Pilot Test)",
                    desc: "小組互換工具進行預試。記錄受測者的疑惑、卡住點與填答時長。",
                    tags: ["使用者測試", "真實回饋"]
                },
                {
                    timeStart: "0:25",
                    timeEnd: "0:40",
                    duration: "15 min",
                    colorClass: "c1",
                    icon: "🔍",
                    title: "五、 AI vs 人工差異分析",
                    desc: "比較 AI 審稿與人工預試發現的問題。找出彼此的盲點，決定最終修改方案。",
                    tags: ["差異分析", "反思總結"]
                },
                {
                    timeStart: "0:40",
                    timeEnd: "0:50",
                    duration: "10 min",
                    colorClass: "c4",
                    icon: "🚀",
                    title: "六、 工具定稿與 W10 準備",
                    desc: "完成最終定稿。說明 W10 倫理審查流程，提醒需準備之文件（知情同意書等）。",
                    tags: ["成果產出", "倫理預告"]
                }
            ]
        }
    ],
    summaries: [
        {
            icon: "📊",
            label: "AI 判斷表",
            text: "AI 建議評估紀錄<br><small style=\"font-size:11px;color:#888;\">含採納與拒絕理由說明</small>"
        },
        {
            icon: "✅",
            label: "工具定稿",
            text: "經兩輪驗證之版本<br><small style=\"font-size:11px;color:#888;\">可進入倫理審查程序</small>"
        },
        {
            icon: "🔗",
            label: "反思比較",
            text: "AI vs 人工盲點分析<br><small style=\"font-size:11px;color:#ccc;\">建立多元驗證的直覺</small>"
        }
    ],
    legends: [
        { colorClass: "lm-c1", label: "概念 / 判斷" },
        { colorClass: "lm-c2", label: "實作 / 修正" },
        { colorClass: "lm-c5", label: "互動 / 預試" },
        { colorClass: "lm-c3", label: "引導 / 工具" },
        { colorClass: "lm-c4", label: "總結 / 定稿" }
    ]
};

export const W10Data = {
    title: "W10 倫理審查：確認、授權、出發",
    description: "這不是在刁難，是在保護你的研究。通過倫理審查，拿到出發許可，你的研究才算正式啟程。",
    periods: [
        {
            name: "第一節",
            duration: "50 min",
            title: "工具定稿 + 倫理四問自查",
            stages: [
                { time: "0:00 - 0:15", title: "一、工具定稿自查", desc: "拿出 W9 修正後的工具，對照 Part 0 自查清單逐項確認。", tags: ["自查清單", "互評交換"], colorClass: "lm-c1" },
                { time: "0:15 - 0:30", title: "二、倫理四問自查", desc: "誠實回答知情同意、保密、不傷害、自願性四個問題。", tags: ["倫理四問", "敏感議題"], colorClass: "lm-c2" },
                { time: "0:30 - 0:50", title: "三、AI 審查知情同意書", desc: "利用 AI 檢查說明的語言語氣，完成最終版知情同意書。", tags: ["AI 互動", "語氣修正"], colorClass: "lm-c3" }
            ]
        },
        {
            name: "第二節",
            duration: "50 min",
            title: "執行計畫書 + 施測啟動宣告",
            stages: [
                { time: "0:00 - 0:25", title: "四、研究執行計畫書", desc: "填寫 W11-W12 詳細時程，包含理想目標、最低底線與失敗備案。", tags: ["計畫書", "具體備案"], colorClass: "lm-c4" },
                { time: "0:25 - 0:40", title: "五、教師倫理審查 (巡迴)", desc: "教師於教室各組巡迴，確認計畫書與倫理考量後蓋章授權。", tags: ["教師面談", "授權蓋章"], colorClass: "lm-c5" },
                { time: "0:40 - 0:50", title: "六、施測啟動宣告", desc: "念出啟動宣告，於黑板出發表打卡，正式啟動研究。", tags: ["出發宣告", "正式啟動"], colorClass: "lm-c3" }
            ]
        }
    ],
    summary: [
        "倫理四問自查完成，教師蓋章通過",
        "知情同意書最終版（AI 審查後修改）",
        "研究執行計畫書（含具體備案）",
        "施測宣告完成，黑板出發表打卡 ✈️"
    ],
    legends: [
        { colorClass: "lm-c1", label: "概念 / 判斷" },
        { colorClass: "lm-c2", label: "實作 / 修正" },
        { colorClass: "lm-c5", label: "互動 / 預試" },
        { colorClass: "lm-c3", label: "引導 / 工具" },
        { colorClass: "lm-c4", label: "總結 / 定稿" }
    ]
};

export const W13Data = {
    id: "W13",
    title: "讓數據自己說話：圖表選擇與圖說寫作",
    duration: 100,
    durationDesc: "2 節課",
    metaCards: [
        { label: '第一節', value: '選對盤子：四大圖表與格式規範' },
        { label: '第二節', value: '賦予意義：描述 vs 推論' },
        { label: '課堂產出', value: '圖表初稿 + 圖說段落' },
        { label: '帶去 W14', value: '完整圖表，準備撰寫結論' }
    ],
    courseArc: baseCourseArc.map((item, idx) => ({
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
                    timeEnd: "0:45",
                    duration: "15 min",
                    colorClass: "c2",
                    icon: "✍️",
                    title: "實戰二｜寫下你們的圖說段落",
                    desc: "各組針對自製圖表，用藍紅筆區分完成「描述」與「推論」兩部分寫作。",
                    tags: ["個人/小組寫作", "實作挑戰"]
                },
                {
                    timeStart: "0:45",
                    timeEnd: "0:50",
                    duration: "5 min",
                    colorClass: "c3",
                    icon: "🏆",
                    title: "總結與 W14 預告",
                    desc: "預看 W14 四層結論。收回學習單，確認各組已準備好所有圖解與初步圖說。",
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
        { colorClass: "lm-c4", label: "格式規範" },
        { colorClass: "lm-c2", label: "互動演練" },
        { colorClass: "lm-c5", label: "案例拆解" },
        { colorClass: "lm-c3", label: "小結預告" }
    ]
};
export const W14Data = {
    id: "W14",
    title: "研究結論：四層寫作法",
    duration: 100,
    durationDesc: "2 節課",
    metaCards: [
        { label: '第一節', value: '四層公式 + 回扣層精練' },
        { label: '第二節', value: '批判層 + AI 輔助整合' },
        { label: '課業產出', value: '完整四層結論段落' },
        { label: '帶去 W15', value: '結論定稿，準備簡報' }
    ],
    courseArc: baseCourseArc.map((item, idx) => ({
        ...item,
        past: idx < 6,
        now: idx === 6
    })),
    coreConcepts: [
        {
            prefix: "①",
            title: "四層寫作法",
            subtitle: "描述 / 詮釋 / 回扣 / 批判",
            desc: "建立完整、嚴謹的研究結論結構",
            colorConfig: "r"
        },
        {
            prefix: "②",
            title: "回扣層核心",
            subtitle: "連結發現與研究問題",
            desc: "確保研究有頭有尾，回答最初的疑問",
            colorConfig: "b"
        }
    ],
    periods: [
        {
            badge: "第一節",
            title: "四層公式與回扣精練",
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
                    title: "實作：撰寫回扣層草稿",
                    desc: "學生翻閱 W3 題目，對比現有發現，填寫學習單回扣層草稿。",
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
