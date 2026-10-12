import {backup} from '../../server/backup.mjs';
import {fileURLToPath} from 'node:url';
export default async()=>{process.env.TEYVAT_PROJECT_ROOT=fileURLToPath(new URL('../../',import.meta.url));await backup();};
export const config={schedule:'0 19 * * *'};
