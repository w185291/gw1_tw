import { spawnSync } from 'node:child_process';
import path from 'node:path';
const result=spawnSync(process.execPath,[path.resolve('node_modules/next/dist/bin/next'),'build','--webpack'],{stdio:'inherit',env:{...process.env,GW1_STATIC_EXPORT:'1'}});
process.exit(result.status??1);
