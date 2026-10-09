import {CampaignSwitcher} from '@/components/CampaignSwitcher';
import {getCampaigns} from '@/lib/content';
import styles from '@/components/Site.module.css';
export default function CampaignLayout({children}:{children:React.ReactNode}){return <div className={styles.pageContainer}><CampaignSwitcher campaigns={getCampaigns()}/>{children}</div>;}
