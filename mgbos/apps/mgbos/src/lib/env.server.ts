import 'server-only';
import { parseServerEnvironment } from '@mgbos/config/env';
export const serverEnvironment = parseServerEnvironment(process.env);
