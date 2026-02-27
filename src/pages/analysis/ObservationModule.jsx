import React from 'react';
import { DocLinkBtn } from '../../components/analysis/DocLinkBtn';
import { PromptBox, AIInstructionDropdown } from '../../components/analysis/PromptBox';

export const ObservationModule = () => {
    return (
        <div className="p-6 md:p-8 space-y-8 animate-in fade-in slide-in-from-right-4">

            {/* Header */}
            <header className="border-b border-slate-200 pb-4">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-4">
                            <h2 className="text-2xl font-bold text-slate-800">模組 4：觀察法記錄分析</h2>
                        </div>
                        <p className="text-slate-600 mt-2 text-sm">目標：從行為中發現模式 (Patterns)。</p>
                    </div>
                    <DocLinkBtn href="https://docs.google.com/document/d/1s_LLHFyh-GA8X0m1bAWssmVtVsC7xgaFaRWOS86APRk/edit?usp=drive_link">
                        完整指南
                    </DocLinkBtn>
                </div>
            </header>

            {/* Analysis Sections */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 border-l-4 border-teal-500">
                    <h3 className="font-bold text-teal-800 mb-2">結構化數據 (Quant)</h3>
                    <p className="text-sm text-slate-600 mb-4">例如：舉手次數、滑手機次數。<br />重點：計算頻率、比例、趨勢。</p>

                    <AIInstructionDropdown title="頻率統計">
                        <PromptBox>
                            {`【資料】我在 3 堂下課時間觀察了「飲水機的使用情形」。
- 第一節下課：男生 5 人，女生 2 人。
- 第二節下課：男生 8 人，女生 1 人。

【任務】
1. 請幫我計算總人次與男女比例。
2. 觀察數據是否有特定的趨勢？
3. 建議用什麼圖表呈現？`}
                        </PromptBox>
                    </AIInstructionDropdown>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 border-l-4 border-orange-500">
                    <h3 className="font-bold text-orange-800 mb-2">非結構化數據 (Qual)</h3>
                    <p className="text-sm text-slate-600 mb-4">例如：田野筆記、互動氣氛。<br />重點：歸納主題、解讀情境脈絡。</p>

                    <AIInstructionDropdown title="情境脈絡">
                        <PromptBox>
                            {`【情境】圖書館閱覽室。
【筆記】「靠近窗戶的位置總是先被坐滿...」
【任務】
1. 請從筆記中歸納出學生的「選位策略」。
2. 這背後隱含了什麼心理需求？（如安全感？）`}
                        </PromptBox>
                    </AIInstructionDropdown>
                </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                <h3 className="text-lg font-bold text-slate-800 mb-2">Step 3：綜合詮釋 (Triangulation)</h3>
                <p className="text-sm text-slate-600 mb-4">將「看到的行為」與「可能的意義」結合。</p>

                <AIInstructionDropdown title="綜合推論">
                    <PromptBox>
                        {`【量化結果】男生佔據籃球場中央的比例為 90%。
【質性筆記】女生通常聚集在球場邊緣聊天。
【任務】
請綜合上述兩點，分析校園空間使用的「性別權力關係」。這反映了什麼校園文化？`}
                    </PromptBox>
                </AIInstructionDropdown>
            </div>

        </div>
    );
};
