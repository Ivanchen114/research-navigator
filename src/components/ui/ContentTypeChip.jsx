import React from 'react';

/**
 * ContentTypeChip — 內容類型標籤
 *
 * 沿用 StepBriefing 的顏色系統，貼在各 section 開頭讓學生即時知道
 * 這個區塊需要「讀」還是「做」。
 *
 * type: '學' | '注意' | '做' | '練' | '交出'
 */

const LABEL_COLOR = {
    學:   '#2563EB',   // 藍
    做:   '#059669',   // 綠
    練:   '#7C3AED',   // 紫
    交出: '#D97706',   // 琥珀
    注意: '#DC2626',   // 紅
};

export default function ContentTypeChip({ type }) {
    const bg = LABEL_COLOR[type] ?? '#9B7F2A';
    return (
        <span
            className="inline-block text-[9.5px] font-mono font-bold tracking-[0.08em] text-white px-1.5 py-0.5 rounded"
            style={{ background: bg }}
        >
            {type}
        </span>
    );
}
