import { relations } from 'drizzle-orm'
import { user, img, api } from './schema'

export const userRelations = relations(user, ({ many }) => ({
  posts: many(img),
  apis: many(api),
}))

export const imgRelations = relations(img, ({ one }) => ({
  user: one(user, {
    fields: [img.user_id],
    references: [user.id],
  }),
}))

export const apiRelations = relations(api, ({ one }) => ({
  api: one(user, {
    fields: [api.user_id],
    references: [user.id],
  }),
}))