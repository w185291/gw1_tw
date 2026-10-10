"""Cache public Wiki revisions; never turn scraped records into completed guides."""
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
import json,urllib.request,urllib.parse,re,time
from lxml import html
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'docs/reference/completeness';OUT.mkdir(parents=True,exist_ok=True)
def fetch(title):
    file=OUT/(re.sub('[^a-z0-9]+','-',title.lower()).strip('-')+'.json')
    if file.exists():return json.loads(file.read_text(encoding='utf-8'))
    url='https://wiki.guildwars.com/api.php?'+urllib.parse.urlencode({'action':'parse','page':title,'prop':'text|revid|links','format':'json','redirects':1})
    for attempt in range(3):
        try:
            with urllib.request.urlopen(urllib.request.Request(url,headers={'User-Agent':'GW1GuideResearch/1.0'}),timeout=40) as res:p=json.load(res)['parse']
            raw=p['text']['*'];tree=html.fromstring(raw)
            record={'title':p['title'],'revision':p['revid'],'url':'https://wiki.guildwars.com/wiki/'+urllib.parse.quote(p['title'].replace(' ','_')),'checkedAt':'2026-10-09','html':raw,'text':' '.join(tree.text_content().split()),'links':[l['*'] for l in p['links'] if l.get('ns')==0]}
            file.write_text(json.dumps(record,ensure_ascii=False,indent=2),encoding='utf-8');print('Cached',p['title'],flush=True);return record
        except Exception as exc:
            if attempt==2:print('FAILED',title,str(exc),flush=True);return None
            time.sleep(attempt+1)
if __name__=='__main__':
    titles=['List of Prophecies missions and primary quests','List of Eye of the North missions and primary quests','Dungeon','Augury Rock/Guide','Doppelganger','Localized skill names','Guild Wars Wiki:Projects/Chinese community localization','List of skills by campaign']
    titles+=['Localized '+p+' skill names' for p in ['warrior','ranger','monk','necromancer','mesmer','elementalist','assassin','ritualist','paragon','dervish']]
    titles+=['Soul Twisting','Signet of Spirits','Soul Twisting (PvP)','Signet of Spirits (PvP)','Shelter','Union','Displacement','Bloodsong','Pain','Painful Bond','Spirit Siphon','Mend Body and Soul','Spirit Light','Protective Was Kaolai','Dissonance','Wanderlust',"Warmonger's Weapon"]
    with ThreadPoolExecutor(max_workers=2) as pool:list(pool.map(fetch,titles))
