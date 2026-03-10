import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CheckCircle2, FlaskConical, FileText, Layout as LayoutIcon, MessageSquare, AlertTriangle, Monitor, PenTool } from 'lucide-react';
import CopyButton from '../components/ui/CopyButton';

export const W15Page = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);


    const prompts = {
        promptA: `我寫了一段研究報告的草稿，請幫我：
1. 在「不改變我的核心發現」的前提下，讓這段話更有學術嚴謹感
2. 指出有沒有邏輯不通的地方
3. 修正語法錯誤
⚠️ 不可以自己捏造我沒有的數據，如果要舉例請先告訴我

以下是我的草稿：
【貼上你的文字片段】`,
        promptB: `我把小論文的不同章節拼在一起了，請幫我閱讀以下段落：

【貼上兩段銜接的文字】

請：
1. 不要改變我的原意與任何數據
2. 幫我在兩段之間加上 1–2 句「過渡句（Transition）」
3. 把語氣統一成客觀的學術第三人稱
讓這兩段讀起來像同一篇文章。`,
        promptC: `我的研究標題是「＿＿＿」，以下是各章的核心句子：

引言核心：研究問題是⋯⋯
文獻核心：目前文獻指出⋯⋯
方法核心：本研究使用⋯⋯蒐集了⋯⋯的資料
結果核心：主要發現是⋯⋯
結論核心：此研究說明了⋯⋯

請幫我寫一段 150–200 字的中文研究摘要。
格式：目的 → 方法 → 主要發現 → 結論
語氣：學術、簡潔、第三人稱為主`
    };

    return (
        <div className="page-container animate-in-fade-slide">
            {/* REMOVED: <style dangerouslySetInnerHTML /> - styles moved to index.css */}

            {/* TOP BAR */}
            <div className="flex items-center justify-between border-b border-[#dddbd5] pb-4 mb-16">
                <div className="text-[11px] font-mono text-[#8888aa] flex items-center gap-2">
                    研究方法與專題 / 分析與撰寫 / <span className="text-[#1a1a2e] font-bold">報告撰寫 W15</span>
                </div>
                <div className="flex items-center gap-4">
                    <span className="bg-[#f0ede6] text-[#1a1a2e] text-[10px] font-bold px-2 py-0.5 rounded-[2px] font-mono">100 MINS</span>
                    <span className="bg-[#1a1a2e] text-white text-[10px] font-bold px-2 py-0.5 rounded-[2px] font-mono">AI-RED · D</span>
                </div>
            </div>

            {/* PAGE HEADER */}
            <div className="font-mono text-[11px] text-[#2d5be3] mb-3 tracking-[0.06em] uppercase flex items-center gap-2">
                <FileText size={14} /> W15 · 分析與撰寫
            </div>
            <h1 className="font-serif text-[36px] font-bold leading-[1.2] text-[#1a1a2e] mb-2 tracking-[-0.02em]">
                報告撰寫與海報製作：<em className="not-italic text-[#2d5be3]">從數據到故事</em>
            </h1>
            <p className="text-[15px] text-[#4a4a6a] leading-[1.75] mb-8 max-w-[620px]">
                你已經寫完 80% 了。前 14 週的每一份學習單，都藏著這份報告的原料。今天的任務是「組裝」——把碎片拼成完整的小論文，再把精華壓縮成一張能在 3 秒內吸引人的海報。
            </p>

            {/* META STRIP */}
            <div className="meta-strip">
                {[
                    { label: '第一節', value: '文字工廠：報告組裝' },
                    { label: '第二節', value: '視覺工廠：海報設計' },
                    { label: '課課產出', value: '報告初稿 + 海報草稿' },
                    { label: '帶去 W16', value: '定稿海報、2 分鐘話術' }
                ].map((item, idx) => (
                    <div key={idx} className="meta-item">
                        <div className="meta-label">{item.label}</div>
                        <div className="meta-value">{item.value}</div>
                    </div>
                ))}
            </div>

            {/* COURSE ARC */}
            <div className="text-[11px] text-[#8888aa] mb-3 flex items-center gap-2">
                <LayoutIcon size={14} /> 課程弧線 · 你在哪裡
            </div>
            <div className="arc-grid" style={{ '--arc-cols': 6 }}>
                {[
                    { wk: 'W1–W4', name: '問題意識\n題目定案', status: 'past' },
                    { wk: 'W5–W7', name: '研究規劃\n文獻鑑識', status: 'past' },
                    { wk: 'W8–W10', name: '工具設計\n倫理審查', status: 'past' },
                    { wk: 'W13–W14', name: '圖表製作\n四層結論', status: 'past' },
                    { wk: 'W15', name: '報告組裝\n海報設計', status: 'now' },
                    { wk: 'W16', name: '成果發表\nGallery Walk', status: 'future' }
                ].map((item, idx) => (
                    <div key={idx} className={`arc-item ${item.status === 'past' ? 'past' : item.status === 'now' ? 'now' : ''}`}>
                        <div className="arc-wk">
                            {item.wk}{item.status === 'now' && ' ← 現在'}
                        </div>
                        <div className="arc-name">
                            {item.name}
                        </div>
                    </div>
                ))}
            </div>

            {/* CONCEPT SECTION */}
            <div className="section-head">
                <h2>學什麼</h2>
                <div className="line"></div>
                <span className="mono">CONCEPT</span>
            </div>

            {/* Session 1 */}
            <div className="flex items-center gap-4 my-8">
                <span className="font-mono text-[11px] font-bold bg-[#1a1a2e] text-white px-3 py-1 rounded-[4px] whitespace-nowrap">第一節</span>
                <div className="flex-1 h-[1px] bg-[#dddbd5]"></div>
                <span className="text-[12px] text-[#8888aa] whitespace-nowrap">文字工廠 · 報告七章組裝邏輯</span>
            </div>

            <span className="block text-[10px] font-mono text-[#8888aa] tracking-[0.1em] uppercase mb-2.5 mt-8">觀念一 · 組裝而非重寫——每週學習單就是你的原料</span>
            <div className="p-[11px_16px] bg-[#fdf6e3] text-[#7a6020] border-l-4 border-[#c9a84c] rounded-r-[6px] text-[12px] leading-[1.75] mb-4">
                💡 你不是「從無到有寫論文」。把菜色放進碗裡拼成一道大菜——學習單是食材，今天是出菜日。
            </div>

            {/* Chapter Map */}
            <div className="border border-[#dddbd5] rounded-[10px] overflow-hidden mb-12">
                <div className="p-[12px_20px] bg-[#1a1a2e] flex items-center gap-2.5">
                    <span className="font-mono text-[10px] bg-[#c9a84c] text-[#1a1a2e] px-2 py-0.5 rounded-[3px] font-bold uppercase tracking-wider">章節地圖</span>
                    <span className="text-[13px] font-bold text-white">每一章的原料藏在哪裡</span>
                </div>
                <div className="flex flex-col gap-[1px] bg-[#dddbd5]">
                    {[
                        { num: '01', ch: '引言', word: '150–200 字', from: 'W3–W4', desc: '研究動機（為什麼做這個研究）＋ 研究問題（你要回答的那個問題）' },
                        { num: '02', ch: '文獻探討', word: '250–350 字', from: 'W6', desc: '3 篇以上文獻摘要與比較，加一句：「目前研究的缺口或不足之處在於⋯⋯」' },
                        { num: '03', ch: '研究方法', word: '150–250 字', from: 'W10', desc: '研究方法名稱、參與者說明、工具說明、流程說明。加上：「本研究已取得知情同意（W10 倫理審查通過）」' },
                        { num: '04', ch: '研究結果', word: '200–300 字', from: 'W13–W14', desc: 'W14 四層結論中的「描述層」句子 ＋ W13 製作的圖表（標注圖一、圖二位置）' },
                        { num: '05', ch: '討論與結論', word: '200–300 字', from: 'W14', desc: '「詮釋層 + 回扣層 + 批判層」句子 ＋ 未來研究建議（你覺得下一步可以研究什麼？）' },
                        { num: '參', ch: '參考文獻', word: '直接複製', from: 'W6', desc: '直接從 W6 複製 APA 格式清單，確認格式統一即可' },
                        { num: '摘', ch: '摘要', word: '最後才做', from: 'AI 生成', desc: '其他六章完成後，用摘要 Prompt 生成初稿，再修改成自己的語氣（150–200 字）', highlighted: true }
                    ].map((item, idx) => (
                        <div key={idx} className={`grid grid-cols-[56px_200px_1fr] ${item.highlighted ? 'bg-[#fdf6e3]' : 'bg-white'}`}>
                            <div className={`flex items-center justify-center font-mono text-[18px] font-bold border-r border-[#dddbd5] p-3.5 ${item.highlighted ? 'bg-[#faebc8] text-[#c9a84c]' : 'bg-[#f0ede6] text-[#c8c5bc]'
                                }`}>
                                {item.num}
                            </div>
                            <div className="p-[14px_16px] border-r border-[#dddbd5] flex flex-col justify-center gap-0.5">
                                <div className="text-[13px] font-bold text-[#1a1a2e]">{item.ch}</div>
                                <div className={`font-mono text-[10px] ${item.highlighted ? 'text-[#7a6020]' : 'text-[#8888aa]'}`}>{item.word}</div>
                            </div>
                            <div className="p-[14px_16px] flex items-center gap-2.5">
                                <span className={`font-mono text-[10px] px-1.5 py-0.5 rounded-[3px] font-bold flex-shrink-0 ${item.highlighted ? 'bg-[#fdf6e3] text-[#7a6020] border border-[#e0c87a]' : 'bg-[#e8eeff] text-[#2d5be3]'
                                    }`}>
                                    {item.from}
                                </span>
                                <span className={`text-[12px] leading-snug ${item.highlighted ? 'text-[#7a6020]' : 'text-[#4a4a6a]'}`}>
                                    {item.desc}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <span className="block text-[10px] font-mono text-[#8888aa] tracking-[0.1em] uppercase mb-2.5 mt-8">觀念二 · 今天的三個角色</span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-[1px] bg-[#dddbd5] border border-[#dddbd5] rounded-[10px] overflow-hidden mb-3">
                {[
                    { emoji: '🙋', name: '搬運工', steps: 'Step 1 – 3', task: '尋找 W3–W10 的學習單，把引言、文獻、方法貼進報告，調好標題格式。' },
                    { emoji: '👩‍🔬', name: '數據官', steps: 'Step 4 – 5', task: '尋找 W13/W14 的圖表與四層結論句子，貼到第四章、第五章的正確位置。' },
                    { emoji: '🤖', name: 'AI 溝通師', steps: 'Step 6 – 7', task: '負責下達潤色、摘要、縫合 Prompt，並記錄 AI 建議與自己的裁奪。' }
                ].map((item, idx) => (
                    <div key={idx} className="bg-white p-[18px_16px]">
                        <div className="text-[22px] mb-2">{item.emoji}</div>
                        <div className="text-[13px] font-bold text-[#1a1a2e] mb-1">{item.name}</div>
                        <div className="font-mono text-[10px] text-[#2d5be3] bg-[#e8eeff] px-1.5 py-0.5 rounded-[3px] mb-2 inline-block font-bold uppercase tracking-wider">{item.steps}</div>
                        <div className="text-[12px] text-[#4a4a6a] leading-[1.75]">{item.task}</div>
                    </div>
                ))}
            </div>
            <div className="p-[11px_16px] bg-[#e8eeff] text-[#2d5be3] border-l-4 border-[#2d5be3] rounded-r-[6px] text-[12px] leading-[1.75] mb-8">
                💡 Solo 的同學：三個角色自己全包，按 Step 1 → 7 順序做，不要跳。
            </div>

            {/* AI Prompts */}
            <span className="block text-[10px] font-mono text-[#8888aa] tracking-[0.1em] uppercase mb-2.5 mt-8">觀念三 · 三個 AI 工具——用對時機</span>
            <div className="space-y-4 mb-8">
                {[
                    { id: 'promptA', tag: 'PROMPT A', title: '學術語言潤色（逐章使用）', body: prompts.promptA },
                    { id: 'promptB', tag: 'PROMPT B', title: '章節縫合（貼完全部章節後使用）', body: prompts.promptB },
                    { id: 'promptC', tag: 'PROMPT C', title: '摘要生成（最後才用）', body: prompts.promptC }
                ].map((item, idx) => (
                    <div key={idx} className="bg-[#1a1a2e] rounded-[10px] overflow-hidden shadow-sm">
                        <div className="p-[12px_20px] border-b border-white opacity-10 flex items-center gap-2.5 relative">
                            <span className="font-mono text-[10px] bg-[#c9a84c] text-[#1a1a2e] px-1.5 py-0.5 rounded-[3px] font-bold uppercase">{item.tag}</span>
                            <span className="text-[13px] font-bold text-white">{item.title}</span>
                        </div>
                        <div className="p-[18px_20px] text-[12px] text-white/70 leading-[1.9] font-mono whitespace-pre-wrap">
                            {item.body}
                        </div>
                        <CopyButton
                            text={item.body}
                            className="m-[0_20px_16px] p-[8px_16px] bg-white/10 hover:bg-white/15 text-white/70 hover:text-white border border-white/15 rounded-[5px] text-[12px] transition-all flex items-center gap-1.5 cursor-pointer"
                            label={`複製 ${item.tag}`}
                            successLabel="✓ 已複製！"
                        />
                    </div>
                ))}
            </div>
            <div className="p-[11px_16px] bg-[#fdecea] text-[#c0392b] border-l-4 border-[#c0392b] rounded-r-[6px] text-[12px] leading-[1.75] mb-12">
                ⚠️ AI 有時候為了讓文字「更豐富」而加入你沒有的細節，或者把「可能」拿掉變成武斷的說法。貼上 AI 改寫後，要逐句對照——它改的每一句你都要確認過。
            </div>

            {/* Poster Section */}
            <div className="flex items-center gap-4 my-8 mt-16">
                <span className="font-mono text-[11px] font-bold bg-[#1a1a2e] text-white px-3 py-1 rounded-[4px] whitespace-nowrap">第二節</span>
                <div className="flex-1 h-[1px] bg-[#dddbd5]"></div>
                <span className="text-[12px] text-[#8888aa] whitespace-nowrap">視覺工廠 · 海報「大少準亮」法則</span>
            </div>

            <span className="block text-[10px] font-mono text-[#8888aa] tracking-[0.1em] uppercase mb-2.5 mt-8">觀念四 · 海報的唯一任務是讓人走過來</span>
            <div className="p-[11px_16px] bg-[#fdf6e3] text-[#7a6020] border-l-4 border-[#c9a84c] rounded-r-[6px] text-[12px] leading-[1.75] mb-5">
                💡 聽眾在走過來的 3 秒內，決定要不要停下來聽你說話。那 3 秒靠的是你的海報，不是你的報告。
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-[1px] bg-[#dddbd5] border border-[#dddbd5] rounded-[10px] overflow-hidden mb-12">
                {[
                    { char: '大', label: '主標題要大', desc: '最重要的發現要大。從 3 公尺外也能看到標題和那個關鍵數字。', color: '#2d5be3' },
                    { char: '少', label: '字越少越好', desc: '每個區塊不超過三行。你的完整論文在報告裡，海報不需要完整。', color: '#2e7d5a' },
                    { char: '準', label: '只放最重要的', desc: '選你最震撼的那一個發現放中間，不是所有發現。其他的用口頭說。', color: '#c9a84c' },
                    { char: '亮', label: '圖表是武器', desc: 'W13 做的圖表放中間、放最大。圖說話比文字有力。', color: '#c0392b' }
                ].map((item, idx) => (
                    <div key={idx} className="bg-white p-[20px_16px] text-center">
                        <div className="font-serif text-[36px] font-bold mb-2 transition-transform hover:scale-110" style={{ color: item.color }}>{item.char}</div>
                        <div className="text-[12px] font-bold text-[#1a1a2e] mb-1.5">{item.label}</div>
                        <div className="text-[11px] text-[#4a4a6a] leading-[1.7]">{item.desc}</div>
                    </div>
                ))}
            </div>

            <span className="block text-[10px] font-mono text-[#8888aa] tracking-[0.1em] uppercase mb-2.5 mt-8">觀念五 · 好海報 vs 爛海報</span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[1px] bg-[#dddbd5] border border-[#dddbd5] rounded-[10px] overflow-hidden mb-12">
                <div className="bg-white p-[18px_20px]">
                    <div className="text-[11px] font-bold text-[#c0392b] mb-2.5 pb-2 border-b border-[#dddbd5] flex items-center gap-2">
                        <AlertTriangle size={14} /> ❌ 爛海報的特徵
                    </div>
                    {[
                        '標題是「探討某某對某某的影響研究」——沒人想停下來',
                        '文字滿版，沒有圖——讀者要花 3 分鐘才能看懂',
                        '所有發現都放上去——沒有重點，什麼都記不住',
                        '先做漂亮的背景花邊，文字最後才擠進去'
                    ].map((txt, i) => (
                        <div key={i} className="text-[12px] text-[#4a4a6a] leading-[1.75] py-[5px] border-t border-[#f0ede6] first:border-0">• {txt}</div>
                    ))}
                </div>
                <div className="bg-white p-[18px_20px]">
                    <div className="text-[11px] font-bold text-[#2e7d5a] mb-2.5 pb-2 border-b border-[#dddbd5] flex items-center gap-2">
                        <CheckCircle2 size={14} /> ✅ 好海報的特徵
                    </div>
                    {[
                        '標題用問句或驚人數字：「為什麼補越多越焦慮？」',
                        '中央放最強的那張圖，一眼看到趨勢或比例',
                        '只放一個最重要的發現，讓人想問你「然後呢？」',
                        '先畫線框圖確認版面邏輯，再開電腦排版'
                    ].map((txt, i) => (
                        <div key={i} className="text-[12px] text-[#4a4a6a] leading-[1.75] py-[5px] border-t border-[#f0ede6] first:border-0">• {txt}</div>
                    ))}
                </div>
            </div>

            <span className="block text-[10px] font-mono text-[#8888aa] tracking-[0.1em] uppercase mb-2.5 mt-8">觀念六 · 版面配置參考（線框圖）</span>
            <p className="text-[13px] text-[#4a4a6a] mb-3.5">這是一個建議版型，不是唯一答案——但符合「大少準亮」邏輯。</p>

            <div className="border-2 border-dashed border-[#c8c5bc] rounded-[10px] overflow-hidden mb-4 bg-white">
                <div className="grid grid-rows-[auto_1fr_auto] min-h-[340px]">
                    <div className="bg-[#1a1a2e] p-[18px_24px] text-center">
                        <div className="font-serif text-[15px] font-bold text-white/60 tracking-wider">大標題：吸引人停下來的問句或驚人數字</div>
                        <div className="text-[11px] text-white/30 mt-1 font-mono">研究組別 · 研究問題一句話版本</div>
                    </div>
                    <div className="grid grid-cols-[1fr_2fr_1fr] gap-[1px] bg-[#dddbd5]">
                        <div className="bg-[#f0ede6] p-[16px_14px]">
                            <div className="font-mono text-[9px] text-[#8888aa] tracking-widest uppercase mb-2">左區 · 研究動機</div>
                            <div className="space-y-1.5">
                                <div className="h-2 bg-[#dddbd5] rounded-[2px] w-[80%]"></div>
                                <div className="h-2 bg-[#dddbd5] rounded-[2px] w-[60%]"></div>
                                <div className="h-2 bg-[#dddbd5] rounded-[2px] w-[80%]"></div>
                            </div>
                            <div className="mt-4">
                                <div className="font-mono text-[9px] text-[#8888aa] tracking-widest uppercase mb-2">研究方法</div>
                                <div className="space-y-1.5">
                                    <div className="h-2 bg-[#dddbd5] rounded-[2px] w-[80%]"></div>
                                    <div className="h-2 bg-[#dddbd5] rounded-[2px] w-[60%]"></div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white flex flex-col items-center justify-center gap-2 border-x border-[#dddbd5] min-h-[160px]">
                            <div className="w-[100px] h-[80px] bg-[#f0ede6] border border-dashed border-[#c8c5bc] rounded-[6px] flex items-center justify-center text-[24px]">📊</div>
                            <div className="font-mono text-[9px] text-[#8888aa] tracking-widest uppercase text-center">最強圖表<br />放最大</div>
                        </div>
                        <div className="bg-[#f0ede6] p-[16px_14px]">
                            <div className="font-mono text-[9px] text-[#8888aa] tracking-widest uppercase mb-2">右區 · 關鍵發現</div>
                            <div className="space-y-1.5">
                                <div className="h-2 bg-[#dddbd5] rounded-[2px] w-[80%]"></div>
                                <div className="h-2 bg-[#dddbd5] rounded-[2px] w-[60%]"></div>
                                <div className="h-2 bg-[#dddbd5] rounded-[2px] w-[80%]"></div>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-[1fr_1fr_80px] gap-[1px] bg-[#dddbd5]">
                        <div className="bg-white p-[12px_14px]">
                            <div className="font-mono text-[9px] text-[#8888aa] tracking-widest uppercase mb-1.5">結論 1–3 點</div>
                            <div className="space-y-1">
                                <div className="h-[7px] bg-[#dddbd5] rounded-[2px] w-[90%]"></div>
                                <div className="h-[7px] bg-[#dddbd5] rounded-[2px] w-[75%]"></div>
                            </div>
                        </div>
                        <div className="bg-white p-[12px_14px] border-l border-[#dddbd5]">
                            <div className="font-mono text-[9px] text-[#8888aa] tracking-widest uppercase mb-1.5">研究限制 / 未來方向</div>
                            <div className="space-y-1">
                                <div className="h-[7px] bg-[#dddbd5] rounded-[2px] w-[80%]"></div>
                                <div className="h-[7px] bg-[#dddbd5] rounded-[2px] w-[65%]"></div>
                            </div>
                        </div>
                        <div className="bg-[#f0ede6] border-l border-[#dddbd5] flex items-center justify-center text-[28px]">📱</div>
                    </div>
                </div>
            </div>
            <div className="p-[11px_16px] bg-[#e8eeff] text-[#2d5be3] border-l-4 border-[#2d5be3] rounded-r-[6px] text-[12px] leading-[1.75] mb-12">
                🔑 這個版型的核心邏輯：中央的圖最大，所有文字區塊都是配角，用來幫圖說話。
            </div>

            {/* CLASS MISSION SECTION */}
            <div className="section-head mt-16">
                <h2>課堂任務</h2>
                <div className="line"></div>
                <span className="mono">IN-CLASS</span>
            </div>

            {/* Task 1 */}
            <div className="flex items-center gap-4 my-8">
                <span className="font-mono text-[11px] font-bold bg-[#1a1a2e] text-white px-3 py-1 rounded-[4px] whitespace-nowrap">第一節</span>
                <div className="flex-1 h-[1px] bg-[#dddbd5]"></div>
                <span className="text-[12px] text-[#8888aa] whitespace-nowrap">文字工廠 · 50 分鐘</span>
            </div>

            <div className="border border-[#dddbd5] rounded-[10px] overflow-hidden bg-white mb-4">
                <div className="p-[12px_20px] bg-[#f0ede6] border-b border-[#dddbd5] flex items-center gap-2.5">
                    <span className="font-mono text-[10px] bg-[#1a1a2e] text-white px-2 py-0.5 rounded-[3px] font-bold">TASK 1</span>
                    <span className="text-[14px] font-bold text-[#1a1a2e]">七步組裝（第一節 0:00–0:40，40 分鐘）</span>
                </div>
                <div className="p-6">
                    <p className="text-[13px] text-[#4a4a6a] mb-3.5 leading-[1.75]">依角色分工，按 Step 順序進行，搬運工＋數據官先動，AI 溝通師最後上場。</p>
                    <div className="border border-[#dddbd5] rounded-[10px] overflow-hidden mb-4">
                        {[
                            { num: '1', title: '第一章 引言', desc: '從 W3–W4 找出研究動機與研究問題，整合成 150–200 字的開場段落', time: '5 min', role: '搬運工' },
                            { num: '2', title: '第二章 文獻探討', desc: '從 W6 找出 3 篇以上文獻摘要，貼入並加一句「目前文獻的缺口在於⋯⋯」', time: '5 min', role: '搬運工' },
                            { num: '3', title: '第三章 研究方法', desc: '從 W10 找出方法名稱、參與者、工具、流程，加上倫理審查通過聲明', time: '5 min', role: '搬運工' },
                            { num: '4', title: '第四章 研究結果', desc: '從 W14 第一層（描述）取出客觀描述句，標注圖表放置位置（如圖一所示）', time: '10 min', role: '數據官' },
                            { num: '5', title: '第五章 討論與結論', desc: '從 W14 第二–四層（詮釋、回扣、批判）取出句子，加上未來研究建議', time: '5 min', role: '數據官' },
                            { num: '6', title: '參考文獻', desc: '從 W6 直接複製 APA 格式清單，確認所有文獻格式統一', time: '5 min', role: 'AI 溝通師' },
                            { num: '7', title: '摘要 最後做', desc: '六章都完成後，用 Prompt C 生成摘要初稿，修改後填入', time: '10 min', role: 'AI 溝通師', gold: true }
                        ].map((item, idx) => (
                            <div key={idx} className={`grid grid-cols-[52px_110px_1fr_80px] border-t border-[#dddbd5] first:border-0 ${item.gold ? 'bg-[#fdf6e3]' : 'bg-white'}`}>
                                <div className={`flex items-center justify-center font-mono text-[13px] font-bold border-r border-[#dddbd5] p-3.5 ${item.gold ? 'bg-[#faebc8] text-[#c9a84c]' : 'text-[#8888aa]'}`}>{item.num}</div>
                                <div className="p-3.5 text-[13px] font-bold text-[#1a1a2e] border-r border-[#dddbd5] flex items-center leading-tight whitespace-pre-line">{item.title}</div>
                                <div className="p-[14px_16px] text-[12px] text-[#4a4a6a] leading-[1.75] flex flex-col justify-center border-r border-[#dddbd5]">{item.desc}</div>
                                <div className={`p-3.5 flex flex-col items-center justify-center font-mono text-[10px] text-center leading-tight ${item.gold ? 'bg-[#faebc8] text-[#7a6020]' : 'bg-[#f0ede6] text-[#8888aa]'}`}>
                                    {item.time}<br /><span className="mt-1 opacity-70">{item.role}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="p-4 bg-[#fdf6e3] text-[#7a6020] rounded-[8px] text-[12px] mb-2 shadow-sm">
                        💡 如果第一章引言不知道怎麼開頭：先說你的研究問題是什麼，再往前退一步說「你是因為發現了什麼現象，才想問這個問題？」這兩句就是你的引言。
                    </div>
                    <div className="p-4 bg-[#fdecea] text-[#c0392b] rounded-[8px] text-[12px]">
                        ⚠️ 如果 AI 幫你加了你沒有說的事——刪掉，換成你自己的原話，或標記起來確認。「AI 補的數據」不算你的研究。
                    </div>
                </div>
            </div>

            {/* Task 2 */}
            <div className="border border-[#dddbd5] rounded-[10px] overflow-hidden bg-white mb-12">
                <div className="p-[12px_20px] bg-[#f0ede6] border-b border-[#dddbd5] flex items-center gap-2.5">
                    <span className="font-mono text-[10px] bg-[#1a1a2e] text-white px-2 py-0.5 rounded-[3px] font-bold">TASK 2</span>
                    <span className="text-[14px] font-bold text-[#1a1a2e]">縫合手術（第一節 0:40–0:50，10 分鐘）</span>
                </div>
                <div className="p-6">
                    <ol className="list-decimal pl-5 space-y-2 text-[13px] text-[#4a4a6a] leading-[2.2]">
                        <li>六章組裝完後，大聲朗讀一遍（或請旁邊同學讀）</li>
                        <li>找出讀起來「感覺換了一個人在說話」的那個銜接點</li>
                        <li>用 Prompt B 的縫合手術，在章節之間加過渡句</li>
                        <li>不要改內容，只統一語氣</li>
                    </ol>
                </div>
            </div>

            {/* Session 2 Tasks */}
            <div className="flex items-center gap-4 my-8 mt-12 text-[#8888aa]">
                <span className="font-mono text-[11px] font-bold bg-[#1a1a2e] text-white px-3 py-1 rounded-[4px] whitespace-nowrap">第二節</span>
                <div className="flex-1 h-[1px] bg-[#dddbd5]"></div>
                <span className="text-[12px] whitespace-nowrap">視覺工廠 · 50 分鐘</span>
            </div>

            {[
                {
                    id: 3,
                    title: '強制紙筆線框圖（第二節 0:00–0:15，15 分鐘）',
                    ol: ['翻到學習單 Part 2 的線框圖區，拿出筆', '在紙上畫出版面配置——標題在哪、哪張圖最大、重點條列在哪', '確認「大少準亮」四個法則都有體現', '畫完後拿給老師確認，才可以打開電腦'],
                    warning: '這 15 分鐘嚴禁打開電腦。先想清楚版面邏輯，再開 Canva。直接開電腦的結果是花 30 分鐘在調花邊，最後版面邏輯還是不對。'
                },
                {
                    id: 4,
                    title: '數位排版（第二節 0:15–0:40，25 分鐘）',
                    ol: ['依照線框圖，在 Canva 或 Google 簡報上排版', '先放標題和最重要的圖表，文字區塊最後填入', '老師巡迴確認：圖表有沒有放中間最大？字數有沒有超過？', '確認後再調背景色、字型等視覺細節'],
                    tip: '標題如果是「探討某某對某某的影響」，試著改成問句：「為什麼高中生越補習反而越焦慮？」——有沒有更想知道答案了？'
                },
                {
                    id: 5,
                    title: '同儕 3 秒互評（第二節 0:40–0:50，10 分鐘）',
                    ol: ['把你的海報草稿轉給左邊的同學看 3 秒，然後蓋住', '請他說出：「你看了 3 秒，記住的是什麼？」', '問你自己：你最重要的東西，有沒有在 3 秒內被記住？', '沒有被記住 → 把那個東西放更大、或刪掉干擾的元素'],
                    success: '互評完做最後調整，今天課後把報告初稿 ＋ 海報草稿上傳 Google Classroom。'
                }
            ].map((task, idx) => (
                <div key={idx} className="border border-[#dddbd5] rounded-[10px] overflow-hidden bg-white mb-4">
                    <div className="p-[12px_20px] bg-[#f0ede6] border-b border-[#dddbd5] flex items-center gap-2.5">
                        <span className="font-mono text-[10px] bg-[#1a1a2e] text-white px-2 py-0.5 rounded-[3px] font-bold">TASK {task.id}</span>
                        <span className="text-[14px] font-bold text-[#1a1a2e]">{task.title}</span>
                    </div>
                    <div className="p-6">
                        <ol className="list-decimal pl-5 space-y-2 text-[13px] text-[#4a4a6a] leading-[2.2]">
                            {task.ol.map((li, i) => <li key={i}>{li}</li>)}
                        </ol>
                        {task.warning && (
                            <div className="mt-4 p-4 bg-[#fdecea] text-[#c0392b] rounded-[8px] text-[12px]">⚠️ {task.warning}</div>
                        )}
                        {task.tip && (
                            <div className="mt-4 p-4 bg-[#fdf6e3] text-[#7a6020] rounded-[8px] text-[12px]">💡 {task.tip}</div>
                        )}
                        {task.success && (
                            <div className="mt-4 p-4 bg-[#e8f5ee] text-[#2e7d5a] rounded-[8px] text-[12px] flex items-center gap-2"><CheckCircle2 size={14} /> {task.success}</div>
                        )}
                    </div>
                </div>
            ))}

            {/* WRAP UP SECTION */}
            <div className="section-head mt-16">
                <h2>本週總結</h2>
                <div className="line"></div>
                <span className="mono">WRAP-UP</span>
            </div>

            <div className="border border-[#dddbd5] rounded-[10px] overflow-hidden mb-4 bg-white">
                <div className="p-[14px_20px] bg-[#f0ede6] border-b border-[#dddbd5] font-bold text-[14px] text-[#1a1a2e]">✅ 今天結束，你應該有</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-[1px] bg-[#dddbd5]">
                    {[
                        '七章報告初稿（含摘要），各章字數達標',
                        'AI 潤色紀錄至少一次，並說明自己的裁奪',
                        '海報草稿完成，通過 3 秒互評測試',
                        '報告初稿 ＋ 海報草稿上傳 Google Classroom'
                    ].map((item, idx) => (
                        <div key={idx} className="bg-white p-[14px_20px] flex items-start gap-2.5 text-[13px] text-[#4a4a6a]">
                            <CheckCircle2 size={16} className="text-[#2e7d5a] shrink-0 mt-0.5" />
                            <span>{item}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="border border-[#dddbd5] rounded-[10px] overflow-hidden mb-12 bg-white">
                <div className="p-[14px_20px] bg-[#f0ede6] border-b border-[#dddbd5] font-bold text-[14px] text-[#1a1a2e]">📋 課後作業</div>
                <div className="flex flex-col gap-[1px] bg-[#dddbd5]">
                    {[
                        { part: '報告定稿', name: '完成報告最終版，確認格式（APA、圖表標注、摘要）後上傳' },
                        { part: '海報定稿', name: '完成海報最終版，確認印製或電子展示方式，依老師規定準備' },
                        { part: '帶去 W16', name: '海報（紙本或電子）＋ 2 分鐘口頭說明話術，準備好 Gallery Walk' }
                    ].map((item, idx) => (
                        <div key={idx} className="bg-white p-[11px_20px] flex items-start gap-4">
                            <span className="font-mono text-[11px] text-[#2d5be3] font-bold w-[72px] shrink-0 pt-[1px] uppercase">{item.part}</span>
                            <span className="text-[13px] text-[#4a4a6a] flex-1 leading-[1.65]">{item.name}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Next Week Preview */}
            <div className="bg-[#1a1a2e] rounded-[10px] overflow-hidden mb-12 shadow-md">
                <div className="p-[16px_24px] border-b border-white opacity-5 flex items-center gap-2.5">
                    <span className="font-mono text-[10px] bg-white opacity-10 text-white px-2 py-0.5 rounded-[3px] font-bold uppercase tracking-wider">NEXT WEEK</span>
                    <span className="text-[14px] font-bold text-white uppercase tracking-wide">W16 Gallery Walk：你是報告者，也是聆聽者</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-[1px] bg-white/5">
                    <div className="p-[20px_24px]">
                        <div className="text-[10px] font-mono text-white/30 uppercase tracking-[0.08em] mb-2">W16 的規則</div>
                        <div className="text-[13px] text-white/75 leading-[1.75]">
                            A/B 兩組輪替，每個人都有兩個身分。<br /><br />
                            <strong className="text-[#c9a84c]">報告者</strong>：站在海報旁，2 分鐘說明你的研究，回答 4 場以上的問題。<br /><br />
                            <strong className="text-white/70">聆聽者</strong>：至少聆聽 4 組，完成 4 張筆記卡。
                        </div>
                    </div>
                    <div className="p-[20px_24px]">
                        <div className="text-[10px] font-mono text-white/30 uppercase tracking-[0.08em] mb-2">現在就可以準備的事</div>
                        <div className="text-[13px] text-white/75 leading-[1.75]">
                            練習 2 分鐘話術——說研究問題、說方法、說最重要的一個發現、說結論。<br /><br />
                            預想可能被問的問題：「你的樣本夠嗎？」「這個結果意外嗎？」「下一步你會怎麼研究？」
                        </div>
                    </div>
                </div>
            </div>

            {/* PAGINATION */}
            <div className="flex justify-between items-center py-10 border-t border-[#dddbd5]">
                <Link to="/w14" className="text-[13px] font-bold text-[#8888aa] hover:text-[#1a1a2e] transition-colors flex items-center gap-2">
                    <ArrowLeft size={16} /> 回 W14 研究結論
                </Link>
                <Link to="/w16" className="bg-[#1a1a2e] text-white px-8 py-2.5 rounded-[6px] text-[14px] font-bold hover:bg-[#4a4a6a] transition-all flex items-center gap-2 group">
                    前往 W16 Gallery Walk <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>
        </div>
    );
};
