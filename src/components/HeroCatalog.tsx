'use client';
import {useState} from 'react';
import Link from 'next/link';
import type {Hero} from '@/data/schemas/content';
import {LocalizedText} from './LocalizedText';
import {Portrait} from './Portrait';
import {normalizeSearch,searchableText} from '@/lib/search-text';
import styles from './Site.module.css';
import visual from './CatalogVisual.module.css';
const chapters={prophecies:'阿斯卡隆戰記',factions:'盟與敵',nightfall:'黑暗逆襲','eye-of-the-north':'北方之眼',beyond:'Beyond 後續故事',core:'三章共通'};
export function HeroCatalog({heroes}:{heroes:Hero[]}){
 const [campaign,setCampaign]=useState(''),[query,setQuery]=useState('');
 const results=heroes.filter(h=>(!campaign||h.campaign===campaign)&&searchableText([h.name.en,h.name.zhTW,h.profession,...h.native,...h.foreign]).includes(normalizeSearch(query)));
 return <><p><label>章節 <select aria-label="英雄章節" value={campaign} onChange={e=>setCampaign(e.target.value)}><option value="">全部章節</option>{Object.entries(chapters).map(([id,label])=><option key={id} value={id}>{label}</option>)}</select></label>{' '}<label>搜尋英雄 <input type="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="中文、English、職業、招募任務"/></label>{' '}<button onClick={()=>{setCampaign('');setQuery('');}}>重設篩選</button></p><p aria-live="polite">顯示 {results.length} / {heroes.length} 位英雄</p><div className={styles.campaignCards}>{results.map(h=><Link className={styles.campaignCard} key={h.id} href={`/heroes/view/?id=${h.id}`}><div className={visual.cardHead}><Portrait kind="hero" id={h.id} name={h.name.zhTW} profession={h.profession}/><div><h2>{h.name.zhTW}</h2><p>{h.name.en} · {h.profession}</p></div></div><p>{chapters[h.campaign]}</p><p><LocalizedText text={h.summary}/></p><span className={styles.cardLink}>招募步驟與條件</span></Link>)}</div>{!results.length&&<p>沒有符合條件的英雄。</p>}</>;
}
