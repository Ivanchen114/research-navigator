import React, { useState, useCallback, useEffect } from 'react';
import CourseArc from '../components/ui/CourseArc';
import './ToolRefinementPage.css';
import ThinkRecord from '../components/ui/ThinkRecord';
import AIREDNarrative from '../components/ui/AIREDNarrative';
import StepEngine from '../components/ui/StepEngine';
import HeroBlock from '../components/ui/HeroBlock';
import ExportButton from '../components/ui/ExportButton';
import ResetWeekButton from '../components/ui/ResetWeekButton';
import LessonMap from '../components/ui/LessonMap';
import GroupSizeSelector from '../components/ui/GroupSizeSelector';
import { W10Data } from '../data/lessonMaps';
import { readRecords } from '../components/ui/ThinkRecord';
import {
    CheckCircle2,
    Bot,
    Users,
    Copy,
    Check,
    Zap,
    Map,
} from 'lucide-react';

/* ══════════════════════════════════════
 *  資料常數
 * ══════════════════════════════════════ */

const METHOD_OPTIONS = [
    { id: 'questionnaire', label: '📋 問卷組' },
    { id: 'interview', label: '🎤 訪談組' },
    { id: 'experiment', label: '🧪 實驗組' },
    { id: 'observation', label: '👀 觀察組' },
    { id: 'literature', label: '📚 文獻組' },
];

/* — W10 第六章「填具體題目」工具包：5 種方法各一份範例 + AI 啟動 prompt — */
const TOOL_DESC_KIT = {
    questionnaire: {
        label: '📋 問卷組',
        structure: {
            title: '題型庫 + 結構',
            types: [
                { name: '單選題', use: '互斥分類（一個對象只能屬一類）', ex: '性別、年級、類組' },
                { name: '複選題', use: '可同時成立的多選項', ex: '「常用的學習方式（可複選）」' },
                { name: '量表（李克特）', use: '測態度／頻率／程度', ex: '5 點量表「非常同意 → 非常不同意」' },
                { name: '排序題', use: '比較優先級', ex: '「請依重要性排列以下 5 個因素」' },
                { name: '開放短答', use: '補抓量化抓不到的細節', ex: '「為什麼選這個？」（限 30 字）' },
            ],
            template: '開場（含知情同意）→ 基本資料 3 題 → 變項題 3-5 題／變項 → 結尾致謝',
        },
        principles: [
            '每題對應一個變項（W9 變項拆解）—不該有題目沒對應到任何變項',
            '量表點數判斷：5 點（含中位）給「中立」空間 vs 4 點強制表態',
            '選項要互斥窮盡—把所有可能填答都涵蓋（必要時加「其他」/「不適用」）',
            '敏感題（情緒、家庭、成績）放後段，先建立填答節奏再問',
            '總題數 10-25 題、可在 5 分鐘內填完—超過會掉答率',
        ],
        traps: [
            '誘導性：用「嚴重／非常好」暗示答案 → 改中性「你覺得 X 對 Y 的影響是？」搭雙向量表',
            '雙重問題：一題問兩件事「你的家庭跟壓力如何？」→ 拆兩題',
            '假開放：看似開放實已預設方向 → 改真正開放或完全中性、不暗示立場',
            '選項不互斥（重疊）：年齡選項「15-17」和「17-19」← 17 歲選哪個 → 改邊界清楚：0、1-2、3-4、5+',
            '選項不全：受訪者找不到自己的答案 → 加「其他：___」或範圍補完整',
            '量表方向反轉沒提示：第 5 題「越同意越好」第 6 題突然「越同意越糟」→ 受訪者沒注意到',
            '量表級距太細：11 點量表會讓受訪者選不出來，5-7 點是甜蜜點',
        ],
        example: `【示範主題】高中生睡眠時數與學業表現的關係

(一) 問卷結構
| 部分 | 主題 | 題數 |
| 第 1 部分 | 開場與知情同意 | 簡介段 |
| 第 2 部分 | 基本資料 | 3 題 |
| 第 3 部分 | 變項 1：睡眠時數 | 3 題 |
| 第 4 部分 | 變項 2：學業表現 | 3 題 |
| 第 5 部分 | 結尾致謝 | 1 題 |

(二) 題目類型：☑ 單選題 ☑ 量表題

(三) 基本資料題
B1. 你目前的年級是？（單選：高一 / 高二 / 高三）
B2. 你的生理性別是？（單選：男 / 女 / 不願透露）
B3. 你的類組是？（單選：一類 / 二類 / 三類 / 四類 / 尚未分類）

(四) 主要研究題
【變項 1：睡眠時數】
Q1-1. 過去一週你大約幾點上床睡覺？（單選：22:00 前 / 22-23 / 23-24 / 24-01 / 01 後）
Q1-2. 過去一週你大約幾點起床？（單選同上時段）
Q1-3. 你覺得自己平均每天睡幾小時？（單選：< 5 / 5-6 / 6-7 / 7-8 / > 8）

【變項 2：學業表現】
Q2-1. 你最近一次段考的總平均分數大約是？（單選：< 60 / 60-69 / 70-79 / 80-89 / 90+）
Q2-2. 你覺得這次成績比上次（單選：進步 / 持平 / 退步）
Q2-3. 你覺得這次成績有多少受睡眠影響？（5 點量表：完全沒影響 → 影響很大）

(五) 自檢
☑ 每題對應到第四章某個變項
☑ 用具體時段／量表，沒用「常常」「偶爾」這類模糊詞
☑ 總題數 10 題，5 分鐘內可填完`,
        prompt: `我是高中研究方法課的學生（問卷組），要在計畫書 docx 第六章填具體題目。

我的研究問題：[貼上你的研究問題]
我的第四章變項：[列出你的 2-4 個變項]
研究對象：[貼上 W8 寫的研究對象]

請依我的變項，給我以下幫助：

1. 建議問卷的整體結構（幾個部分、各部分主題、預計題數）
2. 基本資料題 3-5 題的【方向】（單選題格式提示）
3. 每個變項建議 3-5 題的【方向】（不要寫完整題幹，給我具體可問的角度）
4. 提醒哪個變項最容易掉進「雙重問題」「誘導性」「選項不互斥」三個陷阱

⚠️ 第 3 點給「方向」就好，不要替我寫完整題目——我自己照方向寫到 docx 第六章。寫完後我會再貼給你檢查。`,
    },
    interview: {
        label: '🎤 訪談組',
        structure: {
            title: '題型庫 + 訪綱結構',
            types: [
                { name: '開放式提問', use: '要的是「故事」不是「答案」', ex: '「當初決定補習的契機是什麼？」' },
                { name: '具體經驗題', use: '從具體事件切入', ex: '「上次發生 X 時，你想什麼？」' },
                { name: '比較題', use: '激發對比反思', ex: '「跟你弟弟的選擇有什麼不同？」' },
                { name: '假設情境題', use: '探索價值觀／可能性', ex: '「如果可以重來一次，會怎麼選？」' },
                { name: '建議／忠告題', use: '收尾很適合', ex: '「對學弟妹有什麼建議？」' },
            ],
            template: '開場（含錄音同意）→ 暖身 1-2 題 → 核心 5 大問（由淺入深）→ 收尾',
        },
        principles: [
            '開放式 ＞ 封閉式—要對方說故事，不是給選項',
            '一次一個概念（不雙重問）—「你的家庭跟壓力如何」就是兩件事',
            '從具體到抽象—先問「上次發生 X 時」再問「你怎麼看 X」',
            '留追問模板（這是訪談者最重要的工具）：「可以舉例嗎？」「那時候你想什麼？」「然後呢？」',
            '訪談者反應要中性—不點頭、不說「對對對」，避免誘導',
        ],
        traps: [
            '誘導性（語氣／用詞）：「你覺得這個政策很糟對吧？」← 預設受訪者立場 → 改中性「你對這政策的感受是？」',
            '雙重問題：一題問兩件事「你的家庭跟壓力如何？」→ 拆兩題',
            '假開放（預設方向）：「你覺得補習有用嗎？」← 已預設「應該有用」這個方向 → 改「補習對你有什麼影響？」',
            '太抽象：「你的學習動機強嗎？」← 對方答不出來，要改具體事件題',
            '一問就答完（封閉化失敗）：「你補習嗎？」← 改「補習的決定是怎麼做的？」',
            '連續追「為什麼」：「為什麼？」「為什麼？」「為什麼？」← 像審問，改成「能多說一點嗎」',
            '訪談者話太多：訪談變成你在發表，受訪者只是同意—應該你說 20%、他說 80%',
        ],
        example: `【示範主題】高中生選擇補習的決策歷程

(一) 訪綱結構
開場（含錄音同意）→ 暖身 1-2 題 → 核心大問題 5 題 → 收尾

(二) 開場逐字念
您好，感謝接受訪談。我是 ___ 年級的 ___，正在研究「高中生補習決策歷程」。
本次訪談預計 30-40 分鐘，為了完整紀錄想徵求您同意全程錄音（僅用於本研究、結束後刪除）。
過程您可以隨時拒答或結束，不會有影響。可以開始嗎？

(三) 暖身問題（2 題）
1. 可以分享你目前的補習狀況嗎？哪幾科、補了多久？
2. 你還記得最一開始決定補習是什麼時候嗎？

(四) 核心大問題（5 題，由淺入深）
Q1：當初決定補習的契機是什麼？
   ‧ 追問：誰先提的？爸媽 / 同學 / 自己？
   ‧ 追問：可以舉個具體場景嗎？
Q2：選哪間補習班是怎麼決定的？
   ‧ 追問：考慮了哪些因素？哪個最重要？
Q3：補習的過程跟你原本預期一樣嗎？
   ‧ 追問：有什麼出乎意料的？
Q4：如果可以重來一次，你會用同樣方式做決定嗎？
   ‧ 追問：什麼因素讓你想改？
Q5：對學弟妹要決定補不補習，你會給什麼建議？
   ‧ 追問：跟你當初被建議的有什麼不同？

(五) 收尾
還有什麼想補充的嗎？感謝您的時間。`,
        prompt: `我是高中研究方法課的學生（訪談組），要在計畫書 docx 第六章填訪綱具體題目。

我的研究問題：[貼上]
第四章訪談主題：[列出 2-4 個主題]
研究對象：[貼上]

請幫我：

1. 建議訪綱的整體結構（暖身、核心、收尾各幾題）
2. 暖身問題 1-2 題的【方向】
3. 每個訪談主題建議 1-2 個大問題的【方向】（不要寫完整題幹，給開放式提問的角度即可）
4. 提醒哪個主題最容易掉進「封閉式提問」「雙重問題」「預設立場」陷阱
5. 給我每題可用的 1-2 個追問模板

⚠️ 第 3 點給「方向」就好，我自己照方向寫到 docx 第六章。寫完再貼給你檢查。`,
    },
    experiment: {
        label: '🧪 實驗組',
        structure: {
            title: '結構：假設 → 變項定義 → 流程 → 數據紀錄',
            types: [
                { name: '真實驗', use: '隨機分派受試者到實驗/對照組', ex: '60 人志願者抽籤分 30+30' },
                { name: '準實驗', use: '用既有群體（不能隨機分派）', ex: '高一甲班 vs 高一乙班' },
                { name: '前後測', use: '同一群人介入前後測一次', ex: '同班介入前測 → 介入 → 後測' },
                { name: '【自科】重複測量', use: '同樣本／材料測 N 次取平均', ex: '同份溶液濃度測 10 次' },
                { name: '【自科】變因比較', use: '改變一個自變因看依變因', ex: '不同濃度鹽水對綠豆發芽率' },
            ],
            template: '研究假設 → 變項定義（自/依/控制）→ 實驗流程 Step 1-5 → 數據紀錄表',
        },
        principles: [
            '變項操作型定義要可測量—「他變得開心」不行，要「微笑次數 ≥ 3 次/分鐘」',
            '控制變項要列具體—時段、場地、指導語、設備（自科：溫度、濕度、儀器精度）',
            '介入要寫成 SOP—任何人照做都得到一樣的結果',
            '樣本量要可達成—高一研究通常 < 30 人；自科樣本至少重複 5-10 次',
            '預先定義「成功 vs 失敗」標準—等做完才定義會變成資料挑揀（cherry-picking）',
        ],
        traps: [
            '混淆變項：實驗組早上做、對照組下午做 → 時段也變了 → 不知道是介入還是時段在影響',
            '霍桑效應：受試者知道在被研究 → 行為改變（社科版獨有，自科樣本沒這問題）',
            '樣本偏差：找朋友當受試者 → 不代表母群',
            '操作型定義模糊：「測量學生專注度」← 怎麼測？要寫「每 5 分鐘看視線停留書本秒數」',
            '霍桑/實驗者效應：你期待結果發生 → 不自覺給暗示／挑樣本',
        ],
        naturalScienceNote: {
            title: '🧪 自然科學實驗適用提醒（化學／物理／生物樣本實驗）',
            body: '本工具書計畫書原本針對「人類受試者」設計（社會心理學實驗）。如果你做的是化學／物理／生物樣本實驗，主架構通用，但有以下對應要調整：',
            mappings: [
                { social: '受試者（人）', natural: '樣本／材料（溶液、植物、物品）' },
                { social: '隨機分派／知情同意', natural: '隨機抽樣／實驗安全防護（護目鏡／手套／通風）' },
                { social: '霍桑效應、社會期許偏差', natural: '儀器誤差、純度污染、環境變動（溫度／濕度／光照）' },
                { social: '排除條件「近 3 天失眠者」', natural: '排除條件「儀器校正逾期 ＞ 7 天」「樣本污染」' },
                { social: '20-30 人受試', natural: '至少重複 5-10 次取平均（單樣本多次測）' },
                { social: '指導語逐字稿', natural: '操作 SOP（精確到秒、毫升、攝氏度）' },
            ],
            tip: '💡 倫理章節從「知情同意／不傷害」改成「實驗安全／廢棄物處理／生物風險（如有活體）」。如果樣本是動物或植物，仍需考量倫理保護（避免不必要傷害）。',
        },
        example: `【示範主題】背景音樂（古典樂 vs 安靜）對短期記憶測驗表現的影響

(一) 研究假設
聽 60 BPM 古典樂的學生，短期記憶測驗分數會比安靜環境組高。

(二) 變項定義
‧ 自變項：背景音樂類型
   操作定義：實驗組播放 60 BPM 古典樂（莫札特 K.448）15 分鐘；對照組安靜 15 分鐘。
   分組：隨機分配，每組 15 人。
‧ 依變項：短期記憶分數
   測量：標準化 30 題單字記憶測驗，每題 1 分（共 30 分）。
‧ 控制變項：
   1. 同一時段（下午 14:00-14:30）
   2. 同一教室（光線、溫度一致）
   3. 同一份測驗（題目順序固定）
   4. 同一指導語（用錄音播放避免老師口氣差異）

(三) 實驗流程（Step 1-5）
Step 1：發放知情同意書，受試者簽名（5 min）
Step 2：隨機分組（抽籤），實驗組進 A 教室、對照組進 B 教室（5 min）
Step 3：A 教室播放古典樂 / B 教室安靜，兩組同時開始記憶 30 個英文單字（15 min）
Step 4：兩組同時做測驗（10 min）
Step 5：回收測驗、致謝、解釋研究意義（5 min）

(四) 數據紀錄表
| 受試者代號 | 組別 | 測驗分數 | 備註 |`,
        prompt: `我是高中研究方法課的學生（實驗組），要在計畫書 docx 第六章填實驗計畫具體內容。

我的研究問題：[貼上]
研究假設：[「A 會影響 B」格式]
研究對象：[受試者描述]

請幫我：

1. 把假設拆成具體的自變項與依變項，給【操作型定義方向】
2. 控制變項建議列 4 項（哪些跨組要保持一致）
3. 流程 Step 1-5 的【方向】（每步要做什麼，不要寫指導語細節）
4. 數據紀錄表建議欄位
5. 提醒最容易出現「混淆變項」「霍桑效應」「樣本偏差」的陷阱在哪

⚠️ 操作型定義給方向就好，我自己照寫到 docx。指導語逐字稿不要寫——那是 W11 才做。`,
    },
    observation: {
        label: '👀 觀察組',
        structure: {
            title: '結構 + 紀錄方式',
            types: [
                { name: '參與式觀察', use: '你進入現場互動', ex: '加入社團活動觀察互動' },
                { name: '非參與式觀察', use: '你在旁不互動', ex: '坐教室後方紀錄自習行為' },
                { name: '時間取樣', use: '每 N 分鐘紀錄一次', ex: '每 5 分鐘紀錄全班行為類別' },
                { name: '事件取樣', use: '事件發生就紀錄', ex: '只紀錄「滑手機」事件何時發生' },
                { name: '行為清單', use: '預先定義 N 個類別，勾選', ex: '專注／滑手機／聊天 三選一' },
            ],
            template: '觀察目的 → 情境（時段/地點/對象）→ 行為類別（含正反例）→ 紀錄方式 → 倫理保護',
        },
        principles: [
            '操作型定義要有「正例 + 反例」—讓觀察者一秒判斷得出歸哪類',
            '類別要互斥—一個行為只能歸一類，不能 A 也對 B 也對',
            '時間取樣 vs 事件取樣依「人數密度」選—30 人同時看就用時間取樣（每 5 min 一筆）',
            '倫理：對象要知情同意（學校場合需家長/老師同意）',
            '預先試跑 5-10 分鐘—正式觀察前用試紀錄表跑一遍，會抓到漏的類別',
        ],
        traps: [
            '觀察者效應：對方知道被觀察 → 行為改變（這是觀察組獨有的核心問題）',
            '觀察者偏誤：「你想看到的會看到」—預期某行為會發生，於是看到的都歸那類',
            '紀錄速度跟不上：30 人同時觀察、5 分鐘一筆會來不及 → 改 10 分鐘一筆或縮減人數',
            '類別灰色帶：「滑手機 vs 使用手機查資料」很難分 → 要在類別定義加「正反例」具體區分',
            '推測代替觀察：紀錄「他在發呆」← 你不知道他發呆，只能紀錄「視線未停留書本」',
        ],
        example: `【示範主題】高中生自習課專注行為觀察

(一) 觀察目的
紀錄高一學生在自習課的專注／分心行為頻率與型態，分析自習課的實際使用狀況。

(二) 觀察情境
‧ 時段：每週三 12:30-13:00（午休自習時間）
‧ 地點：高一某班教室（取得導師同意）
‧ 對象：30 位學生（用代號 S01-S30）
‧ 觀察者位置：教室後方角落，不參與互動

(三) 行為操作型定義（3 個指標）
1. 專注：視線停留書本／作業 ≥ 30 秒
   正例：寫筆記、翻書頁
   反例：抬頭看別人不算
2. 滑手機：手中握有手機 ≥ 5 秒
   正例：滑、看、打字
   反例：只是放在桌上不算
3. 組內聊天：對話超過 1 句
   正例：討論作業 / 閒聊
   反例：單句問借東西不算

(四) 紀錄方式
時間取樣：每 5 分鐘一筆紀錄（共 6 筆 / 場）
選擇理由：30 人同時觀察，事件取樣會來不及記。

(五) 紀錄表欄位
| 時間 | 代號 | 行為類別 | 持續時間 | 備註 |
| 12:30 | S01 | 專注 | 持續中 | - |
| 12:35 | S02 | 滑手機 | 約 3 分鐘 | 看影片 |

(六) 倫理保護
‧ 取得導師同意 + 全班口頭知情同意
‧ 用代號不寫姓名、不拍照、不錄影
‧ 結束後告知班級研究結果`,
        prompt: `我是高中研究方法課的學生（觀察組），要在計畫書 docx 第六章填觀察具體內容。

我的研究問題：[貼上]
要觀察的行為／現象：[貼上]
觀察情境：[時段、地點]

請幫我：

1. 觀察目的的清楚陳述（連結到研究問題）
2. 觀察情境的具體設定建議（對象人數、觀察者位置）
3. 行為操作型定義 3 個指標的【方向】（每個給「正例 vs 反例」的提示，不要替我下定義）
4. 紀錄方式建議（時間取樣 vs 事件取樣，為什麼）
5. 紀錄表欄位建議
6. 倫理保護需要做哪幾件事

⚠️ 操作型定義給方向 + 正反例方向，我自己照寫到 docx。`,
    },
    literature: {
        label: '📚 文獻組',
        structure: {
            title: '4 子類型結構（必選一）',
            types: [
                { name: '② 歷史分析', use: '推論過去事件的脈絡與因果', ex: '時間軸 + 關鍵事件 + 因果鏈' },
                { name: '③ 內容分析', use: '量化文本中的詞頻／類別比例', ex: '編碼表 × 操作型定義 × 計數單位' },
                { name: '④ 論述分析', use: '解讀意識形態／話語策略／權力', ex: '軸線設計 + 話語策略清單' },
                { name: '⑤ 敘事分析', use: '分析故事的結構／角色／聲音', ex: '情節結構圖 + 角色功能表' },
            ],
            template: '⚠️ 文獻分析 ≠ 文獻回顧。把文獻當「研究對象」分析，不是整理前人論文。\n結構：子類型選定 → 分析對象 → 資料來源 → 納入排除標準 → 分析架構',
        },
        principles: [
            '子類型先選定，再選對應架構—不能用內容分析架構做敘事分析',
            '納入排除標準要明確（時間範圍、來源、長度）—「2020-2024 完整演說稿」比「最近 5 年文章」具體',
            '【內容/論述適用】要算雙人編碼一致率—2 人獨立編 20% 樣本，一致率 ≥ 80% 才正式編碼',
            '抽樣要說清楚—全文還是隨機抽段？挑樣本的邏輯是什麼？',
            '架構先於分析—編碼表寫好再開始編，不是邊編邊改',
        ],
        traps: [
            '子類型混搭：用內容分析架構做敘事分析 → 結果荒謬',
            '納入標準太鬆：「跟 X 有關的文章」← 怎麼算「有關」？無法歸納',
            '編碼類別太細：100 個類別 → 雙人一致率永遠不過 → 改 5-10 個大類',
            '抽樣偏差：只挑符合預期的文本 → 結論早就決定了，分析只是包裝',
            '架構抄前人沒調整：直接套用論文用過的編碼表 → 跟你的研究問題不對',
        ],
        example: `【示範主題】近 5 年總統雙十演說中「民主」概念的論述變化（④ 論述分析）

⚠️ 文獻分析 ≠ 文獻回顧：本研究是把演說稿當「研究對象」分析，不是整理前人論文。

(一) 子類型：④ 論述分析
選擇理由：研究問題要解讀「民主」這個概念在不同時期的論述如何變化，論述分析最適合解讀意識形態與話語策略。

(二) 分析對象
2020-2024 年總統雙十演說 5 篇，全文（每篇約 5,000 字）。

(三) 資料來源
總統府官網「歷年國慶文告」、聯合報資料庫。

(四) 納入排除標準
‧ 時間：2020-2024
‧ 文本：完整演說稿（去除互動橋段）
‧ 排除：媒體轉述版

(五) 分析架構
本研究用「論述分析」，架構如下：

軸線設計（兩條對立軸線）：
‧ 軸線 1：自由 vs 平等（自由偏向個人權利、平等偏向社會公平）
‧ 軸線 2：個人 vs 集體（個人公民個體 vs 國家民族）

話語策略類別（4 類）：
‧ 訴諸共同體（用「我們」消彌歧異）
‧ 訴諸歷史（援引過往事件）
‧ 訴諸權威（引用憲法／領袖）
‧ 訴諸對立（建立內外敵我）

(六) 雙人編碼一致率規劃
本研究為論述分析，需要 2 位編碼者獨立編碼前 1 篇演說（20% 樣本），計算軸線與策略分類的一致率。要求 ≥80% 才能正式編碼，否則回頭調整定義。`,
        prompt: `我是高中研究方法課的學生（文獻分析組）。

⚠️ 「文獻分析」是把文獻當研究對象，不是「文獻回顧」。

我的研究問題：[貼上]
我的子類型（必選 1 種）：[② 歷史 / ③ 內容 / ④ 論述 / ⑤ 敘事]
分析對象：[什麼來源、時間範圍、規模]

請依我的子類型，幫我：

1. 子類型選擇的理由（連結研究問題）
2. 分析對象的具體列出方向（來源／時間／規模）
3. 資料來源建議（2 個資料庫）+ 納入排除標準
4. 分析架構的【方向】（依子類型）：
   - 歷史：時間軸切割原則 + 關鍵事件選法
   - 內容：3-5 個編碼類別的方向（不要寫操作定義）
   - 論述：兩條軸線設計方向 + 話語策略類別
   - 敘事：情節結構單位 + 角色功能類別
5. 【內容／論述適用】雙人編碼一致率怎麼規劃

⚠️ 給「方向」就好，我自己照寫到 docx 第六章對應欄位。完整編碼表細節是 W11 才做。`,
    },
};

/* — 文獻分析法 4 子類型（對齊 W9 計畫書第一章勾選） — */
const LIT_SUBTYPES = [
    {
        id: 'history',
        label: '② 歷史分析',
        icon: '📜',
        defn: '用史料推論過去事件的脈絡、原因、演變',
        deliverable: '時間軸 + 關鍵事件清單 + 事件因果鏈',
        archExample: '1945 → 接收 → 1947 衝突 → 1949 清鄉，標註事件間的因果鏈',
        steps: [
            'Step 1：建立時間軸（依年份／事件排列）',
            'Step 2：標註關鍵事件（哪些是轉折點？）',
            'Step 3：推論事件間的因果關係',
            'Step 4：對照不同史料檢驗推論',
            'Step 5：（如有）寫出歷史敘事段落',
        ],
        templateUrl: 'https://docs.google.com/spreadsheets/d/1vvtTwR2_9F293I0GozYZc6zsGluTcfIY1NlHb2TpdgA/copy',
        templateName: '05a_文獻_歷史分析_工具',
    },
    {
        id: 'content',
        label: '③ 內容分析',
        icon: '📊',
        defn: '統計文本中的詞頻、類別、主題比例（量化為主）',
        deliverable: '編碼表（類別 × 操作型定義 × 計數單位）+ 雙人編碼一致率 ≥80%',
        archExample: '主角性別（男/女/其他）× 職業類型（專業/家庭/無）× 年份',
        steps: [
            'Step 1：訓練編碼員（2 人以上，最好是組員互相）',
            'Step 2：雙人獨立編碼 10–20% 樣本',
            'Step 3：計算編碼者一致率（≥80% 才正式編碼）',
            'Step 4：完成全樣本編碼',
            'Step 5：統計結果（次數／比例／關聯）',
        ],
        templateUrl: 'https://docs.google.com/spreadsheets/d/1C_McYlh5zqyS216cAdSvorMzOZ4U8W56_bQFpYHlEdY/copy',
        templateName: '05b_文獻_內容分析_工具',
    },
    {
        id: 'discourse',
        label: '④ 論述分析',
        icon: '🗣️',
        defn: '解讀文本背後的意識形態、話語策略、權力關係',
        deliverable: '框架／軸線分類表 + 話語策略清單（誰說／為誰說／怎麼說）',
        archExample: '「民主」的兩條軸線：自由 vs 平等、個人 vs 集體；用哪種修辭讓某軸線看起來更自然',
        steps: [
            'Step 1：通讀標註代表性段落',
            'Step 2：用架構（軸線／框架）分類段落',
            'Step 3：辨識話語策略（誰在說／為誰說／怎麼說）',
            'Step 4：歸納意識形態模式',
            'Step 5：（如有）對比不同文本的論述差異',
        ],
        templateUrl: 'https://docs.google.com/spreadsheets/d/1p4RCHe_uXwGs0NkwLoz_7XOrmAX35d3mhad7DmxBQjQ/copy',
        templateName: '05c_文獻_論述分析_工具',
    },
    {
        id: 'narrative',
        label: '⑤ 敘事分析',
        icon: '📖',
        defn: '分析故事的結構、角色、敘事聲音與模式',
        deliverable: '情節結構圖 + 角色功能表 + 敘事聲音標註',
        archExample: '開端／衝突／轉折／結局；受害者 vs 加害者立場切換；第一／第三人稱',
        steps: [
            'Step 1：拆解每則故事的情節結構（開端／衝突／轉折／結局）',
            'Step 2：標註角色功能（推動者／反對者／旁觀者）',
            'Step 3：比對敘事模式的異同',
            'Step 4：歸納常見模式',
            'Step 5：（如有）解讀模式背後的文化意涵',
        ],
        templateUrl: 'https://docs.google.com/spreadsheets/d/1h5qymclzSox-t-gKvjL9iU8d48N4ORMxcPFX2hkQ70g/copy',
        templateName: '05d_文獻_敘事分析_工具',
    },
];

/* — W9 組裝模板（與 W9 ASSEMBLY_TASKS 同步） — */
const TEMPLATES = {
    questionnaire: { url: 'https://docs.google.com/document/d/1tu-WF_JitJIwBZBHrrgm3MeFMDykpm_gGZoyrB4UkOI/copy',    name: '01_問卷_工具' },
    interview:     { url: 'https://docs.google.com/document/d/1BU6XyNxdwng6I15pwYXfRs-zwKgDDyF_EVc2T6uUCrs/copy',    name: '02_訪綱_工具' },
    experiment:    { url: 'https://docs.google.com/document/d/1evcQ6-97mhkhsLz4RHDEGp9P_LkjAeIKUcvusBtc0d8/copy',    name: '03_實驗_工具設計表' },
    observation:   { url: 'https://docs.google.com/spreadsheets/d/1QMqW2AAlc1s_gNfiY3jkFCy0CHpYz2GX9ZmgpShUm7s/copy', name: '04_觀察紀錄表_工具' },
    /* 文獻組依 litSubtype 動態選 URL，見 LIT_SUBTYPE_TEMPLATES 與 W10 選擇器的下載按鈕 */
    literature:    { url: 'https://drive.google.com/drive/folders/1-UtVZM8dyo20s2vbnx3UCWm-lR8YROU6',                name: '05_文獻分析_工具（資料夾，依子類型挑）' },
};

/* — 工具檢核共用前置：進度自評（W10 第一節學生工具還在雛形，給 AI 校準） — */
const TOOL_CHECK_INTRO = `【我的工具進度自評】（從「方向／雛形／精修／定版」擇一填入）：___

【四階段定義】
- 方向：只有概念，題目／流程還沒展開
- 雛形：題目／訪綱寫出來但粗糙
- 精修：題目完整但要打磨用詞
- 定版：要繳交了

【請依進度給對應深度的回饋】
- 方向：只檢「設計方向能否回答研究問題」，給「該補什麼」清單，不要挑用詞
- 雛形：檢「結構＋邏輯」，挑明顯漏洞（漏題、選項不全、雙重問題等）
- 精修：挑用詞、追問設計、選項邊界等細節
- 定版：做最後一輪挑刺

`;

/* — 各方法 AI 檢核 Prompt — */
const AI_PROMPTS = {
    questionnaire: TOOL_CHECK_INTRO + `我設計了一份問卷，請幫我檢查：
1. 有沒有問題不清楚？
2. 選項是否完整、互斥？
3. 有沒有雙重否定或雙重問題？
4. 倫理考量是否足夠（知情同意、隱私保護）？
5. 給我具體修改建議。

【貼上你的問卷】`,
    interview: TOOL_CHECK_INTRO + `我設計了訪談大綱，請幫我檢查：
1. 問題是否開放式？
2. 追問設計是否合理？
3. 順序是否流暢（從簡單到深層）？
4. 倫理考量是否足夠？
5. 給我具體修改建議。

【貼上你的訪談大綱】`,
    experiment: TOOL_CHECK_INTRO + `我設計了一個實驗，請幫我檢查：
1. 自變項與依變項的操作型定義清楚嗎？
2. 控制變項有遺漏嗎？
3. 實驗流程有邏輯漏洞嗎？
4. 倫理考量是否足夠？
5. 給我具體修改建議。

【貼上你的實驗設計】`,
    observation: TOOL_CHECK_INTRO + `我設計了觀察紀錄表，請幫我檢查：
1. 觀察行為的定義夠具體嗎？（是外顯行為而非推測？）
2. 記錄方式來得及嗎？
3. 觀察時段和地點設定合理嗎？
4. 倫理考量是否足夠？
5. 給我具體修改建議。

【貼上你的觀察紀錄表設計】`,
    literature: TOOL_CHECK_INTRO + `我設計了文獻分析架構（依我的子類型，可能是時間軸／編碼表／框架軸線／情節結構），請幫我檢查：
1. 搜尋策略（關鍵字、篩選標準）夠精準嗎？
2. 我的分析架構（編碼類別／軸線／時序／情節單位）能回答研究問題嗎？
3. 納入／排除標準合理嗎？
4. 來源品質分級方式合適嗎？
5. 【內容/論述分析適用】編碼者一致率怎麼確保？
6. 給我具體修改建議。

【貼上你的文獻分析架構】`,
};

const GENERIC_PROMPT = `我設計了一份研究工具，請幫我檢查：
1. 有沒有不清楚的地方？
2. 設計有什麼邏輯漏洞？
3. 倫理考量足夠嗎？
4. 給我具體修改建議。

【貼上你的工具內容】`;

/* ── W10 整本計畫書 AI 檢核 Prompt（進度容錯版 — 跨方法通用） ── */
const PLAN_FULL_CHECK_PROMPT = `【建議使用 AI 的「深度思考／推理模式」】
（Gemini 的 Thinking 模式、ChatGPT 的 o1 或 Pro、Claude 的 Extended Thinking 等——選你慣用 AI 的深度推理版本。整本檢核值得多等幾分鐘。）

你是高中專題指導顧問。以下是我的整本計畫書，請注意：學生在 W10 課堂剛把第六章工具寫到雛形，「不是每章都到完成度」。我會在開頭告訴你**每章目前的進度階段**，請就「該階段該有的品質」做檢核，不要對草稿用定版的標準苛責。

【我目前的進度自評】（請學生填完再貼進來；每章從「方向／雛形／精修／定版」擇一填入）
- 第 1 章（題目／動機／問題）：___
- 第 2 章（文獻探討）：___（文獻數量：___ 篇）
- 第 3 章（研究方法）：___
- 第 4 章（變項／主題／維度）：___
- 第 5 章（研究對象／抽樣）：___
- 第 6 章（研究工具）：___ ← W10 第一節剛寫
- 第 7-13 章（執行／時程／倫理／參考文獻等）：___

【四階段定義 — AI 請依此校準回饋深度】
- 方向：只有概念句，還沒展開 → 你只檢「方向對不對」，給「該補什麼」清單
- 雛形：段落寫出來但粗糙 → 你檢「結構＋邏輯一致」，指出明顯漏洞
- 精修：內容完整但要打磨 → 你檢「精度＋論證強度」，可以挑用詞與引用
- 定版：要繳交了 → 做最後一輪挑刺

【整本檢核重點 — 跨章一致性比單章品質更重要】
這是 W10 整本檢核的核心：不是再挑一次每章的單章品質，而是檢查**章與章之間是不是邏輯通**。

1. 【方向 → 方法】第 1-3 章的研究問題，能不能用第 3 章寫的方法回答？（例：問題在問「為什麼」卻選量化問卷 → 方向跟方法不對）
2. 【方法 → 工具】第 3 章的方法跟第 6 章的工具是否一致？工具能真的測到第 4 章的變項嗎？
3. 【變項 → 工具】第 4 章每個變項，第 6 章工具裡都有對應題目／訪綱／觀察項？有沒有漏？
4. 【對象 → 抽樣 → 工具】第 5 章的對象是否能填答／受訪？工具難度跟對象的程度匹配嗎？
5. 【倫理紅線】整本（特別是第 3、6、7 章）有無倫理風險？知情同意有沒有寫進工具？
6. 【執行可行性】時程跟樣本量是否可達成？（例：要訪 30 人但時程只 2 週 = 不可行）

【回應格式】
請依「① 進度判讀（你看到我各章是哪個階段）→ ② 跨章不一致清單（哪幾章邏輯沒通）→ ③ 工具最該優先修的 3 件事（這是 W10 重點）→ ④ 課後優先補完清單」四段回。
不用替我修改，只要指出問題點與建議方向。

【以下貼上你的計畫書全本（即使是草稿、半成品都貼，並在每章開頭標註自己的進度階段）】`;

/* — AI 的限制 — */
const AI_LIMITS = [
    { icon: '👁️', title: 'AI 看的是「文字」', desc: '看不到實際填答或訪談時的感受' },
    { icon: '🏫', title: 'AI 不知道「文化脈絡」', desc: '高中生的用語習慣、本校的特殊情況' },
    { icon: '⏱️', title: 'AI 不知道「實際可行性」', desc: '問卷會不會太長、訪談會不會太久，填填看才知道' },
];

/* — 各方法配對指示 — */
const PAIRING_INSTRUCTIONS = {
    questionnaire: '找另一組同學互填問卷。填完後記錄：哪題不清楚？哪個選項不知道怎麼選？花了多久填完？',
    interview: '兩人一組互相模擬訪談。一人當訪談者、一人當受訪者，訪完後交換。注意：哪個問題讓你卡住？哪個追問太尬？',
    experiment: '找同學實際跑一遍實驗流程。記錄：指令清楚嗎？需要多久？有沒有突發狀況？',
    observation: '去實際場域試觀察 10 分鐘。記錄：來得及嗎？分類明確嗎？有沒有行為你歸不了類？',
    literature: '請同學看你的分析架構（時間軸／編碼表／框架軸線／情節結構）。問他：架構看得懂嗎？單位／類別有沒有多餘或遺漏？能回答你的研究問題嗎？',
};

/* — ExportButton 欄位 — */
const EXPORT_FIELDS = [
    /* Step 1：第六章填具體題目 */
    { key: 'w10-entry-self-report', label: '入場自報（W9 docx 完成度）', question: '第二~五章章節完成狀況' },
    { key: 'w10-w9-feedback-quick', label: 'W9 老師回饋快速摘要', question: '老師對 W9 計畫書第一~五章的主要建議' },
    { key: 'w10-tool-design-notes', label: '工具設計關鍵決策', question: '第六章工具設計中的 2-3 個關鍵決定' },
    /* Step 2：七到十三章 + AIRED + 課後待補 */
    { key: 'w10-aired-record', label: 'W10 完整 AIRED 敘事', question: '本週最重要的一次 AI 互動（A-I-R-E-D 五要素）' },
    { key: 'w10-postclass-todo', label: '課後待補清單', question: '哪幾章還想再動，配 W11 老師回饋對照' },
];

/* ══════════════════════════════════════
 *  內部元件：可複製 Prompt 框
 * ══════════════════════════════════════ */

const CopyablePrompt = ({ text }) => {
    const [copied, setCopied] = useState(false);
    const handleCopy = useCallback(() => {
        navigator.clipboard.writeText(text).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }).catch(() => {
            /* fallback: select + copy */
            const ta = document.createElement('textarea');
            ta.value = text;
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    }, [text]);

    return (
        <div className="w10-prompt-box">
            <div className="w10-prompt-header">
                <span className="w10-prompt-label">
                    <Bot size={14} /> AI 檢核 Prompt — 複製後貼到 AI 對話窗
                </span>
                <button onClick={handleCopy} className="w10-copy-btn">
                    {copied ? <><Check size={12} /> 已複製</> : <><Copy size={12} /> 複製</>}
                </button>
            </div>
            <pre className="w10-prompt-text">{text}</pre>
        </div>
    );
};

/* ══════════════════════════════════════
 *  內部元件：W10 入口自檢（W9 計畫書 1-5 章完成度）
 * ══════════════════════════════════════ */

const PREP_OPTIONS = [
    { id: 'complete', icon: '✅', label: '第二~五章完成',    desc: 'docx 五章都寫完' },
    { id: 'partial',  icon: '🔶', label: '部分完成',          desc: '第三、四章還在補' },
    { id: 'none',     icon: '⚠️', label: '只寫到第一章',      desc: 'W9 課後沒補第二~五章' },
];

const PrepStatusCheck = ({ methodId }) => {
    const [status, setStatus] = useState(() => {
        try { return localStorage.getItem('w10-prep-status') || null; } catch { return null; }
    });
    const template = TEMPLATES[methodId];

    /* 第零層檢測：有沒有做過 W9？計畫書 checklist / 方法選擇 / AIRED 全空 = 沒來上課 */
    const w9SkippedEntirely = (() => {
        try {
            const saved = readRecords();
            const hasChecklist = saved['w9-plan-ch1-checklist']?.trim();
            const hasMethod = saved['w9-my-method']?.trim();
            const hasAired = saved['w9-aired-record']?.trim();
            return !hasChecklist && !hasMethod && !hasAired;
        } catch { return false; }
    })();

    const select = (s) => {
        setStatus(s);
        try { localStorage.setItem('w10-prep-status', s); } catch {}
    };
    const reset = () => {
        setStatus(null);
        try { localStorage.removeItem('w10-prep-status'); } catch {}
    };

    /* 零層閘門：連 W9 都沒做 → 擋下 */
    if (w9SkippedEntirely) {
        return (
            <div className="bg-[var(--danger-light)] border-2 border-[var(--danger)] rounded-[var(--radius-unified)] overflow-hidden">
                <div className="px-5 py-3 bg-[var(--danger)] text-white flex items-center gap-2">
                    <span className="text-[14px]">🚫</span>
                    <span className="font-bold text-[13px]">偵測到你沒做 W9</span>
                </div>
                <div className="p-5 space-y-3 text-[13px] text-[var(--ink)]">
                    <p className="leading-relaxed">
                        W10 的工具設計需要建立在 <strong>W9 計畫書第一~五章的地基</strong>上。網頁讀不到你的 W9 checklist、方法選擇、AIRED——代表 W9 沒做。
                    </p>
                    <p className="leading-relaxed">
                        硬要在 W10 補做 W9 的量 = 同時跑兩週份的思考，效率最差。請先回 W9 把 Step 3 五章地基工程做完再回來。
                    </p>
                    <div className="flex flex-col md:flex-row gap-2 pt-1">
                        <a
                            href="/w9"
                            className="flex items-center justify-center gap-2 bg-[var(--ink)] hover:bg-black text-white rounded-[8px] px-4 py-3 no-underline transition-colors text-[13px] font-bold"
                        >
                            回 W9 工具設計基礎 →
                        </a>
                    </div>
                    <p className="text-[11px] text-[var(--ink-mid)] bg-white border border-[var(--border)] rounded-[4px] p-2 leading-relaxed">
                        💡 <strong className="text-[var(--ink)]">如果你有做 W9 但資料不見了</strong>（換裝置、清過瀏覽器快取），請回 W9 重填最基本的 Step 3 變項 / 題目（10-15 分鐘），W10 才能繼續。
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white border border-[var(--border)] rounded-[var(--radius-unified)] overflow-hidden">
            <div className="px-5 py-3 bg-[var(--ink)] text-white flex items-center justify-between gap-2">
                <span className="font-bold text-[13px]">🚦 開場自檢：W9 計畫書第 1-5 章完成度</span>
                {status && (
                    <button
                        onClick={reset}
                        className="text-[11px] opacity-70 hover:opacity-100 transition-opacity"
                        style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}
                    >
                        重新作答
                    </button>
                )}
            </div>
            <div className="p-5 space-y-4">
                {!status && (
                    <p className="text-[13px] text-[var(--ink-mid)] leading-relaxed">
                        進入工具設計前先誠實回報——你的 W9 計畫書第 1-5 章是否都寫完了？選擇會決定這節課開頭 15 分鐘要不要先補。
                    </p>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {PREP_OPTIONS.map((opt) => {
                        const isMe = status === opt.id;
                        const palette =
                            opt.id === 'complete' ? 'border-[var(--success)] bg-[var(--success-light)]' :
                            opt.id === 'partial'  ? 'border-[var(--accent)]  bg-[var(--accent-light)]'  :
                                                    'border-[var(--danger)]  bg-[var(--danger-light)]';
                        let cls = 'border-[var(--border)] bg-white hover:border-[var(--accent)] cursor-pointer';
                        if (isMe) cls = palette;
                        else if (status) cls = 'border-[var(--border)] bg-[var(--paper)] opacity-50 cursor-default';
                        return (
                            <button
                                key={opt.id}
                                onClick={() => select(opt.id)}
                                disabled={!!status}
                                className={`text-left p-4 rounded-[8px] border transition-all ${cls}`}
                            >
                                <span className="text-[20px]">{opt.icon}</span>
                                <strong className="block text-[13px] text-[var(--ink)] mt-1">{opt.label}</strong>
                                <span className="text-[11px] text-[var(--ink-mid)] block mt-0.5">{opt.desc}</span>
                            </button>
                        );
                    })}
                </div>

                {status === 'complete' && (
                    <div className="bg-[var(--success-light)] border-l-[3px] border-[var(--success)] p-4 rounded-[4px] text-[13px] text-[var(--ink)]">
                        <strong>✅ 太好了。</strong> 直接往下進入 Step 1 工具設計（計畫書第六章）——前段地基穩，今天可以專心把工具寫完。
                    </div>
                )}

                {status === 'partial' && (
                    <div className="bg-[var(--accent-light)] border-l-[3px] border-[var(--accent)] p-4 rounded-[4px] text-[13px] text-[var(--ink-mid)] space-y-3">
                        <strong className="text-[var(--ink)] block">🔶 本節前 10 分鐘先補齊第三、四章</strong>
                        <p className="leading-relaxed">
                            第一、二、五章都到位的話，這節開工前先花 10 分鐘把第三章（文獻回顧補到 2-3 篇 + 差異）和第四章（變項／主題／維度定版）補完，再往下進工具設計。
                        </p>
                        <p className="text-[12px]">
                            為什麼不拖？<strong className="text-[var(--ink)]">第六章工具要長在第四章變項上</strong>——變項沒定完就設計工具 = 工具也長歪。
                        </p>
                    </div>
                )}

                {status === 'none' && (
                    <div className="bg-[var(--danger-light)] border-l-[3px] border-[var(--danger)] p-4 rounded-[4px] text-[13px] text-[var(--ink)] space-y-3">
                        <strong className="block text-[var(--danger)] text-[14px]">⚠️ 地基沒建好就蓋樓——今天會卡死</strong>
                        <p className="text-[12px] leading-relaxed">
                            第六章工具是計畫書的一個章節，它必須長在前五章的地基上（特別是第四章變項／主題）。只有第一章沒辦法支撐工具設計。
                        </p>

                        <div className="bg-white border border-[var(--border)] rounded-[6px] p-3 space-y-2 text-[12px] leading-relaxed">
                            <p><strong>可行選項：</strong></p>
                            <p>① <strong>回 W9</strong> 把第二、三、四、五章快速補齊（就算只有骨架也行）→ 今天再回來做工具。</p>
                            <p>② 如果時程真的來不及，<strong>找老師面談</strong>——地基沒打好就施工，是整份研究的風險。</p>
                        </div>

                        <div className="flex flex-col md:flex-row gap-2">
                            <a
                                href="/w9"
                                className="flex items-center justify-center gap-2 bg-[var(--ink)] hover:bg-black text-white rounded-[8px] px-4 py-3 no-underline transition-colors text-[13px] font-bold"
                            >
                                回 W9 補齊第 2-5 章 →
                            </a>
                        </div>

                        <p className="text-[11px] bg-white border border-[var(--border)] rounded-[4px] p-2 text-[var(--ink-mid)]">
                            💡 <strong className="text-[var(--ink)]">誠實面對：</strong>硬做工具會讓 W11 Pilot Test 與倫理審查連帶出錯——錯在上游，下游會放大。
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

/* ══════════════════════════════════════
 *  主元件
 * ══════════════════════════════════════ */

export const ToolRefinementPage = () => {
    const [w9Method, setW9Method] = useState('');
    const [w9Topic, setW9Topic] = useState('');
    const [w8Secondary, setW8Secondary] = useState(''); // W8 補充方法（label 字串）
    const [detectedMethodId, setDetectedMethodId] = useState('');
    const [toolKitView, setToolKitView] = useState(null); // 工具書教學 tab 使用者切換值
    const [litSubtype, setLitSubtype] = useState(''); // 文獻組 4 子類型 id
    const [showLessonMap, setShowLessonMap] = useState(false);

    /* W9 資料帶入 */
    useEffect(() => {
        const saved = readRecords();
        const method = saved['w9-my-method']?.trim() || saved['w8-tool-method']?.trim() || '';
        const secondary = saved['w8-tool-method-secondary']?.trim() || '';
        const topic = saved['w8-merged-topic']?.trim() || saved['w8-research-question']?.trim() || '';
        if (method) setW9Method(method);
        if (secondary) setW8Secondary(secondary);
        if (topic) setW9Topic(topic);

        const ml = method.toLowerCase();
        if (ml.includes('問卷')) setDetectedMethodId('questionnaire');
        else if (ml.includes('訪談')) setDetectedMethodId('interview');
        else if (ml.includes('實驗')) setDetectedMethodId('experiment');
        else if (ml.includes('觀察')) setDetectedMethodId('observation');
        else if (ml.includes('文獻')) setDetectedMethodId('literature');

        /* 文獻組：讀子類型（W9 計畫書勾選後同步寫入 localStorage） */
        try {
            const sub = localStorage.getItem('w10-lit-subtype') || '';
            if (sub) setLitSubtype(sub);
        } catch { /* ignore */ }
    }, []);

    const chooseLitSubtype = useCallback((id) => {
        setLitSubtype(id);
        try { localStorage.setItem('w10-lit-subtype', id); } catch { /* ignore */ }
    }, []);

    /* ── 五步驟 ──────────────────────────────────────── */

    const steps = [
        /* ─── Step 1：開場 + 第六章工作流提醒 — 第一節 15 min ─── */
        {
            title: '開場 + 第六章流程',
            icon: '🔧',
            content: (
                <div className="space-y-8 prose-zh">
                    {/* 入場擋板：W9 完成狀態自檢 */}
                    <PrepStatusCheck methodId={detectedMethodId} />

                    {/* W9 老師回饋快速讀取（5 分鐘暖身） */}
                    <div className="bg-white border-2 border-[var(--accent)] rounded-[var(--radius-unified)] p-5 max-w-[720px]">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-[18px]">📬</span>
                            <span className="font-bold text-[14px] text-[var(--ink)]">開始前：先看老師對 W9 計畫書第一~五章的回饋（5 分鐘）</span>
                        </div>
                        <p className="text-[13px] text-[var(--ink-mid)] leading-relaxed mb-3">
                            老師已在 <strong>Google Classroom</strong> 發回 W9 計畫書的批改。請先打開看過，把老師<strong className="text-[var(--ink)]">最主要</strong>的一兩句建議記下來——這些建議會影響你今天第六章工具設計的方向。
                        </p>
                        <ThinkRecord
                            dataKey="w10-w9-feedback-quick"
                            prompt="老師對我 W9 計畫書最主要的建議是？"
                            placeholder="例：第四章變項太多要砍、第五章抽樣方式要改、第三章文獻對應不夠清楚⋯⋯"
                            rows={3}
                        />
                        <p className="text-[11px] text-[var(--ink-light)] leading-relaxed mt-2">
                            💡 還沒拿到回饋？可能老師還在批。先往下做工具設計，之後有回饋再回頭修正。
                        </p>
                    </div>

                    {/* Step 1 開場 */}
                    <div>
                        <p className="text-[14px] text-[var(--ink-mid)] leading-relaxed max-w-[720px]">
                            W9 你已完成計畫書第一~五章雛形（即使有些章是草稿也算）。本節 50 分鐘專心做一件事：<strong className="text-[var(--ink)]">把計畫書 1-5 章補完 + 第六章填具體題目</strong>。
                        </p>
                        <div className="w7-notice w7-notice-gold">
                            🎯 <strong>本節目標：計畫書 1-5 章定稿 + 第六章「填具體題目」</strong>（不是工具實體——實體 W11 第一節做）。內容寫在 <strong>docx</strong> 上，網頁只記過程紀錄與 AIRED。
                        </div>
                    </div>

                    {/* 🤝 1-4 人分章工作流（第六章工具設計） */}
                    <div className="p-5 rounded-[var(--radius-unified)] border-2 border-[#0EA5E9] bg-[#F0F9FF] max-w-[720px]">
                        <p className="text-[14px] font-bold text-[#075985] mb-2">🤝 第六章工具設計分工（看你的隊型）</p>
                        <p className="text-[12.5px] text-[#0C4A6E] leading-relaxed mb-3">
                            工具是一份大家共寫——但分工要清楚不要全擠著寫題目。<strong>核心三角色：主稿 / 對照 / AI 諮詢</strong>。人多就多一個倫理檢查。
                        </p>
                        <GroupSizeSelector
                            items={{
                                1: {
                                    title: '1 人（Solo）',
                                    content: (
                                        <p className="leading-relaxed">
                                            自己 50 分鐘只能寫到主架構——別追求完美。寫完後找<strong>另一組同學試填</strong>（W11 Pilot 預演），他能挑出你看不到的盲點。
                                        </p>
                                    ),
                                },
                                2: {
                                    title: '2 人組',
                                    content: (
                                        <ul className="list-disc pl-4 space-y-0.5">
                                            <li><strong>A 主稿</strong>：寫題目／訪綱／流程</li>
                                            <li><strong>B 對照</strong>：拿本週工具品質基礎（三大標準 + 5 大錯誤）逐題挑刺</li>
                                        </ul>
                                    ),
                                },
                                3: {
                                    title: '3 人組',
                                    content: (
                                        <ul className="list-disc pl-4 space-y-0.5">
                                            <li><strong>A 主稿</strong>：寫題目／訪綱／流程</li>
                                            <li><strong>B 對照</strong>：三大標準 + 錯誤類型逐題挑</li>
                                            <li><strong>C AI 諮詢</strong>：用工具 prompt 跑 AI，整理建議給組員看</li>
                                        </ul>
                                    ),
                                },
                                4: {
                                    title: '4 人組',
                                    content: (
                                        <ul className="list-disc pl-4 space-y-0.5">
                                            <li><strong>A 主稿</strong></li>
                                            <li><strong>B 對照</strong>：方向＋精度（本週三大標準）</li>
                                            <li><strong>C AI 諮詢</strong></li>
                                            <li><strong>D 倫理＋文獻檢查</strong>：工具不踩倫理紅線、跟第二章文獻對得上</li>
                                        </ul>
                                    ),
                                },
                            }}
                        />
                        <p className="text-[11.5px] text-[#0C4A6E] leading-relaxed mt-3 pt-2 border-t border-[#0EA5E9]/30">
                            ⏱️ <strong>時間建議</strong>：前 5 分鐘分工 → 各自 35 分鐘做 → 最後 10 分鐘聚回來互讀整合。
                        </p>
                    </div>

                    {/* 第六章在 docx 直接填題目（W11 才把題目轉成施測載具） */}
                    <div className="bg-white border-2 border-[var(--accent)] rounded-[var(--radius-unified)] p-5 max-w-[720px]">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <span className="text-[10px] font-mono font-bold bg-[var(--accent)] text-white px-2 py-0.5 rounded-[3px]">第六章 · 填具體題目</span>
                            <span className="font-bold text-[14px] text-[var(--ink)]">直接在 docx 第六章填題目</span>
                        </div>
                        <p className="text-[13px] text-[var(--ink-mid)] leading-relaxed mb-2">
                            計畫書 docx 第六章本來就有完整的填空表格（結構／題目類型／基本資料／變項題目／自檢）——本節 W10 直接<strong className="text-[var(--ink)]">在 docx 把題目都填到位</strong>。網頁不重複 docx 內容；下一頁 Step 2 的工具書自學教案是給你<strong>對照寫</strong>用的。
                        </p>
                        <p className="text-[12.5px] text-[var(--ink-light)] leading-relaxed bg-[var(--paper-warm)] border border-[var(--border)] rounded-[6px] p-3">
                            💡 W10 vs W11 分工：<strong className="text-[var(--ink)]">W10 在 docx 裡寫題目本身</strong>（紙上設計）；<strong className="text-[var(--ink)]">W11 把題目轉成施測載具</strong>（Google Form／紙本訪綱／印出觀察表）+ 跨班 Pilot 真人測試。
                        </p>
                    </div>

                    {/* ▶ 下一頁預告：Step 2 工具書自學教案 */}
                    <div className="w7-notice w7-notice-gold">
                        ▶ <strong>下一頁 Step 2：工具書自學教案</strong>——5 法 tab 切換 + 4 區塊（題型結構／設計原則／獨家陷阱／完整範例）。看完那頁，回 docx 第六章寫題目就有方向。
                    </div>
                </div>
            ),
        },

        /* ─── Step 2：工具書自學教案 — 5 法 4 區塊 ─── */
        {
            title: '工具書自學教案',
            icon: '📚',
            content: (
                <div className="space-y-8 prose-zh">
                    <div className="bg-[var(--paper-warm)] border border-[var(--border)] rounded-[var(--radius-unified)] p-4 max-w-[760px]">
                        <p className="text-[14px] text-[var(--ink-mid)] leading-relaxed mb-2">
                            <strong className="text-[var(--ink)]">看完這頁能回 docx 第六章寫題目</strong>。先看「工具品質基礎」（三大標準，5 法共通）→ 再看自己方法的 4 區塊（題型結構 → 設計原則 → 常見錯誤 → 完整範例）。
                        </p>
                        <p className="text-[12.5px] text-[var(--ink-light)] leading-relaxed">
                            💡 用法：①讀工具品質基礎（5 法共通的判準 + 5 大錯誤）→ ②看自己方法 A→B→C→D → ③回 docx 對照寫題目 → ④寫完回頭看別組（學會分辨＝真的懂）。
                        </p>
                    </div>

                    {/* ━━━ 工具品質基礎（5 法共通）— 寫題目前必看的判準與紅線 ━━━ */}
                    <div className="border-2 border-[var(--accent)] rounded-[var(--radius-unified)] overflow-hidden max-w-[760px]">
                        <div className="px-5 py-3 bg-[var(--accent)] text-white flex items-center gap-2">
                            <span className="text-[10px] font-mono font-bold bg-white text-[var(--accent)] px-2 py-0.5 rounded-[3px]">基礎</span>
                            <span className="font-bold text-[14px]">工具品質基礎（5 法共通）</span>
                            <span className="ml-auto text-[10px] font-mono opacity-80">W9 已預習過</span>
                        </div>

                        <div className="p-5 space-y-5">
                            <p className="text-[12.5px] text-[var(--ink-mid)] leading-[1.85]">
                                寫第六章題目前先看這把尺：<strong className="text-[var(--ink)]">三大標準（V→R→F）</strong>——判工具是好是壞，5 法都通用。具體會踩什麼坑因方法而異，下方 tab 切到你的方法看 <strong className="text-[var(--ink)]">C · 常見錯誤</strong>。
                            </p>

                            {/* 三大標準速查 */}
                            <div>
                                <p className="text-[13px] font-bold text-[var(--ink)] mb-2">📐 三大標準（V→R→F）</p>
                                <div className="grid md:grid-cols-3 gap-2">
                                    <div className="bg-white border border-[var(--border)] rounded-[6px] p-3">
                                        <p className="text-[11.5px] font-mono font-bold text-[var(--accent)]">V · 方向</p>
                                        <p className="text-[12.5px] font-bold text-[var(--ink)] mt-1">問對的事</p>
                                        <p className="text-[11.5px] text-[var(--ink-mid)] leading-[1.7] mt-1">每題對應到第四章某個變項／主題；沒對應就不該存在</p>
                                    </div>
                                    <div className="bg-white border border-[var(--border)] rounded-[6px] p-3">
                                        <p className="text-[11.5px] font-mono font-bold text-[var(--accent)]">R · 精度</p>
                                        <p className="text-[12.5px] font-bold text-[var(--ink)] mt-1">問得清楚</p>
                                        <p className="text-[11.5px] text-[var(--ink-mid)] leading-[1.7] mt-1">用具體時段／量表／頻次，不用「常常」「偶爾」這類模糊詞</p>
                                    </div>
                                    <div className="bg-white border border-[var(--border)] rounded-[6px] p-3">
                                        <p className="text-[11.5px] font-mono font-bold text-[var(--accent)]">F · 執行</p>
                                        <p className="text-[12.5px] font-bold text-[var(--ink)] mt-1">問得到答案</p>
                                        <p className="text-[11.5px] text-[var(--ink-mid)] leading-[1.7] mt-1">受訪者答得出來、時間負擔合理（問卷 5 min 內、訪談 30 min 內）</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-[var(--paper-warm)] border-l-3 border-[var(--gold)] rounded-r-[6px] p-3 text-[11.5px] text-[var(--ink-mid)] leading-[1.85]">
                                💡 <strong>具體錯誤類型</strong>因方法而異——下方 tab 切到你的方法看 <strong className="text-[var(--ink)]">C · 常見錯誤</strong> 區塊。問卷／訪談主要踩「題目用詞」的雷（誘導性、雙重、假開放）；觀察／文獻主要踩「類別設計」的雷（重疊、不全）；實驗則踩「變項設計」的雷（混淆變項、操作定義不精確、前後測污染）。
                            </div>
                        </div>
                    </div>

                    {/* 5 種方法的工具書教學：tab 切換 + 4 區塊 */}
                    <div className="space-y-4 max-w-[760px]">
                        <div>
                            {/* 5 法 tab 切換 */}
                            <div className="flex gap-1.5 flex-wrap mb-4">
                                {Object.entries(TOOL_DESC_KIT).map(([id, kit]) => {
                                    const activeKey = toolKitView || detectedMethodId || 'questionnaire';
                                    const isActive = activeKey === id;
                                    const isMine = detectedMethodId === id;
                                    return (
                                        <button
                                            key={id}
                                            type="button"
                                            onClick={() => setToolKitView(id)}
                                            className={`text-[12.5px] px-3 py-1.5 rounded-[6px] border transition ${
                                                isActive
                                                    ? 'bg-[var(--ink)] text-white border-[var(--ink)] font-bold'
                                                    : 'bg-white text-[var(--ink-mid)] border-[var(--border)] hover:border-[var(--accent)]/60'
                                            }`}
                                        >
                                            {kit.label} {isMine && !isActive && <span className="text-[9px] ml-0.5">★</span>}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* 當前選中方法的 4 區塊 */}
                            {(() => {
                                const activeKey = toolKitView || detectedMethodId || 'questionnaire';
                                const kit = TOOL_DESC_KIT[activeKey];
                                if (!kit) return null;
                                return (
                                    <div className="space-y-4">
                                        {/* 區塊 A：題型結構 */}
                                        <div className="bg-white border border-[var(--border)] rounded-[var(--radius-unified)] p-4">
                                            <div className="flex items-center gap-2 mb-3">
                                                <span className="text-[10px] font-mono font-bold bg-[var(--accent)] text-white px-2 py-0.5 rounded-[3px]">A · 題型結構</span>
                                                <span className="text-[13px] font-bold text-[var(--ink)]">{kit.structure.title}</span>
                                            </div>
                                            <div className="overflow-x-auto mb-3">
                                                <table className="w-full text-[12px] border-collapse">
                                                    <thead>
                                                        <tr className="bg-[var(--paper-warm)]">
                                                            <th className="border border-[var(--border)] px-2 py-1.5 text-left font-bold w-[120px]">類型</th>
                                                            <th className="border border-[var(--border)] px-2 py-1.5 text-left font-bold">用途</th>
                                                            <th className="border border-[var(--border)] px-2 py-1.5 text-left font-bold">例子</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {kit.structure.types.map((t, i) => (
                                                            <tr key={i}>
                                                                <td className="border border-[var(--border)] px-2 py-1.5 font-bold text-[var(--ink)]">{t.name}</td>
                                                                <td className="border border-[var(--border)] px-2 py-1.5 text-[var(--ink-mid)]">{t.use}</td>
                                                                <td className="border border-[var(--border)] px-2 py-1.5 text-[var(--ink-light)]">{t.ex}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div className="bg-[var(--accent-light)] border-l-3 border-[var(--accent)] rounded-r-[6px] p-2.5 text-[12px] text-[var(--ink-mid)] leading-[1.7] whitespace-pre-line">
                                                <span className="font-bold text-[var(--ink)]">推薦結構：</span>{kit.structure.template}
                                            </div>
                                        </div>

                                        {/* 區塊 B：設計原則 */}
                                        <div className="bg-white border border-[var(--border)] rounded-[var(--radius-unified)] p-4">
                                            <div className="flex items-center gap-2 mb-3">
                                                <span className="text-[10px] font-mono font-bold bg-[var(--success)] text-white px-2 py-0.5 rounded-[3px]">B · 設計原則</span>
                                                <span className="text-[13px] font-bold text-[var(--ink)]">寫題目前該知道的</span>
                                            </div>
                                            <ol className="text-[12.5px] text-[var(--ink-mid)] leading-[1.85] list-decimal pl-5 space-y-1">
                                                {kit.principles.map((p, i) => (
                                                    <li key={i}>{p}</li>
                                                ))}
                                            </ol>
                                        </div>

                                        {/* 區塊 C：獨家陷阱 */}
                                        <div className="bg-[#FEF2F2] border border-[#FCA5A5] rounded-[var(--radius-unified)] p-4">
                                            <div className="flex items-center gap-2 mb-3">
                                                <span className="text-[10px] font-mono font-bold bg-[#DC2626] text-white px-2 py-0.5 rounded-[3px]">C · 常見錯誤</span>
                                                <span className="text-[13px] font-bold text-[#7F1D1D]">這個方法最容易踩的雷（不在 W9 八病症裡）</span>
                                            </div>
                                            <ul className="text-[12.5px] text-[#7F1D1D] leading-[1.85] list-disc pl-5 space-y-1.5">
                                                {kit.traps.map((t, i) => (
                                                    <li key={i}>{t}</li>
                                                ))}
                                            </ul>
                                        </div>

                                        {/* 實驗組獨有：自然科學適用提醒卡 */}
                                        {kit.naturalScienceNote && (
                                            <details className="bg-[#F0F9FF] border-2 border-[#0284C7] rounded-[var(--radius-unified)] overflow-hidden">
                                                <summary className="px-4 py-2.5 cursor-pointer bg-[#E0F2FE] hover:bg-[#BAE6FD] flex items-center gap-2 flex-wrap">
                                                    <span className="text-[10px] font-mono font-bold bg-[#0284C7] text-white px-2 py-0.5 rounded-[3px]">自科專用</span>
                                                    <span className="text-[13px] font-bold text-[#075985]">{kit.naturalScienceNote.title}</span>
                                                </summary>
                                                <div className="p-4 space-y-3 border-t border-[#0284C7]/30">
                                                    <p className="text-[12.5px] text-[#0C4A6E] leading-[1.85]">{kit.naturalScienceNote.body}</p>
                                                    <div className="overflow-x-auto">
                                                        <table className="w-full text-[12px] border-collapse">
                                                            <thead>
                                                                <tr className="bg-white">
                                                                    <th className="border border-[#0284C7]/30 px-2 py-1.5 text-left font-bold w-[45%]">社科版（人類受試者）</th>
                                                                    <th className="border border-[#0284C7]/30 px-2 py-1.5 text-left font-bold w-[55%]">→ 自科版（樣本實驗）</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {kit.naturalScienceNote.mappings.map((m, i) => (
                                                                    <tr key={i}>
                                                                        <td className="border border-[#0284C7]/30 px-2 py-1.5 text-[#0C4A6E] bg-white">{m.social}</td>
                                                                        <td className="border border-[#0284C7]/30 px-2 py-1.5 text-[#075985] font-bold bg-[#F0F9FF]">{m.natural}</td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                    <p className="text-[11.5px] text-[#075985] italic leading-relaxed bg-white border border-[#0284C7]/30 rounded p-2.5">
                                                        {kit.naturalScienceNote.tip}
                                                    </p>
                                                </div>
                                            </details>
                                        )}

                                        {/* 區塊 D：完整範例 */}
                                        <div className="bg-white border border-[var(--border)] rounded-[var(--radius-unified)] p-4">
                                            <div className="flex items-center gap-2 mb-3">
                                                <span className="text-[10px] font-mono font-bold bg-[#0EA5E9] text-white px-2 py-0.5 rounded-[3px]">D · 完整範例</span>
                                                <span className="text-[13px] font-bold text-[var(--ink)]">把上面三區套到具體題目（學生對照寫到 docx）</span>
                                            </div>
                                            <pre className="text-[12px] text-[var(--ink-mid)] leading-[1.85] whitespace-pre-wrap font-mono bg-[#F8FAFC] border border-[var(--border)] rounded-[6px] p-3 overflow-x-auto">{kit.example}</pre>
                                            <p className="text-[11.5px] text-[var(--ink-light)] italic mt-2">
                                                💡 這是示範主題——你用自己的研究問題、變項、對象替換對應內容寫到 docx 第六章。
                                            </p>
                                        </div>

                                        {/* AI 啟動 prompt（摺疊） */}
                                        <details className="border border-[var(--border)] rounded-[var(--radius-unified)] overflow-hidden">
                                            <summary className="px-3 py-2 bg-[var(--paper-warm)] cursor-pointer flex items-center gap-2 flex-wrap hover:bg-[var(--paper)]">
                                                <span className="text-[10px] font-mono font-bold bg-[var(--ink)] text-white px-2 py-0.5 rounded-[3px]">AI 啟動</span>
                                                <span className="text-[12px] font-bold text-[var(--ink)]">不知怎麼開始？點開複製這段 Prompt 給 AI</span>
                                            </summary>
                                            <div className="p-3 border-t border-[var(--border)]">
                                                <CopyablePrompt text={kit.prompt} />
                                                <p className="text-[11.5px] text-[var(--ink-light)] leading-relaxed mt-2 italic">
                                                    💡 把 [方括號] 裡的內容換成你的東西再貼給 AI。<strong>AI 給「方向」就好——不要它替你寫完整題目（自己寫到 docx 才有教學意義）。</strong>
                                                </p>
                                            </div>
                                        </details>
                                    </div>
                                );
                            })()}
                        </div>
                    </div>

                    {/* 補充方法提示卡（W8 登記過才顯示） */}
                    {w8Secondary && (
                        <div className="bg-[#ECFDF5] border border-[#10B981] rounded-[var(--radius-unified)] p-4 max-w-[720px] text-[12.5px] text-[#065F46] leading-relaxed">
                            🧩 你在 W8 登記了補充方法：<strong>{w8Secondary}</strong>。
                            <p className="mt-1.5">
                                docx 第六章建議分節寫：「6.1 主工具（{w9Method}）」、「6.2 補充工具（{w8Secondary}）」——兩個都填到，但<strong className="text-[#064E3B]">主工具寫完整、補充工具寫骨架就好</strong>。
                            </p>
                        </div>
                    )}

                    {/* 下節預告 */}
                    <div className="w7-notice w7-notice-teal">
                        ✅ 工具書自學完 + docx 第六章題目寫到定位 → 下一頁 Step 3：<strong>補七到十三章 + 整本繳交</strong>。<br />
                        💡 <strong>第八章 + 第九章(三) 限制改進 — 草稿即可、不花時間</strong>。理由：你還沒做完研究、不會分析。等 W14 數據出來再回頭補才寫得到位。第十章倫理／第十一章時程／第十二章 AI 聲明都是模板套用，最快搞定。
                    </div>
                </div>
            ),
        },

        /* ─── Step 3：第七~十三章補完 + 整本繳交 — 第二節 50 min ─── */
        {
            title: '七到十三章 × 整本繳交',
            icon: '📤',
            content: (
                <div className="space-y-8 prose-zh">
                    <p className="text-[14px] text-[var(--ink-mid)] leading-relaxed max-w-[720px]">
                        本節 50 分鐘把計畫書七到十三章補完，整本繳交 GC。<strong className="text-[var(--ink)]">整本 AI 檢核交給老師跑</strong>——你寫好繳出去，老師會用整本檢核 prompt 跑你的版本，在 GC 寫個別回饋（含星號等級）。下週 W11 你拿到回饋再修，然後填工具實體。
                    </p>

                    {/* 老師會做整本檢核（學生不用） */}
                    <div className="bg-[#F0F9FF] border-l-4 border-[#0EA5E9] p-4 max-w-[720px]">
                        <p className="text-[13px] font-bold text-[#075985] mb-1">📨 為什麼整本 AI 檢核交給老師？</p>
                        <p className="text-[12.5px] text-[#0C4A6E] leading-relaxed">
                            你的第六章工具設計時已經跟 AI 互動過（記在 W10 AIRED）——這部分夠了。<strong>整本檢核要看「跨章一致性」</strong>，這個老師有全班視角、可以批量跑、再加自己判斷給你回饋。<strong className="text-[#064E3B]">你的時間花在把整本寫到位</strong>，不要再跑一次 AI。
                        </p>
                    </div>

                    {/* 七到十三章內容引導 */}
                    <div>
                        <h4 className="font-serif text-[18px] md:text-[20px] font-bold text-[var(--ink)] mb-2">
                            第七到十三章內容對照
                        </h4>
                        <p className="text-[13px] text-[var(--ink-mid)] leading-relaxed mb-3">
                            多數章節是「<strong>模板套用 + 微調</strong>」，不需要從零想。<strong className="text-[var(--ink)]">第八章 + 第九章(三) 草稿即可——不要花太多時間</strong>。理由：你還沒做完研究、不會分析、沒看過真實數據。等 W14 跑完數據再回頭補才寫得到位。
                        </p>

                        <div className="bg-[#FFFBEB] border-l-4 border-[#D97706] rounded-r-[8px] p-4 mb-3 max-w-[760px]">
                            <p className="text-[13px] font-bold text-[#92400E] mb-1">⚠️ 「草稿」是什麼意思？</p>
                            <ul className="text-[12.5px] text-[#78350F] leading-[1.85] list-disc pl-5 space-y-0.5">
                                <li><strong>第八章資料分析方式</strong>——寫一句話「預計用 ___ 分析」就好（如：「Excel 算次數分布、SPSS 跑相關係數」）。<u>不需要</u>寫詳細統計步驟，你還沒看到資料長怎樣。</li>
                                <li><strong>第九章 (三) 可能的限制與改進</strong>——寫 1-2 條你<u>現在就想得到</u>的（如：「樣本只有本校、無法推論」）。其他要等做完才知道，<u>不要硬猜</u>。</li>
                            </ul>
                            <p className="text-[11.5px] text-[#92400E] italic mt-2 pt-2 border-t border-[#D97706]/30">
                                💡 草稿級別 ＝ 「我有寫，但等真的做了再修」。老師批改時會放過這兩段，不會苛責深度。
                            </p>
                        </div>

                        <div className="bg-white border border-[var(--border)] rounded-[var(--radius-unified)] overflow-hidden">
                            <div className="grid grid-cols-[60px_1fr_70px] bg-[var(--paper-warm)] border-b border-[var(--border)] text-[11px] font-mono font-bold text-[var(--ink)]">
                                <div className="px-3 py-2.5">章</div>
                                <div className="px-3 py-2.5 border-l border-[var(--border)]">內容</div>
                                <div className="px-3 py-2.5 border-l border-[var(--border)]">本節到</div>
                            </div>
                            {[
                                { ch: '七', t: '研究實施（時程／地點／流程）', stage: '草稿' },
                                { ch: '八', t: '資料分析方式（寫一句「預計用 ___」即可）', stage: '草稿' },
                                { ch: '九', t: '預期結論與貢獻（(三) 限制改進＝草稿）', stage: '雛形' },
                                { ch: '十', t: '研究倫理（抄通用＋微調）', stage: '雛形' },
                                { ch: '十一', t: '時程表 W9-W17（套模板）', stage: '雛形' },
                                { ch: '十二', t: 'AI 使用聲明（套通用）', stage: '雛形' },
                                { ch: '十三', t: '參考文獻（列 W5-W6 文獻）', stage: '雛形' },
                            ].map((r, i) => (
                                <div key={i} className="grid grid-cols-[60px_1fr_70px] border-b border-[var(--border)] last:border-b-0 text-[12.5px]">
                                    <div className="px-3 py-2.5 font-mono font-bold text-[var(--accent)]">{r.ch}</div>
                                    <div className="px-3 py-2.5 border-l border-[var(--border)] text-[var(--ink)]">{r.t}</div>
                                    <div className="px-3 py-2.5 border-l border-[var(--border)] text-[var(--ink-mid)] font-mono text-[11px]">{r.stage}</div>
                                </div>
                            ))}
                        </div>
                        <p className="text-[11.5px] text-[var(--ink-light)] italic mt-2">
                            💡 第十一章時程表照課表填、第十二章 AI 聲明貼通用版、第十三章把 W5-W6 文獻整理一下——這三章最快。
                        </p>
                    </div>

                    {/* W10 完整 AIRED */}
                    <AIREDNarrative
                        dataKey="w10-aired-record"
                        weekLabel="W10"
                    />

                    {/* 繳交驗收 + 課後待補清單 */}
                    <div>
                        <h4 className="font-serif text-[18px] md:text-[20px] font-bold text-[var(--ink)] mb-2">
                            繳交驗收 + 寫課後待補清單
                        </h4>
                        <p className="text-[13px] text-[var(--ink-mid)] leading-relaxed mb-3">
                            檢查整本 docx 13 章都到本節要求的進度，上傳 Google Classroom W10 作業區。寫一份「課後待補清單」——你自己知道哪些章還粗、哪幾題還想動的，記下來，W11 拿到老師回饋時可以對照。
                        </p>
                        <ThinkRecord
                            dataKey="w10-postclass-todo"
                            prompt="課後待補清單（你自己知道哪幾章還想再動）"
                            placeholder={'例：\n第七章流程還沒寫完，等 W11 確定工具實體後再補\n第八章資料分析方式現只寫一句「預計用 Excel」，等 W14 看到數據再展開\n第九章(三) 限制改進現只寫一條，等 W15 結論時再補\n第十章倫理「不傷害」這條我還不確定要怎麼寫'}
                            scaffold={['還想動的章節：要做什麼（為什麼）']}
                            rows={5}
                        />
                    </div>

                    <div className="w7-notice w7-notice-teal">
                        ✅ 整本繳交完成 → W11 第一節讀老師 GC 回饋 → 修星號項 → 拿模板填工具實體。
                    </div>
                </div>
            ),
        },

        /* ─── Step 4：繳交確認 + W11 預告 ─── */
        {
            title: '繳交確認 + W11 預告',
            icon: '🔔',
            content: (
                <div className="space-y-8 prose-zh">
                    <p className="text-[14px] text-[var(--ink-mid)] leading-relaxed max-w-[720px]">
                        本節最後一段：把整本計畫書匯出資料、確認 GC 已上傳，讀 W11 預告。<strong className="text-[var(--ink)]">老師會在 W11 上課前把整本檢核回饋發到 GC（含★星號等級）</strong>——你下週進教室第一件事就是讀回饋。
                    </p>

                    {/* ExportButton */}
                    {/* 本週結束，你應該要會 — B 標準格式 */}
                    <div className="bg-white border border-[var(--border)] rounded-[var(--radius-unified)] overflow-hidden mb-4">
                        <div className="p-4 px-5 bg-[var(--paper-warm)] border-b border-[var(--border)] font-bold text-[13px]">
                            ✅ 本週結束，你應該要會
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-[1px] bg-[var(--border)]">
                            {[
                                                '把計畫書 1-5 章從雛形修到定稿（W9 老師回饋已整合）',
                                                '在第六章把研究問題轉成具體工具題目',
                                                '為每個工具設計決策說清楚「為什麼這樣設計」',
                                                '列出課後 W10→W11 之間要補的事（不要拖）',
                            ].map((item, i) => (
                                <div key={i} className="p-4 px-5 bg-white flex items-start gap-3">
                                    <span className="text-[var(--success)] text-[16px] mt-0.5 flex-shrink-0">✓</span>
                                    <span className="text-[13px] text-[var(--ink-mid)] leading-relaxed">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <ExportButton
                        weekLabel="W10 計畫書整本"
                        fields={EXPORT_FIELDS}
                    />

                    {/* W11 預告（新流程：第一節工具實體 + 第二節 Pilot+倫理+施測） */}
                    <div className="bg-[var(--ink)] border-l-4 border-[var(--danger)] p-5 md:p-6 rounded-r-lg text-white shadow-xl">
                        <div className="flex items-center gap-2 mb-3">
                            <Users size={20} className="text-[var(--danger)]" />
                            <span className="font-mono text-[11px] font-bold tracking-[0.2em] text-[var(--danger)] uppercase">W11 預告 · 工具實體 × 跨班 Pilot × 倫理 × 施測啟動</span>
                        </div>
                        <div className="font-bold text-[17px] md:text-[18px] mb-3 leading-tight">
                            下週兩節分明：第一節做工具實體、第二節做跨班 Pilot
                        </div>
                        <p className="text-[13px] text-white/85 leading-[1.9] mb-3">
                            <strong className="text-white">第一節（50 min）</strong>：讀老師 GC 回饋 → 修星號項 → 拿模板填**工具實體完整版**（依方法：問卷／訪綱／實驗／觀察／文獻分析架構）。
                        </p>
                        <p className="text-[13px] text-white/85 leading-[1.9] mb-3">
                            <strong className="text-white">第二節（50 min）</strong>：跨班 Pilot 互測 20 min（座位圖配對）→ 雙向紀錄 5 min → 倫理快速 10 min → 施測啟動 10 min。
                        </p>
                        <p className="text-[12.5px] text-white/70 leading-[1.9] font-mono">
                            課後任務：對照「課後待補清單」，把第八章草稿先補一輪（W11 拿到回饋會更清楚要怎麼寫）
                        </p>
                    </div>
                </div>
            ),
        },
    ];

    return (
        <div className="page-container animate-in-fade-slide">
            {/* TOP BAR */}
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-4 mb-8 md:mb-12 gap-3">
                <div className="text-[11px] font-mono text-[var(--ink-light)] flex items-center gap-2 min-w-0">
                    <span className="hidden md:inline">研究方法與專題 / 資料蒐集 / </span><span className="text-[var(--ink)] font-bold">計畫書·整本定稿 W10</span>
                </div>
                <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
                    <span className="bg-[var(--paper-warm)] text-[var(--ink)] text-[10px] font-bold px-2 py-0.5 rounded-[2px] font-mono">100 MINS</span>
                    <ResetWeekButton weekPrefix="w10-" />
                    <button
                        onClick={() => setShowLessonMap(!showLessonMap)}
                        className="text-[11px] text-[var(--ink-light)] hover:text-[var(--accent)] transition-colors flex items-center gap-1 font-mono"
                        type="button"
                    >
                        <Map size={12} /> <span className="hidden md:inline">{showLessonMap ? 'Hide Plan' : 'Instructor View'}</span>
                    </button>
                    <span className="hidden md:inline-block bg-[var(--ink)] text-white text-[10px] font-bold px-2 py-0.5 rounded-[2px] font-mono">AI-RED · E</span>
                </div>
            </div>

            {showLessonMap && (
                <div className="animate-in slide-in-from-top-4 duration-300 mb-8">
                    <LessonMap data={W10Data} />
                </div>
            )}

            {/* PAGE HEADER — Hero Block */}
            <HeroBlock
                kicker="R.I.B. 調查檔案 · 研究方法與專題 · W10"
                title="計畫書 · "
                accentTitle="整本定稿"
                subtitle="W10 目標 = 把整本計畫書寫到定稿級。第一節：W9 沒寫完的 1-5 章補完 + 在 docx 第六章填具體題目（結構／基本資料／變項題目／自檢）。第二節：第七~十三章補完 + 整本 AIRED + 繳交。整本 AI 檢核交給老師跑，W11 拿到 GC 回饋再修工具，並把題目轉成施測載具（Google Form／紙本）+ 跨班 Pilot。"
                chain="計畫書骨架立起來了——但工具細節還沒寫到能執行的程度。這週把訪綱／問卷題／實驗流程寫到位。"
                meta={[
                    { label: '第一節 ① + ②', value: '開場 + 第六章流程提醒 → 工具書自學教案（5 法 4 區塊）→ 回 docx 寫題目' },
                    { label: '第二節 ③ + ④', value: '七到十三章 × 整本繳交 → 繳交確認 + W11 預告' },
                    { label: '課堂產出', value: '計畫書 docx 整本（13 章；8、9-(三) 草稿即可）' },
                    { label: '前置要求', value: 'W9 計畫書第 1-5 章雛形（含第四章變項／主題）' },
                ]}
            />
            <CourseArc items={[
                    { wk: 'W1-W4', name: '探索\n定題', status: 'past' },
                    { wk: 'W5-W6', name: '操作型定義\n海報博覽會', status: 'past' },
                    { wk: 'W7-W8', name: '文獻偵探\n引用寫作', status: 'past' },
                    { wk: 'W9', name: '計畫書\n地基工程', status: 'past' },
                    { wk: 'W10', name: '工具設計\n整本檢核', status: 'now' },
                    { wk: 'W11', name: 'Pilot Test\n倫理審查', status: '' },
                    { wk: 'W12-W15', name: '執行研究\n數據分析', status: '' },
                ]} />

            {/* STEP ENGINE */}
            <StepEngine
                steps={steps}
                prevWeek={{ label: '回 W9 工具設計', to: '/w9' }}
                nextWeek={{ label: '前往 W11 倫理審查', to: '/w11' }}
            flat
            />
        </div>
    );
};
