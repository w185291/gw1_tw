# 第一階段驗證紀錄

日期：2026-10-09。

- `npm install`：完成，package-lock.json 已保存。
- `npm run lint`：通過，無 ESLint error。
- `npm run typecheck`：通過，TypeScript strict。
- `npm run validate:content`：通過；4 章、25 關、指定 3 份完整 demo，關聯與地圖檔案均驗證。
- `npm run build`：通過；Next.js App Router 正式建置與型別檢查成功。
- `npm run start`：成功；首頁、章節索引、Mission List、三份 demo 與搜尋頁 HTTP 200。
- `npm run build:static`：通過；同一 Next.js 原始碼匯出至 out，供私有 Site 發佈。

## 瀏覽器檢查

Chrome headless，桌面 1440×1000 與手機 390×844。

- 全部 25 關列表可見。
- 柯瑞塔地區篩選得到 5 關；主線 Quest 篩選得到 0；重設恢復 25 關。
- 英文 Divinity、中文與別名「長城」搜尋正常。
- 三份 demo 都有 Boss 資料、主線與來源；圖片放大正常，Escape 關閉。
- 手機任務 Drawer 開啟後焦點進入對話框，選另一關後正常關閉並切換。
- 手機網站選單與搜尋入口可用。
- 檢查頁面無水平溢位，無 pageerror。
- 桌面與手機畫面已視覺核對；screenshots 位於 docs/reference/screenshots。

## 範圍限制

完整 demo：北方長城、柯瑞塔關所、神聖海岸。其餘 22 關是明確標示的草稿骨架。原文和原圖已抓取，不代表全部攻略已完成翻譯。

數值難度、分鐘預估、建議等級與未核對譯名未虛構。預言之石只有原 Wiki 俯瞰截圖，沒有標線路線圖。原圖已保留來源及版權欄位。

## 靜態輸出與發佈

out 中 46 份 HTML（含框架錯誤頁）已檢查本地連結與資產，沒有遺失檔案。34 張 public/maps 圖檔的 SHA-256 與原始下載相同。

私有 Site 已註冊並保留 project_id，但發佈尚未成功：首次來源儲存服務回傳 HTTP 500，第二次準備流程也失敗。未宣稱網站已上線，未提供未驗證的遠端網址。

本機預覽保留在 http://127.0.0.1:8765/。正式 Node server build 已重新產生，`npm run start` 所需建置檔可用；私有靜態 export 仍保留在 out。
