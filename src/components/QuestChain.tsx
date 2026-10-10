import type {Mission} from '@/data/schemas/content';
import styles from './Guide.module.css';
import {LocalizedText} from './LocalizedText';
export function QuestChain({quests}:{quests:Mission['primaryQuestBefore']}){return <ol className={styles.questChain}>{quests.map(q=><li key={q.url}><h3><a href={q.url+'?oldid='+q.revision} target="_blank" rel="noopener noreferrer"><LocalizedText text={q.name.zhTW}/></a>{q.optional&&'（可選支線）'}{q.questType==='secondary'&&'（銜接劇情的次要任務）'}</h3><p className={styles.questMeta}>接任務：<LocalizedText text={`${q.giver} · ${q.location}`}/></p><p><LocalizedText text={q.directions}/></p></li>)}</ol>;}
