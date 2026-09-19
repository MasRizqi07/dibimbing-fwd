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
  // Anti-spam render timestamp (in ms - legacy fallback)
  renderTime: z.number().optional(),
  // Server-issued anti-spam token
  antiSpamToken: z.string().optional(),
  // Client-generated idempotency key
  idempotencyKey: z.string().max(64).optional(),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
