import {Suspense} from 'react';
import {MissionViewer} from '@/components/MissionViewer';
export const metadata={title:'主線攻略'};
export default function Page(){return <Suspense fallback={<p role="status">正在載入攻略…</p>}><MissionViewer/></Suspense>;}
