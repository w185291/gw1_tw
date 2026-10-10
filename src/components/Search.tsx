'use client';
import Link from 'next/link';
import {useState} from 'react';
import {normalizeSearch,searchableText} from '@/lib/search-text';
import type {SearchEntry} from '@/data/schemas/content';
import {Badge} from './Badge';
import styles from './Guide.module.css';
export function Search({entries}:{entries:SearchEntry[]}){const [query,setQuery]=useState('');const q=normalizeSearch(query);const results=q?entries.filter(e=>searchableText([e.name.zhTW,e.name.en,e.summary,...e.aliases,...e.tags]).includes(q)):[];return <><label className={styles.globalSearch}>搜尋攻略<input autoComplete="off" type="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="例如：北方長城、Divinity Coast、Bonus"/></label><p aria-live="polite" className={styles.resultCount}>{q?`${results.length} 筆結果`:'可搜尋中英文名稱、地點、技能、攻略文字或標籤。'}</p><div className={styles.searchResults}>{results.map(e=><article key={e.href+e.id} className={styles.missionCard}><Badge>{e.kind}</Badge> <h2><Link href={e.href}>{e.name.zhTW}</Link></h2><p className={styles.englishName}>{e.name.en}</p><p>{e.summary}</p></article>)}</div>{q&&results.length===0&&<div className={styles.empty}>沒有找到「{query}」。可搜尋各章任務、主線Quest、英雄及其他內容索引，試試英文原名或較短關鍵字。</div>}</>;}
