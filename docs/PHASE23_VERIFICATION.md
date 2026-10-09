# 第二、三章驗收

2026-10-09。

- lint、TypeScript strict、內容驗證、Next正式build、同源static export全部通過。
- 4章架構、58個Mission：第一章25關（3完整、22草稿）、第二章13完整、第三章20完整。13英雄招募資料、12主線外分類入口。
- 第一章25份JSON逐檔SHA-256與擴充前基線相同。
- 33個新Mission頁逐頁在Chrome檢查HTTP200、原圖載入、大師條件與水平溢位。
- 驗證Sunjiang兩支分開、Unwaking兩入口、Moddok匯合、英雄必要標記與招募入口。
- Moddok四項checkbox可勾選、顯示計數；地圖dialog可用Escape關閉。
- 中文英雄、英文英雄、Quest名稱與中文Mission搜尋正常。
- 390×844手機：兩章總覽與特殊任務無水平溢位；任務drawer開啟後焦點在dialog，點下一關關閉並正常導航。
- 第一章25關列表、Kryta篩選5關、三份Bonus示範回歸通過。
- Chrome console/pageerror、同源HTTP失敗：最終測試0筆。紀錄在docs/reference/screenshots-phase23/results.json，桌面與手機截圖已視覺核對。

實測發現Next16.4 Windows靜態export的RSC segment filename未把反斜線轉成點，造成預取404。scripts/normalize-static-segments.mjs根據匯出目錄補正167個平面檔名，build:static會自動執行；保留原檔。修正後以真正靜態伺服器重跑全頁導航，不忽略404。

正式Node伺服器已在http://127.0.0.1:8766啟動。靜態預覽可用node scripts/preview-static.mjs（預設8773）。out是同一Next專案的產物，不是另一套手寫HTML。

內容／譯名未查核範圍、圖片角色、額外索引與完整Mission的區別，見PHASE23_CONTENT_AUDIT.md。
