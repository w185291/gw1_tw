'use client';
import Link from 'next/link';
import {useRef} from 'react';
import type {Mission} from '@/data/schemas/content';
import styles from './Guide.module.css';
export function SidebarNavigation({missions,currentId,campaignName,campaignId}:{missions:Mission[];currentId:string;campaignName:string;campaignId:string}){
  const ref=useRef<HTMLDialogElement>(null);const current=missions.find(m=>m.id===currentId);
  const menu=<nav aria-label="本章關卡"><p className={styles.sidebarTitle}>{campaignName}</p>{missions.map(m=><Link key={m.id} href={`/missions/view/?campaign=${campaignId}&id=${m.id}`} aria-current={m.id===currentId?'page':undefined} onClick={()=>ref.current?.close()}><span className={styles.missionNumber}>{m.displayOrder??String(m.order).padStart(2,'0')}</span><span>{m.name.zhTW}<small>{m.name.en}</small></span></Link>)}</nav>;
  return <><aside className={styles.sidebar}>{menu}</aside><div className={styles.mobileMissionMenu}><button aria-haspopup="dialog" aria-controls="mission-drawer" onClick={()=>ref.current?.showModal()}>任務 {current?.displayOrder??current?.order} / {missions.length} · {current?.name.zhTW} <span aria-hidden>▾</span></button><dialog id="mission-drawer" ref={ref} className={styles.drawer} aria-label="切換任務"><button className={styles.closeButton} onClick={()=>ref.current?.close()}>關閉關卡選單</button>{menu}</dialog></div></>;
}
