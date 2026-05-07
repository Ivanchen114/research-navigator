/**
 * 研究員紅線 17 條 — W13 ~ W15 跨週共用知識骨幹
 *
 * 對應 FindTrapsReport.jsx 的反例：
 * - W13（資料整理）→ 雷 #1 / #9 / #10
 * - W14（視覺化）→ 雷 #8 / #11 / #12 / #13
 * - W15（結論）→ 雷 #2 / #3 / #4 / #5 / #6 / #7
 *
 * 用途：
 * - FindTrapsReport「全攤開總覽卡」（mode=full）
 * - W13Page / W14Page / W15Page「該週紅線卡」（mode=subset）
 *
 * 改規則只動這個檔。
 */

export const REDLINES = [
    // ═══ W13 · 資料整理階段 ═══
    {
        id: 'L01',
        stage: 'W13',
        stageLabel: '資料整理',
        tier: 'core',
        title: '異常 ≠ 自動剔除',
        body: '看到怪資料先「記錄」+「判斷」，再決定剔除 / 保留 / 修正。直接砍掉是研究最大的偏誤源。',
        wrong: '看到 12 小時是極端值就直接砍掉。',
        right: '列出所有極端值，研究者判斷後再決定（保留+敏感性檢查 / 剔除+註明理由）。',
        relatedTrap: 1,
    },
    {
        id: 'L02',
        stage: 'W13',
        stageLabel: '資料整理',
        tier: 'core',
        title: '剔除規則必須事前明示',
        body: '不是看到不順眼才砍——要寫下「N 標準差以外」「核心欄位空白」之類的事前標準。',
        wrong: '「剔除疑似填答不認真的樣本。」',
        right: '「依事前標準剔除：核心欄位空白者、明顯亂填者（如填 test）。」',
        relatedTrap: 9,
    },
    {
        id: 'L03',
        stage: 'W13',
        stageLabel: '資料整理',
        tier: 'advanced',
        title: '格式不一致先標準化',
        body: 'F/M → 男/女、空白標「未提供」、test → 視同空白。標準化的對應表要記下來。',
        wrong: '把 F、M、空白、test 全部視為缺失值，直接剔除。',
        right: '建立對應表：F → 女、M → 男；空白 → 未提供；test → 剔除（記錄原因）。',
    },
    {
        id: 'L04',
        stage: 'W13',
        stageLabel: '資料整理',
        tier: 'core',
        title: '保留處理紀錄',
        body: '「25 → 22」不能只是數字變化，要寫「為何剔除哪幾筆、依什麼規則」。讀者要能逆推。',
        wrong: '「最終獲得 22 筆有效分析樣本。」',
        right: '「25 → 22 筆（剔除原始編號 11、21、23，原因：核心欄位空白 / 整列空白 / 填 test）。」',
    },
    {
        id: 'L05',
        stage: 'W13',
        stageLabel: '資料整理',
        tier: 'advanced',
        title: '不可逆操作要小心',
        body: '砍掉的資料不能再回來——剔除前留一份原始備份。執行前先列影響面。',
        wrong: '「清理後的資料即為後續分析的唯一依據。」（暗示原始檔已被覆蓋）',
        right: '「保留原始檔（raw.csv），另存清理版（cleaned.csv）。」',
        relatedTrap: 10,
    },

    // ═══ W14 · 視覺化階段 ═══
    {
        id: 'L06',
        stage: 'W14',
        stageLabel: '視覺化',
        tier: 'core',
        title: '圖表標題要中性',
        body: '「睡眠 **與** 專注力的關係」OK。「睡眠 **影響** 專注力」NG——標題不下因果結論。',
        wrong: '「睡眠不足影響高中生專注力」',
        right: '「圖一：睡眠時數與上課專注力散佈圖（N=22）」',
        relatedTrap: 8,
    },
    {
        id: 'L07',
        stage: 'W14',
        stageLabel: '視覺化',
        tier: 'advanced',
        title: '軸 / 圖例 / 顏色不暗示因果',
        body: '不要用紅色畫「壞的」、綠色畫「好的」。視覺元素的價值判斷會偷渡進結論。',
        wrong: '補習組塗紅色、無補習組塗綠色。',
        right: '中性色或同色不同深淺；圖例僅標明「有補習 / 無補習」。',
    },
    {
        id: 'L08',
        stage: 'W14',
        stageLabel: '視覺化',
        tier: 'core',
        title: '圖說分兩段：描述 ≠ 推論',
        body: '描述段＝資料看到什麼（可量化）。推論段＝為什麼不能下因果結論（限制）。兩段分開寫。',
        wrong: '「圖中可見睡眠不足導致專注力下降。」（一句話混合描述+因果）',
        right: '描述：兩變項看似正向關聯。推論：本研究設計無法判斷因果方向。',
        relatedTrap: 12,
    },
    {
        id: 'L09',
        stage: 'W14',
        stageLabel: '視覺化',
        tier: 'core',
        title: '不過度修飾趨勢詞',
        body: '「明顯 / 強烈 / 完全跟隨」需要統計支撐。沒做相關係數、沒做檢定，就用「看似」「傾向」。',
        wrong: '「明顯呈正相關 / 完全跟隨睡眠時數變化」',
        right: '「初步看似正向關聯 / 傾向隨睡眠時數遞增」',
        relatedTrap: 11,
    },
    {
        id: 'L10',
        stage: 'W14',
        stageLabel: '視覺化',
        tier: 'advanced',
        title: '圖表是觀察工具，不是論證工具',
        body: '圖表只能呈現事實，不能取代結論段。「圖看起來這樣」≠ 「事情真的是這樣」。',
        wrong: '圖下直接寫：「結論：補習害睡眠。」',
        right: '圖下寫：「描述：補習組平均睡眠較少，差異原因留待結論章節討論。」',
    },

    // ═══ W15 · 結論撰寫階段 ═══
    {
        id: 'L11',
        stage: 'W15',
        stageLabel: '結論撰寫',
        tier: 'core',
        title: '相關 ≠ 因果',
        body: '「正相關」可以寫，「導致 / 影響 / 證實」絕對不行。沒有實驗操弄變項就不能談因果。',
        wrong: '「睡眠不足導致 / 影響專注力下降，本研究證實了這點。」',
        right: '「睡眠時數與專注力呈正相關（N=22 觀察到的關聯）。」',
        relatedTrap: 3,
    },
    {
        id: 'L12',
        stage: 'W15',
        stageLabel: '結論撰寫',
        tier: 'advanced',
        title: '小樣本不能用「高度 / 顯著」等強詞',
        body: '沒做相關係數、沒做檢定，就不能寫「高度正相關」「顯著差異」。N=22 用語要保守。',
        wrong: '「兩變項呈高度 / 顯著正相關」',
        right: '「初步呈現正向關聯（N=22 小樣本，需更多研究確認強度）」',
        relatedTrap: 2,
    },
    {
        id: 'L13',
        stage: 'W15',
        stageLabel: '結論撰寫',
        tier: 'advanced',
        title: '不腦補機制',
        body: '不要寫「因為熬夜壓縮了 REM 睡眠所以 X」這類沒檢驗的中介路徑。資料看不到的，不要編。',
        wrong: '「補習壓縮了睡眠時間，產生排擠效應。」',
        right: '「有補習組睡眠較少，但本研究未蒐集補習時長，無法判斷因果機制。」',
        relatedTrap: 5,
    },
    {
        id: 'L14',
        stage: 'W15',
        stageLabel: '結論撰寫',
        tier: 'advanced',
        title: '不下價值判斷',
        body: '「補習浪費時間」「現代教育的問題」是評論員。研究員只能說「兩組有差異」。',
        wrong: '「補習浪費時間 / 是現代教育的問題」',
        right: '「兩組學生在睡眠時數上有差異，差異原因有待進一步研究。」',
        relatedTrap: 4,
    },
    {
        id: 'L15',
        stage: 'W15',
        stageLabel: '結論撰寫',
        tier: 'advanced',
        title: '不過度推廣樣本',
        body: 'N=22 不能推到「台灣所有高中生」。應限縮：「在本研究 22 位學生中…」。',
        wrong: '「研究結果顯示，台灣所有高中生不該補習。」',
        right: '「在本研究 22 位高一學生中觀察到…」',
    },
    {
        id: 'L16',
        stage: 'W15',
        stageLabel: '結論撰寫',
        tier: 'core',
        title: '要寫研究限制段',
        body: '至少寫三件事：樣本侷限、自陳偏誤、橫斷限制。研究限制不是缺點，是專業。',
        wrong: '整篇沒提任何限制，看起來像 100% 確定的事實。',
        right: '「研究限制：(1) N=22 小樣本；(2) 自評可能受社會期許；(3) 橫斷研究無法判斷時間順序。」',
        relatedTrap: 7,
    },
    {
        id: 'L17',
        stage: 'W15',
        stageLabel: '結論撰寫',
        tier: 'advanced',
        title: '承認反向因果與共同原因',
        body: '不能只給單向解釋——「A 導致 B」可能其實是「B 導致 A」（反向）或「C 同時導致 A 和 B」（共同原因）。',
        wrong: '「補習導致睡眠減少。」（單向因果）',
        right: '「也可能是：睡眠不足者選擇補習補救（反向）；或共同原因：壓力大 → 補習+失眠。」',
        relatedTrap: 6,
    },
];

/* 階段對應的視覺色 — 與 FindTraps 的雷分組視覺一致 */
export const STAGE_THEME = {
    W13: { accent: '#0EA5E9', bg: '#F0F9FF', border: '#7DD3FC', label: '資料整理' },
    W14: { accent: '#8B5CF6', bg: '#F5F3FF', border: '#C4B5FD', label: '視覺化' },
    W15: { accent: '#E11D48', bg: '#FFF1F2', border: '#FDA4AF', label: '結論撰寫' },
};

/* 取得指定階段的紅線（可選 tier 篩選） */
export const getRedlinesByStage = (stage, tier = null) =>
    REDLINES.filter(r => r.stage === stage && (tier ? r.tier === tier : true));

/* 核心 8 條（必過）：W13×3、W14×3、W15×2 */
export const getCoreRedlines = () => REDLINES.filter(r => r.tier === 'core');

