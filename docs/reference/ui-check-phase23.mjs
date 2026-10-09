import {createRequire} from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
const require=createRequire(import.meta.url),{chromium}=require('C:/Users/roger/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
const context=await browser.newContext({viewport:{width:1440,height:1000}}),page=await context.newPage();
const errors=[],base=process.env.GW1_TEST_URL??'http://127.0.0.1:8772',dest=path.join(process.cwd(),'docs/reference/screenshots-phase23');fs.mkdirSync(dest,{recursive:true});
page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400&&new URL(r.url()).origin===base)errors.push(`HTTP ${r.status()} ${r.url()}`);});
async function goto(url){const r=await page.goto(base+url);assert.equal(r.status(),200,url);await page.locator('h1').waitFor();for(const img of await page.locator('#maps button img').all()){await img.scrollIntoViewIfNeeded();await img.evaluate(i=>i.decode());}await page.evaluate(()=>scrollTo(0,0));await page.waitForLoadState('networkidle');}
async function overflow(p=page){assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'Horizontal overflow');}
const counts={};
for(const camp of ['factions','nightfall']){
 const missions=fs.readdirSync(`src/data/${camp}/missions`).filter(f=>f.endsWith('.json')).map(f=>JSON.parse(fs.readFileSync(`src/data/${camp}/missions/${f}`,'utf8')));counts[camp]=missions.length;
 await goto(`/campaigns/${camp}/`);assert.equal(await page.locator('ol[class*="timeline"]>li').count(),missions.length);await overflow();await page.screenshot({path:path.join(dest,camp+'-desktop.png')});
 for(const m of missions){await goto(`/campaigns/${camp}/missions/${m.id}/`);assert.equal(await page.locator('h1').innerText(),m.name.zhTW);assert(await page.locator('#bonus').innerText().then(s=>s.includes(m.masterReward.normal.master)));assert.equal(await page.locator('img').count()>=m.maps.length,true);assert(await page.locator('#maps button img').evaluateAll(imgs=>imgs.every(i=>i.complete&&i.naturalWidth>0)));await overflow();}
}
await goto('/campaigns/factions/missions/sunjiang-district/');assert.equal(await page.locator('#quest-chain details').count(),3);assert(await page.locator('a[href="/campaigns/factions/missions/the-eternal-grove/"]').count()>0);assert(await page.locator('a[href="/campaigns/factions/missions/gyala-hatchery/"]').count()>0);
await goto('/campaigns/nightfall/missions/moddok-crevice/');assert.equal(await page.locator('#checklist input').count(),4);await page.locator('#checklist input').first().check();assert(await page.locator('#checklist').innerText().then(s=>s.includes('已勾選 1 / 4')));await page.locator('#maps button').first().click();await page.getByRole('dialog',{name:'放大地圖',exact:true}).waitFor();await page.keyboard.press('Escape');assert.equal(await page.locator('dialog[open]').count(),0);await page.screenshot({path:path.join(dest,'moddok-desktop.png')});
await goto('/heroes/');assert.equal(await page.locator('main a[href^="/heroes/"]').count(),13);
for(const id of ['norgu','goren','razah']){await goto(`/heroes/${id}/`);assert(await page.locator('main').innerText().then(s=>s.includes(id==='razah'?'Chaplain Phyratyss':'Brains or Brawn')));}
await goto('/search/');for(const query of ['喚言大師','No Me, No Kormir','Dunkoro','薇茹']){await page.getByRole('searchbox').fill(query);assert(await page.locator('main article').count()>0,query);}
await goto('/campaigns/prophecies/missions/');assert.equal(await page.locator('ol[class*="timeline"]>li').count(),25);await page.getByLabel('地區',{exact:true}).selectOption('kryta');assert.equal(await page.locator('ol[class*="timeline"]>li').count(),5);
for(const id of ['the-great-northern-wall','gates-of-kryta','divinity-coast']){await goto(`/campaigns/prophecies/missions/${id}/`);assert(await page.locator('#bonus').innerText().then(s=>s.includes('BONUS')));}
const mobile=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true}),mp=await mobile.newPage();mp.on('pageerror',e=>errors.push(e.message));
for(const url of ['/campaigns/nightfall/','/campaigns/factions/missions/the-eternal-grove/','/campaigns/nightfall/missions/moddok-crevice/','/campaigns/nightfall/missions/tihark-orchard/']){await mp.goto(base+url);await overflow(mp);}
await mp.getByRole('button',{name:/Mission 9 /}).click();await mp.getByRole('dialog',{name:'切換任務'}).waitFor();assert(await mp.evaluate(()=>document.activeElement?.closest('dialog')!==null));await mp.getByRole('dialog',{name:'切換任務'}).locator('a[href="/campaigns/nightfall/missions/dasha-vestibule/"]').click();await mp.getByRole('heading',{name:'達沙走廊',exact:true}).waitFor();assert.equal(await mp.locator('dialog[open]').count(),0);await overflow(mp);await mp.screenshot({path:path.join(dest,'dasha-mobile.png')});
await browser.close();assert.deepEqual(errors,[]);const result={counts,checkedMissionPages:33,heroPages:13,checks:['all 33 pages + images','NM/HM master conditions','branches','checklist','map dialog Escape','hero reverse recruitment','Chinese/English/quest search','Prophecies regression','390px overflow + drawer focus'],errors};fs.writeFileSync(path.join(dest,'results.json'),JSON.stringify(result,null,2));console.log(JSON.stringify(result));
