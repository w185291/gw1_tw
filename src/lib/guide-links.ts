export const missionHref=(campaign:string,id:string)=>`/missions/view/?campaign=${encodeURIComponent(campaign)}&id=${encodeURIComponent(id)}`;
export const heroHref=(id:string)=>`/heroes/view/?id=${encodeURIComponent(id)}`;
export const guideHref=(id:string)=>`/guides/view/?id=${encodeURIComponent(id)}`;
export const attributeHref=(id:string)=>`/skills/attributes/view/?id=${encodeURIComponent(id)}`;
