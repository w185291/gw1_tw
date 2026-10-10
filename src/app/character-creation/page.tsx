import Link from 'next/link';
import {pageMetadata} from '@/lib/metadata';
import styles from '@/components/Site.module.css';
import guide from './CharacterCreation.module.css';

export const metadata=pageMetadata('角色創建｜出生戰役與主職業','比較三大戰役的角色起點、職業選擇及 PvE／PvP 角色差異。','/character-creation/');

const campaigns=[
 {name:'阿斯卡隆戰記',en:'Prophecies',start:'災變前阿斯卡隆',pace:'節奏較慢，隊伍與敵人難度逐步增加，前半段任務提供不少免費技能。',jobs:'六種共通職業',link:'/campaigns/prophecies/'},
 {name:'盟與敵',en:'Factions',start:'凱珊的星岬島',pace:'升級很快；離開新手島後難度提升明顯，多數技能要自行購買。',jobs:'六種共通職業，加上刺客、祭祀',link:'/campaigns/factions/'},
 {name:'黑暗逆襲',en:'Nightfall',start:'伊洛那的伊斯坦',pace:'升級速度介於前兩章之間，較早取得可配置技能的英雄隊友。',jobs:'六種共通職業，加上聖言者、神喚',link:'/campaigns/nightfall/'},
];

export default function CharacterCreation(){return <article className={`${styles.pageContainer} ${guide.page}`}>
 <nav className={guide.breadcrumb}><Link href="/professions/">職業介紹</Link> / 角色創建</nav>
 <header className={styles.pageTitle}><p className={styles.eyebrow}>建立第一位角色前</p><h1>角色創建：出生戰役怎麼選？</h1><p>依 Guild Wars Wiki 的創角流程，先選劇情或 PvP 角色，再選出生戰役、主職業、性別、外觀、身形與名字。出生戰役決定故事起點和初始外觀；三大戰役在同一帳號下可以跨章遊玩。</p></header>
 <section className={guide.intro}><div><h2>劇情角色（PvE）</h2><p>從等級 1 與基本裝備開始，透過任務、合作關卡與探索升級。往後可進入帳號已擁有的其他戰役，也能參加 PvP。</p></div><div><h2>PvP 專用角色</h2><p>從等級 20 開始，可使用 PvP 裝備面板及帳號已解鎖的技能。出生在巴薩澤聖殿，不能走一般戰役劇情或進入 PvE 區域。</p></div></section>
 <section><h2>三個出生章節</h2><div className={guide.cards}>{campaigns.map(c=><article key={c.en} className={guide.card}><span>{c.en}</span><h3>{c.name}</h3><dl><dt>起點</dt><dd>{c.start}</dd><dt>可選主職業</dt><dd>{c.jobs}</dd><dt>節奏</dt><dd>{c.pace}</dd></dl><Link href={c.link}>查看章節攻略 →</Link></article>)}</div><p className={guide.note}>極地之眼是資料片，沒有獨立的角色創建起點。第一章出生角色會先經過<Link href="/campaigns/prophecies/pre-searing/">災變前阿斯卡隆教學主線</Link>；盟與敵的新手島進度較快；黑暗逆襲較早讓你使用英雄。</p></section>
 <section className={guide.section}><h2>哪些決定不能輕易更改？</h2><ol><li><strong>主職業：</strong>決定裝甲、外觀與主屬性；建立後不能更換。六種共通職業三章都可選。刺客、祭祀須從盟與敵建立為 PvE 主職業；聖言者、神喚須從黑暗逆襲建立。<Link href="/professions/">比較十種職業</Link></li><li><strong>副職業：</strong>在遊戲進程中取得，解鎖轉換後可以更換；副職業不能取得其主屬性。</li><li><strong>外觀與名字：</strong>出生章節影響初始外觀選項，性別不影響主要戰鬥能力。建立後修改外觀或名字通常需要官方付費服務。</li><li><strong>可選限制模式：</strong>創角畫面若提供額外遊戲模式，先看清規則；第一次遊玩可選一般模式。</li></ol></section>
 <section className={guide.section}><h2>外觀、身形與名字</h2><p>選性別後可選臉型、髮型、髮色和膚色；可選組合依出生章節、主職業與性別而異。接著可調身高，並為起始防具部位選色。這些不改變職業能力，起始防具顏色也不會自動套到往後取得的防具。</p><p>若使用台灣地區的繁中角色名：中文加拉丁字母的名稱最多 16 字元，至少一個繁中文字，不可有空格或數字；每個中文字計兩個字元。全拉丁字母的名稱遵照另一組長度規則。確定名字前請在遊戲內檢查，建立後改名需官方更名服務。</p><p>建立後若想改外觀，Wiki 指向巴薩澤聖殿的 Anatomical Engineer Llye 與官方 Makeover Credit；某些災變前角色也可找 Gilderoy Le Fleur。建立時只能選出生章節提供的外觀，改造服務可能提供其他章節選項。</p></section>
 <section className={guide.section}><h2>可選遊戲模式與建立完成</h2><p>目前創角流程可能顯示額外限制模式，例如 Dhuum’s Covenant、Melandru’s Accord 與 Reforged Mode。這些模式會改動死亡、交易或內容體驗等規則；第一次遊玩建議先詳讀遊戲內說明再決定。Wiki 指出符合條件時，建立後可到 Shrine to Godly Accoutrements 管理模式。</p><p>確認名字與選項後會播放所選戰役的開場動畫，接著進入該章新手區。第一章可從<Link href="/campaigns/prophecies/pre-searing/">災變前阿斯卡隆攻略</Link>開始。</p></section>
 <section className={guide.section}><h2>建立後可以跨章嗎？</h2><p>可以，不必先完成出生戰役。阿斯卡隆戰記角色抵達獅子拱門、盟與敵角色抵達凱寧中心、黑暗逆襲角色抵達領事館碼頭後，可以透過跨章任務前往帳號已擁有的其他戰役。外來角色進入另一章的起始點與原生角色不同。</p><p>想循序學技能可選阿斯卡隆戰記；想快速升級可選盟與敵；想早些帶英雄可選黑暗逆襲。優先考慮想玩的主職業與故事。</p><div className={guide.links}><Link href="/heroes/">英雄取得 →</Link><Link href="/skills/">技能資料庫 →</Link><Link href="/builds/">Build 與技能範本 →</Link></div></section>
 <footer className={guide.source}><h2>資料來源</h2><p>根據 <a href="https://wiki.guildwars.com/wiki/Guide_to_character_creation">Guild Wars Wiki 角色創建指南</a> 重新整理為繁體中文選角說明。</p></footer>
 </article>}
