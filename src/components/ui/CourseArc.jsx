import { useEffect, useRef, useMemo } from 'react';
import { baseCourseArc } from '../../data/lessonMaps';

/**
 * CourseArc — 課程弧線單列元件
 *
 * 用法一（明確 items）：
 *   <CourseArc items={[{ wk, name, past, now }]} />
 *
 * 用法二（簡寫 current）：
 *   <CourseArc current={13} />
 *   自動從 baseCourseArc 產生 items，current 週之前標 past、所在區段標 now。
 */
export default function CourseArc({ items: itemsProp, current, label = '課程弧線 · 你在哪裡' }) {
    /* 若傳了 current 而非 items，自動產生 */
    const items = useMemo(() => {
        if (itemsProp) return itemsProp;
        if (current == null) return [];
        /* 解析每個 arc 項目涵蓋的週次範圍 */
        return baseCourseArc.map(entry => {
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
        const wrapper = wrapperRef.current;
        const nowEl = nowRef.current;
        if (!wrapper || !nowEl) return;

        // 計算讓 now 格水平置中所需的 scrollLeft
        const nowCenter = nowEl.offsetLeft + nowEl.offsetWidth / 2;
        wrapper.scrollLeft = nowCenter - wrapper.clientWidth / 2;
    }, []);

    return (
        <>
            <div className="text-[11px] text-[#8888aa] mb-3 font-mono uppercase tracking-wider">
                {label}
            </div>
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
        </>
    );
}
