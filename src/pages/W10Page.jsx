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
        risk: '若受訪者（如同班同學）感到「被迫」參加，自願性就不存在。'
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
        icon: <ClipboardList size={20} />, name: '問卷法', color: 'blue',
        items: ['Google 表單建立完成', '超過 15 題以上', '每題都對應研究問題', '已刪除誘導性敘述', '加上知情同意開場白', '預試修正完畢']
    },
    interview: {
        icon: <Mic size={20} />, name: '訪談法', color: 'orange',
        items: ['訪談大綱完成（5-10 題）', '開放式問題為主', '已排除連環轟炸式提問', '準備錄音同意確認', '知情同意書備妥', '預試修正完畢']
    },
    experiment: {
        icon: <TestTube2 size={20} />, name: '實驗法', color: 'purple',
        items: ['實驗流程說明書完成', '已識別所有干擾變因', '設計了對照組', '測量方式已客觀化', '倫理用於人體安全無虞', '預試修正完畢']
    },
    observation: {
        icon: <Camera size={20} />, name: '觀察法', color: 'teal',
        items: ['觀察記錄表格完成', '指標定義明確（可量化）', '取得觀察場地許可', '確認觀察者效應的應對', '隱私保護機制備妥', '預試修正完畢']
    },
    literature: {
        icon: <FileSearch size={20} />, name: '文獻法', color: 'emerald',
        items: ['核心文獻清單 5 篇以上', '文獻來源可信（非 C 級）', '已查看文獻年份（近 10 年優先）', '建立摘要比較表', '非剽竊，有引用格式', '可支持研究問題']
    }
};

const colorMap = {
    blue: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', check: 'text-blue-500', badge: 'bg-blue-100 text-blue-700' },
    orange: { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700', check: 'text-orange-500', badge: 'bg-orange-100 text-orange-700' },
    purple: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700', check: 'text-purple-500', badge: 'bg-purple-100 text-purple-700' },
    teal: { bg: 'bg-teal-50', border: 'border-teal-200', text: 'text-teal-700', check: 'text-teal-500', badge: 'bg-teal-100 text-teal-700' },
    emerald: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', check: 'text-emerald-500', badge: 'bg-emerald-100 text-emerald-700' }
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
    const colors = colorMap[currentMethod.color];
    const allChecked = currentMethod.items.every((_, idx) => isChecked(selectedMethod, idx));
    const ethicsComplete = ethicsQuestions.every(q => ethicsAnswers[q.id]?.trim());

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">

            {/* Header */}
            <header className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden text-center">
                <div className="absolute top-0 right-0 w-64 h-64 bg-green-100 rounded-full blur-3xl opacity-40 -translate-y-1/2 translate-x-1/3" />
                <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 text-green-700 border border-green-100 shadow-sm mb-4">
                        <ShieldCheck size={16} /> W10 核心模組
                    </div>
                    <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-4 flex items-center justify-center gap-3">
                        🛡️ 定案、審查、<span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-teal-600 drop-shadow-sm">出發！</span>
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
                        工具定稿 × 倫理審查 × 施測啟動<br />
                        <span className="text-sm">沒通過審查，不准出發。這是這門課最重要的一道關卡。</span>
                    </p>
                </div>
            </header>

            {/* Part 1: 工具定稿核對 */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 md:p-8">
                <h2 className="text-2xl font-bold text-slate-800 mb-2 flex items-center gap-3">
                    <ClipboardList className="text-slate-500" size={26} />
                    Part 1｜工具定稿自查清單
                </h2>
                <p className="text-slate-500 text-sm mb-6">選擇你的研究方法，確認每個項目都打勾後，才算「定稿完成」。</p>

                {/* Method selector */}
                <div className="flex flex-wrap gap-2 mb-6">
                    {Object.entries(methodChecklist).map(([key, m]) => (
                        <button
                            key={key}
                            onClick={() => setSelectedMethod(key)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full border font-semibold text-sm transition-all ${selectedMethod === key
                                ? `${colorMap[m.color].badge} border-current shadow-md scale-105`
                                : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'}`}
                        >
                            {m.icon} {m.name}
                        </button>
                    ))}
                </div>

                {/* Checklist */}
                <div className={`rounded-2xl border p-5 ${colors.bg} ${colors.border}`}>
                    <h3 className={`font-bold text-lg mb-4 ${colors.text}`}>{currentMethod.name} — 出發前確認</h3>
                    <div className="space-y-3">
                        {currentMethod.items.map((item, idx) => (
                            <button
                                key={idx}
                                onClick={() => toggleCheck(selectedMethod, idx)}
                                className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${isChecked(selectedMethod, idx)
                                    ? `bg-white ${colors.border} shadow-sm`
                                    : 'bg-white/60 border-transparent hover:border-slate-200'}`}
                            >
                                <CheckCircle2 size={22} className={isChecked(selectedMethod, idx) ? colors.check : 'text-slate-300'} />
                                <span className={`text-sm font-medium ${isChecked(selectedMethod, idx) ? 'text-slate-700 line-through' : 'text-slate-600'}`}>{item}</span>
                            </button>
                        ))}
                    </div>
                    {allChecked && (
                        <div className={`mt-4 p-3 rounded-xl ${colors.badge} text-center font-bold animate-in fade-in`}>
                            ✅ 工具定稿完成！可以進行倫理審查了。
                        </div>
                    )}
                </div>
            </div>

            {/* Part 2: 倫理五問 */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 md:p-8">
                <h2 className="text-2xl font-bold text-slate-800 mb-2 flex items-center gap-3">
                    <Lock className="text-slate-500" size={26} />
                    Part 2｜研究倫理五問
                </h2>
                <p className="text-slate-500 text-sm mb-6">不是背定義，是真的問你自己的研究。每題都要填，才能拿到審查通過章。</p>

                <div className="space-y-5">
                    {ethicsQuestions.map(q => (
                        <div key={q.id} className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
                            <div className="flex items-start gap-3 mb-3">
                                <span className="text-2xl">{q.icon}</span>
                                <div>
                                    <h3 className="font-bold text-slate-800">{q.title}</h3>
                                    <p className="text-sm text-slate-600">{q.desc}</p>
                                </div>
                            </div>
                            <textarea
                                rows={2}
                                className="w-full text-sm border border-slate-200 rounded-xl p-3 bg-white focus:outline-none focus:ring-2 focus:ring-green-300 resize-none"
                                placeholder={q.placeholder}
                                value={ethicsAnswers[q.id] || ''}
                                onChange={e => updateEthics(q.id, e.target.value)}
                            />
                            <div className="flex items-start gap-2 mt-2 text-xs text-amber-600 bg-amber-50 rounded-lg p-2">
                                <AlertTriangle size={13} className="mt-0.5 shrink-0" />
                                <span>{q.risk}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Part 3: AI 知情同意書審查 */}
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-3xl border border-purple-100 p-6 md:p-8">
                <h2 className="text-2xl font-bold text-slate-800 mb-2 flex items-center gap-3">
                    <Bot className="text-purple-500" size={26} />
                    Part 3｜AI 輔助知情同意書審查
                </h2>
                <p className="text-slate-600 text-sm mb-6">把你寫的「知情同意說明」貼給 AI，請他從 16-18 歲高中生的角度審查。</p>

                <div className="bg-slate-900 rounded-2xl p-5 text-sm font-mono text-slate-200 relative overflow-hidden">
                    <div className="absolute top-3 right-3 flex gap-1">
                        <div className="w-3 h-3 rounded-full bg-red-400" />
                        <div className="w-3 h-3 rounded-full bg-yellow-400" />
                        <div className="w-3 h-3 rounded-full bg-green-400" />
                    </div>
                    <p className="text-green-400 mb-3">// 📋 知情同意書審查 Prompt</p>
                    <p className="text-slate-300 leading-relaxed">
                        我寫了一段問卷（或訪談）的知情同意說明，請幫我：<br />
                        <span className="text-amber-300">1.</span> 從「16-18歲高中生」的角度閱讀這段說明<br />
                        <span className="text-amber-300">2.</span> 找出任何看不懂或容易誤解的詞彙與句子<br />
                        <span className="text-amber-300">3.</span> 找出任何可能讓受訪者感到壓力或不舒服的語氣<br />
                        <span className="text-amber-300">4.</span> 幫我改寫成更清楚、更友善的版本（保留所有必要資訊）<br /><br />
                        以下是我的知情同意說明：<br />
                        <span className="text-slate-500">【貼上你的知情同意說明】</span>
                    </p>
                </div>

                <div className="mt-4 bg-white/60 rounded-xl p-4 border border-purple-100">
                    <p className="text-sm text-purple-700 font-semibold mb-1">💡 使用步驟</p>
                    <ol className="text-xs text-slate-600 list-decimal list-inside space-y-1">
                        <li>把上方 Prompt 複製到 ChatGPT / Claude</li>
                        <li>把你的知情同意說明貼在最後面</li>
                        <li>根據 AI 建議修改，並記錄你的採納/不採納理由</li>
                        <li>完成後，請老師審查並蓋章</li>
                    </ol>
                </div>
            </div>

            {/* Part 4: 倫理審查通過證明 */}
            <div className={`rounded-3xl border-2 p-8 text-center transition-all ${ethicsComplete && allChecked
                ? 'bg-gradient-to-br from-green-50 to-teal-50 border-green-300'
                : 'bg-slate-50 border-dashed border-slate-200'}`}>
                <div className={`text-6xl mb-4 transition-all ${ethicsComplete && allChecked ? '' : 'opacity-30 grayscale'}`}>🏅</div>
                <h3 className={`text-xl font-bold mb-2 ${ethicsComplete && allChecked ? 'text-green-700' : 'text-slate-400'}`}>
                    倫理審查通過證明
                </h3>
                {ethicsComplete && allChecked ? (
                    <>
                        <p className="text-green-600 mb-4 text-sm">工具自查 ✅ + 倫理五問 ✅<br />你已完成 W10 全部任務！</p>
                        <button
                            onClick={() => setStampGranted(true)}
                            className={`inline-flex items-center gap-2 px-8 py-3 rounded-full font-bold text-white transition-all text-sm shadow-lg
                                ${stampGranted ? 'bg-green-500 cursor-default' : 'bg-green-600 hover:bg-green-500 hover:scale-105'}`}
                        >
                            {stampGranted ? '✅ 已蓋章！出發！🛫' : '🖊️ 請老師蓋章（點此確認）'}
                        </button>
                        {stampGranted && (
                            <div className="mt-4 animate-in fade-in">
                                <p className="text-green-600 font-bold">研究航班正式起飛！🚀</p>
                                <Link to="/w11" className="inline-flex items-center gap-2 mt-3 px-5 py-2 rounded-full bg-teal-600 text-white text-sm font-semibold hover:bg-teal-500 transition-colors">
                                    前往 W11 研究診所 <ArrowRight size={16} />
                                </Link>
                            </div>
                        )}
                    </>
                ) : (
                    <p className="text-slate-400 text-sm">請完成 Part 1 工具自查 ＆ Part 2 倫理五問後，此處將解鎖</p>
                )}
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center pt-4">
                <Link to="/tool-design" className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700">
                    ← W8-W9 工具設計
                </Link>
                <Link to="/w11" className="flex items-center gap-2 text-sm bg-teal-600 text-white px-5 py-2 rounded-full hover:bg-teal-500 transition-colors font-semibold">
                    前往 W11 <ArrowRight size={16} />
                </Link>
            </div>
        </div>
    );
};
