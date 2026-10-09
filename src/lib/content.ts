import fs from 'node:fs';
import path from 'node:path';
import { campaignSchema, missionSchema, type Campaign, type Mission, type SearchEntry } from '@/data/schemas/content';

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
  return getMissions().map(m=>({id:m.id,name:m.name,aliases:m.aliases,tags:m.tags,summary:m.summary,href:missionHref(m),kind:'Mission',status:m.status}));
}
export const contentRepository = {getCampaigns,getCampaign,getMissions,getMission,getSearchEntries};
