import fs from 'node:fs';
import path from 'node:path';
const read=file=>JSON.parse(fs.readFileSync(file,'utf8'));
const pages=read('docs/reference/zaishen-lookup/pages.json');
const rotation=read('src/data/zaishen/rotation.json');
const locale=read('src/data/zaishen/locale.json');
const bounties=read('src/data/zaishen/bounties.json');
const terms=new Map([...read('src/data/terminology/game-client.json'),...read('src/data/terminology/characters.json')].map(t=>[t.en,t.zhTW]));
for(const [en,zh] of Object.entries(locale.translations))if(!terms.has(en))terms.set(en,zh);
const name=en=>terms.get(en)??en;
const label=en=>name(en)===en?en:`${name(en)}（${en}）`;
const plain=s=>s.replace(/<!--[\s\S]*?-->/g,'').replace(/\{\{[^{}]*\}\}/g,'').replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g,(_,target,display)=>display??target).replace(/<[^>]*>/g,'').replace(/'{2,}/g,'').trim();
const field=(text,key)=>plain(text.match(new RegExp(`^\\|\\s*${key}\\s*=([^\\n]*)`,'mi'))?.[1]??'');
const section=(text,heading)=>text.match(new RegExp(`^={2,3}\\s*${heading}\\s*={2,3}\\s*\\n([\\s\\S]*?)(?=^={2,3}[^=]|$(?![\\s\\S]))`,'mi'))?.[1]??'';
const wiki=title=>'https://wiki.guildwars.com/wiki/'+encodeURIComponent(title.replaceAll(' ','_'));
const titleOf=entry=>decodeURIComponent(new URL(entry.wiki).pathname.slice(6)).replaceAll('_',' ');
const campaigns={Prophecies:'prophecies',Factions:'factions',Nightfall:'nightfall','Eye of the North':'eye-of-the-north',Core:'core'};
const rewardsByQuest=new Map();
for(const category of ['mission','bounty','vanquish']){
 const title='Zaishen Challenge Quest/'+({mission:'Mission',bounty:'Bounty',vanquish:'Vanquish'}[category]);
 for(const line of pages[title].text.split('\n')){
  if(!line.startsWith('| [[')||!line.includes('||'))continue;
  const cells=line.slice(1).split('||').map(plain);
  const campaign=cells.find(c=>campaigns[c]);
  rewardsByQuest.set(`${category}:${cells[0]}`,{campaign:campaigns[campaign],source:title});
 }
}
const missionData=[];
for(const campaign of Object.values(campaigns).filter(c=>c!=='core')){
 const dir=`src/data/${campaign}/missions`;
 if(fs.existsSync(dir))for(const file of fs.readdirSync(dir).filter(f=>f.endsWith('.json')))missionData.push(read(path.join(dir,file)));
}
const areas={
 'Royen Beastkeeper':'Nahpui Quarter (explorable area)','The Iron Forgeman':"Sorrow's Furnace",'Kanaxai':'The Deep',
 'Mohby Windbeak':'Gyala Hatchery (explorable area)','Kunvie Firewing':'Unwaking Waters (explorable area)','Quansong Spiritspeak':'Tahnnakai Temple (explorable area)',
 'Arachni':"Arachni's Haunt",'Rragar Maneater':"Rragar's Menagerie",'Prismatic Ooze':'Ooze Pit',
 'Fronis Irontoe':"Fronis Irontoe's Lair",'The Darknesses':'The Hall of Heroes (explorable area)',
 'The Black Beast of Arrgh':'The Foundry of Failed Creations','Dragon Lich':'Fissure of Woe',
};
const bountyWarnings={
 'Vengeful Aatxe':'目標幾乎不受傷害，且不能以技能或攻擊選取；擊敗牠對應的 Keeper of Souls 才會使其死亡。',
 'The Darknesses':'這是地下世界連接的 PvE 探索區，並非 Heroes’ Ascent 的 PvP 競技場；不能靠進 PvP 眾神殿完成。',
 'Rragar Maneater':'至少一名隊員須持有 Veiled Threat，才能按該地下城流程抵達目標。',
 'Prismatic Ooze':'至少一名隊員須持有 Watch it Jiggle，否則地下城的鎖門無法通過。',
 'Havok Soulwail':'先在碧拉邊境接 The Misanthropic Jotun Principle，否則地下城內的門會關閉。',
 'Arachni':'任務日誌寫的是泰瑞亞深處，實際目標位於 Arachni’s Haunt 地下城；不是任意地下城都可完成。',
 'Harn and Maxine Coldstone':'擊敗 Harn 或 Maxine Coldstone 任一名即可，不必兩名都殺。',
 'The Stygian Underlords':'這項要擊敗兩名 Underlord；不要和需要四名 Lord 的 The Stygian Lords 混淆。',
 'Dragon Lich':'目標在災難裂痕的 Great Battle Field，靠近暗影軍團營地入口。',
};
const combat={
 'Random Arena':{campaign:'core',goals:['在隨機競技場贏 3 場。','連續贏 5 場。','累計贏 9 場。']},
 'Codex Arena':{campaign:'core',goals:['在 Codex Arena 贏 3 場。','連續贏 5 場。','累計贏 9 場。']},
 'Jade Quarry':{campaign:'factions',goals:['在翡翠礦場贏 3 場。','累計贏 5 場。','累計贏 9 場。']},
 'Fort Aspenwood':{campaign:'factions',goals:['在楊木要塞贏 3 場。','累計贏 5 場。','累計贏 9 場。']},
 "Heroes' Ascent":{campaign:'core',goals:['在 Heroes’ Ascent 贏 2 場。','晉級至眾神殿競技場。','累計贏 6 場。']},
 'Guild Versus Guild':{campaign:'core',goals:['贏 1 場計分公會戰。','在自動錦標賽中贏一輪公會戰。','累計贏 3 場計分公會戰。']},
 'Alliance Battles':{campaign:'factions',goals:['贏 2 場同盟戰。','以超過 200 分的勝差取勝（Wiki 註記實際判定為超過）。','累計贏 6 場同盟戰。']},
};
function rewards(text){
 const lines=section(text,'Reward').split('\n').filter(l=>/^\s*\*/.test(l)).map(l=>plain(l.replace(/^\s*\*\s*/,'')));
 let experience=0,gold=0;const points=[];const coins=[];
 const pointNames=[['Lightbringer','光明使者點數'],['Sunspear','日戟點數'],['Norn','諾恩聲望'],['Asura','阿蘇拉聲望'],['Dwarf','矮人聲望'],['Vanguard','黑檀先鋒軍聲望'],['Kurzick','庫茲柯陣營點數'],['Luxon','勒克森陣營點數'],['Imperial','帝國陣營點數'],['Balthazar','巴薩澤陣營點數']];
 for(const line of lines){const number=Number(line.match(/^([\d,]+)/)?.[1]?.replaceAll(',','')??0);
  if(/Experience/i.test(line))experience=number;
  else if(/Gold/.test(line))gold=number;
  else if(/Copper (?:Zaishen )?Coins/i.test(line))coins.push({label:/Base Objective/.test(line)?'基本目標':`額外條件 ${coins.filter(c=>c.label!=='基本目標').length+1}`,amount:Number(line.match(/(?:for|additional)\s+([\d,]+)/)?.[1]?.replaceAll(',','')??0)});
  else if(number){const match=pointNames.find(([en])=>line.includes(en));if(!match)throw Error('Unknown points: '+line);points.push({label:match[1],amount:number});}
 }
 if(!coins.length)throw Error('Missing coins');
 return {experience,gold,points,coins,totalCoins:coins.reduce((n,c)=>n+c.amount,0)};
}
const output=[];
for(const category of ['mission','bounty','vanquish','combat'])for(const entry of [...new Map(rotation.cycles[category].entries.map(e=>[e.en,e])).values()]){
 const title=titleOf(entry),page=pages[title];if(!page?.text)throw Error('Missing '+title);
 const rawObjectives=section(page.text,'Objectives').split('\n').filter(l=>/^\s*\*/.test(l)).map(l=>plain(l.replace(/^\s*\*\s*/,''))).filter(l=>!/^See /.test(l));
 const mission=missionData.find(m=>m.name.en===entry.en);
 let campaign=rewardsByQuest.get(`${category}:${entry.en}`)?.campaign??mission?.campaign??combat[entry.en]?.campaign??campaigns[field(pages[entry.en]?.text??'','campaign')];
 if(!campaign)throw Error('Missing campaign '+entry.en);
 let area=category==='bounty'?(areas[entry.en]??bounties.find(b=>b.en===entry.en)?.areaEn.trim()):entry.en;
 const locationPage=pages[area];const exitField=locationPage?.text.match(/^\|\s*exits\s*=([^\n]*)/mi)?.[1]??'';
 const exits=[...new Set([...exitField.matchAll(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g)].map(m=>m[2]??m[1]))];
 const region=field(locationPage?.text??'','region');
 const id=category+'-'+entry.en.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
 const targets=category==='bounty'?`擊敗 ${label(entry.en)}`:category==='mission'?`完成「${label(entry.en)}」${campaign==='eye-of-the-north'?'故事關卡':'合作任務'}`:category==='vanquish'?`清除「${label(area)}」全部敵人`:`參加 ${label(entry.en)}`;
 let conditions=[],steps=[],warnings=[];
 if(category==='bounty'){
  const first=rawObjectives[0];let target=first.match(/^Kill\s+(.*?)\s+(?:in|at|within|inside|on)\s/i)?.[1]??entry.en;
  target=target.replace(/^the\s+/i,'').replace(/^(\d+)\s+/,'$1 名 ');
  for(const [en,zh] of [...terms].sort((a,b)=>b[0].length-a[0].length))if(en===entry.en)target=target.replaceAll(en,zh);
  conditions=[`在 ${label(area)} 擊敗${target}。`];
  if(rawObjectives.some(l=>/Hard Mode/i.test(l)))conditions.push('在困難模式（HM）完成同一擊殺目標，取得額外銅幣。');
  steps=[`先確認已接取「${entry.en}」承戰懸賞，再前往 ${label(area)}；普通與困難模式的額外條件分開計算。`,exits.length?`區域 Wiki 列出的相鄰出口／入口：${exits.map(label).join('、')}。`:`這是指定區域／地下城的目標，抵達 ${label(area)} 後才計算擊殺；請勿只憑同名怪物判定。`,`擊敗指定目標後檢查任務日誌，再回巴薩澤聖殿或登船海灘找 Zehnchu 領獎。`];
  if(bountyWarnings[entry.en])warnings.push(bountyWarnings[entry.en]);
 }else if(category==='mission'){
  conditions=[`完成「${label(entry.en)}」關卡。`];
  for(const goal of rawObjectives.slice(1)){
   if(/Hard Mode\.$/i.test(goal))conditions.push('在困難模式（HM）完成關卡。');
   else if(/under|less than/.test(goal)&&/minutes/.test(goal)){const nums=[...goal.matchAll(/\d+(?:\.\d+)?/g)].map(m=>m[0]);conditions.push(`限時完成：普通模式 ${nums[0]} 分鐘${nums[1]?`；困難模式 ${nums[1]} 分鐘`:''}內。`);}
   else if(mission)conditions.push(`額外目標：${mission.bonus.summary}。${mission.bonus.trigger}`);
   else throw Error('Missing mission bonus translation: '+entry.en+' '+goal);
  }
  const storyGivenAt=field(locationPage?.text??'','given at');
  const storyGivenBy=field(locationPage?.text??'','given by');
  const preceding=field(locationPage?.text??'','preceded by');
  if(campaign==='eye-of-the-north'&&storyGivenAt)area=`${label(storyGivenAt)}（故事起點）`;
  steps=[campaign==='eye-of-the-north'&&storyGivenAt?`首次推進故事時，到 ${label(storyGivenAt)} 找 ${label(storyGivenBy)} 啟動「${label(entry.en)}」。${preceding?`前置故事：${label(preceding)}。`:''}`:mission?`${mission.entryMethod.location}：${mission.entryMethod.description}`:`依「${label(entry.en)}」故事任務的接取／重玩入口開始該關卡。`,mission?.routeSummary??`完成該故事關卡的主線目標；此懸賞不是在同名野外地圖擊敗任意怪物。`,'基本完成、Bonus／大師條件與 HM 可以分次完成；全部想領的條件完成後，再找 Zehnchu 領獎。'];
  if(mission?.requiredHeroes.some(h=>h.required))warnings.push(`啟動關卡時必須帶：${mission.requiredHeroes.filter(h=>h.required).map(h=>h.name.zhTW).join('、')}；請先招募並加入隊伍。`);
 }else if(category==='vanquish'){
  conditions=[`在困難模式（HM）清除 ${label(area)} 的全部敵人。`];
  steps=[`先接取清圖任務，並確認角色已解鎖該戰役的困難模式；在據點將模式切為 HM。`,exits.length?`前往 ${label(area)}；相鄰出口／入口：${exits.map(label).join('、')}。`:`進入 ${label(area)} 野外探索區。`,`循地圖清除敵人，包含巡邏與觸發後出現的敵人；看到清圖完成判定後，再向 Zehnchu 領獎。`];
  warnings=['普通模式擊殺不算清圖；本頁列的是承戰額外獎勵，不含清圖本身依敵人數給予的經驗與金幣。'];
 }else{conditions=combat[entry.en].goals;steps=[`前往 ${label(entry.en)} 對應的 PvP 模式，依序累積本頁勝場條件。`,'額外勝場可分次累積；寫「連續」的條件必須連勝。','達成要領的條件後，回 Zehnchu 領獎。'];warnings=['此類需要玩家競技配對；不是 PvE 主線或清圖。'];}
 const sources=[{title:'承戰任務條件與獎勵',url:entry.wiki,revision:page.revision}];
 if(locationPage?.text)sources.push({title:'目標區域與相鄰入口',url:wiki(locationPage.title),revision:locationPage.revision});
 if(rewardsByQuest.get(`${category}:${entry.en}`)){const source=rewardsByQuest.get(`${category}:${entry.en}`).source;sources.push({title:'章節對照總表',url:wiki(source),revision:pages[source].revision});}
 output.push({id,category,en:entry.en,zhTW:name(entry.en),campaign,region:name(region),area:label(area),target:targets,conditions,steps,warnings,rewards:rewards(page.text),guideHref:mission?`/missions/view/?campaign=${mission.campaign}&id=${mission.id}`:null,sources,checkedAt:'2026-10-12'});
}
const stygian=output.find(e=>e.en==='The Stygian Lords');
stygian.conditions=['在 Stygian Veil 擊敗四名 Stygian Lord：僧侶、死靈法師、幻術師與元素使各一名。','在困難模式擊敗同樣四名目標，可再領 100 枚承戰銅幣。'];
stygian.steps=[
 '先通關第三章「黑暗逆襲」的亞霸頓之門。到隱密教堂找 Guardian of Whispers 進入柵門內，對真理女神雕像輸入 /kneel，再與出現的 Seer of Truth 對話，抵達悲難之門。',
 '從悲難之門進入 Stygian Veil；這是第三章苦痛領域的菁英區域，並非一般主線任務或極地之眼地下城。',
 '找 Adept of Whispers 接 Breaching the Stygian Veil。清除三路、每路六組的惡魔攻勢；避免同時迎戰三路。接任務就會啟動第一輪，先布置隊伍。',
 '攻勢結束後，分別擊敗西南山丘與北方山丘的兩名 Stygian Underlord，回 Adept of Whispers 交付。北丘有埋伏，逐群引出；這兩名不是本次承戰要求的四名 Lord。',
 '再接 Brood Wars，沿四處壕溝尋找四名 Stygian Lord。壕溝中段會觸發兩端包夾與高處敵人；先由能安全返回的隊員觸發，再全隊推進。僧侶、元素使所在凹地也有隱藏敵人。',
 '擊敗四名後，確認承戰日誌的基本／HM 條件，再回 Zehnchu 領承戰獎勵。本懸賞不要求擊敗 Dreadspawn Maw 或 Mallyx。',
];
stygian.warnings=['不要和 The Stygian Underlords 混淆：Underlords 要兩名，Lords 要四名。','承戰獎勵和兩個區域任務的獎勵分開計算。領取 Brood Wars 的區域獎勵會生成六條 Smothering Tendrils；先集合到 Adept of Whispers 附近，避免留在攻擊範圍。','這是高難度菁英區域，先備妥隊伍再接會觸發攻勢的任務。'];
for(const title of ['Gate of Anguish','Stygian Veil','Breaching the Stygian Veil','Brood Wars'])if(!stygian.sources.some(s=>s.url===wiki(title)))stygian.sources.push({title,url:wiki(title),revision:pages[title].revision});
const directory='public/data/zaishen';fs.mkdirSync(directory,{recursive:true});
for(const category of ['mission','bounty','vanquish','combat'])fs.writeFileSync(`${directory}/${category}.json`,JSON.stringify(output.filter(e=>e.category===category)));
const catalog=output.map(({id,category,en,zhTW,campaign,area,target,steps,conditions,warnings,rewards})=>{
 const original=rotation.cycles[category].entries.find(e=>e.en===en);
 const originalObjectives=plain(section(pages[titleOf(original)].text,'Objectives'));
 return {id,category,en,zhTW,campaign,area,target,searchText:[en,zhTW,area,target,originalObjectives,...steps,...conditions,...warnings,'經驗值 金幣 承戰銅幣',JSON.stringify(rewards)].join(' ')};
});
fs.writeFileSync(`${directory}/catalog.json`,JSON.stringify(catalog));
fs.mkdirSync('docs/research',{recursive:true});fs.writeFileSync('docs/research/zaishen-lookup-audit.json',JSON.stringify({checkedAt:'2026-10-12',counts:Object.fromEntries(['mission','bounty','vanquish','combat'].map(c=>[c,output.filter(e=>e.category===c).length])),quests:output.map(e=>({id:e.id,sources:e.sources}))},null,2)+'\n');
console.log(`Built ${output.length} quick-reference quests (unique combat modes, not duplicate rotation dates).`);
