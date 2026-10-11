'use client';
import {useState,type FormEvent} from 'react';
import styles from './TranslationReport.module.css';

const categories=[['npc','NPC／技能商人'],['quest','任務'],['skill','技能'],['location','地點'],['other','其他']] as const;

export function TranslationReportForm(){
 const [status,setStatus]=useState<'idle'|'sending'|'sent'|'error'>('idle');
 const [message,setMessage]=useState('');
 async function submit(event:FormEvent<HTMLFormElement>){
  event.preventDefault();
  const form=event.currentTarget;
  const values=new FormData(form);
  const payload=Object.fromEntries(['category','zhTW','en','note','pageUrl','website'].map(key=>[key,String(values.get(key)??'').trim()]));
  setStatus('sending');setMessage('');
  try{
   const response=await fetch('/api/translation-reports',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
   const result=await response.json() as {ok?:boolean;id?:string;error?:string};
   if(!response.ok||!result.ok)throw new Error(result.error??'回報失敗，請稍後再試。');
   setStatus('sent');setMessage(`已收到回報，編號：${result.id}。資料會先由站方核對，不會直接公開。`);form.reset();
  }catch(error){setStatus('error');setMessage(error instanceof Error?error.message:'回報失敗，請稍後再試。');}
 }
 return <form className={styles.form} onSubmit={submit}>
  <label>內容類別<select name="category" required defaultValue="npc">{categories.map(([id,label])=><option key={id} value={id}>{label}</option>)}</select></label>
  <div className={styles.pair}><label>遊戲內繁體中文名稱<input name="zhTW" required maxLength={120} autoComplete="off" placeholder="例如：米恩拉德"/></label><label>英文原名<input name="en" required maxLength={120} autoComplete="off" placeholder="例如：Meinrad"/></label></div>
  <label>本站相關頁面網址（選填）<input name="pageUrl" type="url" maxLength={500} placeholder="https://guild-wars.dataconnexai.com/skill-trainers/view/?id=meinrad"/></label>
  <label>補充說明或查證來源（選填）<textarea name="note" maxLength={1200} rows={4} placeholder="在哪個遊戲畫面看到？是否有 Wiki 或社群來源？"/></label>
  <label className={styles.honeypot} aria-hidden="true">網站欄位<input name="website" tabIndex={-1} autoComplete="off"/></label>
  <p>請勿填入帳號、密碼或個人資料。送出後會儲存在站方的待審回報紀錄，不會自動修改網站。</p>
  <button type="submit" disabled={status==='sending'}>{status==='sending'?'正在送出…':'送出翻譯回報'}</button>
  {message&&<p className={status==='error'?styles.error:styles.success} role="status">{message}</p>}
 </form>;
}
