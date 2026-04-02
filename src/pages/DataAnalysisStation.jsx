import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    FlaskConical, MessageSquare, BarChart2, Eye, BookOpen,
    ChevronDown, ChevronUp, Copy, Check, AlertTriangle,
    CheckCircle2, ArrowRight, Database, Brain, Zap,
    ClipboardList, Search, TrendingUp
} from 'lucide-react';

// ─── Copy Button ─────────────────────────────────────────────────────────────
const PromptBox = ({ step, title, prompt }) => {
    const [copied, setCopied] = useState(false);
    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(prompt);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (e) { }
    };
    return (
        <div className="bg-[#1a1a2e] rounded-[6px] overflow-hidden mb-4">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                    <span className="font-mono text-[10px] font-bold text-[#c9a84c] tracking-widest uppercase">
                        🤖 Step {step}
                    </span>
                    <span className="text-[12px] text-white/70 font-medium">{title}</span>
                </div>
                <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 text-[11px] text-white/50 hover:text-white/90 transition-colors px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 border border-white/10"
                >
                    {copied
                        ? <><Check size={12} className="text-emerald-400" /><span className="text-emerald-400">已複製</span></>
                        : <><Copy size={12} /><span>複製 Prompt</span></>
                    }
                </button>
            </div>
            <pre className="px-4 py-3 text-[11.5px] text-white/75 font-mono leading-relaxed whitespace-pre-wrap break-words">
                {prompt}
            </pre>
        </div>
    );
};

// ─── Pitfall Item ─────────────────────────────────────────────────────────────
const Pitfall = ({ title, bad, good }) => (
    <div className="border border-amber-200 rounded-[6px] overflow-hidden mb-3">
        <div className="bg-amber-50 px-4 py-2 flex items-center gap-2">
            <AlertTriangle size={13} className="text-amber-600 shrink-0" />
            <span className="text-[12px] font-bold text-amber-800">{title}</span>
        </div>
        <div className="bg-white px-4 py-3 grid grid-cols-2 gap-3">
            <div>
                <div className="text-[10px] font-bold text-red-500 uppercase tracking-wider mb-1">❌ 常見錯誤</div>
                <div className="text-[12px] text-[#4a4a6a] leading-relaxed">{bad}</div>
            </div>
            <div>
                <div className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider mb-1">✅ 正確做法</div>
                <div className="text-[12px] text-[#4a4a6a] leading-relaxed">{good}</div>
            </div>
        </div>
    </div>
);

// ─── Checklist ────────────────────────────────────────────────────────────────
const Checklist = ({ items }) => (
    <div className="bg-[#f0ede6] border border-[#dddbd5] rounded-[6px] p-4">
        <div className="text-[11px] font-bold text-[#1a1a2e] uppercase tracking-widest mb-3">✅ 完成前確認</div>
        <div className="space-y-2">
            {items.map((item, i) => (
                <div key={i} className="flex items-start gap-2.5">
                    <CheckCircle2 size={13} className="text-[#8888aa] mt-0.5 shrink-0" />
                    <span className="text-[12px] text-[#4a4a6a] leading-relaxed">{item}</span>
                </div>
            ))}
        </div>
    </div>
);

// ─── Method Data ──────────────────────────────────────────────────────────────
const METHODS = [
    {
        id: 'survey',
        icon: BarChart2,
        label: '問卷法',
        emoji: '📊',
        color: 'text-blue-600',
        tagBg: 'bg-blue-50 border-blue-200 text-blue-700',
        overview: '量化數據（選擇題、量表題）為主，少量開放式文字。分析強項是描述群體概況、比較不同群體差異，從數字中找出趨勢與差異。',
        steps: [
            {
                step: 1, title: '數據清理與格式化',
                prompt: `【角色設定】你是一位專業的數據分析師。
【任務】請檢查我上傳的問卷數據（CSV 或貼上的表格）。
1. 告訴我有效樣本數是多少？
2. 檢查是否有異常值（例如：每天睡眠 25 小時）或明顯的填答錯誤。
3. 指出有沒有重複作答或空白過多的無效問卷。

【數據】
（貼上你的數據或 Google 表單摘要）`
            },
            {
                step: 2, title: '描述性統計（整體概況）',
                prompt: `【任務】請進行描述性統計分析。
1. 背景分析：請列出受試者的性別、年級分布（次數與百分比）。
2. 量表題分析：針對 Q1 到 Q10 的量表題（1-5 分），請計算每一題的「平均數」與「標準差」。
3. 哪一題的分數最高？哪一題差異最大（標準差最高）？這代表什麼意義？

【數據】
（貼上你的原始數據）`
            },
            {
                step: 3, title: '交叉分析——比較不同群體',
                prompt: `【研究問題】我想探討「___（自變項）」是否會影響「___（依變項）」。
【任務】
1. 請進行交叉分析，比較兩組在目標題目的平均數差異。
2. 判斷這個差異在現實上有沒有意義（不需要做複雜統計，只需討論差距大小）。
3. 這個結果支持還是不支持我原來的假設？請說明原因。

【數據】
（貼上兩組的數據）`
            },
            {
                step: 4, title: '開放式問題——質性分類',
                prompt: `【任務】針對問卷中的開放式問題「（題目內容）」，請進行主題分析。
1. 閱讀所有回覆，歸納出 3-5 個主要主題（Themes）。
2. 統計每個主題被提及的次數與百分比。
3. 針對最多人提到的主題，請引用 2 個最有代表性的原始答案。

【原始回覆】
（逐行貼上所有回答）`
            },
        ],
        pitfalls: [
            { title: '混淆相關與因果', bad: '發現「睡眠不足」的學生成績較差 → 結論：睡不夠會讓成績變差', good: '應說「睡眠時間與成績呈正相關」，並討論可能的第三變項（如：課業壓力同時影響兩者）' },
            { title: '過度推論樣本', bad: '調查了 60 位同學 → 「全台灣高中生都認為⋯⋯」', good: '限縮推論範圍：「本次受訪的松山高中同學中⋯⋯，可能反映都會區學生的趨勢」' },
        ],
        checklist: [
            '已刪除所有個資（姓名改編號）',
            '清楚區分「描述統計」與「交叉分析」兩個層次',
            '在報告中說明「相關不代表因果」',
            '圖表有清楚的標題與座標軸標示',
            '開放題已完成主題歸納，不是逐條列出',
        ]
    },
    {
        id: 'interview',
        icon: MessageSquare,
        label: '訪談法',
        emoji: '🗣️',
        color: 'text-violet-600',
        tagBg: 'bg-violet-50 border-violet-200 text-violet-700',
        overview: '大量文字資料（逐字稿）為主。分析強項是深入理解「為什麼」、探索個人經驗與感受。核心目標是從對話中提煉出主題（Themes）與架構（Framework）。',
        steps: [
            {
                step: 1, title: '逐字稿摘要與情緒感知',
                prompt: `【角色】你是一位質性研究員。
【資料】以下是受訪者 A 關於「（研究主題）」的訪談逐字稿片段。
【任務】
1. 請用 200-300 字摘要受訪者的核心觀點。
2. 分析受訪者在談論「（某個關鍵議題）」時的情緒傾向（是憤怒、無奈、期待還是其他？）
3. 找出 1-2 句最能代表他核心立場的「關鍵語錄」，保留原文。

【逐字稿】
（貼上逐字稿，建議每次不超過 2000 字）`
            },
            {
                step: 2, title: '主題分析（核心步驟）',
                prompt: `【任務】請對這份訪談稿進行「主題分析」（Thematic Analysis）。
1. 找出文本中反覆出現的關鍵概念，歸納出 3-5 個核心主題（Themes）。
2. 針對每個主題，請提供：
   - 主題名稱（要精準有力，例如：「無所不在的焦慮」）
   - 主題定義（這個主題在說什麼）
   - 支持這個主題的 1-2 句原文引用

【重要提醒】主題不是「摘要」，而是「反覆出現的模式」。

【逐字稿】
（貼上 1-3 位受訪者的訪談稿）`
            },
            {
                step: 3, title: '跨個案比較',
                prompt: `【資料】我提供了受訪者 A 與受訪者 B 的訪談摘要（或主題分析結果）。
【背景】A 是（描述），B 是（描述）。
【任務】
1. 比較兩位受訪者對於「（核心議題）」的看法有何異同？
2. 這些差異是否反映了他們不同的背景或經驗？
3. 有沒有矛盾或讓你意外的地方？（誠實面對不一致的觀點很重要）

（貼上兩位的摘要）`
            },
        ],
        pitfalls: [
            { title: '斷章取義', bad: '受訪者說「有時候覺得壓力很大，但通常還好」→ 報告寫「受訪者表示壓力很大」', good: '保留完整脈絡，引用原文時附上前後語境，說明是在什麼情況下說的' },
            { title: '只找支持假設的話', bad: '10 位受訪者中，9 位說「還好」，1 位說「很嚴重」→ 報告只引那 1 位', good: '誠實呈現所有觀點的比例，若有不一致要解釋原因，「意外的發現」才是研究價值' },
        ],
        checklist: [
            '受訪者已匿名（改用 A、B、C 或代號）',
            '引用原文時沒有斷章取義，保留完整語境',
            '主題分類邏輯清晰，各主題沒有過度重疊',
            '誠實呈現不一致的觀點，沒有選擇性報告',
            '報告格式：觀點（Assertion）+ 原文引用（Quote）+ 詮釋（Commentary）',
        ]
    },
    {
        id: 'experiment',
        icon: FlaskConical,
        label: '實驗法',
        emoji: '🧪',
        color: 'text-emerald-600',
        tagBg: 'bg-emerald-50 border-emerald-200 text-emerald-700',
        overview: '前測/後測分數、實驗組/控制組數據。分析強項是驗證因果關係。核心目標是證明「獨變項（X）的操弄，確實導致依變項（Y）的改變」。',
        steps: [
            {
                step: 1, title: '實驗設計檢核（跑數據前先做）',
                prompt: `【我的實驗設計】
- 研究目的：（說明你想驗證什麼）
- 實驗組：___人，進行（實驗處理）。
- 控制組：___人，（對照條件）。
- 測量方式：兩組皆進行前測與後測。

【任務】
1. 請檢視這個設計，有哪些可能的「無關變項」沒有被控制？
2. 前測的結果對後測分析有什麼影響？要如何處理？
3. 這個樣本數（___人）有哪些限制？`
            },
            {
                step: 2, title: '描述性統計與進步幅度',
                prompt: `【數據】
實驗組前測分數：（列出所有分數或平均）
實驗組後測分數：（列出所有分數或平均）
控制組前測分數：（列出）
控制組後測分數：（列出）

【任務】
1. 請計算兩組前測與後測的平均數（Mean）與標準差（SD）。
2. 計算兩組各自的「進步幅度」（後測平均 - 前測平均）。
3. 哪一組進步比較多？差異大約是多少？`
            },
            {
                step: 3, title: '因果推論——扮演魔鬼代言人',
                prompt: `【分析結果】實驗組平均進步 ___分，控制組平均進步 ___分。
【任務】
1. 請建議我如何用圖表呈現這個結果（例如：長條圖比較兩組差異）。
2. 請扮演「魔鬼代言人」：除了「實驗處理有效」之外，還有什麼原因可能導致實驗組表現更好？（請提出至少 3 個替代解釋，例如：霍桑效應、前測差異、老師態度⋯⋯）
3. 我該如何在報告中誠實說明這些限制？`
            },
        ],
        pitfalls: [
            { title: '忽略前測差異', bad: '實驗組後測 85 分 vs 控制組後測 75 分 → 結論：實驗處理有效', good: '先確認前測是否相近！若前測實驗組就比較好，後測差異不代表實驗效果' },
            { title: '忘記霍桑效應', bad: '學生知道自己是實驗組，可能因為「被關注」而表現更好，而非因為實驗處理本身有效', good: '在研究限制中說明：「實驗組同學知道自己正在接受實驗，可能存在霍桑效應」' },
        ],
        checklist: [
            '前測結果已確認，兩組起點大致相當',
            '結論中有討論「無關變項」是否被控制',
            '說明了可能的替代解釋（霍桑效應、樣本數過少等）',
            '圖表清楚標示了兩組的前後測對比',
            '在研究限制中誠實說明樣本數的問題',
        ]
    },
    {
        id: 'observation',
        icon: Eye,
        label: '觀察法',
        emoji: '📷',
        color: 'text-orange-600',
        tagBg: 'bg-orange-50 border-orange-200 text-orange-700',
        overview: '觀察記錄表（次數/頻率）+ 田野筆記（文字描述）。分析強項是看見「真實行為」與「情境脈絡」。核心目標是從行為中發現模式（Patterns）。',
        steps: [
            {
                step: 1, title: '量化觀察數據——行為頻率統計',
                prompt: `【資料】我在（___次）觀察中記錄了「（目標行為）」的發生頻率。
以下是我的記錄表：
（貼上你的觀察記錄，例如：
第一次觀察（地點/時間）：A 行為 _次，B 行為 _次
第二次觀察（地點/時間）：⋯⋯）

【任務】
1. 請計算各行為的總次數與各次觀察的平均次數。
2. 哪個行為發生最頻繁？有沒有明顯的時間或地點規律？
3. 請建議最適合呈現這份數據的圖表類型。`
            },
            {
                step: 2, title: '質性田野筆記——情境脈絡分析',
                prompt: `【情境】觀察地點為（___），時間為（___）。
【田野筆記片段】
（貼上你的文字觀察記錄，盡量保留你當時看到的具體細節）

【任務】
1. 從這些觀察筆記中，找出 2-3 個值得深入探討的「有趣現象或規律」。
2. 嘗試解釋這些現象的可能原因（從環境、社會規範、習慣等角度思考）。
3. 有什麼是你在場才能觀察到、但問卷或訪談無法捕捉的？`
            },
            {
                step: 3, title: '量化 + 質性整合詮釋',
                prompt: `【量化結果】（摘要你的頻率統計結果）
【質性筆記重點】（摘要你的田野筆記發現）

【任務】
1. 請綜合上述兩點，給我一個整合的詮釋：數字說明了什麼？文字補充了什麼數字說不出的東西？
2. 我的研究問題是「（填入你的問題）」，這些發現能回答這個問題嗎？
3. 有沒有哪個發現是讓你意外的？如何解釋？`
            },
        ],
        pitfalls: [
            { title: '觀察者效應', bad: '學生因為被觀察而刻意表現「乖」，和平常行為不同，導致數據失真', good: '在研究限制中說明：「受試者可能因知曉被觀察而改變行為（觀察者效應）」，並盡量讓觀察情境自然' },
            { title: '主觀偏誤', bad: '先入為主認為「男生就是比較吵」，只記錄男生的吵鬧行為，忽略女生的類似行為', good: '使用結構化觀察表，事先定義好要記錄什麼行為，並用客觀描述語言（「皺眉頭」），而非詮釋性語言（「不開心」）' },
        ],
        checklist: [
            '記錄表的時間、地點、觀察對象標示清楚',
            '區分了「客觀事實」（他皺眉頭）與「主觀詮釋」（他不開心）',
            '量化數據有對應的圖表呈現',
            '田野筆記有進行主題分析，不是流水帳',
            '在結論中討論觀察者效應對結果的可能影響',
        ]
    },
    {
        id: 'literature',
        icon: BookOpen,
        label: '文獻分析',
        emoji: '📚',
        color: 'text-rose-600',
        tagBg: 'bg-rose-50 border-rose-200 text-rose-700',
        overview: '學術論文、專書、報告為主。分析強項是綜合前人智慧、比較不同觀點。核心目標是「綜合（Synthesize）與比較（Compare）」，而非單純的摘要。',
        steps: [
            {
                step: 1, title: '單篇文獻重點提取',
                prompt: `【任務】請閱讀以下這篇文獻的摘要（或結論段落）。
1. 提取作者的核心論點（Main Argument）：這篇文章最想說的是什麼？
2. 作者使用了什麼研究方法？樣本是誰？
3. 這個研究最重要的結論是什麼？
4. 這篇文章和我的研究問題「（填入你的問題）」有什麼關係？

【文獻摘要】
（貼上摘要或結論段落）`
            },
            {
                step: 2, title: '多篇文獻——觀點比較矩陣',
                prompt: `【資料】我蒐集了以下關於「（研究主題）」的文獻：
- 文獻 A（作者/年份）：主要論點是⋯⋯
- 文獻 B（作者/年份）：主要論點是⋯⋯
- 文獻 C（作者/年份）：主要論點是⋯⋯

【任務】
1. 請幫我製作一個比較表格，從「研究方法」、「主要發現」、「與我研究的關聯」三個欄位比較這些文獻。
2. 這些文獻中，哪些觀點是一致的？哪些有爭議？
3. 最支持我研究方向的是哪一篇？為什麼？`
            },
            {
                step: 3, title: '尋找研究缺口（最重要）',
                prompt: `【現有文獻總結】根據我的文獻回顧，目前大多數研究都在討論「（主流方向）」。
【任務】
1. 請幫我思考，還有哪些面向是被忽略的？（例如：特定族群？台灣本土脈絡？近年新現象？）
2. 我的研究問題「（你的問題）」，在填補哪一個缺口？
3. 用一段話幫我寫「本研究的貢獻與定位」：說明前人做了什麼、還缺什麼、我要補上什麼。`
            },
        ],
        pitfalls: [
            { title: '文獻摘要 vs 文獻分析', bad: '「文章 A 說⋯⋯ 文章 B 說⋯⋯ 文章 C 說⋯⋯」——這是摘要，不是分析', good: '主題式綜合：「關於 X 議題，學者 A 與 B 持支持態度，但 C 提出反對，原因是⋯⋯」' },
            { title: '引用不可靠來源', bad: '引用維基百科、個人部落格、ChatGPT 自己生成的「文獻」（AI 會虛構文獻！）', good: '優先選用 Google Scholar、期刊、政府報告。引用前務必確認文獻真實存在（用 DOI 查）' },
        ],
        checklist: [
            '文獻來源可信（有 DOI 或可查詢的來源）',
            '依照規定的引用格式（APA 或 MLA）標註出處',
            '報告中展現了「對話感」——不同學者觀點的交鋒',
            '有明確說明自己的研究如何填補文獻缺口',
            '絕對沒有引用 AI 虛構的文獻（已逐一查證）',
        ]
    },
];

// ─── Main Page ────────────────────────────────────────────────────────────────
export const DataAnalysisStation = () => {
    const [activeMethod, setActiveMethod] = useState('survey');
    const [showFoundation, setShowFoundation] = useState(false);
    const method = METHODS.find(m => m.id === activeMethod);
    const Icon = method.icon;

    return (
        <div className="page-container animate-in-fade-slide">

            {/* TOP BAR */}
            <div className="flex items-center justify-between border-b border-[#dddbd5] pb-4 mb-12">
                <div className="text-[11px] font-mono text-[#8888aa] flex items-center gap-2">
                    研究方法與專題 / 分析工具 /
                    <span className="text-[#1a1a2e] font-bold">資料分析站</span>
                </div>
                <div className="flex items-center gap-3">
                    <span className="bg-[#f0ede6] text-[#1a1a2e] text-[10px] font-bold px-2 py-0.5 rounded-[2px] font-mono">
                        自學參考
                    </span>
                    <span className="bg-[#1a1a2e] text-white text-[10px] font-bold px-2 py-0.5 rounded-[2px] font-mono">
                        AI-RED · I
                    </span>
                </div>
            </div>

            {/* HEADER */}
            <div className="max-w-[800px] mb-10">
                <div className="font-mono text-[11px] font-bold text-[#8888aa] tracking-widest uppercase mb-4 flex items-center gap-2">
                    <Database size={12} />
                    資料分析站 · 方法指南
                </div>
                <h1 className="font-serif text-[40px] font-bold leading-[1.2] text-[#1a1a2e] mb-5 tracking-[-0.01em]">
                    資料蒐集完了，<span className="text-[#2d5be3]">然後呢？</span>
                </h1>
                <p className="text-[16px] text-[#4a4a6a] leading-relaxed">
                    選擇你的研究方法，取得對應的分析步驟與 AI Prompt。每個 Prompt 都設計好了，直接複製、貼上你的資料，就能開始分析。
                </p>
            </div>

            {/* FOUNDATION SECTION (collapsible) */}
            <div className="mb-8 border border-[#dddbd5] rounded-[6px] overflow-hidden">
                <button
                    onClick={() => setShowFoundation(!showFoundation)}
                    className="w-full flex items-center justify-between px-5 py-4 bg-[#f0ede6] hover:bg-[#e8e4dd] transition-colors"
                >
                    <div className="flex items-center gap-3">
                        <Brain size={16} className="text-[#1a1a2e]" />
                        <span className="text-[13px] font-bold text-[#1a1a2e]">📘 必讀基礎：數據分析的三層次 + 三個地雷</span>
                        <span className="text-[10px] font-mono text-[#8888aa] border border-[#dddbd5] px-2 py-0.5 rounded bg-white">
                            所有方法通用
                        </span>
                    </div>
                    {showFoundation
                        ? <ChevronUp size={16} className="text-[#8888aa]" />
                        : <ChevronDown size={16} className="text-[#8888aa]" />
                    }
                </button>

                {showFoundation && (
                    <div className="bg-white p-6 border-t border-[#dddbd5]">
                        {/* Three Levels */}
                        <div className="mb-6">
                            <div className="text-[11px] font-bold text-[#1a1a2e] uppercase tracking-widest mb-4">數據分析的三個層次</div>
                            <div className="grid grid-cols-3 gap-0 border border-[#dddbd5] rounded-[6px] overflow-hidden">
                                {[
                                    { num: '01', label: '描述 Describe', desc: '數據顯示什麼？只陳述事實。', eg: '「60% 的受訪者表示⋯⋯」', color: 'bg-blue-600' },
                                    { num: '02', label: '詮釋 Interpret', desc: '這代表什麼意義？提出解釋（用「可能」、「或許」）。', eg: '「這可能反映了⋯⋯的趨勢」', color: 'bg-violet-600' },
                                    { num: '03', label: '批判 Critique', desc: '這個發現有什麼限制？和文獻的關聯是？', eg: '「然而，本研究的樣本限制在⋯⋯」', color: 'bg-rose-600' },
                                ].map((lv, i) => (
                                    <div key={i} className="border-r last:border-r-0 border-[#dddbd5]">
                                        <div className={`${lv.color} text-white px-4 py-2 flex items-center gap-2`}>
                                            <span className="font-mono text-[10px] font-bold opacity-70">{lv.num}</span>
                                            <span className="text-[12px] font-bold">{lv.label}</span>
                                        </div>
                                        <div className="px-4 py-3">
                                            <p className="text-[12px] text-[#4a4a6a] leading-relaxed mb-2">{lv.desc}</p>
                                            <div className="font-mono text-[10px] text-[#8888aa] bg-[#f0ede6] px-2.5 py-1.5 rounded border border-[#dddbd5]">{lv.eg}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Three Pitfalls */}
                        <div>
                            <div className="text-[11px] font-bold text-[#1a1a2e] uppercase tracking-widest mb-4">分析地雷區 💣</div>
                            <div className="grid grid-cols-1 gap-3">
                                {[
                                    { icon: '⚠️', title: '相關 ≠ 因果', desc: '愛吃早餐的學生成績比較好，不代表吃早餐讓成績變好。可能有「第三變項」（如社經地位）同時影響兩者。' },
                                    { icon: '⚠️', title: '樣本不代表全體', desc: '訪談了 3 位松山高中學生，不能說「全台灣高中生都認為⋯⋯」。推論必須限縮在你真正調查的範圍內。' },
                                    { icon: '⚠️', title: '選擇性報告（Cherry-picking）', desc: '數據和假設相反時，不能假裝沒看到。「意外的發現」往往比符合預期的結果更有研究價值。' },
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-3 p-3 border border-amber-200 bg-amber-50 rounded-[4px]">
                                        <span className="text-[18px] shrink-0">{item.icon}</span>
                                        <div>
                                            <div className="text-[12px] font-bold text-amber-900 mb-1">{item.title}</div>
                                            <div className="text-[12px] text-amber-800 leading-relaxed">{item.desc}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* METHOD TABS */}
            <div className="mb-6">
                <div className="text-[11px] font-mono text-[#8888aa] uppercase tracking-widest mb-3">選擇你的研究方法</div>
                <div className="flex gap-2 flex-wrap">
                    {METHODS.map(m => {
                        const MIcon = m.icon;
                        const isActive = m.id === activeMethod;
                        return (
                            <button
                                key={m.id}
                                onClick={() => setActiveMethod(m.id)}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-[6px] text-[13px] font-bold border transition-all ${isActive
                                    ? 'bg-[#1a1a2e] text-white border-[#1a1a2e] shadow-md'
                                    : 'bg-white text-[#4a4a6a] border-[#dddbd5] hover:border-[#1a1a2e] hover:text-[#1a1a2e]'
                                    }`}
                            >
                                <span>{m.emoji}</span>
                                <span>{m.label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* METHOD CONTENT */}
            <div className="bg-white border border-[#dddbd5] rounded-[8px] overflow-hidden">

                {/* Method Header */}
                <div className="bg-[#1a1a2e] px-6 py-5 flex items-start gap-4">
                    <div className="bg-white/10 p-2.5 rounded-[6px]">
                        <Icon size={24} className="text-white" />
                    </div>
                    <div>
                        <div className="text-[10px] font-mono font-bold text-white/50 uppercase tracking-widest mb-1">
                            分析方法指南
                        </div>
                        <div className="text-[20px] font-bold text-white mb-2">
                            {method.emoji} {method.label}數據分析
                        </div>
                        <p className="text-[13px] text-white/65 leading-relaxed max-w-[600px]">
                            {method.overview}
                        </p>
                    </div>
                </div>

                <div className="p-6">

                    {/* Prompts */}
                    <div className="mb-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Zap size={14} className="text-[#c9a84c]" />
                            <span className="text-[11px] font-bold text-[#1a1a2e] uppercase tracking-widest">AI 分析 Prompts</span>
                            <span className="text-[10px] text-[#8888aa] font-mono">點右上角「複製」直接貼到 AI</span>
                        </div>
                        {method.steps.map(step => (
                            <PromptBox key={step.step} step={step.step} title={step.title} prompt={step.prompt} />
                        ))}
                    </div>

                    {/* Pitfalls */}
                    <div className="mb-6">
                        <div className="flex items-center gap-2 mb-4">
                            <AlertTriangle size={14} className="text-amber-600" />
                            <span className="text-[11px] font-bold text-[#1a1a2e] uppercase tracking-widest">常見陷阱</span>
                        </div>
                        {method.pitfalls.map((p, i) => (
                            <Pitfall key={i} title={p.title} bad={p.bad} good={p.good} />
                        ))}
                    </div>

                    {/* Checklist */}
                    <Checklist items={method.checklist} />
                </div>
            </div>

            {/* BOTTOM NAV */}
            <div className="mt-10 flex items-center justify-between pt-8 border-t border-[#dddbd5]">
                <Link
                    to="/w13"
                    className="flex items-center gap-2 text-[12px] text-[#8888aa] hover:text-[#1a1a2e] transition-colors font-mono"
                >
                    ← 研究執行 II（W13）
                </Link>
                <Link
                    to="/w14"
                    className="flex items-center gap-2 px-5 py-2.5 bg-[#1a1a2e] text-white text-[13px] font-bold rounded-[6px] hover:bg-[#2d2d4e] transition-colors"
                >
                    <span>前往 W14 數據轉譯</span>
                    <ArrowRight size={14} />
                </Link>
            </div>
        </div>
    );
};

export default DataAnalysisStation;
