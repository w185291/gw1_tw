'use client';
import {useState} from 'react';
import styles from './Guide.module.css';
export function MissionChecklist({groups}:{groups:{title:string;items:string[]}[]}){
 const [checked,setChecked]=useState<Record<string,boolean>>({});
 return <div className={styles.checklists}>{groups.map((g,i)=><fieldset key={g.title}><legend>{g.title}</legend>{g.items.map((text,j)=>{const key=`${i}-${j}`;return <label key={key}><input type="checkbox" checked={!!checked[key]} onChange={e=>setChecked({...checked,[key]:e.target.checked})}/><span>{text}</span></label>;})}<p aria-live="polite">已勾選 {g.items.filter((_,j)=>checked[`${i}-${j}`]).length} / {g.items.length} · 手動記錄，仍以遊戲任務日誌為準</p></fieldset>)}</div>;
}
