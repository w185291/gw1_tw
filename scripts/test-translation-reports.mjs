import assert from 'node:assert/strict';
import {test} from 'node:test';
import {onRequestGet,onRequestPost} from '../functions/api/translation-reports.js';

const origin='https://guild-wars.dataconnexai.com';
function context(payload,store=new Map(),headers={}){
 const kv={get:async key=>store.get(key)??null,put:async(key,value)=>{store.set(key,value);}};
 return {request:new Request(`${origin}/api/translation-reports`,{method:'POST',headers:{Origin:origin,'Content-Type':'application/json','CF-Connecting-IP':'192.0.2.1',...headers},body:JSON.stringify(payload)}),env:{REPORTS_KV:kv},store};
}
const valid={category:'npc',zhTW:'米恩拉德',en:'Meinrad',note:'遊戲內技能導師',pageUrl:`${origin}/skill-trainers/view/?id=meinrad`,website:''};

test('stores private JSON and throttles repeat submissions',async()=>{
 const ctx=context({...valid,note:'遊戲內技能導師\n第二行查證說明'});
 assert.equal((await onRequestPost(ctx)).status,201);
 const saved=[...ctx.store.entries()].find(([key])=>key.startsWith('report:'));
 assert.equal(JSON.parse(saved[1]).zhTW,'米恩拉德');
 assert.equal((await onRequestPost(context(valid,ctx.store))).status,429);
 assert.equal((await onRequestGet()).status,405);
});
test('rejects cross-origin and invalid submissions',async()=>{
 assert.equal((await onRequestPost(context(valid,new Map(),{Origin:'https://other.example'}))).status,403);
 assert.equal((await onRequestPost(context({...valid,zhTW:''}))).status,400);
 assert.equal((await onRequestPost(context({...valid,pageUrl:'https://other.example/'}))).status,400);
});
test('honeypot does not store a report',async()=>{
 const ctx=context({...valid,website:'spam'});
 assert.equal((await onRequestPost(ctx)).status,201);
 assert.equal(ctx.store.size,0);
});
