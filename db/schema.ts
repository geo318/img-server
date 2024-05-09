import { serial, text, pgTable, integer } from 'drizzle-orm/pg-core'

export const user = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull().unique(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  phone: integer('phone'),
  folder: text('folder').notNull(),
})

export const img = pgTable('images', {
  id: serial('id').primaryKey(),
  alt: text('name').notNull(),
  url: text('url').notNull(),
  user_id: integer('user_id')
    .references(() => user.id)
    .notNull(),
  folder: text('folder').notNull(),
})

export const api = pgTable('apis', {
  id: serial('id').primaryKey(),
  secret: text('secret').notNull().unique(),
  name: text('name').notNull(),
  user_id: integer('user_id')
    .references(() => user.id)
    .notNull(),
})
