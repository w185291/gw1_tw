import media from '@/data/media/portraits.json';
import professions from '@/data/professions.json';

export type Portrait = {
  src: string;
  sourceUrl: string;
  sourceType: 'wiki';
  credit: string;
  licenseStatus: 'verified' | 'fan-use' | 'needs-review';
};

const portraits = media as {
  heroes: Record<string, Portrait>;
  heroFull: Record<string, Portrait>;
  professions: Record<string, Portrait>;
};

export function heroPortrait(id: string, large = false): Portrait | undefined {
  return large ? portraits.heroFull[id] ?? portraits.heroes[id] : portraits.heroes[id] ?? portraits.heroFull[id];
}

export function professionPortrait(id: string): Portrait | undefined {
  return portraits.professions[id];
}

export function professionIdForLabel(label?: string): string | undefined {
  return professions.find((entry) => entry.zhTW === label || entry.en === label || entry.id === label)?.id;
}
