'use client';
import Image from 'next/image';
import {useRef,useState} from 'react';
import type {Mission} from '@/data/schemas/content';
import styles from './Guide.module.css';
export function MapGallery({maps}:{maps:Mission['maps']}){
  const dialog=useRef<HTMLDialogElement>(null);const [selected,setSelected]=useState(maps[0]);
  return <><div className={styles.mapGrid}>{maps.map(map=><figure key={map.src}><button className={styles.mapButton} aria-haspopup="dialog" aria-label={`放大${map.alt}`} onClick={()=>{setSelected(map);dialog.current?.showModal();}}><Image src={map.src} alt={map.alt} width={map.width} height={map.height} unoptimized/><span>放大檢視</span></button><figcaption>{map.title}{!map.hasDrawnRoute&&<small>此原圖沒有玩家行走路線；請搭配本頁步驟閱讀。</small>}<small>來源：<a href={map.filePage} target="_blank" rel="noopener noreferrer">Wiki 圖片頁</a> · 上傳者 {map.uploader}<br/>{map.copyright}</small></figcaption></figure>)}</div><dialog ref={dialog} className={styles.mapDialog} aria-label="放大地圖"><div className={styles.dialogBar}><strong>{selected?.alt}</strong>{selected&&<a href={selected.src} download>下載原圖</a>}<button onClick={()=>dialog.current?.close()}>關閉</button></div>{selected&&<Image src={selected.src} alt={selected.alt} width={selected.width} height={selected.height} unoptimized className={styles.largeMap}/>}</dialog></>;
}
