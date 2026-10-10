import type {MetadataRoute} from 'next';
import {siteUrl} from '@/lib/metadata';
import {getCampaigns,getExtraGuides,getHeroes,getMissions,missionHref} from '@/lib/content';
import {getSkills} from '@/lib/skills';
import {skillTrainerIndex,trainerHref} from '@/lib/skill-trainers';
import attributes from '@/data/skill-attributes.json';
import professions from '@/data/professions.json';
import {sections} from '@/data/sections';
export const dynamic='force-static';

export default function sitemap():MetadataRoute.Sitemap{
 const paths=['/','/what-is-guild-wars/','/getting-started/','/campaigns/','/campaigns/prophecies/pre-searing/','/professions/','/character-creation/','/skills/','/skill-trainers/','/heroes/','/hall-of-monuments/','/glossary/','/data-sources/game-client/'];
 paths.push(...sections.map(section=>`/${section.id}/`));
 for(const campaign of getCampaigns())paths.push(`/campaigns/${campaign.id}/`,`/campaigns/${campaign.id}/missions/`);
 for(const profession of professions)paths.push(`/professions/${profession.id}/`,`/skills/professions/${profession.id}/`);
 paths.push('/skills/professions/common/');
 paths.push(...getMissions().map(missionHref));
 paths.push(...getHeroes().map(hero=>`/heroes/view/?id=${encodeURIComponent(hero.id)}`));
 paths.push(...getExtraGuides().map(guide=>`/guides/view/?id=${encodeURIComponent(guide.id)}`));
 paths.push(...getSkills().map(skill=>`/skills/view/?id=${encodeURIComponent(skill.id)}`));
 paths.push(...skillTrainerIndex.map(trainer=>trainerHref(trainer.id)));
 paths.push(...Object.keys(attributes).map(id=>`/skills/attributes/view/?id=${encodeURIComponent(id)}`));
 // Next's sitemap serializer writes URL strings verbatim, so escape query separators for XML.
 return [...new Set(paths)].map(path=>({url:new URL(path,siteUrl).href.replaceAll('&','&amp;')}));
}
