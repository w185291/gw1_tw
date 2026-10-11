const json=(body,status)=>new Response(JSON.stringify(body),{status,headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
const clean=(value,max,multiline=false)=>typeof value==='string'&&value.length<=max&&!(multiline?/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/:/[\u0000-\u001f\u007f]/).test(value)?value.trim():null;
const categories=new Set(['npc','quest','skill','location','other']);

export async function onRequestPost({request,env}){
 const origin=new URL(request.url).origin;
 if(request.headers.get('Origin')!==origin)return json({error:'來源不符，請從本站表單提交。'},403);
 if(!request.headers.get('Content-Type')?.startsWith('application/json'))return json({error:'資料格式不正確。'},415);
 if(Number(request.headers.get('Content-Length')??0)>8192)return json({error:'內容太長。'},413);
 if(!env.REPORTS_KV)return json({error:'回報服務尚未設定，請稍後再試。'},503);
 let input;
 try{const body=await request.text();if(new TextEncoder().encode(body).length>8192)return json({error:'內容太長。'},413);input=JSON.parse(body);}catch{return json({error:'無法讀取回報資料。'},400);}
 if(!input||typeof input!=='object'||Array.isArray(input))return json({error:'資料格式不正確。'},400);
 if(input.website)return json({ok:true},201); // Honeypot: do not store bot submissions.
 const category=clean(input.category,20),zhTW=clean(input.zhTW,120),en=clean(input.en,120),note=clean(input.note??'',1200,true),pageUrl=clean(input.pageUrl??'',500);
 if(!categories.has(category)||!zhTW||!en||note===null||pageUrl===null)return json({error:'請填寫有效的中文、英文名稱與類別。'},400);
 if(pageUrl){try{const url=new URL(pageUrl);if(url.origin!==origin||!['http:','https:'].includes(url.protocol))return json({error:'本站頁面網址不正確。'},400);}catch{return json({error:'本站頁面網址不正確。'},400);}}
 const ip=request.headers.get('CF-Connecting-IP')??'';
 if(!ip)return json({error:'無法驗證連線來源，請稍後再試。'},400);
 const digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(ip));
 const rateKey='rate:'+Array.from(new Uint8Array(digest),byte=>byte.toString(16).padStart(2,'0')).join('');
 try{
  if(await env.REPORTS_KV.get(rateKey))return json({error:'提交太頻繁，請稍後再試。'},429);
  const id=crypto.randomUUID();
  const report={id,createdAt:new Date().toISOString(),status:'pending',category,zhTW,en,note,pageUrl};
  await env.REPORTS_KV.put(`report:${report.createdAt}:${id}`,JSON.stringify(report));
  await env.REPORTS_KV.put(rateKey,'1',{expirationTtl:60});
  return json({ok:true,id},201);
 }catch{return json({error:'暫時無法儲存回報，請稍後再試。'},503);}
}

export function onRequestGet(){return json({error:'回報資料不對外公開。'},405);}
