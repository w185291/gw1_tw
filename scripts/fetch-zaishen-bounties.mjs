import fs from 'node:fs/promises';
import rotation from '../src/data/zaishen/rotation.json' with {type:'json'};

const decode=text=>text.replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#39;|&apos;/g,"'").replace(/&nbsp;|&#160;/g,' ').replace(/&#(\d+);/g,(_,n)=>String.fromCodePoint(Number(n)));
const plain=html=>decode(html.replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim());
async function detail(entry){
  const title=decodeURIComponent(new URL(entry.wiki).pathname.replace(/^\/wiki\//,'')).replaceAll('_',' ');
  const url=new URL('https://wiki.guildwars.com/api.php');
  url.search=new URLSearchParams({action:'parse',page:title,prop:'text',format:'json',formatversion:'2'}).toString();
  const response=await fetch(url,{headers:{'User-Agent':'Mozilla/5.0 (compatible; GW1-TW-Guide/1.0)'}});
  if(!response.ok)throw Error(`${entry.en}: HTTP ${response.status}`);
  const data=await response.json();
  const html=data.parse?.text;
  if(typeof html!=='string')throw Error(`${entry.en}: missing page`);
  const objectiveSection=html.match(/id="Objectives"[\s\S]*?<\/h3>\s*<ul>([\s\S]*?)<\/ul>/)?.[1]??'';
  const objectives=[...objectiveSection.matchAll(/<li\b[^>]*>([\s\S]*?)<\/li>/g)].map(m=>plain(m[1]));
  const walkthrough=plain(html.match(/id="Walkthrough"[\s\S]*?<\/h2>\s*<p>([\s\S]*?)<\/p>/)?.[1]??'');
  const firstObjective=objectives.find(item=>!item.includes('BONUS')&&!item.startsWith('See '))??'';
  const area=firstObjective.match(/\b(?:in|at|within|inside|on) (?:the )?(.+?)(?:\.|$)/i)?.[1]??'';
  return {en:entry.en,wiki:entry.wiki,objectiveEn:firstObjective,areaEn:area,walkthroughEn:walkthrough};
}
const entries=rotation.cycles.bounty.entries;
const output=[];
for(let index=0;index<entries.length;index+=4){
  const chunk=await Promise.all(entries.slice(index,index+4).map(detail));
  output.push(...chunk);
  console.log(`${output.length}/${entries.length}`);
}
await fs.writeFile('src/data/zaishen/bounties.json',JSON.stringify(output,null,2)+'\n');
console.log(`Missing objective: ${output.filter(item=>!item.objectiveEn).map(item=>item.en).join(', ')||'none'}`);
