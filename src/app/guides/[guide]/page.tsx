import {notFound} from 'next/navigation';
import {getExtraGuides} from '@/lib/content';
import {pageMetadata} from '@/lib/metadata';
import {Breadcrumbs} from '@/components/Breadcrumbs';
import {entryTypeLabels} from '@/lib/labels';
import styles from '@/components/Guide.module.css';
export const dynamicParams=false;
export function generateStaticParams(){return getExtraGuides().map(g=>({guide:g.id}));}
export async function generateMetadata({params}:{params:Promise<{guide:string}>}){const {guide}=await params;const g=getExtraGuides().find(g=>g.id===guide);if(!g)notFound();return pageMetadata(g.name.zhTW,g.summary,`/guides/${g.id}/`);}
export default async function GuidePage({params}:{params:Promise<{guide:string}>}){const {guide}=await params;const g=getExtraGuides().find(g=>g.id===guide);if(!g)notFound();return <><Breadcrumbs items={[{label:'首頁',href:'/'},{label:'其他內容索引'},{label:g.name.zhTW}]}/><article className={styles.missionDetail}><header className={styles.detailHeader}><p>{entryTypeLabels[g.type]} · {g.campaign}</p><h1>{g.name.zhTW}</h1><p>{g.summary}</p></header><section className={styles.detailSection}><h2>入口與範圍</h2><ul>{g.steps.map(x=><li key={x}>{x}</li>)}</ul><h2>Wiki 原文</h2>{g.sources.map(s=><p key={s.url}><a href={s.url+'?oldid='+s.revision}>{s.title}</a> · 查核{s.checkedAt}</p>)}</section></article></>;}
