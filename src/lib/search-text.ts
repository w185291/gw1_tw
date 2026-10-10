import characterTerms from '../data/terminology/characters.json';
import clientTerms from '../data/terminology/game-client.json';
import skillTerms from '../data/terminology/skills.json';
const terms=[...new Map([...clientTerms,...skillTerms,...characterTerms].map(t=>[t.en.toLowerCase(),t])).values()];

const translations=new Map(terms.map(t=>[t.en.toLowerCase(),t.zhTW]));
const escape=(text:string)=>text.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
const pattern=new RegExp(`(?<![A-Za-z])(${terms.filter(t=>t.en.length>=3).sort((a,b)=>b.en.length-a.en.length).map(t=>escape(t.en)).join('|')})(?![A-Za-z])`,'g');
export const normalizeSearch=(text:string)=>text.normalize('NFKC').trim().toLowerCase().replace(/[’‘]/g,"'");
/** Include verified Chinese terms even when prose preserves the English original. */
export function searchableText(values:string[]):string {
  const text=values.join(' ');
  const localized=text.replace(pattern,en=>translations.get(en.toLowerCase())??en);
  return normalizeSearch(text+' '+localized);
}
