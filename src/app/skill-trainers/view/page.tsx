import {Suspense} from 'react';
import {SkillTrainerViewer} from '@/components/SkillTrainerViewer';
import site from '@/components/Site.module.css';
import styles from '@/components/SkillTrainers.module.css';
export const metadata={title:'技能導師詳細資料'};
export default function Page(){return <div className={site.pageContainer}><div className={styles.reading}><Suspense fallback={<p role="status">正在載入導師資料…</p>}><SkillTrainerViewer/></Suspense></div></div>}
