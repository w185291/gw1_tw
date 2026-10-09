import type {Mission} from '@/data/schemas/content';
import styles from './Guide.module.css';
export function QuestChain({quests}:{quests:Mission['primaryQuestBefore']}){return <ol className={styles.questChain}>{quests.map(q=><li key={q.url}><h3><a href={q.url+'?oldid='+q.revision} target="_blank" rel="noopener noreferrer">{q.name.zhTW}</a></h3><p className={styles.questMeta}>接任務：{q.giver} · {q.location}</p><p>{q.directions}</p>{q.translationStatus==='needs-review'&&<small>正式譯名待核，保留英文對照；流程已依原文整理。</small>}</li>)}</ol>;}
