from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
from lxml import html
import json,re,importlib.util
ROOT=Path(__file__).resolve().parents[1]
spec=importlib.util.spec_from_file_location('research',Path(__file__).with_name('research-completeness.py'))
research=importlib.util.module_from_spec(spec);spec.loader.exec_module(research)
fetch=research.fetch
raw=json.loads(Path('C:/Users/roger/Documents/激戰/攻略研究/game-extraction-20261009/skills/skills.json').read_text(encoding='utf-8'))
skills=[s for s in raw['skills'] if s['flags']['playable'] and s['name'].get('en') and s['name']['en']!='...']
skills.sort(key=lambda s:(s['profession']!='ritualist',s['profession'],s['id']))
titles=['Ruins of Surmia (quest)','The Way is Blocked','To Kryta: Refugees','To Kryta: The Ice Cave',"To Kryta: Journey's End",'Report to the White Mantle',"A Brother's Fury","White Mantle Wrath: Demagogue's Vanguard",'White Mantle Wrath: A Helping Hand','Urgent Warning','Passage Through The Dark River','Sands Of Souls','Seeking The Seer','Final Blow','Riverside Province (outpost)']
bosses=[]
for p in sorted((ROOT/'src/data/prophecies/missions').glob('*.json')):
    m=json.loads(p.read_text(encoding='utf-8'));n=m['order'];tree=html.fromstring(Path(f'C:/Users/roger/Documents/激戰/攻略研究/missions/{n:02d}.html').read_text(encoding='utf-8'))
    heading=tree.xpath('.//*[@id="Bosses"]')
    if not heading:continue
    for node in heading[0].getparent().itersiblings():
        if node.tag in ['h2','h3','h4']:break
        for li in node.xpath('.//li'):
            links=li.xpath('.//a[starts-with(@href,"/wiki/") and not(starts-with(@href,"/wiki/File:"))]')
            candidate=next((a for a in links if a.get('title') not in ['Warrior','Ranger','Monk','Necromancer','Mesmer','Elementalist','Boss']),None)
            if candidate is not None:bosses.append({'mission':m['id'],'title':candidate.get('title')})
titles+=list(dict.fromkeys(b['title'] for b in bosses if b['title']))
(ROOT/'docs/reference/completeness/prophecies-boss-inventory.json').write_text(json.dumps(bosses,ensure_ascii=False,indent=2),encoding='utf-8')
titles+=[s['name']['en']+(' (PvP)' if s['flags']['pvp'] and not s['name']['en'].endswith('(PvP)') else '') for s in skills]
titles=list(dict.fromkeys(titles))
manifest={'clientRecordCount':len(raw['skills']),'selectedPlayableRows':len(skills),'wikiPages':len(titles),'description':'Research inventory, not completion count. Client current variants and Wiki article coverage may differ.','skills':[{'id':s['id'],'en':s['name']['en'],'profession':s['profession'],'pvp':s['flags']['pvp'],'linkedId':s['linked_skill_id']} for s in skills]}
(ROOT/'docs/reference/completeness/skill-inventory.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2),encoding='utf-8')
with ThreadPoolExecutor(max_workers=2) as pool:
    results=list(pool.map(fetch,titles))
failed=[title for title,result in zip(titles,results) if result is None]
(ROOT/'docs/reference/completeness/research-failures.json').write_text(json.dumps(failed,ensure_ascii=False,indent=2),encoding='utf-8')
print('Research pages',len(titles),'failed',len(failed),flush=True)
