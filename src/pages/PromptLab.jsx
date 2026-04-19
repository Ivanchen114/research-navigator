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
  { id: 'lit_review', name: '文獻回顧與整理', promptTemplate: '針對「[TOPIC]」這個主題，我已經蒐集了以下關鍵字：[KEYWORDS]。請幫我架構一個初步的文獻回顧地圖，並說明為了支持「[QUESTION]」，我該重點閱讀哪一類的文獻？' },
  { id: 'methodology', name: '研究方法與工具', promptTemplate: '我的研究題目是「[QUESTION]」，我打算使用「[METHOD]」法。請幫我模擬 5 位受訪者/受測者可能的回應，並指出我的工具設計中是否存在「誘導性提問」或「變因失控」的缺陷。' },
  { id: 'analysis', name: '數據分析與詮釋', promptTemplate: '我蒐集到了以下原始數據:[DATA]。請根據這些數據，提出 3 個可能的詮釋方向，並提醒我如何避免「倖存者偏差」或「過度推論」。' }
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
    goodWhy: 'Prompt 工程核心能力：迭代追問。指定要延伸哪一點 + 要求具體範例 + 限定情境（高中校園）。'
  }
];

const AI_PLATFORMS = [
  { name: 'ChatGPT', url: 'https://chatgpt.com/' },
  { name: 'Claude', url: 'https://claude.ai/' },
  { name: 'Gemini', url: 'https://gemini.google.com/' }
];

const CollapsibleWhy = ({ tip }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-3 border-t border-[var(--pl-border-light)] pt-3">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 text-[11px] font-bold text-[var(--pl-accent)] hover:text-[var(--pl-accent-deep)] transition-colors"
      >
        <Lightbulb size={13} />
        {tip.title}
        {open ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
      </button>
      {open && (
        <div className="mt-2 text-[12.5px] leading-[1.85] text-[var(--pl-ink-mid)] bg-[var(--pl-accent-light)] border-l-2 border-[var(--pl-accent)] pl-3 py-2.5 rounded-r">
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
    <div className="promptlab-root min-h-screen py-12 px-4 md:px-8">
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+TC:wght@400;600;700&family=Noto+Sans+TC:wght@300;400;500;700&family=DM+Mono:ital,wght@0,400;0,500;1,400&display=swap');

        .promptlab-root {
          --pl-ink: #1a1a2e;
          --pl-ink-mid: #4a4a6a;
          --pl-ink-light: #9090b0;
          --pl-paper: #f7f5f0;
          --pl-paper-warm: #edeae2;
          --pl-accent: #4f46e5;
          --pl-accent-deep: #3730a3;
          --pl-accent-light: #eef0ff;
          --pl-border: #d8d4ca;
          --pl-border-light: #e8e4dc;
          --pl-gold: #c9a84c;
          --pl-gold-pale: #faf5e4;

          font-family: 'Noto Sans TC', sans-serif;
          color: var(--pl-ink);
          background: var(--pl-paper);
          background-image: radial-gradient(circle, #c8c4ba 1px, transparent 1px);
          background-size: 28px 28px;
          background-attachment: fixed;
        }

        .promptlab-root .pl-serif { font-family: 'Noto Serif TC', serif; }
        .promptlab-root .pl-mono { font-family: 'DM Mono', monospace; }

        .pl-card {
          background: #fff;
          border: 1px solid var(--pl-border);
          border-radius: 8px;
          padding: 24px;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
        }

        .pl-card.accent { border-left: 3px solid var(--pl-accent); }

        .pl-input-label {
          display: flex; align-items: center; gap: 0.5rem;
          font-family: 'DM Mono', monospace;
          font-size: 11px; font-weight: 500;
          color: var(--pl-ink-mid);
          letter-spacing: 0.12em;
          text-transform: uppercase;
          margin-bottom: 12px;
        }
        .pl-step-num {
          font-family: 'DM Mono', monospace;
          color: var(--pl-accent);
          font-weight: 700;
        }
        .pl-input-field {
          width: 100%;
          background: var(--pl-paper-warm);
          border: 1px solid var(--pl-border-light);
          border-radius: 6px;
          padding: 0.625rem 0.875rem;
          color: var(--pl-ink);
          font-family: 'Noto Sans TC', sans-serif;
          transition: all 0.2s;
        }
        .pl-input-field:focus {
          outline: none;
          border-color: var(--pl-accent);
          background: #fff;
          box-shadow: 0 0 0 3px var(--pl-accent-light);
        }

        .pl-option-btn {
          text-align: left; padding: 14px 16px;
          border-radius: 6px; border: 1px solid var(--pl-border-light);
          background: #fff; transition: all 0.15s;
          width: 100%;
        }
        .pl-option-btn:hover {
          border-color: var(--pl-accent);
          background: #fafbff;
        }
        .pl-option-btn.selected {
          background: var(--pl-accent-light);
          border-color: var(--pl-accent);
          box-shadow: 0 0 0 1px var(--pl-accent);
        }

        .pl-kicker {
          font-family: 'DM Mono', monospace;
          font-size: 10px; letter-spacing: 0.18em;
          color: var(--pl-ink-light);
          text-transform: uppercase;
          display: flex; align-items: center; gap: 10px;
        }
        .pl-kicker::before {
          content: ''; display: inline-block;
          width: 20px; height: 1px;
          background: var(--pl-border);
        }

        .pl-prompt-output {
          background: var(--pl-ink);
          color: #d4d4dc;
          padding: 24px;
          border-radius: 8px;
          font-family: 'DM Mono', monospace;
          font-size: 13px;
          line-height: 1.85;
          white-space: pre-wrap;
          overflow: auto;
          max-height: 500px;
        }
      `}} />

      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-12 border-b border-[var(--pl-border)] pb-10">
          <div className="pl-kicker mb-5">
            AI-RED Framework V2.0 · Prompt Workbench
          </div>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
            <h1 className="pl-serif text-[32px] md:text-[40px] font-bold leading-[1.15] text-[var(--pl-ink)] tracking-tight">
              AI 協作實驗室<br />
              <span className="text-[var(--pl-accent)]">Prompt Lab</span>
            </h1>
            <span className="self-start md:self-end inline-flex items-center gap-1.5 bg-[var(--pl-gold-pale)] text-[var(--pl-gold)] border border-[var(--pl-gold)]/30 px-3 py-1.5 rounded text-[11px] font-bold tracking-wider">
              <GraduationCap size={13} /> 自學模式
            </span>
          </div>
          <p className="text-[14px] text-[var(--pl-ink-mid)] leading-[1.95] max-w-3xl">
            依 <strong className="text-[var(--pl-ink)]">角色 → 階段 → 素材</strong> 三步驟，幫你組出對 AI 提問的高品質 prompt。
            每個步驟旁邊點開「💡 為什麼這樣寫」，你會看到背後的 prompt 工程原理。
            下方還有「Prompt 對照診所」可以自學——沒有老師在旁邊也看得懂。
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Config Section */}
          <div className="lg:col-span-5 space-y-6">

            {/* Step 1: Role */}
            <div className="pl-card accent">
              <label className="pl-input-label">
                <UserCircle2 size={13} />
                <span className="pl-step-num">Step 01</span>
                <span>·</span>
                <span>設定 AI 角色</span>
              </label>
              <div className="grid grid-cols-1 gap-2.5">
                {AI_ROLES.map(role => (
                  <button
                    key={role.id}
                    onClick={() => setSelectedRole(role)}
                    className={`pl-option-btn ${selectedRole.id === role.id ? 'selected' : ''}`}
                  >
                    <div className="font-bold text-[14px] text-[var(--pl-ink)] flex items-center justify-between">
                      {role.name}
                      {selectedRole.id === role.id && <CheckCircle2 size={16} className="text-[var(--pl-accent)]" />}
                    </div>
                    <div className="text-[12px] text-[var(--pl-ink-mid)] mt-1 leading-relaxed">{role.desc}</div>
                  </button>
                ))}
              </div>
              <CollapsibleWhy tip={WHY_TIPS.role} />
            </div>

            {/* Step 2: Stage */}
            <div className="pl-card accent">
              <label className="pl-input-label">
                <BrainCircuit size={13} />
                <span className="pl-step-num">Step 02</span>
                <span>·</span>
                <span>選研究階段</span>
              </label>
              <div className="space-y-2.5">
                {RESEARCH_STAGES.map(stage => (
                  <button
                    key={stage.id}
                    onClick={() => setSelectedStage(stage)}
                    className={`pl-option-btn flex items-center justify-between ${selectedStage.id === stage.id ? 'selected' : ''}`}
                  >
                    <span className={`font-bold text-[14px] ${selectedStage.id === stage.id ? 'text-[var(--pl-accent-deep)]' : 'text-[var(--pl-ink)]'}`}>{stage.name}</span>
                    <ChevronRight size={16} className={selectedStage.id === stage.id ? 'text-[var(--pl-accent)]' : 'text-[var(--pl-ink-light)]'} />
                  </button>
                ))}
              </div>
              <CollapsibleWhy tip={WHY_TIPS.stage} />
            </div>

            {/* Step 3: Materials */}
            <div className="pl-card accent">
              <label className="pl-input-label">
                <Database size={13} />
                <span className="pl-step-num">Step 03</span>
                <span>·</span>
                <span>填入研究素材</span>
              </label>
              <div className="space-y-4">
                {(selectedStage.id === 'topic' || selectedStage.id === 'lit_review') && (
                  <div>
                    <label className="text-[11px] font-bold text-[var(--pl-ink-mid)] mb-1.5 block tracking-wider uppercase pl-mono">研究大主題 *</label>
                    <input name="topic" value={inputs.topic} onChange={handleInputChange} placeholder="例如：高中生社群成癮、校園節能..." className="pl-input-field" />
                  </div>
                )}
                {(selectedStage.id === 'topic' || selectedStage.id === 'methodology' || selectedStage.id === 'lit_review') && (
                  <div>
                    <label className="text-[11px] font-bold text-[var(--pl-ink-mid)] mb-1.5 block tracking-wider uppercase pl-mono">當前的研究問題 *</label>
                    <textarea name="question" value={inputs.question} onChange={handleInputChange} placeholder="例如：本校學生在段考前的睡眠品質..." className="pl-input-field h-20" />
                  </div>
                )}
                {selectedStage.id === 'lit_review' && (
                  <div>
                    <label className="text-[11px] font-bold text-[var(--pl-ink-mid)] mb-1.5 block tracking-wider uppercase pl-mono">關鍵字清單 *</label>
                    <input name="keywords" value={inputs.keywords} onChange={handleInputChange} placeholder="例如：FOMO、睡眠不足、學業表現..." className="pl-input-field" />
                  </div>
                )}
                {selectedStage.id === 'methodology' && (
                  <div>
                    <label className="text-[11px] font-bold text-[var(--pl-ink-mid)] mb-1.5 block tracking-wider uppercase pl-mono">擬採用的方法 *</label>
                    <input name="method" value={inputs.method} onChange={handleInputChange} placeholder="例如：半結構式訪談、李克特五點量表問卷..." className="pl-input-field" />
                  </div>
                )}
                {selectedStage.id === 'analysis' && (
                  <div>
                    <label className="text-[11px] font-bold text-[var(--pl-ink-mid)] mb-1.5 block tracking-wider uppercase pl-mono">原始數據摘要 *</label>
                    <textarea name="data" value={inputs.data} onChange={handleInputChange} placeholder="貼上你的觀察紀錄、問卷初步統計或數據..." className="pl-input-field h-32" />
                  </div>
                )}
              </div>

              <CollapsibleWhy tip={WHY_TIPS.material} />

              {!isReady && (
                <div className="mt-4 text-[12px] text-amber-800 bg-amber-50 border border-amber-200 rounded-md px-3 py-2.5 flex items-start gap-2">
                  <Info size={14} className="shrink-0 mt-0.5" />
                  <span>請先填寫：{missingFields.map(f => fieldLabels[f]).join('、')}</span>
                </div>
              )}

              <button
                onClick={generatePrompt}
                disabled={!isReady}
                className={`w-full font-bold text-[14px] py-3.5 rounded-md transition-all flex items-center justify-center gap-2 mt-4 ${
                  isReady
                    ? 'bg-[var(--pl-ink)] text-white hover:bg-[var(--pl-accent-deep)] shadow-md'
                    : 'bg-[var(--pl-paper-warm)] text-[var(--pl-ink-light)] cursor-not-allowed border border-[var(--pl-border-light)]'
                }`}
              >
                <Sparkles size={16} /> 產生協作 Prompt
              </button>
            </div>
          </div>

          {/* Output Section */}
          <div className="lg:col-span-7 space-y-6">
            <div className="pl-card h-full flex flex-col min-h-[600px]" style={{ background: '#fdfcfa' }}>
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2.5">
                  <div className="bg-[var(--pl-accent-light)] p-2 rounded-md text-[var(--pl-accent)]">
                    <Eye size={18} />
                  </div>
                  <h3 className="pl-serif font-bold text-[17px] text-[var(--pl-ink)]">預覽協作內容</h3>
                </div>
                {generatedPrompt && (
                  <button
                    onClick={resetAll}
                    className="p-2 text-[var(--pl-ink-light)] hover:text-rose-500 transition-colors"
                    title="重置"
                  >
                    <RotateCcw size={18} />
                  </button>
                )}
              </div>

              {!generatedPrompt ? (
                <div className="flex-1 flex flex-col items-center justify-center text-[var(--pl-ink-light)] space-y-4 py-20 px-10 text-center border-2 border-dashed border-[var(--pl-border-light)] rounded-md">
                  <div className="bg-[var(--pl-paper-warm)] p-6 rounded-full">
                    <FileEdit size={42} className="opacity-30" />
                  </div>
                  <p className="font-bold text-[13px] leading-relaxed">依序完成左方（或下方）三步驟<br />並點擊「產生協作 Prompt」</p>
                </div>
              ) : (
                <div className="flex-1 flex flex-col">
                  <div className="pl-prompt-output flex-1">
                    {generatedPrompt}
                  </div>

                  <div className="mt-6 space-y-3">
                    <button
                      onClick={copyToClipboard}
                      className={`w-full font-bold text-[14px] py-3.5 rounded-md transition-all flex items-center justify-center gap-2 shadow-md ${
                        copied
                          ? 'bg-emerald-600 text-white'
                          : 'bg-[var(--pl-accent)] text-white hover:bg-[var(--pl-accent-deep)]'
                      }`}
                    >
                      {copied ? <CheckCircle2 size={18} /> : <Copy size={18} />}
                      {copied ? '已複製到剪貼簿！' : '複製 Prompt'}
                    </button>

                    {copied && (
                      <div>
                        <div className="pl-mono text-[10px] font-bold text-[var(--pl-ink-light)] uppercase tracking-widest mb-2.5">貼到你常用的 AI</div>
                        <div className="grid grid-cols-3 gap-2">
                          {AI_PLATFORMS.map(p => (
                            <a
                              key={p.name}
                              href={p.url}
                              target="_blank"
                              rel="noreferrer"
                              className="bg-white border border-[var(--pl-border)] hover:border-[var(--pl-accent)] hover:bg-[var(--pl-accent-light)] text-[var(--pl-ink)] font-bold px-3 py-2.5 rounded-md flex items-center justify-center gap-1.5 text-[13px] transition-all"
                            >
                              {p.name}
                              <ExternalLink size={11} className="text-[var(--pl-ink-light)]" />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-8 bg-[var(--pl-gold-pale)] border border-[var(--pl-gold)]/30 p-5 rounded-md">
                    <div className="pl-mono flex items-center gap-2 text-[var(--pl-gold)] font-bold mb-3 uppercase text-[11px] tracking-widest">
                      <Info size={14} /> 拿到 AI 回答之後，別忘了 E 與 D
                    </div>
                    <div className="space-y-3">
                      <div className="text-[13px]">
                        <span className="font-bold text-[var(--pl-ink)]">E (Evaluate) 評估：</span>
                        <p className="text-[var(--pl-ink-mid)] mt-1 leading-[1.85]">
                          AI 的回答<strong className="text-[var(--pl-ink)]">不是標準答案</strong>。把它貼回你所在週次的「AI-RED 敘事紀錄」欄，寫下你採納了什麼、不採納什麼、為什麼。
                        </p>
                      </div>
                      <div className="text-[13px]">
                        <span className="font-bold text-[var(--pl-ink)]">D (Document) 紀錄：</span>
                        <p className="text-[var(--pl-ink-mid)] mt-1 leading-[1.85]">
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
        <div className="mt-16 pt-10 border-t-2 border-[var(--pl-border)]">
          <div className="pl-kicker mb-4">
            Section 02 · 自學區
          </div>
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-[var(--pl-accent-light)] p-2.5 rounded-md text-[var(--pl-accent)]">
              <Sparkles size={18} />
            </div>
            <h2 className="pl-serif text-[24px] md:text-[28px] font-bold text-[var(--pl-ink)] tracking-tight">
              Prompt 對照診所
            </h2>
          </div>
          <p className="text-[14px] text-[var(--pl-ink-mid)] mb-8 max-w-3xl leading-[1.95]">
            上面的工具幫你產 prompt，但如果離開這頁、你能自己寫嗎？
            下面三組對照可以幫你看懂「為什麼結構化的 prompt 比隨口一問強」——等你能一眼認出爛 prompt，就不再需要模板了。
          </p>

          <div className="space-y-5">
            {PROMPT_COMPARISONS.map((c, i) => (
              <div key={i} className="pl-card">
                <div className="pl-mono text-[10px] font-bold text-[var(--pl-ink-light)] uppercase tracking-widest mb-3">
                  對照 {String(i + 1).padStart(2, '0')} · {c.scenario}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
                  {/* Bad */}
                  <div className="border-l-3 border-l-rose-300 bg-rose-50/40 p-4 rounded-r-md flex flex-col">
                    <div className="flex items-center gap-1.5 text-rose-700 font-bold text-[11px] uppercase tracking-wider mb-2 pl-mono">
                      <XCircle size={13} /> 爛 Prompt
                    </div>
                    <div className="text-[13px] text-[var(--pl-ink)] bg-white p-3 rounded border border-rose-100 pl-mono leading-[1.8] mb-3 flex-1">
                      {c.bad}
                    </div>
                    <div className="text-[12px] text-[var(--pl-ink-mid)] leading-[1.85]">
                      <strong className="text-rose-700">問題：</strong>{c.badWhy}
                    </div>
                  </div>

                  {/* Good */}
                  <div className="border-l-3 border-l-emerald-400 bg-emerald-50/40 p-4 rounded-r-md flex flex-col">
                    <div className="flex items-center gap-1.5 text-emerald-700 font-bold text-[11px] uppercase tracking-wider mb-2 pl-mono">
                      <CheckCircle2 size={13} /> 好 Prompt
                    </div>
                    <div className="text-[13px] text-[var(--pl-ink)] bg-white p-3 rounded border border-emerald-100 pl-mono leading-[1.8] mb-3 flex-1">
                      {c.good}
                    </div>
                    <div className="text-[12px] text-[var(--pl-ink-mid)] leading-[1.85]">
                      <strong className="text-emerald-700">為什麼好：</strong>{c.goodWhy}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 自學小結 */}
          <div className="mt-8 bg-[var(--pl-ink)] text-slate-100 p-7 rounded-md">
            <div className="pl-mono flex items-center gap-2 text-[var(--pl-gold)] font-bold text-[11px] uppercase tracking-widest mb-4">
              <GraduationCap size={14} /> 自學小結 · 好 Prompt 的五要素
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {[
                { num: '01', label: '角色', desc: '你是誰？什麼專業？' },
                { num: '02', label: '任務', desc: '要做什麼？動詞要明確。' },
                { num: '03', label: '脈絡', desc: '背景、題目、現況資料。' },
                { num: '04', label: '格式', desc: '要表格？編號？幾段？' },
                { num: '05', label: '限制', desc: '不要什麼？字數上限？' }
              ].map(item => (
                <div key={item.num} className="bg-white/5 border border-white/10 p-3.5 rounded-md">
                  <div className="pl-mono font-bold text-[var(--pl-gold)] text-[11px] mb-1.5">{item.num}</div>
                  <div className="font-bold text-white text-[14px] mb-1">{item.label}</div>
                  <div className="text-slate-400 text-[11.5px] leading-relaxed">{item.desc}</div>
                </div>
              ))}
            </div>
            <p className="text-[12.5px] text-slate-400 mt-5 leading-[1.9]">
              下次寫 prompt 前，先在腦中快速過一次這五格——缺一格就補一格。
              習慣之後你會發現，「<strong className="text-white">問得好</strong>」比「<strong className="text-white">換更好的 AI</strong>」有用得多。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
