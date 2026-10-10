import Link from 'next/link';
import {notFound} from 'next/navigation';
import {sections} from '@/data/sections';
import {pageMetadata} from '@/lib/metadata';
import styles from '@/components/Site.module.css';
import pageStyles from './SectionPage.module.css';
import {BuildGuide} from '@/components/BuildGuide';
import {ZaishenDaily} from '@/components/ZaishenDaily';
export const dynamicParams=false;
export function generateStaticParams(){return sections.map(s=>({section:s.id}));}
export async function generateMetadata({params}:{params:Promise<{section:string}>}){const {section}=await params;const s=sections.find(s=>s.id===section);if(!s)notFound();return pageMetadata(s.title,s.description,`/${s.id}/`);}
export default async function SectionPage({params}:{params:Promise<{section:string}>}){
 const {section}=await params;
 const s=sections.find(s=>s.id===section);
 if(!s)notFound();
 if(section==='builds')return <BuildGuide/>;
 if(section==='zaishen')return <ZaishenDaily/>;
 return <div className={styles.pageContainer}>
  <header className={`${styles.pageTitle} ${pageStyles.heading}`}><p className={styles.eyebrow}>遊戲內容指南</p><h1>{s.title}</h1><p>{s.description}</p></header>
  <section className={pageStyles.intro} aria-label="玩法與開始方式"><div><h2>這是什麼？</h2><p>{s.intro}</p></div><div><h2>從哪裡開始？</h2><p>{s.start}</p></div></section>
  <div className={pageStyles.sectionHeading}><h2>入口與玩法</h2><span>依內容選一項，再查看詳細 Wiki 資料</span></div>
  <div className={pageStyles.cards}>{s.entries.map(entry=><article className={pageStyles.card} key={entry.en??entry.title}><h3>{entry.title}</h3>{entry.en&&<p className={pageStyles.english}>{entry.en}</p>}<dl><dt>這是什麼</dt><dd>{entry.what}</dd><dt>在哪裡</dt><dd>{entry.where}</dd><dt>怎麼開始</dt><dd>{entry.start}</dd></dl><div className={pageStyles.actions}>{entry.href&&<Link href={entry.href}>{entry.linkLabel??'查看本站資料'} →</Link>}<a href={entry.wiki}>Guild Wars Wiki ↗</a></div></article>)}</div>
  <section className={pageStyles.sources}><h2>參考資料</h2><ul>{s.sources.map(source=><li key={source.url}><a href={source.url}>{source.label}</a></li>)}</ul><p>本站重新整理入口與玩法，具體敵人配置及輪替內容以各連結的 Wiki 頁為準。</p></section>
 </div>;
}
