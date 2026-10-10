import fs from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const manifestPath = path.join(root, 'src/data/media/portraits.json');
const outputDir = path.join(root, 'public/portraits/heroes');
const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'));
const dryRun = process.argv.includes('--dry-run');
const entries = [
  ...Object.entries(manifest.heroes).map(([id, item]) => ({id, item, size: 'headshot'})),
  ...Object.entries(manifest.heroFull).map(([id, item]) => ({id, item, size: 'full'})),
];
const titles = [...new Set(entries.map(({item}) => decodeURIComponent(item.sourceUrl.split('/File:')[1] ?? '').replaceAll('_', ' ')).filter(Boolean))];
const pages = new Map();

for (let offset = 0; offset < titles.length; offset += 40) {
  const url = new URL('https://wiki.guildwars.com/api.php');
  url.search = new URLSearchParams({action: 'query', format: 'json', formatversion: '2', prop: 'imageinfo|revisions', iiprop: 'url|size|mime|user', rvprop: 'content', titles: titles.slice(offset, offset + 40).map(title => `File:${title}`).join('|')}).toString();
  const response = await fetch(url, {headers: {'User-Agent': 'GW1-TW-FanGuide/1.0 (github.com/w185291/gw1_tw)'}});
  if (!response.ok) throw new Error(`MediaWiki API ${response.status}`);
  for (const page of (await response.json()).query.pages) pages.set(page.title.toLowerCase(), page);
}

await fs.mkdir(outputDir, {recursive: true});
let downloaded = 0;
for (const {id, item, size} of entries) {
  const title = decodeURIComponent(item.sourceUrl.split('/File:')[1] ?? '').replaceAll('_', ' ');
  const page = pages.get(`file:${title}`.toLowerCase());
  const info = page?.imageinfo?.[0];
  const wikitext = page?.revisions?.[0]?.content ?? '';
  const isArenaNetImage = /\{\{\s*arenanet image\b/i.test(wikitext);
  const isGameScreenshot = /\{\{\s*screenshot\b/i.test(wikitext);
  if (!info || (!isArenaNetImage && !isGameScreenshot) || !info.mime.startsWith('image/')) {
    console.log(`SKIP ${size} ${id}: ${page?.missing ? 'missing file' : info ? 'not tagged as game media' : 'no image info'}`);
    continue;
  }
  const ext = info.mime === 'image/png' ? 'png' : info.mime === 'image/jpeg' ? 'jpg' : undefined;
  if (!ext) { console.log(`SKIP ${size} ${id}: unsupported ${info.mime}`); continue; }
  const rel = `/portraits/heroes/${id}${size === 'full' ? '-full' : ''}.${ext}`;
  console.log(`${dryRun ? 'READY' : 'FETCH'} ${size} ${id}: ${info.width}x${info.height}, ${info.size} bytes`);
  if (dryRun) continue;
  const response = await fetch(info.url, {headers: {'User-Agent': 'GW1-TW-FanGuide/1.0 (github.com/w185291/gw1_tw)'}});
  if (!response.ok) throw new Error(`Image ${response.status}: ${info.url}`);
  const bytes = Buffer.from(await response.arrayBuffer());
  if (bytes.length !== info.size) throw new Error(`Image size mismatch: ${info.url}`);
  await fs.writeFile(path.join(root, 'public', rel.slice(1)), bytes);
  item.src = rel;
  item.credit = isArenaNetImage ? 'ArenaNet / NCSOFT（非商業粉絲使用）' : `遊戲截圖：${info.user ?? 'Guild Wars Wiki 貢獻者'}；ArenaNet / NCSOFT`;
  item.licenseStatus = 'fan-use';
  downloaded++;
}

if (!dryRun) await fs.writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`${dryRun ? 'Ready' : 'Downloaded'} ${dryRun ? entries.length : downloaded} candidate files.`);
