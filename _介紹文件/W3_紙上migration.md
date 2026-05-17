# W3 紙上 migration（三模式＋投影架構）

> Phase 1 產出。依《三模式架構_實作spec.md》＋《網站定位與設計原則.md》。**這是規劃，不寫 code。**
> W1-W8 批次第三頁。W1/W2/W13/W14/W15 已遷移。

---

## 0. W3 現況速覽

`Wizard.jsx`（1635 行，目前最大一頁）。結構：TOP BAR（含「教師流程」LessonMap toggle）→ `{showLessonMap && LessonMap}` → HeroBlock → CourseArc(`W3Data.courseArc`) → TaskCard → `StepEngine`（6 Step）。

**StepEngine 後面什麼都沒有**——沒有飄移元件、沒有 ResearcherRedlines。

6 個 Step：① 碰壁體驗 ② 急診室＋練習 ③ 下刀工坊 ④ 對自己題目下刀 ⑤ AI 共診定案 ⑥ 回顧與繳交。

**內部元件**（都有 render）：`CutFlowCard`（4 把刀心路歷程，自帶 open 收合）、`CutPractice`（練手題）、`P5DraftField`／`P5CompareRef`（Part 5 跨段帶入）。共用元件 `AIAssistToggle`（Step 5 AI 協作×2，內部 render `<ThinkRecord dataKey={recordKey}>`，`w3-p5-*-ai-record` 正常寫進 rib_think_records——**無硬傷**）、`BackfillField`、`LessonMap`。

**W3 有化石＋孤兒欄位**（同一批殘留，見 §6、§7）：被移除的「AI 協作練手 Part 3」段落留下 `COLLAB_STEPS_PRACTICE` 常數、`buildPromptDiagnose`／`buildPromptFix3` 函式、`w3-ai-collab-compare`／`w3-ai-collab-choose` 兩個 EXPORT_FIELDS 孤兒欄位。

---

## 1. selfStudyStatus：`full`（Step 2 有一個小組練習，見 §7-2）

W3 核心是「個人診斷 → 對自己題目下刀 → AI 協作定案」，全是個人作業。Step 2 有一個「小組診斷」練習，但它跟「個人練習」是**同技能的平行難度軌**（SOLO 綠卡／TEAM 黃紅卡），自學學生做個人練習即可等價。

→ 標 `full`。補課路線 ⑤ 註明小組練習可用個人練習替代。

### 自學補課路線（自學模式頂部固定顯示）
```
① 先看：Step 1 八病症 ＋ Step 3 萬用急救心法（大空遠難→小實近易 4 把刀）
② 做：Step 2 八病人配對＋抽題練習、Step 3 練手題下刀、Step 4 對自己 W2 題目下刀、Step 5 AI 共診定案
③ 補紀錄：碰壁體驗／病症快問快答／練手題／個人診斷練習／Part 4 自診＋5W1H＋修改版／Part 5 初稿＋AI 診斷＋三方案／最終定案題目＋研究動機／AI-RED／兩題反思
④ 交：整理 W3 學習紀錄，依老師指定方式上傳到 Google Classroom
⑤ 本週可完整自學——Step 2 的「小組診斷」練習若沒有同學，做「個人練習」即可（同一個技能的平行難度軌）；若要完成 AI 協作段落，請使用你平常可登入的 AI 工具。
```

### 最低完成版（缺課學生：至少做到這些才算補到核心）
```
① 看懂 8 病症、做完 8 病人配對
② 學 4 把刀心法、練手題下刀一次
③ Step 4：對自己 W2 題目做診斷＋5W1H＋寫修改版
④ Step 5：寫出 W3 最終定案題目（帶去 W4，必填）＋研究動機
⑤ 填 AI-RED，整理 W3 紀錄上傳 Classroom
```

---

## 2. 第一屏三句（套 spec §6-1 字數規格）

```
今天做什麼：把 W2 的研究問題搬上手術台，診斷、下刀、AI 協作定案。        （25 字 ✓）
為什麼做：　好題目不是想出來的、是磨出來的——太大太空太遠太難都做不出來。  （28 字 ✓）
今天交什麼：個人＝W3 學習紀錄（含最終定案題目，帶去 W4）。              （1 項 ✓）
```
（現有 HeroBlock 的 subtitle/chain/meta 偏長，第一屏只留三句，其餘下放 DepthBlock「延伸補充」。）

---

## 3. 逐 Step 四分類

標記：【核】核心｜【深】深度（DepthBlock）｜【記】紀錄｜【移】刪除／移出／改寫｜【選】可選

### Step 1 碰壁體驗
| 區塊 | 類 | 備註 |
|---|---|---|
| 碰壁體驗 section（h2＋desc＋StepBriefing＋2 題 A/B 卡＋obstacleStates 互動） | 核 | W3 的 hook，活動素材 |
| ThinkRecord `w3-obstacle-feel` | 記 | |
| 8 種病症 section（h2＋desc＋DISEASES grid） | 核 | W3 核心概念 |
| └ 「W2 的 ABC vs W3 的 A-H 不要混」⚠️ notice | 深 | orientation 說明 → DepthBlock「延伸補充」 |
| ThinkChoice `w3-tc1` | 記 | 走 `choices` 機制 |
| 轉場卡 | 核 | |

### Step 2 急診室＋練習
| 區塊 | 類 | 備註 |
|---|---|---|
| StepBriefing | 核 | |
| Part 1：8 病人互動配對（diagnoses state＋select） | 核 | 活動素材 |
| Part 2：抽題機（SOLO 個人＋TEAM 小組） | 核 | 活動素材 |
| └ ThinkRecord `w3-drill-personal`（鎖題後顯示） | 記 | |
| └ ThinkRecord `w3-drill-group`（鎖題後顯示） | 記 | 小組練習，見 §7-2 |
| 萬用提示條（HINT_ITEMS） | 核 | 小提示 |
| ThinkRecord `w3-disease-quiz` | 記 | |
| 轉場卡 | 核 | |

### Step 3 下刀工坊
| 區塊 | 類 | 備註 |
|---|---|---|
| 萬用急救心法（MANTRA_ROWS＋MANTRA_MAP） | 核 | W3 核心概念，4 把刀 |
| 🎮 遊戲暱稱對映卡（`<details>`） | 深 | 「正課不用記」明示可選 → DepthBlock「延伸補充」 |
| 4 把刀心路歷程（CutFlowCard ×4） | 核 | 各卡自帶 open 收合，**不再包 DepthBlock**（雙重收合） |
| `CutPractice`（練手題，ThinkRecord `w3-cut-practice`＋radio `w3-cut-practice-cut`） | 核＋記 | 活動素材 |
| 「兩條救活路徑」示範卡 | 深 | worked example → DepthBlock「看完整範例」 |
| 轉場卡 | 核 | |

### Step 4 對自己題目下刀
| 區塊 | 類 | 備註 |
|---|---|---|
| StepBriefing／過渡說明卡 | 核 | |
| {w2Intent 帶入卡 ／ BackfillField `w2-final-intent`} | 核 | 跨週帶入，條件渲染 |
| Section A 診斷（ThinkRecord `w3-own-diagnose`） | 核＋記 | |
| Section B 5W1H（範例＋ThinkRecord `w3-own-5w1h`＋出院標準 checklist） | 核＋記 | |
| Section C 修改版（ThinkRecord `w3-own-revised`） | 核＋記 | |

### Step 5 AI 共診定案
| 區塊 | 類 | 備註 |
|---|---|---|
| StepBriefing／過渡卡 | 核 | |
| 📖 示範流程預覽「小華的故事」（`<details>`） | 深 | 完整範例詳解 → DepthBlock「看完整範例」 |
| 第一輪 `<P5DraftField />`（ThinkRecord `w3-p5-draft`） | 核＋記 | |
| 第二輪 `<P5CompareRef />` ＋ `<AIAssistToggle id="w3-p5-diagnose" recordKey="w3-p5-diagnose-ai-record">` | 核＋記 | AIAssistToggle 內含 ThinkRecord |
| 第三輪 `<AIAssistToggle id="w3-p5-fix3" recordKey="w3-p5-fix3-ai-record">` | 核＋記 | |
| 定案 section（ThinkRecord `w3-final-topic`＋研究動機卡 ThinkRecord `w3-motivation`） | 核＋記 | **`w3-final-topic` 跨週命脈，見 §7-3** |
| `AIREDNarrative week="3"`（`w3-aired-record`） | 記 | |

### Step 6 回顧與繳交
| 區塊 | 類 | 備註 |
|---|---|---|
| StepBriefing | 核 | `task`／`done` 有「複製貼到 Classroom」框架語言 → 改中性版（見 §7-4）|
| 「✅ 本週結束你應該要會」卡 | 核 | |
| ThinkRecord `w3-reflect-misdiagnosis`／`w3-reflect-cuts` | 記 | |
| 「📤 最後一步」複製繳交卡 | 核 | 「複製 W3 學習紀錄，貼到 Classroom」→ 改中性版（§7-4）|
| `ExportButton`（含 `choices={choiceResults}`） | 記 | 進 RecordDrawer（choices pass-through 已備）|
| 遊戲彩蛋卡／下週預告卡 | 核 | |

### StepEngine 外
W3 沒有 StepEngine 外的飄移元件——沒有要搬移的東西。

---

## 4. DepthBlock 標題對應（用 spec §6-2 固定詞表）

| 深度區塊 | DepthBlock 標題 |
|---|---|
| HeroBlock chain/meta（下放） | 延伸補充 |
| Step 1「ABC vs A-H 不要混」⚠️ notice | 延伸補充 |
| Step 3 🎮 遊戲暱稱對映卡（原 `<details>`） | 延伸補充 |
| Step 3「兩條救活路徑」示範卡 | 看完整範例 |
| Step 5 📖「小華的故事」示範流程（原 `<details>`） | 看完整範例 |

5 個。**CutFlowCard ×4 不包 DepthBlock**——它們各自有 open 收合，再包就雙重收合（比照 W1 揭曉真相、W2 的處理原則）。

---

## 5. RecordDrawer 要聚合的 dataKeys

EXPORT_FIELDS 內（修正後 17 個——原 19 個扣掉 2 個孤兒）：
`w3-obstacle-feel`／`w3-disease-quiz`／`w3-cut-practice-cut`／`w3-cut-practice`／`w3-drill-personal`／`w3-drill-group`／`w3-own-diagnose`／`w3-own-5w1h`／`w3-own-revised`／`w3-p5-draft`／`w3-p5-diagnose-ai-record`／`w3-p5-fix3-ai-record`／`w3-final-topic`／`w3-motivation`／`w3-aired-record`／`w3-reflect-misdiagnosis`／`w3-reflect-cuts`

**移除（硬傷 A）**：`w3-ai-collab-compare`／`w3-ai-collab-choose`——孤兒欄位，全頁無 input（見 §7-1）。

元件自帶／其他機制、**不在 RecordDrawer 欄位總覽**：
- `w3-tc1`（ThinkChoice）——透過 ExportButton 的 `choices` prop 匯出。

W3 **沒有 RECORD_EXTRA_FIELDS**——所有 dataKey 不是在 EXPORT_FIELDS 就是走 `choices`。

RecordDrawer 方案 A：input 全部留在原 Step，drawer 只做總覽＋匯出。dataKey 一字不改。

---

## 6. 「刪除／移出」桶

W3 有一批**化石（同一個被移除的「AI 協作練手 Part 3」段落留下的）**，Phase 2 一併清掉：

- `COLLAB_STEPS_PRACTICE` 常數（lines 147-154）——定義齊全但 0 render。
- `buildPromptDiagnose`／`buildPromptFix3` 兩個函式（lines 156-171）——定義但 0 使用（Step 5 用的是 `MY_DIAGNOSE_PROMPT`／`MY_FIX3_PROMPT` 常數字串）。
- EXPORT_FIELDS 裡的 `w3-ai-collab-compare`／`w3-ai-collab-choose`（lines 218-219）——孤兒欄位（見 §7-1）。

清的時候 grep 確認這幾個 identifier 在頁面 JSX 真的 0 使用再刪。W3 **沒有「老師巡視」框架**要改寫。

---

## 7. 硬傷與待確認（Phase 2 必處理）

### 7-1.（硬傷·必修，好修）`w3-ai-collab-compare` / `w3-ai-collab-choose` 是孤兒欄位
兩個 key 只在 EXPORT_FIELDS（lines 218-219），全頁無 ThinkRecord／input 寫它們——學生匯出永遠是空白欄。它們是被移除的「AI 協作練手 Part 3」段落殘留。Phase 2 從 EXPORT_FIELDS 移除即可（不像 W13 的 table-structure 要補 input——W3 這兩個是真的整段被拿掉了、不需要補回，直接刪欄位）。連帶清掉 §6 的化石常數／函式。

### 7-2.（待確認）`selfStudyStatus: full` vs `partial`——Step 2 的小組練習
W3 標 `full`，但 Step 2 有「小組診斷」練習（`w3-drill-group`）。判斷依據：它跟「個人診斷練習」（`w3-drill-personal`）是**同技能的平行難度軌**（SOLO 綠卡 vs TEAM 黃紅卡），自學學生做個人練習即可等價完成同一個學習目標。所以判 `full`，補課路線 ⑤ 註明小組練習可用個人練習替代。**若老師認為「小組討論」本身不可取代，可改 `partial`**——這是判斷題。建議 `full`。

### 7-3.（跨週命脈·必守，最高優先）`w3-final-topic` 被 6 週讀取
`w3-final-topic`（W3 最終定案題目）被 **W4／W5／W6／W7（W50Page）／W9／W13** 六週讀取——是全專案被讀最多的 dataKey 之一。遷移**絕對不准改這個 key**。`w3-motivation`（研究動機）也有下游讀（W6 海報）。W3 讀的 `w2-final-intent` 也不能動（W2 端已遷移、key 沒變）。

### 7-4.（Classroom 用語對齊）
Step 6 的 StepBriefing（`task="…按下方複製繳交。" done="貼到 Google Classroom 繳交。"`）、最後一步卡（「複製 W3 學習紀錄，貼到 Google Classroom 繳交。」）、TaskCard 的 `exportReminder`（「…貼到 Google 文件繳交」）都還是「複製貼上」框架語言。Phase 2 一併改成中性版（「整理 W3 學習紀錄，依老師指定方式上傳到 Google Classroom」），跟 W1/W2 一致。

### 7-5.（投影）W3 有 2 個 `<details>`
🎮 遊戲暱稱對映卡（Step 3）、📖 小華的故事（Step 5）——都換成 DepthBlock（照 §4）即自動吃投影收合。Phase 2 grep 確認全頁 `<details>` 0 殘留。

---

## 8. Phase 2 動工清單（12 項）

```
1.  移除孤兒欄位 w3-ai-collab-compare / w3-ai-collab-choose（硬傷 A）
2.  清化石：COLLAB_STEPS_PRACTICE 常數、buildPromptDiagnose / buildPromptFix3 函式（grep 確認 0 使用再刪）
3.  ModeProvider + useMode + useProjector 拆 WizardContent + ModeSwitch
4.  HeroBlock 第一屏只留三句（§2，todo prop）
5.  DepthBlock 包深度區塊（標題照 §4）；Step 3/5 兩個 <details> 換成 DepthBlock
6.  RecordDrawer 聚合總覽與匯出（fields=EXPORT_FIELDS + choices={choiceResults}），input 留 Step
7.  ExportButton → RecordDrawer + 繳交提醒（W3 Step 6）
8.  Classroom 用語對齊：Step 6 StepBriefing + 最後一步卡 + TaskCard exportReminder 改中性版（§7-4）
9.  selfStudyStatus: full + 自學補課路線（⑤ 註明小組練習可替代）+ 最低完成版（加進 lessonMaps W3Data）
10. 投影降密度：靠 DepthBlock（含原 2 個 details）+ 共用元件
11. 化石掃描：grep 確認 import 無孤兒、<details> 0 殘留
12. build 驗證 + grep dataKey 0 斷鏈（特別確認 w3-final-topic 不變、6 週讀得到；w2-final-intent 不變）+ 三情境測試
```
常數抽離（DISEASES／MANTRA_*／PATIENTS／DRILL_* 等）→ Phase 6，這次不做。

---

## 9. 與已遷移週的差異速記（實作時注意）

- W3 **最大一頁（1635 行）**、6 Step——但 StepEngine 後面乾淨、沒有飄移元件。
- W3 **有化石＋孤兒欄位**（同一批：COLLAB_STEPS_PRACTICE / buildPrompt* / w3-ai-collab-*）——比照 W13 RouteSelector 處理，清掉。
- W3 **有 2 個 `<details>`**——都換 DepthBlock（W1/W2 沒有 details，W13 有 details 維持但 W3 這 2 個性質適合換）。
- W3 的 **CutFlowCard ×4 自帶收合**——不要再包 DepthBlock（雙重收合）。
- W3 **跨週命脈最重**：`w3-final-topic` 被 6 週讀——全專案最關鍵的 key 之一，動工時最高優先確認不變。
- W3 用 ExportButton 的 `choices` prop（同 W1/W2）——RecordDrawer 已支援。
- W3 的 `AIAssistToggle` 內部 render ThinkRecord——`recordKey` 正常進 rib_think_records，無轉接問題（不像 W15 的 ThreeColumnConclusion）。
- W3 多一個 TOP BAR 的「教師流程」LessonMap toggle（同 W1/W2）——保留。

---

*建立：2026-05-15 ｜ Phase 1 產出，待授課老師審後進 Phase 2*
