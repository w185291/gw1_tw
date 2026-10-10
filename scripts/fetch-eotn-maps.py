from pathlib import Path
from lxml import html
from PIL import Image
import json,urllib.request,urllib.parse,sys

ROOT=Path(__file__).resolve().parents[1];CACHE=ROOT/'docs/reference/completeness'
slugs=sys.argv[1:] or ['the-beginning-of-the-end','curse-of-the-nornbear','flames-of-the-bear-spirit','vision-of-the-raven-spirit','blood-washes-blood','a-gate-too-far']
out=ROOT/'public/maps/eotn';out.mkdir(parents=True,exist_ok=True)
manifest_path=CACHE/'eotn-map-manifest.json'
manifest=json.loads(manifest_path.read_text(encoding='utf-8')) if manifest_path.exists() else {}
for slug in slugs:
    source=json.loads((CACHE/(slug+'.json')).read_text(encoding='utf-8'))
    tree=html.fromstring(source['html'])
    filenames=[urllib.parse.unquote(href.split('/wiki/')[-1]).replace('_',' ') for href in tree.xpath('//table[1]//a[contains(@class,"image")]/@href') if href.startswith('/wiki/File:') and 'map' in href.lower()]
    manifest[slug]=[]
    for i,title in enumerate(dict.fromkeys(filenames)):
        meta_path=CACHE/(slug+f'-map-{i+1}-metadata.json')
        if meta_path.exists():meta=json.loads(meta_path.read_text(encoding='utf-8'))
        else:
            url='https://wiki.guildwars.com/api.php?'+urllib.parse.urlencode({'action':'query','titles':title,'prop':'imageinfo','iiprop':'url|user|size|extmetadata','format':'json'})
            with urllib.request.urlopen(urllib.request.Request(url,headers={'User-Agent':'GW1GuideResearch/1.0'}),timeout=40) as response:meta=json.load(response)
            meta_path.write_text(json.dumps(meta,ensure_ascii=False,indent=2),encoding='utf-8')
        info=next(iter(meta['query']['pages'].values()))['imageinfo'][0]
        dest=out/(slug+f'-{i+1}.jpg')
        if not dest.exists():
            with urllib.request.urlopen(urllib.request.Request(info['url'],headers={'User-Agent':'GW1GuideResearch/1.0'}),timeout=40) as response:dest.write_bytes(response.read())
        with Image.open(dest) as image:width,height=image.size
        manifest[slug].append({'src':'/maps/eotn/'+dest.name,'title':'Wiki 任務路線圖','alt':source['title']+' 任務地圖','width':width,'height':height,'filePage':info['descriptionurl'],'originalImage':info['url'],'uploader':info['user'],'copyright':'Guild Wars 遊戲地圖 © ArenaNet／NCsoft；標註依原 Wiki 圖片頁。','hasDrawnRoute':False,'role':'quest-map','fileTitle':title,'visualReview':'pending'})
        print(slug,width,height,flush=True)
(CACHE/'eotn-map-manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
