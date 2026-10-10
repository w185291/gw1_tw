export type SectionEntry={title:string;en?:string;what:string;where:string;start:string;href?:string;linkLabel?:string;wiki:string};
export type GuideSection={id:string;title:string;description:string;intro:string;start:string;entries:SectionEntry[];sources:{label:string;url:string}[]};

export const sections:GuideSection[]=[
 {id:'beyond',title:'Beyond 後續故事',description:'三大戰役之後延伸的劇情系列。',intro:'Guild Wars Beyond 串起科瑞塔戰爭、關與基蘭的故事，以及凱珊的變局。它們是破關後故事，不是三大戰役的合作任務清單。',start:'想照劇情順序走：先看科瑞塔之戰，再看北方之心；盟與敵破關後可另外開始變革之風。各線有自己的角色與前置條件。',entries:[
  {title:'War in Kryta',what:'光刃與白斗篷爭奪科瑞塔的後續劇情；包含對話、通緝任務和獅子拱門決戰。',where:'泰瑞亞的科瑞塔地區；劇情會帶你到榮譽之殿與光刃營地。',start:'先確認帳號有阿斯卡隆戰記及極地之眼，再依 Wiki 的前置任務流程觸發；完成極地之眼主線是較直觀的準備方式。',wiki:'https://wiki.guildwars.com/wiki/War_in_Kryta/Walkthrough'},
  {title:'Hearts of the North',what:'追尋失蹤的基蘭，透過線索與短任務補完他和關的故事。',where:'從極地之眼的榮譽之殿與關的對話開始。',start:'先完成 War in Kryta 最後的「獅子拱門之戰」，領完獎勵後回榮譽之殿向關報告。',wiki:'https://wiki.guildwars.com/wiki/Hearts_of_the_North'},
  {title:'Winds of Change',what:'盟與敵結局後，凱珊純潔之部崛起的長篇故事。',where:'凱寧中心下層。',start:'完成盟與敵主線後，找純潔之部的 Initiate Zei Ri 開始；接第一個任務前先準備好隊伍，後續部分地區敵人配置會改變。',href:'/guides/view/?id=winds-of-change',linkLabel:'查看本站入口',wiki:'https://wiki.guildwars.com/wiki/Winds_of_Change'},
 ],sources:[{label:'Guild Wars Beyond 總覽',url:'https://wiki.guildwars.com/wiki/Guild_Wars_Beyond'}]},
 {id:'dungeons',title:'極地之眼地下城',description:'多層地圖、地下城任務與終點頭目。',intro:'地下城是極地之眼的多層冒險區域。通常從野外入口進入，沿樓層推進並完成相關任務；離開後進度會重置，和一般合作任務的入口與獎勵方式不同。',start:'先取得極地之眼並開到相應野外地圖。查看地下城列表的「入口」與「Quest」欄，找到地圖入口及任務 NPC，再組隊進場。',entries:[
  {title:'查所有地下城入口',what:'Wiki 地下城表列出樓層數、入口野外區域、任務、頭目與寶箱。先選一座，再查該地下城頁的地圖。',where:'極地之眼的席娃山脈、阿蘇拉地區、夏爾領地及地下深處。',start:'打開列表，先對照你目前已開的據點與野外地圖；不要把地下城當成單一主線 Mission。',wiki:'https://wiki.guildwars.com/wiki/Dungeon'},
  {title:'Catacombs of Kathandrax',what:'三層地下城，終點有火焰頭目與獎勵寶箱。',where:'夏爾領地的 Sacnoth Valley 東南側入口。',start:'從已開的附近據點到 Sacnoth Valley，先確認相關地下城任務，再進東南入口。',wiki:'https://wiki.guildwars.com/wiki/Catacombs_of_Kathandrax'},
  {title:"Oola's Lab",what:'阿蘇拉區域的地下城，關卡與任務進度相連。',where:'Magus Stones 野外地圖。',start:'抵達 Magus Stones 後對照 Wiki 地圖入口及任務，再進入地下城。',wiki:'https://wiki.guildwars.com/wiki/Oola%27s_Lab'},
  {title:"Slavers' Exile",what:'極地之眼的菁英地下城，與一般短地下城相比需要更多準備。',where:'Verdant Cascades 野外地圖。',start:'先完成極地之眼相關進度並確認入口與各區前置；建議看專頁再組隊。',wiki:'https://wiki.guildwars.com/wiki/Slavers%27_Exile'},
 ],sources:[{label:'Guild Wars Wiki：Dungeon',url:'https://wiki.guildwars.com/wiki/Dungeon'}]},
 {id:'elite-missions',title:'菁英任務與高難區域',description:'十二人任務、苦痛領域與眾神領域的入口整理。',intro:'菁英任務是主線以外的高難挑戰。深處與爾果的養殖場在盟與敵；苦痛領域在黑暗逆襲破關後。地下世界和悲傷裂痕是眾神領域的探索區，入口機制又不同。',start:'先確認所需章節和據點已開，再查每一項的進入 NPC 或雕像；不要從主線關卡列表尋找這些入口。',entries:[
  {title:'深處',en:'The Deep',what:'盟與敵的十二人菁英任務，分隊解機關並對戰 Kanaxai。',where:'碧玉海的卡瓦隆（Cavalon）。',start:'先抵達卡瓦隆（Cavalon），再依該城可用的菁英任務入口或通行方式組隊進入。',href:'/guides/view/?id=the-deep',linkLabel:'查看本站入口',wiki:'https://wiki.guildwars.com/wiki/The_Deep'},
  {title:'爾果的養殖場',en:"Urgoz's Warren",what:'盟與敵的十二人菁英任務，穿越科凡德森林深處的多房間地圖。',where:'科凡德森林的鳳荷議院（House zu Heltzer）。',start:'先抵達鳳荷議院（House zu Heltzer）；符合陣營入口條件時可找 Vash，亦可查 Wiki 列出的其他進入方式。',href:'/guides/view/?id=urgozs-warren',linkLabel:'查看本站入口',wiki:'https://wiki.guildwars.com/wiki/Urgoz%27s_Warren'},
  {title:'苦痛領域',en:'Domain of Anguish',what:'黑暗逆襲後期的四區域挑戰，最後通向 Mallyx。',where:'苦痛領域的 Gate of Anguish 據點。',start:'完成 Abaddon’s Gate 後，從隱密教堂找 Guardian of Whispers，進入小庭院並在真理女神像前跪下，和出現的 Seer of Truth 對話。',href:'/guides/view/?id=domain-of-anguish',linkLabel:'查看本站入口',wiki:'https://wiki.guildwars.com/wiki/Gate_of_Anguish'},
  {title:'地下世界與悲傷裂痕',en:'Underworld / Fissure of Woe',what:'葛蘭斯與巴薩澤的眾神領域，屬高難探索區而非十二人菁英任務。',where:'阿斯卡隆戰記的世紀神殿、盟與敵的 Zin Ku Corridor，或黑暗逆襲的隱密教堂。',start:'符合角色前置條件後，在對應神像付費給入口 NPC，或使用相應通行卷軸；全隊都要符合資格。',wiki:'https://wiki.guildwars.com/wiki/Realms_of_the_Gods'},
 ],sources:[{label:'Guild Wars Wiki：The Deep',url:'https://wiki.guildwars.com/wiki/The_Deep'},{label:'Guild Wars Wiki：Domain of Anguish',url:'https://wiki.guildwars.com/wiki/Domain_of_Anguish'}]},
 {id:'challenge-missions',title:'挑戰與競技任務',description:'區分盟與敵的計分挑戰與八對八陣營競技。',intro:'挑戰任務重視限時得分或守住目標，可以反覆挑戰自己的成績；競技任務是庫茲柯與勒克森的八對八玩家對戰。它們不是主線 Mission，也不是同一種玩法。',start:'先選下方任務，照「在哪裡」前往據點。若要排競技任務，角色須符合等級與入口條件，還要等候其他玩家。',entries:[
  {title:'龍喉',en:"Dragon's Throat",what:'凱寧城的計分挑戰；在限時內擊殺敵人與頭目以延長時間。',where:'完成薇茹廣場後會到達龍喉據點。',start:'從龍喉據點與任務簡報 NPC 對話，再組隊進入挑戰。',href:'/guides/view/?id=dragons-throat',linkLabel:'查看本站入口',wiki:'https://wiki.guildwars.com/wiki/Dragon%27s_Throat'},
  {title:'奧楚蘭廢墟',en:'Altrumm Ruins',what:'科凡德森林的計分挑戰，收集琥珀並阻止盜賊帶走。',where:'科凡德森林的 Altrumm Ruins 據點。',start:'從已開的科凡德森林路線抵達據點，進場前先確認收集琥珀與加時的規則。',href:'/guides/view/?id=altrumm-ruins',linkLabel:'查看本站入口',wiki:'https://wiki.guildwars.com/wiki/Altrumm_Ruins'},
  {title:'亞馬茲盆地',en:'Amatz Basin',what:'科凡德森林的計分挑戰，救出受困的庫茲柯難民。',where:'Mourning Veil Falls 南側的 Amatz Basin 據點。',start:'可由 Vasburg Armory 經 The Eternal Grove、Mourning Veil Falls 往南抵達；也可從 Durheim Archives 穿越 Mourning Veil Falls。',href:'/guides/view/?id=amatz-basin',linkLabel:'查看本站入口',wiki:'https://wiki.guildwars.com/wiki/Amatz_Basin'},
  {title:'佐席洛斯水道',en:'Zos Shivros Channel',what:'碧玉海的勒克森計分挑戰，守住神殿並抵禦敵人。',where:'碧玉海的 Zos Shivros Channel 據點。',start:'先沿盟與敵勒克森支線開到附近地圖，抵達據點後讀取守點目標再進場。',href:'/guides/view/?id=zos-shivros-channel',linkLabel:'查看本站入口',wiki:'https://wiki.guildwars.com/wiki/Zos_Shivros_Channel'},
  {title:'奧里歐斯礦坑',en:'The Aurios Mines',what:'碧玉海的計分挑戰，守住多處採礦點。',where:"從 Seafarer's Rest 進 Rhea's Crater，走南方通道向東可到礦坑據點。",start:'先抵達 Seafarer’s Rest，確認通往 Rhea’s Crater 的路線，再由礦坑據點進場。',href:'/guides/view/?id=the-aurios-mines',linkLabel:'查看本站入口',wiki:'https://wiki.guildwars.com/wiki/The_Aurios_Mines'},
  {title:'楊木要塞',en:'Fort Aspenwood',what:'八對八競技任務：庫茲柯守住要塞與建築師；勒克森攻破防線。',where:'Fort Aspenwood 的庫茲柯或勒克森據點。',start:'等級 20 角色從已開的陣營據點進入並排隊；庫茲柯隊要運琥珀護門，勒克森隊要進攻建築師。',href:'/guides/view/?id=fort-aspenwood',linkLabel:'查看本站入口',wiki:'https://wiki.guildwars.com/wiki/Fort_Aspenwood'},
  {title:'翡翠礦場',en:'The Jade Quarry',what:'八對八競技任務；奪取三座礦場，讓採礦運輸隊把翡翠送回基地。',where:'The Jade Quarry 的庫茲柯或勒克森據點。',start:'等級 20 角色從已開的陣營據點進入並排隊；優先佔礦與保護運輸隊，先取得 10 分或時間到領先可勝。',href:'/guides/view/?id=the-jade-quarry',linkLabel:'查看本站入口',wiki:'https://wiki.guildwars.com/wiki/The_Jade_Quarry'},
  {title:'Dajkah Inlet',what:'黑暗逆襲的限時計分挑戰，擊倒海盜首領後透過傳送門繼續下一座島。',where:'庫爾納的 Dajkah Inlet 據點。',start:'抵達據點後組八人隊進場；擊倒海盜指揮官與首領可爭取額外時間。',wiki:'https://wiki.guildwars.com/wiki/Dajkah_Inlet'},
  {title:'Remains of Sahlahja',what:'黑暗逆襲的單人挑戰，在墓地內擊殺蟲群得分，同時躲避幽靈。',where:'完成 Gate of Desolation 後會到達 Remains of Sahlahja 據點。',start:'在據點找 Lost Soul 開始挑戰；不要把此挑戰誤當作接續主線的任務。',wiki:'https://wiki.guildwars.com/wiki/Remains_of_Sahlahja'},
  {title:'The Shadow Nexus',what:'黑暗逆襲苦痛領域的計分挑戰，處理混沌裂隙與敵人。',where:'從 Gate of Torment 前往 The Shadow Nexus 據點。',start:'先開到 Gate of Torment 並確認能進入 The Shadow Nexus；進場前查看 Wiki 的隊伍規模與目標。',wiki:'https://wiki.guildwars.com/wiki/The_Shadow_Nexus'},
  {title:"Glint's Challenge",what:'北方之眼的守護挑戰，保護幼龍撐過六波毀滅者。',where:'Central Transfer Chamber 據點。',start:'完成 Destruction’s Depths 後抵達據點，找 Consular Brand Oakencask 開始。',wiki:'https://wiki.guildwars.com/wiki/Glint%27s_Challenge'},
 ],sources:[{label:'Guild Wars Wiki：Challenge Mission',url:'https://wiki.guildwars.com/wiki/Challenge_mission'},{label:'Guild Wars Wiki：Competitive Mission',url:'https://wiki.guildwars.com/wiki/Competitive_Mission'}]},
 {id:'zaishen',title:'戰承每日任務',description:'每天輪替的 Mission、Bounty、Vanquish、Combat 挑戰。',intro:'戰承任務是可選的每日挑戰，不是新的一條主線。告示牌每天輪替目標；完成後可領經驗、金幣、陣營或稱號點數，以及戰承銅幣。',start:'前往巴薩澤聖殿或 Embark Beach，點選戰承告示牌接當日任務；完成後找 Zehnchu 領獎。日常目標會輪替，本站不把某一天的名單寫死。',entries:[
  {title:'戰承主線任務',en:'Zaishen Mission',what:'重打指定合作任務；有時另有 Bonus／Master 或 HM 獎勵條件。',where:'巴薩澤聖殿或 Embark Beach 的 Mission 告示牌。',start:'接當日任務後前往該 Mission 據點；本站章節攻略可查路線與額外目標。',href:'/campaigns/',linkLabel:'選主線攻略',wiki:'https://wiki.guildwars.com/wiki/Zaishen_Mission'},
  {title:'戰承懸賞',en:'Zaishen Bounty',what:'擊敗每日指定頭目。',where:'同一組戰承告示牌中的 Bounty 告示牌。',start:'先接任務，確認頭目所在章節、地圖或地下城，再前往擊殺並回報。',wiki:'https://wiki.guildwars.com/wiki/Zaishen_Bounty'},
  {title:'戰承清圖',en:'Zaishen Vanquish',what:'在困難模式清除當日指定野外區域。',where:'Embark Beach 的 Vanquish 告示牌。',start:'先確認該地圖與困難模式已解鎖，再進野外清圖。',wiki:'https://wiki.guildwars.com/wiki/Zaishen_Vanquish'},
  {title:'戰承競技',en:'Zaishen Combat',what:'在指定 PvP 模式完成當日競技目標。',where:'巴薩澤聖殿或 Embark Beach 的 Combat 告示牌。',start:'接任務後確認指定模式，再從對應 PvP 入口組隊或排隊。',href:'/pvp/',linkLabel:'認識 PvP 模式',wiki:'https://wiki.guildwars.com/wiki/Zaishen_Combat'},
 ],sources:[{label:'Guild Wars Wiki：Zaishen Challenge Quest',url:'https://wiki.guildwars.com/wiki/Zaishen_Challenge_Quest'}]},
 {id:'builds',title:'Build 與隊伍搭配',description:'理解八格技能列，再從職業與技能資料開始配置。',intro:'Build 是角色出城時的技能、屬性、裝備與隊伍分工。GW1 技能欄只有八格；成功的搭配要能應付這一關的傷害、補血、控場與特殊機制。',start:'先選主職業及副職業，查看屬性與技能；確定隊伍裡有治療、防護、輸出和必要的打斷或解狀態，再回據點測試。',entries:[
  {title:'選職業',what:'先看主職業的護甲與主屬性，再決定副職業補什麼。',where:'本站的職業資料。',start:'選一個職業，讀特性與主／副職業限制。',href:'/professions/',linkLabel:'職業介紹',wiki:'https://wiki.guildwars.com/wiki/Profession'},
  {title:'找技能',what:'按職業、屬性、取得方式搜尋技能，對照繁中與英文名稱。',where:'本站技能資料庫。',start:'先選職業，再從屬性或搜尋縮小範圍；查看技能效果與取得途徑。',href:'/skills/',linkLabel:'技能資料庫',wiki:'https://wiki.guildwars.com/wiki/Skill'},
  {title:'看關卡需求',what:'同一套技能不是所有 Mission 的唯一解。特定關卡可能更重視打斷、清除降咒、保護 NPC 或分隊。',where:'本站主線與其他攻略。',start:'打不過時先讀任務機制，再換技能與隊伍角色。',href:'/campaigns/',linkLabel:'主線攻略',wiki:'https://wiki.guildwars.com/wiki/Build'},
 ],sources:[{label:'Guild Wars Wiki：Build',url:'https://wiki.guildwars.com/wiki/Build'}]},
 {id:'pve',title:'PvE 冒險',description:'戰役、合作任務、地下城與高難探索區怎麼分。',intro:'PvE 是與遊戲中的敵人、任務與地圖互動。新玩家先沿戰役主線開據點；之後可以補 Bonus／Master、地下城、菁英任務及破關後故事。',start:'第一次玩先從出生戰役往下解；已破關的角色可以直接按下列類型選要玩的內容。',entries:[
  {title:'三大戰役與合作任務',what:'阿斯卡隆戰記、盟與敵、黑暗逆襲各有主線 Mission 和 Quest。',where:'從各戰役出生地與已開據點進入。',start:'先選章節，照任務列表的接任務與下一個據點資訊前進。',href:'/campaigns/',linkLabel:'查看主線',wiki:'https://wiki.guildwars.com/wiki/Mission'},
  {title:'Bonus／Master',what:'合作任務的額外目標或評等；達標方式依戰役不同。',where:'各 Mission 內。',start:'進場前查該關攻略的額外目標，不要只完成主線目標就離開。',href:'/campaigns/',linkLabel:'選擇關卡',wiki:'https://wiki.guildwars.com/wiki/Mission#Bonus_objectives'},
  {title:'極地之眼地下城',what:'多層野外副本，通常有地下城任務與終點寶箱。',where:'極地之眼的野外地圖。',start:'先看地下城入口及任務，再組隊進場。',href:'/dungeons/',linkLabel:'地下城入口',wiki:'https://wiki.guildwars.com/wiki/Dungeon'},
  {title:'菁英區域',what:'The Deep、Urgoz’s Warren、Domain of Anguish，以及 Underworld、Fissure of Woe 等高難區。',where:'陣營城鎮、苦痛領域或眾神雕像入口。',start:'查各區的章節、入口與前置後再出發。',href:'/elite-missions/',linkLabel:'菁英任務入口',wiki:'https://wiki.guildwars.com/wiki/Elite_mission'},
 ],sources:[{label:'Guild Wars Wiki：Mission',url:'https://wiki.guildwars.com/wiki/Mission'}]},
 {id:'postgame',title:'破關後目標',description:'困難模式、清圖、稱號、技能獵人與榮譽之殿。',intro:'破關後不只有刷裝備。你可以重打關卡拿高評等、在困難模式清圖、捕捉菁英技能、探索地圖，或把成果陳列在榮譽之殿。',start:'先選一個戰役並完成最終 Mission，為該戰役帳號解鎖困難模式；之後可按自己喜歡的稱號或收藏目標安排路線。',entries:[
  {title:'Hard Mode 與 Guardian',what:'困難模式提高敵人壓力；Guardian 系列追求困難模式 Mission 的額外獎勵。',where:'在已解鎖的戰役據點，隊伍面板切換 NM／HM。',start:'任一角色完成該戰役終關後，帳號可用等級 20 角色挑戰該戰役 HM。',href:'/campaigns/',linkLabel:'重看關卡',wiki:'https://wiki.guildwars.com/wiki/Hard_mode'},
  {title:'Vanquish 與地圖探索',what:'困難模式清除野外敵人；地圖探索則填滿未探索的地圖區域。',where:'各戰役野外區域。',start:'先選已到過的野外地圖，確認 HM 資格和起點；清圖途中也可順路探索邊界。',href:'/zaishen/',linkLabel:'配合每日清圖',wiki:'https://wiki.guildwars.com/wiki/Vanquishing'},
  {title:'技能獵人',what:'收集各戰役的菁英技能，推進 Skill Hunter 稱號。',where:'菁英技能通常來自對應頭目。',start:'在本站技能頁查取得頭目，帶捕捉紋章；配合任務或清圖順路收集。',href:'/skills/',linkLabel:'查技能',wiki:'https://wiki.guildwars.com/wiki/Skill_Hunter'},
  {title:'GWAMM 與榮譽之殿',what:'長線稱號與收藏展示。榮譽之殿可展示特定稱號、英雄、迷你寵物、武器與防具。',where:'極地之眼的榮譽之殿。',start:'先完成極地之眼初期故事開放榮譽之殿，再挑一項可逐步完成的紀念碑目標。',href:'/equipment/',linkLabel:'裝備與收藏',wiki:'https://wiki.guildwars.com/wiki/Hall_of_Monuments'},
  {title:'Beyond 後續故事',what:'三大戰役後的額外劇情，而非一般重複刷的每日任務。',where:'科瑞塔、極地之眼與凱珊。',start:'看前置與順序，再選科瑞塔之戰或變革之風。',href:'/beyond/',linkLabel:'Beyond 入口',wiki:'https://wiki.guildwars.com/wiki/Guild_Wars_Beyond'},
 ],sources:[{label:'Guild Wars Wiki：Hard mode',url:'https://wiki.guildwars.com/wiki/Hard_mode'}]},
 {id:'pvp',title:'PvP 競技',description:'認識各模式的人數與目標，再決定從哪一種開始。',intro:'PvP 是玩家間的競技。各模式的人數與勝利目標不同；戰承競技每日任務會指定其中一種模式，但它本身不是新的 PvP 競技場。',start:'想短場練習，可先讀 Random Arenas；想組織隊伍，查 Codex Arena、Heroes’ Ascent 或 Guild versus Guild 的人數與規則。進場前確認目前模式與隊友安排。',entries:[
  {title:'Random Arenas／Codex Arena',what:'四對四競技；前者隨機組隊，後者有當期技能池限制。',where:'Battle Isles 的對應競技場據點。',start:'看技能限制與隊伍規則，再進場排隊或組隊。',wiki:'https://wiki.guildwars.com/wiki/Arena'},
  {title:'Alliance Battles／Fort Aspenwood／Jade Quarry',what:'盟與敵陣營相關的大型或目標型競技。',where:'盟與敵的相關據點和競技入口。',start:'先讀各模式的佔點、攻防或資源目標；不要以純擊殺數判斷勝負。',wiki:'https://wiki.guildwars.com/wiki/Player_versus_player'},
  {title:'Heroes’ Ascent／Guild versus Guild',what:'八人隊競技；前者連戰多張地圖，後者以擊敗敵方 Guild Lord 為核心。',where:'Battle Isles 對應據點或公會戰入口。',start:'先備齊隊伍與適合 PvP 的技能列，確認地圖規則再進場。',wiki:'https://wiki.guildwars.com/wiki/Player_versus_player'},
 ],sources:[{label:'Guild Wars Wiki：Player versus player',url:'https://wiki.guildwars.com/wiki/Player_versus_player'}]},
 {id:'equipment',title:'裝備與收藏',description:'護甲、符文、武器詞綴與外觀收藏。',intro:'GW1 的裝備先看能否達到適當的基礎數值與需求，再調整符文、徽記及武器詞綴。之後追求的常是搭配與外觀，不是無限提高裝等。',start:'先確認你主職業適用的護甲與武器需求；裝上適合 Build 的符文和徽記，然後再考慮菁英防具、特殊武器或榮譽之殿收藏。',entries:[
  {title:'護甲值與主職業',what:'護甲值影響多數物理與元素傷害；不同職業的最高基礎護甲不同。',where:'各戰役的護甲商與收集者。',start:'先讓各部位取得符合職業的最大基礎護甲，再看外觀。',wiki:'https://wiki.guildwars.com/wiki/Armor_rating'},
  {title:'符文與徽記',what:'符文與徽記調整屬性、體力、能量或防護；需要看技能列和職業需求。',where:'可升級的護甲部位。',start:'先查每個升級的效果與堆疊限制，避免只看名稱就全身重複裝。',wiki:'https://wiki.guildwars.com/wiki/Armor_bonus'},
  {title:'武器與收藏',what:'武器基礎數值、需求、前後綴影響實戰；特殊外觀、菁英防具和紀念碑是長期收集目標。',where:'武器商、掉落、收集者，以及極地之眼的榮譽之殿。',start:'先讓武器需求符合你的屬性，再追想要的造型或紀念碑分類。',href:'/postgame/',linkLabel:'看破關後目標',wiki:'https://wiki.guildwars.com/wiki/Hall_of_Monuments'},
 ],sources:[{label:'Guild Wars Wiki：Armor rating',url:'https://wiki.guildwars.com/wiki/Armor_rating'}]},
];
