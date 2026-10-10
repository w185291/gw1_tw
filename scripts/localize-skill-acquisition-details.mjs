import { readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const dryRun = process.argv.includes('--dry-run');
const bridge = JSON.parse(await readFile('docs/reference/runtime-translation-bridge-20261010.json', 'utf8'));
const questNames = new Map(bridge.quests
  .filter((row) => row.nameEn && row.nameZhTW && row.nameEn !== row.nameZhTW)
  .map((row) => [row.nameEn, row.nameZhTW]));
const npcNames = new Map();
for (const row of bridge.npcs) {
  if (row.nameEn && row.nameZhTW && row.nameEn !== row.nameZhTW) npcNames.set(row.nameEn, row.nameZhTW);
}
for (const row of bridge.quests) {
  if (row.questLogNpcEn && row.questLogNpcZhTW && row.questLogNpcEn !== row.questLogNpcZhTW) {
    const current = npcNames.get(row.questLogNpcEn);
    if (!current || current === row.questLogNpcZhTW) npcNames.set(row.questLogNpcEn, row.questLogNpcZhTW);
  }
}
const glossary = JSON.parse(await readFile('src/data/terminology/game-client.json', 'utf8'));
const generalMorgahn = glossary.find((row) => row.en === 'General Morgahn');
if (generalMorgahn) npcNames.set(generalMorgahn.en, generalMorgahn.zhTW);
const changes = [];
function replaceNames(details, file, field) {
  let updated = details;
  for (const [en, zhTW] of [...npcNames].sort((a, b) => b[0].length - a[0].length)) {
    if (!updated.includes(en) || en === 'Merchant' || en.startsWith('Zaishen ')) continue;
    const escaped = en.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const pattern = new RegExp(`(?<![A-Za-z])${escaped}(?![A-Za-z'’])`, 'g');
    updated = updated.replace(pattern, (match, offset, whole) => {
      const before = whole.slice(0, offset);
      if (!/(?:Unlocking(?: the)? |Locate |from )$/u.test(before)) return match;
      changes.push({ file, field, en, zhTW, kind: 'npc' });
      return zhTW;
    });
  }
  for (const [en, zhTW] of [...questNames].sort((a, b) => b[0].length - a[0].length)) {
    if (!updated.includes(en)) continue;
    const escaped = en.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const pattern = new RegExp(`(?<![A-Za-z])${escaped}(?![A-Za-z'’])`, 'g');
    updated = updated.replace(pattern, (match, offset, whole) => {
      const before = whole.slice(0, offset);
      const after = whole.slice(offset + match.length);
      if (!(/during $/u.test(before) || offset === 0)) return match;
      if (after && !/^(?:\s*\(|[),])/u.test(after)) return match;
      changes.push({ file, field, en, zhTW, kind: 'quest' });
      return zhTW;
    });
  }
  return updated;
}
for (const item of await readdir('src/data/skills', { withFileTypes: true })) {
  if (!item.isFile() || !item.name.endsWith('.json')) continue;
  const file = path.join('src/data/skills', item.name);
  const json = JSON.parse(await readFile(file, 'utf8'));
  const before = changes.length;
  for (const [kind, rows] of Object.entries(json.acquisition ?? {})) {
    if (!Array.isArray(rows)) continue;
    rows.forEach((row, index) => {
      if (typeof row.details === 'string') row.details = replaceNames(row.details, file.replaceAll('\\', '/'), `acquisition.${kind}.${index}.details`);
    });
  }
  if (!dryRun && changes.length > before) await writeFile(file, `${JSON.stringify(json, null, 2)}\n`, 'utf8');
}
await writeFile('docs/research/runtime-skill-detail-import-20261010.json', `${JSON.stringify({ dryRun, changes }, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({ dryRun, replacements: changes.length, files: new Set(changes.map((row) => row.file)).size }));
