import * as tsup from 'tsup';
import { defineConfig } from 'tsup';

declare function defineTsupConfig(callback?: (options: Parameters<typeof defineConfig>[0]) => ReturnType<typeof defineConfig>): tsup.Options | tsup.Options[] | ((overrideOptions: tsup.Options) => tsup.Options | tsup.Options[] | Promise<tsup.Options | tsup.Options[]>);

export { defineTsupConfig as default };
