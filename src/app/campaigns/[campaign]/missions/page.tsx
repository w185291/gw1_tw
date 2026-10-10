import {notFound} from 'next/navigation';
import {getCampaigns,getCampaign,getMissions} from '@/lib/content';
import {MissionList} from '@/components/MissionList';
import {CampaignFlow} from '@/components/CampaignFlow';
import {Breadcrumbs} from '@/components/Breadcrumbs';
import {pageMetadata} from '@/lib/metadata';
import styles from '@/components/Site.module.css';
export const dynamicParams=false;
export function generateStaticParams(){return getCampaigns().map(c=>({campaign:c.id}));}
export async function generateMetadata({params}:{params:Promise<{campaign:string}>}){const {campaign}=await params;const c=getCampaign(campaign);if(!c)notFound();return pageMetadata(`${c.name.zhTW}・任務列表`,c.description,`/campaigns/${c.id}/missions/`);}
export default async function Missions({params}:{params:Promise<{campaign:string}>}){const {campaign}=await params;const c=getCampaign(campaign);if(!c)notFound();const missions=getMissions(c.id);return <><Breadcrumbs items={[{label:'首頁',href:'/'},{label:c.name.zhTW,href:`/campaigns/${c.id}/`},{label:'任務列表'}]}/><header className={styles.pageTitle}><p className={styles.eyebrow}>MISSION TIMELINE</p><h1>{c.name.zhTW}・任務列表</h1><p>{missions.length?`${missions.length} 份任務攻略；可按地區、型別與模式查詢。`:'本章任務與主線 Quest 待整理。'}</p></header>{c.id==='prophecies'&&<p className={styles.notice}>15–17 飛昇三試煉可自由選擇順序，須三關皆完成才能進行占卜之石。</p>}<CampaignFlow campaign={c} missions={missions}/><MissionList missions={missions} campaign={c}/></>;}
