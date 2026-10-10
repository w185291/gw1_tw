> 最新規格：以 [完整性規範](REQUIREMENTS_COMPLETENESS.md) 與 [技能資料庫](REQUIREMENTS_SKILLS.md) 為優先。

目前工作擴充：依 docs/REQUIREMENTS_PHASE2.md 與 docs/REQUIREMENTS_PHASE3.md 完成第二章、第三章；本文件仍定義共用架構。最新附件優先，遊戲事實以 Wiki 查核結果為準。

# GW1 攻略網站專案需求

請建立一個可正式部署、可長期維護的 Guild Wars 1 攻略網站。

這不是單一 HTML 頁面，也不要建立大量彼此獨立、重複 header/footer 的靜態 HTML。

專案必須採用 Node.js 生態系，使用可重複利用的 layout、component、route、JSON/資料檔與 template 架構，未來可以持續加入：

- 第一章 Prophecies
- 第二章 Factions
- 第三章 Nightfall
- Eye of the North
- Guild Wars Beyond
- Elite Missions
- Dungeons
- Zaishen Missions / Bounties / Combat
- Heroes
- Skills
- Builds

目前第一階段先完成「各章節主線 / Mission 攻略」架構，並先把 Prophecies 做成完整示範。


# 1. 技術架構

使用：

- Node.js
- TypeScript
- Next.js（App Router）
- React
- CSS Modules / Tailwind CSS 擇一，優先選容易維護的方案
- JSON 或 TypeScript data files 儲存攻略資料
- 不使用資料庫作為第一階段必要條件
- 之後應容易改接 SQLite / PostgreSQL / CMS

需要支援：

- npm run dev
- npm run build
- npm run start
- npm run lint

正式 build 必須成功。


# 2. 專案核心原則

## 2.1 資料與版型分離

禁止把 25 個任務內容全部 hard-code 在 React component 裡。

所有任務資料應存在獨立資料層，例如：

src/data/campaigns/
  prophecies.json
  factions.json
  nightfall.json
  eye-of-the-north.json

或依章節拆成：

src/data/prophecies/
  campaign.json
  missions/
    01-the-great-northern-wall.json
    02-fort-ranik.json
    ...
    
UI 只負責讀資料並 render。


## 2.2 共用 template

所有 Mission 頁面必須共用同一個 MissionDetailTemplate。

例如：

/campaigns/prophecies/missions/the-great-northern-wall
/campaigns/prophecies/missions/fort-ranik
/campaigns/factions/missions/minister-chos-estate

都由相同 template 根據資料 render。

不要為每個 Mission 建一套不同 JSX。


# 3. 網站資訊架構

## Header

桌面版 Header 建議：

[GW1 攻略站 LOGO]

主線攻略
  ├─ 第一章 預言 Prophecies
  ├─ 第二章 陣營 Factions
  ├─ 第三章 夜幕 Nightfall
  └─ 北方之眼 Eye of the North

其他攻略
  ├─ Beyond
  ├─ 地下城
  ├─ 菁英任務
  ├─ 戰承任務
  └─ 英雄

Build
技能
搜尋


手機版改成 hamburger menu。


## Chapter Switcher

攻略頁面最重要的功能之一。

在章節頁及 Mission 頁上方提供明顯的章節切換：

[第一章 預言]
[第二章 陣營]
[第三章 夜幕]
[北方之眼]

目前章節要有 active 狀態。

使用者不需要回首頁才能換章。


# 4. 首頁設計

首頁不要塞滿文章。

首頁目標是讓使用者 3 秒內找到要去的地方。

建議：

Hero 區：

Guild Wars 1 中文攻略
主線、任務、Bonus、英雄與副本攻略

[開始檢視主線攻略]
[搜尋攻略]


下一區：

四張大型章節卡片

Prophecies
第一章 預言
25 個主要 Mission

Factions
第二章 陣營

Nightfall
第三章 夜幕

Eye of the North
北方之眼


再往下：

常用入口：

- 主線攻略
- Bonus / Masters
- 英雄取得
- 地下城
- Elite Mission
- Zaishen
- Builds


# 5. 章節首頁設計

例如：

/campaigns/prophecies

頁面應有：

第一章 預言
Guild Wars Prophecies

章節簡介

[章節進度導航]


下面顯示 Mission timeline。

例如：

01 北方長城
The Great Northern Wall
→

02 瑞尼克要塞
Fort Ranik
→

03 蘇米亞廢墟
Ruins of Surmia

...


不要只做一張巨大 table。

桌面版可以用：

左側序號 / timeline
右側 mission card

手機版則垂直排列。


每個 Mission card 顯示：

- 編號
- 中文名稱
- 英文名稱
- 地區
- Mission 型別
- 是否有 Bonus
- 難度
- 預估時間
- 一句話目標
- [檢視攻略]


# 6. Mission 詳細頁 Template

每個攻略頁統一呈現：

Breadcrumb：

首頁
>
第一章 預言
>
北方長城


標題：

# 北方長城
The Great Northern Wall


資訊摘要：

章節：第一章 預言
地區：Ascalon
Mission：01 / 25
隊伍上限：
建議等級：
一般模式：支援
困難模式：支援
Bonus：有


## 任務目標

用最簡單的人話說明：

「往北偵察夏爾軍隊，看到敵軍後撤回長城。」


## Bonus / 隱藏任務

清楚說：

Bonus 名稱
如何觸發
需要找什麼
容易漏在哪裡
完成判定


## 建議攻略流程

使用 Step：

1.
2.
3.
4.

避免整頁長篇 wiki 式文字。


## 地圖 / 關鍵位置

第一階段可以先預留：

mapImage
mapNotes

未來可加入圖片。


## 敵人與 Boss

列：

Boss 名稱
職業
重要技能
需要注意事項


## 推薦隊伍

例如：

- 建議有補師
- 建議帶解狀態
- 建議帶打斷
- 有特定英雄限制時標示


## NM / HM 差異

清楚標：

普通模式：
困難模式：

如果 HM 沒特殊機制，也要寫：

「主要差異為敵人等級與傷害提高，任務機制相同。」


## 獎勵

列表：

NM
Bonus
HM
Zaishen Mission（如果適用）


## 容易失敗的地方

用醒目的 Warning Card。


## 外部資料

Guild Wars Wiki：
[English Wiki]

PvX：
如果有相關 build 再顯示。


# 7. Mission JSON Schema

每個 Mission 至少支援：

{
  "id": "the-great-northern-wall",
  "order": 1,
  "campaign": "prophecies",
  "region": "ascalon",

  "name": {
    "zhTW": "北方長城",
    "en": "The Great Northern Wall"
  },

  "type": "cooperative-mission",

  "summary": "偵察夏爾軍隊並返回長城。",

  "partySize": 4,

  "difficulty": {
    "normal": 1,
    "hard": 2
  },

  "estimatedMinutes": {
    "normal": 15,
    "hard": 20
  },

  "objectives": [
    {
      "text": "偵察夏爾軍隊"
    }
  ],

  "bonus": {
    "available": true,
    "title": "...",
    "summary": "...",
    "steps": [
      "...",
      "..."
    ],
    "missable": true
  },

  "walkthrough": [
    {
      "title": "離開長城",
      "content": "..."
    }
  ],

  "bosses": [],

  "tips": [],

  "warnings": [],

  "rewards": {
    "normal": [],
    "bonus": [],
    "hard": []
  },

  "wiki": {
    "guildWarsWiki": "https://wiki.guildwars.com/wiki/The_Great_Northern_Wall"
  },

  "previousMission": null,
  "nextMission": "fort-ranik"
}


# 8. Campaign JSON Schema

例如：

{
  "id": "prophecies",

  "name": {
    "zhTW": "第一章：預言",
    "en": "Guild Wars Prophecies"
  },

  "shortName": "Prophecies",

  "order": 1,

  "description": "...",

  "regions": [
    "Ascalon",
    "Northern Shiverpeaks",
    "Kryta",
    "Maguuma Jungle",
    "Crystal Desert",
    "Southern Shiverpeaks",
    "Ring of Fire"
  ]
}


# 9. 必須考慮各章節任務結構不同

不要假設所有章節都是 25 個「按 Enter Mission」的 Mission。

Guild Wars 各章節不同：

Prophecies / Factions：
很多 Mission 從 Mission Outpost 使用 Enter Mission 進入。

Nightfall：
Mission 通常由 Mission Starter NPC 開始，而且主線 Primary Quest 對進度非常重要。

Eye of the North：
很多所謂 Mission 實際上屬於 Primary Quest / Dungeon / storyline quest。

所以 data model 必須支援：

type:
- cooperative-mission
- primary-quest
- dungeon
- elite-mission
- challenge-mission
- story-quest

不要將架構寫死成：

campaign -> missions only。


# 10. 第二章未來需求

Factions 需要考慮：

- 主線 Mission
- Kurzick / Luxon 分支
- Competitive Mission
- Challenge Mission
- Elite Mission
- The Deep
- Urgoz's Warren
- Winds of Change

UI 需要能區分：

主線
支線
菁英
Beyond


# 11. 第三章未來需求

Nightfall 需要：

- Primary Quest
- Mission
- Hero requirements
- Standard / Expert / Master reward
- Realm of Torment
- Gate of Anguish

Mission detail 要能顯示：

Required Hero:
Dunkoro / Koss / etc.


# 12. Eye of the North 未來需求

EotN 與前三章不同。

需要支援：

- Main Story
- Asura storyline
- Norn storyline
- Ebon Vanguard storyline
- Deldrimor storyline
- Dungeon
- Hero recruitment

章節頁最好能顯示分支式流程圖，而不是隻有直線 Timeline。


# 13. Navigation UX

每個 Mission 頁底部必須有：

← 上一關
回章節列表
下一關 →

例如：

← Fort Ranik
Prophecies Mission List
Ruins of Surmia →


另外左側 Desktop sidebar：

第一章 預言

01 北方長城
02 瑞尼克要塞
03 蘇米亞廢墟
...

目前頁面 highlight。


手機版不要固定 sidebar，改成：

[Mission 3 / 25 ▼]

點選後開 Drawer。


# 14. 搜尋

網站未來內容很多，所以搜尋是必要功能。

至少支援：

中文：
白影田勝
神聖海岸
雷撒
珊卓亞

英文：
Shiro
Divinity Coast
Razah
Xandra

搜尋資料來源：

- 中文名稱
- 英文名稱
- aliases
- tags

JSON 支援：

"aliases": [
  "白影",
  "Shiro Tagachi"
]


# 15. Filter

Mission List 可以篩選：

章節
地區
Mission 型別
有無 Bonus
NM / HM
難度


未來其他內容可以篩：

Hero
Dungeon
Elite
Zaishen


# 16. URL 設計

URL 不要使用中文。

建議：

/
/campaigns
/campaigns/prophecies
/campaigns/prophecies/missions
/campaigns/prophecies/missions/the-great-northern-wall

/campaigns/factions
/campaigns/nightfall
/campaigns/eye-of-the-north

/heroes
/heroes/razah

/dungeons
/dungeons/bogroot-growths

/elite-missions
/elite-missions/the-deep


URL slug 由資料中的 id 決定。


# 17. Header / Footer / Layout

建立：

RootLayout
SiteHeader
MainNavigation
CampaignSwitcher
Breadcrumbs
SidebarNavigation
SiteFooter

所有頁面共用。

Footer：

Guild Wars 1 攻略站
資料參考來源
Guild Wars Wiki
PvXwiki

並加入：

「本站為玩家製作之非官方攻略網站」


# 18. UI 設計風格

不要照抄 Guild Wars Wiki。

希望是：

- 深色背景
- 暖金 / 羊皮紙風格 Accent
- 有 Guild Wars 奇幻風格
- 但保持現代網站可讀性
- 不要過度華麗
- 不要大量發光
- 不要用遊戲字型導致中文難讀

主要目標：

資訊密度高但不混亂。

PC 使用者：
適合邊玩遊戲邊開第二螢幕檢視。

手機：
適合快速檢視 Bonus、Boss、下一步。


# 19. 攻略頁資訊優先順序

使用者最想先看到：

1. 我要去哪
2. 我要做什麼
3. Bonus 怎麼解
4. 容易漏什麼
5. Boss 怎麼打
6. HM 有什麼差
7. 獎勵
8. Wiki 原始資料

所以頁面順序必須符合這個需求。

不要像 Wiki 一樣要求使用者看大量背景故事後才找到攻略。


# 20. 顏色標籤

建議統一 Badge：

NM
HM
BONUS
BOSS
HERO REQUIRED
ELITE
DUNGEON
ZAISHEN

不要依賴顏色作為唯一資訊來源，文字也必須存在。


# 21. SEO

每一頁要產生：

title
description
canonical
Open Graph metadata

例如：

北方長城攻略｜Guild Wars 1 第一章預言

Description：

GW1 北方長城完整攻略，包含主線流程、Bonus 隱藏任務、NM/HM 差異與注意事項。


# 22. Accessibility

必須：

- 正確 semantic HTML
- heading 階層
- keyboard navigation
- aria-label
- 足夠 contrast
- responsive


# 23. 第一階段實作內容

Phase 1：

1. 建立完整 Node.js / Next.js 專案
2. Header / Footer / Layout
3. 首頁
4. Campaign index
5. Prophecies chapter page
6. Mission detail reusable template
7. 建立 Prophecies 25 Mission 的資料結構
8. 至少完整輸入 3 個 Mission 作 demo：
   - The Great Northern Wall
   - Gates of Kryta
   - Divinity Coast
9. 剩餘 Mission 可以先建立資料 stub
10. Search 基礎版
11. Responsive UI
12. npm run build 必須成功


# 24. 第一章 Prophecies Mission 順序

01 The Great Northern Wall / 北方長城
02 Fort Ranik / 瑞尼克要塞
03 Ruins of Surmia / 蘇米亞廢墟
04 Nolani Academy / 諾拉尼學院
05 Borlis Pass / 柏里斯通道
06 The Frost Gate / 冰門
07 Gates of Kryta / 柯瑞塔關所
08 D'Alessio Seaboard / 達雷西海濱
09 Divinity Coast / 神聖海岸
10 The Wilds / 荒原
11 Bloodstone Fen / 血石沼澤
12 Aurora Glade / 極光林地
13 Riverside Province / 河畔地帶
14 Sanctum Cay / 聖者安息地
15 Dunes of Despair / 絕望沙丘
16 Thirsty River / 乾渴之河
17 Elona Reach / 伊洛那流域
18 Augury Rock / 預言之石
19 The Dragon's Lair / 巨龍巢穴
20 Ice Caves of Sorrow / 悲傷冰窟
21 Iron Mines of Moladune / 莫拉登礦山
22 Thunderhead Keep / 雷雲要塞
23 Ring of Fire / 火環群島
24 Abaddon's Mouth / 亞巴頓之口
25 Hell's Precipice / 地獄險境

注意：

15～17 水晶沙漠三關在遊戲中可以任意順序完成，
UI 上仍可依傳統列表排序，但要標示「三個飛昇試煉，可自由選擇順序」。


# 25. 程式品質要求

- TypeScript strict
- 不要 any 到處亂用
- 建立明確 interface/type
- ESLint 不可有主要 error
- component 不要超大型化
- 把資料處理與 UI 分離
- reusable component
- route 不 hard-code mission list
- 不要 copy paste 25 頁
- build 必須成功


# 26. README

建立 README.md，內容要包含：

- 專案用途
- 技術棧
- 安裝方式
- 開發方式
- build
- 新增章節方法
- 新增 Mission 方法
- JSON schema 說明
- 圖片放置位置
- 未來資料庫 / CMS 升級方向


# 27. 最後請執行

完成後：

1. npm install
2. npm run lint
3. npm run build

修正所有會導致 build failure 的錯誤。

最後回報：

- 建立了哪些頁面
- 資料夾結構
- 新增攻略資料的方法
- build 結果
- 下一階段最值得做什麼
