"""Reviewed walkthrough summaries. Completeness remains gated by terminology and boss audit."""
from pathlib import Path
import json,sys,re
ROOT=Path(__file__).resolve().parents[1]
RESEARCH=Path('C:/Users/roger/Documents/激戰/攻略研究')
sys.path.insert(0,str(ROOT.parent/'GW1第一章攻略'))
import content,content_02_14
legacy={m['id']:m for m in content.MISSIONS}
# Existing authored prose was checked against the cached full Wiki walkthroughs before reuse.
# Do not accept its translated proper names as evidence.
D={
15:{'steps':[
('護送到第一座吊橋','與 Ghostly Hero 交談讓他跟隨；再次交談可叫他停下。讓他用 Claim Resource 放下吊橋，過橋往南。西側的 Slow Totem 是可選輔助物，放地上能減慢範圍內敵人，並非必要道具。'),
('擊敗入口頭目','擊殺 Goss Aleessh 及同伴後觸發過場，再讓 Ghostly Hero 打開下一座吊橋。把他留在橋後方，用窄入口把衝出的 Enchanted 敵人分批擊殺，避免他先被包圍。'),
('先準備再佔王座','打敗王座上的 Enemy Ghostly Hero，確認補師能治療任務友軍後，才帶己方 Ghostly Hero 接近王座。佔領後開始 10 分鐘防守，期間他死亡即失敗。'),
('清除第一批進攻','先處理由東、西、南再東側出現的 Forgotten Arcanists，打斷施法。後續還有弓手及帶頭目的隊伍；Siege Wurms 從外圍攻擊時，補住 NPC，別為追蟲把防線全部撤空。'),
('利用最後約五分鐘做 Bonus','穩健做法是等西門的 Forgotten 頭目隊進攻並將其清掉，再帶進攻隊往南方堡壘。依圖先殺吊橋後的將軍，再進後方建物殺另外兩名；保留能治療 Ghostly Hero 的防守者或召喚防線。'),
('攔截援軍並守到結束','每殺一名將軍會有新敵人奔向王座。進攻隊攔住能攔截的增援，三名將軍及其隊伍處理完確認 Bonus，再回王座保護 Ghostly Hero，倒數歸零才算主線完成。')],
'bonus':['佔領王座後才開始 10 分鐘窗口；三名將軍在南方堡壘，第一名在吊橋後，另兩名在其後建物。','殺將軍會產生前往王座的增援，不能只看自己身邊已清空。先清主線西門頭目隊，可留下約五分鐘專心進攻。','三名將軍擊殺即取得 Bonus；之後 NPC 死亡仍會使主線失敗。若需主線與 Bonus 同次完成，必須守到計時結束。'],
'hm':['任務與 Bonus 時限相同；敵方壓力更高，防守 NPC 的治療與防護不能全跟進攻隊離開。Forgotten Cursebearers 能拆加持，不能只靠一個常駐防護。'],
'warning':['一旦佔領王座就開始倒數，先整理能量與隊伍位置。','Bonus 援軍會奔向 NPC；把所有六人帶走容易讓主線失敗。'],
'team':['需要能指定任務友軍的治療、防護及打斷；前者保護王座，後者限制 Arcanists。','準備解致盲、加速與持續輸出，縮短南方三隊的處理時間。'],
'after':'完成後傳送至 Augury Rock（占卜之石）據點。若另兩項試煉尚未完成，先補乾枯河流與伊洛那流域；三試煉先後不限。'},
16:{'steps':[
('整理隊伍與士氣','從起點前往競技區；沿途五名 Sand Giants 各提供 2% 士氣，可依需要擊杀，並非通關必要目標。與 Ghostly Hero 交談進入第一區；擔心他被殺，可再次交談讓他留在安全處。'),
('第一區先斷復活','第一區只有 Goss Aleessh 的隊伍。計時每到兩分鐘整點，仍存活的 Enemy Priest 會復活所屬陣亡敵人；先清阻路的敵人再集中擊殺祭司，最後清頭目與剩餘敵人。'),
('第二區分兩隊處理','下一區有 Issah Sshay 與 Hessper Sasso 兩队。先在新開的門旁等巡邏靠近，避免同時開戰；貼左側可降低引到另一隊的機會。每清完一隊，確認兩分鐘復活節點再攻下一隊。'),
('第三區立即救國王','進入最終區域後，右側 Custodian Hulgar 隊會攻擊 King Khimaar。立刻派英雄或隊伍保護國王，先清中央威脅，別把左側及中央其餘兩隊也拉過來。'),
('分別攻破最後三隊','保持國王安全，逐隊殺祭司及頭目。Josso Essher 隊有兩名治療者，需用打斷、暈眩或集火壓住補血，避免被拖過復活節點。其餘實際頭目為 Custodian Phebus 與 Custodian Hulgar。'),
('十分钟內完成最終區','Bonus 要求 King Khimaar 存活，且最終區開始後 10 分鐘內清光。全關六隊均被消滅即完成；別只殺六名頭目而漏掉祭司或雜兵。')],
'bonus':['進入最後一區立刻救 King Khimaar，右側敵群會主動攻擊他。','10 分鐘內清完最後三隊；超時國王會離開。防止復活敵軍重新轉向國王。','不要按舊 Objectives 的 Lyssha Suss／Kesskah Shissh 名稱找怪；實際隊長是 Custodian Phebus／Custodian Hulgar。'],
'hm':['敵方新增打斷與拆加持，巡邏速度也較快；最終區救國王必須更快，後排不要停在兩隊巡邏交會處。'],
'warning':['Ghostly Hero 死亡使主線失敗，King Khimaar 死亡使 Bonus 失敗。','祭司存活時每兩分鐘整點復活敵軍；無法及時擊殺就先撤離，避免復活群把隊伍包住。'],
'team':['帶單體集火與反治療／打斷，處理 Enemy Priest 及 Josso Essher 雙補隊。','治療者要能補友軍，並帶解降咒、近戰減傷或致盲應付巡邏。'],
'after':'完成後回到 Augury Rock（占卜之石）據點。確認絕望沙丘、乾枯河流、伊洛那流域三試煉全完成後再進行單人飛昇。'},
17:{'steps':[
('拿第一塊水晶先做第一座墓','起點向 Ghostly Priest 取得 Crystal Shard。先帶到起點東側、兩隻 Dune Burrowers 後的墓地喚醒第一位 Ritual Priest，再往西北找 Ghostly Hero。'),
('避開地雷及巡邏','山谷有 Minotaur 大隊與 Splinter Mines。地雷週期造成殘廢、流血，觸摸核心可移除，但當次已啟動的效果仍可能發作；撿起後立刻離開範圍。'),
('交第一塊開始三十分鐘','向 Ghostly Hero 交水晶後過場開始 30 分鐘倒數。往南方兩道門時優先走較南側的一道，較容易避開兩支巡邏的交會。'),
('取東側水晶並喚醒第二位','過橋逐群清怪，穿越兩名頭目所在區域取得東側水晶。先持水晶到大岩石後的 Ritual Priest 墓地，確認鬼魂被喚醒，再決定送回或由第二名真人攜帶繼續前進。'),
('取西側水晶與第三座墓','走兩處水晶之間的隱藏小路往西，到隨機頭目後拿最後水晶。撿起會生成兩組 Forgotten，先準備接戰。第三座墓位於西側水晶北方、庭院西北，持任一水晶靠近即可喚醒。'),
('確認三鬼魂再交最後一塊','三名 Ritual Priests 只需被喚醒，不要求護送存活；但三塊水晶一旦交齊，任務立即結束。因此先確認 Bonus，再於倒數內把兩塊剩餘水晶送回 Ghostly Hero。')],
'bonus':['任一 Crystal Shard 都可喚醒任一墓地，不需要指定配對。','依圖先處理起點東側，再處理巨石後與西側水晶北方的墓地。','三名鬼魂會自行走路及戰鬥，其生存不影響 Bonus；交齊三塊水晶前須已喚醒三名。'],
'hm':['仍為交第一塊後 30 分鐘；有足夠時間逐群拉怪。更應先清巡邏再撿西側水晶，避免與新增兩隊同時交戰。'],
'warning':['最後一塊交付會立刻結束，不能之後才補第三座墓。','Ghostly Hero 仍可能被靠近的敵人殺死；不要將追兵帶回交付點。'],
'team':['帶解殘廢與治療，對付地雷及 Hamstring；搬運者可準備加速。','準備反施法控制 Forgotten Sages，單人帶英雄時接受逐顆往返，不必硬趕時間。'],
'after':'完成後到 Augury Rock（占卜之石）據點。三試煉全部完成後，找 Great Ritual Priest Zahmut 開始單人飛昇。'},
18:{'steps':[
('先完成三項試煉','先完成絕望沙丘、乾枯河流、伊洛那流域。到 Augury Rock 據點找 Great Ritual Priest Zahmut；未完成三試煉雖可進區域，卻無法啟動所需符文。'),
('進場前調整技能','這是單人關，不能帶英雄。Doppelganger 複製你的技能列，所以不要帶會讓它反覆自補的一般治療技能。可利用攻擊懲罰、無法使用的寵物技能或自己較會運用的技能組合，空格可以留空。'),
('啟動三符文','進場後先踩取得 Divine Fire 的圓形平台，再依任意順序踩三塊飛昇符文石，觸發開岩壁過場及決鬥。'),
('依職業利用 AI 弱點','例如幻術可只攜 Empathy，施放後停止普通攻擊並維持降咒；遊俠可用寵物與寵物專用技能，分身沒有寵物；祭祀可在過場後退上斜坡，於敵方靈體射程外布自己的靈體，等分身追上來。這些是可選策略，依已學技能選擇。'),
('掌握 Bonus 時限','NM 必須 10 分鐘內、HM 必須 2 分鐘內擊敗分身。若自己也中攻擊懲罰，不要互相無腦普攻；利用移動、技能時機及 AI 浪費施法的空檔完成。')],
'bonus':['決鬥開始後計時，NM 10 分鐘、HM 2 分鐘內擊殺 Doppelganger。','進場前選好能利用 AI 弱點的技能，不要帶完整泛用補血列把戰鬥拖長。'],
'hm':['分身由 NM 20 級提升為 HM 30 級，Bonus 從 10 分鐘縮短至 2 分鐘。攻擊懲罰可利用其攻速，但必須確保自己能承受攻擊。'],
'warning':['分身能使用十週年菁英技能，不能籠統認為所有 PvE 技能都無法複製。','缺任何一項沙漠試煉就不能啟動符文；單靠進入據點不代表已解鎖飛昇。'],
'team':['只能單人。使用符合自己主副職業且已學會的反擊／寵物／靈體方案；不要求唯一 Build。','準備最高護甲與適合的武器；遠距離對手使用矛、近身改用閃電斧。'],
'after':'擊敗分身完成飛昇後傳送至 The Dragon\'s Lair（龍穴）。組成 8 人隊再開始下一關。'},
19:{'steps':[
('開門與生命流失區','與 Forgotten Gate Keeper 交談開第一道門。依序經過六個職業房間，每房殺 Facet 後走傳送門。第一房持續生命減少，沿左側推進，先清補師型 Forgotten Sages，再以拆加持或打斷處理 Facet of Light。'),
('移動減速區','第二房全區減速；高台弓手可用長弓引到低處。Facet of Nature 使用 Melandru\'s Resilience，不要用無關痛癢的狀態持續幫它回血，或準備移除姿態。'),
('混沌區與能量流失區','第三房蜘蛛會拆加持，幻術敵人隔晶牆施法；先用非投射技能處理再前進。第四房持續扣能量，敵人死亡爆炸會造成傷害及毒，避免全隊站在屍體堆旁一起吃爆炸。'),
('元素區與力量區','第五房不要站在環境法術範圍內戰鬥。第六房每 25 秒全員會倒地 5 秒，帶防擊倒或提前防護；優先清能利用倒地追加伤害的 Crystal Guardians，再殺 Facet of Strength。'),
('見到 Glint 先決定 Bonus','到達 Glint 已取得主線信用，最後傳送門會帶全隊離開；想打 Bonus 就不要有人走進去。先補滿、布置隊伍，再撿 Dragon Egg 使 Glint 敵對。'),
('分散應對 Glint','Crystal Haze 妨礙施法，需解降咒並分散。Jagged Crystal Skin 對物理攻擊反擊，近戰停止硬打或拆姿態／改元素傷害。Crystal Hibernation 有長施法，應打斷；已生效則停火，避免傷害變成治療。擊敗 Glint 即取得 Bonus。')],
'bonus':['到 Glint 房間後先不進最後傳送門，拾取任一 Dragon Egg 觸發敵對。','帶解降咒、姿態移除與技能打斷。Crystal Hibernation 生效期間不可持續輸出幫她回血。','即使挑戰 Glint 全滅仍保留主線完成，並被送到 Droknar\'s Forge；但未殺 Glint 不會獲 Bonus。'],
'hm':['房間順序不變。第三房隔牆施法者與第六房的 Crystal Guardian／全體倒地組合更危險，先清控制與爆發來源。'],
'warning':['每房傳送會留下原地靈體與部分召喚盟友，進新房要重新布置。','任一隊員走入 Glint 的出口傳送門會帶隊離開，事先協調是否挑戰 Bonus。'],
'team':['需要群體治療、能量管理、防擊倒與解降咒，處理各房環境效果。','Bonus 加入姿態移除及可打斷技能的控制；遠距離站位減少反擊壓力。'],
'after':'離開 Glint 的最後傳送門後到 Droknar\'s Forge。後續主線 Seeking The Seer 帶往南方山區，前往悲傷冰谷據點。'},
20:{'steps':[
('先停投石機','開始沿冰河處理投石機工程師，殺工程師可停止炮擊並獲士氣。第二座投石機的發射桿可觸發 Dolyak 衝撞，破壞橋對面的弩炮與敵群。'),
('炸門進洞與 Bonus','往北拿 Dwarven Powder Keg，放在封門旁炸開。洞穴西南出口通 Bonus 支路，需額外兩桶火藥，炸開 Rornak Stonesledge 的囚室並聽取訊息；按原圖核對，附近另一扇門不是目標。'),
('先清救援與撤退路','從東或東南出口到 Mursaat 巡邏區，囚室在南邊。未完成護甲 infusion 的玩家避免正面硬吃 Spectral Agony；可用英雄或寵物承受。HM 建議在放出 Evennia 前清好撤退路並炸開後門。'),
('救出 Evennia','用火藥炸開 Evennia／Saidra 囚室。Saidra 依劇情犧牲，無法挽救；任務後半必須保住 Evennia，再取火藥炸開逃生門，穿短洞到冰湖。'),
('處理追兵與第二個 Bonus NPC','出洞會啟動兩隊 Mursaat Elementalists 追來。安全做法可先退回洞口，讓其通過並清道路敵人，保持安全距離；利用投石機炮擊區削弱它們。避免 Evennia 的跟隨對象負責拉怪。把 Rornak 的訊息傳給 Hamdor Grandaxe 完成 Bonus。'),
('護送登船','沿彎曲冰湖道路逐群處理剩餘阻路敵人及 Mursaat，不要留下會威脅 Evennia 的追兵。到 Deldrimor 的冰船，Evennia 上船後任務完成。')],
'bonus':['先炸開原圖 Rornak Stonesledge 囚室，交談取得訊息，再到 Hamdor Grandaxe 處回報；兩者可以逆序開始。','通往 Rornak 的 Jade Constructs 無法全部迴避，未 infusion 者以英雄／寵物承受 Spectral Agony，逐隻擊殺。','Hamdor 洞口前的 Mursaat 可等巡邏走過再接近。首次能力不足可先過主線，下一關 infusion 後回來補 Bonus。'],
'hm':['在救 Evennia 前先炸後門、清冰湖撤退線，雖需折返但更能保護她。不要讓護送 NPC 承受 Mursaat 的 Spectral Agony。'],
'warning':['Evennia 死亡立即失敗；Saidra 的劇情死亡不是可避免的失敗點。','不要把十二名 Mursaat 同時拉進來；利用巡邏分隊與炮擊區。'],
'team':['帶可治療友軍的治療者及反施法控制；英雄與寵物可協助承受 Spectral Agony。','範圍控制、靈體或召喚物能分擔追兵壓力，搬火藥時由其餘隊員清路。'],
'after':'完成後傳送至 Iron Mines of Moladune（莫拉登礦山）。下一關可透過 Ancient Seer 為當前穿著護甲 infusion。'},
21:{'steps':[
('先穿好要 infusion 的護甲','進場前換上準備長期使用的護甲。沿冰河往北，避開互打的 Stone Summit 與 White Mantle 大群；第二處戰場往東繞，不需清光。'),
('先找 Seer 不接追捕','暫不與路邊 Shining Blade Scout Ryder 接 Bonus。過橋往西北清 Azure Shadows，到原圖 S 的 Seer 觸發過場。'),
('取得精華並逐人交談','去原圖 E 殺 Eidolon，拿 Spectral Essence 回 Seer。每名玩家都要交談確認自己目前穿著的護甲已 infusion；這是裝備狀態，不是整個帳號永久保護。'),
('清 Bonus 逃跑路線','沿 Seer 北方通道接近 Markis，但先不要結束戰鬥。往南找 Ryder，預清她到橋與傳送點之間的 Mursaat，讓隊伍先在 The Inquisitor 出生的門外斜坡等候。'),
('接任務立即攔截','由一名玩家回去和 Ryder 交談，The Inquisitor 與護衛才會生成並往北逃。以減速、擊倒及集火攔截，不能讓它走到 Mursaat 傳送點。'),
('擊殺 Markis 及四名護衛','Bonus 完成後回 Markis，殺他與四名 Jade Armor 結束。想捕捉 Barrage，先殺 Markis 並保留至少一名護衛，完成捕捉後才清最後敵人。')],
'bonus':['Ryder 必須活著才能接任務；接受後才生成 The Inquisitor，勿還沒準備好就對話。','先清路、布好隊伍，再單人回去接。The Inquisitor 抵達北方傳送點前必須擊殺。'],
'hm':['路線與事件相同，敵人更強；建議先 infusion，再清出完整攔截區。減速與擊倒可避免高壓追逐變成連續引怪。'],
'warning':['Infusion 只套用目前穿著的護甲，換一套不會自動繼承。','殺光 Markis 及四名護衛即結束，捕捉菁英與 Bonus 必須先做。'],
'team':['帶治療、防護、減速及擊倒，分別處理 Mursaat 與逃跑的 Inquisitor。','未 infusion 時先由英雄或寵物承受 Spectral Agony，不要全隊直接衝過 Mursaat。'],
'after':'完成後傳送至 Thunderhead Keep（雷雲要塞）。先確認每名玩家穿著的護甲已完成 infusion，再進行要塞防守。'},
22:{'steps':[
('跟國王進城','與 King Jalis Ironhammer 交談開門，他會跟著第一位對話玩家。過橋往西北，先把橋頭敵群引回殺掉，避免和後續巡邏重疊。'),
('到東門再攻堡壘','帶國王到城市東側門，讓他開門。進堡壘擊敗 Dagnar Stonepate 與各組守軍，注意國王生命。西側敵群倒下、國王宣告開戰後，攻城事件開始。'),
('立刻點亮兩側信標','堡壘清完的過場後，用東、西兩側各自的 Enchanted Torch 點亮 Storm Beacons。約一分鐘內完成最穩；單人點完一側就丟下火把，到另一側用當地火把，不要搬著跑全程。'),
('集中樓梯口防守','單人帶英雄可在國王前方樓梯上方稍微分散，讓兩側入侵者匯集後集火。別把敵人引到國王本人身上，也別追出大門讓另一側漏怪。'),
('按波次清掉所有援軍','先是 Stone Summit 與 Jade，接著 White Mantle 與 Mursaat，最後 Confessor Dorian 帶隊。波次推進取決於特定頭目隊全滅，別漏掉遠处卡住的成員；可操作城牆弩炮削弱來敵。'),
('確認清空後回報','擊殺 Confessor Dorian 的整隊，國王頭上出現任務標記後交談完成。Bonus 此時一併結算，並非點火當下立刻顯示完成。')],
'bonus':['宣告開戰後約一分鐘內點亮東、西兩側信標，使城外矮人不被殺。','每側已有自己的火把；多人可各分一側，單人別帶著火把跨堡壘拖慢移動。','城外矮人死亡的喊話表示失敗；沒有喊話只屬間接指標，最後與國王交談時才正式結算。'],
'hm':['流程相同，但必須持續檢查國王血量並解除他的降咒。七英雄可集中防守，不必硬拆成兩支不完整的小隊。'],
'warning':['國王死亡失敗；開戰後忘記點燈會失去 Bonus。','最後一波清完仍要與國王對話；少一隻敵人可能讓任務標記遲遲不出現。'],
'team':['帶友軍治療、解降咒、防擊倒及範圍傷害；樓梯口集中敵群時特別有效。','靈體／召喚物能分擔防線，但要讓補師保留國王射程。'],
'after':'完成後經傳送門到 Ember Light Camp；接續主線 Final Blow 開啟 Ring of Fire（火環群島）據點。'},
23:{'steps':[
('北進並分開塔與守衛','Brechnar Ironhammer 會依劇情犧牲，無須為救他衝進大群。往北逐群處理 Mursaat；遇能量吸取塔，先把 Jade Bows 引到塔外，再拆 Ether Seal 停止效果。'),
('分岔先接 Bonus','第一座塔後往西北，過 Ettin 頭目到分岔。先取北路找 Ancient Seer 接 Bonus，再回南路推主線。未接任務即使拆塔也不會生成 Eidolon。'),
('正門逐座拆塔','過熔岩要迅速走到乾地再戰鬥。可選正門路線：先引出守軍，拆門外兩座塔；進門前再清巡邏，避開門內兩塔疊加的扣能區。'),
('處理內側兩塔','內塔封印朝背面，可先清後方 Mursaat，再繞到封印側拆塔。不要同時承受多塔扣能、拆加持與守軍攻擊；補師站塔外維持支援。'),
('先帶精華回 Seer','四座要塞塔全停用且已接 Bonus 後，Eidolon 才出現。擊殺取得 Spectral Essence，返回 Ancient Seer 交付取得 Bonus，也可做護甲 infusion。'),
('開主門後完成','回堡壘拆通往拉桿的封印、殺守衛頭目，操作主門拉桿。過 Jade bridge 清最後頭目與小隊即完成；要捕捉菁英先留一名雜兵。')],
'bonus':['先找北方分岔 Ancient Seer 接任務。','拆 Citadel Guardhouse 四座塔，擊殺生成的 Eidolon，攜 Spectral Essence 回 Seer 交付；不是只殺 Eidolon。'],
'hm':['塔的能量消耗讓施法隊更難續戰；用紋章、怒氣或塔外靈體輸出，補師站範圍外。背門繞路有密集 Lava Imps 與 Meteor Shower，並不一定較安全。'],
'warning':['熔岩內不要停下戰鬥；塔區別同時拉多隊。','未接 Seer 對話不能生成 Bonus 目標，最後敵群全滅又會立刻結束。'],
'team':['帶不高度依賴能量的輸出、群體治療及姿態移除，對付能量塔和 Jade Bows 格擋。','全員檢查 infusion，並準備打斷元素敵人的範圍法術。'],
'after':'完成後傳送至 Abaddon\'s Mouth（地獄隘口）據點，下一關要破壞 Door of Komalie 的六個封印。'},
24:{'steps':[
('拆外門前先清牆上敵人','由堡壘外往入口，先處理牆上的守軍，再把 Jade Bows 引離 Ether Seal。逐群殺 Mursaat，拆 Onyx Gate 兩側封印開門，不要直接衝入多隊聚集處。'),
('先清 Bonus 護送道路','準備做 Bonus 時，先沿島嶼北側通往西側小島的海岸路清怪。包含 Eidolon 後方的隱藏敵群、Dryders、Crag Behemoths 與 Wurms；先走一遍觸發，確認沒有寶箱擋在護送路徑。'),
('放出 Leah 並慢慢護送','回碼頭附近摧毀生成 Leah Stone 的 Ether Seal。她走固定路，離雷達範圍會停下；離堡壘後移動變慢。經熔岩會燃燒，停下治療、回復後再繼續，到西側安息地完成 Bonus。'),
('逐門打上火山口','回主線穿 Onyx Gate，再拆三道門的封印。每兩名頭目先引離封印範圍分開處理；Vizier 的 Chimera of Intensity 只持續短時間，不要把它當常駐防護。'),
('六個封印一次打一個','到 Door of Komalie 平台後，每破一個封印會生成四名 Seal Guards，另有南北 Mursaat Guardians 加入。先清當輪敵人、補能量，再拆下一個，避免六輪敵人同時出現。'),
('擊敗最後 Titan','第六個封印破壞後過場，中央生成 Burning Titan。讓事件進入戰鬥後擊殺完成；Wiki 記有過快擊殺偶發失敗，別在它剛生成的瞬間預先灌滿爆發。')],
'bonus':['碼頭附近 Ether Seal 破壞後 Leah Stone 才出現。HM 建議先完整清護送路再放她。','保持雷達距離，過熔岩後補血，清完所有會在她固定路線上出現的敵人。','她到西側小島的安息地才算完成；若道路被寶箱堵住可能無法完成，要先檢查。'],
'hm':['Leah 特別脆弱，必須先清路；六封印生成的 Seal Guards 為 20 級，仍以逐封印清場方式處理。'],
'warning':['Leah 死亡失去 Bonus；不要靠隊伍加速假設她會跟上。','六個封印同時拆會把所有增援疊在一起，容易全滅。'],
'team':['帶友軍治療、防護及持續範圍傷害，保護 Leah 並處理固定封印。','打斷／暈眩對 Hydra 與施法頭目有效；加速用於清路後的折返。'],
'after':'完成後傳送至 Hell\'s Precipice（地獄懸崖），準備最終戰及三名 Armageddon Lords 的 Bonus。'},
25:{'steps':[
('用橋口逐群清怪','起點往南過兩座橋，站橋口拉怪而非在橋上被包圍。優先擊殺 Spark of the Titans，其火焰範圍法術比普通 Titan 更危險。每殺一隻會分裂的 Titan，先處理其衍生敵人再開下一隻。'),
('等大隊移走再救 Seer','第二橋後分岔會有大群敵人朝生成的頭目聚集；等其走遠，走東南路避開。再從北側接近 Ancient Seer，立刻殺攻擊它的 Burning Titan 並治療它，交談接 Bonus。'),
('西南推進到傳送門區','繼續往西南，避免站地面裂縫受燃燒。過第三座橋進傳送門空地，耐心將相互重疊的巡邏一次引一兩隊出來，別直接衝中央。'),
('先殺三名 Armageddon Lords','到傳送門前大熔岩池，把三名 Armageddon Lords 逐一引到乾地。殺掉其衍生敵人並確認 Bonus；Ancient Seer 必須先獲救及對話，不可只自行殺三名目標。'),
('關閉三個門並擊敗 Rurik','擊殺守門的三名 Portal Wraiths 使傳送門關閉，過場帶往北側。先把 Undead Prince Rurik 及两名 Spark 引離旁邊 Titan 群，優先殺 Spark，再擊殺 Rurik 觸發最後過場。'),
('Lich 復活時先清增援','英雄旗標放中央 Bloodstone，避免追入熔岩。Lich 會傳送玩家到熔岩、自己瞬移並復活 1–3 次；每次復活先清伴生的兩隻 Fists，再重新集火。依 Wiki 機制不必限定在 Bloodstone 上擊殺。'),
('領取通關獎勵','完成後進 Droknar\'s Forge 的探索區，與 Jalis Ironhammer 交談領取每角色一次的 Deldrimor Talisman，可兌換一件獨特武器；後續再選 Defend Droknar\'s Forge 等終局內容。')],
'bonus':['Ancient Seer 活著且已與它交談，才啟動殺三名 Armageddon Lords 的 Bonus。','先把三名目標從熔岩池逐一引出，殺掉後處理衍生怪。','建議關傳送門前完成；提前關門會把隊伍傳走，補做需多次折返。'],
'hm':['路線相同，但 Spark 的範圍火傷、Titan 分裂與 Lich 增援更難承受。分散後排、打斷火法、一次處理一隻分裂鏈，避免讓多組 Fists/Hands 同時形成。'],
'warning':['Seer 死亡不能靠事後殺三名 Lords 補拿 Bonus。','不要讓英雄追 Lich 到熔岩；被傳入熔岩的玩家立即回乾地。'],
'team':['帶群體治療、防元素傷害、打斷或暈眩，優先控制 Sparks。','冷傷對 Titan 較有效，範圍虛弱可減少 Fists/Hands 傷害；多數 Titan 沒有血肉，不能只依賴毒、流血或屍體召喚。'],
'after':'通關後到 Droknar\'s Forge（探索區），向 Jalis Ironhammer 領取一次性的 Deldrimor Talisman。這是本章主線結尾；後續為 Defend Droknar\'s Forge 與其他終局支線。'}
}

startAreas={2:'Regent Valley',3:'Eastern Frontier',4:'Diessa Lowlands',5:"Traveler's Vale",6:'Anvil Rock',8:'North Kryta Province',10:'Sage Lands',11:'Silverwood',12:"Ettin's Back",13:'Twin Serpent Lakes',14:'Stingray Strand',15:'Vulture Drifts',16:'The Scar',17:"Diviner's Ascent",20:'Talus Chute',21:'Frozen Forest',22:'Ice Floe'}
bonusTitles={2:'救出 Trooper Deeter Saberlin',3:'進入神殿並消滅四名 Flame Keepers',4:'把 Tome of the Fallen 送回墓園',5:'擊殺洞內 Ice Drake',6:'取回攻城武器圖紙',8:'完整送達 Offering to Melandru',10:'擊殺兩名指定半人馬酋長',11:'喚醒四名 Druids 並與 Elder Druid 交談',12:'先與 Less 交談再擊殺 Demagogue',13:'清除九座監視塔的 Watchmen',14:'護送 Restless Spirit 到安息地',15:'時限內擊敗南方三名將軍',16:'保護 King Khimaar 並於十分鐘內清場',17:'以水晶喚醒三名 Ritual Priests',18:'限時擊敗 Doppelganger',19:'擊敗 Glint',20:'傳遞 Rornak 的消息給 Hamdor',21:'攔截並擊殺 The Inquisitor',22:'及時點亮兩側信標',23:'交付 Eidolon 的 Spectral Essence',24:'護送 Leah Stone 到安息地',25:'擊敗三名 Armageddon Lords'}
proper={'諾拉尼學院':'若拉尼學院','冰門':'寒霜之門','柯瑞塔關所':'科瑞塔之門','極光林地':'歐若拉林地','聖者安息地':'神聖沙灘','預言之石':'占卜之石','乾渴之河':'乾枯河流','巨龍巢穴':'龍穴','悲傷冰窟':'悲傷冰谷','亞巴頓之口':'地獄隘口','地獄險境':'地獄懸崖'}
# Remove unverified historical transliterations from reused prose; the game archive audit can supply them later.
proper.update({'卡爾漢軍官':'Captain Calhaan','卡爾漢':'Captain Calhaan','基爾恩・泰斯布里':'Kilnn Testibrie','阿爾敏':'Master Armin Saberlin','洛馬爾':'Siegemaster Lormar','迪特':'Deeter Saberlin','魯瑞克':'Prince Rurik','瑞恩城':'Rin','號角山':'Horn Hill','國王賈利斯':'King Jalis Ironhammer','牦牛村':'Yak\'s Bend','畢肯高地':'Beacon\'s Perch','寬容神殿':'Temple of Tolerance','多里安':'Confessor Dorian','迪納斯':'Dinas','梅蘭朵':'Melandru','詹瑟之眼':'Eye of Janthir','夏摩爾':'Shaemoor','真實之泉':'Fountain of Truth','德魯伊高地':'Druid\'s Overlook','喧鬧瀑布':'Quarrel Falls','丹拉維巨石陣':'Henge of Denravi','安努恩绿洲':'The Amnoon Oasis','維齊爾':'Vizier Khilbron'})
def clean(s):
    for a,b in sorted(proper.items(),key=lambda x:-len(x[0])):s=s.replace(a,b)
    for a,b in {'会':'會','从':'從','桥':'橋','错':'錯','标记':'標記','出现':'出現','复活':'復活','没有':'沒有','结束':'結束','护卫':'護衛','领':'領','杀':'殺','敌':'敵','后':'後','门':'門','还':'還','让':'讓','侧':'側','过':'過','别':'別','为':'為','给':'給','与':'與','清场':'清場','分钟':'分鐘','关':'關','远':'遠','绿':'綠','虽':'雖','较':'較','时':'時','发':'發','带':'帶','来':'來','个':'個','导':'導','画':'畫','确认':'確認','检查':'檢查','结束':'結束','击':'擊','处':'處','队':'隊','两':'兩','补':'補','压':'壓','伤':'傷','挡':'擋','稳':'穩','称':'稱','则':'則','灵':'靈','态':'態'}.items():s=s.replace(a,b)
    return s
for p in sorted((ROOT/'src/data/prophecies/missions').glob('*.json')):
    m=json.loads(p.read_text(encoding='utf-8'));n=m['order']
    if n in legacy and n not in [1,7,9]:
        old=legacy[n];m['walkthrough']=[{'title':clean(a),'content':clean(b)} for a,b in old['steps']]
        m['summary']=clean(old['summary']);m['routeSummary']=clean(old['route']);m['bonus']['steps']=[clean(x) for x in old['bonus']]
        m['modeDifferences']={'normal':['依上方步驟先完成可錯過的 Bonus，再觸發最後主線事件；沿圖逐群清路。'],'hard':[clean(x) for x in old['hard']]}
        m['tips']=[clean(x) for x in old['notes']];m['afterCompletion']=[m['tips'][-1]]
        m['warnings']=[clean(old['bonus'][0]),clean(old['hard'][0])]
        m['recommendedTeam']=['帶能治療任務友軍的治療者與復活手段；四至六人隊避免全部只帶輸出。',clean(old['hard'][-1])]
    elif n in D:
        d=D[n];m['walkthrough']=[{'title':clean(a),'content':clean(b)} for a,b in d['steps']];m['bonus']['steps']=[clean(x) for x in d['bonus']]
        m['modeDifferences']={'normal':['按上方逐區流程推進，先做 Bonus 再觸發通關；隊伍需預留治療及復活能力。'] if n!=18 else ['單人擊敗分身；Bonus 為 10 分鐘內完成。'],'hard':d['hm']}
        m['warnings']=d['warning'];m['recommendedTeam']=d['team'];m['afterCompletion']=[d['after']];m['tips']=[d['after']]
        m['routeSummary']=' → '.join(a for a,b in d['steps']);m['summary']=bonusTitles[n]+'；詳見下方分段路線與主線完成條件。'
    else:
        m['afterCompletion']=[next((s for s in m['tips'] if '通關' in s or '完成後' in s),'')]
    if n in bonusTitles:
        m['bonus'].update(title=bonusTitles[n],summary=bonusTitles[n],trigger=m['bonus']['steps'][0],completion=m['bonus']['steps'][-1])
    if n in startAreas:
        m['entryMethod']['description']=f"從 {startAreas[n]} 進入 {m['name']['en']} 任務據點，組隊後按 Enter Mission。前後主線接續見本頁『打完去哪』與任務鏈。"
        m['entryMethod']['location']=m['name']['en']+' 任務據點'
    elif n==18:m['entryMethod'].update(type='npc',location='Augury Rock',description='完成三項沙漠試煉後，與 Great Ritual Priest Zahmut 交談，單人進入符文區。')
    elif n==19:m['entryMethod'].update(description='完成占卜之石後自動到達本據點，組成 8 人隊按 Enter Mission。',location="The Dragon's Lair")
    elif n==23:m['entryMethod'].update(description='從 Ember Light Camp 完成主線 Final Blow 開啟 Ring of Fire 據點，再按 Enter Mission。',location='Ring of Fire')
    elif n in [24,25]:m['entryMethod'].update(description='完成上一關後自動到达本據點，整備後按 Enter Mission。',location=m['name']['en'])
    m['mapNotes']=['原圖保留 Wiki 的英文標記與編號，可放大後搭配本頁步驟。']+(['本關原圖為場景俯瞰，沒有畫出玩家行走路線。'] if n==18 else [])
    m['storyStartVerified']=n==1;m['storyEndingVerified']=n==25
    m['contentStatus']='incomplete';m['status']='draft'
    m['todos']=['逐筆核對 NPC、技能與地區繁中名稱及遊戲字串 ID。','補齊並核對所有重要 Boss 的技能與逐一對策。','核對獎勵各模式及前後 Primary Quest 的 NPC、地點。']
    if n==1:
        m['maps'].sort(key=lambda x:'western_cartographer' in x['src']);m['mapImage']=m['maps'][0]['src'];m['maps'][0]['title']='主線與 Bonus 路線圖';m['maps'][0]['role']='main_route'
        for x in m['maps'][1:]:x['title']='製圖探索支路（不是主線撤退路線）';x['role']='cartography'
    p.write_text(clean(json.dumps(m,ensure_ascii=False,indent=2))+'\n',encoding='utf-8')
print('25 missions now have walkthrough, Bonus instructions, NM/HM and after-completion text. Completion NOT asserted.')
