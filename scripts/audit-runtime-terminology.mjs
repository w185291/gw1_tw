import { readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve('src/data');
const bridge = JSON.parse(await readFile('docs/reference/runtime-translation-bridge-20261010.json', 'utf8'));
const terms = new Map();
function add(en, zhTW, kind) {
  if (!en || !zhTW || en === zhTW || !/[\u3400-\u9fff]/u.test(zhTW)) return;
  const row = terms.get(en) ?? { en, zhTW: new Set(), kinds: new Set() };
  row.zhTW.add(zhTW);
  row.kinds.add(kind);
  terms.set(en, row);
}
for (const quest of bridge.quests) {
  add(quest.nameEn, quest.nameZhTW, 'runtime-quest-id');
  add(quest.questLogNpcEn, quest.questLogNpcZhTW, 'quest-log-npc-field');
}
for (const npc of bridge.npcs) add(npc.nameEn, npc.nameZhTW, 'runtime-npc-model-id');
const accepted = [...terms.values()].filter((term) => term.zhTW.size === 1)
  .map((term) => ({ en: term.en, zhTW: [...term.zhTW][0], kinds: [...term.kinds] }))
  .sort((a, b) => b.en.length - a.en.length);
const ambiguous = [...terms.values()].filter((term) => term.zhTW.size > 1)
  .map((term) => ({ en: term.en, zhTW: [...term.zhTW] }));
const skipKeys = new Set(['en', 'url', 'href', 'id', 'slug', 'aliases', 'translationSources', 'sources', 'gameTextEvidence', 'image', 'icon', 'wiki']);
const occurrences = [];
async function walk(directory) {
  for (const item of await readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, item.name);
    if (item.isDirectory()) await walk(file);
    else if (item.name.endsWith('.json')) {
      const json = JSON.parse(await readFile(file, 'utf8'));
      const relative = path.relative(process.cwd(), file).replaceAll('\\', '/');
      function inspect(value, keys) {
        if (typeof value === 'string') {
          for (const term of accepted) {
            if (!value.includes(term.en)) continue;
            const pattern = new RegExp(`(?<![A-Za-z])${term.en.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?![A-Za-z])`, 'g');
            if (!pattern.test(value)) continue;
            occurrences.push({ file: relative, field: keys.join('.'), en: term.en, zhTW: term.zhTW, kinds: term.kinds, text: value.slice(0, 260) });
          }
          return;
        }
        if (Array.isArray(value)) return value.forEach((child, index) => inspect(child, [...keys, String(index)]));
        if (value && typeof value === 'object') {
          for (const [key, child] of Object.entries(value)) {
            if (!skipKeys.has(key) && !/url$/i.test(key)) inspect(child, [...keys, key]);
          }
        }
      }
      inspect(json, []);
    }
  }
}
await walk(root);
const output = { source: 'runtime-translation-bridge-20261010.json', acceptedTerms: accepted.length, ambiguous, occurrences };
await writeFile('docs/research/runtime-terminology-site-audit-20261010.json', `${JSON.stringify(output, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({ acceptedTerms: accepted.length, ambiguous: ambiguous.length, occurrences: occurrences.length }));
