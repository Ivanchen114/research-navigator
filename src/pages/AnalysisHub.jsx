import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { BookOpen, ClipboardList, Mic, TestTube2, Camera, Library } from 'lucide-react';
import { FoundationModule } from './analysis/FoundationModule';
import { SurveyModule } from './analysis/SurveyModule';
import { InterviewModule } from './analysis/InterviewModule';
import { ExperimentModule } from './analysis/ExperimentModule';
import { ObservationModule } from './analysis/ObservationModule';
import { LiteratureModule } from './analysis/LiteratureModule';

export const AnalysisHub = () => {
    const [searchParams] = useSearchParams();
    const initialTab = searchParams.get('tab') || 'foundation';
    const [activeTab, setActiveTab] = useState(initialTab);

    useEffect(() => {
        const tabParam = searchParams.get('tab');
        if (tabParam && ['foundation', 'survey', 'interview', 'experiment', 'observation', 'literature'].includes(tabParam)) {
            setActiveTab(tabParam);
        }
    }, [searchParams]);

    const tabs = [
        { id: 'foundation', label: '基礎觀念', icon: <BookOpen size={18} /> },
        { id: 'survey', label: '問卷法', icon: <ClipboardList size={18} /> },
        { id: 'interview', label: '訪談法', icon: <Mic size={18} /> },
        { id: 'experiment', label: '實驗法', icon: <TestTube2 size={18} /> },
        { id: 'observation', label: '觀察法', icon: <Camera size={18} /> },
        { id: 'literature', label: '文獻法', icon: <Library size={18} /> },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'foundation': return <FoundationModule />;
            case 'survey': return <SurveyModule />;
            case 'interview': return <InterviewModule />;
            case 'experiment': return <ExperimentModule />;
            case 'observation': return <ObservationModule />;
            case 'literature': return <LiteratureModule />;
            default: return null;
        }
    };

    return (
        <div className="max-w-[1100px] mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 font-['Noto_Sans_TC',sans-serif] text-[14px] leading-[1.6] text-[#1a1a2e] pb-16">

            {/* Header */}
            <header className="pt-8 text-center max-w-[650px] mx-auto">
                <div className="text-[11px] font-['DM_Mono',monospace] tracking-[0.12em] uppercase text-[#2d5be3] mb-3 flex items-center justify-center gap-2">
                    <span className="text-[#2d5be3]">📊</span> W11–W14 執行與分析階段
                </div>
                <h1 className="font-['Noto_Serif_TC',serif] text-[38px] font-bold leading-[1.25] text-[#1a1a2e] mb-4 tracking-[-0.02em]">
                    解讀與結論教練：<br className="hidden md:block" />
                    <span className="text-[#2d5be3] font-normal italic">從數據到真相</span>
                </h1>
                <p className="text-[15px] text-[#4a4a6a] leading-[1.75]">
                    收完數據了嗎？選擇你使用的研究方法，查閱專屬的 AI 協作分析指南與指令範本。
                </p>

                {/* 階段提醒 */}
                <div className="mt-8 p-6 bg-[#f8f7f4] border border-[#dddbd5] rounded-[6px] text-[13px] text-[#4a4a6a] inline-block text-left max-w-[560px]">
                    <h3 className="font-bold text-[#1a1a2e] mb-2 flex items-center gap-2 uppercase tracking-widest font-['DM_Mono',monospace]">
                        // Phase Checkpoint
                    </h3>
                    <p>
                        本模組適合在 <strong className="text-[#2d5be3]">W11–W14 執行研究後</strong>使用。如果你還沒設計工具，請先前往
                        <a href="/tool-design" className="text-[#2d5be3] font-bold hover:underline mx-1 underline-offset-4">W8 工具設計</a>；
                        若尚未確定方法，請回
                        <a href="/clinic" className="text-[#2d5be3] font-bold hover:underline mx-1 underline-offset-4">W5 研究診所</a>。
                    </p>
                </div>
            </header>

            {/* Tabs Layout */}
            <div className="flex flex-col lg:flex-row gap-8 items-start min-h-[600px]">

                {/* Sidebar Tabs */}
                <div className="lg:w-60 w-full shrink-0">
                    <div className="bg-white border border-[#dddbd5] rounded-[10px] p-2 sticky top-24 shadow-sm">
                        <nav className="flex flex-row lg:flex-col gap-1 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 scrollbar-hide">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-[4px] text-[13px] font-bold transition-all whitespace-nowrap lg:whitespace-normal group ${activeTab === tab.id
                                        ? 'bg-[#1a1a2e] text-white shadow-md'
                                        : 'text-[#8888aa] hover:bg-[#f8f7f4] hover:text-[#1a1a2e]'
                                        }`}
                                >
                                    <span className={`${activeTab === tab.id ? 'text-[#2d5be3]' : 'text-[#dddbd5] group-hover:text-[#1a1a2e]'} transition-colors shrink-0`}>
                                        {tab.icon}
                                    </span>
                                    {tab.label}
                                </button>
                            ))}
                        </nav>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 w-full">
                    <div className="bg-white border border-[#dddbd5] rounded-[10px] min-h-[600px] shadow-sm overflow-hidden">
                        {renderContent()}
                    </div>
                </div>

            </div>
        </div>
    );
};
