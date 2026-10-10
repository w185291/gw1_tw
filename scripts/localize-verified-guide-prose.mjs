import { readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const dryRun = process.argv.includes('--dry-run');
const bridge = JSON.parse(await readFile('docs/reference/runtime-translation-bridge-20261010.json', 'utf8'));
const gameTerms = JSON.parse(await readFile('src/data/terminology/game-client.json', 'utf8'));
const terms = new Map();
function add(en, zhTW, source) {
  if (!en || !zhTW || en === zhTW || !/[\u3400-\u9fff]/u.test(zhTW)) return;
  const entry = terms.get(en) ?? { values: new Set(), sources: new Set() };
  entry.values.add(zhTW);
  entry.sources.add(source);
  terms.set(en, entry);
}
for (const quest of bridge.quests) {
  add(quest.nameEn, quest.nameZhTW, `quest:${quest.questId}`);
  add(quest.questLogNpcEn, quest.questLogNpcZhTW, `quest-log-npc:${quest.questId}`);
}
for (const npc of bridge.npcs) add(npc.nameEn, npc.nameZhTW, `npc-model:${npc.npcModelId}`);
// The client glossary has the full hero title; prefer it to replacing only "Morgahn".
for (const row of gameTerms) {
  if (row.en === 'General Morgahn') add(row.en, row.zhTW, `game-text:${row.stringIds.join(',')}`);
}
const excluded = new Set(['Merchant', 'Zaishen Mission', 'Zaishen Bounty']);
const accepted = [...terms].filter(([en, row]) => row.values.size === 1 && !excluded.has(en))
  .map(([en, row]) => ({ en, zhTW: [...row.values][0], evidence: [...row.sources] }))
  .sort((a, b) => b.en.length - a.en.length);
const changes = [];
const dataRoot = path.resolve('src/data');
const directories = ['campaigns', 'eye-of-the-north', 'factions', 'nightfall', 'prophecies', 'heroes', 'extras'];
const skipKeys = new Set(['en', 'aliases', 'id', 'slug', 'sources', 'translationSources', 'gameTextEvidence', 'name', 'terminologyAudit']);

function localize(text, relative, field) {
  // Prose or a dedicated visible name field; never rewrite English source fields.
  if (!/[\u3400-\u9fff]/u.test(text) && !/(?:^|\.)(?:giver|branch|choiceGroup|heroes)(?:\.|$)/u.test(field)) return text;
  let updated = text;
  for (const term of accepted) {
    if (!updated.includes(term.en)) continue;
    if (relative.endsWith('/tihark-orchard.json') && term.en === 'Palawa Joko') continue;
    const escaped = term.en.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const pattern = new RegExp(`(?<![A-Za-z])${escaped}(?![A-Za-z'’])`, 'g');
    updated = updated.replace(pattern, (match, offset, whole) => {
      const before = whole.slice(0, offset);
      const after = whole.slice(offset + match.length);
      if (before.endsWith(`${term.zhTW}（`) && after.startsWith('）')) return match;
      if (term.en === 'Su' && before.endsWith('no ')) return match;
      if (before.endsWith('Gain ')) return match;
      if (term.en === 'Morgahn' && before.endsWith('General ')) return match;
      changes.push({ file: relative, field, en: term.en, zhTW: term.zhTW, evidence: term.evidence });
      return term.zhTW;
    });
  }
  return updated;
}

async function visit(directory) {
  for (const item of await readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, item.name);
    if (item.isDirectory()) await visit(file);
    else if (item.name.endsWith('.json')) {
      const text = await readFile(file, 'utf8');
      const json = JSON.parse(text);
      const relative = path.relative(process.cwd(), file).replaceAll('\\', '/');
      const before = changes.length;
      function update(value, keys) {
        if (typeof value === 'string') return localize(value, relative, keys.join('.'));
        if (Array.isArray(value)) return value.map((child, index) => update(child, [...keys, String(index)]));
        if (value && typeof value === 'object') {
          for (const [key, child] of Object.entries(value)) {
            if (skipKeys.has(key) || /(?:url|href|image|icon|file)/i.test(key)) continue;
            value[key] = update(child, [...keys, key]);
          }
        }
        return value;
      }
      update(json, []);
      if (!dryRun && changes.length > before) await writeFile(file, `${JSON.stringify(json, null, 2)}\n`, 'utf8');
    }
  }
}
for (const directory of directories) await visit(path.join(dataRoot, directory));
await writeFile('docs/research/runtime-prose-import-20261010.json', `${JSON.stringify({ dryRun, changes }, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({ dryRun, replacements: changes.length, files: new Set(changes.map((change) => change.file)).size }));
