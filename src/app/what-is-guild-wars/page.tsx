import {GwWelcome} from '@/components/GwWelcome';
import {pageMetadata} from '@/lib/metadata';

export const metadata = pageMetadata(
  'Guild Wars 1 是什麼？完整新玩家介紹',
  '完整介紹 Guild Wars 1 Reforged 的玩法、職業、英雄、三大戰役、極地之眼、購買、單人 PvE、PvP 與長期目標。',
  '/what-is-guild-wars/',
);

export default function WhatIsGuildWars() {
  return <GwWelcome expanded/>;
}
