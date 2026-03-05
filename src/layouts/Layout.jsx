import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Menu, X, Home, Navigation2, BarChart2, Search, BookOpen, Users, Gamepad2, Stethoscope, Wrench, HeartPulse, Bug, ChartNoAxesCombined, Palette, TrendingUp, ShieldAlert, PenTool, ShieldCheck, Clock, Target } from 'lucide-react';
import { Footer } from '../components/Footer';

export const Layout = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

    const navSections = [
        {
            items: [
                { name: '首頁', path: '/', icon: <Home size={18} /> },
                { name: '🎮 R.I.B. 特務指揮中心', path: '/games', icon: <Gamepad2 size={18} className="text-amber-500" /> },
            ]
        },
        {
            phase: '🔍 探索階段',
            label: '1️⃣ 問題意識',
            items: [
                { name: '發掘問題 (W0)', path: '/discovery', icon: <Search size={18} /> },
                { name: 'AI-RED 公約 (W1)', path: '/w1', icon: <ShieldAlert size={18} className="text-amber-500" /> },
                { name: '問題意識 (W2)', path: '/problem-focus', icon: <PenTool size={18} /> },
            ]
        },
        {
            label: '2️⃣ 研究規劃',
            items: [
                { name: '方法快篩 (W3-W4)', path: '/wizard', icon: <Navigation2 size={18} /> },
                { name: '研究診所 (W5)', path: '/clinic', icon: <Stethoscope size={18} /> },
                { name: '文獻鑑識 (W6)', path: '/literature-review', icon: <BookOpen size={18} /> },
                { name: '組隊決策 (W7)', path: '/team-formation', icon: <Users size={18} /> },
            ]
        },
        {
            phase: '🎒 裝備與執行',
            label: '3️⃣ 工具準備',
            items: [
                { name: '工具設計 (W8-W9)', path: '/tool-design', icon: <Wrench size={18} /> }
            ]
        },
        {
            label: '4️⃣ 執行週 (W10-W12)',
            items: [
                { name: '定案與倫理 (W10)', path: '/w10', icon: <ShieldCheck size={18} /> },
                { name: '研究診所 I (W11)', path: '/w11', icon: <Clock size={18} /> },
                { name: '中期盤點 (W12)', path: '/w12', icon: <Target size={18} /> }
            ]
        },
        {
            phase: '📊 實戰分析',
            label: '5️⃣ 分析與報告',
            items: [
                { name: '解讀與結論 (W13+)', path: '/analysis', icon: <BarChart2 size={18} /> },
                { name: '圖表選用原則 (W13+)', path: '/chart-selection', icon: <TrendingUp size={18} /> }
            ]
        }
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
                            <h1 className="text-lg font-bold text-white tracking-wider">研究方法與專題</h1>
                            <p className="text-[10px] text-blue-400 font-semibold tracking-wider">松山高中 SSSH</p>
                        </div>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">AI 時代的高中生專題研究教練</p>
                </div>

                <div className="flex-1 py-4 overflow-y-auto">
                    {navSections.map((section, sIdx) => (
                        <div key={sIdx} className="mb-2">
                            {/* 大階段標題 (Phase) */}
                            {section.phase && (
                                <div className="px-5 pt-4 pb-2 mt-2">
                                    <div className="flex items-center gap-2">
                                        <div className="h-px bg-slate-600 flex-1"></div>
                                        <span className="text-sm font-bold text-slate-300 tracking-widest">
                                            {section.phase}
                                        </span>
                                        <div className="h-px bg-slate-600 flex-1"></div>
                                    </div>
                                </div>
                            )}

                            {/* 次分類標題 (Label) */}
                            {section.label && (
                                <div className="px-6 pt-2 pb-1">
                                    <span className="text-xs font-bold text-slate-500 tracking-wider">
                                        {section.label}
                                    </span>
                                </div>
                            )}

                            {/* 導覽按鈕 */}
                            {section.items.map((item) => (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    end={item.path === '/'}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 px-6 py-2 transition-colors ${isActive
                                            ? 'bg-blue-600/20 text-blue-400 border-r-4 border-blue-500 font-bold'
                                            : 'text-slate-400 hover:bg-slate-700 hover:text-white'
                                        }`
                                    }
                                >
                                    {item.icon}
                                    <span className="text-sm">{item.name}</span>
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
                        研究方法與專題
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
                    <Footer />
                </main>
            </div>

        </div>
    );
};
