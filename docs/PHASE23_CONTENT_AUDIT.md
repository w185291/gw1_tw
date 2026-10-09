# 第二、三章資料查核

2026-10-09：透過公開 MediaWiki parse API 擷取完整主頁、相關Quest、英雄、技能、據點與中文名稱回報頁；快照保留title、revision、checkedAt、HTML與links。不是從搜尋摘要直接生成攻略。

33份Mission：Factions 13個不同Mission、12故事階段；Nightfall 20個不同Mission、17故事階段。單一攻略可有不同入口；分支匯合用previousOptions／nextOptions，不能把替代路線當全部必要條件。

主線合作Mission全部含繁體中文通關步驟、警示、隊伍準備、普通／困難大師條件、數值獎勵、原圖與來源。Quest有接取NPC、地點、中文操作指示、原名与修訂連結。外來角色入口另外分組。

英雄13份包含三個互斥群組、早期外來角色招募，以及Norgu／Goren反向選擇。英雄中文名參考中文社群詞典，轉繁體後仍標needs-review，因未證實台版正式譯名；英文保留方便遊戲對照。

圖片43張已下載、解碼並核對來源。30個Mission有Wiki標出的玩家路線。永恆之林為防守戰術圖、薩崗諾稜堡為設施位置圖、摩拉廢墟為場景圖；UI明確說明，未自行製造或冒稱Wiki路線圖。各圖片保留原頁、原URL、上傳者與版權。

完整內容不代表逐字翻譯所有對話、技能條目或Trivia；這些有原文連結。Challenge 5／Competitive 2／Elite 2／Winds of Change、Razah任務、Domain of Anguish分開分類。除Razah招募操作外，這些額外區域是入口索引，獨立完整攻略尚待後續。

仍未查核：主觀難度、推薦等級、預估通關分鐘均null；多數NPC與技能正式台版名稱保留英文；Zaishen／Reforged數值未補。每頁todos可查。

程式欄位：displayOrder、storyStage、branch、routeChoice、entryVariants、masterReward、missionReward、missionStarter、primaryQuestBefore／After、requiredHeroes.required、bossMechanics、checklist、defenseTimeline、strategyVariants、specialActivities、afterCompletion、translationStatus、verificationStatus。Mission沿用同一模板，新增Hero與ExtraGuide schema，JSON schema匯出5份。

重新抓取：`npm run research:fetch`把新版保存到phase23-refresh，絕不直接覆寫已核對中文資料。比對修訂後由維護者更新資料。

文字翻譯為Guild Wars Wiki社群攻略的衍生整理，依GNU FDL 1.2或更新版，保留原文貢獻者history及授權入口。中文社群詞典只用名稱對照，沒有複製整篇攻略。
