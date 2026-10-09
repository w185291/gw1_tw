import {notFound} from 'next/navigation';
import {getMissions,getCampaign,getMission} from '@/lib/content';
import {pageMetadata} from '@/lib/metadata';
import {MissionDetailTemplate} from '@/templates/MissionDetailTemplate';
export const dynamicParams=false;
export function generateStaticParams(){return getMissions().map(m=>({campaign:m.campaign,mission:m.id}));}
export async function generateMetadata({params}:{params:Promise<{campaign:string;mission:string}>}){const {campaign,mission}=await params;const m=getMission(campaign,mission);const c=getCampaign(campaign);if(!m||!c)notFound();return pageMetadata(`${m.name.zhTW}攻略・${c.name.zhTW}`,`${m.name.en} 主線、Bonus、NM/HM、地圖與注意事項。${m.status==='draft'?'攻略內容待整理。':m.summary}`,`/campaigns/${campaign}/missions/${mission}/`);}
export default async function MissionPage({params}:{params:Promise<{campaign:string;mission:string}>}){const {campaign,mission}=await params;const m=getMission(campaign,mission);const c=getCampaign(campaign);if(!m||!c)notFound();return <MissionDetailTemplate mission={m} campaign={c} missions={getMissions(campaign)}/>;}
