import { changePasswordSchema, createMeetingSchema, loginSchema, makePaymentSchema, registerSchema, resetPasswordSchema, updateDueStatusSchema, updateMeetingSchema, updateMemberSchema } from "@/lib/validations";
import z from "zod";

// Type exports
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type CreateMeetingInput = z.infer<typeof createMeetingSchema>;
export type UpdateMeetingInput = z.infer<typeof updateMeetingSchema>;
export type MakePaymentInput = z.infer<typeof makePaymentSchema>;
export type UpdateDueStatusInput = z.infer<typeof updateDueStatusSchema>;
export type UpdateMemberInput = z.infer<typeof updateMemberSchema>;