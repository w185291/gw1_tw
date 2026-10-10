"""Export the exact terminology used by UI/search and an internal unresolved-name list."""
from pathlib import Path
import json,csv,re
ROOT=Path(__file__).resolve().parents[1]
load=lambda p:json.loads(p.read_text(encoding='utf-8'))
terms={}
for file in ['game-client.json','skills.json','characters.json']:
 for t in load(ROOT/'src/data/terminology'/file):terms[t['en'].casefold()]=t
categories={};references={}
def refer(en,kind,url=''):
 if not en:return
 categories[en.casefold()]=kind
 references.setdefault(en.casefold(),{'en':en,'category':kind,'sources':[]})
 if url and url not in references[en.casefold()]['sources']:references[en.casefold()]['sources'].append(url)
for p in (ROOT/'src/data/skills').glob('*.json'):
 s=load(p);refer(s['name']['en'],'skill',s['sources'][0]['url'])
 for field in ['attribute','profession','type']:refer(s[field]['en'],field)
 for group in ['trainers','bosses','quests','special','professionChangers']:
  for a in s['acquisition'][group]:refer(a['name']['en'],'quest' if group=='quests' else 'npc',a['url'])
for p in (ROOT/'src/data/heroes').glob('*.json'):
 s=load(p);refer(s['name']['en'],'hero',s['sources'][0]['url'])
for campaign in ['prophecies','factions','nightfall','eye-of-the-north']:
 for p in (ROOT/'src/data'/campaign/'missions').glob('*.json'):
  s=load(p);refer(s['name']['en'],'mission',s['wiki']['guildWarsWiki'])
  for b in s['bosses']:refer(b['name']['en'],'npc',b['source'])
  for q in s['primaryQuestBefore']+s['primaryQuestAfter']:refer(q['name']['en'],'quest',q['url']);refer(q['giver'],'npc',q['url'])
rows=[]
for key,t in sorted(terms.items()):
 ids=t.get('stringIds',[]) or [int(m) for url in t.get('sources',[]) for m in re.findall(r'/string/(\d+)',url)]
 rows.append({'en':t['en'],'zhTW':t['zhTW'],'category':categories.get(key,'game-term'),'stringIds':ids,'sources':t.get('sources',[]) or [f'game-client://2026-10-09/string/{sid}' for sid in ids]})
unresolved=[v for key,v in references.items() if key not in terms or not re.search('[\u3400-\u9fff]',terms[key]['zhTW'])]
out=ROOT/'docs/reference'
(out/'translation-correspondence.json').write_text(json.dumps(rows,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
(out/'translation-unresolved.json').write_text(json.dumps(unresolved,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
with (out/'translation-correspondence.csv').open('w',encoding='utf-8-sig',newline='') as f:
 w=csv.writer(f);w.writerow(['English','繁體中文','分類','遊戲字串ID','來源'])
 for t in rows:w.writerow([t['en'],t['zhTW'],t['category'],','.join(map(str,t['stringIds'])),' | '.join(t['sources'])])
print('UI terminology:',len(rows),'internally unresolved references:',len(unresolved))
