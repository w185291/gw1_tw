# 資料層與內容狀態

Schema 實作位於 `src/data/schemas/content.ts`，Zod 負責執行期驗證，TypeScript 從同一 schema 推導型別。

## Campaign

`id` 是英文 slug；`name` 包含 zhTW／en。`regions` 是 id 與雙語名稱表。`structure` 為 timeline 或 branched；`flow` 表示 entry 與實際已確認的 requires、branch。傳統顯示順序由 Mission.order 決定，不將前一關視為一律必須完成的解鎖條件。

沙漠三試煉的 branch 相同，預言之石 requires 指向三關。其他尚未建立的跨探索區主線 Quest 不自行虛構，先保留資料層擴充位置。

## GuideEntry 與 Mission

共通 entry 欄位涵蓋 id、campaign、region、name、type、category、status、aliases、tags、summary、entryMethod、requiredHeroes、rewardTiers、sources。

type 支援 cooperative-mission、primary-quest、dungeon、elite-mission、challenge-mission、story-quest、competitive-mission；category 支援 main-story、side-story、elite、beyond。

目前的 25 份資料是 Mission。MissionDetailTemplate 接收已驗證的 Mission；未來故事、地下城可接收相同 GuideEntry metadata，追加專屬 schema/template。不要用空的 mission頁去假冒完全不同的 Quest 流程。

Mission 另外包含 order、partySize、recommendedLevel、difficulty、estimatedMinutes、objectives、bonus、walkthrough、routeSummary、maps、bosses、recommendedTeam、warnings、tips、modeDifferences、rewards、wiki、previousMission、nextMission、prerequisites、todos。

## 未知與草稿

- `status=complete`：三份正式示範已整理主線與 Bonus 等主要攻略。
- `status=draft`：內容骨架；UI 一律標示待整理，不宣稱完整攻略。
- 未核對的數字用 null，不填 schema 範例值。
- 時間類別 short／medium／long 來自 Wiki 的 Duration，並不是分鐘數。數值時間另待查核。
- difficulty 分數是本站未來的編輯評估，第一階段沒有任意評分。
- Boss／技能缺乏可靠繁中對照時保留英文原名並列在 todos，避免捏造官方名稱。
- `requiredHeroes=[]`、`rewardTiers=[]` 在目前 Prophecies demo 不附加 Nightfall 條件。

## 搜尋

搜尋索引是 repository 的投影：name.zhTW、name.en、aliases、tags。新增其他 entry 型別時，將 repository 返回值投影為 SearchEntry，搜尋元件無需重寫。

## 來源與獎勵

來源儲存 url、revision、checkedAt 與 role；revision URL 可追溯此次查核版本。地圖另外儲存 Wiki filePage、originalImage、uploader 與 copyright；上傳者不等於聲稱為原作者。

獎勵分 normal／bonus／hard／zaishen／reforged；避免傳統模式、Reforged 和 Zaishen Quest 獎勵混算。reward.label 表明適用條件，notes 保留角色來源或額外領取限制。
