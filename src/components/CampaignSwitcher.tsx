'use client';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import type {Campaign} from '@/data/schemas/content';
import styles from './Site.module.css';
export function CampaignSwitcher({campaigns}:{campaigns:Campaign[]}){const path=usePathname();return <nav className={styles.campaignSwitcher} aria-label="章節切換">{campaigns.map(c=><Link key={c.id} href={`/campaigns/${c.id}/`} aria-current={path.startsWith(`/campaigns/${c.id}/`)?'page':undefined}>{c.name.zhTW}</Link>)}</nav>;}
