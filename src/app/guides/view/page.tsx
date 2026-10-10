import {Suspense} from 'react';
import {GuideViewer} from '@/components/GuideViewer';
import styles from '@/components/Site.module.css';
export const metadata={title:'其他攻略'};
export default function Page(){return <div className={styles.pageContainer}><Suspense fallback={<p role="status">正在載入攻略…</p>}><GuideViewer/></Suspense></div>;}
