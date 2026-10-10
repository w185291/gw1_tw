import fs from 'node:fs';
import path from 'node:path';
import {getSkills} from '../src/lib/skills';

const outputDir=path.join(process.cwd(),'public','data','skills');
fs.mkdirSync(outputDir,{recursive:true});
const groups=new Map<string,ReturnType<typeof getSkills>>();
const index:Record<string,string>={};
for(const skill of getSkills()){
 const profession=skill.profession.id;
 if(!groups.has(profession))groups.set(profession,[]);
 groups.get(profession)!.push(skill);
 index[skill.id]=profession;
}
for(const [profession,skills] of groups){
 fs.writeFileSync(path.join(outputDir,`${profession}.json`),JSON.stringify(skills));
}
fs.writeFileSync(path.join(outputDir,'index.json'),JSON.stringify(index));
console.log(`Exported ${Object.keys(index).length} skills in ${groups.size} profession JSON files.`);
