from pathlib import Path
from collections import defaultdict
import json,re,hashlib
ROOT=Path(__file__).resolve().parents[1]
EXTRACT=Path('C:/Users/roger/Documents/激戰/攻略研究/game-extraction-20261009')
raw=json.loads((EXTRACT/'text-pairs.json').read_text(encoding='utf-8'))
by=defaultdict(list)
for sid,p in raw.items():
    if 1<=len(p['en'])<=120 and re.search('[\u3400-\u9fff]',p['zhTW']) and '%' not in p['en']:
        by[p['en'].casefold()].append({'stringId':int(sid),'en':p['en'],'zhTW':p['zhTW']})
terms={k:v for k,v in by.items() if len({x['zhTW'] for x in v})==1}
used={};conflicts=[]
def lookup(en):
    matches=terms.get(en.casefold(),[])
    if matches:used[en]=matches;return matches[0]['zhTW']
    if en.casefold() in by:conflicts.append({'en':en,'candidates':by[en.casefold()]})
    return None
def apply_name(d):
    if not isinstance(d,dict):return
    if isinstance(d.get('name'),dict) and d['name'].get('en'):
        en=d['name']['en'];zh=lookup(en)
        if zh:
            d['name']['zhTW']=zh;d['translationVerified']=True;d['translationStatus']='verified';d['translationSources']=['game-client://2026-10-09/string/'+str(x['stringId']) for x in used[en]]
            d['gameTextEvidence']={'stringIds':[x['stringId'] for x in used[en]],'manifest':'docs/reference/game-client-evidence.json'}
    for key,value in list(d.items()):
        if key in ['sources','translationSources','gameTextEvidence']:continue
        if isinstance(value,dict):apply_name(value)
        elif isinstance(value,list):
            for item in value:
                if isinstance(item,dict):apply_name(item)
for p in (ROOT/'src/data').rglob('*.json'):
    d=json.loads(p.read_text(encoding='utf-8'));apply_name(d)
    if p.parent.name=='campaigns' and d['id'] in ['prophecies','factions','nightfall']:
        word={'prophecies':'Prophecies','factions':'Factions','nightfall':'Nightfall'}[d['id']]
        zh=lookup(word)
        # Some UI strings intentionally retain the English release name; explicit user terms take priority.
        zh={'prophecies':'阿斯卡隆戰記','factions':'盟與敵','nightfall':'黑暗逆襲'}[d['id']]
        d['name']['zhTW']=f'第{["一","二","三"][d["order"]-1]}章：{zh}'
    p.write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
# Build an evidence-backed glossary only for terms actually referenced by current structured data.
corpus='\n'.join(p.read_text(encoding='utf-8') for p in (ROOT/'src/data').rglob('*.json'))
for candidates in terms.values():
    en=candidates[0]['en']
    if len(en)>=3 and en in corpus:lookup(en)
hashes=json.loads((EXTRACT/'input-hashes-before.json').read_text(encoding='utf-8-sig'))
evidence={'checkedAt':'2026-10-09','method':'Match English and Traditional Chinese by identical language-independent string ID. Only unanimous Chinese translations accepted; English fallback is not verification.','extractorRepository':'https://github.com/Fournux/Tyria-Extractor','upstreamCommit':'b164db52bcefccfd539fac40e3e19aafce0262d3','localChanges':['Current client language table uses 100 blocks × 11 languages, verified by one 1100-pointer PE table.','Added offline text-pair export; no injection or runtime capture.'],'inputs':[{'file':Path(x['Path']).name,'sha256':x['Hash']} for x in hashes],'pairedStringCount':len(raw),'acceptedReferencedTerms':used,'conflicts':conflicts}
after_path=EXTRACT/'input-hashes-after.json'
if after_path.exists():
    after=json.loads(after_path.read_text(encoding='utf-8-sig'))
    assert {x['Path']:x['Hash'] for x in hashes}=={x['Path']:x['Hash'] for x in after}
    evidence['inputPreservation']={'verified':True,'method':'SHA-256 before and after offline extraction','files':[{'file':Path(x['Path']).name,'sha256':x['Hash']} for x in after]}
(ROOT/'docs/reference/game-client-evidence.json').write_text(json.dumps(evidence,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
(ROOT/'src/data/terminology').mkdir(exist_ok=True)
(ROOT/'src/data/terminology/game-client.json').write_text(json.dumps([{'en':en,'zhTW':items[0]['zhTW'],'stringIds':[x['stringId'] for x in items]} for en,items in sorted(used.items())],ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(json.dumps({'pairedStrings':len(raw),'acceptedReferencedTerms':len(used),'conflicts':len(conflicts)},ensure_ascii=False))
