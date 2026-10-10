import {skillCatalogEntries} from '@/lib/skill-catalog';
import Link from 'next/link';
import {notFound} from 'next/navigation';
import {getSkillsByProfession} from '@/lib/skills';
import {SkillCatalog} from '@/components/SkillCatalog';
import {SkillNavigation} from '@/components/SkillNavigation';
import styles from '@/components/Site.module.css';
export const dynamicParams=false;
export function generateStaticParams(){return ['warrior','ranger','monk','necromancer','mesmer','elementalist','assassin','ritualist','paragon','dervish','common'].map(profession=>({profession}));}
export default async function Profession({params}:{params:Promise<{profession:string}>}){const {profession}=await params;const skills=getSkillsByProfession(profession);if(!skills.length)notFound();const name=skills[0].profession;const attributes=[...new Map(skills.map(s=>[s.attribute.id,s.attribute])).values()];return <div className={styles.pageContainer}><p><Link href="/skills/">技能資料庫</Link> / {name.zhTW}</p><h1>{name.zhTW} · {name.en}</h1><p>普通技能 {skills.filter(s=>!s.elite).length} · 菁英 {skills.filter(s=>s.elite).length} · PvE 專用 {skills.filter(s=>s.pveOnly).length} · PvP 分版 {skills.filter(s=>s.pvpVariantExists).length}</p><SkillNavigation professionId={profession} attributes={attributes}/><SkillCatalog skills={skillCatalogEntries(skills)} initialProfession={profession}/></div>;}
