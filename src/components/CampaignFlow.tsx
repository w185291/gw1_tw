import Link from 'next/link';
import type {Campaign,Mission} from '@/data/schemas/content';
import styles from './Guide.module.css';
export function CampaignFlow({campaign:c,missions}:{campaign:Campaign;missions:Mission[]}){
 if(c.structure!=='branched'||!missions.length)return null;
 if(c.id==='eye-of-the-north')return <section className={styles.flow}><h2>已整理的 Quest 流程</h2><p>極地之眼的 Asura、Ebon Vanguard、Norn 三方分支都要完成。Norn 內的熊與鴉路線也都要完成；下方目前列出已整理的序章與 Norn 攻略。</p><ol>{c.flow.map(node=>{const m=missions.find(m=>m.id===node.entry);return m&&<li key={node.entry}><strong>{node.branch}</strong><div><Link href={`/missions/view/?campaign=${c.id}&id=${m.id}`}>{m.name.zhTW}</Link>{node.requires.map(id=>{const previous=missions.find(m=>m.id===id);return previous&&<small key={id}>接續：{previous.name.zhTW}</small>;})}</div></li>;})}</ol></section>;
 const stages=[...new Set(missions.map(m=>m.storyStage))];
 return <section className={styles.flow}><h2>故事進度與分支</h2><p>{c.description} 同階段的分支只需完成其中一關即可前進。另一條路線可另外補打。</p><ol>{stages.map(stage=><li key={stage}><strong>階段 {stage}</strong><div>{missions.filter(m=>m.storyStage===stage).map(m=><Link key={m.id} href={`/missions/view/?campaign=${c.id}&id=${m.id}`}><span>{m.displayOrder} · {m.name.zhTW}</span>{m.branch&&<small>{m.branch}</small>}{m.requiredHeroes.map(h=><small key={h.id}>必要英雄：{h.name.zhTW}</small>)}</Link>)}</div></li>)}</ol>{c.id==='nightfall'&&<p>Margrid／Whispers首次招募互斥，影響第7及10階段；可與擁有所需英雄的玩家组隊補打，破關後可招另一位。第12階段兩路皆可做。外來角色由領事館碼頭接入；詳見該關入口。</p>}</section>;
}
