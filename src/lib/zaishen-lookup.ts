export type ZaishenCategory='mission'|'bounty'|'vanquish'|'combat';
export type ZaishenCatalogEntry={id:string;category:ZaishenCategory;en:string;zhTW:string;campaign:string;area:string;target:string;searchText:string};
export type ZaishenQuest=Omit<ZaishenCatalogEntry,'searchText'>&{
 region:string;conditions:string[];steps:string[];warnings:string[];
 rewards:{experience:number;gold:number;points:{label:string;amount:number}[];coins:{label:string;amount:number}[];totalCoins:number};
 guideHref:string|null;sources:{title:string;url:string;revision:number|null}[];checkedAt:string;
};
export const zaishenCategories={mission:'承戰主線',bounty:'承戰懸賞',vanquish:'承戰清圖',combat:'承戰競技'};
export const zaishenCampaigns:Record<string,string>={prophecies:'第一章・阿斯卡隆戰記',factions:'第二章・盟與敵',nightfall:'第三章・黑暗逆襲','eye-of-the-north':'極地之眼',core:'跨章節／戰鬥群島'};
export const zaishenQuestId=(category:ZaishenCategory,en:string)=>category+'-'+en.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
