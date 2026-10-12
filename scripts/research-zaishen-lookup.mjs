import fs from 'node:fs/promises';
import path from 'node:path';
import rotation from '../src/data/zaishen/rotation.json' with {type:'json'};
import bounties from '../src/data/zaishen/bounties.json' with {type:'json'};

const directory='docs/reference/zaishen-lookup';
await fs.mkdir(directory,{recursive:true});
const cacheFile=path.join(directory,'pages.json');
let pages={};try{pages=JSON.parse(await fs.readFile(cacheFile,'utf8'));}catch{}
const questTitle=entry=>decodeURIComponent(new URL(entry.wiki).pathname.slice(6)).replaceAll('_',' ');
const titles=[...new Set([
 ...Object.values(rotation.cycles).flatMap(c=>c.entries.map(questTitle)),
 ...rotation.cycles.mission.entries.map(e=>e.en),
 ...rotation.cycles.vanquish.entries.map(e=>e.en),
 ...bounties.map(e=>e.areaEn.trim()).filter(e=>e&&!['his lair','Depths of Tyria','Deep'].includes(e)),
 'The Deep','Rragar’s Menagerie'.replace('’',"'"),'Arachni’s Haunt'.replace('’',"'"),'Ooze Pit',
 'Zaishen Challenge Quest','Zaishen Challenge Quest/Mission','Zaishen Challenge Quest/Bounty','Zaishen Challenge Quest/Vanquish',
 'Stygian Veil','Breaching the Stygian Veil','Brood Wars','Gate of Anguish',
])];
const pending=titles.filter(title=>!pages[title]);
for(let i=0;i<pending.length;i+=35){
 const batch=pending.slice(i,i+35);
 const url=new URL('https://wiki.guildwars.com/api.php');
 url.search=new URLSearchParams({action:'query',titles:batch.join('|'),prop:'revisions',rvprop:'ids|content',rvslots:'main',redirects:'1',format:'json',formatversion:'2'}).toString();
 const response=await fetch(url,{headers:{'User-Agent':'Mozilla/5.0 (compatible; GW1-TW-Guide/1.0)'}});
 if(!response.ok)throw Error(`Wiki HTTP ${response.status}`);
 const data=await response.json();if(data.error)throw Error(JSON.stringify(data.error));
 const canonical=new Map((data.query.pages??[]).map(p=>[p.title,{title:p.title,revision:p.revisions?.[0]?.revid??null,text:p.revisions?.[0]?.slots?.main?.content??''}]));
 const redirects=new Map([...(data.query.normalized??[]),...(data.query.redirects??[])].map(r=>[r.from,r.to]));
 for(const title of batch){let actual=title;for(let n=0;redirects.has(actual)&&n<5;n++)actual=redirects.get(actual);pages[title]=canonical.get(actual)??{title:actual,revision:null,text:''};}
 await fs.writeFile(cacheFile,JSON.stringify(pages));
 console.log(`Wiki research ${Math.min(i+35,pending.length)}/${pending.length} new pages`);
}
console.log(`Cached ${Object.keys(pages).length} pages; missing ${Object.values(pages).filter(p=>!p.text).length}`);
