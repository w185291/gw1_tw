import fs from 'node:fs';
import path from 'node:path';
import {getCampaigns,getMissions} from '../src/lib/content';
const campaigns=getCampaigns();const missions=getMissions();const seen=new Set<string>();
for(const m of missions){
  const key=m.campaign+'/'+m.id;if(seen.has(key))throw new Error('Duplicate mission: '+key);seen.add(key);
  const c=campaigns.find(item=>item.id===m.campaign);if(!c)throw new Error('Unknown campaign');
  if(!c.regions.some(r=>r.id===m.region))throw new Error('Unknown region: '+key);
  for(const ref of [m.previousMission,m.nextMission,...m.prerequisites].filter((id):id is string=>id!==null))if(!missions.some(other=>other.campaign===m.campaign&&other.id===ref))throw new Error('Broken mission relationship: '+ref);
  for(const map of m.maps)if(!fs.existsSync(path.join(process.cwd(),'public',map.src)))throw new Error('Missing map: '+map.src);
  if(m.mapImage&&!m.maps.some(map=>map.src===m.mapImage))throw new Error('Invalid primary map');
  if(m.status==='complete'&&(!m.walkthrough.length||!m.objectives.length||!m.maps.length||!m.recommendedTeam.length||!m.warnings.length||!m.bosses.length||!m.rewards.normal.length||!m.rewards.hard.length||!m.bonus.steps.length||!m.bonus.completion))throw new Error('Incomplete demo: '+key);
}
for(const c of campaigns)for(const node of c.flow){if(!missions.some(m=>m.campaign===c.id&&m.id===node.entry))throw new Error('Invalid flow entry');for(const ref of node.requires)if(!missions.some(m=>m.campaign===c.id&&m.id===ref))throw new Error('Invalid prerequisite');}
const prophecies=missions.filter(m=>m.campaign==='prophecies');if(prophecies.length!==25||new Set(prophecies.map(m=>m.order)).size!==25)throw new Error('Prophecies must contain 25 uniquely ordered entries');
for(const id of ['the-great-northern-wall','gates-of-kryta','divinity-coast'])if(!prophecies.some(m=>m.id===id&&m.status==='complete'))throw new Error('Required demo missing: '+id);
const ascension=prophecies.find(m=>m.id==='augury-rock');if(ascension?.prerequisites.length!==3)throw new Error('Ascension needs all 3 desert trials');
console.log(`Content valid: ${campaigns.length} campaigns, ${missions.length} missions, ${missions.filter(m=>m.status==='complete').length} complete demos; maps and navigation checked.`);
