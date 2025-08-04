import z from "zod/v4";

export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.email(),
  emailVerified: z.boolean(),
  image: z.string().nullable(),
  status: z.enum(["active", "inactive", "pending"]),
  createdAt: z.iso.datetime().transform(date => new Date(date)),
  updatedAt: z.iso.datetime().transform(date => new Date(date)),
});
