import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const {chromium}=createRequire('C:/Users/roger/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/package.json')('playwright');
const base=process.env.GW1_PREVIEW_URL??'http://127.0.0.1:8766';
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
const page=await browser.newPage();
const errors=[];
page.on('pageerror',error=>errors.push(error.message));
try{
 await page.goto(base+'/',{waitUntil:'networkidle'});
 const nav=page.getByRole('navigation',{name:'主選單'}).first();
 await nav.getByText('遊戲介紹',{exact:true}).click();
 assert.equal(await nav.locator('details[open]').count(),1,'menu expands');
 await page.locator('#activities').click({position:{x:8,y:8}});
 assert.equal(await nav.locator('details[open]').count(),0,'outside click closes menu');
 await nav.getByText('其他攻略',{exact:true}).click();
 await nav.getByRole('link',{name:'Beyond 後續故事'}).click();
 await page.waitForURL('**/beyond/');
 assert.equal(await nav.locator('details[open]').count(),0,'route closes menu');
 for(const [path,term] of [['/beyond/','從哪裡開始？'],['/dungeons/','入口與玩法'],['/elite-missions/','苦痛領域'],['/challenge-missions/','翡翠礦場'],['/zaishen/','Zehnchu'],['/pve/','Bonus'],['/postgame/','Hard Mode'],['/pvp/','Random Arenas'],['/equipment/','符文'],['/builds/','八格技能']]){
  const response=await page.goto(base+path,{waitUntil:'networkidle'});
  assert.equal(response?.status(),200,path);
  assert.ok((await page.locator('main').innerText()).includes(term),`${path}: ${term}`);
 }
 await page.goto(base+'/hall-of-monuments/',{waitUntil:'networkidle'});
 assert.ok(await page.getByRole('link',{name:/官方獎勵計算器/}).count(),'official calculator');
 assert.ok(await page.getByRole('img',{name:/史蹟殿堂內部實景/}).count(),'hall image');
 await page.goto(base+'/glossary/',{waitUntil:'networkidle'});
 await page.getByRole('searchbox').fill('Hall of Monuments');
 await page.getByText('史蹟殿堂',{exact:true}).first().waitFor();
 const robots=await page.request.get(base+'/robots.txt');
 const sitemap=await page.request.get(base+'/sitemap.xml');
 assert.equal(robots.status(),200);assert.ok((await robots.text()).includes('Sitemap:'));
 assert.equal(sitemap.status(),200);assert.ok((await sitemap.text()).includes('/hall-of-monuments/'));assert.ok((await sitemap.text()).includes('/challenge-missions/'));
 const mobile=await browser.newPage({viewport:{width:390,height:844}});
 await mobile.goto(base+'/',{waitUntil:'networkidle'});
 const mobileMenu=mobile.locator('header details[class*="mobileNavigation"]').first();
 await mobileMenu.locator('summary').first().click();
 await mobileMenu.getByText('遊戲介紹',{exact:true}).click();
 assert.equal(await mobileMenu.locator('details[open]').count(),1,'mobile submenu opens');
 await mobile.locator('#activities').click({position:{x:8,y:8}});
 assert.equal(await mobileMenu.getAttribute('open'),null,'mobile menu closes on outside click');
 assert.equal(await mobileMenu.locator('details[open]').count(),0,'mobile submenu closes on outside click');
 await mobile.close();
 assert.deepEqual(errors,[]);
 console.log('Desktop/mobile navigation, 10 guide pages, Hall image, glossary, robots and sitemap passed.');
}finally{await browser.close();}
