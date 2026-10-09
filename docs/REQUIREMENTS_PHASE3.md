# Phase 3：Guild Wars Nightfall 第三章攻略資料補完規格

目標：
在既有 GW1 攻略網站架構上，完整補上第三章 Nightfall 主線攻略。

不要重新做網站。
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

Nightfall 的主線結構和 Prophecies / Factions 不同，
不能只做「Mission 列表」。

第三章大量依靠：
- Primary Quest
- Required Hero
- Mission Starter
- Standard / Expert / Master Reward
- Hero Recruitment
- Story Branch
- Realm of Torment

網站資料模型必須能完整表示這些內容。


# 一、主要資料來源

## 1. Guild Wars Wiki 主線清單

主要使用：

https://wiki.guildwars.com/wiki/List_of_Nightfall_missions_and_primary_quests

這一頁用來確認：

- Nightfall Mission 正確順序
- Mission 之間的 Primary Quest
- Required Hero
- 分支
- 外來角色接入點
- Istan / Kourna / Vabbi / Desolation / Realm of Torment 區域流程

不要只靠模型記憶。


## 2. 每個 Mission 自己的 Wiki 頁

格式：

https://wiki.guildwars.com/wiki/<Mission_Name>

例如：

https://wiki.guildwars.com/wiki/Chahbek_Village
https://wiki.guildwars.com/wiki/Consulate_Docks
https://wiki.guildwars.com/wiki/Moddok_Crevice
https://wiki.guildwars.com/wiki/Gate_of_Madness
https://wiki.guildwars.com/wiki/Abaddon%27s_Gate

每關至少查：

- Objectives
- Requirements
- Required Hero
- Rewards
- Walkthrough
- Standard / Expert / Master Reward
- NPCs
- Foes
- Bosses
- Notes
- Bugs
- Hard mode
- Map


## 3. Primary Quest

Nightfall 特別重要。

每個 Mission 頁必須額外說：

- 上一關結束後去哪
- 找哪個 NPC
- 接哪個 Primary Quest
- 哪隻英雄必須帶
- 下一個據點怎麼開

玩家打完 Mission 後，
不要讓他不知道下一步去哪。


# 二、Nightfall 主線區域

章節頁要先按區域分組：

1. Istan
2. Kourna
3. Vabbi
4. The Desolation
5. Realm of Torment

不要把 17 個 Mission 全部平鋪成沒有區域感的一長串。


# 三、主線 Mission

依 Guild Wars Wiki 主線順序建立。

## Istan

01. Chahbek Village
02. Jokanur Diggings
03. Blacktide Den
04. Consulate Docks


## Kourna

05. Venta Cemetery
06. Kodonur Crossroads

之後會有分支內容：

07A. Pogahn Passage
07B. Rilohn Refuge

主線之後重新匯合。


## Vabbi

08. Moddok Crevice
09. Tihark Orchard
10. Dasha Vestibule
11. Dzagonur Bastion
12. Grand Court of Sebelkeh
13. Jennur's Horde
14. Nundu Bay


## The Desolation

15. Gate of Desolation
16. Ruins of Morah


## Realm of Torment

17. Gate of Pain
18. Gate of Madness
19. Abaddon's Gate

注意：
請以 Guild Wars Wiki 主線頁再次核對官方 Mission 數量與實際排序，
不要只依上面序號硬寫死。

如果官方 Mission 數量與本規格有差異，
以 Wiki 為準，並回報差異原因。


# 四、Nightfall 的 Mission 頁必須增加 Required Hero

Nightfall 很多 Mission 需要特定英雄。

資料 schema 增加：

"requiredHeroes": [
  {
    "id": "dunkoro",
    "name": {
      "zhTW": "唐克羅",
      "en": "Dunkoro"
    },
    "required": true
  }
]

UI 顯示：

[必帶英雄：唐克羅 Dunkoro]

如果沒有帶，
攻略頁上方直接提示：

「此 Mission 無法正常開始 / 完成，請先把指定英雄放入隊伍。」


# 五、Hero Recruitment

第三章本身就是 Hero 系統核心。

攻略頁應能連到英雄頁。

例如：

Koss
Dunkoro
Tahlkora
Melonni
Acolyte Jin
Acolyte Sousuke
Master of Whispers
Margrid the Sly
Norgu
Goren
Zhed Shadowhoof
General Morgahn
Razah

每個英雄資料至少包含：

- 中文名
- 英文名
- 職業
- 取得任務
- 最早可取得時間
- 是否主線必得
- 是否二選一
- 是否可後補
- Wiki URL


# 六、外來角色接入點

非 Nightfall 出生角色：

Prophecies / Factions 角色進 Elona 後，
會從 Kamadan 附近接：

Battle Preparations

然後進入 Nightfall 主線。

網站章節頁應標示：

「外來角色接入點」

並提供：

Battle Preparations
→ Securing Champion's Dawn
→ A Land of Heroes
→ The Time is Nigh
→ Consulate Docks

實際流程請以 Wiki 再次驗證。


# 七、Nightfall Master Reward

第三章和第二章一樣，
很多 Mission 使用：

Standard
Expert
Master

但條件不一定全部是時間。

可能包含：

- 時間限制
- NPC 存活
- Bonus objective
- 特殊操作
- 完成數量

所以 schema 使用：

"missionReward": {
  "standard": {
    "condition": "..."
  },
  "expert": {
    "condition": "..."
  },
  "master": {
    "condition": "..."
  }
}

不要再把全部塞進第一章的 bonus 欄位。


# 八、第三章攻略頁固定格式

每個 Mission 頁都回答：

## 我要去哪？

- Region
- Outpost
- Primary Quest
- Mission Starter


## 我要帶誰？

Required Hero

例如：

「此關必須帶 Dunkoro。」


## 我要做什麼？

用繁體中文簡單說明主目標。


## Master Reward 怎麼拿？

直接用醒目卡片：

Master：
Expert：
Standard：


## 詳細流程

Step 1
Step 2
Step 3

要說清楚：

- 路線
- NPC
- 機關
- Boss
- 容易失敗的位置


## Boss 機制

使用：

「技能 / 機制 → 對策」

不要只列 Boss 技能名字。


## HM

說明：

- 是否只是怪物變強
- 是否有特殊 AI / 敵人配置差異
- 是否建議改隊伍
- 是否值得為 Zaishen Bonus 打 HM


## 打完去哪？

列：

下一個 Primary Quest
下一個 Mission


# 九、各 Mission 攻略重點

## Chahbek Village

重點：

- Koss
- 新手教學
- 船隻 / 防守流程
- Master Reward
- 新手角色容易漏什麼


## Jokanur Diggings

重點：

- 古墓區域
- Ghostly NPC
- Mission mechanic
- Master Reward
- 怪物分布


## Blacktide Den

重點：

- 洞穴
- Corsairs
- 路線
- Boss
- Master Reward


## Consulate Docks

這是 Nightfall 前期重要轉折。

重點：

- Assault
- Kormir
- Varesh
- 大量敵軍
- Mission 結束後主線進 Kourna
- 外來角色也會在這一段正式進入主劇情


## Venta Cemetery

必帶：

Koss

重點：

- Sunspear evacuees
- 12 guard posts
- Master Reward
- Zaishen Mission 時常要求全清

這頁可以特別做：

「12 個 Guard Post checklist」


## Kodonur Crossroads

重點：

- Centaur
- Zhed
- Mission objective
- 多路線
- Master Reward


## Pogahn Passage

重點：

- Margrid
- infiltration
- Corsairs
- Story branch

標示：
此 Mission 與 Rilohn Refuge 為不同主線分支。


## Rilohn Refuge

重點：

- Master of Whispers
- Kournan
- mission objective
- 分支

標示：
之後會重新匯回主線。


## Moddok Crevice

必帶：

Dunkoro

這關一定要做詳細。

重點：

- Dunkoro 的建議
- 4 個 suggestion
- 如何觸發
- 哪些行為會讓 Bonus / Master 失敗
- 路線
- patrol

做一個：

Dunkoro Suggestions Checklist

[ ] Suggestion 1
[ ] Suggestion 2
[ ] Suggestion 3
[ ] Suggestion 4


## Tihark Orchard

這關玩法特殊。

重點：

- 非一般打怪 Mission
- Festival / mini-game 性質
- Activities
- 不同挑戰項目
- Master Reward

這頁不要套一般戰鬥攻略模板，
可以使用 Special Mission Layout。


## Dasha Vestibule

重點：

- Vabbi
- Djinn
- mechanics
- boss
- master reward


## Dzagonur Bastion

這關屬於防守型。

重點：

- 多路攻擊
- 哪些 NPC 要保
- 防守順序
- 分兵風險
- Master Reward

建議做：
Defense Timeline


## Grand Court of Sebelkeh

重點：

- Varesh
- Margonites
- control points
- boss fight
- master reward


## Jennur's Horde

重點：

- Lightbringer mechanics
- Harbingers
- Junundu / special mechanics
- Mission item
- 哪些敵人要先殺


## Nundu Bay

重點：

- 防守
- Harbingers
- NPC
- Lightbringer
- Master Reward


## Gate of Desolation

重點：

- Junundu
- wurm mechanics
- 如何進沙漠
- 玩家技能列變化
- Boss
- Master Reward

一定要用人話解釋：

「進入 Junundu 後，你不是使用自己的正常技能列。」


## Ruins of Morah

重點：

- Varesh
- Boss mechanics
- phase
- resurrection
- party pressure
- Realm of Torment 接續


## Gate of Pain

重點：

- Realm of Torment
- environmental pressure
- patrol
- Margonites
- boss
- master reward


## Gate of Madness

這是 Nightfall 最難主線之一。

攻略必須非常詳細。

重點：

- Shiro Tagachi
- Lich
- shrines
- environmental effects
- 拉怪
- 不要同時觸發多組敵人
- Boss 分開處理方式
- 玩家常見 wipe 點

應提供：

「安全打法」
和
「快速打法」


## Abaddon's Gate

最終關。

重點：

- Abaddon
- arms / mechanics
- interrupt
- knockdown
- boss phases
- celestial mechanics
- Master Reward

寫成：

Phase 1
Phase 2
Phase 3


# 十、Story Branch 資料結構

Nightfall 有多個分支。

例如：

Master of Whispers / Margrid

Norgu / Goren

Jin / Sousuke

網站要清楚標示：

「這不是永久錯過。」

如果玩家當時選另一邊，
之後可以透過額外任務補回英雄。

資料可以：

"choiceGroup": {
  "id": "nightfall-hero-choice-01",
  "options": [
    "master-of-whispers",
    "margrid-the-sly"
  ],
  "recoverableLater": true
}


# 十一、Realm of Torment

第三章後段需要獨立視覺標籤：

[苦痛領域 Realm of Torment]

Gate of Pain
Gate of Madness
Abaddon's Gate

章節 UI 可用區域分隔：

The Desolation
↓
Realm of Torment

玩家要很清楚知道自己已經進入最後區域。


# 十二、第三章破關後內容

不要混入原始主線。

另外分類：

## Postgame

- Gate of Anguish
- Domain of Anguish
- Finding a Purpose
- Razah

Razah 取得方式獨立做 Hero Guide。

標示：

「必須先完成 Nightfall 主線。」


# 十三、Gate of Anguish / Domain of Anguish

這不是普通主線 Mission。

分類：

Elite Area

內容可以後續再做：

- City of Torc'qua
- Foundry of Failed Creations
- Ravenheart Gloom
- Stygian Veil
- Mallyx the Unyielding

不要列進 Nightfall 主線 Mission timeline。


# 十四、搜尋規則

Codex 查資料時：

site:wiki.guildwars.com "Moddok Crevice"

site:wiki.guildwars.com "Moddok Crevice" walkthrough

site:wiki.guildwars.com "Moddok Crevice" master reward

site:wiki.guildwars.com "Moddok Crevice" hard mode

site:wiki.guildwars.com "Gate of Madness"

site:wiki.guildwars.com "Gate of Madness" walkthrough


查 Hero：

site:wiki.guildwars.com "Master of Whispers"

site:wiki.guildwars.com "Razah"


查 Boss：

site:wiki.guildwars.com "Varesh Ossa"

site:wiki.guildwars.com "Abaddon"


# 十五、資料可信度

遊戲事實優先：

1. Guild Wars Wiki
2. PvXwiki
3. Guild Wars Legacy
4. Reddit
5. 其他玩家攻略

Mission 順序、NPC、Hero Requirement、Reward、Master 條件：

必須 Wiki 驗證。

玩家隊伍建議：

可以參考 PvX / 玩家討論。


# 十六、中文處理

網站以繁體中文為主。

格式：

摩多克裂谷（Moddok Crevice）

白影田勝（Shiro Tagachi）

雷撒（Razah）

如果無法確認官方繁中名稱：

不要亂翻。

使用：

English name

並標：

translationStatus: "needs-review"


# 十七、Nightfall 專用 UI

章節頁不要只是 Mission 清單。

應分區：

Istan
Kourna
Vabbi
The Desolation
Realm of Torment


每張 Mission Card 顯示：

- 中文名
- 英文名
- Region
- Required Hero
- Master Reward
- 難度
- Story branch
- 查看攻略


如果 Mission 需要英雄：

顯示 Badge：

[需要 Koss]
[需要 Dunkoro]


# 十八、網站首頁 / Campaign Switcher

主導航：

第一章 預言
第二章 陣營
第三章 夜幕
北方之眼

第三章頁路徑：

/campaigns/nightfall

Mission：

/campaigns/nightfall/missions/moddok-crevice


Hero：

/heroes/dunkoro
/heroes/razah


# 十九、Phase 3 優先完整攻略

第一批優先做：

1. Consulate Docks
2. Venta Cemetery
3. Moddok Crevice
4. Gate of Desolation
5. Ruins of Morah
6. Gate of Pain
7. Gate of Madness
8. Abaddon's Gate

這些是玩家最容易卡住或機制最特殊的 Mission。


第二批：

9. Chahbek Village
10. Jokanur Diggings
11. Blacktide Den
12. Kodonur Crossroads
13. Pogahn Passage
14. Rilohn Refuge
15. Tihark Orchard
16. Dasha Vestibule
17. Dzagonur Bastion
18. Grand Court of Sebelkeh
19. Jennur's Horde
20. Nundu Bay


# 二十、完成前檢查

每關必須確認：

- 中文名
- 英文名
- Region
- Wiki URL
- Required Hero
- Previous Primary Quest
- Next Primary Quest
- Master condition
- Boss
- Rewards
- NM / HM notes
- Story branch
- 外來角色是否可直接進


未知資料：

不要猜。

填：

null

或：

"verificationStatus": "needs-review"


# 二十一、程式要求

完成第二章與第三章後：

npm run lint
npm run build

不得破壞第一章。

檢查：

- Prophecies 仍正常
- Factions branch UI 正常
- Nightfall required hero UI 正常
- 搜尋可以搜尋中英文 Mission
- Campaign switcher 正常
- breadcrumb 正常
- mobile 正常


最後請回報：

1. 第二章新增多少 Mission
2. 第三章新增多少 Mission
3. 哪些資料仍需人工驗證
4. schema 做了哪些擴充
5. 哪些 Mission 使用特殊 layout
6. lint 結果
7. build 結果
