import fs from 'node:fs';
import path from 'node:path';
import { campaignSchema, missionSchema,heroSchema,extraGuideSchema, type Campaign, type Mission, type SearchEntry } from '@/data/schemas/content';

const dataRoot = path.join(process.cwd(),'src','data');
const parseFile = (file:string):unknown => JSON.parse(fs.readFileSync(file,'utf8'));
export function getCampaigns():Campaign[] {
  return fs.readdirSync(path.join(dataRoot,'campaigns')).filter(file=>file.endsWith('.json')).map(file=>campaignSchema.parse(parseFile(path.join(dataRoot,'campaigns',file)))).sort((a,b)=>a.order-b.order);
}
export function getCampaign(id:string):Campaign|undefined { return getCampaigns().find(c=>c.id===id); }
export function getMissions(campaign?:string):Mission[] {
  const campaigns=campaign?getCampaigns().filter(c=>c.id===campaign):getCampaigns();
  return campaigns.flatMap(c=>{
    const dir=path.join(dataRoot,c.id,'missions');
    return fs.existsSync(dir)?fs.readdirSync(dir).filter(file=>file.endsWith('.json')).map(file=>missionSchema.parse(parseFile(path.join(dir,file)))):[];
  }).sort((a,b)=>a.campaign.localeCompare(b.campaign)||a.order-b.order);
}
export function getMission(campaign:string,id:string):Mission|undefined { return getMissions(campaign).find(m=>m.id===id); }
export function missionHref(m:Pick<Mission,'campaign'|'id'>):string {return `/campaigns/${m.campaign}/missions/${m.id}/`;}
export function regionName(c:Campaign,id:string):string {return c.regions.find(r=>r.id===id)?.name.zhTW??id;}
export function getSearchEntries():SearchEntry[] {
  const missions=getMissions();
  const entries:SearchEntry[]=missions.map(m=>({id:m.id,name:m.name,aliases:m.aliases,tags:[...m.tags,...m.requiredHeroes.flatMap(h=>[h.name.en,h.name.zhTW])],summary:m.summary,href:missionHref(m),kind:'Mission',status:m.status}));
  entries.push(...getHeroes().map(h=>({id:h.id,name:h.name,aliases:[],tags:[h.profession,h.choiceGroup??''],summary:h.summary,href:`/heroes/${h.id}/`,kind:'英雄招募',status:'complete' as const})));
  const quests=new Map<string,SearchEntry>(missions.flatMap(m=>[...m.primaryQuestBefore,...m.primaryQuestAfter].map(q=>[q.url,{id:q.name.en,name:q.name,aliases:[q.giver,q.location],tags:[q.directions],summary:q.directions,href:missionHref(m)+'#quest-chain',kind:'主線 Quest',status:'complete'}])));
  entries.push(...quests.values());
  entries.push(...getExtraGuides().map(g=>({id:g.id,name:g.name,aliases:[],tags:[g.campaign,g.category],summary:g.summary,href:`/guides/${g.id}/`,kind:'其他內容索引',status:'draft' as const})));
  return entries;
}
export function getHeroes(){const dir=path.join(dataRoot,'heroes');return fs.existsSync(dir)?fs.readdirSync(dir).filter(f=>f.endsWith('.json')).map(f=>heroSchema.parse(parseFile(path.join(dir,f)))):[];}
export function getExtraGuides(){const dir=path.join(dataRoot,'extras');return fs.existsSync(dir)?fs.readdirSync(dir).filter(f=>f.endsWith('.json')).map(f=>extraGuideSchema.parse(parseFile(path.join(dir,f)))):[];}
export const contentRepository = {getCampaigns,getCampaign,getMissions,getMission,getSearchEntries};
