'use client';
import {useEffect,useState} from 'react';

const cache=new Map<string,unknown>();
export function useStaticJson<T>(url:string|null){
 const [result,setResult]=useState<{url:string;data:T|null;error:boolean}>({url:'',data:null,error:false});
 useEffect(()=>{
  if(!url)return;
  const cached=cache.get(url);
  if(cached){queueMicrotask(()=>setResult({url,data:cached as T,error:false}));return;}
  const controller=new AbortController();
  fetch(url,{signal:controller.signal}).then(response=>{
   if(!response.ok)throw new Error(`${response.status} ${url}`);
   return response.json() as Promise<T>;
  }).then(data=>{cache.set(url,data);setResult({url,data,error:false});}).catch(error=>{
   if(!controller.signal.aborted){console.error(error);setResult({url,data:null,error:true});}
  });
  return ()=>controller.abort();
 },[url]);
 return {data:result.url===url?result.data:null,error:result.url===url&&result.error,loading:!!url&&result.url!==url};
}
