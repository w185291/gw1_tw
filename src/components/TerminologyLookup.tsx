'use client';
import {useMemo,useState} from 'react';
import {useStaticJson} from '@/lib/use-static-json';
import styles from './TerminologyLookup.module.css';

type Term={en:string;zhTW:string;source:string;evidence:string[]};
export function TerminologyLookup(){
 const [query,setQuery]=useState('');
 const {data,error}=useStaticJson<Term[]>('/data/guide-content/glossary.json');
 const results=useMemo(()=>{
  const needle=query.normalize('NFKC').trim().toLocaleLowerCase();
  if(!needle||!data)return [];
  return data.filter(term=>`${term.en} ${term.zhTW}`.normalize('NFKC').toLocaleLowerCase().includes(needle)).slice(0,100);
 },[data,query]);
 return <div className={styles.lookup}><label htmlFor="term-search">輸入遊戲中的英文或繁體中文名稱</label><input id="term-search" type="search" value={query} onChange={event=>setQuery(event.target.value)} placeholder="例如 Hall of Monuments、史蹟殿堂、Goren" autoComplete="off"/>
  <p aria-live="polite">{error?'詞庫載入失敗，請重新整理。':!data?'載入中…':!query.trim()?`已載入 ${data.length.toLocaleString('zh-TW')} 筆可查對照，輸入關鍵字開始搜尋。`:results.length?`顯示前 ${results.length} 筆符合名稱。`:'找不到完全對照；可能尚未擷取到該名稱。'}</p>
  {results.length>0&&<div className={styles.tableWrap}><table><thead><tr><th>遊戲英文</th><th>遊戲繁中</th><th>核對依據</th></tr></thead><tbody>{results.map(term=><tr key={term.en}><td>{term.en}</td><td>{term.zhTW}</td><td>{term.source}<small>{term.evidence.join('、')}</small></td></tr>)}</tbody></table></div>}
 </div>;
}
