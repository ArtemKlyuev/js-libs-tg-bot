import path from 'node:path';

import { config } from 'dotenv';

export const loadDevEnvFiles = (): void => {
  config({ path: path.resolve(process.cwd(), '.env.local') });
};
