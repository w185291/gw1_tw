'use client';

import {Suspense,useEffect,useState} from 'react';
import Link from 'next/link';
import rotation from '@/data/zaishen/rotation.json';
import locale from '@/data/zaishen/locale.json';
import bounties from '@/data/zaishen/bounties.json';
import styles from './ZaishenDaily.module.css';
import {ZaishenLookup} from './ZaishenLookup';
import {zaishenQuestId} from '@/lib/zaishen-lookup';

type Category='mission'|'bounty'|'combat'|'vanquish';
type Entry={en:string;wiki:string};
const DAY=86_400_000;
const order:Category[]=['mission','bounty','vanquish','combat'];
const categoryInfo={
  mission:{label:'承戰任務',en:'Zaishen Mission',summary:'完成指定合作任務；額外獎勵依該任務的 Bonus／Master 與困難模式條件判定。'},
  bounty:{label:'承戰懸賞',en:'Zaishen Bounty',summary:'前往指定地區擊敗當日頭目；困難模式通常另有獎勵。'},
  vanquish:{label:'承戰清圖',en:'Zaishen Vanquish',summary:'切換困難模式，進入指定野外地圖並清除所有敵人。'},
  combat:{label:'承戰競技',en:'Zaishen Combat',summary:'前往指定 PvP 模式，依當日勝場與額外條件完成任務。'},
} as const;
const combatGoals:Record<string,string>={
  'Jade Quarry':'在翡翠礦場贏 3 場；贏 5 場與 9 場可取得額外獎勵。',
  'Fort Aspenwood':'在楊木要塞贏 3 場；贏 5 場與 9 場可取得額外獎勵。',
  'Random Arena':'在隨機競技場贏 3 場；連贏 5 場及累計贏 9 場可取得額外獎勵。',
  'Codex Arena':'在 Codex Arena 贏 3 場；連贏 5 場及累計贏 9 場可取得額外獎勵。',
  "Heroes' Ascent":'在 Heroes’ Ascent 贏 2 場；晉級至眾神殿，以及累計贏 6 場，可取得額外獎勵。',
  'Guild Versus Guild':'贏 1 場計分公會戰；在自動錦標賽贏一輪，以及累計贏 3 場計分公會戰，可取得額外獎勵。',
  'Alliance Battles':'贏 2 場同盟戰；以至少 200 分差距取勝，以及累計贏 6 場，可取得額外獎勵。',
};
const bountyByName=new Map(bounties.map(item=>[item.en,item]));
const bountyNotes:Record<string,string>={
  'The Stygian Lords':'Wiki 目標是擊敗 4 名 Stygian Lords；可參考 Breaching the Stygian Veil 與 Brood Wars 的路線。',
  'Dragon Lich':'Wiki 指出目標在 Fissure of Woe 的 Great Battle Field，守在暗影軍團營地入口附近。',
  'Havok Soulwail':'先接 Bjora Marches 的 The Misanthropic Jotun Principle；Wiki 指出未接該任務時地下城內的門會關閉。',
  'Rragar Maneater':'Wiki 指向 Veiled Threat 任務，隊伍至少一人要有該任務。',
  'Prismatic Ooze':'Wiki 指向 Watch it Jiggle 任務，隊伍至少一人要有該任務才能通過地下城鎖門。',
};
const nameOf=(en:string)=>locale.translations[en as keyof typeof locale.translations]??en;
const daysBetween=(a:string,b:string)=>Math.round((Date.parse(`${a}T00:00:00Z`)-Date.parse(`${b}T00:00:00Z`))/DAY);
const mod=(number:number,length:number)=>(number%length+length)%length;
function cycleDay(now:Date){return new Date(now.getTime()-16*60*60*1000).toISOString().slice(0,10);}
function entryFor(category:Category,date:string):Entry{
  const cycle=rotation.cycles[category];
  const index=mod(cycle.anchorIndex+daysBetween(date,rotation.anchorDate),cycle.entries.length);
  return cycle.entries[index];
}
function objectiveFor(category:Category,entry:Entry){
  if(category==='mission')return `前往「${nameOf(entry.en)}」合作任務據點並完成關卡；進場前查看關卡攻略的路線與額外目標。`;
  if(category==='vanquish')return `前往「${nameOf(entry.en)}」野外地圖，切換困難模式後清除所有敵人。`;
  if(category==='combat')return combatGoals[entry.en]??categoryInfo.combat.summary;
  const bounty=bountyByName.get(entry.en);
  const place=bounty?.areaEn.trim();
  const count=bounty?.objectiveEn.match(/^Kill (\d+) /)?.[1];
  const target=`${count?`${count} 名`:'頭目 '}${nameOf(entry.en)}`;
  return place&&place.toLowerCase()!=='his lair'
    ?`到「${nameOf(place)}」尋找並擊敗${target}。若任務頁有標示特殊位置，請先看下方 Wiki 路線。`
    :`尋找並擊敗${target}。此目標的入口或出現條件請查看下方 Wiki 任務頁。`;
}
async function wikiSchedule(dates:string[]):Promise<Record<string,Partial<Record<Category,Entry>>>>{
  const url=new URL('https://wiki.guildwars.com/api.php');
  url.search=new URLSearchParams({action:'parse',page:'Zaishen Challenge Quest',prop:'text',format:'json',formatversion:'2',origin:'*',date:dates[0]}).toString();
  const response=await fetch(url,{cache:'no-store'});
  if(!response.ok)throw Error('Wiki unavailable');
  const data=await response.json();
  if(typeof data.parse?.text!=='string')throw Error('Wiki schedule missing');
  const doc=new DOMParser().parseFromString(data.parse.text,'text/html');
  const table=[...doc.querySelectorAll('table')].find(item=>item.querySelector('caption')?.textContent?.includes('Zaishen Challenge Quests daily schedule'));
  if(!table)throw Error('Wiki schedule table missing');
  const result:Record<string,Partial<Record<Category,Entry>>>={};
  for(const row of table.querySelectorAll('tr')){
    const cells=[...row.querySelectorAll(':scope > td')];
    if(cells.length<5)continue;
    const date=row.querySelector('th[scope="row"] time')?.getAttribute('datetime')??'';
    if(!/^\d{4}-\d{2}-\d{2}$/.test(date))continue;
    if(!dates.includes(date))continue;
    const record:Partial<Record<Category,Entry>>={};
    for(const [index,category] of (['mission','bounty','combat','vanquish'] as Category[]).entries()){
      const link=cells[index].querySelector('a[href]');
      if(!link)continue;
      const href=new URL(link.getAttribute('href')??'', 'https://wiki.guildwars.com');
      if(href.hostname!=='wiki.guildwars.com')continue;
      record[category]={en:link.textContent?.trim()??'',wiki:href.href};
    }
    if(Object.keys(record).length===4)result[date]=record;
  }
  return result;
}
function Card({category,entry,upcoming=false}:{category:Category;entry:Entry;upcoming?:boolean}){
  const info=categoryInfo[category];
  const mission=category==='mission'?locale.missions[entry.en as keyof typeof locale.missions]:undefined;
  const translated=nameOf(entry.en);
  return <article className={styles.card}><div className={styles.cardTop}><span>{info.label}</span><small>{info.en}</small></div><h3>{translated}</h3>{translated!==entry.en&&<p className={styles.original}>{entry.en}</p>}<p className={styles.objective}>{objectiveFor(category,entry)}</p>{category==='bounty'&&bountyNotes[entry.en]&&<p className={styles.specific}>{bountyNotes[entry.en]}</p>}<p className={styles.explainer}>{info.summary}</p><div className={styles.actions}><Link href={`/zaishen/?quest=${zaishenQuestId(category,entry.en)}#lookup`}>中文速查・地點與獎勵 →</Link>{mission&&<Link href={mission.href}>本站關卡攻略 →</Link>}<a href={entry.wiki} target="_blank" rel="noopener noreferrer">Wiki 任務詳情 ↗</a></div>{upcoming&&<span className={styles.upcomingTag}>下一輪</span>}</article>;
}
export function ZaishenDaily(){
  const [now,setNow]=useState<Date|null>(null);
  const [wikiRows,setWikiRows]=useState<Record<string,Partial<Record<Category,Entry>>>>({});
  useEffect(()=>{const tick=()=>setNow(new Date());const initial=window.setTimeout(tick,0);const timer=window.setInterval(tick,30_000);return()=>{window.clearTimeout(initial);window.clearInterval(timer);};},[]);
  const active=now?cycleDay(now):null;
  const next=active?new Date(Date.parse(`${active}T00:00:00Z`)+DAY).toISOString().slice(0,10):null;
  useEffect(()=>{if(!active||!next)return;let cancelled=false;wikiSchedule([active,next]).then(rows=>{if(!cancelled)setWikiRows(rows);}).catch(()=>{});return()=>{cancelled=true;};},[active,next]);
  const currentEntry=(category:Category,date:string)=>wikiRows[date]?.[category]??entryFor(category,date);
  const nextReset=active?Date.parse(`${active}T16:00:00Z`)+DAY:0;
  const remaining=now?Math.max(0,Math.ceil((nextReset-now.getTime())/60_000)):0;
  const localDate=now?new Intl.DateTimeFormat('zh-TW',{timeZone:'Asia/Taipei',year:'numeric',month:'long',day:'numeric',weekday:'long'}).format(now):'';
  return <div className={styles.page}>
    <header className={styles.hero}><p className={styles.eyebrow}>每日 00:00 台灣時間更新</p><h1>承戰任務・每日與速查</h1><p>不用再對著英文告示牌猜任務：這裡依 Guild Wars Wiki 的固定輪替表顯示今日四項目標，保留英文原名供遊戲內比對，並附上中文做法與攻略入口。</p><div className={styles.dateLine}>{now?<><strong>{localDate}</strong><span>距離下一次輪替約 {Math.floor(remaining/60)} 小時 {remaining%60} 分鐘</span></>:<span>正在讀取本地日期…</span>}</div></header>
    <nav className={styles.actions} aria-label="承戰查詢入口"><a href="#lookup">已接任務・中英文速查 ↓</a><a href="#today">今日任務 ↓</a></nav>
    <div className={styles.notice}><strong>先去哪裡接？</strong>到巴薩澤聖殿或 Embark Beach 的承戰告示牌接任務；清圖告示牌在 Embark Beach。完成後找 Zehnchu 領獎。四類任務各有自己的告示牌；遊戲在 16:00 UTC 輪替，也就是台灣時間隔日 00:00。</div>
    <Suspense fallback={<p>正在載入速查工具…</p>}><ZaishenLookup/></Suspense>
    {active&&<><section id="today" className={styles.section}><div className={styles.sectionTitle}><h2>目前可接</h2><span>Wiki 排程日期：{active}（UTC）{wikiRows[active]?' · 已比對 Wiki 當日表':''}</span></div><div className={styles.grid}>{order.map(category=><Card key={category} category={category} entry={currentEntry(category,active)}/>)}</div></section><section className={styles.section}><div className={styles.sectionTitle}><h2>下次輪替預覽</h2><span>台灣時間下一個 00:00 開始</span></div><div className={styles.grid}>{order.map(category=><Card key={category} category={category} entry={currentEntry(category,next!)} upcoming/>)}</div></section></>}
    <section className={styles.help}><h2>看懂四種任務</h2><div><p><strong>承戰任務：</strong>重打指定合作任務。部分獎勵還要求 Bonus、Master 或困難模式，本站關卡攻略可查詳細路線。</p><p><strong>承戰懸賞：</strong>找指定頭目並擊敗；頭目有時在地下城或菁英區域，先從 Wiki 任務頁確認入口與出現條件。</p><p><strong>承戰清圖：</strong>在困難模式清除指定野外區域所有敵人。沒有解鎖該戰役的困難模式就無法完成。</p><p><strong>承戰競技：</strong>在指定 PvP 模式完成勝場。額外條件可能是連勝、指定勝差或錦標賽勝場。</p></div><p>每類最多可同時保留三個未完成的承戰任務；接了任務後不必當天做完。任務輪替與你角色已接取的任務日誌是兩回事。</p></section>
    <footer className={styles.sources}><h2>資料來源與名稱</h2><p>排程來自 <a href={rotation.source} target="_blank" rel="noopener noreferrer">Guild Wars Wiki 承戰任務總表</a>及其中四類輪替表；頭目地點取自對應 Wiki 任務頁。已核對的繁體名稱優先使用本站的遊戲客戶端中英對照與任務資料，未確認的專名保留英文，方便在遊戲中搜尋。若 Wiki 改動輪替規則，需更新本站資料。</p><p>排程依裝置時間計算。若日期顯示與遊戲不同，先確認電腦時間與時區，並以遊戲內告示牌為準。</p></footer>
  </div>;
}
