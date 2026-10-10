from pathlib import Path
import json
ROOT=Path(__file__).resolve().parents[1]
records=[
('Warrior','戰士','Core','Strength','力量','斧、鎚、劍','以近戰武器與怒氣技能持續攻擊，姿態和戰術可增加生存或支援隊伍。','每點力量使攻擊技能增加 1% 防禦穿透。一般普攻不因力量直接獲得這項穿透。','注意怒氣累積、攻擊速度姿態和武器專精；選定一種武器投入屬性。'),
('Ranger','遊俠','Core','Expertise','專精','弓、動物夥伴','以弓箭、寵物、準備、陷阱與自然儀式作戰，也能用技能打斷與施加病症。','每點專精使攻擊、儀式、碰觸技能與遊俠技能的能量消耗降低 4%；並非所有副職業法術都受益。','自然儀式可能同時影響敵我；使用前讀清楚影響對象，寵物需合適技能才能隨行。'),
('Monk','僧侶','Core','Divine Favor','神恩','法杖、法器','治療禱言回復體力，防護禱言預防傷害，懲戒禱言則可用於輸出。','對友軍施放僧侶法術時提供额外治療，也強化與神恩相關的技能。','治療與預防傷害的時機不同；留意能量、解病症與解降咒需求，避免只帶補血。'),
('Necromancer','死靈法師','Core','Soul Reaping','靈魂吸取','法杖、法器、不死僕從','以血魔法偷取體力、詛咒削弱敵人、死亡魔法利用屍體與召喚僕從。','附近非靈體生物死亡時，每點靈魂吸取回復 1 能量；每 15 秒最多觸發三次。','犧牲體力有風險；屍體是資源，不同召喚或泉井技能可能競爭同一具屍體。'),
('Mesmer','幻術師','Core','Fast Casting','快速施法','法杖、法器','以打斷、能量操作、降咒與直接傷害干擾敵人；支配、幻術、靈感各有不同用途。','縮短法術與紋章施放時間。非幻術師、原施法時間短於 2 秒的技能不受影響；PvE 每點另使幻術師法術冷卻時間縮短 3%。','打斷要看敵人動作；某些降咒只在對方施法、攻擊或不使用技能時生效。'),
('Elementalist','元素使','Core','Energy Storage','能量儲存','法杖、法器','氣、地、火、水四種元素提供傷害、控制、致盲、防護與緩速。','每點能量儲存增加 3 最大能量，也強化相應的能量管理技能。','最大能量多不等於回復快；管理調和與超載，並依敵人防禦及隊伍需求選元素。'),
('Assassin','刺客','Factions','Critical Strikes','致命攻擊','匕首','以先導、副手、雙重攻擊串起連段，使用暗影步切入或脫離。','每點提高致命一擊機率 1%，致命一擊時可回復能量；回復量依屬性門檻增加。','先導與副手前置不能隨意省略；缺少前置或被格擋時，後續連段可能失敗。'),
('Ritualist','祭祀','Factions','Spawning Power','召喚力量','法杖、法器、靈體與骨灰','以縛靈儀式召喚靈體，武器法術支援隊友，恢復魔法治療，導引魔法提供傷害。','每點使你創造或召喚的生物體力增加 4%，武器法術持續時間增加 4%。','靈體固定位置，推進時需要重新佈置；武器法術與加持不同，不能用一般拆加持處理。'),
('Paragon','聖言者','Nightfall','Leadership','領導','長矛、盾','以喊話、聖歌與迴響支援隊伍，同時以長矛作遠程攻擊。','每名受到喊話或聖歌影響的友軍提供 2 能量；單次回復上限由領導屬性每 2 點增加 1 能量。','留意聽距與影響的人數；聖歌觸發條件、喊話結束與迴響重新套用不是同一件事。'),
('Dervish','神喚','Nightfall','Mysticism','神秘','鐮刀','以鐮刀攻擊面前最多三名相鄰敵人，並透過神喚加持的施放與移除觸發效果。','每點使神喚加持能量消耗降低 4%；PvE 有加持時另增加每點 1 防禦。','閱讀技能是否移除神喚加持、移除後觸發什麼；不要把有用的加持過早消耗。'),
]
result=[]
for en,zh,campaign,primary,primaryzh,weapons,summary,mechanic,tip in records:
 a=json.loads((ROOT/'docs/reference/completeness'/f'{en.lower()}.json').read_text(encoding='utf-8'))
 result.append({'id':en.lower(),'en':en,'zhTW':zh,'campaign':campaign,'primaryAttribute':{'en':primary,'zhTW':primaryzh},'weapons':weapons,'summary':summary,'primaryMechanic':mechanic.replace('额','額'),'tip':tip,'source':{k:a[k] for k in ['url','title','revision','checkedAt']}})
(ROOT/'src/data/professions.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
