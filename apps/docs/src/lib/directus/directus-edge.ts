import { authentication } from "@directus/sdk";
import { createDefaultDirectusInstance, directusUrl } from "./share";

export const createDirectusEdge = (url: string) => {
  const directusInstance = createDefaultDirectusInstance(url);
  return directusInstance.with(
    authentication("cookie", {
      credentials: "include",
      autoRefresh: true,
    }),
  );
};

export const createDirectusEdgeWithDefaultUrl = () => {
  return createDirectusEdge(directusUrl!);
};
