import React, { useState } from 'react';
import {
  Terminal,
  Sparkles,
  Copy,
  RotateCcw,
  CheckCircle2,
  Info,
  ChevronRight,
  ChevronDown,
  UserCircle2,
  BrainCircuit,
  Database,
  Eye,
  FileEdit,
  ExternalLink,
  Lightbulb,
  XCircle,
  GraduationCap
} from 'lucide-react';

const AI_ROLES = [
  { id: 'quant_expert', name: '量化研究專家', desc: '擅長統計、問卷設計與數據分析邏輯。' },
  { id: 'qual_expert', name: '質性研究專家', desc: '擅長訪談、觀察紀錄編碼與主題歸納。' },
  { id: 'lit_detective', name: '文獻鑑識官', desc: '擅長尋找關聯文獻、分析理論框架與標記爭議點。' },
  { id: 'writing_coach', name: '學術寫作教練', desc: '擅長修辭潤色、邏輯連貫性與結構優化。' },
  { id: 'viz_consultant', name: '資料視覺化顧問', desc: '擅長圖表選擇、資訊設計與視覺敘事。' },
  { id: 'ethics_advisor', name: '研究倫理顧問', desc: '擅長風險評估、隱私保護與知情同意書審查。' }
];

const RESEARCH_STAGES = [
  { id: 'topic', name: '問題意識與對焦', promptTemplate: '我正在進行關於「[TOPIC]」的研究。目前我的研究問題是「[QUESTION]」。請針對這個題目的「可執行性」與「研究價值」進行初步評估，並指出是否有「百科全書病」或「抽象哲學病」的風險。' },
  { id: 'lit_review', name: '文獻回顧與整理', promptTemplate: '針對「[TOPIC]」這個主題,我已經蒐集了以下關鍵字:[KEYWORDS]。請幫我架構一個初步的文獻回顧地圖,並說明為了支持「[QUESTION]」,我該重點閱讀哪一類的文獻?' },
  { id: 'methodology', name: '研究方法與工具', promptTemplate: '我的研究題目是「[QUESTION]」,我打算使用「[METHOD]」法。請幫我模擬 5 位受訪者/受測者可能的回應,並指出我的工具設計中是否存在「誘導性提問」或「變因失控」的缺陷。' },
  { id: 'analysis', name: '數據分析與詮釋', promptTemplate: '我蒐集到了以下原始數據:[DATA]。請根據這些數據,提出 3 個可能的詮釋方向,並提醒我如何避免「倖存者偏差」或「過度推論」。' }
];

const WHY_TIPS = {
  role: {
    title: '為什麼要先設定 AI 角色？',
    body: '限定 AI 的專業領域，會讓它從「泛泛而談」收斂到「特定視角」。同一個問題問「量化專家」和「倫理顧問」，答案會有完全不同的切入點——這讓你能按需取用，而不是每次都收到通用模板式回答。'
  },
  stage: {
    title: '為什麼要挑選研究階段？',
    body: '不同階段需要 AI 幫的忙不一樣：對焦題目要的是「診斷風險」、文獻回顧要的是「組織結構」、分析階段要的是「提醒偏誤」。階段選對，模板才能把對應的思考框架塞進 prompt 裡。'
  },
  material: {
    title: '為什麼要填研究素材？',
    body: '空話問 AI（例如「幫我看看我的題目好不好」）只會得到空話回答。把你的實際題目、關鍵字、方法寫進 prompt，AI 才有東西可以分析——這叫「提供脈絡（Context）」，是 prompt 工程第一原則。'
  }
};

const PROMPT_COMPARISONS = [
  {
    scenario: '情境：我想研究「高中生睡眠」',
    bad: '幫我看看我想研究高中生睡眠這個題目怎麼樣？',
    badWhy: '沒角色、沒具體問題、沒提想怎麼做——AI 只會給你「建議多參考文獻」這種廢話。',
    good: '你是一位量化研究專家。我想研究「高中生睡眠時間與段考成績的關係」，打算用問卷法收集 120 位學生的資料。請評估：(1) 這個題目的可執行性；(2) 問卷可能遇到的變因失控風險；(3) 建議的樣本抽樣方式。',
    goodWhy: '角色 + 具體題目 + 方法 + 明確要 AI 做什麼（三個編號任務）。AI 會給結構化、可用的回答。'
  },
  {
    scenario: '情境：請 AI 幫忙看訪談逐字稿',
    bad: '這是我的訪談稿，幫我分析。',
    badWhy: '沒說要分析什麼、沒說用什麼角度、沒說輸出格式——AI 會隨便給個摘要。',
    good: '你是一位質性研究專家。以下是我訪問 3 位學生關於手機成癮的逐字稿。請：(1) 用開放編碼方式標出重複出現的主題（至少 5 個）；(2) 指出哪些回答可能有「社會期待偏誤」；(3) 建議我下一輪訪談該補問什麼問題。輸出用表格。',
    goodWhy: '明確動詞（編碼、標出、建議）+ 數量（至少 5 個）+ 格式（表格）。限制越清楚，AI 越難打混。'
  },
  {
    scenario: '情境：AI 答得不夠好，要追問',
    bad: '再給我多一點',
    badWhy: '「多一點」是模糊指令，AI 只會重複剛才說過的內容。',
    good: '你剛才提到的第 2 點「樣本選擇偏差」，可以舉一個高中校園研究的具體案例嗎？並說明這個偏差會如何影響結論的推論範圍。',
    goodWhy: 'Prompt 工程核心能力：**迭代追問**。指定要延伸哪一點 + 要求具體範例 + 限定情境（高中校園）。'
  }
];

const AI_PLATFORMS = [
  { name: 'ChatGPT', url: 'https://chatgpt.com/', color: 'bg-emerald-600 hover:bg-emerald-700' },
  { name: 'Claude', url: 'https://claude.ai/', color: 'bg-orange-600 hover:bg-orange-700' },
  { name: 'Gemini', url: 'https://gemini.google.com/', color: 'bg-blue-600 hover:bg-blue-700' }
];

const CollapsibleWhy = ({ tip }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-3 border-t border-slate-100 pt-3">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 text-[11px] font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
      >
        <Lightbulb size={13} />
        {tip.title}
        {open ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
      </button>
      {open && (
        <div className="mt-2 text-[12px] leading-relaxed text-slate-600 bg-indigo-50/50 border-l-2 border-indigo-300 pl-3 py-2">
          {tip.body}
        </div>
      )}
    </div>
  );
};

export const PromptLab = () => {
  const [selectedRole, setSelectedRole] = useState(AI_ROLES[0]);
  const [selectedStage, setSelectedStage] = useState(RESEARCH_STAGES[0]);
  const [inputs, setInputs] = useState({
    topic: '',
    question: '',
    keywords: '',
    method: '',
    data: ''
  });
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [copied, setCopied] = useState(false);

  const handleInputChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  // 檢查必填欄位是否完成
  const getRequiredFields = () => {
    switch (selectedStage.id) {
      case 'topic': return ['topic', 'question'];
      case 'lit_review': return ['topic', 'keywords', 'question'];
      case 'methodology': return ['question', 'method'];
      case 'analysis': return ['data'];
      default: return [];
    }
  };
  const requiredFields = getRequiredFields();
  const isReady = requiredFields.every(f => inputs[f]?.trim());
  const missingFields = requiredFields.filter(f => !inputs[f]?.trim());

  const fieldLabels = {
    topic: '研究大主題',
    question: '研究問題',
    keywords: '關鍵字',
    method: '研究方法',
    data: '原始數據'
  };

  const generatePrompt = () => {
    if (!isReady) return;

    let template = selectedStage.promptTemplate;
    Object.keys(inputs).forEach(key => {
      const placeholder = `[${key.toUpperCase()}]`;
      template = template.replaceAll(placeholder, inputs[key] || `(尚未填寫${key})`);
    });

    const finalPrompt = `你現在是一位具備「${selectedRole.name}」背景的研究專家，擁有深厚的學術訓練與嚴謹的批判性思考。

${template}

【協作規範】：
1. 請以「研究教練」的口吻與我對話。
2. 你的回答應包含具體的優點、缺點與改進建議。
3. 如果我給的資訊不足，請主動詢問我更多細節。
4. 在回答的最末尾，請提醒我對你的產出進行「Evaluate（評估）」與「Document（紀錄）」。`;

    setGeneratedPrompt(finalPrompt);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const resetAll = () => {
    setGeneratedPrompt('');
    setInputs({ topic: '', question: '', keywords: '', method: '', data: '' });
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] py-12 px-4 md:px-8 font-sans">
      <style dangerouslySetInnerHTML={{ __html: `
        .prompt-card { background: white; border: 1px solid #e2e8f0; border-radius: 2px; padding: 1.5rem; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); }
        .input-group { margin-bottom: 1.5rem; }
        .input-label { display: flex; align-items: center; gap: 0.5rem; font-size: 0.75rem; font-weight: 900; color: #64748b; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 0.5rem; }
        .input-field { width: 100%; background: #f1f5f9; border: 1px solid #e2e8f0; border-radius: 2px; padding: 0.625rem 1rem; color: #1e293b; transition: border-color 0.2s; }
        .input-field:focus { outline: none; border-color: #6366f1; }
      `}} />

      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-10 border-b border-slate-200 pb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-indigo-600 p-3 rounded-sm text-white shadow-lg shadow-indigo-200">
              <Terminal size={32} />
            </div>
            <div>
              <div className="text-xs font-black text-indigo-600 tracking-[0.2em] uppercase mb-1 flex items-center gap-2">
                AI-RED Framework V2.0
                <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded text-[10px] normal-case tracking-normal font-bold flex items-center gap-1">
                  <GraduationCap size={11} /> 自學模式
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-slate-900 font-serif tracking-tight">
                AI 協作實驗室 <span className="text-indigo-600">Prompt Lab</span>
              </h1>
            </div>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed max-w-3xl">
            依 <strong>角色 → 階段 → 素材</strong> 三步驟，幫你組出對 AI 提問的高品質 prompt。
            每個步驟旁邊點開「💡 為什麼這樣寫」，你會看到背後的 prompt 工程原理。
            下方還有「爛 vs 好 prompt 對照」可以自學——沒有老師在旁邊也看得懂。
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Config Section */}
          <div className="lg:col-span-5 space-y-6">

            {/* Step 1: Role */}
            <div className="prompt-card" style={{ borderTop: '4px solid #6366f1' }}>
              <label className="input-label"><UserCircle2 size={14} /> Step 1 · 設定 AI 角色</label>
              <div className="grid grid-cols-1 gap-3">
                {AI_ROLES.map(role => (
                  <button
                    key={role.id}
                    onClick={() => setSelectedRole(role)}
                    className={`text-left p-4 rounded border transition-all ${selectedRole.id === role.id ? 'bg-indigo-50 border-indigo-400 ring-1 ring-indigo-400' : 'bg-white border-slate-200 hover:border-indigo-200'}`}
                  >
                    <div className="font-bold text-slate-800 flex items-center justify-between">
                      {role.name}
                      {selectedRole.id === role.id && <CheckCircle2 size={16} className="text-indigo-600" />}
                    </div>
                    <div className="text-xs text-slate-500 mt-1">{role.desc}</div>
                  </button>
                ))}
              </div>
              <CollapsibleWhy tip={WHY_TIPS.role} />
            </div>

            {/* Step 2: Stage */}
            <div className="prompt-card" style={{ borderTop: '4px solid #06b6d4' }}>
              <label className="input-label"><BrainCircuit size={14} /> Step 2 · 選研究階段</label>
              <div className="space-y-3">
                {RESEARCH_STAGES.map(stage => (
                  <button
                    key={stage.id}
                    onClick={() => setSelectedStage(stage)}
                    className={`w-full text-left px-4 py-3 rounded border transition-all flex items-center justify-between ${selectedStage.id === stage.id ? 'bg-cyan-50 border-cyan-400' : 'bg-white border-slate-200 hover:border-cyan-200'}`}
                  >
                    <span className={`font-bold ${selectedStage.id === stage.id ? 'text-cyan-700' : 'text-slate-700'}`}>{stage.name}</span>
                    <ChevronRight size={16} className={selectedStage.id === stage.id ? 'text-cyan-600' : 'text-slate-300'} />
                  </button>
                ))}
              </div>
              <CollapsibleWhy tip={WHY_TIPS.stage} />
            </div>

            {/* Step 3: Materials */}
            <div className="prompt-card" style={{ borderTop: '4px solid #10b981' }}>
              <label className="input-label"><Database size={14} /> Step 3 · 填入研究素材</label>
              <div className="space-y-4">
                {(selectedStage.id === 'topic' || selectedStage.id === 'lit_review') && (
                  <div className="input-group">
                    <label className="text-xs font-bold text-slate-400 mb-1 block">研究大主題 *</label>
                    <input name="topic" value={inputs.topic} onChange={handleInputChange} placeholder="例如：高中生社群成癮、校園節能..." className="input-field" />
                  </div>
                )}
                {(selectedStage.id === 'topic' || selectedStage.id === 'methodology' || selectedStage.id === 'lit_review') && (
                  <div className="input-group">
                    <label className="text-xs font-bold text-slate-400 mb-1 block">當前的研究問題 *</label>
                    <textarea name="question" value={inputs.question} onChange={handleInputChange} placeholder="例如：本校學生在段考前的睡眠品質..." className="input-field h-20" />
                  </div>
                )}
                {selectedStage.id === 'lit_review' && (
                  <div className="input-group">
                    <label className="text-xs font-bold text-slate-400 mb-1 block">關鍵字清單 *</label>
                    <input name="keywords" value={inputs.keywords} onChange={handleInputChange} placeholder="例如：FOMO, 睡眠不足, 學業表現..." className="input-field" />
                  </div>
                )}
                {selectedStage.id === 'methodology' && (
                  <div className="input-group">
                    <label className="text-xs font-bold text-slate-400 mb-1 block">擬採用的方法 *</label>
                    <input name="method" value={inputs.method} onChange={handleInputChange} placeholder="例如：半結構式訪談、李克特五點量表問卷..." className="input-field" />
                  </div>
                )}
                {selectedStage.id === 'analysis' && (
                  <div className="input-group">
                    <label className="text-xs font-bold text-slate-400 mb-1 block">原始數據摘要 *</label>
                    <textarea name="data" value={inputs.data} onChange={handleInputChange} placeholder="貼上你的觀察紀錄、問卷初步統計或數據..." className="input-field h-32" />
                  </div>
                )}
              </div>

              <CollapsibleWhy tip={WHY_TIPS.material} />

              {!isReady && (
                <div className="mt-4 text-[12px] text-amber-700 bg-amber-50 border border-amber-200 rounded px-3 py-2 flex items-start gap-2">
                  <Info size={14} className="shrink-0 mt-0.5" />
                  <span>請先填寫：{missingFields.map(f => fieldLabels[f]).join('、')}</span>
                </div>
              )}

              <button
                onClick={generatePrompt}
                disabled={!isReady}
                className={`w-full font-black py-4 rounded-sm transition-all flex items-center justify-center gap-2 mt-4 shadow-lg ${
                  isReady
                    ? 'bg-slate-900 text-white hover:bg-indigo-600'
                    : 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
                }`}
              >
                <Sparkles size={18} /> 產生協作 Prompt
              </button>
            </div>
          </div>

          {/* Output Section */}
          <div className="lg:col-span-7 space-y-6">
            <div className="prompt-card h-full flex flex-col min-h-[600px] border-2 border-indigo-100 bg-[#fdfdff]">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <div className="bg-indigo-100 p-2 rounded text-indigo-600">
                    <Eye size={20} />
                  </div>
                  <h3 className="font-black text-slate-800 tracking-wider">預覽協作內容</h3>
                </div>
                <div className="flex gap-2">
                  {generatedPrompt && (
                    <button
                      onClick={resetAll}
                      className="p-2 text-slate-400 hover:text-rose-500 transition-colors"
                      title="重置"
                    >
                      <RotateCcw size={20} />
                    </button>
                  )}
                </div>
              </div>

              {!generatedPrompt ? (
                <div className="flex-1 flex flex-col items-center justify-center text-slate-400 space-y-4 py-20 px-10 text-center border-2 border-dashed border-slate-100 rounded">
                  <div className="bg-slate-50 p-6 rounded-full">
                    <FileEdit size={48} className="opacity-20" />
                  </div>
                  <p className="font-bold">依序完成左方（或下方）三步驟<br />並點擊「產生協作 Prompt」</p>
                </div>
              ) : (
                <div className="flex-1 flex flex-col">
                  <div className="bg-slate-900 text-slate-300 p-6 rounded border border-slate-800 font-mono text-sm leading-relaxed whitespace-pre-wrap flex-1 shadow-inner overflow-auto max-h-[500px]">
                    {generatedPrompt}
                  </div>

                  <div className="mt-6 space-y-3">
                    <button
                      onClick={copyToClipboard}
                      className={`w-full ${copied ? 'bg-emerald-600' : 'bg-indigo-600 hover:bg-indigo-700'} text-white font-black py-4 rounded-sm transition-all flex items-center justify-center gap-2 shadow-lg`}
                    >
                      {copied ? <CheckCircle2 size={20} /> : <Copy size={20} />}
                      {copied ? '已複製到剪貼簿！' : '複製 Prompt'}
                    </button>

                    {copied && (
                      <div>
                        <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">貼到你常用的 AI：</div>
                        <div className="grid grid-cols-3 gap-2">
                          {AI_PLATFORMS.map(p => (
                            <a
                              key={p.name}
                              href={p.url}
                              target="_blank"
                              rel="noreferrer"
                              className={`${p.color} text-white font-bold px-3 py-3 rounded-sm flex items-center justify-center gap-1.5 text-sm transition-all shadow`}
                            >
                              {p.name}
                              <ExternalLink size={12} />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-8 bg-amber-50 border border-amber-200 p-5 rounded-sm">
                    <div className="flex items-center gap-2 text-amber-700 font-black mb-3 uppercase text-xs tracking-widest">
                      <Info size={16} /> 拿到 AI 回答之後，別忘了 E 與 D
                    </div>
                    <div className="space-y-3">
                      <div className="text-sm">
                        <span className="font-black text-amber-600">E (Evaluate) 評估：</span>
                        <p className="text-slate-700 mt-1 leading-relaxed">
                          AI 的回答<strong>不是標準答案</strong>。把它貼回你所在週次的「AI-RED 敘事紀錄」欄，寫下你採納了什麼、不採納什麼、為什麼。
                        </p>
                      </div>
                      <div className="text-sm">
                        <span className="font-black text-amber-600">D (Document) 紀錄：</span>
                        <p className="text-slate-700 mt-1 leading-relaxed">
                          把這次對話存下來——可以截圖存 Google Drive、或複製整段對話到 Google Doc。研究結束要能回溯 AI 在你研究裡扮演了什麼角色。
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Prompt 對照診所 */}
        <div className="mt-16 border-t-2 border-slate-200 pt-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-rose-100 p-2 rounded text-rose-600">
              <Sparkles size={20} />
            </div>
            <h2 className="text-2xl font-black text-slate-900 font-serif tracking-tight">
              Prompt 對照診所
            </h2>
          </div>
          <p className="text-sm text-slate-600 mb-8 max-w-3xl leading-relaxed">
            上面的工具幫你產 prompt，但如果離開這頁、你能自己寫嗎？
            下面三組對照可以幫你看懂「為什麼結構化的 prompt 比隨口一問強」——等你能一眼認出爛 prompt，就不再需要模板了。
          </p>

          <div className="space-y-6">
            {PROMPT_COMPARISONS.map((c, i) => (
              <div key={i} className="prompt-card">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                  對照 {String(i + 1).padStart(2, '0')} · {c.scenario}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Bad */}
                  <div className="border-l-4 border-rose-300 bg-rose-50/50 p-4 rounded-r">
                    <div className="flex items-center gap-1.5 text-rose-700 font-black text-xs uppercase tracking-wider mb-2">
                      <XCircle size={14} /> 爛 Prompt
                    </div>
                    <div className="text-sm text-slate-800 bg-white p-3 rounded border border-rose-100 font-mono leading-relaxed mb-2">
                      {c.bad}
                    </div>
                    <div className="text-xs text-slate-600 leading-relaxed">
                      <strong className="text-rose-700">問題：</strong>{c.badWhy}
                    </div>
                  </div>

                  {/* Good */}
                  <div className="border-l-4 border-emerald-400 bg-emerald-50/50 p-4 rounded-r">
                    <div className="flex items-center gap-1.5 text-emerald-700 font-black text-xs uppercase tracking-wider mb-2">
                      <CheckCircle2 size={14} /> 好 Prompt
                    </div>
                    <div className="text-sm text-slate-800 bg-white p-3 rounded border border-emerald-100 font-mono leading-relaxed mb-2">
                      {c.good}
                    </div>
                    <div className="text-xs text-slate-600 leading-relaxed">
                      <strong className="text-emerald-700">為什麼好：</strong>{c.goodWhy}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 自學小結 */}
          <div className="mt-8 bg-slate-900 text-slate-100 p-6 rounded-sm">
            <div className="flex items-center gap-2 text-amber-400 font-black text-xs uppercase tracking-widest mb-3">
              <GraduationCap size={14} /> 自學小結：好 Prompt 的五要素
            </div>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-sm">
              <div className="bg-slate-800 p-3 rounded">
                <div className="font-black text-indigo-400 text-xs uppercase mb-1">01 角色</div>
                <div className="text-slate-300 text-xs leading-relaxed">你是誰？什麼專業？</div>
              </div>
              <div className="bg-slate-800 p-3 rounded">
                <div className="font-black text-cyan-400 text-xs uppercase mb-1">02 任務</div>
                <div className="text-slate-300 text-xs leading-relaxed">要做什麼？動詞要明確。</div>
              </div>
              <div className="bg-slate-800 p-3 rounded">
                <div className="font-black text-emerald-400 text-xs uppercase mb-1">03 脈絡</div>
                <div className="text-slate-300 text-xs leading-relaxed">背景、題目、現況資料。</div>
              </div>
              <div className="bg-slate-800 p-3 rounded">
                <div className="font-black text-amber-400 text-xs uppercase mb-1">04 格式</div>
                <div className="text-slate-300 text-xs leading-relaxed">要表格？編號？幾段？</div>
              </div>
              <div className="bg-slate-800 p-3 rounded">
                <div className="font-black text-rose-400 text-xs uppercase mb-1">05 限制</div>
                <div className="text-slate-300 text-xs leading-relaxed">不要什麼？字數上限？</div>
              </div>
            </div>
            <p className="text-xs text-slate-400 mt-4 leading-relaxed">
              下次寫 prompt 前，先在腦中快速過一次這五格——缺一格就補一格，
              習慣之後你會發現，「問得好」比「換更好的 AI」有用得多。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
