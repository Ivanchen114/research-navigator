import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Stethoscope, ArrowRight, ClipboardList, Mic, Camera, FileSearch, TestTube2, AlertCircle, Clock, CheckCircle2, HeartPulse, ShieldAlert, FileText, Wrench, Map } from 'lucide-react';
import LessonMap from '../components/ui/LessonMap';
import CourseArc from '../components/ui/CourseArc';

const triageTiers = [
    {
        id: 'red',
        color: 'red',
        badge: 'bg-red-100 text-red-700 border-red-200',
        bg: 'bg-red-50',
        border: 'border-red-200',
        icon: <ShieldAlert size={24} className="text-red-600" />,
        title: '🔴 急診區（工具卡關 / 倫理未過）',
        symptoms: [
            '工具被老師退件，不知道怎麼改',
            '倫理審查 Part 2 卡關，AI 說有問題',
            '找不到受訪者 / 問卷發不出去'
        ],
        action: '優先處理！請立即在黑板「急診區」寫上組別，等待老師救援。'
    },
    {
        id: 'yellow',
        color: 'yellow',
        badge: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        bg: 'bg-amber-50',
        border: 'border-amber-200',
        icon: <Stethoscope size={24} className="text-amber-600" />,
        title: '🟡 門診區（執行不順 / 需要討論）',
        symptoms: [
            '問卷回收份數不如預期',
            '訪談錄音有雜音 or 對方不願意分享',
            '實驗對照組出現不可控變數'
        ],
        action: '請在黑板「門診區」排隊，老師會按順序巡迴討論。'
    },
    {
        id: 'green',
        color: 'green',
        badge: 'bg-green-100 text-green-700 border-green-200',
        bg: 'bg-emerald-50',
        border: 'border-emerald-200',
        icon: <HeartPulse size={24} className="text-emerald-600" />,
        title: '🟢 健康區（進度順利 / 超前部署）',
        symptoms: [
            '問卷份數已達標',
            '訪談已完成並開始打逐字稿',
            '實驗/觀察數據已收集完畢'
        ],
        action: '做得好！請直接進入下方的「等待急救包」任務，開始預寫第三章。'
    }
];

const waitingRoomTasks = [
    {
        id: 'task1',
        title: '整理文獻回顧',
        desc: '把 W6 找到的文獻，整理成 200 字的摘要。',
        icon: <FileText size={20} className="text-blue-500" />
    },
    {
        id: 'task2',
        title: '預寫第三章工具',
        desc: '把你們的問卷/訪談題目或實驗流程，整理成正式的報告段落。',
        icon: <Wrench size={20} className="text-slate-500" />
    },
    {
        id: 'task3',
        title: 'AI 初步探勘',
        desc: '把收到的前 10 份回覆餵給 AI，看看有沒有什麼有趣的發現。',
        icon: <Camera size={20} className="text-purple-500" />
    }
];

export const W11Page = () => {
    const [selectedTier, setSelectedTier] = useState(null);
    const [showLessonMap, setShowLessonMap] = useState(false);

    return (
        <div className="max-w-[1000px] mx-auto px-6 lg:px-12 py-12 pb-32">
            {/* TOP BAR / NAVIGATION PATH */}
            <div className="flex items-center justify-between border-b border-[#dddbd5] pb-4 mb-16">
                <div className="text-[11px] font-mono text-[#8888aa] flex items-center gap-2">
                    研究方法與專題 / 資料蒐集 / <span className="text-[#1a1a2e] font-bold">研究診所 W12</span>
                </div>
                <div className="flex items-center gap-4">
                    <span className="bg-[#f0ede6] text-[#1a1a2e] text-[10px] font-bold px-2 py-0.5 rounded-[2px] font-mono">100 MINS</span>
                    <button
                        onClick={() => setShowLessonMap(!showLessonMap)}
                        className="text-[11px] text-[#8888aa] hover:text-[#2d5be3] transition-colors flex items-center gap-1 font-mono"
                    >
                        <Map size={12} /> {showLessonMap ? 'Hide Plan' : 'Instructor View'}
                    </button>
                    <span className="bg-[#1a1a2e] text-white text-[10px] font-bold px-2 py-0.5 rounded-[2px] font-mono">AI-RED · D</span>
                </div>
            </div>

            {showLessonMap && (
                <div className="mb-12 animate-in fade-in slide-in-from-top-4 duration-300 space-y-6">
                    {/* 時間軸 */}
                    <div className="p-6 bg-[#f8f7f4] border border-[#dddbd5] rounded-xl">
                        <h3 className="text-[14px] font-bold text-[#1a1a2e] mb-4">⏱ 時間軸</h3>
                        <div className="grid grid-cols-2 gap-4 text-[12px] text-[#4a4a6a]">
                            <div>
                                <p className="font-bold text-[#1a1a2e] mb-2">第一節（50 分鐘）</p>
                                <p>0:00–0:10 開場 + 診所掛號說明</p>
                                <p>0:10–0:15 黑板掛號 + 教師快速盤點</p>
                                <p>0:15–0:50 全班自由執行 + 老師個別診所</p>
                            </div>
                            <div>
                                <p className="font-bold text-[#1a1a2e] mb-2">第二節（50 分鐘）</p>
                                <p>0:00–0:35 繼續執行 + 診所全開</p>
                                <p>0:35–0:45 研究日誌書寫</p>
                                <p>0:45–0:50 收束 + W13 中期報告預告</p>
                            </div>
                        </div>
                    </div>

                    {/* 診療指南 */}
                    <div className="p-6 bg-[#f8f7f4] border border-[#dddbd5] rounded-xl">
                        <h3 className="text-[14px] font-bold text-[#1a1a2e] mb-4">📋 各方法組診療指南（巡迴參考）</h3>

                        {/* 問卷組 */}
                        <div className="mb-5">
                            <div className="bg-teal-600 text-white text-[12px] font-bold px-3 py-1.5 rounded-t-lg">📋 問卷組</div>
                            <div className="border border-t-0 border-[#dddbd5] rounded-b-lg divide-y divide-[#eee]">
                                <div className="p-3 flex gap-3 text-[12px]">
                                    <span className="bg-amber-100 text-amber-700 font-bold px-2 py-0.5 rounded whitespace-nowrap h-fit">回收率很低</span>
                                    <span className="text-[#4a4a6a]">只是「丟連結」還是「有問他/她？」——人不喜歡填莫名其妙的問卷。要用人的方式問：「嗨！我在做一個關於○○的研究，3 分鐘就填完，可以幫我嗎？」等回覆 OK 再貼連結。</span>
                                </div>
                                <div className="p-3 flex gap-3 text-[12px]">
                                    <span className="bg-amber-100 text-amber-700 font-bold px-2 py-0.5 rounded whitespace-nowrap h-fit">填答品質差</span>
                                    <span className="text-[#4a4a6a]">「社會期許偏誤＋應付作答」——確認佔比多少，若 50 份中 6 份（12%）還OK。標記出來，分析時說明並剔除或保留，這是研究限制，誠實說清楚就好。</span>
                                </div>
                                <div className="p-3 flex gap-3 text-[12px]">
                                    <span className="bg-amber-100 text-amber-700 font-bold px-2 py-0.5 rounded whitespace-nowrap h-fit">不敢開口</span>
                                    <span className="text-[#4a4a6a]">用 AI 當話術教練！Prompt：「我要邀請班上或學弟妹填一份關於○○的問卷，我是高中生，請幫我寫一段 LINE 邀請訊息，語氣要有禮貌、真誠，說明填答只需 3 分鐘，請給我 2 種不同語氣的版本。」</span>
                                </div>
                            </div>
                        </div>

                        {/* 訪談組 */}
                        <div className="mb-5">
                            <div className="bg-purple-600 text-white text-[12px] font-bold px-3 py-1.5 rounded-t-lg">🎤 訪談組</div>
                            <div className="border border-t-0 border-[#dddbd5] rounded-b-lg divide-y divide-[#eee]">
                                <div className="p-3 flex gap-3 text-[12px]">
                                    <span className="bg-purple-100 text-purple-700 font-bold px-2 py-0.5 rounded whitespace-nowrap h-fit">受訪者話很少</span>
                                    <span className="text-[#4a4a6a]">問了封閉式問題！換成開放式：「最近讀書的過程中，有什麼時刻讓你特別有壓力？可以舉個例子嗎？」讓他說一個「故事」，不是說一個「答案」。</span>
                                </div>
                                <div className="p-3 flex gap-3 text-[12px]">
                                    <span className="bg-purple-100 text-purple-700 font-bold px-2 py-0.5 rounded whitespace-nowrap h-fit">錄音品質很差</span>
                                    <span className="text-[#4a4a6a]">在哪裡錄的？走廊太吵！選安靜地方：圖書館角落、小教室。錄音可用 AI 自動轉錄（NotebookLM 或 Whisper），或放慢播放速度仔細聽。</span>
                                </div>
                                <div className="p-3 flex gap-3 text-[12px]">
                                    <span className="bg-purple-100 text-purple-700 font-bold px-2 py-0.5 rounded whitespace-nowrap h-fit">受訪者臨時爽約</span>
                                    <span className="text-[#4a4a6a]">雙軌並行——① 繼續等他，給 2–3 天排其他時段；② 啟動 W10 備案，換一個受訪者。先傳訊息問下週哪天有空，同時聯絡備用受訪者，不要只等一個人！</span>
                                </div>
                            </div>
                        </div>

                        {/* 實驗觀察組 */}
                        <div>
                            <div className="bg-emerald-600 text-white text-[12px] font-bold px-3 py-1.5 rounded-t-lg">🧪 實驗組 ／ 👀 觀察組</div>
                            <div className="border border-t-0 border-[#dddbd5] rounded-b-lg divide-y divide-[#eee]">
                                <div className="p-3 flex gap-3 text-[12px]">
                                    <span className="bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded whitespace-nowrap h-fit">實驗：人數不均</span>
                                    <span className="text-[#4a4a6a]">若時間允許，繼續招募對照組；若無法，分析時說明樣本數不均等是研究限制，結論要保守，不能強調因果。</span>
                                </div>
                                <div className="p-3 flex gap-3 text-[12px]">
                                    <span className="bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded whitespace-nowrap h-fit">觀察：觀察者效應</span>
                                    <span className="text-[#4a4a6a]">① 讓學生習慣你的存在（多去幾次）；② 用不明顯的記錄方式；③ 報告中說明這是研究限制。</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* W13 預告 */}
                    <div className="p-5 bg-[#fdf6e3] border border-amber-200 rounded-xl text-[12px] text-[#7a6020]">
                        <span className="font-bold">📌 W13 中期報告三要素：</span> ① 我目前做到哪了？（現況）② 還差什麼沒做完？（缺口）③ 我打算怎麼補？（計畫）—— 下週每組要用 2 分鐘講完這三件事。
                    </div>
                </div>
            )}

            {/* PAGE HEADER */}
            <header className="mb-14">
                <div className="text-[11px] font-mono text-[#2d5be3] mb-3 tracking-[0.06em]">🏥 W12 · 研究診所 I</div>
                <h1 className="font-serif text-[42px] font-bold leading-[1.2] text-[#1a1a2e] mb-4 tracking-[-0.01em]">
                    研究診所：<span className="text-[#2d5be3]">Open Office 與個別指導</span>
                </h1>
                <p className="text-[16px] text-[#4a4a6a] max-w-[680px] leading-[1.75] mb-10">
                    本週沒有新進度，只有解決問題。老師今天不講課，化身為主治醫師，為你們的研究把脈。
                </p>

                {/* META CARDS */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14">
                    {[
                        { label: '第一節', value: '掛號分流與現況診斷' },
                        { label: '第二節', value: 'Open Office 個別指導' },
                        { label: '課課產出', value: '施測日誌與關鍵事件' },
                        { label: '帶去 W13', value: '中期盤點報告資料' }
                    ].map((item, idx) => (
                        <div key={idx} className="bg-white border border-[#dddbd5] rounded-[12px] p-5">
                            <div className="text-[11px] text-[#8888aa] mb-2 font-medium">{item.label}</div>
                            <div className="text-[14px] font-bold text-[#1a1a2e]">{item.value}</div>
                        </div>
                    ))}
                </div>

                {/* COURSE ARC */}
                <CourseArc items={[
                    { wk: 'W1-W4', name: '問題意識\n題目定案', past: true },
                    { wk: 'W5-W7', name: '研究規劃\n文獻鑑識', past: true },
                    { wk: 'W8-W10', name: '工具設計\n倫理審查', past: true },
                    { wk: 'W12', name: '研究診所 I\nOpen Office', now: true },
                    { wk: 'W13', name: '研究診所 II\n中期盤點' },
                    { wk: 'W14-W16', name: '分析撰寫\n研究結論' },
                    { wk: 'W17', name: '成果展示\nGallery Walk' }
                ]} />
            </header>

            <div className="space-y-12">
                {/* Part 1: 黑板掛號分流系統 */}
                <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 md:p-8">
                    <div className="flex items-center mb-6 gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-xl">
                            📋
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-slate-800">Part 1｜研究掛號分流系統</h2>
                            <p className="text-slate-500 text-sm">根據你目前的施測狀況進行「掛號分流」，讓醫生（老師）能精準診斷你們遇到的困難與瓶頸。</p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                        {triageTiers.map((tier) => (
                            <button
                                key={tier.id}
                                onClick={() => setSelectedTier(tier.id)}
                                className={`flex flex-col text-left rounded-2xl p-5 border-2 transition-all ${selectedTier === tier.id ? `${tier.badge} shadow-md scale-[1.02]` : `bg-white border-slate-100 hover:${tier.bg} hover:border-slate-200`}`}
                            >
                                <div className="flex items-center gap-3 mb-3">
                                    {tier.icon}
                                    <span className="font-bold">{tier.title}</span>
                                </div>
                                <ul className="text-sm space-y-1.5 mb-4 opacity-80 pl-2 border-l-2 border-current">
                                    {tier.symptoms.map((sym, idx) => (
                                        <li key={idx}>• {sym}</li>
                                    ))}
                                </ul>
                                <div className={`mt-auto text-xs font-semibold p-2 rounded-lg bg-white/50 backdrop-blur-sm self-start`}>
                                    👉 {tier.action}
                                </div>
                            </button>
                        ))}
                    </div>

                    {!selectedTier && (
                        <div className="mt-4 text-center text-sm text-amber-600 font-medium animate-pulse">
                            👆 請選擇你們組的狀態，以獲得相對應的指示。
                        </div>
                    )}
                </div>

                {/* Part 2: 綠區專屬任務包 */}
                <div className={`transition-all duration-500 ${selectedTier === 'green' ? 'opacity-100 translate-y-0' : 'opacity-30 grayscale pointer-events-none -translate-y-4'}`}>
                    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl shadow-sm border border-emerald-100 p-6 md:p-8">
                        <div className="flex items-center mb-6 gap-3">
                            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                                <HeartPulse size={20} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-slate-800">Part 2｜健康區等待急救包</h2>
                                <p className="text-emerald-700 text-sm">進度超前的專屬任務包，提早開始整理文獻與預寫報告段落，為後續分析爭取時間。</p>
                            </div>
                        </div>

                        <div className="grid sm:grid-cols-3 gap-4">
                            {waitingRoomTasks.map((task) => (
                                <div key={task.id} className="bg-white/80 p-5 rounded-2xl border border-emerald-200 hover:shadow-sm transition-all">
                                    <div className="flex items-center gap-2 mb-2 font-bold text-slate-700">
                                        {task.icon} {task.title}
                                    </div>
                                    <p className="text-sm text-slate-600 leading-relaxed">{task.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Part 3: 溝通與日誌 */}
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-slate-900 text-slate-100 rounded-3xl p-6 md:p-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl" />
                        <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
                            <Mic className="text-blue-400" />
                            AI 專題溝通教練
                        </h2>
                        <p className="text-slate-400 text-sm mb-4 leading-relaxed">
                            施測過程中遇到溝通難題？請 AI 教練幫你擬定最合宜的對話草稿，化解尷輯與壓力。
                        </p>
                        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 text-sm font-mono text-slate-300">
                            <p className="text-blue-400 mb-2">// 溝通救星 Prompt</p>
                            「我在做高中的專題研究，遇到了一個困難：<br />
                            <span className="text-amber-400">【描述你的狀況，例如組員不回訊息、不知道怎麼拒絕長輩亂給意見】</span><br /><br />
                            請幫我擬一段 100 字以內的溝通文字。語氣要堅定但有禮貌，並提供兩個不同的寫法讓我選。」
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 flex flex-col">
                        <h2 className="text-xl font-bold flex items-center gap-2 mb-4 text-slate-800">
                            <ClipboardList className="text-indigo-500" />
                            關鍵事件日誌 (Logbook)
                        </h2>
                        <p className="text-slate-500 text-sm mb-4 leading-relaxed">
                            不要記流水帳（今天開會吃了什麼）。請記錄「我們遇到了什麼問題？我們怎麼解決的？」
                        </p>
                        <div className="flex-1 bg-slate-50 rounded-xl border border-dashed border-slate-300 p-4 flex flex-col justify-center items-center text-center">
                            <AlertCircle className="text-slate-400 mb-2" size={24} />
                            <p className="text-sm text-slate-600 font-medium tracking-wide mb-3">
                                W12 結束前，請至 Google Classroom<br />
                                填寫本週的「關鍵事件日誌」
                            </p>
                            <a href="https://classroom.google.com/" target="_blank" rel="noopener noreferrer" className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-indigo-500 transition-colors flex items-center gap-2">
                                前往 Classroom <ArrowRight size={14} />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <div className="flex justify-between items-center pt-8 border-t border-slate-100">
                    <Link to="/w11" className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 font-bold">
                        ← 回 W11 倫理審查
                    </Link>
                    <Link to="/w13" className="flex items-center gap-2 text-sm bg-orange-600 text-white px-5 py-2 rounded-full hover:bg-orange-500 transition-colors font-bold shadow-md">
                        前往 W13 研究執行 II <ArrowRight size={16} />
                    </Link>
                </div>
            </div>
        </div>
    );
};
