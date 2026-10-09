import styles from './Guide.module.css';
export function Badge({children,tone='neutral'}:{children:React.ReactNode;tone?:'neutral'|'gold'|'blue'|'warning'}){return <span className={`${styles.badge} ${styles[tone]}`}>{children}</span>;}
