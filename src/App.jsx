import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './layouts/Layout';
import { Home } from './pages/Home';
import { Wizard } from './pages/Wizard';
import { AnalysisHub } from './pages/AnalysisHub';
import { Discovery } from './pages/Discovery';
import { W1Page } from './pages/W1Page';
import { ProblemFocus } from './pages/ProblemFocus';
import { ClinicPage } from './pages/ClinicPage';
import { ToolDesignPage } from './pages/ToolDesignPage';
import { ToolRefinementPage } from './pages/ToolRefinementPage';
import { W10Page } from './pages/W10Page';
import { W11Page } from './pages/W11Page';
import { W12Page } from './pages/W12Page';
import { W13Page } from './pages/W13Page';
import { W14Page } from './pages/W14Page';
import { W15Page } from './pages/W15Page';
import { W16Page } from './pages/W16Page';
import { W4Page } from './pages/W4Page';
import { W50Page } from './pages/W50Page';
import { GameHub } from './pages/games/GameHub';
import { ToolQuizGame } from './pages/games/ToolQuizGame';
import { CitationDetectiveGame } from './pages/games/CitationDetectiveGame';
import { QuestionERGame } from './pages/games/QuestionERGame';
import { RxInspectorGame } from './pages/games/RxInspectorGame';
import { DataDetectiveGame } from './pages/games/DataDetectiveGame';
import { ChartMatcherGame } from './pages/games/ChartMatcherGame';
import { LiteratureReview } from './pages/LiteratureReview';
import { TeamFormation } from './pages/TeamFormation';
import { ChartSelection } from './pages/ChartSelection';
import { PromptLab } from './pages/PromptLab';
import { Dossier } from './pages/Dossier';
import { PhantomDataHub } from './pages/games/PhantomDataHub';
import { PhantomCh1 } from './pages/games/PhantomCh1';
import { PhantomCh2 } from './pages/games/PhantomCh2';
import { PhantomCh3 } from './pages/games/PhantomCh3';
import { PhantomCh4 } from './pages/games/PhantomCh4';
import { PhantomCh5 } from './pages/games/PhantomCh5';

function App() {
  return (
    <BrowserRouter>
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
          <Route path="w5-0" element={<W50Page />} />

          <Route path="clinic" element={<ClinicPage />} />
          <Route path="w6" element={<ClinicPage />} />
          <Route path="literature-review" element={<LiteratureReview />} />
          <Route path="w5" element={<LiteratureReview />} />
          <Route path="team-formation" element={<TeamFormation />} />
          <Route path="w7" element={<TeamFormation />} />
          <Route path="tool-design" element={<ToolDesignPage />} />
          <Route path="tool-refinement" element={<ToolRefinementPage />} />
          <Route path="w9" element={<ToolRefinementPage />} />
          <Route path="w10" element={<W10Page />} />
          <Route path="w11" element={<W11Page />} />
          <Route path="w12" element={<W12Page />} />
          <Route path="w13" element={<W13Page />} />
          <Route path="w14" element={<W14Page />} />
          <Route path="w15" element={<W15Page />} />
          <Route path="w16" element={<W16Page />} />
          <Route path="analysis" element={<AnalysisHub />} />
          <Route path="chart-selection" element={<ChartSelection />} />

          <Route path="games" element={<GameHub />} />
          <Route path="game/question-er" element={<QuestionERGame />} />
          <Route path="game/rx-inspector" element={<RxInspectorGame />} />
          <Route path="game/tool-quiz" element={<ToolQuizGame />} />
          <Route path="game/citation-detective" element={<CitationDetectiveGame />} />
          <Route path="game/data-detective" element={<DataDetectiveGame />} />
          <Route path="game/chart-matcher" element={<ChartMatcherGame />} />
          <Route path="prompt-lab" element={<PromptLab />} />
          <Route path="dossier" element={<Dossier />} />
          <Route path="phantom" element={<PhantomDataHub />} />
          <Route path="phantom/ch1" element={<PhantomCh1 />} />
          <Route path="phantom/ch2" element={<PhantomCh2 />} />
          <Route path="phantom/ch3" element={<PhantomCh3 />} />
          <Route path="phantom/ch4" element={<PhantomCh4 />} />
          <Route path="phantom/ch5" element={<PhantomCh5 />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

