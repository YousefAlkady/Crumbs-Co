import { z } from "zod";

/** Strips HTML tags to prevent XSS. Returns plain text only. */
function sanitizeDescription(val: string): string {
  return val.replace(/<[^>]*>/g, "").trim();
}

export const productEditSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z
    .string()
    .transform(sanitizeDescription),
  price: z
    .union([z.number(), z.string()])
    .transform((val) => (typeof val === "string" ? parseFloat(val) : val))
    .refine((n) => !isNaN(n), "Please enter a valid number for price")
    .refine((n) => n > 0, "Price must be greater than 0"),
  is_favorite: z.boolean(),
});

export type ProductEditInput = z.infer<typeof productEditSchema>;
