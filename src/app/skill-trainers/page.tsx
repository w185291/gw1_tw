import Link from 'next/link';
import {SkillTrainerCatalog} from '@/components/SkillTrainerCatalog';
import styles from '@/components/SkillTrainers.module.css';
import site from '@/components/Site.module.css';
import {pageMetadata} from '@/lib/metadata';

export const metadata=pageMetadata('技能導師｜章節、NPC 與所在據點','查詢 Guild Wars 1 四個章節的技能導師與英雄技能導師，並查看每位導師的 Wiki 圖片、所在地與可學技能。','/skill-trainers/');
export default function Page(){return <div className={site.pageContainer}><header className={site.pageTitle}><h1>技能導師</h1><p>依章節找 NPC、所在據點與可學技能；點進導師即可連到本站技能詳細資料。</p></header><div className={styles.intro}><div><h2>技能導師是什麼？</h2><p>據點中名字後帶有 [Skills] 的 NPC，可以讓 PvE 角色花技能點與金幣學新技能。多數導師有自己的固定清單；帳號已解鎖的同章節及共通非菁英技能也可能顯示。先選好主／副職業，再查你要的技能在哪位導師手上。</p><p>每招需要 1 技能點，金幣從 50 逐步升至 1,000。菁英技能要用捕捉紋章向 Boss 學習；PvE 專用技能則看各自取得條件。災變前阿斯卡隆的 Halbrik 有等級與技能清單限制。</p></div><div><h2>英雄技能導師</h2><p>黑暗逆襲與極地之眼另有 [Hero Skills] NPC。每次花 1 英雄技能點、不收金幣，可解鎖技能；沒有英雄技能點時，對方不會顯示可學清單。</p><p><Link href="/skills/">前往技能資料庫 →</Link></p></div></div><SkillTrainerCatalog/><p className={styles.sources}>資料依據 <a href="https://wiki.guildwars.com/wiki/Skill_trainer">Guild Wars Wiki 技能導師總覽</a>、四章名錄與各 NPC 頁；有確認的繁中地名使用本站遊戲字串對照，未核實的專名保留英文。</p></div>}
