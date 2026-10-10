import type {Mission} from '../data/schemas/content';

export const auditLabels:Record<string,string>={translation:'任務繁中名稱與來源',walkthrough:'完整通關步驟',objectives:'主線目標',entry:'入口與接取方式',bonus:'Bonus／大師或完成條件',boss:'Boss 資料整體查核',bossStrategy:'Boss 對策',bossSkills:'Boss 技能來源',bossTranslation:'Boss 繁中名稱',nm:'普通模式說明',hm:'困難模式說明',next:'後續任務銜接',previous:'前置任務銜接',sources:'兩份不同來源',wiki:'Wiki 連結',team:'隊伍需求',warnings:'失敗與易漏重點',terminology:'全文專有名詞查核',requiredHero:'必要英雄與啟動 NPC',placeholders:'本文未確認內容'};

export function guideChecks(m:Mission):Record<string,boolean>{
    const checks:Record<string,boolean>={
      translation:m.translationVerified===true&&Array.isArray(m.translationSources)&&m.translationSources.length>0,
      walkthrough:Array.isArray(m.walkthrough)&&m.walkthrough.length>=4&&m.walkthrough.every((s:{title:string;content:string})=>s.title?.trim()&&s.content?.trim()),
      objectives:m.objectives?.length>=1,
      entry:Boolean(m.entryMethod?.description?.trim())&&Boolean(m.entryMethod?.location?.trim()),
      bonus:(m.bonus?.kind==='none'?Boolean(m.bonus?.available===false&&m.bonus?.summary&&m.bonus?.completion):Boolean(m.bonus?.steps?.length&&m.bonus?.completion&&m.bonus?.trigger))&&(!['factions','nightfall'].includes(m.campaign)||Boolean(m.masterReward?.normal?.master&&m.masterReward?.hard?.master)),
      boss:m.bosses?.length>0?m.bosses.every(b=>Boolean(b.profession&&b.strategy&&b.eliteSkillsVerified===true&&b.translationVerified===true)):Boolean(m.bossAbsenceVerified&&m.bossAbsenceReason),
      bossStrategy:m.bosses?.length>0?m.bosses.every((b:{strategy:string})=>Boolean(b.strategy?.trim())):Boolean(m.bossAbsenceVerified&&m.bossAbsenceReason),
      bossSkills:m.bosses?.length>0?m.bosses.every((b:{eliteSkillsVerified:boolean;skillListVerified:boolean})=>b.eliteSkillsVerified===true&&b.skillListVerified===true):Boolean(m.bossAbsenceVerified&&m.bossAbsenceReason),
      bossTranslation:m.bosses?.length>0?m.bosses.every((b:{translationVerified:boolean})=>b.translationVerified===true):Boolean(m.bossAbsenceVerified&&m.bossAbsenceReason),
      nm:m.modeDifferences?.normal?.length>0,
      hm:m.modeDifferences?.hard?.length>0,
      next:m.afterCompletion?.length>0&&Boolean(m.nextMission||m.nextOptions?.length||m.storyEndingVerified),
      previous:Boolean(m.previousMission||m.previousOptions?.length||m.storyStartVerified),
      sources:new Set((m.sources??[]).map((s:{url:string})=>s.url.split('?')[0])).size>=2,
      wiki:/^https:\/\/wiki\.guildwars\.com\//.test(m.wiki?.guildWarsWiki??''),
      team:m.recommendedTeam?.length>0,
      warnings:m.warnings?.length>0,
      terminology:m.terminologyAudit?.status==='verified'&&m.terminologyAudit?.sources?.length>0,
      requiredHero:m.campaign!=='nightfall'||(Boolean(m.missionStarter)&&m.requiredHeroesVerified===true),
      placeholders:!/(?:TODO|TBD|needs-review|尚待|待整理|待查核|待確認)/i.test(JSON.stringify([m.walkthrough,m.bonus,m.entryMethod,m.modeDifferences,m.todos,m.bosses,m.afterCompletion])),
    };
  return checks;
}
export function isGuideComplete(m:Mission):boolean {
  return m.contentStatus==='complete' && Object.values(guideChecks(m)).every(Boolean);
}
