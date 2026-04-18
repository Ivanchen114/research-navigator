import React, { useState, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CourseArc from '../components/ui/CourseArc';
import ThinkRecord from '../components/ui/ThinkRecord';
import AIREDNarrative from '../components/ui/AIREDNarrative';
import ThinkChoice from '../components/ui/ThinkChoice';
import StepEngine from '../components/ui/StepEngine';
import HeroBlock from '../components/ui/HeroBlock';
import ExportButton from '../components/ui/ExportButton';
import ResetWeekButton from '../components/ui/ResetWeekButton';
import { readRecords, STORAGE_KEY } from '../components/ui/ThinkRecord';
import {
    Map,
    ArrowRight,
    CheckCircle2,
    Search,
    AlertTriangle,
    ShieldAlert,
} from 'lucide-react';
import LessonMap from '../components/ui/LessonMap';
import { W50Data } from '../data/lessonMaps';

/* ── 資料常數 ── */

const GRADE_LEVELS = [
    { grade: 'A', emoji: '🟢', label: '主要證據', examples: '碩博士論文、同儕審查期刊', note: '可作為主要支撐', canCite: true },
    { grade: 'B', emoji: '🟦', label: '輔助參考', examples: '官方報告、政府統計、專家專書', note: '輔助說明，非唯一證據', canCite: true },
    { grade: 'C', emoji: '🟡', label: '找方向用', examples: '科普網站、維基百科、新聞報導', note: '不能寫進報告', canCite: false },
    { grade: 'D', emoji: '🔴', label: '不採用', examples: 'AI 生成假文獻、內容農場', note: '絕對不能用', canCite: false },
];

const GRADE_COLORS = {
    A: { bg: 'bg-[var(--success)]', light: 'bg-[var(--success-light)]', text: 'text-[var(--success)]', border: 'border-[var(--success)]' },
    B: { bg: 'bg-[var(--accent)]', light: 'bg-[var(--accent-light)]', text: 'text-[var(--accent)]', border: 'border-[var(--accent)]' },
    C: { bg: 'bg-[var(--gold)]', light: 'bg-[var(--gold-light)]', text: 'text-[var(--gold)]', border: 'border-[var(--gold)]' },
    D: { bg: 'bg-[var(--danger)]', light: 'bg-[var(--danger-light)]', text: 'text-[var(--danger)]', border: 'border-[var(--danger)]' },
};

const EVIDENCE_CARDS = [
    {
        id: 'A',
        title: '台中市高中職學生數學焦慮、數學自我效能與數學學業成就關係之研究',
        meta: '作者：鄭淑米｜指導教授：蔡蓉青｜2006｜碩士論文',
        desc: '本研究旨在瞭解高中職一年級學生數學焦慮與數學自我效能的現況，並探討其與數學學業成就之關係。研究採問卷調查法，回收有效問卷後進行統計分析。',
    },
    {
        id: 'B',
        title: 'Smartphone Usage and Sleep Quality in Taiwanese Adolescents: A Longitudinal Study',
        meta: 'Authors: Michael Chen, Sarah Wang｜2023｜Journal of Sleep Research and Technology Vol.18(4)',
        desc: 'This longitudinal study followed Taiwanese high school students for three years. Results indicated that excessive smartphone use predicted poorer sleep outcomes.',
        extra: 'DOI: 10.1177/0272989X241231721',
    },
    {
        id: 'C',
        title: '我的不正經人生觀',
        meta: '作者：黃益中｜出版社：寶瓶文化｜2019｜ISBN: 978-986-406-159-4',
        desc: '本書以教育現場的案例與社會觀察，討論青少年成長、學習動機、人際互動與價值選擇等議題。',
    },
    {
        id: 'D',
        title: '生活小竅門 教你如何治療燒傷燙傷',
        meta: '來源：每日頭條｜作者：生活竅門點點通｜2016',
        desc: '文章整理燒燙傷常見來源與民間處理法：蔥葉貼敷、蛋清加糖、蛋膜貼敷、蛋黃熬油、大白菜外敷、蘆薈塗抹等。',
    },
    {
        id: 'E',
        title: '【Facebook 貼文】國家教育研究院',
        meta: '平台：Facebook｜2026 年 1 月 5 日',
        desc: '全國多所學校開始限制學生上課使用手機，休息時間也有 63% 禁用。老師們普遍支持，期望恢復純粹的學習環境。但面對 AI 與數位時代，也有教師持保留態度。',
    },
];

const HUAYI_STEPS = [
    { n: '1', t: '列出關鍵字', d: '從題目中找 2-3 個核心名詞。例如：手機使用、睡眠品質、高中生。不要直接貼整個題目進去搜——搜不到東西。' },
    { n: '2', t: '搜尋', d: '輸入關鍵字，先看搜到幾篇。太多？加限制條件。太少？換同義詞（如「手機」→「智慧型手機」→「行動裝置」）。' },
    { n: '3', t: '加限制條件', d: '地區選台灣、時間選近五年、文件類型選碩博士論文。太舊的研究可能過時，碩博士論文有完整方法可參考。' },
    { n: '4', t: '看標題 → 摘要 → 全文', d: '先看標題確認相關，再看摘要最後一段「本研究發現…」，確認跟你的題目有交集，再下載全文。' },
];

/* 華藝教學——漸進式揭露：預設第 1 步展開，其餘灰階待點擊 */
function HuayiSearchTutorial() {
    const [revealed, setRevealed] = useState(() => new Set([0]));
    const toggle = (i) => {
        setRevealed(prev => {
            const next = new Set(prev);
            if (next.has(i)) next.delete(i);
            else next.add(i);
            return next;
        });
    };
    const revealAll = () => setRevealed(new Set(HUAYI_STEPS.map((_, i) => i)));

    return (
        <div className="border border-[var(--border)] rounded-xl overflow-hidden bg-white">
            <div className="p-4 px-5 bg-[var(--paper-warm)] border-b border-[var(--border)] flex items-center gap-3 flex-wrap">
                <Search size={15} className="text-[var(--ink)]" />
                <span className="font-bold text-[13px] text-[var(--ink)]">以「本校高一生手機使用與睡眠品質的關係」為範例</span>
                <button
                    type="button"
                    onClick={revealAll}
                    className="ml-auto text-[11px] font-mono text-[var(--ink-light)] hover:text-[var(--accent)] underline-offset-2 hover:underline transition-colors"
                >
                    全部展開 ▾
                </button>
            </div>
            <div className="p-5 space-y-3">
                {HUAYI_STEPS.map((step, i) => {
                    const isOpen = revealed.has(i);
                    return (
                        <button
                            type="button"
                            key={step.n}
                            onClick={() => toggle(i)}
                            className={`w-full flex gap-4 text-left rounded-[8px] px-3 py-3 -mx-3 transition-all ${
                                isOpen
                                    ? 'bg-transparent'
                                    : 'bg-[var(--paper-warm)]/50 hover:bg-[var(--accent-light)]/40 cursor-pointer'
                            }`}
                        >
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-mono font-bold text-[13px] flex-shrink-0 transition-all ${
                                isOpen
                                    ? 'bg-[var(--accent-light)] text-[var(--accent)]'
                                    : 'bg-[var(--border)] text-[var(--ink-light)]'
                            }`}>
                                {step.n}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className={`flex items-center gap-2 font-bold text-[13px] mb-1 transition-colors ${
                                    isOpen ? 'text-[var(--ink)]' : 'text-[var(--ink-light)]'
                                }`}>
                                    <span>{step.t}</span>
                                    {!isOpen && (
                                        <span className="text-[10px] font-mono font-normal text-[var(--ink-light)]/70 tracking-wider">
                                            點我展開 ▸
                                        </span>
                                    )}
                                </div>
                                {isOpen && (
                                    <div className="text-[12px] text-[var(--ink-mid)] leading-relaxed">
                                        {step.d}
                                    </div>
                                )}
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

const APA_FORMATS = [
    { type: '碩博士論文', template: '作者（出版年）。篇名。學校研究所所名：碩（博）士論文。', example: '鄒慧英（1989）。高中男女分校與其學校性別角色、成就動機之關係。國立高雄師範大學教育研究所：碩士論文。' },
    { type: '期刊論文', template: '作者（出版年）。論文篇名。期刊名，卷（期），起訖頁碼。', example: '林生傳（1994）。實習教師的困擾問題與輔導之研究。教育學刊，10，33-103。' },
];

const EXPORT_FIELDS = [
    { key: 'w5-topic', label: 'W4 定案題目（帶入）', question: '你的 W4 最終定案題目是什麼？' },
    { key: 'w5-search-keywords', label: '搜尋關鍵字', question: '你用了哪些關鍵字去華藝搜尋？' },
    { key: 'w5-search-strategy', label: '搜尋策略', question: '你用了什麼搜尋策略？（搜尋位置、限制條件、資料庫）' },
    { key: 'w5-found-paper', label: '找到的第一篇文獻', question: '你找到哪篇論文？標題、作者、年份、跟你的題目有什麼關係？' },
    { key: 'w5-apa-practice', label: 'APA 格式練習', question: '用 APA 格式寫出你找到的那篇論文的書目' },
    { key: 'w5-forensic-a', label: '證物 A 鑑識', question: '證物 A 你判定什麼等級？理由和查核路徑是？' },
    { key: 'w5-forensic-b', label: '證物 B 鑑識', question: '證物 B 你判定什麼等級？理由和查核路徑是？' },
    { key: 'w5-forensic-c', label: '證物 C 鑑識', question: '證物 C 你判定什麼等級？理由和查核路徑是？' },
    { key: 'w5-forensic-d', label: '證物 D 鑑識', question: '證物 D 你判定什麼等級？理由和查核路徑是？' },
    { key: 'w5-forensic-e', label: '證物 E 鑑識', question: '證物 E 你判定什麼等級？理由和查核路徑是？' },
    { key: 'w5-hardest', label: '小組總結：最難判斷的證物', question: '你們組覺得最難判斷的是哪一張？為什麼？' },
    { key: 'w5-aired-record', label: 'AI-RED 敘事紀錄', question: '本週最重要的一次 AI 互動（A-I-R-E-D 五要素）' },
];

/* ── 主組件 ── */

export const W50Page = () => {
    const [showLessonMap, setShowLessonMap] = useState(false);
    const [choiceResults, setChoiceResults] = useState([]);

    /* W4 定案題目帶入 */
    const [w4Topic, setW4Topic] = useState('');
    useEffect(() => {
        const records = readRecords();
        const prev = records['w4-final-topic'] || '';
        setW4Topic(prev);
        if (prev && !records['w5-topic']) {
            records['w5-topic'] = prev;
            localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
        }
    }, []);

    // 搜尋策略勾選（互動用，不存 localStorage）
    const [searchType, setSearchType] = useState({ full: false, title: false, abstract: false });
    const [searchLimit, setSearchLimit] = useState({ taiwan: false, years: false, thesis: false });
    const [searchDb, setSearchDb] = useState({ airiti: false, ncl: false });

    // 鑑識大賽：等級按鈕（互動用，不存 localStorage）
    const [forensicGrades, setForensicGrades] = useState({ A: '', B: '', C: '', D: '', E: '' });

    const trackChoice = useCallback((question, selected, correct) => {
        setChoiceResults(prev => {
            const idx = prev.findIndex(c => c.question === question);
            const entry = { question, selected, correct };
            if (idx >= 0) { const next = [...prev]; next[idx] = entry; return next; }
            return [...prev, entry];
        });
    }, []);

    /* ── 五個步驟 ── */

    const steps = [
        /* ──────────────────────────────────────
         * STEP 1: 為什麼找文獻 + 文獻等級
         * ────────────────────────────────────── */
        {
            title: '觀念：文獻是什麼',
            icon: '📚',
            content: (
                <div className="space-y-10 prose-zh">
                    {/* 定案題目帶入 */}
                    <div>
                        <div className="section-head"><h2>我的 W4 定案題目</h2><div className="line"></div><span className="mono">STARTING POINT</span></div>
                        <p className="section-desc">
                            先確認你的 W4 最終定案題目。下面的搜尋關鍵字都從這裡出發。
                        </p>
                        {w4Topic && (
                            <div className="bg-[var(--accent-light)] border border-[var(--accent)]/20 rounded-lg p-4 flex items-start gap-3 mb-3">
                                <span className="text-[16px]">📎</span>
                                <div>
                                    <div className="text-[11px] font-mono text-[var(--accent)] uppercase tracking-wider mb-1">自動帶入 W4 定案題目</div>
                                    <p className="text-[13px] text-[var(--ink-mid)] leading-relaxed">{w4Topic}</p>
                                    <p className="text-[11px] text-[var(--ink-light)] mt-1">如果你想修改，可以在下方編輯。</p>
                                </div>
                            </div>
                        )}
                        <ThinkRecord
                            dataKey="w5-topic"
                            prompt="我的 W4 最終定案題目"
                            placeholder="例如：本校高一生睡前手機使用內容類型與睡眠品質之差異研究"
                            rows={2}
                        />
                    </div>

                    {/* 為什麼找文獻 */}
                    <div>
                        <div className="section-head"><h2>為什麼要找文獻？</h2><div className="line"></div><span className="mono">5 分鐘</span></div>
                        <p className="section-desc">
                            在你動手蒐集資料之前，先看看別人有沒有做過類似的研究。這不是抄作業——這叫做「文獻探討」。
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                            {[
                                { n: '01', icon: '🔄', title: '避免重複', desc: '別人已經做過的，你不用再做。但你要先知道別人做過什麼，才能找到你的切入點。' },
                                { n: '02', icon: '🛠️', title: '學方法', desc: '別人怎麼設計問卷、怎麼訪談、怎麼分析——你可以學。' },
                                { n: '03', icon: '🏛️', title: '支持論點', desc: '你的研究動機說「我發現這個現象」，文獻幫你說「其他研究也發現類似的事」，讓你站得住腳。' },
                            ].map(item => (
                                <div key={item.n} className="bg-white border border-[var(--border)] rounded-xl p-5">
                                    <div className="text-2xl mb-3">{item.icon}</div>
                                    <div className="text-[11px] font-mono text-[var(--accent)] font-bold mb-1">理由 {item.n}</div>
                                    <div className="text-[14px] font-bold text-[var(--ink)] mb-2">{item.title}</div>
                                    <div className="text-[12px] text-[var(--ink-mid)] leading-relaxed">{item.desc}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 文獻等級 */}
                    <div>
                        <div className="section-head"><h2>文獻等級：A → D</h2><div className="line"></div><span className="mono">GRADE SYSTEM</span></div>
                        <p className="section-desc">
                            不是所有「資料」都能寫進研究報告。今天的目標：找到 A 或 B 級的文獻。
                        </p>

                        <div className="border border-[var(--border)] rounded-xl overflow-hidden mb-6">
                            <div className="bg-[var(--ink)] px-6 py-3 flex items-center justify-between">
                                <span className="text-white text-[13px] font-bold">文獻等級快速說明</span>
                                <span className="text-[var(--ink-light)] text-[11px] font-mono">今天目標：A 或 B 級</span>
                            </div>
                            <div className="divide-y divide-[var(--border)]">
                                {GRADE_LEVELS.map(g => {
                                    const c = GRADE_COLORS[g.grade];
                                    return (
                                        <div key={g.grade} className="flex items-center gap-4 px-6 py-4">
                                            <span className={`${c.bg} text-white text-[12px] font-bold w-8 h-8 rounded-full flex items-center justify-center shrink-0`}>{g.grade}</span>
                                            <div className="flex-1">
                                                <div className="text-[13px] font-bold text-[var(--ink)]">{g.emoji} {g.label}</div>
                                                <div className="text-[11px] text-[var(--ink-mid)]">{g.examples}</div>
                                            </div>
                                            <div className={`text-[11px] font-mono ${g.canCite ? 'text-[var(--success)]' : 'text-[var(--danger)]'}`}>
                                                {g.canCite ? '✓ 可引用' : '✗ 不可引用'}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* AI 幻覺警告 */}
                        <div className="p-5 bg-[var(--danger-light)] border border-[var(--danger)]/20 rounded-xl flex items-start gap-4">
                            <AlertTriangle size={18} className="text-[var(--danger)] shrink-0 mt-0.5" />
                            <div>
                                <div className="text-[13px] font-bold text-[var(--danger)] mb-1">AI 找文獻的陷阱</div>
                                <p className="text-[12px] text-[var(--ink-mid)] leading-relaxed">
                                    AI 會給你格式完美、看起來真實、但<strong>根本不存在</strong>的假論文——作者是假的、標題是假的、期刊是假的。這叫做 <strong>AI 幻覺</strong>。
                                    今天找到的文獻，都要親自在華藝或 Google Scholar 查證，確認作者存在、摘要存在，才算數。
                                </p>
                            </div>
                        </div>

                        <ThinkChoice
                            dataKey="w5-tc1"
                            prompt="以下哪一種來源可以寫進你的研究報告？"
                            options={[
                                { label: 'A', text: '維基百科上的「睡眠品質」條目' },
                                { label: 'B', text: '一篇 ChatGPT 給你的、看起來很專業的論文摘要' },
                                { label: 'C', text: '華藝資料庫找到的碩士論文' },
                                { label: 'D', text: '每日頭條的健康文章' },
                            ]}
                            answer="C"
                            feedback="只有華藝找到的碩士論文是 A 級來源，可以寫進報告。維基是 C 級（找方向用），ChatGPT 的可能根本不存在（D 級），每日頭條是內容農場（D 級）。"
                            onAnswer={(sel, ok) => trackChoice('以下哪一種來源可以寫進你的研究報告？', sel, ok)}
                        />
                    </div>

                    {/* 華藝資料庫教學 */}
                    <div>
                        <div className="section-head"><h2>華藝資料庫搜尋步驟</h2><div className="line"></div><span className="mono">TUTORIAL</span></div>

                        <HuayiSearchTutorial />
                    </div>
                </div>
            ),
        },

        /* ──────────────────────────────────────
         * STEP 2: 資料庫實戰（不准用 AI！）
         * ────────────────────────────────────── */
        {
            title: '資料庫實戰',
            icon: '🔍',
            content: (
                <div className="space-y-8 prose-zh">
                    <div className="section-head"><h2>資料庫查找練習</h2><div className="line"></div><span className="mono">不准用 AI · 25 分鐘</span></div>
                    <p className="section-desc">
                        先知道自己有多少斤兩。這個階段只能用華藝資料庫或國圖碩博系統，不能開 AI。靠你自己的搜尋策略找到第一篇真實證物。
                    </p>

                    <div className="notice notice-gold text-[12px] mb-6">
                        🚫 <strong>限時內不准用 AI！</strong>搜尋不是亂槍打鳥——先想好關鍵字組合，再下手搜尋。
                    </div>

                    {/* 搜尋關鍵字 */}
                    <ThinkRecord
                        dataKey="w5-search-keywords"
                        prompt="你的搜尋關鍵字是什麼？（從題目中拆出 2-3 個核心名詞）"
                        scaffold={['關鍵字 1：…', '關鍵字 2：…', '關鍵字 3（選填）：…']}
                        rows={3}
                    />

                    {/* 搜尋策略勾選 */}
                    <div className="bg-white border border-[var(--border)] rounded-xl overflow-hidden mt-4">
                        <div className="p-4 px-5 bg-[var(--paper-warm)] border-b border-[var(--border)] flex items-center justify-between">
                            <span className="font-bold text-[13px] text-[var(--ink)]">我的搜尋策略</span>
                            <span className="text-[10px] font-mono font-bold text-[var(--danger)]">🚫 不准用 AI</span>
                        </div>
                        <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <div className="text-[11px] font-mono text-[var(--ink-light)] mb-3 uppercase tracking-wider">搜尋位置</div>
                                <div className="space-y-2.5">
                                    {[['full', '全文搜尋'], ['title', '標題搜尋'], ['abstract', '摘要搜尋']].map(([key, label]) => (
                                        <label key={key} className="flex items-center gap-2.5 cursor-pointer group">
                                            <input
                                                type="checkbox"
                                                checked={searchType[key]}
                                                onChange={() => setSearchType(prev => ({ ...prev, [key]: !prev[key] }))}
                                                className="w-4 h-4 rounded border-[var(--border)] text-[var(--accent)] focus:ring-0"
                                            />
                                            <span className="text-[13px] text-[var(--ink-mid)] group-hover:text-[var(--ink)] transition-colors">{label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <div className="text-[11px] font-mono text-[var(--ink-light)] mb-3 uppercase tracking-wider">限制條件</div>
                                <div className="space-y-2.5">
                                    {[['taiwan', '臺灣研究'], ['years', '近 5 年'], ['thesis', '碩博士論文']].map(([key, label]) => (
                                        <label key={key} className="flex items-center gap-2.5 cursor-pointer group">
                                            <input
                                                type="checkbox"
                                                checked={searchLimit[key]}
                                                onChange={() => setSearchLimit(prev => ({ ...prev, [key]: !prev[key] }))}
                                                className="w-4 h-4 rounded border-[var(--border)] text-[var(--accent)] focus:ring-0"
                                            />
                                            <span className="text-[13px] text-[var(--ink-mid)] group-hover:text-[var(--ink)] transition-colors">{label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <div className="text-[11px] font-mono text-[var(--ink-light)] mb-3 uppercase tracking-wider">使用的資料庫</div>
                                <div className="space-y-2.5">
                                    {[['airiti', '華藝線上圖書館'], ['ncl', '國圖碩博士論文系統']].map(([key, label]) => (
                                        <label key={key} className="flex items-center gap-2.5 cursor-pointer group">
                                            <input
                                                type="checkbox"
                                                checked={searchDb[key]}
                                                onChange={() => setSearchDb(prev => ({ ...prev, [key]: !prev[key] }))}
                                                className="w-4 h-4 rounded border-[var(--border)] text-[var(--accent)] focus:ring-0"
                                            />
                                            <span className="text-[13px] text-[var(--ink-mid)] group-hover:text-[var(--ink)] transition-colors">{label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 找到的第一篇文獻 */}
                    <div className="mt-6">
                        <div className="section-head"><h2>我找到的第一篇文獻</h2><div className="line"></div><span className="mono">至少找 1 篇</span></div>
                        <p className="section-desc">
                            選標題最接近你題目的那一篇。看完摘要後，記錄它跟你的研究有什麼關係。
                        </p>

                        <ThinkRecord
                            dataKey="w5-found-paper"
                            prompt="記下你找到的文獻：標題、作者、年份、來源、跟你的題目有什麼關係？"
                            scaffold={['標題：…', '作者：…', '年份：…', '來源（期刊/學校）：…', '跟我的題目相關的地方是：…']}
                            rows={6}
                        />
                    </div>

                    <div className="notice notice-accent text-[12px]">
                        💡 搜不到？試試換同義詞、把關鍵字從 3 個減成 2 個，或者把「標題搜尋」改成「全文搜尋」。
                    </div>
                </div>
            ),
        },

        /* ──────────────────────────────────────
         * STEP 3: AI 關鍵字 + APA 格式
         * ────────────────────────────────────── */
        {
            title: 'APA 格式練習',
            icon: '📝',
            content: (
                <div className="space-y-10 prose-zh">
                    {/* APA 格式 */}
                    <div>
                        <div className="section-head"><h2>APA 格式練習</h2><div className="line"></div><span className="mono">10 分鐘</span></div>
                        <p className="section-desc">
                            偵探找到證物後，如果標籤貼錯（格式不對），在法庭上是會被作廢的！學術界用 APA 格式記錄引用，你不需要背它，但要認識它長什麼樣子。
                        </p>

                        <div className="space-y-3 mb-6">
                            {APA_FORMATS.map(f => (
                                <div key={f.type} className="p-4 bg-[var(--paper)] rounded-[var(--radius-unified)] border border-[var(--border)]">
                                    <div className="text-[11px] font-mono text-[var(--ink-light)] mb-2">{f.type}</div>
                                    <div className="text-[13px] text-[var(--ink)] font-medium leading-relaxed mb-2">{f.template}</div>
                                    <div className="text-[12px] text-[var(--ink-mid)] leading-relaxed">
                                        範例：{f.example}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="notice notice-accent text-[12px] mb-4">
                            📎 更完整的格式範例可參閱
                            <a href="https://www.kfsh.hc.edu.tw/uploads/article/8553/202108310817013.pdf" target="_blank" rel="noopener noreferrer" className="underline font-bold ml-1">
                                全國高級中等學校小論文寫作比賽引註及參考文獻格式範例 ↗
                            </a>
                        </div>

                        <ThinkRecord
                            dataKey="w5-apa-practice"
                            prompt="照 APA 格式，試寫你找到的那篇論文的書目（寫錯沒關係，重點是試）"
                            scaffold={['作者（年份）。', '篇名。', '學校研究所所名：碩（博）士論文。']}
                            rows={3}
                        />

                        {/* 格式確認清單 */}
                        <div className="mt-4 p-4 bg-[var(--paper-warm)] rounded-xl border border-[var(--border)]">
                            <div className="text-[12px] font-bold text-[var(--ink)] mb-3">格式確認清單（自己檢查一遍）</div>
                            <div className="content-grid" style={{ '--cols': 2 }}>
                                {['作者全名格式正確', '年份有括號', '論文或文章名稱完整', '期刊或學校名稱正確', '類型判斷正確（論文 or 期刊）', '出版地/卷期頁碼填寫完整'].map((item, i) => (
                                    <div key={i} className="content-item flex items-center gap-2 text-[12px] text-[var(--ink-mid)]">
                                        <span className="text-[var(--ink-light)]">□</span> {item}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            ),
        },

        /* ──────────────────────────────────────
         * STEP 4: 證物鑑識大賽
         * ────────────────────────────────────── */
        {
            title: '證物鑑識大賽',
            icon: '🔬',
            content: (
                <div className="space-y-8 prose-zh">
                    <div className="section-head"><h2>證物鑑識大賽：等級判定</h2><div className="line"></div><span className="mono">小組任務 · 30 分鐘</span></div>
                    <p className="section-desc">
                        你的小組會拿到五張證物卡（A–E）。判斷每張的文獻等級，並記錄判斷理由和查核路徑。不要只勾等級——<strong>告訴我你怎麼知道的</strong>。
                    </p>

                    <div className="notice notice-gold text-[12px] mb-6">
                        💡 <strong>查核路徑很重要！</strong>你怎麼知道證物 D 是內容農場？你怎麼查出證物 B 是不是真的期刊？去 Google 搜標題？去查作者有沒有這個人？把你的偵查過程寫下來。
                    </div>

                    <div className="space-y-6">
                        {EVIDENCE_CARDS.map(card => (
                            <div key={card.id} className="bg-white border border-[var(--border)] rounded-xl overflow-hidden">
                                <div className="bg-[var(--ink)] px-6 py-3 flex items-center gap-3">
                                    <span className="text-[var(--gold)] font-mono font-bold text-[14px]">證物 {card.id}</span>
                                    <span className="text-white text-[13px] font-medium truncate">{card.title}</span>
                                </div>
                                <div className="p-5">
                                    <div className="text-[13px] font-medium text-[var(--ink)] mb-2">{card.meta}</div>
                                    <p className="text-[12px] text-[var(--ink-mid)] leading-relaxed mb-2 italic">「{card.desc}」</p>
                                    {card.extra && (
                                        <div className="text-[11px] font-mono text-[var(--ink-light)] mb-4">{card.extra}</div>
                                    )}

                                    {/* 等級按鈕 */}
                                    <div className="flex items-center gap-3 mb-4">
                                        <span className="text-[11px] font-mono text-[var(--ink-light)]">判定等級：</span>
                                        {['A', 'B', 'C', 'D'].map(level => {
                                            const c = GRADE_COLORS[level];
                                            const selected = forensicGrades[card.id] === level;
                                            return (
                                                <button
                                                    key={level}
                                                    onClick={() => setForensicGrades(prev => ({ ...prev, [card.id]: level }))}
                                                    className={`w-9 h-9 rounded-full font-bold text-[12px] border-2 flex items-center justify-center transition-all ${selected ? `${c.bg} border-transparent text-white` : 'border-[var(--border)] text-[var(--ink-light)] hover:border-[var(--ink-mid)]'}`}
                                                >
                                                    {level}
                                                </button>
                                            );
                                        })}
                                    </div>

                                    <ThinkRecord
                                        dataKey={`w5-forensic-${card.id.toLowerCase()}`}
                                        prompt={`證物 ${card.id}：你判定什麼等級？理由是什麼？你怎麼查證的？`}
                                        scaffold={[`我判定是…級，因為…`, '我的查核路徑：…']}
                                        rows={3}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* 小組總結 */}
                    <div className="mt-6 p-5 bg-[var(--paper)] rounded-xl border-2 border-dashed border-[var(--accent)]/40">
                        <div className="text-[11px] font-mono text-[var(--accent)] uppercase mb-4 tracking-wider">🔬 小組總結</div>
                        <ThinkRecord
                            dataKey="w5-hardest"
                            prompt="你們組覺得最難判斷的是哪一張？為什麼？"
                            scaffold={['最難判斷的是證物…', '因為…', '我們最後的判斷依據是…']}
                            rows={4}
                        />
                    </div>
                </div>
            ),
        },

        /* ──────────────────────────────────────
         * STEP 5: 回顧與繳交
         * ────────────────────────────────────── */
        {
            title: '回顧與繳交',
            icon: '📋',
            content: (
                <div className="space-y-8 prose-zh">
                    {/* 檢核清單 */}
                    <div className="bg-white border border-[var(--border)] rounded-xl overflow-hidden">
                        <div className="p-4 px-5 bg-[var(--paper-warm)] border-b border-[var(--border)] font-bold text-[13px]">
                            ✅ 本週結束，你應該要會
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-[1px] bg-[var(--border)]">
                            {[
                                '用華藝資料庫找文獻——知道怎麼用關鍵字組合縮小搜尋範圍',
                                '親自查證 1 篇 A/B 級文獻——確認作者存在、摘要存在',
                                'APA 格式——能正確記錄你的文獻來源',
                                '辨別文獻等級 A–D——知道哪些能寫進報告、哪些不能',
                                '說出查核路徑——怎麼判斷一份資料的真偽',
                                '知道 AI 幻覺的風險——AI 給的文獻一定要親自查證',
                            ].map((item, i) => (
                                <div key={i} className="p-4 px-6 bg-white flex items-start gap-3">
                                    <CheckCircle2 size={16} className="text-[var(--success)] mt-0.5 flex-shrink-0" />
                                    <span className="text-[13px] text-[var(--ink-mid)]">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                                        {/* AIRED 敘事紀錄（循序漸進：五欄 → 一段話） */}
                    <AIREDNarrative week="5" hint="華藝搜尋可能遇到 AI 輔助" optional={true} />

                    {/* 一鍵複製 */}
                    <ExportButton
                        weekLabel="W5 文獻搜尋入門"
                        fields={EXPORT_FIELDS}
                        choices={choiceResults}
                    />

                    {/* 下週預告 */}
                    <div className="next-week-preview">
                        <div className="next-week-header">
                            <span className="next-week-badge">NEXT WEEK</span>
                            <h3 className="next-week-title">W6 預告</h3>
                        </div>
                        <div className="next-week-content">
                            <div className="next-week-col">
                                <div className="next-week-label">W6 主題</div>
                                <p className="next-week-text">文獻偵探社——識破換字抄襲、文獻堆砌，學會「三明治」寫法把文獻變成自己的論述。</p>
                            </div>
                            <div className="next-week-col">
                                <div className="next-week-label">你要帶</div>
                                <p className="next-week-text">這週找到的 <strong>A/B 級文獻</strong>與 APA 書目——W6 要用這些素材練文獻探討寫作。</p>
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
                    <span className="hidden md:inline">研究方法與專題 / 研究規劃 / </span><span className="text-[var(--ink)] font-bold">文獻搜尋入門 W5</span>
                </div>
                <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
                    <span className="bg-[var(--paper-warm)] text-[var(--ink)] text-[10px] font-bold px-2 py-0.5 rounded-[2px] font-mono">100 MINS</span>
                    <ResetWeekButton weekPrefix="w5-" />
                    <button
                        onClick={() => setShowLessonMap(!showLessonMap)}
                        className="text-[11px] text-[var(--ink-light)] hover:text-[var(--accent)] transition-colors flex items-center gap-1 font-mono"
                    >
                        <Map size={12} /> <span className="hidden md:inline">{showLessonMap ? 'Hide Plan' : 'Instructor View'}</span>
                    </button>
                    <span className="bg-[var(--ink)] text-white text-[10px] font-bold px-2 py-0.5 rounded-[2px] font-mono">AI-GREEN · B</span>
                </div>
            </div>

            {showLessonMap && (
                <div className="animate-in slide-in-from-top-4 duration-300">
                    <LessonMap data={W50Data} />
                </div>
            )}

            {/* PAGE HEADER — Hero Block */}
            <HeroBlock
                kicker="R.I.B. 調查檔案 · 研究方法與專題 · W5"
                title="文獻搜尋入門："
                accentTitle="找對資料，打好地基"
                subtitle="W4 完成了題目定案。現在往前走一步：為你的研究找到文獻基礎。這週不用 AI——靠自己在華藝搜尋、練 APA 格式，最後進行證物鑑識大賽，學會辨別文獻真偽。"
                meta={[
                    { label: '本週任務', value: '華藝搜尋 + APA 格式 + 證物鑑識' },
                    { label: '時長', value: '100 MINS' },
                    { label: '課堂產出', value: 'A/B 級文獻 + APA 書目 + 鑑識紀錄' },
                    { label: '下週預告', value: 'W6 文獻偵探社' },
                ]}
            />
            <CourseArc items={W50Data.courseArc} />

            {/* 本週簡報 */}
            <div className="flex justify-end mb-8 -mt-2">
                <a
                    href="https://canva.link/uxnn3h5uxwzloy7"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold tracking-wider text-[var(--ink-light)] hover:text-[var(--ink)] bg-[var(--paper)] hover:bg-[var(--paper-warm)] border border-[var(--border)] hover:border-[var(--ink)]/20 px-3 py-1.5 rounded-[5px] transition-all"
                >
                    📊 本週簡報 ↗
                </a>
            </div>

            {/* STEP ENGINE */}
            <StepEngine
                steps={steps}
                prevWeek={{ label: '回 W4 題目定案', to: '/w4' }}
                nextWeek={{ label: '前往 W6 文獻偵探社', to: '/w6' }}
            flat
            />
        </div>
    );
};
