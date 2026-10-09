import fs from 'node:fs/promises';
import path from 'node:path';
// Next 16.4 export uses path.relative(), but its static filename encoder replaces
// only POSIX slashes. Windows therefore emits directories where the browser
// requests dotted RSC filenames. Add correctly encoded copies; keep originals.
export async function normalizeStaticSegments(root=path.resolve('out')){
 let count=0;
 async function flatten(dir,base){for(const item of await fs.readdir(dir,{withFileTypes:true})){
  const file=path.join(dir,item.name);
  if(item.isDirectory())await flatten(file,base);
  else if(item.name.endsWith('.txt')){const name=path.relative(base,file).split(path.sep).join('.');await fs.copyFile(file,path.join(base,name));count++;}
 }}
 async function visit(dir){for(const item of await fs.readdir(dir,{withFileTypes:true})){
  if(!item.isDirectory())continue;const child=path.join(dir,item.name);
  if(item.name.startsWith('__next.'))await flatten(child,dir);else await visit(child);
 }}
 await visit(root);console.log(`Static RSC compatibility: ${count} dotted segment files added.`);return count;
}
