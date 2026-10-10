import {HeroCatalog} from '@/components/HeroCatalog';
import {getHeroes} from '@/lib/content';
import {pageMetadata} from '@/lib/metadata';
import styles from '@/components/Site.module.css';
export const metadata=pageMetadata('各章英雄招募','四章、Beyond 與 Reforged 英雄的招募步驟、帳號條件與互斥選擇。','/heroes/');
export default function Heroes(){return <div className={styles.pageContainer}><header className={styles.pageTitle}><h1>各章英雄招募</h1><p>31 位英雄 · 招募地點、任務順序、章節需求與破關後補招。</p><p>阿斯卡隆戰記包含 Reforged Mode 限定的德佛娜與 Ghost of Althea，以及需要黑暗逆襲的奧里亞斯。盟與敵包含刃瑪伊、Miku 與 Zei Ri；後兩位由 Winds of Change 取得。北方之眼有 10 位英雄。一般傭兵不列入英雄名單。</p></header><HeroCatalog heroes={getHeroes()}/></div>;}
