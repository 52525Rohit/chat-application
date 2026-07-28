import { z } from "zod";

export const sendMessageSchema = z.object({
  receiver_id: z.coerce.number().int().positive("receiver_id is required"),
  message_content: z.string().trim().max(5000).optional().or(z.literal("")),
});

export const editMessageSchema = z.object({
  message_content: z.string().trim().min(1, "message_content is required").max(5000),
});
