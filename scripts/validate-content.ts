import {isGuideComplete} from '../src/lib/guide-audit';
import fs from 'node:fs';
import path from 'node:path';
import {getCampaigns,getMissions,getHeroes,getExtraGuides} from '../src/lib/content';
import {getSkills} from '../src/lib/skills';
const campaigns=getCampaigns();const missions=getMissions();const seen=new Set<string>();
for(const m of missions){
  const key=m.campaign+'/'+m.id;if(seen.has(key))throw new Error('Duplicate mission: '+key);seen.add(key);
  const c=campaigns.find(item=>item.id===m.campaign);if(!c)throw new Error('Unknown campaign');
  if(!c.regions.some(r=>r.id===m.region))throw new Error('Unknown region: '+key);
  for(const ref of [m.previousMission,m.nextMission,...m.prerequisites,...m.nextOptions,...m.previousOptions].filter((id):id is string=>id!==null))if(!missions.some(other=>other.campaign===m.campaign&&other.id===ref))throw new Error('Broken mission relationship: '+ref);
  for(const map of m.maps)if(!fs.existsSync(path.join(process.cwd(),'public',map.src)))throw new Error('Missing map: '+map.src);
  if(m.mapImage&&!m.maps.some(map=>map.src===m.mapImage))throw new Error('Invalid primary map');
  if((m.status==='complete')!==(m.contentStatus==='complete'))throw new Error('Conflicting status fields: '+key);
  if(m.contentStatus==='complete'&&!isGuideComplete(m))throw new Error('Guide claims complete but fails audit: '+key);
  if(m.requiredHeroes.some(h=>!getHeroes().some(g=>g.id===h.id)))throw new Error('Missing hero guide: '+key);

}
for(const c of campaigns)for(const node of c.flow){if(!missions.some(m=>m.campaign===c.id&&m.id===node.entry))throw new Error('Invalid flow entry');for(const ref of node.requires)if(!missions.some(m=>m.campaign===c.id&&m.id===ref))throw new Error('Invalid prerequisite');}
const prophecies=missions.filter(m=>m.campaign==='prophecies');if(prophecies.length!==25||new Set(prophecies.map(m=>m.order)).size!==25)throw new Error('Prophecies must contain 25 uniquely ordered entries');
// Completeness is enforced by validate:guides; structural validation does not assert demo completion.
const ascension=prophecies.find(m=>m.id==='augury-rock');if(ascension?.prerequisites.length!==3)throw new Error('Ascension needs all 3 desert trials');
for(const [id,count,stages] of [['factions',13,12],['nightfall',20,17]] as const){const entries=missions.filter(m=>m.campaign===id);if(entries.length!==count||new Set(entries.map(m=>m.storyStage)).size!==stages)throw new Error('Invalid chapter counts: '+id);}
if(getHeroes().length!==31||getExtraGuides().length!==12)throw new Error('Hero/extra catalog mismatch');
const skillInventory=JSON.parse(fs.readFileSync('src/data/inventory/skills.json','utf8')) as {entries:{name:string}[]};
const skills=getSkills();const names=new Set(skills.map(s=>s.name.en));
if(skills.length!==skillInventory.entries.length||skillInventory.entries.some(s=>!names.has(s.name)))throw new Error('Skill inventory mismatch');
if(new Set(skills.filter(s=>s.profession.id!=='common').map(s=>s.profession.id)).size!==10)throw new Error('Missing skill profession');
for(const s of skills){
 if(!s.icon||!fs.existsSync(path.join(process.cwd(),'public',s.icon)))throw new Error('Missing skill icon: '+s.id);
 if(!s.description.pve.en||!s.description.pve.zhTW||JSON.stringify(s.description).includes('%str'))throw new Error('Invalid skill effect: '+s.id);
 if(!s.sources.length||s.pvpVariantExists&&!s.description.pvp)throw new Error('Missing skill source/variant: '+s.id);
}
const find=(id:string)=>missions.find(m=>m.id===id)!;
if(find('dzagonur-bastion').masterReward?.normal.master!=='保留5–6座防禦設施'||find('rilohn-refuge').masterReward?.normal.master!=='零水泵關閉'||find('tihark-orchard').partySize!==1||find('tihark-orchard').requiredHeroes.length)throw new Error('Special mechanics regression');
if(find('sunjiang-district').nextOptions.length!==2||find('unwaking-waters').entryVariants.length!==2||find('moddok-crevice').previousOptions.length!==2)throw new Error('Branch regression');
console.log(`Content valid: ${campaigns.length} campaigns, ${missions.length} missions, ${missions.filter(isGuideComplete).length} complete guides, ${getHeroes().length} heroes, 12 extra indexes. Structural checks only; see validate:guides for completeness.`);
