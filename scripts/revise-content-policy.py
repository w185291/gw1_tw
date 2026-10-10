from pathlib import Path
import json,re,shutil
from html import unescape

root=Path(__file__).resolve().parents[1]
def read(p):return json.loads(p.read_text(encoding='utf-8-sig'))
def save(p,d):p.write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
attachment=Path('C:/Users/roger/.codex/attachments/f667868f-31d8-43db-95af-344cce38ddb9/貼上的文字.txt')
shutil.copyfile(attachment,root/'docs/REQUIREMENTS_SKILLS.md')
policy='''# 2026-10-09 最新資料完整性規範

本文件及 REQUIREMENTS_SKILLS.md 優先於先前允許 stub、TODO、draft 作為交付成果的規格。

- 章名：阿斯卡隆戰記、盟與敵、黑暗逆襲；Sanctum Cay 為神聖沙灘。
- 依序補完 Prophecies、Factions、Nightfall、Eye of the North，再完成技能資料庫；技能首個完整職業為 Ritualist。
- 每關先讀 Wiki 主頁及相關任務、Boss、地圖，再自行摘要繁中攻略。至少兩個不同來源頁；同一 URL 的不同寫法不算兩個來源。
- 每關包含入口、NPC、前置、4–10 個以上實用步驟、Bonus/Master 做法、Boss 職業與菁英／危險技能及對策、失敗點、NM/HM、隊伍需求及打完去哪。
- 中文名稱須有可靠繁中來源。未確認時使用英文並標示繁中名称待確認；不得把簡轉繁當作驗證。
- 所有必填條件通過才可 contentStatus=complete，否則 incomplete。保留已研究的內容，但不可宣稱完成。
- EotN 分 Primary Quest、Story Quest、Dungeon、Hero Recruitment 與四個勢力，禁止以沒有資料當作全部完成。
- 建立各章及技能稽核清單；validate:guides、validate:skills 對缺少資料回傳 1。
- lint、型別與 Next 編譯成功不代表內容完成。正式 build 必須先通過資料檢查。
'''
(root/'docs/REQUIREMENTS_COMPLETENESS.md').write_text(policy,encoding='utf-8')
p=root/'docs/REQUIREMENTS.md';text=p.read_text(encoding='utf-8');p.write_text('> 最新規格：以 [完整性規範](REQUIREMENTS_COMPLETENESS.md) 與 [技能資料庫](REQUIREMENTS_SKILLS.md) 為優先。\n\n'+text,encoding='utf-8')
p=root/'AGENTS.md';text=p.read_text(encoding='utf-8').replace('- Never invent GW1 facts. Unknown fields are null and TODO; incomplete entries remain draft.','- Never invent GW1 facts or translate proper names without Traditional Chinese evidence. Follow docs/REQUIREMENTS_COMPLETENESS.md and docs/REQUIREMENTS_SKILLS.md above older phase rules. Missing verification means contentStatus=incomplete, never complete.');p.write_text(text,encoding='utf-8')
localization=read(root/'docs/reference/phase23/feedback-localization-bugs-traditional-chinese-zaishen-mission-quest-name.json')
terms={}
for item in re.findall(r'<li>(.*?)</li>',localization['html']):
    if '→' in item:
        en,zh=unescape(re.sub('<[^>]+>','',item)).split('→',1);terms[en]=zh
src={'title':'Guild Wars Wiki 繁中任務名稱對照（社群在地化紀錄）','url':localization['source']+'?oldid='+str(localization['revision']),'revision':localization['revision'],'checkedAt':'2026-10-09','role':'terminology'}
replacements={'第一章：預言':'第一章：阿斯卡隆戰記','第二章：陣營':'第二章：盟與敵','第三章：夜幕':'第三章：黑暗逆襲'}
for p in (root/'src/data').glob('*/missions/*.json'):
    d=read(p);en=d['name']['en'];old=d['name']['zhTW'];zh=terms.get(en)
    if zh:
        if old!=zh:replacements[old]=zh
        d['name']['zhTW']=zh;d['translationVerified']=True;d['translationStatus']='verified';d['translationSources']=[src['url']]
        if not any(s['url'].split('?')[0]==src['url'].split('?')[0] for s in d['sources']):d['sources'].append(src)
    else:
        d['name']['zhTW']=en+'（繁中名稱待確認）';d['translationVerified']=False;d['translationStatus']='needs-review';d['translationSources']=[]
    d['contentStatus']='incomplete';d['status']='draft'
    d['terminologyAudit']={'status':'incomplete','sources':[]}
    for b in d.get('bosses',[]):
        b['translationVerified']=False;b['name']['zhTW']=b['name']['en']+'（繁中名稱待確認）'
    save(p,d)
for p in (root/'src').rglob('*'):
    if p.suffix not in ['.json','.tsx','.ts']:continue
    text=p.read_text(encoding='utf-8')
    for old,new in replacements.items():text=text.replace(old,new)
    p.write_text(text,encoding='utf-8')
for id,zh in [('prophecies','阿斯卡隆戰記'),('factions','盟與敵'),('nightfall','黑暗逆襲')]:
    p=root/f'src/data/campaigns/{id}.json';d=read(p);d['name']['zhTW']=f'第{["prophecies","factions","nightfall"].index(id)+1}章：{zh}'.replace('第1','第一').replace('第2','第二').replace('第3','第三');save(p,d)
p=root/'package.json';d=read(p);d['scripts']['validate:guides']='tsx scripts/validate-guide-content.ts';d['scripts']['validate:skills']='tsx scripts/validate-skills.ts';d['scripts']['build']='npm run validate:guides && npm run validate:skills && npm run validate:content && next build --webpack';d['scripts']['build:static']='npm run validate:guides && npm run validate:skills && npm run validate:content && node scripts/build-static.mjs';save(p,d)
print('Updated names, evidence, status and authoritative policy; preserved all guide content.')
