import fs from 'node:fs/promises';
import path from 'node:path';

const base = 'https://wiki.guildwars.com/api.php';
const headers = {'User-Agent': 'GW1-TW-FanGuide/1.0 (github.com/w185291/gw1_tw)'};
const slug = text => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const wikiUrl = title => `https://wiki.guildwars.com/wiki/${encodeURIComponent(title.replaceAll(' ', '_'))}`;
const translations = JSON.parse(await fs.readFile(path.join(process.cwd(),'src/data/terminology/game-client.json'),'utf8'));
const translated = new Map(translations.filter(item => item.en !== item.zhTW).map(item => [item.en,item.zhTW]));
translated.set('Shing Jea Monastery','星岬寺');
translated.set('Kaineng Center','凱寧中心');
translated.set('Gunnar\'s Hold','甘拿的佔領地');
translated.set('Ascalon City (pre-Searing)','阿斯卡隆城（災變前）');
translated.set('Eye of the North (outpost)','極地之眼（據點）');
const translatePlace = en => ({en,zhTW: translated.get(en) ?? en});
const api = async params => {
  const url = new URL(base);
  url.search = new URLSearchParams({format: 'json', formatversion: '2', ...params}).toString();
  const response = await fetch(url, {headers});
  if (!response.ok) throw new Error(`${response.status}: ${url}`);
  const json = await response.json();
  if (json.error) throw new Error(JSON.stringify(json.error));
  return json;
};
const category = async name => {
  const items = [];
  let cmcontinue;
  do {
    const data = await api({action: 'query', list: 'categorymembers', cmtitle: `Category:${name}`, cmlimit: '500', ...(cmcontinue ? {cmcontinue} : {})});
    items.push(...data.query.categorymembers.filter(item => item.ns === 0).map(item => item.title));
    cmcontinue = data.continue?.cmcontinue;
  } while (cmcontinue);
  return items.filter(title => !title.startsWith('List of '));
};
const parsePage = async title => {
  const data = await api({action: 'parse', page: title, prop: 'wikitext'});
  return data.parse?.wikitext ?? '';
};
const textCache = new Map();
const fetchTexts = async titles => {
  for (let offset = 0; offset < titles.length; offset += 25) {
    const data = await api({action: 'query', prop: 'revisions', rvprop: 'content|ids', rvslots: 'main', titles: titles.slice(offset, offset + 25).join('|'), redirects: '1'});
    for (const page of data.query.pages) {
      const revision = page.revisions?.[0];
      const content = revision?.slots?.main?.content ?? revision?.content ?? '';
      textCache.set(page.title, {text: content, revision: revision?.revid ?? null});
    }
    for (const redirect of data.query.redirects ?? []) textCache.set(redirect.from, textCache.get(redirect.to));
  }
};

const prophecies = await parsePage('List of Prophecies skill trainers');
const propheciesNames = [...prophecies.matchAll(/^===\[\[([^\]|]+)(?:\|[^\]]+)?\]\] in \[\[[^\]]+\]\]===/gm)].map(match => match[1]);
const groups = [
  {campaign: 'prophecies', type: 'skill', names: [...propheciesNames,'Magi Malaquire']},
  {campaign: 'factions', type: 'skill', names: await category('Factions skill trainers by campaign location')},
  {campaign: 'nightfall', type: 'skill', names: await category('Nightfall skill trainers by campaign location')},
  {campaign: 'eye-of-the-north', type: 'skill', names: await category('Eye of the North skill trainers')},
  {campaign: 'nightfall', type: 'hero', names: await category('Nightfall hero skill trainers')},
  {campaign: 'eye-of-the-north', type: 'hero', names: await category('Eye of the North hero skill trainers')},
  {campaign: 'core', type: 'skill', names: ['Skill Trainer (NPC)']},
];
const names = [...new Set(groups.flatMap(group => group.names))];
await fetchTexts(names);
const imageTitles = new Set();
const records = groups.flatMap(group => group.names.map(name => {
  const page = textCache.get(name);
  if (!page) throw new Error(`Missing NPC page ${name}`);
  const text = page.text;
  const image = text.match(/\|\s*image\s*=\s*\[\[(?:File|Image):([^\]|]+)/i)?.[1]?.trim() ?? null;
  const map = text.match(/\|\s*map1\s*=\s*\[\[(?:File|Image):([^\]|]+)/i)?.[1]?.trim() ?? null;
  if (image) imageTitles.add(image);
  if (map) imageTitles.add(map);
  const locations = [...new Set([...text.matchAll(/\{\{\s*NPC location\s*\|\s*([^|}\n]+)/gi)].map(match => match[1].trim()))];
  const regionBlock = text.split(/==\s*Locations?\s*==/i)[1]?.split(/^==/m)[0] ?? '';
  const regions = [...new Set([...regionBlock.matchAll(/^\*\s*\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/gm)].map(match => match[1]))];
  const offered = {};
  const template = text.split(/\{\{\s*Skill trainer list\b/i)[1]?.split(/^\}\}/m)[0] ?? '';
  const sections = template.split(/^\|\s*([a-z-]+)\s*=\s*$/gm);
  for (let index = 1; index < sections.length; index += 2) {
    const profession = sections[index];
    if (!/^(w|r|mo|n|me|e|a|rt|p|d)$/.test(profession)) continue;
    const ids = [...new Set([...sections[index + 1].matchAll(/\{\{\s*Skill icon\s*\|\s*([^|}\n]+)/gi)].map(hit => slug(hit[1].trim())))];
    if (ids.length) offered[profession] = ids;
  }
  const note = template.match(/^\|\s*note\s*=\s*([^\n]+)/m)?.[1] ?? '';
  const inherited = [...new Set([...note.matchAll(/\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g)].map(hit => hit[1]).filter(title => names.includes(title)))];
  return {id: slug(name), name, campaign: group.campaign, type: group.type, locations: locations.map(translatePlace), regions: regions.map(translatePlace), imageTitle: image, mapTitle: map, image: null, mapImage: null, skills: offered, inherited, note: note.replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (_,target,label) => label ?? target).replaceAll("''",''), wiki: wikiUrl(name), revision: page.revision};
}));
for (const record of records.filter(item => !item.imageTitle)) {
  if (record.name === 'Skill Trainer (NPC)') {
    record.imageTitle = 'Signet of Capture.jpg';
    record.imageIsSymbol = true;
  } else {
    const page = await api({action: 'parse',page: record.name,prop: 'images'});
    const target = slug(record.name);
    const candidate = page.parse?.images?.find(file => slug(file.replace(/\.[^.]+$/,'')) === target);
    if (candidate) record.imageTitle = candidate.replaceAll('_',' ');
  }
  if (record.imageTitle) imageTitles.add(record.imageTitle);
}
const byName = new Map(records.map(record => [record.name,record]));
const localSkills = (await fs.readdir(path.join(process.cwd(),'src/data/skills'))).filter(file => file.endsWith('.json'));
const professionCodes = {warrior:'w',ranger:'r',monk:'mo',necromancer:'n',mesmer:'me',elementalist:'e',assassin:'a',ritualist:'rt',paragon:'p',dervish:'d'};
const skillFiles = await Promise.all(localSkills.map(async file => JSON.parse(await fs.readFile(path.join(process.cwd(),'src/data/skills',file),'utf8'))));
const allSkills = skillFiles.filter(skill => !skill.elite && !skill.pveOnly && !skill.pvpOnly);
const setAll = (record,campaigns,exceptions=[]) => {
  for (const skill of allSkills.filter(skill => campaigns.includes(skill.campaign.id) && !exceptions.includes(skill.id))) {
    const code = professionCodes[skill.profession.id];
    if (!code) continue;
    (record.skills[code] ??= []).push(skill.id);
  }
  for (const code of Object.keys(record.skills)) record.skills[code] = [...new Set(record.skills[code])];
};
for (const record of records) {
  if (record.name === 'Dakk') setAll(record,['core','prophecies']);
  if (record.name === 'Zenaida') setAll(record,['core','factions'],['healing-signet','leech-signet']);
}
for (let pass=0;pass<3;pass++) for (const record of records) for (const title of record.inherited) {
  const parent = byName.get(title);
  if (!parent) continue;
  for (const [code,ids] of Object.entries(parent.skills)) record.skills[code] = [...new Set([...(record.skills[code] ?? []),...ids])];
}

const fileInfo = new Map();
for (const files of Array.from(imageTitles).reduce((chunks, title, i) => {if (i % 25 === 0) chunks.push([]); chunks.at(-1).push(title); return chunks;}, [])) {
  const data = await api({action: 'query', prop: 'imageinfo|revisions', iiprop: 'url|size|mime|user', rvprop: 'content', rvslots: 'main', titles: files.map(file => `File:${file}`).join('|'), redirects: '1'});
  for (const page of data.query.pages) {
    const info = page.imageinfo?.[0];
    const content = page.revisions?.[0]?.slots?.main?.content ?? '';
    if (info) fileInfo.set(page.title.slice(5).toLowerCase().replaceAll('_',' '), {...info, content, title: page.title});
  }
  for (const redirect of data.query.redirects ?? []) {
    const target = fileInfo.get(redirect.to.slice(5).toLowerCase().replaceAll('_',' '));
    if (target) fileInfo.set(redirect.from.slice(5).toLowerCase().replaceAll('_',' '), target);
  }
}
const imageDir = path.join(process.cwd(), 'public', 'trainers');
await fs.mkdir(imageDir, {recursive: true});
const saved = new Map();
for (const record of records) {
  for (const field of ['imageTitle', 'mapTitle']) {
    const title = record[field];
    if (!title) continue;
    const info = fileInfo.get(title.toLowerCase().replaceAll('_',' '));
    if (!info || !['image/jpeg','image/png'].includes(info.mime)) continue;
    if (!saved.has(info.url)) {
      const ext = info.mime === 'image/png' ? 'png' : 'jpg';
      const relative = `/trainers/${slug(info.title.slice(5))}.${ext}`;
      const response = await fetch(info.url, {headers});
      if (!response.ok) throw new Error(`Image ${response.status}: ${info.url}`);
      const bytes = Buffer.from(await response.arrayBuffer());
      if (bytes.length !== info.size) throw new Error(`Image size mismatch: ${info.url}`);
      await fs.writeFile(path.join(process.cwd(),'public',relative.slice(1)),bytes);
      saved.set(info.url, {src: relative, sourceUrl: wikiUrl(info.title), credit: /\{\{\s*arenanet image\b/i.test(info.content) ? 'ArenaNet / NCSOFT（非商業粉絲使用）' : `Guild Wars Wiki：${info.user ?? '貢獻者'}；ArenaNet / NCSOFT`});
    }
    record[field === 'imageTitle' ? 'image' : 'mapImage'] = saved.get(info.url);
  }
  delete record.imageTitle;
  delete record.mapTitle;
}
const guildHallTrainer = records.find(item => item.name === 'Skill Trainer (NPC)');
if (guildHallTrainer && !guildHallTrainer.image) {
  const file = await api({action:'query',prop:'imageinfo',iiprop:'url|size',titles:'File:Signet of Capture.jpg'});
  const info = file.query.pages[0].imageinfo?.[0];
  if (!info) throw new Error('Missing Signet of Capture image');
  const response = await fetch(info.url,{headers});
  if (!response.ok) throw new Error(`Image ${response.status}: ${info.url}`);
  await fs.writeFile(path.join(imageDir,'signet-of-capture.jpg'),Buffer.from(await response.arrayBuffer()));
  guildHallTrainer.image = {src:'/trainers/signet-of-capture.jpg',sourceUrl:wikiUrl('File:Signet of Capture.jpg'),credit:'ArenaNet / NCSOFT（技能圖示；非商業粉絲使用）'};
}
const dataDir = path.join(process.cwd(), 'src', 'data');
await fs.writeFile(path.join(dataDir, 'skill-trainers.json'), `${JSON.stringify(records,null,2)}\n`);
const index = records.map(({id,name,campaign,type,locations,regions,image}) => ({id,name,campaign,type,locations,regions,image}));
await fs.writeFile(path.join(dataDir,'skill-trainer-index.json'),`${JSON.stringify(index,null,2)}\n`);
const publicData = path.join(process.cwd(),'public/data/skill-trainers');
await fs.mkdir(publicData,{recursive:true});
for (const campaign of [...new Set(records.map(item => item.campaign))]) {
  const trainers = records.filter(item => item.campaign === campaign);
  const ids = new Set(trainers.flatMap(item => Object.values(item.skills).flat()));
  const skills = Object.fromEntries(skillFiles.filter(skill => ids.has(skill.id)).map(skill => [skill.id,{en:skill.name.en,zhTW:skill.name.zhTW,icon:skill.icon}]));
  await fs.writeFile(path.join(publicData,`${campaign}.json`),`${JSON.stringify({trainers,skills})}\n`);
}
console.log(JSON.stringify({trainers: records.length, byCampaign: Object.fromEntries(groups.map(group => [`${group.campaign}-${group.type}`,group.names.length])), images: saved.size, withoutImage: records.filter(item => !item.image).map(item => item.name), withoutLocation: records.filter(item => !item.locations.length).map(item => item.name), withoutSkills: records.filter(item => !Object.keys(item.skills).length).map(item => item.name)},null,2));
