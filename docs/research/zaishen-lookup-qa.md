# 承戰速查驗證（2026-10-12）

- 69 主線、66 懸賞、136 清圖、7 競技；共 278 個不重複任務。
- Wiki 每個任務的條件與獎勵皆以 API 取得，來源與修訂記於 zaishen-lookup-audit.json。
- localhost 8080 實際瀏覽器：英文 Doppelganger 命中占卜之石，中文壕溝命中 Stygian Lords；章節及類型篩選、零筆結果、今日卡片跳轉正常。
- 今日 Finding the Bloodstone 卡片進入極地之眼速查，正確顯示 Sparkfly Swamp / Inscription Stone / Finding Gadd 與 30 + 75 = 105 銅幣。
- Stygian Lords：第三章，四名 Lord；基本 40 + HM 100 = 140 銅幣，10,000 經驗，1,500 金，500 光明使者點數；與兩名 Underlord 區分。
- 修正銅幣不同連結寫法（Mohby Windbeak）與同名合作任務／探索區（Gyala Hatchery、Unwaking Waters、Tahnnakai Temple）。
- 中文括號中的英文不重複翻譯；不對未知完整 NPC 名稱做局部詞彙替換。
- npm 對應的 lint、typecheck、validate-content、validate-zaishen-lookup、static build 均通過；仍維持 64 個建置頁，任務詳情按四類 JSON 載入。
- 本功能是定位、條件與獎勵速查；完整主線攻略沿用現有網站，Stygian Lords 額外提供六段區域流程。無可靠繁中專名時保留英文，不宣稱是已驗證正式譯名。
