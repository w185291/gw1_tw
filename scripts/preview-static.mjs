import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
const root=path.resolve('out'),port=Number(process.env.PORT??8773);
const types={'.html':'text/html; charset=utf-8','.txt':'text/plain; charset=utf-8','.js':'application/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.jpg':'image/jpeg','.jpeg':'image/jpeg','.png':'image/png','.svg':'image/svg+xml','.woff2':'font/woff2','.json':'application/json'};
http.createServer(async(req,res)=>{try{
 const u=new URL(req.url,'http://localhost'),relative=decodeURIComponent(u.pathname).replace(/^\/+/,''),file=path.resolve(root,relative);
 if(file!==root&&!file.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}
 const stat=await fs.stat(file),resolved=stat.isDirectory()?path.join(file,'index.html'):file;
 const data=await fs.readFile(resolved);res.writeHead(200,{'Content-Type':types[path.extname(resolved)]??'application/octet-stream'});res.end(data);
}catch{res.writeHead(404);res.end('Not found');}}).listen(port,'127.0.0.1',()=>console.log(`Static preview: http://127.0.0.1:${port}`));
