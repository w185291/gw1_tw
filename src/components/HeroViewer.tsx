'use client';
import Link from 'next/link';
import {useSearchParams} from 'next/navigation';
import type {Hero} from '@/data/schemas/content';
import {useStaticJson} from '@/lib/use-static-json';
import {guideHref,missionHref} from '@/lib/guide-links';
import {LocalizedText} from './LocalizedText';
import {Breadcrumbs} from './Breadcrumbs';
import {Portrait} from './Portrait';
import {heroPortrait} from '@/lib/portraits';
import styles from './Guide.module.css';
import visual from './CatalogVisual.module.css';

type Related={id:string;campaign:string;displayOrder?:string;name:{zhTW:string;en:string}};
export function HeroViewer(){
 const id=useSearchParams().get('id')??'';
 const valid=/^[a-z0-9-]+$/.test(id);
 const {data,error}=useStaticJson<{heroes:Hero[];related:Record<string,Related[]>}>(valid?'/data/guide-content/heroes.json':null);
 if(!valid)return <p>找不到英雄。<Link href="/heroes/">返回英雄列表</Link></p>;
 if(error)return <p>英雄資料載入失敗，請重新整理頁面。</p>;
 if(!data)return <p role="status">正在載入英雄資料…</p>;
 const entry=data.heroes.find(h=>h.id===id);
 if(!entry)return <p>找不到英雄。<Link href="/heroes/">返回英雄列表</Link></p>;
 const related=data.related[id]??[];
 const sections:Array<[string,string[]]>=[
  [entry.campaign==='nightfall'?'黑暗逆襲出生角色':'招募條件與步驟',entry.native],
  ['外來角色',entry.foreign],['破關後補招／細節',entry.postgame],
 ];
 return <><Breadcrumbs items={[{label:'首頁',href:'/'},{label:'英雄',href:'/heroes/'},{label:entry.name.zhTW}]}/><article className={styles.missionDetail}><header className={`${styles.detailHeader} ${visual.detailHero}`}><div><h1>{entry.name.zhTW}</h1><p>{entry.name.en} · {entry.profession}</p>{entry.choiceGroup&&<p className={styles.trialNote}>選擇群組：{entry.choiceGroup}。首次招募只能選一位；另一位可破關後補招。</p>}</div><div><Portrait kind="hero" id={entry.id} name={entry.name.zhTW} profession={entry.profession} large/><p className={visual.imageCredit}>職業圖示：Guild Wars Wiki 貢獻者（<a href="/licenses/GFDL-1.2.txt">GFDL</a>）{heroPortrait(entry.id,true)&&<> · <a href={heroPortrait(entry.id,true)?.sourceUrl}>在 Wiki 看角色外觀</a></>}</p></div></header>{sections.filter(([,items])=>items.length>0).map(([title,items])=><section className={styles.detailSection} key={title}><h2>{title}</h2><ul>{items.map(item=><li key={item}><LocalizedText text={item}/></li>)}</ul></section>)}<section className={styles.detailSection}><h2>本站相關任務</h2><ul>{related.map(m=><li key={`${m.campaign}/${m.id}`}><Link href={missionHref(m.campaign,m.id)}>{m.displayOrder} · {m.name.zhTW}</Link></li>)}</ul>{entry.id==='koss'&&<p>Attack at the Kodash 主線 Quest 另需同帶 Koss 與 Melonni。</p>}{entry.id==='razah'&&<Link href={guideHref('finding-a-purpose')}>Finding a Purpose 入口</Link>}</section><section className={styles.detailSection}><h2>來源</h2><ul>{entry.sources.map(source=><li key={source.url}><a href={source.revision?`${source.url}?oldid=${source.revision}`:source.url}>{source.title}</a> · {source.checkedAt}</li>)}</ul></section></article></>;
}
