import React, { useState, useEffect, useRef, useCallback } from 'react';

/**
 * LiteratureRecord — 王牌文獻結構化輸入
 *
 * 為什麼要這個組件：
 *   過去用單一 textarea + 樣板「作者（年份）發現______，這和我的研究有關，因為……」
 *   學生很容易寫成「___發現手機影響睡眠，這和我的研究有關因為都跟手機有關」這種空泛內容。
 *   診斷是「找到文獻」到「用文獻支持／挑戰自己」中間缺鷹架——學生不知道一篇文獻能怎麼被「用」。
 *
 * 解法：拆成 4 段強制表態：
 *   (1) 書目：作者+年份+題目+來源
 *   (2) 具體發現：「___ 跟 ___ 之間有 ___ 關係」三格填空，逼學生抽出可驗證的命題
 *   (3) 對我的幫助 — A/B/C/D 立場單選：借工具 / 背景證據 / 挑戰前人 / 補缺口
 *   (4) 應用補充：勾的那項具體怎麼用
 *
 * 儲存策略：合成單一字串存進 dataKey（與舊 ThinkRecord 共用 STORAGE_KEY），
 *   這樣 export / grading_app extract / critic 都不用改格式。
 *   字串格式：
 *     書目：xxx
 *     具體發現：xxx
 *     立場：A | 借用測量工具
 *     應用：xxx
 *
 * critic 端可用 regex 抓「具體發現:」「立場:」「應用:」三段判分。
 */

const STORAGE_KEY = 'rib_think_records';

function readRecords() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; }
  catch { return {}; }
}

function saveRecord(key, value) {
  const records = readRecords();
  records[key] = value;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

const STANCE_OPTIONS = [
  {
    code: 'A',
    label: '借用測量工具',
    hint: '我會用這篇的 ___ 量表 / 訪綱 / 編碼方式 來測 ___',
  },
  {
    code: 'B',
    label: '背景證據',
    hint: '這篇的結論支持我的假設「___」，所以我推測 ___',
  },
  {
    code: 'C',
    label: '挑戰前人',
    hint: '我懷疑換到 ___ 情境（不同年齡 / 文化 / 時代）結果會不同',
  },
  {
    code: 'D',
    label: '補缺口',
    hint: '這篇做的是 [其他群體]，我補上 [我的群體 / 變項]，填補空白',
  },
];

// 從合併字串解析回 4 個子欄位
function parseStored(text) {
  const empty = { bib: '', finding: '', stance: '', application: '' };
  if (!text) return empty;

  // 支援舊資料：若沒有「書目：」標頭，整段塞 bib（過渡相容）
  if (!text.includes('書目：') && !text.includes('具體發現：')) {
    return { ...empty, bib: text };
  }

  const grab = (label) => {
    const re = new RegExp(`${label}：([\\s\\S]*?)(?=\\n(?:書目|具體發現|立場|應用)：|$)`);
    const m = text.match(re);
    return m ? m[1].trim() : '';
  };

  const bib = grab('書目');
  const finding = grab('具體發現');
  const stanceRaw = grab('立場');
  const application = grab('應用');

  // 立場格式：「A | 借用測量工具」→ 抓開頭字母
  const stanceMatch = stanceRaw.match(/^([ABCD])/);
  const stance = stanceMatch ? stanceMatch[1] : '';

  return { bib, finding, stance, application };
}

// 4 個子欄位合併成存檔字串（空欄不輸出 label——避免批改 rule 把空 label 誤判為學生答案）
function serialize({ bib, finding, stance, application }) {
  const stanceOpt = STANCE_OPTIONS.find((o) => o.code === stance);
  const stanceLine = stanceOpt ? `${stance} | ${stanceOpt.label}` : '';
  const lines = [];
  if (bib && bib.trim())                lines.push(`書目：${bib.trim()}`);
  if (finding && finding.trim())        lines.push(`具體發現：${finding.trim()}`);
  if (stanceLine)                       lines.push(`立場：${stanceLine}`);
  if (application && application.trim()) lines.push(`應用：${application.trim()}`);
  return lines.join('\n');
}

export default function LiteratureRecord({
  dataKey,
  prompt = '我的王牌文獻',
  className = '',
}) {
  const [bib, setBib] = useState('');
  const [finding, setFinding] = useState('');
  const [stance, setStance] = useState('');
  const [application, setApplication] = useState('');
  const [status, setStatus] = useState('idle'); // idle | typing | saved | restored
  const timerRef = useRef(null);

  // 載入：dataKey 切換時重新讀取，避免 React 重用 instance 污染
  useEffect(() => {
    const records = readRecords();
    const stored = records[dataKey];
    if (stored) {
      const parsed = parseStored(stored);
      setBib(parsed.bib);
      setFinding(parsed.finding);
      setStance(parsed.stance);
      setApplication(parsed.application);
      setStatus('restored');
    } else {
      setBib('');
      setFinding('');
      setStance('');
      setApplication('');
      setStatus('idle');
    }
  }, [dataKey]);

  // 任一子欄位變動 → 800ms debounce → 合併存檔
  const scheduleSave = useCallback((next) => {
    setStatus('typing');
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      saveRecord(dataKey, serialize(next));
      setStatus('saved');
    }, 800);
  }, [dataKey]);

  const handleBibChange = (e) => {
    const v = e.target.value;
    setBib(v);
    scheduleSave({ bib: v, finding, stance, application });
  };
  const handleFindingChange = (e) => {
    const v = e.target.value;
    setFinding(v);
    scheduleSave({ bib, finding: v, stance, application });
  };
  const handleStanceChange = (code) => {
    setStance(code);
    // 立場是單選，立刻存檔不 debounce
    clearTimeout(timerRef.current);
    saveRecord(dataKey, serialize({ bib, finding, stance: code, application }));
    setStatus('saved');
  };
  const handleApplicationChange = (e) => {
    const v = e.target.value;
    setApplication(v);
    scheduleSave({ bib, finding, stance, application: v });
  };

  const statusText = {
    idle: '',
    typing: '輸入中…',
    saved: '✓ 已自動儲存',
    restored: '↑ 已載入上次紀錄',
  };
  const statusColor = {
    idle: 'text-transparent',
    typing: 'text-[var(--ink-light)]',
    saved: 'text-[var(--success)]',
    restored: 'text-[var(--accent)]',
  };

  return (
    <div className={`literature-record-wrap border-l-4 border-[var(--accent)] bg-white pl-4 pr-3 py-3 rounded-r-[8px] shadow-[0_1px_0_var(--border)] ${className}`}>
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold bg-[var(--accent)] text-white px-2 py-0.5 rounded-[2px] tracking-wider">
          ✍️ 輪到你填
        </span>
        <p className="text-[14px] font-bold text-[var(--ink)] leading-relaxed m-0">{prompt}</p>
      </div>

      {/* 1. 書目 */}
      <div className="mb-3">
        <label className="block text-[11px] font-mono font-bold text-[var(--ink-light)] uppercase tracking-[0.1em] mb-1">
          ① 書目
        </label>
        <textarea
          name={`${dataKey}-bib`}
          autoComplete="off"
          value={bib}
          onChange={handleBibChange}
          placeholder="例：江沁璦、鄭斐文（2020）。性別化的疼痛：女性慢性疼痛的醫療經驗。台灣社會學刊，68，1-44。"
          rows={2}
          className="w-full px-3 py-2 rounded-[var(--radius-unified)] border-2 border-[var(--accent)]/30 bg-[var(--accent-light)]/20 text-[13px] leading-relaxed text-[var(--ink)] placeholder:text-[var(--ink-light)] focus:outline-none focus:border-[var(--accent)] focus:bg-white focus:ring-2 focus:ring-[var(--accent)]/15 transition-all resize-y"
        />
      </div>

      {/* 2. 具體發現 */}
      <div className="mb-3">
        <label className="block text-[11px] font-mono font-bold text-[var(--ink-light)] uppercase tracking-[0.1em] mb-1">
          ② 具體發現：這篇研究「找到」什麼結果？
        </label>
        <p className="text-[11px] text-[var(--ink-light)] mb-1">
          句型：「<span className="font-mono">___ 跟 ___ 之間有 ___ 關係</span>」<br />
          ❌ 不要寫「她研究了某現象」 → 那是研究主題，不是發現<br />
          ✅ 要寫「她<strong>找到</strong>什麼結果」——可被另一個人驗證的具體結論
        </p>
        <textarea
          name={`${dataKey}-finding`}
          autoComplete="off"
          value={finding}
          onChange={handleFindingChange}
          placeholder="例：女性慢性疼痛患者比男性更常被醫師認為是「心理因素」而延誤診斷。"
          rows={2}
          className="w-full px-3 py-2 rounded-[var(--radius-unified)] border-2 border-[var(--accent)]/30 bg-[var(--accent-light)]/20 text-[13px] leading-relaxed text-[var(--ink)] placeholder:text-[var(--ink-light)] focus:outline-none focus:border-[var(--accent)] focus:bg-white focus:ring-2 focus:ring-[var(--accent)]/15 transition-all resize-y"
        />
      </div>

      {/* 3. 立場（A/B/C/D 單選） */}
      <div className="mb-3">
        <label className="block text-[11px] font-mono font-bold text-[var(--ink-light)] uppercase tracking-[0.1em] mb-2">
          ③ 我打算怎麼「用」這篇文獻（擇一）
        </label>
        <div className="space-y-1.5">
          {STANCE_OPTIONS.map((opt) => {
            const checked = stance === opt.code;
            return (
              <label
                key={opt.code}
                className={`flex items-start gap-2 px-3 py-2 rounded-[var(--radius-unified)] border-2 cursor-pointer transition-all ${
                  checked
                    ? 'border-[var(--accent)] bg-[var(--accent-light)]/40'
                    : 'border-[var(--border)] bg-white hover:border-[var(--accent)]/50'
                }`}
              >
                <input
                  type="radio"
                  name={`${dataKey}-stance`}
                  value={opt.code}
                  checked={checked}
                  onChange={() => handleStanceChange(opt.code)}
                  className="mt-0.5 accent-[var(--accent)]"
                />
                <div className="flex-1">
                  <div className="text-[13px] font-bold text-[var(--ink)]">
                    {opt.code}. {opt.label}
                  </div>
                  <div className="text-[11px] text-[var(--ink-light)] mt-0.5 italic">
                    {opt.hint}
                  </div>
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {/* 4. 應用補充 */}
      <div className="mb-1">
        <label className="block text-[11px] font-mono font-bold text-[var(--ink-light)] uppercase tracking-[0.1em] mb-1">
          ④ 你選的那個立場，具體怎麼用？
        </label>
        <p className="text-[11px] text-[var(--ink-light)] mb-1">
          請先回去 ③ 選一個立場，再回來這格寫「具體怎麼用」。<br />
          要寫得讓老師相信：你真的會把這篇用進你的研究，而不是貼上去湊數。
        </p>
        <textarea
          name={`${dataKey}-application`}
          autoComplete="off"
          value={application}
          onChange={handleApplicationChange}
          placeholder="例：我會借用她訪談「女性疼痛敘事」的問法，但對象換成高中女生在保健室的就醫經驗。"
          rows={2}
          className="w-full px-3 py-2 rounded-[var(--radius-unified)] border-2 border-[var(--accent)]/30 bg-[var(--accent-light)]/20 text-[13px] leading-relaxed text-[var(--ink)] placeholder:text-[var(--ink-light)] focus:outline-none focus:border-[var(--accent)] focus:bg-white focus:ring-2 focus:ring-[var(--accent)]/15 transition-all resize-y"
        />
      </div>

      <div className={`text-[11px] font-mono mt-1.5 h-4 transition-colors ${statusColor[status]}`}>
        {statusText[status]}
      </div>
    </div>
  );
}

export { parseStored, serialize, STANCE_OPTIONS };
