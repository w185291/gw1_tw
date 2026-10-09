import Link from 'next/link';
import {notFound} from 'next/navigation';
import {sections} from '@/data/sections';
import {pageMetadata} from '@/lib/metadata';
import styles from '@/components/Site.module.css';
export const dynamicParams=false;
export function generateStaticParams(){return sections.map(s=>({section:s.id}));}
export async function generateMetadata({params}:{params:Promise<{section:string}>}){const {section}=await params;const s=sections.find(s=>s.id===section);if(!s)notFound();return pageMetadata(s.title,s.description,`/${s.id}/`);}
export default async function SectionPage({params}:{params:Promise<{section:string}>}){const {section}=await params;const s=sections.find(s=>s.id===section);if(!s)notFound();return <div className={styles.pageContainer}><header className={styles.pageTitle}><p className={styles.eyebrow}>下一階段內容</p><h1>{s.title}</h1><p>{s.description}</p></header><section className={styles.planned}><h2>攻略尚待整理</h2><p>第一階段先完成共用架構與第一章的三關完整示範。此入口目前不提供未查核的內容。</p><Link href="/campaigns/prophecies/">檢視第一章主線</Link></section></div>;}
