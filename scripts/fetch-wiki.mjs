import fs from 'node:fs/promises';
import path from 'node:path';
const root=process.cwd(),destination=path.join(root,'docs/reference/phase23-refresh');
await fs.mkdir(destination,{recursive:true});
const pages=new Set();
for(const dir of ['factions/missions','nightfall/missions','heroes','extras']){
 for(const file of await fs.readdir(path.join(root,'src/data',dir))){
  if(!file.endsWith('.json'))continue;
  const d=JSON.parse(await fs.readFile(path.join(root,'src/data',dir,file),'utf8'));
  for(const s of [...(d.sources??[]),...(d.primaryQuestBefore??[]),...(d.primaryQuestAfter??[])]){
   const u=new URL(s.url);if(u.hostname==='wiki.guildwars.com'&&u.pathname.startsWith('/wiki/'))pages.add(decodeURIComponent(u.pathname.slice(6)).replaceAll('_',' '));
  }
 }
}
const queue=[...pages],failures=[];
async function worker(){while(queue.length){const title=queue.shift();try{
 const url=new URL('https://wiki.guildwars.com/api.php');url.search=new URLSearchParams({action:'parse',page:title,prop:'text|revid|links',format:'json',redirects:'1'}).toString();
 const response=await fetch(url,{headers:{'User-Agent':'GW1TraditionalChineseGuide/1.0 (manual revision refresh)'},signal:AbortSignal.timeout(45000)});
 if(!response.ok)throw new Error(`HTTP ${response.status}`);const data=await response.json();if(data.error)throw new Error(data.error.info);
 const name=title.toLowerCase().replaceAll("'",'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
 await fs.writeFile(path.join(destination,name+'.json'),JSON.stringify({title:data.parse.title,revision:data.parse.revid,checkedAt:new Date().toISOString().slice(0,10),html:data.parse.text['*'],links:data.parse.links},null,2));
 console.log(`Fetched ${title}: revision ${data.parse.revid}`);
 }catch(error){failures.push({title,error:String(error)});console.error(`${title}: ${error}`);}}}
await Promise.all([worker(),worker()]);
await fs.writeFile(path.join(destination,'manifest.json'),JSON.stringify({pages:pages.size,failures},null,2));
console.log('New snapshots saved separately. Reviewed Traditional Chinese data is never overwritten.');
if(failures.length)process.exitCode=1;
