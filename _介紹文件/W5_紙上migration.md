# W5 紙上 migration（三模式＋投影架構）

> Phase 1 產出。依《三模式架構_實作spec.md》＋《網站定位與設計原則.md》。**這是規劃，不寫 code。**
> W1-W8 批次第五頁。W1/W2/W3/W4/W13/W14/W15 已遷移。

---

## 0. W5 現況速覽

`W5MeasurePage.jsx`（840 行）。結構：TOP BAR（含「教師流程」LessonMap toggle）→ `{showLessonMap && W5Data && LessonMap}` → HeroBlock → CourseArc → TaskCard → `StepEngine`（5 Step，`flat`）。

**StepEngine 後面什麼都沒有**——沒有飄移元件。

5 個 Step：① 開場＋W4 帶入 ② 操作型定義是什麼 ③ 5 法操作型定義策略 ④ 為自己題目寫操作型定義 ⑤ 反思＋繳交。

**內部元件**：`W5HeaderRef`（W4 帶入卡＋W2 好奇鏡子卡，Step 1/Step 4 render）、`detectMethodId`（函式，把 W4 主方法字串轉 method id）。常數 `METHOD_STRATEGIES`／`METHOD_LOOKUP`／`PRESSURE_DEMO`／`THREE_RULES`／`EXPORT_FIELDS`。共用元件 `BackfillField`（Step 1 ×2，補 `w4-my-topic`／`w4-main-method`）、`AIREDNarrative`（Step 5，`week="5" optional={true}`）、`LessonMap`。

**export 結構**：同時有 `export const W5MeasurePage` 與檔尾 `export default W5MeasurePage`——遷移時兩個都要保留。

**W5 有一個硬傷**：`w5-my-topic`／`w5-my-method` 是孤兒 EXPORT_FIELDS（見 §6、§7-1）。**有 7 個 `<details>`**（見 §7-5，判斷題）。

---

## 1. selfStudyStatus：`full`（見 §7-2）

W5 核心是「認識操作型定義 → 看 5 法策略 → 為自己題目寫三格 → 反思」，全是個人作業。Step 2 的「集體共寫示範」雖名為「跟著老師跑一題」，但內容（①②③④ 四步 `<details>`）完全可自學讀完整範例；Step 4 的「同儕挑戰」可用自我檢核替代；Step 5 的 AI-RED 是 `optional`。

→ 標 `full`。

### 自學補課路線（自學模式頂部固定顯示）
```
① 先看：Step 2 操作型定義概念（含「上課專心」入門範例＋三件事檢核）＋ Step 2「集體共寫示範」完整範例
② 做：Step 3 點開你 W4 主方法那張策略卡、Step 4 為自己題目寫三格（核心概念／操作型定義／正反例）、Step 5 反思
③ 補紀錄：核心概念／操作型定義／正反例／反思（模糊→可測的轉化）／AI-RED（選填）
④ 交：整理 W5 學習紀錄，依老師指定方式上傳到 Google Classroom
⑤ 本週可完整自學——「集體共寫示範」自己讀 ①→④ 四步即可；Step 4「同儕挑戰」沒有同學時，用 Step 2 的「三件事檢核」（可測量／有正反例／前後一致）自我檢查；AI-RED 為選填，若你用 AI 發散候選定義再填。
```

### 最低完成版（缺課學生：至少做到這些才算補到核心）
```
① 看懂操作型定義＝把抽象概念變成「誰來測都一樣的數字／類別」
② 看完「集體共寫示範」四步、看自己 W4 主方法那張策略卡
③ Step 4：為自己題目寫出核心概念＋操作型定義＋正反例三格（帶去 W6，必填）
④ Step 5：寫完反思
⑤ 整理 W5 紀錄上傳 Classroom
```

---

## 2. 第一屏三句（套 spec §6-1 字數規格）

```
今天做什麼：把題目裡最抽象的詞，變成「誰來測都一樣」的具體指標。            （26 字 ✓）
為什麼做：　選了方法 ≠ 知道怎麼測——不操作化，下週工具寫不出來。            （28 字 ✓）
今天交什麼：個人＝W5 學習紀錄（核心概念＋操作型定義＋正反例，帶去 W6）。     （1 項 ✓）
```
（現有 HeroBlock 的 subtitle/chain/meta 偏長，第一屏只留三句，其餘下放 DepthBlock「延伸補充」。）

---

## 3. 逐 Step 四分類

標記：【核】核心｜【深】深度（DepthBlock）｜【記】紀錄｜【移】刪除／移出／改寫｜【選】可選

### Step 1 開場＋W4 帶入
| 區塊 | 類 | 備註 |
|---|---|---|
| StepBriefing | 核 | |
| 「為什麼是這週」卡 | 核 | 短卡，連貫鏈 hook |
| {`W5HeaderRef`（W4 帶入＋W2 好奇鏡子卡） ／ BackfillField `w4-my-topic`} | 核 | 條件渲染；鏡子卡是連貫鏈 hook |
| BackfillField `w4-main-method`（topic 有、method 缺時） | 核 | 上游補填 |
| 「🎯 這週目標」卡 | 核 | 短卡 |

### Step 2 操作型定義是什麼
| 區塊 | 類 | 備註 |
|---|---|---|
| StepBriefing | 核 | |
| 關鍵概念卡（操作型定義定義＋「上課專心」入門範例＋三方法對照 PRESSURE_DEMO＋三件事檢核 THREE_RULES） | 核 | W5 核心概念 |
| └ 「🧬 這不是新東西——兩件舊事的合體進階版」連動卡（W3/W4 連貫鏈說明） | 深 | 連貫鏈背景說明 → DepthBlock「延伸補充」（見 §7-4）|
| 「集體共寫示範｜上課專心」卡（含 4 個 `<details>`：①抽核心概念 ②寫操作型定義 ③列正反例 ④三件事檢核） | 核 | 從讀範例到動手的鷹架；`<details>` 是漸進揭示機制，**保留、不轉 DepthBlock**（見 §7-5）|
| └ 「📚 文獻分析組看這裡」小卡 | 核 | 分流提示，短卡 |
| └ 「📐 操作型定義範例庫」連結卡 | 核 | 自學頁入口，短卡 |

### Step 3 5 法操作型定義策略
| 區塊 | 類 | 備註 |
|---|---|---|
| StepBriefing | 核 | |
| 「📒 術語小辭典」卡 | 深 | 可查 reference（「看不懂可隨時翻回來」）→ DepthBlock「延伸補充」（見 §7-4）|
| 方法選擇 tabs（`activeMethodId` state，自動初始化為 W4 主方法） | 核 | 互動核心 |
| 策略詳細卡（`activeStrategy`：公式＋desc＋範例） | 核 | 互動核心 |
| 「🌱 自然科學分流」卡 | 核 | 分流提示，短卡 |

### Step 4 為自己題目寫操作型定義
| 區塊 | 類 | 備註 |
|---|---|---|
| StepBriefing | 核 | |
| 「✋ 動筆前先做這件事」現場檢核卡 | 核 | 動筆前第一個可執行動作 |
| W4 帶入卡（再次出現，條件渲染） | 核 | |
| 「核心概念抽取暖身」卡（含 3 個 `<details>`：範例①②③，try-then-reveal 防偷看） | 核 | 避免第一格卡死的鷹架；`<details>` 是防偷看機制，**保留、不轉 DepthBlock**（見 §7-5）|
| ThinkRecord `w5-core-concept` | 記 | **跨週命脈，見 §7-3** |
| ThinkRecord `w5-operationalize`（prompt/placeholder 依 methodId 動態） | 記 | **跨週命脈，見 §7-3** |
| ThinkRecord `w5-pos-neg`（placeholder 依 methodId 動態） | 記 | |
| 「同儕挑戰」卡 | 核 | 短卡；自學可用三件事檢核替代（§1）|
| 「💡 寫一次、用三次」下游告知 | 核 | 短句 |

### Step 5 反思＋繳交
| 區塊 | 類 | 備註 |
|---|---|---|
| StepBriefing | 核 | `task` 有「按下方複製繳交」、`done` 有「貼到 Google Classroom」框架語言 → 改中性版（§7-6）|
| 「✅ 本週結束你應該要會」檢核卡 | 核 | |
| ThinkRecord `w5-reflect` | 記 | |
| `AIREDNarrative week="5" optional={true}`（`w5-aired-record`） | 記 | optional，保留 |
| 「📤 最後一步」複製繳交卡 | 核 | 「複製 W5 學習紀錄，貼到 Google Classroom 繳交」→ 改中性版（§7-6）|
| `ExportButton`（`buttonText="複製 W5 學習紀錄"`，**無 `choices`**——W5 沒有 ThinkChoice） | 記 | 進 RecordDrawer；buttonText 同步中性版 |
| 下週預告卡（next-week-preview） | 核 | |

### StepEngine 外
W5 沒有 StepEngine 外的飄移元件——沒有要搬移的東西（同 W2/W3/W4）。

---

## 4. DepthBlock 標題對應（用 spec §6-2 固定詞表）

| 深度區塊 | DepthBlock 標題 |
|---|---|
| HeroBlock chain/meta（下放） | 延伸補充 |
| Step 2「🧬 這不是新東西」W3/W4 連動卡 | 延伸補充 |
| Step 3「📒 術語小辭典」卡 | 延伸補充 |

3 個。**不包 DepthBlock 的**：兩張大範例卡（「集體共寫示範」「核心概念抽取暖身」）——它們是核心鷹架、且內含功能性 `<details>`，包了會雙重收合（見 §7-5）；方法選擇 tabs／策略詳細卡（互動核心）。

---

## 5. RecordDrawer 要聚合的 dataKeys

EXPORT_FIELDS 內（修正後 5 個——原 7 個扣掉 2 個孤兒，**或** 7 個——看 §7-1 採哪案）：
`w5-core-concept`／`w5-operationalize`／`w5-pos-neg`／`w5-reflect`／`w5-aired-record`
（＋ §7-1 若採 b 案：`w5-my-topic`／`w5-my-method`）

**孤兒（硬傷）**：`w5-my-topic`／`w5-my-method`——只在 EXPORT_FIELDS（lines 114-115），全頁無 input 寫它們（見 §7-1）。

W5 **沒有 RECORD_EXTRA_FIELDS**，**沒有 ThinkChoice**（RecordDrawer 不需 `choices` prop）——所有要匯出的 dataKey 都在 EXPORT_FIELDS。

RecordDrawer 方案 A：input 全部留在原 Step，drawer 只做總覽＋匯出。dataKey 一字不改。

---

## 6. 「刪除／移出」桶

W5 的「桶」內容看 §7-1 採哪案：
- 若採 **a 案（刪欄位）**：從 EXPORT_FIELDS 移除 `w5-my-topic`／`w5-my-method`（連 portfolioRegistry.js 的對應兩列一併處理）。
- 若採 **b 案（補 auto-fill）**：不刪，改在 useEffect 補寫入（見 §7-1）。

W5 **無化石常數／函式**（METHOD_STRATEGIES/LOOKUP、detectMethodId、PRESSURE_DEMO、THREE_RULES、W5HeaderRef 全有 render／使用），**無「老師巡視」框架語言**要改寫。

---

## 7. 硬傷與待確認（Phase 2 必處理）

### 7-1.（硬傷·必修）`w5-my-topic` / `w5-my-method` 是孤兒欄位
兩個 key 只在 EXPORT_FIELDS（lines 114-115），標籤寫「（從 W4 帶入）」——但**全頁沒有任何 input 寫它們**。W5 是把 `w4-my-topic`／`w4-main-method` 讀進 state（`w4Topic`／`w4MainMethod`）顯示在帶入卡，從沒寫進 `w5-*`。學生匯出 → 這兩欄永遠空白。

**兩個修法（判斷題）**：
- **a 案：刪欄位**——比照 W3 的 `w3-ai-collab-*`，從 EXPORT_FIELDS（＋ portfolioRegistry.js）移除。最乾淨，但 W5 學習紀錄就沒有「題目／方法」當脈絡（老師讀紀錄時得自己回想學生在做哪一題）。
- **b 案：補 auto-fill 寫入**——比照 W4 的 `w4-my-topic` auto-fill 慣例（W4 在 useEffect 偵測到 `w3-final-topic` 就寫進 `w4-my-topic`）。W5 在 useEffect 偵測到 `w4-my-topic`／`w4-main-method` 時，同步寫進 `w5-my-topic`／`w5-my-method`。保留欄位、export 自帶脈絡。
- **建議 b 案**——標籤本來就寫「從 W4 帶入」，意圖是要在 W5 紀錄裡留脈絡；且 W4 已有完全相同的 auto-fill 慣例可照抄。屬「作業需要、補 input」型硬傷（同 W13），不是「舊段落移除」型（W1/W3）。

### 7-2.（待確認）`selfStudyStatus: full`
W5 標 `full`。本週帶「真人」味道的是 Step 2「集體共寫示範」（名為「跟著老師跑一題」）、Step 4「同儕挑戰」。判斷依據：集體共寫示範的 ①②③④ 四步內容完整、可自學讀（它是「從讀範例到動手」的鷹架，不是非老師不可的環節）；同儕挑戰可用 Step 2 的「三件事檢核」自我替代；AI-RED 為 `optional`。所以判 `full`。**若老師認為「集體共寫」一定要老師現場帶，可改 `partial`**——判斷題，建議 `full`。

### 7-3.（跨週命脈·必守）`w5-core-concept` / `w5-operationalize` 有下游讀取
- `w5-core-concept`、`w5-operationalize` 被 **W6（W6PosterTeamPage）** 讀取，W6 並把 `w5-operationalize` 寫成 `w6-from-w5-operationalize`。
- `w5-operationalize` 還在 **W9 計畫書／W10 工具**用到（Step 4 下游告知明寫）。
- W5 自己讀上游：`w4-my-topic`／`w4-main-method`（主鏈）、`w3-final-topic`（fallback）、`w2-final-intent`／`w2-step3-question`（W2 好奇鏡子卡，已 grep 確認兩個 key 都還在 ProblemFocus.jsx）。
遷移**絕對不准改 `w5-core-concept`／`w5-operationalize` 兩個 key**。Phase 2 build 後 grep 確認 W6 讀得到、上游 5 個 key 鏈不斷。

### 7-4.（DepthBlock 判斷題）兩張卡的核／深歸類
- **Step 2「🧬 這不是新東西」W3/W4 連動卡**：建議 → 深（「延伸補充」）。它是「為什麼這不是新東西」的連貫鏈背景說明，不是動手必讀。
- **Step 3「📒 術語小辭典」卡**：建議 → 深（「延伸補充」）。它是可查 reference（卡片自己寫「看不懂可隨時翻回來」），放 DepthBlock 後標題仍可見、學生卡住點得開；同時降 Step 3「專業詞密度高」的投影密度。**但若老師覺得新生離不開這張、想一直攤開，可留核**——判斷題。

### 7-5.（判斷題·偏離 W3 前例）W5 有 7 個 `<details>`，建議全部保留、不轉 DepthBlock
W3 的 2 個 `<details>` 當時轉成了 DepthBlock——但 W5 的 7 個性質不同：
- Step 2「集體共寫示範」4 個（①②③④步驟）＝**漸進揭示**機制：老師現場一步一步開、學生跟著看流程。
- Step 4「核心概念抽取暖身」3 個（範例①②③）＝**try-then-reveal 防偷看**機制：卡片明寫「心裡圈一下核心概念在哪，再展開看答案」。

這 7 個 `<details>` 是**功能性的教學機制**（漸進揭示／防偷看），不是「深度補充內容」。處理建議：
- **保留全部 7 個 `<details>` 原樣**，不轉 DepthBlock、不包父卡。
- 理由：(1) 包父卡 → DepthBlock 外＋`<details>` 內＝雙重收合（艾文在 W4 已明示不要「收合裡面還有收合」）；(2) 把 Step 4 的範例 `<details>` 攤平會直接破壞「先想再看答案」的防偷看設計；(3) 兩張父卡是核心鷹架（不是「延伸補充」型內容）；(4) `<details>` 預設收合，投影密度本來就低。
- **代價**：投影模式無法用全域開關一次收掉這 7 個（但它們預設就收合，影響小）。
- **若老師仍要求「全站 `<details>` 0 殘留」**，替代案是把 7 個 `<details>` 換成 spec 的 `DepthBlock`——但這會讓 Step 2/Step 4 各出現 4＋3 個 DepthBlock、且 DepthBlock 固定詞表無法標「①抽核心概念」這種步驟名，且破壞防偷看。**不建議。**

### 7-6.（Classroom 用語對齊）
Step 5 的 StepBriefing（`task="寫反思 + 按下方複製繳交。" done="貼到 Google Classroom 繳交。"`）、最後一步卡（「複製 W5 學習紀錄，貼到 Google Classroom 繳交。」）、ExportButton 的 `buttonText="複製 W5 學習紀錄"` 都還是「複製貼上」框架語言。Phase 2 一併改成中性版（「整理 W5 學習紀錄，依老師指定方式上傳到 Google Classroom」），跟 W1-W4 一致。TaskCard 的 `exportReminder`（「匯出 W5 操作型定義 → 下週 W6 海報博覽會直接用」）是 W6 handoff 提示、非 Classroom 框架語言，**保留不動**（同 W4 決定）。

---

## 8. Phase 2 動工清單（11 項）

```
1.  處理孤兒欄位 w5-my-topic / w5-my-method（硬傷·§7-1）——建議 b 案：useEffect 補 auto-fill 寫入
2.  ModeProvider + useMode 拆 W5MeasurePageContent + ModeSwitch（export const W5MeasurePage = () => (<ModeProvider week="W5">…)；檔尾 export default 保留）
3.  HeroBlock 第一屏只留三句（§2，todo prop）
4.  DepthBlock 包深度區塊（標題照 §4：HeroBlock chain/meta → 延伸補充；Step 2 連動卡 → 延伸補充；Step 3 術語小辭典 → 延伸補充）
5.  RecordDrawer 聚合總覽與匯出（fields=EXPORT_FIELDS，無 choices），input 留 Step
6.  ExportButton → RecordDrawer + 繳交提醒（W5 Step 5），buttonText 同步中性版
7.  Classroom 用語對齊：Step 5 StepBriefing + 最後一步卡 + ExportButton buttonText 改中性版（§7-6）
8.  selfStudyStatus: full + 自學補課路線 + 最低完成版（加進 lessonMaps W5Data，位置在 title 後）
9.  投影降密度：靠 DepthBlock（§4 的 3 個）+ 共用元件；7 個 <details> 保留（§7-5）
10. 化石掃描：grep 確認 import 無孤兒、EXPORT_FIELDS 每個 key 的狀態（§7-1 處理後）
11. build 驗證 + grep dataKey 0 斷鏈（特別確認 w5-core-concept / w5-operationalize 不變、W6 讀得到；上游 w4-my-topic / w4-main-method / w3-final-topic / w2-final-intent / w2-step3-question 鏈不斷）+ 三情境測試
```
常數抽離（METHOD_STRATEGIES 等）→ Phase 6，這次不做。

---

## 9. 與已遷移週的差異速記（實作時注意）

- W5 **有一個硬傷**：`w5-my-topic`／`w5-my-method` 孤兒欄位——建議走 W13 型修法（補 input／auto-fill），不是 W1/W3 型（刪欄位）。見 §7-1。
- W5 **有 7 個 `<details>`**——但都是功能性教學機制（漸進揭示／防偷看），建議**全部保留、不轉 DepthBlock**，這是對 W3 前例的刻意偏離（理由見 §7-5）。
- W5 **有 AIREDNarrative**（`week="5" optional={true}`）——保留；`full` 補課路線 ⑤ 註明 AI-RED 為選填。
- W5 **無 ThinkChoice**——RecordDrawer 不需 `choices` prop（不同於 W1/W2/W3/W4）。
- W5 **export 結構特殊**：`export const W5MeasurePage` ＋ 檔尾 `export default W5MeasurePage` 兩個都有——遷移時包 ModeProvider 後兩個都要在。
- W5 **跨週命脈**：`w5-core-concept`／`w5-operationalize` 被 W6 讀（W9/W10 也用 operationalize）；W5 自己讀 5 個上游 key。動工時最高優先確認不變。
- W5 多一個 TOP BAR 的「教師流程」LessonMap toggle（同 W1-W4）——保留。
- W5 的 StepEngine 帶 `flat` prop——保留。
- W5 有 W2 好奇鏡子卡（`W5HeaderRef` 內）——連貫鏈 hook，留核（同 W7 鏡子卡 W2 連動的設計慣例）。

---

*建立：2026-05-15 ｜ Phase 1 產出，待授課老師審後進 Phase 2*
