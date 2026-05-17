# Phase A 投影模式 — Review Bundle

> 產生時間：2026-05-15 01:13
> **這份是「磁碟上的實際檔案內容」直接打包，不是複製貼上——零 stale 風險。**
> 你（GPT）如果覺得某段「沒整合」，先假設是你看錯，不是檔案沒做——這份就是當下真實狀態。

---

## 一、給 GPT 的 review 指令

請不要只給泛泛意見。請做三件事：

### 1. 跑驗收自測（最重要）
- **情境 A 投影**：老師把畫面放大投影。第一屏會不會被 header 吃掉？一眼能不能看到一個主任務？
- **情境 B 一般顯示**：投影 OFF 時，頁面跟改之前是否一模一樣？（projector 預設 false）
- **情境 C 不破壞**：學生上課/自學模式、RecordDrawer 匯出、dataKey——有沒有被動到？

### 2. 對照「已和老師確認的設計約束」逐條檢查
1. **不做 projectorEssential**：投影模式下所有 DepthBlock 一律收合，老師需要時手動點開。不該有「這塊投影要不要顯示」的 per-block 旗標。
2. **ProjectorContext 獨立全域**：包在 App.jsx，不併進每週的 ModeContext（ModeContext 是 per-week 的）。
3. **不主動放大字級**：Phase A 只做去 chrome、降密度、收合長內容。字級交給老師的瀏覽器縮放，避免雙重放大。
4. **ProjectorToggle**：命名「投影顯示」不是「教師模式」；要有明顯的「退出投影」路徑（因為狀態存 localStorage，手機誤開不能找不到路）。
5. **投影只是顯示層**：不改作業邏輯、不搬 input、不動 dataKey。

### 3. 重點戳這幾個風險
- `useProjector()` 在 `ProjectorProvider` 外被呼叫會怎樣？（context 預設值是否安全）
- `DepthBlock` / `StepEngine` / `ResearcherRedlines` 被其他 16 週共用——projector=false 時行為有沒有跟改之前不一樣？
- 投影模式手機版：mobile header 隱藏了、hamburger 也跟著沒了、sidebar 收掉——「退出投影」的路徑夠不夠明顯、夠不夠救得回來？
- `Layout` 用 CSS 覆寫收 sidebar（不動 isDesktopCollapsed 狀態）——退出投影後 sidebar 會不會正確回到原本狀態？

---

## 二、變更摘要

**新骨架（永久結構，projector OFF 時行為零變化）**
- 新增 `ProjectorContext.jsx`：全域、localStorage 鍵 `rib-projector`。
- `App.jsx`：BrowserRouter 內、Routes 外包 `ProjectorProvider`。
- 新增文件《網站定位與設計原則.md》。
- `Layout.jsx`：多一個 ProjectorToggle 按鈕（OFF 桌機右上小鈕／手機選單裡；ON 一律浮動「退出投影」鈕）。

**只在投影 ON 才生效**
- Layout：隱藏 mobile header + 收掉 sidebar。
- StepEngine：6 顆 tab 導覽 → 單行「‹ STEP x / y · 名稱 ›」。
- DepthBlock：一律收合（即使自學模式）。
- ResearcherRedlines 警戒語：只留短標題，破折號詳解隱藏。
- W14Page 格式規範表：只留鐵規本身，長範例隱藏。

**完全沒動**：學生 input、dataKey、上課/自學 mode 行為、RecordDrawer 邏輯、其他 16 週。

**本次「故意沒做」（不要當 bug 報）**
- Step 4「一次只顯示一個子步」→ 需 substep 狀態機，列 Phase B。
- HeroBlock / TaskCard 投影短版 → Phase B。
- RecordDrawer 投影時縮成角落按鈕 → 待老師確認要不要做。
- 其他 16 週套用 → Phase C。

---

## 三、檔案內容（磁碟實際內容）


═══════════════════════════════════════════════════════════
FILE: _介紹文件/網站定位與設計原則.md   [新增]
═══════════════════════════════════════════════════════════

# 網站定位與設計原則

> 全站最高原則，與《網頁定位鐵律》《三模式架構_實作spec》並列當「尺」。
> 改任何一週、任何元件前，先回來對照這份。

---

## 核心一句話

> **手機留痕跡，文件做成果，Classroom 收作業。**

網站負責留下「學習歷程與研究判斷」；正式研究文件回到 Google 文件、Sheet 與小組工具；Classroom 收正式作業。

---

## 一、網站核心定位

這個網站**不是**線上教科書，也**不是**取代 Google 文件的研究文件編輯器。

它是：**「研究方法與專題的課堂學習歷程工作台」**。

主要用途：
1. 老師上課投影帶節奏
2. 學生課堂跟做
3. 學生留下「短而有用」的研究痕跡
4. 學生匯出學習歷程 docx
5. 學生把歷程檔上傳到 Google Classroom 作業區
6. 缺課／複習時用自學模式補上基本理解

手機適合留下研究痕跡，不適合完成研究文件。正式文件以 Google 文件、Sheet、工具設計書、計畫書等外部文件為主。

## 二、網站不該做的事

不要把網站做成：手機版 Google 文件、長文寫作平台、完整線上教科書、所有研究文件的正式撰寫區、每週大量輸入的表單系統、讓學生整堂課低頭打字的平台。

網站記錄的是「學習歷程與研究判斷」，不是取代正式文件。

## 三、學生手機使用原則

每一步任務要符合手機操作限制。

手機適合：勾選、選擇、寫一句短答、寫一個判斷理由、複製 prompt、記錄 AI 給的一個有用提醒、記錄採納／不採納的理由、匯出歷程。

手機不適合：長文撰寫、多段修訂、大量表格整理、正式圖表製作、小組共編文件、大量複製貼上、完整研究報告撰寫。

設計原則：每個 Step 的手機任務控制在 1–3 分鐘內；每個輸入欄以「一句話、兩句話、三點以內」為原則；避免連續低頭打字超過 5 分鐘。

## 四、學習歷程紀錄原則

只要本週有學到重要概念、做出研究判斷、使用 AI 協作、修正原本想法，就應留下紀錄——**但紀錄量要小**。

每週歷程建議含：我今天做了什麼判斷／我原本怎麼想／我後來改了什麼／我用了什麼 AI 協助（如有）／AI 提醒我什麼／我最後採納或不採納什麼／我還需要回去修什麼正式文件。

不要要求學生在網頁中完成整段正式報告。

## 五、Classroom 繳交定位

Google Classroom 是正式繳交區。

網站負責：課堂紀錄、歷程暫存、匯出 docx、提醒學生交到 Classroom。
Classroom 負責：收作業、留存正式繳交紀錄、教師批閱與評分。

每次有學習歷程作業時，網站要清楚標示：「完成後，請匯出本週學習歷程 docx，並上傳到 Google Classroom 指定作業區。」

## 六、模式分層（三層，不是平行模式）

```
學習模式：上課跟做 / 自學補課        ← ModeSwitch（per-week）
顯示模式：一般顯示 / 投影顯示        ← ProjectorToggle（全站）
產出區：  我的紀錄 / 匯出            ← RecordDrawer
```

- 「投影顯示」不是另一份教材，是「上課跟做」的低密度顯示層。
- 「我的紀錄」不是第三種學習模式，是學生檢查自己填了什麼、匯出什麼的區域。

## 七、上課跟做模式

學生課堂使用的主模式。每個 Step 應含：現在任務／一個短範例或提示／一個短輸入或選擇或檢核／下一步提示。

不要在上課跟做模式攤開大量教學說明。深度內容放進 DepthBlock，預設收合。

## 八、自學補課模式

用於：缺課學生、課後複習、想看完整說明的學生。

可展開：為什麼要做這件事、完整範例、常見錯誤、AI 使用提醒、補課最低完成版。

但不要把自學模式變成超長教科書。每週自學模式應有：本週能不能完整自學／不能的話哪些部分需要真人互動／最低完成版要做哪些事／最後要交什麼到 Classroom。

## 九、投影顯示

老師上課投影用。不是另一套內容，是「上課跟做」的簡報外觀。

原則：少字、大字、一屏一任務、一次一個主要焦點、補充說明收合、輸入框不主動搶畫面、Header 最小化。

每個投影畫面：主標 1 句、重點最多 3 點、每點最多 1 行半、不要讓學生在投影上讀長段文字。

目標：讓全班知道現在做什麼，不是讓學生在投影上閱讀完整內容。

## 十、每週頁面第一屏規格

只保留三件事：
- 今天做什麼：1 句，30 字內
- 為什麼做：1 句，40 字內
- 今天交什麼：最多分小組／個人兩項

## 十一、每個 Step 任務規格

```
現在任務：一句話說清楚這一步要做什麼
你要完成：最多 3 點
完成後：  告訴學生下一步去哪裡
```

輸入以短答為主。若需長文，改成「先在網頁寫一句判斷，正式段落回 Google 文件完成」。

## 十二、AI 使用紀錄原則

不要要求學生貼整段 AI 對話到網頁。網頁只需記錄：我用了哪個 AI／我問了什麼／AI 提醒我什麼／我採納或不採納什麼／我最後如何判斷。

完整 AI 對話若需留存，附在 Classroom 或文件中，網頁不要變成大量貼對話的平台。

## 十三、正式文件 vs 網站紀錄分工

| 網站紀錄 | 正式文件 |
|---|---|
| 短判斷、學習反思、AI 使用紀錄、紅線理解、本週修正方向 | 研究計畫書、工具設計書、Google Form、訪綱、觀察紀錄表、Google Sheet、圖表與圖說、結論章初稿、期末海報 |

網站只提醒學生「正式內容要回哪個文件修」，不要求在手機網頁完成正式文件。

## 十四、全站檢查問題（改每一週時用）

1. 這一頁是否讓學生第一眼知道今天做什麼？
2. 這一步是否手機可以完成？
3. 若不適合手機，是否明確標示回 Google 文件或 Sheet 完成？
4. 學生是否只需要短紀錄，而不是長文撰寫？
5. 老師投影時，一屏文字會不會太多？
6. 學生端與投影端的 Step 編號、名稱、任務句是否一致？
7. 本週最後要交什麼到 Classroom 是否清楚？
8. AI 使用是否留下判斷，而不是只貼結果？
9. RecordDrawer 是否只是總覽與匯出，而不是新的學習模式？
10. DepthBlock 是否只是補充，不是新的雜物間？

## 十五、實作建議

不要一次重寫 17 週。建議順序：
1. 把本定位寫進專案設計文件（本檔）
2. 調整共用元件：Layout、HeroBlock、StepEngine、DepthBlock、RecordDrawer、ModeContext、ProjectorContext
3. 用 W14 驗證
4. 通過後逐週套用 W1–W17
5. 每週只做四件事：第一屏三句／Step 任務短句／長說明收合／繳交到 Classroom 指引

---

*建立：2026-05-15 ｜ 來源：授課老師（艾文）對網站定位的重新界定。投影需求浮現後，確認網站核心不是「線上教材」或「手機版文件」，而是「課堂學習歷程工作台」。*


═══════════════════════════════════════════════════════════
FILE: src/context/ProjectorContext.jsx   [新增]
═══════════════════════════════════════════════════════════

import React, { createContext, useContext, useState, useEffect } from 'react';

/**
 * ProjectorContext — 全站「投影顯示」開關
 *
 * 跟 ModeContext（每週各自的 上課/自學）不同：
 *   - 投影顯示是老師整堂課、甚至跨週連續使用的「顯示層」狀態 → 必須全域、單一。
 *   - 所以這個 Provider 包在 App.jsx 最外層（BrowserRouter 內、Routes 外），
 *     不掛在任何一週的 ModeProvider 裡。
 *
 * 投影顯示不是第四種教材，只改「怎麼呈現」，不改作業邏輯：
 *   - Layout：隱藏 mobile header
 *   - StepEngine：導覽列精簡
 *   - DepthBlock：一律收合
 *   - 各週頁面：降低文字密度
 *
 * localStorage 鍵：rib-projector（全域，非 w{N}- 前綴）
 */

const ProjectorContext = createContext({
    projector: false,
    setProjector: () => {},
    toggleProjector: () => {},
});

const STORAGE_KEY = 'rib-projector';

export function ProjectorProvider({ children }) {
    const [projector, setProjectorState] = useState(false);

    // 掛載後讀回上次狀態——投影開著、重整或跨週都不會掉
    useEffect(() => {
        try {
            if (localStorage.getItem(STORAGE_KEY) === '1') setProjectorState(true);
        } catch { /* localStorage 不可用時維持預設 false */ }
    }, []);

    const setProjector = (on) => {
        const next = Boolean(on);
        setProjectorState(next);
        try { localStorage.setItem(STORAGE_KEY, next ? '1' : '0'); } catch { /* 忽略 */ }
    };

    const toggleProjector = () => setProjector(!projector);

    return (
        <ProjectorContext.Provider value={{ projector, setProjector, toggleProjector }}>
            {children}
        </ProjectorContext.Provider>
    );
}

export function useProjector() {
    return useContext(ProjectorContext);
}

export default ProjectorProvider;


═══════════════════════════════════════════════════════════
FILE: src/App.jsx   [改]
═══════════════════════════════════════════════════════════

import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './layouts/Layout';
import { Home } from './pages/Home';
import { ProjectorProvider } from './context/ProjectorContext';

/* Eager: Layout 與 Home 是首屏必載；其餘 route 懶載入以減少首包大小。
   .then(m => ({ default: m.X ?? m.default })) — 兼容 named export 與 default export 兩種情況 */

const Wizard = lazy(() => import('./pages/Wizard').then(m => ({ default: m.Wizard ?? m.default })));
const Discovery = lazy(() => import('./pages/Discovery').then(m => ({ default: m.Discovery ?? m.default })));
const W1Page = lazy(() => import('./pages/W1Page').then(m => ({ default: m.W1Page ?? m.default })));
const ProblemFocus = lazy(() => import('./pages/ProblemFocus').then(m => ({ default: m.ProblemFocus ?? m.default })));
const W4Page = lazy(() => import('./pages/W4Page').then(m => ({ default: m.W4Page ?? m.default })));
const W5MeasurePage = lazy(() => import('./pages/W5MeasurePage').then(m => ({ default: m.W5MeasurePage ?? m.default })));
const W6PosterTeamPage = lazy(() => import('./pages/W6PosterTeamPage').then(m => ({ default: m.W6PosterTeamPage ?? m.default })));
const W50Page = lazy(() => import('./pages/W50Page').then(m => ({ default: m.W50Page ?? m.default })));
const LiteratureReview = lazy(() => import('./pages/LiteratureReview').then(m => ({ default: m.LiteratureReview ?? m.default })));
const W9Page = lazy(() => import('./pages/W9Page').then(m => ({ default: m.W9Page ?? m.default })));
const ToolRefinementPage = lazy(() => import('./pages/ToolRefinementPage').then(m => ({ default: m.ToolRefinementPage ?? m.default })));
const MethodToolbookPage = lazy(() => import('./pages/MethodToolbookPage').then(m => ({ default: m.MethodToolbookPage ?? m.default })));
const OperationalizePage = lazy(() => import('./pages/OperationalizePage').then(m => ({ default: m.OperationalizePage ?? m.default })));
const W11Page = lazy(() => import('./pages/W11Page').then(m => ({ default: m.W11Page ?? m.default })));
const W12Page = lazy(() => import('./pages/W12Page').then(m => ({ default: m.W12Page ?? m.default })));
const W13AutonomyPage = lazy(() => import('./pages/W13AutonomyPage').then(m => ({ default: m.W13AutonomyPage ?? m.default })));
const W14Page = lazy(() => import('./pages/W14Page').then(m => ({ default: m.W14Page ?? m.default })));
const W15Page = lazy(() => import('./pages/W15Page').then(m => ({ default: m.W15Page ?? m.default })));
const W16Page = lazy(() => import('./pages/W16Page').then(m => ({ default: m.W16Page ?? m.default })));
const W17Page = lazy(() => import('./pages/W17Page').then(m => ({ default: m.W17Page ?? m.default })));
const GameHub = lazy(() => import('./pages/games/GameHub').then(m => ({ default: m.GameHub ?? m.default })));
const ToolQuizGame = lazy(() => import('./pages/games/ToolQuizGame').then(m => ({ default: m.ToolQuizGame ?? m.default })));
const CitationDetectiveGame = lazy(() => import('./pages/games/CitationDetectiveGame').then(m => ({ default: m.CitationDetectiveGame ?? m.default })));
const QuestionERGame = lazy(() => import('./pages/games/QuestionERGame').then(m => ({ default: m.QuestionERGame ?? m.default })));
const RxInspectorGame = lazy(() => import('./pages/games/RxInspectorGame').then(m => ({ default: m.RxInspectorGame ?? m.default })));
const DataDetectiveGame = lazy(() => import('./pages/games/DataDetectiveGame').then(m => ({ default: m.DataDetectiveGame ?? m.default })));
const ChartMatcherGame = lazy(() => import('./pages/games/ChartMatcherGame').then(m => ({ default: m.ChartMatcherGame ?? m.default })));
const PromptLab = lazy(() => import('./pages/PromptLab').then(m => ({ default: m.PromptLab ?? m.default })));
const FindTrapsReport = lazy(() => import('./pages/FindTrapsReport').then(m => ({ default: m.FindTrapsReport ?? m.default })));
const DataAnalysisStation = lazy(() => import('./pages/DataAnalysisStation').then(m => ({ default: m.DataAnalysisStation ?? m.default })));
const Dossier = lazy(() => import('./pages/Dossier').then(m => ({ default: m.Dossier ?? m.default })));
const Portfolio = lazy(() => import('./pages/Portfolio').then(m => ({ default: m.Portfolio ?? m.default })));
const AboutPage = lazy(() => import('./pages/AboutPage').then(m => ({ default: m.AboutPage ?? m.default })));
const PhantomDataHub = lazy(() => import('./pages/games/PhantomDataHub').then(m => ({ default: m.PhantomDataHub ?? m.default })));
const PhantomCh1 = lazy(() => import('./pages/games/PhantomCh1').then(m => ({ default: m.PhantomCh1 ?? m.default })));
const PhantomCh2 = lazy(() => import('./pages/games/PhantomCh2').then(m => ({ default: m.PhantomCh2 ?? m.default })));
const PhantomCh3 = lazy(() => import('./pages/games/PhantomCh3').then(m => ({ default: m.PhantomCh3 ?? m.default })));
const PhantomCh4 = lazy(() => import('./pages/games/PhantomCh4').then(m => ({ default: m.PhantomCh4 ?? m.default })));
const PhantomCh5 = lazy(() => import('./pages/games/PhantomCh5').then(m => ({ default: m.PhantomCh5 ?? m.default })));
const EchoHub = lazy(() => import('./pages/games/EchoHub').then(m => ({ default: m.EchoHub ?? m.default })));
const EchoCh1 = lazy(() => import('./pages/games/EchoCh1').then(m => ({ default: m.EchoCh1 ?? m.default })));
const EchoCh2 = lazy(() => import('./pages/games/EchoCh2').then(m => ({ default: m.EchoCh2 ?? m.default })));
const EchoCh3 = lazy(() => import('./pages/games/EchoCh3').then(m => ({ default: m.EchoCh3 ?? m.default })));
const EchoCh4 = lazy(() => import('./pages/games/EchoCh4').then(m => ({ default: m.EchoCh4 ?? m.default })));
const EchoCh5 = lazy(() => import('./pages/games/EchoCh5').then(m => ({ default: m.EchoCh5 ?? m.default })));
const NotFound = lazy(() => import('./pages/NotFound').then(m => ({ default: m.NotFound ?? m.default })));

const RouteFallback = () => (
  <div style={{ padding: 40, textAlign: 'center', fontFamily: 'Noto Sans TC, sans-serif', color: '#4a4a6a' }}>載入中…</div>
);

function App() {
  return (
    <BrowserRouter>
      <ProjectorProvider>
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="discovery" element={<Discovery />} />
            <Route path="w0" element={<Discovery />} />
            <Route path="w1" element={<W1Page />} />
            <Route path="problem-focus" element={<ProblemFocus />} />
            <Route path="w2" element={<ProblemFocus />} />
            <Route path="wizard" element={<Wizard />} />
            <Route path="w3" element={<Wizard />} />
            <Route path="w4" element={<W4Page />} />
            <Route path="w5" element={<W5MeasurePage />} />
            <Route path="w6" element={<W6PosterTeamPage />} />
            <Route path="w7" element={<W50Page />} />
            <Route path="w8" element={<LiteratureReview />} />
            <Route path="w9" element={<W9Page />} />
            <Route path="w10" element={<ToolRefinementPage />} />
            <Route path="w11" element={<W11Page />} />
            <Route path="w12" element={<W12Page />} />
            <Route path="w13" element={<W13AutonomyPage />} />
            <Route path="w14" element={<W14Page />} />
            <Route path="w15" element={<W15Page />} />
            <Route path="w16" element={<W16Page />} />
            <Route path="w17" element={<W17Page />} />

            <Route path="tools/methods" element={<MethodToolbookPage />} />
            <Route path="tools/operationalize" element={<OperationalizePage />} />

            <Route path="games" element={<GameHub />} />
            <Route path="game/question-er" element={<QuestionERGame />} />
            <Route path="game/rx-inspector" element={<RxInspectorGame />} />
            <Route path="game/tool-quiz" element={<ToolQuizGame />} />
            <Route path="game/citation-detective" element={<CitationDetectiveGame />} />
            <Route path="game/data-detective" element={<DataDetectiveGame />} />
            <Route path="game/chart-matcher" element={<ChartMatcherGame />} />
            <Route path="prompt-lab" element={<PromptLab />} />
            <Route path="find-traps" element={<FindTrapsReport />} />
            <Route path="analysis-station" element={<DataAnalysisStation />} />
            <Route path="dossier" element={<Dossier />} />
            <Route path="portfolio" element={<Portfolio />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="phantom" element={<PhantomDataHub />} />
            <Route path="phantom/ch1" element={<PhantomCh1 />} />
            <Route path="phantom/ch2" element={<PhantomCh2 />} />
            <Route path="phantom/ch3" element={<PhantomCh3 />} />
            <Route path="phantom/ch4" element={<PhantomCh4 />} />
            <Route path="phantom/ch5" element={<PhantomCh5 />} />
            <Route path="echo" element={<EchoHub />} />
            <Route path="echo/ch1" element={<EchoCh1 />} />
            <Route path="echo/ch2" element={<EchoCh2 />} />
            <Route path="echo/ch3" element={<EchoCh3 />} />
            <Route path="echo/ch4" element={<EchoCh4 />} />
            <Route path="echo/ch5" element={<EchoCh5 />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
      </ProjectorProvider>
    </BrowserRouter>
  );
}

export default App;


═══════════════════════════════════════════════════════════
FILE: src/layouts/Layout.jsx   [改]
═══════════════════════════════════════════════════════════

import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { Menu, X, PanelLeftClose, PanelLeftOpen, Projector } from 'lucide-react';
import { Footer } from '../components/Footer';
import { useProjector } from '../context/ProjectorContext';

export const Layout = () => {
    const { projector, toggleProjector } = useProjector();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(() => {
        if (typeof window === 'undefined') return false;
        return localStorage.getItem('researchNavigator_sidebarCollapsed') === '1';
    });
    const [maxWeek, setMaxWeek] = useState(0);
    const location = useLocation();

    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
    const toggleDesktopSidebar = () => {
        setIsDesktopCollapsed(prev => {
            const next = !prev;
            localStorage.setItem('researchNavigator_sidebarCollapsed', next ? '1' : '0');
            return next;
        });
    };

    // Scroll to top on route change (handles all pagination Link clicks)
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'instant' });
    }, [location.pathname]);

    /* ESC 關閉手機選單（a11y：鍵盤使用者必備） */
    useEffect(() => {
        if (!isMobileMenuOpen) return;
        const onKey = (e) => {
            if (e.key === 'Escape') setIsMobileMenuOpen(false);
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [isMobileMenuOpen]);

    // 注意：item.status 改由下方 dynamicSections 依當前路由 + maxWeek 動態計算
    // （規則：當前頁=active、走過的週次=done、其餘=none；不再 locked）。
    // 此處 navSections 不再寫死 status 欄位，避免被誤以為是真實狀態。
    const navSections = [
        {
            label: '任務大廳',
            items: [
                { name: '任務總覽', path: '/' },
                { name: 'R.I.B. 特務指揮中心', path: '/games' },
            ]
        },
        {
            label: '我的檔案',
            items: [
                { name: '探員檔案', path: '/dossier' },
                { name: '學習歷程策展室', path: '/portfolio' },
            ]
        },
        {
            label: '研究工具',
            items: [
                { name: '方法工具書', path: '/tools/methods' },
                { name: '操作型定義範例', path: '/tools/operationalize' },
                { name: 'AI 協作實驗室（自學）', path: '/prompt-lab' },
                { name: '資料分析檢核站（自學）', path: '/analysis-station' },
                { name: 'AI 報告找雷挑戰', path: '/find-traps' },
            ]
        },
        {
            label: '課程進度',
            sublabel: '階段一·問題意識',
            items: [
                { name: '偵探特訓班', path: '/w0', week: 'W0' },
                { name: '模仿遊戲', path: '/w1', week: 'W1' },
                { name: '四段式框架', path: '/w2', week: 'W2' },
                { name: '題目健檢', path: '/w3', week: 'W3' },
            ]
        },
        {
            sublabel: '階段二·研究規劃',
            items: [
                { name: '方法地圖', path: '/w4', week: 'W4' },
                { name: '操作型定義', path: '/w5', week: 'W5' },
                { name: '海報博覽會', path: '/w6', week: 'W6' },
                { name: '文獻搜尋', path: '/w7', week: 'W7' },
                { name: '文獻偵探社', path: '/w8', week: 'W8' },
            ]
        },
        {
            sublabel: '階段三·計畫定稿',
            items: [
                { name: '計畫書·五章地基', path: '/w9', week: 'W9' },
                { name: '計畫書·整本定稿', path: '/w10', week: 'W10' },
            ]
        },
        {
            sublabel: '階段四·執行檢核',
            items: [
                { name: '預試與倫理', path: '/w11', week: 'W11' },
                { name: '期中短報', path: '/w12', week: 'W12' },
            ]
        },
        {
            sublabel: '階段五·分析與發表',
            items: [
                { name: '資料整理週', path: '/w13', week: 'W13' },
                { name: '圖表與圖說', path: '/w14', week: 'W14' },
                { name: '研究結論', path: '/w15', week: 'W15' },
                { name: '報告與海報', path: '/w16', week: 'W16' },
                { name: '成果發表', path: '/w17', week: 'W17' }
            ]
        },
        {
            label: '關於',
            items: [
                { name: '關於本站', path: '/about' },
            ]
        }
    ];

    // Improved status logic purely for demo UX
    // We dynamically override "active", "done", and "locked" based on the current route.
    const getWeekNumber = (path) => {
        if (!path) return -1;
        // Clean up path - handle both descriptive and week-based routes
        if (path === '/discovery' || path === '/w0') return 0;
        if (path === '/w1') return 1;
        if (path === '/problem-focus' || path === '/w2') return 2;
        if (path === '/wizard' || path === '/w3') return 3;
        if (path === '/w4') return 4;
        if (path === '/w5') return 5;
        if (path === '/w6') return 6;
        if (path === '/w7') return 7;
        if (path === '/w8') return 8;
        if (path === '/w9') return 9;
        if (path === '/w10') return 10;
        if (path === '/w11') return 11;
        if (path === '/w12') return 12;
        if (path === '/w13') return 13;
        if (path === '/w14') return 14;
        if (path === '/w15') return 15;
        if (path === '/w16') return 16;
        if (path === '/w17') return 17;
        return -1;
    }

    const currentWeekNum = getWeekNumber(location.pathname);

    // Update maxWeek based on current location and persist to localStorage
    useEffect(() => {
        if (currentWeekNum !== -1) {
            setMaxWeek(prevMax => {
                const newMax = Math.max(prevMax, currentWeekNum);
                localStorage.setItem('researchNavigator_maxWeek', newMax.toString());
                return newMax;
            });
        }
    }, [currentWeekNum]);

    // Initialize from localStorage on mount
    useEffect(() => {
        const storedMax = localStorage.getItem('researchNavigator_maxWeek');
        if (storedMax) {
            setMaxWeek(parseInt(storedMax, 10));
        }
    }, []);

    const dynamicSections = navSections.map(section => ({
        ...section,
        items: section.items.map(item => {
            let finalStatus = 'none';

            if (item.path === '/') {
                if (location.pathname === '/') finalStatus = 'active';
            } else if (item.path === '/games') {
                if (location.pathname === '/games' || location.pathname.startsWith('/game/')) finalStatus = 'active';
            } else if (item.path === '/dossier') {
                if (location.pathname === '/dossier') finalStatus = 'active';
            } else if (item.path === '/portfolio') {
                if (location.pathname === '/portfolio') finalStatus = 'active';
            } else if (item.path === '/analysis-station') {
                if (location.pathname === '/analysis-station') finalStatus = 'active';
            } else if (item.path === '/prompt-lab') {
                if (location.pathname === '/prompt-lab') finalStatus = 'active';
            } else if (item.path === '/find-traps') {
                if (location.pathname === '/find-traps') finalStatus = 'active';
            } else if (item.path === '/about') {
                if (location.pathname === '/about') finalStatus = 'active';
            } else {
                const itemWeekNum = getWeekNumber(item.path);
                if (itemWeekNum !== -1) {
                    if (item.path === location.pathname) {
                        finalStatus = 'active';
                    } else if (itemWeekNum <= maxWeek) {
                        finalStatus = 'done';
                    }
                    // 不再鎖定——所有週次皆可點擊
                }
            }

            return { ...item, status: finalStatus };
        })
    }));


    return (
        <div className="flex min-h-screen bg-[#f8f7f4] font-['Noto_Sans_TC',sans-serif] text-[14px] leading-[1.6]">

            {/* Mobile Sidebar Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 z-40 bg-slate-900/50 md:hidden"
                    onClick={toggleMobileMenu}
                />
            )}

            {/* SIDEBAR — 投影顯示時整個收掉（純顯示層覆寫，不動 isDesktopCollapsed 狀態）*/}
            <aside
                className={`fixed top-0 left-0 z-50 w-[240px] h-screen bg-white border-r border-[#dddbd5] flex flex-col transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
                    } ${(isDesktopCollapsed || projector) ? 'md:-translate-x-full' : 'md:translate-x-0'}`}
            >
                {/* Brand Header */}
                <div className="p-[24px_20px_20px] border-b border-[#dddbd5] flex items-start justify-between gap-2">
                    <div className="min-w-0">
                        <div className="flex items-center gap-[10px] mb-1">
                            <img src="/songshan-logo.svg" alt="松山高中" className="w-8 h-8 bg-white border border-[#dddbd5] rounded-lg p-0.5 shrink-0" />
                            <div className="font-['Noto_Serif_TC',serif] font-bold text-[15px] text-[#1a1a2e] truncate">
                                研究方法與專題
                            </div>
                        </div>
                        <div className="text-[11px] text-[#8888aa] tracking-[0.05em] ml-[42px]">
                            松山高中 SSSH
                        </div>
                    </div>
                    {/* 桌面版收合按鈕 */}
                    <button
                        onClick={toggleDesktopSidebar}
                        className="hidden md:flex shrink-0 w-7 h-7 items-center justify-center rounded-[6px] text-[#8888aa] hover:bg-[#f8f7f4] hover:text-[#1a1a2e] transition-colors"
                        title="收合側邊欄"
                        aria-label="收合側邊欄"
                    >
                        <PanelLeftClose size={16} />
                    </button>
                </div>

                {/* 投影顯示開關 — 手機版放選單裡（桌機用右上浮動鈕）*/}
                <button
                    onClick={() => { toggleProjector(); setIsMobileMenuOpen(false); }}
                    className="md:hidden flex items-center gap-2 mx-[20px] my-3 px-3 py-2 rounded-[6px] border border-[#dddbd5] text-[12px] text-[#4a4a6a] hover:bg-[#f8f7f4] hover:text-[#1a1a2e] transition-colors"
                >
                    <Projector size={14} />
                    投影顯示（老師上課用）
                </button>

                {/* Navigation Links */}
                <nav id="mobile-sidebar-nav" className="flex-1 py-4 overflow-y-auto">
                    {dynamicSections.map((section, sIdx) => (
                        <div key={sIdx}>
                            {section.label && (
                                <div className={`text-[9px] font-bold tracking-[0.2em] text-[#8888aa] opacity-80 uppercase px-[20px] pb-1 ${sIdx > 0 ? 'mt-2 pt-2' : 'pt-2'}`}>
                                    {section.label}
                                </div>
                            )}

                            {section.sublabel && (
                                <div className="text-[9px] text-[#bbb] pt-1 pb-1 px-[20px]">
                                    {section.sublabel}
                                </div>
                            )}

                            {section.items.map((item, iIdx) => (
                                <NavLink
                                    key={iIdx}
                                    to={item.path}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={(navData) => {
                                        // Use our computed status rather than pure router active state for styling
                                        const isActive = item.status === 'active';
                                        const isDone = item.status === 'done';
                                        const isLocked = item.status === 'locked';

                                        let baseClasses = "flex items-center gap-2 py-[7px] px-[20px] text-[13px] transition-all duration-150 border-l-[3px] decoration-none outline-none ";

                                        if (isActive) {
                                            baseClasses += "text-[#2d5be3] bg-[#e8eeff] border-[#2d5be3] font-medium";
                                        } else if (isLocked) {
                                            baseClasses += "text-[#8888aa] border-transparent opacity-40 cursor-default";
                                        } else {
                                            baseClasses += "text-[#4a4a6a] border-transparent hover:bg-[#f8f7f4] hover:text-[#1a1a2e]";
                                        }
                                        return baseClasses;
                                    }}
                                >
                                    <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${item.status === 'active' ? 'bg-[#2d5be3] shadow-[0_0_0_3px_#e8eeff]' :
                                        item.status === 'done' ? 'bg-[#2e7d5a]' :
                                            item.status === 'locked' ? 'bg-[#c8c5bc]' :
                                                'bg-[#c8c5bc]'
                                        }`} />
                                    {item.name}
                                    {item.week && (
                                        <span className={`ml-auto text-[10px] font-['DM_Mono',monospace] px-1.5 py-[1px] rounded-[3px] ${item.status === 'active' ? 'bg-[#e8eeff] text-[#2d5be3]' :
                                            'bg-[#f0ede6] text-[#8888aa]'
                                            }`}>
                                            {item.week}
                                        </span>
                                    )}
                                </NavLink>
                            ))}
                        </div>
                    ))}
                </nav>

                {/* AIRed Footer */}
                <div className="p-[14px_20px] border-t border-[#dddbd5]">
                    <div className="flex items-center gap-2 text-[11px] text-[#8888aa]">
                        <span>AI-RED</span>
                        <span className="font-['DM_Mono',monospace] bg-[#1a1a2e] text-white px-1.5 py-0.5 rounded-[3px] text-[10px]">
                            學習框架
                        </span>
                    </div>
                    <div className="mt-1.5 text-[10px] text-[#aaa8a0] font-['DM_Mono',monospace] tracking-wider">
                        UPDATED · 2026.04.19
                    </div>
                </div>
            </aside>

            {/* 桌面版浮動展開按鈕（僅於收合時顯示；投影顯示時不顯示）*/}
            {isDesktopCollapsed && !projector && (
                <button
                    onClick={toggleDesktopSidebar}
                    className="hidden md:flex fixed top-4 left-4 z-40 w-10 h-10 items-center justify-center rounded-[8px] bg-white border border-[#dddbd5] text-[#4a4a6a] hover:text-[#1a1a2e] hover:border-[#2d5be3] hover:shadow-md transition-all"
                    title="展開側邊欄"
                    aria-label="展開側邊欄"
                >
                    <PanelLeftOpen size={18} />
                </button>
            )}

            {/* 投影顯示開關 — 全域浮動。OFF：桌機右上小鈕；ON：一律可見的退出鈕（手機誤開也找得到路）*/}
            {projector ? (
                <button
                    onClick={toggleProjector}
                    className="fixed top-3 right-3 z-[60] flex items-center gap-1.5 px-3 py-2 rounded-[8px] bg-[#1a1a2e] text-white text-[12px] font-bold shadow-lg hover:opacity-90 transition-opacity"
                    title="退出投影顯示"
                >
                    <Projector size={15} />
                    退出投影
                </button>
            ) : (
                <button
                    onClick={toggleProjector}
                    className="hidden md:flex fixed top-4 right-4 z-40 w-10 h-10 items-center justify-center rounded-[8px] bg-white border border-[#dddbd5] text-[#4a4a6a] hover:text-[#1a1a2e] hover:border-[#2d5be3] hover:shadow-md transition-all"
                    title="投影顯示（老師上課用）"
                    aria-label="開啟投影顯示"
                >
                    <Projector size={18} />
                </button>
            )}

            {/* MAIN CONTENT AREA — 投影顯示時不留 sidebar 邊距 */}
            <div className={`flex flex-col flex-1 w-full min-w-0 transition-[margin] duration-300 ease-in-out ${(isDesktopCollapsed || projector) ? 'md:ml-0' : 'md:ml-[240px]'}`}>
                {/* Mobile Header — 投影顯示時隱藏，把垂直空間還給投影畫面 */}
                {!projector && (
                <div className="md:hidden bg-white border-b border-[#dddbd5] p-3 flex justify-between items-center z-20 sticky top-0">
                    <div className="flex items-center gap-2">
                        <img src="/songshan-logo.svg" alt="松山高中" className="w-6 h-6 bg-white border border-[#dddbd5] rounded p-0.5" />
                        <h1 className="font-['Noto_Serif_TC',serif] font-bold text-[14px] text-[#1a1a2e]">研究方法與專題</h1>
                    </div>
                    <button
                        onClick={toggleMobileMenu}
                        className="text-[#4a4a6a] focus:outline-none p-1"
                        aria-label={isMobileMenuOpen ? '關閉選單' : '開啟選單'}
                        aria-expanded={isMobileMenuOpen}
                        aria-controls="mobile-sidebar-nav"
                    >
                        {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
                )}

                <main className="flex-1 w-full relative">
                    <Outlet />
                    <Footer />
                </main>
            </div>

        </div>
    );
};


═══════════════════════════════════════════════════════════
FILE: src/components/ui/StepEngine.jsx   [改]
═══════════════════════════════════════════════════════════

import React, { useState, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { useProjector } from '../../context/ProjectorContext';

/**
 * StepEngine — 一屏一任務分步導覽
 *
 * Props:
 *   steps     (array, required) — [{ title, icon, content: <JSX> }, ...]
 *   prevWeek  (object)          — { label: '回 W1 模仿遊戲', to: '/w1' }
 *   nextWeek  (object)          — { label: '前往 W3 題目健檢', to: '/w3' }
 *   weekCode  (string)          — 顯示在底部檔案編號列，如 "R.I.B. · W2"
 *   flat      (boolean)         — 拿掉內容面板的白卡外殼，讓內容直接跟頁面背景融合
 *   className (string)
 */

export default function StepEngine({ steps, prevWeek, nextWeek, weekCode, flat = false, className = '' }) {
  const { projector } = useProjector();
  const [current, setCurrent] = useState(0);
  const total = steps.length;
  const topRef = useRef(null);

  const isFirst = current === 0;
  const isLast = current === total - 1;

  // 從 to (例 "/w3") 提取簡短週標籤 (例 "W3")，給手機顯示用
  const extractShortLabel = (to) => {
    if (!to) return '';
    const m = String(to).match(/^\/?(w\d+|dossier|home|games?|portfolio)/i);
    if (!m) return '';
    return m[1].toUpperCase();
  };

  const goTo = useCallback((idx) => {
    if (idx >= 0 && idx < total) {
      setCurrent(idx);
      requestAnimationFrame(() => {
        topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  }, [total]);

  return (
    <div className={`step-engine ${className}`} ref={topRef}>
      {/* STEP 計數器 — 當前步驟 / 總步驟（投影顯示時改用下方精簡導覽列，這條隱藏）*/}
      {!projector && (
        <div className="flex items-center justify-between mb-3">
          <div className="text-[10px] font-mono text-[var(--ink-light)] uppercase tracking-[0.18em]">
            STEP {current + 1} <span className="text-[var(--border-mid)]">/ {total}</span>
          </div>
          {steps[current]?.title && (
            <div className="text-[10px] font-mono text-[var(--ink-light)] uppercase tracking-[0.1em]">
              {steps[current].title}
            </div>
          )}
        </div>
      )}

      {/* 導覽列 — 投影顯示：精簡成「當前 step」單行；一般顯示：完整 tab 列 */}
      {projector ? (
        <nav className="flex items-center justify-center gap-4 mb-6 pb-3 border-b border-[var(--border)]">
          <button
            onClick={() => goTo(current - 1)}
            disabled={isFirst}
            className="flex items-center justify-center w-9 h-9 rounded-[8px] text-[var(--ink-mid)] hover:bg-[var(--paper-warm)] disabled:opacity-25 disabled:cursor-default transition-colors"
            aria-label="上一步"
          >
            <ChevronLeft size={20} />
          </button>
          <span className="flex items-center gap-2 text-[var(--ink)]">
            <span className="font-mono text-[12px] text-[var(--ink-light)]">STEP {current + 1} / {total}</span>
            <span className="text-[16px] font-bold">· {steps[current]?.title}</span>
          </span>
          <button
            onClick={() => goTo(current + 1)}
            disabled={isLast}
            className="flex items-center justify-center w-9 h-9 rounded-[8px] text-[var(--ink-mid)] hover:bg-[var(--paper-warm)] disabled:opacity-25 disabled:cursor-default transition-colors"
            aria-label="下一步"
          >
            <ChevronRight size={20} />
          </button>
        </nav>
      ) : (
        <nav
          className={`flex gap-1 mb-6 overflow-x-auto ${
            flat ? 'pb-3 border-b border-[var(--border)]' : 'pb-1'
          }`}
        >
          {steps.map((step, i) => {
            const isActive = i === current;
            const isPast = i < current;
            return (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`
                  flex items-center gap-1.5 px-3 py-2 rounded-[8px] text-[13px] font-mono
                  whitespace-nowrap transition-all flex-shrink-0
                  ${isActive
                    ? 'bg-[var(--ink)] text-white font-bold shadow-sm'
                    : isPast
                      ? 'bg-[var(--success-light)] text-[var(--success)] font-medium'
                      : 'bg-[var(--paper-warm)] text-[var(--ink-light)] hover:text-[var(--ink-mid)] hover:bg-[var(--paper)]'
                  }
                `}
              >
                <span className="text-[12px]">{step.icon || `${i + 1}`}</span>
                <span>{step.title}</span>
                {isPast && <span className="text-[10px]">✓</span>}
              </button>
            );
          })}
        </nav>
      )}

      {/* 內容面板 */}
      <div
        className={
          flat
            ? 'step-engine-panel py-2 min-h-[200px]'
            : 'step-engine-panel bg-white border border-[var(--border)] rounded-[var(--radius-unified)] p-6 min-h-[200px]'
        }
      >
        {steps[current]?.content}
      </div>

      {/* 底部導覽 — flat 模式內容沒白框包裝，需要更大上距建立呼吸 */}
      <div className={`flex items-center justify-between ${flat ? 'mt-10 pt-4 border-t border-[var(--border)]' : 'mt-4'}`}>
        {/* 左側：上一步 或 回上週 */}
        {isFirst && prevWeek ? (
          <Link
            to={prevWeek.to}
            className="flex items-center gap-1 px-3 py-2 text-[13px] font-mono text-[var(--ink-light)] hover:text-[var(--ink)] transition-colors"
            title={prevWeek.label}
          >
            <ChevronLeft size={14} />
            <span className="hidden sm:inline">{prevWeek.label}</span>
            <span className="sm:hidden">{extractShortLabel(prevWeek.to) || '上週'}</span>
          </Link>
        ) : (
          <button
            onClick={() => goTo(current - 1)}
            disabled={isFirst}
            className="flex items-center gap-1 px-3 py-2 text-[13px] font-mono text-[var(--ink-mid)] hover:text-[var(--ink)] disabled:opacity-30 disabled:cursor-default transition-colors"
          >
            <ChevronLeft size={14} /> 上一步
          </button>
        )}

        {/* 圓點進度 */}
        <div className="flex items-center gap-2">
          {steps.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`
                w-2.5 h-2.5 rounded-full transition-all
                ${i === current
                  ? 'bg-[var(--accent)] scale-125'
                  : i < current
                    ? 'bg-[var(--success)]'
                    : 'bg-[var(--border-mid)]'
                }
              `}
              aria-label={`前往第 ${i + 1} 步`}
            />
          ))}
        </div>

        {/* 右側：下一步 或 前往下週 */}
        {isLast && nextWeek ? (
          <Link
            to={nextWeek.to}
            className="flex items-center gap-2 px-5 py-3 bg-[var(--accent)] text-white text-[13px] font-bold rounded-[8px] hover:brightness-110 transition-all group shadow-md shadow-[var(--accent)]/20"
            title={nextWeek.label}
          >
            <span className="hidden sm:inline">{nextWeek.label}</span>
            <span className="sm:hidden">前往 {extractShortLabel(nextWeek.to) || '下週'}</span>
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        ) : (
          <button
            onClick={() => goTo(current + 1)}
            disabled={isLast}
            className="flex items-center gap-2 px-5 py-2.5 bg-white border-2 border-[var(--ink)] text-[var(--ink)] text-[13px] font-bold rounded-[8px] hover:bg-[var(--ink)] hover:text-white active:bg-[var(--ink)] active:text-white disabled:opacity-30 disabled:cursor-default transition-all group"
          >
            下一步 <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
        )}
      </div>

      {/* 檔案編號頁尾 */}
      {weekCode && (
        <div className="mt-8 pt-4 border-t border-dashed border-[var(--border-mid)]/40 flex items-center justify-between text-[10px] font-mono text-[var(--ink-light)]/70 tracking-[0.15em]">
          <span>● {weekCode} · STEP {current + 1}</span>
          <span>{current + 1} / {total}</span>
        </div>
      )}
    </div>
  );
}


═══════════════════════════════════════════════════════════
FILE: src/components/ui/DepthBlock.jsx   [改]
═══════════════════════════════════════════════════════════

import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useMode } from '../../context/ModeContext';
import { useProjector } from '../../context/ProjectorContext';

/**
 * DepthBlock — 包「深度補充」內容（完整說明／範例詳解／為什麼重要／常見錯誤）。
 *
 *   上課模式：預設收合、標題可見、可手動點開（不是隱藏——學生卡住時要找得到）。
 *   自學模式：預設展開。
 *   投影顯示：一律收合（即使自學模式），老師需要時手動點開——優先於 mode 判斷。
 *
 * 切換模式／投影狀態時重設展開狀態（視為刻意 reset）；單一狀態內學生仍可手動開合。
 *
 * title 只能用固定詞表（三模式架構 spec §6-2），其餘一律 fallback 成「延伸補充」：
 *   想知道為什麼？／看完整範例／常見錯誤／AI 使用提醒／延伸補充
 */

const DEPTH_TITLES = ['想知道為什麼？', '看完整範例', '常見錯誤', 'AI 使用提醒', '延伸補充'];

export default function DepthBlock({ title = '延伸補充', children }) {
    const { mode } = useMode();
    const { projector } = useProjector();
    // 投影顯示一律收合；否則自學模式展開、上課模式收合
    const defaultOpen = !projector && mode === 'self-study';
    const [open, setOpen] = useState(defaultOpen);

    useEffect(() => {
        setOpen(defaultOpen);
    }, [defaultOpen]);

    const safeTitle = DEPTH_TITLES.includes(title) ? title : '延伸補充';

    return (
        <div className="my-4 rounded-[var(--radius-unified)] border border-dashed border-[var(--border-mid)] bg-[var(--paper-warm)] overflow-hidden">
            <button
                onClick={() => setOpen((o) => !o)}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-left hover:bg-[var(--paper)] transition-colors"
            >
                {open
                    ? <ChevronDown size={15} className="text-[var(--ink-light)] flex-shrink-0" />
                    : <ChevronRight size={15} className="text-[var(--ink-light)] flex-shrink-0" />}
                <span className="text-[12.5px] font-bold text-[var(--ink-mid)]">{safeTitle}</span>
                {!open && (
                    <span className="ml-auto text-[10.5px] font-mono text-[var(--ink-light)]">點開看</span>
                )}
            </button>
            {open && (
                <div className="px-4 pb-4 pt-1 border-t border-dashed border-[var(--border)]">
                    {children}
                </div>
            )}
        </div>
    );
}


═══════════════════════════════════════════════════════════
FILE: src/components/ui/ResearcherRedlines.jsx   [改]
═══════════════════════════════════════════════════════════

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ChevronRight, Eye, X, Check } from 'lucide-react';
import { REDLINES, STAGE_THEME, getRedlinesByStage } from '../../data/redlines';
import { useProjector } from '../../context/ProjectorContext';

/**
 * 研究員紅線卡 — W13/W14/W15 跨週共用
 *
 * Props:
 * - mode: 'full' (FindTraps 用) | 'subset' (W13/W14/W15 完整版) | 'warning' (任務前警戒語)
 * - stage: 'W13' | 'W14' | 'W15'（subset / warning 必填）
 * - linkToFindTraps: subset 模式顯示「在找雷挑戰看完整 17 條」連結（預設 true）
 * - linkToWeek: full 模式顯示「在 W14 詳細學」連結（預設 true）
 * - defaultOpen: full 模式下三段預設展開？（預設 false）
 * - collapsible: subset 模式下整張卡可摺疊（預設 false）
 */
export const ResearcherRedlines = ({
    mode = 'subset',
    stage,
    linkToFindTraps = true,
    linkToWeek = true,
    defaultOpen = false,
    collapsible = false,
}) => {
    if ((mode === 'subset' || mode === 'warning') && !stage) {
        return null;
    }

    if (mode === 'full') {
        return <FullRedlines linkToWeek={linkToWeek} defaultOpen={defaultOpen} />;
    }

    if (mode === 'warning') {
        return <WarningRedlines stage={stage} />;
    }

    return (
        <SubsetRedlines
            stage={stage}
            linkToFindTraps={linkToFindTraps}
            collapsible={collapsible}
        />
    );
};

/* ─── 警戒語版（任務前用，只顯示 core 條目，極簡）─── */
/* 投影顯示：只留「編號 + 短標題」，破折號詳解與底部說明隱藏（詳解仍在一般顯示／自學模式可見）*/
const WarningRedlines = ({ stage }) => {
    const { projector } = useProjector();
    const items = getRedlinesByStage(stage, 'core');
    const theme = STAGE_THEME[stage];
    if (!theme || items.length === 0) return null;

    return (
        <div className="my-6 max-w-[820px] mx-auto">
            <div
                className="rounded-[var(--radius-unified)] border-l-4 p-3 md:p-4"
                style={{ borderColor: theme.accent, background: theme.bg }}
            >
                <div className="flex items-center gap-2 mb-2">
                    <ShieldAlert size={16} style={{ color: theme.accent }} />
                    <p className="font-bold text-[12.5px] m-0" style={{ color: theme.accent }}>
                        ⚠️ 動手前·先看 {items.length} 條核心警戒語
                    </p>
                </div>
                <ul className="space-y-1 list-none p-0 m-0">
                    {items.map(r => (
                        <li key={r.id} className="text-[12px] leading-[1.85] flex items-baseline gap-1.5" style={{ color: theme.accent }}>
                            <span className="font-mono text-[10px] font-bold flex-shrink-0">{r.id}</span>
                            <span className="font-bold">{r.title}</span>
                            {!projector && (
                                <span className="text-[var(--ink-mid)] font-normal">— {r.body}</span>
                            )}
                        </li>
                    ))}
                </ul>
                {!projector && (
                    <p className="text-[10.5px] italic mt-2 pt-2 border-t" style={{ color: theme.accent, borderColor: theme.border }}>
                        💡 完整 {getRedlinesByStage(stage).length} 條（含進階）會在做完任務後出現，現在先記住這 {items.length} 條就好。
                    </p>
                )}
            </div>
        </div>
    );
};

/* ─── 完整版（FindTraps 全攤開）─── */
const FullRedlines = ({ linkToWeek, defaultOpen }) => {
    return (
        <div className="my-8 max-w-[860px] mx-auto">
            <div className="bg-white border-2 border-[var(--ink)] rounded-[var(--radius-unified)] p-5 md:p-6">
                <div className="flex items-center gap-2 mb-4">
                    <ShieldAlert size={22} className="text-[var(--ink)]" />
                    <h3 className="font-bold text-[16px] md:text-[18px] text-[var(--ink)] m-0">
                        研究員 17 條紅線 · 全攤開
                    </h3>
                </div>
                <p className="text-[12.5px] text-[var(--ink-mid)] leading-[1.85] mb-5">
                    這 17 條是研究員在<strong>「資料整理 → 視覺化 → 結論」</strong>三階段必須守的紅線。
                    每條都附 <span className="text-[#DC2626] font-bold">✗ 錯句</span> 與 <span className="text-[#059669] font-bold">✓ 正句</span> 對照——把抽象規則變成可辨認的句型。
                </p>
                {['W13', 'W14', 'W15'].map(s => (
                    <StageBlock
                        key={s}
                        stage={s}
                        items={getRedlinesByStage(s)}
                        linkToWeek={linkToWeek}
                        defaultOpen={defaultOpen}
                    />
                ))}
            </div>
        </div>
    );
};

/* ─── 子集版（W13/W14/W15 各週用）─── */
const SubsetRedlines = ({ stage, linkToFindTraps, collapsible }) => {
    const items = getRedlinesByStage(stage);
    const theme = STAGE_THEME[stage];
    const [open, setOpen] = useState(!collapsible); // collapsible=true 預設關，false 預設開
    if (!theme) return null;

    if (collapsible && !open) {
        return (
            <div className="my-6 max-w-[820px] mx-auto">
                <button
                    onClick={() => setOpen(true)}
                    className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-[var(--radius-unified)] border-2 hover:opacity-90 transition-opacity"
                    style={{ borderColor: theme.border, background: theme.bg }}
                >
                    <div className="flex items-center gap-2">
                        <ShieldAlert size={18} style={{ color: theme.accent }} />
                        <span className="font-bold text-[14px]" style={{ color: theme.accent }}>
                            📋 {stage} 階段研究員紅線 · {theme.label}（{items.length} 條）
                        </span>
                    </div>
                    <span className="text-[11px] font-mono" style={{ color: theme.accent }}>
                        點開查看 ▼
                    </span>
                </button>
            </div>
        );
    }

    return (
        <div className="my-6 max-w-[820px] mx-auto">
            <div
                className="rounded-[var(--radius-unified)] border-2 p-4 md:p-5"
                style={{ borderColor: theme.border, background: theme.bg }}
            >
                <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                        <ShieldAlert size={18} style={{ color: theme.accent }} />
                        <h3 className="font-bold text-[14px] md:text-[15px] m-0" style={{ color: theme.accent }}>
                            {stage} 階段研究員紅線 · {theme.label}（{items.length} 條）
                        </h3>
                    </div>
                    {collapsible && (
                        <button
                            onClick={() => setOpen(false)}
                            className="text-[11px] font-mono hover:underline"
                            style={{ color: theme.accent }}
                        >
                            收合 ▲
                        </button>
                    )}
                </div>
                <p className="text-[11.5px] leading-[1.85] mb-3" style={{ color: theme.accent }}>
                    這 {items.length} 條紅線是<strong>本週的核心規則</strong>——做這週任務時，每條都會用到。每條附 ✗ 錯句 / ✓ 正句對照。
                </p>
                <ol className="space-y-2 list-none p-0 m-0">
                    {items.map((r, i) => (
                        <RedlineRow key={r.id} item={r} index={i + 1} accent={theme.accent} />
                    ))}
                </ol>
                {linkToFindTraps && (
                    <div className="mt-4 pt-3 border-t" style={{ borderColor: theme.border }}>
                        <Link
                            to="/find-traps"
                            className="inline-flex items-center gap-1 text-[12px] font-bold no-underline hover:underline"
                            style={{ color: theme.accent }}
                        >
                            <Eye size={14} />
                            看完整 17 條 + 反例（AI 報告找雷大挑戰）
                            <ChevronRight size={14} />
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

/* ─── 階段區塊（FullRedlines 內用）─── */
const StageBlock = ({ stage, items, linkToWeek, defaultOpen }) => {
    const theme = STAGE_THEME[stage];
    const [open, setOpen] = useState(defaultOpen);
    const route = `/${stage.toLowerCase()}`;

    return (
        <div
            className="rounded-[var(--radius-unified)] border-2 mb-3 overflow-hidden"
            style={{ borderColor: theme.border, background: theme.bg }}
        >
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between p-3 text-left hover:opacity-90 transition-opacity"
                style={{ background: theme.bg }}
            >
                <div className="flex items-center gap-2">
                    <span
                        className="font-mono text-[10.5px] font-bold uppercase tracking-wider px-2 py-0.5 rounded"
                        style={{ background: theme.accent, color: 'white' }}
                    >
                        {stage}
                    </span>
                    <span className="font-bold text-[14px]" style={{ color: theme.accent }}>
                        {theme.label}（{items.length} 條）
                    </span>
                </div>
                <ChevronRight
                    size={16}
                    style={{
                        color: theme.accent,
                        transform: open ? 'rotate(90deg)' : 'none',
                        transition: 'transform 0.2s',
                    }}
                />
            </button>
            {open && (
                <div className="p-3 pt-0">
                    <ol className="space-y-2 list-none p-0 m-0">
                        {items.map((r, i) => (
                            <RedlineRow key={r.id} item={r} index={i + 1} accent={theme.accent} />
                        ))}
                    </ol>
                    {linkToWeek && (
                        <div className="mt-3 pt-3 border-t" style={{ borderColor: theme.border }}>
                            <Link
                                to={route}
                                className="inline-flex items-center gap-1 text-[12px] font-bold no-underline hover:underline"
                                style={{ color: theme.accent }}
                            >
                                在 {stage} 詳細學
                                <ChevronRight size={14} />
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

/* ─── 單條紅線（含 ✗/✓ 對照）─── */
const RedlineRow = ({ item, index, accent }) => {
    return (
        <li
            className="bg-white rounded p-2.5 border-l-4"
            style={{ borderColor: accent }}
        >
            <div className="flex items-baseline gap-2 mb-1">
                <span
                    className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded"
                    style={{ background: accent, color: 'white' }}
                >
                    {item.id}
                </span>
                <p className="font-bold text-[13px] m-0" style={{ color: accent }}>
                    {item.title}
                </p>
                {item.relatedTrap && (
                    <span
                        className="ml-auto text-[10px] font-mono text-[#7F1D1D] bg-[#FEE2E2] px-1.5 py-0.5 rounded whitespace-nowrap cursor-help"
                        title={`對應「AI 報告找雷挑戰」的第 ${item.relatedTrap} 個錯誤案例`}
                    >
                        ↔ 雷 #{item.relatedTrap}
                    </span>
                )}
            </div>
            <p className="text-[12px] text-[var(--ink-mid)] leading-[1.85] m-0 pl-1 mb-2">
                {item.body}
            </p>
            {(item.wrong || item.right) && (
                <div className="space-y-1 pl-1">
                    {item.wrong && (
                        <div className="flex gap-1.5 items-start text-[11.5px] leading-[1.7]">
                            <X size={13} className="text-[#DC2626] mt-0.5 flex-shrink-0" />
                            <p className="m-0 text-[#7F1D1D]"><span className="font-bold text-[#DC2626]">✗</span> {item.wrong}</p>
                        </div>
                    )}
                    {item.right && (
                        <div className="flex gap-1.5 items-start text-[11.5px] leading-[1.7]">
                            <Check size={13} className="text-[#059669] mt-0.5 flex-shrink-0" />
                            <p className="m-0 text-[#065F46]"><span className="font-bold text-[#059669]">✓</span> {item.right}</p>
                        </div>
                    )}
                </div>
            )}
        </li>
    );
};

export default ResearcherRedlines;


═══════════════════════════════════════════════════════════
FILE: src/pages/W14Page.jsx   [改]
═══════════════════════════════════════════════════════════

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import CourseArc from '../components/ui/CourseArc';
import { W14Data } from '../data/lessonMaps';
import './W14.css';
import ThinkRecord from '../components/ui/ThinkRecord';
import PromptBlock from '../components/ui/PromptBlock';
import AIREDNarrative from '../components/ui/AIREDNarrative';
import StepEngine from '../components/ui/StepEngine';
import StepBriefing from '../components/ui/StepBriefing';
import HeroBlock from '../components/ui/HeroBlock';
import TaskCard from '../components/ui/TaskCard';
import ResetWeekButton from '../components/ui/ResetWeekButton';
import AICollaborationPrinciples from '../components/ui/AICollaborationPrinciples';
import AIDialogSubmission from '../components/ui/AIDialogSubmission';
import AIModePicker from '../components/ui/AIModePicker';
import { ResearcherRedlines } from '../components/ui/ResearcherRedlines';
import TrapRewritePractice from '../components/ui/TrapRewritePractice';
import ChartChoiceChecker from '../components/ui/ChartChoiceChecker';
import { readRecords } from '../components/ui/ThinkRecord';
import { ModeProvider, useMode } from '../context/ModeContext';
import { useProjector } from '../context/ProjectorContext';
import ModeSwitch from '../components/ui/ModeSwitch';
import DepthBlock from '../components/ui/DepthBlock';
import RecordDrawer from '../components/ui/RecordDrawer';
import {
    ArrowRight,
    TrendingUp,
    BarChart2,
    PieChart,
    ScatterChart,
    FileText,
    Lightbulb,
    AlertTriangle,
    Gamepad2,
    ShieldAlert,
    Bot,
    Target,
} from 'lucide-react';

/* ══════════════════════════════════════
 *  資料常數
 * ══════════════════════════════════════ */

/* — 四大圖表 — */
const CHART_TYPES = [
    {
        icon: <TrendingUp size={18} />,
        name: '折線圖',
        eng: 'Line',
        use: '看趨勢、時間變化',
        keyword: '隨時間、波動',
        color: '#2563EB',
        bg: '#EFF6FF',
        question: '有時間在流動嗎？',
        methods: '適合：實驗（前後測）／觀察（時間取樣）／文獻（時序變化）',
    },
    {
        icon: <PieChart size={18} />,
        name: '圓餅圖',
        eng: 'Pie',
        use: '看比例、結構',
        keyword: '佔比、總和 100%',
        color: '#7C3AED',
        bg: '#F5F3FF',
        question: '看部分佔整體的比例嗎？',
        methods: '適合：問卷（類別比例）／觀察（行為類別）／文獻（編碼類別）',
    },
    {
        icon: <BarChart2 size={18} />,
        name: '長條圖',
        eng: 'Bar',
        use: '看比較、排名',
        keyword: '比大小、第一名、複選題',
        color: '#059669',
        bg: '#F0FDF4',
        question: '都不是？比大小排名嗎？',
        methods: '適合：問卷／實驗（組間比較）／觀察（行為次數）／文獻（維度比例）',
    },
    {
        icon: <ScatterChart size={18} />,
        name: '散佈圖',
        eng: 'Scatter',
        use: '看相關性',
        keyword: '關係、分佈',
        color: '#DC2626',
        bg: '#FEF2F2',
        question: '找兩個變數的關係嗎？',
        methods: '適合：問卷（兩個量化變項）／實驗（自變項數值 vs 依變項）',
    },
];

/* — 口訣決策流程 — */
const DECISION_FLOW = [
    { num: '❶', text: '有時間在流動嗎？', answer: '→ 折線圖', color: '#2563EB' },
    { num: '❷', text: '看部分佔整體比例嗎？', answer: '→ 圓餅圖', color: '#7C3AED' },
    { num: '❸', text: '找兩個變數的關係嗎？', answer: '→ 散佈圖', color: '#DC2626' },
    { num: '❹', text: '都不是？比大小排名？', answer: '→ 長條圖', color: '#059669' },
];

/* — 演練題 — */
const EXERCISE_ITEMS = [
    { q: '全班同學「數學成績」與「物理成績」是否有關聯。', a: 'D 散佈圖', hint: '兩個變數的關聯' },
    { q: '福利社過去三個月「珍珠奶茶」銷量的每日變化。', a: 'C 折線圖', hint: '時間流動的趨勢' },
    { q: '比較全校各班級的「整潔競賽」總分排名。', a: 'B 長條圖', hint: '比大小排名' },
    { q: '分析自己一天 24 小時的時間分配比例。', a: 'A 圓餅圖', hint: '部分佔整體比例' },
];

/* — 格式規範：3 鐵規 + 1 防呆 — */
const FORMAT_RULES = [
    { kind: '鐵規 1', label: '📌 標題', rule: '永遠放在圖表上方', example: '圖一：高二學生社團參與時數 (N=120)' },
    { kind: '鐵規 2', label: '📌 資料來源', rule: '永遠放在圖表下方', example: '手工：「資料來源：本研究問卷／訪談資料，研究者整理繪製」｜AI 協助：「⋯⋯；研究者以 Gemini Pro（思考模式+Canvas）協助繪製並驗收」' },
    { kind: '鐵規 3', label: '📌 N 值', rule: '在標題旁標註有效樣本數', example: '80% 是 100 人的 80% 還是 5 人的？差很多！' },
    { kind: '防呆', label: '📌 正文引用', rule: '寫「如圖一所示」', example: '絕對不能寫「如上圖」或「如下圖」' },
];

/* — ExportButton 欄位 — */
const EXPORT_FIELDS = [
    /* Step 1 */
    { key: 'w14-chart-exercise', label: '圖表決策演練', question: '四題圖表配對答案' },
    { key: 'w14-chart-debug', label: '圖表除錯', question: '小明的圓餅圖錯在哪？' },
    /* Step 2 */
    { key: 'w14-format-exercise', label: '格式規範演練' },
    /* Step 3 */
    { key: 'w14-case-3', label: '描述+推論整合練習' },
    { key: 'w14-pre-judgment', label: '① 草圖判讀（必填）', question: '我預期會看到什麼趨勢？最重要的發現是什麼？' },
    { key: 'w14-my-chart-type', label: '② 圖表類型與理由（必填）' },
    { key: 'w14-teach-reflection', label: '教學型反思（教學型才有）' },
    { key: 'w14-ai-blindspot', label: 'AI 找到的盲點（進階·驗收型必填）' },
    { key: 'w14-validation-check', label: '③ 圖表三鐵規驗收（必填）' },
    { key: 'w14-my-description', label: '④ 描述句（人先寫，AI 可協助檢核）' },
    { key: 'w14-my-inference', label: '⑤ 推論句（人先寫，研究核心；AI 可壓測不可代寫）' },
    { key: 'w14-ai-pressure-test', label: 'AI 壓力測試後修正（進階·驗收型必填）' },
    { key: 'w14-ai-dialog-submission', label: 'AI 完整對話繳交方式（用了 AI 必填）', question: 'A 私人留言 / B 文件上傳並貼連結' },
    /* Step 6 回顧繳交 */
    { key: 'w14-self-transfer', label: '自我遷移：我們組最危險的圖表／圖說紅線（必填）', question: '我們組這份圖+圖說，最可能踩到 17 條紅線中的哪一條？為什麼？' },
    { key: 'w14-trap-rewrite-11', label: '雷 #11 改寫練習（個人繳交項）', question: '把散佈圖圖說的「明顯」過度修飾改成謹慎版' },
    { key: 'w14-w15-preview', label: 'W15 預告：結論的第三層和第四層' },
    { key: 'w14-aired-record', label: 'AI-RED 敘事紀錄（用了 AI 必填）', question: '本週用 AI 畫圖的最重要一次互動（A-I-R-E-D 五要素）' },
    { key: 'w14-semester-reflection', label: '學期 AI 協作反思（W14-W17 跨週作業）', question: '從 W1 到現在，你跟 AI 共事最讓你改變想法的一次是什麼？（W17 老師會點 3 位同學現場分享）' },
];

/* — RecordDrawer：不匯出、但要在總覽顯示的「元件自帶 dataKey」— */
const RECORD_EXTRA_FIELDS = [
    { key: 'w14-ai-mode', label: 'AI 使用模式選擇（進階壓測）', store: 'records' },
    { key: 'w14-chart-choice', label: '選圖判斷檢核卡', store: 'standalone' },
];

/* ══════════════════════════════════════
 *  演練題互動元件
 * ══════════════════════════════════════ */

const ChartExercise = () => {
    const [answers, setAnswers] = useState(() => {
        try { return JSON.parse(localStorage.getItem('w14-chart-exercise-ans') || '{}'); } catch { return {}; }
    });
    const [showAnswers, setShowAnswers] = useState(() => {
        try { return localStorage.getItem('w14-chart-exercise-show') === '1'; } catch { return false; }
    });
    const options = ['A 圓餅圖', 'B 長條圖', 'C 折線圖', 'D 散佈圖'];

    const updateAnswer = (i, opt) => {
        const next = { ...answers, [i]: opt };
        setAnswers(next);
        try { localStorage.setItem('w14-chart-exercise-ans', JSON.stringify(next)); } catch {}
    };
    const revealAnswers = () => {
        setShowAnswers(true);
        try { localStorage.setItem('w14-chart-exercise-show', '1'); } catch {}
    };
    const handleReset = () => {
        setAnswers({});
        setShowAnswers(false);
        try { localStorage.removeItem('w14-chart-exercise-ans'); localStorage.removeItem('w14-chart-exercise-show'); } catch {}
    };

    return (
        <div>
            <div className="flex flex-col gap-3">
                {EXERCISE_ITEMS.map((item, i) => (
                    <div key={i} className="p-3 rounded-[var(--radius-unified)] border border-[var(--border)] bg-white">
                        <p className="text-[12px] text-[var(--ink)] mb-2"><strong>{i + 1}.</strong> {item.q}</p>
                        <div className="flex flex-wrap gap-2">
                            {options.map(opt => (
                                <button
                                    key={opt}
                                    onClick={() => !showAnswers && updateAnswer(i, opt)}
                                    className="px-3 py-1 text-[11px] rounded-[var(--radius-unified)] border transition-colors"
                                    style={{
                                        borderColor: answers[i] === opt ? 'var(--accent)' : 'var(--border)',
                                        background: answers[i] === opt ? 'var(--accent)' : '#fff',
                                        color: answers[i] === opt ? '#fff' : 'var(--ink-mid)',
                                        fontWeight: answers[i] === opt ? 700 : 400,
                                        cursor: showAnswers ? 'default' : 'pointer',
                                    }}
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>
                        {showAnswers && (
                            <p className="mt-2 text-[11px]" style={{ color: answers[i] === item.a ? 'var(--success)' : '#DC2626' }}>
                                {answers[i] === item.a ? '✅ 正確！' : `❌ 正確答案：${item.a}`} — {item.hint}
                            </p>
                        )}
                    </div>
                ))}
            </div>
            <div className="flex items-center gap-3 mt-3">
                {!showAnswers ? (
                    <button
                        onClick={revealAnswers}
                        className="px-4 py-2 text-[12px] font-bold text-white rounded-[var(--radius-unified)] border-none cursor-pointer"
                        style={{ background: 'var(--accent)' }}
                    >
                        對答案
                    </button>
                ) : (
                    <button
                        onClick={handleReset}
                        className="px-4 py-2 text-[11px] rounded-[var(--radius-unified)] border cursor-pointer"
                        style={{ background: '#fff', borderColor: 'var(--border)', color: 'var(--ink-mid)' }}
                    >
                        重新作答
                    </button>
                )}
            </div>
        </div>
    );
};

/* ══════════════════════════════════════
 *  主頁面
 * ══════════════════════════════════════ */

const W14PageContent = () => {
    const { mode } = useMode();
    const { projector } = useProjector();
    const saved = readRecords();
    const myTopic = saved['w8-merged-topic'] || saved['w8-research-question'] || '';
    const myMethod = saved['w9-my-method'] || saved['w8-tool-method'] || '';
    /* W13 跨週帶入 */
    const w13TableLink = saved['w13-table-link'] || '';
    const w13W14Question = saved['w13-w14-question'] || '';
    /* AI 使用模式 */
    const [w14AiMode, setW14AiMode] = useState(() => {
        try {
            const r = JSON.parse(localStorage.getItem('rib_think_records')) || {};
            return r['w14-ai-mode'] || '';
        } catch { return ''; }
    });

    const steps = [
        {
            title: '選對盤子',
            icon: <BarChart2 size={18} />,
            content: (
                <div className="flex flex-col gap-6 prose-zh">
                    <StepBriefing
                        task="用『四問口訣』判斷你的分析表該配什麼圖（折線／圓餅／長條／散佈）。"
                        done="圖表類型選好進 Step 2 學格式 3 鐵規。"
                    />
                    {/* 開場：任務定位 */}
                    <div className="p-5 rounded-[var(--radius-unified)] border border-[var(--border)] bg-[var(--paper-warm)]">
                        <p className="text-[15px] font-bold text-[var(--ink)] mb-2">🍽️ 選對盤子，數據才會說話</p>
                        <p className="text-[12px] text-[var(--ink-mid)] leading-relaxed">
                            頂級和牛用塑膠臉盆裝，客人還想吃嗎？資料也一樣——你 W13 整理好的分析表是「食材」，
                            本週要選對「盤子」（圖表類型）盛出來。<strong>選錯圖表，再好的資料也讀不出意義。</strong>
                            Step 1 先學 4 大圖表的選擇口訣，再進格式、圖說、動手畫——共 6 步。
                        </p>
                    </div>

                    {/* 名詞白話化：變項是什麼 — 深度補充 */}
                    <DepthBlock title="延伸補充">
                    <div className="p-4 rounded-[var(--radius-unified)] border-2 border-[#BFDBFE] bg-[#EFF6FF]">
                        <p className="text-[13px] font-bold text-[#1E40AF] mb-2">📖 先搞懂一個詞：變項</p>
                        <p className="text-[12px] text-[#1E3A8A] leading-relaxed mb-2">
                            「變項」就是<strong>會改變的因素</strong>——你的資料裡兩個會變的東西就是兩個變項。畫圖時通常分成：
                        </p>
                        <div className="grid md:grid-cols-2 gap-2 text-[11.5px] text-[#1E3A8A]">
                            <div className="bg-white border border-[#BFDBFE] rounded p-2.5">
                                <p className="font-bold mb-1">🅧 X 軸（橫）= 你想分組或排序的</p>
                                <p>例：年級、月份、組別、題目、行為類別</p>
                            </div>
                            <div className="bg-white border border-[#BFDBFE] rounded p-2.5">
                                <p className="font-bold mb-1">🅨 Y 軸（直）= 你想計算或比較的</p>
                                <p>例：人數、百分比、平均分數、次數、時間</p>
                            </div>
                        </div>
                        <p className="text-[11px] text-[#1E40AF] italic mt-2 leading-relaxed">
                            💡 例：「不同<strong className="text-[#DC2626]">年級</strong>（X）的<strong className="text-[#DC2626]">手機平均使用時數</strong>（Y）」——年級和使用時數都是變項。
                        </p>
                    </div>
                    </DepthBlock>

                    {/* 四大圖表卡 */}
                    <div className="w14-chart-grid">
                        {CHART_TYPES.map((c, i) => (
                            <div key={i} className="w14-chart-card">
                                <div className="w14-chart-header" style={{ color: c.color }}>
                                    {c.icon}
                                    <span>{c.name} ({c.eng})</span>
                                </div>
                                <div className="w14-chart-body">
                                    <p>{c.use}</p>
                                    <span className="w14-chart-keyword" style={{ background: c.bg, color: c.color }}>
                                        {c.keyword}
                                    </span>
                                    <p className="text-[10.5px] text-[var(--ink-light)] mt-2 leading-[1.55]">{c.methods}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* 🎤 訪談組專屬：質性資料呈現方式 — 深度補充（非訪談組收合）*/}
                    <DepthBlock title="延伸補充">
                    <div className="bg-[#F5F3FF] border-2 border-[#7C3AED] rounded-[var(--radius-unified)] p-4 max-w-[760px]">
                        <p className="text-[13px] font-bold text-[#5B21B6] mb-2">🎤 訪談組請看這裡 — 質性資料另闢蹊徑</p>
                        <p className="text-[11.5px] text-[#4C1D95] leading-relaxed mb-3">
                            上方 4 大圖表是針對<strong>數字資料</strong>設計的。訪談收到的是<strong>文字、引文、主題</strong>——硬畫成圓餅圖會被批評「把質性資料量化」（你只有 5 位受訪者，畫圓餅圖根本沒意義）。
                        </p>
                        <p className="text-[11.5px] font-bold text-[#5B21B6] mb-2">📋 訪談組常用的呈現方式：</p>
                        <div className="space-y-2 text-[11.5px]">
                            <div className="bg-white border-l-3 border-[#7C3AED] rounded-r p-2.5">
                                <p className="font-bold text-[#5B21B6] mb-0.5">① 引文表（quote table）— 最常用</p>
                                <p className="text-[#4C1D95]">主題 × 受訪者代表引文。直接讓受訪者的話「為自己說話」，比畫圖更有說服力。</p>
                                <p className="text-[#4C1D95] italic mt-0.5">例：主題「家長期待」→ 受訪者 A：「我媽說不補就考不上⋯⋯」／ 受訪者 B：「爸媽從來沒提過」</p>
                            </div>
                            <div className="bg-white border-l-3 border-[#7C3AED] rounded-r p-2.5">
                                <p className="font-bold text-[#5B21B6] mb-0.5">② 主題矩陣 — 看誰提了什麼</p>
                                <p className="text-[#4C1D95]">表格：行 = 主題、欄 = 受訪者、格子 = 「✓ 有提到 / ✗ 沒提到 / ★ 強烈提到」。</p>
                                <p className="text-[#4C1D95] italic mt-0.5">用來看「哪個主題被多少人提到」，但不要強行量化（不要寫「80%」這種敘述）。</p>
                            </div>
                            <div className="bg-white border-l-3 border-[#7C3AED] rounded-r p-2.5">
                                <p className="font-bold text-[#5B21B6] mb-0.5">③ 主題網絡圖（進階）— 看主題之間的關係</p>
                                <p className="text-[#4C1D95]">節點 = 主題、連線 = 主題之間的關聯。例：「家長期待」連到「同儕壓力」連到「自我懷疑」。</p>
                            </div>
                        </div>
                        <details className="mt-3 bg-[#FEF3C7] border border-[#F59E0B]/40 rounded p-2.5">
                            <summary className="cursor-pointer text-[11.5px] font-bold text-[#92400E]">🤔 訪談組可以用長條圖嗎？（點開看注意事項）</summary>
                            <p className="text-[11px] text-[#78350F] leading-relaxed mt-2">
                                可以，但要小心：如果你 5 位受訪者中有 4 位提到「家長期待」，畫成「家長期待 80%」的長條圖會誤導讀者以為這是統計結論。
                                <br />
                                ✓ <strong>正確用法</strong>：標題寫「圖一：5 位受訪者提及各主題的人數（N=5）」，並在文字明確說「這是訪談 5 位學生的初步觀察，不代表全體」。
                                <br />
                                ✗ <strong>錯誤用法</strong>：直接寫「80% 高中生有家長期待壓力」（5 人不能推論到全體）。
                            </p>
                        </details>
                    </div>
                    </DepthBlock>

                    {/* 口訣決策流程 */}
                    <div>
                        <p className="text-[13px] font-bold text-[var(--ink)] mb-2">💡 快速決策口訣</p>
                        <div className="w14-flow">
                            {DECISION_FLOW.map((d, i) => (
                                <div key={i} className="w14-flow-step">
                                    <div className="w14-flow-num" style={{ background: d.color }}>{d.num.replace(/[❶❷❸❹]/, String(i + 1))}</div>
                                    <span className="text-[var(--ink)]">{d.text}</span>
                                    <span className="w14-flow-arrow font-bold" style={{ color: d.color }}>{d.answer}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 演練：圖表決策 */}
                    <div>
                        <p className="text-[13px] font-bold text-[var(--ink)] mb-2">✏️ 演練：圖表決策直覺訓練</p>
                        <p className="text-[12px] text-[var(--ink-mid)] mb-3">選出最適合的圖表類型，選完按「對答案」。</p>
                        <ChartExercise />
                    </div>

                    {/* 對答案後的反思（避免跟上方互動演練重複） */}
                    <ThinkRecord
                        dataKey="w14-chart-exercise"
                        prompt="對答案後的反思（不用重抄 4 題答案，只寫你錯了哪題＋為什麼）"
                        scaffold={[
                            '我錯的題（如果有）：第 ___ 題',
                            '我選了 ___ 卻是 ___，原因是我把 ___ 跟 ___ 搞混了',
                            '下次怎麼避免：（哪個口訣記不熟？）',
                        ]}
                    />

                    {/* 演練：圖表除錯 */}
                    <div className="w14-case-card">
                        <div className="w14-case-header">✏️ 演練：圖表除錯</div>
                        <div className="w14-case-body">
                            <p><strong>情境：</strong>小明調查「你喜歡吃什麼水果？（可複選）」，結果：蘋果 60%、香蕉 50%、芭樂 40%。他畫了圓餅圖。</p>
                            <p className="mt-2 font-bold text-[var(--ink)]">他錯在哪？正確應該用哪種圖表？</p>
                        </div>
                    </div>
                    <ThinkRecord
                        dataKey="w14-chart-debug"
                        prompt="小明的圓餅圖錯在哪？正確應該用什麼圖？為什麼？"
                        scaffold={['錯在：圓餅圖要求總和 100%，但複選題加總會...', '正確應該用___圖，因為...']}
                    />
                </div>
            ),
        },
        {
            title: '圖表格式',
            icon: <FileText size={18} />,
            content: (
                <div className="flex flex-col gap-6 prose-zh">
                    <StepBriefing
                        task="幫圖表加上 3 鐵規：標題在上、來源在下、N 值不能省；視覺別亂裝飾。"
                        done="格式合規進 Step 3 練圖說寫法。"
                    />
                    <div className="p-4 rounded-[var(--radius-unified)] border border-[var(--border)] bg-[var(--paper-warm)]">
                        <p className="text-[14px] font-bold text-[var(--ink)] mb-1">📐 做圖表的三個鐵規定 + 一個防呆</p>
                        <p className="text-[12px] text-[var(--ink-mid)]">自己做的圖表也要標出處！</p>
                    </div>

                    {/* 格式規範表 */}
                    <div className="w14-format-grid">
                        {FORMAT_RULES.map((r, i) => (
                            <div key={i} className="w14-format-row">
                                <span className="w14-format-label">
                                    {r.kind === '防呆'
                                        ? <span className="inline-block text-[9px] font-bold px-1 py-0.5 rounded bg-[#FEF3C7] text-[#92400E] mr-1">防呆</span>
                                        : <span className="inline-block text-[9px] font-bold px-1 py-0.5 rounded bg-[#EFF6FF] text-[#1E40AF] mr-1">{r.kind}</span>}
                                    {r.label}
                                </span>
                                <div>
                                    <p className="text-[var(--ink)] font-bold">{r.rule}</p>
                                    {/* 長範例：投影顯示時隱藏，只留鐵規本身（範例仍在一般顯示／自學模式可見）*/}
                                    {!projector && <p className="text-[11px] mt-1 opacity-70">{r.example}</p>}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* N 值為什麼重要 — 深度補充（「N 值不能省」的鐵規本身留在上方格式表）*/}
                    <DepthBlock title="想知道為什麼？">
                    <div className="p-4 rounded-[var(--radius-unified)] border border-[#FCD34D] bg-[#FFFBEB]">
                        <p className="text-[12px] text-[#92400E] flex items-center gap-2">
                            <AlertTriangle size={14} /> <strong>N 值為什麼重要？</strong>
                        </p>
                        <p className="text-[12px] text-[#78350F] mt-1 leading-relaxed">
                            「80% 的人有壓力」— 這是 100 人的 80%，還是只有 5 人的 80%？說服力完全不同！
                            在圖表標題旁標註 (N=有效樣本數)。
                        </p>
                    </div>
                    </DepthBlock>

                    {/* 演練：格式 */}
                    <div className="w14-case-card">
                        <div className="w14-case-header">✏️ 演練：格式規範</div>
                        <div className="w14-case-body">
                            <p><strong>情境：</strong>你整理了 300 份問卷，做成一張圓餅圖，標題是「圖一：社團參與比例」。</p>
                            <p className="mt-2">1. 圖表下方的「資料來源」該怎麼寫？</p>
                            <p>2. 正文中提到這張圖時，該怎麼稱呼？</p>
                        </div>
                    </div>
                    <ThinkRecord
                        dataKey="w14-format-exercise"
                        prompt="格式規範演練：資料來源怎麼寫？正文怎麼引用？"
                        scaffold={['1. 資料來源：...', '2. 正文寫法：...']}
                    />

                    {/* 遊戲入口：Chart Matcher */}
                    <div className="p-4 rounded-[var(--radius-unified)] bg-gradient-to-br from-[#1a1a2e] to-[#16213e] text-white text-center">
                        <p className="text-[11px] opacity-60 mb-1"><Gamepad2 size={12} className="inline" /> R.I.B. 技能挑戰</p>
                        <p className="text-[14px] font-bold mb-2">Chart Matcher 解碼任務</p>
                        <p className="text-[12px] opacity-70 mb-3">用遊戲把圖表決策口訣練到反射動作！</p>
                        <Link
                            to="/chart-matcher"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-[#10B981] hover:bg-[#059669] text-white text-[13px] font-bold rounded-[var(--radius-unified)] transition-colors no-underline"
                        >
                            進入遊戲 <ArrowRight size={14} />
                        </Link>
                    </div>
                </div>
            ),
        },
        {
            title: '描述 vs. 推論',
            icon: <Lightbulb size={18} />,
            content: (
                <div className="flex flex-col gap-6 prose-zh">
                    <StepBriefing
                        task="圖說公式 = 描述（客觀看見的）+ 推論（謹慎下的判斷）。"
                        done="兩層分清楚進 Step 4 動手畫圖+寫圖說。"
                    />
                    <div className="p-4 rounded-[var(--radius-unified)] border border-[var(--border)] bg-[var(--paper-warm)]">
                        <p className="text-[14px] font-bold text-[var(--ink)] mb-1">📝 一張圖的說明 ＝ 描述 ＋ 推論</p>
                        <p className="text-[12px] text-[var(--ink-mid)]">圖表貼到報告裡，你不能什麼都不說。你要告訴讀者：你看到了什麼，以及這代表什麼。</p>
                    </div>

                    {/* 描述 vs 推論雙欄 */}
                    <div className="w14-dual-grid">
                        <div className="w14-dual-card w14-dual-desc">
                            <p className="font-bold mb-2">📊 描述（客觀事實）</p>
                            <p>看到了什麼？報事實、報數字。</p>
                            <p className="mt-2 text-[11px] italic">例：根據圖一，80% 的學生在睡前滑手機超過一小時。</p>
                        </div>
                        <div className="w14-dual-card w14-dual-infer">
                            <p className="font-bold mb-2">💡 推論（主觀見解）</p>
                            <p>這代表什麼？解釋意義、推測原因。</p>
                            <p className="mt-2 text-[11px] italic">例：這可能反映出學生放學後缺乏其他休閒管道。</p>
                        </div>
                    </div>

                    {/* 常見錯誤 — 深度補充 */}
                    <DepthBlock title="常見錯誤">
                    <div className="p-4 rounded-[var(--radius-unified)] border border-[#FCA5A5] bg-[#FEF2F2]">
                        <p className="text-[12px] text-[#DC2626] font-bold mb-2">⚠️ 常見錯誤</p>
                        <div className="text-[12px] text-[#991B1B] leading-relaxed flex flex-col gap-1">
                            <span>1. <strong>只報數字不推論</strong>：像機器人，沒有分析價值</span>
                            <span>2. <strong>亂推論</strong>：沒有數據支持就硬說，要說「可能」而非「一定」</span>
                            <span>3. <strong>把 38% 說成「絕大多數」</strong>：量詞要精準</span>
                        </div>
                    </div>
                    </DepthBlock>

                    {/* 案例三（保留：整合練習） */}
                    <div className="w14-case-card">
                        <div className="w14-case-header">整合練習：精神病患處置民調</div>
                        <div className="w14-case-body">
                            <p><strong>數據：</strong>73.5% 民眾不滿現況；不滿主因是「結束刑期後的社會危害（如再犯）」（85.3%）。</p>
                            <p className="mt-2">請用「描述＋推論」公式，把這兩個數字整合成一段完整的說明。</p>
                        </div>
                    </div>
                    <ThinkRecord dataKey="w14-case-3" prompt="整合練習：用描述＋推論公式寫出完整說明" scaffold={['描述：根據調查結果，...', '推論：這可能反映出...']} />

                    {/* 遊戲入口：Data Detective */}
                    <div className="p-4 rounded-[var(--radius-unified)] bg-gradient-to-br from-[#1a1a2e] to-[#16213e] text-white text-center">
                        <p className="text-[11px] opacity-60 mb-1"><Gamepad2 size={12} className="inline" /> R.I.B. 技能挑戰</p>
                        <p className="text-[14px] font-bold mb-2">Data Detective 濾鏡任務</p>
                        <p className="text-[12px] opacity-70 mb-3">找出菜鳥研究員的錯誤分析！</p>
                        <Link
                            to="/data-detective"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-[#10B981] hover:bg-[#059669] text-white text-[13px] font-bold rounded-[var(--radius-unified)] transition-colors no-underline"
                        >
                            進入遊戲 <ArrowRight size={14} />
                        </Link>
                    </div>
                </div>
            ),
        },
        {
            title: '動手畫圖 + 圖說',
            icon: <BarChart2 size={18} />,
            content: (
                <div className="flex flex-col gap-6 prose-zh">
                    <StepBriefing
                        task="拿 W13 分析表動手畫第一張圖 + 寫圖說（描述 + 推論）。畫圖可交 AI，圖說你先寫、AI 檢核。"
                        done="圖 + 圖說有初版進 Step 5（可選 AI 壓測）。"
                    />
                    {/* 6 子步進度提示 — 不拆 Step，但讓學生知道在走 6 個小關卡 */}
                    <div className="rounded-[var(--radius-unified)] border border-[var(--border)] bg-[var(--paper-warm)] px-4 py-3">
                        <p className="text-[12px] font-bold text-[var(--ink)] mb-1">Step 4｜動手畫圖與圖說 — 你會完成 6 件小事：</p>
                        <p className="text-[11.5px] text-[var(--ink-mid)] leading-[1.8] m-0">
                            ① 草圖判讀　② 選圖表類型　③ 產生／繪製圖表　④ 人工驗收　⑤ 寫描述　⑥ 寫推論
                        </p>
                    </div>
                    {/* 開場：研究腦/技術分工 */}
                    <div className="p-4 rounded-[var(--radius-unified)] border border-[var(--border)] bg-[var(--paper-warm)]">
                        <p className="text-[14px] font-bold text-[var(--ink)] mb-1">🎯 分工：你選圖表、驗收、寫描述與推論；AI 協助畫圖草稿</p>
                        <p className="text-[12px] text-[var(--ink-mid)] leading-relaxed">
                            打開你 W13 整理好的分析表。本週分工原則：
                            <strong>選圖表類型／驗收三鐵規／寫描述與推論</strong>是研究核心，由你自己做；
                            <strong>畫圖（Sheets/Canva 操作）</strong>可以交給 AI——AI 是技術助理，不是研究員。
                            <strong>圖說（描述＋推論）你先寫，AI 只能協助檢核，不能代寫。</strong>
                        </p>
                    </div>

                    {/* 從 W13 帶入分析表 */}
                    {(w13TableLink || w13W14Question) && (
                        <div className="p-4 rounded-[var(--radius-unified)] bg-[#F0F9FF] border-2 border-[#BAE6FD]">
                            <p className="text-[12px] text-[#0369A1] font-bold mb-2">📂 從 W13 帶過來</p>
                            {w13TableLink && (
                                <div className="mb-2">
                                    <p className="text-[11px] text-[#075985] font-bold uppercase tracking-wider mb-1">分析表連結</p>
                                    <p className="text-[12px] text-[#0C4A6E] break-all">{w13TableLink}</p>
                                </div>
                            )}
                            {w13W14Question && (
                                <div>
                                    <p className="text-[11px] text-[#075985] font-bold uppercase tracking-wider mb-1">你 W13 寫的「想怎麼呈現」</p>
                                    <p className="text-[12px] text-[#0C4A6E] leading-relaxed">{w13W14Question}</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* 第①步 草圖判讀 */}
                    <div className="p-5 rounded-[var(--radius-unified)] border-2 border-[#FCA5A5] bg-[#FEF2F2]">
                        <p className="text-[14px] font-bold text-[#991B1B] mb-2 flex items-center gap-2">
                            <ShieldAlert size={16} /> 第①步 · 草圖判讀（純人工 · 不能讓 AI 替你看）
                        </p>
                        <p className="text-[12px] text-[#7F1D1D] leading-relaxed">
                            開分析表，自己用腦袋讀一輪。回答下面三個問題——這是你研究的「眼力」訓練。
                        </p>
                    </div>
                    <ThinkRecord
                        dataKey="w14-pre-judgment"
                        prompt="① 我的草圖判讀"
                        scaffold={[
                            '我選的變項：X = ___，Y = ___（為什麼選這兩個？）',
                            '我預期會看到的趨勢／模式：（口語描述，例：高一比高三花更多時間滑手機）',
                            '我預期最重要的發現：（如果這張圖只能講一句話，這句話是什麼？）',
                        ]}
                    />

                    {/* 第②步 選類型 */}
                    <div className="p-4 rounded-[var(--radius-unified)] border border-[var(--border)] bg-[var(--paper-warm)]">
                        <p className="text-[14px] font-bold text-[var(--ink)] mb-1">🎯 第②步 · 選圖表類型（純人工 · 套 Step 1 口訣）</p>
                        <p className="text-[12px] text-[var(--ink-mid)] leading-relaxed">
                            時間流動？比例？相關？比大小？挑一個套用。
                            <strong>這步絕不能交給 AI</strong>——選錯類型，AI 畫得再美也是廢圖。
                        </p>
                    </div>
                    <ThinkRecord
                        dataKey="w14-my-chart-type"
                        prompt="② 我選用的圖表類型 + 理由 + 圖表標題"
                        scaffold={[
                            '圖表類型：折線圖 / 圓餅圖 / 長條圖 / 散佈圖',
                            '原因（套用口訣）：因為我的資料是在看...',
                            '圖表標題：圖一：___ (N=___)',
                        ]}
                    />

                    {/* W14 選圖判斷檢核 — 對應第②步「你自己選的圖」（從頁底搬進步驟流程）*/}
                    <ChartChoiceChecker dataKey="w14-chart-choice" />

                    {/* 第③步 AI 畫圖 */}
                    <div className="p-5 rounded-[var(--radius-unified)] border-2 border-[var(--accent)] bg-[#F8F8FB]">
                        <p className="text-[14px] font-bold text-[var(--accent)] mb-2 flex items-center gap-2">
                            <Bot size={16} /> 第③步 · AI 畫圖（推薦路線）
                        </p>
                        <p className="text-[12px] text-[var(--ink-mid)] leading-relaxed mb-3">
                            把你決定好的「類型 + 變項 + 標題」交給 <strong>Gemini Pro · 思考模式 + Canvas</strong> 畫圖。
                            規則：<strong>AI 只能畫你選的類型，不能擅自換</strong>。
                        </p>
                        <PromptBlock text={`【任務】
依我提供的圖表設定與分析表，幫我畫成一張圖。

【重要規則】
1. 請嚴格使用我指定的圖表類型，不可自行更換。
2. 不可自行新增、刪除或合併變項。
3. 不要替我寫圖說；圖說由研究者自己撰寫。
4. 若資料有缺漏或格式看不懂，請先指出問題，不要自行猜測補值。

【我的圖表設定】
- 變項：X = ___，Y = ___
- 我選的圖表類型：___（折線圖／圓餅圖／長條圖／散佈圖）
- 圖表標題：圖一：___（N=___）
- 樣本數：N = ___

【分析表】
___
（可貼 CSV 文字、Google Sheets 可檢視連結，或上傳 Excel／CSV 檔案）

【請輸出】
1. 用我指定的圖表類型畫出圖。
2. 標題放在圖上方，並標出 N 值。
3. 圖下方標註：
   資料來源：本研究資料；研究者整理，並以 Gemini Pro（思考模式＋Canvas）協助繪製與驗收。
4. 座標軸標籤清楚，刻度合理；長條圖與折線圖的 Y 軸原則上從 0 開始。
5. 不要替我寫圖說。

【請在圖後附上自我檢查】
- 是否使用我指定的圖表類型：是／否
- 是否標出 N 值：是／否
- 是否標出資料來源：是／否
- Y 軸是否從 0 開始：是／否／不適用
- 是否有自行新增、刪除或合併變項：否`} />

                        {/* 學生提醒卡 — prompt 不外包判斷 + AI-RED */}
                        <div className="mt-3 rounded-[var(--radius-unified)] border border-[#D97706] bg-[#FEF3C7] p-3">
                            <p className="text-[11.5px] font-bold text-[#92400E] mb-1.5">使用這段 prompt 前，請先自己完成：</p>
                            <p className="text-[11.5px] text-[#78350F] leading-[1.9] m-0">
                                ① 自己選變項　② 自己選圖表類型　③ 自己寫圖表標題　④ 準備好 W13 的整理後分析表
                            </p>
                            <p className="text-[11.5px] text-[#92400E] leading-[1.9] mt-1.5 mb-0 pt-1.5 border-t border-[#D97706]/40">
                                AI 可以幫你畫圖，但不能替你決定要畫什麼圖。<br />
                                <strong>只要使用 AI 協助製圖，就要保留完整對話並完成 AI-RED。</strong>
                            </p>
                        </div>
                    </div>

                    {/* 替代路線：自己畫 */}
                    <details className="rounded-[var(--radius-unified)] border border-[var(--border)] bg-white">
                        <summary className="cursor-pointer px-5 py-3 flex items-center justify-between hover:bg-[var(--paper-warm)] transition-colors">
                            <span className="text-[12px] font-bold text-[var(--ink)]">
                                🛠️ 替代路線：我想自己用 Sheets/Excel/Canva 畫（點開看步驟）
                            </span>
                            <span className="text-[10px] font-mono text-[var(--ink-light)]">▼</span>
                        </summary>
                        <div className="border-t border-[var(--border)] p-4 space-y-2 text-[12px] text-[var(--ink-mid)] leading-relaxed">
                            <p><strong>Google Sheets：</strong>選資料 → 插入 → 圖表 → 編輯類型/標題（最快）</p>
                            <p><strong>Excel：</strong>選資料 → 插入 → 圖表 → 設計／格式（功能多）</p>
                            <p><strong>Canva：</strong>圖表元素 → 改數據 → 換顏色（最美）</p>
                        </div>
                    </details>

                    {/* 第④步 人工驗收 */}
                    <div className="p-4 rounded-[var(--radius-unified)] border-2 border-[#FCD34D] bg-[#FFFBEB]">
                        <p className="text-[13px] font-bold text-[#92400E] mb-2 flex items-center gap-2">
                            <ShieldAlert size={14} /> 第④步 · 人工驗收（純人工 · 套 Step 2 三鐵規）
                        </p>
                        <ul className="text-[11px] text-[#78350F] leading-relaxed space-y-1 mb-2">
                            <li>☐ 圖表類型 = 我選的（不是 AI 擅自改的）</li>
                            <li>☐ 標題在上方，含 N 值</li>
                            <li>☐ 資料來源在下方</li>
                            <li>☐ 座標軸沒截斷、比例合理</li>
                            <li>☐ 圖上的數字跟我的分析表對得上</li>
                        </ul>
                        <DepthBlock title="常見錯誤">
                            <div className="text-[11px] text-[#78350F] leading-relaxed space-y-1">
                                <p className="font-bold text-[#92400E]">📋 任何一項沒過？對照下面改 prompt 重畫：</p>
                                <p><strong>① 圖表類型錯</strong>（AI 改成自己想的）→ prompt 開頭加紅字「請<strong>嚴格使用</strong>我選的 ___ 類型，禁止更換」</p>
                                <p><strong>② 標題缺 N 值</strong>→ prompt 加「標題格式必須是『圖一：___ (N=___)』」</p>
                                <p><strong>③ 沒資料來源</strong>→ prompt 加「圖下方標『資料來源：本研究資料；研究者以 Gemini Pro Canvas 協助繪製並驗收』」（AI 不是資料來源，是繪製工具）</p>
                                <p><strong>④ 座標軸截斷</strong>（從非 0 開始放大差距）→ prompt 加「Y 軸從 0 開始」</p>
                                <p><strong>⑤ 數字對不上</strong>→ 把分析表整段重貼一次，並說「請對照原始資料逐筆驗算」</p>
                                <p className="italic text-[11px] text-[#92400E]">💡 AI 出錯不是你的責任，但驗收沒做就是你的責任。重畫 1-2 次很正常。</p>
                            </div>
                        </DepthBlock>
                    </div>
                    <ThinkRecord
                        dataKey="w14-validation-check"
                        prompt="③ 圖表驗收結果"
                        scaffold={[
                            '5 項驗收都通過？☐ 是 / ☐ 否（哪幾項沒過？）',
                            'AI 畫錯什麼？我重 prompt 幾次才對？',
                        ]}
                    />

                    {/* 第⑤步 寫描述 */}
                    <div className="p-4 rounded-[var(--radius-unified)] border border-[var(--border)] bg-[var(--paper-warm)]">
                        <p className="text-[14px] font-bold text-[var(--ink)] mb-1">✍️ 第⑤步 · 寫描述（你先寫，AI 可協助檢核）</p>
                        <p className="text-[12px] text-[var(--ink-mid)] leading-relaxed">
                            描述層 = 報事實、報數字。<strong>先自己寫一遍</strong>——圖可以交給 AI 畫，但圖說要你自己寫。
                            寫完<strong>再用 AI 逐句檢核</strong>數字對不對、量詞精不精準。AI 檢核，不代寫。
                        </p>
                    </div>
                    <details className="rounded-[var(--radius-unified)] border border-[var(--border)] bg-white">
                        <summary className="cursor-pointer px-4 py-2.5 hover:bg-[var(--paper-warm)] transition-colors flex items-center gap-2">
                            <span className="text-[12px] text-[var(--ink-mid)]">
                                🤖 <strong className="text-[var(--ink)]">AI 描述檢核 prompt</strong>（點開複製 · 寫完描述句再用）
                            </span>
                            <span className="ml-auto text-[10px] font-mono text-[var(--ink-light)]">▼</span>
                        </summary>
                        <div className="border-t border-[var(--border)] p-3">
                            <PromptBlock text={`這是我自己寫的「圖一」描述句：___

請檢核，不要替我重寫：
1. 數字和趨勢有沒有跟圖對不上？
2. 量詞精不精準？（例：38% 不能說成「絕大多數」）
3. 有沒有不小心寫了「因為」「所以」這類因果詞（那是推論，不是描述）？
4. 句尾有沒有標「（如圖一所示）」？

請逐句指出問題＋給修改建議，最後的描述句由我自己改。`} />
                        </div>
                    </details>
                    <div>
                        <p className="text-[13px] font-bold mb-2" style={{ color: '#1E40AF' }}>🔵 描述（藍筆）：你先寫，AI 檢核後修訂的版本</p>
                        <ThinkRecord
                            dataKey="w14-my-description"
                            prompt="④ 描述（你先寫，AI 檢核後修訂）"
                            scaffold={['根據圖一，...', '其中最明顯的是...']}
                        />
                    </div>

                    {/* 第⑥步 寫推論（純人工） */}
                    <div className="p-4 rounded-[var(--radius-unified)] border-2 border-[#FCA5A5] bg-[#FEF2F2]">
                        <p className="text-[14px] font-bold text-[#991B1B] mb-1 flex items-center gap-2">
                            <ShieldAlert size={16} /> 第⑥步 · 寫推論（純人工 · 不能交給 AI）
                        </p>
                        <p className="text-[12px] text-[#7F1D1D] leading-relaxed mb-2">
                            推論層 = 解釋意義、推測原因——<strong>這是研究的靈魂</strong>。
                            AI 寫的推論看起來合理，但那不是<strong>你的</strong>研究腦在運作。
                            自己寫——粗糙沒關係，下一步可選 AI 提醒可能漏掉的角度。
                        </p>
                        <DepthBlock title="想知道為什麼？">
                            <div className="text-[11px] text-[#7F1D1D] leading-relaxed space-y-1">
                                <p className="font-bold text-[#991B1B] mb-1">⚖️ 圖說兩層都你先寫，但 AI 檢核的深度不同：</p>
                                <p>· <strong>描述（第⑤步）</strong>：你先寫，AI 可逐句檢核——數字對不對、量詞精不精準。因為事實有對錯，AI 檢得動。</p>
                                <p>· <strong>推論（這步）</strong>：你先寫，AI 只能提醒你漏掉的風險角度，<strong>不能碰你的解釋方向</strong>。因為「為什麼會這樣」要回到你的研究問題、資料脈絡與現場經驗。</p>
                                <p className="italic mt-1.5">💡 共同點：圖可以交給 AI 畫，<strong>圖說不能外包</strong>。老師抽問會問：「為什麼你推論是 ___？」答不出來 = 你沒做研究。</p>
                            </div>
                        </DepthBlock>
                    </div>
                    <div>
                        <p className="text-[13px] font-bold mb-2" style={{ color: '#991B1B' }}>🔴 推論（紅筆）：純人工</p>
                        <ThinkRecord
                            dataKey="w14-my-inference"
                            prompt="⑤ 推論（你自己寫，不能讓 AI 代寫）"
                            scaffold={['這可能代表...', '因為...']}
                        />
                    </div>

                    {/* 自我檢查三件事 — 原「老師巡視」改寫成兩模式通用的核心 */}
                    <div className="p-4 rounded-[var(--radius-unified)] border border-[var(--border)] bg-[var(--paper-warm)]">
                        <p className="text-[12px] font-bold text-[var(--ink)] mb-2">✅ 交之前，自我檢查三件事</p>
                        <div className="text-[12px] text-[var(--ink-mid)] leading-relaxed flex flex-col gap-1">
                            <span>1. <strong>我有先寫草圖判讀</strong>（用腦袋讀過資料才動手）</span>
                            <span>2. AI 出的圖通過三鐵規驗收（圖表類型對 + 標題/N/來源齊）</span>
                            <span>3. <strong>推論是我自己寫的</strong>，不是抄 AI（老師抽問時答得出「為什麼這樣推」）</span>
                        </div>
                    </div>
                </div>
            ),
        },
        {
            title: '進階·AI 壓力測試（可選）',
            icon: <Lightbulb size={18} />,
            content: (
                <div className="flex flex-col gap-6 prose-zh">
                    <StepBriefing
                        task="把圖 + 圖說丟給 AI 當嚴格教練找 1 個盲點。可跳過。"
                        done="跳過或修完都進 Step 6 雙線繳交。"
                    />
                    {/* 開場：進階定位 */}
                    <div className="p-5 rounded-[var(--radius-unified)] border-2 border-[var(--accent)] bg-[#F8F8FB]">
                        <p className="text-[15px] font-bold text-[var(--accent)] mb-2">🥊 已完成基本要求 · 要不要被 AI 嚴格教練檢一輪</p>
                        <p className="text-[12px] text-[var(--ink)] leading-relaxed">
                            Step 4 你已完成圖+描述+推論基本要求。
                            這一步是<strong>進階訓練</strong>：請 AI 從研究方法老師角度找你忽略的趨勢、警告過度推論——
                            挖出你自己看不到的盲點。
                            <strong>用了 AI 一定要做判斷取捨（不能照單全收），並繳完整對話。</strong>
                        </p>
                    </div>

                    {/* 跨工具：資料分析檢核站 */}
                    <div className="bg-[var(--paper-warm)] border border-[var(--border)] rounded-[var(--radius-unified)] p-3 flex items-center justify-between gap-3">
                        <p className="text-[12px] text-[var(--ink-mid)] leading-relaxed">
                            💡 想看更進階的 5 法分析 prompt？回 <strong className="text-[var(--ink)]">資料分析檢核站</strong>（5 法 × Step 1-5 速查，自學用）。
                        </p>
                        <a
                            href="/analysis-station"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 bg-[var(--accent)] text-white px-3 py-1.5 rounded-[var(--radius-unified)] font-bold text-[12px] hover:opacity-90 transition-opacity no-underline flex-shrink-0"
                        >
                            📚 開範本庫
                        </a>
                    </div>

                    {/* AI 協作三原則（W14 角色：反思鏡）— 深度補充 */}
                    <DepthBlock title="AI 使用提醒">
                        <p className="text-[11.5px] text-[var(--ink-mid)] italic leading-relaxed mb-2">
                            💡 W14 的 AI 角色叫<strong className="text-[var(--ink)]">「反思鏡」</strong>——不論你下方選教學型／驗收型，AI 都是幫你戳「你沒看到的角度」，不是給你標準答案。
                        </p>
                        <AICollaborationPrinciples week="14" role="mirror" compact={false} />
                    </DepthBlock>

                    {/* AI 模式選擇 */}
                    <AIModePicker week="14" taskName="進階壓力測試" onChange={setW14AiMode} />

                    {/* standalone */}
                    {w14AiMode === 'standalone' && (
                        <div className="rounded-[var(--radius-unified)] border-2 border-[#BFDBFE] bg-[#EFF6FF] p-5">
                            <p className="text-[14px] font-bold text-[#1E40AF] mb-2">🚫 你選擇不做進階壓力測試</p>
                            <p className="text-[12px] text-[#1E3A8A] leading-relaxed">
                                完全 OK——Step 4 基本要求已達標。直接到下一步繳交即可（AI-RED 留空不會扣分）。
                            </p>
                        </div>
                    )}

                    {/* teach */}
                    {w14AiMode === 'teach' && (
                        <div className="rounded-[var(--radius-unified)] border-2 border-[#86EFAC] bg-[#F0FDF4] p-5 space-y-3">
                            <p className="text-[14px] font-bold text-[#166534] flex items-center gap-2">
                                🎓 教學型 Prompt（AI 教我這份資料還能看出什麼）
                            </p>
                            <p className="text-[12px] text-[#166534] leading-relaxed">
                                如果 Step 4 推論卡關，可以請 Gemini 教你「這份資料還有哪些角度可以看」——
                                但<strong>不要直接抄它的推論</strong>，看完範例自己回 Step 4 重寫。
                            </p>
                            <PromptBlock text={`我有一張圖（已附），描述層我寫了：___

【請教我】
1. 同一份資料，從研究方法老師角度，還有哪 3 個角度可以推論？
2. 每個角度給 1 句範例（不超過 15 字），讓我參考但不要寫長篇
3. 提醒我哪些是「過度推論」的紅線（哪些不能寫）

【不要做】
- 不要寫完整推論段落
- 我看完範例會自己回 Step 4 推論欄改寫`} />
                            <ThinkRecord
                                dataKey="w14-teach-reflection"
                                prompt="教學型反思（AI 教完後寫）"
                                scaffold={[
                                    'AI 給我哪 3 個角度？',
                                    '我要採納哪些回 Step 4 改寫推論：',
                                ]}
                            />
                        </div>
                    )}

                    {/* verify */}
                    {w14AiMode === 'verify' && (
                        <>
                            {/* 第①步 找盲點 */}
                            <div className="p-5 rounded-[var(--radius-unified)] border-2 border-[#7C3AED] bg-[#F5F3FF]">
                                <p className="text-[14px] font-bold text-[#5B21B6] mb-2 flex items-center gap-2">
                                    🔍 第①步 · 請 AI 找出你忽略的盲點
                                </p>
                                <p className="text-[12px] text-[#4C1D95] leading-relaxed mb-3">
                                    高一學生分析力還在長——AI 可以戳出你<strong>沒看到的角度</strong>。注意：AI 只給線索，判斷由你。
                                </p>
                                <PromptBlock text={`【我的圖】（附圖或貼資料）
【我的判讀】
- 預期趨勢：___
- 預期最重要的發現：___

【請從研究方法老師角度幫我做兩件事】
1. 找出我這份資料裡，可能有但我沒注意到的 3 個趨勢／模式
2. 標出 1-2 個「乍看像趨勢、但其實樣本不足以支持」的點，提醒我不要過度解讀

不要替我寫結論，只給我提示——「也許可以注意 ___」這種句型。`} />
                            </div>
                            <ThinkRecord
                                dataKey="w14-ai-blindspot"
                                prompt="① AI 找到的盲點 / 我沒注意到的趨勢"
                                scaffold={[
                                    'AI 指出我可能忽略的趨勢：',
                                    'AI 警告我不要過度解讀的點：',
                                    '我採納哪些、不採納哪些：',
                                ]}
                            />

                            {/* 第②步 推論壓力測試 */}
                            <div className="p-4 rounded-[var(--radius-unified)] border-2 border-[#7C3AED] bg-[#F5F3FF]">
                                <p className="text-[14px] font-bold text-[#5B21B6] mb-2 flex items-center gap-2">
                                    🥊 第②步 · AI 推論壓力測試
                                </p>
                                <p className="text-[12px] text-[#4C1D95] leading-relaxed mb-3">
                                    推論最容易踩兩個雷：
                                    <br />① <strong>過度推論</strong>：你只訪問了 30 個本校學生，卻寫成「全國高中生都這樣想」。
                                    <br />② <strong>單一原因</strong>：只想到一個解釋就停。要列 2-3 個可能。
                                    <br />讓 AI 幫你壓力測試這兩個雷——但別直接抄 AI 的修改。
                                </p>
                                <PromptBlock text={`接續上一輪。

【我的描述】___（貼）
【我的推論】___（貼）
【樣本資訊】N=___，對象是 ___

【請壓力測試】
1. 我的推論有沒有過度推論？哪些用詞要加「可能」「推測」「在 ___ 範圍內」？
2. 除了我寫的這個原因，還有哪 2 個合理但我沒想到的解釋？
3. 我的描述有沒有量詞不精準的地方？

只給檢查與建議，不要替我改寫——改寫由我自己來。`} />
                            </div>
                            <ThinkRecord
                                dataKey="w14-ai-pressure-test"
                                prompt="② AI 壓力測試後我做了哪些修正"
                                scaffold={[
                                    'AI 指出的問題：',
                                    '我採納哪些建議：',
                                    '我修正了什麼（描述／推論的具體用詞）：',
                                ]}
                            />

                            <div className="p-4 rounded-[var(--radius-unified)] border-2 border-[var(--accent)] bg-[#F8F8FB]">
                                <p className="text-[12px] font-bold text-[var(--accent)] mb-2">📝 用 AI 修完，回 Step 4 覆蓋描述/推論欄</p>
                                <p className="text-[11px] text-[var(--ink-mid)] leading-relaxed">
                                    若採納 AI 建議，<strong>回 Step 4 覆蓋描述/推論欄位</strong>，匯出時就會是 AI 修飾版。沒覆蓋＝以 Step 4 自寫版為準。
                                </p>
                            </div>

                            {/* 完整對話繳交 */}
                            <AIDialogSubmission week="14" taskName="進階壓力測試對話" required={true} />
                        </>
                    )}

                    {!w14AiMode && (
                        <div className="rounded-[var(--radius-unified)] border border-[var(--border)] bg-[var(--paper-warm)] p-3">
                            <p className="text-[12px] text-[var(--ink-mid)] leading-relaxed">
                                ☝️ 上方先選一個 AI 使用模式：教學型（推論卡關）／驗收型（找盲點+壓測）／不用（基本要求已達標）。
                            </p>
                        </div>
                    )}
                </div>
            ),
        },
                {
            title: '回顧繳交',
            icon: <FileText size={18} />,
            content: (
                <div className="flex flex-col gap-6 prose-zh">
                    <StepBriefing
                        task="雙線繳交：小組交圖+圖說（成果），個人交 W14 歷程 docx（責任紀錄）。"
                        done="Classroom 按「繳交」，進 W15 推論層。"
                    />
                    <div className="p-4 rounded-[var(--radius-unified)] border border-[var(--border)] bg-[var(--paper-warm)]">
                        <p className="text-[14px] font-bold text-[var(--ink)] mb-1">📋 今天學了兩件事</p>
                        <p className="text-[12px] text-[var(--ink-mid)] leading-relaxed">
                            選對盤子（圖表）＋ 幫一張圖寫說明（描述＋推論）。
                            <br />但記住：今天學的是針對<strong>一張圖</strong>的局部說明。下週 W15 要升級為<strong>整份研究的結論</strong>。
                        </p>
                    </div>

                    {/* 自我遷移：把找雷能力轉回自己研究 — 個人作業 #2 對應入口 */}
                    <div className="p-5 rounded-[var(--radius-unified)] border-2 border-[#F59E0B] bg-[#FFFBEB]">
                        <div className="flex items-center gap-2 mb-2">
                            <Target size={18} className="text-[#92400E]" />
                            <p className="font-bold text-[14px] text-[#92400E] m-0">🪞 自我遷移：我們組最危險的圖表／圖說紅線</p>
                        </div>
                        <p className="text-[12.5px] text-[#78350F] leading-[1.85] mb-3">
                            會挑 AI 報告的 17 條紅線不算什麼——能看出自己組這份圖+圖說最可能踩哪條才是研究員。一句話寫完。
                        </p>
                        <ThinkRecord
                            dataKey="w14-self-transfer"
                            prompt="我們組這份圖+圖說，最可能踩到 17 條紅線中的哪一條？為什麼？"
                            scaffold={[
                                '我們組最容易犯的圖表／圖說錯誤是：',
                                '原因是（樣本小／推論強詞／因果未驗證 …）：',
                                '我們會用什麼檢查規則避免：',
                            ]}
                            rows={4}
                        />
                    </div>

                    {/* W14 改寫練習 — 雷 #11 是個人繳交項，放繳交卡附近（從頁底搬進步驟流程）*/}
                    <TrapRewritePractice
                        trapNumber={11}
                        stage="W14"
                        title="散佈圖圖說「明顯」過度修飾"
                        wrong="整體而言，睡眠時數較高的學生，專注力分數明顯較高。"
                        issue="「明顯」需要相關係數（r 值）或統計檢定支撐。N=22 沒做任何檢定，圖看起來有趨勢就斷言「明顯」屬於過度修飾。"
                        hint="把「明顯」拿掉。改成保守的觀察用語——「初步」「看似」「傾向」。"
                        shouldDo="N=22 學生中，睡眠時數較高的學生，專注力分數初步看似較高（傾向隨睡眠時數遞增）。"
                        dataKey="w14-trap-rewrite-11"
                    />

                    {/* 雙線繳交主卡 — W14 期中接點 */}
                    <div className="bg-white border-2 border-[#10B981] rounded-[var(--radius-unified)] overflow-hidden">
                        <div className="bg-[#10B981] text-white px-4 py-2 font-bold text-[13px]">
                            📦 W14 結束前完成兩類繳交
                        </div>
                        <div className="p-4 space-y-4">
                            {/* 小組作業 */}
                            <div className="border-l-4 border-[#0284C7] bg-[#F0F9FF] rounded-r-[6px] p-3">
                                <p className="font-bold text-[13.5px] text-[#075985] mb-1.5">一、小組作業｜數據轉譯成果</p>
                                <ul className="text-[12.5px] text-[#0C4A6E] leading-[1.85] list-disc pl-5 space-y-1">
                                    <li><strong>第一張圖 + 圖說</strong>（圖：套 3 鐵規；圖說：描述＋推論分層、不過度斷言）</li>
                                    <li>嵌入組內 Google Slide／Doc 或上傳圖檔到 Classroom</li>
                                </ul>
                                <p className="text-[11.5px] text-[#0C4A6E] italic mt-2 pt-2 border-t border-[#0284C7]/30">
                                    💡 評分眼光：<strong>圖表與圖說是否清楚、不過度推論、樣本限制有交代</strong>。
                                </p>
                            </div>

                            {/* 個人作業 */}
                            <div className="border-l-4 border-[#7C3AED] bg-[#F5F3FF] rounded-r-[6px] p-3">
                                <p className="font-bold text-[13.5px] text-[#5B21B6] mb-1.5">二、個人作業｜數據詮釋責任紀錄</p>
                                <p className="text-[12.5px] text-[#4C1D95] leading-[1.85] mb-1.5">
                                    匯出 <strong>W14 網頁歷程 docx</strong>，重點是這 3 件：
                                </p>
                                <ul className="text-[12px] text-[#4C1D95] leading-[1.85] list-decimal pl-5 space-y-0.5">
                                    <li><strong>雷 #11 改寫練習</strong>（把「明顯反映了」改成謹慎版）</li>
                                    <li><strong>我們組最危險的紅線 / 自我遷移</strong>（一句話）</li>
                                    <li><strong>AI-RED 與完整 AI 對話</strong>（若有用 Gemini 等 AI 工具）</li>
                                </ul>
                                <p className="text-[11.5px] text-[#4C1D95] italic mt-2 pt-2 border-t border-[#7C3AED]/30">
                                    💡 評分眼光：<strong>你是否知道哪裡不能過度推論</strong>——不是填滿每格，是評詮釋責任。
                                </p>
                            </div>

                            {/* 繳交收尾 */}
                            <div className="bg-[#FEF3C7] border border-[#F59E0B] rounded-[6px] p-3">
                                <p className="text-[12.5px] font-bold text-[#92400E] leading-[1.85]">
                                    ✅ 全部完成後，到 <strong>Classroom 按下「繳交」</strong>。
                                </p>
                                <p className="text-[11.5px] text-[#92400E] italic mt-1.5">
                                    🎯 一句話原則：<strong>小組交數據轉譯成果，個人交數據詮釋責任紀錄。</strong>
                                </p>
                            </div>
                        </div>
                    </div>


                    {/* W15 預告 */}
                    <div className="p-5 rounded-[var(--radius-unified)] border-2 border-dashed border-[var(--accent)] bg-[#F0F4FF]">
                        <p className="text-[14px] font-bold text-[var(--accent)] mb-2">🚀 W15 預告：結論還要再加兩層</p>
                        <p className="text-[12px] text-[var(--ink-mid)] mb-3 leading-relaxed">
                            今天的「描述＋推論」是針對一張圖的。下週要把整份研究的所有發現整合，寫出完整的研究結論。
                            <br /><strong className="text-[var(--accent)]">名詞會升級</strong>：今天你寫的「推論」，到 W15 會變成「詮釋層」——不只解釋一張圖，而是整合所有發現、回答你最初的研究問題。那個結論除了描述和詮釋，還要加：
                        </p>
                        <ThinkRecord
                            dataKey="w14-w15-preview"
                            prompt="猜猜看，結論的第三層和第四層是什麼？（提示：回頭看你的研究問題 + 你的結論有哪些不完美？）"
                            scaffold={['第三層（提示：回頭看研究問題）：...', '第四層（提示：不完美的地方）：...']}
                        />
                    </div>

                    {/* AI-RED 敘事紀錄（依進階 AIMode 三分支） */}
                    {(w14AiMode === 'teach' || w14AiMode === 'verify') ? (
                        <AIREDNarrative week="14" hint="本週用 AI 進階壓測：A=Gemini Pro / I=找盲點+壓測 prompt / R=AI 找到的盲點+風險 / E=我同意/不同意哪些 / D=採納哪些修正" />
                    ) : w14AiMode === 'standalone' ? (
                        <div className="rounded-[var(--radius-unified)] border border-[var(--border)] bg-[var(--paper-warm)] p-4">
                            <p className="text-[13px] font-bold text-[var(--ink)] mb-1">✋ 純人工畫圖 · 進階壓測格略過</p>
                            <p className="text-[11.5px] text-[var(--ink-mid)] leading-relaxed">
                                你選擇全程不用 AI（包含畫圖）——AI-RED 進階壓測格自動略過。<br />
                                <strong>但只要中途用了 AI（例如 Gemini 畫圖／檢查描述／改寫圖說），就要回 Step 4 切換 AI Mode 並補敘事紀錄</strong>——這是 W13 起的共識：用 AI 必交 AI-RED。
                            </p>
                        </div>
                    ) : (
                        <AIREDNarrative week="14" hint="本週若有用 AI 進階檢核推論，記下最關鍵的一次互動" optional={true} />
                    )}

                    {/* 學期 AI 協作反思（從 W17 移過來——這週的「人 vs AI 分工」最清楚，反思最有素材）*/}
                    <div className="mt-6 p-5 rounded-[var(--radius-unified)] border-2 border-[#D97706] bg-[#FEF3C7]">
                        <div className="flex items-start justify-between mb-2 gap-2">
                            <p className="text-[14px] font-bold text-[#92400E]">🎯 學期 AI 協作反思（W14 寫，W17 抽問）</p>
                            <span className="text-[10px] font-mono text-[#92400E] bg-white px-2 py-0.5 rounded border border-[#D97706] flex-shrink-0">跨週作業</span>
                        </div>
                        <p className="text-[12px] text-[#78350F] leading-relaxed mb-3">
                            這週你親身經歷了「人選圖表類型／驗收三鐵規／先寫描述與推論」vs「AI 協助畫圖／檢核描述／壓測推論」這套分工——是整學期 AI 協作分工最清楚的一次。<br />
                            趁這個體感最強的時刻，回頭看：<strong>從 W1 模仿遊戲到今天，你跟 AI 共事最讓你改變想法的一次是什麼？</strong>
                        </p>
                        <div className="bg-white border border-[#FCD34D] rounded p-3 mb-3 text-[11.5px] text-[#92400E] leading-relaxed">
                            📌 <strong>不是評分作業，但 W17 Gallery Walk 當天老師會隨機點 3 位同學現場分享你寫的內容</strong>——空白或敷衍會很尷尬。寫具體的事件、具體的轉變，3-5 分鐘可以寫完。
                        </div>
                        <ThinkRecord
                            dataKey="w14-semester-reflection"
                            prompt="這學期跟 AI 協作的經驗，最讓你改變想法的是什麼？（具體寫一個事件 + 你的轉變）"
                            placeholder="例：我原本以為 AI 給的建議都該照單全收，但 W11 那次我的問卷被 AI 改到完全不像我自己的研究——那次之後我才真的懂『AI 給選項，人做選擇』的意思。"
                            scaffold={[
                                '我最初對 AI 的看法是…',
                                '一個讓我改變想法的具體事件（哪一週、發生什麼、你做了什麼）：…',
                                '現在我對「人機協作」的理解是…',
                            ]}
                            rows={6}
                        />
                    </div>

                    {/* 本週結束，你應該要會 — B 標準格式 */}
                    <div className="bg-white border border-[var(--border)] rounded-[var(--radius-unified)] overflow-hidden mb-4">
                        <div className="p-4 px-5 bg-[var(--paper-warm)] border-b border-[var(--border)] font-bold text-[13px]">
                            ✅ 本週結束，你應該要會
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-[1px] bg-[var(--border)]">
                            {[
                                                '為自己的數據選對圖表類型並說清楚理由',
                                                '把畫圖技術交給 AI，自己用三鐵規驗收圖表',
                                                '描述、推論都先自己寫——描述讓 AI 逐句檢核、推論讓 AI 壓測風險，但都不外包',
                                                '若選用 AI 進階壓測：知道過度推論／單一原因兩大雷並做判斷',
                            ].map((item, i) => (
                                <div key={i} className="p-4 px-5 bg-white flex items-start gap-3">
                                    <span className="text-[var(--success)] text-[16px] mt-0.5 flex-shrink-0">✓</span>
                                    <span className="text-[13px] text-[var(--ink-mid)] leading-relaxed">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 繳交提醒 — ExportButton 已併入頁面上方「我的紀錄」抽屜 */}
                    <div className="rounded-[var(--radius-unified)] border border-[var(--border)] bg-[var(--paper-warm)] p-4">
                        <p className="text-[12.5px] text-[var(--ink-mid)] leading-[1.8] m-0">
                            📁 <strong className="text-[var(--ink)]">要繳交了？</strong>回頁面上方的「<strong>我的紀錄</strong>」抽屜——它會列出本週每一格填了沒，並一鍵複製貼到 Google Classroom。
                        </p>
                    </div>

                    {/* 遊戲彩蛋 */}
                    <div className="bg-[var(--ink)] border-l-4 border-[var(--danger)] p-6 rounded-r-lg text-white shadow-xl">
                        <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                            <ShieldAlert className="text-[var(--danger)]" size={20} />
                            R.I.B. 單元挑戰：行動代號解碼
                        </h3>
                        <p className="text-[var(--ink-light)] text-sm mb-4">
                            研究圖表解讀能力——你能從各式數據情境中，挑出最適合的圖表類型嗎？
                        </p>
                        <Link to="/game/chart-matcher" className="inline-flex items-center gap-2 bg-[var(--danger)] text-white px-4 py-2 rounded font-bold text-sm hover:opacity-90 transition-colors">
                            進入解碼 <ArrowRight size={14} />
                        </Link>
                    </div>
                </div>
            ),
        },
    ];

    return (
        <div className="page-container animate-in-fade-slide">
            {/* TOP BAR */}
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-4 mb-8 md:mb-12 gap-3">
                <div className="text-[11px] font-mono text-[var(--ink-light)] flex items-center gap-2 min-w-0">
                    <span className="hidden md:inline">研究方法與專題 / 分析與報告 / </span><span className="text-[var(--ink)] font-bold">圖表與圖說 W14</span>
                </div>
                <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
                    <span className="bg-[var(--paper-warm)] text-[var(--ink)] text-[10px] font-bold px-2 py-0.5 rounded-[2px] font-mono">100 MINS</span>
                    <ResetWeekButton weekPrefix="w14-" />
                </div>
            </div>

            {/* PAGE HEADER — Hero Block（第一屏只留三句，spec §6-1）*/}
            <HeroBlock
                kicker="R.I.B. 調查檔案 · 研究方法與專題 · W14"
                question="我用什麼形式呈現，最不容易誤導？"
                title="讓數據自己說話 · "
                accentTitle="圖表選擇與圖說"
                todo={[
                    { label: '今天做什麼', value: '把 W13 分析表變成一張圖表和一段圖說。' },
                    { label: '為什麼做', value: '圖表要幫資料說話，選錯圖或說太滿都會誤導讀者。' },
                    { label: '今天交什麼', value: '小組＝圖表＋圖說；個人＝W14 歷程 docx。' },
                ]}
            />

            {/* 三模式切換 */}
            <ModeSwitch />

            {/* 自學補課路線 — 只在自學模式顯示（spec §5）*/}
            {mode === 'self-study' && (
                <div className="my-5 rounded-[var(--radius-unified)] border-2 border-[#0284C7] bg-[#F0F9FF] p-4 md:p-5">
                    <p className="text-[14px] font-bold text-[#075985] mb-1">📖 自學補課路線 · W14 可「部分自學」</p>
                    <p className="text-[11.5px] text-[#0C4A6E] leading-[1.7] mb-3">
                        選圖口訣、格式 3 鐵規、描述 vs 推論、AI 畫圖流程都能自學；小組「圖＋圖說」成果、Step 4 老師巡視、Step 6 抽問需要回課堂補。
                    </p>
                    <ol className="text-[12px] text-[#0C4A6E] leading-[1.85] list-none m-0 p-0 space-y-1">
                        <li><strong>① 先看：</strong>Step 1-3（選圖口訣／格式 3 鐵規／描述 vs 推論）</li>
                        <li><strong>② 做：</strong>Step 4 拿自己 W13 分析表，畫第一張圖＋寫圖說（①-⑥ 照做）</li>
                        <li><strong>③ 補紀錄：</strong>草圖判讀／圖表類型／驗收／描述／推論 ＋ 雷 #11 改寫 ＋ 自我遷移</li>
                        <li><strong>④ 交：</strong>個人 W14 歷程 docx（雷 #11 改寫、自我遷移、AI-RED 如有）</li>
                        <li><strong>⑤ 需要找人：</strong>小組「圖＋圖說」成果回組討論；老師巡視／抽問回課堂補</li>
                    </ol>
                    <div className="mt-3 pt-3 border-t border-[#0284C7]/30">
                        <p className="text-[12px] font-bold text-[#075985] mb-1">⛑️ 最低完成版（缺課至少做到這些才算補到核心）</p>
                        <p className="text-[11.5px] text-[#0C4A6E] leading-[1.85] m-0">
                            ① 完成一張圖表（套 3 鐵規）　② 寫一段描述　③ 寫一段推論　④ 完成雷 #11 改寫　⑤ 匯出 W14 歷程 docx
                        </p>
                    </div>
                </div>
            )}

            {/* 我的紀錄抽屜 — 兩模式都能開（spec §3 方案 A：總覽＋匯出，input 留 Step）*/}
            <RecordDrawer
                weekLabel="W14 讓數據自己說話：圖表選擇與圖說"
                fields={EXPORT_FIELDS}
                extraFields={RECORD_EXTRA_FIELDS}
            />

            {/* 為什麼是這週 + 本週資訊 — 深度補充 */}
            <DepthBlock title="延伸補充">
                <p className="text-[13px] text-[var(--ink-mid)] leading-[1.85] mb-3">
                    <strong>為什麼是這週：</strong>W13 把原始資料整理成「分析表」了——但一堆數字／訪談稿，怎麼讓人看得懂？這週學「讓數據自己說話」：選對圖、寫對說明。
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                        { label: '本週任務', value: '4 大圖表判斷 + AI 畫圖+人工驗收 + 自寫推論 + 進階壓測（可選）' },
                        { label: '時長', value: '100 MINS' },
                        { label: '課堂產出', value: '完成圖（含三鐵規驗收）+ 描述+推論（人工為主）' },
                        { label: '下週預告', value: 'W15 四層結論' },
                    ].map((m, i) => (
                        <div key={i}>
                            <div className="text-[10px] font-mono text-[var(--ink-light)] uppercase tracking-[0.1em] mb-1">{m.label}</div>
                            <div className="text-[12px] font-bold text-[var(--ink)] leading-[1.5]">{m.value}</div>
                        </div>
                    ))}
                </div>
            </DepthBlock>

            <CourseArc items={W14Data.courseArc} />

            <TaskCard
                weekNumber="W14"
                weekTitle={W14Data.title}
                duration={`${W14Data.duration} 分鐘 · ${W14Data.durationDesc}`}
                tasks={[
                    '四大圖表速查（折線／圓餅／長條／散佈）— 選對才能讓數據說話',
                    '圖說寫作公式 — 描述（客觀）+ 推論（主觀）',
                    'AI 協作三步 — 自己寫初稿 → AI 檢核 → 人工判斷取捨',
                ]}
                exportReminder="小組繳交圖表+圖說；個人繳交 W14 歷程 docx（雷 #11 改寫、自我遷移、AI-RED 如有）。完成後到 Classroom 按「繳交」。"
            />

            {/* W14 任務前警戒語 — 3 條核心紅線 */}
            <ResearcherRedlines mode="warning" stage="W14" />

            {/* STEP ENGINE */}
            <StepEngine
                steps={steps}
                prevWeek={{ label: '回 W13 資料整理週', to: '/w13' }}
                nextWeek={{ label: '前往 W15 研究結論', to: '/w15' }}
            flat
            />

            {/* W14 階段紅線完整版 — 5 條 · 深度補充 */}
            <DepthBlock title="延伸補充">
                <ResearcherRedlines mode="subset" stage="W14" />
            </DepthBlock>
        </div>
    );
};

const W14Page = () => (
    <ModeProvider week="W14">
        <W14PageContent />
    </ModeProvider>
);

export { W14Page };
export default W14Page;

