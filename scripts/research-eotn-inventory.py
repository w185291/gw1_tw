"""Research inventory, not empty website entries or completed guides."""
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
import importlib.util,json
from lxml import html

ROOT=Path(__file__).resolve().parents[1]
CACHE=ROOT/'docs/reference/completeness'
spec=importlib.util.spec_from_file_location('research',ROOT/'scripts/research-completeness.py')
research=importlib.util.module_from_spec(spec);spec.loader.exec_module(research)
story=json.loads((CACHE/'list-of-eye-of-the-north-missions-and-primary-quests.json').read_text(encoding='utf-8'))
tree=html.fromstring(story['html'])
table=tree.xpath('//table')[0]
titles=list(dict.fromkeys(table.xpath('.//a[starts-with(@href,"/wiki/")]/@title')))
titles=[t for t in titles if t not in ['Prophecies','Factions','Nightfall'] and not t.startswith('File:')]
records=[{'title':t,'scope':'story','source':story['url'],'sourceRevision':story['revision']} for t in titles]
source=json.loads((CACHE/'dungeon.json').read_text(encoding='utf-8'))
dungeons=html.fromstring(source['html']).xpath('//table[contains(@class,"sortable")]')[0]
for row in dungeons.xpath('./tbody/tr[td]'):
    cols=row.xpath('./td')
    if len(cols)<7:continue
    number=''.join(cols[0].text_content().split())
    # The two 2026 Reforged Ascalon dungeons belong to that expansion's scope.
    if not number.isdigit() or not 1<=int(number)<=18:continue
    title=cols[1].xpath('.//a/@title')[0]
    records.append({'title':title,'scope':'dungeon','number':int(number),'levels':cols[2].text_content().strip(),'questTitles':cols[6].xpath('.//a[not(starts-with(@href,"#"))]/@title'),'bossTitles':cols[3].xpath('.//a/@title'),'source':source['url'],'sourceRevision':source['revision']})
for title in ["Glint's Challenge",'Norn Fighting Tournament','The Norn Fighting Tournament','Kilroy Stonekin','Xandra','Kahmu','Hayda','Livia','Gwen','Vekk','Ogden Stonehealer','Jora','Pyre Fierceshot','Anton','Gadd','Oola']:
    records.append({'title':title,'scope':'activity-or-hero-research','source':story['url'],'sourceRevision':story['revision']})
(CACHE/'eotn-research-inventory.json').write_text(json.dumps({'coverageVerified':False,'note':'Storyline and 18 dungeons inventoried. Hero-recruitment quest and activity scope still requires reconciliation; this is a research queue, not complete guide data.','entries':records},ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
pages=list(dict.fromkeys([r['title'] for r in records]+[q for r in records for q in r.get('questTitles',[])]+[b for r in records for b in r.get('bossTitles',[])]+['List of core skills','List of Prophecies skills','List of Factions skills','List of Nightfall skills','List of Eye of the North skills','List of all skills']))
with ThreadPoolExecutor(max_workers=2) as pool:list(pool.map(research.fetch,pages))
print('Researched',len(pages),'pages. Scope verification and authored walkthroughs remain required.',flush=True)
