"""Join individual Boss sources without treating sourced records as complete guides."""
from pathlib import Path
from lxml import html
import ast,json,re

ROOT=Path(__file__).resolve().parents[1]
CACHE=ROOT/'docs/reference/completeness'
def load(p):return json.loads(p.read_text(encoding='utf-8'))
glossary={t['en']:t for t in load(ROOT/'src/data/terminology/game-client.json')}
# Read authored counter dictionaries without executing the Prophecies importer.
advice={}
for node in ast.parse((ROOT/'scripts/enrich-prophecies-research.py').read_text(encoding='utf-8')).body:
    if isinstance(node,ast.Assign) and isinstance(node.targets[0],ast.Name) and node.targets[0].id in ['strategies','specific','skill_counters']:
        advice[node.targets[0].id]=ast.literal_eval(node.value)
    elif isinstance(node,ast.Expr) and isinstance(node.value,ast.Call) and isinstance(node.value.func,ast.Attribute) and isinstance(node.value.func.value,ast.Name) and node.value.func.attr=='update' and node.value.func.value.id in advice:
        advice[node.value.func.value.id].update(ast.literal_eval(node.value.args[0]))
inventory=load(CACHE/'phase23-boss-inventory.json')
special_counters={
'Gate Guard (boss)':'這位 Shiro’ken 守衛在結尾過場前才生成，不能擊殺或捕捉。不要把它與一般 Gate Guard 的職業、技能混為一談；通關重點仍是擊殺 Shiro’ken 頭目。',
'Abaddon':'先封鎖左右兩手，兩手都封住後再處理頭部，暴露時集中輸出；掙脫後重複。保留群體解除病症應付 Words of Madness 的暈眩與擊倒，Torment Claw 長施法立即打斷。',
'Varesh Ossa':'Commander 與 Prophet 是兩階段，第一形態倒地不會完成。分散站位躲範圍攻擊，避免把召喚物鋪到巡邏路；第二階段先限制增援，防護被點名者再集火。不要以常駐加持作唯一防線，Enchantment Collapse 會拆加持。',
'The Blasphemy':'不要為追 Blasphemy 把中央祭壇防線全撤走。它死亡會生三隻 Unbound Energy，裂隙未全部控制前仍會重生；優先守中央、打斷 Summon Torment，分隊壓回正在被奪的裂隙。',
'Harbinger of Nightfall':'按本關任務道具機制打：Jennur’s Horde 以 Light of Seborhin 傷害先遣者，Nundu Bay 則先用 Vial of Purified Water 才能傷害它。清護衛、穩住補血，再處理最後先遣者，不要把兩關機制混用。',
'Apocrypha':'會以 Reform Carvings 改變職業。把它與需要保護的 Sunspear Ghost 分開，控制英雄範圍技避免誤殺鬼魂；幻術型態準備解降咒，神喚型態不圍站，聖言型態用致盲／格擋。它不是血肉目標，不以流血或毒作主要輸出。',
'Royal Guard Captain':'在單人任務中保持自療，擊敗後取得 Golden Phoenix Feather；沒有隊友可救，先把自己血量維持安全，不要只帶依賴英雄的技能。',
'"Palawa Joko"':'這是演員扮演的戰鬥，不是實際 Palawa Joko。本關只有玩家一人，帶自療及解除 Life Siphon 的降咒，讓直接傷害穩定壓過回血；完成後再去處理其他大師活動。',
'Guard Post Commander':'清哨站時先拉離其他巡邏，致盲或格擋控制投射物。喊技不能用普通打斷阻止，可用拆姿態／非攻擊傷害協助集火；別在中央炮擊區久站。',
}
for campaign in ['factions','nightfall']:
    for p in (ROOT/'src/data'/campaign/'missions').glob('*.json'):
        m=load(p);old={b['name']['en']:b for b in m['bosses']};bosses=[]
        for title in dict.fromkeys(r['title'] for r in inventory if r['campaign']==campaign and r['mission']==m['id']):
            file=CACHE/(re.sub('[^a-z0-9]+','-',title.lower()).strip('-')+'.json')
            if not file.exists():continue
            source=load(file);tree=html.fromstring(source['html']);prof=None
            for row in tree.xpath('//tr[th]'):
                if row.xpath('./th')[0].text_content().strip() in ['Profession','Professions']:prof=' '.join(' '.join(x.text_content().split()) for x in row.xpath('./td'))
            skills=[];elite=[];heads=tree.xpath('//*[@id="Skills"]');shared=title in ['Shiro Tagachi','Undead Lich','Harbinger of Nightfall'];active=not shared
            if heads:
                for block in heads[0].getparent().itersiblings():
                    if block.tag=='h2':break
                    # Shared Shiro/Lich pages list several campaign appearances.
                    if shared and (block.tag in ['h3','h4'] or (block.tag=='dl' and block.xpath('./dt'))):
                        active=m['name']['en'] in block.text_content()
                    if not active:continue
                    for li in block.xpath('.//li'):
                        names=li.xpath('.//a[starts-with(@href,"/wiki/") and not(starts-with(@href,"/wiki/File:"))]/@title')
                        if not names:continue
                        skill=names[0]
                        if skill in ['Normal mode','Hard mode']:continue
                        skills.append(skill)
                        if '(elite)' in li.text_content():elite.append(skill)
            previous=old.get(title,old.get(re.sub(r' \([^)]*\)$','',title),{}))
            profession_names=['Warrior','Ranger','Monk','Necromancer','Mesmer','Elementalist','Assassin','Ritualist','Paragon','Dervish']
            first_prof=next((x for x in profession_names if x in (prof or '')),None)
            strategy=special_counters.get(title) or previous.get('strategy') or advice['specific'].get(title,advice['strategies'].get(first_prof,''))
            # Preserve existing encounter advice; special foes require individual
            # mechanics rather than a fabricated player profession strategy.
            if not strategy and previous.get('notes'):strategy=' '.join(previous['notes'])
            if title=='Shiro Tagachi' and m['bossMechanics']:strategy=' '.join(b['mechanism']+' '+b['counter'] for b in m['bossMechanics'])
            name=previous.get('name',{'en':title,'zhTW':title+'（繁中名稱待確認）'})
            if title in glossary:name={'en':title,'zhTW':glossary[title]['zhTW']}
            prof_display='／'.join(glossary[x]['zhTW'] if x in glossary else x for x in profession_names if x in (prof or '')) or prof
            bosses.append({'name':name,'profession':prof_display,'importantSkills':list(dict.fromkeys(skills)),'eliteSkills':list(dict.fromkeys(elite)),'eliteSkillsVerified':bool(heads),'skillListVerified':bool(heads),'skillListNotes':'原頁未列出固定主動技能。' if heads and not skills else '', 'translationVerified':title in glossary or previous.get('translationVerified',False),'strategy':strategy,'dangerousSkills':[{'name':s,'counter':advice['skill_counters'][s],'source':source['url']} for s in dict.fromkeys(skills) if s in advice['skill_counters']],'notes':previous.get('notes',[]),'source':source['url'],'revision':source['revision']})
            if not any(s['url'].split('?')[0]==source['url'] for s in m['sources']):
                m['sources'].append({'title':'Guild Wars Wiki：'+title,'url':source['url'],'revision':source['revision'],'checkedAt':source['checkedAt'],'role':'mechanics'})
        # A non-listed special encounter should not disappear from the guide.
        for title,b in old.items():
            if title in ["Lightbringer's Gaze",'Spawn']:continue
            if not any(n['name']['en']==title or n['name']['en'].startswith(title+' (') for n in bosses):bosses.append(b)
        m['bosses']=bosses
        if m['id']=='gyala-hatchery':
            m['bossAbsenceVerified']=True
            m['bossAbsenceReason']='本關沒有獨立固定 Boss 戰，重點是保護五隻幼龜並清各階段 Kurzick 部隊。普通敵兵也可能攜帶菁英技能，不等於可捕捉 Boss。'
        p.write_text(json.dumps(m,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print('Joined sourced skill lists for 33 missions; unverified names and special encounters remain incomplete.')
