import type {MetadataRoute} from 'next';
import {siteUrl} from '@/lib/metadata';
import {getCampaigns} from '@/lib/content';
import professions from '@/data/professions.json';
import {sections} from '@/data/sections';
export const dynamic='force-static';

export default function sitemap():MetadataRoute.Sitemap{
 const paths=['/','/what-is-guild-wars/','/getting-started/','/campaigns/','/campaigns/prophecies/pre-searing/','/professions/','/character-creation/','/skills/','/skill-trainers/','/heroes/','/search/','/hall-of-monuments/','/glossary/','/data-sources/game-client/'];
 paths.push(...sections.map(section=>`/${section.id}/`));
 for(const campaign of getCampaigns())paths.push(`/campaigns/${campaign.id}/`,`/campaigns/${campaign.id}/missions/`);
 for(const profession of professions)paths.push(`/professions/${profession.id}/`,`/skills/professions/${profession.id}/`);
 paths.push('/skills/professions/common/');
 return [...new Set(paths)].map(path=>({url:new URL(path,siteUrl).href,changeFrequency:'monthly',priority:path==='/'?1:path==='/hall-of-monuments/'?0.8:0.7}));
}
