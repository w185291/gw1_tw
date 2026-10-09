import type { Metadata } from 'next';
export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://gw1-prophecies-zh-guide.freshlamp2.chatgpt.site';
export function pageMetadata(title:string,description:string,pathname:string):Metadata {
  const canonical=new URL(pathname,siteUrl).href;
  return {title,description,alternates:{canonical},openGraph:{title,description,url:canonical,siteName:'GW1 攻略站',locale:'zh_TW',type:'website'}};
}
