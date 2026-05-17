import React, { createContext, useContext, useState } from 'react';

/**
 * ProjectorContext — 全站「投影顯示」開關
 *
 * 跟 ModeContext（每週各自的 上課/自學）不同：
 *   - 投影顯示是老師整堂課、甚至跨週連續使用的「顯示層」狀態 → 必須全域、單一。
 *   - 所以這個 Provider 包在 App.jsx 最外層（BrowserRouter 內、Routes 外），
 *     不掛在任何一週的 ModeProvider 裡。
 *
 * 投影顯示不是第四種教材，只改「怎麼呈現」，不改作業邏輯：
 *   - Layout：隱藏 mobile header
 *   - StepEngine：導覽列精簡
 *   - DepthBlock：一律收合
 *   - 各週頁面：降低文字密度
 *
 * localStorage 鍵：rib-projector（全域，非 w{N}- 前綴）
 */

const ProjectorContext = createContext({
    projector: false,
    setProjector: () => {},
    toggleProjector: () => {},
});

const STORAGE_KEY = 'rib-projector';

export function ProjectorProvider({ children }) {
    // lazy initializer：第一次 render 就讀 localStorage——避免重整時先閃一格非投影版
    //（投影中重整會看到 header 閃一下），所以不用 useEffect 補讀。
    const [projector, setProjectorState] = useState(() => {
        try {
            return localStorage.getItem(STORAGE_KEY) === '1';
        } catch {
            return false;
        }
    });

    const setProjector = (on) => {
        const next = Boolean(on);
        setProjectorState(next);
        try { localStorage.setItem(STORAGE_KEY, next ? '1' : '0'); } catch { /* 忽略 */ }
    };

    const toggleProjector = () => setProjector(!projector);

    return (
        <ProjectorContext.Provider value={{ projector, setProjector, toggleProjector }}>
            {children}
        </ProjectorContext.Provider>
    );
}

export function useProjector() {
    return useContext(ProjectorContext);
}

export default ProjectorProvider;
