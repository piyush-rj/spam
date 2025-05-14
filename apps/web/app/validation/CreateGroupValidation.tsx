import { z } from "zod"

export const CreateGroupSchema = z.object({
    title: z.string().min(3, {message: "Title must be minimum 3 characters long"}).max(191, {message: "Title must not exceed 191 characters"}),
    passcode: z.string().min(4, {message: "Passcode must be minimum 4 characters long"}).max(25, {message: "Passcode must not exceed 25 characters"})
}).required()


export type createGroupSchema = z.infer<typeof CreateGroupSchema>