import { relations } from 'drizzle-orm'
import { user, img } from './schema'

export const userRelations = relations(user, ({ many }) => ({
  posts: many(img),
}))

export const imgRelations = relations(img, ({ one }) => ({
  user: one(user, {
    fields: [img.user_id],
    references: [user.id],
  }),
}))
