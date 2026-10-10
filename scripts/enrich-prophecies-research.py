from pathlib import Path
from lxml import html
import json,re
ROOT=Path(__file__).resolve().parents[1];CACHE=ROOT/'docs/reference/completeness'
def load(p):return json.loads(p.read_text(encoding='utf-8'))
def cached(title):
    p=CACHE/(re.sub('[^a-z0-9]+','-',title.lower()).strip('-')+'.json')
    return load(p) if p.exists() else None
inventory=load(CACHE/'prophecies-boss-inventory.json')
glossary={t['en']:t for t in load(ROOT/'src/data/terminology/game-client.json')}
# Profession names can be shorter than the inline glossary's minimum length.
for en,zh in {'Warrior':'戰士','Ranger':'遊俠','Monk':'僧侶','Necromancer':'死靈法師','Mesmer':'幻術師','Elementalist':'元素使'}.items():
    glossary.setdefault(en,{'en':en,'zhTW':zh})
def name(en):return {'en':en,'zhTW':glossary[en]['zhTW'] if en in glossary else en+'（繁中名稱待確認）'}
professions=['Warrior','Ranger','Monk','Necromancer','Mesmer','Elementalist','Assassin','Ritualist','Paragon','Dervish']
strategies={
'Warrior':'讓前排承受近戰，後排分散。若有範圍攻擊或擊倒，避免圍站；使用致盲、虛弱或格擋減少普通攻擊，再集中輸出。',
'Ranger':'靠地形阻擋投射物，避免後排同站吃範圍箭。若敵方開格擋姿態，使用移除姿態或非攻擊傷害；自我治療開始施放時打斷。',
'Monk':'先清護衛並集中攻擊治療者，用打斷或反治療限制補血。若敵方有防護加持，拆掉後才投入大招，避免分散輸出被逐一補回。',
'Necromancer':'保留解降咒與解除病症，減少持续失血。若有屍體利用技能，先集中擊殺並控制屍體；避免隊伍聚在會爆炸的屍體旁。',
'Mesmer':'後排分散，看到能量消耗或攻擊懲罰降咒就解除；打斷重要施法。物理隊不要頂著 Empathy 持續攻擊，施法者也不要在反法降咒下連續施法。',
'Elementalist':'後排分散，移出持續範圍傷害；優先打斷長施法，準備元素傷害減免及防擊倒。別站在同一處讓全隊同時承受爆發。'}
strategies.update({'Assassin':'用致盲或格擋壓制武器攻擊，避免低血量後排被連段收掉；留治療與防護救被鎖定者。','Ritualist':'看到攻擊靈先判斷是否阻路，打斷重要召喚或治療；隊伍拉開，避免同時受範圍法術。','Paragon':'致盲與格擋降低投射物壓力；喊技不能靠普通施法打斷，需靠站位、防護或限制喊技處理。','Dervish':'讓前排接近戰，後排離開鐮刀範圍；若有加持增益，帶拆加持並保留治療，避免多人圍站。'})
specific={'Glint':'先解 Crystal Haze，Jagged Crystal Skin 生效時拆姿態或停物理攻擊；打斷 Crystal Hibernation，已生效就停火避免把傷害轉成治療。',
'Markis':'先處理可威脅後排的護衛，避免全隊站一起吃 Barrage。想捕捉 Barrage 先殺 Markis、留下至少一名 Jade Armor，捕捉後再完成。',
'The Inquisitor':'在 Ryder 對話前清路並布隊，生成後用減速、擊倒及集火攔截，別讓它跑進傳送點；追擊時避免拉到未清的 Mursaat。',
'Undead Lich':'旗標後排在 Bloodstone 中央，玩家被傳進熔岩立即回乾地。每次 Undead Lich 復活先殺兩隻 Fists，再重新集火，防止增援累積。保持後排距離，避免近距離全隊同吃 Unholy Feast；保留解降咒應付 HM 的 Life Siphon。',
'Undead Prince Rurik':'先引出並擊殺旁邊兩隻 Spark of the Titans，再把 Rurik 單獨拉過來。前排致盲或格擋，避免圍在他身旁讓 Hundred Blades 觸發額外範圍傷害；不要帶著低血量硬吃 Final Thrust。',
'Doppelganger':'複製玩家技能列；進場前改用能利用 AI 弱點的反擊、寵物或靈體方案，避免攜帶讓敵方反覆自補的技能。NM 十分鐘、HM 兩分鐘內擊殺才有 Bonus。'}
specific.update({'Grook Plugalug':'具有戰士與遊俠技能：用致盲／格擋限制 Sever Artery、Gash 等近戰，保留解除病症清流血與深度創傷；Troll Unguent 開始施放就打斷，別让它長時間回血。','Lamaan Wickedwail':'具有元素使與幻術師技能。離開 Chaos Storm 範圍，後排分散，避免 Chain Lightning 同時打到多名隊員；帶解除病症清 Enervating Charge 的虛弱。'})
chains={
3:[('Ruins of Surmia (quest)','從 Frontier Gate 找 Warmaster Riga 接取，出 Eastern Frontier 往北沿道路前進，抵達 Ruins of Surmia 後向 Captain Miken 回報。')],
5:[('The Way is Blocked',"在 Yak's Bend 找 Captain Osric 接取，經 Traveler's Vale 清入口的 Inar Frostbite；再前往 Borlis Pass 找 Beccum Reedly 回報。外來角色可自行走到據點，不需接 Tyrian 限定任務。")],
7:[('To Kryta: Refugees',"在 Beacon's Perch 找 Master Saberlin 接取。出 Deldrimor Bowl，沿南側道路向西清掉箭頭附近的六隊 Centaur；難民死亡不會失敗。到 Griffon's Mouth 前的 Ranger Olson 回報；下一份任務要進洞找 Master Seeker Nathaniel，不是向 Olson 接。"),('To Kryta: The Ice Cave',"在 Griffon's Mouth 找 Master Seeker Nathaniel 接取。跟 Snow 與 Mark of Aidan 穿過冰洞，迷路時貼右牆前進；不必保護 Snow，也不用撿路標。Snow Ettin 有虛弱及高物理傷害，分批拉怪。到另一端找 Aidan 回報。"),("To Kryta: Journey's End","向冰洞出口的 Aidan 接取，進 Scoundrel's Rise，把信交給入口的 Ambassador Braun。沿地圖東南側往 Gates of Kryta，先殺 Zombie Warlock，再清會伏擊並致殘的 Grasping Ghoul；到據點找 Witness Casori 回報。")],
8:[('Report to the White Mantle',"在 Lion's Arch 找 Armen the Guide 接取。出 North Kryta Province 向西，注意 Fire Imp，抵達 D'Alessio Seaboard 據點後向 Mantle Knight Karriya 回報。Factions／Nightfall 角色完成赴 Tyria 任務後，也從這裡接入第一章主線。")],
10:[("A Brother's Fury","在 Druid's Overlook 找 Trader Versai 接取，出 Sage Lands 先與 Justiciar Thommis 說話。沿箭頭向西北，逐一和 House Ranger 對話更新目標；與 Rionel 對話後往 The Wilds。接近據點時跟 Saidra 與 Chosen Villager 入內，找 Witness Giselle 回報；據點已開的角色完成 Rionel 對話後可直接傳送。")],
12:[("White Mantle Wrath: Demagogue's Vanguard","在 Quarrel Falls 找 Gareth Quickblade 接取。出 Silverwood，依三個箭頭擊殺各兩名 White Mantle Knight 加一名 Sycophant；最後一隊靠近 Ettin's Back 入口。穿過入口，到 Ventari's Refuge 外找 Councilor Vaylor 回報並接 Urgent Warning。"),('White Mantle Wrath: A Helping Hand',"Councilor Vaylor 同時提供的可選任務，不是 Urgent Warning 的必要前置。進 Ventari's Refuge 找 Ventari，他不會參戰；回到外面清三隊 White Mantle，每隊兩名 Knight 加一名 Sycophant，可借 Shining Blade 友軍協助。回 Councilor Vaylor 領獎。"),('Urgent Warning',"完成 Demagogue's Vanguard 後，直接向 Ettin's Back 的 Councilor Vaylor 接取；不用先完成 A Helping Hand。沿路往 Snakebite，再朝東北進 Aurora Glade 據點，向 Elder Gretchen 回報。")],
13:[('Passage Through The Dark River',"在 Henge of Denravi 找 Shadow 接取。出 Tangle Root 跟 Carlotta；她不會等戰鬥，但留下 Marking Webs，可順路標走且不用撿。到 Old Joness 處依對話談他的兒子與 White Mantle，請他載全隊到 Riverside Province。進據點把 Evennia's Secret Orders 交 Blade Warrior Derikk 領獎；已開據點可直接傳送回報。")],
15:[('Sands Of Souls',"在 The Amnoon Oasis 找 Ghostly Hero 接取次要任務。步行往東南的傳送器，站進圓圈，轉身觀察開關亮起順序，依同一順序觸碰開關後傳送過峽谷。接著沿石柱到 Augury Rock 找 Great Ritual Priest Zahmut 回報。三個試煉據點要另外走到，完成順序不限；這份 Quest 是引導，不是試煉的必要前置。")],
20:[('Seeking The Seer',"在 Droknar's Forge 找 Captain Hugo Bronzebeard 接取次要任務，出 Talus Chute 沿箭頭找 Korg Snowfoot。靠近時 Stone Summit 會攻擊他，先救人再對話；在找到下一位偵察兵前換區會重設這段進度。依新箭頭找 Onar Ironblood，再抵達 Ice Caves of Sorrow 據點，向 Blade Scout Shelby 回報。")],
23:[('Final Blow',"在 Ember Light Camp 找 Shadow 接取。出 Perdition Rock，等入口巡邏群走開，往北清路；Mahgo Hydra 的 Meteor Shower 要打斷或分散躲避。迅速拆掉第一個 Ether Seal，沿中央道路向西北往碼頭。先分批拉掉祭壇外兩隊 White Mantle，再上階梯殺 Argyle、Bolivar、Cuthbert 三名 Council Member。找 Captain Grumby 對話，依序承諾保護他並選準備好了，讓他傳送全隊到 Ring of Fire 據點；再找 Fogard Axemighty 領獎。")]
}
def infobox(tree,key):
    nodes=tree.xpath('.//tr[th]')
    for tr in nodes:
        if ' '.join(tr.xpath('./th')[0].text_content().split()).rstrip(':')==key:
            return ' '.join(' '.join(x.text_content().split()) for x in tr.xpath('./td'))
    return ''
# Tactical advice is authored here; only attach it when that Boss's sourced
# skill list contains the exact skill. Do not infer spells from profession.
skill_counters={
 'Healing Signet':'施放時集中攻擊並打斷，避免讓低血量頭目自行補回。',
 'Cyclone Axe':'前排以外保持距離，避免多名隊員同吃近身範圍攻擊。',
 'Shield Stance':'姿態期間使用非攻擊傷害，或先拆姿態再集火。',
 'Troll Unguent':'看到施放立即打斷，阻止持續回血；已施放時集中傷害壓過回血。',
 'Heal Other':'先打斷治療者再集火受傷目標，避免傷害被立即補回。',
 'Word of Healing':'留打斷給這個低血量強補，避免分散輸出。',
 'Healing Hands':'帶拆加持，避免持續普攻讓被保護目標回血。',
 'Life Siphon':'保留解降咒，減少持續失血並解除敵方回血來源。',
 'Empathy':'物理輸出先停攻擊並解降咒，再恢復攻擊。',
 'Backfire':'施法者先停施法並解降咒，再使用治療或輸出魔法。',
 'Spiteful Spirit':'被降咒者暫停攻擊與使用技能，離開隊友後解除，避免連帶範圍傷害。',
 'Meteor Shower':'優先打斷長施法；落下後立即離開範圍，避免連續擊倒。',
 'Fire Storm':'施放後立即移出地面範圍，後排不要停在同一位置。',
 'Barrage':'隊伍拉開距離，防止箭矢一次打中多個後排。',
 'Thunderclap':'準備解除病症，尤其不要讓全隊停在同一範圍內。',
 'Spectral Agony':'未注入護甲角色不要接近接仇恨；護甲已注入再正面作戰，仍需補血及解除病症。',
 'Hundred Blades':'不要圍站近戰目標旁；致盲或格擋壓制普通攻擊，減少範圍觸發。',
 'Final Thrust':'低血量前排先補起來或撤離，避免被額外傷害收掉。',
 'Crystal Hibernation':'優先打斷；已生效時停火，避免傷害轉成治療。',
 'Crystal Haze':'先移除降咒再施法，避免施法者被耗乾能量。',
 'Jagged Crystal Skin':'移除姿態，或停用物理攻擊直到效果結束。',
 'Unholy Feast':'後排與敵人保持距離，避免全隊近身承受偷取生命並讓它大量回血。',
 'Soul Vortex':'玩家被傳送到熔岩時立即回乾地；旗標後排保持在安全位置。',
}
for p in sorted((ROOT/'src/data/prophecies/missions').glob('*.json')):
    m=load(p);bosses=[]
    titles=[x['title'] for x in inventory if x['mission']==m['id']]
    if m['id']=='augury-rock':titles=['Doppelganger']
    if m['id']=='hells-precipice' and 'Undead Lich' not in titles:titles+=['Undead Lich']
    if m['id']=='the-dragons-lair' and 'Glint' not in titles:titles+=['Glint']
    for title in dict.fromkeys(titles):
        source=cached(title)
        if not source:continue
        tree=html.fromstring(source['html']);prof=infobox(tree,'Profession') or infobox(tree,'Professions');skills=[];elite=[]
        headings=tree.xpath('.//*[@id="Skills"]')
        if headings and title!='Doppelganger':
            active=True
            for node in headings[0].getparent().itersiblings():
                if node.tag=='h2':break
                if title=='Undead Lich' and node.tag=='h3':active="Hell's Precipice" in node.text_content()
                if not active:continue
                for li in node.xpath('.//li'):
                    links=li.xpath('.//a[starts-with(@href,"/wiki/") and not(starts-with(@href,"/wiki/File:"))]')
                    skill=next((a.get('title') for a in links if a.get('title') not in ['Normal mode','Hard mode','Elite skill']),None)
                    if skill:
                        skills.append(skill)
                        if '(elite)' in li.text_content():elite.append(skill)
        profession=next((x for x in professions if x in prof),None)
        strategy=specific.get(title,strategies.get(profession,''))
        notes=['NM／HM 可能使用不同技能；完整列表保留原頁修訂連結。']
        if title=='Doppelganger':notes=['實際職業為僧侶，但技能列複製玩家；PvE 專用技能通常不能使用，十個 Anniversary 菁英例外。']
        if title=='Glint':notes=['龍，沒有玩家職業欄；不能擊倒。拿取 Dragon Egg 才轉為敵對，擊敗可完成 Bonus。']
        if title=='Undead Lich':notes=['此處僅列 Hell’s Precipice 技能；Life Siphon 僅 HM。不是 Gate of Madness 的技能表。']
        prof_display='／'.join(glossary[x]['zhTW'] for x in professions if x in prof and x in glossary) or None
        bosses.append({'name':name(title),'profession':('非玩家職業（龍）' if title=='Glint' else prof_display),'importantSkills':list(dict.fromkeys(skills)),'eliteSkills':elite,'eliteSkillsVerified':bool(headings) or title=='Doppelganger','skillListVerified':bool(headings),'skillListNotes':('技能列隨玩家改變，沒有固定列表。' if title=='Doppelganger' else '原頁 Skills 明確記載 None，無固定主動技能。' if not skills else ''),'notes':notes,'strategy':strategy,'translationVerified':title in glossary,'source':source['url'],'revision':source['revision']})
        bosses[-1]['dangerousSkills']=[{'name':skill,'counter':skill_counters[skill],'source':source['url']} for skill in dict.fromkeys(skills) if skill in skill_counters]
    m['bosses']=bosses
    before=[]
    for title,directions in chains.get(m['order'],[]):
        source=cached(title)
        if not source:continue
        tree=html.fromstring(source['html']);given=infobox(tree,'Given by');match=re.match(r'(.*?) in (.*)',given)
        giver,location=(match.group(1),match.group(2)) if match else (given,'')
        before.append({'name':name(source['title']),'giver':giver,'location':location,'directions':directions,'url':source['url'],'revision':source['revision'],'translationStatus':'verified' if source['title'] in glossary else 'needs-review','optional':title=='White Mantle Wrath: A Helping Hand','questType':'secondary' if title in ['Sands Of Souls','Seeking The Seer'] else 'primary'})
    m['primaryQuestBefore']=before
    m['primaryQuestAfter']=[]
    for item in bosses+before:
        url=item.get('source',item.get('url'))
        if not any(s['url'].split('?')[0]==url for s in m['sources']):
            m['sources'].append({'title':'Guild Wars Wiki：'+item['name']['en'],'url':url,'revision':item['revision'],'checkedAt':'2026-10-09','role':'mechanics'})
    p.write_text(json.dumps(m,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
missions={load(p)['id']:(p,load(p)) for p in (ROOT/'src/data/prophecies/missions').glob('*.json')}
for p,m in missions.values():
    nxt=missions.get(m['nextMission'])
    if nxt:m['primaryQuestAfter']=nxt[1]['primaryQuestBefore']
    p.write_text(json.dumps(m,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print('Imported per-boss Wiki skills and authored counters; joined sourced primary quest records. Missing translation remains incomplete.')
