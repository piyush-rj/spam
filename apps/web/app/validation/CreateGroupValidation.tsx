import { z } from "zod";

// Base schema with common fields
const BaseGroupSchema = z.object({
  title: z.string().min(3, "Group name must be at least 3 characters long").max(50, "Group name cannot exceed 50 characters"),
});

// Schema for public groups
export const PublicGroupSchema = BaseGroupSchema;

// Schema for private groups
export const PrivateGroupSchema = BaseGroupSchema.extend({
  passcode: z.string().min(4, "Password must be at least 4 characters long"),
});

// Combined schema that checks type first and then validates accordingly
export const CreateGroupSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("PUBLIC"),
    title: z.string().min(3, "Group name must be at least 3 characters long").max(50, "Group name cannot exceed 50 characters"),
  }),
  z.object({
    type: z.literal("PRIVATE"),
    title: z.string().min(3, "Group name must be at least 3 characters long").max(50, "Group name cannot exceed 50 characters"),
    passcode: z.string().min(4, "Password must be at least 4 characters long"),
  }),
]);

// Helper function to validate based on group type
export const validateGroup = (data: { 
  title: string; 
  type: "PUBLIC" | "PRIVATE";
  passcode?: string;
}) => {
  if (data.type === "PUBLIC") {
    return {
      type: "PUBLIC" as const,
      validation: PublicGroupSchema.safeParse({ title: data.title })
    };
  } else {
    return {
      type: "PRIVATE" as const,
      validation: PrivateGroupSchema.safeParse({ 
        title: data.title,
        passcode: data.passcode || ""
      })
    };
  }
};