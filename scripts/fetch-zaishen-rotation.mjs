import fs from 'node:fs/promises';

const wiki='https://wiki.guildwars.com';
const categories=[
  {id:'mission',page:'Zaishen Mission/cycles',expected:69,anchor:'Tihark Orchard'},
  {id:'bounty',page:'Zaishen Bounty/cycles',expected:66,anchor:'Dragon Lich'},
  {id:'combat',page:'Zaishen Combat/cycles',expected:28,anchor:'Jade Quarry',nextTwo:['Random Arena','Codex Arena']},
  {id:'vanquish',page:'Zaishen Vanquish/cycles',expected:136,anchor:'Drakkar Lake'},
];
const decode=text=>text.replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#39;|&apos;/g,"'").replace(/&nbsp;/g,' ').replace(/&#(\d+);/g,(_,n)=>String.fromCodePoint(Number(n)));
async function parsedPage(page){
  const url=new URL(`${wiki}/api.php`);
  url.search=new URLSearchParams({action:'parse',page,prop:'text',format:'json',formatversion:'2'}).toString();
  const response=await fetch(url,{headers:{'User-Agent':'Mozilla/5.0 (compatible; GW1-TW-Guide/1.0)'}});
  if(!response.ok)throw Error(`${page}: HTTP ${response.status}`);
  const data=await response.json();
  if(typeof data.parse?.text!=='string')throw Error(`${page}: missing parsed HTML`);
  return data.parse.text;
}
function entriesFromCycles(html){
  const firstTable=html.match(/<table\b[^>]*>([\s\S]*?)<\/table>/)?.[1];
  if(!firstTable)throw Error('Cycle table missing');
  const rows=[...firstTable.matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/g)];
  return rows.flatMap(([,row])=>{
    const cells=[...row.matchAll(/<td\b[^>]*>([\s\S]*?)<\/td>/g)].map(m=>m[1]);
    if(cells.length<2)return [];
    const link=cells[0].match(/<a\b[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/);
    if(!link)return [];
    const name=decode(link[2].replace(/<[^>]+>/g,'').trim());
    const href=decode(link[1]);
    if(!href.includes('Zaishen_')&&!href.includes('Zaishen%20'))return [];
    return [{en:name,wiki:href.startsWith('http')?href:`${wiki}${href}`}];
  });
}
const result={source:`${wiki}/wiki/Zaishen_Challenge_Quest`,anchorDate:'2026-10-10',resetHourUtc:16,cycles:{}};
for(const category of categories){
  const entries=entriesFromCycles(await parsedPage(category.page));
  const anchorIndex=entries.findIndex((entry,index)=>entry.en===category.anchor&&(!category.nextTwo||category.nextTwo.every((name,offset)=>entries[(index+offset+1)%entries.length].en===name)));
  if(entries.length!==category.expected||anchorIndex<0)throw Error(`${category.id}: got ${entries.length} rows; anchor ${anchorIndex}`);
  result.cycles[category.id]={source:`${wiki}/wiki/${category.page.replaceAll(' ','_')}`,anchorIndex,entries};
  console.log(`${category.id}: ${entries.length}, anchor ${anchorIndex}, next ${entries[(anchorIndex+1)%entries.length].en}`);
}
await fs.mkdir('src/data/zaishen',{recursive:true});
await fs.writeFile('src/data/zaishen/rotation.json',JSON.stringify(result,null,2)+'\n');
