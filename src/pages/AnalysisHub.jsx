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
            case 'foundation':
                return <FoundationModule />;
            case 'survey':
                return <SurveyModule />;
            case 'interview':
                return <InterviewModule />;
            case 'experiment':
                return <ExperimentModule />;
            case 'observation':
                return <ObservationModule />;
            case 'literature':
                return <LiteratureModule />;
            default:
                return null;
        }
    };

    return (
        <div className="max-w-5xl mx-auto flex flex-col h-full animate-in fade-in duration-500">

            {/* Header */}
            <header className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100 mb-8 relative overflow-hidden text-center">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-40 -translate-y-1/2 translate-x-1/3" />
                <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100 shadow-sm mb-4">
                        <span className="text-blue-600">📊</span> W11–W14 執行與分析階段
                    </div>
                    <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight gap-3 justify-center text-center mb-4">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 drop-shadow-sm">解讀與結論教練</span>
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed mb-6">
                        收完數據了嗎？選擇你使用的研究方法，查閱專屬的 AI 協作分析指南與指令範本。
                    </p>

                    {/* 階段提醒 */}
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-5 text-sm rounded-r-2xl shadow-sm inline-block text-left text-slate-700 hover:shadow-md transition-shadow">
                        <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                            📌 你現在在哪個階段？
                        </h3>
                        <p>
                            本模組適合在 <strong className="text-blue-800">W11–W14 執行研究後</strong>使用。如果你還沒設計工具，請先前往
                            <a href="/tool-design" className="text-blue-600 font-bold hover:underline mx-1">工具設計工作坊 (W8)</a>
                            完成設計；如果你還不確定該用什麼方法，請先前往
                            <a href="/clinic" className="text-blue-600 font-bold hover:underline mx-1">研究診所 (W5)</a>
                            。
                        </p>
                    </div>
                </div>
            </header>

            {/* Tabs Layout */}
            <div className="flex flex-col md:flex-row gap-6 h-full min-h-[600px]">

                {/* Sidebar Tabs */}
                <div className="md:w-64 flex-shrink-0">
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-3 sticky top-4">
                        <nav className="space-y-1">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${activeTab === tab.id
                                        ? 'bg-blue-50 text-blue-700 shadow-sm'
                                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                                        }`}
                                >
                                    <span className={`${activeTab === tab.id ? 'text-blue-600' : 'text-slate-400'} transition-colors`}>
                                        {tab.icon}
                                    </span>
                                    {tab.label}
                                </button>
                            ))}
                        </nav>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1">
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 min-h-full overflow-hidden hover:shadow-md transition-shadow">
                        {renderContent()}
                    </div>
                </div>

            </div>
        </div>
    );
};
