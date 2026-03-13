import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ShieldAlert, Search, Stethoscope, BriefcaseMedical,
    BarChart3, PieChart, UserCircle2, LogIn, LogOut,
    Activity, ArrowRight, BookOpen, Bug, Star, StarHalf
} from 'lucide-react';

// 定義六大任務卡片資料
const RIB_MISSIONS = [
    {
        caseCode: 'CASE #01',
        tags: ['W3', '問題意識', '靶心對焦'],
        id: 'question-er',
        title: "行動代號：靶心",
        difficulty: 4.0,
        english: "Operation: Bullseye",
        department: "法醫部",
        departmentColor: "text-rose-500 bg-rose-500/10 border-rose-500/30",
        icon: <Stethoscope size={32} className="text-rose-500" />,
        desc: "幫助你在混亂的文獻海中找對方向，鍛鍊從「現象」提煉出「研究問題」的精確度。這關卡將為陷入迷惘的探員對症下藥，開出精準的問題處方。",
        learningObjective: "研究問題精煉與對焦訓練",
        path: "/game/question-er",
        status: "active"
    },
    {
        caseCode: 'CASE #02',
        tags: ['W5', '文獻鑑識', '學術誠信'],
        id: 'citation-detective',
        title: "行動代號：獵狐",
        difficulty: 4.5,
        english: "Operation: Foxhunt",
        department: "重案部",
        departmentColor: "text-emerald-500 bg-emerald-500/10 border-emerald-500/30",
        icon: <BookOpen size={32} className="text-emerald-500" />,
        desc: "學術界的陰暗角落藏有許多未爆彈！你將扮演獵狐特務，追查 10 件極具爭議的文獻引用疑案。辨識孤兒引用、換字抄襲等違規手法，守護學術誠信的防線。",
        learningObjective: "文獻真偽辨識與學術倫理審查",
        path: "/game/citation-detective",
        status: "active"
    },
    {
        caseCode: 'CASE #03',
        tags: ['W3-W5', '方法快篩', '裝備盤點'],
        id: 'tool-quiz',
        title: "行動代號：裝備",
        difficulty: 2.0,
        english: "Gear Check Protocol",
        department: "重案部",
        departmentColor: "text-amber-500 bg-amber-500/10 border-amber-500/30",
        icon: <Search size={32} className="text-amber-500" />,
        desc: "研究現場千變萬化，裝備拿錯全盤皆輸。面對不同的案件委託，你能迅速判斷該使用問卷、訪談、實驗，還是觀察法嗎？快來測試你的鑑識直覺！",
        learningObjective: "研究工具與資料蒐集方法辨識",
        path: "/game/tool-quiz",
        status: "active"
    },
    {
        caseCode: 'CASE #04',
        tags: ['W8-W9', '研究設計', '避險測試'],
        id: 'rx-inspector',
        title: "行動代號：防線",
        difficulty: 3.5,
        english: "Operation: Defense",
        department: "法醫部",
        departmentColor: "text-rose-500 bg-rose-500/10 border-rose-500/30",
        icon: <BriefcaseMedical size={32} className="text-rose-500" />,
        desc: "這是一場防禦戰！深入 10 個充滿致命設計缺陷的研究病例。從誘導性問卷到缺乏控制組的實驗，揪出錯誤並開立正確處方，確保研究方法無懈可擊。",
        learningObjective: "研究設計與方法學避險測試",
        path: "/game/rx-inspector",
        status: "active"
    },
    {
        caseCode: 'CASE #05',
        tags: ['W13', '圖表選擇', '資訊呈現'],
        id: 'chart-matcher',
        title: "行動代號：解碼",
        difficulty: 3.0,
        english: "Intel Visualization",
        department: "情報部",
        departmentColor: "text-cyan-500 bg-cyan-500/10 border-cyan-500/30",
        icon: <PieChart size={32} className="text-cyan-500" />,
        desc: "將雜亂情報解碼，配對成最高效的視覺化圖表！",
        learningObjective: "統計圖表選擇與資訊呈現最佳化",
        path: "/game/chart-matcher",
        status: "active"
    },
    {
        caseCode: 'CASE #06',
        tags: ['W14', '數據解讀', '批判思考'],
        id: 'data-detective',
        title: "行動代號：濾鏡",
        difficulty: 5.0,
        english: "Truth Filter",
        department: "重案部",
        departmentColor: "text-emerald-500 bg-emerald-500/10 border-emerald-500/30",
        icon: <Bug size={32} className="text-emerald-500" />,
        desc: "數字會說話，但有時候會說謊。戴上真相濾鏡，識破樣本偏差、倖存者偏差、辛普森悖論等數據陷阱。學習從客觀數據中得出穩健的結論。",
        learningObjective: "客觀數據解讀與批判性思維培養",
        path: "/game/data-detective",
        status: "active"
    }
];

// 渲染難度星星小組件
const DifficultyStars = ({ rating }) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
        if (i < fullStars) {
            stars.push(<Star key={i} size={12} className="fill-amber-400 text-amber-400 drop-shadow-[0_0_2px_rgba(245,158,11,0.5)]" />);
        } else if (i === fullStars && hasHalfStar) {
            stars.push(<StarHalf key={i} size={12} className="fill-amber-400 text-amber-400 drop-shadow-[0_0_2px_rgba(245,158,11,0.5)]" />);
        } else {
            stars.push(<Star key={i} size={12} className="text-slate-700/80" />);
        }
    }

    return (
        <div className="flex items-center gap-1.5 bg-slate-950/60 px-2 py-1 rounded-sm border border-slate-700/50 shadow-inner group-hover:border-amber-500/30 transition-colors shrink-0">
            <span className="text-[9px] font-black text-slate-500 tracking-widest uppercase mb-[1px]">挑戰難度</span>
            <div className="flex items-center gap-0.5">{stars}</div>
            <span className="text-xs font-black text-amber-500 ml-1">{rating.toFixed(1)}</span>
        </div>
    );
};

export const GameHub = () => {
    const navigate = useNavigate();
    const [agentName, setAgentName] = useState('');
    const [inputName, setInputName] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // 啟動時從 localStorage 讀取探員名稱
    useEffect(() => {
        const savedName = localStorage.getItem('rib_agent_name');
        if (savedName) {
            setAgentName(savedName);
            setIsLoggedIn(true);
        }
    }, []);

    const handleLogin = (e) => {
        e.preventDefault();
        if (inputName.trim()) {
            localStorage.setItem('rib_agent_name', inputName.trim());
            setAgentName(inputName.trim());
            setIsLoggedIn(true);
            setInputName('');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('rib_agent_name');
        setAgentName('');
        setIsLoggedIn(false);
    };

    const navigateToMission = (path) => {
        if (!isLoggedIn) {
            alert("請先完成探員報到手續！");
            return;
        }
        navigate(path);
    };

    return (
        <div className="min-h-screen bg-[url('/images/game_hub_bg.png')] bg-cover bg-center bg-fixed font-sans text-slate-200 p-4 md:p-8 relative">
            <div className="absolute inset-0 bg-slate-900/85 backdrop-blur-none z-0"></div>
            <div className="max-w-6xl mx-auto relative z-10">

                {/* 總部標題區 */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-slate-700/50 pb-6 mb-8 gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <ShieldAlert size={40} className="text-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.6)]" />
                            <h1 className="text-4xl md:text-5xl font-['Noto_Serif_TC',serif] font-bold text-slate-100 mb-4 tracking-tight drop-shadow-md">
                                R.I.B. 特務指揮中心
                            </h1>
                            <p className="text-amber-400 font-mono text-sm md:text-base tracking-[0.2em] uppercase font-bold text-shadow-sm">
                                Research Investigation Bureau / 機密任務總覽
                            </p>
                        </div>
                        {/* Progress Bar Component */}
                        <div className="mt-8 max-w-sm">
                            <div className="flex justify-between text-[11px] font-mono tracking-widest mb-3">
                                <span className="text-slate-400">總進度</span>
                                <span className="text-amber-500 font-bold">0 / 6 案件完成</span>
                            </div>
                            <div className="h-1.5 bg-slate-800 rounded-sm overflow-hidden border border-slate-700/50 relative">
                                <div className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-amber-600 to-amber-400 w-[0%] transition-all duration-1000" style={{ boxShadow: '0 0 10px rgba(245,158,11,0.5)' }}></div>
                            </div>
                        </div>
                    </div>

                    {/* 登入狀態儀表板 */}
                    <div className="bg-slate-900/80 p-5 rounded-sm border-t-[4px] border-amber-500 shadow-[0_0_30px_rgba(0,0,0,0.6)] min-w-[300px] backdrop-blur-sm relative overflow-hidden">
                        <div className="absolute -right-4 -top-4 text-amber-500/10">
                            <ShieldAlert size={100} />
                        </div>
                        {!isLoggedIn ? (
                            <form onSubmit={handleLogin} className="flex flex-col gap-3 relative z-10">
                                <label className="text-xs font-black text-amber-500 uppercase tracking-widest flex items-center gap-1 font-mono">
                                    <Activity size={14} className="animate-pulse" /> 系統存取權限受限
                                </label>
                                <input
                                    type="text"
                                    value={inputName}
                                    onChange={(e) => setInputName(e.target.value)}
                                    placeholder="輸入探員姓名..."
                                    className="bg-slate-950/80 border border-slate-700 rounded-sm px-4 py-2.5 text-white focus:outline-none focus:border-amber-500 font-bold shadow-inner placeholder-slate-600 transition-colors"
                                />
                                <button
                                    type="submit"
                                    disabled={!inputName.trim()}
                                    className="bg-amber-600 hover:bg-amber-500 disabled:bg-slate-800 disabled:text-slate-600 disabled:border-slate-700 text-slate-950 font-black py-2.5 rounded-sm flex items-center justify-center gap-2 transition-all shadow-[0_0_10px_rgba(245,158,11,0.2)] disabled:shadow-none border border-amber-500/50"
                                >
                                    <LogIn size={18} /> 辦理報到手續
                                </button>
                            </form>
                        ) : (
                            <div className="flex flex-col gap-3 relative z-10">
                                <div className="text-xs font-black text-emerald-400 uppercase tracking-widest flex items-center gap-1 font-mono">
                                    <Activity size={14} className="animate-pulse" /> 安全連線已建立
                                </div>
                                <div className="flex items-center gap-3 bg-slate-950/80 p-3 rounded-sm border border-slate-700/80 shadow-inner">
                                    <div className="bg-emerald-950/50 p-2.5 rounded-sm text-emerald-400 border border-emerald-500/20">
                                        <UserCircle2 size={24} />
                                    </div>
                                    <div>
                                        <div className="text-[10px] text-slate-500 font-black tracking-widest mb-0.5">目前登入身分</div>
                                        <div className="text-xl font-black text-emerald-400 drop-shadow-[0_0_5px_currentColor]">{agentName} <span className="text-sm text-emerald-600">探員</span></div>
                                    </div>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="text-slate-500 hover:text-rose-400 text-xs font-bold flex items-center justify-center gap-1 mt-2 transition-colors uppercase tracking-widest"
                                >
                                    <LogOut size={14} /> 登出並清除紀錄
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* 歡迎訊息 */}
                {isLoggedIn && (
                    <div className="bg-emerald-950/40 border border-emerald-500/30 p-5 rounded-sm mb-8 flex items-start gap-4 backdrop-blur-sm shadow-[0_0_20px_rgba(16,185,129,0.1)]">
                        <div className="bg-emerald-500/20 p-3 rounded-sm text-emerald-400 shrink-0 border border-emerald-500/30 flex items-center justify-center">
                            <ShieldAlert size={24} />
                        </div>
                        <div>
                            <h3 className="text-emerald-400 font-['Noto_Serif_TC',serif] font-bold text-xl leading-tight mb-2 tracking-wide drop-shadow-[0_0_5px_currentColor]">歡迎歸隊，{agentName}。</h3>
                            <p className="text-slate-300 text-sm font-medium leading-relaxed">目前局內三大部門皆有緊急積案，請盡速閱覽下方機密檔案夾並展開調查。</p>
                        </div>
                    </div>
                )}
                {!isLoggedIn && (
                    <div className="bg-amber-950/40 border-l-[6px] border-amber-500/80 border-y border-r border-slate-700/50 p-5 rounded-sm mb-8 flex items-start gap-4 backdrop-blur-sm shadow-[0_0_20px_rgba(245,158,11,0.1)]">
                        <div className="bg-amber-500/20 p-3 rounded-sm text-amber-500 shrink-0 border border-amber-500/30 flex items-center justify-center">
                            <ShieldAlert size={24} />
                        </div>
                        <div>
                            <h3 className="text-amber-500 font-['Noto_Serif_TC',serif] font-bold text-xl leading-tight mb-2 tracking-wide drop-shadow-[0_0_5px_currentColor]">身分未驗證</h3>
                            <p className="text-slate-300 text-sm font-medium leading-relaxed">請先在右上角【辦理報到手續】，方可解鎖總部內所有的機密調查任務。</p>
                        </div>
                    </div>
                )}

                {/* 任務檔案庫 Grid */}
                <div className="relative max-w-6xl mx-auto py-10 mt-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10 relative z-10 w-full">
                        {RIB_MISSIONS.map((mission, index) => {
                            const missionNumber = String(index + 1).padStart(2, '0');
                            return (
                                <div key={mission.id} className="w-full flex">

                                    {/* 卡片容器 */}
                                    <div className="w-full flex h-full">
                                        <div
                                            onClick={() => navigateToMission(mission.path)}
                                            className={`w-full group relative bg-gradient-to-br from-slate-900 to-slate-950 rounded-sm p-6 border transition-all duration-300 flex flex-col h-full overflow-hidden shadow-xl ${isLoggedIn
                                                ? 'border-slate-800 hover:border-amber-500/40 cursor-pointer hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.8),0_0_0_1px_rgba(245,158,11,0.2)]'
                                                : 'border-slate-800/50 opacity-60 grayscale cursor-not-allowed'
                                                }`}
                                        >
                                            {/* Top Accent Line */}
                                            {isLoggedIn && (
                                                <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-amber-500 to-amber-600 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out z-20"></div>
                                            )}

                                            {/* Hover effect gradient overlay */}
                                            {isLoggedIn && (
                                                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0"></div>
                                            )}

                                            {/* ACTIVE / LOCKED Stamp */}
                                            {isLoggedIn ? (
                                                <div className="absolute top-20 right-8 sm:top-20 sm:right-28 border-2 border-amber-500/30 text-amber-500/40 font-mono text-[10px] sm:text-xs font-black tracking-[4px] px-2 py-0.5 -rotate-[15deg] z-0 group-hover:border-amber-500 group-hover:text-amber-500 transition-colors shadow-[0_0_10px_rgba(245,158,11,0)] group-hover:shadow-[0_0_15px_rgba(245,158,11,0.2)] pointer-events-none opacity-60 group-hover:opacity-100 scale-90 sm:scale-100">
                                                    ACTIVE
                                                </div>
                                            ) : (
                                                <div className="absolute top-20 right-8 sm:top-20 sm:right-28 border-2 border-slate-700 text-slate-600 font-mono text-[10px] sm:text-xs font-black tracking-[4px] px-2 py-0.5 -rotate-[15deg] z-0 pointer-events-none opacity-60 scale-90 sm:scale-100">
                                                    LOCKED
                                                </div>
                                            )}

                                            {/* 巨大編號浮水印底圖 */}
                                            <div className="absolute -bottom-4 -right-2 text-[120px] font-black font-mono text-slate-800/20 leading-none z-0 pointer-events-none select-none">
                                                {missionNumber}
                                            </div>

                                            {/* Department Badge */}
                                            <div className="flex justify-between items-start mb-5 relative z-10">
                                                <div className="flex flex-col gap-2">
                                                    <span className="font-mono text-[10px] text-slate-500 tracking-[3px] border border-slate-700/60 px-2 py-0.5 rounded-sm self-start bg-slate-900/50 shadow-inner">{mission.caseCode}</span>
                                                    <div className={`px-3 py-1 rounded-sm text-[10px] font-black tracking-[0.2em] border shadow-sm self-start ${mission.departmentColor}`}>
                                                        {mission.department}
                                                    </div>
                                                </div>
                                                <div className={`p-3.5 rounded-sm bg-slate-950/80 shadow-inner group-hover:scale-110 transition-transform border border-slate-700/50 ${isLoggedIn ? 'text-slate-300 group-hover:text-amber-400' : 'text-slate-600'}`}>
                                                    {mission.icon}
                                                </div>
                                            </div>

                                            {/* Title & Desc */}
                                            <div className="mb-6 flex-1 relative z-10">
                                                <div className="text-[10px] font-black text-slate-500 tracking-[0.2em] uppercase mb-2 bg-slate-950/40 inline-block px-2 py-1 rounded-sm truncate max-w-full self-start">{mission.english}</div>
                                                <h3 className={`text-2xl font-['Noto_Serif_TC',serif] font-bold mb-2 ${isLoggedIn ? 'text-slate-100 group-hover:text-amber-400 transition-colors drop-shadow-sm' : 'text-slate-400'}`}>
                                                    {mission.title}
                                                </h3>
                                                <div className="mb-3 inline-block">
                                                    <DifficultyStars rating={mission.difficulty} />
                                                </div>
                                                <div className={`text-[11px] font-bold mb-3 inline-block px-2.5 py-1 rounded-sm border tracking-wider mt-1 ${isLoggedIn ? 'bg-indigo-950/30 text-indigo-300 border-indigo-500/30' : 'bg-slate-800 text-slate-500 border-slate-700'}`}>
                                                    🎯 {mission.learningObjective}
                                                </div>
                                                <p className="text-slate-400 text-sm font-medium leading-relaxed group-hover:text-slate-300 transition-colors mt-2">
                                                    {mission.desc}
                                                </p>
                                            </div>

                                            {/* Action Button & Tags */}
                                            <div className="pt-5 mt-auto border-t border-slate-800/60 flex flex-col gap-4 relative z-10">
                                                {/* Tags Row */}
                                                <div className="flex flex-wrap gap-2">
                                                    {mission.tags.map((tag, i) => (
                                                        <span key={i} className="bg-slate-900/80 border border-slate-700/50 text-slate-400 text-[10px] font-bold px-2 py-0.5 rounded-sm tracking-wide shadow-inner">#{tag}</span>
                                                    ))}
                                                </div>

                                                <div className="flex items-center justify-between w-full">
                                                    <span className="text-[10px] font-mono text-slate-600 tracking-wider">FILE: {mission.id.split('-').join('_').toUpperCase()}</span>
                                                    {isLoggedIn ? (
                                                        <div className="flex items-center gap-2 text-sm font-black text-amber-500 group-hover:translate-x-2 transition-transform tracking-widest bg-amber-950/20 hover:bg-amber-900/40 px-3 py-1.5 rounded-sm border border-amber-500/20 backdrop-blur-sm">
                                                            解密檔案 <ArrowRight size={16} />
                                                        </div>
                                                    ) : (
                                                        <div className="text-xs font-bold text-slate-500 tracking-widest bg-slate-900/80 px-3 py-1.5 rounded-sm border border-slate-800">
                                                            🔒 權限不足
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

            </div>
        </div>
    );
};
