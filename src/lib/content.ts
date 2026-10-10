import {cache} from 'react';
import {getSkills} from './skills';
import {publicText} from './presentation';
import {isGuideComplete} from '@/lib/guide-audit';
import fs from 'node:fs';
import path from 'node:path';
import { campaignSchema, missionSchema,heroSchema,extraGuideSchema, type Campaign, type Mission, type SearchEntry } from '@/data/schemas/content';

const dataRoot = path.join(process.cwd(),'src','data');
const parseFile = (file:string):unknown => JSON.parse(fs.readFileSync(file,'utf8'));
export function getCampaigns():Campaign[] {
  return fs.readdirSync(path.join(dataRoot,'campaigns')).filter(file=>file.endsWith('.json')).map(file=>campaignSchema.parse(parseFile(path.join(dataRoot,'campaigns',file)))).sort((a,b)=>a.order-b.order);
}
export function getCampaign(id:string):Campaign|undefined { return getCampaigns().find(c=>c.id===id); }
function publicMission(m:Mission):Mission {return {...m,name:{...m.name,zhTW:publicText(m.name.zhTW)},primaryQuestBefore:m.primaryQuestBefore.map(q=>({...q,name:{...q.name,zhTW:publicText(q.name.zhTW)}})),primaryQuestAfter:m.primaryQuestAfter.map(q=>({...q,name:{...q.name,zhTW:publicText(q.name.zhTW)}})),bosses:m.bosses.map(b=>({...b,name:{...b.name,zhTW:publicText(b.name.zhTW)}}))};}
export function getMissions(campaign?:string):Mission[] {
  const campaigns=campaign?getCampaigns().filter(c=>c.id===campaign):getCampaigns();
  return campaigns.flatMap(c=>{
    const dir=path.join(dataRoot,c.id,'missions');
    return fs.existsSync(dir)?fs.readdirSync(dir).filter(file=>file.endsWith('.json')).map(file=>publicMission(missionSchema.parse(parseFile(path.join(dir,file))))):[];
  }).sort((a,b)=>a.campaign.localeCompare(b.campaign)||a.order-b.order);
}
export function getMission(campaign:string,id:string):Mission|undefined { return getMissions(campaign).find(m=>m.id===id); }
export function missionHref(m:Pick<Mission,'campaign'|'id'>):string {return `/missions/view/?campaign=${m.campaign}&id=${m.id}`;}
export function regionName(c:Campaign,id:string):string {return c.regions.find(r=>r.id===id)?.name.zhTW??id;}
export function getSearchEntries():SearchEntry[] {
  const missions=getMissions();
  const entryLabels:Record<string,string>={'cooperative-mission':'合作任務','primary-quest':'主線 Quest','story-quest':'故事 Quest','dungeon':'地下城','elite-mission':'菁英任務','challenge-mission':'挑戰任務','competitive-mission':'競技任務'};
  const entries:SearchEntry[]=missions.map(m=>({id:m.id,name:m.name,aliases:m.aliases,tags:[...m.tags,m.entryMethod.location,m.entryMethod.description,...m.walkthrough.map(step=>step.content),...m.bosses.flatMap(b=>[b.name.en,b.name.zhTW,...b.importantSkills]),...m.requiredHeroes.flatMap(h=>[h.name.en,h.name.zhTW])],summary:m.summary,href:missionHref(m),kind:entryLabels[m.type],status:isGuideComplete(m)?'complete':'draft'}));
  entries.push(...getHeroes().map(h=>({id:h.id,name:h.name,aliases:[],tags:[h.profession,h.choiceGroup??''],summary:h.summary,href:`/heroes/view/?id=${h.id}`,kind:'英雄招募',status:h.contentStatus==='complete'?'complete' as const:'draft' as const})));
  const quests=new Map<string,SearchEntry>(missions.flatMap(m=>[...m.primaryQuestBefore,...m.primaryQuestAfter].map(q=>[q.url,{id:q.name.en,name:q.name,aliases:[q.giver,q.location],tags:[q.directions],summary:q.directions,href:missionHref(m)+'#quest-chain',kind:q.optional?'可選 Quest':q.questType==='secondary'?'次要 Quest':'主線 Quest',status:isGuideComplete(m)&&q.translationStatus==='verified'?'complete':'draft'}])));
  entries.push(...quests.values());
  entries.push(...getExtraGuides().map(g=>({id:g.id,name:g.name,aliases:[],tags:[g.campaign,g.category],summary:g.summary,href:`/guides/view/?id=${g.id}`,kind:'其他內容索引',status:'draft' as const})));
  entries.push(...getSkills().map(s=>({id:s.id,name:s.name,aliases:s.aliases,tags:[s.profession.zhTW,s.profession.en,s.attribute.zhTW,s.attribute.en,s.campaign.zhTW,...s.commonUses],summary:s.explanation,href:`/skills/view/?id=${encodeURIComponent(s.id)}`,kind:'技能',status:s.contentStatus==='complete'?'complete' as const:'draft' as const})));
  return entries;
}
export function getHeroes(){const dir=path.join(dataRoot,'heroes');return fs.existsSync(dir)?fs.readdirSync(dir).filter(f=>f.endsWith('.json')).map(f=>heroSchema.parse(parseFile(path.join(dir,f)))):[];}
export const getHero=cache(function getHero(id:string){if(!/^[a-z0-9-]+$/.test(id))return undefined;const file=path.join(dataRoot,'heroes',`${id}.json`);return fs.existsSync(file)?heroSchema.parse(parseFile(file)):undefined;});
export function getExtraGuides(){const dir=path.join(dataRoot,'extras');return fs.existsSync(dir)?fs.readdirSync(dir).filter(f=>f.endsWith('.json')).map(f=>extraGuideSchema.parse(parseFile(path.join(dir,f)))):[];}
export const contentRepository = {getCampaigns,getCampaign,getMissions,getMission,getSearchEntries};
