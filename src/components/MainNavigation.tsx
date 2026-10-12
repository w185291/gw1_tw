'use client';
import Link from 'next/link';
import {useEffect,useId,useRef} from 'react';
import {usePathname} from 'next/navigation';
import type {Campaign} from '@/data/schemas/content';
import styles from './Site.module.css';

const otherGuides=[['beyond','Beyond 後續故事'],['dungeons','地下城'],['elite-missions','菁英任務'],['challenge-missions','挑戰與競技任務'],['zaishen','承戰任務・速查'],['heroes','英雄取得']];
const activities=[['pve','PvE 冒險'],['postgame','破關後目標'],['pvp','PvP 競技'],['equipment','裝備與收藏']];

export function MainNavigation({campaigns}:{campaigns:Campaign[]}){
 const pathname=usePathname();
 const group=useId();
 const navRef=useRef<HTMLElement>(null);
 useEffect(()=>{
  const close=()=>{
   navRef.current?.querySelectorAll('details[open]').forEach(details=>{(details as HTMLDetailsElement).open=false;});
   const mobile=navRef.current?.closest('details');
   if(mobile)mobile.open=false;
  };
  const pointerDown=(event:PointerEvent)=>{
   const target=event.target as Node;
   if(navRef.current?.contains(target)||navRef.current?.closest('details')?.contains(target))return;
   close();
  };
  const keyDown=(event:KeyboardEvent)=>{if(event.key==='Escape')close();};
  document.addEventListener('pointerdown',pointerDown);
  document.addEventListener('keydown',keyDown);
  return ()=>{document.removeEventListener('pointerdown',pointerDown);document.removeEventListener('keydown',keyDown);};
 },[]);
 useEffect(()=>{
  navRef.current?.querySelectorAll('details[open]').forEach(details=>{(details as HTMLDetailsElement).open=false;});
  const mobile=navRef.current?.closest('details');
  if(mobile)mobile.open=false;
 },[pathname]);
 return <nav ref={navRef} className={styles.mainNav} aria-label="主選單" onClick={event=>{
  if(!(event.target instanceof Element) || !event.target.closest('a'))return;
  navRef.current?.querySelectorAll('details[open]').forEach(details=>{(details as HTMLDetailsElement).open=false;});
  const mobile=navRef.current?.closest('details');
  if(mobile)mobile.open=false;
 }}>
  <details name={group}><summary>遊戲介紹</summary><div className={styles.dropdown}><Link href="/">首頁</Link><Link href="/what-is-guild-wars/">認識 GW1</Link><Link href="/getting-started/">新手入門</Link><Link href="/glossary/">遊戲中英名稱對照</Link></div></details>
  <details name={group}><summary>主線攻略</summary><div className={styles.dropdown}><Link href="/campaigns/">全部章節</Link>{campaigns.map(c=><Link key={c.id} href={`/campaigns/${c.id}/`} aria-current={pathname.startsWith(`/campaigns/${c.id}`)?'page':undefined}>{c.name.zhTW}</Link>)}</div></details>
  <details name={group}><summary>角色資料</summary><div className={styles.dropdown}><Link href="/character-creation/">角色創建</Link><Link href="/professions/">職業介紹</Link><Link href="/skills/">技能資料庫</Link><Link href="/skill-trainers/">技能導師</Link><Link href="/builds/">Build 搭配</Link></div></details>
  <details name={group}><summary>其他攻略</summary><div className={styles.dropdown}>{otherGuides.map(([id,label])=><Link key={id} href={`/${id}/`} aria-current={pathname.startsWith(`/${id}/`)?'page':undefined}>{label}</Link>)}</div></details>
  <details name={group}><summary>玩法與目標</summary><div className={styles.dropdown}>{activities.map(([id,label])=><Link key={id} href={`/${id}/`} aria-current={pathname.startsWith(`/${id}/`)?'page':undefined}>{label}</Link>)}</div></details>
  <Link href="/hall-of-monuments/" aria-current={pathname.startsWith('/hall-of-monuments/')?'page':undefined}>史蹟殿堂</Link>
  <a href="https://gwrevival.com/map/?c=0&x=1200&y=1145&z=4" target="_blank" rel="noopener noreferrer">互動地圖 ↗</a>
  <Link href="/search/" aria-current={pathname.startsWith('/search')?'page':undefined}>搜尋</Link>
 </nav>;
}
