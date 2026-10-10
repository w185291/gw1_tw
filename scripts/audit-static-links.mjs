import fs from 'node:fs';
import path from 'node:path';

const root=path.resolve('out');
const htmlFiles=[];
function walk(directory){
 for(const item of fs.readdirSync(directory,{withFileTypes:true})){
  const file=path.join(directory,item.name);
  if(item.isDirectory())walk(file);
  else if(item.name.endsWith('.html'))htmlFiles.push(file);
 }
}
walk(root);
const missing=new Map();
for(const file of htmlFiles){
 const html=fs.readFileSync(file,'utf8');
 for(const match of html.matchAll(/<a\b[^>]*\bhref="([^"]+)"/g)){
  const href=match[1].replaceAll('&amp;','&');
  if(!href.startsWith('/')||href.startsWith('//'))continue;
  const pathname=decodeURIComponent(new URL(href,'https://example.test').pathname);
  const target=path.join(root,pathname);
  if(fs.existsSync(path.join(target,'index.html'))||fs.existsSync(target)||fs.existsSync(`${target}.html`))continue;
  const references=missing.get(pathname)??[];
  references.push(path.relative(root,file));
  missing.set(pathname,references);
 }
}
for(const [url,references] of missing)console.error(`${url} <- ${references.join(', ')}`);
console.log(`${htmlFiles.length} HTML pages checked; ${missing.size} missing internal destinations.`);
if(missing.size)process.exitCode=1;
