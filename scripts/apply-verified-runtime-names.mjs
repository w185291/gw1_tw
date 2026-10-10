import { readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const dryRun = process.argv.includes('--dry-run');
const bridge = JSON.parse(await readFile('docs/reference/runtime-translation-bridge-20261010.json', 'utf8'));
const translations = new Map();
function add(en, zhTW, source) {
  if (!en || !zhTW || en === zhTW || !/[\u3400-\u9fff]/u.test(zhTW)) return;
  const row = translations.get(en) ?? { values: new Set(), sources: new Set() };
  row.values.add(zhTW);
  row.sources.add(source);
  translations.set(en, row);
}
for (const quest of bridge.quests) {
  add(quest.nameEn, quest.nameZhTW, `quest:${quest.questId}`);
  add(quest.questLogNpcEn, quest.questLogNpcZhTW, `quest-log-npc:${quest.questId}`);
}
for (const npc of bridge.npcs) add(npc.nameEn, npc.nameZhTW, `npc-model:${npc.npcModelId}`);
const changes = [];
const conflicts = [];
async function walk(directory) {
  for (const item of await readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, item.name);
    if (item.isDirectory()) await walk(file);
    else if (item.name.endsWith('.json')) {
      const original = await readFile(file, 'utf8');
      const data = JSON.parse(original);
      const relative = path.relative(process.cwd(), file).replaceAll('\\', '/');
      function apply(value, keys) {
        if (Array.isArray(value)) return value.forEach((child, index) => apply(child, [...keys, String(index)]));
        if (!value || typeof value !== 'object') return;
        if (value.name && typeof value.name === 'object' && typeof value.name.en === 'string') {
          const term = translations.get(value.name.en);
          if (term && term.values.size === 1) {
            const translated = [...term.values][0];
            const current = value.name.zhTW;
            if (!current || current === value.name.en || current === `${value.name.en}（繁中名稱待確認）`) {
              value.name.zhTW = translated;
              if ('translationVerified' in value) value.translationVerified = true;
              if ('translationVerified' in value.name) value.name.translationVerified = true;
              changes.push({ file: relative, field: [...keys, 'name.zhTW'].join('.'), en: value.name.en, zhTW: translated, evidence: [...term.sources] });
            } else if (current !== translated) {
              conflicts.push({ file: relative, field: [...keys, 'name.zhTW'].join('.'), en: value.name.en, current, gameZhTW: translated });
            }
          }
        }
        for (const [key, child] of Object.entries(value)) {
          if (key !== 'sources' && key !== 'translationSources' && key !== 'gameTextEvidence') apply(child, [...keys, key]);
        }
      }
      apply(data, []);
      if (!dryRun && changes.some((change) => change.file === relative)) {
        await writeFile(file, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
      }
    }
  }
}
await walk(path.resolve('src/data'));
await writeFile('docs/research/runtime-name-import-20261010.json', `${JSON.stringify({ dryRun, changes, conflicts }, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({ dryRun, changes: changes.length, conflicts: conflicts.length }));
