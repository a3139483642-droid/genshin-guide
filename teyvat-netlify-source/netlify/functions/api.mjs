import serverless from 'serverless-http';
import {connectLambda} from '@netlify/blobs';
import {app} from '../../server/app.mjs';
const serve=serverless(app);
export const handler=async(event,context)=>{connectLambda(event);event.path=event.path.replace(/^\/\.netlify\/functions\/api/,'/api');return serve(event,context);};
