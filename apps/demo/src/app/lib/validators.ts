import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
})

export const dataRowSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200, 'Name must be less than 200 characters'),
  status: z.enum(['active', 'inactive', 'pending']),
  category: z
    .string()
    .min(1, 'Category is required')
    .max(50, 'Category must be less than 50 characters'),
  value: z.number().min(0, 'Value must be positive'),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
  tags: z.array(z.string().max(30)).max(10, 'Maximum 10 tags allowed').optional(),
})

export const profileSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  email: z.string().email('Invalid email address'),
  avatar: z.string().url('Invalid URL').optional().or(z.literal('')),
})

export const passwordChangeSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

export type LoginFormData = z.infer<typeof loginSchema>
export type DataRowFormData = z.infer<typeof dataRowSchema>
export type ProfileFormData = z.infer<typeof profileSchema>
export type PasswordChangeFormData = z.infer<typeof passwordChangeSchema>
