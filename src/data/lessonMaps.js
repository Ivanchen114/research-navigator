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


export const W5Data = {
    id: "W5",
    title: "文獻偵探的入門訓練",
    duration: 100,
    durationDesc: "2 節課",
    metaCards: [
        { label: '第一節', value: '檔案室的純手工調查' },
        { label: '第二節', value: '證物鑑識與 APA 格式' },
        { label: '小組任務', value: '證物 A–E 鑑識與查核' },
        { label: '最終產出', value: '1 篇真實證物文獻' }
    ],
    courseArc: baseCourseArc.map((item, idx) => ({
        ...item,
        past: idx < 2,
        now: idx === 2
    })),
    coreConcepts: [
        {
            prefix: "①",
            title: "手動搜索",
            subtitle: "不准用 AI",
            desc: "學習如何下關鍵字，在華藝資料庫中找到真實文獻",
            colorConfig: "r"
        },
        {
            prefix: "②",
            title: "APA格式",
            subtitle: "標準證物標籤",
            desc: "正確紀錄作者與年份，學會法庭標準格式",
            colorConfig: "g"
        },
        {
            prefix: "③",
            title: "文獻等級",
            subtitle: "A到D的鑑識",
            desc: "識別哪些是主要證據，哪些是不能用在報告的廢料",
            colorConfig: "c"
        }
    ],
    periods: [
        {
            badge: "第一節",
            title: "檔案室的手動搜索",
            duration: 50,
            hasBreakAfter: true,
            stages: [
                {
                    timeStart: "0:00", timeEnd: "0:05", duration: "5 min",
                    colorClass: "c3", icon: "🏛️",
                    title: "階段 0｜開場與定位",
                    desc: "帶上前一週定案題目，進入資料庫檔案室，不依賴 AI 靠自己搜尋。",
                    tags: ["純手工", "題目延續"]
                },
                {
                    timeStart: "0:05", timeEnd: "0:15", duration: "10 min",
                    colorClass: "c4", icon: "🗺️",
                    title: "階段 1｜擬定搜索策略",
                    desc: "填寫搜尋計畫書，列出3組關鍵字，設定年份與範圍限制。",
                    tags: ["規劃策略", "關鍵字"]
                },
                {
                    timeStart: "0:15", timeEnd: "0:40", duration: "25 min",
                    colorClass: "c1", icon: "👀",
                    title: "階段 2｜實戰搜尋找到第一件證物",
                    desc: "登入碩博系統找到 1 篇符合的文獻，說明它與自己題目的關聯。",
                    tags: ["華藝實戰", "獨立找尋"]
                },
                {
                    timeStart: "0:40", timeEnd: "0:50", duration: "10 min",
                    colorClass: "c2", icon: "🏷️",
                    title: "階段 3｜APA 標籤製作練習",
                    desc: "對照 APA 規範清單，幫找到的文獻貼上標準格式標籤。",
                    tags: ["APA 格式", "細節檢視"]
                }
            ]
        },
        {
            badge: "第二節",
            title: "證物鑑識大賽——等級判定",
            duration: 50,
            hasBreakAfter: false,
            stages: [
                {
                    timeStart: "0:00", timeEnd: "0:10", duration: "10 min",
                    colorClass: "c1", icon: "⚖️",
                    title: "階段 4｜文獻等級定義(A-D)",
                    desc: "說明 A 級到 D 級差別，並介紹 AI 捏造的學術文獻陷阱。",
                    tags: ["證據等級", "防禦偽證"]
                },
                {
                    timeStart: "0:10", timeEnd: "0:40", duration: "30 min",
                    colorClass: "c2", icon: "🔬",
                    title: "階段 5｜小組鑑識任務",
                    desc: "發放 A–E 神秘證物卡，調查是名校碩論還是內容農場，寫下查核路徑。",
                    tags: ["小組合作", "查核實戰"]
                },
                {
                    timeStart: "0:40", timeEnd: "0:50", duration: "10 min",
                    colorClass: "c3", icon: "🏁",
                    title: "階段 6｜總結與下週預告",
                    desc: "總結偽證判定，預告下週學習如何將 A 級文獻「寫入」報告中。",
                    tags: ["總結", "下週預告"]
                }
            ]
        }
    ],
    tasks: [],
    homework: { 
        deadline: '下次上課前', 
        items: [ 
            { p: 'Part 0', n: '確認 W4 定案題目' },
            { p: 'Part 1', n: '資料庫搜尋紀錄 (關鍵字、搜尋策略與首篇文獻)' },
            { p: 'APA 格式', n: '第 1 篇文獻之標準引註練習' },
            { p: '證物鑑識', n: '證物 A–E 等級判斷、理由與查核路徑 (小組共作)' },
            { p: '小組總結', n: '記錄組內最難判斷之證物與原因' }
        ], 
        footer: '學習單完成後請上傳至 Google Classroom' 
    }
};

export const W6Data = {
    id: "W6",
    title: "文獻偵探社 (Sherlock Edition)",
    duration: 100,
    durationDesc: "2 節課",
    metaCards: [
        { label: '第一節', value: '識破換字抄襲與三明治引用' },
        { label: '第二節', value: '多文獻整合與同儕會診' },
        { label: '小組任務', value: '互相驗屍 (同儕審查)' },
        { label: '最終產出', value: '五句話結案報告' }
    ],
    courseArc: baseCourseArc.map((item, idx) => ({
        ...item,
        past: idx < 2,
        now: idx === 2
    })),
    coreConcepts: [
        {
            prefix: "①",
            title: "遮蓋測試",
            subtitle: "識破換字抄襲",
            desc: "遮住原文自己寫，確認結構是否自己掌握",
            colorConfig: "r"
        },
        {
            prefix: "②",
            title: "三明治法",
            subtitle: "觀點＋引用＋分析",
            desc: "頭中尾三層結構，讓讀者知道引用目的",
            colorConfig: "g"
        },
        {
            prefix: "③",
            title: "整合文獻",
            subtitle: "提煉故事",
            desc: "拒絕堆砌列點，將三篇文章寫成有方向的故事",
            colorConfig: "c"
        }
    ],
    periods: [
        {
            badge: "第一節",
            title: "犯罪鑑識與工具訓練",
            duration: 50,
            hasBreakAfter: true,
            stages: [
                {
                    timeStart: "0:00", timeEnd: "0:10", duration: "10 min",
                    colorClass: "c3", icon: "🕵️",
                    title: "入社儀式",
                    desc: "認識兩種常見報告犯罪：換字抄襲與文獻堆砌。",
                    tags: ["情境導入", "釐清盲點"]
                },
                {
                    timeStart: "0:10", timeEnd: "0:25", duration: "15 min",
                    colorClass: "c1", icon: "🚫",
                    title: "犯罪現場一：換字抄襲",
                    desc: "比較兩個版本差異，推廣「遮蓋測試」偵查工具。",
                    tags: ["遮蓋測試", "結構破解"]
                },
                {
                    timeStart: "0:25", timeEnd: "0:40", duration: "15 min",
                    colorClass: "c4", icon: "🍔",
                    title: "偵探工具：三明治引用法",
                    desc: "學習將文獻夾在觀點與分析之間，使引用具有結論。",
                    tags: ["三層結構", "寫作格式"]
                },
                {
                    timeStart: "0:40", timeEnd: "0:50", duration: "10 min",
                    colorClass: "c2", icon: "📚",
                    title: "偵探工具：多文獻整合",
                    desc: "教導如何將三篇不同的文獻用邏輯串連而非條列堆砌。",
                    tags: ["多文獻", "串連語感"]
                }
            ]
        },
        {
            badge: "第二節",
            title: "實地偵辦與互相驗屍",
            duration: 50,
            hasBreakAfter: false,
            stages: [
                {
                    timeStart: "0:00", timeEnd: "0:15", duration: "15 min",
                    colorClass: "c1", icon: "🔍",
                    title: "演練一：改寫偵錯",
                    desc: "找出甲乙學生的犯罪手法並自己實作正確的改寫。",
                    tags: ["實地演練", "糾錯"]
                },
                {
                    timeStart: "0:15", timeEnd: "0:25", duration: "10 min",
                    colorClass: "c2", icon: "🍔",
                    title: "演練二：三明治實戰",
                    desc: "使用 W5 找尋的文獻，實地撰寫一個三層完整引用。",
                    tags: ["自有文獻應用", "實戰"]
                },
                {
                    timeStart: "0:25", timeEnd: "0:40", duration: "15 min",
                    colorClass: "c4", icon: "📑",
                    title: "演練三：結案報告",
                    desc: "小組選材包撰寫多文獻整合，最後一句一定要呼應自身題目。",
                    tags: ["整合實作", "連回題目"]
                },
                {
                    timeStart: "0:40", timeEnd: "0:50", duration: "10 min",
                    colorClass: "c3", icon: "⚖️",
                    title: "同儕審查：互相驗屍",
                    desc: "交換文字作品，使用檢核表提供具體修改建議，不接受含糊評論。",
                    tags: ["同儕審查", "具體建議"]
                }
            ]
        }
    ],
    tasks: [],
    homework: { deadline: '下次上課前', items: [ { p: '繳交', n: '修改演練報告並上傳' } ], footer: '' }
};

export const W7Data = {
    id: "W7",
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

export const W8Data = {
    id: "W8",
    title: "研究博覽會：組隊 × 合題 × 企劃書",
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
            title: "合題能力",
            subtitle: "找到共同核心",
            desc: "三種情境判斷、合題規則與禁忌",
            colorConfig: "r"
        },
        {
            prefix: "②",
            title: "企劃書撰寫",
            subtitle: "研究的地圖",
            desc: "主題、問題、方法、對象、分工、時程",
            colorConfig: "b"
        }
    ],
    periods: [
        {
            badge: "第一節",
            title: "博覽會 ＆ 組隊合題",
            duration: 50,
            hasBreakAfter: true,
            stages: [
                {
                    timeStart: "0:00",
                    timeStartFormatted: "00:00",
                    duration: 5,
                    colorClass: "c3",
                    icon: "📢",
                    title: "一、 開場回顧",
                    desc: "回顧 W7 研究診所成果，說明本節三大任務：找隊友、合題、寫企劃書。"
                },
                {
                    timeStart: "0:05",
                    timeStartFormatted: "00:05",
                    duration: 20,
                    colorClass: "c5",
                    icon: "🔭",
                    title: "二、 研究博覽會",
                    desc: "每人 1 分鐘展示三件事：想研究什麼、研究問題、打算用什麼方法。邊聽邊記潛在隊友。",
                    tags: ["個人展示", "聆聽紀錄"]
                },
                {
                    timeStart: "0:25",
                    timeStartFormatted: "00:25",
                    duration: 10,
                    colorClass: "c1",
                    icon: "🧩",
                    title: "三、 合題規則講解",
                    desc: "三種情境：同一現象不同角度（可合）、因果鏈相連（可合）、主題差距過大（重新搭配）。",
                    tags: ["合題判斷"]
                },
                {
                    timeStart: "0:35",
                    timeStartFormatted: "00:35",
                    duration: 15,
                    colorClass: "c4",
                    icon: "🤝",
                    title: "四、 組隊確認 ＆ 初步合題",
                    desc: "每組 2-4 人。填寫學習單 Part B 合題結果，教師記錄分組名單。",
                    tags: ["分組確認"]
                }
            ]
        },
        {
            badge: "第二節",
            title: "企劃書 ＆ 工具草稿",
            duration: 50,
            hasBreakAfter: false,
            stages: [
                {
                    timeStart: "0:00",
                    timeStartFormatted: "00:00",
                    duration: 35,
                    colorClass: "c4",
                    icon: "📄",
                    title: "五、 企劃書撰寫",
                    desc: "每組共同完成 Part C：研究主題、問題（因果/相關/描述型）、方法、對象、分工表、時程。",
                    tags: ["核心產出"]
                },
                {
                    timeStart: "0:35",
                    timeStartFormatted: "00:35",
                    duration: 10,
                    colorClass: "c2",
                    icon: "🔧",
                    title: "六、 預寫 3 題工具草稿",
                    desc: "對照五種方法範例表，寫出 3 題草稿（問卷題/訪談問題/觀察指標/實驗步驟/搜尋策略）。",
                    tags: ["銜接 W9"]
                },
                {
                    timeStart: "0:45",
                    timeStartFormatted: "00:45",
                    duration: 5,
                    colorClass: "c3",
                    icon: "🎙️",
                    title: "七、 各組簡報 ＆ 收束",
                    desc: "每組 30 秒電梯簡報：研究主題和研究對象。預告 W9 帶草稿進診所。",
                    tags: ["鞏固回饋"]
                }
            ]
        }
    ],
    summaries: [
        {
            icon: "📋",
            label: "核心產出",
            text: "研究企劃書初稿<br><small style=\"font-size:11px;color:#888;\">含分工表與時程</small>"
        },
        {
            icon: "🔧",
            label: "銜接準備",
            text: "3 題工具草稿<br><small style=\"font-size:11px;color:#888;\">W9 診所的掛號單</small>"
        },
        {
            icon: "👥",
            label: "組隊成果",
            text: "分組名單 ＆ 合題結果<br><small style=\"font-size:11px;color:#888;\">從個人到團隊</small>"
        }
    ],
    legends: [
        { colorClass: "lm-c1", label: "概念講解" },
        { colorClass: "lm-c4", label: "企劃 / 決策" },
        { colorClass: "lm-c2", label: "個人產出" },
        { colorClass: "lm-c5", label: "互動 / 展示" },
        { colorClass: "lm-c3", label: "說明 / 收束" }
    ]
};

export const W10Data = {
    id: "W10",
    title: "研究工具診所 Level 2：品質診斷與修改",
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
            title: "品質診斷",
            subtitle: "用規準找出草稿問題",
            desc: "問卷 / 訪談 / 觀察三種診斷規準",
            colorConfig: "r"
        },
        {
            prefix: "②",
            title: "精修初版",
            subtitle: "從 3 題草稿到 5–10 題完整版",
            desc: "修改並擴充為可用的研究工具",
            colorConfig: "g"
        }
    ],
    periods: [
        {
            badge: "第一節",
            title: "示範診斷 × 互相診斷",
            duration: 50,
            hasBreakAfter: true,
            stages: [
                {
                    timeStart: "0:00",
                    timeEnd: "0:05",
                    duration: "5 min",
                    colorClass: "c3",
                    icon: "🩺",
                    title: "① 開場：確認草稿到位",
                    desc: "確認每位學生帶著 W8 Part D 的 3 題草稿。說明今天三步驟：示範診斷 → 互相診斷 → 自己修改。",
                    tags: ["開場確認", "流程說明"]
                },
                {
                    timeStart: "0:05",
                    timeEnd: "0:20",
                    duration: "15 min",
                    colorClass: "c1",
                    icon: "🔬",
                    title: "② 教師示範診斷",
                    desc: "問卷、訪談、觀察各示範 1 個典型壞題，帶全班走一遍「哪裡有問題？哪條規準？怎麼修？」的診斷流程。",
                    tags: ["示範教學", "建立診斷語言"]
                },
                {
                    timeStart: "0:20",
                    timeEnd: "0:38",
                    duration: "18 min",
                    colorClass: "c5",
                    icon: "🤝",
                    title: "③ 各組互相診斷",
                    desc: "和隔壁組交換 3 題草稿，對照診斷規準圈出問題、寫上規準編號，每題至少找出 1 個改進建議。",
                    tags: ["同儕診斷", "規準應用"]
                },
                {
                    timeStart: "0:38",
                    timeEnd: "0:50",
                    duration: "12 min",
                    colorClass: "c4",
                    icon: "📊",
                    title: "④ 教師統整 + Q&A",
                    desc: "各組分享常見問題。統整三大常見錯誤：一題問兩件事、引導性語氣、問受訪者無法回答的事。",
                    tags: ["概念統整", "常見問題"]
                }
            ]
        },
        {
            badge: "第二節",
            title: "精修 × 同儕試填 × 完成初版",
            duration: 50,
            hasBreakAfter: false,
            stages: [
                {
                    timeStart: "0:00",
                    timeEnd: "0:20",
                    duration: "20 min",
                    colorClass: "c2",
                    icon: "✍️",
                    title: "⑤ 精修草稿",
                    desc: "根據診斷結果修改草稿，補充至 5–10 題完整版本。用學習單 Part C 逐題記錄修前 / 修後 / 原因。",
                    tags: ["精修實作", "初版產出"]
                },
                {
                    timeStart: "0:20",
                    timeEnd: "0:35",
                    duration: "15 min",
                    colorClass: "c4",
                    icon: "🧪",
                    title: "⑥ 同儕試填（Pilot Test）",
                    desc: "單向輪轉配對（A→B→C），讓別組 2–3 人以受訪者身分實填工具。試填者填完後在 Part D 寫回饋：看不懂的題、不會選的題。",
                    tags: ["預試驗證", "真人回饋"]
                },
                {
                    timeStart: "0:35",
                    timeEnd: "0:45",
                    duration: "10 min",
                    colorClass: "c5",
                    icon: "🗣️",
                    title: "⑦ 修前修後展示 + 試填發現",
                    desc: "每組選出改得最滿意的 1 題，展示修改前 vs 修改後。同時分享一個試填時的意外發現。",
                    tags: ["成果展示", "試填分享"]
                },
                {
                    timeStart: "0:45",
                    timeEnd: "0:50",
                    duration: "5 min",
                    colorClass: "c3",
                    icon: "🚀",
                    title: "⑧ 收束 + 預告 W10",
                    desc: "預告 W10 進行研究倫理審查 + 正式啟動資料收集。特別再看試填時被標記的題目。",
                    tags: ["收束預告", "倫理審查"]
                }
            ]
        }
    ],
    summaries: [
        {
            icon: "🩺",
            label: "診斷記錄",
            text: "同儕診斷回饋表<br><small style=\"font-size:11px;color:#888;\">用規準找出草稿問題</small>"
        },
        {
            icon: "📝",
            label: "初版工具",
            text: "修改後 5–10 題完整版<br><small style=\"font-size:11px;color:#888;\">含修改記錄與理由</small>"
        },
        {
            icon: "📅",
            label: "重要預告",
            text: "W10 倫理審查 + 資料收集<br><small style=\"font-size:11px;color:#ccc;\">帶著初版工具進入實戰</small>"
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
    title: "研究倫理審查：五大原則 × 自審 × 啟動",
    duration: 100,
    durationDesc: "2 節課",
    courseArc: baseCourseArc.map((item, idx) => ({
        ...item,
        past: idx < 4,
        now: idx === 4
    })),
    coreConcepts: [
        {
            prefix: "①",
            title: "五大倫理原則",
            subtitle: "知情同意、隱私、不傷害、誠實、公平",
            desc: "建立研究倫理的基本判斷力",
            colorConfig: "r"
        },
        {
            prefix: "②",
            title: "啟動資料收集",
            subtitle: "通過審查 → 正式出發",
            desc: "取得研究啟動許可，開始收集資料",
            colorConfig: "g"
        }
    ],
    periods: [
        {
            badge: "第一節",
            title: "五大倫理原則 × 自我審查",
            duration: 50,
            hasBreakAfter: true,
            stages: [
                {
                    timeStart: "0:00",
                    timeEnd: "0:05",
                    duration: "5 min",
                    colorClass: "c3",
                    icon: "⚖️",
                    title: "① 開場：為什麼需要倫理審查？",
                    desc: "所有嚴肅的研究在收集資料前都必須通過倫理審查。今天你們自己審，老師幫你們把關。",
                    tags: ["開場動機", "倫理意識"]
                },
                {
                    timeStart: "0:05",
                    timeEnd: "0:25",
                    duration: "20 min",
                    colorClass: "c1",
                    icon: "📋",
                    title: "② 五大倫理原則講解",
                    desc: "知情同意、隱私保護、不造成傷害、誠實呈現資料、公平對待。每個原則配舉例，討論違反後果。",
                    tags: ["概念講解", "原則建立"]
                },
                {
                    timeStart: "0:25",
                    timeEnd: "0:45",
                    duration: "20 min",
                    colorClass: "c2",
                    icon: "✍️",
                    title: "③ 自我倫理審查",
                    desc: "拿出研究工具和企劃書，用審查表逐條自我評估：有沒有做到？有風險怎麼處理？",
                    tags: ["自我評估", "風險識別"]
                },
                {
                    timeStart: "0:45",
                    timeEnd: "0:50",
                    duration: "5 min",
                    colorClass: "c5",
                    icon: "🤝",
                    title: "④ 互相審查",
                    desc: "和旁邊的組交換審查表，看看有沒有他們沒注意到的風險，寫下一個需要特別注意的地方。",
                    tags: ["同儕審查", "互相把關"]
                }
            ]
        },
        {
            badge: "第二節",
            title: "口頭報告 × 取得許可 × 啟動",
            duration: 50,
            hasBreakAfter: false,
            stages: [
                {
                    timeStart: "0:00",
                    timeEnd: "0:20",
                    duration: "20 min",
                    colorClass: "c5",
                    icon: "🗣️",
                    title: "⑤ 各組口頭報告倫理審查結果",
                    desc: "每組 2 分鐘：研究主題、方法、主要倫理風險、處理方式。其他組和老師可提問補充。",
                    tags: ["口頭報告", "公開確認"]
                },
                {
                    timeStart: "0:20",
                    timeEnd: "0:35",
                    duration: "15 min",
                    colorClass: "c4",
                    icon: "🛡️",
                    title: "⑥ 修正 + 取得「研究啟動許可」",
                    desc: "根據報告和討論進行最後修正。填寫研究啟動確認表，教師逐組確認後正式許可啟動。",
                    tags: ["修正計畫", "正式許可"]
                },
                {
                    timeStart: "0:35",
                    timeEnd: "0:48",
                    duration: "13 min",
                    colorClass: "c2",
                    icon: "🚀",
                    title: "⑦ 執行計畫確認 + 正式啟動",
                    desc: "確認每人具體行動：誰負責找多少位受訪者、什麼時候完成、資料怎麼整理。正式啟動資料收集！",
                    tags: ["執行計畫", "啟動行動"]
                },
                {
                    timeStart: "0:48",
                    timeEnd: "0:50",
                    duration: "2 min",
                    colorClass: "c3",
                    icon: "📅",
                    title: "⑧ 收束 + W11 預告",
                    desc: "W11 進行資料收集中期回顧。遇到問題不要慌，W11 帶來一起解決。",
                    tags: ["收束預告", "中期回顧"]
                }
            ]
        }
    ],
    summaries: [
        {
            icon: "⚖️",
            label: "倫理審查",
            text: "自審 + 互審完成<br><small style=\"font-size:11px;color:#888;\">五大原則逐條評估</small>"
        },
        {
            icon: "🛡️",
            label: "啟動許可",
            text: "研究啟動確認表<br><small style=\"font-size:11px;color:#888;\">教師簽核正式許可</small>"
        },
        {
            icon: "📅",
            label: "執行計畫",
            text: "2 週資料收集行動計畫<br><small style=\"font-size:11px;color:#ccc;\">分工、時程、備用方案</small>"
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
    title: "中期盤點與資料收齊：問題診斷與最後衝刺",
    description: "資料收集進行到哪了？今天回顧進度、解決問題、開始整理——邊收集邊整理，比最後一起整理好得多。",
    periods: [
        {
            name: "第一節",
            duration: "50 min",
            title: "進度回顧 × 問題診斷 × 計畫調整",
            stages: [
                { time: "0:00 - 0:05", title: "① 開場", desc: "資料收集進行到哪裡了？建立回顧框架。", tags: ["回顧", "框架"], colorClass: "lm-c3" },
                { time: "0:05 - 0:30", title: "② 各組進度報告", desc: "每組 4–5 分鐘報告：已收集量、遇到問題、目前打算、需要幫忙的事。", tags: ["口頭報告", "進度確認"], colorClass: "lm-c5" },
                { time: "0:30 - 0:45", title: "③ 常見問題解方", desc: "教師主導討論 2–3 個最常見問題：回收率不足、題目看不懂、觀察條件不符、資料有遺漏。", tags: ["問題診斷", "全班討論"], colorClass: "lm-c1" },
                { time: "0:45 - 0:50", title: "④ 調整計畫", desc: "各組更新執行計畫，在學習單 Part B 記錄修改內容與理由。", tags: ["計畫調整", "修正方向"], colorClass: "lm-c2" }
            ]
        },
        {
            name: "第二節",
            duration: "50 min",
            title: "初步資料整理 × AI 輔助分析",
            stages: [
                { time: "0:00 - 0:30", title: "⑤ 初步資料整理", desc: "清理（去掉無效資料）→ 分類（按研究問題分組）→ 描述（數清楚各選項各幾人）。", tags: ["資料清理", "分類整理"], colorClass: "lm-c2" },
                { time: "0:30 - 0:45", title: "⑥ AI 輔助初步分析", desc: "用 Prompt 範本讓 AI 做第一輪觀察，學生判斷 AI 的分析是否合理。", tags: ["AI 協作", "初步分析"], colorClass: "lm-c4" },
                { time: "0:45 - 0:50", title: "⑦ 收束 + 預告", desc: "W12 量化分析、W13 質性分析。W12 前請確保資料已整理好。", tags: ["預告", "收束"], colorClass: "lm-c3" }
            ]
        }
    ],
    summaries: [
        {
            icon: "📊",
            label: "進度報告",
            text: "各組口頭報告收集進度<br><small style=\"font-size:11px;color:#888;\">已收集量 / 問題 / 打算</small>"
        },
        {
            icon: "🔧",
            label: "問題解方",
            text: "常見問題全班討論<br><small style=\"font-size:11px;color:#888;\">回收率 / 理解困難 / 遺漏</small>"
        },
        {
            icon: "🤖",
            label: "AI 初分析",
            text: "AI 做初稿，學生做裁奪<br><small style=\"font-size:11px;color:#ccc;\">趨勢觀察 / 異常偵測</small>"
        }
    ],
    legends: [
        { colorClass: "lm-c1", label: "概念 / 討論" },
        { colorClass: "lm-c2", label: "實作 / 整理" },
        { colorClass: "lm-c4", label: "AI 協作" },
        { colorClass: "lm-c5", label: "互動 / 報告" },
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
