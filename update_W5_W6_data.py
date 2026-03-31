import re

with open("src/data/lessonMaps.js", "r", encoding="utf-8") as f:
    text = f.read()

# Replace W50Data
w50_new = """export const W50Data = {
    id: "W5",
    title: "文獻偵探的入門訓練",
    duration: 100,
    durationDesc: "2 節課",
    metaCards: [
        { label: '第一節', value: '檔案室的純手工調查' },
        { label: '第二節', value: '證物鑑識與 APA 格式' },
        { label: '小組任務', value: '證物 A–E 鑑識與查核' },
        { label: '最終產出', value: '1 篇真實證物文獻' }
    ],
    courseArc: baseCourseArc.map((item, idx) => ({
        ...item,
        past: idx < 2,
        now: idx === 2
    })),
    coreConcepts: [
        {
            prefix: "①",
            title: "手動搜索",
            subtitle: "不准用 AI",
            desc: "學習如何下關鍵字，在華藝資料庫中找到真實文獻",
            colorConfig: "r"
        },
        {
            prefix: "②",
            title: "APA格式",
            subtitle: "標準證物標籤",
            desc: "正確紀錄作者與年份，學會法庭標準格式",
            colorConfig: "g"
        },
        {
            prefix: "③",
            title: "文獻等級",
            subtitle: "A到D的鑑識",
            desc: "識別哪些是主要證據，哪些是不能用在報告的廢料",
            colorConfig: "c"
        }
    ],
    periods: [
        {
            badge: "第一節",
            title: "檔案室的手動搜索",
            duration: 50,
            hasBreakAfter: true,
            stages: [
                {
                    timeStart: "0:00", timeEnd: "0:05", duration: "5 min",
                    colorClass: "c3", icon: "🏛️",
                    title: "階段 0｜開場與定位",
                    desc: "帶上前一週定案題目，進入資料庫檔案室，不依賴 AI 靠自己搜尋。",
                    tags: ["純手工", "題目延續"]
                },
                {
                    timeStart: "0:05", timeEnd: "0:15", duration: "10 min",
                    colorClass: "c4", icon: "🗺️",
                    title: "階段 1｜擬定搜索策略",
                    desc: "填寫搜尋計畫書，列出3組關鍵字，設定年份與範圍限制。",
                    tags: ["規劃策略", "關鍵字"]
                },
                {
                    timeStart: "0:15", timeEnd: "0:40", duration: "25 min",
                    colorClass: "c1", icon: "👀",
                    title: "階段 2｜實戰搜尋找到第一件證物",
                    desc: "登入碩博系統找到 1 篇符合的文獻，說明它與自己題目的關聯。",
                    tags: ["華藝實戰", "獨立找尋"]
                },
                {
                    timeStart: "0:40", timeEnd: "0:50", duration: "10 min",
                    colorClass: "c2", icon: "🏷️",
                    title: "階段 3｜APA 標籤製作練習",
                    desc: "對照 APA 規範清單，幫找到的文獻貼上標準格式標籤。",
                    tags: ["APA 格式", "細節檢視"]
                }
            ]
        },
        {
            badge: "第二節",
            title: "證物鑑識大賽——等級判定",
            duration: 50,
            hasBreakAfter: false,
            stages: [
                {
                    timeStart: "0:00", timeEnd: "0:10", duration: "10 min",
                    colorClass: "c1", icon: "⚖️",
                    title: "階段 4｜文獻等級定義(A-D)",
                    desc: "說明 A 級到 D 級差別，並介紹 AI 捏造的學術文獻陷阱。",
                    tags: ["證據等級", "防禦偽證"]
                },
                {
                    timeStart: "0:10", timeEnd: "0:40", duration: "30 min",
                    colorClass: "c2", icon: "🔬",
                    title: "階段 5｜小組鑑識任務",
                    desc: "發放 A–E 神秘證物卡，調查是名校碩論還是內容農場，寫下查核路徑。",
                    tags: ["小組合作", "查核實戰"]
                },
                {
                    timeStart: "0:40", timeEnd: "0:50", duration: "10 min",
                    colorClass: "c3", icon: "🏁",
                    title: "階段 6｜總結與下週預告",
                    desc: "總結偽證判定，預告下週學習如何將 A 級文獻「寫入」報告中。",
                    tags: ["總結", "下週預告"]
                }
            ]
        }
    ],
    tasks: [],
    homework: { deadline: '下次上課前', items: [ { p: '繳交', n: '上傳 W5 學習單' } ], footer: '' }
};"""

w5_new = """export const W5Data = {
    id: "W6",
    title: "文獻偵探社 (Sherlock Edition)",
    duration: 100,
    durationDesc: "2 節課",
    metaCards: [
        { label: '第一節', value: '識破換字抄襲與三明治引用' },
        { label: '第二節', value: '多文獻整合與同儕會診' },
        { label: '小組任務', value: '互相驗屍 (同儕審查)' },
        { label: '最終產出', value: '五句話結案報告' }
    ],
    courseArc: baseCourseArc.map((item, idx) => ({
        ...item,
        past: idx < 2,
        now: idx === 2
    })),
    coreConcepts: [
        {
            prefix: "①",
            title: "遮蓋測試",
            subtitle: "識破換字抄襲",
            desc: "遮住原文自己寫，確認結構是否自己掌握",
            colorConfig: "r"
        },
        {
            prefix: "②",
            title: "三明治法",
            subtitle: "觀點＋引用＋分析",
            desc: "頭中尾三層結構，讓讀者知道引用目的",
            colorConfig: "g"
        },
        {
            prefix: "③",
            title: "整合文獻",
            subtitle: "提煉故事",
            desc: "拒絕堆砌列點，將三篇文章寫成有方向的故事",
            colorConfig: "c"
        }
    ],
    periods: [
        {
            badge: "第一節",
            title: "犯罪鑑識與工具訓練",
            duration: 50,
            hasBreakAfter: true,
            stages: [
                {
                    timeStart: "0:00", timeEnd: "0:10", duration: "10 min",
                    colorClass: "c3", icon: "🕵️",
                    title: "入社儀式",
                    desc: "認識兩種常見報告犯罪：換字抄襲與文獻堆砌。",
                    tags: ["情境導入", "釐清盲點"]
                },
                {
                    timeStart: "0:10", timeEnd: "0:25", duration: "15 min",
                    colorClass: "c1", icon: "🚫",
                    title: "犯罪現場一：換字抄襲",
                    desc: "比較兩個版本差異，推廣「遮蓋測試」偵查工具。",
                    tags: ["遮蓋測試", "結構破解"]
                },
                {
                    timeStart: "0:25", timeEnd: "0:40", duration: "15 min",
                    colorClass: "c4", icon: "🍔",
                    title: "偵探工具：三明治引用法",
                    desc: "學習將文獻夾在觀點與分析之間，使引用具有結論。",
                    tags: ["三層結構", "寫作格式"]
                },
                {
                    timeStart: "0:40", timeEnd: "0:50", duration: "10 min",
                    colorClass: "c2", icon: "📚",
                    title: "偵探工具：多文獻整合",
                    desc: "教導如何將三篇不同的文獻用邏輯串連而非條列堆砌。",
                    tags: ["多文獻", "串連語感"]
                }
            ]
        },
        {
            badge: "第二節",
            title: "實地偵辦與互相驗屍",
            duration: 50,
            hasBreakAfter: false,
            stages: [
                {
                    timeStart: "0:00", timeEnd: "0:15", duration: "15 min",
                    colorClass: "c1", icon: "🔍",
                    title: "演練一：改寫偵錯",
                    desc: "找出甲乙學生的犯罪手法並自己實作正確的改寫。",
                    tags: ["實地演練", "糾錯"]
                },
                {
                    timeStart: "0:15", timeEnd: "0:25", duration: "10 min",
                    colorClass: "c2", icon: "🍔",
                    title: "演練二：三明治實戰",
                    desc: "使用 W5 找尋的文獻，實地撰寫一個三層完整引用。",
                    tags: ["自有文獻應用", "實戰"]
                },
                {
                    timeStart: "0:25", timeEnd: "0:40", duration: "15 min",
                    colorClass: "c4", icon: "📑",
                    title: "演練三：結案報告",
                    desc: "小組選材包撰寫多文獻整合，最後一句一定要呼應自身題目。",
                    tags: ["整合實作", "連回題目"]
                },
                {
                    timeStart: "0:40", timeEnd: "0:50", duration: "10 min",
                    colorClass: "c3", icon: "⚖️",
                    title: "同儕審查：互相驗屍",
                    desc: "交換文字作品，使用檢核表提供具體修改建議，不接受含糊評論。",
                    tags: ["同儕審查", "具體建議"]
                }
            ]
        }
    ],
    tasks: [],
    homework: { deadline: '下次上課前', items: [ { p: '繳交', n: '修改演練報告並上傳' } ], footer: '' }
};"""

start = text.find("export const W50Data = {")
end = text.find("export const W6Data = {", start)
if start != -1 and end != -1:
    new_text = text[:start] + w50_new + "\n\n" + w5_new + "\n\n" + text[end:]
    with open("src/data/lessonMaps.js", "w", encoding="utf-8") as f:
        f.write(new_text)
    print("Replace success.")
