import {Suspense} from 'react';
import {AttributeViewer} from '@/components/AttributeViewer';
import {getSkillsByProfession} from '@/lib/skills';
import type {SkillAttributeLink} from '@/components/SkillNavigation';
export const metadata={title:'技能屬性'};
export default function Page(){
 const navigation:Record<string,SkillAttributeLink[]>={};
 for(const profession of ['warrior','ranger','monk','necromancer','mesmer','elementalist','assassin','ritualist','paragon','dervish','common']){
  navigation[profession]=[...new Map(getSkillsByProfession(profession).map(skill=>[skill.attribute.id,skill.attribute])).values()];
 }
 return <Suspense fallback={<p role="status">正在載入技能屬性…</p>}><AttributeViewer navigation={navigation}/></Suspense>;
}
