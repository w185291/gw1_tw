import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const trainers=JSON.parse(fs.readFileSync(path.join(root,'src/data/skill-trainers.json'),'utf8'));
const index=JSON.parse(fs.readFileSync(path.join(root,'src/data/skill-trainer-index.json'),'utf8'));
const ids=new Set();
const failures=[];
for(const trainer of trainers){
  if(ids.has(trainer.id))failures.push(`${trainer.name}: duplicate id`);
  ids.add(trainer.id);
  if(!trainer.wiki||!trainer.locations.length)failures.push(`${trainer.name}: wiki/location missing`);
  if(!trainer.image?.src||!fs.existsSync(path.join(root,'public',trainer.image.src.slice(1))))failures.push(`${trainer.name}: image missing`);
  if(trainer.mapImage?.src&&!fs.existsSync(path.join(root,'public',trainer.mapImage.src.slice(1))))failures.push(`${trainer.name}: map missing`);
  if(!Object.values(trainer.skills).flat().length&&!['Vernados','Skill Trainer (NPC)','Magi Malaquire'].includes(trainer.name))failures.push(`${trainer.name}: skill list missing`);
}
if(index.length!==trainers.length)failures.push('index length mismatch');
for(const campaign of [...new Set(trainers.map(item=>item.campaign))]){
  const file=path.join(root,'public/data/skill-trainers',`${campaign}.json`);
  if(!fs.existsSync(file))failures.push(`${campaign}: data file missing`);
  else if(JSON.parse(fs.readFileSync(file,'utf8')).trainers.length!==trainers.filter(item=>item.campaign===campaign).length)failures.push(`${campaign}: data count mismatch`);
}
if(failures.length){console.error(failures.join('\n'));process.exit(1)}
console.log(`Skill trainers valid: ${trainers.length} NPCs, ${trainers.filter(item=>item.mapImage).length} location maps, ${new Set(trainers.map(item=>item.image.src)).size} Wiki images.`);
