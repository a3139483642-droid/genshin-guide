import {connectLambda} from '@netlify/blobs';
import {processImport,processQueue} from '../../server/imports.mjs';
export const handler=async event=>{connectLambda(event);if(!process.env.SETUP_KEY||event.headers['x-task-key']!==process.env.SETUP_KEY)return {statusCode:403};const body=JSON.parse(event.body||'{}');if(body.id)await processImport(body.id);else await processQueue();return {statusCode:200};};
