import Link from 'next/link';
import {MainNavigation} from './MainNavigation';
import {getCampaigns} from '@/lib/content';
import styles from './Site.module.css';
export function SiteHeader(){const campaigns=getCampaigns();return <header className={styles.header}><div className={styles.headerInner}><Link className={styles.brand} href="/"><span className={styles.brandMark} aria-hidden>GW</span><span>Guild Wars 1<strong>繁體中文攻略站</strong></span></Link><div className={styles.desktopNavigation}><MainNavigation campaigns={campaigns}/></div><details className={styles.mobileNavigation}><summary aria-label="開啟網站選單"><span aria-hidden>☰</span> 選單</summary><MainNavigation campaigns={campaigns}/></details></div></header>;}
