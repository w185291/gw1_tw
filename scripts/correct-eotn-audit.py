"""One-time correction from reviewed Wiki revisions; no game files are modified."""
import json
from copy import deepcopy
from pathlib import Path

root=Path(__file__).resolve().parents[1]
folder=root/'src/data/eye-of-the-north/missions'
def load(id):return json.loads((folder/(id+'.json')).read_text(encoding='utf-8'))
def save(m):(folder/(m['id']+'.json')).write_text(json.dumps(m,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')

m=load('against-the-destroyers')
m['modes']={'normal':False,'hard':False}
m['nextMission']='northern-allies'
m['routeChoice']='三方分支都必須完成，先後不限；目前網站僅刊出 Norn 分支入口，不能據此省略另兩方。'
save(m)

n=deepcopy(m)
n.update(id='northern-allies',order=3,name={'en':'Northern Allies','zhTW':'Northern Allies（繁中名稱待確認）'},aliases=['Northern Allies'],tags=['極地之眼','主線 Quest','Norn 總覽'],branch='Norn 總覽',routeChoice='熊與鴉兩條都要完成，先後不限。',summary='Norn 整條主線的進度追蹤任務；完成熊、鴉兩路後，必須找 Jalis Ironhammer 回報領獎。',previousMission='against-the-destroyers',nextMission='tracking-the-nornbear',storyStartVerified=False,storyEndingVerified=False)
n['entryMethod']={'type':'quest','description':'Against the Destroyers 的 First Vision 會引導 Norn 分支；到 Hall of Monuments 和 Ogden Stonehealer 對話，再到 Eye of the North 外的 Ice Cliff Chasms 找 Jora，接受追蹤 Nornbear 的任務。','location':'Hall of Monuments → Ice Cliff Chasms，Jora','requirements':['已進入極地之眼，完成 Against the Destroyers 的 First Vision 引導。']}
n['routeSummary']=n['entryMethod']['description']
n['objectives']=[{'text':'完成 Curse of the Nornbear、Blood Washes Blood 與 A Gate Too Far，取得 Norn 的援助，再向 Jalis Ironhammer 領獎。'}]
n['walkthrough']=[
 {'title':'先找 Ogden 與 Jora','content':'依日誌在 Hall of Monuments 找 Ogden Stonehealer，再出 Eye of the North 到 Ice Cliff Chasms 找 Jora。向她接 Tracking the Nornbear，這份總覽會持續追蹤整條 Norn 主線。'},
 {'title':'追蹤與解除詛咒','content':'沿 Tracking the Nornbear 路線經 Gunnar’s Hold 到 Sifhalla，完成防守並領獎，再進行 Curse of the Nornbear。完成後招募 Jora，開啟熊與鴉兩條後續。'},
 {'title':'熊分支恢復榮譽','content':'到 Jaga Moraine 中央找 Egil Fireteller，完成 Flames of the Bear Spirit 並領獎，再完成 Blood Washes Blood。先做熊或先做鴉皆可，但不能只做一條。'},
 {'title':'鴉分支取得盟友','content':'到 Olafstead 找 Olaf Olafson，完成 Vision of the Raven Spirit 並領獎，再由他進入 A Gate Too Far。Sif 提供 Olaf／Egil 位置的詢問是可選步驟，不能把兩份故事副本當作擇一。'},
 {'title':'向 Jalis 領總覽獎勵','content':'熊與鴉兩條都完成後，依日誌前往矮人區域找 Jalis Ironhammer；接近他會播放 Audience with the King，再向他領 Northern Allies 獎勵。換區後會出現 Call of the Eye；回 Hall of Monuments 推進 Against the Destroyers。三方總覽都完成後才有 Final Vision。'}]
n['afterCompletion']=['向 Jalis Ironhammer 領取 10,000 經驗、1,000 Norn 聲望與 Monumental Tapestry。','換區後出現 Call of the Eye；回 Hall of Monuments 更新 Against the Destroyers。Asura、Ebon Vanguard 若尚未完成，仍須補完。']
n['warnings']=['兩條分支皆須完成，不能把它們當成替代路線。','個別副本通關與 Northern Allies 領獎是不同步驟；兩路完成後仍要找 Jalis 回報。']
n['bossAbsenceReason']='本任務是 Norn 分支總覽，沒有獨立 Boss 戰；戰鬥請依三份故事副本攻略。'
n['mapNotes']=['Wiki 本頁沒有獨立行走圖；行走路線請參閱各子任務原圖。']
n['modeDifferences']={'normal':['進度追蹤任務沒有獨立 NM 入口；子任務按各自方式開始。'],'hard':['總覽沒有獨立 HM 入口，只有可重玩的故事副本另外選 HM。']}
n['rewards']={'normal':[{'label':'總覽任務獎勵','experience':10000,'gold':None,'skillPoints':None,'notes':['1,000 Norn 聲望、Monumental Tapestry；由 Jalis Ironhammer 發給。']}],'hard':[],'bonus':[],'zaishen':[],'reforged':[]}
ref=json.loads((root/'docs/reference/completeness/northern-allies.json').read_text(encoding='utf-8'))
n['wiki']['guildWarsWiki']=ref['url']
n['sources']=[{'title':'Guild Wars Wiki：Northern Allies','url':ref['url'],'revision':ref['revision'],'checkedAt':'2026-10-10','role':'mechanics'},n['sources'][1]]
save(n)
for id in ['blood-washes-blood','a-gate-too-far']:
 m=load(id)
 m['afterCompletion'][-1]='若另一條 Norn 分支尚未完成，先補完；兩路都完成後依 Northern Allies 日誌找 Jalis Ironhammer 領總覽獎勵，再回 Hall of Monuments 更新全章進度。'
 save(m)
for id in ['a-gate-too-far','curse-of-the-nornbear','vision-of-the-raven-spirit']:
 m=load(id)
 for step in m['walkthrough']:step['title']=step['title'].replace('两','兩');step['content']=step['content'].replace('绕','繞')
 m['afterCompletion']=[s.replace('后续','後續') for s in m['afterCompletion']]
 save(m)
cpath=root/'src/data/campaigns/eye-of-the-north.json'
c=json.loads(cpath.read_text(encoding='utf-8'))
c['description']=c['description'].replace('八份','九份')
if not any(node['entry']=='northern-allies' for node in c['flow']):
 c['flow'].insert(2,{'entry':'northern-allies','requires':['against-the-destroyers'],'branch':'Norn 總覽（兩路皆須完成）'})
for node in c['flow']:
 if node['entry']=='tracking-the-nornbear':node['requires']=['northern-allies']
cpath.write_text(json.dumps(c,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
for order,node in enumerate(c['flow'],1):
 m=load(node['entry']);m['order']=order;save(m)
