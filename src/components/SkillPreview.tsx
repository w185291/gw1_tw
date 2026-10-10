'use client';
import {createPortal} from 'react-dom';
import type {SkillCatalogEntry} from '@/lib/skill-catalog';
import styles from './Skills.module.css';

export type SkillPreviewState={skill:SkillCatalogEntry;x:number;y:number};

export function SkillPreview({preview}:{preview:SkillPreviewState|null}){
 if(!preview)return null;
 const {skill,x,y}=preview;
 const above=y>window.innerHeight/2;
 const style={left:Math.min(Math.max(8,x+14),Math.max(8,window.innerWidth-360)),
  ...(above?{bottom:window.innerHeight-y+12}:{top:y+12})};
 return createPortal(<div id="skill-preview-tooltip" role="tooltip" className={styles.skillPreview} style={style}>
  <div className={styles.previewHeading}><strong>{skill.name.zhTW}</strong><span>{skill.cost.energy} 能量 · {skill.activation} 秒施展 · {skill.rechargeNote||`${skill.recharge} 秒冷卻`}</span></div>
  <p className={styles.previewEnglish}>{skill.name.en}</p>
  <p>{skill.previewDescription}</p>
  <p className={styles.previewMeta}>屬性：{skill.attribute.zhTW} · {skill.type.zhTW}{skill.elite?' · 菁英技能':''}{skill.pvpOnly?' · PvP 版':''}</p>
  {(skill.cost.adrenaline>0||skill.cost.sacrifice>0||skill.cost.overcast>0||skill.cost.upkeep!==0)&&<p className={styles.previewMeta}>{[
   skill.cost.adrenaline>0?`怒氣 ${skill.cost.adrenaline}`:null,
   skill.cost.sacrifice>0?`犧牲 ${skill.cost.sacrifice}% 體力`:null,
   skill.cost.overcast>0?`過度施法 ${skill.cost.overcast}`:null,
   skill.cost.upkeep!==0?`維持消耗 ${Math.abs(skill.cost.upkeep)}`:null,
  ].filter(Boolean).join(' · ')}</p>}
 </div>,document.body);
}
