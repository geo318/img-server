import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from './schema'
import * as relations from './relations'
import env from '/env'

const connection = new Pool({
  host: env.DB_HOST,
  port: Number(env.DB_PORT),
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
})

const db = drizzle(connection, { schema: { ...schema, ...relations } })
export { db, connection }
export * from './schema'
export * from './relations'
