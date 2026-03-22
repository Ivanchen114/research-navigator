import React, { useState } from 'react';
import { 
  Terminal, 
  Sparkles, 
  Copy, 
  RotateCcw, 
  CheckCircle2, 
  Info,
  ChevronRight,
  ShieldCheck,
  BrainCircuit,
  Database,
  Eye,
  FileEdit
} from 'lucide-react';

const AI_ROLES = [
  { id: 'method_expert', name: '量化研究專家', desk: '擅長統計、問卷設計與數據分析邏輯。' },
  { id: 'lit_detective', name: '文獻鑑識官', desk: '擅長尋找關聯文獻、分析理論框架與標記爭議點。' },
  { id: 'writing_coach', name: '學術寫作教練', desk: '擅長修辭潤色、邏輯連貫性與結構優化。' },
  { id: 'ethics_advisor', name: '研究倫理顧問', desk: '擅長風險評估、隱私保護與知情同意書審查。' }
];

const RESEARCH_STAGES = [
  { id: 'topic', name: '問題意識與對焦', promptTemplate: '我正在進行關於「[TOPIC]」的研究。目前我的研究問題是「[QUESTION]」。請針對這個題目的「可執行性」與「研究價值」進行初步評估，並指出是否有「百科全書病」或「抽象哲學病」的風險。' },
  { id: 'lit_review', name: '文獻回顧與整理', promptTemplate: '針對「[TOPIC]」這個主題，我已經蒐集了以下關鍵字：[KEYWORDS]。請幫我架構一個初步的文獻回顧地圖，並說明為了支持「[QUESTION]」，我該重點閱讀哪一類的文獻？' },
  { id: 'methodology', name: '研究方法與工具', promptTemplate: '我的研究題目是「[QUESTION]」，我打算使用「[METHOD]」法。請幫我模擬 5 位受訪者/受測者可能的回應，並指出我的工具設計中是否存在「誘導性提問」或「變因失控」的缺陷。' },
  { id: 'analysis', name: '數據分析與詮釋', promptTemplate: '我蒐集到了以下原始數據：[DATA]。請根據這些數據，提出 3 個可能的詮釋方向，並提醒我如何避免「倖存者偏差」或「過度推論」。' }
];

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

  const generatePrompt = () => {
    let template = selectedStage.promptTemplate;
    // Replace placeholders
    Object.keys(inputs).forEach(key => {
      const placeholder = `[${key.toUpperCase()}]`;
      template = template.replaceAll(placeholder, inputs[key] || `(尚未填寫${key})`);
    });

    const finalPrompt = `你現在是一位具備「[${selectedRole.name}]」背景的研究專家，擁有深厚的學術訓練與嚴謹的批判性思考。

${template}

【協作規範】：
1. 請以「研究教練」的口吻與我對話。
2. 你的回答應包含具體的優點、缺點與改進建議。
3. 如果我給的資訊不足，請主動詢問我更多細節。
4. 在回答的最末尾，請提醒我對你的產出進行「Evaluate (評估)」與「Document (記錄)」。`;

    setGeneratedPrompt(finalPrompt);
  };

  const copyToClipboard = () => {
    let textToCopy = generatedPrompt;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
        <div className="flex items-center gap-4 mb-10 border-b border-slate-200 pb-8">
          <div className="bg-indigo-600 p-3 rounded-sm text-white shadow-lg shadow-indigo-200">
            <Terminal size={32} />
          </div>
          <div>
            <div className="text-xs font-black text-indigo-600 tracking-[0.2em] uppercase mb-1">AI-RED Framework V2.0</div>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 font-serif tracking-tight">AI 協作實驗室 <span className="text-indigo-600">Prompt Lab</span></h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Config Section */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* A: Ascribe Role */}
            <div className="prompt-card" style={{ borderTop: '4px solid #6366f1' }}>
              <label className="input-label"><ShieldCheck size={14} /> Step 1: Ascribe (指定 AI 角色)</label>
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
                    <div className="text-xs text-slate-500 mt-1">{role.desk}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* I: Inquire Stage */}
            <div className="prompt-card" style={{ borderTop: '4px solid #06b6d4' }}>
              <label className="input-label"><BrainCircuit size={14} /> Step 2: Inquire (確定研究階段)</label>
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
            </div>

            {/* R: Reference Materials */}
            <div className="prompt-card" style={{ borderTop: '4px solid #10b981' }}>
              <label className="input-label"><Database size={14} /> Step 3: Reference (餵入素材)</label>
              <div className="space-y-4">
                {(selectedStage.id === 'topic' || selectedStage.id === 'lit_review') && (
                  <div className="input-group">
                    <label className="text-xs font-bold text-slate-400 mb-1 block">研究大主題</label>
                    <input name="topic" value={inputs.topic} onChange={handleInputChange} placeholder="例如：高中生社群成癮、校園節能..." className="input-field" />
                  </div>
                )}
                {(selectedStage.id === 'topic' || selectedStage.id === 'methodology') && (
                  <div className="input-group">
                    <label className="text-xs font-bold text-slate-400 mb-1 block">當前的研究問題</label>
                    <textarea name="question" value={inputs.question} onChange={handleInputChange} placeholder="例如：本校學生在段考前的睡眠品質..." className="input-field h-20" />
                  </div>
                )}
                {selectedStage.id === 'lit_review' && (
                  <div className="input-group">
                    <label className="text-xs font-bold text-slate-400 mb-1 block">關鍵字清單</label>
                    <input name="keywords" value={inputs.keywords} onChange={handleInputChange} placeholder="例如：FOMO, 睡眠不足, 學業表現..." className="input-field" />
                  </div>
                )}
                {selectedStage.id === 'methodology' && (
                  <div className="input-group">
                    <label className="text-xs font-bold text-slate-400 mb-1 block">擬採用的方法</label>
                    <input name="method" value={inputs.method} onChange={handleInputChange} placeholder="例如：半結構式訪談, 李克特五點量表問卷..." className="input-field" />
                  </div>
                )}
                {selectedStage.id === 'analysis' && (
                  <div className="input-group">
                    <label className="text-xs font-bold text-slate-400 mb-1 block">原始數據摘要</label>
                    <textarea name="data" value={inputs.data} onChange={handleInputChange} placeholder="貼上你的觀察紀錄、問卷初步統計或數據..." className="input-field h-32" />
                  </div>
                )}
              </div>
              
              <button 
                onClick={generatePrompt}
                className="w-full bg-slate-900 text-white font-black py-4 rounded-sm hover:bg-indigo-600 transition-all flex items-center justify-center gap-2 mt-4 shadow-lg"
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
                      onClick={() => {setGeneratedPrompt(''); setInputs({topic:'', question:'', keywords:'', method:'', data:''})}}
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
                  <p className="font-bold">在左側完成 A.I.R 三步驟<br />並點擊「產生協作 Prompt」</p>
                </div>
              ) : (
                <div className="flex-1 flex flex-col">
                  <div className="bg-slate-900 text-slate-300 p-6 rounded border border-slate-800 font-mono text-sm leading-relaxed whitespace-pre-wrap flex-1 shadow-inner overflow-auto max-h-[500px]">
                    {generatedPrompt}
                  </div>
                  
                  <div className="mt-6 flex flex-col md:flex-row gap-4">
                    <button 
                      onClick={copyToClipboard}
                      className={`flex-1 ${copied ? 'bg-emerald-600' : 'bg-indigo-600'} text-white font-black py-4 rounded-sm transition-all flex items-center justify-center gap-2 shadow-lg`}
                    >
                      {copied ? <CheckCircle2 size={20} /> : <Copy size={20} />}
                      {copied ? '已複製到剪貼簿！' : '複製 Prompt'}
                    </button>
                    {copied && (
                      <a 
                        href="https://chatgpt.com/" 
                        target="_blank" 
                        rel="noreferrer"
                        className="bg-slate-800 text-white font-black px-6 py-4 rounded-sm flex items-center justify-center transition-all hover:bg-slate-700 shadow-lg"
                      >
                        前往 ChatGPT
                      </a>
                    )}
                  </div>

                  <div className="mt-8 bg-amber-50 border border-amber-200 p-5 rounded-sm">
                    <div className="flex items-center gap-2 text-amber-700 font-black mb-2 uppercase text-xs tracking-widest">
                      <Info size={16} /> 之後的 E 與 D：
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="text-sm">
                        <span className="font-black text-amber-500 mr-1 italic">E (Evaluate):</span> 
                        <p className="text-slate-600 mt-1">檢查 AI 給你的建議。它是根據事實嗎？這在你的學校場域可行嗎？不要照單全收。</p>
                      </div>
                      <div className="text-sm">
                        <span className="font-black text-amber-500 mr-1 italic">D (Document):</span> 
                        <p className="text-slate-600 mt-1">記錄你採用了哪些建議、拒絕了哪些。這才是你研究成長的證明。</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
