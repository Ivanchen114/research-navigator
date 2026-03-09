export const W3Data = {
    id: "W3",
    title: "題目健檢與 AI 協作工作坊",
    duration: 100,
    durationDesc: "2 節課",
    coreConcepts: [
        {
            prefix: "①",
            title: "萬用急救心法",
            subtitle: "大→小 ／ 空→實 ／ 遠→近 ／ 難→易",
            desc: "建立人類的基礎判斷力",
            colorConfig: "r"
        },
        {
            prefix: "②",
            title: "人機協作框架",
            subtitle: "AI 給選項，人做選擇與判斷",
            desc: "學會駕馭 AI 而不是被取代",
            colorConfig: "g"
        }
    ],
    periods: [
        {
            badge: "第一節",
            title: "診斷 · 心法 · 人的練習",
            duration: 50,
            hasBreakAfter: true,
            stages: [
                {
                    timeStart: "0:00",
                    timeEnd: "0:04",
                    duration: "4 min",
                    colorClass: "c3",
                    icon: "🧱",
                    title: "階段 0｜碰壁體驗 — 你真的做得到嗎？",
                    desc: "不說前言直接投影 A、B 兩題，問學生「下單第一步要做什麼？」。追問細節讓學生感受「卡住」的感覺。",
                    tags: ["直接對決", "碰壁體驗"]
                },
                {
                    timeStart: "0:04",
                    timeEnd: "0:09",
                    duration: "5 min",
                    colorClass: "c3",
                    icon: "🌉",
                    title: "階段 1｜暖身：W2 → W3 的橋樑",
                    desc: "回顧 W2 探究意圖。老師說明：原石可能也生病了。今天三任務：診斷、學心法、人機協作。",
                    tags: ["個人回顧", "回扣 W2"]
                },
                {
                    timeStart: "0:09",
                    timeEnd: "0:21",
                    duration: "12 min",
                    colorClass: "c1",
                    icon: "🏥",
                    title: "階段 2a-b｜題目健檢大作戰：小組會診",
                    desc: "4-5 人一組，討論投影幕上 8 個生病的題目，填入 Part 1 診斷代號。",
                    tags: ["小組討論", "學習單 Part 1"]
                },
                {
                    timeStart: "0:21",
                    timeEnd: "0:29",
                    duration: "8 min",
                    colorClass: "c1",
                    icon: "🩺",
                    title: "階段 2c｜總醫師巡房：揭曉答案",
                    desc: "逐題揭曉診斷結果，說明「為什麼生病」。重點：暫不講治法。",
                    tags: ["老師解說"],
                    additionalNotes: "📌 題1→H 2→A 3→F 4→D 5→E 6→C 7→G 8→B"
                },
                {
                    timeStart: "0:29",
                    timeEnd: "0:34",
                    duration: "5 min",
                    colorClass: "c2",
                    icon: "💊",
                    title: "階段 3｜萬用急救心法 (大空遠難)",
                    desc: "發放「題目急救寶典」。講解核心口訣：大、空、遠、難 → 小、實、近、易。",
                    tags: ["講述＋示範", "發放寶典"]
                },
                {
                    timeStart: "0:34",
                    timeEnd: "0:44",
                    duration: "10 min",
                    colorClass: "c3",
                    icon: "💪",
                    title: "階段 4｜人的診斷練習（🚫 禁用 AI）",
                    desc: "選 2 題自行診斷修改，建立自己的斤兩與判斷力。填入 Part 2。",
                    tags: ["個人練習", "學習單 Part 2"]
                },
                {
                    timeStart: "0:44",
                    timeEnd: "0:50",
                    duration: "6 min",
                    colorClass: "c4",
                    icon: "🔪",
                    title: "階段 5｜導入 5W1H 規格化手術刀",
                    desc: "介紹 5W1H 框架（Who/Where/What/When/How），說明這是把題目「切開」的工具。",
                    tags: ["概念導入"]
                }
            ]
        },
        {
            badge: "第二節",
            title: "AI 協作 · 快篩 · 最終定案",
            duration: 50,
            hasBreakAfter: false,
            stages: [
                {
                    timeStart: "0:00",
                    timeEnd: "0:20",
                    duration: "20 min",
                    colorClass: "c2",
                    icon: "🤖",
                    title: "階段 6｜AI 協作工作坊",
                    desc: "從剩下的題目選 1 題，依學習單 Part 3 的 6 步驟操作。",
                    additionalNotes: "<div style=\"display:grid;grid-template-columns:repeat(3,1fr);gap:6px;\"><div style=\"background:#fff;border:1px solid var(--lm-c2);padding:6px 8px;font-size:11px;\"><strong>Step 1</strong><br>人先自行診斷</div><div style=\"background:#fff;border:1px solid var(--lm-c2);padding:6px 8px;font-size:11px;\"><strong>Step 2</strong><br>問 AI → 貼提示詞</div><div style=\"background:#fff;border:1px solid var(--lm-c2);padding:6px 8px;font-size:11px;\"><strong>Step 3</strong><br>比對差異，誰對？</div><div style=\"background:#fff;border:1px solid var(--lm-c2);padding:6px 8px;font-size:11px;\"><strong>Step 4</strong><br>請 AI 給 3 個方案</div><div style=\"background:var(--lm-c2);color:#fff;border:1px solid var(--lm-c2);padding:6px 8px;font-size:11px;\"><strong>Step 5 ⭐</strong><br>我做選擇（核心！）</div><div style=\"background:#fff;border:1px solid var(--lm-c2);padding:6px 8px;font-size:11px;\"><strong>Step 6</strong><br>記錄 AI-RED</div></div>",
                    keyPoint: "⚠️ 老師重點糾正：叫 AI 直接改 ≠ 協作。你是老闆，AI 是員工！"
                },
                {
                    timeStart: "0:20",
                    timeEnd: "0:28",
                    duration: "8 min",
                    colorClass: "c5",
                    icon: "🤝",
                    title: "階段 7｜同儕驗證 ＆ 全班分享 AI 盲點",
                    desc: "交換學習單，填寫 Part 4 同儕回饋（5 分鐘）。<br>老師抽 2-3 人分享：AI 給了什麼奇怪的建議？人的判斷如何反駁？",
                    tags: ["學習單 Part 4", "同儕互評", "全班分享"],
                    keyPoint: "🎯 教學目標：讓學生看到 AI 不完美，強化人要判斷的意識"
                },
                {
                    timeStart: "0:28",
                    timeEnd: "0:43",
                    duration: "15 min",
                    colorClass: "c4",
                    icon: "🔬",
                    title: "階段 8｜5W1H 規格化 ＋ 可行性快篩",
                    desc: "拿出 W2 探究意圖填寫 Part 5（5W1H），並填 Part 6（重點快篩）。任何一項「否」，立刻用心法修改自身題目。",
                    tags: ["學習單 Part 5-6", "個人填寫"],
                    additionalNotes: "🔴 快篩問題（依方法選一組）：<br>📋問卷→樣本數夠？發得回收嗎？<br>🎤訪談→約得到嗎？<br>🧪實驗→有設備？能控制變因？"
                },
                {
                    timeStart: "0:43",
                    timeEnd: "0:50",
                    duration: "7 min",
                    colorClass: "c1",
                    icon: "✨",
                    title: "階段 9｜AI 句型優化器 ＆ 最終定案",
                    desc: "自填自己的初稿，再貼提示詞請 AI 給 3 個優化版本，最後由學生選出專屬的最終定案題。填寫 Part 7。",
                    tags: ["學習單 Part 7", "最終產出"],
                    additionalNotes: "Prompt 要求：加學術關鍵字 ／ Who+What 更具體 ／ 30字以內 ／ 給 3 個版本"
                }
            ]
        }
    ],
    summaries: [
        {
            icon: "📝",
            label: "課堂產出 1",
            text: "題目診斷紀錄<br><small style=\"font-size:11px;color:#888;\">8題診斷 + 3題急救</small>"
        },
        {
            icon: "🤖",
            label: "課堂產出 2",
            text: "AI-RED 使用紀錄<br><small style=\"font-size:11px;color:#888;\">人機協作歷程</small>"
        },
        {
            icon: "🔪",
            label: "課堂產出 3",
            text: "5W1H 規格確認<br><small style=\"font-size:11px;color:#888;\">通過可行性快篩</small>"
        },
        {
            icon: "🏆",
            label: "最終產出",
            text: "定案研究題目<br><small style=\"font-size:11px;color:#ccc;\">W4 博覽會使用</small>"
        }
    ],
    legends: [
        { colorClass: "lm-c1", label: "診斷 / 病因" },
        { colorClass: "lm-c2", label: "心法 / AI 協作" },
        { colorClass: "lm-c3", label: "過渡 / 導入" },
        { colorClass: "lm-c4", label: "規格化 / 快篩" },
        { colorClass: "lm-c5", label: "互動 / 分享" }
    ]
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
    title: "題目博覽會與資料搜集入門",
    duration: 100,
    durationDesc: "2 節課",
    coreConcepts: [
        {
            prefix: "①",
            title: "先人後 AI",
            subtitle: "你的頭腦先行，AI 只是幫手",
            desc: "自主構思海報，再用 AI 優化文案",
            colorConfig: "r"
        },
        {
            prefix: "②",
            title: "同儕驗證",
            subtitle: "Gallery Walk 走讀驗收",
            desc: "透過報告與聆聽確認題目可行性",
            colorConfig: "g"
        }
    ],
    periods: [
        {
            badge: "第一節",
            title: "Gallery Walk 個人題目博覽會",
            duration: 50,
            hasBreakAfter: true,
            stages: [
                {
                    timeStart: "0:00",
                    timeEnd: "0:05",
                    duration: "5 min",
                    colorClass: "c3",
                    icon: "🎪",
                    title: "一、 暖身與博覽會說明",
                    desc: "說明三項目的：驗證題目、學習別人、為組隊做準備。",
                    tags: ["開場引導", "目標說明"]
                },
                {
                    timeStart: "0:05",
                    timeEnd: "0:15",
                    duration: "10 min",
                    colorClass: "c2",
                    icon: "🎨",
                    title: "二、 AI 協作：海報快速製作",
                    desc: "先自主構思預期發現，再用 AI 優化文案。最終在 A4 紙上手寫海報。",
                    tags: ["AI 實作", "手繪海報", "先人後 AI"],
                    keyPoint: "⚠️ 原則：AI 給文案建議，你決定要不要用。"
                },
                {
                    timeStart: "0:15",
                    timeEnd: "0:40",
                    duration: "25 min",
                    colorClass: "c1",
                    icon: "🗣️",
                    title: "三、 四輪 Gallery Walk",
                    desc: "順轉模式：1 報告 + 3 聆聽，每場 5 分鐘。聽眾在海報上給予具體建議。",
                    tags: ["同儕互評", "發表練習"]
                },
                {
                    timeStart: "0:40",
                    timeEnd: "0:50",
                    duration: "10 min",
                    colorClass: "c5",
                    icon: "💬",
                    title: "四、 教師點評與快速分享",
                    desc: "老師挑選 2-3 個題目進行點評，學生回座位閱讀建議並評估是否採納。",
                    tags: ["老師回饋", "反思收斂"]
                }
            ]
        },
        {
            badge: "第二節",
            title: "題目定案與資料搜集入門",
            duration: 50,
            hasBreakAfter: false,
            stages: [
                {
                    timeStart: "0:00",
                    timeEnd: "0:15",
                    duration: "15 min",
                    colorClass: "c4",
                    icon: "🎯",
                    title: "五、 題目最終定案",
                    desc: "根據同學建議修改，並寫下 W4 最終定案題目，宣告「問題形成階段」結束。",
                    tags: ["問題定案", "階段總結"]
                },
                {
                    timeStart: "0:15",
                    timeEnd: "0:32",
                    duration: "17 min",
                    colorClass: "c2",
                    icon: "📚",
                    title: "六、 華藝資料庫查找實作",
                    desc: "介紹進階搜尋與限制條件（台灣/近五年/碩博士論文），學生實作找回 1 篇研究。",
                    tags: ["資料搜尋", "工具實作"]
                },
                {
                    timeStart: "0:32",
                    timeEnd: "0:42",
                    duration: "10 min",
                    colorClass: "c1",
                    icon: "🤖",
                    title: "七、 AI 智慧資料搜集助手",
                    desc: "用 AI 生成更多中/英文關鍵字，評估 AI 的建議，並用新關鍵字再搜一次資料庫。",
                    tags: ["AI 實作", "策略優化"],
                    keyPoint: "🎯 AI 給建議，你要判斷適不適合你的題目！"
                },
                {
                    timeStart: "0:42",
                    timeEnd: "0:50",
                    duration: "8 min",
                    colorClass: "c3",
                    icon: "📝",
                    title: "八、 APA 格式與下週預告",
                    desc: "學習碩士論文與期刊的 APA 基本格式，將找到的研究寫成格式。預告 W5 與 W7 分組。",
                    tags: ["學術格式", "課程預告"]
                }
            ]
        }
    ],
    summaries: [
        {
            icon: "🎨",
            label: "課堂產出",
            text: "研究海報<br><small style=\"font-size:11px;color:#888;\">含預期發現</small>"
        },
        {
            icon: "🎯",
            label: "階段里程碑",
            text: "W4 最終定案題目<br><small style=\"font-size:11px;color:#888;\">通過同儕驗證</small>"
        },
        {
            icon: "📚",
            label: "工具練習",
            text: "資料庫搜尋與 APA<br><small style=\"font-size:11px;color:#ccc;\">帶入後續研究中使用</small>"
        }
    ],
    legends: [
        { colorClass: "lm-c1", label: "互動 / 發表" },
        { colorClass: "lm-c2", label: "AI 實作 / 工具" },
        { colorClass: "lm-c4", label: "定案 / 收斂" },
        { colorClass: "lm-c3", label: "說明 / 規範" },
        { colorClass: "lm-c5", label: "點評 / 回饋" }
    ]
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
