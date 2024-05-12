import { z } from 'zod'
import { user } from '/db'
import { passwordSchema } from './shared'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import crypto from 'crypto'

export * from './shared'

export const insertApiTokenSchema = z.object({
  name: z.string(),
  secret: z.string().nullish().default(crypto.randomBytes(8).toString('hex')),
})

export const userSchema = createInsertSchema(user, {
  name: z.string().regex(/^[a-zA-Z0-9_-\s]{3,30}$/, 'Invalid username'),
  email: z.string().email(),
  password: passwordSchema,
  folder: z.string().optional(),
})

export const selectUserSchema = createSelectSchema(user)
