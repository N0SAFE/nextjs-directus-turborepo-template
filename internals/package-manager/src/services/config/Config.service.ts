import * as fs from 'fs';

export async function handleInitConfig(options: { output: string }) {
  const readline = await import('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  function ask(question: string): Promise<string> {
    return new Promise(resolve => rl.question(question, resolve));
  }
  const monorepoName = await ask('Monorepo name: ');
  const packagesDir = await ask('Packages directory (default: packages): ');
  const sharedWhitelist = await ask('Comma-separated shared dependencies (e.g. lodash,axios): ');
  rl.close();
  const config = {
    name: monorepoName || 'my-monorepo',
    packagesDir: packagesDir || 'packages',
    shared: {
      whitelist: sharedWhitelist.split(',').map(s => s.trim()).filter(Boolean)
    }
  };
  fs.writeFileSync(options.output, JSON.stringify(config, null, 2));
  console.log(`Config written to ${options.output}`);
}
