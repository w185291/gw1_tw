'use client';
import Link from 'next/link';
import {useState} from 'react';
import type {SearchEntry} from '@/data/schemas/content';
import {Badge} from './Badge';
import styles from './Guide.module.css';
export function Search({entries}:{entries:SearchEntry[]}){const [query,setQuery]=useState('');const q=query.trim().toLowerCase();const results=q?entries.filter(e=>[e.name.zhTW,e.name.en,...e.aliases,...e.tags].join(' ').toLowerCase().includes(q)):[];return <><label className={styles.globalSearch}>搜尋攻略<input autoComplete="off" type="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="例如：北方長城、Divinity Coast、Bonus"/></label><p aria-live="polite" className={styles.resultCount}>{q?`${results.length} 筆結果`:'輸入中文、英文名稱、別名或標籤。'}</p><div className={styles.searchResults}>{results.map(e=><article key={e.id} className={styles.missionCard}><Badge tone={e.status==='complete'?'gold':'neutral'}>{e.status==='complete'?'完整攻略':'待整理'}</Badge><h2><Link href={e.href}>{e.name.zhTW}</Link></h2><p className={styles.englishName}>{e.name.en}</p><p>{e.summary}</p></article>)}</div>{q&&results.length===0&&<div className={styles.empty}>沒有找到「{query}」。第一階段目前收錄 Prophecies 25 關索引；英雄與其他章節尚待整理。</div>}</>;}
