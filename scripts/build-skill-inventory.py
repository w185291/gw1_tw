"""Reconcile playable skills against the Wiki's five campaign lists.

Do not use the client's raw table as a player-facing completion denominator:
it also contains monster, temporary, removed and PvP rows.
"""
from pathlib import Path
from lxml import html
import json

ROOT=Path(__file__).resolve().parents[1]
CACHE=ROOT/'docs/reference/completeness'
entries={};sources=[]
for slug in ['core','prophecies','factions','nightfall','eye-of-the-north']:
    d=json.loads((CACHE/('list-of-'+slug+'-skills.json')).read_text(encoding='utf-8'))
    sources.append({'url':d['url'],'revision':d['revision']})
    tree=html.fromstring(d['html']);count=0
    for table in tree.xpath('//table[contains(@class,"sortable")]'):
        heading=table.xpath('preceding::*[self::h2 or self::h3][1]')
        profession=heading[0].text_content().replace('[edit]','').strip() if heading else ''
        for row in table.xpath('.//tr'):
            names=row.xpath('./th[2]/a[starts-with(@href,"/wiki/")]/@title')
            if not names or names[0]=='Name':continue
            title=names[0];is_pvp=title.endswith(' (PvP)')
            base=title[:-6] if is_pvp else title
            record=entries.setdefault(base,{'name':base,'professionHeading':profession,'campaign':slug,'pvpVariants':[],'sources':[]})
            if is_pvp and title not in record['pvpVariants']:record['pvpVariants'].append(title)
            record['sources'].append({'url':d['url'],'revision':d['revision']})
            count+=1
    assert count>100,(slug,'campaign table extraction failed',count)
assert len(entries)>1000,'Incomplete campaign coverage'
out=ROOT/'src/data/inventory';out.mkdir(exist_ok=True)
(out/'skills.json').write_text(json.dumps({'inventoryVerified':True,'method':'All player skill rows in the five Guild Wars Wiki campaign lists; PvP-only variants are grouped under their PvE skill. Raw client-only rows are excluded.','checkedAt':'2026-10-09','sources':sources,'entries':list(entries.values())},ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print('Canonical skills',len(entries),'with PvP variant',sum(bool(r['pvpVariants']) for r in entries.values()))
