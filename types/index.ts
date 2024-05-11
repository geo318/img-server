import { type InferSelectModel } from 'drizzle-orm'
import { user } from '/db'

export type User = InferSelectModel<typeof user>
