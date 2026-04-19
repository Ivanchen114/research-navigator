import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  BookMarked,
  Clock,
  CheckCircle2,
  Circle,
  ChevronDown,
  ChevronRight,
  Printer,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  FileText,
  AlertTriangle,
} from 'lucide-react';
import HeroBlock from '../components/ui/HeroBlock';
import {
  PORTFOLIO_REGISTRY,
  buildTimeline,
  readCuration,
  writeCuration,
  MAX_CURATED,
} from '../data/portfolioRegistry';

/* ══════════════════════════════════════
 *  Portfolio 學習歷程策展室
 *  三階段：Timeline（盤點）→ Curate（策展）→ Export（列印）
 * ══════════════════════════════════════ */

export const Portfolio = () => {
  const [phase, setPhase] = useState('timeline'); // 'timeline' | 'curate' | 'export'
  const [timeline, setTimeline] = useState([]);
  const [curation, setCuration] = useState({ selected: {}, reflections: {}, meta: {} });
  const [expandedWeek, setExpandedWeek] = useState(null); // Timeline 展開的週次

  // 載入資料
  useEffect(() => {
    window.scrollTo(0, 0);
    setTimeline(buildTimeline());
    setCuration(readCuration());
  }, []);

  // 自動存檔
  useEffect(() => {
    writeCuration(curation);
  }, [curation]);

  /* ─── 策展操作 ─── */
  const toggleSelect = useCallback((key) => {
    setCuration((prev) => {
      const isSelected = !!prev.selected[key];
      const count = Object.values(prev.selected).filter(Boolean).length;
      if (!isSelected && count >= MAX_CURATED) {
        alert(`最多只能選 ${MAX_CURATED} 個精選時刻。請先取消其他勾選。`);
        return prev;
      }
      const nextSelected = { ...prev.selected };
      if (isSelected) delete nextSelected[key];
      else nextSelected[key] = true;
      return { ...prev, selected: nextSelected };
    });
  }, []);

  const updateReflection = useCallback((key, field, value) => {
    setCuration((prev) => ({
      ...prev,
      reflections: {
        ...prev.reflections,
        [key]: { ...(prev.reflections[key] || {}), [field]: value },
      },
    }));
  }, []);

  const updateMeta = useCallback((field, value) => {
    setCuration((prev) => ({
      ...prev,
      meta: { ...prev.meta, [field]: value },
    }));
  }, []);

  /* ─── 衍生資料 ─── */
  const allMoments = useMemo(() => {
    const out = [];
    timeline.forEach((week) => {
      week.moments.forEach((m) => {
        out.push({ ...m, weekNum: week.weekNum, weekLabel: week.weekLabel, weekRoute: week.weekRoute });
      });
    });
    return out;
  }, [timeline]);

  const selectedCount = useMemo(
    () => Object.values(curation.selected).filter(Boolean).length,
    [curation.selected]
  );

  const totalFilled = useMemo(
    () => timeline.reduce((sum, w) => sum + w.filled, 0),
    [timeline]
  );

  const selectedMoments = useMemo(
    () => allMoments.filter((m) => curation.selected[m.key]),
    [allMoments, curation.selected]
  );

  return (
    <div className="page-container animate-in-fade-slide">
      {/* ─── 列印用 CSS：只在列印模式下套用 ─── */}
      <style>{`
        @media print {
          @page { size: A4 portrait; margin: 18mm 16mm; }
          body { background: white !important; }
          .no-print { display: none !important; }
          .print-only { display: block !important; }
          .print-page { page-break-after: always; }
          .print-moment { page-break-inside: avoid; break-inside: avoid; }
          .portfolio-print-body { font-family: 'Noto Serif TC', 'Songti TC', serif; color: #1a1a2e; }
        }
        .print-only { display: none; }
      `}</style>

      {/* ════════════════════════════════
          TOP BAR
          ════════════════════════════════ */}
      <div className="flex items-center justify-between border-b border-[var(--border)] pb-4 mb-8 gap-3 no-print">
        <div className="text-[11px] font-mono text-[var(--ink-light)] flex items-center gap-2 min-w-0">
          <span className="hidden md:inline">研究方法與專題 / 學習歷程 / </span>
          <span className="text-[var(--ink)] font-bold">Portfolio · 策展室</span>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="bg-[var(--paper-warm)] text-[var(--ink)] text-[10px] font-bold px-2 py-0.5 rounded-[2px] font-mono">
            已紀錄 {totalFilled} 則
          </span>
          <span className="hidden md:inline-block bg-[var(--ink)] text-white text-[10px] font-bold px-2 py-0.5 rounded-[2px] font-mono">
            精選 {selectedCount}/{MAX_CURATED}
          </span>
        </div>
      </div>

      {/* ════════════════════════════════
          HERO
          ════════════════════════════════ */}
      <div className="no-print">
        <HeroBlock
          kicker="R.I.B. 調查檔案 · 學習歷程策展室"
          title="把一整學期的思考，"
          accentTitle="做成你的作品"
          subtitle="這裡不是重交作業的地方——是你回頭看整學期，挑出真正值得讓大學教授看見的思考瞬間，並加上此刻的回看。"
          meta={[
            { label: 'Step 1', value: '盤點：瀏覽整學期紀錄' },
            { label: 'Step 2', value: '策展：選出 10 個關鍵時刻' },
            { label: 'Step 3', value: '匯出：列印成 PDF' },
            { label: '保存位置', value: '全部存在你的瀏覽器，不上傳' },
          ]}
        />
      </div>

      {/* ════════════════════════════════
          警告：若尚未有任何紀錄
          ════════════════════════════════ */}
      {totalFilled === 0 && (
        <div className="no-print bg-amber-50 border-2 border-amber-300 rounded-[var(--radius-unified)] p-6 mb-8 flex items-start gap-3">
          <AlertTriangle className="text-amber-600 shrink-0 mt-0.5" size={22} />
          <div>
            <div className="font-bold text-amber-900 mb-1">目前沒有任何紀錄可策展</div>
            <div className="text-[13px] text-amber-800 leading-relaxed">
              這個頁面會自動讀取你在每一週（W1-W16）填在「思考紀錄」格子裡的內容。先回到任何一週的課程頁面填寫一些題目，再回來這裡策展。
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════
          PHASE SWITCHER（階段切換）
          ════════════════════════════════ */}
      <div className="no-print flex items-center gap-2 mb-8">
        <PhaseTab
          active={phase === 'timeline'}
          onClick={() => setPhase('timeline')}
          icon={<Clock size={16} />}
          label="Step 1 · 盤點"
          index={1}
        />
        <PhaseConnector done={phase !== 'timeline'} />
        <PhaseTab
          active={phase === 'curate'}
          onClick={() => setPhase('curate')}
          icon={<BookMarked size={16} />}
          label="Step 2 · 策展"
          index={2}
        />
        <PhaseConnector done={phase === 'export'} />
        <PhaseTab
          active={phase === 'export'}
          onClick={() => setPhase('export')}
          icon={<Printer size={16} />}
          label="Step 3 · 匯出"
          index={3}
        />
      </div>

      {/* ════════════════════════════════
          PHASE 1：TIMELINE（盤點）
          ════════════════════════════════ */}
      {phase === 'timeline' && (
        <div className="no-print">
          <SectionHeader
            n="01"
            title="盤點你的整學期紀錄"
            desc="每一格代表一週。打開可以看到你那週填了什麼。這一步只是讓你看清全貌，還不用做決定。"
          />
          <div className="space-y-3">
            {timeline.map((week) => (
              <WeekCard
                key={week.weekNum}
                week={week}
                expanded={expandedWeek === week.weekNum}
                onToggle={() =>
                  setExpandedWeek(expandedWeek === week.weekNum ? null : week.weekNum)
                }
                isSelected={(key) => !!curation.selected[key]}
                onSelect={toggleSelect}
                selectedCount={selectedCount}
              />
            ))}
          </div>

          <div className="mt-10 flex justify-end">
            <button
              onClick={() => setPhase('curate')}
              disabled={totalFilled === 0}
              className="flex items-center gap-2 px-6 py-3 bg-[var(--ink)] text-white font-bold rounded-[var(--radius-unified)] hover:bg-[var(--ink)]/90 transition-all disabled:bg-slate-300 disabled:cursor-not-allowed"
            >
              下一步：挑選關鍵時刻
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* ════════════════════════════════
          PHASE 2：CURATE（策展）
          ════════════════════════════════ */}
      {phase === 'curate' && (
        <div className="no-print">
          <SectionHeader
            n="02"
            title={`挑出 ${MAX_CURATED} 個關鍵時刻`}
            desc={`不求量、求質。選那些你當時寫完還記得、或現在回看覺得有分量的那幾則。對每一個選中的時刻，加上兩句話：當時為什麼寫、現在怎麼看。`}
          />

          {selectedCount === 0 && allMoments.length > 0 && (
            <div className="bg-[var(--paper-warm)] border border-[var(--border)] rounded-[var(--radius-unified)] p-4 mb-6 text-[13px] text-[var(--ink-light)]">
              目前還沒選任何時刻。下方列出你有填過的 {allMoments.length} 則紀錄，勾選你想放進學習歷程的那些（上限 {MAX_CURATED} 則）。
            </div>
          )}

          <div className="space-y-3">
            {allMoments.map((m) => (
              <CurateRow
                key={m.key}
                moment={m}
                selected={!!curation.selected[m.key]}
                reflection={curation.reflections[m.key] || {}}
                canSelect={selectedCount < MAX_CURATED || !!curation.selected[m.key]}
                onToggle={() => toggleSelect(m.key)}
                onReflect={(field, val) => updateReflection(m.key, field, val)}
              />
            ))}
          </div>

          <div className="mt-10 flex justify-between items-center">
            <button
              onClick={() => setPhase('timeline')}
              className="flex items-center gap-2 px-5 py-2.5 border border-[var(--border)] text-[var(--ink)] font-bold rounded-[var(--radius-unified)] hover:bg-[var(--paper-warm)] transition-all"
            >
              <ArrowLeft size={16} />
              回盤點
            </button>
            <button
              onClick={() => setPhase('export')}
              disabled={selectedCount === 0}
              className="flex items-center gap-2 px-6 py-3 bg-[var(--ink)] text-white font-bold rounded-[var(--radius-unified)] hover:bg-[var(--ink)]/90 transition-all disabled:bg-slate-300 disabled:cursor-not-allowed"
            >
              下一步：匯出成 PDF
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* ════════════════════════════════
          PHASE 3：EXPORT（匯出預覽）
          ════════════════════════════════ */}
      {phase === 'export' && (
        <>
          {/* 設定區（列印時隱藏） */}
          <div className="no-print">
            <SectionHeader
              n="03"
              title="最後一步：列印成 PDF"
              desc="填入你的基本資料和整學期反思，然後按「列印」。建議在列印對話框選「存成 PDF」。"
            />

            <div className="bg-white border border-[var(--border)] rounded-[var(--radius-unified)] p-6 mb-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <LabeledInput
                  label="姓名"
                  value={curation.meta.name || ''}
                  onChange={(v) => updateMeta('name', v)}
                  placeholder="王小明"
                />
                <LabeledInput
                  label="班級座號"
                  value={curation.meta.class || ''}
                  onChange={(v) => updateMeta('class', v)}
                  placeholder="1年5班 12號"
                />
                <LabeledInput
                  label="學期"
                  value={curation.meta.semester || ''}
                  onChange={(v) => updateMeta('semester', v)}
                  placeholder="114 學年度上學期"
                />
              </div>
              <LabeledInput
                label="檔案標題"
                value={curation.meta.title || ''}
                onChange={(v) => updateMeta('title', v)}
                placeholder="我與 AI 的一學期：從模仿遊戲到畢業研究"
              />
              <div>
                <label className="block text-[11px] font-bold text-[var(--ink-light)] tracking-widest uppercase mb-2">
                  整學期反思（選填，200-500 字建議）
                </label>
                <textarea
                  value={curation.meta.semesterReflection || ''}
                  onChange={(e) => updateMeta('semesterReflection', e.target.value)}
                  placeholder="回頭看這學期的紀錄，哪一週讓我最有感？我對 AI 的看法有什麼改變？離「會做研究」還差什麼？"
                  className="w-full min-h-[140px] p-3 border border-[var(--border)] rounded-[var(--radius-unified)] text-[14px] leading-relaxed focus:outline-none focus:border-[var(--ink)]"
                />
              </div>
            </div>

            <div className="flex justify-between items-center mb-10">
              <button
                onClick={() => setPhase('curate')}
                className="flex items-center gap-2 px-5 py-2.5 border border-[var(--border)] text-[var(--ink)] font-bold rounded-[var(--radius-unified)] hover:bg-[var(--paper-warm)] transition-all"
              >
                <ArrowLeft size={16} />
                回策展
              </button>
              <button
                onClick={() => window.print()}
                className="flex items-center gap-2 px-6 py-3 bg-[var(--ink)] text-white font-bold rounded-[var(--radius-unified)] hover:bg-[var(--ink)]/90 transition-all"
              >
                <Printer size={18} />
                列印（存成 PDF）
              </button>
            </div>

            <SectionHeader n="04" title="預覽" desc="以下是你的學習歷程會列印出來的長相。" />
          </div>

          {/* 預覽 + 列印版型（螢幕 & 列印共用） */}
          <PrintableBody curation={curation} selectedMoments={selectedMoments} />
        </>
      )}
    </div>
  );
};

/* ══════════════════════════════════════
 *  子元件
 * ══════════════════════════════════════ */

const PhaseTab = ({ active, onClick, icon, label, index }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2.5 rounded-[var(--radius-unified)] font-bold text-[13px] transition-all border-2 ${
      active
        ? 'bg-[var(--ink)] text-white border-[var(--ink)]'
        : 'bg-white text-[var(--ink-light)] border-[var(--border)] hover:border-[var(--ink)]/40'
    }`}
  >
    {icon}
    <span className="hidden md:inline">{label}</span>
    <span className="md:hidden">Step {index}</span>
  </button>
);

const PhaseConnector = ({ done }) => (
  <div className={`flex-1 h-[2px] max-w-[60px] ${done ? 'bg-[var(--ink)]' : 'bg-[var(--border)]'}`} />
);

const SectionHeader = ({ n, title, desc }) => (
  <div className="mb-6">
    <div className="flex items-center gap-3 mb-2">
      <span className="text-[11px] font-mono tracking-[0.3em] text-[var(--ink-light)]">{n}</span>
      <div className="h-[1px] flex-1 bg-[var(--border)]" />
    </div>
    <h2 className="text-[24px] md:text-[28px] font-black text-[var(--ink)] mb-2">{title}</h2>
    <p className="text-[14px] text-[var(--ink-light)] leading-relaxed max-w-[720px]">{desc}</p>
  </div>
);

const WeekCard = ({ week, expanded, onToggle, isSelected, onSelect, selectedCount }) => {
  const hasContent = week.filled > 0;
  const completionPct = week.total > 0 ? Math.round((week.filled / week.total) * 100) : 0;

  return (
    <div
      className={`border rounded-[var(--radius-unified)] overflow-hidden transition-all ${
        hasContent
          ? 'bg-white border-[var(--border)]'
          : 'bg-[var(--paper-warm)]/50 border-[var(--border)]/60'
      }`}
    >
      <button
        onClick={onToggle}
        disabled={!hasContent}
        className={`w-full flex items-center justify-between p-4 text-left transition-colors ${
          hasContent ? 'hover:bg-[var(--paper-warm)]/50 cursor-pointer' : 'cursor-not-allowed'
        }`}
      >
        <div className="flex items-center gap-4 min-w-0">
          <div
            className={`w-12 h-12 shrink-0 rounded-[var(--radius-unified)] flex flex-col items-center justify-center font-mono text-[11px] font-bold ${
              hasContent
                ? 'bg-[var(--ink)] text-white'
                : 'bg-slate-200 text-slate-400'
            }`}
          >
            <span>W{week.weekNum}</span>
          </div>
          <div className="min-w-0">
            <div className="font-bold text-[15px] text-[var(--ink)] truncate">{week.weekLabel}</div>
            <div className="text-[11px] text-[var(--ink-light)] mt-0.5">
              {hasContent ? (
                <>
                  已填 {week.filled}/{week.total}（{completionPct}%）
                </>
              ) : week.total === 0 ? (
                <>這週沒有紀錄欄位</>
              ) : (
                <>這週沒有填寫紀錄</>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          {hasContent && (
            <div className="hidden md:block w-24 h-1.5 bg-[var(--border)] rounded-full overflow-hidden">
              <div
                className="h-full bg-[var(--ink)] transition-all"
                style={{ width: `${completionPct}%` }}
              />
            </div>
          )}
          {hasContent &&
            (expanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />)}
        </div>
      </button>

      {expanded && hasContent && (
        <div className="border-t border-[var(--border)] p-4 md:p-5 space-y-3 bg-[var(--paper-warm)]/30">
          {week.moments.map((m) => (
            <MomentPreview
              key={m.key}
              moment={m}
              selected={isSelected(m.key)}
              onSelect={() => onSelect(m.key)}
              canSelect={selectedCount < MAX_CURATED || isSelected(m.key)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const MomentPreview = ({ moment, selected, onSelect, canSelect }) => (
  <div
    className={`border rounded-[var(--radius-unified)] p-3 transition-all ${
      selected ? 'bg-[var(--ink)]/5 border-[var(--ink)]' : 'bg-white border-[var(--border)]'
    }`}
  >
    <div className="flex items-start gap-3">
      <button
        onClick={onSelect}
        disabled={!canSelect}
        className={`shrink-0 mt-0.5 transition-colors ${
          canSelect ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
        }`}
        aria-label={selected ? '取消選取' : '選為精選時刻'}
      >
        {selected ? (
          <CheckCircle2 size={20} className="text-[var(--ink)]" />
        ) : (
          <Circle size={20} className="text-[var(--border)] hover:text-[var(--ink)]" />
        )}
      </button>
      <div className="min-w-0 flex-1">
        <div className="font-bold text-[13px] text-[var(--ink)] mb-1">{moment.label}</div>
        {moment.question && (
          <div className="text-[11px] text-[var(--ink-light)] italic mb-1.5">
            Q: {moment.question}
          </div>
        )}
        <div className="text-[13px] text-[var(--ink)] whitespace-pre-wrap leading-relaxed">
          {moment.value}
        </div>
      </div>
    </div>
  </div>
);

const CurateRow = ({ moment, selected, reflection, canSelect, onToggle, onReflect }) => (
  <div
    className={`border rounded-[var(--radius-unified)] overflow-hidden transition-all ${
      selected ? 'bg-[var(--ink)]/5 border-[var(--ink)]' : 'bg-white border-[var(--border)]'
    }`}
  >
    <div className="p-4 flex items-start gap-3">
      <button
        onClick={onToggle}
        disabled={!canSelect}
        className={`shrink-0 mt-0.5 transition-colors ${
          canSelect ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
        }`}
      >
        {selected ? (
          <CheckCircle2 size={22} className="text-[var(--ink)]" />
        ) : (
          <Circle size={22} className="text-[var(--border)] hover:text-[var(--ink)]" />
        )}
      </button>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <span className="font-mono text-[10px] bg-[var(--ink)] text-white px-1.5 py-0.5 rounded-[2px] font-bold">
            W{moment.weekNum}
          </span>
          <span className="text-[11px] font-bold text-[var(--ink-light)] truncate">
            {moment.weekLabel}
          </span>
        </div>
        <div className="font-bold text-[14px] text-[var(--ink)] mb-1">{moment.label}</div>
        {moment.question && (
          <div className="text-[11px] text-[var(--ink-light)] italic mb-2">Q: {moment.question}</div>
        )}
        <div className="text-[13px] text-[var(--ink)] whitespace-pre-wrap leading-relaxed bg-[var(--paper-warm)]/50 p-2.5 rounded">
          {moment.value}
        </div>
      </div>
    </div>

    {selected && (
      <div className="border-t border-[var(--ink)]/20 p-4 bg-white space-y-3">
        <div>
          <label className="block text-[11px] font-bold text-[var(--ink-light)] tracking-widest uppercase mb-1.5">
            當時為什麼寫這個？
          </label>
          <textarea
            value={reflection.why || ''}
            onChange={(e) => onReflect('why', e.target.value)}
            placeholder="當下觸發你寫這段話的是什麼？老師的問題？某個同學的話？自己某個念頭？"
            className="w-full min-h-[70px] p-2.5 border border-[var(--border)] rounded text-[13px] leading-relaxed focus:outline-none focus:border-[var(--ink)]"
          />
        </div>
        <div>
          <label className="block text-[11px] font-bold text-[var(--ink-light)] tracking-widest uppercase mb-1.5">
            現在回看，你會怎麼想？
          </label>
          <textarea
            value={reflection.now || ''}
            onChange={(e) => onReflect('now', e.target.value)}
            placeholder="經過整學期，你對當時的想法有沒有新的看法？是被驗證、被推翻、還是延伸出新問題？"
            className="w-full min-h-[70px] p-2.5 border border-[var(--border)] rounded text-[13px] leading-relaxed focus:outline-none focus:border-[var(--ink)]"
          />
        </div>
      </div>
    )}
  </div>
);

const LabeledInput = ({ label, value, onChange, placeholder }) => (
  <div>
    <label className="block text-[11px] font-bold text-[var(--ink-light)] tracking-widest uppercase mb-1.5">
      {label}
    </label>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full p-2.5 border border-[var(--border)] rounded-[var(--radius-unified)] text-[14px] focus:outline-none focus:border-[var(--ink)]"
    />
  </div>
);

/* ══════════════════════════════════════
 *  列印版型（螢幕預覽 + 列印實體輸出）
 *  使用襯線字體、A4 直式、單欄
 * ══════════════════════════════════════ */
const PrintableBody = ({ curation, selectedMoments }) => {
  const meta = curation.meta || {};
  const groupedByWeek = useMemo(() => {
    const map = new Map();
    selectedMoments.forEach((m) => {
      if (!map.has(m.weekNum)) map.set(m.weekNum, { weekNum: m.weekNum, weekLabel: m.weekLabel, moments: [] });
      map.get(m.weekNum).moments.push(m);
    });
    return Array.from(map.values()).sort((a, b) => a.weekNum - b.weekNum);
  }, [selectedMoments]);

  return (
    <div className="portfolio-print-body bg-white border border-[var(--border)] rounded-[var(--radius-unified)] p-8 md:p-12 max-w-[820px] mx-auto">
      {/* 封面區 */}
      <div className="pb-6 mb-8 border-b-2 border-[var(--ink)]">
        <div className="text-[11px] font-mono tracking-[0.3em] text-[var(--ink-light)] mb-3 uppercase">
          研究方法與專題 · 學習歷程檔案 · 松山高中
        </div>
        <h1 className="text-[32px] font-black leading-tight text-[var(--ink)] mb-4">
          {meta.title || '（請填寫檔案標題）'}
        </h1>
        <div className="flex flex-wrap gap-x-6 gap-y-1 text-[13px] text-[var(--ink)]">
          <div>
            <span className="text-[var(--ink-light)]">姓名：</span>
            <span className="font-bold">{meta.name || '—'}</span>
          </div>
          <div>
            <span className="text-[var(--ink-light)]">班級：</span>
            <span className="font-bold">{meta.class || '—'}</span>
          </div>
          <div>
            <span className="text-[var(--ink-light)]">學期：</span>
            <span className="font-bold">{meta.semester || '—'}</span>
          </div>
          <div>
            <span className="text-[var(--ink-light)]">策展日期：</span>
            <span className="font-bold">
              {new Date().toLocaleDateString('zh-TW', { year: 'numeric', month: '2-digit', day: '2-digit' })}
            </span>
          </div>
        </div>
      </div>

      {/* 整學期反思 */}
      {meta.semesterReflection && (
        <div className="mb-10 print-moment">
          <SectionTitlePrint label="前言" title="整學期的回頭看" />
          <p className="text-[14px] leading-[1.9] text-[var(--ink)] whitespace-pre-wrap">
            {meta.semesterReflection}
          </p>
        </div>
      )}

      {/* 精選時刻 */}
      <div className="mb-6">
        <SectionTitlePrint label="精選時刻" title={`我挑的 ${selectedMoments.length} 個關鍵思考`} />
      </div>

      {selectedMoments.length === 0 ? (
        <div className="text-center py-12 text-[var(--ink-light)] italic">
          尚未挑選任何精選時刻
        </div>
      ) : (
        <div className="space-y-8">
          {groupedByWeek.map((group) => (
            <div key={group.weekNum} className="print-moment">
              <div className="text-[12px] font-mono tracking-widest text-[var(--ink-light)] mb-3 uppercase">
                {group.weekLabel}
              </div>
              <div className="space-y-6">
                {group.moments.map((m) => {
                  const refl = curation.reflections[m.key] || {};
                  return (
                    <div
                      key={m.key}
                      className="print-moment pl-4 border-l-2 border-[var(--ink)]"
                    >
                      <h3 className="text-[16px] font-black text-[var(--ink)] mb-2">{m.label}</h3>
                      {m.question && (
                        <div className="text-[12px] text-[var(--ink-light)] italic mb-2">
                          原題：{m.question}
                        </div>
                      )}
                      <div className="mb-3">
                        <div className="text-[10px] font-bold tracking-widest uppercase text-[var(--ink-light)] mb-1">
                          當時寫的
                        </div>
                        <div className="text-[14px] leading-[1.9] text-[var(--ink)] whitespace-pre-wrap">
                          {m.value}
                        </div>
                      </div>
                      {refl.why && (
                        <div className="mb-3">
                          <div className="text-[10px] font-bold tracking-widest uppercase text-[var(--ink-light)] mb-1">
                            當時為什麼寫
                          </div>
                          <div className="text-[14px] leading-[1.9] text-[var(--ink)] whitespace-pre-wrap">
                            {refl.why}
                          </div>
                        </div>
                      )}
                      {refl.now && (
                        <div>
                          <div className="text-[10px] font-bold tracking-widest uppercase text-[var(--ink-light)] mb-1">
                            現在回看
                          </div>
                          <div className="text-[14px] leading-[1.9] text-[var(--ink)] whitespace-pre-wrap">
                            {refl.now}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 頁尾 */}
      <div className="mt-12 pt-6 border-t border-[var(--border)] flex items-center justify-between text-[10px] font-mono text-[var(--ink-light)] tracking-widest uppercase">
        <span>R.I.B. 調查檔案 · 自主策展</span>
        <span>台北市立松山高中 · 研究方法與專題</span>
      </div>
    </div>
  );
};

const SectionTitlePrint = ({ label, title }) => (
  <div className="mb-4">
    <div className="text-[10px] font-mono tracking-[0.3em] text-[var(--ink-light)] uppercase mb-1">
      {label}
    </div>
    <h2 className="text-[20px] font-black text-[var(--ink)]">{title}</h2>
  </div>
);

export default Portfolio;
