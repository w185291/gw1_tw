import index from '@/data/skill-trainer-index.json';

export type TrainerImage = {src:string;sourceUrl:string;credit:string};
export type TrainerPlace = {en:string;zhTW:string};
export type TrainerSummary = {
  id:string;
  name:string;
  zhTW?:string;
  campaign:string;
  type:string;
  locations:TrainerPlace[];
  regions:TrainerPlace[];
  image:TrainerImage|null;
};
export type Trainer = TrainerSummary & {
  mapImage:TrainerImage|null;
  skills:Record<string,string[]>;
  inherited:string[];
  note:string;
  wiki:string;
  revision:number|null;
  imageIsSymbol?:boolean;
};
export type TrainerPayload = {
  trainers:Trainer[];
  skills:Record<string,{en:string;zhTW:string;icon:string|null}>;
};
export const skillTrainerIndex = index as TrainerSummary[];
export const trainerHref = (id:string) => `/skill-trainers/view/?id=${encodeURIComponent(id)}`;
export const trainerCampaigns = [
  {id:'prophecies',label:'阿斯卡隆戰記'},
  {id:'factions',label:'盟與敵'},
  {id:'nightfall',label:'黑暗逆襲'},
  {id:'eye-of-the-north',label:'極地之眼'},
  {id:'core',label:'共通／公會廳'},
];
export const trainerCampaignLabel = (id:string) => trainerCampaigns.find(c=>c.id===id)?.label ?? id;
export const trainerIdForName = (name:string) => skillTrainerIndex.find(item=>item.name===name)?.id;
