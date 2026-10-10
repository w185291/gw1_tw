"""Normalize all professions with client evidence and localized Wiki tables."""
from pathlib import Path
import json,re
from lxml import html
ROOT=Path(__file__).resolve().parents[1]
EXTRACT=Path('C:/Users/roger/Documents/激戰/攻略研究/game-extraction-20261009')
raw={s['id']:s for s in json.loads((EXTRACT/'skills/skills.json').read_text(encoding='utf-8'))['skills']}
templates=json.loads((ROOT/'scripts/skill-effect-translations.json').read_text(encoding='utf-8'))
professions={'Warrior':'戰士','Ranger':'遊俠','Monk':'僧侶','Necromancer':'死靈法師','Mesmer':'幻術師','Elementalist':'元素使','Assassin':'刺客','Ritualist':'祭祀','Paragon':'聖言者','Dervish':'神喚','Common':'共通'}
terms=json.loads((ROOT/'src/data/terminology/skills.json').read_text(encoding='utf-8'))
pairs=json.loads((EXTRACT/'text-pairs.json').read_text(encoding='utf-8'))
native_terms={t['en'].casefold():t for t in json.loads((ROOT/'src/data/terminology/game-client.json').read_text(encoding='utf-8'))}
localized={}
for profession in list(professions)[:-1]:
 file=ROOT/'docs/reference/completeness'/('localized-'+profession.lower()+'-skill-names.json')
 if not file.exists():continue
 a=json.loads(file.read_text(encoding='utf-8'));names={}
 for row in html.fromstring(a['html']).xpath('//tr'):
  cells=row.xpath('./td')
  if len(cells)==10:
   en=' '.join(cells[0].text_content().split());zh=' '.join(cells[8].text_content().split())
   if re.search('[\u3400-\u9fff]',zh):names[en.casefold()]=zh
 localized[profession]=(names,a)

def expand(template,s):
 values={'1':(s['scaling']['scale_0'],s['scaling']['scale_15']),'2':(s['scaling']['bonus_scale_0'],s['scaling']['bonus_scale_15']),'3':(s['timing']['duration_0_attribute'],s['timing']['duration_15_attribute'])}
 def sub(m):
  lo,hi=values[m[1]];return str(lo) if lo==hi else f'{lo}～{hi}'
 return re.sub(r'%str([123])%',sub,template).replace('一项','一項')
untranslated=[];count=0
for file in (ROOT/'src/data/skills').glob('*.json'):
 d=json.loads(file.read_text(encoding='utf-8'));en=d['name']['en'];s=raw[d['clientSkillId']];p=d['profession']['en']
 d['profession']['zhTW']=professions.get(p,p)
 d['profession']['translationVerified']=p in professions
 if p in localized:
  names,a=localized[p]
  for field in ['name','attribute']:
   target=d[field];zh=names.get(target['en'].casefold())
   if zh:
    target['zhTW']=zh;target['translationVerified']=True
    if field=='name':d['translationVerified']=True;d['translationSources']=list(set(d['translationSources']+[a['url']]))
  if a['url'] not in [x['url'] for x in d['sources']]:d['sources'].append({k:a[k] for k in ['title','url','revision','checkedAt']})
 for field in ['attribute','type']:
  target=d[field];term=native_terms.get(target['en'].casefold())
  if term and target['en'] not in ['Spawning Power']:
   target['zhTW']=term['zhTW'];target['translationVerified']=True
 if d['attribute']['en']=='No attribute':d['attribute']['zhTW']='無屬性'
 if d['type']['en']=='Skill':d['type']['zhTW']='技能'
 if p=='Common':d['profession']['zhTW']='共通'
 if not re.search('[\u3400-\u9fff]',d['description']['pve']['zhTW']):
  if en in templates:
   d['description']['pve']['zhTW']=expand(templates[en],s)
   d['explanation']=d['description']['pve']['zhTW'];d['descriptionTranslationMethod']='Authored Traditional Chinese summary of client English effect; Wiki English retained for comparison.'
  else:untranslated.append(en+' PvE')
 for variant in d['pvpVariants']:
  if not re.search('[\u3400-\u9fff]',variant['description']['zhTW']):
   if en in templates:variant['description']['zhTW']=expand(templates[en],raw[variant['clientSkillId']])
   else:untranslated.append(en+' PvP')
 if d['pvpVariants']:d['description']['pvp']=d['pvpVariants'][0]['description']
 if p!='Ritualist':d['commonUses']=[f"{d['attribute']['zhTW']} · {d['type']['zhTW']}"]
 if d.get('pvpOnly'):d['explanation']=d['description']['pve']['zhTW']
 # Only actual catalog entries may appear as related-skill links.
 d['relatedSkills']=list({t['id']:t for t in d['relatedSkills'] if (ROOT/'src/data/skills'/f"{t['id']}.json").exists()}.values())
 for target in [d['name'],d['attribute'],d['profession'],d['type']]:
  if target['en']!=target['zhTW'] and re.search('[\u3400-\u9fff]',target['zhTW']):terms.append({'en':target['en'],'zhTW':target['zhTW'],'sources':d['translationSources'] if target is d['name'] else [d['sources'][0]['url']]})
 file.write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n',encoding='utf-8');count+=1
dedup={t['en'].casefold():t for t in terms}
(ROOT/'src/data/terminology/skills.json').write_text(json.dumps(list(dedup.values()),ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
(ROOT/'docs/content-audit/all-skills-translation.json').write_text(json.dumps({'skills':count,'missingChineseEffects':untranslated},ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(count,'skills; English-only effect sections:',untranslated)
