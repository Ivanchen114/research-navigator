import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './layouts/Layout';
import { Home } from './pages/Home';

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
    </BrowserRouter>
  );
}

export default App;
