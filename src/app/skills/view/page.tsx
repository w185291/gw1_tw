import {Suspense} from 'react';
import {SkillViewer} from '@/components/SkillViewer';
export const metadata={title:'技能詳細資料'};
export default function Page(){return <Suspense fallback={<p role="status">正在載入技能資料…</p>}><SkillViewer/></Suspense>;}
