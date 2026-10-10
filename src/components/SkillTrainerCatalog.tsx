'use client';
import {useState} from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {skillTrainerIndex,trainerCampaigns,trainerHref} from '@/lib/skill-trainers';
import styles from './SkillTrainers.module.css';
const normalizeSearch=(text:string)=>text.normalize('NFKC').trim().toLowerCase().replace(/[’‘]/g,"'");

export function SkillTrainerCatalog(){
  const [campaign,setCampaign]=useState('');
  const [kind,setKind]=useState('');
  const [query,setQuery]=useState('');
  const results=skillTrainerIndex.filter(item=>
    (!campaign||item.campaign===campaign)&&(!kind||item.type===kind)&&
    (!query||normalizeSearch([item.name,...item.locations.flatMap(loc=>[loc.zhTW,loc.en]),...item.regions.flatMap(loc=>[loc.zhTW,loc.en])].join(' ')).includes(normalizeSearch(query)))
  );
  return <>
    <div className={styles.filters}>
      <label>章節<select value={campaign} onChange={event=>setCampaign(event.target.value)}><option value="">全部章節</option>{trainerCampaigns.map(c=><option key={c.id} value={c.id}>{c.label}</option>)}</select></label>
      <label>導師類型<select value={kind} onChange={event=>setKind(event.target.value)}><option value="">全部類型</option><option value="skill">技能導師</option><option value="hero">英雄技能導師</option></select></label>
      <label className={styles.search}>搜尋 NPC／據點<input type="search" value={query} onChange={event=>setQuery(event.target.value)} placeholder="例如 Michiko、凱寧中心、卡瑪丹"/></label>
    </div>
    <p className={styles.count} aria-live="polite">顯示 {results.length}／{skillTrainerIndex.length} 位導師</p>
    {trainerCampaigns.map(chapter=>{
      const members=results.filter(item=>item.campaign===chapter.id);
      if(!members.length)return null;
      return <section key={chapter.id} className={styles.chapter} id={chapter.id}><h2>{chapter.label}<small>{members.length} 位</small></h2><div className={styles.grid}>{members.map(item=><Link key={item.id} href={trainerHref(item.id)} className={styles.card}>
        <span className={styles.avatar}>{item.image&&<Image src={item.image.src} alt={item.name==='Skill Trainer (NPC)'?'捕捉紋章技能圖示':`${item.name} 的 Wiki 角色圖片`} width={92} height={92} unoptimized loading="lazy"/>}</span>
        <span className={styles.cardText}><strong>{item.name}</strong><small>{item.type==='hero'?'英雄技能導師':'技能導師'}</small><span>{item.locations.map(loc=>loc.zhTW===loc.en?loc.en:`${loc.zhTW} · ${loc.en}`).join('、')}</span></span>
      </Link>)}</div></section>;
    })}
    {!results.length&&<p className={styles.empty}>找不到符合條件的導師。可以改用英文 NPC 名稱或據點名稱搜尋。</p>}
  </>;
}
