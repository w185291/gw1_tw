/** Editorial verification belongs in internal audits, not in public names. */
export const publicText=(text:string)=>text.replace(/[（(]繁中名稱待確認[）)]/g,'').trim();
