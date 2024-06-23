import { authentication } from "@directus/sdk";
import { createDefaultDirectusInstance, directusUrl } from "./share";

if ((process.env as any).NEXT_RUNTIME! === "edge") {
  throw new Error("The module is not compatible with the runtime");
}

export const createDirectusInstance = (url: string) => {
  const directusInstance = createDefaultDirectusInstance(url);
  return directusInstance.with(
    authentication("cookie", {
      credentials: "include",
      autoRefresh: true,
    }),
  );
};

export const createDirectusWithDefaultUrl = () => {
  return createDirectusInstance(directusUrl!);
};

const directus = createDirectusWithDefaultUrl();

export default directus;
