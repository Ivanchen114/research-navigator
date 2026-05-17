# E 版 · 技術債暑假處理清單

> 撰寫於 2026-05-12
> 對應路徑：`/Users/Ivan/Documents/test/研究方法/00新教案/code/research-navigator/`
> 與 D 版（教學哲學深度啟發）並行，本版聚焦工程技術債。

---

## 結論一句話

> 另一份 Claude 給的是**理想路線**：寫 design doc → 找志工 → 大重構。
> 本清單是**務實路線**：先解決會痛的、能量化的，CSS 跟大重構碰到再說，不主動發起。

---

## 務實五步（暑假分批做）

### 1. 老師回饋按鈕（30 分鐘）
- **動作**：在 `App.jsx` 或共用 Layout 加一個浮動按鈕，連到 Google 表單（或 mailto:4057@sssh.tp.edu.tw）。
- **為什麼急**：學生在哪一週卡住、哪個 dataKey 文案看不懂，現在完全靠口頭回報。沒有回饋管道 → 改版就是憑印象。
- **驗收**：每週至少能收到 1 筆訊號（即便是「無回饋」也是訊號）。

### 2. Plausible / Umami 裝起來（30 分鐘）
- **動作**：選一個輕量、不放 cookie 的 page-level analytics（Plausible 或自架 Umami），在 `index.html` 加一行 script。
- **為什麼急**：知道哪幾頁學生點最多、哪幾頁打開就跳走。這是「教學設計的紅外線」。
- **不做**：interaction-level 事件追蹤（哪個 ThinkRecord 寫最多字）——那是 Phase 2 的事，現在做反而會誘導過度優化。

### 3. 大頁面加「章節標題」comment（1 小時）
- **動作**：W9 / W11 / W13 / W17 這幾個 800-1500 行的頁面，每個 step 上方加：
  ```jsx
  {/* ============================
       STEP 3 · 變項定義（method-aware）
       依 selectedMethod 分流：實驗 → IV/DV/EV；訪談 → 主題/維度
       ============================ */}
  ```
- **為什麼急**：未來找協作者進來，不可能直接看 1500 行的檔案找 step 3。這是「給未來的人」的成本最低修補。
- **不做**：拆檔。拆檔成本太高，回報不確定。

### 4. 寫教學版 design doc（3 小時）
- **動作**：在 `_介紹文件/` 寫一份 `architecture.md`：
  - 共用元件清單（HeroBlock / ThinkRecord / AIModePicker / ExportButton）+ 各自的 prop 慣例
  - dataKey 命名規則 + portfolioRegistry 機制
  - localStorage 鍵值規則（`rib_score_*` / `phantom_ch{N}_optimal` / `wN-step-*`）
  - 18 週路由 → weekLabel → 檔名的對照（含 W12-17 檔名錯位陷阱）
- **為什麼重要**：這份是「給暑假的自己」的記憶體外接。不寫 → 開學前要重新爬一遍。
- **不做**：寫成「對外公開」的 architecture decision record（ADR）。是給自己用的，不必要完美。

### 5. CSS 跟大重構：碰到再說，不主動
- **理由**：Tailwind JIT 已經夠用。CSS 變數系統、設計 token 化，這些是「規模大到 3+ 開發者協作」才需要的東西。現在我一個人 + 偶爾 Claude，不是這個規模。
- **觸發條件**（什麼時候才重啟）：
  - 找到固定協作者
  - 同時改超過 3 個檔案 + 視覺風格要求一致
  - 學生大量回報「某個顏色看不清楚」（這是真實訊號）

---

## 對另一份 Claude 計畫的態度

**同意**（70%）：
- 找協作者前要寫 design doc — 對，但要寫「夠用版」，不是「完美版」
- 不主動發起大重構 — 對，現有設計能跑

**挑戰**（3 點）：
- 對方建議「先寫 ADR」— 過度工程。我不是在維護 OSS，是在維護校訂必修課
- 對方建議「page-level + interaction-level 雙層 analytics」— 第一輪只裝 page-level 就好，避免誘導過度優化
- 對方略過「老師回饋按鈕」— 這是訊號源頭，比 analytics 更該先裝

**漏掉**（2 點）：
- 沒提「給自己用的 design doc」vs「給協作者用的 ADR」是兩件事
- 沒提 18 週路由/檔名錯位這種「踩坑必看」的內容

---

## 跟 _OPTIMIZATION_PLAN.md / D 版的關係

三條主軸平行：

| 主軸 | 性質 | 觸發時機 |
|---|---|---|
| **_OPTIMIZATION_PLAN.md** | 工程技術 + 教學內容缺口 | 學期中發現問題就補 |
| **D 版啟發補強** | 教學哲學深度（agency / 在場 / 動）| 暑假分批做 |
| **E 版（本檔）** | 技術債工程修補 | 暑假分批做 |

**建議暑假順序**：
1. E1 老師回饋按鈕（30 min，最該先做）
2. E2 Plausible（30 min，跟著做）
3. E4 教學版 design doc（3 hr，動手前先寫，避免重新爬）
4. D3 W3 動機溯源 ThinkRecord（1.5 hr，風險低、深度大）
5. E3 大頁面加 region comment（1 hr，邊改邊加）
6. D1 我還在想的事（4 hr，需要 17 週 EXPORT_FIELDS 同步）
7. D2 公開承諾（5.5 hr，影響 W6 結構）
8. _OPTIMIZATION_PLAN P2/P3（找協作者後再說）

**總工時**：E 版約 5 hr + D 版約 11 hr = **16 小時**（一個暑假完全做得完）

---

*更新時間：2026-05-12*
