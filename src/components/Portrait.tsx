import Image from 'next/image';
import {heroPortrait, professionIdForLabel, professionPortrait} from '@/lib/portraits';
import styles from './Portrait.module.css';

export function Portrait({kind, id, name, profession, large = false}: {
  kind: 'hero' | 'profession'; id: string; name: string; profession?: string; large?: boolean;
}) {
  const source = kind === 'hero' ? heroPortrait(id, large) : professionPortrait(id);
  const fallbackIcon = kind === 'hero' ? professionPortrait(professionIdForLabel(profession) ?? '') : undefined;
  const visibleSource = source?.src && (source.licenseStatus === 'verified' || source.licenseStatus === 'fan-use') ? source : fallbackIcon?.licenseStatus === 'verified' ? fallbackIcon : undefined;
  const className = `${styles.portrait} ${kind === 'hero' ? (large ? styles.largeHero : styles.hero) : (large ? styles.largeProfession : styles.profession)}`;
  return <div className={className}>
    {visibleSource
      ? <Image src={visibleSource.src} width={large ? 280 : 110} height={large ? 280 : 110} sizes={large ? '(max-width: 700px) 220px, 280px' : '110px'} alt={kind === 'hero' && visibleSource === source ? `${name}的角色圖像` : `${name}${profession ? `的${profession}` : ''}職業圖示`} loading="lazy"/>
      : <span aria-label={`${name}圖像待補`}>{name.slice(0, 1)}</span>}
  </div>;
}
