import type { NextConfig } from 'next';
import {
  parsePublicEnvironment,
  parseServerEnvironment,
} from '@mgbos/config/env';
import path from 'node:path';
parsePublicEnvironment(process.env);
parseServerEnvironment(process.env);
const config: NextConfig = {
  agentRules: false,
  transpilePackages: ['@mgbos/config'],
  poweredByHeader: false,
  turbopack: { root: path.resolve(process.cwd(), '../..') },
};
export default config;
