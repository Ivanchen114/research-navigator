# W15 紙上 migration（三模式＋投影架構）

> Phase 1 產出。依《三模式架構_實作spec.md》＋《網站定位與設計原則.md》。**這是規劃，不寫 code。**
> 分析叢集（W13→W14→W15）最後一頁。W14 已是試點、W13 已遷移；投影支援大多由共用元件免費跟著來。

---

## 0. W15 現況速覽

`W15Page.jsx`（1032 行）。結構：TOP BAR → HeroBlock → CourseArc(`W15Data.courseArc`) → TaskCard → `ResearcherRedlines`(warning) → `StepEngine`（5 Step）→ `ThreeColumnConclusion` → `TrapRewritePractice` → `BraveScientistReflection` → `ResearcherRedlines`(subset collapsible)。

5 個 Step：① 四層升級 ② 自己先寫 ③ 自我檢視 ④ 補充·AI 檢核（可選）⑤ 回顧繳交。

**W15 沒有外部 Google 文件模板**；四層結論最終定稿寫在網頁 ThinkRecord，小組「結論章初稿」放回組內研究報告（外部文件）。個人歷程靠網頁 input ＋ ExportButton 匯出 docx。

**W15 的「重」**：Step 1 一次攤了 8 張卡（名詞升級、W14 帶入、伏筆揭曉、四層架構、呼應層為什麼特別＋潤飾 sub-box、呼應層 5 方法範例、完整四層 DEMO）——是全頁最擠的一段。減負主要靠把範例／詳解類包進 DepthBlock。

**內部元件**：`CopyablePrompt`、`MethodSelector`（驗收型 prompt 分頁）——都有被 render，非化石（動工時 grep 再確認一次）。

---

## 1. selfStudyStatus：`partial`

可自學：四層架構、名詞升級（推論→詮釋）、相關 vs 因果、四層自查清單、AI 檢核紅線判斷、雷 #3 改寫、三欄分類。W15 大半是個人寫作＋自查，自學成分比 W13/W14 高。
需真人：小組「研究結論章初稿」要回組整合進報告；老師看結論品質（有沒有把相關寫成因果、限制有沒有交代）。

### 自學補課路線（自學模式頂部固定顯示）
```
① 先看：Step 1（四層架構＋呼應層為什麼特別）＋ Step 3 相關 vs 因果
② 做：Step 2 拿自己 W14 的描述／推論當雛型，寫四層結論初稿
③ 補紀錄：四層初稿／三欄分類／自查紀錄／四層定稿／雷 #3 改寫
④ 交：個人 W15 歷程 docx（四層定稿、三欄自查、雷 #3 改寫、AI-RED 如有）
⑤ 需要找人：小組結論章整合回報告要回組；結論品質想被檢核可回課堂或找老師
```

### 最低完成版（缺課學生：至少做到這些才算補到核心）
```
① 寫出四層結論初稿（描述／詮釋／呼應／批判各一段）
② 用四層自查清單檢一輪、寫自查紀錄
③ 填四層結論最終版（w15-final-draft）
④ 完成雷 #3 改寫
⑤ 匯出 W15 歷程 docx
```

---

## 2. 第一屏三句（套 spec §6-1 字數規格）

```
今天做什麼：把整份研究的發現整合成一個四層結論。                      （18 字 ✓）
為什麼做：　結論要回答你最初的研究問題，也要說清楚自己能說到哪、不能說到哪。（31 字 ✓）
今天交什麼：小組＝研究結論章初稿；個人＝W15 歷程 docx               （2 項 ✓）
```
（現有 HeroBlock 的 subtitle/chain/meta 偏長，第一屏只留三句，其餘下放 DepthBlock「延伸補充」。）

---

## 3. 逐 Step 四分類

標記：【核】核心｜【深】深度（DepthBlock）｜【記】紀錄｜【移】刪除／移出／改寫｜【選】可選練習

### Step 1 四層升級
| 區塊 | 類 | 備註 |
|---|---|---|
| 開場卡「升級！從局部到全局」 | 核 | 可瘦身 |
| 名詞升級卡（W14 推論→W15 詮釋） | 深 | 名詞白話化 → DepthBlock「延伸補充」 |
| W14 帶入卡（描述／推論雛型，條件渲染） | 核 | 跨週帶入，活動素材 |
| W14 伏筆揭曉卡／無伏筆 fallback 卡 | 核 | 兩分支條件渲染，保留 |
| 四層結論架構（FOUR_LAYERS grid） | 核 | 核心概念 |
| 「⭐ 呼應層為什麼特別」卡 | 核 | 呼應層＝W15 核心 |
| └ 卡內「『潤飾』是什麼 ✅/❌」sub-box | 深 | DepthBlock「常見錯誤」 |
| 「呼應層範例：5 方法怎麼寫」卡 | 深 | 範例詳解 → DepthBlock「看完整範例」 |
| 「示範：完整四層」DEMO_EXAMPLE | 深 | 範例 → DepthBlock「看完整範例」 |

### Step 2 自己先寫
| 區塊 | 類 | 備註 |
|---|---|---|
| **`ThreeColumnConclusion`（`w15-three-column`）** | 記 | **從頁底搬進這裡**——「寫結論前先把每句話分類能說／謹慎說／不能說」，是寫作鷹架，放 4 個 draft ThinkRecord 之前。見 §7-1 硬傷 |
| 開場卡「你先寫，AI 再幫你檢核」 | 核 | |
| 研究問題帶入卡（條件渲染） | 核 | |
| ThinkRecord `w15-draft-describe`（依方法分流 prompt） | 記 | |
| ThinkRecord `w15-draft-interpret` | 記 | |
| ThinkRecord `w15-draft-anchor` | 記 | 呼應層 |
| ThinkRecord `w15-draft-critique` | 記 | 批判層 |

### Step 3 自我檢視
| 區塊 | 類 | 備註 |
|---|---|---|
| 開場卡「對著自己初稿做四層自查」 | 核 | |
| 個資提醒卡（為下一步用 AI 預備） | 核 | 重要提醒 |
| 「相關 vs 因果」白話卡 | 深 | 名詞白話化 → DepthBlock「延伸補充」 |
| 四層自查清單（4 卡） | 核 | 活動素材，對著初稿檢 |
| ThinkRecord `w15-self-review` | 記 | |
| 「四層結論最終版（必繳）」卡 ＋ ThinkRecord `w15-final-draft` | 核＋記 | 唯一最終欄位，essential |
| 「對應期末報告章節」卡 | 核 | |

### Step 4 補充·AI 檢核（可選）
| 區塊 | 類 | 備註 |
|---|---|---|
| W15 AI 底線卡 | 核 | 警戒語 |
| 開場卡「AI 是嚴格教練·可選擇不用」 | 核 | |
| `AICollaborationPrinciples` | 深 | DepthBlock「AI 使用提醒」 |
| 個資鐵規卡（`w15-privacy-card`） | 核 | 重要提醒 |
| `AIModePicker`（`w15-ai-mode`） | 記 | 選擇型 input |
| standalone／teach／verify 分支 | 核 | 活動素材 |
| └ verify：三層紅線判斷卡 | 核 | 驗收規則 |
| └ 卡內「3 個紅線實例」details | 深 | DepthBlock「常見錯誤」 |
| └ verify：`MethodSelector`（5 方法 prompt 分頁，`w15-method-selected`） | 核 | 活動素材，tab 狀態非繳交項 |
| └ 資料分析檢核站連結卡 | 核 | 連自學頁，保留 |
| └ ThinkRecord `w15-ai-feedback`／`w15-judge-table`／`w15-rejected`／`w15-human-context` | 記 | |
| └ 「採納回 Step 3 覆蓋」提醒卡 | 核 | |
| └ `AIDialogSubmission`（`w15-ai-dialog-submission`） | 記 | |

### Step 5 回顧繳交
| 區塊 | 類 | 備註 |
|---|---|---|
| 開場卡「AI 協作反思」 | 核 | |
| ThinkRecord `w15-ai-helpful`／`w15-ai-limit`／`w15-ai-blind-trust` | 記 | |
| `AIREDNarrative`（`w15-aired-record`，2 分支條件渲染） | 記 | |
| **`TrapRewritePractice`（`w15-trap-rewrite-3`）** | 記 | **從頁底搬進這裡**——雷 #3 是個人繳交項，放繳交卡附近。見 §7-2 |
| 雙線繳交主卡 | 核 | essential |
| **`BraveScientistReflection`（`w15-brave-scientist`）** | 記／選 | **從頁底搬進這裡**——W15 末反思，放繳交卡後。見 §7-3 |
| 「✅ 本週結束你應該要會」卡 | 核 | |
| `ExportButton` | 記 | 進 RecordDrawer |
| 遊戲彩蛋卡 | 選 | |

### StepEngine 外（頁面底部）
| 區塊 | 類 | 備註 |
|---|---|---|
| `ResearcherRedlines` mode="warning" | 核 | 警戒語；投影短版由共用元件處理 ✓ |
| `ThreeColumnConclusion` | — | **移進 Step 2** |
| `TrapRewritePractice` | — | **移進 Step 5** |
| `BraveScientistReflection` | — | **移進 Step 5** |
| `ResearcherRedlines` mode="subset" collapsible | 深 | DepthBlock「延伸補充」，移除 collapsible |

---

## 4. DepthBlock 標題對應（用 spec §6-2 固定詞表）

| 深度區塊 | DepthBlock 標題 |
|---|---|
| Step 1 名詞升級卡（推論→詮釋） | 延伸補充 |
| Step 1「『潤飾』是什麼 ✅/❌」sub-box | 常見錯誤 |
| Step 1「呼應層 5 方法範例」卡 | 看完整範例 |
| Step 1「示範：完整四層」DEMO | 看完整範例 |
| Step 3「相關 vs 因果」白話卡 | 延伸補充 |
| Step 4「AICollaborationPrinciples」 | AI 使用提醒 |
| Step 4「3 個紅線實例」details | 常見錯誤 |
| 頁底 ResearcherRedlines(subset) | 延伸補充 |

（標題分佈：延伸補充×3、常見錯誤×2、看完整範例×2、AI 使用提醒×1。）

---

## 5. RecordDrawer 要聚合的 dataKeys

EXPORT_FIELDS 內（修正後 17 個）：原 15 個（`w15-draft-describe`／`w15-draft-interpret`／`w15-draft-anchor`／`w15-draft-critique`／`w15-self-review`／`w15-ai-feedback`／`w15-judge-table`／`w15-rejected`／`w15-human-context`／`w15-final-draft`／`w15-ai-helpful`／`w15-ai-limit`／`w15-ai-blind-trust`／`w15-ai-dialog-submission`／`w15-aired-record`）＋ **`w15-three-column`（硬傷 A）**＋ **`w15-trap-rewrite-3`（硬傷 B）**。

元件自帶、**不在 EXPORT_FIELDS**：`w15-ai-mode`（AIModePicker）→ RecordDrawer extraFields。

**待老師決定**：`w15-brave-scientist`（BraveScientistReflection）——見 §7-3。

**非繳交項、不進 RecordDrawer**：`w15-method-selected`（MethodSelector 的 tab 狀態，純 UI state）。

RecordDrawer 方案 A：input 全部留在原 Step，drawer 只做總覽＋匯出。dataKey 一字不改。

---

## 6. 「刪除／移出」桶

- W15 **沒有 RouteSelector 等級的化石**——`CopyablePrompt`、`MethodSelector` 都有被 render。動工時 grep 確認一次（`<MethodSelector`、`<CopyablePrompt`）即可。
- **沒有「老師巡視」框架要改寫**——W15 的 Step 3「四層自查清單」本來就是學生自查，不是老師巡視框架，維持。

W15 減負純靠 DepthBlock 收合，沒有要刪／外移的內容。

---

## 7. 硬傷與待確認（Phase 2 必處理）

### 7-1.（硬傷·必修，需轉接）`w15-three-column` 沒進 EXPORT_FIELDS，且存 JSON 物件
「三欄自查」明列在個人繳交要求（雙線繳交個人作業 #2 ＋ exportReminder「三欄自查」），卻不在 EXPORT_FIELDS——做了匯不出＝繳交事故。
**但不能盲加**：`ThreeColumnConclusion` 寫的是 `localStorage.setItem(dataKey, JSON.stringify(物件))`——存的是**獨立 localStorage key 的 JSON 物件**，不是 `rib_think_records` 裡的字串。`ExportButton`／`readRecords` 只讀 `rib_think_records`，直接「加 key」匯出會是空白或一坨 raw JSON。
動工前先讀 `ThreeColumnConclusion.jsx`，做轉接，二選一：
- **(a)** 改 `ThreeColumnConclusion`：除了原本的獨立 key，**額外寫一份人類可讀字串**進 `rib_think_records[dataKey]`（參考 W14 Phase 2 對 `TrapRewritePractice` 的做法，但那個存字串、這個要先把物件序列化成可讀文字）。
- **(b)** 改 `ExportButton`：支援「物件型欄位 + formatter」。影響共用元件、範圍較大。
建議 (a)。

### 7-2.（硬傷·必修，好修）`w15-trap-rewrite-3` 沒進 EXPORT_FIELDS
雷 #3 改寫明列在個人繳交要求（雙線繳交個人作業 #3 ＋ exportReminder「雷 #3 改寫」），卻不在 EXPORT_FIELDS。跟 W13-7-2、W14-7-1 完全平行。`TrapRewritePractice` 的儲存已在 W14 Phase 2 改寫進 `rib_think_records`、存字串——這次直接加進 EXPORT_FIELDS 就 work，不用再動元件。

### 7-3.（待老師決定）`w15-brave-scientist` 要不要匯出
`BraveScientistReflection` 是 W15 末反思，沒明列在雙線繳交／exportReminder。它跟 `ThreeColumnConclusion` 一樣存**獨立 key 的 JSON 物件**。判斷題：
- **(a)** 當繳交項：要匯出 → 需跟 7-1 一樣做轉接（額外寫可讀字串進 `rib_think_records`）。
- **(b)** 不當繳交項：留著當頁面反思、不進 EXPORT_FIELDS（比照 W14 的 `w14-chart-choice` 處理：RecordDrawer extraFields 顯示「不匯出」，或乾脆不收）。
建議先問老師「W15 末的 brave scientist 反思算不算個人繳交內容」再定。

### 7-4.（化石掃描）W15 看起來乾淨
讀全檔沒看到 RouteSelector 等級的化石。Phase 2 動工時仍 grep 一次 `<MethodSelector`／`<CopyablePrompt` 確認 0 漏接，import 也掃一次有沒有孤兒（如 W13 的 `Brain`）。

### 7-5.（待確認，非必修）`<details>` 不吃 projector context
W15 有兩處 `<details>`：Step 1 沒有（已是卡片，不是 details）、Step 4「3 個紅線實例」是 details。處理：Step 4 的「3 個紅線」details 換成 DepthBlock（照 §4 → 常見錯誤）即自動吃投影收合。掃一次全頁 `<details` 確認沒有漏網的。

---

## 8. Phase 2 動工清單（13 項）

```
1.  讀 ThreeColumnConclusion.jsx → w15-three-column 做轉接 + 加進 EXPORT_FIELDS（硬傷 A）
2.  w15-trap-rewrite-3 加進 EXPORT_FIELDS（硬傷 B，直接加即可）
3.  （待老師定）w15-brave-scientist 是否匯出（硬傷 C，§7-3）
4.  化石掃描：grep <MethodSelector / <CopyablePrompt / 孤兒 import（W15 應該乾淨）
5.  ModeProvider + useMode + useProjector 拆 W15PageContent + ModeSwitch
6.  HeroBlock 第一屏只留三句（§2，todo prop）
7.  DepthBlock 包深度區塊（標題照 §4，含 Step 4「3 紅線」details → DepthBlock）
8.  ThreeColumnConclusion 移進 Step 2（4 個 draft ThinkRecord 之前）
9.  TrapRewritePractice 移進 Step 5；BraveScientistReflection 移進 Step 5
10. RecordDrawer 聚合總覽與匯出（extraFields: w15-ai-mode），input 留 Step
11. selfStudyStatus: partial + 自學補課路線 + 最低完成版（加進 lessonMaps W15Data）
12. 投影降密度：掃 <details> 確認都換 DepthBlock；ResearcherRedlines warning 已由共用元件處理
13. build 驗證 + grep dataKey 0 斷鏈 + 三情境測試（spec §9）
```
常數抽離（FOUR_LAYERS／METHOD_PROMPTS 等）→ Phase 6，這次不做。

---

## 9. 與 W13/W14 的差異速記（實作時注意）

- W15 **沒有化石**（W13 有 RouteSelector）——少一項清理。
- W15 **沒有「老師巡視」框架**——少一項改寫。
- W15 的硬傷最棘手：**兩個元件（ThreeColumnConclusion／BraveScientistReflection）存 JSON 物件到獨立 key**——其中 three-column 是明確繳交項，必須做轉接，不像 W13/W14 的 trap-rewrite 那麼好修。
- W15 有 **3 個飄在 StepEngine 外的 input 元件**（W13 只有 1 個 TrapRewritePractice、W14 有 2 個）——搬移動作較多。
- W15 **下游沒有跨週命脈**（W16/W17 不讀任何 w15- key）——比 W13 單純，不用顧 W15→W16 的 dataKey 鏈。但**上游有**：W15 讀 `w14-my-description`／`w14-my-inference`／`w14-w15-preview`，這些 W14 端不能動（W14 已遷移、key 沒變，OK）。
- W15 的 CourseArc 用 `W15Data.courseArc`（同 W14），不是 W13 的 inline——別誤改。

---

*建立：2026-05-15 ｜ Phase 1 產出，待授課老師審後進 Phase 2*
