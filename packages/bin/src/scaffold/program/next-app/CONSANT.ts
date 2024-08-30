import path from "path";
export const locations = {
    root: path.resolve(__dirname, "../../../../../../"),
    apps: path.resolve(__dirname, "../../../../../../apps"),
    templates: path.resolve(__dirname, "../../template/next-app"),
} as const
