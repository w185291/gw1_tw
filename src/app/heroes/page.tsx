import Link from 'next/link';
import {getHeroes} from '@/lib/content';
import {pageMetadata} from '@/lib/metadata';
import styles from '@/components/Site.module.css';
export const metadata=pageMetadata('第三章英雄招募','十三位英雄的招募流程、互斥選擇與破關後補招。','/heroes/');
export default function Heroes(){return <div className={styles.pageContainer}><header className={styles.pageTitle}><h1>第三章英雄招募</h1><p>13 位英雄 · 必要英雄、互斥選擇與破關後補招。採中文社群譯名並保留英文；台版正式名稱待核。</p></header><div className={styles.campaignCards}>{getHeroes().map(h=><Link className={styles.campaignCard} key={h.id} href={`/heroes/${h.id}/`}><h2>{h.name.zhTW}</h2><p>{h.name.en}</p><p>{h.profession}</p><p>{h.choiceGroup??'主線／獨立招募'}</p><span className={styles.cardLink}>如何取得</span></Link>)}</div></div>;}
