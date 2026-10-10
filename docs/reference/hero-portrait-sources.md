# 英雄角色圖像來源

更新日期：2026-10-10。

31 位英雄各有列表圖像與詳細頁角色圖，共 62 檔。個別原始檔案頁、本地路徑、權利標示及截圖貢獻者記錄於 `src/data/media/portraits.json`。

圖片經 Guild Wars Wiki API 核對檔案存在、圖片 MIME、檔案大小及 ArenaNet image / screenshot 標記後下載。重新取得方式：`node scripts/fetch-hero-portraits.mjs`；僅檢查來源使用 `--dry-run`。

角色圖像屬 ArenaNet / NCSOFT 遊戲內容，依 [ArenaNet Content Terms of Use](https://www.arena.net/en/legal/content-terms-of-use) 供本非商業玩家網站使用，未宣稱受 Wiki 的 GFDL 授權。頁尾提供權利聲明、官方規範連結及非官方網站標示；詳細頁顯示截圖貢獻者和原檔來源。

Ghost of Althea 使用其角色圖作為列表圖像，因來源沒有獨立頭像。其餘英雄使用 headshot 或遊戲角色 icon。圖片以本地靜態資源載入，不增加英雄 HTML 頁面。

驗證：lint、結構驗證、TypeScript、正式靜態建置通過；31 個英雄 ID 均有列表與詳細頁圖像，62 個資源檔均存在於建置產物。
