import type {Metadata} from 'next';
import {SiteHeader} from '@/components/SiteHeader';
import {SiteFooter} from '@/components/SiteFooter';
import {siteUrl} from '@/lib/metadata';
import './globals.css';
export const metadata:Metadata={metadataBase:new URL(siteUrl),title:{default:'GW1 繁體中文非官方攻略站',template:'%s｜GW1 非官方攻略站'},description:'Guild Wars 1 主線、Bonus、NM/HM 與原版路線圖繁體中文攻略。',icons:{icon:'/favicon.svg'}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="zh-Hant"><body><a href="#main" className="skip-link">跳到主要內容</a><SiteHeader/><main id="main" tabIndex={-1}>{children}</main><SiteFooter/></body></html>;}
