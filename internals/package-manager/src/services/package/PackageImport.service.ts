import * as fs from 'fs';
import * as path from 'path';
import { exec } from 'child_process';
import axios from 'axios';
import * as os from 'os';

export class PackageImportService {
  // Import a package from GitHub, GitLab, local folder, or URL
  static async importPackage(source: string, destination: string): Promise<void> {
    if (source.startsWith('http')) {
      const allowedHosts = ['github.com', 'gitlab.com'];
      const urlHost = new URL(source).host;
      if (allowedHosts.includes(urlHost)) {
        // GitHub or GitLab repo
        await this.cloneRepo(source, destination);
      } else if (source.match(/\.(zip|tar\.gz|tgz)$/)) {
        // Download and extract archive
        await this.downloadAndExtract(source, destination);
      } else {
        throw new Error('Unsupported URL format for import');
      }
    } else if (fs.existsSync(source)) {
      // Local folder copy
      await this.copyFolder(source, destination);
    } else {
      throw new Error('Source not found or unsupported');
    }
  }

  private static async cloneRepo(repoUrl: string, destination: string): Promise<void> {
    return new Promise((resolve, reject) => {
      exec(`git clone --depth=1 ${repoUrl} ${destination}`, (err, stdout, stderr) => {
        if (err) return reject(stderr || err);
        // Remove .git folder after clone
        fs.rmSync(path.join(destination, '.git'), { recursive: true, force: true });
        resolve();
      });
    });
  }

  private static async downloadAndExtract(url: string, destination: string): Promise<void> {
    const tmp = path.join(os.tmpdir(), `pkg-${Date.now()}`);
    fs.mkdirSync(tmp);
    const filePath = path.join(tmp, path.basename(url));
    const writer = fs.createWriteStream(filePath);
    const response = await axios.get(url, { responseType: 'stream' });
    response.data.pipe(writer);
    await new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });
    // Extract archive
    if (url.endsWith('.zip')) {
      await this.extractZip(filePath, destination);
    } else if (url.endsWith('.tar.gz') || url.endsWith('.tgz')) {
      await this.extractTarGz(filePath, destination);
    } else {
      throw new Error('Unsupported archive format');
    }
    fs.rmSync(tmp, { recursive: true, force: true });
  }

  private static async extractZip(zipPath: string, destination: string): Promise<void> {
    const unzipper = await import('unzipper');
    await fs.createReadStream(zipPath)
      .pipe(unzipper.Extract({ path: destination }))
      .promise();
  }

  private static async extractTarGz(tarPath: string, destination: string): Promise<void> {
    const tar = await import('tar');
    await tar.x({ file: tarPath, cwd: destination });
  }

  private static async copyFolder(src: string, dest: string): Promise<void> {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    for (const entry of fs.readdirSync(src)) {
      const srcPath = path.join(src, entry);
      const destPath = path.join(dest, entry);
      if (fs.lstatSync(srcPath).isDirectory()) {
        await this.copyFolder(srcPath, destPath);
      } else {
        fs.copyFileSync(srcPath, destPath);
      }
    }
  }
}
