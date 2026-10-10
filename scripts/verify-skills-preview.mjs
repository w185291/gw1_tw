import {createRequire} from 'node:module';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const {chromium}=createRequire('C:/Users/roger/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/package.json')('playwright');
const base=process.env.GW1_PREVIEW_URL??'http://127.0.0.1:8765';
const skills=[];for(const file of await fs.readdir('src/data/skills'))if(file.endsWith('.json'))skills.push(JSON.parse(await fs.readFile('src/data/skills/'+file,'utf8')));
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
const page=await browser.newPage({viewport:{width:1365,height:950}}),errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error'&&m.text().includes('same key'))errors.push(m.text());});
const results={routes:[],filters:[],pvp:[]};
let current='catalog';
async function count(expected,label){await page.waitForFunction(n=>document.querySelectorAll('tbody tr').length===n,expected);results.filters.push({label,count:expected});}
try{
 await page.goto(base+'/skills/',{waitUntil:'networkidle'});await count(skills.length,'all');
 const filters=[['屬性','spawning-power',s=>s.attribute.id==='spawning-power'],['技能來源章節','factions',s=>s.campaign.id==='factions'],['菁英','yes',s=>s.elite],['菁英','no',s=>!s.elite],['版本','pvp',s=>s.pvpVariantExists],['版本','pve',s=>s.pveOnly],['取得方式','trainers',s=>s.acquisition.trainers.some(a=>!a.unlockOnly)],['取得方式','bosses',s=>s.acquisition.bosses.some(a=>!a.unlockOnly)]];
 for(const [label,value,predicate] of filters){await page.getByRole('combobox',{name:label,exact:true}).selectOption(value);await count(skills.filter(predicate).length,label+':'+value);await page.getByRole('button',{name:'重設篩選'}).click();await count(skills.length,'reset');}
 for(const query of ['ST','  SOUL TWISTING  ','生靈扭轉','靈魂扭曲','SoS']){await page.getByRole('searchbox',{name:'搜尋技能'}).fill(query);await page.waitForFunction(()=>document.querySelectorAll('tbody tr').length>0);assert.ok((await page.locator('tbody').innerText()).includes(query.trim().toLowerCase()==='sos'?'縛靈紋章':'生靈扭轉'));}
 await page.getByRole('button',{name:'重設篩選'}).click();
 await page.getByRole('combobox',{name:'排序'}).selectOption('energy');await page.waitForFunction(()=>document.querySelector('tbody tr td:nth-child(2) a')?.textContent);
 for(const s of skills.filter(s=>process.env.GW1_FULL_SKILL_ROUTES==='1'||s.profession.id==='ritualist')){
  current=s.id;
  const response=await page.goto(base+'/skills/'+s.id+'/',{waitUntil:'domcontentloaded'});assert.equal(response.status(),200,s.id);assert.equal(await page.locator('h1').innerText(),s.name.zhTW);assert.ok(!(await page.locator('article').innerText()).includes('%str'));
  if(s.pvpVariantExists){await page.waitForLoadState('networkidle');await page.getByRole('button',{name:'PvP',exact:true}).click();await page.waitForFunction(()=>document.querySelector('button[aria-pressed="true"]')?.textContent==='PvP');assert.equal(await page.locator('[class*=english]').last().innerText(),s.description.pvp.en,s.id+' PvP effect');results.pvp.push(s.id);}
  results.routes.push(s.id);
 }
 await page.goto(base+'/skills/soul-twisting/',{waitUntil:'networkidle'});const text=await page.locator('article').innerText();assert.ok(text.includes('召喚力量'));assert.ok(text.includes('能量 5'));assert.ok(text.includes('Morostav Trail'));assert.ok(!text.includes('能量 10'));
 await page.goto(base+'/skills/attributes/spawning-power/',{waitUntil:'networkidle'});assert.ok((await page.locator('main').innerText()).includes('4%'));
 await page.goto(base+'/skills/professions/ritualist/',{waitUntil:'networkidle'});assert.ok((await page.locator('h1').innerText()).includes('祭祀'));
 await page.setViewportSize({width:375,height:812});
 for(const route of ['/skills/','/skills/soul-twisting/']){await page.goto(base+route,{waitUntil:'networkidle'});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=375),route);}
 await fs.mkdir('docs/qa/20261010-skills',{recursive:true});await page.screenshot({path:'docs/qa/20261010-skills/mobile.png'});
 assert.deepEqual(errors,[]);await fs.writeFile('docs/qa/20261010-skills/results.json',JSON.stringify({...results,pageErrors:errors},null,2));
 console.log(`Skills passed: ${results.routes.length} routes, ${results.pvp.length} PvP toggles, ${results.filters.length} filter/reset cases, bilingual/alias queries and mobile layout.`);
}catch(error){console.log('Failure at',current);throw error;}finally{await browser.close();}
