import fs from 'node:fs';
const directory='public/data/zaishen';
const catalog=JSON.parse(fs.readFileSync(`${directory}/catalog.json`));
const expected={mission:69,bounty:66,vanquish:136,combat:7};
const ids=new Set();
for(const [category,count] of Object.entries(expected)){
 const quests=JSON.parse(fs.readFileSync(`${directory}/${category}.json`));
 if(quests.length!==count)throw Error(`${category}: expected ${count}, got ${quests.length}`);
 for(const q of quests){
  if(ids.has(q.id))throw Error(`Duplicate ${q.id}`);ids.add(q.id);
  if(!q.campaign||!q.area||!q.target||!q.conditions.length||q.steps.length<3||!q.sources.every(s=>s.revision&&s.url.startsWith('https://wiki.guildwars.com/')))throw Error(`Missing researched fields ${q.id}`);
  if(q.rewards.coins.some(c=>!Number.isInteger(c.amount)||c.amount<=0)||q.rewards.totalCoins!==q.rewards.coins.reduce((n,c)=>n+c.amount,0))throw Error(`Incorrect coin total ${q.id}`);
  if(q.conditions.length!==q.rewards.coins.length)throw Error(`Conditions/rewards mismatch ${q.id}`);
 }
}
if(catalog.length!==ids.size||catalog.some(e=>!ids.has(e.id)||!e.searchText))throw Error('Catalog mismatch');
const stygian=JSON.parse(fs.readFileSync(`${directory}/bounty.json`)).find(e=>e.en==='The Stygian Lords');
if(stygian.campaign!=='nightfall'||stygian.rewards.experience!==10000||stygian.rewards.gold!==1500||stygian.rewards.totalCoins!==140||stygian.rewards.points[0]?.amount!==500||stygian.rewards.coins[0].amount!==40)throw Error('Stygian source facts mismatch');
console.log(`Zaishen lookup valid: ${catalog.length} quests, all conditions/coin rows aligned.`);
