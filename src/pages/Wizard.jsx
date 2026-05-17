import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import CourseArc from '../components/ui/CourseArc';
import ThinkRecord, { readRecords, STORAGE_KEY } from '../components/ui/ThinkRecord';
import AIREDNarrative from '../components/ui/AIREDNarrative';
import ThinkChoice from '../components/ui/ThinkChoice';
import StepEngine from '../components/ui/StepEngine';
import HeroBlock from '../components/ui/HeroBlock';
import TaskCard from '../components/ui/TaskCard';
import ResetWeekButton from '../components/ui/ResetWeekButton';
import CopyButton from '../components/ui/CopyButton';
import StepBriefing from '../components/ui/StepBriefing';
import AIAssistToggle from '../components/ui/AIAssistToggle';
import BackfillField from '../components/ui/BackfillField';
import {
    Map,
    ArrowRight,
    ShieldAlert,
    CheckCircle2,
} from 'lucide-react';
import LessonMap from '../components/ui/LessonMap';
import { W3Data } from '../data/lessonMaps';
import { ModeProvider, useMode } from '../context/ModeContext';
import { useProjector } from '../context/ProjectorContext';
import ModeSwitch from '../components/ui/ModeSwitch';
import DepthBlock from '../components/ui/DepthBlock';
import ContentTypeChip from '../components/ui/ContentTypeChip';
import RecordDrawer from '../components/ui/RecordDrawer';
import ExportButton from '../components/ui/ExportButton';
import './Wizard.css';

/* ── 資料常數 ── */

const DISEASES = [
    { c: 'A', e: '🌫️', n: '抽象哲學病', s: '題目太玄、定義不清，無法測量' },
    { c: 'B', e: '🔮', n: '算命占卜病', s: '試圖預測未來還沒發生的事' },
    { c: 'C', e: '📚', n: '百科全書病', s: '題目範圍太大，網路查就有答案' },
    { c: 'D', e: '😤', n: '主觀偏見病', s: '題目帶有強烈預設立場，不客觀' },
    { c: 'E', e: '🥱', n: '是非題病', s: '答案只有「有/沒有」，顯而易見' },
    { c: 'F', e: '👻', n: '接觸不到病', s: '對象已過世、太大咖、接觸不到（俗稱觀落陰病）' },
    { c: 'G', e: '🚫', n: '方法無效病', s: '無法透過觀察、實驗、問卷驗證' },
    { c: 'H', e: '🎰', n: '變因失控病', s: '影響因素太多太雜，無法控制' },
];

const MANTRA_ROWS = [
    { f: '大', t: '小', d: '範圍縮小' },
    { f: '空', t: '實', d: '抽象具體化' },
    { f: '遠', t: '近', d: '對象可及化' },
    { f: '難', t: '易', d: '方法可行化' },
];

const MANTRA_MAP = [
    { id: 'A', m: '空 → 實' },
    { id: 'B', m: '遠 → 近（未來→現在）' },
    { id: 'C', m: '大 → 小' },
    { id: 'D', m: '難 → 易（主觀→客觀）' },
    { id: 'E', m: '空 → 實（有無→程度）' },
    { id: 'F', m: '遠 → 近（換找得到的）' },
    { id: 'G', m: '難 → 易（形→可觀察）' },
    { id: 'H', m: '大→小 + 難→易' },
];

/* 4 把刀的下刀心路歷程（看示範怎麼想、再做自己題目） */
const CUT_MENTAL_FLOWS = [
    {
        id: 'small',
        name: '範圍縮小',
        arrow: '大 → 小',
        icon: '🔍',
        sampleTopic: '探討追星文化',
        monologue: [
            '咦……「追星文化」太大了，到底是說什麼？',
            '是「追誰」？K-POP？J-POP？台灣藝人？歐美？　🤔 要挑一類',
            '是「誰在追」？所有人？高中生？我們學校？哪一年級？　🤔 要縮對象',
            '是「哪個面向」？消費（買周邊）？應援（集資、演唱會）？情感投入？資訊追蹤？　🤔 要鎖一個',
            '是「什麼時候」？常態？新專輯發行期？　🤔 看你關心哪段',
        ],
        revised: '本校高一學生對 K-POP 偶像的「應援行為」（買周邊／集資／演唱會）',
        bottomLine: '縮的不是研究的價值，是「我有辦法做到的範圍」。三層篩到「四週收得到資料」就停。',
    },
    {
        id: 'concrete',
        name: '抽象具體化',
        arrow: '空 → 實',
        icon: '💡',
        sampleTopic: '探討高中生的快樂感',
        monologue: [
            '等等……「快樂感」是什麼？我看不見、摸不到，怎麼測？',
            '我能不能換個說法——「什麼東西出現了」代表他「快樂」？　🤔',
            '是「笑得多」？「主動找朋友聊天」？「願意去活動」？　🤔 這些可以看到',
            '還是用「問卷」測？有沒有現成的「滿意度量表」「幸福感量表」？　🤔 站在巨人肩上比較穩',
            '還是用「數字」？「每週開心時刻次數」？「自陳分數 1-5 分」？　🤔 可以量化',
            '最後問自己：換誰來測都會得到一樣的結果嗎？',
        ],
        revised: '本校高一追星族「每週投入時間」（看影片／買周邊／應援次數）＋「主觀幸福感量表分數」',
        bottomLine: '抽象詞像影子——你抓不到影子，要先找到影子代表的「看得到的東西」。',
    },
    {
        id: 'near',
        name: '對象可及化',
        arrow: '遠 → 近',
        icon: '🚪',
        sampleTopic: '2030 年最熱門的職業',
        monologue: [
            '等等……2030 年還沒到，我怎麼研究還沒發生的事？',
            '我能找誰預測？產業專家？　🤔 太遠了，找不到',
            '我能查哪些「現在正在成長」的職業推測未來？　🤔 可以但是二手資料',
            '那我「真的能做的」是什麼？',
            '「現在的學生」對 2030 年的「想像」？　🤔 拉回現在的人',
            '「現在學長姐」怎麼看自己職涯？　🤔 找得到的人',
            '最後問自己：4 週內聯絡得到、訪到、收得到回應嗎？',
        ],
        revised: '本校高一學生「目前最嚮往的職涯方向」＋為什麼（拉回現在 + 找得到的人）',
        bottomLine: '高一只有 4-6 週執行——再有意義的題目，找不到人 = 做不出來。',
    },
    {
        id: 'easy',
        name: '方法可行化',
        arrow: '難 → 易',
        icon: '🔪',
        sampleTopic: '探討高中生課堂的專注度',
        monologue: [
            '等等……我要問學生「你專心嗎」？',
            '對方會誠實講嗎？　🤔 多半會說「我有專心」（社會期許）',
            '改個方向——我能「看」到什麼？',
            '看「視線」：眼睛停留書本秒數',
            '看「行為」：滑手機、發呆、抬頭次數',
            '看「頻率」：每 5 分鐘一筆紀錄',
            '最後問自己：兩個觀察員看同一場面，記錄會一樣嗎？',
        ],
        revised: '觀察晚自習 30 分鐘內，學生「視線停留書本 ≥ 30 秒次數」＋「滑手機 ≥ 5 秒次數」',
        bottomLine: '不是所有事都該用「問」——有些事「動作比話可信」。問不出來、改觀察。',
    },
];

const PATIENTS = [
    { id: 'a1', n: '1', t: '吃早餐對學測成績的影響', ans: 'H', explain: '影響學測成績的因素太多，無法只控制早餐這一個變因。' },
    { id: 'a2', n: '2', t: '探究幸福的真諦', ans: 'A', explain: '「幸福」太抽象，無法測量，研究無從下手。' },
    { id: 'a3', n: '3', t: '訪談愛因斯坦對相對論的看法', ans: 'F', explain: '對象已過世 140 多年，接觸不到。' },
    { id: 'a4', n: '4', t: '為什麼團隊合作比單打獨鬥更好？', ans: 'D', explain: '預定「合作更好」，帶有強烈主觀立場。' },
    { id: 'a5', n: '5', t: '高中生有沒有在使用手機？', ans: 'E', explain: '答案顯而易見，「有」，研究毫無意義。' },
    { id: 'a6', n: '6', t: '全球暖化的成因與防治', ans: 'C', explain: '範圍橫跨全球，資料網路查就有，不需要研究。' },
    { id: 'a7', n: '7', t: '上帝真的存在嗎？', ans: 'G', explain: '無法透過觀察、問卷、實驗任何方式驗證。' },
    { id: 'a8', n: '8', t: '2028 年奧運誰會拿金牌？', ans: 'B', explain: '預測未來尚未發生的事，無從驗證。' },
];

const DISEASE_LABELS = DISEASES.reduce((m, d) => { m[d.c] = { n: d.n, e: d.e }; return m; }, {});

const DRILL_GREEN = ['探究美的本質', '本校學生有沒有在用社群媒體？', '2030 年最熱門的工作', '全球暖化的成因與解決', '本校學生有沒有在段考前熬夜？', '本校學生有沒有在上課偷滑手機？', '為什麼我們班那麼吵？', '高中生為什麼很常遲到？', '高中福利社為什麼都很難吃？', '高中生是不是都會熬夜？'];
const DRILL_YELLOW = ['為什麼現代人越來越不快樂？', '人類存在的意義', '為什麼讀書比打電動更好？', '台灣的教育制度好不好？', '訪談賈伯斯的創新理念', '為什麼高中生上課都不專心？', '為什麼段考週壓力特別大？', '為什麼有些老師上課很無聊？', '為什麼班上同學不愛運動？', '為什麼社團活動常常辦不出成效？'];
const DRILL_RED = ['早餐對人生成就的影響', '靈魂到底存不存在？', '手機使用對學業成績的影響', '滑手機會不會讓人變笨？', '補習到底有沒有用？', '高中生談戀愛會影響成績？', 'IG / 抖音讓高中生焦慮嗎？', '為什麼有些同學天生較會讀書？', '訪談現任總統對教改看法', '為什麼有些人天生較聰明？'];

/* ── Part 5：自己題目的 AI 協作三個 Prompt ── */
/* 診斷 Prompt 與學生課堂學到的 8 病症語言對齊（不要讓 AI 自創分類） */
const MY_DIAGNOSE_PROMPT = `我有一個研究題目想請你診斷。
我的題目是：【在這裡貼上你的題目初稿】

我的課堂用以下「8 種題目病症」來診斷：
A 抽象哲學病（題目太玄、定義不清、無法測量）
B 算命占卜病（試圖預測未來還沒發生的事）
C 百科全書病（題目範圍太大、網路查就有答案）
D 主觀偏見病（題目帶強烈預設立場、不客觀）
E 是非題病（答案只有「有／沒有」、顯而易見）
F 接觸不到病（對象已過世、太大咖、接觸不到）
G 方法無效病（無法觀察、實驗、問卷驗證）
H 變因失控病（影響因素太多太雜、無法控制）

請你只做診斷，不要幫我修改。請告訴我：
1. 我的題目最可能得了哪些病（可複選，請標 A-H 代碼 + 病名）
2. 核心問題一句話說明。
3. 如果 8 病都不完全貼合，才額外補充你看到的問題。

請全程用 A-H 病症代碼回答，不要另外自創分類。不要給我修改版本。`;

const MY_FIX3_PROMPT = `謝謝你的診斷。
現在請根據剛才的診斷，給我 3 個不同的修改方向。

要求：
1. 三個方向要明顯不同，不是同一個想法的微調
2. 每個方向說明：改了什麼、為什麼這樣改
3. 每個版本保持在 30 字以內，確保高中生做得到
4. 不要幫我選，讓我自己決定`;

const HINT_ITEMS = [
    { f: '大 → 小', t: '範圍太廣 → 縮到本校/年級/某班' },
    { f: '空 → 實', t: '太抽象 → 換成可測量指標' },
    { f: '遠 → 近', t: '找不到人 → 換成找得到的人' },
    { f: '難 → 易', t: '變因太多 → 改成短期指標/聚焦單一' },
];

const EXPORT_FIELDS = [
    { key: 'w3-obstacle-feel', label: '碰壁體驗', question: '看完兩題碰壁情境後，你覺得「題目生病」是什麼感覺？' },
    { key: 'w3-disease-quiz', label: '病症快問快答', question: '選一個你覺得最難判斷的病症，說說為什麼難。' },
    { key: 'w3-cut-practice-cut', label: '練手題：選用的處方', question: '對「探討高中生使用社群媒體的影響」你選哪一把刀？' },
    { key: 'w3-cut-practice', label: '練手題：你的改寫', question: '用你選的刀，下刀改寫一次' },
    { key: 'w3-drill-personal', label: '人腦練習（個人）', question: '自選一題爛題目，診斷是什麼病？用心法怎麼改？' },
    { key: 'w3-drill-group', label: '小組診斷', question: '小組選了哪一題？一起怎麼改的？' },
    /* Part 4：回到自己的題目 */
    { key: 'w3-own-diagnose', label: 'Part 4 ①② 確認具體＋病症診斷', question: '題目夠具體嗎？它得了哪幾種病（A–H）？' },
    { key: 'w3-own-fix', label: 'Part 4 ③④ 選心法＋改法初稿', question: '選哪把刀？初步怎麼改？' },
    { key: 'w3-own-5w1h', label: 'Part 4 5W1H 切開題目', question: '用 Who/Where/What/How/When 切開你的題目' },
    { key: 'w3-own-revised', label: 'Part 4 修改版題目', question: '用 5W1H 切開後，你的修正版題目是？' },
    /* Part 5：AI 協作磨定案（4 步精簡版）*/
    { key: 'w3-p5-draft', label: 'Part 5 第一輪 初稿', question: '根據 Part 4，我修改後的題目初稿是？' },
    { key: 'w3-p5-diagnose-ai-record', label: 'Part 5 第二輪 AI 診斷 + 我的比對', question: 'AI 診斷出什麼？跟我 Part 4 的診斷哪裡不一樣？我更認同誰？' },
    { key: 'w3-p5-fix3-ai-record', label: 'Part 5 第三輪 AI 三方案記錄', question: 'AI 給的三個方向分別是？第一眼覺得哪個最有希望？' },
    { key: 'w3-final-topic', label: 'W3 最終定案題目', question: '我選哪個方向、最終定案題目、理由——這就是你這學期的研究起點' },
    { key: 'w3-motivation', label: 'W3 研究動機（為什麼想研究這個）', question: '一句話講清楚——這個題目對誰有意義？為什麼你願意花一學期做？' },
    { key: 'w3-aired-record', label: 'AI-RED 敘事紀錄', question: '本週最重要的一次 AI 互動（A-I-R-E-D 五要素）' },
    { key: 'w3-reflect-misdiagnosis', label: '反思：最易誤診的病症', question: '8 病症裡，你最容易誤診的是哪一個？為什麼？' },
    { key: 'w3-reflect-cuts', label: '反思：你走過幾把刀', question: '你的題目走過哪幾把刀（縮小／具體化／可及化／可行化）？最後落點為什麼是這裡？' },
];

/* ── Part 5 第三輪：顯示 Part 4 Section A 的診斷作 reference，讓學生不用回頭翻 ── */
function P5CompareRef() {
    const [ownDiagnose, setOwnDiagnose] = useState('');
    const [ownFix, setOwnFix] = useState('');

    const refresh = useCallback(() => {
        const records = readRecords();
        setOwnDiagnose((records['w3-own-diagnose'] || '').trim());
        setOwnFix((records['w3-own-fix'] || '').trim());
    }, []);

    useEffect(() => {
        refresh();
        window.addEventListener('focus', refresh);
        return () => window.removeEventListener('focus', refresh);
    }, [refresh]);

    if (!ownDiagnose && !ownFix) return null;

    return (
        <div className="mb-4 p-4 bg-[var(--paper-warm)] border border-[var(--border)] rounded-[var(--radius-unified)] space-y-2">
            <div className="text-[11px] font-mono text-[var(--ink-light)] uppercase tracking-wider">📎 你 Part 4 的自診（不用再寫一次）</div>
            {ownDiagnose && (
                <div>
                    <span className="text-[10px] font-mono text-[var(--ink-light)] uppercase tracking-wider">病症診斷</span>
                    <p className="text-[13px] text-[var(--ink)] whitespace-pre-wrap leading-relaxed mt-0.5">{ownDiagnose}</p>
                </div>
            )}
            {ownFix && (
                <div>
                    <span className="text-[10px] font-mono text-[var(--ink-light)] uppercase tracking-wider">改法方向</span>
                    <p className="text-[13px] text-[var(--ink)] whitespace-pre-wrap leading-relaxed mt-0.5">{ownFix}</p>
                </div>
            )}
        </div>
    );
}

/* ── Part 5 第一輪：自動帶入 Part 4 修改版題目 ── */
function P5DraftField() {
    const [ownRevised, setOwnRevised] = useState('');
    const [draftKey, setDraftKey] = useState(0);

    const refresh = useCallback(() => {
        const records = readRecords();
        const rev = (records['w3-own-revised'] || '').trim();
        const draft = (records['w3-p5-draft'] || '').trim();
        setOwnRevised(rev);
        // 若 Part 4 有值、Part 5 初稿還空，把 Part 4 版本寫進 Part 5 初稿
        if (rev && !draft) {
            records['w3-p5-draft'] = rev;
            try { localStorage.setItem(STORAGE_KEY, JSON.stringify(records)); } catch { /* ignore */ }
            setDraftKey(k => k + 1); // 強制 ThinkRecord 重 mount 以讀取新值
        }
    }, []);

    useEffect(() => {
        refresh();
        // 視窗重新取得焦點時再跑一次（學生從 AI 工具切回網頁）
        window.addEventListener('focus', refresh);
        return () => window.removeEventListener('focus', refresh);
    }, [refresh]);

    const forceInject = () => {
        if (!ownRevised) return;
        const records = readRecords();
        records['w3-p5-draft'] = ownRevised;
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(records)); } catch { /* ignore */ }
        setDraftKey(k => k + 1);
    };

    return (
        <>
            {!ownRevised && (
                <div className="mb-4">
                    <BackfillField
                        dataKey="w3-own-revised"
                        label="⚠️ 還沒偵測到 Part 4 的修改版題目——把你前面寫的修改版題目貼這裡，下方初稿欄會自動帶入；或直接跳過、在下方欄位打字。"
                        placeholder="例：本校高一學生在段考前一週的夜間手機使用時數，與隔日上午第一節專注力自評之間的相關性。"
                        buttonLabel="補上修改版"
                    />
                </div>
            )}
            <ThinkRecord
                key={`p5-draft-${draftKey}`}
                dataKey="w3-p5-draft"
                prompt="我的題目初稿（從 Part 4 帶過來，可再精修）"
                placeholder="例：本校高一學生在段考前一週的夜間手機使用時數，與隔日上午第一節專注力自評之間的相關性。"
                rows={3}
            />
        </>
    );
}

/* ── 4 把刀心路歷程展開卡（學生先想 30 秒、再點開看示範）── */
function CutFlowCard({ flow }) {
    const [open, setOpen] = useState(false);
    return (
        <div className="bg-white border border-[var(--border)] rounded-[var(--radius-unified)] p-4 flex flex-col">
            <div className="flex items-center gap-2 mb-2.5">
                <span className="text-[22px]">{flow.icon}</span>
                <div>
                    <p className="text-[13px] font-bold text-[var(--ink)] leading-tight">{flow.name}</p>
                    <p className="text-[11px] font-mono text-[var(--gold)] mt-0.5">{flow.arrow}</p>
                </div>
            </div>
            <div className="bg-[#FEF2F2] border-l-3 border-[#DC2626] p-2.5 rounded-r-[6px] mb-2">
                <p className="text-[10px] font-mono text-[#7F1D1D] mb-0.5 uppercase tracking-wider">原題（爛版本）</p>
                <p className="text-[12.5px] font-bold text-[#7F1D1D]">{flow.sampleTopic}</p>
            </div>
            <p className="text-[11px] italic text-[var(--ink-light)] mb-2 leading-relaxed">💭 先自己想 30 秒：「這題哪裡卡？該下哪一刀？」</p>
            <button
                type="button"
                onClick={() => setOpen(!open)}
                className="w-full text-[11.5px] font-bold text-[var(--accent)] py-1.5 border border-dashed border-[var(--accent)]/50 rounded-[6px] hover:bg-[var(--accent)]/5 transition-colors mb-2"
            >
                {open ? '▲ 收起心路歷程' : '▼ 點開看下刀心路歷程'}
            </button>
            {open && (
                <div className="space-y-2.5">
                    <div className="bg-[#FEF3C7] border-l-3 border-[#D97706] p-3 rounded-r-[6px]">
                        <p className="text-[11px] font-bold text-[#92400E] mb-1.5">🧠 老練研究者腦中該這樣想</p>
                        <ul className="text-[11.5px] text-[#78350F] leading-[1.85] space-y-0.5 list-none pl-0">
                            {flow.monologue.map((line, i) => (
                                <li key={i}>{line}</li>
                            ))}
                        </ul>
                    </div>
                    <div className="bg-[#ECFDF5] border-l-3 border-[#10B981] p-3 rounded-r-[6px]">
                        <p className="text-[11px] font-bold text-[#065F46] mb-1">✓ 收斂後（示範改寫）</p>
                        <p className="text-[12px] text-[var(--ink)] font-bold leading-[1.7]">{flow.revised}</p>
                    </div>
                    <p className="text-[10.5px] italic text-[var(--ink-light)] leading-relaxed">
                        💡 <strong>{flow.bottomLine}</strong>
                    </p>
                </div>
            )}
        </div>
    );
}

/* ── 練手題：學生自己下刀 + 強制比對示範 ── */
const PRACTICE_TOPIC = '探討高中生使用社群媒體的影響';
const PRACTICE_SAMPLE = '本校高一學生「睡前 30 分鐘 IG／TikTok 使用時數」對「隔日第一節課精神狀態（自評 1-5 分）」的影響';
const PRACTICE_ANALYSIS = '主要用了「範圍縮小」（高中生→本校高一、社群媒體→IG/TikTok、任何時候→睡前 30 分鐘）+「抽象具體化」（影響→隔日精神狀態自評分數）。其實不只一刀——複雜題目通常要組合下刀。';

const CUT_OPTIONS = [
    { id: 'small', name: '範圍縮小', arrow: '大→小' },
    { id: 'concrete', name: '抽象具體化', arrow: '空→實' },
    { id: 'near', name: '對象可及化', arrow: '遠→近' },
    { id: 'easy', name: '方法可行化', arrow: '難→易' },
];

function CutPractice() {
    const [selectedCut, setSelectedCut] = useState('');
    const [showSample, setShowSample] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    // 從 localStorage 讀取已選的刀（讓重新整理也保留）
    useEffect(() => {
        const saved = readRecords();
        const cut = saved['w3-cut-practice-cut']?.trim();
        if (cut) setSelectedCut(cut);
    }, []);

    // 選刀時即時寫入 localStorage
    const handleCutChange = useCallback((cutId) => {
        setSelectedCut(cutId);
        const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
        all['w3-cut-practice-cut'] = cutId;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    }, []);

    const handleShowSample = () => {
        if (!selectedCut) {
            setErrorMsg('請先選一把主刀，再看示範。');
            return;
        }
        const records = readRecords();
        const myRewrite = records['w3-cut-practice']?.trim() || '';
        if (myRewrite.length < 15) {
            setErrorMsg(`先自己改寫一次再看示範——目前 ${myRewrite.length} 字，至少寫 15 字（先想再看，效果才好）。`);
            return;
        }
        setErrorMsg('');
        setShowSample(true);
    };

    return (
        <div className="bg-white border-2 border-[var(--accent)] rounded-[var(--radius-unified)] p-5 mt-6 max-w-[760px]">
            <h4 className="text-[15px] font-bold text-[var(--ink)] mb-1 flex items-center gap-1.5">
                <span>✏️</span> 練手題：你來下刀
            </h4>
            <p className="text-[12px] text-[var(--ink-mid)] mb-3 leading-relaxed">
                看完示範後，輪到你動手——選一把刀、改寫一次、再對照示範。<strong className="text-[var(--ink)]">寫完才能看示範</strong>（先想再看）。
            </p>

            <div className="bg-[#FEF2F2] border-l-3 border-[#DC2626] p-3 rounded-r-[6px] mb-4">
                <p className="text-[10px] font-mono text-[#7F1D1D] mb-0.5 uppercase tracking-wider">爛題目</p>
                <p className="text-[14px] font-bold text-[#7F1D1D]">{PRACTICE_TOPIC}</p>
            </div>

            <div className="mb-4">
                <p className="text-[12.5px] font-bold text-[var(--ink)] mb-2">① 選刀：你覺得這題該下哪一把刀？</p>
                <div className="grid grid-cols-2 gap-2">
                    {CUT_OPTIONS.map(c => (
                        <label
                            key={c.id}
                            className={`flex items-center gap-2 px-3 py-2 border rounded-[6px] cursor-pointer transition-colors ${
                                selectedCut === c.id
                                    ? 'border-[var(--accent)] bg-[var(--accent)]/5'
                                    : 'border-[var(--border)] hover:border-[var(--accent)]/50'
                            }`}
                        >
                            <input
                                type="radio"
                                name="cut-practice"
                                value={c.id}
                                checked={selectedCut === c.id}
                                onChange={() => handleCutChange(c.id)}
                                className="accent-[var(--accent)]"
                            />
                            <span className="text-[12.5px] text-[var(--ink)]">
                                <strong>{c.name}</strong>
                                <span className="text-[10px] font-mono text-[var(--gold)] ml-1">（{c.arrow}）</span>
                            </span>
                        </label>
                    ))}
                </div>
                <p className="text-[10.5px] italic text-[var(--ink-light)] mt-2">💡 先選一把主刀就好——複雜題目雖然常要組合多把刀，但這裡先練一把，改寫時其他刀會自然帶進來。</p>
            </div>

            <div className="mb-4">
                <p className="text-[12.5px] font-bold text-[var(--ink)] mb-2">② 改寫：用你選的刀，下刀改寫</p>
                <ThinkRecord
                    dataKey="w3-cut-practice"
                    prompt="寫一個你覺得「能研究」的版本（至少 15 字）"
                    placeholder="例：本校高一學生睡前 30 分鐘 IG 使用時數對隔日精神的影響"
                    scaffold={['本校 / 本年級 ___ 學生', '在 ___ 時段／場景', '的 ___（具體可測指標）']}
                    rows={3}
                />
            </div>

            {!showSample ? (
                <>
                    <button
                        type="button"
                        onClick={handleShowSample}
                        className="w-full bg-[var(--accent)] hover:opacity-90 text-white font-bold py-2.5 rounded-[6px] text-[13px] transition-opacity"
                    >
                        ✅ 寫完了！看示範對照
                    </button>
                    {errorMsg && (
                        <p className="text-[12px] text-[#DC2626] font-bold mt-2 leading-relaxed">⚠️ {errorMsg}</p>
                    )}
                </>
            ) : (
                <div className="space-y-3">
                    <div className="bg-[#ECFDF5] border-l-3 border-[#10B981] p-3 rounded-r-[6px]">
                        <p className="text-[10px] font-mono text-[#065F46] mb-1 uppercase tracking-wider">示範改寫</p>
                        <p className="text-[13px] font-bold text-[var(--ink)] leading-[1.7]">{PRACTICE_SAMPLE}</p>
                    </div>
                    <div className="bg-[var(--paper-warm)] border border-[var(--border)] p-3 rounded-[6px]">
                        <p className="text-[11px] font-bold text-[var(--ink-mid)] mb-1">📝 示範用了什麼刀</p>
                        <p className="text-[12px] text-[var(--ink-mid)] leading-[1.85]">{PRACTICE_ANALYSIS}</p>
                    </div>
                    <div className="bg-[#FEF3C7] border-l-3 border-[#D97706] p-3 rounded-r-[6px]">
                        <p className="text-[11px] font-bold text-[#92400E] mb-1">💭 想想：你跟示範差在哪？</p>
                        <p className="text-[11.5px] text-[#78350F] leading-[1.85]">沒對錯——你的版本可能更貼合自己關心的角度（例如關心『心理健康』vs『學業』）。但要問自己：<strong>我的版本，4 週內收得到資料嗎？</strong>收不到、就再下一刀。</p>
                    </div>
                    <button
                        type="button"
                        onClick={() => setShowSample(false)}
                        className="w-full text-[11.5px] text-[var(--accent)] py-1.5 border border-dashed border-[var(--accent)]/40 rounded-[6px] hover:bg-[var(--accent)]/5"
                    >
                        ▲ 收起示範（想再改寫一次）
                    </button>
                </div>
            )}
        </div>
    );
}

/* ── 主組件 ── */

const WizardContent = () => {
    const { mode } = useMode();
    const { projector } = useProjector();
    const [showLessonMap, setShowLessonMap] = useState(false);
    const [obstacleStates, setObstacleStates] = useState({ a: false, b: false });
    const [diagnoses, setDiagnoses] = useState({});
    const [choiceResults, setChoiceResults] = useState([]);

    // Part 2 抽題機
    const [drillLevel, setDrillLevel] = useState('green');  // green | yellow | red
    const [drillTopic, setDrillTopic] = useState(null);
    const [drillLocked, setDrillLocked] = useState(false);  // 確定選題後鎖定
    const [drillGroupTopic, setDrillGroupTopic] = useState(null);
    const [drillGroupLocked, setDrillGroupLocked] = useState(false);

    // Part 4：帶入 W2 最終探究意圖
    const [w2Intent, setW2Intent] = useState('');
    useEffect(() => {
        const refresh = () => {
            const records = readRecords();
            setW2Intent((records['w2-final-intent'] || '').trim());

            // 跨 session 自動帶入：若 Part 4 已寫了修改版、Part 5 Step 1 還空，
            // 就把 Part 4 修改版複製到 Part 5 Step 1（避免學生重打一次）
            const ownRev = (records['w3-own-revised'] || '').trim();
            const draft = (records['w3-p5-draft'] || '').trim();
            if (ownRev && !draft) {
                records['w3-p5-draft'] = ownRev;
                try { localStorage.setItem(STORAGE_KEY, JSON.stringify(records)); } catch { /* ignore */ }
            }
        };
        refresh();
        window.addEventListener('focus', refresh);
        return () => window.removeEventListener('focus', refresh);
    }, []);

    const DRILL_POOLS = { green: DRILL_GREEN, yellow: DRILL_YELLOW, red: DRILL_RED };

    const rollDrill = useCallback(() => {
        if (drillLocked) return;
        const pool = DRILL_POOLS[drillLevel];
        // 避免連續抽到同一題
        let next;
        do { next = pool[Math.floor(Math.random() * pool.length)]; } while (next === drillTopic && pool.length > 1);
        setDrillTopic(next);
    }, [drillLevel, drillTopic, drillLocked]);

    const rollGroupDrill = useCallback(() => {
        if (drillGroupLocked) return;
        // 小組只能黃卡或紅卡
        const pool = [...DRILL_YELLOW, ...DRILL_RED];
        let next;
        do { next = pool[Math.floor(Math.random() * pool.length)]; } while (next === drillGroupTopic && pool.length > 1);
        setDrillGroupTopic(next);
    }, [drillGroupTopic, drillGroupLocked]);

    const trackChoice = useCallback((question, selected, correct) => {
        setChoiceResults(prev => {
            const idx = prev.findIndex(c => c.question === question);
            const entry = { question, selected, correct };
            if (idx >= 0) { const next = [...prev]; next[idx] = entry; return next; }
            return [...prev, entry];
        });
    }, []);

    const handleDiagnose = (patientId, diseaseCode) => {
        if (diagnoses[patientId]) return; // 已作答不可更改
        setDiagnoses(prev => ({ ...prev, [patientId]: diseaseCode }));
    };

    const diagnosedCount = Object.keys(diagnoses).length;
    const correctCount = PATIENTS.filter(p => diagnoses[p.id] === p.ans).length;

    /* ── 五個步驟 ── */

    const steps = [
        /* ──────────────────────────────────────
         * STEP 1: 碰壁體驗
         * ────────────────────────────────────── */
        {
            title: '碰壁體驗',
            icon: '🏥',
            content: (
                <div className="space-y-10 prose-zh">
                    {/* 碰壁體驗 */}
                    <div>
                        <div className="w3-section-head">
                            <div className="flex items-center gap-2">
                                <ContentTypeChip type="練" />
                                <h2>碰壁體驗</h2>
                            </div>
                            <div className="line"></div><div className="mono">PHASE 0</div>
                        </div>
                        <p className="w3-section-desc">在進入診斷之前，先透過兩組情境感受一下：為什麼有些題目看起來沒問題，實作起來卻會處處碰壁？</p>
                        <StepBriefing
                            lines={[
                                { label: '節奏', text: '跟老師做' },
                                { label: '做', text: '看 2 個爛題目，試著規劃研究，感受題目「生病」的卡關感' },
                                { label: '練', text: '寫下你卡在哪、為什麼卡住' },
                            ]}
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            {/* 題目 A */}
                            <div className="border border-[var(--border)] rounded-[10px] overflow-hidden bg-white">
                                <div className="p-4 bg-[var(--paper-warm)] border-b border-[var(--border)] font-bold">題目 A</div>
                                <div className="p-5">
                                    <p className="text-[14px] font-medium text-[var(--ink)] mb-4">高中生上課使用手機的頻率，與課堂專注程度之間有什麼關係？</p>
                                    <button
                                        onClick={() => setObstacleStates(prev => ({ ...prev, a: !prev.a }))}
                                        className={`w-full py-2 text-[12px] font-bold rounded flex items-center justify-center gap-2 transition-all ${obstacleStates.a ? 'bg-[var(--danger)] text-white' : 'bg-[var(--accent-light)] text-[var(--accent)]'}`}
                                    >
                                        {obstacleStates.a ? '⚠️ 現實考驗：看似完整，但指標還不清楚' : '🔍 這是好題目嗎？試試看第一步...'}
                                    </button>
                                    {obstacleStates.a && (
                                        <div className="mt-4 p-4 bg-[var(--danger-light)] rounded-[6px] text-[12px] leading-relaxed space-y-3">
                                            <div className="text-[var(--danger)]">
                                                <strong>⚠️ 卡在哪？</strong><br />
                                                這題有兩個變項，但還沒說清楚：<br />
                                                ・「使用手機」多久算一次？<br />
                                                ・「專注程度」要用自評、觀察，還是任務表現？
                                            </div>
                                            <div className="text-[var(--accent)] pt-2 border-t border-[var(--danger)]/20">
                                                <strong>🔧 可以怎麼救？</strong><br />
                                                限定對象（哪年級／哪班）、限定時間（一節課／一天／一週），並決定專注程度的測量方式。
                                            </div>
                                            <div className="text-[var(--success)] pt-2 border-t border-[var(--danger)]/20">
                                                <strong>✅ 改寫示範</strong><br />
                                                高一學生在一節課中自評使用手機的次數，與其課後自評專注程度是否有關？
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                            {/* 題目 B */}
                            <div className="border border-[var(--border)] rounded-[10px] overflow-hidden bg-white">
                                <div className="p-4 bg-[var(--paper-warm)] border-b border-[var(--border)] font-bold">題目 B</div>
                                <div className="p-5">
                                    <p className="text-[14px] font-medium text-[var(--ink)] mb-4">與我關係親近的朋友，在社群媒體上收到的推薦內容相似程度是否更高？</p>
                                    <button
                                        onClick={() => setObstacleStates(prev => ({ ...prev, b: !prev.b }))}
                                        className={`w-full py-2 text-[12px] font-bold rounded flex items-center justify-center gap-2 transition-all ${obstacleStates.b ? 'bg-[var(--danger)] text-white' : 'bg-[var(--accent-light)] text-[var(--accent)]'}`}
                                    >
                                        {obstacleStates.b ? '⚠️ 現實考驗：有趣，但資料取得與倫理很難' : '🔍 這是好題目嗎？試試看第一步...'}
                                    </button>
                                    {obstacleStates.b && (
                                        <div className="mt-4 p-4 bg-[var(--danger-light)] rounded-[6px] text-[12px] leading-relaxed space-y-3">
                                            <div className="text-[var(--danger)]">
                                                <strong>⚠️ 卡在哪？</strong><br />
                                                這題要先說清楚：<br />
                                                ・什麼叫「關係親近」？（自評／互動頻率／同班好友？）<br />
                                                ・「推薦內容相似」怎麼比？（看同平台？截幾張？怎麼分類？）<br />
                                                ・朋友是否自願提供截圖？如何匿名、不收個資？
                                            </div>
                                            <div className="text-[var(--accent)] pt-2 border-t border-[var(--danger)]/20">
                                                <strong>🔧 可以怎麼救？</strong><br />
                                                限定平台、資料數量與分類方式（例：短影音首頁前 10 則／用主題分類），並加上自願與匿名原則。
                                            </div>
                                            <div className="text-[var(--success)] pt-2 border-t border-[var(--danger)]/20">
                                                <strong>✅ 改寫示範</strong><br />
                                                同班學生自願提供的短影音首頁前 10 則推薦中，關係較親近者的推薦主題是否較相似？
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <ThinkRecord
                            dataKey="w3-obstacle-feel"
                            prompt="看完兩題的「卡在哪／怎麼救／改寫示範」後，你覺得要把題目救活，最關鍵的一步是什麼？"
                            scaffold={['這題卡在 ___，所以無法 ___', '要救活它，第一步應該補 ___', '改寫示範跟原題的差別在於 ___']}
                            rows={3}
                        />
                    </div>

                    {/* 8 種病症 */}
                    <div>
                        <div className="w3-section-head">
                            <div className="flex items-center gap-2">
                                <ContentTypeChip type="學" />
                                <h2>8 種題目病症</h2>
                            </div>
                            <div className="line"></div><div className="mono">CONCEPT</div>
                        </div>
                        <p className="w3-section-desc">掌握 8 種常見的「題目病症」，學會看出題目哪裡有問題。</p>
                        {/* ABC vs A-H 消歧義 — orientation 說明，深度補充 */}
                        <DepthBlock title="兩套編號說明">
                            <div className="w3-notice" style={{ margin: 0 }}>
                                ⚠️ <strong>提醒</strong>：W2 的 A／B／C 是「題目<strong>句型</strong>」分類，W3 下面的 A–H 是「題目<strong>病症</strong>」分類——<strong>兩套代碼不同，不要混在一起</strong>。記病症時，記「病名」比記字母有用。
                            </div>
                        </DepthBlock>
                        <div className="w3-disease-grid">
                            {DISEASES.map(d => (
                                <div className="w3-disease-card" key={d.c}>
                                    <div className="w3-disease-code">{d.c} {d.e}</div>
                                    <div className="w3-disease-name">{d.n}</div>
                                    <div className="w3-disease-symptom">{d.s}</div>
                                </div>
                            ))}
                        </div>

                        <ThinkChoice
                            dataKey="w3-tc1"
                            prompt="下列哪個題目是「接觸不到病」（俗稱觀落陰病）？"
                            options={[
                                { label: 'A', text: '2030 年最熱門的工作是什麼？' },
                                { label: 'B', text: '訪談愛因斯坦對相對論的看法' },
                                { label: 'C', text: '高中生有沒有在使用手機？' },
                                { label: 'D', text: '探究幸福的真諦' },
                            ]}
                            answer="B"
                            feedback="接觸不到病（俗稱觀落陰病）是「對象已過世、太大咖、接觸不到」——愛因斯坦已過世 70 多年，當然訪談不到！"
                            onAnswer={(sel, ok) => trackChoice('下列哪個題目是「接觸不到病」（俗稱觀落陰病）？', sel, ok)}
                        />
                    </div>

                    {/* ➡️ 轉場：進 Step 2 急診室 */}
                    <div className="bg-[var(--paper-warm)] border-l-3 border-[var(--gold)] rounded-r-[6px] p-3 mt-4 max-w-[760px]">
                        <p className="text-[12px] text-[var(--ink-mid)] leading-relaxed">
                            💡 看完碰壁體驗——「題目會生病」這個感覺有了。下個 Step 進<strong className="text-[var(--ink)]">急診室</strong>，認識 8 種題目病症 + 練習配對診斷。
                        </p>
                    </div>
                </div>
            ),
        },

        /* ──────────────────────────────────────
         * STEP 2: 急診室 + 練習
         * ────────────────────────────────────── */
        {
            title: '急診室 + 練習',
            icon: '🔍',
            content: (
                <div className="space-y-10 prose-zh">
                    <StepBriefing
                        lines={[
                            { label: '節奏', text: '個人練習（遊戲感強，節奏快）' },
                            { label: '學', text: '8 種題目病症（範圍太大 / 太空 / 太遠 / 太難 / 太私 / 太模糊…）' },
                            { label: '練', text: '做配對練習，把病症和例題對上' },
                        ]}
                    />
                    {/* Part 1: 8 個病人 — 互動配對 */}
                    <div className="w3-task-block">
                        <div className="w3-task-hd">
                            <span className="w3-task-badge">PART 1</span>
                            <span className="w3-task-title">🏥 急診室大作戰：8 個病人</span>
                        </div>
                        <div className="w3-task-body">
                            <div className="w3-notice w3-notice-gold" style={{ marginBottom: '14px' }}>
                                每個病人得了哪種病？選出你的診斷！選完才會揭曉答案。
                            </div>

                            {/* 進度條 */}
                            <div className="flex items-center gap-3 mb-5 px-1">
                                <div className="flex-1 h-2 bg-[var(--border)] rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-[var(--accent)] rounded-full transition-all duration-500"
                                        style={{ width: `${(diagnosedCount / PATIENTS.length) * 100}%` }}
                                    />
                                </div>
                                <span className="text-[11px] font-mono text-[var(--ink-light)] flex-shrink-0">
                                    {diagnosedCount}/{PATIENTS.length}
                                </span>
                            </div>

                            <div className="w3-patient-grid">
                                {PATIENTS.map(p => {
                                    const picked = diagnoses[p.id];
                                    const isCorrect = picked === p.ans;
                                    const answered = !!picked;
                                    const correctLabel = DISEASE_LABELS[p.ans];

                                    return (
                                        <div className="w3-patient-card" key={p.id}>
                                            <div className="w3-patient-hd">
                                                <span className="w3-patient-num">病人 #{p.n}</span>
                                                {answered && (
                                                    <span className={`text-[11px] font-bold font-mono ml-auto ${isCorrect ? 'text-[var(--success)]' : 'text-[var(--danger)]'}`}>
                                                        {isCorrect ? '✓ 正確' : '✗ 再想想'}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="w3-patient-body">{p.t}</div>

                                            {/* 病症下拉選單 */}
                                            <div className="px-3 pb-3 mt-2">
                                                {!answered ? (
                                                    <select
                                                        value=""
                                                        onChange={(e) => handleDiagnose(p.id, e.target.value)}
                                                        className="w-full px-3 py-2 rounded-[var(--radius-unified)] border border-[var(--border)] bg-white text-[13px] text-[var(--ink)] focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/15 transition-all cursor-pointer"
                                                    >
                                                        <option value="" disabled>選擇你的診斷…</option>
                                                        {DISEASES.map(d => (
                                                            <option key={d.c} value={d.c}>
                                                                {d.c}. {d.e} {d.n}
                                                            </option>
                                                        ))}
                                                    </select>
                                                ) : (
                                                    <div className={`flex items-center gap-2 px-3 py-2 rounded-[var(--radius-unified)] border text-[13px] font-bold ${isCorrect ? 'bg-[var(--success-light)] border-[var(--success)] text-[var(--success)]' : 'bg-[var(--danger-light)] border-[var(--danger)] text-[var(--danger)]'}`}>
                                                        {isCorrect ? '✓' : '✗'} 你的診斷：{picked}. {DISEASE_LABELS[picked].e} {DISEASE_LABELS[picked].n}
                                                    </div>
                                                )}
                                            </div>

                                            {/* 答案揭曉 */}
                                            {answered && (
                                                <div className={`px-3 pb-3 text-[12px] leading-relaxed ${isCorrect ? 'text-[var(--success)]' : 'text-[var(--ink-mid)]'}`}>
                                                    <div className="p-3 rounded-[6px] bg-[var(--success-light)] border border-[var(--success)]/15">
                                                        <strong>{p.ans} {correctLabel.e} {correctLabel.n}</strong> — {p.explain}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            {/* 全部答完的總結 */}
                            {diagnosedCount === PATIENTS.length && (
                                <div className="mt-4 p-4 rounded-[8px] border border-[var(--accent)]/20 bg-[var(--accent-light)]">
                                    <div className="text-[14px] font-bold text-[var(--ink)] mb-1">
                                        🩺 診斷完成！答對 {correctCount} / {PATIENTS.length} 題
                                    </div>
                                    <p className="text-[12px] text-[var(--ink-mid)]">
                                        {correctCount === 8 ? '完美全對！你已經是合格的題目醫生了。' :
                                         correctCount >= 6 ? '不錯！大部分都診斷正確，繼續用心法加深印象。' :
                                         '沒關係，這些病症本來就容易搞混。回去看看萬用心法，下次更準！'}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Part 2: 人的診斷練習 — 抽題機 */}
                    <div className="w3-task-block">
                        <div className="w3-task-hd">
                            <span className="w3-task-badge">PART 2</span>
                            <span className="w3-task-title">💪 人的診斷練習（先不用 AI）</span>
                        </div>
                        <div className="w3-task-body">
                            <div className="w3-notice w3-notice-success" style={{ marginBottom: '24px' }}>
                                先知道自己能診斷到哪裡，再讓 AI 幫忙補盲點。第一節課不能開 AI，自己診斷、自己用心法改。
                            </div>

                            {/* ── 個人練習：抽題機 ── */}
                            <div className="text-[12px] font-bold font-mono text-[var(--ink-light)] mb-2 tracking-wider">SOLO · 個人練習</div>

                            {/* 難度選擇 */}
                            {!drillLocked && (
                                <div className="flex gap-2 mb-4">
                                    {[
                                        { key: 'green', label: '🟢 綠卡 新手', color: 'var(--success)' },
                                        { key: 'yellow', label: '🟡 黃卡 進階', color: 'var(--gold)' },
                                        { key: 'red', label: '🔴 紅卡 挑戰題', color: 'var(--danger)' },
                                    ].map(lv => (
                                        <button
                                            key={lv.key}
                                            onClick={() => { setDrillLevel(lv.key); setDrillTopic(null); }}
                                            className={`flex-1 py-2 text-[12px] font-bold rounded-[var(--radius-unified)] border-2 transition-all ${drillLevel === lv.key ? 'text-white' : 'bg-white text-[var(--ink-mid)]'}`}
                                            style={drillLevel === lv.key ? { backgroundColor: lv.color, borderColor: lv.color } : { borderColor: 'var(--border)' }}
                                        >
                                            {lv.label}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* 抽題結果 + 按鈕 */}
                            <div className="border border-[var(--border)] rounded-[var(--radius-unified)] overflow-hidden mb-4">
                                <div className="p-5 bg-white text-center min-h-[80px] flex items-center justify-center">
                                    {drillTopic ? (
                                        <p className={`text-[16px] font-bold text-[var(--ink)] ${drillLocked ? '' : 'animate-in fade-in duration-300'}`}>
                                            「{drillTopic}」
                                        </p>
                                    ) : (
                                        <p className="text-[14px] text-[var(--ink-light)]">按下方按鈕抽一題爛題目</p>
                                    )}
                                </div>
                                <div className="p-3 bg-[var(--paper-warm)] border-t border-[var(--border)] flex gap-2">
                                    {!drillLocked ? (
                                        <>
                                            <button
                                                onClick={rollDrill}
                                                className="flex-1 py-2 text-[13px] font-bold rounded-[var(--radius-unified)] bg-[var(--accent)] text-white hover:opacity-90 transition-all"
                                            >
                                                🎲 {drillTopic ? '再抽一題' : '抽題'}
                                            </button>
                                            {drillTopic && (
                                                <button
                                                    onClick={() => setDrillLocked(true)}
                                                    className="flex-1 py-2 text-[13px] font-bold rounded-[var(--radius-unified)] bg-[var(--success)] text-white hover:opacity-90 transition-all"
                                                >
                                                    ✓ 就這題！
                                                </button>
                                            )}
                                        </>
                                    ) : (
                                        <div className="flex-1 py-2 text-center text-[12px] font-bold text-[var(--success)] font-mono">
                                            ✓ 已鎖定
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* 鎖定後顯示作答區 */}
                            {drillLocked && (
                                <ThinkRecord
                                    dataKey="w3-drill-personal"
                                    prompt={`診斷「${drillTopic}」：是什麼病？用心法怎麼改？`}
                                    scaffold={['它的病症是…因為…', '用心法的…→…', '改成：…']}
                                    rows={4}
                                />
                            )}

                            {/* ── 小組練習：抽題機 ── */}
                            <div className="text-[12px] font-bold font-mono text-[var(--ink-light)] mb-2 mt-8 tracking-wider">TEAM · 小組練習（黃卡＋紅卡）</div>

                            <div className="border border-[var(--border)] rounded-[var(--radius-unified)] overflow-hidden mb-4">
                                <div className="p-5 bg-white text-center min-h-[80px] flex items-center justify-center">
                                    {drillGroupTopic ? (
                                        <p className={`text-[16px] font-bold text-[var(--ink)] ${drillGroupLocked ? '' : 'animate-in fade-in duration-300'}`}>
                                            「{drillGroupTopic}」
                                        </p>
                                    ) : (
                                        <p className="text-[14px] text-[var(--ink-light)]">小組一起抽一題進階題目</p>
                                    )}
                                </div>
                                <div className="p-3 bg-[var(--paper-warm)] border-t border-[var(--border)] flex gap-2">
                                    {!drillGroupLocked ? (
                                        <>
                                            <button
                                                onClick={rollGroupDrill}
                                                className="flex-1 py-2 text-[13px] font-bold rounded-[var(--radius-unified)] bg-[var(--accent)] text-white hover:opacity-90 transition-all"
                                            >
                                                🎲 {drillGroupTopic ? '再抽一題' : '抽題'}
                                            </button>
                                            {drillGroupTopic && (
                                                <button
                                                    onClick={() => setDrillGroupLocked(true)}
                                                    className="flex-1 py-2 text-[13px] font-bold rounded-[var(--radius-unified)] bg-[var(--success)] text-white hover:opacity-90 transition-all"
                                                >
                                                    ✓ 就這題！
                                                </button>
                                            )}
                                        </>
                                    ) : (
                                        <div className="flex-1 py-2 text-center text-[12px] font-bold text-[var(--success)] font-mono">
                                            ✓ 已鎖定
                                        </div>
                                    )}
                                </div>
                            </div>

                            {drillGroupLocked && (
                                <ThinkRecord
                                    dataKey="w3-drill-group"
                                    prompt={`小組診斷「${drillGroupTopic}」：什麼病？怎麼改？`}
                                    scaffold={['大家討論後覺得是…病', '理由是…', '用心法改成：…']}
                                    rows={4}
                                />
                            )}

                            {/* 萬用提示條 */}
                            <div className="w3-hint-strip mt-6">
                                <div className="w3-hint-strip-hd">🔎 萬用提示條 — 卡住就看這裡</div>
                                <div className="w3-hint-body">
                                    {HINT_ITEMS.map(h => (
                                        <div className="w3-hint-item" key={h.f}>
                                            <div className="w3-hint-from">{h.f.split(' ')[0]}</div>
                                            <div className="w3-hint-text">{h.t}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 配對診斷後反思 */}
                    <div className="flex items-center gap-2 mb-1">
                        <ContentTypeChip type="練" />
                        <span className="text-[13px] font-bold text-[var(--ink)]">診斷反思</span>
                    </div>
                    <ThinkRecord
                        dataKey="w3-disease-quiz"
                        prompt="選一個你覺得最難判斷的病症，說說為什麼難？"
                        scaffold={['我覺得最容易搞混的是…和…', '因為這兩種病的差別在於…', '判斷的關鍵是…']}
                        rows={3}
                    />

                    {/* ➡️ 轉場：進 Step 3 學下刀 */}
                    <div className="bg-[var(--paper-warm)] border-l-3 border-[var(--gold)] rounded-r-[6px] p-3 mt-4 max-w-[760px]">
                        <p className="text-[12px] text-[var(--ink-mid)] leading-relaxed">
                            💡 8 病症都認得了——下個 Step 進<strong className="text-[var(--ink)]">下刀工坊</strong>，學 4 把刀心法、看示範、自己對範例題下刀練手。
                        </p>
                    </div>
                </div>
            ),
        },

        /* ──────────────────────────────────────
         * STEP 3: 下刀工坊 — 學心法 + 看示範 + 自己下刀
         * ────────────────────────────────────── */
        {
            title: '下刀工坊',
            icon: '🔪',
            content: (
                <div className="space-y-8 prose-zh">
                    <p className="text-[14px] text-[var(--ink-mid)] leading-relaxed">
                        8 病症都認得了——下一步學「<strong className="text-[var(--ink)]">下刀</strong>」：用 4 把刀的心法把爛題目改成可研究版本。看示範→自己練手→Step 4 對自己題目下刀。
                    </p>
                    <StepBriefing
                        lines={[
                            { label: '節奏', text: '跟老師做 → 個人練手' },
                            { label: '學', text: '4 把刀（大→小 / 空→實 / 遠→近 / 難→易）各自的操作範例' },
                        ]}
                    />

                    {/* 萬用急救心法 */}
                    <div>
                        <div className="w3-mantra-box">
                            <div className="w3-mantra-hd"><div className="title">萬用急救心法：把「大、空、遠、難」變成「小、實、近、易」</div></div>
                            <div className="w3-mantra-core">
                                <div className="w3-mantra-rows">
                                    {MANTRA_ROWS.map(m => (
                                        <div className="w3-mantra-row-item" key={m.f}>
                                            <div className="w3-mantra-from">{m.f}</div>
                                            <div className="w3-mantra-arrow-sm">↓</div>
                                            <div className="w3-mantra-to">{m.t}</div>
                                            <div className="w3-mantra-desc">{m.d}</div>
                                        </div>
                                    ))}
                                </div>
                                <div style={{ fontSize: '10px', fontFamily: 'DM Mono', color: 'var(--ink-light)', marginTop: '16px', marginBottom: '8px' }}>8 種病對應心法</div>
                                <div className="w3-mantra-map">
                                    {MANTRA_MAP.map(item => (
                                        <div className="w3-mantra-map-item" key={item.id}>
                                            <strong>{item.id} 病對應</strong>
                                            {item.m}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="w3-notice w3-notice-gold">
                            💡 如果你的題目太大、太空、太遠、太難——回頭用萬用心法修！
                        </div>

                        {/* 🎮 遊戲暱稱對映卡 — 正課不用記，深度補充 */}
                        <DepthBlock title="靶心遊戲暱稱對照">
                            <p className="text-[12.5px] font-bold text-[var(--ink)] mb-3 flex items-center gap-1.5">
                                <span>🎮</span>
                                <span>玩「靶心」遊戲才會用到的暱稱對照（正課不用記）</span>
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[12px]">
                                <div className="flex items-center gap-2 bg-white border border-[var(--border)] rounded-[6px] px-3 py-2">
                                    <span className="text-[16px]">💊</span>
                                    <span><strong className="text-[var(--ink)]">範圍縮小</strong><span className="text-[var(--ink-light)] text-[11px] ml-1">（遊戲名：縮小藥丸）</span></span>
                                </div>
                                <div className="flex items-center gap-2 bg-white border border-[var(--border)] rounded-[6px] px-3 py-2">
                                    <span className="text-[16px]">💉</span>
                                    <span><strong className="text-[var(--ink)]">抽象具體化</strong><span className="text-[var(--ink-light)] text-[11px] ml-1">（遊戲名：具體疫苗）</span></span>
                                </div>
                                <div className="flex items-center gap-2 bg-white border border-[var(--border)] rounded-[6px] px-3 py-2">
                                    <span className="text-[16px]">🚪</span>
                                    <span><strong className="text-[var(--ink)]">對象可及化</strong><span className="text-[var(--ink-light)] text-[11px] ml-1">（遊戲名：任意門探測儀）</span></span>
                                </div>
                                <div className="flex items-center gap-2 bg-white border border-[var(--border)] rounded-[6px] px-3 py-2">
                                    <span className="text-[16px]">🔪</span>
                                    <span><strong className="text-[var(--ink)]">方法可行化</strong><span className="text-[var(--ink-light)] text-[11px] ml-1">（遊戲名：降維手術刀）</span></span>
                                </div>
                            </div>
                            <p className="text-[11px] text-[var(--ink-light)] italic leading-relaxed mt-2.5">
                                💡 <strong className="text-[var(--ink)]">課本／作業／老師講的</strong>都用正式名（範圍縮小／抽象具體化／對象可及化／方法可行化）；這裡的暱稱只在遊戲裡看得到，不用背。
                            </p>
                        </DepthBlock>

                        {/* 📖 4 把刀的下刀心路歷程（互動展開）*/}
                        <div className="mt-6">
                            <h4 className="text-[14px] font-bold text-[var(--ink)] mb-2 flex items-center gap-1.5">
                                <span>📖</span> 4 把刀的下刀心路歷程：看別人怎麼想
                            </h4>
                            <p className="text-[12px] text-[var(--ink-mid)] mb-3 max-w-[760px] leading-relaxed">
                                看到一個爛題目，老練的研究者腦中會自動冒出問題——「咦，這太大、太抽象、太遠、太難……到底是哪一個？」<strong className="text-[var(--ink)]">先自己想 30 秒</strong>，再點開看示範——比直接看答案學得深兩倍。
                            </p>
                            <div className="grid md:grid-cols-2 gap-3">
                                {CUT_MENTAL_FLOWS.map(flow => (
                                    <CutFlowCard key={flow.id} flow={flow} />
                                ))}
                            </div>
                            <p className="text-[11px] italic text-[var(--ink-light)] mt-3 leading-relaxed">
                                ⚠️ 這些示範是「方向對」、不是「最終定案」。你也只要做到方向對就好——剩下 W4-W5 還會繼續修。
                            </p>
                        </div>

                        {/* ✏️ 練手題：學生實際下刀 + 強制比對示範 */}
                        <CutPractice />
                    </div>

                    {/* 兩條救活路徑示範卡 — worked example，深度補充 */}
                    <DepthBlock title="看完整範例">
                    <div className="rounded-[var(--radius-unified)] border-2 border-[var(--accent)]/30 overflow-hidden">
                        <div className="p-4 px-5 bg-[var(--accent-light)] border-b border-[var(--accent)]/20">
                            <div className="text-[10px] font-mono uppercase tracking-[0.15em] text-[var(--accent)] font-bold mb-1">救活路徑示範</div>
                            <h4 className="font-serif text-[17px] font-bold text-[var(--ink)] leading-[1.5]">同一個爛題目，兩條救活路徑</h4>
                            <p className="text-[12.5px] text-[var(--ink-mid)] mt-2 leading-[1.75]">
                                原題：「<strong className="text-[var(--danger)]">高中生上課使用手機的頻率，與課堂專注程度之間有什麼關係？</strong>」<br />
                                病灶：<strong>專注程度</strong>太抽象、難測量（空病 + 難病）。可以走兩條路救活——
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[var(--border)]">
                            <div className="p-4 px-5 bg-white flex flex-col gap-2">
                                <div className="flex items-center gap-2">
                                    <span className="bg-[#0ea5e9] text-white text-[11px] font-bold font-mono px-2 py-0.5 rounded">路徑 A</span>
                                    <span className="text-[10px] font-mono uppercase tracking-[0.1em] text-[var(--ink-light)]">換具體指標</span>
                                </div>
                                <div className="text-[12.5px] text-[var(--ink-mid)] leading-[1.7]">
                                    救法：把「專注程度」換成<strong>可測指標</strong>（記筆記時間、字數、自評分數）。
                                </div>
                                <div className="mt-1 p-3 rounded-[6px] bg-[var(--paper)] text-[12.5px] text-[var(--ink)] italic leading-[1.7]">
                                    「本校高一段考前一週的<strong>夜間滑手機時數</strong>，與<strong>翌日專注力自評（5 分量表）</strong>之相關性」
                                </div>
                            </div>
                            <div className="p-4 px-5 bg-white flex flex-col gap-2">
                                <div className="flex items-center gap-2">
                                    <span className="bg-[#7c3aed] text-white text-[11px] font-bold font-mono px-2 py-0.5 rounded">路徑 B</span>
                                    <span className="text-[10px] font-mono uppercase tracking-[0.1em] text-[var(--ink-light)]">放棄概念，改測結果</span>
                                </div>
                                <div className="text-[12.5px] text-[var(--ink-mid)] leading-[1.7]">
                                    救法：放棄「專注程度」這個抽象概念，改測<strong>客觀結果</strong>（成績）。
                                </div>
                                <div className="mt-1 p-3 rounded-[6px] bg-[var(--paper)] text-[12.5px] text-[var(--ink)] italic leading-[1.7]">
                                    「本校高一上課使用手機頻率，與<strong>當週小考成績</strong>之相關性」
                                </div>
                            </div>
                        </div>
                        <div className="p-3 px-5 bg-[var(--paper)] border-t border-[var(--border)] text-[11.5px] text-[var(--ink-light)] leading-[1.7]">
                            💡 <strong>兩條路都對</strong>——研究的決定不是「誰是正確答案」，是「**哪條路你能執行**」。同一個爛題目可以走多條路救，**這就是 Step 4 你要對自己題目做的事**。
                        </div>
                    </div>
                    </DepthBlock>

                    {/* ➡️ 轉場：進 Step 4 對自己題目下刀 */}
                    <div className="bg-[var(--paper-warm)] border-l-3 border-[var(--gold)] rounded-r-[6px] p-3 mt-4 max-w-[760px]">
                        <p className="text-[12px] text-[var(--ink-mid)] leading-relaxed">
                            💡 看完心法、練完手感、看完兩條路徑——下個 Step 動真格：<strong className="text-[var(--ink)]">對自己題目下刀</strong>。
                        </p>
                    </div>
                </div>
            ),
        },

        /* ──────────────────────────────────────
         * STEP 4: 對自己題目下刀 — 自診 + 5W1H 切開題目（原 Part 4）
         * ────────────────────────────────────── */
        {
            title: '對自己題目下刀',
            icon: '⚔️',
            content: (
                <div className="space-y-8 prose-zh">
                    <StepBriefing
                        lines={[
                            { label: '節奏', text: '個人（第二節課）' },
                            { label: '做', text: '拿 W2 的研究問題，套 4 把刀重新縮小、具體化' },
                        ]}
                    />
                    {/* 過渡說明 */}
                    <div className="bg-[var(--ink)] text-white rounded-[var(--radius-unified)] p-6">
                        <div className="text-[11px] font-mono text-[var(--accent-light)] tracking-wider mb-2">CHECKPOINT · 練手結束</div>
                        <h2 className="text-[20px] font-bold mb-2">現在換你自己的題目上手術台</h2>
                        <p className="text-[14px] text-white/85 leading-relaxed">
                            這次要診斷的是你 W2 寫的<strong>「研究問題」</strong>。前面 Part 1/2/3 練的是診斷能力，現在把這把刀拿來切自己的題目。<br />
                            <span className="text-[var(--gold)] font-bold">你 W2 寫下的是一個研究方向——這週不是要推翻它，是檢查它夠不夠具體、能不能真的做。</span>不管你寫成「我想探究……」或「……有什麼關係？」都可以，重點是<strong>對象、變項、方法要清楚</strong>。接著用 A–H 八病症診斷，再用 5W1H 切開看清楚。
                        </p>
                        <p className="text-[13px] text-[var(--gold)] mt-3 italic">
                            🛡️ <strong>題目有病很正常。今天不是打掉它，是把它救到做得出來。</strong> 先不用 AI，自己動手 10 分鐘。
                        </p>
                    </div>

                    {/* W2 題目帶入卡 */}
                    {w2Intent ? (
                        <div className="border border-[var(--accent)]/30 bg-[var(--accent-light)]/20 rounded-[var(--radius-unified)] p-5">
                            <div className="text-[11px] font-mono text-[var(--accent)] uppercase tracking-wider mb-2">📎 你上週的 W2 最終研究問題（這就是這週要檢查的研究方向）</div>
                            <p className="text-[14px] text-[var(--ink)] font-medium leading-relaxed">{w2Intent}</p>
                            <p className="text-[11px] text-[var(--ink-light)] mt-2 leading-relaxed">
                                💡 下方第一格「診斷」，先確認這個方向夠不夠具體（對象／變項／方法清楚嗎），不夠就微調，再開始診斷。
                            </p>
                        </div>
                    ) : (
                        <BackfillField
                            dataKey="w2-final-intent"
                            label="⚠️ 沒偵測到你 W2 的最終研究問題——把你上週寫的句子貼這裡，下方診斷會立即接通。"
                            placeholder="例：我想探究「考試壓力」如何影響「學生對圖書館空間使用」的選擇。"
                            buttonLabel="補上 W2 意圖"
                        />
                    )}

                    {/* Section A：診斷 */}
                    <div className="bg-white border border-[var(--border)] rounded-[var(--radius-unified)] overflow-hidden">
                        <div className="px-5 py-3 bg-[var(--paper-warm)] border-b border-[var(--border)] flex items-center gap-2">
                            <span className="text-[11px] font-mono font-bold text-[var(--ink-mid)]">診斷</span>
                        </div>
                        <div className="p-5 space-y-4">
                            <ThinkRecord
                                dataKey="w3-own-diagnose"
                                prompt="① 題目夠具體嗎？② 得了什麼病？"
                                scaffold={[
                                    '確認具體（對象／變項／方法）：',
                                    '病症診斷：得了 ___ 病（A–H 可複選），因為：',
                                ]}
                                rows={3}
                            />
                            <ThinkRecord
                                dataKey="w3-own-fix"
                                prompt="③ 選哪把刀？④ 初步怎麼改？"
                                scaffold={[
                                    '選心法：□大→小  □空→實  □遠→近  □難→易',
                                    '改法初稿：',
                                ]}
                                rows={3}
                            />
                        </div>
                    </div>

                    {/* Section B：5W1H 切開題目 */}
                    <div className="bg-white border border-[var(--border)] rounded-[var(--radius-unified)] overflow-hidden">
                        <div className="px-5 py-3 bg-[var(--paper-warm)] border-b border-[var(--border)] flex items-center gap-2">
                            <span className="text-[11px] font-mono font-bold text-[var(--ink-mid)]">5W1H 切開題目</span>
                            <span className="ml-auto text-[10px] font-mono text-[var(--danger)]">至少填 4 格（Who/Where/What/How 必備）</span>
                        </div>
                        <div className="p-5 space-y-4">
                            <div className="bg-[var(--paper-warm)] border border-dashed border-[var(--border)] rounded-[6px] p-3 text-[12px] text-[var(--ink-mid)] leading-[1.95]">
                                <p className="font-bold text-[var(--ink)] mb-1">📋 先看一個填好的範例（題目：本校高一段考前的夜間滑手機）</p>
                                Who（對象）：本校高一學生<br />
                                Where（場域）：放學後在家<br />
                                What（變項／可測量的指標）：睡前 30 分鐘的滑手機時數、隔日上午第一節的專注力自評（1–5 分）<br />
                                How（方法）：問卷<br />
                                When（時間或情境，選填）：段考前一週
                            </div>
                            <ThinkRecord
                                dataKey="w3-own-5w1h"
                                prompt="用 5W1H 切開你的題目（填空版）"
                                scaffold={[
                                    'Who（對象）：',
                                    'Where（場域）：',
                                    'What（變項 / 可測量的指標）：',
                                    'How（方法 · 問卷 / 訪談 / 觀察 / 實驗 / 文獻）：',
                                    'When（時間或情境，選填）：',
                                ]}
                                rows={5}
                            />

                            {/* 出院標準 checklist */}
                            <div className="bg-[var(--accent-light)]/30 border border-[var(--accent)]/20 rounded-[8px] p-4">
                                <div className="text-[12px] font-bold text-[var(--ink)] mb-2">🏥 急救出院標準（自己勾）</div>
                                <ul className="text-[12px] text-[var(--ink-mid)] space-y-1 leading-relaxed">
                                    <li>☐ 5W1H 至少能寫出 4 格（Who/Where/What/How 必備）</li>
                                    <li>☐ 符合「小、實、近、易」至少 2 項</li>
                                    <li>☐ 我能在兩週內蒐集到資料（問卷／訪談／觀察／文獻／實驗其一）</li>
                                </ul>
                                <p className="text-[11px] text-[var(--ink-light)] mt-2">三項都能勾 → 進入 Part 5 打磨定案。</p>
                            </div>
                        </div>
                    </div>

                    {/* Section C：修改版題目 */}
                    <div className="bg-white border-2 border-[var(--gold)]/50 rounded-[var(--radius-unified)] overflow-hidden">
                        <div className="px-5 py-3 bg-[var(--gold)]/10 border-b border-[var(--gold)]/30 flex items-center gap-2">
                            <span className="text-[11px] font-mono font-bold text-[var(--ink)]">修改版題目（Part 5 起跑線）</span>
                        </div>
                        <div className="p-5">
                            <ThinkRecord
                                dataKey="w3-own-revised"
                                prompt="根據診斷 + 5W1H，你修正後的題目是？（這題會帶到 Part 5 第一輪）"
                                placeholder="例：本校高一學生在段考前一週的夜間手機使用時數，與隔日上午第一節專注力自評之間的相關性。"
                                scaffold={['修改版題目：']}
                                rows={3}
                            />
                        </div>
                    </div>
                </div>
            ),
        },

        /* ──────────────────────────────────────
         * STEP 5: AI 共診定案 — AI 4 步協作磨定案（原 Part 5）
         * ────────────────────────────────────── */
        {
            title: 'AI 共診定案',
            icon: '🎯',
            content: (
                <div className="space-y-8 prose-zh">
                    <StepBriefing
                        lines={[
                            { label: '節奏', text: '個人（AI 協作）' },
                            { label: '做', text: '四步：自己初稿 → AI 診斷 → AI 給 3 改法 → 你選一個定案' },
                            { label: '交出', text: '帶去 W4 的最終研究問題 + AI-RED 紀錄' },
                        ]}
                    />
                    <div className="bg-[var(--paper-warm)] border border-[var(--border)] rounded-[var(--radius-unified)] p-5">
                        <div className="text-[11px] font-mono text-[var(--ink-mid)] tracking-wider mb-1">最後一關 · AI 協作 4 步驟</div>
                        <h2 className="text-[18px] font-bold text-[var(--ink)] mb-2">把你的題目從初稿磨成定案</h2>
                        <p className="text-[13px] text-[var(--ink-mid)] leading-relaxed">
                            重點不是 AI 改得多好，而是<strong>你怎麼選、為什麼選</strong>。第一輪先自己寫，再開 AI。
                            給自己 12 分鐘做到「定案」——那個最後定案框就是你這學期的研究起點。
                        </p>
                    </div>

                    {/* 📖 示範流程預覽（小華的故事）— 完整範例詳解，深度補充 */}
                    <DepthBlock title="看完整範例">
                        <div className="space-y-4 text-[12.5px] leading-[1.85]">
                            <p className="font-bold text-[13px] text-[var(--accent)]">📖 完整範例：小華的故事（第一次自己跑 AI 協作前先看一遍）</p>
                            <div>
                                <div className="text-[11px] font-mono font-bold text-[var(--ink-light)] uppercase mb-1">小華的初稿（第一輪）</div>
                                <div className="bg-[var(--paper-warm)] border-l-4 border-[var(--ink-light)] p-3 rounded-r-[6px] text-[var(--ink)]">
                                    「本校高一學生段考前的手機使用情形」
                                </div>
                            </div>

                            <div>
                                <div className="text-[11px] font-mono font-bold text-[var(--ink-light)] uppercase mb-1">小華自己診斷（開 AI 之前）</div>
                                <div className="bg-[var(--paper-warm)] border-l-4 border-[var(--ink-light)] p-3 rounded-r-[6px]">
                                    「我覺得是 <strong>C 病・百科全書病（範圍太大）</strong>，因為『使用情形』太空泛，沒講要測什麼。」
                                </div>
                            </div>

                            <div>
                                <div className="text-[11px] font-mono font-bold text-[var(--accent)] uppercase mb-1">AI 診斷回應（第二輪・開 AI 後）</div>
                                <div className="bg-[var(--accent-light)]/20 border-l-4 border-[var(--accent)] p-3 rounded-r-[6px]">
                                    「主要是 <strong>C 病・百科全書病（範圍太大）</strong>：『使用情形』未定義要測時數、頻率、還是內容。<br />
                                    另外還有一個問題——題目把『段考前』和『手機使用』綁在一起，沒講要看哪個影響哪個，<strong>焦點不夠清楚</strong>。」
                                </div>
                            </div>

                            <div>
                                <div className="text-[11px] font-mono font-bold text-[#D97706] uppercase mb-1">小華比對差異（第二輪・同框）</div>
                                <div className="bg-[#FEF3C7] border-l-4 border-[#D97706] p-3 rounded-r-[6px]">
                                    「我只看到『範圍太大』，沒看到『焦點不清』。AI 抓到我把『時間點』和『行為』混在一起。<strong>這個盲點我自己看不到。</strong>」
                                </div>
                            </div>

                            <div>
                                <div className="text-[11px] font-mono font-bold text-[var(--accent)] uppercase mb-1">AI 三方案（第三輪）</div>
                                <div className="bg-[var(--accent-light)]/20 border-l-4 border-[var(--accent)] p-3 rounded-r-[6px] space-y-1">
                                    <p>方案 ①：本校高一段考前一週的<strong>夜間滑手機時數</strong>與<strong>翌日專注力自評</strong>之相關性</p>
                                    <p>方案 ②：本校高一段考前後三週的<strong>每日手機使用時數變化</strong></p>
                                    <p>方案 ③：本校高一<strong>段考週滑社群媒體頻率</strong>對<strong>讀書時間</strong>的影響</p>
                                </div>
                            </div>

                            <div>
                                <div className="text-[11px] font-mono font-bold text-[#10B981] uppercase mb-1">小華最終定案（定案）</div>
                                <div className="bg-[#ECFDF5] border-l-4 border-[#10B981] p-3 rounded-r-[6px]">
                                    「我選 <strong>方案 ①</strong>。最終題目就用 AI 給的方案 ①：『本校高一段考前一週的夜間滑手機時數與翌日專注力自評之相關性』。<br />
                                    理由：<br />
                                    ① 我真的好奇『睡前滑手機 vs 隔日專注力』這條因果鏈<br />
                                    ② 兩個變項都能用問卷量化（時數 + 1-5 分自評）<br />
                                    ③ 方案 ② 範圍太大、方案 ③ 我不太關心社群媒體本身。」
                                </div>
                            </div>

                            <div className="bg-[var(--ink)]/5 border border-[var(--ink)]/10 rounded-[6px] p-3">
                                <p className="font-bold text-[12px] text-[var(--ink)] mb-1">🎓 小華示範告訴你三件事：</p>
                                <ol className="list-decimal pl-5 text-[12px] text-[var(--ink-mid)] leading-[1.85] space-y-0.5">
                                    <li><strong>自己診斷不要怕錯</strong>——小華只看到「範圍太大」、沒看到「焦點不清」，這正常，AI 才能幫上忙</li>
                                    <li><strong>比對差異是金礦</strong>——「AI 看到、我沒看到」的東西是你的學習點，要寫下來</li>
                                    <li><strong>選擇要有研究理由</strong>——不是「比較好聽」，是「我真的想知道、做得到、能測量」</li>
                                </ol>
                            </div>
                        </div>
                    </DepthBlock>

                    {/* 第一輪 — 自己先寫初稿 */}
                    <section className="bg-white border border-[var(--border)] rounded-[var(--radius-unified)] overflow-hidden">
                        <div className="px-5 py-3 bg-[var(--paper-warm)] border-b border-[var(--border)] flex items-center gap-2">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--ink)] text-white flex items-center justify-center text-[12px] font-bold font-mono">1</span>
                            <span className="font-bold text-[13px]">自己先寫初稿</span>
                            <span className="ml-auto text-[10px] font-mono text-[var(--ink-light)]">人先做</span>
                        </div>
                        <div className="p-5">
                            <P5DraftField />
                        </div>
                    </section>

                    {/* 第二輪 — 問 AI 診斷 + 你的比對判斷（合併原 2+3） */}
                    <section className="bg-white border border-[var(--border)] rounded-[var(--radius-unified)] overflow-hidden">
                        <div className="px-5 py-3 bg-[var(--paper-warm)] border-b border-[var(--border)] flex items-center gap-2">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--ink)] text-white flex items-center justify-center text-[12px] font-bold font-mono">2</span>
                            <span className="font-bold text-[13px]">問 AI 診斷 + 你的比對判斷</span>
                            <span className="ml-auto text-[10px] font-mono text-[var(--ink-light)]">AI 給 → 你判斷</span>
                        </div>
                        <div className="p-5 space-y-4">
                            <P5CompareRef />
                            <AIAssistToggle
                                id="w3-p5-diagnose"
                                title="問 AI 診斷你的題目"
                                reason="只問診斷、不問改法——Prompt 已鎖定用 A-H 8 病症語言，讓 AI 跟你講同一種話。拿到 AI 診斷後，下方記錄欄要同時寫『AI 診斷 + 你 Part 4 自診的差異判斷』，這是這一步的核心。"
                                prompt={MY_DIAGNOSE_PROMPT}
                                recordKey="w3-p5-diagnose-ai-record"
                                recordPrompt="AI 診斷出哪幾種病？跟你 Part 4 的自診差在哪？你更認同誰？"
                                recordPlaceholder={'AI 診斷：___ 病（可複選，標代碼 A-H）\n我 Part 4 自診：___ 病\n一致／不一致：\n我更認同 ___ 的版本，因為 ___'}
                                forceAI
                            />
                        </div>
                    </section>

                    {/* 第三輪 — 問 AI 給 3 個修改方向 */}
                    <section className="bg-white border border-[var(--border)] rounded-[var(--radius-unified)] overflow-hidden">
                        <div className="px-5 py-3 bg-[var(--paper-warm)] border-b border-[var(--border)] flex items-center gap-2">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--ink)] text-white flex items-center justify-center text-[12px] font-bold font-mono">3</span>
                            <span className="font-bold text-[13px]">問 AI 給 3 個修改方向</span>
                            <span className="ml-auto text-[10px] font-mono text-[var(--ink-light)]">AI 做</span>
                        </div>
                        <div className="p-5">
                            <AIAssistToggle
                                id="w3-p5-fix3"
                                title="讓 AI 發散 3 個不同的修改方向"
                                reason="要求 AI 方向明顯不同（不是同一個想法的微調）。你要當裁判挑選。"
                                prompt={MY_FIX3_PROMPT}
                                recordKey="w3-p5-fix3-ai-record"
                                recordPrompt="AI 給的三個方向分別是？你第一眼覺得哪個最有希望？"
                                recordPlaceholder={'方向 ①：___\n方向 ②：___\n方向 ③：___\n第一眼覺得 ___ 最有希望，因為 ___'}
                                forceAI
                            />
                        </div>
                    </section>

                    {/* 定案 · 最終定案（合併原 5+7：選方向＝寫定案） */}
                    <section className="bg-[var(--accent-light)]/30 border-2 border-[var(--accent)] rounded-[var(--radius-unified)] overflow-hidden">
                        <div className="px-5 py-3 bg-[var(--accent)] text-white flex items-center gap-2">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-white text-[var(--accent)] flex items-center justify-center text-[12px] font-bold font-mono">4</span>
                            <span className="font-bold text-[13px]">🎯 我選一個 → 寫成最終定案題目（我負責判斷）</span>
                            <span className="ml-auto text-[10px] font-mono font-bold text-white">不能跳過</span>
                        </div>
                        <div className="p-5 space-y-3">
                            <p className="text-[12px] text-[var(--ink-mid)] leading-relaxed">
                                從第三輪的 AI 三方向、自己 Part 4 的版本、或綜合改寫中，<strong>用你的判斷</strong>做最終決定。
                                這題就是你這學期的研究起點，會帶到 W4 為它選研究方法。
                            </p>
                            <ThinkRecord
                                dataKey="w3-final-topic"
                                prompt="🎯 我的 W3 最終定案題目"
                                placeholder="把你決定的題目完整寫出來。會帶到 W4 方法地圖。"
                                scaffold={[
                                    '我選：☐ AI 方向 ①  ☐ AI 方向 ②  ☐ AI 方向 ③  ☐ 我 Part 4 的版本最準  ☐ 綜合改成自己的',
                                    '最終定案題目：',
                                    '選擇理由（至少勾 2 項 + 一句話補充）：',
                                    '  ☐ 這個題目我做得到（對象找得到、資源夠）',
                                    '  ☐ 我有興趣（真的想知道答案）',
                                    '  ☐ 這個方法我比較會用',
                                    '  ☐ 這個題目符合萬用心法（小實近易）',
                                    '  ☐ 其他：',
                                    '補充說明：',
                                ]}
                                rows={9}
                            />

                            {/* 🔥 研究動機——題目剛訂下來最有溫度，這時候寫 */}
                            <div className="bg-[var(--gold-light)] border-l-4 border-[var(--gold)] p-4 rounded-r-[8px] mt-3">
                                <p className="text-[12.5px] font-bold text-[#7a6020] mb-1">🔥 趁熱寫——為什麼想研究這個</p>
                                <p className="text-[11.5px] text-[#7a6020] leading-relaxed">
                                    題目剛訂下來、你的腦袋最熱——這時候寫研究動機最真誠。<strong>一句話</strong>講清楚就好。會帶去 W6 海報直接抄上去，下半學期擋風遮雨的就是這句話。
                                </p>
                            </div>
                            <ThinkRecord
                                dataKey="w3-motivation"
                                prompt="🔥 一句話：為什麼這個題目值得我花一學期研究？"
                                placeholder="例：我自己段考前每次熬夜滑手機隔天念書效率超差——想證明這個感覺是真的，幫之後想戒手機的同學多一份具體數據。"
                                scaffold={['我想研究這個是因為 ___', '這個答案對 ___（誰）有意義']}
                                rows={3}
                            />

                            <div className="bg-white border border-[var(--accent)]/20 rounded-[6px] p-3 text-[11px] text-[var(--ink-mid)] leading-relaxed">
                                <strong className="text-[var(--accent)]">✓ 完成確認：</strong>Step 4 出院標準都能勾、研究動機也寫了 → 本週急救成功，帶這題去 W4。
                            </div>
                        </div>
                    </section>

                    {/* 本週 AI 互動總結（Part 3 + Part 5） */}
                    <AIREDNarrative week="3" hint="這週你用 AI 做了題目診斷、改法發想、定案優化。挑一次最關鍵的互動記錄下來。" />
                </div>
            ),
        },

        /* ──────────────────────────────────────
         * STEP 6: 回顧與繳交
         * ────────────────────────────────────── */
        {
            title: '回顧與繳交',
            icon: '📋',
            content: (
                <div className="space-y-8 prose-zh">
                    <StepBriefing
                        lines={[
                            { label: '節奏', text: '個人' },
                            { label: '做', text: '寫 2 題反思（卡在哪、走了哪幾把刀），整理 W3 學習紀錄' },
                        ]}
                    />
                    {/* 本週結束檢核 */}
                    <div className="bg-white border border-[var(--border)] rounded-[10px] overflow-hidden">
                        <div className="p-4 px-5 bg-[var(--paper-warm)] border-b border-[var(--border)] font-bold text-[13px]">
                            ✅ 本週結束，你應該要會
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-[1px] bg-[var(--border)]">
                            {[
                                '看懂 8 種爛題型，能說出每種問題在哪裡',
                                '用「大空遠難 → 小實近易」心法修改有病的題目',
                                '靠自己完成配對診斷與抽題練習（不靠 AI）',
                                '用 AI 協作練手一題（Part 3 · 別人的題目）',
                                '用 5W1H 切開自己 W2 的題目（Part 4）',
                                '透過 AI 協作 4 步，產出 W3 最終定案題目（Part 5）',
                            ].map((item, i) => (
                                <div key={i} className="p-4 px-6 bg-white flex items-start gap-3">
                                    <CheckCircle2 size={16} className="text-[var(--success)] mt-0.5 flex-shrink-0" />
                                    <span className="text-[13px] text-[var(--ink-mid)]">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 反思 — 兩題最關鍵：誤診觀察 + 修法路徑回顧 */}
                    <div className="space-y-4">
                        <ThinkRecord
                            dataKey="w3-reflect-misdiagnosis"
                            prompt="✍️ 反思 1：8 病症裡，你最容易誤診的是哪一個？為什麼那個容易跟其他病搞混？"
                            placeholder="例：我最容易誤診『大』和『空』。題目寫『高中生壓力』我以為只是太大，但其實是『壓力』本身太抽象（空）——分不清關鍵在『誰』太廣還是『測什麼』沒講清楚。"
                            scaffold={['我最容易誤診 ___', '它容易跟 ___ 搞混', '差別其實在…']}
                            rows={4}
                        />

                        <ThinkRecord
                            dataKey="w3-reflect-cuts"
                            prompt="✍️ 反思 2：你的題目走過哪幾把刀（縮小／具體化／可及化／可行化）？最後落點為什麼是這裡？"
                            placeholder="例：我走了縮小（從『高中生』→『松山高一』）+ 具體化（從『壓力』→『段考前手機使用時數』）。沒動可及化（我自己就是高一、樣本拿得到）跟可行化（兩週內能做）。落這裡是因為再切下去就會失真——『松山高一段考前手機時數』剛好可以兩週內問到。"
                            scaffold={['我走了 ___ 把刀（縮小／具體化／可及化／可行化）', '沒動 ___ 是因為…', '最後落這裡是因為…']}
                            rows={5}
                        />
                    </div>

                    {/* 一鍵複製繳交 */}
                    <div className="bg-[#EFF6FF] border-2 border-[#1E40AF] rounded-[var(--radius-unified)] p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <ContentTypeChip type="交出" />
                            <span className="text-[10px] font-mono font-bold bg-[#1E40AF] text-white px-2 py-0.5 rounded-[3px] uppercase tracking-wider">📤 最後一步</span>
                            <span className="text-[14px] font-bold text-[#1E40AF]">複製 W3 學習紀錄 → 貼 Google Classroom</span>
                        </div>
                        <p className="text-[12px] text-[#1E3A8A] leading-relaxed mb-3">
                            包含：題目診斷練習／救活後題目／AI 輔助紀錄（如有）。W4 方法地圖課會接這份。
                        </p>
                        <ExportButton
                            weekLabel="W3 題目診斷"
                            fields={EXPORT_FIELDS}
                            buttonText="複製 W3 學習紀錄"
                        />
                    </div>

                    {/* 遊戲彩蛋 */}
                    <div className="bg-[var(--ink)] border-l-4 border-[var(--danger)] p-6 rounded-r-lg text-white shadow-xl">
                        <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                            <ShieldAlert className="text-[var(--danger)]" size={20} />
                            R.I.B. 單元挑戰：行動代號靶心
                        </h3>
                        <p className="text-[var(--ink-light)] text-sm mb-4">
                            鍛鍊從「現象」提煉出「研究問題」的精確度——你能從混亂的資訊中找到正確的研究問題嗎？
                        </p>
                        <Link to="/game/question-er" className="inline-flex items-center gap-2 bg-[var(--danger)] text-white px-4 py-2 rounded font-bold text-sm hover:opacity-90 transition-colors">
                            進入靶心 <ArrowRight size={14} />
                        </Link>
                    </div>

                    {/* 下週預告 */}
                    <div className="next-week-preview">
                        <div className="next-week-header">
                            <span className="next-week-badge">NEXT WEEK</span>
                            <h3 className="next-week-title">W4 預告</h3>
                        </div>
                        <div className="next-week-content">
                            <div className="next-week-col">
                                <div className="next-week-label">W4 主題</div>
                                <p className="next-week-text">方法地圖——認識五種研究方法（問卷／訪談／實驗／觀察／文獻分析），用兩層判斷的互動決策樹幫你的題目找出主方法。</p>
                            </div>
                            <div className="next-week-col">
                                <div className="next-week-label">你要準備</div>
                                <p className="next-week-text">帶著你的 <strong className="text-white">「W3 最終定案題目」</strong>——下週要為它選一個主要研究方法，並寫出選擇理由。</p>
                            </div>
                        </div>
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
                    <span className="hidden md:inline">研究方法與專題 / 研究規劃 / </span><span className="text-[var(--ink)] font-bold">題目健檢 W3</span>
                </div>
                <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
                    <span className="bg-[var(--paper-warm)] text-[var(--ink)] text-[10px] font-bold px-2 py-0.5 rounded-[2px] font-mono">100 MINS</span>
                    <ResetWeekButton weekPrefix="w3-" />
                    <button
                        onClick={() => setShowLessonMap(!showLessonMap)}
                        className="text-[11px] text-[var(--ink-light)] hover:text-[var(--accent)] transition-colors flex items-center gap-1 font-mono"
                    >
                        <Map size={12} /> <span className="hidden md:inline">{showLessonMap ? '收起流程' : '教師流程'}</span>
                    </button>
                </div>
            </div>

            {showLessonMap && (
                <div className="animate-in slide-in-from-top-4 duration-300">
                    <LessonMap data={W3Data} />
                </div>
            )}

            {/* PAGE HEADER — Hero Block（第一屏只留三句，spec §6-1）*/}
            <HeroBlock
                kicker="R.I.B. 調查檔案 · 研究方法與專題 · W3"
                question="我的問題被追問後，還站得住嗎？"
                title="題目健檢："
                accentTitle="碰壁→診斷→救活→定案"
                todo={[
                    { label: '今天做什麼', value: '把 W2 的研究問題搬上手術台，診斷、下刀、AI 協作定案。' },
                    { label: '為什麼做', value: '好題目不是想出來的、是磨出來的——太大太空太遠太難都做不出來。' },
                    { label: '今天交什麼', value: '個人＝W3 學習紀錄（含最終定案題目，帶去 W4）。' },
                ]}
                chain="W2 你寫出了研究問題草稿——但「感覺可以研究」跟「真的能做」是兩回事。W3 要把題目搬上手術台，找病症、下刀、定案。"
                meta={[
                  { label: '第一節', value: '題目病症診斷（8 種爛題型）+ 四把刀改題練習' },
                  { label: '第二節', value: 'AI 協作工作坊——四步驟把自己題目修到可執行' },
                  { label: '課堂產出', value: '個人 W3 學習紀錄（含最終定案題目，帶去 W4）' },
                  { label: '前置要求', value: 'W2 研究問題草稿' },
                ]}
            />

            {/* 三模式切換 */}
            <ModeSwitch />

            {/* 自學補課路線 — 只在自學模式顯示（spec §5；W3 為 full 週）*/}
            {mode === 'self-study' && (
                <div className="my-5 rounded-[var(--radius-unified)] border-2 border-[#0284C7] bg-[#F0F9FF] p-4 md:p-5">
                    <p className="text-[14px] font-bold text-[#075985] mb-1">📖 自學補課路線 · W3 可「完整自學」</p>
                    <p className="text-[11.5px] text-[#0C4A6E] leading-[1.7] mb-3">
                        W3 核心是「個人診斷 → 對自己題目下刀 → AI 協作定案」，全是個人作業。Step 2 的「小組診斷」是個人診斷練習的平行難度軌，自學學生做個人練習即可等價。
                    </p>
                    <ol className="text-[12px] text-[#0C4A6E] leading-[1.85] list-none m-0 p-0 space-y-1">
                        <li><strong>① 先看：</strong>Step 1 八病症 ＋ Step 3 萬用急救心法（大空遠難→小實近易 4 把刀）</li>
                        <li><strong>② 做：</strong>Step 2 八病人配對＋抽題練習、Step 3 練手題下刀、Step 4 對自己 W2 題目下刀、Step 5 AI 共診定案</li>
                        <li><strong>③ 補紀錄：</strong>碰壁體驗／病症快問快答／練手題／個人診斷練習／Part 4 自診＋5W1H＋修改版／Part 5 初稿＋AI 診斷＋三方案／最終定案題目＋研究動機／AI-RED／兩題反思</li>
                        <li><strong>④ 交：</strong>整理 W3 學習紀錄，依老師指定方式上傳到 Google Classroom</li>
                        <li><strong>⑤ 本週可完整自學</strong>——Step 2 的「小組診斷」可用「個人練習」替代（同一個技能的平行難度軌）；若要完成 AI 協作段落，請使用你平常可登入的 AI 工具。</li>
                    </ol>
                    <div className="mt-3 pt-3 border-t border-[#0284C7]/30">
                        <p className="text-[12px] font-bold text-[#075985] mb-1">⛑️ 最低完成版（缺課學生：至少做到這些才算補到核心）</p>
                        <p className="text-[11.5px] text-[#0C4A6E] leading-[1.85] m-0">
                            ① 看懂 8 病症、做完 8 病人配對　② 學 4 把刀、練手題下刀一次　③ Step 4 對自己 W2 題目做診斷＋5W1H＋寫修改版　④ Step 5 寫出最終定案題目（帶去 W4，必填）＋研究動機　⑤ 填 AI-RED，整理 W3 紀錄上傳 Classroom
                        </p>
                    </div>
                </div>
            )}

            {/* 我的紀錄抽屜 — 兩模式都能開（spec §3 方案 A：總覽＋匯出，input 留 Step）*/}
            <RecordDrawer
                weekLabel="W3 題目健檢"
                fields={EXPORT_FIELDS}
                choices={choiceResults}
            />

            {/* 為什麼是這週 + 本週資訊 — 深度補充 */}

            <CourseArc items={W3Data.courseArc} />

            {/* 本節任務卡 — 學生一眼看懂「今天要做什麼」 */}
            <TaskCard
                weekNumber="W3"
                weekTitle={W3Data.title}
                duration={`${W3Data.duration} 分鐘 · ${W3Data.durationDesc}`}
                tasks={[
                    '練識別 — 看 8 個爛題目，自己診斷是哪一種「題目病症」（先不靠 AI）',
                    '學下刀 — 用「大→小／空→實／遠→近／難→易」四把刀練改題',
                    '自己題目定案 — 把 W2 的研究問題搬上手術台，AI 協作 4 步出最終題目',
                ]}
                exportReminder="到頁面上方「我的紀錄」整理本週紀錄，依老師指定方式上傳到 Google Classroom"
            />

            {/* STEP ENGINE */}
            <StepEngine
                steps={steps}
                prevWeek={{ label: '回 W2 問題意識', to: '/w2' }}
                nextWeek={{ label: '前往 W4 方法地圖', to: '/w4' }}
            flat
            />
        </div>
    );
};

export const Wizard = () => (
    <ModeProvider week="W3">
        <WizardContent />
    </ModeProvider>
);
