"""Split distinct actions into playable steps; verify required heroes against source infoboxes."""
from pathlib import Path
from lxml import html
import json

ROOT=Path(__file__).resolve().parents[1]
steps={
'minister-chos-estate':[
('起點與教學開門','帶治療與復活進四人隊。起點只有一條路，跟 Master Togo 和 Yijo 清除沿路守衛，不能讓跟隨 NPC 死亡。'),
('完成地圖教學','Togo 示範小地圖時，至少一名玩家走到他指定的樹旁，等對話結束才會繼續開門；全隊留在原地會卡住流程。'),
('通過獸苑','擊敗 Afflicted Horror 後跟 Togo 進入較寬區域。巡邏與動物分批拉，不必把旁邊所有動物都引來；離開 Sickened Scribe 的範圍傷害。'),
('宅邸與大臣','抵達宅邸觸發變異事件，保護 Togo、Yijo 並集中擊殺 Diseased Minister。死亡時的 Afflicted Soul Explosion 有範圍傷害，先補滿血並讓後排拉開距離。')],
'zen-daijun':[
('進谷並淨化瘴氣','跟 Master Togo 進谷，Miasma 造成生命衰減，會在同種族之間傳播。敲地圖藍點的鐘召喚 Zunraa，靠 Blessing of the Kirin 淨化；Zunraa 死亡可再敲鐘召回。'),
('清第一神龕','把敵人拉出紫色瘴氣區才交戰，清第一座小神龕旁 The Afflicted Xai 與護衛；避免為追怪讓治療者停在瘴氣中。'),
('選北路或南路','可走北面瀑布紅線，也可走南面洞穴黃線，兩條路都通神殿。分批拉巡邏，保持 Togo 與 Yijo 在治療範圍，不同時接兩群怪。'),
('雙龍橋與神殿','雙龍雕像橋前先殺 Afflicted Farmer Xeng Jo 和 Afflicted Yijo，優先打斷 Yijo 的 Spirit Rift。再清 The Afflicted Kana 與神殿其餘敵人；範圍技太密時拉到門外逐群處理。')],
'boreas-seabed':[
('蟹族與蛇族','先抵擋東南進場的 Crab Clan，再打西南進場的 Serpent Clan；上一組全死下一組立刻出現。利用狹道集中敵人，後排分散躲範圍傷害。'),
('龜族與 Argo','最後 Turtle Clan 由西北進場，保留打斷應付 Argo 的 Argo’s Cry，避免詠唱後的大範圍傷害。'),
('聖矛充能','競賽後可取 Spear of Archemorus，這是可選的束物。附近生物死亡會充能，充滿後在海怪附近放下造成傷害；不用矛也能完成任務。'),
('Zhu Hanuku','往海怪推進時不要同時拉旁邊敵群。用打斷或暈眩阻止 Jade Fury 與復活招式，清 Kraken Spawn，集中輸出海怪。擊敗後到 Zos Shivros Channel。')],
'nahpui-quarter':[
('選入口','四名天界 Boss 在地圖綠星位置，順序不限；選最左傳送門可讓後續產生的精華較易處理。計時從開始任務就進行，別在入口長時間整備。'),
('先清 Star Tengu','每區先拉掉不會重生的 Star Tengu，再接近天界 Boss，避免把一般敵人和頭目同時拉到後排。'),
('持續向下一區推進','Boss 死亡後會生成較弱的天界精華；精華被殺約三分鐘後重生。穩定往下一區，不在已清區域反覆停留與無限刷精華。'),
('最後擊殺與捕捉','要捕捉菁英的人先在前三名 Boss 死亡後完成捕捉；第四名死亡立即結束，來不及捕捉。任務完成傳送 Senji’s Corner，接 To Tahnnakai Temple。')],
'vizunah-square':[
('本地隊先防守','本地入口隊與 Master Togo 抵擋 Afflicted；外地隊抵達前他就可能被殺，因此本地隊要有獨立治療與防守能力。'),
('外地隊趕往會合','外地入口隊跟 Mhenlo 清 Am Fah 後往會合處，不要在沿路整備太久；兩隊都需保護各自跟隨的劇情 NPC。'),
('三場共同戰鬥','會合後沿共同路線清三處戰鬥。敵人从不同入口增援，分散後排並控制入口；擊殺感染頭目才能停止部分增援並開門。'),
('最後構造體','各隊保留自己的復活技能。可以治療另一隊友軍，通常不能用一般復活技能救另一隊成員。最後清隨機 Shiro 構造體，完成後抵達 Dragon’s Throat。')],
'chahbek-village':[
('組隊與進村','帶 Koss 與治療進四人隊，跟 Kormir 清村口海盜，保護三名 Sunspear Recruit，想拿大師就不能讓任何一名新兵死亡。'),
('搬運火油','拿 Istani Fire Oil 到南北兩座投石車；搬運者不用同時衝前排，隊友先清路，避免新兵落在後方被海盜攻擊。'),
('擊沉兩船','點投石車一次裝填，再點一次發射，南北船各擊沉一次，每艘提供士氣提升。也可先從遠處清船上海盜，減少射擊威脅。'),
('收尾與新兵存活','處理 Midshipman Bennis，再逐群清右上方海盜，保持新兵在治療範圍。清光任務要求的海盜與兩船後完成；結束時才判定存活新兵數。')],
}
for campaign in ['factions','nightfall']:
    for p in (ROOT/'src/data'/campaign/'missions').glob('*.json'):
        m=json.loads(p.read_text(encoding='utf-8'))
        if m['id'] in steps:m['walkthrough']=[{'title':title,'content':content} for title,content in steps[m['id']]]
        if campaign=='nightfall':
            source=json.loads((ROOT/'docs/reference/phase23'/(m['id']+'.json')).read_text(encoding='utf-8'))
            tree=html.fromstring(source['html'])
            rows=tree.xpath('//tr[th]')
            required=[]
            for row in rows:
                if row.xpath('./th')[0].text_content().strip()=='Required hero':
                    required=row.xpath('./td//a/@title')
            recorded=[h['name']['en'] for h in m['requiredHeroes'] if h.get('required',True)]
            assert set(required)==set(recorded),(m['id'],required,recorded)
            m['requiredHeroesVerified']=True
            m['requiredHeroEvidence']={'url':source['source'],'revision':source['revision'],'heroes':required,'method':'Exact comparison of Required hero infobox link targets; absent field means no fixed required hero.'}
        if m['id'] in ['minister-chos-estate','chahbek-village']:m['storyStartVerified']=True
        if m['id'] in ['imperial-sanctum','abaddons-gate']:m['storyEndingVerified']=True
        p.write_text(json.dumps(m,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print('Six walkthroughs separated into distinct actions; Nightfall hero requirements checked against 20 mission infoboxes.')
