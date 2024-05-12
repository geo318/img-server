import { z } from 'zod'

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(
    /[!@#$%^&*(),.?":{}|<>]/,
    'Password must contain at least one special character'
  )

const MAX_SIZE = 10 * 1024 * 1024
const MIME_TYPES = [
  'image/jpg',
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/svg+xml',
]

export const imgSchemaArray = z
  .custom<Express.Multer.File[]>()
  .refine(
    (files: Express.Multer.File[]) => files?.length,
    'It must be an array of files'
  )
  .refine((files) => files.length <= 10, 'You can only upload up to 10 images')
  .refine(
    (files) => files.every((file) => file.size <= MAX_SIZE),
    'Image must be less than 10mb'
  )
  .refine(
    (files) => files.every((file) => MIME_TYPES.includes(file.mimetype)),
    `Image type must be jpg, jpeg, png, webp or svg`
  )

export const secretSchema = z.string().min(16).max(16)
