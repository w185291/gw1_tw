import {Suspense} from 'react';
import {HeroViewer} from '@/components/HeroViewer';
import site from '@/components/Site.module.css';
import styles from './HeroPage.module.css';
export const metadata={title:'英雄招募'};
export default function Page(){return <div className={site.pageContainer}><div className={styles.readingWidth}><Suspense fallback={<p role="status">正在載入英雄資料…</p>}><HeroViewer/></Suspense></div></div>;}
