import fs from 'node:fs';
import path from 'node:path';

const extractionRoot = process.argv[2];
if (!extractionRoot) throw new Error('Usage: node scripts/audit-extracted-terminology.mjs <extraction-directory>');

const readJson = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const pairs = readJson(path.join(extractionRoot, 'text-pairs.json'));
const skillExport = readJson(path.join(extractionRoot, 'skills', 'skills.json'));
const unresolved = readJson('docs/reference/translation-unresolved.json');
const byEnglish = new Map();
for (const [stringId, pair] of Object.entries(pairs)) {
  const key = pair.en.toLocaleLowerCase('en');
  if (!byEnglish.has(key)) byEnglish.set(key, []);
  byEnglish.get(key).push({stringId: Number(stringId), ...pair});
}

const categories = {};
const candidates = [];
for (const reference of unresolved) {
  const bucket = categories[reference.category] ??= {total: 0, noExactMatch: 0, englishOnly: 0, chineseCandidate: 0, conflictingChinese: 0};
  bucket.total++;
  const rows = byEnglish.get(reference.en.toLocaleLowerCase('en')) ?? [];
  const chinese = [...new Set(rows.map((row) => row.zhTW).filter((value) => /[\u3400-\u9fff]/u.test(value)))];
  if (!rows.length) bucket.noExactMatch++;
  else if (!chinese.length) bucket.englishOnly++;
  else if (chinese.length === 1) bucket.chineseCandidate++;
  else bucket.conflictingChinese++;
  if (chinese.length) candidates.push({
    categoryFromWebsite: reference.category,
    en: reference.en,
    chineseCandidates: chinese,
    stringIds: rows.map((row) => row.stringId),
    status: 'needs-entity-validation',
    source: 'Gw.dat + Gw.snapshot; exact English text match',
  });
}

const report = {
  extractedAt: '2026-10-10',
  extractionRoot,
  pairedStrings: Object.keys(pairs).length,
  structuredSkillRecords: skillExport.skills.length,
  unresolvedWebsiteReferences: unresolved.length,
  categories,
  candidates,
  warning: 'An exact text match is not an NPC/quest relationship. Category labels come from website references and may be wrong; verify entity type before import.',
};
const output = 'docs/research/game-extraction-audit-20261010.json';
fs.writeFileSync(output, JSON.stringify(report, null, 2) + '\n');
console.log(`Wrote ${output}: ${report.pairedStrings} pairs, ${report.structuredSkillRecords} structured skills, ${candidates.length} terminology candidates`);
