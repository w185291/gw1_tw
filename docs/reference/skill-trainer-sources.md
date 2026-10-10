# 技能導師資料來源與界線

更新日期：2026-10-10。本站從 Guild Wars Wiki 的 [技能導師總覽](https://wiki.guildwars.com/wiki/Skill_trainer) 開始，依序讀取四章導師名錄、其分類成員與每位 NPC 的獨立頁。另依 [英雄技能導師總覽](https://wiki.guildwars.com/wiki/Hero_skill_trainer) 納入《黑暗逆襲》和《極地之眼》的英雄技能導師，以及共通公會廳導師。第一章特殊 NPC Magi Malaquire 列在技能導師分類、卻不在普通導師名錄，本站也納入。總計 72 個 NPC 頁：阿斯卡隆戰記 20、盟與敵 25、黑暗逆襲 12、極地之眼 3、英雄技能導師 11、公會廳 1。

每筆資料有 Wiki 頁面、修訂 ID、章節、實際 NPC location、區域、Wiki 圖片及技能清單。NPC 頁若寫明「與某導師相同」或「包含前面導師的技能」，擷取程式會合併對應清單。Dakk 與 Zenaida 的 Wiki 寫明提供該章及共通的全部非菁英技能，依本站技能資料庫按章節產生清單。Vernados、公會廳導師與 Magi Malaquire 不能列成固定新技能清單，頁面會直接解釋特殊條件。Wiki 有一筆 Hoju 的 `"Help Me!"` 未收錄在本站技能資料庫，保留連到 Wiki。

圖片從各 NPC 頁的 infobox 或其頁面實際載入的同名檔案取得；公會廳導師 Wiki 未提供個人肖像，改放 Wiki 的捕捉紋章圖示並在頁面註明。圖片權利與原檔網址記於每筆 JSON；頁面保留來源連結。可重建：`node scripts/fetch-skill-trainers.mjs`，檢查：`node scripts/validate-skill-trainers.mjs`。

已核實的繁中地名優先使用本站遊戲字串；星岬寺、凱寧中心及甘拿的佔領地另依繁中社群 Wiki 的地名表核對。其餘沒有可信對照的 NPC／地名保留英文，避免自造名稱。不同時間版本、探索區域和副本據點原樣保留在位置欄，因此同一導師可能列出多個地點。

參考頁：

- [阿斯卡隆戰記導師](https://wiki.guildwars.com/wiki/List_of_Prophecies_skill_trainers)
- [盟與敵導師](https://wiki.guildwars.com/wiki/List_of_Factions_skill_trainers)
- [黑暗逆襲導師](https://wiki.guildwars.com/wiki/List_of_Nightfall_skill_trainers)
- [北方之眼導師](https://wiki.guildwars.com/wiki/List_of_Eye_of_the_North_skill_trainers)
- [黑暗逆襲英雄技能導師](https://wiki.guildwars.com/wiki/List_of_Nightfall_hero_skill_trainers)
- [北方之眼英雄技能導師](https://wiki.guildwars.com/wiki/List_of_Eye_of_the_North_hero_skill_trainers)
- [繁中社群地名表](https://guildwars.fandom.com/zh-tw/wiki/英中地名表(二部曲))
