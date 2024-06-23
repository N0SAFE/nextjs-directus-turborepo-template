import { ApiCollections } from "@/types/api-collection";
import { createDirectus, graphql, realtime, rest } from "@directus/sdk";

export const createDefaultDirectusInstance = (url: string) => {
  return createDirectus<ApiCollections>(url)
    .with(
      rest({
        credentials: "include",
        onRequest: (options) => ({ ...options, cache: "no-store" }),
      }),
    )
    .with(realtime())
    .with(graphql({ credentials: "include" }));
};

export const directusUrl = (process.env as any).NEXT_PUBLIC_API_URL!;
