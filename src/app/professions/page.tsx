import Link from 'next/link';
import professions from '@/data/professions.json';
import {getProfessionSkillCounts} from '@/lib/skills';
import {Portrait} from '@/components/Portrait';
import styles from '@/components/Site.module.css';
import visual from '@/components/CatalogVisual.module.css';
export const metadata={title:'十種職業介紹 · 主職業與副職業'};
export default function Professions(){const counts=getProfessionSkillCounts();return <div className={styles.pageContainer}><header className={styles.pageTitle}><h1>十種職業介紹</h1><p>選擇主職業、理解主屬性，再搭配副職業技能。</p></header><div className={styles.quickLinks}><Link href="/character-creation/">角色創建：三章起點怎麼選 →</Link><Link href="/skill-trainers/">技能導師 →</Link><Link href="/builds/">Build 搭配 →</Link></div><section><h2>主職業與副職業怎麼搭配</h2><p>主職業決定外觀、防具與可投入的主屬性。副職業提供另一組技能及一般屬性，但不能投入該職業的主屬性，也不能使用副職業符文。主職業建立角色後不能變更；副職業可在完成各章的解鎖條件後更換。</p><p>六種共通職業可在任何本篇章節建立。刺客與祭祀的 PvE 主職業須在盟與敵建立；聖言者與神喚須在黑暗逆襲建立。極地之眼不提供新職業或新角色出生點。帳號擁有對應章節後，其他出生地的角色也能在解鎖副職業轉換後選擇這些職業。</p><p><a href="https://wiki.guildwars.com/wiki/Profession">Guild Wars Wiki：Profession</a> · <a href="https://wiki.guildwars.com/wiki/Quick_access_links">全職業快速索引</a></p></section><div className={styles.campaignCards}>{professions.map(p=><article className={styles.campaignCard} key={p.id}><div className={visual.cardHead}><Portrait kind="profession" id={p.id} name={p.zhTW}/><div><h2><Link href={`/professions/${p.id}/`}>{p.zhTW}</Link></h2><p>{p.en}</p></div></div><p>{p.summary}</p><p>主屬性：{p.primaryAttribute.zhTW}</p><p>{counts[p.id]??0} 招技能</p><Link href={`/professions/${p.id}/`}>職業機制、屬性與技能</Link></article>)}</div></div>;}

