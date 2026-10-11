'use client';
import {useEffect, useState} from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {useSearchParams} from 'next/navigation';
import {useStaticJson} from '@/lib/use-static-json';
import {skillHref} from '@/lib/skill-links';
import {skillTrainerIndex,trainerCampaignLabel,type TrainerPayload} from '@/lib/skill-trainers';
import styles from './SkillTrainers.module.css';

const normalizeSearch=(text:string)=>text.normalize('NFKC').trim().toLowerCase().replace(/[’‘]/g,"'");
const professions:Record<string,{name:string;href:string}>={
  w:{name:'戰士',href:'warrior'},r:{name:'遊俠',href:'ranger'},mo:{name:'僧侶',href:'monk'},
  n:{name:'死靈法師',href:'necromancer'},me:{name:'幻術師',href:'mesmer'},e:{name:'元素使',href:'elementalist'},
  a:{name:'刺客',href:'assassin'},rt:{name:'祭祀',href:'ritualist'},p:{name:'聖言者',href:'paragon'},d:{name:'神喚',href:'dervish'},
};
type SkillInfo=TrainerPayload['skills'];
function SkillGroup({code,ids,skills,searching}:{code:string;ids:string[];skills:SkillInfo;searching:boolean}){
  const [expanded,setExpanded]=useState(false);
  const visible=expanded||searching;
  return <details className={styles.skillGroup} open={visible} onToggle={event=>setExpanded(event.currentTarget.open)}>
    <summary><Link href={`/skills/professions/${professions[code]?.href??'common'}/`}>{professions[code]?.name??code}</Link> · {ids.length} 招</summary>
    {visible&&<div className={styles.skillGrid}>{ids.map(skill=>{
      const item=skills[skill];
      if(!item)return <a key={skill} className={styles.skill} href={`https://wiki.guildwars.com/wiki/${encodeURIComponent(skill==='help-me'?'"Help Me!"':skill.replaceAll('-',' '))}`}><span>{skill==='help-me'?'"Help Me!"':skill} ↗<small>查看 Wiki</small></span></a>;
      return <Link key={skill} href={skillHref(skill)} className={styles.skill}><Image src={item.icon??`/skills/${skill}.png`} width={36} height={36} alt="" unoptimized loading="lazy"/><span>{item.zhTW}<small>{item.en}</small></span></Link>;
    })}</div>}
  </details>;
}

export function SkillTrainerViewer(){
  const id=useSearchParams().get('id')??'';
  const [query,setQuery]=useState('');
  const summary=skillTrainerIndex.find(item=>item.id===id);
  const {data,error}=useStaticJson<TrainerPayload>(summary?`/data/skill-trainers/${summary.campaign}.json`:null);
  useEffect(()=>{if(summary)document.title=`${summary.zhTW??summary.name}｜技能導師｜GW1 非官方攻略站`;},[summary]);
  if(!summary)return <p>找不到這位導師。<Link href="/skill-trainers/">返回導師名錄</Link></p>;
  if(error)return <p>導師資料載入失敗，請重新整理頁面。</p>;
  if(!data)return <p role="status">正在載入導師資料…</p>;
  const trainer=data.trainers.find(item=>item.id===id);
  if(!trainer)return <p>找不到這位導師。<Link href="/skill-trainers/">返回導師名錄</Link></p>;
  const groups=Object.entries(trainer.skills)
    .map(([code,ids])=>({code,ids:ids.filter(skill=>!query||normalizeSearch([data.skills[skill]?.zhTW,data.skills[skill]?.en,skill].join(' ')).includes(normalizeSearch(query)))}))
    .filter(group=>group.ids.length);
  const total=Object.values(trainer.skills).flat().length;
  const placeText=(en:string,zhTW:string)=>zhTW===en?en:`${zhTW}（${en}）`;
  return <article className={styles.detail}>
    <nav className={styles.breadcrumb}><Link href="/">首頁</Link> / <Link href="/skill-trainers/">技能導師</Link> / {trainer.zhTW??trainer.name}</nav>
    <header className={styles.hero}>
      <div><span className={styles.kicker}>{trainerCampaignLabel(trainer.campaign)} · {trainer.type==='hero'?'英雄技能導師':'技能導師'}</span><h1>{trainer.zhTW??trainer.name}</h1>{trainer.zhTW&&<p>{trainer.name}</p>}
        <p>{trainer.type==='hero'?'消耗英雄技能點學習技能；不另收金幣。':'消耗一般技能點與金幣學習技能。'}</p>
        <p className={styles.locationLine}><strong>所在地：</strong>{trainer.locations.map(place=>placeText(place.en,place.zhTW)).join('、')}</p>
        {trainer.regions.length>0&&<p><strong>區域：</strong>{trainer.regions.map(place=>placeText(place.en,place.zhTW)).join('、')}</p>}
      </div>
      <figure className={styles.portrait}>{trainer.image&&<Image src={trainer.image.src} width={220} height={240} alt={trainer.imageIsSymbol?'Wiki 捕捉紋章圖示':`${trainer.name} 的 Wiki 圖片`} style={{width:'auto',height:'auto'}} loading="eager" unoptimized/>}<figcaption>{trainer.imageIsSymbol?'此 NPC 的 Wiki 頁未提供肖像，使用技能圖示。':'Wiki 角色圖像'}<br/><a href={trainer.image?.sourceUrl}>圖片來源</a></figcaption></figure>
    </header>
    {trainer.mapImage&&<section className={styles.section}><h2>Wiki 位置圖</h2><figure className={styles.map}><a href={trainer.mapImage.sourceUrl}><Image src={trainer.mapImage.src} width={600} height={420} alt={`${trainer.name} 的 Wiki 位置圖`} unoptimized/></a><figcaption><a href={trainer.mapImage.sourceUrl}>開啟 Wiki 原始位置圖</a></figcaption></figure></section>}
    <section className={styles.section}>
      <h2>這位導師教什麼？</h2>
      {trainer.name==='Magi Malaquire'?<p>這位是第一章的特殊技能導師。僅阿斯卡隆戰記出生的角色可完成 <a href="https://wiki.guildwars.com/wiki/Malaquire%27s_Test">Malaquire&apos;s Test</a>；完成後可向他購買<Link href={skillHref('signet-of-capture')}>捕捉紋章</Link>與帳號已解鎖的技能，Wiki 沒有列固定新技能清單。</p>
        :trainer.name==='Vernados'?<p>Wiki 註明他只顯示帳號已解鎖的技能，且不教授捕捉紋章；沒有固定的新技能清單。</p>
        :trainer.campaign==='core'?<p>公會廳技能導師只提供帳號已解鎖的共通技能，以及捕捉紋章；不提供第二、三章新增職業的技能。</p>
        :<><p>下面是 Wiki 明列的技能與同技能清單導師。帳號已解鎖的同章節及共通非菁英技能，可能也會出現在一般導師的購買視窗；遊戲內實際選單會依帳號解鎖狀態變動。</p>
          {trainer.inherited.length>0&&<p>Wiki 另外註明這位導師沿用 {trainer.inherited.join('、')} 的技能清單。</p>}
          {total>0&&<><label className={styles.skillSearch}>在這位導師的技能中搜尋<input type="search" value={query} onChange={event=>setQuery(event.target.value)} placeholder="中文或英文技能名稱"/></label>
            <p className={styles.count}>列出 {groups.reduce((sum,group)=>sum+group.ids.length,0)}／{total} 招</p>
            {groups.map(group=><SkillGroup key={group.code} {...group} skills={data.skills} searching={Boolean(query)}/>)}
            {!groups.length&&<p>找不到符合的技能。</p>}</>}
        </>}
    </section>
    <section className={styles.section}><h2>使用提醒</h2><p>一般導師每招花 1 技能點，金幣價格隨角色已購買技能數從 50 漸增至 1,000；Reforged 模式價格減半。英雄技能導師每招花 1 英雄技能點、不收金幣，且至少要有 1 點才會顯示清單。菁英技能需用捕捉紋章從 Boss 取得，PvE 專用技能則依個別取得條件學習。</p><p><Link href="/skills/">返回技能資料庫</Link> · <Link href="/skill-trainers/">查看其他技能導師</Link></p></section>
    <section className={styles.section}><h2>來源</h2><p><a href={trainer.wiki}>{trainer.name} · Guild Wars Wiki</a>{trainer.revision&&<>（修訂 {trainer.revision}）</>}</p><p>{trainer.image?.credit}</p><p><a href="https://wiki.guildwars.com/wiki/Skill_trainer">技能導師規則</a> · <a href="https://wiki.guildwars.com/wiki/Hero_skill_trainer">英雄技能導師規則</a></p></section>
  </article>;
}
