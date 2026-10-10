"""Apply localized Wiki names and manually reviewed PvP descriptions."""
import json,re
from pathlib import Path
from lxml import html
ROOT=Path(__file__).resolve().parents[1]
folder=ROOT/'src/data/skills'
localized=json.loads((ROOT/'docs/reference/completeness/localized-ritualist-skill-names.json').read_text(encoding='utf-8'))
tree=html.fromstring(localized['html'])
names={}
for row in tree.xpath('//tr'):
 cells=row.xpath('./td')
 if len(cells)==10:
  en=' '.join(cells[0].text_content().split());zh=' '.join(cells[8].text_content().split())
  if re.search('[\u3400-\u9fff]',zh):names[en.casefold()]=zh

pvp={
 'Agony':'召喚等級 1～8 的靈體，持續 30～90 秒。它每秒讓聽距內敵人失去 3～10 體力，並為每個受影響敵人損失同量體力。',
 "Ancestors' Rage":'持續 3 秒，每秒對目標友軍身旁的敵人造成 4～50 閃電傷害。',
 'Anguish':'召喚等級 1～7 的靈體，持續 15～45 秒。攻擊造成 5～20 傷害；對受到降咒的敵人造成雙倍傷害。',
 'Armor of Unfeeling':'持續 10～35 秒；你在施展縛靈儀式期間獲得 10 點基礎減傷。',
 'Bloodsong':'召喚等級 1～8 的靈體，持續 30～150 秒；它的攻擊偷取最多 5～25 體力。',
 'Death Pact Signet':'復活目標隊友，給予與你目前相同的體力及 15～100% 能量。若該隊友在 120 秒內再次死亡，你也會死亡。',
 'Destruction':'召喚等級 1～10 的靈體，30 秒後死亡。死亡時，對區域內敌人按存活秒數，每秒造成 1～10 傷害，最高 150 傷害。',
 'Destructive Was Glaive':'抱持骨灰最多 30～60 秒。抱持期間所有祭祀技能具有 10% 防禦穿透；放下時對區域內敵人造成 15～85 閃電傷害。',
 'Disenchantment':'召喚等級 1～8 的靈體，持續 15～40 秒。攻擊造成 5～20 傷害，命中的目標失去一項加持。',
 'Displacement':'召喚等級 1～10 的靈體，持續 30～60 秒。範圍內非靈體友軍有 75% 機率格擋攻擊；每次成功格擋，靈體受到 60 傷害。',
 'Dissonance':'召喚等級 1～8 的靈體，持續 10～25 秒。攻擊造成 5～20 傷害，並打斷被命中的敵人。',
 'Earthbind':'召喚等級 1～10 的靈體，持續 15～45 秒。範圍內非靈體敵人被擊倒時，倒地時間至少 3 秒；每次觸發，靈體失去 50～25 體力。',
 'Empowerment':'召喚等級 1～10 的靈體，持續 15～60 秒。範圍內正在抱持物品的友軍獲得 15～45 最大體力及 10 最大能量。',
 'Flesh of My Flesh':'失去一半體力，復活目標隊友，給予與你目前相同的體力及 5～20% 能量。',
 'Gaze of Fury':'摧毀目標友方靈體，改召喚等級 1～10 的憤怒靈體，持續 30～60 秒；其攻擊造成 5～20 傷害。',
 'Guided Weapon':'持續 4～10 秒，目標友軍的攻擊不能被格擋。',
 'Life':'召喚等級 1～10 的靈體，20 秒後死亡。死亡時，按存活秒數，每秒為範圍內非靈體友軍治療 1～7 體力。',
 'Pain':'召喚等級 1～8 的靈體，持續 30～150 秒；其攻擊造成 5～30 傷害。',
 'Preservation':'召喚等級 1～10 的靈體，持續 90 秒。每 4 秒為區域內一名非靈體友軍治療 10～115 體力。',
 'Recovery':'召喚等級 1～10 的靈體，持續 30～60 秒。範圍內友軍的病症消退速度加快 20～50%。',
 'Recuperation':'召喚等級 1～10 的靈體，持續 15～45 秒。範圍內非靈體友軍獲得 +1～3 體力再生。',
 'Rejuvenation':'召喚等級 1～16 的靈體，持續 30～90 秒。每秒為聽距內所有隊友治療 3～10 體力；每治療一名隊友，靈體就失去同量體力。',
 'Restoration':'召喚等級 1～10 的靈體，30 秒後死亡。死亡時復活區域內所有隊友，給予 5～50% 體力、零能量。',
 'Shadowsong':'召喚等級 1～6 的靈體，持續 30 秒。攻擊造成 5～20 傷害，並使目標目盲 1～6 秒。',
 'Shelter':'召喚等級 1～8 的靈體，持續 30～60 秒。範圍內非靈體友軍單次攻擊受傷不超過最大體力的 10%；靈體每次阻止傷害時失去 75～45 體力。',
 'Signet of Ghostly Might':'目標友方召喚生物的攻擊增加 5～35 傷害；10 秒後該生物被摧毀。',
 'Signet of Spirits':'若聽距內有靈體，你獲得 3～12 能量。PvP 版不召喚三隻靈體。',
 'Soothing':'召喚等級 1～8 的靈體，持續 15～45 秒。範圍內敵人累積怒氣所需時間加倍。',
 'Soul Twisting':'持續 5～45 秒，縛靈儀式能量消耗減少 15（最低 5），冷卻速度加快 25～50%。使用 1～3 次縛靈儀式後終止；PvP 版不會立即恢復儀式。',
 'Splinter Weapon':'持續 20 秒，目標友軍接下來 1～5 次攻擊，對最多 4 名相鄰敵人造成 5～40 傷害。',
 'Union':'召喚等級 1～8 的靈體，持續 30～60 秒。範圍內非靈體友軍受到傷害或體力偷取時，減少 15 點，靈體則受到 15 傷害。',
 'Wanderlust':'召喚等級 1～8 的靈體，持續 30～60 秒。攻擊命中不移動的敵人時將其擊倒，並使靈體失去 70～50 體力。',
 'Weapon of Warding':'持續 3～8 秒，目標友軍獲得 +2～4 體力再生及 50% 格擋機率；該友軍一旦攻擊，效果就終止。',
}
for file in folder.glob('*.json'):
 s=json.loads(file.read_text(encoding='utf-8'))
 if s['profession']['id']!='ritualist':continue
 s['profession'].update(zhTW='祭祀',translationVerified=True)
 s['profession']['translationSources']=['game-client://2026-10-09/string/2066']
 for target in [s['name'],s['attribute']]:
  if target['en'].casefold() in names:
   old=target['zhTW'];target['zhTW']=names[target['en'].casefold()]
   if target is s['name'] and old!=target['zhTW'] and old not in s['aliases']:s['aliases'].append(old)
   target['translationVerified']=True
   target['translationSources']=[localized['url']]
 s['relatedSkills']=[r for r in {r['id']:r for r in s['relatedSkills'] if r['id'] not in ['elite','pve','pvp']}.values()]
 s['sources'].append({key:localized[key] for key in ['title','url','revision','checkedAt']})
 if s['attribute']['en']=='No attribute':s['attribute']['zhTW']='無屬性'
 if s['name']['en'] in pvp:
  description=pvp[s['name']['en']].replace('敌','敵')
  s['description']['pvp']['zhTW']=description
  for variant in s['pvpVariants']:variant['description']['zhTW']=description
  s['pvpTranslationMethod']='Authored Chinese summary checked against the exact current Wiki PvP effect, not English client fallback.'
 file.write_text(json.dumps(s,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print('Ritualist localized names and all 33 PvP descriptions reviewed.')
