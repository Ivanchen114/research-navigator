// 題目資料庫：30 個「生病的研究問題」
export const patientData = [
  // 🟢 綠卡（新手好救｜單一問題為主）
  {
      id: 1,
      question: "探究美的本質",
      diagnosis: "抽象哲學病",
      causes: ["空"],
      cures: ["實"],
      healedOptions: [
          {
              text: "對五幅經典世界名畫的主觀喜好度票選與評分",
              isCorrect: true,
              feedback: "標準！將抽象的「美」轉換成具體可測量的「喜好度評分」。"
          },
          {
              text: "探討古希臘哲學家對美學的終極定義",
              isCorrect: false,
              feedback: "錯誤！這依然是「抽象哲學病」，甚至合併了對象接觸不到的「觀落陰病」。"
          }
      ],
      explanation: "「美」太抽象了！面對抽象哲學病，必須打「具體疫苗」(空 → 實)，變成具體行為或量表分數！",
      severity: "mild",
      tags: ["太抽象", "無法測量"]
  },
  {
      id: 2,
      question: "本校學生有沒有在用社群媒體？",
      diagnosis: "是非廢話病",
      causes: ["空"],
      cures: ["實"],
      healedOptions: [
          {
              text: "本校高一生每日使用社群媒體的平均時間與主要用途調查",
              isCorrect: true,
              feedback: "正確！把「有沒有」變成可測量的「時間與用途」，問題就立體了。"
          },
          {
              text: "本校學生最喜歡哪一個社群媒體？",
              isCorrect: false,
              feedback: "錯誤！這雖然不是是非題，但過於簡化，缺乏深入探究的價值。"
          }
      ],
      explanation: "「有沒有」會一秒被回答「有！」而終結話題，屬於「是非廢話病」。必須打一劑「具體疫苗」(空 → 實) 測量確切程度！",
      severity: "mild",
      tags: ["只有是非", "答案顯然"]
  },
  {
      id: 3,
      question: "2030年最熱門的工作會是什麼？",
      diagnosis: "算命占卜病",
      causes: ["遠"],
      cures: ["近"],
      healedOptions: [
          {
              text: "本校高三生目前最嚮往的職場領域與選擇動機分析",
              isCorrect: true,
              feedback: "漂亮！把時間軸拉回「現在」，對象限縮回身邊的高三生。"
          },
          {
              text: "台灣未來五年最缺人的行業發展趨勢預測",
              isCorrect: false,
              feedback: "錯誤！這依舊是預測未來的「算命占卜病」，高中生無法驗證。"
          }
      ],
      explanation: "預測未來是「算命占卜病」。必須使用「任意探測儀」(遠 → 近) 將時間軸拉回現在，並限縮對象！",
      severity: "mild",
      tags: ["預測未來", "還沒發生"]
  },
  {
      id: 4,
      question: "全球暖化的成因與解決方法",
      diagnosis: "百科全書病",
      causes: ["大"],
      cures: ["小"],
      healedOptions: [
          {
              text: "本校教室冷氣使用時間與同學節能意識的現況調查",
              isCorrect: true,
              feedback: "沒錯！將全球議題縮小到「本校教室」，變成可執行的在地探究。"
          },
          {
              text: "全台灣各縣市的碳排放量與減碳政策總整理",
              isCorrect: false,
              feedback: "錯誤！這個範圍還是太大了，依然是網路查就有的「百科全書病」。"
          }
      ],
      explanation: "標準的「百科全書病」，這範圍大到網路查就有！服用「縮小藥丸」(大 → 小) 聚焦於身邊特定群體的特定行為。",
      severity: "mild",
      tags: ["範圍太大", "網路都有"]
  },
  {
      id: 5,
      question: "本校學生有沒有在段考前熬夜？",
      diagnosis: "是非廢話病",
      causes: ["空"],
      cures: ["實"],
      healedOptions: [
          {
              text: "本校高二生在段考前一週的平均睡眠時數與主觀壓力感受",
              isCorrect: true,
              feedback: "很好！把「有沒有」具體化為「睡眠時數」與「壓力感受」。"
          },
          {
              text: "段考前熬夜的同學比例是不是很高？",
              isCorrect: false,
              feedback: "錯誤！這還是只能回答「是或否」，沒有解決是非廢話病的問題。"
          }
      ],
      explanation: "又是一個「有沒有」的封閉話題！必須施打「具體疫苗」(空 → 實) 化為可計算的時數與壓力分數。",
      severity: "mild",
      tags: ["只有是非", "封閉式問題"]
  },
  {
      id: 6,
      question: "本校學生有沒有在上課偷滑手機？",
      diagnosis: "是非廢話病",
      causes: ["空"],
      cures: ["實"],
      healedOptions: [
          {
              text: "本校高一各班在下午第一節課學生分心使用手機的頻率與時段觀察",
              isCorrect: true,
              feedback: "非常好！將現象轉化為可定時定點觀察的「頻率與時段」。"
          },
          {
              text: "上課偷滑手機的同學是不是通常成績較差？",
              isCorrect: false,
              feedback: "錯誤！這雖然有了變化，但預設了「偷滑手機=成績差」的主觀偏見。"
          }
      ],
      explanation: "答案想必是「有」。必須施打「具體疫苗」(空 → 實)，把現象量化為頻率、時段等可觀察變項。",
      severity: "mild",
      tags: ["封閉式重點", "答案顯然"]
  },
  {
      id: 7,
      question: "為什麼我們班那麼吵？",
      diagnosis: "主觀偏見病",
      causes: ["難"],
      cures: ["易"],
      healedOptions: [
          {
              text: "本班同學在不同學科課堂上的發言次數與私下交談頻率觀察紀錄",
              isCorrect: true,
              feedback: "正解！把主觀的「吵」降維成客觀可計算的「發言次數」與「交談頻率」。"
          },
          {
              text: "探討本班同學缺乏自律神經與公德心的根本原因",
              isCorrect: false,
              feedback: "錯誤！不但沒有解決問題，反而加入了更嚴重的「主觀偏見」。"
          }
      ],
      explanation: "「吵」是個人主觀感受。請使用「降維手術刀」(難 → 易)，去除情緒字眼，改為客觀可記錄的頻率。",
      severity: "mild",
      tags: ["主觀評論", "情緒字眼"]
  },
  {
      id: 8,
      question: "高中生為什麼很常遲到？",
      diagnosis: "主觀偏見病",
      causes: ["難"],
      cures: ["易"],
      healedOptions: [
          {
              text: "本校高一學生在一週內的遲到頻率與前一晚入睡時間的關聯性探討",
              isCorrect: true,
              feedback: "正確！去除了指責的意味，將遲到改為頻率，並試圖尋找客觀的關聯變因。"
          },
          {
              text: "高中生是不是因為太懶散所以常遲到？",
              isCorrect: false,
              feedback: "錯誤！陷入了「懶散」這種主觀且無法具體測量的主觀偏見病。"
          }
      ],
      explanation: "直接認定高中生「很常遲到」帶有偏見。必須進行「降維手術」(難 → 易) 找出客觀的關聯因素。",
      severity: "mild",
      tags: ["主觀預設", "缺乏客觀"]
  },
  {
      id: 9,
      question: "高中福利社為什麼都很難吃？",
      diagnosis: "主觀偏見病",
      causes: ["難"],
      cures: ["易"],
      healedOptions: [
          {
              text: "本校學生對福利社各類熱食的滿意度評分與改善期望調查",
              isCorrect: true,
              feedback: "很棒！把主觀的「難吃」客觀化為「滿意度評分」，並導向有建設性的期望調查。"
          },
          {
              text: "探討福利社阿姨廚藝不佳與食材低劣的核心原因",
              isCorrect: false,
              feedback: "這會引發醫療糾紛！充滿了強烈的惡意與主觀偏見，完全不是學術研究。"
          }
      ],
      explanation: "「難吃」是絕對的主觀價值判斷！必須立刻換上「降維手術刀」(難 → 易)，改成客觀滿意度調查。",
      severity: "mild",
      tags: ["主觀價值", "強烈偏見"]
  },
  {
      id: 10,
      question: "高中生是不是都會熬夜？",
      diagnosis: "是非廢話病",
      causes: ["空"],
      cures: ["實"],
      healedOptions: [
          {
              text: "本校高三學生平均每日就寢時間與學測壓力的相關性分析",
              isCorrect: true,
              feedback: "完美！把模糊的熬夜轉變為確切的「就寢時間」，並加入了壓力變數。"
          },
          {
              text: "為什麼高中生都不睡覺？",
              isCorrect: false,
              feedback: "錯誤！這依然是非常龐大且略帶偏見的無效提問。"
          }
      ],
      explanation: "「是不是」開頭的問題會立刻終止探究。打一針「具體疫苗」(空 → 實)，將熬夜具體化為就寢時間與時數！",
      severity: "mild",
      tags: ["只有是非", "無法深入"]
  },

  // 🟡 黃卡（進階：通常兩個問題疊加）
  {
      id: 11,
      question: "為什麼現代人越來越不快樂？",
      diagnosis: "百科全書病 + 抽象哲學病",
      causes: ["大", "空"],
      cures: ["小", "實"],
      healedOptions: [
          {
              text: "本校住宿生在期中考週的休閒習慣與主觀壓力指數之關聯",
              isCorrect: true,
              feedback: "漂亮 Combo！將對象縮小到住宿生，並把快樂具體化為壓力指數。"
          },
          {
              text: "探討現代社會帶來物質豐裕卻導致心靈空虛的哲學原因",
              isCorrect: false,
              feedback: "錯誤！這依然太空、太大，你無法測量全現代社會的心靈空虛。"
          }
      ],
      explanation: "「現代人」範圍太大、「快樂」定義太空泛。必須打出 Combo！服用「縮小藥丸」加上「具體疫苗」！",
      severity: "moderate",
      tags: ["對象模糊", "概念抽象"]
  },
  {
      id: 12,
      question: "人類存在的意義是什麼？",
      diagnosis: "抽象哲學病 + 距離發病(範圍過大)",
      causes: ["空", "大"],
      cures: ["實", "小"],
      healedOptions: [
          {
              text: "本校高三生面對升學壓力時的自我價值肯定程度與應對策略",
              isCorrect: true,
              feedback: "精準！放棄探討全人類的存在，轉向研究身邊高中生的自我價值感。"
          },
          {
              text: "整理各宗教典籍中關於生命意義的共同觀點",
              isCorrect: false,
              feedback: "錯誤！這變成了文獻堆疊的「百科全書病」，偏離了實證研究的本質。"
          }
      ],
      explanation: "這題範圍龐大且極度抽象。必須打出 Combo！「縮小藥丸」(將人類縮為身邊的群眾) 加上「具體疫苗」(將意義化為自我價值量表)。",
      severity: "moderate",
      tags: ["形而上", "超級抽象"]
  },
  {
      id: 13,
      question: "為什麼讀書比打電動更好？",
      diagnosis: "主觀偏見病 + 範圍膨脹",
      causes: ["大", "難"],
      cures: ["小", "易"],
      healedOptions: [
          {
              text: "本校學生週末課業複習與電玩娛樂的時間分配對週一小考表現之影響",
              isCorrect: true,
              feedback: "滿分！去除了「更好」的主觀評價，改以客觀的時間分配與成績來驗證。"
          },
          {
              text: "探討打電動使人墮落而讀書使人高尚的社會證據",
              isCorrect: false,
              feedback: "太糟糕了！充滿了主觀道德批判，毫無科學精神。"
          }
      ],
      explanation: "「更好」是嚴重的主觀價值判斷，且題目完全沒限縮對象！需要 Combo：「縮小藥丸」加上「降維手術刀」(轉為客觀可測量的表現)。",
      severity: "moderate",
      tags: ["主觀評價", "價值預設"]
  },
  {
      id: 14,
      question: "台灣的教育制度好不好？",
      diagnosis: "百科全書病 + 主觀偏見病",
      causes: ["大", "難"],
      cures: ["小", "易"],
      healedOptions: [
          {
              text: "本校學生對現行 108 課綱學習歷程檔案製作的困難度認知與看法",
              isCorrect: true,
              feedback: "很好！將龐大的「台灣教育」縮小至「學習歷程檔案」，並用「看法調查」取代好壞論斷。"
          },
          {
              text: "對比台灣與芬蘭教育制度的成敗優劣",
              isCorrect: false,
              feedback: "這題目還是太龐大了！依舊是高中生吃不下來的「百科全書病」。"
          }
      ],
      explanation: "國家級的教育制度範圍太大，且「好不好」無法給出簡單裁斷。Combo 對策：縮小政策範圍，並降維為特定群體的滿意度或困難調查！",
      severity: "moderate",
      tags: ["過於龐大", "缺乏客觀指標"]
  },
  {
      id: 15,
      question: "訪談賈伯斯的創新理念",
      diagnosis: "觀落陰病 + 百科全書病",
      causes: ["遠", "大"],
      cures: ["近", "小"],
      healedOptions: [
          {
              text: "訪談校內曾獲全國科展優等的學長姐之專題發想與突破歷程",
              isCorrect: true,
              feedback: "正解！把不可能接觸的賈伯斯替換成身邊有創新經驗的學長姐。"
          },
          {
              text: "閱讀並整理賈伯斯傳記中的十大創新法則",
              isCorrect: false,
              feedback: "錯誤！雖然可以做，但這變成了只查網路圖書的「百科全書」，失去了原先想做訪談的原意。"
          }
      ],
      explanation: "賈伯斯已經過世且難以接觸，這就是「觀落陰病」。Combo 處方：「任意探測儀」(改找身邊能受訪的人) 以及「縮小藥丸」。",
      severity: "moderate",
      tags: ["接觸不到", "太大咖"]
  },
  {
      id: 16,
      question: "為什麼高中生上課都不專心？",
      diagnosis: "範圍膨脹 + 主觀偏見病",
      causes: ["大", "難"],
      cures: ["小", "易"],
      healedOptions: [
          {
              text: "本校高一生在下午第一節課的專注力自評分數與前晚睡眠時數之關聯",
              isCorrect: true,
              feedback: "正確！拿掉「都不專心」的偏見，並把範圍精確鎖定在下午第一節課。"
          },
          {
              text: "探討智慧型手機普及如何摧毀高中生的專注力",
              isCorrect: false,
              feedback: "錯誤！這還是帶有強烈的主觀預設與情緒字眼。"
          }
      ],
      explanation: "「都不專心」是誇大的主觀預設，且全國高中生範圍太大！Combo 治療：「縮小藥丸」加上「降維手術刀」(轉為主觀專注定評量)。",
      severity: "moderate",
      tags: ["預設立場", "過度誇大"]
  },
  {
      id: 17,
      question: "為什麼段考週壓力特別大？",
      diagnosis: "抽象哲學病 + 主觀偏見病",
      causes: ["空", "難"],
      cures: ["實", "易"],
      healedOptions: [
          {
              text: "本校高二生在段考前一週的具體焦慮症狀（如失眠、生病）發生頻率統計",
              isCorrect: true,
              feedback: "很棒！將抽象模糊的「壓力特別大」轉換成可以數數的「焦慮症狀發生頻率」。"
          },
          {
              text: "段考制度是不是台灣教育最大的毒瘤？",
              isCorrect: false,
              feedback: "這會再度引發醫療糾紛！「毒瘤」是非常主觀且無效的偏見用詞。"
          }
      ],
      explanation: "「壓力大」難以定義且帶有主觀判斷。Combo 治療：「具體疫苗」(轉化為焦慮症狀等具體指標) 加上「降維手術刀」。",
      severity: "moderate",
      tags: ["抽象", "難以驗證"]
  },
  {
      id: 18,
      question: "為什麼有些老師上課很無聊？",
      diagnosis: "主觀偏見病 + 範圍膨脹",
      causes: ["難", "大"],
      cures: ["易", "小"],
      healedOptions: [
          {
              text: "本校學生對不同教學法（如講述法、分組討論）的主觀專注度評分與偏好",
              isCorrect: true,
              feedback: "精緻的操作！把傷人的「無聊」改成中立的「專注度評分」，研究就有了價值。"
          },
          {
              text: "探討資深教師不願更新教學簡報的心理原因",
              isCorrect: false,
              feedback: "錯誤！充滿了主觀偏見，且你根本不可能要求老師坐下接受你的心理剖析。"
          }
      ],
      explanation: "「很無聊」是極度主觀且具有攻擊性的偏見！Combo：「縮小藥丸」加上「降維手術刀」(改成中立的教學法偏好與滿意度調查)。",
      severity: "moderate",
      tags: ["主觀評論", "情緒攻擊"]
  },
  {
      id: 19,
      question: "為什麼班上同學不愛運動？",
      diagnosis: "主觀偏見病 + 抽象哲學",
      causes: ["難", "空"],
      cures: ["易", "實"],
      healedOptions: [
          {
              text: "本班同學每週課後參與體育活動的總時數與阻礙因素調查",
              isCorrect: true,
              feedback: "漂亮！把「不愛」這種心理層面，具體為「運動總時數」，並調查客觀「阻礙因素」。"
          },
          {
              text: "探討網路成癮與懶惰如何導致班上同學體能衰退",
              isCorrect: false,
              feedback: "錯誤！「懶惰」依然是主觀偏見，你無法客觀測量一個人的懶惰程度。"
          }
      ],
      explanation: "「不愛」是一種抽象心理且略帶預設。Combo：「降維手術」移除偏見，並注射「具體疫苗」(轉為時數與阻礙因素的客觀調查)。",
      severity: "moderate",
      tags: ["心理推斷", "缺乏客觀"]
  },
  {
      id: 20,
      question: "為什麼社團活動常常辦不出成效？",
      diagnosis: "百科全書病 + 抽象哲學",
      causes: ["大", "空"],
      cures: ["小", "實"],
      healedOptions: [
          {
              text: "本校吉他社幹部對期末成果發表會籌備過程中所遇困難的訪談分析",
              isCorrect: true,
              feedback: "正是如此！鎖定特定社團、特定活動，並將抽象的成效轉化為對「籌備困難」的訪談。"
          },
          {
              text: "台灣高中生缺乏領導力如何導致社團沒落",
              isCorrect: false,
              feedback: "這問題仍舊太大了，而且帶有強烈預設高中生缺乏領導力的偏見。"
          }
      ],
      explanation: "「社團活動」範圍包山包海，「成效」定義太抽象。Combo：「縮小藥丸」(鎖定單一社團或活動) 搭配「具體疫苗」。",
      severity: "moderate",
      tags: ["定義鬆散", "涵蓋過廣"]
  },

  // 🔴 紅卡（魔王病歷）
  {
      id: 21,
      question: "早餐對人生成就的影響",
      diagnosis: "變因失控 + 算命占卜病",
      causes: ["難", "遠"],
      cures: ["易", "近"],
      healedOptions: [
          {
              text: "有吃早餐與否對本班同學第一節課專注力量表分數之短期影響",
              isCorrect: true,
              feedback: "成功的急救！把遙遠的「人生」拉回「這節課」，將難以控制的「成就」改為「專注力」。"
          },
          {
              text: "追蹤三十名成功企業家早年是否天天吃早餐",
              isCorrect: false,
              feedback: "這不是紅卡等級的解法...這對象太遠了你根本找不到，更無法驗證因果關係。"
          }
      ],
      explanation: "「人生成就」變因太多根本不可能控制，且影響太過遙遠！必須連發 Combo：「降維手術刀」加上「任意探測儀」(將遙遠人生拉回這節課)。",
      severity: "boss",
      tags: ["變因失控", "遙不可及"]
  },
  {
      id: 22,
      question: "靈魂到底存不存在？",
      diagnosis: "方法無效病 + 算命占卜病(形而上)",
      causes: ["難", "遠"],
      cures: ["易", "近"],
      healedOptions: [
          {
              text: "本校學生對超自然現象的相信程度與面對大型考試焦慮感的相關性",
              isCorrect: true,
              feedback: "漂亮的切換！不去驗證靈魂存否，而是改為調查「相關信仰」對「心理」的影響。"
          },
          {
              text: "從量子力學角度探討意識脫離肉體獨立存在的可能性",
              isCorrect: false,
              feedback: "病患宣告不治！這完全超出了高中生的研究可行性與實驗驗證範圍。"
          }
      ],
      explanation: "這是一個根本無法用科學驗證的神學問題！Combo 處方：「降維手術刀」(改為研究人們對此的『看法』) 以及「任意探測儀」。",
      severity: "boss",
      tags: ["無法驗證", "形而上"]
  },
  {
      id: 23,
      question: "手機使用對學業成績的影響",
      diagnosis: "百科全書病 + 抽象哲學",
      causes: ["大", "空"],
      cures: ["小", "實"],
      healedOptions: [
          {
              text: "本校高一生睡前使用手機時數與隔週英文單字小考成績的相關性探討",
              isCorrect: true,
              feedback: "非常精準！手機使用具體化為「睡前時數」，學業成績具體化為「單字小考」。"
          },
          {
              text: "探究手機藍光如何潛移默化破壞青少年的大腦記憶區",
              isCorrect: false,
              feedback: "嚴重誤診！這變成醫學神經研究，你沒有設備做這種層級的實證實驗。"
          }
      ],
      explanation: "看似合理，但這題目已經有一萬篇碩士論文寫過了(百科全書病)！必須 Combo：「縮小藥丸」與「具體疫苗」(限縮特定時間與特定科目)。",
      severity: "boss",
      tags: ["缺乏新意", "定義模糊"]
  },
  {
      id: 24,
      question: "滑手機會不會讓人變笨？",
      diagnosis: "多重器官衰竭：大 + 空 + 難",
      causes: ["大", "空", "難"],
      cures: ["小", "實", "易"],
      healedOptions: [
          {
              text: "本班同學每日使用短影音平台時數與長閱讀理解測驗成績之相關分析",
              isCorrect: true,
              feedback: "華麗的 Combo！把變笨化為「長閱讀理解測驗」，並將大題小作到本班短影音現況。"
          },
          {
              text: "解析抖音等短影音平台降低人類智商的全球趨勢",
              isCorrect: false,
              feedback: "錯誤！你無法拿到全球的資料，也無法定義與評估全人類智商的衰退。"
          }
      ],
      explanation: "極度嚴重的紅卡！範圍太大，變笨太抽象，且帶有偏見的難！必須三管齊下注射 Combo：縮小、具體、降維！",
      severity: "boss",
      tags: ["超級重症", "模糊且偏見"]
  },
  {
      id: 25,
      question: "補習到底有沒有用？",
      diagnosis: "百科全書病 + 是非廢話病",
      causes: ["大", "空"],
      cures: ["小", "實"],
      healedOptions: [
          {
              text: "本校高二理組學生參與數學補習的時數與校內段考成績進步幅度的關聯",
              isCorrect: true,
              feedback: "正確！把有沒有用，具體化為「補習時數與成績進步幅度」，並縮小對象範圍。"
          },
          {
              text: "台灣補習文化氾濫對整體教育素質的負面衝擊",
              isCorrect: false,
              feedback: "這又退回到了無法驗證且帶有極大價值主觀判斷的大問題了。"
          }
      ],
      explanation: "「有沒有用」是模糊的是非題，這也是老掉牙的大難題。Combo 處方：「縮小藥丸」加上「具體疫苗」(改成具體的進步分數)。",
      severity: "boss",
      tags: ["封閉是否", "無效大哉問"]
  },
  {
      id: 26,
      question: "高中生談戀愛會不會影響成績？",
      diagnosis: "變因失控 + 是非廢話",
      causes: ["大", "空", "難"],
      cures: ["小", "實", "易"],
      healedOptions: [
          {
              text: "本校高二生對班對現象的接受度與對班級讀書風氣的主觀感受差異",
              isCorrect: true,
              feedback: "巧妙的迴避了因果認定的難題，將之降維成更容易研究的「接受度」與「主觀感受」。"
          },
          {
              text: "追蹤二十對高中情侶三年來的成績起伏變化",
              isCorrect: false,
              feedback: "錯誤！這會牽涉到極大的隱私與倫理考量，且變因根本無法控制。"
          }
      ],
      explanation: "影響成績的變因太多了(智商、家境...)根本控制不了！而且太私密對象難尋。必須 Combo降維：「改變切入點為周遭同學的主觀看法」。",
      severity: "boss",
      tags: ["變因太多", "涉及隱私"]
  },
  {
      id: 27,
      question: "IG / 抖音讓高中生焦慮嗎？",
      diagnosis: "百科全書病 + 抽象哲學",
      causes: ["大", "空"],
      cures: ["小", "實"],
      healedOptions: [
          {
              text: "本校高一生每日使用 IG 探索頁面的時數與其外貌焦慮量表得分之相關性",
              isCorrect: true,
              feedback: "十分精準！把大範圍縮小到本校，將抽象的焦慮，搭配了明確的外貌焦慮量表。"
          },
          {
              text: "探討社群媒體母公司演算法蓄意製造青少年焦慮的商業陰謀",
              isCorrect: false,
              feedback: "醫生你在做夢嗎？這變成了跨國陰謀論，是完全無法執行接觸的「觀落陰病」！"
          }
      ],
      explanation: "非常大且有許多難以證明的變項。Combo 對策：「縮小藥丸」搭配「具體疫苗」(引入明確的心理學量表)。",
      severity: "boss",
      tags: ["範圍太大", "概念模糊"]
  },
  {
      id: 28,
      question: "為什麼有些同學天生就比較會讀書？",
      diagnosis: "方法無效病 + 觀落陰病",
      causes: ["遠", "難"],
      cures: ["近", "易"],
      healedOptions: [
          {
              text: "本校校排前 10% 學生之讀書計畫執行率與課後作息模式調查",
              isCorrect: true,
              feedback: "好辦法！放棄探究天生基因，而是降維去研究那些會讀書的同學「具體的作息模式」。"
          },
          {
              text: "從人類基因圖譜中尋找智商與學習能力的決定性序列",
              isCorrect: false,
              feedback: "醒醒啊高中生，你沒有這種國家級實驗室的基因設備與資料庫能用！"
          }
      ],
      explanation: "這涉及到遺傳基因，高中生沒有實驗室可以驗證。必須 Combo：「任意探測儀」(拉回身邊高分同學) 與「降維手術刀」(改看他們的具體行為)。",
      severity: "boss",
      tags: ["實驗無效", "設備不足"]
  },
  {
      id: 29,
      question: "訪談蔡英文／現任總統對教育改革的看法",
      diagnosis: "觀落陰病 + 方法無效",
      causes: ["遠", "難"],
      cures: ["近", "易"],
      healedOptions: [
          {
              text: "訪談本校校長對 108 課綱推動三年來的校內實施成效與反思",
              isCorrect: true,
              feedback: "神救場！把遙不可及的總統，替換成了校園內最具指標性且可接觸的校長。"
          },
          {
              text: "寫信給教育部長要求說明台灣未來十年的教改藍圖",
              isCorrect: false,
              feedback: "錯誤！這還是「觀落陰病」，對方很高機率不會理你，你的研究就會宣告死亡。"
          }
      ],
      explanation: "總統日理萬機，絕對不可能讓你訪談。這是極其嚴重的觀落陰。Combo：「任意探測儀」(找身旁同等份量的上位者) 加「降維手術」。",
      severity: "boss",
      tags: ["絕對接觸不到", "目標太大"]
  },
  {
      id: 30,
      question: "為什麼有些人天生就比較聰明？",
      diagnosis: "變因失控 + 方法無效病",
      causes: ["大", "難"],
      cures: ["小", "易"],
      healedOptions: [
          {
              text: "本校學生家長教育參與程度與學生學習動機量表得分之相關性研究",
              isCorrect: true,
              feedback: "巧妙轉換！放棄先天智商研究，轉移探討客觀且可觀察的「家庭教育參與度」。"
          },
          {
              text: "解析微積分滿分學生腦部神經元的活躍度差異",
              isCorrect: false,
              feedback: "宣告失敗！你沒有 fMRI 核磁共振機器可以去掃描同學的大腦！"
          }
      ],
      explanation: "又是天生基因問題，嚴重的方法無效！Combo 處方：「縮小藥丸」加上「降維手術刀」(改從後天環境、行為等可觀察變因下手)。",
      severity: "boss",
      tags: ["變因失控", "高中生無法做"]
  }
];
