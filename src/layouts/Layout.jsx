import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Menu, X, Home, Navigation2, BarChart2, Search, BookOpen, Users, Gamepad2, Stethoscope, Wrench, HeartPulse, Bug, ChartNoAxesCombined, Palette } from 'lucide-react';

export const Layout = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

    const navSections = [
        {
            items: [
                { name: '首頁', path: '/', icon: <Home size={18} /> },
            ]
        },
        {
            label: '探索階段',
            items: [
                { name: '發掘問題 (W0-W2)', path: '/discovery', icon: <Search size={18} /> },
                { name: '方法快篩 (W3-W4)', path: '/wizard', icon: <Navigation2 size={18} /> },
                { name: '研究診所 (W5)', path: '/clinic', icon: <Stethoscope size={18} /> },
            ]
        },
        {
            label: '裝備階段',
            items: [
                { name: '文獻鑑識 (W6)', path: '/literature-review', icon: <BookOpen size={18} /> },
                { name: '組隊決策 (W7)', path: '/team-formation', icon: <Users size={18} /> },
                { name: '工具設計 (W8-W9)', path: '/tool-design', icon: <Wrench size={18} /> },
            ]
        },
        {
            label: '實戰分析',
            items: [
                { name: '數據分析 (W10+)', path: '/analysis', icon: <BarChart2 size={18} /> },
            ]
        },
        {
            label: '互動遊戲',
            items: [
                { name: '問題急診室 (W0-W2)', path: '/game/question-er', icon: <HeartPulse size={18} /> },
                { name: '辦案工具大考驗 (W3-W5)', path: '/game/tool-quiz', icon: <Gamepad2 size={18} /> },
                { name: '文獻偵探社 (W6)', path: '/game/citation-detective', icon: <Gamepad2 size={18} /> },
                { name: '處方鑑定師 (W8-W9)', path: '/game/rx-inspector', icon: <Bug size={18} /> },
                { name: '數據偵探 (W10+)', path: '/game/data-detective', icon: <ChartNoAxesCombined size={18} /> },
                { name: '圖表配對師 (W10+)', path: '/game/chart-matcher', icon: <Palette size={18} /> },
            ]
        },
    ];

    return (
        <div className="flex h-screen overflow-hidden bg-slate-50">

            {/* Mobile Sidebar Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 z-40 bg-slate-900/50 md:hidden"
                    onClick={toggleMobileMenu}
                />
            )}

            {/* Sidebar Navigation */}
            <nav
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-800 text-slate-300 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 flex flex-col ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="p-5 bg-slate-900 sticky top-0 shadow-md">
                    <div className="flex items-center gap-3 mb-2">
                        <img src="/songshan-logo.svg" alt="松山高中" className="w-10 h-10 bg-white rounded-lg p-1 shadow-sm" />
                        <div>
                            <h1 className="text-lg font-bold text-white tracking-wider">研究領航員</h1>
                            <p className="text-[10px] text-blue-400 font-semibold tracking-wider">松山高中 SSSH</p>
                        </div>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">AI 時代的高中生專題研究教練</p>
                </div>

                <div className="flex-1 py-4 overflow-y-auto">
                    {navSections.map((section, sIdx) => (
                        <div key={sIdx} className="mb-2">
                            {section.label && (
                                <div className="px-4 pt-3 pb-1">
                                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                                        {section.label}
                                    </span>
                                    <div className="mt-1 border-t border-slate-700" />
                                </div>
                            )}
                            {section.items.map((item) => (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    end={item.path === '/'}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 px-6 py-2.5 transition-colors ${isActive
                                            ? 'bg-blue-600 text-white border-r-4 border-blue-400'
                                            : 'hover:bg-slate-700 hover:text-white'
                                        }`
                                    }
                                >
                                    {item.icon}
                                    <span className="font-medium text-sm">{item.name}</span>
                                </NavLink>
                            ))}
                        </div>
                    ))}
                </div>
            </nav>


            {/* Main Content Area */}
            <div className="flex flex-col flex-1 w-full min-w-0">

                {/* Mobile Header */}
                <div className="md:hidden bg-slate-900 text-white p-4 flex justify-between items-center z-20 shadow-md">
                    <h1 className="font-bold flex items-center gap-2">
                        <img src="/songshan-logo.svg" alt="松山高中" className="w-7 h-7 bg-white rounded p-0.5" />
                        研究領航員
                    </h1>
                    <button
                        onClick={toggleMobileMenu}
                        className="text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded p-1"
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Scrollable Main View */}
                <main className="flex-1 overflow-y-auto p-4 md:p-8 relative">
                    <Outlet />
                </main>
            </div>

        </div>
    );
};
