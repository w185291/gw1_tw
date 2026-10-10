"""Display researched skill lists without disguising verified absence as missing data."""
from pathlib import Path
import json

ROOT=Path(__file__).resolve().parents[1]
p=ROOT/'src/templates/MissionDetailTemplate.tsx'
s=p.read_text(encoding='utf-8')
old="{b.importantSkills.length?<LocalizedText text={b.importantSkills.join('、')}/>:'技能待查核'}"
new="{b.importantSkills.length?<LocalizedText text={b.importantSkills.join('、')}/>:b.skillListVerified?b.skillListNotes:'技能尚未核對'}{b.eliteSkillsVerified&&<p><strong>可捕捉菁英：</strong>{b.eliteSkills.length?<LocalizedText text={b.eliteSkills.join('、')}/>:'沒有固定可捕捉菁英'}</p>}"
if old in s:s=s.replace(old,new)
old="<LocalizedText text={[b.strategy,...b.notes].filter(Boolean).join(' ')}/>"
new="<LocalizedText text={[b.strategy,...b.notes].filter(Boolean).join(' ')}/>{b.dangerousSkills.length>0&&<ul>{b.dangerousSkills.map(skill=><li key={skill.name}><strong><LocalizedText text={skill.name}/></strong>：{skill.counter}</li>)}</ul>}"
if old in s:s=s.replace(old,new)
p.write_text(s,encoding='utf-8')

# Extraction ran read-only; record the actual before/after comparison.
extraction=Path('C:/Users/roger/Documents/激戰/攻略研究/game-extraction-20261009')
before=json.loads((extraction/'input-hashes-before.json').read_text(encoding='utf-8-sig'))
after=json.loads((extraction/'input-hashes-after.json').read_text(encoding='utf-8-sig'))
assert {x['Path']:x['Hash'] for x in before}=={x['Path']:x['Hash'] for x in after},'Game inputs changed; investigate before claiming preservation'
evidence=ROOT/'docs/reference/game-client-evidence.json'
data=json.loads(evidence.read_text(encoding='utf-8'))
data['inputPreservation']={'verified':True,'method':'SHA-256 before and after offline extraction','files':[{'file':Path(x['Path']).name,'sha256':x['Hash']} for x in after]}
evidence.write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print('Boss display updated; all three game input SHA-256 hashes unchanged.')
