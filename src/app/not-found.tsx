import Link from 'next/link';
import styles from '@/components/Site.module.css';
export default function NotFound(){return <div className={styles.pageContainer}><header className={styles.pageTitle}><h1>找不到這份攻略</h1><p>請回章節列表，或用中英文名稱搜尋。</p><Link href="/campaigns/">檢視章節列表</Link> · <Link href="/search/">搜尋攻略</Link></header></div>;}
