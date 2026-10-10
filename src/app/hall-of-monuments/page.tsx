import Image from 'next/image';
import Link from 'next/link';
import {pageMetadata} from '@/lib/metadata';
import styles from '@/components/Site.module.css';
import pageStyles from './Hall.module.css';

export const metadata=pageMetadata('史蹟殿堂｜收集、五座紀念碑與 GW2 獎勵','認識 Guild Wars 1 極地之眼史蹟殿堂：五座紀念碑收集什麼、怎麼開始，以及官方獎勵計算器。','/hall-of-monuments/');

const monuments=[
 {number:'01',title:'稱號與成就',en:'Honor',collect:'戰役完成、特殊任務、PvP 稱號等符合條件的紀念像。',begin:'一進殿堂就能使用；到達各稱號或成就門檻後，與紀念碑互動。',wiki:'https://wiki.guildwars.com/wiki/Honor'},
 {number:'02',title:'迷你寵物',en:'Devotion',collect:'一般、稀有與特殊迷你寵物都能為收藏進度帶來不同紀錄。',begin:'帶尚未奉獻的迷你寵物到碑前登錄；已登錄的同一隻不能再重複登錄。',wiki:'https://wiki.guildwars.com/wiki/Devotion'},
 {number:'03',title:'英雄與動物夥伴',en:'Fellowship',collect:'升級防具的英雄，以及符合條件的動物夥伴；M.O.X. 有例外規則。',begin:'先把英雄加入隊伍並替他取得可登錄的升級防具，再到碑前登錄。',wiki:'https://wiki.guildwars.com/wiki/Fellowship'},
 {number:'04',title:'菁英防具',en:'Resilience',collect:'符合條件的菁英防具套裝。需要身體、手、腿和腳部，頭部不列入套裝要求。',begin:'穿上完整可登錄套裝後與碑互動；普通護甲或零散部位不算一套。',wiki:'https://wiki.guildwars.com/wiki/Resilience'},
 {number:'05',title:'特殊武器',en:'Valor',collect:'特定系列武器：Destroyer、Oppressor’s、Tormented。不是所有金色武器都能登錄。',begin:'攜帶符合系列的武器登錄；留意客製化與角色持有規則。',wiki:'https://wiki.guildwars.com/wiki/Valor'},
];

export default function HallOfMonuments(){return <div className={styles.pageContainer}>
 <header className={pageStyles.hero}><div><p className={styles.eyebrow}>極地之眼 · 長期收藏</p><h1>史蹟殿堂</h1><p className={pageStyles.english}>Hall of Monuments</p><p>把你在《激戰 1》完成的冒險、養成的英雄和收藏的裝備，真正擺進殿堂裡。它既是遊戲內的成就展示空間，也能讓符合條件的 GW1 帳號取得 Guild Wars 2 的獨特獎勵。</p><div className={pageStyles.actions}><a href="https://hom.guildwars2.com/en/">官方獎勵計算器 ↗</a><a href="https://hom.guildwars2.com/en/faq/">官方 FAQ ↗</a></div></div><figure><Image src="/images/hall-of-monuments/hall.jpg" width={1024} height={768} alt="《激戰 1》史蹟殿堂內部實景" priority/><figcaption>史蹟殿堂實景圖：Guild Wars Wiki，遊戲畫面 © ArenaNet／NCsoft。<a href="https://wiki.guildwars.com/wiki/File:Hall_of_Monuments.jpg">圖片來源</a></figcaption></figure></header>
 <section className={pageStyles.explain}><h2>怎麼進入？</h2><p>帳號需要《極地之眼》。角色達到 10 級後，依出生戰役在獅子拱門、凱寧中心或卡瑪丹接進入極地之眼的任務；抵達極地之眼據點，就能進史蹟殿堂。主碑「榮譽」一開始可用，其他四座要在極地之眼主線中取得紀念掛毯後，選擇逐座開放。</p><p>這不是把道具放進倉庫就自動計分：先在遊戲裡和對應的紀念碑互動登錄。想看帳號中多個角色合計的展示，可找殿堂入口的 Kimmes the Historian 切換為帳號檢視。</p></section>
 <section className={pageStyles.collection}><h2>五座紀念碑能收集什麼？</h2><p>以下中文是收藏類型說明，碑的英文原名保留供遊戲與 Wiki 對照。</p><div className={pageStyles.cards}>{monuments.map(m=><article key={m.en}><span>{m.number}</span><h3>{m.title}<small>{m.en}</small></h3><p>{m.collect}</p><p><strong>第一步：</strong>{m.begin}</p><a href={m.wiki}>查閱 Wiki 條件 ↗</a></article>)}</div></section>
 <section className={pageStyles.rewards}><div><h2>為什麼要收集？</h2><p>官方計算器最多顯示 50 點。前 30 點可逐步解鎖 GW2 的外觀、武器、迷你寵物或動物夥伴獎勵；之後的點數主要延伸獨特稱號。GW1 的 GWAMM 稱號有另外的延續規則，別把它和殿堂計算器點數混為一談。</p><p>計算器輸入一位 GW1 角色名稱，就能看帳號的累積進度與尚未取得項目。若剛登錄的東西沒出現，先登出 GW1 再刷新查詢。</p><div className={pageStyles.actions}><a href="https://hom.guildwars2.com/en/">輸入角色名，查我的進度 ↗</a><Link href="/postgame/">看破關後目標 →</Link></div></div><ol><li><strong>先進殿堂</strong><span>極地之眼據點進入。</span></li><li><strong>解鎖四座側碑</strong><span>用主線取得的紀念掛毯。</span></li><li><strong>親自登錄成果</strong><span>按收藏種類找對紀念碑。</span></li><li><strong>查官方計算器</strong><span>登出遊戲後確認進度。</span></li></ol></section>
 <section className={pageStyles.sources}><h2>查核來源</h2><ul><li><a href="https://hom.guildwars2.com/en/">ArenaNet 史蹟殿堂獎勵計算器</a></li><li><a href="https://hom.guildwars2.com/en/faq/">ArenaNet 官方 FAQ：入口、紀念碑與帳號查詢</a></li><li><a href="https://wiki.guildwars.com/wiki/Hall_of_Monuments">Guild Wars Wiki：Hall of Monuments</a></li><li><a href="https://wiki.guildwars.com/wiki/Guide_to_earning_Hall_of_Monuments_rewards">Guild Wars Wiki：收集路線說明</a></li></ul></section>
 </div>;}
