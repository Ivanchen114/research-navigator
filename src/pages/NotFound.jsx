import React from 'react';
import { Link } from 'react-router-dom';

export const NotFound = () => (
  <div className="page-container animate-in-fade-slide" style={{ textAlign: 'center', paddingTop: 80 }}>
    <p className="font-mono text-[12px] text-[var(--ink-light)] tracking-[0.15em] uppercase mb-3">404 · NOT FOUND</p>
    <h1 className="font-serif text-[28px] md:text-[36px] font-bold text-[var(--ink)] mb-4">找不到這頁 😅</h1>
    <p className="text-[14px] text-[var(--ink-mid)] leading-relaxed mb-8 max-w-[480px] mx-auto">
      可能是路徑打錯了，或這個內容已經搬家。回首頁從任務大廳重新出發吧。
    </p>
    <Link
      to="/"
      className="inline-flex items-center gap-2 bg-[var(--ink)] text-white px-5 py-2.5 rounded-[var(--radius-unified)] text-[13px] font-bold hover:opacity-90 transition-opacity no-underline"
    >
      ← 回首頁
    </Link>
  </div>
);

export default NotFound;
