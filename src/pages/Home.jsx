import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, BarChart2, BookOpen, Users, Gamepad2, Navigation2, Stethoscope, Wrench, HeartPulse, Bug, ChartNoAxesCombined, Palette, TrendingUp, Target } from 'lucide-react';

const CardIconRow = ({ icon: Icon, type, isMission }) => (
    <div className="flex items-center gap-2 mb-1.5">
        <div className={`w-7 h-7 rounded-md border flex items-center justify-center text-[13px] ${isMission ? 'bg-white/10 border-white/15 text-white' : 'bg-[#f0ede6] border-[#dddbd5] text-[#1a1a2e]'}`}>
            <Icon size={16} />
        </div>
        <div className={`text-[10px] font-['DM_Mono',monospace] tracking-[0.08em] uppercase px-1.5 py-0.5 rounded-[3px] ${isMission ? 'text-[#2d5be3] bg-[#e8eeff]' : 'text-[#8888aa]'}`}>
            {type}
        </div>
    </div>
);

const PhaseCard = ({ icon, type, isMission, title, desc, onClick }) => (
    <div
        onClick={onClick}
        className={`p-[18px_22px] flex flex-col gap-1.5 transition-colors duration-150 cursor-pointer group ${isMission
            ? 'bg-[#1a1a2e] hover:bg-[#2a2a4a] col-span-1 sm:col-span-2'
            : 'bg-white hover:bg-[#f8f7f4]'
            }`}
    >
        <CardIconRow icon={icon} type={type} isMission={isMission} />
        <h4 className={`text-[13px] font-bold ${isMission ? 'text-white/90' : 'text-[#1a1a2e]'}`}>
            {title}
        </h4>
        <p className={`text-[12px] leading-[1.55] ${isMission ? 'text-white/90' : 'text-[#4a4a6a]'}`}>
            {desc}
        </p>
        <div className={`mt-auto text-[12px] self-end opacity-0 group-hover:opacity-100 transition-opacity duration-150 ${isMission ? 'text-[#c9a84c]' : 'text-[#2d5be3]'}`}>
            {isMission ? '→ 進入任務' : '→'}
        </div>
    </div>
);

const PhaseGroup = ({ num, title, weeks, children }) => (
    <div className="mb-8 border border-[#dddbd5] rounded-[10px] overflow-hidden bg-white">
        <div className="flex items-center gap-4 p-[18px_24px] border-b border-[#dddbd5] bg-[#f0ede6]">
            <div className="font-['DM_Mono',monospace] text-[11px] text-[#8888aa] tracking-[0.08em]">
                Phase {num}
            </div>
            <div className="font-bold text-[15px] text-[#1a1a2e]">
                {title}
            </div>
            <div className="ml-auto font-['DM_Mono',monospace] text-[11px] text-[#8888aa] bg-[#f8f7f4] border border-[#dddbd5] px-2 py-0.5 rounded text-center">
                {weeks}
            </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-[1px] bg-[#dddbd5]">
            {children}
        </div>
    </div>
);

const QuickNavItem = ({ step, title, desc, isPrimary, onClick }) => (
    <div
        onClick={onClick}
        className={`p-[20px_24px] cursor-pointer transition-colors duration-150 flex flex-col h-full ${isPrimary ? 'bg-[#1a1a2e] hover:bg-[#2a2a4a]' : 'bg-white hover:bg-[#f8f7f4]'
            }`}
    >
        <div className={`text-[10px] font-['DM_Mono',monospace] uppercase tracking-[0.1em] mb-1.5 ${isPrimary ? 'text-white/50' : 'text-[#8888aa]'}`}>
            {step}
        </div>
        <div className={`text-[13px] font-bold mb-2 ${isPrimary ? 'text-white/90' : 'text-[#1a1a2e]'}`}>
            {title}
        </div>
        <div className={`text-[12px] leading-[1.6] flex-1 ${isPrimary ? 'text-white/90' : 'text-[#4a4a6a]'}`}>
            {desc}
        </div>
    </div>
);

const AIRedItem = ({ keyName, zhName, desc }) => (
    <div className="bg-white p-[16px_18px] flex flex-col justify-start">
        <div className="font-['DM_Mono',monospace] text-[13px] font-medium text-[#2d5be3] mb-1">
            {keyName}
        </div>
        <div className="font-bold text-[13px] mb-1 text-[#1a1a2e]">
            {zhName}
        </div>
        <div className="text-[11px] text-[#4a4a6a] leading-[1.5]">
            {desc}
        </div>
    </div>
);

export const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="max-w-[1000px] mx-auto px-6 lg:px-12 py-12 animate-in fade-in slide-in-from-bottom-4 duration-500 font-sans text-[13px] leading-[1.6] text-[#1a1a2e] pb-32">

            {/* TOP BAR / NAVIGATION PATH */}
            <div className="flex items-center justify-between border-b border-[#dddbd5] pb-4 mb-16">
                <div className="text-[11px] font-mono text-[#8888aa] flex items-center gap-2">
                    研究方法與專題 / <span className="text-[#1a1a2e] font-bold">首頁</span>
                </div>
                <div className="flex items-center gap-3">
                    <span className="bg-[#f0ede6] text-[#1a1a2e] text-[10px] font-bold px-2 py-0.5 rounded-[2px] font-mono">可投影</span>
                    <span className="bg-[#f0ede6] text-[#1a1a2e] text-[10px] font-bold px-2 py-0.5 rounded-[2px] font-mono">可手機</span>
                    <span className="bg-[#e8eeff] text-[#2d5be3] text-[10px] font-bold px-2 py-0.5 rounded-[2px] font-mono">課堂 + 自學雙模式</span>
                </div>
            </div>

            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">

                {/* HERO */}
                <div className="mb-14">
                    <div className="text-[11px] font-['DM_Mono',monospace] tracking-[0.12em] uppercase text-[#2d5be3] mb-3">
                        SSSH × 研究方法與專題 · 高一必修
                    </div>
                    <h1 className="font-['Noto_Serif_TC',serif] text-4xl md:text-[38px] font-bold leading-[1.25] text-[#1a1a2e] mb-4 tracking-[-0.02em]">
                        從發現問題<br className="hidden md:block" />
                        到解讀結論<br className="hidden md:block" />
                        <span className="text-[#2d5be3]">AI 陪你做研究</span>
                    </h1>
                    <p className="text-[15px] text-[#4a4a6a] leading-[1.75] max-w-[560px]">
                        這不是一個幫你寫作業的工具，而是一個專屬你的「研究教練」。透過人機協作，把複雜的研究方法變得像通關遊戲一樣簡單。
                    </p>
                </div>

                {/* QUICK NAV */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-[1px] bg-[#dddbd5] border border-[#dddbd5] rounded-[10px] overflow-hidden mb-14">
                    <QuickNavItem
                        step="Step 01 · W0–W2"
                        title="發掘問題"
                        desc="「我還沒有題目...」從觀察力開始，鍛鍊問題意識。"
                        onClick={() => {
                            document.getElementById('phase-1')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                    />
                    <QuickNavItem
                        step="Step 02 · W3–W9"
                        title="方法與工具"
                        desc="「要用什麼方法做？」「工具怎麼設計？夥伴怎麼找？」幫題目掛號，找出合適的研究工具，並組建團隊。"
                        onClick={() => {
                            document.getElementById('phase-2')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                    />
                    <QuickNavItem
                        step="Step 03 · W10+"
                        title="解讀與結論"
                        desc="「我有問卷數據/訪談稿了，接下來救命啊...」學習正確使用 AI，產出精美圖表與洞察。→"
                        isPrimary={true}
                        onClick={() => {
                            document.getElementById('phase-5')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                    />
                </div>

                {/* ROADMAP HEADER */}
                <div className="flex items-baseline gap-3 mb-6 flex-wrap">
                    <h2 className="font-['Noto_Serif_TC',serif] text-[20px] font-bold text-[#1a1a2e]">
                        研究準備地圖
                    </h2>
                    <div className="text-[13px] text-[#8888aa]">
                        Course Roadmap · 按週次循序漸進
                    </div>
                </div>

                {/* Phase 1 */}
                <div id="phase-1">
                    <PhaseGroup num="01" title="啟航與問題意識" weeks="W0 – W2">
                        <PhaseCard
                            icon={Search} type="學習模組"
                            title="發掘問題筆記本" desc="幫你的現象找落差，鍛鍊問題意識。"
                            onClick={() => navigate('/discovery')}
                        />
                        <PhaseCard
                            icon={BookOpen} type="學習模組 · W1"
                            title="AI-RED 公約" desc="認識人機協作法則。"
                            onClick={() => navigate('/w1')}
                        />
                        <PhaseCard
                            icon={Target} type="互動任務 · 行動代號：靶心" isMission={true}
                            title="問題意識鍛鍊 (W2)" desc="把問題變精準，找到研究靶心。"
                            onClick={() => navigate('/problem-focus')}
                        />
                    </PhaseGroup>
                </div>

                {/* Phase 2 */}
                <div id="phase-2">
                    <PhaseGroup num="02" title="方法快篩與文獻回顧" weeks="W3 – W6">
                        <PhaseCard
                            icon={Navigation2} type="學習模組 · W3"
                            title="方法快篩 (W3)" desc="回答三問題，鎖定適合的方法。"
                            onClick={() => navigate('/wizard')}
                        />
                        <PhaseCard
                            icon={Users} type="學習模組 · W4"
                            title="題目博覽會 (W4)" desc="辦一場個人博覽會，讓同學幫你把關。"
                            onClick={() => navigate('/w4')}
                        />
                        <PhaseCard
                            icon={Stethoscope} type="互動任務 · 診所" isMission={true}
                            title="研究診所 (W5)" desc="用分科三問確認選對研究工具。"
                            onClick={() => navigate('/clinic')}
                        />
                        <PhaseCard
                            icon={BookOpen} type="學習模組 · W6"
                            title="文獻鑑識 (W6)" desc="學會辨別可信度與避免抄襲。"
                            onClick={() => navigate('/literature-review')}
                        />
                        <PhaseCard
                            icon={HeartPulse} type="互動任務 · 行動代號：靶心" isMission={true}
                            title="行動代號：靶心" desc="研究問題精煉與對焦訓練。為生病的問題開立處方！"
                            onClick={() => navigate('/game/question-er')}
                        />
                        <PhaseCard
                            icon={Gamepad2} type="互動任務 · 行動代號：裝備" isMission={true}
                            title="行動代號：裝備" desc="研究工具與蒐集方法辨識。測試你的判斷力！"
                            onClick={() => navigate('/game/tool-quiz')}
                        />
                        <PhaseCard
                            icon={Search} type="互動任務 · 行動代號：獵狐" isMission={true}
                            title="行動代號：獵狐" desc="文獻真偽辨識與學術倫理審查。判斷引用合法性！"
                            onClick={() => navigate('/game/citation-detective')}
                        />
                    </PhaseGroup>
                </div>

                {/* Phase 3 */}
                <div id="phase-3">
                    <PhaseGroup num="03" title="組隊與決策" weeks="W7">
                        <PhaseCard
                            icon={Users} type="學習模組 · W7"
                            title="組隊決策指南" desc="找到能力互補的夥伴，或宣告成為 Solo 極客。"
                            onClick={() => navigate('/team-formation')}
                        />
                    </PhaseGroup>
                </div>

                {/* Phase 4 */}
                <div id="phase-4">
                    <PhaseGroup num="04" title="研究工具設計" weeks="W8 – W9">
                        <PhaseCard
                            icon={Wrench} type="學習模組 · W8-W9"
                            title="工具設計指南" desc="學會處方診斷三大標準。"
                            onClick={() => navigate('/tool-design')}
                        />
                        <PhaseCard
                            icon={Bug} type="互動任務 · 行動代號：防線" isMission={true}
                            title="行動代號：防線" desc="研究設計與方法學避險測試。找出設計中的 Bug！"
                            onClick={() => navigate('/game/rx-inspector')}
                        />
                    </PhaseGroup>
                </div>

                {/* Phase 5 */}
                <div id="phase-5">
                    <PhaseGroup num="05" title="數據分析與結論" weeks="W10+">
                        <PhaseCard
                            icon={BarChart2} type="學習模組 · W13"
                            title="數據轉譯 (W13)" desc="數據清洗、AI輔助洞察寫作。"
                            onClick={() => navigate('/w13')}
                        />
                        <PhaseCard
                            icon={TrendingUp} type="學習模組 · 視覺化"
                            title="圖表選用原則" desc="選圖表如選盤子，掌握數據說故事的黃金公式。"
                            onClick={() => navigate('/w13')}
                        />
                        <PhaseCard
                            icon={Palette} type="互動任務 · 行動代號：解碼" isMission={true}
                            title="行動代號：解碼" desc="統計圖表選擇與呈現最佳化。幫數據找最佳圖表！"
                            onClick={() => navigate('/game/chart-matcher')}
                        />
                        <PhaseCard
                            icon={ChartNoAxesCombined} type="互動任務 · 行動代號：濾鏡" isMission={true}
                            title="行動代號：濾鏡" desc="客觀數據解讀與批判性思維培養。分辨正確推論！"
                            onClick={() => navigate('/game/data-detective')}
                        />
                    </PhaseGroup>
                </div>

                {/* AI-RED Ethical Guide */}
                <div className="mt-3 border border-[#dddbd5] rounded-[10px] overflow-hidden bg-white">
                    <div className="p-[20px_24px] border-b border-[#dddbd5] flex items-center gap-3 flex-wrap">
                        <span className="text-[11px] font-['DM_Mono',monospace] bg-[#1a1a2e] text-white px-2 py-[3px] rounded tracking-[0.06em]">
                            協作法則
                        </span>
                        <span className="font-bold text-[15px] text-[#1a1a2e]">
                            牢記 AI-RED 五大原則
                        </span>
                        <span className="ml-auto text-[12px] text-[#8888aa] w-full sm:w-auto mt-2 sm:mt-0">
                            AI 是你的「研究助理」，不是你的「代筆者」
                        </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-[1px] bg-[#dddbd5]">
                        <AIRedItem keyName="Ascribe" zhName="誠實歸屬" desc="誠實說明哪裡用了 AI。" />
                        <AIRedItem keyName="Inquire" zhName="提問" desc="精準提問，不依賴模糊指令。" />
                        <AIRedItem keyName="Reference" zhName="引用" desc="查證 AI 給的資料來源。" />
                        <AIRedItem keyName="Evaluate" zhName="評估" desc="判斷內容是否合理，不照單全收。" />
                        <AIRedItem keyName="Document" zhName="紀錄" desc="保留與 AI 的對話記錄。" />
                    </div>
                </div>

            </div>
        </div>
    );
};
