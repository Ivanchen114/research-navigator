# W4 紙上 migration（三模式＋投影架構）

> Phase 1 產出。依《三模式架構_實作spec.md》＋《網站定位與設計原則.md》。**這是規劃，不寫 code。**
> W1-W8 批次第四頁。W1/W2/W3/W13/W14/W15 已遷移。

---

## 0. W4 現況速覽

`W4Page.jsx`（1290 行）。結構：TOP BAR（含「教師流程」LessonMap toggle）→ `{showLessonMap && LessonMap}` → HeroBlock → CourseArc(`W4Data.courseArc`) → TaskCard → `StepEngine`（5 Step，`flat`）。

**StepEngine 後面什麼都沒有**——沒有飄移元件。

5 個 Step：① 五種方法＋兩層判斷 ② 方法判斷測驗 ③ 為自己題目選路 ④ 反思 ⑤ 回顧與繳交。

**內部元件**：`DecisionTree`（互動決策樹，大型 SVG＋自帶 state `l1Choice`/`l2Picks`，Step 1 render）——**transient 互動工具，不寫 localStorage，無轉接問題**（不像 W15 的 ThreeColumnConclusion）。共用元件 `BackfillField`（Step 3 補 `w3-final-topic`）、`LessonMap`。

**W4 沒有 AIREDNarrative**——刻意設計：本週不開放 AI 協作（Step 5 有「本週原則·不開放 AI 協作」卡明說理由），所以 W4 **沒有** `w4-aired-record` 這個 key。

**W4 乾淨**：8 個 EXPORT_FIELDS key 全部都有對應 ThinkRecord（無孤兒）；無化石常數／函式；無 `<details>`；五種方法卡與 quiz 都用 state 收合。比照 W2，是純遷移、**無硬傷**。

---

## 1. selfStudyStatus：`full`（見 §7-1、§7-2）

W4 核心是「認識方法 → 兩層判斷 → 為自己題目選定主方法 → 寫理由 → 兩題反思」，全是個人作業。互動元件（五方法卡、決策樹、10 題測驗、2 個 ThinkChoice）都自帶即時回饋，自學可獨立完成。Step 3 有一張「同儕挑戰」卡（跟旁邊的人說一遍、讓對方挑戰），但它跟同 Step 的「4 種常見誤診」自查卡是**同目的的兩條軌**——自學學生用 4 誤診卡自我壓力測試即可等價。

→ 標 `full`。**注意**：W4 設計上**不使用 AI**，所以 `full` 補課路線 ⑤ 不能套 W2/W3 的「若要完成 AI 協作段落，請使用可登入的 AI 工具」句型，要改 W4 專屬寫法（見 §7-2）。

### 自學補課路線（自學模式頂部固定顯示）
```
① 先看：Step 1 量化／質性兩種取向 ＋ 五種方法卡 ＋ 互動決策樹（兩層判斷）
② 做：Step 1 ThinkChoice 暖身、Step 2 兩層判斷 10 題測驗、Step 3 為自己 W3 定案題目選主方法、Step 4 兩題反思
③ 補紀錄：我的 W4 題目／第一層判斷／第二層判斷／主要方法／選擇理由／輔助方法／反思 1（最易搞混的方法）／反思 2（文獻 vs 文獻分析）
④ 交：整理 W4 學習紀錄，依老師指定方式上傳到 Google Classroom
⑤ 本週可完整自學——Step 3 的「同儕挑戰」沒有同學時，用同 Step 的「4 種常見誤診」卡自我檢查即可（同目的）。W4 本週設計上不使用 AI 選方法，沒有 AI-RED 要填。
```

### 最低完成版（缺課學生：至少做到這些才算補到核心）
```
① 看懂五種方法各自的目的與適用情境
② 用兩層判斷（L1 自蒐／文獻、L2 三題分流）為題目選一條路
③ Step 3：為自己 W3 定案題目選出主要方法（帶去 W5，必填）＋寫一句選擇理由
④ Step 4：寫完兩題反思
⑤ 整理 W4 紀錄上傳 Classroom
```

---

## 2. 第一屏三句（套 spec §6-1 字數規格）

```
今天做什麼：把 W3 題目放上方法地圖，用兩層判斷選定主要方法。              （24 字 ✓）
為什麼做：　題目不會自動變成資料——得先決定用哪種方法去收集。              （25 字 ✓）
今天交什麼：個人＝W4 學習紀錄（含主要方法＋選擇理由，帶去 W5）。          （1 項 ✓）
```
（現有 HeroBlock 的 subtitle/chain/meta 偏長，第一屏只留三句，其餘下放 DepthBlock「延伸補充」。）

---

## 3. 逐 Step 四分類

標記：【核】核心｜【深】深度（DepthBlock）｜【記】紀錄｜【移】刪除／移出／改寫｜【選】可選

### Step 1 五種方法＋兩層判斷
| 區塊 | 類 | 備註 |
|---|---|---|
| h2＋desc＋StepBriefing | 核 | |
| 「📍 這個 Step 是方法地圖」說明卡 | 核 | orientation，短卡 |
| 量化 vs 質性 兩種取向卡 | 核 | StepBriefing 把它列為本 Step 任務 → 留核（見 §7-5）|
| 五種方法卡（METHODS，`expandedMethod` state 自帶收合） | 核 | **不再包 DepthBlock**（雙重收合，比照 W3 CutFlowCard）|
| `<DecisionTree />`（互動決策樹 SVG） | 核 | 互動核心活動，不包 DepthBlock |
| ThinkChoice `w4-tc1` | 記 | 走 `choices` 機制 |
| 🎮 遊戲彩蛋入口卡（/game/tool-quiz，「自選遊戲」） | 深 | 中段密度＋明示自選 → DepthBlock「延伸補充」（見 §7-5）|

### Step 2 方法判斷測驗
| 區塊 | 類 | 備註 |
|---|---|---|
| h2＋desc＋StepBriefing | 核 | |
| ThinkChoice `w4-tc2`（測驗前暖身） | 記 | 走 `choices` 機制 |
| 10 題測驗（quizStarted/currentQ/selections/quizDone state＋結果頁） | 核 | 互動核心活動，自帶即時回饋 |

### Step 3 為自己題目選路
| 區塊 | 類 | 備註 |
|---|---|---|
| h2＋desc＋StepBriefing | 核 | |
| {w3Topic 帶入卡 ／ BackfillField `w3-final-topic`} | 核 | 跨週帶入，條件渲染 |
| ThinkRecord `w4-my-topic` | 記 | 從 W3 自動帶入、可微調；**跨週命脈，見 §7-3** |
| L1 第一層判斷卡＋ThinkRecord `w4-layer1` | 核＋記 | |
| L2 第二層判斷卡＋ThinkRecord `w4-layer2` | 核＋記 | |
| ThinkRecord `w4-main-method` | 記 | **跨週命脈，見 §7-3** |
| ThinkRecord `w4-reason`（含 scaffold） | 記 | |
| ThinkRecord `w4-aux-method`（含 scaffold） | 記 | |
| 「4 種常見誤診」自查卡（主治醫師巡房） | 核 | 選完方法的壓力測試，StepBriefing done 指它 |
| 同儕挑戰卡 | 核 | 短卡；自學可用 4 誤診卡替代（§1）|
| ➡️ W5 下週預告卡 | 核 | 短卡 |

### Step 4 反思
| 區塊 | 類 | 備註 |
|---|---|---|
| h2＋desc＋StepBriefing | 核 | |
| ThinkRecord `w4-reflect-confused`（含 scaffold） | 記 | |
| ThinkRecord `w4-reflect-literature`（含 scaffold） | 記 | |

### Step 5 回顧與繳交
| 區塊 | 類 | 備註 |
|---|---|---|
| StepBriefing | 核 | `task` 有「按下方複製繳交」、`done` 有「貼到 Google Classroom」框架語言 → 改中性版（§7-4）|
| 「✅ 本週結束你應該要會」檢核卡 | 核 | |
| 「本週原則·不開放 AI 協作」原則卡 | 深 | AI 使用說明 → DepthBlock「AI 使用提醒」 |
| 「📤 最後一步」複製繳交卡 | 核 | 「複製 W4 學習紀錄，貼到 Google Classroom 繳交」→ 改中性版（§7-4）|
| `ExportButton`（`buttonText="複製 W4 學習紀錄"`，含 `choices={choiceResults}`） | 記 | 進 RecordDrawer（choices pass-through 已備）；buttonText 同步改中性版 |
| 遊戲彩蛋卡（/game/tool-quiz） | 核 | 比照 W1/W2/W3 末段彩蛋卡，留核 |
| 下週預告卡（next-week-preview） | 核 | |

### StepEngine 外
W4 沒有 StepEngine 外的飄移元件——沒有要搬移的東西（同 W2/W3）。

---

## 4. DepthBlock 標題對應（用 spec §6-2 固定詞表）

| 深度區塊 | DepthBlock 標題 |
|---|---|
| HeroBlock chain/meta（下放） | 延伸補充 |
| Step 1 🎮 遊戲彩蛋入口卡 | 延伸補充 |
| Step 5 「本週原則·不開放 AI 協作」卡 | AI 使用提醒 |

3 個。**不包 DepthBlock 的**：五種方法卡（`expandedMethod` 自帶收合）、`DecisionTree`（互動核心）、10 題測驗（互動核心）、量化 vs 質性卡（StepBriefing 列為本 Step 任務，留核——見 §7-5）。W4 偏精簡，DepthBlock 不需多。

---

## 5. RecordDrawer 要聚合的 dataKeys

EXPORT_FIELDS 內（8 個，**全部都有對應 ThinkRecord，無孤兒**）：
`w4-my-topic`／`w4-layer1`／`w4-layer2`／`w4-main-method`／`w4-reason`／`w4-aux-method`／`w4-reflect-confused`／`w4-reflect-literature`

元件自帶／其他機制、**不在 RecordDrawer 欄位總覽**：
- `w4-tc1`／`w4-tc2`（ThinkChoice）——透過 ExportButton 的 `choices` prop 匯出。
- `DecisionTree` 的 `l1Choice`/`l2Picks`——transient state，不寫 localStorage，不需聚合。

W4 **沒有 RECORD_EXTRA_FIELDS**——所有 dataKey 不是在 EXPORT_FIELDS 就是走 `choices`（同 W2/W3）。

RecordDrawer 方案 A：input 全部留在原 Step，drawer 只做總覽＋匯出。dataKey 一字不改。

---

## 6. 「刪除／移出」桶

**W4 是空桶**——無化石常數／函式、無孤兒 EXPORT_FIELDS、無 `<details>`、無「老師巡視」框架語言要改寫（Step 3「主治醫師巡房」是 R.I.B. 主題比喻，卡片內容是學生自查，不是老師現場巡視指令，留著）。比照 W2，純遷移。

---

## 7. 硬傷與待確認（Phase 2 必處理）

### 7-1.（待確認）`selfStudyStatus: full` vs `partial`
W4 標 `full`。本週唯一帶「真人」味道的是 Step 3 同儕挑戰卡、以及 lessonMaps 第一節的「測驗講評」（老師挑 3 題易錯題講解）。判斷依據：同儕挑戰跟同 Step 的「4 種常見誤診」自查卡是同目的兩條軌，測驗講評則由 10 題測驗自帶的 hint＋結果頁補上——自學學生都能等價完成同一學習目標。所以判 `full`。**若老師認為「測驗講評」的現場澄清不可取代，可改 `partial`**——判斷題，建議 `full`。

### 7-2.（必處理）`full` 補課路線 ⑤ 不能套 W2/W3 句型
W2/W3 的 `full` 補課路線 ⑤ 有「若要完成 AI 協作段落，請使用你平常可登入的 AI 工具」。**W4 設計上不使用 AI、沒有 AI-RED 段落**，這句不適用。Phase 2 要用 §1 的 W4 專屬 ⑤ 寫法（同儕挑戰可用 4 誤診卡替代＋明說本週不用 AI、無 AI-RED）。

### 7-3.（跨週命脈·必守）`w4-my-topic` / `w4-main-method` 有下游讀取
- `w4-my-topic` 被 **W5（W5MeasurePage）／W6（W6PosterTeamPage）／W7（W50Page）** 讀取。
- `w4-main-method` 被 **W5／W6** 讀取。
- W4 自己讀上游的 `w3-final-topic`（auto-fill `w4-my-topic`）＋ BackfillField 也用它。
遷移**絕對不准改這三個 key**。Phase 2 build 後 grep 確認 W5/W6/W7 讀得到、`w3-final-topic` 上游鏈不斷。（`portfolioRegistry.js` 也列了全部 8 個 w4 key，key 不變即不受影響。）

### 7-4.（Classroom 用語對齊）
Step 5 的 StepBriefing（`task="檢核本週成就，按下方複製繳交。" done="貼到 Google Classroom 繳交。"`）、最後一步卡（「複製 W4 學習紀錄，貼到 Google Classroom 繳交。」）、ExportButton 的 `buttonText="複製 W4 學習紀錄"` 都還是「複製貼上」框架語言。Phase 2 一併改成中性版（「整理 W4 學習紀錄，依老師指定方式上傳到 Google Classroom」），跟 W1/W2/W3 一致。

### 7-5.（DepthBlock 判斷題）兩張卡的核／深歸類
- **Step 1 🎮 遊戲彩蛋入口卡**：建議 → 深（DepthBlock「延伸補充」）。理由：明示「自選遊戲」、中段密度大、比照 W3 把 🎮 卡下放的前例。Step 5 末段的遊戲彩蛋卡則維持核（W1/W2/W3 末段彩蛋卡都留核）。
- **Step 1 量化 vs 質性 取向卡**：建議 → 核。理由：Step 1 的 StepBriefing 把「認識量化／質性兩種取向」明列為本 Step 任務，下放會與 StepBriefing 矛盾。若老師覺得它仍偏背景知識、想降投影密度，可改深（「延伸補充」）——判斷題。

### 7-6.（投影）W4 有 0 個 `<details>`
W4 全頁無 `<details>`——五種方法卡、quiz 都用 React state 收合，DecisionTree 是 SVG 互動。投影收合只靠 DepthBlock（§4 的 3 個）＋共用元件即可，沒有 `<details>` 要換。Phase 2 grep 確認即可。

---

## 8. Phase 2 動工清單（10 項）

```
1.  ModeProvider + useMode + useProjector 拆 W4PageContent + ModeSwitch（export const W4Page = () => (<ModeProvider week="W4">…)）
2.  HeroBlock 第一屏只留三句（§2，todo prop）
3.  DepthBlock 包深度區塊（標題照 §4：HeroBlock chain/meta → 延伸補充；Step 1 🎮 卡 → 延伸補充；Step 5 不開放 AI 卡 → AI 使用提醒）
4.  RecordDrawer 聚合總覽與匯出（fields=EXPORT_FIELDS + choices={choiceResults}），input 留 Step
5.  ExportButton → RecordDrawer + 繳交提醒（W4 Step 5），buttonText 同步中性版
6.  Classroom 用語對齊：Step 5 StepBriefing + 最後一步卡 + ExportButton buttonText 改中性版（§7-4）
7.  selfStudyStatus: full + 自學補課路線（⑤ 用 W4 專屬寫法，§7-2）+ 最低完成版（加進 lessonMaps W4Data）
8.  投影降密度：靠 DepthBlock（§4 的 3 個）+ 共用元件；W4 無 <details>
9.  化石掃描：grep 確認 import 無孤兒、<details> 0 殘留、EXPORT_FIELDS 8 key 全有 input
10. build 驗證 + grep dataKey 0 斷鏈（特別確認 w4-my-topic / w4-main-method 不變、W5/W6/W7 讀得到；w3-final-topic 上游不斷）+ 三情境測試
```
常數抽離（METHODS／DECISION_TREE／QUIZ_QUESTIONS／THINK_CHOICES）→ Phase 6，這次不做。

---

## 9. 與已遷移週的差異速記（實作時注意）

- W4 **無硬傷**——8 個 EXPORT_FIELDS key 全有 input，無孤兒、無化石、無 `<details>`。比照 W2，純遷移。
- W4 **刻意沒有 AIREDNarrative**——本週不開放 AI 協作（Step 5 有原則卡明說），所以沒有 `w4-aired-record`；`full` 補課路線 ⑤ 不能套 W2/W3 的 AI 句型（§7-2）。
- W4 的 **`DecisionTree`** 是 transient SVG 互動工具，state 不寫 localStorage——**無 W15 那種轉接問題**。
- W4 的 **五種方法卡（`expandedMethod` 自帶收合）** 不要再包 DepthBlock（雙重收合，比照 W3 CutFlowCard）。
- W4 **跨週命脈**：`w4-my-topic` / `w4-main-method` 被 W5/W6/W7 讀；W4 讀上游 `w3-final-topic`。動工時最高優先確認三個 key 不變。
- W4 用 ExportButton 的 `choices` prop（同 W1/W2/W3）——RecordDrawer 已支援。
- W4 多一個 TOP BAR 的「教師流程」LessonMap toggle（同 W1/W2/W3）——保留。
- W4 的 StepEngine 帶 `flat` prop——保留。

---

*建立：2026-05-15 ｜ Phase 1 產出，待授課老師審後進 Phase 2*
