import React from 'react';
import { Calendar, Clock, ListChecks, Upload } from 'lucide-react';

/**
 * TaskCard — 每週「本節任務卡」
 *
 * 放在週次頁面 hero 之後、課程內容之前，給學生一眼看見「這節課要做什麼」。
 *
 * Props:
 *   weekNumber       string   ex. "W3"
 *   weekTitle        string   ex. "題目健檢與 AI 協作工作坊"
 *   duration         string?  ex. "100 分鐘 · 2 節課"
 *   tasks            string[] 三件事（建議 3 條，多了也接受但 UI 會擠）
 *   exportReminder   string?  下課前提醒，例：「匯出 disease-quiz 反思 → 學習單 Part 2 繳交」
 */
export const TaskCard = ({
    weekNumber,
    weekTitle,
    duration,
    tasks = [],
    exportReminder,
}) => {
    const safeTasks = Array.isArray(tasks) && tasks.length > 0
        ? tasks
        : ['（待補：本週第 1 件事）', '（待補：本週第 2 件事）', '（待補：本週第 3 件事）'];

    return (
        <section
            className="task-card border-2 border-[#1a1a2e] bg-[#fafaf6] rounded-[10px] p-6 mb-10 shadow-[0_2px_0_#1a1a2e]"
            aria-label="本週任務卡"
        >
            {/* 標題列 */}
            <header className="flex items-baseline gap-3 mb-4 border-b border-[#dddbd5] pb-3">
                <span className="bg-[#1a1a2e] text-white text-[11px] font-bold px-2 py-1 rounded-[3px] font-['DM_Mono',monospace] tracking-wider">
                    {weekNumber}
                </span>
                <h2 className="font-['Noto_Serif_TC',serif] text-[18px] font-bold text-[#1a1a2e] leading-tight">
                    本週任務 · {weekTitle}
                </h2>
                {duration && (
                    <span className="ml-auto text-[11px] text-[#8888aa] flex items-center gap-1 font-['DM_Mono',monospace]">
                        <Clock size={12} /> {duration}
                    </span>
                )}
            </header>

            {/* 今天只做三件事 */}
            <div className="mb-4">
                <div className="flex items-center gap-2 text-[12px] font-bold text-[#2d5be3] mb-3 uppercase tracking-wider font-['DM_Mono',monospace]">
                    <ListChecks size={14} /> 今天只做{['零','一','二','三','四','五'][safeTasks.length] ?? safeTasks.length}件事
                </div>
                <ol className="space-y-2 text-[14px] text-[#1a1a2e] leading-[1.7]">
                    {safeTasks.map((t, i) => (
                        <li key={i} className="flex items-start gap-3">
                            <span className="shrink-0 w-6 h-6 rounded-full bg-[#e8eeff] text-[#2d5be3] text-[12px] font-bold flex items-center justify-center font-['DM_Mono',monospace]">
                                {i + 1}
                            </span>
                            <span className="pt-0.5">{t}</span>
                        </li>
                    ))}
                </ol>
            </div>

            {/* 下課前提醒 */}
            {exportReminder && (
                <div className="flex items-start gap-2 text-[13px] text-[#7a4a18] bg-[#faf5e4] border border-[#e8d8a8] rounded-[6px] px-3 py-2.5">
                    <Upload size={14} className="shrink-0 mt-0.5" />
                    <span><strong className="font-bold">下課前：</strong>{exportReminder}</span>
                </div>
            )}
        </section>
    );
};

export default TaskCard;
