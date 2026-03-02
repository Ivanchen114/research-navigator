import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ShieldAlert, Search, Stethoscope, BriefcaseMedical,
    BarChart3, PieChart, UserCircle2, LogIn, LogOut,
    Activity, ArrowRight, BookOpen, Bug
} from 'lucide-react';

// 定義六大任務卡片資料
const RIB_MISSIONS = [
    {
        id: 'question-er',
        title: "行動代號：靶心",
        english: "Operation: Bullseye",
        department: "法醫部",
        departmentColor: "text-rose-500 bg-rose-500/10 border-rose-500/30",
        icon: <Stethoscope size={32} className="text-rose-500" />,
        desc: "搶救方向錯誤、範圍膨脹的瀕死研究問題！",
        learningObjective: "研究問題精煉與對焦訓練",
        path: "/game/question-er",
        status: "active"
    },
    {
        id: 'tool-quiz',
        title: "裝備檢定測試",
        english: "Gear Check Protocol",
        department: "重案部",
        departmentColor: "text-amber-500 bg-amber-500/10 border-amber-500/30",
        icon: <Search size={32} className="text-amber-500" />,
        desc: "抵達案發現場，迅速拔出最適合的辦案道具！",
        learningObjective: "研究工具與資料蒐集方法辨識",
        path: "/game/tool-quiz",
        status: "active"
    },
    {
        id: 'citation-detective',
        title: "獵狐行動",
        english: "Operation: Foxhunt",
        department: "重案部",
        departmentColor: "text-emerald-500 bg-emerald-500/10 border-emerald-500/30",
        icon: <BookOpen size={32} className="text-emerald-500" />,
        desc: "審問可疑文獻，揪出換字抄襲與孤兒引用的罪犯！",
        learningObjective: "文獻真偽辨識與學術倫理審查",
        path: "/game/citation-detective",
        status: "active"
    },
    {
        id: 'rx-inspector',
        title: "行動代號：防線",
        english: "Operation: Defense",
        department: "法醫部",
        departmentColor: "text-rose-500 bg-rose-500/10 border-rose-500/30",
        icon: <BriefcaseMedical size={32} className="text-rose-500" />,
        desc: "找出問卷、訪談、實驗設計中的致命副作用！",
        learningObjective: "研究設計與方法學避險測試",
        path: "/game/rx-inspector",
        status: "active"
    },
    {
        id: 'data-detective',
        title: "真相濾鏡",
        english: "Truth Filter",
        department: "重案部",
        departmentColor: "text-emerald-500 bg-emerald-500/10 border-emerald-500/30",
        icon: <Bug size={32} className="text-emerald-500" />,
        desc: "不被統計表象欺騙，精準分辨事實與主觀妄想！",
        learningObjective: "客觀數據解讀與批判性思維培養",
        path: "/game/data-detective",
        status: "active"
    },
    {
        id: 'chart-matcher',
        title: "情報視覺化",
        english: "Intel Visualization",
        department: "情報部",
        departmentColor: "text-cyan-500 bg-cyan-500/10 border-cyan-500/30",
        icon: <PieChart size={32} className="text-cyan-500" />,
        desc: "將雜亂情報解碼，配對成最高效的視覺化圖表！",
        learningObjective: "統計圖表選擇與資訊呈現最佳化",
        path: "/game/chart-matcher",
        status: "active"
    }
];

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
                            <h1 className="text-4xl md:text-5xl font-black text-white tracking-widest drop-shadow-[0_0_10px_rgba(255,255,255,0.3)] font-mono">R.I.B.</h1>
                        </div>
                        <h2 className="text-xl md:text-2xl font-bold text-slate-300 tracking-[0.2em]">研究調查局 <span className="text-sm text-slate-500">(Research Investigation Bureau)</span></h2>
                        <p className="text-amber-500/80 mt-2 font-black tracking-widest text-sm bg-amber-950/40 inline-block px-3 py-1 rounded-md border border-amber-500/20">特務指揮中心 / 機密任務總覽</p>
                    </div>

                    {/* 登入狀態儀表板 */}
                    <div className="bg-slate-900/80 p-5 rounded-2xl border-t-[4px] border-amber-500 shadow-[0_0_30px_rgba(0,0,0,0.6)] min-w-[300px] backdrop-blur-sm relative overflow-hidden">
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
                                    className="bg-slate-950/80 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-amber-500 font-bold shadow-inner placeholder-slate-600 transition-colors"
                                />
                                <button
                                    type="submit"
                                    disabled={!inputName.trim()}
                                    className="bg-amber-600 hover:bg-amber-500 disabled:bg-slate-800 disabled:text-slate-600 disabled:border-slate-700 text-slate-950 font-black py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all shadow-[0_0_10px_rgba(245,158,11,0.2)] disabled:shadow-none border border-amber-500/50"
                                >
                                    <LogIn size={18} /> 辦理報到手續
                                </button>
                            </form>
                        ) : (
                            <div className="flex flex-col gap-3 relative z-10">
                                <div className="text-xs font-black text-emerald-400 uppercase tracking-widest flex items-center gap-1 font-mono">
                                    <Activity size={14} className="animate-pulse" /> 安全連線已建立
                                </div>
                                <div className="flex items-center gap-3 bg-slate-950/80 p-3 rounded-xl border border-slate-700/80 shadow-inner">
                                    <div className="bg-emerald-950/50 p-2.5 rounded-full text-emerald-400 border border-emerald-500/20">
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
                    <div className="bg-emerald-950/40 border border-emerald-500/30 p-5 rounded-2xl mb-8 flex items-start gap-4 backdrop-blur-sm shadow-[0_0_20px_rgba(16,185,129,0.1)]">
                        <div className="bg-emerald-500/20 p-3 rounded-full text-emerald-400 shrink-0 border border-emerald-500/30 flex items-center justify-center">
                            <ShieldAlert size={24} />
                        </div>
                        <div>
                            <h3 className="text-emerald-400 font-black text-xl leading-tight mb-2 tracking-wide drop-shadow-[0_0_5px_currentColor]">歡迎歸隊，{agentName}。</h3>
                            <p className="text-slate-300 text-sm font-medium leading-relaxed">目前局內三大部門皆有緊急積案，請盡速閱覽下方機密檔案夾並展開調查。</p>
                        </div>
                    </div>
                )}
                {!isLoggedIn && (
                    <div className="bg-amber-950/40 border-l-[6px] border-amber-500/80 border-y border-r border-slate-700/50 p-5 rounded-2xl mb-8 flex items-start gap-4 backdrop-blur-sm shadow-[0_0_20px_rgba(245,158,11,0.1)]">
                        <div className="bg-amber-500/20 p-3 rounded-full text-amber-500 shrink-0 border border-amber-500/30 flex items-center justify-center">
                            <ShieldAlert size={24} />
                        </div>
                        <div>
                            <h3 className="text-amber-500 font-black text-xl leading-tight mb-2 tracking-wide drop-shadow-[0_0_5px_currentColor]">身分未驗證</h3>
                            <p className="text-slate-300 text-sm font-medium leading-relaxed">請先在右上角【辦理報到手續】，方可解鎖總部內所有的機密調查任務。</p>
                        </div>
                    </div>
                )}

                {/* 任務檔案庫 Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {RIB_MISSIONS.map((mission) => (
                        <div
                            key={mission.id}
                            onClick={() => navigateToMission(mission.path)}
                            className={`group relative bg-slate-900/60 rounded-3xl p-6 border transition-all duration-300 flex flex-col h-full backdrop-blur-md overflow-hidden
                                ${isLoggedIn
                                    ? 'border-slate-700 hover:border-amber-500/50 hover:bg-slate-800/80 cursor-pointer hover:-translate-y-2 hover:shadow-[0_15px_40px_rgba(0,0,0,0.6)]'
                                    : 'border-slate-800/50 opacity-60 grayscale cursor-not-allowed'
                                }`}
                        >
                            {/* Hover effect gradient overlay */}
                            {isLoggedIn && (
                                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                            )}

                            {/* Department Badge */}
                            <div className="flex justify-between items-start mb-6 relative z-10">
                                <div className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-[0.2em] border shadow-sm ${mission.departmentColor}`}>
                                    {mission.department}
                                </div>
                                <div className={`p-3.5 rounded-2xl bg-slate-950/80 shadow-inner group-hover:scale-110 transition-transform border border-slate-700/50 ${isLoggedIn ? 'text-slate-300 group-hover:text-amber-400' : 'text-slate-600'}`}>
                                    {mission.icon}
                                </div>
                            </div>

                            {/* Title & Desc */}
                            <div className="mb-6 flex-1 relative z-10">
                                <div className="text-[10px] font-black text-slate-500 tracking-[0.2em] uppercase mb-2 bg-slate-950/40 inline-block px-2 py-1 rounded truncate max-w-full">{mission.english}</div>
                                <h3 className={`text-2xl font-black mb-3 ${isLoggedIn ? 'text-slate-100 group-hover:text-amber-400 transition-colors drop-shadow-sm' : 'text-slate-400'}`}>
                                    {mission.title}
                                </h3>
                                <div className={`text-xs font-bold mb-3 inline-block px-2.5 py-1 rounded border tracking-wider ${isLoggedIn ? 'bg-indigo-950/30 text-indigo-300 border-indigo-500/30' : 'bg-slate-800 text-slate-500 border-slate-700'}`}>
                                    🎯 {mission.learningObjective}
                                </div>
                                <p className="text-slate-400 text-sm font-medium leading-relaxed group-hover:text-slate-300 transition-colors">
                                    {mission.desc}
                                </p>
                            </div>

                            {/* Action Button */}
                            <div className="pt-5 border-t border-slate-700/50 flex items-center justify-between relative z-10">
                                <span className="text-[10px] font-mono text-slate-600 tracking-wider">FILE: {mission.id.split('-').join('_').toUpperCase()}</span>
                                {isLoggedIn ? (
                                    <div className="flex items-center gap-2 text-sm font-black text-amber-500 group-hover:translate-x-2 transition-transform tracking-widest bg-amber-950/30 px-3 py-1.5 rounded-lg border border-amber-500/20">
                                        查閱檔案 <ArrowRight size={16} />
                                    </div>
                                ) : (
                                    <div className="text-xs font-bold text-slate-500 tracking-widest bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
                                        🔒 權限不足
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
};
