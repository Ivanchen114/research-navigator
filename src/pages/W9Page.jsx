import React, { useState, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CourseArc from '../components/ui/CourseArc';
import ContentTypeChip from '../components/ui/ContentTypeChip';
import './W9Page.css';
import ThinkRecord from '../components/ui/ThinkRecord';
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

    /* 題目帶入（W6 合題 > W4 個人 > W3 fallback） + 鉛筆編輯 */
    const [groupTopic, setGroupTopic] = useState('');
    const [topicSrc, setTopicSrc] = useState(''); // 'w6-team' | 'w4' | 'w3'
    const [editingGroupTopic, setEditingGroupTopic] = useState(false);

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
        /* 嘗試自動偵測分流 */
        const methodLower = method.toLowerCase();
        if (methodLower.includes('問卷')) setSelectedMethod('questionnaire');
        else if (methodLower.includes('訪談')) setSelectedMethod('interview');
        else if (methodLower.includes('實驗')) setSelectedMethod('experiment');
        else if (methodLower.includes('觀察')) setSelectedMethod('observation');
        else if (methodLower.includes('文獻')) setSelectedMethod('literature');

        /* 題目鏈：W6 合題 > W4 個人定案 > W3 fallback */
        let gSrc = '';
        let gTopic = '';
        if (saved['w6-team-topic']?.trim()) {
            gTopic = saved['w6-team-topic'].trim();
            gSrc = 'w6-team';
        } else if (saved['w4-my-topic']?.trim()) {
            gTopic = saved['w4-my-topic'].trim();
            gSrc = 'w4';
        } else {
            gTopic = (saved['w3-final-topic'] || '').trim();
            gSrc = gTopic ? 'w3' : '';
        }
        setGroupTopic(gTopic);
        setTopicSrc(gSrc);
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
                            { label: '節奏', text: '跟老師做（15 分鐘）' },
                            { label: '做', text: '確認題目和方法——選好方法、確認題目沒跑掉，再開始寫計畫書。' },
                        ]}
                    />

                    {/* 確認兩件事 */}
                    <div className="bg-white border-2 border-[var(--accent)] rounded-[var(--radius-unified)] p-5 max-w-[720px]">
                        <p className="text-[14px] font-bold text-[var(--ink)] mb-3">🎯 開始前先確認兩件事</p>
                        <div className="space-y-2 text-[13px] text-[var(--ink-mid)] leading-relaxed">
                            <p>① <strong>題目確定了嗎？</strong>W6 合題後有沒有改——下面看一下自動帶入的題目對不對。</p>
                            <p>② <strong>文獻還對得上嗎？</strong>合題改了方向，W7 的文獻可能要重查——Step 3 有說明怎麼處理。</p>
                        </div>
                    </div>

                    {/* 題目顯示卡（W6 合題 > W4 個人 > W3 fallback） */}
                    <div className="max-w-[720px]">
                        {groupTopic ? (
                            <div className={`rounded-[var(--radius-unified)] border-2 overflow-hidden ${topicSrc === 'w6-team' ? 'border-[var(--success)]' : 'border-[var(--accent)]'}`}>
                                <div className={`px-5 py-3 flex items-center justify-between ${topicSrc === 'w6-team' ? 'bg-[var(--success)]' : 'bg-[var(--accent)]'}`}>
                                    <span className="text-white text-[13px] font-bold">
                                        {topicSrc === 'w6-team' ? '📌 W6 小組合題（自動帶入）' : topicSrc === 'w4' ? '📌 W4 個人定案題目（自動帶入）' : '📌 W3 題目（自動帶入）'}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => setEditingGroupTopic(v => !v)}
                                        className="text-white/90 text-[12px] font-semibold px-3 py-1 rounded bg-white/20 hover:bg-white/30 transition-colors flex-shrink-0"
                                    >
                                        ✏️ {editingGroupTopic ? '收起' : '修改'}
                                    </button>
                                </div>
                                <div className="bg-white px-5 py-4">
                                    <p className="text-[20px] font-bold text-[var(--ink)]">{groupTopic}</p>
                                    {editingGroupTopic && (
                                        <div className="mt-3">
                                            <ThinkRecord
                                                dataKey="w9-group-topic"
                                                question="題目調整後，現在的正式題目是什麼？"
                                                placeholder="輸入修改後的題目……"
                                                compact
                                            />
                                        </div>
                                    )}
                                </div>
                                {/* 靜態提示：動機要用小組角度重寫 */}
                                <div className="bg-[#FEF3C7] border-t border-[#FDE68A] px-5 py-3 text-[11.5px] text-[#78350F] leading-relaxed">
                                    💡 <strong>第一章動機要用小組共同角度寫</strong>——W3 個人那句只剩靈感參考；文獻如果跟新題目對不上，課後補查（Step 3 說明）。
                                </div>
                            </div>
                        ) : (
                            <div className="rounded-[var(--radius-unified)] border-2 border-[var(--warning)] overflow-hidden">
                                <div className="px-5 py-3 bg-[var(--warning)] flex items-center gap-2">
                                    <span className="text-white text-[13px] font-bold">⚠️ 還沒找到 W6/W4/W3 題目</span>
                                </div>
                                <div className="bg-white px-5 py-4">
                                    <p className="text-[12.5px] text-[var(--ink-mid)] mb-3">找不到先前存的題目——請直接填入你們組現在的題目：</p>
                                    <ThinkRecord
                                        dataKey="w9-group-topic"
                                        question="你們組現在的研究題目是什麼？"
                                        placeholder="輸入你們組的題目……"
                                        compact
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* 🤝 組內合議方法登記（W9 第一個紀錄點 · 點按鈕＋寫理由） */}
                    <div className="bg-white border-2 border-[var(--accent)] rounded-[var(--radius-unified)] p-5 max-w-[760px]">
                        <div className="flex items-center gap-2 mb-2">
                            <ContentTypeChip type="做" />
                            <p className="text-[14px] font-bold text-[var(--accent)]">🤝 開工前先合議：你們組要用什麼方法？（5 分鐘）</p>
                        </div>
                        <p className="text-[12.5px] text-[var(--ink-mid)] leading-relaxed mb-3">
                            主方法選定後，會影響後面章節和 W10 工具設計——<strong>現在確認，等下寫計畫書才不用回頭改</strong>。
                        </p>

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
                        <p className="text-[12px] font-bold text-[var(--ink)] mb-2 mt-3">② 討論完直接寫進<strong className="text-[var(--accent)]">計畫書第三章</strong>，不用在網頁填</p>
                        <div className="bg-[var(--paper-warm)] border border-[var(--border)] rounded-[8px] p-3">
                            <ul className="text-[12px] text-[var(--ink-mid)] leading-[1.85] list-none space-y-1">
                                <li><span className="font-mono font-bold text-[var(--accent)] mr-2">①</span>主方法是什麼（上方已選）</li>
                                <li><span className="font-mono font-bold text-[var(--accent)] mr-2">②</span>為什麼選這個</li>
                                <li><span className="font-mono font-bold text-[var(--accent)] mr-2">③</span>有沒有補充方法（例：問卷 N=80 + 訪談 N=6）</li>
                            </ul>
                        </div>
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
                                { ch: '一', t: '題目／動機／問題', key: '四類題目問題：大（包太多做不完）／空（無法收資料）／遠（找不到對象）／難（條件不夠）。用 5W1H 把題目切小、確認可執行。', back: [{ to: '/w3', label: 'W3 四類診斷' }] },
                                { ch: '二', t: '操作型定義', key: '三件事：可蒐集（有辦法收資料）、邊界清楚（說得出什麼算、什麼不算）、前後一致（整份研究用同一套）。「壓力大」不行、「5 題量表加總分數」可以。', back: [{ to: '/w5', label: 'W5 操作型' }] },
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
                        {/* 判斷卡 */}
                        <div className="bg-[#FFFBEB] border-l-4 border-[#D97706] rounded-r-[6px] p-3">
                            <div className="flex items-center gap-2 mb-1"><ContentTypeChip type="注意" /><p className="text-[12.5px] font-bold text-[#92400E]">🔍 動機要用哪個題目寫？</p></div>
                            <p className="text-[12px] text-[#78350F] leading-[1.8]">W9 起以<strong>組內合題題目</strong>為準。題目接近 W3 → 可直接擴寫；完全不同 → 組內重討論再寫。<strong>Solo</strong> 直接用個人定案題目。</p>
                        </div>
                        {/* 工作題目（W9 起以小組題目為準） */}
                        <div className="bg-[#EFF6FF] border-2 border-[#BFDBFE] rounded p-2.5">
                            <p className="text-[11px] font-bold text-[#1E40AF] mb-1">
                                🤝 {w8Topic ? 'W8 合議題目' : topicSrc === 'w6-team' ? 'W6 合題' : topicSrc === 'w4' ? 'W4 個人定案' : '工作題目'}（W9 起以這個為準）
                            </p>
                            {(w8Topic || groupTopic)
                                ? <p className="text-[11.5px] text-[#1E3A8A] italic leading-relaxed">「{w8Topic || groupTopic}」</p>
                                : <p className="text-[11.5px] text-[#92400E] italic">⚠️ 還沒偵測到題目——<strong>組隊</strong>回 <a href="/w8" target="_blank" rel="noopener noreferrer" className="text-[var(--accent)] underline">W8</a> 填合議題目；<strong>solo</strong> 直接在計畫書第一章寫即可</p>
                            }
                        </div>
                        {/* 動機 3 問 */}
                        <div className="bg-white border border-[var(--border)] rounded-[var(--radius-unified)] p-4">
                        <p className="text-[12px] font-bold text-[var(--ink)] mb-2">📋 動機 3 問（4-6 句，三題都要答到）</p>
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

                            </div>
                        </details>
                        </div>
                        {/* 去 docx 寫 */}
                        <div className="bg-[var(--accent-light)] border-2 border-[var(--accent)] rounded-[var(--radius-unified)] p-4">
                            <div className="flex items-center gap-2 mb-2"><ContentTypeChip type="做" /><p className="text-[13px] font-bold text-[var(--ink)]">✍️ 去計畫書 docx 寫第一章動機（4-6 句，3 問都答到）</p></div>
                            <div className="bg-white border border-[var(--border)] rounded p-3">
                                <ul className="text-[12px] text-[var(--ink-mid)] leading-[1.85] list-none space-y-1">
                                    <li><span className="font-mono font-bold text-[var(--accent)] mr-2">Q1</span>我看到 ___，所以想研究 ___</li>
                                    <li><span className="font-mono font-bold text-[var(--accent)] mr-2">Q2</span>前人研究說 ___，但 ___ 還沒人答</li>
                                    <li><span className="font-mono font-bold text-[var(--accent)] mr-2">Q3</span>這份研究會 ___，做完對 ___ 有意義</li>
                                </ul>
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
                                    ⚠️ <strong>W5 是練習稿，不是定稿</strong>——即使題目沒變，搬進第二章前也對照「<strong>三件事：可蒐集、邊界清楚、前後一致</strong>」精修一次。W5 夠好才直接搬，不夠好就在 docx 裡就地改寫。
                                </p>
                            </div>
                            <div className="bg-white border border-[var(--border)] rounded-[var(--radius-unified)] p-4">
                                <p className="text-[13px] font-bold text-[var(--ink)] mb-1.5">📐 第二章怎麼寫</p>
                                <p className="text-[12.5px] text-[var(--ink-mid)] leading-[1.85]">
                                    把題目裡的<strong>關鍵詞</strong>（抽象的那幾個，例：壓力、動機、學習效果）變成「<strong>別人照著也能測</strong>」的具體定義。三件事缺一不可：<strong>可蒐集</strong>、<strong>邊界清楚</strong>、<strong>前後一致</strong>。第二章至少寫 3 個關鍵詞。
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
                            {/* 課後分工查文獻 */}
                            <div className="bg-[#FEF3C7] border border-[#D97706]/50 rounded-[var(--radius-unified)] p-3">
                                <p className="text-[12px] font-bold text-[#92400E] mb-1.5">🏠 課後分工查文獻（W10 前完成）</p>
                                <ul className="text-[11.5px] text-[#78350F] leading-[1.7] list-disc pl-4 space-y-0.5">
                                    <li><strong>3 人組</strong>：每人查 1 篇符合新題目的 A/B 級文獻 → 共 3 篇</li>
                                    <li><strong>2 人組</strong>：每人查 1-2 篇 → 共 2-4 篇</li>
                                    <li><strong>Solo</strong>：自己查 2 篇 + 帶到下次老師對焦</li>
                                    <li>關鍵字參考：AI 檢核回覆裡會列「3 個搜尋組合」</li>
                                </ul>
                            </div>
                            {/* 3 步速查（折疊） */}
                            <details className="rounded-[var(--radius-unified)] border border-[#D97706]/40 bg-white">
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
                            <div className="bg-[var(--accent-light)] border border-[var(--accent)] rounded-[var(--radius-unified)] p-3 text-[12px] text-[var(--ink)] leading-relaxed">
                                ✍️ <strong>去 docx 寫：</strong>計畫書<strong>第三章</strong>先寫骨架（2 篇也行），不夠的標「待補」。複習：<Link to="/w7" target="_blank" rel="noopener noreferrer" className="text-[var(--accent)] font-bold underline">W7</Link>／<Link to="/w8" target="_blank" rel="noopener noreferrer" className="text-[var(--accent)] font-bold underline">W8</Link>。
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

                            {/* method-aware 精簡卡 */}
                            {!selectedMethod && (
                                <div className="bg-[#FEF3C7] border-2 border-[#F59E0B] rounded-[var(--radius-unified)] p-3 text-[12px] text-[#92400E] leading-relaxed">
                                    ⚠️ 還沒選方法 —— 請先在 <strong>Step 1 的「組內合議方法」區</strong>選一個方法（會同步顯示這裡）。
                                </div>
                            )}

                            {selectedMethod === 'questionnaire' && (
                                <div className="bg-white border border-[var(--border)] rounded-[var(--radius-unified)] p-4">
                                    <p className="text-[13px] font-bold text-[var(--ink)] mb-2">📋 第四章：變項設計</p>
                                    <div className="space-y-2 text-[11.5px]">
                                        <div className="border-l-4 border-[#7C3AED] bg-[#F5F3FF] p-2.5 rounded-r">
                                            <p className="font-bold text-[#5B21B6]">🎯 依變項 — 你想解釋的結果（被影響的東西）</p>
                                            <p className="text-[#4C1D95] italic mt-0.5">例：段考三科平均成績</p>
                                        </div>
                                        <div className="border-l-4 border-[#2563EB] bg-[#EFF6FF] p-2.5 rounded-r">
                                            <p className="font-bold text-[#1E40AF]">🎛️ 自變項 — 你猜會影響結果的因子</p>
                                            <p className="text-[#1E3A8A] italic mt-0.5">例：自評睡眠品質（量表分數）</p>
                                        </div>
                                        <div className="border-l-4 border-[#059669] bg-[#F0FDF4] p-2.5 rounded-r">
                                            <p className="font-bold text-[#065F46]">👤 背景變項 — 個人屬性，可能也影響結果</p>
                                            <p className="text-[#047857] italic mt-0.5">例：年級、性別、每週補習時數</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {selectedMethod === 'interview' && (
                                <div className="bg-white border border-[var(--border)] rounded-[var(--radius-unified)] p-4">
                                    <p className="text-[13px] font-bold text-[var(--ink)] mb-1">🎤 第四章：訪談主題框架</p>
                                    <p className="text-[11.5px] text-[var(--ink-mid)] mb-2">事先擬 3-5 個追問方向，每個主題在第六章展開成一組訪談題。</p>
                                    <div className="space-y-2 text-[11.5px]">
                                        {['家長期待', '同儕壓力', '自我需求'].map((theme, i) => (
                                            <div key={i} className="border-l-4 border-[#7C3AED] bg-[#F5F3FF] p-2.5 rounded-r">
                                                <p className="font-bold text-[#5B21B6]">📌 主題 {i + 1}：{theme}</p>
                                                <p className="text-[#4C1D95] italic">1 主問 ＋ 2-3 追問</p>
                                            </div>
                                        ))}
                                    </div>
                                    <p className="text-[11px] text-[#92400E] mt-2 bg-[#FEF3C7] p-2 rounded leading-relaxed">⚠️ 訪談是理解學生<strong>如何描述自己的選擇與經驗</strong>，不是統計「多少人這樣想」。</p>
                                </div>
                            )}

                            {selectedMethod === 'experiment' && (
                                <div className="bg-white border border-[var(--border)] rounded-[var(--radius-unified)] p-4">
                                    <p className="text-[13px] font-bold text-[var(--ink)] mb-2">🧪 第四章：變項設計（自/依/控制）</p>
                                    <div className="space-y-2 text-[11.5px]">
                                        <div className="border-l-4 border-[#2563EB] bg-[#EFF6FF] p-2.5 rounded-r">
                                            <p className="font-bold text-[#1E40AF]">🎛️ 自變項 — 你動手調整的</p>
                                            <p className="text-[#1E3A8A] italic mt-0.5">例：是否聽古典音樂（實驗組聽 5 分鐘、對照組安靜）</p>
                                        </div>
                                        <div className="border-l-4 border-[#7C3AED] bg-[#F5F3FF] p-2.5 rounded-r">
                                            <p className="font-bold text-[#5B21B6]">📈 依變項 — 測量的結果</p>
                                            <p className="text-[#4C1D95] italic mt-0.5">例：單字記憶測驗分數</p>
                                        </div>
                                        <div className="border-l-4 border-[#059669] bg-[#F0FDF4] p-2.5 rounded-r">
                                            <p className="font-bold text-[#065F46]">🔒 控制變項 — 保持一樣，避免干擾</p>
                                            <p className="text-[#047857] italic mt-0.5">例：同一份測驗、同一間教室、同一個時段</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {selectedMethod === 'observation' && (
                                <div className="bg-white border border-[var(--border)] rounded-[var(--radius-unified)] p-4">
                                    <p className="text-[13px] font-bold text-[var(--ink)] mb-2">👁️ 第四章：觀察維度設計</p>
                                    <div className="space-y-2 text-[11.5px]">
                                        <div className="border-l-4 border-[#059669] bg-[#F0FDF4] p-2.5 rounded-r">
                                            <p className="font-bold text-[#065F46]">📋 編碼類別（非參與觀察）— 把行為分類的標籤</p>
                                            <p className="text-[#047857] italic mt-0.5">例：持續閱讀 / 短暫分心 / 滑手機 / 離開座位</p>
                                        </div>
                                        <div className="border-l-4 border-[#0EA5E9] bg-[#F0F9FF] p-2.5 rounded-r">
                                            <p className="font-bold text-[#075985]">📌 關鍵事件維度（參與觀察）— 每件事要記的欄位</p>
                                            <p className="text-[#0C4A6E] italic mt-0.5">例：發生時間 / 參與者 / 情境 / 反應</p>
                                        </div>
                                        <div className="border-l-4 border-[#D97706] bg-[#FEF3C7] p-2.5 rounded-r">
                                            <p className="font-bold text-[#92400E]">📦 觀察單位 — 記錄的最小單位</p>
                                            <p className="text-[#78350F] italic mt-0.5">例：一名學生 × 5 分鐘時間點 → 1 筆行為記錄</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {selectedMethod === 'literature' && (
                                <div className="bg-white border border-[var(--border)] rounded-[var(--radius-unified)] p-4">
                                    <p className="text-[13px] font-bold text-[var(--ink)] mb-1">📚 第四章：分析架構（維度 × 單位 × 編碼）</p>
                                    <p className="text-[11.5px] text-[#92400E] mb-2 bg-[#FEF3C7] px-2 py-1 rounded leading-relaxed">⚠️ 文獻組的第四章是分析<strong>既有文本</strong>（標題、報導、貼文），不是整理前人研究（那是第三章）。</p>
                                    <div className="space-y-2 text-[11.5px]">
                                        <div className="border-l-4 border-[#D97706] bg-[#FEF3C7] p-2.5 rounded-r">
                                            <p className="font-bold text-[#92400E]">📐 分析維度 — 每筆資料要抓的比較欄位</p>
                                            <p className="text-[#78350F] italic mt-0.5">例：YouTuber 標題 → 數字 / 情緒詞 / 問句 / 視覺符號</p>
                                        </div>
                                        <div className="border-l-4 border-[#B45309] bg-[#FEF3C7] p-2.5 rounded-r">
                                            <p className="font-bold text-[#92400E]">📦 分析單位 — 用多大顆粒度當「一筆資料」</p>
                                            <p className="text-[#78350F] italic mt-0.5">例：一個影片標題（不是整支影片）</p>
                                        </div>
                                        <div className="border-l-4 border-[#92400E] bg-[#FEF3C7] p-2.5 rounded-r">
                                            <p className="font-bold text-[#92400E]">🏷️ 編碼表 — 把資料分類的工具</p>
                                            <p className="text-[#78350F] italic mt-0.5">例：每個標題勾選 4 維度 → 比 2014 vs 2024 比例</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* 5 法對照表（收合）*/}
                            <details className="bg-white border border-[#BFDBFE] rounded p-2.5">
                                <summary className="cursor-pointer text-[11.5px] font-bold text-[#1E40AF]">📊 想看其他方法的第四章長什麼樣？</summary>
                                <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px]">
                                    {[
                                        { m: '📋 問卷', sec: '變項設計', core: '依變項 / 自變項 / 背景變項', ex: '滑手機時數 → 自評睡眠品質' },
                                        { m: '🎤 訪談', sec: '訪談主題框架', core: '主題 1/2/3（每個 1 主問 + 2-3 追問）', ex: '補習動機 → 家長期待 / 同儕壓力 / 自我需求' },
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

                            <div className="bg-[var(--accent-light)] border border-[var(--accent)] rounded-[var(--radius-unified)] p-3 text-[12px] text-[var(--ink)] leading-relaxed">
                                ✍️ <strong>去 docx 寫：</strong>計畫書<strong>第四章</strong>依你的方法填對應欄位。忘記 5 法怎麼選？回 <Link to="/w4" target="_blank" rel="noopener noreferrer" className="text-[var(--accent)] font-bold underline">W4 方法選擇</Link> 複習。
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
                    {/* 5 種計畫書模板：先開模板、再分工 */}
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <ContentTypeChip type="做" />
                            <h4 className="font-serif text-[18px] md:text-[20px] font-bold text-[var(--ink)]">5 種研究方法的計畫書模板</h4>
                        </div>
                        <p className="text-[13px] text-[var(--ink-mid)] leading-relaxed mb-3">
                            先把計畫書副本複製到你的 GDrive——這是接下來寫的主文件。找到你的方法（粗框），點「開啟計畫書副本」按鈕。5 種模板都列出，互相看看別組的章節結構也是這節的功課。
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

                    {/* 計畫書章節地圖（可收合） */}
                    <details className="rounded-[var(--radius-unified)] border border-[var(--border)] bg-white overflow-hidden">
                        <summary className="cursor-pointer px-5 py-3 bg-[var(--paper-warm)] border-b border-[var(--border)] flex items-center gap-2 hover:bg-[var(--paper)] transition-colors">
                            <ContentTypeChip type="參" />
                            <span className="font-serif text-[16px] md:text-[18px] font-bold text-[var(--ink)]">計畫書章節地圖（全 13 章來源）</span>
                            <span className="ml-auto text-[10px] font-mono text-[var(--ink-light)]">▶ 展開查看</span>
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

                    {/* 五章進度 checklist */}
                    {/* 進度自查清單 — 靜態展示卡，學生對照計畫書 docx 自查（不在網頁勾選）*/}
                    <div className="bg-white border border-[var(--border)] rounded-[var(--radius-unified)] overflow-hidden">
                        <div className="p-3 px-4 bg-[var(--paper-warm)] border-b border-[var(--border)] flex items-center gap-2 flex-wrap">
                            <ContentTypeChip type="做" />
                            <span className="text-[14px]">📋</span>
                            <span className="font-bold text-[13px] text-[var(--ink)]">本節進度自查（對照計畫書 docx 看，不在這勾）</span>
                        </div>
                        <ul className="p-4 space-y-2 text-[12.5px] text-[var(--ink-mid)] leading-[1.75] list-none">
                            {[
                                { text: '第一章：6 格全填（題目／動機／目的／主問題／子問題／對象）', tag: '必達', tagColor: 'bg-[#D1FAE5] text-[#065F46]' },
                                { text: '第二章：3 個關鍵詞操作定義（從 W5 精修）', tag: '必達', tagColor: 'bg-[#D1FAE5] text-[#065F46]' },
                                { text: '第五章：對象／預計人數／抽樣方式', tag: '必達', tagColor: 'bg-[#D1FAE5] text-[#065F46]' },
                                { text: '第三章：至少 2 篇文獻基本資料（骨架，課後補差異段）', tag: '骨架', tagColor: 'bg-[#FEF3C7] text-[#92400E]' },
                                { text: '第四章：變項／主題／維度清單（骨架，操作定義課後補）', tag: '骨架', tagColor: 'bg-[#FEF3C7] text-[#92400E]' },
                                { text: 'W6/W8 同儕回饋建議已納入計畫書第一章', tag: '必達', tagColor: 'bg-[#D1FAE5] text-[#065F46]' },
                            ].map((item, i) => (
                                <li key={i} className="flex items-start gap-2">
                                    <span className="mt-0.5 flex-shrink-0">☐</span>
                                    <span className="flex-1">{item.text}</span>
                                    <span className={`flex-shrink-0 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${item.tagColor}`}>{item.tag}</span>
                                </li>
                            ))}
                        </ul>
                        <p className="px-4 pb-3 text-[11px] text-[var(--ink-light)] italic leading-relaxed">
                            💡 繳交依據是計畫書 docx，這張清單只做自我核對。所有內容寫在 docx，不在網頁重填。
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
                                <AIDialogSubmission week="9" taskName="計畫書檢核對話" required={false} />
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
                        <Map size={12} /> <span className="hidden md:inline">{showLessonMap ? '收起流程' : '教師流程'}</span>
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

            {/* 大紅標語：W9 不需填網頁 */}
            <div className="bg-[var(--danger)] text-white rounded-[var(--radius-unified)] px-5 py-4 flex items-start gap-3 mb-2">
                <span className="text-[22px] shrink-0">📋</span>
                <div>
                    <p className="text-[14px] font-bold mb-1">這週在計畫書 docx 寫——網頁不用填</p>
                    <p className="text-[12px] text-white/70 leading-relaxed">主要工作都在計畫書 docx，網頁只是課程說明參考用。老師上課前會講重點。</p>
                </div>
            </div>

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
