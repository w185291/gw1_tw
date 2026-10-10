import {skillCatalogEntries} from '@/lib/skill-catalog';
import Link from 'next/link';
import {getSkillsByProfession} from '@/lib/skills';
import {SkillCatalog} from '@/components/SkillCatalog';
import {SkillNavigation} from '@/components/SkillNavigation';
import styles from '@/components/Site.module.css';
export const metadata={title:'技能資料庫'};
export default function Skills(){const skills=getSkillsByProfession('warrior');const attributes=[...new Map(skills.map(s=>[s.attribute.id,s.attribute])).values()];return <div className={styles.pageContainer}><header className={styles.pageTitle}><h1>技能資料庫</h1><p>預設顯示戰士技能。請從職業入口切換其他職業；每頁只載入該職業，避免一次傳送全部 1,321 招。</p></header><p><Link href="/professions/">十種職業介紹與主／副職業規則</Link> · <Link href="/skill-trainers/">技能導師：依章節與據點查詢 NPC</Link></p><SkillNavigation professionId="warrior" attributes={attributes}/><SkillCatalog skills={skillCatalogEntries(skills)} initialProfession="warrior"/></div>;}
