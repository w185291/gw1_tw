'use client';
import Link from 'next/link';
import {useSearchParams} from 'next/navigation';
import type {ExtraGuide} from '@/data/schemas/content';
import {sections} from '@/data/sections';
import {useStaticJson} from '@/lib/use-static-json';
import {Breadcrumbs} from './Breadcrumbs';
import {entryTypeLabels} from '@/lib/labels';
import styles from './Guide.module.css';
export function GuideViewer(){
 const id=useSearchParams().get('id')??'';
 const valid=/^[a-z0-9-]+$/.test(id);
 const {data,error}=useStaticJson<ExtraGuide[]>(valid?'/data/guide-content/extras.json':null);
 if(!valid)return <p>找不到攻略。<Link href="/campaigns/">返回章節列表</Link></p>;
 if(error)return <p>攻略資料載入失敗，請重新整理頁面。</p>;
 if(!data)return <p role="status">正在載入攻略…</p>;
 const g=data.find(item=>item.id===id);
 if(!g)return <p>找不到攻略。<Link href="/campaigns/">返回章節列表</Link></p>;
 const section=sections.find(section=>section.entries.some(entry=>entry.href===`/guides/view/?id=${g.id}`));
 const overview=section?.entries.find(entry=>entry.href===`/guides/view/?id=${g.id}`)??(g.id==='finding-a-purpose'?{what:'黑暗逆襲破關後取得 Razah 的支線任務。',where:'先到 Gate of Anguish 找 Chaplain Phyratyss 接任務；進入 Heart of Abaddon 的入口 NPC Keeper Shafoss 位於 Abaddon’s Gate。',start:'先完成 Abaddon’s Gate。接任務後到 Abaddon’s Gate 找 Keeper Shafoss，進入 Heart of Abaddon 解救 Razah，最後回報 Chaplain Phyratyss。'}:undefined);
 return <><Breadcrumbs items={[{label:'首頁',href:'/'},{label:section?.title??'其他攻略',href:section?`/${section.id}/`:undefined},{label:g.name.zhTW}]}/><article className={styles.missionDetail}><header className={styles.detailHeader}><p>{entryTypeLabels[g.type]} · {g.campaign}</p><h1>{g.name.zhTW}</h1>{g.name.en!==g.name.zhTW&&<p>{g.name.en}</p>}<p>{g.summary}</p></header><section className={styles.detailSection}><h2>這是什麼？</h2><p>{overview?.what??g.summary}</p><h2>在哪裡？</h2><p>{overview?.where??'請參考下方 Wiki 地點與入口資料。'}</p><h2>怎麼開始？</h2><p>{overview?.start??'先確認所屬章節、前置條件和出發據點。'}</p>{g.steps.filter(step=>!step.startsWith('此專案為分類與入口索引')).length>0&&<><h2>進場提示</h2><ul>{g.steps.filter(step=>!step.startsWith('此專案為分類與入口索引')).map(step=><li key={step}>{step}</li>)}</ul></>}<h2>進一步查看</h2>{g.sources.map(s=><p key={s.url}><a href={s.url+'?oldid='+s.revision}>{s.title} · Guild Wars Wiki</a></p>)}{section&&<p><Link href={`/${section.id}/`}>返回{section.title}總覽 →</Link></p>}</section></article></>;
}
