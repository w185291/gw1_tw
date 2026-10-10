"""Compare all stored proper names with the evidence-backed client glossary."""
import json
from pathlib import Path

root=Path(__file__).resolve().parents[1]
def read(file):return json.loads(file.read_text(encoding='utf-8'))
terms={t['en'].casefold():t['zhTW'] for t in read(root/'src/data/terminology/game-client.json')}
issues=[]
pending=[]
names=[]
def walk(value,path):
    if isinstance(value,dict):
        name=value.get('name')
        if isinstance(name,dict) and name.get('en'):
            names.append(path)
            expected=terms.get(name['en'].casefold())
            user_override='campaigns/' in path and value.get('id') in ['prophecies','factions','nightfall']
            if expected and name.get('zhTW')!=expected and not user_override:
                issues.append({'path':path,'en':name['en'],'shown':name.get('zhTW'),'verified':expected})
            if value.get('translationVerified') is False or value.get('translationStatus')=='needs-review':
                pending.append({'path':path,'en':name['en']})
        for key,item in value.items():walk(item,path+'/'+key)
    elif isinstance(value,list):
        for i,item in enumerate(value):walk(item,path+'/'+str(i))
for file in (root/'src/data').rglob('*.json'):
    if not {'inventory','terminology'}.intersection(file.parts):walk(read(file),file.relative_to(root).as_posix())
report={'checkedAt':'2026-10-10','scope':'Stored name objects against verified client glossary; does not certify untranslated names or full prose.','namedObjects':len(names),'unverifiedObjects':len(pending),'conflicts':issues,'pending':pending}
(root/'docs/content-audit/translation-consistency.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(f'{len(names)} named objects; {len(pending)} unverified; {len(issues)} glossary conflicts.')
raise SystemExit(bool(issues))
