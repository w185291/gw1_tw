from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
from lxml import html
import json,importlib.util

ROOT=Path(__file__).resolve().parents[1]
spec=importlib.util.spec_from_file_location('r',ROOT/'scripts/research-completeness.py')
research=importlib.util.module_from_spec(spec);spec.loader.exec_module(research)
professions={'Warrior','Ranger','Monk','Necromancer','Mesmer','Elementalist','Assassin','Ritualist','Paragon','Dervish','Unknown'}
inventory=[]
special={'imperial-sanctum':['Shiro Tagachi'],'abaddons-gate':['Abaddon'],'grand-court-of-sebelkeh':['The Blasphemy'],'jennurs-horde':['Harbinger of Nightfall'],'jokanur-diggings':['Apocrypha'],'ruins-of-morah':['Varesh Ossa'],'tihark-orchard':['Royal Guard Captain','"Palawa Joko"'],'venta-cemetery':['Guard Post Commander']}
special['nundu-bay']=['Harbinger of Nightfall']
for campaign in ['factions','nightfall']:
    for p in (ROOT/'src/data'/campaign/'missions').glob('*.json'):
        m=json.loads(p.read_text(encoding='utf-8'))
        source=json.loads((ROOT/'docs/reference/phase23'/(m['id']+'.json')).read_text(encoding='utf-8'))
        tree=html.fromstring(source['html']);heads=tree.xpath('//*[@id="Bosses"]')
        for title in special.get(m['id'],[]):inventory.append({'campaign':campaign,'mission':m['id'],'title':title,'missionSource':source['source'],'missionRevision':source['revision']})
        if not heads:continue
        for block in heads[0].getparent().itersiblings():
            if block.tag in ['h2','h3']:break
            if block.tag=='ol':continue
            for li in block.xpath('.//li'):
                names=li.xpath('.//a[starts-with(@href,"/wiki/") and not(starts-with(@href,"/wiki/File:"))]/@title')
                titles=[name for name in names if name not in professions]
                if names and names[0] in professions and titles:inventory.append({'campaign':campaign,'mission':m['id'],'title':titles[0],'missionSource':source['source'],'missionRevision':source['revision']})
        # Some final encounters are presented under Foes instead of Bosses.
        for boss in m['bosses']:
            canonical=[r['title'] for r in inventory if r['campaign']==campaign and r['mission']==m['id']]
            base=boss['name']['en']
            if base in ["Lightbringer's Gaze",'Spawn']:continue
            if not any(t==base or t.startswith(base+' (') for t in canonical):
                inventory.append({'campaign':campaign,'mission':m['id'],'title':boss['name']['en'],'missionSource':source['source'],'missionRevision':source['revision']})
(ROOT/'docs/reference/completeness/phase23-boss-inventory.json').write_text(json.dumps(inventory,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
with ThreadPoolExecutor(max_workers=2) as pool:list(pool.map(research.fetch,list(dict.fromkeys(r['title'] for r in inventory))))
print('Boss inventory entries',len(inventory),flush=True)
