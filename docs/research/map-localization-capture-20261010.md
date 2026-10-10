# 世界地圖名稱擷取狀態（2026-10-10）

使用者已在遊戲開第一章地圖，並查看其他戰役。現有 `reforged_sniffer.dll` 已掛入遊戲，擷取目錄為 `Tyria-Extractor/captures/1791629095636`。狀態檔顯示 `hook_installed_text_decoder`、`hook_installed_stoc_handler_table`，但同時顯示 `world_handler_schema_changed` 和 `collector_create_prologue_unexpected`；封包擷取只取得物品輸出，沒有地圖、NPC 或任務輸出。

[GWToolbox++ World Map 說明](https://www.gwtoolbox.com/docs/world_map/)指出「Show all areas」可顯示目前大陸上尚未解鎖的據點。這證明地圖 UI 可列出它們，並不證明伺服器會因開圖而送出每個名稱。右 Shift 顯示英文同樣可能是客戶端改用另一語言的本地字串。

[GWCA `AreaInfo` 結構](https://github.com/gwdevhub/GWToolboxpp/blob/master/Dependencies/GWCA/include/GWCA/GameEntities/Map.h)列出 `campaign`、`continent`、`region`、地圖座標、`name_id`（偏移 `0x74`）及 `description_id`（偏移 `0x78`）。利用目前遊戲程序已載入的 GWCA `GetMapInfo`，只讀取得 **882 筆帶名稱 ID 的地圖記錄**。以同 ID 連接本機 `Gw.dat`／`Gw.snapshot` 的雙語文字後，**879 筆有英文、811 筆有中文字的繁中名稱**。索引在 `docs/reference/map-localization-20261010.{json,csv}`；沒有經過 ID 比對的地名不能當成官方譯名。這條路不要求角色解完所有任務。

先前看到的 `�` 是終端機輸出編碼造成的**顯示問題**；原始 JSON 字元碼正常。例如 `name_id=10380` 是 `Sanctum Cay → 神聖沙灘`，`name_id=22256` 是 `Mount Qinkai → 今凱山`。已根據唯一英文地名及遊戲字串 ID 精準替換網站 **76 個地點名稱欄位**，逐筆保留在 `docs/translation/change-log.jsonl`。`Heroes' Crypt` 在遊戲索引內有兩種不同繁中譯法，故不按英文名稱批量替換。仍有 68 筆地圖名稱沒有可用中文字，不能自動補譯；任務／NPC 也需要另外建立 quest ID、agent/model ID 與字串 ID 的關聯，地圖表本身不能解決它們。

另外測試呼叫 GWCA 的非同步字串解碼時，遊戲程序意外關閉。這項測試已停用，僅保留成功讀出的地圖索引；後續不再對使用者遊戲程序注入這個解碼測試。
