"""Regression checks for research imports that can otherwise produce plausible wrong guides."""
from pathlib import Path
import json

ROOT=Path(__file__).resolve().parents[1]
def data(p):return json.loads((ROOT/p).read_text(encoding='utf-8'))
def mission(order,slug):return data(f'src/data/prophecies/missions/{order:02}-{slug}.json')
dragon=mission(19,'the-dragons-lair')
assert any(b['name']['en']=='Glint' and 'Crystal Hibernation' in b['importantSkills'] for b in dragon['bosses'])
final=mission(25,'hells-precipice')
lich=next(b for b in final['bosses'] if b['name']['en']=='Undead Lich')
assert 'Soul Vortex' in lich['importantSkills']
assert not {'Hunger of the Lich','Life Vortex'}&set(lich['importantSkills']),'Nightfall skills leaked into Prophecies encounter'
clone=mission(18,'augury-rock')['bosses'][0]
assert clone['name']['en']=='Doppelganger' and clone['importantSkills']==[] and clone['skillListVerified']
tree=next(b for b in mission(11,'bloodstone-fen')['bosses'] if b['name']['en']=='Tree of Winds')
assert not tree['importantSkills'] and tree['skillListVerified'] and 'None' in tree['skillListNotes']
aurora=mission(12,'aurora-glade')
helping=next(q for q in aurora['primaryQuestBefore'] if q['name']['en']=='White Mantle Wrath: A Helping Hand')
assert helping['optional'] is True
assert mission(15,'dunes-of-despair')['primaryQuestBefore'][0]['questType']=='secondary'
assert mission(14,'sanctum-cay')['name']['zhTW']=='神聖沙灘'
assert mission(1,'the-great-northern-wall')['maps'][0]['role']=='main_route'
for p in (ROOT/'src/data/nightfall/missions').glob('*.json'):
    m=json.loads(p.read_text(encoding='utf-8'))
    assert m['requiredHeroesVerified'] and m['requiredHeroEvidence']['revision']
assert data('docs/reference/game-client-evidence.json')['inputPreservation']['verified']
inventory=data('src/data/inventory/skills.json')
assert inventory['inventoryVerified'] and len(inventory['entries'])>1000
assert any(s['name']=='Soul Twisting' and 'Soul Twisting (PvP)' in s['pvpVariants'] for s in inventory['entries'])
madness=data('src/data/nightfall/missions/gate-of-madness.json')
assert not {"Lightbringer's Gaze",'Spawn'}&{b['name']['en'] for b in madness['bosses']},'Footnotes imported as NPCs'
shiro=next(b for b in madness['bosses'] if b['name']['en']=='Shiro Tagachi')
assert 'Impossible Odds' in shiro['importantSkills'] and 'Echoing Banishment' not in shiro['importantSkills']
imperial=data('src/data/factions/missions/imperial-sanctum.json')
shiro=next(b for b in imperial['bosses'] if b['name']['en']=='Shiro Tagachi')
assert 'Echoing Banishment' in shiro['importantSkills'] and 'Invulnerability' not in shiro['importantSkills']
for id,included,excluded in [('jennurs-horde','Hundred Blades','Dismember'),('nundu-bay','Dismember','Hundred Blades')]:
    m=data('src/data/nightfall/missions/'+id+'.json')
    b=next(b for b in m['bosses'] if b['name']['en']=='Harbinger of Nightfall')
    assert included in b['importantSkills'] and excluded not in b['importantSkills'],id+' skill list mixed between missions'
print('Research regression checks passed: final Bosses, campaign-specific skills, copied skill bar, verified empty skill lists, quest branches, hero evidence, map role and input preservation.')
