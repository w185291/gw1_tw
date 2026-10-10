'use client';
import Link from 'next/link';
import {useSearchParams} from 'next/navigation';
import type {Campaign,Mission} from '@/data/schemas/content';
import {useStaticJson} from '@/lib/use-static-json';
import {MissionDetailTemplate} from '@/templates/MissionDetailTemplate';

const campaignIds=new Set(['prophecies','factions','nightfall','eye-of-the-north']);
export function MissionViewer(){
 const params=useSearchParams();
 const campaignId=params.get('campaign')??'',id=params.get('id')??'';
 const valid=campaignIds.has(campaignId)&&/^[a-z0-9-]+$/.test(id);
 const {data,error}=useStaticJson<{campaign:Campaign;missions:Mission[]}>(valid?`/data/guide-content/missions/${campaignId}.json`:null);
 if(!valid)return <p>找不到攻略。<Link href="/campaigns/">返回章節列表</Link></p>;
 if(error)return <p>攻略資料載入失敗，請重新整理頁面。</p>;
 const mission=data?.missions.find(m=>m.id===id);
 if(!data)return <p role="status">正在載入攻略…</p>;
 if(!mission)return <p>找不到攻略。<Link href={`/campaigns/${campaignId}/missions/`}>返回任務列表</Link></p>;
 return <MissionDetailTemplate key={`${campaignId}/${id}`} mission={mission} campaign={data.campaign} missions={data.missions}/>;
}
