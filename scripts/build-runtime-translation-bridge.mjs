import { readFile, writeFile } from 'node:fs/promises';

const [questPath, npcPath, wikiPath, outputPath] = process.argv.slice(2);
if (!questPath || !npcPath || !wikiPath || !outputPath) {
  throw new Error('Usage: node scripts/build-runtime-translation-bridge.mjs quests.json npcs.json wiki-candidates.json output.json');
}

const readJson = async (path) => JSON.parse(await readFile(path, 'utf8'));
const [quests, npcs, wiki] = await Promise.all([readJson(questPath), readJson(npcPath), readJson(wikiPath)]);
const byQuestId = new Map(wiki.records.map((row) => [row.questId, row]));

const result = {
  provenance: {
    questIdentity: 'observed client packet quest_id',
    npcIdentity: 'observed client packet npc_model_id',
    translations: 'same text references decoded from local Gw.snapshot language resources',
    wiki: 'Guild Wars Wiki quest-ID index; English page titles may add disambiguation',
    limitations: 'Only quests in the observed character log and NPC definitions seen in the observed map are covered. Quest npc is a log field, not a confirmed giver relation.',
  },
  quests: quests.map((quest) => {
    const wikiRow = byQuestId.get(quest.quest_id);
    return {
      questId: quest.quest_id,
      nameTextReferences: quest.name_text_references ?? [],
      nameEn: quest.name_en ?? null,
      nameZhTW: quest.name_zh_tw ?? null,
      questLogNpcEn: quest.npc_en ?? null,
      questLogNpcZhTW: quest.npc_zh_tw ?? null,
      originMapIds: quest.origin_map_ids ?? [],
      wikiUrl: wikiRow?.wikiUrl ?? null,
      wikiTitleEn: wikiRow?.wikiNameEn ?? null,
      wikiExactTitleMatch: wikiRow?.wikiNameEn === quest.name_en,
    };
  }),
  npcs: npcs.map((npc) => ({
    npcModelId: npc.npc_model_id,
    nameTextIds: npc.name_text_ids ?? [],
    nameEn: npc.name_en ?? null,
    nameZhTW: npc.name_zh_tw ?? null,
    modelFileId: npc.model_file_id ?? null,
  })),
};

await writeFile(outputPath, `${JSON.stringify(result, null, 2)}\n`, 'utf8');
const exact = result.quests.filter((quest) => quest.wikiExactTitleMatch).length;
console.log(`Observed ${result.quests.length} quests and ${result.npcs.length} NPC definitions; ${exact} exact Wiki English title matches.`);
