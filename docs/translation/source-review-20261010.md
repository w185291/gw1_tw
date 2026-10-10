# 2026-10-10 繁中來源查核

本文件記錄本輪查到的對應及拒絕套用的原因。網站正式譯名只採來源能明確連接「同一個英文專名」與「繁體中文名稱」的資料；英文攻略只能核實身分與玩法，不能自行證明繁中名稱。

| 英文 | 候選繁中 | 來源 | 結論 |
|---|---|---|---|
| Winds of Change | 改革之風 | [巴哈姆特《改革之風第三部曲》](https://forum.gamer.com.tw/C.php?bsn=7678&snA=20148)，文中連到英文原名的官方文章 | 已套用於 `src/data/extras/winds-of-change.json`，完整變更見 `change-log.jsonl`。 |
| Mount Qinkai | 今凱山 | [激戰 Wiki 英中任務表（二部曲）搜尋索引](https://guildwars.fandom.com/zh-tw/wiki/%E8%8B%B1%E4%B8%AD%E4%BB%BB%E5%8B%99%E8%A1%A8%28%E4%BA%8C%E9%83%A8%E6%9B%B2%29)直接列出配對；本機遊戲字串 ID 22256 再次確認 | 已由遊戲地圖索引驗證；網站目前沒有待替換的同名結構化地點欄位。 |
| Keiran Thackeray | 未定 | [巴哈姆特 Heart of the North 討論](https://forum.gamer.com.tw/C.php?bsn=7678&snA=19660)只寫英文人名與「KT」 | 不據此音譯。 |
| Domain of Anguish | 未定 | [巴哈姆特史蹟殿堂討論](https://forum.gamer.com.tw/C.php?bsn=7678&snA=19609)仍寫英文名稱 | 不猜譯。 |
| 2020 年新增的 11 個菁英技能 | 未定 | [巴哈姆特技能討論](https://forum.gamer.com.tw/C.php?bsn=7678&snA=20557)多沿用英文；目前抽出的繁中字串也仍顯示英文 | 保留遊戲顯示的英文，等待官方字串或可核對的繁中來源。 |

`untranslated.csv` 是網站結構化名稱的逐處盤點，共 1,449 個 JSON 檔；套用本輪來源核實的「改革之風」與 76 個遊戲地名後，尚有 **7,580 個出現位置、1,721 個去重名稱**沒有中文字。多數是技能取得列表反覆引用的 NPC；同名不保證同身分。純攻略段落仍須另做逐句檢查。`docs/reference/translation-unresolved.json` 是較早的名稱去重盤點，數字與本表統計口徑不同。
