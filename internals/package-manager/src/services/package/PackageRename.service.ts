import * as fs from 'fs';
import * as path from 'path';

export class PackageRenameService {
  // Rename the package in package.json and update all references to @repo/package
  static async renamePackage(packagePath: string, repoName: string): Promise<void> {
    const pkgJsonPath = path.join(packagePath, 'package.json');
    if (!fs.existsSync(pkgJsonPath)) throw new Error('package.json not found');
    const pkg = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf-8'));
    const oldName = pkg.name;
    const newName = `@${repoName}/${path.basename(packagePath)}`;
    pkg.name = newName;
    fs.writeFileSync(pkgJsonPath, JSON.stringify(pkg, null, 2));
    // Update all import statements in .ts/.js files in the package
    await this.updateImports(packagePath, oldName, newName);
  }

  private static async updateImports(dir: string, oldName: string, newName: string) {
    const exts = ['.ts', '.js', '.tsx', '.jsx'];
    for (const file of fs.readdirSync(dir)) {
      const filePath = path.join(dir, file);
      if (fs.lstatSync(filePath).isDirectory()) {
        await this.updateImports(filePath, oldName, newName);
      } else if (exts.includes(path.extname(file))) {
        let content = fs.readFileSync(filePath, 'utf-8');
        const regex = new RegExp(`(['"])${oldName}(['"])`, 'g');
        content = content.replace(regex, `$1${newName}$2`);
        fs.writeFileSync(filePath, content);
      }
    }
  }
}
