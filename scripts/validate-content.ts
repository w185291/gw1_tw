import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {getCampaigns,getMissions,getHeroes,getExtraGuides} from '../src/lib/content';
const campaigns=getCampaigns();const missions=getMissions();const seen=new Set<string>();
for(const m of missions){
  const key=m.campaign+'/'+m.id;if(seen.has(key))throw new Error('Duplicate mission: '+key);seen.add(key);
  const c=campaigns.find(item=>item.id===m.campaign);if(!c)throw new Error('Unknown campaign');
  if(!c.regions.some(r=>r.id===m.region))throw new Error('Unknown region: '+key);
  for(const ref of [m.previousMission,m.nextMission,...m.prerequisites,...m.nextOptions,...m.previousOptions].filter((id):id is string=>id!==null))if(!missions.some(other=>other.campaign===m.campaign&&other.id===ref))throw new Error('Broken mission relationship: '+ref);
  for(const map of m.maps)if(!fs.existsSync(path.join(process.cwd(),'public',map.src)))throw new Error('Missing map: '+map.src);
  if(m.mapImage&&!m.maps.some(map=>map.src===m.mapImage))throw new Error('Invalid primary map');
  if(m.status==='complete'&&(!m.walkthrough.length||!m.objectives.length||!m.maps.length||!m.recommendedTeam.length||!m.warnings.length||(!m.bosses.length&&!m.bossMechanics.length)||!m.rewards.normal.length||!m.rewards.hard.length||!m.bonus.steps.length||!m.bonus.completion))throw new Error('Incomplete guide: '+key);
  if(m.campaign!=='prophecies'&&m.status==='complete'){
    if(!m.masterReward||!m.missionReward||m.bonus.available||m.verificationStatus!=='source-checked')throw new Error('Missing master conditions: '+key);
    if(m.requiredHeroes.some(h=>!getHeroes().some(g=>g.id===h.id)))throw new Error('Missing hero guide: '+key);
    if(m.campaign==='nightfall'&&!m.missionStarter)throw new Error('Missing mission starter: '+key);
    if(m.nextOptions.some(id=>!missions.find(other=>other.id===id&&other.campaign===m.campaign)?.previousOptions.includes(m.id)))throw new Error('Asymmetric branch: '+key);
  }
}
for(const c of campaigns)for(const node of c.flow){if(!missions.some(m=>m.campaign===c.id&&m.id===node.entry))throw new Error('Invalid flow entry');for(const ref of node.requires)if(!missions.some(m=>m.campaign===c.id&&m.id===ref))throw new Error('Invalid prerequisite');}
const prophecies=missions.filter(m=>m.campaign==='prophecies');if(prophecies.length!==25||new Set(prophecies.map(m=>m.order)).size!==25)throw new Error('Prophecies must contain 25 uniquely ordered entries');
for(const id of ['the-great-northern-wall','gates-of-kryta','divinity-coast'])if(!prophecies.some(m=>m.id===id&&m.status==='complete'))throw new Error('Required demo missing: '+id);
const ascension=prophecies.find(m=>m.id==='augury-rock');if(ascension?.prerequisites.length!==3)throw new Error('Ascension needs all 3 desert trials');
for(const [id,count,stages] of [['factions',13,12],['nightfall',20,17]] as const){const entries=missions.filter(m=>m.campaign===id);if(entries.length!==count||new Set(entries.map(m=>m.storyStage)).size!==stages||entries.some(m=>m.status!=='complete'))throw new Error('Invalid chapter counts: '+id);}
const baseline=JSON.parse(fs.readFileSync('docs/reference/prophecies-phase1-baseline.json','utf8')) as Record<string,string>;
for(const [file,hash] of Object.entries(baseline))if(crypto.createHash('sha256').update(fs.readFileSync(path.join('src/data/prophecies/missions',file))).digest('hex')!==hash)throw new Error('Prophecies regression: '+file);
if(getHeroes().length!==13||getExtraGuides().length!==12)throw new Error('Hero/extra catalog mismatch');
const find=(id:string)=>missions.find(m=>m.id===id)!;
if(find('dzagonur-bastion').masterReward?.normal.master!=='保留5–6座防禦設施'||find('rilohn-refuge').masterReward?.normal.master!=='零水泵關閉'||find('tihark-orchard').partySize!==1||find('tihark-orchard').requiredHeroes.length)throw new Error('Special mechanics regression');
if(find('sunjiang-district').nextOptions.length!==2||find('unwaking-waters').entryVariants.length!==2||find('moddok-crevice').previousOptions.length!==2)throw new Error('Branch regression');
console.log(`Content valid: ${campaigns.length} campaigns, ${missions.length} missions, ${missions.filter(m=>m.status==='complete').length} complete guides, 13 heroes, 12 extra indexes. Prophecies 25 SHA-256 baselines unchanged.`);
