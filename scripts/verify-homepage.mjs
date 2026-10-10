import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {createRequire} from 'node:module';

const require = createRequire('C:/Users/roger/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/package.json');
const {chromium} = require('playwright');
const base = process.env.GW1_PREVIEW_URL ?? 'http://127.0.0.1:8765';
const output = 'docs/qa/20261010-homepage';
await fs.mkdir(output, {recursive: true});
const browser = await chromium.launch({headless: true, executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe'});
const errors = [];
const results = [];
try {
  for (const [name, width, height] of [['desktop', 1440, 900], ['tablet', 768, 1000], ['mobile', 390, 844]]) {
    const page = await browser.newPage({viewport: {width, height}});
    page.on('pageerror', error => errors.push(`${name}: ${error.message}`));
    const response = await page.goto(`${base}/`, {waitUntil: 'networkidle'});
    assert.equal(response.status(), 200);
    assert.match(await page.locator('h1').innerText(), /Guild Wars 1/);
    assert.equal(await page.locator('main img').count() >= 10, true);
    assert.equal(await page.locator('main img[src*="/portraits/heroes/"], main img[src*="/portraits/hero-full/"]').count(), 0);
    assert.equal(await page.locator('main').getByText('沒有月費。').count() > 0, true);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), true, `${name} overflow`);
    await page.screenshot({path: `${output}/${name}.png`, fullPage: false});
    results.push({name, width, imageCount: await page.locator('main img').count()});
    await page.close();
  }
  const page = await browser.newPage({viewport: {width: 1365, height: 900}});
  for (const route of ['/what-is-guild-wars/', '/getting-started/', '/heroes/', '/heroes/koss/', '/professions/', '/professions/warrior/']) {
    const response = await page.goto(base + route, {waitUntil: 'networkidle'});
    assert.equal(response.status(), 200, route);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), true, `${route} overflow`);
    if (route === '/heroes/' || route === '/professions/') assert.ok(await page.locator('main img').count() >= 10, route);
    if (route === '/heroes/koss/' || route === '/professions/warrior/') {
      assert.ok(await page.locator('main img').count() >= 1, route);
      assert.equal(await page.locator('main img[src*="/portraits/heroes/"], main img[src*="/portraits/hero-full/"]').count(), 0);
      await page.screenshot({path: `${output}/${route.includes('heroes') ? 'hero' : 'profession'}.png`, fullPage: false});
    }
    results.push({route, status: response.status()});
  }
  const internal = await page.goto(base + '/');
  assert.equal(internal.status(), 200);
  const hrefs = [...new Set(await page.locator('main a[href^="/"]').evaluateAll(links => links.map(link => link.getAttribute('href'))))];
  for (const href of hrefs) {
    const response = await page.request.get(base + href);
    assert.equal(response.status(), 200, href);
  }
  assert.deepEqual(errors, []);
  await fs.writeFile(`${output}/results.json`, JSON.stringify({results, internalLinks: hrefs.length, errors}, null, 2));
  console.log(`Homepage QA passed: ${results.length} page/viewport checks, ${hrefs.length} internal links`);
} finally {
  await browser.close();
}
