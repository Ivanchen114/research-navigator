import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './layouts/Layout';
import { Home } from './pages/Home';
import { Wizard } from './pages/Wizard';
import { AnalysisHub } from './pages/AnalysisHub';
import { Discovery } from './pages/Discovery';
import { ClinicPage } from './pages/ClinicPage';
import { ToolDesignPage } from './pages/ToolDesignPage';
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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="discovery" element={<Discovery />} />
          <Route path="wizard" element={<Wizard />} />
          <Route path="clinic" element={<ClinicPage />} />
          <Route path="literature-review" element={<LiteratureReview />} />
          <Route path="team-formation" element={<TeamFormation />} />
          <Route path="tool-design" element={<ToolDesignPage />} />
          <Route path="analysis" element={<AnalysisHub />} />
          <Route path="chart-selection" element={<ChartSelection />} />

          <Route path="games" element={<GameHub />} />
          <Route path="game/question-er" element={<QuestionERGame />} />
          <Route path="game/rx-inspector" element={<RxInspectorGame />} />
          <Route path="game/tool-quiz" element={<ToolQuizGame />} />
          <Route path="game/citation-detective" element={<CitationDetectiveGame />} />
          <Route path="game/data-detective" element={<DataDetectiveGame />} />
          <Route path="game/chart-matcher" element={<ChartMatcherGame />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

