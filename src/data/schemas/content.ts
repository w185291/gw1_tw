import { z } from 'zod';

const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const name = z.object({ zhTW: z.string().min(1), en: z.string().min(1) });
export const entryTypeSchema = z.enum(['cooperative-mission','primary-quest','dungeon','elite-mission','challenge-mission','story-quest','competitive-mission']);
const difficultyRating = z.number().int().min(1).max(5).nullable();
const source = z.object({ title:z.string(), url:z.url(), revision:z.number().int().nullable(), checkedAt:z.iso.date(), role:z.enum(['mechanics','terminology','build']) });
const flowNode = z.object({ entry:slug, requires:z.array(slug), branch:z.string().nullable() });
export const campaignSchema = z.object({
  id:slug, name, shortName:z.string(), order:z.number().int(), description:z.string(),
  status:z.enum(['available','planned']), regions:z.array(z.object({id:slug,name})),
  structure:z.enum(['timeline','branched']), flow:z.array(flowNode),
});
const reward = z.object({label:z.string(),experience:z.number().int().nonnegative().nullable(),gold:z.number().int().nonnegative().nullable(),skillPoints:z.number().int().nonnegative().nullable(),notes:z.array(z.string())});
const quest = z.object({name, giver:z.string(), location:z.string(), directions:z.string(), url:z.url(), revision:z.number().int(), translationStatus:z.enum(['verified','needs-review']), optional:z.boolean().default(false), questType:z.enum(['primary','secondary']).default('primary')});
const tierConditions = z.object({standard:z.string(),expert:z.string(),master:z.string()});
const mechanism = z.object({name:z.string(),mechanism:z.string(),counter:z.string()});
export const missionSchema = z.object({
  id:slug,order:z.number().int().positive(),campaign:slug,region:slug,name,type:entryTypeSchema,
  category:z.enum(['main-story','side-story','elite','beyond']), status:z.enum(['complete','draft']),
  contentStatus:z.enum(['complete','incomplete']).default('incomplete'),
  storyStartVerified:z.boolean().default(false),storyEndingVerified:z.boolean().default(false),
  translationVerified:z.boolean().default(false),translationSources:z.array(z.url()).default([]),
  terminologyAudit:z.object({status:z.enum(['verified','incomplete']),sources:z.array(z.url())}).default({status:'incomplete',sources:[]}),
  aliases:z.array(z.string()),tags:z.array(z.string()),summary:z.string(),partySize:z.number().int().positive().nullable(),recommendedLevel:z.number().int().positive().nullable(),
  difficulty:z.object({normal:difficultyRating,hard:difficultyRating}),
  estimatedMinutes:z.object({normal:z.number().positive().nullable(),hard:z.number().positive().nullable()}),
  durationCategory:z.enum(['short','medium','long','variable','unknown']),
  modes:z.object({normal:z.boolean(),hard:z.boolean()}),
  entryMethod:z.object({type:z.enum(['enter-mission','npc','quest']),description:z.string(),location:z.string(),requirements:z.array(z.string())}),
  requiredHeroes:z.array(z.object({id:slug,name,required:z.boolean().default(true)})),rewardTiers:z.array(z.enum(['standard','expert','master'])),
  requiredHeroesVerified:z.boolean().default(false),
  displayOrder:z.string().optional(),storyStage:z.number().int().optional(),
  translationStatus:z.enum(['verified','needs-review']).default('verified'),verificationStatus:z.enum(['source-checked','pending']).default('pending'),
  branch:z.string().nullable().default(null),routeChoice:z.string().nullable().default(null),
  nextOptions:z.array(slug).default([]),previousOptions:z.array(slug).default([]),
  entryVariants:z.array(z.object({name:z.string(),description:z.string()})).default([]),
  primaryQuestBefore:z.array(quest).default([]),primaryQuestAfter:z.array(quest).default([]),
  missionStarter:z.string().nullable().default(null),
  masterReward:z.object({kind:z.enum(['time','survival','objectives','special']),normal:tierConditions,hard:tierConditions,notes:z.array(z.string())}).optional(),
  missionReward:z.object({system:z.literal('standard-expert-master'),normal:tierConditions,hard:tierConditions}).optional(),
  bossMechanics:z.array(mechanism).default([]),
  bossAbsenceVerified:z.boolean().default(false),bossAbsenceReason:z.string().default(''),
  checklist:z.array(z.object({title:z.string(),items:z.array(z.string())})).default([]),
  defenseTimeline:z.array(z.object({stage:z.string(),action:z.string()})).default([]),
  strategyVariants:z.array(z.object({title:z.string(),steps:z.array(z.string())})).default([]),
  specialActivities:z.array(z.object({title:z.string(),instructions:z.string()})).default([]),
  afterCompletion:z.array(z.string()).default([]),
  objectives:z.array(z.object({text:z.string()})),
  bonus:z.object({available:z.boolean(),kind:z.enum(['bonus','timed-bonus','masters','none']),title:z.string(),summary:z.string(),trigger:z.string(),steps:z.array(z.string()),missable:z.boolean(),completion:z.string()}),
  walkthrough:z.array(z.object({title:z.string(),content:z.string()})),routeSummary:z.string(),
  mapImage:z.string().nullable(),mapNotes:z.array(z.string()),
  maps:z.array(z.object({src:z.string().regex(/^\/maps\//),title:z.string(),alt:z.string(),width:z.number().int(),height:z.number().int(),filePage:z.url(),originalImage:z.url(),uploader:z.string(),copyright:z.string(),hasDrawnRoute:z.boolean(),role:z.string()})),
  bosses:z.array(z.object({name,profession:z.string().nullable(),importantSkills:z.array(z.string()),notes:z.array(z.string()),source:z.url(),revision:z.number().int().nullable(),translationVerified:z.boolean().default(false),strategy:z.string().default(''),eliteSkills:z.array(z.string()).default([]),eliteSkillsVerified:z.boolean().default(false),skillListVerified:z.boolean().default(false),skillListNotes:z.string().default(''),dangerousSkills:z.array(z.object({name:z.string(),counter:z.string(),source:z.url()})).default([])})),
  recommendedTeam:z.array(z.string()),tips:z.array(z.string()),warnings:z.array(z.string()),
  modeDifferences:z.object({normal:z.array(z.string()),hard:z.array(z.string())}),
  rewards:z.object({normal:z.array(reward),bonus:z.array(reward),hard:z.array(reward),zaishen:z.array(reward),reforged:z.array(reward)}),
  wiki:z.object({guildWarsWiki:z.url(),pvx:z.url().nullable()}),sources:z.array(source),todos:z.array(z.string()),
  previousMission:slug.nullable(),nextMission:slug.nullable(),prerequisites:z.array(slug),
});
export type Campaign = z.infer<typeof campaignSchema>;
export const guideEntrySchema = missionSchema.pick({id:true,campaign:true,region:true,name:true,type:true,category:true,status:true,aliases:true,tags:true,summary:true,entryMethod:true,requiredHeroes:true,rewardTiers:true,sources:true});
export type GuideEntry = z.infer<typeof guideEntrySchema>;
export type Mission = z.infer<typeof missionSchema>;
export const heroSchema=z.object({campaign:z.enum(['prophecies','factions','nightfall','eye-of-the-north','beyond','core']).default('nightfall'),id:slug,name,profession:z.string(),translationStatus:z.enum(['verified','needs-review']),contentStatus:z.enum(['complete','incomplete']).default('incomplete'),summary:z.string(),native:z.array(z.string()),foreign:z.array(z.string()),choiceGroup:z.string().nullable(),postgame:z.array(z.string()),requiredIn:z.array(slug),sources:z.array(source)});
export type Hero=z.infer<typeof heroSchema>;
export const extraGuideSchema=z.object({id:slug,campaign:slug,name,type:entryTypeSchema,category:z.enum(['side-story','elite','beyond']),summary:z.string(),steps:z.array(z.string()),sources:z.array(source)});
export type ExtraGuide=z.infer<typeof extraGuideSchema>;
export type GuideEntryType = z.infer<typeof entryTypeSchema>;
export type SearchEntry = { id:string;name:{zhTW:string;en:string};aliases:string[];tags:string[];summary:string;href:string;kind:string;status:'complete'|'draft' };
