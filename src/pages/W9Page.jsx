import React, { useState, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CourseArc from '../components/ui/CourseArc';
import ContentTypeChip from '../components/ui/ContentTypeChip';
import './W9Page.css';
// import ThinkRecord from '../components/ui/ThinkRecord'; // W9 全改提示卡，元件不再使用
import PromptBlock from '../components/ui/PromptBlock';
import AICollaborationPrinciples from '../components/ui/AICollaborationPrinciples';
import AIDialogSubmission from '../components/ui/AIDialogSubmission';
import AIModePicker from '../components/ui/AIModePicker';
import StepEngine from '../components/ui/StepEngine';
import HeroBlock from '../components/ui/HeroBlock';
import TaskCard from '../components/ui/TaskCard';
import StepBriefing from '../components/ui/StepBriefing';
import ResetWeekButton from '../components/ui/ResetWeekButton';
import LessonMap from '../components/ui/LessonMap';
import GroupSizeSelector from '../components/ui/GroupSizeSelector';
import { W9Data } from '../data/lessonMaps';
import { readRecords, STORAGE_KEY } from '../components/ui/ThinkRecord';
import {
    ArrowRight,
    ShieldAlert,
    ClipboardList,
    Mic,
    TestTube2,
    Camera,
    FileSearch,
    Map,
} from 'lucide-react';

/* ══════════════════════════════════════
 *  資料常數
 * ══════════════════════════════════════ */

/* — 分流方法選項 — */
const METHOD_OPTIONS = [
    { id: 'questionnaire', label: '問卷組', icon: <ClipboardList size={18} /> },
    { id: 'interview', label: '訪談組', icon: <Mic size={18} /> },
    { id: 'experiment', label: '實驗組', icon: <TestTube2 size={18} /> },
    { id: 'observation', label: '觀察組', icon: <Camera size={18} /> },
    { id: 'literature', label: '文獻組', icon: <FileSearch size={18} /> },
];

/* — 計畫書 1-5 章 AI 檢核 Prompt（本週 Step 3 用｜AI 深度思考模式）— */
const PLAN_CH1_CHECK_PROMPT = `【建議使用 AI 的「深度思考／推理模式」】
（Gemini 的 Thinking 模式、ChatGPT 的 o1 或 Pro、Claude 的 Extended Thinking 等——請選你慣用 AI 的深度推理版本。一般對話模式回答太淺，這份檢核值得等它多想幾分鐘。）

你是高中專題指導顧問。以下是我五章計畫書的內容——請注意：學生在 W9 課堂剛寫完雛形，「不是每章都到完成度」。我會在開頭告訴你**每章目前的進度階段**，請就「該階段該有的品質」做檢核，不要對草稿用定版的標準苛責。

【我目前的進度自評】（請學生填完再貼進來；每章從「方向／雛形／精修／定版」擇一填入）
- 第一章（題目／動機／問題）：___
- 第二章（操作型定義）：___
- 第三章（文獻回顧）：___（文獻數量：___ 篇；W6 合題後可能需重查）
- 第四章（變項／主題／維度）：___
- 第五章（研究對象／抽樣）：___

【四階段定義 — AI 請依此校準回饋深度】
- 方向：只有概念句，還沒展開 → 你只檢「方向對不對」，給「該補什麼」清單，不要挑語法
- 雛形：段落寫出來但粗糙 → 你檢「結構＋邏輯一致」，指出明顯漏洞，不要挑用詞
- 精修：內容完整但要打磨 → 你檢「精度＋論證強度」，這時可以挑用詞與引用
- 定版：要繳交了 → 你做最後一輪挑刺，找任何不一致

【請深入檢查以下六件事，依各章進度給對應深度的回饋】

1. 【方向】研究動機是否能支撐研究問題？（若落差大，指出在哪）
2. 【一致】研究目的與主研究問題是否邏輯一致？子問題是否都對應主問題？
3. 【定義】第二章的關鍵詞操作定義，是否足以讓第六章的工具「測得到」那個概念？（若定義太抽象會讓後續工具設計失準）
4. 【文獻】第三章的文獻是否真的支持（或挑戰）我的研究問題？還是只是有關鍵字相關？
   ※ 若我標註「W6 合題後文獻待重查」——請只就「目前文獻方向」給建議，並列出我合題後該補的「3 個關鍵字組合」幫我課後分頭找。
5. 【變項／主題】第四章的變項／主題／維度，是否每一個都能對應到研究問題的某個子問題？有沒有遺漏或多餘？
6. 【對象】第五章的對象與抽樣，是否能真正回答研究問題？樣本數／招募方式合理嗎？

【回應格式】
請依「① 進度判讀（你看到我各章是哪個階段）→ ② 各章主要盲點（依進度深度給）→ ③ 課後優先補完清單（哪三件事最該先做）」三段回。
不用替我修改，只要指出問題點與建議方向。

【以下貼上你的計畫書第 1-5 章內容（即使是草稿、半成品都貼，並在每章開頭標註自己的進度階段）】`;

/* — W9 Step 4 AI 檢核 Prompt 展示框（必做、一鍵複製） — */
const W9AiCheckPromptBox = () => {
    const [copied, setCopied] = useState(false);
    const handleCopy = useCallback(() => {
        navigator.clipboard.writeText(PLAN_CH1_CHECK_PROMPT).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }).catch(() => {
            const ta = document.createElement('textarea');
            ta.value = PLAN_CH1_CHECK_PROMPT;
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    }, []);
    return (
        <div className="bg-[var(--paper-warm)] border border-[var(--border)] rounded-[var(--radius-unified)] overflow-hidden">
            <div className="px-5 py-3 bg-[var(--ink)] flex items-center justify-between gap-3" style={{ color: '#fff' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#fff' }}>AI 檢核 Prompt · 點右邊複製</span>
                <button
                    onClick={handleCopy}
                    className="text-[12px] font-bold bg-white text-[var(--ink)] px-3 py-1 rounded hover:bg-[var(--paper-warm)] transition-colors flex-shrink-0"
                    type="button"
                >
                    {copied ? '✓ 已複製' : '📋 複製'}
                </button>
            </div>
            <pre className="p-5 text-[12px] text-[var(--ink)] leading-[1.85] whitespace-pre-wrap font-mono max-h-[360px] overflow-y-auto">{PLAN_CH1_CHECK_PROMPT}</pre>
        </div>
    );
};

/* ══════════════════════════════════════
 *  主元件
 * ══════════════════════════════════════ */

export const W9Page = () => {
    const [selectedMethod, setSelectedMethod] = useState('');
    const [w3Motivation, setW3Motivation] = useState('');
    const [w3Topic, setW3Topic] = useState('');
    const [w8Method, setW8Method] = useState('');
    const [w8Secondary, setW8Secondary] = useState(''); // W8 補充方法（label 字串）
    const [w8Topic, setW8Topic] = useState('');
    const [studentRoute, setStudentRoute] = useState(''); // 'team' | 'solo' | ''（W6 路線決定，註：舊鍵 w8-route 是 Wave C 改名前的命名）
    const [showLessonMap, setShowLessonMap] = useState(false);
    /* Step 2 五章分頁 tab（ch1~ch5；參考架、不鎖序、不寫 localStorage） */
    const [chapterTab, setChapterTab] = useState('ch1');
    /* AI 使用模式 */
    const [w9AiMode, setW9AiMode] = useState(() => {
        try {
            const r = JSON.parse(localStorage.getItem('rib_think_records')) || {};
            return r['w9-ai-mode'] || '';
        } catch { return ''; }
    });

    /* 建議2：盤點確認（題目 W6 後有沒有調整） */
    const [topicAdjusted, setTopicAdjusted] = useState(() => {
        try { return localStorage.getItem('w9-topic-adjusted') || ''; } catch { return ''; }
    });
    const handleTopicAdjusted = (val) => {
        setTopicAdjusted(val);
        try { localStorage.setItem('w9-topic-adjusted', val); } catch { /* ignore */ }
    };

    /* W8 帶入方法、題目與 3 題初稿（前測素材） */
    useEffect(() => {
        const saved = readRecords();
        const method = saved['w8-tool-method']?.trim() || saved['w8-method-reason']?.trim() || '';
        const secondary = saved['w8-tool-method-secondary']?.trim() || '';
        const topic = saved['w8-merged-topic']?.trim() || saved['w8-research-question']?.trim() || '';
        if (method) setW8Method(method);
        if (secondary) setW8Secondary(secondary);
        if (topic) setW8Topic(topic);
        /* W3 一句話動機 + W3 個人題目帶入（給 Step 2 動機擴寫鷹架做組內對照用） */
        const motivation = saved['w3-motivation']?.trim() || '';
        if (motivation) setW3Motivation(motivation);
        const w3T = saved['w3-final-topic']?.trim() || '';
        if (w3T) setW3Topic(w3T);
        /* 讀取 W6 路線決定（Team / Solo）—— 影響 Step 1 互評環節的鷹架
         * 鏈：w6-route（新主鍵，W6PosterTeamPage 寫入）→ w8-route（舊鍵 fallback，Wave C 改名前命名） */
        const route = localStorage.getItem('w6-route') || localStorage.getItem('w8-route') || '';
        if (route === 'team' || route === 'solo') setStudentRoute(route);

        /* 嘗試自動偵測分流 */
        const methodLower = method.toLowerCase();
        if (methodLower.includes('問卷')) setSelectedMethod('questionnaire');
        else if (methodLower.includes('訪談')) setSelectedMethod('interview');
        else if (methodLower.includes('實驗')) setSelectedMethod('experiment');
        else if (methodLower.includes('觀察')) setSelectedMethod('observation');
        else if (methodLower.includes('文獻')) setSelectedMethod('literature');
    }, []);


    /* 選擇方法時同步存檔（同時寫 w9-my-method + w8-tool-method 給 useEffect 帶入跟下游 fallback 用） */
    const handleMethodSelect = useCallback((methodId) => {
        setSelectedMethod(methodId);
        const label = METHOD_OPTIONS.find(m => m.id === methodId)?.label || methodId;
        const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
        all['w9-my-method'] = label;
        all['w8-tool-method'] = label;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    }, []);


    /* ── 五步驟 ──────────────────────────────────────── */

    const steps = [
        /* ─── Step 1：開場 + W2-W8 盤點（第一節 15 min）─── */
        {
            title: '開場 + W2-W8 盤點',
            icon: '📬',
            content: (
                <div className="space-y-8 prose-zh">
                    <StepBriefing
                        lines={[
                            { label: '節奏', text: '跟老師做（15 分鐘小組討論）' },
                            { label: '做', text: '小組坐在一起：題目從 W3 到現在有沒有變？主要研究方法確定了嗎？有什麼同儕建議還沒納入？確認好，再開始寫計畫書。' },
                        ]}
                    />
                    {/* 本週主軸：兩節都拿來寫 1-5 章 */}
                    <div className="bg-white border-2 border-[var(--accent)] rounded-[var(--radius-unified)] p-5 max-w-[720px]">
                        <p className="text-[14px] font-bold text-[var(--ink)] mb-2">🎯 Step 1 重點：小組一起盤點 W2-W8 的成果、確認共識——再開始填計畫書</p>
                        <ul className="text-[13px] text-[var(--ink-mid)] leading-[1.85] list-disc pl-5 space-y-1">
                            <li><strong>組內盤點</strong>（10 min）：用下面「1-5 章觀念地圖」對照——你們組的題目、操作型定義、文獻、方法分別在 W2-W8 哪裡寫過？確認大家對「我們在做什麼」有共識</li>
                            <li><strong>文獻是否仍適用？</strong>：W6 合題若改了題目方向，W7 找的文獻可能對不上新題目——<span className="text-[var(--ink)]">Step 3 有文獻策略卡說明課堂怎麼處理、課後怎麼分工補查</span></li>
                            <li><strong>納入同儕建議</strong>（5 min）：W6 走讀（你個人海報收到的）+ W8 同儕審查的建議，挑還適用的記一兩句，等下寫計畫書時納入</li>
                            <li>盤點完到 Step 2 一章一個分頁看寫法導引 → Step 3 計畫書組裝工作流</li>
                        </ul>
                        <p className="text-[11.5px] text-[var(--ink-light)] leading-relaxed mt-3 pt-3 border-t border-[var(--border)]">
                            💡 工具品質判斷（三大標準 / 五錯誤類型 / RxInspector）已搬到 W10——那是寫第六章工具時要用的能力。本週專心寫 1-5 章地基就好。
                        </p>
                    </div>

                    {/* 建議2：盤點確認按鈕 */}
                    <div className="bg-white border-2 border-[var(--border)] rounded-[var(--radius-unified)] p-4 max-w-[720px]">
                        <p className="text-[12.5px] font-bold text-[var(--ink)] mb-3">✅ 盤點確認：W6 之後，你們組的題目或方法有沒有調整過？</p>
                        <div className="flex flex-wrap gap-2 mb-3">
                            {[
                                { val: 'yes', label: '🔄 有調整', activeColor: 'var(--accent)' },
                                { val: 'no', label: '✅ 沒有，W3/W6 題目直接帶來', activeColor: 'var(--success)' },
                            ].map(({ val, label, activeColor }) => {
                                const active = topicAdjusted === val;
                                return (
                                    <button
                                        key={val}
                                        type="button"
                                        onClick={() => handleTopicAdjusted(val)}
                                        className="text-[12.5px] font-bold px-4 py-2 rounded-[var(--radius-unified)] border-2 transition-all"
                                        style={{
                                            background: active ? activeColor : '#fff',
                                            borderColor: active ? activeColor : 'var(--border)',
                                            color: active ? '#fff' : 'var(--ink-mid)',
                                        }}
                                    >
                                        {label}
                                    </button>
                                );
                            })}
                        </div>
                        {topicAdjusted === 'yes' && (
                            <div className="bg-[#FEF3C7] border-l-4 border-[#D97706] rounded-r-[6px] p-3 text-[11.5px] text-[#78350F] leading-relaxed space-y-1">
                                <p className="font-bold text-[#92400E]">調整了→這幾件事要特別注意：</p>
                                <p>・<strong>題目改了</strong>：第一章動機要重寫，W3 那句只剩參考價值</p>
                                <p>・<strong>文獻對不上</strong>：Step 3 文獻策略卡說明課堂怎麼處理；課後分工補查（W10 前完成）</p>
                                <p>・<strong>關鍵詞換了</strong>：第二章操作型定義要重挑、不能直接搬 W5</p>
                            </div>
                        )}
                        {topicAdjusted === 'no' && (
                            <div className="bg-[#F0FDF4] border-l-4 border-[#10B981] rounded-r-[6px] p-3 text-[11.5px] text-[#065F46] leading-relaxed">
                                <p>✅ 太好了——W5 操作定義、W7-W8 文獻、W3 動機都可以直接整合進計畫書對應章節。</p>
                            </div>
                        )}
                    </div>

                    {/* 身份識別卡：Team / Solo 分流提示（讀 W6 路線） */}
                    {studentRoute === 'solo' && (
                        <div className="bg-[#FEF3C7] border-l-4 border-[#D97706] rounded-r-[var(--radius-unified)] p-4 max-w-[720px]">
                            <p className="text-[13px] font-bold text-[#92400E] mb-1">🐺 Solo 線專屬提示</p>
                            <p className="text-[12.5px] text-[#78350F] leading-relaxed mb-2">
                                你 W6 選了 Solo 單飛獨行——本節的「組內看診」對你不適用。請改用以下流程：
                            </p>
                            <ol className="text-[12.5px] text-[#78350F] leading-[1.9] list-decimal pl-5 space-y-1">
                                <li><strong>自我看診</strong>：照本節三大標準，先完整自診一輪（每個錯誤類型都自己找一次）。</li>
                                <li><strong>跨組求援</strong>：找 1-2 位<strong>不同方法組</strong>的同學互看（例如你做問卷，找訪談組同學看你題目）——他們的「外行眼睛」反而能挑出你看不到的盲點。</li>
                                <li><strong>老師複診</strong>：本節下課前主動找老師 5 分鐘對話，把你最不確定的一條工具決策提出來。</li>
                            </ol>
                            <p className="text-[11px] text-[#92400E] italic mt-2">
                                ※ Solo 不等於單獨——你只是換一種方式取得反饋。研究本來就是社群活動。
                            </p>
                        </div>
                    )}
                    {studentRoute === 'team' && (
                        <div className="bg-[#ECFDF5] border-l-4 border-[#10B981] rounded-r-[var(--radius-unified)] p-4 max-w-[720px]">
                            <p className="text-[13px] font-bold text-[#065F46]">🤝 Team 線：組內看診工作坊照常進行</p>
                            <p className="text-[12.5px] text-[#047857] leading-relaxed mt-1">
                                各組互看彼此工具初稿，用三大標準互挑問題。組員的判斷不一致時——這就是學習發生的地方，把分歧寫下來帶到老師複診。
                            </p>
                        </div>
                    )}

                    {/* 🤝 組內合議方法登記（W9 第一個紀錄點 · 點按鈕＋寫理由） */}
                    <div className="bg-white border-2 border-[var(--accent)] rounded-[var(--radius-unified)] p-5 max-w-[760px]">
                        <div className="flex items-center gap-2 mb-2">
                            <ContentTypeChip type="做" />
                            <p className="text-[14px] font-bold text-[var(--accent)]">🤝 開工前先合議：你們組要用什麼方法？（5 分鐘）</p>
                        </div>
                        <p className="text-[12.5px] text-[var(--ink-mid)] leading-[1.85] mb-3">
                            W4 你<strong>個人</strong>選了一個方法，但 W6 組隊後<strong>可能改</strong>——這 5 分鐘<strong>組內合議</strong>：
                            <strong>主方法是上層決策</strong>，會影響第四章變項／主題／維度、第五章對象與抽樣，也會影響 W10 第六章工具設計。<strong>邊寫邊改方法 = 後面章節重寫</strong>。
                        </p>

                        {/* 跨週連結：回 W4 方法地圖決策樹 */}
                        <div className="bg-[var(--paper-warm)] border border-[var(--border)] rounded-[var(--radius-unified)] p-2.5 mb-3 flex items-center justify-between gap-3">
                            <p className="text-[11.5px] text-[var(--ink-mid)] leading-relaxed">
                                💡 不確定該選哪個方法？回 <strong className="text-[var(--ink)]">W4 方法地圖</strong>看「兩層判斷決策樹」（自己收集 vs 分析文本 → 5 法分流），再回來點選。
                            </p>
                            <a
                                href="/w4"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 bg-[var(--accent)] text-white px-3 py-1.5 rounded-[var(--radius-unified)] font-bold text-[11.5px] hover:opacity-90 transition-opacity no-underline flex-shrink-0"
                            >
                                🗺️ 回 W4 看
                            </a>
                        </div>

                        {/* 5 按鈕：方法點選（同步寫 w9-my-method + w8-tool-method） */}
                        <p className="text-[12px] font-bold text-[var(--ink)] mb-2">① 點選組內合議的主方法（單選 · 之後可改）</p>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-2">
                            {METHOD_OPTIONS.map((m) => {
                                const picked = selectedMethod === m.id;
                                return (
                                    <button
                                        key={m.id}
                                        type="button"
                                        onClick={() => handleMethodSelect(m.id)}
                                        className="text-center p-3 rounded-[var(--radius-unified)] border-2 transition-all"
                                        style={{
                                            background: picked ? 'var(--accent)' : '#fff',
                                            borderColor: picked ? 'var(--accent)' : 'var(--border)',
                                            color: picked ? '#fff' : 'var(--ink-mid)',
                                            fontWeight: picked ? 700 : 500,
                                        }}
                                    >
                                        <div className="flex items-center justify-center gap-1 text-[12.5px]">
                                            {m.icon}
                                            <span>{m.label}</span>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                        {selectedMethod && (
                            <>
                                <div className="bg-[#F0FDF4] border border-[#86EFAC] rounded p-2 mb-1.5 text-[11.5px] text-[#166534]">
                                    ✅ 已選：{METHOD_OPTIONS.find(m => m.id === selectedMethod)?.label} —— 網站會把這個方法自動帶入 W9-W15 的所有相關區塊（包括計畫書範本、工具書、AI prompt、檢核表）
                                </div>
                                <div className="bg-[#FEF2F2] border border-[#FCA5A5] rounded p-2 mb-3 text-[11.5px] text-[#991B1B]">
                                    ⚠️ <strong>方法決定後，W10 整本工具設計都會跟著走</strong>。下週 W10 前若要改方法，<strong>先找老師討論</strong>，不要自己換——換了等於工具設計重來。
                                </div>
                            </>
                        )}

                        {/* 合議理由 + 補充方法 — 思考清單（直接寫進計畫書，不重複輸入網頁） */}
                        <p className="text-[12px] font-bold text-[var(--ink)] mb-2 mt-3">② 合議時組內討論這 4 點，討論完直接寫進<strong className="text-[var(--accent)]">計畫書第三章「研究方法」段落</strong></p>
                        <div className="bg-[var(--paper-warm)] border border-[var(--border)] rounded-[8px] p-3">
                            <ul className="text-[12px] text-[var(--ink-mid)] leading-[1.85] list-none space-y-1">
                                <li><span className="font-mono font-bold text-[var(--accent)] mr-2">①</span>主方法：（上方按鈕已選）</li>
                                <li><span className="font-mono font-bold text-[var(--accent)] mr-2">②</span>為什麼選這個：（跟研究問題對得上嗎？樣本好取得嗎？組內成員擅長嗎？）</li>
                                <li><span className="font-mono font-bold text-[var(--accent)] mr-2">③</span>跟 W4 個人選的相比：（一樣／改了。改的話為什麼？）</li>
                                <li><span className="font-mono font-bold text-[var(--accent)] mr-2">④</span>補充方法：（如有，例：「先問卷找趨勢 N=80 → 再訪談補深度 N=6」）</li>
                            </ul>
                        </div>
                        <p className="text-[11.5px] text-[var(--ink-light)] italic mt-2 leading-relaxed">
                            ✏️ <strong>不在這格寫</strong>——直接到計畫書第三章寫成一段。Solo 或單飛？直接寫你個人決定的方法即可。
                        </p>
                    </div>

                    {/* 1-5 章觀念複習地圖（不是個人素材清單，是觀念口訣）*/}
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <ContentTypeChip type="學" />
                            <h4 className="font-serif text-[18px] md:text-[20px] font-bold text-[var(--ink)]">
                                📐 1-5 章觀念複習地圖（5 分鐘掃過）
                            </h4>
                        </div>
                        <p className="text-[12.5px] text-[var(--ink-mid)] leading-relaxed mb-3">
                            W2-W8 學過的東西，6-7 週後幾乎都忘光了——這 5 章每章一句話濃縮，<strong>5 秒復現觀念</strong>，再回計畫書 寫。<strong className="text-[var(--ink)]">這是觀念口訣、不是個人素材</strong>——W8 重新組隊、題目換了也適用。
                        </p>
                        <div className="bg-white border border-[var(--border)] rounded-[var(--radius-unified)] overflow-hidden">
                            <div className="grid grid-cols-[60px_140px_1fr_90px] bg-[var(--paper-warm)] border-b border-[var(--border)] text-[11px] font-mono font-bold text-[var(--ink)]">
                                <div className="px-3 py-2.5">章</div>
                                <div className="px-3 py-2.5 border-l border-[var(--border)]">內容</div>
                                <div className="px-3 py-2.5 border-l border-[var(--border)]">核心觀念（30 秒複習）</div>
                                <div className="px-3 py-2.5 border-l border-[var(--border)]">忘了？跳回去</div>
                            </div>
                            {[
                                { ch: '一', t: '題目／動機／問題', key: '8 病症速記：太大／太抽象／百科／玄學／太私／無聊／個案／無範圍。題目要避開這 8 條。', back: [{ to: '/w3', label: 'W3 八病症' }] },
                                { ch: '二', t: '操作型定義', key: '三件事：可測量、有正反例、前後一致。「壓力大」不行、「每週超過 3 次熬夜過 12 點」可以。', back: [{ to: '/w3', label: 'W3 具體化' }, { to: '/w5', label: 'W5 操作型' }] },
                                { ch: '三', t: '文獻探討', key: '文獻不是擺著、要對話：他怎麼說 → 我怎麼接 → 我怎麼補。最少 2-3 篇 A/B 級。', back: [{ to: '/w7', label: 'W7 文獻搜尋' }, { to: '/w8', label: 'W8 引用寫作' }] },
                                { ch: '四', t: '變項／主題／維度', key: '從題目拆出來。題目沒明說、但會影響結果的——就是控制變項。', back: [{ to: '/w4', label: 'W4 方法地圖' }, { to: '/w5', label: 'W5 操作型' }] },
                                { ch: '五', t: '抽樣／對象', key: '三件都要寫：為什麼是這群人？幾人？怎麼找？隨機抽樣＝每人被抽中機率一樣（最理想、最難做）；方便抽樣＝就近找得到的人（高中專題最常用、合法）——用方便抽樣要老實標，別假裝隨機。', back: [{ to: '/w5', label: 'W5 對象與抽樣' }] },
                            ].map((r, i) => (
                                <div key={i} className="grid grid-cols-[60px_140px_1fr_90px] border-b border-[var(--border)] last:border-b-0 text-[12px]">
                                    <div className="px-3 py-2.5 font-mono font-bold text-[var(--accent)]">{r.ch}</div>
                                    <div className="px-3 py-2.5 border-l border-[var(--border)] text-[var(--ink)] font-bold">{r.t}</div>
                                    <div className="px-3 py-2.5 border-l border-[var(--border)] text-[var(--ink-mid)] leading-[1.85]">{r.key}</div>
                                    <div className="px-3 py-2.5 border-l border-[var(--border)] flex flex-col gap-1">
                                        {r.back.map((b, j) => (
                                            <Link key={j} to={b.to} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-0.5 text-[10.5px] font-mono text-[var(--accent)] hover:underline no-underline">
                                                ↗ {b.label}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <p className="text-[11.5px] text-[var(--ink-light)] italic mt-2">
                            💡 點「↗」連結會在新分頁打開那一週——掃一眼就回來繼續寫。雛形級＝方向對、邏輯通順、還粗糙；不追求完美，W10 還會再修。
                        </p>
                    </div>

                    {/* 進到 Step 2 提示 */}
                    <div className="w7-notice w7-notice-gold">
                        ➡️ 看完地圖、知道每章對應素材在哪 → 進 <strong>Step 2 五章寫法導引</strong>：一章一個分頁，看原則＋判斷題目變了沒＋去 docx 寫（工具品質與題目設計教學在 W10 處理）。
                    </div>
                </div>
            ),
        },

        /* ─── Step 2：1-5 章寫法導引（五分頁 tab） ─── */
        {
            title: '1-5 章寫法導引',
            icon: '📋',
            content: (
                <div className="space-y-8 prose-zh">
                    <StepBriefing
                        lines={[
                            { label: '學', text: '1-5 章各自的寫法原則與範例' },
                            { label: '做', text: '一章一個分頁：判斷題目有沒有變 → 看原則與範例 → 去 docx 寫那一章' },
                        ]}
                    />
                    {/* 使用說明卡 */}
                    <div className="bg-[var(--paper-warm)] border border-[var(--border)] rounded-[var(--radius-unified)] p-4 max-w-[760px]">
                        <p className="text-[13px] font-bold text-[var(--ink)] mb-1.5">📑 這五個分頁怎麼用</p>
                        <ul className="text-[12px] text-[var(--ink-mid)] leading-[1.8] list-disc pl-5 space-y-0.5">
                            <li><strong>第一章全組一起做</strong>——題目／動機要有共識；第二～五章<strong>組員分章、平行寫</strong>，誰寫哪章就點哪個分頁。</li>
                            <li>分頁<strong>不鎖順序</strong>、不收填寫——這裡只看原則和範例，內容寫進計畫書 docx。</li>
                            <li>每個分頁開頭都有「題目變了沒」判斷卡：跟你個人時期一樣→可直接搬；變了→這格要重想。</li>
                        </ul>
                    </div>
                    {/* 五章 tab 列 */}
                    <div className="flex flex-wrap gap-2">
                        {[
                            { id: 'ch1', label: '第一章 · 題目／動機' },
                            { id: 'ch2', label: '第二章 · 操作型定義' },
                            { id: 'ch3', label: '第三章 · 文獻回顧' },
                            { id: 'ch4', label: '第四章 · 變項／主題／維度' },
                            { id: 'ch5', label: '第五章 · 對象／抽樣' },
                        ].map((tab) => {
                            const active = chapterTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => setChapterTab(tab.id)}
                                    className="text-[12.5px] font-bold px-3 py-2 rounded-[var(--radius-unified)] border-2 transition-all"
                                    style={{
                                        background: active ? 'var(--accent)' : '#fff',
                                        borderColor: active ? 'var(--accent)' : 'var(--border)',
                                        color: active ? '#fff' : 'var(--ink-mid)',
                                    }}
                                >
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>

                    {/* ═══ tab 一：第一章 題目／動機 ═══ */}
                    {chapterTab === 'ch1' && (
                        <div className="space-y-4">
                    {/* 🔥 第一章動機擴寫鷹架（W3 一句話 → W9 一段話的橋） */}
                    <div className="bg-white border-2 border-[var(--accent)] rounded-[var(--radius-unified)] p-5 max-w-[720px]">
                        <p className="text-[14px] font-bold text-[var(--accent)] mb-2">🔥 寫第一章動機前 · 先對照 W3 個人題目 vs 組內合議題目</p>
                        <p className="text-[12.5px] text-[var(--ink-mid)] leading-[1.85] mb-3">
                            <strong>W3 是個人寫的</strong>，W6 組隊後組內可能<strong>融合題目</strong>或<strong>整個換新題目</strong>。
                            動機要基於<strong className="text-[var(--accent)]">組內合議的題目</strong>寫——W3 那句只是個人靈感參考，組內題目改了就要重寫動機。
                        </p>

                        {/* 題目對照：W3 個人 vs W6 組內合題 */}
                        {(w3Topic || w8Topic) && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
                                <div className="bg-[var(--paper-warm)] border border-[var(--border)] rounded p-2.5">
                                    <p className="text-[11px] font-bold text-[var(--ink-light)] mb-1">📂 W3 你個人寫的題目</p>
                                    {w3Topic
                                        ? <p className="text-[11.5px] text-[var(--ink-mid)] leading-relaxed italic">「{w3Topic}」</p>
                                        : <p className="text-[11.5px] text-[var(--ink-light)] italic">（沒紀錄）</p>}
                                </div>
                                <div className="bg-[#EFF6FF] border-2 border-[#BFDBFE] rounded p-2.5">
                                    <p className="text-[11px] font-bold text-[#1E40AF] mb-1">🤝 W6 組內合題後題目（W9 起以這個為準）</p>
                                    {w8Topic
                                        ? <p className="text-[11.5px] text-[#1E3A8A] leading-relaxed italic">「{w8Topic}」</p>
                                        : <p className="text-[11.5px] text-[#92400E] italic">⚠️ 組內還沒合議題目——回 <a href="/w8" target="_blank" rel="noopener noreferrer" className="text-[var(--accent)] underline">W8</a> 寫合議題目，或<strong>立刻組內討論</strong>把組內題目寫到計畫書第一章再回來</p>}
                                </div>
                            </div>
                        )}

                        {/* W3 動機帶入（明示是個人版，僅作參考） */}
                        {w3Motivation ? (
                            <div className="bg-[#FFFBEB] border-l-4 border-[#D97706] rounded-r-[6px] p-3 mb-3">
                                <p className="text-[11.5px] font-bold text-[#92400E] mb-1">📂 你 W3 寫的個人版一句話動機（僅作靈感參考 · 組內題目改了就要重寫）：</p>
                                <p className="text-[12.5px] text-[#7C2D12] italic leading-relaxed">「{w3Motivation}」</p>
                                <p className="text-[11px] text-[#92400E] italic mt-1.5 pt-1.5 border-t border-[#D97706]/30">
                                    💡 W6 組內題目跟 W3 個人題目<strong>一樣／很接近</strong> → 這句可直接擴寫。
                                    <strong>完全不同</strong> → 不要硬擴寫，<strong>組內重新討論一句</strong>，再依下方 3 問擴寫。
                                </p>
                            </div>
                        ) : (
                            <div className="bg-[var(--paper-warm)] border border-[var(--border)] rounded p-2.5 mb-3 text-[11.5px] text-[var(--ink-light)]">
                                ⚠️ 沒偵測到 W3 個人動機紀錄。沒關係——下方直接依組內題目從 3 問開始寫即可。
                            </div>
                        )}

                        {/* 動機 3 問 */}
                        <p className="text-[12px] font-bold text-[var(--ink)] mb-2">📋 動機 3 問（擴寫時對著補，3 題都要答到）</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-3">
                            <div className="bg-[#EFF6FF] border border-[#BFDBFE] rounded p-2.5">
                                <p className="text-[11.5px] font-bold text-[#1E40AF] mb-1">Q1 · 情境／理由</p>
                                <p className="text-[11px] text-[#1E3A8A] leading-relaxed">基於什麼樣的情境或理由，讓你們想要做這個研究？<br /><span className="text-[#1E40AF] italic">（你看到／經歷什麼具體事？為什麼是「你」想做？）</span></p>
                            </div>
                            <div className="bg-[#F5F3FF] border border-[#DDD6FE] rounded p-2.5">
                                <p className="text-[11.5px] font-bold text-[#5B21B6] mb-1">Q2 · 研究空缺</p>
                                <p className="text-[11px] text-[#4C1D95] leading-relaxed">前人研究說過什麼？哪裡還沒答到？<br /><span className="text-[#5B21B6] italic">（W7-W8 找的文獻說 ___，但 ___ 沒人答）</span></p>
                            </div>
                            <div className="bg-[#FEF3C7] border border-[#FDE68A] rounded p-2.5">
                                <p className="text-[11.5px] font-bold text-[#92400E] mb-1">Q3 · 解決什麼</p>
                                <p className="text-[11px] text-[#78350F] leading-relaxed">做這個研究可以解決什麼事情？<br /><span className="text-[#92400E] italic">（例：把某現象說清楚／驗證某現象是否存在／比較異同／探索原因）</span></p>
                            </div>
                        </div>

                        {/* 📋 學生實例（含色標 + 對照教學） */}
                        <details className="bg-white border border-[var(--border)] rounded-[var(--radius-unified)] mb-3">
                            <summary className="cursor-pointer px-4 py-2 hover:bg-[var(--paper-warm)] flex items-center gap-2 text-[12px]">
                                <ContentTypeChip type="學" />
                                <span className="font-bold text-[var(--ink)]">📋 學生實例 · 色標對照（點開看 2 個真實範例 + 老師標註）</span>
                                <span className="ml-auto text-[10px] font-mono text-[var(--ink-light)]">▼</span>
                            </summary>
                            <div className="border-t border-[var(--border)] p-4 space-y-4">
                                {/* 範例 1 */}
                                <div className="bg-[var(--paper-warm)] border border-[var(--border)] rounded p-3">
                                    <p className="text-[12px] font-bold text-[var(--ink)] mb-1">📌 範例 1：不同職業對信仰的差異（人神共奮）</p>
                                    <p className="text-[12.5px] text-[var(--ink)] leading-[1.85] mb-2">
                                        <span className="bg-[#FEF3C7] px-0.5">不同職業背景的人可能會對信仰和宗教有不同的看法與接受程度。</span>
                                        <span className="bg-[#CFFAFE] px-0.5">我們希望能理解不同職業背景的人如何看待和實踐信仰，並且揭示出宗教與職業生涯之間的深層關聯性。</span>
                                    </p>
                                    <div className="text-[11px] text-[var(--ink-mid)] leading-relaxed space-y-0.5">
                                        <p>· <span className="bg-[#FEF3C7] px-1 font-bold text-[#92400E]">Q1 情境</span> 寫了「不同職業可能不同」（觀察）✅</p>
                                        <p>· <span className="bg-[#CFFAFE] px-1 font-bold text-[#075985]">Q3 解決什麼</span> 寫了「理解+揭示關聯」✅</p>
                                        <p className="text-[#991B1B]">· <strong>⚠️ 缺 Q2 研究空缺</strong>——沒提到「前人研究過了嗎？哪裡還沒答到？」</p>
                                    </div>
                                </div>

                                {/* 範例 2 */}
                                <div className="bg-[var(--paper-warm)] border border-[var(--border)] rounded p-3">
                                    <p className="text-[12px] font-bold text-[var(--ink)] mb-1">📌 範例 2：遊戲對青少年社交的影響（虛擬與現實的冒險）</p>
                                    <p className="text-[12.5px] text-[var(--ink)] leading-[1.85] mb-2">
                                        <span className="bg-[#FEF3C7] px-0.5">遊戲對青少年的影響越來越大，不僅能夠帶來娛樂，還能從上面認識好友，青少年能從上頭認識朋友，也能因此失去現實世界的朋友。</span>
                                        <span className="bg-[#CFFAFE] px-0.5">這份報告是研究遊戲，究竟是拓寬社交圈，還是降低社交能力。</span>
                                    </p>
                                    <div className="text-[11px] text-[var(--ink-mid)] leading-relaxed space-y-0.5">
                                        <p>· <span className="bg-[#FEF3C7] px-1 font-bold text-[#92400E]">Q1 情境</span> 觀察具體（拓寬 vs 失去現實朋友）✅</p>
                                        <p>· <span className="bg-[#CFFAFE] px-1 font-bold text-[#075985]">Q3 解決什麼</span> 用「比較」動詞（究竟是 X 還是 Y）✅</p>
                                        <p className="text-[#991B1B]">· <strong>⚠️ 缺 Q2 研究空缺</strong>——沒提到 W7-W8 找的文獻說過什麼</p>
                                    </div>
                                </div>

                                {/* 補完 Q2 的示範 */}
                                <div className="bg-[#F0FDF4] border-2 border-[#86EFAC] rounded p-3">
                                    <p className="text-[12px] font-bold text-[#166534] mb-1">✨ 把範例 2 補完 Q2 後會長什麼樣（示範）</p>
                                    <p className="text-[12.5px] text-[var(--ink)] leading-[1.85] mb-2">
                                        <span className="bg-[#FEF3C7] px-0.5">遊戲對青少年的影響越來越大，能帶來娛樂、能認識朋友，也能因此失去現實世界的朋友。</span>
                                        <span className="bg-[#F5F3FF] px-0.5">前人研究多聚焦在「遊戲成癮」的負面，較少同時看「社交圈擴大」這個正面效果（Lee, 2020；陳明德, 2023）。</span>
                                        <span className="bg-[#CFFAFE] px-0.5">本研究想比較這兩種效果在高中生身上哪個比較強，做完可以給家長／導師具體判斷依據。</span>
                                    </p>
                                    <p className="text-[11px] text-[#166534] italic">
                                        💡 多了 1 句「前人研究說 ___，但 ___ 沒人答」的紫色段，動機就跟文獻對話了，學術味才出來。
                                    </p>
                                </div>

                                {/* ⚠️ 4 種學生最常犯的錯誤 */}
                                <div className="pt-3 border-t-2 border-dashed border-[#FCA5A5]">
                                    <p className="text-[13px] font-bold text-[#991B1B] mb-2">⚠️ 4 種學生最常踩的雷（依常犯程度排序）</p>

                                    {/* 雷 1 · 廢話型 */}
                                    <div className="bg-[#FEF2F2] border border-[#FCA5A5] rounded p-3 mb-2">
                                        <p className="text-[11.5px] font-bold text-[#991B1B] mb-1">🚫 雷 1 · 「廢話型」（最常見）</p>
                                        <p className="text-[12px] text-[var(--ink)] leading-[1.85] italic mb-1.5">「我對這個主題很有興趣，希望透過研究學到更多。」</p>
                                        <div className="text-[11px] text-[#7F1D1D] leading-relaxed space-y-0.5">
                                            <p>· ❌ <strong>Q1 缺</strong>：沒說「為什麼是你」想做（「有興趣」誰都能說）</p>
                                            <p>· ❌ <strong>Q2 缺</strong>：完全沒提文獻</p>
                                            <p>· ❌ <strong>Q3 缺</strong>：「學到更多」不是研究行動——做完到底解決了什麼？</p>
                                            <p className="text-[#92400E] italic">💡 改寫起手：把「有興趣」換成你<strong>具體看到的事</strong>（我看到 ___ 卻 ___）</p>
                                        </div>
                                    </div>

                                    {/* 雷 2 · 百科型 */}
                                    <div className="bg-[#FEF2F2] border border-[#FCA5A5] rounded p-3 mb-2">
                                        <p className="text-[11.5px] font-bold text-[#991B1B] mb-1">🚫 雷 2 · 「百科型」（抄統計／定義就停）</p>
                                        <p className="text-[12px] text-[var(--ink)] leading-[1.85] italic mb-1.5">「根據衛福部統計，台灣青少年焦慮比例近年上升。本研究希望探討高中生焦慮現象。」</p>
                                        <div className="text-[11px] text-[#7F1D1D] leading-relaxed space-y-0.5">
                                            <p>· ❌ <strong>Q1 缺</strong>：抄統計但沒個人觀察、沒「為什麼是你想做」</p>
                                            <p>· ❌ <strong>Q2 缺</strong>：引了一個數據但沒對話前人研究的「空缺」</p>
                                            <p>· △ <strong>Q3 半</strong>：「探討」太抽象（探討完要做什麼？比較？驗證？）</p>
                                            <p className="text-[#92400E] italic">💡 改寫起手：在統計後接「我自己／身邊朋友也 ___」的個人連結句</p>
                                        </div>
                                    </div>

                                    {/* 雷 3 · 個人化過度型 */}
                                    <div className="bg-[#FEF2F2] border border-[#FCA5A5] rounded p-3 mb-2">
                                        <p className="text-[11.5px] font-bold text-[#991B1B] mb-1">🚫 雷 3 · 「個人化過度型」（只對自己朋友有意義）</p>
                                        <p className="text-[12px] text-[var(--ink)] leading-[1.85] italic mb-1.5">「我朋友因為玩遊戲跟父母吵架，我想了解為什麼。」</p>
                                        <div className="text-[11px] text-[#7F1D1D] leading-relaxed space-y-0.5">
                                            <p>· ✅ <strong>Q1 OK</strong>：有具體個人觀察</p>
                                            <p>· ❌ <strong>Q2 缺</strong>：沒文獻——「了解為什麼」前人可能早有研究</p>
                                            <p>· ❌ <strong>Q3 缺</strong>：做完只對你朋友有意義？沒說對更廣的「青少年/家庭」研究有什麼貢獻</p>
                                            <p className="text-[#92400E] italic">💡 改寫起手：把「我朋友」擴成「我觀察到很多同學的家庭都 ___」</p>
                                        </div>
                                    </div>

                                    {/* 雷 4 · 現象列表型 */}
                                    <div className="bg-[#FEF2F2] border border-[#FCA5A5] rounded p-3">
                                        <p className="text-[11.5px] font-bold text-[#991B1B] mb-1">🚫 雷 4 · 「現象列表型」（列了一堆但沒人在裡面）</p>
                                        <p className="text-[12px] text-[var(--ink)] leading-[1.85] italic mb-1.5">「現代社群媒體 IG、Threads、TikTok 普及，許多研究顯示與焦慮相關。本研究探討此現象。」</p>
                                        <div className="text-[11px] text-[#7F1D1D] leading-relaxed space-y-0.5">
                                            <p>· △ <strong>Q1 半</strong>：列現象但沒「為什麼是你想做」</p>
                                            <p>· △ <strong>Q2 半</strong>：提了「許多研究」但沒指出「哪裡還沒答到」</p>
                                            <p>· ❌ <strong>Q3 缺</strong>：「探討此現象」說了等於沒說（探討什麼？比較？驗證？）</p>
                                            <p className="text-[#92400E] italic">💡 改寫起手：在「許多研究」後接「但 ___ 還沒人做」（具體指出空缺）</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </details>

                        {/* 擴寫鷹架（不在網頁寫，直接到 docx）*/}
                        <div className="bg-[var(--accent-light)] border-2 border-[var(--accent)] rounded-[var(--radius-unified)] p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <ContentTypeChip type="做" />
                                <p className="text-[13px] font-bold text-[var(--ink)]">✍️ 擴寫鷹架：把 W3 一句話擴成一段（4-6 句，3 問都要答）</p>
                            </div>
                            <p className="text-[12px] text-[var(--ink-mid)] leading-relaxed mb-3">
                                <strong className="text-[var(--accent)]">不在這頁寫</strong>——直接打開計畫書 docx 第一章「研究動機」段落，依下面 3 問擴寫：
                            </p>
                            <div className="bg-white border border-[var(--border)] rounded-[6px] p-3">
                                <ul className="text-[12px] text-[var(--ink-mid)] leading-[1.85] list-none space-y-1.5">
                                    <li><span className="font-mono font-bold text-[var(--accent)] mr-2">Q1</span><strong>情境／理由</strong>：我看到 ___／我自己經歷 ___，所以想研究 ___</li>
                                    <li><span className="font-mono font-bold text-[var(--accent)] mr-2">Q2</span><strong>研究空缺</strong>：W7-W8 找的文獻說 ___，但 ___ 還沒人答</li>
                                    <li><span className="font-mono font-bold text-[var(--accent)] mr-2">Q3</span><strong>解決什麼</strong>：這份研究會 ___（說清楚／驗證／比較／探索）___，做完對 ___ 有貢獻／有意義</li>
                                </ul>
                            </div>
                        </div>
                        <div className="bg-[#FFFBEB] border border-[#FCD34D] rounded p-2.5 mt-2 text-[11px] text-[#92400E] leading-relaxed">
                            🔁 <strong>提醒：</strong>這 4 種錯誤（廢話型／百科型／個人化過度／現象列表型），<strong>計畫書第四章寫「變項」時也常踩</strong>——例：「學習動機」別只寫「同學都很投入」（廢話型），要具體可測量（每週主動學習時數／主動找老師問問題的次數）。
                        </div>
                    </div>
                        </div>
                    )}

                    {/* ═══ tab 二：第二章 操作型定義 ═══ */}
                    {chapterTab === 'ch2' && (
                        <div className="space-y-4">
                            <div className="bg-[#FFFBEB] border-l-4 border-[#D97706] rounded-r-[6px] p-3">
                                <div className="flex items-center gap-2 mb-1">
                                    <ContentTypeChip type="注意" />
                                    <p className="text-[12.5px] font-bold text-[#92400E]">🔍 先判斷：關鍵詞變了沒？</p>
                                </div>
                                <p className="text-[12px] text-[#78350F] leading-[1.8]">
                                    你們組現在的題目，跟你 W5 寫操作型定義時<strong>一樣嗎</strong>？一樣 → W5 那幾個關鍵詞的操作定義可直接搬進第二章；題目變了 → 關鍵詞要<strong>重挑、重新定義</strong>，別硬搬舊的。
                                </p>
                                <p className="text-[11.5px] text-[#92400E] mt-2 pt-2 border-t border-[#D97706]/30 leading-relaxed">
                                    ⚠️ <strong>W5 是練習稿，不是定稿</strong>——即使題目沒變，搬進第二章前也建議對照「<strong>三件事：可測量、有正反例、前後一致</strong>」精修一次。W5 的品質夠好才直接搬，不夠好就在 docx 裡就地改寫。
                                </p>
                            </div>
                            <div className="bg-white border border-[var(--border)] rounded-[var(--radius-unified)] p-4">
                                <p className="text-[13px] font-bold text-[var(--ink)] mb-1.5">📐 第二章怎麼寫</p>
                                <p className="text-[12.5px] text-[var(--ink-mid)] leading-[1.85]">
                                    把題目裡的<strong>關鍵詞</strong>（抽象的那幾個，例：壓力、動機、學習效果）變成「<strong>別人照著也能測</strong>」的具體定義。三件事缺一不可：<strong>可測量</strong>、<strong>有正反例</strong>、<strong>前後一致</strong>。第二章至少寫 3 個關鍵詞。
                                </p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                <div className="bg-[#FEF2F2] border border-[#FCA5A5] rounded p-3">
                                    <p className="text-[11px] font-mono font-bold text-[#991B1B] mb-1">❌ 別這樣</p>
                                    <p className="text-[12px] text-[var(--ink)] leading-relaxed">「壓力大」——抽象、沒法測，每個人定義都不同。</p>
                                </div>
                                <div className="bg-[#F0FDF4] border border-[#86EFAC] rounded p-3">
                                    <p className="text-[11px] font-mono font-bold text-[#166534] mb-1">✅ 這樣才對</p>
                                    <p className="text-[12px] text-[var(--ink)] leading-relaxed">「過去一週超過 3 次熬夜過 12 點」——具體、可數，誰來測都一樣。</p>
                                </div>
                            </div>
                            <div className="bg-[var(--accent-light)] border border-[var(--accent)] rounded-[var(--radius-unified)] p-3 text-[12px] text-[var(--ink)] leading-relaxed">
                                ✍️ <strong>去 docx 寫：</strong>計畫書<strong>第二章</strong>填 3 個關鍵詞 + 每個的操作定義。忘記怎麼操作化？回 <Link to="/w5" target="_blank" rel="noopener noreferrer" className="text-[var(--accent)] font-bold underline">W5 操作型定義</Link> 複習。
                            </div>
                        </div>
                    )}

                    {/* ═══ tab 三：第三章 文獻回顧 ═══ */}
                    {chapterTab === 'ch3' && (
                        <div className="space-y-4">
                            <div className="bg-[#FFFBEB] border-l-4 border-[#D97706] rounded-r-[6px] p-3">
                                <div className="flex items-center gap-2 mb-1">
                                    <ContentTypeChip type="注意" />
                                    <p className="text-[12.5px] font-bold text-[#92400E]">🔍 先判斷：文獻對得上新題目嗎？</p>
                                </div>
                                <p className="text-[12px] text-[#78350F] leading-[1.8]">
                                    你 W7-W8 找的文獻，跟組內現在的題目<strong>對得上嗎</strong>？對得上 → 直接整理進第三章；W6 合題後題目變了、文獻對不上 → 標「待補」，課後分工重查（<strong>課堂 50 分鐘塞不下重查</strong>，別硬擠）。
                                </p>
                            </div>
                            <div className="bg-white border border-[var(--border)] rounded-[var(--radius-unified)] p-4">
                                <p className="text-[13px] font-bold text-[var(--ink)] mb-1.5">📐 第三章怎麼寫</p>
                                <p className="text-[12.5px] text-[var(--ink-mid)] leading-[1.85]">
                                    文獻不是擺著、是要<strong>對話</strong>：他怎麼說 → 我怎麼接 → 我怎麼補。最少 2-3 篇 A/B 級文獻，每篇寫清楚「作者、年份、發現」，再寫「跟我的研究差在哪」。
                                </p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                <div className="bg-[#FEF2F2] border border-[#FCA5A5] rounded p-3">
                                    <p className="text-[11px] font-mono font-bold text-[#991B1B] mb-1">❌ 別這樣</p>
                                    <p className="text-[12px] text-[var(--ink)] leading-relaxed">把三篇摘要原文貼上、各自獨立——這是「剪貼簿」，不是文獻回顧。</p>
                                </div>
                                <div className="bg-[#F0FDF4] border border-[#86EFAC] rounded p-3">
                                    <p className="text-[11px] font-mono font-bold text-[#166534] mb-1">✅ 這樣才對</p>
                                    <p className="text-[12px] text-[var(--ink)] leading-relaxed">「A 發現 X；B 也支持，但只看了 Y；我的研究要補上 Z」——三篇串成一段論述。</p>
                                </div>
                            </div>
                            <div className="bg-[var(--accent-light)] border border-[var(--accent)] rounded-[var(--radius-unified)] p-3 text-[12px] text-[var(--ink)] leading-relaxed">
                                ✍️ <strong>去 docx 寫：</strong>計畫書<strong>第三章</strong>先寫骨架（2 篇也行），不夠的標「待補」。詳細的「課堂內怎麼辦／課後分工查／3 步速查」在 <strong>Step 3 文獻策略卡</strong>。複習：<Link to="/w7" target="_blank" rel="noopener noreferrer" className="text-[var(--accent)] font-bold underline">W7</Link>／<Link to="/w8" target="_blank" rel="noopener noreferrer" className="text-[var(--accent)] font-bold underline">W8</Link>。
                            </div>
                        </div>
                    )}

                    {/* ═══ tab 四：第四章 變項／主題／維度（method-aware）═══ */}
                    {chapterTab === 'ch4' && (
                        <div className="space-y-4">
                            <div className="bg-[#FFFBEB] border-l-4 border-[#D97706] rounded-r-[6px] p-3">
                                <div className="flex items-center gap-2 mb-1">
                                    <ContentTypeChip type="注意" />
                                    <p className="text-[12.5px] font-bold text-[#92400E]">🔍 先判斷：方法變了沒？</p>
                                </div>
                                <p className="text-[12px] text-[#78350F] leading-[1.8]">
                                    第四章<strong>跟方法綁死</strong>——方法變了，整個第四章重想。組內合議的方法跟你 W4 個人選的<strong>一樣嗎</strong>？一樣 → 照下面你的方法卡寫；變了 → 第四章的變項／主題／維度全部要照新方法重拆。
                                </p>
                            </div>
                    {/* 第四章核心概念：依方法分流（method-aware）+ 每個術語白話解釋 */}
                    <div className="p-4 rounded-[var(--radius-unified)] border-2 border-[#BFDBFE] bg-[#EFF6FF] max-w-[760px]">
                        <div className="flex items-center gap-2 mb-2">
                            <ContentTypeChip type="學" />
                            <p className="text-[13px] font-bold text-[#1E40AF]">📖 你的計畫書「第四章」要寫什麼？</p>
                        </div>
                        <p className="text-[12px] text-[#1E3A8A] leading-relaxed mb-3">
                            五種研究方法的第四章<strong>名稱與核心概念都不一樣</strong>——這是研究方法論的本質差異，不是用詞偏好。下方依你選的方法顯示對應內容；想看其他方法可展開最下方對照表。
                        </p>

                        {!selectedMethod && (
                            <div className="bg-[#FEF3C7] border-2 border-[#F59E0B] rounded-[var(--radius-unified)] p-3 mb-3 text-[12px] text-[#92400E] leading-relaxed">
                                ⚠️ 還沒選方法 —— 請先在<strong>Step 1 的「組內合議方法」區</strong>選一個方法（會同步顯示這裡）。想先看 5 法第四章長什麼樣？展開最下方「5 法對照表」。
                            </div>
                        )}

                        {/* 問卷組 */}
                        {selectedMethod === 'questionnaire' && (
                            <div className="bg-white border-2 border-[#3B82F6] rounded p-3 mb-3">
                                <p className="text-[13px] font-bold text-[#1E40AF] mb-2">📋 你的第四章：<span className="text-[#1D4ED8]">變項設計</span></p>
                                <p className="text-[11.5px] text-[#1E3A8A] leading-relaxed mb-2.5">問卷研究的核心是「找變項之間的關係」。</p>
                                <div className="bg-[#EFF6FF] border-l-4 border-[#1D4ED8] rounded-r p-2.5 mb-3 text-[11.5px] text-[#1E3A8A] leading-relaxed">
                                    <p className="font-bold text-[#1D4ED8] mb-0.5">📌 想像你的研究是這樣：</p>
                                    <p><strong>研究題目</strong>：高中生睡眠品質會影響段考成績嗎？</p>
                                    <p className="mt-1"><strong>想測什麼？</strong>我想知道「睡得好不好」會不會影響「考得好不好」——但成績可能也受年級、補習等其他因素影響，所以要把那些當背景變項記下來。</p>
                                </div>
                                <div className="space-y-2 text-[11.5px]">
                                    <div className="border-l-3 border-[#7C3AED] bg-[#F5F3FF] p-2.5 rounded-r">
                                        <p className="font-bold text-[#5B21B6] mb-0.5">🎯 依變項<span className="font-normal text-[#7C3AED]"> — 你想解釋的結果（被影響的東西）</span></p>
                                        <p className="text-[#4C1D95] italic">例：段考三科平均成績</p>
                                    </div>
                                    <div className="border-l-3 border-[#2563EB] bg-[#EFF6FF] p-2.5 rounded-r">
                                        <p className="font-bold text-[#1E40AF] mb-0.5">🎛️ 自變項<span className="font-normal text-[#2563EB]"> — 你猜會影響結果的因子</span></p>
                                        <p className="text-[#1E3A8A] italic">例：自評睡眠品質（5 點量表問入睡困難、夜間醒來、起床精神狀況等，整理成睡眠品質分數）</p>
                                    </div>
                                    <div className="border-l-3 border-[#059669] bg-[#F0FDF4] p-2.5 rounded-r">
                                        <p className="font-bold text-[#065F46] mb-0.5">👤 背景變項<span className="font-normal text-[#059669]"> — 個人屬性，可能也影響結果</span></p>
                                        <p className="text-[#047857] italic">例：年級（高一/高二/高三）、性別、每週補習時數</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 訪談組 */}
                        {selectedMethod === 'interview' && (
                            <div className="bg-white border-2 border-[#7C3AED] rounded p-3 mb-3">
                                <p className="text-[13px] font-bold text-[#5B21B6] mb-2">🎤 你的第四章：<span className="text-[#6D28D9]">訪談主題框架</span></p>
                                <div className="bg-[#F5F3FF] border-l-4 border-[#6D28D9] rounded-r p-2.5 mb-3 text-[11.5px] text-[#4C1D95] leading-relaxed">
                                    <p className="font-bold text-[#6D28D9] mb-0.5">📌 想像你的研究是這樣：</p>
                                    <p><strong>研究題目</strong>：高一學生的補習動機從哪裡來？</p>
                                    <p className="mt-1"><strong>想測什麼？</strong>我想了解學生「為什麼決定要補」——這不是用次數可以測的，要聽學生自己說背後故事。</p>
                                </div>
                                <p className="text-[11.5px] text-[#4C1D95] leading-relaxed mb-2"><strong>訪談主題框架</strong>（事先擬 3-5 個追問方向，每個主題在第六章會展開成一組訪談題）：</p>
                                <div className="space-y-2 text-[11.5px]">
                                    <div className="border-l-3 border-[#7C3AED] bg-[#F5F3FF] p-2.5 rounded-r">
                                        <p className="font-bold text-[#5B21B6] mb-0.5">📌 主題 1：家長期待</p>
                                        <p className="text-[#4C1D95]">主問：「爸媽有跟你討論過要不要補習嗎？他們怎麼說？」</p>
                                        <p className="text-[#5B21B6] italic">追問：「他們的態度是建議還是要求？」「你怎麼回應？」</p>
                                    </div>
                                    <div className="border-l-3 border-[#7C3AED] bg-[#F5F3FF] p-2.5 rounded-r">
                                        <p className="font-bold text-[#5B21B6] mb-0.5">📌 主題 2：同儕壓力</p>
                                        <p className="text-[#4C1D95]">主問：「你們班大概多少人在補？」</p>
                                        <p className="text-[#5B21B6] italic">追問：「不補的人後來怎麼了？」「你會擔心被比下去嗎？」</p>
                                    </div>
                                    <div className="border-l-3 border-[#7C3AED] bg-[#F5F3FF] p-2.5 rounded-r">
                                        <p className="font-bold text-[#5B21B6] mb-0.5">📌 主題 3：自我需求</p>
                                        <p className="text-[#4C1D95]">主問：「你自己覺得補習在解決什麼？」</p>
                                        <p className="text-[#5B21B6] italic">追問：「不補你覺得會發生什麼？」「補了之後真的有解決嗎？」</p>
                                    </div>
                                </div>
                                <div className="bg-[#FEF3C7] border-l-3 border-[#F59E0B] rounded-r p-2.5 mt-2 text-[11px] text-[#92400E] leading-relaxed">
                                    ⚠️ <strong>訪談 ≠ 開放式問卷</strong>：訪談不是為了統計「多少人這樣想」，而是為了<strong>理解學生如何描述自己的選擇理由與經驗</strong>。主題是事先預判訪談會聽到的方向，但實際訪談中可能浮現新主題（例如某學生講「補習班朋友」）——質性研究允許主題邊訪邊調整。
                                </div>
                            </div>
                        )}

                        {/* 實驗組 */}
                        {selectedMethod === 'experiment' && (
                            <div className="bg-white border-2 border-[#DC2626] rounded p-3 mb-3">
                                <p className="text-[13px] font-bold text-[#991B1B] mb-2">🧪 你的第四章：<span className="text-[#B91C1C]">變項設計（自/依/控制）</span></p>
                                <div className="bg-[#FEF2F2] border-l-4 border-[#B91C1C] rounded-r p-2.5 mb-3 text-[11.5px] text-[#7F1D1D] leading-relaxed">
                                    <p className="font-bold text-[#B91C1C] mb-0.5">📌 想像你的研究是這樣：</p>
                                    <p><strong>研究題目</strong>：聽古典音樂能提升短期記憶嗎？</p>
                                    <p className="mt-1"><strong>想測什麼？</strong>「聽音樂」這個動作會不會直接影響記憶分數——所以要分兩組（一組聽、一組不聽），其他條件都一樣，才能說分數差異真的是音樂造成的。</p>
                                    <p className="mt-1.5 text-[#92400E] bg-[#FEF3C7] border-l-2 border-[#F59E0B] pl-2 py-1">⚠️ 注意：「古典音樂是否能提升記憶」<strong>不是已知答案</strong>，而是這個實驗要驗證的假設（莫札特效應在學界仍有爭議）。</p>
                                </div>
                                <div className="space-y-2 text-[11.5px]">
                                    <div className="border-l-3 border-[#2563EB] bg-[#EFF6FF] p-2.5 rounded-r">
                                        <p className="font-bold text-[#1E40AF] mb-0.5">🎛️ 自變項<span className="font-normal text-[#2563EB]"> — 你動手調整的</span></p>
                                        <p className="text-[#1E3A8A] italic">例：是否聽古典音樂（實驗組聽 5 分鐘莫札特、對照組安靜 5 分鐘）</p>
                                    </div>
                                    <div className="border-l-3 border-[#7C3AED] bg-[#F5F3FF] p-2.5 rounded-r">
                                        <p className="font-bold text-[#5B21B6] mb-0.5">📈 依變項<span className="font-normal text-[#7C3AED]"> — 測量的結果</span></p>
                                        <p className="text-[#4C1D95] italic">例：5 分鐘後的單字記憶測驗分數（給 20 個單字背 1 分鐘、3 分鐘後測幾個記得）</p>
                                    </div>
                                    <div className="border-l-3 border-[#059669] bg-[#F0FDF4] p-2.5 rounded-r">
                                        <p className="font-bold text-[#065F46] mb-0.5">🔒 控制變項<span className="font-normal text-[#059669]"> — 保持一樣，避免干擾</span></p>
                                        <p className="text-[#047857] italic">例：同一份測驗、同一間教室、同一個時段、同樣的指導語</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 觀察組 */}
                        {selectedMethod === 'observation' && (
                            <div className="bg-white border-2 border-[#059669] rounded p-3 mb-3">
                                <p className="text-[13px] font-bold text-[#065F46] mb-2">👁️ 你的第四章：<span className="text-[#047857]">觀察維度設計</span></p>
                                <div className="bg-[#F0FDF4] border-l-4 border-[#047857] rounded-r p-2.5 mb-3 text-[11.5px] text-[#065F46] leading-relaxed">
                                    <p className="font-bold text-[#047857] mb-0.5">📌 想像你的研究是這樣：</p>
                                    <p><strong>研究題目</strong>：高中生在圖書館的讀書效率行為差異</p>
                                    <p className="mt-1"><strong>想測什麼？</strong>學生「真的在讀書還是滑手機」——直接問可能說謊，所以要直接觀察行為。</p>
                                </div>
                                <p className="text-[11.5px] text-[#065F46] leading-relaxed mb-2">觀察研究依「參與 vs 非參與」分兩種記錄方式：</p>
                                <div className="space-y-2 text-[11.5px]">
                                    <div className="border-l-3 border-[#059669] bg-[#F0FDF4] p-2.5 rounded-r">
                                        <p className="font-bold text-[#065F46] mb-0.5">📋 編碼類別<span className="font-normal text-[#059669]"> — 非參與觀察用，把行為分類的標籤</span></p>
                                        <p className="text-[#047857]">例：學生在圖書館的行為 → <strong>持續閱讀</strong>（看書/抄筆記，超過 30 秒）／ <strong>短暫分心</strong>（看窗外、跟朋友講話 10-30 秒）／ <strong>滑手機</strong>（拿出手機超過 30 秒）／ <strong>離開座位</strong></p>
                                    </div>
                                    <div className="border-l-3 border-[#0EA5E9] bg-[#F0F9FF] p-2.5 rounded-r">
                                        <p className="font-bold text-[#075985] mb-0.5">📌 關鍵事件記錄維度<span className="font-normal text-[#0EA5E9]"> — 參與觀察用，每件事要記的欄位</span></p>
                                        <p className="text-[#0C4A6E] italic">例：發生時間／參與者／情境／反應</p>
                                    </div>
                                    <div className="border-l-3 border-[#D97706] bg-[#FEF3C7] p-2.5 rounded-r">
                                        <p className="font-bold text-[#92400E] mb-0.5">📦 觀察單位<span className="font-normal text-[#D97706]"> — 你不是觀察「整個圖書館氣氛」，是記錄可判斷、可編碼的單位</span></p>
                                        <p className="text-[#78350F] italic">例：一名學生在某一個 5 分鐘時間點的主要行為（時間取樣，1 小時 → 12 筆 × 30 個學生 = 360 筆）</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 文獻組 */}
                        {selectedMethod === 'literature' && (
                            <div className="bg-white border-2 border-[#D97706] rounded p-3 mb-3">
                                <p className="text-[13px] font-bold text-[#92400E] mb-2">📚 你的第四章：<span className="text-[#B45309]">分析架構</span></p>
                                <div className="bg-[#FEF3C7] border-l-4 border-[#B45309] rounded-r p-2.5 mb-3 text-[11.5px] text-[#78350F] leading-relaxed">
                                    <p className="font-bold text-[#B45309] mb-0.5">📌 想像你的研究是這樣：</p>
                                    <p><strong>研究題目</strong>：YouTuber 影片標題的「下標套路」十年來怎麼變？</p>
                                    <p className="mt-1"><strong>想測什麼？</strong>想看 2014 vs 2024 的 YouTuber 標題差在哪——是不是變得更「煽動」？</p>
                                    <p className="mt-1.5 text-[#7F1D1D] bg-[#FEE2E2] border-l-2 border-[#DC2626] pl-2 py-1">⚠️ <strong>文獻組 ≠ 上網查資料寫摘要</strong>：這裡是把<strong>既有文本（影片標題、新聞、貼文、書籍、報導）當作分析對象</strong>，不是只整理別人的研究。文獻回顧（第三章）才是「整理前人研究」，第四章是「分析這些資料」。</p>
                                </div>
                                <p className="text-[11.5px] text-[#78350F] leading-relaxed mb-2">文獻分析依子類型（歷史 / 內容 / 論述 / 敘事）有不同架構——共同骨架是「維度 × 單位 × 編碼」：</p>
                                <div className="space-y-2 text-[11.5px]">
                                    <div className="border-l-3 border-[#D97706] bg-[#FEF3C7] p-2.5 rounded-r">
                                        <p className="font-bold text-[#92400E] mb-0.5">📐 分析維度<span className="font-normal text-[#D97706]"> — 看每筆資料時抓的比較欄位</span></p>
                                        <p className="text-[#78350F] italic">例：研究 YouTuber 標題 → 有沒有<strong>數字</strong>（「3 個秘密」）／ <strong>情緒詞</strong>（「震驚」「崩潰」）／ <strong>問句</strong>（「你還在⋯⋯嗎？」）／ <strong>視覺符號</strong>（emoji、★【】）這 4 個維度</p>
                                    </div>
                                    <div className="border-l-3 border-[#B45309] bg-[#FEF3C7] p-2.5 rounded-r">
                                        <p className="font-bold text-[#92400E] mb-0.5">📦 分析單位<span className="font-normal text-[#B45309]"> — 你用多大顆粒度當「一筆資料」</span></p>
                                        <p className="text-[#78350F] italic">例：一個影片標題（不是整支影片）</p>
                                    </div>
                                    <div className="border-l-3 border-[#92400E] bg-[#FEF3C7] p-2.5 rounded-r">
                                        <p className="font-bold text-[#92400E] mb-0.5">🏷️ 編碼表<span className="font-normal text-[#92400E]"> — 把資料分類的工具</span></p>
                                        <p className="text-[#78350F] italic">例：每個標題勾選有沒有上面 4 個維度 → 最後比 2014 vs 2024 的比例差異</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 5 法對照表（收合）*/}
                        <details className="bg-white border border-[#BFDBFE] rounded p-2.5 mb-2">
                            <summary className="cursor-pointer text-[11.5px] font-bold text-[#1E40AF]">📊 想看其他方法的第四章長什麼樣？</summary>
                            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px]">
                                {[
                                    { m: '📋 問卷', sec: '變項設計', core: '依變項 / 自變項 / 背景變項', ex: '滑手機時數 → 自評睡眠品質' },
                                    { m: '🎤 訪談', sec: '訪談主題框架', core: '主題 1/2/3（每個下面 1 主問 + 2-3 追問）', ex: '補習動機 → 家長期待 / 同儕壓力 / 自我需求' },
                                    { m: '🧪 實驗', sec: '變項設計', core: '自變項 / 依變項 / 控制變項', ex: '是否聽音樂 → 記憶測驗分數' },
                                    { m: '👁️ 觀察', sec: '觀察維度設計', core: '編碼類別（非參與）/ 關鍵事件維度（參與）', ex: '分心行為 → 滑手機 / 講話 / 看窗外' },
                                    { m: '📚 文獻', sec: '分析架構', core: '分析維度 / 分析單位 / 編碼表', ex: 'YouTuber 標題 → 數字 / 情緒詞 / 問句 / 視覺符號' },
                                ].map((r, i) => (
                                    <div key={i} className="bg-[#F9FAFB] border border-[#E5E7EB] rounded p-2">
                                        <p className="font-bold text-[#1E40AF] mb-0.5">{r.m} <span className="text-[#6B7280] font-normal">第四章「{r.sec}」</span></p>
                                        <p className="text-[#1E3A8A]"><span className="font-bold">核心：</span>{r.core}</p>
                                        <p className="text-[#5B21B6] italic mt-0.5">例：{r.ex}</p>
                                    </div>
                                ))}
                            </div>
                        </details>

                        {/* 進階：質性 vs 量化方法論差異 */}
                        <details className="bg-white border border-[#BFDBFE] rounded p-2.5">
                            <summary className="cursor-pointer text-[11.5px] font-bold text-[#1E40AF]">📖 進階：為什麼用詞不一樣？（質性 vs 量化）</summary>
                            <p className="text-[11px] text-[#1E3A8A] leading-relaxed mt-2">
                                <strong>變項</strong>（量化）：研究者<strong>事先操作或測量</strong>的屬性。先定變項 → 收資料 → 看變項間關係。用於問卷、實驗。
                                <br />
                                <strong>主題</strong>（質性）：從資料中<strong>歸納浮現</strong>的「意義模式」（學界稱為「主題分析法」）。先定研究主題 → 訪談 → 編碼歸納主題。用於訪談、焦點團體。
                                <br />
                                <strong>維度</strong>（兩者皆可）：構念的子層面或分析的軸向。觀察的編碼類別、文獻的分析欄位都屬此類。
                                <br />
                                <strong>本質差異</strong>：量化先有變項再收資料；質性是先收資料、主題從資料浮現。所以叫法不能合一。
                            </p>
                        </details>
                    </div>
                        </div>
                    )}

                    {/* ═══ tab 五：第五章 對象／抽樣 ═══ */}
                    {chapterTab === 'ch5' && (
                        <div className="space-y-4">
                            <div className="bg-[#FFFBEB] border-l-4 border-[#D97706] rounded-r-[6px] p-3">
                                <div className="flex items-center gap-2 mb-1">
                                    <ContentTypeChip type="注意" />
                                    <p className="text-[12.5px] font-bold text-[#92400E]">🔍 先判斷：研究對象變了沒？</p>
                                </div>
                                <p className="text-[12px] text-[#78350F] leading-[1.8]">
                                    組內現在要研究的對象，跟你 W6 路線決定時想的<strong>一樣嗎</strong>？一樣 → 直接寫進第五章；合題後對象範圍變了（例：從「我們班」變「全校高一」）→ 人數、抽樣方式都要跟著重想。
                                </p>
                            </div>
                            <div className="bg-white border border-[var(--border)] rounded-[var(--radius-unified)] p-4">
                                <p className="text-[13px] font-bold text-[var(--ink)] mb-1.5">📐 第五章怎麼寫</p>
                                <p className="text-[12.5px] text-[var(--ink-mid)] leading-[1.85]">
                                    三件都要寫：<strong>為什麼是這群人</strong>／<strong>幾人</strong>／<strong>怎麼找</strong>。隨機抽樣＝每人被抽中機率一樣（最理想、最難做）；方便抽樣＝就近找得到的人（高中專題最常用、合法）——用方便抽樣要老實標，別假裝隨機。
                                </p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                <div className="bg-[#FEF2F2] border border-[#FCA5A5] rounded p-3">
                                    <p className="text-[11px] font-mono font-bold text-[#991B1B] mb-1">❌ 別這樣</p>
                                    <p className="text-[12px] text-[var(--ink)] leading-relaxed">只發給自己班 30 人，卻寫「隨機抽樣」——那是方便抽樣，假裝隨機會被抓。</p>
                                </div>
                                <div className="bg-[#F0FDF4] border border-[#86EFAC] rounded p-3">
                                    <p className="text-[11px] font-mono font-bold text-[#166534] mb-1">✅ 這樣才對</p>
                                    <p className="text-[12px] text-[var(--ink)] leading-relaxed">「方便抽樣：本校高一 2 班共 60 人，因為是研究者可接觸範圍」——老實標、說清楚為什麼。</p>
                                </div>
                            </div>
                            <div className="bg-[var(--accent-light)] border border-[var(--accent)] rounded-[var(--radius-unified)] p-3 text-[12px] text-[var(--ink)] leading-relaxed">
                                ✍️ <strong>去 docx 寫：</strong>計畫書<strong>第五章</strong>填對象 + 預計人數 + 抽樣方式。docx 已預填「分層／隨機／方便」三種抽樣說明，挑一種。複習：<Link to="/w5" target="_blank" rel="noopener noreferrer" className="text-[var(--accent)] font-bold underline">W5 對象與抽樣</Link>。
                            </div>
                        </div>
                    )}

                    <div className="w7-notice w7-notice-teal">
                        ✅ 五章都看過、docx 寫到雛形 → 下一步：Step 3 計畫書組裝工作流（分章工作流 + 模板 + 進度分級）。
                    </div>
                </div>
            ),
        },

        /* ─── Step 3：計畫書組裝工作流（分工 + 模板 + 章節地圖 + 進度分級） ─── */
        {
            title: '計畫書組裝工作流',
            icon: '✍️',
            content: (
                <div className="space-y-8 prose-zh">
                    <StepBriefing
                        lines={[
                            { label: '做', text: '組內分工：第一章全組共識、二~五章分章平行進行，把 1-5 章寫到雛形' },
                        ]}
                    />
                    {/* 開場 */}
                    <p className="text-[14px] text-[var(--ink-mid)] leading-relaxed max-w-[720px]">
                        看完 Step 2 五章寫法導引後，這裡是組裝工作流：先分工、再依方法挑模板，把計畫書 1-5 章寫到雛形。第六章工具設計留到 W10。
                    </p>

                    {/* 🤝 小組分章工作流（避免全組擠在第一章、解決時間不夠的真實問題） */}
                    <div className="p-5 rounded-[var(--radius-unified)] border-2 border-[#0EA5E9] bg-[#F0F9FF] max-w-[720px]">
                        <div className="flex items-center gap-2 mb-2">
                            <ContentTypeChip type="做" />
                            <p className="text-[14px] font-bold text-[#075985]">🤝 50 分鐘要寫五章——分章工作流（不要全組擠著寫第一章）</p>
                        </div>
                        <p className="text-[12.5px] text-[#0C4A6E] leading-relaxed mb-3">
                            每章寫到「<strong>雛形</strong>」就 OK——能看出方向、邏輯通順但還粗糙。<strong>不用追求完美</strong>，下節 W10 還會再修一輪。
                        </p>
                        <GroupSizeSelector
                            items={{
                                1: {
                                    title: '1 人（Solo）',
                                    content: (
                                        <ul className="list-disc pl-4 space-y-0.5">
                                            <li>第 1、3 章先寫到雛形（最關鍵）</li>
                                            <li>第 2、4、5 章列大綱</li>
                                            <li>下節 W10 前找老師個別對焦</li>
                                        </ul>
                                    ),
                                },
                                2: {
                                    title: '2 人組',
                                    content: (
                                        <ul className="list-disc pl-4 space-y-0.5">
                                            <li>A：第 1-3 章（題目／文獻／方法）</li>
                                            <li>B：第 4-5 章（變項／對象）+ 統整</li>
                                        </ul>
                                    ),
                                },
                                3: {
                                    title: '3 人組',
                                    content: (
                                        <ul className="list-disc pl-4 space-y-0.5">
                                            <li>A：第 1-2 章（題目 + 文獻）</li>
                                            <li>B：第 3-4 章（方法 + 變項）</li>
                                            <li>C：第 5 章 + 統整／同步檢查邏輯一致</li>
                                        </ul>
                                    ),
                                },
                                4: {
                                    title: '4 人組',
                                    content: (
                                        <ul className="list-disc pl-4 space-y-0.5">
                                            <li>A：第 1 章（題目／動機／問題）</li>
                                            <li>B：第 2 章（文獻探討）</li>
                                            <li>C：第 3-4 章（方法 + 變項）</li>
                                            <li>D：第 5 章 + 統整／跨章邏輯檢查</li>
                                        </ul>
                                    ),
                                },
                            }}
                        />
                        <p className="text-[11.5px] text-[#0C4A6E] leading-relaxed mt-3 pt-2 border-t border-[#0EA5E9]/30">
                            ⏱️ <strong>時間建議</strong>：前 5 分鐘分工 + 對齊整體方向 → 各自寫 30 分鐘 → 最後 10 分鐘互讀統整。
                        </p>
                    </div>

                                        {/* 📚 文獻策略卡（承認 W6 合題後 W7 找的文獻可能失效） */}
                    <div className="p-5 rounded-[var(--radius-unified)] border-2 border-[#D97706] bg-[#FEF3C7] max-w-[720px]">
                        <div className="flex items-center gap-2 mb-2">
                            <ContentTypeChip type="注意" />
                            <p className="text-[14px] font-bold text-[#92400E]">📚 第三章文獻怎麼處理？（W6 合題後 W7 找的文獻可能要重查）</p>
                        </div>
                        <p className="text-[12.5px] text-[#78350F] leading-relaxed mb-3">
                            如果你 W6 合題後題目跟原本差很多，W7 找的文獻就**對不上新題目**了。這是合理現象——但<strong>課堂時間 50 分鐘塞不下「重新查文獻」</strong>。
                        </p>
                        <div className="bg-white border border-[#D97706]/30 rounded-[6px] p-3 mb-2">
                            <p className="text-[12px] font-bold text-[#92400E] mb-1">⏱️ 課堂內怎麼辦？</p>
                            <ul className="text-[11.5px] text-[#78350F] leading-[1.7] list-disc pl-4 space-y-0.5">
                                <li>用 W7 既有文獻先寫第三章「方向骨架」（哪怕只 1 篇也行）</li>
                                <li>不夠的部分標註「待補」<strong>不要硬擠時間查</strong></li>
                                <li>進度自評勾「方向」或「雛形」即可，AI 檢核會給對應深度的回饋</li>
                            </ul>
                        </div>
                        <div className="bg-white border border-[#D97706]/30 rounded-[6px] p-3">
                            <p className="text-[12px] font-bold text-[#92400E] mb-1">🏠 課後分工查文獻（W10 前完成）</p>
                            <ul className="text-[11.5px] text-[#78350F] leading-[1.7] list-disc pl-4 space-y-0.5">
                                <li><strong>3 人組</strong>：每人查 1 篇符合新題目的 A/B 級文獻 → 共 3 篇</li>
                                <li><strong>2 人組</strong>：每人查 1-2 篇 → 共 2-4 篇</li>
                                <li><strong>Solo</strong>：自己查 2 篇 + 帶到下次老師對焦</li>
                                <li>關鍵字參考 AI 檢核回覆裡會給的「3 個搜尋組合」（在 Prompt 第 4 條已要求 AI 列）</li>
                            </ul>
                        </div>
                        {/* 📖 還沒學過怎麼查？mini 教學 */}
                        <details className="mt-3 rounded-[var(--radius-unified)] border border-[#D97706]/40 bg-white">
                            <summary className="cursor-pointer px-3 py-2 hover:bg-[#FEF3C7] transition-colors flex items-center gap-2">
                                <span className="text-[12px] font-bold text-[#92400E]">📖 還沒學過怎麼查文獻？點開看 3 步速查</span>
                                <span className="ml-auto text-[10px] font-mono text-[#92400E]">▼</span>
                            </summary>
                            <div className="border-t border-[#D97706]/30 px-4 py-3 space-y-2 text-[11.5px] text-[#78350F] leading-relaxed">
                                <p><strong>Step 1 · 工具選一個</strong>：</p>
                                <div className="flex flex-wrap gap-2 mb-2">
                                    <a href="https://www.airitilibrary.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 bg-[#D97706] text-white px-3 py-1.5 rounded font-bold text-[11.5px] hover:opacity-90 no-underline">🔗 開啟華藝</a>
                                    <a href="https://scholar.google.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 bg-[#D97706] text-white px-3 py-1.5 rounded font-bold text-[11.5px] hover:opacity-90 no-underline">🔗 開啟 Google Scholar</a>
                                </div>
                                <ul className="list-disc pl-5 space-y-0.5 text-[11px] text-[#92400E]">
                                    <li><strong>華藝</strong>：中文期刊／碩博論文（學校 VPN 內可下載全文）</li>
                                    <li><strong>Google Scholar</strong>：中英文都有，但要會篩（看作者+年份+被引次數）</li>
                                </ul>
                                <p><strong>Step 2 · 關鍵字下兩層</strong>：</p>
                                <ul className="list-disc pl-5 space-y-0.5">
                                    <li>主題詞 + 對象詞，例：「手機成癮 高中生」「補習動機 青少年」</li>
                                    <li>查不到 → 換同義詞：「手機」改「智慧型手機」、「補習」改「課外輔導」</li>
                                </ul>
                                <p><strong>Step 3 · 30 秒快速篩</strong>：</p>
                                <ul className="list-disc pl-5 space-y-0.5">
                                    <li>只讀<strong>摘要 + 結論段</strong>判斷「這篇跟我的題目有沒有關係」</li>
                                    <li>有關 → 下載／截圖；沒關 → 跳下一篇，不要硬讀</li>
                                </ul>
                                <p className="italic text-[11px] text-[#92400E]">💡 W7 文獻搜尋週教過華藝，記不得就回 W7 複習。</p>
                            </div>
                        </details>
                    </div>

                    {/* 5 種計畫書模板：自己的粗藍框，其他作「也認識一下」 */}
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <ContentTypeChip type="學" />
                            <h4 className="font-serif text-[18px] md:text-[20px] font-bold text-[var(--ink)]">5 種研究方法的計畫書模板</h4>
                        </div>
                        <p className="text-[13px] text-[var(--ink-mid)] leading-relaxed mb-3">
                            老師會在 <strong>Google Classroom</strong> 發你<strong className="text-[var(--ink)]">自己方法</strong>的計畫書副本（粗藍框那份）。但這是研究方法課——下方 5 種都列出，<strong className="text-[var(--ink)]">看別組用什麼模板，是這節該做的事</strong>。手動切換可點下方按鈕變更主框。
                        </p>
                        <div className="flex flex-wrap gap-2 mb-4">
                            {METHOD_OPTIONS.map((m) => (
                                <button
                                    key={m.id}
                                    type="button"
                                    onClick={() => handleMethodSelect(m.id)}
                                    className={`text-[12px] font-bold px-3 py-1.5 rounded-[6px] border transition-colors ${selectedMethod === m.id
                                        ? 'bg-[var(--ink)] text-white border-[var(--ink)]'
                                        : 'bg-white text-[var(--ink-mid)] border-[var(--border)] hover:border-[var(--ink)]'
                                        }`}
                                >
                                    {m.label}
                                </button>
                            ))}
                        </div>
                        {(() => {
                            const ALL_PLANS = [
                                {
                                    id: 'questionnaire', filename: '01_問卷研究法_計畫書',
                                    brief: '量化研究；核心是「變項 → 問卷題目」。第二章起要定變項、做題目設計。',
                                    planUrl: 'https://docs.google.com/document/d/1wIRi36FEn2LEEesU4rb24IhSEMxpFHGs_K-hId5tHxA/copy',
                                    toolUrl: 'https://docs.google.com/document/d/1tu-WF_JitJIwBZBHrrgm3MeFMDykpm_gGZoyrB4UkOI/copy',
                                    toolName: '01_問卷_工具',
                                },
                                {
                                    id: 'interview', filename: '02_訪談研究法_計畫書',
                                    brief: '質性研究；核心是「訪談主題框架」。第二章起要拆主題、設計訪綱。',
                                    planUrl: 'https://docs.google.com/document/d/18t_rBWbwZoHfkq871ObgTV1qtNp-TZ9RMJJ6MQOfwtI/copy',
                                    toolUrl: 'https://docs.google.com/document/d/1BU6XyNxdwng6I15pwYXfRs-zwKgDDyF_EVc2T6uUCrs/copy',
                                    toolName: '02_訪綱_工具',
                                },
                                {
                                    id: 'experiment', filename: '03_實驗研究法_計畫書',
                                    brief: '量化研究；核心是「自變項/依變項/控制變項」。第二章起要定變項、設計實驗流程。',
                                    planUrl: 'https://docs.google.com/document/d/1IBfMJCuPZ_2sezzs2xdAgvFJq1WcHcbssaBnbTyv14o/copy',
                                    toolUrl: 'https://docs.google.com/document/d/1evcQ6-97mhkhsLz4RHDEGp9P_LkjAeIKUcvusBtc0d8/copy',
                                    toolName: '03_實驗_工具設計表',
                                },
                                {
                                    id: 'observation', filename: '04_觀察研究法_計畫書',
                                    brief: '核心是「行為操作型定義」。第二章起要把抽象行為定義到別人可重複觀察。',
                                    planUrl: 'https://docs.google.com/document/d/1PHC3w--zJ8yUw2gSwWkO7rMjQoYSmj9fj46h_-GX4bI/copy',
                                    toolUrl: 'https://docs.google.com/spreadsheets/d/1QMqW2AAlc1s_gNfiY3jkFCy0CHpYz2GX9ZmgpShUm7s/copy',
                                    toolName: '04_觀察紀錄表_工具',
                                },
                                {
                                    id: 'literature', filename: '05_文獻分析法_計畫書',
                                    brief: '文獻本身就是對象。第一章必選 4 子類型（歷史／內容／論述／敘事），第六章工具依子類型分流。',
                                    planUrl: 'https://docs.google.com/document/d/1q-nBzHJoeFvyBX8YG2rZgOcmiQAyJ69_S0PaP2uvPaY/copy',
                                    toolUrl: 'https://drive.google.com/drive/folders/1-UtVZM8dyo20s2vbnx3UCWm-lR8YROU6',
                                    toolName: '05_文獻分析_工具（資料夾，依子類型挑 05a-d）',
                                },
                            ];
                            return (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    {ALL_PLANS.map((p) => {
                                        const isMine = p.id === selectedMethod;
                                        return (
                                            <div
                                                key={p.id}
                                                className={
                                                    isMine
                                                        ? 'bg-white border-2 border-[var(--accent)] rounded-[var(--radius-unified)] p-4 md:col-span-2'
                                                        : 'bg-[var(--paper-warm)] border border-[var(--border)] rounded-[var(--radius-unified)] p-3 opacity-80'
                                                }
                                            >
                                                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                                                    {isMine && (
                                                        <span className="text-[10px] font-mono font-bold bg-[var(--accent)] text-white px-2 py-0.5 rounded-[3px]">你的方法</span>
                                                    )}
                                                    <span className={isMine ? 'font-bold text-[14px] text-[var(--ink)]' : 'font-bold text-[12.5px] text-[var(--ink-mid)]'}>{p.filename}</span>
                                                </div>
                                                <p className={isMine ? 'text-[12.5px] text-[var(--ink-mid)] leading-relaxed mb-3' : 'text-[11.5px] text-[var(--ink-light)] leading-[1.6]'}>{p.brief}</p>
                                                {isMine && (
                                                    <a
                                                        href={p.planUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center justify-center gap-2 bg-[var(--accent)] hover:opacity-90 text-white rounded-[8px] px-4 py-2.5 no-underline transition-opacity text-[12.5px] font-bold"
                                                    >
                                                        📄 開啟計畫書副本（Make a copy）→
                                                    </a>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            );
                        })()}
                        {!selectedMethod && (
                            <div className="mt-3 bg-[var(--paper-warm)] border border-dashed border-[var(--border)] rounded-[var(--radius-unified)] p-3 text-[12px] text-[var(--ink-light)]">
                                👆 還沒選方法？先看 5 種計畫書長什麼樣，再點上方按鈕選自己的。
                            </div>
                        )}
                        {/* 補充方法提示卡（W8 登記過才顯示） */}
                        {w8Secondary && (
                            <div className="mt-3 bg-[#ECFDF5] border border-[#10B981] rounded-[var(--radius-unified)] p-3 text-[12px] text-[#065F46] leading-relaxed">
                                🧩 你在 W8 登記了補充方法：<strong>{w8Secondary}</strong>。
                                <strong className="block mt-1">本週計畫書以「主方法」為骨架</strong>——補充方法寫在「第三章 研究方法」段落中說明（例：「主用問卷，輔以 3-5 位深度訪談補質性脈絡」），不另起爐灶。
                            </div>
                        )}
                    </div>

                    {/* 計畫書章節地圖（可收合） */}
                    <details open className="rounded-[var(--radius-unified)] border border-[var(--border)] bg-white overflow-hidden">
                        <summary className="cursor-pointer px-5 py-3 bg-[var(--paper-warm)] border-b border-[var(--border)] flex items-center gap-2 hover:bg-[var(--paper)] transition-colors">
                            <ContentTypeChip type="學" />
                            <span className="font-serif text-[16px] md:text-[18px] font-bold text-[var(--ink)]">計畫書章節地圖</span>
                            <span className="ml-auto text-[10px] font-mono text-[var(--ink-light)]">▼ 讀完可收合</span>
                        </summary>
                        <div className="p-5 space-y-3">
                            <p className="text-[13px] text-[var(--ink-mid)] leading-relaxed">
                                你不是「從零」寫一本計畫書，是把前幾週的成果<strong className="text-[var(--ink)]">整合</strong>進去。對照一下哪幾章來自哪週：
                            </p>
                            <div className="bg-white border border-[var(--border)] rounded-[var(--radius-unified)] overflow-hidden">
                                <div className="grid grid-cols-[70px_1fr_auto] bg-[var(--paper-warm)] border-b border-[var(--border)] text-[11px] font-mono font-bold text-[var(--ink)]">
                                    <div className="px-4 py-2.5">章</div>
                                    <div className="px-4 py-2.5 border-l border-[var(--border)]">主要內容</div>
                                    <div className="px-4 py-2.5 border-l border-[var(--border)]">來源</div>
                                </div>
                                {[
                                    { ch: '一', title: '研究主題基本資訊', src: 'W2 動機 + W3 問題 + W6 路線決定' },
                                    { ch: '二', title: '關鍵詞／行為操作型定義', src: 'W9 本節' },
                                    { ch: '三', title: '文獻回顧', src: 'W7-W8' },
                                    { ch: '四', title: '變項／主題／維度設計', src: 'W9 骨架｜W10 定版' },
                                    { ch: '五', title: '對象與抽樣', src: 'W6 路線決定' },
                                    { ch: '六', title: '工具設計', src: 'W10' },
                                    { ch: '七～九', title: '實施／分析／結論', src: 'W10 定稿' },
                                    { ch: '十', title: '研究倫理', src: 'W9 本節' },
                                    { ch: '十一', title: '時程表 W9–W17', src: '本節' },
                                    { ch: '十二', title: 'AI 使用聲明', src: '本節 + 後續更新' },
                                    { ch: '十三', title: '參考文獻', src: 'W7 起逐步補' },
                                ].map((r, i) => (
                                    <div key={i} className="grid grid-cols-[70px_1fr_auto] border-b border-[var(--border)] last:border-b-0 text-[12px]">
                                        <div className="px-4 py-2.5 font-mono font-bold text-[var(--accent)]">{r.ch}</div>
                                        <div className="px-4 py-2.5 border-l border-[var(--border)] text-[var(--ink)]">{r.title}</div>
                                        <div className="px-4 py-2.5 border-l border-[var(--border)] text-[var(--ink-mid)] font-mono text-[11px] whitespace-nowrap">{r.src}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </details>

                    {/* 五章地基工程 · 進度分級（可收合） */}
                    <details open className="rounded-[var(--radius-unified)] border border-[var(--border)] bg-white overflow-hidden">
                        <summary className="cursor-pointer px-5 py-3 bg-[var(--paper-warm)] border-b border-[var(--border)] flex items-center gap-2 hover:bg-[var(--paper)] transition-colors">
                            <ContentTypeChip type="做" />
                            <span className="font-serif text-[16px] md:text-[18px] font-bold text-[var(--ink)]">五章地基工程 · 本節要寫到的章節</span>
                            <span className="ml-auto text-[10px] font-mono text-[var(--ink-light)]">▼ 讀完可收合</span>
                        </summary>
                        <div className="p-5 space-y-4">
                            <p className="text-[13px] text-[var(--ink-mid)] leading-relaxed">
                                <strong className="text-[var(--ink)]">所有內容寫在計畫書上</strong>，網頁只做進度勾選與 AI 檢核紀錄，不重寫計畫書內容。W6 走讀回饋 + W8 同儕審查建議直接在計畫書第一章各欄內修正即可。
                            </p>
                            <div>
                                <div className="text-[11px] font-mono font-bold text-[var(--success)] uppercase tracking-wider mb-2">✅ 必達（課堂完成）</div>
                                <ul className="text-[13px] text-[var(--ink-mid)] space-y-1 list-disc pl-5">
                                    <li><strong className="text-[var(--ink)]">第一章</strong>：題目／動機／目的／主問題／子問題／對象（6 格，整合 W2/W3/W6）</li>
                                    <li><strong className="text-[var(--ink)]">第二章</strong>：3 個關鍵詞操作定義（從 W5 帶來，記得精修——W5 是練習稿）</li>
                                    <li><strong className="text-[var(--ink)]">第五章</strong>：對象 + 預計人數 + 抽樣方式（由 W6 路線決定延伸）</li>
                                </ul>
                            </div>
                            <div>
                                <div className="text-[11px] font-mono font-bold text-[var(--accent)] uppercase tracking-wider mb-2">🔶 骨架即可（課堂起草）</div>
                                <ul className="text-[13px] text-[var(--ink-mid)] space-y-1 list-disc pl-5">
                                    <li><strong className="text-[var(--ink)]">第三章</strong>：至少列 2 篇文獻的作者／年份／結論（骨架即可，差異段落課後寫）</li>
                                    <li><strong className="text-[var(--ink)]">第四章</strong>：變項／主題／維度清單（依方法拆 3-5 個，操作定義課後補）</li>
                                </ul>
                            </div>
                            <div>
                                <div className="text-[11px] font-mono font-bold text-[var(--danger)] uppercase tracking-wider mb-2">⚠️ 課後補齊（W10 第一節前必達）</div>
                                <ul className="text-[13px] text-[var(--ink-mid)] space-y-1 list-disc pl-5">
                                    <li>第三章文獻補齊 2-3 篇 + 寫「與本研究差異」</li>
                                    <li>第四章變項／主題／維度定版 + 每個都有操作定義</li>
                                    <li>上傳計畫書到 Google Classroom（組長代表上傳）</li>
                                    <li className="text-[var(--ink-light)]">（可選）跑 AI 檢核 Prompt 看 1-5 章 — W10 第二節整本檢核才是重點，這裡先試也行</li>
                                </ul>
                            </div>
                        </div>
                    </details>

                    {/* 五章進度 checklist */}
                    {/* 進度自查清單 — 靜態展示卡，學生對照計畫書 docx 自查（不在網頁勾選）*/}
                    <div className="bg-white border border-[var(--border)] rounded-[var(--radius-unified)] overflow-hidden">
                        <div className="p-3 px-4 bg-[var(--paper-warm)] border-b border-[var(--border)] flex items-center gap-2 flex-wrap">
                            <ContentTypeChip type="做" />
                            <span className="text-[14px]">📋</span>
                            <span className="font-bold text-[13px] text-[var(--ink)]">本節進度自查（對照計畫書 docx 看，不在這勾）</span>
                        </div>
                        <ul className="p-4 space-y-1.5 text-[12.5px] text-[var(--ink-mid)] leading-[1.75] list-none">
                            <li>☐ 第一章：6 格全填（計畫書）</li>
                            <li>☐ 第二章：3 個關鍵詞操作定義（計畫書）</li>
                            <li>☐ 第五章：對象／人數／抽樣方式（計畫書）</li>
                            <li>☐ 第三章：至少 2 篇文獻基本資料（計畫書，骨架）</li>
                            <li>☐ 第四章：變項／主題／維度清單（計畫書，骨架）</li>
                            <li>☐ W6/W8 同儕回饋建議在計畫書上已納入修正</li>
                        </ul>
                        <p className="px-4 pb-3 text-[11px] text-[var(--ink-light)] italic leading-relaxed">
                            💡 勾選不影響繳交——繳交依據是計畫書 docx 本身。這張清單只是自己核對章節有沒有寫到位。
                        </p>
                    </div>

                    {/* 下一步 */}
                    <div className="w7-notice w7-notice-teal">
                        ✅ 五章地基寫到雛形 → 下一步：<strong>Step 4 AI 工作坊</strong>（請 AI 檢核你寫好的 1-5 章；卡關的章節請 AI 給範例）+ 保留完整對話與採納判斷（完整 AI-RED W10 寫）。
                    </div>
                </div>
            ),
        },

        /* ─── Step 4：AI 工作坊（三種模式 + 完整對話繳交；完整 AI-RED 留到 W10 寫） ─── */
        {
            title: 'AI 工作坊（三種模式）',
            icon: '🤖',
            content: (
                <div className="space-y-8 prose-zh">
                    <StepBriefing
                        lines={[
                            { label: '做', text: '寫不出某章 → 教學型（AI 給範例）；有初稿 → 驗收型（AI 找盲點）；不需要 → 直接下一步' },
                        ]}
                    />
                    {/* 開場 */}
                    <p className="text-[14px] text-[var(--ink-mid)] leading-relaxed max-w-[720px]">
                        計畫書 1-5 章寫到雛形了——這節用 AI 把它<strong className="text-[var(--ink)]">檢核一遍</strong>（驗收型）；如果有章節完全寫不出來，請 AI <strong className="text-[var(--ink)]">給範例</strong>（教學型）。
                    </p>

                    {/* AI 工作坊區塊 */}
                    <div className="space-y-4">
                        {/* AI 協作三原則（W9 角色：嚴格教練） */}
                        <AICollaborationPrinciples week="9" role="critic" compact={false} />

                        {/* 📋 用 AI 寫東西的 4 自查（前置 · 兩種模式都適用） */}
                        <div className="bg-white border-2 border-[#86EFAC] rounded p-3 mb-3">
                            <div className="flex items-center gap-2 mb-2">
                                <ContentTypeChip type="注意" />
                                <p className="text-[12px] font-bold text-[#166534]">📋 用 AI 寫東西的 4 個自查（不論教學型／驗收型都適用）</p>
                            </div>
                            <ul className="text-[11.5px] text-[#166534] leading-relaxed space-y-1">
                                <li>☐ 我用<strong>自己的研究主題詞彙</strong>替換 AI 給的詞（不是直接套）</li>
                                <li>☐ AI 寫 5 句，我寫的句數至少不一樣（合理增減）</li>
                                <li>☐ 我能口頭跟同學講「為什麼這樣寫」（不是照念）</li>
                                <li>☐ 我有<strong>調整段落順序</strong>或補上 AI 沒提到的我自己想到的內容</li>
                            </ul>
                            <p className="text-[10.5px] text-[#166534] italic mt-2">
                                💡 4 項至少達 3 項才算改寫，否則就是抄——下一週老師抽問會看出來。
                            </p>
                        </div>

                        {/* AI 模式選擇 */}
                        <AIModePicker week="9" taskName="計畫書檢核" onChange={setW9AiMode} />

                        {/* 教學型：寫不出某幾章 → AI 給範例 */}
                        {w9AiMode === 'teach' && (
                            <div className="rounded-[var(--radius-unified)] border-2 border-[#86EFAC] bg-[#F0FDF4] p-5 space-y-3">
                                <p className="text-[14px] font-bold text-[#166534]">🎓 教學型 Prompt（從零到一）</p>
                                <p className="text-[12px] text-[#166534] leading-relaxed">
                                    某幾章完全不會寫？把你卡關的章節貼上，請 Gemini 給範例。記得：<strong>看完範例自己寫一次</strong>，不要直接抄。
                                </p>
                                <PromptBlock text={`我在寫高中專題研究計畫書，需要寫第 1-5 章，但有幾章我完全不會寫。

【我的研究】
- 研究方法：問卷／訪談／實驗／觀察／文獻
- 研究問題：___
- 主要發現方向：___（如果還沒做完，寫預期方向）

【我卡住的章節】
___（例：第三章文獻探討、第四章變項定義）

【請你做】
1. 用我的研究主題，示範這幾章的「極簡範例」（每章 5-8 行）
2. 解釋這幾章的「該寫什麼、不該寫什麼」
3. 給我一個填空模板，我可以照著填

【不要做】
- 不要替我寫完整章節
- 我會看完範例後自己寫一次再給你檢查`} />
                                <p className="text-[11px] text-[#166534] italic leading-relaxed">
                                    💡 看完 AI 範例後，回到計畫書 自己寫一次，再切回「驗收型」讓 AI 檢核。
                                </p>
                            </div>
                        )}

                        {/* 驗收型：有初稿 → AI 找盲點（保留現有 W9AiCheckPromptBox） */}
                        {w9AiMode === 'verify' && <W9AiCheckPromptBox />}

                        {!w9AiMode && (
                            <div className="rounded-[var(--radius-unified)] border border-[var(--border)] bg-[var(--paper-warm)] p-3">
                                <p className="text-[12px] text-[var(--ink-mid)] leading-relaxed">
                                    ☝️ 上方先選一個 AI 使用模式：寫不出來選🎓教學型；有初稿了選🥊驗收型。
                                </p>
                            </div>
                        )}

                        {/* AI 判斷展示卡 + 對話繳交（用了 AI 才顯示）*/}
                        {w9AiMode !== 'standalone' && w9AiMode && (
                            <>
                                <div className="bg-[var(--paper-warm)] border-2 border-[var(--accent)] rounded-[var(--radius-unified)] p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <ContentTypeChip type="做" />
                                        <p className="text-[13px] font-bold text-[var(--ink)]">🧠 AI 互動後的判斷（直接寫在 AI 對話文件末尾或計畫書邊註）</p>
                                    </div>
                                    <p className="text-[12px] text-[var(--ink-mid)] leading-relaxed mb-3">
                                        <strong className="text-[var(--accent)]">不在這格寫</strong>——AI 跑完後，在 AI 對話文件末尾／計畫書相關章節邊註寫採納判斷：
                                    </p>
                                    <div className="bg-white border border-[var(--border)] rounded-[6px] p-3 text-[12px] text-[var(--ink-mid)] leading-[1.8]">
                                        <p className="font-bold text-[var(--ink)] mb-1">AI 指出的主要問題（驗收型）／ AI 給的範例（教學型）：</p>
                                        <p className="ml-3">1. ___／2. ___／3. ___</p>
                                        <p className="font-bold text-[var(--ink)] mt-2 mb-1">我的決定：</p>
                                        <p className="ml-3">・採納：___（理由）</p>
                                        <p className="ml-3">・不採納：___（理由）</p>
                                        <p className="ml-3">・部分採納：___（理由 + 改寫版本）</p>
                                    </div>
                                    <p className="text-[11px] text-[var(--ink-light)] italic mt-2 leading-relaxed">
                                        💡 完整 AI-RED 五要素（A/I/R/E/D）留到 W10 統一寫。
                                    </p>
                                </div>
                                <AIDialogSubmission week="9" taskName="計畫書檢核對話" required={true} />
                            </>
                        )}

                        {/* standalone 提示 */}
                        {w9AiMode === 'standalone' && (
                            <div className="bg-[#EFF6FF] border-2 border-[#BFDBFE] rounded p-4">
                                <p className="text-[13px] font-bold text-[#1E40AF] mb-1">🚫 你選擇不用 AI</p>
                                <p className="text-[12px] text-[#1E3A8A] leading-relaxed">
                                    完全 OK——直接到下一步繳交。<strong>AI-RED 紀錄留到 W10</strong>（W9-W10 是計畫書連續週，AI-RED 在 W10 一起寫即可）。
                                </p>
                            </div>
                        )}
                        {/* AI-RED 已搬到 W10 寫（W9-W10 計畫書連續週） */}
                    </div>

                    {/* 下一步 */}
                    <div className="w7-notice w7-notice-teal">
                        ✅ AI 工作坊完成（或你選擇不用 AI）→ 下一步回顧與繳交。記得把 AI 檢核 Prompt 帶回家跑、上傳計畫書到 Google Classroom。<strong>W9 不另填 AI-RED；保留完整 AI 對話，W10 統一記錄</strong>（W9-W10 是計畫書連續週）。
                    </div>
                </div>
            ),
        },

        /* ─── Step 4：回顧與繳交（時間承諾 + 課後計畫書撰寫） ─── */
        {
            title: '回顧與繳交',
            icon: '📋',
            content: (
                <div className="space-y-8 prose-zh">
                    <StepBriefing
                        lines={[
                            { label: '做', text: '對照本週要會，寫時間承諾（課後寫完 1-5 章），整理 W9 學習紀錄' },
                        ]}
                    />
                    {/* 本週結束，你應該要會 — B 標準格式 */}
                    <div className="bg-white border border-[var(--border)] rounded-[var(--radius-unified)] overflow-hidden mb-4">
                        <div className="p-4 px-5 bg-[var(--paper-warm)] border-b border-[var(--border)] font-bold text-[13px]">
                            ✅ 本週結束，你應該要會
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-[1px] bg-[var(--border)]">
                            {[
                                                '把 W2-W8 寫過的東西整合到計畫書 1-5 章雛形',
                                                '用 AI 檢核四個維度（方向／精度／結構／陷阱）逐章自查',
                                                '看別組用什麼方法的計畫書模板，知道 5 種方法的差異',
                                                '排定 W9-W10 之間的計畫書撰寫時間（避免拖到上課才寫）',
                            ].map((item, i) => (
                                <div key={i} className="p-4 px-5 bg-white flex items-start gap-3">
                                    <span className="text-[var(--success)] text-[16px] mt-0.5 flex-shrink-0">✓</span>
                                    <span className="text-[13px] text-[var(--ink-mid)] leading-relaxed">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 繳交說明卡（取代 ExportButton：W9-W10 主產出是計畫書本身） */}
                    <div className="bg-[#F0FDF4] border-2 border-[var(--success)] rounded-[var(--radius-unified)] p-5 max-w-[760px]">
                        <div className="flex items-center gap-2 mb-2">
                            <ContentTypeChip type="交出" />
                            <span className="text-[18px]">📤</span>
                            <span className="font-bold text-[14px] text-[var(--ink)]">本週繳交 · Google Classroom</span>
                        </div>
                        <p className="text-[12.5px] text-[var(--ink-mid)] leading-[1.85] mb-3">
                            這週主產出是<strong className="text-[var(--ink)]">計畫書 docx</strong>，繳交到 Google Classroom。流程如下：
                        </p>
                        <ol className="text-[12.5px] text-[var(--ink-mid)] leading-[1.9] list-decimal pl-5 space-y-1.5 mb-3">
                            <li>在 Step 3 點「開啟計畫書副本」→ 系統自動幫你複製一份到個人 Google 雲端（Make a copy）</li>
                            <li>全組在那份 docx 裡分章撰寫（記得開共用連結給組員）</li>
                            <li>寫完後，<strong>組長一人代表上傳</strong>到 Classroom 本週作業區（老師從 Classroom 可直接看到）</li>
                            <li>若有使用 AI，把 AI 完整對話連結或截圖文件一併附在繳交留言裡</li>
                        </ol>
                        <div className="bg-white border border-[var(--success)]/30 rounded-[6px] p-3 text-[11.5px] text-[var(--ink-mid)] leading-[1.8] space-y-0.5">
                            <p>✅ <strong>必繳</strong>：計畫書 docx（主要評分依據）</p>
                            <p>📎 <strong>有用 AI 才繳</strong>：AI 完整對話連結或文件</p>
                            <p className="text-[var(--ink-light)] italic pt-1">W9 不需匯出網頁紀錄。課後補完的章節（第三、四章）直接在同一份 docx 改好後，W10 第一節前再上傳更新版即可。</p>
                        </div>
                    </div>

                    {/* 5. 遊戲彩蛋（黑底用 inline style 確保白字勝過 prose-zh cascade） */}
                    <div className="bg-[var(--ink)] border-l-4 border-[var(--danger)] p-6 rounded-r-lg shadow-xl" style={{ color: '#fff' }}>
                        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8, color: '#fff' }}>
                            <ShieldAlert className="text-[var(--danger)]" size={20} />
                            R.I.B. 單元挑戰：行動代號防線
                        </h3>
                        <p style={{ fontSize: 14, marginBottom: 16, color: 'rgba(255,255,255,0.85)' }}>
                            10 個充滿致命設計缺陷的研究病例。揪出錯誤並開立正確處方，確保研究方法無懈可擊。
                        </p>
                        <Link to="/game/rx-inspector" className="inline-flex items-center gap-2 bg-[var(--danger)] px-4 py-2 rounded font-bold text-sm hover:opacity-90 transition-colors" style={{ color: '#fff' }}>
                            進入防線 <ArrowRight size={14} />
                        </Link>
                    </div>

                    {/* 6. W10 預告 + 輕量課後提示（黑底要 inline style 強制白字，避免 prose-zh cascade 把 strong 變回深色） */}
                    <div className="bg-[var(--ink)] rounded-[var(--radius-unified)] p-6" style={{ color: '#fff' }}>
                        <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8, color: '#fff' }}>W10 會做什麼</div>
                        <p style={{ fontSize: 13, lineHeight: 1.9, marginBottom: 16, color: '#fff' }}>
                            第一節：<strong style={{ color: '#fff', fontWeight: 700 }}>工具設計（第六章）</strong>——問卷題目／訪綱／實驗流程／觀察紀錄表／文獻分析架構（4 子類型擇一），依你方法分流。<br />
                            第二節：<strong style={{ color: '#fff', fontWeight: 700 }}>整本計畫書 AI 檢核 → 定稿繳交</strong>。
                        </p>
                        <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8, color: '#fff' }}>W10 之前的輕量任務</div>
                        <ul style={{ fontSize: 13, lineHeight: 1.9, listStyle: 'disc', paddingLeft: 20, marginBottom: 16, color: '#fff' }}>
                            <li>第三章文獻補到 2-3 篇 + 差異段</li>
                            <li>第四章變項／主題／維度定版 + 操作定義</li>
                            <li>計畫書上傳 Google Classroom</li>
                            <li style={{ opacity: 0.65 }}>（選做）跑 AI 思考模式檢核第 1-5 章（用上方複製的 Prompt）— W10 第二節整本檢核才是重點</li>
                        </ul>
                        <p style={{ fontSize: 12, lineHeight: 1.85, color: 'rgba(255,255,255,0.7)' }}>
                            💡 大部分已在課堂完成，課後只是「補細節 + 跑 AI + 繳交」。若要幫自己規劃具體時間，下方可以寫。
                        </p>
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
                    <span className="hidden md:inline">研究方法與專題 / 資料蒐集 / </span><span className="text-[var(--ink)] font-bold">計畫書·五章地基 W9</span>
                </div>
                <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
                    <span className="bg-[var(--paper-warm)] text-[var(--ink)] text-[10px] font-bold px-2 py-0.5 rounded-[2px] font-mono">100 MINS</span>
                    <ResetWeekButton weekPrefix="w9-" />
                    <button
                        onClick={() => setShowLessonMap(!showLessonMap)}
                        className="text-[11px] text-[var(--ink-light)] hover:text-[var(--accent)] transition-colors flex items-center gap-1 font-mono"
                        type="button"
                    >
                        <Map size={12} /> <span className="hidden md:inline">{showLessonMap ? 'Hide Plan' : 'Instructor View'}</span>
                    </button>
                </div>
            </div>

            {showLessonMap && (
                <div className="animate-in slide-in-from-top-4 duration-300 mb-8">
                    <LessonMap data={W9Data} />
                </div>
            )}

            {/* PAGE HEADER — Hero Block */}
            <HeroBlock
                kicker="R.I.B. 調查檔案 · 研究方法與專題 · W9"
                todo={[
                  { label: '今天做什麼', value: '盤點 W2–W8 所有成果，把題目／方法／文獻整合成計畫書 1–5 章雛形。' },
                  { label: '為什麼做', value: 'W6 題目定、W7 找文獻、W8 練寫法——W9 兩節就是把這些正式組裝成計畫書地基。' },
                  { label: '今天交什麼', value: '計畫書 1–5 章草稿（含 AI 完整對話連結）。' },
                ]}
                question="別人看完，知道我要怎麼研究嗎？"
                title="計畫書 · "
                accentTitle="五章地基"
                subtitle="本週專心做計畫書 1-5 章地基（研究問題、文獻、變項、抽樣對象）——工具設計之前，地基必須先打穩。工具品質與第六章題目設計移到 W10。"
                chain="W6 題目路線定了，W7 找到文獻，W8 練過文獻探討——W9 兩節 100 分鐘把它們整理成計畫書 1-5 章雛形。"
                meta={[
                    { label: '第一節', value: '開場盤點 + 五章寫法導引（重點：第一、四章）' },
                    { label: '第二節', value: '計畫書組裝工作流 + AI 檢核 Prompt + 保留 AI 對話備 W10 用' },
                    { label: '課堂產出', value: '計畫書第 1-5 章雛形；如有使用 AI，保留完整對話與採納判斷（完整 AI-RED W10 寫）' },
                    { label: '前置要求', value: 'W6 合題題目／Solo 5 項契約 + W7 文獻 + W8 文獻探討段落' },
                ]}
            />
            <CourseArc items={[
                    { wk: 'W1-W2', name: '探索階段\nRED公約', status: 'past' },
                    { wk: 'W3-W4', name: '題目診斷\n方法地圖', status: 'past' },
                    { wk: 'W5-W6', name: '操作型定義\n海報博覽會', status: 'past' },
                    { wk: 'W7', name: '文獻搜尋\n入門', status: 'past' },
                    { wk: 'W8', name: '文獻偵探社\n引用寫作', status: 'past' },
                    { wk: 'W9', name: '計畫書\n1-5 章地基', status: 'now' },
                    { wk: 'W10', name: '工具精進\n預試', status: '' },
                    { wk: 'W11-W14', name: '執行研究\n數據分析', status: '' },
                ]} />

            {/* 本節任務卡 — 學生一眼看懂「今天要做什麼」 */}
            <TaskCard
                weekNumber="W9"
                weekTitle={W9Data.title}
                duration={`${W9Data.duration} 分鐘 · ${W9Data.durationDesc}`}
                tasks={[
                    '小組盤點 W2-W8 成果 + 納入同儕建議 — 確認題目／方法／操作型定義／文獻的共識，決定哪些要改、哪些堅持',
                    '1-5 章寫法導引 — 一章一個分頁：判斷題目變了沒 → 看原則與範例 → 去 docx 寫',
                    '計畫書組裝工作流 — 分工 + 挑模板，把 1-5 章寫到雛形（雙模式 AI 工作坊可選用）',
                ]}
                exportReminder="匯出本週紀錄 → 繳交計畫書 1-5 章草稿；若使用 AI，另附完整 AI 對話"
            />

            {/* STEP ENGINE */}
            <StepEngine
                steps={steps}
                prevWeek={{ label: '回 W8 文獻偵探社', to: '/w8' }}
                nextWeek={{ label: '前往 W10 工具精進', to: '/w10' }}
            flat
            />
        </div>
    );
};
