# 2026-10-10 最新網站修訂

## 後續更新：導覽、專題與靜態匯出

- 主選單重組為遊戲介紹、主線攻略、職業資料、其他攻略、玩法與目標；點頁面外或按 Esc 會收合。加入 GW Revival 互動地圖。
- 補齊十個統一版型的玩法入口：Beyond、地下城、菁英區域、挑戰與競技任務、戰承任務、Build、PvE、破關後、PvP、裝備收藏。每項先交代用途、位置與開始方式；不能將這些入口總覽當成個別完整攻略。
- 史蹟殿堂專頁附 Wiki 來源圖片、五座紀念碑介紹與 ArenaNet 官方獎勵計算器；遊戲中英名稱對照頁按需讀取 JSON。
- Next.js metadata routes 生成 robots.txt、sitemap.xml；正式網域由 `NEXT_PUBLIC_SITE_URL` 決定。詳細頁目前由共用 query route 配 JSON 載入，未逐筆列入 sitemap，避免重複的通用 metadata。
- Cloudflare Pages 的 `public/_redirects` 保留舊任務、英雄、其他攻略與技能屬性詳情連結；已確認檔案進入 `out/`。其他靜態主機需自行設定同等規則。
- 最新 `build:static` 匯出 58 份 HTML、50 筆 sitemap URL；全站靜態連結 0 個缺失。lint、typecheck、結構驗證、桌面與手機導覽測試均通過。
- 選用的 `validate:guides` 嚴格內容稽核仍為 0 / 67 complete，主要缺頭目逐項核對、英文專名證據與未驗證用語；它不阻擋建置，也不能因有頁面便對外宣稱全部攻略完成。
- 下方「1,524 頁」與舊預覽服務資訊是先前階段的紀錄；當前輸出與驗證結果以上述更新為準。

本文件與最新使用者要求優先於早期 demo / 13 heroes / 113 skills 的工作紀錄。

## 已交付

- 四章列表與 `/campaigns/prophecies/` 不顯示查核未完成標章；移除 NM 難度篩選與卡片難度分數，保留 NM/HM 遊戲模式。
- 桌面及手機主線／其他攻略選單以原生 details name 群組互斥收合。
- 整個「主線 Quest・下一個據點怎麼開」預設關閉，保留頁內錨點與內層任務鏈。
- 英雄 31 位：第一章 3、第二章 3、第三章 13、北方之眼 10、共通 M.O.X. 1、Beyond 1。第一章 Devona / Ghost of Althea 是 2026 年 Reforged Mode 新增英雄，不能沿用舊「第一章沒有英雄」的說法。
- 新增所有英雄的招募頁、章節篩選與搜尋。Olias / Zenmai 分別需要第一／第二章加第三章；M.O.X. 要三個本篇章節、10 級與背包空格；北方之眼競賽英雄在隨機第二／第四回合擊敗對手即可取得。
- 依 Wiki 五份章節技能清單整理 1,321 筆：十職業 1,266 + 共通 55。含 186 組 PvP 分版與獨立 Codex Charm Animal 特例。
- 全部技能有本地小圖示、非空繁中效果、英文對照、Wiki 成本／施法／冷卻與取得來源。補維持消耗與士氣提升重充語義，避免把沒有秒數的復活紋章寫成正常零秒冷卻。
- `/professions/` 十職業介紹與十個獨立介紹頁；`/skills/professions/[profession]/` 繼續作各職業技能目錄。
- 技能總列表有職業篩選及各職業入口，手機卡片、桌面列表、詳情页均有圖示。
- 型別化精簡 client catalog props，不傳整份 NPC 研究文字給列表。production skill repository 每個 worker 共用只讀快照，dev 仍讀更新資料。
- 對照表 `docs/reference/translation-correspondence.csv` / JSON，2,137 個 UI/search 同源詞條，保留字串 ID 或其他來源。

## 實際限制（內部紀錄，不能以移除標章當成完成）

- 1,310 筆技能名稱有中文證據；11 筆近年新增技能名稱在可用資料中仍為英文。其效果已有繁中整理，不自行杜撰正式技能名稱。
- 1,648 個跨攻略／技能來源的英文實體參照尚未取得無歧義中文對照（含 1,375 NPC、244 Quest、其他屬性／技能／任務參照）。此數字包含技能取得清單引用，不等於 1,648 篇任務缺攻略。
- `translation-unresolved.json` 是內部待查來源清單。依最新要求，不在公開頁面顯示待查標章。
- 遊戲配對仍為先前唯讀擷取的 27,479 組；本次沿用檔案，未聲稱新解出所有 runtime NPC EncString。原遊戲及 BD 未修改。
- 技能完整性驗收仍記錄 acquisition review、earliest/convenient、build 配套等未完成欄位。不要將全部 imported 設成 complete。`validate:guides` / `validate:skills` 仍為選用 audit，不阻擋 build。
- EotN 全章攻略尚非全部撰寫；目前是 9 份已公開任務／總覽，不能把英雄招募補足誤報為 EotN 主線全部完成。

## 驗證

- lint / typecheck / validate:content：通過。
- `build-20261010-all-professions-final.log`：正式 build exit 0，1,524 / 1,524 頁面生成。
- `verify-expanded-catalog.mjs`：全部 1,321 技能檔／圖示結構、71 路由、十職業與六類英雄篩選、選單互斥、Quest 預設收合、375px 手機通過；無頁面 JS / hydration / 重複 key 錯誤。
- `verify-site-audit.mjs`：67 攻略路由、78 篩選案例、83 圖檔、4 搜尋案例與手機地圖 dialog 通過。
- 最新 dev 已於本次重啟在 `http://127.0.0.1:8765`；重啟是為更新 dynamicParams=false 的靜態參數快取，避免新職業路由 404。
- 舊 8766 / 8773 服務仍顯示舊 NM 難度選項，不作最新成果預覽。沒有擅自停止那些服務。

## 後續維護

一般回歸使用 `verify-expanded-catalog.mjs` 及 `verify-site-audit.mjs`。匯入器是研究基線；重跑 `import-ritualist-skills.py` 會覆蓋後續細節，不要盲目重跑。`refine-all-profession-skills.py` 處理的是已整理文字，不代表 acquisition 經逐項 editorial 驗證。更新字典後執行 `export-translation-correspondence.py` 同步 CSV/JSON。
