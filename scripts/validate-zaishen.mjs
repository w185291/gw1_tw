import rotation from '../src/data/zaishen/rotation.json' with {type:'json'};
import bounties from '../src/data/zaishen/bounties.json' with {type:'json'};
const reference={
  '2026-10-09':['Thunderhead Keep','The Stygian Lords','Fort Aspenwood',"Dreadnought's Drift"],
  '2026-10-10':['Tihark Orchard','Dragon Lich','Jade Quarry','Drakkar Lake'],
  '2026-10-11':['Finding the Bloodstone','Havok Soulwail','Random Arena','Dry Top'],
  '2026-10-12':['Dunes of Despair','Ghial the Bone Dancer','Codex Arena','Tears of the Fallen'],
};
const types=['mission','bounty','combat','vanquish'];
const DAY=86_400_000;
function scheduled(type,date){
  const cycle=rotation.cycles[type];
  const days=Math.round((Date.parse(`${date}T00:00:00Z`)-Date.parse(`${rotation.anchorDate}T00:00:00Z`))/DAY);
  return cycle.entries[((cycle.anchorIndex+days)%cycle.entries.length+cycle.entries.length)%cycle.entries.length]?.en;
}
for(const [date,names] of Object.entries(reference))for(const [index,type] of types.entries()){
  if(scheduled(type,date)!==names[index])throw Error(`${date} ${type}: ${scheduled(type,date)} instead of ${names[index]}`);
}
if(bounties.length!==rotation.cycles.bounty.entries.length||bounties.some(item=>!item.objectiveEn))throw Error('Bounty details missing');
const wikiDay=date=>new Date(Date.parse(date)-16*3_600_000).toISOString().slice(0,10);
if(wikiDay('2026-10-10T15:59:59Z')!=='2026-10-09'||wikiDay('2026-10-10T16:00:00Z')!=='2026-10-10')throw Error('UTC reset boundary wrong');
console.log('Zaishen rotations match Wiki 2026-10-09 through 2026-10-12; reset boundary correct.');
