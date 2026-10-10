import fs from 'node:fs';
import path from 'node:path';
import {guideChecks} from '../src/lib/guide-audit';
import { missionSchema } from '../src/data/schemas/content';

const campaigns=['prophecies','factions','nightfall','eye-of-the-north'];
const expectedCounts:Record<string,number>={prophecies:25,factions:13,nightfall:20};
const auditDir='docs/content-audit';
fs.mkdirSync(auditDir,{recursive:true});
let failures=0;
const report:Record<string,unknown>={};
for(const campaign of campaigns){
  const dir=`src/data/${campaign}/missions`;
  const files=fs.existsSync(dir)?fs.readdirSync(dir).filter(f=>f.endsWith('.json')):[];
  const rows=[];let complete=0;
  const counts:Record<string,number>={};
  if(campaign in expectedCounts&&files.length!==expectedCounts[campaign]){
    failures++;console.error(`ERROR: ${campaign}: expected ${expectedCounts[campaign]} missions, found ${files.length}`);
  }
  for(const file of files){
    const raw=JSON.parse(fs.readFileSync(path.join(dir,file),'utf8'));
    const parsed=missionSchema.safeParse(raw);
    const errors:string[]=[];
    if(!parsed.success)errors.push('schema: '+parsed.error.issues.map(i=>i.path.join('.')).join(', '));
    const m=raw;
    const checks=parsed.success?guideChecks(parsed.data):{};
    for(const [key,ok] of Object.entries(checks))if(!ok){errors.push('missing/unverified '+key);counts[key]=(counts[key]??0)+1;}
    if(m.contentStatus!=='complete')errors.push('contentStatus incomplete');
    if(errors.length){failures++;console.error(`ERROR: ${campaign}/${m.id}\n  ${errors.join('\n  ')}`);}else complete++;
    const mark=(key:string)=>checks[key]?'✅':'❌';
    rows.push(`| ${m.name?.en??file} | ${mark('translation')} | ${mark('walkthrough')} | ${mark('bonus')} | ${mark('boss')} | ${mark('hm')} | ${mark('next')} | ${mark('wiki')} | ${errors.length?'❌':'✅'} |`);
  }
  if(!files.length){failures++;console.error(`ERROR: ${campaign}: no audited content inventory; zero entries does not mean complete`);}
  const heading=`# ${campaign} 資料查核\n\n${complete} / ${files.length} complete。${!files.length?'尚未建立完整內容清單；分母未確認，不能視為 0 / 0 完成。':''}\n\n`;
  fs.writeFileSync(`${auditDir}/${campaign==='eye-of-the-north'?'eotn':campaign}-audit.md`,heading+'| Mission | 中文已確認 | Walkthrough | Bonus/Master | Boss | HM | Next Step | Wiki Link | Complete |\n|---|---|---|---|---|---|---|---|---|\n'+rows.join('\n')+'\n');
  report[campaign]={total:files.length,expectedTotal:expectedCounts[campaign]??null,complete,incomplete:files.length-complete,missing:counts,inventoryVerified:files.length===expectedCounts[campaign]};
  console.log(`${campaign}: ${complete} / ${files.length} complete; ${JSON.stringify(counts)}`);
}
fs.writeFileSync(`${auditDir}/guide-results.json`,JSON.stringify(report,null,2)+'\n');
process.exitCode=failures?1:0;
