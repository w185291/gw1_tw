import Link from 'next/link';
import professions from '@/data/professions.json';
import styles from '@/app/skills/SkillPage.module.css';

export type SkillAttributeLink = {id: string; zhTW: string; en: string};

export function SkillNavigation({professionId, attributes = [], attributeId}: {
  professionId?: string;
  attributes?: SkillAttributeLink[];
  attributeId?: string;
}) {
  const choices = [...professions.map(({id, zhTW, en}) => ({id, zhTW, en})), {id: 'common', zhTW: '共通', en: 'Common'}];
  return <div className={styles.skillNavigation}>
    <nav className={styles.navigationGroup} aria-label="選擇技能職業">
      <span className={styles.navigationLabel}>選擇職業</span>
      <div className={styles.navigationLinks}>
        {choices.map(p => <Link key={p.id} href={`/skills/professions/${p.id}/`} aria-current={p.id === professionId ? 'page' : undefined}>{p.zhTW}<small>{p.en}</small></Link>)}
      </div>
    </nav>
    {attributes.length > 0 && <nav className={styles.navigationGroup} aria-label="選擇技能屬性">
      <span className={styles.navigationLabel}>選擇屬性</span>
      <div className={styles.navigationLinks}>
        {attributes.map(a => <Link key={a.id} href={`/skills/attributes/view/?id=${a.id}${professionId ? `&profession=${professionId}` : ''}`} aria-current={a.id === attributeId ? 'page' : undefined}>{a.zhTW}<small>{a.en}</small></Link>)}
      </div>
    </nav>}
  </div>;
}
