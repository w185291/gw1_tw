import {z} from 'zod';
const name=z.object({id:z.string(),en:z.string().min(1),zhTW:z.string().min(1),translationVerified:z.boolean().optional()});
const effect=z.object({en:z.string(),zhTW:z.string()});
const source=z.object({url:z.url(),title:z.string(),revision:z.number(),checkedAt:z.string()});
const acquisition=z.object({name,locations:z.array(z.object({name,url:z.url()})),campaign:z.string(),details:z.string(),source:z.url(),url:z.url(),unlockOnly:z.boolean(),profession:z.string().nullable()});
export const skillSchema=z.object({
 id:z.string(),name:z.object({en:z.string(),zhTW:z.string()}),clientSkillId:z.number(),icon:z.string().nullable(),profession:name,attribute:name,type:name,campaign:name,
 pvpOnly:z.boolean().default(false),elite:z.boolean(),pveOnly:z.boolean(),pvpVariantExists:z.boolean(),pvpVariantVerified:z.boolean(),
 cost:z.object({energy:z.number(),adrenaline:z.number(),sacrifice:z.number(),overcast:z.number(),upkeep:z.number().default(0)}),activation:z.number(),recharge:z.number(),rechargeNote:z.string().default(''),
 description:z.object({pve:effect,pvp:effect.nullable()}),pvpVariants:z.array(z.object({name:z.string(),description:effect,stats:z.record(z.string(),z.number()),source,clientSkillId:z.number()})),
 acquisition:z.object({trainers:z.array(acquisition),quests:z.array(acquisition),bosses:z.array(acquisition),special:z.array(acquisition),professionChangers:z.array(acquisition),tomes:z.boolean(),eliteTome:z.boolean(),verified:z.boolean()}),
 availableCampaigns:z.array(z.string()),explanation:z.string(),commonUses:z.array(z.string()),aliases:z.array(z.string()),relatedSkills:z.array(name),
 earliestAcquisition:z.object({description:z.string(),source:z.string()}).nullable(),recommendedAcquisition:z.object({description:z.string(),source:z.string()}).nullable(),
 sources:z.array(source),translationVerified:z.boolean(),translationSources:z.array(z.string()),contentStatus:z.enum(['complete','incomplete']),
});
export type Skill=z.infer<typeof skillSchema>;
