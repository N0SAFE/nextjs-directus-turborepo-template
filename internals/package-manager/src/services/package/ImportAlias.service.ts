import * as fs from 'fs';
import * as path from 'path';

export class ImportAliasService {
  // Update TypeScript import aliases and all imports in the package
  static async updateAliases(packagePath: string, repoName: string): Promise<void> {
    // Update tsconfig.json paths
    const tsconfigPath = path.join(packagePath, 'tsconfig.json');
    if (fs.existsSync(tsconfigPath)) {
      const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf-8'));
      const pkgName = `@${repoName}/${path.basename(packagePath)}`;
      if (!tsconfig.compilerOptions) tsconfig.compilerOptions = {};
      if (!tsconfig.compilerOptions.paths) tsconfig.compilerOptions.paths = {};
      tsconfig.compilerOptions.paths[pkgName] = ['.'];
      fs.writeFileSync(tsconfigPath, JSON.stringify(tsconfig, null, 2));
    }
    // Update all import statements in .ts/.js files in the package
    await this.updateImports(packagePath, repoName);
  }

  private static async updateImports(dir: string, repoName: string) {
    const exts = ['.ts', '.js', '.tsx', '.jsx'];
    const pkgName = `@${repoName}/${path.basename(dir)}`;
    for (const file of fs.readdirSync(dir)) {
      const filePath = path.join(dir, file);
      if (fs.lstatSync(filePath).isDirectory()) {
        await this.updateImports(filePath, repoName);
      } else if (exts.includes(path.extname(file))) {
        let content = fs.readFileSync(filePath, 'utf-8');
        // Replace relative imports to root with @repo/package
        content = content.replace(/from ['"](\.\/|\.\.\/)+/g, `from '${pkgName}/`);
        fs.writeFileSync(filePath, content);
      }
    }
  }
}
