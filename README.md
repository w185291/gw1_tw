# GW1 繁體中文攻略站

可維護的 Guild Wars 1 攻略網站。正式規格在 [docs/REQUIREMENTS.md](docs/REQUIREMENTS.md)，實作計畫在 [docs/IMPLEMENTATION_PLAN.md](docs/IMPLEMENTATION_PLAN.md)。前次靜態 HTML 原型不參與此專案建置。

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

`NEXT_PUBLIC_SITE_URL` 決定 canonical 和 Open Graph URL，參照 `.env.example`。未設定時使用本專案的 Site 網址。更換主機時先設定此值再 build。

## 頁面

- `/`：四章入口、常用入口、三份完整示範。
- `/campaigns`：章節索引。
- `/campaigns/prophecies`：25 關 timeline 與篩選。
- `/campaigns/prophecies/missions`：任務列表。
- `/campaigns/prophecies/missions/[id]`：共用 MissionDetailTemplate。
- `/search`：中英文、aliases、tags 搜尋。
- Factions／Nightfall／Eye of the North：章節架構入口，資料待整理。
- Heroes／Dungeons／Elite Missions／Zaishen／Builds／Skills／Beyond：規格要求的後續入口，明確標示未整理。

完整示範是北方長城、柯瑞塔關所、神聖海岸。其餘 22 關是資料骨架，不宣稱攻略完整。25 關的來源與 34 張 Wiki 原圖均儲存；預言之石只有俯瞰截圖，沒有原站標線路線圖。

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

如未來增加資料總數，調整 validate-content.ts 中目前第一階段對 25 關與三 demo 的驗收條件。

## 新增章節與其他任務型別

在 `src/data/campaigns/` 新增 campaign JSON；保留 id、雙語名稱、regions、structure 與 flow。請從實際遊戲機制填入 entryMethod，Nightfall 可用 NPC、requiredHeroes、rewardTiers；EotN 使用 branched 與 story-quest／dungeon。

GuideEntry 支援七種 type；不要把所有章節強制塞進直線 25 Mission。未來加入 story／quest／dungeon 資料來源時，擴充 repository 與相應詳細頁 template，共用 Header、Switcher、Breadcrumbs、搜尋與來源 metadata。

## Schema 與資料庫升級

詳見 [docs/DATA_SCHEMA.md](docs/DATA_SCHEMA.md)。目前內容讀取集中在 `src/lib/content.ts`。將來改接 SQLite、PostgreSQL 或 CMS 時，替換 repository 實作並保持 schema 的輸出形狀，不在各元件中直接查資料庫。

## 圖片與來源

`docs/reference/` 保留 Wiki 抓取版本與 maps-manifest。各頁顯示固定原文版本與修訂紀錄，各圖顯示來源及上傳者。Wiki 社群攻略文字的翻譯衍生遵循 GNU FDL 1.2 或更新版本；遊戲影象權利另屬 ArenaNet／NCsoft，不把影象標為 GNU FDL。

本網站是非官方玩家攻略。查核日期 2026-10-09；來源更新時需重新查核與建置。未核對的難度、建議等級、數值時間及譯名在 UI／todos 如實標示。
