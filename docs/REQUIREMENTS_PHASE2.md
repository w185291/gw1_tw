# Phase 2：Guild Wars Factions 第二章攻略資料補完規格

目標：
在既有 GW1 攻略網站架構上，完整補上第二章 Factions 的主線 Mission 攻略資料。

這不是重新做網站。
必須沿用既有：

- Header
- Footer
- Campaign Switcher
- Breadcrumb
- Mission Detail Template
- Search
- JSON / TS data layer
- Responsive UI
- SEO metadata

請不要為第二章建立另一套 page.tsx 或獨立 HTML。


# 一、資料來源規則

第二章所有遊戲事實資料，請優先查：

## 1. Guild Wars Wiki 主清單
https://wiki.guildwars.com/wiki/List_of_Factions_missions_and_primary_quests

這一頁用來確認：

- 主線 Mission 正確順序
- Mission 前後的 Primary Quest
- Kurzick / Luxon 分支
- 非 Factions 角色從哪裡接入
- Challenge Mission
- Competitive Mission
- Elite Mission

官方 Wiki 顯示 Factions 有：
- 13 個 Cooperative Missions
- 5 個 Challenge Missions
- 2 個 Competitive Missions
- 2 個 Elite Missions

注意：
Unwaking Waters 有 Kurzick / Luxon 兩條入口，
因此故事流程看起來像 12 個主要階段，但官方 Cooperative Mission 數量是 13。 


## 2. 每一關自己的 Wiki 頁面

請用英文 Mission 名直接查：

https://wiki.guildwars.com/wiki/<Mission_Name>

例如：

https://wiki.guildwars.com/wiki/Minister_Cho%27s_Estate
https://wiki.guildwars.com/wiki/Vizunah_Square
https://wiki.guildwars.com/wiki/Tahnnakai_Temple
https://wiki.guildwars.com/wiki/Imperial_Sanctum

每關至少閱讀以下區塊：

- Objectives
- Rewards
- Walkthrough
- Bonus / Master's reward
- NPCs
- Foes
- Bosses
- Notes
- Bugs
- Dialogue（只有在攻略需要時）
- Hard mode（若該頁有特別說明）
- Mission map / 地圖

不要只看搜尋摘要。


## 3. Primary Quest

第二章 Mission 中間有大量 Primary Quest 串接。

查詢：

https://wiki.guildwars.com/wiki/List_of_Factions_missions_and_primary_quests

再點入各 Primary Quest。

網站 Mission 頁至少要說清楚：

- 上一關完成後去哪
- 要接哪一個 Primary Quest
- 找哪個 NPC
- 下一個 Mission Outpost 怎麼開
- 是否有陣營需求

不要讓玩家打完一關後不知道下一步。


# 二、第二章主線順序

依 Guild Wars Wiki 整理：

## Shing Jea Island

01. Minister Cho's Estate
02. Zen Daijun

注意：
這兩關是 Factions 原生角色的新手島流程。

非 Factions 出生角色不會正常走這兩關的主線，
而是在 Kaineng City 透過 Welcome to Cantha 接入。


## Kaineng City

03. Vizunah Square
04. Nahpui Quarter
05. Tahnnakai Temple


## Echovald Forest / Jade Sea 前段

06. Arborstone
07. Boreas Seabed


## Kaineng City

08. Sunjiang District


## 分支

完成 Sunjiang District 後，主線分成 Kurzick / Luxon。

兩條都可以做，但只需要完成其中一條就能繼續主線。

### Kurzick Route

09A. The Eternal Grove
10A. Unwaking Waters

Primary Quest 應包含：

Journey to House zu Heltzer
Befriending the Kurzicks
The Defenders of the Forest
Into the Whirlpool


### Luxon Route

09B. Gyala Hatchery
10B. Unwaking Waters

Primary Quest 應包含：

Journey to Cavalon
Befriending the Luxons
Stolen Eggs
Journey to the Whirlpool


## 兩線匯合

完成 Unwaking Waters 後：

Taking Back the Palace

11. Raisu Palace
12. Imperial Sanctum


# 三、每一關攻略必須回答的問題

每個 Mission 頁不能只是翻 Wiki。

網站定位是：

「玩家正在遊戲裡，希望 10 秒內知道下一步。」

所以每頁最上方必須先回答：

1. 我在哪裡開始？
2. 怎麼開這關？
3. 我要做什麼？
4. Master's Reward 怎麼拿？
5. 最容易失敗的點是什麼？
6. Boss 要注意什麼？
7. 打完去哪？


# 四、每關資料格式

每個 Mission 至少整理：

## 基本資訊

- 中文名稱
- 英文名稱
- Mission 順序
- 所屬章節
- Region
- Mission Outpost
- Party Size
- 如何抵達
- 前置 Primary Quest
- 下一個 Primary Quest / Mission


## 主目標

用簡短中文描述。

例如：

「一路護送 Master Togo 與 Mhenlo，消滅感染者並抵達出口。」

不要直接搬 Wiki 長句。


## 詳細攻略

拆成 Step：

1.
2.
3.
4.

每一步都要說：

- 往哪走
- 要殺什麼
- 要保護誰
- 哪裡不要亂衝
- 哪裡容易 wipe


## Master's Reward

Factions 與 Prophecies 不同。

第一章常見的是：

Mission + Bonus

第二章很多 Mission 是：

Standard
Expert
Master

請正確記錄每一關取得 Master's Reward 的條件。

可能是：

- 完成時間
- NPC 存活數
- 特殊條件
- 殺敵數

不要假設全部都是時間制。

JSON 建議：

"masterReward": {
  "available": true,
  "type": "time",
  "condition": "...",
  "master": "...",
  "expert": "...",
  "standard": "..."
}


## Boss

列：

- 中文名稱
- 英文名稱
- 職業
- Elite Skill
- 特別危險技能
- 玩家應對方式


## NM / HM

至少說清楚：

NM：
- 適合第一次通關
- Mission 機制

HM：
- 怪物強度差異
- 是否有特殊難點
- 是否影響 Master's Reward
- 是否建議英雄隊配置調整


## 容易失敗

建立 Warning Card，例如：

- NPC 死亡直接失敗
- 拉太多怪
- Boss 會回血
- 忘記操作機關
- 忘記拿 Mission item
- 不要提早觸發某區


## 推薦

以「功能」描述，不要硬指定唯一 Build：

- 建議帶打斷
- 建議帶解狀態
- 建議帶拆附魔
- 建議帶群體補血
- 建議帶防護
- 建議針對近戰


# 五、第二章各關特別要注意的攻略方向

## 01 Minister Cho's Estate

重點查：

- 任務流程
- Afflicted / infected enemy 的位置
- Master reward 條件
- 新手島玩家容易漏什麼

這是新角色早期關卡，
攻略不用寫太複雜。


## 02 Zen Daijun

重點：

- 敵人分布
- Mission mechanic
- Master reward
- 新手玩家怎麼安全過


## 03 Vizunah Square

這關必須寫詳細。

需要查：

- Foreign Quarter
- Local Quarter
- 兩隊如何匯合
- Master Togo / Mhenlo 生存
- NPC AI
- 大量 Afflicted
- 最容易 wipe 的戰鬥區

特別標示：

「非 Factions 角色會從這段附近接入第二章主線。」

這頁應該是第二章重點攻略之一。


## 04 Nahpui Quarter

需要說明：

- Celestial bosses
- 四個方位
- 每殺一隻後會發生什麼
- Weh no Su / Ascension 性質
- 建議擊殺順序

這關對新玩家很容易搞不懂，
請用人話解釋。


## 05 Tahnnakai Temple

需要詳細說明：

- 多個房間
- 每個房間 Boss
- 時間壓力
- 拉怪方式
- 不要一次拉太多
- Master reward 時間條件

這是一個很適合做：
「房間 1 → 房間 2 → 房間 3」
流程 UI 的 Mission。


## 06 Arborstone

需要查：

- Danika
- Cathedral
- Stone Reapers / Wardens
- escort
- Mission mechanics
- Master's Reward

注意 NPC 生存。


## 07 Boreas Seabed

需要查：

- Luxon arena 前段
- Turtle
- Kraken / Leviathan 類敵人
- Mission 兩階段差異
- Boss
- Master's Reward


## 08 Sunjiang District

這是分支前的重要關卡。

必須說：

「打完後主線分成 Kurzick / Luxon。」

頁尾不能只放單一 Next Mission。

應顯示：

下一步：

Kurzick Route
→ The Eternal Grove

或

Luxon Route
→ Gyala Hatchery

兩條之後都會進 Unwaking Waters。


## 09A The Eternal Grove

這關要做非常詳細。

重點：

- Tree Singers
- Juggernauts
- 多方向敵人
- NPC 防守
- Master's Reward
- 哪幾個 NPC 必須活著

建議做：
「防守階段時間線」。


## 09B Gyala Hatchery

同樣是重點關。

需要說明：

- Siege Turtles
- Young Turtles
- Escort
- Luxon enemies
- 哪些 NPC 不能死
- Master's Reward

攻略應說：
「哪些時候要停、哪些怪先清、不要讓 NPC 自己衝。」


## 10 Unwaking Waters

要解釋：

- Kurzick / Luxon 兩個 Mission outpost 版本
- 兩條路線如何匯合
- Kuunavang
- Boss mechanics
- Mission reward

資料 model 要允許：

same mission id
但有不同 entry route / outpost。


## 11 Raisu Palace

重點：

- 宮殿內大量 Afflicted
- allied NPC
- room progression
- Shiro'ken
- bosses
- Master's Reward

建議寫成：
「區域 / 房間分段攻略」。


## 12 Imperial Sanctum

這是白影田勝 Shiro Tagachi 最終戰。

必須詳細寫：

- Shiro 技能
- Battle Scars
- Impossible Odds
- Meditation of the Reaper
- stance removal
- anti-melee hex
- interrupt
- knockdown
- common mistakes

攻略建議必須用：
「機制 → 對策」
形式呈現。

例如：

Battle Scars
→ 他會大量回血
→ 建議帶拆姿態

Impossible Odds
→ 攻擊能力暴增
→ 建議防護 / Blind / anti-melee

不要只寫「集火 Shiro」。


# 六、Wiki 查詢方式

Codex 搜尋時優先使用英文名。

Google / Web Search Query 格式：

site:wiki.guildwars.com "Vizunah Square"

site:wiki.guildwars.com "Vizunah Square" walkthrough

site:wiki.guildwars.com "Vizunah Square" reward

site:wiki.guildwars.com "Vizunah Square" hard mode

site:wiki.guildwars.com "Vizunah Square" master reward


也可以直接開：

https://wiki.guildwars.com/wiki/Vizunah_Square


其他例子：

site:wiki.guildwars.com "Tahnnakai Temple"
site:wiki.guildwars.com "The Eternal Grove"
site:wiki.guildwars.com "Gyala Hatchery"
site:wiki.guildwars.com "Imperial Sanctum"


如果需要查 Boss：

site:wiki.guildwars.com "Shiro Tagachi"

如果需要查技能：

site:wiki.guildwars.com "Battle Scars"


# 七、資料可信度規則

資料來源優先順序：

1. Guild Wars Wiki
2. PvXwiki
3. Guild Wars Legacy / Reddit 玩家經驗
4. 其他攻略網站

遊戲事實：

- Mission 順序
- NPC
- Boss
- 技能
- Rewards
- Master condition
- Unlock condition

必須以 Guild Wars Wiki 為主。

玩家建議：

- 哪隊英雄好用
- 哪招比較好打
- 快速路線
- 拉怪技巧

可以參考 PvX / 玩家討論。


# 八、禁止事項

不要：

- 憑記憶填 Mission reward
- 自己猜中文翻譯
- 把 Prophecies Bonus 套到 Factions
- 假設所有 Master reward 都是時間限制
- 把 Challenge Mission 混進主線
- 把 Competitive Mission 混進 PvE 主線
- 把 Elite Mission 當成破關必要
- 把 Winds of Change 放進原始 Factions 主線
- 複製 Wiki 原文大量貼上


# 九、第二章其他內容分類

主線之外另外建立分類。

## Challenge Missions

- Dragon's Throat
- Altrumm Ruins
- Amatz Basin
- Zos Shivros Channel
- The Aurios Mines

官方共 5 個。


## Competitive Missions

- Fort Aspenwood
- The Jade Quarry

這兩個是 PvP 類型，
英雄與傭兵不能當成一般 PvE Mission 使用。


## Elite Missions

- Urgoz's Warren
- The Deep

這兩個不是主線必要內容，
難度與時間都比一般 Mission 高。


## Beyond

- Winds of Change

Winds of Change 是第二章故事之後的 Guild Wars Beyond 內容，
不要列在原本 12/13 個主線 Mission 中。


# 十、第二章章節頁 UI

第二章不能照第一章完全直線。

建議：

01 Minister Cho's Estate
↓
02 Zen Daijun
↓
03 Vizunah Square
↓
04 Nahpui Quarter
↓
05 Tahnnakai Temple
↓
06 Arborstone
↓
07 Boreas Seabed
↓
08 Sunjiang District
↓
┌────────────────┬────────────────┐
│ Kurzick        │ Luxon          │
│ Eternal Grove  │ Gyala Hatchery │
└────────┬───────┴───────┬────────┘
         ↓               ↓
         Unwaking Waters
                ↓
          Raisu Palace
                ↓
       Imperial Sanctum


手機版不用畫複雜流程線，
可以用：

[選擇路線]
Kurzick
Luxon

兩張 Card 表示。


# 十一、攻略文字風格

使用繁體中文。

英文名稱放在中文旁邊。

例如：

白影田勝（Shiro Tagachi）

不要要求玩家只看英文。


避免 Wiki 式寫法：

「Proceed southwest until encountering...」

改寫成人話：

「從入口往西南走。第一群感染者不用急著衝進去，先把巡邏怪拉出來清掉。」


攻略內容優先：

1. 下一步去哪
2. 要做什麼
3. 怎麼拿 Master
4. 哪裡會死人
5. Boss 怎麼處理
6. 打完去哪


# 十二、資料驗證

每完成一個 Mission JSON：

必須檢查：

- 英文名正確
- Mission 順序
- Region
- Wiki URL 能開
- Previous Mission
- Next Mission
- Master condition
- Party size
- Boss
- Rewards

所有未知欄位：

不要猜。

填：

null

或：

"verificationStatus": "needs-review"


# 十三、完成順序

不要一次亂抓 13 關。

建議順序：

第一批：

1. Vizunah Square
2. Nahpui Quarter
3. Tahnnakai Temple
4. Sunjiang District
5. The Eternal Grove
6. Gyala Hatchery
7. Unwaking Waters
8. Imperial Sanctum

這些先做成完整攻略。

第二批：

9. Minister Cho's Estate
10. Zen Daijun
11. Arborstone
12. Boreas Seabed
13. Raisu Palace


最後執行：

npm run lint
npm run build

修正所有錯誤。

最後回報：

- 補了哪些 Mission
- 哪些欄位仍需人工核對
- 有沒有發現第一章 template 不足以支援第二章
- 是否新增 branch / masterReward / routeChoice schema
