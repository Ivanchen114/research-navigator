import { useState, useEffect, useRef, useMemo } from 'react';
import { pacingArc } from '../../data/lessonMaps';

/**
 * CourseArc — 課程弧線單列元件
 *
 * 用法一（明確 items）：
 *   <CourseArc items={[{ wk, name, past, now }]} />
 *
 * 用法二（簡寫 current）：
 *   <CourseArc current={13} />
 *   自動從 pacingArc 產生 items，current 週之前標 past、所在區段標 now。
 *   注意：pacingArc 是 8 段教學節奏細分；學生主地圖請用 Home.jsx 的 5-phase。
 *
 * 預設折疊；點標題列展開。
 * 同時顯示 ContentTypeChip 圖例，讓學生一次看懂頁面標記意義。
 */

const CHIP_LEGEND = [
    { label: '學',  color: '#2563EB', desc: '概念吸收' },
    { label: '注意', color: '#DC2626', desc: '規則邊界' },
    { label: '做',  color: '#059669', desc: '要動手'   },
    { label: '練',  color: '#7C3AED', desc: '填寫練習' },
    { label: '交出', color: '#D97706', desc: '繳交項'   },
];

export default function CourseArc({ items: itemsProp, current, label = '課程弧線 · 你在哪裡' }) {
    const [collapsed, setCollapsed] = useState(true);

    /* 若傳了 current 而非 items，自動產生 */
    const items = useMemo(() => {
        if (itemsProp) return itemsProp;
        if (current == null) return [];
        /* 解析每個 arc 項目涵蓋的週次範圍 */
        return pacingArc.map(entry => {
            const m = entry.wk.match(/W(\d+)(?:-W?(\d+))?/);
            if (!m) return { ...entry };
            const lo = Number(m[1]);
            const hi = m[2] ? Number(m[2]) : lo;
            const isNow = current >= lo && current <= hi;
            const isPast = hi < current;
            return { ...entry, now: isNow, past: isPast };
        });
    }, [itemsProp, current]);

    const wrapperRef = useRef(null);
    const nowRef = useRef(null);

    useEffect(() => {
        if (collapsed) return;
        const wrapper = wrapperRef.current;
        const nowEl = nowRef.current;
        if (!wrapper || !nowEl) return;

        // 計算讓 now 格水平置中所需的 scrollLeft
        const nowCenter = nowEl.offsetLeft + nowEl.offsetWidth / 2;
        wrapper.scrollLeft = nowCenter - wrapper.clientWidth / 2;
    }, [collapsed]);

    return (
        <>
            {/* ── 標記圖例（常駐顯示，讓學生一眼懂頁面標記） ── */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-3">
                <span className="text-[10px] text-[#8888aa] font-mono uppercase tracking-wider">標記說明</span>
                {CHIP_LEGEND.map(({ label: chipLabel, color, desc }) => (
                    <span key={chipLabel} className="flex items-center gap-1">
                        <span
                            className="inline-block text-[9.5px] font-mono font-bold tracking-[0.08em] text-white px-1.5 py-0.5 rounded"
                            style={{ background: color }}
                        >
                            {chipLabel}
                        </span>
                        <span className="text-[10px] text-[#8888aa]">{desc}</span>
                    </span>
                ))}
            </div>

            {/* ── 折疊切換 ── */}
            <button
                onClick={() => setCollapsed(c => !c)}
                className="flex items-center gap-1.5 text-[11px] text-[#8888aa] font-mono uppercase tracking-wider mb-3 hover:text-[#5555aa] transition-colors cursor-pointer"
            >
                <span>{collapsed ? '▶' : '▼'}</span>
                <span>{label}</span>
            </button>

            {/* ── 弧線格（折疊時隱藏） ── */}
            {!collapsed && (
                <div ref={wrapperRef} className="arc-grid">
                    {items.map((item, idx) => {
                        const isNow  = item.now === true  || item.status === 'now';
                        const isPast = item.past === true || item.status === 'past';
                        return (
                            <div
                                key={idx}
                                ref={isNow ? nowRef : null}
                                className={`arc-item ${isPast ? 'past' : isNow ? 'now' : ''}`}
                            >
                                <div className="arc-wk">
                                    {item.wk}{isNow && ' ← 現在'}
                                </div>
                                <div className="arc-name">
                                    {item.name.split('\n').map((line, i) => (
                                        <div key={i}>{line}</div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </>
    );
}
