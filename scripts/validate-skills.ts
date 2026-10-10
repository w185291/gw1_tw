import fs from 'node:fs';
import path from 'node:path';

const dir='src/data/skills';
const files=fs.existsSync(dir)?fs.readdirSync(dir).filter(f=>f.endsWith('.json')):[];
const rows:string[]=[];let failures=0;let complete=0;
const missing:Record<string,number>={};
const professions=new Set<string>();
const inventoryPath='src/data/inventory/skills.json';
const inventory=fs.existsSync(inventoryPath)?JSON.parse(fs.readFileSync(inventoryPath,'utf8')):null;
const researchedNames=new Set<string>();
for(const file of files){
  const s=JSON.parse(fs.readFileSync(path.join(dir,file),'utf8'));
  if(s.name?.en)researchedNames.add(s.name.en);
  const checks:Record<string,boolean>={
    zhTW:Boolean(s.name?.zhTW)&&s.translationVerified===true&&s.translationSources?.length>0,
    en:Boolean(s.name?.en),
    profession:Boolean(s.profession?.id&&s.profession?.zhTW&&s.profession?.en),
    attribute:Boolean(s.attribute?.id&&s.attribute?.zhTW&&s.attribute?.en),
    type:Boolean(s.type?.en&&s.type?.zhTW),
    campaign:Boolean(s.campaign?.id&&s.campaign?.zhTW),
    source:s.sources?.length>0&&s.sources.some((x:{url:string})=>/^https:\/\/wiki\.guildwars\.com\//.test(x.url)),
    acquisition:s.acquisition?.verified===true&&Boolean(s.acquisition?.trainers?.length||s.acquisition?.quests?.length||s.acquisition?.bosses?.length||s.acquisition?.special?.length),
    elite:!s.elite||Boolean(s.acquisition?.bosses?.length||s.acquisition?.eliteTome===true),
    pvp:s.pvpVariantVerified===true&&(!s.pvpVariantExists||Boolean(s.description?.pvp?.zhTW&&s.description?.pvp?.en)),
    pve:Boolean(s.description?.pve?.zhTW&&s.description?.pve?.en),
    explanation:Boolean(s.explanation?.trim()),
    uses:s.commonUses?.length>0,
    earliest:Boolean(s.earliestAcquisition?.description&&s.earliestAcquisition?.source),
    convenient:Boolean(s.recommendedAcquisition?.description&&s.recommendedAcquisition?.source),
    status:s.contentStatus==='complete',
  };
  const errors=Object.entries(checks).filter(([,ok])=>!ok).map(([key])=>key);
  for(const key of errors)missing[key]=(missing[key]??0)+1;
  if(errors.length){failures++;console.error(`ERROR: skills/${s.id??file}\n  missing/unverified ${errors.join(', ')}`);}else complete++;
  if(s.profession?.id&&s.profession.id!=='common')professions.add(s.profession.id);
  const mark=(key:string)=>checks[key]?'✅':'❌';
  rows.push(`| ${s.name?.en??file} | ${mark('zhTW')} | ${mark('profession')} | ${mark('attribute')} | ${mark('campaign')} | ${mark('acquisition')} | ${mark('pvp')} | ${mark('source')} | ${errors.length?'❌':'✅'} |`);
}
if(!files.length){failures++;console.error('ERROR: skills: no researched skill records; empty catalog cannot pass');}
const missingInventory=inventory?.entries?.filter((entry:{name:string})=>!researchedNames.has(entry.name))??[];
if(inventory?.inventoryVerified!==true){failures++;console.error('ERROR: skills: canonical player skill inventory has not been verified');}
if(missingInventory.length){failures++;console.error(`ERROR: skills: ${missingInventory.length} inventory skills have no authored record (first 10: ${missingInventory.slice(0,10).map((x:{name:string})=>x.name).join(', ')})`);}
if(professions.size<10){failures++;console.error(`ERROR: skills: profession coverage ${professions.size} / 10`);}
fs.mkdirSync('docs/content-audit',{recursive:true});
fs.writeFileSync('docs/content-audit/skills-audit.md',`# 技能查核\n\n${complete} / ${inventory?.entries?.length??'未確認'} complete；已撰寫 ${files.length} 筆，缺少 ${missingInventory.length} 筆；職業資料 ${professions.size} / 10。分母來自 Wiki 五份章節技能清單，PvP 分版歸入原技能。\n\n| Skill | zhTW | Profession | Attribute | Campaign | Acquisition | PvP | Source | Complete |\n|---|---|---|---|---|---|---|---|---|\n${rows.join('\n')}\n`);
fs.writeFileSync('docs/content-audit/skill-results.json',JSON.stringify({total:files.length,inventoryTotal:inventory?.entries?.length??null,missingRecords:missingInventory.length,complete,incomplete:files.length-complete,professions:professions.size,missing},null,2)+'\n');
console.log(`Skills: ${complete} / ${inventory?.entries?.length??'unverified'} complete; authored records ${files.length}; professions ${professions.size} / 10`);
process.exitCode=failures?1:0;
