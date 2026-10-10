import {createRequire} from 'node:module';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const {chromium}=createRequire('C:/Users/roger/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/package.json')('playwright');
const base=process.env.GW1_PREVIEW_URL??'http://127.0.0.1:8765';
const skills=await Promise.all((await fs.readdir('src/data/skills')).filter(f=>f.endsWith('.json')).map(async f=>JSON.parse(await fs.readFile('src/data/skills/'+f,'utf8'))));
const heroes=await Promise.all((await fs.readdir('src/data/heroes')).filter(f=>f.endsWith('.json')).map(async f=>JSON.parse(await fs.readFile('src/data/heroes/'+f,'utf8'))));
const inventory=JSON.parse(await fs.readFile('src/data/inventory/skills.json','utf8'));
assert.equal(skills.length,inventory.entries.length);assert.equal(new Set(skills.map(s=>s.id)).size,skills.length);
for(const s of skills){assert.ok(s.description.pve.zhTW);assert.ok(!JSON.stringify(s.description).includes('%str'));assert.ok(s.icon);await fs.access('public'+s.icon);}
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
const page=await browser.newPage({viewport:{width:1365,height:950}});const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error'&&/same key|hydration/i.test(m.text()))errors.push(m.text());});
const results={skillCount:skills.length,heroCount:heroes.length,filters:[],routes:[],menus:[],mobile:[]};
const go=async url=>{const response=await page.goto(base+url,{waitUntil:'networkidle'});assert.equal(response.status(),200,url);results.routes.push(url);};
const count=async expected=>{await page.waitForFunction(n=>document.querySelectorAll('tbody tr').length===n,expected);};
try{
 await go('/campaigns/prophecies/');assert.ok(!(await page.locator('main').innerText()).includes('查核未完成'));assert.equal(await page.getByRole('combobox',{name:'NM 難度'}).count(),0);
 const desktop=page.locator('header nav[aria-label="主選單"]').first();
 await desktop.locator('summary').filter({hasText:'其他攻略'}).click();await desktop.locator('summary').filter({hasText:'主線攻略'}).click();
 assert.equal(await desktop.locator('details[open]').count(),1);assert.equal(await desktop.locator('details[open] summary').innerText(),'主線攻略');
 await desktop.locator('summary').filter({hasText:'其他攻略'}).click();assert.equal(await desktop.locator('details[open]').count(),1);results.menus.push('desktop mutually exclusive');
 await go('/campaigns/prophecies/missions/fort-ranik/');assert.equal(await page.locator('#quest-chain').getAttribute('open'),null);await page.locator('#quest-chain>summary').click();assert.notEqual(await page.locator('#quest-chain').getAttribute('open'),null);
 await go('/skills/');await count(skills.length);
 for(const profession of [...new Set(skills.map(s=>s.profession.id))]){
  await page.getByRole('combobox',{name:'職業',exact:true}).selectOption(profession);const expected=skills.filter(s=>s.profession.id===profession).length;await count(expected);results.filters.push({profession,count:expected});
 }
 await page.getByRole('button',{name:'重設篩選'}).click();await count(skills.length);
 await page.getByRole('combobox',{name:'職業',exact:true}).selectOption('warrior');await page.getByRole('combobox',{name:'菁英',exact:true}).selectOption('yes');await count(skills.filter(s=>s.profession.id==='warrior'&&s.elite).length);results.filters.push('warrior+elite');
 await page.getByRole('button',{name:'重設篩選'}).click();await page.getByRole('searchbox',{name:'搜尋技能'}).fill('  ENERGY SURGE  ');await count(1);assert.ok((await page.locator('tbody').innerText()).includes('能量'));await page.getByRole('button',{name:'重設篩選'}).click();
 for(const [profession,id] of [['warrior','healing-signet'],['ranger','charm-animal'],['monk','mending'],['necromancer','well-of-blood'],['mesmer','energy-surge'],['elementalist','fireball'],['assassin','shadow-theft'],['ritualist','soul-twisting'],['paragon','heroic-refrain'],['dervish','vow-of-revolution']]){
  await go('/professions/'+profession+'/');assert.ok((await page.locator('main').innerText()).includes('主屬性'));await go('/skills/professions/'+profession+'/');await count(skills.filter(s=>s.profession.id===profession).length);
  await go('/skills/'+id+'/');assert.ok(await page.locator('article img').count()>0);const s=skills.find(s=>s.id===id);assert.equal(await page.locator('h1').innerText(),s.name.zhTW);
  if(s.pvpVariantExists){await page.getByRole('button',{name:'PvP',exact:true}).click();await page.waitForFunction(()=>document.querySelector('button[aria-pressed="true"]')?.textContent==='PvP');}
 }
 await go('/professions/');assert.equal(await page.locator('article h2').count(),10);
 await go('/heroes/');assert.equal(await page.locator('main h2').count(),31);
 for(const campaign of ['prophecies','factions','nightfall','eye-of-the-north','core','beyond']){await page.getByRole('combobox',{name:'英雄章節'}).selectOption(campaign);const expected=heroes.filter(h=>(h.campaign??'nightfall')===campaign).length;await page.waitForFunction(n=>document.querySelectorAll('main h2').length===n,expected);results.filters.push({campaign,heroes:expected});}
 for(const h of heroes){await go('/heroes/'+h.id+'/');assert.equal(await page.locator('h1').innerText(),h.name.zhTW);assert.ok(!(await page.locator('main').innerText()).includes('台版正式名稱待核'));}
 await page.setViewportSize({width:375,height:812});await go('/skills/');assert.ok(await page.locator('main article:visible img').count()>0);assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=375));await page.screenshot({path:'docs/qa/20261010-expanded/skills-mobile.png',fullPage:false});
 await page.getByRole('searchbox',{name:'搜尋技能'}).fill('生靈扭轉');await page.waitForFunction(()=>document.querySelectorAll('main article').length===1);await go('/skills/soul-twisting/');assert.ok(await page.locator('article img').count()>0);
 for(const route of ['/heroes/','/professions/','/professions/ritualist/']){await go(route);assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=375),route);results.mobile.push(route);}
 const menu=page.locator('header>div>details');await menu.locator(':scope>summary').click();const nav=menu.locator('nav');await nav.locator('summary').filter({hasText:'主線攻略'}).click();await nav.locator('summary').filter({hasText:'其他攻略'}).click();assert.equal(await nav.locator('details[open]').count(),1);results.menus.push('mobile mutually exclusive');
 assert.deepEqual(errors,[]);await fs.writeFile('docs/qa/20261010-expanded/results.json',JSON.stringify({...results,errors},null,2));console.log('Expanded catalog and requested UI checks passed:',skills.length,'skills;',heroes.length,'heroes;',results.routes.length,'routes');
}finally{await browser.close();}
