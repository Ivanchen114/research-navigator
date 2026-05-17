# W1 紙上 migration（三模式＋投影架構）

> Phase 1 產出。依《三模式架構_實作spec.md》＋《網站定位與設計原則.md》。**這是規劃，不寫 code。**
> W1-W8 批次的第一頁。W13/W14/W15 已遷移；投影支援大多由共用元件免費跟著來。

---

## 0. W1 現況速覽

`W1Page.jsx`（647 行，比分析叢集三頁短）。結構：TOP BAR（含「教師流程」LessonMap toggle）→ `{showLessonMap && LessonMap}` → HeroBlock → R.I.B. 說明 caption → CourseArc(`W1Data.courseArc`) → TaskCard → `StepEngine`（5 Step）。

**StepEngine 後面什麼都沒有**——W1 沒有 ResearcherRedlines、沒有 TrapRewritePractice 之類的飄移元件，StepEngine 是 return 的最後一個東西。遷移比 W13/W14/W15 單純。

5 個 Step：① 暖身 ② 模仿遊戲 ③ AI-RED 公約 ④ 課堂活動 ⑤ 回顧與繳交。

**W1 是活動週、不是閱讀週**——大部分內容是「活動素材＋核心概念」，真正的「深度補充」很少（見 §3）。這是誠實的盤點結果，不是漏做：W1 的三模式價值主要來自第一屏三句、RecordDrawer、自學補課路線，不是靠 DepthBlock 收合。

**W1 不讀任何前週 dataKey**（它是第一個內容週）。**W1 寫 `w1-life-observe`，W2 會讀**——跨週命脈。

---

## 1. selfStudyStatus：`partial`

可自學：模仿遊戲（7 份自述找 AI）、AI-RED 五字、簽公約、看現場示範說明、寫生活觀察種子。
需真人：模仿遊戲的小組討論、Step 4 老師現場人機協作示範是課堂活動。

### 自學補課路線（自學模式頂部固定顯示）
```
① 先看：Step 2 模仿遊戲（7 份自述）＋ Step 3 AI-RED 五字與人機分工
② 做：Step 2 寫推理理由、Step 3 簽 AI-RED 公約、Step 4 讀現場示範說明、Step 5 寫生活觀察種子
③ 補紀錄：研究經驗／模仿遊戲推理＋揭曉反應／AI-RED 公約簽署／人機協作觀察／對自己的期許／生活觀察種子
④ 交：複製 W1 學習紀錄貼到 Google Classroom
⑤ 需要找人：模仿遊戲的小組討論、Step 4 老師現場人機協作示範是課堂活動，自學看頁面說明補
```

### 最低完成版（缺課學生：至少做到這些才算補到核心）
```
① 完成模仿遊戲推理（選號＋理由）
② 簽署 AI-RED 公約（A/I/R/E/D 五字各選一條承諾＋簽名）
③ 寫生活觀察種子（W2 一進教室就要用，必填）
④ 複製 W1 學習紀錄貼到 Classroom
```

---

## 2. 第一屏三句（套 spec §6-1 字數規格）

```
今天做什麼：找出 7 份自述裡的 AI 偽裝者，簽下 AI-RED 誠信公約。           （24 字 ✓）
為什麼做：　AI 時代你交出的東西要「真的是你做的」，這是 18 週研究的地基。    （28 字 ✓）
今天交什麼：複製 W1 學習紀錄貼到 Classroom（含 AI-RED 公約簽署）。         （1 項，W1 無小組成果 ✓）
```
（現有 HeroBlock 的 subtitle/chain/meta＋R.I.B. caption 偏長，第一屏只留三句，其餘下放 DepthBlock「延伸補充」。）

---

## 3. 逐 Step 四分類

標記：【核】核心｜【深】深度（DepthBlock）｜【記】紀錄｜【移】刪除／移出／改寫｜【選】可選

### Step 1 暖身
| 區塊 | 類 | 備註 |
|---|---|---|
| PART 0 開場卡（h3＋說明） | 核 | |
| StepBriefing | 核 | |
| ThinkRecord `w1-research-exp` | 記 | |
| 「暖身就這一題」提示卡 | 核 | 小提示，留 |

### Step 2 模仿遊戲
| 區塊 | 類 | 備註 |
|---|---|---|
| PART 1 開場卡／StepBriefing／「先自己判斷」提示 | 核 | |
| SUSPECTS 7 卡 grid | 核 | 模仿遊戲本體，活動素材 |
| ThinkRecord `w1-suspect-reason` | 記 | |
| 揭曉按鈕（按 10 下解鎖） | 核 | 互動機制，保留——本身就是「閱後即焚」式的 reveal gate |
| └ {showTruth} 答案揭曉卡＋誠實標註卡 | 核 | 已被 10-click gate 擋住，不再包 DepthBlock（雙重收合） |
| └ {showTruth} ThinkRecord `w1-imitation-reaction` | 記 | |

### Step 3 AI-RED 公約
| 區塊 | 類 | 備註 |
|---|---|---|
| PART 2 開場卡／StepBriefing | 核 | |
| AI-RED 五格（AIRED_STEPS） | 核 | 公約本體，核心概念 |
| 「人機分工」雙欄（人類負責／AI 協助） | 深 | 完整說明、老師會口頭講掉 → DepthBlock「延伸補充」 |
| 「💡 結論：人負責方向…」卡 | 核 | 人機分工的核心收束句，留在外面 |
| ThinkChoice `w1-tc1`（理解檢核） | 記 | 走 ExportButton 的 `choices` 機制，見 §7-2 |
| `SignatureBlock`（`w1-aired-pledge`） | 記 | 已自動同步進 rib_think_records，不用改 |

### Step 4 課堂活動
| 區塊 | 類 | 備註 |
|---|---|---|
| PART 3 開場卡／StepBriefing | 核 | |
| 現場示範 4 步（研究問題／填表單／Prompt 範本卡／Evaluate 揭穿） | 核 | 老師現場示範流程＝活動素材 |
| └ 第 3 步卡內的 Prompt 範本長 code block | 深 | 範例詳解 → DepthBlock「看完整範例」 |
| 30 秒 vs 18 週 轉折卡 | 核 | pedagogically key |
| 「不能外包的三件事」3 卡（品味／接觸／判斷） | 核 | W1 核心概念 |
| 收尾標語卡 | 核 | |
| ThinkRecord `w1-human-ai-observe`／`w1-self-expect` | 記 | |

### Step 5 回顧與繳交
| 區塊 | 類 | 備註 |
|---|---|---|
| StepBriefing | 核 | |
| 「✅ 本週結束你應該要會」卡 | 核 | |
| 「🌱 生活觀察種子」卡 ＋ ThinkRecord `w1-life-observe` | 核＋記 | **essential——W2 命脈，key 不能動** |
| 「📤 最後一步」複製繳交卡 | 核 | |
| `ExportButton` | 記 | 進 RecordDrawer（含 `choices` pass-through，見 §7-2） |
| 探員系統預告卡／下週預告卡 | 核 | |

### StepEngine 外
W1 沒有 StepEngine 外的飄移元件——沒有要搬移的東西。

---

## 4. DepthBlock 標題對應（用 spec §6-2 固定詞表）

| 深度區塊 | DepthBlock 標題 |
|---|---|
| HeroBlock chain/meta（下放） | 延伸補充 |
| Step 3「人機分工」雙欄 | 延伸補充 |
| Step 4 Prompt 範本長 code block | 看完整範例 |

只有 3 個——W1 是活動週，深度補充本來就少（見 §0、§9）。**不硬塞**：把活動素材、核心概念硬包進 DepthBlock 只會讓上課模式找不到東西。

---

## 5. RecordDrawer 要聚合的 dataKeys

EXPORT_FIELDS 內（8 個，扣掉硬傷 A 後可能 7 個）：`w1-research-exp`／`w1-life-observe`／`w1-suspect-reason`／`w1-imitation-reaction`／`w1-aired-pledge`／`w1-human-ai-observe`／`w1-self-expect`／**`w1-aired-record`（硬傷 A：見 §7-1，可能要移除）**

元件自帶／其他機制、**不在 RecordDrawer 欄位總覽**：
- `w1-tc1`（ThinkChoice）——存 `think-choice::w1-tc1`，透過 ExportButton 的 `choices` prop 匯出，不走 dataKey 欄位（見 §7-2）。RecordDrawer 不列為欄位，但要確保 `choices` 有傳進內部 ExportButton。

RecordDrawer 方案 A：input 全部留在原 Step，drawer 只做總覽＋匯出。dataKey 一字不改。

---

## 6. 「刪除／移出」桶

- W1 **沒有化石**（讀全檔沒看到未 render 的元件／常數；動工時仍 grep 確認一次）。
- W1 **沒有「老師巡視」框架**要改寫。
- TOP BAR 的「教師流程」LessonMap toggle——**保留**。它是 W1 既有的教師 pacing 工具，跟投影模式是不同層的東西（投影＝顯示密度，LessonMap＝流程時間表），不衝突、不刪。

W1 沒有要刪／外移的內容。

---

## 7. 硬傷與待確認（Phase 2 必處理）

### 7-1.（硬傷·待老師決定）`w1-aired-record` 在 EXPORT_FIELDS 但全頁無 input
`w1-aired-record`「AI-RED 敘事紀錄」放在 EXPORT_FIELDS（含 label、question），但全頁**沒有 AIREDNarrative、也沒有對應 ThinkRecord** 寫它——學生匯出會是空白欄。判斷題：
- **(a)** 加一個 `AIREDNarrative week="1"`：若認為 W1 學生該寫一則 AI 互動敘事。
- **(b)（建議）** 從 EXPORT_FIELDS 移除 `w1-aired-record`：W1 是入門／公約週，學生在 W1 **觀察**老師的 AI 示範（已由 `w1-human-ai-observe` 捕捉），並沒有自己跑一次 AI 互動可敘事；AIREDNarrative 的敘事練習從 W2+ 才開始。`w1-aired-record` 看起來是早期殘留的 aspirational 欄位。
建議 (b)。但這是內容判斷，請老師拍板。

### 7-2.（共用元件待補·必修）`RecordDrawer` 要支援 `choices` pass-through
W1 的 `ExportButton` 帶了 `choices={choiceResults}`——這是 ThinkChoice `w1-tc1`（理解檢核）的匯出路徑（W1 用 `trackChoice` 回呼把選擇題結果收進 `choiceResults` state，再傳給 ExportButton 的 `choices` prop，不走 dataKey/EXPORT_FIELDS）。
但目前的 `RecordDrawer` 只吃 `fields` / `extraFields`，**沒有 `choices`**——直接把 ExportButton 換成 RecordDrawer，W1 的理解檢核結果就匯不出。
Phase 2 必做：`RecordDrawer` 加一個 `choices` prop，pass-through 給它內部的 `<ExportButton>`。這是小改動，且 W2-W8 很可能也用 ThinkChoice，一次補對全批受惠。
（W13/W14/W15 的 ExportButton 都沒帶 `choices`，所以這問題到 W1 才浮現——不是回頭債，是新需求。）

### 7-3.（待確認，非必修）幾個 borderline 的「核 vs 深」判斷
讀全檔後，W1 真正的深度補充很少。以下幾塊我判為「核」、沒包 DepthBlock，但屬判斷題，老師若覺得該收合可改：
- Step 2「答案揭曉」長解說——已被 10-click reveal gate 擋著，不再加第二層收合。
- Step 4 現場示範 4 步——老師現場做的活動素材，上課模式應可見（只有卡內 Prompt 範本 code block 包進 DepthBlock）。
- Step 4「不能外包的三件事」——W1 核心概念，留在外面。

### 7-4.（化石掃描）W1 看起來乾淨
讀全檔沒看到 RouteSelector 等級的化石。Phase 2 動工時仍 grep 一次確認 import 沒有孤兒。

### 7-5.（投影）W1 沒有 `<details>`
讀全檔沒有 `<details>` 元素，投影降密度全靠 DepthBlock + 共用元件。Phase 2 grep 一次 `<details` 確認。

---

## 8. Phase 2 動工清單（11 項）

```
1.  （待老師定）w1-aired-record 處理：移除 or 加 AIREDNarrative（硬傷 A，§7-1）
2.  RecordDrawer 加 choices pass-through（共用元件，§7-2）——必修
3.  化石掃描：grep 確認 import 無孤兒、無 <details>（W1 應該乾淨）
4.  ModeProvider + useMode + useProjector 拆 W1PageContent + ModeSwitch
5.  HeroBlock 第一屏只留三句（§2，todo prop）
6.  DepthBlock 包深度區塊（標題照 §4：人機分工雙欄、Prompt 範本、chain/meta）
7.  RecordDrawer 聚合總覽與匯出（含 choices={choiceResults}），input 留 Step
8.  ExportButton → RecordDrawer + 繳交提醒（W1 Step 5）
9.  selfStudyStatus: partial + 自學補課路線 + 最低完成版（加進 lessonMaps W1Data）
10. 投影降密度：W1 無 <details>，靠 DepthBlock + 共用元件即可
11. build 驗證 + grep dataKey 0 斷鏈（特別確認 w1-life-observe 跨週給 W2）+ 三情境測試
```
常數抽離（SUSPECTS／AIRED_STEPS／EXPORT_FIELDS）→ Phase 6，這次不做。

---

## 9. 與 W13/W14/W15 的差異速記（實作時注意）

- W1 **StepEngine 後面沒有飄移元件**——沒有 TrapRewritePractice／ResearcherRedlines 要搬，遷移最單純的一頁。
- W1 **深度補充極少**（只 3 個 DepthBlock）——它是活動週不是閱讀週。**不要為了湊數硬包 DepthBlock**。
- W1 **多一個 TOP BAR 的「教師流程」LessonMap toggle**——保留，別誤刪。
- W1 **不讀任何前週 dataKey**（第一個內容週）；但 **寫 `w1-life-observe`，W2 讀**——這個 key 一字不能動。
- W1 **用 ExportButton 的 `choices` prop**（W13/14/15 都沒用）——所以這次必須先補 `RecordDrawer` 的 `choices` pass-through（§7-2），這是 W1-W8 批次的共用前置。
- W1 **沒有 ResearcherRedlines**——投影短版那塊不適用。
- W1 的硬傷比 W15 單純：只有 `w1-aired-record` 一個孤兒欄位，且 SignatureBlock（公約簽署）已經寫得很好、不用修。

---

*建立：2026-05-15 ｜ Phase 1 產出，待授課老師審後進 Phase 2*
