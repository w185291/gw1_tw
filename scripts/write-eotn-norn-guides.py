"""Authored walkthroughs checked against individual Wiki revisions.

These are researched pages, not placeholders. Terminology and full campaign
coverage remain incomplete; this script never promotes them to complete.
"""
from pathlib import Path
from lxml import html
import json,re

ROOT=Path(__file__).resolve().parents[1];CACHE=ROOT/'docs/reference/completeness'
def load(p):return json.loads(p.read_text(encoding='utf-8'))
glossary={t['en']:t for t in load(ROOT/'src/data/terminology/game-client.json')}
def named(en):return {'en':en,'zhTW':glossary[en]['zhTW'] if en in glossary else en+'（繁中名稱待確認）'}

guides={
'the-beginning-of-the-end':{
 'title':'The Beginning of the End','region':'depths-of-tyria','branch':'序章','entry':'完成所屬章節的入口任務後，地下會面過場結束就自動接到本任務；從 Beneath Lion’s Arch、Tunnels Below Cantha 或 Caverns Below Kamadan 其中一處開始。','location':'地下入口區域','requirements':['先進行 What Lies Beneath、I Feel the Earth Move Under Cantha’s Feet 或 Hole of Istan 其中一份入口任務。'],
 'summary':'地下會面後有三分鐘逃到 Asura Gate；重點是跟著友軍撤退，沿途敵人不需要擊殺。',
 'steps':[('過場前選跟隨對象','在會面前先選取 Burol Ironfist 或 Kodan，過場結束後用空白鍵跟隨友軍。倒數顯示三分鐘，現在的目標是撤退。'),('沿路撤離','跟友軍往 Asura Gate 前進；Destroyer 會在後方生成並追來，別停下逐群交戰，否則會耗盡倒數。一般情況不帶加速也能趕到。'),('保持移動','追上跟隨對象而停下時，再按空白鍵繼續跟。NPC 穿過傳送門後自動跟隨會停止，最後一段要玩家自己走入門。'),('進門與招募','進 Asura Gate 觸發進入北方的過場，任務自動完成並從日誌移除；招募 Vekk、Ogden Stonehealer，抵達 Boreal Station，自動接 Against the Destroyers。')],
 'warnings':['三分鐘是逃生時限，停下打 Destroyer 很容易失敗。','不要因為看到 NPC 進門就站著等，自行走進傳送門。'],
 'after':['完成後抵達 Boreal Station，Vekk 與 Ogden Stonehealer 加入英雄名單。','Against the Destroyers 自動加入任務日誌；下一步出站找 Jora。'],
 'normal':['限時撤離，不要求擊殺追兵；沿友軍路線持續移動即可。'],
 'hard':['通關目標仍是逃到門，不因 HM 改成殲滅追兵。重打時帶解除致殘及防護，避免高等追兵追上後排。'],
 'team':['隊伍需要穩定移動、治療與解除病症；不需要為這段準備 Boss 輸出。'],
 'rewardNotes':['招募 Vekk 與 Ogden Stonehealer；本頁 Reward 未列金錢或經驗值獎勵。'],
 'absence':'這段要求限時逃出，沒有必須擊敗的 Boss；後方追來的 Destroyer 可避開。','next':'against-the-destroyers'},
'against-the-destroyers':{
 'title':'Against the Destroyers','region':'far-shiverpeaks','branch':'全章總覽','entry':'The Beginning of the End 完成後，在 Boreal Station 自動接到；出站先向 Jora 問路。','location':'Boreal Station → Ice Cliff Chasms → Eye of the North','requirements':['完成地下限時逃生並抵達 Boreal Station。'],
 'summary':'這份 Quest 串起整章三條盟友分支及最終決戰，不是一張可單獨打完的 Mission。',
 'steps':[('先找 Jora','出 Boreal Station 到 Ice Cliff Chasms，先和 Jora 對話，再沿箭頭向北到 Eye of the North。沒有這次對話，Scrying Pool 的第一段預言不會開放。'),('取得三條分支','進 Hall of Monuments 找 Gwen，查看 Scrying Pool，選保持睜眼觀看 The First Vision，取得 The Knowledgeable Asura、The Missing Vanguard、Northern Allies。'),('完成三方盟友','三條分支先後不限。Asura、Ebon Vanguard、Norn 都完成後，回 Hall of Monuments 查看 Scrying Pool，選 Look Deep into the Pool 觀看 The Final Vision。'),('接最終地下主線','依箭頭找 Jalis Ironhammer 接 Heart of the Shiverpeaks；完成後向他接 Destruction’s Depths。後者雖沒有列在此 Quest 的目標文字中，仍是前往 Central Transfer Chamber 的必要流程。'),('打最終戰並領獎','在 Central Transfer Chamber 找 High Priest Alkar 接 A Time for Heroes。擊敗最終敵人後到 Epilogue，找 Droknar 領此總覽任務的獎勵及 Droknar’s Key。')],
 'warnings':['這份總覽 Quest 不能放棄，也不能用只完成一條分支當作整章破關。','先找 Jora，避免 Scrying Pool 有箭頭卻沒有 First Vision 的情況。'],
 'after':['最終戰後抵達 Epilogue，找 Droknar 領獎；完成整章後才接破關後內容。'],
 'normal':['此項追蹤整章進度；戰鬥與隊伍要求請依各分支實際 Quest。'],
 'hard':['這份總覽沒有獨立 HM 副本入口；在各可重玩的故事任務选择 HM，不用重新建立總覽任務。'],
 'team':['旅途中可攜英雄與傭兵；各分支與最後決戰另有戰術需求。'],
 'xp':10000,'rewardNotes':['1,000 Dwarf 聲望；最終 Epilogue 找 Droknar 領取。','Droknar’s Key 的兌換獎勵與本任務經驗／聲望分開列於遊戲結尾。'],
 'absence':'這是整章進度追蹤；個別分支與最終 Boss 在對應故事任務處理。','previous':'the-beginning-of-the-end','next':'tracking-the-nornbear'},
'tracking-the-nornbear':{
 'title':'Tracking the Nornbear','region':'far-shiverpeaks','branch':'Norn 前導','entry':'從 Eye of the North 出 Ice Cliff Chasms，找門外的 Jora 接取，屬於 Northern Allies 分支。','location':'Ice Cliff Chasms 的 Jora','requirements':['開始 Northern Allies 分支。'],
 'summary':'追蹤熊形敵人並開 Gunnar’s Hold、Sifhalla 據點；敵人前兩次逃走是正常劇情。',
 'steps':[('第一場遭遇','向北進 Norrhart Domains，擊敗沿路出現的 Savage Nornbear；它會逃跑，不必原地追著等。'),('找 Gunnar','向東北進 Gunnar’s Hold，找 Gunnar Poundfist 對話。他會指示找 Sif Shadowhunter。'),('第二場遭遇','回 Norrhart Domains，這次向西北進 Drakkar Lake，再擊敗 Savage Nornbear；它再次逃走仍是正常進度。'),('保衛 Sifhalla','往北方、地圖東北角進 Sifhalla，向 Sif 說話後傳進據點探險版本。擊敗進攻的熊形敵人，看完過場返回一般據點。'),('回報與下一步','找 Sif Shadowhunter 領 2,000 經驗與 250 Norn 聲望；後續 Curse of the Nornbear 自動加入，準備在 Sifhalla 開始追獵。')],
 'warnings':['熊前兩次逃走不是卡關；先前往指定據點找 NPC 更新目標。','若熊歸零又回到 25% 而不逃，先把英雄／傭兵旗標拉遠，讓戰鬥解除後再試。'],
 'after':['完成防守後返回 Sifhalla，向 Sif 領獎；後續 Curse of the Nornbear 自動加入日誌。'],
 'normal':['跨據點追蹤加一場防守，按前後 NPC 順序更新目標，不必清光每區敵人。'],
 'hard':['路線與更新條件相同；在高等敵區保持隊伍一起行動，別為追熊穿過多隊巡邏。'],
 'team':['需要近戰壓制、治療與解除病症；帶遠距離拉怪，方便通過兩張探險區。'],
 'xp':2000,'rewardNotes':['250 Norn 聲望。'],'bossTitles':['Savage Nornbear'],'bossCounter':'前兩場讓敵人進入撤退劇情，不要在原地等重生。它是近戰戰士型敵人，帶致盲、格擋與治療；技能依不同任務遭遇有所差異。','previous':'against-the-destroyers','next':'curse-of-the-nornbear'},
'curse-of-the-nornbear':{
 'title':'Curse of the Nornbear','region':'far-shiverpeaks','branch':'Norn 追獵','entry':'在 Sifhalla 向 Sif Shadowhunter 選擇開始追獵；已完成者也可從 Hall of Monuments 的 Scrying Pool 重接。','location':'Sifhalla 的 Sif Shadowhunter','requirements':['每個要取得通關進度的角色，都要先領 Tracking the Nornbear 獎勵；只靠隊友開場可進入，但未滿足前置者不會得到完成紀錄。'],
 'summary':'沿地圖 1→2→3→4 追獵，最後一場擊殺 Nornbear，完成後招募 Jora。',
 'steps':[('清路到狼祭壇','跟 Jora、Sif 清入口的 Mandragor 與洞內敵人，往圖上 1 的 Shrine of the Wolf Spirit。原本友好的 Stonewolf 會轉敵對，先清守護巨人及狼群。'),('取得追蹤能力','向祭壇取得 Volfen Blessing，啟用後技能列換成五個狼能力。用 Volfen Bloodlust 在任務地圖顯示 Svanir 的位置；此變身有幫助，但不是通關必要條件。'),('圖上 2 的遭遇','跟紅點路線到 2，將 Nornbear 血量壓到約一半，它會逃走。不要在原地等，轉往下一個標記。'),('圖上 3 的遭遇','到 3 再打一場，約半血再次撤退；保留補血與解病症，沿南方紅點走向 4。'),('圖上 4 完成擊殺','最後一場才需要真正擊殺 Nornbear。看完過場回到 Sifhalla，Jora 解鎖為英雄，任務記入 Hero’s Handbook 第 7 頁。')],
 'warnings':['前兩場只追獵，最後一場才會擊殺完成；看到半血逃走不要判定失敗。','Volfen Bloodlust 偶爾不顯示目標，可以照地圖固定點追蹤。','若熊反覆回血不逃，旗標隊友遠離它，解除近距離戰鬥後再處理。'],
 'after':['完成後回 Sifhalla，Jora 加入英雄名單。','Northern Allies 的後续還有 Flames of the Bear Spirit → Blood Washes Blood，以及 Vision of the Raven Spirit → A Gate Too Far；兩條都需要完成。'],
 'normal':['初次建議用狼祭壇與追蹤技能，按 1、2、3、4 的順序完整跑流程。'],
 'hard':['追蹤點及撤退規則相同，敵人等級較高；分批清狼與巨人，再接近祭壇。首次完成 Norn 聲望 1,500，重打 150。'],
 'team':['需要近戰減傷、穩定治療及解除病症。Jora、Sif 能造成流血，可搭配需要流血條件的攻擊。'],
 'xp':2500,'repeatable':True,'rewardNotes':['NM 首次 1,000 Norn 聲望，重打 100；HM 首次 1,500，重打 150。','招募 Jora，記入 Hero’s Handbook 第 7 頁。'],'bossTitles':['Nornbear'],'bossCounter':'前兩處壓到約半血就移往下一處；圖上 4 才集中擊殺。用致盲或格擋限制近戰，隊伍分散，避免全員停在敵人身旁。','previous':'tracking-the-nornbear','nextOptions':['flames-of-the-bear-spirit','vision-of-the-raven-spirit']},
'flames-of-the-bear-spirit':{
 'title':'Flames of the Bear Spirit','region':'far-shiverpeaks','branch':'Norn 熊分支','entry':'在 Jaga Moraine 找 Egil Fireteller 接取，帶他到南側 Sacred Altar。','location':'Jaga Moraine 的 Egil Fireteller','requirements':['完成 Curse of the Nornbear。'],
 'summary':'帶 Egil 到祭壇並保住點燃進度；重點是阻止 Arctic Nightmare 消耗火焰，不是追求殺光會重生的敵人。',
 'steps':[('帶 Egil 到祭壇','接取後由 Egil 的住處往 Sacred Altar 推進，分批清路；不要只看自己已到祭壇，確認跟隨 NPC 也靠近。'),('維持點燃進度','在祭壇周圍占領／點燃，觀察火焰進度。Arctic Nightmare 會反覆生成，尚未取得控制前最多六隻持續重生。'),('打斷 Consume Flames','此技能施法十秒，完成會扣掉 15 點火焰進度。優先打斷正在施放的 Nightmare，再清其他敵人；不要全部追出祭壇。'),('召出熊靈並回報','完成祭壇事件後 Bear Spirit 出現，向 Egil Fireteller 領獎，同時接受 Blood Washes Blood。若太早換區，祭壇控制可能需要重新取得。')],
 'warnings':['Nightmare 不掉物品、不給經驗，也不算 Norn 狩獵數；不要把無限重生當作刷怪目標。','只完成占領第一段就換區，可能要重占祭壇；無法重新觸發時可能需放棄再接。'],
 'after':['向 Egil 領 2,000 經驗與 250 Norn 聲望，同時取得 Blood Washes Blood。'],
 'normal':['打斷 Consume Flames 並保住祭壇進度；近祭壇的怪清掉後，讓隊員留在占領範圍。'],
 'hard':['流程相同，Nightmare 等級及傷害提高。優先維持防护與打斷，別因敵人一直重生讓全隊離開祭壇。'],
 'team':['需要可靠打斷、治療與範圍清怪；祭壇防守時留人維持進度。'],
 'xp':2000,'rewardNotes':['250 Norn 聲望，領獎時同時接後續 Blood Washes Blood。'],'bossTitles':['Arctic Nightmare'],'bossCounter':'這是普通事件敵人，沒有可捕捉 Boss 菁英。優先打斷十秒施法的 Consume Flames，守住祭壇進度，不追出占領區。','previous':'curse-of-the-nornbear','next':'blood-washes-blood'},
'vision-of-the-raven-spirit':{
 'title':'Vision of the Raven Spirit','region':'far-shiverpeaks','branch':'Norn 鴉分支','entry':'在 Olafstead 找 Olaf Olafson 接取，再到 Varajar Fells 的 Raven’s Point 入口附近找他開始「討論」。','location':'Olafstead → Varajar Fells','requirements':['完成 Curse of the Nornbear。'],
 'summary':'先與六名 Norn 比武，再協助他們擊退兩小隊 Destroyer，完成後接 A Gate Too Far。',
 'steps':[('抵達會面位置','接任務後往 Varajar Fells，找 Raven’s Point 入口附近的 Olaf。先整理能量與站位，再選準備討論。'),('擊敗 Norn 團隊','Olaf、Olrun 及四名守衛會暫時變敵人。集中壓低一名再換目標，每名到 20% 血量就轉友好，不必繼續追殺。'),('清两隊 Destroyer','比武後兩小隊 Destroyer 來襲，借助已轉友好的 Norn 和旁邊復活神龕分批處理；別讓剛比武耗空的後排站最前方。'),('領獎並接深入任務','清完後看 Sign of the Raven 過場，向 Olaf 領 2,000 經驗與 250 Norn 聲望。可立即接 A Gate Too Far，或稍後回 Olafstead 找他。')],
 'warnings':['「討論」選項會立即開打，先站好再觸發。','Norn 到 20% 血量轉友好後，切換下一個仍敵對的目標。'],
 'after':['向 Olaf 領獎並接 A Gate Too Far；下一段由他帶隊進 Raven’s Point。'],
 'normal':['先比武、再清 Destroyer；復活神龕很近，可用來穩住隊伍後再推進。'],
 'hard':['事件順序不變，避免比武結束後立即多拉敵隊；等能量及生命回復再接增援。'],
 'team':['需要短時間集火、治療與解除病症；比武時逐一讓敵方轉友好。'],
 'xp':2000,'rewardNotes':['250 Norn 聲望。'],'absence':'此處是 Olaf 一隊的比武及兩小隊 Destroyer，Wiki 沒有固定可捕捉 Boss 列表；Norn 達 20% 血量就轉友好。','previous':'curse-of-the-nornbear','next':'a-gate-too-far'},
'blood-washes-blood':{
 'title':'Blood Washes Blood','region':'far-shiverpeaks','branch':'Norn 熊分支收尾','entry':'Flames of the Bear Spirit 領獎後接續；初次從 Jaga Moraine 的祭壇開始，重打可由 Scrying Pool 或 Bear Spirit 接取。','location':'Jaga Moraine → Bjora Marches','requirements':['每名要取得完成紀錄的角色，都必須先領 Flames of the Bear Spirit 獎勵。'],
 'summary':'占祭壇召熊靈，取得 Ursan Aura，打破木路障並清五隊佔據 Jora 家園的 Charr。',
 'steps':[('取得祭壇控制','可由 Sifhalla 出 Jaga Moraine，找中央住處的 Egil，帶他到南側 Sacred Altar。清干擾者並讓祭壇周圍友方數量多於敵方，等藍色控制條填滿。'),('與熊靈對話換區','占領後 Bear Spirit 出現，和她交談再穿門進 Bjora Marches；進入後會傳到任務開始位置，不要沿探險地圖舊位置亂找。'),('拿 Ursan Aura','沿紅點主路到 Shrine of the Bear Spirit，清周圍三隊 Charr，與祭壇對話取得 Ursan Aura。任務目標寫 Ursan Blessing 是原文顯示問題，初次流程拿的是 Ursan Aura。'),('打破木路障','選其中一條路障通道，使用變身技能列的 Ursan Force 打碎木 Barricade。普通攻擊無法代替這個機制；沿圖紅點往家園區推進。'),('清家園五隊','在最後圍欄內逐群清五隊 Charr，先處理會補血的 Elmohr Snowmender，打斷 Kakei 的 Meteor Shower，避免站在 Docu 的 Barrage 範圍一起吃傷害。清完要求的隊伍即完成。'),('確認完成與回傳','完成後返回 Gunnar’s Hold，計入 Northern Allies 熊分支和 Hero’s Handbook 第 9 頁。鴉分支的 A Gate Too Far 仍要另外完成。')],
 'warnings':['沒 Ursan Force 就過不了木路障；初次不要跳過熊祭壇。','圖的黃色線是已完成角色的重打捷徑，初次先依紅色主路。','任務實際檢查最後家園區五隊，不要求清空整張 Bjora Marches。'],
 'after':['完成後傳送 Gunnar’s Hold，記入 Hero’s Handbook 第 9 頁。','若 A Gate Too Far 尚未完成，接著完成鴉分支；兩條都完成後才完成 Northern Allies。'],
 'normal':['初次依紅線拿 Ursan Aura，再用 Ursan Force 開路；重打且自帶 Ursan Blessing 才能採用圖的黃色捷徑。'],
 'hard':['流程及五隊目標相同。分批拉 Charr，先殺補師並打斷 Meteor Shower。全隊死亡懲罰達 60% 被送出時，會回 Jaga Moraine 的 Jarnskeggi 神龕並清除死亡懲罰，可從附近門重進。'],
 'team':['需要打斷、分散站位、防護、治療及範圍輸出；至少一人取得熊技能負責木路障。'],
 'xp':2500,'repeatable':True,'rewardNotes':['NM 首次 1,000 Norn 聲望，重打 100；HM 首次 1,500，重打 150。','Hero’s Handbook 第 9 頁。'],'bossTitles':['Tenagg Flametroller','Docu Kindleshot','Elmohr Snowmender','Kakei Stormcaller'],'bossCounter':'先分批引出護衛。近戰头目用致盲／格擋限制；遊俠的 Barrage 要分散；補師先打斷或集火；元素使的 Meteor Shower 必須打斷或立刻離開範圍。','previous':'flames-of-the-bear-spirit'},
'a-gate-too-far':{
 'title':'A Gate Too Far','region':'depths-of-tyria','branch':'Norn 鴉分支收尾','entry':'在 Olafstead 找 Olaf Olafson 選開始，他會帶隊進 Raven’s Point 的故事版本；這次不是普通地下城 Defending the Breach。','location':'Olafstead 的 Olaf Olafson','requirements':['每名要取得進度的角色，都需先領 Vision of the Raven Spirit 獎勵。'],
 'summary':'穿過三層故事區域，清鴉祭壇、追蹤 Destroyer Tremor，最後摧毀 Asura Undergate。',
 'steps':[('第一層鴉祭壇','依圖第一幅紅點從入口走向 Shrine of the Raven Spirit。接近會先出現一隻 Destroyer Tremor，加東北增援；接著西側、西南、東南各來一組。全部清完取得士氣，可向祭壇或 Olaf 拿 Raven Blessing，這是可選能力。'),('第一層往出口','離祭壇向南走，沿各隊 Destroyer 的位置前進，優先清不會移動的 Tremor，從遠處打可避開喊技擊倒。穩健首通逐群清到下一層入口。'),('第二層通路','第二幅圖的紅點為通路，绕開第一隊 Vaettir，穿過西側門道，再向北、西前進抵達第三層。Destroyer 與本地 Vaettir 敵對，不必清光這層所有怪。'),('第三層慢慢拉','由頂端入口貼右側推進。拉右隊時左隊會移向房間中央，那裡另藏一隻 Tremor；不要一次衝到中間。往南下一隊之後也藏一隻，逐步引出。'),('最終房間','進西南房間，先清半途與門前兩隻隱藏 Tremor。門前那隻死亡後，Asura Gate 開始逐隻生成 Destroyer；隊伍較弱可守住並逐隻殺，約十隻後停止，再打門。'),('摧毀門與回傳','把 Asura Undergate 打掉，看 Olaf and Ogden 過場後回 Olafstead。計入 Northern Allies 鴉分支；熊分支 Blood Washes Blood 仍要完成。')],
 'warnings':['同樣使用 Raven’s Point 三層地圖，但不是普通地下城任務；不要用普通地下城的 Boss／鑰匙流程代替。','每次換層會失去 Raven Blessing，需要時向 Olaf 再拿。','第三層有隱藏 Tremor；前排慢拉，別讓後排跑進四秒範圍擊倒。'],
 'after':['完成後傳送 Olafstead。','若 Blood Washes Blood 尚未完成，補熊分支；Northern Allies 完成後回 Scrying Pool 更新全章進度。'],
 'normal':['可選 Raven Blessing，不是通關必帶。最終門可直接集火，但保守做法先殺逐次生成的 Destroyer。'],
 'hard':['同樣三層，準備防擊倒、元素減傷與遠距離輸出。Destroyer 免疫燃燒，弱點是寒冷傷害；不要把整隊輸出建立在燃燒上。'],
 'team':['需要防擊倒、防護與穩定治療；一般施法可打斷，但 Tremor 是喊技，普通打斷不能阻止，改用遠距離站位或限制喊技。'],
 'xp':2500,'repeatable':True,'rewardNotes':['NM 首次 1,000 Norn 聲望，重打 100；HM 首次 1,500，重打 150。'],'bossTitles':['Destroyer Tremor','Asura Undergate'],'bossCounter':'Tremor 是喊技，耳聞範圍內擊倒四秒；在目標遠距離技能的最大距離或用長弓／平射弓打，可避開擊倒。Asura Undergate 不是血肉目標，不能靠流血或毒為主要傷害，但可被擊倒。','previous':'vision-of-the-raven-spirit'},
}

map_manifest=load(CACHE/'eotn-map-manifest.json')
order={slug:i+1 for i,slug in enumerate(guides)}
story=load(CACHE/'list-of-eye-of-the-north-missions-and-primary-quests.json')
directory=ROOT/'src/data/eye-of-the-north/missions';directory.mkdir(parents=True,exist_ok=True)
for slug,g in guides.items():
    source=load(CACHE/(slug+'.json'));maps=map_manifest.get(slug,[])
    for image in maps:
        image['hasDrawnRoute']=True;image['role']='main_route';image['visualReview']='reviewed'
    bosses=[];sources=[{'title':'Guild Wars Wiki：'+source['title'],'url':source['url'],'revision':source['revision'],'checkedAt':source['checkedAt'],'role':'mechanics'},{'title':'Guild Wars Wiki：極地之眼主線結構','url':story['url'],'revision':story['revision'],'checkedAt':story['checkedAt'],'role':'mechanics'}]
    for title in g.get('bossTitles',[]):
        cache=load(CACHE/(re.sub('[^a-z0-9]+','-',title.lower()).strip('-')+'.json'))
        tree=html.fromstring(cache['html']);prof=None
        for row in tree.xpath('//tr[th]'):
            if row.xpath('./th')[0].text_content().strip()=='Profession':prof=' '.join(row.xpath('./td')[0].text_content().split())
        skills=[];elite=[];heads=tree.xpath('//*[@id="Skills"]')
        if heads:
            for block in heads[0].getparent().itersiblings():
                if block.tag=='h2':break
                for li in block.xpath('.//li'):
                    links=li.xpath('.//a[starts-with(@href,"/wiki/") and not(starts-with(@href,"/wiki/File:"))]/@title')
                    if links:
                        if title=='Savage Nornbear' and 'only during Curse of the Nornbear' in li.text_content():continue
                        skills.append(links[0])
                        if '(elite)' in li.text_content():elite.append(links[0])
        bosses.append({'name':named(title),'profession':glossary[prof]['zhTW'] if prof in glossary else prof,'importantSkills':skills,'eliteSkills':elite,'eliteSkillsVerified':bool(heads),'skillListVerified':bool(heads),'notes':['此列表亦包含故事關鍵敵人；有菁英技能不表示普通敵人可捕捉。'],'strategy':g['bossCounter'],'source':cache['url'],'revision':cache['revision'],'translationVerified':title in glossary})
        sources.append({'title':'Guild Wars Wiki：'+cache['title'],'url':cache['url'],'revision':cache['revision'],'checkedAt':cache['checkedAt'],'role':'mechanics'})
    rewards=[{'label':'任務獎勵','experience':g.get('xp'),'gold':None,'skillPoints':None,'notes':g['rewardNotes']}]
    m={'id':slug,'order':order[slug],'campaign':'eye-of-the-north','region':g['region'],'name':named(g['title']),'type':'primary-quest','category':'main-story','status':'draft','contentStatus':'incomplete','translationVerified':g['title'] in glossary,'translationSources':['game-client://2026-10-09/string/'+str(i) for i in glossary.get(g['title'],{}).get('stringIds',[])],'terminologyAudit':{'status':'incomplete','sources':[]},'aliases':[g['title']],'tags':['極地之眼','主線 Quest',g['branch']],'summary':g['summary'],'partySize':8,'recommendedLevel':20,'difficulty':{'normal':None,'hard':None},'estimatedMinutes':{'normal':None,'hard':None},'durationCategory':'variable','modes':{'normal':True,'hard':True},'entryMethod':{'type':'quest','description':g['entry'],'location':g['location'],'requirements':g['requirements']},'requiredHeroes':[],'rewardTiers':[],'branch':g['branch'],'routeChoice':'Norn 熊與鴉分支都要完成；全章另有 Asura、Ebon Vanguard 分支。' if 'Norn' in g['branch'] else None,'objectives':[{'text':g['summary']}],'bonus':{'available':False,'kind':'none','title':'本任務沒有前三章的 Bonus／大師分級','summary':'完成主線目標取得 Quest／故事紀錄獎勵，沒有額外 Bonus 或限時 Master 條件。','trigger':'不適用；依主線目標完成。','steps':[],'missable':False,'completion':'主線目標完成並觸發結尾或向指定 NPC 回報。'},'walkthrough':[{'title':t,'content':c} for t,c in g['steps']],'routeSummary':g['entry'],'mapImage':maps[0]['src'] if maps else None,'mapNotes':(['按圖紅點行走，點圖可放大；圖中英文地名保留以便與遊戲英文介面核對。'] if maps else ['原 Wiki 此頁沒有單張完整行走圖；本段依據點與接任務 NPC 順序前進。']),'maps':maps,'bosses':bosses,'bossAbsenceVerified':bool(g.get('absence')),'bossAbsenceReason':g.get('absence',''),'recommendedTeam':g['team'],'tips':[],'warnings':g['warnings'],'modeDifferences':{'normal':g['normal'],'hard':g['hard']},'rewards':{'normal':rewards,'bonus':[],'hard':rewards if g.get('repeatable') else [],'zaishen':[],'reforged':[]},'wiki':{'guildWarsWiki':source['url'],'pvx':None},'sources':sources,'todos':['核對本文所有 NPC 與技能正式繁中名稱。','核對各分支前後來源頁並完成全章涵蓋查核。'],'previousMission':g.get('previous'),'nextMission':g.get('next'),'previousOptions':[],'nextOptions':g.get('nextOptions',[]),'prerequisites':[],'primaryQuestBefore':[],'primaryQuestAfter':[],'afterCompletion':g['after'],'storyStartVerified':slug=='the-beginning-of-the-end'}
    if slug=='a-gate-too-far':m['mapNotes'].append('圖由上到下依序為一、二、三層；第三幅最下端 Asura Undergate 是最終目標。')
    if slug=='the-beginning-of-the-end':m['mapNotes'].append('此圖是 Caverns Below Kamadan 入口版本；由另外兩章進入時，沿友軍帶路逃向 Asura Gate。')
    if slug=='blood-washes-blood':m['mapNotes'].append('紅點是初次主路，黃色點是重打捷徑；綠色圓記號為起點，S 是熊祭壇，C 是家園 Charr 營地。')
    (directory/(slug+'.json')).write_text(json.dumps(m,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
campaign_path=ROOT/'src/data/campaigns/eye-of-the-north.json';campaign=load(campaign_path)
campaign.update({'status':'available','description':'已整理序章、全章總覽與 Norn 分支八份攻略。極地之眼分主線 Quest、故事副本、英雄招募和地下城；Asura、Ebon Vanguard、最終戰與其餘地下城仍在逐篇整理，本章尚未完成。','regions':[{'id':'far-shiverpeaks','name':named('Far Shiverpeaks')},{'id':'depths-of-tyria','name':named('Depths of Tyria')}],'flow':[{'entry':slug,'requires':[g['previous']] if g.get('previous') else [],'branch':g['branch']} for slug,g in guides.items()]})
campaign_path.write_text(json.dumps(campaign,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
(CACHE/'eotn-map-manifest.json').write_text(json.dumps(map_manifest,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print('Wrote eight researched EotN Quest walkthroughs with six original route maps; full chapter remains incomplete.')
