import React, { useState, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CourseArc from '../components/ui/CourseArc';
import ContentTypeChip from '../components/ui/ContentTypeChip';
import ThinkRecord from '../components/ui/ThinkRecord';
import AIREDNarrative from '../components/ui/AIREDNarrative';
import ThinkChoice from '../components/ui/ThinkChoice';
import StepEngine from '../components/ui/StepEngine';
import HeroBlock from '../components/ui/HeroBlock';
import TaskCard from '../components/ui/TaskCard';
import ExportButton from '../components/ui/ExportButton';
import StepBriefing from '../components/ui/StepBriefing';
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
import { W7Data } from '../data/lessonMaps';

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
        answerGrade: 'A',
        answerHint: '關鍵線索：有完整作者姓名、指導教授、學校名稱、明確論文類型——這是碩士論文的標準格式，屬 A 級（主要證據）。查核路徑：到華藝線上圖書館或國圖碩博士論文系統搜「鄭淑米」或標題關鍵字「數學焦慮 高中」，確認可以找到原文摘要。',
    },
    {
        id: 'B',
        title: 'Smartphone Usage and Sleep Quality in Taiwanese Adolescents: A Longitudinal Study',
        meta: 'Authors: Michael Chen, Sarah Wang｜2023｜Journal of Sleep Research and Technology Vol.18(4)',
        desc: 'This longitudinal study followed Taiwanese high school students for three years. Results indicated that excessive smartphone use predicted poorer sleep outcomes.',
        extra: 'DOI: 10.1177/0272989X241231721',
        glossary: '🔤 關鍵詞對照：longitudinal study＝長期追蹤研究、smartphone usage＝智慧型手機使用、sleep quality／outcomes＝睡眠品質、predicted poorer＝預測會變差。｜DOI 是論文的「身分證號碼」——到 doi.org 貼上這串能查到原文才是真的，查不到＝假 DOI。',
        answerGrade: '?',
        answerHint: '這張卡的關鍵不在「看格式」，而在「查 DOI」。格式正確、英文期刊、有 DOI——光看這些還不夠。步驟：到 doi.org，把上方的 DOI 號碼貼進去搜尋。查得到原文 → A 級；查不到 → AI 幻覺生成的假 DOI，等同 D 級。這張卡設計的目的就是讓你練習這個查核動作——光眼睛看判斷不了，要動手查。',
    },
    {
        id: 'C',
        title: '我的不正經人生觀',
        meta: '作者：黃益中｜出版社：寶瓶文化｜2019｜ISBN: 978-986-406-159-4',
        desc: '本書以教育現場的案例與社會觀察，討論青少年成長、學習動機、人際互動與價值選擇等議題。',
        answerGrade: 'B',
        answerHint: '關鍵線索：黃益中是真實教育工作者（公民老師），寶瓶文化是真實出版社，書籍存在。但這是通俗社會觀察書，不是同儕審查學術著作——不符合 A 級。根據等級定義，B 級包含「專家專書」，這本書符合 B 級（輔助參考）。可以引用，但只能輔助說明，不能當你研究結論的主要論據。',
    },
    {
        id: 'D',
        title: '研究證實：高中生滑手機讓成績下降 37%',
        meta: '來源：未具名教育新訊網｜作者：未署名｜2024',
        desc: '本網站整理多項「最新研究」指出，高中生每日滑手機超過 1 小時，學業成績平均下降 37%；建議家長嚴格管控。文章未標示原始研究來源，引用之「期刊」名稱在華藝、Google Scholar 皆查無資料。',
        answerGrade: 'D',
        answerHint: '三個紅旗同時出現：① 作者未署名、② 未標任何原始研究來源、③「37%」這種精確數字卻查不到是哪篇期刊說的。查核路徑：用「高中生 手機 成績 37%」去 Google Scholar 搜，找不到任何對應研究；所謂「期刊」名稱在華藝查無資料。D 級的特徵就是「數字看起來很精確，但來源查不到」。',
    },
    {
        id: 'E',
        title: '【Facebook 貼文】國家教育研究院',
        meta: '平台：Facebook｜2026 年 1 月 5 日',
        desc: '全國多所學校開始限制學生上課使用手機，休息時間也有 63% 禁用。老師們普遍支持，期望恢復純粹的學習環境。但面對 AI 與數位時代，也有教師持保留態度。',
        answerGrade: 'C',
        answerHint: '這張最容易跟 D 級搞混——但 C 和 D 的區別是：D 是假的或有意誤導，C 是「真實但不夠嚴謹」。國家教育研究院是真實機構，這則貼文的資訊不是捏造的——但社群媒體貼文不符合學術引用標準，沒有同儕審查、沒有完整研究方法。屬 C 級（找方向用），可以幫你了解議題現況，但不能寫進報告的引用文獻裡。',
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
        <>
        {/* 松山高中華藝登入路徑（簡報金礦：給學生在校內裝置實際操作的具體路徑） */}
        <div className="bg-[#EFF6FF] border border-[#BFDBFE] rounded-xl p-4 mb-3">
            <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-mono font-bold bg-[#1E40AF] text-white px-2 py-0.5 rounded-[3px] uppercase tracking-wider">前置 · 0 步</span>
                <span className="text-[13px] font-bold text-[#1E40AF]">先登入華藝（松山高中專屬路徑）</span>
            </div>
            <p className="text-[12px] text-[#1E3A8A] leading-relaxed mb-2">
                學校付費訂閱華藝，必須從**台北市教育局線上資料庫**登入才能下載全文。在校內或學校帳號登入後跑下面 5 步：
            </p>
            <ol className="text-[12px] text-[#1E3A8A] leading-[1.85] list-none space-y-1 pl-1">
                <li><span className="font-mono font-bold text-[#1E40AF] mr-2">①</span>松山高中首頁</li>
                <li><span className="font-mono font-bold text-[#1E40AF] mr-2">②</span>學生專區 → 圖書借閱</li>
                <li><span className="font-mono font-bold text-[#1E40AF] mr-2">③</span>選擇「電子書庫」頁籤</li>
                <li><span className="font-mono font-bold text-[#1E40AF] mr-2">④</span>點選進入「臺北市教育局線上資料庫管理平台」（請先登入）</li>
                <li><span className="font-mono font-bold text-[#1E40AF] mr-2">⑤</span>登入成功顯示「[北市教育局]」+ 你的名字 → 進入華藝線上圖書館</li>
            </ol>
            <p className="text-[11px] text-[#1E3A8A]/80 italic mt-2 leading-relaxed">
                💡 沒從這條路徑進去 = 只能看摘要、不能下載全文（會跳付費頁）。Google Scholar 可以當輔助，但華藝是這週主場。
            </p>
        </div>
        <div className="border border-[var(--border)] rounded-xl overflow-hidden bg-white">
            <div className="p-4 px-5 bg-[var(--paper-warm)] border-b border-[var(--border)] flex items-center gap-3 flex-wrap">
                <Search size={15} className="text-[var(--ink)]" />
                <span className="font-bold text-[13px] text-[var(--ink)]">登入後 · 華藝四步搜尋（以「本校高一生手機使用與睡眠品質的關係」為範例）</span>
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
        </>
    );
}

const APA_FORMATS = [
    { type: '碩博士論文', template: '作者（出版年）。篇名。學校研究所所名：碩（博）士論文。', example: '鄒慧英（1989）。高中男女分校與其學校性別角色、成就動機之關係。國立高雄師範大學教育研究所：碩士論文。' },
    { type: '期刊論文', template: '作者（出版年）。論文篇名。期刊名，卷（期），起訖頁碼。', example: '林生傳（1994）。實習教師的困擾問題與輔導之研究。教育學刊，10，33-103。' },
];

const EXPORT_FIELDS = [
    { key: 'w7-topic', label: '本週題目（從前面週次帶入）', question: '你帶到 W7 找文獻的題目是什麼？（W6 合題 / W4 個人題目）' },
    { key: 'w7-search-keywords', label: '搜尋關鍵字', question: '你用了哪些關鍵字去華藝搜尋？' },
    { key: 'w7-search-strategy', label: '搜尋策略', question: '你用了什麼搜尋策略？（搜尋位置、限制條件、資料庫）' },
    { key: 'w7-found-paper', label: '找到的第一篇文獻', question: '你找到哪篇論文？標題、作者、年份、跟你的題目有什麼關係？' },
    { key: 'w7-apa-practice', label: 'APA 格式練習', question: '用 APA 格式寫出你找到的那篇論文的書目' },
    { key: 'w7-forensic-a', label: '證物 A 鑑識', question: '證物 A 你判定什麼等級？理由和查核路徑是？' },
    { key: 'w7-forensic-b', label: '證物 B 鑑識', question: '證物 B 你判定什麼等級？理由和查核路徑是？' },
    { key: 'w7-forensic-c', label: '證物 C 鑑識', question: '證物 C 你判定什麼等級？理由和查核路徑是？' },
    { key: 'w7-forensic-d', label: '證物 D 鑑識', question: '證物 D 你判定什麼等級？理由和查核路徑是？' },
    { key: 'w7-forensic-e', label: '證物 E 鑑識', question: '證物 E 你判定什麼等級？理由和查核路徑是？' },
    { key: 'w7-hardest', label: '個人鑑識反思：最難判斷的證物', question: '五張裡你自己最難判斷的是哪張？難在哪裡？聽完組員的查核路徑後，你的判斷有沒有改變？' },
    { key: 'w7-aired-record', label: 'AI-RED 敘事紀錄', question: '如果你今天用 AI 幫忙判斷某張證物（或華藝搜尋輔助），請記錄這次互動；若未使用 AI，可留白。' },
];

/* ── APA 提示詞複製按鈕 ── */
const APA_PROMPT = '請幫我確認這份書目是否符合 APA 第 7 版格式，直接給我：① 哪裡錯；② 修正後的正確版本。書目如下：[貼你的書目]';

const ApaPromptTip = () => {
    const [copied, setCopied] = useState(false);
    const handleCopy = () => {
        navigator.clipboard.writeText(APA_PROMPT).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };
    return (
        <div className="mt-4 notice notice-tip text-[12px]">
            <span className="font-bold">💡 選做：不確定格式對不對？</span>
            {' '}把書目貼給 AI，再貼這個 prompt：
            <div className="flex items-start gap-2 mt-2">
                <span className="font-mono text-[11.5px] flex-1 bg-white/60 rounded px-3 py-2 leading-relaxed select-all">
                    {APA_PROMPT}
                </span>
                <button
                    onClick={handleCopy}
                    className="shrink-0 text-[11px] font-bold px-3 py-2 rounded bg-white/80 border border-current hover:bg-white transition-colors"
                >
                    {copied ? '✅ 已複製' : '📋 複製'}
                </button>
            </div>
        </div>
    );
};

/* ── 主組件 ── */

export const W50Page = () => {
    const [showLessonMap, setShowLessonMap] = useState(false);
    const [choiceResults, setChoiceResults] = useState([]);

    /* 研究題目帶入（W6 合題 > W4 我的題目 > W3 定案 fallback） */
    const [myTopic, setMyTopic] = useState('');
    const [topicSource, setTopicSource] = useState(''); // 'w6-team' | 'w4' | 'w3'
    const [editingTopic, setEditingTopic] = useState(false);

    /* 研究方法帶入（W4 選定，可在此切換） */
    const METHOD_HINTS = {
        survey:      { icon: '📋', label: '問卷調查', hint: '問卷量表名詞（如「焦慮量表」「自我效能量表」）' },
        interview:   { icon: '🎙️', label: '訪談研究', hint: '訪談主題詞（如「動機」「經驗描述」「心理歷程」）' },
        experiment:  { icon: '🧪', label: '實驗研究', hint: '操控條件詞（如「介入方式」「控制組」「前後測」）' },
        observation: { icon: '👁️', label: '觀察研究', hint: '行為觀察詞（如「分心行為」「互動頻率」「發生次數」）' },
        literature:  { icon: '📚', label: '文獻分析', hint: '文獻類型詞（如「分析方法」「研究對象」「歷史脈絡」）' },
    };
    const [activeMethodId, setActiveMethodId] = useState('');

    useEffect(() => {
        const records = readRecords();
        let src = '';
        let prev = '';
        if (records['w6-team-topic']?.trim()) {
            prev = records['w6-team-topic'].trim();
            src = 'w6-team';
        } else if (records['w4-my-topic']?.trim()) {
            prev = records['w4-my-topic'].trim();
            src = 'w4';
        } else {
            prev = (records['w3-final-topic'] || records['w4-final-topic'] || '').trim();
            src = prev ? 'w3' : '';
        }
        setMyTopic(prev);
        setTopicSource(src);
        if (prev && !records['w7-topic']) {
            records['w7-topic'] = prev;
            localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
        }
        /* 讀 W4 方法 */
        const mid = localStorage.getItem('w4-method-pick') || '';
        setActiveMethodId(mid && METHOD_HINTS[mid] ? mid : '');
    }, []);

    // 搜尋策略勾選（互動用，不存 localStorage）
    const [searchType, setSearchType] = useState({ full: false, title: false, abstract: false });
    const [searchLimit, setSearchLimit] = useState({ taiwan: false, years: false, thesis: false });
    const [searchDb, setSearchDb] = useState({ airiti: false, ncl: false });

    // 鑑識大賽：等級按鈕（存 localStorage）
    const [forensicGrades, setForensicGrades] = useState({ A: '', B: '', C: '', D: '', E: '' });
    // 我認領的證物（存 localStorage）
    const [claimedCards, setClaimedCards] = useState([]);

    /* 老師解鎖：標題點三下，全班答案同時顯示 */
    const [teacherUnlocked, setTeacherUnlocked] = useState(false);
    const titleClickCount = React.useRef(0);
    const titleClickTimer = React.useRef(null);
    const handleTitleClick = useCallback(() => {
        titleClickCount.current += 1;
        clearTimeout(titleClickTimer.current);
        titleClickTimer.current = setTimeout(() => { titleClickCount.current = 0; }, 800);
        if (titleClickCount.current >= 3) {
            setTeacherUnlocked(true);
            titleClickCount.current = 0;
        }
    }, []);

    useEffect(() => {
        try {
            const records = readRecords();
            const gRaw = records['w7-forensic-grades'];
            if (gRaw) setForensicGrades(JSON.parse(gRaw));
            const cRaw = records['w7-claimed-cards'];
            if (cRaw) setClaimedCards(JSON.parse(cRaw));
        } catch {}
    }, []);

    const handleSetForensicGrade = useCallback((cardId, level) => {
        setForensicGrades(prev => {
            const next = { ...prev, [cardId]: level };
            try {
                const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
                all['w7-forensic-grades'] = JSON.stringify(next);
                localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
            } catch {}
            return next;
        });
    }, []);

    const handleToggleClaimed = useCallback((cardId) => {
        setClaimedCards(prev => {
            const next = prev.includes(cardId)
                ? prev.filter(id => id !== cardId)
                : [...prev, cardId];
            try {
                const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
                all['w7-claimed-cards'] = JSON.stringify(next);
                localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
            } catch {}
            return next;
        });
    }, []);

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
                    <StepBriefing
                        lines={[
                            { label: '學', text: 'A-D 證據分級標準，以及 AI 幻覺是怎麼出現的' },
                        ]}
                    />

                    {/* 術語小辭典 — 三方共識：W7 專業詞密度高 */}
                    <div className="bg-[var(--paper-warm)] border border-[var(--border)] rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <ContentTypeChip type="學" />
                            <p className="text-[12px] font-bold text-[var(--ink)]">📒 先看懂這兩個詞</p>
                        </div>
                        <ul className="text-[12px] text-[var(--ink-mid)] leading-[1.7] space-y-1.5 list-none">
                            <li><strong className="text-[var(--ink)]">同儕審查（peer-reviewed）</strong>　＝ 領域學者匿名把關後才刊出，<strong>不是</strong>同學互評。期刊封面或資料庫通常會標 peer-reviewed。</li>
                            <li><strong className="text-[var(--ink)]">文獻探討 ＝ 文獻回顧</strong>　同一件事的兩種說法：把別人做過的研究讀過、整理過。計畫書裡這一章正式名稱叫「文獻回顧」。（跟 W4 的「文獻分析<strong>法</strong>」不一樣——那是一種研究方法。）</li>
                        </ul>
                    </div>

                    {/* 為什麼找文獻 */}
                    <div>
                        <div className="section-head">
                            <div className="flex items-center gap-2">
                                <ContentTypeChip type="學" />
                                <h2>為什麼要找文獻？</h2>
                            </div>
                            <div className="line"></div><span className="mono">5 分鐘</span>
                        </div>
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
                                    <div className="text-3xl mb-3">{item.icon}</div>
                                    <div className="text-[11px] font-mono text-[var(--accent)] font-bold mb-1">理由 {item.n}</div>
                                    <div className="text-[20px] font-bold text-[var(--ink)] mb-2 leading-tight">{item.title}</div>
                                    <div className="text-[13px] text-[var(--ink-mid)] leading-relaxed">{item.desc}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 文獻等級 */}
                    <div>
                        <div className="section-head">
                            <div className="flex items-center gap-2">
                                <ContentTypeChip type="學" />
                                <h2>文獻等級：A → D</h2>
                            </div>
                            <div className="line"></div><span className="mono">GRADE SYSTEM</span>
                        </div>
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
                                <div className="flex items-center gap-2 mb-1">
                                    <ContentTypeChip type="注意" />
                                    <div className="text-[13px] font-bold text-[var(--danger)]">AI 找文獻的陷阱</div>
                                </div>
                                <p className="text-[12px] text-[var(--ink-mid)] leading-relaxed">
                                    AI 會給你格式完美、看起來真實、但<strong>根本不存在</strong>的假論文——作者是假的、標題是假的、期刊是假的。這叫做 <strong>AI 幻覺</strong>。
                                    今天找到的文獻，都要親自在華藝或 Google Scholar 查證，確認作者存在、摘要存在，才算數。
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 mb-1">
                            <ContentTypeChip type="練" />
                            <p className="text-[12px] font-bold text-[var(--ink-mid)]">選擇練習</p>
                        </div>
                        <ThinkChoice
                            dataKey="w7-tc1"
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
                        <div className="section-head">
                            <div className="flex items-center gap-2">
                                <ContentTypeChip type="學" />
                                <h2>華藝資料庫搜尋步驟</h2>
                            </div>
                            <div className="line"></div><span className="mono">TUTORIAL</span>
                        </div>

                        <div className="notice notice-accent text-[12px] mb-3">
                            🧭 <strong>四個名字別搞混</strong>：<strong>華藝＝Airiti</strong>，是台灣最大的學術資料庫（同一個東西兩個名）；<strong>國圖碩博</strong>是國家圖書館的論文系統，另一個庫；<strong>臺北市教育局線上資料庫平台</strong>不是資料庫，是「進華藝前要先登入的入口」。
                        </div>

                        <HuayiSearchTutorial />
                    </div>
                </div>
            ),
        },

        /* ──────────────────────────────────────
         * STEP 2: 資料庫實戰（先手動搜尋，建立自己的查找路徑）
         * ────────────────────────────────────── */
        {
            title: '資料庫實戰',
            icon: '🔍',
            content: (
                <div className="space-y-8 prose-zh">
                    <StepBriefing
                        lines={[
                            { label: '做', text: '寫 3 組關鍵字 + 勾搜尋策略，在華藝找第 1 篇 A/B 級文獻，填好標題、作者、年份' },
                            { label: '注意', text: '你在這裡記錄的是你個人的搜尋技能與貢獻——組的完整文獻清單寫進共同文件，不在網頁上填' },
                        ]}
                    />

                    {/* ── 研究題目確認卡 ── */}
                    {myTopic ? (
                        <div className={`rounded-[var(--radius-unified)] border-2 overflow-hidden ${topicSource === 'w6-team' ? 'border-[var(--success)]' : 'border-[var(--accent)]'}`}>
                            <div className={`px-5 py-3 flex items-center justify-between ${topicSource === 'w6-team' ? 'bg-[var(--success)]' : 'bg-[var(--accent)]'}`}>
                                <div className="flex items-center gap-2">
                                    <span className="text-white text-[13px] font-bold">
                                        {topicSource === 'w6-team' ? '📌 W6 小組合題（自動帶入）' : topicSource === 'w4' ? '📌 W4 個人定案題目（自動帶入）' : '📌 W3 題目（自動帶入）'}
                                    </span>
                                </div>
                                <button
                                    onClick={() => setEditingTopic(v => !v)}
                                    className="text-white/90 text-[12px] flex items-center gap-1 hover:text-white transition-colors"
                                >
                                    ✏️ {editingTopic ? '收起' : '修改'}
                                </button>
                            </div>
                            <div className="bg-white px-5 py-4">
                                <p className="text-[20px] font-bold text-[var(--ink)] leading-snug">{myTopic}</p>
                                {editingTopic && (
                                    <div className="mt-3">
                                        <ThinkRecord dataKey="w7-topic" placeholder="在這裡修改你的研究題目……" compact />
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="bg-[#FEF3C7] border-l-4 border-[#D97706] p-4 rounded-r-[8px] text-[13px] text-[#92400E] leading-relaxed">
                            <p className="font-bold mb-1">⚠️ 還沒偵測到研究題目</p>
                            <p>請先完成 W4 或 W6，或直接在下方填入：</p>
                            <div className="mt-2">
                                <ThinkRecord dataKey="w7-topic" placeholder="在這裡填入你的研究題目……" compact />
                            </div>
                        </div>
                    )}

                    {/* ── Phase 1：小組共識 ── */}
                    <div className="rounded-[var(--radius-unified)] border-2 border-[var(--accent)] overflow-hidden">
                        <div className="bg-[var(--accent)] px-5 py-3 flex items-center gap-3">
                            <span className="text-[11px] font-mono text-white/80 font-bold uppercase tracking-widest">PHASE 1 · 小組 · 約 5 分鐘</span>
                        </div>
                        <div className="bg-white p-6 space-y-5">
                            <p className="text-[22px] font-bold text-[var(--ink)] leading-tight">先一起討論：關鍵字 ＆ 分工</p>
                            <p className="text-[13px] text-[var(--ink-mid)] leading-relaxed">
                                各自去搜之前，先花 5 分鐘一起做兩件事——這樣帶回來的文獻才不會全部重複。
                            </p>

                            {/* 關鍵字候選 */}
                            <div className="bg-[var(--paper-warm)] rounded-[8px] p-4 space-y-2">
                                <p className="text-[13px] font-bold text-[var(--ink)]">① 共同列出關鍵字候選</p>
                                <p className="text-[12.5px] text-[var(--ink-mid)] leading-relaxed">
                                    把題目拆成名詞：<strong>自變項名詞</strong> ＋ <strong>依變項名詞</strong> ＋ <strong>方法名詞（選填）</strong>。
                                    先一起列出 4–6 個候選，再分配誰搜哪個。
                                </p>
                                <p className="text-[11.5px] text-[var(--accent)] font-bold">
                                    🔗 W5 寫的「核心概念」就是起點——把那幾個詞直接拿來用就好。
                                </p>
                            </div>

                            {/* 分工三欄 */}
                            <div>
                                <p className="text-[13px] font-bold text-[var(--ink)] mb-3">② 分工：誰搜哪個面向</p>
                                <div className="grid grid-cols-3 gap-3">
                                    {[
                                        { role: '自變項面向', hint: '原因那側的詞', color: 'border-[var(--accent)]', bg: 'bg-[#F0F0FF]' },
                                        { role: '依變項面向', hint: '結果那側的詞', color: 'border-[var(--success)]', bg: 'bg-[#F0FDF4]' },
                                        {
                                            role: '方法面向',
                                            hint: activeMethodId && METHOD_HINTS[activeMethodId]
                                                ? METHOD_HINTS[activeMethodId].hint
                                                : '問卷量表 ／ 訪談主題 ／ 觀察行為詞',
                                            color: 'border-[#D97706]', bg: 'bg-[#FFFBEB]',
                                        },
                                    ].map(item => (
                                        <div key={item.role} className={`rounded-[8px] border-2 p-4 ${item.color} ${item.bg}`}>
                                            <p className="text-[10px] font-mono font-bold uppercase tracking-wider opacity-50 mb-1">各自負責</p>
                                            <p className="text-[15px] font-bold text-[var(--ink)] leading-tight">{item.role}</p>
                                            <p className="text-[11px] text-[var(--ink-mid)] mt-1">{item.hint}</p>
                                        </div>
                                    ))}
                                </div>

                                {/* 方法切換按鈕 */}
                                <div className="mt-3 flex flex-wrap gap-2 items-center">
                                    <span className="text-[11px] text-[var(--ink-mid)]">你的方法：</span>
                                    {Object.entries(METHOD_HINTS).map(([id, m]) => (
                                        <button
                                            key={id}
                                            onClick={() => setActiveMethodId(id)}
                                            className={`text-[11px] px-3 py-1 rounded-full border font-bold transition-colors ${
                                                activeMethodId === id
                                                    ? 'bg-[#D97706] border-[#D97706] text-white'
                                                    : 'border-[#D97706] text-[#D97706] bg-white hover:bg-[#FFFBEB]'
                                            }`}
                                        >
                                            {m.icon} {m.label}
                                        </button>
                                    ))}
                                </div>
                                {activeMethodId && METHOD_HINTS[activeMethodId] && (
                                    <p className="text-[11px] text-[#92400E] mt-2 bg-[#FFFBEB] rounded-[6px] px-3 py-2">
                                        ✅ W4 帶入：<strong>{METHOD_HINTS[activeMethodId].icon} {METHOD_HINTS[activeMethodId].label}</strong> → 方法面向搜：{METHOD_HINTS[activeMethodId].hint}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* ── Phase 2：個人出擊 ── */}
                    <div className="rounded-[var(--radius-unified)] border-2 border-[var(--border)] overflow-hidden">
                        <div className="bg-[var(--ink)] px-5 py-3">
                            <span className="text-[11px] font-mono text-white/70 font-bold uppercase tracking-widest">PHASE 2 · 個人 · 25 分鐘</span>
                        </div>
                        <div className="bg-white p-6 space-y-6">
                            <div>
                                <p className="text-[22px] font-bold text-[var(--ink)] leading-tight mb-1">靠自己找第一篇</p>
                                <p className="text-[13px] text-[var(--ink-mid)] leading-relaxed">
                                    只能用華藝或國圖碩博，不能開 AI。先知道自己有多少斤兩。
                                </p>
                            </div>

                            {/* 搜尋關鍵字 */}
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <ContentTypeChip type="做" />
                                    <p className="text-[13px] font-bold text-[var(--ink)]">我的搜尋關鍵字</p>
                                </div>
                                <ThinkRecord
                                    dataKey="w7-search-keywords"
                                    prompt="你用了哪幾個關鍵字？（從小組討論的候選裡選你負責的那組）"
                                    scaffold={['關鍵字 1：…', '關鍵字 2：…', '關鍵字 3（選填）：…']}
                                    rows={3}
                                />
                            </div>

                            {/* 搜尋策略勾選 */}
                            <div className="border border-[var(--border)] rounded-[var(--radius-unified)] overflow-hidden">
                                <div className="px-5 py-3 bg-[var(--paper-warm)] border-b border-[var(--border)] flex items-center justify-between gap-3 flex-wrap">
                                    <div className="flex items-center gap-2">
                                        <ContentTypeChip type="做" />
                                        <span className="font-bold text-[13px] text-[var(--ink)]">我的搜尋策略</span>
                                    </div>
                                    <span className="text-[10px] font-mono text-[var(--ink-light)]">勾選不存檔——下方文字格補上實際用的條件</span>
                                </div>
                                <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <div className="text-[11px] font-mono text-[var(--ink-light)] mb-3 uppercase tracking-wider">搜尋位置</div>
                                        <div className="space-y-2.5">
                                            {[['full', '全文搜尋'], ['title', '標題搜尋'], ['abstract', '摘要搜尋']].map(([key, label]) => (
                                                <label key={key} className="flex items-center gap-2.5 cursor-pointer group">
                                                    <input type="checkbox" checked={searchType[key]} onChange={() => setSearchType(prev => ({ ...prev, [key]: !prev[key] }))} className="w-4 h-4 rounded border-[var(--border)] text-[var(--accent)] focus:ring-0" />
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
                                                    <input type="checkbox" checked={searchLimit[key]} onChange={() => setSearchLimit(prev => ({ ...prev, [key]: !prev[key] }))} className="w-4 h-4 rounded border-[var(--border)] text-[var(--accent)] focus:ring-0" />
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
                                                    <input type="checkbox" checked={searchDb[key]} onChange={() => setSearchDb(prev => ({ ...prev, [key]: !prev[key] }))} className="w-4 h-4 rounded border-[var(--border)] text-[var(--accent)] focus:ring-0" />
                                                    <span className="text-[13px] text-[var(--ink-mid)] group-hover:text-[var(--ink)] transition-colors">{label}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 找到的第一篇文獻 */}
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <ContentTypeChip type="做" />
                                    <p className="text-[13px] font-bold text-[var(--ink)]">我個人找到的第一篇文獻</p>
                                    <span className="text-[10px] font-mono text-[var(--ink-light)] ml-auto">至少 1 篇 · 帶回組裡</span>
                                </div>
                                <p className="text-[12px] text-[var(--ink-mid)] mb-3 leading-relaxed">
                                    選標題最接近組題目的那篇，看完摘要後記錄它跟研究的關係。這是你的個人貢獻，組的完整清單整理進共同文件。
                                </p>
                                <ThinkRecord
                                    dataKey="w7-found-paper"
                                    prompt="記下你找到的文獻：標題、作者、年份、來源、跟你的題目有什麼關係？"
                                    scaffold={['標題：…', '作者：…', '年份：…', '來源（期刊/學校）：…', '跟我的題目相關的地方是：…']}
                                    rows={6}
                                />
                                <p className="mt-3 text-[11.5px] text-[var(--ink-mid)] bg-[var(--paper-warm)] rounded-[6px] px-3 py-2 leading-relaxed">
                                    💡 搜不到？試試換同義詞、把關鍵字從 3 個減成 2 個，或把「標題搜尋」改成「全文搜尋」。
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            ),
        },

        /* ──────────────────────────────────────
         * STEP 3: APA 格式練習
         * ────────────────────────────────────── */
        {
            title: 'APA 格式練習',
            icon: '📝',
            content: (
                <div className="space-y-10 prose-zh">
                    <StepBriefing
                        lines={[
                            { label: '學', text: 'APA 格式規範（作者、年份、書名、期刊名的寫法）' },
                            { label: '練', text: '對照範本，把剛找到的文獻寫成正確書目' },
                        ]}
                    />
                    {/* APA 格式 */}
                    <div>
                        <div className="section-head">
                            <div className="flex items-center gap-2">
                                <ContentTypeChip type="學" />
                                <h2>APA 格式練習</h2>
                            </div>
                            <div className="line"></div><span className="mono">10 分鐘</span>
                        </div>
                        <p className="section-desc">
                            APA 格式的目的只有一個：讓別人順著你的標籤找到原文。四件不能少：<strong>作者、年份、標題、來源</strong>。
                        </p>

                        <div className="space-y-3 mb-6">
                            {APA_FORMATS.map(f => (
                                <div key={f.type} className="p-4 bg-[var(--paper)] rounded-[var(--radius-unified)] border border-[var(--border)]">
                                    <div className="text-[11px] font-mono text-[var(--ink-light)] mb-2">{f.type}</div>
                                    <div className="text-[15px] text-[var(--ink)] font-bold leading-relaxed mb-3">{f.template}</div>
                                    <div className="text-[14px] text-[var(--ink-mid)] leading-relaxed">
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

                        <div className="flex items-center gap-2 mb-1">
                            <ContentTypeChip type="練" />
                            <p className="text-[12px] font-bold text-[var(--ink-mid)]">APA 書目格式練習</p>
                        </div>
                        <ThinkRecord
                            dataKey="w7-apa-practice"
                            prompt="照 APA 格式，試寫你找到的那篇論文的書目（寫錯沒關係——重點是『作者／年份／標題／來源』四件齊全，格式之後再修）"
                            scaffold={['作者（年份）。', '篇名。', '學校研究所所名：碩（博）士論文。']}
                            rows={3}
                        />

                        {/* AI 格式驗證提示（選做） */}
                        <ApaPromptTip />
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
                    <StepBriefing
                        lines={[
                            { label: '做', text: '小組分配五張證物，各自認領 1–2 張，判定等級 + 寫查核路徑，判完互報' },
                            { label: '注意', text: '用自己的裝置填自己負責那幾張——這是個人技能紀錄，不是組的共同紀錄' },
                        ]}
                    />
                    <div className="section-head">
                        <div className="flex items-center gap-2">
                            <ContentTypeChip type="做" />
                            <h2 onClick={handleTitleClick} className="cursor-default select-none">證物鑑識大賽：等級判定</h2>
                        </div>
                        <div className="line"></div><span className="mono">個人判斷 + 組內互報 · 30 分鐘</span>
                    </div>
                    <p className="section-desc">
                        五張由小組自行分配，每人認領 1–2 張，各自判定等級和查核路徑，判完再互報給其他組員。<strong>不要共用裝置</strong>——你填的是你自己負責那幾張的判斷紀錄。
                    </p>

                    <div className="notice notice-gold text-[12px] mb-4">
                        📌 <strong>不要只勾等級——要寫查核路徑。</strong>你怎麼查的？去哪查？查到什麼？這才是鑑識能力。先自己判，填完再用 AI 驗，驗完在 Step 5 的 AI-RED 記「AI 跟我判得一不一樣」。
                    </div>

                    {/* 查核路徑範本 */}
                    <div className="rounded-[var(--radius-unified)] border border-[var(--border)] overflow-hidden mb-6">
                        <div className="bg-[var(--paper-warm)] px-4 py-2 flex items-center gap-2">
                            <span className="text-[11px] font-mono font-bold text-[var(--ink-mid)] uppercase tracking-wider">查核路徑 · 怎麼寫</span>
                            <span className="text-[10px] text-[var(--ink-light)]">— 參考這三種句型，選一個套用</span>
                        </div>
                        <div className="bg-white divide-y divide-[var(--border)]">
                            {[
                                {
                                    tag: '搜標題',
                                    eg: '我把標題「高中男女分校與其學校性別角色」複製到 Google Scholar 搜尋 → 找到這篇論文，點進去確認有摘要和指導教授 → 判 A 級。',
                                },
                                {
                                    tag: '查 DOI',
                                    eg: '我把 DOI 號碼貼到 doi.org → 跳出錯誤頁面，查無此文件 → 這個 DOI 是假的 → 判 D 級。',
                                },
                                {
                                    tag: '查作者',
                                    eg: '我 Google「Michael Chen sleep research Taiwan」→ 找不到這個人在任何大學或研究機構的頁面 → 作者可疑，加上 DOI 查不到 → 判 D 級。',
                                },
                                {
                                    tag: '查來源網站',
                                    eg: '我點進「未具名教育新訊網」→ 網站沒有關於我們、文章都沒有署名作者、找不到原始研究連結 → 內容農場特徵 → 判 D 級。',
                                },
                            ].map(({ tag, eg }) => (
                                <div key={tag} className="px-4 py-3 flex gap-3">
                                    <span className="shrink-0 text-[10px] font-mono font-bold bg-[var(--ink)] text-white px-2 py-0.5 rounded-[4px] h-fit mt-0.5">{tag}</span>
                                    <p className="text-[12px] text-[var(--ink-mid)] leading-relaxed">{eg}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 認領選卡 */}
                    <div className="bg-[var(--paper-warm)] border border-[var(--border)] rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-3">
                            <ContentTypeChip type="做" />
                            <p className="text-[13px] font-bold text-[var(--ink)]">先選你認領的是哪幾張（可多選）</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {EVIDENCE_CARDS.map(card => {
                                const claimed = claimedCards.includes(card.id);
                                return (
                                    <button
                                        key={card.id}
                                        onClick={() => handleToggleClaimed(card.id)}
                                        className={`px-4 py-2 rounded-full border-2 font-bold text-[13px] transition-all ${
                                            claimed
                                                ? 'bg-[var(--ink)] border-[var(--ink)] text-white'
                                                : 'border-[var(--border)] text-[var(--ink-mid)] hover:border-[var(--ink)]'
                                        }`}
                                    >
                                        證物 {card.id} {claimed ? '✓' : ''}
                                    </button>
                                );
                            })}
                        </div>
                        {claimedCards.length === 0 && (
                            <p className="text-[11px] text-[var(--ink-light)] mt-2">← 先選好再往下填，選了之後你的那幾張會出現完整填寫格</p>
                        )}
                    </div>

                    <div className="space-y-6">
                        {EVIDENCE_CARDS.map(card => {
                            const isClaimed = claimedCards.includes(card.id);
                            return (
                                <div key={card.id} className={`bg-white rounded-xl overflow-hidden border-2 transition-all ${isClaimed ? 'border-[var(--ink)]' : 'border-[var(--border)]'}`}>
                                    <div className={`px-6 py-3 flex items-center gap-3 ${isClaimed ? 'bg-[var(--ink)]' : 'bg-[var(--paper-warm)]'}`}>
                                        <span className={`font-mono font-bold text-[14px] ${isClaimed ? 'text-[var(--gold)]' : 'text-[var(--ink-mid)]'}`}>證物 {card.id}</span>
                                        {isClaimed && <span className="text-[10px] font-mono text-[var(--gold)] uppercase tracking-wider">我認領</span>}
                                        <span className={`text-[13px] font-medium truncate ${isClaimed ? 'text-white' : 'text-[var(--ink)]'}`}>{card.title}</span>
                                    </div>
                                    <div className="p-5">
                                        <div className="text-[13px] font-medium text-[var(--ink)] mb-2">{card.meta}</div>
                                        <p className="text-[12px] text-[var(--ink-mid)] leading-relaxed mb-2 italic">「{card.desc}」</p>
                                        {card.extra && (
                                            <div className="text-[11px] font-mono text-[var(--ink-light)] mb-4">{card.extra}</div>
                                        )}
                                        {card.glossary && (
                                            <div className="notice notice-accent text-[11px] mb-4 leading-relaxed">{card.glossary}</div>
                                        )}

                                        {/* 等級按鈕（全部 5 張都有，互報後都點一下） */}
                                        <div className="flex items-center gap-3 mb-4">
                                            <span className="text-[11px] font-mono text-[var(--ink-light)]">
                                                {isClaimed ? '我的判定：' : '互報後記錄：'}
                                            </span>
                                            {['A', 'B', 'C', 'D'].map(level => {
                                                const c = GRADE_COLORS[level];
                                                const selected = forensicGrades[card.id] === level;
                                                return (
                                                    <button
                                                        key={level}
                                                        onClick={() => handleSetForensicGrade(card.id, level)}
                                                        className={`w-9 h-9 rounded-full font-bold text-[12px] border-2 flex items-center justify-center transition-all ${selected ? `${c.bg} border-transparent text-white` : 'border-[var(--border)] text-[var(--ink-light)] hover:border-[var(--ink-mid)]'}`}
                                                    >
                                                        {level}
                                                    </button>
                                                );
                                            })}
                                        </div>

                                        {/* 認領的張：完整 ThinkRecord；其他張：輕量提示 */}
                                        {isClaimed ? (
                                            <ThinkRecord
                                                dataKey={`w7-forensic-${card.id.toLowerCase()}`}
                                                prompt={`證物 ${card.id}（你認領的）：判定等級的理由是什麼？你怎麼查證的？`}
                                                scaffold={['我判定是 ___ 級，因為…', '我的查核路徑：（去哪查、查到什麼）']}
                                                rows={3}
                                            />
                                        ) : (
                                            <p className="text-[11.5px] text-[var(--ink-light)] italic">
                                                這張由組員負責——聽完互報後點上方按鈕記錄等級即可，不需要填查核路徑。
                                            </p>
                                        )}

                                        {/* 參考判定說明——填完才能解鎖 */}
                                        {card.answerHint && (
                                            <div className="mt-3">
                                                {teacherUnlocked ? (
                                                    <div className="rounded-[6px] border border-[var(--border)] overflow-hidden">
                                                        <div className="px-3 py-2 bg-[var(--paper-warm)] flex items-center gap-2">
                                                            <span className="text-[11px] font-mono text-[var(--ink-light)]">📋 參考判定說明</span>
                                                            {card.answerGrade !== '?' && (
                                                                <span className={`font-bold px-1.5 py-0.5 rounded-[3px] text-white text-[10px] ${GRADE_COLORS[card.answerGrade]?.bg || 'bg-[var(--ink-mid)]'}`}>
                                                                    {card.answerGrade} 級
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="px-4 py-3 bg-white text-[12px] text-[var(--ink-mid)] leading-relaxed">
                                                            {card.answerHint}
                                                        </div>
                                                    </div>
                                                ) : null}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* 個人鑑識反思 */}
                    <div className="mt-6 p-5 bg-[var(--paper)] rounded-xl border-2 border-dashed border-[var(--accent)]/40">
                        <div className="flex items-center gap-2 mb-2">
                            <ContentTypeChip type="練" />
                            <div className="text-[11px] font-mono text-[var(--accent)] uppercase tracking-wider">🔬 個人鑑識反思</div>
                        </div>
                        <p className="text-[12px] text-[var(--ink-light)] mb-3">聽完組員互報之後，回頭想想——你自己最沒把握的是哪張？判斷關鍵在哪裡？</p>
                        <ThinkRecord
                            dataKey="w7-hardest"
                            prompt="五張裡你自己最難判斷的是哪張？難在哪裡？聽完組員的查核路徑後，你的判斷有沒有改變？"
                            scaffold={['我自己最難判的是證物…', '難在…', '聽完互報後我的判斷是／變成…，因為…']}
                            rows={4}
                        />
                    </div>

                    {/* AI 協助鑑識？記錄下來 */}
                    <AIREDNarrative week="7" hint="如果你用 AI 協助判斷文獻等級，記錄這次最關鍵的互動；找文獻本身仍要親自查證。" optional={true} />
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
                    <StepBriefing
                        lines={[
                            { label: '做', text: '對照本週要會 6 項，寫 AIRED（可選），整理 W7 學習紀錄' },
                        ]}
                    />
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

                    {/* 一鍵複製 · Export 醒目化 */}
                    <div className="bg-[#EFF6FF] border-2 border-[#1E40AF] rounded-[var(--radius-unified)] p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <ContentTypeChip type="交出" />
                            <span className="text-[10px] font-mono font-bold bg-[#1E40AF] text-white px-2 py-0.5 rounded-[3px] uppercase tracking-wider">📤 最後一步</span>
                            <span className="text-[14px] font-bold text-[#1E40AF]">複製 W7 學習紀錄 → 貼 Google Classroom</span>
                        </div>
                        <p className="text-[12px] text-[#1E3A8A] leading-relaxed mb-3">
                            包含：題目／搜尋關鍵字／策略／找到的文獻／APA 練習／5 證物鑑識／最難判斷 + AIRED（如有）。下週 W8 文獻偵探社會接這份。
                        </p>
                        <ExportButton
                            weekLabel="W7 文獻搜尋入門"
                            fields={EXPORT_FIELDS}
                            choices={choiceResults}
                            buttonText="複製 W7 學習紀錄"
                        />
                    </div>

                    {/* 下週預告（W8 文獻偵探社——拿這篇做三明治改寫） */}
                    <div className="next-week-preview">
                        <div className="next-week-header">
                            <span className="next-week-badge">NEXT WEEK</span>
                            <h3 className="next-week-title">W8 預告：用今天找到的文獻來練改寫</h3>
                        </div>
                        <div className="next-week-content">
                            <div className="next-week-col">
                                <div className="next-week-label">W8 主題</div>
                                <p className="next-week-text">文獻偵探社——識破換字抄襲、文獻堆砌，學會「三明治」寫法把文獻變成自己的論述。</p>
                            </div>
                            <div className="next-week-col">
                                <div className="next-week-label">你今天的成果會變成什麼</div>
                                <p className="next-week-text">
                                    你今天填的「<strong>找到的第一篇文獻</strong>」會在 W8 開場自動帶入——直接拿這篇做<strong>三明治改寫練習</strong>，不用重找。
                                    所以今天要把這篇填好填滿（標題、作者、年份、跟你題目的關係），下週才接得上。
                                </p>
                            </div>
                        </div>
                        <div className="mt-3 p-3 rounded-[6px] bg-[#FEF3C7] border border-[#D97706]/30 text-[12px] text-[#78350F] leading-relaxed">
                            🔗 <strong>跨週連結提醒</strong>：W7 找文獻 → W8 寫文獻 → W9 把文獻變成王牌。今天填得越具體，後面三週越輕鬆。
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
                    <span className="hidden md:inline">研究方法與專題 / 研究規劃 / </span><span className="text-[var(--ink)] font-bold">文獻搜尋入門 W7</span>
                </div>
                <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
                    <span className="bg-[var(--paper-warm)] text-[var(--ink)] text-[10px] font-bold px-2 py-0.5 rounded-[2px] font-mono">100 MINS</span>
                    <ResetWeekButton weekPrefix="w7-" />
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
                    <LessonMap data={W7Data} />
                </div>
            )}

            {/* PAGE HEADER — Hero Block */}
            <HeroBlock
                kicker="R.I.B. 調查檔案 · 研究方法與專題 · W7"
                todo={[
                  { label: '今天做什麼', value: '在華藝找到第一篇 A/B 級文獻、練 APA 格式、完成五張鑑識紀錄。' },
                  { label: '為什麼做', value: '題目穩了一週，先看別人做過什麼可以省力又站得住腳——文獻是計畫書第三章的地基。' },
                  { label: '今天交什麼', value: '文獻清單 + APA 書目 + 鑑識紀錄（五張）。' },
                ]}
                question="別人研究過什麼？哪些資料可信？"
                title="文獻搜尋入門："
                accentTitle="找對資料，打好地基"
                subtitle="W6 海報博覽會剛把題目+方法+操作型定義公開檢驗過，題目穩定下來。這週往前走一步：為你的研究找文獻基礎。先不用 AI——靠自己在華藝搜尋、練 APA 格式，最後進行證物鑑識大賽，學會辨別文獻真偽。"
                chain="題目穩定一週了，你大概知道要看什麼——但你不是第一個想這題的人。先去看看別人做過什麼，省力又站得住腳。"
                meta={[
                    { label: '第一節', value: '華藝資料庫搜尋技巧 + APA 格式規則' },
                    { label: '第二節', value: '證物鑑識——A/B/C 級判斷 + 完成五張鑑識紀錄' },
                    { label: '課堂產出', value: 'A/B 級文獻 + APA 書目 + 五張鑑識紀錄' },
                    { label: '前置要求', value: 'W6 定案題目 + 路線決定（Team/Solo）' },
                ]}
            />
            <CourseArc items={W7Data.courseArc} />

            <TaskCard
                weekNumber="W7"
                weekTitle={W7Data.title}
                duration={`${W7Data.duration} 分鐘 · ${W7Data.durationDesc}`}
                tasks={[
                    '手動搜尋四步 — 先自己找出可查證的真實文獻',
                    '證物 A-D 分級 — 鑑識文獻可信度',
                    '記錄 1 篇可用文獻 + 完成 5 張證物卡等級判定',
                ]}
                exportReminder="匯出 W7 文獻清單 + APA 標籤 → 帶進 W8 文獻偵探社"
            />

            {/* STEP ENGINE */}
            <StepEngine
                steps={steps}
                prevWeek={{ label: '回 W6 海報博覽會', to: '/w6' }}
                nextWeek={{ label: '前往 W8 文獻偵探社', to: '/w8' }}
            flat
            />
        </div>
    );
};
