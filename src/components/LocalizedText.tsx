import characterTerms from '@/data/terminology/characters.json';
import {publicText} from '@/lib/presentation';
import clientTerms from '@/data/terminology/game-client.json';
import skillTerms from '@/data/terminology/skills.json';
const terms=[...new Map([...clientTerms,...skillTerms,...characterTerms].map(t=>[t.en.toLowerCase(),t])).values()];

const entries=terms.filter(t=>t.en.length>=3&&t.en!==t.zhTW).sort((a,b)=>b.en.length-a.en.length);
const names=new Map(entries.map(t=>[t.en,t.zhTW]));
const escape=(s:string)=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
const pattern=new RegExp(`(?<![A-Za-z])(${entries.map(t=>escape(t.en)).join('|')})(?![A-Za-z])`,'g');
/** Show verified client names alongside English without rewriting stored source prose. */
export function LocalizedText({text}:{text:string}){
  const parts=publicText(text).split(pattern);
  return <>{parts.map((part,i)=>names.has(part)?<span key={i} title="繁中名稱對照">{names.get(part)}（{part}）</span>:part)}</>;
}
