import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, CheckCircle2, AlertTriangle, ArrowRight, ClipboardList, Mic, TestTube2, Camera, FileSearch, Rocket, Bot, Lock } from 'lucide-react';

const ethicsQuestions = [
    {
        id: 1,
        icon: '🤝',
        title: '知情同意',
        desc: '受訪者知道這是什麼研究嗎？你打算怎麼告知他們？',
        placeholder: '例如：研究開始前，我會口頭說明或提供書面說明...',
        risk: '若無知情同意，屬於對受訪者的欺騙，可能引發信任危機。'
    },
    {
        id: 2,
        icon: '🔒',
        title: '保密性',
        desc: '你的工具有沒有收集可以辨識個人身份的資料？',
        placeholder: '例如：本研究不收集姓名或學號，問卷完全匿名...',
        risk: '洩漏個資可能對受訪者造成傷害，也違反研究倫理。'
    },
    {
        id: 3,
        icon: '🛡️',
        title: '不傷害',
        desc: '你的題目有沒有涉及敏感領域（情緒、家庭、身體健康等）？',
        placeholder: '例如：若受訪者表現不適，我會立刻停止訪談並提供支持...',
        risk: '敏感問題可能引起受訪者心理不適，需提前設計逃生出口。'
    },
    {
        id: 4,
        icon: '✋',
        title: '自願性',
        desc: '你打算怎麼招募受訪者？有沒有隱性壓力的可能？',
        placeholder: '例如：我會強調受訪是自願的，不參加不會有任何影響...',
        risk: '若受訪者感到「被迫」參加，自願性就不存在。'
    },
    {
        id: 5,
        icon: '💾',
        title: '資料保護',
        desc: '資料如何儲存？誰可以接觸？何時刪除？',
        placeholder: '例如：資料存在私人 Google Drive，只有我可以看，報告繳交後刪除...',
        risk: '無明確保護計畫會讓資料面臨外洩或被濫用的風險。'
    }
];

const methodChecklist = {
    questionnaire: {
        icon: <ClipboardList size={18} />, name: '問卷法', color: '#2d5be3',
        items: ['Google 表單建立完成', '超過 15 題以上', '每題都對應研究問題', '已刪除誘導性敘述', '加上知情同意開場白', '預試修正完畢']
    },
    interview: {
        icon: <Mic size={18} />, name: '訪談法', color: '#c9a84c',
        items: ['訪談大綱完成（5-10 題）', '開放式問題為主', '已排除連環轟炸式提問', '準備錄音同意確認', '知情同意書備妥', '預試修正完畢']
    },
    experiment: {
        icon: <TestTube2 size={18} />, name: '實驗法', color: '#1a1a2e',
        items: ['實驗流程說明書完成', '已識別所有干擾變因', '設計了對照組', '測量方式已客觀化', '倫理用於人體安全無虞', '預試修正完畢']
    },
    observation: {
        icon: <Camera size={18} />, name: '觀察法', color: '#2e7d5a',
        items: ['觀察記錄表格完成', '指標定義明確（可量化）', '取得觀察場地許可', '確認觀察者效應的應對', '隱私保護機制備妥', '預試修正完畢']
    },
    literature: {
        icon: <FileSearch size={18} />, name: '文獻法', color: '#1a1a2e',
        items: ['核心文獻清單 5 篇以上', '文獻來源可信（非 C 級）', '已查看文獻年份（近 10 年優先）', '建立摘要比較表', '非剽竊，有引用格式', '可支持研究問題']
    }
};

export const W10Page = () => {
    const [ethicsAnswers, setEthicsAnswers] = useState({});
    const [checkedItems, setCheckedItems] = useState({});
    const [selectedMethod, setSelectedMethod] = useState('questionnaire');
    const [stampGranted, setStampGranted] = useState(false);

    const updateEthics = (id, value) => setEthicsAnswers(prev => ({ ...prev, [id]: value }));
    const toggleCheck = (method, idx) => {
        const key = `${method}-${idx}`;
        setCheckedItems(prev => ({ ...prev, [key]: !prev[key] }));
    };
    const isChecked = (method, idx) => !!checkedItems[`${method}-${idx}`];

    const currentMethod = methodChecklist[selectedMethod];
    const allChecked = currentMethod.items.every((_, idx) => isChecked(selectedMethod, idx));
    const ethicsComplete = ethicsQuestions.every(q => ethicsAnswers[q.id]?.trim());

    return (
        <div className="max-w-5xl mx-auto px-6 lg:px-12 py-8 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 font-['Noto_Sans_TC',sans-serif] text-[14px] leading-[1.6] text-[#1a1a2e] pb-16">

            {/* Header */}
            <header className="mb-14 pt-8 text-center max-w-[650px] mx-auto">
                <div className="text-[11px] font-['DM_Mono',monospace] tracking-[0.12em] uppercase text-[#2e7d5a] mb-3 flex items-center justify-center gap-2">
                    <ShieldCheck size={14} /> W10 核心模組
                </div>
                <h1 className="font-['Noto_Serif_TC',serif] text-[38px] font-bold leading-[1.25] text-[#1a1a2e] mb-4 tracking-[-0.02em]">
                    定案、審查、<br className="hidden md:block" />
                    <span className="text-[#2e7d5a] font-normal italic">準備出發！</span>
                </h1>
                <p className="text-[15px] text-[#4a4a6a] leading-[1.75]">
                    工具定稿 × 倫理審查 × 施測啟動。沒通過審查，不准出發。這是這門課最重要的一道安全關卡。
                </p>
            </header>

            {/* Part 1: 工具定稿 */}
            <section className="mb-14">
                <div className="flex items-baseline gap-3 mb-8">
                    <h2 className="font-['Noto_Serif_TC',serif] text-[20px] font-bold text-[#1a1a2e]">
                        Part 1｜工具定稿自查清單
                    </h2>
                    <span className="text-[11px] text-[#8888aa] font-['DM_Mono',monospace] uppercase tracking-wider">01 / Pre-flight Checklist</span>
                </div>

                <div className="bg-[#f8f7f4] border border-[#dddbd5] rounded-[10px] p-8 space-y-8">
                    {/* Method selector */}
                    <div className="flex flex-wrap gap-2">
                        {Object.entries(methodChecklist).map(([key, m]) => (
                            <button
                                key={key}
                                onClick={() => setSelectedMethod(key)}
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-[4px] border font-bold text-[12px] transition-all uppercase tracking-wider font-['DM_Mono',monospace] ${selectedMethod === key
                                    ? 'bg-[#1a1a2e] text-white border-[#1a1a2e] shadow-lg'
                                    : 'bg-white text-[#8888aa] border-[#dddbd5] hover:border-[#1a1a2e]'}`}
                            >
                                {m.icon} {m.name}
                            </button>
                        ))}
                    </div>

                    {/* Checklist */}
                    <div className="space-y-3">
                        {currentMethod.items.map((item, idx) => (
                            <button
                                key={idx}
                                onClick={() => toggleCheck(selectedMethod, idx)}
                                className={`w-full flex items-center gap-4 p-4 rounded-[6px] border transition-all text-left bg-white group ${isChecked(selectedMethod, idx)
                                    ? 'border-[#2e7d5a] bg-[#f0f9f4]/50'
                                    : 'border-[#dddbd5] hover:border-[#1a1a2e]'}`}
                            >
                                <div className={`w-5 h-5 rounded-[4px] border flex items-center justify-center transition-colors ${isChecked(selectedMethod, idx) ? 'bg-[#2e7d5a] border-[#2e7d5a]' : 'border-[#dddbd5] group-hover:border-[#1a1a2e]'}`}>
                                    {isChecked(selectedMethod, idx) && <CheckCircle2 size={14} className="text-white" />}
                                </div>
                                <span className={`text-[14px] font-medium ${isChecked(selectedMethod, idx) ? 'text-[#2e7d5a] line-through opacity-60' : 'text-[#1a1a2e]'}`}>{item}</span>
                            </button>
                        ))}
                    </div>

                    {allChecked && (
                        <div className="p-4 bg-[#2e7d5a] text-white rounded-[4px] text-center font-bold text-[13px] animate-in zoom-in-95 duration-300">
                            ✓ 工具定稿確認完成！可以進入倫理審查。
                        </div>
                    )}
                </div>
            </section>

            {/* Part 2: 倫理五問 */}
            <section className="mb-14">
                <div className="flex items-baseline gap-3 mb-8">
                    <h2 className="font-['Noto_Serif_TC',serif] text-[20px] font-bold text-[#1a1a2e]">
                        Part 2｜研究倫理五問
                    </h2>
                    <span className="text-[11px] text-[#8888aa] font-['DM_Mono',monospace] uppercase tracking-wider">02 / Ethics Statement</span>
                </div>

                <div className="space-y-6">
                    {ethicsQuestions.map(q => (
                        <div key={q.id} className="bg-white rounded-[10px] border border-[#dddbd5] p-8 space-y-6 hover:border-[#2e7d5a] transition-colors group">
                            <div className="flex items-start gap-4">
                                <span className="text-3xl grayscale group-hover:grayscale-0 transition-all">{q.icon}</span>
                                <div className="space-y-1">
                                    <h3 className="font-bold text-[16px] text-[#1a1a2e] font-['Noto_Serif_TC',serif] tracking-wide">{q.title}</h3>
                                    <p className="text-[13px] text-[#4a4a6a] leading-relaxed">{q.desc}</p>
                                </div>
                            </div>
                            <div className="relative">
                                <textarea
                                    rows={3}
                                    className="w-full text-[14px] border border-[#dddbd5] rounded-[6px] p-5 bg-[#f8f7f4] focus:outline-none focus:border-[#2e7d5a] focus:bg-white transition-all font-['Noto_Sans_TC',sans-serif] leading-relaxed"
                                    placeholder={q.placeholder}
                                    value={ethicsAnswers[q.id] || ''}
                                    onChange={e => updateEthics(q.id, e.target.value)}
                                />
                                <div className="mt-4 flex items-start gap-2 text-[11px] text-[#c9a84c] border border-[rgba(201,168,76,0.2)] bg-[rgba(201,168,76,0.05)] rounded-[4px] p-3 leading-snug">
                                    <AlertTriangle size={14} className="shrink-0" />
                                    <span>臨床風險：{q.risk}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Part 3: AI 知情同意書審查 */}
            <section className="mb-14">
                <div className="bg-[#1a1a2e] text-white rounded-[10px] p-10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-10 opacity-[0.03]">
                        <Bot size={180} />
                    </div>
                    <div className="relative z-10 space-y-8">
                        <div className="flex items-baseline gap-3">
                            <h2 className="font-['Noto_Serif_TC',serif] text-[20px] font-bold text-white">
                                Part 3｜AI 輔助知情同意書審查
                            </h2>
                            <span className="text-[11px] text-white/30 font-['DM_Mono',monospace] uppercase tracking-wider">03 / AI Audit</span>
                        </div>

                        <p className="text-white/60 text-[14px] leading-relaxed max-w-[600px]">
                            把你寫好的「知情同意說明」貼給 AI，請他從 16-18 歲高中生的角度閱讀，確認是否足夠友善、易懂且無壓力。
                        </p>

                        <div className="bg-black/40 rounded-[8px] border border-white/10 p-6 space-y-6 font-['DM_Mono',monospace]">
                            <div className="flex items-center justify-between border-b border-white/5 pb-4">
                                <div className="text-[10px] font-bold text-[#2e7d5a] uppercase tracking-widest">// Evaluation Prompt</div>
                                <button
                                    onClick={() => navigator.clipboard.writeText(`我寫了一段問卷的知情同意說明...`)}
                                    className="text-[10px] text-white/30 hover:text-white transition-colors"
                                >
                                    COPY CODE
                                </button>
                            </div>
                            <div className="text-[13px] leading-relaxed text-white/80">
                                <span className="text-[#2e7d5a]">SYSTEM:</span> 我寫了一段問卷的知情同意說明，請幫我：<br />
                                <span className="text-[#c9a84c]">1.</span> 從「16-18歲高中生」角度閱讀<br />
                                <span className="text-[#c9a84c]">2.</span> 找出難懂或易誤解的詞彙<br />
                                <span className="text-[#c9a84c]">3.</span> 找出任何可能感到壓力的語氣<br />
                                <span className="text-[#c9a84c]">4.</span> 改寫成更清楚、更友善的版本<br /><br />
                                <span className="text-white/40">【貼上你的知情同意說明內容】</span>
                            </div>
                        </div>

                        <div className="flex gap-10">
                            {[
                                { step: '1', text: '複製並貼上 Prompt' },
                                { step: '2', text: '根據建議進行微調' },
                                { step: '3', text: '尋求老師最終審核' },
                            ].map(item => (
                                <div key={item.step} className="flex-1 space-y-1">
                                    <div className="text-[10px] font-bold text-white/20 uppercase tracking-widest">{item.step}</div>
                                    <div className="text-[11px] text-white/60 font-medium">{item.text}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Part 4: 倫理審查通過證明 */}
            <section className="mb-14">
                <div className={`rounded-[10px] border-2 p-12 text-center transition-all duration-500 ${ethicsComplete && allChecked
                    ? 'bg-white border-[#2e7d5a] shadow-2xl scale-100'
                    : 'bg-[#f8f7f4] border-[#dddbd5] border-dashed opacity-50 grayscale scale-[0.98]'}`}>

                    <div className="relative mb-6 inline-block">
                        <div className="text-6xl">🏷️</div>
                        {ethicsComplete && allChecked && (
                            <div className="absolute -top-4 -right-4 bg-[#2e7d5a] text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg animate-bounce">
                                PASSED
                            </div>
                        )}
                    </div>

                    <h3 className={`text-[20px] font-bold mb-4 font-['Noto_Serif_TC',serif] ${ethicsComplete && allChecked ? 'text-[#1a1a2e]' : 'text-[#8888aa]'}`}>
                        研究倫理審查通過證明
                    </h3>

                    {ethicsComplete && allChecked ? (
                        <div className="space-y-8 animate-in fade-in duration-700">
                            <p className="text-[14px] text-[#4a4a6a] max-w-[400px] mx-auto leading-relaxed">
                                工具自查 (Level 2) 確認 ✅<br />
                                倫理五問 (Audit Complete) 確認 ✅<br />
                                <strong>你已具備考古（實地調查）的出發資格！</strong>
                            </p>

                            <div className="space-y-4">
                                <button
                                    onClick={() => setStampGranted(true)}
                                    className={`inline-flex items-center gap-3 px-10 py-4 rounded-[6px] font-bold transition-all text-[15px] shadow-xl border-2
                                        ${stampGranted ? 'bg-[#2e7d5a] text-white border-[#2e7d5a] cursor-default' : 'bg-white text-[#2e7d5a] border-[#2e7d5a] hover:bg-[#2e7d5a] hover:text-white'}`}
                                >
                                    {stampGranted ? '✅ 審查章已蓋印：准予出發' : '🖊️ 申請最終審核 (請老師蓋章)'}
                                </button>

                                {stampGranted && (
                                    <div className="pt-6 animate-in slide-in-from-top-4 duration-500">
                                        <div className="text-[12px] font-bold text-[#2e7d5a] tracking-widest font-['DM_Mono',monospace] mb-4 uppercase">Departure Clearance Granted // 🛫</div>
                                        <Link to="/w11" className="inline-flex items-center gap-2 bg-[#1a1a2e] text-white px-8 py-3 rounded-[6px] text-[14px] font-bold hover:bg-[#2a2a4a] transition-all group">
                                            啟動執行與分析模組 (W11-W14) <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <p className="text-[12px] text-[#8888aa] max-w-[300px] mx-auto leading-relaxed">
                            請先完成 Part 1 與 Part 2 的所有必要項目，<br />系統將自動核發審查解鎖碼。
                        </p>
                    )}
                </div>
            </section>

            {/* Navigation */}
            <div className="flex justify-start py-8">
                <Link to="/tool-design" className="text-[13px] font-bold text-[#8888aa] hover:text-[#1a1a2e] flex items-center gap-2 transition-colors">
                    ← 回 W8-W9 工具設計
                </Link>
            </div>

        </div>
    );
};
