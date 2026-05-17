# W14 紙上 migration v2（三模式架構試點）

> Phase 1 產出，已整合一輪審查。依《三模式架構_實作spec.md》v3。**這是規劃，不寫 code。**
> v2 修訂：修「沒有 docx」措辭、w14-trap-rewrite-11 列為必修硬傷、飄底元件定落點、N 值卡拆兩層、遊戲入口改可選、加最低完成版、Phase 2 清單改 12 項。

---

## 0. W14 現況速覽

`W14Page.jsx`（1207 行）。結構：TOP BAR → HeroBlock → CourseArc → TaskCard → `ResearcherRedlines`(warning) → `StepEngine`（6 Step）→ `ChartChoiceChecker` → `TrapRewritePractice` → `ResearcherRedlines`(subset)。

6 個 Step：① 選對盤子 ② 圖表格式 ③ 描述 vs 推論 ④ 動手畫圖+圖說（6 子步 ①-⑥，**最重**）⑤ 進階·AI 壓測（可選）⑥ 回顧繳交。

**W14 沒有外部 Google 文件模板**；個人歷程靠網頁 input，再用 ExportButton 匯出成 **W14 歷程 docx**。input 元件約 19 個（見 §5）。

**一個重要觀察**：W14 的「重」不是「雜物多」，是「**一次攤太多**」。所以 §6 的「刪除／移出」桶很小（只 1 項）——減負主要靠 DepthBlock 收合。

---

## 1. selfStudyStatus：`partial`

可自學：選圖口訣、格式 3 鐵規、描述 vs 推論、AI 畫圖流程。
需真人：小組「圖＋圖說」成果要回組；Step 4 老師巡視、Step 6「W17 老師抽問」需課堂。

### 自學補課路線（自學模式頂部固定顯示）
```
① 先看：Step 1-3（選圖口訣／格式 3 鐵規／描述 vs 推論）
② 做：Step 4 拿自己 W13 分析表，畫第一張圖＋寫圖說（①-⑥ 照做）
③ 補紀錄：草圖判讀／圖表類型／驗收／描述／推論 ＋ 雷 #11 改寫 ＋ 自我遷移
④ 交：個人 W14 歷程 docx（雷 #11 改寫、自我遷移、AI-RED 如有）
⑤ 需要找人：小組「圖＋圖說」成果回組討論；老師巡視／抽問回課堂補
```

### 最低完成版（缺課學生：至少做到這些才算補到核心）
```
① 完成一張圖表（套 3 鐵規）
② 寫一段描述
③ 寫一段推論
④ 完成雷 #11 改寫
⑤ 匯出 W14 歷程 docx
```
（不是降低標準——是讓缺課學生有明確的最低底線。）

---

## 2. 第一屏三句（套 spec §6-1 字數規格）

```
今天做什麼：把 W13 分析表變成一張圖表和一段圖說。          （19 字 ✓）
為什麼做：　圖表要幫資料說話，選錯圖或說太滿都會誤導讀者。  （22 字 ✓）
今天交什麼：小組＝圖表＋圖說；個人＝W14 歷程 docx          （2 項 ✓）
```
（現有 HeroBlock 的 subtitle/chain/meta 偏長，第一屏只留上面三句，其餘下放。）

---

## 3. 逐 Step 四分類

標記：【核】核心｜【深】深度（DepthBlock）｜【記】紀錄（留 Step ＋ RecordDrawer 聚合）｜【移】刪除／移出｜【選】核心旁可選練習

### Step 1 選對盤子
| 區塊 | 類 | 備註 |
|---|---|---|
| StepBriefing／「🍽️ 選對盤子」開場卡 | 核 | 開場卡可瘦身 |
| 「📖 先搞懂一個詞：變項」卡 | 深 | 名詞白話化＝explainer |
| 四大圖表卡（CHART_TYPES）／口訣決策流程 | 核 | 活動素材 |
| 「🎤 訪談組專屬」卡 | 深 | 方法專屬深度 |
| ChartExercise 互動演練 ／ ThinkRecord `w14-chart-exercise` | 記 | |
| 「圖表除錯」case 卡 | 核 | 活動素材 |
| ThinkRecord `w14-chart-debug` | 記 | |

### Step 2 圖表格式
| 區塊 | 類 | 備註 |
|---|---|---|
| StepBriefing／開場卡／格式規範表（FORMAT_RULES） | 核 | 鐵規＝活動素材 |
| 「N 值」卡 — **拆兩層** | 核＋深 | 「N 值不能省」＝核（格式鐵規）；「為什麼 N 值重要」＝深（DepthBlock） |
| 「格式規範」case 卡 ／ ThinkRecord `w14-format-exercise` | 核／記 | |
| Chart Matcher 遊戲入口 | 選 | 顯示文字改「想再練一次可以進入」 |

### Step 3 描述 vs 推論
| 區塊 | 類 | 備註 |
|---|---|---|
| StepBriefing／開場卡／描述 vs 推論雙欄卡 | 核 | 核心概念 |
| 「⚠️ 常見錯誤」卡 | 深 | DepthBlock 標題「常見錯誤」 |
| 「整合練習」case 卡 ／ ThinkRecord `w14-case-3` | 核／記 | |
| Data Detective 遊戲入口 | 選 | 顯示文字改「想再練一次可以進入」 |

### Step 4 動手畫圖+圖說（最重，6 子步）
**Step 4 開頭加「6 子步進度提示」**（不拆 Step，但讓學生知道在走 6 個小關卡）：
```
Step 4｜動手畫圖與圖說 — 你會完成 6 件小事：
① 草圖判讀 ② 選圖表類型 ③ 產生／繪製圖表 ④ 人工驗收 ⑤ 寫描述 ⑥ 寫推論
```
| 區塊 | 類 | 備註 |
|---|---|---|
| StepBriefing／「🎯 分工」開場卡／W13 帶入卡 | 核 | |
| 第①步 草圖判讀卡 ＋ ThinkRecord `w14-pre-judgment` | 核＋記 | |
| 第②步 選類型卡 ＋ ThinkRecord `w14-my-chart-type` | 核＋記 | |
| **`ChartChoiceChecker`（`w14-chart-choice`）** | 記 | **從頁底搬進這裡**——它檢核的就是「你自己選的圖」，對應第②步 |
| 第③步 AI 畫圖卡 ＋ PromptBlock ＋ 學生提醒卡 | 核 | prompt＝活動素材 |
| 「替代路線：自己畫」details | 核 | 已自摺疊、真實路徑選項 |
| 第④步 人工驗收卡 ＋ 驗收 checklist | 核 | |
| └ 「怎麼改 prompt 重畫」內層 details | 深 | DepthBlock「常見錯誤」 |
| ThinkRecord `w14-validation-check` | 記 | |
| 第⑤步 寫描述卡 ＋ AI 描述檢核 prompt details | 核 | |
| ThinkRecord `w14-my-description` | 記 | |
| 第⑥步 寫推論卡 | 核 | |
| └ 「⚖️ 圖說兩層」內層說明 box | 深 | DepthBlock「想知道為什麼？」 |
| ThinkRecord `w14-my-inference` | 記 | |
| 「👀 老師巡視會檢查三件事」卡 | 移／改寫 | 改寫成「✅ 動手前自我檢查三件事」當核心（兩模式通用） |

### Step 5 進階·AI 壓測（可選）
| 區塊 | 類 | 備註 |
|---|---|---|
| StepBriefing／「🥊 進階定位」開場卡／「資料分析檢核站」連結卡 | 核 | 連結卡連到自學頁，保留 |
| 「反思鏡」說明 ＋ `AICollaborationPrinciples` | 深 | DepthBlock「AI 使用提醒」 |
| `AIModePicker`（`w14-ai-mode`） | 記 | 選擇型 input |
| teach／verify／standalone 三分支內 PromptBlock ＋ 說明框 | 核 | |
| ThinkRecord `w14-teach-reflection`／`w14-ai-blindspot`／`w14-ai-pressure-test` | 記 | |
| `AIDialogSubmission`（`w14-ai-dialog-submission`） | 記 | |

### Step 6 回顧繳交
| 區塊 | 類 | 備註 |
|---|---|---|
| StepBriefing／「📋 今天學了兩件事」卡 | 核 | |
| 「🪞 自我遷移」卡 ＋ ThinkRecord `w14-self-transfer` | 核＋記 | |
| **`TrapRewritePractice`（`w14-trap-rewrite-11`）** | 記 | **從頁底搬進這裡**——雷 #11 是個人繳交項，放繳交卡附近 |
| 雙線繳交主卡 | 核 | essential |
| 「W15 預告」卡 ＋ ThinkRecord `w14-w15-preview` | 核＋記 | |
| `AIREDNarrative`（`w14-aired-record`，3 分支條件渲染） | 記 | |
| 「學期 AI 協作反思」卡 ＋ ThinkRecord `w14-semester-reflection` | 核＋記 | |
| 「✅ 本週結束你應該要會」卡 | 核 | |
| `ExportButton` | 記 | 進 RecordDrawer |
| 遊戲彩蛋卡 | 選 | |

### StepEngine 外（頁面底部）
| 區塊 | 類 | 備註 |
|---|---|---|
| `ResearcherRedlines` mode="warning"（任務前 3 條紅線） | 核 | 警戒語 |
| `ChartChoiceChecker` | — | **移進 Step 4**（見上） |
| `TrapRewritePractice` | — | **移進 Step 6**（見上） |
| `ResearcherRedlines` mode="subset" collapsible（5 條完整版） | 深 | 已自摺疊；DepthBlock「延伸補充」 |

---

## 4. DepthBlock 標題對應（用 spec §6-2 固定詞表）

| 深度區塊 | DepthBlock 標題 |
|---|---|
| 「先搞懂一個詞：變項」卡 | 延伸補充 |
| 「🎤 訪談組專屬」卡 | 延伸補充 |
| Step 2「為什麼 N 值重要」（拆出來的理由層） | 想知道為什麼？ |
| Step 3「⚠️ 常見錯誤」卡 | 常見錯誤 |
| Step 4「怎麼改 prompt 重畫」details | 常見錯誤 |
| Step 4「⚖️ 圖說兩層」box | 想知道為什麼？ |
| Step 5「反思鏡」＋ AICollaborationPrinciples | AI 使用提醒 |
| 頁底 ResearcherRedlines(subset) | 延伸補充 |

---

## 5. RecordDrawer 要聚合的 dataKeys

EXPORT_FIELDS 內（17 個）：`w14-chart-exercise`／`w14-chart-debug`／`w14-format-exercise`／`w14-case-3`／`w14-pre-judgment`／`w14-my-chart-type`／`w14-teach-reflection`／`w14-ai-blindspot`／`w14-validation-check`／`w14-my-description`／`w14-my-inference`／`w14-ai-pressure-test`／`w14-ai-dialog-submission`／`w14-self-transfer`／`w14-w15-preview`／`w14-aired-record`／`w14-semester-reflection`

元件自帶、**不在 EXPORT_FIELDS**：`w14-ai-mode`（AIModePicker）／`w14-chart-choice`（ChartChoiceChecker）／**`w14-trap-rewrite-11`（TrapRewritePractice）← 必修，見 §7-1**

RecordDrawer 方案 A：input 全部留在原 Step，drawer 只做「總覽＋匯出」。dataKey **一字不改**。

---

## 6. 「刪除／移出」桶（W14 只 1 項）

- **「👀 老師巡視會檢查三件事」卡**（Step 4）——課堂專屬框架，自學模式無「老師巡視」。**改寫**成「✅ 動手前自我檢查三件事」當核心（兩模式通用），不是直接刪。

W14 沒有其他該刪／外移的——減負靠 DepthBlock 收合，不靠清雜物。

---

## 7. 硬傷與待確認（Phase 2 必處理）

### 7-1.（硬傷·必修）`w14-trap-rewrite-11` 沒進 EXPORT_FIELDS
雷 #11 改寫**明列在個人繳交要求**，卻不在 EXPORT_FIELDS——學生做了，ExportButton 匯出卻沒有 ＝ **繳交事故**。Phase 2 必加。
**但不能盲加**：動工前先讀 `TrapRewritePractice` 元件，確認它寫入 localStorage 的**資料形狀** ExportButton 撐得住——若存的是物件結構而非字串，「加 key」不會自動 work，要先做轉接。
（`w14-chart-choice` 可再判斷要不要匯出；`w14-trap-rewrite-11` 是繳交項，必須。）

### 7-2.（硬傷·必修）兩個 input 元件飄在 StepEngine 外
`ChartChoiceChecker`／`TrapRewritePractice` 是 input 卻在步驟流程外——學生走完 6 步以為結束了。Phase 2 搬進步驟流程：
- `ChartChoiceChecker` → **Step 4**（第②步選類型附近）
- `TrapRewritePractice` → **Step 6**（繳交卡附近）

### 7-3.（待確認，非必修）Step 4 仍是最重
即使深度收合，Step 4 還是 6 子步。三模式不拆 Step——但 §3 已加「6 子步進度提示」緩解。要不要真的拆 Step 4 是獨立議題，不在這次範圍。

### 7-4. 訪談組專屬卡
包進 DepthBlock 後非訪談組收合、訪談組展開。三模式沒有「方法分流」軸——第一版當一般 DepthBlock，效果不好再議。

---

## 8. Phase 2 動工清單（12 項）

```
1.  先修文案：「W14 沒有外部 Google 文件模板，歷程由 ExportButton 匯出 docx」
2.  讀 TrapRewritePractice 元件確認資料形狀 → w14-trap-rewrite-11 加進 EXPORT_FIELDS
3.  ModeProvider + ModeSwitch（含模式指引小字）
4.  HeroBlock 第一屏只留三句（§2）
5.  DepthBlock 包深度區塊（標題照 §4）
6.  「老師巡視」改寫成「自我檢查三件事」（核心）
7.  Step 4 開頭加 6 子步進度提示
8.  ChartChoiceChecker 移進 Step 4；TrapRewritePractice 移進 Step 6
9.  RecordDrawer 聚合總覽與匯出，input 留 Step
10. selfStudyStatus: partial + 自學補課路線 + 最低完成版
11. build 驗證 + grep dataKey 0 斷鏈
12. 三情境測試（spec §9）
```
常數抽離（CHART_TYPES 等）→ Phase 6，這次不做。

---

*建立：2026-05-15 ｜ v2 修訂：2026-05-15（整合一輪審查）｜待授課老師最終 GO 進 Phase 2*
