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

    // 計算 hero 上要放的小統計
    const totalScore = Object.values(gameStats).reduce((sum, g) => sum + (g?.score || 0), 0);
    const passedGames = Object.values(gameStats).filter(g => g && g.maxScore && (g.score / g.maxScore) >= 0.6).length;
    const optimalChaptersCount =
        storyStats.phantom.filter(s => s === 'optimal').length +
        storyStats.echo.filter(s => s === 'optimal').length;
    const completeChaptersCount =
        storyStats.phantom.filter(s => s !== null).length +
        storyStats.echo.filter(s => s !== null).length;

    return (
        <div className="min-h-screen bg-[#f8f7f4] py-8 md:py-12 px-4 md:px-8 font-sans text-slate-900">
            <div className="max-w-5xl mx-auto">

                {/* Profile Header — Hero 風格 */}
                <div className="relative overflow-hidden bg-[#14142a] text-white rounded-[8px] mb-8 md:mb-10 shadow-sm">
                    {/* 點陣網格背景 */}
                    <div
                        className="absolute inset-0 opacity-[0.08] pointer-events-none"
                        style={{
                            backgroundImage: 'radial-gradient(rgba(255,255,255,0.8) 1px, transparent 1px)',
                            backgroundSize: '16px 16px',
                        }}
                    />

                    {/* 登出按鈕 */}
                    <button
                        onClick={handleLogout}
                        className="absolute top-4 right-4 md:top-5 md:right-5 bg-white/5 hover:bg-white/15 text-white/60 hover:text-white px-3 py-1.5 rounded-[6px] text-[11px] font-mono transition-all flex items-center gap-1.5 border border-white/15 z-10"
                    >
                        <LogOut size={12} /> <span className="hidden sm:inline">登出身分</span>
                    </button>

                    <div className="relative px-6 sm:px-10 md:px-14 py-10 md:py-14">
                        {/* KICKER */}
                        <div className="flex items-center gap-3 mb-6 md:mb-8">
                            <span className="block w-8 h-[1px] bg-[#c9a84c]/60" />
                            <span className="text-[10px] md:text-[11px] font-mono tracking-[0.18em] text-white/50 uppercase">
                                R.I.B. 探員檔案 · Agent Profile
                            </span>
                        </div>

                        {/* 身分識別：avatar + 名字 + 軍階 */}
                        <div className="flex flex-col sm:flex-row sm:items-end gap-5 sm:gap-6 mb-8">
                            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-[#c9a84c]/90 rounded-[6px] border-2 border-white/20 flex items-center justify-center shadow-xl flex-shrink-0">
                                <User size={44} className="text-[#14142a]" />
                            </div>
                            <div className="min-w-0">
                                <h1 className="font-serif font-bold text-[28px] md:text-[42px] leading-[1.15] tracking-[-0.02em] text-white break-all">
                                    {agentName}
                                </h1>
                                <p className="text-[#c9a84c] font-bold text-[13px] md:text-[14px] tracking-[0.06em] flex items-center gap-1.5 mt-1.5">
                                    <ShieldCheck size={14} /> {getAgentRank()}
                                </p>
                            </div>
                        </div>

                        {/* META 條 */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-4 pt-6 border-t border-white/10">
                            <div>
                                <div className="text-[10px] font-mono text-white/40 uppercase tracking-[0.1em] mb-1">累積得分</div>
                                <div className="text-[15px] md:text-[16px] font-bold text-white">{totalScore}</div>
                            </div>
                            <div>
                                <div className="text-[10px] font-mono text-white/40 uppercase tracking-[0.1em] mb-1">單元過關</div>
                                <div className="text-[15px] md:text-[16px] font-bold text-white">{passedGames} / 6</div>
                            </div>
                            <div>
                                <div className="text-[10px] font-mono text-white/40 uppercase tracking-[0.1em] mb-1">劇情完美</div>
                                <div className="text-[15px] md:text-[16px] font-bold text-white">{optimalChaptersCount} / 10</div>
                            </div>
                            <div>
                                <div className="text-[10px] font-mono text-white/40 uppercase tracking-[0.1em] mb-1">劇情通關</div>
                                <div className="text-[15px] md:text-[16px] font-bold text-white">{completeChaptersCount} / 10</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">

                    {/* Left Column: Skills & Ranks */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-white p-6 rounded-[8px] shadow-sm border border-[#dddbd5]">
                            <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.18em] mb-6 flex items-center gap-2">
                                <TrendingUp size={14} className="text-[#2d5be3]" /> 探員素質分析
                            </h3>
                            <SkillBar label="問題意識" value={skills.focus} icon={Target} textColor="text-rose-500" bgColor="bg-rose-500" />
                            <SkillBar label="倫理審查" value={skills.ethics} icon={ShieldAlert} textColor="text-emerald-500" bgColor="bg-emerald-500" />
                            <SkillBar label="研究邏輯" value={skills.logic} icon={Brain} textColor="text-amber-500" bgColor="bg-amber-500" />
                            <SkillBar label="設計嚴謹" value={skills.rigor} icon={ShieldCheck} textColor="text-indigo-500" bgColor="bg-indigo-500" />
                            <SkillBar label="數據呈現" value={skills.visual} icon={BarChart3} textColor="text-cyan-500" bgColor="bg-cyan-500" />
                            <SkillBar label="批判思考" value={skills.critical} icon={Zap} textColor="text-purple-500" bgColor="bg-purple-500" />
                        </div>

                        {/* 連貫劇情勳章 */}
                        <div className="bg-white p-6 rounded-[8px] shadow-sm border border-[#dddbd5]">
                            <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.18em] mb-5 flex items-center gap-2">
                                <Star size={14} className="text-[#c9a84c]" /> 劇情任務紀錄
                            </h3>
                            <StoryRow seriesKey="phantom" />
                            <StoryRow seriesKey="echo" />
                            <p className="text-[10px] text-slate-400 mt-3 leading-relaxed">
                                ★ 完美通關（拿到關鍵線索）　○ 普通通關　虛線 = 尚未挑戰
                            </p>
                        </div>

                        <div className="bg-[#14142a] p-6 rounded-[8px] shadow-md text-white relative overflow-hidden">
                            <div className="absolute -right-4 -bottom-4 opacity-10 text-8xl">🏅</div>
                            <h3 className="text-[11px] font-bold text-[#c9a84c] uppercase tracking-[0.18em] mb-4">解鎖成就</h3>
                            <div className="flex flex-wrap gap-3">
                                {Object.keys(gameStats).length > 0 ? (
                                    Object.keys(gameStats).map(id => (
                                        <div key={id} className="w-10 h-10 bg-[#c9a84c]/15 border border-[#c9a84c]/40 rounded-[6px] flex items-center justify-center text-xl" title={id}>
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
                        <div className="bg-white p-6 md:p-8 rounded-[8px] shadow-sm border border-[#dddbd5] h-full">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6 md:mb-8 border-b border-[#dddbd5] pb-4">
                                <h2 className="font-serif text-[20px] md:text-[24px] font-bold flex items-center gap-3 text-[#1a1a2e]">
                                    <Award size={22} className="text-[#c9a84c]" /> 任務執行紀錄
                                </h2>
                                <span className="text-[11px] font-mono font-bold text-slate-500 bg-[#f8f7f4] px-3 py-1 rounded-full border border-[#dddbd5] self-start sm:self-auto">
                                    累積得分：{totalScore}
                                </span>
                            </div>

                            <div className="space-y-3">
                                {Object.keys(gameStats).length === 0 ? (
                                    <div className="text-center py-16 md:py-20 bg-[#f8f7f4] rounded-[8px] border-2 border-dashed border-[#dddbd5]">
                                        <Clock size={42} className="mx-auto text-slate-300 mb-4" />
                                        <p className="text-slate-500 font-bold">目前尚無出勤紀錄</p>
                                        <button
                                            onClick={() => navigate('/games')}
                                            className="mt-4 text-[#2d5be3] font-bold hover:underline text-sm"
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
                                            <div key={id} className="flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-[6px] border border-[#e8e6df] hover:border-[#1a1a2e]/30 hover:bg-[#f8f7f4] transition-all group">
                                                <div className={`w-1.5 h-12 ${gameInfo.color} rounded-full flex-shrink-0`}></div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest truncate">{id}</div>
                                                    <div className="font-bold text-[#1a1a2e] text-[14px] md:text-[15px] truncate">{gameInfo.title}</div>
                                                </div>
                                                <div className="text-right flex-shrink-0">
                                                    <div className="text-[16px] md:text-[18px] font-black text-[#1a1a2e] leading-none">
                                                        {data.score}
                                                        <span className="text-[11px] text-slate-400 font-normal"> / {data.maxScore}</span>
                                                    </div>
                                                    <div className="text-[10px] text-slate-400 font-mono tracking-tighter mt-1">{data.date}</div>
                                                </div>
                                                <ChevronRight size={16} className="text-slate-300 group-hover:text-[#2d5be3] transition-colors hidden sm:block" />
                                            </div>
                                        );
                                    })
                                )}
                            </div>

                            <div className="mt-8 md:mt-10 bg-[#f8f7f4] p-5 md:p-6 rounded-[8px] border border-[#dddbd5] flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
                                <div>
                                    <h4 className="font-serif font-bold text-[#1a1a2e] text-[16px] md:text-[17px]">學期結業預判</h4>
                                    <p className="text-[13px] text-slate-600 mt-1">目前單元進度：{Math.round((Object.keys(gameStats).length / 6) * 100)}%</p>
                                </div>
                                <button
                                    onClick={() => navigate('/games')}
                                    className="bg-[#2d5be3] text-white px-5 py-2.5 rounded-[8px] text-[13px] font-bold shadow-md shadow-[#2d5be3]/20 hover:brightness-110 transition-all self-start sm:self-auto"
                                >
                                    繼續執行任務 →
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
