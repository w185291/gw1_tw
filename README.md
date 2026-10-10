# GW1 繁體中文攻略站

可維護的 Guild Wars 1 攻略網站。正式規格在 [docs/REQUIREMENTS.md](docs/REQUIREMENTS.md)，實作計畫在 [docs/IMPLEMENTATION_PLAN.md](docs/IMPLEMENTATION_PLAN.md)。前次靜態 HTML 原型不參與此專案建置。

目前功能、驗證與資料限制見 [最新工作紀錄](docs/LATEST_WORK_20261010.md)。技能有 1,321 筆、十職業介紹與 31 位英雄；完整性 audit 不阻擋 build。

最新第二、三章規格見 `docs/REQUIREMENTS_PHASE2.md`、`docs/REQUIREMENTS_PHASE3.md`；查核範圍與限制見 `docs/PHASE23_CONTENT_AUDIT.md`。

## 技術

Node.js 22 以上、Next.js App Router、React、TypeScript strict、CSS Modules、Zod schema。資料與 UI 分離，不使用資料庫。依 package-lock.json 固定實際驗證過的版本；使用與 Next ESLint 相容的 TypeScript 6 API。

## 安裝與啟動

```sh
npm install
npm run dev
```

預設本機 `http://127.0.0.1:3000`。

```sh
npm run lint
npm run typecheck
npm run validate:content
npm run build
npm run start
```

`build` 為正式 Next.js 建置，`start` 啟動正式伺服器。`npm run build:static` 使用同一 App Router 原始碼輸出到 `out/`，可部署到靜態主機；不是另外手寫一套 HTML。`.openai/hosting.json` 指向此輸出，沿用已註冊的私有 Site。

在 Windows 可雙擊專案根目錄的 `預覽靜態網站.cmd`，用 Chrome 開啟 `http://127.0.0.1:8766/`，查看 `out/` 的部署成品。請勿直接雙擊 `out/index.html`：`file://` 會把 `/_next/`、`/images/` 等絕對路徑指向磁碟根目錄，瀏覽器也會限制以 `fetch` 讀取本機 JSON。預覽程式需要保持執行；關閉「GW1 靜態網站預覽」視窗即可停止。

靜態匯出後可執行 `npm run audit:links`，檢查所有 HTML 中的站內連結是否有目標頁；導覽與資料頁的瀏覽器操作檢查在 `scripts/verify-navigation-and-guides.mjs`。

技能資料使用共用詳細頁 `/skills/view/?id=技能-slug`。`dev`、`build` 與 `build:static` 會由 1,321 筆來源資料產生 `public/data/skills/index.json` 及 11 份按職業分組的 JSON；瀏覽器開啟技能時先讀目錄，再讀取該職業資料。生成的 JSON 不納入 Git，部署時必須使用上述建置命令，並將整個 `out/` 一起上傳。

任務、英雄、其他攻略和技能屬性也已改用共用詳細頁：資料分別在 `public/data/guide-content/missions/`（按章節）、`heroes.json`、`extras.json`、`attributes/`（按屬性）。中英名稱對照在 `glossary.json`。目前靜態匯出為 58 份 HTML，內容頁按需取得 JSON。章節首頁、任務列表、職業入口及玩法介紹仍是獨立頁。原 `/campaigns/<章節>/missions/<任務>/`、`/heroes/<英雄>/`、`/guides/<攻略>/`、`/skills/attributes/<屬性>/` 舊網址在 Cloudflare Pages 由 `public/_redirects` 以 301 轉到共用頁；其他靜態主機需另設同等規則。

`NEXT_PUBLIC_SITE_URL` 決定 canonical、Open Graph、`robots.txt` 的 Sitemap URL 與 `sitemap.xml` 中的網址，參照 `.env.example`。未設定時使用本專案的 Site 網址。部署至 Cloudflare Pages 或其他新網域時，**先設定正式網域並重新 build**；不可把本機或舊網域的 sitemap 直接上線。`npm run build:static` 會把這兩個 SEO 檔輸出到 `out/`。動態查詢參數詳細頁目前未列入 sitemap，避免在沒有伺服器端專屬 metadata 時產生大量重複索引。

## 頁面

- `/`：四章入口與常用入口。
- `/campaigns`：章節索引。
- `/campaigns/prophecies`：25 關 timeline 與篩選。
- `/campaigns/prophecies/missions`：任務列表。
- `/missions/view/?campaign=<章節>&id=<任務>`：共用 MissionDetailTemplate 資料檢視。
- `/search`：中英文、aliases、tags 搜尋。
- `/campaigns/factions`：13份攻略、12故事階段與Kurzick／Luxon分支。
- `/campaigns/nightfall`：20份攻略、17故事階段、三組替代路線。
- `/heroes/view/?id=<英雄>`：31位各章英雄招募；`/guides/view/?id=<攻略>`：12個主線外內容索引。
- Eye of the North：9 份主線／故事／總覽攻略，10 位英雄招募；完整主線仍在整理。
- `/skills/`：1,321 技能、十職業與共通技能；繁中效果、圖示、取得清單與 PvP 分版。
- `/professions/`：十職業介紹、主／副職業限制及各職業機制。
- `/beyond/`、`/dungeons/`、`/elite-missions/`、`/challenge-missions/`、`/zaishen/`、`/builds/`：統一版型的玩法與入口介紹；個別完整攻略仍需逐項核對。
- `/pve/`、`/postgame/`、`/pvp/`、`/equipment/`：首頁提到的玩法與長期目標說明。
- `/hall-of-monuments/`：史蹟殿堂圖文、五座紀念碑與官方獎勵計算器。
- `/glossary/`：按需載入的遊戲繁中／英文名稱查詢。
- 導覽列「互動地圖」連至 gwrevival 的外部地圖。

目前公開攻略皆有主線步驟，資料驗證仍保留內部查核狀態。發布流程只驗證結構，不以完整性 audit 阻擋建置；不要將頁面存在或標章隱藏當成全文已完成查核。

## 目錄

```text
docs/
  REQUIREMENTS.md
  IMPLEMENTATION_PLAN.md
  DATA_SCHEMA.md
  conversation-reference.md
  reference/                      # 抓取版本與地圖來源清單
src/
  app/                            # App Router 與 RootLayout
  components/                     # 共用導航、篩選、地圖與 UI
  templates/MissionDetailTemplate.tsx
  data/campaigns/                 # 章節 JSON
  data/prophecies/missions/        # 25 份 Mission JSON
  data/factions/missions/          # 13 份
  data/nightfall/missions/         # 20 份
  data/heroes/                     # 31 位英雄
  data/extras/                     # 主線外入口索引
  data/schemas/content.ts          # schema + types
  lib/content.ts                  # repository 邊界
public/maps/                      # Wiki 原圖
scripts/validate-content.ts
package.json
```

## 新增 Mission

1. 在相應章節的 `src/data/<campaign>/missions/` 新增 `<order>-<slug>.json`，參照任一示範。
2. 填入雙語名稱、別名、標籤、開始方式、目標、Bonus、步驟、警示、NM/HM、隊伍、獎勵與來源。
3. 尚未核對的數值填 null，記入 todos；未完成保持 `status: "draft"`。
4. 將原圖放 `public/maps/`，填 maps 中的 src、尺寸、filePage、originalImage 與署名。
5. 更新前後關卡與 campaign.flow 中已查核的關係。order 用於列表，不等於遊戲解鎖條件。
6. 執行內容驗證、lint、typecheck、build。route、metadata、選單與搜尋由 repository 和共用 template 自動產生，不新增專屬 JSX。

如增加玩家技能，先同步 Wiki inventory；新增英雄時同步 roster 與結構驗證的總數。

## 新增章節與其他任務型別

在 `src/data/campaigns/` 新增 campaign JSON；保留 id、雙語名稱、regions、structure 與 flow。請從實際遊戲機制填入 entryMethod，Nightfall 可用 NPC、requiredHeroes、rewardTiers；EotN 使用 branched 與 story-quest／dungeon。

GuideEntry 支援七種 type；不要把所有章節強制塞進直線 25 Mission。未來加入 story／quest／dungeon 資料來源時，擴充 repository 與相應詳細頁 template，共用 Header、Switcher、Breadcrumbs、搜尋與來源 metadata。

## Schema 與資料庫升級

詳見 [docs/DATA_SCHEMA.md](docs/DATA_SCHEMA.md)。目前內容讀取集中在 `src/lib/content.ts`。將來改接 SQLite、PostgreSQL 或 CMS 時，替換 repository 實作並保持 schema 的輸出形狀，不在各元件中直接查資料庫。

## 圖片與來源

`docs/reference/` 保留 Wiki 抓取版本與 maps-manifest。各頁顯示固定原文版本與修訂紀錄，各圖顯示來源及上傳者。Wiki 社群攻略文字的翻譯衍生遵循 GNU FDL 1.2 或更新版本；遊戲影象權利另屬 ArenaNet／NCsoft，不把影象標為 GNU FDL。

本網站是非官方玩家攻略。查核日期 2026-10-09；來源更新時需重新查核與建置。未核對的難度、建議等級、數值時間及譯名在 UI／todos 如實標示。

## 更新Wiki來源

`npm run research:fetch`使用公開MediaWiki API、最多兩個並行請求，保留新版修訂到独立資料夾，不自動改寫中文攻略。原始已查核修訂與43張新增圖片來源保留在docs/reference/phase23。
