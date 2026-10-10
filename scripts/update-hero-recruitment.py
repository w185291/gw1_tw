"""Curated recruitment summaries backed by cached GWW revisions and client name IDs."""
from pathlib import Path
import json,re,csv
ROOT=Path(__file__).resolve().parents[1]
PAIRS=Path(r'C:/Users/roger/Documents/激戰/攻略研究/game-extraction-20261009/text-pairs.json')
pairs=json.loads(PAIRS.read_text(encoding='utf-8'))
def key(s):return re.sub('[^a-z0-9]+','-',s.lower()).strip('-')
def source(title):
    a=json.loads((ROOT/'docs/reference/completeness'/f'{key(title)}.json').read_text(encoding='utf-8'))
    return {k:a[k] for k in ['title','url','revision','checkedAt']}|{'role':'mechanics'}
rows=[
('Olias','prophecies','死靈法師',[
 '帳號須同時擁有阿斯卡隆戰記與黑暗逆襲。在領事館碼頭找任務 NPC Dinja 接 All for One and One for Justice。',
 '到獅子拱門碼頭找獅子守衛 Lionguard Figo，由他送入血石沼澤的任務副本；先與 Olias 對話，讓他隨行。',
 '沿任務路線逐群清除植物、山怪與白斗篷，不要讓 Olias 死亡。到血石處等對話結束，再攻擊 Erulai the Inimical。',
 '對手低血量後會觸發新對話與三隻惡魔；擊敗惡魔，回卡瑪丹找書記 Clerk Arlon 領獎，Olias 才正式加入。團滅不會在復活神殿重生。'],['All for One and One for Justice']),
('Zenmai','factions','刺客',[
 '帳號須同時擁有盟與敵與黑暗逆襲。在領事館碼頭找 Dinja 接 Chasing Zenmai。',
 '前往凱寧中心，依任務目標與帝國守衛 Imperial Guardsman Linro 交談；離開到 Bukdek Byway 找 Zenmai。',
 '與 Zenmai 對話後往南進 The Undercity，沿任務指標找到 Lale the Vindictive，擊敗他與接續出現的安費敵人、惡魔。',
 '全程保護 Zenmai。戰鬥結束再與她對話，回卡瑪丹找書記 Clerk Arlon 領獎，完成招募。可用旗標讓隊伍先清怪，避免她衝入敵群。'],['Chasing Zenmai']),
('Ogden Stonehealer','eye-of-the-north','僧侶',['任一章出生角色都須擁有北方之眼，角色至少 10 級。從獅子拱門、凱寧中心或卡瑪丹的北方之眼入口任務進入地下。','完成 The Beginning of the End 的地下逃離流程；跟隨矮人與阿蘇拉離開地下，首次抵達 Boreal Station 即解鎖 Ogden Stonehealer 與 Vekk。','解鎖後可在城鎮的隊伍英雄清單加入他；只在地下看到同伴不代表招募已完成。'],[]),
('Vekk','eye-of-the-north','元素使',['任一章出生角色都須擁有北方之眼，角色至少 10 級；先完成各首都的入口任務。','在 The Beginning of the End 中跟隨 Ogden Stonehealer 與 Vekk 逃離地下，首次抵達 Boreal Station 時自動解鎖兩位英雄。','不需要另解阿蘇拉分支。抵達據點後可在英雄清單加入 Vekk。'],[]),
('Gwen','eye-of-the-north','幻術師',['完成地下入口後，從 Boreal Station 經冰原前往北方之眼據點。','進入 Hall of Monuments，使用 Scrying Pool 觀看 The First Vision；首次觀看後解鎖 Gwen。','第一章崩壞前陪伴玩家的小女孩不是當時可配置技能的英雄。英雄版要由北方之眼上述流程取得，不需要先完成她的個人支線。'],[]),
('Jora','eye-of-the-north','戰士',['抵達北方之眼後進行北方盟友的諾恩分支，找 Jora 接 Tracking the Nornbear。','依任務指標追蹤熊人至 Drakkar Lake，進行 Curse of the Nornbear；完成追蹤本身還不會解鎖英雄。','完成 Curse of the Nornbear 並擊敗熊人後解鎖 Jora。她曾以盟友身分隨隊，與永久可加入隊伍的英雄是兩個階段。'],['Curse of the Nornbear']),
('Pyre Fierceshot','eye-of-the-north','遊俠',['走黑檀先鋒隊主線 The Missing Vanguard，先完成 Against the Charr，再依 The Dawn of Rebellion 前往營救戰團。','完成 Warband of Brothers 的救援與最終戰鬥，才解鎖 Pyre Fierceshot。','此英雄是夏爾遊俠；第一章出生並非前置需求，擁有北方之眼的各章角色都可依主線取得。'],['Warband of Brothers']),
('Livia','eye-of-the-north','死靈法師',['走阿蘇拉主線 The Knowledgeable Asura，進行 Finding Gadd，前往 Gadd\'s Encampment。','接續完成 Finding the Bloodstone 的地下城與末端戰鬥。','完成 Finding the Bloodstone 後 Livia 正式加入；Finding Gadd 階段的隨行 NPC 還不是已招募英雄。'],['Finding the Bloodstone']),
('Anton','eye-of-the-north','刺客',['先完成 The Missing Vanguard、救回先鋒隊，再向 Captain Langmar 接系列支線。','完成 Failure to Communicate：找 Anton、救 Scout Winslow；回報後接 The Imploding Past，清除夏爾戰團並追查仇人。','接 The Assassin\'s Revenge，從 Dalada Uplands 進 Sacnoth Valley，在入口附近會合 Anton。','往西找 Rend Ragemauler，等對話後先打九名護衛，尤其留意後排 Charr Seeker；再擊敗 Rend，向 Captain Langmar 領獎解鎖 Anton。'],['Failure to Communicate','The Imploding Past',"The Assassin's Revenge"]),
('Hayda','eye-of-the-north','聖言者',['到 Gadd\'s Encampment 找閃光之刃的 Bartholos，先接 Frogstomp。','進 Sparkfly Swamp 後在入口北方會合 Hayda，往北清掉三組蛙人，回 Bartholos 領獎，再接 Give Peace a Chance。','再次與 Hayda 會合；抵達白斗篷和平會談地點前先清附近敵人，靠近大使才會觸發敵對。','可先站東側，先打大使隊，再逐群處理共五組白斗篷；回 Bartholos 領獎，Hayda 加入。她倒下後附近無敵人時會自行復活。'],['Frogstomp','Give Peace a Chance']),
('Xandra','eye-of-the-north','祭祀',['到 Gunnar\'s Hold 找競賽主持 Magni the Bison，接 Round 1: Fight! 參加 The Norn Fighting Tournament。','這是單人競賽，帶自補、傷害與解盲等技能。Xandra 是第二回合七名隨機對手之一。','只要擊敗第二回合的 Xandra 就解鎖她，無須打贏整場競賽。沒遇到她時重新參賽；沒有固定場次保證。'],['The Norn Fighting Tournament']),
('Kahmu','eye-of-the-north','神喚',['到 Gunnar\'s Hold 找 Magni the Bison 接 Round 1: Fight!，參加單人的 The Norn Fighting Tournament。','Kahmu 是第四回合七名隨機對手之一，必須先贏前三回合。','帶自補、致盲或緩速來處理近戰；他會移除加持。擊敗第四回合的 Kahmu 即解鎖，無須贏最終回合；沒遇到就重試。'],['The Norn Fighting Tournament']),
('M.O.X.','core','神喚',['帳號必須同時擁有三個本篇章節；角色至少 10 級，背包至少空一格以接收 Golem User Manual。','三處任選一處：獅子拱門西北出口的 North Kryta Province；凱寧中心東南出口的 Bukdek Byway；卡瑪丹西北出口的 Plains of Jarin。','與門外的 M.O.X. 對話即可招募，無須先完成 Zinn\'s Task，也不需要北方之眼。每個角色要各自招募。'],[]),
('Devona','prophecies','戰士',['先啟用 Reforged Mode。已抵達獅子拱門的角色可直接找 Devona 接 The Hero From Ascalon 並完成招募；這是崩壞後的取得路線。','崩壞前第一章角色：Across the Wall → A Bastion In the North，進入崩壞前 Piken Square。再做 Long Thought Forgotten → Charr in the Tunnels → The Scourge Beneath。','最後一關從 Piken Square 北出口進地下；第一層擊敗 Wyle Brimscourge 拿鑰匙下樓，第二層向北通過水晶門，第三層擊敗 Maz Scourgeheart。','離開地下回 Piken Square 向 Devona 領獎解鎖她。首次冒險她是 5 級盟友，先保護她；崩壞前地下城路線只適用第一章出生角色。'],['Long Thought Forgotten','Charr in the Tunnels','The Scourge Beneath']),
('Ghost of Althea','prophecies','幻術師',['需啟用 Reforged Mode。先完成 The Duke\'s Daughter → Althea\'s Ashes，再到 The Breach 找 Ghost of Althea。外章角色能抵達 Piken Square 後也可進行。','依序完成 Elegy for Those Left Behind → The Cost of Survival，再向地下城 Tunnels of the Forsaken 的 Ghost of Althea 接 The Dreamer and the Zealot。','第一層往西北打強盜取得 Elemental Keystone，帶到水晶門下樓；她會在第二層會合並打開石門。擊敗 Enraged Phantom 拿 Boss Key，通過 Boss Lock。','末端先清被控制的蛙人；把 God-touched Grawl 打到低血量讓它轉為友軍，再擊敗 Varny the Zealot 與最後敵群。回 Ghost of Althea 領獎後解鎖英雄。'],['Elegy for Those Left Behind','The Cost of Survival','The Dreamer and the Zealot']),
('Keiran Thackeray','beyond','聖言者',['帳號須能進行第一章與北方之眼的相關內容。先完成 War in Kryta，再完成 Hearts of the North 系列。','從 Hall of Monuments 的劇情互動接續尋人、回憶與重聚流程，最後完成 The Wedding。','The Wedding 完成後才招募英雄版 Keiran Thackeray；英雄職業為聖言者，劇情中使用弓箭的遊俠版本不是招募後職業。'],[]),
('Miku','factions','刺客',['完成盟與敵主線後開始 Winds of Change 系列。','依序完成普通模式的整條 Winds of Change 任務鏈，直到 The Final Confrontation。','完成最後任務並領取獎勵後 Miku 加入；只在任務中與她同行不算招募。此英雄不需要黑暗逆襲或北方之眼。'],[]),
('Zei Ri','factions','祭祀',['先完成普通模式的 Winds of Change 系列，並解鎖盟與敵 Hard Mode。','再次進行困難模式的完整 Winds of Change 任務鏈，最後完成 The Final Confrontation (Hard mode)。','完成困難版本最後任務後才解鎖 Zei Ri。普通模式取得的是 Miku；Zei Ri 招募後為祭祀，任務中僧侶／祭祀技能組合不可誤當英雄主職業。'],[]),
]
for en,campaign,profession,steps,titles in rows:
    evidence=[(int(sid),p['zhTW']) for sid,p in pairs.items() if p['en']==en and p['zhTW']!=en and re.search('[\u4e00-\u9fff]',p['zhTW'])]
    values={v for _,v in evidence};zh=next(iter(values)) if len(values)==1 else en
    data={'id':key(en),'campaign':campaign,'name':{'en':en,'zhTW':zh},'profession':profession,'translationStatus':'verified' if evidence and len(values)==1 else 'needs-review','summary':steps[0],'native':steps,'foreign':[],'choiceGroup':None,'postgame':[],'requiredIn':[],'sources':[source(en)]+[source(t) for t in titles],'translationVerified':bool(evidence and len(values)==1),'translationSources':[f'game-client://2026-10-09/string/{sid}' for sid,_ in evidence]}
    (ROOT/'src/data/heroes'/f'{key(en)}.json').write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')

# Stable single-name pairs only; English fallbacks are not competing Chinese translations.
glossary=json.loads((ROOT/'src/data/terminology/game-client.json').read_text(encoding='utf-8'))
overrides=[]
for en,_,_,_,_ in rows:
    ev=[(int(sid),p['zhTW']) for sid,p in pairs.items() if p['en']==en and re.search('[\u4e00-\u9fff]',p['zhTW'])]
    if len({v for _,v in ev})==1:overrides.append({'en':en,'zhTW':ev[0][1],'stringIds':[sid for sid,_ in ev]})
(ROOT/'src/data/terminology/characters.json').write_text(json.dumps(overrides,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
terms={t['en'].lower():t for t in glossary}
for file in ['skills.json','characters.json']:
    for t in json.loads((ROOT/'src/data/terminology'/file).read_text(encoding='utf-8')):terms[t['en'].lower()]=t
hero_names={h[0] for h in rows}
correspondence=[]
for t in sorted(terms.values(),key=lambda t:t['en']):
    correspondence.append({'en':t['en'],'zhTW':t['zhTW'],'category':'hero' if t['en'] in hero_names else 'game-term','stringIds':t.get('stringIds',[]),'evidence':'game-client' if t.get('stringIds') else 'curated-skill-terminology'})
out=ROOT/'docs/reference/translation-correspondence.json'
out.write_text(json.dumps(correspondence,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
with (ROOT/'docs/reference/translation-correspondence.csv').open('w',encoding='utf-8-sig',newline='') as f:
    w=csv.writer(f);w.writerow(['English','繁體中文','分類','遊戲字串ID','證據'])
    for t in correspondence:w.writerow([t['en'],t['zhTW'],t['category'],','.join(map(str,t['stringIds'])),t['evidence']])
print('Hero catalog:',len(list((ROOT/'src/data/heroes').glob('*.json'))),'Translation correspondence:',len(correspondence))
