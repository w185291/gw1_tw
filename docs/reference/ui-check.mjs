import {fileURLToPath} from "node:url";
import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const require=createRequire(import.meta.url);
const {chromium}=require('C:/Users/roger/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
const context=await browser.newContext({viewport:{width:1440,height:1000}});
const page=await context.newPage();const errors=[];
page.on('pageerror',e=>errors.push(e.message));
const base='http://127.0.0.1:8765';
const screenshots=new URL('./screenshots/',import.meta.url);fs.mkdirSync(screenshots,{recursive:true});
async function goto(path){const response=await page.goto(base+path);assert.equal(response.status(),200);await page.locator('h1').waitFor();}
async function noOverflow(){assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'Unexpected page overflow');}
await goto('/');assert.equal(await page.locator('h1').count(),1);await noOverflow();await page.screenshot({path:fileURLToPath(new URL('home-desktop.png',screenshots))});
await goto('/campaigns/prophecies/missions/');assert.equal(await page.locator('ol[class*="timeline"]>li').count(),25);
await page.getByLabel('地區',{exact:true}).selectOption('kryta');assert.equal(await page.locator('ol[class*="timeline"]>li').count(),5);
await page.getByLabel('任務類型',{exact:true}).selectOption('primary-quest');assert.equal(await page.locator('ol[class*="timeline"]>li').count(),0);await page.getByRole('button',{name:'重設篩選'}).click();assert.equal(await page.locator('ol[class*="timeline"]>li').count(),25);
await goto('/search/');await page.getByRole('searchbox').fill('divinity');await page.getByRole('heading',{name:'神聖海岸',exact:true}).waitFor();assert.equal(await page.locator('main article').count(),1);await page.getByRole('searchbox').fill('長城');await page.getByRole('heading',{name:'北方長城',exact:true}).waitFor();
for(const [slug,title] of [['the-great-northern-wall','北方長城'],['gates-of-kryta','柯瑞塔關所'],['divinity-coast','神聖海岸']]){
 await goto('/campaigns/prophecies/missions/'+slug+'/');assert.equal(await page.locator('h1').innerText(),title);assert(await page.locator('table tbody tr').count()>5);await page.locator('#maps').scrollIntoViewIfNeeded();await page.getByRole('button',{name:/放大/}).first().click();await page.getByRole('dialog',{name:'放大路線圖'}).waitFor();await page.keyboard.press('Escape');assert.equal(await page.locator('dialog[open]').count(),0);await noOverflow();
}
await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:fileURLToPath(new URL('mission-desktop.png',screenshots))});
await context.close();const mobile=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});const mp=await mobile.newPage();mp.on('pageerror',e=>errors.push(e.message));
await mp.goto(base+'/campaigns/prophecies/missions/divinity-coast/');await mp.getByRole('button',{name:/Mission 9/}).click();const drawer=mp.getByRole('dialog',{name:'切換任務'});await drawer.waitFor();assert(await mp.evaluate(()=>document.activeElement?.closest('dialog')!==null));await drawer.locator('a[href="/campaigns/prophecies/missions/the-great-northern-wall/"]').click();await mp.getByRole('heading',{name:'北方長城',exact:true}).waitFor();assert.equal(await mp.locator('dialog[open]').count(),0);assert(await mp.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));await mp.screenshot({path:fileURLToPath(new URL('mission-mobile.png',screenshots))});
await mp.goto(base+'/');await mp.getByLabel('開啟網站選單').click();assert(await mp.getByRole('link',{name:'搜尋',exact:true}).last().isVisible());assert(await mp.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
await browser.close();assert.deepEqual(errors,[]);console.log('UI checks passed: 25-entry list, region/type filters, bilingual + alias search, 3 demos, maps/Escape, mobile drawer/focus/menu, no horizontal overflow or page errors.');
