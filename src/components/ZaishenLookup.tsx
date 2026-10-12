'use client';
import {useMemo,useState} from 'react';
import {useSearchParams} from 'next/navigation';
import Link from 'next/link';
import clientTerms from '@/data/terminology/game-client.json';
import characterTerms from '@/data/terminology/characters.json';
import {useStaticJson} from '@/lib/use-static-json';
import {zaishenCampaigns,zaishenCategories,type ZaishenCatalogEntry,type ZaishenQuest} from '@/lib/zaishen-lookup';
import styles from './ZaishenDaily.module.css';

const normalize=(text:string)=>text.normalize('NFKC').toLocaleLowerCase().replace(/[’‘]/g,"'").replace(/\s+/g,' ').trim();
const exactNames=new Map([...clientTerms,...characterTerms].map(t=>[t.en,t.zhTW]));
function LookupText({text}:{text:string}){
 // Keep existing bilingual labels intact and never translate part of an unknown NPC name.
 const parts=text.split(/(（[^（）]*）|[A-Za-z][A-Za-z0-9'’.-]*(?: [A-Za-z0-9][A-Za-z0-9'’.-]*)*)/g);
 return <>{parts.map((part,i)=>{const zh=exactNames.get(part);return zh&&zh!==part?<span key={i}>{zh}（{part}）</span>:part;})}</>;
}
export function ZaishenLookup(){
 const params=useSearchParams();
 return <ZaishenLookupPanel key={params.get('quest')??'default'} routeId={params.get('quest')}/>;
}
function ZaishenLookupPanel({routeId}:{routeId:string|null}){
 const [query,setQuery]=useState('');const [category,setCategory]=useState('all');const [campaign,setCampaign]=useState('all');
 const [selected,setSelected]=useState<{id:string;routeId:string|null}|null>(null);const [limit,setLimit]=useState(20);
 const {data:catalog,error:catalogError}=useStaticJson<ZaishenCatalogEntry[]>('/data/zaishen/catalog.json');
 const filtered=useMemo(()=>{const words=normalize(query).split(' ').filter(Boolean);return (catalog??[]).filter(e=>(category==='all'||category===e.category)&&(campaign==='all'||campaign===e.campaign)&&words.every(word=>normalize(e.searchText+' '+zaishenCampaigns[e.campaign]).includes(word)));},[catalog,query,category,campaign]);
 const preferredId=(selected?.routeId===routeId?selected.id:null)??routeId??'bounty-the-stygian-lords';
 const filtering=!!query.trim()||category!=='all'||campaign!=='all';
 const selectedId=filtering&&!filtered.some(e=>e.id===preferredId)?filtered[0]?.id:preferredId;
 const entry=catalog?.find(e=>e.id===selectedId);
 const {data:quests,error:detailError}=useStaticJson<ZaishenQuest[]>(entry?`/data/zaishen/${entry.category}.json`:null);
 const quest=quests?.find(e=>e.id===selectedId);
 const visibleResults=filtered.slice(0,limit);
 const currentResult=filtered.find(e=>e.id===selectedId);
 if(currentResult&&!visibleResults.some(e=>e.id===selectedId))visibleResults.unshift(currentResult);
 const reset=()=>{setQuery('');setCategory('all');setCampaign('all');setLimit(20);};
 return <section id="lookup" className={styles.section} aria-labelledby="lookup-heading">
  <div className={styles.sectionTitle}><h2 id="lookup-heading">承戰任務速查</h2><span>查已接任務，不限今天</span></div>
  <p>貼上任務日誌的英文名稱，或搜尋中文、地點、頭目、獎勵與攻略內文。點選結果，直接查「去哪裡、打什麼、怎麼開始、能領多少」。</p>
  <div className={styles.lookupFilters}>
   <label className={styles.lookupSearch}>搜尋任務、地點或內文<input type="search" value={query} onChange={e=>{setQuery(e.target.value);setLimit(20);}} placeholder="例如 The Stygian Lords、悲傷冰谷、四名、光明使者"/></label>
   <label>任務類型<select aria-label="任務類型" value={category} onChange={e=>{setCategory(e.target.value);setLimit(20);}}><option value="all">所有類型</option>{Object.entries(zaishenCategories).map(([id,label])=><option key={id} value={id}>{label}</option>)}</select></label>
   <label>章節<select aria-label="章節" value={campaign} onChange={e=>{setCampaign(e.target.value);setLimit(20);}}><option value="all">所有章節</option>{Object.entries(zaishenCampaigns).map(([id,label])=><option key={id} value={id}>{label}</option>)}</select></label>
   <button type="button" onClick={reset}>清除篩選</button>
  </div>
  <p role="status">{catalog?`找到 ${filtered.length} / ${catalog.length} 個任務`:catalogError?'任務目錄載入失敗，請重新整理。':'正在載入任務目錄…'}</p>
  <div className={styles.lookupLayout}>
   <div className={styles.lookupResults} aria-label="速查搜尋結果">
    {visibleResults.map(e=><button type="button" key={e.id} aria-pressed={selectedId===e.id} onClick={()=>setSelected({id:e.id,routeId})}><span className={styles.lookupBadge}>{zaishenCategories[e.category]} · {zaishenCampaigns[e.campaign]}</span><strong>{e.zhTW}</strong>{e.zhTW!==e.en&&<small>{e.en}</small>}<span>地點：{e.area}</span></button>)}
    {catalog&&filtered.length===0&&<p>沒有符合的任務。可清除章節／類型篩選，或改用任務日誌的英文名稱。</p>}
    {filtered.length>limit&&<button type="button" className={styles.lookupMore} onClick={()=>setLimit(n=>n+20)}>再顯示 20 個結果</button>}
   </div>
   <article className={styles.lookupDetail} aria-label="選中任務詳情">
    {!quest?<p role="status">{detailError?'任務詳情載入失敗，請重新整理。':entry?'正在載入任務詳情…':catalog?'找不到這個任務，請從左側選擇。':'正在載入…'}</p>:<>
     <span className={styles.lookupBadge}>{zaishenCategories[quest.category]} · {zaishenCampaigns[quest.campaign]}</span>
     <h3>{quest.zhTW}</h3>{quest.en!==quest.zhTW&&<p className={styles.original}>{quest.en}</p>}
     <p className={styles.specific}><strong>去哪裡：</strong><LookupText text={quest.area}/><br/><strong>做什麼：</strong><LookupText text={quest.target}/></p>
     <h4>任務完成條件</h4><ol>{quest.conditions.map((text,i)=><li key={i}><LookupText text={text}/></li>)}</ol>
     <h4>怎麼開始・前往目標</h4><ol>{quest.steps.map((text,i)=><li key={i}><LookupText text={text}/></li>)}</ol>
     {quest.warnings.length>0&&<><h4>容易搞錯的地方</h4><ul>{quest.warnings.map((text,i)=><li key={i}><LookupText text={text}/></li>)}</ul></>}
     <h4>承戰任務獎勵</h4>
     <ul>{quest.rewards.experience>0&&<li>{quest.rewards.experience.toLocaleString('zh-TW')} 經驗值</li>}<li>{quest.rewards.gold.toLocaleString('zh-TW')} 金幣</li>{quest.rewards.points.map(p=><li key={p.label}>{p.amount.toLocaleString('zh-TW')} {p.label}</li>)}</ul>
     <table className={styles.rewardTable}><caption>承戰銅幣：基本與額外條件分開計算</caption><thead><tr><th>完成條件</th><th>銅幣</th></tr></thead><tbody>{quest.rewards.coins.map((coin,i)=><tr key={i}><td>{coin.label}{coin.label!=='基本目標'&&`：${quest.conditions[i]??''}`}</td><td>{coin.amount}</td></tr>)}<tr><th>全部條件達成時合計</th><td>{quest.rewards.totalCoins}</td></tr></tbody></table>
     <p className={styles.explainer}>以上是交付承戰任務的獎勵；關卡、地下城及區域內任務的獎勵另外計算。完成後向巴薩澤聖殿或登船海灘的 Zehnchu 領取，不會自動入帳。</p>
     <div className={styles.actions}>{quest.guideHref&&<Link href={quest.guideHref}>本站完整關卡攻略 →</Link>}<Link href={`/zaishen/?quest=${quest.id}#lookup`}>這個任務的速查連結</Link></div>
     <details className={styles.lookupSources}><summary>Wiki 參考資料</summary><ul>{quest.sources.map(source=><li key={source.url}><a href={source.url} target="_blank" rel="noopener noreferrer">{source.title}</a>{source.revision&&` · 修訂 ${source.revision}`}</li>)}</ul><p>攻略為 Wiki 資料的中文摘要與改寫；原頁貢獻者及修訂紀錄可由來源頁查看，依 GNU FDL 1.2 或更新版本保留來源。</p></details>
    </>}
   </article>
  </div>
 </section>;
}
