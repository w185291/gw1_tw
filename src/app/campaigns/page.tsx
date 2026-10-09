import Link from 'next/link';
import {getCampaigns} from '@/lib/content';
import {CampaignSwitcher} from '@/components/CampaignSwitcher';
import {pageMetadata} from '@/lib/metadata';
import styles from '@/components/Site.module.css';
export const metadata=pageMetadata('主線攻略・章節索引','選擇 Prophecies、Factions、Nightfall 或北方之眼的主線與任務攻略。','/campaigns/');
export default function Campaigns(){const campaigns=getCampaigns();return <div className={styles.pageContainer}><CampaignSwitcher campaigns={campaigns}/><header className={styles.pageTitle}><p className={styles.eyebrow}>CAMPAIGNS</p><h1>主線攻略</h1><p>選擇章節，檢視任務順序、分支與詳細攻略。</p></header><div className={styles.campaignCards}>{campaigns.map(c=><Link key={c.id} href={`/campaigns/${c.id}/`} className={styles.campaignCard}><h2>{c.name.zhTW}</h2><p className={styles.cardEnglish}>{c.name.en}</p><p>{c.description}</p><span className={styles.cardLink}>{c.status==='available'?'檢視任務流程':'檢視章節架構'}</span></Link>)}</div></div>;}
