import evidence from '../../../../docs/reference/game-client-evidence.json';
import terms from '@/data/terminology/game-client.json';
import Link from 'next/link';
import styles from '@/components/Site.module.css';

export const metadata={title:'遊戲內繁中名稱查核'};
export default function ClientEvidence(){
  const examples=['Sanctum Cay','Soul Twisting','Signet of Spirits','Communing','Pogahn Passage','Dunkoro'];
  return <article className={styles.pageContainer}><header className={styles.pageTitle}><h1>遊戲內繁中名稱查核</h1><p>由使用者本機 Guild Wars 安裝檔唯讀擷取；以相同字串 ID 配對英文與繁體中文。</p></header><p>本次解析取得 {evidence.pairedStringCount.toLocaleString('zh-TW')} 組配對，網站引用 {terms.length.toLocaleString('zh-TW')} 個詞條。字串名稱確認不代表攻略、技能效果或取得地點已完成驗證。</p><p><Link href="/glossary/">搜尋遊戲中英名稱對照 →</Link></p><div className={styles.quickLinks}>{examples.map(en=>{const t=terms.find(t=>t.en===en);return t&&<span key={en}>{en} → {t.zhTW}</span>;})}</div><h2>查核方式</h2><p>先辨識遊戲封裝資料檔及執行檔中的語系資源表，再依語言共用的 ID 讀取同一筆文字。英文回退、缺字或多個繁中譯名衝突，都不會自動標為驗證成功。部分 NPC 名稱仍無法從目前離線解析結果取得。</p><p>已比對解包前後三個輸入檔的 SHA-256，雜湊完全相同。研究資料寫入另外的資料夾，遊戲檔保持原樣。</p><h2>來源版本</h2><p>查核日期：{evidence.checkedAt}。解析器：<a href={evidence.extractorRepository}>Tyria-Extractor 原始碼</a>，基準提交 {evidence.upstreamCommit}；已調整語系表區塊數以符合本機版本，並新增離線字串配對輸出。</p><ul>{evidence.inputs.map(input=><li key={input.file}><strong>{input.file}</strong><p style={{overflowWrap:'anywhere'}}>SHA-256：{input.sha256}</p></li>)}</ul></article>;
}
