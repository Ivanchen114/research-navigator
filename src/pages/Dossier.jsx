import React, { useState, useEffect } from 'react';
import {
    User,
    Target,
    ShieldCheck,
    Zap,
    BarChart3,
    Brain,
    Award,
    ChevronRight,
    TrendingUp,
    Clock,
    LogOut,
    ShieldAlert,
    Ghost,
    Radio,
    Star,
    Circle,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Dossier = () => {
    const navigate = useNavigate();
    const [agentName, setAgentName] = useState("");
    const [gameStats, setGameStats] = useState({});
    const [skills, setSkills] = useState({
        focus: 0,
        ethics: 0,
        logic: 0,
        rigor: 0,
        visual: 0,
        critical: 0
    });
    const [storyStats, setStoryStats] = useState({
        phantom: [null, null, null, null, null], // 'optimal' | 'complete' | null
        echo:    [null, null, null, null, null]
    });

    useEffect(() => {
        const name = localStorage.getItem('rib_agent_name');
        if (!name) {
            navigate('/games'); // Redirect to login if no name
            return;
        }
        setAgentName(name);

        // Load game scores
        const games = [
            { id: 'question-er', skill: 'focus' },
            { id: 'citation-detective', skill: 'ethics' },
            { id: 'tool-quiz', skill: 'logic' },
            { id: 'rx-inspector', skill: 'rigor' },
            { id: 'chart-matcher', skill: 'visual' },
            { id: 'data-detective', skill: 'critical' }
        ];

        const stats = {};
        const newSkills = { focus: 0, ethics: 0, logic: 0, rigor: 0, visual: 0, critical: 0 };

        games.forEach(g => {
            const data = localStorage.getItem(`rib_score_${g.id}`);
            if (data) {
                const parsed = JSON.parse(data);
                stats[g.id] = parsed;
                // Calculate percentage (0-100)
                const percent = Math.round((parsed.score / parsed.maxScore) * 100);
                newSkills[g.skill] = percent;
            }
        });

        setGameStats(stats);
        setSkills(newSkills);

        // 讀取連貫劇情完成與完美旗標
        const readStory = (prefix) => {
            return [1, 2, 3, 4, 5].map(n => {
                if (localStorage.getItem(`${prefix}_ch${n}_optimal`) === 'true') return 'optimal';
                if (localStorage.getItem(`${prefix}_ch${n}_complete`) === 'true') return 'complete';
                return null;
            });
        };
        setStoryStats({
            phantom: readStory('phantom'),
            echo:    readStory('echo')
        });
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('rib_agent_name');
        navigate('/games');
    };

    const getAgentRank = () => {
        // 「過關」= 該遊戲分數 >= 滿分 60%（不再把「有玩過」當過關）
        const passedCount = Object.values(gameStats).filter(g => {
            if (!g || !g.maxScore) return false;
            return (g.score / g.maxScore) >= 0.6;
        }).length;
        const optimalChapters =
            storyStats.phantom.filter(s => s === 'optimal').length +
            storyStats.echo.filter(s => s === 'optimal').length;
        // 六項挑戰全過關 + 十章劇情全完美 → 最高軍階
        if (passedCount === 6 && optimalChapters === 10) return "特務首長 (Commander)";
        if (passedCount === 6 && optimalChapters >= 5)   return "首席探員 (Master Agent)";
        if (passedCount === 6) return "特級專案調查官 (Elite)";
        if (passedCount >= 4 || optimalChapters >= 5) return "高級探員 (Senior Agent)";
        if (passedCount >= 2 || optimalChapters >= 2) return "正式探員 (Field Agent)";
        return "見習探員 (Trainee)";
    };

    const storyChapterMeta = {
        phantom: {
            label: '幽靈數據',
            icon: Ghost,
            color: 'text-violet-500',
            bg: 'bg-violet-500',
            chapters: ['觀察', '訪談', '問卷', '文獻', '實驗']
        },
        echo: {
            label: '回音行動',
            icon: Radio,
            color: 'text-cyan-500',
            bg: 'bg-cyan-500',
            chapters: ['觀察', '訪談', '問卷', '文獻', '實驗']
        }
    };

    const StoryRow = ({ seriesKey }) => {
        const meta = storyChapterMeta[seriesKey];
        const Icon = meta.icon;
        const statuses = storyStats[seriesKey];
        const optimalCount = statuses.filter(s => s === 'optimal').length;
        const completeCount = statuses.filter(s => s !== null).length;
        return (
            <div className="mb-4 last:mb-0">
                <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                        <Icon size={14} className={meta.color} />
                        {meta.label}
                    </div>
                    <span className="text-xs font-mono font-bold text-slate-400">
                        {optimalCount}/5 完美 · {completeCount}/5 通關
                    </span>
                </div>
                <div className="flex gap-1.5">
                    {statuses.map((s, i) => {
                        const base = "flex-1 h-10 rounded-sm border flex flex-col items-center justify-center text-[10px] font-bold transition-all";
                        if (s === 'optimal') {
                            return (
                                <div key={i} className={`${base} ${meta.bg} text-white border-transparent shadow-sm`} title={`Ch${i+1} 完美通關`}>
                                    <Star size={12} fill="currentColor" />
                                    <span className="mt-[-2px]">Ch{i+1}</span>
                                </div>
                            );
                        }
                        if (s === 'complete') {
                            return (
                                <div key={i} className={`${base} bg-white ${meta.color} border-slate-200`} title={`Ch${i+1} 已通關`}>
                                    <Circle size={10} fill="currentColor" />
                                    <span className="mt-[-2px]">Ch{i+1}</span>
                                </div>
                            );
                        }
                        return (
                            <div key={i} className={`${base} bg-slate-50 text-slate-300 border-slate-100 border-dashed`} title={`Ch${i+1} 尚未嘗試`}>
                                <Circle size={10} />
                                <span className="mt-[-2px]">Ch{i+1}</span>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    const SkillBar = ({ label, value, icon: Icon, textColor, bgColor }) => (
        <div className="mb-4">
            <div className="flex justify-between items-center mb-1">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                    <div className={`p-1.5 rounded ${textColor}`}>
                        <Icon size={14} />
                    </div>
                    {label}
                </div>
                <span className="text-xs font-mono font-bold text-slate-400">{value}%</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                    className={`h-full transition-all duration-1000 ${bgColor}`}
                    style={{ width: `${value}%` }}
                ></div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#f3f4f6] py-12 px-4 md:px-8 font-sans text-slate-900">
            <div className="max-w-5xl mx-auto">
                
                {/* Profile Header */}
                <div className="bg-white rounded-sm shadow-sm border border-slate-200 overflow-hidden mb-8">
                    <div className="h-32 bg-slate-900 relative">
                        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "20px 20px" }}></div>
                        <div className="absolute -bottom-14 left-8 flex items-end gap-6">
                            <div className="w-24 h-24 bg-indigo-600 rounded-sm border-4 border-white flex items-center justify-center shadow-lg">
                                <User size={48} className="text-white" />
                            </div>
                            <div className="pb-1">
                                <h1 className="text-2xl font-black tracking-tight text-slate-900">{agentName}</h1>
                                <p className="text-indigo-600 font-bold text-sm tracking-widest uppercase flex items-center gap-2 mt-0.5">
                                    <ShieldCheck size={14} /> {getAgentRank()}
                                </p>
                            </div>
                        </div>
                        <div className="absolute top-4 right-4">
                            <button
                                onClick={handleLogout}
                                className="bg-white/10 hover:bg-white/20 text-white/60 hover:text-white px-3 py-1 rounded text-xs transition-all flex items-center gap-2 border border-white/10"
                            >
                                <LogOut size={12} /> 登出身分
                            </button>
                        </div>
                    </div>
                    <div className="h-20"></div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    {/* Left Column: Skills & Ranks */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-white p-6 rounded-sm shadow-sm border border-slate-200">
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                                <TrendingUp size={14} /> 探員素質分析
                            </h3>
                            <SkillBar label="問題意識" value={skills.focus} icon={Target} textColor="text-rose-500" bgColor="bg-rose-500" />
                            <SkillBar label="倫理審查" value={skills.ethics} icon={ShieldAlert} textColor="text-emerald-500" bgColor="bg-emerald-500" />
                            <SkillBar label="研究邏輯" value={skills.logic} icon={Brain} textColor="text-amber-500" bgColor="bg-amber-500" />
                            <SkillBar label="設計嚴謹" value={skills.rigor} icon={ShieldCheck} textColor="text-indigo-500" bgColor="bg-indigo-500" />
                            <SkillBar label="數據呈現" value={skills.visual} icon={BarChart3} textColor="text-cyan-500" bgColor="bg-cyan-500" />
                            <SkillBar label="批判思考" value={skills.critical} icon={Zap} textColor="text-purple-500" bgColor="bg-purple-500" />
                        </div>

                        {/* 連貫劇情勳章 */}
                        <div className="bg-white p-6 rounded-sm shadow-sm border border-slate-200">
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-5 flex items-center gap-2">
                                <Star size={14} /> 劇情任務紀錄
                            </h3>
                            <StoryRow seriesKey="phantom" />
                            <StoryRow seriesKey="echo" />
                            <p className="text-[10px] text-slate-400 mt-3 leading-relaxed">
                                ★ 完美通關（拿到關鍵線索）　○ 普通通關　虛線 = 尚未挑戰
                            </p>
                        </div>

                        <div className="bg-slate-900 p-6 rounded-sm shadow-xl text-white relative overflow-hidden">
                            <div className="absolute -right-4 -bottom-4 opacity-10 text-8xl">🏅</div>
                            <h3 className="text-xs font-black text-indigo-400 uppercase tracking-[0.2em] mb-4">解鎖成就</h3>
                            <div className="flex flex-wrap gap-3">
                                {Object.keys(gameStats).length > 0 ? (
                                    Object.keys(gameStats).map(id => (
                                        <div key={id} className="w-10 h-10 bg-indigo-500/20 border border-indigo-500/40 rounded flex items-center justify-center text-xl" title={id}>
                                            {id === 'question-er' && '🎯'}
                                            {id === 'citation-detective' && '🦊'}
                                            {id === 'tool-quiz' && '⚙️'}
                                            {id === 'rx-inspector' && '🛡️'}
                                            {id === 'chart-matcher' && '📊'}
                                            {id === 'data-detective' && '🔍'}
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-xs text-slate-500 italic">尚未獲得任何勳章...</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Game Records */}
                    <div className="lg:col-span-8 space-y-6">
                        <div className="bg-white p-8 rounded-sm shadow-sm border border-slate-200 h-full">
                            <div className="flex justify-between items-center mb-8 border-b border-slate-100 pb-4">
                                <h2 className="text-xl font-black flex items-center gap-3">
                                    <Award size={24} className="text-indigo-600" /> 任務執行紀錄
                                </h2>
                                <span className="text-xs font-bold text-slate-400 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                                    累積得分：{Object.values(gameStats).reduce((sum, g) => sum + g.score, 0)}
                                </span>
                            </div>

                            <div className="space-y-4">
                                {Object.keys(gameStats).length === 0 ? (
                                    <div className="text-center py-20 bg-slate-50 rounded-sm border-2 border-dashed border-slate-100">
                                        <Clock size={48} className="mx-auto text-slate-200 mb-4" />
                                        <p className="text-slate-400 font-bold">目前尚無出勤紀錄</p>
                                        <button 
                                            onClick={() => navigate('/games')}
                                            className="mt-4 text-indigo-600 font-bold hover:underline"
                                        >
                                            立即前往任務中心 →
                                        </button>
                                    </div>
                                ) : (
                                    Object.entries(gameStats).map(([id, data]) => {
                                        const gameInfo = {
                                            'question-er': { title: '行動代號：靶心', color: 'bg-rose-500' },
                                            'citation-detective': { title: '行動代號：獵狐', color: 'bg-emerald-500' },
                                            'tool-quiz': { title: '行動代號：裝備', color: 'bg-amber-500' },
                                            'rx-inspector': { title: '行動代號：防線', color: 'bg-indigo-500' },
                                            'chart-matcher': { title: '行動代號：解碼', color: 'bg-cyan-500' },
                                            'data-detective': { title: '行動代號：濾鏡', color: 'bg-purple-500' }
                                        }[id] || { title: id, color: 'bg-slate-500' };

                                        return (
                                            <div key={id} className="flex items-center gap-4 p-4 rounded-sm border border-slate-100 hover:bg-slate-50 transition-colors group">
                                                <div className={`w-2 h-12 ${gameInfo.color} rounded-full`}></div>
                                                <div className="flex-1">
                                                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">{id}</div>
                                                    <div className="font-bold text-slate-800">{gameInfo.title}</div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-lg font-black text-slate-900">{data.score} <span className="text-xs text-slate-400 font-normal">/ {data.maxScore}</span></div>
                                                    <div className="text-[10px] text-slate-400 font-mono tracking-tighter">{data.date}</div>
                                                </div>
                                                <ChevronRight size={16} className="text-slate-200 group-hover:text-indigo-400 transition-colors" />
                                            </div>
                                        );
                                    })
                                )}
                            </div>

                            <div className="mt-12 bg-indigo-50 p-6 rounded-sm border border-indigo-100 flex items-center justify-between">
                                <div>
                                    <h4 className="font-black text-indigo-900">學期結業預判</h4>
                                    <p className="text-sm text-indigo-600/70">目前進度已達成總課程量的 {Math.round((Object.keys(gameStats).length / 6) * 100)}%</p>
                                </div>
                                <button 
                                    onClick={() => navigate('/games')}
                                    className="bg-indigo-600 text-white px-6 py-2 rounded-sm font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all"
                                >
                                    繼續執行任務
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
