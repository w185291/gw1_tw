import {cache} from 'react';
import fs from 'node:fs';
import path from 'node:path';
import {skillSchema,type Skill} from '../data/schemas/skills';
let productionSkills:Skill[]|undefined;
type SkillInventory={entries:Array<{name:string;professionHeading:string}>};
const skillDir=path.join(process.cwd(),'src','data','skills');
const inventoryFile=path.join(process.cwd(),'src','data','inventory','skills.json');
const slug=(name:string)=>name.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const readSkill=(id:string):Skill|undefined=>{
 if(!/^[a-z0-9-]+$/.test(id))return undefined;
 const file=path.join(skillDir,`${id}.json`);
 return fs.existsSync(file)?skillSchema.parse(JSON.parse(fs.readFileSync(file,'utf8'))):undefined;
};
export const getSkillIds=cache(function getSkillIds():string[]{
 const inventory=JSON.parse(fs.readFileSync(inventoryFile,'utf8')) as SkillInventory;
 return inventory.entries.map(entry=>slug(entry.name));
});
export const getProfessionSkillCounts=cache(function getProfessionSkillCounts():Record<string,number>{
 const inventory=JSON.parse(fs.readFileSync(inventoryFile,'utf8')) as SkillInventory;
 const counts:Record<string,number>={};
 for(const entry of inventory.entries){
  const match=/^([A-Za-z]+) skills$/.exec(entry.professionHeading);
  if(match){const id=match[1].toLowerCase();counts[id]=(counts[id]??0)+1;}
 }
 return counts;
});
export const getSkills=cache(function getSkills():Skill[]{
 if(process.env.NODE_ENV==='production'&&productionSkills)return productionSkills;
 const skills=getSkillIds().map(readSkill).filter((skill):skill is Skill=>Boolean(skill)).sort((a,b)=>a.name.en.localeCompare(b.name.en));
 if(process.env.NODE_ENV==='production')productionSkills=skills;
 return skills;
});
export const getSkillsByProfession=cache(function getSkillsByProfession(profession:string):Skill[]{
 const inventory=JSON.parse(fs.readFileSync(inventoryFile,'utf8')) as SkillInventory;
 const heading=profession==='common'?null:`${profession[0].toUpperCase()}${profession.slice(1)} skills`;
 return inventory.entries
  .filter(entry=>heading?entry.professionHeading===heading:entry.professionHeading.startsWith('Common'))
  .map(entry=>readSkill(slug(entry.name)))
  .filter((skill):skill is Skill=>Boolean(skill))
  .sort((a,b)=>a.name.en.localeCompare(b.name.en));
});
export const getSkill=cache(function getSkill(id:string){return readSkill(id);});
