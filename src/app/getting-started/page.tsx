import Link from 'next/link';
import {pageMetadata} from '@/lib/metadata';
import styles from '@/components/Site.module.css';

export const metadata = pageMetadata(
  'GW1 第一次玩：購買、選章節與第一個角色',
  'Guild Wars 1 新手開始路線：先確認帳號與購買內容，再選阿斯卡隆戰記、盟與敵或黑暗逆襲，學會八格技能並取得英雄。',
  '/getting-started/',
);

export default function GettingStarted() {
  return <div className={styles.pageContainer}>
    <header className={styles.pageTitle}><p className={styles.eyebrow}>新玩家路線</p><h1>第一次玩，從這裡開始</h1><p>先解決購買與帳號，再選一個適合自己的出生戰役。三個選擇都能進入主線；之後可讓同一角色跨章冒險。</p></header>
    <section className={styles.homeSection}><h2>1. 確認購買與帳號</h2><p>新購買的 Reforged 包含三大戰役、沒有月費；極地之眼另購。舊 email 帳號與新 Steam 帳號的附加內容有不同歸屬，回鍋玩家請先讀官方說明。</p><div className={styles.quickLinks}><a href="https://store.guildwars.com/">官方商店</a><a href="https://store.steampowered.com/app/29720/">Steam</a><a href="https://help.guildwars.com/hc/en-us/articles/360001507828-Guild-Wars-Reforged-on-Steam">官方帳號與 DLC 說明</a></div></section>
    <section className={styles.homeSection}><h2>2. 選第一個出生戰役</h2><div className={styles.campaignCards}><Link href="/campaigns/prophecies/" className={styles.campaignCard}><h3>阿斯卡隆戰記</h3><p>適合想照泰瑞亞故事慢慢體驗、探索經典起點。</p></Link><Link href="/campaigns/factions/" className={styles.campaignCard}><h3>盟與敵</h3><p>適合想較快進入正式技能搭配與凱珊冒險。</p></Link><Link href="/campaigns/nightfall/" className={styles.campaignCard}><h3>黑暗逆襲</h3><p>適合想較早取得可自訂的英雄隊。</p></Link></div></section>
    <section className={styles.homeSection}><h2>3. 學會八格技能與隊伍</h2><p>每次出城前在據點檢查技能列、屬性和隊友。打不過時觀察缺的是輸出、打斷、防護還是解狀態，再回城調整。</p><div className={styles.quickLinks}><Link href="/professions/">認識職業</Link><Link href="/skills/">搜尋技能</Link><Link href="/heroes/">英雄取得</Link></div></section>
    <section className={styles.homeSection}><h2>4. 開始第一段主線</h2><p>照任務攻略確認「怎麼到這關、怎麼走、Bonus／Master 怎麼做、打完去哪」。進入極地之眼之前，先確認帳號已購買該擴充內容。</p><div className={styles.quickLinks}><Link href="/campaigns/">所有章節</Link><Link href="/what-is-guild-wars/">完整了解 GW1</Link></div></section>
  </div>;
}
