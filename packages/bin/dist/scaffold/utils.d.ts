export declare const copyFile: <T>(src: string, dest: string, opts?: {
    context?: T;
    createDirIfNot?: boolean;
    contentTransform?: (content: string) => string;
}) => void;
export declare const copyFiles: (...copyFileParams: Parameters<typeof copyFile>[]) => void;
export declare const copyDir: <T>(src: string, dest: string, opts?: {
    context?: T | ((fileName: string) => T);
    createDirIfNot?: boolean;
    contentTransform?: (content: string) => string;
    fileNameTransform?: (file: string) => string;
    asToCopyy?: (path: string, type: "directory" | "file", ctx: {
        file: string;
        src: string;
        dest: string;
    }) => boolean;
}) => void;
export default class Utils {
    private opts;
    constructor(opts: {
        logging?: boolean;
    });
    log(...args: Parameters<typeof console.log>): void;
    copyFile: (src: string, dest: string, opts?: {
        context?: unknown;
        createDirIfNot?: boolean;
        contentTransform?: (content: string) => string;
    } | undefined) => void;
    copyFiles: (...args: Parameters<typeof copyFiles>) => void;
    copyDir: (src: string, dest: string, opts?: {
        context?: unknown;
        createDirIfNot?: boolean;
        contentTransform?: (content: string) => string;
        fileNameTransform?: (file: string) => string;
        asToCopyy?: (path: string, type: "directory" | "file", ctx: {
            file: string;
            src: string;
            dest: string;
        }) => boolean;
    } | undefined) => void;
}
//# sourceMappingURL=utils.d.ts.map