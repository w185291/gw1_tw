import { readFile, writeFile } from 'node:fs/promises';

const bridge = JSON.parse(await readFile('docs/reference/runtime-translation-bridge-20261010.json', 'utf8'));
const byEnglish = new Map();
function add(en, zhTW, evidence) {
  if (!en || !zhTW || en === zhTW || !/[\u3400-\u9fff]/u.test(zhTW)) return;
  const entry = byEnglish.get(en) ?? { en, translations: new Set(), evidence: new Set() };
  entry.translations.add(zhTW);
  entry.evidence.add(evidence);
  byEnglish.set(en, entry);
}
for (const quest of bridge.quests) {
  add(quest.nameEn, quest.nameZhTW, `quest-id:${quest.questId}`);
  add(quest.questLogNpcEn, quest.questLogNpcZhTW, `quest-log-npc:${quest.questId}`);
}
for (const npc of bridge.npcs) add(npc.nameEn, npc.nameZhTW, `npc-model-id:${npc.npcModelId}`);
const entries = [...byEnglish.values()].filter((entry) => entry.translations.size === 1)
  .map((entry) => ({ en: entry.en, zhTW: [...entry.translations][0], evidence: [...entry.evidence] }))
  .sort((a, b) => a.en.localeCompare(b.en, 'en'));
const conflicts = [...byEnglish.values()].filter((entry) => entry.translations.size > 1)
  .map((entry) => ({ en: entry.en, candidates: [...entry.translations], evidence: [...entry.evidence] }));
await writeFile('src/data/terminology/runtime-verified.json', `${JSON.stringify(entries, null, 2)}\n`, 'utf8');
await writeFile('docs/research/runtime-glossary-conflicts-20261010.json', `${JSON.stringify(conflicts, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({ verifiedTerms: entries.length, conflicts: conflicts.length }));
