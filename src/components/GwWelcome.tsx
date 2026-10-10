import Image from 'next/image';
import Link from 'next/link';
import {Portrait} from './Portrait';
import {homeSources} from '@/data/home-sources';
import styles from './GwWelcome.module.css';

const campaigns = [
  {id: 'prophecies', number: '01', name: '阿斯卡隆戰記', en: 'Prophecies', region: '泰瑞亞', theme: '從阿斯卡隆啟程，經過科瑞塔、水晶沙漠與火環群島。', pace: '長篇冒險 · 慢步調探索', accent: 'ascalon'},
  {id: 'factions', number: '02', name: '盟與敵', en: 'Factions', region: '凱珊', theme: '探索凱寧城、科凡德森林與碧玉海，進入雙陣營故事。', pace: '節奏明快 · 刺客與祭祀', accent: 'cantha'},
  {id: 'nightfall', number: '03', name: '黑暗逆襲', en: 'Nightfall', region: '伊洛那', theme: '從艾斯坦走向高楠、瓦貝與苦痛領域，逐步組建英雄隊。', pace: '英雄系統 · 神喚與聖言者', accent: 'elona'},
  {id: 'eye-of-the-north', number: 'EX', name: '極地之眼', en: 'Eye of the North', region: '泰瑞亞北方', theme: '拜訪諾恩、阿蘇拉與矮人，挑戰地下城並建立榮譽之殿收藏。', pace: '需另購的擴充內容', accent: 'north'},
] as const;

const skillBar = [
  ['sever-artery', '動脈切割'], ['healing-signet', '治療紋章'],
  ['fireball', '火球術'], ['charm-animal', '迷魅動物'],
  ['energy-surge', '能量衝擊'], ['soul-twisting', '生靈扭轉'],
  ['signet-of-spirits', '靈魂的紋章'], ['panic', '恐慌'],
] as const;

const features = [
  {number: '01', title: '跟著故事走遍四地', text: '從阿斯卡隆、凱珊到伊洛那，再進入極地之眼。主線任務、合作任務與過場劇情串起各地人物和衝突。', href: '/campaigns/', link: '選一段故事'},
  {number: '02', title: '帶隊探索與解任務', text: '你可與玩家組隊，也可帶傭兵或英雄挑戰 PvE。英雄能調整技能與行為，讓一個人也能按自己的步調推進大量內容。', href: '/heroes/', link: '認識英雄'},
  {number: '03', title: '八格技能與雙職業', text: '主、副職業和有限的技能欄讓隊伍配置有很多變化。卡關時可換招、調屬性或分工，但探索路線與操作同樣重要。', href: '/builds/', link: '學會使用 Build'},
  {number: '04', title: '挑戰合作任務與高難區', text: '完成劇情後，還能補 Bonus／Master、重打困難模式、探索地下城及菁英區域。', href: '/pve/', link: '查看 PvE 內容'},
  {number: '05', title: '在 PvP 與其他玩家較量', text: '競技場、陣營戰及公會戰各有隊伍人數與目標。技能和隊伍策略能在玩家對戰中接受另一種考驗。', href: '/pvp/', link: '認識 PvP 模式'},
  {number: '06', title: '收集自己想留下的成果', text: '技能、菁英防具、武器、迷你寵物、地圖探索與稱號都能成為長期目標；部分成果可展示在史蹟殿堂。', href: '/hall-of-monuments/', link: '看史蹟殿堂'},
] as const;

const faq = [
  ['現在還能玩嗎？', '可以。官方仍提供服務，現行客戶端為 Guild Wars Reforged。'],
  ['有月費嗎？', '沒有。已購買的內容不需另繳月費。'],
  ['一定要與真人組隊嗎？', '不用。傭兵和英雄可協助大量 PvE；部分高難內容與 PvP 和真人合作會更合適。'],
  ['Reforged 是另一款新遊戲嗎？', '不是。它是原版 Guild Wars 的更新；舊角色與進度可繼續使用。'],
  ['Reforged 包含極地之眼嗎？', '不包含。包含的是阿斯卡隆戰記、盟與敵、黑暗逆襲；極地之眼需另購。'],
  ['Steam 與官方商店怎麼選？', '新玩家可選任一平台。2025 年 12 月 3 日前建立的 email 帳號屬 ArenaNet 帳號，購買額外內容前要核對官方帳號說明。'],
  ['有繁體中文嗎？', '本地 PC 客戶端含繁體中文字串與語言選項。部分較新技能或介面文字仍可能缺譯；本站保留英文名稱供對照。'],
] as const;

function SectionTitle({eyebrow, title, children}: {eyebrow: string; title: string; children?: React.ReactNode}) {
  return <div className={styles.sectionTitle}><p>{eyebrow}</p><h2>{title}</h2>{children && <div>{children}</div>}</div>;
}

function Sources() {
  return <section className={styles.sources} aria-labelledby="home-sources"><h2 id="home-sources">本文資料來源</h2><div className={styles.sourceColumns}>{['官方', '遊戲資料', '社群觀點'].map(group => <div key={group}><h3>{group}</h3><ul>{homeSources.filter(source => source.group === group).map(source => <li key={source.url}><a href={source.url}>{source.label}</a></li>)}</ul></div>)}</div><p>購買、平台與帳號資訊以官方為準；社群連結只用於整理玩家觀點。職業圖示來源與授權請見頁尾及媒體清單。資料核對：2026-10-10。</p></section>;
}

export function GwWelcome({expanded = false}: {expanded?: boolean}) {
  return <div className={styles.page}>
    <section className={styles.hero} aria-labelledby="welcome-title">
      <div className={styles.heroCopy}>
        <p className={styles.kicker}>GUILD WARS REFORGED · 繁體中文入門</p>
        <h1 id="welcome-title">Guild Wars 1<br/><em>是什麼遊戲？</em></h1>
        <p className={styles.lead}>走進阿斯卡隆、凱珊與伊洛那的故事；與玩家或英雄組隊冒險，在 PvE、PvP 與收藏目標中走出自己的路。</p>
        <p>《Guild Wars 1》有合作任務、可調整的職業與技能、競技對戰，也有技能、裝備、稱號與史蹟殿堂等長期目標。2005 年開始的世界，透過 Reforged 更新延續至今；買斷後無月費。</p>
        <div className={styles.actions}><Link className={styles.primary} href="/getting-started/">第一次玩，從這裡開始</Link><Link className={styles.secondary} href="/campaigns/">我已在遊戲裡，查看攻略</Link><a className={styles.secondary} href="#buy">怎麼購買</a></div>
        <div className={styles.heroFacts}><span>無月費</span><span>三大戰役</span><span>PvE／PvP</span><span>PC／行動版</span></div>
      </div>
      <div className={styles.heroArt} aria-label="戰士職業圖示、英雄與八格技能列的遊戲視覺示意">
        <div className={styles.heroHalo}><Portrait kind="profession" id="warrior" name="戰士" large/></div>
        <div className={styles.heroParty}><Portrait kind="hero" id="koss" name="寇斯" profession="戰士"/><Portrait kind="hero" id="gwen" name="關" profession="幻術師"/><Portrait kind="hero" id="xandra" name="珊卓亞" profession="祭祀"/></div>
        <div className={styles.heroSkillBar}>{skillBar.map(([id, name], index) => <span key={id}><Image src={`/skills/${id}.png`} width={48} height={48} alt={name} loading={index === 0 ? 'eager' : 'lazy'}/><small>{index + 1}</small></span>)}</div>
        <p>八個位置，無數種解法</p>
      </div>
    </section>

    <nav className={styles.jumpNav} aria-label="新手導覽章節"><a href="#what-is">遊戲特色</a><a href="#how-to-play">核心玩法</a><a href="#campaigns">四段冒險</a><a href="#buy">怎麼購買</a><a href="#activities">玩什麼</a><a href="#monuments">史蹟殿堂</a><a href="#faq">常見問題</a></nav>

    <section id="what-is" className={styles.section}>
      <SectionTitle eyebrow="01 / 先認識它" title="同一個世界，可以有不同目標"><p>你會在城鎮與其他玩家相遇；離開據點後，隊伍進入自己的冒險區域。官方曾用 CORPG 描述這種重視合作與競技的線上角色扮演遊戲。玩家可以為劇情而來，也可以專注挑戰、對戰或收藏。</p></SectionTitle>
      <div className={styles.compare}><div><span>沿著故事冒險</span><p>選戰役 → 認識人物與地區 → 完成任務和合作關卡 → 前往下一座城市</p></div><div><span>找到自己的長期目標</span><p>組隊與調整技能 → 挑戰高難 PvE 或 PvP → 收集技能、外觀與稱號 → 展示成果</p></div></div>
      <div className={styles.statStrip}><div><strong>20</strong><span>等級上限</span></div><div><strong>8</strong><span>技能欄位</span></div><div><strong>10</strong><span>個職業</span></div><div><strong>0</strong><span>月費</span></div></div>
    </section>

    <section id="how-to-play" className={styles.section}>
      <SectionTitle eyebrow="02 / 真正在玩什麼" title="故事、隊伍、競技與收藏交織的旅程"><p>技能搭配是戰鬥的一部分；你也會探索地圖、追隨劇情、與隊友合作、挑戰其他玩家，或為一件外觀與一個稱號持續努力。不同玩家能選擇不同重點。</p></SectionTitle>
      <div className={styles.featureGrid}>{features.map(feature => <article key={feature.number}><span>{feature.number}</span><h3>{feature.title}</h3><p>{feature.text}</p><Link href={feature.href}>{feature.link} →</Link></article>)}</div>
      <div className={styles.skillNote}><div className={styles.miniBar}>{skillBar.slice(0, 8).map(([id, name]) => <Image key={id} src={`/skills/${id}.png`} width={44} height={44} alt={name} loading="lazy"/>)}</div><p>示意：八格技能列展示不同職業的圖示，實際 Build 必須符合角色可用技能與規則。</p></div>
    </section>

    <section id="campaigns" className={styles.section}>
      <SectionTitle eyebrow="03 / 選擇起點" title="三大戰役，加一部擴充內容"><p>各戰役有自己的出生地與故事。極地之眼是擴充內容，角色從已有的戰役進入，並不提供新的角色出生點。</p></SectionTitle>
      <div className={styles.campaignGrid}>{campaigns.map(campaign => <article className={`${styles.campaignCard} ${styles[campaign.accent]}`} key={campaign.id}><span className={styles.campaignNumber}>{campaign.number} / {campaign.region}</span><h3>{campaign.name}</h3><p className={styles.campaignEnglish}>{campaign.en}</p><p>{campaign.theme}</p><small>{campaign.pace}</small><div><Link href={`/campaigns/${campaign.id}/`}>章節介紹</Link><Link href={`/campaigns/${campaign.id}/missions/`}>任務攻略</Link></div></article>)}</div>
      <p className={styles.editorNote}>第一次玩怎麼選？想按故事慢慢走，從阿斯卡隆戰記開始；想快速進入技能搭配，考慮盟與敵；想早點取得英雄隊，考慮黑暗逆襲。這是本站的入門建議，不是遊戲限制。</p>
    </section>

    <section id="buy" className={styles.section}>
      <SectionTitle eyebrow="04 / 開始遊玩" title="現在怎麼買、要買什麼？"><p>Guild Wars Reforged 是原版的現代化更新。新購買內容包含三大戰役；極地之眼與 Bonus Mission Pack 需另購。既有玩家可延續原帳號角色與進度。</p></SectionTitle>
      <div className={styles.buyGrid}><article><span>選項 A</span><h3>Guild Wars 官方商店</h3><p>適合要使用 email 登入的 ArenaNet 帳號，特別是 2025 年 12 月 3 日前建立帳號的回鍋玩家。購買後以序號加入帳號。</p><a href="https://store.guildwars.com/">前往官方商店 ↗</a></article><article><span>選項 B</span><h3>Steam</h3><p>適合全新玩家和想用 Steam 管理遊戲的人。Reforged 的新 Steam 帳號會直接與 Steam 購買綁定，無需輸入序號。</p><a href="https://store.steampowered.com/app/29720/">前往 Steam ↗</a></article></div>
      <div className={styles.included}><div><strong>Reforged 包含</strong><span>阿斯卡隆戰記</span><span>盟與敵</span><span>黑暗逆襲</span></div><div><strong>另外購買</strong><span>極地之眼</span><span>Bonus Mission Pack</span></div></div>
      <aside className={styles.accountWarning}><strong>回鍋玩家先確認帳號類型</strong><p>2025 年 12 月 3 日前建立的 GW1 帳號都屬 ArenaNet email 帳號，包含當年透過 Steam 購買的舊帳號。Steam 新帳號與 email 帳號的附加內容不能直接互灌；買 DLC 前請依<a href="https://help.guildwars.com/hc/en-us/articles/360001507828-Guild-Wars-Reforged-on-Steam">官方帳號說明</a>選商店。</p></aside>
      <div className={styles.noFee}><strong>沒有月費。</strong><span>一次購買後即可持續遊玩已擁有的內容。價格與特價請直接查看商店。</span></div>
    </section>

    <section id="activities" className={styles.section}>
      <SectionTitle eyebrow="05 / 不只打主線" title="一個人能玩嗎？破關後還有什麼？"><p>傭兵能陪你走早期主線；黑暗逆襲與極地之眼的英雄則可自行設定 Build。大量 PvE 可以用英雄隊推進，高難區域與 PvP 有真人隊友通常更合適。</p></SectionTitle>
      <div className={styles.activityGrid}><article><h3>PvE 冒險</h3><p>三大戰役、合作任務、Bonus／Master、極地之眼地下城；還有 The Deep、Urgoz&apos;s Warren、Underworld、Fissure of Woe、Domain of Anguish 等菁英區域。</p><Link href="/pve/">認識 PvE 內容 →</Link></article><article><h3>破關後目標</h3><p>Hard Mode、Vanquish、Guardian、技能獵人、地圖探索、稱號、GWAMM 與榮譽之殿；Beyond 還延伸了後續故事。</p><Link href="/postgame/">查看破關後目標 →</Link></article><article><h3>PvP 競技</h3><p>Random Arenas、Codex Arena、Alliance Battles、Fort Aspenwood、Jade Quarry、Heroes&apos; Ascent 與 Guild versus Guild 等。各模式人口和活動時間不同，請留意社群約戰。</p><Link href="/pvp/">認識 PvP 模式 →</Link></article><article><h3>裝備與收藏</h3><p>最大基礎數值裝備可較早取得；之後仍可調整符文、徽記、武器詞綴，追外觀與菁英防具。</p><Link href="/equipment/">查看裝備與收藏 →</Link></article></div>
    </section>

    <section id="monuments" className={styles.section}>
      <SectionTitle eyebrow="05A / 把冒險留下來" title="史蹟殿堂：你在 GW1 留下的紀錄"><p>《極地之眼》的史蹟殿堂能展示稱號、迷你寵物、英雄與動物夥伴、菁英防具和特定武器。符合條件的成果也會成為 Guild Wars 2 的專屬獎勵進度。</p></SectionTitle>
      <div className={styles.monumentPreview}><Image src="/images/hall-of-monuments/hall.jpg" width={1024} height={768} alt="史蹟殿堂內的紀念碑與展示空間"/><div><h3>五座碑，五種收藏</h3><p>先在遊戲內把成果登錄到對應紀念碑，再輸入角色名稱到 ArenaNet 官方計算器，查看已取得和還缺的獎勵。</p><Link href="/hall-of-monuments/">認識五座紀念碑與收集方式 →</Link><a href="https://hom.guildwars2.com/en/">官方進度查詢 ↗</a></div></div>
    </section>

    <section className={styles.section}>
      <SectionTitle eyebrow="06 / 2026 的 GW1" title="Reforged 改了什麼？"><p>原有戰鬥與故事仍是 GW1。更新重點是高 DPI 與文字尺寸、HD 技能圖示、任務追蹤、畫面與音效改善，以及控制器和 Steam Deck 支援。</p></SectionTitle>
      <div className={styles.reforged}><div><strong>2005</strong><span>Guild Wars 開始冒險</span></div><b aria-hidden="true">→</b><div><strong>2025</strong><span>Reforged 讓原版更適合現代設備</span></div></div>
      <p className={styles.mobileNote}>遊戲內的 <a href="https://wiki.guildwars.com/wiki/Reforged_Mode">Reforged Mode</a> 是另一個可選玩法模式，目前仍在 Beta；它和所有玩家都會取得的 Reforged 客戶端更新是兩件事。</p>
      <p className={styles.mobileNote}>官方也提供行動版。手機上可免費體驗阿斯卡隆戰記；免費帳號有聊天、PvP 限制與換圖廣告。購買完整內容可解除限制。下載地區與平台請看<a href="https://help.guildwars.com/hc/en-us/articles/51186731021587-Guild-Wars-Reforged-Mobile-FAQ">官方行動版 FAQ</a>。</p>
    </section>

    {expanded && <>
      <section className={styles.section}><SectionTitle eyebrow="深入了解" title="如果你玩過 Guild Wars 2"><p>阿斯卡隆、獅子拱門、席娃山脈、凱珊與伊洛那在 GW1 有自己的時代樣貌。從前作走一遍泰瑞亞，可以補上許多歷史背景；玩法則更偏向技能、隊伍與任務解題。</p></SectionTitle><Link href="/campaigns/prophecies/">從阿斯卡隆戰記看起 →</Link></section>
      <section className={styles.section}><SectionTitle eyebrow="玩家觀點" title="社群常提到的吸引力與門檻"><p>台灣早期新手文與近年英文社群都常討論技能搭配、英雄隊和按自己的步調推進。也有人提到新手容易迷路、解鎖技能需要時間；這是玩家經驗，不代表每個人的感受相同。</p></SectionTitle><div className={styles.activityGrid}><article><h3>可能很適合你</h3><p>喜歡戰術、八格 Build、角色隊伍配置、收集技能、挑戰 Boss、稱號與經典 PC RPG。</p></article><article><h3>可能需要適應</h3><p>野外不是無縫共享世界；戰鬥沒有 GW2 式翻滾、跳躍或坐騎探索。介面與任務設計仍有老遊戲的節奏。</p></article></div></section>
      <section className={styles.section}><SectionTitle eyebrow="路線圖" title="從第一個角色到長期目標"/></section><ol className={styles.roadmap}>{[['購買與選帳號','#buy'],['選出生戰役','#campaigns'],['建立角色、學會八格技能','/professions/'],['進據點、完成合作任務','/campaigns/'],['跨章並取得英雄','/heroes/'],['完成戰役與極地之眼','/campaigns/eye-of-the-north/'],['挑戰 Hard Mode 與地下城','/dungeons/'],['追稱號與榮譽之殿','https://wiki.guildwars.com/wiki/Hall_of_Monuments']].map(([label, href], i) => <li key={label}><span>{String(i + 1).padStart(2, '0')}</span><a href={href}>{label}</a></li>)}</ol>
    </>}

    <section id="faq" className={styles.section}><SectionTitle eyebrow="快速回答" title="新玩家常見問題"/><div className={styles.faq}>{faq.map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</div></section>

    <section className={styles.finalCta}><p>下一步</p><h2>準備好進入泰瑞亞了嗎？</h2><div className={styles.actions}><Link className={styles.primary} href="/getting-started/">我是第一次玩</Link><Link className={styles.secondary} href="/campaigns/">我已經在遊戲裡</Link><Link className={styles.secondary} href="/skills/">找技能與 Build</Link></div>{!expanded && <p><Link href="/what-is-guild-wars/">完整了解 Guild Wars →</Link></p>}</section>
    <Sources/>
  </div>;
}
