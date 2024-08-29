import * as fs from "fs";
import nunjucks from "nunjucks";
import path from "path";
export const copyFile = <T>(src: string, dest: string, opts?: { context?: T; createDirIfNot?: boolean; contentTransform?: (content: string) => string }) => {
    if ((opts?.createDirIfNot ?? true) && !fs.existsSync(path.resolve(dest, '../'))) {
        fs.mkdirSync(path.resolve(dest, '../'), { recursive: true });
    }
    const content = opts?.contentTransform ? opts?.contentTransform(fs.readFileSync(src, "utf-8")) : fs.readFileSync(src, "utf-8");
    fs.writeFileSync(dest, opts?.context ? nunjucks.renderString(content, opts.context) : content);
};

export const copyFiles = (...copyFileParams: Parameters<typeof copyFile>[]) => {
    for (const param of copyFileParams) {
        copyFile(...param);
    }
};

export const copyDir = <T>(
    src: string,
    dest: string,
    opts?: { context?: T | ((fileName: string) => T); createDirIfNot?: boolean; contentTransform?: (content: string) => string; fileNameTransform?: (dest: string) => string }
) => {
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }
    const files = fs.readdirSync(src);
    for (const file of files) {
        const current = fs.lstatSync(`${src}/${file}`);
        if (current.isDirectory()) {
            copyDir(`${src}/${file}`, `${dest}/${file}`, opts);
        } else if (current.isSymbolicLink()) {
            const symlink = fs.readlinkSync(`${src}/${file}`);
            fs.symlinkSync(symlink, `${dest}/${file}`);
        } else {
            const destFile = `${dest}/${opts?.fileNameTransform ? opts.fileNameTransform(file) : file}`;
            const context = opts?.context;
            copyFile(`${src}/${file}`, destFile, {
                ...opts,
                context: context instanceof Function ? context(file) : context
            });
        }
    }
};

export default class Utils {
    constructor(
        private opts: {
            logging?: boolean;
        }
    ) {}

    log(...args: Parameters<typeof console.log>) {
        if (this.opts.logging) {
            console.log(...args);
        }
    }

    copyFile = (...args: Parameters<typeof copyFile>) => {
        this.log("Copying file: " + args[0]);
        copyFile(...args);
    };

    copyFiles = (...args: Parameters<typeof copyFiles>) => {
        this.log("Copying files: " + args.map((arg) => arg[0]).join(", "));
        copyFiles(...args);
    };

    copyDir = (...args: Parameters<typeof copyDir>) => {
        this.log("Copying directory: " + args[0]);
        copyDir(...args);
    };
}
