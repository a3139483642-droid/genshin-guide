import {readFile} from 'node:fs/promises';
import path from 'node:path';
import {projectFile} from '../../server/paths.mjs';
import {seoCharacter} from '../../server/seo.mjs';
export const handler=async(event)=>{try{const pathname=event.path.replace(/^\/\.netlify\/functions\/page/,'/characters');const id=pathname.split('/').filter(Boolean)[1];const html=await readFile(projectFile('dist/index.html'),'utf8');const result=await seoCharacter(id,event.queryStringParameters?.plan,html);return {statusCode:result.status,headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store'},body:result.html};}catch{return {statusCode:503,body:'手册暂时不可用，请稍后重试。'};}};

