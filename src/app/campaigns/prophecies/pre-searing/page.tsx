import Link from 'next/link';
import {pageMetadata} from '@/lib/metadata';
import styles from '@/components/Site.module.css';
import guide from './PreSearing.module.css';

export const metadata=pageMetadata('災變前阿斯卡隆｜第一章新角色主線攻略','從阿斯卡隆城、六職業測驗、副職業選擇到阿斯卡隆學院的逐步路線。','/campaigns/prophecies/pre-searing/');

const quests=[
 {title:'朋友的訊息',en:'Message from a Friend',kind:'可選引導',npc:'Town Crier',where:'阿斯卡隆城',steps:'從報信人所在處往北，過石橋後在學院入口前的高台找 Sir Tydus。這一步讓你找到後續主線 NPC。',wiki:'Message_from_a_Friend'},
 {title:'備戰',en:'War Preparations',kind:'可選引導',npc:'Sir Tydus',where:'阿斯卡隆城',steps:'由城的西南門進入 Lakeside County；職業導師就在門外，和他交談並接下自己主職業的測驗。若先完成職業測驗，這個引導任務會消失。',wiki:'War_Preparations'},
 {title:'主職業測驗',en:'Profession Test',kind:'職業分支',npc:'門外對應職業導師',where:'Lakeside County',steps:'只做自己主職業的那一項。依下方六職業表走到標記處完成要求，回導師領技能與獎勵。',wiki:'Profession_Test'},
 {title:'繼續冒險',en:'Further Adventures',kind:'可選引導',npc:'Haversdan',where:'Lakeside County',steps:'完成主職業測驗後找 Haversdan；從阿斯卡隆城沿西南道路走，經 Ashford Abbey 附近再往南找 Devona。',wiki:'Further_Adventures'},
 {title:'不安的傳聞',en:'Unsettling Rumors',kind:'可選引導',npc:'Devona',where:'Ashford 附近',steps:'從 Devona 西北方入口進 Ashford Abbey，找 Meerak the Scribe。讀完訊息按 M 開地圖，傳送回阿斯卡隆城，交給 Armin Saberlin。',wiki:'Unsettling_Rumors'},
 {title:'第二職業',en:'A Second Profession',kind:'離開前必做',npc:'Armin Saberlin',where:'阿斯卡隆城',steps:'完成主職業測驗即可找 Armin 接任務；選下方其中一位副職業導師，完成他的入門任務並正式選定副職業，再回 Armin 領獎。',wiki:'A_Second_Profession'},
 {title:'光榮之路',en:'The Path to Glory',kind:'出發前確認',npc:'Armin Saberlin',where:'阿斯卡隆城',steps:'Armin 附近的 Sir Tydus 就是交付對象。領這項任務的獎勵本身不會讓你離開；準備好後再接受 Sir Tydus 的學院任務。',wiki:'The_Path_to_Glory'},
 {title:'阿斯卡隆學院',en:'Ascalon Academy',kind:'不可逆轉折',npc:'Sir Tydus',where:'阿斯卡隆城／學院',steps:'進入學院後可能先有一場 PvP；沒有其他玩家時會跳過。聽簡報後跟 Prince Rurik 進洞穴，清掉沿路 Grawl，最後擊敗 Vatlaaw Doomtooth。完成後進入災變後阿斯卡隆。',wiki:'Ascalon_Academy'},
];
const tests=[
 {job:'戰士',en:'Warrior Test',npc:'Van the Warrior',walk:'依任務標記找並擊敗附近三隻 Skale，回 Van 交任務。'},
 {job:'遊俠',en:'Ranger Test',npc:'Artemis the Ranger',walk:'往南到河邊，過河找到 River Skale Queen，擊敗後回 Artemis。'},
 {job:'僧侶',en:'Monk Test',npc:'Ciglo the Monk',walk:'過南側的河找到 Gwen，清掉她附近三隻 River Skale Tad，再領她回 Ciglo。'},
 {job:'死靈法師',en:'Necromancer Test',npc:'Verata the Necromancer',walk:'往南沿路到河邊擊敗一隻 Skale，等 Verata 從屍體召出 Bone Horror，再回報。'},
 {job:'幻術師',en:'Mesmer Test',npc:'Sebedoh the Mesmer',walk:'沿西南道路找到 Skale 群，擊敗靠近城的其中一隻，使其餘敵人逃向河邊。'},
 {job:'元素使',en:'Elementalist Test',npc:'Howland the Elementalist',walk:'往西南沿路或河邊擊敗 Skale，拿 Shimmering Scale 回去交給 Howland。'},
];
const secondaries=[
 {job:'戰士',npc:'Warmaster Grast',path:'阿斯卡隆城往西北，過劇場到 Green Hills County；完成 Grawl Invasion。',quest:'Grawl_Invasion'},
 {job:'遊俠',npc:'Master Ranger Nente',path:'Ashford Abbey 往東南過橋進 Regent Valley；完成 The Ranger’s Companion。',quest:'The_Ranger%27s_Companion'},
 {job:'僧侶',npc:'Brother Mhenlo',path:'在 Ashford Abbey；完成 A Monk’s Mission。',quest:'A_Monk%27s_Mission'},
 {job:'死靈法師',npc:'Necromancer Munne',path:'從 Ashford Abbey 西側進 Catacombs；完成 The Necromancer’s Novice。',quest:'The_Necromancer%27s_Novice'},
 {job:'幻術師',npc:'Lady Althea',path:'阿斯卡隆城往西北，到劇場；完成 A Mesmer’s Burden。',quest:'A_Mesmer%27s_Burden'},
 {job:'元素使',npc:'Elementalist Aziure',path:'從 Ashford Abbey 向東，再往西南到 Wizard’s Folly 塔樓；完成 The Elementalist Experiment。',quest:'The_Elementalist_Experiment'},
];
const wiki=(slug:string)=>`https://wiki.guildwars.com/wiki/${slug}`;

export default function PreSearing(){return <article className={`${styles.pageContainer} ${guide.page}`}>
 <nav className={guide.breadcrumb}><Link href="/campaigns/">主線攻略</Link> / <Link href="/campaigns/prophecies/">阿斯卡隆戰記</Link> / 災變前阿斯卡隆</nav>
 <header className={styles.pageTitle}><p className={styles.eyebrow}>PROPHECIES · 新角色起點</p><h1>災變前阿斯卡隆主線攻略</h1><p>第一章出生角色從和平時期的阿斯卡隆開始。這段先教你主職業、技能、副職業與地圖傳送；完成阿斯卡隆學院後才進入災變後世界。其他章節出生角色無法回到這個新手區。</p></header>
 <div className={guide.warning}><strong>離開前先確認</strong><p>一旦接受 Sir Tydus 的學院任務並進入 Ascalon Academy，這名角色就無法返回災變前阿斯卡隆。想先逛地圖、學技能、完成支線或收集物品，就在這裡處理好。</p></div>
 <nav className={guide.jump} aria-label="本頁目錄"><a href="#route">主線順序</a><a href="#tests">六職業測驗</a><a href="#secondary">副職業在哪</a><a href="#after">離開後去哪</a></nav>
 <section id="route"><h2>主線怎麼走</h2><p>Wiki 把幾個教學引導列為 Primary Quest，但它們可以略過；下表依新玩家最容易跟上的順序排列。任務正式繁中名稱尚未取得可靠對照，因此以英文名稱為標題，中文小字只說明這一步的用途。Reforged 模式另有 <a href={wiki('Getting_Started_in_Guild_Wars')}>Getting Started in Guild Wars</a> 總覽任務，標準模式不會出現。</p><ol className={guide.route}>{quests.map((q,i)=><li key={q.en}><div><span className={guide.number}>{String(i+1).padStart(2,'0')}</span><span className={guide.kind}>{q.kind}</span></div><h3>{q.en} <small>中文指引：{q.title}</small></h3><p className={guide.meta}>找誰：{q.npc} · 地點：{q.where}</p><p>{q.steps}</p><a href={wiki(q.wiki)} target="_blank" rel="noopener noreferrer">Wiki 任務原頁與地圖 ↗</a></li>)}</ol></section>
 <section id="tests"><h2>主職業測驗：只做自己那一項</h2><p>六種主職業的測驗都從阿斯卡隆城西南門外開始，任務會指向對應導師。下列 NPC 英文名稱保留遊戲／Wiki 寫法，方便你在地圖對照。</p><div className={guide.grid}>{tests.map(t=><article key={t.en}><h3>{t.job}</h3><p className={guide.english}>{t.en} · {t.npc}</p><p>{t.walk}</p><a href={wiki(t.en.replaceAll(' ','_'))}>查看原任務 ↗</a></article>)}</div></section>
 <section id="secondary"><h2>第二職業：導師在哪裡？</h2><p>先找阿斯卡隆城的 Armin Saberlin 接 A Second Profession；以下選一種，不用六種全做。要正式選定副職業後才能離開新手區；往後達到解鎖條件還可更換。</p><div className={guide.grid}>{secondaries.map(s=><article key={s.job}><h3>{s.job}</h3><p className={guide.english}>{s.npc}</p><p>{s.path}</p><a href={wiki(s.quest)}>查看入門任務 ↗</a></article>)}</div></section>
 <section id="after" className={guide.after}><h2>完成學院後去哪？</h2><p>學院洞穴最後擊敗 Vatlaaw Doomtooth 會觸發災變，角色進入災變後阿斯卡隆。從 <a href={wiki('The_Krytan_Ambassador')}>The Krytan Ambassador</a> 等任務繼續推進，接著走向本站第一關 <Link href="/missions/view/?campaign=prophecies&id=the-great-northern-wall">北方長城</Link>。本站的 25 關合作任務列表從北方長城開始；此頁補上此前第一章出生角色專有的教學主線。</p><p>來源：<a href={wiki('List_of_Prophecies_missions_and_primary_quests')}>Guild Wars Wiki 主線順序</a>、<a href={wiki('Guide_to_Ascalon_(pre-Searing)')}>災變前阿斯卡隆指南</a>與上方各任務頁。攻略為重新整理的中文說明，專名未核實時保留英文。</p></section>
 </article>}
