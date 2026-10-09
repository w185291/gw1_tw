'use client';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import type {Campaign} from '@/data/schemas/content';
import styles from './Site.module.css';
const others=[['beyond','Beyond'],['dungeons','地下城'],['elite-missions','菁英任務'],['zaishen','戰承任務'],['heroes','英雄']];
export function MainNavigation({campaigns}:{campaigns:Campaign[]}){const pathname=usePathname();return <nav className={styles.mainNav} aria-label="主選單"><details><summary>主線攻略</summary><div className={styles.dropdown}><Link href="/campaigns/">全部章節</Link>{campaigns.map(c=><Link key={c.id} href={`/campaigns/${c.id}/`} aria-current={pathname.startsWith(`/campaigns/${c.id}`)?'page':undefined}>{c.name.zhTW}</Link>)}</div></details><details><summary>其他攻略</summary><div className={styles.dropdown}>{others.map(([id,name])=><Link key={id} href={`/${id}/`}>{name}</Link>)}</div></details><Link href="/builds/">Build</Link><Link href="/skills/">技能</Link><Link href="/search/" aria-current={pathname.startsWith('/search')?'page':undefined}>搜尋</Link></nav>;}
