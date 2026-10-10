'use client';
import Link from 'next/link';
import {useSearchParams} from 'next/navigation';
import type {SkillCatalogEntry} from '@/lib/skill-catalog';
import {useStaticJson} from '@/lib/use-static-json';
import {SkillCatalog} from './SkillCatalog';
import {SkillNavigation, type SkillAttributeLink} from './SkillNavigation';
import attributeInfo from '@/data/skill-attributes.json';
import styles from './Site.module.css';
export function AttributeViewer({navigation}:{navigation:Record<string,SkillAttributeLink[]>}){
 const params=useSearchParams();
 const id=params.get('id')??'';
 const valid=/^[a-z0-9-]+$/.test(id);
 const {data,error}=useStaticJson<SkillCatalogEntry[]>(valid?`/data/guide-content/attributes/${id}.json`:null);
 if(!valid)return <p>找不到屬性。<Link href="/skills/">返回技能資料庫</Link></p>;
 if(error)return <p>屬性資料載入失敗，請重新整理頁面。</p>;
 if(!data)return <p role="status">正在載入技能屬性…</p>;
 const skills=data;
 if(!skills?.length)return <p>找不到屬性。<Link href="/skills/">返回技能資料庫</Link></p>;
 const name=skills[0].attribute,info=attributeInfo[id as keyof typeof attributeInfo];
 const requestedProfession=params.get('profession')??'';
 const professionId=navigation[requestedProfession]?.some(attribute=>attribute.id===id)?requestedProfession:skills[0].profession.id;
 return <div className={styles.pageContainer}><p><Link href="/skills/">技能資料庫</Link> / <Link href={`/skills/professions/${professionId}/`}>職業技能</Link> / {name.zhTW}</p><h1>{name.zhTW} · {name.en}</h1>{info&&<p>{info.description} <a href={info.source}>屬性來源</a></p>}<SkillNavigation professionId={professionId} attributes={navigation[professionId]??[]} attributeId={id}/><p>普通技能 {skills.filter(s=>!s.elite).length} · 菁英 {skills.filter(s=>s.elite).length}</p><p>{[...new Set(skills.map(s=>s.campaign.en))].map(c=>`${c}：${skills.filter(s=>s.campaign.en===c).length}`).join(' · ')}</p><SkillCatalog key={id} skills={skills}/></div>;
}
