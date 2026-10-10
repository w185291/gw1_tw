import { readFile, writeFile } from 'node:fs/promises';

const [wikiPath, runtimePath, outputPath] = process.argv.slice(2);
if (!wikiPath || !runtimePath || !outputPath) {
  throw new Error('Usage: node scripts/build-quest-translation-index.mjs wiki-candidates.json runtime-translation-bridge.json output.json');
}
const readJson = async (path) => JSON.parse(await readFile(path, 'utf8'));
const [wiki, runtime] = await Promise.all([readJson(wikiPath), readJson(runtimePath)]);
const runtimeById = new Map(runtime.quests.map((quest) => [quest.questId, quest]));
const records = wiki.records.map((row) => {
  const observed = runtimeById.get(row.questId);
  if (observed) {
    return {
      questId: row.questId,
      wikiNameEn: row.wikiNameEn,
      wikiUrl: row.wikiUrl,
      gameNameEn: observed.nameEn,
      nameZhTW: observed.nameZhTW,
      nameTextReferences: observed.nameTextReferences,
      status: 'runtime-verified',
      wikiTitleDiffers: row.wikiNameEn !== observed.nameEn,
    };
  }
  return {
    questId: row.questId,
    wikiNameEn: row.wikiNameEn,
    wikiUrl: row.wikiUrl,
    candidateZhTW: row.candidateZhTW,
    candidateTextIds: row.datMatches.map((match) => match.textId),
    status: row.status === 'unique-exact-name-match'
      ? 'unverified-exact-English-candidate'
      : row.status === 'ambiguous'
        ? 'ambiguous-candidate'
        : 'no-translation-candidate',
  };
});
const indexedIds = new Set(records.map((record) => record.questId));
const missingRuntime = runtime.quests.filter((quest) => !indexedIds.has(quest.questId));
if (missingRuntime.length) {
  throw new Error(`Runtime quest IDs missing from Wiki index: ${missingRuntime.map((quest) => quest.questId).join(', ')}`);
}
const counts = Object.fromEntries([...new Set(records.map((record) => record.status))]
  .map((status) => [status, records.filter((record) => record.status === status).length]));
const result = {
  provenance: {
    wiki: 'Guild Wars Wiki Quest-ID index',
    runtimeVerified: 'quest_id and localized text reference observed in client packets, decoded via Gw.snapshot',
    candidate: 'only exact English string match in local unseeded DAT text pairs; not game quest-ID evidence',
  },
  counts,
  records,
};
await writeFile(outputPath, `${JSON.stringify(result, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({ indexed: records.length, ...counts }));
