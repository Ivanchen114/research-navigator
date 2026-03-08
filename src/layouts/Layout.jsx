import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Footer } from '../components/Footer';

export const Layout = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [maxWeek, setMaxWeek] = useState(0);
    const location = useLocation();

    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

    const navSections = [
        {
            label: '首頁',
            items: [
                { name: '首頁', path: '/', status: 'active' },
                { name: 'R.I.B. 特務指揮中心', path: '/games', status: 'none' },
            ]
        },
        {
            label: '探索階段',
            sublabel: '問題意識',
            items: [
                { name: '發掘問題', path: '/discovery', week: 'W0', status: 'done' },
                { name: 'AI-RED 公約', path: '/w1', week: 'W1', status: 'done' },
                { name: '問題意識', path: '/problem-focus', week: 'W2', status: 'done' },
            ]
        },
        {
            sublabel: '研究規劃',
            items: [
                { name: '題目健檢', path: '/wizard', week: 'W3', status: 'done' },
                { name: '題目博覽會', path: '/w4', week: 'W4', status: 'active' },
                { name: '文獻偵探社', path: '/literature-review', week: 'W5', status: 'none' },
                { name: '研究診所', path: '/clinic', week: 'W6', status: 'none' },
                { name: '組隊決策', path: '/team-formation', week: 'W7', status: 'none' },
            ]
        },
        {
            sublabel: '裝備與執行',
            items: [
                { name: '工具準備', path: '#', status: 'locked' },
                { name: '工具設計', path: '/tool-design', week: 'W8-9', status: 'locked' },
                { name: '定案與倫理', path: '/w10', week: 'W10', status: 'locked' },
                { name: '研究診所 I', path: '/w11', week: 'W11', status: 'locked' },
                { name: '中期盤點', path: '/w12', week: 'W12', status: 'locked' }
            ]
        },
        {
            sublabel: '分析與報告',
            items: [
                { name: '數據轉譯', path: '/chart-selection', week: 'W13', status: 'locked' },
                { name: '資料分析工作坊', path: '/analysis', week: 'W14', status: 'locked' }
            ]
        }
    ];

    // Improved status logic purely for demo UX
    // We dynamically override "active", "done", and "locked" based on the current route.
    const getWeekNumber = (path) => {
        if (!path) return -1;
        if (path === '/discovery') return 0;
        if (path === '/w1') return 1;
        if (path === '/problem-focus') return 2;
        if (path === '/wizard') return 3;
        if (path === '/w4') return 4;
        if (path === '/clinic') return 5;
        if (path === '/literature-review') return 6;
        if (path === '/team-formation') return 7;
        if (path === '/tool-design') return 8;
        if (path === '/w10') return 10;
        if (path === '/w11') return 11;
        if (path === '/w12') return 12;
        if (path === '/chart-selection') return 13;
        if (path === '/analysis') return 14;
        return -1;
    }

    const currentWeekNum = getWeekNumber(location.pathname);

    // Update maxWeek based on current location and persist to localStorage
    useEffect(() => {
        if (currentWeekNum !== -1) {
            setMaxWeek(prevMax => {
                const newMax = Math.max(prevMax, currentWeekNum);
                localStorage.setItem('researchNavigator_maxWeek', newMax.toString());
                return newMax;
            });
        }
    }, [currentWeekNum]);

    // Initialize from localStorage on mount
    useEffect(() => {
        const storedMax = localStorage.getItem('researchNavigator_maxWeek');
        if (storedMax) {
            setMaxWeek(parseInt(storedMax, 10));
        }
    }, []);

    const dynamicSections = navSections.map(section => ({
        ...section,
        items: section.items.map(item => {
            let finalStatus = item.status;

            if (item.path === '/') {
                if (location.pathname === '/') finalStatus = 'active';
                else finalStatus = 'none';
            } else if (item.path === '/games') {
                if (location.pathname.startsWith('/game')) finalStatus = 'active';
                else finalStatus = 'none';
            } else {
                const itemWeekNum = getWeekNumber(item.path);

                if (itemWeekNum !== -1) {
                    if (item.path === location.pathname) {
                        finalStatus = 'active';
                    } else if (itemWeekNum <= maxWeek) {
                        finalStatus = 'done';
                    } else if (itemWeekNum > maxWeek) {
                        finalStatus = 'locked';
                    } else if (currentWeekNum === -1) {
                        // If we are on a page that isn't a week (like home or games),
                        // just default to the statically defined status in the array for demo purposes
                        finalStatus = item.status;
                    }
                }
            }

            return { ...item, status: finalStatus };
        })
    }));


    return (
        <div className="flex min-h-screen bg-[#f8f7f4] font-['Noto_Sans_TC',sans-serif] text-[14px] leading-[1.6]">

            {/* Mobile Sidebar Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 z-40 bg-slate-900/50 md:hidden"
                    onClick={toggleMobileMenu}
                />
            )}

            {/* SIDEBAR */}
            <aside
                className={`fixed top-0 left-0 z-50 w-[240px] h-screen bg-white border-r border-[#dddbd5] flex flex-col transform transition-transform duration-300 ease-in-out md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                {/* Brand Header */}
                <div className="p-[24px_20px_20px] border-b border-[#dddbd5]">
                    <div className="flex items-center gap-[10px] mb-1">
                        <img src="/songshan-logo.svg" alt="松山高中" className="w-8 h-8 bg-white border border-[#dddbd5] rounded-lg p-0.5" />
                        <div className="font-['Noto_Serif_TC',serif] font-bold text-[15px] text-[#1a1a2e]">
                            研究方法與專題
                        </div>
                    </div>
                    <div className="text-[11px] text-[#8888aa] tracking-[0.05em] ml-[42px]">
                        松山高中 SSSH
                    </div>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 py-4 overflow-y-auto">
                    {dynamicSections.map((section, sIdx) => (
                        <div key={sIdx}>
                            {section.label && (
                                <div className={`text-[9px] font-bold tracking-[0.2em] text-[#8888aa] opacity-80 uppercase px-[20px] pb-1 ${sIdx > 0 ? 'mt-2 pt-2' : 'pt-2'}`}>
                                    {section.label}
                                </div>
                            )}

                            {section.sublabel && (
                                <div className={`text-[9px] text-[#bbb] pt-1 pb-1 px-[20px] ${section.items[0]?.status === 'locked' ? 'opacity-50 mt-1' : ''}`}>
                                    {section.sublabel}
                                </div>
                            )}

                            {section.items.map((item, iIdx) => (
                                <NavLink
                                    key={iIdx}
                                    to={item.status === 'locked' ? '#' : item.path}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={(navData) => {
                                        // Use our computed status rather than pure router active state for styling
                                        const isActive = item.status === 'active';
                                        const isDone = item.status === 'done';
                                        const isLocked = item.status === 'locked';

                                        let baseClasses = "flex items-center gap-2 py-[7px] px-[20px] text-[13px] transition-all duration-150 border-l-[3px] decoration-none outline-none ";

                                        if (isActive) {
                                            baseClasses += "text-[#2d5be3] bg-[#e8eeff] border-[#2d5be3] font-medium";
                                        } else if (isLocked) {
                                            baseClasses += "text-[#8888aa] border-transparent opacity-40 cursor-default";
                                        } else {
                                            baseClasses += "text-[#4a4a6a] border-transparent hover:bg-[#f8f7f4] hover:text-[#1a1a2e]";
                                        }
                                        return baseClasses;
                                    }}
                                >
                                    <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${item.status === 'active' ? 'bg-[#2d5be3] shadow-[0_0_0_3px_#e8eeff]' :
                                        item.status === 'done' ? 'bg-[#2e7d5a]' :
                                            item.status === 'locked' ? 'bg-[#c8c5bc]' :
                                                'bg-[#c8c5bc]'
                                        }`} />
                                    {item.name}
                                    {item.week && (
                                        <span className={`ml-auto text-[10px] font-['DM_Mono',monospace] px-1.5 py-[1px] rounded-[3px] ${item.status === 'active' ? 'bg-[#e8eeff] text-[#2d5be3]' :
                                            'bg-[#f0ede6] text-[#8888aa]'
                                            }`}>
                                            {item.week}
                                        </span>
                                    )}
                                </NavLink>
                            ))}
                        </div>
                    ))}
                </nav>

                {/* AIRed Footer */}
                <div className="p-[16px_20px] border-t border-[#dddbd5] space-y-3">
                    <div className="flex items-center gap-2 text-[11px] text-[#8888aa]">
                        <span>AI-RED</span>
                        <span className="font-['DM_Mono',monospace] bg-[#1a1a2e] text-white px-1.5 py-0.5 rounded-[3px] text-[10px]">
                            V2.0.4
                        </span>
                        <span>學習框架</span>
                    </div>
                    {/* 開發測試用重置按鈕 */}
                    <button
                        onClick={() => {
                            localStorage.removeItem('researchNavigator_maxWeek');
                            window.location.href = '/';
                        }}
                        className="text-[10px] text-[#e32d5b] border border-[#f2dada] bg-[#fdf2f2] rounded px-2 py-1 hover:bg-[#e32d5b] hover:text-white transition-colors w-fit flex items-center font-bold"
                        title="清除瀏覽器記憶的解鎖進度"
                    >
                        🔄 重置測試進度
                    </button>
                </div>
            </aside>

            {/* MAIN CONTENT AREA */}
            <div className="flex flex-col flex-1 w-full min-w-0 md:ml-[240px]">
                {/* Mobile Header */}
                <div className="md:hidden bg-white border-b border-[#dddbd5] p-3 flex justify-between items-center z-20 sticky top-0">
                    <div className="flex items-center gap-2">
                        <img src="/songshan-logo.svg" alt="松山高中" className="w-6 h-6 bg-white border border-[#dddbd5] rounded p-0.5" />
                        <h1 className="font-['Noto_Serif_TC',serif] font-bold text-[14px] text-[#1a1a2e]">研究方法與專題</h1>
                    </div>
                    <button
                        onClick={toggleMobileMenu}
                        className="text-[#4a4a6a] focus:outline-none p-1"
                    >
                        {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>

                <main className="flex-1 w-full relative">
                    <Outlet />
                    <Footer />
                </main>
            </div>

        </div>
    );
};
