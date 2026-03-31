import { useEffect, useRef } from 'react';

/**
 * CourseArc — 課程弧線單列元件
 *
 * 支援兩種資料格式：
 *   { wk, name, past: true, now: true }   ← lessonMaps 格式
 *   { wk, name, status: 'past'|'now'|'' } ← 部分頁面的 inline 格式
 *
 * 自動將 now 項目水平置中顯示（邊邊週次受限不置中）。
 */
export default function CourseArc({ items, label = '課程弧線 · 你在哪裡' }) {
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
