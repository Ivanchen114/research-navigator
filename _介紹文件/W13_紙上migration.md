# W13 紙上 migration（三模式＋投影架構）

> Phase 1 產出。依《三模式架構_實作spec.md》＋《網站定位與設計原則.md》。**這是規劃，不寫 code。**
> W13 是分析叢集（W13→W14→W15）往前補的第一頁。三模式遷移做完，投影支援大多由共用元件免費跟著來（Layout/StepEngine/DepthBlock/ResearcherRedlines 已 projector-aware）。

---

## 0. W13 現況速覽

`W13AutonomyPage.jsx`（1296 行）。結構：TOP BAR → HeroBlock → CourseArc(inline items) → TaskCard → 跨週帶入卡 → `ResearcherRedlines`(warning) → `StepEngine`（4 Step）→ `TrapRewritePractice` → `ResearcherRedlines`(subset collapsible)。

4 個 Step：① 認識資料 ② 動手整理 ③ 補充·AI 輔助（可選）④ 收尾繳交。

**W13 沒有外部 Google 文件模板**；分析表本身做在 Google Sheet（屬「正式文件」不是網頁紀錄），網頁只收歷程 input、用 ExportButton 匯出 docx。

**W13 的「重」**：5 法對照表（`METHOD_TABLE` 5 張卡＋每張一個 details 範例）是最大一塊；4 詞卡、AI 能/不能/三風險、訪談文獻組額外門檻也都不短。跟 W14 一樣——重不是雜物多，是一次攤太多，減負主要靠 DepthBlock 收合。

---

## 1. selfStudyStatus：`partial`

可自學：5 法對照、4 個詞、分析表結構觀念、AI 風險與驗收原則、雷 #9 改寫。
需真人：動手整理要老師巡視（編碼類別不重疊、灰色資料討論）；進度自評紅燈組老師一對一；雙線繳交小組成果要回組。

### 自學補課路線（自學模式頂部固定顯示）
```
① 先看：Step 1（5 法對照找自己這組／4 個詞）＋ Step 3 的 AI 風險與驗收原則
② 做：Step 2 拿自己 W11-W12 原始資料，定義分析表結構、動手整理一輪
③ 補紀錄：原始資料現況／分析表結構／（用 AI 則補驗收紀錄）／自我遷移／雷 #9 改寫
④ 交：個人 W13 歷程 docx（雷 #9 改寫、自我遷移、AI-RED 如有）
⑤ 需要找人：分析表結構、編碼類別不重疊要老師確認；小組原始＋分析表連結回組整合
```

### 最低完成版（缺課學生：至少做到這些才算補到核心）
```
① 完成一張分析表結構（欄位＋N 值，可以資料還沒填滿）
② 在網頁寫下分析表結構紀錄（w13-table-structure）
③ 完成雷 #9 改寫
④ 寫一句自我遷移（我們組最危險的資料紅線）
⑤ 匯出 W13 歷程 docx
```

---

## 2. 第一屏三句（套 spec §6-1 字數規格）

```
今天做什麼：把 W11-W12 的原始資料整理成一張可分析的表。            （20 字 ✓）
為什麼做：　表的欄位和 N 值要清楚，下週才畫得了圖、做得了分析。     （24 字 ✓）
今天交什麼：小組＝原始資料＋分析表連結；個人＝W13 歷程 docx        （2 項 ✓）
```
（現有 HeroBlock 的 subtitle/chain/meta 偏長，第一屏只留三句，其餘下放 DepthBlock「延伸補充」。）

---

## 3. 逐 Step 四分類

標記：【核】核心｜【深】深度（DepthBlock）｜【記】紀錄｜【移】刪除／移出／改寫｜【選】可選練習

### Step 1 認識資料
| 區塊 | 類 | 備註 |
|---|---|---|
| StepBriefing | 核 | |
| FindTraps 找雷連結卡 | 核 | 上課必看＋自學入口，活動素材 |
| 開場卡「原始資料→可分析的表」 | 核 | 可瘦身 |
| 4 詞卡（N值／半結構化／編碼類別／代碼化） | 深 | 名詞白話化 explainer → DepthBlock「延伸補充」 |
| 5 法對照表（METHOD_TABLE 5 卡） | 核 | 活動素材，學生要找自己這組 |
| └ 每張卡內的 details 範例（raw／table pre） | 深 | 已 details 自摺疊；投影模式 details 不吃 context，見 §7-5 |
| ThinkRecord `w13-data-state` | 記 | |

### Step 2 動手整理
| 區塊 | 類 | 備註 |
|---|---|---|
| StepBriefing／純人工開場卡 | 核 | |
| 執行步驟卡（逐步操作＋5 法分流 myOp/others details） | 核 | 活動素材；5 法分流 details 維持 |
| └ 卡內「老師巡視重點」段 | 移／改寫 | 改寫成「✅ 交之前自我檢查三件事」（兩模式通用核心），不直接刪 |
| **【硬傷 A】缺 `w13-table-structure` 的 ThinkRecord** | 記 | **必補**，見 §7-1 |
| 進度自評說明（🟢🟡🔴 不影響分數）＋ ProgressSelector（`w13-progress-status`）＋ picked.guide | 核＋記 | |

### Step 3 補充·AI 輔助（可選）
| 區塊 | 類 | 備註 |
|---|---|---|
| StepBriefing／核心原則卡 | 核 | |
| 「AI 能/不能＋三大風險」details | 深 | DepthBlock「常見錯誤」 |
| `AICollaborationPrinciples` | 深 | DepthBlock「AI 使用提醒」 |
| `AIModePicker`（`w13-ai-mode`） | 記 | 選擇型 input |
| standalone／teach／verify 分支內 PromptBlock＋說明 | 核 | 活動素材 |
| 強制驗收清單 | 核 | 做 AI 的人必看 |
| 訪談／文獻組額外門檻卡 | 核 | 驗收規則 |
| └ 卡內「差異怎麼算」sub-box | 深 | DepthBlock「看完整範例」 |
| ThinkRecord `w13-ai-validation` | 記 | |
| `AIDialogSubmission`（`w13-ai-dialog-submission`） | 記 | |

### Step 4 收尾繳交
| 區塊 | 類 | 備註 |
|---|---|---|
| StepBriefing | 核 | |
| 「🪞 自我遷移」卡 ＋ ThinkRecord `w13-self-transfer` | 核＋記 | |
| **`TrapRewritePractice`（`w13-trap-rewrite-9`）** | 記 | **從頁底搬進這裡**——雷 #9 是個人繳交項，放繳交卡附近 |
| 雙線繳交主卡 | 核 | essential |
| 資料分析檢核站連結卡 | 核 | 連自學頁，保留 |
| Checklist `w13-classroom-submit` | 記 | |
| ThinkRecord `w13-w14-question` | 記 | 跨週命脈，W14 讀此 key |
| 「5 法呈現範例」details | 深 | DepthBlock「看完整範例」 |
| `AIREDNarrative`（`w13-aired-record`，3 分支條件渲染） | 記 | |
| 「✅ 本週結束你應該要會」卡 | 核 | |
| `ExportButton` | 記 | 進 RecordDrawer |

### StepEngine 外（頁面底部）
| 區塊 | 類 | 備註 |
|---|---|---|
| `ResearcherRedlines` mode="warning" | 核 | 警戒語；投影短版已由共用元件處理 ✓ |
| `TrapRewritePractice` | — | **移進 Step 4** |
| `ResearcherRedlines` mode="subset" collapsible | 深 | DepthBlock「延伸補充」，移除 collapsible（避免雙重收合） |

---

## 4. DepthBlock 標題對應（用 spec §6-2 固定詞表）

| 深度區塊 | DepthBlock 標題 |
|---|---|
| Step 1「4 詞卡」 | 延伸補充 |
| Step 3「AI 能/不能＋三大風險」details | 常見錯誤 |
| Step 3「AICollaborationPrinciples」 | AI 使用提醒 |
| Step 3「差異怎麼算」sub-box | 看完整範例 |
| Step 4「5 法呈現範例」details | 看完整範例 |
| 頁底 ResearcherRedlines(subset) | 延伸補充 |

（Step 1 的 5 法對照表 per-card details 範例不換 DepthBlock——換掉會破壞卡片結構；投影降密度走 §7-5。）

---

## 5. RecordDrawer 要聚合的 dataKeys

EXPORT_FIELDS 內（修正後 10 個）：`w13-data-state`／**`w13-table-structure`（硬傷 A：要補 input）**／`w13-ai-validation`／`w13-ai-dialog-submission`／`w13-classroom-submit`／`w13-progress-status`／`w13-self-transfer`／`w13-w14-question`／`w13-aired-record`／**`w13-trap-rewrite-9`（硬傷 B：要加進 EXPORT_FIELDS）**

元件自帶、**不在 EXPORT_FIELDS**：`w13-ai-mode`（AIModePicker）→ RecordDrawer extraFields。

**化石、要清掉**：`w13-route-pick`（RouteSelector 整套未被 render）。

RecordDrawer 方案 A：input 全部留在原 Step，drawer 只做總覽＋匯出。dataKey 一字不改。

---

## 6. 「刪除／移出」桶

- **RouteSelector 整套**（`ROUTES`／`ROUTE_KEY`／`RouteSelector` 元件／`route` state／`handleRoute`／`pickedRoute`／dataKey `w13-route-pick`）——**化石，刪除**。定義齊全但從來沒被 render，留著是未爆彈。
- **Step 2「老師巡視重點」段**——課堂專屬框架，自學模式無「老師巡視」。**改寫**成「✅ 交之前自我檢查三件事」（兩模式通用核心），不直接刪。

W13 沒有其他該刪／外移的——減負靠 DepthBlock 收合。

---

## 7. 硬傷與待確認（Phase 2 必處理）

### 7-1.（硬傷·必修）`w13-table-structure` 在 EXPORT_FIELDS 但全頁無 input
標籤「我的分析表結構（必做）」、question 都寫好了，卻沒有任何 ThinkRecord 寫這個 key——學生被告知必做、沒地方填、ExportButton 永遠匯出空白。Phase 2 必補：Step 2「動手整理」（進度自評上方）加一個 ThinkRecord `dataKey="w13-table-structure"`，prompt／scaffold 用 EXPORT_FIELDS 既有的 question 文字。

### 7-2.（硬傷·必修）`w13-trap-rewrite-9` 沒進 EXPORT_FIELDS
雷 #9 改寫明列在個人繳交要求（雙線繳交主卡個人作業 #1），卻不在 EXPORT_FIELDS——做了匯不出＝繳交事故。跟 W14-7-1 完全平行。Phase 2 加進 EXPORT_FIELDS。`TrapRewritePractice` 的儲存已在 W14 Phase 2 改寫進 `rib_think_records`，這次直接 work，不用再動元件。

### 7-3.（硬傷／連貫·待老師決定）`w13-table-link` 斷鏈
W14「從 W13 帶過來·分析表連結」卡讀 `saved['w13-table-link']`，但 W13 從來沒寫——W14 那欄永遠空白。改版前就斷的鏈。修法判斷題：
- **(a)（建議）** 7-1 補 `w13-table-structure` ThinkRecord 時，同一張卡或旁邊再加一個 `w13-table-link` 欄讓學生貼 Google Sheet 連結。W14 真的需要這條連結。
- (b) 合進同一個 ThinkRecord（但 W14 讀的是獨立 key，要拆字串、較髒）。
- (c) 接受 W14 那張卡只靠 `w13-w14-question` 顯示，`w13-table-link` 永久空著。

### 7-4.（化石）RouteSelector 整套未被 render
見 §6。Phase 2 順手清掉。清的時候 grep 確認 `<RouteSelector` 真的 0 次使用再刪。

### 7-5.（待確認，非必修）`<details>` 不吃 projector context
投影模式不會自動收 `<details>`。Phase 2 投影降密度時：
- Step 1 的 5 法對照表 per-card details 範例——維持 `<details>`（換 DepthBlock 會破壞卡片結構），投影模式用 `!projector` 隱藏整個 details。
- Step 3「AI 能/不能」、Step 4「5 法呈現範例」等獨立 details——換成 DepthBlock（照 §4）。
- Step 2 的「5 法分流 myOp/others」details——維持，它是活動素材分流，不算深度。

---

## 8. Phase 2 動工清單（13 項）

```
1.  補 w13-table-structure ThinkRecord 到 Step 2（硬傷 A）
2.  w13-trap-rewrite-9 加進 EXPORT_FIELDS（硬傷 B）
3.  清掉 RouteSelector 化石整套（化石，grep 確認 0 使用再刪）
4.  ModeProvider + useMode 拆 W13PageContent + ModeSwitch
5.  HeroBlock 第一屏只留三句（§2，todo prop）
6.  DepthBlock 包深度區塊（標題照 §4）
7.  「老師巡視重點」改寫成「自我檢查三件事」
8.  TrapRewritePractice 移進 Step 4（W13 沒有 ChartChoiceChecker，少一項搬移）
9.  RecordDrawer 聚合總覽與匯出（extraFields: w13-ai-mode），input 留 Step
10. selfStudyStatus: partial + 自學補課路線 + 最低完成版（加進 lessonMaps W13Data）
11. 投影降密度：5 法對照表 details / 其他 details 處理（§7-5）
12. （待老師決定）w13-table-link 接 W14（§7-3，預設走方案 a）
13. build 驗證 + grep dataKey 0 斷鏈 + 三情境測試（spec §9）
```
常數抽離（METHOD_TABLE 等）→ Phase 6，這次不做。

---

## 9. 與 W14 的差異速記（實作時注意）

- W13 **沒有** ChartChoiceChecker（W14 專屬）——少一個搬移動作。
- W13 的 CourseArc 用 **inline items 陣列**，不是 `W13Data.courseArc`——不影響遷移，但別誤改。
- W13 多了 **RouteSelector 化石** 要清（W14 沒有對應化石）。
- W13 有 **`w13-table-structure` 缺 input** 的獨有硬傷（W14 是反過來：input 不在 EXPORT_FIELDS）。
- 跨週命脈：W13 寫 `w13-w14-question`（W14 讀）；若採 §7-3 方案 a，再加寫 `w13-table-link`（W14 讀）。**這兩個 key 一字不能改。**

---

*建立：2026-05-15 ｜ Phase 1 產出，待授課老師審後進 Phase 2*
