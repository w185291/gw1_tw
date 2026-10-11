import Link from 'next/link';
import {TranslationReportForm} from '@/components/TranslationReportForm';
import {pageMetadata} from '@/lib/metadata';
import styles from '@/components/Site.module.css';

export const metadata=pageMetadata('繁中／英文名稱回報','回報 Guild Wars 1 NPC、任務、技能與地點的繁體中文和英文名稱對照。','/translation-report/');
export default function Page(){return <div className={styles.pageContainer}><header className={styles.pageTitle}><p className={styles.eyebrow}>COMMUNITY TRANSLATION</p><h1>繁中／英文名稱回報</h1><p>找到遊戲內的正確繁中名稱，卻看到本站仍用英文或翻錯了嗎？請提供一組繁中與英文名稱。我們會保留原始回報，核對後再修正資料。</p></header><TranslationReportForm/><p><Link href="/skill-trainers/view/?id=meinrad">示例：米恩拉德（Meinrad）的技能導師頁</Link></p></div>;}
