# GW1 攻略網站第一階段實作計畫

正式依據：`docs/REQUIREMENTS.md`。先前對話與靜態原型只作資料來源背景，不覆蓋本規格。

## 範圍與交付

建立 Node.js、Next.js App Router、React、TypeScript strict、CSS Modules 專案。第一階段提供首頁、章節索引、四章入口、Prophecies 25 關列表與共用詳細頁、搜尋與篩選。完整示範：北方長城、柯瑞塔關所、神聖海岸。其餘 22 關明確顯示「待整理」，提供已核對的名稱、地區、隊伍人數、Wiki 與地圖，不假裝已有完整攻略。

## 資料模型

- `Campaign` 是章節容器，以 `flow` 描述順序、分支及前置條件，不僅含 missions[]。
- `GuideEntry` 具 `type`：cooperative-mission、primary-quest、dungeon、elite-mission、challenge-mission、story-quest、competitive-mission。
- `Mission` 延伸 `GuideEntry`，包含中英文名稱、aliases、tags、Bonus、步驟、地圖、Boss、推薦隊伍、NM/HM、獎勵、警示與來源。
- `entryMethod` 支援 Enter Mission、NPC、quest；`requiredHeroes` 可表示 Nightfall 條件；`rewardTiers` 支援 Standard／Expert／Master。
- 難度、時間、建議等級等沒有可靠來源的欄位用 null 與 `todos` 表示，UI 顯示「待查核」。不把 schema 範例數值當事實。
- `sources` 儲存固定 Wiki revision、查核日期、原作者修訂連結與中文對照出處。
- 用 Zod schema 執行期驗證、TypeScript inferred types；建置前檢查 id、slug、關聯、地圖檔案與 demo 必填內容。

## 目錄

```text
gw1-guide/
  docs/{REQUIREMENTS,IMPLEMENTATION_PLAN,conversation-reference}.md
  src/app/                         # routes / RootLayout / metadata
  src/components/                  # navigation, cards, drawer, filters
  src/templates/MissionDetailTemplate.tsx
  src/data/campaigns/               # four campaign JSON files
  src/data/prophecies/missions/     # 25 separate JSON files
  src/data/schemas/                 # Zod schemas + exported types
  src/lib/content.ts               # repository / data access boundary
  public/maps/                     # original Wiki route images
  scripts/validate-content.ts
  package.json / README.md / AGENTS.md
```

## 路由

`/`、`/campaigns`、`/campaigns/[campaign]`、`/campaigns/[campaign]/missions`、`/campaigns/[campaign]/missions/[mission]`、`/search`。

`/heroes`、`/dungeons`、`/elite-missions`、`/zaishen`、`/builds`、`/skills`、`/beyond` 先提供具清楚範圍的未整理入口，不建立虛構細節。未來可由新 entry template 與 repository 擴充。

## 共用 UI 與版型

RootLayout 統一 SiteHeader、MainNavigation、SiteFooter。攻略頁共用 CampaignSwitcher、Breadcrumbs、SidebarNavigation；所有 Mission 頁使用唯一 MissionDetailTemplate。首頁四張章節卡；章節列表採垂直 timeline。桌面側欄顯示 active；手機以任務按鈕開啟具鍵盤焦點管理的 Drawer。

深藍黑背景、暖金與羊皮紙色文字、清晰中文系統字型。資訊順序：去哪／開始方式／目標 → Bonus → 主線步驟 → 易漏警示 → 地圖 → Boss → 隊伍 → NM/HM → 獎勵 → 來源。無需遊戲裝飾圖或外部字型。

搜尋覆蓋 name.zhTW、name.en、aliases、tags。Mission filter 覆蓋地區、型別、Bonus、模式與已評估難度；未知欄位不冒充已評估。沙漠三試煉清楚註記可自由排序與三關皆需完成。

## 素材遷移與查核

重用已抓取的 25 份 Wiki 原文與 34 張圖。三份 demo 再核對原文獎勵、Boss 和技能。地圖保留英文原標記及來源；預言之石只有俯瞰截圖，明示無標線路線圖。Wiki 機制優先於舊中文帖子；不同譯名保留英文。文字與圖片授權分別署名。

## 驗證與部署

1. `npm install`；保留 package-lock.json。
2. `npm run lint`、`npm run typecheck`、`npm run validate:content`。
3. `npm run build`，預設正式 Next server build；`npm run start` 啟動。
4. 對首頁、列表與三 demo 做本機路由、搜尋／篩選、手機 Drawer、圖片放大、鍵盤與溢位檢查。
5. 以 `npm run build:static` 產出同一 App Router 的靜態 export 供已註冊的私有 Sites 釋出；這是 framework build output，不是人工拆寫 HTML。
6. 完成後回報頁面、資料結構、新增內容方式、驗證結果與下一階段。先不批次把剩餘 22 關標成完整。

## 下一階段

依三份 demo 的資料模型，逐關填完剩餘 22 關並查核；再加入 Factions 分支、Nightfall requiredHeroes／rewardTiers 與 EotN story/dungeon flow。SQLite／PostgreSQL／CMS 可替換 `src/lib/content.ts`，不改 template。
