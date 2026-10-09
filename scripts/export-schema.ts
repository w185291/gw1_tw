import fs from 'node:fs';
import path from 'node:path';
import {z} from 'zod';
import {campaignSchema,missionSchema,guideEntrySchema,heroSchema,extraGuideSchema} from '../src/data/schemas/content';
const dir=path.join(process.cwd(),'docs','schema');fs.mkdirSync(dir,{recursive:true});
for(const [name,schema] of [['campaign',campaignSchema],['mission',missionSchema],['guide-entry',guideEntrySchema],['hero',heroSchema],['extra-guide',extraGuideSchema]] as const)fs.writeFileSync(path.join(dir,`${name}.schema.json`),JSON.stringify(z.toJSONSchema(schema),null,2)+'\n');
console.log('Exported 5 JSON schemas.');
