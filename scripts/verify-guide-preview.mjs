import {createRequire} from 'node:module';
import fs from 'node:fs/promises';
import path from 'node:path';
const require=createRequire('C:/Users/roger/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/package.json');
const {chromium}=require('playwright');
const output=path.resolve('docs/qa/20261009-continuation');await fs.mkdir(output,{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
const page=await browser.newPage({viewport:{width:1365,height:950}});
const errors=[];page.on('pageerror',error=>errors.push(error.message));
const base=process.env.GW1_PREVIEW_URL??'http://127.0.0.1:8765';
const paths=['/campaigns/prophecies/missions/sanctum-cay/','/campaigns/prophecies/missions/the-dragons-lair/','/campaigns/prophecies/missions/hells-precipice/','/campaigns/eye-of-the-north/missions/curse-of-the-nornbear/','/campaigns/eye-of-the-north/missions/a-gate-too-far/','/data-sources/game-client/'];
const results=[];
try{
 for(const pathname of paths){
  const response=await page.goto(base+pathname,{waitUntil:'networkidle'});
  if(response.status()!==200)throw new Error(pathname+' HTTP '+response.status());
  const heading=await page.locator('h1').innerText();
  if(pathname.includes('sanctum-cay')&&heading!=='神聖沙灘')throw new Error('Wrong Sanctum Cay translation');
  if(pathname.includes('the-dragons-lair')&&!await page.getByText('Crystal Hibernation',{exact:false}).count())throw new Error('Missing Glint skills');
  if(pathname.includes('eye-of-the-north')){
   const header=await page.locator('article header').innerText();
   if(!header.includes('主線')||header.includes('BONUS'))throw new Error('Quest incorrectly labeled as Mission/Bonus');
   for(const img of await page.locator('figure img').all()){
    await img.scrollIntoViewIfNeeded();
    await img.evaluate(img=>img.loading='eager');
    await page.waitForFunction(src=>[...document.querySelectorAll('figure img')].filter(img=>img.getAttribute('src')===src).every(img=>img.complete&&img.naturalWidth>0),await img.getAttribute('src'));
   }
   const images=await page.locator('figure img').evaluateAll(imgs=>imgs.map(img=>({src:img.getAttribute('src'),ok:img.complete&&img.naturalWidth>0})));
   if(images.some(img=>img.src?.startsWith('/maps/')&&!img.ok))throw new Error('Broken route map');
   await page.locator('figure button').first().click();
   const dialog=page.getByRole('dialog',{name:'放大地圖'});
   await dialog.waitFor({state:'visible'});
   await dialog.getByRole('button',{name:'關閉',exact:true}).click();
  }
  results.push({path:pathname,status:response.status(),heading});
 }
 await page.goto(base+'/campaigns/eye-of-the-north/missions/a-gate-too-far/',{waitUntil:'networkidle'});
 await page.screenshot({path:path.join(output,'eotn-desktop.png'),fullPage:true});
 await page.setViewportSize({width:375,height:812});
 const width=await page.evaluate(()=>document.documentElement.scrollWidth);
 if(width>375)throw new Error('Mobile page overflow: '+width);
 await page.screenshot({path:path.join(output,'eotn-mobile.png'),fullPage:true});
 if(errors.length)throw new Error('Browser errors: '+errors.join('; '));
 await fs.writeFile(path.join(output,'results.json'),JSON.stringify({results,mobileWidth:width,pageErrors:errors},null,2));
 console.log('Preview checks passed: six routes, Quest labels, verified names, Boss skills, maps and mobile width.');
}finally{await browser.close();}
