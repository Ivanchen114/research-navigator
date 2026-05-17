import React, { createContext, useContext, useState, useEffect } from 'react';

/**
 * ModeContext — 三模式架構的最外層 context
 *
 * mode 值：
 *   'class'       上課跟做（預設）— 老師在場，DepthBlock 收合
 *   'self-study'  自學補課     — 沒有老師，DepthBlock 展開、顯示補課路線
 *
 *「我的紀錄」不是第三種 mode，是抽屜（RecordDrawer），兩主模式下都能開。
 */

const ModeContext = createContext({ mode: 'class', setMode: () => {} });

/**
 * ModeProvider — 包在週次頁最外層，讓 DepthBlock / ModeSwitch / RecordDrawer
 * 不用一路傳 props 就能讀寫 mode。
 *
 * Props:
 *   week     string — 週次代號，如 "W14"（決定 localStorage 鍵 w14-view-mode）
 *   children
 */
export function ModeProvider({ week, children }) {
    const storageKey = `${String(week || '').toLowerCase()}-view-mode`;
    const [mode, setModeState] = useState('class');

    // 掛載後讀回上次選的模式——切到自學、重整不會跳回上課
    useEffect(() => {
        try {
            const saved = localStorage.getItem(storageKey);
            if (saved === 'class' || saved === 'self-study') setModeState(saved);
        } catch { /* localStorage 不可用時維持預設 */ }
    }, [storageKey]);

    const setMode = (m) => {
        setModeState(m);
        try { localStorage.setItem(storageKey, m); } catch { /* 忽略 */ }
    };

    return (
        <ModeContext.Provider value={{ mode, setMode }}>
            {children}
        </ModeContext.Provider>
    );
}

export function useMode() {
    return useContext(ModeContext);
}

export default ModeProvider;
