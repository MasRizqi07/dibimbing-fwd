import { z } from "zod";

export const contactFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: "Nama minimal 2 karakter." })
    .max(100, { message: "Nama maksimal 100 karakter." }),
  email: z
    .string()
    .trim()
    .email({ message: "Format email tidak valid." })
    .max(255, { message: "Email terlalu panjang." }),
  message: z
    .string()
    .trim()
    .min(10, { message: "Pesan minimal 10 karakter." })
    .max(2000, { message: "Pesan maksimal 2000 karakter." }),
  // Anti-spam honeypot (should remain empty for humans)
  honeypot: z.string().max(0, { message: "Bot submission detected." }).optional().or(z.literal("")),
  // Anti-spam render timestamp (in ms)
  renderTime: z.number().optional(),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
