import Link from 'next/link';
import {notFound} from 'next/navigation';
import {getCampaigns,getCampaign,getMissions} from '@/lib/content';
import {pageMetadata} from '@/lib/metadata';
import {MissionList} from '@/components/MissionList';
import {CampaignFlow} from '@/components/CampaignFlow';
import {getExtraGuides} from '@/lib/content';
import {Breadcrumbs} from '@/components/Breadcrumbs';
import styles from '@/components/Site.module.css';
export const dynamicParams=false;
export function generateStaticParams(){return getCampaigns().map(c=>({campaign:c.id}));}
export async function generateMetadata({params}:{params:Promise<{campaign:string}>}){const {campaign}=await params;const c=getCampaign(campaign);if(!c)notFound();return pageMetadata(c.name.zhTW,c.description,`/campaigns/${c.id}/`);}
export default async function CampaignPage({params}:{params:Promise<{campaign:string}>}){const {campaign}=await params;const c=getCampaign(campaign);if(!c)notFound();const missions=getMissions(c.id);return <><Breadcrumbs items={[{label:'首頁',href:'/'},{label:'主線攻略',href:'/campaigns/'},{label:c.name.zhTW}]}/><header className={styles.pageTitle}><p className={styles.eyebrow}>{c.shortName}</p><h1>{c.name.zhTW}</h1><p className={styles.titleEnglish}>{c.name.en}</p><p>{c.description}</p>{missions.length>0&&<Link className={styles.secondaryButton} href={`/campaigns/${c.id}/missions/`}>章節進度導航・任務列表</Link>}</header>{c.id==='prophecies'&&<div className={styles.notice}><strong>飛昇三試煉：順序不限</strong><p>第 15 絕望沙丘、第 16 乾渴之河、第 17 伊洛那流域可任意先後，三關全部完成後才進第 18 預言之石。列表順序是傳統排列。</p></div>}{missions.length?<><CampaignFlow campaign={c} missions={missions}/><MissionList missions={missions} campaign={c}/>{getExtraGuides().some(g=>g.campaign===c.id)&&<section className={styles.homeSection}><h2>主線以外・獨立分類</h2><div className={styles.quickLinks}>{getExtraGuides().filter(g=>g.campaign===c.id).map(g=><Link key={g.id} href={`/guides/${g.id}/`}>{g.name.zhTW} · {g.type==='challenge-mission'?'挑戰':g.type==='competitive-mission'?'競技':g.category==='elite'?'菁英':'破關後'}</Link>)}</div></section>}</>:<section className={styles.planned}><h2>本章攻略待整理</h2><p>這裡預留{c.structure==='branched'?'分支式流程':'任務流程'}，不套用第一章 25 關的結構。</p><p>{c.description}</p><Link href="/campaigns/prophecies/">先檢視第一章攻略</Link></section>}</>;}
