# W2 紙上 migration（三模式＋投影架構）

> Phase 1 產出。依《三模式架構_實作spec.md》＋《網站定位與設計原則.md》。**這是規劃，不寫 code。**
> W1-W8 批次第二頁。W1/W13/W14/W15 已遷移；RecordDrawer 的 `choices` pass-through 已在 W1 補好。

---

## 0. W2 現況速覽

`ProblemFocus.jsx`（999 行）。結構：TOP BAR（含「教師流程」LessonMap toggle）→ `{showLessonMap && LessonMap}` → HeroBlock → CourseArc(`W2Data.courseArc`) → TaskCard → `StepEngine`（6 Step）。

**StepEngine 後面什麼都沒有**——W2 沒有飄移元件、沒有 ResearcherRedlines。跟 W1 一樣，StepEngine 是 return 最後一個東西。

6 個 Step：① 觀念建立 ② 暖身練習 ③ 人腦練習 ④ AI 協作 ⑤ 研究問題 ⑥ 回顧與繳交。

**W2 是目前最乾淨的一頁**：沒有 export 硬傷、沒有化石、沒有 `<details>`、沒有「老師巡視」框架。這次基本上就是「純三模式遷移」。

**內部元件**（都有 render，非化石）：`W2Beat1RefCard`／`W2Step4RefCard`（跨 Step 帶入卡）、`W2AuditPrompt`（研究問題審核器動態 Prompt）、`PracticeTabs`（看圖暖身）。共用元件 `BackfillField`（缺前置資料時的補填入口）。

---

## 1. selfStudyStatus：`full`（第一個完全可自學的週）

W2 全部是個人作業：四段式框架練習、看圖暖身、改寫 W1 觀察、AI 協作三輪、寫最終研究問題。**沒有小組討論、沒有老師現場示範**這類需真人的環節。

→ 標 `full`。自學模式的補課路線 ⑤「需要找人」改成「本週可完整自學，無需真人環節」。

### 自學補課路線（自學模式頂部固定顯示）
```
① 先看：Step 1 四段式框架（觀察／落差／假設／鎖定）＋ ABC 三型
② 做：Step 2 看圖暖身、Step 3 改寫 W1 觀察跑前三步、Step 4 AI 協作三輪、Step 5 寫最終研究問題
③ 補紀錄：暖身三格／人腦練習三格／挑假設＋ABC 判斷／研究問題草稿／AI 審後決定／最終研究問題／AI-RED／反思
④ 交：複製 W2 學習紀錄貼到 Google Classroom
⑤ 本週可完整自學——四段式練習、AI 協作、寫研究問題都是個人作業，無需真人環節。
```

### 最低完成版（缺課學生：至少做到這些才算補到核心）
```
① 用四段式框架把 W1 觀察寫成「現象／落差／假設清單」三格
② 挑一個假設、判 ABC 型、自寫一句研究問題草稿
③ 寫最終研究問題（帶去 W3，必填）
④ 填 AI-RED
⑤ 複製 W2 學習紀錄貼到 Classroom
```

---

## 2. 第一屏三句（套 spec §6-1 字數規格）

```
今天做什麼：把 W1 的生活觀察，用四段式框架收斂成一個可研究的問題。      （27 字 ✓）
為什麼做：　一句「為什麼」太大不能研究，要先切成「可以拿來研究」的問題。  （29 字 ✓）
今天交什麼：個人＝W2 學習紀錄（含最終研究問題，帶去 W3）。             （1 項，W2 無小組成果 ✓）
```
（現有 HeroBlock 的 subtitle/chain/meta 偏長，第一屏只留三句，其餘下放 DepthBlock「延伸補充」。）

---

## 3. 逐 Step 四分類

標記：【核】核心｜【深】深度（DepthBlock）｜【記】紀錄｜【移】刪除／移出／改寫｜【選】可選

### Step 1 觀念建立（全頁最密的一步）
| 區塊 | 類 | 備註 |
|---|---|---|
| PART 1 開場卡（h3＋說明＋💡 提示卡） | 核 | |
| StepBriefing | 核 | |
| 「📐 本週有三套編號」說明卡 | 深 | orientation 說明、老師會口頭講掉 → DepthBlock「延伸補充」 |
| 「為什麼還不能研究」示範卡（圖書館人很多） | 核 | W2 的 hook，核心概念 |
| 四段式框架表格（FOUR_STEPS，`w2-fw-table`） | 核 | W2 主架構，核心概念 |
| ABC 三型卡（ABC_TYPES，`w2-abc-row`） | 核 | W2 主架構，核心概念 |
| 「同一觀察 · 三種研究問題」三焦點示範卡 | 深 | worked example → DepthBlock「看完整範例」 |
| w2-notice（拿假設問自己…） | 核 | 小提示 |
| ThinkChoice `w2-tc1` | 記 | 走 ExportButton `choices` 機制 |

### Step 2 暖身練習
| 區塊 | 類 | 備註 |
|---|---|---|
| PART 2 開場卡／StepBriefing | 核 | |
| `<PracticeTabs />`（看圖暖身，2 tab × 3 ThinkRecord：`w2-practice1/2-phenomenon/gap/hypotheses`） | 核＋記 | 活動素材；6 個 dataKey 都在 EXPORT_FIELDS（見 §5） |

### Step 3 人腦練習
| 區塊 | 類 | 備註 |
|---|---|---|
| PART 2.5 開場卡／StepBriefing | 核 | |
| {w1Observe 帶入卡 ／ BackfillField `w1-life-observe`} | 核 | 跨週帶入，條件渲染 |
| 「練習 0：改寫你的 W1 觀察」卡 | 核 | 活動素材 |
| ThinkRecord `w2-step1-phenomenon`／`w2-step2-gap`／`w2-step3-question` | 記 | |

### Step 4 AI 協作
| 區塊 | 類 | 備註 |
|---|---|---|
| 第二節課開場卡／StepBriefing | 核 | |
| 「AI 補假設」選用提示卡 | 核 | 提示 |
| 研究問題審核器介紹卡 | 核 | |
| 第一輪：`<W2Beat1RefCard />` ＋ ThinkRecord `w2-abc-judgment`／`w2-rq-draft` | 核＋記 | |
| 第二輪：`<W2AuditPrompt />`（動態 Prompt） | 核 | 活動工具 |
| 第三輪：說明 ＋ ThinkRecord `w2-ai-intent-choice` | 核＋記 | |
| ThinkChoice `w2-tc2` | 記 | 走 `choices` 機制 |

### Step 5 研究問題
| 區塊 | 類 | 備註 |
|---|---|---|
| PART 3 FINAL 開場卡／StepBriefing | 核 | |
| `<W2Step4RefCard />` 帶入卡 | 核 | |
| ThinkRecord `w2-final-intent` | 記 | **跨週命脈——W3／W5 都讀，key 不能動** |
| `AIREDNarrative week="2"`（`w2-aired-record`） | 記 | optional={false}，已存在且正確 |

### Step 6 回顧與繳交
| 區塊 | 類 | 備註 |
|---|---|---|
| StepBriefing | 核 | |
| 「✅ 本週結束你應該要會」卡 | 核 | |
| ThinkRecord `w2-reflect-stuck` | 記 | |
| 「📤 最後一步」複製繳交卡 | 核 | |
| `ExportButton`（含 `choices={choiceResults}`） | 記 | 進 RecordDrawer（choices pass-through W1 已補） |

### StepEngine 外
W2 沒有 StepEngine 外的飄移元件——沒有要搬移的東西。

---

## 4. DepthBlock 標題對應（用 spec §6-2 固定詞表）

| 深度區塊 | DepthBlock 標題 |
|---|---|
| HeroBlock chain/meta（下放） | 延伸補充 |
| Step 1「📐 本週有三套編號」說明卡 | 延伸補充 |
| Step 1「同一觀察 · 三種研究問題」三焦點示範卡 | 看完整範例 |

只有 3 個——W2 跟 W1 一樣是「思考練習週」，四段式框架表格與 ABC 三型卡都是**核心主架構、不是深度補充**，不能收合。**不硬塞 DepthBlock**。

---

## 5. RecordDrawer 要聚合的 dataKeys

EXPORT_FIELDS 內（15 個，全部都有對應 input、無孤兒）：
`w2-practice1-phenomenon`／`w2-practice1-gap`／`w2-practice1-hypotheses`／`w2-practice2-phenomenon`／`w2-practice2-gap`／`w2-practice2-hypotheses`／`w2-step1-phenomenon`／`w2-step2-gap`／`w2-step3-question`／`w2-abc-judgment`／`w2-rq-draft`／`w2-ai-intent-choice`／`w2-final-intent`／`w2-aired-record`／`w2-reflect-stuck`

元件自帶／其他機制、**不在 RecordDrawer 欄位總覽**：
- `w2-tc1`／`w2-tc2`（ThinkChoice）——存 `think-choice::w2-tcN`，透過 ExportButton 的 `choices` prop 匯出（W1 已補 RecordDrawer 的 `choices` pass-through，這次直接用）。

W2 **沒有 RECORD_EXTRA_FIELDS**——所有 dataKey 不是在 EXPORT_FIELDS 就是走 `choices`。

RecordDrawer 方案 A：input 全部留在原 Step，drawer 只做總覽＋匯出。dataKey 一字不改。

---

## 6. 「刪除／移出」桶

- W2 **沒有化石**（內部元件 W2Beat1RefCard／W2Step4RefCard／W2AuditPrompt／PracticeTabs 都有 render；BackfillField／CopyButton／AIREDNarrative／LessonMap import 都用到）。
- W2 **沒有「老師巡視」框架**要改寫。
- **trivial cleanup（非必要）**：`ProblemFocus.jsx` 第 51-53 行有一段 stale 註解（提到 `PROMPT_INTENT` 常數「已不用」，但該常數早已不存在）；第 293-294 行的註解說 PracticeTabs 的 ThinkRecord「不納入 ExportButton」，但 EXPORT_FIELDS 其實有收（`w2-practice1/2-*`）。兩處都只是過時註解、不影響行為，動工經過時可順手刪／更正，不刪也無妨。

W2 沒有要刪／外移的內容。

---

## 7. 硬傷與待確認（Phase 2 必處理）

### 7-1.（無硬傷）
W2 沒有 export 孤兒欄位、沒有跨 store 轉接問題、沒有化石——這次是乾淨的純三模式遷移。

### 7-2.（待確認）`full` 週的自學模式補課路線寫法
W2 是第一個 `selfStudyStatus: full` 的週。`partial` 週（W1/W13/W14/W15）的補課路線 ⑤ 是「需要找人」；W2 沒有需真人的環節，所以 ⑤ 改寫成「本週可完整自學，無需真人環節」（見 §1）。其餘結構（先看／做／補紀錄／交＋最低完成版）維持，跟其他週一致。這是這次定的 `full` 週寫法慣例——之後 W3/W4/W5 若也是 `full` 就沿用。

### 7-3.（跨週命脈·必守）`w2-final-intent` 被 W3 與 W5 讀取
`w2-final-intent`（最終研究問題）被 `Wizard.jsx`（W3）與 `W5MeasurePage.jsx`（W5）讀取——是**多週命脈**。遷移不准改這個 key（migration 本來就不改 dataKey，但這條特別標記，因為斷了影響兩週）。同理 W2 讀的 `w1-life-observe` 也不能動（W1 端已遷移、key 沒變）。

### 7-4.（投影）W2 沒有 `<details>`
讀全檔 0 個 `<details>`，投影降密度全靠 DepthBlock + 共用元件。Phase 2 grep 一次確認。

---

## 8. Phase 2 動工清單（10 項）

```
1.  化石掃描：grep 確認 import 無孤兒、無 <details>（W2 應該乾淨）
2.  ModeProvider + useMode + useProjector 拆 ProblemFocusContent + ModeSwitch
3.  HeroBlock 第一屏只留三句（§2，todo prop）
4.  DepthBlock 包深度區塊（標題照 §4：三套編號說明卡、三焦點示範卡、chain/meta）
5.  RecordDrawer 聚合總覽與匯出（fields=EXPORT_FIELDS + choices={choiceResults}），input 留 Step
6.  ExportButton → RecordDrawer + 繳交提醒（W2 Step 6）
7.  selfStudyStatus: full + 自學補課路線（⑤ 用「無需真人環節」版）+ 最低完成版（加進 lessonMaps W2Data）
8.  投影降密度：W2 無 <details>，靠 DepthBlock + 共用元件即可
9.  （非必要）順手清 §6 兩處 stale 註解
10. build 驗證 + grep dataKey 0 斷鏈（特別確認 w2-final-intent 不變、W3/W5 讀得到；w1-life-observe 不變）+ 三情境測試
```
常數抽離（FOUR_STEPS／ABC_TYPES／PRACTICE_TABS／EXPORT_FIELDS）→ Phase 6，這次不做。

---

## 9. 與已遷移週的差異速記（實作時注意）

- W2 **最乾淨**：沒有硬傷、沒有化石、沒有飄移元件、沒有 `<details>`、沒有「老師巡視」——純三模式遷移。
- W2 是 **第一個 `full` 週**——自學補課路線 ⑤ 改「無需真人環節」（§7-2 立的慣例）。
- W2 **深度補充少**（只 3 個 DepthBlock）——它是思考練習週；四段式框架表格、ABC 三型卡是核心主架構，不收合。
- W2 **多一個 TOP BAR 的「教師流程」LessonMap toggle**（同 W1）——保留，別誤刪。
- W2 **用 ExportButton 的 `choices` prop**（同 W1）——RecordDrawer 的 `choices` pass-through W1 已補，這次直接傳 `choices={choiceResults}` 即可。
- 跨週命脈：W2 讀 `w1-life-observe`、寫 `w2-final-intent`（W3＋W5 都讀）——這次遷移**兩個 key 都不能碰**。
- W2 的內部元件（W2Beat1RefCard 等）會 `readRecords()` 讀跨 Step 的 dataKey——遷移不改 dataKey，所以這些帶入卡不受影響，但動工時別手滑改到。

---

*建立：2026-05-15 ｜ Phase 1 產出，待授課老師審後進 Phase 2*
