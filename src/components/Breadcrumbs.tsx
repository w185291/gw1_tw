import Link from 'next/link';
import styles from './Site.module.css';
export function Breadcrumbs({items}:{items:{label:string;href?:string}[]}){return <nav aria-label="所在位置" className={styles.breadcrumbs}><ol>{items.map((item,i)=><li key={`${item.label}-${i}`}>{item.href?<Link href={item.href}>{item.label}</Link>:<span aria-current="page">{item.label}</span>}</li>)}</ol></nav>;}
