import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const {chromium}=createRequire('C:/Users/roger/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/package.json')('playwright');
const base=process.env.GW1_PREVIEW_URL??'http://127.0.0.1:8766';
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
const page=await browser.newPage();
const errors=[];
page.on('pageerror',error=>errors.push(error.message));
const cases=[
 ['/skills/view/?id=charge','「突擊！」'],
 ['/skills/attributes/view/?id=axe-mastery','精通斧術'],
 ['/heroes/view/?id=koss','寇斯'],
 ['/guides/view/?id=altrumm-ruins','奧楚蘭廢墟'],
 ['/missions/view/?campaign=prophecies&id=sanctum-cay','神聖沙灘'],
 ['/missions/view/?campaign=eye-of-the-north&id=a-gate-too-far','一道過遠的門'],
];
try{
 for(const [path,name] of cases){
  console.log('Checking',path);
  const response=await page.goto(base+path,{waitUntil:'networkidle'});
  assert.equal(response?.status(),200,path);
  await page.locator('h1').first().waitFor();
  const heading=await page.locator('h1').first().innerText();
  assert.ok(heading.includes(name),`${path}: ${heading}`);
  assert.ok(!(await page.locator('main').innerText()).includes('資料載入失敗'),path);
 }
 await page.goto(base+'/skills/professions/warrior/',{waitUntil:'networkidle'});
 const professions=page.getByRole('navigation',{name:'選擇技能職業'});
 assert.equal(await professions.locator('[aria-current="page"]').count(),1);
 await professions.getByRole('link',{name:/遊俠/}).click();
 await page.waitForURL('**/skills/professions/ranger/');
 assert.ok((await professions.locator('[aria-current="page"]').innerText()).includes('遊俠'));
 const attributes=page.getByRole('navigation',{name:'選擇技能屬性'});
 await attributes.getByRole('link').first().click();
 await page.waitForURL('**/skills/attributes/view/**');
 await page.getByRole('navigation',{name:'選擇技能屬性'}).locator('[aria-current="page"]').waitFor();
 assert.ok(page.url().includes('profession=ranger'),'attribute link preserves profession');
 assert.equal(await page.getByRole('navigation',{name:'選擇技能職業'}).locator('[aria-current="page"]').count(),1);
 await page.goto(base+'/campaigns/prophecies/',{waitUntil:'networkidle'});
 const link=page.locator('a[href*="/missions/view/"]').first();
 assert.ok(await link.count(),'mission list link');
 await link.click();
 await page.locator('article h1').first().waitFor();
 assert.ok(new URL(page.url()).pathname.includes('/missions/view/'));
 await page.goto(base+'/missions/view/?campaign=prophecies&id=sanctum-cay',{waitUntil:'networkidle'});
 const branch=page.locator('a[href*="/missions/view/"]').last();
 const oldHeading=await page.locator('article h1').first().innerText();
 await branch.click();
 await page.waitForFunction(old=>document.querySelector('article h1')?.textContent!==old,oldHeading);
 assert.ok((await page.locator('article h1').first().innerText())!==oldHeading,'same-shell mission change');
 assert.deepEqual(errors,[]);
 console.log(`${cases.length} static JSON detail routes, list navigation and same-shell mission change passed.`);
}finally{await browser.close();}
