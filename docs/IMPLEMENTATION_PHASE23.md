# 第二章、第三章擴充計畫

依 REQUIREMENTS_PHASE2.md / REQUIREMENTS_PHASE3.md，沿用現有 Next.js、資料層與 MissionDetailTemplate。

1. 優先抓取兩章主清單，再依附件指定第一批、第二批順序閱讀完整 Mission 原文，保留 revision 與查核日期。
2. Factions 13 個不同 Mission。傳統主線有 12 階段，Eternal Grove / Gyala Hatchery 是替代的第 9 階段；Unwaking Waters 的兩據點不是兩份攻略。Vizunah Square 也採共同攻略＋不同入口。
3. Nightfall 20 個 Mission、17 故事階段，三組替代 Mission；Consulate Docks 與 Moddok Crevice 的實際任務地區是 Kourna，區域以 Wiki infobox 為準。
4. Schema 新增 displayOrder、storyStage、branch、routeChoice、entryVariants、masterReward／missionReward、primaryQuestBefore／After、missionStarter、bossMechanics、checklist、defenseTimeline、strategyVariants、afterCompletion、translationStatus／verificationStatus。
5. Required Hero 有 required 標記及英雄連結；建立 13 份英雄招募資料，標示選擇群組與破關後补招。Razah 與 Domain of Anguish 單獨放破關後內容。
6. 同一模板依資料切換 Bonus／Standard-Expert-Master。不把後兩章塞進 Prophecies Bonus。Tihark Orchard 使用同一模板的特殊活動區塊。
7. Factions 章節提供 Kurzick／Luxon 分支卡與匯合。Nightfall 依實際區域分組並呈現三組分支、外來角色接入、必要英雄與下一站 Quest。
8. Challenge、Competitive、Elite、Beyond 分類獨立於主線列表。資料庫仍非必要。
9. 實際下載的 43 圖中，Eternal Grove 是防守路線圖、Dzagonur 是設施位置圖、Ruins of Morah 是場景圖；如實標明，不自行畫成 Wiki 行走圖。
10. 完成 lint / typecheck / data validation / build，並實測分支導航、英雄入口、Master 標籤、搜尋、手機與 Prophecies 回歸。第一章 25 份 JSON 用基線 SHA-256 確認未改動。

未知譯名保留英文與 needs-review；未知數值保持 null。附件的攻略方向是查核清單，不視為已證實事實（例如 Shiro Meditation、Jennur Junundu、Abaddon celestial 等都重新依 Wiki 閱讀）。
