import React, { useState, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './ClinicPage.css';
import CourseArc from '../components/ui/CourseArc';
import ThinkRecord from '../components/ui/ThinkRecord';
import AIREDNarrative from '../components/ui/AIREDNarrative';
import StepEngine from '../components/ui/StepEngine';
import HeroBlock from '../components/ui/HeroBlock';
import TaskCard from '../components/ui/TaskCard';
import ExportButton from '../components/ui/ExportButton';
import ResetWeekButton from '../components/ui/ResetWeekButton';
import BackfillField from '../components/ui/BackfillField';
import { readRecords, STORAGE_KEY } from '../components/ui/ThinkRecord';
import {
    Map,
    ArrowRight,
    CheckCircle2,
    Users,
    User,
    Eye,
    AlertTriangle,
} from 'lucide-react';
import LessonMap from '../components/ui/LessonMap';
import { W6Data } from '../data/lessonMaps';

/* ══════════════════════════════════════
 *  資料常數
 * ══════════════════════════════════════ */

const POSTER_CELLS = [
    {
        num: '①',
        title: '標題（吸引人版）',
        desc: '用問句／反差／畫面感寫——同學走過第一眼就被抓住',
        source: '本週寫',
        size: 'normal',
        tips: [
            '✅ 用問號或反差感：「滑越晚，背越糟？」「沉默的圖書館，焦躁的考前」',
            '✅ 3-12 字最佳——太長抓不住人',
            '❌ 別寫學術腔（「相關性研究」「影響探討」放副標就好）',
            '❌ 別只寫名詞（「手機與睡眠」太平淡，加問號／動詞才有力）',
        ],
    },
    {
        num: '②',
        title: '副標（學術版題目）',
        desc: '從 W3 定案題目抄過來（正式版本，幫同學確認你做什麼）',
        source: 'W3',
        size: 'normal',
        tips: [
            '✅ 看得出 Who（誰）＋ Where（場域）＋ 變因（測什麼）',
            '✅ 自變項在前、依變項在後（「夜間滑手機 → 翌日專注力」這個方向）',
            '✅ 用「之相關性／差異／影響」的學術句型',
            '💡 W3 已經寫好定稿，直接抄不用重編',
        ],
    },
    {
        num: '③',
        title: '研究動機',
        desc: '一句話：為什麼想研究這個？對誰有意義？（W3 寫過會自動帶入）',
        source: 'W3',
        size: 'normal',
        tips: [
            '✅ 寫具體痛點（「我自己段考前都熬夜滑手機隔天念書效率超差」）',
            '✅ 寫到「對誰有意義」（不只是自己——「想戒手機的同學」「擔心孩子的家長」）',
            '❌ 別寫「我想知道 ___」——這只是研究問題，不是動機',
            '❌ 別寫兩段——一句話最有力，多了反而稀釋',
        ],
    },
    {
        num: '④',
        title: '研究方法（這格最大）',
        desc: '主方法（W4）+ 核心概念 + 操作型定義（W5）——三件齊。同學要靠這格判斷你題目能不能合題。',
        source: 'W4 + W5',
        size: 'big',
        tips: [
            '✅ 主方法選一個（不要寫「可能用 ___ 或 ___」——優柔寡斷扣分）',
            '✅ 核心概念用粗體或圈起來（讓抽象詞被看到）',
            '✅ 操作型定義要有具體數字／時間／頻次（「≥ 30 秒」勝過「持續一段時間」）',
            '✅ 加正反例（「✅ 算：滑社群」「❌ 不算：查考試範圍」）',
            '💡 這格是合題夥伴判斷你能不能合的關鍵——寫越具體，越容易找對人',
        ],
    },
    {
        num: '⑤',
        title: '同儕回饋區',
        desc: '留空白——走讀時 3 位同學各寫一條最重要的回饋（一人一條，下方列出他們會從哪幾個方向挑）',
        source: '走讀時別人寫',
        size: 'normal',
        tips: [
            '💡 留至少 1/5 版面空白——三條回饋寫得下',
            '💡 用淺鉛筆框起來，讓走讀同學知道在哪寫',
            '👀 走讀同學會從這 3 個方向挑最關鍵那條：',
            '　　❶ 操作型定義分得開嗎？（W5 核心檢核）',
            '　　❷ 對象是否具體？（如：「高中生」太大、「松山高一」剛好）',
            '　　❸ 方法跟題目對得上嗎？（兩層判斷有沒有走對）',
        ],
    },
];

const GALLERY_WALK_ROUNDS = [
    { n: '第 1 輪', time: '5 min', who: 'A 坐鎮', d: 'A 站在自己海報旁報告 1 分鐘，B/C/D 移到下一張海報聆聽──聽完每人在那張海報⑤格寫一條回饋' },
    { n: '第 2 輪', time: '5 min', who: 'B 坐鎮', d: 'B 回來自己海報報告，C/D 繼續移、A 也加入移動（聽完寫一條）' },
    { n: '第 3 輪', time: '5 min', who: 'C 坐鎮', d: 'C 回來報告，D 繼續移、A/B 加入（聽完寫一條）' },
    { n: '第 4 輪', time: '5 min', who: 'D 坐鎮', d: 'D 回來報告，A/B/C 走完最後一輪（聽完寫一條）' },
];

/* 同儕回饋：給聽眾的提示——挑一條最重要的寫，不用分顏色 */
const FEEDBACK_PROMPTS = [
    { focus: '操作型定義', q: '「你的操作型定義正反例分得開嗎？」（W5 訓練的核心檢核）' },
    { focus: '研究對象', q: '「你的研究對象具體嗎？／太大或太小？」（如：『高中生』太大，『松山高一』剛好）' },
    { focus: '方法符合度', q: '「你選的方法跟題目對得上嗎？」（W4 兩層判斷有沒有走對）' },
    { focus: '研究動機', q: '「你的動機有畫面嗎？／是不是只是『想知道』？」（一句話打動人 vs 流於空泛）' },
    { focus: '可行性', q: '「兩週內你真的測得到資料嗎？／樣本找得到嗎？」' },
];

/* 三種回饋類型範例——讚美／建議／疑問都是好回饋；每種附正反例對照 */
const FEEDBACK_EXAMPLES = [
    {
        type: '讚美型',
        icon: '👍',
        focus: '研究動機',
        color: 'success',
        when: '當你看到 owner 寫得特別好——告訴他這裡要保留',
        good: '「動機具體有畫面——『我自己段考前都熬夜滑手機』比『高中生有手機成癮問題』真誠太多。建議保留這個第一人稱角度。」',
        bad: '「寫得不錯！」「我覺得 OK！」',
        badWhy: '沒指出哪裡好——owner 不知道要保留什麼，下次重寫可能就改掉精彩的部分。',
    },
    {
        type: '建議型',
        icon: '🎯',
        focus: '操作型定義',
        color: 'gold',
        when: '當你看到可改進處——給可執行的具體建議',
        good: '「『滑手機』沒講多久才算——建議補上時間門檻（例：≥ 30 秒），不然下週寫問卷時你會卡住。」',
        bad: '「建議再想一下操作型定義」「再具體一點」',
        badWhy: '指出問題但沒給改法——owner 看了知道要改但不知改哪、改成什麼。',
    },
    {
        type: '疑問型',
        icon: '❓',
        focus: '方法符合度',
        color: 'accent',
        when: '當你看到 owner 沒交代清楚的地方——問出他需要思考的問題',
        good: '「為什麼選問卷不選日記法？你想測『夜間使用』，問卷靠回憶可能不準——日記法可能更貼近真實行為。」',
        bad: '「為什麼這樣？」「真的嗎？」',
        badWhy: '沒方向也沒戳到關鍵——owner 答「對啊我覺得這樣比較好」就過去了，沒幫他真的思考。',
    },
];

/* 黃金原則：空泛 → 具體可執行的 3 個轉化範例 */
const VAGUE_TO_CONCRETE = [
    {
        focus: '動機',
        vague: '動機可以更清楚',
        concrete: '動機加一句「對誰有意義」——例：「對段考前想戒手機的同學多一份具體數據」',
    },
    {
        focus: '方法',
        vague: '方法不太對',
        concrete: '方法用問卷可能不夠——你想測「夜間使用」，靠回憶不準，建議改日記法（每晚記）或截圖螢幕使用時間',
    },
    {
        focus: '對象',
        vague: '對象太大',
        concrete: '「高中生」太大——建議縮成「松山高一」或某 1-2 班 30-60 人，這樣你兩週內收得到問卷',
    },
];

const SOLO_REQUIREMENTS = [
    {
        id: 'reason',
        label: '① 為什麼非 Solo 不可',
        hint: '「我喜歡」不算理由——要說明：題目內容只能你執行（例：個人經驗主題、特定場域只有你能進）／合題會稀釋核心問題／或你已經做了大量前置（像田野觀察）別人接不上。',
        scaffold: ['我必須 Solo 是因為 ___（不能只說「想自己做」）', '具體理由：', '為什麼合題會稀釋／不可行：'],
    },
    {
        id: 'workload',
        label: '② 一個人扛 4 章的時間規劃',
        hint: '計畫書 5 章節（W7-W10 寫）＋ 工具設計（W9）＋ 預試（W11）＋ 施測＋分析（W12-W14）＋ 結論發表（W15-W17）。寫具體哪一週做哪章、每週至少花幾小時。',
        scaffold: ['第二章（文獻回顧）：W___ 完成，預估 ___ 小時', '第三章（方法）：W___ 完成', '第四章（工具設計）：W___ 完成', '預試：W___', '施測 + 分析：W___', '結論 + 發表：W___'],
    },
    {
        id: 'risk',
        label: '③ 三大風險清單',
        hint: '至少列三條：① 資料蒐集失敗（如約不到受訪者／樣本太少）② 生病或重大缺課 ③ 技術卡關（統計／工具不會用）。每條要寫機率＋衝擊。',
        scaffold: ['風險 A：___（機率：高/中/低；衝擊：___）', '風險 B：___', '風險 C：___'],
    },
    {
        id: 'rescue',
        label: '④ 求援計畫——卡住找誰',
        hint: '不能只寫「問老師」。要具體：① 卡哪一類問題找哪個人（題目、方法、統計、工具）② 求援的時機（卡多久才求援）③ 求援的形式（meeting／信件／組內 office hour）。',
        scaffold: ['題目卡關 → 找 ___（誰）／怎麼找', '方法／統計卡關 → 找 ___', '心態卡關 → 找 ___', '我承諾卡 ___ 天就求援，不硬撐'],
    },
    {
        id: 'planb',
        label: '⑤ Plan B——資料蒐集失敗的備案',
        hint: '原計畫資料蒐集若失敗（樣本太少／拒答率高／實驗無法執行），備案題目／備案方法是什麼？要具體寫出可執行的 B 計畫。',
        scaffold: ['原計畫：___', 'Plan B 題目：___（與原計畫關聯）', 'Plan B 方法：___（為什麼這個比較容易做）', '切換 Plan B 的觸發條件：___（例：第 3 週還收不到 30 份問卷就切）'],
    },
];

/* — ExportButton 欄位 — */
const EXPORT_FIELDS = [
    { key: 'w6-from-w3-topic', label: 'W3 帶入：題目' },
    { key: 'w6-from-w4-method', label: 'W4 帶入：主方法' },
    { key: 'w6-from-w5-operationalize', label: 'W5 帶入：操作型定義' },
    { key: 'w6-walk-feedback', label: '走讀蒐集到的回饋（3 位同學一人一條）', question: '海報⑤格上 3 位同學各寫了什麼？' },
    { key: 'w6-route', label: '路線選擇', question: 'Team 合題組隊 / Solo 單飛' },
    { key: 'w6-team-topic', label: '【Team 線】合題後的共同題目' },
    { key: 'w6-team-members', label: '【Team 線】隊員與分工' },
    { key: 'w6-team-rationale', label: '【Team 線】合題理由', question: '為什麼這幾個人題目可以合？合題後核心問題是？' },
    { key: 'w6-solo-reason', label: '【Solo 線】非 Solo 不可的理由' },
    { key: 'w6-solo-workload', label: '【Solo 線】一個人 4 章時間規劃' },
    { key: 'w6-solo-risk', label: '【Solo 線】三大風險' },
    { key: 'w6-solo-rescue', label: '【Solo 線】求援計畫' },
    { key: 'w6-solo-planb', label: '【Solo 線】Plan B' },
    { key: 'w6-reflect', label: '反思：走讀最重要的 1 條回饋', question: '哪一條建議最有用？你怎麼處理？' },
    { key: 'w6-aired-record', label: 'AI-RED 敘事紀錄', question: '本週最重要的一次 AI 互動（可能用在標題優化）' },
];

/* ══════════════════════════════════════
 *  Team 隊員填空組件——3 名隊員，每位 4 欄填空
 * ══════════════════════════════════════ */
const TEAM_LABELS = ['組長', '隊員 B', '隊員 C'];
const EMPTY_MEMBERS = TEAM_LABELS.map(label => ({ label, cls: '', seat: '', name: '', role: '' }));

/* 把 3 名 members 串成可讀字串（給老師 export 時看的格式）*/
function serializeMembers(members) {
    return members
        .filter(m => m.cls || m.seat || m.name || m.role)
        .map(m => `${m.label}　${m.cls || '___'} 班 ${m.seat || '___'} 號　${m.name || '___'}\n　　負責：${m.role || '___'}`)
        .join('\n\n');
}

/* 嘗試從 localStorage 字串 parse 回 3 名 members（簡單行解析；parse 失敗就忽略）*/
function parseMembers(raw) {
    if (!raw || !raw.trim()) return EMPTY_MEMBERS.map(m => ({ ...m }));
    const result = EMPTY_MEMBERS.map(m => ({ ...m }));
    const lines = raw.split('\n').map(l => l.trim()).filter(Boolean);
    let curIdx = -1;
    const memberRe = /^(組長|隊員\s?[BC])\s+(\d+)\s*班\s+(\d+)\s*號\s+(.+?)$/;
    const roleRe = /^負責[:：]\s*(.+)$/;
    lines.forEach(line => {
        const m = line.match(memberRe);
        if (m) {
            if (m[1] === '組長') curIdx = 0;
            else if (m[1].includes('B')) curIdx = 1;
            else if (m[1].includes('C')) curIdx = 2;
            if (curIdx >= 0 && curIdx < 3) {
                const name = m[4].trim();
                result[curIdx] = {
                    ...result[curIdx],
                    cls: m[2] === '___' ? '' : m[2],
                    seat: m[3] === '___' ? '' : m[3],
                    name: name === '___' ? '' : name,
                };
            }
        } else {
            const r = line.match(roleRe);
            if (r && curIdx >= 0 && curIdx < 3) {
                const role = r[1].trim();
                result[curIdx].role = role === '___' ? '' : role;
            }
        }
    });
    return result;
}

function TeamMembersInput({ dataKey = 'w6-team-members' }) {
    const [members, setMembers] = useState(() => {
        try {
            const records = readRecords();
            return parseMembers(records[dataKey] || '');
        } catch { return EMPTY_MEMBERS.map(m => ({ ...m })); }
    });

    const update = useCallback((idx, field, value) => {
        setMembers(prev => {
            const next = prev.map((m, i) => i === idx ? { ...m, [field]: value } : m);
            try {
                const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
                all[dataKey] = serializeMembers(next);
                localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
            } catch { /* ignore */ }
            return next;
        });
    }, [dataKey]);

    const inputCls = 'border-b-2 border-[var(--ink)] focus:border-[var(--accent)] focus:outline-none bg-transparent text-[var(--ink)] px-1';

    return (
        <div className="space-y-3">
            {members.map((m, idx) => (
                <div key={idx} className="bg-white border border-[var(--border)] rounded-[var(--radius-unified)] p-4 space-y-3">
                    {/* 第一行：班 + 號 + 姓名 */}
                    <div className="flex flex-wrap items-baseline gap-2 text-[13.5px] leading-[2]">
                        <span className="font-bold text-[var(--accent)] shrink-0 w-16">{m.label}</span>
                        <input
                            type="text"
                            value={m.cls}
                            onChange={e => update(idx, 'cls', e.target.value)}
                            placeholder="115"
                            className={`${inputCls} w-14 text-center`}
                        />
                        <span>班</span>
                        <input
                            type="text"
                            value={m.seat}
                            onChange={e => update(idx, 'seat', e.target.value)}
                            placeholder="12"
                            className={`${inputCls} w-14 text-center`}
                        />
                        <span>號</span>
                        <input
                            type="text"
                            value={m.name}
                            onChange={e => update(idx, 'name', e.target.value)}
                            placeholder="姓名"
                            className={`${inputCls} flex-1 min-w-[100px]`}
                        />
                    </div>
                    {/* 第二行：負責 */}
                    <div className="flex items-baseline gap-2 text-[13.5px] leading-[2] pl-[72px]">
                        <span className="text-[var(--ink-mid)] shrink-0">負責</span>
                        <input
                            type="text"
                            value={m.role}
                            onChange={e => update(idx, 'role', e.target.value)}
                            placeholder={idx === 0 ? '例：統籌＋第三章方法' : idx === 1 ? '例：第二章文獻回顧' : '例：第四章工具設計＋資料分析'}
                            className={`${inputCls} flex-1`}
                        />
                    </div>
                </div>
            ))}
            <p className="text-[11px] text-[var(--ink-light)] italic px-1">
                💡 W7 計畫書時分工會更細（章節主筆 / 工具設計 / 資料分析）；這裡先把人到齊就好。
            </p>
        </div>
    );
}

/* ══════════════════════════════════════
 *  W3-W4-W5 帶入卡
 * ══════════════════════════════════════ */
function W6HeaderRef({ topic, method, concept, operationalize }) {
    const hasAny = topic || method || concept || operationalize;
    if (!hasAny) return null;
    return (
        <div className="bg-[var(--accent-light)] border border-[var(--accent)] rounded-[var(--radius-unified)] p-4 space-y-2 text-[12.5px]">
            <div className="text-[10px] font-mono font-bold text-[var(--accent)] uppercase tracking-wider mb-1">
                📎 從前面三週帶入（這是海報的硬內容）
            </div>
            {topic && (
                <div className="flex items-baseline gap-2">
                    <span className="text-[11px] font-mono font-bold text-[var(--ink-light)] shrink-0 w-[80px]">W3 題目</span>
                    <span className="text-[var(--ink)] font-medium">{topic}</span>
                </div>
            )}
            {method && (
                <div className="flex items-baseline gap-2">
                    <span className="text-[11px] font-mono font-bold text-[var(--ink-light)] shrink-0 w-[80px]">W4 方法</span>
                    <span className="text-[var(--ink)]">{method}</span>
                </div>
            )}
            {concept && (
                <div className="flex items-baseline gap-2">
                    <span className="text-[11px] font-mono font-bold text-[var(--ink-light)] shrink-0 w-[80px]">W5 概念</span>
                    <span className="text-[var(--ink)] whitespace-pre-wrap line-clamp-2">{concept}</span>
                </div>
            )}
            {operationalize && (
                <div className="flex items-baseline gap-2">
                    <span className="text-[11px] font-mono font-bold text-[var(--ink-light)] shrink-0 w-[80px]">操作定義</span>
                    <span className="text-[var(--ink)] whitespace-pre-wrap line-clamp-3">{operationalize}</span>
                </div>
            )}
        </div>
    );
}

/* ══════════════════════════════════════
 *  主元件
 * ══════════════════════════════════════ */

export const W6PosterTeamPage = () => {
    const [showLessonMap, setShowLessonMap] = useState(false);

    /* 跨週帶入 */
    const [w3Topic, setW3Topic] = useState('');
    const [w3Motivation, setW3Motivation] = useState('');
    const [w4Method, setW4Method] = useState('');
    const [w5Concept, setW5Concept] = useState('');
    const [w5Operationalize, setW5Operationalize] = useState('');

    /* 路線選擇 */
    const [route, setRoute] = useState(() => {
        try { return localStorage.getItem('w6-route') || ''; } catch { return ''; }
    });

    const pickRoute = useCallback((newRoute) => {
        setRoute(newRoute);
        try {
            localStorage.setItem('w6-route', newRoute);
            const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
            all['w6-route'] = newRoute === 'team' ? 'Team 合題組隊' : newRoute === 'solo' ? 'Solo 單飛獨行' : '';
            localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
        } catch { /* ignore */ }
    }, []);

    useEffect(() => {
        const refresh = () => {
            const saved = readRecords();
            const topic = (saved['w4-my-topic'] || saved['w3-final-topic'] || '').trim();
            const motivation = (saved['w3-motivation'] || '').trim();
            const method = (saved['w4-main-method'] || '').trim();
            const concept = (saved['w5-core-concept'] || '').trim();
            const op = (saved['w5-operationalize'] || '').trim();
            setW3Topic(topic);
            setW3Motivation(motivation);
            setW4Method(method);
            setW5Concept(concept);
            setW5Operationalize(op);

            // 跨 session 自動帶入：把 w3/w4/w5 寫進 w6 對應 export key（學生 export 時看得到）
            const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
            if (topic && !all['w6-from-w3-topic']) all['w6-from-w3-topic'] = topic;
            if (method && !all['w6-from-w4-method']) all['w6-from-w4-method'] = method;
            if (op && !all['w6-from-w5-operationalize']) all['w6-from-w5-operationalize'] = op;
            try { localStorage.setItem(STORAGE_KEY, JSON.stringify(all)); } catch { /* ignore */ }
        };
        refresh();
        window.addEventListener('focus', refresh);
        return () => window.removeEventListener('focus', refresh);
    }, []);

    /* ── 5 步驟 ── */

    const steps = [
        /* ─── Step 1：海報製作 ─── */
        {
            title: '海報製作',
            icon: '🎨',
            content: (
                <div className="space-y-6 prose-zh">
                    <div className="bg-[var(--paper-warm)] border border-[var(--border)] rounded-[var(--radius-unified)] p-5">
                        <div className="text-[11px] font-mono text-[var(--ink-mid)] tracking-wider mb-1">PART 1 · 25 MIN</div>
                        <h2 className="text-[18px] font-bold text-[var(--ink)] mb-2">用紙本 A4 手寫四格海報</h2>
                        <p className="text-[13px] text-[var(--ink-mid)] leading-relaxed">
                            這張海報要在第二節給其他組看 + 收建議。<strong className="text-[var(--ink)]">不准用 AI 寫內容</strong>——前面三週累積的東西自己抄上去，AI 只能在標題優化時用。
                        </p>
                    </div>

                    {/* 帶入卡 */}
                    {(w3Topic || w4Method || w5Concept || w5Operationalize) ? (
                        <W6HeaderRef topic={w3Topic} method={w4Method} concept={w5Concept} operationalize={w5Operationalize} />
                    ) : (
                        <BackfillField
                            dataKey="w4-my-topic"
                            label="⚠️ 沒偵測到前面幾週的累積——把你上週寫的研究題目貼這裡（後面方法、操作型定義也可以再補）。"
                            placeholder="例：本校高一段考前一週的夜間滑手機時數與翌日專注力自評之相關性"
                            buttonLabel="補上題目"
                        />
                    )}

                    {/* 範本海報圖片——可展開（預設摺疊，避免一進來太多） */}
                    <details className="bg-white border-2 border-[var(--accent)] rounded-[var(--radius-unified)] overflow-hidden group">
                        <summary className="px-5 py-3 bg-[var(--accent-light)]/30 cursor-pointer flex items-center justify-between hover:bg-[var(--accent-light)]/50 transition-colors">
                            <span className="font-bold text-[13px] text-[var(--accent)]">📸 點開看範本（同學的成品長這樣）—— 第一次寫強烈建議展開</span>
                            <span className="text-[10px] font-mono text-[var(--ink-light)] group-open:rotate-180 transition-transform">▼</span>
                        </summary>
                        <div className="p-5 bg-[var(--paper-warm)]">
                            <img
                                src="/images/w6-poster-sample.png"
                                alt="W6 海報範本：A4 紙手寫五格，包含吸引人標題、學術副標、研究動機、研究方法（核心概念+操作型定義）、同儕回饋區"
                                className="w-full h-auto rounded-[8px] shadow-md border border-[var(--border)]"
                                loading="lazy"
                            />
                            <p className="text-[11.5px] text-[var(--ink-light)] italic mt-3 leading-relaxed">
                                💡 範本只是「長這樣」的參考——你的標題／動機要用<strong>自己的話</strong>寫，不要照抄。下方五格範本說明每格的寫法重點。
                            </p>
                        </div>
                    </details>

                    {/* 海報五格範本——研究方法格佔大 */}
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <span className="text-[10px] font-mono font-bold bg-[var(--ink)] text-white px-2 py-0.5 rounded-[3px] uppercase tracking-wider">範本</span>
                            <span className="text-[14px] font-bold text-[var(--ink)]">A4 紙手寫五格——這五格分別寫什麼</span>
                        </div>
                        <div className="space-y-3">
                            {POSTER_CELLS.map((cell, i) => (
                                <div
                                    key={i}
                                    className={[
                                        'bg-white rounded-[var(--radius-unified)] p-4',
                                        cell.size === 'big'
                                            ? 'border-4 border-[var(--accent)] shadow-md'
                                            : 'border-2 border-[var(--ink)]',
                                    ].join(' ')}
                                >
                                    <div className="flex items-baseline gap-2 mb-2">
                                        <span className="text-[18px] font-bold text-[var(--accent)]">{cell.num}</span>
                                        <span className="text-[14px] font-bold text-[var(--ink)]">{cell.title}</span>
                                        <span className="ml-auto text-[10px] font-mono text-[var(--ink-light)] uppercase">{cell.source}</span>
                                    </div>
                                    <p className="text-[12px] text-[var(--ink-mid)] leading-relaxed mb-2">{cell.desc}</p>
                                    {cell.tips && cell.tips.length > 0 && (
                                        <div className="bg-[var(--paper-warm)] rounded-[6px] p-2.5 mt-2">
                                            <div className="text-[10px] font-mono font-bold text-[var(--ink-light)] uppercase tracking-wider mb-1">寫法重點</div>
                                            <ul className="text-[11.5px] text-[var(--ink-mid)] leading-[1.7] list-none space-y-0.5">
                                                {cell.tips.map((tip, j) => (
                                                    <li key={j}>{tip}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                        <p className="text-[11.5px] text-[var(--ink-light)] italic mt-2 leading-relaxed">
                            💡 ④ 研究方法格留最大——同學走讀時主要靠這格判斷能不能跟你合題。⑤ 同儕回饋區留空白，走讀時別人會寫進去。
                        </p>
                    </div>

                    {/* W3 動機帶入卡（如果 W3 寫過就顯示），沒寫的話 BackfillField 提醒怎麼回想 */}
                    {w3Motivation ? (
                        <div className="flex items-start gap-3 px-4 py-3 rounded-[var(--radius-unified)] bg-[var(--gold-light)] border border-[var(--gold)] text-[12.5px]">
                            <span className="text-[16px]">🔥</span>
                            <div className="flex-1">
                                <span className="font-bold text-[#7a6020]">你 W3 寫過的研究動機（直接抄到海報③格）</span>
                                <p className="text-[#7a6020] mt-1 italic whitespace-pre-wrap">「{w3Motivation}」</p>
                                <p className="text-[11px] text-[var(--ink-light)] mt-2">
                                    💡 寫海報時可以原句照抄，或經過 W4 / W5 之後潤飾——但動機的核心不要動。
                                </p>
                            </div>
                        </div>
                    ) : (
                        <BackfillField
                            dataKey="w3-motivation"
                            label="⚠️ 沒偵測到你 W3 寫的研究動機——回想一下：你訂題目那週是為什麼想研究這個？補一句貼這裡，海報③格直接抄。"
                            placeholder="例：我自己段考前每次熬夜滑手機，隔天念書效率超差——想證明這個感覺是真的。"
                            buttonLabel="補上 W3 動機"
                        />
                    )}

                    <div className="bg-[var(--gold-light)] border-l-4 border-[var(--gold)] p-3 rounded-r-[6px] text-[12.5px] text-[#7a6020] leading-relaxed">
                        ⏰ <strong>限時 25 min</strong>：A4 紙、彩色筆、四格手寫——清楚、可看就好，別追求漂亮。
                    </div>
                </div>
            ),
        },

        /* ─── Step 2：Gallery Walk ─── */
        {
            title: 'Gallery Walk 走讀',
            icon: '👀',
            content: (
                <div className="space-y-6 prose-zh">
                    <div className="bg-[var(--paper-warm)] border border-[var(--border)] rounded-[var(--radius-unified)] p-5">
                        <div className="text-[11px] font-mono text-[var(--ink-mid)] tracking-wider mb-1">PART 2 · 23 MIN</div>
                        <h2 className="text-[18px] font-bold text-[var(--ink)] mb-2">四輪走讀 + 一人一條同儕回饋</h2>
                        <p className="text-[13px] text-[var(--ink-mid)] leading-relaxed">
                            這一節重點不是「秀海報」，是<strong className="text-[var(--ink)]">收建議</strong>。輪到你坐鎮報告時，會有 3 位同學聽你講——他們聽完每人在你海報⑤格<strong className="text-[var(--ink)]">寫一條</strong>最重要的回饋。一人一條、不要多、聚焦最關鍵那一點。
                        </p>
                    </div>

                    {/* 4 輪走讀規則 */}
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <span className="text-[10px] font-mono font-bold bg-[var(--accent)] text-white px-2 py-0.5 rounded-[3px] uppercase tracking-wider">規則</span>
                            <span className="text-[14px] font-bold text-[var(--ink)]">四輪走讀（每輪 5 min）</span>
                        </div>
                        <div className="space-y-2">
                            {GALLERY_WALK_ROUNDS.map((r, i) => (
                                <div key={i} className="flex items-start gap-3 bg-white border border-[var(--border)] rounded-[var(--radius-unified)] p-3">
                                    <div className="shrink-0 w-12 text-center">
                                        <div className="text-[15px] font-bold text-[var(--ink)]">{r.n}</div>
                                        <div className="text-[10px] font-mono text-[var(--ink-light)]">{r.time}</div>
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-[12.5px] font-bold text-[var(--accent)] mb-0.5">{r.who}</div>
                                        <p className="text-[12px] text-[var(--ink-mid)] leading-relaxed">{r.d}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 寫回饋的提示——挑一條最重要的寫 */}
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <span className="text-[10px] font-mono font-bold bg-[var(--accent)] text-white px-2 py-0.5 rounded-[3px] uppercase tracking-wider">提示</span>
                            <span className="text-[14px] font-bold text-[var(--ink)]">當聽眾時——挑「最關鍵」那一條寫</span>
                        </div>
                        <p className="text-[12.5px] text-[var(--ink-mid)] leading-relaxed mb-3">
                            聽完別人報告後，從下面五個面向<strong className="text-[var(--ink)]">挑你最有感的一個</strong>寫一條回饋——不用全部都寫。具體＞抽象（「對象太大」遠不如「『高中生』太大，建議縮成『松山高一』」）。
                        </p>
                        <div className="space-y-2">
                            {FEEDBACK_PROMPTS.map((f, i) => (
                                <div key={i} className="flex items-start gap-3 bg-white border border-[var(--border)] rounded-[var(--radius-unified)] p-3">
                                    <span className="shrink-0 inline-flex items-center justify-center px-2 py-0.5 rounded-[4px] bg-[var(--accent-light)] text-[var(--accent)] text-[11px] font-bold whitespace-nowrap">{f.focus}</span>
                                    <p className="text-[12px] text-[var(--ink-mid)] leading-relaxed flex-1">{f.q}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 🏆 黃金原則：具體 + 可執行（凸顯重點，避免學生寫空泛回饋）*/}
                    <div className="bg-[var(--ink)] text-white rounded-[var(--radius-unified)] p-5">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-[20px]">🏆</span>
                            <span className="text-[11px] font-mono font-bold bg-[var(--gold)] text-[var(--ink)] px-2 py-0.5 rounded-[3px] uppercase tracking-wider">黃金原則</span>
                            <span className="text-[15px] font-bold">具體 ＞ 抽象、可執行 ＞ 觀感</span>
                        </div>
                        <p className="text-[13px] text-white/85 leading-relaxed mb-3">
                            學生寫回饋最常踩的坑就是<strong className="text-[var(--gold)]">太空泛</strong>。空泛＝給了 owner 壓力但沒幫他改進。
                            一條好回饋要能讓 owner 看完就知道：哪裡要改、改成什麼、為什麼。
                        </p>
                        <div className="space-y-2">
                            {VAGUE_TO_CONCRETE.map((v, i) => (
                                <div key={i} className="grid grid-cols-1 md:grid-cols-[80px_1fr_1fr] gap-2 md:gap-3 bg-white/5 rounded-[6px] p-3 text-[12px]">
                                    <div className="text-[11px] font-mono text-white/50 uppercase tracking-wider md:pt-0.5">{v.focus}</div>
                                    <div className="text-white/70 leading-relaxed">
                                        <span className="text-[10px] font-mono text-[var(--danger)] mr-1">❌ NG</span>
                                        「{v.vague}」
                                    </div>
                                    <div className="text-white leading-relaxed">
                                        <span className="text-[10px] font-mono text-[var(--gold)] mr-1">✅ OK</span>
                                        「{v.concrete}」
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 三種類型範例——讚美/建議/疑問都是好回饋；每種正反例對照 */}
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <span className="text-[10px] font-mono font-bold bg-[var(--success)] text-white px-2 py-0.5 rounded-[3px] uppercase tracking-wider">範例</span>
                            <span className="text-[14px] font-bold text-[var(--ink)]">「最關鍵的一條」長什麼樣——三種都好</span>
                        </div>
                        <p className="text-[12.5px] text-[var(--ink-mid)] leading-relaxed mb-3">
                            最關鍵 ≠ 一定要批評——<strong className="text-[var(--ink)]">讚美、建議、疑問三種都算好回饋</strong>。每張卡有正反例對照，看清楚「為什麼這條算具體、那條算空泛」。
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {FEEDBACK_EXAMPLES.map((ex, i) => {
                                const colorMap = {
                                    success: { bg: 'bg-[var(--success-light)]', border: 'border-[var(--success)]', tag: 'bg-[var(--success)]' },
                                    gold: { bg: 'bg-[var(--gold-light)]', border: 'border-[var(--gold)]', tag: 'bg-[var(--gold)]' },
                                    accent: { bg: 'bg-[var(--accent-light)]', border: 'border-[var(--accent)]', tag: 'bg-[var(--accent)]' },
                                };
                                const c = colorMap[ex.color];
                                return (
                                    <div key={i} className={`${c.bg} border-2 ${c.border} rounded-[var(--radius-unified)] p-4 flex flex-col gap-2.5`}>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[20px]">{ex.icon}</span>
                                            <span className={`text-[11px] font-mono font-bold text-white ${c.tag} px-2 py-0.5 rounded-[3px] uppercase tracking-wider`}>{ex.type}</span>
                                        </div>
                                        <div className="text-[11px] font-mono text-[var(--ink-light)] uppercase tracking-wider">面向：{ex.focus}</div>
                                        <p className="text-[11.5px] text-[var(--ink-mid)] leading-relaxed italic">{ex.when}</p>

                                        {/* 好例 */}
                                        <div className="bg-white rounded-[6px] p-2.5 border border-[var(--success)]/30">
                                            <div className="text-[10px] font-mono font-bold text-[var(--success)] uppercase tracking-wider mb-1">✅ 好回饋</div>
                                            <p className="text-[12px] text-[var(--ink)] leading-[1.85] font-medium">{ex.good}</p>
                                        </div>

                                        {/* 反例 */}
                                        <div className="bg-[#FEF2F2] rounded-[6px] p-2.5 border border-[var(--danger)]/30">
                                            <div className="text-[10px] font-mono font-bold text-[var(--danger)] uppercase tracking-wider mb-1">❌ 別這樣寫</div>
                                            <p className="text-[12px] text-[var(--ink)] leading-relaxed mb-1">{ex.bad}</p>
                                            <p className="text-[10.5px] text-[var(--ink-light)] italic leading-relaxed">為什麼不夠：{ex.badWhy}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="bg-[#FEF3C7] border-l-4 border-[#D97706] p-3 rounded-r-[6px] text-[12.5px] text-[#7F1D1D] leading-relaxed">
                        ⚠️ <strong>給聽眾的原則：</strong>一人一條、最關鍵那條。寫得具體 + 可執行（「操作型定義第 ___ 條建議改 ___」遠比「建議再想一下」有用）。
                    </div>

                    {/* 走讀後紀錄——3 位聽眾各一條 */}
                    <ThinkRecord
                        dataKey="w6-walk-feedback"
                        prompt="✍️ 走讀結束回到座位——把你海報⑤格 3 位同學寫的回饋謄到這裡"
                        placeholder={'例：\n同學 A：操作型定義『滑手機』沒講多久才算（建議改 ≥ 30 min）\n同學 B：為什麼選問卷不選日記法？日記法可能更貼近你想要的「夜間使用」\n同學 C：研究動機很真——但「對之後想戒手機的同學有幫助」可以寫成具體誰'}
                        scaffold={['同學 A：___', '同學 B：___', '同學 C：___']}
                        rows={6}
                    />
                </div>
            ),
        },

        /* ─── Step 3：找合題夥伴 / 確認 Solo ─── */
        {
            title: '找合題夥伴',
            icon: '🤝',
            content: (
                <div className="space-y-6 prose-zh">
                    <div className="bg-[var(--paper-warm)] border border-[var(--border)] rounded-[var(--radius-unified)] p-5">
                        <div className="text-[11px] font-mono text-[var(--ink-mid)] tracking-wider mb-1">PART 3 · 15 MIN</div>
                        <h2 className="text-[18px] font-bold text-[var(--ink)] mb-2">看走讀結果決定路線</h2>
                        <p className="text-[13px] text-[var(--ink-mid)] leading-relaxed">
                            走讀蒐集的便利貼透露兩件事：① 別人覺得你題目可不可行 ② 哪些同學的題目跟你近、可以合題。下一步：<strong className="text-[var(--ink)]">找夥伴 OR 確認自己 Solo</strong>。
                        </p>
                    </div>

                    {/* 判斷指引 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-[var(--accent-light)] border-2 border-[var(--accent)] rounded-[var(--radius-unified)] p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <Users size={18} className="text-[var(--accent)]" />
                                <span className="text-[14px] font-bold text-[var(--ink)]">考慮 Team 合題的訊號</span>
                            </div>
                            <ul className="text-[12.5px] text-[var(--ink-mid)] leading-[1.85] list-none space-y-1">
                                <li>· 走讀時遇到題目方向相近的同學</li>
                                <li>· 你的方法跟某人可以互補（你問卷他訪談）</li>
                                <li>· 黃便利貼建議「跟 ___ 合題」</li>
                                <li>· 你覺得自己一個人扛 4 章很吃力</li>
                            </ul>
                        </div>
                        <div className="bg-[#fef3c7] border-2 border-[#D97706] rounded-[var(--radius-unified)] p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <User size={18} className="text-[#D97706]" />
                                <span className="text-[14px] font-bold text-[var(--ink)]">考慮 Solo 的訊號（要嚴格自評）</span>
                            </div>
                            <ul className="text-[12.5px] text-[var(--ink-mid)] leading-[1.85] list-none space-y-1">
                                <li>· 題目核心只有你能執行（個人經驗、特殊場域）</li>
                                <li>· 已做大量前置（田野、訪談聯繫）別人接不上</li>
                                <li>· 合題會稀釋你的核心問題</li>
                                <li>· 你願意接受嚴格自評 + 風險清單</li>
                            </ul>
                        </div>
                    </div>

                    {/* 路線選擇按鈕 */}
                    <div>
                        <div className="text-[13px] font-bold text-[var(--ink)] mb-3">📍 選一條路（之後可以變更但要重填）</div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <button
                                onClick={() => pickRoute('team')}
                                className={[
                                    'p-4 rounded-[var(--radius-unified)] border-2 text-left transition-all',
                                    route === 'team'
                                        ? 'border-[var(--accent)] bg-[var(--accent-light)] shadow-md'
                                        : 'border-[var(--border)] bg-white hover:border-[var(--accent)] hover:bg-[var(--paper-warm)]',
                                ].join(' ')}
                            >
                                <div className="flex items-center gap-2 mb-1.5">
                                    <Users size={20} className="text-[var(--accent)]" />
                                    <span className="font-bold text-[15px] text-[var(--ink)]">Team 合題組隊</span>
                                    {route === 'team' && <CheckCircle2 size={16} className="text-[var(--accent)] ml-auto" />}
                                </div>
                                <p className="text-[12px] text-[var(--ink-mid)]">3 人成組、共同題目、分工 4 章工作</p>
                            </button>
                            <button
                                onClick={() => pickRoute('solo')}
                                className={[
                                    'p-4 rounded-[var(--radius-unified)] border-2 text-left transition-all',
                                    route === 'solo'
                                        ? 'border-[#D97706] bg-[#fef3c7] shadow-md'
                                        : 'border-[var(--border)] bg-white hover:border-[#D97706] hover:bg-[#fffbeb]',
                                ].join(' ')}
                            >
                                <div className="flex items-center gap-2 mb-1.5">
                                    <User size={20} className="text-[#D97706]" />
                                    <span className="font-bold text-[15px] text-[var(--ink)]">Solo 單飛獨行</span>
                                    {route === 'solo' && <CheckCircle2 size={16} className="text-[#D97706] ml-auto" />}
                                </div>
                                <p className="text-[12px] text-[var(--ink-mid)]">一個人扛全部——下一步要嚴格自評 5 項</p>
                            </button>
                        </div>
                    </div>

                    {!route && (
                        <div className="bg-[var(--paper-warm)] border border-dashed border-[var(--border)] rounded-[var(--radius-unified)] p-3 text-[12px] text-[var(--ink-light)] italic">
                            ⏳ 還沒選擇路線——下一步（Step 4）會根據你的選擇顯示對應內容。
                        </div>
                    )}
                </div>
            ),
        },

        /* ─── Step 4：路線決定（Team or Solo）─── */
        {
            title: '路線決定',
            icon: '🛤️',
            content: (
                <div className="space-y-6 prose-zh">
                    {!route && (
                        <div className="bg-[#FEF2F2] border-2 border-[var(--danger)] rounded-[var(--radius-unified)] p-5">
                            <div className="flex items-center gap-2 mb-2">
                                <AlertTriangle size={18} className="text-[var(--danger)]" />
                                <span className="text-[14px] font-bold text-[var(--danger)]">你還沒選路線</span>
                            </div>
                            <p className="text-[13px] text-[var(--ink-mid)] leading-relaxed">
                                請回 Step 3「找合題夥伴」選擇 Team 或 Solo，這個 Step 才會顯示對應內容。
                            </p>
                        </div>
                    )}

                    {/* Team 線 */}
                    {route === 'team' && (
                        <>
                            <div className="bg-[var(--accent-light)] border-2 border-[var(--accent)] rounded-[var(--radius-unified)] p-5">
                                <div className="flex items-center gap-2 mb-2">
                                    <Users size={18} className="text-[var(--accent)]" />
                                    <span className="text-[14px] font-bold text-[var(--accent)] uppercase tracking-wider">TEAM 合題組隊</span>
                                </div>
                                <h3 className="text-[16px] font-bold text-[var(--ink)] mb-2">3 人成組 + 共同題目 + 分工</h3>
                                <p className="text-[12.5px] text-[var(--ink-mid)] leading-relaxed">
                                    合題的關鍵不是「題目接近就合」——是<strong>合題後核心問題更精彩</strong>。如果合題會把你和別人都拉去做大家都不想的題目，那就回 Solo。
                                </p>
                            </div>

                            <ThinkRecord
                                dataKey="w6-team-topic"
                                prompt="① 合題後的共同題目"
                                placeholder="例：本校高一段考前後一週的夜間手機使用 vs 學業表現相關性研究"
                                scaffold={['共同題目：___', '誰最初提出（種子題目）：___', '其他人加進來貢獻什麼面向：___']}
                                rows={3}
                            />

                            <div>
                                <p className="text-[12.5px] font-bold text-[var(--ink)] mb-2">② 隊員基本資料 + 分工初構（W7 計畫書時會更精細，這裡先確認誰一組）</p>
                                <TeamMembersInput dataKey="w6-team-members" />
                            </div>

                            <ThinkRecord
                                dataKey="w6-team-rationale"
                                prompt="③ 合題理由——為什麼這幾個人題目可以合？"
                                placeholder="例：我們三個都關心高中生作息，但角度不同：我看手機、A 看睡眠、B 看自習效率——合起來剛好可以做「段考前作息整合研究」，比各自做一塊有意義。"
                                scaffold={['原本各自的題目：___', '合起來的核心問題：___', '為什麼三個一起做比各自做有價值：___']}
                                rows={5}
                            />
                        </>
                    )}

                    {/* Solo 線（嚴格 5 項）*/}
                    {route === 'solo' && (
                        <>
                            <div className="bg-[#fef3c7] border-2 border-[#D97706] rounded-[var(--radius-unified)] p-5">
                                <div className="flex items-center gap-2 mb-2">
                                    <User size={18} className="text-[#D97706]" />
                                    <span className="text-[14px] font-bold text-[#D97706] uppercase tracking-wider">SOLO 單飛獨行（嚴格自評）</span>
                                </div>
                                <h3 className="text-[16px] font-bold text-[var(--ink)] mb-2">下面 5 項全部要寫——這是你獨撐到 W17 的契約</h3>
                                <p className="text-[12.5px] text-[var(--ink-mid)] leading-relaxed">
                                    Solo 不是「不想跟人合作」——是「題目客觀只能你一個人做」。下面 5 項是<strong className="text-[var(--danger)]">必填</strong>，少寫一項就會在 W11 預試、W12 中期短報、W14 結論寫作那邊崩盤。寫得越具體，你越扛得住。
                                </p>
                            </div>

                            {SOLO_REQUIREMENTS.map((req, i) => (
                                <div key={req.id}>
                                    <div className="bg-[#fef3c7] border-l-4 border-[#D97706] p-3 rounded-r-[6px] mb-2">
                                        <p className="text-[12.5px] font-bold text-[#7F1D1D] mb-1">{req.label}</p>
                                        <p className="text-[11.5px] text-[#92400E] leading-relaxed">{req.hint}</p>
                                    </div>
                                    <ThinkRecord
                                        dataKey={`w6-solo-${req.id}`}
                                        prompt={req.label}
                                        placeholder="按上方 hint 的提示具體寫——抽象寫的話 W12 中期短報老師會直接退件。"
                                        scaffold={req.scaffold}
                                        rows={req.id === 'workload' ? 7 : 5}
                                    />
                                </div>
                            ))}

                            <div className="bg-[#FEF2F2] border-l-4 border-[var(--danger)] p-3 rounded-r-[6px] text-[12.5px] text-[#7F1D1D] leading-relaxed">
                                ⚠️ <strong>Solo 契約提醒：</strong>這 5 項寫完後會送 ExportButton 一鍵匯出，老師審 Solo 申請時會逐條檢查。被退回就要重做或回 Team 線。
                            </div>

                            {/* Solo 申請被退回的明確 fallback 流程 */}
                            <details className="mt-3 rounded-[var(--radius-unified)] border border-[#FCD34D] bg-[#FFFBEB] overflow-hidden">
                                <summary className="cursor-pointer px-4 py-2.5 hover:bg-[#FEF3C7] transition-colors flex items-center gap-2">
                                    <span className="text-[12.5px] font-bold text-[#92400E]">⚠️ Solo 申請被退回怎麼辦？——點開看 3 條具體下一步</span>
                                    <span className="ml-auto text-[10px] font-mono text-[#92400E]">▼</span>
                                </summary>
                                <div className="border-t border-[#FCD34D] p-4 bg-white space-y-3">
                                    <p className="text-[12px] text-[#78350F] leading-relaxed">
                                        老師退回不是判你死刑——是告訴你「這 5 項裡有一項說服力不夠」。<strong>不要硬撐重寫一樣的內容</strong>，依老師的退件理由走以下 3 條路其中 1 條：
                                    </p>

                                    <div className="rounded border border-[#FCD34D] p-3 bg-[#FFFBEB]">
                                        <p className="text-[12.5px] font-bold text-[#92400E] mb-1.5">🔁 路 A · 修補 Solo 申請</p>
                                        <p className="text-[11.5px] text-[#78350F] leading-relaxed">
                                            退件理由是「① 為什麼非 Solo 不可」說服力不夠？<strong>回 Step 3 走讀紀錄</strong>找具體證據（同學說「這題目別人接不上」「資料只有你能拿到」），再重寫第 ① 項。其他 4 項（時間規劃／三大風險／求援計畫／Plan B）若被點到，照同樣方式回前一個 Step 找素材。<br />
                                            <span className="text-[#92400E] font-mono text-[11px]">→ 重新交一次 Solo 申請（最多 2 次機會）</span>
                                        </p>
                                    </div>

                                    <div className="rounded border border-[#86EFAC] p-3 bg-[#F0FDF4]">
                                        <p className="text-[12.5px] font-bold text-[#166534] mb-1.5">🤝 路 B · 轉 Team 找合題夥伴</p>
                                        <p className="text-[11.5px] text-[#14532D] leading-relaxed">
                                            兩次都被退？多數情況是「你的題目其實合得起來，只是你還沒找到對的人」。<strong>回 W2 觀察種子＋ABC 型句</strong>，找題目方向相近的同學（特別是核心問題類型相同——A 影響型 / B 比較型 / C 深究型 同型最容易合）；或<strong>回 W4 方法地圖</strong>看自己跟誰選同樣主方法，方法相同最容易共用工具。<br />
                                            <span className="text-[#166534] font-mono text-[11px]">→ 切回上方「路線選擇」改選 Team，重走 Step 4 Team 線</span>
                                        </p>
                                    </div>

                                    <div className="rounded border border-[#BFDBFE] p-3 bg-[#EFF6FF]">
                                        <p className="text-[12.5px] font-bold text-[#1E40AF] mb-1.5">🔧 路 C · 縮小題目再 Solo</p>
                                        <p className="text-[11.5px] text-[#1E3A8A] leading-relaxed">
                                            老師退件常常是「題目太大、Solo 一個人扛不住」。<strong>回 W3 Wizard 的 4 把刀</strong>（範圍縮小／抽象具體化／對象可及化／方法可行化），把題目砍到「一個人 4 章絕對做得完」的規模——例如原本「全校學生」改「我們班 30 人」、原本「整學期」改「兩週」。題目縮小後再走 Solo 5 項通常會通。<br />
                                            <span className="text-[#1E40AF] font-mono text-[11px]">→ 回 Step 4 重寫 Solo 5 項，特別是「② 一個人 4 章時間規劃」</span>
                                        </p>
                                    </div>

                                    <div className="bg-[#1a1a2e] text-[#FDE68A] rounded p-3 text-[11.5px] leading-relaxed">
                                        💡 <strong>選哪一條路？</strong>看老師退件理由：題目本身有問題 → 路 C 縮小；找不到合題夥伴的證據不夠 → 路 A 修補；自己也覺得撐不住 → 路 B 轉 Team。<strong>沒有對錯，只有「你撐得住的那條」</strong>。
                                    </div>
                                </div>
                            </details>
                        </>
                    )}
                </div>
            ),
        },

        /* ─── Step 5：反思 + 繳交 ─── */
        {
            title: '反思 + 繳交',
            icon: '📋',
            content: (
                <div className="space-y-8 prose-zh">
                    {/* 檢核清單 */}
                    <div className="bg-white border border-[var(--border)] rounded-[var(--radius-unified)] overflow-hidden">
                        <div className="p-4 px-5 bg-[var(--paper-warm)] border-b border-[var(--border)] font-bold text-[13px]">
                            ✅ 本週結束，你應該要會
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-[1px] bg-[var(--border)]">
                            {[
                                '把 W3 題目 + W4 方法 + W5 操作型定義組成一張海報',
                                '在 Gallery Walk 中收到 ≥ 3 條同儕回饋並寫下',
                                '確定路線：Team 合題（3 人題目 + 分工）or Solo（嚴格 5 項全寫）',
                                '能說出走讀最重要那條建議怎麼處理',
                            ].map((item, i) => (
                                <div key={i} className="p-4 px-6 bg-white flex items-start gap-3">
                                    <CheckCircle2 size={16} className="text-[var(--success)] mt-0.5 flex-shrink-0" />
                                    <span className="text-[13px] text-[var(--ink-mid)]">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 反思 */}
                    <ThinkRecord
                        dataKey="w6-reflect"
                        prompt="✍️ 反思：走讀蒐集的回饋裡，最有用的 1 條是什麼？你怎麼處理？"
                        placeholder="例：最有用的是「操作型定義『滑手機』沒講多久」——我自己以為夠清楚但對方一看就抓到漏洞。處理：把定義改成「視線停留手機螢幕 ≥ 30 秒，刷信息／滑社群／看影片都算」。"
                        scaffold={['最有用的 1 條：___', '為什麼這條重要（我自己沒看到什麼）：___', '我準備怎麼處理：___']}
                        rows={5}
                    />

                    {/* AIRED optional */}
                    <AIREDNarrative week="6" hint="海報標題優化可能用 AI——記錄一次最關鍵的互動。" optional={true} />

                    {/* 一鍵複製 */}
                    <ExportButton
                        weekLabel="W6 海報博覽會 + 組隊"
                        fields={EXPORT_FIELDS}
                    />

                    {/* 下週預告 */}
                    <div className="next-week-preview">
                        <div className="next-week-header">
                            <span className="next-week-badge">NEXT WEEK</span>
                            <h3 className="next-week-title">W7 預告</h3>
                        </div>
                        <div className="next-week-content">
                            <div className="next-week-col">
                                <div className="next-week-label">W7 主題</div>
                                <p className="next-week-text">文獻搜尋入門——A-D 證據分級、華藝四步搜尋、APA 引用練習。為計畫書第二章（文獻回顧）打地基。</p>
                            </div>
                            <div className="next-week-col">
                                <div className="next-week-label">你要帶來</div>
                                <p className="next-week-text">這週確定的<strong className="text-white">題目／方法／路線</strong>——下週要為這個題目找 3-5 篇真實文獻。</p>
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
                    <span className="hidden md:inline">研究方法與專題 / 研究規劃 / </span><span className="text-[var(--ink)] font-bold">海報博覽會 W6</span>
                </div>
                <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
                    <span className="bg-[var(--paper-warm)] text-[var(--ink)] text-[10px] font-bold px-2 py-0.5 rounded-[2px] font-mono">100 MINS</span>
                    <ResetWeekButton weekPrefix="w6-" />
                    <button
                        onClick={() => setShowLessonMap(!showLessonMap)}
                        className="text-[11px] text-[var(--ink-light)] hover:text-[var(--accent)] transition-colors flex items-center gap-1 font-mono"
                    >
                        <Map size={12} /> <span className="hidden md:inline">{showLessonMap ? 'Hide Plan' : 'Instructor View'}</span>
                    </button>
                    <span className="hidden md:inline-block bg-[var(--ink)] text-white text-[10px] font-bold px-2 py-0.5 rounded-[2px] font-mono">AI-RED · D</span>
                </div>
            </div>

            {showLessonMap && W6Data && (
                <div className="animate-in slide-in-from-top-4 duration-300">
                    <LessonMap data={W6Data} />
                </div>
            )}

            {/* PAGE HEADER — Hero Block */}
            <HeroBlock
                kicker="R.I.B. 調查檔案 · 研究方法與專題 · W6"
                title="海報博覽會："
                accentTitle="Gallery Walk + 組隊"
                subtitle="把 W3 題目 + W4 方法 + W5 操作型定義組成 A4 海報，Gallery Walk 收 3 位同學各一條最關鍵的回饋，最後做兩條路的決定：Team 合題組隊 or Solo 單飛（嚴格 5 項自評）。"
                chain="W3-W5 三件齊了——但只有自己看不算數。這週把它們攤開讓全班看，收回饋、找夥伴或確認單飛——下週開始就是計畫書 + 工具設計的長線執行。"
                meta={[
                    { label: '課堂節奏', value: '海報製作 → Gallery Walk → 找合題夥伴 → 路線決定 → 反思' },
                    { label: '時長', value: '100 MINS' },
                    { label: '課堂產出', value: 'A4 海報 + 走讀回饋紀錄 + 路線決定（Team or Solo）' },
                    { label: '帶去 W7', value: '題目／方法／路線——文獻搜尋的起點' },
                ]}
            />
            <CourseArc items={[
                { wk: 'W1-W2', name: '探索階段\nRED 公約', status: 'past' },
                { wk: 'W3', name: '題目決定\n8 病症會診', status: 'past' },
                { wk: 'W4', name: '方法地圖\n兩層判斷', status: 'past' },
                { wk: 'W5', name: '操作型定義\n概念變可測', status: 'past' },
                { wk: 'W6', name: '博覽會\n組隊（含 Solo）', status: 'now' },
                { wk: 'W7-W8', name: '文獻偵探\n引用寫作' },
                { wk: 'W9-W11', name: '工具設計\n倫理審查' },
                { wk: 'W13-W17', name: '數據解讀\n發表' }
            ]} />

            <TaskCard
                weekNumber="W6"
                weekTitle={W6Data.title}
                duration={`${W6Data.duration} 分鐘 · ${W6Data.durationDesc}`}
                tasks={[
                    '三件齊一張 A4 海報 — 題目 + 方法 + 操作型定義',
                    '走讀同學海報 + 三色便利貼回饋（粉紅／黃／藍）',
                    '組隊（Team 合題）或 Solo 嚴格 5 項',
                ]}
                exportReminder="匯出組隊結果（Team 名單 / Solo 自證書）→ 之後以隊伍為單位推進"
            />

            {/* STEP ENGINE */}
            <StepEngine
                steps={steps}
                prevWeek={{ label: '回 W5 操作型定義', to: '/w5' }}
                nextWeek={{ label: '前往 W7 文獻搜尋入門', to: '/w7' }}
                flat
            />
        </div>
    );
};

export default W6PosterTeamPage;
