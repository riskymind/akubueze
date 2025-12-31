import {z} from "zod"
import { Role } from "./generated/prisma/enums"

// Auth schema
export const loginSchema = z.object({
    email: z.email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters.")
})

const roles = ["MEMBER", "ADMIN", "FINANCIAL_SECRETARY"] as const

export const registerSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.email("Invalid email address"),
    phone: z.string().optional(),
    password: z.string().min(6, "Password must be at least 6 characters."),
    role: z.enum(roles).optional(),
    image: z.string().optional()
})

// export const resetPasswordSchema = z.object({
//     email: z.email("Invalid email address"),
//     newPassword: z.string().min(6, "Password must be at least 6 characters"),
//     token: z.string().optional()
// })

export const changePasswordSchema = z.object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data)=> data.newPassword === data.confirmPassword,  {
    message: "Passwords do not match",
    path: ["confirmPassword"]
})

export const resetPasswordSchema = z.object({
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});


// Schema for updating the user profile
export const updateProfileSchema = z.object({
  name: z.string().min(3, 'Name must be at leaast 3 characters'),
  email: z.string().min(3, 'Email must be at leaast 3 characters'),
  image: z.string().optional(),
});

// Schema to update users
export const updateUserSchema = updateProfileSchema.extend({
  id: z.string().min(1, 'ID is required'),
  role: z.enum(Role)
});

// Meeting Schemas
export const createMeetingSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    date: z.string().refine((date)=> {
        const meetingDate = new Date(date)
        return !isNaN(meetingDate.getTime())
    }, "Invalid date format"),
    venue: z.string(),
    description: z.string(),
    hostId: z.string().min(1, "Host is required")
})


export const updateMeetingSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').optional(),
  date: z.string().refine((date) => {
    const meetingDate = new Date(date);
    return !isNaN(meetingDate.getTime());
  }, 'Invalid date format').optional(),
  venue: z.string().optional(),
  description: z.string().optional(),
  hostId: z.string().optional(),
});

// Payment Schemas
export const makePaymentSchema = z.object({
  dueId: z.string().min(1, 'Due ID is required'),
  amount: z.number().positive('Amount must be positive'),
  paymentMethod: z.string().optional(),
  reference: z.string().optional(),
});

export const verifyPaymentSchema = z.object({
  paymentId: z.string().min(1, 'Payment ID is required'),
});

const dues_status = ['PENDING', 'PAID', 'OVERDUE'] as const

// Due Schemas
export const updateDueStatusSchema = z.object({
  dueId: z.string().min(1, 'Due ID is required'),
  status: z.enum(dues_status),
});

// Member Schemas
export const updateMemberSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  phone: z.string().optional(),
  role: z.enum(['MEMBER', 'ADMIN', 'FINANCIAL_SECRETARY']).optional(),
});
