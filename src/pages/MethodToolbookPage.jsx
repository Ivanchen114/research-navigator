import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import HeroBlock from '../components/ui/HeroBlock';
import ThinkChoice from '../components/ui/ThinkChoice';
import PromptBlock from '../components/ui/PromptBlock';
import {
    TOOL_DESC_KIT,
    LIT_SUBTYPES,
    W10_THINK_CHOICES,
    TEACHING_VIDEOS,
} from '../data/methodToolbook';
import { ArrowLeft } from 'lucide-react';

/**
 * 研究工具庫 · 方法工具書（獨立頁面）
 *
 * Tab 結構：
 *   [ 🎯 概觀 ] [ 🎬 教師影片 ] [ 📊 問卷 ] [ 🗣️ 訪談 ] [ 🧪 實驗 ] [ 📷 觀察 ] [ 📚 文獻 ]
 *
 * URL：
 *   /tools/methods                       → 開「概觀」
 *   /tools/methods?method=questionnaire  → 直接到對應方法 tab
 *   /tools/methods?tab=videos            → 開「教師影片」
 */

const METHOD_KEYS = ['questionnaire', 'interview', 'experiment', 'observation', 'literature'];

const TABS = [
    { id: 'overview', label: '🎯 概觀', kind: 'overview' },
    { id: 'videos', label: '🎬 教師影片', kind: 'videos' },
    ...METHOD_KEYS.map((k) => ({ id: k, label: TOOL_DESC_KIT[k]?.label || k, kind: 'method' })),
];

const MethodToolbookPage = () => {
    const [searchParams] = useSearchParams();
    const urlMethod = searchParams.get('method');
    const urlTab = searchParams.get('tab');
    const initialTab =
        urlMethod && METHOD_KEYS.includes(urlMethod) ? urlMethod
        : urlTab && TABS.some((t) => t.id === urlTab) ? urlTab
        : 'overview';

    const [activeTab, setActiveTab] = useState(initialTab);
    const [activeLitSub, setActiveLitSub] = useState('content'); // 文獻組 sub-tab 預設 ③ 內容分析（最易懂）

    useEffect(() => {
        if (urlMethod && METHOD_KEYS.includes(urlMethod)) setActiveTab(urlMethod);
    }, [urlMethod]);

    const currentTab = TABS.find((t) => t.id === activeTab);
    const kit = currentTab?.kind === 'method' ? TOOL_DESC_KIT[activeTab] : null;
    const matchedVideo = kit ? TEACHING_VIDEOS.find((v) => v.method === activeTab) : null;

    return (
        <div className="page-container animate-in-fade-slide">
            {/* TOP BAR */}
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-4 mb-8 md:mb-12 gap-3">
                <div className="text-[11px] font-mono text-[var(--ink-light)] flex items-center gap-2 min-w-0">
                    <span className="hidden md:inline">研究方法與專題 / 研究工具 / </span>
                    <span className="text-[var(--ink)] font-bold">方法工具書</span>
                </div>
                <Link
                    to="/w10"
                    className="text-[11px] font-mono text-[var(--ink-light)] hover:text-[var(--accent)] flex items-center gap-1 no-underline"
                >
                    <ArrowLeft size={12} /> 回 W10
                </Link>
            </div>

            {/* HERO */}
            <HeroBlock
                kicker="研究工具 · 方法工具書"
                title="5 種方法的"
                accentTitle="完整工具書"
                subtitle="速查手冊：寫題目時翻查、Pilot 修工具時翻查、分析時也能回查。先看「概觀」+「教師影片」建立全局，再切到自己方法 tab 看細節。"
                chain="跨週使用——W10 寫題目、W11 Pilot 修工具、W12 施測、W14 分析時都可以回來查。"
                meta={[
                    { label: '使用週次', value: 'W10 / W11 / W12 / W14（跨週）' },
                    { label: '5 種方法', value: '問卷／訪談／實驗／觀察／文獻' },
                    { label: '老師親拍影片', value: '4 集（文獻／訪談／觀察／實驗）' },
                    { label: '建議讀法', value: '概觀 → 影片 → 自己方法 tab → 寫題目時回查' },
                ]}
            />

            {/* Tab 列 */}
            <div className="mt-8 mb-6 border-b border-[var(--border)]">
                <div className="flex flex-wrap gap-1">
                    {TABS.map((t) => (
                        <button
                            key={t.id}
                            onClick={() => setActiveTab(t.id)}
                            className="px-4 py-2.5 text-[13px] transition-colors border-b-2"
                            style={{
                                borderBottomColor: activeTab === t.id ? 'var(--accent)' : 'transparent',
                                color: activeTab === t.id ? 'var(--accent)' : 'var(--ink-mid)',
                                fontWeight: activeTab === t.id ? 700 : 500,
                                background: 'transparent',
                                cursor: 'pointer',
                            }}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tab 內容 */}
            <div className="space-y-8 prose-zh max-w-[760px]">
                {/* 🎯 概觀 tab */}
                {activeTab === 'overview' && (
                    <>
                        <div className="bg-[var(--paper-warm)] border border-[var(--border)] rounded-[var(--radius-unified)] p-4">
                            <p className="text-[14px] font-bold text-[var(--ink)] mb-1">📖 工具書怎麼讀</p>
                            <ol className="text-[12.5px] text-[var(--ink-mid)] leading-[1.85] list-decimal pl-5 space-y-0.5">
                                <li>先看本頁的 <strong>V→R→F 三大判準</strong>（5 法共通）</li>
                                <li>切到「<strong>教師影片</strong>」tab 看老師親拍 4 集</li>
                                <li>切到自己方法的 tab 看細節（題型／原則／雷／範例 + AI prompt）</li>
                                <li>回計畫書第六章寫題目；卡關時隨時回來查</li>
                            </ol>
                        </div>

                        {/* V→R→F 三大判準 */}
                        <div>
                            <p className="text-[14px] font-bold text-[var(--ink)] mb-3">📐 三大標準 V→R→F · 5 法共通的判準</p>
                            <div className="grid md:grid-cols-3 gap-3">
                                <div className="bg-white border border-[var(--border)] rounded-[var(--radius-unified)] p-4">
                                    <p className="text-[12px] font-mono font-bold text-[var(--accent)]">V · 方向</p>
                                    <p className="text-[14px] font-bold text-[var(--ink)] mt-1">問對的事</p>
                                    <p className="text-[12px] text-[var(--ink-mid)] leading-[1.7] mt-2">每題對應到第四章某個變項／主題</p>
                                    <p className="text-[11px] text-[var(--ink-light)] italic leading-[1.6] mt-1">（變項＝研究的關鍵概念，例：睡眠時數、學業表現）</p>
                                </div>
                                <div className="bg-white border border-[var(--border)] rounded-[var(--radius-unified)] p-4">
                                    <p className="text-[12px] font-mono font-bold text-[var(--accent)]">R · 精度</p>
                                    <p className="text-[14px] font-bold text-[var(--ink)] mt-1">問得清楚</p>
                                    <p className="text-[12px] text-[var(--ink-mid)] leading-[1.7] mt-2">用具體時段／量表，不用「常常」「偶爾」這類模糊詞</p>
                                </div>
                                <div className="bg-white border border-[var(--border)] rounded-[var(--radius-unified)] p-4">
                                    <p className="text-[12px] font-mono font-bold text-[var(--accent)]">F · 執行</p>
                                    <p className="text-[14px] font-bold text-[var(--ink)] mt-1">問得到答案</p>
                                    <p className="text-[12px] text-[var(--ink-mid)] leading-[1.7] mt-2">受訪者答得出來、時間負擔合理（問卷 5 min、訪談 30 min）</p>
                                </div>
                            </div>
                        </div>

                        {/* 雙模式光譜（簡介） */}
                        <div className="bg-[#F8F8FB] border border-[var(--accent)] rounded-[var(--radius-unified)] p-4">
                            <p className="text-[13px] font-bold text-[var(--accent)] mb-2">🌗 用 AI 協作的兩種模式（W10/14/15 都會用到）</p>
                            <p className="text-[12px] text-[var(--ink-mid)] leading-relaxed mb-2">
                                AI 是雙向工具——<strong>不會的請 AI 教，會的請 AI 檢查</strong>。選對模式才是關鍵。每個方法的 tab 內都有對應的 AI 啟動 prompt（教學型）。
                            </p>
                            <ul className="text-[12px] text-[var(--ink-mid)] leading-relaxed list-disc pl-5 space-y-1">
                                <li>🎓 <strong>教學型</strong>：我不會 → 請 AI 給範例（看完自己改寫一次）</li>
                                <li>🥊 <strong>驗收型</strong>：我有初版 → 請 AI 找毛病（不要替我改寫）</li>
                                <li>🚫 <strong>不用 AI</strong>：自己練手——也是合法選擇</li>
                            </ul>
                        </div>
                    </>
                )}

                {/* 🎬 教師影片 tab */}
                {activeTab === 'videos' && (
                    <div className="border-2 border-[#DC2626] rounded-[var(--radius-unified)] overflow-hidden">
                        <div className="px-5 py-3 bg-[#DC2626] text-white flex items-center gap-2">
                            <span className="text-[16px]">📹</span>
                            <span className="font-bold text-[14px]">老師親拍 · 4 集教學影片</span>
                        </div>
                        <div className="p-5 space-y-4">
                            <div className="bg-[#FEF2F2] border-l-4 border-[#DC2626] rounded-r-[6px] p-3 text-[12px] text-[#7F1D1D] leading-[1.85]">
                                💡 <strong>工具是為了解決問題而生</strong>——進入這 4 種方法前，先確認自己的「研究提問」是什麼，不要先選工具再硬湊題目。
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {TEACHING_VIDEOS.map((v) => (
                                    <a
                                        key={v.id}
                                        href={`https://youtu.be/${v.id}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block rounded-[var(--radius-unified)] overflow-hidden border border-[var(--border)] hover:border-[#DC2626] transition-colors bg-white no-underline"
                                    >
                                        <div className="relative">
                                            <img
                                                src={`https://img.youtube.com/vi/${v.id}/mqdefault.jpg`}
                                                alt={v.title}
                                                className="w-full aspect-video object-cover bg-[var(--paper-warm)]"
                                                loading="lazy"
                                            />
                                            <span className="absolute top-2 left-2 bg-[#DC2626] text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded">
                                                {v.ep}
                                            </span>
                                            <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                                <span className="bg-black/60 text-white text-[20px] w-12 h-12 rounded-full flex items-center justify-center">▶</span>
                                            </span>
                                        </div>
                                        <div className="p-3">
                                            <p className="text-[13px] font-bold text-[var(--ink)] mb-1">{v.title}</p>
                                            <p className="text-[11px] text-[#DC2626] font-bold mb-1">{v.sub}</p>
                                            <p className="text-[11px] text-[var(--ink-mid)] leading-relaxed">{v.desc}</p>
                                        </div>
                                    </a>
                                ))}
                            </div>
                            <p className="text-[11px] text-[var(--ink-light)] italic leading-relaxed">
                                ⚠️ 問卷組沒有對應影片——但訪談集講的「提問藝術」對問卷題目設計也有幫助，可以參考 EP2。
                            </p>
                        </div>
                    </div>
                )}

                {/* 📊/🗣️/🧪/📷/📚 5 法 tab */}
                {currentTab?.kind === 'method' && kit && (
                    <div className="space-y-4">
                        {/* 對應教學影片 mini 卡 */}
                        {matchedVideo && (
                            <a
                                href={`https://youtu.be/${matchedVideo.id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 p-3 rounded-[var(--radius-unified)] border border-[#DC2626] bg-[#FEF2F2] hover:bg-[#FEE2E2] transition-colors no-underline"
                            >
                                <img
                                    src={`https://img.youtube.com/vi/${matchedVideo.id}/mqdefault.jpg`}
                                    alt={matchedVideo.title}
                                    className="w-20 aspect-video object-cover rounded flex-shrink-0"
                                    loading="lazy"
                                />
                                <div className="flex-1 min-w-0">
                                    <p className="text-[10px] font-mono font-bold text-[#DC2626]">📹 {matchedVideo.ep} · 老師親拍</p>
                                    <p className="text-[12px] font-bold text-[var(--ink)]">{matchedVideo.title} · {matchedVideo.sub}</p>
                                    <p className="text-[10px] text-[var(--ink-mid)] mt-0.5">點擊看影片（建議讀下方 4 區塊前先看）</p>
                                </div>
                            </a>
                        )}

                        {/* 🎯 橋樑：研究問題 → 工具 */}
                        {kit.bridge && (
                            <div className="bg-[#FFFBEB] border-2 border-[#D97706] rounded-[var(--radius-unified)] p-4">
                                <p className="text-[13px] font-bold text-[#92400E] mb-3">{kit.bridge.title}</p>
                                <p className="text-[11px] text-[#78350F] italic mb-3 leading-relaxed">
                                    💡 從「我有研究問題」到「我知道工具該怎麼做」的橋樑——對照下表先決定方向，再看 A-D 區塊。
                                </p>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-[12px] border-collapse">
                                        <thead>
                                            <tr className="bg-white">
                                                {kit.bridge.cols.map((c, i) => (
                                                    <th key={i} className="border border-[#FCD34D] px-2 py-1.5 text-left font-bold text-[#92400E]">{c}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {kit.bridge.rows.map((row, i) => (
                                                <tr key={i}>
                                                    {row.map((cell, j) => (
                                                        <td key={j} className="border border-[#FCD34D] px-2 py-1.5 text-[#7F1D1D]" style={j === 0 ? { fontWeight: 700, background: '#FFFBEB' } : {}}>{cell}</td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* 🎯 實驗類型 2×2 決策圖 */}
                        {kit.decisionGrid && (
                            <div className="bg-[#EFF6FF] border-2 border-[#0284C7] rounded-[var(--radius-unified)] p-4">
                                <p className="text-[13px] font-bold text-[#075985] mb-3">{kit.decisionGrid.title}</p>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-[12px] border-collapse">
                                        <tbody>
                                            {kit.decisionGrid.rows.map((row, i) => (
                                                <tr key={i}>
                                                    {row.map((cell, j) => (
                                                        <td key={j}
                                                            className="border border-[#0284C7]/40 px-2 py-1.5"
                                                            style={(i === 0 || j === 0) ? { fontWeight: 700, background: '#fff', color: '#075985' } : { background: '#F0F9FF', color: '#0C4A6E' }}>
                                                            {cell || (i === 0 && j === 0 ? '——' : '')}
                                                        </td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* 🎯 正反例範例庫（觀察組） */}
                        {kit.exampleBank && (
                            <div className="bg-[#F0FDF4] border-2 border-[#059669] rounded-[var(--radius-unified)] p-4">
                                <p className="text-[13px] font-bold text-[#166534] mb-3">{kit.exampleBank.title}</p>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-[12px] border-collapse">
                                        <thead>
                                            <tr className="bg-white">
                                                <th className="border border-[#86EFAC] px-2 py-1.5 text-left font-bold w-[80px] text-[#166534]">行為類別</th>
                                                <th className="border border-[#86EFAC] px-2 py-1.5 text-left font-bold text-[#166534]">✅ 正例（算）</th>
                                                <th className="border border-[#86EFAC] px-2 py-1.5 text-left font-bold text-[#7F1D1D]">❌ 反例（不算）</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {kit.exampleBank.items.map((item, i) => (
                                                <tr key={i}>
                                                    <td className="border border-[#86EFAC] px-2 py-1.5 font-bold text-[#166534] bg-white">{item.behavior}</td>
                                                    <td className="border border-[#86EFAC] px-2 py-1.5 text-[#166534]">{item.positive}</td>
                                                    <td className="border border-[#86EFAC] px-2 py-1.5 text-[#7F1D1D]">{item.negative}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <p className="text-[11px] text-[#166534] italic mt-2 leading-relaxed">
                                    💡 模仿這個格式寫自己研究的 3-5 個行為類別。每個都要有「正例 + 反例」具體區分，觀察者才能秒判斷。
                                </p>
                            </div>
                        )}

                        {/* 文獻組 4 子類型 sub-tab */}
                        {activeTab === 'literature' && (
                            <div className="bg-white border-2 border-[#9333EA] rounded-[var(--radius-unified)] p-4">
                                <p className="text-[13px] font-bold text-[#6B21A8] mb-3">📂 你的子類型細節（選一）</p>
                                <p className="text-[11px] text-[#7E22CE] mb-3 leading-relaxed">
                                    上方表格幫你選定子類型後，切到對應的 sub-tab 看完整細節（定義／執行步驟／架構範例）。
                                </p>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {LIT_SUBTYPES.map((s) => (
                                        <button
                                            key={s.id}
                                            onClick={() => setActiveLitSub(s.id)}
                                            className="px-3 py-1.5 text-[12px] rounded-[var(--radius-unified)] border transition-colors"
                                            style={{
                                                background: activeLitSub === s.id ? '#9333EA' : '#fff',
                                                borderColor: activeLitSub === s.id ? '#9333EA' : 'var(--border)',
                                                color: activeLitSub === s.id ? '#fff' : 'var(--ink-mid)',
                                                fontWeight: activeLitSub === s.id ? 700 : 400,
                                                cursor: 'pointer',
                                            }}
                                        >
                                            {s.icon} {s.label}
                                        </button>
                                    ))}
                                </div>
                                {(() => {
                                    const sub = LIT_SUBTYPES.find((s) => s.id === activeLitSub);
                                    if (!sub) return null;
                                    return (
                                        <div className="space-y-3 text-[12px] text-[var(--ink-mid)] leading-relaxed">
                                            <div className="bg-[#FAF5FF] rounded p-3">
                                                <p className="font-bold text-[#6B21A8] mb-1">📖 子類型定義</p>
                                                <p>{sub.defn}</p>
                                            </div>
                                            <div className="bg-[#FAF5FF] rounded p-3">
                                                <p className="font-bold text-[#6B21A8] mb-1">🎯 你要產出什麼</p>
                                                <p>{sub.deliverable}</p>
                                            </div>
                                            <div className="bg-[#FAF5FF] rounded p-3">
                                                <p className="font-bold text-[#6B21A8] mb-1">🏗️ 分析架構範例</p>
                                                <p>{sub.archExample}</p>
                                            </div>
                                            <div className="bg-[#FAF5FF] rounded p-3">
                                                <p className="font-bold text-[#6B21A8] mb-2">📋 執行 5 步驟</p>
                                                <ol className="list-decimal pl-5 space-y-1">
                                                    {sub.steps.map((step, i) => (<li key={i}>{step}</li>))}
                                                </ol>
                                            </div>
                                            {sub.uniqueTips && (
                                                <div className="bg-[#FEF2F2] border-l-4 border-[#DC2626] rounded-r p-3">
                                                    <p className="font-bold text-[#991B1B] mb-1">⚠️ 這個子類型獨家提醒</p>
                                                    <ul className="list-disc pl-5 space-y-0.5 text-[#7F1D1D]">
                                                        {sub.uniqueTips.map((t, i) => (<li key={i}>{t}</li>))}
                                                    </ul>
                                                </div>
                                            )}
                                            {sub.miniExample && (
                                                <div className="bg-[#F0FDF4] border-l-4 border-[#059669] rounded-r p-3">
                                                    <p className="font-bold text-[#166534] mb-2">📝 高中題材迷你範例</p>
                                                    <pre className="text-[11.5px] text-[#166534] whitespace-pre-wrap font-mono leading-[1.7]">{sub.miniExample}</pre>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })()}
                            </div>
                        )}

                        {/* 區塊 A：題型結構 */}
                        <div className="bg-white border border-[var(--border)] rounded-[var(--radius-unified)] p-4">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="text-[10px] font-mono font-bold bg-[var(--accent)] text-white px-2 py-0.5 rounded-[3px]">A · 題型結構</span>
                                <span className="text-[13px] font-bold text-[var(--ink)]">{kit.structure.title}</span>
                            </div>
                            <div className="overflow-x-auto mb-3">
                                <table className="w-full text-[12px] border-collapse">
                                    <thead>
                                        <tr className="bg-[var(--paper-warm)]">
                                            <th className="border border-[var(--border)] px-2 py-1.5 text-left font-bold w-[120px]">類型</th>
                                            <th className="border border-[var(--border)] px-2 py-1.5 text-left font-bold">用途</th>
                                            <th className="border border-[var(--border)] px-2 py-1.5 text-left font-bold">例子</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {kit.structure.types.map((t, i) => (
                                            <tr key={i}>
                                                <td className="border border-[var(--border)] px-2 py-1.5 font-bold text-[var(--ink)]">{t.name}</td>
                                                <td className="border border-[var(--border)] px-2 py-1.5 text-[var(--ink-mid)]">{t.use}</td>
                                                <td className="border border-[var(--border)] px-2 py-1.5 text-[var(--ink-light)]">{t.ex}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="bg-[var(--accent-light)] border-l-3 border-[var(--accent)] rounded-r-[6px] p-2.5 text-[12px] text-[var(--ink-mid)] leading-[1.7] whitespace-pre-line">
                                <span className="font-bold text-[var(--ink)]">推薦結構：</span>{kit.structure.template}
                            </div>
                        </div>

                        {/* 區塊 B：設計原則 */}
                        <div className="bg-white border border-[var(--border)] rounded-[var(--radius-unified)] p-4">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="text-[10px] font-mono font-bold bg-[var(--success)] text-white px-2 py-0.5 rounded-[3px]">B · 設計原則</span>
                                <span className="text-[13px] font-bold text-[var(--ink)]">寫題目前該知道的</span>
                            </div>
                            <ol className="text-[12.5px] text-[var(--ink-mid)] leading-[1.85] list-decimal pl-5 space-y-1">
                                {kit.principles.map((p, i) => (<li key={i}>{p}</li>))}
                            </ol>
                        </div>

                        {/* 區塊 C：常見錯誤 */}
                        <div className="bg-[#FEF2F2] border border-[#FCA5A5] rounded-[var(--radius-unified)] p-4">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="text-[10px] font-mono font-bold bg-[#DC2626] text-white px-2 py-0.5 rounded-[3px]">C · 常見錯誤</span>
                                <span className="text-[13px] font-bold text-[#7F1D1D]">這個方法最容易踩的雷</span>
                            </div>
                            <ul className="text-[12.5px] text-[#7F1D1D] leading-[1.85] list-disc pl-5 space-y-1.5">
                                {kit.traps.map((t, i) => (<li key={i}>{t}</li>))}
                            </ul>
                        </div>

                        {/* 自然科學實驗適用提醒 */}
                        {kit.naturalScienceNote && (
                            <details className="bg-[#F0F9FF] border-2 border-[#0284C7] rounded-[var(--radius-unified)] overflow-hidden">
                                <summary className="px-4 py-2.5 cursor-pointer bg-[#E0F2FE] hover:bg-[#BAE6FD] flex items-center gap-2 flex-wrap">
                                    <span className="text-[10px] font-mono font-bold bg-[#0284C7] text-white px-2 py-0.5 rounded-[3px]">自然科學專用</span>
                                    <span className="text-[13px] font-bold text-[#075985]">{kit.naturalScienceNote.title}</span>
                                </summary>
                                <div className="p-4 space-y-3 border-t border-[#0284C7]/30">
                                    <p className="text-[12.5px] text-[#0C4A6E] leading-[1.85]">{kit.naturalScienceNote.body}</p>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-[12px] border-collapse">
                                            <thead>
                                                <tr className="bg-white">
                                                    <th className="border border-[#0284C7]/30 px-2 py-1.5 text-left font-bold w-[45%]">社科版（人類受試者）</th>
                                                    <th className="border border-[#0284C7]/30 px-2 py-1.5 text-left font-bold w-[55%]">→ 自然科學版（樣本實驗）</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {kit.naturalScienceNote.mappings.map((m, i) => (
                                                    <tr key={i}>
                                                        <td className="border border-[#0284C7]/30 px-2 py-1.5 text-[#0C4A6E] bg-white">{m.social}</td>
                                                        <td className="border border-[#0284C7]/30 px-2 py-1.5 text-[#075985] font-bold bg-[#F0F9FF]">{m.natural}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    <p className="text-[11.5px] text-[#075985] italic leading-relaxed bg-white border border-[#0284C7]/30 rounded p-2.5">
                                        {kit.naturalScienceNote.tip}
                                    </p>
                                </div>
                            </details>
                        )}

                        {/* 區塊 D：完整範例 */}
                        <div className="bg-white border border-[var(--border)] rounded-[var(--radius-unified)] p-4">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="text-[10px] font-mono font-bold bg-[#0EA5E9] text-white px-2 py-0.5 rounded-[3px]">D · 完整範例</span>
                                <span className="text-[13px] font-bold text-[var(--ink)]">把上面三區套到具體題目（學生對照寫到計畫書）</span>
                            </div>
                            <pre className="text-[12px] text-[var(--ink-mid)] leading-[1.85] whitespace-pre-wrap font-mono bg-[#F8FAFC] border border-[var(--border)] rounded-[6px] p-3 overflow-x-auto">{kit.example}</pre>
                            <p className="text-[11.5px] text-[var(--ink-light)] italic mt-2">
                                💡 這是示範主題——你用自己的研究問題、變項、對象替換對應內容寫到計畫書第六章。
                            </p>
                        </div>

                        {/* AI 啟動 prompt */}
                        <details className="border border-[var(--border)] rounded-[var(--radius-unified)] overflow-hidden">
                            <summary className="px-3 py-2 bg-[var(--paper-warm)] cursor-pointer flex items-center gap-2 flex-wrap hover:bg-[var(--paper)]">
                                <span className="text-[10px] font-mono font-bold bg-[var(--ink)] text-white px-2 py-0.5 rounded-[3px]">AI 啟動</span>
                                <span className="text-[12px] font-bold text-[var(--ink)]">不知怎麼開始？點開複製這段 Prompt 給 AI</span>
                            </summary>
                            <div className="p-3 border-t border-[var(--border)]">
                                <PromptBlock text={kit.prompt} label={`🎓 教學型 Prompt — ${kit.label}`} />
                                <p className="text-[11.5px] text-[var(--ink-light)] leading-relaxed mt-2 italic">
                                    💡 把 [方括號] 裡的內容換成你的東西再貼給 AI。<strong>AI 給「方向」就好——不要它替你寫完整題目（自己寫到計畫書才有教學意義）。</strong>
                                </p>
                            </div>
                        </details>

                        {/* 補充練習 */}
                        <details className="rounded-[var(--radius-unified)] border border-[var(--border)] bg-white overflow-hidden">
                            <summary className="cursor-pointer px-4 py-2.5 hover:bg-[var(--paper-warm)] transition-colors flex items-center justify-between gap-2">
                                <span className="text-[12px] text-[var(--ink-mid)]">
                                    📚 <strong className="text-[var(--ink)]">補充練習：題目雷區辨識小測驗</strong>（選做，3 題）
                                </span>
                                <span className="text-[10px] font-mono text-[var(--ink-light)] flex-shrink-0">▼</span>
                            </summary>
                            <div className="border-t border-[var(--border)] p-4 bg-[#FAFAF9]">
                                <p className="text-[11px] text-[var(--ink-mid)] leading-relaxed mb-3">
                                    做 3 題情境題，看自己會不會挑出誘導性／封閉化／可靠性問題。看不出來就回上方再讀一次。
                                </p>
                                <div className="space-y-3">
                                    {W10_THINK_CHOICES.map((tc) => (
                                        <ThinkChoice
                                            key={tc.id}
                                            prompt={tc.prompt}
                                            options={tc.options}
                                            answer={tc.answer}
                                            feedback={tc.feedback}
                                            dataKey={tc.id}
                                        />
                                    ))}
                                </div>
                            </div>
                        </details>
                    </div>
                )}

                {/* 回 W10 連結 */}
                <div className="bg-[var(--paper-warm)] border border-[var(--border)] rounded-[var(--radius-unified)] p-4 flex items-center justify-between mt-12">
                    <div>
                        <p className="text-[13px] font-bold text-[var(--ink)] mb-1">看完了？回 W10 寫題目</p>
                        <p className="text-[11.5px] text-[var(--ink-mid)]">寫題目時遇到問題隨時回來查。</p>
                    </div>
                    <Link
                        to="/w10"
                        className="inline-flex items-center gap-2 bg-[var(--accent)] text-white px-4 py-2 rounded-[var(--radius-unified)] font-bold text-[13px] hover:opacity-90 transition-opacity no-underline"
                    >
                        <ArrowLeft size={14} /> 回 W10 寫題目
                    </Link>
                </div>
            </div>
        </div>
    );
};

export { MethodToolbookPage };
export default MethodToolbookPage;
