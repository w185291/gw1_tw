"""Join actual client localization to researched Wiki skill/acquisition records.

Writes substantive research records, never marks an import as editorial completion.
"""
import json,re,shutil
from pathlib import Path
from lxml import html

ROOT=Path(__file__).resolve().parents[1]
EXTRACT=Path('C:/Users/roger/Documents/激戰/攻略研究/game-extraction-20261009')
OUT=ROOT/'src/data/skills';OUT.mkdir(exist_ok=True)
ICONS=ROOT/'public/skills';ICONS.mkdir(exist_ok=True)
CACHE=ROOT/'docs/reference/completeness'
def slug(s):return re.sub('[^a-z0-9]+','-',s.lower()).strip('-')
def read(p):return json.loads(p.read_text(encoding='utf-8'))
raw=read(EXTRACT/'skills/skills.json')['skills']
native={s['name']['en']:s for s in raw if not s['flags']['pvp']}
all_native={s['id']:s for s in raw}
pairs=read(EXTRACT/'text-pairs.json')
by={}
for sid,p in pairs.items():
 if re.search('[\u3400-\u9fff]',p['zhTW']) and len(p['en'])<120:by.setdefault(p['en'].casefold(),[]).append((sid,p['zhTW']))
def localized(en):
 rows=by.get(en.casefold(),[])
 return rows[0][1] if rows and len({z for _,z in rows})==1 else en
def named(en):return {'id':slug(en),'en':en,'zhTW':localized(en),'translationVerified':localized(en)!=en}
campaigns={'Core':'共通技能','Factions':'第二章：盟與敵','Nightfall':'第三章：黑暗逆襲','Prophecies':'第一章：阿斯卡隆戰記','Eye of the North':'極地之眼'}
def source(j):return {'url':j['url'],'revision':j['revision'],'title':j['title'],'checkedAt':j['checkedAt']}
def section(t,id):
 found=t.xpath('.//*[@id=$id]',id=id)
 if not found:return []
 out=[]
 for n in found[0].getparent().itersiblings():
  if not isinstance(n.tag,str):continue
  if n.tag=='h2':break
  out.append(n)
 return out
def text(node):return ' '.join(node.text_content().split())
def info(t):
 box=t.xpath('.//div[contains(@class,"skill-box")]')[0]
 return {text(dt):text(dt.getnext()) for dt in box.xpath('./dl/dt') if dt.getnext() is not None},box
def effects(t):
 nodes=t.xpath('.//span[contains(@class,"wikipopup")]')
 if nodes:return text(nodes[0])
 box=t.xpath('.//div[contains(@class,"skill-box")]')[0]
 for n in box.getparent().itersiblings() if box.getparent().get('align')=='center' else box.itersiblings():
  if n.tag=='div' and n.xpath('./p'):return text(n.xpath('./p')[0])
 return ''
def stats(box):
 out={}
 for li in box.xpath('.//div[@class="skill-stats"]//li'):
  links=li.xpath('.//a/@title'); value=li.text or ''
  match=re.search(r'[\d.]+',value)
  if links and match:out[links[0]]=float(match.group())
 return out
def native_description(s):
 values={'1':(s['scaling']['scale_0'],s['scaling']['scale_15']),'2':(s['scaling']['bonus_scale_0'],s['scaling']['bonus_scale_15']),'3':(s['timing']['duration_0_attribute'],s['timing']['duration_15_attribute'])}
 def replace(m):
  if m[1] not in values:return m[0]
  lo,hi=values[m[1]];return str(lo) if lo==hi else f'{lo}～{hi}'
 return re.sub(r'%str(\d+)%',replace,s['description']['zh_tw']).replace('%%','%')

explanations={
 'Soul Twisting':('先啟動再放防禦靈體，能降低能量消耗並立即恢復縛靈儀式，方便補回被打掉的庇護、聯合與移位。效果有可使用次數，不能當成永久加速。',['ST 防禦祭祀','英雄隊防禦']),
 'Signet of Spirits':('不用能量就能召出三個攻擊靈體，適合在開戰前或交戰時建立固定火力；離開靈體的攻擊範圍後，需要重新布置。',['SoS 靈體輸出','英雄隊固定火力']),
 'Shelter':('降低友軍單次受傷的上限，處理大傷害很有用；每次吸收傷害都會扣靈體自身體力，因此必須留意存活與補放。',['ST 防禦祭祀','團隊防護']),
 'Union':('每次幫範圍內友軍抵消部分傷害，並扣除靈體自身體力。適合配合其他防禦靈體，持續受攻擊時會消耗得很快。',['ST 防禦祭祀','團隊減傷']),
 'Displacement':('讓範圍內友軍有機會格擋攻擊；成功格擋會扣靈體體力。對武器攻擊有效，不要把它當成所有法術的防護。',['ST 防禦祭祀','抗近戰攻擊']),
 'Bloodsong':('召喚靠攻擊偷取體力的靈體，提供持續輸出。靈體固定在召喚位置，隊伍推進後要重新布置。',['靈體輸出','SoS 配套']),
 'Pain':('用低成本布置攻擊靈體，讓它持續攻擊範圍內敵人；注意站位和存活，不適合把敵人拉到靈體後又快速離開。',['靈體輸出','靈體隊入門']),
 'Painful Bond':('先讓攻擊靈體就位，再對敵人群上苦痛連結，放大靈體造成的傷害；沒有攻擊靈體配合時收益有限。',['靈體輸出','SoS 配套']),
 'Spirit Siphon':('從距離自己最近的靈體取回能量，無法自由指定另一隻。施放前靠近有能量的靈體；沒有靈體或靈體太遠時仍可能浪費施法成本。',['靈體祭祀能量管理','英雄能量管理']),
 'Mend Body and Soul':('同時補血與解除病症，附近有靈體時可多解除病症。需要兼顧治療範圍與靈體位置。',['恢復魔法補師','帶解病症的英雄補師']),
 'Spirit Light':('快速補回目標體力，靠近靈體時可避免犧牲體力；沒有靈體支援時要注意自己的血量。',['恢復魔法補師','英雄治療']),
 'Protective Was Kaolai':('持物時提高自己的防禦，放下骨灰時治療整隊。預先拿好，等隊伍多人掉血再放，較能利用群補效益。',['恢復魔法群補','英雄補師']),
 'Dissonance':('攻擊靈體會打斷目標行動；能量成本高，位置和存活很重要。別假設它一定會選到你希望打斷的法術。',['靈體干擾','祭祀控制']),
 'Wanderlust':('針對不移動的目標造成擊倒，藉此干擾施法或攻擊；會消耗靈體體力，對持續移動的敵人不能保證控制。',['靈體擊倒控制','祭祀干擾']),
 "Warmonger's Weapon":('給正在攻擊的隊友武器法術，利用命中打斷敌人的行動。適合能持續命中敵人的攻擊者，並注意技能限定的目標條件。',['武器法術支援','攻擊者打斷支援'])}

entries=[e for e in read(ROOT/'src/data/inventory/skills.json')['entries'] if e['professionHeading']=='Ritualist skills']
failures=[]
for e in entries:
 en=e['name'];s=native.get(en);p=CACHE/(slug(en)+'.json')
 if not s or not p.exists():failures.append(en);continue
 j=read(p);t=html.fromstring(j['html'])
 if not t.xpath('.//div[contains(@class,"skill-box")]'):failures.append(en);continue
 metadata,box=info(t);st=stats(box);effect=effects(t)
 acquisition={'trainers':[],'quests':[],'bosses':[],'special':[],'professionChangers':[],'tomes':not s['flags']['pve'],'eliteTome':s['elite'] and not s['flags']['pve'],'verified':False}
 category='special';unlock_only=False
 for n in section(t,'Acquisition'):
  label=text(n)
  if n.tag=='h3':unlock_only='Unlock only' in label
  if n.tag in ['p','dl']:
   if 'Skill trainers' in label:category='trainers'
   elif 'Skill quests' in label:category='quests'
   elif 'Signet of Capture' in label:category='bosses'
   elif 'Profession changers' in label:category='professionChangers'
   else:category='special'
  if n.tag not in ['ul','ol']:continue
  for li in n.xpath('.//li[not(ul) and not(ol)]'):
   links=li.xpath('.//a[starts-with(@href,"/wiki/") and not(starts-with(@href,"/wiki/File:"))]')
   if not links:continue
   first=links[0];npc=first.get('title') or text(first)
   if npc=='Eye of the North' or npc in campaigns:continue
   context=[text(a) for a in li.xpath('ancestor::li') if text(a) in campaigns]
   context_campaign=next((c for a in li.xpath('ancestor::li') for c in campaigns if (a.text or '').strip()==c or any(link.get('title')==c for link in a.xpath('./a'))),metadata.get('Campaign','Factions'))
   places=[{'name':named(a.get('title') or text(a)),'url':'https://wiki.guildwars.com'+a.get('href')} for a in links[1:] if a.get('title') not in ['Hard mode']]
   acquisition[category].append({'name':named(npc),'locations':places,'campaign':context_campaign,'details':text(li),'source':j['url'],'url':'https://wiki.guildwars.com'+first.get('href'),'unlockOnly':unlock_only,'profession':metadata.get('Profession') if category=='bosses' else None})
 pvps=[]
 for title in e['pvpVariants']:
  pp=CACHE/(slug(title)+'.json')
  if not pp.exists():continue
  pj=read(pp);pt=html.fromstring(pj['html']);pm,pb=info(pt);ps=all_native.get(s['linked_skill_id']);
  if ps and ps['flags']['pvp']:pvps.append({'name':title,'description':{'en':effects(pt),'zhTW':native_description(ps)},'stats':stats(pb),'source':source(pj),'clientSkillId':ps['id']})
 description=native_description(s)
 special=explanations.get(en)
 explanation=special[0] if special else description
 uses=special[1] if special else [metadata.get('Attribute','Ritualist')+' 技能搭配']
 image=EXTRACT/'skills/model_file'/f"{s['id']}.png"
 if image.exists():shutil.copyfile(image,ICONS/(slug(en)+'.png'))
 attribute=metadata.get('Attribute','No attribute');profession=metadata['Profession'];ctype=metadata.get('Type','Skill').removeprefix('Elite ').replace(' (PvE-only)','');release=metadata.get('Campaign','Factions')
 record={'id':slug(en),'name':{'en':en,'zhTW':s['name']['zh_tw']},'clientSkillId':s['id'],'icon':'/skills/'+slug(en)+'.png' if image.exists() else None,'profession':named(profession),'attribute':named(attribute),'type':named(ctype),'campaign':{'id':slug(release),'en':release,'zhTW':campaigns.get(release,release)},'elite':s['elite'],'pveOnly':s['flags']['pve'],'pvpVariantExists':bool(e['pvpVariants']),'pvpVariantVerified':len(pvps)==len(e['pvpVariants']),'cost':{'energy':st.get('Energy',0),'adrenaline':st.get('Adrenaline',0),'sacrifice':st.get('Health sacrifice',0),'overcast':st.get('Overcast',0)},'activation':st.get('Activation',0),'recharge':st.get('Recharge',0),'description':{'pve':{'en':effect,'zhTW':description},'pvp':pvps[0]['description'] if pvps else None},'pvpVariants':pvps,'acquisition':acquisition,'availableCampaigns':sorted({x['campaign'] for key in ['trainers','quests','bosses','special','professionChangers'] for x in acquisition[key]}),'explanation':explanation.replace('敌','敵'),'commonUses':uses,'aliases':{'Soul Twisting':['ST','靈魂扭曲'],'Signet of Spirits':['SoS']}.get(en,[]),'relatedSkills':[named(a.get('title') or text(a)) for n in section(t,'Related_skills') for a in n.xpath('.//li/a')],'earliestAcquisition':None,'recommendedAcquisition':None,'sources':[source(j)]+[v['source'] for v in pvps],'translationVerified':bool(re.search('[\u3400-\u9fff]',s['name']['zh_tw'])),'translationSources':['game-client://2026-10-09/string/'+str(s['name_string_id'])],'descriptionEvidence':{'stringId':s['description_string_id'],'range':'Client attribute 0 to 15 endpoints; compare full English effect for current wording.','nativeUnexpanded':s['description']['zh_tw']},'contentStatus':'incomplete'}
 (OUT/(record['id']+'.json')).write_text(json.dumps(record,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
(ROOT/'docs/content-audit/ritualist-import.json').write_text(json.dumps({'expected':len(entries),'written':len(entries)-len(failures),'failed':failures,'note':'Real localization, Wiki stats, PvP and acquisition imported; not certified editorial completion.'},ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print('Ritualist records',len(entries)-len(failures),'/',len(entries),'failures',failures)
