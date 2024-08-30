import * as fs from "fs";
import nunjucks from "nunjucks";
import path from "path";
export const copyFile = <T>(src: string, dest: string, opts?: { context?: T; createDirIfNot?: boolean; contentTransform?: (content: string) => string }) => {
    if ((opts?.createDirIfNot ?? true) && !fs.existsSync(path.resolve(dest, "../"))) {
        console.log("Creating directory: " + path.resolve(dest, "../"));
        fs.mkdirSync(path.resolve(dest, "../"), { recursive: true });
    }
    console.log("Copying file: " + src + " to " + dest);
    const content = opts?.contentTransform ? opts?.contentTransform(fs.readFileSync(src, "utf-8")) : fs.readFileSync(src, "utf-8");
    fs.writeFileSync(dest, nunjucks.renderString(content, opts?.context ?? {}));
};

export const copyFiles = (...copyFileParams: Parameters<typeof copyFile>[]) => {
    for (const param of copyFileParams) {
        copyFile(...param);
    }
};

export const copyDir = <T>(
    src: string,
    dest: string,
    opts?: {
        context?: T | ((fileName: string) => T);
        createDirIfNot?: boolean;
        contentTransform?: (content: string) => string;
        fileNameTransform?: (file: string) => string;
        asToCopyy?: (
            path: string,
            type: "directory" | "file",
            ctx: {
                file: string;
                src: string;
                dest: string;
            }
        ) => boolean;
    }
) => {
    const rec = (newSrc: string, newDest: string) => {
        const path = newSrc.replace(src, "");
        console.log('newSrc', newSrc);
        console.log('newDest', newDest);
        if (!fs.existsSync(newDest)) {
            console.log('Creating directory: ' + newDest);
            fs.mkdirSync(newDest, { recursive: true });
        }
        const files = fs.readdirSync(newSrc);
        for (const file of files) {
            const current = fs.lstatSync(`${newSrc}/${file}`);
            if (current.isDirectory()) {
                if (opts?.asToCopyy && !opts.asToCopyy(`${path}/${file}`, "directory", { file, src: `${newSrc}/${file}`, dest: `${newDest}/${file}` })) {
                    continue;
                }
                rec(`${newSrc}/${file}`, `${newDest}/${file}`);
            } else if (current.isSymbolicLink()) {
                if (opts?.asToCopyy && !opts.asToCopyy(`${path}/${file}`, "file", { file, src: `${newSrc}/${file}`, dest: `${newDest}/${file}` })) {
                    continue;
                }
                const symlink = fs.readlinkSync(`${newSrc}/${file}`);
                fs.symlinkSync(symlink, `${newDest}/${file}`);
            } else {
                if (opts?.asToCopyy && !opts.asToCopyy(`${path}/${file}`, "file", { file, src: `${newSrc}/${file}`, dest: `${newDest}/${file}` })) {
                    continue;
                }
                const destFile = `${newDest}/${opts?.fileNameTransform ? opts.fileNameTransform(file) : file}`;
                const context = opts?.context;
                copyFile(`${newSrc}/${file}`, destFile, {
                    ...opts,
                    context: context instanceof Function ? context(file) : context
                });
            }
        }
    }
    
    console.log('dest', dest)
    
    return rec(src, dest);
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
