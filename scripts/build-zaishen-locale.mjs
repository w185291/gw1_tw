import fs from 'node:fs/promises';
import path from 'node:path';
import rotation from '../src/data/zaishen/rotation.json' with {type:'json'};
import bounties from '../src/data/zaishen/bounties.json' with {type:'json'};
import gameNames from '../src/data/terminology/game-client.json' with {type:'json'};

const names=new Map(gameNames.filter(item=>item.en&&item.zhTW&&item.en!==item.zhTW).map(item=>[item.en,item.zhTW]));
const missions=new Map();
for(const campaign of ['prophecies','factions','nightfall','eye-of-the-north']){
  const directory=path.join('src','data',campaign,'missions');
  for(const file of (await fs.readdir(directory)).filter(file=>file.endsWith('.json'))){
    const mission=JSON.parse(await fs.readFile(path.join(directory,file),'utf8'));
    const label=mission.name?.zhTW;
    if(label&&!label.includes('待確認')&&label!==mission.name.en){
      names.set(mission.name.en,label);
      missions.set(mission.name.en,{zhTW:label,href:`/missions/view/?campaign=${encodeURIComponent(campaign)}&id=${encodeURIComponent(mission.id)}`});
    }
  }
}
const manual={
  'Fort Aspenwood':'楊木要塞',
  'Jade Quarry':'翡翠礦場',
};
for(const [en,zhTW] of Object.entries(manual))names.set(en,zhTW);
const wanted=new Set(Object.values(rotation.cycles).flatMap(cycle=>cycle.entries.map(entry=>entry.en)));
for(const bounty of bounties)wanted.add(bounty.areaEn.trim());
const translations=Object.fromEntries([...wanted].filter(name=>names.has(name)).sort().map(name=>[name,names.get(name)]));
await fs.writeFile('src/data/zaishen/locale.json',JSON.stringify({translations,missions:Object.fromEntries(missions)},null,2)+'\n');
console.log(`Zaishen localized names: ${Object.keys(translations).length}/${wanted.size}; mission guide links: ${missions.size}`);
