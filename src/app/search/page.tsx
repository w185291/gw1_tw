import {getSearchEntries} from '@/lib/content';
import {Search} from '@/components/Search';
import {pageMetadata} from '@/lib/metadata';
import styles from '@/components/Site.module.css';
export const metadata={...pageMetadata('搜尋攻略','依繁體中文、英文、別名或標籤搜尋 GW1 任務攻略。','/search/'),robots:{index:false,follow:true}};
export default function SearchPage(){return <div className={styles.pageContainer}><header className={styles.pageTitle}><p className={styles.eyebrow}>FIND YOUR NEXT STEP</p><h1>搜尋攻略</h1><p>查詢中文、英文名稱、別名或標籤。</p></header><Search entries={getSearchEntries()}/></div>;}
