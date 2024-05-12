import { serial, text, pgTable, integer, json } from 'drizzle-orm/pg-core'

export const user = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull().unique(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  phone: integer('phone'),
  folder: text('folder').notNull(),
})

export const image = pgTable('images', {
  id: serial('id').primaryKey(),
  alt: text('name').notNull(),
  url: text('url'),
  user_id: integer('user_id')
    .references(() => user.id)
    .notNull(),
  folder: text('folder'),
  views: integer('views').default(0),
  paths: json('paths').notNull(),
})

export const api = pgTable('apis', {
  id: serial('id').primaryKey(),
  secret: text('secret').notNull().unique(),
  name: text('name').notNull(),
  user_id: integer('user_id')
    .references(() => user.id)
    .notNull(),
})
