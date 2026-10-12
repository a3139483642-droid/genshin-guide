import { readFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import {projectFile} from './paths.mjs';
export const cloud = Boolean(process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.NETLIFY === 'true');
export const dataDir = path.resolve(process.env.DATA_DIR || '.data');
let pending;
export async function database(){
  if(!pending) pending=(async()=>{
    let db;
    if(cloud || process.env.DATABASE_URL){
      const { getDatabase } = await import('@netlify/database');
      const native=getDatabase(process.env.DATABASE_URL ? {connectionString:process.env.DATABASE_URL} : undefined);
      db={query:(sql,args=[])=>native.pool.query(sql,args),transaction:async(fn)=>{const c=await native.pool.connect();try{await c.query('BEGIN');const out=await fn(c);await c.query('COMMIT');return out;}catch(e){await c.query('ROLLBACK');throw e;}finally{c.release();}},close:()=>native.pool.end()};
    } else {
      await mkdir(dataDir,{recursive:true});
      const {PGlite}=await import('@electric-sql/pglite');
      db=new PGlite(path.join(dataDir,'postgres'));
      await db.waitReady;
    }
    const schema=await readFile(projectFile('server/migrations/001_initial.sql'),'utf8');
    if(cloud||process.env.DATABASE_URL){await db.transaction(async c=>{await c.query('SELECT pg_advisory_xact_lock(714602)');for(const statement of schema.split(';').filter(s=>s.trim()))await c.query(statement);});}
    else for(const statement of schema.split(';').filter(s=>s.trim())) await db.query(statement);
    return db;
  })();
  return pending;
}
export async function rows(sql,args=[]){return (await (await database()).query(sql,args)).rows;}
export async function one(sql,args=[]){return (await rows(sql,args))[0];}
export async function tx(fn){return (await database()).transaction(fn);}
