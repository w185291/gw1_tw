import {GwWelcome} from '@/components/GwWelcome';
import {pageMetadata} from '@/lib/metadata';

export const metadata = pageMetadata(
  'Guild Wars 1 中文攻略｜GW1 Reforged 新手、主線、技能與英雄攻略',
  'Guild Wars 1 / Guild Wars Reforged 繁體中文攻略站。認識 GW1、購買方式、三大戰役、極地之眼、技能 Build、英雄、PvE/PvP 與主線攻略。',
  '/',
);

export default function Home() {
  return <GwWelcome/>;
}
