'use client';
import {useState} from 'react';
import type {Skill} from '@/data/schemas/skills';
import {LocalizedText} from './LocalizedText';
import styles from './Skills.module.css';
export function SkillEffects({skill:s}:{skill:Skill}){
 const [pvp,setPvp]=useState(false);const variant=s.pvpVariants[0];const effect=pvp&&variant?variant.description:s.description.pve;
 const energy=pvp&&variant?(variant.stats.Energy??0):s.cost.energy,activation=pvp&&variant?(variant.stats.Activation??0):s.activation,recharge=pvp&&variant?(variant.stats.Recharge??0):s.recharge;
 return <><div className={styles.tabs}><button aria-pressed={!pvp} onClick={()=>setPvp(false)}>{s.pvpOnly?'Codex PvP':'PvE'}</button>{variant&&<button aria-pressed={pvp} onClick={()=>setPvp(true)}>PvP</button>}</div><div className={styles.facts}><span>能量 {energy}</span><span>施法 {activation} 秒</span><span>{s.rechargeNote?s.rechargeNote:`冷卻 ${recharge} 秒`}</span>{s.cost.upkeep!==0&&<span>維持：能量再生 {s.cost.upkeep}</span>}{s.cost.adrenaline>0&&<span>怒氣 {s.cost.adrenaline}</span>}{s.cost.sacrifice>0&&<span>犧牲體力 {s.cost.sacrifice}%</span>}{s.cost.overcast>0&&<span>超載 {s.cost.overcast}</span>}</div><p className={styles.effect}><LocalizedText text={effect.zhTW}/></p><p className={styles.english}>{effect.en}</p><small>一般屬性技能的繁中數值範圍為 0～15，英文通常列 0／12／15；稱號技能依稱號等級計算，固定效果不受屬性影響。</small></>;
}
