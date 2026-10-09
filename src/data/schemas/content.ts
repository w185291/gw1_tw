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
export const missionSchema = z.object({
  id:slug,order:z.number().int().positive(),campaign:slug,region:slug,name,type:entryTypeSchema,
  category:z.enum(['main-story','side-story','elite','beyond']), status:z.enum(['complete','draft']),
  aliases:z.array(z.string()),tags:z.array(z.string()),summary:z.string(),partySize:z.number().int().positive().nullable(),recommendedLevel:z.number().int().positive().nullable(),
  difficulty:z.object({normal:difficultyRating,hard:difficultyRating}),
  estimatedMinutes:z.object({normal:z.number().positive().nullable(),hard:z.number().positive().nullable()}),
  durationCategory:z.enum(['short','medium','long','variable','unknown']),
  modes:z.object({normal:z.boolean(),hard:z.boolean()}),
  entryMethod:z.object({type:z.enum(['enter-mission','npc','quest']),description:z.string(),location:z.string(),requirements:z.array(z.string())}),
  requiredHeroes:z.array(z.object({id:slug,name})),rewardTiers:z.array(z.enum(['standard','expert','master'])),
  objectives:z.array(z.object({text:z.string()})),
  bonus:z.object({available:z.boolean(),kind:z.enum(['bonus','timed-bonus','masters','none']),title:z.string(),summary:z.string(),trigger:z.string(),steps:z.array(z.string()),missable:z.boolean(),completion:z.string()}),
  walkthrough:z.array(z.object({title:z.string(),content:z.string()})),routeSummary:z.string(),
  mapImage:z.string().nullable(),mapNotes:z.array(z.string()),
  maps:z.array(z.object({src:z.string().regex(/^\/maps\//),title:z.string(),alt:z.string(),width:z.number().int(),height:z.number().int(),filePage:z.url(),originalImage:z.url(),uploader:z.string(),copyright:z.string(),hasDrawnRoute:z.boolean(),role:z.string()})),
  bosses:z.array(z.object({name,profession:z.string().nullable(),importantSkills:z.array(z.string()),notes:z.array(z.string()),source:z.url(),revision:z.number().int().nullable()})),
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
export type GuideEntryType = z.infer<typeof entryTypeSchema>;
export type SearchEntry = { id:string;name:{zhTW:string;en:string};aliases:string[];tags:string[];summary:string;href:string;kind:string;status:'complete'|'draft' };
