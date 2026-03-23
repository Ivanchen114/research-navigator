export const patientData = [
  // 🟢 綠卡（新手好救｜單一問題為主）
  {
    id: 1,
    primaryDiagnosisKey: "A",
    priorityDiagnosisKey: "A",
    acceptableDiagnosisKeys: [],
    coDiagnosisKeys: [],
    priorityReason: "這題最大問題是「美的本質」太抽象，就算縮小範圍也還是無法直接操作化，所以先救「空」。",
    question: "探究美的本質",
    diagnosis: "抽象哲學病",
    causes: ["空"],
    cures: ["實"],
    healedOptions: [
      {
        text: "對五幅經典世界名畫的主觀喜好度票選與評分",
        isCorrect: true,
        researchType: "量化",
        feedback: "正確！你把抽象的「美」轉成可評分的喜好度，這樣才有辦法蒐集資料與比較。"
      },
      {
        text: "探討古希臘哲學家對美學的終極定義",
        isCorrect: false,
        researchType: null,
        feedback: "錯誤！這題仍停留在抽象概念與文獻堆疊，沒有變成高中生可執行的研究題目。"
      }
    ],
    explanation: [
      { icon: "👁️", label: "觀察", text: "題目中的「美的本質」太抽象，沒有明確對象，也沒有可以直接觀察或測量的指標。" },
      { icon: "🧠", label: "診斷", text: "這是抽象哲學病。你無法直接研究「美本身」，只能研究人對特定作品、形式或風格的感受與評價。" },
      { icon: "💡", label: "處方", text: "用「空→實」把抽象概念改成可評分的偏好、喜好度或滿意度，才能變成可執行的研究。" }
    ],
    severity: "mild",
    tags: ["太抽象", "無法測量"]
  },
  {
    id: 2,
    primaryDiagnosisKey: "E",
    priorityDiagnosisKey: "E",
    acceptableDiagnosisKeys: [],
    coDiagnosisKeys: [],
    priorityReason: "這題最大的卡點是「有沒有」讓問題停在封閉式問法，研究推不下去，所以先救問法。",
    question: "本校學生有沒有在用社群媒體？",
    diagnosis: "是非廢話病",
    causes: ["空"],
    cures: ["實"],
    healedOptions: [
      {
        text: "本校高一生每日使用社群媒體的平均時間與睡眠時數之關聯",
        isCorrect: true,
        researchType: "量化",
        feedback: "精準！你把單純的「有沒有」變成兩個具體變數（社群使用時間與睡眠時數）的關聯，這才是有深度的研究問題。"
      },
      {
        text: "本校學生最喜歡哪一個社群媒體？",
        isCorrect: false,
        researchType: null,
        feedback: "錯誤！這比原題稍微具體，但仍過於單薄，沒有真正解決原本的研究問題。"
      }
    ],
    explanation: [
      { icon: "👁️", label: "觀察", text: "題目只是在問「有沒有」，答案幾乎顯而易見，探究很快就會結束。" },
      { icon: "🧠", label: "診斷", text: "這是是非廢話病。因為它不能帶出程度、差異或關聯，只會得到一個很薄的答案。" },
      { icon: "💡", label: "處方", text: "用「空→實」把有無改成可描述的變數（如使用時數），並和其他變數（如睡眠）連結，讓題目變深。" }
    ],
    severity: "mild",
    tags: ["只有是非", "答案顯然"]
  },
  {
    id: 3,
    primaryDiagnosisKey: "B",
    priorityDiagnosisKey: "B",
    acceptableDiagnosisKeys: [],
    coDiagnosisKeys: [],
    priorityReason: "題目在問尚未發生的未來，現在無法驗證，因此先判算命占卜病。",
    question: "2030年最熱門的工作會是什麼？",
    diagnosis: "算命占卜病",
    causes: ["遠"],
    cures: ["近"],
    healedOptions: [
      {
        text: "本校高三生目前最嚮往的職場領域與選擇動機分析",
        isCorrect: true,
        researchType: "量化",
        feedback: "漂亮！你把未來預測拉回現在，改成可調查的志向與動機。"
      },
      {
        text: "台灣未來五年最缺人的行業發展趨勢預測",
        isCorrect: false,
        researchType: null,
        feedback: "錯誤！這仍然是在預測未來，沒有真正拉回高中生可做的範圍。"
      }
    ],
    explanation: [
      { icon: "👁️", label: "觀察", text: "題目把焦點放在 2030 年，研究對象與結果都還沒發生，無法驗證。" },
      { icon: "🧠", label: "診斷", text: "這是算命占卜病。你可以猜測未來，但高中生無法用研究方法證明未來一定如此。" },
      { icon: "💡", label: "處方", text: "用「遠→近」把未來預測改成現在可調查的想法，例如學生目前最嚮往的職涯方向與理由。" }
    ],
    severity: "mild",
    tags: ["預測未來", "還沒發生"]
  },
  {
    id: 4,
    primaryDiagnosisKey: "C",
    priorityDiagnosisKey: "C",
    acceptableDiagnosisKeys: [],
    coDiagnosisKeys: [],
    priorityReason: "題目範圍大到全球層級，若不先縮小範圍，後面根本無法落地。",
    question: "全球暖化的成因與解決方法",
    diagnosis: "百科全書病",
    causes: ["大"],
    cures: ["小"],
    healedOptions: [
      {
        text: "本校教室冷氣使用行為與學生對節能減碳政策之看法",
        isCorrect: true,
        researchType: "量化",
        feedback: "精準！保留了探討暖化氣候行動的初衷，但將範圍縮小到校園與學生能實際調查的層級。"
      },
      {
        text: "全台灣各縣市的碳排放量與減碳政策總整理",
        isCorrect: false,
        researchType: null,
        feedback: "錯誤！範圍仍然太大，最後只會變成資料蒐集，不是你自己的研究。"
      }
    ],
    explanation: [
      { icon: "👁️", label: "觀察", text: "「全球暖化」範圍過大，成因與解法都涉及全球層級資料。" },
      { icon: "🧠", label: "診斷", text: "這是百科全書病。題目大到最後很容易變成資料整理，而不是你自己能做的研究。" },
      { icon: "💡", label: "處方", text: "用「大→小」縮到本校、教室、家庭或學生可接觸的節能行為，才有機會實作。" }
    ],
    severity: "mild",
    tags: ["範圍太大", "網路都有"]
  },
  {
    id: 5,
    primaryDiagnosisKey: "E",
    priorityDiagnosisKey: "E",
    acceptableDiagnosisKeys: [],
    coDiagnosisKeys: [],
    priorityReason: "仍是「有沒有」的封閉式問法，研究只能得到薄答案，所以先救問法。",
    question: "本校學生有沒有在段考前熬夜？",
    diagnosis: "是非廢話病",
    causes: ["空"],
    cures: ["實"],
    healedOptions: [
      {
        text: "本校高二生在段考前一週的平均睡眠時數與主觀壓力感受",
        isCorrect: true,
        researchType: "量化",
        feedback: "很好！你把「熬夜」改成睡眠時數與壓力，題目就可以真正調查。"
      },
      {
        text: "段考前熬夜的同學比例是不是很高？",
        isCorrect: false,
        researchType: null,
        feedback: "錯誤！這仍然停留在是非與印象判斷，沒有真正具體化。"
      }
    ],
    explanation: [
      { icon: "👁️", label: "觀察", text: "題目仍是在問「有沒有」，沒有進一步問程度、時間或情境。" },
      { icon: "🧠", label: "診斷", text: "這是是非廢話病。因為研究不該只停在有或沒有，而要看差異與程度。" },
      { icon: "💡", label: "處方", text: "用「空→實」把熬夜改成睡眠時數、就寢時間，再搭配段考情境或壓力感受。" }
    ],
    severity: "mild",
    tags: ["只有是非", "封閉式問題"]
  },
  {
    id: 6,
    primaryDiagnosisKey: "E",
    priorityDiagnosisKey: "E",
    acceptableDiagnosisKeys: [],
    coDiagnosisKeys: [],
    priorityReason: "問題停留在有無判斷，還沒進入頻率、時段、情境等研究焦點，所以先救問法。",
    question: "本校學生有沒有在上課偷滑手機？",
    diagnosis: "是非廢話病",
    causes: ["空"],
    cures: ["實"],
    healedOptions: [
      {
        text: "本校高一學生在不同課堂情境中自評使用手機頻率之調查",
        isCorrect: true,
        researchType: "量化",
        feedback: "沒錯！用自評量表取代直接觀察，解決了偷滑手機難以精確測量且涉及隱私倫理的困難，更符合研究可行性。"
      },
      {
        text: "上課偷滑手機的同學是不是通常成績較差？",
        isCorrect: false,
        researchType: null,
        feedback: "錯誤！你直接跳到帶偏見的因果猜測，沒有先把現象本身研究清楚。"
      }
    ],
    explanation: [
      { icon: "👁️", label: "觀察", text: "題目問的是有沒有，而不是具體情況，例如什麼時候、多久一次、在哪些課發生。" },
      { icon: "🧠", label: "診斷", text: "這是是非廢話病。答案多半顯而易見，但研究沒有因此往前走。" },
      { icon: "💡", label: "處方", text: "用「空→實」把偷滑手機改成頻率、時段、課堂情境或自評使用次數。" }
    ],
    severity: "mild",
    tags: ["封閉式重點", "答案顯然"]
  },
  {
    id: 7,
    primaryDiagnosisKey: "D",
    priorityDiagnosisKey: "D",
    acceptableDiagnosisKeys: [],
    coDiagnosisKeys: [],
    priorityReason: "「那麼吵」是強烈主觀感受，最大問題是語句先帶情緒與價值判斷，所以先救偏見。",
    question: "為什麼我們班那麼吵？",
    diagnosis: "主觀偏見病",
    causes: ["難"],
    cures: ["易"],
    healedOptions: [
      {
        text: "本班同學在不同學科課堂上的發言次數與私下交談頻率觀察紀錄",
        isCorrect: true,
        researchType: "量化",
        feedback: "【主治版】正解！你把主觀的「吵」改成可觀察的發言次數與交談頻率，解決了主觀偏見病。"
      },
      {
        text: "訪談本班5位同學對上課氛圍的主觀感受與改善期望",
        isCorrect: true,
        researchType: "質性",
        feedback: "【進階處方】正確！這題原本就在問「為什麼」，除了量化觀察，改用訪談蒐集同學對課堂氛圍的經驗也很合理。"
      },
      {
        text: "探討本班同學缺乏自律與公德心的根本原因",
        isCorrect: false,
        researchType: null,
        feedback: "錯誤！這不但沒有變客觀，反而加入更強烈的價值判斷。"
      }
    ],
    explanation: [
      { icon: "👁️", label: "觀察", text: "題目中的「那麼吵」帶有強烈主觀感受，沒有一致的判準。" },
      { icon: "🧠", label: "診斷", text: "這是主觀偏見病。因為「吵」不是一個直接可測量的研究變項，你必須先把它轉成可描述或可觀察的內容。" },
      { icon: "💡", label: "處方", text: "用「難→易」把情緒性的描述改成可觀察的發言次數、交談頻率，或改研究學生對課堂氛圍的主觀感受。" }
    ],
    severity: "mild",
    tags: ["主觀評論", "情緒字眼"]
  },
  {
    id: 8,
    primaryDiagnosisKey: "D",
    priorityDiagnosisKey: "D",
    acceptableDiagnosisKeys: ["C"],
    coDiagnosisKeys: ["C"],
    priorityReason: "這題也有點大，但更核心的是先假定「很常遲到」，帶有預設立場，所以先救偏見。",
    question: "高中生為什麼很常遲到？",
    diagnosis: "主觀偏見病",
    causes: ["難"],
    cures: ["易"],
    healedOptions: [
      {
        text: "本校高一學生在一週內的遲到頻率與前一晚入睡時間的關聯性探討",
        isCorrect: true,
        researchType: "量化",
        feedback: "正確！你去掉了預設指責，改用遲到頻率與睡眠因素來研究。"
      },
      {
        text: "高中生是不是因為太懶散所以常遲到？",
        isCorrect: false,
        researchType: null,
        feedback: "錯誤！這仍然把原因直接貼標籤，沒有把題目變客觀。"
      }
    ],
    explanation: [
      { icon: "👁️", label: "觀察", text: "「很常遲到」帶有預設立場，沒有清楚標準，也把高中生一概而論。" },
      { icon: "🧠", label: "診斷", text: "這是主觀偏見病。你先假定高中生常遲到，會讓題目一開始就失去中立。" },
      { icon: "💡", label: "處方", text: "用「難→易」改成一週遲到次數、睡眠時間、交通方式等可比較因素。" }
    ],
    severity: "mild",
    tags: ["主觀預設", "缺乏客觀"]
  },
  {
    id: 9,
    primaryDiagnosisKey: "D",
    priorityDiagnosisKey: "D",
    acceptableDiagnosisKeys: [],
    coDiagnosisKeys: [],
    priorityReason: "「都很難吃」是情緒化評價，最大卡點是先入為主的貶抑語言。",
    question: "高中福利社為什麼都很難吃？",
    diagnosis: "主觀偏見病",
    causes: ["難"],
    cures: ["易"],
    healedOptions: [
      {
        text: "本校學生對福利社各類熱食的滿意度評分與改善期望調查",
        isCorrect: true,
        researchType: "量化",
        feedback: "很好！你把傷人的評價變成滿意度與改善期望，研究才站得住腳。"
      },
      {
        text: "探討福利社阿姨廚藝不佳與食材低劣的核心原因",
        isCorrect: false,
        researchType: null,
        feedback: "錯誤！這是帶惡意的指控，不是研究。"
      }
    ],
    explanation: [
      { icon: "👁️", label: "觀察", text: "「都很難吃」是情緒化評價，也帶有先入為主的判斷。" },
      { icon: "🧠", label: "診斷", text: "這是主觀偏見病。研究不該從貶低開始，而要從可描述的感受與差異開始。" },
      { icon: "💡", label: "處方", text: "用「難→易」把難吃改成滿意度評分、偏好調查或改善期待，讓題目變得中立而可做。" }
    ],
    severity: "mild",
    tags: ["主觀價值", "強烈偏見"]
  },
  {
    id: 10,
    primaryDiagnosisKey: "E",
    priorityDiagnosisKey: "E",
    acceptableDiagnosisKeys: ["D"],
    coDiagnosisKeys: ["D"],
    priorityReason: "這題也帶偏見，但最大的問題是「是不是都會」讓研究停在是非問法，因此本關先救問法。",
    question: "高中生是不是都會熬夜？",
    diagnosis: "是非廢話病",
    causes: ["空"],
    cures: ["實"],
    healedOptions: [
      {
        text: "本校高三學生平均每日就寢時間與學測壓力的相關性分析",
        isCorrect: true,
        researchType: "量化",
        feedback: "很好！你把模糊的熬夜改成就寢時間，並加入具體情境。"
      },
      {
        text: "為什麼高中生都不睡覺？",
        isCorrect: false,
        researchType: null,
        feedback: "錯誤！這只是把原本的偏見換一句話講，沒有真正具體化。"
      }
    ],
    explanation: [
      { icon: "👁️", label: "觀察", text: "題目用「是不是都會」發問，而且「都」過度誇大。" },
      { icon: "🧠", label: "診斷", text: "這是是非廢話病，也帶一點偏見。因為題目沒有提供可比較的研究方向。" },
      { icon: "💡", label: "處方", text: "用「空→實」把熬夜改成就寢時間、睡眠時數，再加入特定年級或壓力情境。" }
    ],
    severity: "mild",
    tags: ["只有是非", "無法深入"]
  },

  // 🟡 黃卡（進階：通常兩個問題疊加）
  {
    id: 11,
    primaryDiagnosisKey: "C",
    priorityDiagnosisKey: "C",
    acceptableDiagnosisKeys: ["A"],
    coDiagnosisKeys: ["A"],
    priorityReason: "這題同時大又空，但如果不先縮小「現代人」範圍，後面連對象都定不下來，所以本關先救「大」。",
    question: "為什麼現代人越來越不快樂？",
    diagnosis: "百科全書病 + 抽象哲學病",
    causes: ["大", "空"],
    cures: ["小", "實"],
    healedOptions: [
      {
        text: "本校住宿生在考試週的休閒活動頻率與情緒狀態之關聯",
        isCorrect: true,
        researchType: "量化",
        feedback: "正確！把「越來越不快樂」這個抽象的大問題，轉譯成「考試週的情緒狀態」並探討休閒活動的關聯，保留原意又具體可行。"
      },
      {
        text: "探討現代社會帶來物質豐裕卻導致心靈空虛的哲學原因",
        isCorrect: false,
        researchType: null,
        feedback: "錯誤！這題仍然太大、太空，無法真正研究。"
      }
    ],
    explanation: [
      { icon: "👁️", label: "觀察", text: "「現代人」範圍太大，「不快樂」太抽象，沒有明確對象與測量方式。" },
      { icon: "🧠", label: "診斷", text: "這題同時有百科全書病和抽象哲學病。範圍太大會讓資料收不完，概念太空會讓你不知道怎麼量。" },
      { icon: "💡", label: "處方", text: "用「大→小」和「空→實」，把對象縮到特定學生群體，再把快樂改成壓力、自評情緒或量表分數。" }
    ],
    severity: "moderate",
    tags: ["對象模糊", "概念抽象"]
  },
  {
    id: 12,
    primaryDiagnosisKey: "A",
    priorityDiagnosisKey: "A",
    acceptableDiagnosisKeys: ["C"],
    coDiagnosisKeys: ["C"],
    priorityReason: "即使縮小範圍，「存在的意義」仍然過於抽象，無法直接操作化，所以先救「空」。",
    question: "人類存在的意義是什麼？",
    diagnosis: "抽象哲學病 + 百科全書病",
    causes: ["空", "大"],
    cures: ["實", "小"],
    healedOptions: [
      {
        text: "本校高三生面對升學壓力時的自我價值肯定程度與應對策略",
        isCorrect: true,
        researchType: "量化",
        feedback: "精準！你保留了原本關心的方向，但改成高中生可研究的自我價值感。"
      },
      {
        text: "整理各宗教典籍中關於生命意義的共同觀點",
        isCorrect: false,
        researchType: null,
        feedback: "錯誤！這變成文獻整理，不是你自己在做可操作的研究。"
      }
    ],
    explanation: [
      { icon: "👁️", label: "觀察", text: "「人類存在的意義」極度抽象，而且對象大到整個人類。" },
      { icon: "🧠", label: "診斷", text: "這是抽象哲學病加百科全書病。你不可能在高中專題裡處理這種形而上的全人類問題。" },
      { icon: "💡", label: "處方", text: "用「空→實」和「大→小」，改研究身邊學生的自我價值感、未來感或面對壓力時的意義感。" }
    ],
    severity: "moderate",
    tags: ["形而上", "超級抽象"]
  },
  {
    id: 13,
    primaryDiagnosisKey: "D",
    priorityDiagnosisKey: "D",
    acceptableDiagnosisKeys: ["C"],
    coDiagnosisKeys: ["C"],
    priorityReason: "這題也有範圍問題，但最大卡點是「更好」本身就是價值判斷，所以先救偏見。",
    question: "為什麼讀書比打電動更好？",
    diagnosis: "主觀偏見病 + 範圍膨脹",
    causes: ["大", "難"],
    cures: ["小", "易"],
    healedOptions: [
      {
        text: "本校學生讀書與娛樂時間分配型態與壓力感受之關聯",
        isCorrect: true,
        researchType: "量化",
        feedback: "精準！拿掉「比較高尚/更有用」的預設價值，轉為探討時間分配型態與壓力感受的關聯，讓題目回歸中立的科學探究。"
      },
      {
        text: "探討打電動使人墮落而讀書使人高尚的社會證據",
        isCorrect: false,
        researchType: null,
        feedback: "錯誤！這充滿價值評斷，不是研究題目。"
      }
    ],
    explanation: [
      { icon: "👁️", label: "觀察", text: "「更好」是價值判斷，題目一開始就偏向某種道德答案。" },
      { icon: "🧠", label: "診斷", text: "這是主觀偏見病，也有範圍過大的問題。研究不應先宣判誰比較高尚。" },
      { icon: "💡", label: "處方", text: "用「難→易」和「大→小」，改成探討讀書與娛樂時間安排的滿意度或相關的主觀感受。" }
    ],
    severity: "moderate",
    tags: ["主觀評價", "價值預設"]
  },
  {
    id: 14,
    primaryDiagnosisKey: "C",
    priorityDiagnosisKey: "C",
    acceptableDiagnosisKeys: ["D"],
    coDiagnosisKeys: ["D"],
    priorityReason: "題目又大又主觀，但若不先把「台灣的教育制度」縮到一小塊，後面無法研究，所以先救「大」。",
    question: "台灣的教育制度好不好？",
    diagnosis: "百科全書病 + 主觀偏見病",
    causes: ["大", "難"],
    cures: ["小", "易"],
    healedOptions: [
      {
        text: "本校學生對現行108課綱學習歷程檔案製作的困難度認知與看法",
        isCorrect: true,
        researchType: "量化",
        feedback: "正確！你把整個教育制度縮到學生真正在經驗的一部分。"
      },
      {
        text: "對比台灣與芬蘭教育制度的成敗優劣",
        isCorrect: false,
        researchType: null,
        feedback: "錯誤！範圍還是太大，最後只會變成評論或資料整理。"
      }
    ],
    explanation: [
      { icon: "👁️", label: "觀察", text: "「台灣的教育制度」範圍太大，「好不好」又過於主觀。" },
      { icon: "🧠", label: "診斷", text: "這是百科全書病加主觀偏見病。你不可能在一個高中專題裡裁決整個教育制度的成敗。" },
      { icon: "💡", label: "處方", text: "用「大→小」和「難→易」，聚焦到學生真正有經驗的一部分，例如學習歷程、課程安排或選修制度。" }
    ],
    severity: "moderate",
    tags: ["過於龐大", "缺乏客觀指標"]
  },
  {
    id: 15,
    primaryDiagnosisKey: "F",
    priorityDiagnosisKey: "F",
    acceptableDiagnosisKeys: ["C"],
    coDiagnosisKeys: ["C"],
    priorityReason: "創新可以研究，但賈伯斯根本無法訪談；對象不可接觸是最先要處理的問題。",
    question: "訪談賈伯斯的創新理念",
    diagnosis: "觀落陰病 + 百科全書病",
    causes: ["遠", "大"],
    cures: ["近", "小"],
    healedOptions: [
      {
        text: "訪談校內曾獲全國科展優等的學長姐之專題發想與突破歷程",
        isCorrect: true,
        researchType: "質性",
        feedback: "正解！你保留了創新主題，但改成可接觸、可訪談的對象。"
      },
      {
        text: "閱讀並整理賈伯斯傳記中的十大創新法則",
        isCorrect: false,
        researchType: null,
        feedback: "錯誤！這雖可做成整理報告，但偏離了原本想做訪談研究的方向。"
      }
    ],
    explanation: [
      { icon: "👁️", label: "觀察", text: "研究對象是賈伯斯，但你根本無法訪談他。" },
      { icon: "🧠", label: "診斷", text: "這是觀落陰病，也帶有一點百科全書病。問題不在創新不能研究，而在你選了不可能接觸的對象。" },
      { icon: "💡", label: "處方", text: "用「遠→近」和「大→小」，改找校內或周邊有創新經驗的人，如學長姐、老師或社團幹部。" }
    ],
    severity: "moderate",
    tags: ["接觸不到", "太大咖"]
  },
  {
    id: 16,
    primaryDiagnosisKey: "D",
    priorityDiagnosisKey: "D",
    acceptableDiagnosisKeys: ["C"],
    coDiagnosisKeys: ["C"],
    priorityReason: "這題也有範圍膨脹，但「都不專心」先下判斷且帶誇大，是更先卡住研究中立性的病灶。",
    question: "為什麼高中生上課都不專心？",
    diagnosis: "範圍膨脹 + 主觀偏見病",
    causes: ["大", "難"],
    cures: ["小", "易"],
    healedOptions: [
      {
        text: "本校高一生在下午第一節課的專注力自評分數與前晚睡眠時數之關聯",
        isCorrect: true,
        researchType: "量化",
        feedback: "很好！你把範圍縮小，也把偏見改成可量化的專注力自評。"
      },
      {
        text: "探討智慧型手機普及如何摧毀高中生的專注力",
        isCorrect: false,
        researchType: null,
        feedback: "錯誤！這仍然帶有強烈預設與情緒字眼。"
      }
    ],
    explanation: [
      { icon: "👁️", label: "觀察", text: "「都不專心」過度誇大，而且把全體高中生一概而論。" },
      { icon: "🧠", label: "診斷", text: "這是主觀偏見病和百科全書病。範圍太大又先下判斷，研究很容易失焦。" },
      { icon: "💡", label: "處方", text: "用「大→小」和「難→易」，縮到本校、某時段或某節課，再改成專注力自評或可觀察表現。" }
    ],
    severity: "moderate",
    tags: ["預設立場", "過度誇大"]
  },
  {
    id: 17,
    primaryDiagnosisKey: "A",
    priorityDiagnosisKey: "A",
    acceptableDiagnosisKeys: ["D"],
    coDiagnosisKeys: ["D"],
    priorityReason: "題目隱含「壓力特別大」這種比較基準不清的偏見，但最核心還是「壓力」太抽象，不先轉成具體指標或經驗，就無法研究。",
    question: "為什麼段考週壓力特別大？",
    diagnosis: "抽象哲學病 + 主觀偏見病",
    causes: ["空", "難"],
    cures: ["實", "易"],
    healedOptions: [
      {
        text: "本校高二生在段考前一週的具體焦慮症狀（如失眠、生病）發生頻率統計",
        isCorrect: true,
        researchType: "量化",
        feedback: "正確！你把抽象的壓力改成可記錄的焦慮症狀頻率。另一條路也走得通：也可以改做焦點團體訪談，直接蒐集段考壓力經驗。"
      },
      {
        text: "焦點團體訪談高二生描述段考壓力來源與因應方式",
        isCorrect: true,
        researchType: "質性",
        feedback: "正確！這題原本就在問「為什麼」，用焦點團體訪談來蒐集壓力經驗很合理。另一條路也走得通：也可以改成焦慮症狀的量化統計。"
      },
      {
        text: "段考制度是不是台灣教育最大的毒瘤？",
        isCorrect: false,
        researchType: null,
        feedback: "錯誤！這只是情緒化指控，沒有變成可研究的題目。"
      }
    ],
    explanation: [
      { icon: "👁️", label: "觀察", text: "「壓力特別大」很模糊，也缺少具體指標。" },
      { icon: "🧠", label: "診斷", text: "這是抽象哲學病加主觀偏見病。若不先定義壓力，你就無法決定要怎麼蒐集資料。" },
      { icon: "💡", label: "處方", text: "用「空→實」和「難→易」，把壓力改成睡眠、焦慮症狀、量表分數，或改做壓力經驗的訪談分析。" }
    ],
    severity: "moderate",
    tags: ["抽象", "難以驗證"]
  },
  {
    id: 18,
    primaryDiagnosisKey: "D",
    priorityDiagnosisKey: "D",
    acceptableDiagnosisKeys: ["C"],
    coDiagnosisKeys: ["C"],
    priorityReason: "這題不是先處理範圍，而是先把「很無聊」這種情緒性評語轉掉，否則研究一開始就偏掉。",
    question: "為什麼有些老師上課很無聊？",
    diagnosis: "主觀偏見病 + 範圍膨脹",
    causes: ["難", "大"],
    cures: ["易", "小"],
    healedOptions: [
      {
        text: "本校學生對不同教學法（如講述法、分組討論）的主觀專注度評分與偏好",
        isCorrect: true,
        researchType: "量化",
        feedback: "正確！你把「無聊」改成對不同教學法的專注度與偏好。另一條路也走得通：也可以改做學生課堂投入經驗的訪談。"
      },
      {
        text: "訪談10位學生對「最投入課堂」與「最難專心課堂」的具體描述比較",
        isCorrect: true,
        researchType: "質性",
        feedback: "正確！這題原本就在問原因，改做訪談可以直接看見學生如何描述投入與分心。另一條路也走得通：也可以量化不同教學法的專注度評分。"
      },
      {
        text: "探討資深教師不願更新教學簡報的心理原因",
        isCorrect: false,
        researchType: null,
        feedback: "錯誤！這不只帶偏見，還對老師貼標籤。"
      }
    ],
    explanation: [
      { icon: "👁️", label: "觀察", text: "「很無聊」是情緒性評語，而且研究對象也很模糊。" },
      { icon: "🧠", label: "診斷", text: "這是主觀偏見病，也帶有範圍過大的問題。你不是在做抱怨板，而是在做研究。" },
      { icon: "💡", label: "處方", text: "用「難→易」和「大→小」，改研究學生對不同教學活動的專注度、投入感或偏好。" }
    ],
    severity: "moderate",
    tags: ["主觀評論", "情緒攻擊"]
  },
  {
    id: 19,
    primaryDiagnosisKey: "D",
    priorityDiagnosisKey: "D",
    acceptableDiagnosisKeys: ["A"],
    coDiagnosisKeys: ["A"],
    priorityReason: "「不愛」是心理推測，比抽象更先卡住，因為你先替同學下了動機判斷，所以先救偏見。",
    question: "為什麼班上同學不愛運動？",
    diagnosis: "主觀偏見病 + 抽象哲學",
    causes: ["難", "空"],
    cures: ["易", "實"],
    healedOptions: [
      {
        text: "本班同學每週課後參與體育活動的總時數與阻礙因素調查",
        isCorrect: true,
        researchType: "量化",
        feedback: "漂亮！你把心理推測改成可觀察的運動時數與阻礙因素。另一條路也走得通：也可以用訪談深入了解個人經驗。"
      },
      {
        text: "訪談本班同學對參與課後運動的實際阻礙與個人經驗",
        isCorrect: true,
        researchType: "質性",
        feedback: "正確！這題原本就在問原因，用訪談蒐集個人經驗非常合理。另一條路也走得通：也可以量化每週運動時數與阻礙因素。"
      },
      {
        text: "探討網路成癮與懶惰如何導致班上同學體能衰退",
        isCorrect: false,
        researchType: null,
        feedback: "錯誤！你直接把原因寫死，而且還貼上負面標籤。"
      }
    ],
    explanation: [
      { icon: "👁️", label: "觀察", text: "「不愛運動」是心理推測，沒有清楚行為指標。" },
      { icon: "🧠", label: "診斷", text: "這是主觀偏見病加抽象哲學病。你不能直接讀心，只能研究可觀察的行為與可描述的經驗。" },
      { icon: "💡", label: "處方", text: "用「空→實」和「難→易」，改成每週運動時數、參與頻率、阻礙因素，或訪談學生的實際運動經驗。" }
    ],
    severity: "moderate",
    tags: ["心理推斷", "缺乏客觀"]
  },
  {
    id: 20,
    primaryDiagnosisKey: "C",
    priorityDiagnosisKey: "C",
    acceptableDiagnosisKeys: ["A"],
    coDiagnosisKeys: ["A"],
    priorityReason: "「成效」很抽象，但若不先把社團、活動、情境縮到單一場域，題目根本無法落地，所以先救「大」。",
    question: "為什麼社團活動常常辦不出成效？",
    diagnosis: "百科全書病 + 抽象哲學",
    causes: ["大", "空"],
    cures: ["小", "實"],
    healedOptions: [
      {
        text: "本校吉他社幹部對期末成果發表會籌備過程中所遇困難的訪談分析",
        isCorrect: true,
        researchType: "質性",
        feedback: "很好！你把範圍縮到單一社團、單一活動，終於可以真的做了。"
      },
      {
        text: "台灣高中生缺乏領導力如何導致社團沒落",
        isCorrect: false,
        researchType: null,
        feedback: "錯誤！這題仍然太大，而且帶著強烈預設。"
      }
    ],
    explanation: [
      { icon: "👁️", label: "觀察", text: "「社團活動」太大，「成效」太抽象。" },
      { icon: "🧠", label: "診斷", text: "這是百科全書病加抽象哲學病。你若不先定義哪個社團、哪個活動、什麼叫成效，就無法研究。" },
      { icon: "💡", label: "處方", text: "用「大→小」和「空→實」，聚焦單一社團、單一活動，改研究籌備困難、參與度或成果呈現。" }
    ],
    severity: "moderate",
    tags: ["定義鬆散", "涵蓋過廣"]
  },

  // 🔴 紅卡（魔王病歷）
  {
    id: 21,
    primaryDiagnosisKey: "H",
    priorityDiagnosisKey: "H",
    acceptableDiagnosisKeys: ["B"],
    coDiagnosisKeys: ["B"],
    priorityReason: "這題也帶未來／遠距時間跨度，但最大問題是因果鏈太長、干擾變項太多，先救變因失控。",
    question: "早餐對人生成就的影響",
    diagnosis: "變因失控 + 算命占卜病",
    causes: ["難", "遠"],
    cures: ["易", "近"],
    healedOptions: [
      {
        text: "本班同學早餐習慣與第一節課專注力量表分數之關聯",
        isCorrect: true,
        researchType: "量化",
        feedback: "成功急救！你把長期又遙遠的影響，改成短期可觀察的專注力關聯，避免了過度推論因果。"
      },
      {
        text: "追蹤三十名成功企業家早年是否天天吃早餐",
        isCorrect: false,
        researchType: null,
        feedback: "錯誤！你不可能接觸到這些對象，也無法證明因果。"
      }
    ],
    explanation: [
      { icon: "👁️", label: "觀察", text: "「人生成就」時間跨度太長，而且受太多因素影響。" },
      { icon: "🧠", label: "診斷", text: "這是變因失控病加算命占卜病。你不可能追蹤一個人一生，也不能把成就單純歸因於早餐。" },
      { icon: "💡", label: "處方", text: "用「難→易」和「遠→近」，改成早餐與當天精神、第一節課專注或短期測驗表現的關聯。" }
    ],
    severity: "boss",
    tags: ["變因失控", "遙不可及"]
  },
  {
    id: 22,
    primaryDiagnosisKey: "G",
    priorityDiagnosisKey: "G",
    acceptableDiagnosisKeys: ["A"],
    coDiagnosisKeys: ["A"],
    priorityReason: "核心不是範圍或語氣，而是目前研究方法根本無法直接驗證「靈魂是否存在」，所以先判方法無效。",
    question: "靈魂到底存不存在？",
    diagnosis: "方法無效病 + 算命占卜病(形而上)",
    causes: ["難", "遠"],
    cures: ["易", "近"],
    healedOptions: [
      {
        text: "本校學生對超自然現象的相信程度與面對大型考試焦慮感的相關性",
        isCorrect: true,
        researchType: "量化",
        feedback: "漂亮！你不再試圖證明靈魂存不存在，而是改研究人對這類信念的看法與心理感受。"
      },
      {
        text: "從量子力學角度探討意識脫離肉體獨立存在的可能性",
        isCorrect: false,
        researchType: null,
        feedback: "錯誤！這完全超出高中生可驗證的研究範圍。"
      }
    ],
    explanation: [
      { icon: "👁️", label: "觀察", text: "「靈魂」是形而上的概念，沒有可直接驗證的方法。" },
      { icon: "🧠", label: "診斷", text: "這是方法無效病，也帶有抽象哲學病。不是你不努力，而是目前研究方法根本無法直接證明。" },
      { icon: "💡", label: "處方", text: "用「難→易」和「遠→近」，改研究人們對超自然現象的相信程度，或這類信念與焦慮感的關聯。" }
    ],
    severity: "boss",
    tags: ["無法驗證", "形而上"]
  },
  {
    id: 23,
    primaryDiagnosisKey: "C",
    priorityDiagnosisKey: "C",
    acceptableDiagnosisKeys: ["A"],
    coDiagnosisKeys: ["A"],
    priorityReason: "這題同時大又空，但若不先限縮手機使用情境與成績種類，後面無法操作，所以本關先救「大」。",
    question: "手機使用對學業成績的影響",
    diagnosis: "百科全書病 + 抽象哲學",
    causes: ["大", "空"],
    cures: ["小", "實"],
    healedOptions: [
      {
        text: "本校高一生睡前使用手機時數與隔週英文單字小考成績的相關性探討",
        isCorrect: true,
        researchType: "量化",
        feedback: "很精準！你把手機使用與學業成績都限縮成可操作的具體指標。"
      },
      {
        text: "探究手機藍光如何潛移默化破壞青少年的大腦記憶區",
        isCorrect: false,
        researchType: null,
        feedback: "錯誤！這已經變成高階醫學研究，不是高中生能做的專題。"
      }
    ],
    explanation: [
      { icon: "👁️", label: "觀察", text: "「手機使用」太籠統，「學業成績」也太大，不知道要量哪一種使用，也不知道要看哪一種成績。" },
      { icon: "🧠", label: "診斷", text: "這是百科全書病加抽象不具體。你若不先限縮，研究就會變成什麼都沾一點、什麼都講不清楚。" },
      { icon: "💡", label: "處方", text: "用「大→小」和「空→實」，把手機使用限縮到睡前、短影音、遊戲等情境，把成績限縮到某次小考或某科表現。" }
    ],
    severity: "boss",
    tags: ["範圍太大", "定義模糊"]
  },
  {
    id: 24,
    primaryDiagnosisKey: "A",
    priorityDiagnosisKey: "A",
    acceptableDiagnosisKeys: ["C", "H"],
    coDiagnosisKeys: ["C", "H"],
    priorityReason: "這題也大、也難，但「變笨」本身過於模糊且帶價值判斷，不先把它轉成可測量表現，後面根本沒法研究。",
    question: "滑手機會不會讓人變笨？",
    diagnosis: "多重器官衰竭：大 + 空 + 難",
    causes: ["大", "空", "難"],
    cures: ["小", "實", "易"],
    healedOptions: [
      {
        text: "本班同學每日使用短影音平台時數與長閱讀理解測驗成績之相關分析",
        isCorrect: true,
        researchType: "量化",
        feedback: "華麗急救！你把『滑手機』縮到短影音，把『變笨』改成閱讀理解測驗，終於能研究了。"
      },
      {
        text: "解析抖音等短影音平台降低人類智商的全球趨勢",
        isCorrect: false,
        researchType: null,
        feedback: "錯誤！這題仍然大到不可做，也沒有可驗證的方法。"
      }
    ],
    explanation: [
      { icon: "👁️", label: "觀察", text: "「滑手機」很大，「變笨」很模糊，而且帶有價值判斷。" },
      { icon: "🧠", label: "診斷", text: "這是一題複合重症。你若直接問，最後不是在罵人，就是在做無法驗證的因果推論。" },
      { icon: "💡", label: "處方", text: "用「大→小」「空→實」「難→易」，限縮到特定平台或情境，再把變笨改成閱讀理解、記憶測驗或專注表現。" }
    ],
    severity: "boss",
    tags: ["超級重症", "模糊且偏見"]
  },
  {
    id: 25,
    primaryDiagnosisKey: "E",
    priorityDiagnosisKey: "E",
    acceptableDiagnosisKeys: ["C"],
    coDiagnosisKeys: ["C"],
    priorityReason: "這題同時範圍大，但最大的教學卡點是「有沒有用」讓它停在是非問法，所以本關先救問法。",
    question: "補習到底有沒有用？",
    diagnosis: "百科全書病 + 是非廢話病",
    causes: ["大", "空"],
    cures: ["小", "實"],
    healedOptions: [
      {
        text: "本校高二學生補習參與時數與自評數學學習信心之關聯",
        isCorrect: true,
        researchType: "量化",
        feedback: "正確！把『有沒有用』具體化為可測量的『學習信心』，讓『有用』不再狹隘地只等於成績。"
      },
      {
        text: "高中生補習文化之探討",
        isCorrect: false,
        researchType: null,
        feedback: "錯誤！這變成範圍太大的社會評論，缺乏具體可以測量或訪談的變數。"
      }
    ],
    explanation: [
      { icon: "👁️", label: "觀察", text: "「有沒有用」是模糊的是非題，而且補習形式也很多。" },
      { icon: "🧠", label: "診斷", text: "這是百科全書病加是非廢話病。你若不先縮小對象與指標，最後很難得出有研究價值的結果。" },
      { icon: "💡", label: "處方", text: "用「大→小」和「空→實」，改成某年級、某科補習時數與成績變化或自我感受之間的關聯。" }
    ],
    severity: "boss",
    tags: ["封閉是否", "無效大哉問"]
  },
  {
    id: 26,
    primaryDiagnosisKey: "H",
    priorityDiagnosisKey: "H",
    acceptableDiagnosisKeys: ["E"],
    coDiagnosisKeys: ["E"],
    priorityReason: "題目也有是非問法，但更核心的是試圖直接證明戀愛造成成績變化，變因太多，高中生難以處理。",
    question: "高中生談戀愛會不會影響成績？",
    diagnosis: "變因失控 + 是非廢話",
    causes: ["大", "空", "難"],
    cures: ["小", "實", "易"],
    healedOptions: [
      {
        text: "本校高二生對班對現象的接受度與對班級讀書風氣的主觀感受差異",
        isCorrect: true,
        researchType: "量化",
        feedback: "很好！你避開了難以證明的因果，改成可調查的接受度與班級風氣感受。另一條路也走得通：也可以改做有經驗者的訪談。"
      },
      {
        text: "訪談有班對經驗的同學描述其對學習習慣影響的親身感受",
        isCorrect: true,
        researchType: "質性",
        feedback: "正確！這題原本就在問影響，用訪談蒐集當事人的經驗描述很合理。另一條路也走得通：也可以改成班對接受度與讀書風氣的量化調查。"
      },
      {
        text: "追蹤二十對高中情侶三年來的成績起伏變化",
        isCorrect: false,
        researchType: null,
        feedback: "錯誤！這牽涉隱私、追蹤困難，變因也幾乎無法控制。"
      }
    ],
    explanation: [
      { icon: "👁️", label: "觀察", text: "「會不會影響」是因果式問法，但成績其實受很多因素影響。" },
      { icon: "🧠", label: "診斷", text: "這是變因失控病加是非廢話病。高中生很難直接證明戀愛造成成績變化。" },
      { icon: "💡", label: "處方", text: "用「難→易」和「空→實」，避開直接因果，改研究同學看法、班級風氣，或有經驗者對學習習慣改變的描述。" }
    ],
    severity: "boss",
    tags: ["變因太多", "涉及隱私"]
  },
  {
    id: 27,
    primaryDiagnosisKey: "A",
    priorityDiagnosisKey: "A",
    acceptableDiagnosisKeys: ["C"],
    coDiagnosisKeys: ["C"],
    priorityReason: "平台範圍也大，但更核心的是「焦慮」若不先轉成具體量表或指標，就無法操作，因此本關先救「空」。",
    question: "IG / 抖音讓高中生焦慮嗎？",
    diagnosis: "百科全書病 + 抽象哲學",
    causes: ["大", "空"],
    cures: ["小", "實"],
    healedOptions: [
      {
        text: "本校高一生每日使用IG探索頁面的時數與其外貌焦慮量表得分之相關性",
        isCorrect: true,
        researchType: "量化",
        feedback: "很精準！你把平台使用方式與焦慮都限縮到可測量的範圍。"
      },
      {
        text: "探討社群媒體母公司演算法蓄意製造青少年焦慮的商業陰謀",
        isCorrect: false,
        researchType: null,
        feedback: "錯誤！這變成你碰不到的陰謀論題目了。"
      }
    ],
    explanation: [
      { icon: "👁️", label: "觀察", text: "「IG / 抖音」範圍太廣，「焦慮」也太抽象。" },
      { icon: "🧠", label: "診斷", text: "這是百科全書病加抽象哲學病。你若不先限縮平台使用方式與焦慮指標，就很難操作。" },
      { icon: "💡", label: "處方", text: "用「大→小」和「空→實」，聚焦到探索頁面、短影音使用時數，再搭配明確量表，如外貌焦慮或社交焦慮。" }
    ],
    severity: "boss",
    tags: ["範圍太大", "概念模糊"]
  },
  {
    id: 28,
    primaryDiagnosisKey: "G",
    priorityDiagnosisKey: "G",
    acceptableDiagnosisKeys: ["F"],
    coDiagnosisKeys: ["F"],
    priorityReason: "「天生」預設原因在先天機制，而這種原因目前無法直接驗證；與其追先天，不如研究可觀察行為。",
    question: "為什麼有些同學天生就比較會讀書？",
    diagnosis: "方法無效病 + 觀落陰病",
    causes: ["遠", "難"],
    cures: ["近", "易"],
    healedOptions: [
      {
        text: "本校校排前10%學生之讀書計畫執行率與課後作息模式調查",
        isCorrect: true,
        researchType: "量化",
        feedback: "正確！你不再追先天原因，而是研究高分同學可觀察的學習行為。另一條路也走得通：也可以用深度訪談看見策略形成歷程。"
      },
      {
        text: "深度訪談5位高分同學描述學習策略形成歷程與關鍵轉折",
        isCorrect: true,
        researchType: "質性",
        feedback: "正確！這題原本就在問為什麼，有些時候用深度訪談比量表更能看見學習策略形成的歷程。另一條路也走得通：也可以量化讀書計畫執行率與作息模式。"
      },
      {
        text: "從人類基因圖譜中尋找智商與學習能力的決定性序列",
        isCorrect: false,
        researchType: null,
        feedback: "錯誤！這完全超出高中生的設備與方法能力。"
      }
    ],
    explanation: [
      { icon: "👁️", label: "觀察", text: "「天生」等於預設原因在先天，但這種原因你無法直接驗證。" },
      { icon: "🧠", label: "診斷", text: "這是方法無效病，也帶有一點觀落陰感。你碰不到基因與先天機制，只能研究眼前可觀察的行為。" },
      { icon: "💡", label: "處方", text: "用「難→易」和「遠→近」，改研究身邊高分同學的學習習慣、讀書策略、作息模式與經驗歷程。" }
    ],
    severity: "boss",
    tags: ["實驗無效", "設備不足"]
  },
  {
    id: 29,
    primaryDiagnosisKey: "F",
    priorityDiagnosisKey: "F",
    acceptableDiagnosisKeys: ["G"],
    coDiagnosisKeys: ["G"],
    priorityReason: "最大問題是研究對象根本碰不到，所以先判觀落陰；方法可行性差是共病。",
    question: "訪談現任總統對教育改革的看法",
    diagnosis: "觀落陰病 + 方法無效",
    causes: ["遠", "難"],
    cures: ["近", "易"],
    healedOptions: [
      {
        text: "訪談本校校長對108課綱推動三年來的校內實施成效與反思",
        isCorrect: true,
        researchType: "質性",
        feedback: "神救場！你把遙不可及的大人物換成可接觸、又具代表性的校內角色。"
      },
      {
        text: "寫信給教育部長要求說明台灣未來十年的教改藍圖",
        isCorrect: false,
        researchType: null,
        feedback: "錯誤！這仍然是把研究對象設成你碰不到的人。"
      }
    ],
    explanation: [
      { icon: "👁️", label: "觀察", text: "題目把研究對象設成現任總統，但這個受訪者幾乎無法接觸。" },
      { icon: "🧠", label: "診斷", text: "這是觀落陰病，也有方法可行性問題。不是教育改革不能研究，而是你找錯了研究對象。" },
      { icon: "💡", label: "處方", text: "用「遠→近」和「難→易」，改成可接觸且與教育制度有實際關聯的人，如校長、主任、教師或學生幹部。" }
    ],
    severity: "boss",
    tags: ["絕對接觸不到", "目標太大"]
  },
  {
    id: 30,
    primaryDiagnosisKey: "G",
    priorityDiagnosisKey: "G",
    acceptableDiagnosisKeys: ["H"],
    coDiagnosisKeys: ["H"],
    priorityReason: "題目也有變因失控，但更根本的是你無法直接研究先天智力來源，所以先判方法無效。",
    question: "為什麼有些人天生就比較聰明？",
    diagnosis: "變因失控 + 方法無效病",
    causes: ["大", "難"],
    cures: ["小", "易"],
    healedOptions: [
      {
        text: "本校高分群與一般學生在讀書習慣、作息與自評學習策略上的差異",
        isCorrect: true,
        researchType: "量化",
        feedback: "很順！把無法驗證的「天生智力」，轉化成比較「高分群與一般學生在作息與學習策略上的差異」，保留了想探究『為何表現好』的初衷。"
      },
      {
        text: "解析微積分滿分學生腦部神經元的活躍度差異",
        isCorrect: false,
        researchType: null,
        feedback: "錯誤！你沒有核磁共振設備，也無法做這種腦神經研究。"
      }
    ],
    explanation: [
      { icon: "👁️", label: "觀察", text: "「天生」預設答案在先天因素，而「聰明」本身也很模糊，可能指成績、理解力、記憶力或解題速度。" },
      { icon: "🧠", label: "診斷", text: "這是變因失控病加方法無效病。高中生無法研究基因如何決定聰明，也很難控制家庭、環境與努力程度等眾多變因。" },
      { icon: "💡", label: "處方", text: "用「難→易」和「大→小」，不要研究先天智力，而改研究可觀察的後天因素，例如讀書習慣、家庭教育參與或學習動機。" }
    ],
    severity: "boss",
    tags: ["變因失控", "高中生無法做"]
  }
];
