'use client';
import {useEffect,useState} from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {useSearchParams} from 'next/navigation';
import {SkillNavigation} from './SkillNavigation';
import type {Skill} from '@/data/schemas/skills';
import {skillHref} from '@/lib/skill-links';
import {trainerHref,trainerIdForName} from '@/lib/skill-trainers';
import {SkillEffects} from './SkillEffects';
import {LocalizedText} from './LocalizedText';
import styles from './Skills.module.css';

export function SkillViewer(){
 const params=useSearchParams();
 const id=params.get('id')??'';
 const [skill,setSkill]=useState<Skill|null>(null);
 const [state,setState]=useState<'loading'|'missing'|'error'|'ready'>('loading');
 useEffect(()=>{
  const controller=new AbortController();
  async function load(){
   try{
    setState('loading');
    if(!/^[a-z0-9-]+$/.test(id)){setState('missing');return;}
    const indexResponse=await fetch('/data/skills/index.json',{signal:controller.signal});
    if(!indexResponse.ok)throw new Error('技能索引載入失敗');
    const index=await indexResponse.json() as Record<string,string>;
    const profession=index[id];
    if(!profession){setState('missing');return;}
    const response=await fetch(`/data/skills/${encodeURIComponent(profession)}.json`,{signal:controller.signal});
    if(!response.ok)throw new Error('職業資料載入失敗');
    const skills=await response.json() as Skill[];
    const found=skills.find(item=>item.id===id);
    if(!found){setState('missing');return;}
    setSkill(found);
    setState('ready');
    document.title=`${found.name.zhTW} · ${found.name.en}｜GW1 攻略站`;
   }catch(error){if(!controller.signal.aborted){console.error(error);setState('error');}}
  }
  void load();
  return ()=>controller.abort();
 },[id]);
 if(state==='loading'||(state==='ready'&&skill?.id!==id))return <div className={styles.detail}><p role="status">正在載入技能資料…</p></div>;
 if(state==='missing')return <div className={styles.detail}><h1>找不到技能</h1><p><Link href="/skills/">返回技能資料庫</Link></p></div>;
 if(state==='error'||!skill)return <div className={styles.detail}><h1>技能資料載入失敗</h1><p>請重新整理頁面；若仍無法讀取，請檢查網站資料檔。</p><p><Link href="/skills/">返回技能資料庫</Link></p></div>;
 const s=skill;
 const groups=[['技能訓練師',s.acquisition.trainers],['任務獎勵',s.acquisition.quests],['捕捉 Boss',s.acquisition.bosses],['轉職取得',s.acquisition.professionChangers],['特殊取得／解鎖',s.acquisition.special]] as const;
 return <article className={styles.detail}><p><Link href="/skills/">技能資料庫</Link> / <Link href={`/skills/professions/${s.profession.id}/`}>{s.profession.zhTW}</Link></p><SkillNavigation professionId={s.profession.id}/><div className={styles.skillHeading}>{s.icon&&<Image src={s.icon} alt={`${s.name.zhTW}技能圖示`} width={64} height={64} unoptimized/>}<h1>{s.name.zhTW}</h1></div><p className={styles.english}>{s.name.en}</p><div className={styles.facts}><span>{s.profession.zhTW} · {s.profession.en}</span><span><Link href={`/skills/attributes/view/?id=${s.attribute.id}`}>{s.attribute.zhTW} · {s.attribute.en}</Link></span><span>{s.elite?'★ 菁英 · ':''}{s.type.zhTW}</span><span>{s.campaign.zhTW}</span>{s.pveOnly&&<span>PvE 專用</span>}{s.pvpVariantExists&&<span>PvP 分版</span>}</div><section><h2>技能效果與消耗</h2><SkillEffects skill={s}/></section><section><h2>怎麼使用</h2><p><LocalizedText text={s.explanation}/></p><h3>用途</h3><ul>{s.commonUses.map(use=><li key={use}><LocalizedText text={use}/></li>)}</ul></section><section><h2>取得方式</h2>{groups.filter(([,items])=>items.length).map(([title,items])=><div key={title}><h3>{title}</h3>{items.map((a,i)=><div className={styles.acquisition} key={a.url+i}><strong><a href={a.url}><LocalizedText text={a.name.zhTW}/></a></strong>{title==='技能訓練師'&&trainerIdForName(a.name.en)&&<p><Link href={trainerHref(trainerIdForName(a.name.en)!)}>查看本站導師資料與所在地 →</Link></p>}<p>{a.campaign}{a.unlockOnly?' · 只解鎖，不直接讓角色學會':''}</p><p>{a.locations.map((l,i)=><span key={l.url+i}><a href={l.url}><LocalizedText text={l.name.zhTW}/></a>{i<a.locations.length-1?'、':''}</span>)}</p><p><LocalizedText text={a.details}/></p>{title==='捕捉 Boss'&&<p>帶捕捉紋章，擊敗該 Boss 後捕捉；留意括號內的任務、模式或版本限制。</p>}</div>)}</div>)}{s.acquisition.tomes&&<><h3>{s.elite?'菁英技能書':'技能書'}</h3><p>帳號須先解鎖此技能，再由相符職業的角色使用技能書學習；角色需具備該技能章節的使用權限。</p></>}{s.earliestAcquisition&&<><h3>最早取得</h3><p>{s.earliestAcquisition.description}</p></>}{s.recommendedAcquisition&&<><h3>方便取得的位置</h3><p>{s.recommendedAcquisition.description}</p></>}</section><section><h2>技能來源與可取得章節</h2><p>技能來源：{s.campaign.zhTW}</p><p>可取得章節：<LocalizedText text={s.availableCampaigns.join('、')}/></p><p>來源章節與 NPC 所在章節不同；特殊取得和只解鎖方式另列於上方。</p></section>{s.relatedSkills.length>0&&<section><h2>相關技能</h2><div className={styles.links}>{s.relatedSkills.map(r=><Link key={r.id} href={skillHref(r.id)}>{r.zhTW}</Link>)}</div></section>}<section><h2>資料來源</h2><ul>{s.sources.map(source=><li key={source.url}><a href={source.url+'?oldid='+source.revision}>{source.title}</a></li>)}</ul><p>繁中名稱及效果文字對應本機遊戲字串；能量、施法、冷卻與取得清單參照各技能 Wiki 修訂。遊戲圖示 © ArenaNet／NCsoft。</p></section></article>;
}
