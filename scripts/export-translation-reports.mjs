import fs from 'node:fs/promises';
import path from 'node:path';

const {CLOUDFLARE_API_TOKEN:token,CLOUDFLARE_ACCOUNT_ID:account,CLOUDFLARE_REPORTS_KV_NAMESPACE_ID:namespace}=process.env;
if(!token||!account||!namespace){console.error('Set CLOUDFLARE_API_TOKEN, CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_REPORTS_KV_NAMESPACE_ID.');process.exit(1);}
const base=`https://api.cloudflare.com/client/v4/accounts/${encodeURIComponent(account)}/storage/kv/namespaces/${encodeURIComponent(namespace)}`;
const headers={Authorization:`Bearer ${token}`};
const reports=[];
let cursor='';
do{
 const url=new URL(`${base}/keys`);url.searchParams.set('prefix','report:');url.searchParams.set('limit','1000');if(cursor)url.searchParams.set('cursor',cursor);
 const response=await fetch(url,{headers});if(!response.ok)throw new Error(`KV key listing failed: HTTP ${response.status}`);
 const page=await response.json();if(!page.success)throw new Error('KV key listing failed.');
 for(const key of page.result??[]){
  const value=await fetch(`${base}/values/${encodeURIComponent(key.name)}`,{headers});
  if(!value.ok)throw new Error(`KV value fetch failed: HTTP ${value.status}`);
  reports.push(await value.json());
 }
 cursor=page.result_info?.cursor??'';
}while(cursor);
reports.sort((a,b)=>a.createdAt.localeCompare(b.createdAt));
const dir=path.resolve('private-reports');await fs.mkdir(dir,{recursive:true});
const file=path.join(dir,`translation-reports-${new Date().toISOString().slice(0,10)}.json`);
await fs.writeFile(file,JSON.stringify(reports,null,2)+'\n');
console.log(`Exported ${reports.length} reports to ${file}`);
