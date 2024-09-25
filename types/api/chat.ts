import z from "zod";
import { Chat, Message } from "../database";
import { extraInfoSchema } from "../interseed/chat";

const ChatGetInputSchema = z.object({
    chatId: z.string(),
});

export type ChatGetInput = z.infer<typeof ChatGetInputSchema>;

const ChatGetOutSchema = z.object({
    chat: z.custom<Chat>(),
    messages: z.array(z.custom<Message>()),
});


export type ChatGetOut = z.infer<typeof ChatGetOutSchema>;

const ChatSendInSchema = z.object({
    message: z.string(),
    extraInfo: extraInfoSchema.optional(),
});

export type ChatSendIn = z.infer<typeof ChatSendInSchema>;

const ChatSendOutSchema = z.object({
    chat: z.custom<Chat>(),
    messages: z.array(z.custom<Message>()),
});

export type ChatSendOut = z.infer<typeof ChatSendOutSchema>;

export const schemas = {
    ChatGetInputSchema,
    ChatGetOutSchema,
    ChatSendInSchema,
    ChatSendOutSchema,
};