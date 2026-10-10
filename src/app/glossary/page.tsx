import {pageMetadata} from '@/lib/metadata';
import {TerminologyLookup} from '@/components/TerminologyLookup';
import Link from 'next/link';
import styles from '@/components/Site.module.css';

export const metadata=pageMetadata('GW1 中英名稱對照','搜尋遊戲客戶端核對的 Guild Wars 1 英文與繁體中文名稱，包含任務、NPC、地點與技能常用詞。','/glossary/');
export default function Glossary(){return <div className={styles.pageContainer}><header className={styles.pageTitle}><h1>遊戲中英名稱對照</h1><p>英文 Wiki 和繁體中文版遊戲對不上時，先查這裡。本站只列出有遊戲字串 ID 或擷取到的 Quest／NPC 證據的對照；名稱相似不代表是同一任務或角色。</p></header><TerminologyLookup/><p>需要看擷取方式與限制？<Link href="/data-sources/game-client/">閱讀遊戲文字查核說明</Link>。</p></div>;}
