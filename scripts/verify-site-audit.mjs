import {createRequire} from 'node:module';
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
const require=createRequire('C:/Users/roger/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/package.json');
const {chromium}=require('playwright');
const base=process.env.GW1_PREVIEW_URL??'http://127.0.0.1:8765';
const output='docs/qa/20261010-audit';await fs.mkdir(output,{recursive:true});
const campaigns=['prophecies','factions','nightfall','eye-of-the-north'];
const all=[];for(const c of campaigns)for(const file of await fs.readdir(`src/data/${c}/missions`))if(file.endsWith('.json'))all.push(JSON.parse(await fs.readFile(`src/data/${c}/missions/${file}`,'utf8')));
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
const page=await browser.newPage({viewport:{width:1365,height:950}});
const errors=[];page.on('pageerror',error=>errors.push(error.message));
const results={routes:[],filters:[],maps:[],mobile:[],search:[]};
const normalize=s=>s.normalize('NFKC').trim().toLowerCase().replace(/[’‘]/g,"'");
async function checkCards(expected,label){
 const ids=expected.map(m=>m.id).sort();
 await page.waitForFunction(expected=>{
  const found=[...document.querySelectorAll('ol li h2 a')].map(a=>a.getAttribute('href').split('/').filter(Boolean).at(-1)).sort();
  return JSON.stringify(found)===JSON.stringify(expected);
 },ids);
 assert.equal(await page.locator('ol li h2 a').count(),ids.length,label);
 results.filters.push({label,count:ids.length});
}
try{
 await page.goto(base+'/',{waitUntil:'networkidle'});
 assert.equal(await page.locator('a[href="/campaigns/prophecies/missions/gates-of-kryta/"]').innerText(),'科瑞塔關所');
 for(const c of campaigns){
  const entries=all.filter(m=>m.campaign===c);
  const response=await page.goto(`${base}/campaigns/${c}/missions/`,{waitUntil:'networkidle'});assert.equal(response.status(),200);
  await checkCards(entries,`${c}: all`);assert.equal(await page.getByRole('combobox',{name:'NM 難度'}).count(),0);
  assert.ok(!(await page.locator('main').innerText()).includes('查核未完成'));
  for(const region of [...new Set(entries.map(m=>m.region))]){
   await page.getByRole('combobox',{name:'地區',exact:true}).selectOption(region);await checkCards(entries.filter(m=>m.region===region),`${c}: region ${region}`);
  }
  await page.getByRole('button',{name:'重設篩選'}).click();
  for(const type of ['cooperative-mission','primary-quest','dungeon','story-quest','elite-mission','challenge-mission','competitive-mission']){
   await page.getByRole('combobox',{name:'任務型別'}).selectOption(type);await checkCards(entries.filter(m=>m.type===type),`${c}: type ${type}`);
  }
  await page.getByRole('button',{name:'重設篩選'}).click();
  for(const mode of ['normal','hard']){
   await page.getByRole('combobox',{name:'模式',exact:true}).selectOption(mode);await checkCards(entries.filter(m=>m.modes[mode]),`${c}: ${mode}`);
  }
  await page.getByRole('button',{name:'重設篩選'}).click();
  for(const bonus of ['yes','no']){
   await page.getByRole('combobox',{name:'Bonus',exact:true}).selectOption(bonus);await checkCards(entries.filter(m=>Boolean(m.bonus.available||m.masterReward)===(bonus==='yes')),`${c}: bonus ${bonus}`);
  }
  await page.getByRole('button',{name:'重設篩選'}).click();
  const keyword=`  ${entries[0].name.en.toUpperCase().replace(/'/g,'’')}  `;
  await page.getByRole('searchbox',{name:'搜尋關卡'}).fill(keyword);
  await checkCards(entries.filter(m=>normalize([m.name.zhTW,m.name.en,...m.aliases,...m.tags,...m.requiredHeroes.flatMap(h=>[h.name.en,h.name.zhTW])].join(' ')).includes(normalize(keyword))),`${c}: normalized query`);
  await page.getByRole('combobox',{name:'模式',exact:true}).selectOption('hard');
  await checkCards(entries.filter(m=>m.modes.hard&&normalize([m.name.zhTW,m.name.en,...m.aliases,...m.tags].join(' ')).includes(normalize(keyword))),`${c}: combined query + HM`);
  await page.getByRole('button',{name:'重設篩選'}).click();await checkCards(entries,`${c}: reset`);
 }
 for(const m of all){
  const url=`/campaigns/${m.campaign}/missions/${m.id}/`;
  const response=await page.goto(base+url,{waitUntil:'domcontentloaded'});assert.equal(response.status(),200,url);
  assert.equal(await page.locator('h1').innerText(),m.name.zhTW.replace(/[（(]繁中名稱待確認[）)]/g,'').trim());
  const header=await page.locator('article header').innerText();assert.ok(!header.includes('查核未完成'),url);
  const badges=await page.locator('article header [class*=badge]').allTextContents();
  assert.equal(badges.includes('HM'),m.modes.hard,url+' HM badge');assert.equal(badges.includes('NM'),m.modes.normal,url+' NM badge');
  if(['blood-washes-blood','a-gate-too-far'].includes(m.id))assert.ok((await page.locator('nav[aria-label="前後關卡"]').innerText()).includes('下一步：總覽回報'));
  const broken=await page.locator('article a[href^="#"]').evaluateAll(links=>links.map(a=>a.getAttribute('href')).filter(href=>!document.getElementById(href.slice(1))));assert.deepEqual(broken,[],url+' section links');
  assert.ok(!(await page.locator('article').innerText()).includes('繁中名稱待確認'));
  results.routes.push({path:url,status:200});
 }
 const maps=[...new Set(all.flatMap(m=>m.maps.map(map=>map.src)))];
 for(const src of maps){const response=await page.request.get(base+src);assert.equal(response.status(),200,src);assert.ok((await response.body()).length>100);results.maps.push(src);}
 await page.goto(base+'/search/',{waitUntil:'networkidle'});
 for(const query of ['神聖沙灘','  CURSE OF THE NORNBEAR  ','唐克羅',"Gunnar’s Hold"]){
  await page.getByRole('searchbox',{name:'搜尋攻略'}).fill(query);
  await page.waitForFunction(()=>document.querySelectorAll('article h2 a').length>0);
  const labels=await page.locator('article').allTextContents();assert.ok(labels.every(text=>!text.includes('查核未完成')));results.search.push({query,count:labels.length});
 }
 await page.setViewportSize({width:375,height:812});
 for(const route of ['/campaigns/eye-of-the-north/missions/','/campaigns/eye-of-the-north/missions/curse-of-the-nornbear/','/campaigns/eye-of-the-north/missions/northern-allies/','/search/']){
  await page.goto(base+route,{waitUntil:'networkidle'});const width=await page.evaluate(()=>document.documentElement.scrollWidth);assert.ok(width<=375,route+' overflow '+width);results.mobile.push({path:route,width});
 }
 await page.goto(base+'/campaigns/eye-of-the-north/missions/curse-of-the-nornbear/',{waitUntil:'networkidle'});
 await page.getByRole('button',{name:/任務 .*諾恩熊/}).click();await page.getByRole('dialog',{name:'切換任務'}).getByRole('button',{name:'關閉關卡選單'}).click();
 await page.locator('figure button').first().scrollIntoViewIfNeeded();await page.locator('figure button').first().click();await page.getByRole('dialog',{name:'放大地圖'}).getByRole('button',{name:'關閉',exact:true}).click();
 await page.screenshot({path:path.join(output,'eotn-mobile.png'),fullPage:true});
 assert.deepEqual(errors,[],'browser errors');
 await fs.writeFile(path.join(output,'results.json'),JSON.stringify({...results,pageErrors:errors},null,2));
 console.log(`Passed: ${results.routes.length} guide routes, ${results.filters.length} filter cases, ${results.maps.length} map files, ${results.search.length} queries, mobile menus and map dialog.`);
}catch(error){
 await fs.writeFile(path.join(output,'failed-results.json'),JSON.stringify({...results,pageErrors:errors,error:String(error)},null,2));
 throw error;
}finally{await browser.close();}
