import { z } from 'zod'
import crypto from 'crypto'

export const insertApiTokenSchema = z.object({
  name: z.string(),
  user_id: z.coerce.number(),
  secret: z.string().nullish().default(crypto.randomBytes(8).toString('hex')),
})
