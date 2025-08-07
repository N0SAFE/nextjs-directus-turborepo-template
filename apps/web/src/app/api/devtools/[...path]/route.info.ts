import { z } from "zod";

export const Route = {
  name: "ApiDevtoolsPath",
  params: z.object({
    path: z.string().array(),
  })
};

