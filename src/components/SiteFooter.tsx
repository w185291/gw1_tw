import Link from 'next/link';
import styles from './Site.module.css';

export function SiteFooter() {
  return <footer className={styles.footer}>
    <div><strong>Guild Wars 1 攻略站</strong><p>本站為玩家製作之非官方攻略網站</p></div>
    <div>
      <Link href="/translation-report/">繁中／英文名稱回報</Link>
      <a href="https://wiki.guildwars.com/wiki/Main_Page" target="_blank" rel="noopener noreferrer">Guild Wars Wiki</a>
      <a href="https://gwrevival.com/map/?c=0&x=1200&y=1145&z=4" target="_blank" rel="noopener noreferrer">GW Revival 互動地圖</a>
      <a href="https://hom.guildwars2.com/en/" target="_blank" rel="noopener noreferrer">官方史蹟殿堂查詢</a>
      <a href="https://gwpvx.fandom.com/wiki/PvX_wiki" target="_blank" rel="noopener noreferrer">PvXwiki</a>
      <a href="https://www.gnu.org/licenses/old-licenses/fdl-1.2.html" target="_blank" rel="noopener noreferrer">攻略文字授權</a>
      <p>英雄角色圖像與客戶端技能圖示依 <a href="https://www.arena.net/en/legal/content-terms-of-use">ArenaNet 粉絲內容規範</a>用於本站。職業 Tango 圖示由 <a href="https://wiki.guildwars.com/wiki/Profession">Guild Wars Wiki 貢獻者</a>依 <a href="/licenses/GFDL-1.2.txt">GFDL 1.2</a> 授權；圖片來源逐檔記於媒體清單。</p>
      <p>© ArenaNet LLC. All rights reserved. NCSOFT, ArenaNet, Guild Wars, Guild Wars 2, GW2, Heart of Thorns, Path of Fire, End of Dragons, Secrets of the Obscure, Janthir Wilds, Visions of Eternity, and all associated logos, designs, and composite marks are trademarks or registered trademarks of NCSOFT Corporation. All other trademarks are the property of their respective owners.</p>
    </div>
  </footer>;
}
