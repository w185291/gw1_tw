import type {Mission} from '@/data/schemas/content';
import type {Skill} from '@/data/schemas/skills';

/** Player-facing prose only; omit source URLs and internal audit fields. */
export function missionSearchContent(m:Mission):string[]{
 return [m.summary,m.routeSummary,m.entryMethod.description,m.entryMethod.location,...m.entryMethod.requirements,
  ...m.objectives.map(item=>item.text),...m.walkthrough.flatMap(step=>[step.title,step.content]),
  m.bonus.title,m.bonus.summary,m.bonus.trigger,m.bonus.completion,...m.bonus.steps,
  ...m.tips,...m.warnings,...m.afterCompletion,...m.mapNotes,...m.recommendedTeam,
  ...m.primaryQuestBefore.flatMap(q=>[q.name.zhTW,q.name.en,q.giver,q.location,q.directions]),
  ...m.primaryQuestAfter.flatMap(q=>[q.name.zhTW,q.name.en,q.giver,q.location,q.directions]),
  ...m.bosses.flatMap(b=>[b.name.zhTW,b.name.en,b.strategy,...b.notes,...b.importantSkills]),
  ...m.modeDifferences.normal,...m.modeDifferences.hard];
}

export function skillSearchContent(s:Skill):string[]{
 return [s.description.pve.zhTW,s.description.pve.en,s.description.pvp?.zhTW??'',s.description.pvp?.en??'',
  ...s.pvpVariants.flatMap(v=>[v.description.zhTW,v.description.en]),s.explanation,...s.commonUses,
  s.earliestAcquisition?.description??'',s.recommendedAcquisition?.description??''];
}
