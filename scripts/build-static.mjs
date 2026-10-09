import { spawnSync } from 'node:child_process';
import path from 'node:path';
import {normalizeStaticSegments} from './normalize-static-segments.mjs';
const result=spawnSync(process.execPath,[path.resolve('node_modules/next/dist/bin/next'),'build','--webpack'],{stdio:'inherit',env:{...process.env,GW1_STATIC_EXPORT:'1'}});
if(result.status!==0)process.exit(result.status??1);
await normalizeStaticSegments();
