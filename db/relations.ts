import { relations } from 'drizzle-orm'
import { user, image, api } from './schema'

export const userRelations = relations(user, ({ many }) => ({
  images: many(image),
  apis: many(api),
}))

export const imgRelations = relations(image, ({ one }) => ({
  user: one(user, {
    fields: [image.user_id],
    references: [user.id],
  }),
}))

export const apiRelations = relations(api, ({ one }) => ({
  user: one(user, {
    fields: [api.user_id],
    references: [user.id],
  }),
}))