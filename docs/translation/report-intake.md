# 玩家翻譯回報

公開入口是 `/translation-report/`，全站 footer 有連結。表單提交到 Cloudflare Pages Function `/api/translation-reports`；每一筆以 `report:<ISO 時間>:<UUID>` 為 key，JSON 存在私有 Workers KV。網站不提供讀取或列出回報的公開 API，也不會自動把回報套用到攻略。

## 部署設定

1. 在 Cloudflare 帳號建立 Workers KV namespace，例如 `gw1-translation-reports`。
2. 在 Pages 專案的 **Settings → Bindings**，將 production 和 preview 都需要的環境綁定為 `REPORTS_KV`。若只在 production 收件，preview 可不綁定；未綁定時 API 回傳 503，不會假裝成功。
3. 重新部署 Pages。`public/_routes.json` 只讓 `/api/translation-reports` 觸發 Function，其餘靜態頁不走 Function。
4. 從網站送一筆真實範例，確認表單回報編號及 KV 新增 `report:` key。測試回報請在說明註記「站方功能驗證」，保留供核對。

API 只接受同源 JSON POST，限制欄位長度、本站網址、每個來源 IP 約一分鐘一筆，並有隱藏欄位攔截簡單機器提交。這些是基本限制；若受到大量濫用，應在 Cloudflare WAF 或 Turnstile 再加一層防護。IP 本身不寫入回報 JSON，短期節流 key 只存雜湊且 60 秒到期。

## 匯出與審核

使用具有 **Workers KV Storage Read** 權限的 Cloudflare API Token，在本機設定 `CLOUDFLARE_API_TOKEN`、`CLOUDFLARE_ACCOUNT_ID`、`CLOUDFLARE_REPORTS_KV_NAMESPACE_ID`，然後執行 `node scripts/export-translation-reports.mjs`。結果會寫到 Git 忽略的 `private-reports/translation-reports-YYYY-MM-DD.json`。不要提交 API Token 或未審查的玩家內容。

審核時核對遊戲客戶端、Guild Wars Wiki 或可靠繁中來源，再依 `docs/translation/README.md` 的覆寫與變更紀錄流程套用。回報者提供的文字、網址與說明一律視為未受信任資料。

目前 production 使用 gw1-translation-reports，namespace ID：18f3f0b25fa34daeb0763b95475b2621；帳號 ID：1db5e2f39443c64ecdaca48191087cd2。這些是資源識別碼，不是存取憑證。
